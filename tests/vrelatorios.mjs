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
async function entrarAdmin(p){ await persona(p,'admin'); await p.waitForTimeout(400); const gate = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on')); if(gate){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(400); } }
const navAdm = (p,v) => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const relTab = (p,r) => p.evaluate(x=>document.querySelector('#relTabs .rel-tab[data-rel="'+x+'"]').click(), r);
const donutA = (p,id) => p.evaluate(x=>document.getElementById(x).style.getPropertyValue('--a'), id);
const colsN = (p,id) => p.evaluate(x=>document.querySelectorAll('#'+x+' .col').length, id);

// ===== 1: aba Relatórios com 4 sub-abas; troca de painel funciona =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-alunos'); await p.waitForTimeout(400);
  const tabs = await p.evaluate(()=>[...document.querySelectorAll('#relTabs .rel-tab')].map(b=>b.textContent.trim()));
  ok(tabs.join('|')==='Individuais|Turmas|Gerais|Loja', '1: sub-abas = Individuais · Turmas · Gerais · Loja ('+tabs.join(' ')+')');
  ok(await p.evaluate(()=>document.querySelector('.rel-panel[data-relpanel="ind"]').classList.contains('on')), '1: abre em Individuais');
  await relTab(p,'loja'); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.querySelector('.rel-panel[data-relpanel="loja"]').classList.contains('on')) && !await p.evaluate(()=>document.querySelector('.rel-panel[data-relpanel="ind"]').classList.contains('on')), '1: clicar em Loja troca o painel');
  await p.context().close();
}

// ===== 2: Individuais — uso (colunas), donut QdC×Dmn, compras, pedagógico; troca de aluno muda os dados =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-alunos'); await p.waitForTimeout(400);
  ok(await colsN(p,'relIndUso')===6, '2: gráfico de uso com 6 colunas (semanas)');
  ok(/logins nas últimas/.test(await p.evaluate(()=>document.getElementById('relIndUsoResumo').textContent)), '2: resumo de logins presente');
  const a1 = await donutA(p,'relIndDonut');
  ok(/%/.test(a1), '2: rosca QdC×Dmn com ângulo ('+a1+')');
  const leg = await p.evaluate(()=>document.getElementById('relIndLegenda').textContent);
  ok(/Quad Coins/.test(leg) && /Diamantes/.test(leg) && /QdC/.test(leg) && /Dmn/.test(leg), '2: legenda com QdC e Dmn');
  ok(await p.evaluate(()=>document.querySelectorAll('#relIndPedag .adm-bar').length)===5, '2: pedagógico com 5 pontos fracos');
  const alunos = await p.evaluate(()=>[...document.querySelectorAll('#relIndAluno option')].map(o=>o.value));
  ok(alunos.length===4 && alunos[0]==='eu', '2: seletor de aluno com as 4 contas');
  // troca para um seed → dados mudam
  const usoEu = await p.evaluate(()=>[...document.querySelectorAll('#relIndUso .col b')].map(b=>b.textContent).join(','));
  await p.selectOption('#relIndAluno','sant'); await p.waitForTimeout(250);
  const usoSant = await p.evaluate(()=>[...document.querySelectorAll('#relIndUso .col b')].map(b=>b.textContent).join(','));
  ok(usoEu!==usoSant, '2: trocar de aluno muda o gráfico de uso ('+usoEu+' → '+usoSant+')');
  await p.context().close();
}

// ===== 3: Turmas — dificuldades reais + uso da sala + apoio inclui o aluno =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-alunos'); await p.waitForTimeout(400);
  await relTab(p,'turma'); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.querySelectorAll('#admDifSubs .adm-bar').length)===5, '3: dificuldades da sala — 5 sub-assuntos');
  ok(await p.evaluate(()=>document.querySelectorAll('#admDifMat .adm-bar').length)===3, '3: 3 matérias com domínio médio');
  ok(await colsN(p,'relTurmaUso')===6, '3: uso da sala com 6 colunas (dias)');
  const usoVals = await p.evaluate(()=>[...document.querySelectorAll('#relTurmaUso .col b')].map(b=>+b.textContent));
  ok(usoVals.every(v=>v>=0), '3: colunas de uso sem valores negativos ('+usoVals.join(',')+')');
  const apoio = await p.evaluate(()=>document.getElementById('admApoioList').textContent);
  ok(/AL SD QUAD MOURA/.test(apoio) && /Acionar/.test(apoio), '3: lista de apoio com o aluno e botão Acionar');
  const ph = await p.evaluate(()=>document.querySelector('.rel-panel[data-relpanel="turma"]').textContent);
  ok(/Presença nas aulas/.test(ph) && /Feedbacks da turma/.test(ph) && (ph.match(/EM BREVE/g)||[]).length>=2, '3: placeholders de presença e feedbacks marcados EM BREVE');
  await p.context().close();
}

// ===== 4: Gerais — perfil médio + dificuldade pedagógica por matéria + satisfação placeholder =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-alunos'); await p.waitForTimeout(400);
  await relTab(p,'geral'); await p.waitForTimeout(200);
  const perfil = await p.evaluate(()=>document.querySelector('.rel-panel[data-relpanel="geral"] table.mini').textContent);
  ok(/412/.test(perfil) && /Idade média/.test(perfil), '4: perfil médio da base');
  ok(await p.evaluate(()=>document.querySelectorAll('#relGeralMat .adm-bar').length)>=3, '4: dificuldade pedagógica por matéria (barras)');
  ok(/Satisfação geral/.test(await p.evaluate(()=>document.querySelector('.rel-panel[data-relpanel="geral"]').textContent)), '4: bloco de satisfação presente');
  await p.context().close();
}

// ===== 5: Loja — vendas, mais vendidos, faturamento QdC×Dmn, entradas×saídas, compradores movidos =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-alunos'); await p.waitForTimeout(400);
  await relTab(p,'loja'); await p.waitForTimeout(200);
  ok(await colsN(p,'relLojaVendas')===6, '5: vendas por período — 6 colunas');
  ok(await p.evaluate(()=>document.querySelectorAll('#relLojaTop .adm-bar').length)===5, '5: mais vendidos — 5 itens');
  ok(/%/.test(await donutA(p,'relLojaDonut')), '5: rosca de faturamento QdC×Dmn com ângulo');
  ok(await colsN(p,'relLojaFluxo')===2, '5: entradas×saídas — 2 colunas');
  const comp = await p.evaluate(()=>document.getElementById('admComprasList').textContent);
  ok(/AL SGT QUAD SANTIAGO/.test(comp) || /Aula isolada/.test(comp), '5: compradores agora aparecem em Relatórios · Loja');
  // e sumiram da aba Loja (governança)
  await navAdm(p,'v-adm-loja'); await p.waitForTimeout(200);
  ok(!await p.evaluate(()=>document.querySelector('#v-adm-loja #admComprasList')), '5: card de compradores saiu da aba Loja (governança)');
  const dica = await p.evaluate(()=>document.getElementById('v-adm-loja').textContent);
  ok(/Relatórios · Loja/.test(dica), '5: aba Loja aponta os compradores para Relatórios');
  await p.context().close();
}

// ===== 6: "ver completo" nos compradores quando há muitas compras =====
{ const p = await loginAluno();
  // gera várias compras reais na Loja
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(400);
  for (let k=0;k<5;k++){ await p.evaluate(()=>{ if(typeof lojaCompraLog==='function') lojaCompraLog('Item teste '+Math.random().toString(36).slice(2,5), 30, 'qdc'); }); }
  await p.waitForTimeout(200);
  await entrarAdmin(p); await navAdm(p,'v-adm-alunos'); await p.waitForTimeout(300); await relTab(p,'loja'); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>!!document.getElementById('relComprasBtn')), '6: botão "ver completo" aparece com muitas compras');
  const antes = await p.evaluate(()=>document.querySelectorAll('#admComprasList .adm-bar').length);
  ok(antes===5, '6: começa colapsado em 5 linhas');
  await p.evaluate(()=>document.getElementById('relComprasBtn').click()); await p.waitForTimeout(200);
  const depois = await p.evaluate(()=>document.querySelectorAll('#admComprasList .adm-bar').length);
  ok(depois>5, '6: "ver completo" expande ('+antes+' → '+depois+')');
  await p.locator('.rel-panel[data-relpanel="loja"]').screenshot({path:OUT+'/rel-loja.png'}).catch(()=>{});
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
