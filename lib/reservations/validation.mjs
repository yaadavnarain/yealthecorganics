import { MEMBERSHIP_PERKS } from "../membership-perks.mjs";

export const PERK_IDS = MEMBERSHIP_PERKS.map((perk) => perk.id);

/** Validate on both sides of the API. Never return submitted values in errors. */
export function validateReservation(input) {
  const errors = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: { form: "Please check the form and try again." } };
  }
  const text = (key) => typeof input[key] === "string" ? input[key].trim().normalize("NFC") : "";
  const firstName = text("firstName");
  const lastName = text("lastName");
  const email = text("email").toLowerCase();
  const phone = text("phone").replace(/[\s().-]/g, "");
  const address = text("address").replace(/\r\n/g, "\n");
  const namePattern = /^[\p{L}\p{M}][\p{L}\p{M} '\u2019-]{0,79}$/u;
  if (!namePattern.test(firstName)) errors.firstName = "Enter a first name (up to 80 letters).";
  if (!namePattern.test(lastName)) errors.lastName = "Enter a last name (up to 80 letters).";
  if (email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (text("phone").length > 40 || !/^\+?\d{7,15}$/.test(phone)) errors.phone = "Enter a phone number with 7 to 15 digits; an optional + country code, spaces, parentheses and hyphens are allowed.";
  if (address.length < 10 || address.length > 500 || /[\u0000-\u0008\u000b-\u001f\u007f<>]/.test(address)) {
    errors.address = "Enter a residential address between 10 and 500 characters.";
  }
  const ranking = input.ranking;
  if (!Array.isArray(ranking) || ranking.length !== PERK_IDS.length ||
      new Set(ranking).size !== PERK_IDS.length || ranking.some((id) => !PERK_IDS.includes(id))) {
    errors.ranking = "Rank each of the ten perks exactly once.";
  }
  if (input.rankingConfirmed !== true) errors.rankingConfirmed = "Confirm that the order reflects your priorities.";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, errors, value: { firstName, lastName, email, phone, address, ranking: [...ranking] } }; // compliance-ok: data validation, no consumer claim
}

export function isSyntheticReservation(value) {
  return /@(example\.com|example\.net|example\.org)$/.test(value.email) && /^test\b/i.test(value.address);
}

export function movePerk(order, id, direction) {
  if (direction !== -1 && direction !== 1) return [...order];
  const from = order.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= order.length) return [...order];
  const result = [...order];
  [result[from], result[to]] = [result[to], result[from]];
  return result;
}
