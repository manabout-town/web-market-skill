# 사진 · 레포 · 배포

## 1. 사진 (무료 경로)

API 키가 없으면 로그인된 브라우저에서 이미지 생성 웹앱을 자동화한다(Claude in Chrome).

| 도구 | 특징 |
|---|---|
| Gemini 웹 (gemini.google.com, 이미지 생성) | 1024px 안팎, 우하단 ✦ 워터마크, 무료 한도 하루 약 30장(계정 단위) |
| Google Flow (flow.google.com) | 프로젝트 → 에이전트 창에 `Generate this image exactly: …`, 약 20초/장, 비율은 16:9·4:3·1:1·3:4·9:16, 워터마크 위치는 Gemini와 같음. Gemini 한도와 별개 |
| Grok Imagine (grok.com/imagine) | 2장씩 약 10초, 워터마크 없음, 무료는 몇 번 뒤 구독 창 — **결제 금지** |

요령:
- **공통 스타일 문구** 하나를 모든 프롬프트 끝에 붙인다(조명·배경·렌즈·"no text, no logo"). 톤이 맞아야 몰처럼 보인다.
- 프롬프트는 `img/PROMPTS.md`에 파일명과 함께 적어 둔다(재생성용, 배포 제외).
- **이름 지정 저장**: 페이지 JS에서 결과 `<img>`를 canvas에 그리거나 fetch→blob 후 `a.download='<폴더>~<파일명>.png'`. 좌표 클릭·클립보드는 다른 작업과 섞인다.
- `~/Downloads`는 다른 세션과 공유될 수 있다 → 파일명 접두어로 구분하고, 가로/세로 방향과 썸네일을 확인한 뒤 옮긴다.
- 같은 구도 변형(전/후, 색상 옵션)은 같은 채팅에서 `Edit the last image: the exact same … but …`로 이어서 만든다. 무관한 사진은 새 채팅.
- 워터마크: 우하단을 크롭하는 게 가장 깨끗하다(가로 기준 156px 정도). 크롭이 곤란하면 `ffmpeg -vf "delogo=x=W-134:y=H-134:w=64:h=64"`(W,H는 숫자로 직접).
- 원본은 `img/raw/`(gitignore·vercelignore), 웹용은 긴 변 1200~1600 JPG q80 (`sips -Z 1400 -s format jpeg -s formatOptions 80`).
- 가상 인물·가상 상품 사진이면 푸터에 "사진 AI 생성" 표기.

## 2. 레포

```bash
cd <폴더> && git init -q && git add -A && git commit -qm "feat: <브랜드> 웹마켓"
gh repo create <계정>/<폴더> --private --source . --push
```
만든 날 바로 push한다(로컬만 두다 통째로 잃은 적이 있다). Vercel Hobby에서 private 레포를 배포하면 커밋 작성자 이메일이 Vercel 계정과 연결된 주소여야 한다 — 아니면 BLOCKED.

## 3. 배포 (Vercel 정적)

```bash
cd <폴더> && vercel --prod --yes
curl -s https://<이름>.vercel.app | grep -o '<title>[^<]*'      # 내 페이지인지
curl -so /dev/null -w '%{http_code}\n' https://<이름>.vercel.app/img/PROMPTS.md   # 404여야 함
```
- `<폴더>.vercel.app`은 남이 선점했을 수 있다(title이 다르면 선점). → `vercel project add <새이름>` → `vercel link --project <새이름> --yes` → 배포, 또는 `vercel domains add <새이름>.vercel.app <project>`. `vercel alias set`은 보호 설정(302)에 걸린다.
- `vercel link`가 만든 `.env.local`은 지우고 `.vercelignore`에 `.env*`.
- Hobby는 하루 배포 100회 한도 — 여러 사이트를 고칠 땐 모아서 한 번에 배포한다.
