// verify.mjs — web-market 검사: 폭별 홈·목록·상세 풀페이지 + 담기→드로어→주문서(빈 제출·채워서 제출)→완료
// 사용: node verify.mjs <사이트 URL(끝에 /)> <출력폴더> <상품id> [폭들…=320 390 430 1440]
// 필요: playwright (npm i -D playwright && npx playwright install chromium)
// 전제: 스타터와 같은 선택자 — .rv  .buy .btn  #payBtn  #nm #ph #ad [#em]  #ok  #cartCount
import { chromium } from 'playwright';
const [,, base, out = '.', pid, ...ws] = process.argv;
if (!base || !pid) { console.error('usage: node verify.mjs <url/> <outdir> <productId> [widths…]'); process.exit(1); }
const widths = (ws.length ? ws : ['320', '390', '430', '1440']).map(Number);
const b = await chromium.launch();
const log = [];
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 860 } });
  p.on('console', m => m.type() === 'error' && log.push(`${w} console ${m.text()}`));
  p.on('pageerror', e => log.push(`${w} pageerror ${e.message}`));
  p.on('response', r => r.status() >= 400 && log.push(`${w} ${r.status()} ${r.url()}`));
  for (const [name, hash] of [['home', ''], ['shop', '#/shop'], ['pdp', '#/p/' + pid]]) {
    await p.goto(base + hash, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);             // 대체 글꼴로 찍히면 검토 무효
    await p.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
    await p.waitForTimeout(700);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (sw > 0) log.push(`${w} ${name} 가로넘침 +${sw}px`);
    await p.screenshot({ path: `${out}/${w}-${name}.png`, fullPage: true });
  }
  await p.click('.buy .btn');
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/${w}-drawer.png` });
  await p.goto(base + '#/checkout', { waitUntil: 'networkidle' });
  await p.click('#payBtn');                                    // 빈 제출 → 오류 표시·포커스 이동해야 함
  await p.waitForTimeout(300);
  const stay = await p.evaluate(() => location.hash);
  if (!stay.startsWith('#/checkout')) log.push(`${w} 빈 주문서가 통과됨 (${stay})`);
  await p.fill('#nm', '김테스트'); await p.fill('#ph', '010-1234-5678'); await p.fill('#ad', '서울시 성동구 성수이로 1');
  if (await p.$('#em')) await p.fill('#em', 'a@b.co');
  await p.check('#ok');
  await p.screenshot({ path: `${out}/${w}-checkout.png`, fullPage: true });
  const hs = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (hs > 0) log.push(`${w} checkout 가로넘침 +${hs}px`);
  await p.click('#payBtn');
  await p.waitForTimeout(700);
  const [hash, cnt] = [await p.evaluate(() => location.hash), await p.textContent('#cartCount')];
  log.push(`${w} ${hash === '#/done' && cnt === '0' ? 'OK' : 'CHECK'} 결제후 hash=${hash} cart=${cnt}`);
  await p.screenshot({ path: `${out}/${w}-done.png` });
  await p.close();
}
console.log(log.join('\n'));
await b.close();
