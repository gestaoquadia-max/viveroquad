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
const nav = (p,v) => p.evaluate(x=>document.querySelector('#navAluno .nav-btn[data-view="'+x+'"]').click(), v);
const navAdm = (p,v) => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const toast = p => p.evaluate(()=>document.getElementById('toast').textContent);
async function entrarAdmin(p){ await persona(p,'admin'); await p.waitForTimeout(400); const gate = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on')); if(gate){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(400); } }
const confirmar = async p => { await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350); };

// ===== 2.1: editar aviso já enviado =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  await p.fill('#admAvTitulo','Aviso original'); await p.fill('#admAvDet','detalhe A'); await p.selectOption('#admAvEsc','todas');
  await p.click('#btnAdmAviso'); await p.waitForTimeout(250);
  const n0 = await p.evaluate(()=>document.querySelectorAll('#admAvisosList .adm-aviso').length);
  ok(await p.evaluate(()=>/Editar/.test(document.getElementById('admAvisosList').textContent)), '2.1: aviso tem botão Editar (ao lado de Remover)');
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admAvisosList .adm-aviso')]; const r=rows.find(x=>/Aviso original/.test(x.textContent)); r.querySelector('[data-av-ed]').click(); }); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.getElementById('admAvTitulo').value)==='Aviso original' && await p.evaluate(()=>document.getElementById('btnAdmAviso').textContent)==='Salvar aviso', '2.1: Editar carrega o aviso no formulário');
  await p.fill('#admAvTitulo','Aviso corrigido'); await p.click('#btnAdmAviso'); await p.waitForTimeout(250);
  const n1 = await p.evaluate(()=>document.querySelectorAll('#admAvisosList .adm-aviso').length);
  ok(/atualizado/.test(await toast(p)) && n1===n0, '2.1: salvar edita no lugar (não duplica)');
  await persona(p,'aluno'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>/Aviso corrigido/.test(document.getElementById('avisosList').textContent)) && !await p.evaluate(()=>/Aviso original/.test(document.getElementById('avisosList').textContent)), '2.1: aluno vê o aviso corrigido');
  await p.context().close();
}

// ===== 2.2: horário do cronograma sincroniza com a criação de turmas =====
{ const p = await loginAluno(); await entrarAdmin(p);
  /* cria PATAMO noite com horário DIFERENTE (mesmo tipo/turno do aluno).
     Dec. 163: cada turma tem a SUA grade — a nova não sequestra mais o
     horário da turma antiga; ela ganha entrada própria no cronograma.  */
  await p.selectOption('#admCtTipo','PATAMO'); await p.fill('#admCtApelido','Turma Horário');
  await p.selectOption('#admCtConc','cfo');
  await p.fill('#admCtIni','2026-08-01'); await p.fill('#admCtFim','2027-02-01');
  /* à noite as 4 salas estão tomadas até 22h — o horário novo começa quando
     elas liberam, e a turma vai para a Sala 4 (a isolada de lá é 20h–22h) */
  await p.fill('#admCtH1i','22:00'); await p.fill('#admCtH1f','23:00'); await p.fill('#admCtH2f','23:59');
  await p.selectOption('#admCtSala','Sala 4');
  await p.fill('#admCtPrecoDmn','1000'); await p.fill('#admCtPrecoQdc','1200'); await p.fill('#admCtVagas','50'); await p.fill('#admCtVagasQdc','5');
  await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(300);
  // editor de cronograma: rótulos de tempo seguem o novo horário
  await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(200);
  await p.evaluate(()=>{ const s=document.getElementById('admCrTurma');
    const o=[...s.options].find(x=>/Turma Horário/.test(x.textContent)); if(o) s.value=o.value;
    s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(200);
  const tempos = await p.evaluate(()=>[...document.querySelectorAll('#admCrTempo option')].map(o=>o.textContent));
  ok(/22h – 23h/.test(tempos[0]) && /23h – 23h59/.test(tempos[1]), '2.2: rótulos do cronograma seguem o horário DA turma ('+tempos.join(' | ')+')');
  // e a turma antiga do aluno segue com o horário dela, sem contaminação
  await p.evaluate(()=>{ const s=document.getElementById('admCrTurma');
    const o=[...s.options].find(x=>/Turma PATAMO ·/.test(x.textContent)); if(o) s.value=o.value;
    s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(200);
  const tempos0 = await p.evaluate(()=>[...document.querySelectorAll('#admCrTempo option')].map(o=>o.textContent));
  ok(/19h/.test(tempos0[0]), '2.2: a turma antiga NÃO herda o horário da nova (dec. 163) ('+tempos0.join(' | ')+')');
  await persona(p,'aluno'); await p.waitForTimeout(400);
  const slots = await p.evaluate(()=>document.getElementById('aulaSlots').textContent.replace(/\s+/g,' '));
  ok(/19h – 20h30/.test(slots), '2.2: "Aula de hoje" do aluno segue o horário da turma DELE');
  await p.context().close();
}

// ===== 2.3: evento pago no carrossel com "Na Loja", clique leva à Loja, expira por data =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  const futuro = await p.evaluate(()=>{ const d=new Date(Date.now()+4*86400000); const z=n=>(n<10?'0':'')+n; return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate()); });
  // horário da manhã: a turma do aluno é 19h–22h e a agenda agora bloqueia choque
  await p.fill('#admEvNovoInicio','09:00'); await p.fill('#admEvNovoFim','11:00');
  const passado = await p.evaluate(()=>{ const d=new Date(Date.now()-6*86400000); const z=n=>(n<10?'0':'')+n; return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate()); });
  // evento pago presencial para esta semana
  await p.fill('#admEvNovoNome','Aulão Pago Semana'); await p.fill('#admEvNovoResumo','revisão paga');
  await p.selectOption('#admEvNovoModal','presencial'); await p.selectOption('#admEvNovoTipo','pago');
  await p.selectOption('#admEvNovoMoeda','qdc'); await p.fill('#admEvNovoPreco','50'); await p.fill('#admEvNovoData',futuro);
  await p.selectOption('#admEvSala','Sala 3');
  await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
  // evento pago no passado → deve expirar (não aparece)
  await p.fill('#admEvNovoNome','Aulão Vencido'); await p.selectOption('#admEvNovoTipo','pago'); await p.selectOption('#admEvNovoMoeda','qdc'); await p.fill('#admEvNovoPreco','50'); await p.fill('#admEvNovoData',passado);
  await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(400);
  const strip = await p.evaluate(()=>[...document.querySelectorAll('#evStrip .ev-tile')].map(t=>t.textContent));
  ok(strip.some(t=>/Aulão Pago Semana/.test(t) && /NA LOJA/.test(t)), '2.3: evento pago da semana aparece no carrossel com "Na Loja"');
  ok(!strip.some(t=>/Aulão Vencido/.test(t)), '2.3: evento com data passada não aparece (expirou)');
  // clicar no tile do pago leva à Loja
  await p.evaluate(()=>{ const t=[...document.querySelectorAll('#evStrip .ev-tile')].find(x=>/Aulão Pago Semana/.test(x.textContent)); t.click(); }); await p.waitForTimeout(400);
  /* dec. 173: leva ao ITEM, centralizado e piscando — não só à aba */
  ok(await p.evaluate(()=>document.getElementById('v-loja').classList.contains('on')) && /a inscrição é aqui na Loja/.test(await toast(p)), '2.3: clicar no evento pago leva à Loja');
  ok(await p.evaluate(()=>{ const el=[...document.querySelectorAll('#v-loja [data-ev-buy]')].find(x=>/Aulão Pago Semana/.test(x.textContent));
    return !!el && el.classList.contains('achei'); }), '2.3: e destaca o item exato que ele veio comprar');
  ok(await p.evaluate(()=>/Aulão Pago Semana/.test(document.getElementById('lojaEventos-pres').textContent)), '2.3: evento à venda na vitrine de eventos presenciais');
  // compra → carrossel vira "Inscrito" e o pontual sai da vitrine
  await p.evaluate(()=>{ const el=[...document.querySelectorAll('#lojaEventos-pres [data-ev-buy]')].find(x=>/Aulão Pago Semana/.test(x.textContent)); el.click(); }); await p.waitForTimeout(300);
  await confirmar(p);
  await nav(p,'v-inicio'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>[...document.querySelectorAll('#evStrip .ev-tile')].some(t=>/Aulão Pago Semana/.test(t.textContent) && /INSCRITO/.test(t.textContent))), '2.3: comprado → carrossel mostra "Inscrito"');
  await p.context().close();
}

// ===== 2.4: editar evento já criado (mantém inscritos) =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  const futuro = await p.evaluate(()=>{ const d=new Date(Date.now()+5*86400000); const z=n=>(n<10?'0':'')+n; return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate()); });
  await p.fill('#admEvNovoInicio','09:00'); await p.fill('#admEvNovoFim','11:00');
  await p.fill('#admEvNovoNome','Corujão Editável'); await p.fill('#admEvNovoResumo','madrugada'); await p.selectOption('#admEvNovoModal','presencial'); await p.selectOption('#admEvNovoTipo','gratuito'); await p.fill('#admEvNovoData',futuro);
  await p.selectOption('#admEvSala','Sala 3');
  await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
  // aluno se inscreve (gratuito → página do evento)
  await persona(p,'aluno'); await p.waitForTimeout(300);
  await p.evaluate(()=>{ const t=[...document.querySelectorAll('#evStrip .ev-tile')].find(x=>/Corujão Editável/.test(x.textContent)); t.click(); }); await p.waitForTimeout(400);
  await p.evaluate(()=>{ const b=document.getElementById('btnEvInscrever'); if(b) b.click(); }); await p.waitForTimeout(250);
  await p.evaluate(()=>document.getElementById('btnEvVoltar').click());
  // admin edita: renomeia e torna pago
  await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>/Corujão Editável/.test(document.getElementById('admEvList').textContent)) && /1 inscrito/.test(await p.evaluate(()=>document.getElementById('admEvList').textContent)), '2.4: lista mostra o evento com o inscrito');
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admEvList .adm-bar')]; const r=rows.find(x=>/Corujão Editável/.test(x.textContent)); r.querySelector('[data-ed-ev]').click(); }); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.getElementById('admEvNovoNome').value)==='Corujão Editável' && await p.evaluate(()=>document.getElementById('btnAdmEvNovo').textContent)==='Salvar alterações', '2.4: Editar carrega o evento no formulário');
  await p.fill('#admEvNovoNome','Corujão Especial'); await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
  ok(/atualizado/.test(await toast(p)) && await p.evaluate(()=>/Corujão Especial/.test(document.getElementById('admEvList').textContent)), '2.4: salvar renomeia o evento');
  ok(/1 inscrito/.test(await p.evaluate(()=>document.getElementById('admEvList').textContent)), '2.4: inscrito preservado após a edição');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
