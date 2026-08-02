/* vm1 — perfil público × privado nos rankings + trilha sem cadeados */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const S = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
const p = await c.newPage();
const erros = [];
p.on('pageerror', e => erros.push('JS: ' + e.message));
let ok = 0; const falhas = [];
const t = (nome, cond) => { if (cond) ok++; else falhas.push(nome); };
const txt = id => p.evaluate(i => { const e = document.getElementById(i); return e ? e.textContent : ''; }, id);
const toast = () => p.evaluate(() => document.getElementById('toast').textContent);

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(700);
await p.evaluate(() => document.getElementById('btnPlus').click()); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('[data-goto="v-perfil"]').click()); await p.waitForTimeout(500);
const el = await p.$('.phone');

/* ================= 1) TRILHA SEM CADEADOS ================= */
t('trilha: nenhum cadeado', !/🔒/.test(await txt('trilhaList')));
t('trilha: patente bloqueada leva o ponto discreto', await p.evaluate(() => {
  const lk = document.querySelector('#trilhaList .tr-item.lock .tr-dot');
  return !!lk && lk.textContent.trim() === '';
}));
t('trilha: a atual continua com ● e o progresso', await p.evaluate(() => {
  const at = document.querySelector('#trilhaList .tr-item.atual');
  return !!at && /●/.test(at.textContent) && /\/900 pts/.test(at.textContent);
}));
t('trilha: insígnia bloqueada segue acinzentada (CSS)', await p.evaluate(() => {
  const img = document.querySelector('#trilhaList .tr-item.lock .insig-img');
  return !!img && getComputedStyle(img).filter.indexOf('grayscale') >= 0;
}));

/* ================= 2) INTERRUPTOR NO BLOCO MINHAS TURMAS ================= */
t('interruptor mora dentro do bloco Minhas turmas', await p.evaluate(() => {
  const bx = document.getElementById('privBox');
  return !!bx && !!bx.closest('.p-card') && bx.closest('.p-card').textContent.indexOf('Minhas turmas') >= 0;
}));
t('nasce público, com o nome por inteiro', await p.evaluate(() =>
  document.getElementById('btnPriv').getAttribute('aria-checked') === 'false') && /por inteiro/.test(await txt('privDesc')));
const salaAntes = await txt('rankSalaList');
t('público: o aluno aparece sem máscara na sala', /AL SD QUAD MOURA · você/.test(salaAntes));
t('público: o PRÓPRIO nome nunca nasce mascarado', !/\*+A · você/.test(salaAntes));

/* liga o privado */
await p.click('#btnPriv'); await p.waitForTimeout(400);
t('ligar avisa no toast', /privado/i.test(await toast()));
t('a descrição mostra a máscara exata', /AL SD QUAD \*\*\*\*A/.test(await txt('privDesc')));
t('e explica a regra do top 10', /10 primeiros/.test(await txt('privDesc')));
await el.screenshot({ path: S + '/m1-priv-on.png' });

/* ================= 3) A REGRA DO HALL ================= */
/* na SALA o aluno está em 10º — dentro do hall: aparece por inteiro */
const sala = await txt('rankSalaList');
t('sala: em 10º (hall) o nome fica visível mesmo privado', /10ºAL SD QUAD MOURA · você/.test(sala.replace(/\s+/g, '')) || /AL SD QUAD MOURA · você/.test(sala));
/* no GERAL está em 87º — fora do hall: mascarado */
const geral = await txt('rankGeralList');
t('geral: em 87º o nome sai mascarado', /\*\*\*\*A · você/.test(geral));
t('geral: a máscara preserva a última letra', /\*+A/.test(geral));
/* vizinhos privados da demo também mascarados */
t('vizinhos privados aparecem mascarados', /QUAD \*+[a-z]/.test(sala) || /QUAD \*+[a-z]/.test(geral));
/* ranking completo do geral: top 10 sempre visível */
await p.evaluate(() => document.getElementById('rkGeralBtn').click()); await p.waitForTimeout(400);
const geralFull = await txt('rankGeralList');
const top10 = await p.evaluate(() => [...document.querySelectorAll('#rankGeralList .rk-row')].slice(0, 10).map(r => r.textContent));
t('hall dos 10 primeiros sem nenhuma máscara', top10.length === 10 && top10.every(x => !/\*/.test(x)));
t('fora do hall a máscara continua', /\*+[a-zA-Z]/.test(geralFull));
await el.screenshot({ path: S + '/m1-geral.png' });

/* ================= 4) VOLTAR A PÚBLICO ================= */
await p.click('#btnPriv'); await p.waitForTimeout(400);
t('desligar devolve o nome por inteiro', /AL SD QUAD MOURA · você/.test(await txt('rankGeralList')));
t('a descrição volta ao público', /por inteiro/.test(await txt('privDesc')));

console.log('vm1 :: ' + ok + ' ok / ' + falhas.length + ' falhas' + (falhas.length ? '\n  - ' + falhas.join('\n  - ') : ''));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
