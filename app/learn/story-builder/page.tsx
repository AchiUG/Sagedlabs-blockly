'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Play, Square, RotateCcw, ChevronLeft, ChevronRight,
  BookOpen, Code, Brain, Lightbulb, Sparkles, Volume2, VolumeX,
  Eye, Footprints, MessageSquare, Wand2, HelpCircle
} from 'lucide-react';
import {
  CHARACTERS, SCENES, CHAPTERS, EMOTIONS, POSITIONS, EFFECTS,
  type StoryCharacter, type StoryChapter
} from '@/components/story-builder/story-data';

// ============================================================
// TYPES
// ============================================================

interface CharacterState {
  id: string;
  visible: boolean;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  emotion: string;
  facing: 'left' | 'right';
  message: string;
  messageTimer: number;
}

interface StageState {
  sceneId: string;
  characters: Record<string, CharacterState>;
  narratorText: string;
  effect: string | null;
  effectTimer: number;
}

interface AnimCommand {
  type: string;
  [key: string]: any;
}

// ============================================================
// SOUND HOOK
// ============================================================

function useStorySound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const play = useCallback((type: 'pop' | 'whoosh' | 'sparkle' | 'roar' | 'success') => {
    if (muted) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.15;

      switch (type) {
        case 'pop':
          osc.frequency.value = 600;
          osc.type = 'sine';
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          osc.start(); osc.stop(ctx.currentTime + 0.15);
          break;
        case 'whoosh':
          osc.frequency.value = 300;
          osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
          osc.type = 'sawtooth';
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start(); osc.stop(ctx.currentTime + 0.3);
          break;
        case 'sparkle':
          osc.frequency.value = 800;
          osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
          osc.type = 'sine';
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start(); osc.stop(ctx.currentTime + 0.3);
          break;
        case 'roar':
          osc.frequency.value = 100;
          osc.type = 'sawtooth';
          gain.gain.value = 0.2;
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start(); osc.stop(ctx.currentTime + 0.5);
          break;
        case 'success':
          osc.frequency.value = 523;
          osc.type = 'sine';
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
          setTimeout(() => {
            try {
              const o2 = ctx.createOscillator();
              const g2 = ctx.createGain();
              o2.connect(g2); g2.connect(ctx.destination);
              o2.frequency.value = 659; o2.type = 'sine';
              g2.gain.value = 0.15;
              g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
              o2.start(); o2.stop(ctx.currentTime + 0.4);
            } catch {}
          }, 200);
          osc.start(); osc.stop(ctx.currentTime + 0.6);
          break;
      }
    } catch {}
  }, [muted, getCtx]);

  return { play, muted, setMuted };
}

// ============================================================
// STAGE RENDERER COMPONENT
// ============================================================

function StoryStage({ state }: { state: StageState }) {
  const scene = SCENES.find(s => s.id === state.sceneId) || SCENES[0];

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-amber-300">
      {/* Background scene image */}
      <Image
        src={scene.background}
        alt={scene.name}
        fill
        className="object-cover"
        priority
      />

      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Scene label */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
        🎬 {scene.name}
      </div>

      {/* Characters */}
      {Object.values(state.characters).filter(c => c.visible).map(char => {
        const charData = CHARACTERS.find(ch => ch.id === char.id);
        if (!charData) return null;
        const emotion = EMOTIONS.find(e => e.id === char.emotion);

        return (
          <div
            key={char.id}
            className="absolute transition-all duration-700 ease-in-out"
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              transform: `translate(-50%, -50%) scaleX(${char.facing === 'left' ? -1 : 1})`,
            }}
          >
            {/* Speech bubble */}
            {char.message && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 animate-in fade-in slide-in-from-bottom-2 z-20"
                style={{ transform: `translateX(-50%) scaleX(${char.facing === 'left' ? -1 : 1})` }}
              >
                <div className="bg-white rounded-2xl px-4 py-2.5 shadow-lg border-2 border-gray-200 max-w-[220px] min-w-[100px] text-center relative">
                  <p className="text-sm font-medium text-gray-800 leading-tight">{char.message}</p>
                  {/* Bubble tail */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-gray-200 rotate-45" />
                </div>
              </div>
            )}

            {/* Character body */}
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-xl border-3 border-white/80"
                style={{ backgroundColor: charData.color }}
              >
                {charData.emoji}
              </div>
              {/* Emotion indicator */}
              {emotion && char.emotion !== 'happy' && (
                <span className="text-lg mt-0.5">{emotion.emoji}</span>
              )}
              {/* Name label */}
              <span
                className="mt-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm whitespace-nowrap"
                style={{ transform: `scaleX(${char.facing === 'left' ? -1 : 1})` }}
              >
                {charData.name.split(' ')[0]}
              </span>
            </div>
          </div>
        );
      })}

      {/* Narrator text */}
      {state.narratorText && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-8">
          <div className="flex items-start gap-2 max-w-lg mx-auto">
            <span className="text-2xl flex-shrink-0">📖</span>
            <p className="text-white text-sm md:text-base font-medium italic leading-relaxed">
              {state.narratorText}
            </p>
          </div>
        </div>
      )}

      {/* Effects overlay */}
      {state.effect && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {state.effect === 'sparkle' && (
            <div className="absolute inset-0 animate-pulse">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="absolute text-2xl animate-bounce"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  }}
                >
                  ✨
                </span>
              ))}
            </div>
          )}
          {state.effect === 'shake' && (
            <div className="absolute inset-0 animate-[shake_0.3s_ease-in-out_3]" />
          )}
          {state.effect === 'flash' && (
            <div className="absolute inset-0 bg-yellow-300/40 animate-pulse" />
          )}
          {state.effect === 'hearts' && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="absolute text-3xl animate-bounce"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  ❤️
                </span>
              ))}
            </div>
          )}
          {state.effect === 'question' && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="absolute text-4xl animate-bounce font-bold text-yellow-300"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${15 + Math.random() * 50}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  ?
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// BLOCKLY WORKSPACE COMPONENT
// ============================================================

function StoryBlocklyWorkspace({
  onCommandsChange,
  chapter,
}: {
  onCommandsChange: (commands: AnimCommand[]) => void;
  chapter: StoryChapter;
}) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const blocklyRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  // Register story-specific blocks
  const registerBlocks = useCallback((Blockly: any) => {
    if (!Blockly?.Blocks) return;

    const sceneOptions = SCENES.map(s => [s.name, s.id]);
    const charOptions = CHARACTERS.filter(c => c.id !== 'narrator').map(c => [`${c.emoji} ${c.name}`, c.id]);
    const emotionOptions = EMOTIONS.map(e => [e.label, e.id]);
    const positionOptions = POSITIONS.map(p => [p.label, p.id]);
    const effectOptions = EFFECTS.map(e => [e.label, e.id]);

    // Hat block
    Blockly.defineBlocksWithJsonArray([
      {
        type: 'story_when_start',
        message0: '🎬 When story begins %1 do %2',
        args0: [
          { type: 'input_dummy' },
          { type: 'input_statement', name: 'DO' },
        ],
        colour: 45,
        tooltip: 'Blocks inside run when you press Play',
      },
      {
        type: 'story_set_scene',
        message0: '🌅 Set scene to %1',
        args0: [{ type: 'field_dropdown', name: 'SCENE', options: sceneOptions }],
        previousStatement: null,
        nextStatement: null,
        colour: 160,
        tooltip: 'Change the background scene',
      },
      {
        type: 'story_show_character',
        message0: '👤 Show %1 at %2',
        args0: [
          { type: 'field_dropdown', name: 'CHAR', options: charOptions },
          { type: 'field_dropdown', name: 'POS', options: positionOptions },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 260,
        tooltip: 'Make a character appear on stage',
      },
      {
        type: 'story_hide_character',
        message0: '🚫 Hide %1',
        args0: [{ type: 'field_dropdown', name: 'CHAR', options: charOptions }],
        previousStatement: null,
        nextStatement: null,
        colour: 260,
        tooltip: 'Make a character disappear',
      },
      {
        type: 'story_move_character',
        message0: '➡️ Move %1 to %2',
        args0: [
          { type: 'field_dropdown', name: 'CHAR', options: charOptions },
          { type: 'field_dropdown', name: 'POS', options: positionOptions },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'Slide a character to a new position',
      },
      {
        type: 'story_say',
        message0: '💬 %1 says %2',
        args0: [
          { type: 'field_dropdown', name: 'CHAR', options: charOptions },
          { type: 'field_input', name: 'TEXT', text: 'Hello!' },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip: 'Make a character say something',
      },
      {
        type: 'story_narrator_say',
        message0: '📖 Narrator says %1',
        args0: [{ type: 'field_input', name: 'TEXT', text: 'Once upon a time...' }],
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip: 'Show narrator text at the bottom',
      },
      {
        type: 'story_emotion',
        message0: '😊 Set %1 emotion to %2',
        args0: [
          { type: 'field_dropdown', name: 'CHAR', options: charOptions },
          { type: 'field_dropdown', name: 'EMOTION', options: emotionOptions },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 330,
        tooltip: 'Change how a character feels',
      },
      {
        type: 'story_wait',
        message0: '⏱️ Wait %1 seconds',
        args0: [{ type: 'field_number', name: 'SECONDS', value: 1, min: 0.5, max: 5 }],
        previousStatement: null,
        nextStatement: null,
        colour: 20,
        tooltip: 'Pause the story',
      },
      {
        type: 'story_repeat',
        message0: '🔁 Repeat %1 times %2 do %3',
        args0: [
          { type: 'field_number', name: 'TIMES', value: 3, min: 1, max: 10 },
          { type: 'input_dummy' },
          { type: 'input_statement', name: 'DO' },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 20,
        tooltip: 'Repeat actions multiple times',
      },
      {
        type: 'story_effect',
        message0: '✨ Play effect %1',
        args0: [{ type: 'field_dropdown', name: 'EFFECT', options: effectOptions }],
        previousStatement: null,
        nextStatement: null,
        colour: 45,
        tooltip: 'Add a visual effect to the stage',
      },
      {
        type: 'story_if_signal',
        message0: '🧠 IF %1 is %2 %3 THEN do %4',
        args0: [
          { type: 'field_dropdown', name: 'CHAR', options: charOptions },
          { type: 'field_dropdown', name: 'EMOTION', options: emotionOptions },
          { type: 'input_dummy' },
          { type: 'input_statement', name: 'DO' },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 210,
        tooltip: 'AI Decision: Do something IF a character has a certain emotion',
      },
      {
        type: 'story_face_direction',
        message0: '👀 %1 face %2',
        args0: [
          { type: 'field_dropdown', name: 'CHAR', options: charOptions },
          { type: 'field_dropdown', name: 'DIR', options: [['Right ➡️', 'right'], ['Left ⬅️', 'left']] },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'Change which way a character faces',
      },
      {
        type: 'story_clear_messages',
        message0: '🧹 Clear all speech bubbles',
        previousStatement: null,
        nextStatement: null,
        colour: 290,
        tooltip: 'Remove all speech bubbles from the stage',
      },
    ]);
  }, []);

  // Build toolbox based on chapter
  const getToolbox = useCallback((chapterNum: number) => {
    const base: any[] = [
      {
        kind: 'category', name: '🎬 Story', colour: '#E6A817',
        contents: [
          { kind: 'block', type: 'story_when_start' },
          { kind: 'block', type: 'story_set_scene' },
          { kind: 'block', type: 'story_wait' },
          { kind: 'block', type: 'story_effect' },
        ],
      },
      {
        kind: 'category', name: '👤 Characters', colour: '#7C3AED',
        contents: [
          { kind: 'block', type: 'story_show_character' },
          { kind: 'block', type: 'story_hide_character' },
          { kind: 'block', type: 'story_move_character' },
          { kind: 'block', type: 'story_face_direction' },
          { kind: 'block', type: 'story_emotion' },
        ],
      },
      {
        kind: 'category', name: '💬 Dialogue', colour: '#EC4899',
        contents: [
          { kind: 'block', type: 'story_say' },
          { kind: 'block', type: 'story_narrator_say' },
          { kind: 'block', type: 'story_clear_messages' },
        ],
      },
    ];

    // Unlock categories progressively
    if (chapterNum >= 2) {
      base.push({
        kind: 'category', name: '🔁 Control', colour: '#F97316',
        contents: [
          { kind: 'block', type: 'story_repeat' },
          { kind: 'block', type: 'story_wait' },
        ],
      });
    }
    if (chapterNum >= 4) {
      base.push({
        kind: 'category', name: '🧠 AI Logic', colour: '#0EA5E9',
        contents: [
          { kind: 'block', type: 'story_if_signal' },
        ],
      });
    }

    return { kind: 'categoryToolbox', contents: base };
  }, []);

  // Extract commands from workspace
  const extractCommands = useCallback((workspace: any): AnimCommand[] => {
    if (!workspace) return [];
    const commands: AnimCommand[] = [];

    const extractBlock = (block: any): AnimCommand | null => {
      if (!block) return null;
      const type = block.type;

      switch (type) {
        case 'story_set_scene':
          return { type: 'SET_SCENE', scene: block.getFieldValue('SCENE') };
        case 'story_show_character':
          return { type: 'SHOW_CHAR', char: block.getFieldValue('CHAR'), pos: block.getFieldValue('POS') };
        case 'story_hide_character':
          return { type: 'HIDE_CHAR', char: block.getFieldValue('CHAR') };
        case 'story_move_character':
          return { type: 'MOVE_CHAR', char: block.getFieldValue('CHAR'), pos: block.getFieldValue('POS') };
        case 'story_say':
          return { type: 'SAY', char: block.getFieldValue('CHAR'), text: block.getFieldValue('TEXT') };
        case 'story_narrator_say':
          return { type: 'NARRATOR', text: block.getFieldValue('TEXT') };
        case 'story_emotion':
          return { type: 'EMOTION', char: block.getFieldValue('CHAR'), emotion: block.getFieldValue('EMOTION') };
        case 'story_wait':
          return { type: 'WAIT', seconds: block.getFieldValue('SECONDS') };
        case 'story_effect':
          return { type: 'EFFECT', effect: block.getFieldValue('EFFECT') };
        case 'story_face_direction':
          return { type: 'FACE', char: block.getFieldValue('CHAR'), dir: block.getFieldValue('DIR') };
        case 'story_clear_messages':
          return { type: 'CLEAR_MESSAGES' };
        case 'story_repeat': {
          const innerCmds: AnimCommand[] = [];
          let innerBlock = block.getInputTargetBlock('DO');
          while (innerBlock) {
            const cmd = extractBlock(innerBlock);
            if (cmd) innerCmds.push(cmd);
            innerBlock = innerBlock.getNextBlock();
          }
          return { type: 'REPEAT', times: block.getFieldValue('TIMES'), actions: innerCmds };
        }
        case 'story_if_signal': {
          const thenCmds: AnimCommand[] = [];
          let thenBlock = block.getInputTargetBlock('DO');
          while (thenBlock) {
            const cmd = extractBlock(thenBlock);
            if (cmd) thenCmds.push(cmd);
            thenBlock = thenBlock.getNextBlock();
          }
          return {
            type: 'IF_SIGNAL',
            char: block.getFieldValue('CHAR'),
            emotion: block.getFieldValue('EMOTION'),
            actions: thenCmds,
          };
        }
        default:
          return null;
      }
    };

    // Find all top-level hat blocks
    const topBlocks = workspace.getTopBlocks(true);
    for (const topBlock of topBlocks) {
      if (topBlock.type === 'story_when_start') {
        let block = topBlock.getInputTargetBlock('DO');
        while (block) {
          const cmd = extractBlock(block);
          if (cmd) commands.push(cmd);
          block = block.getNextBlock();
        }
      }
    }

    return commands;
  }, []);

  // Initialize Blockly
  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!blocklyDiv.current) return;

      try {
        const Blockly = await import('blockly');
        await import('blockly/blocks');

        if (!mounted) return;
        blocklyRef.current = Blockly;

        registerBlocks(Blockly);

        // Create workspace
        const workspace = Blockly.inject(blocklyDiv.current, {
          toolbox: getToolbox(chapter.id),
          grid: { spacing: 25, length: 3, colour: '#ddd', snap: true },
          zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 1.5, minScale: 0.5 },
          trashcan: true,
          sounds: false,
          renderer: 'zelos',
          theme: {
            name: 'story_theme',
            base: Blockly.Themes.Classic,
            fontStyle: { family: 'Inter, sans-serif', weight: '600', size: 12 },
          } as any,
        });

        workspaceRef.current = workspace;

        // Listen for changes
        workspace.addChangeListener(() => {
          const cmds = extractCommands(workspace);
          onCommandsChange(cmds);
        });

        setLoaded(true);

        // Set up category tab styling (color on click only)
        setTimeout(() => setupCategoryTabs(), 150);
      } catch (err) {
        console.error('Failed to load Blockly:', err);
      }
    }

    init();

    return () => {
      mounted = false;
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track which category ID is currently selected
  const selectedCatRef = useRef<string | null>(null);
  const colorMapRef = useRef<Record<string, string>>({});

  // Set up category tabs: capture colors, apply inline styles, add click listeners
  const setupCategoryTabs = useCallback(() => {
    if (!blocklyDiv.current) return;
    const cats = blocklyDiv.current.querySelectorAll('.blocklyToolboxCategory');
    if (!cats.length) return;

    // Get the toolbox element for width reference
    const toolbox = blocklyDiv.current.querySelector('.blocklyToolbox') as HTMLElement;
    const group = blocklyDiv.current.querySelector('.blocklyToolboxCategoryGroup') as HTMLElement;

    // Helper for !important inline styles
    const forceStyle = (el: HTMLElement, prop: string, val: string) => {
      el.style.setProperty(prop, val, 'important');
    };

    // Style the toolbox container
    if (toolbox) {
      forceStyle(toolbox, 'background', '#fafaf9');
      forceStyle(toolbox, 'border-right', '2px solid #e7e5e4');
      forceStyle(toolbox, 'padding', '16px 6px 8px 6px');
      forceStyle(toolbox, 'min-width', '130px');
      forceStyle(toolbox, 'overflow', 'auto');
    }
    if (group) {
      forceStyle(group, 'display', 'flex');
      forceStyle(group, 'flex-direction', 'column');
      forceStyle(group, 'gap', '6px');
      forceStyle(group, 'width', '100%');
    }
    // Also stretch the container
    const catContainer = blocklyDiv.current.querySelector('.blocklyToolboxCategoryContainer') as HTMLElement;
    if (catContainer) {
      forceStyle(catContainer, 'width', '100%');
    }

    // Step 1: Capture border-left colors BEFORE clearing them
    const colorMap: Record<string, string> = {};
    cats.forEach((cat: Element) => {
      const el = cat as HTMLElement;
      const id = el.id;
      const color = el.style.borderLeftColor;
      if (color && id) {
        colorMap[id] = color;
      }
    });
    colorMapRef.current = colorMap;

    // Step 2: Style all tabs with full-width inline styles using !important
    const setI = (el: HTMLElement, prop: string, val: string) => {
      el.style.setProperty(prop, val, 'important');
    };

    const styleTab = (el: HTMLElement, isSelected: boolean) => {
      const id = el.id;
      const color = colorMap[id] || '';
      const bg = isSelected && color ? color : 'transparent';
      const textColor = isSelected && color ? '#fff' : '#44403c';

      setI(el, 'padding', '8px 12px');
      setI(el, 'margin', '0');
      setI(el, 'border', 'none');
      setI(el, 'border-left', 'none');
      setI(el, 'border-radius', '6px');
      setI(el, 'cursor', 'pointer');
      setI(el, 'display', 'block');
      setI(el, 'width', '100%');
      setI(el, 'box-sizing', 'border-box');
      setI(el, 'white-space', 'nowrap');
      setI(el, 'background-color', bg);
      setI(el, 'box-shadow', isSelected ? '0 1px 4px rgba(0,0,0,0.15)' : 'none');
      setI(el, 'pointer-events', 'auto');
      el.setAttribute('data-selected', String(isSelected));

      const label = el.querySelector('.blocklyToolboxCategoryLabel') as HTMLElement;
      if (label) {
        setI(label, 'font-size', '13px');
        setI(label, 'font-weight', '600');
        setI(label, 'color', textColor);
        setI(label, 'white-space', 'nowrap');
        if (isSelected) {
          setI(label, 'text-shadow', '0 1px 2px rgba(0,0,0,0.2)');
        } else {
          label.style.removeProperty('text-shadow');
        }
      }

      const icon = el.querySelector('.blocklyToolboxCategoryIcon') as HTMLElement;
      if (icon) setI(icon, 'display', 'none');
    };

    // Step 3: Apply default unselected style to all
    cats.forEach((cat: Element) => {
      styleTab(cat as HTMLElement, false);
    });

    // Step 4: Function to apply selected state
    const applySelection = (selectedId: string | null) => {
      cats.forEach((cat: Element) => {
        const el = cat as HTMLElement;
        styleTab(el, el.id === selectedId);
      });
    };

    // Step 5: Add click listeners
    cats.forEach((cat: Element) => {
      const el = cat as HTMLElement;
      el.addEventListener('click', () => {
        const alreadySelected = selectedCatRef.current === el.id;
        selectedCatRef.current = alreadySelected ? null : el.id;
        applySelection(selectedCatRef.current);
      });
    });

    // Initially nothing selected
    selectedCatRef.current = null;
    applySelection(null);
  }, []);

  // Update toolbox when chapter changes
  useEffect(() => {
    if (workspaceRef.current && blocklyRef.current) {
      try {
        workspaceRef.current.updateToolbox(getToolbox(chapter.id));
        selectedCatRef.current = null;
        setTimeout(() => setupCategoryTabs(), 150);
      } catch {}
    }
  }, [chapter.id, getToolbox, setupCategoryTabs]);

  return (
    <div className="relative w-full h-full min-h-[300px]">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Loading Blockly workspace...</p>
          </div>
        </div>
      )}
      <div ref={blocklyDiv} className="w-full h-full rounded-xl overflow-hidden" />
    </div>
  );
}

// ============================================================
// MAIN STORY BUILDER PAGE
// ============================================================

export default function StoryBuilderPage() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [commands, setCommands] = useState<AnimCommand[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [commandIndex, setCommandIndex] = useState(-1);
  const [showHints, setShowHints] = useState(false);
  const playingRef = useRef(false);
  const sound = useStorySound();

  const chapter = CHAPTERS[currentChapter];

  // Create initial character states
  const createInitialCharacters = useCallback((): Record<string, CharacterState> => {
    const chars: Record<string, CharacterState> = {};
    CHARACTERS.forEach(c => {
      if (c.id !== 'narrator') {
        chars[c.id] = {
          id: c.id,
          visible: false,
          x: 50, y: 70,
          emotion: 'happy',
          facing: 'right',
          message: '',
          messageTimer: 0,
        };
      }
    });
    return chars;
  }, []);

  const [stageState, setStageState] = useState<StageState>({
    sceneId: chapter.sceneId,
    characters: createInitialCharacters(),
    narratorText: '',
    effect: null,
    effectTimer: 0,
  });

  // Reset stage for chapter
  const resetStage = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    setCommandIndex(-1);
    setStageState({
      sceneId: CHAPTERS[currentChapter].sceneId,
      characters: createInitialCharacters(),
      narratorText: '',
      effect: null,
      effectTimer: 0,
    });
  }, [currentChapter, createInitialCharacters]);

  // Execute a single command
  const executeCommand = useCallback((cmd: AnimCommand, state: StageState): StageState => {
    const newState = { ...state, characters: { ...state.characters } };

    switch (cmd.type) {
      case 'SET_SCENE':
        newState.sceneId = cmd.scene;
        sound.play('whoosh');
        break;

      case 'SHOW_CHAR': {
        const pos = POSITIONS.find(p => p.id === cmd.pos) || POSITIONS[0];
        newState.characters = {
          ...newState.characters,
          [cmd.char]: {
            ...newState.characters[cmd.char],
            visible: true,
            x: pos.x,
            y: pos.y,
          },
        };
        sound.play('pop');
        break;
      }

      case 'HIDE_CHAR':
        newState.characters = {
          ...newState.characters,
          [cmd.char]: { ...newState.characters[cmd.char], visible: false, message: '' },
        };
        break;

      case 'MOVE_CHAR': {
        const pos = POSITIONS.find(p => p.id === cmd.pos) || POSITIONS[0];
        const prev = newState.characters[cmd.char];
        newState.characters = {
          ...newState.characters,
          [cmd.char]: {
            ...prev,
            x: pos.x,
            y: pos.y,
            facing: pos.x > prev.x ? 'right' : pos.x < prev.x ? 'left' : prev.facing,
          },
        };
        sound.play('whoosh');
        break;
      }

      case 'SAY':
        newState.characters = {
          ...newState.characters,
          [cmd.char]: { ...newState.characters[cmd.char], message: cmd.text },
        };
        sound.play('pop');
        break;

      case 'NARRATOR':
        newState.narratorText = cmd.text;
        break;

      case 'EMOTION':
        newState.characters = {
          ...newState.characters,
          [cmd.char]: { ...newState.characters[cmd.char], emotion: cmd.emotion },
        };
        break;

      case 'EFFECT':
        newState.effect = cmd.effect;
        newState.effectTimer = 2;
        sound.play('sparkle');
        break;

      case 'FACE':
        newState.characters = {
          ...newState.characters,
          [cmd.char]: { ...newState.characters[cmd.char], facing: cmd.dir },
        };
        break;

      case 'CLEAR_MESSAGES':
        Object.keys(newState.characters).forEach(id => {
          newState.characters[id] = { ...newState.characters[id], message: '' };
        });
        newState.narratorText = '';
        break;

      case 'IF_SIGNAL': {
        const charState = newState.characters[cmd.char];
        if (charState && charState.emotion === cmd.emotion) {
          let s = newState;
          for (const action of (cmd.actions || [])) {
            s = executeCommand(action, s);
          }
          return s;
        }
        break;
      }
    }

    return newState;
  }, [sound]);

  // Flatten commands (expand REPEATs)
  const flattenCommands = useCallback((cmds: AnimCommand[]): AnimCommand[] => {
    const flat: AnimCommand[] = [];
    for (const cmd of cmds) {
      if (cmd.type === 'REPEAT') {
        const times = cmd.times || 1;
        for (let i = 0; i < times; i++) {
          flat.push(...flattenCommands(cmd.actions || []));
        }
      } else {
        flat.push(cmd);
      }
    }
    return flat;
  }, []);

  // Play animation
  const playAnimation = useCallback(async () => {
    if (commands.length === 0) return;

    playingRef.current = true;
    setIsPlaying(true);

    // Reset first
    let state: StageState = {
      sceneId: CHAPTERS[currentChapter].sceneId,
      characters: createInitialCharacters(),
      narratorText: '',
      effect: null,
      effectTimer: 0,
    };
    setStageState(state);
    setCommandIndex(0);

    const flat = flattenCommands(commands);

    for (let i = 0; i < flat.length; i++) {
      if (!playingRef.current) break;

      setCommandIndex(i);
      const cmd = flat[i];

      if (cmd.type === 'WAIT') {
        await new Promise(r => setTimeout(r, (cmd.seconds || 1) * 1000));
        continue;
      }

      state = executeCommand(cmd, state);
      setStageState({ ...state });

      // Clear effect after delay
      if (cmd.type === 'EFFECT') {
        setTimeout(() => {
          setStageState(prev => ({ ...prev, effect: null }));
        }, 2000);
      }

      // Pause between commands for readability
      await new Promise(r => setTimeout(r, 800));
    }

    // Finished
    if (playingRef.current) {
      sound.play('success');
    }
    playingRef.current = false;
    setIsPlaying(false);
    setCommandIndex(-1);
  }, [commands, currentChapter, createInitialCharacters, executeCommand, flattenCommands, sound]);

  const stopAnimation = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    setCommandIndex(-1);
  }, []);

  // Chapter navigation
  const goToChapter = useCallback((idx: number) => {
    if (idx >= 0 && idx < CHAPTERS.length) {
      setCurrentChapter(idx);
      playingRef.current = false;
      setIsPlaying(false);
      setCommandIndex(-1);
      setStageState({
        sceneId: CHAPTERS[idx].sceneId,
        characters: createInitialCharacters(),
        narratorText: '',
        effect: null,
        effectTimer: 0,
      });
    }
  }, [createInitialCharacters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white px-4 py-3 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/learn/young-sages-games" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <span className="text-2xl">🐰</span> Leuk&apos;s Story Builder
              </h1>
              <p className="text-amber-200 text-xs">Week 4 • Animate the Leuk the Hare Story with Code Blocks</p>
            </div>
          </div>

          {/* Chapter selector */}
          <div className="flex items-center gap-2">
            {CHAPTERS.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => goToChapter(i)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  i === currentChapter
                    ? 'bg-white text-amber-700 shadow-lg scale-110'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {ch.id}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => sound.setMuted(!sound.muted)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {sound.muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4">
        {/* Chapter Title Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline" size="sm"
              onClick={() => goToChapter(currentChapter - 1)}
              disabled={currentChapter === 0}
              className="border-amber-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{chapter.title}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                  <Code className="w-3 h-3 mr-1" /> {chapter.objectives.codingConcept}
                </Badge>
                <Badge variant="outline" className="border-purple-300 text-purple-700 text-xs">
                  <Brain className="w-3 h-3 mr-1" /> {chapter.objectives.aiConcept.split(':')[0]}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline" size="sm"
              onClick={() => goToChapter(currentChapter + 1)}
              disabled={currentChapter === CHAPTERS.length - 1}
              className="border-amber-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={isPlaying ? stopAnimation : playAnimation}
              className={isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}
              disabled={commands.length === 0 && !isPlaying}
            >
              {isPlaying ? (
                <><Square className="w-4 h-4 mr-2" /> Stop</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Play Story</>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={resetStage} className="border-amber-300">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Layout: Stage + Lesson Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Stage */}
          <div className="lg:col-span-2">
            <StoryStage state={stageState} />

            {/* Command progress indicator */}
            {isPlaying && commands.length > 0 && (
              <div className="mt-2 bg-white rounded-lg p-2 border border-amber-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-600">Playing command {commandIndex + 1} of {flattenCommands(commands).length}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${((commandIndex + 1) / flattenCommands(commands).length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Panel */}
          <div className="space-y-3">
            {/* Story Narrative */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-amber-900 text-sm">The Story</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  {chapter.narrative}
                </p>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-700" />
                  <h3 className="font-bold text-blue-900 text-sm">Your Mission</h3>
                </div>
                <p className="text-sm text-gray-700 mb-3">{chapter.objectives.text}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 bg-white/70 rounded-lg p-2">
                    <Code className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-blue-800">Coding Concept</p>
                      <p className="text-xs text-gray-600">{chapter.objectives.codingConcept}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-white/70 rounded-lg p-2">
                    <Brain className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-purple-800">AI Concept</p>
                      <p className="text-xs text-gray-600">{chapter.objectives.aiConcept}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dialogue Hints */}
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 w-full"
                >
                  <HelpCircle className="w-4 h-4 text-green-700" />
                  <h3 className="font-bold text-green-900 text-sm">Dialogue Ideas</h3>
                  <ChevronRight className={`w-4 h-4 text-green-600 ml-auto transition-transform ${showHints ? 'rotate-90' : ''}`} />
                </button>
                {showHints && (
                  <div className="mt-3 space-y-1.5">
                    {chapter.dialogueHints.map((hint, i) => (
                      <div key={i} className="bg-white/70 rounded-lg px-3 py-2 text-xs text-gray-700 italic">
                        {hint}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Characters Reference */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Characters
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {CHARACTERS.filter(c => c.id !== 'narrator').map(c => (
                    <div key={c.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <span className="text-xl">{c.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{c.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-gray-500">{c.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Blockly Workspace */}
        <Card className="border-amber-200 shadow-lg">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-700" />
              <h3 className="font-bold text-amber-900 text-sm">Code Blocks</h3>
              <span className="text-xs text-amber-600">Drag blocks to build your animation</span>
            </div>
            <div className="flex items-center gap-2">
              {commands.length > 0 && (
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                  {commands.length} block{commands.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          <div className="h-[350px]">
            <StoryBlocklyWorkspace
              onCommandsChange={setCommands}
              chapter={chapter}
            />
          </div>
        </Card>

        {/* Concept Reminder Bar */}
        <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-center gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-800">Observe</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-purple-800">Think</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <Footprints className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-green-800">Act</span>
            </div>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-xs text-gray-500 italic">Every intelligent system follows this loop!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
