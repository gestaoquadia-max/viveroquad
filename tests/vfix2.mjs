const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const c = await b.newContext({viewport:{width:430,height:940}});
const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ const errs=[]; p.on('pageerror',e=>errs.push(e.message));
let pass=0, fail=0; const ok=(v,t)=>{ if(v){pass++;console.log('  ok  '+t);} else {fail++;console.log('  XX  '+t);} };
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600);
const nav = v => p.evaluate(x=>document.querySelector('#navAluno .nav-btn[data-view="'+x+'"]').click(), v);
const persona = q => p.evaluate(x=>document.querySelector('.persona-btn[data-persona="'+x+'"]').click(), q);
const navAdm = v => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const txt = id => p.evaluate(x=>{const e=document.getElementById(x);return e?e.textContent.replace(/\s+/g,' ').trim():'(inexistente)';},id);

console.log('\n== 5) MINHAS TURMAS ==');
await p.evaluate(()=>document.querySelector('[data-goto="v-perfil"]').click()); await p.waitForTimeout(500);
const mt0 = await txt('minhasTurmasList');
ok(/Turma PATAMO/.test(mt0) && /EM USO/.test(mt0),'5.1 a turma em uso aparece marcada no Perfil: '+mt0.slice(0,60));
const rk0 = await txt('rankSalaHead');
ok(!/42 alunos/.test(rk0),'5.2 ranking da sala não é mais fixo em 42 ("'+rk0+'")');
// compra 2ª turma
await nav('v-loja'); await p.waitForTimeout(600);
await p.fill('#giftCode','QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(300);
await p.evaluate(()=>document.querySelector('[data-turma="rondesp-m"]').click()); await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('btnTuDmn').click()); await p.waitForTimeout(600);
/* dec. 147: a 2ª matrícula pergunta por qual turma o app fala — segue na PATAMO */
await p.evaluate(()=>{ const b=document.querySelector('#trocaOpts [data-abrir="patamo-n"]'); if(b) b.click(); }); await p.waitForTimeout(500);
await p.evaluate(()=>document.querySelector('[data-goto="v-perfil"]').click()); await p.waitForTimeout(500);
const mt1 = await txt('minhasTurmasList');
console.log('   ', mt1.slice(0,150));
ok(/RONDESP Manhã/.test(mt1),'5.3 a 2ª matrícula APARECE para o aluno (era o bug)');
ok(/EM USO/.test(mt1) && /Usar esta/.test(mt1),'5.4 uma turma EM USO e a outra com "Usar esta" (dec. 146)');

console.log('\n== 8) TEXTOS ==');
await p.evaluate(()=>document.getElementById('btnPlus').click()); await p.waitForTimeout(400);
const plus = await txt('plusPop');
/* a loja saiu do "+" (dec. 111): o nome e as duas moedas agora se provam
   no topo da própria Quad Store, e o "+" só não pode falar "Intendência" */
ok(!/Intendência/.test(plus) && !/Quad Store/.test(plus),'8.1 menu "+" sem Intendência e sem a linha da loja');
const lojaTxt = await p.evaluate(()=>document.getElementById('v-loja').textContent.replace(/\s+/g,' '));
ok(/Quad Store/.test(lojaTxt) && !/Intendência/.test(lojaTxt),'8.2 a loja se chama Quad Store, não Intendência');
ok(/Quad Coins/.test(lojaTxt) && /Diamantes/.test(lojaTxt),'8.2b topo da loja cita as duas moedas');
await p.evaluate(()=>document.getElementById('plusPop').classList.remove('on'));
const perfil = await p.evaluate(()=>document.getElementById('v-perfil').textContent.replace(/\s+/g,' '));
/* dec. 142: o card da Quad Store saiu do Quadrômetro — ele só repetia a aba da loja */
ok(!/onde o esforço vira avanço/.test(perfil) && !/exclusivamente em Coins/.test(perfil),'8.3 Quadrômetro sem o card da loja e sem "exclusivamente em Coins"');
ok(await p.evaluate(()=>document.getElementById('giftCode').placeholder.includes('QG')),'8.4 placeholder do gift card usa o formato real dos lotes');

console.log('\n== PROFESSOR ==');
await persona('professor'); await p.waitForTimeout(500);
const campos = await p.evaluate(()=>({sel:!!document.getElementById('profSel'), chave:!!document.getElementById('profChave'), senha:!!document.getElementById('profSenha')}));
ok(!campos.sel && !campos.chave,'P.1 login sem seletor de professor e sem chave de liberação');
ok(campos.senha,'P.2 login é e-mail + senha, como qualquer conta');
await p.fill('#profEmail','qualquer@outro.com'); await p.fill('#profSenha','quad1234');
await p.click('#btnProfEntrar'); await p.waitForTimeout(300);
ok(await p.evaluate(()=>document.getElementById('profGate').classList.contains('on')),'P.3 e-mail fora do corpo docente NÃO entra');
ok(/não encontrado/i.test(await txt('toast')),'P.4 a mensagem explica que o e-mail não está no corpo docente');
await p.fill('#profEmail','silva@quadconcursos.com.br'); await p.fill('#profSenha','errada');
await p.click('#btnProfEntrar'); await p.waitForTimeout(300);
ok(/Senha incorreta/.test(await txt('toast')),'P.5 senha errada é recusada');
await p.fill('#profSenha','quad1234'); await p.click('#btnProfEntrar'); await p.waitForTimeout(500);
ok(!await p.evaluate(()=>document.getElementById('profGate').classList.contains('on')),'P.6 e-mail + senha corretos entram');
ok((await p.evaluate(()=>document.getElementById('profNome').textContent))==='Cap. Silva','P.7 o e-mail já identifica o professor — abre o perfil dele');
const turmasSilva = await p.evaluate(()=>document.getElementById('profTurmasList').textContent.replace(/\s+/g,' '));
console.log('   turmas Cap. Silva:', turmasSilva.slice(0,120));
ok(/Direito Penal/.test(turmasSilva) && !/Matemática/.test(turmasSilva),'P.8 só aparecem as matérias que ele realmente dá');

console.log('\n== 7) PREÇOS DAS TURMAS ==');
await persona('admin'); await p.waitForTimeout(400);
const gateOn = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (gateOn) { await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
await navAdm('v-adm-loja'); await p.waitForTimeout(500);
const nT = await p.evaluate(()=>document.querySelectorAll('#admPrecoTurmas [data-tp-dmn]').length);
ok(nT>=5,'7.1 todas as turmas no editor de preços ('+nT+')');
// abre uma turma no turno da TARDE (livre para este aluno) para ver o preço na vitrine
await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await p.selectOption('#admCtTipo','BOPE'); await p.fill('#admCtApelido','Preco');
await p.selectOption('#admCtConc','pcba');
await p.fill('#admCtIni','2026-09-01'); await p.fill('#admCtFim','2027-03-01');
await p.fill('#admCtH1i','14:00'); await p.fill('#admCtH1f','15:30'); await p.fill('#admCtH2f','17:00');
await p.fill('#admCtPrecoDmn','900'); await p.fill('#admCtPrecoQdc','1000'); await p.fill('#admCtVagas','40'); await p.fill('#admCtVagasQdc','5');
await p.selectOption('#admCtSala','Sala 3');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(500);
await navAdm('v-adm-loja'); await p.waitForTimeout(500);
const idNova = await p.evaluate(()=>{ const i=[...document.querySelectorAll('#admPrecoTurmas [data-tp-qdc]')].find(x=>x.closest('.adm-bar').textContent.includes('Preco')); return i?i.dataset.tpQdc:null; });
ok(!!idNova,'7.2 turma nova aparece no editor de preços');
await p.evaluate(x=>{ document.querySelector('[data-tp-qdc="'+x+'"]').value='3333'; document.querySelector('[data-tv-qdc="'+x+'"]').value='7'; }, idNova);
await p.click('#btnAdmPrecoTurma'); await p.waitForTimeout(400);
ok(/atualizado|atualizados/.test(await txt('toast')),'7.3 aplicar preços das turmas e isoladas responde');
await persona('aluno'); await p.waitForTimeout(300);
await nav('v-loja'); await p.waitForTimeout(700);
const loja = await p.evaluate(x=>{ const t=document.querySelector('[data-turma="'+x+'"]'); return t?t.textContent.replace(/\s+/g,' '):''; }, idNova);
console.log('   vitrine:', loja);
ok(/3\.333 QdC/.test(loja),'7.4 o preço novo já vale na Quad Store (sem recriar a turma)');
ok(/7 QdC/.test(loja),'7.5 as vagas novas também');
const matr = await p.evaluate(()=>{ const t=document.querySelector('[data-turma="patamo-n"]'); return t?t.textContent:''; });
ok(/MATRICULADO/.test(matr),'7.6 turma com matrícula segue matriculada');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
