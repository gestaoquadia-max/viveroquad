const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const p = await (await b.newContext({ viewport:{width:430,height:900}, deviceScaleFactor:2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
const fails = []; const ok = (c,m)=>{ console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
await p.addInitScript(() => { window.__dropRng = () => 0.999; });   /* sem drop aleatório no teste */
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil:'load' });
await p.evaluate(()=>document.getElementById('loginLayer').classList.add('off'));
await p.waitForTimeout(600);
const el = await p.$('.phone');

// abre missões: card Treinamento Rápido + ondas
await p.click('.nav-btn[data-view="v-missoes"]'); await p.waitForTimeout(400);
ok(await p.evaluate(()=>!!document.getElementById('btnTreinoRapido')), 'card Treinamento Rápido no lugar da Nova missão');
ok(await p.evaluate(()=>document.querySelectorAll('#diaList .mission-row').length)===8, '8 blocos de rápidas no Hoje (2 aulas × D0, D+1, D+7, D+30)');
ok(await p.evaluate(()=>!document.getElementById('ondasList')), 'card avulso de ondas removido');
const rots = await p.evaluate(()=>[...document.querySelectorAll('#diaList .t')].map(e=>e.textContent));
console.log('   rápidas:', rots.join(' | '));
ok(rots[0].includes('Dir. Constitucional') && rots[1].includes('Matemática'), 'blocos 2 e 3 = as duas aulas de hoje');
const semInterno = await p.evaluate(()=>{ const t=document.querySelector('#diaList').parentElement.parentElement.textContent; return !t.includes('22h15') && !t.includes('demo') && !t.includes('D+'); });
ok(semInterno, 'sem regras internas na tela (22h15/demo/D+)');
const roll = await p.evaluate(()=>{ const d=document.querySelector('.dia-scroll'); return { ch: d.clientHeight, sh: d.scrollHeight }; });
ok(roll.ch <= 280 && roll.sh > roll.ch, 'lista rola dentro do card (tamanho médio: ' + roll.ch + 'px de ' + roll.sh + 'px)');
await el.screenshot({ path: OUT+'/tr-01-missoes.png' });

// abre o treinamento — rodízio de GERAIS na ordem: PT → EN → INFO → MAT
await p.click('#btnTreinoRapido'); await p.waitForTimeout(400);
const fila = await p.evaluate(()=>[...document.querySelectorAll('.tr-fila-row .nm')].map(e=>e.textContent));
console.log('   fila gerais:', fila.join(' | '));
ok(fila.length===4 && fila[0].includes('Língua Portuguesa') && fila[1].includes('Inglesa') && fila[2].includes('Informática') && fila[3].includes('Matemática'), 'rodízio alterna as matérias gerais (1º assunto de cada)');
await el.screenshot({ path: OUT+'/tr-02-rodizio.png' });

// responde o 1º bloco (PT): erra a 1ª de propósito, acerta as demais
const scoreAntes = await p.evaluate(()=>document.getElementById('xpNum').textContent);
const coinsAntes = await p.evaluate(()=>document.getElementById('scoreVal').textContent);
const domAntes = await p.evaluate(()=>document.querySelector('#editalTree .ed-mat .ed-ass .ed-head .ed-pc').textContent);
await p.click('#btnTrComecar'); await p.waitForTimeout(300);
for (let i=0;i<10;i++){
  const gab = await p.evaluate(()=>{
    const certoBtn = document.getElementById('fcCerto');
    return window.__gab = null, certoBtn ? true : false;
  });
  // lê o gabarito da carta via banco: responder correto = clicar no botão que bate com c.c — simulamos acertando sempre, menos a 1ª
  const cardTxt = await p.evaluate(()=>document.querySelector('.fc-enun').textContent);
  const certoEh = await p.evaluate(t=>{
    const c = window.TR_BANK.find(x=>x.t===t); return c ? c.c : true;
  }, cardTxt);
  const acertar = i !== 0;
  const clicarCerto = acertar ? certoEh : !certoEh;
  await p.click(clicarCerto ? '#fcCerto' : '#fcErrado'); await p.waitForTimeout(250);
  if (i===0) {
    ok(await p.evaluate(()=>!!document.querySelector('.fc-verd.bad')), 'feedback imediato: errou aparece na hora');
    await el.screenshot({ path: OUT+'/tr-03-flashcard.png' });
  }
  // avalia: Errei se errou, Bom se acertou
  await p.evaluate(n=>{ document.querySelector('[data-nota="'+n+'"]').click(); }, acertar? 2 : 0);
  await p.waitForTimeout(250);
}
const resumo = await p.evaluate(()=>document.getElementById('trBody').textContent);
ok(resumo.includes('9 de 10') && resumo.includes('+9 score') && resumo.includes('+5 Quad Coins'), 'resumo do bloco: 9/10, +9 score, +5 QdC');
ok(resumo.includes('Interpretação de textos'), 'resumo cita o Domínio atualizado');
await el.screenshot({ path: OUT+'/tr-04-resumo.png' });
const scoreDepois = await p.evaluate(()=>document.getElementById('xpNum').textContent);
const coinsDepois = await p.evaluate(()=>document.getElementById('scoreVal').textContent);
console.log('   score', scoreAntes.trim(), '→', scoreDepois.trim(), '| coins', coinsAntes, '→', coinsDepois);
ok(scoreDepois.trim().startsWith('629'), 'score 620 → 629 (+9)');
ok(coinsDepois==='1.245', 'coins 1.240 → 1.245 (+5)');

// próximo assunto = Inglês
await p.click('#btnTrProx'); await p.waitForTimeout(300);
const prox = await p.evaluate(()=>document.getElementById('trBody').textContent);
ok(prox.includes('Próximo:') && prox.includes('Língua Inglesa'), 'rodízio avança para o Inglês');

// Domínio atualizou (barra de Português mudou)
const domDepois = await p.evaluate(()=>document.querySelector('#editalTree .ed-mat .ed-ass .ed-head .ed-pc').textContent);
console.log('   domínio Português:', domAntes, '→', domDepois);
ok(domAntes !== domDepois, 'barra do assunto Interpretação de textos mudou com o treino');

// aba Específicas: 1º deck = Dir. Constitucional
await p.click('#tabTrEsp'); await p.waitForTimeout(300);
const filaE = await p.evaluate(()=>[...document.querySelectorAll('.tr-fila-row .nm')].map(e=>e.textContent));
console.log('   fila específicas:', filaE.join(' | '));
ok(filaE[0].includes('Princípios fundamentais'), 'específicas começam em Dir. Constitucional');
ok(!filaE.some(t=>t.includes('Poderes administrativos')), 'Poderes ainda NÃO está no banco (aula não respondida)');
await p.click('#btnTrSair'); await p.waitForTimeout(300);

// RÁPIDA D+1 da aula (demo): responde as 10 → FEITO e cartas entram no banco
await p.click('.nav-btn[data-view="v-missoes"]'); await p.waitForTimeout(300);
await p.evaluate(()=>document.querySelector('[data-dia="2"]').click()); await p.waitForTimeout(400);
ok((await p.evaluate(()=>document.getElementById('trTitulo').textContent)).includes('Dir. Administrativo'), 'rápida abre com o rótulo da revisão D+1');
for (let i=0;i<10;i++){
  const cardTxt = await p.evaluate(()=>document.querySelector('.fc-enun').textContent);
  const certoEh = await p.evaluate(t=>{ const c=window.AULA_DEMO.cards.find(x=>x[1]===t); return c ? c[0]==='C' : true; }, cardTxt);
  await p.click(certoEh ? '#fcCerto' : '#fcErrado'); await p.waitForTimeout(220);
  await p.evaluate(()=>{ document.querySelector('[data-nota="3"]').click(); }); await p.waitForTimeout(220);
}
const resOnda = await p.evaluate(()=>document.getElementById('trBody').textContent);
ok(resOnda.includes('10 de 10') && resOnda.includes('entraram no banco'), 'revisão D+1: 10/10 e rápidas migram para o banco');
await p.click('#btnTrProx'); await p.waitForTimeout(300);
ok(await p.evaluate(()=>document.querySelectorAll('#diaList .mission-row').length)===7, 'bloco concluído desaparece da lista (8 → 7)');
// agora Poderes aparece nas Específicas
await p.click('#btnTreinoRapido'); await p.waitForTimeout(300);
await p.click('#tabTrEsp'); await p.waitForTimeout(300);
const filaE2 = await p.evaluate(()=>[...document.querySelectorAll('.tr-fila-row .nm')].map(e=>e.textContent));
ok(filaE2.some(t=>t.includes('Poderes administrativos')), 'após a rápida, Poderes entrou no banco das Específicas');
await el.screenshot({ path: OUT+'/tr-05-especificas.png' });
// ATRASADAS: blocos com +7 dias caem lá; recuperar faz sumir
await p.click('#btnTrSair'); await p.waitForTimeout(300);
await p.click('.nav-btn[data-view="v-missoes"]'); await p.waitForTimeout(300);
ok(await p.evaluate(()=>document.querySelectorAll('#atrasadasList .mission-row').length)===3, '3 blocos atrasados (8, 9 e 10 dias)');
ok(await p.evaluate(()=>!!document.querySelector('#atrasadasList').closest('.dia-scroll')), 'Atrasadas na mesma configuração (rolagem interna)');
await p.evaluate(()=>document.querySelector('#atrasadasList [data-dia]').click()); await p.waitForTimeout(400);
for (let i=0;i<10;i++){
  const cardTxt = await p.evaluate(()=>document.querySelector('.fc-enun').textContent);
  const certoEh = await p.evaluate(t=>{ const c=window.TR_BANK.find(x=>x.t===t); return c ? c.c : true; }, cardTxt);
  await p.click(certoEh ? '#fcCerto' : '#fcErrado'); await p.waitForTimeout(200);
  await p.evaluate(()=>{ document.querySelector('[data-nota="2"]').click(); }); await p.waitForTimeout(200);
}
await p.evaluate(()=>document.getElementById('btnTrProx').click()); await p.waitForTimeout(400);
ok(await p.evaluate(()=>document.querySelectorAll('#atrasadasList .mission-row').length)===2, 'recuperada: atrasada some da lista (3 → 2)');
// SIMULADOS: enviados aparecem, mesma configuração
// os simulados usam .sim-row desde a Fase A (o layout mudou)
const nSim = await p.evaluate(()=>document.querySelectorAll('#simuladosList .sim-row').length);
ok(nSim===3, '3 simulados enviados aparecem ('+nSim+')');
ok(await p.evaluate(()=>!!document.querySelector('#simuladosList').closest('.dia-scroll')), 'Simulados na mesma configuração (rolagem interna)');
// o simulado digital deixou de ser "chega na V1": abre o quiz cronometrado de verdade
await p.evaluate(()=>{ const bts=[...document.querySelectorAll('#simuladosList [data-sim]')]; const alvo=bts.find(x=>/Responder/.test(x.textContent)); if(alvo) alvo.click(); }); await p.waitForTimeout(700);
ok(await p.evaluate(()=>document.getElementById('simDigLayer').classList.contains('on')), 'simulado digital abre o quiz cronometrado');
await p.evaluate(()=>{ const l=document.getElementById('simDigLayer'); if(l) l.classList.remove('on'); }); await p.waitForTimeout(200);
await el.screenshot({ path: OUT+'/missoes-completo.png' });
console.log('erros:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
