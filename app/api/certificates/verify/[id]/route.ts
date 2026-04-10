
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/certificates/verify/:id - Verify a certificate by Accredible ID
type VerifyCertificateParams = {
  id: string;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<VerifyCertificateParams> }
) {
  try {
    const { id } = await context.params;

    const certificate = await prisma.certificate.findUnique({
      where: { accredibleId: id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
            level: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found', isValid: false },
        { status: 404 }
      );
    }

    const credentialData = certificate.credentialData
      ? JSON.parse(certificate.credentialData)
      : null;

    return NextResponse.json({
      isValid: true,
      certificate: {
        id: certificate.id,
        type: certificate.certificateType,
        issuedAt: certificate.issuedAt,
        recipient: {
          name: certificate.user.name,
          email: certificate.user.email,
        },
        title:
          certificate.certificateType === 'STAGE'
            ? `${certificate.stageLevelTitle} Level Certificate`
            : certificate.course?.title || 'Course Certificate',
        verificationUrl: certificate.verificationUrl,
        credentialData,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate', isValid: false },
      { status: 500 }
    );
  }
}
