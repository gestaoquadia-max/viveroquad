const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const errors = [], log = [];
const browser = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const c = await browser.newContext({ viewport:{width:1100,height:900}, deviceScaleFactor:2 });
const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ p.on('pageerror',e=>errors.push('pageerror: '+e.message));
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(500);
// entra como aluno (o app fica atrás; personas trocam por fora do telefone)
await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600);
const toast = () => p.evaluate(()=>document.getElementById('toast').textContent);
const persona = q => p.evaluate(pp=>{ document.querySelector('.persona-btn[data-persona="'+pp+'"]').click(); }, q);

// ===== 1: gate de liberação =====
{ await persona('admin'); await p.waitForTimeout(400);
  if (!await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'))) errors.push('1: gate não apareceu ao entrar como admin');
  await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','ERRADA'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(300);
  if (!await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'))) errors.push('1: chave errada liberou o acesso');
  await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(300);
  if (await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'))) errors.push('1: chave certa não liberou');
  if (!await p.evaluate(()=>document.getElementById('v-adm-controle').classList.contains('on'))) errors.push('1: não abriu o Painel de controle');
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  if (!await p.evaluate(()=>document.getElementById('v-adm-hoje').classList.contains('on'))) errors.push('1: não abriu o Painel interno');
  const fabAdm = await p.evaluate(()=>getComputedStyle(document.getElementById('daniloFab')).display);
  if (fabAdm!=='none') errors.push('1: robô de ajuda visível na área do administrador');
  await persona('aluno'); await p.waitForTimeout(300);
  const fabAluno = await p.evaluate(()=>getComputedStyle(document.getElementById('daniloFab')).display);
  if (fabAluno==='none') errors.push('1: robô de ajuda sumiu da área do aluno');
  await persona('admin'); await p.waitForTimeout(300);
  log.push('✔ 1: gate exige e-mail + chave da direção; NPP-2026 libera; robô só na área do aluno');
}

// ===== 2: aviso geral com escopo chega (ou não) ao aluno =====
{ await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  await p.fill('#admAvTitulo','Aulão de véspera confirmado'); await p.fill('#admAvDet','quinta 19h · material impresso');
  await p.selectOption('#admAvEsc','patamo-n'); await p.click('#btnAdmAviso');   /* dec. 149: alvo por id da turma */ await p.waitForTimeout(300);
  await p.fill('#admAvTitulo','Recado só para o BOPE'); await p.selectOption('#admAvEsc','bope-n'); await p.click('#btnAdmAviso'); await p.waitForTimeout(300);
  const adm = await p.evaluate(()=>document.getElementById('admAvisosList').textContent);
  if (!/Aulão de véspera/.test(adm) || !/Recado só para o BOPE/.test(adm)) errors.push('2: lista do admin incompleta');
  await persona('aluno'); await p.waitForTimeout(400);
  const alu = await p.evaluate(()=>document.getElementById('avisosList').textContent);
  if (!/Aulão de véspera confirmado/.test(alu)) errors.push('2: aviso da PATAMO não chegou ao aluno da PATAMO');
  if (/Recado só para o BOPE/.test(alu)) errors.push('2: aviso da BOPE vazou para aluno da PATAMO');
  const kl = await p.evaluate(()=>[...document.querySelectorAll('#v-inicio .k-label')].some(k=>k.textContent.trim()==='Avisos gerais'));
  if (!kl) errors.push('2: card do aluno não renomeado para Avisos gerais');
  log.push('✔ 2: aviso PATAMO chega ao aluno, aviso BOPE não; card renomeado "Avisos gerais"');
}

// ===== 3: cronograma atualizado sincroniza a Aula de hoje =====
{ await persona('admin'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  // edita o dia que a "Aula de hoje" realmente mostra (hoje, ou segunda no fim de semana)
  const diHoje = await p.evaluate(()=>{ var i=new Date().getDay()-1; return String((i>=0&&i<=4)?i:0); });
  /* dec. 163: a chave do cronograma é o id da turma, e a option mostra o nome */
  await p.selectOption('#admCrTurma','patamo-n'); await p.selectOption('#admCrDia',diHoje); await p.selectOption('#admCrTempo','0');
  const pre = await p.evaluate(()=>document.getElementById('admCrMat').value);
  if (!pre) errors.push('3: editor não pré-carregou a aula atual');
  // matéria e professor agora saem de seletores ligados à árvore e ao banco de professores
  const lanc = await p.evaluate(()=>{
    const sm=document.getElementById('admCrMat'), sp=document.getElementById('admCrProf');
    for (const o of sm.options){ sm.value=o.value; sm.dispatchEvent(new Event('change'));
      if (sp.value) return {mat:sm.value.toUpperCase(), prof:sp.value}; }
    return null;
  });
  if (!lanc) errors.push('3: nenhuma matéria da turma tem professor no banco');
  await p.click('#btnAdmCrono'); await p.waitForTimeout(300);
  await persona('aluno'); await p.waitForTimeout(400);
  const slots = await p.evaluate(()=>document.getElementById('aulaSlots').textContent);
  if (lanc && (!slots.includes(lanc.mat) || !slots.includes(lanc.prof))) errors.push('3: Aula de hoje não sincronizou: '+slots.slice(0,80));
  log.push('✔ 3: cronograma alterado pelo admin muda a Aula de hoje do aluno na hora');
}

// ===== 4: regra nova + evento novo alimentam o carrossel do aluno =====
{ await persona('admin'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  await p.selectOption('#admEvSel','gincana'); await p.selectOption('#admEvTipo','coins');
  await p.fill('#admEvRegra','Bônus de estreia'); await p.fill('#admEvValor','+20'); await p.click('#btnAdmEvRegra'); await p.waitForTimeout(300);
  await p.fill('#admEvNovoNome','Copa Quad de Questões'); await p.fill('#admEvNovoData','2026-09-05');   /* data futura: evento vencido sai do carrossel */ await p.fill('#admEvNovoInicio','19:00'); await p.selectOption('#admEvSala','Sala 1'); await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
  await persona('aluno'); await p.waitForTimeout(400);
  const strip = await p.evaluate(()=>document.getElementById('evStrip').textContent);
  if (!/COPA QUAD DE QUESTÕES/i.test(strip)) errors.push('4: evento novo não entrou no carrossel');
  await p.evaluate(()=>{ [...document.querySelectorAll('#evStrip .ev-tile')].find(t=>t.dataset.ev==='gincana').click(); }); await p.waitForTimeout(500);
  const pagina = await p.evaluate(()=>document.getElementById('evPage') ? document.getElementById('evPage').textContent : document.body.textContent);
  if (!/Bônus de estreia/.test(pagina)) errors.push('4: regra nova não aparece na página do evento');
  await p.evaluate(()=>{ const b=document.querySelector('.ev-back'); if(b) b.click(); }); await p.waitForTimeout(300);
  log.push('✔ 4: regra "+20 Bônus de estreia" na página da gincana; Copa Quad no carrossel');
}

// ===== 5: compra presencial gera pedido; admin dá baixa =====
{ await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(400);
  // o Aulão virou EVENTO (não gera pedido de retirada); pedido é de item físico
  await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Garrafinha Quad"]').click()); await p.waitForTimeout(300); await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350);
  await persona('admin'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-liber"]').click()); await p.waitForTimeout(300);
  const ped = await p.evaluate(()=>document.getElementById('admPedidosList').textContent);
  if (!/AL SD QUAD MOURA/.test(ped) || !/Garrafinha Quad/.test(ped)) errors.push('5: pedido do aluno não apareceu: '+ped.slice(0,80));
  await p.evaluate(()=>document.querySelector('#admPedidosList [data-ped]').click()); await p.waitForTimeout(300);
  const ped2 = await p.evaluate(()=>document.getElementById('admPedidosList').querySelectorAll('.tag.ok').length);
  if (ped2 < 2) errors.push('5: baixa não registrada');
  log.push('✔ 5: compra de item físico gera pedido de retirada; admin confirma a entrega');
}

// ===== 6: simulado presencial pago — aluno compra na Loja, admin libera entrada =====
{ await persona('aluno'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-missoes"]').click()); await p.waitForTimeout(300);
  const saldoAntes = await p.evaluate(()=>document.getElementById('scoreVal').textContent);
  // "Inscrever" no presencial pago conduz à Loja
  await p.evaluate(()=>{ const bts=[...document.querySelectorAll('#simuladosList [data-sim]')]; const alvo=bts.find(b=>b.closest('.sim-row').textContent.includes('Simulado 63')); if(alvo) alvo.click(); });
  await p.waitForTimeout(400);
  if (!await p.evaluate(()=>document.getElementById('v-loja').classList.contains('on'))) errors.push('6: presencial pago não conduziu à Loja');
  await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#lojaSim-pres [data-sim-buy]')].find(x=>x.textContent.includes('Simulado 63')); if(bt) bt.click(); }); await p.waitForTimeout(350);
  /* presencial vende nas duas moedas: escolhe QdC no pop-up antes de confirmar */
  await p.evaluate(()=>{ if(document.getElementById('turmaLayer').classList.contains('on')) document.getElementById('btnTuQdc').click(); }); await p.waitForTimeout(300);
  await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-missoes"]').click()); await p.waitForTimeout(200);
  const row = await p.evaluate(()=>{ const r=[...document.querySelectorAll('#simuladosList .sim-row')].find(x=>x.textContent.includes('Simulado 63')); return r?r.textContent:''; });
  if (!/INSCRITO/.test(row)) errors.push('6: inscrição não marcada após compra: '+row);
  await persona('admin'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-liber"]').click()); await p.waitForTimeout(300);
  const lista = await p.evaluate(()=>document.getElementById('admSpLista').textContent);
  if (!/AL SD QUAD MOURA/.test(lista)) errors.push('6: comprador não entrou na lista de inscritos');
  await p.evaluate(()=>{ const meu=[...document.querySelectorAll('#admSpLista .mission-row')].find(r=>r.textContent.includes('AL SD QUAD MOURA')&&r.querySelector('[data-cp]')); if(meu) meu.querySelector('[data-cp]').click(); }); await p.waitForTimeout(300);
  const lib = await p.evaluate(()=>{ const r=[...document.querySelectorAll('#admSpLista .mission-row')].find(x=>x.textContent.includes('AL SD QUAD MOURA')); return r?r.textContent:''; });
  if (!/LIBERAD/.test(lib)) errors.push('6: entrada do aluno não liberada: '+lib);
  log.push('✔ 6: presencial pago comprado na Loja (saldo antes '+saldoAntes+') → inscritos → entrada liberada');
}

// ===== 7: admin lança pelo "Hoje" — presencial pago → Loja; digital grátis → Missões =====
{ await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(300);
  /* presencial: sempre vendido, com vagas e preços por moeda */
  await p.fill('#admSimNome','Simulado 64 · SD PMBA'); await p.selectOption('#admSimModal','presencial');
  await p.fill('#admSimData','2026-07-26'); await p.fill('#admSimIni','08:00'); await p.fill('#admSimFim','12:00');
  await p.fill('#admSimVagas','0'); await p.fill('#admSimVagasQdc','100'); await p.fill('#admSimPrecoQdc','150');   /* vagas POR MOEDA (dec. 155) */
  await p.selectOption('#admSimSala','Sala 1');
  await p.click('#btnAdmSimLancar'); await p.waitForTimeout(300);
  await p.fill('#admSimNome','Simulado digital · CFO 2ª fase'); await p.selectOption('#admSimModal','digital'); await p.selectOption('#admSimTipo','gratis');
  await p.setInputFiles('#admSimPdf', { name:'cfo2.pdf', mimeType:'application/pdf', buffer: Buffer.from('%PDF-1.4') }); await p.waitForTimeout(150);
  await p.fill('#admSimMin','25'); await p.fill('#admSimNq','8');
  await p.click('#btnAdmSimLancar'); await p.waitForTimeout(300);
  await persona('aluno'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(200);
  const loja = await p.evaluate(()=>document.getElementById('lojaSim-pres').textContent);
  if (!/Simulado 64/.test(loja) || !/150 QdC/.test(loja)) errors.push('7: presencial pago não foi à Loja: '+loja);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-missoes"]').click()); await p.waitForTimeout(200);
  const sims = await p.evaluate(()=>document.getElementById('simuladosList').textContent);
  if (!/CFO 2ª fase/.test(sims)) errors.push('7: digital grátis novo não apareceu em Missões');
  log.push('✔ 7: Simulado 64 (pago) → Loja; digital CFO 2ª fase (grátis) → Missões, ambos pelo Hoje');
}

// ===== 8: alunos — dificuldades reais da árvore do Domínio =====
{ await persona('admin'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-alunos"]').click()); await p.waitForTimeout(400);
  const n = await p.evaluate(()=>({ subs: document.querySelectorAll('#admDifSubs .adm-bar').length,
    ass: document.querySelectorAll('#admDifAss .adm-bar').length, mat: document.querySelectorAll('#admDifMat .adm-bar').length,
    apoio: document.querySelectorAll('#admApoioList .mission-row').length }));
  if (n.subs!==5||n.ass!==3||n.mat!==3||n.apoio!==4) errors.push('8: painéis de dificuldade: '+JSON.stringify(n));
  const temPct = await p.evaluate(()=>/%/.test(document.getElementById('admDifSubs').textContent));
  if (!temPct) errors.push('8: percentuais ausentes');
  const apoio = await p.evaluate(()=>document.getElementById('admApoioList').textContent);
  if (!/AL SD QUAD MOURA/.test(apoio)) errors.push('8: aluno da sessão fora da lista de apoio');
  log.push('✔ 8: top-5 sub-assuntos, top-3 assuntos e matérias com % reais; apoio inclui o aluno');
}

// ===== 9: governança da Loja — preço muda para o aluno; link entregue na compra =====
{ await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  await p.evaluate(()=>{ const inp=document.querySelector('[data-preco-item="Aula isolada"]'); inp.value='55'; });
  await p.click('#btnAdmPrecos'); await p.waitForTimeout(300);
  await persona('aluno'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(300);
  const preco = await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Aula isolada"] .li-preco').textContent);
  if (preco!=='55 QdC') errors.push('9: preço novo não chegou à Loja do aluno: '+preco);
  await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Aula isolada"]').click()); await p.waitForTimeout(300); await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350);
  await persona('admin'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  const compras = await p.evaluate(()=>document.getElementById('admComprasList').textContent);
  if (!/Aula isolada/.test(compras) || !/AL SD QUAD MOURA/.test(compras)) errors.push('9: compra não entrou no log de compradores');
  log.push('✔ 9: preço 55 QdC no ar; compra registrada no log de compradores');
}

await browser.close();
console.log(log.join('\n'));
if (errors.length) { console.log('\nERROS:\n' + errors.join('\n')); process.exit(1); }
console.log('\nADMIN-OK');
