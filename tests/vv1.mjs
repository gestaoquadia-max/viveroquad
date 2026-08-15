/* vv1 — rodada: CONCLUÍDO/FALTOSO no calendário, evento realizado fora do
   estorno, boina do tutorial sem estorno, e o sistema de DROP de itens
   (disp venda/drop/ambos + % de chance; sorteio ao concluir bloco,
   treinamento ou simulado digital).                                    */
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
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const plus = re => p.evaluate(r => {
  document.getElementById('plusPop').classList.remove('on');
  [...document.querySelectorAll('#plusPop [data-goto]')].find(x => new RegExp(r).test(x.textContent)).click();
}, re);
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });

await p.addInitScript(() => { try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {} });
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);

/* ============ 2) BOINA DO TUTORIAL FORA DO ESTORNO ============ */
await nav('v-loja'); await p.waitForTimeout(500);
t('a boina não aparece em "Estornos · até 7 dias"', !/[Bb]oina/.test(await T('lojaEstornos')));

/* ============ 3) DROP — vitrine e sorteio ============ */
t('item só de drop NÃO aparece na vitrine de combate',
  !/Patch da sorte/.test(await p.evaluate(() => document.getElementById('combatGrid').textContent)));
t('item vendido+drop avisa a chance no card',
  /Cantil[\s\S]*também cai no DROP \(10%\)/.test(await p.evaluate(() => document.getElementById('combatGrid').textContent.replace(/\s+/g, ' '))));
/* sorteio forçado a GANHAR: concluir um bloco do dia */
await p.evaluate(() => { window.__dropRng = () => 0; });
await nav('v-missoes'); await p.waitForTimeout(400);
await p.evaluate(() => { document.querySelector('#diaList [data-dia]').click(); });
await p.waitForTimeout(400);
for (let i = 0; i < 10; i++) {
  await p.evaluate(() => document.getElementById('fcCerto')?.click());
  await p.waitForTimeout(120);
  await p.evaluate(() => document.querySelector('#trBody [data-nota="3"]')?.click());
  await p.waitForTimeout(120);
}
/* a celebração dourada abre por cima do resultado */
t('a celebração de DROP abre ao concluir o bloco', await p.evaluate(() => document.getElementById('dropLayer').classList.contains('on')));
const celebra = await p.evaluate(() => document.querySelector('#dropLayer .drop-card').textContent.replace(/\s+/g, ' '));
t('a celebração traz o título e o item em destaque', /DROP CONQUISTADO!/.test(celebra) && /RECOMPENSA DE CAMPO/.test(celebra) && /Cantil/.test(celebra));
t('SÓ UM item cai por vez, mesmo com dois vencendo o sorteio (dec. 206)',
  await p.evaluate(() => document.querySelectorAll('#dropLayer .drop-item').length === 1));
t('o texto motiva a continuar resolvendo', /sorte encontra quem está em combate/.test(celebra) && /nova chance de drop/.test(celebra));
await p.evaluate(() => document.getElementById('btnDropOk').click());
t('"Guardar na mochila" fecha a celebração', await p.evaluate(() => !document.getElementById('dropLayer').classList.contains('on')));
const fimBloco = await p.evaluate(() => document.getElementById('trBody').textContent.replace(/\s+/g, ' '));
t('bloco concluído anuncia o DROP no cartão de resultado', /DROP!/.test(fimBloco) && /Cantil/.test(fimBloco));
await p.evaluate(() => { document.getElementById('btnTrProx')?.click(); document.getElementById('trLayer').style.display = 'none'; });
await p.waitForTimeout(200);
const naMochila = await p.evaluate(() => {
  const g = document.getElementById('storageGrid');
  return g ? g.textContent.replace(/\s+/g, ' ') : '';
});
t('mochila mostra APENAS o Cantil — o Patch não caiu junto (um por vez)', /Cantil/.test(naMochila) && !/Patch da sorte/.test(naMochila));
/* sorteio forçado a PERDER: nada muda */
await p.evaluate(() => { window.__dropRng = () => 0.999; });
const antes = await p.evaluate(() => window.__dropSortear('teste').length);
t('com RNG desfavorável o sorteio não entrega nada', antes === 0);
await p.evaluate(() => { window.__dropRng = null; });

/* ============ 3b) DROP — admin cria item só de drop ============ */
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await p.evaluate(() => { const bl = document.querySelector('[data-bl="skins"]'); if (!bl || bl.style.display === 'none') document.querySelector('#jumpInterno .jp[data-jump="skins"]')?.click(); });
await p.waitForTimeout(300);
await set('admSkTipo', 'combate'); await p.waitForTimeout(150);
t('escolher "combate" mostra a linha de disponibilidade/drop',
  await p.evaluate(() => document.getElementById('admSkDropRow').style.display !== 'none'));
await set('admSkNome', 'Medalha do sorteio'); await set('admSkDesc', 'rara');
await set('admSkDisp', 'drop'); await set('admSkDrop', '150');
await p.click('#btnAdmSkin'); await p.waitForTimeout(250);
t('chance acima de 100% é barrada', /entre 1% e 100%/.test(await T('toast')));
await set('admSkDrop', '25');
await p.click('#btnAdmSkin'); await p.waitForTimeout(300);
t('item só de drop publica SEM preço', /só no drop/.test(await T('toast')) && /25%/.test(await T('toast')));
t('a lista do admin mostra o modo do item', /Medalha do sorteio[\s\S]*só no drop · 25% de chance/.test(await T('admSkinList')));
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(400);
t('o item recém-criado só de drop não entra na vitrine',
  !/Medalha do sorteio/.test(await p.evaluate(() => document.getElementById('combatGrid').textContent)));
t('mas participa do sorteio (RNG 0.15: só a chance de 25% vence)', await p.evaluate(() => {
  window.__dropRng = () => 0.15;
  const g = window.__dropSortear('em teste').map(i => i.nome);
  window.__dropRng = null;
  document.getElementById('dropLayer').classList.remove('on');   /* fecha a celebração do teste */
  return g.length === 1 && g[0] === 'Medalha do sorteio';
}));

/* ====== DEC. 199 · O CARD DO CARROSSEL ABRE AS INFORMAÇÕES ====== */
await nav('v-inicio'); await p.waitForTimeout(500);
await p.evaluate(() => { const x = [...document.querySelectorAll('#evStrip .ev-tile')].find(y => /AULÃO ESPECIAL/i.test(y.textContent)); if (x) x.click(); });
await p.waitForTimeout(600);
t('card de evento PAGO abre a página do evento, não a Loja',
  await p.evaluate(() => getComputedStyle(document.getElementById('evLayer')).display !== 'none'));
t('a página mostra as regras antes de comprar',
  /Regras de score/.test(await T('evBody')) && /Regras de Quad Coins/.test(await T('evBody')));
t('o botão convida para a compra com o preço na frente',
  /Comprar na Quad Store · 80 QdC/.test(await T('btnEvInscrever')));
await p.evaluate(() => document.getElementById('btnEvInscrever').click());
await p.waitForTimeout(900);
t('o botão leva à Loja, com a página do evento fechada',
  await p.evaluate(() => document.getElementById('v-loja').classList.contains('on')) &&
  await p.evaluate(() => getComputedStyle(document.getElementById('evLayer')).display === 'none'));
t('o item do evento entra destacado na Loja',
  await p.evaluate(() => !!document.querySelector('[data-ev-buy="aulao-especial"].achei')));

/* ============ 1) EVENTO: INSCRITO → CONCLUÍDO / FALTOSO ============ */
/* compra um evento futuro e confere INSCRITO no calendário */
const evId = 'aulao-especial';   /* pago · presencial · 80 QdC */
await p.evaluate(i => document.querySelector('[data-ev-buy="' + i + '"]')?.click(), evId); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.getElementById('btnCompraOk'); if (document.getElementById('compraLayer').classList.contains('on')) b.click(); });
await p.waitForTimeout(400);
await plus('Calendário'); await p.waitForTimeout(300);
const nomeEv = await p.evaluate(i => window.__eventos().find(x => x.id === i)?.nome, evId);
t('evento comprado aparece INSCRITO no calendário', new RegExp(nomeEv + '[\\s\\S]*INSCRITO').test(await T('calList')));
/* admin libera a entrada → CONCLUÍDO */
await persona('admin'); await p.waitForTimeout(300);
await navAdm('v-adm-liber'); await p.waitForTimeout(400);
await p.evaluate(() => {
  const r = [...document.querySelectorAll('#admAcessos .mission-row')].find(x => /você/.test(x.textContent));
  r?.querySelector('button')?.click();
});
await p.waitForTimeout(300);
await persona('aluno'); await p.waitForTimeout(300);
await plus('Calendário'); await p.waitForTimeout(300);
t('entrada liberada: INSCRITO vira CONCLUÍDO', new RegExp(nomeEv + '[\\s\\S]*CONCLUÍDO').test(await T('calList')));
t('CONCLUÍDO explica a presença registrada', /presença registrada na portaria/.test(await T('calList')));
/* segundo evento: o dia passa SEM liberação → FALTOSO e fora do estorno */
const ev2 = 'semana-insana';   /* pago · presencial · 400 Dmn · multi-dia */
await nav('v-loja'); await p.waitForTimeout(300);
await p.fill('#giftCode', 'QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(300);   /* saldo p/ evento em Dmn */
await p.evaluate(i => document.querySelector('[data-ev-buy="' + i + '"]')?.click(), ev2); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.getElementById('btnCompraOk'); if (document.getElementById('compraLayer').classList.contains('on')) b.click(); });
await p.waitForTimeout(400);
const nomeEv2 = await p.evaluate(i => window.__eventos().find(x => x.id === i)?.nome, ev2);
t('a compra do 2º evento entra na janela de estorno', new RegExp(nomeEv2).test(await T('lojaEstornos')));
await p.evaluate(i => {   /* o dia do evento passa */
  const e = window.__eventos().find(x => x.id === i);
  e.dataISO = '2026-01-01'; if (e.ate) e.ate = '2026-01-01';
  window.__calRefresh(); window.__estRefresh();
}, ev2);
await p.waitForTimeout(200);
t('dia passou sem liberação: INSCRITO vira FALTOSO', new RegExp(nomeEv2 + '[\\s\\S]*FALTOSO').test(await T('calList')));
t('FALTOSO explica a entrada não registrada', /entrada não foi registrada/.test(await T('calList')));
t('evento realizado SAI da janela de estorno', !new RegExp(nomeEv2).test(await T('lojaEstornos')));
t('o evento CONCLUÍDO não virou FALTOSO', new RegExp(nomeEv + '[\\s\\S]*CONCLUÍDO').test(await T('calList')));

console.log('\nvv1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
