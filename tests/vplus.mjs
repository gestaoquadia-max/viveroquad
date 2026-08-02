const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const S=new URL('./_out', import.meta.url).pathname;
const b=await chromium.launch({executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const c=await b.newContext({viewport:{width:430,height:900},deviceScaleFactor:2});
const p=await c.newPage();
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'});
await p.evaluate(()=>{ document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(500);
const el=await p.$('.phone');
await el.screenshot({path:S+'/limpo-home.png'});
await p.click('#btnPlus'); await p.waitForTimeout(400);
await el.screenshot({path:S+'/limpo-plus.png'});
// pré-taf travado responde com toast?
await p.evaluate(()=>{ [...document.querySelectorAll('#plusPop .plus-row')].find(r=>r.textContent.includes('Pré-TAF')).click(); });
await p.waitForTimeout(300);
const t = await p.evaluate(()=>document.getElementById('toast').textContent);
console.log('toast pré-taf:', t);
console.log('ok'); await b.close();
