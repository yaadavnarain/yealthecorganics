import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { IncomeCalculator } from "@/app/components/income-calculator";
import { Glow } from "@/app/components/ui/glow";

export const metadata = {
  title: "Income Calculator — Yealth",
  description:
    "See your projected monthly farm income, total cash earned, and the extra home loan it unlocks — by plan and by year, up to 40 years out.",
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-yealth-black text-yealth-offwhite">
      <Navbar />
      <main className="relative overflow-hidden">
        <Glow
          variant="gold"
          className="left-1/2 top-[-300px] h-[700px] w-[1100px] -translate-x-1/2"
        />
        <div className="relative z-10 px-4 pt-28 pb-16 md:pt-32 md:pb-24">
          <IncomeCalculator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
