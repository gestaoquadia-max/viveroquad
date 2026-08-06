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
const preco = (p,nome) => p.evaluate(n=>document.querySelector('.loja-item[data-nome="'+n+'"] .li-preco').textContent, nome);

// (ITEM 1 — tutorial/boina visível no card alto — é verificado na suíte vtut)

// ===== 3.1: estoque + quantidade; 3: entrega → "Entregue" → disponível de novo =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  ok(/em estoque/i.test(await p.evaluate(()=>document.querySelector('.loja-item[data-pres-id="garrafinha"]').textContent)), '3.1: item presencial mostra estoque');
  // abre overlay, escolhe 2 garrafinhas
  await p.evaluate(()=>document.querySelector('.loja-item[data-pres-id="garrafinha"]').click()); await p.waitForTimeout(300);
  await p.evaluate(()=>document.getElementById('qtdMais').click()); await p.waitForTimeout(150);
  ok((await p.evaluate(()=>document.getElementById('qtdVal').textContent))==='2', '3.1: stepper de quantidade vai a 2');
  const total = await p.evaluate(()=>document.getElementById('compraTotal').textContent);
  ok(total.replace(/\D/g,'')==='180', '3.1: total = 2 × 90 = 180 QdC ('+total+')');
  const s0 = parseInt((await p.evaluate(()=>document.getElementById('scoreVal').textContent)).replace(/\D/g,''),10);
  await p.evaluate(()=>document.getElementById('btnCompraOk').click()); await p.waitForTimeout(400);
  const s1 = parseInt((await p.evaluate(()=>document.getElementById('scoreVal').textContent)).replace(/\D/g,''),10);
  ok(s1===s0-180, '3.1: comprar 2 debita 180 QdC: '+s0+'→'+s1);
  /* dec. 170: pedido em aberto é etiqueta, não trava do item */
  ok(await p.evaluate(()=>{ const c=document.querySelector('.loja-item[data-pres-id="garrafinha"]');
    return !!c && !!c.querySelector('.li-estoque.meu'); }), '3: enquanto aguarda, o item marca "seus" pedidos');
  // admin confirma a entrega
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-liber"]').click()); await p.waitForTimeout(300);
  ok(/×2/.test(await p.evaluate(()=>document.getElementById('admPedidosList').textContent)), '3.1: pedido no admin mostra a quantidade ×2');
  await p.evaluate(()=>{ const bt=document.querySelector('#admPedidosList [data-ped]'); bt.click(); }); await p.waitForTimeout(300);
  // volta ao aluno: item mostra ENTREGUE e volta a ficar disponível
  await persona(p,'aluno'); await p.waitForTimeout(300); await irLoja(p); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>{ const c=document.querySelector('.loja-item[data-pres-id="garrafinha"]');
    return !!c && !c.querySelector('.li-estoque.meu'); }), '3: dada a baixa, a etiqueta de pedido sai do item');
  // e dá pra comprar de novo (abre o overlay outra vez)
  await p.evaluate(()=>document.querySelector('.loja-item[data-pres-id="garrafinha"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on')), '3: item entregue volta a estar disponível para comprar de novo');
  await p.evaluate(()=>document.getElementById('btnCompraFechar').click());
  await p.locator('#v-loja').locator('.p-card', { has: p.locator('#lojaPres-outros') }).screenshot({path:OUT+'/loja-estoque.png'}).catch(()=>{});
  await p.context().close();
}

// ===== 3.2: seletor de ícone no cadastro de produto =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.querySelectorAll('#admProdIcones .ico-opt').length>=8), '3.2: paleta de ícones pré-selecionados existe');
  await p.fill('#admProdNome','Kit garrafinha'); await p.fill('#admProdDesc','com adesivos'); await p.selectOption('#admProdCat','pres:outros'); await p.fill('#admProdPreco','60'); await p.fill('#admProdQtd','3');
  await p.evaluate(()=>document.querySelector('#admProdIcones .ico-opt[data-ico="garrafinha"]').click()); await p.waitForTimeout(100);
  ok(await p.evaluate(()=>document.querySelector('#admProdIcones .ico-opt[data-ico="garrafinha"]').classList.contains('sel')), '3.2: ícone selecionável');
  await p.click('#btnAdmProd'); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(300); await irLoja(p); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!!document.querySelector('.loja-item[data-nome="Kit garrafinha"] svg')), '3.2: produto cadastrado aparece com ícone escolhido');
  await p.context().close();
}

// ===== 3.3: evento online com link → aparece em eventos e libera o link ao inscrito =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  await p.fill('#admEvNovoNome','Mentoria online'); await p.fill('#admEvNovoResumo','tira-dúvidas ao vivo');
  await p.selectOption('#admEvNovoModal','online'); await p.fill('#admEvNovoLink','https://meet.quad/xyz');
  await p.fill('#admEvNovoData','2026-11-14'); await p.fill('#admEvNovoInicio','10:00'); await p.fill('#admEvNovoFim','12:00');
  await p.selectOption('#admEvSala','Estúdio');   /* dec. 136: o online reserva o Estúdio à mão */
  await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
  ok(/Mentoria online/.test(await p.evaluate(()=>document.getElementById('admEvList').textContent)) &&
     /ONLINE/.test(await p.evaluate(()=>document.getElementById('admEvList').textContent)), '3.3: evento com link vira ONLINE no admin');
  await persona(p,'aluno'); await p.waitForTimeout(400);
  // abre o evento pelo carrossel
  await p.evaluate(()=>{ const t=[...document.querySelectorAll('.ev-tile[data-ev]')].find(x=>/Mentoria online/.test(x.textContent)); t.click(); }); await p.waitForTimeout(400);
  ok(/tira-dúvidas ao vivo/.test(await p.evaluate(()=>document.getElementById('evBody').textContent)), '3.3: resumo do evento aparece na página');
  ok(await p.evaluate(()=>document.getElementById('btnEvLink').disabled), '3.3: link bloqueado antes de inscrever');
  await p.evaluate(()=>document.getElementById('btnEvInscrever').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.getElementById('btnEvLink').disabled), '3.3: após inscrever, o link do evento online libera');
  await p.evaluate(()=>document.getElementById('btnEvVoltar').click()); await p.waitForTimeout(200);
  // ITEM 2: o evento inscrito aparece no calendário
  await p.evaluate(()=>document.querySelector('.nav-plus')?.click()); await p.waitForTimeout(200);
  await p.evaluate(()=>{ const g=document.querySelector('[data-goto="v-calendario"]'); if(g) g.click(); }); await p.waitForTimeout(300);
  ok(/Mentoria online/.test(await p.evaluate(()=>document.getElementById('calList').textContent)), 'ITEM2: evento inscrito entra no calendário do aluno');
  await p.context().close();
}

// ===== 3.4: cancelar evento e remover produto =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  // cancelar um evento
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  const antes = await p.evaluate(()=>document.querySelectorAll('#admEvList .adm-bar').length);
  await p.evaluate(()=>document.querySelector('#admEvList [data-cancel-ev]').click()); await p.waitForTimeout(300);
  const depois = await p.evaluate(()=>document.querySelectorAll('#admEvList .adm-bar').length);
  ok(depois===antes-1, '3.4: cancelar remove o evento da lista do admin ('+antes+'→'+depois+')');
  // remover um produto presencial
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#admProdList [data-rm-pres]')].find(x=>true); bt.click(); }); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(300); await irLoja(p); await p.waitForTimeout(300);
  const nPres = await p.evaluate(()=>document.querySelectorAll('[data-pres-id]').length);
  ok(nPres===7, '3.4: produto removido sai da Loja do aluno (8→'+nPres+')');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
