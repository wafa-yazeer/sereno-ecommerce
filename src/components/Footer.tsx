import React from 'react';
import { Watch, ShieldCheck, Truck, Sparkles, Award, MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'shop' | 'orders' | 'admin') => void;
  onOpenAtelier?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAtelier }) => {
  return (
    <footer className="bg-[#08090d] text-[#e0e2ec] border-t border-[#1f2433] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#1b202c]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#121622] border border-[#262c3e] flex items-center justify-center text-[#c5a880] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">5-Year International Warranty</h4>
              <p className="text-xs text-[#8f95a6] mt-1">Full mechanical coverage across our global certified network.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#121622] border border-[#262c3e] flex items-center justify-center text-[#c5a880] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Insured Global Courier</h4>
              <p className="text-xs text-[#8f95a6] mt-1">Direct from our Geneva atelier with tamper-evident secure packing.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#121622] border border-[#262c3e] flex items-center justify-center text-[#c5a880] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Certified Authenticity</h4>
              <p className="text-xs text-[#8f95a6] mt-1">Numbered casebacks and individual holographic registration papers.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#121622] border border-[#262c3e] flex items-center justify-center text-[#c5a880] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Complimentary Sizing</h4>
              <p className="text-xs text-[#8f95a6] mt-1">Free custom bracelet adjustment prior to departure from Geneva.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-[#1b202c]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#181d2a] border border-[#2f384d] flex items-center justify-center text-[#c5a880]">
                <Watch className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl tracking-[0.25em] font-semibold text-white">
                SERENO
              </span>
            </div>

            <p className="text-xs text-[#8f95a6] leading-relaxed max-w-sm">
              Founded on the shores of Lake Geneva, SERENO manufactures precision mechanical chronographs and self-winding automatic timepieces engineered for discerning collectors.
            </p>

            <div className="pt-2 text-xs text-[#7d8496] space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>42 Rhone Street, 1204 Geneva, Switzerland</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>+41 22 819 4400 (Mon–Fri 09:00–18:00 CET)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>concierge@horology-sereno.ch</span>
              </p>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div>
            <h5 className="font-serif text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-[#8f95a6]">
              <li>
                <button 
                  onClick={() => onNavigate?.('shop')}
                  className="hover:text-white transition-colors"
                >
                  Chronograph Complications
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('shop')}
                  className="hover:text-white transition-colors"
                >
                  Automatic Hi-Beat
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('shop')}
                  className="hover:text-white transition-colors"
                >
                  Maritime Divers 300M
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('shop')}
                  className="hover:text-white transition-colors"
                >
                  Ultra-Slim Heritage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('shop')}
                  className="hover:text-white transition-colors"
                >
                  Transcontinental GMT
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h5 className="font-serif text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Atelier & Services
            </h5>
            <ul className="space-y-2.5 text-xs text-[#8f95a6]">
              <li>
                <button 
                  onClick={onOpenAtelier}
                  className="hover:text-white transition-colors"
                >
                  Discover Our Atelier
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('orders')}
                  className="hover:text-white transition-colors"
                >
                  Track Order & Dispatch
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('admin')}
                  className="hover:text-white transition-colors"
                >
                  Boutique Management
                </button>
              </li>
              <li>
                <a href="#collection-grid-section" className="hover:text-white transition-colors">
                  Calibre Maintenance
                </a>
              </li>
              <li>
                <a href="#collection-grid-section" className="hover:text-white transition-colors">
                  Warranty Registration
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h5 className="font-serif text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Boutique Gazette
            </h5>
            <p className="text-xs text-[#8f95a6] mb-3 leading-relaxed">
              Receive confidential invitations to numbered release allocations and Basel horology showcases.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="collector@domain.com"
                className="w-full px-3 py-2 bg-[#121622] border border-[#262c3e] rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="button"
                className="w-full py-2 bg-[#1a202e] border border-[#31394e] text-xs font-semibold text-[#c5a880] hover:bg-[#252e42] rounded-lg transition-colors"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#717789]">
          <p>© {new Date().getFullYear()} SERENO Geneva Master Watchmaking Atelier Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Horology Sale</span>
            <span>Swiss Made Quality Seal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
