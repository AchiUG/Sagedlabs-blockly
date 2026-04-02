
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CertificateCard } from '@/components/certificates/certificate-card';
import { CertificateModal } from '@/components/certificates/certificate-modal';
import { Award, Trophy, GraduationCap, Loader2 } from 'lucide-react';

interface Certificate {
  id: string;
  certificateType: string;
  stageLevel?: number | null;
  stageLevelTitle?: string | null;
  issuedAt: string;
  verificationUrl?: string | null;
  certificateUrl?: string | null;
  accredibleId?: string | null;
  course?: {
    id: string;
    title: string;
    level: string;
  } | null;
}

export default function CertificatesPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [filter, setFilter] = useState<'all' | 'stage' | 'course'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCertificates();
    }
  }, [status]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/certificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    if (filter === 'all') return true;
    if (filter === 'stage') return cert.certificateType === 'STAGE';
    if (filter === 'course') return cert.certificateType === 'COURSE';
    return true;
  });

  const stageCertificates = certificates.filter((c) => c.certificateType === 'STAGE');
  const courseCertificates = certificates.filter((c) => c.certificateType === 'COURSE');

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Certificates</h1>
              <p className="text-muted-foreground mt-1">
                View and share your achievements
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Certificates</CardDescription>
              <CardTitle className="text-3xl">{certificates.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Award className="h-4 w-4 mr-2" />
                All achievements
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Stage Certificates</CardDescription>
              <CardTitle className="text-3xl">{stageCertificates.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 mr-2" />
                Level completions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Course Certificates</CardDescription>
              <CardTitle className="text-3xl">{courseCertificates.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4 mr-2" />
                Course completions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Certificates</TabsTrigger>
            <TabsTrigger value="stage">Stage Certificates</TabsTrigger>
            <TabsTrigger value="course">Course Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredCertificates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Complete stages and courses to earn certificates that you can share
                    with employers and on social media.
                  </p>
                  <Button onClick={() => router.push('/gamification')}>
                    View Your Progress
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate) => (
                  <CertificateCard
                    key={certificate.id}
                    certificate={certificate}
                    onView={() => setSelectedCertificate(certificate)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stage" className="space-y-6">
            {stageCertificates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No stage certificates yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Complete learning stages to earn certificates for each level.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stageCertificates.map((certificate) => (
                  <CertificateCard
                    key={certificate.id}
                    certificate={certificate}
                    onView={() => setSelectedCertificate(certificate)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="course" className="space-y-6">
            {courseCertificates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No course certificates yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Complete courses to earn certificates.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseCertificates.map((certificate) => (
                  <CertificateCard
                    key={certificate.id}
                    certificate={certificate}
                    onView={() => setSelectedCertificate(certificate)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          isOpen={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          certificate={selectedCertificate}
          userName={session?.user?.name || 'Student'}
        />
      )}
    </div>
  );
}
