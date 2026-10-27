import React from 'react';
import { Sparkles, Star, ArrowRight, ShieldCheck, Compass, Clock } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  featuredProduct?: Product;
  onExplore: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenAtelier: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProduct,
  onExplore,
  onSelectProduct,
  onOpenAtelier,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e1117] via-[#121620] to-[#0b0c10] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#232733]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#c5a880]/10 rounded-full blur-[140px] pointer-events-none -z-0"></div>
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2330] border border-[#333a4d] text-xs text-[#c5a880] tracking-wider uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Haute Horlogerie Genève</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.15] tracking-tight">
              Timeless Elegance <br />
              <span className="italic font-light text-[#e2d4be]">on Your Wrist</span>
            </h1>

            <p className="text-[#9ba2b5] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Discover watches hand-assembled with surgical-grade 316L stainless steel, scratch-resistant sapphire crystal, and precision calibres calibrated for a lifetime of distinction.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-explore-collection-btn"
                onClick={onExplore}
                className="px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#e6d8c4] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/40 flex items-center gap-2 group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-discover-atelier-btn"
                onClick={onOpenAtelier}
                className="px-6 py-3.5 rounded-full bg-[#151922] border border-[#2d3345] text-[#c5c8d6] hover:text-white hover:border-[#c5a880] font-medium text-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#c5a880]" />
                <span>Discover Our Atelier</span>
              </button>
            </div>

            {/* Social Proof rating stack (matching Reference Screenshot 1) */}
            <div className="pt-6 border-t border-[#232733] flex items-center gap-4">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0b0c10] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0b0c10] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0b0c10] object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                />
                <div className="h-9 w-9 rounded-full bg-[#232733] ring-2 ring-[#0b0c10] flex items-center justify-center text-[10px] font-bold text-[#c5a880]">
                  +1.2k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-bold text-white">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-[#828899] font-medium">Over 1,234 Verified Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Flagship Watch Visual with Floating Spec Callouts */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Center Dial Glow */}
            <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-[#c5a880]/20 bg-[#121622] p-4 relative flex items-center justify-center shadow-2xl shadow-black/80">
              
              {/* Outer Minute Track Simulation */}
              <div className="absolute inset-2 rounded-full border border-dashed border-[#2b3040]/80 pointer-events-none"></div>

              {/* Main Hero Watch Display Image */}
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
                alt="Sereno Flagship Chronograph"
                className="w-full h-full object-cover rounded-full filter contrast-110 drop-shadow-2xl transition-transform hover:scale-105 duration-700"
              />

              {/* Spec Badge 1: Movement */}
              <div className="absolute -top-4 -left-4 sm:top-4 sm:-left-6 bg-[#161a24]/90 backdrop-blur-md border border-[#2d3345] rounded-xl p-3 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Movement</div>
                  <div className="text-xs font-semibold text-white">VK64 Mecha-Quartz</div>
                </div>
              </div>

              {/* Spec Badge 2: Glass */}
              <div className="absolute -bottom-4 -left-2 sm:bottom-4 sm:-left-4 bg-[#161a24]/90 backdrop-blur-md border border-[#2d3345] rounded-xl p-3 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Crystal</div>
                  <div className="text-xs font-semibold text-white">Domed Sapphire Glass</div>
                </div>
              </div>

              {/* Spec Badge 3: Water Resistance */}
              <div className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 bg-[#161a24]/90 backdrop-blur-md border border-[#2d3345] rounded-xl p-3 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Water Resistance</div>
                  <div className="text-xs font-semibold text-white">10 ATM (100 Meters)</div>
                </div>
              </div>
            </div>

            {/* Quick action overlay trigger if featured product exists */}
            {featuredProduct && (
              <div className="absolute bottom-0 right-4 sm:right-10 bg-[#151922] border border-[#c5a880]/30 rounded-lg p-2.5 shadow-lg flex items-center gap-3">
                <div>
                  <div className="text-[10px] text-[#c5a880] font-mono">FEATURED MODEL</div>
                  <div className="text-xs font-bold text-white">{featuredProduct.name}</div>
                  <div className="text-xs text-[#9ba2b5]">${featuredProduct.price} USD</div>
                </div>
                <button
                  id="hero-quick-view-flagship-btn"
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="text-xs bg-[#c5a880] text-black font-semibold px-3 py-1.5 rounded hover:bg-white transition-colors"
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
