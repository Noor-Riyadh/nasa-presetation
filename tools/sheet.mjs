import sharp from 'sharp';
import fs from 'node:fs';
const [,, out, cols, ...files] = process.argv;
const c = +cols, w = Math.floor(1920 / c), h = Math.floor(w * 9 / 16);
const bufs = await Promise.all(files.map(f => sharp('tools/shots/' + f + '.png').resize(w, h).toBuffer()));
const rows = Math.ceil(files.length / c);
await sharp({ create: { width: w * c, height: h * rows, channels: 3, background: '#222' } }).composite(bufs.map((b, i) => ({ input: b, left: (i % c) * w, top: Math.floor(i / c) * h }))).jpeg({ quality: 82 }).toFile(out);
