import {W,H,PATH,PATH_KEYS,ITEMS,ENEMIES,TEAMS} from './content.js';
import {cells,origin,position,modifiers,canPlace,harpoonPathSegments} from './sim.js';
import {TAU,path,line,ellipse,plate,bolt,metal,flame,drawWeapon,drawGoblin,drawEnemy,drawField,drawTerrain} from './art.js';
export {drawGoblin,drawWeapon};
export function portrait(canvas,key,size=150,details={}){if(!canvas)return;canvas.width=size*2;canvas.height=size*2;const c=canvas.getContext('2d');c.scale(size*2,size*2);drawGoblin(c,key,details);}
export function itemIcon(canvas,type){if(!canvas)return;canvas.width=240;canvas.height=170;const c=canvas.getContext('2d');c.translate(116,86);c.scale(61,61);drawWeapon(c,type,0,0,0,0);}
function smoke(c,x,y,r,alpha=1){c.save();c.globalAlpha*=alpha;const g=c.createRadialGradient(x-r*.2,y-r*.2,.01,x,y,r);g.addColorStop(0,'#c3a57688');g.addColorStop(.6,'#695a4277');g.addColorStop(1,'#353e2f00');path(c,`M${x-r} ${y} C${x-r*1.2} ${y-r*.6} ${x-r*.4} ${y-r*.6} ${x-r*.2} ${y-r} C${x+r*.4} ${y-r*1.1} ${x+r*.8} ${y-r*.6} ${x+r} ${y} C${x+r*1.2} ${y+r*.7} ${x+r*.3} ${y+r} ${x} ${y+r*.7} C${x-r*.7} ${y+r} ${x-r} ${y+r*.4} ${x-r} ${y}Z`,g,null);c.restore();}
function directionArrow(c,o,r,color='#ffe0a0'){
 c.save();c.translate(o.x,o.y);c.rotate(r*Math.PI/2);
 for(const [stroke,width] of [['#182a22',.12],[color,.055]]){
  line(c,1.12,0,1.82,0,stroke,width);path(c,'M1.57 -.18 L1.82 0 L1.57 .18',null,stroke,width);
 }
 c.restore();
}
function harpoonPreview(c,s,t,valid=true){
 const preview={...s,towers:s.towers.map(a=>a.id===t.id?t:a)},range=ITEMS.harpoon.range+modifiers(preview,t).range,o=origin(t),a=t.r*Math.PI/2,h=ITEMS.harpoon.aimHalfAngle,color=valid?'#f5cf83':'#f18e78';
 c.save();c.beginPath();c.rect(0,0,W,H);c.clip();
 c.beginPath();c.moveTo(o.x,o.y);c.arc(o.x,o.y,range,a-h,a+h);c.closePath();c.fillStyle=valid?'#e3b97118':'#e7796020';c.fill();c.strokeStyle=color+'a0';c.lineWidth=.035;c.stroke();
 for(const [from,to] of harpoonPathSegments(t,range))line(c,from.x,from.y,to.x,to.y,color,.16);
 c.restore();
}
export class BoardRenderer{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.layout=null;this.field=null;this.terrain=null;this.lastHp=100;this.impact=0;}
 resize(){const box=this.canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),home=this.canvas.id==='home-board',portrait=box.width<720&&box.height>box.width;const w=box.width,h=box.height;
 if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);this.terrain=null;}
 const margins=home?{left:w*.3,right:25,top:50,bottom:40}:portrait?{left:12,right:12,top:116,bottom:190}:{left:22,right:230,top:143,bottom:190};
 // Screen-space safe areas protect every playable cell from the overlaid HUD.
 const cell=Math.max(8,Math.min((w-margins.left-margins.right)/(portrait?10.4:13.4),(h-margins.top-margins.bottom)/(portrait?13.4:10.4))),bw=(portrait?H:W)*cell,bh=(portrait?W:H)*cell;
 const left=margins.left+(w-margins.left-margins.right-bw)/2,top=margins.top+(h-margins.top-margins.bottom-bh)/2;
 this.layout={width:w,height:h,dpr,portrait,cell,left,top};
 }
 point(clientX,clientY){this.resize();const b=this.canvas.getBoundingClientRect(),l=this.layout,px=clientX-b.left,py=clientY-b.top;return l.portrait?{x:Math.floor((py-l.top)/l.cell),y:Math.floor(H-(px-l.left)/l.cell)}:{x:Math.floor((px-l.left)/l.cell),y:Math.floor((py-l.top)/l.cell)};}
 draw(s,selection=null,ghost=null,time=0){this.resize();const c=this.c,l=this.layout;c.setTransform(l.dpr,0,0,l.dpr,0,0);
 if(!this.terrain){this.terrain=document.createElement('canvas');this.terrain.width=l.width*l.dpr;this.terrain.height=l.height*l.dpr;const tc=this.terrain.getContext('2d');tc.scale(l.dpr,l.dpr);drawTerrain(tc,l.width,l.height);}
 c.drawImage(this.terrain,0,0,l.width,l.height);const drive=s.phase==='combat'?s.time:time*.1;
 c.save();if(l.portrait){c.translate(l.left+H*l.cell,l.top);c.rotate(Math.PI/2);}else c.translate(l.left,l.top);c.scale(l.cell,l.cell);
 for(let i=0;i<12;i++){const f=(drive*.12+i*.083)%1;smoke(c,-.6-f*1.3,(i%2?-.4:H+.4)+Math.sin(i)*.2,.14+f*.36,(1-f)*.35);}
 const fieldKey=s.wave>=8?'open':'closed';if(!this.field||this.fieldKey!==fieldKey){this.field=document.createElement('canvas');this.field.width=1300;this.field.height=1000;const fc=this.field.getContext('2d');fc.translate(50,50);fc.scale(100,100);drawField(fc,{wave:s.wave,pathKeys:PATH_KEYS,path:PATH});this.fieldKey=fieldKey;}
 c.save();c.shadowColor='#000a';c.shadowBlur=.28*l.cell;c.shadowOffsetY=.15*l.cell;c.drawImage(this.field,-.5,-.5,13,10);c.restore();
 for(const z of s.zones){const g=c.createRadialGradient(z.x,z.y,.05,z.x,z.y,1.2);g.addColorStop(0,z.fire?'#965624bb':'#171f17c9');g.addColorStop(1,'#182a1600');path(c,`M${z.x-1.1} ${z.y} C${z.x-.8} ${z.y-.65} ${z.x+.45} ${z.y-.7} ${z.x+1.1} ${z.y-.1} Q${z.x+.9} ${z.y+.65} ${z.x-.4} ${z.y+.5} Q${z.x-1.2} ${z.y+.55} ${z.x-1.1} ${z.y}Z`,g,null);if(z.fire)for(let i=0;i<5;i++)flame(c,z.x-.8+i*.37,z.y+.12,.4+Math.sin(i+time)*.15,.12,time+i);else path(c,`M${z.x-.65} ${z.y+.15} Q${z.x} ${z.y-.25} ${z.x+.6} ${z.y+.1}`,null,'#95945c66',.035);}
 const editing=['garage','reward'].includes(s.phase),focus=ghost||s.towers.find(t=>t.id===selection);
 if(focus?.type==='harpoon'&&focus.x!==null)harpoonPreview(c,s,focus,!ghost||canPlace(s,ghost.type,ghost.x,ghost.y,ghost.r,ghost.id));
 for(const t of s.towers){if(t.x===null)continue;const d=ITEMS[t.type],o=origin(t);for(const [x,y] of cells(t)){plate(c,x+.055,y+.08,.89,.83,metal(c,x,y,1,1,'#6e7b65','#3b5041'),editing?TEAMS[d.team].color:'#33493b',.05);for(const [u,v] of [[.14,.18],[.83,.8]])bolt(c,x+u,y+v,.026);}
 if(selection===t.id){if(t.type!=='harpoon')ellipse(c,o.x,o.y,(d.range||.5)+modifiers(s,t).range,(d.range||.5)+modifiers(s,t).range,'#eed29e13','#f5d08eaa',.025);for(const [x,y] of cells(t))plate(c,x+.04,y+.04,.92,.92,'#c3b17433','#f1d597');}
 let angle=d.directional?t.r*Math.PI/2:t.aim;
 if(t.type==='harpoon'&&s.phase==='combat'&&t.shots>0&&Math.abs(Math.atan2(Math.sin(t.aim-angle),Math.cos(t.aim-angle)))<=d.aimHalfAngle)angle=t.aim;
 drawWeapon(c,t.type,o.x,o.y,angle,s.phase==='combat'?s.time:0);
 if(d.directional)directionArrow(c,o,t.r);
 if(t.level>1){for(let i=0;i<t.level;i++)line(c,o.x-.16+i*.16,o.y+.59,o.x-.1+i*.16,o.y+.51,'#f2d087',.04);}
 }
 for(const t of s.towers){if(t.x===null||ITEMS[t.type].support||(!editing&&selection!==t.id))continue;const o=origin(t);for(const id of modifiers(s,t).links){const other=s.towers.find(a=>a.id===id),p=origin(other),d=`M${o.x} ${o.y} Q${(o.x+p.x)/2+.2} ${(o.y+p.y)/2+.2} ${p.x} ${p.y}`;path(c,d,null,'#162b25',.09);path(c,d,null,'#b1d6a0',.036);}}
 for(const e of s.enemies){const p=position(e.p),next=position(e.p+.1),angle=Math.atan2(next.y-p.y,next.x-p.x)+Math.PI/2;c.save();c.translate(p.x,p.y);c.rotate(angle);drawEnemy(c,e,s.time);c.restore();if(e.burn>0)flame(c,p.x+.06,p.y+.1,.55,.18,s.time+e.id);if(e.hold>0)path(c,`M${p.x-.24} ${p.y-.16} Q${p.x+.45} ${p.y-.3} ${p.x+.22} ${p.y+.22} Q${p.x-.4} ${p.y+.4} ${p.x-.24} ${p.y-.16}`,null,'#a5ceab',.036);if(e.hp<e.maxHp){const r=e.type==='boss'?.6:.27;plate(c,p.x-r,p.y-.56,r*2,.075,'#17271f',null,.02);plate(c,p.x-r,p.y-.56,r*2*Math.max(0,e.hp/e.maxHp),.075,'#daba76',null,.015);}}
 for(const shot of s.shots){c.save();if(shot.type==='bullet'){const e=s.enemies.find(e=>e.id===shot.target),p=e?position(e.p):{x:shot.x+.1,y:shot.y};c.translate(shot.x,shot.y);c.rotate(Math.atan2(p.y-shot.y,p.x-shot.x));line(c,-.27,0,.02,0,'#ffe1a866',.03);path(c,'M-.1 -.024 L.09 -.024 Q.17 0 .09 .024 L-.1 .024Z','#ece0b8','#826f49',.008);line(c,-.095,-.05,-.095,.05,'#d8c495',.025);}else{const f=1-shot.ttl/shot.total,x=shot.sx+(shot.tx-shot.sx)*f,y=shot.sy+(shot.ty-shot.sy)*f-Math.sin(f*Math.PI)*1.6;ellipse(c,shot.tx,shot.ty,shot.radius,shot.radius,'#ed9c4e08','#deba7877',.018);c.translate(x,y);c.rotate(Math.atan2(shot.ty-shot.sy-Math.cos(f*Math.PI)*4,shot.tx-shot.sx));path(c,'M-.15 -.09 L.07 -.09 Q.25 0 .07 .09 L-.15 .09 Z',metal(c,-.15,-.1,.4,.2,'#bbb99b','#4c5c4b'),'#263c31',.02);path(c,'M-.11 -.08 L-.24 -.15 L-.2 0 L-.24 .15 L-.11 .08','#bdaa78');}c.restore();}
 for(const f of s.fx){const age=1-f.life/f.maxLife;c.save();c.globalAlpha=Math.max(0,1-age);
 if(f.type==='flame'){c.translate(f.x,f.y);c.rotate(f.r*Math.PI/2);for(let i=0;i<8;i++){const d=.45+i*f.range/8;flame(c,d,Math.sin(i*9+s.time*8)*d*.3,.3+d*.55,.12+d*.14,s.time+i,Math.PI/2);}}
 else if(f.type==='blast'){for(let i=0;i<7;i++){const a=i*TAU/7,r=age*f.radius;smoke(c,f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,.15+age*.5,.8);flame(c,f.x+Math.cos(a)*r*.7,f.y+Math.sin(a)*r*.5,.4+age*.5,.1+age*.2,time+i);}for(let i=0;i<9;i++){const a=i*2.4;line(c,f.x+Math.cos(a)*age,f.y+Math.sin(a)*age,f.x+Math.cos(a)*(age+.13),f.y+Math.sin(a)*(age+.13),'#ffda89',.025);}}
 else if(f.type==='bolt'){let d=`M${f.x} ${f.y}`;for(let i=1;i<=9;i++){const t=i/9;d+=` L${f.x+(f.tx-f.x)*t+Math.sin(i*12)*.08} ${f.y+(f.ty-f.y)*t+Math.cos(i*13)*.08}`;}path(c,d,null,'#74dec844',.16);path(c,d,null,'#c4ffe1',.025);}
 else if(f.type==='tether'){path(c,`M${f.x} ${f.y} Q${(f.x+f.tx)/2+.12} ${(f.y+f.ty)/2+.15} ${f.tx} ${f.ty}`,null,'#ddcea2',.035);path(c,`M${f.tx-.07} ${f.ty-.13} C${f.tx+.2} ${f.ty-.2} ${f.tx+.19} ${f.ty+.15} ${f.tx} ${f.ty+.12}`,null,'#bacbc0',.05);}
 else if(f.type==='beam'){line(c,f.x,f.y,f.tx,f.ty,'#e5ddb833',.08);const x=f.x+(f.tx-f.x)*age,y=f.y+(f.ty-f.y)*age;c.translate(x,y);c.rotate(Math.atan2(f.ty-f.y,f.tx-f.x));line(c,-.6,0,.1,0,'#cfd9c4',.055);path(c,'M.02 -.022 L-.02 -.09 L.24 0 L-.02 .09 L.02 .022Z','#e1e6d0',null);}
 else if(f.type==='muzzle'){flame(c,f.x+.13,f.y,.3,.1,time,Math.PI/2);}
 else if(f.type==='leak'){smoke(c,f.x,f.y,.6+age*.7,.8);flame(c,f.x,f.y,.8,.23,time);}
 else if(f.type==='death'||f.type==='spark'){for(let i=0;i<5;i++){const a=i*2.4,r=age*.55;line(c,f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,f.x+Math.cos(a)*(r+.1),f.y+Math.sin(a)*(r+.1),i%2?'#ffc676':'#b9b096',.018);}if(f.type==='death')smoke(c,f.x,f.y,.16+age*.23,.5);}
 c.restore();}
 if(ghost){const d=ITEMS[ghost.type],valid=canPlace(s,ghost.type,ghost.x,ghost.y,ghost.r,ghost.id),color=valid?'#d6e9a4':'#ed9179';for(const [x,y]of cells(ghost))plate(c,x+.03,y+.03,.94,.94,valid?'#b3d59344':'#e8795a44',color);const o=origin(ghost);if(ghost.type!=='harpoon')ellipse(c,o.x,o.y,d.range||.6,d.range||.6,'#cee3a50a',color+'88',.025);c.globalAlpha=.7;drawWeapon(c,ghost.type,o.x,o.y,ghost.r*Math.PI/2,time);c.globalAlpha=1;if(d.directional)directionArrow(c,o,ghost.r,color);}
 if(s.phase==='victory'){path(c,'M2 2.15 Q4.5 2.5 7 2.2',null,'#cbb791',.035);for(let i=0;i<4;i++)path(c,`M${2.5+i} 2.25 L${3+i} 2.3 L${3.02+i} 2.92 Q${2.8+i} 2.82 ${2.47+i} 2.91Z`,['#c99b66','#9fb491','#b4795f','#b1c9b2'][i],'#304532',.02);for(const x of [3,5,7])plate(c,x,8.14,.4,.3,'#f7dca2');}
 c.restore();if(s.hp<this.lastHp)this.impact=1;this.lastHp=s.hp;if(this.impact>0){c.strokeStyle=`rgba(227,110,65,${this.impact*.6})`;c.lineWidth=12;c.strokeRect(0,0,l.width,l.height);this.impact-=.035;}
 }
}
