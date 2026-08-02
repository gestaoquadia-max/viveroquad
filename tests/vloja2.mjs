const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const errs = [], fails = [];
const ok = (c, m) => { console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
async function ctx(){ const c = await b.newContext({ viewport:{width:1100,height:940}, deviceScaleFactor:2 }); const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ p.on('pageerror', e=>errs.push(e.message)); await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400); return p; }
const loginAluno = async (email='aluno@quad.com') => { const p = await ctx(); await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');}); await p.fill('#loginEmail',email); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600); return p; };
const persona = (p,q) => p.evaluate(pp=>{ document.querySelector('.persona-btn[data-persona="'+pp+'"]').click(); }, q);
const toast = p => p.evaluate(()=>document.getElementById('toast').textContent);
async function entrarAdmin(p){ await persona(p,'admin'); await p.waitForTimeout(400); await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(400); }

// ===== ITEM 1: no tutorial, a mochila não abre (foco na escolha do personagem) =====
{ const p = await ctx();
  await p.fill('#loginEmail','novo@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600);
  ok(await p.evaluate(()=>document.getElementById('tutLayer').classList.contains('on')), 'ITEM1: tutorial ativo no 1º acesso');
  // com o tutorial ativo, clicar na mochila NÃO abre a storage (evita o bug)
  await p.evaluate(()=>document.getElementById('btnMochila').click()); await p.waitForTimeout(300);
  ok(!(await p.evaluate(()=>document.getElementById('storageLayer').classList.contains('on'))), 'ITEM1: mochila bloqueada durante o tutorial (storage não abre)');
  await p.context().close();
}

// ===== ITEM 3: Loja reconstruída em 4 categorias =====
{ const p = await loginAluno();
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(400);
  const labels = await p.evaluate(()=>[...document.querySelectorAll('#v-loja .k-label, #v-loja .loja-sec')].map(k=>k.textContent.trim()));
  for (const cat of [/Turmas/,/^Eventos/,/Itens do personagem/,/Outros · retirada na recepção/]) {
    ok(labels.some(l=>cat.test(l)), 'ITEM3: sub-área "'+cat+'" presente');
  }
  ok(labels.some(l=>/Itens de combate/.test(l)), 'ITEM3: sub-área "Itens de combate" dentro de Itens do personagem');
  // a boina e o combatGrid estão no MESMO card "Itens do personagem"
  const mesmoCard = await p.evaluate(()=>{
    const boina = document.querySelector('.loja-item[data-nome="Boina exclusiva"]');
    const card = boina.closest('.p-card');
    return !!card.querySelector('#combatGrid') && !!card.querySelector('#skinChain');
  });
  ok(mesmoCard, 'ITEM3: boina + skins + combate no mesmo card (Itens digitais)');
  // itens presenciais novos, todos com data-presencial
  const pres = await p.evaluate(()=>['Garrafinha Quad','Caderno de simulados impresso','Chaveiro Quad','Vade Mecum','Módulo impresso','Camiseta Quad'].map(n=>{ const el=document.querySelector('.loja-item[data-nome="'+n+'"]'); return el?el.dataset.presencial:'MISSING'; }));
  ok(pres.every(x=>x==='1'), 'ITEM3: 6 itens presenciais com pedido de retirada: '+JSON.stringify(pres));
  /* comprar um item presencial: overlay de quantidade → compra → pedido.
     Dec. 170: o item NÃO trava mais — o pedido em aberto vira etiqueta e
     o preço segue à vista enquanto houver estoque.                      */
  await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Chaveiro Quad"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on')), 'ITEM3: presencial abre o overlay de quantidade');
  await p.evaluate(()=>document.getElementById('btnCompraOk').click()); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>{ const c=document.querySelector('.loja-item[data-nome="Chaveiro Quad"]');
    return !!c && !!c.querySelector('.li-estoque.meu') && /QdC|Dmn/.test(c.querySelector('.li-preco').textContent); }),
    'ITEM3: presencial comprado marca "seu pedido" e continua comprável (dec. 170)');
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-liber"]').click()); await p.waitForTimeout(300);
  ok(/Chaveiro Quad/.test(await p.evaluate(()=>document.getElementById('admPedidosList').textContent)), 'ITEM3: compra presencial gerou pedido de retirada na recepção');
  await p.context().close();
}

// ===== ITEM 4: admin cadastra produto/serviço → aparece na Loja do aluno =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!!document.getElementById('btnAdmProd')), 'ITEM4: formulário de cadastro de produto existe');
  // item de personagem nasce no "Criar skin do personagem" (Painel interno)
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(400);
  await p.selectOption('#admSkTipo','skin');
  await p.fill('#admSkNome','Bandana Quad'); await p.fill('#admSkDesc','acessório de cabeça');
  await p.selectOption('#admSkMoeda','qdc'); await p.fill('#admSkPreco','70');
  await p.click('#btnAdmSkin'); await p.waitForTimeout(300);
  ok(/publicada/i.test(await toast(p)), 'ITEM4: skin publicada em Itens do personagem');
  // cadastra um presencial (com estoque) no bloco de produtos
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  await p.fill('#admProdNome','Caneca Quad'); await p.fill('#admProdDesc','porcelana da marca');
  await p.selectOption('#admProdCat','pres:outros'); await p.fill('#admProdPreco','110'); await p.fill('#admProdQtd','5');
  await p.click('#btnAdmProd'); await p.waitForTimeout(300);
  // volta ao aluno e confere que os itens estão na Loja, nas categorias certas
  await persona(p,'aluno'); await p.waitForTimeout(400);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(300);
  const bandanaOk = await p.evaluate(()=>{ const el=document.querySelector('#lojaExtras-personagem .loja-item[data-nome="Bandana Quad"]'); return !!el; });
  ok(bandanaOk, 'ITEM4: skin "Bandana Quad" entrou na sub-área Itens do personagem');
  const canecaPres = await p.evaluate(()=>{ const el=document.querySelector('.loja-item[data-nome="Caneca Quad"]'); return el?el.dataset.presencial:'MISSING'; });
  ok(canecaPres==='1', 'ITEM4: produto presencial "Caneca Quad" marcado para retirada');
  // e é comprável (debita)
  const s0 = parseInt((await p.evaluate(()=>document.getElementById('scoreVal').textContent)).replace(/\D/g,''),10);
  await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Bandana Quad"]').click()); await p.waitForTimeout(300); await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350);
  const s1 = parseInt((await p.evaluate(()=>document.getElementById('scoreVal').textContent)).replace(/\D/g,''),10);
  ok(s1===s0-70, 'ITEM4: produto cadastrado é comprável e debita 70 QdC: '+s0+'→'+s1);
  await p.locator('#v-loja').screenshot({path:OUT+'/loja-nova.png'}).catch(()=>{});
  await p.context().close();
}

// ===== ITEM 2: agenda (date+time) monta o "quando" do evento =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('admEvNovoData').type==='date'), 'ITEM2: campo de data é um seletor de calendário (type=date)');
  ok(await p.evaluate(()=>document.getElementById('admEvNovoInicio').type==='time'), 'ITEM2: campo de horário é um seletor de hora (type=time)');
  await p.fill('#admEvNovoNome','Aulão da virada');
  await p.fill('#admEvNovoData','2026-07-29'); await p.fill('#admEvNovoInicio','19:30'); await p.fill('#admEvNovoFim','21:30');
  await p.evaluate(()=>document.getElementById('admEvNovoData').dispatchEvent(new Event('change')));
  await p.waitForTimeout(200);
  ok(/QUA · 29\/07 · 19H30/.test(await p.evaluate(()=>document.getElementById('admEvNovoPrev').textContent)), 'ITEM2: prévia monta "QUA · 29/07 · 19H30…": '+await p.evaluate(()=>document.getElementById('admEvNovoPrev').textContent));
  await p.selectOption('#admEvSala','Sala 1');
  await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
  ok(/Aulão da virada/.test(await p.evaluate(()=>document.getElementById('admEvList').textContent)), 'ITEM2: evento criado aparece na lista do admin');
  ok(/QUA · 29\/07/.test(await p.evaluate(()=>document.getElementById('admEvList').textContent)), 'ITEM2: data formatada a partir da agenda entra no evento');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
