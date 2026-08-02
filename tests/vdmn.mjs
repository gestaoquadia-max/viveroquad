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
const num = s => parseInt(String(s).replace(/\D/g,''),10)||0;
const dmn = p => p.evaluate(()=>parseInt(document.getElementById('dmnVal').textContent.replace(/\D/g,''),10));
const clickItem = (p,nome) => p.evaluate(n=>{ const el=[...document.querySelectorAll('.loja-item[data-nome]')].find(x=>x.dataset.nome===n); el.click(); }, nome);
const confirmar = p => p.evaluate(()=>document.getElementById('btnCompraOk').click());

// ===== 1: Diamante no topo, logo abaixo do Quad Coin =====
{ const p = await loginAluno();
  ok(await p.evaluate(()=>!!document.getElementById('dmnCard')), '1: card do Diamante existe no topo');
  ok(await p.evaluate(()=>{ const w=document.querySelector('.wallet-col'); return w && w.children[0].id==='coinsCard' && w.children[1].id==='dmnCard'; }), '1: Diamante fica LOGO ABAIXO do Quad Coin');
  ok((await dmn(p))===150, '1: saldo inicial de 150 Dmn (recarga do site, demo)');
  ok(await p.evaluate(()=>document.querySelector('#dmnCard img.dmn-art').src.startsWith('data:image/webp')), '1: arte oficial do diamante embarcada');
  await p.context().close();
}

// ===== 1.2: gift card de liberação única =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  await p.fill('#giftCode','quad-100'); await p.evaluate(()=>document.getElementById('btnGift').click()); await p.waitForTimeout(300);
  ok((await dmn(p))===250, '1.2: gift QUAD-100 credita +100 Dmn (150→250)');
  await p.fill('#giftCode','QUAD-100'); await p.evaluate(()=>document.getElementById('btnGift').click()); await p.waitForTimeout(300);
  ok(/já foi resgatado/i.test(await toast(p)), '1.2: gift card é de LIBERAÇÃO ÚNICA (reuso bloqueado)');
  ok((await dmn(p))===250, '1.2: saldo não muda no reuso');
  await p.fill('#giftCode','XPTO-1'); await p.evaluate(()=>document.getElementById('btnGift').click()); await p.waitForTimeout(300);
  ok(/inválido/i.test(await toast(p)), '1.2: código inválido é recusado');
  await p.context().close();
}

// ===== 2: Loja Quad — hero novo, sem Intendência e sem "Como ganhar" =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.querySelector('#v-loja .lh-title').textContent==='Quad Store'), '2: cabeçalho gráfico "Quad Store"');
  const texto = await p.evaluate(()=>document.getElementById('v-loja').textContent);
  ok(!/Intendência Quad/.test(texto), '2: bloco "Intendência Quad" removido');
  ok(!/Como ganhar Quad Coins/.test(texto), '2: bloco "Como ganhar Quad Coins" removido');
  const macros = await p.evaluate(()=>[...document.querySelectorAll('#v-loja .loja-macro')].map(m=>m.textContent.trim()));
  ok(macros.some(m=>/Atividades e itens · presenciais/i.test(m)) && macros.some(m=>/Itens digitais/i.test(m)), '2: dois macro-blocos (presenciais + digitais)');
  const subs = await p.evaluate(()=>[...document.querySelectorAll('#v-loja .loja-sec')].map(k=>k.textContent));
  for (const s of ['Turmas','Isoladas','Simulados presenciais','Excursões','Módulos','TAF','Outros','Cursos online','Mentoria','Itens do personagem']) {
    ok(subs.some(x=>x.indexOf(s)>=0), '2: sub-área "'+s+'" presente');
  }
  await p.context().close();
}

// ===== 3: preços em Dmn e compra com Diamantes (com confirmação) =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>/600 Dmn ou 700 QdC/.test(document.querySelector('[data-turma="rondesp-m"] .li-preco').textContent.replace(/\u00a0/g,' '))), '3: turma da manhã precificada nas DUAS moedas');
  // gift 500 para poder comprar a isolada de 350 Dmn
  await p.fill('#giftCode','QUAD-500'); await p.evaluate(()=>document.getElementById('btnGift').click()); await p.waitForTimeout(200);
  const d0 = await dmn(p);
  await clickItem(p,'Isolada de Português'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on')), '3: confirmação de compra abre (não compra sem querer)');
  ok(/350 Dmn/.test(await p.evaluate(()=>document.getElementById('compraTotal').textContent)), '3: total confirma em Dmn');
  await confirmar(p); await p.waitForTimeout(300);
  ok((await dmn(p))===d0-350, '3: compra debita DIAMANTES: '+d0+'→'+(d0-350));
  ok((await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Isolada de Português"] .li-preco').textContent))==='ADQUIRIDO', '3: item vira ADQUIRIDO');
  await p.context().close();
}

// ===== 4: cancelar a confirmação NÃO debita =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  const s0 = num(await p.evaluate(()=>document.getElementById('scoreVal').textContent));
  await clickItem(p,'Aula isolada'); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on')), '4: confirmação abre para item de unidade única');
  await p.evaluate(()=>document.getElementById('btnCompraFechar').click()); await p.waitForTimeout(200);
  const s1 = num(await p.evaluate(()=>document.getElementById('scoreVal').textContent));
  ok(s1===s0, '4: cancelar não debita ('+s0+'='+s1+')');
  await p.context().close();
}

// ===== 5: vagas da turma decrementam POR MOEDA na matrícula =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('[data-turma="rondesp-m"]').click()); await p.waitForTimeout(300);
  await p.evaluate(()=>document.getElementById('btnTuQdc').click()); await p.waitForTimeout(400);
  const badge = await p.evaluate(()=>document.querySelector('[data-turma="rondesp-m"] .li-estoque').textContent);
  ok(/54 Dmn · 5 QdC/.test(badge), '5: matrícula em QdC → vagas QdC 6→5, Dmn intactas ('+badge+')');
  await p.context().close();
}

// ===== 6: boina desaparece da vitrine após a compra =====
{ const p = await loginAluno();
  await irLoja(p); await p.waitForTimeout(300);
  await clickItem(p,'Boina exclusiva'); await p.waitForTimeout(250);
  await confirmar(p); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Boina exclusiva"]').style.display==='none'), '6: boina comprada some da vitrine');
  await p.context().close();
}

// ===== 7: admin — produto em Diamantes + separações visuais =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  const seps = await p.evaluate(()=>[...document.querySelectorAll('#v-adm-hoje .adm-sep')].map(s=>s.textContent.trim()));
  ok(seps.some(s=>/Avisos enviados/.test(s)), '7: separação visual nos Avisos gerais');
  ok(seps.some(s=>/Criar evento/.test(s)) && seps.some(s=>/Eventos criados/.test(s)), '7: criação separada da lista nos Eventos');
  ok(seps.some(s=>/Simulados lançados/.test(s)), '7: separação no Lançamento de simulados');
  // produto vendido em Diamantes
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  await p.fill('#admProdNome','E-book Direito Penal'); await p.fill('#admProdDesc','material digital');
  await p.selectOption('#admProdCat','dig:cursos'); await p.selectOption('#admProdMoeda','dmn'); await p.fill('#admProdPreco','120');
  await p.click('#btnAdmProd'); await p.waitForTimeout(300);
  ok(/Diamantes/.test(await toast(p)), '7: cadastro confirma venda em Diamantes');
  await persona(p,'aluno'); await p.waitForTimeout(300); await irLoja(p); await p.waitForTimeout(300);
  const eb = await p.evaluate(()=>{ const el=document.querySelector('.loja-item[data-nome="E-book Direito Penal"]'); return el ? el.querySelector('.li-preco').textContent : 'MISSING'; });
  ok(/120 Dmn/.test(eb), '7: produto digital aparece na Loja em Dmn ('+eb+')');
  await p.context().close();
}

// ===== 8: simulado pago em Diamantes chega à Loja em Dmn =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  await p.fill('#admSimNome','Simulado 77 · PRF'); await p.selectOption('#admSimModal','presencial');
  await p.fill('#admSimData','2026-08-09'); await p.fill('#admSimIni','08:00'); await p.fill('#admSimFim','12:00');
  await p.fill('#admSimVagas','40'); await p.fill('#admSimVagasQdc','0'); await p.fill('#admSimPrecoDmn','200');
  await p.selectOption('#admSimSala','Sala 1');
  await p.click('#btnAdmSimLancar'); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(300); await irLoja(p); await p.waitForTimeout(300);
  const r = await p.evaluate(()=>{ const el=[...document.querySelectorAll('#lojaSim-pres .loja-item')].find(x=>x.textContent.includes('Simulado 77')); return el?el.querySelector('.li-preco').textContent:'MISSING'; });
  ok(/200 Dmn/.test(r), '8: simulado pago em Diamantes na Loja ('+r+')');
  // e compra debita diamantes (150 iniciais + gift 100 = 250 → 50)
  await p.fill('#giftCode','QUAD-100'); await p.evaluate(()=>document.getElementById('btnGift').click()); await p.waitForTimeout(200);
  await p.evaluate(()=>{ const el=[...document.querySelectorAll('#lojaSim-pres .loja-item')].find(x=>x.textContent.includes('Simulado 77')); el.click(); }); await p.waitForTimeout(250);
  await confirmar(p); await p.waitForTimeout(300);
  ok((await dmn(p))===50, '8: compra do simulado debita Dmn (250→50)');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
