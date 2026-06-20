import React, { useEffect, useState } from 'react';
import { Network, Phone, Mail, MapPin, Radio, Activity, Link2 } from 'lucide-react';
import { fetchNGOs } from '../api';

export default function NGOConnections() {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [activePulse, setActivePulse] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchNGOs();
      setNgos(data);
      if (data.length > 0) {
        setSelectedNgo(data[0]);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (ngos.length === 0) return;
    const interval = setInterval(() => {
      setActivePulse(prev => {
        const next = prev + 1;
        return next > ngos.length ? 1 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [ngos]);

  return (
    <section id="ngos" className="py-24 relative overflow-hidden bg-navy-dark border-b border-white/5">
      {/* Background Neon Glows */}
      <div className="absolute left-10 top-1/3 w-[350px] h-[350px] bg-glow-purple/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight mb-4">
            Unified <span className="text-gradient-cyan-purple">Safety Network</span>
          </h2>
          <p className="text-sm text-gray-400">
            A secure mesh connecting reporting endpoints to immediate human assets: trusted NGOs, pediatric mental health responders, and law desks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Interactive Network Graph Widget */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center">
            <div className="relative w-full max-w-[500px] aspect-square rounded-3xl glass-panel border border-white/10 p-6 flex items-center justify-center overflow-hidden">
              
              {/* Dynamic SVG Network Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                {/* Grid Lines */}
                <path d="M 10 0 L 10 100 M 30 0 L 30 100 M 50 0 L 50 100 M 70 0 L 70 100 M 90 0 L 90 100" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
                <path d="M 0 10 L 100 10 M 0 30 L 100 30 M 0 50 L 100 50 M 0 70 L 100 70 M 0 90 L 100 90" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />

                {/* Draw connecting lines from the center shield node (50,50) to all NGO coords */}
                {ngos.map((ngo) => (
                  <g key={`lines-${ngo.id}`}>
                    {/* Glowing pulse trail line */}
                    <line 
                      x1="50" 
                      y1="50" 
                      x2={ngo.coords.x} 
                      y2={ngo.coords.y} 
                      stroke="url(#lineGrad)" 
                      strokeWidth={selectedNgo?.id === ngo.id ? "1" : "0.5"} 
                      strokeDasharray="4 4"
                      className={activePulse === ngo.id ? 'animate-[dash_10s_linear_infinite]' : ''}
                    />
                    {/* Glow backdrop line */}
                    <line 
                      x1="50" 
                      y1="50" 
                      x2={ngo.coords.x} 
                      y2={ngo.coords.y} 
                      stroke={selectedNgo?.id === ngo.id ? "#00E5FF" : "#7C3AED"} 
                      strokeWidth="0.5" 
                      opacity={selectedNgo?.id === ngo.id ? "0.6" : "0.2"} 
                    />
                  </g>
                ))}

                {/* Line Gradient Definition */}
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central Core Shield Node */}
              <div className="absolute w-16 h-16 rounded-full bg-navy-dark border-2 border-glow-cyan flex items-center justify-center shadow-cyan-glow animate-pulse z-20">
                <Network className="w-8 h-8 text-glow-cyan" />
              </div>

              {/* Interactive NGO nodes mapped dynamically */}
              {!isLoading && ngos.map((ngo) => (
                <button
                  key={ngo.id}
                  onClick={() => setSelectedNgo(ngo)}
                  style={{
                    left: `${ngo.coords.x}%`,
                    top: `${ngo.coords.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute group z-20 focus:outline-none"
                >
                  {/* Ping Ring */}
                  <span className={`absolute -inset-2 rounded-full border border-glow-purple/40 scale-125 ${
                    activePulse === ngo.id ? 'animate-ping opacity-70' : 'opacity-0'
                  }`} />
                  
                  {/* Pulsing Core dot */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedNgo?.id === ngo.id 
                      ? 'bg-glow-cyan border-white scale-125 shadow-cyan-glow' 
                      : 'bg-navy-dark border-glow-purple hover:border-glow-cyan shadow'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      selectedNgo?.id === ngo.id ? 'bg-navy-dark' : 'bg-glow-purple group-hover:bg-glow-cyan'
                    }`} />
                  </div>

                  {/* Tiny floating name hover */}
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-navy-dark/95 border border-white/10 rounded px-2 py-0.5 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                    {ngo.name}
                  </span>
                </button>
              ))}

              {/* Grid scanning visualizer radar line */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-glow-cyan/5 to-transparent h-1/4 w-full top-0 animate-[radarSweep_4s_ease-in-out_infinite] pointer-events-none" />

            </div>
          </div>

          {/* Details Side Panel */}
          <div className="lg:col-span-5">
            {selectedNgo ? (
              <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-500">
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-glow-emerald/10 border border-glow-emerald/20 text-glow-emerald text-[9px] font-bold uppercase tracking-wider font-mono">
                  <Activity className="w-3 h-3 animate-pulse" />
                  {selectedNgo.status}
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans font-black text-2xl text-white tracking-wide">{selectedNgo.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-glow-cyan" />
                    {selectedNgo.address}
                  </p>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed border-y border-white/5 py-4">
                  {selectedNgo.description}
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <a 
                    href={`tel:${selectedNgo.contact}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-glow-cyan/15 hover:border-glow-cyan/30 border border-white/5 text-gray-200 hover:text-white transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-glow-cyan/10 border border-glow-cyan/20 group-hover:scale-105 transition-transform text-glow-cyan">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Phone Helpline (24/7)</span>
                      <span className="font-mono font-bold text-sm tracking-wider">{selectedNgo.contact}</span>
                    </div>
                  </a>
                  <a 
                    href={`mailto:${selectedNgo.email}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-glow-purple/15 hover:border-glow-purple/30 border border-white/5 text-gray-200 hover:text-white transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-glow-purple/10 border border-glow-purple/20 group-hover:scale-105 transition-transform text-glow-purple">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Confidential Email</span>
                      <span className="font-mono font-bold text-sm">{selectedNgo.email}</span>
                    </div>
                  </a>
                </div>

              </div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center py-16 text-gray-500 text-sm">
                <Radio className="w-8 h-8 text-glow-cyan animate-pulse mx-auto mb-4" />
                Interpreting secure regional nodes...
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
