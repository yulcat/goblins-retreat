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
  intro:{title:'마을이 떠나는 날',lines:[['git','전략적 후퇴다. 승리는 다음 주소로 배달한다.'],['rivet','주소보다 바퀴부터 잡아. 정비사, 못총은 네가 맡아.'],['boil','뒤에 스물일곱 명 탔어. 급하게 가도, 전부 데려가자.']]},
  firstCombo:{title:'붙였더니, 돌아간다',lines:[['rivet','그렇게 붙이면…… 돌아가네. 내 설계도는 접어둬.'],['git','지금부터 저건 대장 특별 승인 발명품이다.']]},
  chapter1:{title:'검문소 너머',lines:[['git','봤나? 완벽한 작전이었다.'],['rivet','볼트 두 개 빠졌어. 네 군모 장식 좀 줘.'],['git','……나중에 돌려줘. 그거 마지막 남은 금색이다.']]},
  rescue:{title:'먼지 속의 수레',lines:[['boil','뒤처진 수레가 있어. 돌아가면 연료가 모자라.'],['git','그럼 다 같이 밀지. 돌아가.'],['rivet','정비사, 옆 갑판을 열었어. 수레 부품으로 보강하자.']]},
  chapter2:{title:'불빛이 보인다',lines:[['boil','연료는 한 통. 사람은 서른둘.'],['rivet','새 설계로는 충분해. 이번엔 나도 확신해.'],['git','오늘의 작전명은…… 도착이다.']]},
  last:{title:'마지막 정비',lines:[['git','대장 깃의 최후 연설을……'],['boil','인원 확인부터.'],['git','……전원 탑승. 정비사, 집까지 부탁한다.']]},
  ending:{title:'다음 주소',lines:[['rivet','이 고철, 이제 버려도 되겠네.'],['boil','집을 왜 버려.'],['git','대장실은…… 됐고. 밥부터 먹자.']]},
};
export const BARKS = {
  combo:[['rivet','연결 확인. 이번 건 네 설계가 더 낫다.'],['git','저 소리! 승리의 소리다!']],
  leak:[['boil','엔진 쪽으로 샜어. 다음 정비 때 출구도 봐줘.'],['rivet','아직 달려. 무너진 건 아니야.']],
  saw:[['git','톱니 여단, 출격!'],['boil','여단한테 내 의자도 먹였냐?']],
  fire:[['boil','차도 뜨겁고 차도 뜨겁네. 내 찻잔은 어디 갔지?']],
  retry:[['rivet','실패한 자리는 기억해. 다시 맞추면 돼.'],['boil','다들 무사해. 이번엔 내가 조금 더 버틸게.'],['git','두 번째 작전이다. 첫 번째는 예행연습이었고.']],
};
export function chapter(wave){return Math.min(2,Math.floor(wave/6));}
export function wavePreview(wave){
  const pools=[['grunt'],['grunt','swarm'],['grunt','runner'],['swarm','grunt'],['armor','grunt'],['captain','swarm'],['runner','grunt'],['runner','armor'],['swarm','runner'],['ranger','armor'],['captain','swarm'],['boss','armor'],['runner','ranger'],['swarm','armor'],['captain','runner'],['armor','ranger'],['swarm','runner','captain'],['boss','swarm','runner']];
  return pools[Math.min(wave,17)];
}
