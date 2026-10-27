import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Award, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Compass
} from 'lucide-react';

interface AtelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreCollection: () => void;
}

export const AtelierModal: React.FC<AtelierModalProps> = ({
  isOpen,
  onClose,
  onExploreCollection,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#11141c] border border-[#2b3347] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-[#e0e2ec]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Luxury Brand Identity */}
        <div className="px-6 py-4 bg-[#141822] border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1b202e] border border-[#2b3347] flex items-center justify-center text-[#c5a880]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                SERENO Geneva • Master Watchmaking Atelier
              </h2>
              <p className="text-[11px] text-[#a1a7b8]">
                42 Rhone Street, 1204 Geneva, Switzerland • Precision Micro-Engineering & Handcraft
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-[#202534] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 text-xs">
          
          {/* Top Heritage Story Banner */}
          <div className="relative rounded-xl overflow-hidden border border-[#232838] bg-gradient-to-r from-[#171b26] to-[#0e1117] p-6 sm:p-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] font-bold">
                HAUTE HORLOGERIE TRADITION
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                Architectural Form Meets <br />
                <span className="italic text-[#e2d4be]">Chronometric Precision</span>
              </h3>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                Founded on the shores of Lake Geneva, SERENO unites classical Swiss watchmaking disciplines with bold, modern architectural geometry. Every calibre is tested across 5 dynamic positions to ensure chronometer-grade stability.
              </p>
            </div>
          </div>

          {/* 3 Pillars of Sereno Watchmaking */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-[#151924] border border-[#242b3b] rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm font-bold text-white">Hybrid Mecha-Quartz & Automatic Calibres</h4>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Our chronographs blend quartz precision with mechanical heart-cam flyback resetting, delivering instantaneous tactile pusher feedback and sweeping chronograph needles.
              </p>
              <div className="pt-2 border-t border-[#202636] text-[10px] text-neutral-300 space-y-1">
                <div>• Seiko VK-Series & Miyota Mechanicals</div>
                <div>• Instant mechanical flyback reset</div>
                <div>• 40+ hours power reserve on Automatics</div>
              </div>
            </div>

            <div className="bg-[#151924] border border-[#242b3b] rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm font-bold text-white">Anti-Reflective Sapphire Crystals</h4>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Every Sereno timepiece is crowned with dual-curved domed synthetic sapphire crystal with triple interior anti-reflective (AR) coating for absolute optical purity.
              </p>
              <div className="pt-2 border-t border-[#202636] text-[10px] text-neutral-300 space-y-1">
                <div>• Mohs hardness 9 (scratch-proof)</div>
                <div>• Multi-layer inner AR coating</div>
                <div>• Vintage box-domed profile</div>
              </div>
            </div>

            <div className="bg-[#151924] border border-[#242b3b] rounded-xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm font-bold text-white">316L Steel & 300M Pressure Chambers</h4>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Cases are milled from solid billets of hypoallergenic 316L stainless steel, alternating brushed satin flanks with hand-polished mirror bevels.
              </p>
              <div className="pt-2 border-t border-[#202636] text-[10px] text-neutral-300 space-y-1">
                <div>• 100M to 300M pressure certified</div>
                <div>• Screw-down crown with O-ring gaskets</div>
                <div>• Swiss Super-LumiNova BGW9 dials</div>
              </div>
            </div>

          </div>

          {/* Sereno Customer Guarantees */}
          <div className="bg-[#141822] border border-[#232838] p-5 rounded-xl space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#c5a880] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>The SERENO Guarantee of Authenticity</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-neutral-300">
              <div className="p-3 bg-[#191e2b] rounded-lg border border-[#262f43]">
                <div className="font-bold text-white mb-1">5-Year Global Warranty</div>
                <p className="text-neutral-400">Comprehensive coverage against any manufacturing or mechanical defects.</p>
              </div>
              <div className="p-3 bg-[#191e2b] rounded-lg border border-[#262f43]">
                <div className="font-bold text-white mb-1">White Glove Courier</div>
                <p className="text-neutral-400">Insured express delivery worldwide with live tracking & adult signature.</p>
              </div>
              <div className="p-3 bg-[#191e2b] rounded-lg border border-[#262f43]">
                <div className="font-bold text-white mb-1">30-Day Evaluation Return</div>
                <p className="text-neutral-400">Complimentary return shipping in unworn condition for total confidence.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#141822] border-t border-[#232733] flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Geneva Horology Atelier • Official Swiss Federal Registry
          </span>
          <button
            onClick={() => {
              onClose();
              onExploreCollection();
            }}
            className="px-5 py-2.5 rounded-lg bg-[#c5a880] text-black font-semibold text-xs hover:bg-white transition-colors flex items-center gap-2"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
