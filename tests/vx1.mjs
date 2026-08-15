/* vx1 — dec. 200: score padrão de 10 em todo evento, recompensa de
   participação editável pelo administrador (score + Quad Coins) e o
   vocabulário do carrossel reduzido a "NA LOJA" e "+BÔNUS".          */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
const p = await c.newPage();
const erros = [];
p.on('pageerror', e => erros.push('JS: ' + e.message));
let ok = 0; const falhas = [];
const t = (nome, cond) => { if (cond) ok++; else falhas.push(nome); };
const persona = q => p.evaluate(x => document.querySelector('.persona-btn[data-persona="' + x + '"]').click(), q);

await p.addInitScript(() => { try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {} });
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);

/* ============ TODO EVENTO PONTUA 10 ============ */
const seeds = await p.evaluate(() => window.__eventos().map(e => ({ nome: e.nome, score: e.score, coins: e.coins, pago: !!e.pago })));
t('todo evento publica a regra de participação',
  seeds.every(e => (e.score || []).some(r => /^Participação/.test(r[0]))));
t('a participação vale 10 de score em todos eles',
  seeds.every(e => (e.score || []).some(r => /^Participação/.test(r[0]) && /\+10 score/.test(r[1]))));
t('as regras extras de cada evento continuam publicadas (não viraram só o padrão)',
  seeds.some(e => (e.score || []).length > 1));
t('a página do evento mostra a regra de participação',
  await p.evaluate(async () => {
    document.querySelector('#evStrip .ev-tile').click();
    await new Promise(r => setTimeout(r, 400));
    const txt = document.getElementById('evLayer').textContent;
    document.getElementById('evLayer').style.display = 'none';
    return /Participação no evento/.test(txt) && /\+10 score/.test(txt);
  }));

/* ============ SÓ DUAS ETIQUETAS DE TIPO ============ */
const etiquetas = await p.evaluate(() => [...new Set([...document.querySelectorAll('#evStrip .ev-tile .tag')].map(t => t.textContent))]);
t('o carrossel não usa mais a etiqueta "+COINS"', etiquetas.indexOf('COINS') < 0 && !etiquetas.some(e => /COINS/i.test(e)));
t('as etiquetas de tipo se resumem a NA LOJA e +BÔNUS',
  etiquetas.every(e => ['NA LOJA', '+BÔNUS', 'INSCRITO', 'LOTADO', 'EM CHOQUE'].indexOf(e) >= 0));
t('evento pago aparece como NA LOJA', etiquetas.indexOf('NA LOJA') >= 0);
t('evento gratuito que dá Coins aparece como +BÔNUS', etiquetas.indexOf('+BÔNUS') >= 0);
t('nenhuma semente carrega tag livre', await p.evaluate(() => window.__eventos().every(e => !e.tag)));
/* +BÔNUS agora é consequência do Coin, não do score */
t('+BÔNUS marca exatamente os gratuitos que dão Quad Coins',
  await p.evaluate(() => {
    const evs = window.__eventos();
    return [...document.querySelectorAll('#evStrip .ev-tile')].slice(0, evs.length).every(tile => {
      const ev = evs.filter(e => e.id === tile.dataset.ev)[0];
      const tag = tile.querySelector('.tag');
      const bonus = tag && tag.textContent === '+BÔNUS';
      if (['INSCRITO', 'LOTADO', 'EM CHOQUE'].indexOf(tag ? tag.textContent : '') >= 0) return true;
      return bonus === (!ev.pago && !!(ev.coins && ev.coins.length));
    });
  }));

/* ============ O ADMIN INSERE A RECOMPENSA AO CRIAR ============ */
await persona('admin'); await p.waitForTimeout(400);
await p.fill('#admEmail', 'direcao@quadconcursos.com.br');
await p.selectOption('#admPerfil', 'direcao');
await p.fill('#admChave', 'NPP-2026');
await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
await p.evaluate(() => document.querySelector('#navAdmin .nav-btn[data-view="v-adm-liber"]').click());
await p.waitForTimeout(500);
t('o formulário tem campo de score de participação, já com o padrão 10',
  await p.evaluate(() => document.getElementById('admEvNovoScore')?.value === '10'));
t('o formulário tem campo de Quad Coins, vazio por padrão (o Coin é opcional)',
  await p.evaluate(() => { const el = document.getElementById('admEvNovoCoins'); return !!el && el.value === ''; }));

const criar = (nome, coins, data) => p.evaluate(a => {
  document.getElementById('admEvNovoNome').value = a.nome;
  document.getElementById('admEvNovoData').value = a.data;
  document.getElementById('admEvNovoData').dispatchEvent(new Event('change'));
  document.getElementById('admEvNovoInicio').value = '08:00';
  document.getElementById('admEvNovoFim').value = '10:00';
  document.getElementById('admEvSala').value = 'Sala 4';
  document.getElementById('admEvNovoCoins').value = a.coins;
  document.getElementById('btnAdmEvNovo').click();
}, { nome, coins, data });

await criar('Evento sem Coins', '', '2026-11-21'); await p.waitForTimeout(400);
await criar('Evento com Coins', '25', '2026-11-28'); await p.waitForTimeout(400);
const criados = await p.evaluate(() => window.__eventos().filter(e => /^Evento (sem|com) Coins$/.test(e.nome)));
t('os dois eventos foram criados', criados.length === 2);
t('evento criado já nasce pontuando 10 (antes nascia sem regra nenhuma)',
  criados.every(e => e.score.length === 1 && /\+10 score/.test(e.score[0][1])));
t('sem Coins preenchido, o evento não dá Coins',
  (criados.filter(e => /sem Coins/.test(e.nome))[0] || {}).coins?.length === 0);
t('com Coins preenchido, o evento passa a dar Coins de participação',
  (criados.filter(e => /com Coins/.test(e.nome))[0] || {}).coins?.[0]?.[1] === '+25');

/* ============ E A RECOMPENSA É EDITÁVEL ============ */
await p.evaluate(() => {
  const ev = window.__eventos().filter(e => /sem Coins/.test(e.nome))[0];
  document.querySelector('[data-ed-ev="' + ev.id + '"]')?.click();
});
await p.waitForTimeout(500);
const abriuEdicao = await p.evaluate(() => document.getElementById('btnAdmEvNovo').textContent === 'Salvar alterações');
t('a edição do evento abre com a recompensa carregada nos campos',
  abriuEdicao && await p.evaluate(() => document.getElementById('admEvNovoScore').value === '10' && document.getElementById('admEvNovoCoins').value === ''));
if (abriuEdicao) {
  await p.evaluate(() => {
    document.getElementById('admEvNovoScore').value = '40';
    document.getElementById('admEvNovoCoins').value = '15';
    document.getElementById('btnAdmEvNovo').click();
  });
  await p.waitForTimeout(500);
  const ed = await p.evaluate(() => window.__eventos().filter(e => /sem Coins/.test(e.nome))[0]);
  t('salvar a edição muda o score de participação', /\+40 score/.test(ed.score[0][1]));
  t('salvar a edição insere os Quad Coins', ed.coins.length === 1 && ed.coins[0][1] === '+15');
} else {
  t('salvar a edição muda o score de participação', false);
  t('salvar a edição insere os Quad Coins', false);
}

/* o evento que ganhou Coins na edição passa a exibir +BÔNUS */
await persona('aluno'); await p.waitForTimeout(700);
const tagsFim = await p.evaluate(() => [...new Set([...document.querySelectorAll('#evStrip .ev-tile')]
  .filter(x => /^Evento (sem|com) Coins$/.test(x.querySelector('.ev-name').textContent))
  .map(x => x.querySelector('.ev-name').textContent + '|' + (x.querySelector('.tag')?.textContent || '')))]);
t('editar para dar Coins faz o evento ganhar +BÔNUS no carrossel',
  tagsFim.indexOf('Evento sem Coins|+BÔNUS') >= 0);
t('o evento com Coins também exibe +BÔNUS',
  tagsFim.indexOf('Evento com Coins|+BÔNUS') >= 0);

console.log('\nvx1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
