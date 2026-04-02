
/**
 * Archetype Service - Handles archetype identification and profile generation
 * Implements service abstraction for future microservices migration
 */

export type ArchetypeType = 'young_sage' | 'educator' | 'technologist' | 'sage_mastery' | 'tech_educator' | 'educator_sage';

export interface ArchetypeProfile {
  primary: ArchetypeType;
  secondary?: ArchetypeType;
  strengths: string[];
  recommendedPath: string;
  startingStage: number;
  startingStageTitle: string;
  initialTokens: number;
}

export interface QuizAnswer {
  questionId: number;
  archetypeWeight: Partial<Record<ArchetypeType, number>>;
}

class ArchetypeService {
  /**
   * Calculate archetype from quiz responses
   * This method can be swapped with ML-based profiling later
   */
  calculateArchetype(answers: string[]): ArchetypeProfile {
    const counts: Record<string, number> = {};
    
    answers.forEach(answer => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    const sortedArchetypes = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const primary = sortedArchetypes[0][0] as ArchetypeType;
    const secondary = sortedArchetypes.length > 1 && sortedArchetypes[1][1] >= 1
      ? sortedArchetypes[1][0] as ArchetypeType
      : undefined;

    // Check for hybrid archetypes
    const hybridArchetype = this.detectHybrid(primary, secondary);

    return {
      primary: hybridArchetype || primary,
      secondary,
      strengths: this.getArchetypeStrengths(hybridArchetype || primary),
      recommendedPath: this.getRecommendedPath(hybridArchetype || primary),
      startingStage: this.getStartingStage(hybridArchetype || primary),
      startingStageTitle: this.getStageTitle(this.getStartingStage(hybridArchetype || primary)),
      initialTokens: 10 // Welcome tokens
    };
  }

  private detectHybrid(primary: string, secondary?: string): ArchetypeType | null {
    if (!secondary) return null;

    const combo = [primary, secondary].sort().join('-');
    const hybrids: Record<string, ArchetypeType> = {
      'educator-technologist': 'tech_educator',
      'educator-sage_mastery': 'educator_sage'
    };

    return hybrids[combo] || null;
  }

  private getArchetypeStrengths(archetype: ArchetypeType): string[] {
    const strengths: Record<ArchetypeType, string[]> = {
      young_sage: [
        'Strong foundational learning',
        'Growth mindset',
        'Curiosity-driven exploration'
      ],
      educator: [
        'Teaching and mentorship',
        'Community building',
        'Clear communication'
      ],
      technologist: [
        'Technical implementation',
        'Problem-solving',
        'Innovation mindset'
      ],
      sage_mastery: [
        'Deep expertise',
        'Research capabilities',
        'Thought leadership'
      ],
      tech_educator: [
        'Technical teaching',
        'Hands-on instruction',
        'Bridge theory and practice'
      ],
      educator_sage: [
        'Advanced pedagogy',
        'Curriculum design',
        'Wisdom sharing'
      ]
    };

    return strengths[archetype] || [];
  }

  private getRecommendedPath(archetype: ArchetypeType): string {
    const paths: Record<ArchetypeType, string> = {
      young_sage: 'Seeker → Apprentice → Cultivator (Build strong foundations)',
      educator: 'Educator Track: Teaching AI concepts and community building',
      technologist: 'Technical Track: Build AI solutions for African challenges',
      sage_mastery: 'Architect → Guardian → Sage (Deep mastery and leadership)',
      tech_educator: 'Technical Education Track: Teach through building',
      educator_sage: 'Master Educator Track: Curriculum design and wisdom sharing'
    };

    return paths[archetype] || 'Complete AI Sovereignty Program';
  }

  private getStartingStage(archetype: ArchetypeType): number {
    const stages: Record<ArchetypeType, number> = {
      young_sage: 1, // Seeker
      educator: 2, // Apprentice (some experience assumed)
      technologist: 2, // Apprentice
      sage_mastery: 4, // Griot-Scholar (advanced)
      tech_educator: 3, // Cultivator
      educator_sage: 4 // Griot-Scholar
    };

    return stages[archetype] || 1;
  }

  private getStageTitle(stage: number): string {
    const titles: Record<number, string> = {
      1: 'Seeker',
      2: 'Apprentice',
      3: 'Cultivator',
      4: 'Griot-Scholar',
      5: 'Architect',
      6: 'Guardian',
      7: 'Sage'
    };

    return titles[stage] || 'Seeker';
  }

  /**
   * Get archetype metadata for UI display
   */
  getArchetypeMetadata(archetype: ArchetypeType) {
    const metadata = {
      young_sage: {
        title: 'Young Sage',
        icon: 'Sparkles',
        color: '#CC8B3C',
        bgColor: 'rgba(204, 139, 60, 0.1)',
        description: 'You are at the beginning of your AI journey, eager to build a strong foundation and explore with curiosity.',
        welcomeMessage: 'Welcome, Young Sage! Your journey begins as a Seeker. Start with our foundational courses and earn your first tokens.',
        firstCourse: 'AI for Everyday Life',
        estimatedDuration: '24 weeks'
      },
      educator: {
        title: 'AI Educator',
        icon: 'GraduationCap',
        color: '#C2694D',
        bgColor: 'rgba(194, 105, 77, 0.1)',
        description: 'You are passionate about teaching AI concepts and empowering others through education.',
        welcomeMessage: 'Welcome, Educator! Begin your journey as an Apprentice. Your first module: AI in the Classroom awaits.',
        firstCourse: 'AI in the Classroom',
        estimatedDuration: '20 weeks'
      },
      technologist: {
        title: 'AI Technologist',
        icon: 'Code',
        color: '#2563EB',
        bgColor: 'rgba(37, 99, 235, 0.1)',
        description: 'You are driven to build AI solutions that solve real-world African challenges.',
        welcomeMessage: 'Welcome, Technologist! Start as an Apprentice. Your first module: Practical AI Sprint is ready.',
        firstCourse: 'Practical AI Sprint',
        estimatedDuration: '20 weeks'
      },
      sage_mastery: {
        title: 'Sage Mastery',
        icon: 'Crown',
        color: '#7C5E4A',
        bgColor: 'rgba(124, 94, 74, 0.1)',
        description: 'You are an experienced practitioner seeking deep expertise and thought leadership.',
        welcomeMessage: 'Welcome, Master! Join us as a Griot-Scholar. Advanced modules and mentorship opportunities await you.',
        firstCourse: 'Advanced AI Ethics and Leadership',
        estimatedDuration: '16 weeks'
      },
      tech_educator: {
        title: 'Tech-Educator',
        icon: 'Code',
        color: '#059669',
        bgColor: 'rgba(5, 150, 105, 0.1)',
        description: 'You bridge technical expertise with teaching ability, empowering others through hands-on instruction.',
        welcomeMessage: 'Welcome, Tech-Educator! Start as a Cultivator. Learn to teach AI through practical projects.',
        firstCourse: 'Teaching AI Through Projects',
        estimatedDuration: '18 weeks'
      },
      educator_sage: {
        title: 'Educator-Sage',
        icon: 'Award',
        color: '#DC2626',
        bgColor: 'rgba(220, 38, 38, 0.1)',
        description: 'You combine educational mastery with deep wisdom, designing curricula and mentoring educators.',
        welcomeMessage: 'Welcome, Master Educator! Join as a Griot-Scholar. Shape the future of AI education.',
        firstCourse: 'AI Curriculum Design and Pedagogy',
        estimatedDuration: '16 weeks'
      }
    };

    return metadata[archetype] || metadata.young_sage;
  }
}

export const archetypeService = new ArchetypeService();
