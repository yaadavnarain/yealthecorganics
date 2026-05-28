"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

const FAQ_ITEMS = [
  {
    id: "is-this-real",
    question: "Is this real?",
    answer:
      "Yes. Yealth is a registered Mauritian farming business already operating with over 4,000 people backing it and Rs 16M+ raised. Real farms, real produce, real income. The founder, Muktish, is publicly accountable — you will meet him on the live session before you decide anything.",
  },
  {
    id: "secure-cost",
    question: "Does it cost anything to secure my spot?",
    answer:
      "No. Securing your spot is completely free. You are simply reserving a place in the next live session where the full opportunity is explained. There is no payment required to fill the form, and no obligation to proceed afterward.",
  },
  {
    id: "after-form",
    question: "What happens after I fill in the form?",
    answer:
      "Within 24 hours, you will receive a confirmation message with the date and link to the next live webinar. Muktish hosts these personally — you will see the business, ask any questions, and only then decide if it is for you.",
  },
  {
    id: "experience",
    question: "Do I need farming experience?",
    answer:
      "Not at all. The whole point is that you own the farm — we operate it. You do not lift a tool, plant a seed, or learn agriculture. Our team handles everything end to end. You receive the monthly returns from your asset.",
  },
  {
    id: "change-mind",
    question: "Can I change my mind?",
    answer:
      "Of course. Even after the live session, there is zero pressure. You can walk away with no follow-ups, no hard feelings. We only want people who genuinely want in.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="section-pad mx-auto max-w-[800px] px-6 md:px-8"
    >
      <motion.h2
        {...fadeUp(0)}
        className="mb-10 text-center font-heading text-[26px] font-bold text-yealth-offwhite md:mb-16 md:text-[36px]"
      >
        Quick FAQ
      </motion.h2>
      <motion.div {...fadeUp(0.1)}>
        <Accordion
          type="multiple"
          defaultValue={["is-this-real", "secure-cost"]}
          className="flex flex-col gap-4"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}