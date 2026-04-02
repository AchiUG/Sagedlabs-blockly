
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { STAGES } from '@/lib/gamification';
import { 
  Search, BookOpen, Users, BookMarked, Building, Shield, Crown, 
  Check, Lock 
} from 'lucide-react';

interface StageProgressProps {
  currentStage: number;
  totalXP: number;
  detailed?: boolean;
}

const StageIcon = ({ stage, size = 'md' }: { stage: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  const iconProps = { className: sizeClass };
  
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

export function StageProgress({ currentStage, totalXP, detailed = false }: StageProgressProps) {
  if (detailed) {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-lg mb-4">Stage Progression</h4>
        {STAGES.map((stage, index) => {
          const isCompleted = currentStage > stage.stage;
          const isCurrent = currentStage === stage.stage;
          const isLocked = currentStage < stage.stage;
          
          const progress = isCurrent 
            ? Math.min(((totalXP - stage.requiredXP) / (STAGES[index + 1]?.requiredXP - stage.requiredXP || 10000)) * 100, 100)
            : isCompleted 
              ? 100 
              : 0;

          return (
            <Card 
              key={stage.stage} 
              className={`transition-all ${
                isCurrent 
                  ? 'border-2 shadow-md' 
                  : isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'opacity-60'
              }`}
              style={{
                borderColor: isCurrent ? stage.color : undefined
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div 
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600'
                        : isCurrent
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                    style={{
                      backgroundColor: isCurrent ? stage.color : undefined
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : isLocked ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <StageIcon stage={stage.stage} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">Stage {stage.stage}: {stage.title}</h4>
                      {isCompleted && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          ✓ Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ backgroundColor: stage.color }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stage.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700 mb-3">{stage.description}</p>
                {!isCompleted && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{stage.requiredXP.toLocaleString()} XP required</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Compact version
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Stage Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {STAGES.map((stage) => {
            const isCompleted = currentStage > stage.stage;
            const isCurrent = currentStage === stage.stage;
            
            return (
              <div key={stage.stage} className="flex items-center gap-3">
                <div 
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600'
                      : isCurrent
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? stage.color : undefined
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <StageIcon stage={stage.stage} size="sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium truncate ${isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>
                      {stage.title}
                    </p>
                    {isCurrent && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{stage.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
