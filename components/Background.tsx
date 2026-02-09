
import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isIntro: boolean;
}

const Background: React.FC<BackgroundProps> = ({ isIntro }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Particle Configuration
    const particles: Particle[] = [];
    const particleCount = 70;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      baseX: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 1.2 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.2 + 0.05;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse avoidance logic (for Intro)
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            this.x -= dx / 50;
            this.y -= dy / 50;
          }
        }

        // Wrap around
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

    const init = () => {
      particles.length = 0;
      if (isIntro) {
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
      }
    };

    let tick = 0;
    const animate = () => {
      tick += 0.005;
      
      // Background gradient
      let gradX = width / 2;
      let gradY = height / 2;

      if (isIntro) {
        if (mouseRef.current.active) {
          // Smooth follow mouse
          gradX += (mouseRef.current.x - width / 2) * 0.1;
          gradY += (mouseRef.current.y - height / 2) * 0.1;
        } else {
          // Ambient float
          gradX += Math.sin(tick) * 150;
          gradY += Math.cos(tick * 0.8) * 100;
        }

        const gradient = ctx.createRadialGradient(
          gradX, gradY, 0, 
          width / 2, height / 2, width * 0.8
        );
        
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.4, '#f7f6f4');
        gradient.addColorStop(1, '#ebeae7');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw particles ONLY on Intro
        particles.forEach(p => {
          p.update();
          p.draw();
        });
      } else {
        // Simple clean background for main grid
        ctx.fillStyle = '#fcfcfc';
        ctx.fillRect(0, 0, width, height);
      }

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
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
    window.addEventListener('touchmove', handleTouchMove);
    
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
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
