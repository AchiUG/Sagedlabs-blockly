
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating all course instructors to John Obia...');

  try {
    // Create or update John Obia as an instructor
    const instructorPassword = await bcryptjs.hash('johnobia123', 10);
    
    const johnObiaInstructor = await prisma.user.upsert({
      where: { email: 'john.obia@sagedlabs.com' },
      update: {
        name: 'John Obia',
        firstName: 'John',
        lastName: 'Obia',
        role: 'INSTRUCTOR',
        bio: 'Lead Instructor at SAGED Labs, expert in AI sovereignty and transformative education.',
        institution: 'SAGED Labs',
      },
      create: {
        email: 'john.obia@sagedlabs.com',
        name: 'John Obia',
        firstName: 'John',
        lastName: 'Obia',
        password: instructorPassword,
        role: 'INSTRUCTOR',
        emailVerified: new Date(),
        bio: 'Lead Instructor at SAGED Labs, expert in AI sovereignty and transformative education.',
        institution: 'SAGED Labs',
      },
    });

    console.log('✅ John Obia instructor account created/updated');

    // Update all courses to have John Obia as instructor
    const result = await prisma.course.updateMany({
      data: {
        instructorId: johnObiaInstructor.id,
      },
    });

    console.log(`✅ Updated ${result.count} courses to have John Obia as instructor`);
    
    // Verify the update
    const coursesCount = await prisma.course.count({
      where: {
        instructorId: johnObiaInstructor.id,
      },
    });

    console.log(`✅ Verified: ${coursesCount} courses now have John Obia as instructor`);
    
  } catch (error) {
    console.error('❌ Error updating instructors:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
