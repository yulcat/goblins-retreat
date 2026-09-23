import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runGame} from './bot.mjs';
const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i<0?fallback:process.argv[i+1];};
const count=Number(process.argv[2]||3),base=Number(arg('--base',813)),stride=Number(arg('--stride',7919)),label=arg('--label','latest'),results=[];
const sourceHash=createHash('sha256');for(const file of ['src/content.js','src/sim.js','tools/bot.mjs'])sourceHash.update(await readFile(file));const fingerprint=sourceHash.digest('hex');
for(const policy of ['basic','adaptive','random'])for(let i=0;i<count;i++){
 const seed=base+stride*i,start=performance.now(),s=runGame(seed,policy);
 const r={policy,seed,result:s.phase,wave:Math.min(18,s.wave+1),completedWaves:s.wave,seconds:Math.round(s.time),hp:Math.round(s.hp),kills:s.kills,rewards:s.rewards,synergyHits:s.stats.synergyHits,damage:Math.round(s.stats.damage),comboDamage:Math.round(s.stats.comboDamage),build:s.towers.map(t=>`${t.type}:${t.level}@${t.x},${t.y},${t.r}`),waves:s.stats.waveResults,runtimeMs:Math.round(performance.now()-start)};
 results.push(r);if((i+1)%20===0||i===count-1)console.log(policy,i+1,'/',count,'wins',results.filter(r=>r.policy===policy&&r.result==='victory').length);
}
const summary=Object.fromEntries(['basic','adaptive','random'].map(policy=>{const a=results.filter(r=>r.policy===policy),wins=a.filter(r=>r.result==='victory');return[policy,{runs:a.length,wins:wins.length,winRate:wins.length/a.length,firstChapterPassed:a.filter(r=>r.completedWaves>=6).length,combatSeconds:wins.length?{min:Math.min(...wins.map(r=>r.seconds)),max:Math.max(...wins.map(r=>r.seconds)),mean:Math.round(wins.reduce((a,r)=>a+r.seconds,0)/wins.length)}:null}];}));
await mkdir('reports',{recursive:true});await writeFile(`reports/balance-${label}.json`,JSON.stringify({created:new Date().toISOString(),fingerprint,count,base,stride,summary,results},null,2));console.log(summary);
if(results.some(r=>!['victory','defeat'].includes(r.result)))process.exitCode=1;
