import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Reporter from './components/Reporter';
import EmergencySOS from './components/EmergencySOS';
import Statistics from './components/Statistics';
import NGOConnections from './components/NGOConnections';
import Education from './components/Education';
import Testimonials from './components/Testimonials';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans bg-navy-dark overflow-x-hidden selection:bg-glow-cyan/30 selection:text-white">
      {/* Test message removed */}
      
      {/* Cinematic Grainy Noise Filter */}
      <div className="noise-overlay" />

      {/* Floating Animated Cursor Ambient Blob */}
      <div 
        className="cursor-blob hidden md:block"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`
        }}
      />

      {/* Global Page Layout */}
      <Navbar />

      <main className="relative z-10">
        
        {/* Landing Page Hero Grid & Particles */}
        <Hero />

        {/* Storytelling Timeline Scroll Reveals */}
        <Timeline />

        {/* Secure Multi-Step Anonymous Reporter Tabbed wizard */}
        <Reporter />

        {/* Emergency Pulsing SOS Button Radar Sweep */}
        <EmergencySOS />

        {/* Data Infographics Statistics Panel */}
        <Statistics />

        {/* Interactive NGO connection network map */}
        <NGOConnections />

        {/* Education Flip Cards & Boundary Guides */}
        <Education />

        {/* Stories Testimony Slideshow */}
        <Testimonials />

        {/* Interactive SafeNest Safety Chatbot section */}
        <Chatbot />

      </main>

      {/* Cinematic Helplines Footer */}
      <Footer />

    </div>
  );
}
