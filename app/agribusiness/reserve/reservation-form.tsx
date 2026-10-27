"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { CONTRIBUTIONS, validateAgribusinessReservation } from "@/lib/reservations/agribusiness-validation.mjs";
import { isSyntheticReservation } from "@/lib/reservations/validation.mjs";
import styles from "../../membership/reserve/reservation.module.css";

type Fields = { firstName: string; lastName: string; email: string; phone: string; address: string };
type Errors = Record<string, string>;
const initial: Fields = { firstName: "", lastName: "", email: "", phone: "", address: "" };

export function ReservationForm() {
  const [fields, setFields] = useState(initial);
  const [contribution, setContribution] = useState<number | null>(null);
  const [token, setToken] = useState("");
  const [requestKey, setRequestKey] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<"local-test" | "live">("local-test");
  const honeypot = useRef<HTMLInputElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLDivElement>(null);

  async function prepare() {
    setMessage("");
    setToken("");
    try {
      const response = await fetch("/api/agribusiness-reservations", { cache: "no-store", credentials: "same-origin" });
      const data = await response.json();
      if (!response.ok || !data.token || !["local-test", "live"].includes(data.mode)) throw new Error("Storage unavailable");
      setMode(data.mode);
      setToken(data.token);
      setRequestKey(crypto.randomUUID());
    } catch {
      setMessage("Reservation storage is unavailable. Nothing can be saved right now. Please try again later.");
    }
  }

  useEffect(() => { void prepare(); }, []);

  function changeField(key: keyof Fields, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
    setRequestKey(crypto.randomUUID());
    setErrors((previous) => ({ ...previous, [key]: "" }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const input = { ...fields, contribution };
    const result = validateAgribusinessReservation(input);
    const nextErrors: Errors = { ...result.errors };
    const syntheticOnly = isSyntheticReservation({ ...fields, email: fields.email.trim().toLowerCase(), address: fields.address.trim() });
    if (mode === "local-test" && !syntheticOnly) nextErrors.form = "Live reservations are not available yet. No details were saved.";
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setErrors({});
    setMessage("");
    setPending(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/agribusiness-reservations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "same-origin", signal: controller.signal,
        body: JSON.stringify({ ...input, syntheticOnly, token, requestKey, website: honeypot.current?.value || "" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors || {});
        setMessage(data.message || "Could not save. Your entries are still here; please try again.");
        requestAnimationFrame(() => summary.current?.focus());
        return;
      }
      if (data.mode !== mode) throw new Error("Unexpected response");
      setSaved(true);
      setFields(initial);
      requestAnimationFrame(() => success.current?.focus());
    } catch {
      setMessage("The connection was interrupted. Your entries are still here. Try again; duplicate attempts will not create another reservation.");
      requestAnimationFrame(() => summary.current?.focus());
    } finally {
      clearTimeout(timeout);
      setPending(false);
    }
  }

  if (saved) return (
    <div ref={success} tabIndex={-1} className={styles.success} role="status">
      <Check aria-hidden="true" size={36} />
      <h2>{mode === "live" ? "Reservation received." : "Test details saved."}</h2>
      <p>{mode === "live" ? "Your interest and stated monthly contribution potential have been recorded. No payment was taken and no farm allocation or ownership is guaranteed." : "These synthetic details were saved locally on this laptop. No real reservation was made, no payment was taken and no messages were sent."}</p>
      <a href="https://yealth.mu/agribusiness">Back to yealth Agribusiness <ArrowUpRight size={18} aria-hidden="true" /></a>
    </div>
  );

  const invalid = Object.values(errors).some(Boolean);
  return (
    <form noValidate onSubmit={submit} className={styles.form} data-clarity-mask="true">
      <noscript><p className={styles.error}>JavaScript is needed for submission. No details are saved without it.</p></noscript>
      {(invalid || message) && (
        <div ref={summary} tabIndex={-1} className={styles.errorSummary} role="alert">
          <strong>{message || "Please check the following fields."}</strong>
          {invalid && <ul>{Object.entries(errors).filter(([, value]) => value).map(([key, value]) => <li key={key}><a href={`#${key}`}>{value}</a></li>)}</ul>}
          {!token && <button type="button" onClick={() => void prepare()}>Try again</button>}
        </div>
      )}
      <fieldset disabled={pending}>
        <legend className={styles.formTitle}>Agribusiness Reservation Form</legend>
        <div className={styles.fields}>
          {([
            ["firstName", "First name", "text", "given-name", 80],
            ["lastName", "Last name", "text", "family-name", 80],
            ["email", "Email", "email", "email", 254],
            ["phone", "Phone", "text", "tel", 40],
          ] as const).map(([key, label, type, autoComplete, maxLength]) => (
            <div key={key}>
              <label htmlFor={key}>{label} <span>(required)</span></label>
              <input id={key} name={key} type={type} autoComplete={autoComplete} maxLength={maxLength} required
                value={fields[key]} onChange={(event) => changeField(key, event.target.value)}
                aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : key === "phone" ? "phone-help" : undefined} />
              {key === "phone" && <p id="phone-help" className={styles.help}>International phone numbers allowed if you are abroad</p>}
              {errors[key] && <p id={`${key}-error`} className={styles.error}>{errors[key]}</p>}
            </div>
          ))}
          <div className={styles.wide}>
            <label htmlFor="address">Residential address <span>(required)</span></label>
            <textarea id="address" name="address" autoComplete="street-address" rows={3} required maxLength={500}
              value={fields.address} onChange={(event) => changeField("address", event.target.value)}
              aria-invalid={Boolean(errors.address)} aria-describedby={`address-help${errors.address ? " address-error" : ""}`} />
            <p id="address-help" className={styles.help}>Your residential address.</p>
            {errors.address && <p id="address-error" className={styles.error}>{errors.address}</p>}
          </div>
        </div>
        <div className={styles.trap} aria-hidden="true">
          <label htmlFor="website">Website</label><input ref={honeypot} id="website" name="website" autoComplete="off" tabIndex={-1} />
        </div>
      </fieldset>

      <fieldset disabled={pending} id="contribution" aria-describedby="contribution-help">
        <legend>What is your monthly contribution potential?</legend>
        <p id="contribution-help" className={styles.help}>(We recommend 10-15% of your monthly income max)</p>
        <div className="mt-5 flex flex-col gap-3">
          {CONTRIBUTIONS.map((amount: number) => (
            <label key={amount} className={styles.check}>
              <input type="radio" name="contribution" value={amount} required checked={contribution === amount}
                onChange={() => { setContribution(amount); setRequestKey(crypto.randomUUID()); setErrors(previous => ({ ...previous, contribution: "" })); }}
                aria-invalid={Boolean(errors.contribution)} aria-describedby={errors.contribution ? "contribution-error" : undefined} />
              <span>Rs {amount.toLocaleString("en-US")}/month</span>
            </label>
          ))}
        </div>
        {errors.contribution && <p id="contribution-error" className={styles.error}>{errors.contribution}</p>}
      </fieldset>

      <div className={styles.privacy}>
        <h2>Disclaimer:</h2>
        <p>This form records interest and stated contribution potential only. It does not collect payment, create a recurring charge, allocate a farm, confer ownership or create a binding investment commitment.</p>{/* compliance-ok: expressly excludes any binding commitment; no investment offer */}
      </div>
      <button className={styles.submit} type="submit" disabled={pending || !token}>
        {pending ? "Submitting…" : "Submit"}<ArrowUpRight size={20} aria-hidden="true" />
      </button>
    </form>
  );
}
