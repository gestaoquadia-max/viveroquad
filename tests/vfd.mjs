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

console.log('\n== 6) SELETOR DE CATEGORIAS ==');
await persona('admin'); await p.waitForTimeout(400);
const g = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (g){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
await navAdm('v-adm-loja'); await p.waitForTimeout(500);
const cats = await p.evaluate(()=>[...document.getElementById('admProdCat').options].map(o=>o.textContent));
console.log('   categorias:', JSON.stringify(cats));
ok(cats.length===6,'6.1 seis destinos ('+cats.length+')');
const proibidas = ['Turmas','Isoladas','Simulados presenciais','Eventos ·','Simulados digitais','Eventos online','Itens do personagem','Itens de combate'];
ok(!proibidas.some(x=>cats.some(cat=>cat.includes(x))),'6.2 nenhum destino que nasce em outro bloco');
const esperadas = ['Módulos','Excursões','Treinamento para o TAF','Outros','Cursos online','Mentoria'];
ok(esperadas.every(x=>cats.some(cat=>cat.includes(x))),'6.3 estão os seis permitidos');
ok(await p.evaluate(()=>document.getElementById('admProdDataBox').style.display==='none'),'6.4 sem data para Módulos');
await p.selectOption('#admProdCat','pres:excursao'); await p.waitForTimeout(250);
ok(await p.evaluate(()=>document.getElementById('admProdDataBox').style.display==='flex'),'6.5 Excursão pede data');
await p.selectOption('#admProdCat','dig:mentoria'); await p.waitForTimeout(250);
ok(await p.evaluate(()=>document.getElementById('admProdDataBox').style.display==='flex'),'6.6 Mentoria pede data');
await p.selectOption('#admProdCat','dig:cursos'); await p.waitForTimeout(250);
ok(await p.evaluate(()=>document.getElementById('admProdDataBox').style.display==='none'),'6.7 Curso online não pede data');

// publica em Módulos → vai para a seção certa
await p.selectOption('#admProdCat','pres:modulos');
await p.fill('#admProdNome','Caderno de Redação'); await p.fill('#admProdDesc','60 temas comentados');
await p.fill('#admProdPreco','120'); await p.fill('#admProdQtd','10');
await p.click('#btnAdmProd'); await p.waitForTimeout(400);
ok(/Módulos/.test(await txt('toast')),'6.8 publicado em Módulos');
// publica excursão com data
await p.selectOption('#admProdCat','pres:excursao'); await p.waitForTimeout(200);
await p.fill('#admProdNome','Excursão PRF Brasília'); await p.fill('#admProdDesc','ida e volta');
await p.fill('#admProdPreco','500'); await p.fill('#admProdQtd','8'); await p.fill('#admProdData','2026-09-12');
await p.click('#btnAdmProd'); await p.waitForTimeout(400);
ok(/entra no calendário/.test(await txt('toast')),'6.9 excursão com data avisa que entra no calendário');
// publica mentoria
await p.selectOption('#admProdCat','dig:mentoria'); await p.waitForTimeout(200);
await p.fill('#admProdNome','Mentoria individual CFO'); await p.fill('#admProdDesc','1h por semana');
await p.fill('#admProdPreco','700'); await p.fill('#admProdData','2026-09-20');
/* a mentoria virou turma online: pede começo E fim */
await p.click('#btnAdmProd'); await p.waitForTimeout(300);
ok(/data de término/.test(await p.evaluate(()=>document.getElementById('admProdErro').textContent)),'6.9b mentoria cobra a data de término');
await p.fill('#admProdDataFim','2026-11-20');
await p.click('#btnAdmProd'); await p.waitForTimeout(400);
ok(/Mentoria/.test(await txt('toast')),'6.10 mentoria publicada');
// confere as seções na loja
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(800);
ok(/Caderno de Redação/.test(await txt('lojaPres-modulos')),'6.11 o caderno foi para Módulos');
ok(/Excursão PRF Brasília/.test(await txt('lojaPres-excursao')),'6.12 a excursão foi para Excursões');
ok(/Mentoria individual CFO/.test(await txt('lojaExtras-mentoria')),'6.13 a mentoria foi para Mentoria');
// compra da excursão → eventos e calendário
await p.fill('#giftCode','QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(300);
await p.evaluate(()=>{ const b=[...document.querySelectorAll('#lojaPres-excursao .loja-item')].find(x=>/PRF Brasília/.test(x.textContent)); b.click(); }); await p.waitForTimeout(500);
if (await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on'))) { await p.click('#btnCompraOk'); await p.waitForTimeout(500); }
ok(/Excursão PRF Brasília/.test(await txt('evStrip')),'6.14 comprada, a excursão entra nos Eventos da semana');
await p.evaluate(()=>document.querySelector('[data-goto="v-calendario"]').click()); await p.waitForTimeout(500);
ok(/Excursão PRF Brasília/.test(await txt('calList')),'6.15 e no calendário do aluno');

console.log('\n== 6b) ITENS DE COMBATE NO CRIADOR DE SKIN ==');
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-hoje'); await p.waitForTimeout(500);
const tiposSk = await p.evaluate(()=>[...document.getElementById('admSkTipo').options].map(o=>o.textContent));
ok(tiposSk.length===2 && /combate/i.test(tiposSk[1]),'6.16 o criador de skin agora escolhe skin ou item de combate');
await p.selectOption('#admSkTipo','combate'); await p.waitForTimeout(250);
ok(await p.evaluate(()=>document.getElementById('admSkMoeda').style.display==='none'),'6.17 item de combate é sempre em Quad Coins');
ok((await p.evaluate(()=>document.getElementById('btnAdmSkin').textContent))==='Publicar item de combate','6.18 o botão muda');
await p.fill('#admSkNome','Rádio comunicador'); await p.fill('#admSkDesc','comunicação em campo'); await p.fill('#admSkPreco','55');
await p.click('#btnAdmSkin'); await p.waitForTimeout(400);
ok(/vai para a mochila/.test(await txt('toast')),'6.19 item de combate publicado');
ok(/COMBATE/.test(await txt('admSkinList')) && /Rádio comunicador/.test(await txt('admSkinList')),'6.20 aparece na lista de criados');
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(700);
ok(/Rádio comunicador/.test(await txt('combatGrid')),'6.21 está na seção Itens de combate da Loja');
await p.evaluate(()=>{ const b=[...document.querySelectorAll('#combatGrid .loja-item')].find(x=>/Rádio/.test(x.textContent)); b.click(); }); await p.waitForTimeout(500);
ok(/NA MOCHILA/.test(await txt('combatGrid')) || /mochila/i.test(await txt('toast')),'6.22 comprado, vai para a mochila');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
