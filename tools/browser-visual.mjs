import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {mkdir,writeFile} from 'node:fs/promises';
import {createGame,serialize,makeTower,clone} from '../src/sim.js';
import {SCENES,ITEMS} from '../src/content.js';
import {runGame} from './bot.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||`${homedir()}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:320,height:568}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
await mkdir('reports/screenshots',{recursive:true});
await page.addInitScript(()=>{const raw=sessionStorage.getItem('visual-fixture');if(raw){localStorage.setItem('last-rig-save-v1',raw);sessionStorage.removeItem('visual-fixture');}});
await page.goto(process.env.TEST_URL||'http://127.0.0.1:4173');
// These saved-state fixtures exercise rendering and controls, not completion or balance.
async function fixture(s){await page.evaluate(raw=>sessionStorage.setItem('visual-fixture',raw),serialize(s));await page.reload();await page.locator('#continue-game').click();}
async function fits(label){const problems=await page.locator('.modal').evaluate(e=>{const r=e.getBoundingClientRect(),bad=[];if(e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1)bad.push('overflow');if(r.top<0||r.bottom>innerHeight||r.left<0||r.right>innerWidth)bad.push('offscreen');for(const b of e.querySelectorAll('button')){const q=b.getBoundingClientRect();if(q.bottom>r.bottom||q.right>r.right||q.left<r.left)bad.push(b.id||b.textContent);}return bad;});assert.deepEqual(problems,[],label);}
let dialogueLines=0;
for(const key of Object.keys(SCENES)){const s=createGame(813);s.pendingScene=key;await fixture(s);while(await page.locator('#story-next').count()){await fits(`${key} line ${dialogueLines}`);dialogueLines++;await page.locator('#story-next').click();}}
checks.push(`${dialogueLines} dialogue lines fit 320×568`);
await page.locator('#game-options').click();await page.locator('#help').click();for(let i=0;i<6;i++){await fits(`help ${i}`);await page.locator('#help-next').click();}checks.push('all six help pages fit');
const reward=createGame(813);reward.phase='reward';reward.choices=['nail','mortar','harpoon'];await fixture(reward);
for(const type of reward.choices){await page.locator(`[data-choice="${type}"]`).click();await fits(`reward ${type}`);}
await page.screenshot({path:'reports/screenshots/revision-reward-small.png'});checks.push('reward detail, upgrade, repair and reroll fit');
const garage=createGame(813);garage.wave=8;for(const type of Object.keys(ITEMS))garage.towers.push(makeTower(garage,type));await fixture(garage);
const seen=new Set();let pages=0;do{for(const id of await page.locator('[data-item]').evaluateAll(es=>es.map(e=>Number(e.dataset.item))))seen.add(id);pages++;if(!await page.locator('#inv-next').isEnabled())break;await page.locator('#inv-next').click();}while(pages<10);
assert.equal(seen.size,garage.towers.length);assert.equal(pages,5);await page.locator(`[data-item="${garage.towers.at(-1).id}"]`).click();await page.locator('#info-item').click();await fits('last inventory item');await page.locator('#item-close').click();
await page.setViewportSize({width:1280,height:720});assert.equal(await page.locator('[data-item]').count(),2);while(await page.locator('#inv-prev').isEnabled())await page.locator('#inv-prev').click();assert.equal(await page.locator('[data-item]').count(),6);checks.push('14 items reachable through five mobile pages and three desktop pages, including resize');
let battle;runGame(8732,'adaptive',null,{onState:s=>{if(!battle&&s.wave===13&&s.phase==='combat'&&s.waveTime>30&&s.enemies.length>8)battle=clone(s);}});assert.ok(battle);battle.seen=Object.keys(SCENES);
await page.clock.install();await fixture(battle);await page.locator('#unpause').click();await page.clock.runFor(250);
await page.screenshot({path:'reports/screenshots/revision-battle-desktop.png'});
await page.setViewportSize({width:390,height:844});await page.clock.runFor(100);
await page.screenshot({path:'reports/screenshots/revision-battle-mobile.png'});checks.push('busy combat rendered in desktop and portrait layouts from a simulator-produced save');
// Draw every authored asset at reviewable scale using the production art functions.
await page.setViewportSize({width:1200,height:1100});
await page.route('**/__art-review.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body style="margin:0"></body></html>'}));
await page.goto(new URL('__art-review.html',process.env.TEST_URL||'http://127.0.0.1:4173').href);
await page.evaluate(async()=>{const {drawWeapon,drawGoblin,drawEnemy,flame}=await import('./src/art.js');const {ITEMS,ENEMIES}=await import('./src/content.js');document.body.innerHTML='<canvas id="atlas" width="1200" height="1100"></canvas>';const c=document.querySelector('canvas').getContext('2d');c.fillStyle='#26372e';c.fillRect(0,0,1200,1100);c.font='18px system-ui';
 Object.entries(ITEMS).forEach(([k,d],i)=>{const x=150+i%4*300,y=105+Math.floor(i/4)*190;c.save();c.translate(x,y);c.scale(62,62);drawWeapon(c,k,0,0,0,1);c.restore();c.fillStyle='#e8d2a5';c.fillText(d.name,x-90,y+76);});
 Object.entries(ENEMIES).forEach(([k,d],i)=>{const x=72+i*149;c.save();c.translate(x,665);c.scale(67,67);drawEnemy(c,{type:k,...d,id:i},1);c.restore();c.fillStyle='#e8d2a5';c.font='13px system-ui';c.fillText(d.name,x-53,748);});
 ['rivet','boil','git'].forEach((k,i)=>{c.save();c.translate(80+i*265,810);c.scale(230,230);drawGoblin(c,k);c.restore();});
 c.save();c.translate(1010,1030);c.scale(115,115);flame(c,0,0,1.8,.55,1);c.restore();});
await page.screenshot({path:'reports/screenshots/revision-assets.png'});
const report={created:new Date().toISOString(),checks,errors,fixtureScope:'Rendering and UI only. Not evidence of gameplay completion.'};
await writeFile('reports/revision-visual.json',JSON.stringify(report,null,2));console.log(report);await browser.close();assert.equal(errors.length,0);
