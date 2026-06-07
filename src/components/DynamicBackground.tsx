import React, { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  theme: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
  isDay: boolean;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ theme, isDay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definitions
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      angle?: number;
      speed?: number;
    }

    let particles: Particle[] = [];
    const maxParticles = 60;

    // Initialize particles based on theme
    const initParticles = () => {
      particles = [];
      const count = theme === 'stormy' || theme === 'rainy' ? 100 : maxParticles;
      for (let i = 0; i < count; i++) {
        if (theme === 'snowy') {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.5 + 1.0,
            radius: Math.random() * 3.5 + 1.5,
            alpha: Math.random() * 0.7 + 0.3,
            angle: Math.random() * Math.PI * 2,
          });
        } else if (theme === 'rainy' || theme === 'stormy') {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * -height,
            vx: -1.5,
            vy: Math.random() * 8 + 12,
            radius: Math.random() * 1.5 + 1.0, // Used as length multiplier
            alpha: Math.random() * 0.4 + 0.2,
          });
        } else if (theme === 'cloudy' || theme === 'foggy') {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.random() * 0.2 + 0.05,
            vy: (Math.random() - 0.5) * 0.05,
            radius: Math.random() * 60 + 50,
            alpha: Math.random() * 0.08 + 0.02,
          });
        } else {
          // Sunny / default
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 4 + 2,
            alpha: Math.random() * 0.2 + 0.05,
          });
        }
      }
    };

    initParticles();

    // Thunder variables for stormy
    let flashOpacity = 0;
    let nextFlash = Date.now() + Math.random() * 6000 + 4000;

    // Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Render specific particle behaviors
      if (theme === 'snowy') {
        ctx.fillStyle = '#ffffff';
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();

          // Swaying & gravity movement
          if (p.angle !== undefined) {
            p.angle += 0.01;
            p.x += Math.sin(p.angle) * 0.25 + p.vx;
          } else {
            p.x += p.vx;
          }
          p.y += p.vy;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
        });
      } else if (theme === 'rainy' || theme === 'stormy') {
        ctx.strokeStyle = isDay ? 'rgba(156, 163, 175, 0.4)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx, p.y + p.vy);
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.alpha})`;
          ctx.stroke();

          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height) {
            p.y = Math.random() * -100;
            p.x = Math.random() * width;
          }
        });

        // Storm flashing simulation
        if (theme === 'stormy') {
          if (Date.now() > nextFlash) {
            flashOpacity = Math.random() * 0.35 + 0.1;
            nextFlash = Date.now() + Math.random() * 8000 + 4000;
          }
          if (flashOpacity > 0) {
            ctx.fillStyle = `rgba(224, 242, 254, ${flashOpacity})`;
            ctx.fillRect(0, 0, width, height);
            flashOpacity -= 0.015;
          }
        }
      } else if (theme === 'cloudy' || theme === 'foggy') {
        particles.forEach((p) => {
          const cloudGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          const color = isDay ? '255, 255, 255' : '100, 116, 139';
          cloudGlow.addColorStop(0, `rgba(${color}, ${p.alpha})`);
          cloudGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = cloudGlow;
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x - p.radius > width) {
            p.x = -p.radius;
            p.y = Math.random() * height;
          }
        });
      } else {
        // Clear/Sunny environment: ambient gold/cyan floating dust or sun flare
        ctx.fillStyle = isDay ? 'rgba(251, 191, 36, 0.4)' : 'rgba(224, 242, 254, 0.3)';
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDay 
            ? `rgba(251, 191, 36, ${p.alpha * (Math.sin(Date.now() / 1000 + p.x) * 0.5 + 0.5)})`
            : `rgba(255, 255, 255, ${p.alpha * (Math.sin(Date.now() / 1500 + p.x) * 0.3 + 0.7)})`;
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height) p.y = 0;
          if (p.y < 0) p.y = height;
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
        });

        // Sunlight source flare in top-right
        if (theme === 'sunny' && isDay) {
          const sunGlow = ctx.createRadialGradient(width - 50, 50, 0, width - 50, 50, 200);
          sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
          sunGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.05)');
          sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = sunGlow;
          ctx.fillRect(0, 0, width, height);
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isDay]);

  return <canvas ref={canvasRef} className="ambient-background" />;
};
