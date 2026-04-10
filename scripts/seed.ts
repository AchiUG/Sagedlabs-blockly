
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Run specialized seeders
  console.log('🏗️ Running specialized seeders...');
  try {
    execSync('pnpm tsx --require dotenv/config scripts/seed-blocks-lessons.ts', { stdio: 'inherit' });
    console.log('✅ Blocks lessons seeded');
  } catch (err) {
    console.warn('⚠️ Warning: seed-blocks-lessons.ts failed, continuing...');
  }

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sagedlabs.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123!';
  const hashedAdminPassword = await bcryptjs.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'SAGED Administrator',
      firstName: 'SAGED',
      lastName: 'Admin',
      password: hashedAdminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created:', adminEmail);

  // Create test user (existing)
  const testUserPassword = await bcryptjs.hash('johndoe123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      password: testUserPassword,
      role: 'STUDENT',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Test user created: john@doe.com');

  // Create instructor user
  const instructorPassword = await bcryptjs.hash('instructor123', 10);
  const instructorUser = await prisma.user.upsert({
    where: { email: 'instructor@sagedlabs.com' },
    update: {},
    create: {
      email: 'instructor@sagedlabs.com',
      name: 'Dr. Sarah Johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      password: instructorPassword,
      role: 'INSTRUCTOR',
      emailVerified: new Date(),
      bio: 'Expert in AI and Machine Learning with 15+ years of experience.',
      institution: 'SAGED Labs',
    },
  });

  console.log('✅ Instructor user created: instructor@sagedlabs.com');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Artificial Intelligence' },
      update: {},
      create: {
        name: 'Artificial Intelligence',
        description: 'Learn the fundamentals and advanced concepts of AI',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Machine Learning' },
      update: {},
      create: {
        name: 'Machine Learning',
        description: 'Master machine learning algorithms and applications',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Deep Learning' },
      update: {},
      create: {
        name: 'Deep Learning',
        description: 'Explore neural networks and deep learning architectures',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Natural Language Processing' },
      update: {},
      create: {
        name: 'Natural Language Processing',
        description: 'Process and analyze human language with AI',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create sample courses
  const course1 = await prisma.course.upsert({
    where: { id: 'intro-to-ai-001' },
    update: {},
    create: {
      id: 'intro-to-ai-001',
      title: 'Introduction to Artificial Intelligence',
      description: 'A comprehensive introduction to AI concepts, algorithms, and applications. This course covers the fundamentals of artificial intelligence, including search algorithms, knowledge representation, machine learning basics, and ethical considerations.',
      shortDescription: 'Learn AI fundamentals from scratch',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
      level: 'BEGINNER',
      duration: '8 weeks',
      price: 0,
      prerequisites: 'Basic programming knowledge',
      learningObjectives: [
        'Understand core AI concepts and terminology',
        'Implement basic search algorithms',
        'Apply machine learning fundamentals',
        'Explore AI ethics and societal impact',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: categories[0].id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'ml-foundations-001' },
    update: {},
    create: {
      id: 'ml-foundations-001',
      title: 'Machine Learning Foundations',
      description: 'Master the foundations of machine learning including supervised and unsupervised learning, model evaluation, and practical implementation techniques.',
      shortDescription: 'Build strong ML fundamentals',
      imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop',
      level: 'INTERMEDIATE',
      duration: '10 weeks',
      price: 0,
      prerequisites: 'Introduction to AI, Python programming',
      learningObjectives: [
        'Implement supervised learning algorithms',
        'Apply unsupervised learning techniques',
        'Evaluate and optimize ML models',
        'Deploy ML models in production',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: categories[1].id,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'deep-learning-001' },
    update: {},
    create: {
      id: 'deep-learning-001',
      title: 'Deep Learning Specialization',
      description: 'Dive deep into neural networks, CNNs, RNNs, and transformers. Learn to build and train state-of-the-art deep learning models.',
      shortDescription: 'Master neural networks and deep learning',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop',
      level: 'ADVANCED',
      duration: '12 weeks',
      price: 0,
      prerequisites: 'Machine Learning Foundations, Linear Algebra, Calculus',
      learningObjectives: [
        'Build and train deep neural networks',
        'Implement CNNs for computer vision',
        'Create RNNs and transformers for NLP',
        'Optimize deep learning models',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: categories[2].id,
    },
  });

  console.log('✅ Courses created');

  // Create modules and lessons for course 1
  const module1 = await prisma.module.create({
    data: {
      title: 'Introduction to AI',
      description: 'Overview of artificial intelligence and its applications',
      orderIndex: 1,
      courseId: course1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'What is Artificial Intelligence?',
      content: 'An introduction to the field of artificial intelligence, its history, and current applications.',
      duration: 45,
      orderIndex: 1,
      moduleId: module1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'AI in Everyday Life',
      content: 'Explore how AI is used in various industries and everyday applications.',
      duration: 30,
      orderIndex: 2,
      moduleId: module1.id,
    },
  });

  console.log('✅ Modules and lessons created');

  // Create enrollment for test user
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: testUser.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      courseId: course1.id,
      status: 'ACTIVE',
      progress: 25,
    },
  });

  console.log('✅ Test enrollment created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 Admin Account:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👨‍🎓 Student Account:');
  console.log('   Email: john@doe.com');
  console.log('   Password: johndoe123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👩‍🏫 Instructor Account:');
  console.log('   Email: instructor@sagedlabs.com');
  console.log('   Password: instructor123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
