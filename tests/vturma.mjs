const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const p = await (await b.newContext({ viewport:{width:430,height:900}, deviceScaleFactor:2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil:'load' });
await p.evaluate(() => document.getElementById('loginLayer').classList.add('off'));
await p.waitForTimeout(500);
const info = await p.evaluate(() => {
  const t = document.getElementById('cardTurma');
  const who = t.closest('.who');
  return { txt: t.textContent, tw: t.scrollWidth, whoW: who.clientWidth,
    overflow: t.scrollWidth > who.clientWidth,
    cardH: document.querySelector('.id-card, .p-card').offsetHeight };
});
console.log('turma:', info.txt, '| largura', info.tw, 'de', info.whoW, '| overflow:', info.overflow);
const el = await p.$('.phone');
await el.screenshot({ path: OUT + '/turma-card.png' });
console.log('erros:', errs.length ? errs.join('|') : 'nenhum');
await b.close();
process.exit(errs.length || info.overflow ? 1 : 0);
