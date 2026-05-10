"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, Printer, Home, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface AssessmentData {
  id: string;
  name: string;
  mcScore: number;
  submittedAt: string;
  type: string;
}

function CertificateContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const nameFromUrl = searchParams.get("name");

  const [data, setData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/assessment/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.assessment) {
          setData(res.assessment);
        }
      })
      .catch((err) => console.error("Error fetching certificate data:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadCertificate = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/certificate.jpeg";

    img.onload = () => {
      // Set canvas to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw background
      ctx?.drawImage(img, 0, 0);

      // Draw Name
      if (ctx) {
        ctx.font = "bold 120px 'Baskerville', 'Georgia', serif";
        ctx.fillStyle = "#2d4a37";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Position name at ~42% of height
        ctx.fillText(studentName, canvas.width / 2, canvas.height * 0.45);

        // Trigger download
        const link = document.createElement("a");
        link.download = `Young_Sage_Certificate_${studentName.replace(/\s+/g, "_")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Certificate downloaded successfully!");
      }
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Certificate link copied! Share your wisdom with the world.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#124734]" />
      </div>
    );
  }

  const studentName = data?.name || nameFromUrl || "Young Sage";

  return (
    <div className="certificate-page-root min-h-screen bg-stone-100 py-12 px-4 print:p-0 print:bg-white overflow-x-hidden">
      {/* Controls — hidden on print */}
      <div className="max-w-[900px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/learn">
          <Button variant="ghost" className="text-[#124734]">
            <Home className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            className="bg-[#D9A441] hover:bg-[#c6953a] text-[#124734] font-bold"
            onClick={downloadCertificate}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
          <Button
            className="bg-[#124734] hover:bg-[#0d3324] text-white font-bold"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* ====== CERTIFICATE ====== */}
      <div
        className="certificate-wrapper max-w-[900px] mx-auto relative shadow-2xl print:shadow-none print:max-w-none print:mx-0 print:w-[100vw] print:h-[100vh] print:overflow-hidden"
      >
        {/* Background template image — this contains ALL the static text */}
        <img
          src="/certificate.jpeg"
          alt="Certificate of Sagehood"
          className="w-full h-auto block print:h-screen print:w-auto print:mx-auto"
          draggable={false}
        />

        {/* Name Overlay */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{
            top: "42%",
            height: "12%",
          }}
        >
          <span
            className="certificate-name text-center leading-none"
            style={{
              fontFamily: "'Baskerville', 'Libre Baskerville', 'serif'",
              fontSize: "clamp(1.4rem, 4.5vw, 3.2rem)",
              fontWeight: 700,
              color: "#2d4a37",
              letterSpacing: "0.02em",
            }}
          >
            {studentName}
          </span>
        </div>
      </div>

      {/* Quote */}
      <div className="max-w-[900px] mx-auto mt-10 text-center print:hidden">
        <p className="text-gray-500 text-sm italic">
          &ldquo;True wisdom is the ability to see the systems that others overlook.&rdquo;
        </p>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          /* Force display: none on everything except the wrapper */
          body > *:not(.certificate-page-root) {
            display: none !important;
          }
          
          /* If there's a layout wrapper or main tag, we need to be careful */
          header, footer, nav, aside {
            display: none !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .certificate-wrapper {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            z-index: 9999;
          }

          @page {
            size: landscape;
            margin: 0;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>

  );
}

export default function CertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#124734]" />
        </div>
      }
    >
      <CertificateContent />
    </Suspense>
  );
}
