#!/usr/bin/env node
// compliance-check.mjs
// Enforces the compliance vocabulary rules in CLAUDE.md against consumer-facing content.
// check-brand.mjs enforces casing. This file enforces the banned list.
// Exit 0 = clean. Exit 1 = at least one FAIL. Exit 2 = bad invocation.
//
// Usage:
//   node scripts/compliance-check.mjs
//   node scripts/compliance-check.mjs --dir app --dir content
//   node scripts/compliance-check.mjs --warn-only
//
// Escape hatch: append  // compliance-ok  to a line that is a verified false positive.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname, sep } from "node:path";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const WARN_ONLY = args.includes("--warn-only");
const DIRS = args.reduce((acc, a, i) => (a === "--dir" ? [...acc, args[i + 1]] : acc), []);

const SCAN_DIRS = DIRS.length ? DIRS : ["app", "components", "content", "lib", "public", "src"];
const SCAN_EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".mjs", ".md", ".mdx", ".json", ".html", ".txt"]);
const SKIP_DIR = new Set(["node_modules", ".next", ".git", "dist", "build", "coverage", ".vercel", "supabase"]);

// Consumer-facing bans. Word-boundary matched so "schema" does not trip "scheme".
const BANNED = [
  "invest", "investor", "investors", "investment", "investments", "investing",
  "passive income", "guaranteed return", "guaranteed returns",
  "subscription", "subscriptions", "subscriber", "subscribers", "subscribe",
  "installment", "installments", "instalment", "instalments",
  "scheme", "schemes",
];

// Banned in every context, not just consumer-facing.
const BANNED_ANYWHERE = [
  "health paid, wealth free",
  "health paid wealth free",
  "salad credits",
  "salad credit",
];

// Approved replacements, printed with each hit so the fix is obvious.
const SWAP = {
  invest: "ownership contribution / co-owner",
  investor: "member, client, or co-owner",
  investment: "ownership contribution",
  "passive income": "monthly income / harvest proceeds",
  "guaranteed return": "harvest proceeds",
  subscription: "salad delivery",
  subscriber: "member",
  installment: "ownership contribution",
  scheme: "program",
  "salad credits": "retired term, remove",
  "health paid, wealth free": "retired slogan, remove",
};

// Entity leakage into public marketing.
const ENTITY = ["ecorganic", "co ltd", "co. ltd"];

// Income figure attached to the paid product. WARN tier: needs a human read.
const INCOME_NEAR_MONEY = /\b(earn|earns|earning|income|return|returns|profit|profits|payout|payouts|yield|yields)\b[^.\n]{0,80}?(rs\s?[\d,]+|mur\s?[\d,]+|[\d,]+\s?(rs|mur))/i;

// Metadata surfaces get scanned with the same list but reported louder, since
// CLAUDE.md records that share tags have carried banned language while the body was clean.
const META_HINT = /(openGraph|twitter|og:|metadata|<title|name=["']description|property=["']og:|alt=)/i;

const wordRe = (term) =>
  new RegExp(`(?<![\\w-])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")}(?![\\w-])`, "i");

const findings = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIR.has(name) || name.startsWith(".")) continue;
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full);
    else if (SCAN_EXT.has(extname(name))) scan(full);
  }
}

function scan(file) {
  const rel = relative(ROOT, file);
  const isPublicMarketing = !/(^|\W)(admin|internal|dashboard|api)(\W|$)/i.test(rel);
  let lines;
  try {
    lines = readFileSync(file, "utf8").split(/\r?\n/);
  } catch {
    return;
  }

  lines.forEach((line, i) => {
    if (line.includes("compliance-ok")) return;
    const lineNo = i + 1;
    const isMeta = META_HINT.test(line);

    for (const term of BANNED_ANYWHERE) {
      if (wordRe(term).test(line)) {
        findings.push({ level: "FAIL", rel, lineNo, term, line, why: "banned in every context", isMeta });
      }
    }

    for (const term of BANNED) {
      if (wordRe(term).test(line)) {
        findings.push({
          level: "FAIL",
          rel,
          lineNo,
          term,
          line,
          why: isMeta ? "banned term in metadata or share tag" : "banned in consumer-facing string",
          isMeta,
        });
      }
    }

    if (isPublicMarketing) {
      for (const term of ENTITY) {
        if (wordRe(term).test(line)) {
          findings.push({
            level: "FAIL",
            rel,
            lineNo,
            term,
            line,
            why: term === "ecorganic" ? "ECORGANIC never appears in public marketing" : "no CO LTD in consumer material before incorporation",
            isMeta,
          });
        }
      }
    }

    if (INCOME_NEAR_MONEY.test(line)) {
      findings.push({
        level: "WARN",
        rel,
        lineNo,
        term: "income figure",
        line,
        why: "possible income figure attached to the paid product, read this one",
        isMeta,
      });
    }
  });
}

for (const d of SCAN_DIRS) {
  const full = join(ROOT, d);
  try {
    if (statSync(full).isDirectory()) walk(full);
  } catch {
    // directory absent in this repo, skip silently
  }
}

const fails = findings.filter((f) => f.level === "FAIL");
const warns = findings.filter((f) => f.level === "WARN");

const trim = (s) => (s.trim().length > 110 ? s.trim().slice(0, 107) + "..." : s.trim());

if (!findings.length) {
  console.log("compliance-check: clean. Scanned " + SCAN_DIRS.join(", ") + " under " + ROOT + ".");
  process.exit(0);
}

console.log("compliance-check results");
console.log("");

if (fails.length) {
  console.log("FAIL (" + fails.length + ")");
  for (const f of fails) {
    console.log("  " + f.rel + ":" + f.lineNo + (f.isMeta ? "  [METADATA]" : ""));
    console.log('    term: "' + f.term + '"  ' + f.why);
    if (SWAP[f.term.toLowerCase()]) console.log("    use instead: " + SWAP[f.term.toLowerCase()]);
    console.log("    " + trim(f.line));
    console.log("");
  }
}

if (warns.length) {
  console.log("WARN (" + warns.length + ")");
  for (const f of warns) {
    console.log("  " + f.rel + ":" + f.lineNo + "  " + f.why);
    console.log("    " + trim(f.line));
    console.log("");
  }
}

console.log("Summary: " + fails.length + " FAIL, " + warns.length + " WARN.");
console.log("Flag the breach and stop. Do not rewrite approved copy without being asked.");

process.exit(WARN_ONLY ? 0 : fails.length ? 1 : 0);
