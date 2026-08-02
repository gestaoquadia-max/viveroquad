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
const persona = q => p.evaluate(x=>document.querySelector('.persona-btn[data-persona="'+x+'"]').click(), q);
const navAdm = v => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const navProf = v => p.evaluate(x=>document.querySelector('#navProfessor .nav-btn[data-view="'+x+'"]').click(), v);
const nav = v => p.evaluate(x=>document.querySelector('#navAluno .nav-btn[data-view="'+x+'"]').click(), v);

console.log('\n== 4) AULÃO ESPECIAL VIRA EVENTO DE VERDADE ==');
await nav('v-loja'); await p.waitForTimeout(700);
ok(!await p.evaluate(()=>!!document.querySelector('.loja-item[data-nome="Aulão especial"]')),'4.1 o botão fixo saiu da loja');
const evPres = await p.evaluate(()=>document.getElementById('lojaEventos-pres').textContent.replace(/\s+/g,' '));
console.log('   eventos presenciais na loja:', evPres.slice(0,140));
ok(/Aulão especial/.test(evPres),'4.2 agora ele vem da lista de eventos');
ok(/com Prof\.ª Ritha Galvão/.test(evPres),'4.3 e traz o professor, como os demais eventos');
const strip = await txt('evStrip');
ok(/Aulão especial/.test(strip),'4.4 entra no carrossel de eventos da semana');
// compra → INSCRITO e calendário
await p.evaluate(()=>{ const b=document.querySelector('[data-ev-buy="aulao-especial"]'); b.click(); }); await p.waitForTimeout(500);
const okBtn = await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on'));
if (okBtn) { await p.evaluate(()=>document.getElementById('btnCompraOk').click()); await p.waitForTimeout(500); }
ok(!/Aulão especial/.test(await p.evaluate(()=>document.getElementById('lojaEventos-pres').textContent)),'4.5 comprado sai da vitrine, como todo evento pontual');
await p.evaluate(()=>document.querySelector('[data-goto="v-calendario"]').click()); await p.waitForTimeout(500);
ok(/Aulão especial/.test(await txt('calList')),'4.6 e entra no calendário do aluno');

console.log('\n== 3) RECADO NA COMUNICAÇÃO COM A RECEPÇÃO ==');
await persona('admin'); await p.waitForTimeout(400);
const g = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (g){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await p.selectOption('#admMsgTipo','prof'); await p.waitForTimeout(200);
await p.selectOption('#admMsgAluno','prof:Cap. Silva');
await p.fill('#admMsgTexto','Sua aula de quinta muda para a SALA 2.');
await p.click('#btnAdmMsg'); await p.waitForTimeout(300);
ok(/Comunicação com a recepção/.test(await txt('toast')),'3.1 o admin sabe para onde o recado vai');
await persona('professor'); await p.waitForTimeout(500);
await p.fill('#profEmail','silva@quadconcursos.com.br'); await p.fill('#profSenha','quad1234');
await p.click('#btnProfEntrar'); await p.waitForTimeout(600);
ok(await p.evaluate(()=>document.getElementById('profRecBadgeNav').style.display!=='none'),'3.2 a aba Recepção acende o contador');
await navProf('v-prof-chat'); await p.waitForTimeout(500);
const chat = await txt('profRecadosCard');
console.log('   recepção:', chat.slice(0,150));
ok(/Comunicação com a recepção/.test(chat),'3.3 o recado mora no bloco da recepção (não num card separado)');
ok(/SALA 2/.test(chat),'3.4 o recado do admin chegou');
ok(await p.evaluate(()=>document.getElementById('btnProfChat').disabled),'3.5 a resposta segue desativada (V1)');
await p.waitForTimeout(1100);
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
ok(/LIDA/.test(await txt('admMsgList')),'3.6 o admin vê que o professor leu');

console.log('\n== 1) APAGAR PROFESSOR DO BANCO ==');
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
const n0 = await p.evaluate(()=>document.querySelectorAll('#admDocList .adm-bar').length);
ok(await p.evaluate(()=>!!document.querySelector('#admDocList [data-doc-rm]')),'1.1 existe o ✕ de apagar');
await p.evaluate(()=>{ const r=[...document.querySelectorAll('#admDocList .adm-bar')].find(x=>/Prof\.ª Ana Beatriz/.test(x.textContent)); r.querySelector('[data-doc-rm]').click(); }); await p.waitForTimeout(300);
ok((await p.evaluate(()=>document.querySelectorAll('#admDocList .adm-bar').length))===n0,'1.2 o primeiro toque NÃO apaga');
ok(/definitivo/.test(await txt('toast')),'1.3 e avisa que é definitivo');
await p.evaluate(()=>{ const r=[...document.querySelectorAll('#admDocList .adm-bar')].find(x=>/Prof\.ª Ana Beatriz/.test(x.textContent)); r.querySelector('[data-doc-rm]').click(); }); await p.waitForTimeout(400);
const n1 = await p.evaluate(()=>document.querySelectorAll('#admDocList .adm-bar').length);
ok(n1===n0-1 && !/Ana Beatriz/.test(await txt('admDocList')),'1.4 o segundo toque apaga o cadastro');
ok(!/Ana Beatriz/.test(await p.evaluate(()=>[...document.querySelectorAll('#admEvProfs [data-ev-prof]')].map(b=>b.dataset.evProf).join(','))),'1.5 e ela sai dos chips de evento');
// apagar quem está em evento tira o nome do evento
await navAdm('v-adm-hoje'); await p.waitForTimeout(300);
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.evaluate(()=>{ const r=[...document.querySelectorAll('#admDocList .adm-bar')].find(x=>/Ritha/.test(x.textContent)); r.querySelector('[data-doc-rm]').click(); }); await p.waitForTimeout(250);
await p.evaluate(()=>{ const r=[...document.querySelectorAll('#admDocList .adm-bar')].find(x=>/Ritha/.test(x.textContent)); r.querySelector('[data-doc-rm]').click(); }); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
ok(!/Ritha/.test(await txt('admEvList')),'1.6 apagar tira o professor também dos eventos em que estava');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
