import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const stories = [
    {
      quote: "I was terrified that nobody would believe me. The chatbot gave me a safe, silent space to ask questions, and the reporter let me write down what happened without sharing my name. Within a day, a crisis officer met me at school. I am finally safe and back in school.",
      author: "Sarah",
      age: "14",
      status: "Safeguarded Client",
      glowColor: "rgba(0, 229, 255, 0.1)"
    },
    {
      quote: "The touch safety guides helped my little brother realize that the secrets he was asked to keep were wrong. He showed me the interactive boundary map on my phone. We filed the anonymous report together. Our lives have completely changed.",
      author: "Marcus",
      age: "16",
      status: "Protective Sibling",
      glowColor: "rgba(124, 58, 237, 0.1)"
    },
    {
      quote: "As a local youth advocate, managing emergency intakes was always chaotic. With SafeNest's unified routing system, coordinates and files land securely on our triage dashboard within 90 seconds. It has cut response times in half.",
      author: "Dr. Evelyn Vance",
      age: "Director",
      status: "Global Shield Advocate",
      glowColor: "rgba(16, 185, 129, 0.1)"
    }
  ];

  // Auto sliding carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [stories.length]);

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % stories.length);
  };

  return (
    <section id="stories" className="py-24 relative overflow-hidden bg-navy-dark/60 border-b border-white/5">
      {/* Lights */}
      <div className="absolute left-10 top-10 w-96 h-96 bg-glow-purple/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight mb-4">
            Echoes of <span className="text-gradient-cyan-purple">Safety & Hope</span>
          </h2>
          <p className="text-sm text-gray-400">
            Real testimonies from protected children, siblings, and partner agencies who broke the silence using our shield.
          </p>
        </div>

        {/* Carousel Slider Card */}
        <div className="relative">
          
          {/* Main Slide Card */}
          <div 
            className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col justify-between transition-all duration-700"
            style={{
              background: `linear-gradient(135deg, rgba(7, 17, 31, 0.7) 0%, ${stories[activeIndex].glowColor} 100%)`
            }}
          >
            {/* Quote watermark icon */}
            <Quote className="absolute right-8 top-8 w-24 h-24 text-white/5 pointer-events-none" />

            {/* Testimonial Quote */}
            <div className="space-y-6">
              <div className="flex gap-2">
                <MessageCircle className="w-5 h-5 text-glow-cyan" />
                <span className="text-xs uppercase font-mono tracking-widest text-glow-cyan font-bold">Verified Account</span>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-200 italic leading-relaxed font-serif">
                "{stories[activeIndex].quote}"
              </p>
            </div>

            {/* Author Profile */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/5">
              <div>
                <span className="font-bold text-white text-base block">{stories[activeIndex].author}</span>
                <span className="text-xs text-gray-400 mt-0.5 block">
                  {stories[activeIndex].age ? `${stories[activeIndex].age} years old | ` : ''} 
                  {stories[activeIndex].status}
                </span>
              </div>

              {/* Dots Indicators */}
              <div className="flex gap-1.5">
                {stories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === idx ? 'bg-glow-cyan w-6' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 hover:border-glow-cyan/40 bg-navy-dark/90 hover:bg-glow-cyan/5 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 hover:border-glow-cyan/40 bg-navy-dark/90 hover:bg-glow-cyan/5 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>
    </section>
  );
}
