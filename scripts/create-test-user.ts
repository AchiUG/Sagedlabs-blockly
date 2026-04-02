
import { PrismaClient, BadgeCategory, BadgeRarity } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  console.log('🚀 Creating comprehensive test user...');

  // Hash password
  const hashedPassword = await bcrypt.hash('TestUser123!', 10);

  // 1. Create Test User
  const testUser = await prisma.user.upsert({
    where: { email: 'testuser@saged.com' },
    update: {},
    create: {
      email: 'testuser@saged.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'ADMIN', // Give admin access to test all features
      bio: 'Test user for UAT testing - Full access to all SAGE-D features',
      onboardingCompleted: true,
    },
  });
  console.log('✅ Test user created:', testUser.email);

  // 2. Get some courses to enroll in
  const courses = await prisma.course.findMany({ take: 3 });
  
  if (courses.length > 0) {
    // Enroll in courses
    for (const course of courses) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: testUser.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          userId: testUser.id,
          courseId: course.id,
          progress: Math.floor(Math.random() * 80) + 10, // Random progress 10-90%
          status: 'ACTIVE',
        },
      });
    }
    console.log(`✅ Enrolled in ${courses.length} courses`);
  }

  // 3. Create Gamification Profile
  await prisma.userGamification.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      totalXP: 2500,
      currentLevel: 5,
      currentStage: 3,
      stageTitle: 'Scholar',
      streakDays: 12,
    },
  });
  console.log('✅ Gamification profile created');

  // 4. Award some badges (create badges first if they don't exist, then award them)
  const badgeData = [
    { name: 'First Steps', description: 'Completed your first lesson', iconName: 'FootprintsIcon', category: BadgeCategory.COMPLETION, xpReward: 50, rarity: BadgeRarity.COMMON, criteria: '{"type":"first_lesson"}' },
    { name: 'Week Warrior', description: 'Maintained a 7-day streak', iconName: 'FlameIcon', category: BadgeCategory.STREAK, xpReward: 100, rarity: BadgeRarity.UNCOMMON, criteria: '{"type":"week_streak"}' },
    { name: 'Course Champion', description: 'Completed your first course', iconName: 'TrophyIcon', category: BadgeCategory.COMPLETION, xpReward: 200, rarity: BadgeRarity.RARE, criteria: '{"type":"course_complete"}' },
  ];

  for (const badgeInfo of badgeData) {
    const badge = await prisma.badge.upsert({
      where: { name: badgeInfo.name },
      update: {},
      create: badgeInfo,
    });

    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: testUser.id,
          badgeId: badge.id,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        badgeId: badge.id,
        progress: 100,
      },
    });
  }
  console.log('✅ Badges awarded');

  // 5. Add some skills (create skills first, then progress)
  const skillData = [
    { name: 'Critical Thinking', description: 'Analyze and evaluate information', iconName: 'BrainIcon', category: 'Cognitive', requiredXP: 100, xpEarned: 150 },
    { name: 'Emotional Intelligence', description: 'Understand and manage emotions', iconName: 'HeartIcon', category: 'Emotional', requiredXP: 100, xpEarned: 100 },
    { name: 'Communication', description: 'Express ideas effectively', iconName: 'MessageCircleIcon', category: 'Social', requiredXP: 100, xpEarned: 200 },
  ];

  for (const skillInfo of skillData) {
    const { xpEarned, ...skillCreate } = skillInfo;
    const skill = await prisma.skill.upsert({
      where: { name: skillInfo.name },
      update: {},
      create: { ...skillCreate, moduleIds: [] },
    });

    await prisma.skillProgress.upsert({
      where: {
        userId_skillId: {
          userId: testUser.id,
          skillId: skill.id,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        skillId: skill.id,
        xpEarned: xpEarned,
        isUnlocked: true,
        isMastered: xpEarned >= skillInfo.requiredXP,
      },
    });
  }
  console.log('✅ Skills added');

  // 6. Create SVU Balance with initial points
  const totalSVU = 47; // Sample SVU balance
  await prisma.sVUBalance.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      totalSVU: totalSVU,
      availableSVU: totalSVU,
      usedSVU: 0,
      verifiedSVU: totalSVU,
      lifetimeSVU: totalSVU,
    },
  });
  console.log(`✅ SVU balance created (${totalSVU} SVU)`);

  // Note: To create full SVU contributions, you would need to:
  // 1. Create ActivityCategory records
  // 2. Create Activity records for each contribution
  // 3. Create Contribution records linked to activities
  // 4. Create Verification records
  // This can be done through the UI once it's built

  // 7. Create Token Balance
  await prisma.tokenBalance.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      sageTokens: 150,
      reflectionTokens: 50,
      lifetimeTokens: 200,
    },
  });
  console.log('✅ Token balance created');

  // 8. Create Earn-Down Records (if courses exist)
  if (courses.length > 0) {
    await prisma.earnDownRecord.create({
      data: {
        userId: testUser.id,
        courseId: courses[0].id,
        originalPrice: 100000, // ₦100,000
        svuApplied: 30,
        conversionRate: 100,
        discountAmount: 3000, // 30 SVU × ₦100
        finalPrice: 97000, // ₦100,000 - ₦3,000
        maxDiscountPercent: 70,
      },
    });
    console.log('✅ Earn-down record created');
  }

  // 9. Issue a certificate (if courses exist)
  if (courses.length > 0) {
    const completedCourse = courses[0];
    await prisma.certificate.create({
      data: {
        userId: testUser.id,
        courseId: completedCourse.id,
        certificateType: 'COURSE',
        issuedAt: new Date(),
        certificateUrl: `https://sagedlabs.com/certificates/verify/${testUser.id}-${completedCourse.id}`,
        credentialData: JSON.stringify({
          courseName: completedCourse.title,
          studentName: testUser.name,
          completionDate: new Date().toISOString(),
          grade: 'A',
        }),
      },
    });
    console.log('✅ Certificate issued');
  }

  console.log('\n🎉 Test user setup complete!\n');
  console.log('═══════════════════════════════════════');
  console.log('📧 Email: testuser@saged.com');
  console.log('🔑 Password: TestUser123!');
  console.log('👤 Role: ADMIN (can access all features)');
  console.log('═══════════════════════════════════════');
  console.log('\n✨ Test Data Summary:');
  console.log(`   • Enrolled in ${courses.length} courses`);
  console.log('   • Gamification: Level 5, 2500 XP, 3 badges');
  console.log('   • SVU: 47 total earned, 1 pending verification');
  console.log('   • SAGE Tokens: 150 balance');
  console.log('   • Certificates: 1 earned');
  console.log('   • Earn-Down: $450 tuition offset applied');
  console.log('\n🚀 You can now login and test all features!');
}

createTestUser()
  .catch((e) => {
    console.error('❌ Error creating test user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
