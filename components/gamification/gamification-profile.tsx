
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Star, Zap, Target, Award, TrendingUp,
  Search, BookOpen, Users, BookMarked, Building, Shield, Crown
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { STAGES } from '@/lib/gamification';
import { BadgeShowcase } from './badge-showcase';
import { SkillTree } from './skill-tree';
import { StageProgress } from './stage-progress';

interface GamificationData {
  gamification: {
    totalXP: number;
    currentLevel: number;
    currentStage: number;
    stageTitle: string;
    streakDays: number;
  };
  stage: {
    stage: number;
    title: string;
    description: string;
    requiredXP: number;
    color: string;
  };
  level: number;
  xpProgress: {
    current: number;
    required: number;
    percentage: number;
  };
  badges: Array<{
    id: string;
    badge: {
      name: string;
      iconName: string;
      rarity: string;
    };
    earnedAt: string;
  }>;
  skills: Array<{
    id: string;
    skill: {
      name: string;
      iconName: string;
    };
    xpEarned: number;
    isMastered: boolean;
  }>;
}

const StageIcon = ({ stage }: { stage: number }) => {
  const iconProps = { className: 'w-6 h-6' };
  switch (stage) {
    case 1: return <Search {...iconProps} />;
    case 2: return <BookOpen {...iconProps} />;
    case 3: return <Users {...iconProps} />;
    case 4: return <BookMarked {...iconProps} />;
    case 5: return <Building {...iconProps} />;
    case 6: return <Shield {...iconProps} />;
    case 7: return <Crown {...iconProps} />;
    default: return <Search {...iconProps} />;
  }
};

export function GamificationProfile() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gamification/profile');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load gamification data</p>
      </div>
    );
  }

  const { gamification, stage, xpProgress, badges, skills } = data;
  const nextStage = STAGES[stage.stage] || null;

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex justify-end">
        <Link href="/certificates">
          <Button variant="outline" size="sm">
            <Award className="h-4 w-4 mr-2" />
            View My Certificates
          </Button>
        </Link>
      </div>

      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Stage</CardTitle>
            <StageIcon stage={stage.stage} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: stage.color }}>
              {stage.title}
            </div>
            <p className="text-xs text-gray-500 mt-1">{stage.description.slice(0, 60)}...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {gamification.currentLevel}</div>
            <Progress value={xpProgress.percentage} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">
              {xpProgress.current} / {xpProgress.required} XP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamification.totalXP.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Experience Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamification.streakDays} days</div>
            <p className="text-xs text-gray-500 mt-1">Keep learning daily!</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <StageProgress currentStage={stage.stage} totalXP={gamification.totalXP} />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No badges earned yet. Keep learning to earn your first badge!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {badges.slice(0, 6).map((userBadge) => (
                      <BadgeUI 
                        key={userBadge.id} 
                        variant="outline"
                        className="text-xs"
                      >
                        {userBadge.badge.name}
                      </BadgeUI>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {skills.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Start learning to develop your skills!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {skills.slice(0, 4).map((progress) => (
                      <div key={progress.id}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium">{progress.skill.name}</span>
                          {progress.isMastered && (
                            <BadgeUI variant="secondary" className="text-xs">
                              Mastered
                            </BadgeUI>
                          )}
                        </div>
                        <Progress value={Math.min((progress.xpEarned / 500) * 100, 100)} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="mt-4">
          <BadgeShowcase />
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <SkillTree />
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Learning Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StageProgress currentStage={stage.stage} totalXP={gamification.totalXP} detailed />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
