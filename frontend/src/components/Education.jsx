import React, { useState } from 'react';
import { Lock, CheckCircle, Info } from 'lucide-react';

export default function Education() {
  const [selectedZone, setSelectedZone] = useState('head');
  const [flippedCard, setFlippedCard] = useState(null);

  const touchZones = {
    head: {
      title: "Pat on Head / Shoulder",
      status: "Safe Touch",
      type: "safe",
      description: "A friendly high-five, handshake, or pat on the shoulder is a standard friendly greeting. Remember, if you do not want it, it is always your choice to say 'Please stop'!"
    },
    hands: {
      title: "Holding Hands / High Fives",
      status: "Safe Touch",
      type: "safe",
      description: "Holding hands with parents while crossing the street or doing high-fives with friends are normal, safe ways to show trust and care."
    },
    bathingSuit: {
      title: "Bathing Suit Zones",
      status: "Private Zone (Unsafe Touch if Secret/Unwanted)",
      type: "unsafe",
      description: "The parts of your body covered by a swimsuit are private. Nobody is allowed to look at or touch these parts, except for doctors/nurses checking your health with parents present. It is never okay for someone to ask you to keep a touch a secret."
    }
  };

  const interactiveCards = [
    {
      id: 1,
      frontTitle: "What is a Safe Touch?",
      frontDesc: "Hover/Click to learn safe touch guidelines.",
      backTitle: "Safe & Caring Touches",
      backDesc: "Safe touches make you feel protected, cared for, and good inside. Examples: A hug from mom/dad, high-fives from coach, holding hands with grandparents. They are never kept a secret.",
      icon: <CheckCircle className="w-8 h-8 text-glow-emerald" />,
      theme: "border-glow-emerald/30 shadow-emerald-glow/5"
    },
    {
      id: 2,
      frontTitle: "What is an Unsafe Touch?",
      frontDesc: "Hover/Click to identify signs of unsafe touch.",
      backTitle: "Unsafe or Confusing Touches",
      backDesc: "Touches that hurt you, make you feel scared, uncomfortable, or confused. Any touch on your private parts, or any touch that an adult asks you to keep a secret, is UNSAFE. It is never your fault.",
      icon: <Lock className="w-8 h-8 text-glow-pink" />,
      theme: "border-glow-pink/30 shadow-pink-glow/5"
    }
  ];

  return (
    <section id="education" className="py-24 relative overflow-hidden bg-navy-dark/40 border-b border-white/5">
      <div className="absolute right-0 bottom-10 w-96 h-96 bg-glow-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight mb-4">
            Body Safety & <span className="text-gradient-cyan-purple">My Boundaries</span>
          </h2>
          <p className="text-sm text-gray-400">
            Every child owns their body. Learn to recognize safe vs unsafe boundaries, and what to do if someone violates them.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Cards */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-sans font-bold text-xl text-white mb-6">Learn the Basic Rules</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {interactiveCards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => setFlippedCard(flippedCard === card.id ? null : card.id)}
                  className="h-64 cursor-pointer perspective"
                >
                  <div className={`relative w-full h-full duration-500 preserve-3d ${
                    flippedCard === card.id ? 'rotate-y-180' : ''
                  }`}>
                    
                    {/* CARD FRONT */}
                    <div className={`absolute inset-0 backface-hidden glass-panel rounded-3xl p-6 border ${card.theme} flex flex-col justify-between items-center text-center`}>
                      <div className="p-4 rounded-full bg-white/5 mb-4">
                        {card.icon}
                      </div>
                      <h4 className="font-sans font-bold text-lg text-white">{card.frontTitle}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mt-2">{card.frontDesc}</p>
                      <span className="text-[10px] text-glow-cyan font-semibold uppercase tracking-wider mt-4">Click to Flip</span>
                    </div>

                    {/* CARD BACK */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel-heavy rounded-3xl p-6 border border-white/10 flex flex-col justify-center items-center text-center bg-navy-light/95">
                      <h4 className="font-sans font-bold text-base text-glow-cyan mb-2">{card.backTitle}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">{card.backDesc}</p>
                      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-4">Click to Flip Back</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* General Advice Banner */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex gap-4 text-xs text-gray-300 items-center">
              <Info className="w-5 h-5 text-glow-cyan shrink-0 animate-bounce" />
              <p>
                <strong>Remember the 3 R's:</strong> <strong>Recognize</strong> the danger, <strong>Refuse</strong> (Say No/Stop!), and <strong>Report</strong> (Tell a trusted adult right away, or report here anonymously).
              </p>
            </div>
          </div>

          {/* Right Column: Touch Safety visualizer */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center">
            <div className="w-full max-w-[420px] glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden">
              
              <h3 className="font-sans font-bold text-lg text-white mb-6 text-center">Interactive Boundary Guide</h3>

              {/* Graphic body layout */}
              <div className="relative w-full aspect-[3/4] bg-navy-dark-light/50 border border-white/5 rounded-2xl flex items-center justify-center">
                
                {/* SVG Outline Representation of a Person */}
                <svg className="w-48 h-full stroke-gray-600 fill-transparent" viewBox="0 0 100 200">
                  {/* Head */}
                  <circle cx="50" cy="30" r="16" strokeWidth="2" />
                  {/* Body Torso */}
                  <path d="M 34 70 L 66 70 L 60 140 L 40 140 Z" strokeWidth="2" />
                  {/* Arms */}
                  <path d="M 34 70 L 20 120 M 66 70 L 80 120" strokeWidth="2" />
                  {/* Legs */}
                  <path d="M 42 140 L 35 190 M 58 140 L 65 190" strokeWidth="2" />
                </svg>

                {/* Hotspots overlay */}
                {/* 1. Head (Safe) */}
                <button 
                  onClick={() => setSelectedZone('head')}
                  className={`absolute top-[18%] left-[50%] -translate-x-1/2 w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedZone === 'head' 
                      ? 'bg-glow-emerald border-white shadow-emerald-glow scale-110' 
                      : 'border-glow-emerald hover:bg-glow-emerald/20'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white" />
                </button>

                {/* 2. Hands (Safe) */}
                <button 
                  onClick={() => setSelectedZone('hands')}
                  className={`absolute top-[48%] left-[24%] w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedZone === 'hands' 
                      ? 'bg-glow-emerald border-white shadow-emerald-glow scale-110' 
                      : 'border-glow-emerald hover:bg-glow-emerald/20'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white" />
                </button>

                {/* 3. Bathing Suit Zone (Unsafe) */}
                <button 
                  onClick={() => setSelectedZone('bathingSuit')}
                  className={`absolute top-[52%] left-[50%] -translate-x-1/2 w-10 h-10 rounded-full border-2 border-dashed transition-all flex items-center justify-center ${
                    selectedZone === 'bathingSuit' 
                      ? 'bg-glow-pink border-white shadow-pink-glow scale-110 animate-pulse' 
                      : 'border-glow-pink hover:bg-glow-pink/20 animate-pulse-slow'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </button>

              </div>

              {/* Explanatory Panel under the graphic */}
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 min-h-[110px] flex flex-col justify-center">
                {selectedZone ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm">{touchZones[selectedZone].title}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        touchZones[selectedZone].type === 'safe'
                          ? 'bg-glow-emerald/20 text-glow-emerald'
                          : 'bg-glow-pink/20 text-glow-pink'
                      }`}>
                        {touchZones[selectedZone].status}
                      </span>
                    </div>
                    <p className="leading-relaxed text-gray-400">{touchZones[selectedZone].description}</p>
                  </>
                ) : (
                  <p className="text-center text-gray-500">Click a flashing node to inspect body boundary rules.</p>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
