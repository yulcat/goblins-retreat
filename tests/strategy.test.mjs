import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,makeTower,canPlace,clone,resume,step,sets,modifiers} from '../src/sim.js';
test('same equipment, same enemies: adjacent supports turn a losing wave into a surviving wave',()=>{
 const base=createGame(915);base.wave=11;base.towers=[];
 for(const [type,x,y,r]of[['nail',4,2,0],['nail',7,2,0],['saw',2,5,0],['mortar',6,5,0],['feeder',4,3,1],['feeder',7,3,1],['cooler',8,6,0]]){assert.ok(canPlace(base,type,x,y,r));const t=makeTower(base,type,x,y,r);t.level=2;base.towers.push(t);}
 const together=clone(base),apart=clone(base);let x=1;for(const t of apart.towers)if(['feeder','cooler'].includes(t.type)){assert.ok(canPlace(apart,t.type,x,8,t.type==='feeder'?1:0,t.id));t.x=x;t.y=8;t.r=t.type==='feeder'?1:0;x+=3;}
 assert.deepEqual(sets(together),sets(apart));
 for(const s of [together,apart]){resume(s);s.rewards=18;for(let i=0;i<6000&&s.phase==='combat';i++)step(s);}
 assert.equal(together.phase,'garage');assert.ok(together.hp>0);assert.equal(apart.phase,'defeat');assert.ok(together.stats.damage>apart.stats.damage);
});
test('support upgrades improve their actual effect without stacking duplicates',()=>{const s=createGame(),t=s.towers[0],support=makeTower(s,'feeder',3,2);s.towers.push(support);const before=modifiers(s,t).speed;support.level=3;assert.ok(modifiers(s,t).speed<before);});
