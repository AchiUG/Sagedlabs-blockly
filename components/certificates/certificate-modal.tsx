
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Award, ExternalLink, Download, Share2, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    id: string;
    certificateType: string;
    stageLevel?: number | null;
    stageLevelTitle?: string | null;
    issuedAt: Date | string;
    verificationUrl?: string | null;
    certificateUrl?: string | null;
    accredibleId?: string | null;
    course?: {
      title: string;
      level: string;
    } | null;
  };
  userName?: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  certificate,
  userName = 'Student',
}: CertificateModalProps) {
  const { toast } = useToast();
  const issuedDate = typeof certificate.issuedAt === 'string' 
    ? new Date(certificate.issuedAt) 
    : certificate.issuedAt;

  const certificateTitle =
    certificate.certificateType === 'STAGE'
      ? `${certificate.stageLevelTitle || 'Level'} Certificate`
      : certificate.course?.title || 'Course Certificate';

  const handleShare = async () => {
    if (certificate.verificationUrl) {
      try {
        await navigator.clipboard.writeText(certificate.verificationUrl);
        toast({
          title: 'Link Copied!',
          description: 'Verification link copied to clipboard',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to copy link',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDownload = () => {
    if (certificate.certificateUrl) {
      window.open(certificate.certificateUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{certificateTitle}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Certificate of Achievement
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Preview */}
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="max-w-md mx-auto space-y-4">
              <Award className="h-16 w-16 mx-auto text-amber-600" />
              <h3 className="text-xl font-semibold">Certificate of Completion</h3>
              <p className="text-muted-foreground">This certifies that</p>
              <p className="text-2xl font-bold">{userName}</p>
              <p className="text-muted-foreground">has successfully completed</p>
              <p className="text-lg font-semibold">{certificateTitle}</p>
              {certificate.certificateType === 'STAGE' && (
                <p className="text-sm text-muted-foreground">
                  Stage {certificate.stageLevel} in the SAGED Learning Platform
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                Issued on {format(issuedDate, 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Certificate Details */}
          <div className="space-y-3">
            <h4 className="font-semibold">Certificate Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <Badge variant="secondary" className="mt-1">
                  {certificate.certificateType}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Issue Date</p>
                <p className="font-medium mt-1">
                  {format(issuedDate, 'MMM dd, yyyy')}
                </p>
              </div>
              {certificate.accredibleId && (
                <div>
                  <p className="text-muted-foreground">Certificate ID</p>
                  <p className="font-mono text-xs mt-1">{certificate.accredibleId}</p>
                </div>
              )}
              {certificate.verificationUrl && (
                <div>
                  <p className="text-muted-foreground">Verification</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">
                    Verified by Accredible
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {certificate.verificationUrl && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Verification Link</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={certificate.verificationUrl}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                  />
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link to allow others to verify your certificate
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {certificate.certificateUrl && (
              <Button onClick={handleDownload} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Accredible
              </Button>
            )}
            {certificate.verificationUrl && (
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
