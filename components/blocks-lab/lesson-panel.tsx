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
  const parseMarkdown = (text: string) => {
    if (!text) return '';
    
    // Basic markdown parsing
    return text
      // Headings
      .replace(/^### (.*$)/gim, '<h5 class="font-bold text-sm mt-3 mb-1">$1</h5>')
      .replace(/^## (.*$)/gim, '<h4 class="font-bold text-base mt-4 mb-2">$1</h4>')
      .replace(/^# (.*$)/gim, '<h3 class="font-bold text-lg mt-4 mb-2">$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\s*-\s+(.*)$/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\s*\d+\.\s+(.*)$/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Checkboxes
      .replace(/✅ (.*?)(?:\n|$)/g, '<div class="flex items-start gap-2 text-green-700 my-1"><span>✅</span><span>$1</span></div>')
      // Newlines
      .replace(/\n/g, '<br />');
  };

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
              dangerouslySetInnerHTML={{ __html: parseMarkdown(instructions) }}
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
