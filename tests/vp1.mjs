/* vp1 — Quadrômetro sem o atalho da loja, privacidade de mão dupla no
   ranking e canal de materiais da aula (admin publica → aluno recebe)  */
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
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const abrir = (h, k) => p.evaluate(a => {
  const bl = document.querySelector('[data-bl="' + a.k + '"]');
  if (!bl || bl.style.display === 'none') document.querySelector('#' + a.h + ' .jp[data-jump="' + a.k + '"]').click();
}, { h, k });
const irMateriais = () => p.evaluate(() => {
  document.getElementById('plusPop').classList.remove('on');
  const bt = [...document.querySelectorAll('#plusPop [data-goto]')].find(x => /Materiais/.test(x.textContent));
  bt.click();
});
const linhasRk = () => p.evaluate(() => [...document.querySelectorAll('#rankGeralList .rk-row')].map(r => r.textContent.replace(/\s+/g, ' ')));
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(900);
const el = await p.$('.phone');

/* ============ 1) O QUADRÔMETRO NÃO REPETE A LOJA ============ */
await p.evaluate(() => document.querySelector('[data-goto="v-perfil"]').click());
await p.waitForTimeout(500);
const perfil = await T('v-perfil');
t('o card "Quad Store · onde o esforço vira avanço" saiu do Quadrômetro', !/onde o esforço vira avanço/.test(perfil));
t('o botão "Ir para a Quad Store" saiu junto', await p.evaluate(() => !document.getElementById('btnIrLoja')));
t('o Quadrômetro segue de pé com o resto', /Jornada de patentes/.test(perfil) && /Minhas turmas/.test(perfil));
t('a loja continua acessível pela barra de navegação',
  await p.evaluate(() => !!document.querySelector('#navAluno .nav-btn[data-view="v-loja"]')));

/* ============ 2) PRIVACIDADE DE MÃO DUPLA ============ */
t('o interruptor começa em público', await p.evaluate(() => document.getElementById('btnPriv').getAttribute('aria-checked') === 'false'));
t('o texto do público explica que ele vê quem está público',
  /vê o nome de quem também está público/.test(await T('privDesc')));
await p.evaluate(() => document.getElementById('rkGeralBtn').click());
await p.waitForTimeout(300);
const pub = await linhasRk();
const fora10Pub = pub.slice(11);
t('público: quem também é público aparece por inteiro', fora10Pub.some(x => !/\*/.test(x)));
t('público: quem escolheu privado continua mascarado', fora10Pub.some(x => /\*/.test(x)));
t('público: o top 10 aparece por inteiro', pub.slice(0, 10).every(x => !/\*/.test(x)));
await el.screenshot({ path: S + '/p1-rank-publico.png' });

await p.evaluate(() => document.getElementById('btnPriv').click());
await p.waitForTimeout(400);
t('o texto do privado explica a mão dupla', /também não vê o nome de ninguém/.test(await T('privDesc')));
t('o toast conta os dois lados da troca', /deixa de ver os outros/.test(await T('toast')));
await p.evaluate(() => { if (!document.getElementById('rankGeralList').textContent.includes('···')) document.getElementById('rkGeralBtn').click(); });
await p.waitForTimeout(300);
const priv = await linhasRk();
const fora10Priv = priv.slice(11).filter(x => !/· você/.test(x));
t('privado: ninguém do 11º em diante aparece por inteiro', fora10Priv.length > 0 && fora10Priv.every(x => /\*/.test(x)));
t('privado: o top 10 continua visível para ele', priv.slice(0, 10).every(x => !/\*/.test(x)));
t('privado: o próprio nome sai mascarado, como os outros veem',
  priv.some(x => /· você/.test(x) && /\*/.test(x)));
t('privado: os pontos de todo mundo continuam à vista', fora10Priv.every(x => /pts/.test(x)));
await el.screenshot({ path: S + '/p1-rank-privado.png' });
/* voltar a público devolve os nomes de quem é público */
await p.evaluate(() => document.getElementById('btnPriv').click());
await p.waitForTimeout(400);
await p.evaluate(() => { if (!document.getElementById('rankGeralList').textContent.includes('···')) document.getElementById('rkGeralBtn').click(); });
await p.waitForTimeout(300);
const volta = (await linhasRk()).slice(11);
t('voltar a público devolve os nomes públicos', volta.some(x => !/\*/.test(x)));
t('e quem é privado segue escondido', volta.some(x => /\*/.test(x)));

/* ============ 3) MATERIAIS: DO ADMIN PARA O ALUNO ============ */
await irMateriais(); await p.waitForTimeout(400);
const mat0 = await T('matLista');
t('o aluno vê os materiais agrupados por matéria e assunto',
  /Direito Administrativo — Poderes/.test(mat0) && /Língua Portuguesa — Crase/.test(mat0));
t('cada material diz o tipo e desde quando está no ar', /PDF · 24 págs · ontem/.test(mat0));
t('o assunto novo leva o selo NOVO', /Poderes NOVO/.test(mat0));

await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
t('o atalho passou a se chamar "Atualizações do dia"',
  (await p.evaluate(() => document.querySelector('#jumpInterno .jp[data-jump="crono"]').textContent)) === 'Atualizações do dia');
await abrir('jumpInterno', 'crono'); await p.waitForTimeout(400);
t('o atalho abre o cronograma E o envio de materiais',
  await p.evaluate(() => [...document.querySelectorAll('[data-bl="crono"]')].length === 2 &&
    [...document.querySelectorAll('[data-bl="crono"]')].every(x => x.style.display !== 'none')));
t('o bloco de materiais fica abaixo do cronograma', await p.evaluate(() => {
  const bs = [...document.querySelectorAll('[data-bl="crono"]')];
  return /Cronograma semanal/.test(bs[0].textContent) && /Materiais da aula/.test(bs[1].textContent);
}));
t('a turma do material sai da lista de turmas abertas',
  (await p.evaluate(() => [...document.querySelectorAll('#admMatTurma option')].map(o => o.textContent).join('|')))
    === 'Turma RONDESP|Turma PATAMO|Turma BOPE|Turma RONDESP Manhã|Turma BOPE Manhã');
await set('admMatTurma', 'patamo-n'); await p.waitForTimeout(150);
t('a matéria sai da árvore do edital da turma escolhida', await p.evaluate(() => {
  const t = [...document.querySelectorAll('#admMatMateria option')].map(o => o.textContent);
  const arv = window.__arvoreDe('cfo');
  return JSON.stringify(t) === JSON.stringify(arv);
}));
await set('admMatTurma', 'rondesp-m'); await p.waitForTimeout(150);
t('trocar a turma troca a árvore (Soldado tem 4 matérias)', await p.evaluate(() => {
  const t = [...document.querySelectorAll('#admMatMateria option')].map(o => o.textContent);
  return JSON.stringify(t) === JSON.stringify(window.__arvoreDe('sdba'));
}));

/* validação: o aviso fica no bloco dizendo o que falta */
await set('admMatTurma', 'patamo-n'); await p.waitForTimeout(150);
await p.click('#btnAdmMat'); await p.waitForTimeout(300);
t('sem assunto não envia', /assunto da aula/i.test(await T('admMatErro')));
t('o campo do assunto fica marcado', await p.evaluate(() => document.getElementById('admMatAssunto').classList.contains('err')));
await set('admMatAssunto', 'Poder de polícia');
await p.click('#btnAdmMat'); await p.waitForTimeout(300);
t('sem arquivo não envia', /Anexe o/i.test(await T('admMatErro')));
await set('admMatTipo', 'video');
t('escolher vídeo troca o anexo pelo link', await p.evaluate(() =>
  document.getElementById('admMatLinkBox').style.display !== 'none' &&
  document.getElementById('admMatArqBox').style.display === 'none'));
await p.click('#btnAdmMat'); await p.waitForTimeout(300);
t('vídeo sem link não envia', /link/i.test(await T('admMatErro')));
await set('admMatLink', 'meet.quad/aula');
await p.click('#btnAdmMat'); await p.waitForTimeout(300);
t('link sem http é recusado', /http/i.test(await T('admMatErro')));
await set('admMatLink', 'https://meet.quad/aula'); await set('admMatDur', '22');
await set('admMatMateria', 'Direito Administrativo');
await p.click('#btnAdmMat'); await p.waitForTimeout(400);
const okMat = await T('admMatErro');
t('publicado: a confirmação diz matéria, assunto e turma',
  /Direito Administrativo — Poder de polícia/.test(okMat) && /Turma PATAMO/.test(okMat));
t('publicado: a confirmação diz onde o aluno acha', /Materiais das aulas/.test(okMat));
t('o material entra na lista de publicados', /Poder de polícia/.test(await T('admMatList')));
t('o formulário volta limpo para o próximo envio',
  await p.evaluate(() => document.getElementById('admMatAssunto').value === '' && document.getElementById('admMatLink').value === ''));
await el.screenshot({ path: S + '/p1-mat-admin.png' });

/* o aluno da PATAMO recebe */
await persona('aluno'); await p.waitForTimeout(400);
await irMateriais(); await p.waitForTimeout(400);
const mat1 = await T('matLista');
t('o aluno da turma recebe o material novo', /Direito Administrativo — Poder de polícia/.test(mat1));
t('o material novo vem com o selo NOVO e a duração', /Poder de polícia NOVO/.test(mat1) && /22 min/.test(mat1));
t('os materiais antigos continuam lá', /Língua Portuguesa — Crase/.test(mat1));
await el.screenshot({ path: S + '/p1-mat-aluno.png' });
t('abrir o material responde', await p.evaluate(() => {
  document.querySelector('#matLista .mat-dl').click();
  return /Abrindo/.test(document.getElementById('toast').textContent);
}));

/* material de OUTRA turma não vaza para quem não está nela */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await abrir('jumpInterno', 'crono'); await p.waitForTimeout(300);
await set('admMatTurma', 'bope-m'); await p.waitForTimeout(150);
await set('admMatMateria', 'Língua Portuguesa'); await set('admMatAssunto', 'Regência');
await set('admMatTipo', 'video'); await set('admMatLink', 'https://meet.quad/regencia');
await p.click('#btnAdmMat'); await p.waitForTimeout(400);
t('material publicado para outra turma entra na lista do admin', /Regência/.test(await T('admMatList')));
await persona('aluno'); await p.waitForTimeout(400);
await irMateriais(); await p.waitForTimeout(400);
t('o aluno NÃO vê material de turma em que não está', !/Regência/.test(await T('matLista')));

/* tirar do ar some para o aluno */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await abrir('jumpInterno', 'crono'); await p.waitForTimeout(300);
await p.evaluate(() => {
  const b = [...document.querySelectorAll('#admMatList [data-rm-mat]')]
    .find(x => /Poder de polícia/.test(x.closest('.adm-bar').textContent));
  b.click();
});
await p.waitForTimeout(300);
t('tirar do ar avisa que o aluno não vê mais', /saiu do ar/.test(await T('toast')));
await persona('aluno'); await p.waitForTimeout(400);
await irMateriais(); await p.waitForTimeout(400);
t('o material retirado some da tela do aluno', !/Poder de polícia/.test(await T('matLista')));

console.log('\nvp1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
