/* vo1 — quatro ajustes: ficha do professor em duas alturas, tipo da turma
   com nome de verdade, turno saindo do horário e "Turmas abertas" com
   tudo o que está no ar, podendo editar e apagar                        */
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
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const nav = v => p.evaluate(x => document.querySelector('#navAluno .nav-btn[data-view="' + x + '"]').click(), v);
/* o atalho ALTERNA o bloco — abrir só clica se ele estiver recolhido */
const jump = (h, k) => p.evaluate(a => {
  const bl = document.querySelector('[data-bl="' + a.k + '"]');
  if (!bl || bl.style.display === 'none') document.querySelector('#' + a.h + ' .jp[data-jump="' + a.k + '"]').click();
}, { h, k });
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(700);
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
const el = await p.$('.phone');

/* ============ 1) BANCO DE PROFESSORES: ficha e botões em faixas ============ */
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await jump('jumpControle', 'doc'); await p.waitForTimeout(300);
const linha = await p.evaluate(() => {
  const r = document.querySelector('#admDocList .adm-bar');
  if (!r) return null;
  const nm = r.querySelector('.nm'), ac = r.querySelector('.bar-acoes');
  if (!nm || !ac) return null;
  const a = nm.getBoundingClientRect(), c = ac.getBoundingClientRect(), l = r.getBoundingClientRect();
  return { largura: Math.round(a.width / l.width * 100), abaixo: c.top >= a.bottom - 1, dentro: c.right <= l.right + 1, temCol: r.classList.contains('col') };
});
t('professor: a linha usa o formato de duas alturas', !!linha && linha.temCol);
t('professor: nome e ficha ocupam a largura toda', !!linha && linha.largura >= 98);
t('professor: os botões descem para a própria faixa', !!linha && linha.abaixo);
t('professor: os botões não estouram a linha', !!linha && linha.dentro);
const semQuebra = await p.evaluate(() => {
  /* nenhum nome de professor pode ficar espremido a ponto de quebrar */
  return [...document.querySelectorAll('#admDocList .nm')].every(x => x.getBoundingClientRect().width > 250);
});
t('professor: nenhum nome fica espremido pelos botões', semQuebra);
await el.screenshot({ path: S + '/o1-professores.png' });

/* ============ 2) TIPO DA TURMA COM NOME DE VERDADE ============ */
await jump('jumpControle', 'turmas'); await p.waitForTimeout(300);
const tipos = await p.evaluate(() => [...document.querySelectorAll('#admCtTipo option')].map(o => o.textContent));
t('tipo: as 4 opções são as certas',
  tipos.join('|') === 'Turma de nivelamento|Turma regular|Turma de questões|Matérias isoladas');
t('tipo: nenhum apelido (RONDESP/PATAMO/BOPE) vira nome de tipo',
  !tipos.some(x => /RONDESP|PATAMO|BOPE/.test(x)));
t('tipo: o valor guardado continua sendo o código da modalidade',
  (await p.evaluate(() => [...document.querySelectorAll('#admCtTipo option')].map(o => o.value).join('|'))) === 'RONDESP|PATAMO|BOPE|ISOLADA');
t('o apelido continua editável, e é dele que sai o nome',
  /Apelido/.test(await p.evaluate(() => document.getElementById('admCtApelido').placeholder)));

/* ============ 3) TURNO SAI DO HORÁRIO ============ */
t('não existe mais seletor de turno', await p.evaluate(() => !document.getElementById('admCtTurno')));
await set('admCtApelido', 'Alvorada');
await set('admCtConc', 'pcba');
await set('admCtIni', '2026-09-01'); await set('admCtFim', '2027-03-01');
await set('admCtH1i', '08:00'); await set('admCtH1f', '09:30'); await set('admCtH2f', '11:00');
t('o eco anuncia o turno lido do horário', /Turno: manhã \(pelo horário\)/.test(await T('admCtEco')));
await set('admCtH1i', '19:00'); await set('admCtH1f', '20:30'); await set('admCtH2f', '22:00');
t('mudar o horário muda o turno na hora', /Turno: noite/.test(await T('admCtEco')));
await set('admCtH1i', '14:00'); await set('admCtH1f', '15:30'); await set('admCtH2f', '17:00');
t('14h é tarde', /Turno: tarde/.test(await T('admCtEco')));
await set('admCtH1i', '08:00'); await set('admCtH1f', '09:30'); await set('admCtH2f', '11:00');
await set('admCtPrecoDmn', '900'); await set('admCtPrecoQdc', '1000');
await set('admCtVagas', '40'); await set('admCtVagasQdc', '5');
await set('admCtSala', 'Sala 3');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
const okT = await T('admCtErro');
t('a turma abre com o turno lido do horário (manhã)', /aberta/.test(okT) && /\(manhã\)/.test(okT));
t('o nome da turma é o apelido', /Turma Alvorada/.test(okT));
t('a lista guarda a turma como manhã, não como noite',
  /Turma Alvorada/.test(await T('admCtLista')) && /Turma Alvorada.{0,120}manhã/.test(await T('admCtLista')));
t('a ficha da turma nova diz o tipo por extenso', /Turma Alvorada.{0,60}Turma de nivelamento/.test(await T('admCtLista')));

/* matérias × árvore do edital: um concurso por vez, comparação exata */
const focos = await p.evaluate(() => [...document.querySelectorAll('#admCtConc option')].map(o => o.value));
let sincronizados = 0;
for (const f of focos) {
  await set('admCtConc', f); await p.waitForTimeout(120);
  const listadas = await p.evaluate(() => [...document.querySelectorAll('#admCtProfs .nm')].map(x => x.childNodes[0].textContent.trim()));
  const arv = await p.evaluate(i => window.__arvoreDe(i), f);
  if (arv && JSON.stringify(arv) === JSON.stringify(listadas)) sincronizados++;
}
t('todo concurso oferecido tem árvore de edital', focos.length > 0 && sincronizados === focos.length);
t('“Professores por matéria” repete exatamente a árvore do edital', sincronizados === focos.length);
await set('admCtConc', 'cfo'); await p.waitForTimeout(150);
t('trocar o concurso troca as matérias na hora',
  (await p.evaluate(() => document.querySelectorAll('#admCtProfs .nm').length)) === 13);

/* ============ 4) TURMAS ABERTAS: TUDO, COM EDITAR E APAGAR ============ */
const lista = await T('admCtLista');
t('a lista mostra as turmas que já vinham da coordenação',
  ['Turma RONDESP', 'Turma PATAMO', 'Turma BOPE', 'Turma RONDESP Manhã', 'Turma BOPE Manhã'].every(x => lista.indexOf(x) >= 0));
t('a lista mostra as isoladas que já vinham', /Isolada Dir. Administrativo/.test(lista) && /Isolada de Português/.test(lista));
t('cada turma tem botão de editar e de apagar',
  (await p.evaluate(() => document.querySelectorAll('#admCtLista [data-ed-ct]').length)) >= 5 &&
  (await p.evaluate(() => document.querySelectorAll('#admCtLista [data-rm-ct]').length)) >= 5);
t('cada isolada também', (await p.evaluate(() => document.querySelectorAll('#admCtLista [data-ed-iso]').length)) >= 2);
t('a turma com matrícula avisa quantos alunos tem', /Turma PATAMO.{0,40}1 matriculado/.test(lista));
await el.screenshot({ path: S + '/o1-turmas-abertas.png' });

/* editar uma turma que já existia */
await p.evaluate(() => document.querySelector('#admCtLista [data-ed-ct="rondesp-n"]').click());
await p.waitForTimeout(400);
const campos = await p.evaluate(() => ['admCtApelido', 'admCtIni', 'admCtFim', 'admCtH1i', 'admCtH1f', 'admCtH2f',
  'admCtPrecoDmn', 'admCtPrecoQdc', 'admCtVagas', 'admCtVagasQdc', 'admCtSala', 'admCtTipo'].reduce((a, i) => (a[i] = document.getElementById(i).value, a), {}));
t('editar traz o apelido para o campo', campos.admCtApelido === 'RONDESP');
t('editar traz o período', campos.admCtIni === '2026-08-03' && campos.admCtFim === '2027-02-01');
t('editar traz os dois tempos do horário', campos.admCtH1i === '19:00' && campos.admCtH1f === '20:30' && campos.admCtH2f === '22:00');
t('editar traz preços e vagas por moeda', campos.admCtPrecoDmn === '1800' && campos.admCtVagas === '145' && campos.admCtVagasQdc === '10');
t('editar traz a sala e o tipo', campos.admCtSala === 'Sala 1' && campos.admCtTipo === 'RONDESP');
t('o botão vira "Salvar alterações"', (await p.evaluate(() => document.getElementById('btnAdmCtAbrir').textContent)) === 'Salvar alterações');
t('aparece o "Cancelar edição"', await p.evaluate(() => document.getElementById('btnAdmCtCancelar').style.display !== 'none'));
await el.screenshot({ path: S + '/o1-editando.png' });
/* a própria sala não conta como choque consigo mesma */
await set('admCtPrecoDmn', '1950');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
t('salvar não acusa choque da turma com ela mesma', !/já tem/.test(await T('admCtErro')));
t('a confirmação diz "atualizada", não "aberta"', /atualizada/.test(await T('admCtErro')));
t('o preço novo entra na lista', /Turma RONDESP.{0,120}1\.950 Dmn/.test(await T('admCtLista')));
t('o botão volta a "Abrir turma"', (await p.evaluate(() => document.getElementById('btnAdmCtAbrir').textContent)) === 'Abrir turma');
t('o "Cancelar edição" some de novo', await p.evaluate(() => document.getElementById('btnAdmCtCancelar').style.display === 'none'));
t('não nasceu uma turma duplicada', (await T('admCtLista')).split('Turma RONDESP').length - 1 === 2);
/* editar uma turma de OUTRO turno e conferir na vitrine do aluno
   (a RONDESP é da noite, turno já ocupado por este aluno — o card dela
   mostra INDISPONÍVEL no lugar do preço)                              */
await p.evaluate(() => document.querySelector('#admCtLista [data-ed-ct="rondesp-m"]').click());
await p.waitForTimeout(300);
await set('admCtPrecoDmn', '640'); await set('admCtVagas', '70'); await set('admCtVagasQdc', '8');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
t('a 2ª edição também salva no lugar', /atualizada/.test(await T('admCtErro')));
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(600);
const cardM = await p.evaluate(() => { const x = document.querySelector('[data-turma="rondesp-m"]'); return x ? x.textContent.replace(/\s+/g, ' ') : ''; });
t('o preço editado já vale na Quad Store', /640 Dmn/.test(cardM));
t('as vagas editadas também (por moeda: 70 Dmn + 8 QdC)', /70 Dmn · 8 QdC/.test(cardM));
t('a turma editada não virou outra na vitrine', /Turma RONDESP Manhã/.test(cardM));

/* editar uma isolada */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await jump('jumpControle', 'turmas'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#admCtLista [data-ed-iso="iso-port"]').click());
await p.waitForTimeout(400);
t('editar isolada muda o tipo para ISOLADA', (await p.evaluate(() => document.getElementById('admCtTipo').value)) === 'ISOLADA');
t('editar isolada marca os dias dela',
  (await p.evaluate(() => [...document.querySelectorAll('#admCtDias .turno-chip.on')].map(x => x.dataset.dia).join())) === 'sábado');
t('editar isolada traz horário, sala e vagas', await p.evaluate(() =>
  document.getElementById('admCtH1i').value === '14:00' && document.getElementById('admCtSala').value === 'Sala 1' &&
  document.getElementById('admCtVagas').value === '25'));
await set('admCtVagas', '30');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
t('isolada salva no lugar, sem duplicar', /atualizada/.test(await T('admCtErro')) &&
  (await p.evaluate(() => document.querySelectorAll('#admCtLista [data-ed-iso]').length)) === 3);
t('as vagas novas da isolada entram na lista', /30 vagas/.test(await T('admCtLista')));

/* cancelar edição não altera nada */
await p.evaluate(() => document.querySelector('#admCtLista [data-ed-ct="bope-n"]').click());
await p.waitForTimeout(300);
await set('admCtPrecoDmn', '99');
await p.click('#btnAdmCtCancelar'); await p.waitForTimeout(300);
t('cancelar edição avisa que nada mudou', /cancelada/i.test(await T('admCtErro')));
t('cancelar edição preserva o preço antigo', /Turma BOPE.{0,120}2\.600 Dmn/.test(await T('admCtLista')));
t('cancelar limpa o formulário', await p.evaluate(() => document.getElementById('admCtApelido').value === ''));

/* apagar: turma com matrícula é protegida, turma livre sai */
await p.evaluate(() => document.querySelector('#admCtLista [data-rm-ct="patamo-n"]').click());
await p.waitForTimeout(300);
t('turma com matrícula ativa não é apagada', /estorne antes de remover/.test(await T('toast')) && /Turma PATAMO/.test(await T('admCtLista')));
await p.evaluate(() => document.querySelector('#admCtLista [data-rm-ct="bope-m"]').click());
await p.waitForTimeout(400);
t('turma sem matrícula é apagada da lista', !/Turma BOPE Manhã/.test(await T('admCtLista')));
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(600);
t('a turma apagada sai também da Quad Store',
  await p.evaluate(() => !document.querySelector('[data-turma="bope-m"]')));

console.log('\nvo1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
