/* vy1 — dec. 201/202: o Início rola e PARA no fim (a rolagem infinita
   vertical saiu; roda 3D e esteira de eventos ficam) e cada subassunto
   do Domínio tem o botão que abre seu bloco de 10 questões de revisão. */
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

await p.addInitScript(() => { try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {} });
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);

/* ============ DEC. 201 · O INÍCIO ROLA E PARA ============ */
t('o conteúdo do Início não é mais triplicado (nenhum clone .loop-seg)',
  await p.evaluate(() => document.querySelectorAll('#v-inicio .loop-seg').length === 0));
t('o Início abre no topo de verdade',
  await p.evaluate(() => document.getElementById('v-inicio').scrollTop === 0));
await p.evaluate(() => { document.getElementById('v-inicio').scrollTop = 999999; });
await p.waitForTimeout(600);   /* o antigo teleporte agia no evento de scroll */
t('rolar até o fim PARA no fim — nada de teleporte de volta',
  await p.evaluate(() => { const v = document.getElementById('v-inicio'); return Math.abs(v.scrollTop - (v.scrollHeight - v.clientHeight)) < 3 && v.scrollTop > 100; }));
t('a roda 3D do Início continua viva (só a rolagem infinita saiu)',
  await p.evaluate(() => [...document.querySelectorAll('#v-inicio .p-card')].some(c => c.style.transform.indexOf('perspective') >= 0)));
t('a esteira horizontal de eventos segue em loop (3 cópias — não era o alvo)',
  await p.evaluate(() => { const n = document.querySelectorAll('#evStrip .ev-tile').length; return n > 0 && n % 3 === 0; }));
await p.evaluate(() => { document.getElementById('v-inicio').scrollTop = 0; });

/* ============ DEC. 202 · BOTÃO DE 10 QUESTÕES POR SUBASSUNTO ============ */
await nav('v-dominio'); await p.waitForTimeout(500);
const arvore = await p.evaluate(() => {
  const rows = [...document.querySelectorAll('#editalTree .ed-srow')];
  return { total: rows.length,
           comBotao: rows.filter(r => r.querySelector('.ed-q10')).length,
           acesos: rows.filter(r => r.querySelector('.ed-q10:not(.off)')).length,
           numerados: rows.every(r => /^\d+\.\d+\.\d+ /.test(r.querySelector('.ed-nm').textContent)) };
});
t('todo subassunto da árvore tem o botão de 10 questões', arvore.total > 300 && arvore.comBotao === arvore.total);
t('os subassuntos dos 6 assuntos com cartas estão acesos (21 na demo)', arvore.acesos === 21);
t('os subassuntos ganharam numeração 1.1.1 (o aluno acha o conteúdo pelo número)', arvore.numerados);

/* botão apagado explica; não abre nada */
await p.evaluate(() => [...document.querySelectorAll('#editalTree .ed-q10.off')][0].click());
await p.waitForTimeout(300);
t('subassunto ainda sem cartas avisa que as aulas alimentam o bloco',
  await p.evaluate(() => /Sem cartas ainda/.test(document.getElementById('toast').textContent) &&
                         document.getElementById('trLayer').style.display !== 'flex'));

/* abre a revisão de "Textos mistos" (LP · Interpretação de textos) */
const pctAntes = await p.evaluate(() => {
  const row = [...document.querySelectorAll('#editalTree .ed-srow')].find(r => /Textos mistos/.test(r.textContent));
  return parseInt(row.querySelector('.ed-pc').textContent, 10);
});
await p.evaluate(() => {
  const row = [...document.querySelectorAll('#editalTree .ed-srow')].find(r => /Textos mistos/.test(r.textContent));
  row.querySelector('.ed-q10').click();
});
await p.waitForTimeout(500);
t('o botão abre o mesmo overlay do Treinamento Rápido',
  await p.evaluate(() => document.getElementById('trLayer').style.display === 'flex'));
t('o título diz que é a revisão daquele subassunto',
  await p.evaluate(() => document.getElementById('trTitulo').textContent === 'Revisão · Textos mistos'));
t('as cartas etiquetadas com o subassunto vêm primeiro no baralho',
  await p.evaluate(() => {
    const enun = document.querySelector('#trBody .fc-enun').textContent;
    const card = window.TR_BANK.filter(c => c.t === enun)[0];
    return card && card.s === 'Textos mistos';
  }));

/* responde as 10 acertando tudo (o gabarito vem do banco exposto) */
const antes = await p.evaluate(() => window.__carteira());
for (let i = 0; i < 10; i++) {
  await p.evaluate(() => {
    const enun = document.querySelector('#trBody .fc-enun').textContent;
    const card = window.TR_BANK.filter(c => c.t === enun)[0];
    document.getElementById(card.c ? 'fcCerto' : 'fcErrado').click();
  });
  await p.waitForTimeout(100);
  await p.evaluate(() => document.querySelector('#trBody [data-nota="3"]').click());
  await p.waitForTimeout(100);
}
const fim = await p.evaluate(() => document.getElementById('trBody').textContent.replace(/\s+/g, ' '));
t('o fim do bloco paga como todo bloco: +1 score por acerto e +5 Quad Coins',
  /10 de 10/.test(fim) && /\+10 score/.test(fim) && /\+5 Quad Coins/.test(fim));
t('a tela final cita o SUBASSUNTO revisado', /O Domínio de Textos mistos foi atualizado/.test(fim));
t('o pagamento entrou de verdade na carteira',
  await p.evaluate(a => window.__carteira().score === a.score + 5, antes));
t('o botão final é Fechar — revisão não puxa o rodízio',
  await p.evaluate(() => document.getElementById('btnTrProx').textContent === 'Fechar'));
await p.evaluate(() => document.getElementById('btnTrProx').click());
await p.waitForTimeout(500);
const depois = await p.evaluate(() => {
  const row = [...document.querySelectorAll('#editalTree .ed-srow')].find(r => /Textos mistos/.test(r.textContent));
  return { pct: parseInt(row.querySelector('.ed-pc').textContent, 10),
           matAberta: row.closest('.ed-mat').classList.contains('open'),
           fechou: document.getElementById('trLayer').style.display === 'none' };
});
t('acertar as 10 sobe a barra DAQUELE subassunto', depois.pct > pctAntes);
t('a árvore continua aberta onde o aluno estava', depois.matAberta && depois.fechou);

/* a revisão não contamina o rodízio normal do treinamento */
await nav('v-missoes'); await p.waitForTimeout(400);
await p.evaluate(() => document.getElementById('btnTreinoRapido').click());
await p.waitForTimeout(500);
t('o Treinamento Rápido abre normal depois da revisão (rodízio intacto)',
  await p.evaluate(() => document.getElementById('trLayer').style.display === 'flex' &&
                         /Bloco de Gerais/.test(document.getElementById('trTitulo').textContent)));
await p.evaluate(() => document.getElementById('btnTrSair').click());

console.log('\nvy1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
