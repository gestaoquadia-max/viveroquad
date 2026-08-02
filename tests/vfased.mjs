const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const errs = [], fails = [];
const ok = (c, m) => { console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
async function ctx(){ const c = await b.newContext({ viewport:{width:430,height:940}, deviceScaleFactor:2 }); const p = await c.newPage();
  await p.addInitScript(() => { window.__admTudo = true; });   /* blocos do admin abertos para o teste */ p.on('pageerror', e=>errs.push(e.message)); await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'}); await p.waitForTimeout(400); return p; }
const loginAluno = async () => { const p = await ctx(); await p.evaluate(()=>{localStorage.setItem('vq_tut_done','1');localStorage.setItem('vq_tut_skip','1');}); await p.fill('#loginEmail','aluno@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(5600); return p; };
const nav = (p,v) => p.evaluate(x=>document.querySelector('#navAluno .nav-btn[data-view="'+x+'"]').click(), v);
const persona = (p,q) => p.evaluate(pp=>{ document.querySelector('.persona-btn[data-persona="'+pp+'"]').click(); }, q);
async function entrarAdmin(p){ await persona(p,'admin'); await p.waitForTimeout(400); const gate = await p.evaluate(()=>document.getElementById('admGate').classList.contains('on')); if(gate){ await p.fill('#admEmail','npp@quadconcursos.com.br'); await p.fill('#admChave','NPP-2026'); await p.click('#btnAdmEntrar'); await p.waitForTimeout(400); } }
const toast = p => p.evaluate(()=>document.getElementById('toast').textContent);
const dmn = p => p.evaluate(()=>parseInt(document.getElementById('dmnVal').textContent.replace(/\D/g,''),10));
const qdc = p => p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));

// ===== 1: lote de gift cards com QR único no Controle =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await p.fill('#admGiftQtd','5'); await p.fill('#admGiftValor','1000'); await p.selectOption('#admGiftMoeda','dmn');
  await p.click('#btnAdmGift'); await p.waitForTimeout(300);
  const lote = await p.evaluate(()=>document.getElementById('admGiftLotes').textContent);
  ok(/5 gift cards de 1.000 Dmn/.test(lote.replace(/ /g,' ')) && /0 de 5 resgatados/.test(lote), '1: lote de 5 × 1.000 Dmn criado');
  await p.evaluate(()=>document.querySelector('[data-lote="0"]').click()); await p.waitForTimeout(300);
  const nQr = await p.evaluate(()=>document.querySelectorAll('#admGiftQRs .qr-cell').length);
  ok(nQr===5, '1: um QR por gift card ('+nQr+')');
  const codes = await p.evaluate(()=>[...document.querySelectorAll('#admGiftQRs .qr-cell small')].map(x=>x.textContent));
  ok(new Set(codes).size===5, '1: códigos todos diferentes');
  const distintos = await p.evaluate(()=>{ const svgs=[...document.querySelectorAll('#admGiftQRs .qr-cell svg')].map(x=>x.innerHTML); return new Set(svgs).size; });
  ok(distintos===5, '1: cada QR com padrão próprio ('+distintos+' padrões)');
  await p.locator('#admGiftQRs').screenshot({path:OUT+'/fd-qrs.png'}).catch(()=>{});
  await p.context().close();
}

// ===== 2: aluno valida pelo "+" (câmera) e o QR invalida na hora =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await p.fill('#admGiftQtd','2'); await p.fill('#admGiftValor','500'); await p.selectOption('#admGiftMoeda','dmn');
  await p.click('#btnAdmGift'); await p.waitForTimeout(250);
  await p.evaluate(()=>document.querySelector('[data-lote="0"]').click()); await p.waitForTimeout(200);
  const cod1 = await p.evaluate(()=>document.querySelector('#admGiftQRs .qr-cell small').textContent);
  await persona(p,'aluno'); await p.waitForTimeout(300);
  const d0 = await dmn(p);
  // dec. 111/112: o leitor saiu do "+" e mora no bloco do gift card, na Quad Store
  await p.evaluate(()=>document.getElementById('btnPlus').click()); await p.waitForTimeout(250);
  ok(!/Gift Card/.test(await p.evaluate(()=>document.getElementById('plusPop').textContent)), '2: "+" já não tem "Validar Gift Card"');
  await p.evaluate(()=>document.getElementById('plusPop').classList.remove('on'));
  await nav(p,'v-loja'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>{ const b=document.getElementById('btnGiftScan'); return !!b && !!b.closest('.lh-gift'); }), '2: "Validar pelo QR" ao lado do resgate, na Quad Store');
  await p.evaluate(()=>document.getElementById('btnGiftScan').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('scanLayer').classList.contains('on')), '2: câmera do leitor abre');
  ok(await p.evaluate(()=>!!document.querySelector('#scanLayer .scan-line')), '2: moldura de leitura com varredura');
  await p.evaluate(()=>document.getElementById('btnScanDemo').click()); await p.waitForTimeout(400);
  ok((await dmn(p))===d0+500, '2: leitura creditou +500 Dmn ('+d0+'→'+(d0+500)+')');
  ok(!await p.evaluate(()=>document.getElementById('scanLayer').classList.contains('on')), '2: leitor fecha após validar');
  // o mesmo código não vale duas vezes (liberação única) — tenta manual na Store
  await nav(p,'v-loja'); await p.waitForTimeout(300);
  await p.fill('#giftCode', cod1); await p.click('#btnGift'); await p.waitForTimeout(250);
  ok(/já foi resgatado/.test(await toast(p)), '2: QR usado fica invalidado (liberação única)');
  // admin vê 1 de 2 resgatados e a célula USADO
  await entrarAdmin(p); await p.waitForTimeout(200);
  ok(/1 de 2 resgatados/.test(await p.evaluate(()=>document.getElementById('admGiftLotes').textContent)), '2: lote marca 1 de 2 resgatados');
  await p.evaluate(()=>document.querySelector('[data-lote="0"]').click()); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>document.querySelectorAll('#admGiftQRs .qr-cell.usado').length)===1, '2: QR usado marcado no lote');
  await p.context().close();
}

// ===== 3: resgate manual do código do lote na Quad Store =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await p.fill('#admGiftQtd','1'); await p.fill('#admGiftValor','300'); await p.selectOption('#admGiftMoeda','qdc');
  await p.click('#btnAdmGift'); await p.waitForTimeout(250);
  await p.evaluate(()=>document.querySelector('[data-lote="0"]').click()); await p.waitForTimeout(200);
  const cod = await p.evaluate(()=>document.querySelector('#admGiftQRs .qr-cell small').textContent);
  await persona(p,'aluno'); await p.waitForTimeout(300);
  const q0 = await qdc(p);
  await nav(p,'v-loja'); await p.waitForTimeout(300);
  await p.fill('#giftCode', cod); await p.click('#btnGift'); await p.waitForTimeout(300);
  ok((await qdc(p))===q0+300, '3: código do lote também vale digitado na Store (+300 QdC)');
  await p.context().close();
}

// ===== 4: estornos na Quad Store — contagem regressiva, 2 toques, admin avisado =====
{ const p = await loginAluno(); await nav(p,'v-loja'); await p.waitForTimeout(400);
  const bloco = await p.evaluate(()=>document.getElementById('lojaEstornos').textContent);
  ok(/Módulo impresso/.test(bloco) && /FALTAM 5 DIAS/.test(bloco), '4: compra de 2 dias atrás com contagem (faltam 5 dias)');
  ok(/Garrafinha Quad/.test(bloco) && /PRAZO ENCERRADO/.test(bloco), '4: compra de 8 dias atrás fora do prazo');
  const disGar = await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#lojaEstornos .mission-row')]; const r=rows.find(x=>/Garrafinha/.test(x.textContent)); return r.querySelector('button').disabled; });
  ok(disGar, '4: botão de estorno desativado após o prazo');
  const q0 = await qdc(p);
  // dois toques para confirmar
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#lojaEstornos .mission-row')]; const r=rows.find(x=>/Módulo impresso/.test(x.textContent)); r.querySelector('[data-est]').click(); }); await p.waitForTimeout(200);
  const rot = await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#lojaEstornos .mission-row')]; const r=rows.find(x=>/Módulo impresso/.test(x.textContent)); return r.querySelector('[data-est]').textContent; });
  ok(/Confirmar estorno/.test(rot), '4: primeiro toque pede confirmação');
  ok((await qdc(p))===q0, '4: sem confirmação, nada debitado/creditado');
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#lojaEstornos .mission-row')]; const r=rows.find(x=>/Módulo impresso/.test(x.textContent)); r.querySelector('[data-est]').click(); }); await p.waitForTimeout(300);
  ok((await qdc(p))===q0+150, '4: estorno devolve +150 QdC ('+q0+'→'+(q0+150)+')');
  ok(!/Módulo impresso/.test(await p.evaluate(()=>document.getElementById('lojaEstornos').textContent)), '4: item sai da lista de estornáveis');
  // admin: registro + ranking; compradores com tag ESTORNADO
  await entrarAdmin(p); await p.waitForTimeout(300);
  const est = await p.evaluate(()=>document.getElementById('admEstList').textContent);
  ok(/Módulo impresso/.test(est) && /AL SD QUAD MOURA/.test(est), '4: "Estornos e desistências" registra quem e o quê');
  ok(/Módulo impresso/.test(await p.evaluate(()=>document.getElementById('admEstTop').textContent)), '4: ranking dos mais estornados');
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-alunos"]').click()); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#relTabs .rel-tab[data-rel="loja"]').click()); await p.waitForTimeout(200);
  ok(/ESTORNADO/.test(await p.evaluate(()=>document.getElementById('admComprasList').textContent)), '4: log de compradores marca ESTORNADO');
  await p.context().close();
}

// ===== 5: estorno de matrícula devolve a vaga e libera o turno =====
{ const p = await loginAluno(); await nav(p,'v-loja'); await p.waitForTimeout(400);
  await p.evaluate(()=>document.querySelector('[data-turma="rondesp-m"]').click()); await p.waitForTimeout(300);
  await p.evaluate(()=>document.getElementById('btnTuQdc').click()); await p.waitForTimeout(400);
  ok(/MATRICULADO/.test(await p.evaluate(()=>document.querySelector('[data-turma="rondesp-m"]').textContent)), '5: matriculado na manhã (700 QdC)');
  const q0 = await qdc(p);
  const emLista = await p.evaluate(()=>document.getElementById('lojaEstornos').textContent);
  ok(/Turma RONDESP Manhã · matrícula/.test(emLista) && /FALTAM 7 DIAS/.test(emLista), '5: matrícula entra nos estornáveis com 7 dias');
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#lojaEstornos .mission-row')]; const r=rows.find(x=>/matrícula/.test(x.textContent)); r.querySelector('[data-est]').click(); }); await p.waitForTimeout(150);
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#lojaEstornos .mission-row')]; const r=rows.find(x=>/matrícula/.test(x.textContent)); r.querySelector('[data-est]').click(); }); await p.waitForTimeout(400);
  ok((await qdc(p))===q0+700, '5: estorno da matrícula devolve os 700 QdC');
  const dep = await p.evaluate(()=>document.querySelector('[data-turma="rondesp-m"]').textContent);
  ok(/600 Dmn ou 700 QdC/.test(dep.replace(/ /g,' ')) && /6 QdC/.test(dep), '5: turma volta disponível com a vaga QdC devolvida (6)');
  ok(!/INDISPONÍVEL/.test(await p.evaluate(()=>document.querySelector('[data-turma="bope-m"]').textContent)), '5: turno da manhã liberado de novo');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
