'use client';

import { StageState, SpriteState } from './command-interpreter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MousePointer2, Rabbit, Cat, Carrot, Apple, Droplets, Home } from 'lucide-react';

interface SpriteSelectorProps {
  state: StageState;
  onSelect: (id: string) => void;
}

export default function SpriteSelector({ state, onSelect }: SpriteSelectorProps) {
  const spriteIds = Object.keys(state.sprites);

  const getSpriteIcon = (type: string) => {
    switch (type) {
      case 'hare': return <Rabbit className="w-5 h-5" />;
      case 'lion': return <Cat className="w-5 h-5" />;
      case 'carrot': return <Carrot className="w-5 h-5" />;
      case 'food': return <Apple className="w-5 h-5" />;
      case 'water': return <Droplets className="w-5 h-5" />;
      case 'home': return <Home className="w-5 h-5" />;
      default: return <MousePointer2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <MousePointer2 className="w-4 h-4" />
        Sprites
      </h4>
      <div className="flex flex-wrap gap-2">
        {spriteIds.map((id) => {
          const sprite = state.sprites[id];
          const isSelected = state.selectedSpriteId === id;
          
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                isSelected 
                  ? "border-[#124734] bg-[#124734]/5 text-[#124734]" 
                  : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-gray-100"
              )}
              style={{ minWidth: '70px' }}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-1",
                isSelected ? "bg-[#124734] text-white" : "bg-gray-200 text-gray-500"
              )}>
                {getSpriteIcon(sprite.type)}
              </div>
              <span className="text-[10px] font-bold truncate w-full text-center">
                {id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
