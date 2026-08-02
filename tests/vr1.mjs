/* vr1 — rodada "cada turma com a sua vida":
   1) vagas POR MOEDA na criação de turma e simulado (o caso "20 e 20" do
      gestor compra por Diamante);
   2) Missões por turma: blocos do dia, herói Bloco da manhã/noite,
      bônus e rodízio separados; Introdução no Quad é DA CONTA;
   3) calendário com as aulas da turma ativa;
   4) eventos genéricos do Quad;
   5) classificação viva no perfil; materiais etiquetados por turma.     */
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
const T = id => p.evaluate(i => { const e = document.getElementById(i); return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; }, id);
const persona = q => p.evaluate(x => document.querySelector('.persona-btn[data-persona="' + x + '"]').click(), q);
const nav = v => p.evaluate(x => document.querySelector('#navAluno .nav-btn[data-view="' + x + '"]').click(), v);
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const abrir = (h, k) => p.evaluate(a => {
  const bl = document.querySelector('[data-bl="' + a.k + '"]');
  if (!bl || bl.style.display === 'none') document.querySelector('#' + a.h + ' .jp[data-jump="' + a.k + '"]').click();
}, { h, k });
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });
const trocaPara = async re => {
  await p.evaluate(() => document.getElementById('cardTurma').click());
  await p.waitForTimeout(300);
  await p.evaluate(r => { [...document.querySelectorAll('#trocaOpts [data-abrir]')].find(x => new RegExp(r).test(x.textContent)).click(); }, re);
  await p.waitForTimeout(700);
};

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);
const el = await p.$('.phone');

/* ============ 1) VAGAS POR MOEDA — o caso exato do gestor ============ */
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await abrir('jumpControle', 'turmas'); await p.waitForTimeout(300);
const lbls = await p.evaluate(() => [...document.querySelectorAll('#admCtVagas, #admCtVagasQdc')].map(x => x.closest('.ct-fld').querySelector('span').textContent));
t('turma: os campos são "Vagas em Diamantes" e "Vagas em Quad Coins"',
  lbls[0] === 'Vagas em Diamantes' && lbls[1] === 'Vagas em Quad Coins');
await set('admCtTipo', 'RONDESP'); await set('admCtApelido', 'C.O.R.E.'); await set('admCtConc', 'pcba');
await set('admCtIni', '2026-08-03'); await set('admCtFim', '2027-02-01');
await set('admCtH1i', '08:00'); await set('admCtH1f', '09:30'); await set('admCtH2f', '11:00');
await set('admCtPrecoDmn', '600'); await set('admCtPrecoQdc', '700');
await set('admCtVagas', '20'); await set('admCtVagasQdc', '20');   /* "20 e 20", como o gestor digitou */
t('o eco soma as moedas em voz alta', /20 em Dmn \+ 20 em QdC = 40 no total/.test(await T('admCtEco')));
await set('admCtSala', 'Sala 3');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
t('a turma abre com 20 Dmn + 20 QdC (40 no total)',
  /20 vagas em Diamantes e 20 em Quad Coins \(40 no total\)/.test(await T('admCtErro')));

/* o aluno compra POR DIAMANTE — era isso que não existia */
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(600);
await p.fill('#giftCode', 'QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(300);
const coreId = await p.evaluate(() => { const x = [...document.querySelectorAll('[data-turma]')].find(y => /C\.O\.R\.E\./.test(y.textContent)); return x.dataset.turma; });
await p.evaluate(x => document.querySelector('[data-turma="' + x + '"]').click(), coreId);
await p.waitForTimeout(400);
t('o botão Diamantes está HABILITADO com 20 vagas', await p.evaluate(() =>
  !document.getElementById('btnTuDmn').disabled && /20 vagas/.test(document.getElementById('tuDmnVagas').textContent)));
await p.evaluate(() => document.getElementById('btnTuDmn').click()); await p.waitForTimeout(600);
t('a matrícula POR DIAMANTE passa', /matrícula −600 Dmn/.test(await T('toast')));
await p.evaluate(() => { [...document.querySelectorAll('#trocaOpts [data-abrir]')].find(x => /C\.O\.R\.E\./.test(x.textContent)).click(); });
await p.waitForTimeout(700);

/* simulado presencial: mesma régua por moeda */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await abrir('jumpInterno', 'simulados'); await p.waitForTimeout(300);
const lblSim = await p.evaluate(() => [...document.querySelectorAll('#admSimVagas, #admSimVagasQdc')].map(x => x.closest('.ct-fld').querySelector('span').textContent));
t('simulado: campos por moeda também', lblSim[0] === 'Vagas em Diamantes' && lblSim[1] === 'Vagas em Quad Coins');

/* ============ 2) MISSÕES POR TURMA ============ */
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-inicio'); await p.waitForTimeout(400);
t('herói fala a língua da turma: "Bloco da manhã"', (await T('heroTitulo')) === 'Bloco da manhã');
t('o subtítulo acompanha', /desta manhã/.test(await T('heroSub')));
await nav('v-missoes'); await p.waitForTimeout(400);
t('"Hoje · questões novas" diz de qual turma é', /TURMA C\.O\.R\.E\./.test(await T('diaTurma')));
t('as rápidas da aula usam o horário DA TURMA (8h, não 19h)',
  /aula de hoje · 08h/.test(await T('diaList')) && !/19h/.test(await T('diaList')));
t('turma nova não herda atrasadas da antiga', /Nenhuma missão atrasada/.test(await T('atrasadasList')));
t('a Introdução no Quad está lá, pendente e marcada como da conta',
  /vale uma vez, para a conta/.test(await T('biDesc')));
/* conclui 2 blocos na C.O.R.E. */
await p.evaluate(() => { const ms = window.__noite.missoes(); ms[0].b.feito = true; ms[1].b.feito = true; window.__noite.renderDia(); });
await p.waitForTimeout(200);
t('progresso na C.O.R.E.: 2/8', (await T('missCount')) === '2/8');
await el.screenshot({ path: S + '/r1-missoes-core.png' });
/* volta para a PATAMO: nada vazou */
await trocaPara('PATAMO');
t('herói volta a ser "Bloco da noite"', (await T('heroTitulo')) === 'Bloco da noite');
t('o progresso da PATAMO segue 0/8 — nada vazou da outra turma', (await T('missCount')) === '0/8');
await nav('v-missoes'); await p.waitForTimeout(400);
t('a PATAMO mantém as atrasadas da demo', /Recuperar/.test(await T('atrasadasList')));
t('a etiqueta do "Hoje" trocou junto', /TURMA PATAMO/.test(await T('diaTurma')));
t('as rápidas da PATAMO seguem no horário da noite', /aula de hoje · 19h/.test(await T('diaList')));
/* e voltar de novo encontra os 2/8 da C.O.R.E. intactos */
await trocaPara('C\\.O\\.R\\.E\\.');
t('voltar à C.O.R.E. reencontra o 2/8', (await T('missCount')) === '2/8');
await trocaPara('PATAMO');

/* ============ 3) CALENDÁRIO POR TURMA ============ */
await p.evaluate(() => { document.getElementById('plusPop').classList.remove('on'); [...document.querySelectorAll('#plusPop [data-goto]')].find(x => /Calendário/.test(x.textContent)).click(); });
await p.waitForTimeout(400);
const calP = await T('calList');
t('calendário da PATAMO: aulas com a grade e a sala dela', /Aula · Turma PATAMO/.test(calP) && /19h/.test(calP) && /Sala 2/.test(calP));
t('os marcos do Quad continuam (prazo de missões, TAF)', /Corte das missões/.test(calP) && /Pré-TAF/.test(calP));
await trocaPara('C\\.O\\.R\\.E\\.');
await p.evaluate(() => { document.getElementById('plusPop').classList.remove('on'); [...document.querySelectorAll('#plusPop [data-goto]')].find(x => /Calendário/.test(x.textContent)).click(); });
await p.waitForTimeout(400);
const calC = await T('calList');
t('trocar de turma troca o calendário', /Aula · Turma C\.O\.R\.E\./.test(calC) && !/Aula · Turma PATAMO/.test(calC));
t('turma sem grade lançada diz isso no calendário', /grade a definir pela coordenação/.test(calC) && /Sala 3/.test(calC));
await el.screenshot({ path: S + '/r1-calendario-core.png' });

/* ============ 4) EVENTOS SÃO DO QUAD ============ */
t('o carrossel de eventos é o mesmo em qualquer turma', await p.evaluate(async () => {
  const antes = document.getElementById('evStrip').textContent;
  return antes.length > 0;
}));
const evCore = await T('evStrip');
await trocaPara('PATAMO');
t('trocar de turma NÃO muda os eventos da semana', (await T('evStrip')) === evCore);
t('o admin não tem mais "quem vê este evento"', await p.evaluate(() => !document.getElementById('admEvAlvo')));

/* ============ 5) CLASSIFICAÇÃO VIVA + MATERIAIS ETIQUETADOS ============ */
await p.evaluate(() => document.querySelector('[data-goto="v-perfil"]').click()); await p.waitForTimeout(400);
const posQuad = await T('qPos');
t('a posição do Quadrômetro é calculada, não decorativa', /^#\d+$/.test(posQuad));
await p.evaluate(() => document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(400);
t('os tiles do perfil batem com o Quadrômetro', (await T('rankSala')) === posQuad && /de \d+ alunos/.test(await T('rankSalaTotal')));
await p.evaluate(() => { document.getElementById('plusPop').classList.remove('on'); [...document.querySelectorAll('#plusPop [data-goto]')].find(x => /Materiais/.test(x.textContent)).click(); });
await p.waitForTimeout(400);
t('com 2 turmas, cada material diz de qual turma veio', /Turma PATAMO/.test(await T('matLista')));

console.log('\nvr1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
