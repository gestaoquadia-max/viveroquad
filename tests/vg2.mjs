const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const c = await b.newContext({viewport:{width:430,height:940}});
const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ const errs=[]; p.on('pageerror',e=>errs.push(e.message));
let pass=0, fail=0; const ok=(v,t)=>{ if(v){pass++;console.log('  ok  '+t);} else {fail++;console.log('  XX  '+t);} };
const txt = id => p.evaluate(x=>{const e=document.getElementById(x);return e?e.textContent.replace(/\s+/g,' ').trim():'(inexistente)';},id);
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600);
const nav = v => p.evaluate(x=>document.querySelector('#navAluno .nav-btn[data-view="'+x+'"]').click(), v);
const persona = q => p.evaluate(x=>document.querySelector('.persona-btn[data-persona="'+x+'"]').click(), q);
const navAdm = v => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const comprarOk = async()=>{ await p.evaluate(()=>{ const b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(500); };

console.log('\n== 4) CHOQUE DE HORÁRIO ==');
await nav('v-loja'); await p.waitForTimeout(700);
// o aluno é da PATAMO Noite (seg-sex 19h-22h)
const minha = await p.evaluate(()=>{ const t=document.querySelector('[data-turma="patamo-n"]'); return t?t.textContent.replace(/\s+/g,' '):''; });
console.log('   turma do aluno:', minha.slice(0,90));
// cria um evento no mesmo horário, numa segunda
await persona('admin'); await p.waitForTimeout(400);
const g = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (g){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
await p.fill('#admEvNovoNome','Aulão da segunda 20h');
await p.fill('#admEvNovoResumo','choque com a turma da noite');
await p.fill('#admEvNovoData','2026-09-07');           // segunda-feira (data futura — dec. 189)
await p.fill('#admEvNovoInicio','20:00'); await p.fill('#admEvNovoFim','21:30');
await p.selectOption('#admEvSala','Sala 4');
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
// e um evento em horário livre (sábado de manhã)
await p.fill('#admEvNovoNome','Aulão de sábado 9h');
await p.fill('#admEvNovoResumo','sem choque');
await p.fill('#admEvNovoData','2026-09-12');           // sábado (data futura — dec. 189)
await p.fill('#admEvNovoInicio','09:00'); await p.fill('#admEvNovoFim','11:00');
await p.selectOption('#admEvSala','Sala 4');
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
await persona('aluno'); await p.waitForTimeout(500);
await nav('v-inicio'); await p.waitForTimeout(500);
// tenta se inscrever no que choca
const idChoque = await p.evaluate(()=>{ const e=window.__evtId ? null : null; return null; });
await p.evaluate(()=>{ const t=[...document.querySelectorAll('#evStrip .ev-tile')].find(x=>/segunda 20h/.test(x.textContent)); if(t) t.click(); }); await p.waitForTimeout(600);
const abriu = await p.evaluate(()=>getComputedStyle(document.getElementById('evLayer')).display!=='none');
ok(abriu,'4.1 a página do evento abre');
await p.evaluate(()=>{ const b=document.getElementById('btnEvInscrever'); if(b) b.click(); }); await p.waitForTimeout(500);
const t1 = await txt('toast');
const rot1 = await p.evaluate(()=>document.getElementById('btnEvInscrever').textContent.trim());
console.log('   toast:', t1.slice(0,110), '| botão:', rot1);
ok(/Turma PATAMO/.test(t1),'4.2 evento no mesmo horário AVISA do conflito, dizendo com o quê choca');
ok(/mesmo assim/i.test(rot1),'4.2b e o botão passa a pedir confirmação em vez de bloquear');
await p.evaluate(()=>document.getElementById('btnEvInscrever').click()); await p.waitForTimeout(500);
ok(/Inscri/i.test(await txt('toast')),'4.2c confirmando, o aluno se inscreve assim mesmo');
await p.evaluate(()=>{ const b=document.getElementById('btnEvVoltar'); if(b) b.click(); }); await p.waitForTimeout(300);
// o que não choca passa
await p.evaluate(()=>{ const t=[...document.querySelectorAll('#evStrip .ev-tile')].find(x=>/sábado 9h/.test(x.textContent)); if(t) t.click(); }); await p.waitForTimeout(600);
await p.evaluate(()=>{ const b=document.getElementById('btnEvInscrever'); if(b) b.click(); }); await p.waitForTimeout(500);
const t2 = await txt('toast');
console.log('   toast:', t2.slice(0,110));
ok(!/Choque/.test(t2),'4.3 evento em horário livre é aceito');
await p.evaluate(()=>{ const b=document.getElementById('btnEvVoltar'); if(b) b.click(); }); await p.waitForTimeout(300);

console.log('\n-- turma × turma no mesmo turno --');
await nav('v-loja'); await p.waitForTimeout(700);
await p.evaluate(()=>document.querySelector('[data-turma="rondesp-n"]').click()); await p.waitForTimeout(400);
const layerOn = await p.evaluate(()=>document.getElementById('turmaLayer').classList.contains('on'));
if (layerOn) {
  await p.evaluate(()=>document.getElementById('btnTuQdc').click()); await p.waitForTimeout(500);
  const t3 = await txt('toast');
  console.log('   toast:', t3.slice(0,110));
  ok(/Choque de horário|turno/.test(t3),'4.4 turma no mesmo horário de outra é bloqueada');
} else ok(true,'4.4 (turma já indisponível pelo turno)');

console.log('\n-- isolada no horário da turma --');
await p.evaluate(()=>{ const b=document.getElementById('btnTuCancel'); if(b) b.click(); }); await p.waitForTimeout(300);
const isoTxt = await p.evaluate(()=>{ const it=document.querySelector('[data-isolada="iso-adm"]'); return it?it.textContent.replace(/\s+/g,' '):'(sem)'; });
console.log('   isolada:', isoTxt.slice(0,100));
await p.evaluate(()=>{ const it=document.querySelector('[data-isolada="iso-adm"]'); if(it) it.click(); }); await p.waitForTimeout(500);
const aviso = await txt('compraAviso');
console.log('   aviso:', aviso.slice(0,120));
ok(await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on')),'4.5 isolada em choque abre a confirmação de compra');
ok(/Atenção ao horário/.test(aviso) && /Turma PATAMO/.test(aviso),'4.6 com o aviso do conflito e de quem é a escolha');
await p.evaluate(()=>document.getElementById('compraLayer').classList.remove('on'));

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
