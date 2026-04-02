
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Star, TrendingUp, Award } from 'lucide-react';

interface XPNotification {
  xp: number;
  reason: string;
  leveledUp?: boolean;
  stagedUp?: boolean;
  newLevel?: number;
  newStage?: string;
}

export function showXPNotification(data: XPNotification) {
  if (data.stagedUp) {
    toast.custom((t) => (
      <div 
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
      >
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-shrink-0">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">
              Stage Up! 🎉
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              You are now a {data.newStage}!
            </p>
          </div>
        </div>
      </div>
    ), { duration: 5000 });
  } else if (data.leveledUp) {
    toast.custom((t) => (
      <div 
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
      >
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">
              Level Up! 🎊
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              You reached Level {data.newLevel}
            </p>
          </div>
        </div>
      </div>
    ), { duration: 4000 });
  } else {
    toast.custom((t) => (
      <div 
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center p-4 border-l-4 border-blue-600`}
      >
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-shrink-0">
            <Star className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              +{data.xp} XP
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {data.reason}
            </p>
          </div>
        </div>
      </div>
    ), { duration: 3000 });
  }
}

// Hook to automatically award XP on certain actions
export function useGamification() {
  const awardXP = async (xp: number, reason: string) => {
    try {
      const response = await fetch('/api/gamification/add-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp, reason })
      });

      if (response.ok) {
        const data = await response.json();
        showXPNotification({
          xp: data.xpAdded,
          reason: data.reason,
          leveledUp: data.leveledUp,
          stagedUp: data.stagedUp,
          newLevel: data.newLevel,
          newStage: data.newStage
        });
        return data;
      }
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  const awardBadge = async (badgeId: string) => {
    try {
      const response = await fetch('/api/gamification/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Badge earned: ${data.userBadge.badge.name}! 🏆`, {
          duration: 4000,
          icon: '🏆'
        });
        return data;
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  const updateSkillProgress = async (skillId: string, xpToAdd: number) => {
    try {
      const response = await fetch('/api/gamification/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, xpToAdd })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.mastered) {
          toast.success(`Skill Mastered: ${data.progress.skill.name}! 🌟`, {
            duration: 4000,
            icon: '🌟'
          });
        }
        return data;
      }
    } catch (error) {
      console.error('Error updating skill progress:', error);
    }
  };

  return {
    awardXP,
    awardBadge,
    updateSkillProgress
  };
}
