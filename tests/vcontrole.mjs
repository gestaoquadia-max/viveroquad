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
async function entrarAdmin(p){ await persona(p,'admin'); await p.waitForTimeout(400); const gate = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on')); if(gate){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(400); } }
const navAdm = (p,v) => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const num = s => parseInt(String(s).replace(/\D/g,''),10)||0;

// ===== 1: as 5 abas novas; Controle é a inicial; Estrutura via Painel interno =====
{ const p = await loginAluno(); await entrarAdmin(p);
  const abas = await p.evaluate(()=>[...document.querySelectorAll('#navAdmin .nav-btn')].map(b=>b.textContent.trim()));
  ok(abas.length===5 && /Controle/.test(abas[0]) && /Interno/.test(abas[1]) && /Relatórios/.test(abas[2]) && /Liberações/.test(abas[3]) && /Loja/.test(abas[4]), '1: barra = Controle · Interno · Relatórios · Liberações · Loja ('+abas.join(' | ')+')');
  ok(await p.evaluate(()=>document.getElementById('v-adm-controle').classList.contains('on')), '1: admin abre no Painel de controle');
  await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  ok(/Painel interno/.test(await p.evaluate(()=>document.getElementById('v-adm-hoje').textContent)), '1: aba Interno virou "Painel interno"');
  await p.evaluate(()=>document.getElementById('btnIrEstrutura').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('v-turmas').classList.contains('on')), '1: Estrutura acessível pelo Painel interno');
  await p.context().close();
}

// ===== 2: crédito manual de QdC e Dmn cai na conta na hora =====
{ const p = await loginAluno();
  const q0 = num(await p.evaluate(()=>document.getElementById('scoreVal').textContent));
  const d0 = num(await p.evaluate(()=>document.getElementById('dmnVal').textContent));
  await entrarAdmin(p);
  await p.selectOption('#admCredAluno','eu'); await p.selectOption('#admCredMoeda','qdc'); await p.fill('#admCredValor','500');
  await p.fill('#admCredMotivo','correção de saldo'); await p.click('#btnAdmCred'); await p.waitForTimeout(300);
  await p.selectOption('#admCredMoeda','dmn'); await p.fill('#admCredValor','200'); await p.click('#btnAdmCred'); await p.waitForTimeout(300);
  ok(/500 QdC/.test(await p.evaluate(()=>document.getElementById('admCredList').textContent)), '2: crédito QdC no histórico');
  await persona(p,'aluno'); await p.waitForTimeout(300);
  const q1 = num(await p.evaluate(()=>document.getElementById('scoreVal').textContent));
  const d1 = num(await p.evaluate(()=>document.getElementById('dmnVal').textContent));
  ok(q1===q0+500, '2: +500 QdC na carteira: '+q0+'→'+q1);
  ok(d1===d0+200, '2: +200 Dmn na carteira: '+d0+'→'+d1);
  await p.context().close();
}

// ===== 3: bloqueio = suspensão imediata + aviso no login =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admContasList .mission-row')]; const eu=rows.find(r=>/esta conta/.test(r.textContent)); eu.querySelector('[data-bloq]').click(); });
  await p.waitForTimeout(900);
  ok(await p.evaluate(()=>!document.getElementById('loginLayer').classList.contains('off')), '3: bloqueio derruba a sessão (volta ao login)');
  ok(await p.evaluate(()=>document.getElementById('bloqLayer').classList.contains('on')), '3: pop-up de conta bloqueada aparece');
  await p.evaluate(()=>document.getElementById('btnBloqOk').click()); await p.waitForTimeout(200);
  // tentar logar de novo → pop-up, não entra
  await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(500);
  ok(await p.evaluate(()=>document.getElementById('bloqLayer').classList.contains('on')), '3: login bloqueado mostra o pop-up ("procure a administração")');
  ok(await p.evaluate(()=>!document.getElementById('loginLayer').classList.contains('off')), '3: não entra no app');
  await p.evaluate(()=>document.getElementById('btnBloqOk').click());
  // admin desbloqueia → login volta a funcionar
  await entrarAdmin(p);
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admContasList .mission-row')]; const eu=rows.find(r=>/esta conta/.test(r.textContent)); eu.querySelector('[data-bloq]').click(); }); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(300);
  await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600);
  ok(await p.evaluate(()=>document.getElementById('loginLayer').classList.contains('off')), '3: desbloqueada → login entra normalmente');
  await p.context().close();
}

// ===== 4: mensagem exclusiva → recado no "+" com contador; ler zera e marca LIDA =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await p.selectOption('#admMsgAluno','eu'); await p.fill('#admMsgTexto','Compareça à recepção para retirar seu material.');
  await p.click('#btnAdmMsg'); await p.waitForTimeout(300);
  await p.fill('#admMsgTexto','Sua turma começa segunda, 19h.'); await p.click('#btnAdmMsg'); await p.waitForTimeout(300);
  await persona(p,'aluno'); await p.waitForTimeout(400);
  const badge = await p.evaluate(()=>({ v: document.getElementById('plusBadge').textContent, on: document.getElementById('plusBadge').style.display!=='none' }));
  ok(badge.on && badge.v==='2', '4: contador de não lidas no "+" = 2 (estilo WhatsApp)');
  await p.evaluate(()=>document.getElementById('btnPlus').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('chatBadge').style.display!=='none'), '4: linha do Chat mostra o contador');
  ok(/Chat ao vivo/.test(await p.evaluate(()=>document.getElementById('plusPop').textContent)) && /EM BREVE/.test(await p.evaluate(()=>document.getElementById('plusPop').textContent)), '4: "Chat ao vivo" presente como EM BREVE');
  await p.evaluate(()=>document.getElementById('rowChat').click()); await p.waitForTimeout(900);
  ok(await p.evaluate(()=>document.getElementById('chatLayer').classList.contains('on')), '4: chat abre');
  const msgs = await p.evaluate(()=>document.getElementById('chatList').textContent);
  ok(/recepção para retirar/.test(msgs) && /começa segunda/.test(msgs), '4: recados aparecem no chat');
  ok(await p.evaluate(()=>document.getElementById('plusBadge').style.display==='none'), '4: ler os recados zera o contador');
  await p.locator('#chatLayer').screenshot({path:OUT+'/ctrl-chat.png'}).catch(()=>{});
  await p.evaluate(()=>document.getElementById('btnChatFechar').click());
  await entrarAdmin(p);
  ok(/LIDA/.test(await p.evaluate(()=>document.getElementById('admMsgList').textContent)), '4: admin vê a mensagem como LIDA');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
