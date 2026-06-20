import React from 'react';
import { ShieldAlert, Heart, Lock, Send, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-navy-dark-light/40 pt-24 pb-12 overflow-hidden border-t border-white/5">
      
      {/* Floating CTA Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 -mt-36 mb-16">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-glow-cyan/30 bg-gradient-to-tr from-navy-dark to-glow-cyan/5 shadow-cyan-glow/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="font-sans font-black text-2xl text-white">Your voice can change a life.</h3>
            <p className="text-xs text-gray-300 max-w-lg leading-relaxed">
              Don't wait for things to get worse. Reporting anonymously takes less than 3 minutes, saves your location, and is completely untraceable.
            </p>
          </div>
          <a 
            href="#reporter"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-purple text-navy-dark font-extrabold text-sm tracking-wider hover:opacity-90 transition-all hover:scale-[1.02] shadow-cyan-glow/15 whitespace-nowrap"
          >
            File Secure Report
            <Send className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 mt-12">
        
        {/* About column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-glow-cyan/10 flex items-center justify-center border border-glow-cyan/20">
              <ShieldAlert className="w-4 h-4 text-glow-cyan" />
            </div>
            <span className="font-sans font-black text-xl text-white tracking-wider">SAFENEST</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            SafeNest is a digital safe haven combining end-to-end cryptographic shielding and localized NGO rescue networks to protect children from abuse, isolation, and exploitation.
          </p>
          
          {/* Security details badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
              <Lock className="w-3 h-3 text-glow-cyan" />
              AES-256 Encrypted
            </span>
            <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3 text-glow-emerald" />
              Zero-Trace Logs
            </span>
          </div>
        </div>

        {/* Links column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Resources</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#home" className="hover:text-glow-cyan transition-colors">Home Landing</a></li>
            <li><a href="#timeline" className="hover:text-glow-cyan transition-colors">Timeline Progress</a></li>
            <li><a href="#reporter" className="hover:text-glow-cyan transition-colors">Anonymous Portal</a></li>
            <li><a href="#education" className="hover:text-glow-cyan transition-colors">Safety Guides</a></li>
            <li><a href="#ngos" className="hover:text-glow-cyan transition-colors">NGO Directory</a></li>
          </ul>
        </div>

        {/* Helplines column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold text-glow-pink uppercase tracking-widest">Urgent Help Helplines</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex flex-col">
              <span className="text-gray-400">National Child Abuse Hotline (USA)</span>
              <a href="tel:1-800-422-4453" className="font-mono font-bold text-glow-pink hover:underline text-sm mt-0.5">
                1-800-422-4453
              </a>
            </li>
            <li className="flex flex-col">
              <span className="text-gray-400">India Childline (Emergency Rescue)</span>
              <a href="tel:1098" className="font-mono font-bold text-glow-cyan hover:underline text-sm mt-0.5">
                1098
              </a>
            </li>
            <li className="flex flex-col">
              <span className="text-gray-400">Youth Mental Health Crisis Helpline</span>
              <a href="tel:988" className="font-mono font-bold text-glow-purple hover:underline text-sm mt-0.5">
                988 (SMS or Call)
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer base */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500">
        <p>© {new Date().getFullYear()} SafeNest Shield Protocol. All rights reserved. Globally anonymous.</p>
        <p className="flex items-center gap-1">
          Made for youth safety & mental health protection
          <Heart className="w-3 h-3 text-glow-pink fill-glow-pink animate-pulse" />
        </p>
      </div>

    </footer>
  );
}
