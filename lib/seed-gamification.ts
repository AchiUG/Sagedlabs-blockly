
// Seed script for gamification data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INITIAL_BADGES = [
  // Completion Badges
  {
    name: 'First Steps',
    description: 'Complete your first lesson',
    iconName: 'Footprints',
    category: 'COMPLETION',
    xpReward: 50,
    rarity: 'COMMON',
    criteria: JSON.stringify({ type: 'lessons_completed', count: 1 })
  },
  {
    name: 'Knowledge Seeker',
    description: 'Complete 10 lessons',
    iconName: 'Book',
    category: 'COMPLETION',
    xpReward: 200,
    rarity: 'UNCOMMON',
    criteria: JSON.stringify({ type: 'lessons_completed', count: 10 })
  },
  {
    name: 'Module Master',
    description: 'Complete your first module',
    iconName: 'CheckCircle2',
    category: 'COMPLETION',
    xpReward: 300,
    rarity: 'UNCOMMON',
    criteria: JSON.stringify({ type: 'modules_completed', count: 1 })
  },
  {
    name: 'Course Conqueror',
    description: 'Complete an entire course',
    iconName: 'Award',
    category: 'COMPLETION',
    xpReward: 500,
    rarity: 'RARE',
    criteria: JSON.stringify({ type: 'courses_completed', count: 1 })
  },
  
  // Mastery Badges
  {
    name: 'Perfect Score',
    description: 'Score 100% on an assignment',
    iconName: 'Star',
    category: 'MASTERY',
    xpReward: 150,
    rarity: 'UNCOMMON',
    criteria: JSON.stringify({ type: 'perfect_assignment', count: 1 })
  },
  {
    name: 'Excellence',
    description: 'Maintain 90%+ average across 5 assignments',
    iconName: 'TrendingUp',
    category: 'MASTERY',
    xpReward: 400,
    rarity: 'RARE',
    criteria: JSON.stringify({ type: 'high_average', threshold: 90, count: 5 })
  },
  {
    name: 'Skill Virtuoso',
    description: 'Master 3 skills',
    iconName: 'Target',
    category: 'MASTERY',
    xpReward: 600,
    rarity: 'EPIC',
    criteria: JSON.stringify({ type: 'skills_mastered', count: 3 })
  },
  
  // Streak Badges
  {
    name: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak',
    iconName: 'Flame',
    category: 'STREAK',
    xpReward: 200,
    rarity: 'UNCOMMON',
    criteria: JSON.stringify({ type: 'streak_days', count: 7 })
  },
  {
    name: 'Dedication',
    description: 'Maintain a 30-day learning streak',
    iconName: 'Zap',
    category: 'STREAK',
    xpReward: 500,
    rarity: 'RARE',
    criteria: JSON.stringify({ type: 'streak_days', count: 30 })
  },
  {
    name: 'Unstoppable',
    description: 'Maintain a 100-day learning streak',
    iconName: 'Sparkles',
    category: 'STREAK',
    xpReward: 1000,
    rarity: 'LEGENDARY',
    criteria: JSON.stringify({ type: 'streak_days', count: 100 })
  },
  
  // Community Badges
  {
    name: 'Helpful Hand',
    description: 'Help 5 peers in the community',
    iconName: 'Heart',
    category: 'COMMUNITY',
    xpReward: 250,
    rarity: 'UNCOMMON',
    criteria: JSON.stringify({ type: 'peer_help', count: 5 })
  },
  {
    name: 'Discussion Leader',
    description: 'Create 10 meaningful forum posts',
    iconName: 'MessageSquare',
    category: 'COMMUNITY',
    xpReward: 300,
    rarity: 'RARE',
    criteria: JSON.stringify({ type: 'forum_posts', count: 10 })
  },
  
  // Milestone Badges
  {
    name: 'Rising Star',
    description: 'Reach Level 5',
    iconName: 'Rocket',
    category: 'MILESTONE',
    xpReward: 250,
    rarity: 'UNCOMMON',
    criteria: JSON.stringify({ type: 'level_reached', level: 5 })
  },
  {
    name: 'Veteran Learner',
    description: 'Reach Level 10',
    iconName: 'Trophy',
    category: 'MILESTONE',
    xpReward: 500,
    rarity: 'RARE',
    criteria: JSON.stringify({ type: 'level_reached', level: 10 })
  },
  {
    name: 'Elite Scholar',
    description: 'Reach Level 20',
    iconName: 'Crown',
    category: 'MILESTONE',
    xpReward: 1000,
    rarity: 'EPIC',
    criteria: JSON.stringify({ type: 'level_reached', level: 20 })
  },
  
  // Capstone Badges
  {
    name: 'Capstone Champion',
    description: 'Complete your first capstone challenge',
    iconName: 'Gem',
    category: 'CAPSTONE',
    xpReward: 1000,
    rarity: 'EPIC',
    criteria: JSON.stringify({ type: 'capstone_completed', count: 1 })
  },
  
  // Stage Progression Badges
  {
    name: 'Seeker Initiate',
    description: 'Begin your journey as a Seeker',
    iconName: 'Search',
    category: 'SPECIAL',
    xpReward: 0,
    rarity: 'COMMON',
    criteria: JSON.stringify({ type: 'stage_reached', stage: 1 })
  },
  {
    name: 'Apprentice Rising',
    description: 'Ascend to Apprentice',
    iconName: 'BookOpen',
    category: 'SPECIAL',
    xpReward: 500,
    rarity: 'UNCOMMON',
    criteria: JSON.stringify({ type: 'stage_reached', stage: 2 })
  },
  {
    name: 'Cultivator Awakened',
    description: 'Reach Cultivator status',
    iconName: 'Users',
    category: 'SPECIAL',
    xpReward: 800,
    rarity: 'RARE',
    criteria: JSON.stringify({ type: 'stage_reached', stage: 3 })
  },
  {
    name: 'Griot-Scholar Honored',
    description: 'Become a Griot-Scholar',
    iconName: 'BookMarked',
    category: 'SPECIAL',
    xpReward: 1200,
    rarity: 'EPIC',
    criteria: JSON.stringify({ type: 'stage_reached', stage: 4 })
  },
  {
    name: 'Architect Ascended',
    description: 'Rise to Architect',
    iconName: 'Building',
    category: 'SPECIAL',
    xpReward: 2000,
    rarity: 'EPIC',
    criteria: JSON.stringify({ type: 'stage_reached', stage: 5 })
  },
  {
    name: 'Guardian Anointed',
    description: 'Achieve Guardian rank',
    iconName: 'Shield',
    category: 'SPECIAL',
    xpReward: 3000,
    rarity: 'LEGENDARY',
    criteria: JSON.stringify({ type: 'stage_reached', stage: 6 })
  },
  {
    name: 'Sage Embodied',
    description: 'Reach the pinnacle as a Sage',
    iconName: 'Crown',
    category: 'SPECIAL',
    xpReward: 5000,
    rarity: 'LEGENDARY',
    criteria: JSON.stringify({ type: 'stage_reached', stage: 7 })
  }
];

const INITIAL_SKILLS = [
  // AI Foundations
  {
    name: 'AI Fundamentals',
    description: 'Core concepts of artificial intelligence and machine learning',
    iconName: 'Brain',
    category: 'AI Foundations',
    parentSkillId: null,
    requiredXP: 500,
    orderIndex: 0
  },
  {
    name: 'Python Programming',
    description: 'Programming proficiency in Python for AI/ML',
    iconName: 'Code',
    category: 'Programming',
    parentSkillId: null,
    requiredXP: 400,
    orderIndex: 1
  },
  {
    name: 'Data Science',
    description: 'Data analysis, visualization, and statistical methods',
    iconName: 'BarChart',
    category: 'AI Foundations',
    parentSkillId: null,
    requiredXP: 450,
    orderIndex: 2
  },
  
  // Advanced Skills (require parent skills)
  {
    name: 'Neural Networks',
    description: 'Deep learning and neural network architectures',
    iconName: 'Network',
    category: 'Deep Learning',
    parentSkillId: null, // Will be set after AI Fundamentals is created
    requiredXP: 600,
    orderIndex: 3
  },
  {
    name: 'Natural Language Processing',
    description: 'Processing and understanding human language with AI',
    iconName: 'MessageCircle',
    category: 'NLP',
    parentSkillId: null,
    requiredXP: 650,
    orderIndex: 4
  },
  {
    name: 'Computer Vision',
    description: 'Image and video analysis with deep learning',
    iconName: 'Eye',
    category: 'Computer Vision',
    parentSkillId: null,
    requiredXP: 650,
    orderIndex: 5
  },
  
  // SAGE-D Specific Skills
  {
    name: 'Cultural AI Design',
    description: 'Designing AI systems with cultural context and awareness',
    iconName: 'Globe',
    category: 'SAGE-D',
    parentSkillId: null,
    requiredXP: 700,
    orderIndex: 6
  },
  {
    name: 'Ethical AI',
    description: 'Ethics, bias detection, and responsible AI development',
    iconName: 'Scale',
    category: 'SAGE-D',
    parentSkillId: null,
    requiredXP: 600,
    orderIndex: 7
  },
  {
    name: 'Community Impact',
    description: 'Applying AI solutions to community problems',
    iconName: 'Users',
    category: 'SAGE-D',
    parentSkillId: null,
    requiredXP: 750,
    orderIndex: 8
  }
];

const STAGE_REQUIREMENTS = [
  {
    stage: 1,
    title: 'Seeker',
    description: 'The curious beginner. Open-minded, driven by wonder, exploring knowledge from many domains.',
    requiredXP: 0,
    requiredBadges: [],
    requiredSkills: []
  },
  {
    stage: 2,
    title: 'Apprentice',
    description: 'Guided learner under mentors. Begins disciplined practice — testing theories through small projects.',
    requiredXP: 1000,
    requiredBadges: [],
    requiredSkills: []
  },
  {
    stage: 3,
    title: 'Cultivator',
    description: 'Moves from self to community. Helps others learn and facilitates study circles.',
    requiredXP: 3000,
    requiredBadges: [],
    requiredSkills: []
  },
  {
    stage: 4,
    title: 'Griot-Scholar',
    description: 'A fusion of storyteller and researcher. Uses story, history, and lived experience.',
    requiredXP: 6000,
    requiredBadges: [],
    requiredSkills: []
  },
  {
    stage: 5,
    title: 'Architect',
    description: 'Designs frameworks and systems that embed knowledge into sustainable structures.',
    requiredXP: 10000,
    requiredBadges: [],
    requiredSkills: []
  },
  {
    stage: 6,
    title: 'Guardian',
    description: 'Protects intellectual sovereignty and ethical use of knowledge.',
    requiredXP: 15000,
    requiredBadges: [],
    requiredSkills: []
  },
  {
    stage: 7,
    title: 'Sage',
    description: 'Embodies wisdom in action. Synthesizes knowledge, ethics, and vision.',
    requiredXP: 25000,
    requiredBadges: [],
    requiredSkills: []
  }
];

async function main() {
  console.log('Seeding gamification data...');

  // Seed badges
  for (const badge of INITIAL_BADGES) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge as any
    });
  }
  console.log(`✓ Seeded ${INITIAL_BADGES.length} badges`);

  // Seed skills
  for (const skill of INITIAL_SKILLS) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill as any
    });
  }
  console.log(`✓ Seeded ${INITIAL_SKILLS.length} skills`);

  // Seed stage requirements
  for (const req of STAGE_REQUIREMENTS) {
    await prisma.stageRequirement.upsert({
      where: { stage: req.stage },
      update: {},
      create: req as any
    });
  }
  console.log(`✓ Seeded ${STAGE_REQUIREMENTS.length} stage requirements`);

  console.log('Gamification data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
