import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {mkdir,writeFile} from 'node:fs/promises';
import {createGame,makeTower,serialize,cells,possiblePlacements} from '../src/sim.js';
import {SCENES} from '../src/content.js';
const require=createRequire(import.meta.url),{chromium}=require(`${homedir()}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`);
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),url=process.env.TEST_URL||'http://127.0.0.1:4173',results=[],errors=[];
await mkdir('reports/screenshots',{recursive:true});
try{for(const [width,height,mobile] of [[1280,720,false],[390,844,true],[320,568,true],[844,390,true]]){
 const context=await browser.newContext({viewport:{width,height},hasTouch:mobile,isMobile:mobile}),page=await context.newPage(),cdp=await context.newCDPSession(page);page.on('pageerror',e=>errors.push(e.message));
 const fixture=createGame(813);fixture.towers=[makeTower(fixture,'harpoon',2,2),makeTower(fixture,'mortar',5,5),makeTower(fixture,'coil',6,2)];fixture.wave=8;fixture.towers.push(makeTower(fixture,'nail',0,0),makeTower(fixture,'feeder',11,0),makeTower(fixture,'nail',0,8),makeTower(fixture,'cooler',10,8));fixture.seen=Object.keys(SCENES);fixture.rewards=18;
 await page.addInitScript(raw=>{if(!sessionStorage.seeded){localStorage.setItem('last-rig-save-v1',raw);sessionStorage.seeded='yes';}},serialize(fixture));await page.clock.install();await page.goto(url);
 const click=async selector=>mobile?page.locator(selector).tap():page.locator(selector).click(),snapshot=()=>page.evaluate(()=>window.__rig.snapshot());
 const point=async(x,y)=>{const l=await page.evaluate(()=>window.__rig.layout());return{x:l.portrait?l.left+(9-y-.5)*l.cell:l.left+(x+.5)*l.cell,y:l.portrait?l.top+(x+.5)*l.cell:l.top+(y+.5)*l.cell};};
 const tap=async(x,y)=>{const p=await point(x,y);if(mobile)await page.touchscreen.tap(p.x,p.y);else await page.mouse.click(p.x,p.y);};
 const drag=async(from,to,cancel=false)=>{const a=await point(...from),b=await point(...to);if(mobile){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...a,id:1}]});for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/6,y:a.y+(b.y-a.y)*i/6,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});}else{await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:6});if(cancel)await page.keyboard.press('Escape');await page.mouse.up();}await page.clock.runFor(80);};
 await click('#continue-game');await page.clock.runFor(80);
 await drag([4,2],[6,2]);assert.equal((await snapshot()).towers[0].x,2,'drag should only preview');
 assert.equal(await page.locator('#confirm-place').isEnabled(),true);await page.screenshot({path:`reports/screenshots/placement-${width}-drag.png`});await click('#confirm-place');assert.equal((await snapshot()).towers[0].x,4,'grab offset should survive');
 await drag([4,2],[4,1]);assert.equal(await page.locator('#confirm-place').isEnabled(),false);await click('#cancel-select');assert.equal((await snapshot()).towers[0].y,2);
 await drag([4,2],[2,2],true);assert.equal((await snapshot()).towers[0].x,4);if(await page.locator('#cancel-select').count())await click('#cancel-select');
 await tap(4,2);for(let i=0;i<4;i++)await click('#rotate');await click('#confirm-place');assert.equal((await snapshot()).towers[0].r,0);
 await tap(4,2);await click('#stash');assert.equal((await snapshot()).towers[0].x,null);await click('#undo');assert.equal((await snapshot()).towers[0].x,4);
 await tap(4,2);await click('#stash');await click(`[data-item="${fixture.towers[0].id}"]`);await page.screenshot({path:`reports/screenshots/placement-${width}-bench.png`});const spot=possiblePlacements(await snapshot(),'harpoon',fixture.towers[0].id)[0];await drag([spot.x,spot.y],[2,2]);await click('#confirm-place');assert.equal((await snapshot()).towers[0].x,2);
 await drag([2,2],[11,8]);assert.equal(await page.locator('#confirm-place').isEnabled(),false);assert.equal(await page.locator('#cancel-select').isVisible(),true);await click('#cancel-select');
 await page.reload();await click('#continue-game');await page.clock.runFor(80);assert.equal((await snapshot()).towers[0].x,2);
 for(const [x,y] of [[0,0],[11,0],[0,8],[10,8]]){
  await tap(x,y);await page.clock.runFor(80);
  const geometry=await page.evaluate(()=>['rotate','stash','confirm-place','info-item','cancel-select'].map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return {id,inside:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,hit:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};}));assert.ok(geometry.every(g=>g.inside&&g.hit),JSON.stringify({width,height,corner:[x,y],geometry}));await click('#cancel-select');
 }
 await tap(2,2);await click('#info-item');await click('#item-close');await click('#cancel-select');
 await click('#resume');await page.clock.runFor(80);await drag([2,2],[4,2]);assert.equal((await snapshot()).towers[0].x,2);assert.equal(await page.locator('#placement-ring').isVisible(),false);
 await tap(0,0);await page.clock.runFor(2000);await page.screenshot({path:`reports/screenshots/placement-${width}-combat.png`});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false);
 results.push({width,height,input:mobile?'real touch':'mouse',checks:['offset drag and explicit commit','blocked path and edge-clamped drag','cancelled gesture','four rotations','retrieve and undo','bench re-placement','saved placement reload','inspection','combat edit lock','four corner ring targets are visible and clickable','no overflow']});await context.close();
}}finally{await browser.close();}
assert.deepEqual(errors,[]);const report={created:new Date().toISOString(),url,results,errors};await writeFile(process.env.TEST_URL?'reports/placement-hosted.json':'reports/placement-browser.json',JSON.stringify(report,null,2));console.log(report);
