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

/* ============ A CHAVE DE PRIVACIDADE FECHA O MEU PERFIL ============
   Na SALA eu estou em 10º — dentro do hall, onde ninguém se esconde
   (dec. 214). A chave se prova no GERAL, onde estou em 87º.          */
await p.evaluate(() => document.getElementById('btnPriv').click());
await p.waitForTimeout(400);
t('virando privado, o meu botão de perfil apaga no ranking geral',
  await p.evaluate(() => document.querySelector('#rankGeralList .rk-row.me .rk-perf').classList.contains('off')));
t('mas na sala, onde estou no hall dos 10, ele continua aberto',
  await p.evaluate(() => !document.querySelector('#rankSalaList .rk-row.me .rk-perf').classList.contains('off')));
await p.evaluate(() => document.querySelector('#rankGeralList .rk-row.me .rk-perf').click());
await p.waitForTimeout(300);
t('e o meu perfil deixa de abrir por ali', !(await aberto()));
t('o texto da chave explica que o perfil não abre para ninguém',
  await p.evaluate(() => /perfil não abre para ninguém/.test(document.getElementById('privDesc').textContent)));
await p.evaluate(() => document.getElementById('btnPriv').click());
await p.waitForTimeout(400);
t('voltando a público, o perfil abre de novo',
  await p.evaluate(() => !document.querySelector('#rankGeralList .rk-row.me .rk-perf').classList.contains('off')) &&
  /perfil abre para quem tocar/.test(await p.evaluate(() => document.getElementById('privDesc').textContent)));

/* ===== DEC. 214 · PATENTES VARIADAS, COERENTES COM O SCORE ===== */
await p.evaluate(() => document.getElementById('rkSalaBtn').click());
await p.waitForTimeout(400);
t('o ranking da sala mostra patentes variadas, não só AL SD e SD',
  await p.evaluate(() => {
    const abrevs = [...document.querySelectorAll('#rankSalaList .rk-nome')]
      .map(n => (/^(.*?) QUAD /.exec(n.textContent) || [, ''])[1].trim());
    return new Set(abrevs).size >= 4;
  }));
t('a patente de cada linha é coerente com o score dela (mais pontos, patente maior)',
  await p.evaluate(() => {
    const ORD = ['AL SD', 'SD', 'AL CB', 'CB', 'AL SGT', 'SGT', 'ST', 'AL OF', 'ASP', 'TEN', 'CAP', 'MAJ', 'TC', 'CEL'];
    const linhas = [...document.querySelectorAll('#rankSalaList .rk-row')].map(r => ({
      ab: (/^(.*?) QUAD /.exec(r.querySelector('.rk-nome').textContent) || [, ''])[1].trim(),
      pts: parseInt(r.querySelector('.rk-pts').textContent.replace(/\D/g, ''), 10)
    })).filter(x => ORD.indexOf(x.ab) >= 0);
    /* a lista desce em pontos: a patente nunca pode subir descendo a lista */
    for (let i = 1; i < linhas.length; i++) {
      if (linhas[i].pts <= linhas[i - 1].pts && ORD.indexOf(linhas[i].ab) > ORD.indexOf(linhas[i - 1].ab)) return false;
    }
    return true;
  }));
await p.evaluate(() => document.getElementById('rkGeralBtn').click());
await p.waitForTimeout(400);
t('o hall dos 10 primeiros traz os oficiais superiores (Coronel no topo)',
  await p.evaluate(() => /CEL QUAD/.test(document.querySelector('#rankGeralList .rk-row').textContent)));

/* ===== DEC. 214 · A PRIVACIDADE FECHA OS PERFIS DA 11ª EM DIANTE ===== */
const perfEstado = () => p.evaluate(() => {
  const rows = [...document.querySelectorAll('#rankGeralList .rk-row')];
  return {
    hall: rows.slice(0, 10).filter(r => !r.querySelector('.rk-perf').classList.contains('off')).length,
    fora: rows.slice(11).filter(r => !r.querySelector('.rk-perf').classList.contains('off')).length
  };
});
const pub = await perfEstado();
t('público: o hall inteiro abre e a maioria de fora do hall também',
  pub.hall === 10 && pub.fora > 0);
await p.evaluate(() => document.getElementById('btnPriv').click());
await p.waitForTimeout(500);
await p.evaluate(() => { if (!document.getElementById('rankGeralList').textContent.includes('···')) document.getElementById('rkGeralBtn').click(); });
await p.waitForTimeout(300);
const priv = await perfEstado();
t('privado: NENHUM perfil da 11ª posição em diante abre (reciprocidade)', priv.fora === 0);
t('mas o hall dos 10 primeiros continua aberto — no topo não há como se esconder',
  priv.hall === 10);
await p.evaluate(() => document.getElementById('btnPriv').click());
await p.waitForTimeout(500);

/* ===== DEC. 214 · A ESCALA DE PATENTES CRESCE ATÉ O FIM ===== */
t('na Jornada de patentes a pontuação não trava em 12.500 — cresce até Tenente-Coronel',
  await p.evaluate(() => {
    const vals = [...document.querySelectorAll('#trilhaList .tr-item')]
      .map(x => x.textContent).filter(x => /pts/.test(x))
      .map(x => parseInt(x.replace(/\D/g, ''), 10));
    const fim = vals.slice(-5);   /* Aspirante → Tenente-Coronel */
    for (let i = 1; i < fim.length; i++) if (fim[i] <= fim[i - 1]) return false;
    return fim[fim.length - 1] === 18500;
  }));

/* ============ VALE NO RANKING COMPLETO TAMBÉM ============ */
await p.evaluate(() => { if (!document.getElementById('rankGeralList').textContent.includes('···')) document.getElementById('rkGeralBtn').click(); });
await p.waitForTimeout(400);
t('abrindo o ranking geral completo, o hall dos 10 primeiros também tem perfil',
  await p.evaluate(() => {
    const rows = [...document.querySelectorAll('#rankGeralList .rk-row.top3')];
    return rows.length > 0 && rows.every(r => !!r.querySelector('.rk-perf'));
  }));

/* ===== DEC. 215 · TODO PERFIL ABERTO REALMENTE ABRE =====
   O hash ia até 4,29 bi e o deslocamento COM sinal virava negativo acima
   de 2³¹: o índice da medalha ficava negativo e o perfil quebrava ao
   abrir (ST QUAD Pires era um deles). Esta prova varre a lista inteira. */
await p.evaluate(() => { if (!document.getElementById('rankSalaList').textContent.includes('Mostrar menos')) document.getElementById('rkSalaBtn').click(); });
await p.evaluate(() => { if (!document.getElementById('rankGeralList').textContent.includes('···')) document.getElementById('rkGeralBtn').click(); });
await p.waitForTimeout(400);
let varridos = 0; const quebrados = [];
for (const lista of ['rankSalaList', 'rankGeralList']) {
  const n = await p.evaluate(l => document.querySelectorAll('#' + l + ' .rk-perf').length, lista);
  for (let i = 0; i < n; i++) {
    const info = await p.evaluate(a => {
      const bt = [...document.querySelectorAll('#' + a.l + ' .rk-perf')][a.i];
      if (bt.classList.contains('off')) return { pular: true };
      const nome = bt.parentElement.querySelector('.rk-nome').textContent.trim();
      bt.click();
      return { nome };
    }, { l: lista, i });
    if (info.pular) continue;
    await p.waitForTimeout(60);
    varridos++;
    const st = await p.evaluate(() => ({
      on: document.getElementById('perfPubLayer').classList.contains('on'),
      foto: !!document.querySelector('#perfPubFoto img'),
      med: document.querySelectorAll('#perfPubCorpo .perf-med li').length
    }));
    if (!st.on || !st.foto || !st.med) quebrados.push(info.nome + (st.on ? (st.foto ? ' (sem medalha)' : ' (sem foto)') : ' (não abriu)'));
    if (st.on) { await p.evaluate(() => document.getElementById('btnPerfPubFechar').click()); await p.waitForTimeout(50); }
  }
}
t('a lista inteira foi varrida (mais de 40 perfis abertos)', varridos > 40);
t('TODO perfil aberto abre de verdade, com foto e medalhas' + (quebrados.length ? ' — quebrados: ' + quebrados.join(', ') : ''),
  quebrados.length === 0);
t('e nenhum erro de JavaScript apareceu na varredura', erros.length === 0);

console.log('\nvz5 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
