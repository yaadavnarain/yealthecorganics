import { cn } from "@/lib/utils";

// Decorative section glow. Usage rules:
// - parent section must be `relative overflow-hidden` so the oversized glow
//   never shows an edge on screen
// - size/position via className; default fills 150% of the parent
// - gold = money sections (hero, contact, final CTA);
//   teal = growth sections (how it works, vision, founder)
const GRADIENTS = {
  gold: "radial-gradient(circle, rgba(245,200,66,0.10) 0%, rgba(245,200,66,0.05) 35%, rgba(245,200,66,0.02) 55%, rgba(245,200,66,0) 72%)",
  teal: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, rgba(52,211,153,0.035) 35%, rgba(52,211,153,0.014) 55%, rgba(52,211,153,0) 72%)",
} as const;

export function Glow({
  variant = "gold",
  className,
}: {
  variant?: "gold" | "teal";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute",
        !className?.includes("inset") && "-inset-[25%]",
        className
      )}
      style={{
        background: GRADIENTS[variant],
        filter: "blur(48px)",
      }}
    />
  );
}
