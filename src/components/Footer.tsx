import React from 'react';
import { Watch, ShieldCheck, Truck, Award, MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'shop' | 'orders' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#08090d] text-[#e0e2ec] border-t border-[#1f2433] pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b border-[#1b202c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121622] border border-[#262c3e] flex items-center justify-center text-[#c5a880] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-xs font-semibold text-white">5-Year Mechanical Warranty</h4>
              <p className="text-[11px] text-[#8f95a6]">Comprehensive international protection.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121622] border border-[#262c3e] flex items-center justify-center text-[#c5a880] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-xs font-semibold text-white">Insured Global Courier</h4>
              <p className="text-[11px] text-[#8f95a6]">Fast, trackable white-glove shipping.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121622] border border-[#262c3e] flex items-center justify-center text-[#c5a880] shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-xs font-semibold text-white">Certificate of Origin</h4>
              <p className="text-[11px] text-[#8f95a6]">Individually numbered casebacks.</p>
            </div>
          </div>
        </div>

        {/* Minimal Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-[#1b202c] text-xs">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#181d2a] border border-[#2f384d] flex items-center justify-center text-[#c5a880]">
                <Watch className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif text-lg tracking-[0.2em] font-semibold text-white">
                SERENO
              </span>
            </div>

            <p className="text-neutral-400 text-xs max-w-xs leading-relaxed">
              Precision Swiss mechanical horology engineered for discerning collectors worldwide.
            </p>

            <div className="text-[11px] text-neutral-400 space-y-1 pt-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>42 Rhône Street, 1204 Geneva, Switzerland</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>concierge@sereno.ch</span>
              </p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 className="font-serif text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Navigation
            </h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button 
                  onClick={() => onNavigate?.('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Watch Collection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('orders')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Store Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div>
            <h5 className="font-serif text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Collector Gazette
            </h5>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Receive confidential announcements on limited release editions.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="collector@domain.ch"
                className="flex-1 px-3 py-1.5 bg-[#121622] border border-[#262c3e] rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="button"
                className="px-3 py-1.5 bg-[#1a202e] border border-[#31394e] text-xs font-semibold text-[#c5a880] hover:bg-[#252e42] rounded-lg transition-colors cursor-pointer"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} SERENO Genève. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Terms of Sale</span>
            <span>Swiss Quality</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
