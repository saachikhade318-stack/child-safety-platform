import React, { useEffect, useRef, useState } from 'react';
import { Shield, ArrowRight, Eye, ShieldCheck, Heart } from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [animatedStats, setAnimatedStats] = useState({ reports: 0, agencies: 0, children: 0 });

  // Typewriter effect states
  const [text, setText] = useState('');
  const fullText = "Every Child Deserves To Feel Safe.";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 90);
    return () => clearInterval(interval);
  }, []);

  // Stats incremental counter
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setAnimatedStats({
        reports: Math.min(Math.round((14200 / steps) * step), 14200),
        agencies: Math.min(Math.round((350 / steps) * step), 350),
        children: Math.min(Math.round((8900 / steps) * step), 8900)
      });

      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Particle Canvas logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Create particles
    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.5,
        color: i % 3 === 0 
          ? 'rgba(0, 229, 255, 0.4)' 
          : i % 3 === 1 
            ? 'rgba(124, 58, 237, 0.4)' 
            : 'rgba(255, 77, 141, 0.4)',
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        alpha: Math.random(),
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Keep inside screen bounds
        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

        // Opacity pulse animation
        p.alpha += p.pulseSpeed * p.direction;
        if (p.alpha > 0.8) p.direction = -1;
        if (p.alpha < 0.2) p.direction = 1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.4', p.alpha.toFixed(2));
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Track mouse coordinates for dynamic spotlight
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section 
      id="home" 
      onMouseMove={handleMouseMove} 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden"
    >
      {/* Background Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Aurora spotlight gradient mesh */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-300 z-0 opacity-40"
        style={{
          background: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 229, 255, 0.12), transparent 80%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Text Area */}
        <div className="lg:col-span-7 text-left flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-glow-cyan/20 w-fit mb-6 animate-pulse-slow">
            <Heart className="w-4 h-4 text-glow-pink fill-glow-pink" />
            <span className="text-xs font-semibold tracking-widest text-glow-cyan uppercase">
              Secure, Encrypted & Anonymous
            </span>
          </div>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none mb-6">
            <span className="block text-white">
              {text}
              <span className="animate-pulse text-glow-cyan ml-1">|</span>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed mb-8">
            Anonymous reporting, awareness, and rapid support — empowering children to break the silence safely. Your security and anonymity are guaranteed by military-grade privacy standards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a 
              href="#reporter" 
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-purple text-navy-dark font-extrabold text-base tracking-wider hover:opacity-90 hover:shadow-cyan-glow/40 transition-all transform hover:-translate-y-0.5 duration-300"
            >
              Report Anonymously
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#education" 
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-glow-cyan/40 bg-white/5 hover:bg-glow-cyan/5 text-white font-bold text-base tracking-wider transition-all transform hover:-translate-y-0.5 duration-300"
            >
              Learn About Safety
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
            <div>
              <p className="text-3xl font-extrabold font-sans text-glow-cyan">
                {animatedStats.reports.toLocaleString()}+
              </p>
              <p className="text-xs uppercase font-medium tracking-widest text-gray-400 mt-1">
                Encrypted Reports
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-sans text-glow-purple">
                {animatedStats.agencies}+
              </p>
              <p className="text-xs uppercase font-medium tracking-widest text-gray-400 mt-1">
                NGO Partners
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-sans text-glow-pink">
                {animatedStats.children.toLocaleString()}+
              </p>
              <p className="text-xs uppercase font-medium tracking-widest text-gray-400 mt-1">
                Protected Lives
              </p>
            </div>
          </div>
        </div>

        {/* Cinematic Illustration Shield Widget */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 group">
            
            {/* Background glowing rings */}
            <div className="absolute inset-0 rounded-full border border-glow-cyan/20 scale-110 animate-pulse-slow"></div>
            <div className="absolute inset-0 rounded-full border border-glow-purple/20 scale-125 animate-ping opacity-20"></div>
            
            {/* Floating Glassmorphism Main Card */}
            <div className="absolute inset-0 rounded-3xl glass-panel flex flex-col items-center justify-center p-8 border border-white/10 shadow-purple-glow/10 group-hover:scale-[1.02] group-hover:border-glow-cyan/30 transition-all duration-500">
              
              {/* Shield container */}
              <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-glow-cyan to-glow-purple rounded-full opacity-10 blur-xl group-hover:opacity-35 transition-opacity"></div>
                <div className="absolute inset-0 border border-dashed border-glow-cyan/30 rounded-full animate-[spin_40s_linear_infinite]"></div>
                
                {/* Shield Core */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-glow-cyan/20 to-glow-purple/20 flex items-center justify-center border border-glow-cyan/40 shadow-cyan-glow/20">
                  <ShieldCheck className="w-12 h-12 text-glow-cyan animate-pulse" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-sans font-bold text-xl text-white mb-2">Shield Protocol Active</h3>
                <p className="text-xs text-gray-400 max-w-[240px] mx-auto leading-relaxed">
                  Cryptographic packet shielding hides your IP address, device footprint, and geolocation details instantly.
                </p>
              </div>

              {/* Secure Token badge */}
              <div className="absolute bottom-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-glow-emerald/10 border border-glow-emerald/30 text-glow-emerald text-[10px] font-mono uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-glow-emerald rounded-full animate-ping"></div>
                Zero-knowledge Proof
              </div>
            </div>

            {/* Float Cards (Decorative micro interactions) */}
            <div className="absolute -top-6 -right-6 glass-panel rounded-2xl p-4 border border-glow-pink/30 flex items-center gap-3 shadow-pink-glow/10 animate-float-slow">
              <div className="w-8 h-8 rounded-lg bg-glow-pink/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-glow-pink" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Identity Mode</p>
                <p className="text-xs font-bold text-white">Totally Blind</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 glass-panel rounded-2xl p-4 border border-glow-cyan/30 flex items-center gap-3 shadow-cyan-glow/10 animate-float-medium">
              <div className="w-8 h-8 rounded-lg bg-glow-cyan/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-glow-cyan" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Response Speed</p>
                <p className="text-xs font-bold text-white">Under 90 Sec</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
