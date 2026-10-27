import React from 'react';
import { Award, Feather, Droplets, Shield } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      step: '1.',
      title: 'Trusted Precision',
      description: 'High-Quality Quartz & Automatic Movement Ensures Accurate And Dependable Timekeeping.',
      icon: Award,
    },
    {
      step: '2.',
      title: 'Elegant Craftsmanship',
      description: 'Refined Designs With Premium Finishes, Crafted For Everyday Elegance.',
      icon: Feather,
    },
    {
      step: '3.',
      title: 'Water Resistant Build',
      description: 'Designed To Handle Daily Splashes And Light Water Exposure With Ease.',
      icon: Droplets,
    },
    {
      step: '4.',
      title: 'Durable Materials',
      description: 'Strong Cases And Scratch-Resistant Glass For Long-Lasting Performance.',
      icon: Shield,
    },
  ];

  return (
    <section className="py-12 bg-[#0d1017] border-b border-[#232733]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-[#131722] border border-[#232838] p-6 rounded-xl relative hover:border-[#c5a880]/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-lg text-[#c5a880] font-bold">{feat.step}</span>
                  <div className="w-9 h-9 rounded-lg bg-[#1b202e] text-[#c5a880] flex items-center justify-center group-hover:bg-[#c5a880] group-hover:text-black transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-serif tracking-wide">{feat.title}</h3>
                <p className="text-xs text-[#8f95a6] leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
