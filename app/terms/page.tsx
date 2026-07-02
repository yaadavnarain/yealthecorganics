import Link from "next/link";

export const metadata = {
  title: "Terms of Use — Yealth",
  description: "The terms governing your use of yealth.mu.",
};

type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

const BLOCKS: Block[] = [
  { kind: "h", text: "1. About this website" },
  {
    kind: "p",
    text: `This website at yealth.mu is operated by yealth ("we", "us", "our"). It is informational: it exists to explain what we are building, let you learn about our farm co-ownership model, and allow you to join a waitlist and register interest in an information session or webinar.`,
  },
  { kind: "h", text: "2. Not an offer and not financial advice" },
  { kind: "p", text: `Nothing on this website is:` },
  {
    kind: "ul",
    items: [
      `an offer to sell, or a solicitation of an offer to buy, any security, share, unit, or financial product;`,
      `a prospectus or an invitation to the public to acquire or subscribe for any interest; or`,
      `financial, legal, tax, or accounting advice.`,
    ],
  },
  {
    kind: "p",
    text: `The information here is general and does not take account of your personal circumstances. You should obtain your own independent professional advice before making any financial decision. Any terms on which you may one day become a co-owner or member will be set out in separate written agreements, provided to you directly, which will govern that relationship.`,
  },
  { kind: "h", text: "3. Joining the waitlist" },
  {
    kind: "p",
    text: `Submitting a form on this website adds you to our waitlist and lets us contact you. It is not a binding commitment by you or by us. It does not create any contract, membership, ownership interest, or obligation, and it does not require any payment. We may contact you by WhatsApp, phone, or email about information sessions, webinars, and updates. You can ask us to stop contacting you at any time.`,
  },
  { kind: "h", text: "4. No guarantees" },
  {
    kind: "p",
    text: `Any figures, amounts, projections, timelines, or references to income shown anywhere on this website are illustrative examples only. They are not promises, forecasts, or guarantees of any future result. Co-ownership of a farming business carries risk, including the risk that the business does not perform as hoped and the risk of loss. Projected performance is not a reliable indicator of actual future performance.`,
  },
  { kind: "h", text: "5. Eligibility" },
  {
    kind: "p",
    text: `This website is intended for people aged 18 and over. By using it, you confirm that you are at least 18 years old and that any information you give us is true and belongs to you.`,
  },
  { kind: "h", text: "6. Acceptable use" },
  {
    kind: "p",
    text: `You agree to use this website lawfully. You must not interfere with its operation, attempt to gain unauthorised access to it, or use it to send anything harmful or unlawful.`,
  },
  { kind: "h", text: "7. Intellectual property" },
  {
    kind: "p",
    text: `The yealth name, logo, text, graphics, and design on this website belong to yealth or its licensors. You may view and share these pages, but you may not copy, reproduce, or use our branding or content for commercial purposes without our written permission.`,
  },
  { kind: "h", text: "8. Third-party links and tools" },
  {
    kind: "p",
    text: `This website may link to or rely on third-party services, such as messaging tools and online form providers. We are not responsible for the content, availability, or practices of those services, and your use of them is governed by their own terms.`,
  },
  { kind: "h", text: "9. Limitation of liability" },
  {
    kind: "p",
    text: `This website is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of, or reliance on, this website or its content. Nothing in these terms limits any liability that cannot be limited under the law of Mauritius.`,
  },
  { kind: "h", text: "10. Changes" },
  {
    kind: "p",
    text: `We may update this website and these terms at any time. The version published here is the current one, and the "last updated" date shows when it last changed. Please review this page from time to time.`,
  },
  { kind: "h", text: "11. Governing law" },
  {
    kind: "p",
    text: `These terms are governed by the laws of the Republic of Mauritius, and the courts of Mauritius have jurisdiction over any dispute relating to them or to this website.`,
  },
];

const linkClass =
  "text-yealth-gold underline underline-offset-2 transition-colors hover:text-yealth-mint";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-yealth-black text-yealth-offwhite font-body">
      <div className="mx-auto max-w-[800px] px-6 py-24 leading-relaxed">
        <Link
          href="/"
          className="font-body text-yealth-gold transition-colors hover:text-yealth-mint"
        >
          ← Back to home
        </Link>

        <h1 className="mt-8 mb-2 font-heading text-4xl text-yealth-gold">
          Terms of Use
        </h1>
        <p className="mb-12 text-sm text-yealth-offwhite/50">
          Last updated 2 July 2026
        </p>

        {BLOCKS.map((block, i) => {
          if (block.kind === "h") {
            return (
              <h2
                key={i}
                className="mt-10 mb-3 font-heading text-xl font-bold text-yealth-offwhite md:text-2xl"
              >
                {block.text}
              </h2>
            );
          }
          if (block.kind === "ul") {
            return (
              <ul
                key={i}
                className="mb-6 list-disc space-y-2 pl-6 text-yealth-offwhite/85"
              >
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="mb-6 text-yealth-offwhite/85">
              {block.text}
            </p>
          );
        })}

        <h2 className="mt-10 mb-3 font-heading text-xl font-bold text-yealth-offwhite md:text-2xl">
          12. Contact
        </h2>
        <div className="mb-6 space-y-1 text-yealth-offwhite/85">
          <p>yealth</p>
          <p>
            WhatsApp / phone:{" "}
            <a href="tel:+23054523432" className={linkClass}>
              +230 5452 3432
            </a>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:info@yealth.mu" className={linkClass}>
              info@yealth.mu
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
