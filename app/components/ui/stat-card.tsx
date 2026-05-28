import type { ReactNode } from "react";

export function StatCard({
  value,
  label,
}: {
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="glass-card flex flex-col gap-2 rounded-yealth px-6 py-6 transition-colors duration-300 hover:border-yealth-gold/25">
      <p className="font-heading text-[28px] font-bold leading-none text-yealth-gold md:text-[32px]">
        {value}
      </p>
      <p className="font-body text-base text-yealth-offwhite">{label}</p>
    </div>
  );
}
