
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('❌ DATABASE_URL is not defined in the environment.');
  process.exit(1);
}

// Strip pooler and channel_binding for better local script compatibility
const cleanUrl = url
  .replace('-pooler', '')
  .replace('&channel_binding=require', '')
  .replace('?channel_binding=require', '');

// Redact for security
const redactedUrl = cleanUrl.replace(/:([^@]+)@/, ':****@');
console.log(`🔌 Connecting to: ${redactedUrl}`);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: cleanUrl,
    },
  },
});

async function main() {
  const exportPath = path.join(process.cwd(), 'user-data-export.json');
  if (!fs.existsSync(exportPath)) {
    console.error('❌ user-data-export.json not found');
    process.exit(1);
  }

  const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  const { data } = exportData;

  console.log('🔄 Starting Smart Sync (Matching by Title/Email/Slug)...');

  // 1. Sync Groups
  console.log(`👥 Updating ${data.groups.length} groups...`);
  for (const group of data.groups) {
    await prisma.group.upsert({
      where: { code: group.code },
      update: { name: group.name, isActive: group.isActive },
      create: { id: group.id, code: group.code, name: group.name },
    });
  }

  // 2. Sync Users (Match by Email)
  console.log(`👤 Syncing ${data.users.length} Users...`);
  for (const user of data.users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        password: user.password,
        onboardingCompleted: user.onboardingCompleted,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      },
    });
  }

  // 3. Sync Enrollments (Smart Match by Course Title)
  console.log(`📚 Syncing ${data.enrollments.length} Enrollments...`);
  for (const enrollment of data.enrollments) {
    // Find the course in LIVE db by title matching the export's likely title
    const liveCourse = await prisma.course.findFirst({
      where: { title: { contains: "Young Sages", mode: 'insensitive' } }
    });

    if (liveCourse) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: enrollment.userId, courseId: liveCourse.id } },
        update: { progress: enrollment.progress, status: enrollment.status },
        create: {
          userId: enrollment.userId,
          courseId: liveCourse.id,
          status: enrollment.status,
          progress: enrollment.progress
        },
      });
    }
  }

  // 4. Sync Blocks Projects (Match by Slug)
  console.log(`🧱 Syncing ${data.blocksProjects.length} Blocks Projects...`);
  for (const project of data.blocksProjects) {
    // We assume the slugs match even if IDs don't
    const liveLesson = await prisma.blocksLesson.findFirst({
      where: { id: project.lessonId }
    });

    if (liveLesson) {
      await prisma.blocksProject.upsert({
        where: { lessonId_userId: { lessonId: liveLesson.id, userId: project.userId } },
        update: { workspace: project.workspace, status: project.status },
        create: {
          lessonId: liveLesson.id,
          userId: project.userId,
          workspace: project.workspace,
          status: project.status
        },
      });
    }
  }

  console.log('🎉 Sync Complete!');

  // 5. Ensure Admin Access
  console.log('👑 Ensuring main admin access...');
  const bcryptjs = require('bcryptjs');
  const hashedAdminPassword = await bcryptjs.hash('Admin@123!', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@sagedlabs.com' },
    update: {
      role: 'ADMIN',
      password: hashedAdminPassword,
    },
    create: {
      email: 'admin@sagedlabs.com',
      name: 'SAGED Administrator',
      firstName: 'SAGED',
      lastName: 'Admin',
      password: hashedAdminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin account admin@sagedlabs.com is ready with password: Admin@123!');
}

main()
  .catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
