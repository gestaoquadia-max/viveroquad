const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b=await chromium.launch({executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const c=await b.newContext({viewport:{width:430,height:900},deviceScaleFactor:2});
const p=await c.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'});
await p.evaluate(()=>{ document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(400);
// nav → Loja
await p.click('nav#navAluno [data-view="v-loja"]');
await p.waitForTimeout(500);
const lojaOn = await p.evaluate(()=>document.getElementById('v-loja').classList.contains('on'));
// compra a boina (20 QdC) — agora com confirmação de compra
await p.click('.loja-item[data-nome="Boina exclusiva"]');
await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('btnCompraOk').click());
await p.waitForTimeout(400);
const saldo = await p.evaluate(()=>document.getElementById('scoreVal').textContent);
const comprado = await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Boina exclusiva"]').classList.contains('comprado'));
// recompra bloqueada (a boina some da vitrine; clique programático ainda cai no bloqueio)
await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Boina exclusiva"]').click());
await p.waitForTimeout(200);
const saldo2 = await p.evaluate(()=>document.getElementById('scoreVal').textContent);
// quadrômetro no "+"
await p.click('#btnPlus'); await p.waitForTimeout(300);
const temQuadrometro = await p.evaluate(()=>!![...document.querySelectorAll('#plusPop .plus-row')].find(r=>r.textContent.includes('Quadrômetro')));
await p.click('#plusPop .plus-row[data-goto="v-perfil"]'); await p.waitForTimeout(300);
const perfilOn = await p.evaluate(()=>document.getElementById('v-perfil').classList.contains('on'));
console.log('Loja abre pela nav:', lojaOn?'✓':'✗', '| compra boina: saldo', saldo, comprado?'(adquirida ✓)':'✗', '| recompra bloqueada:', saldo===saldo2?'✓':'✗', '| Quadrômetro no +:', temQuadrometro?'✓':'✗', '| abre:', perfilOn?'✓':'✗');
// screenshot da loja
await p.click('nav#navAluno [data-view="v-loja"]'); await p.waitForTimeout(500);
const el=await p.$('.phone'); await el.screenshot({path:new URL('./_out', import.meta.url).pathname + '/loja.png'});
console.log('erros:', errs.length?errs.join('|'):'nenhum');
await b.close();
