"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Calculator", href: "/calculator" },
  { label: "FAQ", href: "/#faq" },
];

function MauritiusFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 12"
      width="18"
      height="12"
      className={className}
      aria-hidden
    >
      <clipPath id="mu-flag-round">
        <rect width="18" height="12" rx="2" />
      </clipPath>
      <g clipPath="url(#mu-flag-round)">
        <rect width="18" height="3" y="0" fill="#EA2839" />
        <rect width="18" height="3" y="3" fill="#1A206D" />
        <rect width="18" height="3" y="6" fill="#FFD500" />
        <rect width="18" height="3" y="9" fill="#00A551" />
      </g>
    </svg>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <a href="/" className={cn("inline-flex items-center", className)}>
      <Image
        src="/images/yealth-mark.png"
        alt="yealth"
        width={683}
        height={336}
        priority
        className="h-8 w-auto"
      />
    </a>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the mobile menu is open; restore on close.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header
      id="top"
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-yealth-black/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:px-8 md:py-5">
        <Logo />

        <div className="hidden items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-base text-yealth-offwhite/80 transition-colors duration-200 ease-out hover:text-yealth-mint active:text-yealth-mint"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center justify-end gap-4 md:flex">
          <span className="inline-flex items-center gap-2 rounded-yealth border border-white/10 bg-white/[0.04] px-4 py-2 font-body text-sm text-yealth-offwhite">
            <MauritiusFlag />
            Mauritius
          </span>
          <a
            href="https://tally.so/r/2EDOEV"
            target="_blank"
            rel="noopener noreferrer"
            className="gold-cta inline-flex items-center gap-2 rounded-yealth px-5 py-2.5 font-heading text-sm"
          >
            Secure my spot
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="col-start-3 grid h-10 w-10 place-items-center justify-self-end text-yealth-offwhite md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] min-h-[100svh] bg-yealth-black md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center text-yealth-offwhite"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-8 px-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-heading text-2xl font-bold text-yealth-offwhite"
                >
                  {link.label}
                </a>
              ))}
              <span className="inline-flex w-fit items-center gap-2 rounded-yealth border border-white/10 px-4 py-2 font-body text-base text-yealth-offwhite">
                <MauritiusFlag />
                Mauritius
              </span>
              <a
                href="https://tally.so/r/2EDOEV"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="gold-cta inline-flex w-fit items-center gap-2 rounded-yealth px-6 py-3 font-heading text-base"
              >
                Secure my spot
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
