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

// ===== ITEM 1: QR com "ver completo" =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await p.fill('#admGiftQtd','20'); await p.fill('#admGiftValor','1000'); await p.selectOption('#admGiftMoeda','qdc');
  await p.click('#btnAdmGift'); await p.waitForTimeout(250);
  await p.evaluate(()=>document.querySelector('[data-lote="0"]').click()); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.querySelectorAll('#admGiftQRs .qr-cell').length)===6, '1: começa mostrando 6 QR (não estoura o espaço)');
  ok(await p.evaluate(()=>!!document.getElementById('giftQrBtn')) && /Ver todos os 20/.test(await p.evaluate(()=>document.getElementById('giftQrBtn').textContent)), '1: botão "ver todos os 20 QR codes"');
  await p.evaluate(()=>document.getElementById('giftQrBtn').click()); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.querySelectorAll('#admGiftQRs .qr-cell').length)===20, '1: "ver completo" mostra os 20');
  ok(/Mostrar menos/.test(await p.evaluate(()=>document.getElementById('giftQrBtn').textContent)), '1: vira "Mostrar menos"');
  await p.evaluate(()=>document.getElementById('giftQrBtn').click()); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.querySelectorAll('#admGiftQRs .qr-cell').length)===6, '1: recolhe de volta para 6');
  await p.context().close();
}

// ===== ITEM 3: relatórios seguem o Domínio + Acionar envia mensagem =====
{ const p = await loginAluno();
  // aluno da PATAMO/CFO por padrão → relatórios usam a árvore CFO
  await persona(p,'admin'); await p.waitForTimeout(400);
  await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(300);
  await navAdm(p,'v-adm-alunos'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#relTabs .rel-tab[data-rel="turma"]').click()); await p.waitForTimeout(200);
  const matCFO = await p.evaluate(()=>document.getElementById('admDifMat').textContent);
  // troca o Domínio para PRF (pela Estrutura) e confere que os relatórios acompanham
  await p.evaluate(()=>{ window.__dominio && window.__dominio("prf"); }); await p.waitForTimeout(250);
  const matPRF = await p.evaluate(()=>document.getElementById('admDifMat').textContent);
  ok(matCFO!==matPRF, '3: relatórios (dificuldades) acompanham a troca de árvore/Domínio');
  // Acionar → leva ao bloco de mensagens individuais pronto para enviar
  await p.evaluate(()=>{ window.__dominio && window.__dominio("cfo"); }); await p.waitForTimeout(250);
  await p.evaluate(()=>document.querySelector('#relTabs .rel-tab[data-rel="turma"]').click()); await p.waitForTimeout(150);
  const alvo = await p.evaluate(()=>{ const b=document.querySelector('#admApoioList [data-apoio]'); return b?b.dataset.apoio:''; });
  await p.evaluate(()=>document.querySelector('#admApoioList [data-apoio]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('v-adm-controle').classList.contains('on')), '3: Acionar leva ao Painel de controle (Mensagens individuais)');
  ok(await p.evaluate(()=>document.getElementById('admMsgTipo').value)==='aluno' && await p.evaluate(()=>document.getElementById('admMsgTexto').value.length>0), '3: bloco pronto com texto sugerido');
  await p.click('#btnAdmMsg'); await p.waitForTimeout(250);
  ok(new RegExp('enviad', 'i').test(await toast(p)) && await p.evaluate(a=>document.getElementById('admMsgList').textContent.includes(a), alvo), '3: recado individual enviado ao aluno de apoio ('+alvo+')');
  await p.context().close();
}

// ===== ITEM 5: editar produto (fica na Loja até salvar) + preço em Dmn =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-loja'); await p.waitForTimeout(300);
  // cria um produto digital em QdC
  await p.fill('#admProdNome','E-book Teste'); await p.fill('#admProdDesc','material'); await p.selectOption('#admProdCat','dig:cursos');
  await p.selectOption('#admProdMoeda','qdc'); await p.fill('#admProdPreco','100');
  await p.click('#btnAdmProd'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>/Editar/.test(document.getElementById('admProdList').textContent)), '5: produto cadastrado tem botão Editar');
  // confere na Loja do aluno
  await persona(p,'aluno'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>/E-book Teste/.test(document.getElementById('lojaExtras-digitais').textContent)) && await p.evaluate(()=>/100\s*QdC/.test(document.getElementById('lojaExtras-digitais').textContent.replace(/ /g,' '))), '5: produto na Loja por 100 QdC');
  // edita: muda preço e moeda para Dmn — durante a edição, continua na Loja
  await entrarAdmin(p); await navAdm(p,'v-adm-loja'); await p.waitForTimeout(200);
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admProdList .adm-bar')]; const r=rows.find(x=>/E-book Teste/.test(x.textContent)); r.querySelector('[data-ed-extra]').click(); }); await p.waitForTimeout(250);
  ok(await p.evaluate(()=>document.getElementById('admProdNome').value)==='E-book Teste' && await p.evaluate(()=>document.getElementById('btnAdmProd').textContent)==='Salvar alterações', '5: Editar traz o produto de volta ao formulário');
  // durante a edição, ainda está na Loja
  await persona(p,'aluno'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>/E-book Teste/.test(document.getElementById('lojaExtras-digitais').textContent)), '5: durante a edição o item continua na Loja');
  await entrarAdmin(p); await navAdm(p,'v-adm-loja'); await p.waitForTimeout(200);
  await p.fill('#admProdPreco','7'); await p.selectOption('#admProdMoeda','dmn');
  await p.click('#btnAdmProd'); await p.waitForTimeout(300);
  ok(/atualizado/.test(await toast(p)) && await p.evaluate(()=>document.getElementById('btnAdmProd').textContent)==='Publicar na Loja', '5: salvar atualiza e reseta o formulário');
  await persona(p,'aluno'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>/7\s*Dmn/.test(document.getElementById('lojaExtras-digitais').textContent.replace(/ /g,' '))) && !await p.evaluate(()=>/100\s*QdC/.test(document.getElementById('lojaExtras-digitais').textContent.replace(/ /g,' '))), '5: preço/moeda atualizados na Loja (7 Dmn)');
  // editor de preços: agora edita em Dmn também
  await entrarAdmin(p); await navAdm(p,'v-adm-loja'); await p.waitForTimeout(200);
  const temDmn = await p.evaluate(()=>[...document.querySelectorAll('#admPrecosList [data-preco-item]')].some(i=>i.dataset.precoMoeda==='dmn'));
  ok(temDmn, '5: "Preços da Loja" traz itens em Diamantes');
  // altera o preço em Dmn do E-book Teste
  await p.evaluate(()=>{ const i=[...document.querySelectorAll('#admPrecosList [data-preco-item]')].find(x=>x.dataset.precoItem==='E-book Teste'); i.value='9'; });
  await p.click('#btnAdmPrecos'); await p.waitForTimeout(250);
  await persona(p,'aluno'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>/9\s*Dmn/.test(document.getElementById('lojaExtras-digitais').textContent.replace(/ /g,' '))), '5: editor de preços aplica o novo valor em Dmn (9 Dmn)');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
