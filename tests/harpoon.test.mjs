import test from 'node:test';
import assert from 'node:assert/strict';
import {ITEMS,PATH} from '../src/content.js';
import {createGame,makeTower,canPlace,possiblePlacements,origin,position,resume,step,harpoonCanAim,harpoonShot,harpoonPathSegments,serialize,deserialize} from '../src/sim.js';

function enemy(id,p,hp=1000){return{id,type:'armor',p,hp,maxHp:hp,speed:0,armor:100,age:0,hold:0,holdImmune:0,burn:0,exposed:0,shardCd:0};}
function setup(x=2,y=2,r=0,wave=0){const s=createGame(813);s.wave=wave;s.towers=[];assert.ok(canPlace(s,'harpoon',x,y,r));const t=makeTower(s,'harpoon',x,y,r);s.towers.push(t);s.rewards=18;return{s,t};}

test('ordinary legal harpoon placements really fire during the opening wave',()=>{
 for(const [x,y,r] of [[2,2,0],[2,5,0],[2,2,2]]){
  const {s,t}=setup(x,y,r);resume(s);
  for(let i=0;i<6000&&s.phase==='combat';i++)step(s);
  assert.ok(t.shots>5,`${x},${y},${r} never fired reliably`);assert.ok(t.damage>500);assert.equal(s.wave,1);
 }
});

test('no legal opening-deck harpoon placement remains silent for the entire pursuit',()=>{
 const empty=createGame();empty.towers=[];const placements=possiblePlacements(empty,'harpoon');assert.equal(placements.length,35);
 for(const p of placements){const {s,t}=setup(p.x,p.y,p.r);resume(s);for(let i=0;i<6000&&s.phase==='combat';i++)step(s);assert.ok(t.shots>0&&t.damage>0,JSON.stringify(p));}
});

test('every legal harpoon orientation on both deck sizes acquires actual path enemies',()=>{
 const directions=new Set();
 for(const wave of [0,8]){const empty=createGame();empty.wave=wave;empty.towers=[];
  for(const p of possiblePlacements(empty,'harpoon')){
   const {s,t}=setup(p.x,p.y,p.r,wave);directions.add(p.r);assert.ok(harpoonPathSegments(t).length);
   const ps=Array.from({length:(PATH.length-1)*8},(_,i)=>i/8).filter(p=>harpoonCanAim(t,position(p)));
   assert.ok(ps.length,JSON.stringify(p));s.phase='combat';s.schedule=[];s.enemies=[enemy(999,ps[Math.floor(ps.length/2)])];
   step(s);assert.equal(t.shots,1);assert.equal(t.damage,ITEMS.harpoon.damage);
  }
 }
 assert.deepEqual([...directions].sort(),[0,1,2,3]);
});

test('harpoon pierces at most five on one line, ignoring armor, without hitting the whole aim sector',()=>{
 const {s,t}=setup();s.phase='combat';s.schedule=[];
 s.enemies=Array.from({length:6},(_,i)=>enemy(100+i,6+i*.1));
 const offLine=enemy(300,19);assert.ok(harpoonCanAim(t,position(offLine.p)));s.enemies.push(offLine);
 const shot=harpoonShot(t,s.enemies);assert.equal(shot.targets.length,5);assert.ok(!shot.targets.includes(offLine));
 step(s);assert.equal(s.enemies.filter(e=>e.hp<1000).length,5);assert.equal(offLine.hp,1000);assert.equal(t.damage,ITEMS.harpoon.damage*5);
 const fx=s.fx.find(f=>f.type==='beam'),o=origin(t);assert.ok(Math.abs(Math.atan2(fx.ty-o.y,fx.tx-o.x)-t.aim)<1e-9);
 for(const e of s.enemies.filter(e=>e.hp<1000)){const p=position(e.p),side=Math.abs((p.x-o.x)*Math.sin(t.aim)-(p.y-o.y)*Math.cos(t.aim));assert.ok(side<=ITEMS.harpoon.pierceWidth);}
});

test('harpoon does not fire behind itself or beyond range and its sector rotates in all four directions',()=>{
 for(let r=0;r<4;r++){const {t}=setup(r===1?10:r===3?0:2,r===1?0:r===3?6:2,r,r%2?8:0),o=origin(t),a=r*Math.PI/2;
  assert.ok(harpoonCanAim(t,{x:o.x+Math.cos(a)*3,y:o.y+Math.sin(a)*3}));
  assert.ok(!harpoonCanAim(t,{x:o.x-Math.cos(a)*3,y:o.y-Math.sin(a)*3}));
  assert.ok(!harpoonCanAim(t,{x:o.x+Math.cos(a)*7.1,y:o.y+Math.sin(a)*7.1}));
 }
 const {s,t}=setup();s.phase='combat';s.schedule=[];s.enemies=[enemy(101,0),enemy(102,10)];
 assert.equal(harpoonShot(t,s.enemies),null);step(s);assert.equal(t.shots,0);assert.equal(t.damage,0);
});

test('an existing save with a previously idle harpoon fires after loading without replacing the weapon',()=>{
 const {s,t}=setup();t.level=2;resume(s);s.waveTime=10;s.enemies=[enemy(200,6)];s.schedule=[];
 const loaded=deserialize(serialize(s));step(loaded);const restored=loaded.towers[0];
 assert.equal(restored.id,t.id);assert.equal(restored.x,2);assert.equal(restored.level,2);assert.equal(restored.shots,1);assert.ok(restored.damage>0);
});
