import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { validateAgribusinessReservation } from "../lib/reservations/agribusiness-validation.mjs";
import { createAgribusinessHandler } from "../lib/reservations/agribusiness-handler.mjs";
import { isAgribusinessRoot } from "../lib/reservations/routing.mjs";

const valid = () => ({ firstName: "Synthetic", lastName: "Tester", email: "AGRIBUSINESS@example.com", phone: "+44 (20) 7946-0100", address: "TEST ONLY synthetic address", contribution: 3000 });
const url = "https://agribusiness.yealth.mu/api/agribusiness-reservations";
test("only the exact agribusiness hostname root rewrites; membership, apex and paths remain intact", () => {
  assert.equal(isAgribusinessRoot(new URL("http://localhost/"), "agribusiness.yealth.mu"), true);
  for (const host of ["yealth.mu","membership.yealth.mu","agribusiness.yealth.mu.evil.example"]) assert.equal(isAgribusinessRoot(new URL("https://"+host+"/"),host),false);
  assert.equal(isAgribusinessRoot(new URL("https://agribusiness.yealth.mu/api/agribusiness-reservations"),null),false);
});
function setup() {
  let clock = 1700000000000, allows = true, fail = false;
  const contacts = new Map(), receipts = new Map();
  const handler = createAgribusinessHandler({ mode: "live", signingSecret: "synthetic-test-secret", allowedHosts: ["agribusiness.yealth.mu"], now: () => clock,
    store: { allow: async () => allows, save: async (value, key) => {
      if (fail) throw new Error("Synthetic failure");
      const old = receipts.get(key);
      if (old && JSON.stringify(old) !== JSON.stringify(value)) { const e = new Error(); e.code = "IDEMPOTENCY_CONFLICT"; throw e; }
      receipts.set(key, value); if (!contacts.has(value.email)) contacts.set(value.email, value); return { id: key };
    } },
  });
  return { handler, contacts, receipts, advance: () => clock += 2500, rateLimit: () => allows = false, failStorage: () => fail = true };
}
async function challenge(s) { const r = await s.handler(new Request(url)); assert.equal(r.status, 200); const t = (await r.json()).token; s.advance(); return t; }
function send(s, body, origin = "https://agribusiness.yealth.mu") { return s.handler(new Request(url, { method: "POST", headers: { "content-type": "application/json", origin }, body: JSON.stringify(body) })); }

test("three numeric contribution options are required; contacts normalize independently of membership ranking", () => {
  for (const contribution of [1500,3000,4500]) {
    const r = validateAgribusinessReservation({ ...valid(), contribution });
    assert.equal(r.ok, true); assert.equal(r.value.contribution, contribution); assert.equal(r.value.email,"agribusiness@example.com"); assert.equal(r.value.phone,"+442079460100"); assert.equal("ranking" in r.value,false);
  }
  for (const contribution of [undefined,0,1501,"1500",[1500,3000],null]) assert.equal(validateAgribusinessReservation({...valid(),contribution}).ok,false);
  for (const patch of [{email:"bad"},{phone:"++23055"},{address:"short"},{firstName:"<script>"}]) assert.equal(validateAgribusinessReservation({...valid(),...patch}).ok,false);
});
test("live submission, retry, duplicate contact and changed retry are handled without public record data", async () => {
  const s=setup(), token=await challenge(s), requestKey=randomUUID(), body={...valid(),website:"",token,requestKey};
  for (const b of [body,body,{...body,requestKey:randomUUID()}]) { const r=await send(s,b); assert.equal(r.status,201); assert.deepEqual(Object.keys(await r.json()).sort(),["message","mode"]); }
  assert.equal(s.contacts.size,1); assert.equal(s.receipts.size,2); assert.equal((await send(s,{...body,contribution:4500})).status,409);
});
test("rejects invalid choice, cross-origin, bot, too-fast and oversized requests", async () => {
  const s=setup(), token=await challenge(s), body={...valid(),website:"",token,requestKey:randomUUID()};
  assert.equal((await send(s,{...body,contribution:[1500,3000]})).status,422);
  assert.equal((await send(s,body,"https://evil.example")).status,403);
  assert.equal((await send(s,{...body,website:"bot"})).status,400);
  assert.equal((await send(s,{...body,address:"x".repeat(9000)})).status,413);
  const fresh=setup(); const t=(await (await fresh.handler(new Request(url))).json()).token;
  assert.equal((await send(fresh,{...body,token:t})).status,400); assert.equal(s.contacts.size,0);
});
test("rate limits and storage failure stay truthful; GET exposes only a challenge", async () => {
  const s=setup(), token=await challenge(s); s.failStorage();
  assert.equal((await send(s,{...valid(),website:"",token,requestKey:randomUUID()})).status,503);
  s.rateLimit(); assert.equal((await s.handler(new Request(url))).status,429);
});
