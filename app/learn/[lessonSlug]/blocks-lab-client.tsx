'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/navigation/header';
import LabToolbar from '@/components/blocks-lab/lab-toolbar';
import LessonPanel from '@/components/blocks-lab/lesson-panel';
import StageCanvas from '@/components/blocks-lab/stage-canvas';
import { CommandInterpreter, createInitialState, StageState } from '@/components/blocks-lab/command-interpreter';
import { defaultToolbox } from '@/components/blocks-lab/toolbox-config';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';

// Dynamically import BlocklyWorkspace to avoid SSR issues
const BlocklyWorkspace = dynamic(
  () => import('@/components/blocks-lab/blockly-workspace'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#124734]"></div></div> }
);

interface BlocksLabClientProps {
  lesson: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    instructions: string | null;
    starterWorkspace: any;
    stageConfig: any;
    blockConfig: any;
  };
  project: {
    id: string;
    workspace: any;
    generatedCode: string | null;
    status: string;
    updatedAt: string;
  } | null;
  userId: string;
}

export default function BlocksLabClient({ lesson, project, userId }: BlocksLabClientProps) {
  const router = useRouter();
  const interpreterRef = useRef<CommandInterpreter | null>(null);
  
  // State
  const [workspace, setWorkspace] = useState<any>(project?.workspace || lesson.starterWorkspace || null);
  const [commands, setCommands] = useState<any[]>([]);
  const [stageState, setStageState] = useState<StageState>(() => createInitialState(lesson.stageConfig));
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(project?.status === 'SUBMITTED');
  const [lastSaved, setLastSaved] = useState<Date | null>(project ? new Date(project.updatedAt) : null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle workspace changes
  const handleWorkspaceChange = useCallback((newWorkspace: any, newCommands: any[]) => {
    setWorkspace(newWorkspace);
    setCommands(newCommands);
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!workspace || isSubmitted) return;

    const saveTimer = setTimeout(async () => {
      await saveProject();
    }, 5000); // Auto-save every 5 seconds after changes

    return () => clearTimeout(saveTimer);
  }, [workspace, isSubmitted]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (interpreterRef.current && isRunning) {
        interpreterRef.current.handleKeyDown(e.code);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (interpreterRef.current && isRunning) {
        interpreterRef.current.handleKeyUp(e.code);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRunning]);

  // Save project
  const saveProject = async () => {
    if (isSubmitted) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/blocks/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          workspace,
          generatedCode: JSON.stringify(commands),
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  // Run program
  const handleRun = useCallback(() => {
    if (commands.length === 0) {
      toast.error('No blocks to run! Add some blocks first.');
      return;
    }

    // Reset state and create new interpreter
    const initialState = createInitialState(lesson.stageConfig);
    setStageState(initialState);

    interpreterRef.current = new CommandInterpreter(commands, initialState);
    interpreterRef.current.start((newState) => {
      setStageState({ ...newState });
    });

    setIsRunning(true);
    toast.success('Program started!');
  }, [commands, lesson.stageConfig]);

  // Stop program
  const handleStop = useCallback(() => {
    if (interpreterRef.current) {
      interpreterRef.current.stop();
      interpreterRef.current = null;
    }
    setIsRunning(false);
    toast.info('Program stopped');
  }, []);

  // Reset stage
  const handleReset = useCallback(() => {
    if (interpreterRef.current) {
      interpreterRef.current.stop();
      interpreterRef.current = null;
    }
    setIsRunning(false);
    setStageState(createInitialState(lesson.stageConfig));
    toast.info('Stage reset');
  }, [lesson.stageConfig]);

  // Submit project
  const handleSubmit = async () => {
    // First save
    await saveProject();

    try {
      // Get project ID
      const projectResponse = await fetch(`/api/blocks/projects?lessonId=${lesson.id}`);
      const projectData = await projectResponse.json();

      if (!projectData.project) {
        toast.error('Please save your project first');
        return;
      }

      const response = await fetch('/api/blocks/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          projectId: projectData.project.id,
          reflection,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setShowSubmitDialog(false);
        toast.success('🎉 Project submitted successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit project');
    }
  };

  // Get toolbox config
  const toolbox = lesson.blockConfig || defaultToolbox;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      {/* Back link */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <Link
          href="/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Courses
        </Link>
      </div>

      {/* Toolbar */}
      <LabToolbar
        isRunning={isRunning}
        isSaving={isSaving}
        isSubmitted={isSubmitted}
        onRun={handleRun}
        onStop={handleStop}
        onReset={handleReset}
        onSave={saveProject}
        onSubmit={() => setShowSubmitDialog(true)}
        lastSaved={lastSaved}
      />

      {/* Main content */}
      <div className="flex-1 flex" style={{ overflow: 'visible' }}>
        {/* Lesson Panel (left) */}
        <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          <LessonPanel
            title={lesson.title}
            description={lesson.description}
            instructions={lesson.instructions}
          />
        </div>

        {/* Blockly Workspace (center) — explicit height so Blockly has a concrete container */}
        <div className="flex-1" style={{ position: 'relative', minHeight: '600px' }}>
          <BlocklyWorkspace
            initialWorkspace={workspace}
            toolboxConfig={toolbox}
            onWorkspaceChange={handleWorkspaceChange}
            readOnly={isSubmitted}
          />
        </div>

        {/* Stage (right) */}
        <div className="w-[520px] flex-shrink-0 p-4 bg-gray-50 border-l border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Stage</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
          <StageCanvas
            state={stageState}
            width={lesson.stageConfig?.width || 480}
            height={lesson.stageConfig?.height || 360}
          />
          {isRunning && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Use arrow keys to control the sprite
            </p>
          )}
        </div>
      </div>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Project</DialogTitle>
            <DialogDescription>
              Once submitted, you won&apos;t be able to edit your project. Make sure you&apos;re happy with it!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Reflection (optional)
              </label>
              <Textarea
                placeholder="What did you learn? What was challenging?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#124734] hover:bg-[#0d3526]"
            >
              Submit Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
