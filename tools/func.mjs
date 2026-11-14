import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
const p = await ctx.newPage();
const errs = []; p.on('console', m => m.type()==='error' && errs.push(m.text())); const ext=new Set(); p.on('request', r=>{ if(!r.url().startsWith('http://localhost')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:')) ext.add(r.url()) }); p.on('pageerror', e => errs.push(e.message));
const pos = async () => await p.evaluate(() => location.hash);
await p.goto('http://localhost:4173/'); await p.waitForTimeout(800);
for (let i = 0; i < 12; i++) await p.keyboard.press('ArrowRight');           // rapid forward
const a = await pos();
for (let i = 0; i < 5; i++) await p.keyboard.press('ArrowLeft');
const b2 = await pos();
await p.keyboard.press('End'); const end = await pos();
await p.keyboard.press('Home'); const home = await pos();
await p.keyboard.press('6'); const six = await pos();
await p.reload(); await p.waitForTimeout(1200); const afterReload = await pos();
const sceneAfterReload = await p.evaluate(() => document.querySelector('.scene.enter')?.dataset.scene);
// context offline
await ctx.setOffline(true);
await p.keyboard.press('7'); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1500);
const offlineOk = await p.evaluate(() => document.querySelectorAll('.node').length);
await p.screenshot({ path: 'tools/shots/offline-s7.png' });
const offReload = "skipped";
await ctx.setOffline(false);
// dock
await p.keyboard.press('d'); await p.waitForTimeout(400); await p.screenshot({ path: 'tools/shots/dock.png' });
await p.keyboard.press('d');
// soak: 200 rapid transitions then count nodes
for (let i = 0; i < 100; i++) { await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowLeft'); }
await p.waitForTimeout(1600);
const nodes = await p.evaluate(() => document.querySelectorAll('*').length);
const scenes = await p.evaluate(() => document.querySelectorAll('.scene').length);
const hasNotes = await p.evaluate(() => /ملاحظة|Speaker/.test(document.body.innerText));
// presenter + script
const pp = await ctx.newPage(); await pp.goto('http://localhost:4173/#presenter'); await pp.waitForTimeout(1000);
await pp.setViewportSize({ width: 1600, height: 900 }); await pp.screenshot({ path: 'tools/shots/presenter.png' });
await p.keyboard.press('1'); await p.waitForTimeout(300);
await pp.locator('button.go').click(); await p.waitForTimeout(500);
const synced = await pos();
const sp = await ctx.newPage(); await sp.goto('http://localhost:4173/#script'); await sp.waitForTimeout(600); await sp.screenshot({ path: 'tools/shots/script.png' });
console.log(JSON.stringify({ a, b2, end, home, six, afterReload, sceneAfterReload, offlineNodes: offlineOk, offReload, domNodes: nodes, scenesMounted: scenes, notesOnStage: hasNotes, synced, errs, externalRequests:[...ext] }, null, 1));
await b.close();
