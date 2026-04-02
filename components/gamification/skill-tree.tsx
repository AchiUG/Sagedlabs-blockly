
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { Lock, CheckCircle2 } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  parentSkillId: string | null;
  requiredXP: number;
  orderIndex: number;
  userProgress: {
    xpEarned: number;
    isUnlocked: boolean;
    isMastered: boolean;
    lastPracticed: string | null;
  };
}

export function SkillTree() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/gamification/skills');
        if (response.ok) {
          const data = await response.json();
          setSkills(data.skills);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categories = ['ALL', ...Array.from(new Set(skills.map(s => s.category)))];
  const filteredSkills = selectedCategory === 'ALL' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  const masteredCount = skills.filter(s => s.userProgress.isMastered).length;
  const unlockedCount = skills.filter(s => s.userProgress.isUnlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Skill Tree</h3>
          <p className="text-sm text-gray-500">
            {masteredCount} mastered • {unlockedCount} unlocked • {skills.length} total
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((skill) => {
          const IconComponent = (Icons as any)[skill.iconName] || Icons.Target;
          const progress = Math.min((skill.userProgress.xpEarned / skill.requiredXP) * 100, 100);
          const isUnlocked = skill.userProgress.isUnlocked;
          const isMastered = skill.userProgress.isMastered;

          return (
            <Card 
              key={skill.id}
              className={`relative transition-all ${
                isUnlocked 
                  ? isMastered 
                    ? 'border-2 border-green-500 shadow-md' 
                    : 'hover:shadow-md'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div 
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      isUnlocked 
                        ? isMastered 
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isUnlocked ? (
                      <IconComponent className="w-8 h-8" />
                    ) : (
                      <Lock className="w-8 h-8" />
                    )}
                  </div>
                  {isMastered && (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Mastered
                    </Badge>
                  )}
                  {!isUnlocked && (
                    <Badge variant="secondary">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base mt-3">{skill.name}</CardTitle>
                <CardDescription className="text-xs">
                  {skill.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {isUnlocked && (
                  <>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{skill.userProgress.xpEarned} / {skill.requiredXP} XP</span>
                      <span>{Math.floor(progress)}%</span>
                    </div>
                  </>
                )}
                {!isUnlocked && (
                  <p className="text-xs text-gray-500">
                    Complete prerequisite skills to unlock
                  </p>
                )}
              </CardContent>

              {isMastered && (
                <div className="absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rounded-full bg-green-500 opacity-10" />
              )}
            </Card>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No skills in this category yet.</p>
        </div>
      )}
    </div>
  );
}
