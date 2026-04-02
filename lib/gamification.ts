
// Gamification Constants and Utilities

export const STAGES = [
  {
    stage: 1,
    title: 'Seeker',
    subtitle: 'Learner',
    description: 'The curious beginner. Open-minded, driven by wonder, exploring knowledge from many domains. Starts to sense deeper patterns and symbolic connections between things. Learns how to learn.',
    requiredXP: 0,
    color: '#60A5FA', // blue-400
    icon: 'Search'
  },
  {
    stage: 2,
    title: 'Apprentice',
    subtitle: 'Practitioner',
    description: 'Guided learner under mentors. Begins disciplined practice — testing theories through small projects or studies. Learns rigor, humility, and craftsmanship. Transforms curiosity into skill.',
    requiredXP: 1000,
    color: '#34D399', // emerald-400
    icon: 'BookOpen'
  },
  {
    stage: 3,
    title: 'Cultivator',
    subtitle: 'Peer Mentor',
    description: 'Moves from self to community. Helps others learn, facilitates study circles, and refines understanding through teaching. Begins applying knowledge in context, connecting learning to real impact.',
    requiredXP: 3000,
    color: '#FBBF24', // amber-400
    icon: 'Users'
  },
  {
    stage: 4,
    title: 'Griot-Scholar',
    subtitle: 'Cultural Educator',
    description: 'A fusion of storyteller and researcher. Uses story, history, and lived experience to preserve heritage while building new knowledge. Becomes a translator of wisdom between generations and worlds.',
    requiredXP: 6000,
    color: '#A78BFA', // violet-400
    icon: 'BookMarked'
  },
  {
    stage: 5,
    title: 'Architect',
    subtitle: 'System Designer',
    description: 'Designs frameworks, programs, and systems that embed knowledge into sustainable structures. Integrates multiple disciplines and adapts ideas to the realities of the environment and people.',
    requiredXP: 10000,
    color: '#F472B6', // pink-400
    icon: 'Building'
  },
  {
    stage: 6,
    title: 'Guardian',
    subtitle: 'Keeper of Agency',
    description: 'Protects intellectual sovereignty and ethical use of knowledge. Mentors other teachers, ensures integrity of systems, and upholds cultural resilience against exploitation or dilution.',
    requiredXP: 15000,
    color: '#FB923C', // orange-400
    icon: 'Shield'
  },
  {
    stage: 7,
    title: 'Sage',
    subtitle: 'Visionary Master',
    description: 'Embodies wisdom in action. Synthesizes knowledge, ethics, and vision into a unified way of being. Guides the movement\'s long-term direction, trains future Guardians, and anchors the philosophy in living practice.',
    requiredXP: 25000,
    color: '#C084FC', // purple-400
    icon: 'Crown'
  }
] as const;

// XP Rewards for different actions
export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  ASSIGNMENT_SUBMIT: 100,
  ASSIGNMENT_PERFECT: 150,
  MODULE_COMPLETE: 200,
  COURSE_COMPLETE: 500,
  CHECKPOINT_PASS: 100,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 25,
  PEER_HELP: 50,
  FORUM_POST: 20,
  FORUM_HELPFUL_REPLY: 30,
  SKILL_MASTER: 300,
  CAPSTONE_COMPLETE: 1000
} as const;

// Level progression (exponential curve)
export function calculateLevelFromXP(xp: number): number {
  // Level = floor(sqrt(XP / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function calculateXPForLevel(level: number): number {
  // XP needed = (level - 1)^2 * 100
  return Math.pow(level - 1, 2) * 100;
}

export function getXPProgressInLevel(xp: number): { current: number; required: number; percentage: number } {
  const currentLevel = calculateLevelFromXP(xp);
  const xpForCurrentLevel = calculateXPForLevel(currentLevel);
  const xpForNextLevel = calculateXPForLevel(currentLevel + 1);
  const xpInLevel = xp - xpForCurrentLevel;
  const xpRequiredForLevel = xpForNextLevel - xpForCurrentLevel;
  
  return {
    current: xpInLevel,
    required: xpRequiredForLevel,
    percentage: Math.floor((xpInLevel / xpRequiredForLevel) * 100)
  };
}

// Get stage info from XP
export function getStageFromXP(xp: number) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (xp >= STAGES[i].requiredXP) {
      return STAGES[i];
    }
  }
  return STAGES[0];
}

// Get next stage
export function getNextStage(currentStage: number) {
  if (currentStage < STAGES.length) {
    return STAGES[currentStage];
  }
  return null;
}

// Calculate mastery level based on various factors
export function calculateMasteryLevel(params: {
  assessmentScore: number;
  timeInvested: number;
  practiceCount: number;
  checkpointsCompleted: number;
  totalCheckpoints: number;
}): number {
  const {
    assessmentScore,
    timeInvested,
    practiceCount,
    checkpointsCompleted,
    totalCheckpoints
  } = params;

  // Weighted calculation
  const scoreWeight = 0.4;
  const checkpointWeight = 0.3;
  const practiceWeight = 0.2;
  const timeWeight = 0.1;

  const scoreComponent = assessmentScore * scoreWeight;
  const checkpointComponent = (checkpointsCompleted / Math.max(totalCheckpoints, 1)) * 100 * checkpointWeight;
  const practiceComponent = Math.min(practiceCount * 5, 100) * practiceWeight;
  const timeComponent = Math.min(timeInvested / 10, 100) * timeWeight;

  return Math.floor(scoreComponent + checkpointComponent + practiceComponent + timeComponent);
}

// Badge rarity colors
export const RARITY_COLORS = {
  COMMON: '#9CA3AF', // gray-400
  UNCOMMON: '#34D399', // emerald-400
  RARE: '#60A5FA', // blue-400
  EPIC: '#A78BFA', // violet-400
  LEGENDARY: '#FBBF24' // amber-400
} as const;

export type Stage = typeof STAGES[number];
export type BadgeRarity = keyof typeof RARITY_COLORS;
