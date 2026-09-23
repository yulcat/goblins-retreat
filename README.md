# 고블린은 퇴각 중 · The Last Rig

고철 무기를 조립해 마을 사람들을 국경으로 데려가는 브라우저 디펜스입니다. 12×9 갑판에서 형태·방향·인접 관계를 맞추고, 18번의 추격전을 통과합니다.

## 실행

Node.js 22 이상이 필요합니다. 외부 패키지 설치 없이 실행합니다.

```sh
npm run dev
# http://127.0.0.1:4173
npm test
npm run build
```

`dist/` 전체를 정적 호스팅에 올립니다. 모든 경로는 상대 경로라 GitHub Pages의 저장소 하위 경로에서도 동작합니다. `.github/workflows/pages.yml`은 main 푸시 시 테스트 → 빌드 → Pages 배포를 수행합니다. 저장소 Settings → Pages의 Source는 GitHub Actions로 설정합니다.

## 조작

- 기물 선택 → 빈 칸 선택 → 설치 확인. 회전·보관·폐기·되돌리기는 화면 버튼으로 조작합니다.
- 보상으로 가져온 기물은 정비 중 ‘다시 고르기’로 선택 이전 상태로 되돌릴 수 있습니다.
- 정비·대화 중에는 시간이 멈춥니다. 전투 중에는 배치를 바꿀 수 없습니다.
- 일시정지와 배속을 지원하며, 브라우저를 벗어나면 자동 일시정지합니다.
- 자동 저장과 구간별 재시도를 지원합니다. 저장 데이터는 현재 브라우저에만 있습니다.
- PC 가로와 모바일 세로 화면에 대응합니다. 모바일은 갑판을 회전해 표시하며 모든 기능을 터치로 조작합니다.

## 구조

- `src/content.js`: 기물, 적, 경로, 대사, 웨이브 데이터
- `src/sim.js`: DOM과 분리된 고정 시간 간격 전투·보상·배치·저장 로직
- `src/render.js`: Canvas 절차적 그래픽과 캐릭터 초상화
- `src/app.js`: 화면, 마우스·터치 입력, 저장, 대화, 합성 효과음
- `tools/bot.mjs`: 공개된 보드 정보로 선택·배치하는 자동 플레이 정책
- `tools/balance.mjs`: 시드별 완주·피해·구간 결과 기록
- `tests/`: 결정론, 배치 제약, 조합의 실제 전투 효과 검증

기획안의 TypeScript/Vite 대신 네이티브 JavaScript 모듈을 사용했습니다. 현재 규모에서는 외부 런타임·설치 과정 없이 브라우저와 Node가 동일한 시뮬레이션을 직접 실행하는 쪽이 배포와 검증을 단순하게 합니다. 이미지는 모두 JavaScript로 그립니다. 이미지 생성 도구·외부 이미지·외부 폰트·추적 스크립트를 사용하지 않습니다.

## 검증

```sh
npm run balance -- 20
```

브라우저 테스트는 Playwright와 Chromium이 설치된 개발 환경에서 별도로 실행합니다. `PLAYWRIGHT_PATH`, `CHROME_PATH`로 설치 위치를 지정할 수 있습니다.

```sh
node tools/browser-smoke.mjs
node tools/browser-play.mjs --full
node tools/browser-play.mjs --mobile --full
```

브라우저 완주 테스트는 실제 화면 버튼과 포인터 입력을 사용하며 `__rig.snapshot()`으로 읽기 전용 상태를 확인합니다. 시계를 가속하고 게임의 배속 버튼을 사용하므로 실제 사람의 체류시간 측정은 아닙니다. 봇 승률도 사람의 승률로 해석하지 않습니다. 정량 결과와 한계는 `reports/`에 기록합니다.

기획과 근거 자료: [GAME_DESIGN.md](GAME_DESIGN.md)
