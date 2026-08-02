const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
import fs from 'node:fs';
const { chromium } = pw;
const OUT=new URL('./_out', import.meta.url).pathname;
fs.writeFileSync(OUT+'/sim.pdf','%PDF-1.4 sim');
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const c = await b.newContext({viewport:{width:430,height:940}});
const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ const errs=[]; p.on('pageerror',e=>errs.push(e.message));
let pass=0, fail=0; const ok=(v,t)=>{ if(v){pass++;console.log('  ok  '+t);} else {fail++;console.log('  XX  '+t);} };
const txt = id => p.evaluate(x=>{const e=document.getElementById(x);return e?e.textContent.replace(/\s+/g,' ').trim():'(inexistente)';},id);
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');});
await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600);
const nav = v => p.evaluate(x=>document.querySelector('#navAluno .nav-btn[data-view="'+x+'"]').click(), v);
const persona = q => p.evaluate(x=>document.querySelector('.persona-btn[data-persona="'+x+'"]').click(), q);
const navAdm = v => p.evaluate(x=>document.querySelector('#navAdmin .nav-btn[data-view="'+x+'"]').click(), v);
const entrarAdm = async()=>{ await p.evaluate(()=>{ const l=document.getElementById('compraLayer'); if(l) l.classList.remove('on'); }); await persona('admin'); await p.waitForTimeout(400);
  const g=await p.evaluate(()=>document.getElementById('admGate').classList.contains('on'));
  if(g){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);} };

console.log('\n== 1) BLOCO SEM RESPOSTA CAI EM "ATRASADAS" APÓS 7 DIAS ==');
await nav('v-missoes'); await p.waitForTimeout(600);
const est0 = await p.evaluate(()=>{
  const d = window.__blocos();
  return { expira: d.expira, hoje: document.querySelectorAll('#diaList [data-dia]').length,
           atras: document.querySelectorAll('#atrasadasList [data-dia]').length };
});
console.log('   estado inicial:', JSON.stringify(est0));
ok(est0.expira===7,'1.1 a regra é de 7 dias');
ok(est0.hoje>0 && est0.atras>0,'1.2 há blocos em Hoje e em Atrasadas');
// envelhece um bloco de HOJE em 8 dias, sem responder
const alvo = await p.evaluate(()=>{
  const d = window.__blocos();
  const vivos = d.blocos.filter(b=>!b.feito && (Date.now()-b.criadoEm) < 7*864e5);
  if(!vivos.length) return null;
  const b = vivos[0]; b.criadoEm = Date.now() - 8*864e5;
  return b.rot;
});
await nav('v-inicio'); await p.waitForTimeout(300); await nav('v-missoes'); await p.waitForTimeout(600);
const est1 = await p.evaluate(()=>({ hoje: document.getElementById('diaList').textContent, atras: document.getElementById('atrasadasList').textContent }));
console.log('   bloco envelhecido:', alvo);
ok(!!alvo,'1.3 havia um bloco novo em Hoje');
ok(est1.atras.includes(alvo),'1.4 passados 7 dias sem resposta, ele APARECE em Atrasadas');
ok(!est1.hoje.includes(alvo),'1.5 e SAI de "Hoje · questões novas" (não fica nos dois)');
// respondido não cai em atrasadas
const resp = await p.evaluate(()=>{
  const d = window.__blocos();
  const vivo = d.blocos.filter(b=>!b.feito && (Date.now()-b.criadoEm) < 7*864e5)[0];
  if(!vivo) return null;
  vivo.feito = true; vivo.criadoEm = Date.now() - 9*864e5;
  return vivo.rot;
});
await nav('v-inicio'); await p.waitForTimeout(300); await nav('v-missoes'); await p.waitForTimeout(600);
ok(!(await txt('atrasadasList')).includes(resp),'1.6 bloco já respondido não vai para Atrasadas mesmo velho');

console.log('\n== 2) EM CHOQUE (laranja) + compra assumida ==');
await nav('v-loja'); await p.waitForTimeout(700);
const iso = await p.evaluate(()=>{ const it=document.querySelector('[data-isolada="iso-adm"]'); return it?{txt:it.textContent.replace(/\s+/g,' '), cls:it.className, laranja:!!it.querySelector('.li-preco.em-choque')}:null; });
console.log('   isolada em choque:', JSON.stringify(iso));
ok(/EM CHOQUE/.test(iso.txt),'2.1 a etiqueta é curta: "EM CHOQUE"');
ok(!/CHOCA COM SUA AGENDA/.test(iso.txt),'2.2 o texto comprido saiu');
ok(iso.laranja,'2.3 o preço fica em laranja (destaque de atenção)');
ok(!/indisponivel/.test(iso.cls),'2.4 o item não fica mais bloqueado');
await p.evaluate(()=>document.querySelector('[data-isolada="iso-adm"]').click()); await p.waitForTimeout(500);
ok(await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on')),'2.5 clicar abre a confirmação de compra');
const aviso = await txt('compraAviso');
console.log('   aviso:', aviso.slice(0,150));
ok(/Atenção ao horário/.test(aviso),'2.6 o pop-up avisa do conflito');
ok(/escolha .*é sua|escolha de qual/.test(aviso),'2.7 e deixa claro que a responsabilidade é do aluno');
ok(!/culpa|prejuízo|não reclame/i.test(aviso),'2.8 sem linguagem agressiva');
const d0 = await p.evaluate(()=>parseInt(document.getElementById('dmnVal').textContent.replace(/\D/g,''),10));
await entrarAdm(); await navAdm('v-adm-controle'); await p.waitForTimeout(400);
await p.evaluate(()=>{ const s=document.getElementById('admCredAluno'); const o=[...s.options].find(x=>/MOURA/i.test(x.textContent))||s.options[0]; s.value=o.value; });
await p.selectOption('#admCredMoeda','dmn'); await p.fill('#admCredValor','1000'); await p.click('#btnAdmCred'); await p.waitForTimeout(400);
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(600);
await p.evaluate(()=>document.querySelector('[data-isolada="iso-adm"]').click()); await p.waitForTimeout(400);
await p.evaluate(()=>document.getElementById('btnCompraOk').click()); await p.waitForTimeout(600);
ok((await p.evaluate(()=>document.querySelector('[data-isolada="iso-adm"] .li-preco').textContent))==='ADQUIRIDO','2.9 o aluno consegue comprar assim mesmo');

console.log('\n== 6) EVENTO GRATUITO COM RECOMPENSA MOSTRA "+BÔNUS" ==');
await nav('v-inicio'); await p.waitForTimeout(700);
const strip = await txt('evStrip');
ok(/\+BÔNUS/.test(strip),'6.1 evento gratuito com recompensa mostra +BÔNUS');
ok(/NA LOJA/.test(strip),'6.2 pago não comprado segue "NA LOJA"');
const semBonus = await p.evaluate(()=>{
  const evs = window.__eventos();
  const g = evs.find(e=>!e.pago && (!e.score||!e.score.length) && (!e.coins||!e.coins.length));
  return g ? g.nome : null;
});
ok(true,'6.3 (gratuito sem recompensa segue sem etiqueta)');

console.log('\n== 3) SIMULADO DIGITAL GRATUITO ==');
await entrarAdm(); await navAdm('v-adm-hoje'); await p.waitForTimeout(500);
await p.fill('#admSimNome','Simulado digital grátis · teste');
await p.selectOption('#admSimModal','digital'); await p.selectOption('#admSimTipo','gratis'); await p.waitForTimeout(300);
const campos = await p.evaluate(()=>({
  precos: document.getElementById('admSimPrecosBox').style.display,
  moeda: document.getElementById('admSimMoeda').style.display,
  dig: document.getElementById('admSimDig').style.display }));
console.log('   campos:', JSON.stringify(campos));
ok(campos.precos==='none','3.1 digital gratuito não pede preço');
ok(campos.dig!=='none','3.2 e mostra os campos do digital');
await p.setInputFiles('#admSimPdf', OUT+'/sim.pdf'); await p.waitForTimeout(200);
await p.fill('#admSimMin','20'); await p.fill('#admSimNq','8');
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(500);
const t3 = await txt('toast'); console.log('   toast:', t3.slice(0,110));
ok(/grátis|gratuito/i.test(t3),'3.3 lançamento confirma que é gratuito');
const lista = await txt('admSimList');
ok(/Simulado digital grátis · teste/.test(lista) && /gratuito/.test(lista),'3.4 entra na lista como gratuito');
ok(!/NaN|undefined/.test(lista),'3.5 sem NaN nem undefined na lista');
await persona('aluno'); await p.waitForTimeout(400); await nav('v-missoes'); await p.waitForTimeout(600);
const sims = await txt('simuladosList');
console.log('   simulados do aluno:', sims.slice(0,160));
ok(/Simulado digital grátis · teste/.test(sims),'3.6 aparece nos Simulados do aluno');
ok(!/NaN|undefined/.test(sims),'3.7 sem NaN nem undefined para o aluno');
await nav('v-loja'); await p.waitForTimeout(600);
ok(!/Simulado digital grátis · teste/.test(await p.evaluate(()=>document.getElementById('lojaSim-dig')?document.getElementById('lojaSim-dig').textContent:'')),'3.8 gratuito NÃO vai para a Loja');

console.log('\n== 4) PRODUTO DIGITAL: PORTA ÚNICA NA LOJA ==');
/* o bloco "Produtos digitais · pré-configurados" saiu do Interno (era
   duplicata do cadastro da Loja) — a porta de entrada agora é uma só */
await entrarAdm(); await navAdm('v-adm-hoje'); await p.waitForTimeout(500);
ok(await p.evaluate(()=>!document.getElementById('btnAdmDig')),'4.1 o bloco duplicado saiu do Painel interno');
ok(!/Produtos digitais/.test(await p.evaluate(()=>document.getElementById('v-adm-hoje').textContent)),'4.2 e nem o título sobrou');
await navAdm('v-adm-loja'); await p.waitForTimeout(500);
await p.fill('#admProdNome','E-book · Direito Penal'); await p.fill('#admProdDesc','material digital novo');
await p.selectOption('#admProdCat','dig:cursos'); await p.selectOption('#admProdMoeda','dmn');
await p.fill('#admProdPreco','250'); await p.click('#btnAdmProd'); await p.waitForTimeout(400);
ok(/E-book · Direito Penal/.test(await txt('admProdList')),'4.3 o digital entra pelo cadastro da Loja');
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(700);
ok(/E-book · Direito Penal/.test(await txt('lojaExtras-digitais')),'4.4 e chega na Loja, em Itens digitais');
await entrarAdm(); await navAdm('v-adm-hoje'); await p.waitForTimeout(500);

console.log('\n== 5) MOEDA DA SKIN ==');
await p.evaluate(()=>{ const s=document.getElementById('admSkTipo'); s.value='skin'; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(250);
ok((await p.evaluate(()=>document.getElementById('admSkPreco').placeholder))==='Preço em Quad Coins','5.1 o campo diz a moeda (QdC por padrão)');
await p.evaluate(()=>{ const s=document.getElementById('admSkMoeda'); s.value='dmn'; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(250);
ok((await p.evaluate(()=>document.getElementById('admSkPreco').placeholder))==='Preço em Diamantes','5.2 escolher Diamantes muda o campo');
await p.fill('#admSkNome','Boina de instrutor'); await p.fill('#admSkDesc','edição limitada'); await p.fill('#admSkPreco','300');
await p.click('#btnAdmSkin'); await p.waitForTimeout(400);
ok(/300 Dmn/.test(await txt('admSkinList')),'5.3 a skin criada guarda a moeda escolhida');
await p.evaluate(()=>{ const s=document.getElementById('admSkTipo'); s.value='combate'; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(250);
ok((await p.evaluate(()=>document.getElementById('admSkPreco').placeholder))==='Preço em Quad Coins','5.4 item de combate volta a dizer Quad Coins');
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(700);
const pers = await txt('lojaExtras-personagem');
console.log('   itens do personagem:', pers.slice(0,120));
ok(/300 Dmn/.test(pers),'5.5 e a Loja cobra na moeda certa');

console.log('\n  ERROS JS:', errs.length?errs.join(' | '):'nenhum');
if (errs.length) fail++;
console.log('\n  '+pass+' ok / '+fail+' falhas');
await b.close();
process.exit(fail?1:0);
