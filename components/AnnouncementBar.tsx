"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const DISMISS_KEY = "yealth_announce_fundraise_v1";

export default function AnnouncementBar() {
  // Starts false on purpose. localStorage is not readable on the server, so
  // reading it during render would make the server and client markup disagree.
  // The effect below turns the bar on after mount instead.
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
    } catch {
      // Storage blocked, for example private mode. Show the bar anyway.
      setVisible(true);
    }
  }, []);

  // The navbar is position fixed at top 0, so it would sit on top of this bar.
  // Publishing the bar's real height as --announce-h lets the navbar offset
  // itself by exactly that much. Measured rather than hard coded, because the
  // bar is one line on desktop and two lines on a phone.
  useEffect(() => {
    const root = document.documentElement;
    const node = barRef.current;

    if (!visible || !node) {
      root.style.setProperty("--announce-h", "0px");
      return;
    }

    const publish = () =>
      root.style.setProperty(
        "--announce-h",
        `${node.getBoundingClientRect().height}px`,
      );

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(node);

    return () => {
      observer.disconnect();
      root.style.setProperty("--announce-h", "0px");
    };
  }, [visible]);

  if (!visible) return null;

  const dismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    // The button is a sibling of the anchor, not a child, so no click should
    // reach the link. These two calls are a guard, not the mechanism.
    e.preventDefault();
    e.stopPropagation();
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage blocked. The bar still hides for this page view.
    }
    setVisible(false);
  };

  return (
    <div
      ref={barRef}
      className="sticky top-0 z-50 w-full bg-yealth-gold text-yealth-black"
    >
      <a
        href="https://wa.me/23055111364?text=Shareholder"
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer py-[10px] pl-3 pr-10 text-center font-heading text-[14px] font-bold leading-snug transition-[filter] duration-200 hover:brightness-95 md:pl-4 md:text-[15px]"
      >
        yealth is fundraising. Shareholder opportunities are now open.{" "}
        <span className="underline">Learn more.</span>
      </a>

      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={dismiss}
        className="absolute right-1 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-yealth-black transition-colors duration-200 hover:bg-yealth-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yealth-black md:right-2"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
