"use client";

import { useState } from "react";
import {
  Salad,
  Briefcase,
  Video,
  Handshake,
  Rocket,
  Compass,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Accent = "gold" | "mint";

interface Product {
  icon: LucideIcon;
  title: string;
  /** Omitted on the "coming soon" card, which is title-only and muted. */
  description?: string;
  accent: Accent;
  muted?: boolean;
}

const PRODUCTS: Product[] = [
  {
    icon: Salad,
    title: "Weekly Salads",
    description:
      "Fresh ready-to-eat salads delivered to your door every week.",
    accent: "gold",
  },
  {
    icon: Briefcase,
    title: "Freelancer Program",
    description: "Paid work outside the 9 to 5.",
    accent: "mint",
  },
  {
    icon: Video,
    title: "Content Creator Program",
    description: "Get paid to create, faceless content allowed.",
    accent: "gold",
  },
  {
    icon: Handshake,
    title: "Partnership Program",
    description: "Get your product or service in front of our audience.",
    accent: "mint",
  },
  {
    icon: Rocket,
    title: "Business Incubator",
    description:
      "Funding, training and market access to build your own business.",
    accent: "gold",
  },
  {
    icon: Compass,
    title: "Career Guidance",
    description: "Know which careers are growing, and which one is yours.",
    accent: "mint",
  },
  {
    icon: Sparkles,
    title: "More programs coming soon",
    accent: "gold",
    muted: true,
  },
];

function ProductCard({ icon: Icon, title, description, accent, muted }: Product) {
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
        muted && "opacity-60",
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
              ? "rgba(234,179,8,0.08) 0%, rgba(234,179,8,0.04) 15%, rgba(234,179,8,0.015) 28%"
              : "rgba(45,212,191,0.08) 0%, rgba(45,212,191,0.04) 15%, rgba(45,212,191,0.015) 28%"
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

      {description ? (
        <p className="relative mt-3 font-body text-sm leading-relaxed text-yealth-offwhite/70 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ProductCardsSection() {
  return (
    <section className="section-pad mx-auto max-w-[1200px] px-6 md:px-8">
      <motion.h2
        {...fadeUp(0)}
        className="mb-10 font-heading text-[26px] font-bold text-yealth-offwhite md:mb-14 md:text-[36px]"
      >
        What your <span className="text-yealth-gold">membership</span> gives you
      </motion.h2>
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