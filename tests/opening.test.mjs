import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,scheduleWave,resume,step,acceptReward,place} from '../src/sim.js';
import {bestPlacement} from '../tools/bot.mjs';
test('opening rush is a real cluster with counterable engine pressure',()=>{
 const s=createGame(813),schedule=scheduleWave(s);assert.ok(schedule.filter(a=>a.at>=18&&a.at<=21).length>=12);
 s.rewards=18;resume(s);let peak=0,alerts=0;
 for(let i=0;i<6000&&s.phase==='combat';i++){step(s);peak=Math.max(peak,s.enemies.length);alerts+=s.events.filter(e=>e.type==='rush').length;s.events=[];}
 assert.equal(s.phase,'garage');assert.equal(alerts,1);assert.ok(peak>=12);assert.ok(s.hp>=70&&s.hp<100);assert.ok(s.stats.leaks>0);
});
test('first offered winch can prevent the opening breakthrough',()=>{
 const s=createGame(813);resume(s);
 for(let i=0;i<6000&&s.wave===0;i++){
  if(s.phase==='reward'){assert.ok(s.choices.includes('winch'));const t=acceptReward(s,'winch'),p=bestPlacement(s,'winch','adaptive',t.id);assert.ok(place(s,t.id,p.x,p.y,p.r));resume(s);}
  else step(s);
 }
 assert.equal(s.wave,1);assert.equal(s.hp,100);assert.equal(s.stats.leaks,0);
});
