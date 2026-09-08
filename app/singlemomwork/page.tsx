import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { SingleMomWorkSections } from "@/app/singlemomwork/singlemomwork-sections";

export const metadata = {
  title: "66 Ways To Earn From Home In Mauritius | yealth",
  description:
    "Sixty-six ways to earn money from your house in Mauritius. Filter by what you actually have right now, and copy a ready made prompt to get a step by step plan.",
};

export default function SingleMomWorkPage() {
  return (
    // overflow-x-clip, not the overflow-x-hidden that /pricing uses. Measured:
    // overflow-x:hidden computes overflow-y to auto, which makes this div a
    // scroll container, and the filter bar's position:sticky then sticks to it
    // instead of the viewport, so the bar scrolled away entirely. overflow:clip
    // gives the same horizontal guard without creating a scroll container.
    <div className="min-h-screen overflow-x-clip bg-yealth-black text-yealth-offwhite">
      <Navbar />
      <main>
        <SingleMomWorkSections />
      </main>
      <Footer />
    </div>
  );
}
