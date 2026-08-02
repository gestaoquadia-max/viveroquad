/* vj1 — "+" sem Quad Store/Gift Card; validação do gift card dentro da Quad Store */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const S = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */
const erros = [];
p.on('pageerror', e => erros.push('JS: ' + e.message));
let ok = 0; const falhas = [];
const t = (nome, cond) => { if (cond) ok++; else falhas.push(nome); };

const num = id => p.evaluate(i => parseInt(document.getElementById(i).textContent.replace(/\D/g, ''), 10), id);
const dmn = () => num('dmnVal');
const qdc = () => num('scoreVal');
const toast = () => p.evaluate(() => document.getElementById('toast').textContent);
/* códigos do lote aberto, lidos da tela de QR do Painel de controle */
const abrirLote = async i => {
  await p.evaluate(n => document.querySelectorAll('#admGiftLotes [data-lote]')[n].click(), i);
  await p.waitForTimeout(200);
  return p.evaluate(() => [...document.querySelectorAll('#admGiftQRs .qr-cell')].map(x => ({ c: x.querySelector('small').textContent, usado: x.classList.contains('usado') })));
};

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(600);

/* ---------- 1. o menu "+" ---------- */
await p.click('#btnPlus'); await p.waitForTimeout(400);
const plus = await p.evaluate(() => [...document.querySelectorAll('#plusPop .plus-row')].map(r => r.querySelector('.t').textContent.trim()));
t('"+" sem Quad Store', !plus.some(x => /Quad Store/i.test(x)));
t('"+" sem Validar Gift Card', !plus.some(x => /Gift Card/i.test(x)));
t('"+" mantém Quadrômetro', plus.includes('Quadrômetro'));
t('"+" mantém Calendário', plus.includes('Calendário'));
t('"+" mantém Materiais das aulas', plus.includes('Materiais das aulas'));
t('"+" mantém o Chat', plus.some(x => /Chat · recados/.test(x)));
t('"+" mantém os 3 travados', plus.filter(x => /Chat ao vivo|Guarnições|Pré-TAF/.test(x)).length === 3);
t('"+" ficou com 7 linhas', plus.length === 7);
await p.evaluate(() => { [...document.querySelectorAll('#plusPop .plus-row')].find(x => /Pré-TAF/.test(x.textContent)).click(); });
await p.waitForTimeout(300);
t('travado ainda responde com aviso', /Pré-TAF/.test(await toast()));
await p.$('.phone').then(el => el.screenshot({ path: S + '/j1-plus.png' }));
await p.evaluate(() => document.getElementById('plusPop').classList.remove('on'));

/* ---------- 2. a Quad Store continua acessível pela barra ---------- */
await p.click('#navAluno .nav-btn[data-view="v-loja"]'); await p.waitForTimeout(500);
t('Loja abre pela barra de navegação', await p.evaluate(() => document.getElementById('v-loja').classList.contains('on')));

/* ---------- 3. o botão Validar mora ao lado do Resgatar ---------- */
const gift = await p.evaluate(() => {
  const bl = document.querySelector('.lh-gift'); if (!bl) return null;
  const bs = [...bl.querySelectorAll('button')].map(x => x.textContent.trim());
  const r = document.getElementById('btnGift').getBoundingClientRect();
  const v = document.getElementById('btnGiftScan').getBoundingClientRect();
  const inp = document.getElementById('giftCode').getBoundingClientRect();
  return { bs, mesmaLinha: Math.abs(r.top - v.top) < 3, ladoADireita: v.left > r.left, abaixoDoCodigo: r.top > inp.top,
           dentroDaLoja: !!bl.closest('#v-loja'), naTela: v.width > 40 && v.right <= document.querySelector('.phone').getBoundingClientRect().right };
});
t('bloco do gift card tem Resgatar', !!gift && gift.bs.includes('Resgatar'));
t('bloco do gift card tem Validar pelo QR', !!gift && gift.bs.includes('Validar pelo QR'));
t('Validar na mesma linha do Resgatar', !!gift && gift.mesmaLinha);
t('Validar à direita do Resgatar', !!gift && gift.ladoADireita);
t('botões abaixo do campo de código', !!gift && gift.abaixoDoCodigo);
t('bloco está dentro da Quad Store', !!gift && gift.dentroDaLoja);
t('Validar cabe na tela do celular', !!gift && gift.naTela);
await p.$('.phone').then(el => el.screenshot({ path: S + '/j1-loja-topo.png' }));

/* ---------- 4. o leitor abre pelo botão da loja ---------- */
await p.click('#btnGiftScan'); await p.waitForTimeout(400);
t('leitor de QR abre pela loja', await p.evaluate(() => document.getElementById('scanLayer').classList.contains('on')));
await p.$('.phone').then(el => el.screenshot({ path: S + '/j1-leitor.png' }));
const d0 = await dmn();
await p.click('#btnScanDemo'); await p.waitForTimeout(400);
t('sem lote: avisa que não há gift card ativo', /Nenhum gift card ativo/.test(await toast()));
t('sem lote: saldo intacto', await dmn() === d0);
await p.click('#btnScanFechar'); await p.waitForTimeout(300);
t('leitor fecha', !await p.evaluate(() => document.getElementById('scanLayer').classList.contains('on')));

/* ---------- 5. lote criado no Painel de controle ---------- */
await p.evaluate(() => {
  document.getElementById('admGiftQtd').value = '3';
  document.getElementById('admGiftValor').value = '250';
  document.getElementById('admGiftMoeda').value = 'dmn';
  document.getElementById('btnAdmGift').click();
});
await p.waitForTimeout(300);
let codes = await abrirLote(0);
t('lote nasce com 3 cartões', codes.length === 3);
t('cartões no formato QG1-…', codes.every(x => /^QG1-/.test(x.c)));
t('cartões nascem ativos', codes.every(x => !x.usado));

/* leitura pelo QR credita e invalida */
const d1 = await dmn();
await p.click('#btnGiftScan'); await p.waitForTimeout(300);
await p.click('#btnScanDemo'); await p.waitForTimeout(500);
t('QR credita o valor do lote', await dmn() === d1 + 250);
t('QR fecha o leitor ao validar', !await p.evaluate(() => document.getElementById('scanLayer').classList.contains('on')));
codes = await abrirLote(0);
t('QR invalida o cartão lido', codes[0].usado === true);
t('demais cartões do lote seguem ativos', codes.filter(x => !x.usado).length === 2);
t('painel conta 1 de 3 resgatados', /1 de 3 resgatados/.test(await p.evaluate(() => document.getElementById('admGiftLotes').textContent)));

/* mesmo cartão não credita duas vezes */
const d2 = await dmn();
await p.evaluate(cod => { document.getElementById('giftCode').value = cod; document.getElementById('btnGift').click(); }, codes[0].c);
await p.waitForTimeout(400);
t('cartão usado é recusado', /já foi resgatado/.test(await toast()));
t('cartão usado não credita de novo', await dmn() === d2);

/* resgate digitado continua funcionando */
await p.evaluate(cod => { document.getElementById('giftCode').value = cod.toLowerCase(); document.getElementById('btnGift').click(); }, codes[1].c);
await p.waitForTimeout(400);
t('código digitado credita (aceita minúsculas)', await dmn() === d2 + 250);
t('campo do código é limpo após o resgate', await p.evaluate(() => document.getElementById('giftCode').value) === '');
codes = await abrirLote(0);
t('código digitado invalida o cartão', codes[1].usado === true);

/* código inexistente */
await p.evaluate(() => { document.getElementById('giftCode').value = 'QG9-XXXX'; document.getElementById('btnGift').click(); });
await p.waitForTimeout(400);
t('código inválido é recusado', /inválido/.test(await toast()));

/* lote em Quad Coins credita QdC, não Diamantes */
const q0 = await qdc(), d3 = await dmn();
await p.evaluate(() => {
  document.getElementById('admGiftQtd').value = '2';
  document.getElementById('admGiftValor').value = '80';
  document.getElementById('admGiftMoeda').value = 'qdc';
  document.getElementById('btnAdmGift').click();
});
await p.waitForTimeout(300);
const qc = await abrirLote(1);
await p.evaluate(cod => { document.getElementById('giftCode').value = cod; document.getElementById('btnGift').click(); }, qc[0].c);
await p.waitForTimeout(500);
t('lote em QdC credita Quad Coins', await qdc() === q0 + 80);
t('lote em QdC não mexe nos Diamantes', await dmn() === d3);
t('aviso do QdC cita Quad Coins', /Quad Coins/.test(await toast()));

/* ---------- 6. saldo do topo da loja acompanha ---------- */
await p.waitForTimeout(300);
t('saldo Dmn do topo da loja acompanha', await num('lojaSaldoDmn') === await dmn());
t('saldo QdC do topo da loja acompanha', await num('lojaSaldo') === await qdc());
await p.$('.phone').then(el => el.screenshot({ path: S + '/j1-loja-final.png' }));

console.log('vj1 :: ' + ok + ' ok / ' + falhas.length + ' falhas' + (falhas.length ? '\n  - ' + falhas.join('\n  - ') : ''));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
