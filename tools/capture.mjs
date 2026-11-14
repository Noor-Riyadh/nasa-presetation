import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('https://embernova.khedmetak.com/s/replay:live-lunar', { waitUntil: 'networkidle' });
await p.waitForTimeout(20000);
const h = await p.evaluate(() => { const t=document.querySelector('.thread'); return [t.scrollHeight,t.clientHeight]; });
console.log(h);
let i=0;
for (let y=0; y < h[0]; y += h[1]-80) { await p.evaluate(y=>document.querySelector('.thread').scrollTo(0,y), y); await p.waitForTimeout(600); await p.screenshot({ path: `public/demo/_s${i++}.png` }); }
const links = await p.evaluate(()=>[...document.querySelectorAll('nav a, header a')].map(a=>a.href+' '+a.textContent.trim()));
console.log(links.join('\n'));
await b.close();
