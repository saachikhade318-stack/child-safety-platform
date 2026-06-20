import React, { useEffect, useRef } from 'react';
import { EyeOff, Send, MessageCircleCode, CheckCircle2 } from 'lucide-react';

export default function Timeline() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.15 }
    );

    const items = containerRef.current.querySelectorAll('.timeline-item');
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  const milestones = [
    {
      icon: <EyeOff className="w-6 h-6 text-glow-pink" />,
      title: "1. The Silence Barrier",
      text: "More than 60% of child abuse cases go completely unreported. Fear of disbelief, retribution, and confusion traps children in a loop of silent suffering.",
      accent: "border-l-4 border-glow-pink shadow-pink-glow/10",
      glowColor: "rgba(255, 77, 141, 0.15)",
      badge: "The Problem"
    },
    {
      icon: <MessageCircleCode className="w-6 h-6 text-glow-cyan" />,
      title: "2. The Autonomous Assistant",
      text: "Children interact with SafeNest—our friendly, encrypted AI helper. Using interactive games and simple definitions, it helps them recognize unsafe behaviors safely.",
      accent: "border-l-4 border-glow-cyan shadow-cyan-glow/10",
      glowColor: "rgba(0, 229, 255, 0.15)",
      badge: "Interactive Guidance"
    },
    {
      icon: <Send className="w-6 h-6 text-glow-purple" />,
      title: "3. Cryptographic Reporting",
      text: "Reports are processed without IP logging, browser headers, or cookies. Standard files, audio memos, or text are converted to secure packets.",
      accent: "border-l-4 border-glow-purple shadow-purple-glow/10",
      glowColor: "rgba(124, 58, 237, 0.15)",
      badge: "Zero-Trace Protocol"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-glow-emerald" />,
      title: "4. The Recovery Shield",
      text: "Within 90 seconds, alerts route directly to localized response networks and partner NGOs, initiating crisis housing, counseling, and recovery protocols.",
      accent: "border-l-4 border-glow-emerald shadow-emerald-glow/10",
      glowColor: "rgba(16, 185, 129, 0.15)",
      badge: "Rapid Rescue"
    }
  ];

  return (
    <section id="timeline" className="py-24 relative overflow-hidden bg-navy-dark/40 border-y border-white/5">
      {/* Background Decorative Rings */}
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] rounded-full bg-glow-purple/5 blur-3xl pointer-events-none"></div>
      <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] rounded-full bg-glow-cyan/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={containerRef}>
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Breaking Silence <span className="text-gradient-cyan-purple">Step-by-Step</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            How our platform enables a secure pipeline from initial distress to permanent safety, guaranteeing zero identity exposure.
          </p>
        </div>

        {/* Timeline Line Container */}
        <div className="relative">
          {/* Vertical Center Glow Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-glow-pink via-glow-purple to-glow-emerald"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx} 
                  className={`timeline-item opacity-0 translate-y-12 transition-all duration-[900ms] ease-out flex flex-col md:flex-row items-stretch ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Outer spacer to push to side */}
                  <div className="hidden md:block md:w-1/2"></div>

                  {/* Icon Indicator Dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-[11px] md:-translate-x-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-navy-dark border-2 border-glow-purple z-10">
                    <div className="w-2 h-2 rounded-full bg-glow-cyan animate-ping"></div>
                  </div>

                  {/* Main Card Content */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                    <div 
                      className={`glass-panel rounded-2xl p-6 md:p-8 ${item.accent} glow-card relative overflow-hidden`}
                      style={{
                        background: `linear-gradient(135deg, rgba(7, 17, 31, 0.75) 0%, ${item.glowColor} 100%)`
                      }}
                    >
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-glow-cyan bg-glow-cyan/10 px-2 py-0.5 rounded-md mb-4 border border-glow-cyan/20">
                        {item.badge}
                      </span>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-white/5 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <h3 className="font-sans font-bold text-xl sm:text-2xl text-white">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
