
import { NextRequest, NextResponse } from 'next/server';
import { ContributionService } from '@/lib/services/contribution.service';

/**
 * GET /api/svu/categories
 * Get activity categories and pillars
 */
export async function GET(request: NextRequest) {
  try {
    const [categories, pillars] = await Promise.all([
      ContributionService.getActivityCategories(),
      ContributionService.getPillars()
    ]);

    return NextResponse.json({
      categories,
      pillars
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
