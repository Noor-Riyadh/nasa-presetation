import { chromium } from 'playwright-core';
import fs from 'node:fs';
const URL = process.env.URL || 'http://localhost:4173/';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
const p = await ctx.newPage();
const errs = [];
p.on('console', m => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); });
p.on('pageerror', e => errs.push('pageerror: ' + e.message));
p.on('requestfailed', r => errs.push('reqfailed: ' + r.url()));
fs.mkdirSync('tools/shots', { recursive: true });
await p.goto(URL, { waitUntil: 'load' });
await p.waitForTimeout(1500);
const steps = [4, 4, 3, 4, 5, 10, 7, 3, 7];
const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;
const wait = +(process.env.WAIT || 2600);
for (let s = 0; s < steps.length; s++) {
  for (let t = 0; t < steps[s]; t++) {
    if (!(s === 0 && t === 0)) await p.keyboard.press('ArrowRight');
    if (!only || only.includes(s)) {
      await p.waitForTimeout(t === 0 ? wait + 1400 : wait);
      await p.screenshot({ path: `tools/shots/s${s + 1}-${t}.png` });
    } else await p.waitForTimeout(150);
  }
}
console.log(errs.length ? errs.join('\n') : 'NO CONSOLE ERRORS');
await b.close();
