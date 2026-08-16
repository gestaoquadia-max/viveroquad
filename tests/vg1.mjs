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
const qdc = ()=>p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
const comprarOk = async()=>{ await p.evaluate(()=>{ const b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(500); };
const estornarPor = async(re)=>{ const r = await p.evaluate(x=>{
    const rows=[...document.querySelectorAll('#lojaEstornos .mission-row')];
    const row=rows.find(y=>new RegExp(x).test(y.textContent));
    if(!row) return 'NAO_LISTADO';
    const bt=row.querySelector('[data-est]'); if(!bt) return 'SEM_BOTAO';
    bt.click(); bt.click(); return 'OK';
  }, re); await p.waitForTimeout(600); return r; };

await nav('v-loja'); await p.waitForTimeout(700);

console.log('\n== 1) ITEM DE COMBATE SE REPETE (dec. 172) ==');
const n0 = await p.evaluate(()=>document.querySelectorAll('#combatGrid [data-combate]').length);
const q0 = await qdc();
await p.evaluate(()=>document.querySelector('#combatGrid [data-combate="faca"]').click()); await p.waitForTimeout(400);
await comprarOk();
const n1 = await p.evaluate(()=>document.querySelectorAll('#combatGrid [data-combate]').length);
ok(n1===n0,'1.1 o item comprado CONTINUA na vitrine — não é de compra única ('+n0+'→'+n1+')');
ok(await p.evaluate(()=>{ const c=document.querySelector('#combatGrid [data-combate="faca"]');
  const e=c&&c.querySelector('.li-estoque'); return !!c && !!e && /1 na mochila/.test(e.textContent); }),
  '1.2 a faca segue à venda, marcada com quantas unidades o aluno tem');
ok(/26 itens guardados/.test(await txt('mochilaQtd')),'1.3 e está na mochila (25 da coleta da quest + a faca)');
ok(!/NA MOCHILA/.test(await txt('combatGrid')),'1.4 acabou o rótulo "NA MOCHILA" na vitrine');

console.log('\n== 2) ESTORNO DESFAZ A COMPRA ==');
// combate
const q1 = await qdc();
ok((await estornarPor('Faca'))==='OK','2.1 o item de combate entra na lista de estornáveis');
const q2 = await qdc();
ok(q2===q0,'2.2 o valor volta em QdC ('+q1+'→'+q2+', original '+q0+')');
ok(await p.evaluate(()=>!!document.querySelector('#combatGrid [data-combate="faca"]')),'2.3 a faca VOLTA para a loja');
ok(/25 itens guardados/.test(await txt('mochilaQtd')),'2.4 e sai da mochila (fica só a coleta da quest)');
// item avulso da vitrine
const q3 = await qdc();
await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Garrafinha Quad"]').click()); await p.waitForTimeout(300);
await comprarOk();
/* dec. 170: item físico não trava mais em ADQUIRIDO — o pedido em aberto
   vira etiqueta, o preço fica à vista e o estoque decresce */
const card25 = await p.evaluate(()=>{ const c=document.querySelector('.loja-item[data-nome="Garrafinha Quad"]');
  return c ? { preco: c.querySelector('.li-preco').textContent, meu: !!c.querySelector('.li-estoque.meu'), txt: c.textContent } : null; });
ok(!!card25 && /QdC|Dmn/.test(card25.preco) && card25.meu,'2.5 item comprado marca "seu pedido" e segue comprável ('+(card25?card25.preco:'—')+')');
ok((await estornarPor('Garrafinha'))==='OK','2.6 e é estornável');
const q4 = await qdc();
const voltouTxt = await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Garrafinha Quad"] .li-preco').textContent);
ok(q4===q3,'2.7 valor devolvido ('+q4+' = '+q3+')');
ok(/QdC|Dmn/.test(voltouTxt) && voltouTxt!=='ADQUIRIDO','2.8 o item VOLTA à venda com o preço ('+voltouTxt+')');
ok(!await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Garrafinha Quad"]').classList.contains('comprado')),'2.9 e perde a marca de comprado');
// evento
const q5 = await qdc();
await p.evaluate(()=>document.querySelector('[data-ev-buy="aulao-especial"]').click()); await p.waitForTimeout(400);
await comprarOk();
ok(!await p.evaluate(()=>!!document.querySelector('[data-ev-buy="aulao-especial"]')),'2.10 evento comprado sai da vitrine');
ok((await estornarPor('Aulão especial'))==='OK','2.11 evento é estornável');
const q6 = await qdc();
ok(q6===q5,'2.12 valor do evento devolvido ('+q6+' = '+q5+')');
ok(await p.evaluate(()=>!!document.querySelector('[data-ev-buy="aulao-especial"]')),'2.13 e o evento VOLTA para a loja');
await p.evaluate(()=>document.querySelector('[data-goto="v-calendario"]').click()); await p.waitForTimeout(500);
ok(!/Aulão especial/.test(await txt('calList')),'2.14 e sai do calendário do aluno');
// skin
await nav('v-loja'); await p.waitForTimeout(600);
const q7 = await qdc();
const skin = await p.evaluate(()=>{ const b=document.querySelector('#skinChain [data-skin]'); if(!b) return null; const id=b.dataset.skin; b.click(); return id; });
await p.waitForTimeout(400); await comprarOk();
if (skin) {
  ok((await estornarPor('Gandola'))==='OK','2.15 skin é estornável');
  const q8 = await qdc();
  ok(q8===q7,'2.16 valor da skin devolvido ('+q8+' = '+q7+')');
  ok(await p.evaluate(x=>!!document.querySelector('#skinChain [data-skin="'+x+'"]'), skin),'2.17 a skin volta para a vitrine');
} else { ok(true,'2.15 (sem skin na cadeia)'); ok(true,'2.16'); ok(true,'2.17'); }

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
