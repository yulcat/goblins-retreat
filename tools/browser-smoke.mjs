import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {mkdir,writeFile} from 'node:fs/promises';
import {createGame,resume,step,serialize} from '../src/sim.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||`${homedir()}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`);
await mkdir('reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
await page.clock.install();
await page.goto(process.env.TEST_URL||'http://127.0.0.1:4173');
await page.screenshot({path:'reports/screenshots/home-desktop.png',fullPage:true});
await page.locator('#new-game').click();
assert.equal(await page.locator('#story-next').count(),1);
await page.reload();await page.locator('#continue-game').click();
assert.equal(await page.locator('#story-next').count(),1);checks.push('unfinished intro restored after reload');
for(let i=0;i<3;i++)await page.locator('#story-next').click();
await page.locator('[data-item="1"]').click();await page.locator('#stash').click();
assert.equal(await page.evaluate(()=>window.__rig.snapshot().towers[0].x),null);
await page.locator('#undo').click();assert.equal(await page.evaluate(()=>window.__rig.snapshot().towers[0].x),4);checks.push('stash and undo preserve tower');
await page.locator('[data-item="1"]').click();await page.locator('#discard').click();await page.locator('#scrap-item').click();
assert.equal(await page.evaluate(()=>window.__rig.snapshot().towers.length),1);
await page.locator('#undo').click();assert.equal(await page.evaluate(()=>window.__rig.snapshot().towers.length),2);checks.push('discard and undo restore tower');
await page.screenshot({path:'reports/screenshots/game-desktop.png',fullPage:true});
const sizes=[];for(const [width,height] of [[320,640],[390,844],[768,1024],[1280,720]]){
 await page.setViewportSize({width,height});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);sizes.push({width,height,overflow});
 if(width===390)await page.screenshot({path:'reports/screenshots/game-mobile.png',fullPage:true});
}
await page.locator('#resume').click();await page.locator('#pause').click();
assert.equal(await page.locator('#pause-banner').isVisible(),true);checks.push('combat pause button');
await page.locator('#menu').click();await page.locator('#continue-game').click();
assert.equal(await page.locator('#pause-banner').isVisible(),true);checks.push('saved combat continues paused');
await page.locator('#unpause').click();await page.locator('#speed').click();
for(let i=0;i<100&&(await page.evaluate(()=>window.__rig.snapshot().phase))==='combat';i++)await page.clock.runFor(1000);
const reward=await page.evaluate(()=>window.__rig.snapshot());assert.equal(reward.phase,'reward');
await page.locator('#take').click();assert.equal(await page.locator('#repick').count(),1);await page.locator('#repick').click();
const restored=await page.evaluate(()=>window.__rig.snapshot());for(const key of ['rng','hp','kills','rewards','choices','towers'])assert.deepEqual(restored[key],reward[key]);checks.push('trying a reward can restore the original choice and board');
// A legal simulator-produced failure fixture tests recovery buttons, not completion.
const fixture=createGame(88);fixture.wave=6;fixture.hp=42;resume(fixture);fixture.hp=0;step(fixture);
await contextFixture();
async function contextFixture(){await page.addInitScript(raw=>localStorage.setItem('last-rig-save-v1',raw),serialize(fixture));await page.reload();await page.locator('#continue-game').click();await page.locator('#assist').click();const retry=await page.evaluate(()=>window.__rig.snapshot());assert.equal(retry.wave,6);assert.equal(retry.hp,140);assert.equal(retry.phase,'garage');checks.push('assisted checkpoint button restores build with 140 engine HP');}
const report={created:new Date().toISOString(),checks,sizes,errors};
report.url=process.env.TEST_URL||'http://127.0.0.1:4173';await writeFile(process.env.TEST_URL?'reports/browser-hosted-smoke.json':'reports/browser-smoke.json',JSON.stringify(report,null,2));console.log(report);await browser.close();assert.equal(errors.length,0);
