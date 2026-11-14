import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('https://embernova.khedmetak.com/evidence-map', { waitUntil: 'networkidle' }); await p.waitForTimeout(3000);
await p.evaluate(()=>window.scrollTo(0,330)); await p.waitForTimeout(500);
await p.screenshot({ path: 'public/demo/_gap.png' });
await b.close();
