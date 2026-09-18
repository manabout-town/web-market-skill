# web-market — 단일 파일 브랜드 쇼핑몰 (Claude Code 스킬)

브랜드 하나의 소형 쇼핑몰을 **HTML 파일 하나**로 만든다.
홈 · 목록 · 상세 · 장바구니 드로어 · 주문서 · 주문완료 — 해시 라우팅, localStorage 장바구니, 옵션별 가격, 무료배송 진행바, 품절/재입고, 입력 검증, 데모 결제.

- 레퍼런스 3종에서 뽑은 구조: 수제 도자기(에디토리얼) · 커스텀 키보드(다크) · 비건 스킨케어(미니멀)
- 품목별 "심장 기능" 설계표: 한정 수량, 소리 듣기, 루틴 찾기, 세트 할인, 정기배송 …
- 바로 도는 스타터(가상 도자기몰 + 사진 8장)와 playwright 검증 스크립트 포함

## 설치 (한 줄)
```bash
curl -fsSL https://raw.githubusercontent.com/manabout-town/web-market-skill/main/install.sh | bash
```
`~/.claude/skills/web-market` 에 설치된다. Claude Code를 새로 열고 "향수 브랜드 웹마켓 만들어줘"처럼 말하면 된다.
설치 위치를 바꾸려면 `CLAUDE_SKILLS_DIR=... curl ... | bash`.

<details><summary>레포를 통째로 받고 싶다면</summary>

```bash
git clone https://github.com/manabout-town/web-market-skill.git
cd web-market-skill && ./install.sh
```
</details>

## 구성
```
skill/web-market/
├── SKILL.md                  결정 4가지 → 구조 → 필수 요소 → 디자인 기준 → 사진 → 검증 → 배포
├── assets/starter/           index.html + img/ (복사해서 시작)
├── references/
│   ├── archetypes.md         품목별 스타일 · 심장 기능 · 첫 화면
│   ├── production.md         사진 생성 · 레포 · Vercel 배포
│   └── pitfalls.md           실제로 밟은 함정 12개
└── scripts/verify.mjs        폭별 화면 + 담기→주문→완료 흐름 검사 (playwright)
```
함께 쓰면 좋은 스킬: 첫 화면 조작형 `signature-hero`, 분위기형 `breathing-light`.

사진은 AI 생성 예시이고 브랜드·주소·사업자번호는 전부 가상이다. MIT.
