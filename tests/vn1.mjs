/* vn1 — seletor de sala legível e reserva do Estúdio escolhida à mão:
   as opções trazem só o nome do espaço, o eco confere contra o dia e o
   horário digitados, e o evento online precisa SELECIONAR o Estúdio     */
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
const txt = id => p.evaluate(i => { const e = document.getElementById(i); return e ? e.textContent : ''; }, i => i, id).catch(() => '');
const T = id => p.evaluate(i => { const e = document.getElementById(i); return e ? e.textContent : ''; }, id);
const vis = id => p.evaluate(i => { const e = document.getElementById(i); return !!e && e.style.display !== 'none'; }, id);
const opcoes = id => p.evaluate(i => [...document.querySelectorAll('#' + i + ' option')].map(o => o.textContent), id);
const persona = q => p.evaluate(x => document.querySelector('.persona-btn[data-persona="' + x + '"]').click(), q);
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(700);
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
const el = await p.$('.phone');

/* ============ 1) TURMA: opção curta, eco que responde ao horário ============ */
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#jumpControle .jp[data-jump="turmas"]').click());
await p.waitForTimeout(300);
const opT = await opcoes('admCtSala');
t('turma: 5 opções — a pergunta e as 4 salas', opT.length === 5);
t('turma: nenhuma opção carrega a agenda no rótulo', !opT.some(o => /—/.test(o)));
t('turma: a 1ª opção é a pergunta', /Em qual sala a turma funciona\?/.test(opT[0]));
t('turma: o eco começa escondido', !await vis('admCtSalaEco'));

/* sem data/horário o eco não afirma nada — pede o resto */
await set('admCtSala', 'Sala 1');
t('sem dia e horário o eco pede o resto, não diz "está livre"',
  /Complete o/.test(await T('admCtSalaEco')) && !/está livre/.test(await T('admCtSalaEco')));
t('mesmo assim o eco lista quem já ocupa a sala', /Turma RONDESP|Turma|Isolada/.test(await T('admCtSalaEco')));

/* com o horário da PATAMO, a Sala 2 acusa o choque no próprio eco */
await set('admCtApelido', 'CORE');
await set('admCtConc', 'pcba');
await set('admCtIni', '2026-08-10'); await set('admCtFim', '2027-02-10');
await set('admCtH1i', '19:00'); await set('admCtH1f', '20:30'); await set('admCtH2f', '22:00');
await set('admCtSala', 'Sala 2');
t('com dia e horário o eco acusa o choque', /Sala 2/.test(await T('admCtSalaEco')) && /já tem/.test(await T('admCtSalaEco')) && /PATAMO/.test(await T('admCtSalaEco')));
await el.screenshot({ path: S + '/n1-eco-choque.png' });
/* de manhã a Sala 3 está livre — o eco vira verde sem sair do bloco */
await set('admCtH1i', '08:00'); await set('admCtH1f', '09:30'); await set('admCtH2f', '11:00');
await set('admCtSala', 'Sala 3');
t('mudar o horário reconfere a sala sozinho', /está livre/.test(await T('admCtSalaEco')) && /Sala 3/.test(await T('admCtSalaEco')));
t('o eco livre ainda diz o que a sala tem fora desse horário', /Fora dele/.test(await T('admCtSalaEco')));
await el.screenshot({ path: S + '/n1-eco-livre.png' });

/* isolada: a pergunta muda de nome e o eco usa os dias marcados */
await set('admCtTipo', 'ISOLADA'); await p.waitForTimeout(200);
const opI = await opcoes('admCtSala');
t('isolada: a pergunta do seletor fala da isolada', /Em qual sala a isolada funciona\?/.test(opI[0]));

/* ============ 2) EVENTO ONLINE: o Estúdio é ESCOLHIDO ============ */
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#jumpInterno .jp[data-jump="eventos"]').click());
await p.waitForTimeout(300);
const opEv = await opcoes('admEvSala');
t('evento presencial: só a pergunta e as 4 salas', opEv.length === 5 && !opEv.some(o => /—/.test(o)));
await set('admEvNovoModal', 'online'); await p.waitForTimeout(200);
const opOn = await opcoes('admEvSala');
t('evento online: o seletor oferece o Estúdio', opOn.length === 2 && /Estúdio/.test(opOn[1]));
t('evento online: o seletor NÃO vem travado', !await p.evaluate(() => document.getElementById('admEvSala').disabled));
t('evento online: nada é reservado antes de escolher', await p.evaluate(() => document.getElementById('admEvSala').value === ''));
t('evento online: sem escolha, o eco fica calado', !await vis('admEvSalaEco'));
t('o rótulo do bloco passa a falar do Estúdio', /Reserva do Estúdio/.test(await T('admEvReservaLb')));

await set('admEvNovoNome', 'Live de véspera');
await set('admEvNovoData', '2026-09-14');
await set('admEvNovoInicio', '19:00'); await set('admEvNovoFim', '21:00');
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
t('online sem o Estúdio selecionado NÃO cria', /Estúdio/.test(await T('admEvErro')) && /selecione/i.test(await T('admEvErro')));
t('o campo da reserva fica marcado em vermelho', await p.evaluate(() => document.getElementById('admEvSala').classList.contains('err')));
await set('admEvSala', 'Estúdio');
t('escolhido o Estúdio, o eco confere o dia e o horário', /Estúdio/.test(await T('admEvSalaEco')) && /livre nesse dia e horário/.test(await T('admEvSalaEco')));
await el.screenshot({ path: S + '/n1-estudio.png' });
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
t('com o Estúdio reservado, o evento online é criado', /criado para/.test(await T('admEvErro')) && /Estúdio reservado/.test(await T('admEvErro')));
t('depois de criar, o seletor volta vazio', await p.evaluate(() => document.getElementById('admEvSala').value === ''));

/* a reserva aparece no mapa das salas */
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#jumpControle .jp[data-jump="salas"]').click());
await p.waitForTimeout(300);
t('o mapa mostra o Estúdio reservado para a live', /Live de véspera/.test(await T('admSalasMapa')));

/* ============ 3) SIMULADO PRESENCIAL: mesma régua ============ */
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#jumpInterno .jp[data-jump="simulados"]').click());
await p.waitForTimeout(300);
const opS = await opcoes('admSimSala');
t('simulado: só a pergunta e as 4 salas', opS.length === 5 && !opS.some(o => /—/.test(o)));
t('simulado: a 1ª opção é a pergunta', /Em qual sala o simulado acontece\?/.test(opS[0]));
await set('admSimData', '2026-09-19');
await set('admSimIni', '08:00'); await set('admSimFim', '12:00');
await set('admSimSala', 'Sala 1');
t('simulado: o eco confere o sábado escolhido', /Sala 1/.test(await T('admSimSalaEco')) && /(livre|já tem)/.test(await T('admSimSalaEco')));

console.log('\nvn1 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
