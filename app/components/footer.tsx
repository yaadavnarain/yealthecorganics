import Image from "next/image";
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
  { label: "Agribusiness", href: "/agribusiness" },
  { label: "Membership", href: "/membership" },
  { label: "FAQ", href: "/#faq" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

// The before: strip fades the page background into the footer on every page.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-yealth-offwhite/10 bg-yealth-black before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-14 before:bg-gradient-to-b before:from-yealth-black/0 before:to-yealth-black before:content-[''] md:before:h-20">
      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8 md:py-9">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex items-center gap-4">
            <a href="/" className="inline-flex shrink-0 items-center">
              <Image
                src="/images/yealth-mark.png"
                alt="yealth"
                width={683}
                height={336}
                className="h-8 w-auto"
              />
            </a>
            <p className="max-w-[330px] font-body text-sm leading-snug text-yealth-offwhite">
              Real programs. Real ownership. Built for the youth of Mauritius who refuse to wait for a future that never comes.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 font-body text-base">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-block py-1 text-yealth-offwhite transition-colors hover:text-yealth-mint"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
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

        <div className="mt-6 flex flex-col gap-3 border-t border-yealth-offwhite/10 pt-5 font-body text-sm md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <li>
              <a
                href="https://wa.me/23054523432"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1 text-yealth-offwhite transition-colors hover:text-yealth-mint"
              >
                WhatsApp: +230 5452 3432
              </a>
            </li>
            <li>
              <a
                href="tel:86662"
                className="inline-block py-1 text-yealth-offwhite transition-colors hover:text-yealth-mint"
              >
                Hotline: 86662
              </a>
            </li>
            <li>
              <a
                href="mailto:info@yealth.mu"
                className="inline-block py-1 text-yealth-offwhite transition-colors hover:text-yealth-mint"
              >
                info@yealth.mu
              </a>
            </li>
          </ul>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-yealth-offwhite">
            <li>© {year} yealth. Mauritius</li>
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="inline-block py-1 transition-colors hover:text-yealth-mint"
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
