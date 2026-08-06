const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const errs = [], fails = [];
const ok = (c, m) => { console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
async function ctx(){ const c = await b.newContext({ viewport:{width:430,height:940}, deviceScaleFactor:2 }); const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; window.__dropRng = () => 0.999; /* sem drop aleatório no teste */ }); p.on('pageerror', e=>errs.push(e.message)); await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400); return p; }
const loginAluno = async () => { const p = await ctx(); await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');}); await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600); return p; };
const persona = (p,q) => p.evaluate(pp=>{ document.querySelector('.persona-btn[data-persona="'+pp+'"]').click(); }, q);
const toast = p => p.evaluate(()=>document.getElementById('toast').textContent);
async function entrarAdmin(p){ await persona(p,'admin'); await p.waitForTimeout(400); await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(400); }
const irMissoes = p => p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-missoes"]').click());
const irLoja = p => p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click());
const navAdm = (p,v) => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const simRow = (p, nome) => p.evaluate(n=>{ const r=[...document.querySelectorAll('#simuladosList .sim-row')].find(x=>x.textContent.includes(n)); return r?r.textContent:''; }, nome);
const clickSim = (p, nome) => p.evaluate(n=>{ const bts=[...document.querySelectorAll('#simuladosList [data-sim]')]; const el=bts.find(x=>x.closest('.sim-row').textContent.includes(n)); if(el) el.click(); return !!el; }, nome);
const libMeu = p => p.evaluate(()=>{ const meu=[...document.querySelectorAll('#admSpLista .mission-row')].find(r=>r.textContent.includes('AL SD QUAD MOURA')&&r.querySelector('[data-cp]')); if(meu) meu.querySelector('[data-cp]').click(); });
const num = s => parseInt(String(s).replace(/\D/g,''),10)||0;
const confirmarCompraSim = async p => { await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350); };
const PDF = { name:'simulado.pdf', mimeType:'application/pdf', buffer: Buffer.from('%PDF teste') };
async function responderQuiz(p){ const total = await p.evaluate(()=>window.__simDig.qs.length); for(let k=0;k<total;k++){ await p.evaluate(()=>{ const q=window.__simDig.qs[window.__simDig.idx]; const alts=[...document.querySelectorAll('#simDigBody .q-alt')]; (q.c?alts[0]:alts[1]).click(); }); await p.waitForTimeout(90); await p.evaluate(()=>document.getElementById('btnSimDigNext').click()); await p.waitForTimeout(110); } return total; }

// ===== MERGE: lançamento de simulados no "Hoje"; Liberar só tem a lista =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!!document.querySelector('#v-adm-hoje #admSimNome')), 'MERGE: "Lançamento de simulados" está no Hoje');
  ok(await p.evaluate(()=>!!document.getElementById('admSimModal') && !!document.getElementById('admSimTipo')), 'MERGE: form unificado (modalidade + tipo)');
  await navAdm(p,'v-adm-liber'); await p.waitForTimeout(300);
  ok(!(await p.evaluate(()=>!!document.querySelector('#v-adm-liber #admSimNome') || !!document.getElementById('admSpNome'))), 'MERGE: Liberar NÃO tem mais o form de lançar');
  ok(await p.evaluate(()=>!!document.getElementById('admSpLista')), 'MERGE: Liberar mantém a lista de inscritos a liberar');
  await p.context().close();
}

// ===== 1: presencial é SEMPRE vendido (nunca gratuito) =====
{ const p = await loginAluno(); await irMissoes(p); await p.waitForTimeout(300);
  const linha = await simRow(p,'Simuladão Quad');
  ok(/vagas em Dmn/.test(linha) && /vagas em QdC/.test(linha), 'PRES: mostra as vagas de cada moeda');
  ok(/Comprar vaga na Loja/.test(linha), 'PRES: a inscrição é a compra da vaga');
  await clickSim(p,'Simuladão Quad'); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('v-loja').classList.contains('on')), 'PRES: conduz à Loja');
  const coin0 = num(await p.evaluate(()=>document.getElementById('scoreVal').textContent));
  await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#lojaSim-pres [data-sim-buy]')].find(x=>x.textContent.includes('Simuladão Quad')); bt.click(); }); await p.waitForTimeout(350);
  ok(await p.evaluate(()=>document.getElementById('turmaLayer').classList.contains('on')), 'PRES: abre o pop-up "em qual moeda"');
  await p.evaluate(()=>document.getElementById('btnTuQdc').click()); await p.waitForTimeout(300);
  await confirmarCompraSim(p);
  const coin1 = num(await p.evaluate(()=>document.getElementById('scoreVal').textContent));
  ok(coin1===coin0-20, 'PRES: a compra debita o preço em Quad Coins: '+coin0+'→'+coin1);
  await irMissoes(p); await p.waitForTimeout(250);
  ok(/INSCRITO/.test(await simRow(p,'Simuladão Quad')), 'PRES: comprado vira INSCRITO');
  await entrarAdmin(p); await navAdm(p,'v-adm-liber'); await p.waitForTimeout(300);
  ok(/AL SD QUAD MOURA/.test(await p.evaluate(()=>document.getElementById('admSpLista').textContent)), 'PRES: aparece em Liberar');
  await libMeu(p); await p.waitForTimeout(400);
  await persona(p,'aluno'); await p.waitForTimeout(300); await irMissoes(p); await p.waitForTimeout(200);
  ok(!/Simuladão Quad/.test(await p.evaluate(()=>document.getElementById('simuladosList').textContent)), 'PRES: liberado, sai da aba Simulados');
  ok(/Simuladão Quad/.test(await p.evaluate(()=>document.getElementById('simHistList').textContent)), 'PRES: entra no histórico de realizados');
  await p.context().close();
}

// ===== 2: presencial PAGO → Missões "Inscrever" redireciona à Loja → compra → inscrito → Liberar → histórico =====
{ const p = await loginAluno(); await irMissoes(p); await p.waitForTimeout(300);
  ok(/na Loja/.test(await simRow(p,'Simulado 63')), 'PRES-PAGO: Missões mostra que é pago (Loja)');
  await clickSim(p,'Simulado 63'); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('v-loja').classList.contains('on')), 'PRES-PAGO: "Inscrever" conduz à Loja');
  ok(await p.evaluate(()=>!!document.querySelector('#lojaSim-pres [data-sim-buy]')), 'PRES-PAGO: vitrine de simulados presenciais aparece na Loja');
  const s0 = num(await p.evaluate(()=>document.getElementById('scoreVal').textContent));
  await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#lojaSim-pres [data-sim-buy]')].find(x=>x.textContent.includes('Simulado 63')); bt.click(); }); await p.waitForTimeout(350);
  await p.evaluate(()=>document.getElementById('btnTuQdc').click()); await p.waitForTimeout(300);
  await confirmarCompraSim(p);
  const s1 = num(await p.evaluate(()=>document.getElementById('scoreVal').textContent));
  ok(s1===s0-150, 'PRES-PAGO: compra na Loja debita 150 QdC (preço em QdC): '+s0+'→'+s1);
  await irMissoes(p); await p.waitForTimeout(200);
  ok(/INSCRITO/.test(await simRow(p,'Simulado 63')), 'PRES-PAGO: status em Simulados vira INSCRITO após a compra');
  await entrarAdmin(p); await navAdm(p,'v-adm-liber'); await p.waitForTimeout(300);
  ok(/AL SD QUAD MOURA/.test(await p.evaluate(()=>{ const r=[...document.querySelectorAll('#admSpLista .mission-row')].filter(x=>x.textContent.includes('AL SD QUAD MOURA')); return r.map(x=>x.textContent).join('|'); })), 'PRES-PAGO: inscrição adicionada à Liberar');
  await libMeu(p); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(300); await irMissoes(p); await p.waitForTimeout(200);
  ok(!/Simulado 63/.test(await p.evaluate(()=>document.getElementById('simuladosList').textContent)) && /Simulado 63/.test(await p.evaluate(()=>document.getElementById('simHistList').textContent)), 'PRES-PAGO: liberado → sai de Simulados e vai ao histórico');
  await p.context().close();
}

// ===== 3: digital GRÁTIS → responder → histórico =====
{ const p = await loginAluno(); await irMissoes(p); await p.waitForTimeout(300);
  await clickSim(p,'Simulado digital · CFO 1ª fase'); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('simDigLayer').classList.contains('on')), 'DIG-GRÁTIS: abre o quiz cronometrado');
  const total = await responderQuiz(p);
  ok(/10 de 10/.test(await p.evaluate(()=>document.getElementById('simDigBody').textContent)), 'DIG-GRÁTIS: quiz de '+total+' questões pontua ao concluir');
  await p.evaluate(()=>document.getElementById('btnSimDigNext').click()); await p.waitForTimeout(300);
  ok(!/CFO 1ª fase/.test(await p.evaluate(()=>document.getElementById('simuladosList').textContent)) && /CFO 1ª fase/.test(await p.evaluate(()=>document.getElementById('simHistList').textContent)), 'DIG-GRÁTIS: realizado → histórico');
  await p.context().close();
}

// ===== 4: digital PAGO (lançado pelo admin) → só na Loja → compra → Missões → responder =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  await p.fill('#admSimNome','Simulado digital · CFO 2ª fase'); await p.selectOption('#admSimModal','digital'); await p.selectOption('#admSimTipo','pago');
  await p.setInputFiles('#admSimPdf', PDF); await p.waitForTimeout(150);
  await p.fill('#admSimMin','15'); await p.fill('#admSimNq','5'); await p.fill('#admSimPrecoQdc','80');
  await p.click('#btnAdmSimLancar'); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(300);
  await irMissoes(p); await p.waitForTimeout(200);
  ok(!/CFO 2ª fase/.test(await p.evaluate(()=>document.getElementById('simuladosList').textContent)), 'DIG-PAGO: NÃO aparece em Missões antes da compra');
  await irLoja(p); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!!document.querySelector('#lojaSim-dig [data-sim-buy]') && document.getElementById('lojaSim-dig').textContent.includes('CFO 2ª fase')), 'DIG-PAGO: aparece na Loja');
  await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#lojaSim-dig [data-sim-buy]')].find(x=>x.textContent.includes('CFO 2ª fase')); bt.click(); }); await p.waitForTimeout(300); await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350);
  await irMissoes(p); await p.waitForTimeout(200);
  ok(/CFO 2ª fase/.test(await p.evaluate(()=>document.getElementById('simuladosList').textContent)), 'DIG-PAGO: após comprar, entra em Missões');
  ok(await clickSim(p,'CFO 2ª fase'), 'DIG-PAGO: botão Responder presente');
  await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('simDigLayer').classList.contains('on')), 'DIG-PAGO: abre o quiz cronometrado (5 questões)');
  await p.context().close();
}

// ===== 5: admin lança presencial pago (Hoje) → vai para a Loja =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  /* presencial já nasce "pago" (o seletor fica travado) e pede as vagas por moeda */
  await p.fill('#admSimNome','Simulado 70 · Soldado'); await p.selectOption('#admSimModal','presencial');
  await p.fill('#admSimData','2026-11-08'); await p.fill('#admSimIni','08:00'); await p.fill('#admSimFim','12:00');
  await p.fill('#admSimVagas','30'); await p.fill('#admSimVagasQdc','70');   /* vagas POR MOEDA (dec. 155): 30 Dmn + 70 QdC */
  await p.fill('#admSimPrecoDmn','90'); await p.fill('#admSimPrecoQdc','120');
  await p.selectOption('#admSimSala','Sala 1');
  await p.click('#btnAdmSimLancar'); await p.waitForTimeout(300);
  ok(/à venda na Loja/.test(await p.evaluate(()=>document.getElementById('admSimErro').textContent)), 'ADMIN: presencial confirma que foi à Loja (aviso fixo)');
  ok(/100 vagas/.test(await p.evaluate(()=>document.getElementById('admSimErro').textContent)), 'ADMIN: a confirmação traz as vagas da sala');
  await persona(p,'aluno'); await p.waitForTimeout(300); await irLoja(p); await p.waitForTimeout(300);
  ok(/Simulado 70/.test(await p.evaluate(()=>document.getElementById('lojaSim-pres').textContent)), 'ADMIN: presencial pago aparece na Loja do aluno');
  await p.locator('#v-loja').locator('.p-card', { has: p.locator('#lojaSim-pres') }).screenshot({path:OUT+'/sim-loja.png'}).catch(()=>{});
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
