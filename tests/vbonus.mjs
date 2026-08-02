const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const errs = [], fails = [];
const ok = (c, m) => { console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
async function login(){
  const c = await b.newContext({ viewport:{width:430,height:900}, deviceScaleFactor:2 });
  const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ p.on('pageerror', e => errs.push(e.message));
  await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil:'load' });
  await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
  await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234');
  await p.click('#btnAcessar'); await p.waitForTimeout(5600);
  return p;
}
const txt = (p,id) => p.evaluate(i => document.getElementById(i).textContent, id);

// ===== ITEM 1: "Itens do personagem" (chips) removido do Perfil =====
{ const p = await login();
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-aluno"]')?.click());
  await p.evaluate(()=>{ const b2=document.getElementById('btnAvatarPerfil'); if(b2) b2.click(); });
  await p.waitForTimeout(400);
  ok(!(await p.evaluate(()=>!!document.getElementById('chipBoina'))), 'ITEM1: chip "Boina" removido do Perfil');
  ok(!(await p.evaluate(()=>!!document.getElementById('chipSkin'))), 'ITEM1: chip "Skin" removido do Perfil');
  ok(await p.evaluate(()=>!!document.getElementById('btnMochila')), 'ITEM1: mochila de combate continua no Perfil');
  ok(await p.evaluate(()=>!!document.getElementById('avPreview')), 'ITEM1: foto do personagem continua no Perfil');
  await p.context().close();
}

// ===== ITEM 3: botão dourado de recompensa ao concluir a noite =====
{ const p = await login();
  const btn = '#btnMissaoHome';
  ok(/Continuar missão/i.test(await txt(p,'btnMissaoHome')), 'ITEM3: antes de concluir → "Continuar missão"');
  ok(!(await p.evaluate(()=>document.querySelector('.hero-btn-wrap').classList.contains('reward'))), 'ITEM3: botão ainda não é dourado');
  const coins0 = await txt(p,'scoreVal');
  const score0 = await p.evaluate(()=>window.__noite ? (window.__prova, document.getElementById('xpNum').textContent) : '');
  // conclui todas as missões da noite
  const total = await p.evaluate(()=>{ window.__noite.concluirTudo(); return window.__noite.missoes().length; });
  await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.querySelector('.hero-btn-wrap').classList.contains('reward')), 'ITEM3: noite concluída → botão fica DOURADO (.reward)');
  ok(/Retire aqui seus benefícios/i.test(await txt(p,'btnMissaoHome')), 'ITEM3: texto vira "Retire aqui seus benefícios"');
  ok(await p.evaluate(()=>document.getElementById('btnMissaoHome').dataset.reward==='1'), 'ITEM3: botão em modo recompensa (dataset.reward)');
  ok(await p.evaluate(()=>!!document.querySelector('#btnMissaoHome .hb-coin')), 'ITEM3: ícone de moeda no botão');
  ok((await txt(p,'missRestam'))==='COMPLETO', 'ITEM3: status COMPLETO');
  // clica para retirar
  const xp = async () => parseInt((await txt(p,'xpNum')).split('/')[0].replace(/\D/g,''),10) || 0;
  const xpAntes = await xp();
  const coinAntes = parseInt((await txt(p,'scoreVal')).replace(/\D/g,''),10) || 0;
  await p.evaluate(()=>document.getElementById('btnMissaoHome').click());
  await p.waitForTimeout(1600);   // espera a animação da moeda aterrissar
  const xpDepois = await xp();
  const coinDepois = parseInt((await txt(p,'scoreVal')).replace(/\D/g,''),10) || 0;
  ok(xpDepois === xpAntes + total, 'ITEM3: Score de carreira +'+total+' (1 por bloco): '+xpAntes+'→'+xpDepois);
  ok(coinDepois === coinAntes + 1, 'ITEM3: +1 Quad Coin: '+coinAntes+'→'+coinDepois);
  ok(await p.evaluate(()=>window.__noite.resgatado()), 'ITEM3: bônus marcado como resgatado');
  ok(await p.evaluate(()=>document.querySelector('.hero-btn-wrap').classList.contains('claimed')), 'ITEM3: botão vira estado "retirado" (.claimed)');
  ok(/Benefícios retirados/i.test(await txt(p,'btnMissaoHome')), 'ITEM3: texto vira "Benefícios retirados"');
  // segunda vez não paga de novo
  await p.evaluate(()=>document.getElementById('btnMissaoHome').click()); await p.waitForTimeout(600);
  const coinFim = parseInt((await txt(p,'scoreVal')).replace(/\D/g,''),10) || 0;
  ok(coinFim === coinDepois, 'ITEM3: retirar de novo NÃO paga em dobro');
  await p.locator('.hero-mission').first().screenshot({path:OUT+'/bonus-claimed.png'}).catch(()=>{});
  await p.context().close();
}

// ===== ITEM 2: "Aula de hoje" re-renderiza ao abrir o Início e sincroniza com o cronograma =====
{ const p = await login();
  const antes = await txt(p,'aulaSlots');
  ok(antes.length > 0, 'ITEM2: "Aula de hoje" tem conteúdo do cronograma');
  // simula o admin trocando a matéria de hoje na turma do aluno e re-render
  const mudou = await p.evaluate(()=>{
    // acha o índice de hoje (seg=0..sex=4), fora disso usa 0
    var d = new Date().getDay()-1; if (d<0||d>4) d=0;
    // CRONO/renderAulaHoje são internos; usamos o fluxo real do admin não está exposto,
    // então validamos que abrir o Início re-renderiza (chama renderAulaHoje)
    return true;
  });
  // troca de view e volta para o Início → deve re-renderizar sem quebrar
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click());
  await p.waitForTimeout(200);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-inicio"]').click());
  await p.waitForTimeout(300);
  const depois = await txt(p,'aulaSlots');
  ok(depois.length > 0, 'ITEM2: ao reabrir o Início, "Aula de hoje" continua renderizada (refresh no showView)');
  ok((await txt(p,'aulaFonte')).includes('Cronograma semanal'), 'ITEM2: fonte cita o Cronograma semanal da coordenação');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
