const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
import fs from 'node:fs';
const { chromium } = pw;
const OUT=new URL('./_out', import.meta.url).pathname;
fs.writeFileSync(OUT+'/aud.pdf','%PDF-1.4 audit');
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const c = await b.newContext({viewport:{width:430,height:940}});
const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ const errs=[]; p.on('pageerror',e=>errs.push(e.message));
let pass=0, fail=0; const ok=(v,t)=>{ if(v){pass++;console.log('  ok  '+t);} else {fail++;console.log('  XX  '+t);} };
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600);
const persona = q => p.evaluate(x=>document.querySelector('.persona-btn[data-persona="'+x+'"]').click(), q);
const navAdm = v => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const txt = id => p.evaluate(x=>{const e=document.getElementById(x);return e?e.textContent.replace(/\s+/g,' ').trim():'(inexistente)';},id);

console.log('\n== 1) QUIZ POR TURMA ==');
await persona('professor'); await p.waitForTimeout(400);
await p.fill('#profEmail','ferraz@quadconcursos.com.br'); await p.fill('#profSenha','quad1234');
await p.click('#btnProfEntrar'); await p.waitForTimeout(400);
await p.evaluate(()=>document.querySelector('#navProfessor .nav-btn[data-view="v-sala"]').click()); await p.waitForTimeout(300);
const salas = await p.evaluate(()=>[...document.querySelectorAll('#profTurmasList [data-sala]')].map(b=>b.dataset.sala));
console.log('  salas do prof:', JSON.stringify(salas));
ok(salas.length>=2,'1.0 professor tem ao menos 2 turmas para o teste');
const abrir = s => p.evaluate(x=>document.querySelector('#profTurmasList [data-sala="'+x+'"]').click(), s);
// quiz na sala A
await abrir(salas[0]); await p.waitForTimeout(250);
await p.setInputFiles('#qzPdf', OUT+'/aud.pdf'); await p.selectOption('#qzTipo','ce'); await p.fill('#qzNq','3'); await p.fill('#qzMin','5');
await p.click('#btnQuizCriar'); await p.waitForTimeout(200);
await p.click('#btnQuizAtivar'); await p.waitForTimeout(300);
ok(/Quiz ATIVO/.test(await txt('qzStatus')),'1.1 quiz ativado na sala A');
// quiz na sala B
await p.click('#btnSalaVoltar'); await p.waitForTimeout(200);
await abrir(salas[1]); await p.waitForTimeout(250);
ok(!await p.evaluate(()=>document.getElementById('btnQuizCriar').disabled),'1.2 sala B permite criar quiz mesmo com a A ativa');
await p.setInputFiles('#qzPdf', OUT+'/aud.pdf'); await p.selectOption('#qzTipo','multipla'); await p.fill('#qzNq','2'); await p.fill('#qzMin','4');
await p.click('#btnQuizCriar'); await p.waitForTimeout(250);
ok(/Quiz criado/.test(await txt('qzStatus')),'1.3 quiz criado na sala B');
// volta para A: continua ativo?
await p.click('#btnSalaVoltar'); await p.waitForTimeout(200);
await abrir(salas[0]); await p.waitForTimeout(300);
const stA = await txt('qzStatus');
ok(/Quiz ATIVO/.test(stA),'1.4 sala A CONTINUA com o quiz ativo (era o bug)');
ok(!await p.evaluate(()=>document.getElementById('btnQuizEncerrar').disabled),'1.5 botão Encerrar da sala A segue habilitado');
const stB = await (async()=>{ await p.click('#btnSalaVoltar'); await p.waitForTimeout(150); await abrir(salas[1]); await p.waitForTimeout(250); return txt('qzStatus'); })();
ok(/Quiz criado/.test(stB) && /múltipla escolha/.test(stB),'1.6 sala B mantém o seu próprio quiz (2 questões, múltipla)');
const nq = await p.evaluate(()=>Object.keys(window.__quizzes()).length);
ok(nq===2,'1.7 dois quizzes coexistem no sistema ('+nq+')');
// relatório antes de qualquer resposta
await p.click('#btnSalaVoltar'); await p.waitForTimeout(150); await abrir(salas[0]); await p.waitForTimeout(400);
const relIni = await txt('qzRelList');
ok(/Aguardando as respostas/.test(relIni) || !/%/.test(relIni),'1.8 relatório NÃO inventa % antes das respostas');

console.log('\n== 2/3/4) ADMIN ==');
await persona('admin'); await p.waitForTimeout(400);
const gateOn = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (gateOn) { await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
// cronograma: fantasma sumiu
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
const cr0 = await p.evaluate(()=>[...document.querySelectorAll('#admCrTurma option')].map(o=>o.textContent));
console.log('  cronograma:', JSON.stringify(cr0));
ok(!cr0.some(t=>/CORE/.test(t)),'3.1 turma-fantasma CORE NOITE removida');
ok(cr0.some(t=>/Turma BOPE · noite/.test(t)),'3.2 BOPE aparece pelo nome, com o turno (dec. 163)');
ok(cr0.filter(t=>/manhã/.test(t)).length>=2,'3.3 turmas de manhã (que existem na loja) entraram no cronograma');
// cria turma no controle
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.selectOption('#admCtTipo','BOPE'); await p.fill('#admCtApelido','Auditoria');
await p.selectOption('#admCtConc','pcba');
await p.fill('#admCtIni','2026-09-01'); await p.fill('#admCtFim','2027-03-01');
await p.fill('#admCtH1i','14:00'); await p.fill('#admCtH1f','15:30'); await p.fill('#admCtH2f','17:00');
await p.fill('#admCtPrecoDmn','900'); await p.fill('#admCtPrecoQdc','1000'); await p.fill('#admCtVagas','40'); await p.fill('#admCtVagasQdc','5');
await p.selectOption('#admCtSala','Sala 3');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(500);
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
const cr1 = await p.evaluate(()=>[...document.querySelectorAll('#admCrTurma option')].map(o=>o.textContent));
ok(cr1.some(t=>/Turma Auditoria · tarde/.test(t)),'3.4 turma criada no Controle ENTRA no cronograma com nome próprio');
// preenche a grade da turma nova
await p.evaluate(()=>{ const s=document.getElementById('admCrTurma');
  const o=[...s.options].find(x=>/Turma Auditoria/.test(x.textContent)); if(o) s.value=o.value;
  s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(250);
const lanc35 = await p.evaluate(()=>{
  const sm=document.getElementById('admCrMat'), sp=document.getElementById('admCrProf');
  for (const o of sm.options){ sm.value=o.value; sm.dispatchEvent(new Event('change'));
    if (sp.value) return {mat:sm.value, prof:sp.value}; }
  return null;
});
await p.click('#btnAdmCrono'); await p.waitForTimeout(300);
ok(/Grade atualizada/.test(await txt('toast')) && /Turma Auditoria/.test(await txt("toast")),'3.5 dá para lançar aula na grade da turma nova ('+(lanc35?lanc35.mat+' · '+lanc35.prof:'—')+')');
// estrutura: form duplicado sumiu
await p.evaluate(()=>document.getElementById('btnIrEstrutura').click()); await p.waitForTimeout(400);
ok(!await p.evaluate(()=>!!document.getElementById('btnAdmTurma')),'2.1 formulário duplicado "Abrir turma" removido da Estrutura');
ok(await p.evaluate(()=>!!document.getElementById('btnEstrIrCriarTurma')),'2.2 atalho para o lugar certo existe');
const estr = await txt('admTurmaList');
ok(/Auditoria/.test(estr),'2.3 Estrutura mostra a turma criada no Controle');
ok(/Turma RONDESP Manhã/.test(estr),'2.4 Estrutura lista as MESMAS turmas da loja (fonte única)');
// trava de remoção
await p.evaluate(()=>{ const r=[...document.querySelectorAll('#admTurmaList .adm-bar')].find(x=>/Turma PATAMO/.test(x.textContent)); r.querySelector('[data-rm-turma]').click(); }); await p.waitForTimeout(300);
ok(/matrícula/.test(await txt('toast')),'2.5 turma com matrícula ativa não pode ser removida');
// relatórios
await navAdm('v-adm-alunos'); await p.waitForTimeout(400);
const relT = await p.evaluate(()=>[...document.querySelectorAll('#relTurmaSel option')].map(o=>o.textContent));
console.log('  relatórios/turmas:', JSON.stringify(relT));
ok(relT.some(t=>/Auditoria/.test(t)),'4.1 Relatórios enxergam a turma criada');
ok(relT.length>=6,'4.2 Relatórios listam todas as turmas vivas ('+relT.length+')');
// liberações
await navAdm('v-adm-liber'); await p.waitForTimeout(400);
const at = await p.evaluate(()=>[...document.querySelectorAll('#admAtivSel option')].map(o=>o.textContent));
console.log('  liberações/atividades:', JSON.stringify(at));
ok(at.some(t=>/Auditoria/.test(t)),'4.3 Liberações enxergam a turma criada');
ok(at.some(t=>/^Evento ·/.test(t)),'4.4 eventos reais entram no banco de inscritos');
await p.evaluate(()=>{ const s=document.getElementById('admAtivSel'); const o=[...s.options].find(x=>/Auditoria/.test(x.textContent)); s.value=o.value; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(300);
ok(/sem inscritos|Ninguém inscrito/.test(await txt('admAtivInscritos')),'4.5 turma nova mostra "sem inscritos" em vez de número inventado');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
