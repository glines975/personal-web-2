import sharp from "sharp";
import { readdirSync, statSync, mkdirSync, existsSync } from "fs";
import { join, extname, dirname } from "path";

const SRC = "public";
const OUT = "public-optimized";
const SKIP_DIRS = new Set(["profit"]);

/* png: palette-quantized, keeps alpha (folder layers, castle glows).
   jpg: mozjpeg for opaque photos. Both capped so the biggest file stays ~1.5MB. */
const PNG_MAX_DIM = 2000;
const JPEG_MAX_DIM = 1600;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...walk(full));
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function outPathFor(rel) {
  const ext = extname(rel).toLowerCase();
  const noExt = rel.slice(0, rel.length - ext.length);
  const normalized = ext === ".jpeg" ? `${noExt}.jpg` : `${noExt}${ext}`;
  return join(OUT, normalized);
}

async function optimize(file, rel) {
  const ext = extname(file).toLowerCase();
  const out = outPathFor(rel);
  const img = sharp(file, { limitInputPixels: false });
  const meta = await img.metadata();
  if (meta.width === undefined || meta.height === undefined) {
    throw new Error(`Cannot read dimensions of ${file}`);
  }

  let pipeline = sharp(file, { limitInputPixels: false });
  if (ext === ".png") {
    if (Math.max(meta.width, meta.height) > PNG_MAX_DIM) {
      pipeline = pipeline.resize({ width: PNG_MAX_DIM, height: PNG_MAX_DIM, fit: "inside", withoutEnlargement: true });
    }
    await pipeline
      .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
      .toFile(out);
  } else {
    if (Math.max(meta.width, meta.height) > JPEG_MAX_DIM) {
      pipeline = pipeline.resize({ width: JPEG_MAX_DIM, height: JPEG_MAX_DIM, fit: "inside", withoutEnlargement: true });
    }
    await pipeline
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toFile(out);
  }

  const before = statSync(file).size;
  const after = statSync(out).size;
  console.log(`${rel}  ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`);
}

async function run() {
  if (!existsSync(OUT)) mkdirSync(OUT);
  for (const file of walk(SRC)) {
    const rel = file.slice(SRC.length + 1);
    const out = outPathFor(rel);
    mkdirSync(dirname(out), { recursive: true });
    await optimize(file, rel);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
