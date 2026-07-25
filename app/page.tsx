import { Navbar } from "@/app/components/navbar";
import { Hero } from "@/app/components/hero";
import { BrandEquation } from "@/app/components/yealth-equation";
import { PainSection } from "@/app/components/pain-section";
import { SolutionSection } from "@/app/components/solution-section";
import { OutcomesSection } from "@/app/components/outcomes-section";
import { ProductCardsSection } from "@/app/components/product-cards-section";
import { AgribusinessOwnerSection } from "@/app/components/agribusiness-owner-section";
import { HowItWorksSection } from "@/app/components/how-it-works-section";
import { FounderSection } from "@/app/components/founder-section";
import { FaqSection } from "@/app/components/faq-section";
import { FinalCtaSection } from "@/app/components/final-cta-section";
import { Footer } from "@/app/components/footer";

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-yealth-black text-yealth-offwhite">
      <Navbar />
      <main>
        <Hero />
        <BrandEquation />
        <PainSection />
        <SolutionSection />
        <OutcomesSection />
        <ProductCardsSection />
        <AgribusinessOwnerSection />
        <HowItWorksSection />
        <FounderSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
