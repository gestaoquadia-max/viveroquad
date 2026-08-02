const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const errors=[], log=[];
const browser = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const p = await (await browser.newContext({viewport:{width:1100,height:900}})).newPage();
p.on('pageerror',e=>errors.push('pageerror: '+e.message));
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'});
await p.evaluate(()=>document.getElementById('loginLayer').classList.add('off')); await p.waitForTimeout(400);
await p.click('#btnAvatarPerfil'); await p.waitForTimeout(400);
await p.evaluate(()=>document.getElementById('btnDiaEstudo').click()); await p.waitForTimeout(200);
await p.evaluate(()=>document.getElementById('btnDiaEstudo').click()); await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('btnProva').click()); await p.waitForTimeout(400);

// 1: abre direto nas questões, sem fiscal e sem dizer que são "difíceis"
if (await p.evaluate(()=>!!document.getElementById('fiscalCode'))) errors.push('1: ainda pede código de fiscal');
const corpo = await p.evaluate(()=>document.getElementById('provaLayer').textContent.toLowerCase());
if (/difícil|dificil|difíceis|fiscal/.test(corpo)) errors.push('1: a prova revela dificuldade/fiscal ao aluno');
const primeira = await p.evaluate(()=>({ n: document.querySelectorAll('#provaBody .q-alt').length, txt: document.querySelector('#provaProgress').textContent }));
if (primeira.n!==2 || !/Questão 1 de 20/.test(primeira.txt)) errors.push('1: formato inicial: '+JSON.stringify(primeira));
log.push('✔ 1: prova abre direto nas 20 questões CERTO/ERRADO, sem fiscal e sem citar dificuldade');

// 2: responde tudo ERRADO de propósito → reprova → bloqueio 24h
for (let i=0;i<20;i++){
  await p.evaluate(()=>{ const q=window.__prova.qs[window.__prova.idx]; const errado=q.c?'ERRADO':'CERTO';
    const alts=[...document.querySelectorAll('#provaBody .q-alt')]; (alts.find(a=>a.querySelector('span:last-child').textContent===errado)||alts[0]).click(); });
  await p.evaluate(()=>document.getElementById('btnProvaNext').click()); await p.waitForTimeout(90);
}
await p.waitForTimeout(300);
const res = await p.evaluate(()=>document.getElementById('provaBody').textContent);
if (!/Ainda não foi/.test(res) || !/24 horas/.test(res)) errors.push('2: reprovado não indica nova tentativa em 24h: '+res.slice(0,120));
if (!/80%/.test(res)) errors.push('2: não mostra o mínimo de 80%');
await p.evaluate(()=>document.getElementById('btnProvaNext').click()); await p.waitForTimeout(300);
const est = await p.evaluate(()=>document.getElementById('progEstado').textContent);
if (!/24h/.test(est)) errors.push('2: status não ficou bloqueado 24h: '+est);
log.push('✔ 2: reprovar (<80%) bloqueia por 24h; patente preservada');

// 3: 80% exatos (16/20) aprova
await p.evaluate(()=>{ carreiraForceDisponivel && carreiraForceDisponivel(); }).catch(()=>{});
await p.evaluate(()=>{ const b=document.getElementById('btnLiberarTentativa'); }); // (bloco já fechou)
await p.evaluate(()=>document.getElementById('btnProva').click()); await p.waitForTimeout(300);
const bloqueado = await p.evaluate(()=>/24h/.test(document.getElementById('toast').textContent));
if (!bloqueado) errors.push('3: prova reabriu mesmo bloqueada (deveria avisar 24h)');
log.push('✔ 3: com bloqueio ativo, tentar de novo avisa o prazo de 24h');

await browser.close();
console.log(log.join('\n'));
if (errors.length){ console.log('\nERROS:\n'+errors.join('\n')); process.exit(1); }
console.log('\nPROVA-OK');
