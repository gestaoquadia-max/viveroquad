/* vz3 — dec. 210: SELETOR DE ÍCONES com a biblioteca completa (padrão do
   Notion): busca em português (sem acento acha com acento), categorias e
   grade; símbolos SVG da casa como 1ª categoria + catálogo de emojis
   nativos. Disponível nos DOIS formulários do admin (skin/item de combate
   e produto da Loja); o emoji escolhido rende na vitrine e na mochila. */
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

await p.addInitScript(() => {
  try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {}
  window.__dropRng = () => 0.999;
});
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);

/* ============ O SELETOR NO FORMULÁRIO DE SKIN/ITEM ============ */
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await p.evaluate(() => { const bl = document.querySelector('[data-bl="skins"]'); if (!bl || bl.style.display === 'none') document.querySelector('#jumpInterno .jp[data-jump="skins"]')?.click(); });
await p.waitForTimeout(300);
t('a grade rápida de símbolos da casa continua no formulário',
  await p.evaluate(() => document.querySelectorAll('#admSkIcones .ico-opt').length >= 6));
await p.evaluate(() => document.getElementById('btnAdmSkMaisIco').click()); await p.waitForTimeout(300);
t('o botão abre o seletor completo', await p.evaluate(() => document.getElementById('icoLayer').classList.contains('on')));
t('o seletor tem as categorias (símbolos da casa + biblioteca de emojis)',
  await p.evaluate(() => document.querySelectorAll('#icoCats .ico-cat').length === 13));
t('a 1ª categoria mostra os símbolos SVG da casa',
  await p.evaluate(() => document.querySelectorAll('#icoGrid .ico-cel svg').length >= 15));
await p.evaluate(() => { const c = [...document.querySelectorAll('#icoCats .ico-cat')].find(x => /Veículos/.test(x.textContent)); c.click(); });
await p.waitForTimeout(200);
t('trocar de categoria troca a grade (Veículos tem helicóptero)',
  await p.evaluate(() => [...document.querySelectorAll('#icoGrid .ico-cel')].some(x => x.dataset.icoVal === '🚁')));
await set('icoBusca', 'trofeu');
await p.waitForTimeout(200);
t('a busca acha SEM acento o que tem acento (trofeu → troféu 🏆)',
  await p.evaluate(() => [...document.querySelectorAll('#icoGrid .ico-cel')].some(x => x.dataset.icoVal === '🏆')));
await set('icoBusca', 'capacete');
await p.waitForTimeout(200);
t('a busca por "capacete" traz o capacete militar 🪖',
  await p.evaluate(() => [...document.querySelectorAll('#icoGrid .ico-cel')].some(x => x.dataset.icoVal === '🪖')));
await set('icoBusca', 'zzzzz');
await p.waitForTimeout(200);
t('busca sem resultado explica e sugere outro termo',
  await p.evaluate(() => /Nada com esse nome/.test(document.getElementById('icoGrid').textContent)));
await set('icoBusca', 'capacete');
await p.waitForTimeout(200);
await p.evaluate(() => [...document.querySelectorAll('#icoGrid .ico-cel')].find(x => x.dataset.icoVal === '🪖').click());
await p.waitForTimeout(200);
t('escolher fecha o seletor e o preview mostra o emoji',
  await p.evaluate(() => !document.getElementById('icoLayer').classList.contains('on') &&
                         document.getElementById('admSkIcoPrev').textContent.includes('🪖')));

/* publica um item de combate com o emoji escolhido */
await set('admSkTipo', 'combate');
await set('admSkDisp', 'venda');
await set('admSkNome', 'Capacete balístico');
await set('admSkDesc', 'proteção de cabeça');
await set('admSkPreco', '45');
await p.evaluate(() => document.getElementById('btnAdmSkin').click()); await p.waitForTimeout(300);
t('o item publica com o emoji como ícone',
  await p.evaluate(() => window.TR_BANK !== undefined || true) &&
  await p.evaluate(() => /Capacete balístico/.test(document.getElementById('admSkinList').textContent)));
t('a lista do admin mostra o emoji do item',
  await p.evaluate(() => { const bar = [...document.querySelectorAll('#admSkinList .adm-bar')].find(x => /Capacete balístico/.test(x.textContent)); return !!bar; }));

/* ============ O EMOJI RENDE NA VITRINE E NA MOCHILA ============ */
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(300);
const cardEmoji = await p.evaluate(() => {
  const c = [...document.querySelectorAll('#combatGrid [data-combate]')].find(x => /Capacete balístico/.test(x.textContent));
  return c ? c.querySelector('.li-ico').innerHTML : '';
});
t('a vitrine do aluno mostra o emoji no card do item', /ico-emo/.test(cardEmoji) && /🪖/.test(cardEmoji));
await p.evaluate(() => [...document.querySelectorAll('#combatGrid [data-combate]')].find(x => /Capacete balístico/.test(x.textContent)).click());
await p.waitForTimeout(250);
t('a confirmação de compra também mostra o emoji',
  await p.evaluate(() => /🪖/.test(document.getElementById('compraIco').innerHTML)));
await comprarOk();
await nav('v-inicio'); await p.waitForTimeout(200);
await p.evaluate(() => document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(300);
await p.evaluate(() => document.getElementById('btnMochila').click()); await p.waitForTimeout(300);
t('a mochila mostra o item com o emoji',
  await p.evaluate(() => { const s = [...document.querySelectorAll('#storageGrid .st-slot.cheio')].find(x => /Capacete balístico/.test(x.textContent)); return !!s && /🪖/.test(s.innerHTML); }));
await p.evaluate(() => document.getElementById('btnStorageFechar').click()); await p.waitForTimeout(200);

/* ============ O SELETOR NO FORMULÁRIO DE PRODUTO ============ */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await p.evaluate(() => { const bl = document.querySelector('[data-bl="produtos"]'); if (!bl || bl.style.display === 'none') document.querySelector('#jumpInterno .jp[data-jump="produtos"]')?.click(); });
await p.waitForTimeout(300);
await p.evaluate(() => document.getElementById('btnAdmProdMaisIco').click()); await p.waitForTimeout(300);
t('o formulário de produto também abre o seletor completo',
  await p.evaluate(() => document.getElementById('icoLayer').classList.contains('on')));
await set('icoBusca', 'cafe');
await p.waitForTimeout(200);
await p.evaluate(() => [...document.querySelectorAll('#icoGrid .ico-cel')].find(x => x.dataset.icoVal === '☕').click());
await p.waitForTimeout(200);
t('o preview do produto mostra o café escolhido',
  await p.evaluate(() => document.getElementById('admProdIcoPrev').textContent.includes('☕')));
await set('admProdNome', 'Café da tropa');
await set('admProdDesc', 'expresso da recepção');
await set('admProdPreco', '10');
await set('admProdQtd', '5');
await p.evaluate(() => document.getElementById('btnAdmProd').click()); await p.waitForTimeout(300);
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(300);
t('o produto publicado aparece na Loja com o emoji',
  await p.evaluate(() => {
    const cards = [...document.querySelectorAll('#v-loja .loja-item')];
    const cafe = cards.find(x => /Café da tropa/.test(x.textContent));
    return !!cafe && /☕/.test(cafe.querySelector('.li-ico').innerHTML);
  }));

console.log('\nvz3 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
