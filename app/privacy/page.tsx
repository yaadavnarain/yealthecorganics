import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Yealth",
  description: "How Yealth handles information collected through yealth.mu.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-yealth-black text-yealth-offwhite font-body">
      <div className="mx-auto max-w-[800px] py-24 px-6 leading-relaxed">
        <Link
          href="/"
          className="text-yealth-gold font-body hover:underline"
        >
          ← Back to home
        </Link>

        <h1 className="font-heading text-yealth-gold text-4xl mt-8 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-white/50 mb-12">Last updated: 1 June 2026</p>

        <p className="mb-8">
          This Privacy Policy explains how Yealth (&quot;we&quot;, &quot;us&quot;), a
          company registered in the Republic of Mauritius, handles information
          collected through yealth.mu.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">
          Information we collect
        </h2>
        <p className="mb-8">
          When you submit our contact form, we collect the name, phone number,
          and any optional message you provide. Our hosting and form providers
          may also collect basic technical data such as your IP address and
          browser type.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">
          How we use your information
        </h2>
        <p className="mb-8">
          We use your details only to contact you about Yealth&apos;s webinars and
          opportunity, and to respond to your enquiry. We do not sell, rent, or
          trade your personal information.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">
          Who we share it with
        </h2>
        <p className="mb-8">
          Your form submissions are processed by Formspree (form delivery) and
          our site is hosted by Vercel. These providers process data on our
          behalf. We otherwise do not share your information except where
          required by law.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">
          Data retention and security
        </h2>
        <p className="mb-8">
          We keep your information only as long as needed for the purposes above
          and apply reasonable measures to protect it.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">Your rights</h2>
        <p className="mb-8">
          Under the Mauritius Data Protection Act 2017, you may request access
          to, correction of, or deletion of your personal data. Contact us on{" "}
          <a
            href="https://wa.me/23054523432"
            className="text-yealth-gold hover:underline"
          >
            WhatsApp (+230 5452 3432)
          </a>
          .
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">Cookies</h2>
        <p className="mb-8">
          We may use basic cookies and analytics to understand site usage. You
          can control cookies through your browser settings.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">Changes</h2>
        <p className="mb-8">
          We may update this policy and will revise the date above when we do.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">Contact</h2>
        <p className="mb-8">
          Questions? Message us on{" "}
          <a
            href="https://wa.me/23054523432"
            className="text-yealth-gold hover:underline"
          >
            WhatsApp
          </a>{" "}
          or call +230 5452 3432.
        </p>
      </div>
    </main>
  );
}
