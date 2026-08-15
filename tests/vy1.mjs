/* vy1 — dec. 201/202/203: o Início rola e PARA no fim (a rolagem
   infinita vertical saiu; roda 3D e esteira de eventos ficam); cada
   subassunto do Domínio tem o botão de PLAY que abre seu bloco de 10
   questões; com o banco por subassunto (dec. 204) o play está sempre
   aceso, e as cartas de aula migradas em runtime viram o pacote de
   Reforço do subassunto — o mecanismo continua ligando sozinho. */
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
t('todos os plays estão ACESOS — o banco-modelo cobre a árvore inteira (dec. 204)', arvore.acesos === arvore.total);
t('os subassuntos ganharam numeração 1.1.1 (o aluno acha o conteúdo pelo número)', arvore.numerados);
t('o botão é um ícone de play, não um número (dec. 203)',
  await p.evaluate(() => { const b = document.querySelector('#editalTree .ed-q10'); return !!b.querySelector('svg path') && b.textContent.trim() === ''; }));

/* abre o pacote de "Textos mistos" (LP · Interpretação de textos) */
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
t('o título diz qual pacote do subassunto abriu (dec. 204)',
  await p.evaluate(() => document.getElementById('trTitulo').textContent === 'Pacote 1 · Textos mistos'));
t('o pacote é a instância DESTE subassunto (cartas etiquetadas com ele)',
  await p.evaluate(() => {
    const est = window.__qbEst('Língua Portuguesa', 'Interpretação de textos', 'Textos mistos');
    return est.pacotes[0].every(c => c.s === 'Textos mistos');
  }));

/* responde as 10 acertando tudo (o gabarito vem do banco exposto) */
const antes = await p.evaluate(() => window.__carteira());
for (let i = 0; i < 10; i++) {
  await p.evaluate(() => {
    const enun = document.querySelector('#trBody .fc-enun').textContent;
    const card = window.QB_MODELO.flat().find(r => r[1] === enun);
    document.getElementById(card && card[0] === 'C' ? 'fcCerto' : 'fcErrado').click();
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

/* ============ DEC. 203 · O MECANISMO ESTÁ PRONTO PARA UM BANCO FUTURO ============
   Nenhuma lista fixa decide quais botões acendem: é a presença de cartas
   no banco (matéria+assunto). Prova em runtime: responder o bloco da aula
   migra as 10 cartas do PDF para o TR_BANK — os 8 subassuntos de
   "Poderes administrativos" têm de acender sozinhos, na hora.          */
await nav('v-dominio'); await p.waitForTimeout(300);
t('antes da aula, "Poder vinculado" tem só os 2 pacotes-modelo (sem Reforço)',
  await p.evaluate(() => window.__qbPacotes('Direito Administrativo', 'Poderes administrativos', 'Poder vinculado').length === 2));
await nav('v-missoes'); await p.waitForTimeout(400);
await p.evaluate(() => {
  const bt = [...document.querySelectorAll('#diaList [data-dia]')].find(b => /Dir\. Administrativo/.test(b.closest('.mission-row').textContent));
  bt.click();
});
await p.waitForTimeout(500);
for (let i = 0; i < 10; i++) {   /* responde as 10 do PDF (acerto não importa aqui) */
  await p.evaluate(() => document.getElementById('fcCerto').click());
  await p.waitForTimeout(80);
  await p.evaluate(() => document.querySelector('#trBody [data-nota="2"]').click());
  await p.waitForTimeout(80);
}
await p.evaluate(() => document.getElementById('btnTrProx').click());
await p.waitForTimeout(400);
await nav('v-dominio'); await p.waitForTimeout(400);
const posAula = await p.evaluate(() => {
  const subs = ['Poder vinculado', 'Poder discricionário', 'Poder hierárquico', 'Poder disciplinar',
                'Poder regulamentar', 'Poder de polícia', 'Uso do poder', 'Abuso de poder'];
  return subs.filter(su => window.__qbPacotes('Direito Administrativo', 'Poderes administrativos', su).length === 3).length;
});
t('o banco chegou (cartas da aula) e virou pacote de Reforço SOZINHO nos 8 subassuntos de Poderes administrativos', posAula === 8);
await p.evaluate(() => {
  const row = [...document.querySelectorAll('#editalTree .ed-srow')].find(r => /Poder vinculado/.test(r.textContent));
  row.querySelector('.ed-q10').click();
});
await p.waitForTimeout(500);
t('e o play abre o pacote daquele subassunto',
  await p.evaluate(() => document.getElementById('trLayer').style.display === 'flex' &&
                         document.getElementById('trTitulo').textContent === 'Pacote 1 · Poder vinculado'));
await p.evaluate(() => document.getElementById('btnTrSair').click());

console.log('\nvy1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
