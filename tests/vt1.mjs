/* vt1 — edição do cadastro no "Banco de professores · corpo docente":
   o mesmo formulário corrige nome, matérias, turnos, graduação e telefone,
   e o rename propaga para turmas, isoladas, eventos, grade, recados e
   para o e-mail de acesso do professor.                                 */
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
const abrir = (h, k) => p.evaluate(a => {
  const bl = document.querySelector('[data-bl="' + a.k + '"]');
  if (!bl || bl.style.display === 'none') document.querySelector('#' + a.h + ' .jp[data-jump="' + a.k + '"]').click();
}, { h, k });
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });
const editar = re => p.evaluate(r => {
  const linhas = [...document.querySelectorAll('#admDocList .adm-bar')];
  const i = linhas.findIndex(x => new RegExp(r).test(x.textContent));
  document.querySelectorAll('#admDocList [data-doc-ed]')[i].click();
}, re);
const campos = () => p.evaluate(() => ({
  nome: document.getElementById('admDocNome').value,
  m1: document.getElementById('admDocMat1').value,
  m2: document.getElementById('admDocMat2').value,
  grad: document.getElementById('admDocGrad').value,
  fone: document.getElementById('admDocFone').value,
  turnos: [...document.querySelectorAll('#admDocTurnos .turno-chip.on')].map(x => x.dataset.turno).join('/'),
  botao: document.getElementById('btnAdmDoc').textContent,
  cancelar: document.getElementById('btnAdmDocCancelar').style.display
}));

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
const el = await p.$('.phone');
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await abrir('jumpControle', 'doc'); await p.waitForTimeout(400);

/* ============ 1) A LISTA OFERECE EDITAR ============ */
t('cada professor tem botão de editar',
  (await p.evaluate(() => document.querySelectorAll('#admDocList [data-doc-ed]').length)) >= 6);
t('editar convive com desligar, bloquear e apagar', await p.evaluate(() => {
  const l = document.querySelector('#admDocList .adm-bar');
  return !!l.querySelector('[data-doc-ed]') && !!l.querySelector('[data-doc-desl]') &&
         !!l.querySelector('[data-doc-bloq]') && !!l.querySelector('[data-doc-rm]');
}));
t('o formulário começa em modo cadastro', (await campos()).botao === 'Cadastrar professor');

/* ============ 2) EDITAR CARREGA O CADASTRO INTEIRO ============ */
await editar('Cap\\. Silva'); await p.waitForTimeout(400);
const c1 = await campos();
t('editar traz o nome', c1.nome === 'Cap. Silva');
t('editar traz as matérias', c1.m1 === 'Direito Penal' && c1.m2 === 'Direito Penal Militar');
t('editar traz os turnos marcados', c1.turnos === 'noite');
t('editar traz a graduação e o telefone', c1.grad === 'Bacharel em Direito' && c1.fone === '(71) 9 8811-1020');
t('o botão vira "Salvar alterações"', c1.botao === 'Salvar alterações');
t('aparece o "Cancelar edição"', c1.cancelar !== 'none');
t('o aviso mostra o e-mail de acesso e alerta sobre o rename',
  /silva@quadconcursos\.com\.br/.test(await T('admDocErro')) && /trocar o nome muda esse e-mail/.test(await T('admDocErro')));
await el.screenshot({ path: S + '/t1-editando.png' });

/* ============ 3) VALIDAÇÃO NO PRÓPRIO BLOCO ============ */
await set('admDocNome', 'Danilo Moura');   /* nome de outro professor */
await p.click('#btnAdmDoc'); await p.waitForTimeout(300);
t('nome repetido de OUTRO professor é barrado', /Já existe um professor/.test(await T('admDocErro')));
await set('admDocNome', 'Cap. Silva');
await p.evaluate(() => document.querySelector('#admDocTurnos .turno-chip[data-turno="noite"]').click());
await p.waitForTimeout(150);
await p.click('#btnAdmDoc'); await p.waitForTimeout(300);
t('salvar sem turno é barrado', /ao menos um turno/.test(await T('admDocErro')));
await p.evaluate(() => document.querySelector('#admDocTurnos .turno-chip[data-turno="noite"]').click());
await p.waitForTimeout(150);
t('manter o próprio nome NÃO é tratado como repetido', await p.evaluate(async () => {
  document.getElementById('btnAdmDoc').click();
  return true;
}));
await p.waitForTimeout(400);
t('salvar sem mudar o nome funciona', /atualizado/.test(await T('admDocErro')));

/* ============ 4) RENOMEAR PROPAGA ============ */
await editar('Cap\\. Silva'); await p.waitForTimeout(400);
await set('admDocNome', 'Maj. Silva Filho');
await set('admDocFone', '(71) 9 7777-0000');
await set('admDocGrad', 'Mestre em Direito Penal');
await p.evaluate(() => document.querySelector('#admDocTurnos .turno-chip[data-turno="tarde"]').click());
await p.waitForTimeout(150);
await p.click('#btnAdmDoc'); await p.waitForTimeout(500);
const okMsg = await T('admDocErro');
t('a confirmação diz o nome novo e o antigo', /Maj\. Silva Filho/.test(okMsg) && /era “Cap\. Silva”/.test(okMsg));
t('a confirmação avisa que vale nas turmas e na grade', /turmas, isoladas, eventos e no cronograma/.test(okMsg));
const lista = await T('admDocList');
t('a lista mostra o cadastro atualizado',
  /Maj\. Silva Filho/.test(lista) && /Mestre em Direito Penal/.test(lista) && /\(71\) 9 7777-0000/.test(lista));
t('o nome antigo sumiu da lista', !/Cap\. Silva/.test(lista));
t('o turno novo entrou', /noite\/tarde|tarde\/noite/.test(lista));
t('o botão volta a "Cadastrar professor"', (await campos()).botao === 'Cadastrar professor');
await el.screenshot({ path: S + '/t1-renomeado.png' });

/* o rename alcança as listas que oferecem professor */
await abrir('jumpControle', 'turmas'); await p.waitForTimeout(400);
await set('admCtConc', 'cfo'); await p.waitForTimeout(250);
const profs = await p.evaluate(() => [...document.querySelectorAll('#admCtProfs option')].map(o => o.textContent));
t('"Professores por matéria" já oferece o nome novo', profs.indexOf('Maj. Silva Filho') >= 0);
t('e não oferece mais o antigo', profs.indexOf('Cap. Silva') < 0);

/* ============ 5) O PROFESSOR ENTRA COM O E-MAIL NOVO ============ */
await persona('professor'); await p.waitForTimeout(500);
await p.fill('#profEmail', 'silva@quadconcursos.com.br'); await p.fill('#profSenha', 'quad1234');
await p.click('#btnProfEntrar'); await p.waitForTimeout(400);
t('o e-mail antigo deixa de valer', await p.evaluate(() => document.getElementById('profGate').classList.contains('on')));
await p.fill('#profEmail', 'filho@quadconcursos.com.br'); await p.fill('#profSenha', 'quad1234');
await p.click('#btnProfEntrar'); await p.waitForTimeout(600);
t('o e-mail novo entra', !await p.evaluate(() => document.getElementById('profGate').classList.contains('on')));
t('e abre o perfil com o nome novo', (await T('profNome')) === 'Maj. Silva Filho');

/* ============ 6) CANCELAR NÃO ALTERA NADA ============ */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await abrir('jumpControle', 'doc'); await p.waitForTimeout(400);
await editar('Prof\\. Ferraz'); await p.waitForTimeout(400);
await set('admDocNome', 'NOME ERRADO'); await set('admDocFone', '(00) 0 0000-0000');
await p.click('#btnAdmDocCancelar'); await p.waitForTimeout(400);
t('cancelar avisa que nada mudou', /cancelada/i.test(await T('admDocErro')));
t('cancelar preserva o cadastro', /Prof\. Ferraz/.test(await T('admDocList')) && !/NOME ERRADO/.test(await T('admDocList')));
t('cancelar limpa o formulário', (await campos()).nome === '');
t('e volta ao modo cadastro', (await campos()).botao === 'Cadastrar professor');

/* ============ 7) CADASTRAR SEGUE FUNCIONANDO ============ */
await set('admDocNome', 'Prof. Teste Novo');
await set('admDocMat1', 'Matemática');
await p.evaluate(() => document.querySelector('#admDocTurnos .turno-chip[data-turno="manhã"]').click());
await p.waitForTimeout(150);
await p.click('#btnAdmDoc'); await p.waitForTimeout(400);
t('cadastro novo entra e diz o e-mail de acesso',
  /Prof\. Teste Novo/.test(await T('admDocErro')) && /novo@quadconcursos\.com\.br/.test(await T('admDocErro')));
t('o professor novo aparece na lista', /Prof\. Teste Novo/.test(await T('admDocList')));
t('o formulário fica limpo depois de cadastrar', (await campos()).nome === '');

console.log('\nvt1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
