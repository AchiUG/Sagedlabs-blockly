'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, RotateCcw, Trophy, Users, Eye, Brain, Footprints, Sparkles, Timer, Zap, Shield, Heart, AlertTriangle, Star, Volume2, VolumeX, RefreshCw, GripVertical, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Sound effects using Web Audio API - Enhanced with animal sounds
type SoundType = 'reveal' | 'success' | 'danger' | 'tick' | 'powerup' | 'roar' | 'combo' | 'switch' | 
  'lion_growl' | 'lion_prowl' | 'lion_angry' | 'lion_tired' | 'lion_curious' |
  'hare_hop' | 'hare_run' | 'hare_think' | 'hare_trick' | 'card_flip';

const useSound = () => {
  const playSound = useCallback((type: SoundType) => {
    if (typeof window === 'undefined') return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // For complex sounds, we may use multiple oscillators
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      switch (type) {
        case 'reveal':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case 'success':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
        case 'danger':
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'tick':
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
        case 'powerup':
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
        case 'roar':
        case 'lion_angry':
          // Deep aggressive lion sound
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.7);
          gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.8);
          break;
        case 'lion_growl':
          // Low rumbling growl
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(90, audioContext.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(110, audioContext.currentTime + 0.4);
          oscillator.frequency.exponentialRampToValueAtTime(70, audioContext.currentTime + 0.6);
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.7);
          break;
        case 'lion_prowl':
          // Stealthy padding sound
          oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(80, audioContext.currentTime + 0.15);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.25);
          // Second step
          setTimeout(() => {
            const ctx2 = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc2 = ctx2.createOscillator();
            const g2 = ctx2.createGain();
            osc2.connect(g2);
            g2.connect(ctx2.destination);
            osc2.frequency.setValueAtTime(100, ctx2.currentTime);
            osc2.frequency.setValueAtTime(70, ctx2.currentTime + 0.15);
            g2.gain.setValueAtTime(0.2, ctx2.currentTime);
            g2.gain.exponentialRampToValueAtTime(0.01, ctx2.currentTime + 0.25);
            osc2.start();
            osc2.stop(ctx2.currentTime + 0.25);
          }, 300);
          break;
        case 'lion_tired':
          // Yawn-like sound
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.3);
          oscillator.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.5);
          oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.8);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.9);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.9);
          break;
        case 'lion_curious':
          // Inquisitive chirp-like sound
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(350, audioContext.currentTime + 0.1);
          oscillator.frequency.exponentialRampToValueAtTime(280, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'hare_hop':
          // Quick bouncy hop
          oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.08);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.15);
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case 'hare_run':
          // Fast scampering
          for (let i = 0; i < 4; i++) {
            setTimeout(() => {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const g = ctx.createGain();
              osc.connect(g);
              g.connect(ctx.destination);
              osc.frequency.setValueAtTime(600 + i * 50, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
              g.gain.setValueAtTime(0.15, ctx.currentTime);
              g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
              osc.start();
              osc.stop(ctx.currentTime + 0.08);
            }, i * 80);
          }
          break;
        case 'hare_think':
          // Contemplative hum
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(350, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(380, audioContext.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(360, audioContext.currentTime + 0.4);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
        case 'hare_trick':
          // Mischievous chime
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(900, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(700, audioContext.currentTime + 0.15);
          oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.25);
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.35);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.35);
          break;
        case 'card_flip':
          // Card turning sound
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05);
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'combo':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.08);
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.16);
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.24);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
        case 'switch':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
      }
    } catch (e) {
      // Audio not supported
    }
  }, []);
  return { playSound };
};

// ==================== PATTERN ENGINE ====================

interface Pattern {
  id: string;
  label: string;
  description: string;
  priority: number;
  // Signal matching rules
  requiredSignals?: string[]; // ALL must be present (lowercase partial match)
  anyOfSignals?: string[];    // At least one must be present
  minMatchSignals?: { signals: string[]; count: number }; // At least N of these
  // Actions
  correctActions: string[];
  wrongActions: string[];
  // Outcomes
  successOutcome: string;
  failureOutcome: string;
  teachingPoint: string;
}

const PATTERNS: Pattern[] = [
  {
    id: 'aggressive_attack',
    label: 'Aggressive Attack',
    description: 'The Lion is openly aggressive and dangerous.',
    priority: 90,
    minMatchSignals: {
      signals: ['roaring', 'angry', 'running fast', 'charging', 'charges'],
      count: 2
    },
    correctActions: ['distraction', 'direction', 'rock'],
    wrongActions: ['freeze', 'pool', 'quietly', 'slowly'],
    successOutcome: "🏃 The Hare survives by breaking the Lion's momentum!",
    failureOutcome: "😰 The Hare reacts too slowly and the Lion closes in!",
    teachingPoint: "When danger is obvious and aggressive, speed and confusion help escape."
  },
  {
    id: 'silent_hunt',
    label: 'Silent Hunt',
    description: 'The Lion is stalking quietly.',
    priority: 100,
    requiredSignals: ['quiet'],
    anyOfSignals: ['grass', 'circling', 'slowly', 'silent'],
    correctActions: ['grass', 'freeze', 'quietly', 'observe'],
    wrongActions: ['distraction', 'pool', 'noise', 'loudly'],
    successOutcome: "🤫 The Hare avoids detection by staying quiet and hidden!",
    failureOutcome: "😰 Noise or sudden movement reveals the Hare's position!",
    teachingPoint: "When predators hunt silently, careless movement gives you away."
  },
  {
    id: 'reflection_opportunity',
    label: 'Reflection Trick Opportunity',
    description: 'The environment creates a chance to use the pool reflection.',
    priority: 70,
    requiredSignals: ['pool'],
    minMatchSignals: {
      signals: ['staring', 'watching pool', 'roaring', 'bright', 'still water', 'water still'],
      count: 1
    },
    correctActions: ['pool', 'reflection'],
    wrongActions: ['freeze', 'grass', 'rock'],
    successOutcome: "💧 The Lion is distracted by the reflection and the Hare escapes!",
    failureOutcome: "😅 The Hare misses the chance to use the environment wisely.",
    teachingPoint: "Observation can reveal useful tools in the environment."
  },
  {
    id: 'suspicious_lion',
    label: 'Suspicious Lion',
    description: 'The Lion has learned and is watching for the Hare\'s usual trick.',
    priority: 110,
    minMatchSignals: {
      signals: ['watching feet', 'watching hare', 'pauses', 'seen pool before', 'remembers'],
      count: 2
    },
    correctActions: ['direction', 'distraction', 'unexpected', 'observe'],
    wrongActions: ['reflection', 'pool', 'freeze', 'obvious'],
    successOutcome: "🎯 The Hare avoids predictability and escapes using a new pattern!",
    failureOutcome: "🦁 The Lion anticipates the Hare's move and gains the advantage!",
    teachingPoint: "When opponents learn your pattern, predictability becomes dangerous."
  },
  {
    id: 'ambush_trap',
    label: 'Ambush / Trap',
    description: 'The Lion looks calm but is setting a trap.',
    priority: 95,
    minMatchSignals: {
      signals: ['lies down', 'pretends', 'ignores', 'circling', 'waiting', 'bushes', 'dense'],
      count: 2
    },
    correctActions: ['observe', 'quietly', 'direction'],
    wrongActions: ['toward lion', 'loud', 'straight', 'open'],
    successOutcome: "👀 The Hare notices the trap and avoids rushing into danger!",
    failureOutcome: "😰 The Hare mistakes calm for safety and is nearly caught!",
    teachingPoint: "Calm signals can hide danger. Patience is wisdom."
  },
  {
    id: 'environmental_escape',
    label: 'Environmental Escape',
    description: 'The best answer is to use nearby terrain for protection.',
    priority: 60,
    minMatchSignals: {
      signals: ['grass', 'rock', 'wind', 'cloud', 'cover', 'dense'],
      count: 2
    },
    anyOfSignals: ['slowly', 'watching', 'quiet'],
    correctActions: ['grass', 'rock', 'quietly'],
    wrongActions: ['open', 'noise', 'pool', 'loudly'],
    successOutcome: "🌿 The Hare uses the environment to reduce the Lion's advantage!",
    failureOutcome: "🏜️ The Hare chooses exposed movement and becomes easier to track!",
    teachingPoint: "The environment can be part of your strategy. Use it wisely."
  },
  {
    id: 'lion_learned_pool',
    label: 'Lion Learned - Pool Trick Fails',
    description: 'The Lion has adapted and the old pool trick no longer works.',
    priority: 120,
    requiredSignals: ['pool'],
    minMatchSignals: {
      signals: ['remembers', 'watching hare', 'not water', 'learned', 'seen before'],
      count: 1
    },
    correctActions: ['distraction', 'direction', 'unexpected', 'path'],
    wrongActions: ['reflection', 'pool', 'freeze'],
    successOutcome: "🧠 The Hare updates strategy and escapes with a new move!",
    failureOutcome: "🦁 The Hare repeats an outdated trick and nearly gets caught!",
    teachingPoint: "Intelligence is not just memory. It is updating memory when patterns change."
  },
  {
    id: 'pool_not_ideal',
    label: 'Pool Not Ready',
    description: 'The pool water is disturbed - reflections won\'t work well right now.',
    priority: 85,
    requiredSignals: ['pool'],
    anyOfSignals: ['moving', 'ripples', 'wind', 'muddy', 'cloudy'],
    correctActions: ['observe', 'wait', 'quietly', 'grass'],
    wrongActions: ['pool', 'reflection', 'toward pool'],
    successOutcome: "⏳ The Hare waits patiently for conditions to improve - wisdom in patience!",
    failureOutcome: "🌊 The Hare rushes to the pool but the reflection is too blurry to fool the Lion!",
    teachingPoint: "Even good strategies fail in wrong conditions. Patience means waiting for the right moment."
  }
];

// Pattern detection engine
function detectPattern(signals: string[]): Pattern | null {
  const signalText = signals.join(' ').toLowerCase();
  
  let matchedPatterns: Pattern[] = [];
  
  for (const pattern of PATTERNS) {
    let matches = true;
    
    // Check required signals (all must be present)
    if (pattern.requiredSignals) {
      for (const req of pattern.requiredSignals) {
        if (!signalText.includes(req.toLowerCase())) {
          matches = false;
          break;
        }
      }
    }
    
    if (!matches) continue;
    
    // Check anyOf signals (at least one must be present)
    if (pattern.anyOfSignals && pattern.anyOfSignals.length > 0) {
      const hasAny = pattern.anyOfSignals.some(s => signalText.includes(s.toLowerCase()));
      if (!hasAny) matches = false;
    }
    
    if (!matches) continue;
    
    // Check minMatch signals (need N matches from list)
    if (pattern.minMatchSignals) {
      const count = pattern.minMatchSignals.signals.filter(s => 
        signalText.includes(s.toLowerCase())
      ).length;
      if (count < pattern.minMatchSignals.count) matches = false;
    }
    
    if (matches) {
      matchedPatterns.push(pattern);
    }
  }
  
  // Return highest priority pattern
  if (matchedPatterns.length > 0) {
    matchedPatterns.sort((a, b) => b.priority - a.priority);
    return matchedPatterns[0];
  }
  
  return null;
}

// Check if action matches pattern
function evaluateAction(action: string, pattern: Pattern | null): {
  isCorrect: boolean;
  isWrong: boolean;
} {
  const actionLower = action.toLowerCase();
  
  if (!pattern) {
    // No pattern detected, use general logic
    return { isCorrect: false, isWrong: false };
  }
  
  const isCorrect = pattern.correctActions.some(a => actionLower.includes(a.toLowerCase()));
  const isWrong = pattern.wrongActions.some(a => actionLower.includes(a.toLowerCase()));
  
  return { isCorrect, isWrong };
}

// Game selection screen
export default function YoungSagesGamesPage() {
  const [selectedGame, setSelectedGame] = useState<'menu' | 'observer' | 'memory' | 'strategy' | 'logic_chain'>('menu');

  if (selectedGame === 'observer') {
    return <ObserverGame onBack={() => setSelectedGame('menu')} />;
  }

  if (selectedGame === 'memory') {
    return <MemoryGame onBack={() => setSelectedGame('menu')} />;
  }

  if (selectedGame === 'strategy') {
    return <StrategyArenaGame onBack={() => setSelectedGame('menu')} />;
  }

  if (selectedGame === 'logic_chain') {
    return <LogicChainGame onBack={() => setSelectedGame('menu')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-amber-100 text-amber-800 px-6 py-3 rounded-full text-lg font-medium mb-6">
            <span className="text-3xl">🐰</span>
            Young Sages Interactive Games
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Classroom Card Games
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Teacher-controlled interactive games for teaching AI thinking through storytelling
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Game 1 */}
          <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setSelectedGame('observer')}>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-8 h-8" />
                <span className="text-xl font-bold">Week 1</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">The Observer</h2>
              <p className="text-emerald-100 text-sm">Eyes → Brain → Feet</p>
            </div>
            <CardContent className="p-5">
              <p className="text-gray-600 mb-3 text-sm">
                Learn that observation must come before reaction. Teams work together as an intelligent system.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-4 h-4" />
                <span>Team-based turns</span>
              </div>
              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 mr-2" /> Start Game
              </Button>
            </CardContent>
          </Card>

          {/* Game 2 */}
          <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setSelectedGame('memory')}>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-8 h-8" />
                <span className="text-xl font-bold">Week 2</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Memory & Updating</h2>
              <p className="text-purple-100 text-sm">Patterns • Memory • Adaptation</p>
            </div>
            <CardContent className="p-5">
              <p className="text-gray-600 mb-3 text-sm">
                Intelligence comes from updating memory when the world changes. Learn to adapt!
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>Drag & drop memory</span>
              </div>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 mr-2" /> Start Game
              </Button>
            </CardContent>
          </Card>

          {/* Game 3 - Strategy Arena */}
          <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setSelectedGame('strategy')}>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-8 h-8" />
                <span className="text-xl font-bold">Week 3</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Strategy Arena</h2>
              <p className="text-orange-100 text-sm">IF → THEN • Rules • Strategy</p>
            </div>
            <CardContent className="p-5">
              <p className="text-gray-600 mb-3 text-sm">
                Build IF-THEN decision rules. Turn knowledge into strategy to outsmart the Lion!
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Rule building + Boss rounds</span>
              </div>
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 mr-2" /> Start Game
              </Button>
            </CardContent>
          </Card>

          {/* Game 4 - Logic Chain (NEW) */}
          <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group ring-2 ring-yellow-400 ring-offset-2" onClick={() => setSelectedGame('logic_chain')}>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">NEW!</div>
              <div className="flex items-center gap-3 mb-3">
                <GripVertical className="w-8 h-8" />
                <span className="text-xl font-bold">Week 4</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Logic Chain Arena</h2>
              <p className="text-cyan-100 text-sm">IF → THEN → DO • Drag & Drop</p>
            </div>
            <CardContent className="p-5">
              <p className="text-gray-600 mb-3 text-sm">
                Three teams compete! Drag cards to build logic chains: Signals → Patterns → Strategy!
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-blue-500" /> Eyes</span>
                <span className="flex items-center gap-1"><Brain className="w-3 h-3 text-purple-500" /> Brain</span>
                <span className="flex items-center gap-1"><Footprints className="w-3 h-3 text-green-500" /> Feet</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>5 Difficulty Levels • Team Competition</span>
              </div>
              <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 mr-2" /> Start Game
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Story Builder - Special Feature Card */}
        <div className="max-w-5xl mx-auto mt-8">
          <Link href="/learn/story-builder">
            <Card className="overflow-hidden hover:shadow-2xl transition-all cursor-pointer group border-2 border-amber-400 ring-2 ring-amber-200 ring-offset-2">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white text-amber-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">✨ NEW!</div>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">🐰</span>
                  <div>
                    <p className="text-amber-100 text-sm font-medium mb-1">Week 4+ • Blockly Story Animator</p>
                    <h2 className="text-2xl md:text-3xl font-bold">Leuk&apos;s Story Builder</h2>
                    <p className="text-amber-100 text-sm mt-1">Animate the tale of Leuk the Hare using code blocks!</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 bg-gradient-to-r from-amber-50 to-orange-50">
                <p className="text-gray-600 mb-3 text-sm">
                  Use Blockly code blocks to bring the Leuk the Hare story to life! Set scenes, move characters,
                  add dialogue, and learn coding concepts (sequence, loops, conditionals) and AI thinking (observe → think → act).
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    <Eye className="w-3 h-3" /> 5 Chapters
                  </span>
                  <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    <Brain className="w-3 h-3" /> AI Concepts
                  </span>
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" /> Visual Coding
                  </span>
                  <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3" /> Guided Lessons
                  </span>
                </div>
                <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700 group-hover:scale-[1.02] transition-transform text-base py-5">
                  <Play className="w-5 h-5 mr-2" /> Open Story Builder
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link href="/learn">
            <Button variant="outline" size="lg">
              <ChevronLeft className="w-4 h-4 mr-2" /> Back to Blocks Lab
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==================== GAME 1: THE OBSERVER ====================

interface GameProps {
  onBack: () => void;
}

const SITUATION_SIGNALS = [
  "Lion roaring loudly",
  "Lion circling slowly",
  "Tall grass nearby",
  "Pool nearby",
  "Birds suddenly fly away",
  "Lion watching Hare's feet",
  "Lion very quiet",
  "Lion moves silently",
  "Lion pretends to ignore Hare",
  "Hyena laughing nearby",
  "Large rock nearby",
  "Forest suddenly quiet",
  "Wind changes direction",
  "Sun setting behind trees",
  "Other animals running",
  "The sun is very bright",
  "The sky is cloudy",
  "The wind is strong",
  "The grass is very tall",
  "The ground is muddy",
  "The rocks are slippery",
  "The path is narrow",
  "The pool water is very still",
  "The pool water is moving",
  "The pool has ripples from the wind",
  "The forest is quiet",
  "The forest is noisy",
  "The trees are dense",
  "The area is open",
  "The ground has many holes",
  "The area smells like another animal"
];

const ACTION_OPTIONS = [
  { action: "Hide in tall grass", icon: "🌿" },
  { action: "Run toward pool", icon: "💧" },
  { action: "Freeze completely", icon: "🧊" },
  { action: "Create distraction", icon: "🎭" },
  { action: "Change direction suddenly", icon: "↩️" },
  { action: "Move quietly away", icon: "🤫" },
  { action: "Climb rock", icon: "🪨" },
  { action: "Observe longer", icon: "👀" },
  { action: "Wait patiently", icon: "⏳" }
];

const OUTCOMES = [
  { type: 'success', message: "Excellent observation! The Hare escapes safely! 🎉", points: 3 },
  { type: 'partial', message: "Good thinking! The Hare survives but used extra energy. 😅", points: 1 },
  { type: 'danger', message: "The Lion gets closer... Better observation needed! 😰", points: 0 }
];

// Team configuration
const TEAM_CONFIG = {
  team1: { name: 'Team Hare', emoji: '🐰', bg: 'from-blue-500 to-blue-600', color: 'blue', bgLight: 'bg-blue-500/30', border: 'border-blue-400' },
  team2: { name: 'Team Eagle', emoji: '🦅', bg: 'from-green-500 to-green-600', color: 'green', bgLight: 'bg-green-500/30', border: 'border-green-400' },
  team3: { name: 'Team Tortoise', emoji: '🐢', bg: 'from-purple-500 to-purple-600', color: 'purple', bgLight: 'bg-purple-500/30', border: 'border-purple-400' }
};

type TeamKey = 'team1' | 'team2' | 'team3';

// Power cards for teams
const POWER_CARDS = [
  { id: 'extra_time', name: 'Extra Time', icon: '⏰', description: '+15 seconds to discuss' },
  { id: 'hint', name: 'Wise Owl Hint', icon: '🦉', description: 'Get a hint about the pattern' },
  { id: 'double_points', name: 'Double Points', icon: '✨', description: '2x points this round' },
  { id: 'shield', name: 'Protection Shield', icon: '🛡️', description: 'No danger this round' },
];

function ObserverGame({ onBack }: GameProps) {
  const { playSound } = useSound();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [phase, setPhase] = useState<'intro' | 'story' | 'round' | 'observation' | 'brain' | 'action' | 'outcome' | 'end'>('intro');
  const [round, setRound] = useState(1);
  const [turnInRound, setTurnInRound] = useState(0); // 0, 1, 2 for team1, team2, team3
  const [currentTeam, setCurrentTeam] = useState<TeamKey>('team1');
  const [numTeams, setNumTeams] = useState(3);
  const [scores, setScores] = useState({ team1: 0, team2: 0, team3: 0 });
  const [currentSignals, setCurrentSignals] = useState<string[]>([]);
  const [usedSignals, setUsedSignals] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<typeof OUTCOMES[0] | null>(null);
  const [cardsRevealed, setCardsRevealed] = useState(0);
  const [dangerLevel, setDangerLevel] = useState(0);
  const [comboCount, setComboCount] = useState({ team1: 0, team2: 0, team3: 0 });
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [powerCardActive, setPowerCardActive] = useState<string | null>(null);
  const [teamPowerCards, setTeamPowerCards] = useState({ team1: ['extra_time'], team2: ['hint'], team3: ['shield'] });
  const [shakeScreen, setShakeScreen] = useState(false);
  const [lionDistance, setLionDistance] = useState(100);
  // Pattern Engine State
  const [detectedPattern, setDetectedPattern] = useState<Pattern | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const maxRounds = 5;
  const discussionTime = 30;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            if (soundEnabled) playSound('danger');
            return 0;
          }
          if (prev <= 5 && soundEnabled) playSound('tick');
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, soundEnabled, playSound]);

  const getTeamKeys = (): TeamKey[] => {
    const teams: TeamKey[] = ['team1', 'team2', 'team3'];
    return teams.slice(0, numTeams);
  };

  const drawSignals = () => {
    const available = SITUATION_SIGNALS.filter(s => !usedSignals.has(s));
    const shuffled = available.length >= 3 
      ? [...available].sort(() => Math.random() - 0.5)
      : [...SITUATION_SIGNALS].sort(() => Math.random() - 0.5);
    const newSignals = shuffled.slice(0, 3);
    setCurrentSignals(newSignals);
    setUsedSignals(prev => new Set([...prev, ...newSignals]));
    setCardsRevealed(0);
    setShowActions(false);
    setSelectedOutcome(null);
    setPowerCardActive(null);
    setLionDistance(prev => Math.max(20, prev - 15));
    // Detect pattern using the pattern engine
    setDetectedPattern(detectPattern(newSignals));
    setSelectedAction('');
  };

  const replaceSignal = (index: number) => {
    if (soundEnabled) playSound('switch');
    const available = SITUATION_SIGNALS.filter(s => !currentSignals.includes(s) && !usedSignals.has(s));
    if (available.length === 0) return;
    const newSignal = available[Math.floor(Math.random() * available.length)];
    const newSignals = [...currentSignals];
    newSignals[index] = newSignal;
    setCurrentSignals(newSignals);
    setUsedSignals(prev => new Set([...prev, newSignal]));
    // Re-detect pattern after signal replacement
    setDetectedPattern(detectPattern(newSignals));
  };

  const revealNextCard = () => {
    if (cardsRevealed < 3) {
      if (soundEnabled) playSound('reveal');
      setCardsRevealed(prev => prev + 1);
    }
  };

  const startDiscussionTimer = () => {
    const extraTime = powerCardActive === 'extra_time' ? 15 : 0;
    setTimer(discussionTime + extraTime);
    setTimerActive(true);
  };

  const getHint = () => {
    // Pattern-aware hints
    if (detectedPattern) {
      switch (detectedPattern.id) {
        case 'aggressive_attack':
          return "🦉 The Lion is aggressive! Speed and unpredictability help escape.";
        case 'silent_hunt':
          return "🦉 It's very quiet... movement could give away your position!";
        case 'reflection_opportunity':
          return "🦉 The pool might be useful... if conditions are right!";
        case 'suspicious_lion':
          return "🦉 The Lion seems suspicious... don't be predictable!";
        case 'ambush_trap':
          return "🦉 Something feels off... take time to observe!";
        case 'environmental_escape':
          return "🦉 The environment offers cover... use it wisely!";
        case 'lion_learned_pool':
          return "🦉 The Lion remembers old tricks... try something new!";
      }
    }
    
    // Fallback hints
    const hasGrass = currentSignals.some(s => s.toLowerCase().includes('grass'));
    const hasPool = currentSignals.some(s => s.toLowerCase().includes('pool') || s.toLowerCase().includes('water'));
    const isDangerous = currentSignals.some(s => s.toLowerCase().includes('quiet') || s.toLowerCase().includes('silently'));
    const isOpen = currentSignals.some(s => s.toLowerCase().includes('open'));
    
    if (isDangerous) return "🦉 The Lion seems very focused... be careful!";
    if (hasGrass) return "🦉 Tall grass can hide small animals...";
    if (hasPool) return "🦉 Water can be useful for escape...";
    if (isOpen) return "🦉 Open areas are risky for the Hare!";
    return "🦉 Look carefully at the environment signals!";
  };

  const revealOutcome = (teamChoice: string) => {
    setTimerActive(false);
    setSelectedAction(teamChoice);
    
    // Use Pattern Engine for evaluation
    const { isCorrect, isWrong } = evaluateAction(teamChoice, detectedPattern);
    
    let outcome;
    let isSuccess = false;
    
    if (detectedPattern) {
      // Pattern-based evaluation
      if (isCorrect) {
        outcome = {
          type: 'success' as const,
          message: detectedPattern.successOutcome,
          points: 3
        };
        isSuccess = true;
      } else if (isWrong) {
        outcome = {
          type: 'danger' as const,
          message: detectedPattern.failureOutcome,
          points: 0
        };
      } else {
        // Action is neither correct nor explicitly wrong
        outcome = {
          type: 'partial' as const,
          message: "😅 Not the best choice, but the Hare survives. Think about the pattern!",
          points: 1
        };
      }
    } else {
      // Fallback to general logic if no pattern detected
      const hasGrass = currentSignals.some(s => s.toLowerCase().includes('grass'));
      const hasPool = currentSignals.some(s => s.toLowerCase().includes('pool') || s.toLowerCase().includes('water'));
      const hasRock = currentSignals.some(s => s.toLowerCase().includes('rock'));
      const lionQuiet = currentSignals.some(s => s.toLowerCase().includes('quiet'));
      
      if ((teamChoice.includes('grass') && hasGrass) ||
          (teamChoice.includes('pool') && hasPool) ||
          (teamChoice.includes('rock') && hasRock) ||
          (teamChoice.includes('Observe') && lionQuiet)) {
        outcome = OUTCOMES[0];
        isSuccess = true;
      } else {
        outcome = Math.random() > 0.4 ? OUTCOMES[1] : OUTCOMES[2];
      }
    }
    
    // Apply power card effects
    if (powerCardActive === 'shield' && !isSuccess) {
      outcome = { type: 'partial' as const, message: "🛡️ Shield activated! The Hare is protected this round.", points: 1 };
    }
    
    if (isSuccess && powerCardActive === 'double_points') {
      outcome = { ...outcome, points: outcome.points * 2, message: outcome.message + ' (DOUBLE POINTS! ✨)' };
    }
    
    if (isSuccess || outcome.type === 'success') {
      if (soundEnabled) playSound('success');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setDangerLevel(prev => Math.max(0, prev - 1));
      setLionDistance(prev => Math.min(100, prev + 10));
      setComboCount(prev => ({ ...prev, [currentTeam]: prev[currentTeam] + 1 }));
    } else {
      if (soundEnabled) playSound('danger');
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);
      setDangerLevel(prev => Math.min(5, prev + 1));
      setLionDistance(prev => Math.max(10, prev - 20));
      setComboCount(prev => ({ ...prev, [currentTeam]: 0 }));
    }
    
    setSelectedOutcome(outcome);
  };

  const awardPoints = () => {
    if (!selectedOutcome) return;
    const points = selectedOutcome.points;
    const bonusPoints = comboCount[currentTeam] >= 2 ? 1 : 0;
    
    if (soundEnabled) playSound('combo');
    setScores(prev => ({ ...prev, [currentTeam]: prev[currentTeam] + points + bonusPoints }));
  };

  const usePowerCard = (cardId: string) => {
    if (soundEnabled) playSound('powerup');
    setPowerCardActive(cardId);
    setTeamPowerCards(prev => ({
      ...prev,
      [currentTeam]: prev[currentTeam].filter(c => c !== cardId)
    }));
  };

  const nextTurn = () => {
    const teams = getTeamKeys();
    const nextTurnInRound = turnInRound + 1;
    
    if (nextTurnInRound >= teams.length) {
      // All teams played this round, move to next round
      if (round >= maxRounds) {
        setPhase('end');
      } else {
        setRound(prev => prev + 1);
        setTurnInRound(0);
        setCurrentTeam(teams[0]);
        setPhase('round');
        drawSignals();
      }
    } else {
      // Next team's turn in same round
      setTurnInRound(nextTurnInRound);
      setCurrentTeam(teams[nextTurnInRound]);
      setPhase('round');
      drawSignals();
    }
  };

  const resetGame = () => {
    setPhase('intro');
    setRound(1);
    setTurnInRound(0);
    setCurrentTeam('team1');
    setScores({ team1: 0, team2: 0, team3: 0 });
    setCurrentSignals([]);
    setUsedSignals(new Set());
    setShowActions(false);
    setSelectedOutcome(null);
    setDangerLevel(0);
    setComboCount({ team1: 0, team2: 0, team3: 0 });
    setLionDistance(100);
    setTeamPowerCards({ team1: ['extra_time'], team2: ['hint'], team3: ['shield'] });
    setDetectedPattern(null);
    setSelectedAction('');
  };

  const teamConfig = TEAM_CONFIG[currentTeam];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 text-white ${shakeScreen ? 'animate-shake' : ''}`}>
      {showConfetti && <Confetti />}
      
      {/* Top Bar */}
      <div className="bg-black/30 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" /> Menu
          </Button>
          <Button variant="ghost" onClick={() => setSoundEnabled(!soundEnabled)} className="text-white hover:bg-white/20" size="sm">
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Current Team Indicator */}
          {phase !== 'intro' && phase !== 'story' && phase !== 'end' && (
            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${teamConfig.bg} animate-pulse`}>
              <span className="text-lg font-bold">{teamConfig.emoji} {teamConfig.name}'s Turn</span>
            </div>
          )}
          
          {/* Lion Distance Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦁</span>
            <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${lionDistance > 60 ? 'bg-green-500' : lionDistance > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${100 - lionDistance}%` }}
              />
            </div>
            <span className="text-2xl">🐰</span>
          </div>
          
          {/* Danger Level */}
          <div className="flex items-center gap-1">
            <AlertTriangle className={`w-5 h-5 ${dangerLevel > 3 ? 'text-red-500 animate-pulse' : dangerLevel > 1 ? 'text-yellow-500' : 'text-green-500'}`} />
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`w-2 h-4 rounded ${i <= dangerLevel ? 'bg-red-500' : 'bg-gray-600'}`} />
              ))}
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/20" />
          
          <div className="text-center">
            <div className="text-xs text-emerald-300">Round</div>
            <div className="text-xl font-bold">{round}/{maxRounds}</div>
          </div>
          
          <div className="h-8 w-px bg-white/20" />
          
          {/* Timer */}
          {timerActive && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timer <= 5 ? 'bg-red-500/50 animate-pulse' : 'bg-white/10'}`}>
              <Timer className="w-4 h-4" />
              <span className="text-xl font-mono font-bold">{timer}s</span>
            </div>
          )}
          
          <TeamScoreboard scores={scores} numTeams={numTeams} comboCount={comboCount} currentTeam={currentTeam} />
        </div>
        
        <Button variant="ghost" onClick={resetGame} className="text-white hover:bg-white/20" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* INTRO SLIDE */}
        {phase === 'intro' && (
          <SlideCard>
            <div className="text-center">
              <div className="text-6xl mb-6">🦁 🐰</div>
              <h1 className="text-5xl font-bold mb-6">The Observer</h1>
              <p className="text-2xl text-emerald-200 mb-8">Week 1: Learning to See Before Acting</p>
              
              <div className="bg-white/10 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">The Intelligent System</h2>
                <div className="flex items-center justify-center gap-4 text-xl">
                  <div className="flex flex-col items-center">
                    <Eye className="w-12 h-12 text-emerald-300 mb-2" />
                    <span className="font-bold">Eyes</span>
                    <span className="text-sm text-emerald-300">Observation</span>
                  </div>
                  <ChevronRight className="w-8 h-8 text-emerald-400" />
                  <div className="flex flex-col items-center">
                    <Brain className="w-12 h-12 text-purple-300 mb-2" />
                    <span className="font-bold">Brain</span>
                    <span className="text-sm text-purple-300">Pattern</span>
                  </div>
                  <ChevronRight className="w-8 h-8 text-emerald-400" />
                  <div className="flex flex-col items-center">
                    <Footprints className="w-12 h-12 text-orange-300 mb-2" />
                    <span className="font-bold">Feet</span>
                    <span className="text-sm text-orange-300">Action</span>
                  </div>
                </div>
              </div>
              
              {/* Game Reference - All Cards */}
              <div className="bg-white/5 rounded-2xl p-6 mb-8 max-w-5xl mx-auto">
                <h3 className="text-2xl font-bold mb-6 text-emerald-300">📋 Game Reference - All Cards</h3>
                
                {/* Signals */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3 text-left flex items-center gap-2">
                    <Eye className="w-5 h-5" /> Possible Signals ({SITUATION_SIGNALS.length})
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-left">
                    {SITUATION_SIGNALS.map((signal, i) => (
                      <div key={i} className="bg-blue-500/20 rounded-lg p-2 text-sm border border-blue-400/30">
                        👁️ {signal}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Actions */}
                <div>
                  <h4 className="text-lg font-bold mb-3 text-left flex items-center gap-2">
                    <Footprints className="w-5 h-5" /> Possible Actions ({ACTION_OPTIONS.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ACTION_OPTIONS.map((action, i) => (
                      <div key={i} className="bg-orange-500/20 rounded-lg p-3 text-sm border border-orange-400/30 flex items-center gap-2">
                        <span className="text-xl">{action.icon}</span>
                        <span>{action.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Instructor Answer Key */}
              <div className="bg-red-500/10 border-2 border-red-400/50 rounded-2xl p-6 mb-8 max-w-5xl mx-auto">
                <h3 className="text-2xl font-bold mb-2 text-red-300 flex items-center gap-2">
                  🔑 Instructor Answer Key
                </h3>
                <p className="text-sm text-red-200 mb-6">For teacher reference only - do not show to students!</p>
                
                <div className="space-y-4 text-left">
                  {PATTERNS.map((pattern) => (
                    <div key={pattern.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg text-yellow-300">{pattern.label}</h4>
                        <span className="text-xs bg-purple-500/30 px-2 py-1 rounded">Priority: {pattern.priority}</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{pattern.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-blue-300 font-semibold">🔍 Trigger Signals:</span>
                          <ul className="ml-4 mt-1 text-gray-300">
                            {pattern.requiredSignals && (
                              <li>Required: <span className="text-blue-200">{pattern.requiredSignals.join(', ')}</span></li>
                            )}
                            {pattern.anyOfSignals && (
                              <li>Any of: <span className="text-blue-200">{pattern.anyOfSignals.join(', ')}</span></li>
                            )}
                            {pattern.minMatchSignals && (
                              <li>At least {pattern.minMatchSignals.count} of: <span className="text-blue-200">{pattern.minMatchSignals.signals.join(', ')}</span></li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <div className="mb-2">
                            <span className="text-green-300 font-semibold">✅ Correct Actions:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pattern.correctActions.map((a, i) => (
                                <span key={i} className="bg-green-500/30 px-2 py-0.5 rounded text-green-200 text-xs">{a}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-red-300 font-semibold">❌ Wrong Actions:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pattern.wrongActions.map((a, i) => (
                                <span key={i} className="bg-red-500/30 px-2 py-0.5 rounded text-red-200 text-xs">{a}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <span className="text-purple-300 font-semibold">💡 Teaching Point:</span>
                        <p className="text-purple-200 text-sm mt-1 italic">"{pattern.teachingPoint}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Team Selection */}
              <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <h3 className="font-bold mb-4">How many teams?</h3>
                <div className="flex justify-center gap-4">
                  {[2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => setNumTeams(n)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        numTeams === n ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {n} Teams
                    </button>
                  ))}
                </div>
              </div>
              
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-xl px-8 py-6" onClick={() => setPhase('story')}>
                Begin Story <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* STORY SLIDE */}
        {phase === 'story' && (
          <SlideCard>
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-8xl mb-8">🌍</div>
              <h2 className="text-4xl font-bold mb-8">The Savanna Story</h2>
              <div className="bg-white/10 rounded-2xl p-8 mb-8 text-left">
                <p className="text-2xl leading-relaxed mb-6">
                  "A <span className="text-amber-300 font-bold">Lion</span> is hunting a <span className="text-emerald-300 font-bold">Hare</span> in the forest."
                </p>
                <p className="text-2xl leading-relaxed">
                  "The Hare survives not because it is <span className="text-red-300">strong</span>, but because it <span className="text-emerald-300 font-bold">observes carefully</span>."
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-8">
                <p className="text-lg text-emerald-200">
                  Teams take turns. Each team will act as the Hare's intelligent system!
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  {getTeamKeys().map((team, i) => (
                    <div key={team} className={`px-4 py-2 rounded-lg ${TEAM_CONFIG[team].bgLight} ${TEAM_CONFIG[team].border} border`}>
                      {TEAM_CONFIG[team].emoji} {TEAM_CONFIG[team].name}
                    </div>
                  ))}
                </div>
              </div>
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-xl px-8 py-6" onClick={() => { setPhase('round'); drawSignals(); }}>
                Start Playing <Play className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* ROUND - SIGNALS */}
        {phase === 'round' && (
          <SlideCard>
            <div className="text-center">
              {/* Team Turn Banner */}
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${teamConfig.bg} mb-6`}>
                <span className="text-3xl">{teamConfig.emoji}</span>
                <span className="text-2xl font-bold">{teamConfig.name}'s Turn</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-2">Round {round}</h2>
              <p className="text-xl text-emerald-300 mb-8">👀 Observation Phase - What do you see?</p>
              
              <div className="flex justify-center gap-6 mb-8">
                {currentSignals.map((signal, i) => (
                  <div key={i} className="relative">
                    <div
                      className={`transform transition-all duration-500 ${
                        i < cardsRevealed ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                      }`}
                    >
                      <GameCard type="signal" content={signal} revealed={i < cardsRevealed} />
                    </div>
                    {/* Replace Signal Button */}
                    {i < cardsRevealed && (
                      <button
                        onClick={() => replaceSignal(i)}
                        className="absolute -top-2 -right-2 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-full shadow-lg transition-all hover:scale-110"
                        title="Replace this signal"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4">
                {cardsRevealed < 3 ? (
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600" onClick={revealNextCard}>
                    Reveal Signal {cardsRevealed + 1} <Eye className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button size="lg" className="bg-purple-500 hover:bg-purple-600" onClick={() => setPhase('brain')}>
                    Discuss Patterns <Brain className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </SlideCard>
        )}

        {/* BRAIN PHASE */}
        {phase === 'brain' && (
          <SlideCard>
            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${teamConfig.bg} mb-4`}>
                <span className="text-2xl">{teamConfig.emoji}</span>
                <span className="text-xl font-bold">{teamConfig.name}'s Discussion</span>
              </div>
              
              <Brain className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Brain Phase</h2>
              <p className="text-xl text-purple-300 mb-6">{teamConfig.name}: Discuss what pattern you see!</p>
              
              <div className="flex justify-center gap-6 mb-6">
                {currentSignals.map((signal, i) => (
                  <div key={i} className="relative">
                    <GameCard type="signal" content={signal} revealed={true} small />
                    <button
                      onClick={() => replaceSignal(i)}
                      className="absolute -top-1 -right-1 bg-amber-500 hover:bg-amber-600 text-white p-1 rounded-full shadow-lg transition-all hover:scale-110"
                      title="Replace"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Power Cards Section */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 max-w-xl mx-auto">
                <h3 className="text-sm font-bold text-yellow-400 mb-3">⚡ {teamConfig.name}'s Power Cards</h3>
                <div className="flex justify-center gap-2">
                  {teamPowerCards[currentTeam].map(cardId => {
                    const card = POWER_CARDS.find(c => c.id === cardId);
                    return card ? (
                      <button
                        key={cardId}
                        onClick={() => usePowerCard(cardId)}
                        className="bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-400 rounded-lg p-3 transition-all hover:scale-105"
                        title={card.description}
                      >
                        <span className="text-2xl">{card.icon}</span>
                        <div className="text-xs mt-1">{card.name}</div>
                      </button>
                    ) : null;
                  })}
                  {teamPowerCards[currentTeam].length === 0 && (
                    <span className="text-gray-500 text-sm">No cards remaining</span>
                  )}
                </div>
                {powerCardActive && (
                  <div className="mt-3 text-yellow-300 animate-pulse">
                    ✨ {POWER_CARDS.find(c => c.id === powerCardActive)?.name} activated!
                  </div>
                )}
              </div>
              
              {/* Hint Display */}
              {powerCardActive === 'hint' && (
                <div className="bg-amber-500/20 border border-amber-400 rounded-xl p-4 mb-6 max-w-xl mx-auto animate-in fade-in">
                  <p className="text-lg">{getHint()}</p>
                </div>
              )}
              
              <div className="bg-white/10 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
                <p className="text-xl">🤔 What is the Lion planning?</p>
                {!timerActive ? (
                  <Button className="mt-4 bg-purple-500 hover:bg-purple-600" onClick={startDiscussionTimer}>
                    <Timer className="w-4 h-4 mr-2" /> Start Timer ({discussionTime + (powerCardActive === 'extra_time' ? 15 : 0)}s)
                  </Button>
                ) : (
                  <div className="mt-3">
                    <div className="text-3xl font-mono font-bold">{timer}s</div>
                    <div className="w-48 h-2 bg-gray-600 rounded-full mx-auto mt-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${timer <= 5 ? 'bg-red-500' : timer <= 15 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${(timer / (discussionTime + (powerCardActive === 'extra_time' ? 15 : 0))) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600" onClick={() => { setPhase('action'); setShowActions(true); }}>
                Choose Action <Footprints className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* ACTION PHASE */}
        {phase === 'action' && (
          <SlideCard>
            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${teamConfig.bg} mb-4`}>
                <span className="text-2xl">{teamConfig.emoji}</span>
                <span className="text-xl font-bold">{teamConfig.name} Chooses</span>
              </div>
              
              <Footprints className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Action Phase</h2>
              <p className="text-xl text-orange-300 mb-8">What should the Hare do?</p>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                {ACTION_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all hover:scale-105"
                    onClick={() => { revealOutcome(opt.action); setPhase('outcome'); }}
                  >
                    <div className="text-3xl mb-2">{opt.icon}</div>
                    <div className="text-sm font-medium">{opt.action}</div>
                  </button>
                ))}
              </div>
              
              <p className="text-emerald-200">Teacher: Click the action chosen by {teamConfig.name}</p>
            </div>
          </SlideCard>
        )}

        {/* OUTCOME PHASE */}
        {phase === 'outcome' && selectedOutcome && (
          <SlideCard>
            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${teamConfig.bg} mb-4`}>
                <span className="text-2xl">{teamConfig.emoji}</span>
                <span className="text-xl font-bold">{teamConfig.name}'s Result</span>
              </div>
              
              {/* Pattern Detection Display */}
              {detectedPattern && (
                <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-4 mb-4 max-w-xl mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-300" />
                    <span className="text-purple-200 font-medium">Pattern Detected:</span>
                    <span className="text-purple-100 font-bold">{detectedPattern.label}</span>
                  </div>
                  <p className="text-sm text-purple-200/80">{detectedPattern.description}</p>
                </div>
              )}
              
              <div className={`text-8xl mb-6 animate-bounce`}>
                {selectedOutcome.type === 'success' ? '🎉' : selectedOutcome.type === 'partial' ? '😅' : '😰'}
              </div>
              <h2 className={`text-4xl font-bold mb-4 ${
                selectedOutcome.type === 'success' ? 'text-emerald-300' : 
                selectedOutcome.type === 'partial' ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {selectedOutcome.type === 'success' ? 'Success!' : 
                 selectedOutcome.type === 'partial' ? 'Partial Success' : 'Danger!'}
              </h2>
              <p className="text-2xl mb-6">{selectedOutcome.message}</p>
              
              {/* Teaching Point */}
              {detectedPattern && (
                <div className="bg-amber-500/20 border border-amber-400/50 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-200 font-bold">Teaching Point</span>
                  </div>
                  <p className="text-lg text-amber-100">{detectedPattern.teachingPoint}</p>
                </div>
              )}
              
              <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-lg mx-auto">
                <p className="text-lg mb-4">
                  {teamConfig.emoji} {teamConfig.name} earns {selectedOutcome.points} point{selectedOutcome.points !== 1 ? 's' : ''}
                  {comboCount[currentTeam] >= 2 && selectedOutcome.type === 'success' && (
                    <span className="text-yellow-400"> + 1 combo bonus! 🔥</span>
                  )}
                </p>
                <Button onClick={awardPoints} className={`bg-gradient-to-r ${teamConfig.bg} hover:opacity-90`}>
                  Award Points to {teamConfig.name}
                </Button>
              </div>
              
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600" onClick={nextTurn}>
                {round >= maxRounds && turnInRound >= getTeamKeys().length - 1 
                  ? 'See Final Results' 
                  : turnInRound >= getTeamKeys().length - 1 
                    ? 'Next Round' 
                    : `Next Team (${TEAM_CONFIG[getTeamKeys()[(turnInRound + 1) % getTeamKeys().length]].name})`
                } <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* END SCREEN */}
        {phase === 'end' && (
          <SlideCard>
            <div className="text-center">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-5xl font-bold mb-8">Game Complete!</h2>
              
              <div className="flex justify-center gap-8 mb-8">
                {getTeamKeys().map(team => (
                  <ScoreCard key={team} team={TEAM_CONFIG[team].name} score={scores[team]} color={TEAM_CONFIG[team].color} emoji={TEAM_CONFIG[team].emoji} />
                ))}
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">What We Learned</h3>
                <p className="text-lg text-emerald-200">
                  Good decisions come from <strong>careful observation</strong> first, 
                  then <strong>pattern recognition</strong>, and finally <strong>smart action</strong>.
                  Just like AI systems!
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" onClick={resetGame}>
                  <RotateCcw className="w-5 h-5 mr-2" /> Play Again
                </Button>
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600" onClick={onBack}>
                  Back to Menu
                </Button>
              </div>
            </div>
          </SlideCard>
        )}
      </div>
    </div>
  );
}

// ==================== GAME 2: MEMORY & UPDATING ====================

const SIGNAL_CARDS = [
  { id: 1, text: "Lion roaring loudly", icon: "🦁" },
  { id: 2, text: "Lion very quiet", icon: "🤫" },
  { id: 3, text: "Lion circling slowly", icon: "🔄" },
  { id: 4, text: "Lion watching the Hare's feet", icon: "👀" },
  { id: 5, text: "Lion moves silently", icon: "🐾" },
  { id: 6, text: "Lion pretends to ignore Hare", icon: "😒" },
  { id: 7, text: "Birds suddenly fly away", icon: "🐦" },
  { id: 8, text: "Hyena laughing nearby", icon: "🦴" },
  { id: 9, text: "Tall grass nearby", icon: "🌿" },
  { id: 10, text: "Pool nearby", icon: "💧" },
  { id: 11, text: "Large rock nearby", icon: "🪨" },
  { id: 12, text: "Forest suddenly quiet", icon: "🌲" },
  { id: 13, text: "The sun is very bright", icon: "☀️" },
  { id: 14, text: "The sky is cloudy", icon: "☁️" },
  { id: 15, text: "The wind is strong", icon: "💨" },
  { id: 16, text: "The grass is very tall", icon: "🌾" },
  { id: 17, text: "The ground is muddy", icon: "🟤" },
  { id: 18, text: "The rocks are slippery", icon: "🧊" },
  { id: 19, text: "The path is narrow", icon: "🛤️" },
  { id: 20, text: "The pool water is very still", icon: "🪷" },
  { id: 21, text: "The pool water is moving", icon: "🌊" },
  { id: 28, text: "The pool has ripples from the wind", icon: "💨" },
  { id: 22, text: "The forest is quiet", icon: "🤫" },
  { id: 23, text: "The forest is noisy", icon: "🔊" },
  { id: 24, text: "The trees are dense", icon: "🌳" },
  { id: 25, text: "The area is open", icon: "🏜️" },
  { id: 26, text: "The ground has many holes", icon: "🕳️" },
  { id: 27, text: "The area smells like another animal", icon: "👃" }
];

const MEMORY_CARDS = [
  { id: 1, text: "Lion charges when loud and angry", valid: true, icon: "📝" },
  { id: 2, text: "Lion hunts silently when quiet", valid: true, icon: "📝" },
  { id: 3, text: "Tall grass hides small animals", valid: true, icon: "📝" },
  { id: 4, text: "Distractions confuse predators", valid: true, icon: "📝" },
  { id: 5, text: "Reflections can trick animals", valid: true, icon: "📝" },
  { id: 6, text: "Changing direction breaks pursuit", valid: true, icon: "📝" },
  { id: 10, text: "Reflections need still water to work", valid: true, icon: "📝" },
  { id: 7, text: "Pool trick always works", valid: false, icon: "⚠️" },
  { id: 8, text: "If Lion looks calm, it is safe", valid: false, icon: "⚠️" },
  { id: 9, text: "Lion always attacks immediately", valid: false, icon: "⚠️" }
];

const ACTION_CARDS = [
  { id: 1, text: "Hide in tall grass", icon: "🌿" },
  { id: 2, text: "Climb rock", icon: "🪨" },
  { id: 3, text: "Run toward pool", icon: "💧" },
  { id: 4, text: "Change direction", icon: "↩️" },
  { id: 5, text: "Freeze completely", icon: "🧊" },
  { id: 6, text: "Create distraction", icon: "🎭" },
  { id: 7, text: "Observe longer", icon: "👀" },
  { id: 8, text: "Move quietly away", icon: "🤫" },
  { id: 9, text: "Follow unexpected path", icon: "🛤️" },
  { id: 10, text: "Wait patiently", icon: "⏳" }
];

const LION_ADAPTATIONS = [
  { id: 1, text: "Lion has learned the reflection trick!", icon: "💡" },
  { id: 2, text: "Lion now hunts silently", icon: "🤫" },
  { id: 3, text: "Lion waits patiently instead of chasing", icon: "⏳" },
  { id: 4, text: "Lion watches the Hare's feet instead of distractions", icon: "👁️" }
];

type MemoryCard = typeof MEMORY_CARDS[0];

function MemoryGame({ onBack }: GameProps) {
  const { playSound } = useSound();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [phase, setPhase] = useState<'intro' | 'setup' | 'round' | 'signals' | 'discuss' | 'action' | 'outcome' | 'update' | 'adaptation' | 'end'>('intro');
  const [round, setRound] = useState(1);
  const [turnInRound, setTurnInRound] = useState(0);
  const [currentTeam, setCurrentTeam] = useState<TeamKey>('team1');
  const [numTeams, setNumTeams] = useState(3);
  const [scores, setScores] = useState({ team1: 0, team2: 0, team3: 0 });
  const [teamMemories, setTeamMemories] = useState<{ [key: string]: MemoryCard[] }>({});
  const [currentSignals, setCurrentSignals] = useState<typeof SIGNAL_CARDS>([]);
  const [selectedAction, setSelectedAction] = useState<typeof ACTION_CARDS[0] | null>(null);
  const [outcome, setOutcome] = useState<{ success: boolean; message: string; points: number } | null>(null);
  const [activeAdaptation, setActiveAdaptation] = useState<typeof LION_ADAPTATIONS[0] | null>(null);
  const [signalsRevealed, setSignalsRevealed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [adaptationCount, setAdaptationCount] = useState(0);
  const [memoryUpdatesUsed, setMemoryUpdatesUsed] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);
  const [showDramaticReveal, setShowDramaticReveal] = useState(false);
  const [draggedCard, setDraggedCard] = useState<MemoryCard | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  // Pattern Engine State for Memory Game
  const [detectedPattern, setDetectedPattern] = useState<Pattern | null>(null);
  const maxRounds = 5;

  const getTeamKeys = (): TeamKey[] => {
    const teams: TeamKey[] = ['team1', 'team2', 'team3'];
    return teams.slice(0, numTeams);
  };

  const initializeTeams = () => {
    const validMemories = MEMORY_CARDS.filter(m => m.valid).slice(0, 2);
    const memories: { [key: string]: MemoryCard[] } = {};
    getTeamKeys().forEach(team => {
      memories[team] = [...validMemories];
    });
    setTeamMemories(memories);
  };

  const drawSignals = () => {
    const shuffled = [...SIGNAL_CARDS].sort(() => Math.random() - 0.5);
    const newSignals = shuffled.slice(0, 3);
    setCurrentSignals(newSignals);
    setSignalsRevealed(0);
    setSelectedAction(null);
    setOutcome(null);
    // Detect pattern using the pattern engine
    setDetectedPattern(detectPattern(newSignals.map(s => s.text)));
  };

  const replaceSignal = (index: number) => {
    if (soundEnabled) playSound('switch');
    const usedIds = currentSignals.map(s => s.id);
    const available = SIGNAL_CARDS.filter(s => !usedIds.includes(s.id));
    if (available.length === 0) return;
    const newSignal = available[Math.floor(Math.random() * available.length)];
    const newSignals = [...currentSignals];
    newSignals[index] = newSignal;
    setCurrentSignals(newSignals);
    // Re-detect pattern after replacement
    setDetectedPattern(detectPattern(newSignals.map(s => s.text)));
  };

  const revealNextSignal = () => {
    if (signalsRevealed < 3) {
      if (soundEnabled) playSound('reveal');
      setSignalsRevealed(prev => prev + 1);
    }
  };

  const selectAction = (action: typeof ACTION_CARDS[0]) => {
    setSelectedAction(action);
    
    // Use Pattern Engine for evaluation
    const { isCorrect, isWrong } = evaluateAction(action.text, detectedPattern);
    
    let success = false;
    let message = "";
    let points = 0;
    
    // First check pattern engine results
    if (detectedPattern) {
      if (isCorrect) {
        success = true;
        message = detectedPattern.successOutcome;
        points = 3 + streakBonus;
        setStreakBonus(prev => Math.min(prev + 1, 3));
      } else if (isWrong) {
        success = false;
        message = detectedPattern.failureOutcome;
        points = 0;
        setStreakBonus(0);
      } else {
        // Neutral action - partial success
        success = Math.random() > 0.5;
        message = success 
          ? "😅 Not optimal, but the Hare survives! Think about the pattern."
          : "😰 The action didn't match the situation well.";
        points = success ? 1 : 0;
      }
    } else {
      // Fallback to general logic if no pattern detected
      const signalTexts = currentSignals.map(s => s.text.toLowerCase());
      const hasGrass = signalTexts.some(s => s.includes('grass'));
      const hasPool = signalTexts.some(s => s.includes('pool') || s.includes('water'));
      const hasRock = signalTexts.some(s => s.includes('rock'));
      const isQuiet = signalTexts.some(s => s.includes('quiet'));
      
      if (action.text.includes('grass') && hasGrass) { success = true; }
      if (action.text.includes('pool') && hasPool) { success = true; }
      if (action.text.includes('rock') && hasRock) { success = true; }
      if (action.text.includes('Observe') && isQuiet) { success = true; }
      
      if (success) {
        message = "🎯 Good pattern recognition! The Hare escapes safely!";
        points = 3 + streakBonus;
        setStreakBonus(prev => Math.min(prev + 1, 3));
      } else {
        success = Math.random() > 0.4;
        message = success 
          ? "😅 Lucky escape! Try to match patterns better."
          : "😰 The pattern changed! Consider updating your memory.";
        points = success ? 1 : 0;
        if (!success) setStreakBonus(0);
      }
    }
    
    // Check if active adaptation overrides the result
    if (activeAdaptation) {
      if (activeAdaptation.text.includes("reflection") && action.text.includes("pool")) {
        success = false;
        message = "🦁 The Lion anticipated the pool trick! Your memory was OUTDATED!";
        points = 0;
      } else if (activeAdaptation.text.includes("silently") && action.text.includes("Observe")) {
        success = true;
        message = "🧠 Brilliant! You UPDATED your thinking and noticed the silent Lion!";
        points = 4;
      } else if (activeAdaptation.text.includes("patiently") && action.text.includes("Freeze")) {
        success = false;
        message = "🦁 The Lion is patient now! Freezing doesn't work anymore!";
        points = 0;
      } else if (activeAdaptation.text.includes("feet") && action.text.includes("distraction")) {
        success = false;
        message = "🦁 The Lion ignores distractions and watches your feet now!";
        points = 0;
      }
    }
    
    if (success) {
      if (soundEnabled) playSound('success');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      if (soundEnabled) playSound('danger');
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);
    }
    
    setOutcome({ success, message, points });
    setPhase('outcome');
  };

  const awardPoints = () => {
    if (!outcome) return;
    if (soundEnabled) playSound('combo');
    setScores(prev => ({ ...prev, [currentTeam]: prev[currentTeam] + outcome.points }));
  };

  // Drag and drop handlers for memory cards
  const handleDragStart = (card: MemoryCard) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot(slotIndex);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, team: TeamKey, slotIndex: number) => {
    e.preventDefault();
    if (draggedCard) {
      if (soundEnabled) playSound('powerup');
      setMemoryUpdatesUsed(prev => prev + 1);
      setTeamMemories(prev => {
        const teamMems = [...(prev[team] || [])];
        teamMems[slotIndex] = draggedCard;
        return { ...prev, [team]: teamMems };
      });
    }
    setDraggedCard(null);
    setDragOverSlot(null);
  };

  const triggerAdaptation = () => {
    if (soundEnabled) playSound('roar');
    setShowDramaticReveal(true);
    setAdaptationCount(prev => prev + 1);
    
    setTimeout(() => {
      const shuffled = [...LION_ADAPTATIONS].sort(() => Math.random() - 0.5);
      setActiveAdaptation(shuffled[0]);
      setShowDramaticReveal(false);
      setPhase('adaptation');
    }, 1500);
  };

  const nextTurn = () => {
    const teams = getTeamKeys();
    const nextTurnInRound = turnInRound + 1;
    
    if (nextTurnInRound >= teams.length) {
      if (round >= maxRounds) {
        setPhase('end');
      } else {
        setRound(prev => prev + 1);
        setTurnInRound(0);
        setCurrentTeam(teams[0]);
        setPhase('signals');
        drawSignals();
      }
    } else {
      setTurnInRound(nextTurnInRound);
      setCurrentTeam(teams[nextTurnInRound]);
      setPhase('signals');
      drawSignals();
    }
  };

  const resetGame = () => {
    setPhase('intro');
    setRound(1);
    setTurnInRound(0);
    setCurrentTeam('team1');
    setScores({ team1: 0, team2: 0, team3: 0 });
    setTeamMemories({});
    setCurrentSignals([]);
    setSelectedAction(null);
    setOutcome(null);
    setActiveAdaptation(null);
    setAdaptationCount(0);
    setMemoryUpdatesUsed(0);
    setStreakBonus(0);
    setDetectedPattern(null);
  };

  const teamConfig = TEAM_CONFIG[currentTeam];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900 text-white ${shakeScreen ? 'animate-shake' : ''}`}>
      {showConfetti && <Confetti />}
      
      {/* Dramatic Lion Reveal Overlay */}
      {showDramaticReveal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="text-9xl mb-4">🦁</div>
            <div className="text-4xl font-bold text-red-500">THE LION IS ADAPTING...</div>
          </div>
        </div>
      )}
      
      {/* Top Bar */}
      <div className="bg-black/30 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" /> Menu
          </Button>
          <Button variant="ghost" onClick={() => setSoundEnabled(!soundEnabled)} className="text-white hover:bg-white/20" size="sm">
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Current Team Indicator */}
          {phase !== 'intro' && phase !== 'setup' && phase !== 'end' && (
            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${teamConfig.bg} animate-pulse`}>
              <span className="text-lg font-bold">{teamConfig.emoji} {teamConfig.name}'s Turn</span>
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-white/10 px-2 py-1 rounded">
              <span className="text-purple-300">🔄 Updates:</span> {memoryUpdatesUsed}
            </div>
            <div className="bg-white/10 px-2 py-1 rounded">
              <span className="text-red-300">🦁 Adapts:</span> {adaptationCount}
            </div>
            {streakBonus > 0 && (
              <div className="bg-yellow-500/20 px-2 py-1 rounded border border-yellow-400 animate-pulse">
                <span className="text-yellow-300">🔥 Streak +{streakBonus}</span>
              </div>
            )}
          </div>
          
          <div className="h-8 w-px bg-white/20" />
          
          <div className="text-center">
            <div className="text-xs text-purple-300">Round</div>
            <div className="text-xl font-bold">{round}/{maxRounds}</div>
          </div>
          
          {activeAdaptation && (
            <div className="bg-red-500/30 px-3 py-1 rounded-lg border border-red-400 animate-pulse">
              <div className="text-xs text-red-300">⚠️ LION ADAPTED</div>
              <div className="text-sm font-bold">{activeAdaptation.icon}</div>
            </div>
          )}
          
          <div className="h-8 w-px bg-white/20" />
          <TeamScoreboard scores={scores} numTeams={numTeams} comboCount={{ team1: 0, team2: 0, team3: 0 }} currentTeam={currentTeam} />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            onClick={triggerAdaptation} 
            className="text-red-300 hover:bg-red-500/20 border border-red-500/50" 
            size="sm"
            disabled={phase === 'intro' || phase === 'setup' || phase === 'end' || showDramaticReveal}
          >
            🦁 Lion Adapts!
          </Button>
          <Button variant="ghost" onClick={resetGame} className="text-white hover:bg-white/20" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* INTRO */}
        {phase === 'intro' && (
          <SlideCard>
            <div className="text-center">
              <div className="text-6xl mb-6">🧠 🔄</div>
              <h1 className="text-5xl font-bold mb-6">Memory & Updating</h1>
              <p className="text-2xl text-purple-200 mb-8">Week 2: Learning to Adapt</p>
              
              <div className="bg-white/10 rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Key Concepts</h2>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="font-bold">Patterns</div>
                    <div className="text-sm text-purple-200">Recognize what's happening</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">💾</div>
                    <div className="font-bold">Memory</div>
                    <div className="text-sm text-purple-200">Remember what worked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔄</div>
                    <div className="font-bold">Updating</div>
                    <div className="text-sm text-purple-200">Change when world changes</div>
                  </div>
                </div>
              </div>
              
              {/* Game Reference - All Cards */}
              <div className="bg-white/5 rounded-2xl p-6 mb-8 max-w-5xl mx-auto text-left">
                <h3 className="text-2xl font-bold mb-6 text-purple-300 text-center">📋 Game Reference - All Cards</h3>
                
                {/* Signal Cards */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-300">
                    📡 Signal Cards ({SIGNAL_CARDS.length})
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {SIGNAL_CARDS.map((signal) => (
                      <div key={signal.id} className="bg-blue-500/20 rounded-lg p-2 text-sm border border-blue-400/30 flex items-center gap-1">
                        <span>{signal.icon}</span>
                        <span className="truncate">{signal.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Memory Cards */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-yellow-300">
                    💾 Memory Cards ({MEMORY_CARDS.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {MEMORY_CARDS.filter(m => m.valid).map((mem) => (
                      <div key={mem.id} className="bg-green-500/20 rounded-lg p-3 text-sm border border-green-400/30 flex items-center gap-2">
                        <span className="text-lg">{mem.icon}</span>
                        <span>✓ {mem.text}</span>
                      </div>
                    ))}
                    {MEMORY_CARDS.filter(m => !m.valid).map((mem) => (
                      <div key={mem.id} className="bg-red-500/20 rounded-lg p-3 text-sm border border-red-400/30 flex items-center gap-2 opacity-70">
                        <span className="text-lg">{mem.icon}</span>
                        <span>✗ {mem.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Cards */}
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-orange-300">
                    🎯 Action Cards ({ACTION_CARDS.length})
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {ACTION_CARDS.map((action) => (
                      <div key={action.id} className="bg-orange-500/20 rounded-lg p-3 text-sm border border-orange-400/30 flex items-center gap-2">
                        <span className="text-xl">{action.icon}</span>
                        <span>{action.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Team Selection */}
              <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <h3 className="font-bold mb-4">How many teams?</h3>
                <div className="flex justify-center gap-4">
                  {[2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => setNumTeams(n)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        numTeams === n ? 'bg-purple-500 text-white' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {n} Teams
                    </button>
                  ))}
                </div>
              </div>
              
              <p className="text-xl text-purple-200 mb-8">
                Intelligence comes from <strong>updating memory</strong> when the world changes!
              </p>
              
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-xl px-8 py-6" onClick={() => { setPhase('setup'); initializeTeams(); }}>
                Begin Game <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* SETUP - Show initial memories */}
        {phase === 'setup' && (
          <SlideCard>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Team Memory Cards</h2>
              <p className="text-xl text-purple-200 mb-8">Each team starts with these memory cards:</p>
              
              <div className="flex justify-center gap-6 mb-8">
                {teamMemories.team1?.map((mem, i) => (
                  <div key={i} className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-6 w-56 shadow-xl">
                    <div className="text-3xl mb-3">{mem.icon}</div>
                    <div className="text-sm font-medium text-white">{mem.text}</div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 mb-8">
                <p className="text-lg text-purple-200 mb-4">
                  Teams take turns! These memories might become <span className="text-red-300">outdated</span> if the Lion adapts!
                </p>
                <div className="flex justify-center gap-4">
                  {getTeamKeys().map(team => (
                    <div key={team} className={`px-4 py-2 rounded-lg ${TEAM_CONFIG[team].bgLight} ${TEAM_CONFIG[team].border} border`}>
                      {TEAM_CONFIG[team].emoji} {TEAM_CONFIG[team].name}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600" onClick={() => { setPhase('signals'); drawSignals(); }}>
                Start Round 1 <Play className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* SIGNALS PHASE */}
        {phase === 'signals' && (
          <SlideCard>
            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${teamConfig.bg} mb-6`}>
                <span className="text-3xl">{teamConfig.emoji}</span>
                <span className="text-2xl font-bold">{teamConfig.name}'s Turn</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-2">Round {round}</h2>
              <p className="text-xl text-purple-300 mb-8">📡 Signal Cards - What's happening?</p>
              
              <div className="flex justify-center gap-6 mb-8">
                {currentSignals.map((signal, i) => (
                  <div key={signal.id} className="relative">
                    <div
                      className={`transform transition-all duration-500 ${
                        i < signalsRevealed ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 rotate-12'
                      }`}
                    >
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 w-48 shadow-xl">
                        <div className="text-4xl mb-3">{signal.icon}</div>
                        <div className="text-sm font-medium">{signal.text}</div>
                      </div>
                    </div>
                    {/* Replace Signal Button */}
                    {i < signalsRevealed && (
                      <button
                        onClick={() => replaceSignal(i)}
                        className="absolute -top-2 -right-2 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-full shadow-lg transition-all hover:scale-110"
                        title="Replace this signal"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4">
                {signalsRevealed < 3 ? (
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600" onClick={revealNextSignal}>
                    Draw Signal {signalsRevealed + 1} 📡
                  </Button>
                ) : (
                  <Button size="lg" className="bg-purple-500 hover:bg-purple-600" onClick={() => setPhase('discuss')}>
                    Discuss Pattern <Brain className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </SlideCard>
        )}

        {/* DISCUSS PHASE */}
        {phase === 'discuss' && (
          <SlideCard>
            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${teamConfig.bg} mb-4`}>
                <span className="text-2xl">{teamConfig.emoji}</span>
                <span className="text-xl font-bold">{teamConfig.name}'s Discussion</span>
              </div>
              
              <Brain className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Pattern Discussion</h2>
              <p className="text-xl text-purple-300 mb-6">Check your memory cards. What pattern do you see?</p>
              
              <div className="flex justify-center gap-4 mb-6">
                {currentSignals.map((signal, i) => (
                  <div key={signal.id} className="relative">
                    <div className="bg-blue-500/30 rounded-lg p-3 text-sm">
                      {signal.icon} {signal.text}
                    </div>
                    <button
                      onClick={() => replaceSignal(i)}
                      className="absolute -top-1 -right-1 bg-amber-500 hover:bg-amber-600 text-white p-1 rounded-full shadow-lg transition-all hover:scale-110"
                      title="Replace"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-xl mx-auto">
                <h3 className="font-bold mb-3">{teamConfig.emoji} {teamConfig.name}'s Memory Cards:</h3>
                <div className="flex justify-center gap-3">
                  {teamMemories[currentTeam]?.map((mem, i) => (
                    <div key={i} className="bg-yellow-500/30 rounded-lg p-2 text-xs">
                      {mem.icon} {mem.text}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600" onClick={() => setPhase('action')}>
                Choose Action <Footprints className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* ACTION PHASE */}
        {phase === 'action' && (
          <SlideCard>
            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${teamConfig.bg} mb-4`}>
                <span className="text-2xl">{teamConfig.emoji}</span>
                <span className="text-xl font-bold">{teamConfig.name} Chooses</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-6">Choose Action Card</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                {ACTION_CARDS.map((action) => (
                  <button
                    key={action.id}
                    className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-xl p-4 transition-all hover:scale-105 shadow-lg"
                    onClick={() => selectAction(action)}
                  >
                    <div className="text-3xl mb-2">{action.icon}</div>
                    <div className="text-sm font-medium">{action.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </SlideCard>
        )}

        {/* OUTCOME PHASE */}
        {phase === 'outcome' && outcome && (
          <SlideCard>
            <div className="text-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${teamConfig.bg} mb-4`}>
                <span className="text-2xl">{teamConfig.emoji}</span>
                <span className="text-xl font-bold">{teamConfig.name}'s Result</span>
              </div>
              
              {/* Pattern Detection Display */}
              {detectedPattern && (
                <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-4 mb-4 max-w-xl mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-300" />
                    <span className="text-purple-200 font-medium">Pattern Detected:</span>
                    <span className="text-purple-100 font-bold">{detectedPattern.label}</span>
                  </div>
                  <p className="text-sm text-purple-200/80">{detectedPattern.description}</p>
                </div>
              )}
              
              <div className={`text-8xl mb-6 ${ outcome.success ? 'animate-bounce' : 'animate-pulse' }`}>
                {outcome.success ? '🎉' : '😰'}
              </div>
              <h2 className={`text-4xl font-bold mb-4 ${ outcome.success ? 'text-emerald-300' : 'text-red-300' }`}>
                {outcome.success ? 'Success!' : 'Challenge!'}
              </h2>
              <p className="text-2xl mb-6">{outcome.message}</p>
              
              {/* Teaching Point */}
              {detectedPattern && (
                <div className="bg-amber-500/20 border border-amber-400/50 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-200 font-bold">Teaching Point</span>
                  </div>
                  <p className="text-lg text-amber-100">{detectedPattern.teachingPoint}</p>
                </div>
              )}
              
              {outcome.points > 0 && (
                <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-lg mx-auto">
                  <p className="text-lg mb-4">{teamConfig.emoji} {teamConfig.name} earns {outcome.points} points:</p>
                  <Button onClick={awardPoints} className={`bg-gradient-to-r ${teamConfig.bg} hover:opacity-90`}>
                    Award Points to {teamConfig.name}
                  </Button>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                {!outcome.success && (
                  <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20" onClick={() => setPhase('update')}>
                    🔄 Update Memory
                  </Button>
                )}
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600" onClick={nextTurn}>
                  {round >= maxRounds && turnInRound >= getTeamKeys().length - 1 
                    ? 'See Final Results' 
                    : turnInRound >= getTeamKeys().length - 1 
                      ? 'Next Round' 
                      : `Next Team (${TEAM_CONFIG[getTeamKeys()[(turnInRound + 1) % getTeamKeys().length]].name})`
                  } <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </SlideCard>
        )}

        {/* UPDATE MEMORY PHASE - With Drag and Drop */}
        {phase === 'update' && (
          <SlideCard>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">🔄 Update Memory Cards</h2>
              <p className="text-xl text-purple-200 mb-8">Drag new memories to replace outdated ones for each team!</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
                {/* Available Memory Cards */}
                <div>
                  <h3 className="font-bold mb-4 text-green-300">📚 Available Memories (Drag to team slots)</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {MEMORY_CARDS.filter(m => m.valid).map(mem => (
                      <div 
                        key={mem.id}
                        draggable
                        onDragStart={() => handleDragStart(mem)}
                        className={`bg-green-500/30 rounded-lg p-3 text-sm border border-green-400 cursor-grab active:cursor-grabbing flex items-center gap-2 hover:bg-green-500/50 transition-all ${
                          draggedCard?.id === mem.id ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        <GripVertical className="w-4 h-4 text-green-400" />
                        {mem.icon} {mem.text}
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-bold mb-4 mt-6 text-red-300">⚠️ Outdated Memories (For Reference)</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {MEMORY_CARDS.filter(m => !m.valid).map(mem => (
                      <div key={mem.id} className="bg-red-500/30 rounded-lg p-3 text-sm border border-red-400 opacity-70">
                        {mem.icon} {mem.text}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Team Memory Slots */}
                <div>
                  <h3 className="font-bold mb-4 text-yellow-300">🎯 Team Memory Slots (Drop here)</h3>
                  <div className="space-y-6">
                    {getTeamKeys().map(team => (
                      <div key={team} className={`p-4 rounded-xl ${TEAM_CONFIG[team].bgLight} border ${TEAM_CONFIG[team].border}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{TEAM_CONFIG[team].emoji}</span>
                          <span className="font-bold">{TEAM_CONFIG[team].name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[0, 1, 2, 3].map(slotIndex => (
                            <div
                              key={slotIndex}
                              onDragOver={(e) => handleDragOver(e, slotIndex)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, team, slotIndex)}
                              className={`flex-1 min-h-[80px] rounded-lg border-2 border-dashed p-2 text-xs transition-all ${
                                dragOverSlot === slotIndex && draggedCard
                                  ? 'border-yellow-400 bg-yellow-500/20'
                                  : 'border-white/30 bg-white/5'
                              }`}
                            >
                              {teamMemories[team]?.[slotIndex] ? (
                                <div className="bg-yellow-500/40 rounded p-2 h-full flex items-center justify-center">
                                  {teamMemories[team][slotIndex].icon} {teamMemories[team][slotIndex].text}
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center text-white/50">
                                  Drop memory here
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-purple-200 mb-6">Teacher: Discuss with teams which memories to update, then drag cards to update</p>
              
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600" onClick={nextTurn}>
                Continue <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* LION ADAPTATION */}
        {phase === 'adaptation' && activeAdaptation && (
          <SlideCard>
            <div className="text-center">
              <div className="text-8xl mb-6 animate-pulse">🦁</div>
              <h2 className="text-4xl font-bold text-red-300 mb-6">The Lion Has Adapted!</h2>
              
              <div className="bg-red-500/20 border-2 border-red-400 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
                <div className="text-5xl mb-4">{activeAdaptation.icon}</div>
                <p className="text-2xl font-bold">{activeAdaptation.text}</p>
              </div>
              
              <p className="text-xl text-purple-200 mb-8">
                Your old strategies might not work anymore! Time to update your thinking!
              </p>
              
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600" onClick={() => setPhase('signals')}>
                Continue Playing <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </SlideCard>
        )}

        {/* END SCREEN */}
        {phase === 'end' && (
          <SlideCard>
            <div className="text-center">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-5xl font-bold mb-8">Game Complete!</h2>
              
              <div className="flex justify-center gap-8 mb-8">
                {getTeamKeys().map(team => (
                  <ScoreCard key={team} team={TEAM_CONFIG[team].name} score={scores[team]} color={TEAM_CONFIG[team].color} emoji={TEAM_CONFIG[team].emoji} />
                ))}
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">What We Learned</h3>
                <p className="text-lg text-purple-200">
                  <strong>Intelligence</strong> isn't just about remembering—it's about <strong>updating</strong> what we know when the world changes. 
                  This is exactly how <strong>AI systems learn</strong>!
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" onClick={resetGame}>
                  <RotateCcw className="w-5 h-5 mr-2" /> Play Again
                </Button>
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600" onClick={onBack}>
                  Back to Menu
                </Button>
              </div>
            </div>
          </SlideCard>
        )}
      </div>
    </div>
  );
}

// ==================== SHARED COMPONENTS ====================

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        >
          <div 
            className="w-3 h-3 rotate-45"
            style={{ 
              backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)]
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

function TeamScoreboard({ 
  scores, 
  numTeams,
  comboCount,
  currentTeam
}: { 
  scores: { team1: number; team2: number; team3: number };
  numTeams: number;
  comboCount: { team1: number; team2: number; team3: number };
  currentTeam: TeamKey;
}) {
  const teams: TeamKey[] = ['team1', 'team2', 'team3'].slice(0, numTeams) as TeamKey[];
  
  return (
    <div className="flex gap-3">
      {teams.map(team => (
        <div 
          key={team} 
          className={`text-center relative px-3 py-1 rounded-lg transition-all ${
            currentTeam === team ? `${TEAM_CONFIG[team].bgLight} ${TEAM_CONFIG[team].border} border` : 'bg-white/5'
          }`}
        >
          <div className="text-xs opacity-70">{TEAM_CONFIG[team].emoji}</div>
          <div className="text-lg font-bold">{scores[team]}</div>
          {comboCount[team] >= 2 && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold px-1 rounded-full animate-pulse">
              🔥{comboCount[team]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SlideCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 animate-in fade-in duration-500">
      {children}
    </div>
  );
}

function GameCard({ type, content, revealed, small }: { type: 'signal' | 'action' | 'memory'; content: string; revealed: boolean; small?: boolean }) {
  const colors = {
    signal: 'from-blue-500 to-cyan-600',
    action: 'from-orange-500 to-red-500',
    memory: 'from-yellow-500 to-amber-600'
  };
  
  if (!revealed) {
    return (
      <div className={`bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl ${small ? 'p-3 w-36' : 'p-6 w-48'} shadow-xl`}>
        <div className="text-4xl mb-3">❓</div>
        <div className="text-sm">Hidden</div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gradient-to-br ${colors[type]} rounded-xl ${small ? 'p-3 w-36' : 'p-6 w-48'} shadow-xl transform transition-all`}>
      <div className={`${small ? 'text-2xl mb-1' : 'text-4xl mb-3'}`}>👁️</div>
      <div className={`${small ? 'text-xs' : 'text-sm'} font-medium`}>{content}</div>
    </div>
  );
}

function ScoreCard({ team, score, color, emoji }: { team: string; score: number; color: string; emoji?: string }) {
  const colors: { [key: string]: string } = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };
  
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 w-40 text-center shadow-xl`}>
      {emoji && <div className="text-3xl mb-2">{emoji}</div>}
      <div className="text-lg font-medium mb-2">{team}</div>
      <div className="text-4xl font-bold">{score}</div>
      <div className="text-sm opacity-80">points</div>
    </div>
  );
}

// ==================== GAME 3: STRATEGY ARENA ====================

// Card Data for Strategy Arena - With Images and Sound mappings
const LION_BEHAVIOR_CARDS = [
  { id: 'proud', emoji: '👑', label: 'Lion is proud', description: 'Reacts quickly to challenges', imageUrl: '/images/animals/lions/proud.jpg', sound: 'lion_growl' as SoundType },
  { id: 'hungry', emoji: '🍖', label: 'Lion is hungry', description: 'Focused on food, easily distracted', imageUrl: '/images/animals/lions/hungry.jpg', sound: 'lion_growl' as SoundType },
  { id: 'suspicious', emoji: '🤨', label: 'Lion is suspicious', description: 'Watches carefully, hard to trick', imageUrl: '/images/animals/lions/suspicious.jpg', sound: 'lion_prowl' as SoundType },
  { id: 'tired', emoji: '😴', label: 'Lion is tired', description: 'Slow reactions, easily outwitted', imageUrl: '/images/animals/lions/tired.jpg', sound: 'lion_tired' as SoundType },
  { id: 'curious', emoji: '🔍', label: 'Lion is curious', description: 'Will investigate new things', imageUrl: '/images/animals/lions/curious.jpg', sound: 'lion_curious' as SoundType },
  { id: 'angry', emoji: '😤', label: 'Lion is angry', description: 'Aggressive but makes mistakes', imageUrl: '/images/animals/lions/angry.jpg', sound: 'lion_angry' as SoundType },
  { id: 'patient', emoji: '⏳', label: 'Lion is patient', description: 'Waits for the perfect moment', imageUrl: '/images/animals/lions/patient.jpg', sound: 'lion_prowl' as SoundType },
  { id: 'bored', emoji: '😑', label: 'Lion is bored', description: 'Easily entertained by distraction', imageUrl: '/images/animals/lions/bored.jpg', sound: 'lion_tired' as SoundType },
  { id: 'injured', emoji: '🩹', label: 'Lion is injured', description: 'Limited mobility, vulnerable', imageUrl: '/images/animals/lions/injured.jpg', sound: 'lion_growl' as SoundType },
  { id: 'confident', emoji: '💪', label: 'Lion is confident', description: 'Underestimates opponents', imageUrl: '/images/animals/lions/confident.jpg', sound: 'lion_growl' as SoundType },
];

const ENVIRONMENT_CARDS = [
  // Story-aligned environments
  { id: 'deep_well', emoji: '🕳️', label: 'Deep well nearby', description: 'Perfect for the reflection trick!' },
  { id: 'clear_pool', emoji: '💧', label: 'Still water (clear)', description: 'Perfect reflections possible' },
  { id: 'muddy_pool', emoji: '🟤', label: 'Muddy water', description: 'Reflections unclear - trick harder' },
  { id: 'nighttime', emoji: '🌙', label: 'Nighttime', description: 'Limited visibility for all' },
  { id: 'hot_day', emoji: '☀️', label: 'Hot day', description: 'Lion is thirsty and tired' },
  { id: 'animals_watching', emoji: '👀', label: 'Other animals watching', description: 'Lion cares about reputation' },
  { id: 'lions_den', emoji: '🏔️', label: 'Near lion\'s den', description: 'Lion feels powerful here' },
  { id: 'tall_grass', emoji: '🌾', label: 'Tall grass', description: 'Perfect for hiding and escape' },
  { id: 'open_ground', emoji: '🏞️', label: 'Open ground', description: 'No place to hide' },
  { id: 'echo_cave', emoji: '🔊', label: 'Echo cave nearby', description: 'Sounds bounce - good for tricks' },
];

const HARE_ABILITY_CARDS = [
  // Story-aligned hare abilities
  { id: 'storyteller', emoji: '📖', label: 'Clever storyteller', description: 'Creates convincing stories', imageUrl: '/images/animals/hare/speaker.jpg', sound: 'hare_trick' as SoundType },
  { id: 'speaker', emoji: '🗣️', label: 'Good speaker', description: 'Can convince and persuade', imageUrl: '/images/animals/hare/speaker.jpg', sound: 'hare_think' as SoundType },
  { id: 'observer', emoji: '👁️', label: 'Excellent observer', description: 'Notices small details', imageUrl: '/images/animals/hare/observer.jpg', sound: 'hare_think' as SoundType },
  { id: 'memory', emoji: '🧠', label: 'Good memory', description: 'Remembers past encounters', imageUrl: '/images/animals/hare/memory.jpg', sound: 'hare_think' as SoundType },
  { id: 'actor', emoji: '🎭', label: 'Great actor', description: 'Can pretend convincingly', imageUrl: '/images/animals/hare/actor.jpg', sound: 'hare_trick' as SoundType },
  { id: 'trickster', emoji: '🃏', label: 'Creative trickster', description: 'Invents new tricks like reflection!', imageUrl: null, sound: 'hare_trick' as SoundType },
  { id: 'delay_master', emoji: '⏰', label: 'Delay master', description: 'Uses time strategically', imageUrl: null, sound: 'hare_think' as SoundType },
  { id: 'fast', emoji: '⚡', label: 'Fast runner', description: 'Can outrun in short bursts', imageUrl: '/images/animals/hare/fast.jpg', sound: 'hare_run' as SoundType },
];

const EVENT_CARDS = [
  // Story-aligned events
  { id: 'roar', emoji: '🦁', label: 'Lion roars at reflection!', effect: 'Echo makes it seem like two lions!', sound: 'roar' as SoundType },
  { id: 'lion_angry', emoji: '😤', label: 'Lion demands to see rival!', effect: 'Lion is now very angry - lead him to well?', sound: 'lion_angry' as SoundType },
  { id: 'lion_tests_water', emoji: '🐾', label: 'Lion tests the water!', effect: 'Reflection trick may fail!', sound: 'lion_curious' as SoundType },
  { id: 'lion_charges', emoji: '💨', label: 'Lion suddenly charges!', effect: 'Must react immediately!', sound: 'lion_angry' as SoundType },
  { id: 'rival_story', emoji: '👑', label: 'Hare mentions rival king!', effect: 'Lion\'s pride is triggered!', sound: 'reveal' as SoundType },
  { id: 'delay_time', emoji: '⏰', label: 'Hare arrives late!', effect: 'Lion is furious but curious why', sound: 'danger' as SoundType },
];

// Animated Animal Media Card Component
interface AnimalCardProps {
  emoji: string;
  label: string;
  description: string;
  imageUrl?: string | null;
  sound?: SoundType;
  playSound: (type: SoundType) => void;
  cardType: 'lion' | 'hare' | 'environment';
  isRevealed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimalMediaCard = ({ 
  emoji, 
  label, 
  description, 
  imageUrl, 
  sound, 
  playSound,
  cardType,
  isRevealed = true,
  size = 'md',
  className = ''
}: AnimalCardProps) => {
  const [isFlipped, setIsFlipped] = useState(!isRevealed);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'w-40 h-52',
    md: 'w-56 h-72',
    lg: 'w-64 h-80'
  };

  const imageSizeClasses = {
    sm: 'h-24',
    md: 'h-36',
    lg: 'h-44'
  };

  // Gradient based on card type
  const gradients = {
    lion: 'from-amber-500 to-orange-600',
    hare: 'from-purple-500 to-indigo-600',
    environment: 'from-emerald-500 to-teal-600'
  };

  const handleClick = () => {
    if (isFlipped) {
      setIsFlipped(false);
      playSound('card_flip');
      // Play the animal's characteristic sound after flip
      if (sound) {
        setTimeout(() => playSound(sound), 300);
      }
    } else if (sound) {
      playSound(sound);
    }
  };

  return (
    <div 
      className={`
        relative cursor-pointer perspective-1000 transition-all duration-300
        ${sizeClasses[size]} ${className}
        ${isHovered ? 'scale-105 z-10' : ''}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container with flip animation */}
      <div className={`
        relative w-full h-full transition-transform duration-500 transform-style-3d
        ${isFlipped ? 'rotate-y-180' : ''}
      `}>
        {/* Front of Card (revealed) */}
        <div className={`
          absolute w-full h-full backface-hidden
          bg-gradient-to-br ${gradients[cardType]} rounded-2xl p-4
          flex flex-col items-center text-center shadow-xl
          ${isFlipped ? 'opacity-0' : 'opacity-100'}
          transition-opacity duration-300
        `}>
          {/* Image or Emoji */}
          <div className={`
            relative ${imageSizeClasses[size]} w-full rounded-xl overflow-hidden mb-3
            bg-black/20
          `}>
            {imageUrl && !imageError ? (
              <>
                <Image
                  src={imageUrl}
                  alt={label}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
                {/* Sound indicator overlay */}
                {sound && (
                  <div className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
                    <Volume2 className="w-4 h-4 text-white animate-pulse" />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className={`${size === 'lg' ? 'text-7xl' : size === 'md' ? 'text-6xl' : 'text-5xl'}`}>
                  {emoji}
                </span>
              </div>
            )}
          </div>

          {/* Label */}
          <h3 className={`font-bold text-white mb-1 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
            {label}
          </h3>
          
          {/* Description */}
          <p className={`text-white/80 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {description}
          </p>

          {/* Sound button hint */}
          {sound && isHovered && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-black/40 px-2 py-1 rounded-full text-white/80">
              🔊 Click for sound!
            </div>
          )}
        </div>

        {/* Back of Card (hidden) */}
        <div className={`
          absolute w-full h-full backface-hidden rotate-y-180
          bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-4
          flex flex-col items-center justify-center
          ${isFlipped ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
        `}>
          <div className="text-6xl mb-4">❓</div>
          <p className="text-white/80 text-center">
            {cardType === 'lion' ? 'What is the Lion doing?' : 
             cardType === 'hare' ? 'What can the Hare do?' :
             'What is the environment?'}
          </p>
          <p className="text-white/50 text-sm mt-2">Click to reveal!</p>
        </div>
      </div>
    </div>
  );
};

// Compact card display for sidebar/lists
interface CompactAnimalCardProps {
  emoji: string;
  label: string;
  imageUrl?: string | null;
  sound?: SoundType;
  playSound: (type: SoundType) => void;
  cardType: 'lion' | 'hare' | 'environment';
  className?: string;
}

const CompactAnimalCard = ({ 
  emoji, 
  label, 
  imageUrl, 
  sound, 
  playSound,
  cardType,
  className = ''
}: CompactAnimalCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const bgColors = {
    lion: 'bg-amber-500/20',
    hare: 'bg-purple-500/20',
    environment: 'bg-emerald-500/20'
  };

  return (
    <div 
      className={`
        flex items-center gap-3 ${bgColors[cardType]} rounded-lg p-3
        cursor-pointer hover:scale-[1.02] transition-transform ${className}
      `}
      onClick={() => sound && playSound(sound)}
    >
      {imageUrl && !imageError ? (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={label}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <span className="text-2xl flex-shrink-0">{emoji}</span>
      )}
      <span className="font-medium text-white">{label}</span>
      {sound && <Volume2 className="w-4 h-4 text-white/50 ml-auto" />}
    </div>
  );
};

// Types for Strategy Arena
interface StrategyRule {
  id: string;
  condition: string;
  action: string;
  teamId: 'eyes' | 'brain' | 'feet';
}

interface RoundSituation {
  lionBehavior: typeof LION_BEHAVIOR_CARDS[0];
  environment: typeof ENVIRONMENT_CARDS[0];
  hareAbility: typeof HARE_ABILITY_CARDS[0];
}

type StrategyPhase = 'intro' | 'warmup' | 'rule_builder' | 'arena_intro' | 'arena' | 'boss_intro' | 'boss' | 'final_challenge' | 'results';

function StrategyArenaGame({ onBack }: { onBack: () => void }) {
  const { playSound } = useSound();
  const [isMuted, setIsMuted] = useState(false);
  const [phase, setPhase] = useState<StrategyPhase>('intro');
  const [scores, setScores] = useState({ eyes: 0, brain: 0, feet: 0 });
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  
  // Warmup state
  const [warmupStatements, setWarmupStatements] = useState<Array<{ text: string; isSignal: boolean; revealed: boolean }>>([]);
  const [warmupIndex, setWarmupIndex] = useState(0);
  const [warmupAnswer, setWarmupAnswer] = useState<'signal' | 'story' | null>(null);
  
  // Rule Builder state
  const [ruleBuilderCards, setRuleBuilderCards] = useState<typeof LION_BEHAVIOR_CARDS[0][]>([]);
  const [teamRules, setTeamRules] = useState<StrategyRule[]>([]);
  const [ruleInput, setRuleInput] = useState({ condition: '', action: '' });
  const [ruleBuilderPhase, setRuleBuilderPhase] = useState<'cards' | 'building' | 'execution'>('cards');
  
  // Arena state
  const [situation, setSituation] = useState<RoundSituation | null>(null);
  const [arenaStep, setArenaStep] = useState<'reveal' | 'eyes' | 'brain' | 'feet' | 'judge'>('reveal');
  const [eyesSignals, setEyesSignals] = useState<string[]>([]);
  const [brainRules, setBrainRules] = useState<string[]>([]);
  const [feetStrategy, setFeetStrategy] = useState('');
  const [outcome, setOutcome] = useState<'success' | 'partial' | 'fail' | null>(null);
  const [discussionTimer, setDiscussionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Event interrupt state
  const [eventCard, setEventCard] = useState<typeof EVENT_CARDS[0] | null>(null);
  const [isEventActive, setIsEventActive] = useState(false);
  
  // Boss round state
  const [bossLevel, setBossLevel] = useState(1);
  const [lionIntelligence, setLionIntelligence] = useState<string[]>([]);
  
  // Final challenge state
  const [finalCards, setFinalCards] = useState<{
    lion: typeof LION_BEHAVIOR_CARDS[0];
    env1: typeof ENVIRONMENT_CARDS[0];
    env2: typeof ENVIRONMENT_CARDS[0];
    ability: typeof HARE_ABILITY_CARDS[0];
  } | null>(null);
  const [finalStrategyTree, setFinalStrategyTree] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sound = useCallback((type: Parameters<typeof playSound>[0]) => {
    if (!isMuted) playSound(type);
  }, [isMuted, playSound]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && discussionTimer > 0) {
      timerRef.current = setTimeout(() => {
        setDiscussionTimer(prev => prev - 1);
        if (discussionTimer <= 6) {
          sound('tick');
        }
      }, 1000);
    } else if (discussionTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sound('danger');
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [discussionTimer, isTimerRunning, sound]);

  // Initialize warmup statements - diverse everyday scenarios for 9-12 year olds
  const initWarmup = () => {
    const statements = [
      // ===== SIGNALS (Observable facts - things you can see, hear, measure, or verify) =====
      // Everyday life
      { text: "The kitchen smoke alarm is beeping.", isSignal: true, revealed: false },
      { text: "There are dark clouds in the sky.", isSignal: true, revealed: false },
      { text: "The dog is wagging its tail.", isSignal: true, revealed: false },
      { text: "Your friend has tears running down their face.", isSignal: true, revealed: false },
      { text: "The thermometer reads 38°C (100°F).", isSignal: true, revealed: false },
      // School & learning
      { text: "The teacher wrote 'See me after class' on your paper.", isSignal: true, revealed: false },
      { text: "Three students raised their hands at the same time.", isSignal: true, revealed: false },
      { text: "The classroom clock shows 2:55 PM.", isSignal: true, revealed: false },
      { text: "Your test score is 72 out of 100.", isSignal: true, revealed: false },
      // Sports & games
      { text: "The soccer goalie is standing to the left side of the goal.", isSignal: true, revealed: false },
      { text: "The basketball scoreboard shows 48-47 with 10 seconds left.", isSignal: true, revealed: false },
      { text: "The opposing team's best player is limping.", isSignal: true, revealed: false },
      // Nature & animals
      { text: "Birds are flying in a V-formation heading south.", isSignal: true, revealed: false },
      { text: "The cat's fur is standing up and its back is arched.", isSignal: true, revealed: false },
      { text: "Ants are carrying food in a line toward their hill.", isSignal: true, revealed: false },
      // Social & digital
      { text: "Your friend hasn't replied to your message in 3 days.", isSignal: true, revealed: false },
      { text: "The 'low battery' warning flashes on your tablet at 5%.", isSignal: true, revealed: false },
      { text: "A car's turn signal is blinking to the right.", isSignal: true, revealed: false },
      { text: "The ice cream in the bowl is melting into a puddle.", isSignal: true, revealed: false },
      { text: "There are 15 people in line ahead of you at the store.", isSignal: true, revealed: false },

      // ===== STORIES (Interpretations, opinions, predictions, assumptions) =====
      // Everyday life
      { text: "Something is definitely burning in the kitchen.", isSignal: false, revealed: false },
      { text: "It's going to rain all day and ruin the picnic.", isSignal: false, revealed: false },
      { text: "The dog is happy because it loves everyone.", isSignal: false, revealed: false },
      { text: "Your friend is crying because someone was mean to them.", isSignal: false, revealed: false },
      { text: "You must be really sick with that temperature.", isSignal: false, revealed: false },
      // School & learning
      { text: "The teacher is angry and you're probably in trouble.", isSignal: false, revealed: false },
      { text: "Those students are the smartest kids in the class.", isSignal: false, revealed: false },
      { text: "School is almost over so nobody is paying attention.", isSignal: false, revealed: false },
      { text: "A 72 means you didn't study hard enough.", isSignal: false, revealed: false },
      // Sports & games
      { text: "You should shoot to the right side of the goal.", isSignal: false, revealed: false },
      { text: "Your team is going to win because you're ahead by one.", isSignal: false, revealed: false },
      { text: "They'll lose because their best player is hurt.", isSignal: false, revealed: false },
      // Nature & animals
      { text: "The birds know winter is coming early this year.", isSignal: false, revealed: false },
      { text: "The cat is angry and about to attack.", isSignal: false, revealed: false },
      { text: "Ants are smarter than most people think.", isSignal: false, revealed: false },
      // Social & digital
      { text: "Your friend is ignoring you on purpose.", isSignal: false, revealed: false },
      { text: "Your tablet will die before you can save your game.", isSignal: false, revealed: false },
      { text: "That driver is about to turn into the parking lot.", isSignal: false, revealed: false },
      { text: "The ice cream was left out too long because someone forgot.", isSignal: false, revealed: false },
      { text: "You'll be waiting forever in that line.", isSignal: false, revealed: false },
    ];
    // Pick 10 signals and 10 stories randomly, then shuffle together for 20 rounds
    const signals = statements.filter(s => s.isSignal).sort(() => Math.random() - 0.5).slice(0, 10);
    const stories = statements.filter(s => !s.isSignal).sort(() => Math.random() - 0.5).slice(0, 10);
    setWarmupStatements([...signals, ...stories].sort(() => Math.random() - 0.5));
    setWarmupIndex(0);
    setPhase('warmup');
  };

  // Initialize Rule Builder
  const initRuleBuilder = () => {
    const shuffled = [...LION_BEHAVIOR_CARDS].sort(() => Math.random() - 0.5);
    setRuleBuilderCards(shuffled.slice(0, 2));
    setTeamRules([]);
    setRuleBuilderPhase('cards');
    setPhase('rule_builder');
  };

  // Initialize Arena Round
  const initArenaRound = () => {
    const lion = LION_BEHAVIOR_CARDS[Math.floor(Math.random() * LION_BEHAVIOR_CARDS.length)];
    const env = ENVIRONMENT_CARDS[Math.floor(Math.random() * ENVIRONMENT_CARDS.length)];
    const ability = HARE_ABILITY_CARDS[Math.floor(Math.random() * HARE_ABILITY_CARDS.length)];
    
    setSituation({ lionBehavior: lion, environment: env, hareAbility: ability });
    setArenaStep('reveal');
    setEyesSignals([]);
    setBrainRules([]);
    setFeetStrategy('');
    setOutcome(null);
    setEventCard(null);
    sound('reveal');
  };

  // Trigger random event
  const triggerEvent = () => {
    const event = EVENT_CARDS[Math.floor(Math.random() * EVENT_CARDS.length)];
    setEventCard(event);
    setIsEventActive(true);
    sound('roar');
    setTimeout(() => setIsEventActive(false), 3000);
  };

  // Start discussion timer
  const startTimer = (seconds: number) => {
    setDiscussionTimer(seconds);
    setIsTimerRunning(true);
  };

  // Judge outcome
  const judgeOutcome = (result: 'success' | 'partial' | 'fail') => {
    setOutcome(result);
    const points = result === 'success' ? 5 : result === 'partial' ? 2 : 0;
    
    if (result === 'success') {
      sound('success');
      setScores(prev => ({
        ...prev,
        eyes: prev.eyes + 2,
        brain: prev.brain + 2,
        feet: prev.feet + 1
      }));
    } else if (result === 'partial') {
      sound('reveal');
      setScores(prev => ({
        ...prev,
        eyes: prev.eyes + 1,
        brain: prev.brain + 1
      }));
    } else {
      sound('danger');
    }
  };

  // Initialize Boss Round - Story-aligned lion intelligence
  const initBossRound = (level: number) => {
    setBossLevel(level);
    const intelligences = [
      "Lion has seen reflections in water before",
      "Lion knows hares are clever - trusts nothing!",
      "Lion tests the well by throwing a rock first",
      "Lion remembers the 'rival lion' story is false"
    ];
    setLionIntelligence(intelligences.slice(0, level));
    initArenaRound();
    setPhase('boss');
  };

  // Initialize Final Challenge
  const initFinalChallenge = () => {
    const lion = LION_BEHAVIOR_CARDS[Math.floor(Math.random() * LION_BEHAVIOR_CARDS.length)];
    const envs = [...ENVIRONMENT_CARDS].sort(() => Math.random() - 0.5).slice(0, 2);
    const ability = HARE_ABILITY_CARDS[Math.floor(Math.random() * HARE_ABILITY_CARDS.length)];
    
    setFinalCards({
      lion,
      env1: envs[0],
      env2: envs[1],
      ability
    });
    setFinalStrategyTree([]);
    setPhase('final_challenge');
    sound('powerup');
  };

  // Add rule to final strategy tree
  const addToStrategyTree = (rule: string) => {
    setFinalStrategyTree(prev => [...prev, rule]);
    sound('reveal');
  };

  // Reset game
  const resetGame = () => {
    setPhase('intro');
    setScores({ eyes: 0, brain: 0, feet: 0 });
    setRound(1);
  };

  // Render based on phase
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-amber-900 text-white overflow-hidden">
      {/* Sound Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 z-50 bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>

      {/* Event Interrupt Overlay */}
      {isEventActive && eventCard && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 animate-pulse">
          <div className="text-center">
            <div className="text-9xl mb-6">{eventCard.emoji}</div>
            <h2 className="text-5xl font-bold mb-4 text-red-400">{eventCard.label}</h2>
            <p className="text-2xl text-orange-200">{eventCard.effect}</p>
            <p className="mt-6 text-xl animate-bounce">⏸️ ALL TEAMS FREEZE!</p>
          </div>
        </div>
      )}

      {/* INTRO PHASE */}
      {phase === 'intro' && (
        <div className="min-h-screen overflow-y-auto py-8 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🐰⚔️🦁</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                OUTSMART THE LION
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-orange-200">
                The Strategy Arena
              </h2>
              <p className="text-lg text-orange-100 max-w-2xl mx-auto">
                Based on the classic Panchatantra tale: <span className="text-yellow-400 font-bold">"The Hare and The Lion"</span>
              </p>
            </div>

            {/* YouTube Video Embed */}
            <div className="mb-8">
              <div className="bg-black/40 rounded-2xl p-4 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-3 text-center text-orange-200">
                  📺 First, Watch the Story
                </h3>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/akeNoLLitcc"
                    title="The Hare and The Lion - Moral Story"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <p className="text-sm text-orange-200/70 text-center mt-3">
                  Learn how the clever hare used intelligence to defeat the mighty lion!
                </p>
              </div>
            </div>

            {/* Story Summary */}
            <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-orange-500/30">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <span>📖</span> The Story
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-orange-100">
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-3xl mb-2">🦁</div>
                  <h4 className="font-bold text-white mb-2">The Cruel Lion King</h4>
                  <p className="text-sm">A powerful lion terrorized the jungle, killing animals every day. The animals made a deal: send one animal daily, and the lion would stop hunting.</p>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-3xl mb-2">🐰</div>
                  <h4 className="font-bold text-white mb-2">The Clever Hare's Turn</h4>
                  <p className="text-sm">When it was the hare's turn, instead of giving up, the hare used <span className="text-yellow-400 font-bold">intelligence</span> to outsmart the lion!</p>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-3xl mb-2">⏰</div>
                  <h4 className="font-bold text-white mb-2">The Delay Tactic</h4>
                  <p className="text-sm">The hare arrived late and told the lion: "Another lion stopped me and claimed to be the true king!"</p>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-3xl mb-2">💧</div>
                  <h4 className="font-bold text-white mb-2">The Well Reflection Trick</h4>
                  <p className="text-sm">The hare led the angry lion to a deep well. The lion saw his own <span className="text-yellow-400 font-bold">reflection</span>, thought it was a rival, and jumped in!</p>
                </div>
              </div>
              <div className="mt-4 text-center bg-yellow-500/20 rounded-xl p-4">
                <p className="text-xl font-bold text-yellow-400">✨ Moral: Intelligence and wisdom triumph over brute strength!</p>
              </div>
            </div>

            {/* Game Objective */}
            <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4 text-center">🎯 Your Mission</h3>
              <p className="text-lg text-center text-orange-100 mb-6">
                Build <span className="text-yellow-400 font-bold">IF-THEN</span> decision rules like the hare did!
                Learn to observe, think, and act strategically.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-500/20 rounded-xl p-4 text-center border border-blue-400/30">
                  <Eye className="w-10 h-10 mx-auto mb-2 text-blue-400" />
                  <h4 className="font-bold mb-1">Team Eyes</h4>
                  <p className="text-sm text-gray-300">Observe signals like the hare</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4 text-center border border-purple-400/30">
                  <Brain className="w-10 h-10 mx-auto mb-2 text-purple-400" />
                  <h4 className="font-bold mb-1">Team Brain</h4>
                  <p className="text-sm text-gray-300">Create clever IF-THEN rules</p>
                </div>
                <div className="bg-green-500/20 rounded-xl p-4 text-center border border-green-400/30">
                  <Footprints className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <h4 className="font-bold mb-1">Team Feet</h4>
                  <p className="text-sm text-gray-300">Execute the winning strategy</p>
                </div>
              </div>
            </div>

            {/* Example IF-THEN Rules */}
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-purple-500/30">
              <h3 className="text-xl font-bold mb-4 text-purple-300">💡 Example IF-THEN Rules from the Story:</h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3 flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <span className="text-yellow-400 font-bold">IF</span> lion is <span className="text-red-400">proud and angry</span>, 
                    <span className="text-green-400 font-bold ml-1">THEN</span> use his pride against him!
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <span className="text-yellow-400 font-bold">IF</span> there is <span className="text-blue-400">a well with clear water</span>, 
                    <span className="text-green-400 font-bold ml-1">THEN</span> use the reflection trick!
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <span className="text-yellow-400 font-bold">IF</span> lion demands to see rival, 
                    <span className="text-green-400 font-bold ml-1">THEN</span> lead him to the well!
                  </div>
                </div>
              </div>
            </div>

            {/* Start Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={initWarmup}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xl px-8 py-6"
              >
                <Play className="w-6 h-6 mr-2" /> Start Game
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-xl px-8 py-6"
              >
                <ChevronLeft className="w-6 h-6 mr-2" /> Back
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WARMUP PHASE - Signal vs Story */}
      {phase === 'warmup' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full text-yellow-300 mb-4">
                <Timer className="w-5 h-5" />
                Phase 1: Warm-Up Challenge
              </div>
              <h2 className="text-4xl font-bold mb-2">Signal vs Story</h2>
              <p className="text-orange-200">Is this a SIGNAL (fact) or a STORY (interpretation)?</p>
            </div>

            {warmupIndex < warmupStatements.length ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 text-center">
                <div className="text-6xl mb-6">🤔</div>
                <p className="text-3xl font-medium mb-8">
                  "{warmupStatements[warmupIndex].text}"
                </p>
                
                {warmupAnswer === null ? (
                  <div className="flex gap-6 justify-center">
                    <Button
                      onClick={() => {
                        setWarmupAnswer('signal');
                        sound(warmupStatements[warmupIndex].isSignal ? 'success' : 'danger');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-2xl px-12 py-8"
                    >
                      🟢 SIGNAL
                    </Button>
                    <Button
                      onClick={() => {
                        setWarmupAnswer('story');
                        sound(!warmupStatements[warmupIndex].isSignal ? 'success' : 'danger');
                      }}
                      className="bg-red-600 hover:bg-red-700 text-2xl px-12 py-8"
                    >
                      🔴 STORY
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={`text-3xl font-bold ${
                      (warmupAnswer === 'signal' && warmupStatements[warmupIndex].isSignal) ||
                      (warmupAnswer === 'story' && !warmupStatements[warmupIndex].isSignal)
                        ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(warmupAnswer === 'signal' && warmupStatements[warmupIndex].isSignal) ||
                       (warmupAnswer === 'story' && !warmupStatements[warmupIndex].isSignal)
                        ? '✓ Correct!' : '✗ Not quite!'}
                    </div>
                    <p className="text-xl text-orange-200">
                      This is a <span className="font-bold text-white">
                        {warmupStatements[warmupIndex].isSignal ? 'SIGNAL' : 'STORY'}
                      </span> - {warmupStatements[warmupIndex].isSignal 
                        ? 'an observable fact' 
                        : 'an interpretation or prediction'}
                    </p>
                    <Button
                      onClick={() => {
                        setWarmupAnswer(null);
                        setWarmupIndex(prev => prev + 1);
                      }}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-3xl font-bold mb-4">Warm-Up Complete!</h3>
                <p className="text-xl text-orange-200 mb-8">
                  Great job distinguishing signals from stories!
                </p>
                <Button
                  onClick={initRuleBuilder}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xl px-8 py-4"
                >
                  Continue to Rule Builder <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            <div className="flex justify-center gap-2 mt-8">
              {warmupStatements.map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < warmupIndex ? 'bg-green-500' : i === warmupIndex ? 'bg-yellow-500 animate-pulse' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RULE BUILDER PHASE */}
      {phase === 'rule_builder' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-5xl w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full text-purple-300 mb-4">
                <Brain className="w-5 h-5" />
                Phase 2: Rule Builder Challenge
              </div>
              <h2 className="text-4xl font-bold mb-2">Build IF-THEN Rules</h2>
              <p className="text-orange-200">Team Brain: Create decision rules from these lion behaviors</p>
            </div>

            {ruleBuilderPhase === 'cards' && (
              <div className="space-y-8">
                <p className="text-center text-orange-200 text-lg">🔊 Click on each lion to hear their sound!</p>
                <div className="flex justify-center gap-8 flex-wrap">
                  {ruleBuilderCards.map((card) => (
                    <AnimalMediaCard
                      key={card.id}
                      emoji={card.emoji}
                      label={card.label}
                      description={card.description}
                      imageUrl={card.imageUrl}
                      sound={card.sound}
                      playSound={playSound}
                      cardType="lion"
                      isRevealed={true}
                      size="lg"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => {
                      setRuleBuilderPhase('building');
                      sound('reveal');
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-xl px-8 py-4"
                  >
                    Start Building Rules <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {ruleBuilderPhase === 'building' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-400" />
                    Create Rules
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">IF (condition):</label>
                      <input
                        type="text"
                        value={ruleInput.condition}
                        onChange={(e) => setRuleInput(prev => ({ ...prev, condition: e.target.value }))}
                        placeholder="e.g., lion is proud"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">THEN (action):</label>
                      <input
                        type="text"
                        value={ruleInput.action}
                        onChange={(e) => setRuleInput(prev => ({ ...prev, action: e.target.value }))}
                        placeholder="e.g., challenge his pride"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      if (ruleInput.condition && ruleInput.action) {
                        setTeamRules(prev => [...prev, {
                          id: Date.now().toString(),
                          condition: ruleInput.condition,
                          action: ruleInput.action,
                          teamId: 'brain'
                        }]);
                        setRuleInput({ condition: '', action: '' });
                        sound('success');
                      }
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!ruleInput.condition || !ruleInput.action}
                  >
                    Add Rule (+2 points)
                  </Button>
                  
                  <div className="mt-6 p-4 bg-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-200">
                      <strong>Hint:</strong> Consider both card behaviors:
                    </p>
                    <ul className="text-sm mt-2 space-y-1">
                      {ruleBuilderCards.map(card => (
                        <li key={card.id}>• {card.label} → {card.description}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4">Team Rules ({teamRules.length})</h3>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {teamRules.map((rule, i) => (
                      <div key={rule.id} className="bg-white/10 rounded-lg p-4">
                        <div className="text-yellow-400 font-medium">IF {rule.condition}</div>
                        <div className="text-green-400 font-medium">THEN {rule.action}</div>
                      </div>
                    ))}
                    {teamRules.length === 0 && (
                      <p className="text-gray-400 text-center py-8">No rules created yet...</p>
                    )}
                  </div>
                  
                  {teamRules.length >= 2 && (
                    <Button
                      onClick={() => {
                        setRuleBuilderPhase('execution');
                        sound('powerup');
                      }}
                      className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      Ready for Execution! <Footprints className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {ruleBuilderPhase === 'execution' && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">🦶</div>
                <h3 className="text-3xl font-bold mb-4">Team Feet: Execute!</h3>
                <p className="text-xl text-orange-200 mb-6">
                  Choose ONE rule and describe how to execute it:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {teamRules.map((rule) => (
                    <div key={rule.id} className="bg-white/10 rounded-lg p-4 text-left">
                      <div className="text-yellow-400 font-medium">IF {rule.condition}</div>
                      <div className="text-green-400 font-medium">THEN {rule.action}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setScores(prev => ({ ...prev, brain: prev.brain + teamRules.length * 2, feet: prev.feet + 3 }));
                      sound('success');
                      setPhase('arena_intro');
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xl px-8 py-4"
                  >
                    Strategy Complete! Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ARENA INTRO */}
      {phase === 'arena_intro' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-4xl text-center">
            <div className="text-8xl mb-6">⚔️</div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              THE STRATEGY ARENA
            </h2>
            <p className="text-2xl text-orange-200 mb-8">
              5 rounds of strategic survival
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-4">Each Round:</h3>
              <ol className="space-y-2 text-orange-100">
                <li>1️⃣ <strong>Situation Reveal</strong> - Draw Lion, Environment, and Ability cards</li>
                <li>2️⃣ <strong>Team Eyes</strong> - List observable signals (2 min)</li>
                <li>3️⃣ <strong>Team Brain</strong> - Build IF-THEN rules (3 min)</li>
                <li>4️⃣ <strong>Team Feet</strong> - Describe execution (2 min)</li>
                <li>5️⃣ <strong>Judgment</strong> - Teacher evaluates outcome</li>
              </ol>
            </div>

            <p className="text-xl text-yellow-300 mb-8">
              ⚠️ LION ROARS may interrupt at any time!
            </p>

            <Button
              onClick={() => {
                setRound(1);
                initArenaRound();
                setPhase('arena');
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xl px-8 py-4"
            >
              Enter the Arena <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ARENA PHASE */}
      {phase === 'arena' && situation && (
        <div className="min-h-screen p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <span className="bg-orange-600 px-4 py-2 rounded-full font-bold">
                  Round {round}/{totalRounds}
                </span>
                {isTimerRunning && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    discussionTimer <= 10 ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
                  }`}>
                    <Timer className="w-5 h-5" />
                    {Math.floor(discussionTimer / 60)}:{(discussionTimer % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <div className="bg-blue-600 px-4 py-2 rounded-full">
                  <Eye className="w-4 h-4 inline mr-2" />Eyes: {scores.eyes}
                </div>
                <div className="bg-purple-600 px-4 py-2 rounded-full">
                  <Brain className="w-4 h-4 inline mr-2" />Brain: {scores.brain}
                </div>
                <div className="bg-green-600 px-4 py-2 rounded-full">
                  <Footprints className="w-4 h-4 inline mr-2" />Feet: {scores.feet}
                </div>
              </div>
            </div>

            {/* Situation Cards - With Images and Sounds */}
            {arenaStep === 'reveal' && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-8">🎴 Situation Revealed!</h2>
                <p className="text-orange-200 mb-6 text-lg">🔊 Click on any card to hear the sound!</p>
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  {/* Lion Card with Image */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-amber-300 mb-2 font-semibold">🦁 Lion Behavior</div>
                    <AnimalMediaCard
                      emoji={situation.lionBehavior.emoji}
                      label={situation.lionBehavior.label}
                      description={situation.lionBehavior.description}
                      imageUrl={situation.lionBehavior.imageUrl}
                      sound={situation.lionBehavior.sound}
                      playSound={playSound}
                      cardType="lion"
                      isRevealed={true}
                      size="lg"
                    />
                  </div>
                  
                  {/* Environment Card */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-emerald-300 mb-2 font-semibold">🌍 Environment</div>
                    <AnimalMediaCard
                      emoji={situation.environment.emoji}
                      label={situation.environment.label}
                      description={situation.environment.description}
                      playSound={playSound}
                      cardType="environment"
                      isRevealed={true}
                      size="lg"
                    />
                  </div>
                  
                  {/* Hare Card with Image */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-purple-300 mb-2 font-semibold">🐰 Hare Ability</div>
                    <AnimalMediaCard
                      emoji={situation.hareAbility.emoji}
                      label={situation.hareAbility.label}
                      description={situation.hareAbility.description}
                      imageUrl={situation.hareAbility.imageUrl}
                      sound={situation.hareAbility.sound}
                      playSound={playSound}
                      cardType="hare"
                      isRevealed={true}
                      size="lg"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    setArenaStep('eyes');
                    startTimer(120);
                    sound('reveal');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-xl px-8 py-4"
                >
                  <Eye className="w-5 h-5 mr-2" /> Team Eyes: Observe!
                </Button>
                
                <div className="mt-8">
                  <Button
                    onClick={triggerEvent}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                  >
                    🦁 TRIGGER LION ROAR!
                  </Button>
                </div>
              </div>
            )}

            {/* Eyes Phase */}
            {arenaStep === 'eyes' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-900/50 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Eye className="w-6 h-6 text-blue-400" />
                    Team Eyes: List Signals
                  </h3>
                  <p className="text-blue-200 mb-4">What can be OBSERVED? (Not interpreted)</p>
                  
                  <div className="space-y-3 mb-4">
                    {['Signal 1', 'Signal 2', 'Signal 3'].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        value={eyesSignals[i] || ''}
                        onChange={(e) => {
                          const newSignals = [...eyesSignals];
                          newSignals[i] = e.target.value;
                          setEyesSignals(newSignals);
                        }}
                        placeholder={`Signal ${i + 1}...`}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                      />
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setArenaStep('brain');
                      startTimer(180);
                      sound('switch');
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={eyesSignals.filter(s => s).length < 2}
                  >
                    Pass to Team Brain <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Current Situation</h3>
                  <p className="text-xs text-white/60 mb-3">🔊 Click cards for sounds</p>
                  <div className="space-y-3">
                    <CompactAnimalCard
                      emoji={situation.lionBehavior.emoji}
                      label={situation.lionBehavior.label}
                      imageUrl={situation.lionBehavior.imageUrl}
                      sound={situation.lionBehavior.sound}
                      playSound={playSound}
                      cardType="lion"
                    />
                    <CompactAnimalCard
                      emoji={situation.environment.emoji}
                      label={situation.environment.label}
                      playSound={playSound}
                      cardType="environment"
                    />
                    <CompactAnimalCard
                      emoji={situation.hareAbility.emoji}
                      label={situation.hareAbility.label}
                      imageUrl={situation.hareAbility.imageUrl}
                      sound={situation.hareAbility.sound}
                      playSound={playSound}
                      cardType="hare"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Brain Phase */}
            {arenaStep === 'brain' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-purple-900/50 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-400" />
                    Team Brain: Build Rules
                  </h3>
                  <p className="text-purple-200 mb-4">Create IF-THEN rules based on signals</p>
                  
                  <div className="space-y-3 mb-4">
                    {[0, 1, 2].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={brainRules[i] || ''}
                        onChange={(e) => {
                          const newRules = [...brainRules];
                          newRules[i] = e.target.value;
                          setBrainRules(newRules);
                        }}
                        placeholder={`IF ... THEN ... (Rule ${i + 1})`}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                      />
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setArenaStep('feet');
                      startTimer(120);
                      sound('switch');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={brainRules.filter(r => r).length < 1}
                  >
                    Pass to Team Feet <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Signals from Team Eyes</h3>
                  <div className="space-y-2">
                    {eyesSignals.filter(s => s).map((signal, i) => (
                      <div key={i} className="bg-blue-500/20 rounded-lg p-3">
                        👁️ {signal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Feet Phase */}
            {arenaStep === 'feet' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-green-900/50 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Footprints className="w-6 h-6 text-green-400" />
                    Team Feet: Execute Strategy
                  </h3>
                  <p className="text-green-200 mb-4">Describe how you execute the chosen rule</p>
                  
                  <textarea
                    value={feetStrategy}
                    onChange={(e) => setFeetStrategy(e.target.value)}
                    placeholder="Describe the Hare's escape strategy..."
                    rows={5}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none"
                  />

                  <Button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setArenaStep('judge');
                      sound('reveal');
                    }}
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                    disabled={!feetStrategy}
                  >
                    Submit for Judgment ⚖️
                  </Button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Rules from Team Brain</h3>
                  <div className="space-y-2">
                    {brainRules.filter(r => r).map((rule, i) => (
                      <div key={i} className="bg-purple-500/20 rounded-lg p-3">
                        🧠 {rule}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Judge Phase */}
            {arenaStep === 'judge' && (
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8">⚖️ Teacher Judgment</h2>
                
                {outcome === null ? (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left">
                      <h3 className="text-xl font-bold mb-4">Strategy Summary:</h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-blue-400 font-bold">Signals:</span>
                          <p className="text-gray-300">{eyesSignals.filter(s => s).join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-purple-400 font-bold">Rules:</span>
                          {brainRules.filter(r => r).map((rule, i) => (
                            <p key={i} className="text-gray-300">• {rule}</p>
                          ))}
                        </div>
                        <div>
                          <span className="text-green-400 font-bold">Execution:</span>
                          <p className="text-gray-300">{feetStrategy}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => judgeOutcome('success')}
                        className="bg-green-600 hover:bg-green-700 text-xl px-8 py-6"
                      >
                        🟢 Success
                      </Button>
                      <Button
                        onClick={() => judgeOutcome('partial')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-xl px-8 py-6"
                      >
                        🟡 Partial
                      </Button>
                      <Button
                        onClick={() => judgeOutcome('fail')}
                        className="bg-red-600 hover:bg-red-700 text-xl px-8 py-6"
                      >
                        🔴 Lion Catches Hare
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className={`p-12 rounded-3xl ${
                    outcome === 'success' ? 'bg-green-600/30' :
                    outcome === 'partial' ? 'bg-yellow-600/30' : 'bg-red-600/30'
                  }`}>
                    <div className="text-8xl mb-6">
                      {outcome === 'success' ? '🎉' : outcome === 'partial' ? '😅' : '😰'}
                    </div>
                    <h3 className="text-4xl font-bold mb-4">
                      {outcome === 'success' ? 'The Hare Escapes!' :
                       outcome === 'partial' ? 'Close Call!' : 'Lion Catches Hare!'}
                    </h3>
                    <p className="text-xl text-gray-200 mb-8">
                      {outcome === 'success' ? 'Excellent strategy and execution!' :
                       outcome === 'partial' ? 'Good thinking, but room for improvement.' :
                       'The strategy needed better adaptation.'}
                    </p>
                    
                    <Button
                      onClick={() => {
                        if (round < totalRounds) {
                          setRound(prev => prev + 1);
                          initArenaRound();
                        } else {
                          setPhase('boss_intro');
                        }
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xl px-8 py-4"
                    >
                      {round < totalRounds ? 'Next Round' : 'Boss Round!'} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Event Trigger Button */}
            {arenaStep !== 'reveal' && arenaStep !== 'judge' && (
              <div className="fixed bottom-6 right-6">
                <Button
                  onClick={triggerEvent}
                  className="bg-red-600 hover:bg-red-700 rounded-full p-4 shadow-2xl"
                >
                  🦁 LION ROARS!
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOSS INTRO */}
      {phase === 'boss_intro' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-4xl text-center">
            <div className="text-8xl mb-6 animate-pulse">👑🦁👑</div>
            <h2 className="text-5xl font-bold mb-6 text-red-400">
              BOSS ROUND: LION EVOLUTION
            </h2>
            <p className="text-2xl text-orange-200 mb-8">
              The Lion has been learning. Now he's smarter!
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-4">Lion Intelligence Levels:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-yellow-500/20 rounded-lg p-3">
                  <span className="text-2xl">🌟</span>
                  <span>Level 1: Lion believes reflections</span>
                </div>
                <div className="flex items-center gap-3 bg-orange-500/20 rounded-lg p-3">
                  <span className="text-2xl">🌟🌟</span>
                  <span>Level 2: Lion has seen reflections before</span>
                </div>
                <div className="flex items-center gap-3 bg-red-500/20 rounded-lg p-3">
                  <span className="text-2xl">🌟🌟🌟</span>
                  <span>Level 3: Lion tests the water first</span>
                </div>
              </div>
            </div>

            <p className="text-xl text-yellow-300 mb-8">
              "Smart systems update their strategies."
            </p>

            <Button
              onClick={() => initBossRound(1)}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-xl px-8 py-4"
            >
              Face the Evolved Lion <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* BOSS PHASE */}
      {phase === 'boss' && situation && (
        <div className="min-h-screen p-6">
          <div className="max-w-6xl mx-auto">
            {/* Boss Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <span className="bg-red-600 px-4 py-2 rounded-full font-bold">
                  👑 Boss Level {bossLevel}
                </span>
                {lionIntelligence.length > 0 && (
                  <div className="bg-yellow-600/30 px-4 py-2 rounded-full text-yellow-300 text-sm">
                    ⚠️ {lionIntelligence.join(' • ')}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <div className="bg-blue-600 px-4 py-2 rounded-full">Eyes: {scores.eyes}</div>
                <div className="bg-purple-600 px-4 py-2 rounded-full">Brain: {scores.brain}</div>
                <div className="bg-green-600 px-4 py-2 rounded-full">Feet: {scores.feet}</div>
              </div>
            </div>

            {/* Boss Situation */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-6">The Evolved Lion Approaches...</h2>
              
              <div className="flex justify-center gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 w-56 text-center">
                  <div className="text-sm text-red-200 mb-2">Lion (Evolved)</div>
                  <div className="text-5xl mb-3">{situation.lionBehavior.emoji}</div>
                  <div className="font-bold">{situation.lionBehavior.label}</div>
                  <div className="mt-2 text-yellow-300 text-sm">
                    {'⭐'.repeat(bossLevel)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 w-56 text-center">
                  <div className="text-5xl mb-3">{situation.environment.emoji}</div>
                  <div className="font-bold">{situation.environment.label}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 w-56 text-center">
                  <div className="text-5xl mb-3">{situation.hareAbility.emoji}</div>
                  <div className="font-bold">{situation.hareAbility.label}</div>
                </div>
              </div>

              <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
                <h3 className="text-xl font-bold text-red-300 mb-3">⚠️ Lion's Knowledge:</h3>
                <ul className="text-left space-y-2">
                  {lionIntelligence.map((intel, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-yellow-400">🧠</span>
                      <span>{intel}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xl text-orange-200 mb-6">
                Build a strategy that accounts for the Lion's evolved intelligence!
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setScores(prev => ({
                      eyes: prev.eyes + bossLevel * 3,
                      brain: prev.brain + bossLevel * 3,
                      feet: prev.feet + bossLevel * 3
                    }));
                    sound('success');
                    if (bossLevel < 3) {
                      initBossRound(bossLevel + 1);
                    } else {
                      initFinalChallenge();
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-xl px-8 py-4"
                >
                  🟢 Strategy Succeeds!
                </Button>
                <Button
                  onClick={() => {
                    sound('danger');
                    if (bossLevel < 3) {
                      initBossRound(bossLevel + 1);
                    } else {
                      initFinalChallenge();
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-xl px-8 py-4"
                >
                  🔴 Lion Adapts
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FINAL CHALLENGE */}
      {phase === 'final_challenge' && finalCards && (
        <div className="min-h-screen p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full text-yellow-300 mb-4">
                <Trophy className="w-5 h-5" />
                Final Challenge: Build the Perfect Strategy
              </div>
              <h2 className="text-4xl font-bold mb-2">Complete Strategy Tree</h2>
              <p className="text-orange-200">Combine everything you've learned!</p>
            </div>

            {/* 4 Cards with Images and Sounds */}
            <p className="text-center text-orange-200 mb-4">🔊 Click on cards to hear their sounds!</p>
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <AnimalMediaCard
                emoji={finalCards.lion.emoji}
                label={finalCards.lion.label}
                description={finalCards.lion.description}
                imageUrl={finalCards.lion.imageUrl}
                sound={finalCards.lion.sound}
                playSound={playSound}
                cardType="lion"
                isRevealed={true}
                size="sm"
              />
              <AnimalMediaCard
                emoji={finalCards.env1.emoji}
                label={finalCards.env1.label}
                description={finalCards.env1.description}
                playSound={playSound}
                cardType="environment"
                isRevealed={true}
                size="sm"
              />
              <AnimalMediaCard
                emoji={finalCards.env2.emoji}
                label={finalCards.env2.label}
                description={finalCards.env2.description}
                playSound={playSound}
                cardType="environment"
                isRevealed={true}
                size="sm"
              />
              <AnimalMediaCard
                emoji={finalCards.ability.emoji}
                label={finalCards.ability.label}
                description={finalCards.ability.description}
                imageUrl={finalCards.ability.imageUrl}
                sound={finalCards.ability.sound}
                playSound={playSound}
                cardType="hare"
                isRevealed={true}
                size="sm"
              />
            </div>

            {/* Strategy Tree Builder */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Build Strategy Tree</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Create IF-THEN rules for each condition:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-amber-500/20 rounded-lg p-3">
                    <p className="text-amber-300 mb-2">IF {finalCards.lion.label}...</p>
                    <input
                      type="text"
                      placeholder="THEN..."
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                          addToStrategyTree(`IF ${finalCards.lion.label} → THEN ${(e.target as HTMLInputElement).value}`);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="bg-emerald-500/20 rounded-lg p-3">
                    <p className="text-emerald-300 mb-2">IF {finalCards.env1.label}...</p>
                    <input
                      type="text"
                      placeholder="THEN..."
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                          addToStrategyTree(`IF ${finalCards.env1.label} → THEN ${(e.target as HTMLInputElement).value}`);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="bg-cyan-500/20 rounded-lg p-3">
                    <p className="text-cyan-300 mb-2">IF {finalCards.env2.label}...</p>
                    <input
                      type="text"
                      placeholder="THEN..."
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                          addToStrategyTree(`IF ${finalCards.env2.label} → THEN ${(e.target as HTMLInputElement).value}`);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    <p className="text-purple-300 mb-2">IF {finalCards.ability.label}...</p>
                    <input
                      type="text"
                      placeholder="THEN..."
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                          addToStrategyTree(`IF ${finalCards.ability.label} → THEN ${(e.target as HTMLInputElement).value}`);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Press Enter to add each rule</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Strategy Tree ({finalStrategyTree.length}/4)</h3>
                <div className="space-y-2 min-h-48">
                  {finalStrategyTree.map((rule, i) => (
                    <div key={i} className="bg-green-500/20 rounded-lg p-3 text-sm">
                      ✓ {rule}
                    </div>
                  ))}
                  {finalStrategyTree.length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      Add rules for each card condition...
                    </p>
                  )}
                </div>
                
                {finalStrategyTree.length >= 4 && (
                  <Button
                    onClick={() => {
                      setScores(prev => ({
                        eyes: prev.eyes + 10,
                        brain: prev.brain + 10,
                        feet: prev.feet + 10
                      }));
                      sound('combo');
                      setPhase('results');
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Trophy className="w-5 h-5 mr-2" /> Complete Challenge!
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {phase === 'results' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-4xl text-center">
            <div className="text-8xl mb-6">🏆</div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              STRATEGY MASTERS!
            </h1>
            <p className="text-2xl text-orange-200 mb-8">
              You've learned to build IF-THEN decision rules!
            </p>

            <div className="flex justify-center gap-6 mb-12">
              <div className="bg-blue-600 rounded-2xl p-6 w-40 text-center">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{scores.eyes}</div>
                <div className="text-sm">Team Eyes</div>
              </div>
              <div className="bg-purple-600 rounded-2xl p-6 w-40 text-center">
                <Brain className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{scores.brain}</div>
                <div className="text-sm">Team Brain</div>
              </div>
              <div className="bg-green-600 rounded-2xl p-6 w-40 text-center">
                <Footprints className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{scores.feet}</div>
                <div className="text-sm">Team Feet</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto text-left">
              <h3 className="text-xl font-bold mb-4 text-center">Key Lessons</h3>
              <ul className="space-y-2 text-orange-100">
                <li>✓ Observation provides the signals for decision-making</li>
                <li>✓ IF-THEN rules turn knowledge into strategy</li>
                <li>✓ Smart systems update strategies when opponents learn</li>
                <li>✓ Combining conditions creates powerful decision trees</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xl px-8 py-4"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Play Again
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-xl px-8 py-4"
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Back to Games
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== GAME 4: LOGIC CHAIN ARENA ====================
// Interactive drag-and-drop game teaching IF → THEN → DO logic chains
// Competition between 3 intelligent systems (groups), each with Eyes/Brain/Feet

// Types for the Logic Chain Game
interface LogicCard {
  id: string;
  type: 'signal' | 'pattern' | 'strategy';
  emoji: string;
  text: string;
  category?: string; // For organizing signals
  correct?: boolean;
}

interface Scenario {
  id: string;
  level: number;
  title: string;
  story: string;
  lionState: string;
  environment: string;
  availableCards: {
    signals: LogicCard[];
    patterns: LogicCard[];
    strategies: LogicCard[];
  };
  correctChain: {
    signals: string[];
    pattern: string;
    strategy: string;
  };
  timeLimit: number;
  points: number;
}

interface IntelligentSystem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  score: number;
  roundsWon: number;
  currentRole: 'eyes' | 'brain' | 'feet';
}

// Master Signal Bank from "The Hare and The Lion" Story
// Categories: Lion Body Language, Lion Sounds, Lion Behaviors, Environment, Hare Actions, Other Animals
const STORY_SIGNAL_BANK: LogicCard[] = [
  // Lion Body Language
  { id: 'sig_drool', type: 'signal', emoji: '🤤', text: 'Lion is drooling', category: 'Lion Body' },
  { id: 'sig_puff', type: 'signal', emoji: '👑', text: 'Lion puffs up chest', category: 'Lion Body' },
  { id: 'sig_ears_flat', type: 'signal', emoji: '👂', text: 'Ears are flat against head', category: 'Lion Body' },
  { id: 'sig_squint', type: 'signal', emoji: '🤨', text: 'Lion squints eyes', category: 'Lion Body' },
  { id: 'sig_circle', type: 'signal', emoji: '🔄', text: 'Lion circles slowly', category: 'Lion Body' },
  { id: 'sig_yawn', type: 'signal', emoji: '😴', text: 'Lion yawns wide', category: 'Lion Body' },
  { id: 'sig_one_eye', type: 'signal', emoji: '👁️', text: 'One eye stays open', category: 'Lion Body' },
  { id: 'sig_tail_swish', type: 'signal', emoji: '🐾', text: 'Tail swishing back and forth', category: 'Lion Body' },
  { id: 'sig_crouch', type: 'signal', emoji: '🦁', text: 'Lion crouches low', category: 'Lion Body' },
  
  // Lion Sounds
  { id: 'sig_growl', type: 'signal', emoji: '😤', text: 'Lion growls loudly', category: 'Lion Sounds' },
  { id: 'sig_roar', type: 'signal', emoji: '🔊', text: 'Lion roars at reflection', category: 'Lion Sounds' },
  { id: 'sig_snarl', type: 'signal', emoji: '😠', text: 'Lion snarls showing teeth', category: 'Lion Sounds' },
  { id: 'sig_purr', type: 'signal', emoji: '😌', text: 'Low rumbling sound', category: 'Lion Sounds' },
  
  // Lion Mental States
  { id: 'sig_focus', type: 'signal', emoji: '🎯', text: 'Lion stares intensely', category: 'Lion Mind' },
  { id: 'sig_confused', type: 'signal', emoji: '❓', text: 'Lion tilts head confused', category: 'Lion Mind' },
  { id: 'sig_calculating', type: 'signal', emoji: '🧠', text: 'Lion watches carefully', category: 'Lion Mind' },
  { id: 'sig_hesitate', type: 'signal', emoji: '⏸️', text: 'Lion hesitates at well', category: 'Lion Mind' },
  
  // Environment - Well
  { id: 'sig_still_water', type: 'signal', emoji: '💧', text: 'Water is very still', category: 'Well' },
  { id: 'sig_deep_well', type: 'signal', emoji: '🕳️', text: 'Well is very deep', category: 'Well' },
  { id: 'sig_reflection', type: 'signal', emoji: '🪞', text: 'Clear reflection visible', category: 'Well' },
  { id: 'sig_echo', type: 'signal', emoji: '📢', text: 'Echo bounces in well', category: 'Well' },
  { id: 'sig_muddy', type: 'signal', emoji: '🟤', text: 'Water is murky', category: 'Well' },
  { id: 'sig_dark_well', type: 'signal', emoji: '⬛', text: 'Well bottom not visible', category: 'Well' },
  
  // Environment - Weather & Setting
  { id: 'sig_hot_sun', type: 'signal', emoji: '☀️', text: 'Hot sun overhead', category: 'Weather' },
  { id: 'sig_rain', type: 'signal', emoji: '🌧️', text: 'Ground is wet and slippery', category: 'Weather' },
  { id: 'sig_storm', type: 'signal', emoji: '⛈️', text: 'Thunder in distance', category: 'Weather' },
  { id: 'sig_dark', type: 'signal', emoji: '🌙', text: 'Getting dark', category: 'Weather' },
  
  // Environment - Location
  { id: 'sig_den', type: 'signal', emoji: '🏠', text: 'Near the lion\'s den', category: 'Location' },
  { id: 'sig_rock', type: 'signal', emoji: '🪨', text: 'King\'s rock nearby', category: 'Location' },
  { id: 'sig_grass', type: 'signal', emoji: '🌾', text: 'Tall grass for hiding', category: 'Location' },
  { id: 'sig_path', type: 'signal', emoji: '🛤️', text: 'Path leads to well', category: 'Location' },
  
  // Hare Actions & Story Elements
  { id: 'sig_hare_late', type: 'signal', emoji: '⏰', text: 'Hare arrives late', category: 'Story' },
  { id: 'sig_hare_bow', type: 'signal', emoji: '🙇', text: 'Hare bows respectfully', category: 'Story' },
  { id: 'sig_hare_speak', type: 'signal', emoji: '💬', text: 'Hare mentions rival lion', category: 'Story' },
  { id: 'sig_hare_point', type: 'signal', emoji: '👆', text: 'Hare points at well', category: 'Story' },
  { id: 'sig_hare_tremble', type: 'signal', emoji: '😰', text: 'Hare appears scared', category: 'Story' },
  
  // Other Animals
  { id: 'sig_animals_watch', type: 'signal', emoji: '👀', text: 'Other animals watching', category: 'Others' },
  { id: 'sig_hyena', type: 'signal', emoji: '🦴', text: 'Hyena lurking nearby', category: 'Others' },
  { id: 'sig_birds', type: 'signal', emoji: '🦅', text: 'Birds circling overhead', category: 'Others' },
];

// Pattern Bank - interpretations of combined signals
const STORY_PATTERN_BANK: LogicCard[] = [
  // Hunger patterns
  { id: 'pat_hungry_now', type: 'pattern', emoji: '⚠️', text: 'Lion wants food NOW', category: 'Hunger' },
  { id: 'pat_distracted', type: 'pattern', emoji: '🤔', text: 'Hunger makes lion distracted', category: 'Hunger' },
  
  // Pride patterns
  { id: 'pat_pride_weak', type: 'pattern', emoji: '👑', text: 'Pride is his weakness', category: 'Pride' },
  { id: 'pat_show_off', type: 'pattern', emoji: '💪', text: 'Lion needs to prove dominance', category: 'Pride' },
  { id: 'pat_reputation', type: 'pattern', emoji: '🎭', text: 'Lion won\'t look weak publicly', category: 'Pride' },
  
  // Anger patterns
  { id: 'pat_angry_curious', type: 'pattern', emoji: '🔥', text: 'Angry but curious WHY', category: 'Anger' },
  { id: 'pat_rage_blind', type: 'pattern', emoji: '😡', text: 'Rage makes lion blind to tricks', category: 'Anger' },
  
  // Suspicion patterns
  { id: 'pat_conflicting', type: 'pattern', emoji: '⚖️', text: 'Conflicting urges: eat vs doubt', category: 'Conflict' },
  { id: 'pat_testing', type: 'pattern', emoji: '🔍', text: 'Lion is testing before acting', category: 'Conflict' },
  
  // Tiredness patterns
  { id: 'pat_tired_alert', type: 'pattern', emoji: '🎯', text: 'Tired but not off-guard', category: 'Tiredness' },
  { id: 'pat_slow_react', type: 'pattern', emoji: '🐌', text: 'Reactions are slower', category: 'Tiredness' },
  
  // Environmental patterns
  { id: 'pat_reflection_trick', type: 'pattern', emoji: '🪞', text: 'Reflection will show rival lion', category: 'Environment' },
  { id: 'pat_echo_trick', type: 'pattern', emoji: '🔊', text: 'Echo can simulate rival voice', category: 'Environment' },
  { id: 'pat_need_adapt', type: 'pattern', emoji: '🔄', text: 'Old trick won\'t work - need new approach', category: 'Environment' },
  { id: 'pat_use_terrain', type: 'pattern', emoji: '🗺️', text: 'Environment gives advantage', category: 'Environment' },
  
  // Intelligence patterns
  { id: 'pat_too_smart', type: 'pattern', emoji: '🧠', text: 'Lion learned from past tricks', category: 'Intelligence' },
  { id: 'pat_multi_layer', type: 'pattern', emoji: '🎯', text: 'Need multi-layered deception', category: 'Intelligence' },
  
  // Combined patterns
  { id: 'pat_perfect_storm', type: 'pattern', emoji: '🌟', text: 'All elements align for master plan', category: 'Combined' },
];

// Strategy Bank - possible actions
const STORY_STRATEGY_BANK: LogicCard[] = [
  // Delay tactics
  { id: 'str_delay', type: 'strategy', emoji: '⏰', text: 'Arrive late with excuse', category: 'Delay' },
  { id: 'str_long_story', type: 'strategy', emoji: '📖', text: 'Tell a long story', category: 'Delay' },
  
  // Pride manipulation
  { id: 'str_rival_king', type: 'strategy', emoji: '👑', text: 'Mention a rival king', category: 'Pride' },
  { id: 'str_public_challenge', type: 'strategy', emoji: '🎤', text: 'Loudly announce: "The OTHER lion is stronger!"', category: 'Pride' },
  { id: 'str_question_strength', type: 'strategy', emoji: '💪', text: 'Question lion\'s strength', category: 'Pride' },
  
  // Well tricks
  { id: 'str_show_reflection', type: 'strategy', emoji: '👆', text: 'Point at reflection: "There he is!"', category: 'Well' },
  { id: 'str_well_echo', type: 'strategy', emoji: '🔊', text: 'Shout challenge into well for echo', category: 'Well' },
  { id: 'str_lead_to_well', type: 'strategy', emoji: '🛤️', text: 'Lead lion toward the well', category: 'Well' },
  
  // Escape tactics
  { id: 'str_run', type: 'strategy', emoji: '🏃', text: 'Run away quickly', category: 'Escape' },
  { id: 'str_hide', type: 'strategy', emoji: '🌾', text: 'Hide in tall grass', category: 'Escape' },
  { id: 'str_wait_dark', type: 'strategy', emoji: '🌙', text: 'Wait until dark to escape', category: 'Escape' },
  
  // Emotional manipulation
  { id: 'str_act_scared', type: 'strategy', emoji: '😰', text: 'Act very scared', category: 'Acting' },
  { id: 'str_pretend_surrender', type: 'strategy', emoji: '🏳️', text: 'Pretend to surrender', category: 'Acting' },
  { id: 'str_beg', type: 'strategy', emoji: '😢', text: 'Beg for mercy', category: 'Acting' },
  
  // Redirection
  { id: 'str_redirect_anger', type: 'strategy', emoji: '📖', text: 'Tell story of rival who ate your food', category: 'Redirect' },
  { id: 'str_blame_rival', type: 'strategy', emoji: '🦁', text: 'Blame delay on rival lion', category: 'Redirect' },
  
  // Complex strategies
  { id: 'str_layered', type: 'strategy', emoji: '🎭', text: 'Surrender first, then mention rival', category: 'Complex' },
  { id: 'str_master_plan', type: 'strategy', emoji: '🎯', text: 'Challenge pride + lead to well + use reflection + thunder', category: 'Complex' },
  
  // Social strategies
  { id: 'str_use_audience', type: 'strategy', emoji: '👀', text: 'Use watching animals as witnesses', category: 'Social' },
  { id: 'str_ally_hyena', type: 'strategy', emoji: '🦴', text: 'Get hyena to create distraction', category: 'Social' },
];

// Game Data: Scenarios for each level (hints removed, using neutral descriptions)
const LOGIC_CHAIN_SCENARIOS: Scenario[] = [
  // LEVEL 1: Single Signal
  {
    id: 'l1_s1',
    level: 1,
    title: 'The Hungry Lion',
    story: 'The hare approaches the lion\'s den. The lion hasn\'t eaten all day.',
    lionState: 'hungry',
    environment: 'Near the den',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '🤤', text: 'Lion is drooling', category: 'Lion Body' },
        { id: 's2', type: 'signal', emoji: '☀️', text: 'Sun is bright', category: 'Weather' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '⚠️', text: 'Lion wants food NOW', category: 'Hunger' },
        { id: 'p2', type: 'pattern', emoji: '😴', text: 'Lion is sleepy', category: 'Tiredness' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '⏰', text: 'Arrive late with excuse', category: 'Delay' },
        { id: 'st2', type: 'strategy', emoji: '🏃', text: 'Run away quickly', category: 'Escape' },
      ]
    },
    correctChain: { signals: ['s1'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 60,
    points: 100
  },
  {
    id: 'l1_s2',
    level: 1,
    title: 'The Proud King',
    story: 'The lion sits on his rock, surveying his kingdom with pride.',
    lionState: 'proud',
    environment: 'On the king\'s rock',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '👑', text: 'Lion puffs up chest', category: 'Lion Body' },
        { id: 's2', type: 'signal', emoji: '🌿', text: 'Grass is green', category: 'Environment' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '💪', text: 'Pride is his weakness', category: 'Pride' },
        { id: 'p2', type: 'pattern', emoji: '😊', text: 'Lion is friendly', category: 'Social' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '👑', text: 'Mention a rival king', category: 'Pride' },
        { id: 'st2', type: 'strategy', emoji: '🎁', text: 'Offer a gift', category: 'Social' },
      ]
    },
    correctChain: { signals: ['s1'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 60,
    points: 100
  },
  // LEVEL 2: Multiple Signals
  {
    id: 'l2_s1',
    level: 2,
    title: 'The Angry Hunter',
    story: 'The lion growls as the hare arrives late. His ears are flat and tail swishing.',
    lionState: 'angry',
    environment: 'Outside the den',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '😤', text: 'Lion growls loudly', category: 'Lion Sounds' },
        { id: 's2', type: 'signal', emoji: '👂', text: 'Ears are flat against head', category: 'Lion Body' },
        { id: 's3', type: 'signal', emoji: '🌸', text: 'Flowers blooming nearby', category: 'Environment' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '🔥', text: 'Angry but curious WHY', category: 'Anger' },
        { id: 'p2', type: 'pattern', emoji: '😴', text: 'Lion is tired', category: 'Tiredness' },
        { id: 'p3', type: 'pattern', emoji: '🎉', text: 'Lion is happy', category: 'Social' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '📖', text: 'Tell story of rival lion', category: 'Redirect' },
        { id: 'st2', type: 'strategy', emoji: '😢', text: 'Apologize profusely', category: 'Acting' },
        { id: 'st3', type: 'strategy', emoji: '🏃', text: 'Run away quickly', category: 'Escape' },
      ]
    },
    correctChain: { signals: ['s1', 's2'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 75,
    points: 200
  },
  {
    id: 'l2_s2',
    level: 2,
    title: 'Near the Well',
    story: 'The hare leads the angry lion toward a deep well with clear water.',
    lionState: 'curious',
    environment: 'Near the well',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '💧', text: 'Water is very still', category: 'Well' },
        { id: 's2', type: 'signal', emoji: '🕳️', text: 'Well is very deep', category: 'Well' },
        { id: 's3', type: 'signal', emoji: '🦅', text: 'Bird flies by', category: 'Others' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '🪞', text: 'Reflection will show rival lion', category: 'Environment' },
        { id: 'p2', type: 'pattern', emoji: '🏊', text: 'Lion can swim', category: 'Physical' },
        { id: 'p3', type: 'pattern', emoji: '💦', text: 'Lion is thirsty', category: 'Hunger' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '👆', text: 'Point at reflection: "There he is!"', category: 'Well' },
        { id: 'st2', type: 'strategy', emoji: '💦', text: 'Splash water at lion', category: 'Direct' },
        { id: 'st3', type: 'strategy', emoji: '🤜', text: 'Push lion in', category: 'Direct' },
      ]
    },
    correctChain: { signals: ['s1', 's2'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 75,
    points: 200
  },
  // LEVEL 3: Conflicting Signals
  {
    id: 'l3_s1',
    level: 3,
    title: 'The Suspicious Lion',
    story: 'The lion looks hungry but also suspicious. He\'s been tricked before.',
    lionState: 'suspicious',
    environment: 'Open savanna',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '🤤', text: 'Lion drools at hare', category: 'Lion Body' },
        { id: 's2', type: 'signal', emoji: '🤨', text: 'Lion squints eyes', category: 'Lion Body' },
        { id: 's3', type: 'signal', emoji: '🔄', text: 'Lion circles slowly', category: 'Lion Body' },
        { id: 's4', type: 'signal', emoji: '☁️', text: 'Clouds in sky', category: 'Weather' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '⚖️', text: 'Conflicting urges: eat vs doubt', category: 'Conflict' },
        { id: 'p2', type: 'pattern', emoji: '🍖', text: 'Just hungry', category: 'Hunger' },
        { id: 'p3', type: 'pattern', emoji: '🤔', text: 'Just suspicious', category: 'Conflict' },
        { id: 'p4', type: 'pattern', emoji: '😊', text: 'Friendly mood', category: 'Social' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '👑', text: 'Appeal to pride: "The OTHER lion ate your food!"', category: 'Pride' },
        { id: 'st2', type: 'strategy', emoji: '🏃', text: 'Run immediately', category: 'Escape' },
        { id: 'st3', type: 'strategy', emoji: '😇', text: 'Act innocent', category: 'Acting' },
        { id: 'st4', type: 'strategy', emoji: '🍎', text: 'Offer food', category: 'Social' },
      ]
    },
    correctChain: { signals: ['s1', 's2', 's3'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 90,
    points: 300
  },
  {
    id: 'l3_s2',
    level: 3,
    title: 'Tired but Alert',
    story: 'The lion yawns but keeps one eye on the hare. The day is hot.',
    lionState: 'tired_alert',
    environment: 'Hot afternoon',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '😴', text: 'Lion yawns wide', category: 'Lion Body' },
        { id: 's2', type: 'signal', emoji: '👁️', text: 'One eye stays open', category: 'Lion Body' },
        { id: 's3', type: 'signal', emoji: '☀️', text: 'Hot sun overhead', category: 'Weather' },
        { id: 's4', type: 'signal', emoji: '💧', text: 'Sound of water nearby', category: 'Environment' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '🎯', text: 'Tired but not off-guard', category: 'Tiredness' },
        { id: 'p2', type: 'pattern', emoji: '😴', text: 'Can sneak away', category: 'Escape' },
        { id: 'p3', type: 'pattern', emoji: '💤', text: 'Deeply asleep', category: 'Tiredness' },
        { id: 'p4', type: 'pattern', emoji: '🐌', text: 'Too slow to catch', category: 'Physical' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '💧', text: 'Mention cool water with rival lion at well', category: 'Well' },
        { id: 'st2', type: 'strategy', emoji: '🤫', text: 'Quietly sneak away', category: 'Escape' },
        { id: 'st3', type: 'strategy', emoji: '😴', text: 'Wait for him to sleep', category: 'Delay' },
        { id: 'st4', type: 'strategy', emoji: '🗣️', text: 'Shout to wake him', category: 'Direct' },
      ]
    },
    correctChain: { signals: ['s1', 's2', 's3'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 90,
    points: 300
  },
  // LEVEL 4: Environmental Complexity
  {
    id: 'l4_s1',
    level: 4,
    title: 'The Muddy Well',
    story: 'Rain has made the well water muddy. The reflection trick might not work!',
    lionState: 'angry',
    environment: 'Muddy well after rain',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '🟤', text: 'Water is murky', category: 'Well' },
        { id: 's2', type: 'signal', emoji: '🌧️', text: 'Ground is wet and slippery', category: 'Weather' },
        { id: 's3', type: 'signal', emoji: '😤', text: 'Lion is furious', category: 'Lion Sounds' },
        { id: 's4', type: 'signal', emoji: '📢', text: 'Echo bounces in well', category: 'Well' },
        { id: 's5', type: 'signal', emoji: '🦗', text: 'Insects buzzing', category: 'Environment' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '🔄', text: 'Old trick won\'t work - need new approach', category: 'Environment' },
        { id: 'p2', type: 'pattern', emoji: '🪞', text: 'Reflection still works', category: 'Environment' },
        { id: 'p3', type: 'pattern', emoji: '💪', text: 'Lion is stronger here', category: 'Physical' },
        { id: 'p4', type: 'pattern', emoji: '🔊', text: 'Echo can simulate rival voice', category: 'Environment' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '🔊', text: 'Shout challenge into well for echo', category: 'Well' },
        { id: 'st2', type: 'strategy', emoji: '👆', text: 'Show reflection anyway', category: 'Well' },
        { id: 'st3', type: 'strategy', emoji: '🏃', text: 'Use slippery ground to escape', category: 'Escape' },
        { id: 'st4', type: 'strategy', emoji: '😇', text: 'Hope lion is forgiving', category: 'Social' },
      ]
    },
    correctChain: { signals: ['s1', 's2', 's3', 's4'], pattern: 'p4', strategy: 'st1' },
    timeLimit: 100,
    points: 400
  },
  {
    id: 'l4_s2',
    level: 4,
    title: 'Other Animals Watching',
    story: 'A crowd of animals has gathered. The lion cares about his reputation!',
    lionState: 'proud_angry',
    environment: 'Public gathering',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '👀', text: 'Other animals watching', category: 'Others' },
        { id: 's2', type: 'signal', emoji: '👑', text: 'Lion puffs up chest', category: 'Lion Body' },
        { id: 's3', type: 'signal', emoji: '😤', text: 'Lion growls at hare', category: 'Lion Sounds' },
        { id: 's4', type: 'signal', emoji: '🦴', text: 'Hyena lurking nearby', category: 'Others' },
        { id: 's5', type: 'signal', emoji: '🌾', text: 'Tall grass for hiding', category: 'Location' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '🎭', text: 'Lion won\'t look weak publicly', category: 'Pride' },
        { id: 'p2', type: 'pattern', emoji: '😤', text: 'Lion will attack publicly', category: 'Anger' },
        { id: 'p3', type: 'pattern', emoji: '🦴', text: 'Hyena is the real threat', category: 'Social' },
        { id: 'p4', type: 'pattern', emoji: '😊', text: 'Lion will be merciful', category: 'Social' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '🎤', text: 'Loudly announce: "The OTHER lion is stronger!"', category: 'Pride' },
        { id: 'st2', type: 'strategy', emoji: '🌾', text: 'Hide in tall grass', category: 'Escape' },
        { id: 'st3', type: 'strategy', emoji: '🦴', text: 'Get hyena to create distraction', category: 'Social' },
        { id: 'st4', type: 'strategy', emoji: '😢', text: 'Beg for mercy publicly', category: 'Acting' },
      ]
    },
    correctChain: { signals: ['s1', 's2', 's3', 's4'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 100,
    points: 400
  },
  // LEVEL 5: Surprise Events
  {
    id: 'l5_s1',
    level: 5,
    title: 'The Smart Lion',
    story: 'This lion has been tricked before! He tests the well with a rock first.',
    lionState: 'intelligent',
    environment: 'Near the well - lion is cautious',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '🪨', text: 'Lion throws rock in well', category: 'Lion Mind' },
        { id: 's2', type: 'signal', emoji: '🧠', text: 'Lion watches carefully', category: 'Lion Mind' },
        { id: 's3', type: 'signal', emoji: '😤', text: 'But still angry', category: 'Lion Sounds' },
        { id: 's4', type: 'signal', emoji: '👂', text: 'Perks ears at every sound', category: 'Lion Body' },
        { id: 's5', type: 'signal', emoji: '💧', text: 'Rock splashes, no lion roar back', category: 'Well' },
        { id: 's6', type: 'signal', emoji: '🌙', text: 'Getting dark', category: 'Weather' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '🎯', text: 'Need multi-layered deception', category: 'Intelligence' },
        { id: 'p2', type: 'pattern', emoji: '🪞', text: 'Reflection will show rival lion', category: 'Environment' },
        { id: 'p3', type: 'pattern', emoji: '👑', text: 'Pride is his weakness', category: 'Pride' },
        { id: 'p4', type: 'pattern', emoji: '🧠', text: 'Lion learned from past tricks', category: 'Intelligence' },
        { id: 'p5', type: 'pattern', emoji: '⏰', text: 'Time is running out', category: 'Environment' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '🎭', text: 'Surrender first, then mention rival', category: 'Complex' },
        { id: 'st2', type: 'strategy', emoji: '👆', text: 'Point at reflection: "There he is!"', category: 'Well' },
        { id: 'st3', type: 'strategy', emoji: '🌙', text: 'Wait until dark to escape', category: 'Escape' },
        { id: 'st4', type: 'strategy', emoji: '🗣️', text: 'Convince other animals to help', category: 'Social' },
        { id: 'st5', type: 'strategy', emoji: '🎪', text: 'Create elaborate distraction', category: 'Complex' },
      ]
    },
    correctChain: { signals: ['s1', 's2', 's3', 's5'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 120,
    points: 500
  },
  {
    id: 'l5_s2',
    level: 5,
    title: 'The Final Challenge',
    story: 'Everything is at stake. The lion, the well, the watching animals, and rain approaching!',
    lionState: 'all_challenges',
    environment: 'Ultimate test',
    availableCards: {
      signals: [
        { id: 's1', type: 'signal', emoji: '😤', text: 'Lion is extremely angry', category: 'Lion Sounds' },
        { id: 's2', type: 'signal', emoji: '💧', text: 'Well water starting to clear', category: 'Well' },
        { id: 's3', type: 'signal', emoji: '👀', text: 'Other animals watching', category: 'Others' },
        { id: 's4', type: 'signal', emoji: '⛈️', text: 'Thunder in distance', category: 'Weather' },
        { id: 's5', type: 'signal', emoji: '🦴', text: 'Hyena moving closer', category: 'Others' },
        { id: 's6', type: 'signal', emoji: '👑', text: 'Lion declares himself supreme king', category: 'Lion Body' },
      ],
      patterns: [
        { id: 'p1', type: 'pattern', emoji: '🌟', text: 'All elements align for master plan', category: 'Combined' },
        { id: 'p2', type: 'pattern', emoji: '🪞', text: 'Reflection will show rival lion', category: 'Environment' },
        { id: 'p3', type: 'pattern', emoji: '⛈️', text: 'Wait for storm', category: 'Environment' },
        { id: 'p4', type: 'pattern', emoji: '🦴', text: 'Let hyena fight lion', category: 'Social' },
        { id: 'p5', type: 'pattern', emoji: '🏃', text: 'Run when chaos starts', category: 'Escape' },
      ],
      strategies: [
        { id: 'st1', type: 'strategy', emoji: '🎯', text: 'Challenge pride + lead to well + use reflection + thunder', category: 'Complex' },
        { id: 'st2', type: 'strategy', emoji: '👆', text: 'Simple reflection trick', category: 'Well' },
        { id: 'st3', type: 'strategy', emoji: '⛈️', text: 'Hide during storm', category: 'Escape' },
        { id: 'st4', type: 'strategy', emoji: '😇', text: 'Appeal to lion\'s mercy', category: 'Social' },
        { id: 'st5', type: 'strategy', emoji: '🦴', text: 'Team up with hyena', category: 'Social' },
      ]
    },
    correctChain: { signals: ['s1', 's2', 's3', 's4', 's6'], pattern: 'p1', strategy: 'st1' },
    timeLimit: 150,
    points: 600
  }
];

// Three competing intelligent systems (groups) - each has Eyes, Brain, Feet
const INTELLIGENT_SYSTEMS: IntelligentSystem[] = [
  { 
    id: 'alpha', 
    name: 'System Alpha', 
    emoji: '🔷', 
    color: 'blue', 
    bgColor: 'bg-blue-600', 
    borderColor: 'border-blue-400',
    score: 0, 
    roundsWon: 0,
    currentRole: 'eyes'
  },
  { 
    id: 'beta', 
    name: 'System Beta', 
    emoji: '🔶', 
    color: 'orange', 
    bgColor: 'bg-orange-600', 
    borderColor: 'border-orange-400',
    score: 0, 
    roundsWon: 0,
    currentRole: 'eyes'
  },
  { 
    id: 'gamma', 
    name: 'System Gamma', 
    emoji: '🟣', 
    color: 'purple', 
    bgColor: 'bg-purple-600', 
    borderColor: 'border-purple-400',
    score: 0, 
    roundsWon: 0,
    currentRole: 'eyes'
  },
];

// Legacy team config (kept for compatibility with existing phase structure)
interface TeamState {
  name: string;
  emoji: string;
  role: 'eyes' | 'brain' | 'feet';
  color: string;
  bgColor: string;
  score: number;
  streakBonus: number;
}

const LOGIC_CHAIN_TEAMS: TeamState[] = [
  { name: 'Team Eyes', emoji: '👁️', role: 'eyes', color: 'blue', bgColor: 'bg-blue-500', score: 0, streakBonus: 0 },
  { name: 'Team Brain', emoji: '🧠', role: 'brain', color: 'purple', bgColor: 'bg-purple-500', score: 0, streakBonus: 0 },
  { name: 'Team Feet', emoji: '🦶', role: 'feet', color: 'green', bgColor: 'bg-green-500', score: 0, streakBonus: 0 },
];

// Logic Chain Game Component
function LogicChainGame({ onBack }: { onBack: () => void }) {
  const { playSound } = useSound();
  const [isMuted, setIsMuted] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'tutorial' | 'playing' | 'feedback' | 'levelComplete' | 'gameOver'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [teams, setTeams] = useState<TeamState[]>(JSON.parse(JSON.stringify(LOGIC_CHAIN_TEAMS)));
  const [activeTeam, setActiveTeam] = useState<'eyes' | 'brain' | 'feet'>('eyes');
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [roundsWon, setRoundsWon] = useState(0);
  
  // Drag and drop state
  const [droppedSignals, setDroppedSignals] = useState<LogicCard[]>([]);
  const [droppedPattern, setDroppedPattern] = useState<LogicCard | null>(null);
  const [droppedStrategy, setDroppedStrategy] = useState<LogicCard | null>(null);
  const [draggingCard, setDraggingCard] = useState<LogicCard | null>(null);
  
  // Feedback state
  const [feedbackResult, setFeedbackResult] = useState<{ correct: boolean; message: string; points: number } | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sound = useCallback((type: SoundType) => {
    if (!isMuted) playSound(type);
  }, [isMuted, playSound]);

  // Get current scenario
  const currentScenarios = LOGIC_CHAIN_SCENARIOS.filter(s => s.level === currentLevel);
  const currentScenario = currentScenarios[currentScenarioIndex % currentScenarios.length];

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(prev => prev - 1);
        if (timer <= 10) sound('tick');
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sound('danger');
      handleSubmitChain(true); // Auto-submit when time runs out
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer, isTimerRunning, sound]);

  // Start a new round
  const startRound = () => {
    setDroppedSignals([]);
    setDroppedPattern(null);
    setDroppedStrategy(null);
    setDraggingCard(null);
    setFeedbackResult(null);
    setShowCorrectAnswer(false);
    setActiveTeam('eyes');
    setTimer(currentScenario?.timeLimit || 60);
    setIsTimerRunning(true);
    setPhase('playing');
    sound('reveal');
  };

  // Handle drag start
  const handleDragStart = (card: LogicCard) => {
    setDraggingCard(card);
    sound('card_flip');
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggingCard(null);
  };

  // Handle drop on zone
  const handleDrop = (zone: 'signals' | 'pattern' | 'strategy', card: LogicCard) => {
    if (zone === 'signals' && card.type === 'signal') {
      if (!droppedSignals.find(s => s.id === card.id)) {
        setDroppedSignals(prev => [...prev, card]);
        sound('reveal');
      }
    } else if (zone === 'pattern' && card.type === 'pattern') {
      setDroppedPattern(card);
      setActiveTeam('feet');
      sound('reveal');
    } else if (zone === 'strategy' && card.type === 'strategy') {
      setDroppedStrategy(card);
      sound('reveal');
    }
  };

  // Remove card from zone
  const removeFromZone = (zone: 'signals' | 'pattern' | 'strategy', cardId?: string) => {
    if (zone === 'signals' && cardId) {
      setDroppedSignals(prev => prev.filter(s => s.id !== cardId));
    } else if (zone === 'pattern') {
      setDroppedPattern(null);
    } else if (zone === 'strategy') {
      setDroppedStrategy(null);
    }
    sound('switch');
  };

  // Progress from Eyes to Brain
  const confirmSignals = () => {
    if (droppedSignals.length > 0) {
      setActiveTeam('brain');
      sound('success');
    }
  };

  // Submit the logic chain
  const handleSubmitChain = (timedOut: boolean = false) => {
    setIsTimerRunning(false);
    
    if (!currentScenario) return;
    
    const correct = currentScenario.correctChain;
    
    // Check signals (all correct signals must be present)
    const signalIds = droppedSignals.map(s => s.id);
    const correctSignals = correct.signals.every(id => signalIds.includes(id));
    const noExtraSignals = signalIds.every(id => correct.signals.includes(id));
    const signalsCorrect = correctSignals && noExtraSignals;
    
    // Check pattern
    const patternCorrect = droppedPattern?.id === correct.pattern;
    
    // Check strategy  
    const strategyCorrect = droppedStrategy?.id === correct.strategy;
    
    // Calculate score
    let points = 0;
    let message = '';
    
    if (timedOut) {
      message = '⏰ Time\'s up! Let\'s see what you had...';
    }
    
    if (signalsCorrect && patternCorrect && strategyCorrect) {
      points = currentScenario.points;
      const timeBonus = Math.floor(timer * 2);
      points += timeBonus;
      message = `🎉 PERFECT! All teams worked together brilliantly! +${timeBonus} time bonus!`;
      sound('success');
      
      // Update team scores
      setTeams(prev => prev.map(t => ({
        ...t,
        score: t.score + Math.floor(points / 3),
        streakBonus: t.streakBonus + 1
      })));
      
      setRoundsWon(prev => prev + 1);
    } else if ((signalsCorrect && patternCorrect) || (patternCorrect && strategyCorrect) || (signalsCorrect && strategyCorrect)) {
      points = Math.floor(currentScenario.points * 0.5);
      message = '😊 Good teamwork! Part of the chain was correct.';
      sound('reveal');
      
      // Partial team scores
      if (signalsCorrect) setTeams(prev => prev.map(t => t.role === 'eyes' ? { ...t, score: t.score + Math.floor(points / 2) } : t));
      if (patternCorrect) setTeams(prev => prev.map(t => t.role === 'brain' ? { ...t, score: t.score + Math.floor(points / 2) } : t));
      if (strategyCorrect) setTeams(prev => prev.map(t => t.role === 'feet' ? { ...t, score: t.score + Math.floor(points / 2) } : t));
    } else if (signalsCorrect || patternCorrect || strategyCorrect) {
      points = Math.floor(currentScenario.points * 0.25);
      message = '🤔 One part was right! Study the correct answer.';
      sound('danger');
    } else {
      points = 0;
      message = '😅 The lion wins this round! Let\'s learn from the correct answer.';
      sound('danger');
      
      // Reset streaks
      setTeams(prev => prev.map(t => ({ ...t, streakBonus: 0 })));
    }
    
    setTotalScore(prev => prev + points);
    setFeedbackResult({ correct: signalsCorrect && patternCorrect && strategyCorrect, message, points });
    setPhase('feedback');
  };

  // Show correct answer
  const revealCorrectAnswer = () => {
    setShowCorrectAnswer(true);
  };

  // Go to next scenario
  const nextScenario = () => {
    const nextIndex = currentScenarioIndex + 1;
    const levelScenarios = LOGIC_CHAIN_SCENARIOS.filter(s => s.level === currentLevel);
    
    if (nextIndex >= levelScenarios.length) {
      // Level complete
      setPhase('levelComplete');
    } else {
      setCurrentScenarioIndex(nextIndex);
      startRound();
    }
  };

  // Go to next level
  const nextLevel = () => {
    if (currentLevel < 5) {
      setCurrentLevel(prev => prev + 1);
      setCurrentScenarioIndex(0);
      startRound();
    } else {
      setPhase('gameOver');
    }
  };

  // Reset game
  const resetGame = () => {
    setCurrentLevel(1);
    setCurrentScenarioIndex(0);
    setTeams(JSON.parse(JSON.stringify(LOGIC_CHAIN_TEAMS)));
    setTotalScore(0);
    setRoundsWon(0);
    setPhase('intro');
  };

  // Draggable card component
  const DraggableCard = ({ card, disabled }: { card: LogicCard; disabled?: boolean }) => {
    const isUsed = card.type === 'signal' 
      ? droppedSignals.some(s => s.id === card.id)
      : card.type === 'pattern' 
        ? droppedPattern?.id === card.id
        : droppedStrategy?.id === card.id;
    
    return (
      <div
        draggable={!disabled && !isUsed}
        onDragStart={() => !disabled && !isUsed && handleDragStart(card)}
        onDragEnd={handleDragEnd}
        className={`
          p-3 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all
          ${isUsed ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
          ${card.type === 'signal' ? 'bg-blue-100 border-blue-300' : ''}
          ${card.type === 'pattern' ? 'bg-purple-100 border-purple-300' : ''}
          ${card.type === 'strategy' ? 'bg-green-100 border-green-300' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{card.emoji}</span>
          <div>
            <div className="font-semibold text-sm text-gray-800">{card.text}</div>
            {card.category && <div className="text-xs text-gray-500 opacity-70">{card.category}</div>}
          </div>
        </div>
      </div>
    );
  };

  // Drop zone component
  const DropZone = ({ 
    zone, 
    title, 
    icon, 
    color, 
    cards, 
    acceptType,
    isActive 
  }: { 
    zone: 'signals' | 'pattern' | 'strategy';
    title: string;
    icon: React.ReactNode;
    color: string;
    cards: LogicCard | LogicCard[] | null;
    acceptType: 'signal' | 'pattern' | 'strategy';
    isActive: boolean;
  }) => {
    const [isOver, setIsOver] = useState(false);
    
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (draggingCard?.type === acceptType && isActive) {
        setIsOver(true);
      }
    };
    
    const handleDragLeave = () => setIsOver(false);
    
    const handleDropEvent = (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      if (draggingCard && draggingCard.type === acceptType && isActive) {
        handleDrop(zone, draggingCard);
      }
    };
    
    const cardArray = Array.isArray(cards) ? cards : cards ? [cards] : [];
    
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
        className={`
          min-h-[120px] rounded-2xl border-3 border-dashed p-4 transition-all
          ${isOver ? 'scale-105 border-solid' : ''}
          ${isActive ? `border-${color}-400 bg-${color}-50` : 'border-gray-300 bg-gray-50 opacity-60'}
          ${color === 'blue' ? (isOver ? 'bg-blue-100 border-blue-500' : isActive ? 'border-blue-400 bg-blue-50' : '') : ''}
          ${color === 'purple' ? (isOver ? 'bg-purple-100 border-purple-500' : isActive ? 'border-purple-400 bg-purple-50' : '') : ''}
          ${color === 'green' ? (isOver ? 'bg-green-100 border-green-500' : isActive ? 'border-green-400 bg-green-50' : '') : ''}
        `}
      >
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className={`font-bold text-${color}-700`}>{title}</span>
          {isActive && <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">ACTIVE</span>}
        </div>
        
        {cardArray.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {cardArray.map(card => (
              <div 
                key={card.id}
                className={`p-2 rounded-lg flex items-center gap-2 cursor-pointer hover:opacity-70
                  ${card.type === 'signal' ? 'bg-blue-200' : ''}
                  ${card.type === 'pattern' ? 'bg-purple-200' : ''}
                  ${card.type === 'strategy' ? 'bg-green-200' : ''}
                `}
                onClick={() => removeFromZone(zone, card.id)}
                title="Click to remove"
              >
                <span className="text-xl">{card.emoji}</span>
                <span className="text-sm font-medium">{card.text}</span>
                <span className="text-xs text-red-500">✕</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-4">
            <GripVertical className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Drag {acceptType} cards here</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Sound Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 z-50 bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>

      {/* INTRO PHASE */}
      {phase === 'intro' && (
        <div className="min-h-screen overflow-y-auto py-8 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-7xl mb-6">🔷⚔️🔶⚔️🟣</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              LOGIC CHAIN ARENA
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-cyan-200">
              IF → THEN → DO
            </h2>
            <p className="text-lg text-gray-300 mb-6">3 Intelligent Systems Compete to Build the Best Logic Chains</p>
            
            {/* Video Embed */}
            <div className="mb-8 bg-black/40 rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-3 text-cyan-200">📺 Watch the Story First</h3>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/akeNoLLitcc"
                  title="The Hare and The Lion"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>

            {/* Three Competing Systems */}
            <div className="bg-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4">🤖 3 Competing Intelligent Systems</h3>
              <p className="text-gray-300 mb-4">Each system has its own Eyes, Brain & Feet — working together to outsmart the lion!</p>
              <div className="grid md:grid-cols-3 gap-4">
                {INTELLIGENT_SYSTEMS.map(sys => (
                  <div key={sys.id} className={`${sys.bgColor} rounded-xl p-4 border-2 ${sys.borderColor}`}>
                    <div className="text-4xl mb-2">{sys.emoji}</div>
                    <h4 className="text-xl font-bold">{sys.name}</h4>
                    <div className="flex justify-center gap-2 mt-2">
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">👁️ Eyes</span>
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">🧠 Brain</span>
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">🦶 Feet</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How Each System Works */}
            <div className="bg-white/10 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-2xl font-bold mb-4 text-center">🎮 How Each System Thinks</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-6 h-6 text-blue-400" />
                    <h4 className="font-bold">1. EYES Observe (IF)</h4>
                  </div>
                  <p className="text-sm text-gray-300">Pick SIGNALS from the story. What does the system see or hear?</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-6 h-6 text-purple-400" />
                    <h4 className="font-bold">2. BRAIN Interprets (THEN)</h4>
                  </div>
                  <p className="text-sm text-gray-300">Pick a PATTERN. What do those signals mean together?</p>
                </div>
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Footprints className="w-6 h-6 text-green-400" />
                    <h4 className="font-bold">3. FEET Act (DO)</h4>
                  </div>
                  <p className="text-sm text-gray-300">Pick a STRATEGY. What should the hare do next?</p>
                </div>
              </div>
            </div>

            {/* Master Signal Bank from the Story */}
            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-2xl p-6 mb-8 text-left border border-amber-500/30">
              <h3 className="text-2xl font-bold mb-4 text-center text-amber-300">📚 Signal Bank from the Story</h3>
              <p className="text-center text-gray-300 mb-4">All signals that can be observed in "The Hare and The Lion"</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Lion Body Language */}
                <div className="bg-red-900/30 rounded-xl p-3 border border-red-500/20">
                  <h4 className="font-bold text-red-300 mb-2">🦁 Lion Body Language</h4>
                  <div className="space-y-1 text-sm">
                    {STORY_SIGNAL_BANK.filter(s => s.category === 'Lion Body').map(sig => (
                      <div key={sig.id} className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded">
                        <span>{sig.emoji}</span>
                        <span className="text-gray-200">{sig.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Lion Sounds */}
                <div className="bg-orange-900/30 rounded-xl p-3 border border-orange-500/20">
                  <h4 className="font-bold text-orange-300 mb-2">🔊 Lion Sounds</h4>
                  <div className="space-y-1 text-sm">
                    {STORY_SIGNAL_BANK.filter(s => s.category === 'Lion Sounds').map(sig => (
                      <div key={sig.id} className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded">
                        <span>{sig.emoji}</span>
                        <span className="text-gray-200">{sig.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Lion Mind */}
                <div className="bg-yellow-900/30 rounded-xl p-3 border border-yellow-500/20">
                  <h4 className="font-bold text-yellow-300 mb-2">🧠 Lion Mind</h4>
                  <div className="space-y-1 text-sm">
                    {STORY_SIGNAL_BANK.filter(s => s.category === 'Lion Mind').map(sig => (
                      <div key={sig.id} className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded">
                        <span>{sig.emoji}</span>
                        <span className="text-gray-200">{sig.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Well */}
                <div className="bg-blue-900/30 rounded-xl p-3 border border-blue-500/20">
                  <h4 className="font-bold text-blue-300 mb-2">💧 The Well</h4>
                  <div className="space-y-1 text-sm">
                    {STORY_SIGNAL_BANK.filter(s => s.category === 'Well').map(sig => (
                      <div key={sig.id} className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded">
                        <span>{sig.emoji}</span>
                        <span className="text-gray-200">{sig.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Weather & Location */}
                <div className="bg-cyan-900/30 rounded-xl p-3 border border-cyan-500/20">
                  <h4 className="font-bold text-cyan-300 mb-2">🌍 Environment</h4>
                  <div className="space-y-1 text-sm">
                    {STORY_SIGNAL_BANK.filter(s => s.category === 'Weather' || s.category === 'Location').map(sig => (
                      <div key={sig.id} className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded">
                        <span>{sig.emoji}</span>
                        <span className="text-gray-200">{sig.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Story & Others */}
                <div className="bg-purple-900/30 rounded-xl p-3 border border-purple-500/20">
                  <h4 className="font-bold text-purple-300 mb-2">🐰 Story Events</h4>
                  <div className="space-y-1 text-sm">
                    {STORY_SIGNAL_BANK.filter(s => s.category === 'Story' || s.category === 'Others').map(sig => (
                      <div key={sig.id} className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded">
                        <span>{sig.emoji}</span>
                        <span className="text-gray-200">{sig.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Level Progress */}
            <div className="bg-white/10 rounded-2xl p-4 mb-8">
              <p className="font-bold text-yellow-300 mb-2">🏆 Complete all 5 levels to become a Logic Master!</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(l => (
                  <div key={l} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    L{l}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => { setPhase('tutorial'); sound('powerup'); }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xl px-8 py-6"
              >
                <Play className="w-6 h-6 mr-2" /> Start Competition
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-xl px-8 py-6"
              >
                <ChevronLeft className="w-6 h-6 mr-2" /> Back
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TUTORIAL PHASE */}
      {phase === 'tutorial' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-3xl bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-3xl font-bold mb-6">Level {currentLevel} - {['Single Signal', 'Multiple Signals', 'Conflicting Signals', 'Environmental Complexity', 'Surprise Events'][currentLevel - 1]}</h2>
            
            <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-bold mb-2 text-cyan-300">Level {currentLevel} Challenge:</h3>
              <p className="text-gray-200">
                {currentLevel === 1 && 'Learn to identify ONE key signal and build a simple logic chain.'}
                {currentLevel === 2 && 'Combine MULTIPLE signals to understand the full picture.'}
                {currentLevel === 3 && 'Handle CONFLICTING signals - some may mislead you!'}
                {currentLevel === 4 && 'Consider the ENVIRONMENT - weather, location, audience matter!'}
                {currentLevel === 5 && 'Expect SURPRISE twists! The lion may have learned from past tricks!'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {teams.map(team => (
                <div key={team.role} className={`${team.bgColor} rounded-xl p-4`}>
                  <div className="text-3xl mb-1">{team.emoji}</div>
                  <div className="font-bold">{team.name}</div>
                  <div className="text-sm opacity-80">Score: {team.score}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={startRound}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xl px-8 py-4"
            >
              <Play className="w-5 h-5 mr-2" /> Begin Round
            </Button>
          </div>
        </div>
      )}

      {/* PLAYING PHASE */}
      {phase === 'playing' && currentScenario && (
        <div className="min-h-screen p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl px-4 py-2">
                <span className="text-sm text-cyan-300">Level</span>
                <div className="text-2xl font-bold">{currentLevel}</div>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-2">
                <span className="text-sm text-cyan-300">Score</span>
                <div className="text-2xl font-bold">{totalScore}</div>
              </div>
            </div>
            
            <div className={`bg-white/20 rounded-xl px-6 py-2 ${timer <= 10 ? 'animate-pulse bg-red-500/50' : ''}`}>
              <span className="text-sm text-cyan-300">Time</span>
              <div className="text-3xl font-bold">{timer}s</div>
            </div>
            
            <div className="flex gap-2">
              {teams.map(team => (
                <div 
                  key={team.role}
                  className={`${team.bgColor} rounded-lg px-3 py-1 ${activeTeam === team.role ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-blue-900' : 'opacity-60'}`}
                >
                  <span className="text-lg">{team.emoji}</span>
                  <span className="ml-1 font-bold">{team.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario Card */}
          <div className="bg-gradient-to-r from-amber-600/80 to-orange-600/80 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🦁</div>
              <div>
                <h3 className="text-xl font-bold">{currentScenario.title}</h3>
                <p className="text-amber-100">{currentScenario.story}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="bg-black/20 px-2 py-1 rounded">🎭 Lion: {currentScenario.lionState}</span>
                  <span className="bg-black/20 px-2 py-1 rounded">📍 {currentScenario.environment}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left: Available Cards - Organized by Category */}
            <div className="bg-white/10 rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <GripVertical className="w-5 h-5" /> Available Cards
                <span className="text-xs bg-cyan-500 px-2 py-0.5 rounded-full">DRAG ME!</span>
              </h3>
              
              {/* Signal Cards - Grouped by Category */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">Signals (IF)</span>
                  {activeTeam === 'eyes' && <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full animate-pulse">Your turn!</span>}
                </div>
                {/* Group signals by category */}
                {(() => {
                  const signalsByCategory = currentScenario.availableCards.signals.reduce((acc, card) => {
                    const cat = card.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(card);
                    return acc;
                  }, {} as Record<string, typeof currentScenario.availableCards.signals>);
                  
                  return Object.entries(signalsByCategory).map(([category, cards]) => (
                    <div key={category} className="mb-2">
                      <div className="text-xs text-blue-200/70 mb-1 uppercase tracking-wide">{category}</div>
                      <div className="flex flex-wrap gap-2">
                        {cards.map(card => (
                          <DraggableCard key={card.id} card={card} disabled={activeTeam !== 'eyes'} />
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
              
              {/* Pattern Cards - Grouped by Category */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-300">Patterns (THEN)</span>
                  {activeTeam === 'brain' && <span className="text-xs bg-purple-500 px-2 py-0.5 rounded-full animate-pulse">Your turn!</span>}
                </div>
                {/* Group patterns by category */}
                {(() => {
                  const patternsByCategory = currentScenario.availableCards.patterns.reduce((acc, card) => {
                    const cat = card.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(card);
                    return acc;
                  }, {} as Record<string, typeof currentScenario.availableCards.patterns>);
                  
                  return Object.entries(patternsByCategory).map(([category, cards]) => (
                    <div key={category} className="mb-2">
                      <div className="text-xs text-purple-200/70 mb-1 uppercase tracking-wide">{category}</div>
                      <div className="flex flex-wrap gap-2">
                        {cards.map(card => (
                          <DraggableCard key={card.id} card={card} disabled={activeTeam !== 'brain'} />
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
              
              {/* Strategy Cards - Grouped by Category */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Footprints className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-300">Strategies (DO)</span>
                  {activeTeam === 'feet' && <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full animate-pulse">Your turn!</span>}
                </div>
                {/* Group strategies by category */}
                {(() => {
                  const strategiesByCategory = currentScenario.availableCards.strategies.reduce((acc, card) => {
                    const cat = card.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(card);
                    return acc;
                  }, {} as Record<string, typeof currentScenario.availableCards.strategies>);
                  
                  return Object.entries(strategiesByCategory).map(([category, cards]) => (
                    <div key={category} className="mb-2">
                      <div className="text-xs text-green-200/70 mb-1 uppercase tracking-wide">{category}</div>
                      <div className="flex flex-wrap gap-2">
                        {cards.map(card => (
                          <DraggableCard key={card.id} card={card} disabled={activeTeam !== 'feet'} />
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Right: Drop Zones */}
            <div className="space-y-4">
              {/* IF Zone - Signals */}
              <DropZone
                zone="signals"
                title="IF (Signals)"
                icon={<Eye className="w-5 h-5 text-blue-500" />}
                color="blue"
                cards={droppedSignals}
                acceptType="signal"
                isActive={activeTeam === 'eyes'}
              />
              
              {activeTeam === 'eyes' && droppedSignals.length > 0 && (
                <Button onClick={confirmSignals} className="w-full bg-blue-600 hover:bg-blue-700">
                  ✓ Confirm Signals → Pass to Brain Team
                </Button>
              )}
              
              {/* THEN Zone - Pattern */}
              <DropZone
                zone="pattern"
                title="THEN (Pattern)"
                icon={<Brain className="w-5 h-5 text-purple-500" />}
                color="purple"
                cards={droppedPattern}
                acceptType="pattern"
                isActive={activeTeam === 'brain'}
              />
              
              {/* DO Zone - Strategy */}
              <DropZone
                zone="strategy"
                title="DO (Strategy)"
                icon={<Footprints className="w-5 h-5 text-green-500" />}
                color="green"
                cards={droppedStrategy}
                acceptType="strategy"
                isActive={activeTeam === 'feet'}
              />
              
              {/* Submit Button */}
              {droppedSignals.length > 0 && droppedPattern && droppedStrategy && (
                <Button 
                  onClick={() => handleSubmitChain(false)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-xl py-6"
                >
                  <Trophy className="w-6 h-6 mr-2" /> Submit Logic Chain!
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK PHASE */}
      {phase === 'feedback' && feedbackResult && currentScenario && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
            <div className="text-7xl mb-4">{feedbackResult.correct ? '🎉' : '🤔'}</div>
            <h2 className={`text-3xl font-bold mb-4 ${feedbackResult.correct ? 'text-green-400' : 'text-yellow-400'}`}>
              {feedbackResult.correct ? 'PERFECT CHAIN!' : 'Nice Try!'}
            </h2>
            <p className="text-xl mb-4">{feedbackResult.message}</p>
            <div className="text-4xl font-bold text-yellow-400 mb-6">+{feedbackResult.points} points</div>
            
            {/* Your Chain */}
            <div className="bg-black/20 rounded-xl p-4 mb-4 text-left">
              <h4 className="font-bold mb-2">Your Chain:</h4>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-blue-400">IF:</span>
                {droppedSignals.map(s => <span key={s.id} className="bg-blue-500/30 px-2 py-1 rounded">{s.emoji} {s.text}</span>)}
                <span className="text-purple-400">→ THEN:</span>
                {droppedPattern && <span className="bg-purple-500/30 px-2 py-1 rounded">{droppedPattern.emoji} {droppedPattern.text}</span>}
                <span className="text-green-400">→ DO:</span>
                {droppedStrategy && <span className="bg-green-500/30 px-2 py-1 rounded">{droppedStrategy.emoji} {droppedStrategy.text}</span>}
              </div>
            </div>
            
            {!feedbackResult.correct && !showCorrectAnswer && (
              <Button onClick={revealCorrectAnswer} className="mb-4 bg-purple-600 hover:bg-purple-700">
                Show Correct Answer
              </Button>
            )}
            
            {showCorrectAnswer && (
              <div className="bg-green-500/20 rounded-xl p-4 mb-4 text-left border border-green-400">
                <h4 className="font-bold mb-2 text-green-400">✓ Correct Chain:</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-blue-400">IF:</span>
                  {currentScenario.correctChain.signals.map(id => {
                    const card = currentScenario.availableCards.signals.find(c => c.id === id);
                    return card && <span key={id} className="bg-blue-500/30 px-2 py-1 rounded">{card.emoji} {card.text}</span>;
                  })}
                  <span className="text-purple-400">→ THEN:</span>
                  {(() => {
                    const card = currentScenario.availableCards.patterns.find(c => c.id === currentScenario.correctChain.pattern);
                    return card && <span className="bg-purple-500/30 px-2 py-1 rounded">{card.emoji} {card.text}</span>;
                  })()}
                  <span className="text-green-400">→ DO:</span>
                  {(() => {
                    const card = currentScenario.availableCards.strategies.find(c => c.id === currentScenario.correctChain.strategy);
                    return card && <span className="bg-green-500/30 px-2 py-1 rounded">{card.emoji} {card.text}</span>;
                  })()}
                </div>
              </div>
            )}

            <Button
              onClick={nextScenario}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xl px-8 py-4"
            >
              <ArrowRight className="w-5 h-5 mr-2" /> Next Challenge
            </Button>
          </div>
        </div>
      )}

      {/* LEVEL COMPLETE PHASE */}
      {phase === 'levelComplete' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">Level {currentLevel} Complete!</h2>
            <p className="text-xl mb-6">
              {currentLevel < 5 
                ? `Great job! Ready for Level ${currentLevel + 1}?`
                : 'You\'ve completed ALL levels! You\'re a Logic Master!'
              }
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {teams.map(team => (
                <div key={team.role} className={`${team.bgColor} rounded-xl p-4`}>
                  <div className="text-3xl mb-1">{team.emoji}</div>
                  <div className="font-bold">{team.name}</div>
                  <div className="text-2xl font-bold">{team.score}</div>
                </div>
              ))}
            </div>
            
            <div className="text-3xl font-bold mb-6">
              Total Score: <span className="text-yellow-400">{totalScore}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentLevel < 5 ? (
                <Button
                  onClick={nextLevel}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xl px-8 py-4"
                >
                  <Zap className="w-5 h-5 mr-2" /> Level {currentLevel + 1}
                </Button>
              ) : (
                <Button
                  onClick={() => setPhase('gameOver')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-xl px-8 py-4"
                >
                  <Trophy className="w-5 h-5 mr-2" /> See Final Results
                </Button>
              )}
              <Button
                onClick={onBack}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Exit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER PHASE */}
      {phase === 'gameOver' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-3xl bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
            <div className="text-8xl mb-4">🎊</div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              LOGIC MASTER!
            </h2>
            <p className="text-xl mb-8 text-cyan-200">
              You\'ve mastered the art of IF → THEN → DO thinking!
            </p>
            
            {/* Final Scoreboard */}
            <div className="bg-black/30 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4">Final Scoreboard</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {teams.sort((a, b) => b.score - a.score).map((team, idx) => (
                  <div key={team.role} className={`${team.bgColor} rounded-xl p-4 ${idx === 0 ? 'ring-4 ring-yellow-400' : ''}`}>
                    {idx === 0 && <div className="text-2xl mb-1">👑</div>}
                    <div className="text-3xl mb-1">{team.emoji}</div>
                    <div className="font-bold">{team.name}</div>
                    <div className="text-3xl font-bold">{team.score}</div>
                    {idx === 0 && <div className="text-sm text-yellow-300">WINNER!</div>}
                  </div>
                ))}
              </div>
              
              <div className="text-4xl font-bold text-yellow-400">
                Total Score: {totalScore}
              </div>
              <div className="text-lg text-cyan-300 mt-2">
                Rounds Won: {roundsWon} | Levels Completed: {currentLevel}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xl px-8 py-4"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Play Again
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-xl px-8 py-4"
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Back to Games
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}