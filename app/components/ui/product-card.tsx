import type { LucideIcon } from "lucide-react";

export function ProductCard({
  icon: Icon,
  title,
  description,
  accent = "gold",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: "gold" | "mint";
}) {
  const iconColor = accent === "mint" ? "text-yealth-mint" : "text-yealth-gold";
  const titleColor = accent === "mint" ? "text-yealth-mint" : "text-yealth-offwhite";

  return (
    <div className="glass-card flex min-h-[220px] flex-col rounded-yealth p-6 transition-colors duration-300 hover:border-yealth-gold/25 md:min-h-[240px]">
      <Icon className={`h-8 w-8 ${iconColor}`} strokeWidth={1.75} aria-hidden />
      <h3 className={`mt-6 font-heading text-[22px] font-bold md:text-[28px] ${titleColor}`}>
        {title}
      </h3>
      <p className="mt-3 font-body text-base leading-relaxed text-yealth-grey">
        {description}
      </p>
    </div>
  );
}
