/* vz2 — dec. 207: ITENS DE QUEST. A Loja ganha a área "Itens de Quest",
   comprada com ITENS DA MOCHILA como moeda: a receita lista os insumos,
   a construção consome as unidades e entrega o item. A demo nasce com a
   coleta do Blindado adiantada (18/20 ligas, 3/4 pneus, MAG); o efeito
   'foto' torna o item equipável (marcador PATAMO até a arte oficial).
   O admin cria itens "construídos por quest" com receita + efeito.    */
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
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const persona = q => p.evaluate(x => document.querySelector('.persona-btn[data-persona="' + x + '"]').click(), q);
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });
const comprarOk = async () => { await p.evaluate(() => { const l = document.getElementById('compraLayer'); if (l.classList.contains('on')) document.getElementById('btnCompraOk').click(); }); await p.waitForTimeout(300); };
const questCard = () => p.evaluate(() => {
  const c = document.querySelector('#questGrid [data-quest="blindado"]');
  return c ? c.textContent.replace(/\s+/g, ' ') : '';
});

await p.addInitScript(() => {
  try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {}
  window.__dropRng = () => 0.999;   /* sem drop aleatório no teste */
});
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);

/* ============ A ÁREA DE QUEST E A COLETA ADIANTADA ============ */
await nav('v-loja'); await p.waitForTimeout(400);
t('a Loja tem a seção Itens de Quest com o card do Blindado militar',
  await p.evaluate(() => !!document.querySelector('#questGrid [data-quest="blindado"]')));
const card0 = await questCard();
t('a receita mostra o progresso da coleta adiantada (19/20 ligas · 4/4 pneus)',
  /19\/20 · Liga metálica/.test(card0) && /✓ 4\/4 · Pneu blindado/.test(card0));
t('insumos completos levam o ✓ (MAG e geolocalização já estão na mochila)',
  /✓ 1\/1 · MAG/.test(card0) && /✓ 1\/1 · Sistema de geolocalização/.test(card0));
t('os insumos NÃO estão à venda na vitrine de combate (dec. 209: só drop)',
  await p.evaluate(() => !document.querySelector('#combatGrid [data-combate="liga"]') &&
                         !document.querySelector('#combatGrid [data-combate="pneu"]') &&
                         !document.querySelector('#combatGrid [data-combate="mag"]') &&
                         !document.querySelector('#combatGrid [data-combate="geo"]')));
t('o card explica o efeito da quest', /muda a foto do operador/.test(card0));
t('faltando insumo, o botão diz REÚNA OS INSUMOS', /REÚNA OS INSUMOS/.test(card0));
await p.evaluate(() => document.querySelector('#questGrid [data-quest="blindado"]').click());
await p.waitForTimeout(300);
t('tocar sem os insumos explica o que falta e aponta o DROP',
  await p.evaluate(() => /faltam insumos: 1× Liga metálica/.test(document.getElementById('toast').textContent) &&
                         /DROP/.test(document.getElementById('toast').textContent)));

/* ============ COMPLETA A COLETA PELO DROP (resolvendo questões) ============ */
await p.evaluate(() => {   /* RNG 0.2: só a Liga metálica (30%) vence o sorteio */
  window.__dropRng = () => 0.2;
  window.__dropSortear('no treinamento rápido');
  window.__dropRng = () => 0.999;
  document.getElementById('dropLayer').classList.remove('on');
});
await p.waitForTimeout(300);
const card1 = await questCard();
t('com a coleta completa o botão vira CONSTRUIR', /CONSTRUIR/.test(card1) && !/REÚNA/.test(card1));
t('todos os insumos marcam ✓', (card1.match(/✓/g) || []).length === 4);

/* ============ CONSTRUIR: CONSOME INSUMOS, ENTREGA O ITEM ============ */
await p.evaluate(() => document.querySelector('#questGrid [data-quest="blindado"]').click());
await p.waitForTimeout(300);
t('a confirmação cobra em ITENS, não em moeda',
  await p.evaluate(() => document.getElementById('compraLayer').classList.contains('on') &&
                         document.getElementById('compraTotal').textContent === '26 itens da mochila'));
t('o aviso lista a receita que será consumida',
  await p.evaluate(() => /20×.*Liga metálica/.test(document.getElementById('compraAviso').textContent)));
await comprarOk();
t('construído: o Blindado marca presença no card da quest',
  /1 na mochila/.test(await questCard()));
await nav('v-inicio'); await p.waitForTimeout(200);
await p.evaluate(() => document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(300);
await p.evaluate(() => document.getElementById('btnMochila').click()); await p.waitForTimeout(300);
const mochila = await p.evaluate(() => document.getElementById('storageGrid').textContent.replace(/\s+/g, ' '));
t('os insumos foram CONSUMIDOS da mochila', !/Liga metálica|Pneu blindado|MAG/.test(mochila));
t('o Blindado militar está na mochila e o slot abre a ficha dele (dec. 211)',
  /Blindado militar/.test(mochila) && await p.evaluate(() => !!document.querySelector('#storageGrid [data-item="blindado"]')));

/* ============ EQUIPAR TROCA A FOTO DO OPERADOR ============ */
const fotoAntes = await p.evaluate(() => document.querySelector('#homeAvatar img').src);
await p.evaluate(() => document.querySelector('#storageGrid [data-item="blindado"]').click());
await p.waitForTimeout(300);
await p.evaluate(() => document.getElementById('btnItemEquipar').click());
await p.waitForTimeout(300);
const fotoDepois = await p.evaluate(() => document.querySelector('#homeAvatar img').src);
t('equipar o Blindado TROCA a foto do operador (marcador PATAMO até a arte oficial)',
  fotoDepois !== fotoAntes && await p.evaluate(() => window.__questEquipada() === 'blindado'));
t('o slot marca o item equipado com ✓',
  await p.evaluate(() => !!document.querySelector('#storageGrid [data-item="blindado"] .st-eqmark')));
await p.evaluate(() => document.getElementById('btnItemEquipar').click());
await p.waitForTimeout(300);
t('desequipar devolve a foto anterior',
  (await p.evaluate(() => document.querySelector('#homeAvatar img').src)) === fotoAntes);
await p.evaluate(() => document.getElementById('btnItemFechar').click()); await p.waitForTimeout(200);
await p.evaluate(() => document.getElementById('btnStorageFechar').click()); await p.waitForTimeout(200);

/* ============ ADMIN: CRIA ITEM CONSTRUÍDO POR QUEST ============ */
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await p.evaluate(() => { const bl = document.querySelector('[data-bl="skins"]'); if (!bl || bl.style.display === 'none') document.querySelector('#jumpInterno .jp[data-jump="skins"]')?.click(); });
await p.waitForTimeout(300);
await set('admSkTipo', 'combate');
await set('admSkDisp', 'quest');
t('escolher "construído por quest" abre a receita e esconde preço/chance',
  await p.evaluate(() => document.getElementById('admQstRow').style.display !== 'none' &&
                         document.getElementById('admSkPreco').style.display === 'none'));
await set('admSkNome', 'Radar de patrulha');
await set('admSkDesc', 'vigilância de área');
await p.evaluate(() => { document.getElementById('admQstIns').value = 'faca'; });
await set('admQstN', '2');
await p.evaluate(() => document.getElementById('btnAdmQstAdd').click()); await p.waitForTimeout(200);
t('o insumo entra na receita (2× Faca tática)',
  await p.evaluate(() => /2× Faca tática/.test(document.getElementById('admQstLista').textContent)));
await set('admQstEfeito', 'score');
await p.evaluate(() => document.getElementById('btnAdmSkin').click()); await p.waitForTimeout(300);
t('a quest publica com aviso próprio',
  await p.evaluate(() => /Quest “Radar de patrulha” publicada/.test(document.getElementById('toast').textContent)));
t('a lista do admin mostra o item com a etiqueta QUEST e a regra pendente',
  await p.evaluate(() => /Radar de patrulha[\s\S]*QUEST[\s\S]*2× Faca tática[\s\S]*regra a definir/.test(document.getElementById('admSkinList').innerHTML)));
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(300);
t('o item criado aparece na área Itens de Quest da Loja',
  await p.evaluate(() => [...document.querySelectorAll('#questGrid [data-quest]')].some(x => /Radar de patrulha/.test(x.textContent))));

/* ===== O RELATO DO GESTOR (dec. 208): receita Cantil+Patch consome OS DOIS ===== */
await p.evaluate(() => document.querySelector('#combatGrid [data-combate="cantil"]').click());
await p.waitForTimeout(250); await comprarOk();
await p.evaluate(() => {   /* Patch da sorte cai no drop: RNG 0.11 vence só ele */
  window.__dropRng = () => 0.11;
  window.__dropSortear('em teste');
  window.__dropRng = () => 0.999;
  document.getElementById('dropLayer').classList.remove('on');
});
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await set('admSkTipo', 'combate'); await set('admSkDisp', 'quest');
await set('admSkNome', 'Torre de vigia'); await set('admSkDesc', 'observação avançada');
await p.evaluate(() => { document.getElementById('admQstIns').value = 'cantil'; });
await set('admQstN', '1');
await p.evaluate(() => document.getElementById('btnAdmQstAdd').click()); await p.waitForTimeout(150);
await p.evaluate(() => { document.getElementById('admQstIns').value = 'patch-sorte'; });
await set('admQstN', '1');
await p.evaluate(() => document.getElementById('btnAdmQstAdd').click()); await p.waitForTimeout(150);
await set('admQstEfeito', 'qdc');
await p.evaluate(() => document.getElementById('btnAdmSkin').click()); await p.waitForTimeout(300);
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(300);
await p.evaluate(() => [...document.querySelectorAll('#questGrid [data-quest]')].find(x => /Torre de vigia/.test(x.textContent)).click());
await p.waitForTimeout(300); await comprarOk();
const mochila2 = await p.evaluate(() => { window.scrollTo(0, 0); return null; }) ||
  await (async () => { await nav('v-inicio'); await p.waitForTimeout(200);
    await p.evaluate(() => document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(300);
    await p.evaluate(() => document.getElementById('btnMochila').click()); await p.waitForTimeout(300);
    return p.evaluate(() => document.getElementById('storageGrid').textContent.replace(/\s+/g, ' ')); })();
t('construir com receita Cantil+Patch consome OS DOIS insumos (o Patch não sobra)',
  !/Cantil/.test(mochila2) && !/Patch da sorte/.test(mochila2));
t('e a Torre de vigia entra na mochila', /Torre de vigia/.test(mochila2));

/* ===== F5 MANTÉM LOJA E MOCHILA CORRESPONDENTES (dec. 208) ===== */
await p.evaluate(() => document.querySelector('#storageGrid [data-item="blindado"]').click());
await p.waitForTimeout(300);
await p.evaluate(() => document.getElementById('btnItemEquipar').click());
await p.waitForTimeout(300);
const fotoEq = await p.evaluate(() => document.querySelector('#homeAvatar img').src);
await p.evaluate(() => document.getElementById('btnItemFechar').click()); await p.waitForTimeout(200);
await p.evaluate(() => document.getElementById('btnStorageFechar').click());
await p.waitForTimeout(700);   /* o salvamento da evolução tem debounce de 400ms */
await p.reload({ waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1200);
t('depois do F5 o Blindado segue EQUIPADO e a foto se mantém',
  await p.evaluate(() => window.__questEquipada() === 'blindado') &&
  (await p.evaluate(() => document.querySelector('#homeAvatar img').src)) === fotoEq);
await nav('v-loja'); await p.waitForTimeout(400);
t('depois do F5 a Loja confere com a mochila: a receita mostra a coleta zerada (insumos consumidos)',
  /0\/20 · Liga metálica/.test(await questCard()) && /0\/4 · Pneu blindado/.test(await questCard()));
t('e o card do Blindado segue marcando "1 na mochila"', /1 na mochila/.test(await questCard()));

console.log('\nvz2 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
