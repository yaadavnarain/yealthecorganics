"use client";

import { useState } from "react";
import { Sprout, Salad, Coins, Zap, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Accent = "gold" | "mint";

interface Product {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: Accent;
}

const PRODUCTS: Product[] = [
  {
    icon: Sprout,
    title: "Your Farm",
    description:
      "You own it. We build it, operate it, and handle everything. You collect the income.",
    accent: "gold",
  },
  {
    icon: Salad,
    title: "Your Harvest",
    description:
      "Fresh produce delivered straight to your door. Every week. Clean, pure food from the farms.",
    accent: "mint",
  },
  {
    icon: Coins,
    title: "Your Income",
    description:
      "Monthly passive income deposited into your account. Your farm works so you do not have to.",
    accent: "gold",
  },
  {
    icon: Zap,
    title: "Your Hustle",
    description:
      "Need income right now? Earn while your farm grows. Flexible shifts and creative work, on your terms.",
    accent: "mint",
  },
];

function ProductCard({ icon: Icon, title, description, accent }: Product) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative h-full overflow-hidden rounded-yealth border bg-yealth-black/40 p-6 backdrop-blur-sm transition-all duration-300 md:p-7",
        "border-yealth-offwhite/10 hover:-translate-y-1",
        accent === "gold"
          ? "hover:border-yealth-gold/40 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.4)]"
          : "hover:border-yealth-mint/40 hover:shadow-[0_0_30px_-10px_rgba(45,212,191,0.4)]"
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${
            accent === "gold"
              ? "rgba(234,179,8,0.08)"
              : "rgba(45,212,191,0.08)"
          }, transparent 40%)`,
        }}
        aria-hidden
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          accent === "gold"
            ? "bg-gradient-to-br from-yealth-gold/[0.04] to-transparent"
            : "bg-gradient-to-br from-yealth-mint/[0.04] to-transparent"
        )}
        aria-hidden
      />

      <div
        className={cn(
          "relative inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110",
          accent === "gold"
            ? "border-yealth-gold/30 bg-yealth-gold/10 text-yealth-gold"
            : "border-yealth-mint/30 bg-yealth-mint/10 text-yealth-mint"
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>

      <h3
        className={cn(
          "relative mt-5 font-heading text-xl font-bold md:text-2xl",
          accent === "mint" ? "text-yealth-mint" : "text-yealth-offwhite"
        )}
      >
        {title}
      </h3>

      <p className="relative mt-3 font-body text-sm leading-relaxed text-yealth-offwhite/70 md:text-base">
        {description}
      </p>
    </div>
  );
}

export function ProductCardsSection() {
  return (
    <section className="section-pad mx-auto max-w-[1200px] px-6 md:px-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {PRODUCTS.map((product, i) => (
          <motion.div
            key={product.title}
            {...fadeUp(i * 0.08)}
            className="h-full"
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}