import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const ROOT = "public";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let beforeTotal = 0;
let afterTotal = 0;

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  const name = basename(file).toLowerCase();

  // Skip favicon and SVGs
  if (ext === ".svg") continue;
  if (name === "favicon.ico" || name.startsWith("favicon")) continue;

  const isJpg = ext === ".jpg" || ext === ".jpeg";
  const isPng = ext === ".png";
  if (!isJpg && !isPng) continue;

  const before = (await stat(file)).size;
  const tmp = file + ".tmp";

  let pipeline = sharp(file).rotate(); // respect EXIF orientation
  if (isJpg) {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  } else {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, effort: 10 });
  }

  await pipeline.toFile(tmp);
  const after = (await stat(tmp)).size;

  // Only keep the re-encoded version if it is actually smaller
  if (after < before) {
    await rename(tmp, file);
  } else {
    await unlink(tmp);
  }

  const kept = after < before ? after : before;
  beforeTotal += before;
  afterTotal += kept;

  const pct = (((before - kept) / before) * 100).toFixed(1);
  console.log(
    `${file.padEnd(40)} ${(before / 1024).toFixed(0).padStart(6)} KB -> ${(kept / 1024).toFixed(0).padStart(6)} KB  (-${pct}%)${after < before ? "" : "  [kept original]"}`,
  );
}

console.log("-".repeat(70));
console.log(
  `TOTAL ${(beforeTotal / 1024 / 1024).toFixed(2)} MB -> ${(afterTotal / 1024 / 1024).toFixed(2)} MB  (-${(((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(1)}%)`,
);
console.log(`BEFORE_BYTES=${beforeTotal}`);
console.log(`AFTER_BYTES=${afterTotal}`);
