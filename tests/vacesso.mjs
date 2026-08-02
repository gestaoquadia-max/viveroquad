const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const FILE = new URL('../index.html', import.meta.url).href;
const OUT = new URL('./_out', import.meta.url).pathname;
const errors = [], log = [];
const browser = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
async function fresh(){ const c = await browser.newContext({ viewport:{width:1100,height:900}, deviceScaleFactor:2 }); const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ p.on('pageerror',e=>errors.push('pageerror: '+e.message)); await p.goto(FILE,{waitUntil:'load'}); await p.waitForTimeout(400); return p; }
const vis = (p,id)=>p.evaluate(i=>{const e=document.getElementById(i);if(!e)return'MISSING';const s=getComputedStyle(e);return s.display!=='none'&&s.opacity!=='0'&&!e.classList.contains('off');},id);
const toast = p=>p.evaluate(()=>document.getElementById('toast').textContent);

// ===== A: tela de login = e-mail + senha + criar conta =====
{ const p = await fresh();
  for (const [id,nome] of [['loginEmail','Login (e-mail)'],['loginSenha','Senha'],['btnAcessar','Entrar'],['btnCriarConta','Criar conta']]) {
    if (!await p.evaluate(i=>!!document.getElementById(i), id)) errors.push('A: falta "'+nome+'" ('+id+')');
  }
  // sem senha não entra
  await p.fill('#loginEmail','aluno@quad.com'); await p.click('#btnAcessar'); await p.waitForTimeout(300);
  if (!/senha/i.test(await toast(p))) errors.push('A: sem senha deveria pedir a senha: '+await toast(p));
  if (await vis(p,'loginLayer')!==true) errors.push('A: saiu do login sem senha');
  log.push('✔ A: login com Login + Senha + "Criar conta"; sem senha não entra');
}

// ===== B: 1º acesso (login) dispara o tutorial obrigatório =====
{ const p = await fresh();
  await p.fill('#loginEmail','novo@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar');
  await p.waitForTimeout(5600);
  if (await p.evaluate(()=>document.getElementById('tutLayer').classList.contains('on'))!==true) errors.push('B: tutorial não disparou no 1º acesso');
  else log.push('✔ B: 1º acesso → onboard obrigatório (tutorial) dispara automaticamente');
}

// ===== C: conta que já concluiu o tutorial entra direto no app =====
{ const p = await fresh();
  await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
  await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar');
  await p.waitForTimeout(5600);
  if (await p.evaluate(()=>document.getElementById('tutLayer').classList.contains('on'))===true) errors.push('C: tutorial reabriu para conta já concluída');
  if (await p.evaluate(()=>document.getElementById('v-inicio').classList.contains('on'))!==true) errors.push('C: não entrou no Início');
  log.push('✔ C: conta com onboard concluído entra direto no app');
}

// ===== D: "Ainda não tem conta? Criar conta" → cadastro no site =====
{ const p = await fresh();
  await p.click('#btnCriarConta'); await p.waitForTimeout(300);
  if (await vis(p,'gateCriar')!==true) errors.push('D: tela de cadastro no site não apareceu');
  const t = await p.evaluate(()=>document.getElementById('gateCriar').textContent);
  if (!/site/i.test(t) || !/checkout/i.test(t)) errors.push('D: texto não explica o cadastro no site/checkout');
  await p.click('#btnIrCheckout'); await p.waitForTimeout(200);
  if (!/site do Quad/i.test(await toast(p))) errors.push('D: checkout não redireciona (demo): '+await toast(p));
  await p.click('#btnCriarVoltar'); await p.waitForTimeout(200);
  if (await vis(p,'loginLayer')!==true) errors.push('D: voltar não retornou ao login');
  log.push('✔ D: "Criar conta" leva ao cadastro no site (checkout) e volta ao login');
}

// ===== E: acesso offline foi aposentado — o indicador "Online" saiu do topo =====
{ const p = await fresh();
  if (await p.evaluate(()=>!!document.getElementById('connToggle'))) errors.push('E: indicador Online/Offline ainda no topo');
  log.push('✔ E: indicador "Online" removido (acesso offline aposentado)');
}

await browser.close();
console.log(log.join('\n'));
if (errors.length) { console.log('\nERROS:\n' + errors.join('\n')); process.exit(1); }
console.log('\nACESSO-OK');
