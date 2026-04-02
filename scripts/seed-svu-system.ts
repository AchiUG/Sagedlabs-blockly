
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SAGE-D Measured Learning Economy...');

  // 1. Seed Five SAGE-D Pillars
  console.log('📊 Creating Five Pillars...');
  
  const pillars = await Promise.all([
    prisma.pillar.upsert({
      where: { code: 'S' },
      update: {},
      create: {
        code: 'S',
        name: 'Symbolic-Relationality',
        description: 'Meaning-making through stories, culture, and pattern recognition. The ability to create narratives, translate context, and synthesize cultural wisdom.',
        irreplaceabilityMultiplier: 3.0,
        examples: [
          'Storytelling and narrative construction',
          'Cultural translation and synthesis',
          'Pattern recognition across domains',
          'Contextual teaching',
          'Metaphor and symbol creation'
        ],
        orderIndex: 1
      }
    }),
    prisma.pillar.upsert({
      where: { code: 'A' },
      update: {},
      create: {
        code: 'A',
        name: 'Adaptive Ecological Alignment',
        description: 'Context-aware design and resilience. Building systems that adapt to changing environments and maintain sustainability.',
        irreplaceabilityMultiplier: 2.8,
        examples: [
          'Sustainable project design',
          'Adaptive innovation',
          'Environmental systems thinking',
          'Resource optimization',
          'Resilient infrastructure'
        ],
        orderIndex: 2
      }
    }),
    prisma.pillar.upsert({
      where: { code: 'G' },
      update: {},
      create: {
        code: 'G',
        name: 'Governance & Knowledge Sovereignty',
        description: 'Ethical reasoning and collective leadership. Building frameworks for fair decision-making and knowledge ownership.',
        irreplaceabilityMultiplier: 2.9,
        examples: [
          'Policy design and implementation',
          'Community moderation',
          'Ethical framework building',
          'Knowledge management',
          'Collective decision-making'
        ],
        orderIndex: 3
      }
    }),
    prisma.pillar.upsert({
      where: { code: 'E' },
      update: {},
      create: {
        code: 'E',
        name: 'Equity, Efficiency & Resilience',
        description: 'Fairness and collaborative optimization. Ensuring equitable access while maximizing collective benefit.',
        irreplaceabilityMultiplier: 2.7,
        examples: [
          'Mentoring and peer support',
          'Team collaboration',
          'Resource management',
          'Accessibility design',
          'Fair distribution systems'
        ],
        orderIndex: 4
      }
    }),
    prisma.pillar.upsert({
      where: { code: 'D' },
      update: {},
      create: {
        code: 'D',
        name: 'Defensive Sovereignty & Protection',
        description: 'Safeguarding data, IP, culture, and ethics. Protecting what matters from exploitation and erosion.',
        irreplaceabilityMultiplier: 2.8,
        examples: [
          'Security design and implementation',
          'IP defense strategies',
          'Cultural preservation',
          'Privacy protection',
          'Ethical safeguards'
        ],
        orderIndex: 5
      }
    })
  ]);

  console.log(`✅ Created ${pillars.length} pillars`);

  // 2. Seed Learning Paths
  console.log('🎯 Creating Learning Paths...');
  
  const paths = await Promise.all([
    prisma.learningPath.upsert({
      where: { code: 'educator' },
      update: {},
      create: {
        code: 'educator',
        name: 'Educator Path (Griot → Scholar)',
        description: 'Focus on storytelling, mentoring, and cultural synthesis. This path emphasizes human connection, knowledge transfer, and meaning-making.',
        pathWeightMultiplier: 1.15, // +15% bonus
        focusAreas: [
          'Teaching and instruction',
          'Mentoring and coaching',
          'Storytelling and narrative',
          'Cultural preservation',
          'Reflective practice',
          'Community building'
        ]
      }
    }),
    prisma.learningPath.upsert({
      where: { code: 'technologist' },
      update: {},
      create: {
        code: 'technologist',
        name: 'Technologist Path (Architect → Guardian)',
        description: 'Focus on systems design, automation ethics, and resilience. This path emphasizes technical skill, infrastructure building, and protective innovation.',
        pathWeightMultiplier: 1.12, // +12% bonus
        focusAreas: [
          'Coding and development',
          'Infrastructure design',
          'AI and automation',
          'Security implementation',
          'Technical problem-solving',
          'Systems thinking'
        ]
      }
    })
  ]);

  console.log(`✅ Created ${paths.length} learning paths`);

  // 3. Seed Activity Categories
  console.log('📝 Creating Activity Categories...');
  
  const categories = await Promise.all([
    prisma.activityCategory.upsert({
      where: { name: 'Teaching & Instruction' },
      update: {},
      create: {
        name: 'Teaching & Instruction',
        description: 'Direct teaching, tutoring, or instructing others in a subject',
        basePoints: 10,
        iconName: 'GraduationCap',
        pillars: ['S', 'E']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'Mentoring & Coaching' },
      update: {},
      create: {
        name: 'Mentoring & Coaching',
        description: 'One-on-one guidance, career mentoring, or personal development coaching',
        basePoints: 10,
        iconName: 'Users',
        pillars: ['S', 'E', 'G']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'Technical Building' },
      update: {},
      create: {
        name: 'Technical Building',
        description: 'Coding, software development, technical infrastructure creation',
        basePoints: 10,
        iconName: 'Code',
        pillars: ['A', 'D']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'Storytelling & Content' },
      update: {},
      create: {
        name: 'Storytelling & Content',
        description: 'Creating narratives, blog posts, videos, or educational content',
        basePoints: 10,
        iconName: 'BookOpen',
        pillars: ['S']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'Community Service' },
      update: {},
      create: {
        name: 'Community Service',
        description: 'Local education drives, mentoring youth, community repairs',
        basePoints: 8,
        iconName: 'Heart',
        pillars: ['E', 'G']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'Faith-Based Service' },
      update: {},
      create: {
        name: 'Faith-Based Service',
        description: 'Youth guidance, literacy programs, counseling, ethics training',
        basePoints: 8,
        iconName: 'BookHeart',
        pillars: ['S', 'E', 'G']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'NGO/Nonprofit Work' },
      update: {},
      create: {
        name: 'NGO/Nonprofit Work',
        description: 'Environmental or civic tech initiatives, social impact projects',
        basePoints: 9,
        iconName: 'Leaf',
        pillars: ['A', 'E', 'D']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'Civic Engagement' },
      update: {},
      create: {
        name: 'Civic Engagement',
        description: 'Town halls, open data initiatives, policy advocacy',
        basePoints: 9,
        iconName: 'Flag',
        pillars: ['G', 'D']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'Cultural Preservation' },
      update: {},
      create: {
        name: 'Cultural Preservation',
        description: 'Oral history collection, art archiving, cultural documentation',
        basePoints: 10,
        iconName: 'Archive',
        pillars: ['S', 'D']
      }
    }),
    prisma.activityCategory.upsert({
      where: { name: 'Research & Analysis' },
      update: {},
      create: {
        name: 'Research & Analysis',
        description: 'Academic research, data analysis, policy research',
        basePoints: 10,
        iconName: 'Search',
        pillars: ['G', 'A']
      }
    })
  ]);

  console.log(`✅ Created ${categories.length} activity categories`);

  console.log('🎉 SVU System seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
