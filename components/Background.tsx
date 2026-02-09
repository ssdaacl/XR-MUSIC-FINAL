
import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isIntro: boolean;
}

const Background: React.FC<BackgroundProps> = ({ isIntro }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Particle Configuration - restored to the specific 10:16 AM behavior
    const particles: Particle[] = [];
    const particleCount = 65;

    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.15 + 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            this.x -= dx * 0.004;
            this.y -= dy * 0.004;
          }
        }

        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let tick = 0;
    const animate = () => {
      // Tick speed precisely matched to the liquid drift feel
      tick += 0.004;
      
      const driftX = Math.sin(tick * 0.7) * (width * 0.3);
      const driftY = Math.cos(tick * 0.5) * (height * 0.25);
      
      const autoX = width / 2 + driftX;
      const autoY = height / 2 + driftY;

      const targetX = mouseRef.current.active 
        ? (mouseRef.current.x * 0.4 + autoX * 0.6) 
        : autoX;
      const targetY = mouseRef.current.active 
        ? (mouseRef.current.y * 0.4 + autoY * 0.6)
        : autoY;

      if (isIntro) {
        // High-End Liquid Gradient with distinct luxury palette
        const gradient = ctx.createRadialGradient(
          targetX, targetY, 0, 
          width / 2, height / 2, width * 1.4
        );

        // More vibrant and distinct pastels as per the high-end 10:16 AM aesthetic
        gradient.addColorStop(0, '#ffffff'); // Center shine
        gradient.addColorStop(0.2, '#fffcf5'); // Warm Pearl
        gradient.addColorStop(0.45, '#ffeef2'); // Soft Peachy Pink
        gradient.addColorStop(0.75, '#eef6ff'); // Soft Airy Blue
        gradient.addColorStop(1, '#f5f3ff');   // Lavender edge
        
        ctx.fillStyle = gradient;
      } else {
        // Minimal stable off-white for the main archive view
        ctx.fillStyle = '#fcfcfc';
      }

      ctx.fillRect(0, 0, width, height);

      if (isIntro) {
        particles.forEach(p => {
          p.update();
          p.draw();
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY, 
          active: true 
        };
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchmove', handleTouch);
    
    initParticles();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isIntro]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
    />
  );
};

export default Background;
