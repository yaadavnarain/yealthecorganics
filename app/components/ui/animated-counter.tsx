"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { useCountUp } from "@/lib/use-count-up";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 1800,
  prefix = "",
  suffix = "",
  formatter,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const value = useCountUp({ end, duration, enabled: inView });

  const displayValue = formatter
    ? formatter(value)
    : Math.floor(value).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}