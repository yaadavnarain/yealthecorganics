import YealthFlywheel from "@/app/components/YealthFlywheel";
import YealthFlywheelDepth from "@/app/components/YealthFlywheelDepth";
import YealthFlywheelIso from "@/app/components/YealthFlywheelIso";
import YealthFlywheelCinema from "@/app/components/YealthFlywheelCinema";
import YealthFlywheelD from "@/app/components/YealthFlywheelD";

export const metadata = {
  title: "Animation Lab — Yealth",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    name: "Original (live baseline)",
    description: "The flat 2D version currently shipped on the live hero.",
    Component: YealthFlywheel,
  },
  {
    name: "Variant A — Depth & light",
    description:
      "Gradient-lit coins with specular highlights and edge thickness, material-shaded farms and wallet, soft elliptical ground shadows.",
    Component: YealthFlywheelDepth,
  },
  {
    name: "Variant B — Isometric build",
    description:
      "Everything in A, plus isometric farm structures with top and side faces, and coins that scale toward the viewer mid-flight with their ground shadow shrinking in sync.",
    Component: YealthFlywheelIso,
  },
  {
    name: "Variant C — Cinematic depth",
    description:
      "Everything in A, plus a distant desaturated farm back row, eased (ease-in-out) flight curves, and a subtle breathing of the whole composition.",
    Component: YealthFlywheelCinema,
  },
  {
    name: "Variant D — 3D greenhouse & wallet",
    description:
      "Fully redesigned artwork: gabled glasshouses with dimensional frames and aquaponics raft rows of lettuce inside, plus a rounded 3D charcoal wallet with gold strap and clasp.",
    Component: YealthFlywheelD,
  },
];

export default function AnimationLabPage() {
  return (
    <main className="min-h-screen bg-yealth-black text-yealth-offwhite font-body">
      {/* the global AmbientParticles canvas would pollute the comparison —
          the lab needs a pure #0A0A0A backdrop, so hide it on this page */}
      <style
        dangerouslySetInnerHTML={{ __html: "canvas.fixed{display:none}" }}
      />
      <div className="mx-auto max-w-[900px] px-6 py-16">
        <h1 className="font-heading text-3xl font-bold text-yealth-gold">
          Animation Lab
        </h1>
        <p className="mt-2 text-sm text-yealth-offwhite/60">
          Private side-by-side comparison of enhanced flywheel hero variants.
          Same 32s timeline, story beats, and labels in every version — only
          the rendering differs. Not linked from the site, not indexed.
        </p>

        {VARIANTS.map(({ name, description, Component }) => (
          <section key={name} className="mt-16">
            <h2 className="font-heading text-xl font-bold text-yealth-offwhite">
              {name}
            </h2>
            <p className="mt-1 mb-6 text-sm text-yealth-offwhite/60">
              {description}
            </p>
            <div className="rounded-yealth border border-yealth-offwhite/10 bg-yealth-black p-4 md:p-8">
              <Component />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
