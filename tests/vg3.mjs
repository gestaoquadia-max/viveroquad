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
const comprarOk = async()=>{ await p.evaluate(()=>{ const b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(500); };

console.log('\n== 5) MENTORIA: era botão fixo, agora é item de catálogo com data ==');
await nav('v-loja'); await p.waitForTimeout(700);
const ment = await p.evaluate(()=>{ const el=document.querySelector('#lojaExtras-mentoria .loja-item[data-nome="Mentoria Quad"]'); return el?el.textContent.replace(/\s+/g,' '):'(sem)'; });
console.log('   mentoria:', ment);
ok(/Mentoria Quad/.test(ment),'5.1 a mentoria agora vem do catálogo (não é mais botão fixo no HTML)');
ok(!await p.evaluate(()=>!!document.querySelector('#v-loja .loja-grid > .loja-item[data-nome="Mentoria Quad"]')),'5.2 saiu do HTML fixo');
// comprada, entra em eventos e no calendário
// crédito manual da coordenação para cobrir a mentoria (900 Dmn)
await p.evaluate(()=>document.querySelector('.persona-btn[data-persona="admin"]').click()); await p.waitForTimeout(400);
{ const g = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
  if (g){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); } }
await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-controle"]').click()); await p.waitForTimeout(400);
await p.evaluate(()=>{ const s=document.getElementById('admCredAluno'); const o=[...s.options].find(x=>/MOURA/i.test(x.textContent))||s.options[0]; s.value=o.value; });
await p.selectOption('#admCredMoeda','dmn'); await p.fill('#admCredValor','2000');
await p.click('#btnAdmCred'); await p.waitForTimeout(400);
await p.evaluate(()=>document.querySelector('.persona-btn[data-persona="aluno"]').click()); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(600);
await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Mentoria Quad"]').click()); await p.waitForTimeout(400);
await comprarOk();
const compradaOk = await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Mentoria Quad"] .li-preco').textContent);
console.log('   depois da compra:', compradaOk);
ok(/ADQUIRIDO/.test(compradaOk),'5.3 mentoria comprada');
await p.evaluate(()=>document.querySelector('[data-goto="v-calendario"]').click()); await p.waitForTimeout(500);
ok(/Mentoria Quad/.test(await txt('calList')),'5.4 e entra no calendário do aluno (a regra que faltava)');
await nav('v-inicio'); await p.waitForTimeout(500);
ok(/Mentoria Quad/.test(await txt('evStrip')),'5.5 e nos Eventos da semana');

console.log('\n== 3) O QUE VENCE SOME DE TUDO, MENOS DO HISTÓRICO ==');
const antesStrip = await txt('evStrip');
const antesCal = await p.evaluate(()=>{ document.querySelector('[data-goto="v-calendario"]').click(); return 1; });
await p.waitForTimeout(400);
const calAntes = await txt('calList');
ok(/Mentoria Quad/.test(calAntes),'3.1 antes de vencer, está no calendário');
// empurra a data para o passado
await p.evaluate(()=>{
  window.__eventos().forEach(e=>{ if(/Mentoria Quad/.test(e.nome)){ e.dataISO='2020-01-10'; e.ate='2020-01-10'; } });
});
await nav('v-inicio'); await p.waitForTimeout(600);
const stripDepois = await txt('evStrip');
ok(!/Mentoria Quad/.test(stripDepois),'3.2 vencida, some do carrossel de eventos');
await nav('v-loja'); await p.waitForTimeout(600);
ok(!/Mentoria Quad/.test(await p.evaluate(()=>document.getElementById('lojaEventos-pres').textContent+document.getElementById('lojaEventos-dig').textContent)),'3.3 e não fica na vitrine de eventos');
await p.evaluate(()=>document.querySelector('[data-goto="v-calendario"]').click()); await p.waitForTimeout(500);
console.log('   calendário depois:', (await txt('calList')).slice(0,120));
ok(/Mentoria Quad[\s\S]*FALTOSO/.test(await txt('calList')),'3.4 vencida sem entrada registrada: fica no calendário como FALTOSO (dec. 192)');
// histórico permanece
await nav('v-loja'); await p.waitForTimeout(500);
const hist = await txt('lojaEstornos');
console.log('   histórico de compras:', hist.slice(0,110));
ok(/Mentoria Quad/.test(hist),'3.5 mas continua no histórico de compras do aluno');
// e no log do admin
await p.evaluate(()=>document.querySelector('.persona-btn[data-persona="admin"]').click()); await p.waitForTimeout(400);
const g2 = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (g2){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-alunos"]').click()); await p.waitForTimeout(500);
await p.evaluate(()=>{ const t=[...document.querySelectorAll('#relTabs .rel-tab')].find(x=>/Loja/.test(x.textContent)); if(t) t.click(); }); await p.waitForTimeout(400);
ok(/Mentoria Quad/.test(await txt('admComprasList')),'3.6 e no log de compradores da coordenação');
// evento vencido também sai do carrossel para eventos gerais
const venc = await p.evaluate(()=>{
  const evs=window.__eventos();
  const alvo=evs.find(e=>e.id==='semana-insana');
  if(!alvo) return null;
  alvo.dataISO='2020-01-01'; alvo.ate='2020-01-02';
  return alvo.nome;
});
await p.evaluate(()=>document.querySelector('.persona-btn[data-persona="aluno"]').click()); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(600);
if (venc) ok(!new RegExp(venc).test(await p.evaluate(()=>document.getElementById('lojaEventos-pres').textContent)),'3.7 evento pago vencido sai da Loja');
else ok(true,'3.7 (sem evento de vários dias)');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
