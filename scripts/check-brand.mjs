#!/usr/bin/env node
// Brand-casing guard, ported from yealth-platform. Fails the build if the brand
// name "yealth" appears in any casing other than all-lowercase, anywhere in
// application source. "yealth" is always lowercase, in every position and
// context, including sentence-start, headings, titles, identifiers, comments,
// and the legal entity written "yealth CO LTD", never in all-caps.
//
// This guard checks ONLY brand casing. It does NOT enforce the platform's co-op
// vocabulary rules, which do not apply to this marketing repo.
//
// Scope: application source only. Skips dot-directories (.git, .next, .claude,
// .vscode, .vercel, ...), node_modules, scripts, lock files, generated types,
// and .env* files (a credential value may legitimately contain a cased brand
// token and env files are out of scope).
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TEXT_FILES = /\.(tsx?|jsx?|mjs|cjs|css|md|json|txt|html)$/;
const SKIP_FILES = new Set([
  "next-env.d.ts",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
]);

const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;
    if (entry.isDirectory()) {
      // dot-dirs are tooling/VCS/build, never app source; scripts is this guard
      if (name.startsWith(".") || name === "node_modules" || name === "scripts") {
        continue;
      }
      walk(join(dir, name));
      continue;
    }
    if (name.startsWith(".env")) continue; // never scan env files
    if (SKIP_FILES.has(name) || !TEXT_FILES.test(name)) continue;
    scan(join(dir, name));
  }
}

function scan(path) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/yealth/gi)) {
      if (m[0] !== "yealth") {
        violations.push(
          `  ${relative(ROOT, path)}:${i + 1}  found "${m[0]}" in: ${line.trim()}`,
        );
      }
    }
  });
}

walk(ROOT);

if (violations.length > 0) {
  console.error(
    'Brand check FAILED: "yealth" must always be lowercase, in every position (including "yealth CO LTD").',
  );
  for (const v of violations) console.error(v);
  console.error(`\n${violations.length} violation(s). Build aborted.`);
  process.exit(1);
}

console.log('Brand check passed: "yealth" is lowercase everywhere.');
