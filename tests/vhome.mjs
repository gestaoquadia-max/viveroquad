const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b=await chromium.launch({executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const c=await b.newContext({viewport:{width:430,height:900},deviceScaleFactor:2});
const p=await c.newPage();
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'});
// pula direto pro app (aluno logado) escondendo camadas de acesso
await p.evaluate(()=>{ document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(600);
// screenshot do telefone inteiro (a .phone)
const el=await p.$('.phone');
await el.screenshot({path:'home-new.png'});
console.log('ok'); await b.close();
