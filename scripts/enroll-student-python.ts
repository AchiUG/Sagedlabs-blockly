import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const studentEmail = 'test@sagedlabs.com';
  const courseTitle = 'SAGED Python Fundamentals: Building a Data Analysis App';
  
  console.log(`Enrolling student ${studentEmail} in ${courseTitle}...\n`);

  // Find the student
  const student = await prisma.user.findUnique({
    where: { email: studentEmail }
  });

  if (!student) {
    throw new Error(`Student with email ${studentEmail} not found`);
  }

  console.log(`✓ Found student: ${student.name} (${student.email})`);

  // Find the course
  const course = await prisma.course.findFirst({
    where: {
      title: {
        contains: 'Python Fundamentals'
      }
    },
    include: {
      modules: {
        include: {
          lessons: true
        }
      }
    }
  });

  if (!course) {
    throw new Error('Python Fundamentals course not found');
  }

  console.log(`✓ Found course: ${course.title}`);
  console.log(`  - ${course.modules.length} modules`);
  console.log(`  - ${course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0)} lessons\n`);

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId: student.id,
      courseId: course.id
    }
  });

  if (existingEnrollment) {
    console.log('⚠ Student is already enrolled in this course!');
    console.log(`Enrollment ID: ${existingEnrollment.id}`);
    console.log(`Enrolled at: ${existingEnrollment.enrolledAt}`);
    console.log(`Progress: ${existingEnrollment.progress}%`);
    return;
  }

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
      progress: 0,
      enrolledAt: new Date()
    }
  });

  console.log('✓ Successfully enrolled student in course!');
  console.log(`Enrollment ID: ${enrollment.id}`);
  console.log(`Enrolled at: ${enrollment.enrolledAt}\n`);

  console.log('📚 Student can now access the course at:');
  console.log(`   /courses/${course.id}`);
  console.log(`   or via "My Learning" page\n`);

  console.log('👤 Student Login Credentials:');
  console.log(`   Email: ${studentEmail}`);
  console.log(`   (Use existing password for this test user)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
