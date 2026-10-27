import React from 'react';
import { Award, Feather, Droplets, Shield } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      title: 'Precision Movements',
      description: 'Accurate Swiss & Japanese automatic and meca-quartz calibres.',
      icon: Award,
    },
    {
      title: 'Surgical Stainless Steel',
      description: 'Hand-finished 316L cases with brushed bevels and mirror polishes.',
      icon: Feather,
    },
    {
      title: 'Water Resistance',
      description: 'Screw-down crowns and tested depth ratings up to 30 ATM.',
      icon: Droplets,
    },
    {
      title: 'Sapphire Crystal',
      description: 'Double-domed, scratch-proof glass with anti-reflective coating.',
      icon: Shield,
    },
  ];

  return (
    <section className="py-8 sm:py-10 bg-[#0d1017] border-b border-[#232733]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-[#131722] border border-[#232838] p-4 sm:p-5 rounded-xl hover:border-[#c5a880]/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1b202e] text-[#c5a880] flex items-center justify-center mb-3 group-hover:bg-[#c5a880] group-hover:text-black transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 font-serif">{feat.title}</h3>
                <p className="text-xs text-[#8f95a6] leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
