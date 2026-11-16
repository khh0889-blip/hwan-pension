# 연금 허브 (PWA)

연금저축 · IRP · DC형 통합 계산기 — 단일 HTML 오프라인 앱.

## 구성
- `index.html` — 앱 전체(HTML/CSS/JS 인라인, 외부 요청 0건). 저장 키 `hwanPension.v1`
- `manifest.json` — 홈 화면 설치용
- `sw.js` — 오프라인 캐시 (hwan-pension-v1)
- `icon*.png`, `icon.svg`, `apple-touch-icon.png` — 아이콘 세트

## 배포
1. GitHub에 `hwan-pension` 저장소 생성 (public)
2. 이 폴더 내용을 push
3. Settings → Pages → Source: `Deploy from a branch` → Branch `main` / `(root)`
4. 주소: `https://<계정>.github.io/hwan-pension/`
5. 폰 Chrome에서 열고 ⋮ → 홈 화면에 추가

## 업데이트
`index.html`을 새 버전으로 바꾸면 `sw.js`의 `CACHE` 이름(`hwan-pension-v1` → `v2`)도 함께 올려 주세요.
