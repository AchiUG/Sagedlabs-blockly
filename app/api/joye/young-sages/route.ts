import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3; // Max 3 applications per hour per IP
const COHORT_SIZE = 10;

const applicationSchema = z.object({
  // Identity & Contact
  childFirstName: z.string().min(1, 'Child first name is required').max(50),
  childLastName: z.string().min(1, 'Child last name is required').max(50),
  childAge: z.number().min(8, 'Minimum age is 8').max(14, 'Maximum age is 14'),
  guardianName: z.string().min(1, 'Guardian name is required').max(100),
  guardianEmail: z.string().email('Valid email required'),
  guardianPhone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  timezone: z.string().optional(),
  
  // Access & Setup
  hasComputer: z.boolean(),
  hasInternet: z.boolean(),
  accessNotes: z.string().optional(),
  
  // SAGE-D Pillars (1-5 scale)
  selfAwareness: z.number().min(1).max(5),
  agency: z.number().min(1).max(5),
  growth: z.number().min(1).max(5),
  ethics: z.number().min(1).max(5),
  design: z.number().min(1).max(5),
  
  // Motivation
  whyJoin: z.string().min(20, 'Please tell us more about why you want to join'),
  priorExperience: z.string().optional(),
  learningGoals: z.string().optional(),
  
  // Consent
  parentalConsent: z.literal(true, { errorMap: () => ({ message: 'Parental consent is required' }) }),
  mediaConsent: z.boolean(),
  rulesAccepted: z.literal(true, { errorMap: () => ({ message: 'You must accept the program rules' }) }),
  
  // Honeypot (should be empty)
  website: z.string().max(0).optional(),
});

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many applications. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    
    // Honeypot check - if 'website' field has value, it's likely a bot
    if (body.website && body.website.length > 0) {
      // Silently reject but return success to confuse bots
      return NextResponse.json({ success: true, applicationId: 'spam-rejected' });
    }
    
    // Validate input
    const validationResult = applicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Check for duplicate email
    const existingApplication = await prisma.youngSagesApplication.findFirst({
      where: { guardianEmail: data.guardianEmail },
    });
    
    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists.' },
        { status: 409 }
      );
    }
    
    // Check cohort capacity - count ACCEPTED applications
    const acceptedCount = await prisma.youngSagesApplication.count({
      where: { status: 'ACCEPTED' },
    });
    
    // Determine initial status
    const initialStatus = acceptedCount >= COHORT_SIZE ? 'WAITLISTED' : 'PENDING';
    
    // Create application
    const application = await prisma.youngSagesApplication.create({
      data: {
        childFirstName: data.childFirstName,
        childLastName: data.childLastName,
        childAge: data.childAge,
        guardianName: data.guardianName,
        guardianEmail: data.guardianEmail,
        guardianPhone: data.guardianPhone || null,
        country: data.country,
        timezone: data.timezone || null,
        hasComputer: data.hasComputer,
        hasInternet: data.hasInternet,
        accessNotes: data.accessNotes || null,
        selfAwareness: data.selfAwareness,
        agency: data.agency,
        growth: data.growth,
        ethics: data.ethics,
        design: data.design,
        whyJoin: data.whyJoin,
        priorExperience: data.priorExperience || null,
        learningGoals: data.learningGoals || null,
        parentalConsent: data.parentalConsent,
        mediaConsent: data.mediaConsent,
        rulesAccepted: data.rulesAccepted,
        status: initialStatus,
        needsEmailFollowup: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      applicationId: application.id,
      status: initialStatus,
      message: initialStatus === 'WAITLISTED' 
        ? 'Application submitted! You have been added to our waitlist.'
        : 'Application submitted successfully! We will review and get back to you soon.',
    });
    
  } catch (error) {
    console.error('Young Sages application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
