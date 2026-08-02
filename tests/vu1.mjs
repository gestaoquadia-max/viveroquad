/* vu1 — rodada: pronome da personagem, intro some quando feita, lotação
   por sala (155/85/125/185), portaria sincronizada + consumo mata o
   estorno, e comunicação interna por público.                          */
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

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);
const el = await p.$('.phone');

/* ============ 1) PRONOME DA PERSONAGEM ============ */
const pron = await p.evaluate(() => {
  /* reproduz a lógica do passo do tutorial para os 12 rótulos */
  const labs = [];
  for (let i = 0; i < 12; i++) {
    const lb = window.__avLabel ? window.__avLabel(i) : null;
    labs.push(lb);
  }
  return labs;
});
t('há um hook de rótulo do avatar para conferir', pron.every(x => typeof x === 'string' && x.length > 0));
t('mulher recebe "Essa", homem recebe "Esse"', await p.evaluate(() => {
  for (let i = 0; i < 12; i++) {
    const lb = window.__avLabel(i);
    const esperado = /^Mulher/.test(lb) ? 'Essa' : 'Esse';
    if (window.__avPergunta(i).indexOf(esperado + ' ') !== 0) return false;
  }
  return true;
}));
t('o botão de confirmação não diz mais "é esse"', await p.evaluate(() => window.__avBotao() === 'Sim, sou eu!'));

/* ============ 2) INTRO SOME QUANDO FEITA ============ */
await nav('v-missoes'); await p.waitForTimeout(400);
t('pendente, a Introdução aparece no bloco', await p.evaluate(() => document.getElementById('blocoIntroRow').style.display !== 'none'));
await p.evaluate(() => window.__introFeita(true)); await p.waitForTimeout(200);
t('concluída, a linha SOME do bloco (nada de "FEITA · DA CONTA")',
  await p.evaluate(() => document.getElementById('blocoIntroRow').style.display === 'none'));
t('os blocos do dia continuam lá', /Bloco 1/.test(await T('diaList')));
await p.evaluate(() => window.__introFeita(false));

/* ============ 3) LOTAÇÃO POR SALA ============ */
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await abrir('jumpControle', 'salas'); await p.waitForTimeout(300);
const mapa = await T('admSalasMapa');
t('o mapa diz a lotação de cada sala (155/85/125/185)',
  /Sala 1 · 155 lugares/.test(mapa) && /Sala 2 · 85 lugares/.test(mapa) &&
  /Sala 3 · 125 lugares/.test(mapa) && /Sala 4 · 185 lugares/.test(mapa));
/* turma não pode pedir mais vagas que a sala comporta */
await abrir('jumpControle', 'turmas'); await p.waitForTimeout(300);
await set('admCtTipo', 'RONDESP'); await set('admCtApelido', 'Cheia'); await set('admCtConc', 'pcba');
await set('admCtIni', '2026-09-01'); await set('admCtFim', '2027-03-01');
await set('admCtH1i', '14:00'); await set('admCtH1f', '15:30'); await set('admCtH2f', '17:00');
await set('admCtPrecoDmn', '600'); await set('admCtPrecoQdc', '700');
await set('admCtVagas', '80'); await set('admCtVagasQdc', '10');
await set('admCtSala', 'Sala 2');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(300);
t('90 vagas na Sala 2 (85) é barrado com o número na cara',
  /comporta <\/?b?>?85/.test(await p.evaluate(() => document.getElementById('admCtErro').innerHTML)) &&
  /90 vagas/.test(await T('admCtErro')));
await set('admCtVagas', '70');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
t('80 vagas na Sala 2 passa', /aberta/.test(await T('admCtErro')));
/* evento presencial herda a lotação da sala */
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await abrir('jumpInterno', 'eventos'); await p.waitForTimeout(300);
await set('admEvNovoNome', 'Aulão da Lotação'); await set('admEvNovoTipo', 'pago');
await set('admEvNovoMoeda', 'qdc'); await set('admEvNovoPreco', '50');
await set('admEvNovoData', '2026-09-20'); await set('admEvNovoInicio', '18:00'); await set('admEvNovoFim', '20:00');
await set('admEvSala', 'Sala 2');
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
t('a confirmação do evento diz os lugares da sala', /85 lugares/.test(await T('admEvErro')));
const evId = await p.evaluate(() => { const e = window.__eventos().find(x => x.nome === 'Aulão da Lotação'); return e ? e.id : null; });
t('o evento nasce com lot = lotação da sala', await p.evaluate(i => {
  const e = window.__eventos().find(x => x.id === i); return e && e.lot === 85;
}, evId));
/* na Loja: o card mostra os lugares; lotado → LOTADO e compra barrada */
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(500);
t('o card do evento mostra os lugares restantes',
  /85 lugares/.test(await p.evaluate(i => { const x = document.querySelector('[data-ev-buy="' + i + '"]'); return x ? x.textContent : ''; }, evId)));
await p.evaluate(i => window.__evLotar(i, 85), evId); await p.waitForTimeout(300);
const cardLot = await p.evaluate(i => { const x = document.querySelector('[data-ev-buy="' + i + '"]'); return x ? { txt: x.textContent, ind: x.classList.contains('indisponivel') } : null; }, evId);
t('lotado: o card vira LOTADO e fica indisponível', !!cardLot && /LOTADO/.test(cardLot.txt) && cardLot.ind);
await p.evaluate(i => document.querySelector('[data-ev-buy="' + i + '"]').click(), evId); await p.waitForTimeout(300);
t('a compra é barrada com a lotação na mensagem', /comporta 85/.test(await T('toast')));
await nav('v-inicio'); await p.waitForTimeout(400);
t('o carrossel marca LOTADO', await p.evaluate(i => {
  const tile = [...document.querySelectorAll('.ev-tile[data-ev="' + i + '"]')][0];
  return tile && /LOTADO/.test(tile.textContent);
}, evId));
await p.evaluate(i => window.__evLotar(i, 0), evId); await p.waitForTimeout(200);

/* ============ 4+5) PORTARIA SINCRONIZADA + CONSUMO MATA O ESTORNO ============ */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-liber'); await p.waitForTimeout(400);
await abrir('jumpLiber', 'acessos'); await p.waitForTimeout(300);
const ac0 = await T('admAcessos');
t('a atividade fictícia (Aniversário do Quad) sumiu', !/Aniversário/.test(ac0));
t('o evento recém-criado aparece na portaria', /Aulão da Lotação/.test(ac0));
t('cada grupo diz quando, onde e a lotação', /Sala 2/.test(ac0) && /85 lugares/.test(ac0));
t('o aluno da demo ainda NÃO está lá (não comprou)', !/você/.test(ac0));
/* o aluno compra → entra na portaria e na janela de estorno */
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(500);
await p.evaluate(i => document.querySelector('[data-ev-buy="' + i + '"]').click(), evId); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.getElementById('btnCompraOk'); if (document.getElementById('compraLayer').classList.contains('on')) b.click(); });
await p.waitForTimeout(500);
t('compra confirmada', /comprado/.test(await T('toast')));
t('a compra entra na janela de estorno', /Aulão da Lotação/.test(await T('lojaEstornos')));
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-liber'); await p.waitForTimeout(400);
t('o aluno aparece na portaria do evento após comprar', /você/.test(await T('admAcessos')));
await el.screenshot({ path: S + '/u1-portaria.png' });
await p.evaluate(() => {
  const r = [...document.querySelectorAll('#admAcessos .mission-row')].find(x => /você/.test(x.textContent));
  r.querySelector('button').click();
});
await p.waitForTimeout(400);
t('liberar avisa que a compra saiu da janela de estorno', /saiu da janela de estorno/.test(await T('toast')));
await persona('aluno'); await p.waitForTimeout(300);
await nav('v-loja'); await p.waitForTimeout(400);
t('consumiu (entrou na sala): o estorno some', !/Aulão da Lotação/.test(await T('lojaEstornos')));
/* produto físico: entregar também consome */
await p.evaluate(() => { const x = [...document.querySelectorAll('.loja-item[data-pres-id]')].find(i => /Garrafinha/.test(i.textContent)); x.click(); });
await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.getElementById('btnCompraOk'); if (document.getElementById('compraLayer').classList.contains('on')) b.click(); });
await p.waitForTimeout(400);
t('garrafinha comprada entra no estorno', /Garrafinha/.test(await T('lojaEstornos')));
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-liber'); await p.waitForTimeout(300);
await abrir('jumpLiber', 'fisicos'); await p.waitForTimeout(300);
await p.evaluate(() => {
  const bt = [...document.querySelectorAll('#admPedidosList [data-ped]')].find(x => /Garrafinha/.test(x.closest('.mission-row, .adm-bar, div').textContent));
  (bt || document.querySelector('#admPedidosList [data-ped]')).click();
});
await p.waitForTimeout(400);
await persona('aluno'); await p.waitForTimeout(300);
await nav('v-loja'); await p.waitForTimeout(400);
t('entregue na recepção: a garrafinha sai do estorno', !/Garrafinha Quad · 90|Garrafinha/.test(await p.evaluate(() => {
  /* só a compra de AGORA deve ter sumido; a antiga (há 8 dias, prazo vencido) não está na lista de estornáveis ativos */
  return [...document.querySelectorAll('#lojaEstornos .mission-row')]
    .filter(r => /FALTAM|ÚLTIMO DIA/.test(r.textContent)).map(r => r.textContent).join(' | ');
})));

/* ============ 6) COMUNICAÇÃO POR PÚBLICO ============ */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await abrir('jumpControle', 'msg'); await p.waitForTimeout(300);
const tipos = await p.evaluate(() => [...document.querySelectorAll('#admMsgTipo option')].map(o => o.value));
t('os públicos existem: aluno, prof, turma, isolada, simulado, evento, todos',
  ['aluno', 'prof', 'turma', 'isolada', 'simulado', 'evento', 'todos'].every(x => tipos.indexOf(x) >= 0));
await set('admMsgTipo', 'turma'); await p.waitForTimeout(200);
t('escolher "turma" lista as turmas com o nº de alunos',
  /Turma PATAMO · \d+ alunos/.test(await p.evaluate(() => document.getElementById('admMsgAluno').textContent)));
await set('admMsgAluno', 'patamo-n');
await set('admMsgTexto', 'Aula antecipada para 18h');
await p.click('#btnAdmMsg'); await p.waitForTimeout(300);
t('o envio diz o público e o alcance', /Turma PATAMO/.test(await T('toast')) && /alcança \d+ alunos/.test(await T('toast')));
t('a mensagem entra no log com o alcance', /Turma PATAMO · \d+ alunos/.test(await T('admMsgList')));
await set('admMsgTipo', 'simulado'); await p.waitForTimeout(200);
t('"simulado" lista os simulados de pé', (await p.evaluate(() => document.querySelectorAll('#admMsgAluno option').length)) >= 1);
await set('admMsgTipo', 'todos'); await p.waitForTimeout(200);
await set('admMsgTexto', 'Manutenção programada no domingo');
await p.click('#btnAdmMsg'); await p.waitForTimeout(300);
t('"todos" alcança a plataforma inteira', /1\.286/.test(await T('toast')));
/* o aluno da demo está nos dois públicos: as duas chegam no chat */
await persona('aluno'); await p.waitForTimeout(400);
await p.evaluate(() => document.getElementById('btnPlus').click()); await p.waitForTimeout(200);
await p.evaluate(() => document.getElementById('rowChat').click()); await p.waitForTimeout(400);
const chat = await p.evaluate(() => document.getElementById('chatLayer').textContent.replace(/\s+/g, ' '));
t('a mensagem da turma chegou no chat, com o público na frente', /\[Turma PATAMO\] Aula antecipada para 18h/.test(chat));
t('a mensagem de todos também', /\[Todos os alunos da plataforma\] Manutenção programada/.test(chat));

console.log('\nvu1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
