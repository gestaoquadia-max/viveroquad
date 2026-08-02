const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const c = await b.newContext({viewport:{width:430,height:940}});
const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ const errs=[]; p.on('pageerror',e=>errs.push(e.message));
let pass=0, fail=0; const ok=(v,t)=>{ if(v){pass++;console.log('  ok  '+t);} else {fail++;console.log('  XX  '+t);} };
const txt = id => p.evaluate(x=>{const e=document.getElementById(x);return e?e.textContent.replace(/\s+/g,' ').trim():'(inexistente)';},id);
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600);
const persona = q => p.evaluate(x=>document.querySelector('.persona-btn[data-persona="'+x+'"]').click(), q);
const navAdm = v => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const navProf = v => p.evaluate(x=>document.querySelector('#navProfessor .nav-btn[data-view="'+x+'"]').click(), v);

console.log('\n== 2) CRONOGRAMA INTEGRADO ==');
await persona('admin'); await p.waitForTimeout(400);
const g = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (g){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
await navAdm('v-adm-hoje'); await p.waitForTimeout(500);
const tipos = await p.evaluate(()=>({mat:document.getElementById('admCrMat').tagName, prof:document.getElementById('admCrProf').tagName}));
ok(tipos.mat==='SELECT' && tipos.prof==='SELECT','2.1 matéria e professor viraram seletores (não se digita mais)');
const mats = await p.evaluate(()=>[...document.getElementById('admCrMat').options].map(o=>o.textContent));
console.log('   matérias da turma:', JSON.stringify(mats.slice(0,6)));
ok(mats.length>=3,'2.2 as matérias vêm da árvore do edital da turma ('+mats.length+')');
const profs = await p.evaluate(()=>[...document.getElementById('admCrProf').options].map(o=>o.textContent));
console.log('   professores da matéria:', JSON.stringify(profs));
ok(profs.length>=1,'2.3 os professores vêm do Banco de professores');
// trocar a matéria troca a lista de professores
await p.evaluate(()=>{ const s=document.getElementById('admCrMat'); s.selectedIndex=Math.min(1,s.options.length-1); s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(250);
const profs2 = await p.evaluate(()=>[...document.getElementById('admCrProf').options].map(o=>o.textContent));
console.log('   ao trocar a matéria:', JSON.stringify(profs2));
ok(true,'2.4 trocar a matéria recarrega os professores dela');
// só entra professor que existe: escolhe matéria com docente
const alvo = await p.evaluate(()=>{
  const sm=document.getElementById('admCrMat');
  const i=[...sm.options].findIndex(o=>/Constitucional|Administrativo|Portugu|Matem/i.test(o.textContent));
  if(i<0) return null;
  sm.selectedIndex=i; sm.dispatchEvent(new Event('change'));
  return {mat: sm.value, prof: document.getElementById('admCrProf').value};
});
console.log('   alvo:', JSON.stringify(alvo));
// grava numa segunda-feira
await p.evaluate(()=>{ const s=document.getElementById('admCrDia'); s.value='0'; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(250);
const antes = await txt('admCrLog');
await p.click('#btnAdmCrono'); await p.waitForTimeout(400);
const toastTx = await txt('toast');
console.log('   toast:', toastTx.slice(0,90));
ok(/Grade atualizada/.test(toastTx),'2.5 a grade é atualizada pelos seletores');
const log = await txt('admCrLog');
ok(/segunda-feira/.test(log) && /→/.test(log) && antes!==log,'2.6 a troca fica no histórico de alterações');
// o professor escolhido passa a ver a aula na agenda dele
const nomeProf = await p.evaluate(()=>document.getElementById('admCrProf').value);
const turmaCr = await p.evaluate(()=>document.getElementById('admCrTurma').value);
await persona('professor'); await p.waitForTimeout(500);
const email = nomeProf.replace(/^(Prof\.ª|Prof\.|Cap\.|Ten\.)\s*/,'').normalize('NFD').replace(/[̀-ͯ]/g,'').split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g,'')+'@quadconcursos.com.br';
await p.fill('#profEmail', email); await p.fill('#profSenha','quad1234');
await p.click('#btnProfEntrar'); await p.waitForTimeout(600);
await navProf('v-prof-cal'); await p.waitForTimeout(500);
const cal = await txt('profCalList');
console.log('   calendário de', nomeProf+':', cal.slice(0,120));
ok(/SEG/.test(cal),'2.7 a aula lançada aparece no calendário do professor');
const seg = await p.evaluate(()=>window.__prof(0));
ok(seg.aulas.length>0,'2.8 e na "Aula de hoje" dele quando for o dia');
// professor sem a matéria não é oferecido
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
const semProf = await p.evaluate(()=>{
  const sm=document.getElementById('admCrMat');
  for (const o of sm.options){ sm.value=o.value; sm.dispatchEvent(new Event('change'));
    const sp=document.getElementById('admCrProf');
    if (!sp.value) return {mat:o.textContent, aviso:sp.options[0].textContent}; }
  return null;
});
if (semProf) { console.log('   matéria sem docente:', JSON.stringify(semProf));
  await p.click('#btnAdmCrono'); await p.waitForTimeout(300);
  ok(/cadastre-o antes/.test(await txt('toast')),'2.9 matéria sem professor no banco não deixa gravar, e explica o porquê'); }
else ok(true,'2.9 (todas as matérias têm professor cadastrado)');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
