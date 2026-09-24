import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {mkdir,writeFile} from 'node:fs/promises';
import {createGame,serialize} from '../src/sim.js';
import {SCENES} from '../src/content.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||`${homedir()}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const url=process.env.TEST_URL||'http://127.0.0.1:4173';
const context=await browser.newContext({viewport:{width:320,height:568},hasTouch:true}),page=await context.newPage(),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{const raw=sessionStorage.getItem('dialogue-fixture');if(raw){localStorage.setItem('last-rig-save-v1',raw);sessionStorage.removeItem('dialogue-fixture');}});
await mkdir('reports/screenshots',{recursive:true});await page.goto(url);
for(const [width,height] of [[320,480],[320,568],[390,844],[768,1024],[1280,720],[1440,1000],[844,390]]){
 await page.setViewportSize({width,height});let anchor=null,lineCount=0,maxMovementPixels=0;
 for(const [key,scene] of Object.entries(SCENES)){
  const s=createGame(813);s.pendingScene=key;if(['rescue','chapter2','last','ending'].includes(key))s.seen=['chapter1'];let badgeBefore=null;
  await page.evaluate(raw=>sessionStorage.setItem('dialogue-fixture',raw),serialize(s));await page.reload();await page.locator('#continue-game').click();
  for(let index=0;index<scene.lines.length;index++){
   const g=await page.evaluate(()=>{
    const selectors=['.story-modal','#story-next','#story-portrait','.story-speaker','.story-line blockquote'];
    const boxes=Object.fromEntries(selectors.map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return[selector,{x:r.x,y:r.y,width:r.width,height:r.height}];}));
    const bad=[];for(const selector of ['.story-modal','.story-heading','.story-line','.story-copy','.story-line blockquote']){const e=document.querySelector(selector);if(getComputedStyle(e).display==='contents')continue;if(e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1)bad.push(selector+' overflow');}
    const footer=document.querySelector('.story-footer').getBoundingClientRect(),quote=document.querySelector('blockquote').getBoundingClientRect(),portrait=boxes['#story-portrait'];
    for(const selector of ['.acting','.story-context','blockquote']){const e=document.querySelector(selector),range=document.createRange();range.selectNodeContents(e);const r=range.getBoundingClientRect();if(!r.height)continue;if(r.left<0||r.right>innerWidth||r.bottom>footer.top||r.top<0)bad.push(selector+' outside');if(selector==='.acting'&&r.bottom>quote.y)bad.push('acting overlaps quote');}
    const m=boxes['.story-modal'];if(m.y<0||m.x<0||m.x+m.width>innerWidth||m.y+m.height>innerHeight)bad.push('modal outside viewport');
    if(portrait.y+portrait.height>footer.top)bad.push('portrait overlaps footer');
    return{boxes,bad};
   });
   assert.deepEqual(g.bad,[],`${width}×${height} ${key}:${index+1}`);
   if(!anchor)anchor=g.boxes;
   for(const selector of Object.keys(anchor))for(const part of selector==='.story-line blockquote'?['x','y','width']:['x','y','width','height']){const movement=Math.abs(g.boxes[selector][part]-anchor[selector][part]);maxMovementPixels=Math.max(maxMovementPixels,movement);assert.ok(movement<.1,`${width}×${height} ${key}:${index+1} ${selector} ${part} moved`);}
   const expectedContext=Object.entries(scene.beats||{}).filter(([i])=>Number(i)<=index).at(-1)?.[1]??scene.context;
   assert.equal(await page.locator('.story-context').textContent(),expectedContext);
   if(key==='chapter1'&&index===5)badgeBefore=await page.locator('#story-portrait').evaluate(c=>c.toDataURL());
   if(key==='chapter1'&&index===7)assert.notEqual(await page.locator('#story-portrait').evaluate(c=>c.toDataURL()),badgeBefore,'given-away badge still drawn');
   if((width===390||width===1280)&&key==='intro'&&index===0)await page.screenshot({path:`reports/screenshots/dialogue-${width}.png`});
   if(width===320&&height===480&&key==='rescue'&&index===10)await page.screenshot({path:'reports/screenshots/dialogue-transition-small.png'});
   // Every line is advanced at the original button's center, without finding a new target.
   const b=anchor['#story-next'];if(width<720)await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);else await page.mouse.click(b.x+b.width/2,b.y+b.height/2);
   lineCount++;
  }
  assert.equal(await page.locator('#story-next').count(),0,`${key} did not finish`);
 }
 results.push({width,height,lines:lineCount,button:anchor['#story-next'],maxMovementPixels,clipping:false});console.log(width,height,lineCount,'fixed-position advances passed');
}
const report={created:new Date().toISOString(),url,scope:'Saved scene fixtures: fixed geometry, text visibility and pointer advancement; not a narrative-quality score or gameplay completion test.',results,errors};
await writeFile(process.env.TEST_URL?'reports/dialogue-hosted.json':'reports/dialogue-layout.json',JSON.stringify(report,null,2));await browser.close();assert.deepEqual(errors,[]);console.log('All dialogue layouts passed.');
