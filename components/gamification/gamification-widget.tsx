
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Star, Zap, Target, ArrowRight,
  Search, BookOpen, Users, BookMarked, Building, Shield, Crown
} from 'lucide-react';

const StageIcon = ({ stage }: { stage: number }) => {
  const iconProps = { className: 'w-5 h-5' };
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

export function GamificationWidget() {
  const [data, setData] = useState<any>(null);
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

  if (loading || !data) {
    return null;
  }

  const { gamification, stage, xpProgress, badges } = data;

  return (
    <Card className="saged-card border-2" style={{ borderColor: stage.color }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: stage.color }} />
            Your Learning Journey
          </CardTitle>
          <Link href="/gamification">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stage Progress */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: `${stage.color}10` }}>
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="p-2 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: stage.color, color: 'white' }}
            >
              <StageIcon stage={stage.stage} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">Stage {stage.stage}: {stage.title}</h4>
                <Badge variant="secondary" className="text-xs">
                  {stage.subtitle}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {stage.description.slice(0, 80)}...
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{gamification.totalXP}</p>
            <p className="text-xs text-gray-500">Total XP</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mx-auto mb-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">Lvl {gamification.currentLevel}</p>
            <p className="text-xs text-gray-500">Level</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mx-auto mb-2">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{gamification.streakDays}</p>
            <p className="text-xs text-gray-500">Day Streak</p>
          </div>
        </div>

        {/* Level Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Level Progress</span>
            <span className="text-gray-500">
              {xpProgress.current} / {xpProgress.required} XP
            </span>
          </div>
          <Progress value={xpProgress.percentage} className="h-2" />
        </div>

        {/* Recent Badges */}
        {badges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Badges</h4>
            <div className="flex gap-2 flex-wrap">
              {badges.slice(0, 4).map((userBadge: any) => (
                <Badge 
                  key={userBadge.id} 
                  variant="outline"
                  className="text-xs"
                >
                  {userBadge.badge.name}
                </Badge>
              ))}
              {badges.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{badges.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link href="/gamification">
          <Button className="w-full" variant="outline">
            View Full Journey <Target className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
