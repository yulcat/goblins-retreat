export const W = 12, H = 9, TICK = 1 / 30, WAVE_COUNT = 18;
export const PATH = [];
for (let x = 0; x <= 10; x++) PATH.push([x, 1]);
for (let y = 2; y <= 4; y++) PATH.push([10, y]);
for (let x = 9; x >= 1; x--) PATH.push([x, 4]);
for (let y = 5; y <= 7; y++) PATH.push([1, y]);
for (let x = 2; x <= 11; x++) PATH.push([x, 7]);
export const PATH_KEYS = new Set(PATH.map(([x,y]) => `${x},${y}`));
export const TEAMS = {
  iron: {name:'철공반', color:'#e7b970', two:'교차 사격: 다른 철공 무기가 때린 적에게 피해 +25%', three:'파편: 노출된 적을 때리면 주변에 파편 피해'},
  boiler: {name:'보일러반', color:'#f38f67', two:'고압 화상: 화상 피해 +40%', three:'불벼락: 박격포도 점화 · 폭발 범위 +20%'},
  electric: {name:'전기반', color:'#7fdbd1', two:'연쇄 회로: 번개가 적 하나에게 더 연결', three:'마무리 방전: 속박이 풀릴 때 주변에 방전'},
};
export const ITEMS = {
  nail: {name:'못총', short:'점사', team:'iron', shape:[[0,0],[1,0],[2,0]], range:3.2, damage:12, period:1.8, unlock:0, desc:'선두 적에게 못 3발을 점사합니다. 재장전 틈을 보완하세요.', role:'안정적인 단일 사격', color:'#e9bd74'},
  saw: {name:'원형톱', short:'근접', team:'iron', shape:[[0,0],[1,0],[0,1],[1,1]], range:1.8, damage:6, period:.18, unlock:0, desc:'주변 적을 계속 베어냅니다. 굽이 안쪽, 윈치 옆이 명당입니다.', role:'길목의 지속 피해', color:'#dfb682'},
  harpoon: {name:'작살포', short:'관통', team:'iron', shape:[[0,0],[1,0],[2,0],[0,1]], range:7, damage:52, period:2.4, directional:true, unlock:1, desc:'화살표 방향으로 적 5명을 관통하고 장갑을 무시합니다. 긴 직선을 겨누세요.', role:'긴 직선 관통', color:'#f1cf9a'},
  mortar: {name:'깡통 박격포', short:'포격', team:'boiler', shape:[[0,0],[1,0],[2,0],[1,1]], range:5.5, minRange:1.5, damage:38, period:3.1, unlock:1, desc:'밀집 지점에 0.9초 뒤 포탄이 떨어집니다. 빠른 적은 놓칩니다.', role:'지연 광역 폭발', color:'#ed9472'},
  flame: {name:'화염 분사기', short:'화염', team:'boiler', shape:[[0,0],[0,1],[1,1]], range:3.2, damage:6, period:.2, directional:true, unlock:2, desc:'앞쪽 부채꼴에 화염을 뿜습니다. 2초 분사 후 2초 냉각합니다.', role:'부채꼴 · 화상 · 점화', color:'#ff9a5a'},
  coil: {name:'전격 코일', short:'연쇄', team:'electric', shape:[[1,0],[2,0],[0,1],[1,1]], range:3.4, damage:28, period:1.7, unlock:2, desc:'적 4명 사이로 번개가 이어집니다. 가까이 모인 무리에게 강합니다.', role:'군집 연쇄 사격', color:'#82d5ce'},
  winch: {name:'갈고리 윈치', short:'속박', team:'electric', shape:[[0,0],[0,1],[1,1]], range:3.3, damage:10, period:3.8, unlock:0, desc:'적 하나를 1.7초 붙잡습니다. 톱·포격의 사정거리에 묶어두세요.', role:'위치 제어 · 연계', color:'#99c9ba'},
  oil: {name:'기름 분무기', short:'감속', team:'boiler', shape:[[0,0],[1,0]], range:3.1, damage:0, period:3.8, unlock:3, desc:'기름 웅덩이로 적을 늦춥니다. 불이 닿으면 감속 대신 연소합니다.', role:'감속 지대 · 점화', color:'#b9aa73'},
  feeder: {name:'급탄기', short:'급탄', team:'iron', shape:[[0,0],[0,1]], support:true, unlock:0, desc:'변이 닿은 못총·작살포의 재장전이 28% 빨라집니다.', role:'인접 재장전 지원', color:'#d6ad68'},
  cooler: {name:'냉각기', short:'냉각', team:'boiler', shape:[[0,0],[1,0]], support:true, unlock:3, desc:'변이 닿은 화염·박격포의 냉각과 재장전이 28% 빨라집니다.', role:'인접 냉각 지원', color:'#b7c9bd'},
  battery: {name:'축전기', short:'충전', team:'electric', shape:[[0,0],[0,1]], support:true, unlock:3, desc:'변이 닿은 코일·윈치의 피해 +35%, 코일의 연쇄 거리 증가.', role:'인접 전기 증폭', color:'#8fcebb'},
  scope: {name:'조준경', short:'조준', team:'iron', shape:[[0,0],[1,0]], support:true, unlock:4, desc:'같은 행·열에서 가장 가까운 공격 기물의 사거리 +1칸. 톱 제외.', role:'직선 사거리 지원', color:'#b2c5b9'},
};
export const ENEMIES = {
  raider:{name:'강습 척후병',hp:130,speed:1.65,armor:2,leak:6,color:'#c59773'},
  grunt:{name:'추격 보병',hp:32,speed:.72,armor:0,leak:4,color:'#d8cbbb'},
  swarm:{name:'인형병 무리',hp:17,speed:.85,armor:0,leak:2,color:'#bdac9f'},
  runner:{name:'질주 정찰병',hp:27,speed:1.28,armor:0,leak:5,color:'#eaa77e'},
  armor:{name:'중장갑 기사',hp:98,speed:.48,armor:4,leak:9,color:'#8faab5'},
  ranger:{name:'간격 유지 사수',hp:48,speed:.76,armor:1,leak:6,color:'#b6a8c9'},
  captain:{name:'선봉 지휘관',hp:150,speed:.52,armor:2,leak:12,color:'#ce8f89'},
  boss:{name:'왕국 추격 지휘차',hp:800,speed:.24,armor:5,leak:100,color:'#d9916e'},
};
export const WAVE_NAMES = ['뒷문을 닫아!','길 위의 고철','긴 줄을 끊어라','쏟아지는 인형병','철갑의 발걸음','첫 번째 검문소','두 번째 손님','먼지 속의 질주','버리고 갈 수 없는 것','포위망의 틈','쫓는 자의 깃발','협곡의 입구','남은 거리 6km','뒤섞인 행렬','마지막 연료통','국경의 불빛','전원 탑승','국경을 넘어'];
export const CHAPTERS = ['재의 고속도로','붉은 협곡','아무도 버리지 않는 국경'];
export const CHARACTERS = {
  rivet:{name:'리벳',job:'정비장',color:'#e9b969',tag:'설계는 의심해도, 동료는 의심하지 않는다.'},
  boil:{name:'보일',job:'기관사',color:'#92c6b0',tag:'겁이 많다. 그래도 사람은 두고 가지 않는다.'},
  git:{name:'깃',job:'자칭 대장',color:'#eaa38c',tag:'큰소리는 습관, 책임지는 건 선택.'},
};
export const SCENES = {
 intro:{title:'마을이 떠나는 날',lines:[
 ['boil','다 탔어. 스물일곱 명. 마지막 애는 울다가 잠들었어.','뒤를 돌아본 뒤, 운전대를 두 손으로 꽉 잡는다.'],
 ['git','좋아. 그럼…… 출발하자. 검문소만 넘으면 놈들도 따라오지 못할 거야.','불타는 마을 쪽에서 눈을 떼지 못한다.'],
 ['rivet','검문소까지 이 차가 버텨야지. 판자 밑에서 바람이 올라와. 원래 창고 바닥이었으니까.'],
 ['boil','웃으려고 한 말이지? 나 지금 웃어도 되는 거지?'],
 ['rivet','응. 바퀴는 안 빠져. 내가 세 번 확인했어.','잠깐 보일의 어깨를 짚는다.'],
 ['git','뒤에서 갈고리! 정비사, 갑판을 부탁한다. 우리가 가진 무기는 그 못총하고 톱뿐이야.'],
 ['rivet','나는 엔진을 붙들고 있을게. 새 고철이 들어오면 네가 자리를 골라 줘. 혼자서는 다 못 하겠어.'],
 ['boil','출발한다. 뒤에 탄 사람들한테…… 고개 숙이라고 전해 줘.']
 ]},
 firstCombo:{title:'설계도 바깥에서',lines:[
 ['rivet','잠깐, 그 장치를 거기에 붙였어? 내 도면에는 반대쪽인데.','손을 뻗었다가, 움직이는 기계를 보고 멈춘다.'],
 ['boil','아까 덜컹거리던 소리가 없어졌어. 네가 고친 거야?'],
 ['rivet','아니. 정비사가 맞춘 거야. ……이쪽이 더 짧게 연결되네.'],
 ['git','그렇다면 내 뛰어난 인재 배치 덕분이라고 할 수 있겠군.'],
 ['rivet','고철 상자나 잡아, 인재 배치 담당.','입꼬리가 조금 올라간다.'],
 ['rivet','정비사, 계속 그렇게 해 줘. 내 도면에 없다고 틀린 건 아니니까.']
 ]},
 firstRush:{title:'첫 고비',lines:[
 ['boil','아까 엔진 쪽으로 뛰어오는 놈 봤어? 도망치고 싶었어. 운전대를 잡고 있는데도 자꾸 뒤만 보게 되더라.','아직 손가락이 떨리고 있다.'],
 ['git','나도 봤어. ……네가 계속 밟아 줘서 난간에서 떼어낼 수 있었어.'],
 ['boil','다음에도 그렇게 몰려오면?'],
 ['rivet','정비할 시간은 있어. 입구에만 몰아놓지 말고 마지막 굽이도 보자. 어느 쪽이 비는지는 봤잖아.'],
 ['boil','그래. 아직 달리고 있으니까.','운전대를 다시 고쳐 쥔다.'],
 ['git','정비사, 준비되면 말해 줘. 이번엔 나도 뒤를 보고 있을게.']
 ]},
 chapter1:{title:'군모에서 빠진 것',lines:[
 ['git','검문소를 넘었다! 봤나, 내가 처음부터……'],
 ['boil','깃. 왼쪽 난간에 앉은 사람들 좀 안쪽으로 옮겨 줘. 리벳이 바닥을 보고 있어.'],
 ['rivet','고정쇠가 벌어졌어. 여기 물릴 금속이 필요한데, 남은 건 너무 얇아.'],
 ['git','이건?','군모 앞의 금빛 장식을 힘주어 떼어낸다.'],
 ['rivet','그거 네가 대장이라고 우길 때마다 보여주던 거잖아.'],
 ['git','내가 여기 있다는 걸 다들 알잖아. 굳이 모자까지 말할 필요는 없지.'],
 ['rivet','……고맙다. 이 정도 두께면 버텨.'],
 ['git','망치질은 살살 해. 아직 좀 아까우니까.','구겨진 군모를 다시 눌러 쓴다.']
 ]},
 rescue:{title:'먼지 속의 수레',lines:[
 ['boil','오른쪽에 수레가 있어. 바퀴가 빠졌어…… 다섯 명이야. 우리 쪽을 보고 있어.'],
 ['rivet','돌아가면 오르막을 두 번 타. 연료 계산이 달라져.'],
 ['boil','알아. 그래서 아직 안 돌렸어.','속도를 조금 줄인 채 대답을 기다린다.'],
 ['git','리벳, 데려오면 국경 전에 멈춰?'],
 ['rivet','확실히 말 못 해. 짐을 줄이고 새 부품을 맞추면 가능할 수도 있어.'],
 ['git','그럼 내 상자를 버려. 깃발이랑 예복 든 거. 보일, 돌아가자.'],
 ['boil','응. 꽉 잡아.','대답이 끝나기도 전에 핸들을 꺾는다.'],
 ['rivet','정비사, 옆 갑판을 열게. 수레에서 떼어낸 부품을 거기에 실어 줘. 이번엔 버틸 방법을 같이 찾아보자.']
 ]},
 chapter2:{title:'남은 한 통',lines:[
 ['boil','연료가 한 통 남았어. 사람은 서른둘. 아까 태운 할머니가 다 같이 먹을 수프를 끓인대.'],
 ['git','달리는 차에서? 쏟아질 텐데.'],
 ['boil','그래서 도착하면 끓인대.','처음으로 짧게 웃는다.'],
 ['rivet','새 배관으로 새는 연료는 잡았어. 정비사가 얹은 무기들도 잘 버티고 있고.'],
 ['git','그럼 갈 수 있는 거지? 이번에는 허풍 말고 대답해 줘.'],
 ['rivet','응. 남은 오르막까지 계산했어. 이번엔 우리 셋 말고도, 도와주는 손이 많잖아.'],
 ['boil','좋아. 그 수프, 식기 전에 먹으러 가자.']
 ]},
 last:{title:'다 같이 넘는 선',lines:[
 ['git','저게 국경 불빛이야? 생각보다…… 작네.','큰 목소리를 내려고 목을 가다듬는다.'],
 ['rivet','뒤쪽 지휘차가 다시 붙었어. 긴 이야기 할 시간 없어.'],
 ['git','알아. 그냥 다들 여기까지 잘 버텼다고 말하려고 했어.'],
 ['boil','도착해서 직접 말해 줘. 우선 사람부터 세자.'],
 ['git','하나, 둘…… 서른둘. 전원 탑승.'],
 ['boil','손 떨리는 건 아직 똑같네. 그래도 이제 어디로 가는지는 보여.'],
 ['rivet','정비사, 마지막으로 갑판을 확인해 줘. 네가 맞춘 이 기계로, 끝까지 가 보자.']
 ]},
 ending:{title:'불을 끈 다음',lines:[
 ['boil','엔진 껐어. ……이렇게 조용한 소리였구나.','한동안 운전대에서 손을 놓지 못한다.'],
 ['rivet','됐어. 이제 놔도 돼. 다들 내렸고, 다들 여기 있어.'],
 ['git','할머니가 수프 준대. 그릇이 모자라서 내 군모를 보시더라.'],
 ['boil','그건 안 돼. 오늘 하루 네 머리에 있던 걸로 밥을 먹을 순 없지.','이번에는 웃다가 눈가를 닦는다.'],
 ['rivet','무기부터 내려야겠다. 갑판에 창문을 내면 바람도 덜 탈 거야.'],
 ['git','이 고철을 계속 쓰게?'],
 ['rivet','처음엔 버틸 만큼만 만들려고 했는데…… 우리가 붙인 게 너무 많아졌어. 버리기 아깝네.'],
 ['boil','집을 왜 버려. 내일 천천히 고치자. 오늘은 밥부터 먹고.'],
 ['git','그래. 정비사 것도 남겨 뒀어. 이제 그 손 좀 씻고 와.','이번에는 누구보다 먼저 짐을 나른다.']
 ]}
};
export const BARKS = {
  combo:[['rivet','연결 확인. 이번 건 네 설계가 더 낫다.'],['git','저 소리! 승리의 소리다!']],
  leak:[['boil','엔진 쪽에 붙었어! 소리는 크지만 아직 달릴 수 있어. 다음 정비 때 뒤쪽도 부탁해.'],['rivet','깃, 그 판자 눌러! 정비사, 다음에는 출구 쪽 사거리를 조금 더 겹쳐 보자.']],
  saw:[['git','톱니 여단, 출격!'],['boil','여단한테 내 의자도 먹였냐?']],
  fire:[['boil','차도 뜨겁고 차도 뜨겁네. 내 찻잔은 어디 갔지?']],
  retry:[['rivet','실패한 자리는 기억해. 다시 맞추면 돼.'],['boil','다들 무사해. 이번엔 내가 조금 더 버틸게.'],['git','두 번째 작전이다. 첫 번째는 예행연습이었고.']],
};
export function chapter(wave){return Math.min(2,Math.floor(wave/6));}
export function wavePreview(wave){
  const pools=[['grunt','runner','armor'],['grunt','swarm'],['grunt','runner'],['swarm','grunt'],['armor','grunt'],['captain','swarm'],['runner','grunt'],['runner','armor'],['swarm','runner'],['ranger','armor'],['captain','swarm'],['boss','armor'],['runner','ranger'],['swarm','armor'],['captain','runner'],['armor','ranger'],['swarm','runner','captain'],['boss','swarm','runner']];
  const pool=pools[Math.min(wave,17)];return wave<6?[...pool,'raider']:pool;
}
