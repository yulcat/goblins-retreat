import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {mkdir,writeFile} from 'node:fs/promises';
import {bestPlacement,placementScore,botReward} from './bot.mjs';
import {clone,cells,possiblePlacements} from '../src/sim.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||`${homedir()}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`);
const mobile=process.argv.includes('--mobile'),full=process.argv.includes('--full'),seed=Number(process.env.TEST_SEED||8732);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},hasTouch:mobile,isMobile:mobile});
const page=await context.newPage(),errors=[],trace=[];
page.on('pageerror',e=>errors.push(e.message));
await page.clock.install({time:new Date(seed)});
await page.clock.setFixedTime(new Date(seed));
await page.goto(process.env.TEST_URL||'http://127.0.0.1:4173');
const click=async selector=>{const el=page.locator(selector);if(mobile)await el.tap();else await el.click();};
await click('#new-game');
async function stories(){while(await page.locator('#story-next').count())await click('#story-next');}
async function snapshot(){return page.evaluate(()=>window.__rig.snapshot());}
async function selectItem(id){if(await page.locator('#cancel-select').count())await click('#cancel-select');for(let n=0;n<20&&!await page.locator(`[data-item="${id}"]`).count();n++){if(await page.locator('#inv-next').isEnabled())await click('#inv-next');else while(await page.locator('#inv-prev').isEnabled())await click('#inv-prev');}await click(`[data-item="${id}"]`);}
async function put(t,p){
 await selectItem(t.id);const start=t.x===null?{...t,...possiblePlacements(await snapshot(),t.type,t.id)[0]}:t;
 for(let i=0;i<(p.r-start.r+4)%4;i++)await click('#rotate');
 const grab=cells({...start,r:p.r})[0],l=await page.evaluate(()=>window.__rig.layout()),point=(x,y)=>({x:l.portrait?l.left+(9-y-.5)*l.cell:l.left+(x+.5)*l.cell,y:l.portrait?l.top+(x+.5)*l.cell:l.top+(y+.5)*l.cell}),from=point(...grab),to=point(p.x+grab[0]-start.x,p.y+grab[1]-start.y);
 if(mobile){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...from,id:1}]});for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/6,y:from.y+(to.y-from.y)*i/6,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
 else{await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:6});await page.mouse.up();}
 await click('#confirm-place');const after=await snapshot(),moved=after.towers.find(a=>a.id===t.id);if(moved.x!==p.x||moved.y!==p.y||moved.r!==p.r)throw Error(`UI placement mismatch ${t.id}`);
}

await stories();
if(full)await click('#speed');
let iterations=0,lastWave=-1,placements=0;
while(iterations++<(full?500:20)){
 await stories();let s=await snapshot();if(s.wave!==lastWave){console.log('UI wave',s.wave+1,'time',Math.round(s.time),'hp',s.hp,'mode',mobile?'touch':'mouse');lastWave=s.wave;trace.push({wave:s.wave,time:s.time,hp:s.hp});}
 if(s.phase==='victory'||s.phase==='defeat')break;
 if(s.phase==='reward'){const c=clone(s);botReward(c,'adaptive');const decision=c.stats.choices.at(-1);if(decision.type==='repair')await click('#repair');else{await click(`[data-choice="${decision.type}"]`);await click(decision.mode==='upgrade'?'#upgrade':'#take');}continue;}
 if(s.phase==='garage'){
  for(const t of s.towers.filter(a=>a.x===null)){const p=bestPlacement(s,t.type,'adaptive',t.id);if(p){await put(t,p);placements++;s=await snapshot();}}
  if(s.wave%3===0&&!s.resumeMidWave)for(const t of s.towers.filter(a=>a.x!==null)){const p=bestPlacement(s,t.type,'adaptive',t.id);if(p&&p.score>placementScore(s,t,'adaptive')+3){await put(t,p);placements++;s=await snapshot();}}
  await click('#resume');await stories();if((await snapshot()).phase==='garage')await click('#resume');continue;
 }
 await page.clock.runFor(full?12000:4000);
}
await stories();const s=await snapshot();await mkdir('reports/screenshots',{recursive:true});
await page.screenshot({path:`reports/screenshots/${mobile?'touch':'mouse'}-${full?'full':'play'}.png`,fullPage:true});
const report={created:new Date().toISOString(),mode:mobile?'touch':'mouse',full,seed:s.seed,phase:s.phase,wave:s.wave,time:s.time,hp:s.hp,placements,kills:s.kills,rewards:s.rewards,seen:s.seen,errors,trace,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight)};
await writeFile(process.env.REPORT_PATH||`reports/revision-${mobile?'touch':'mouse'}-${full?'full':'play'}-${seed}.json`,JSON.stringify(report,null,2));console.log(report);await browser.close();
if(errors.length||report.overflow||(full&&s.phase!=='victory'))process.exitCode=1;
