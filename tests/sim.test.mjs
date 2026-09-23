import test from 'node:test';
import assert from 'node:assert/strict';
import {ITEMS,PATH,PATH_KEYS} from '../src/content.js';
import {shape,cells,canPlace,createGame,makeTower,place,stash,resume,step,sets,adjacent,modifiers,serialize,deserialize,clone,acceptReward,restoreCheckpoint} from '../src/sim.js';
test('rotations preserve connected footprint and return after four turns',()=>{for(const type of Object.keys(ITEMS)){assert.deepEqual(shape(type,0),shape(type,4));for(let r=0;r<4;r++){const pts=shape(type,r);assert.equal(new Set(pts.map(p=>p.join(','))).size,ITEMS[type].shape.length);}}});
test('path contiguous, unique, non-buildable',()=>{assert.equal(PATH_KEYS.size,PATH.length);for(let i=1;i<PATH.length;i++)assert.equal(Math.abs(PATH[i][0]-PATH[i-1][0])+Math.abs(PATH[i][1]-PATH[i-1][1]),1);const s=createGame();assert.equal(canPlace(s,'feeder',0,1),false);assert.equal(canPlace(s,'nail',-1,0),false);assert.equal(canPlace(s,'saw',2,5),false);});
test('adjacency counts once and repeated supports do not stack',()=>{const s=createGame();const t=s.towers[0];s.towers.push(makeTower(s,'feeder',3,2),makeTower(s,'feeder',7,2));assert.equal(modifiers(s,t).speed,.72);assert.equal(modifiers(s,t).links.length,2);assert.equal(sets(s).iron,3);s.towers.push(makeTower(s,'nail',5,5));assert.equal(sets(s).iron,3);});
test('moving and stashing preserve cooldown, level, heat and identity',()=>{const s=createGame(),t=s.towers[0];t.cd=1.3;t.age=7;t.level=2;const id=t.id;assert.equal(stash(s,id),true);assert.equal(place(s,id,4,5,0),true);assert.equal(t.cd,1.3);assert.equal(t.age,7);assert.equal(t.level,2);});
test('cannot edit during battle',()=>{const s=createGame();resume(s);assert.equal(place(s,s.towers[0].id,4,5,0),false);assert.equal(stash(s,s.towers[0].id),false);});
test('identical seeds and saved combat state replay deterministically',()=>{const a=createGame(324),b=createGame(324);resume(a);resume(b);for(let i=0;i<450;i++){step(a);step(b);}assert.deepEqual(a,b);const c=deserialize(serialize(a));a.fx=[];a.events=[];for(let i=0;i<100;i++){step(a);step(c);}assert.deepEqual(a,c);});
test('reward costs one selection, duplicate upgrade keeps identity',()=>{const s=createGame();s.phase='reward';s.choices=['nail','feeder','saw'];const id=s.towers[0].id;acceptReward(s,'nail','upgrade');assert.equal(s.towers[0].id,id);assert.equal(s.towers[0].level,2);assert.equal(s.rewards,1);assert.equal(s.phase,'garage');assert.equal(acceptReward(s,'nail'),null);});
test('engine defeat and finite kill reward',()=>{const s=createGame();resume(s);s.hp=1;s.enemies.push({id:999,type:'grunt',p:PATH.length-1.01,hp:30,maxHp:30,speed:5,armor:0,age:0,hold:0,holdImmune:0,burn:0,exposed:0,shardCd:0});step(s);assert.equal(s.phase,'defeat');assert.equal(s.hp,0);assert.equal(s.kills,0);});

test('directional harpoon can hit the adjacent lane and pierces armor',()=>{
 const s=createGame();s.towers=[makeTower(s,'harpoon',0,3,0)];s.phase='combat';s.schedule=[];s.rewardAt=99999;
 const e={id:999,type:'armor',p:20,hp:300,maxHp:300,speed:0,armor:100,age:0,hold:0,holdImmune:0,burn:0,exposed:0,shardCd:0};s.enemies=[e];step(s);assert.equal(e.hp,300-ITEMS.harpoon.damage);
});
test('strongest battery wins regardless of installation order',()=>{
 const s=createGame();s.towers=[makeTower(s,'coil',4,2),makeTower(s,'battery',3,2),makeTower(s,'battery',7,2)];s.towers[1].level=3;assert.ok(Math.abs(modifiers(s,s.towers[0]).damage-1.65)<1e-9);s.towers.reverse();assert.ok(Math.abs(modifiers(s,s.towers.at(-1)).damage-1.65)<1e-9);
});
test('boss breakthrough is fatal even with the assisted engine',()=>{
 const s=createGame();s.hp=s.maxHp=140;resume(s);s.enemies=[{id:999,type:'boss',p:PATH.length-1.01,hp:900,maxHp:900,speed:5,armor:5,age:0,hold:0,holdImmune:0,burn:0,exposed:0,shardCd:0}];step(s);assert.equal(s.phase,'defeat');assert.equal(s.hp,0);
});

test('checkpoint retry keeps the build and offers a real assisted buffer',()=>{const s=createGame(88);s.wave=6;s.hp=42;resume(s);s.hp=0;s.phase='defeat';const normal=restoreCheckpoint(s),assist=restoreCheckpoint(s,true);assert.equal(normal.phase,'garage');assert.equal(normal.wave,6);assert.equal(normal.hp,42);assert.equal(assist.hp,140);assert.equal(assist.maxHp,140);assert.deepEqual(normal.towers,s.checkpoint.towers);});
