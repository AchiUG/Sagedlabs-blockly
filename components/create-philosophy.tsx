
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Users, Lightbulb, Target, TrendingUp, Heart } from 'lucide-react';

const principles = [
  {
    letter: "C",
    title: "Contextual Relevance",
    icon: Globe,
    description: "We honor the unique historical, environmental, and cultural realities of African communities, embedding them into every learning experience.",
    color: "#C2694D"
  },
  {
    letter: "R",
    title: "Creative Resilience",
    icon: Lightbulb,
    description: "We champion innovation that thrives within constraints—encouraging learners to build imaginative, efficient, and durable solutions.",
    color: "#2563EB"
  },
  {
    letter: "E",
    title: "Expertise & Education",
    icon: Target,
    description: "We cultivate deep, place-based knowledge that empowers learners to become trusted Subject Matter Stewards in their communities.",
    color: "#CC8B3C"
  },
  {
    letter: "A",
    title: "Adaptive Scalability",
    icon: TrendingUp,
    description: "We design flexible methodologies that can be shared, adapted, and scaled—ensuring lasting impact across generations.",
    color: "#7C5E4A"
  },
  {
    letter: "T",
    title: "Transformative Teaching",
    icon: Users,
    description: "We believe in the power of passing on wisdom. Our learners evolve into Sages who mentor others and sustain a cycle of growth.",
    color: "#2563EB"
  },
  {
    letter: "E",
    title: "Empowered Communities",
    icon: Heart,
    description: "We prioritize education that serves real needs—transforming local challenges into opportunities for progress and prosperity.",
    color: "#C2694D"
  }
];

export default function CreatePhilosophy() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our C.R.E.A.T.E. Philosophy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The foundational principles that guide our approach to AI education and community empowerment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle, index) => {
            const IconComponent = principle.icon;
            return (
              <Card 
                key={index} 
                className="saged-card border-2 border-stone-200 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl text-white"
                      style={{ backgroundColor: principle.color }}
                    >
                      {principle.letter}
                    </div>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${principle.color}15` }}
                    >
                      <IconComponent 
                        className="w-6 h-6" 
                        style={{ color: principle.color }} 
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
