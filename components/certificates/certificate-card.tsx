
'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, ExternalLink, Download, QrCode } from 'lucide-react';
import { format } from 'date-fns';

interface CertificateCardProps {
  certificate: {
    id: string;
    certificateType: string;
    stageLevel?: number | null;
    stageLevelTitle?: string | null;
    issuedAt: Date | string;
    verificationUrl?: string | null;
    certificateUrl?: string | null;
    course?: {
      title: string;
      level: string;
    } | null;
  };
  onView: () => void;
}

export function CertificateCard({ certificate, onView }: CertificateCardProps) {
  const issuedDate = typeof certificate.issuedAt === 'string' 
    ? new Date(certificate.issuedAt) 
    : certificate.issuedAt;

  const certificateTitle =
    certificate.certificateType === 'STAGE'
      ? `${certificate.stageLevelTitle || 'Level'} Certificate`
      : certificate.course?.title || 'Course Certificate';

  const certificateSubtitle =
    certificate.certificateType === 'STAGE'
      ? `Stage ${certificate.stageLevel || ''} Completion`
      : `${certificate.course?.level || ''} Course`;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{certificateTitle}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{certificateSubtitle}</p>
            </div>
          </div>
          <Badge variant="secondary" className="ml-2">
            {certificate.certificateType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Issued On</span>
            <span className="font-medium">
              {format(issuedDate, 'MMM dd, yyyy')}
            </span>
          </div>
          {certificate.verificationUrl && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Verified
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={onView} variant="default" className="flex-1">
          <Award className="h-4 w-4 mr-2" />
          View Certificate
        </Button>
        {certificate.verificationUrl && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(certificate.verificationUrl || '', '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
