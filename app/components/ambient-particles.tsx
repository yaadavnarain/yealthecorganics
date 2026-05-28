"use client";

import { useEffect, useRef } from "react";

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    setSize();

    const isMobile = width < 768;
    const PARTICLE_COUNT = isMobile ? 20 : 45;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      driftX: number;
      opacity: number;
      maxOpacity: number;
      phase: "fadeIn" | "drift" | "fadeOut";
    }

    const makeParticle = (atRandomY = false): Particle => ({
      x: Math.random() * width,
      y: atRandomY ? Math.random() * height : height + Math.random() * 50,
      size: 0.8 + Math.random() * 1.8,
      speedY: 0.15 + Math.random() * 0.35,
      driftX: (Math.random() - 0.5) * 0.15,
      opacity: atRandomY ? Math.random() * 0.4 : 0,
      maxOpacity: 0.25 + Math.random() * 0.35,
      phase: atRandomY ? "drift" : "fadeIn",
    });

    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      () => makeParticle(true)
    );

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.driftX;

        if (p.phase === "fadeIn") {
          p.opacity = Math.min(p.opacity + 0.004, p.maxOpacity);
          if (p.opacity >= p.maxOpacity) p.phase = "drift";
        } else if (p.phase === "drift") {
          if (p.y < height * 0.35) p.phase = "fadeOut";
        } else if (p.phase === "fadeOut") {
          p.opacity = Math.max(p.opacity - 0.004, 0);
        }

        if (p.opacity <= 0 || p.y < -10) {
          particles[i] = makeParticle(false);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 200, 66, ${p.opacity * 0.15})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 200, 66, ${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("resize", setSize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[5]"
      aria-hidden
    />
  );
}