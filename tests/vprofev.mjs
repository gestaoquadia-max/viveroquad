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
const nav = v => p.evaluate(x=>document.querySelector('#navAluno .nav-btn[data-view="'+x+'"]').click(), v);

console.log('\n== PROFESSOR NOS EVENTOS ==');
// aluno vê quem dá o evento (seeds)
const strip = await txt('evStrip');
ok(/com Danilo Moura/.test(strip),'1 aluno vê "com Danilo Moura" no NAC');
ok(/Cap\. Silva e Prof\.ª Ritha Galvão/.test(strip),'2 evento com dois professores lista os dois');
// admin: chips vindos do banco de professores
await persona('admin'); await p.waitForTimeout(400);
const gate = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (gate){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
const chips = await p.evaluate(()=>[...document.querySelectorAll('#admEvProfs [data-ev-prof]')].map(b=>b.dataset.evProf));
console.log('   chips:', JSON.stringify(chips));
ok(chips.length>=5 && chips.includes('Cap. Silva'),'3 chips de professor vêm do Banco de professores ('+chips.length+')');
ok(await p.evaluate(()=>[...document.querySelectorAll('#admEvProfs .turno-chip')].every(b=>!b.classList.contains('on'))),'4 os chips começam desmarcados');
// lista do painel mostra quem está no evento
ok(/com Danilo Moura/.test(await txt('admEvList')),'5 painel de eventos mostra os professores');
// cria evento com professor
await p.fill('#admEvNovoNome','Mesa redonda de Direito Penal');
await p.fill('#admEvNovoResumo','Debate com o corpo docente');
await p.fill('#admEvNovoData','2026-12-10');
await p.evaluate(()=>{ document.querySelector('#admEvProfs [data-ev-prof="Cap. Silva"]').click(); document.querySelector('#admEvProfs [data-ev-prof="Prof. Nascimento"]').click(); });
await p.selectOption('#admEvSala','Sala 4');
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
const lista = await txt('admEvList');
ok(/Mesa redonda.*com Cap\. Silva e Prof\. Nascimento/.test(lista),'6 evento criado guarda os professores marcados');
ok(await p.evaluate(()=>[...document.querySelectorAll('#admEvProfs .turno-chip')].every(b=>!b.classList.contains('on'))),'7 os chips limpam depois de criar');
// edição prefila os chips
await p.evaluate(()=>{ const r=[...document.querySelectorAll('#admEvList .adm-bar')].find(x=>/Mesa redonda/.test(x.textContent)); r.querySelector('[data-ed-ev]').click(); }); await p.waitForTimeout(400);
const marcados = await p.evaluate(()=>[...document.querySelectorAll('#admEvProfs .turno-chip.on')].map(b=>b.dataset.evProf));
ok(marcados.length===2 && marcados.includes('Cap. Silva'),'8 editar o evento traz os professores já marcados');
await p.evaluate(()=>{ document.querySelector('#admEvProfs [data-ev-prof="Prof. Nascimento"]').click(); });
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
ok(/Mesa redonda.*com Cap\. Silva/.test(await txt('admEvList')) && !/Mesa redonda.*Nascimento/.test(await txt('admEvList')),'9 desmarcar na edição tira o professor do evento');
// aluno vê o evento novo com o professor
await persona('aluno'); await p.waitForTimeout(500);
ok(/Mesa redonda/.test(await txt('evStrip')) && /com Cap\. Silva/.test(await txt('evStrip')),'10 o evento novo chega ao aluno com o nome do professor');
// função de consulta usada pelas telas do professor
const doSilva = await p.evaluate(()=>window.__evProf ? window.__evProf('Cap. Silva').map(e=>e.nome) : null);
console.log('   eventos do Cap. Silva:', JSON.stringify(doSilva));
ok(doSilva && doSilva.length>=2,'11 dá para consultar os eventos de um professor');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
