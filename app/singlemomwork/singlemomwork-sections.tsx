"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Rebuilt from the static source at _content/singlemomwork-2026-09-08.html.
 *
 * Content is authoritative and carried across unchanged. All 66 records keep
 * their name, intro sentence, six asks and tag set exactly as written, and the
 * data below is generated mechanically from the source rather than retyped.
 * Every heading, sub note, prep point, walk-away point, the CTA and the footer
 * disclaimer are verbatim. Nothing is reworded.
 *
 * The filter logic is preserved exactly, including the inversion: 'notraining'
 * EXCLUDES anything tagged 'training', while every other filter REQUIRES its
 * tag. Multiple active filters combine as AND. A sub hides when it holds no
 * visible item, and a group hides when it holds no visible sub.
 *
 * Item numbers are assigned once in source order, 1 to 66, and are deliberately
 * never recomputed when filtering, so they stay attached to their item and go
 * non-contiguous. That matches the source.
 *
 * One accessibility ADDITION, not a port: the counter carries aria-live
 * ("polite"). The source has no live region, so a screen reader user toggling a
 * pill got no feedback at all, the visible count being the only signal the
 * filter gives. The wrapper holds the live region rather than the number alone,
 * so the count and its label announce together as a single update. This matches
 * the aria-live treatment already used on /pricing.
 *
 * Two source behaviours are ported as-is even though no UI path reaches them:
 * the empty state and the singular "Way showing" label. The minimum over all 31
 * filter combinations is 6, so neither can be produced by clicking. They are
 * kept for fidelity.
 */

const CTA_HREF = "https://yealth.mu";

type Group = "low" | "skill";
type Tag = "phone" | "nomoney" | "fast" | "remote" | "training";
type Filter = "phone" | "nomoney" | "fast" | "remote" | "notraining";

interface Way {
  group: Group;
  sub: number;
  name: string;
  tags: Tag[];
  /** Sentence spliced into the generated prompt between the fixed open and close. */
  intro: string;
  asks: [string, string, string, string, string, string];
}

/** A prose bullet: a bold lead sentence, then the rest of the point. */
interface ProsePoint {
  lead: string;
  rest: string;
}

const WAYS: Way[] = [
  {
    group: "low",
    sub: 0,
    name: "Microtasking online, Clickworker and Appen",
    tags: ["phone", "nomoney", "remote"],
    intro:
      "I want to earn small amounts online doing microtasks from my phone or laptop, on sites like Clickworker and Appen.",
    asks: [
      "Which microtask sites actually accept people living in Mauritius and pay them",
      "What I need to register: documents, a way to receive money, phone or laptop",
      "Which task types pay best for a beginner with no experience",
      "How many hours a day it takes to earn anything meaningful, honestly",
      "How to spot fake microtask sites that never pay",
      "How to move from microtasks to better paid online work after a few months",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Data entry and simple admin for local businesses",
    tags: ["phone", "nomoney", "remote"],
    intro:
      "I want to do data entry and simple admin work from home for small businesses in Mauritius.",
    asks: [
      "What basic skills I need, including which free typing and spreadsheet tutorials to follow",
      "How to write a short message offering my service to local shops, accountants and small companies",
      "What to charge per hour or per task in Mauritius as a beginner",
      "How to find my first three clients using Facebook groups and people I already know",
      "How to organise my day so I can work around my children",
      "Mistakes that make clients stop sending work",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Typing CVs, letters and applications",
    tags: ["nomoney", "fast", "remote"],
    intro:
      "I want to type CVs, letters and job applications for people in my area who cannot do it themselves.",
    asks: [
      "What equipment I need at minimum, and whether a phone is enough or I need a laptop and printer",
      "Free CV and letter templates I can use as a base",
      "What to charge per CV and per letter in Mauritius",
      "How to let people in my neighbourhood know I offer this",
      "How to handle someone's personal information safely",
      "How to add related services later, like printing or online applications",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Filling government forms and online applications",
    tags: ["phone", "nomoney", "fast", "remote"],
    intro:
      "I want to help people in my area fill government forms and online applications, for a small fee.",
    asks: [
      "Which forms and online services in Mauritius people struggle with most",
      "What I need to learn to do them well, and where the official guides are",
      "What is fair to charge so people can afford it and I still earn",
      "How to make sure I never keep or misuse someone's identity documents",
      "How to find customers through neighbours, shops and Facebook groups",
      "What I must not do so I do not break any rule",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Managing WhatsApp orders for a business",
    tags: ["phone", "nomoney", "fast", "remote"],
    intro:
      "I want to manage WhatsApp orders for a small business from my phone at home.",
    asks: [
      "Which kinds of local businesses need someone to handle their WhatsApp orders",
      "How to write a short message offering this to shop owners",
      "What to charge per month for this in Mauritius",
      "How to set up WhatsApp Business, quick replies and a simple order list",
      "How to reply fast while looking after my children",
      "Mistakes that make a business owner lose trust in me",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Running a business Facebook page",
    tags: ["phone", "nomoney", "fast", "remote"],
    intro:
      "I want to run the Facebook page of a small local business from my phone.",
    asks: [
      "What a small business expects from someone running their page",
      "How to plan a week of simple posts using only a phone",
      "What to charge per month in Mauritius as a beginner",
      "How to find my first client among shops, salons and food sellers near me",
      "Free tools to make posts look good",
      "Mistakes that get a page manager dropped in the first month",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Making short videos for local brands to post",
    tags: ["phone", "nomoney", "remote"],
    intro:
      "I want to make short videos for local brands to post on their own pages, filmed with my phone.",
    asks: [
      "What kind of videos small brands in Mauritius actually pay for",
      "How to make a simple portfolio of three example videos using products in my house",
      "What to charge per video as a beginner",
      "How to approach local brands and shops without sounding desperate",
      "Free apps to edit on a phone",
      "Mistakes that make a brand not come back",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Reselling for another shop on your own page",
    tags: ["phone", "nomoney", "fast", "remote"],
    intro:
      "I want to sell products for another shop on my own Facebook or WhatsApp, and earn a commission on each sale.",
    asks: [
      "How to approach a shop owner and propose a commission arrangement",
      "What commission percentage is fair in Mauritius",
      "How to write this arrangement down simply so nobody argues later",
      "How to post and answer questions so people actually buy",
      "How delivery and payment should work so I am not stuck with unpaid orders",
      "Signs a shop is not paying me correctly",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Selling on Vinted and local selling apps",
    tags: ["phone", "nomoney", "fast", "remote"],
    intro:
      "I want to sell clothes and items I already own, and later items I buy cheaply, on Vinted and local selling apps.",
    asks: [
      "Which selling apps work in Mauritius and which ones do not",
      "How to photograph and describe items with only a phone so they sell",
      "How to price items so they sell fast but still make me money",
      "How to handle payment and delivery safely inside Mauritius",
      "Where to find cheap stock once my own things are sold",
      "Scams I should watch for as a seller",
    ],
  },
  {
    group: "low",
    sub: 0,
    name: "Second hand clothes, buying and reselling",
    tags: ["phone", "fast", "remote"],
    intro:
      "I want to buy second hand clothes cheaply and resell them from home in Mauritius.",
    asks: [
      "Where people in Mauritius source second hand clothes in bulk",
      "How to check quality and what to reject",
      "How to price pieces so I make money after washing and repairs",
      "How to sell from home through Facebook, WhatsApp and word of mouth",
      "How to arrange delivery or collection without leaving my children for long",
      "Mistakes that leave resellers stuck with stock nobody wants",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Nail tech",
    tags: ["training"],
    intro:
      "I want to earn money doing nails from my house, with clients coming to me.",
    asks: [
      "What nail training or course I can do in Mauritius, roughly what it costs, and whether I can learn part of it myself",
      "The starter kit I really need to buy first, and what I can add later once money comes in",
      "What to charge my first clients while I am still learning, and when to raise it",
      "How to get my first ten clients without paying for ads",
      "How to set up one corner of my house so it is clean, safe and comfortable for a client",
      "The mistakes that make new nail techs lose clients in the first three months",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Hair, braids, lissage, colouring and extensions",
    tags: ["training"],
    intro:
      "I want to do hair from my house, braids, lissage, colouring and extensions, with clients coming to me.",
    asks: [
      "What training I need in Mauritius and what I can safely practise on family first",
      "The starter products and tools I need, and what to skip at the beginning",
      "What to charge for each service as a beginner",
      "How to get my first ten clients without paying for ads",
      "How to set up a corner of my house for clients, including water and lighting",
      "Products and treatments that damage hair or skin if I get them wrong",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Eyelash extensions and brows",
    tags: ["training"],
    intro:
      "I want to do eyelash extensions and brow shaping from my house, with clients coming to me.",
    asks: [
      "What training I need, and why lash work needs a proper course",
      "The starter kit I need first, including safe glue",
      "What to charge per set and per refill as a beginner",
      "How to get my first clients",
      "Hygiene rules that protect the client's eyes and my reputation",
      "Mistakes that cause reactions, bad reviews and lost clients",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Waxing",
    tags: ["training"],
    intro:
      "I want to offer waxing from my house, with clients coming to me.",
    asks: [
      "What training I need, even for something that looks simple",
      "The equipment and products I need first",
      "What to charge per area in Mauritius",
      "How to make a client feel private and comfortable in a home setting",
      "Hygiene rules, including what must never be reused",
      "How to get my first clients quietly and respectfully",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Mehndi and henna for weddings",
    tags: ["nomoney", "training"],
    intro:
      "I want to do mehndi and henna for weddings and events from my house, and sometimes at the event.",
    asks: [
      "How to practise and build a portfolio using only my own hands and family",
      "Safe henna versus dangerous black henna, and how to buy the right cones",
      "What to charge per hand, per bride and per event",
      "How to find wedding clients months in advance",
      "How to manage bookings so I can plan childcare for event days",
      "Mistakes that ruin a bride's mehndi",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Massage and basic beauty care",
    tags: ["training"],
    intro:
      "I want to offer massage and basic beauty care from my house, with clients coming to me.",
    asks: [
      "What proper training I need in Mauritius before I can safely work on a client's body",
      "What equipment I need first, including a table",
      "What to charge per session",
      "How to attract clients while keeping the service professional and safe for me as a woman alone at home",
      "Hygiene rules and health conditions where I must refuse a client",
      "How to protect myself from inappropriate clients",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Minding children at home for working parents",
    tags: ["nomoney", "fast"],
    intro:
      "I want to look after other people's young children in my house while their parents work.",
    asks: [
      "What the rules are in Mauritius for minding children at home, and whether I need to register",
      "How to make my house safe for small children",
      "What to charge per child per day or per month",
      "How to find parents who need this near me",
      "How to write a simple agreement covering hours, food, illness and payment",
      "What I must never do, so I keep children safe and myself protected",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "After school homework supervision",
    tags: ["nomoney", "fast"],
    intro:
      "I want to supervise children's homework after school in my house, for a monthly fee per child.",
    asks: [
      "How to set up a quiet homework corner for four to six children",
      "What to charge per child per month in Mauritius",
      "How to find parents through the nearest school and Facebook groups",
      "How to keep children focused without being a qualified teacher",
      "What to do when a child is stuck on something I do not understand",
      "How to handle pick up, snacks and late parents",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Pet sitting and grooming",
    tags: ["nomoney", "fast"],
    intro:
      "I want to look after and groom people's pets at my house.",
    asks: [
      "What basic knowledge I need for dogs and cats",
      "What equipment I need for basic grooming, and what to leave to a vet",
      "What to charge per day of sitting and per grooming",
      "How to find pet owners near me",
      "How to keep my children and the animals safe together",
      "Signs an animal is sick and I should refuse or send to a vet",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Shoe and bag repair",
    tags: ["training"],
    intro:
      "I want to repair shoes and bags from my house.",
    asks: [
      "Where to learn the basics in Mauritius, or from someone who already does it",
      "The tools and materials I need to start",
      "What to charge for common repairs",
      "How to let people know I do this",
      "How to organise collection and return without a shop",
      "Repairs I should refuse until I have more skill",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Phone repair",
    tags: ["training"],
    intro:
      "I want to repair phones from my house.",
    asks: [
      "Where to learn screen and battery replacement, and how long it takes",
      "The tools I need first and where to buy parts in Mauritius",
      "What to charge for common repairs",
      "How to find customers near me",
      "How to protect customers' data so I am never accused of anything",
      "Repairs I should not attempt at the start",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Phone accessories and airtime",
    tags: ["fast"],
    intro:
      "I want to sell phone accessories and airtime top ups from my house.",
    asks: [
      "Where to buy accessories cheaply in Mauritius",
      "How airtime reselling works and what margin to expect",
      "Which accessories sell fastest",
      "How to sell from my gate, WhatsApp and Facebook",
      "How much stock to start with so my money is not stuck",
      "Mistakes that leave me with stock nobody wants",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Printing, photocopying and laminating",
    tags: [],
    intro:
      "I want to offer printing, photocopying and laminating from my house.",
    asks: [
      "What printer and laminator I need, and a realistic budget",
      "What to charge per page and per lamination",
      "How to work out ink and paper cost so I do not lose money",
      "How to find customers, including students and small shops",
      "How to take orders by WhatsApp so people do not wait at my house",
      "Mistakes new home printing services make",
    ],
  },
  {
    group: "low",
    sub: 1,
    name: "Product photography for small sellers",
    tags: ["phone", "nomoney"],
    intro:
      "I want to photograph products for small online sellers using my phone.",
    asks: [
      "How to take clean product photos with a phone and daylight",
      "What simple setup I can build at home for almost nothing",
      "What to charge per product or per batch",
      "How to find sellers who need photos on Facebook and Instagram",
      "Free apps to edit and remove backgrounds",
      "Mistakes that make photos look cheap",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Home cooking, gato, snacks, briani and meal boxes",
    tags: ["nomoney", "fast"],
    intro:
      "I want to cook and sell food from my house, gato, snacks, briani and meal boxes.",
    asks: [
      "What certificate I need from the Ministry of Health to sell food, and how to get it",
      "How to price each item so I make money after ingredients, gas and packaging",
      "Which three items to start with, so I do not waste stock",
      "How to take orders by WhatsApp and get paid before I cook",
      "How to find my first customers through offices, neighbours and Facebook",
      "Mistakes that make food sellers lose money or customers",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Baking, bread, pain maison and farata",
    tags: ["nomoney", "fast"],
    intro:
      "I want to bake bread, pain maison and farata at home and sell them daily.",
    asks: [
      "What certificate I need to sell food in Mauritius",
      "How to work out my cost per piece and a price that still sells",
      "How much to bake at the start so nothing is wasted",
      "How to find daily customers near my house",
      "How to organise baking hours around my children",
      "Mistakes that make home bakers give up in the first month",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Cakes and cake decoration",
    tags: ["training"],
    intro:
      "I want to make and decorate cakes at home for birthdays and weddings.",
    asks: [
      "What I need to learn first, and where to learn decoration in Mauritius or online",
      "The tools I need at the start, and what can wait",
      "What to charge for a simple cake and a decorated cake",
      "How to build a portfolio of photos before I have clients",
      "How to handle deposits and last minute cancellations",
      "Mistakes that ruin an order and a reputation",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Achard, pickles, confiture and chutney",
    tags: ["nomoney"],
    intro:
      "I want to make achard, pickles, confiture and chutney at home and sell them.",
    asks: [
      "What certificate I need to sell food, and what the rules are for jars and labels",
      "How to make products that keep well and do not spoil",
      "How to price a jar so I make money",
      "Where to sell, including shops, markets and online",
      "How to make my labels look trustworthy",
      "Mistakes that spoil a batch or get products rejected by shops",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Sewing and alterations",
    tags: ["training"],
    intro:
      "I want to do sewing and alterations from my house.",
    asks: [
      "Where to learn or improve in Mauritius, including free courses for women",
      "Which sewing machine to buy first if I have little money",
      "What to charge for common alterations",
      "How to get my first customers near me",
      "How to organise fittings at times that suit my children",
      "Mistakes that lose customers, like late delivery or poor finishing",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "School uniforms, work uniforms and aprons",
    tags: ["training"],
    intro:
      "I want to sew school uniforms, work uniforms and aprons at home and sell them.",
    asks: [
      "Which uniform items sell most and when in the year",
      "What machine I need and where to buy fabric in Mauritius",
      "How to price a uniform so I make money",
      "How to approach schools, shops and small businesses to sew for them",
      "How to handle sizes and orders without mistakes",
      "Mistakes that make uniform sewers lose money on fabric",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Curtains and cushions",
    tags: ["training"],
    intro:
      "I want to sew curtains and cushions at home for clients.",
    asks: [
      "What skills and machine I need",
      "How to measure and quote a job correctly",
      "What to charge per curtain and per cushion",
      "How to find clients, including small hotels and guest houses",
      "How to handle fabric buying so I do not pay from my own pocket",
      "Mistakes that lose money on a curtain job",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Costumes and dance outfits",
    tags: ["training"],
    intro:
      "I want to sew costumes and dance outfits at home, for sega, Bollywood and school shows.",
    asks: [
      "Where the demand comes from in Mauritius and when in the year",
      "What skills and machine I need",
      "How to price a costume",
      "How to approach dance schools, troupes and primary schools",
      "How to handle group orders with many sizes",
      "Mistakes that cause late deliveries before a show",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Embroidery and name personalisation",
    tags: ["training"],
    intro:
      "I want to do embroidery and name personalisation on uniforms, caps, towels and bags at home.",
    asks: [
      "What equipment I need, hand or machine, and a realistic budget",
      "Which products people pay to personalise in Mauritius",
      "What to charge per name or logo",
      "How to find customers, including schools, sports clubs and small companies",
      "How to build a small sample set to show",
      "Mistakes that waste blank stock",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Handicrafts, jewellery, candles, soap and decor",
    tags: ["nomoney"],
    intro:
      "I want to make handicrafts at home, jewellery, candles, soap or decor, and sell them.",
    asks: [
      "Which one product to start with, given I have little money",
      "Where to buy materials in Mauritius",
      "How to price a handmade item so I make money",
      "Where to sell, including the National Women Entrepreneur Council outlets and online",
      "How to photograph and present items with a phone",
      "Mistakes that leave crafters with stock nobody buys",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Cleaning products, laundry liquid and dishwash",
    tags: ["nomoney"],
    intro:
      "I want to make cleaning products at home, laundry liquid, dishwash and floor cleaner, and sell them.",
    asks: [
      "Safe recipes, and which ingredients I must never mix",
      "Where to buy ingredients and bottles in Mauritius",
      "What rules apply to selling home made cleaning products",
      "How to price a bottle so I make money",
      "How to find repeat customers near me",
      "Mistakes that make products fail or customers not return",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Incense",
    tags: ["nomoney"],
    intro:
      "I want to make incense sticks at home and sell them.",
    asks: [
      "What I need to learn and where to learn it",
      "Materials and where to buy them in Mauritius",
      "How to price a pack",
      "Where to sell, including shops, temples and online",
      "How to make packaging look good cheaply",
      "Mistakes that make incense burn badly or not sell",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Gift hampers for Diwali, Eid and Christmas",
    tags: ["nomoney", "fast"],
    intro:
      "I want to make gift hampers at home for Diwali, Eid, Christmas and for businesses.",
    asks: [
      "How to plan a hamper calendar for the year in Mauritius",
      "Where to buy hamper contents and packaging cheaply",
      "How to price a hamper so I make money",
      "How to sell to small companies for staff and client gifts",
      "How to take orders and deposits early so I do not pay for stock myself",
      "Mistakes that leave hamper makers with unsold stock after the festival",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Backyard vegetables and plants",
    tags: ["nomoney"],
    intro:
      "I want to grow vegetables in my yard and sell them.",
    asks: [
      "Which vegetables grow well and sell well in Mauritius, by season",
      "How to start with almost no money, including seeds and compost",
      "What support FAREI and the Development Bank offer to small home growers",
      "How to sell to neighbours, small shops and markets",
      "How much I can realistically expect from a small yard, honestly",
      "Mistakes that kill a first crop",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Plant nursery and seedlings",
    tags: ["nomoney"],
    intro:
      "I want to grow seedlings and ornamental plants at home and sell them.",
    asks: [
      "Which plants people in Mauritius buy most",
      "How to start with cuttings and seeds for almost no money",
      "What to charge per seedling and per pot",
      "How to sell from my gate, on Facebook and to local landscapers",
      "How to protect plants from heat, rain and pests",
      "Mistakes that waste months of growing",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Eggs and poultry",
    tags: [],
    intro:
      "I want to keep chickens at home for eggs and meat and sell them.",
    asks: [
      "What space, housing and rules apply in Mauritius for a small flock",
      "Realistic feed cost versus egg income, honestly",
      "How many birds to start with",
      "Where to buy chicks or layers and feed",
      "How to sell eggs to neighbours and shops",
      "Diseases and mistakes that wipe out a small flock",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Rabbit and quail rearing",
    tags: [],
    intro:
      "I want to rear rabbits or quail at home and sell them.",
    asks: [
      "Which one suits a small space better and why",
      "Housing, feed and space needed",
      "Where the demand is in Mauritius and what people pay",
      "How many to start with",
      "What rules or health checks apply",
      "Mistakes that cause animals to die or not sell",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Mushroom growing",
    tags: ["training"],
    intro:
      "I want to grow mushrooms at home and sell them.",
    asks: [
      "Which mushrooms can be grown at home in the Mauritian climate",
      "What training and starter kit I need, and where to get spawn",
      "What space and conditions I need in my house",
      "What to charge and who buys, including restaurants",
      "How long before the first harvest, honestly",
      "Mistakes that cause contamination",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Bee keeping and honey",
    tags: ["training"],
    intro:
      "I want to keep bees at home and sell honey.",
    asks: [
      "What training I need and whether my location suits bees",
      "What equipment I need first and a realistic budget",
      "What rules apply in Mauritius for beekeeping",
      "How long before the first honey, honestly",
      "How to sell honey and what to charge",
      "Safety for my children and neighbours",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Compost and organic fertiliser",
    tags: ["nomoney"],
    intro:
      "I want to make compost and organic fertiliser at home and sell it.",
    asks: [
      "How to make good compost from household and garden waste",
      "What space and time it takes",
      "How to bag and price it",
      "Who buys, including gardeners, nurseries and home growers",
      "Whether any rules apply to selling it",
      "Mistakes that make compost smell or fail",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Laundry and ironing",
    tags: ["nomoney", "fast"],
    intro:
      "I want to offer laundry and ironing from my house.",
    asks: [
      "What equipment I need, and whether I can start with what I have",
      "What to charge per item and per load in Mauritius",
      "How to find customers, including working families, guest houses and small businesses",
      "How to organise collection and delivery without leaving my children",
      "How to avoid damaging or losing clothes",
      "How to grow from neighbours to regular contracts",
    ],
  },
  {
    group: "low",
    sub: 2,
    name: "Renting a room, an annexe, parking or storage",
    tags: ["nomoney"],
    intro:
      "I want to rent out a spare room, an annexe, my parking space or storage space at my house.",
    asks: [
      "Which option makes sense for a woman alone with children, and how to stay safe",
      "What rules and taxes apply in Mauritius for renting out a room or annexe",
      "How to set a fair price for my area",
      "How to find a reliable tenant, including students and workers",
      "What to put in a simple written agreement",
      "Warning signs of a bad tenant",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Remote call centre and customer service",
    tags: ["remote"],
    intro:
      "I want a work from home call centre or customer service job with a company in Mauritius.",
    asks: [
      "Which companies in Mauritius offer fully remote customer service roles",
      "What qualifications and language level they expect, and how to improve my French and English fast",
      "How to write a CV and a short cover message for these roles",
      "What internet, headset and quiet space I need at home",
      "How to prepare for the phone interview and the typing test",
      "How to manage a fixed shift with children at home",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Online tutoring for PSAC, NCE, SC and HSC",
    tags: ["phone", "nomoney", "fast", "remote"],
    intro:
      "I want to tutor students online for PSAC, NCE, SC and HSC from my house.",
    asks: [
      "Which subjects and levels have the most demand in Mauritius",
      "How to run a lesson by video using a phone or laptop",
      "What to charge per student per month for group and individual online lessons",
      "How to find my first students through parents, schools and Facebook groups",
      "How to plan lessons around my own children's timetable",
      "Mistakes that make parents stop paying",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "French tutoring to students abroad",
    tags: ["nomoney", "remote"],
    intro:
      "I want to teach French online to students in other countries, from my house in Mauritius.",
    asks: [
      "Which platforms accept tutors living in Mauritius and how I get paid",
      "What qualifications or certificate help me get accepted",
      "How to write a profile and record an introduction video",
      "What to charge per hour when starting",
      "How to handle time zones with children at home",
      "Mistakes that get a new tutor ignored on these platforms",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Virtual assistant for clients abroad",
    tags: ["remote"],
    intro:
      "I want to work as a virtual assistant for clients in other countries, from my house in Mauritius.",
    asks: [
      "What tasks virtual assistants actually do, and which ones I can offer with my current skills",
      "Which platforms and job boards accept people in Mauritius, and how payment works",
      "How to write a profile that gets my first client",
      "What to charge per hour as a beginner",
      "Tools I need to learn, like email, calendars and shared documents",
      "Mistakes that lose a client in the first month",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Bookkeeping and accounts",
    tags: ["remote"],
    intro:
      "I want to do bookkeeping and basic accounts from home for small businesses.",
    asks: [
      "What qualification or short course I need to be taken seriously in Mauritius",
      "Which software small businesses use, and where to learn it free",
      "What to charge per month per small business",
      "How to find my first clients among shops, tradespeople and small companies",
      "What I am allowed to do without being a licensed accountant",
      "Mistakes that get a bookkeeper in trouble",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Translation between English and French",
    tags: ["remote"],
    intro:
      "I want to translate between English and French from home, for clients in Mauritius and abroad.",
    asks: [
      "Which kinds of documents are most in demand",
      "How to prove my level without a degree, and which certificates help",
      "Which platforms accept translators in Mauritius and how payment works",
      "What to charge per word or per page",
      "Tools that speed up translation without lowering quality",
      "Mistakes that lose translation clients",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Transcription",
    tags: ["remote"],
    intro:
      "I want to do transcription work from home.",
    asks: [
      "Which transcription sites accept people in Mauritius and pay reliably",
      "What typing speed and equipment I need",
      "How to pass the entry tests",
      "What to expect to earn per audio hour, honestly",
      "How to work in short blocks around my children",
      "Mistakes that get accounts closed",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Freelance writing",
    tags: ["remote"],
    intro:
      "I want to earn as a freelance writer from home.",
    asks: [
      "What kinds of writing are in demand and pay, from blog posts to product descriptions",
      "How to build three samples with no clients yet",
      "Which platforms accept writers in Mauritius and how payment works",
      "What to charge per article as a beginner",
      "How to find clients directly without platforms",
      "Mistakes that get new writers rejected",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Graphic design",
    tags: ["training", "remote"],
    intro:
      "I want to do graphic design from home for local businesses and clients abroad.",
    asks: [
      "What to learn first and free tools to start with",
      "How to build a small portfolio with practice projects",
      "What to charge for a logo, a flyer and a social media pack in Mauritius",
      "How to find my first clients among local shops and on freelance platforms",
      "What computer I really need",
      "Mistakes that make clients not pay or not return",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Video editing",
    tags: ["training", "remote"],
    intro:
      "I want to do video editing from home for creators, brands and clients abroad.",
    asks: [
      "What to learn first and free software to start with",
      "How to build a showreel with no clients yet",
      "What to charge per video as a beginner",
      "Where to find clients, including local brands and freelance platforms",
      "What computer I really need",
      "Mistakes that lose editing clients",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Social media management for local shops",
    tags: ["phone", "remote"],
    intro:
      "I want to manage social media for local shops and small businesses from my phone.",
    asks: [
      "What a small business expects for a monthly fee",
      "How to plan a month of content simply",
      "What to charge per month in Mauritius",
      "How to find my first three clients",
      "Free tools for design and scheduling",
      "Mistakes that get a manager dropped",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Digital marketing and running ads",
    tags: ["training", "remote"],
    intro:
      "I want to run online ads and digital marketing for small businesses in Mauritius from home.",
    asks: [
      "What to learn first and free courses that are worth doing",
      "How to run a first small ad campaign for a local business with little budget",
      "What to charge for managing ads",
      "How to prove results to a client",
      "How to find my first clients",
      "Mistakes that waste a client's money",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Web development, WordPress and no code sites",
    tags: ["training", "remote"],
    intro:
      "I want to build websites for small businesses from home, using WordPress and no code tools.",
    asks: [
      "What to learn first and how long it takes, honestly",
      "Free tools to build a first practice site",
      "What to charge for a simple business website in Mauritius",
      "How to find my first clients among local businesses",
      "How to handle hosting, domains and maintenance fees",
      "Mistakes that leave web builders unpaid",
    ],
  },
  {
    group: "skill",
    sub: 0,
    name: "Voice over in Creole and French",
    tags: ["phone", "nomoney", "remote"],
    intro:
      "I want to do voice over work in Creole and French from home.",
    asks: [
      "Who in Mauritius and abroad pays for Creole and French voice work",
      "How to record cleanly at home with a phone or a cheap microphone",
      "How to make a short demo",
      "What to charge per minute or per project",
      "Where to find clients",
      "Mistakes that get demos rejected",
    ],
  },
  {
    group: "skill",
    sub: 1,
    name: "Sewing classes",
    tags: ["nomoney"],
    intro:
      "I want to teach sewing classes from my house.",
    asks: [
      "How to plan a beginner course of six to eight lessons",
      "What to charge per student per course",
      "How many students I can teach at once at home",
      "How to find students through women's groups and Facebook",
      "Whether students bring machines or I provide them",
      "Mistakes that make students drop out",
    ],
  },
  {
    group: "skill",
    sub: 1,
    name: "Cooking classes",
    tags: ["nomoney"],
    intro:
      "I want to teach cooking classes from my house.",
    asks: [
      "Which classes people in Mauritius would pay for, including tourists",
      "How to plan and price a class",
      "How to handle ingredient costs",
      "How to find students and tourists",
      "What hygiene and safety rules apply",
      "Mistakes that make classes lose money",
    ],
  },
  {
    group: "skill",
    sub: 1,
    name: "Beauty classes",
    tags: ["training"],
    intro:
      "I want to teach beauty classes from my house, nails, lashes or hair.",
    asks: [
      "What qualification I need to be credible as a teacher",
      "How to plan a short course and price it",
      "How to handle practice models and kits",
      "How to find students",
      "How to give a certificate without making false claims",
      "Mistakes that damage a teacher's reputation",
    ],
  },
  {
    group: "skill",
    sub: 1,
    name: "Music lessons",
    tags: ["nomoney"],
    intro:
      "I want to teach music lessons from my house.",
    asks: [
      "Which instruments and levels have demand in Mauritius",
      "How to price a lesson and a monthly package",
      "How to plan lessons for children and adults",
      "How to find students",
      "How to handle instruments, noise and neighbours",
      "Mistakes that lose students",
    ],
  },
  {
    group: "skill",
    sub: 1,
    name: "Language classes, Hindi, Urdu, Mandarin and Tamil",
    tags: ["nomoney", "fast"],
    intro:
      "I want to teach language classes from my house, Hindi, Urdu, Mandarin or Tamil.",
    asks: [
      "Where the demand comes from in Mauritius for each language",
      "How to structure a beginner course and price it",
      "How to teach children and adults differently",
      "How to find students",
      "Free materials I can use",
      "Mistakes that make students drop out",
    ],
  },
  {
    group: "skill",
    sub: 1,
    name: "Tuition at your own house",
    tags: ["nomoney", "fast"],
    intro:
      "I want to give tuition in my house to school children.",
    asks: [
      "Which subjects and levels have most demand near me",
      "What to charge per student per month for group and individual tuition",
      "How many students I can take at once and how to arrange the room",
      "How to find students through parents and schools",
      "How to plan around my own children's timetable",
      "Mistakes that make parents stop paying",
    ],
  },
];

const PREP_POINTS: ProsePoint[] = [
  { lead: "Food needs a certificate.", rest: "If you sell food to the public, get a Food Handler's Certificate from the Ministry of Health. It is not optional and it protects you." },
  { lead: "Beauty work needs real training.", rest: "Nails, lashes, waxing and hair go wrong on real skin. Take a proper course. Learning only from videos is how you lose a client and your name." },
  { lead: "Register when you start earning steadily.", rest: "A sole trader business card from the Corporate and Business Registration Department costs very little and opens the door to bank accounts, loans and bigger clients." },
  { lead: "If you receive social aid, ask first.", rest: "Talk to your Social Security office before you scale up, so a small income does not cost you a bigger benefit." },
  { lead: "Free training exists.", rest: "The National Women Entrepreneur Council, MITD and HRDC run courses for women, some with an allowance while you train. Ask at your nearest Employment Information Centre." },
  { lead: "Startup money exists too.", rest: "The Development Bank of Mauritius runs a women entrepreneur loan at a very low rate with no collateral for smaller amounts. You need a simple plan and your papers, not connections." },
];

const WALK_AWAY_POINTS: ProsePoint[] = [
  { lead: "Any job that asks you to pay first.", rest: "Activation fee, registration fee, training kit, unlocking your earnings. Real work pays you. It does not bill you." },
  { lead: "Forex and crypto trading groups on WhatsApp.", rest: "The national cyber security team has warned about these repeatedly, including cases where thousands of Mauritians lost money and were then told to pay tax to withdraw the profit that never existed." },
  { lead: "Recruitment ladders.", rest: "If the money comes from bringing in other people rather than from selling a real product, it collapses and the last ones in lose everything." },
  { lead: "Promises of a fixed monthly amount for no work.", rest: "Nothing on this page works that way. Everything here is trading your time, your skill or your product for money." },
  { lead: "Paying someone to set up a TikTok payout for you.", rest: "The creator fund does not operate in Mauritius. Local brand deals do." },
];

interface SubSection {
  heading: string;
  note: string;
  /** The source's .sub.farm modifier: the heading takes mint instead of gold. */
  farm?: boolean;
}

interface GroupSection {
  id: string;
  key: Group;
  heading: string;
  intro: string;
  subs: SubSection[];
}

const GROUPS: GroupSection[] = [
  {
    id: "g-low",
    key: "low",
    heading: "No Diploma Needed",
    intro:
      "You can start these with what you already know how to do, or learn them in a few weeks.",
    subs: [
      {
        heading: "From Your Phone Or Laptop",
        note: "You never leave the house and nobody comes to you.",
      },
      {
        heading: "Clients Come To Your House",
        note: "Still no commute and your child stays with you, but people knock on your door.",
      },
      {
        heading: "You Make It Or Grow It At Home",
        note: "You produce at home and sell locally, by phone, or at your gate.",
        farm: true,
      },
    ],
  },
  {
    id: "g-skill",
    key: "skill",
    heading: "You Need A Skill Or A Qualification",
    intro:
      "These pay more and last longer. Expect weeks or months before the first money, and expect to learn something first.",
    subs: [
      {
        heading: "From Your Phone Or Laptop",
        note: "Local employers and clients abroad. Good English or French moves you up fast.",
      },
      {
        heading: "You Teach It From Your House",
        note: "People come to you, or you teach the same thing by video.",
      },
    ],
  },
];

/**
 * Chip labels. 'remote' is deliberately absent from the rendered chips even
 * though it has a label: the source filters it out at render time, so it works
 * as a filter but never shows on an item.
 */
const TAG_LABEL: Record<Tag, string> = {
  phone: "Phone is enough",
  nomoney: "Start with almost nothing",
  fast: "Money within days",
  remote: "Nobody comes to you",
  training: "Course first",
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "phone", label: "A phone is all I have" },
  { id: "nomoney", label: "Almost no money to start" },
  { id: "fast", label: "I need money this week" },
  { id: "remote", label: "Nobody comes to my house" },
  { id: "notraining", label: "No course, no waiting" },
];

/** Byte-for-byte the source's buildPrompt. */
function buildPrompt(group: Group, intro: string, asks: readonly string[]) {
  const open =
    "I am a single mother in Mauritius. " +
    intro +
    " I have young children at home and very little money to start.";
  const list = asks.map((a, i) => i + 1 + ". " + a).join("\n");
  const close =
    group === "low"
      ? "Answer in simple English. I am starting from zero."
      : "Answer in simple English and be honest about how long it takes before the first payment.";
  return open + "\n\nTell me:\n" + list + "\n\n" + close;
}

/** Source .wrap: max-width 920px with a flat 24px gutter at every width. */
const WRAP = "mx-auto w-full max-w-[920px] px-6";

/** Source .hero .place / .lbl / .filters h2: Quicksand 500, uppercase, tracked. */
const EYEBROW =
  "font-heading text-sm font-medium uppercase tracking-[1px] md:text-base";

const HAIRLINE = "border-yealth-offwhite/10";

interface NumberedWay extends Way {
  n: number;
}

/**
 * Numbers are assigned once, in source order, and never recomputed. Filtering
 * only hides rows, so a filtered list shows its original numbers with gaps.
 */
const NUMBERED: NumberedWay[] = WAYS.map((w, i) => ({ ...w, n: i + 1 }));

export function SingleMomWorkSections() {
  const [active, setActive] = useState<Set<Filter>>(new Set());
  const prefersReduced = useReducedMotion();

  // The hero, counter and filter bar sit at the top of the viewport at first
  // paint, which is exactly where fadeUp fails: its viewport margin of -80px
  // never triggers for elements within 80px of the fold, and the content stays
  // at opacity 0. That is the documented iPhone Safari failure in CLAUDE.md and
  // the reason hero.tsx fires its entrances on mount. Same helper as /pricing.
  const pageFade = useCallback(
    (delay = 0) =>
      ({
        initial: prefersReduced
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 24, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: prefersReduced
          ? ({ duration: 0 } as const)
          : ({ duration: 0.7, delay, ease: "easeOut" } as const),
      }) as const,
    [prefersReduced]
  );

  // fadeUp is whileInView. Under reduced motion that leaves a JS-driven
  // animation running, which the blanket CSS rule in globals.css cannot stop,
  // so fall back to the mount-fire helper at zero duration instead.
  const scrollFade = (delay = 0) =>
    prefersReduced ? pageFade(0) : fadeUp(delay);

  /**
   * The source filter, unchanged. 'notraining' is the only inversion: it
   * excludes anything tagged 'training'. Every other filter requires its tag,
   * and active filters combine as AND.
   */
  const isVisible = useCallback(
    (way: Way) => {
      for (const f of active) {
        if (f === "notraining") {
          if (way.tags.includes("training")) return false;
        } else if (!way.tags.includes(f)) {
          return false;
        }
      }
      return true;
    },
    [active]
  );

  const visibleCount = useMemo(
    () => NUMBERED.filter(isVisible).length,
    [isVisible]
  );

  const toggle = (f: Filter) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });

  const clear = () => setActive(new Set());

  const clearAndScroll = () => {
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero */}
      <section className={cn(WRAP, "pt-[104px] md:pt-[136px]")}>
        <motion.span
          {...pageFade(0)}
          className={cn(EYEBROW, "mb-4 block text-yealth-mint")}
        >
          Mauritius
        </motion.span>
        <motion.h1
          {...pageFade(0.05)}
          className="max-w-[16ch] font-heading text-[32px] font-bold leading-[1.2] text-yealth-gold md:text-5xl"
        >
          Sixty Six Ways To Earn Without Leaving Your Children
        </motion.h1>
        <motion.p
          {...pageFade(0.1)}
          className="mt-6 max-w-[60ch] font-body text-yealth-grey"
        >
          Every one of these can be run from your own house in Mauritius. Some
          pay you this week. Some need a course first.{" "}
          <strong className="font-semibold text-yealth-offwhite">
            You do not need a diploma for most of them.
          </strong>{" "}
          Use the buttons below to keep only what fits the money, the time and
          the skills you have right now.
        </motion.p>
        <motion.p
          {...pageFade(0.15)}
          className="mt-6 max-w-[60ch] font-body text-yealth-grey"
        >
          Under each option there is a ready made message. Copy it, paste it
          into ChatGPT or Claude, and you get a step by step plan written for
          your exact situation.
        </motion.p>

        <motion.div {...pageFade(0.2)}>
          <Counter count={visibleCount} prefersReduced={Boolean(prefersReduced)} />
        </motion.div>
      </section>

      {/* Filters. Sticky, offset below the fixed navbar.
          The navbar is fixed at top: var(--announce-h), the height AnnouncementBar
          publishes for itself, so its bottom edge is that variable plus its own
          height. The offset therefore carries the same variable rather than a
          flat pixel, because --announce-h is itself responsive: measured at
          58.5px at 375 where the bar wraps to two lines, and 40.625px at 768 and
          1440.
          Navbar height was measured on this page with fonts loaded and the page
          scrolled, which is when the bar actually sticks and when the navbar
          carries its border: 73px at 375, 101px at 768, 81px at 1440. The 100px
          band runs from 768 to about 1045, where the nav links, the Mauritius
          pill and the Apply Now button stop fitting on one line. The switch back
          is content-driven, not a media query, so the 1100px variant sits
          deliberately above it: over-clearing leaves a gap, under-clearing
          covers the bar.
          z-30 keeps it above content, below the navbar (z-50) and below
          FloatingCta (z-40). */}
      <section
        aria-label="Filter the list"
        className={cn(
          "sticky top-[calc(var(--announce-h,0px)+73px)] z-30 border-b bg-yealth-black py-4 md:top-[calc(var(--announce-h,0px)+101px)] min-[1100px]:top-[calc(var(--announce-h,0px)+81px)]",
          HAIRLINE
        )}
      >
        <motion.div {...pageFade(0.25)} className={WRAP}>
          <h2 className={cn(EYEBROW, "mb-4 text-yealth-grey md:tracking-[2px]")}>
            What Is True For You Right Now
          </h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Pill
                key={f.id}
                pressed={active.has(f.id)}
                onClick={() => toggle(f.id)}
              >
                {f.label}
              </Pill>
            ))}
            <Pill clear onClick={clear}>
              Show all
            </Pill>
          </div>
        </motion.div>
      </section>

      <div className={WRAP}>
        {/* Empty state. Ported for fidelity: no filter combination reaches zero,
            the minimum over all 31 being 6, so nothing clickable shows this. */}
        <div className="py-12" hidden={visibleCount > 0}>
          <h3 className="font-heading text-[22px] font-bold text-yealth-offwhite">
            Nothing matches all of those
          </h3>
          <p className="mt-2 max-w-[60ch] font-body text-yealth-grey">
            The list is filtered too tightly. Turn off one button and try again.
          </p>
          <button
            type="button"
            onClick={clearAndScroll}
            className={cn(BTN, "mt-6")}
          >
            Show all again
          </button>
        </div>

        {GROUPS.map((group) => {
          const groupHasVisible = NUMBERED.some(
            (w) => w.group === group.key && isVisible(w)
          );
          return (
            <section key={group.id} id={group.id} hidden={!groupHasVisible}>
              <motion.div {...scrollFade(0)} className="pt-12">
                <h2 className="font-heading text-[26px] font-bold leading-[1.2] text-yealth-offwhite md:text-4xl">
                  {group.heading}
                </h2>
                <p className="mt-2 max-w-[60ch] font-body text-yealth-grey">
                  {group.intro}
                </p>
              </motion.div>

              {group.subs.map((sub, subIndex) => {
                const rows = NUMBERED.filter(
                  (w) => w.group === group.key && w.sub === subIndex
                );
                const subHasVisible = rows.some(isVisible);
                return (
                  <motion.div
                    key={sub.heading + subIndex}
                    {...scrollFade(0.08 + subIndex * 0.06)}
                    className="mt-8"
                    hidden={!subHasVisible}
                  >
                    <h3
                      className={cn(
                        "border-b pb-2 font-heading text-lg font-bold leading-[1.2] md:text-[22px]",
                        HAIRLINE,
                        sub.farm ? "text-yealth-mint" : "text-yealth-gold"
                      )}
                    >
                      {sub.heading}
                    </h3>
                    <p className="mt-2 font-body text-sm text-yealth-grey md:text-base">
                      {sub.note}
                    </p>
                    <ul className="mt-4 list-none">
                      {rows.map((way) => (
                        <WayRow
                          key={way.n}
                          way={way}
                          hidden={!isVisible(way)}
                        />
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </section>
          );
        })}

        {/* Prep */}
        <motion.section
          {...scrollFade(0)}
          id="prep"
          className={cn("mt-12 border-t border-l-2 border-l-yealth-mint py-12 pl-6", HAIRLINE)}
        >
          <h2 className="font-heading text-[26px] font-bold leading-[1.2] text-yealth-mint md:text-4xl">
            Read This Before You Start
          </h2>
          <ul className="mt-4 max-w-[60ch] list-disc pl-6 font-body text-yealth-grey marker:text-yealth-mint">
            {PREP_POINTS.map((point) => (
              <li key={point.lead} className="mt-2">
                <strong className="font-semibold text-yealth-offwhite">
                  {point.lead}
                </strong>{" "}
                {point.rest}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Walk away */}
        <motion.section
          {...scrollFade(0)}
          className={cn("mt-12 border-t py-12", HAIRLINE)}
        >
          <h2 className="font-heading text-[26px] font-bold leading-[1.2] text-yealth-offwhite md:text-4xl">
            Things To Walk Away From
          </h2>
          <p className="mt-4 max-w-[60ch] font-body text-yealth-grey">
            Every one of these is active in Mauritius right now and every one of
            them targets women who need money quickly.
          </p>
          <ul className="mt-4 max-w-[60ch] list-disc pl-6 font-body text-yealth-grey">
            {WALK_AWAY_POINTS.map((point) => (
              <li key={point.lead} className="mt-2">
                <strong className="font-semibold text-yealth-offwhite">
                  {point.lead}
                </strong>{" "}
                {point.rest}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* CTA. id="contact" suppresses the global floating Apply Now while this
            section is on screen, so it never overlaps the page's own CTA. */}
        <motion.section
          {...scrollFade(0)}
          id="contact"
          className={cn(
            "mt-12 rounded-yealth border bg-yealth-black/40 p-8 backdrop-blur-sm",
            HAIRLINE
          )}
        >
          <h2 className="font-heading text-[26px] font-bold leading-[1.2] text-yealth-gold md:text-4xl">
            You Only Need One
          </h2>
          <p className="mt-4 max-w-[52ch] font-body text-yealth-grey">
            Sixty six is not a to do list. Pick the single option that matches
            what you have today, and give it thirty days before you judge it.
          </p>
          <a href={CTA_HREF} className={cn(BTN, "mt-6")}>
            I&apos;m curious about yealth, click to visit
          </a>
        </motion.section>

        {/* Page disclaimer, above the site footer. */}
        <motion.div
          {...scrollFade(0)}
          className={cn("mt-12 border-t py-12", HAIRLINE)}
        >
          <p className="max-w-[60ch] font-body text-sm text-yealth-grey">
            This page is information for people in Mauritius looking for home
            based work. It is not a job offer and it is not financial advice.
            Rules on food handling, childcare and business registration change,
            so confirm with the relevant ministry before you trade.
          </p>
        </motion.div>
      </div>
    </>
  );
}

/** Source .btn: Quicksand 600, gold ground, dark ink. */
const BTN =
  "inline-block cursor-pointer rounded-yealth bg-yealth-gold px-5 py-3.5 font-heading text-base font-semibold text-yealth-black transition-colors duration-150 hover:bg-yealth-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yealth-gold";

function Counter({
  count,
  prefersReduced,
}: {
  count: number;
  prefersReduced: boolean;
}) {
  const [pulse, setPulse] = useState(false);

  // Source: apply() adds .pulse and strips it 180ms later, on load and on every
  // filter click. transform:scale(1.08) over a .18s ease transition.
  useEffect(() => {
    if (prefersReduced) return;
    setPulse(true);
    const t = window.setTimeout(() => setPulse(false), 180);
    return () => window.clearTimeout(t);
  }, [count, prefersReduced]);

  return (
    <div
      // Accessibility addition, not a port. The count is the only feedback a
      // filter click gives, and the source has no live region at all. The
      // wrapper carries it so the number and its label announce as one update.
      aria-live="polite"
      className={cn(
        "mt-8 flex flex-wrap items-baseline gap-4 rounded-yealth border bg-yealth-black/40 p-6 backdrop-blur-sm",
        HAIRLINE
      )}
    >
      <span
        className={cn(
          "font-body text-5xl font-semibold leading-none tabular-nums text-yealth-gold transition-transform duration-[180ms] ease-[ease] md:text-6xl",
          pulse ? "scale-[1.08]" : "scale-100"
        )}
      >
        {count}
      </span>
      <span className={cn(EYEBROW, "text-yealth-grey")}>
        {count === 1 ? "Way showing" : "Ways showing"}
      </span>
    </div>
  );
}

function Pill({
  pressed,
  clear,
  onClick,
  children,
}: {
  pressed?: boolean;
  clear?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      // The clear pill carries no aria-pressed in the source: it is an action,
      // not a toggle.
      aria-pressed={clear ? undefined : pressed}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-4 py-2 font-heading text-sm font-semibold transition-colors duration-150 md:text-base",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yealth-gold",
        HAIRLINE,
        clear
          ? "bg-transparent text-yealth-grey hover:border-yealth-mint hover:text-yealth-mint"
          : pressed
            ? "border-yealth-gold bg-yealth-gold text-yealth-black hover:border-yealth-mint hover:bg-yealth-mint"
            : "bg-transparent text-yealth-offwhite hover:border-yealth-gold hover:text-yealth-gold"
      )}
    >
      {children}
    </button>
  );
}

function WayRow({ way, hidden }: { way: NumberedWay; hidden: boolean }) {
  // Source: chips exclude 'remote', which stays a filter-only tag.
  const chips = way.tags.filter((t) => t !== "remote");
  const prompt = buildPrompt(way.group, way.intro, way.asks);

  return (
    <li
      hidden={hidden}
      className={cn("flex items-start gap-4 border-b py-4", HAIRLINE)}
    >
      <span className="min-w-[24px] pt-0.5 font-body text-sm font-semibold tabular-nums text-yealth-grey">
        {way.n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-body font-semibold text-yealth-offwhite">
          {way.name}
        </div>

        {chips.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {chips.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-full border border-white/10 bg-white/[0.04] px-2 font-heading text-sm font-medium md:text-base",
                  t === "fast" ? "text-yealth-mint" : "text-yealth-grey"
                )}
              >
                {TAG_LABEL[t]}
              </span>
            ))}
          </div>
        ) : null}

        <details className="group mt-4">
          <summary
            className={cn(
              "inline-flex cursor-pointer list-none items-center gap-2 font-heading text-sm font-semibold text-yealth-gold md:text-base",
              "[&::-webkit-details-marker]:hidden",
              "before:h-2 before:w-2 before:-rotate-45 before:border-b-2 before:border-r-2 before:border-yealth-gold before:transition-transform before:duration-150 before:content-['']",
              "group-open:before:rotate-45"
            )}
          >
            Get a step by step plan
          </summary>
          <div
            className={cn(
              "mt-4 rounded-yealth border border-white/10 bg-white/[0.04] p-4"
            )}
          >
            <p className="mb-4 font-body text-sm text-yealth-grey">
              Copy this and paste it into ChatGPT or Claude.
            </p>
            <pre className="whitespace-pre-wrap break-words font-body text-base leading-normal text-yealth-offwhite">
              {prompt}
            </pre>
            <CopyButton text={prompt} />
          </div>
        </details>
      </div>
    </li>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  // Source copyText/fallbackCopy, unchanged in behaviour: clipboard API first,
  // an off-screen textarea plus execCommand when it is missing or rejects, and
  // a 2000ms reset of the button.
  const done = () => {
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const fallbackCopy = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch {
      // Source swallows this too. The textarea is still removed below.
    }
    document.body.removeChild(ta);
  };

  const copy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        BTN,
        "mt-4 px-4 py-2 text-sm",
        copied && "bg-yealth-mint hover:bg-yealth-mint"
      )}
    >
      {copied ? "Copied" : "Copy prompt"}
    </button>
  );
}
