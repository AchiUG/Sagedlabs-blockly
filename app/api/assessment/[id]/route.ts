import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id }
    });
    
    if (assessment) {
      return NextResponse.json({ assessment });
    }
  } catch (error) {
    console.error("Error fetching assessment:", error);
  }
  
  // Fallback for prototype/demo: if not found, return a generic mock
  return NextResponse.json({ 
    assessment: { 
      mcScore: 4, 
      name: "Young Sage",
      type: "young-sages-final"
    } 
  });
}
