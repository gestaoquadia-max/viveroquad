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
const irEstrutura = p => p.evaluate(()=>{ document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click(); document.getElementById('btnIrEstrutura').click(); });
const irDominio = p => p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-dominio"]').click());

// ===== Seções da Estrutura =====
{ const p = await loginAluno();
  await entrarAdmin(p);
  await irEstrutura(p); await p.waitForTimeout(300);
  const labels = await p.evaluate(()=>[...document.querySelectorAll('#v-turmas .k-label')].map(k=>k.textContent.replace(/\s+/g,' ').trim()));
  ok(labels.some(l=>/Concursos/.test(l)), 'ESTR: seção Concursos & editais');
  ok(labels.some(l=>/Modalidades/.test(l)), 'ESTR: seção Modalidades');
  ok(labels.some(l=>/Turmas/.test(l)), 'ESTR: seção Turmas');
  // 6 concursos, CFO como domínio atual
  const nconc = await p.evaluate(()=>document.querySelectorAll('#admConcList .conc-row').length);
  ok(nconc===6, 'ESTR: 6 concursos listados ('+nconc+')');
  ok(/DOMÍNIO ATUAL/.test(await p.evaluate(()=>document.querySelector('#admConcList .conc-row').textContent)), 'ESTR: CFO marcado como Domínio atual');
  const conc = await p.evaluate(()=>document.getElementById('admConcList').textContent);
  ok(/Polícia Rodoviária Federal/.test(conc) && /Polícia Penal/.test(conc) && /Fronteiras/.test(conc), 'ESTR: concursos do Quad presentes (PRF, Penal, Fronteiras…)');
  await p.context().close();
}

// ===== Modalidades: teoria × questões =====
{ const p = await loginAluno();
  await entrarAdmin(p); await irEstrutura(p); await p.waitForTimeout(300);
  const mods = await p.evaluate(()=>document.getElementById('admModList').textContent);
  ok(/Turma de nivelamento/.test(mods) && /apelido: RONDESP/.test(mods) && /70% teoria/.test(mods) && /30% questões/.test(mods), 'MOD: nivelamento (apelido RONDESP) = 70/30');
  ok(/Turma regular/.test(mods) && /apelido: PATAMO/.test(mods) && /50% teoria/.test(mods) && /50% questões/.test(mods), 'MOD: regular (apelido PATAMO) = 50/50');
  ok(/Turma de questões/.test(mods) && /apelido: BOPE/.test(mods) && /20% teoria/.test(mods) && /80% questões/.test(mods), 'MOD: questões (apelido BOPE) = 20/80');
  await p.context().close();
}

// ===== Definir Domínio troca a árvore do aluno =====
{ const p = await loginAluno();
  // antes: Domínio é CFO
  await irDominio(p); await p.waitForTimeout(300);
  const antes = await p.evaluate(()=>document.getElementById('editalTree').textContent);
  ok(/Direito Penal Militar/.test(antes), 'DOM: antes, a árvore é a do CFO');
  // admin define PRF como Domínio
  await entrarAdmin(p); await irEstrutura(p); await p.waitForTimeout(300);
  await p.evaluate(()=>{ const row=[...document.querySelectorAll('#admConcList .conc-row')].find(r=>/Rodoviária Federal/.test(r.textContent)); row.querySelector('[data-dom]').click(); }); await p.waitForTimeout(300);
  ok(/Domínio do aluno agora segue/.test(await toast(p)), 'DOM: confirma troca do Domínio');
  // aluno: Domínio agora é PRF
  await persona(p,'aluno'); await p.waitForTimeout(300); await irDominio(p); await p.waitForTimeout(300);
  const dep = await p.evaluate(()=>document.getElementById('editalTree').textContent);
  ok(/Legislação de Trânsito/.test(dep) && !/Direito Penal Militar/.test(dep), 'DOM: a árvore do aluno virou a do PRF');
  ok(/Rodoviária Federal/.test(await p.evaluate(()=>document.getElementById('domConcurso').textContent)), 'DOM: cabeçalho do Domínio mostra o PRF');
  ok(/PRF/.test(await p.evaluate(()=>document.getElementById('domTreeLabel').textContent)) || /Rodoviária/.test(await p.evaluate(()=>document.getElementById('domTreeLabel').textContent)), 'DOM: rótulo da árvore atualizado');
  await p.locator('#v-dominio').screenshot({path:OUT+'/estr-dominio-prf.png'}).catch(()=>{});
  await p.context().close();
}

// ===== Situação do concurso persiste =====
{ const p = await loginAluno();
  await entrarAdmin(p); await irEstrutura(p); await p.waitForTimeout(300);
  await p.evaluate(()=>{ const row=[...document.querySelectorAll('#admConcList .conc-row')].find(r=>/CFO/.test(r.textContent)); const sel=row.querySelector('.conc-sit'); sel.value='aberto'; sel.dispatchEvent(new Event('change')); }); await p.waitForTimeout(200);
  ok(/Situação de.*Edital aberto/.test(await toast(p)), 'SIT: mudar a situação do concurso confirma');
  const v = await p.evaluate(()=>{ const row=[...document.querySelectorAll('#admConcList .conc-row')].find(r=>/CFO/.test(r.textContent)); return row.querySelector('.conc-sit').value; });
  ok(v==='aberto', 'SIT: situação persiste no select');
  await p.context().close();
}

// ===== Abrir turma (concurso × modalidade × período) =====
{ const p = await loginAluno();
  await entrarAdmin(p); await irEstrutura(p); await p.waitForTimeout(300);
  // criar turma acontece num lugar só: Painel de controle. Aqui a lista é espelho.
  ok(!await p.evaluate(()=>!!document.getElementById('btnAdmTurma')), 'TURMA: formulário duplicado de criação removido da Estrutura');
  ok(await p.evaluate(()=>!!document.getElementById('btnEstrIrCriarTurma')), 'TURMA: atalho para a criação oficial existe');
  const lista = await p.evaluate(()=>document.getElementById('admTurmaList').textContent);
  ok(/Turma PATAMO/.test(lista) && /Turma RONDESP Manhã/.test(lista), 'TURMA: a lista espelha as turmas reais da Quad Store: '+lista.slice(0,70));
  ok(/19h–20h30/.test(lista), 'TURMA: a lista mostra o horário real da turma');
  // turma com matrícula ativa não sai
  await p.evaluate(()=>{ const row=[...document.querySelectorAll('#admTurmaList .adm-bar')].find(r=>/Turma PATAMO/.test(r.textContent)); row.querySelector('[data-rm-turma]').click(); }); await p.waitForTimeout(250);
  ok(/matrícula/.test(await p.evaluate(()=>document.getElementById('toast').textContent)), 'TURMA: ✕ barra a remoção de turma com matrícula ativa');
  // turma sem matrícula sai normalmente
  const n0 = await p.evaluate(()=>document.querySelectorAll('#admTurmaList .adm-bar').length);
  await p.evaluate(()=>{ const row=[...document.querySelectorAll('#admTurmaList .adm-bar')].find(r=>/Turma BOPE Manhã/.test(r.textContent)); row.querySelector('[data-rm-turma]').click(); }); await p.waitForTimeout(250);
  const n1 = await p.evaluate(()=>document.querySelectorAll('#admTurmaList .adm-bar').length);
  ok(n1===n0-1 && !/Turma BOPE Manhã/.test(await p.evaluate(()=>document.getElementById('admTurmaList').textContent)), 'TURMA: remoção pelo ✕ funciona em turma livre');
  await p.locator('#v-turmas').screenshot({path:OUT+'/estr-admin.png'}).catch(()=>{});
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
