import React, { useState } from 'react';
import { ShieldAlert, Compass, Navigation, Radio, HeartPulse, RefreshCw } from 'lucide-react';
import { triggerSOS } from '../api';

export default function EmergencySOS() {
  const [sosState, setSosState] = useState('idle'); // 'idle', 'broadcasting', 'complete'
  const [progress, setProgress] = useState(0);
  const [sosResponse, setSosResponse] = useState(null);
  const [mockCoords, setMockCoords] = useState(null);

  const startSOSBroadcast = () => {
    setSosState('broadcasting');
    setProgress(0);
    setSosResponse(null);

    // Get browser geo-location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMockCoords(coords);
          postSOS(coords.lat, coords.lng);
        },
        () => {
          // Fallback coords
          const coords = { lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.0060 + (Math.random() - 0.5) * 0.1 };
          setMockCoords(coords);
          postSOS(coords.lat, coords.lng);
        }
      );
    } else {
      const coords = { lat: 40.7128, lng: -74.0060 };
      setMockCoords(coords);
      postSOS(coords.lat, coords.lng);
    }
  };

  const postSOS = async (lat, lng) => {
    try {
      const data = await triggerSOS(lat, lng);
      setSosResponse(data);

      // Simulate a countdown/radar loading sequence
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setSosState('complete');
        }
      }, 600);

    } catch (err) {
      console.error(err);
      setSosState('idle');
      alert('Failed to transmit SOS safely. Please call national helplines immediately!');
    }
  };

  return (
    <section id="emergency" className="py-24 relative overflow-hidden bg-gradient-to-b from-navy-dark to-navy-dark-light border-b border-white/5">
      {/* Radar scanning background */}
      {sosState === 'broadcasting' && (
        <div className="absolute inset-0 z-0 bg-glow-pink/5 flex items-center justify-center">
          <div className="absolute w-[200px] h-[200px] rounded-full border-2 border-glow-pink/30 animate-radar-glow"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full border-2 border-glow-pink/20 animate-radar-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-[600px] h-[600px] rounded-full border-2 border-glow-pink/10 animate-radar-glow" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-12">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Instant <span className="text-glow-pink">SOS Broadcast</span>
          </h2>
          <p className="text-sm text-gray-400">
            For use only in critical, urgent danger. Clicking this logs your approximate coordinates, triggers defensive protocols, and alerts local responders immediately.
          </p>
        </div>

        {/* SOS Pulse Button */}
        <div className="flex justify-center">
          {sosState === 'idle' && (
            <button
              onClick={startSOSBroadcast}
              className="relative w-52 h-52 rounded-full bg-gradient-to-tr from-glow-pink to-red-600 flex flex-col items-center justify-center text-navy-dark hover:text-white border-4 border-navy-dark shadow-pink-glow transition-all hover:scale-105 duration-300 group cursor-pointer"
            >
              {/* Outer pulsing ring */}
              <div className="absolute -inset-4 rounded-full border border-glow-pink/30 animate-pulse"></div>
              <ShieldAlert className="w-16 h-16 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-sans font-black text-xl tracking-widest uppercase">TRIGGER SOS</span>
              <span className="text-[10px] opacity-70 mt-1 uppercase font-semibold">1-Click Dispatch</span>
            </button>
          )}

          {sosState === 'broadcasting' && (
            <div className="relative w-52 h-52 rounded-full bg-navy-card border-4 border-glow-pink flex flex-col items-center justify-center text-glow-pink shadow-pink-glow/20">
              <Radio className="w-16 h-16 mb-2 animate-ping" />
              <span className="font-sans font-black text-lg tracking-wider uppercase">BROADCASTING</span>
              <span className="text-[10px] text-gray-400 mt-1 font-mono">{progress}% Securing...</span>
            </div>
          )}

          {sosState === 'complete' && sosResponse && (
            <div className="relative w-52 h-52 rounded-full bg-glow-emerald/10 border-4 border-glow-emerald flex flex-col items-center justify-center text-glow-emerald shadow-emerald-glow">
              <HeartPulse className="w-16 h-16 mb-2 animate-pulse" />
              <span className="font-sans font-black text-lg tracking-wider uppercase text-white">DISPATCHED</span>
              <span className="text-[10px] text-gray-300 mt-1 font-semibold uppercase tracking-widest">Grid Secured</span>
            </div>
          )}
        </div>

        {/* Action / Output log panel */}
        {sosState === 'broadcasting' && (
          <div className="max-w-md mx-auto glass-panel p-6 rounded-2xl border border-glow-pink/30 animate-pulse">
            <div className="flex items-center justify-center gap-2 text-xs text-glow-pink font-bold uppercase tracking-wider mb-2">
              <Navigation className="w-4 h-4" />
              GPS Coordinate Lock: 
            </div>
            <p className="text-sm font-mono text-white">
              Lat: {mockCoords?.lat.toFixed(4) || 'Locking...'}, Lng: {mockCoords?.lng.toFixed(4) || 'Locking...'}
            </p>
          </div>
        )}

        {sosState === 'complete' && sosResponse && (
          <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-glow-emerald/30 text-left space-y-6 animate-[fadeIn_0.5s_ease-out]">
            
            {/* Headers */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h4 className="font-bold text-white text-base">Crisis Alert Signal Active</h4>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">Alert ID: {sosResponse.sosId}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-glow-emerald/15 border border-glow-emerald/30 text-glow-emerald text-xs font-bold font-mono">
                <Compass className="w-3.5 h-3.5 animate-spin" />
                {sosResponse.dispatchUnitsCount} Units Dispatched
              </div>
            </div>

            {/* Simulated actions */}
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p className="font-bold text-white">Crisis Action Plan Initiated:</p>
              <ul className="list-disc pl-5 space-y-2.5">
                {sosResponse.actionPlan.map((action, idx) => (
                  <li key={idx} className="text-xs">{action}</li>
                ))}
              </ul>
            </div>

            {/* Back button */}
            <div className="text-center pt-2">
              <button
                onClick={() => setSosState('idle')}
                className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-glow-cyan/40 bg-white/5 hover:bg-glow-cyan/5 text-xs text-white font-bold transition-all"
              >
                Reset SOS Panel
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
