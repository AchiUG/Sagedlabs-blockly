import { NextRequest, NextResponse } from "next/server";
import { assessments } from "../route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Try to get from in-memory store
  const assessment = assessments[id];
  
  if (assessment) {
    return NextResponse.json({ assessment });
  }
  
  // Fallback for prototype/demo: if not found, return a generic mock
  // This helps if the server restarted and the in-memory store was cleared
  return NextResponse.json({ 
    assessment: { 
      mcScore: 4, 
      name: "Young Sage",
      type: "young-sages-final"
    } 
  });
}
