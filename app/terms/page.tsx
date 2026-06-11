import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Yealth",
  description: "The terms governing your use of yealth.mu.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-white/50 mb-12">Last updated: 1 June 2026</p>

        <p className="mb-8">
          These Terms govern your use of yealth.mu, operated by Yealth
          (&quot;we&quot;, &quot;us&quot;), a company registered in the Republic
          of Mauritius. By using this site you accept these Terms.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">About this site</h2>
        <p className="mb-8">
          This website is informational. It introduces Yealth&apos;s farming
          opportunity and lets you join a waitlist for an informational webinar.
          Submitting the form is not a binding commitment and does not create any
          investment, contract, or obligation on either side.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">
          Not an offer or financial advice
        </h2>
        <p className="mb-8">
          Nothing on this site is an offer to sell, a solicitation to invest, or
          financial, legal, or tax advice. Any formal offer or investment terms
          will be provided separately through proper documentation. You should
          seek independent professional advice before making any financial
          decision.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">No guarantees</h2>
        <p className="mb-8">
          Any figures, projections, income references, or amounts shown are
          illustrative only and are not promises or guarantees of future
          results. All investments carry risk, including the possible loss of
          money. Past or projected performance does not indicate future results.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">Eligibility</h2>
        <p className="mb-8">
          You must be at least 18 and legally able to enter a contract to use
          this site.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">
          Intellectual property
        </h2>
        <p className="mb-8">
          All content on this site is owned by Yealth and may not be copied or
          reused without permission.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">
          Limitation of liability
        </h2>
        <p className="mb-8">
          To the extent permitted by law, Yealth is not liable for any loss
          arising from your use of, or reliance on, this site.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">Governing law</h2>
        <p className="mb-8">
          These Terms are governed by the laws of the Republic of Mauritius.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">Changes</h2>
        <p className="mb-8">
          We may update these Terms and will revise the date above when we do.
        </p>

        <h2 className="font-heading text-2xl mt-10 mb-3">Contact</h2>
        <p className="mb-8">
          Message us on{" "}
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
