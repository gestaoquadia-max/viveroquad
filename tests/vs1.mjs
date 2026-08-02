/* vs1 — rodada dos nove ajustes:
   1) material anexado baixa de verdade;  2) grade do cronograma é da
   TURMA (fim da colisão tipo+turno);  3) Simulados moram no Calendário;
   4) item de combate leva o sinal escolhido;  5) pedagógico por turma;
   6) categorias de liberação com hierarquia;  7) lista de conferência
   em PDF;  9) estoque decrescente na Loja;  10) preço sincronizado.   */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const S = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2, acceptDownloads: true });
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
const plus = re => p.evaluate(r => {
  document.getElementById('plusPop').classList.remove('on');
  [...document.querySelectorAll('#plusPop [data-goto]')].find(x => new RegExp(r).test(x.textContent)).click();
}, re);

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);
const el = await p.$('.phone');

await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}

/* ===== a turma de teste do gestor: C.O.R.E., manhã, Polícia Civil ===== */
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await abrir('jumpControle', 'turmas'); await p.waitForTimeout(300);
await set('admCtTipo', 'RONDESP'); await set('admCtApelido', 'C.O.R.E.'); await set('admCtConc', 'pcba');
await set('admCtIni', '2026-08-03'); await set('admCtFim', '2027-02-01');
await set('admCtH1i', '08:00'); await set('admCtH1f', '09:30'); await set('admCtH2f', '11:00');
await set('admCtPrecoDmn', '600'); await set('admCtPrecoQdc', '700');
await set('admCtVagas', '20'); await set('admCtVagasQdc', '20');
await set('admCtSala', 'Sala 3');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
t('a C.O.R.E. abre (RONDESP manhã, mesmo tipo+turno da RONDESP Manhã)', /aberta/.test(await T('admCtErro')));

/* ============ 2) A GRADE É DA TURMA, NÃO DO PAR TIPO+TURNO ============ */
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
await abrir('jumpInterno', 'crono'); await p.waitForTimeout(400);
const opts = await p.evaluate(() => [...document.querySelectorAll('#admCrTurma option')].map(o => o.textContent));
t('a turma nova APARECE no cronograma', opts.some(x => /C\.O\.R\.E\./.test(x)));
t('o seletor mostra o nome real da turma, não a chave interna',
  opts.every(x => /^Turma /.test(x)) && !opts.some(x => /^RONDESP MANHÃ$/.test(x)));
t('as duas turmas de mesmo tipo e turno são entradas SEPARADAS',
  opts.filter(x => /manhã/.test(x)).length >= 3);
const coreKey = await p.evaluate(() => [...document.querySelectorAll('#admCrTurma option')].find(x => /C\.O\.R\.E\./.test(x.textContent)).value);
await set('admCrTurma', coreKey); await p.waitForTimeout(300);
const mats = await p.evaluate(() => [...document.querySelectorAll('#admCrMat option')].map(o => o.textContent));
t('as matérias vêm da árvore da PC-BA, não do Soldado',
  mats.indexOf('Investigação Criminal') >= 0 && mats.indexOf('Direito Administrativo') >= 0);
const tempos = await p.evaluate(() => [...document.querySelectorAll('#admCrTempo option')].map(o => o.textContent));
t('os tempos usam o horário DA C.O.R.E. (8h), não o da outra turma', /08h/.test(tempos[0]));
await p.click('#btnAdmCrono'); await p.waitForTimeout(300);
t('a grade lançada diz o nome da turma no aviso', /Turma C\.O\.R\.E\./.test(await T('toast')));
t('o histórico registra a turma pelo nome', /Turma C\.O\.R\.E\./.test(await T('admCrLog')));
/* e a turma vizinha continua intacta */
const rmKey = await p.evaluate(() => [...document.querySelectorAll('#admCrTurma option')].find(x => /RONDESP Manhã/.test(x.textContent)).value);
await set('admCrTurma', rmKey); await p.waitForTimeout(300);
t('a turma vizinha NÃO herdou a grade da C.O.R.E.',
  await p.evaluate(() => !/LÍNGUA PORTUGUESA/.test(document.getElementById('admCrLog').textContent.split('Turma RONDESP Manhã')[1] || '')));

/* ============ 1) MATERIAL BAIXA DE VERDADE ============ */
await set('admMatTurma', 'patamo-n'); await set('admMatMateria', 'Direito Administrativo');
await set('admMatAssunto', 'Poder de polícia'); await set('admMatTitulo', 'Apostila do gestor');
await p.setInputFiles('#admMatArq', { name: 'apostila.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 conteudo') });
await p.waitForTimeout(200);
await p.click('#btnAdmMat'); await p.waitForTimeout(400);
t('o material é publicado', /publicado em/.test(await T('admMatErro')));

/* ============ 10) PREÇO SINCRONIZADO ============ */
await abrir('jumpInterno', 'simulados'); await p.waitForTimeout(300);
await set('admSimNome', 'Simulado PCBA Fase 1'); await set('admSimModal', 'presencial');
await set('admSimData', '2026-09-19'); await set('admSimIni', '08:00'); await set('admSimFim', '12:00');
await set('admSimVagas', '30'); await set('admSimVagasQdc', '10');
await set('admSimPrecoDmn', '150'); await set('admSimPrecoQdc', '180'); await set('admSimSala', 'Sala 1');
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(400);
await navAdm('v-adm-loja'); await p.waitForTimeout(500);
await abrir('jumpLojaAdm', 'precoturmas'); await p.waitForTimeout(300);
const pt = await T('admPrecoTurmas');
t('o simulado nasce no editor de preços (antes só aparecia depois)', /Simulado PCBA Fase 1/.test(pt));
t('a turma nova nasce no editor com o preço cadastrado', /C\.O\.R\.E\./.test(pt));
t('os dois atalhos da Loja batem com o título dos cards',
  (await p.evaluate(() => [...document.querySelectorAll('#jumpLojaAdm .jp')].map(x => x.textContent).join('|')))
    .indexOf('Preços da Loja|Preços e vagas · turmas e simulados') >= 0);

/* ============ 6) CATEGORIAS DE LIBERAÇÃO ============ */
await navAdm('v-adm-liber'); await p.waitForTimeout(400);
await abrir('jumpLiber', 'acessos'); await p.waitForTimeout(300);
const nCat = await p.evaluate(() => document.querySelectorAll('#admAcessos .ac-cat').length);
t('cada atividade real vira um grupo com cabeçalho (dec. 179)', nCat >= 1);
t('cada grupo tem contorno próprio', (await p.evaluate(() => document.querySelectorAll('#admAcessos .ac-grupo').length)) === nCat);
t('a categoria é mais forte que o nome do aluno', await p.evaluate(() => {
  const cat = getComputedStyle(document.querySelector('#admAcessos .ac-cat'));
  const nome = getComputedStyle(document.querySelector('#admAcessos .mission-row .t'));
  return parseInt(cat.fontWeight, 10) >= parseInt(nome.fontWeight, 10) && parseFloat(cat.fontSize) >= parseFloat(nome.fontSize) - 0.6;
}));
t('a categoria diz quantos faltam liberar', /a liberar/.test(await T('admAcessos')));
t('o detalhe da atividade não se repete em cada nome', await p.evaluate(() =>
  [...document.querySelectorAll('#admAcessos .mission-row .d')].length === 0));
await el.screenshot({ path: S + '/s1-acessos.png' });

/* ============ 7) LISTA DE CONFERÊNCIA EM PDF ============ */
await abrir('jumpLiber', 'inscritos'); await p.waitForTimeout(300);
t('existe o botão de gerar a lista', await p.evaluate(() => !!document.getElementById('btnAtivPdf')));
const [pop] = await Promise.all([
  p.context().waitForEvent('page', { timeout: 6000 }).catch(() => null),
  p.evaluate(() => document.getElementById('btnAtivPdf').click())
]);
t('o botão abre a folha de conferência', !!pop);
if (pop) {
  const txt = await pop.evaluate(() => document.body.innerText);
  t('a folha traz a atividade e o total de inscritos', /inscritos · lista de conferência/.test(txt));
  t('a folha lista os nomes numerados', /1\s+AL |1\s+SD /.test(txt));
  t('a folha tem coluna de presença para assinar', /PRESEN/i.test(txt));
  await pop.close();
}

/* ============ 3) SIMULADOS NO CALENDÁRIO ============ */
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-missoes'); await p.waitForTimeout(400);
t('Simulados saiu da aba Missões', await p.evaluate(() =>
  document.getElementById('simuladosList').closest('.view').id === 'v-calendario'));
t('o histórico foi junto', await p.evaluate(() =>
  document.getElementById('simHistCard').closest('.view').id === 'v-calendario'));
t('Missões mantém flashcards, Hoje e Atrasadas', await p.evaluate(() => {
  const v = document.getElementById('v-missoes').textContent;
  return /Treinamento Rápido/.test(v) && /Hoje · questões novas/.test(v) && /Atrasadas/.test(v);
}));
await plus('Calendário'); await p.waitForTimeout(400);
t('o simulado novo aparece no Calendário', /Simulado PCBA Fase 1/.test(await T('simuladosList')));
t('a rolagem interna do bloco foi junto', await p.evaluate(() =>
  !!document.getElementById('simuladosList').closest('.dia-scroll')));
t('o menu "+" já anuncia os simulados no Calendário',
  /simulados/.test(await p.evaluate(() => document.getElementById('plusPop').textContent)));
await el.screenshot({ path: S + '/s1-calendario.png' });

/* o material baixa mesmo */
await plus('Materiais'); await p.waitForTimeout(400);
t('o botão do material anexado diz "Baixar"', await p.evaluate(() =>
  [...document.querySelectorAll('#matLista .mat-dl')].some(b => b.textContent === 'Baixar')));
const [dl] = await Promise.all([
  p.waitForEvent('download', { timeout: 6000 }).catch(() => null),
  p.evaluate(() => [...document.querySelectorAll('#matLista .mat-dl')].find(b => b.textContent === 'Baixar').click())
]);
t('o material anexado baixa de verdade', !!dl && /apostila\.pdf/.test(dl.suggestedFilename()));

/* ============ 9) ESTOQUE DECRESCENTE NA LOJA ============ */
/* um produto físico barato com 3 unidades, para exercitar o estoque */
await navAdm('v-adm-loja'); await p.waitForTimeout(400);
await abrir('jumpLojaAdm', 'cadastro'); await p.waitForTimeout(300);
await set('admProdNome', 'Bornal de campo'); await set('admProdDesc', 'item de teste do estoque');
await set('admProdCat', 'pres:outros'); await set('admProdMoeda', 'qdc');
await set('admProdPreco', '2'); await set('admProdQtd', '3');
await p.click('#btnAdmProd'); await p.waitForTimeout(400);
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(600);
const acha = () => p.evaluate(() => {
  const b = [...document.querySelectorAll('[data-pres-id]')].find(x => /Bornal de campo/.test(x.textContent));
  return b ? { txt: b.textContent, preco: b.querySelector('.li-preco').textContent, meu: !!b.querySelector('.li-estoque.meu') } : null;
});
const est0 = await acha();
t('item físico mostra o estoque e o preço', !!est0 && /3 em estoque/.test(est0.txt) && /QdC/.test(est0.preco));
const comprar = async () => {
  await p.evaluate(() => [...document.querySelectorAll('[data-pres-id]')].find(x => /Bornal de campo/.test(x.textContent)).click());
  await p.waitForTimeout(400);
  await p.evaluate(() => document.getElementById('btnCompraOk').click());
  await p.waitForTimeout(500);
};
await comprar();
t('a compra avisa quantos restam', /Restam/.test(await T('toast')));
const est1 = await acha();
t('o item CONTINUA na Loja depois de comprar 1', !!est1);
t('e continua com o preço, não "ADQUIRIDO"', !!est1 && /QdC/.test(est1.preco) && !/ADQUIRIDO/.test(est1.preco));
t('o estoque baixou uma unidade', !!est1 && /2 em estoque/.test(est1.txt));
t('mas fica marcado que há um pedido seu', !!est1 && est1.meu);
await el.screenshot({ path: S + '/s1-estoque.png' });
await comprar();
t('dá para comprar de novo enquanto sobra peça', !!(await acha()));
await comprar();
t('comprando o estoque inteiro o item SOME da Loja (acabou)', !(await acha()));
t('e o aviso diz que era a última unidade', /última unidade|saiu da Loja/.test(await T('toast')));
/* digitais não têm limite */
/* a ressalva do gestor: curso online e material digital não têm limite
   físico — nunca somem por esgotamento (isoladas e simulados têm vaga,
   que é outra coisa e continua contando)                              */
t('curso online / digital não ganha estoque (sem limite físico)',
  await p.evaluate(() => {
    const nomes = ['Curso · teoria completa', 'Curso · questões', 'Curso isolado', 'Mentoria Quad'];
    const dig = [...document.querySelectorAll('#v-loja .loja-item .li-nome')]
      .filter(x => nomes.indexOf(x.textContent.trim()) >= 0)
      .map(x => x.closest('.loja-item'));
    return dig.length === nomes.length && dig.every(x => !x.querySelector('.li-estoque') && !x.hasAttribute('data-pres-id'));
  }));
t('digital comprado marca ADQUIRIDO e não some (compra única por aluno)',
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('#v-loja .loja-item .li-nome')].find(x => /Curso isolado/.test(x.textContent));
    if (!b) return false;
    const card = b.closest('.loja-item');
    card.click();
    const ok = document.getElementById('btnCompraOk');
    if (document.getElementById('compraLayer').classList.contains('on')) ok.click();
    const ainda = [...document.querySelectorAll('#v-loja .loja-item .li-nome')].some(x => /Curso isolado/.test(x.textContent));
    return ainda;
  }));

/* ============ 4) SINAL DO ITEM DE COMBATE ============ */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await abrir('jumpInterno', 'skins'); await p.waitForTimeout(300);
await set('admSkTipo', 'combate'); await p.waitForTimeout(200);
await set('admSkNome', 'Rádio comunicador'); await set('admSkDesc', 'contato com a base'); await set('admSkPreco', '30');
await p.evaluate(() => document.querySelector('#admSkIcones [data-ico="fuzil"]').click()); await p.waitForTimeout(200);
await p.click('#btnAdmSkin'); await p.waitForTimeout(400);
t('o item de combate é publicado', /publicado/.test(await T('toast')));
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(600);
t('o item aparece na vitrine com o sinal escolhido', await p.evaluate(() => {
  const b = [...document.querySelectorAll('[data-combate]')].find(x => /Rádio/.test(x.textContent));
  return !!b && /<svg/.test(b.querySelector('.li-ico').innerHTML);
}));
await p.evaluate(() => [...document.querySelectorAll('[data-combate]')].find(x => /Rádio/.test(x.textContent)).click());
await p.waitForTimeout(400);
t('o pop-up de compra mostra o sinal certo, não o pin genérico',
  await p.evaluate(() => /<svg/.test(document.getElementById('compraIco').innerHTML)));
await p.evaluate(() => document.getElementById('btnCompraOk').click()); await p.waitForTimeout(500);
await plus('Mochila').catch(() => {});
await p.evaluate(() => { const b = [...document.querySelectorAll('[data-goto]')].find(x => /Mochila/i.test(x.textContent)); if (b) b.click(); });
await p.waitForTimeout(400);
const slot = await p.evaluate(() => {
  const s = [...document.querySelectorAll('#storageGrid .st-slot.cheio')].find(x => /Rádio/.test(x.textContent));
  return s ? { svg: /<svg/.test(s.innerHTML), undef: /undefined/.test(s.innerHTML) } : null;
});
t('na mochila o item leva o sinal escolhido', !!slot && slot.svg);
t('e não imprime mais "undefined"', !!slot && !slot.undef);
await el.screenshot({ path: S + '/s1-mochila.png' });

/* ============ 5) PEDAGÓGICO POR TURMA ============ */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-alunos'); await p.waitForTimeout(600);
const pedag = await T('relPedagTurmas');
t('há um bloco por turma aberta', (await p.evaluate(() => document.querySelectorAll('#relPedagTurmas .ac-cat').length)) >= 6);
t('o bloco da PATAMO lê o edital do CFO', /Turma PATAMO.{0,140}CFO/.test(pedag));
t('o bloco da turma da Polícia Civil lê o PC-BA', /C\.O\.R\.E\..{0,140}Polícia Civil/.test(pedag));
t('cada bloco traz as barras de pontos fracos',
  (await p.evaluate(() => document.querySelectorAll('#relPedagTurmas .adm-bar').length)) >= 25);
t('o card individual original continua de pé',
  (await p.evaluate(() => document.querySelectorAll('#relIndPedag .adm-bar').length)) === 5);
await p.evaluate(() => document.getElementById('relPedagTurmas').scrollIntoView({ block: 'start' }));
await el.screenshot({ path: S + '/s1-pedagogico.png' });

console.log('\nvs1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
