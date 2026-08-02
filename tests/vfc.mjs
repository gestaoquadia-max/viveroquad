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

console.log('\n== 5) MATÉRIAS ISOLADAS ==');
await persona('admin'); await p.waitForTimeout(400);
const g = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
if (g){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500); }
await navAdm('v-adm-controle'); await p.waitForTimeout(500);
ok(/Criação de turmas e isoladas/.test(await p.evaluate(()=>document.getElementById('v-adm-controle').textContent)),'5.1 o bloco foi renomeado');
const tipos = await p.evaluate(()=>[...document.getElementById('admCtTipo').options].map(o=>o.textContent));
console.log('   tipos:', JSON.stringify(tipos));
ok(tipos.some(t=>/Matérias isoladas/.test(t)),'5.2 "Matérias isoladas" entrou no seletor (dec. 137: tipo com nome de verdade)');
ok(await p.evaluate(()=>document.getElementById('admCtIsoBox').style.display==='none'),'5.3 os dias da semana ficam escondidos nas turmas normais');
await p.selectOption('#admCtTipo','ISOLADA'); await p.waitForTimeout(300);
ok(await p.evaluate(()=>document.getElementById('admCtIsoBox').style.display==='block'),'5.4 escolher ISOLADA revela os dias da semana');
const dias = await p.evaluate(()=>[...document.querySelectorAll('#admCtDias .turno-chip')].map(b=>b.textContent));
ok(dias.length===7 && dias[0]==='SEG' && dias[6]==='DOM','5.5 sete botões de dia da semana: '+dias.join(' '));
ok(await p.evaluate(()=>document.getElementById('admCtProfsBox').style.display==='none'),'5.6 "professores por matéria" some (isolada tem um professor só)');
ok((await p.evaluate(()=>document.getElementById('btnAdmCtAbrir').textContent))==='Abrir isolada','5.7 o botão vira "Abrir isolada"');
// sem dia marcado não cria
await p.fill('#admCtApelido','Língua Portuguesa');
await p.fill('#admCtIni','2026-08-20'); await p.fill('#admCtFim','2026-10-20');
await p.fill('#admCtH1i','14:00'); await p.fill('#admCtH1f','17:00');
await p.fill('#admCtPrecoDmn','300'); await p.fill('#admCtVagas','25');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(300);
ok(/ao menos um dia/.test(await txt('admCtErro')),'5.8 sem dia marcado não deixa criar (aviso fixo no bloco)');
// cria: todo sábado das 14 às 17, na Sala 3 (a de Português já vive na Sala 1)
await p.selectOption('#admCtSala','Sala 3');
await p.evaluate(()=>document.querySelector('#admCtDias [data-dia="sábado"]').click()); await p.waitForTimeout(150);
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
const t8 = await txt('toast');
console.log('   toast:', t8.slice(0,100));
ok(/Isolada de Língua Portuguesa aberta/.test(t8) && /SÁB/.test(t8) && /14h–17h/.test(t8),'5.9 isolada criada com dia e horário');
ok(/ISOLADA/.test(await txt('admCtLista')) && /Língua Portuguesa/.test(await txt('admCtLista')),'5.10 entra na lista do painel');
// dois dias
await p.fill('#admCtApelido','Direito Administrativo');
await p.fill('#admCtIni','2026-09-01'); await p.fill('#admCtFim','2026-12-01');
await p.fill('#admCtH1i','22:00'); await p.fill('#admCtH1f','23:59');
await p.fill('#admCtPrecoQdc','800'); await p.fill('#admCtVagas','15');
await p.selectOption('#admCtSala','Sala 3');
await p.evaluate(()=>{ document.querySelector('#admCtDias [data-dia="terça-feira"]').click(); document.querySelector('#admCtDias [data-dia="quinta-feira"]').click(); });
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
ok(/TER e QUI/.test(await txt('toast')),'5.11 isolada com dois dias (terças e quintas)');
// loja
await persona('aluno'); await p.waitForTimeout(400);
await nav('v-loja'); await p.waitForTimeout(700);
const iso = await txt('lojaIsoladas');
console.log('   loja/isoladas:', iso.slice(0,190));
ok(/Isolada Língua Portuguesa/.test(iso),'5.12 a isolada nova está na Quad Store');
ok(/SÁB · 14h–17h/.test(iso),'5.13 mostrando os dias e o horário');
ok(/20\/08\/2026 a 20\/10\/2026/.test(iso),'5.14 e o período');
ok(/25 vagas/.test(iso),'5.15 com as vagas');
// compra → evento + calendário
await p.fill('#giftCode','QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(300);
await p.evaluate(()=>{ const b=[...document.querySelectorAll('#lojaIsoladas .loja-item')].find(x=>/Língua Portuguesa/.test(x.textContent)); b.click(); }); await p.waitForTimeout(400);
if (await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on'))) { await p.click('#btnCompraOk'); await p.waitForTimeout(500); }
ok(/ADQUIRIDO/.test(await txt('lojaIsoladas')),'5.16 comprada vira ADQUIRIDO');
ok(/Isolada Língua Portuguesa/.test(await txt('evStrip')),'5.17 e aparece nos eventos da semana');
await p.evaluate(()=>document.querySelector('[data-goto="v-calendario"]').click()); await p.waitForTimeout(500);
ok(/Isolada Língua Portuguesa/.test(await txt('calList')),'5.18 e no calendário do aluno');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
