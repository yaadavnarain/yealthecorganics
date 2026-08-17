"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Calculator", href: "/calculator" },
  // TEMP-HIDE-SOLAR-CALC — nav link removed; page still live at /pvcalculatoroffgrid
  // { label: "Solar Calculator", href: "/pvcalculatoroffgrid" },
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

  // Tapping a link in the mobile menu closes it AND fires the browser's own
  // fragment navigation in the same tick — but the scroll lock above is only
  // lifted by the effect cleanup, which runs after React re-renders. So the
  // native scroll is attempted while the viewport is still locked, and lands
  // wrong or not at all.
  //
  // Close first, then scroll on the second frame, once the overlay has
  // unmounted and the lock is gone. `block: "start"` honours the
  // scroll-margin-top set in globals.css, and `behavior` is deliberately left
  // out so the CSS decides — which keeps prefers-reduced-motion's instant jump.
  //
  // Only the mobile menu uses this. The desktop links are a separate list and
  // stay plain anchors, since nothing ever locks scrolling there.
  const handleMenuNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setMenuOpen(false);
    const id = href.split("#")[1];
    // No fragment (e.g. /calculator) — let it navigate normally.
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: "start" });
        window.history.replaceState(null, "", href);
      }),
    );
  };

  return (
    <header
      id="top"
      className={cn(
        // top is driven by --announce-h, which AnnouncementBar publishes as its
        // own measured height. The bar sits in normal flow at the top of the
        // page; this header is fixed, so without the offset it would cover the
        // bar as soon as the page scrolls. Falls back to 0px when the bar is
        // absent or dismissed.
        "fixed left-0 right-0 top-[var(--announce-h,0px)] z-50 transition-all duration-300",
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
            href="https://join.yealth.mu/securemyspot"
            target="_blank"
            rel="noopener noreferrer"
            className="gold-cta inline-flex items-center gap-2 rounded-yealth px-5 py-2.5 font-heading text-sm"
          >
            Apply Now
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
                  onClick={(e) => handleMenuNav(e, link.href)}
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
                href="https://join.yealth.mu/securemyspot"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="gold-cta inline-flex w-fit items-center gap-2 rounded-yealth px-6 py-3 font-heading text-base"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
