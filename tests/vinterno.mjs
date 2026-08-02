const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
import fs from 'node:fs';
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
fs.writeFileSync(OUT + '/arvore-ppba.pdf', '%PDF-1.4 arvore de edital de teste');
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
const confirmar = async p => { await p.evaluate(()=>{ var b=document.getElementById('btnCompraOk'); if(document.getElementById('compraLayer').classList.contains('on')) b.click(); }); await p.waitForTimeout(350); };

// (teste 1 aposentado: a criação de turmas migrou para o Painel de controle — cobertura na suíte vfaseb)

// ===== 2: o catálogo digital duplicado saiu do Interno (dec. 118) =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.getElementById('admDigList')), '2: bloco "Produtos digitais · pré-configurados" removido');
  ok(!/Produtos digitais/.test(await p.evaluate(()=>document.getElementById('v-adm-hoje').textContent)), '2: nem o título sobrou no Painel interno');
  await navAdm(p,'v-adm-loja'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!!document.getElementById('btnAdmProd')), '2: a porta de entrada do digital é o cadastro da Loja');
  await p.context().close();
}

// ===== 3: criador de skins — publica, aluno compra com confirmação =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  const icones = await p.evaluate(()=>document.querySelectorAll('#admSkIcones .ico-opt').length);
  ok(icones===6, '3: banco de visuais da skin com 6 opções');
  // sem preço → barrado
  await p.fill('#admSkNome','Boina de instrutor'); await p.click('#btnAdmSkin'); await p.waitForTimeout(200);
  ok(/preço/i.test(await toast(p)), '3: sem preço é barrado');
  await p.fill('#admSkDesc','edição limitada'); await p.selectOption('#admSkMoeda','qdc'); await p.fill('#admSkPreco','120');
  await p.evaluate(()=>{ [...document.querySelectorAll('#admSkIcones .ico-opt')].find(x=>x.dataset.ico==='farda').click(); });
  await p.click('#btnAdmSkin'); await p.waitForTimeout(250);
  ok(/publicada/.test(await toast(p)), '3: skin publicada');
  ok(/Boina de instrutor/.test(await p.evaluate(()=>document.getElementById('admSkinList').textContent)), '3: entra na lista de skins criadas');
  await persona(p,'aluno'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(400);
  const it = await p.evaluate(()=>{ const el=document.querySelector('#lojaExtras-personagem .loja-item[data-nome="Boina de instrutor"]'); return el ? el.textContent : ''; });
  ok(/120/.test(it) && /QdC/.test(it), '3: skin em Itens do personagem por 120 QdC');
  const q0 = await p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
  await p.evaluate(()=>document.querySelector('#lojaExtras-personagem .loja-item[data-nome="Boina de instrutor"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on')), '3: compra pede confirmação');
  await confirmar(p);
  const q1 = await p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
  ok(q0-q1===120, '3: débito de 120 QdC ('+q0+'→'+q1+')');
  ok(/ADQUIRID/.test(await p.evaluate(()=>document.querySelector('#lojaExtras-personagem .loja-item[data-nome="Boina de instrutor"]').textContent)), '3: item vira ADQUIRIDO');
  // admin remove outra skin criada sem compra
  await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(200);
  await p.fill('#admSkNome','Colete cerimonial'); await p.fill('#admSkPreco','300'); await p.click('#btnAdmSkin'); await p.waitForTimeout(200);
  await p.evaluate(()=>{ [...document.querySelectorAll('#admSkinList [data-rm-skin]')].find(x=>x.dataset.rmSkin==='Colete cerimonial').click(); }); await p.waitForTimeout(250);
  ok(!/Colete cerimonial/.test(await p.evaluate(()=>document.getElementById('admSkinList').textContent)), '3: ✕ tira a skin da lista e da Loja');
  await p.context().close();
}

// ===== 4: Quests — botão presente, EM BREVE, sem funcionalidade =====
{ const p = await loginAluno(); await entrarAdmin(p); await navAdm(p,'v-adm-hoje'); await p.waitForTimeout(300);
  const card = await p.evaluate(()=>{ const ks=[...document.querySelectorAll('#v-adm-hoje .p-card')]; const c=ks.find(x=>/Quests/.test(x.textContent)); return c ? c.textContent : ''; });
  ok(/Criar Quests/.test(card) && /EM BREVE/.test(card), '4: card Quests com botão e EM BREVE');
  await p.evaluate(()=>document.getElementById('btnAdmQuests').click()); await p.waitForTimeout(200);
  ok(/Próxima implementação/i.test(await toast(p)), '4: clique só anuncia a próxima implementação');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
