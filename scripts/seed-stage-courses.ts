
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting stage-based courses seed...');

  // Get instructor user (or create one)
  let instructorUser = await prisma.user.findUnique({
    where: { email: 'instructor@sagedlabs.com' }
  });

  if (!instructorUser) {
    const bcryptjs = require('bcryptjs');
    const instructorPassword = await bcryptjs.hash('instructor123', 10);
    instructorUser = await prisma.user.create({
      data: {
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
  }

  // Get or create categories
  const aiCategory = await prisma.category.upsert({
    where: { name: 'AI for Educators' },
    update: {},
    create: {
      name: 'AI for Educators',
      description: 'AI courses specifically designed for educators and teachers',
    },
  });

  const pedagogyCategory = await prisma.category.upsert({
    where: { name: 'Pedagogy & Teaching' },
    update: {},
    create: {
      name: 'Pedagogy & Teaching',
      description: 'Teaching methods and educational theory',
    },
  });

  const philosophyCategory = await prisma.category.upsert({
    where: { name: 'AI Philosophy & Culture' },
    update: {},
    create: {
      name: 'AI Philosophy & Culture',
      description: 'Philosophical and cultural aspects of AI',
    },
  });

  console.log('✅ Categories created/updated');

  // ==================== SEEKER STAGE (1) ====================
  console.log('\n📘 Creating Seeker Stage courses...');

  const seeker1 = await prisma.course.upsert({
    where: { id: 'seeker-ai-everyday-teaching' },
    update: {},
    create: {
      id: 'seeker-ai-everyday-teaching',
      title: 'AI for Everyday Teaching',
      description: `Transform your teaching practice with practical AI tools. This foundational course introduces educators to AI applications that enhance daily teaching activities. Learn to use AI for efficient content creation, intelligent grading, and effective prompting techniques. 

Perfect for teachers new to AI, this course demystifies artificial intelligence and shows you how to integrate it seamlessly into your classroom routine. By the end, you'll be confident using AI to save time, personalize instruction, and enhance student engagement.

Topics covered:
• AI-powered content creation for lesson plans and materials
• Smart grading and assessment tools
• Effective prompt engineering for educational contexts
• Time-saving automation techniques
• Ethical considerations in AI-assisted teaching`,
      shortDescription: 'Learn to use AI for prompting, grading, and content creation in your everyday teaching practice',
      imageUrl: 'https://cdn.abacus.ai/images/290c48ae-46c2-4e50-9f8d-8567dadb2f0f.png',
      level: 'BEGINNER',
      learningStage: 1,
      duration: '4 weeks',
      price: 0,
      prerequisites: 'None - No prior AI experience required',
      learningObjectives: [
        'Use AI tools for content creation and lesson planning',
        'Implement AI-assisted grading and feedback systems',
        'Master prompt engineering for educational purposes',
        'Automate routine teaching tasks with AI',
        'Apply ethical AI practices in the classroom',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: aiCategory.id,
    },
  });

  const seeker2 = await prisma.course.upsert({
    where: { id: 'seeker-ai-ethics-bias' },
    update: {},
    create: {
      id: 'seeker-ai-ethics-bias',
      title: 'AI Ethics and Bias in Education',
      description: `Develop a critical understanding of AI ethics and bias in educational contexts. This essential course explores how bias manifests in AI systems, its impact on students, and strategies for promoting fairness and equity.

As educators, we have a responsibility to understand the ethical implications of AI tools we use. This course provides the knowledge and frameworks needed to evaluate AI systems critically, recognize bias, and advocate for equitable technology in education.

Topics covered:
• Understanding algorithmic bias and its sources
• Recognizing bias in educational AI tools
• Impact of biased AI on diverse student populations
• Ethical frameworks for AI in education
• Strategies for promoting fairness and equity
• Critical evaluation of AI systems`,
      shortDescription: 'Understand and address bias and ethical concerns in AI systems used in education',
      imageUrl: 'https://cdn.abacus.ai/images/8f527687-df85-4fdf-9bbd-90dd77870d15.png',
      level: 'BEGINNER',
      learningStage: 1,
      duration: '3 weeks',
      price: 0,
      prerequisites: 'None - Suitable for all educators',
      learningObjectives: [
        'Identify sources and types of bias in AI systems',
        'Evaluate educational AI tools for fairness and equity',
        'Apply ethical frameworks to AI decision-making',
        'Advocate for equitable AI practices in schools',
        'Recognize the impact of biased AI on marginalized students',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: aiCategory.id,
    },
  });

  const seeker3 = await prisma.course.upsert({
    where: { id: 'seeker-ml-by-analogy' },
    update: {},
    create: {
      id: 'seeker-ml-by-analogy',
      title: 'Understanding Machine Learning by Analogy',
      description: `Demystify machine learning through relatable analogies and everyday examples. This course makes complex ML concepts accessible by connecting them to familiar experiences and teaching you to think about AI in intuitive ways.

No math or coding required! Learn how machine learning works through stories, metaphors, and analogies that make sense. Perfect for educators who want to understand ML fundamentally before diving deeper.

Topics covered:
• What is machine learning? (Explained through teaching analogies)
• Supervised learning: Like learning with a teacher
• Unsupervised learning: Finding patterns naturally
• Neural networks: The brain analogy
• Training models: Like teaching a student
• Common ML applications in education
• Building intuition for AI concepts`,
      shortDescription: 'Learn machine learning concepts through relatable analogies and everyday examples',
      imageUrl: 'https://cdn.abacus.ai/images/1f294b4b-6cbd-4759-b139-ae31cd3c0946.png',
      level: 'BEGINNER',
      learningStage: 1,
      duration: '3 weeks',
      price: 0,
      prerequisites: 'None - Designed for complete beginners',
      learningObjectives: [
        'Understand core machine learning concepts through analogies',
        'Explain ML concepts to students and colleagues',
        'Recognize different types of machine learning',
        'Build intuition about how AI systems learn',
        'Connect ML concepts to educational contexts',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: aiCategory.id,
    },
  });

  console.log('✅ Seeker courses created');

  // ==================== APPRENTICE STAGE (2) ====================
  console.log('\n📗 Creating Apprentice Stage courses...');

  const apprentice1 = await prisma.course.upsert({
    where: { id: 'apprentice-ai-lesson-codesign' },
    update: {},
    create: {
      id: 'apprentice-ai-lesson-codesign',
      title: 'AI Lesson Co-design',
      description: `Master the art of co-designing lessons with AI as your teaching partner. This hands-on course teaches you to leverage AI tools for creating engaging, differentiated, and adaptive lessons that meet diverse student needs.

Go beyond basic AI usage to become proficient in AI-assisted instructional design. Learn text-to-lesson generation, adaptive assessment creation, and how to customize AI outputs for your unique classroom context.

Topics covered:
• AI-assisted lesson planning workflows
• Text-to-lesson generation and customization
• Creating adaptive assessments with AI
• Differentiating instruction using AI tools
• Scaffolding learning with AI support
• Quality control for AI-generated content
• Aligning AI-created lessons with standards`,
      shortDescription: 'Co-design engaging lessons with AI using text-to-lesson tools and adaptive assessment techniques',
      imageUrl: 'https://cdn.abacus.ai/images/f1a49578-6bbe-4ea8-b6b6-777d85cd7215.png',
      level: 'INTERMEDIATE',
      learningStage: 2,
      duration: '5 weeks',
      price: 0,
      prerequisites: 'AI for Everyday Teaching or equivalent basic AI experience',
      learningObjectives: [
        'Design complete lessons using AI co-creation tools',
        'Create adaptive assessments that respond to student needs',
        'Differentiate instruction with AI assistance',
        'Evaluate and refine AI-generated educational content',
        'Integrate AI-designed lessons into existing curriculum',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: aiCategory.id,
    },
  });

  const apprentice2 = await prisma.course.upsert({
    where: { id: 'apprentice-personalized-learning' },
    update: {},
    create: {
      id: 'apprentice-personalized-learning',
      title: 'Using AI for Personalized Learning and Student Analytics',
      description: `Harness the power of AI to personalize learning experiences and gain actionable insights from student data. This course teaches you to use AI analytics tools to understand student progress, identify learning gaps, and provide targeted interventions.

Transform your teaching with data-driven personalization. Learn to interpret AI-generated insights, create personalized learning paths, and use predictive analytics to support every student's success.

Topics covered:
• AI-powered student analytics platforms
• Interpreting learning analytics dashboards
• Creating personalized learning pathways
• Identifying at-risk students with AI
• Adaptive learning systems and how they work
• Using AI for formative assessment
• Data privacy and ethical use of student data
• Communicating insights to students and parents`,
      shortDescription: 'Leverage AI analytics to personalize learning and support every student\'s unique needs',
      imageUrl: 'https://cdn.abacus.ai/images/fab836ec-a936-4a58-b86a-a47f0afe4c33.png',
      level: 'INTERMEDIATE',
      learningStage: 2,
      duration: '5 weeks',
      price: 0,
      prerequisites: 'Basic understanding of AI in education',
      learningObjectives: [
        'Use AI analytics tools to track student progress',
        'Create personalized learning paths with AI assistance',
        'Interpret and act on AI-generated learning insights',
        'Implement adaptive learning strategies',
        'Protect student privacy while using AI analytics',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: aiCategory.id,
    },
  });

  const apprentice3 = await prisma.course.upsert({
    where: { id: 'apprentice-ethical-ai-policies' },
    update: {},
    create: {
      id: 'apprentice-ethical-ai-policies',
      title: 'Building Ethical Classroom AI Policies',
      description: `Lead the way in establishing ethical AI guidelines for your classroom and school. This practical course equips you with frameworks and tools to create comprehensive AI policies that promote responsible use, transparency, and student agency.

As AI becomes ubiquitous in education, clear policies are essential. Learn to craft policies that balance innovation with ethics, protect student rights, and create a culture of responsible AI use.

Topics covered:
• Frameworks for ethical AI policy development
• Student AI acceptable use policies
• Transparency and explainability requirements
• Data governance and privacy protection
• Academic integrity in the age of AI
• Stakeholder engagement and policy buy-in
• Implementing and enforcing AI policies
• Adapting policies as AI evolves`,
      shortDescription: 'Create comprehensive ethical AI policies that promote responsible use and student agency',
      imageUrl: 'https://cdn.abacus.ai/images/19ecc215-ff3b-47ee-bf80-b40d28f9432f.png',
      level: 'INTERMEDIATE',
      learningStage: 2,
      duration: '4 weeks',
      price: 0,
      prerequisites: 'AI Ethics and Bias in Education or equivalent',
      learningObjectives: [
        'Develop ethical AI policies for classroom use',
        'Create acceptable use guidelines for students',
        'Establish data privacy and governance frameworks',
        'Address academic integrity concerns with AI',
        'Engage stakeholders in policy development',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: aiCategory.id,
    },
  });

  console.log('✅ Apprentice courses created');

  // ==================== CULTIVATOR STAGE (3) ====================
  console.log('\n📙 Creating Cultivator Stage courses...');

  const cultivator1 = await prisma.course.upsert({
    where: { id: 'cultivator-teaching-teachers' },
    update: {},
    create: {
      id: 'cultivator-teaching-teachers',
      title: 'Teaching Teachers: Pedagogy of Adult Learning',
      description: `Master the art and science of teaching teachers. This advanced course explores adult learning theory, effective professional development strategies, and how to facilitate transformative learning experiences for fellow educators.

Become a mentor and leader in your educational community. Learn andragogy principles, coaching techniques, and how to design professional development that creates lasting change in teaching practice.

Topics covered:
• Adult learning theory (andragogy)
• Principles of effective professional development
• Coaching and mentoring strategies
• Facilitating collaborative learning communities
• Addressing resistance to change
• Creating psychologically safe learning environments
• Assessing teacher growth and development
• Sustaining professional learning over time`,
      shortDescription: 'Learn adult learning pedagogy to effectively train and mentor fellow educators',
      imageUrl: 'https://cdn.abacus.ai/images/e3a290cf-54d6-4784-ab0d-504157cfb9eb.png',
      level: 'INTERMEDIATE',
      learningStage: 3,
      duration: '6 weeks',
      price: 0,
      prerequisites: 'Teaching experience and completion of Apprentice stage courses',
      learningObjectives: [
        'Apply adult learning principles to teacher training',
        'Design effective professional development programs',
        'Coach and mentor fellow educators',
        'Facilitate productive learning communities',
        'Lead educational change initiatives',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: pedagogyCategory.id,
    },
  });

  const cultivator2 = await prisma.course.upsert({
    where: { id: 'cultivator-localization-ai' },
    update: {},
    create: {
      id: 'cultivator-localization-ai',
      title: 'Localization and Contextualization of AI Tools',
      description: `Transform global AI tools to serve local educational contexts. This course teaches you to adapt, customize, and contextualize AI technologies to reflect local languages, cultures, pedagogies, and needs.

Lead culturally responsive AI implementation in your community. Learn to evaluate AI tools for cultural appropriateness, modify content for local relevance, and advocate for AI that serves diverse communities.

Topics covered:
• Cultural considerations in AI tool selection
• Adapting AI for multilingual classrooms
• Contextualizing AI content for local relevance
• Addressing cultural bias in global AI tools
• Creating locally relevant AI training data
• Community-based AI development principles
• Advocating for culturally responsive AI
• Building partnerships for localized AI`,
      shortDescription: 'Adapt and contextualize AI tools to serve local languages, cultures, and educational needs',
      imageUrl: 'https://cdn.abacus.ai/images/684aca74-968d-4b40-ae66-efc4c719afc4.png',
      level: 'INTERMEDIATE',
      learningStage: 3,
      duration: '5 weeks',
      price: 0,
      prerequisites: 'Experience with AI tools in education',
      learningObjectives: [
        'Evaluate AI tools for cultural appropriateness',
        'Adapt AI content for local contexts',
        'Implement multilingual AI solutions',
        'Address cultural bias in AI systems',
        'Advocate for culturally responsive AI development',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: aiCategory.id,
    },
  });

  const cultivator3 = await prisma.course.upsert({
    where: { id: 'cultivator-knowledge-circles' },
    update: {},
    create: {
      id: 'cultivator-knowledge-circles',
      title: 'Community Knowledge Circles and Open Resource Creation',
      description: `Build vibrant learning communities and create open educational resources that empower others. This course teaches you to facilitate knowledge circles, curate collective wisdom, and develop open resources that multiply impact.

Become a community knowledge leader. Learn to create spaces where educators share, collaborate, and co-create; develop open educational resources; and build sustainable communities of practice around AI in education.

Topics covered:
• Principles of knowledge circles and learning communities
• Facilitating meaningful peer learning
• Creating open educational resources (OER)
• Licensing and sharing educational content
• Building communities of practice
• Sustaining engagement and participation
• Collaborative knowledge curation
• Measuring community impact`,
      shortDescription: 'Facilitate learning communities and create open educational resources for collective empowerment',
      imageUrl: 'https://cdn.abacus.ai/images/03e34f1e-68ea-40de-b755-2acfbb190916.png',
      level: 'INTERMEDIATE',
      learningStage: 3,
      duration: '5 weeks',
      price: 0,
      prerequisites: 'Teaching experience and collaborative mindset',
      learningObjectives: [
        'Facilitate effective knowledge circles',
        'Create high-quality open educational resources',
        'Build and sustain communities of practice',
        'Use collaborative tools for knowledge sharing',
        'Measure and communicate community impact',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: pedagogyCategory.id,
    },
  });

  console.log('✅ Cultivator courses created');

  // ==================== GRIOT-SCHOLAR STAGE (4) ====================
  console.log('\n📕 Creating Griot-Scholar Stage courses...');

  const griot1 = await prisma.course.upsert({
    where: { id: 'griot-story-intelligence' },
    update: {},
    create: {
      id: 'griot-story-intelligence',
      title: 'The Story of Intelligence: From Myth to Machine',
      description: `Explore the philosophical and historical foundations of intelligence, from ancient wisdom traditions to modern artificial intelligence. This deep dive examines how different cultures have conceptualized intelligence and what this means for AI today.

Journey through human understanding of intelligence across time and cultures. Connect ancient wisdom to modern AI, examine diverse epistemologies, and develop a rich, philosophical understanding of what intelligence means.

Topics covered:
• Ancient conceptions of intelligence across cultures
• African philosophy of knowledge and intelligence
• Evolution of Western intelligence theory
• Non-Western epistemologies and AI
• From human to artificial intelligence
• Mythology and metaphor in understanding AI
• Philosophy of mind and consciousness
• Indigenous knowledge systems and AI`,
      shortDescription: 'Explore intelligence from ancient wisdom to modern AI through philosophy and cultural perspectives',
      imageUrl: 'https://cdn.abacus.ai/images/4d3e727e-bc5b-4262-b824-b6b88f6a7cf5.png',
      level: 'ADVANCED',
      learningStage: 4,
      duration: '6 weeks',
      price: 0,
      prerequisites: 'Completion of Cultivator stage or equivalent experience',
      learningObjectives: [
        'Analyze diverse cultural conceptions of intelligence',
        'Connect ancient wisdom to modern AI development',
        'Examine philosophical foundations of AI',
        'Understand non-Western epistemologies',
        'Develop critical perspectives on intelligence and AI',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: philosophyCategory.id,
    },
  });

  const griot2 = await prisma.course.upsert({
    where: { id: 'griot-cultural-sovereignty' },
    update: {},
    create: {
      id: 'griot-cultural-sovereignty',
      title: 'AI and Cultural Sovereignty in African Classrooms',
      description: `Champion cultural sovereignty in the age of AI. This course examines how AI can either reinforce or challenge cultural imperialism in education, and how to ensure AI serves rather than erases local cultures and knowledge systems.

Lead the movement for culturally sovereign AI in education. Understand power dynamics in AI development, advocate for locally-controlled AI, and design educational AI that honors and strengthens cultural identity.

Topics covered:
• Cultural sovereignty and educational technology
• AI colonialism and resistance strategies
• African knowledge systems and AI
• Power and representation in AI development
• Creating culturally sovereign AI tools
• Language preservation through AI
• Community ownership of educational AI
• Advocacy and policy for cultural sovereignty`,
      shortDescription: 'Ensure AI serves cultural sovereignty and honors local knowledge in African educational contexts',
      imageUrl: 'https://cdn.abacus.ai/images/9b7d260c-038a-4e77-8d7d-48e5816da853.png',
      level: 'ADVANCED',
      learningStage: 4,
      duration: '6 weeks',
      price: 0,
      prerequisites: 'Deep understanding of AI in education and cultural context',
      learningObjectives: [
        'Analyze power dynamics in educational AI',
        'Advocate for culturally sovereign AI development',
        'Design AI that honors local knowledge systems',
        'Resist AI colonialism in education',
        'Lead cultural sovereignty initiatives',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: philosophyCategory.id,
    },
  });

  const griot3 = await prisma.course.upsert({
    where: { id: 'griot-curriculum-design' },
    update: {},
    create: {
      id: 'griot-curriculum-design',
      title: 'Designing AI-Integrated Curricula for Agency',
      description: `Design comprehensive AI-integrated curricula that center student agency and empowerment. This advanced course teaches systems-level curriculum design that thoughtfully integrates AI while developing students' critical consciousness and autonomy.

Become a curriculum architect who designs for liberation. Learn to create integrated learning experiences that use AI as a tool for student empowerment, critical thinking, and agency rather than dependence.

Topics covered:
• Curriculum design principles for the AI age
• Centering student agency in AI-rich environments
• Developing critical AI literacy curricula
• Systems thinking in curriculum design
• Backwards design with AI integration
• Assessment design for agency and competency
• Scope and sequence for AI literacy
• Creating anti-oppressive AI curricula`,
      shortDescription: 'Design comprehensive curricula that integrate AI while centering student agency and empowerment',
      imageUrl: 'https://cdn.abacus.ai/images/fdae6617-2ac1-46c4-aedb-2111f7b06731.png',
      level: 'ADVANCED',
      learningStage: 4,
      duration: '7 weeks',
      price: 0,
      prerequisites: 'Curriculum design experience and completion of earlier stages',
      learningObjectives: [
        'Design comprehensive AI-integrated curricula',
        'Center student agency in educational AI',
        'Create critical AI literacy programs',
        'Apply systems thinking to curriculum design',
        'Develop anti-oppressive AI education frameworks',
      ],
      isPublished: true,
      instructorId: instructorUser.id,
      categoryId: pedagogyCategory.id,
    },
  });

  console.log('✅ Griot-Scholar courses created');

  // ==================== CREATE SAMPLE MODULES & LESSONS ====================
  console.log('\n📚 Creating sample modules and lessons...');

  // Sample module for Seeker course 1
  const seekerModule = await prisma.module.create({
    data: {
      title: 'Getting Started with AI Tools',
      description: 'Introduction to practical AI tools for everyday teaching',
      orderIndex: 1,
      courseId: seeker1.id,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Welcome to AI for Everyday Teaching',
        content: 'An overview of how AI can transform your daily teaching practice and what you\'ll learn in this course.',
        duration: 15,
        orderIndex: 1,
        moduleId: seekerModule.id,
      },
      {
        title: 'Your First AI Prompt: Creating a Lesson Plan',
        content: 'Hands-on practice with AI prompting to generate a complete lesson plan for your subject area.',
        duration: 30,
        orderIndex: 2,
        moduleId: seekerModule.id,
      },
      {
        title: 'AI-Assisted Grading: Saving Time and Improving Feedback',
        content: 'Learn to use AI tools to provide better feedback to students faster.',
        duration: 25,
        orderIndex: 3,
        moduleId: seekerModule.id,
      },
    ],
  });

  console.log('✅ Sample modules and lessons created');

  console.log('\n🎉 Stage-based courses seeded successfully!');
  console.log('\n📋 Courses Created:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📘 SEEKER STAGE (1):');
  console.log('   1. AI for Everyday Teaching');
  console.log('   2. AI Ethics and Bias in Education');
  console.log('   3. Understanding Machine Learning by Analogy');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📗 APPRENTICE STAGE (2):');
  console.log('   1. AI Lesson Co-design');
  console.log('   2. Using AI for Personalized Learning and Student Analytics');
  console.log('   3. Building Ethical Classroom AI Policies');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📙 CULTIVATOR STAGE (3):');
  console.log('   1. Teaching Teachers: Pedagogy of Adult Learning');
  console.log('   2. Localization and Contextualization of AI Tools');
  console.log('   3. Community Knowledge Circles and Open Resource Creation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📕 GRIOT-SCHOLAR STAGE (4):');
  console.log('   1. The Story of Intelligence: From Myth to Machine');
  console.log('   2. AI and Cultural Sovereignty in African Classrooms');
  console.log('   3. Designing AI-Integrated Curricula for Agency');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding stage-based courses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
