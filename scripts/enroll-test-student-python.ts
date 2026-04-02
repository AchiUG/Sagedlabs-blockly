
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Find test student
    const testStudent = await prisma.user.findUnique({
      where: { email: 'test@sagedlabs.com' },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!testStudent) {
      console.error('❌ Test student not found. Please run create-student-tester.ts first.');
      return;
    }

    // Find Python Fundamentals course
    const pythonCourse = await prisma.course.findFirst({
      where: {
        title: {
          contains: 'Python Fundamentals',
          mode: 'insensitive',
        },
      },
    });

    if (!pythonCourse) {
      console.error('❌ Python Fundamentals course not found. Please run create-python-course.ts first.');
      return;
    }

    // Check if already enrolled
    const existingEnrollment = testStudent.enrollments.find(
      (e) => e.courseId === pythonCourse.id
    );

    if (existingEnrollment) {
      console.log('✅ Test student is already enrolled in Python Fundamentals!');
      console.log(`📚 Course: ${pythonCourse.title}`);
      console.log(`🆔 Enrollment ID: ${existingEnrollment.id}`);
      return;
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: testStudent.id,
        courseId: pythonCourse.id,
        status: 'ACTIVE',
        progress: 0,
        enrolledAt: new Date(),
      },
    });

    console.log('✅ Test student enrolled in Python Fundamentals successfully!');
    console.log(`\n👤 Student: ${testStudent.name} (${testStudent.email})`);
    console.log(`📚 Course: ${pythonCourse.title}`);
    console.log(`🆔 Enrollment ID: ${enrollment.id}`);
    console.log(`📅 Enrolled At: ${enrollment.enrolledAt}`);
  } catch (error) {
    console.error('❌ Error enrolling test student:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
