"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { FormField, FormTextarea } from "@/app/components/ui/form-field";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-yealth-black"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(245, 200, 66, 0.08) 0%, transparent 65%)",
        }}
      />

      <div className="section-pad relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-8">
        <motion.div {...fadeUp(0)} className="flex flex-col justify-center">
          <h2 className="font-heading text-[28px] font-bold text-yealth-gold md:text-[40px]">
            Ready to own a farm?
          </h2>
          <p className="mt-4 font-body text-base text-yealth-offwhite/85 md:text-lg">
            Drop your details and we will send you the next webinar link. Muktish hosts it personally.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            <li className="flex items-start gap-3 font-body text-sm text-yealth-offwhite/75 md:text-base">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yealth-gold" aria-hidden />
              <span>Takes 2 minutes to fill in. Free, no commitment.</span>
            </li>
            <li className="flex items-start gap-3 font-body text-sm text-yealth-offwhite/75 md:text-base">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-yealth-gold" aria-hidden />
              <span>Your details stay private. We never share, sell, or spam.</span>
            </li>
            <li className="flex items-start gap-3 font-body text-sm text-yealth-offwhite/75 md:text-base">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-yealth-gold" aria-hidden />
              <span>No follow-up calls unless you ask for one.</span>
            </li>
          </ul>
        </motion.div>

        <motion.form
          {...fadeUp(0.1)}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-yealth border border-yealth-offwhite/10 bg-yealth-black/40 p-6 backdrop-blur-sm md:p-8"
        >
          <FormField
            type="text"
            name="name"
            placeholder="Your full name"
            required
            aria-label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FormField
            type="tel"
            name="phone"
            placeholder="+230 5XXX XXXX"
            required
            aria-label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <FormTextarea
            name="comment"
            placeholder="Anything you would like us to know? (optional)"
            aria-label="Comment"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
          <button
            type="submit"
            disabled={sent}
            className="gold-cta mt-2 h-14 w-full rounded-yealth font-heading text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sent ? "Submitted — check your phone" : "Secure my spot"}
          </button>
          <p className="text-center font-body text-xs text-yealth-offwhite/50 md:text-sm">
            By submitting, you agree to our{" "}
            <a
              href="/terms"
              className="text-yealth-offwhite/70 underline decoration-yealth-offwhite/30 underline-offset-2 transition-colors hover:text-yealth-gold hover:decoration-yealth-gold/50"
            >
              Terms
            </a>
            {" "}and{" "}
            <a
              href="/privacy"
              className="text-yealth-offwhite/70 underline decoration-yealth-offwhite/30 underline-offset-2 transition-colors hover:text-yealth-gold hover:decoration-yealth-gold/50"
            >
              Privacy Policy
            </a>
            .
          </p>
        </motion.form>
      </div>
    </section>
  );
}