/* vz5 — dec. 212: PERFIL PÚBLICO NOS RANKINGS. Ao lado de cada nome (sala
   e geral) há um botão que abre o perfil daquele aluno: foto do operador,
   as skins que ele veste, relatório rápido (início na plataforma, turma,
   medalhas conquistadas) e o Instagram. Quem fechou o perfil não abre —
   o botão fica apagado e explica; a minha chave de privacidade vale para
   o meu próprio perfil.                                                */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
const p = await c.newPage();
const erros = [];
p.on('pageerror', e => erros.push('JS: ' + e.message));
let ok = 0; const falhas = [];
const t = (nome, cond) => { if (cond) ok++; else falhas.push(nome); };
/* o Quadrômetro abre pelo menu "+" (não fica na barra inferior) */
const abreQuadrometro = async () => {
  await p.evaluate(() => { document.getElementById('plusPop').classList.remove('on'); document.querySelector('#plusPop [data-goto="v-perfil"]').click(); });
  await p.waitForTimeout(600);
};
const perfil = () => p.evaluate(() => document.getElementById('perfPubLayer').textContent.replace(/\s+/g, ' '));
const aberto = () => p.evaluate(() => document.getElementById('perfPubLayer').classList.contains('on'));
const fechaPerfil = async () => { await p.evaluate(() => document.getElementById('btnPerfPubFechar').click()); await p.waitForTimeout(200); };

await p.addInitScript(() => { try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {} });
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);
await abreQuadrometro();

/* ============ O BOTÃO EXISTE EM TODOS OS NOMES ============ */
t('cada linha do ranking da sala tem o botão de perfil',
  await p.evaluate(() => {
    const rows = [...document.querySelectorAll('#rankSalaList .rk-row')];
    return rows.length > 0 && rows.every(r => !!r.querySelector('.rk-perf'));
  }));
t('o ranking geral também',
  await p.evaluate(() => {
    const rows = [...document.querySelectorAll('#rankGeralList .rk-row')];
    return rows.length > 0 && rows.every(r => !!r.querySelector('.rk-perf'));
  }));
/* dec. 213 — o botão tem COLUNA PRÓPRIA: dentro do nome ele parava num
   ponto diferente em cada linha e a fileira ficava torta */
t('o botão fica FORA do nome, em coluna própria',
  await p.evaluate(() => {
    const rows = [...document.querySelectorAll('#rankSalaList .rk-row')];
    return rows.every(r => !r.querySelector('.rk-nome .rk-perf')) &&
           rows.every(r => r.querySelector('.rk-perf').parentElement.classList.contains('rk-row'));
  }));
t('e todos os botões da lista ficam alinhados na mesma coluna',
  await p.evaluate(() => {
    const xs = [...document.querySelectorAll('#rankSalaList .rk-perf')].map(b => Math.round(b.getBoundingClientRect().left));
    return xs.length > 1 && new Set(xs).size === 1;
  }));
t('quem mantém o perfil fechado tem o botão apagado',
  await p.evaluate(() => document.querySelectorAll('#rankSalaList .rk-perf.off').length +
                         document.querySelectorAll('#rankGeralList .rk-perf.off').length > 0));

/* ============ PERFIL FECHADO NÃO ABRE ============ */
await p.evaluate(() => document.querySelector('#rankSalaList .rk-perf.off, #rankGeralList .rk-perf.off').click());
await p.waitForTimeout(300);
t('tocar num perfil fechado explica e não abre nada',
  !(await aberto()) &&
  await p.evaluate(() => /mantém o perfil fechado/.test(document.getElementById('toast').textContent)));

/* ============ PERFIL ABERTO: A PÁGINA DO ALUNO ============ */
await p.evaluate(() => {
  const bt = [...document.querySelectorAll('#rankSalaList .rk-perf')].find(x => !x.classList.contains('off') && !x.dataset.perfEu);
  bt.click();
});
await p.waitForTimeout(400);
t('o perfil de outro aluno abre', await aberto());
const f = await perfil();
t('mostra a foto do operador', await p.evaluate(() => !!document.querySelector('#perfPubFoto img')));
/* dec. 213 — a insígnia é a da patente QUE ESTÁ NO NOME (antes vinha de
   hash: um Soldado aparecia com insígnia de Aspirante) */
t('a insígnia bate com a patente do nome do aluno',
  await p.evaluate(() => {
    const nome = document.getElementById('perfPubNome').textContent;
    const ab = (/^(.*?) QUAD /.exec(nome) || [, ''])[1].trim();
    const MAP = { 'AL SD': 0, 'SD': 0, 'AL CB': 1, 'CB': 1, 'AL SGT': 2, 'SGT': 2, 'ST': 3,
                  'AL OF': 4, 'ASP': 4, 'TEN': 5, 'CAP': 6, 'MAJ': 7, 'TC': 8, 'CEL': 9 };
    const esperado = (MAP[ab] * (100 / 9)).toFixed(4);
    const real = parseFloat(document.getElementById('perfPubInsig').style.backgroundPosition).toFixed(4);
    return esperado === real;
  }));
t('a arte da insígnia não fica esmagada — mantém a proporção 3:2 do sprite',
  await p.evaluate(() => {
    const r = document.getElementById('perfPubInsig').getBoundingClientRect();
    return Math.abs((r.width / r.height) - 1.5) < 0.05;
  }));
t('o bloco de carreira mostra a patente por extenso',
  /Patente/.test(await p.evaluate(() => document.getElementById('perfPubCorpo').textContent)));
t('mostra o nome de guerra completo e a posição no ranking',
  /QUAD/.test(f) && /º no ranking/.test(f) && /pts de carreira/.test(f));
t('lista as skins que ele veste na foto',
  await p.evaluate(() => document.querySelectorAll('#perfPubSkins .perf-skin').length >= 1));
t('traz o bloco "Sobre a carreira" com início na plataforma e turma',
  /Sobre a carreira/.test(f) && !/Relatório rápido/.test(f) &&
  /Início na plataforma/.test(f) && /\d\d\/\d\d\/2026/.test(f) && /Turma/.test(f));
t('conta quantas medalhas ele conquistou e lista cada uma',
  /medalha/i.test(f) &&
  await p.evaluate(() => {
    const n = document.querySelectorAll('#perfPubCorpo .perf-med li').length;
    const t = document.querySelector('#perfPubCorpo .item-bloco.efeito .ib-t').textContent;
    return n >= 1 && t.includes('Possui ' + n);
  }));
t('mostra o Instagram do aluno', /@/.test(f) && /Instagram/.test(f));
const nomeOutro = await p.evaluate(() => document.getElementById('perfPubNome').textContent);
await fechaPerfil();
t('o ✕ fecha o perfil', !(await aberto()));

/* ============ O MESMO ALUNO SEMPRE TEM O MESMO PERFIL ============ */
await p.evaluate(() => {
  const bt = [...document.querySelectorAll('#rankSalaList .rk-perf')].find(x => !x.classList.contains('off') && !x.dataset.perfEu);
  bt.click();
});
await p.waitForTimeout(300);
const f2 = await perfil();
t('reabrir o mesmo aluno traz exatamente os mesmos dados (não são aleatórios)',
  f2 === f && (await p.evaluate(() => document.getElementById('perfPubNome').textContent)) === nomeOutro);
await fechaPerfil();

/* ============ O MEU PRÓPRIO PERFIL ============ */
await p.evaluate(() => document.querySelector('#rankSalaList .rk-row.me .rk-perf').click());
await p.waitForTimeout(400);
const fEu = await perfil();
t('o meu perfil abre marcado como "você"', await aberto() && /· você/.test(fEu));
t('e mostra a minha data de entrada na plataforma', /11\/05\/2026/.test(fEu));
t('e a minha turma em uso', /PATAMO|RONDESP|BOPE/.test(fEu));
await fechaPerfil();

/* ============ A CHAVE DE PRIVACIDADE FECHA O MEU PERFIL ============ */
await p.evaluate(() => document.getElementById('btnPriv').click());
await p.waitForTimeout(400);
t('virando privado, o meu botão de perfil apaga',
  await p.evaluate(() => document.querySelector('#rankSalaList .rk-row.me .rk-perf').classList.contains('off')));
await p.evaluate(() => document.querySelector('#rankSalaList .rk-row.me .rk-perf').click());
await p.waitForTimeout(300);
t('e o meu perfil deixa de abrir', !(await aberto()));
t('o texto da chave explica que o perfil não abre para ninguém',
  await p.evaluate(() => /perfil não abre para ninguém/.test(document.getElementById('privDesc').textContent)));
await p.evaluate(() => document.getElementById('btnPriv').click());
await p.waitForTimeout(400);
t('voltando a público, o perfil abre de novo',
  await p.evaluate(() => !document.querySelector('#rankSalaList .rk-row.me .rk-perf').classList.contains('off')) &&
  /perfil abre para quem tocar/.test(await p.evaluate(() => document.getElementById('privDesc').textContent)));

/* ============ VALE NO RANKING COMPLETO TAMBÉM ============ */
await p.evaluate(() => document.getElementById('rkGeralBtn').click());
await p.waitForTimeout(400);
t('abrindo o ranking geral completo, o hall dos 10 primeiros também tem perfil',
  await p.evaluate(() => {
    const rows = [...document.querySelectorAll('#rankGeralList .rk-row.top3')];
    return rows.length > 0 && rows.every(r => !!r.querySelector('.rk-perf'));
  }));

console.log('\nvz5 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
