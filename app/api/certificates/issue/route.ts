
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { accredibleService } from '@/lib/accredible';
import { STAGES } from '@/lib/gamification';

// POST /api/certificates/issue - Issue a certificate for stage completion
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { stageLevel, courseId } = await req.json();

    if (!stageLevel && !courseId) {
      return NextResponse.json(
        { error: 'Either stageLevel or courseId is required' },
        { status: 400 }
      );
    }

    let certificateType: 'STAGE' | 'COURSE' = 'COURSE';
    let stageLevelTitle: string | null = null;

    if (stageLevel) {
      // Validate stage level
      if (stageLevel < 1 || stageLevel > 7) {
        return NextResponse.json(
          { error: 'Invalid stage level' },
          { status: 400 }
        );
      }

      const stage = STAGES.find((s) => s.stage === stageLevel);
      if (!stage) {
        return NextResponse.json({ error: 'Stage not found' }, { status: 404 });
      }

      certificateType = 'STAGE';
      stageLevelTitle = stage.title;

      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findFirst({
        where: {
          userId: user.id,
          certificateType: 'STAGE',
          stageLevel: stageLevel,
        },
      });

      if (existingCertificate) {
        return NextResponse.json(
          { 
            message: 'Certificate already issued',
            certificate: existingCertificate 
          },
          { status: 200 }
        );
      }

      // Create certificate via Accredible
      const recipientName = user.name || user.email;
      const accredibleResponse = await accredibleService.createCredential(
        recipientName,
        user.email,
        stage.title,
        stageLevel,
        new Date()
      );

      if (!accredibleResponse) {
        return NextResponse.json(
          { error: 'Failed to create certificate with Accredible' },
          { status: 500 }
        );
      }

      // Save certificate to database
      const certificate = await prisma.certificate.create({
        data: {
          userId: user.id,
          certificateType: 'STAGE',
          stageLevel: stageLevel,
          stageLevelTitle: stage.title,
          accredibleId: accredibleResponse.credential.id,
          verificationUrl: accredibleResponse.credential.url,
          certificateUrl: accredibleResponse.credential.url,
          credentialData: JSON.stringify(accredibleResponse.credential),
        },
      });

      return NextResponse.json({
        message: 'Certificate issued successfully',
        certificate,
      });
    } else if (courseId) {
      // Course certificate logic (existing)
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
      });

      if (!enrollment || enrollment.status !== 'COMPLETED') {
        return NextResponse.json(
          { error: 'Course not completed' },
          { status: 400 }
        );
      }

      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
      });

      if (existingCertificate) {
        return NextResponse.json(
          { 
            message: 'Certificate already issued',
            certificate: existingCertificate 
          },
          { status: 200 }
        );
      }

      // Create certificate via Accredible
      const recipientName = user.name || user.email;
      const accredibleResponse = await accredibleService.createCredential(
        recipientName,
        user.email,
        course.title,
        0, // Not a stage level
        new Date()
      );

      if (!accredibleResponse) {
        return NextResponse.json(
          { error: 'Failed to create certificate with Accredible' },
          { status: 500 }
        );
      }

      // Save certificate to database
      const certificate = await prisma.certificate.create({
        data: {
          userId: user.id,
          courseId: courseId,
          certificateType: 'COURSE',
          accredibleId: accredibleResponse.credential.id,
          verificationUrl: accredibleResponse.credential.url,
          certificateUrl: accredibleResponse.credential.url,
          credentialData: JSON.stringify(accredibleResponse.credential),
        },
      });

      return NextResponse.json({
        message: 'Certificate issued successfully',
        certificate,
      });
    }
  } catch (error) {
    console.error('Error issuing certificate:', error);
    return NextResponse.json(
      { error: 'Failed to issue certificate' },
      { status: 500 }
    );
  }
}
