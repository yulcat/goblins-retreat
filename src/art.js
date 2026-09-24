// Hand-painted forms built from Canvas paths. No bitmap or generated-image assets.
export const TAU=Math.PI*2;
export function path(c,d,fill,stroke='#1b2521',width=.035){const p=new Path2D(d);if(fill){c.fillStyle=fill;c.fill(p);}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke(p);}}
export function line(c,x,y,u,v,color,width=.035){c.beginPath();c.moveTo(x,y);c.lineTo(u,v);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
export function ellipse(c,x,y,rx,ry,fill,stroke=null,w=.025){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke();}}
export function plate(c,x,y,w,h,fill,stroke='#182421',r=.06){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.035;c.stroke();}}
export function metal(c,x,y,w,h,a='#b4b9a1',b='#43534e'){const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,a);g.addColorStop(.23,'#758778');g.addColorStop(.5,a);g.addColorStop(1,b);return g;}
export function bolt(c,x,y,r=.034){ellipse(c,x,y,r,r,'#b7b49a','#343d33',.013);line(c,x-r*.5,y,x+r*.5,y,'#3d483c',.012);}
const noise=n=>{const a=Math.sin(n*12.9898)*43758.5453;return a-Math.floor(a);};
function hose(c,d,col='#282c24',w=.09){path(c,d,null,'#101b19',w+.035);path(c,d,null,col,w);path(c,d,null,'#ad927033',w*.22);}
function tank(c,x,y,w,h,color){plate(c,x,y,w,h,metal(c,x,y,w,h,color,'#302f25'),null,w*.42);ellipse(c,x+w/2,y+.035,w/2,.085,'#819184','#303d32');for(const yy of [y+.15,y+h-.18])plate(c,x-.015,yy,w+.03,.065,'#383e34');bolt(c,x+w/2,y+.03,.026);}
export function drawWeapon(c,type,x,y,angle=0,time=0){
 c.save();c.translate(x,y);c.scale(1.25,1.25);ellipse(c,.045,.19,.58,.3,'#0c151b80');
 // Welded pedestal, bearing, and mounting feet ground each mechanism in the deck.
 for(const q of [-1,1]){plate(c,q*.36-.09,.1,.18,.35,'#485449');bolt(c,q*.36,.37);}
 ellipse(c,0,.08,.39,.28,metal(c,0,-.2,.8,.6),'#1c2b24',.05);ellipse(c,0,.02,.29,.19,'#394d43','#a3a58c',.025);
 if(['nail','harpoon','flame'].includes(type))c.rotate(angle);
 if(type==='nail'){
  plate(c,-.37,-.24,.65,.47,metal(c,-.3,-.24,.6,.47,'#8e9c84','#32433a'));
  plate(c,-.25,-.29,.29,.12,'#786847');for(let i=0;i<4;i++){plate(c,-.22+i*.067,-.39,.045,.19,metal(c,0,-.4,.05,.2,'#ddc28a','#6e5836'),null,.016);}
  plate(c,.12,-.12,.59,.24,metal(c,.1,-.12,.6,.24,'#98aaa0','#253a34'));for(let i=0;i<4;i++)line(c,.25+i*.1,-.12,.25+i*.1,.12,'#263d36',.034);
  ellipse(c,.74,0,.065,.17,'#39463d','#b4b7a1',.035);ellipse(c,.754,0,.033,.105,'#101918');
  hose(c,'M-.3 .19 C-.55 .5 .2 .52 .16 .2','#877345',.07);plate(c,-.45,-.11,.1,.18,'#a8854b');bolt(c,-.22,.11);bolt(c,.03,-.12);line(c,-.17,-.15,.06,-.15,'#d0b476',.025);
 }else if(type==='harpoon'){
  plate(c,-.52,-.16,1.03,.32,metal(c,-.5,-.16,1,.32,'#a5a99d','#3c4c45'));plate(c,-.32,-.08,.77,.16,'#1b2d28');
  for(let i=0;i<6;i++){line(c,-.35+i*.09,-.14,-.31+i*.09,.14,'#dacb95',.03);}
  path(c,'M-.12 -.17 Q.03 -.62 .35 -.49 M-.12 .17 Q.03 .62 .35 .49',null,'#6d7f70',.065);line(c,.35,-.49,-.27,0,'#d6caa7',.021);line(c,-.27,0,.35,.49,'#d6caa7',.021);
  line(c,-.36,0,.85,0,'#dae1cf',.055);path(c,'M.69 0 L.86 -.115 L1 0 L.86 .115 Z','#b9c9be','#233e34');path(c,'M.8 -.055 L.69 -.13 L.76 -.015 M.8 .055 L.69 .13 L.76 .015',null,'#dbe6cf',.025);bolt(c,-.4,.09);
 }else if(type==='saw'){
  hose(c,'M-.2 .24 C-.6 .27 -.64 -.2 -.26 -.3','#5b6d58');plate(c,-.25,-.26,.52,.45,metal(c,-.25,-.26,.5,.45,'#879687','#263e34'));c.save();c.rotate(time*6);
  let d='';for(let i=0;i<24;i++){const a=i*TAU/24,b=a+.12;d+=`${i?'L':'M'}${Math.cos(a)*.62} ${Math.sin(a)*.62} L${Math.cos(b)*.49} ${Math.sin(b)*.49} `;}path(c,d+'Z',metal(c,-.6,-.6,1.2,1.2,'#d3d4c0','#65766d'),'#243c32',.024);
  for(let i=0;i<6;i++){const a=i*TAU/6;line(c,Math.cos(a)*.29,Math.sin(a)*.29,Math.cos(a+.2)*.46,Math.sin(a+.2)*.46,'#455e51',.026);}ellipse(c,0,0,.2,.2,'#849e8b','#344e40');bolt(c,0,0,.09);c.restore();
  path(c,'M-.51 -.33 Q-.1 -.73 .42 -.42',null,'#ad7650',.11);for(const x of [-.35,.25])bolt(c,x,-.4);
 }else if(type==='mortar'){
  plate(c,-.55,.14,1.05,.2,metal(c,-.5,.14,1,.2));line(c,-.35,.2,-.12,-.22,'#657c68',.09);line(c,.36,.2,.13,-.22,'#657c68',.09);c.rotate(-.28);
  path(c,'M-.25 .2 L-.3 -.4 Q-.02 -.53 .26 -.4 L.24 .2 Q0 .36 -.25 .2Z',metal(c,-.3,-.4,.6,.7,'#b2b99c','#3b5043'));
  ellipse(c,-.02,-.42,.32,.14,'#b79962','#334237',.04);ellipse(c,-.02,-.435,.235,.085,'#111c19');ellipse(c,-.04,-.47,.16,.032,'#4c5c48');line(c,-.2,-.2,.19,-.2,'#b47d4f',.06);plate(c,.25,-.04,.14,.17,'#99844e');bolt(c,.32,.035);
 }else if(type==='flame'){
  tank(c,-.48,-.33,.28,.65,'#d19a67');tank(c,-.16,-.28,.24,.58,'#738b69');hose(c,'M-.34 .32 C-.4 .63 .41 .5 .3 .05','#514f35');
  plate(c,.02,-.105,.72,.21,metal(c,0,-.1,.75,.2,'#aa9980','#3f4036'));for(let i=0;i<4;i++)ellipse(c,.34+i*.1,0,.025,.14,'#6c5640','#d7a76f',.012);
  ellipse(c,.79,0,.075,.145,'#937245','#cfad76');ellipse(c,.8,0,.035,.09,'#301c12');flame(c,.83,0,.21,.13,time,Math.PI/2);
 }else if(type==='coil'){
  plate(c,-.35,-.16,.7,.43,'#405d4c');for(let i=0;i<6;i++)ellipse(c,0,.17-i*.09,.26,.07,metal(c,0,-.3,.4,.1,'#dcad64','#765238'),'#704d30',.018);
  line(c,0,-.4,0,-.64,'#bbd6bc',.09);ellipse(c,0,-.67,.24,.15,metal(c,0,-.82,.5,.3,'#c7e5d8','#4e7d76'),'#416258');ellipse(c,-.06,-.72,.1,.025,'#eefff0');hose(c,'M-.2 .22 C-.62 .35 -.6 -.36 -.35 -.34','#82743f',.045);bolt(c,.27,.23);
 }else if(type==='winch'){
  for(const x of [-.35,.35])plate(c,x-.045,-.32,.09,.62,metal(c,0,-.3,.1,.6));tank(c,-.27,-.2,.54,.4,'#a3a280');for(let i=0;i<10;i++)line(c,-.24+i*.05,-.18,-.24+i*.05,.18,'#d2c7a1',.022);
  hose(c,'M.24 .04 Q.68 .12 .62 .47','#c4b796',.045);path(c,'M.62 .35 L.64 .52 C.68 .83 .22 .8 .34 .52 L.43 .59',null,'#a9b9a7',.07);bolt(c,-.37,-.27);bolt(c,.37,.26);
 }else if(type==='oil'){
  tank(c,-.33,-.46,.57,.77,'#b09355');plate(c,-.15,-.52,.15,.14,'#585c44');hose(c,'M-.22 .26 C-.48 .48 .47 .5 .35 -.02','#494b35',.07);plate(c,.16,-.14,.48,.13,metal(c,.16,-.14,.48,.13));ellipse(c,.63,-.07,.07,.13,'#8c9879','#354d3c');for(let i=0;i<3;i++)ellipse(c,.635,-.15+i*.07,.02,.02,'#172f28');path(c,'M-.17 -.1 C-.32 .06 -.02 .13 -.05 -.02 L-.1 -.18 Z','#3b3822');
 }else if(type==='feeder'){
  path(c,'M-.43 -.28 L.28 -.34 L.45 -.05 L.34 .31 L-.4 .28 Z',metal(c,-.4,-.3,.8,.6,'#a99964','#635436'));plate(c,-.33,-.18,.61,.29,'#322f22');for(let i=0;i<6;i++){tank(c,-.3+i*.095,-.18,.075,.31,'#d3b678');}hose(c,'M.25 .13 C.55 .14 .63 .41 .35 .46','#938366',.1);for(const x of [-.31,.3])bolt(c,x,.21);
 }else if(type==='cooler'){
  plate(c,-.42,-.38,.84,.72,metal(c,-.4,-.4,.8,.7,'#a9b8a7','#35564c'));for(let i=0;i<7;i++){plate(c,-.32+i*.1,-.29,.045,.53,'#2b443b',null,.013);line(c,-.305+i*.1,-.27,-.305+i*.1,.2,'#a0bcab',.018);}hose(c,'M-.39 -.1 C-.67 -.12 -.62 .52 -.14 .4','#89a896');plate(c,.37,-.23,.1,.15,'#be9a63');bolt(c,-.35,-.32);bolt(c,.34,.28);
 }else if(type==='battery'){
  for(const x of [-.38,.06]){tank(c,x,-.32,.33,.65,'#7fa787');plate(c,x+.1,-.45,.12,.15,metal(c,x,-.4,.12,.15,'#d7c888','#766640'));path(c,`M${x+.05} -.1 Q${x+.16} -.18 ${x+.27} -.1 L${x+.27} .13 L${x+.05} .13Z`,'#c7b67a');line(c,x+.09,0,x+.24,0,'#506548',.03);}hose(c,'M-.2 -.39 C-.2 -.63 .3 -.65 .23 -.4','#d4a75b',.045);hose(c,'M-.25 .24 C-.05 .53 .56 .41 .46 .05','#597761');
 }else if(type==='scope'){
  c.rotate(-.45);line(c,-.1,.1,-.2,.42,'#798e75',.08);line(c,.1,.1,.2,.42,'#798e75',.08);plate(c,-.5,-.15,.83,.3,metal(c,-.5,-.15,.9,.3,'#b6b994','#4c6555'));ellipse(c,.35,0,.13,.23,'#9aa991','#314f42');ellipse(c,.38,0,.085,.17,metal(c,.3,-.17,.2,.34,'#a3dece','#264e4c'));path(c,'M.35 -.11 Q.42 -.08 .41 .03',null,'#e6fff1',.025);plate(c,-.22,-.25,.16,.12,'#bca16e');bolt(c,-.14,-.24,.025);
 }
 c.restore();
}
export function flame(c,x,y,h,w,time=0,angle=0){c.save();c.translate(x,y);c.rotate(angle);for(let i=0;i<3;i++){const f=1-i*.24,lean=Math.sin(time*13+i)*w*.2,g=c.createLinearGradient(0,0,0,-h*f);g.addColorStop(0,i===2?'#fff2b7':'#ee7625');g.addColorStop(.5,i===2?'#ffdc74':'#fda643');g.addColorStop(1,'#ea652000');path(c,`M${-w*f} 0 C${-w*1.1*f} ${-h*.38} ${w*.38+lean} ${-h*.46} ${lean} ${-h*f} C${w*.62+lean} ${-h*.62} ${w*1.25*f} ${-h*.2} ${w*f} 0 Q0 ${h*.14} ${-w*f} 0Z`,g,null);}c.restore();}
export function drawGoblin(c,key,{badge=true}={}){
 c.save();const bg=c.createLinearGradient(0,0,1,1);bg.addColorStop(0,{rivet:'#857456',boil:'#4f786d',git:'#8c6151'}[key]);bg.addColorStop(1,'#152c29');c.fillStyle=bg;c.fillRect(0,0,1,1);
 // Coat, bent shoulders, stitched lapels and hands give each portrait a lived-in silhouette.
 path(c,'M.07 1 Q.09 .76 .31 .76 L.66 .76 Q.92 .73 .98 1Z',metal(c,0,.72,1,.3,key==='git'?'#995e47':'#626d50','#26382e'));
 path(c,'M.31 .76 L.46 .91 L.37 1 L.22 .83 M.66 .76 L.55 .93 L.65 1 L.82 .84',null,'#b69b69',.025);
 const skin=metal(c,.2,.21,.65,.6,'#b1bc79','#587151');
 path(c,'M.29 .39 C.2 .29 .07 .32 .025 .25 Q.04 .52 .27 .58 M.72 .4 Q.89 .29 .99 .26 Q.94 .51 .73 .6',skin,'#31462f',.018);
 path(c,'M.19 .43 Q.08 .36 .07 .34 Q.1 .48 .21 .49 M.81 .43 Q.9 .36 .94 .34 Q.91 .47 .8 .49','#827e59',null);
 path(c,'M.29 .26 C.37 .16 .66 .15 .76 .32 L.8 .57 Q.76 .81 .56 .86 Q.31 .86 .23 .65 L.24 .43Z',skin,'#263e2c',.023);
 path(c,'M.49 .41 Q.42 .54 .42 .62 Q.51 .71 .62 .61 L.57 .43','#b2bd7d','#596e45',.015);path(c,'M.44 .62 Q.53 .65 .61 .61',null,'#5e7047',.02);
 path(c,'M.33 .71 Q.49 .78 .67 .7',null,'#35452f',.024);path(c,'M.37 .72 Q.36 .82 .42 .75 M.63 .73 Q.66 .81 .67 .7','#ede4b5','#68734d',.008);
 for(const x of [.34,.66]){path(c,`M${x-.07} .48 Q${x} .44 ${x+.06} .48 Q${x} .55 ${x-.07} .48Z`,'#e4dbaa',null);ellipse(c,x+.012,.489,.017,.03,'#202f27');}
 if(key==='rivet'){
  path(c,'M.22 .32 L.29 .12 Q.49 .01 .73 .16 L.79 .33Z',metal(c,.2,.07,.6,.3,'#9c9570','#425940'));path(c,'M.3 .15 Q.49 .08 .7 .19',null,'#b6a175',.025);
  path(c,'M.23 .32 Q.51 .25 .8 .34',null,'#6d472d',.065);for(const x of [.35,.66]){ellipse(c,x,.35,.135,.108,metal(c,x,.24,.25,.22,'#d6b376','#75603c'),'#3a4430');ellipse(c,x,.35,.099,.076,'#315758');path(c,`M${x-.06} .35 Q${x} .26 ${x+.06} .32`,null,'#b0dfcb',.018);}line(c,.47,.34,.53,.34,'#dcc293',.025);
  path(c,'M.3 .43 L.43 .43 M.59 .43 L.72 .46',null,'#435636',.022);path(c,'M.76 .16 Q.84 .3 .76 .62',null,'#b79b60',.024);bolt(c,.81,.31,.024);
  path(c,'M.13 .99 L.22 .8 L.27 .83 L.23 1','#827c58','#23382b');path(c,'M.2 .84 L.25 .71 L.3 .68 L.31 .76 L.26 .85','#bac3a2','#384b37',.016);
 }else if(key==='boil'){
  path(c,'M.2 .31 L.27 .13 Q.54 .04 .76 .2 L.81 .33Z',metal(c,.2,.1,.6,.25,'#6c8b78','#2a4f49'));path(c,'M.19 .3 Q.47 .21 .81 .34 Q.74 .42 .61 .38 L.25 .36Z','#243f37','#799781',.02);
  path(c,'M.28 .42 Q.36 .36 .43 .41 M.59 .41 Q.67 .36 .73 .45',null,'#456344',.026);path(c,'M.36 .74 Q.49 .7 .61 .74',null,'#44543a',.013);
  path(c,'M.61 .86 Q.7 .72 .78 .77 L.81 .91 L.74 .97Z',skin,'#384f32');path(c,'M.7 .79 L.9 .79 L.88 .97 Q.8 1 .72 .96Z',metal(c,.7,.79,.2,.2,'#e8d8aa','#9f9874'));path(c,'M.9 .82 C1 .78 1 .94 .89 .92',null,'#c1b18b',.034);ellipse(c,.8,.8,.095,.022,'#443b25');path(c,'M.8 .74 C.72 .69 .86 .65 .79 .59',null,'#dadbc055',.018);
 }else{
  path(c,'M.17 .3 L.21 .04 Q.51 -.01 .81 .06 L.87 .33Z',metal(c,.17,.04,.7,.3,'#676955','#353f33'));path(c,'M.18 .27 L.85 .29 L.88 .35 Q.53 .39 .16 .34Z','#954e38','#302e22',.018);
  if(badge){path(c,'M.45 .09 Q.5 .16 .59 .09 L.58 .23 Q.52 .3 .46 .23Z','#d9b873','#675332',.016);path(c,'M.46 .11 L.54 .22',null,'#f6d797',.015);}path(c,'M.27 .44 L.43 .49 M.6 .44 L.73 .42',null,'#455e3e',.026);path(c,'M.36 .72 Q.53 .8 .68 .68',null,'#35452d',.02);path(c,'M.12 .89 Q.48 .95 .79 .78',null,'#ba9158',.046);bolt(c,.79,.82,.034);
 }
 // Asymmetric freckles, creases and edge light avoid a flat icon face.
 for(let i=0;i<7;i++)ellipse(c,.28+noise(i+4)*.08,.58+noise(i+9)*.09,.008,.005,'#758250');path(c,'M.27 .51 Q.25 .66 .36 .74',null,'#ccd08c55',.013);c.restore();
}
export function drawEnemy(c,e,time){
 const boss=e.type==='boss';c.save();ellipse(c,0,.16,boss?.65:.28,boss?.42:.18,'#111b2080');
 if(boss){for(const x of [-.47,.47]){plate(c,x-.13,-.55,.26,1.1,'#293734');for(let i=0;i<8;i++){plate(c,x-.14,-.53+i*.135,.28,.09,metal(c,0,0,.28,.09,'#7d887b','#283732'));}}path(c,'M-.37 -.52 L.29 -.55 L.42 -.32 L.4 .41 L.2 .54 L-.38 .4Z',metal(c,-.4,-.5,.8,1,'#a89b7b','#495949'));plate(c,-.23,-.26,.47,.43,'#5f7468','#242e27');for(let i=0;i<4;i++)line(c,-.3,.2+i*.06,.28,.2+i*.06,'#263b34',.028);plate(c,-.1,-.65,.2,.52,metal(c,-.1,-.7,.2,.6));ellipse(c,0,-.64,.1,.035,'#152622');for(const x of [-.29,.3]){bolt(c,x,-.36,.04);ellipse(c,x,-.49,.045,.045,'#efc981');}}
 else{
 const armored=['armor','raider'].includes(e.type),small=e.type==='swarm',s=small?.75:1;c.scale(s,s);const walk=Math.sin(time*(e.type==='runner'?17:10)+e.id)*.07;
 for(const q of [-1,1]){path(c,`M${q*.11} .1 Q${q*.2} .23 ${q*.15} ${.37+walk*q}`,null,'#4a5142',.11);plate(c,q*.15-.075,.28+walk*q,.15,.19,'#2c352b',null,.05);}
 if(e.type==='captain')path(c,'M-.19 -.1 Q-.4 .17 -.32 .45 Q0 .33 .32 .47 Q.39 .17 .19 -.1Z','#9f5643','#3e3729');
 path(c,'M-.16 -.14 Q0 -.23 .18 -.13 L.23 .18 Q0 .3 -.23 .16Z',metal(c,-.2,-.2,.4,.5,armored?'#bac7c4':e.type==='swarm'?'#bc9d6a':'#9e9f80',armored?'#4d6671':'#566449'));
 for(const q of [-1,1]){path(c,`M${q*.17} -.07 Q${q*.32} .04 ${q*.3} .16`,null,armored?'#869c9b':'#b0a587',.11);bolt(c,q*.18,-.06,.024);}
 path(c,'M-.16 -.27 Q-.08 -.46 .09 -.43 Q.24 -.31 .15 -.13 Q0 -.03 -.16 -.15Z',metal(c,-.2,-.45,.4,.4,armored?'#aebdbc':'#7c8b78','#3f5350'));
 path(c,'M-.14 -.22 Q0 -.16 .16 -.24',null,'#273b37',.05);path(c,'M-.1 -.36 Q.03 -.43 .13 -.3',null,'#d3cbb0',.018);
 if(e.type==='raider')path(c,'M-.14 -.31 Q-.43 -.18 -.42 -.47',null,'#bb6748',.065);
 if(armored){path(c,'M-.41 -.02 Q-.29 -.07 -.22 .02 L-.2 .33 Q-.33 .41 -.45 .24Z',metal(c,-.45,0,.3,.4,'#99aeb3','#395461'));line(c,-.34,.04,-.32,.29,'#cfb378',.028);}
 else if(e.type==='runner'){path(c,'M-.14 -.28 Q-.45 -.14 -.35 -.42',null,'#b67549',.07);line(c,.29,.13,.34,-.29,'#c2bda1',.035);}
 else{plate(c,.25,-.24,.065,.49,'#65543b');line(c,.28,-.29,.28,.12,'#a8b4a1',.045);}
 if(e.type==='captain'){line(c,.34,.12,.4,-.69,'#c1ac78',.035);path(c,'M.4 -.69 C.59 -.77 .68 -.53 .89 -.65 L.85 -.37 Q.64 -.27 .4 -.43Z','#b86749','#473f2c',.02);path(c,'M.5 -.6 L.53 -.45 L.72 -.47',null,'#eac58a',.02);}
 if(e.type==='ranger'){path(c,'M.14 -.34 Q.51 -.14 .17 .21',null,'#b69864',.04);line(c,.14,-.34,.17,.21,'#e6d3a0',.015);}
 }
 c.restore();
}
export function drawField(c,s){
 for(const y of [-.52,9.08]){plate(c,-.06,y,12.1,.44,'#26352e','#111d18',.15);for(let x=.03;x<12;x+=.28){plate(c,x,y+.025,.21,.37,metal(c,x,y,.25,.4,'#7b8570','#343e33'),null,.025);line(c,x+.03,y+.04,x+.04,y+.3,'#a8a283',.02);}}
 path(c,'M-.25 .04 L-.03 -.24 L11.95 -.24 L12.24 .09 L12.24 8.92 L11.92 9.23 L.05 9.23 L-.25 8.95Z',metal(c,0,-.3,12,10,'#9f8859','#544b36'),'#17281f',.09);
 for(let y=0;y<9;y++)for(let x=0;x<12;x++){
  const key=`${x},${y}`,walk=s.pathKeys.has(key),n=noise(x+y*19);
  plate(c,x+.018,y+.018,.964,.964,walk?'#8b7050':metal(c,x,y,1,1,n>.5?'#627460':'#5d6b5a','#36483c'),'#343d2d',.025);
  if(walk){for(let k=0;k<4;k++){const yy=y+.05+k*.23;line(c,x+.04,yy,x+.96,yy,'#403e2c',.025);for(let j=0;j<3;j++){const xx=x+.05+noise(x*23+y+k+j)*.25;path(c,`M${xx} ${yy+.06+j*.04} Q${x+.5} ${yy+.04+j*.04} ${x+.91} ${yy+.08+j*.04}`,null,'#c0a57444',.012);}}}
  else{for(let i=0;i<8;i++){const xx=x+.08+noise(i+x*17+y)*.8,yy=y+.07+noise(i*7+y*13+x)*.8;line(c,xx,yy,xx+.025+noise(i)*.1,yy-.012,'#b99e6833',.014);}for(const p of [[.12,.1],[.88,.9]])bolt(c,x+p[0],y+p[1],.022);}
  if((s.wave<8&&((y===0&&x>=7)||(y===8&&x>=8)))){plate(c,x+.04,y+.05,.9,.89,'#3c4638aa',null);for(let i=0;i<3;i++)line(c,x+.12+i*.28,y+.12,x+.06+i*.28,y+.82,'#a3946355',.09);}
 }
 // Rounded rail, tie-down rings, welded repair plates and readable walking arrows.
 for(const y of [-.14,9.14]){line(c,0,y,12,y,'#253a2b',.11);line(c,.1,y-.02,11.9,y-.02,'#b4a274',.028);for(let x=.2;x<12;x+=1.2)bolt(c,x,y,.042);}
 for(const x of [-.13,12.13])for(let y=.3;y<9;y+=1.2){line(c,x,y,x,y+.75,'#293b2f',.07);bolt(c,x,y,.033);}
 for(let i=3;i<s.path.length-2;i+=6){const a=s.path[i],b=s.path[i+1];c.save();c.translate(a[0]+.5,a[1]+.5);c.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));path(c,'M-.15 -.14 L.03 0 L-.15 .14 M.03 -.14 L.21 0 L.03 .14',null,'#e6c79377',.035);c.restore();}
 // Engine is an actual ribbed motor with pipes, fan cover and exhaust stack.
 c.save();c.translate(11.73,7.6);plate(c,-.16,-.52,.67,1.09,metal(c,-.2,-.5,.7,1,'#a2a486','#36513f'));for(let i=0;i<7;i++)line(c,-.1,-.36+i*.11,.38,-.36+i*.11,'#253d30',.042);tank(c,.4,-.38,.19,.82,'#8e9874');hose(c,'M-.15 -.45 Q-.48 -.85 -.39 -1.18','#617c62',.09);ellipse(c,.13,.1,.18,.18,'#283f34','#bcb792');for(let i=0;i<5;i++){c.save();c.translate(.13,.1);c.rotate(i*TAU/5);path(c,'M0 0 Q-.14 -.04 -.06 -.14 Q.02 -.14 .06 -.03Z','#6d8971',null);c.restore();}bolt(c,.13,.1,.045);c.restore();
 // Boarding gangway and warning stripes.
 plate(c,-.44,1.08,.46,.84,'#4b5a49');for(let i=0;i<4;i++)path(c,`M-.43 ${1.12+i*.2} L-.04 ${1.04+i*.2} L-.04 ${1.15+i*.2} L-.43 ${1.23+i*.2}Z`,i%2?'#ccaa62':'#2a392e',null);
}
export function drawTerrain(c,w,h){const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#333d32');g.addColorStop(.5,'#65583b');g.addColorStop(1,'#292f27');c.fillStyle=g;c.fillRect(0,0,w,h);for(let i=0;i<180;i++){const x=noise(i+35)*w,y=noise(i*3+29)*h,r=3+noise(i)*25;c.save();c.translate(x,y);c.rotate(noise(i+8)*6);path(c,`M${-r} 0 Q${-r*.9} ${-r*.6} 0 ${-r*.35} L${r*.65} ${-r*.1} Q${r} ${r*.4} ${r*.15} ${r*.46}Z`,i%4?'#baa07112':'#151f1b33',null);if(i%8===0){for(let k=0;k<4;k++)path(c,`M0 0 Q${k*3-8} -12 ${k*5-12} -24`,null,'#a09c5733',2);}c.restore();}const v=c.createRadialGradient(w*.45,h*.4,0,w*.5,h*.5,w*.7);v.addColorStop(.3,'#00000000');v.addColorStop(1,'#031612bb');c.fillStyle=v;c.fillRect(0,0,w,h);}
