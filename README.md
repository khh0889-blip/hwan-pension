# 연금 허브 (PWA)

연금저축 · IRP · DC형 통합 계산기 — 단일 HTML 앱. 입력값은 브라우저 저장소(`hwanPension.v1`)에만 남습니다.

## 구성
- `index.html` — 앱 전체(HTML/CSS/JS 인라인, 외부 요청은 시세 파일 하나)
- `prices.json` — 상장 ETF 종가 시세 (평일 장 마감 뒤 자동 갱신)
- `manifest.json` — 홈 화면 설치용
- `sw.js` — 오프라인 캐시 (hwan-pension-v2) · `prices.json`은 항상 네트워크 우선
- `icon*.png`, `icon.svg`, `apple-touch-icon.png` — 아이콘 세트

## 시세 자동 반영
- 앱 상단에 `시세 기준: YYYY-MM-DD (장마감)` 배지와 **시세 새로고침** 버튼이 있습니다.
- 온라인일 때 `prices.json`을 읽어 상장 ETF 16종의 현재가와 평가금액만 최신 종가로 맞춥니다.
  연금저축·IRP ETF는 `수량 × 종가`, 수량이 없는 DC형 상장 ETF는 `기준일(2026-11-16) 종가 대비 등락률`만큼 평가액을 비례 갱신합니다.
- 수량·매수 기록·DC 회사납입 비율·시뮬레이션 설정은 건드리지 않습니다.
- 오프라인이면 마지막으로 저장된 시세로 조용히 계산합니다.
- 시세 파일은 `scripts/update_pension_prices.py`가 네이버 금융 공개 시세로 만듭니다.
  `python3 scripts/update_pension_prices.py --git-push` (평일 16:10 스케줄 액션용)

## 배포
1. GitHub `hwan-pension` 저장소 (public)
2. 이 폴더 내용을 push
3. Settings → Pages → Source: `Deploy from a branch` → Branch `main` / `(root)`
4. 주소: `https://<계정>.github.io/hwan-pension/`
5. 폰 Chrome에서 열고 ⋮ → 홈 화면에 추가

## 업데이트
`index.html`을 새 버전으로 바꾸면 `sw.js`의 `CACHE` 이름(`hwan-pension-v2` → `v3`)도 함께 올려 주세요.
원본은 `docs/hwan-pension-app.html`이고, `python3 scripts/build_pension_deploy.py`가 PWA 링크·서비스워커 등록만 더해 이 폴더의 `index.html`을 만듭니다.
