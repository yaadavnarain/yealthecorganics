import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Yealth",
  description: "How Yealth handles information collected through yealth.mu.",
};

type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

const BLOCKS: Block[] = [
  { kind: "h", text: "1. Who we are" },
  {
    kind: "p",
    text: `This Privacy Policy explains how yealth ("we", "us", "our") collects and uses personal data through the website yealth.mu. yealth is the data controller responsible for your personal data, which means we decide what data is collected and how it is used. We handle personal data in line with the Data Protection Act 2017 of Mauritius.`,
  },
  { kind: "h", text: "2. What we collect" },
  {
    kind: "p",
    text: `When you reserve your spot through our waitlist form, we collect the information you give us. This is:`,
  },
  {
    kind: "ul",
    items: [
      `your title (for example Mr, Mrs, or Ms), and your first and last name;`,
      `your email address;`,
      `your WhatsApp or phone number;`,
      `your age range;`,
      `the plan you are interested in, which is only an indication and not a commitment; and`,
      `how you heard about us.`,
    ],
  },
  {
    kind: "p",
    text: `We do not ask for, and do not want, sensitive financial details such as bank card or account numbers through this website. We may also collect limited technical information automatically, such as your device type, browser, and general use of the site, through basic cookies and analytics.`,
  },
  { kind: "h", text: "3. How we use your data" },
  { kind: "p", text: `We use your personal data to:` },
  {
    kind: "ul",
    items: [
      `add you to our waitlist and contact you about information sessions, webinars, and updates;`,
      `respond to your questions and requests;`,
      `operate, secure, and improve the website; and`,
      `meet our legal obligations.`,
    ],
  },
  {
    kind: "p",
    text: `We rely on your consent, and on our legitimate interest in running and improving our service, as the basis for this processing. Where we rely on consent, you can withdraw it at any time.`,
  },
  { kind: "h", text: "4. Service providers and where your data is held" },
  {
    kind: "p",
    text: `We use two trusted third-party providers to run this website and collect your responses. Our waitlist form is provided by Tally, which processes your form responses on our behalf on servers located outside Mauritius. This means your personal data may be transferred to and stored in another country. Where this happens, we take steps to ensure your data receives an adequate level of protection, as required by the Data Protection Act 2017. Our website is hosted by cloud.mu, which is based in Mauritius.`,
  },
  { kind: "h", text: "5. Sharing" },
  {
    kind: "p",
    text: `We do not sell your personal data. We share it only with the service providers described above, and where we are required to do so by law or by a competent authority.`,
  },
  { kind: "h", text: "6. How long we keep it" },
  {
    kind: "p",
    text: `We keep your personal data only for as long as we need it for the purposes described in this policy, or for as long as the law requires. When it is no longer needed, we delete it or make it anonymous.`,
  },
  { kind: "h", text: "7. Your rights" },
  {
    kind: "p",
    text: `Under the Data Protection Act 2017, you have the right to ask us to:`,
  },
  {
    kind: "ul",
    items: [
      `confirm whether we hold personal data about you and give you access to it;`,
      `correct data that is inaccurate or incomplete;`,
      `delete your data or stop using it, in certain circumstances; and`,
      `stop sending you marketing messages.`,
    ],
  },
  {
    kind: "p",
    text: `To exercise any of these rights, contact us using the details below. You also have the right to lodge a complaint with the Data Protection Office of Mauritius if you are not satisfied with how we handle your personal data.`,
  },
  { kind: "h", text: "8. Cookies" },
  {
    kind: "p",
    text: `We use a small number of cookies and similar technologies to help the website work and to understand how it is used. You can control or delete cookies through your browser settings. Where the law requires it, we will ask for your consent before using non-essential analytics cookies.`,
  },
  { kind: "h", text: "9. Security" },
  {
    kind: "p",
    text: `We take reasonable technical and organisational measures to protect your personal data. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.`,
  },
  { kind: "h", text: "10. Changes" },
  {
    kind: "p",
    text: `We may update this Privacy Policy from time to time. The current version is always the one published here, and the "last updated" date shows when it last changed.`,
  },
];

const linkClass =
  "text-yealth-gold underline underline-offset-2 transition-colors hover:text-yealth-mint";

export default function PrivacyPage() {
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
          Privacy Policy
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
          11. Contact
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
