
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { archetypeService } from '@/lib/services/archetype-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Quiz answers are required' },
        { status: 400 }
      );
    }

    // Calculate archetype profile
    const profile = archetypeService.calculateArchetype(answers);
    const metadata = archetypeService.getArchetypeMetadata(profile.primary);

    return NextResponse.json({
      profile,
      metadata,
      message: 'Archetype calculated successfully'
    });
  } catch (error: any) {
    console.error('Archetype calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate archetype' },
      { status: 500 }
    );
  }
}
