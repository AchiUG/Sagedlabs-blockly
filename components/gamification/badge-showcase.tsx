
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as Icons from 'lucide-react';
import { RARITY_COLORS } from '@/lib/gamification';

interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  xpReward: number;
  rarity: string;
  earned: boolean;
  earnedAt: string | null;
  progress: number;
}

export function BadgeShowcase() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await fetch('/api/gamification/badges');
        if (response.ok) {
          const data = await response.json();
          setBadges(data.badges);
        }
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categories = ['ALL', 'COMPLETION', 'MASTERY', 'COMMUNITY', 'STREAK', 'MILESTONE', 'CAPSTONE', 'SPECIAL'];
  const filteredBadges = filter === 'ALL' 
    ? badges 
    : badges.filter(b => b.category === filter);

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Badge Collection</h3>
          <p className="text-sm text-gray-500">
            {earnedCount} of {badges.length} badges earned
          </p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="text-xs">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBadges.map((badge) => {
              const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;
              const rarityColor = RARITY_COLORS[badge.rarity as keyof typeof RARITY_COLORS] || '#9CA3AF';

              return (
                <Card 
                  key={badge.id} 
                  className={`relative overflow-hidden transition-all ${
                    badge.earned 
                      ? 'border-2 shadow-md hover:shadow-lg' 
                      : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-80'
                  }`}
                  style={{ 
                    borderColor: badge.earned ? rarityColor : 'transparent'
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div 
                        className="p-3 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: badge.earned ? `${rarityColor}20` : '#F3F4F6',
                          color: badge.earned ? rarityColor : '#9CA3AF'
                        }}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <BadgeUI 
                        variant={badge.earned ? "default" : "outline"}
                        className="text-xs"
                        style={{
                          backgroundColor: badge.earned ? rarityColor : 'transparent',
                          borderColor: rarityColor,
                          color: badge.earned ? 'white' : rarityColor
                        }}
                      >
                        {badge.rarity}
                      </BadgeUI>
                    </div>
                    <CardTitle className="text-base mt-3">{badge.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {badge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">+{badge.xpReward} XP</span>
                      {badge.earned && badge.earnedAt && (
                        <span className="text-green-600 font-medium">✓ Earned</span>
                      )}
                      {!badge.earned && badge.progress > 0 && (
                        <span className="text-blue-600">{badge.progress}%</span>
                      )}
                    </div>
                  </CardContent>
                  
                  {badge.earned && (
                    <div 
                      className="absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rounded-full opacity-10"
                      style={{ backgroundColor: rarityColor }}
                    />
                  )}
                </Card>
              );
            })}
          </div>

          {filteredBadges.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No badges in this category yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
