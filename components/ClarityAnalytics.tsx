"use client";
import { useEffect } from "react";
const CONSENT_KEY = "yealth-cookie-consent";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
function loadClarity(id: string) {
  if (typeof window === "undefined" || (window as any).__clarityLoaded) return;
  (window as any).__clarityLoaded = true;
  (function (c: any, l: any, a: string, r: string, i: string) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r); t.async = true; t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
}
export default function ClarityAnalytics() {
  useEffect(() => {
    if (!CLARITY_ID) return;
    if (localStorage.getItem(CONSENT_KEY) === "accepted") loadClarity(CLARITY_ID);
    const onConsent = (e: Event) => { if ((e as CustomEvent).detail === "accepted") loadClarity(CLARITY_ID); };
    window.addEventListener("cookie-consent-changed", onConsent);
    return () => window.removeEventListener("cookie-consent-changed", onConsent);
  }, []);
  return null;
}
