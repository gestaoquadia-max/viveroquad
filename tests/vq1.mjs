/* vq1 — turma ativa: o aluno com mais de uma matrícula escolhe por qual
   turma o app fala (Início, avisos, ranking, Domínio, quiz, materiais),
   com pop-up logo após a matrícula e troca a qualquer hora em
   "Minhas turmas". Avisos têm turma-alvo por id; eventos são do QUAD
   (genéricos — dec. de 28/07 revoga a segmentação por turma).          */
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
const entrarAdmin = async () => {
  await persona('admin'); await p.waitForTimeout(400);
  if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
    await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
    await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
  }
};

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);
const el = await p.$('.phone');

/* ============ o admin abre a C.O.R.E. (manhã · Polícia Civil) ============ */
await entrarAdmin();
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await abrir('jumpControle', 'turmas'); await p.waitForTimeout(300);
await set('admCtTipo', 'RONDESP'); await set('admCtApelido', 'C.O.R.E.'); await set('admCtConc', 'pcba');
await set('admCtIni', '2026-08-03'); await set('admCtFim', '2027-02-01');
await set('admCtH1i', '08:00'); await set('admCtH1f', '09:30'); await set('admCtH2f', '11:00');
await set('admCtPrecoDmn', '600'); await set('admCtPrecoQdc', '700');
await set('admCtVagas', '40'); await set('admCtVagasQdc', '20');
await set('admCtSala', 'Sala 3');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
t('a C.O.R.E. abre no turno da manhã', /aberta/.test(await T('admCtErro')) && /\(manhã\)/.test(await T('admCtErro')));

/* um aviso só para a C.O.R.E. e um evento do Quad (sem turma) */
const coreId = await p.evaluate(() => {
  const o = [...document.querySelectorAll('#admMatTurma option')].find(x => /C\.O\.R\.E\./.test(x.textContent));
  return o ? o.value : null;
});
t('a turma nova entra nas listas de alvo do admin', !!coreId);
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
await abrir('jumpInterno', 'avisos'); await p.waitForTimeout(300);
const alvos = await p.evaluate(() => [...document.querySelectorAll('#admAvEsc option')].map(o => o.textContent));
t('o alvo do aviso virou lista de turmas, não texto solto',
  alvos[0] === 'Todas as turmas' && alvos.indexOf('Turma C.O.R.E.') > 0);
t('o alvo do aviso não usa mais os nomes antigos de modalidade',
  !alvos.some(x => /^(Manhã|Tarde|Noite|RONDESP|PATAMO|BOPE)$/.test(x)));
await set('admAvTitulo', 'Prova de nivelamento na sexta');
await set('admAvDet', 'Só para a C.O.R.E.');
await set('admAvEsc', coreId);
await p.click('#btnAdmAviso'); await p.waitForTimeout(300);
t('o aviso confirma para qual turma foi', /Turma C\.O\.R\.E\./.test(await T('toast')));
t('a lista do admin mostra a turma-alvo', /TURMA C\.O\.R\.E\./.test(await T('admAvisosList')));

await abrir('jumpInterno', 'eventos'); await p.waitForTimeout(300);
await set('admEvNovoNome', 'Roda de estudos da C.O.R.E.');
await set('admEvNovoData', '2026-09-10');
await set('admEvNovoInicio', '08:00'); await set('admEvNovoFim', '10:00');
await set('admEvSala', 'Sala 4');
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
t('o evento é criado — do Quad, sem dono', /criado para/.test(await T('admEvErro')));
t('não existe mais seletor "quem vê este evento"', await p.evaluate(() => !document.getElementById('admEvAlvo')));
t('a lista do admin não marca evento por turma', !/só a Turma/.test(await T('admEvList')));

/* ============ o aluno (já na PATAMO) compra a C.O.R.E. ============ */
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-inicio'); await p.waitForTimeout(500);
t('antes: o Início fala pela PATAMO', /Turma PATAMO/.test(await T('aulaTurma')));
t('antes: o aviso da C.O.R.E. não aparece', !/nivelamento na sexta/.test(await T('avisosList')));
t('evento do Quad já aparece MESMO com a PATAMO ativa (é de todos)', /Roda de estudos/.test(await T('evStrip')));

await nav('v-loja'); await p.waitForTimeout(600);
await p.fill('#giftCode', 'QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(300);
await p.evaluate(x => document.querySelector('[data-turma="' + x + '"]').click(), coreId);
await p.waitForTimeout(400);
await p.evaluate(() => document.getElementById('btnTuQdc').click());
await p.waitForTimeout(600);
t('a matrícula abre o pop-up de escolha (sem deslogar)',
  await p.evaluate(() => document.getElementById('trocaLayer').classList.contains('on')));
const opts = await T('trocaOpts');
t('o pop-up traz um botão por turma, com o nome',
  /Abrir o perfil da Turma PATAMO/.test(opts) && /Abrir o perfil da Turma C\.O\.R\.E\./.test(opts));
t('o pop-up marca qual está em uso agora', /em uso agora/.test(opts));
t('o pop-up explica o que muda ao escolher', /Início, avisos, ranking da sala, Domínio e quiz/.test(await T('trocaLayer')));
await el.screenshot({ path: S + '/q1-popup.png' });

/* escolhe a C.O.R.E. */
await p.evaluate(() => {
  [...document.querySelectorAll('#trocaOpts [data-abrir]')].find(x => /C\.O\.R\.E\./.test(x.textContent)).click();
});
await p.waitForTimeout(700);
t('escolher fecha o pop-up', !await p.evaluate(() => document.getElementById('trocaLayer').classList.contains('on')));
t('escolher leva para o Início', await p.evaluate(() => document.getElementById('v-inicio').classList.contains('on')));
t('Aula de hoje passa a ser da C.O.R.E., com a sala dela',
  /Turma C\.O\.R\.E\./.test(await T('aulaTurma')) && /Sala 3/.test(await T('aulaTurma')));
t('o dia mostra o turno da turma nova (manhã)', /MANHÃ/.test(await T('aulaDia')));
t('turma sem grade lançada diz isso, em vez de "Encontro 00 · Prof."',
  /A definir/.test(await T('aulaSlots')) && !/Encontro 00/.test(await T('aulaSlots')));
t('o aviso da C.O.R.E. aparece agora', /nivelamento na sexta/.test(await T('avisosList')));
t('o aviso de "todas as turmas" continua aparecendo', /Simulado presencial/.test(await T('avisosList')));
t('o aviso que era só da PATAMO sumiu', !/Material de Poderes/.test(await T('avisosList')));
t('o evento do Quad segue no carrossel com a turma nova', /Roda de estudos/.test(await T('evStrip')));
t('o card do topo mostra a turma nova', /C\.O\.R\.E\./.test(await T('cardTurma')));
await el.screenshot({ path: S + '/q1-inicio-core.png' });
await nav('v-dominio'); await p.waitForTimeout(600);
t('o Domínio troca para o edital da Polícia Civil', /Polícia Civil/.test(await T('v-dominio')));
await p.evaluate(() => document.querySelector('[data-goto="v-perfil"]').click()); await p.waitForTimeout(500);
t('o ranking da sala passa a ser o da C.O.R.E.', /C\.O\.R\.E\./.test(await T('rankSalaHead')));
const mt = await T('minhasTurmasList');
t('"Minhas turmas" marca a que está EM USO', /Turma C\.O\.R\.E\..{0,140}EM USO/.test(mt));
t('e oferece "Usar esta" na outra', /Turma PATAMO.{0,140}Usar esta/.test(mt));
await el.screenshot({ path: S + '/q1-minhas-turmas.png' });

/* ============ o seletor está a UM toque, em toda tela ============ */
await nav('v-inicio'); await p.waitForTimeout(400);
t('com 2 turmas, o nome no topo vira botão de trocar', await p.evaluate(() => {
  const b = document.getElementById('cardTurma');
  return b.tagName === 'BUTTON' && !b.disabled && b.classList.contains('trocavel');
}));
await p.evaluate(() => document.getElementById('cardTurma').click()); await p.waitForTimeout(400);
t('o topo abre o mesmo seletor, com título de consulta', /Suas turmas/.test(await T('trocaTitulo')));
t('o seletor fora da matrícula pergunta qual abrir', /Qual delas o app deve abrir/.test(await T('trocaDesc')));
await el.screenshot({ path: S + '/q1-seletor-topo.png' });
await p.evaluate(() => document.getElementById('trocaLayer').click()); await p.waitForTimeout(400);
t('tocar fora do seletor mantém a turma e diz onde trocar',
  /Você segue na/.test(await T('toast')) && /nome da turma no topo/.test(await T('toast')));
await nav('v-dominio'); await p.waitForTimeout(500);
t('o Domínio diz de qual turma é a estrutura na tela',
  /Esta é a estrutura da/.test(await T('domTurmaBox')) && /C\.O\.R\.E\./.test(await T('domTurmaBox')));
t('e traz o botão "Trocar de turma" ali mesmo',
  await p.evaluate(() => document.getElementById('domTurmaBox').style.display !== 'none' && !!document.getElementById('btnDomTrocar')));
await el.screenshot({ path: S + '/q1-dominio-faixa.png' });
await p.evaluate(() => document.getElementById('btnDomTrocar').click()); await p.waitForTimeout(400);
await p.evaluate(() => { [...document.querySelectorAll('#trocaOpts [data-abrir]')].find(x => /PATAMO/.test(x.textContent)).click(); });
await p.waitForTimeout(700);
t('trocar pelo Domínio NÃO joga o aluno para o Início',
  await p.evaluate(() => document.getElementById('v-dominio').classList.contains('on')));
t('a estrutura na tela troca na hora', /CFO/.test(await T('domConcurso')));
t('a faixa passa a citar a outra turma', /Turma PATAMO/.test(await T('domTurmaBox')));

/* ============ trocar de volta, sem sair da conta ============ */
await p.evaluate(() => document.querySelector('[data-goto="v-perfil"]').click()); await p.waitForTimeout(500);
await p.evaluate(() => { document.querySelector('#minhasTurmasList [data-usar]').click(); });
await p.waitForTimeout(700);
t('trocar por "Usar esta" avisa qual turma comanda agora', /Você está na/.test(await T('toast')) && /C\.O\.R\.E\./.test(await T('toast')));
t('o ranking segue a escolha', /C\.O\.R\.E\./.test(await T('rankSalaHead')));
await p.evaluate(() => { document.querySelector('#minhasTurmasList [data-usar]').click(); });
await p.waitForTimeout(700);
t('e volta para a PATAMO pelo mesmo caminho', /PATAMO/.test(await T('rankSalaHead')));
await nav('v-inicio'); await p.waitForTimeout(500);
t('Aula de hoje volta para a PATAMO', /Turma PATAMO/.test(await T('aulaTurma')));
t('o aviso da C.O.R.E. some de novo', !/nivelamento na sexta/.test(await T('avisosList')));
t('o aviso da PATAMO volta', /Material de Poderes/.test(await T('avisosList')));
t('o evento do Quad NÃO some ao voltar de turma (genérico)', /Roda de estudos/.test(await T('evStrip')));
await nav('v-dominio'); await p.waitForTimeout(600);
t('o Domínio volta para o edital do CFO', /CFO/.test(await T('v-dominio')));

/* ============ os materiais das duas turmas continuam juntos ============ */
await p.evaluate(() => {
  document.getElementById('plusPop').classList.remove('on');
  [...document.querySelectorAll('#plusPop [data-goto]')].find(x => /Materiais/.test(x.textContent)).click();
});
await p.waitForTimeout(500);
t('os materiais mostram as turmas em que o aluno está, sem depender da ativa',
  /Direito Administrativo — Poderes/.test(await T('matLista')));

console.log('\nvq1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
