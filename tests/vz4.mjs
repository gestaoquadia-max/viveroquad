/* vz4 — dec. 211: FICHA DO ITEM DA MOCHILA. Tocar um item abre a página
   dele: o que é, como chegou até você (construído por quem e quando ·
   conquistado no drop · comprado), o que faz no sistema, como se obtém e
   quanto vale. Equipar mora na ficha; o histórico sobrevive ao F5.    */
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
const comprarOk = async () => { await p.evaluate(() => { const l = document.getElementById('compraLayer'); if (l.classList.contains('on')) document.getElementById('btnCompraOk').click(); }); await p.waitForTimeout(300); };
const abreMochila = async () => {
  await nav('v-inicio'); await p.waitForTimeout(200);
  await p.evaluate(() => document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('btnMochila').click()); await p.waitForTimeout(300);
};
const abreFicha = async nome => {
  await p.evaluate(n => [...document.querySelectorAll('#storageGrid .st-slot.cheio')].find(x => new RegExp(n).test(x.textContent)).click(), nome);
  await p.waitForTimeout(300);
};
const ficha = () => p.evaluate(() => document.getElementById('itemLayer').textContent.replace(/\s+/g, ' '));

await p.addInitScript(() => {
  try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {}
  window.__dropRng = () => 0.999;
});
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);

/* ============ INSUMO DE DOTAÇÃO: A FICHA EXPLICA O PAPEL DELE ============ */
await abreMochila();
t('o slot da mochila é tocável (abre a ficha)',
  await p.evaluate(() => !!document.querySelector('#storageGrid button.st-slot[data-item]')));
await abreFicha('Liga metálica');
const fLiga = await ficha();
t('a ficha abre com nome e descrição do item', /Liga metálica/.test(fLiga) && /matéria-prima de blindagem/.test(fLiga));
t('mostra quantas unidades você tem', /19 unidades na mochila/.test(fLiga));
t('item de dotação inicial explica que já estava na mochila', /já estava na sua mochila/.test(fLiga));
t('insumo diz que não tem efeito e serve para construir', /sem efeito no sistema/.test(fLiga) && /insumo/.test(fLiga));
t('explica que só vem do DROP, com a chance por bloco', /Só no DROP/.test(fLiga) && /30% de chance por bloco/.test(fLiga));
t('e que não é vendido', /Não é vendido/.test(fLiga));
t('insumo não tem botão de equipar',
  await p.evaluate(() => document.getElementById('itemFichaAcoes').textContent.trim() === ''));
await p.evaluate(() => document.getElementById('btnItemFechar').click()); await p.waitForTimeout(200);
t('o ✕ fecha a ficha', await p.evaluate(() => !document.getElementById('itemLayer').classList.contains('on')));

/* ============ ITEM COMPRADO: A FICHA REGISTRA A COMPRA ============ */
await nav('v-loja'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#combatGrid [data-combate="faca"]').click());
await p.waitForTimeout(250); await comprarOk();
await abreMochila();
await abreFicha('Faca tática');
const fFaca = await ficha();
const hoje = await p.evaluate(() => { const d = new Date(); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); });
t('a ficha do item comprado diz "Comprado na Quad Store por" com o nome do aluno e a data',
  /Comprado na Quad Store por/.test(fFaca) && /QUAD/.test(fFaca) && fFaca.includes(hoje));
t('item de venda mostra o preço na Loja', /40 Quad Coins/.test(fFaca) && /Itens de combate/.test(fFaca));
await p.evaluate(() => document.getElementById('btnItemFechar').click()); await p.waitForTimeout(200);

/* ============ ITEM DROPADO: A FICHA REGISTRA O DROP ============ */
await p.evaluate(() => {
  window.__dropRng = () => 0.2;   /* liga metálica (30%) vence */
  window.__dropSortear('no treinamento rápido');
  window.__dropRng = () => 0.999;
  document.getElementById('dropLayer').classList.remove('on');
});
await p.waitForTimeout(300);
await abreFicha('Liga metálica');
t('a última aquisição da liga passou a ser o DROP',
  /Conquistado no drop por/.test(await ficha()));
t('e a contagem subiu para 20', /20 unidades na mochila/.test(await ficha()));
await p.evaluate(() => document.getElementById('btnItemFechar').click()); await p.waitForTimeout(200);

/* ============ ITEM CONSTRUÍDO: FICHA COMPLETA + EQUIPAR ============ */
await nav('v-loja'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#questGrid [data-quest="blindado"]').click());
await p.waitForTimeout(300); await comprarOk();
await abreMochila();
await abreFicha('Blindado militar');
const fBl = await ficha();
t('a ficha do item construído diz "Construído por" com o nome do aluno e a data',
  /Construído por/.test(fBl) && /QUAD/.test(fBl) && fBl.includes(hoje));
t('explica o efeito: troca a foto do operador', /troca a foto do seu operador/.test(fBl));
t('mostra a receita em "Como se obtém"', /20× Liga metálica/.test(fBl) && /4× Pneu blindado/.test(fBl));
t('e que vale os insumos, não moeda', /vale os insumos da receita/.test(fBl));
t('a ficha traz o botão de equipar',
  await p.evaluate(() => /Equipar/.test(document.getElementById('btnItemEquipar').textContent)));
const fotoAntes = await p.evaluate(() => document.querySelector('#homeAvatar img').src);
await p.evaluate(() => document.getElementById('btnItemEquipar').click()); await p.waitForTimeout(400);
t('equipar pela ficha troca a foto do operador',
  (await p.evaluate(() => document.querySelector('#homeAvatar img').src)) !== fotoAntes &&
  await p.evaluate(() => window.__questEquipada() === 'blindado'));
t('a ficha continua aberta e vira "Desequipar"',
  await p.evaluate(() => document.getElementById('itemLayer').classList.contains('on') &&
                         /Desequipar/.test(document.getElementById('btnItemEquipar').textContent)));
await p.evaluate(() => document.getElementById('btnItemFechar').click()); await p.waitForTimeout(200);
t('o slot do item equipado ganha a marca ✓',
  await p.evaluate(() => { const s = [...document.querySelectorAll('#storageGrid .st-slot.cheio')].find(x => /Blindado/.test(x.textContent)); return !!s.querySelector('.st-eqmark'); }));
t('os insumos consumidos sumiram do histórico',
  await p.evaluate(() => !window.__itemHist().liga && !window.__itemHist().pneu));

/* ============ A HISTÓRIA SOBREVIVE AO F5 ============ */
await p.evaluate(() => document.getElementById('btnStorageFechar').click());
await p.waitForTimeout(700);   /* debounce do salvamento */
await p.reload({ waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1200);
await abreMochila();
await abreFicha('Blindado militar');
t('depois do F5 a ficha ainda conta quem construiu e quando',
  /Construído por/.test(await ficha()) && (await ficha()).includes(hoje));

console.log('\nvz4 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
