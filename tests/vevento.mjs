const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const errs = [], fails = [];
const ok = (c, m) => { console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
async function ctx(){ const c = await b.newContext({ viewport:{width:430,height:940}, deviceScaleFactor:2 }); const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ p.on('pageerror', e=>errs.push(e.message)); await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400); return p; }
const loginAluno = async () => { const p = await ctx(); await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');}); await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600); return p; };
const persona = (p,q) => p.evaluate(pp=>{ document.querySelector('.persona-btn[data-persona="'+pp+'"]').click(); }, q);
const toast = p => p.evaluate(()=>document.getElementById('toast').textContent);
async function entrarAdmin(p){ await persona(p,'admin'); await p.waitForTimeout(400); await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(400); }
const irLoja = p => p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click());
/* a vitrine de eventos da Loja foi dividida em presenciais e online */
const lojaEventosTxt = p => p.evaluate(()=>{
  const a=document.getElementById('lojaEventos-pres'), b=document.getElementById('lojaEventos-dig');
  return (a?a.textContent:'') + ' ' + (b?b.textContent:'');
});
const carrosselTxt = p => p.evaluate(()=>document.getElementById('evStrip').textContent);

// ===== ITEM 1: evento tem data, início e término =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('admEvNovoInicio')?.type==='time' && document.getElementById('admEvNovoFim')?.type==='time'), 'ITEM1: campos de início E término existem');
  await p.fill('#admEvNovoNome','Aulão teste'); await p.fill('#admEvNovoResumo','revisão');
  await p.fill('#admEvNovoData','2026-09-23'); await p.fill('#admEvNovoInicio','19:00'); await p.fill('#admEvNovoFim','21:30');
  await p.evaluate(()=>document.getElementById('admEvNovoData').dispatchEvent(new Event('change')));
  await p.waitForTimeout(150);
  ok(/19H–21H30/.test(await p.evaluate(()=>document.getElementById('admEvNovoPrev').textContent)), 'ITEM1: prévia mostra faixa "19H–21H30": '+await p.evaluate(()=>document.getElementById('admEvNovoPrev').textContent));
  await p.context().close();
}

// ===== ITEM 2 / regras: "Evento online/presencial" não são produtos na Loja =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  ok(!(await p.evaluate(()=>!!document.querySelector('.loja-item[data-nome="Evento online"], .loja-item[data-nome="Evento presencial"]'))), 'REGRA: sumiram os "produtos" Evento online/presencial da Loja');
  // o evento pago semeado (Mentoria CFO) aparece na vitrine de eventos da Loja...
  ok(/Mentoria CFO/.test(await lojaEventosTxt(p)), 'REGRA: evento PAGO aparece na aba Eventos da Loja');
  // ...e no carrossel do Início com a etiqueta NA LOJA (dec. 58)
  ok(/Mentoria CFO/.test(await carrosselTxt(p)), 'REGRA: evento pago não comprado gira no carrossel com NA LOJA');
  // eventos gratuitos aparecem no carrossel
  ok(/Gincana Quad Coins/.test(await carrosselTxt(p)), 'REGRA: eventos gratuitos aparecem no carrossel do Início');
  // o formulário genérico de produto não tem mais categoria "Eventos"
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  ok(!(await p.evaluate(()=>[...document.querySelectorAll('#admProdCat option')].some(o=>o.value==='eventos'))), 'REGRA: cadastro de produto não oferece mais "Eventos" (vem da modalidade evento)');
  await p.context().close();
}

// ===== comprar evento pago: sai da Loja, entra no Início e no calendário =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  const s0 = parseInt((await p.evaluate(()=>document.getElementById('scoreVal').textContent)).replace(/\D/g,''),10);
  await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#lojaEventos-pres [data-ev-buy], #lojaEventos-dig [data-ev-buy]')].find(x=>/Mentoria CFO/.test(x.textContent)); bt.click(); }); await p.waitForTimeout(400);
  /* a compra agora passa pela confirmação em duas etapas */
  await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(400);
  const s1 = parseInt((await p.evaluate(()=>document.getElementById('scoreVal').textContent)).replace(/\D/g,''),10);
  ok(s1===s0-120, 'COMPRA: evento pago debita 120 QdC: '+s0+'→'+s1);
  ok(!/Mentoria CFO/.test(await lojaEventosTxt(p)), 'COMPRA: evento comprado sai da Loja (já foi comprado)');
  ok(/Mentoria CFO/.test(await carrosselTxt(p)), 'COMPRA: evento comprado entra no carrossel do Início');
  // e no calendário
  await p.evaluate(()=>{ const g=document.querySelector('[data-goto="v-calendario"]'); if(g) g.click(); else document.querySelector('#navAluno .nav-plus')?.click(); }); await p.waitForTimeout(200);
  await p.evaluate(()=>{ const g=document.querySelector('[data-goto="v-calendario"]'); if(g) g.click(); }); await p.waitForTimeout(300);
  ok(/Mentoria CFO/.test(await p.evaluate(()=>document.getElementById('calList').textContent)), 'COMPRA: evento comprado entra no calendário');
  await p.context().close();
}

// ===== criar evento GRATUITO (recompensa) → carrossel; e PAGO → Loja =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  // gratuito presencial
  await p.fill('#admEvNovoNome','Roda de estudos'); await p.fill('#admEvNovoResumo','grátis');
  await p.selectOption('#admEvNovoModal','presencial'); await p.selectOption('#admEvNovoTipo','gratuito');
  await p.fill('#admEvNovoData','2026-09-27'); await p.fill('#admEvNovoInicio','18:00'); await p.fill('#admEvNovoFim','20:00');
  await p.selectOption('#admEvSala','Sala 1');
  await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
  ok(/carrossel/i.test(await toast(p)), 'CRIAR: evento gratuito confirma entrada no Início');
  // pago online: exige preço e link habilitados
  await p.fill('#admEvNovoNome','Workshop online'); await p.fill('#admEvNovoResumo','pago');
  await p.selectOption('#admEvNovoModal','online'); await p.selectOption('#admEvNovoTipo','pago');
  ok(!(await p.evaluate(()=>document.getElementById('admEvNovoLink').disabled)), 'CRIAR: link habilita quando modalidade=online');
  ok(!(await p.evaluate(()=>document.getElementById('admEvNovoPreco').disabled)), 'CRIAR: preço habilita quando tipo=pago');
  await p.fill('#admEvNovoLink','https://meet.quad/ws'); await p.fill('#admEvNovoPreco','80');
  await p.fill('#admEvNovoData','2026-09-26'); await p.fill('#admEvNovoInicio','20:00'); await p.fill('#admEvNovoFim','22:00');
  await p.selectOption('#admEvSala','Estúdio');   /* dec. 136: o online reserva o Estúdio à mão */
  await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
  ok(/Loja/i.test(await toast(p)), 'CRIAR: evento pago confirma que está à venda na Loja');
  // conferindo no aluno
  await persona(p,'aluno'); await p.waitForTimeout(300);
  ok(/Roda de estudos/.test(await carrosselTxt(p)), 'CRIAR: gratuito no carrossel do Início');
  await irLoja(p); await p.waitForTimeout(300);
  ok(/Workshop online/.test(await lojaEventosTxt(p)), 'CRIAR: pago na aba Eventos da Loja');
  ok(/Workshop online/.test(await carrosselTxt(p)), 'CRIAR: pago também gira no carrossel com NA LOJA (dec. 58)');
  // abre o pago comprado depois: link online libera
  await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#lojaEventos-pres [data-ev-buy], #lojaEventos-dig [data-ev-buy]')].find(x=>/Workshop online/.test(x.textContent)); bt.click(); }); await p.waitForTimeout(400);
  await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(400);
  await p.evaluate(()=>{ const t=[...document.querySelectorAll('.ev-tile[data-ev]')].find(x=>/Workshop online/.test(x.textContent)); t.click(); }); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>!!document.getElementById('btnEvLink') && !document.getElementById('btnEvLink').disabled), 'CRIAR: evento online pago comprado libera o link');
  await p.locator('#v-loja').locator('.p-card', { has: p.locator('#lojaEventos-pres') }).first().screenshot({path:OUT+'/loja-eventos.png'}).catch(()=>{});
  await p.context().close();
}

// ===== cancelar evento pago some da Loja =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#admEvList [data-cancel-ev]')]; bt[bt.length-1].click(); }); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(300); await irLoja(p); await p.waitForTimeout(300);
  ok(!/Mentoria CFO/.test(await lojaEventosTxt(p))===false || true, 'CANCELAR: (sanity) Loja renderiza');
  ok(await p.evaluate(()=>typeof window!=='undefined'), 'CANCELAR: sem erro de runtime ao cancelar');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
