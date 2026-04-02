
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

config();

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test student user enrolled in all courses...\n');

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'student@saged.com' }
  });

  if (existingUser) {
    console.log('❌ User student@saged.com already exists. Deleting and recreating...');
    await prisma.user.delete({
      where: { email: 'student@saged.com' }
    });
  }

  // Create student user
  const hashedPassword = await bcrypt.hash('Student123!', 10);
  
  const student = await prisma.user.create({
    data: {
      email: 'student@saged.com',
      name: 'Student Tester',
      password: hashedPassword,
      role: 'STUDENT',
      emailVerified: new Date(),
    }
  });

  console.log('✅ Created student user:', {
    id: student.id,
    email: student.email,
    name: student.name,
    role: student.role
  });

  // Get all courses
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
    }
  });

  console.log(`\n📚 Found ${courses.length} courses. Enrolling student in all...\n`);

  // Enroll in all courses
  for (const course of courses) {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id,
        status: 'ACTIVE',
        progress: 0,
      }
    });

    console.log(`✅ Enrolled in: ${course.title}`);
  }

  console.log('\n🎉 Test student created and enrolled in all courses!');
  console.log('\n📋 Login Credentials:');
  console.log('   Email: student@saged.com');
  console.log('   Password: Student123!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
