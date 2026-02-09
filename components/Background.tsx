
import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isIntro: boolean;
}

const Background: React.FC<BackgroundProps> = ({ isIntro }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const animate = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      if (isIntro) {
        // Subtle ambient effect can be added here
      }
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animate();
    return () => window.removeEventListener('resize', handleResize);
  }, [isIntro]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default Background;
