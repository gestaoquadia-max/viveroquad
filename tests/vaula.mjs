const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });

async function shot(fakeNow, name){
  const c = await b.newContext({ viewport:{width:430,height:900}, deviceScaleFactor:2 });
  const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  if (fakeNow) await p.addInitScript(`{
    const RealDate = Date;
    const fixed = new RealDate('${fakeNow}');
    window.Date = class extends RealDate {
      constructor(...a){ a.length ? super(...a) : super(fixed.getTime()); }
      static now(){ return fixed.getTime(); }
    };
  }`);
  await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil:'load' });
  await p.evaluate(() => document.getElementById('loginLayer').classList.add('off'));
  await p.waitForTimeout(500);
  const info = await p.evaluate(() => ({
    turma: document.getElementById('aulaTurma').textContent,
    dia: document.getElementById('aulaDia').textContent,
    slots: [...document.querySelectorAll('.aula-slot')].map(x => x.className + ' | ' + x.textContent.replace(/\s+/g,' ').trim()),
    fonte: document.getElementById('aulaFonte').textContent
  }));
  console.log('---', name, '---');
  console.log(info.turma, '\n' + info.dia);
  info.slots.forEach(x => console.log(' ', x));
  console.log(' ', info.fonte, '| erros:', errs.length ? errs.join('|') : 'nenhum');
  const el = await p.$('.phone');
  await el.screenshot({ path: `${OUT}/${name}.png` });
  await c.close();
}
// domingo real (19/07) → mostra próxima (segunda)
await shot(null, 'aula-dom');
// quarta 22/07 às 19h40 → 1º tempo AGORA
await shot('2026-07-22T19:40:00', 'aula-qua-agora');
// sexta 24/07 às 21h00 → 1º encerrado, 2º AGORA
await shot('2026-07-24T21:00:00', 'aula-sex-2t');
await b.close();
