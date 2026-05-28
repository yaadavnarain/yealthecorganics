"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FloatingCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledPastHero = window.scrollY > window.innerHeight * 0.8;

      const contactSection = document.getElementById("contact");
      let nearContact = false;
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        nearContact = rect.top < window.innerHeight && rect.bottom > 0;
      }

      setVisible(scrolledPastHero && !nearContact);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8"
        >
          <a
            href="#contact"
            className="gold-cta inline-flex items-center gap-2 rounded-yealth px-5 py-3 font-heading text-sm font-bold shadow-2xl shadow-yealth-gold/30 transition-transform hover:scale-105 md:px-6 md:py-3.5 md:text-base"
          >
            Secure my spot
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}