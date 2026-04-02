
/**
 * Onboarding Service - Manages user onboarding flow
 * Service abstraction for future customization and A/B testing
 */

import { ArchetypeType } from './archetype-service';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  completed: boolean;
  optional: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  tokensEarned: number;
}

class OnboardingService {
  /**
   * Get onboarding steps based on user archetype
   */
  getOnboardingSteps(archetype: ArchetypeType): OnboardingStep[] {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome to SAGED',
        description: 'Meet your AI companion and learn how SAGE-D works',
        component: 'WelcomeVideo',
        completed: false,
        optional: false
      },
      {
        id: 'dashboard_tour',
        title: 'Dashboard Tour',
        description: 'Explore your Lab Console and navigation',
        component: 'DashboardTour',
        completed: false,
        optional: false
      },
      {
        id: 'token_system',
        title: 'Understanding Tokens',
        description: 'Learn how SAGE Tokens and Reflection Tokens work',
        component: 'TokenExplainer',
        completed: false,
        optional: false
      },
      {
        id: 'learning_path',
        title: 'Your Learning Path',
        description: 'Review your personalized learning journey',
        component: 'PathwayMap',
        completed: false,
        optional: false
      },
      {
        id: 'first_module',
        title: 'Start Your First Module',
        description: 'Begin with your recommended first course',
        component: 'FirstModule',
        completed: false,
        optional: false
      },
      {
        id: 'community',
        title: 'Join Your Learning Circle',
        description: 'Connect with peers in your cohort',
        component: 'CommunityIntro',
        completed: false,
        optional: true
      }
    ];

    // Customize based on archetype
    if (archetype === 'educator' || archetype === 'educator_sage') {
      baseSteps.push({
        id: 'teaching_tools',
        title: 'Teaching Tools',
        description: 'Explore tools for creating educational content',
        component: 'TeachingTools',
        completed: false,
        optional: true
      });
    }

    if (archetype === 'technologist' || archetype === 'tech_educator') {
      baseSteps.push({
        id: 'project_setup',
        title: 'Project Environment',
        description: 'Set up your development environment',
        component: 'ProjectSetup',
        completed: false,
        optional: true
      });
    }

    return baseSteps;
  }

  /**
   * Calculate onboarding completion percentage
   */
  calculateProgress(steps: OnboardingStep[]): OnboardingProgress {
    const requiredSteps = steps.filter(step => !step.optional);
    const completedRequired = requiredSteps.filter(step => step.completed);
    
    return {
      currentStep: completedRequired.length,
      totalSteps: requiredSteps.length,
      completedSteps: steps.filter(s => s.completed).map(s => s.id),
      tokensEarned: completedRequired.length * 2 // 2 tokens per step
    };
  }

  /**
   * Get welcome message based on archetype
   */
  getWelcomeMessage(archetype: ArchetypeType, userName: string): string {
    const messages: Record<ArchetypeType, string> = {
      young_sage: `Welcome, ${userName}! As a Young Sage, your adventure begins. Let curiosity be your guide as you explore the world of AI.`,
      educator: `Welcome, ${userName}! As an AI Educator, you'll learn to empower others. Your first students are waiting to learn from you.`,
      technologist: `Welcome, ${userName}! As a Technologist, you'll build solutions that matter. Your first project awaits.`,
      sage_mastery: `Welcome, ${userName}! As a Master, you join the ranks of thought leaders. Your wisdom will shape the future.`,
      tech_educator: `Welcome, ${userName}! As a Tech-Educator, you'll teach through building. Show others the power of hands-on learning.`,
      educator_sage: `Welcome, ${userName}! As a Master Educator, you'll design the future of AI education. Your vision matters.`
    };

    return messages[archetype] || `Welcome, ${userName}! Your journey begins now.`;
  }

  /**
   * Get CREATE-Bot introduction based on archetype
   */
  getCreateBotIntro(archetype: ArchetypeType): string {
    const intros: Record<ArchetypeType, string> = {
      young_sage: "Hi! I'm CREATE-Bot, your AI learning companion. Think of me as your guide through this journey. I'll help you discover concepts, suggest resources, and celebrate your progress. Let's learn together!",
      educator: "Hello! I'm CREATE-Bot, here to support your teaching journey. I can help you find teaching resources, design lesson plans, and connect with other educators. Ready to inspire learners?",
      technologist: "Hey! I'm CREATE-Bot, your technical assistant. I'll help you with code examples, project ideas, and debugging tips. Let's build something amazing!",
      sage_mastery: "Greetings! I'm CREATE-Bot, your research companion. I can help you explore advanced topics, find academic resources, and connect with fellow researchers. Let's push the boundaries together.",
      tech_educator: "Hi there! I'm CREATE-Bot, bridging teaching and tech. I'll help you create hands-on learning experiences and technical tutorials. Let's make learning engaging!",
      educator_sage: "Welcome! I'm CREATE-Bot, supporting your curriculum design work. I can help with pedagogy, assessment strategies, and educational frameworks. Let's shape the future of learning."
    };

    return intros[archetype] || "Hello! I'm CREATE-Bot, your AI companion. I'm here to help you learn, grow, and achieve your goals.";
  }
}

export const onboardingService = new OnboardingService();
