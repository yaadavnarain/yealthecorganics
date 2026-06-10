import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  YoutubeIcon,
} from "@/app/components/ui/social-icons";

const SOCIALS = [
  { label: "Facebook", icon: FacebookIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "YouTube", icon: YoutubeIcon, href: "#" },
  { label: "TikTok", icon: TikTokIcon, href: "#" },
  { label: "X", icon: XIcon, href: "#" },
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Secure my spot", href: "#contact" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-yealth-offwhite/10 bg-yealth-black">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <a
              href="#top"
              className="font-heading text-2xl font-bold text-yealth-gold"
            >
              yealth
            </a>
            <p className="mt-4 max-w-[360px] font-body text-base leading-relaxed text-yealth-offwhite/70">
              Real farms. Real income. Built for Gen Z and millennials in Mauritius who refuse to wait for a future that never comes.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-yealth-offwhite/10 text-yealth-offwhite/60 transition-colors hover:border-yealth-mint/40 hover:bg-yealth-mint/5 hover:text-yealth-mint"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-yealth-offwhite/50">
              Explore
            </h3>
            <ul className="mt-4 flex flex-col gap-3 font-body text-base">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-yealth-offwhite/70 transition-colors hover:text-yealth-mint"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-yealth-offwhite/50">
              Get in touch
            </h3>
            <ul className="mt-4 flex flex-col gap-3 font-body text-base">
              <li>
                <a
                  href="mailto:support@yealth.mu"
                  className="text-yealth-offwhite/70 transition-colors hover:text-yealth-mint"
                >
                  support@yealth.mu
                </a>
              </li>
              <li>
                <a
                  href="tel:+23054523432"
                  className="text-yealth-offwhite/70 transition-colors hover:text-yealth-mint"
                >
                  +230 5452 3432
                </a>
              </li>
              <li className="text-yealth-offwhite/70">Mauritius</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-yealth-offwhite/10 pt-8 md:mt-16 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-sm text-yealth-offwhite/50">
            © {year} Muktish. Built with care in Mauritius.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-body text-sm">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-yealth-offwhite/50 transition-colors hover:text-yealth-mint"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}