import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const r of ['evidence-map','compare','envelope']) {
  await p.goto('https://embernova.khedmetak.com/'+r, { waitUntil: 'networkidle' }); await p.waitForTimeout(4000);
  await p.screenshot({ path: `public/demo/_p-${r}.png` });
}
await b.close();
