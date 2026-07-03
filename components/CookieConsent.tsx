"use client";
import { useEffect, useState } from "react";
const CONSENT_KEY = "yealth-cookie-consent";
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (!localStorage.getItem(CONSENT_KEY)) setVisible(true); }, []);
  const choose = (v: "accepted" | "declined") => {
    localStorage.setItem(CONSENT_KEY, v);
    setVisible(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: v }));
  };
  if (!visible) return null;
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-[#1D1C1F]/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-sm leading-relaxed text-[#FFFFF4]/90" style={{ fontFamily: "Nunito, sans-serif" }}>
          We use cookies to see how visitors use the site and improve it. You can accept or decline non-essential analytics.
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => choose("declined")} style={{ fontFamily: "Quicksand, sans-serif" }}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-[#FFFFF4] transition-colors duration-200 hover:border-[#34D399] hover:text-[#34D399] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34D399]">
            Decline
          </button>
          <button onClick={() => choose("accepted")} style={{ fontFamily: "Quicksand, sans-serif" }}
            className="rounded-full bg-[#F5C842] px-4 py-2 text-sm font-bold text-[#1D1C1F] transition-colors duration-200 hover:bg-[#34D399] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34D399]">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
