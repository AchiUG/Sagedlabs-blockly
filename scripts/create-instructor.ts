
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create instructor user
    const hashedPassword = await bcrypt.hash('Instructor123!', 10);
    
    const instructor = await prisma.user.create({
      data: {
        email: 'instructor@sagedlabs.com',
        password: hashedPassword,
        name: 'Dr. Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'INSTRUCTOR',
        bio: 'Experienced AI educator and researcher with over 10 years of teaching experience. Passionate about Afrocentric AI education and community building.',
        institution: 'SAGED Learning Academy',
        onboardingCompleted: true,
        subscriptionTier: 'pro',
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
    });

    console.log('✅ Instructor account created successfully!');
    console.log('\n📧 Email: instructor@sagedlabs.com');
    console.log('🔑 Password: Instructor123!');
    console.log(`👤 Name: Dr. Sarah Johnson`);
    console.log(`🆔 ID: ${instructor.id}`);
    console.log(`📚 Role: ${instructor.role}`);
    console.log('\n✨ This instructor can now manage courses through the admin panel.');
  } catch (error: any) {
    console.error('❌ Error creating instructor:', error);
    if (error.code === 'P2002') {
      console.log('\n⚠️  Instructor account already exists with this email.');
      
      // Try to fetch the existing instructor
      const existingInstructor = await prisma.user.findUnique({
        where: { email: 'instructor@sagedlabs.com' },
      });
      
      if (existingInstructor) {
        console.log('\n📧 Email: instructor@sagedlabs.com');
        console.log('🔑 Password: Instructor123!');
        console.log(`👤 Name: ${existingInstructor.name}`);
        console.log(`🆔 ID: ${existingInstructor.id}`);
        console.log(`📚 Role: ${existingInstructor.role}`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
