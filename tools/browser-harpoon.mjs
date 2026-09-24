import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {mkdir,writeFile} from 'node:fs/promises';
import {createGame,makeTower,serialize} from '../src/sim.js';
import {SCENES} from '../src/content.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||`${homedir()}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const url=process.env.TEST_URL||'http://127.0.0.1:4173',results=[],errors=[];
await mkdir('reports/screenshots',{recursive:true});
for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:720},hasTouch:mobile,isMobile:mobile}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const fixture=createGame(813);fixture.towers=[makeTower(fixture,'harpoon',2,2)];fixture.seen=Object.keys(SCENES);fixture.rewards=18;
 // A single weapon isolates firing on the real route; this is not a completion test.
 await page.addInitScript(raw=>localStorage.setItem('last-rig-save-v1',raw),serialize(fixture));await page.clock.install();await page.goto(url);
 const click=async selector=>{if(mobile)await page.locator(selector).tap();else await page.locator(selector).click();};
 const snapshot=()=>page.evaluate(()=>window.__rig.snapshot());
 const cell=async(x,y)=>{const l=await page.evaluate(()=>window.__rig.layout()),px=l.portrait?l.left+(9-y-.5)*l.cell:l.left+(x+.5)*l.cell,py=l.portrait?l.top+(x+.5)*l.cell:l.top+(y+.5)*l.cell;if(mobile)await page.touchscreen.tap(px,py);else await page.mouse.click(px,py);};
 await click('#continue-game');await page.clock.runFor(80);await click(`[data-item="${fixture.towers[0].id}"]`);await page.clock.runFor(80);
 assert.equal((await snapshot()).towers[0].x,2);assert.match(await page.locator('.item-status').textContent(),mobile?/정면 ↓/:/정면 →/);
 await page.screenshot({path:`reports/screenshots/harpoon-${mobile?'touch':'mouse'}-placement.png`});
 await click('#rotate');await click('#rotate');await click('#confirm-place');await click(`[data-item="${fixture.towers[0].id}"]`);await page.clock.runFor(80);
 assert.equal((await snapshot()).towers[0].r,2);assert.match(await page.locator('.item-status').textContent(),mobile?/정면 ↑/:/정면 ←/);
 await page.screenshot({path:`reports/screenshots/harpoon-${mobile?'touch':'mouse'}-rotated.png`});
 await click('#rotate');await click('#rotate');
 await click('#info-item');const modal=page.locator('.modal');assert.match(await modal.textContent(),/전방 120도/);assert.equal(await modal.evaluate(e=>e.scrollHeight>e.clientHeight+1),false);await click('#item-close');
 await click('#confirm-place');await click('#resume');await page.clock.runFor(80);await cell(2,2);
 for(let i=0;i<40&&(await snapshot()).towers[0].shots<3;i++)await page.clock.runFor(1000);
 const s=await snapshot(),t=s.towers[0];assert.ok(t.shots>=3);assert.ok(t.damage>0);assert.ok(Math.abs(t.aim)>.01,'barrel never aimed away from its fixed axis');await page.clock.runFor(300);
 assert.match(await page.locator('.combat-note').textContent(),/작살포 · 발사 [1-9][0-9]*회 · 유효 피해 [1-9]/);
 await page.screenshot({path:`reports/screenshots/harpoon-${mobile?'touch':'mouse'}-combat.png`});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight);assert.equal(overflow,false);
 results.push({mode:mobile?'touch':'mouse',position:{x:t.x,y:t.y,r:t.r},shots:t.shots,damage:t.damage,aimRadians:t.aim,overflow});await context.close();
}
const report={created:new Date().toISOString(),url,scope:'Single-weapon regression fixture. Placement, rotation and combat selection use real pointer input; enemies and hits run through the normal simulation.',results,errors};await writeFile(process.env.REPORT_PATH||(process.env.TEST_URL?'reports/harpoon-hosted.json':'reports/harpoon-browser.json'),JSON.stringify(report,null,2));console.log(report);await browser.close();assert.deepEqual(errors,[]);
