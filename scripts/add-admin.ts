
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Adding John Obia as admin user...');

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'john.obia@saged.edu' }
    });

    if (existingUser) {
      console.log('✅ John Obia already exists as admin user');
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`👤 Role: ${existingUser.role}`);
      return;
    }

    // Create John Obia as admin user
    const hashedPassword = await bcryptjs.hash('founder2024!', 12);
    const adminUser = await prisma.user.create({
      data: {
        email: 'john.obia@saged.edu',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Obia',
        name: 'John Obia',
        role: 'ADMIN',
        bio: 'Founder & CEO of SAGED. Visionary entrepreneur and AI strategist passionate about democratizing AI education across Africa and connecting diaspora communities.',
        institution: 'SAGED University'
      }
    });

    console.log('✅ Successfully created John Obia as admin user!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: founder2024!`);
    console.log(`👤 Role: ${adminUser.role}`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
