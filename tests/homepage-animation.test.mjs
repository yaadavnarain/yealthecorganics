import test from "node:test";
import assert from "node:assert/strict";
import { scheduleAfterPageLoad } from "../lib/homepage-animation.mjs";

function pageClock(readyState = "complete") {
  let now = 0, next = 0;
  const timers = new Map(), listeners = new Map();
  return {
    document: { readyState }, performance: { now: () => now },
    setTimeout(fn, delay) { const id = ++next; timers.set(id,{fn,at:now+delay}); return id; },
    clearTimeout(id) { timers.delete(id); },
    addEventListener(name, fn) { listeners.set(name,fn); },
    removeEventListener(name, fn) { if(listeners.get(name)===fn)listeners.delete(name); },
    load() { this.document.readyState="complete"; const fn=listeners.get("load"); listeners.delete("load"); fn?.(); },
    advance(ms) { now+=ms; for(const [id,t] of timers)if(t.at<=now){timers.delete(id);t.fn();} },
  };
}
test("fresh loaded visit starts at one second without any intersection event", () => {
  const page=pageClock(), calls=[];
  scheduleAfterPageLoad(page,t=>calls.push(t));
  page.advance(999); assert.equal(calls.length,0);
  page.advance(1); assert.deepEqual(calls,[{scheduledAt:0,startedAt:1000}]);
  page.advance(10000); assert.equal(calls.length,1);
});
test("initial loading waits for page load, then one full second", () => {
  const page=pageClock("loading"), calls=[];
  scheduleAfterPageLoad(page,t=>calls.push(t));
  page.advance(5000); assert.equal(calls.length,0); page.load();
  page.advance(999); assert.equal(calls.length,0); page.advance(1);
  assert.deepEqual(calls,[{scheduledAt:5000,startedAt:6000}]);
});
test("unmount cancels pending load listener and timer; return navigation gets a fresh delay", () => {
  const page=pageClock("loading"), calls=[];
  const cancel=scheduleAfterPageLoad(page,t=>calls.push(t)); cancel(); page.load(); page.advance(2000); assert.equal(calls.length,0);
  const cancelTimer=scheduleAfterPageLoad(page,t=>calls.push(t)); page.advance(500); cancelTimer(); page.advance(1000); assert.equal(calls.length,0);
  scheduleAfterPageLoad(page,t=>calls.push(t)); page.advance(999); assert.equal(calls.length,0); page.advance(1); assert.equal(calls.length,1);
});
