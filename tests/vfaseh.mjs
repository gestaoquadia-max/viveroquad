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

// ===== 4.1: produtos físicos na retirada =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-liber'); await p.waitForTimeout(300);
  ok(/Produtos físicos · retirada na recepção/.test(await p.evaluate(()=>document.getElementById('v-adm-liber').textContent)), '4.1: bloco "Produtos físicos · retirada na recepção"');
  const ped = await p.evaluate(()=>document.getElementById('admPedidosList').textContent);
  ok(/Garrafinha Quad/.test(ped) && /Camiseta Quad/.test(ped) && /Vade Mecum/.test(ped) && !/Aulão especial/.test(ped) && !/Turma presencial/.test(ped), '4.1: pedidos são itens físicos (não atividades)');
  // confirma entrega de um físico
  /* pega uma garrafinha que ainda esteja aguardando (a do aluno da demo já nasce entregue) */
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admPedidosList .mission-row')]; const r=rows.find(x=>/Garrafinha/.test(x.textContent) && x.querySelector('[data-ped]')); r.querySelector('[data-ped]').click(); }); await p.waitForTimeout(250);
  ok(/ENTREGUE/.test(await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admPedidosList .mission-row')]; return rows.filter(x=>/Garrafinha/.test(x.textContent)).map(x=>x.textContent).join('|'); })), '4.1: confirmar entrega marca ENTREGUE');
  await p.context().close();
}

// ===== 4.2: Autorizações de acesso com sub-blocos por tipo =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-liber'); await p.waitForTimeout(300);
  const card = await p.evaluate(()=>{ const cs=[...document.querySelectorAll('#v-adm-liber .p-card')]; const c=cs.find(x=>/Autorizações de acesso/.test(x.textContent)); return c?c.textContent:''; });
  ok(/Autorizações de acesso/.test(card), '4.2: bloco renomeado para "Autorizações de acesso"');
  /* dec. 168: a categoria virou .ac-cat, com barra e contorno próprios */
  /* dec. 179: os grupos são as ATIVIDADES REAIS (eventos presenciais
     vigentes), não categorias fictícias */
  const subs = await p.evaluate(()=>[...document.querySelectorAll('#admAcessos .ac-cat')].map(k=>k.textContent.replace(/\d+ a liberar|tudo liberado/g,'').trim()));
  const reais = await p.evaluate(()=>window.__eventos().filter(e=>!e.online && e.modalidade!=='online').map(e=>e.nome));
  ok(subs.length>=1 && subs.every(sb=>reais.some(r=>sb.indexOf(r)>=0)), '4.2: todo grupo da portaria é uma atividade real ('+subs.join(' · ')+')');
  ok(!/Aniversário do Quad/.test(subs.join('|')), '4.2: a atividade fictícia (Aniversário do Quad) sumiu');
  ok(await p.evaluate(()=>!!document.querySelector('#v-adm-liber #admSpLista')), '4.2: Simulados segue com o bloco próprio (admSpLista)');
  // libera uma entrada (Aulões)
  const antes = await p.evaluate(()=>document.querySelectorAll('#admAcessos [data-ac]').length);
  await p.evaluate(()=>{ document.querySelector('#admAcessos [data-ac]').click(); }); await p.waitForTimeout(250);
  ok(/Entrada liberada/.test(await toast(p)), '4.2: liberar entrada funciona');
  ok(await p.evaluate(()=>document.querySelectorAll('#admAcessos [data-ac]').length)===antes-1, '4.2: a linha liberada some do botão (vira ENTRADA LIBERADA)');
  ok(/ENTRADA LIBERADA/.test(await p.evaluate(()=>document.getElementById('admAcessos').textContent)), '4.2: aparece o selo ENTRADA LIBERADA');
  await p.context().close();
}

// ===== 4.3: Inscritos por atividade com "ver todos" (estilo ranking) =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-liber'); await p.waitForTimeout(300);
  const opts = await p.evaluate(()=>[...document.querySelectorAll('#admAtivSel option')].map(o=>o.textContent));
  ok(opts.length>=6 && opts.some(o=>/Turma/.test(o)) && opts.some(o=>/Aulão/.test(o)) && opts.some(o=>/Evento/.test(o)) && opts.some(o=>/Simulado/.test(o)), '4.3: banco de atividades no seletor ('+opts.length+')');
  // seleciona o Aulão de véspera (73 inscritos)
  await p.evaluate(()=>{ const s=document.getElementById('admAtivSel'); s.value='a-aulao'; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.querySelectorAll('#admAtivInscritos .mission-row').length)===5, '4.3: começa mostrando 5 inscritos');
  ok(/73 inscritos/.test(await p.evaluate(()=>document.getElementById('admAtivInscritos').textContent)) && /Ver todos os 73/.test(await p.evaluate(()=>document.getElementById('ativBtn').textContent)), '4.3: cabeçalho 73 + botão "ver todos os 73"');
  await p.evaluate(()=>document.getElementById('ativBtn').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.querySelectorAll('#admAtivInscritos .mission-row').length)===73, '4.3: "ver todos" expande para 73');
  ok(/Mostrar menos/.test(await p.evaluate(()=>document.getElementById('ativBtn').textContent)), '4.3: vira "Mostrar menos"');
  await p.evaluate(()=>document.getElementById('ativBtn').click()); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.querySelectorAll('#admAtivInscritos .mission-row').length)===5, '4.3: recolhe para 5');
  // troca de atividade reinicia colapsado
  await p.evaluate(()=>{ const s=document.getElementById('admAtivSel'); s.value='a-taf'; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.querySelectorAll('#admAtivInscritos .mission-row').length)===5 && /30 inscritos/.test(await p.evaluate(()=>document.getElementById('admAtivInscritos').textContent)), '4.3: trocar de atividade recomeça colapsado (TAF · 30)');
  await p.locator('#v-adm-liber').screenshot({path:OUT+'/fh-liber.png'}).catch(()=>{});
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
