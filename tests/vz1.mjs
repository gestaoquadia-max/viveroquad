/* vz1 — dec. 204: banco por SUBASSUNTO. Todo subassunto tem dois
   pacotes-modelo de 10 certo/errado (instância própria); o play do
   Domínio abre o próximo pacote da rotação; concluído, o pacote volta
   REORGANIZADO pela dificuldade marcada (erradas → difíceis → boas →
   fáceis); o rodízio do Abrir Treinamento desce a subassunto alternando
   as matérias e consome os MESMOS pacotes (estado compartilhado). */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
const p = await c.newPage();
const erros = [];
p.on('pageerror', e => erros.push('JS: ' + e.message));
let ok = 0; const falhas = [];
const t = (nome, cond) => { if (cond) ok++; else falhas.push(nome); };
const nav = v => p.evaluate(x => document.querySelector('#navAluno .nav-btn[data-view="' + x + '"]').click(), v);

await p.addInitScript(() => {
  try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {}
  window.__dropRng = () => 0.999;   /* sem drop aleatório no teste */
});
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);

/* responde o pacote aberto com um roteiro de notas por posição:
   plano[i] = 'errada' (responde errado + Errei) | 'dificil' | 'boa' | 'facil'.
   Devolve os enunciados na ordem em que apareceram. */
async function respondePacote(plano) {
  const vistos = [];
  for (let i = 0; i < plano.length; i++) {
    const txt = await p.evaluate(() => document.querySelector('.fc-enun').textContent);
    vistos.push(txt);
    const certoEh = await p.evaluate(tx => {
      const c = Object.values(window.QB_MODELO).flat().find(r => r[1] === tx);
      return c ? c[0] === 'C' : true;
    }, txt);
    const errar = plano[i] === 'errada';
    await p.click((errar ? !certoEh : certoEh) ? '#fcCerto' : '#fcErrado');
    await p.waitForTimeout(120);
    const nota = { errada: 0, dificil: 1, boa: 2, facil: 3 }[plano[i]];
    await p.evaluate(n => document.querySelector('#trBody [data-nota="' + n + '"]').click(), nota);
    await p.waitForTimeout(120);
  }
  return vistos;
}
const abrePlay = sub => p.evaluate(s => {
  const row = [...document.querySelectorAll('#editalTree .ed-srow')].find(r => r.textContent.includes(s));
  row.querySelector('.ed-q10').click();
}, sub);
const titulo = () => p.evaluate(() => document.getElementById('trTitulo').textContent);

/* ============ O PLAY ABRE O PACOTE 1 DO SUBASSUNTO ============ */
await nav('v-dominio'); await p.waitForTimeout(500);
t('todo subassunto visível tem o play ACESO (o banco-modelo cobre a árvore)',
  await p.evaluate(() => {
    const rows = [...document.querySelectorAll('#editalTree .ed-srow')];
    return rows.length > 0 && rows.every(r => r.querySelector('.ed-q10')) &&
           !document.querySelector('#editalTree .ed-q10.off');
  }));
/* "Antiguidade" (História) — assunto SEM cartas de aula/quiz: rotação pura
   dos dois pacotes-modelo */
await p.evaluate(() => {
  const mats = [...document.querySelectorAll('#editalTree .ed-mat')];
  const hist = mats.find(m => m.querySelector('.ed-head .ed-nm').textContent.includes('História'));
  hist.classList.add('open');
  hist.querySelector('.ed-ass').classList.add('open');
});
await p.waitForTimeout(200);
await abrePlay('Antiguidade'); await p.waitForTimeout(400);
t('o play abre "Pacote 1 · Antiguidade"', (await titulo()) === 'Pacote 1 · Antiguidade');
t('o pacote tem 10 cartas', await p.evaluate(() => document.querySelector('#trBody .k-label').textContent.includes('de 10')));

/* ============ MARCA AS DIFICULDADES: 3 erradas, 2 difíceis, 4 boas, 1 fácil ============ */
const plano1 = ['errada', 'boa', 'dificil', 'boa', 'errada', 'facil', 'boa', 'dificil', 'errada', 'boa'];
const ordem1 = await respondePacote(plano1);
const resumo = await p.evaluate(() => document.getElementById('trBody').textContent);
t('resumo: 7 de 10 (as 3 erradas de propósito)', resumo.includes('7 de 10'));
t('resumo avisa que o pacote volta reorganizado (erradas primeiro)',
  resumo.includes('reorganizado') && resumo.includes('erradas primeiro'));
t('resumo cita o Domínio de Antiguidade', resumo.includes('Antiguidade'));
await p.evaluate(() => document.getElementById('btnTrProx').click()); await p.waitForTimeout(300);

/* ============ A ROTAÇÃO AVANÇA: PACOTE 2; DEPOIS VOLTA O 1 REORGANIZADO ============ */
await abrePlay('Antiguidade'); await p.waitForTimeout(400);
t('o próximo play do MESMO subassunto abre "Pacote 2 · Antiguidade"', (await titulo()) === 'Pacote 2 · Antiguidade');
await respondePacote(Array(10).fill('boa'));
await p.evaluate(() => document.getElementById('btnTrProx').click()); await p.waitForTimeout(300);
await abrePlay('Antiguidade'); await p.waitForTimeout(400);
t('esgotados os pacotes, a rotação volta ao Pacote 1', (await titulo()) === 'Pacote 1 · Antiguidade');
const ordem2 = await p.evaluate(() => {
  const est = window.__qbEst('História', 'História Geral', 'Antiguidade');
  return est.pacotes[0].map(c => c.t);
});
const esperado = [0, 4, 8, 2, 7, 1, 3, 6, 9, 5].map(i => ordem1[i]);
t('o Pacote 1 voltou REORGANIZADO: as 3 erradas primeiro, depois as 2 difíceis, as 4 boas e a fácil por último',
  JSON.stringify(ordem2) === JSON.stringify(esperado));
t('a primeira carta na tela é a primeira ERRADA da rodada anterior',
  (await p.evaluate(() => document.querySelector('.fc-enun').textContent)) === ordem1[0]);
await p.evaluate(() => document.getElementById('btnTrSair').click()); await p.waitForTimeout(200);

/* ============ INSTÂNCIA PRÓPRIA POR SUBASSUNTO ============ */
await abrePlay('Mundo Medieval'); await p.waitForTimeout(400);
t('outro subassunto começa do SEU Pacote 1 (estado não vaza)', (await titulo()) === 'Pacote 1 · Mundo Medieval');
t('intocado: nenhuma nota registrada na instância do vizinho (e as cartas levam a etiqueta dele)',
  await p.evaluate(() => {
    const est = window.__qbEst('História', 'História Geral', 'Mundo Medieval');
    return est.pacotes.flat().every(c => c.nota === -1 && c.resp === null && c.s === 'Mundo Medieval');
  }));
t('o embaralho por subassunto varia: Pacote 1 de Mundo Medieval ≠ Pacote 1 de Mundo Moderno',
  await p.evaluate(() => {
    const mm = window.__qbEst('História', 'História Geral', 'Mundo Medieval').pacotes[0].map(c => c.t).join('|');
    const mo = window.__qbEst('História', 'História Geral', 'Mundo Moderno').pacotes[0].map(c => c.t).join('|');
    return mm !== mo;
  }));
/* dec. 205 — o tema acompanha a MATÉRIA (relato do gestor: Português abria
   questão de matemática) */
t('as questões do pacote são DA MATÉRIA: subassunto de Português só carrega questões do conjunto de Português',
  await p.evaluate(() => {
    const pool = new Set(window.QB_MODELO['Língua Portuguesa'].map(r => r[1]));
    return window.__qbEst('Língua Portuguesa', 'Interpretação de textos', 'Textos mistos')
      .pacotes.flat().every(c => pool.has(c.t));
  }));
t('e subassunto de História só carrega questões do conjunto de História',
  await p.evaluate(() => {
    const pool = new Set(window.QB_MODELO['História'].map(r => r[1]));
    return window.__qbEst('História', 'História Geral', 'Mundo Medieval')
      .pacotes.flat().every(c => pool.has(c.t));
  }));
await p.evaluate(() => document.getElementById('btnTrSair').click()); await p.waitForTimeout(200);

/* ============ REFORÇO: CARTAS DE AULA/QUIZ CONVIVEM ============ */
t('subassunto com cartas de aula/quiz no assunto ganha o pacote de Reforço (2 modelos + 1)',
  await p.evaluate(() => window.__qbPacotes('Língua Portuguesa', 'Interpretação de textos', 'Textos verbais').length === 3 &&
                         window.__qbPacotes('História', 'História Geral', 'Antiguidade').length === 2));

/* ============ RODÍZIO: DESCE A SUBASSUNTO ALTERNANDO MATÉRIAS ============ */
await nav('v-missoes'); await p.waitForTimeout(400);
await p.click('#btnTreinoRapido'); await p.waitForTimeout(400);
const fila = await p.evaluate(() => [...document.querySelectorAll('.tr-fila-row .nm')].map(e => e.textContent));
t('a fila de Gerais alterna as matérias no 1º subassunto de cada uma',
  fila.length >= 6 &&
  fila[0].includes('Textos verbais') && fila[0].includes('Língua Portuguesa') &&
  fila[1].includes('Textos verbais') && fila[1].includes('Língua Inglesa') &&
  fila[2].includes('Microsoft Word') &&
  fila[3].includes('Números naturais') &&
  fila[4].includes('Antiguidade') &&
  fila[5].includes('Mecanismos da natureza'));
t('a fila mostra a janela, não o edital inteiro (e diz quantos faltam)',
  await p.evaluate(() => {
    const card = document.getElementById('trBody').textContent;
    return document.querySelectorAll('.tr-fila-row').length <= 9 && /mais \d+ blocos/.test(card);
  }));
/* o rodízio consome os MESMOS pacotes: Textos verbais no Domínio e aqui
   compartilham a rotação */
await p.click('#btnTrComecar'); await p.waitForTimeout(400);
t('o bloco do rodízio abre como pacote do subassunto ("Pacote 1 · Textos verbais")',
  (await titulo()) === 'Pacote 1 · Textos verbais');
await respondePacote(Array(10).fill('boa'));
const resumoR = await p.evaluate(() => document.getElementById('trBody').textContent);
t('o resumo do rodízio também avisa a reorganização', resumoR.includes('reorganizado'));
await p.evaluate(() => document.getElementById('btnTrProx').click()); await p.waitForTimeout(300);
t('o rodízio avança para o próximo bloco (Inglês · Textos verbais)',
  await p.evaluate(() => document.getElementById('trBody').textContent.includes('Língua Inglesa')));
t('a rotação de Textos verbais avançou TAMBÉM para o Domínio (próximo = Pacote 2)',
  await p.evaluate(() => window.__qbEst('Língua Portuguesa', 'Interpretação de textos', 'Textos verbais').prox === 1));
await p.evaluate(() => document.getElementById('btnTrSair').click());

console.log('\nvz1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
