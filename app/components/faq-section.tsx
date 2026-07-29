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
    id: "what-is-it",
    question: "What exactly is yealth?",
    answer:
      "A membership for young Mauritians. Fresh ready-to-eat salads delivered every week, plus access to programs that open new ways to earn and build.",
  },
  {
    id: "what-do-i-pay-for",
    question: "What do I actually pay for?",
    answer:
      "One monthly membership. It covers your weekly delivery, and your access to the programs comes with it.",
  },
  {
    id: "how-much",
    question: "How much is it?",
    answer:
      "Rs 2,240 a month for 8 salads, Rs 4,480 for 16, Rs 6,720 for 24. One payment, monthly, covering your delivery and your access to the programs.",
  },
  {
    id: "is-this-a-job",
    question: "Is this a job?",
    answer:
      "No. yealth is not an employer. The programs give you access to paid work, clients and opportunities. What you do with them is yours.",
  },
  {
    id: "recruiting",
    question: "Is this one of those schemes where you have to recruit people?",
    answer:
      "No. You are not required to bring anyone in, and nothing you receive depends on recruiting. The programs are open to every member.",
  },
  {
    id: "who-can-apply",
    question: "Who can apply?",
    answer:
      "Mauritians aged 18 to 35. If you are under 18 or over 35, there is a parent pathway. Apply and we will send you the details.",
  },
  {
    id: "delivery",
    question: "Where do you deliver?",
    answer:
      "Plaines Wilhems and Flacq for now. More districts are coming. If you are outside those areas you can still apply, and you will hear the moment we reach your district.",
  },
  {
    id: "applying-cost",
    question: "Does applying cost anything?",
    answer:
      "No. Applying is free, takes 30 seconds, and commits you to nothing.",
  },
  {
    id: "after-i-apply",
    question: "What happens after I apply?",
    answer:
      "We review your application, then send you recorded videos explaining everything. If you want to go further, you attend a live session with the founder. You decide after that, not before.",
  },
  {
    id: "how-long",
    question: "How long does it take?",
    answer:
      "We onboard as fast as we can to support people properly. Apply today and you sit ahead of everyone who applies tomorrow.",
  },
  {
    id: "questions-before-commit",
    question: "Can I ask questions before I commit?",
    answer:
      "Yes. That is what the live session is for. The founder hosts it personally and answers everything.",
  },
  {
    id: "programs-immediately",
    question: "Do I get all the programs immediately?",
    answer:
      "Access opens as your membership continues. The live session covers exactly how.",
  },
  {
    id: "must-use-programs",
    question: "Do I have to use the programs?",
    answer:
      "No. They are there when you want them, and nothing forces you to use any of them.",
  },
  {
    id: "farm-ownership-part-of-membership",
    question: "Is farm ownership part of the membership?",
    answer:
      "No. They are two separate things, and neither requires the other. Farm co-ownership is open to all youth aged 18 to 35, member or not. Members simply hear first when a new farm opens.",
  },
  {
    id: "anything-guaranteed",
    question: "Is anything guaranteed?",
    answer:
      "No. A farm is a real business, and real businesses carry real risk. Anyone who promises you guaranteed income is not telling you the truth. Everything is explained in full at the live session, before you decide anything.",
  },
  {
    id: "can-i-cancel",
    question: "Can I cancel?",
    answer: "Yes. The videos explain how it works in detail.",
  },
  {
    id: "who-is-behind-this",
    question: "Who is behind this?",
    answer:
      "yealth is founded by Muktish and operates in Mauritius. You meet him personally at the live session, before you commit to anything.",
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
          defaultValue={["what-is-it"]}
          className="flex flex-col gap-4"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}