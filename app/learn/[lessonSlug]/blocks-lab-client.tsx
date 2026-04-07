'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

import { BlocksValidationService, ValidationResult } from '@/lib/services/blocks-validation-service';
import BlocklyWorkspace, { BlocklyWorkspaceHandle } from '@/components/blocks-lab/blockly-workspace';

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
  nextLessonSlug: string | null;
  project: {
    id: string;
    workspace: any;
    generatedCode: string | null;
    status: string;
    updatedAt: string;
  } | null;
  userId: string;
}

export default function BlocksLabClient({ lesson, nextLessonSlug, project, userId }: BlocksLabClientProps) {
  const router = useRouter();
  const interpreterRef = useRef<CommandInterpreter | null>(null);
  const blocklyRef = useRef<BlocklyWorkspaceHandle>(null);
  
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  // Handle workspace changes
  const handleWorkspaceChange = useCallback((newWorkspace: any, newCommands: any[]) => {
    setWorkspace(newWorkspace);
    setCommands(newCommands);
    
    // Auto-validate locally for feedback
    const result = BlocksValidationService.validate(lesson.slug, JSON.stringify(newCommands));
    setValidation(result);
  }, [lesson.slug]);

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
  const saveProject = async (workspaceOverride?: any, commandsOverride?: any[]) => {
    if (isSubmitted) return null;

    setIsSaving(true);
    try {
      const response = await fetch('/api/blocks/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          workspace: workspaceOverride || workspace,
          generatedCode: JSON.stringify(commandsOverride || commands),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLastSaved(new Date());
        return data.project;
      } else {
        toast.error(data.error || 'Failed to save');
        return null;
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save project');
      return null;
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
  const handleReset = useCallback(async () => {
    // 1. Stop current execution
    if (interpreterRef.current) {
      interpreterRef.current.stop();
      interpreterRef.current = null;
    }
    setIsRunning(false);

    // 2. Reset the Stage (sprite position)
    setStageState(createInitialState(lesson.stageConfig));

    // 3. Immediately sync the reset state to the database (Hard Reset)
    try {
      const response = await fetch('/api/blocks/projects/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
        }),
      });

      if (response.ok) {
        // 4. Reset local status states
        setWorkspace(null); // Clear first
        setCommands([]);
        setLastSaved(null);
        setReflection('');
        setValidation(null);
        
        // 5. Use a small delay to ensure the above state changes are processed
        // before we toggle isSubmitted, which triggers the component re-mount via 'key'
        setTimeout(() => {
          setIsSubmitted(false);
          setWorkspace(lesson.starterWorkspace);
          toast.success('Workspace and progress reset to original state');
        }, 50);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to reset progress');
      }
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('Failed to reset project');
    }
  }, [lesson.id, lesson.stageConfig, lesson.starterWorkspace]);

  // Open submit dialog with fresh validation
  const handleOpenSubmitDialog = () => {
    if (blocklyRef.current) {
      const currentCommands = blocklyRef.current.getCommands();
      const result = BlocksValidationService.validate(lesson.slug, JSON.stringify(currentCommands));
      setValidation(result);
      setCommands(currentCommands);
    }
    setShowSubmitDialog(true);
  };

  // Submit project
  const handleSubmit = async () => {
    let currentCommands = commands;
    if (blocklyRef.current) {
      currentCommands = blocklyRef.current.getCommands();
    }

    const currentValidation = BlocksValidationService.validate(lesson.slug, JSON.stringify(currentCommands));
    setValidation(currentValidation);
    
    if (!currentValidation.isValid) {
      toast.error(currentValidation.message);
      return;
    }

    setIsSubmitting(true);
    try {
      const savedProject = await saveProject(workspace, currentCommands);

      if (!savedProject) {
        toast.error('Could not save project before submitting');
        return;
      }

      const response = await fetch('/api/blocks/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          projectId: savedProject.id,
          reflection,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setShowSubmitDialog(false);
        toast.success('🎉 Project submitted successfully! You found the solution.');
      } else {
        toast.error(data.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get toolbox config
  const toolbox = lesson.blockConfig || defaultToolbox;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <Link
          href="/learn"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Courses
        </Link>
      </div>

      <LabToolbar
        isRunning={isRunning}
        isSaving={isSaving}
        isSubmitted={isSubmitted}
        onRun={handleRun}
        onStop={handleStop}
        onReset={handleReset}
        onSave={saveProject}
        onSubmit={handleOpenSubmitDialog}
        lastSaved={lastSaved}
        nextLessonSlug={nextLessonSlug}
      />

      <div className="flex-1 flex min-h-0" style={{ overflow: 'visible' }}>
        <div className="w-72 flex-shrink-0 min-h-0 border-r border-gray-200 bg-white overflow-y-auto">
          <LessonPanel
            title={lesson.title}
            description={lesson.description}
            instructions={lesson.instructions}
          />
        </div>

        <div className="flex-1 min-h-0" style={{ position: 'relative', minHeight: '600px' }}>
          <BlocklyWorkspace
            key={isSubmitted ? 'submitted' : 'draft'}
            ref={blocklyRef}
            initialWorkspace={workspace}
            starterWorkspace={lesson.starterWorkspace}
            toolboxConfig={toolbox}
            onWorkspaceChange={handleWorkspaceChange}
            readOnly={isSubmitted}
          />
        </div>

        <div className="w-[520px] flex-shrink-0 p-4 bg-gray-50 border-l border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Stage</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
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

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Project</DialogTitle>
            <DialogDescription>
              Once submitted, you won&apos;t be able to edit your project. Make sure you&apos;re happy with it!
            </DialogDescription>
          </DialogHeader>

          {validation && (
            <div className={`mt-4 p-4 rounded-lg border flex items-start gap-3 ${
              validation.isValid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-orange-200 text-orange-800'
            }`}>
              <div className={`mt-0.5 p-1 rounded-full ${validation.isValid ? 'bg-green-100' : 'bg-orange-100'}`}>
                {validation.isValid ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {validation.isValid ? 'Solution Complete!' : 'Solution Incomplete'}
                </p>
                <p className="text-sm opacity-90">{validation.message}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Reflection (optional)</label>
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
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={`gap-2 ${validation?.isValid ? 'bg-[#124734] hover:bg-[#0d3526]' : 'bg-orange-600 hover:bg-orange-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Project'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
