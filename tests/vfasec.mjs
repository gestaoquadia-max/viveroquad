const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
import fs from 'node:fs';
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
fs.writeFileSync(OUT + '/quiz-poderes.pdf', '%PDF-1.4 quiz de poderes administrativos');
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const errs = [], fails = [];
const ok = (c, m) => { console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
async function ctx(){ const c = await b.newContext({ viewport:{width:430,height:940}, deviceScaleFactor:2 }); const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ p.on('pageerror', e=>errs.push(e.message)); await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400); return p; }
const loginAluno = async () => { const p = await ctx(); await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');}); await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600); return p; };
const persona = (p,q) => p.evaluate(pp=>{ document.querySelector('.persona-btn[data-persona="'+pp+'"]').click(); }, q);
const toast = p => p.evaluate(()=>document.getElementById('toast').textContent);
async function entrarProf(p, nome){ await persona(p,'professor'); await p.waitForTimeout(400);
  const gate = await p.evaluate(()=>document.getElementById('profGate').classList.contains('on'));
  if (gate){ await p.fill('#profEmail', nome ? emailProf(nome) : 'silva@quadconcursos.com.br'); await p.fill('#profSenha','quad1234');
    await p.click('#btnProfEntrar'); await p.waitForTimeout(400); }
  await irSala(p); }
const irSala = p => p.evaluate(()=>document.querySelector('#navProfessor .nav-btn[data-view="v-sala"]').click());
const emailProf = n => n.replace(/^(Prof\.ª|Prof\.|Cap\.|Ten\.)\s*/,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g,'')+'@quadconcursos.com.br';
const salaTag = p => p.evaluate(()=>document.getElementById('salaTag').textContent);

// ===== 1: gate do professor + turmas automáticas =====
{ const p = await loginAluno();
  await persona(p,'professor'); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('profGate').classList.contains('on')), '1: gate do professor abre (cadastro para ingresso)');
  await p.fill('#profEmail','silva@quadconcursos.com.br'); await p.fill('#profSenha','ERRADA'); await p.click('#btnProfEntrar'); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.getElementById('profGate').classList.contains('on')), '1: senha errada não libera');
  await p.fill('#profEmail','ninguem@quadconcursos.com.br'); await p.fill('#profSenha','quad1234'); await p.click('#btnProfEntrar'); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.getElementById('profGate').classList.contains('on')) && /não encontrado/i.test(await toast(p)), '1: e-mail fora do corpo docente não entra');
  await p.fill('#profEmail','silva@quadconcursos.com.br'); await p.fill('#profSenha','quad1234'); await p.click('#btnProfEntrar'); await p.waitForTimeout(400);
  ok(!await p.evaluate(()=>document.getElementById('profGate').classList.contains('on')), '1: e-mail + senha corretos liberam');
  ok(await p.evaluate(()=>document.getElementById('v-prof-painel').classList.contains('on')), '1: entra no Painel de controle do professor');
  await irSala(p); await p.waitForTimeout(300);
  ok((await p.evaluate(()=>document.getElementById('profNome').textContent))==='Cap. Silva', '1: painel identifica o professor');
  const turmas = await p.evaluate(()=>document.getElementById('profTurmasList').textContent);
  ok(/Turma PATAMO/.test(turmas) && /você:/.test(turmas), '1: turmas do professor listadas automaticamente, com as matérias dele');
  const nRows = await p.evaluate(()=>document.querySelectorAll('#profTurmasList [data-sala]').length);
  ok(nRows>=2, '1: professor inserido em mais de uma turma ('+nRows+')');
  await p.context().close();
}

// ===== 2: criar quiz (PDF obrigatório) → aluno vê "AULA COM QUIZ" =====
{ const p = await loginAluno(); await entrarProf(p,'Cap. Silva');
  await p.evaluate(()=>{ [...document.querySelectorAll('#profTurmasList [data-sala]')].find(x=>x.dataset.sala==='patamo-n').click(); }); await p.waitForTimeout(300);
  ok(/Turma PATAMO/.test(await p.evaluate(()=>document.getElementById('salaHead').textContent)), '2: sala da PATAMO Noite aberta');
  await p.selectOption('#qzTipo','ce'); await p.fill('#qzNq','3'); await p.fill('#qzMin','10');
  await p.click('#btnQuizCriar'); await p.waitForTimeout(250);
  ok(/Anexe o PDF/.test(await toast(p)), '2: sem PDF é barrado');
  await p.setInputFiles('#qzPdf', OUT+'/quiz-poderes.pdf');
  await p.click('#btnQuizCriar'); await p.waitForTimeout(300);
  ok(/Quiz criado/.test(await p.evaluate(()=>document.getElementById('qzStatus').textContent)) && /certo\/errado/.test(await p.evaluate(()=>document.getElementById('qzStatus').textContent)), '2: quiz criado por PDF (certo/errado, 3 questões, 10 min)');
  ok(!await p.evaluate(()=>document.getElementById('btnQuizAtivar').disabled), '2: botão Ativar liberado');
  await persona(p,'aluno'); await p.waitForTimeout(400);
  ok((await salaTag(p))==='AULA COM QUIZ', '2: aluno vê "AULA COM QUIZ" no lugar de "sem quiz aberto"');
  ok(await p.evaluate(()=>document.getElementById('btnEntrarQuiz').style.display==='none'), '2: botão Quiz ainda não aparece (falta ativar)');
  await p.context().close();
}

// ===== 3: ativar → botão Quiz; aluno responde com cronômetro; sem premiação =====
{ const p = await loginAluno(); await entrarProf(p,'Cap. Silva');
  await p.evaluate(()=>{ [...document.querySelectorAll('#profTurmasList [data-sala]')].find(x=>x.dataset.sala==='patamo-n').click(); }); await p.waitForTimeout(300);
  await p.setInputFiles('#qzPdf', OUT+'/quiz-poderes.pdf');
  await p.selectOption('#qzTipo','multipla'); await p.fill('#qzNq','2'); await p.fill('#qzMin','5');
  await p.click('#btnQuizCriar'); await p.waitForTimeout(250);
  await p.click('#btnQuizAtivar'); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('qzRelCard').style.display!=='none'), '3: relatório ao vivo abre com a ativação');
  await persona(p,'aluno'); await p.waitForTimeout(400);
  ok((await salaTag(p))==='AULA COM QUIZ ATIVO', '3: selo vira "AULA COM QUIZ ATIVO"');
  const btn = await p.evaluate(()=>({ vis: document.getElementById('btnEntrarQuiz').style.display!=='none', rot: document.getElementById('btnEntrarQuiz').textContent }));
  ok(btn.vis && btn.rot==='Quiz', '3: botão "Quiz" aparece na Aula de hoje');
  const q0 = await p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
  const x0 = await p.evaluate(()=>document.getElementById('xpNum').textContent.split('/')[0].trim());
  await p.evaluate(()=>document.getElementById('btnEntrarQuiz').click()); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('qaLayer').classList.contains('on')), '3: quiz da aula abre (estrutura do simulado)');
  ok(/^0[45]:/.test(await p.evaluate(()=>document.getElementById('qaTimer').textContent)), '3: cronômetro de 5 min rodando');
  ok(await p.evaluate(()=>document.querySelectorAll('#qaBody .q-alt').length)===4, '3: múltipla escolha com 4 alternativas, sem gabarito');
  for (let k=0;k<2;k++){ await p.evaluate(()=>{ document.querySelectorAll('#qaBody .q-alt')[1].click(); }); await p.waitForTimeout(150); await p.evaluate(()=>document.getElementById('btnQaNext').click()); await p.waitForTimeout(300); }
  ok(!await p.evaluate(()=>document.getElementById('qaLayer').classList.contains('on')), '3: enviar fecha o quiz');
  ok(/enviadas ao professor/.test(await toast(p)), '3: respostas vão ao professor, sem gabarito');
  ok((await salaTag(p))==='QUIZ RESPONDIDO', '3: selo vira "QUIZ RESPONDIDO"');
  const q1 = await p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
  const x1 = await p.evaluate(()=>document.getElementById('xpNum').textContent.split('/')[0].trim());
  ok(q0===q1 && x0===x1, '3: SEM premiação — QdC e score intactos ('+q0+'/'+x0+')');
  // professor: relatório com o aluno contabilizado
  await persona(p,'professor'); await p.waitForTimeout(400);
  const rel = await p.evaluate(()=>document.getElementById('qzRelList').textContent);
  ok(/Q1/.test(rel) && /Q2/.test(rel) && /%/.test(rel), '3: acertos por questão no relatório');
  await p.evaluate(()=>{ document.querySelector('[data-qrel="0"]').click(); }); await p.waitForTimeout(200);
  const det = await p.evaluate(()=>document.querySelector('[data-qrel-det="0"]').textContent);
  ok(/Letra A/.test(det) && /Letra D/.test(det) && /CORRETA/.test(det), '3: relatório da questão com gráfico de alternativas (A–D + correta)');
  const soma = await p.evaluate(()=>[...document.querySelectorAll('[data-qrel-det="0"] .pct')].map(x=>parseInt(x.textContent,10)).reduce((a,b)=>a+b,0));
  ok(soma>=98 && soma<=102, '3: distribuição de alternativas soma ~100% ('+soma+')');
  await p.evaluate(()=>document.getElementById('btnQuizEncerrar').click()); await p.waitForTimeout(300);
  ok(/encerrado/.test(await p.evaluate(()=>document.getElementById('qzStatus').textContent)), '3: professor encerra o quiz');
  await persona(p,'aluno'); await p.waitForTimeout(300);
  ok((await salaTag(p))==='SEM QUIZ ABERTO', '3: encerrado, o selo do aluno volta ao normal');
  await p.context().close();
}

// ===== 4: quiz de outra turma NÃO aparece para o aluno; feedback EM BREVE =====
{ const p = await loginAluno(); await entrarProf(p,'Cap. Silva');
  const outra = await p.evaluate(()=>{ const bts=[...document.querySelectorAll('#profTurmasList [data-sala]')]; const alt=bts.find(x=>x.dataset.sala!=='patamo-n'); if(alt){ alt.click(); return alt.dataset.sala; } return null; });
  await p.waitForTimeout(300);
  if (outra) {
    await p.setInputFiles('#qzPdf', OUT+'/quiz-poderes.pdf');
    await p.click('#btnQuizCriar'); await p.waitForTimeout(250);
    await persona(p,'aluno'); await p.waitForTimeout(400);
    ok((await salaTag(p))==='SEM QUIZ ABERTO', '4: quiz de OUTRA turma não muda a Aula de hoje do aluno ('+outra+')');
    await persona(p,'professor'); await p.waitForTimeout(300); await irSala(p); await p.waitForTimeout(200);
  }
  ok(/Feedback dos alunos/.test(await p.evaluate(()=>document.getElementById('v-sala').textContent)) && /EM BREVE/.test(await p.evaluate(()=>document.getElementById('qzRelCard').textContent||document.getElementById('v-sala').textContent)), '4: área de feedback dos alunos marcada EM BREVE');
  await p.evaluate(()=>document.getElementById('btnSalaVoltar').click()); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.getElementById('profTurmasCard').style.display!=='none'), '4: voltar retorna às turmas do professor');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
