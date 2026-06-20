import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, BarChart3, Fingerprint, Activity } from 'lucide-react';

export default function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const stats = [
    {
      title: "Silent Cruelty Ratio",
      percentage: 90,
      color: "from-glow-pink to-red-500",
      glow: "shadow-pink-glow/20",
      icon: <Fingerprint className="w-5 h-5 text-glow-pink" />,
      description: "90% of children abused are familiar with their perpetrator."
    },
    {
      title: "Encrypted Evidence Recovery",
      percentage: 76,
      color: "from-glow-cyan to-glow-purple",
      glow: "shadow-cyan-glow/20",
      icon: <Activity className="w-5 h-5 text-glow-cyan" />,
      description: "76% of cyber abuse cases carry digital logs (chats, images)."
    },
    {
      title: "Reporting Bridge Completion",
      percentage: 92,
      color: "from-glow-emerald to-green-400",
      glow: "shadow-emerald-glow/20",
      icon: <ShieldCheck className="w-5 h-5 text-glow-emerald" />,
      description: "92% of cases submitted through anonymous logs are assigned within 30 min."
    }
  ];

  return (
    <section id="statistics" ref={sectionRef} className="py-24 relative overflow-hidden bg-navy-dark border-b border-white/5">
      {/* Background ambient neon orb */}
      <div className="absolute right-10 top-1/4 w-[300px] h-[300px] rounded-full bg-glow-pink/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight mb-4">
            Critical Data <span className="text-gradient-cyan-purple">Behind the Shield</span>
          </h2>
          <p className="text-sm text-gray-400">
            Real statistics highlighting the silent crisis of youth abuse and the verified efficiency of encrypted rescue paths.
          </p>
        </div>

        {/* Info-Graphics dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Background gradient flare on card hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/[0.02] pointer-events-none" />

              <div className="space-y-6">
                
                {/* Icon & Title */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                </div>

                {/* Progress Circle & Text */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-white text-base">{stat.title}</h3>
                    <span className="font-mono text-2xl font-black text-white">
                      {isVisible ? stat.percentage : 0}%
                    </span>
                  </div>

                  {/* Horizontal gauge bar */}
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full bg-gradient-to-r rounded-full transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${stat.color}`}
                      style={{
                        width: isVisible ? `${stat.percentage}%` : '0%'
                      }}
                    />
                  </div>
                </div>

              </div>

              <p className="text-xs text-gray-400 leading-relaxed pt-6 mt-6 border-t border-white/5">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Circular SVG dashboard metrics */}
        <div className="mt-16 glass-panel rounded-3xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-xl text-white">The Crisis of the Unheard</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Every day, children search for a way out. Without safe tools, the duration of an abuse loop stretches to years. Digital shields dramatically contract response timing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="w-2 h-2 rounded-full bg-glow-pink animate-ping"></span>
              <span className="text-xs font-semibold text-glow-pink tracking-wide uppercase">Real-Time Data Feed Integrity Check</span>
            </div>
          </div>

          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-white/5 fill-transparent" strokeWidth="6" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    className="stroke-glow-pink fill-transparent transition-all duration-[2000ms]" 
                    strokeWidth="6" 
                    strokeDasharray="301.6" 
                    strokeDashoffset={isVisible ? 301.6 - (301.6 * 68) / 100 : 301.6} 
                  />
                </svg>
                <span className="absolute text-xl font-bold font-mono text-white">68%</span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-3">Unreported Abuse</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-white/5 fill-transparent" strokeWidth="6" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    className="stroke-glow-cyan fill-transparent transition-all duration-[2000ms]" 
                    strokeWidth="6" 
                    strokeDasharray="301.6" 
                    strokeDashoffset={isVisible ? 301.6 - (301.6 * 90) / 100 : 301.6} 
                  />
                </svg>
                <span className="absolute text-xl font-bold font-mono text-white">90s</span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-3">SOS Response</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
