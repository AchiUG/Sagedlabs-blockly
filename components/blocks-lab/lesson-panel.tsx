'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Lightbulb } from 'lucide-react';

interface LessonPanelProps {
  title: string;
  description?: string | null;
  instructions?: string | null;
}

export default function LessonPanel({
  title,
  description,
  instructions,
}: LessonPanelProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 space-y-4">
      {/* Lesson Title */}
      <div>
        <Badge variant="secondary" className="mb-2">
          <BookOpen className="w-3 h-3 mr-1" />
          Blocks Lab
        </Badge>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        )}
      </div>

      {/* Instructions */}
      {instructions && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-[#124734]" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-4">
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: instructions.replace(/\n/g, '<br />') }}
            />
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2 text-yellow-800">
            <Lightbulb className="w-4 h-4" />
            Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 pb-4">
          <ul className="text-sm text-yellow-900 space-y-1 list-disc list-inside">
            <li>Drag blocks from the toolbox on the left</li>
            <li>Connect blocks together to create programs</li>
            <li>Click <strong>Run</strong> to test your code</li>
            <li>Your work auto-saves every few seconds</li>
            <li>Click <strong>Submit</strong> when you&apos;re done</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
