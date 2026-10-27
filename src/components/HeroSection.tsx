import React from 'react';
import { ArrowRight, Star, Clock, ShieldCheck, Compass } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  featuredProduct?: Product;
  onExplore: () => void;
  onSelectProduct: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProduct,
  onExplore,
  onSelectProduct,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e1117] via-[#121620] to-[#0b0c10] pt-6 pb-14 lg:pt-12 lg:pb-20 border-b border-[#232733]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-[#c5a880]/10 rounded-full blur-[140px] pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Clean Minimal Hero Copy */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[11px] font-mono tracking-widest text-[#c5a880] uppercase block">
              GENEVA SWISS PRECISION
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight tracking-tight">
              Timeless Distinction <br />
              <span className="italic font-light text-[#e2d4be]">for Every Moment</span>
            </h1>

            <p className="text-[#9ba2b5] text-sm sm:text-base max-w-lg leading-relaxed">
              Hand-finished with 316L stainless steel, sapphire crystal, and mechanical calibres built for a lifetime.
            </p>

            <div className="pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e6d8c4] transition-all flex items-center gap-2 group cursor-pointer shadow-lg"
              >
                <span>View Watches</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Verified Rating */}
            <div className="pt-4 border-t border-[#232733] flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-white">4.9 / 5.0 Rating</span>
              <span className="text-xs text-neutral-500">•</span>
              <span className="text-xs text-neutral-400">Over 1,200 Verified Collectors</span>
            </div>
          </div>

          {/* Right Column: Interactive Watch Visual */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border border-[#c5a880]/20 bg-[#121622] p-3 relative flex items-center justify-center shadow-2xl">
              
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
                alt="Sereno Timepiece"
                className="w-full h-full object-cover rounded-full filter contrast-110 drop-shadow-2xl"
              />

              {/* Minimal floating spec callouts */}
              <div className="absolute top-2 -left-2 sm:top-4 sm:-left-4 bg-[#161a24]/95 border border-[#2d3345] rounded-xl px-3 py-2 shadow-xl flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                <span className="text-[11px] font-semibold text-white">VK64 Meca-Quartz</span>
              </div>

              <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:-left-2 bg-[#161a24]/95 border border-[#2d3345] rounded-xl px-3 py-2 shadow-xl flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-semibold text-white">Domed Sapphire</span>
              </div>

              <div className="absolute top-1/2 -right-3 sm:-right-6 -translate-y-1/2 bg-[#161a24]/95 border border-[#2d3345] rounded-xl px-3 py-2 shadow-xl flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-semibold text-white">10 ATM Water-Resistant</span>
              </div>
            </div>

            {/* Quick view flagship badge */}
            {featuredProduct && (
              <div className="absolute bottom-0 right-2 sm:right-6 bg-[#151922] border border-[#c5a880]/30 rounded-lg p-2.5 shadow-lg flex items-center gap-3">
                <div>
                  <div className="text-[10px] text-[#c5a880] font-mono">FEATURED</div>
                  <div className="text-xs font-bold text-white">{featuredProduct.name}</div>
                  <div className="text-xs text-neutral-400">${featuredProduct.price}</div>
                </div>
                <button
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="text-xs bg-[#c5a880] text-black font-semibold px-2.5 py-1 rounded hover:bg-white transition-colors cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
