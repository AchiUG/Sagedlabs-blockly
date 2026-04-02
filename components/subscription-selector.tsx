
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, TrendingUp } from 'lucide-react';
import { subscriptionService, type SubscriptionTier } from '@/lib/services/subscription-service';

interface SubscriptionSelectorProps {
  recommendedTier?: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
  selectedTier?: SubscriptionTier;
}

const tierIcons = {
  basic: Sparkles,
  pro: TrendingUp,
  mentor: Crown
};

const tierColors = {
  basic: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    ring: 'ring-blue-500'
  },
  pro: {
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    ring: 'ring-orange-500'
  },
  mentor: {
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    ring: 'ring-purple-500'
  }
};

export default function SubscriptionSelector({ 
  recommendedTier, 
  onSelect, 
  selectedTier 
}: SubscriptionSelectorProps) {
  const plans = subscriptionService.getPlans();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Subscription Tier
        </h3>
        <p className="text-gray-600">
          Select the plan that best fits your learning goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = tierIcons[plan.id];
          const colors = tierColors[plan.id];
          const isRecommended = plan.id === recommendedTier;
          const isSelected = plan.id === selectedTier;

          return (
            <Card 
              key={plan.id}
              className={`
                relative cursor-pointer transition-all
                ${isSelected ? `ring-2 ${colors.ring} shadow-lg` : 'hover:shadow-md'}
                ${isRecommended ? `${colors.border} border-2` : ''}
              `}
              onClick={() => onSelect(plan.id)}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className={`${colors.bg} ${colors.text} border-0`}>
                    Recommended for You
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${colors.text}`} />
                </div>
                <CardTitle className="text-xl mb-1">{plan.title}</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${plan.price}
                  <span className="text-base font-normal text-gray-600">/mo</span>
                </div>
                <CardDescription className="text-sm">
                  {plan.name} Tier
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className={`w-4 h-4 ${colors.text} mr-2 mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isSelected && (
                  <Button 
                    className={`w-full mt-6 ${colors.bg} ${colors.text} hover:opacity-90`}
                    variant="secondary"
                  >
                    Selected
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>All plans include 14-day money-back guarantee • Cancel anytime</p>
      </div>
    </div>
  );
}
