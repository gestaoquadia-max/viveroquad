const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const errs = [], fails = [];
const ok = (c, m) => { console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
async function ctx(){ const c = await b.newContext({ viewport:{width:430,height:940}, deviceScaleFactor:2 }); const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ p.on('pageerror', e=>errs.push(e.message)); await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400); return p; }
const loginAluno = async () => { const p = await ctx(); await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');}); await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600); return p; };
const nav = (p,v) => p.evaluate(x=>document.querySelector('#navAluno .nav-btn[data-view="'+x+'"]').click(), v);
const confirmar = async p => { await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350); };
const toast = p => p.evaluate(()=>document.getElementById('toast').textContent);

// ===== 0: login com UMA tela de carregamento (verificação dentro da vinheta) =====
{ const p = await ctx();
  await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
  await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar');
  await p.waitForTimeout(500);
  ok(!await p.evaluate(()=>document.getElementById('gateLayer').classList.contains('on')), '0: gate "verificando" NÃO abre mais (era a 1ª tela duplicada)');
  ok(!await p.evaluate(()=>document.getElementById('splashLayer').classList.contains('done')), '0: vinheta única rodando');
  ok(/Verificando a matrícula de/.test(await p.evaluate(()=>document.getElementById('splashVerify').textContent)), '0: verificação acontece DENTRO da vinheta');
  await p.waitForTimeout(3400);
  ok(await p.evaluate(()=>document.getElementById('loginLayer').classList.contains('off')), '0: app aberto após a vinheta única');
  await p.context().close();
}

// ===== 1: INSCRITO no carrossel + evento multi-dia permanece na Loja =====
{ const p = await loginAluno();
  // regra nova: evento pago da semana aparece no carrossel com "NA LOJA" (clique leva à Loja)
  ok(/SEMANA INSANA/i.test(await p.evaluate(()=>document.getElementById('evStrip').textContent)) && /NA LOJA/.test(await p.evaluate(()=>[...document.querySelectorAll('#evStrip .ev-tile')].find(t=>/SEMANA INSANA/i.test(t.textContent))?.textContent||'')), '1: evento pago da semana aparece no carrossel com "Na Loja"');
  await nav(p,'v-loja'); await p.waitForTimeout(400);
  const vitrine = await p.evaluate(()=>document.getElementById('lojaEventos-pres').textContent);
  ok(/Semana Insana/.test(vitrine) && /400\s*Dmn/.test(vitrine) && /até 25\/09\/2026/.test(vitrine), '1: Semana Insana à venda (400 Dmn, até 31/07)');
  // saldo demo (150 Dmn) não cobre — resgata gift card QUAD-500 antes
  await p.fill('#giftCode','QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>parseInt(document.getElementById('lojaSaldoDmn').textContent.replace(/\D/g,''),10))>=650, '1: gift card QUAD-500 creditou os Diamantes');
  await p.evaluate(()=>document.querySelector('[data-ev-buy="semana-insana"]').click()); await p.waitForTimeout(300);
  await confirmar(p);
  // multi-dia: PERMANECE na vitrine, marcada INSCRITO
  const dep = await p.evaluate(()=>{ const el=document.querySelector('[data-ev-buy="semana-insana"]'); return el ? el.textContent : ''; });
  ok(/Semana Insana/.test(dep) && /INSCRITO/.test(dep), '1: multi-dia comprada PERMANECE na Loja com INSCRITO');
  await p.evaluate(()=>document.querySelector('[data-ev-buy="semana-insana"]').click()); await p.waitForTimeout(250);
  ok(/já está inscrito/.test(await toast(p)), '1: reclique avisa que já está inscrito (sem nova compra)');
  // pontual (mentoria online): comprada SOME da vitrine
  await p.evaluate(()=>document.querySelector('[data-ev-buy="mentoria-cfo"]').click()); await p.waitForTimeout(300);
  await confirmar(p);
  ok(!await p.evaluate(()=>!!document.querySelector('[data-ev-buy="mentoria-cfo"]')), '1: evento pontual comprado SOME da vitrine');
  // carrossel: as duas com tag INSCRITO
  await nav(p,'v-inicio'); await p.waitForTimeout(400);
  const tags = await p.evaluate(()=>[...document.querySelectorAll('#evStrip .ev-tile')].filter(t=>/INSCRITO/.test(t.textContent)).map(t=>t.textContent));
  ok(tags.some(t=>/SEMANA INSANA/i.test(t)) && tags.some(t=>/MENTORIA/i.test(t)), '1: carrossel mostra "INSCRITO" nos eventos garantidos');
  await p.context().close();
}

// ===== 2: Missões — ícone de treino + simulados em camadas =====
{ const p = await loginAluno(); await nav(p,'v-missoes'); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>!!document.querySelector('#trCard .hexi svg')), '2: card de treinamento com ícone (policial no stand)');
  ok(/Treinamento Rápido/.test(await p.evaluate(()=>document.querySelector('#trCard .card-eyebrow').textContent)), '2: eyebrow do treinamento no card-head');
  /* dec. 165: o bloco de Simulados mudou de casa — mora no Calendário */
  await p.evaluate(()=>{ document.getElementById('plusPop').classList.remove('on');
    [...document.querySelectorAll('#plusPop [data-goto]')].find(x=>/Calendário/.test(x.textContent)).click(); });
  await p.waitForTimeout(400);
  const rows = await p.evaluate(()=>document.querySelectorAll('#simuladosList .sim-row').length);
  ok(rows>=2, '2: simulados no leiaute novo ('+rows+' linhas .sim-row)');
  ok(await p.evaluate(()=>document.querySelectorAll('#simuladosList .mission-row').length)===0, '2: leiaute antigo aposentado');
  const geom = await p.evaluate(()=>{ const r=document.querySelector('#simuladosList .sim-row'); const t=r.querySelector('.sim-top .t').getBoundingClientRect(); const bt=r.querySelector('.sim-act .btn').getBoundingClientRect(); return { tw: t.width, overlap: !(t.bottom<=bt.top||bt.bottom<=t.top) && !(t.right<=bt.left||bt.right<=t.left) }; });
  ok(geom.tw>140 && !geom.overlap, '2: título com largura plena ('+Math.round(geom.tw)+'px) e sem disputa com o botão');
  await p.context().close();
}

// ===== 3: Quad Store — renomes, seções com vida, sem sobreposição =====
{ const p = await loginAluno(); await nav(p,'v-loja'); await p.waitForTimeout(1200);
  ok(await p.evaluate(()=>document.querySelector('#v-loja .lh-title').textContent)==='Quad Store', '3: cabeçalho "Quad Store"');
  const macro = await p.evaluate(()=>[...document.querySelectorAll('#v-loja .loja-macro')].map(m=>m.textContent.trim()));
  ok(/Atividades e itens · presenciais/.test(macro[0]), '3: bloco "Atividades e itens · presenciais" ('+macro[0]+')');
  ok(await p.evaluate(()=>document.querySelectorAll('#v-loja .loja-sec').length)===18, '3: 18 seções com o divisor novo (barra azul) — 4 no card "Carteira · extrato e compras" (dec. 197: movimentações + as 3 de situação)');
  const iso = await p.evaluate(()=>[...document.querySelectorAll('#v-loja .loja-sec')].map(x=>x.textContent.trim()).find(t=>/Isoladas/.test(t)));
  ok(iso==='Isoladas', '3: seção "Isoladas" sem "um professor à frente" ('+iso+')');
  // sobreposição hero × bloco presencial resolvida (roda 3D atenuada)
  const geo = await p.evaluate(()=>{ const h=document.querySelector('.loja-hero'), n=h.nextElementSibling; const hr=h.getBoundingClientRect(), nr=n.getBoundingClientRect(); return { heroBottom: hr.bottom, nextTop: nr.top }; });
  ok(geo.nextTop >= geo.heroBottom - 4, '3: hero não é mais invadido pelo bloco seguinte ('+Math.round(geo.heroBottom)+' → '+Math.round(geo.nextTop)+')');
  await p.evaluate(()=>{ document.querySelector('.loja-hero').scrollIntoView({block:'start'}); }); await p.waitForTimeout(600);
  await p.screenshot({path:OUT+'/fa-store.png'});
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
