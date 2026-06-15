import { Navbar } from "@/app/components/navbar";
import { Hero } from "@/app/components/hero";
import { PainSection } from "@/app/components/pain-section";
import { VideoStatsSection } from "@/app/components/video-stats-section";
import { VisionSection } from "@/app/components/vision-section";
import { ProductCardsSection } from "@/app/components/product-cards-section";
import { HowItWorksSection } from "@/app/components/how-it-works-section";
import { ThreePathsSection } from "@/app/components/three-paths-section";
import { FounderSection } from "@/app/components/founder-section";
import { FaqSection } from "@/app/components/faq-section";
import { ContactSection } from "@/app/components/contact-section";
import { FinalCtaSection } from "@/app/components/final-cta-section";
import { Footer } from "@/app/components/footer";

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-yealth-black text-yealth-offwhite">
      <Navbar />
      <main>
        <Hero />
        <PainSection />
        <VideoStatsSection />
        <VisionSection />
        <ProductCardsSection />
        <HowItWorksSection />
        <ThreePathsSection />
        <FounderSection />
        <FaqSection />
        <ContactSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}