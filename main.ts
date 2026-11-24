// Monday 23 November 2026 — The World in One Day
// Copier/validator for the news-image-20261123 round 1 entry.
// Reads entry.png from this repo, validates it, and copies it byte-for-byte
// to $MAKEFUN_OUTPUT_DIR/entry.png. Standard library only.

import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1024 * 1024;
const MAX_SIDE = 1024;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE: number[] = (() => {
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) throw new Error('MAKEFUN_OUTPUT_DIR is not set');
  const here = dirname(fileURLToPath(import.meta.url));
  const src = join(here, 'entry.png');
  const out = resolve(outDir, 'entry.png');
  if (out === src) throw new Error('output must not overwrite the repo entry');
  if (out.startsWith(resolve(here) + '/')) throw new Error('output must be outside the repo');
  const data = readFileSync(src);
  if (data.length === 0 || data.length > MAX_BYTES) {
    throw new Error('entry.png size out of range: ' + data.length + ' bytes');
  }
  if (!data.subarray(0, 8).equals(PNG_MAGIC)) throw new Error('entry.png is not a PNG');
  let off = 8;
  let sawIHDR = false;
  let sawIDAT = false;
  let sawIEND = false;
  let width = 0;
  let height = 0;
  while (off + 8 <= data.length) {
    const len = data.readUInt32BE(off);
    const type = data.toString('ascii', off + 4, off + 8);
    const chunkEnd = off + 8 + len + 4;
    if (chunkEnd > data.length) throw new Error('truncated PNG chunk: ' + type);
    const stored = data.readUInt32BE(off + 8 + len);
    const computed = crc32(data.subarray(off + 4, off + 8 + len));
    if (stored !== computed) throw new Error('CRC mismatch in chunk: ' + type);
    if (type === 'IHDR') {
      if (sawIHDR) throw new Error('duplicate IHDR');
      sawIHDR = true;
      width = data.readUInt32BE(off + 8);
      height = data.readUInt32BE(off + 12);
      const bitDepth = data[off + 16];
      const colorType = data[off + 17];
      if (width === 0 || width > MAX_SIDE || height === 0 || height > MAX_SIDE) {
        throw new Error('PNG dimensions out of range: ' + width + 'x' + height);
      }
      if (bitDepth !== 8) throw new Error('unsupported bit depth: ' + bitDepth);
      if (colorType !== 2) throw new Error('unsupported color type (need RGB=2): ' + colorType);
    } else if (type === 'IDAT') {
      sawIDAT = true;
    } else if (type === 'IEND') {
      sawIEND = true;
      if (chunkEnd !== data.length) throw new Error('trailing data after IEND');
      break;
    }
    off = chunkEnd;
  }
  if (!sawIHDR || !sawIDAT || !sawIEND) throw new Error('PNG missing IHDR/IDAT/IEND');
  mkdirSync(outDir, { recursive: true });
  copyFileSync(src, out);
  const back = readFileSync(out);
  if (back.length !== data.length) throw new Error('copied size mismatch: ' + back.length + ' != ' + data.length);
  const a = createHash('sha256').update(data).digest('hex');
  const b = createHash('sha256').update(back).digest('hex');
  if (a !== b) throw new Error('sha256 mismatch after copy');
  console.log('OK entry.png ' + width + 'x' + height + ' ' + data.length + ' bytes sha256=' + a + ' -> ' + out);
}

main();
