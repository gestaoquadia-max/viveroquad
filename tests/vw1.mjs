/* vw1 — Decisões Administrativas DA-01 a DA-10 no protótipo:
   ledger da carteira (DA-03), IDs internos e nome de guerra repetível
   (DA-01/DA-04), turma arquivada (DA-06), perfis administrativos com
   autoria (DA-08) e persistência da evolução do aluno (DA-10).        */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
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

await p.addInitScript(() => { try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {} });
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);

/* ============ DA-03 · LEDGER: nenhuma moeda se move sem lançamento ============ */
await nav('v-loja'); await p.waitForTimeout(500);
const ext0 = await T('extList');
t('o extrato da carteira existe e abre com os saldos de abertura',
  /saldo de abertura/.test(ext0) && /QdC/.test(ext0) && /Dmn/.test(ext0));
t('cada lançamento traz autor e saldo resultante', /autor:/.test(ext0) && /saldo depois:/.test(ext0));
const ledger0 = await p.evaluate(() => window.__ledger().length);
/* gift card → lançamento com origem e autor da recepção */
await p.fill('#giftCode', 'QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(400);
const extGift = await T('extList');
t('gift card gera lançamento com origem e autor',
  /gift card · QUAD-500/.test(extGift) && /autor: recepção/.test(extGift) && /\+500 Dmn/.test(extGift));
t('o saldo resultante do lançamento bate com a carteira',
  await p.evaluate(() => { const m = window.__ledger()[0]; return m.moeda === 'dmn' && m.saldo === parseInt(document.getElementById('lojaSaldoDmn').textContent.replace(/\D/g, ''), 10); }));
/* compra → lançamento de débito identificando o item */
const saldoAntes = await p.evaluate(() => parseInt(document.getElementById('lojaSaldo').textContent.replace(/\D/g, ''), 10));
await p.evaluate(() => document.querySelector('[data-combate]')?.click()); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.getElementById('btnCompraOk'); if (document.getElementById('compraLayer').classList.contains('on')) b.click(); });
await p.waitForTimeout(400);
const extCompra = await T('extList');
t('a compra vira lançamento de débito com o nome do item',
  /compra ·/.test(extCompra) && /para Quad Store/.test(extCompra));
t('o débito reduziu o saldo e o lançamento registra o novo saldo',
  await p.evaluate(s => { const m = window.__ledger()[0]; return m.valor < 0 && m.saldo < s; }, saldoAntes));
t('o extrato cresceu a cada operação', (await p.evaluate(() => window.__ledger().length)) > ledger0 + 1);
/* filtros por moeda */
await p.evaluate(() => document.querySelector('#extTabs [data-ext="dmn"]').click()); await p.waitForTimeout(200);
t('o filtro por Diamantes mostra só Dmn', !/QdC/.test(await T('extList')));
await p.evaluate(() => document.querySelector('#extTabs [data-ext="tudo"]').click()); await p.waitForTimeout(200);

/* ============ DA-01/DA-04 · IDENTIDADE ============ */
t('o aluno tem ID interno imutável', await p.evaluate(() => /^AL-\d{5}$/.test(window.__ids().aluno)));
t('cada lançamento do ledger tem ID próprio', await p.evaluate(() => window.__ledger().every(m => /^MV-\d{5}$|^MV-0000[01]$/.test(m.id))));

/* ============ DA-06 · TURMA ARQUIVADA ============ */
await p.click('#btnAvatarPerfil'); await p.waitForTimeout(500);
const turmas = await T('minhasTurmasList');
t('a turma encerrada aparece ARQUIVADA (não some)', /ARQUIVADA/.test(turmas) && /RONDESP/i.test(turmas));
t('a turma arquivada explica que o histórico fica preservado',
  /curso encerrado em/.test(turmas) && /histórico preservado/.test(turmas));
t('a turma vigente continua marcada EM USO', /EM USO/.test(turmas));

/* ============ DA-10 · PERSISTÊNCIA DA EVOLUÇÃO ============ */
const antesF5 = await p.evaluate(() => ({ score: window.__carteira().score, dmn: window.__carteira().diamantes, mochila: window.__carteira().mochila, lanc: window.__ledger().length }));
await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(1200);
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(500);
const depoisF5 = await p.evaluate(() => ({ score: window.__carteira().score, dmn: window.__carteira().diamantes, mochila: window.__carteira().mochila, lanc: window.__ledger().length }));
t('as moedas sobrevivem ao recarregar', depoisF5.score === antesF5.score && depoisF5.dmn === antesF5.dmn);
t('a mochila sobrevive ao recarregar', depoisF5.mochila === antesF5.mochila);
t('o extrato sobrevive ao recarregar', depoisF5.lanc === antesF5.lanc);
t('a tela mostra o saldo restaurado, não o de fábrica',
  (await p.evaluate(() => parseInt(document.getElementById('dmnVal').textContent.replace(/\D/g, ''), 10))) === depoisF5.dmn);

/* ============ DA-08 · PERFIS ADMINISTRATIVOS ============ */
await persona('admin'); await p.waitForTimeout(400);
t('o portão do admin pede o perfil de acesso', await p.evaluate(() => !!document.getElementById('admPerfil')));
await p.fill('#admEmail', 'recepcao@quadconcursos.com.br');
await p.selectOption('#admPerfil', 'recepcao');
await p.fill('#admChave', 'NPP-2026');
await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
t('o acesso confirma o perfil escolhido', /perfil Recepção/.test(await T('toast')));
const abasRec = await p.evaluate(() => [...document.querySelectorAll('#navAdmin .nav-btn')].filter(b => b.style.display !== 'none').map(b => b.dataset.view));
t('Recepção vê só as abas da sua responsabilidade',
  abasRec.indexOf('v-adm-liber') >= 0 && abasRec.indexOf('v-adm-controle') < 0 && abasRec.indexOf('v-adm-loja') < 0);
/* troca de perfil pelo hook: Direção vê tudo */
await p.evaluate(() => window.__admPerfil('direcao')); await p.waitForTimeout(300);
const abasDir = await p.evaluate(() => [...document.querySelectorAll('#navAdmin .nav-btn')].filter(b => b.style.display !== 'none').map(b => b.dataset.view));
t('Direção enxerga todas as abas', abasDir.length === 5);
t('o painel mostra o perfil de quem está operando', /Direção/.test(await T('admPerfilChip')));
/* crédito manual assina o autor no ledger (DA-03 + DA-08) */
await p.evaluate(() => document.querySelector('#navAdmin .nav-btn[data-view="v-adm-controle"]').click());
await p.waitForTimeout(400);
await p.evaluate(() => { const bl = document.querySelector('[data-bl="contas"]'); if (!bl || bl.style.display === 'none') document.querySelector('#jumpControle .jp[data-jump="contas"]')?.click(); });
await p.waitForTimeout(300);
const creditou = await p.evaluate(() => {
  const sel = document.getElementById('admCredAluno'); if (!sel) return false;
  sel.value = sel.options[0].value;
  document.getElementById('admCredMoeda').value = 'qdc';
  document.getElementById('admCredValor').value = '75';
  document.getElementById('admCredMotivo').value = 'ajuste de campanha';
  document.getElementById('btnAdmCred').click();
  return true;
});
await p.waitForTimeout(400);
if (creditou) {
  const l = await p.evaluate(() => window.__ledger()[0]);
  t('o crédito manual entra no ledger com motivo e autor',
    /crédito manual/.test(l.tipo) && /ajuste de campanha/.test(l.tipo) && /Direção/.test(l.autor));
} else { t('o crédito manual entra no ledger com motivo e autor', false); }

console.log('\nvw1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
