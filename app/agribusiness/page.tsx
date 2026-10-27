import { Navbar } from "@/app/components/navbar";
import { BrandEquation } from "@/app/components/yealth-equation";
import { Footer } from "@/app/components/footer";
import { AgribusinessHero } from "./hero";

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-yealth-black text-yealth-offwhite">
      <Navbar />
      <main>
        <AgribusinessHero />
        <BrandEquation />
        <section aria-labelledby="farm-tour-title" className="mx-auto max-w-[1100px] px-6 py-16 md:px-8 md:py-24">
          <h2 id="farm-tour-title" className="mb-6 text-center font-heading text-2xl font-bold text-yealth-gold md:text-4xl">Farm Tour Video</h2>
          <div className="flex aspect-video w-full items-center justify-center rounded-yealth border border-white/10 bg-white/[0.04] p-6 text-center">
            <p className="font-body text-base md:text-lg">Farm tour video coming soon.</p>
          </div>
          <div className="mt-10 text-center">
            <button type="button" disabled aria-describedby="agribusiness-reservation-status" className="gold-cta inline-flex items-center justify-center rounded-yealth px-8 py-4 font-heading text-base md:px-10 md:py-5 md:text-lg">
              Reserve my Agribusiness
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
