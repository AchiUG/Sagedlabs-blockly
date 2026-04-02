'use client';

import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Save, Send, Loader2 } from 'lucide-react';

interface LabToolbarProps {
  isRunning: boolean;
  isSaving: boolean;
  isSubmitted: boolean;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onSave: () => void;
  onSubmit: () => void;
  lastSaved?: Date | null;
}

export default function LabToolbar({
  isRunning,
  isSaving,
  isSubmitted,
  onRun,
  onStop,
  onReset,
  onSave,
  onSubmit,
  lastSaved,
}: LabToolbarProps) {
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-2">
        {/* Run/Stop buttons */}
        {isRunning ? (
          <Button
            onClick={onStop}
            variant="destructive"
            size="sm"
            className="gap-1"
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={onRun}
            className="gap-1 bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Play className="w-4 h-4" />
            Run
          </Button>
        )}

        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={isRunning}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>

        {/* Save status */}
        {lastSaved && (
          <span className="text-xs text-gray-500 ml-2">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Save button */}
        <Button
          onClick={onSave}
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={isSaving || isSubmitted}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        {/* Submit button */}
        <Button
          onClick={onSubmit}
          size="sm"
          className="gap-1 bg-[#124734] hover:bg-[#0d3526]"
          disabled={isSaving || isSubmitted}
        >
          <Send className="w-4 h-4" />
          {isSubmitted ? 'Submitted' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}
