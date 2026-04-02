
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Code, Sparkles, Check } from 'lucide-react';

interface PathwaySelectorProps {
  selectedPathway?: string;
  onSelect: (pathway: string) => void;
  archetype?: string;
}

const pathways = [
  {
    id: 'educator',
    title: 'Educator',
    icon: GraduationCap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    ringColor: 'ring-red-500',
    description: 'Focus on teaching, mentorship, and community building',
    features: [
      'AI pedagogy techniques',
      'Curriculum design tools',
      'Teaching resources library',
      'Educator community access'
    ]
  },
  {
    id: 'technologist',
    title: 'Technologist',
    icon: Code,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    ringColor: 'ring-blue-500',
    description: 'Build AI solutions for real-world African challenges',
    features: [
      'Hands-on technical projects',
      'ML/DL frameworks mastery',
      'Code repositories access',
      'Technologist community access'
    ]
  },
  {
    id: 'young_sage',
    title: 'Young Sage',
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    ringColor: 'ring-amber-500',
    description: 'Build strong foundations and explore with curiosity',
    features: [
      'Foundational courses',
      'Guided learning path',
      'Study group access',
      'Mentor support'
    ]
  }
];

export default function PathwaySelector({ selectedPathway, onSelect, archetype }: PathwaySelectorProps) {
  // Determine recommended pathway based on archetype
  const getRecommendedPathway = () => {
    if (archetype === 'educator' || archetype === 'educator_sage') return 'educator';
    if (archetype === 'technologist' || archetype === 'tech_educator') return 'technologist';
    if (archetype === 'young_sage') return 'young_sage';
    return null;
  };

  const recommendedPathway = getRecommendedPathway();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Learning Pathway
        </h3>
        <p className="text-gray-600">
          Based on your archetype quiz results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pathways.map((pathway) => {
          const Icon = pathway.icon;
          const isRecommended = pathway.id === recommendedPathway;
          const isSelected = pathway.id === selectedPathway;

          return (
            <Card
              key={pathway.id}
              className={`
                relative cursor-pointer transition-all
                ${isSelected ? `ring-2 ${pathway.ringColor} shadow-lg` : 'hover:shadow-md'}
                ${isRecommended ? `${pathway.borderColor} border-2` : ''}
              `}
              onClick={() => onSelect(pathway.id)}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className={`${pathway.bgColor} ${pathway.color} border-0`}>
                    Recommended
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-full ${pathway.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${pathway.color}`} />
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {pathway.title}
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  {pathway.description}
                </p>

                <ul className="space-y-2">
                  {pathway.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className={`w-4 h-4 ${pathway.color} mr-2 mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isSelected && (
                  <Badge className={`mt-4 ${pathway.bgColor} ${pathway.color} border-0`}>
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
