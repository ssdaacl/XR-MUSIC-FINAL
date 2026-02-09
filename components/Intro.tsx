
import React from 'react';

interface IntroProps {
  onEnter: () => void;
}

const Intro: React.FC<IntroProps> = ({ onEnter }) => {
  return (
    <div 
      onClick={onEnter}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
    >
      <div className="relative flex flex-col items-center select-none z-20">
        <div className="animate-text-reveal" style={{ animationDelay: '0.2s' }}>
          <h1 
            className="serif text-glow text-8xl md:text-[10rem] font-light tracking-tighter text-[#1A1A1A]"
          >
            XR Music
          </h1>
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <div 
            className="w-px bg-[#1A1A1A] animate-line-grow"
            style={{ animationDelay: '0.8s' }}
          ></div>
          <p 
            className="serif italic text-lg pt-6 opacity-0 animate-text-reveal uppercase tracking-[0.3em] text-[10px] group-hover:opacity-60 transition-opacity"
            style={{ animationDelay: '1.2s' }}
          >
            CLICK TO ENTER
          </p>
        </div>
      </div>

      {/* Decorative corners - subtle visual anchors */}
      <div className="absolute top-12 left-12 w-12 h-px bg-[#1A1A1A] opacity-10 transition-all duration-700 group-hover:w-24"></div>
      <div className="absolute top-12 left-12 h-12 w-px bg-[#1A1A1A] opacity-10 transition-all duration-700 group-hover:h-24"></div>
      <div className="absolute bottom-12 right-12 w-12 h-px bg-[#1A1A1A] opacity-10 transition-all duration-700 group-hover:w-24"></div>
      <div className="absolute bottom-12 right-12 h-12 w-px bg-[#1A1A1A] opacity-10 transition-all duration-700 group-hover:h-24"></div>
      
      {/* Soft overlay to ensure contrast if needed */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
    </div>
  );
};

export default Intro;
