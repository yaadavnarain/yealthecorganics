import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { PricingSections } from "@/app/pricing/pricing-sections";

export const metadata = {
  title: "yealth Membership",
  description:
    "Farm-to-table ready-to-eat salads delivered to your home every week, and access to paid work and business opportunities.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-yealth-black text-yealth-offwhite">
      <Navbar />
      <main>
        <PricingSections />
      </main>
      <Footer />
    </div>
  );
}
