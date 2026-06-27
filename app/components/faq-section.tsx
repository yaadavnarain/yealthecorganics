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
      "Yes. The farms, the produce, and the team are real, and the founder shows his face and name publicly. Right now you are reserving a place, not paying or signing anything. You will meet Muktish on the live session and see every detail before you decide.",
  },
  {
    id: "monthly-contribution",
    question: "What does my monthly contribution get me?",
    answer:
      "Your contribution makes you a co-owner of the farms, alongside other young Mauritians. The full detail of how ownership works, what you contribute, and how earnings are shared is explained step by step at the live session, where you can ask anything before deciding.",
  },
  {
    id: "salad-subscription",
    question: "Is the salad subscription required?",
    answer:
      "Yes. Co-ownership comes with a salad subscription, fresh ready-to-eat salads delivered to your door each week. It is part of how membership works, and the reasons are explained fully at the session.",
  },
  {
    id: "income-guaranteed",
    question: "Is my income guaranteed?",
    answer:
      "No. We are turning young people into agribusiness owners, and like any real business, income is not guaranteed. It depends on how the farms perform. Anyone who promises you guaranteed income is not being honest. We show you exactly how it works, the upside and the risks, at the session, so you can decide with full information.",
  },
  {
    id: "start-earning",
    question: "When would I start earning?",
    answer:
      "Earnings begin once the farms are producing and generating a surplus. The timeline, and what has to happen first, is walked through in full at the live session.",
  },
  {
    id: "money-back",
    question: "Can I get my money back?",
    answer:
      "Contributions are not refundable. As a co-owner you hold shares, and you may sell your shares to another buyer if you choose to exit. This is real ownership, so it works like owning a stake in a business, not like a savings account. All of this is in the agreement you review before you join.",
  },
  {
    id: "pause-contributions",
    question: "Can I pause my contributions?",
    answer:
      "There is some flexibility, with conditions, and the salad subscription continues while you are a member. The exact rules on pausing, missed payments, and what happens if you stop are laid out clearly in the agreement before you commit to anything.",
  },
  {
    id: "pyramid-scheme",
    question: "Is this a pyramid or a get-rich-quick scheme?",
    answer:
      "No, and you are right to ask, you should ask that of anything involving your money. This is a farming venture: real farms grow real produce that is sold, and co-owners share in what the farms earn. There is no reward for recruiting other people, and your earnings come from the farms, not from anyone who joins after you.",
  },
  {
    id: "experience",
    question: "Do I need farming experience?",
    answer:
      "No. The farms are fully turnkey with labour provided. You are simply the co-owner.",
  },
  {
    id: "age",
    question: "Do I need to be a certain age?",
    answer:
      "This is built for young Mauritians aged 18 to 35. If you are under 18, a parent or responsible adult can hold it on your behalf until you come of age. If you are over 35, you can take part on behalf of your children. Conditions apply, explained at the session.",
  },
  {
    id: "delivery",
    question: "Where do you deliver?",
    answer: "Nationwide, across Mauritius.",
  },
  {
    id: "live-session",
    question: "What happens at the live session?",
    answer:
      "The founder walks you through everything, A to Z, with full transparency: how it works, what you get, the risks, and every question you have. You decide afterward, with no pressure and no obligation.",
  },
  {
    id: "reserve-cost",
    question: "Does it cost anything to reserve my spot?",
    answer:
      "No. Reserving a spot is free and commits you to nothing. There is no payment to fill the form and no obligation to proceed.",
  },
  {
    id: "change-mind",
    question: "Can I change my mind?",
    answer:
      "Yes. Reserving a spot commits you to nothing. There is no payment and no obligation, and you can step away at any point before you decide to join.",
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
          defaultValue={["is-this-real"]}
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