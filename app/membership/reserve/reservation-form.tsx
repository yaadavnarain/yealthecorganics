"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Check, GripVertical } from "lucide-react";
import { MEMBERSHIP_PERKS, GREEN_PERKS } from "@/lib/membership-perks.mjs";
import { movePerk, validateReservation, isSyntheticReservation } from "@/lib/reservations/validation.mjs";
import styles from "./reservation.module.css";

type Fields = { firstName: string; lastName: string; email: string; phone: string; address: string };
type Errors = Record<string, string>;
const initial: Fields = { firstName: "", lastName: "", email: "", phone: "", address: "" };

export function ReservationForm() {
  const [fields, setFields] = useState(initial);
  const [order, setOrder] = useState(MEMBERSHIP_PERKS.map((perk) => perk.id));
  const [rankingConfirmed, setRankingConfirmed] = useState(false);
  const draggedPerk = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [requestKey, setRequestKey] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [announcement, setAnnouncement] = useState("");
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
      const response = await fetch("/api/membership-reservations", { cache: "no-store", credentials: "same-origin" });
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

  function reorder(id: string, direction: number) {
    const next = movePerk(order, id, direction);
    setOrder(next);
    setRankingConfirmed(false);
    setRequestKey(crypto.randomUUID());
    const perk = MEMBERSHIP_PERKS.find((item) => item.id === id)!;
    setAnnouncement(`${perk.title} moved to priority ${next.indexOf(id) + 1} of 10.`);
    requestAnimationFrame(() => document.getElementById(`perk-${id}`)?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const input = { ...fields, ranking: order, rankingConfirmed };
    const result = validateReservation(input);
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
      const response = await fetch("/api/membership-reservations", {
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
      <p>{mode === "live" ? "Your interest and priorities have been recorded. No payment was taken and membership activation is not guaranteed." : "These synthetic details were saved locally on this laptop. No real reservation was made, no payment was taken and no messages were sent."}</p>
      <a href="https://yealth.mu/membership">Back to yealth Membership <ArrowUpRight size={18} aria-hidden="true" /></a>
    </div>
  );

  const invalid = Object.values(errors).some(Boolean);
  return (
    <form noValidate onSubmit={submit} className={styles.form} data-clarity-mask="true">
      <noscript><p className={styles.error}>JavaScript is needed for ranking and submission. No details are saved without it.</p></noscript>
      {(invalid || message) && (
        <div ref={summary} tabIndex={-1} className={styles.errorSummary} role="alert">
          <strong>{message || "Please check the following fields."}</strong>
          {invalid && <ul>{Object.entries(errors).filter(([, value]) => value).map(([key, value]) => <li key={key}><a href={`#${key}`}>{value}</a></li>)}</ul>}
          {!token && <button type="button" onClick={() => void prepare()}>Try again</button>}
        </div>
      )}
      <fieldset disabled={pending}>
        <legend className={styles.formTitle}>Membership Reservation Form</legend>
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
            <p id="address-help" className={styles.help}>Residential address for delivery planning.</p>
            {errors.address && <p id="address-error" className={styles.error}>{errors.address}</p>}
          </div>
        </div>
        <div className={styles.trap} aria-hidden="true">
          <label htmlFor="website">Website</label><input ref={honeypot} id="website" name="website" autoComplete="off" tabIndex={-1} />
        </div>
      </fieldset>

      <fieldset disabled={pending} id="ranking">
        <legend>Your priorities</legend>
        <p className={styles.instructions}>Rank all ten perks from most important to least important. Priority 1 is your highest.</p>
        <p className={styles.live} aria-live="polite" aria-atomic="true">{announcement}</p>
        <ol className={styles.ranking}>
          {order.map((id, index) => {
            const perk = MEMBERSHIP_PERKS.find((item) => item.id === id)!;
            return (
              <li key={id} id={`perk-${id}`} data-perk={id} tabIndex={-1} className={styles.rankItem}>
                <span className={GREEN_PERKS.has(id) ? styles.greenRank : styles.rank} aria-label={`Priority ${index + 1}`}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.rankCopy}><h3>{perk.title}</h3><p>{perk.description}</p></div>
                <div className={styles.moveButtons}>
                  <button type="button" className={styles.dragHandle} aria-label={`Drag ${perk.title} to reorder`}
                    onPointerDown={(event) => { draggedPerk.current = id; event.currentTarget.setPointerCapture(event.pointerId); }}
                    onPointerUp={(event) => {
                      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-perk]")?.dataset.perk;
                      event.currentTarget.releasePointerCapture(event.pointerId);
                      const from = order.indexOf(draggedPerk.current || "");
                      const to = order.indexOf(target || "");
                      draggedPerk.current = null;
                      if (from < 0 || to < 0 || from === to) return;
                      const next = [...order];
                      next.splice(to, 0, next.splice(from, 1)[0]);
                      setOrder(next); setRankingConfirmed(false); setRequestKey(crypto.randomUUID());
                      setAnnouncement(`${perk.title} moved to priority ${to + 1} of 10.`);
                      requestAnimationFrame(() => document.getElementById(`perk-${id}`)?.focus());
                    }} onPointerCancel={() => { draggedPerk.current = null; }}><GripVertical size={18} aria-hidden="true" /></button>
                  <button type="button" disabled={index === 0} onClick={() => reorder(id, -1)} aria-label={`Move ${perk.title} up`}><ArrowUp size={18} aria-hidden="true" /></button>
                  <button type="button" disabled={index === order.length - 1} onClick={() => reorder(id, 1)} aria-label={`Move ${perk.title} down`}><ArrowDown size={18} aria-hidden="true" /></button>
                </div>
              </li>
            );
          })}
        </ol>
        {errors.ranking && <p className={styles.error}>{errors.ranking}</p>}
        <label className={styles.check} htmlFor="rankingConfirmed">
          <input id="rankingConfirmed" type="checkbox" checked={rankingConfirmed} onChange={(event) => { setRankingConfirmed(event.target.checked); setRequestKey(crypto.randomUUID()); }} required aria-invalid={Boolean(errors.rankingConfirmed)} aria-describedby={errors.rankingConfirmed ? "rankingConfirmed-error" : undefined} />
          <span>This order reflects my priorities, from most to least important.</span>
        </label>
        {errors.rankingConfirmed && <p id="rankingConfirmed-error" className={styles.error}>{errors.rankingConfirmed}</p>}
      </fieldset>

      <div className={styles.privacy}>
        <h2>Disclaimer:</h2>
        <p>This form records interest only. No payment is collected and membership activation is not guaranteed.</p>
      </div>
      <button className={styles.submit} type="submit" disabled={pending || !token}>
        {pending ? "Submitting…" : "Submit"}<ArrowUpRight size={20} aria-hidden="true" />
      </button>
    </form>
  );
}
