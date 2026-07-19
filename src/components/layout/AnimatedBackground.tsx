import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;
    
    // Canvas sizing
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    
    window.addEventListener('resize', () => {
      setCanvasSize();
      init(); // Reinitialize particles on resize for even distribution
    });

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.5; // very small dots
        this.speedX = (Math.random() - 0.5) * 0.3; // very slow
        this.speedY = (Math.random() - 0.5) * 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges smoothly
        if (this.x > canvas!.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas!.height || this.y < 0) this.speedY = -this.speedY;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.5)'; // Gold tint
        ctx.fill();
      }
    }

    // Initialize
    const init = () => {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000); // Responsive density
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Connect lines
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            // Fading gold lines based on distance
            const opacity = 1 - (distance / 150);
            ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.2})`; 
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0a0c]">
      {/* Subtle radial gradient to center focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
