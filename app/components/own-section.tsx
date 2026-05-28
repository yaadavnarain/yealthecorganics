"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";

export function OwnSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCursorPos({ x, y });
  };

  const tiltX = (cursorPos.y - 0.5) * -4;
  const tiltY = (cursorPos.x - 0.5) * 4;
  const targetScale = isHovered ? 1.03 : 1;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-yealth-black"
    >
      {/* The OWN image as the section's full-bleed background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        animate={{
          scale: targetScale,
          rotateX: tiltX,
          rotateY: tiltY,
        }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          opacity: { duration: 1.4, ease: "easeOut" },
          scale: { type: "spring", stiffness: 100, damping: 18 },
          rotateX: { type: "spring", stiffness: 100, damping: 18 },
          rotateY: { type: "spring", stiffness: 100, damping: 18 },
        }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/own-hero.png')",
          transformStyle: "preserve-3d",
        }}
        aria-hidden
      />

      {/* Horizontal edge mask to blend left and right edges into black */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,10,1) 0%, transparent 15%, transparent 85%, rgba(10,10,10,1) 100%)",
        }}
      />

      {/* Cursor-tracking gold spotlight that adds extra glow where you look */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        animate={{
          background: `radial-gradient(ellipse 40% 50% at ${cursorPos.x * 100}% ${cursorPos.y * 100}%, rgba(245, 200, 66, 0.18) 0%, transparent 55%)`,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
      />

      {/* Film grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Multi-stop vertical fade: solid yealth-black at edges, image visible in the middle */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0.4) 12%, rgba(10,10,10,0.08) 50%, rgba(10,10,10,0.4) 88%, rgba(10,10,10,1) 100%)",
        }}
      />

      {/* Content: subhead positioned at the bottom of the section */}
      <div className="relative z-10 flex min-h-[58vh] flex-col items-center justify-end px-6 pb-20 md:min-h-[64vh] md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          className="font-heading text-base font-bold uppercase tracking-[0.3em] text-yealth-offwhite md:text-xl"
          style={{
            textShadow:
              "0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.7)",
          }}
        >
          Stop renting your future.
        </motion.p>
      </div>
    </section>
  );
}