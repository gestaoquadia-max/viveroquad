/* vz7 — dec. 218: TÍTULOS E CONDECORAÇÕES na mochila. Área própria, abaixo
   dos itens, com o que o aluno CONQUISTOU por vitórias: promoção de
   patente, construção de quest, drop raro e as concedidas pela
   administração. Condecoração não é item — não vai para a vitrine da
   Minha loja nem para o Entreposto Quad.                              */
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
  await p.evaluate(() => document.getElementById('btnMochila').click()); await p.waitForTimeout(400);
};
const fechaMochila = async () => { await p.evaluate(() => document.getElementById('btnStorageFechar').click()); await p.waitForTimeout(200); };
const titulos = () => p.evaluate(() => window.__titulos().map(x => x.id));

await p.addInitScript(() => {
  try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {}
  window.__dropRng = () => 0.999;
});
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);

/* ============ A ÁREA EXISTE DENTRO DA MOCHILA ============ */
await abreMochila();
t('a mochila tem a área "Títulos e condecorações"',
  await p.evaluate(() => /Títulos e condecorações/.test(document.getElementById('storageLayer').textContent)));
t('e ela fica DEPOIS da grade de itens (área própria, não misturada)',
  await p.evaluate(() => {
    const grid = document.getElementById('storageGrid').getBoundingClientRect();
    const tit = document.getElementById('titGrade').getBoundingClientRect();
    return tit.top > grid.top;
  }));
t('o subtítulo conta quantas foram conquistadas do total',
  await p.evaluate(() => /2 condecorações conquistadas de 10/.test(document.getElementById('titSub').textContent)));
t('a grade mostra só as conquistadas, sem nenhuma trancada',
  await p.evaluate(() => document.querySelectorAll('#titGrade .tit-cel').length === 2 &&
                         document.querySelectorAll('#titGrade .tit-cel.trancado').length === 0));
t('as condecorações de partida são as concedidas pela coordenação',
  (await titulos()).join(',') === 'merito,questoes');

/* ============ VER TODAS REVELA O CAMINHO DAS OUTRAS ============ */
await p.evaluate(() => document.getElementById('btnTitMais').click());
await p.waitForTimeout(300);
t('"ver todas" mostra o catálogo inteiro, com as não conquistadas trancadas',
  await p.evaluate(() => document.querySelectorAll('#titGrade .tit-cel').length === 10 &&
                         document.querySelectorAll('#titGrade .tit-cel.trancado').length === 8));
await p.evaluate(() => document.querySelector('#titGrade .tit-cel.trancado').click());
await p.waitForTimeout(350);
const fTrancada = await p.evaluate(() => document.getElementById('itemLayer').textContent.replace(/\s+/g, ' '));
t('a ficha de uma trancada diz que ainda não foi conquistada e ensina como',
  /ainda não conquistada/.test(fTrancada) && /Como se conquista/.test(fTrancada));
t('e explica que condecoração não se vende',
  /Não é item/.test(fTrancada) && /não se vende/.test(fTrancada));
await p.evaluate(() => document.getElementById('btnItemFechar').click());
await p.waitForTimeout(200);
await p.evaluate(() => [...document.querySelectorAll('#titGrade .tit-cel')].find(x => !x.classList.contains('trancado')).click());
await p.waitForTimeout(350);
const fMinha = await p.evaluate(() => document.getElementById('itemLayer').textContent.replace(/\s+/g, ' '));
t('a ficha de uma conquistada mostra a data e a vitória que a deu',
  /conquistada em \d\d\/\d\d\/2026/.test(fMinha) && /A vitória que deu este título/.test(fMinha));
t('condecoração não tem botão de equipar nem de venda',
  await p.evaluate(() => document.getElementById('itemFichaAcoes').textContent.trim() === ''));
await p.evaluate(() => document.getElementById('btnItemFechar').click());
await p.waitForTimeout(200);
await p.evaluate(() => document.getElementById('btnTitMais').click());
await p.waitForTimeout(250);
t('o botão volta a mostrar só as minhas',
  await p.evaluate(() => document.querySelectorAll('#titGrade .tit-cel').length === 2));
await fechaMochila();

/* ============ CONDECORAÇÃO NÃO É ITEM: FORA DO COMÉRCIO ============ */
await p.evaluate(() => { document.getElementById('plusPop').classList.remove('on'); document.querySelector('#plusPop [data-goto="v-minha-loja"]').click(); });
await p.waitForTimeout(450);
t('nenhuma condecoração aparece no seletor de itens da Minha loja',
  await p.evaluate(() => !/Medalha|Condecoração|Título/.test(document.getElementById('mlItem').textContent)));
await nav('v-loja'); await p.waitForTimeout(450);
await p.evaluate(() => document.querySelector('#mercadoLista .mkt-loja.sistema').click());
await p.waitForTimeout(400);
t('nem na lista do Entreposto Quad — não dá para vender condecoração',
  await p.evaluate(() => !/Medalha|Condecoração|Título/.test(document.getElementById('sysLista').textContent)));
await p.evaluate(() => document.getElementById('btnSysFechar').click());
await p.waitForTimeout(200);

/* ============ VITÓRIA REAL CONCEDE TÍTULO: CONSTRUIR UMA QUEST ============ */
await p.evaluate(() => {
  window.__dropRng = () => 0.2;   /* a liga que falta cai no drop */
  window.__dropSortear('no treinamento rápido');
  window.__dropRng = () => 0.999;
  document.getElementById('dropLayer').classList.remove('on');
});
await p.waitForTimeout(300);
await nav('v-loja'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#questGrid [data-quest="blindado"]').click());
await p.waitForTimeout(350);
await comprarOk();
await p.waitForTimeout(300);
t('construir um item de quest concede o Título de Forjador',
  (await titulos()).includes('forjador'));
await abreMochila();
t('e ele entra na área de condecorações da mochila',
  await p.evaluate(() => /Forjador/.test(document.getElementById('titGrade').textContent)));
t('o contador de conquistadas sobe',
  await p.evaluate(() => /3 condecorações conquistadas/.test(document.getElementById('titSub').textContent)));
await p.evaluate(() => [...document.querySelectorAll('#titGrade .tit-cel')].find(x => /Forjador/.test(x.textContent)).click());
await p.waitForTimeout(350);
t('a ficha registra QUAL vitória deu o título',
  await p.evaluate(() => /construiu Blindado militar/.test(document.getElementById('itemFichaCorpo').textContent)));
await p.evaluate(() => document.getElementById('btnItemFechar').click());
await fechaMochila();

/* ============ DROP RARO TAMBÉM CONDECORA ============ */
await p.evaluate(() => {
  window.__dropRng = () => 0.05;   /* favorece o item mais raro do catálogo */
  window.__dropSortear('no simulado digital');
  window.__dropRng = () => 0.999;
  document.getElementById('dropLayer').classList.remove('on');
});
await p.waitForTimeout(400);
t('conquistar um item raro no drop concede o Título de Tocado pela Sorte',
  (await titulos()).includes('sortudo'));

/* ============ AS CONDECORAÇÕES APARECEM NO MEU PERFIL PÚBLICO ============ */
await p.evaluate(() => { document.getElementById('plusPop').classList.remove('on'); document.querySelector('#plusPop [data-goto="v-perfil"]').click(); });
await p.waitForTimeout(600);
await p.evaluate(() => document.querySelector('#rankSalaList .rk-row.me .rk-perf').click());
await p.waitForTimeout(450);
const nTit = (await titulos()).length;
t('o meu perfil público lista exatamente as condecorações que tenho',
  await p.evaluate(n => {
    const li = document.querySelectorAll('#perfPubCorpo .perf-med li').length;
    const tt = document.querySelector('#perfPubCorpo .item-bloco.efeito .ib-t').textContent;
    return li === n && tt.includes('Possui ' + n);
  }, nTit));
t('e o Forjador está entre elas',
  await p.evaluate(() => /Forjador/.test(document.getElementById('perfPubCorpo').textContent)));
await p.evaluate(() => document.getElementById('btnPerfPubFechar').click());
await p.waitForTimeout(250);

/* ============ AS CONDECORAÇÕES SOBREVIVEM AO F5 ============ */
await p.waitForTimeout(700);
await p.reload({ waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1200);
t('depois do F5 as condecorações conquistadas continuam lá',
  (await titulos()).includes('forjador') && (await titulos()).includes('sortudo'));
await abreMochila();
t('e a área da mochila as mostra',
  await p.evaluate(() => /Forjador/.test(document.getElementById('titGrade').textContent)));

console.log('\nvz7 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
