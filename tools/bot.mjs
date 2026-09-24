import {ITEMS,PATH} from '../src/content.js';
import {createGame,possiblePlacements,origin,position,distance,adjacent,modifiers,sets,makeTower,place,resume,step,acceptReward,clone,harpoonCanAim} from '../src/sim.js';
export function placementScore(s,t,mode='adaptive'){
 const d=ITEMS[t.type],o=origin(t),ss=sets(s),m=modifiers(s,t);let score=0;
 if(d.support){for(const other of s.towers){if(other.id===t.id||other.x===null||ITEMS[other.type].support)continue;const ms=modifiers({...s,towers:[...s.towers.filter(a=>a.id!==t.id),t]},other);const without={...s,towers:s.towers.filter(a=>a.id!==t.id)},before=modifiers(without,other);const gain=ms.damage/before.damage*before.speed/ms.speed*(1+Math.max(0,ms.range-before.range)*.15)-1;if(gain>0)score+=placementScore(without,other,mode)*(1+(other.level-1)*.7)*gain;}return score;}
 for(let i=0;i<PATH.length-1;i+=.5){const p=position(i),dist=distance(o,p);if(dist>(d.range+m.range)||dist<(d.minRange||0))continue;if(d.directional){const dir=[[1,0],[0,1],[-1,0],[0,-1]][t.r],dx=p.x-o.x,dy=p.y-o.y,f=dx*dir[0]+dy*dir[1],side=Math.abs(dx*dir[1]-dy*dir[0]);if(t.type==='harpoon'?!harpoonCanAim(t,p,d.range+m.range,o):(f<0||side>f*.85+.3))continue;}let v=1;if(t.type==='saw')v=3.2;if(t.type==='harpoon')v=2.5;if(t.type==='mortar')v=.85;if(['winch','oil'].includes(t.type)){v=.5;if(mode==='adaptive')for(const ally of s.towers)if(ally.x!==null&&['saw','flame','mortar'].includes(ally.type)&&distance(origin(ally),p)<ITEMS[ally.type].range)v+=.8;}score+=v;}
 score*=t.type==='winch'?.5:t.type==='oil'?.7:1;
 if(mode==='adaptive'){score*=m.damage/m.speed;if(m.links.length)score+=8;score+=Math.min(3,ss[d.team])*2;}
 return score;
}
export function bestPlacement(s,type,mode='adaptive',id=null){const t=id?s.towers.find(t=>t.id===id):{id:-1,type,level:1},ps=possiblePlacements(s,type,id);if(mode==='random')return ps[(s.kills+s.wave*17)%Math.max(1,ps.length)];let best=null;for(const p of ps){const a={...t,...p},score=placementScore(s,a,mode);if(!best||score>best.score)best={...p,score};}return best;}
export function botGarage(s,mode='adaptive'){
 for(const t of s.towers.filter(t=>t.x===null)){const p=bestPlacement(s,t.type,mode,t.id);if(p)place(s,t.id,p.x,p.y,p.r);}
 // All policies see only the public board and next-wave types. No future reward access.
 if(mode==='adaptive'&&s.wave%3===0&&!s.resumeMidWave){for(const t of s.towers.filter(a=>a.x!==null)){const p=bestPlacement(s,t.type,mode,t.id);if(p&&p.score>placementScore(s,t,mode)+3)place(s,t.id,p.x,p.y,p.r);}}
 if(s.towers.filter(t=>t.x===null).length>1)s.towers=s.towers.filter(t=>t.x!==null);
 resume(s);
}
export function botReward(s,mode='adaptive',preferred=null){
 let best=null;
 if(preferred&&s.rewards===0){acceptReward(s,({iron:'feeder',boiler:'mortar',electric:'winch'})[preferred]);return;}
 for(const type of s.choices){const d=ITEMS[type],existing=s.towers.find(t=>t.type===type&&t.level<3),p=bestPlacement(s,type,mode);let score=(p?.score??-100)*Math.max(.5,1-s.towers.filter(t=>t.x!==null).reduce((n,t)=>n+ITEMS[t.type].shape.length,0)/100),action='new';if(mode==='basic'&&d.support)score=-10;if(mode==='basic'&&['oil','winch'].includes(type))score*=.4;if(mode==='random')score=((s.kills*3+type.charCodeAt(0)*11)%23);if(existing){const u=d.support?placementScore({...s,towers:s.towers.filter(t=>t.id!==existing.id)},{...existing,level:existing.level+1},mode)-placementScore(s,existing,mode):placementScore(s,existing,mode)*.7;if(u>score||!p){score=u;action='upgrade';}}if(preferred&&d.team===preferred)score*=1.25;if(!best||score>best.score)best={type,score,action};}
 if(s.hp<25&&s.wave>5)acceptReward(s,'repair');else if(best&&best.score>0)acceptReward(s,best.type,best.action);else acceptReward(s,'repair');
}
export function runGame(seed,mode='adaptive',preferred=null,options={}){const s=createGame(seed);let ticks=0;while(!['victory','defeat'].includes(s.phase)&&ticks<90000){if(s.phase==='garage')botGarage(s,mode);else if(s.phase==='reward')botReward(s,mode,preferred);else {step(s);ticks++;}if(options.onState)options.onState(s,ticks);}return s;}
