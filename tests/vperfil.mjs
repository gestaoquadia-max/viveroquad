const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b=await chromium.launch({executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const c=await b.newContext({viewport:{width:430,height:900},deviceScaleFactor:2});
const p=await c.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'});
await p.evaluate(()=>{ document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(2400);
// abre perfil pela foto
await p.click('#btnAvatarPerfil'); await p.waitForTimeout(500);
// muda o nome de guerra (a graduação saiu do perfil: vem da carreira/patente)
await p.fill('#nomeGuerra','Silva');
const preview = await p.evaluate(()=>document.getElementById('gwPreview').textContent);
// salvar (botão está no fim da view — clones do loop podem interceptar; usa o original)
await p.evaluate(()=>{ document.getElementById('btnSalvarPerfil').click(); });
await p.waitForTimeout(400);
const nome = await p.evaluate(()=>document.getElementById('homeNome').textContent);
const rank = await p.evaluate(()=>document.getElementById('rankNome').textContent);
console.log('preview:', preview, '| card:', nome, '|', rank);
/* (trecho da boina aposentado: os chips de equipar saíram na dec. 25 —
   quem possui, veste; a compra da boina é coberta por vtut/vfix1)     */
// screenshot do perfil
await p.evaluate(()=>{ document.getElementById('v-aluno').scrollTop=0; });
await p.waitForTimeout(400);
const el=await p.$('.phone'); await el.screenshot({path:'_out/perfil-tab.png'});
console.log('erros:', errs.length?errs.join('|'):'nenhum');
await b.close();
