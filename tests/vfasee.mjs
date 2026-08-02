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
async function entrarProf(p, nome){ await persona(p,'professor'); await p.waitForTimeout(400); const gate = await p.evaluate(()=>document.getElementById('profGate').classList.contains('on')); if(gate){ const em = nome ? nome.replace(/^(Prof\.ª|Prof\.|Cap\.|Ten\.)\s*/,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g,'')+'@quadconcursos.com.br' : 'silva@quadconcursos.com.br'; await p.fill('#profEmail', em); await p.fill('#profSenha','quad1234'); await p.click('#btnProfEntrar'); await p.waitForTimeout(400); } }

// ===== 1: banco de professores — cadastro completo alimenta a criação de turmas =====
{ const p = await loginAluno(); await entrarAdmin(p);
  const seed = await p.evaluate(()=>document.getElementById('admDocList').textContent);
  ok(/Cap\. Silva/.test(seed) && /Direito Penal/.test(seed) && /ATIVO/.test(seed), '1: banco vem com o corpo docente inicial');
  ok(/Prof\. Nascimento/.test(seed) && /sem graduação/.test(seed), '1: professor sem graduação exibido como tal');
  // matérias limitadas a 3
  const nMat = await p.evaluate(()=>document.querySelectorAll('#admDocList .adm-bar').length);
  // cadastra novo professor de Matemática (3 matérias, só manhã)
  await p.fill('#admDocNome','Prof. Teste Alpha');
  await p.selectOption('#admDocMat1','Matemática');
  await p.evaluate(()=>{ const s=document.getElementById('admDocMat2'); s.value=[...s.options].map(o=>o.value).find(v=>/Informática/.test(v))||''; });
  // chips começam desmarcados → clica só o "manhã" para selecioná-lo
  await p.evaluate(()=>{ document.querySelector('#admDocTurnos .turno-chip[data-turno="manhã"]').click(); });
  await p.fill('#admDocGrad','Mestre'); await p.fill('#admDocFone','(71) 90000-0000');
  await p.click('#btnAdmDoc'); await p.waitForTimeout(300);
  ok(/cadastrado/.test(await toast(p)) && await p.evaluate(()=>/Prof\. Teste Alpha/.test(document.getElementById('admDocList').textContent)), '1: novo professor entra no banco');
  // "sem graduação" desabilita o campo
  await p.evaluate(()=>{ document.getElementById('admDocSemGrad').checked=true; document.getElementById('admDocSemGrad').dispatchEvent(new Event('change')); }); await p.waitForTimeout(150);
  ok(await p.evaluate(()=>document.getElementById('admDocGrad').disabled), '1: marcar "sem graduação" desabilita o campo de graduação');
  // criação de turmas: matéria Matemática oferece só quem a ministra
  await p.evaluate(()=>{ const s=document.getElementById('admCtConc'); s.value='cfo'; s.dispatchEvent(new Event('change')); }); await p.waitForTimeout(200);
  const optMat = await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admCtProfs .adm-bar')]; const r=rows.find(x=>/Matemática/.test(x.querySelector('.nm').textContent)); return r? [...r.querySelector('select').options].map(o=>o.textContent):[]; });
  ok(optMat.includes('Prof. Ferraz') && optMat.includes('Prof. Teste Alpha') && !optMat.includes('Cap. Silva'), '1: "Professores por matéria" puxa do banco só quem ministra Matemática ('+optMat.join(',')+')');
  await p.context().close();
}

// ===== 2: desligar/bloquear reflete nas listas e no acesso do professor =====
{ const p = await loginAluno(); await entrarAdmin(p);
  // desliga o Prof. Ferraz
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admDocList .adm-bar')]; const r=rows.find(x=>/Prof\. Ferraz/.test(x.textContent)); r.querySelector('[data-doc-desl]').click(); }); await p.waitForTimeout(250);
  ok(/desligado/.test(await toast(p)), '2: desligar remove das listas');
  const optMat = await p.evaluate(()=>{ const s=document.getElementById('admCtConc'); s.value='cfo'; s.dispatchEvent(new Event('change')); const rows=[...document.querySelectorAll('#admCtProfs .adm-bar')]; const r=rows.find(x=>/Matemática/.test(x.querySelector('.nm').textContent)); return r?[...r.querySelector('select').options].map(o=>o.textContent):[]; });
  ok(!optMat.includes('Prof. Ferraz'), '2: professor desligado sai de "Professores por matéria"');
  // bloqueia o Cap. Silva e tenta logar
  await p.evaluate(()=>{ const rows=[...document.querySelectorAll('#admDocList .adm-bar')]; const r=rows.find(x=>/Cap\. Silva/.test(x.textContent)); r.querySelector('[data-doc-bloq]').click(); }); await p.waitForTimeout(250);
  await persona(p,'professor'); await p.waitForTimeout(400);
  await p.fill('#profEmail','silva@quadconcursos.com.br'); await p.fill('#profSenha','quad1234');
  const temSilva = await p.evaluate(()=>[...document.querySelectorAll('#admDocList .adm-bar')].some(r=>/Cap\. Silva/.test(r.textContent)));
  ok(temSilva, '2: professor bloqueado continua no banco de docentes (não foi desligado)');
  await p.click('#btnProfEntrar'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('profGate').classList.contains('on')) && /bloqueado/i.test(await toast(p)), '2: login do professor bloqueado é negado');
  await p.context().close();
}

// ===== 3: criação de turmas — rótulos claros + turma aparece na Store =====
{ const p = await loginAluno(); await entrarAdmin(p);
  const labels = await p.evaluate(()=>[...document.querySelectorAll('#v-adm-controle .ct-fld span')].map(s=>s.textContent.trim()));
  /* período e horário também viraram grade rotulada (dec. 126) — os
     rótulos de preço/vagas seguem na mesma ordem, ao final              */
  ok(labels.join('|').indexOf('Preço em Diamantes|Preço em Quad Coins|Vagas em Diamantes|Vagas em Quad Coins')>=0, '3: campos de preço/vagas com rótulos claros — POR MOEDA, dec. 155 ('+labels.join(' · ')+')');
  ok(labels.indexOf('Início')>=0 && labels.indexOf('Término')>=0, '3: período com rótulos Início e Término');
  ok(labels.indexOf('1º tempo começa')>=0 && labels.indexOf('2º tempo termina')>=0, '3: horário com rótulo em cada campo (o valor não fica mais escondido)');
  ok(await p.evaluate(()=>!!document.querySelector('#v-adm-controle .adm-hint')), '3: texto de ajuda explicando os campos');
  // cria uma turma da tarde (aluno é da noite → fica disponível)
  await p.selectOption('#admCtTipo','PATAMO'); await p.fill('#admCtApelido','Turma Falcão');
  await p.selectOption('#admCtConc','pcba');
  await p.fill('#admCtIni','2026-09-01'); await p.fill('#admCtFim','2027-03-01');
  await p.fill('#admCtH1i','14:00'); await p.fill('#admCtH1f','15:30'); await p.fill('#admCtH2f','17:00');
  await p.fill('#admCtPrecoDmn','1500'); await p.fill('#admCtPrecoQdc','1700');
  await p.selectOption('#admCtSala','Sala 3');
  await p.fill('#admCtVagas','100'); await p.fill('#admCtVagasQdc','20');   /* vagas POR MOEDA (dec. 155) */
  await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(300);
  ok(/aberta/.test(await toast(p)) && /100 vagas em Dmn e 20 em QdC/.test(await toast(p)), '3: turma criada (100 Dmn + 20 QdC = 120 totais)');
  await persona(p,'aluno'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(400);
  const nova = await p.evaluate(()=>{ const els=[...document.querySelectorAll('#lojaTurmasCore [data-turma]')]; const el=els.find(x=>/Turma Falcão/.test(x.textContent)); return el?el.textContent:''; });
  ok(/1.500 Dmn ou 1.700 QdC/.test(nova.replace(/ /g,' ')) && /100 Dmn · 20 QdC/.test(nova), '3: turma nova aparece em "Turmas · modalidades do Quad" com preços e vagas');
  await p.context().close();
}

// ===== 4: Mensagens individuais — aluno e professor =====
{ const p = await loginAluno(); await entrarAdmin(p);
  ok(/Comunicação interna · mensagens/.test(await p.evaluate(()=>document.getElementById('v-adm-controle').textContent)), '4: bloco de mensagens presente (hoje "Comunicação interna · mensagens", com públicos — dec. 181)');
  const tipos = await p.evaluate(()=>[...document.querySelectorAll('#admMsgTipo option')].map(o=>o.value));
  ok(tipos.includes('aluno') && tipos.includes('prof'), '4: destinatário aluno OU professor');
  // mensagem ao professor
  await p.selectOption('#admMsgTipo','prof'); await p.waitForTimeout(150);
  await p.selectOption('#admMsgAluno','prof:Cap. Silva');
  await p.fill('#admMsgTexto','Confirme a prova de sexta com a coordenação.'); await p.click('#btnAdmMsg'); await p.waitForTimeout(250);
  ok(/Recado enviado a Cap\. Silva/.test(await toast(p)), '4: recado ao professor enviado');
  ok(/prof\. Cap\. Silva/.test(await p.evaluate(()=>document.getElementById('admMsgList').textContent)), '4: histórico marca "para prof."');
  // professor vê o recado na sala
  await entrarProf(p,'Cap. Silva');
  await p.evaluate(()=>document.querySelector('#navProfessor .nav-btn[data-view="v-prof-chat"]').click()); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('profRecadosCard').style.display!=='none'), '4: card de recados aparece na sala do professor');
  ok(/Confirme a prova de sexta/.test(await p.evaluate(()=>document.getElementById('profRecadosList').textContent)), '4: recado da administração na Recepção');
  ok(await p.evaluate(()=>document.getElementById('v-prof-chat').classList.contains('on')), '4: os recados moram na aba Recepção');
  await p.waitForTimeout(1000);
  // ler marca LIDA no admin
  await entrarAdmin(p); await p.waitForTimeout(200);
  ok(/LIDA/.test(await p.evaluate(()=>document.getElementById('admMsgList').textContent)), '4: recado lido pelo professor vira LIDA no admin');
  // mensagem ao aluno continua indo pro "+"
  await p.selectOption('#admMsgTipo','aluno'); await p.waitForTimeout(150);
  await p.selectOption('#admMsgAluno','eu'); await p.fill('#admMsgTexto','Retire seu material na recepção.'); await p.click('#btnAdmMsg'); await p.waitForTimeout(250);
  await persona(p,'aluno'); await p.waitForTimeout(400);
  ok(await p.evaluate(()=>document.getElementById('plusBadge').style.display!=='none'), '4: mensagem ao aluno acende o contador do "+"');
  await p.context().close();
}

// ===== 5: gift cards — TODOS os QR do lote aparecem (bug dos 20) =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await p.fill('#admGiftQtd','20'); await p.fill('#admGiftValor','1000'); await p.selectOption('#admGiftMoeda','qdc');
  await p.click('#btnAdmGift'); await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('[data-lote="0"]').click()); await p.waitForTimeout(300);
  ok(/20 cartões/.test(await p.evaluate(()=>document.getElementById('admGiftQRs').textContent)), '5: cabeçalho informa 20 cartões');
  await p.evaluate(()=>{ if(document.getElementById('giftQrBtn')) document.getElementById('giftQrBtn').click(); }); await p.waitForTimeout(250);
  const nQr = await p.evaluate(()=>document.querySelectorAll('#admGiftQRs .qr-cell').length);
  ok(nQr===20, '5: "ver completo" mostra os 20 QR codes — '+nQr);
  const uniq = await p.evaluate(()=>new Set([...document.querySelectorAll('#admGiftQRs .qr-cell small')].map(x=>x.textContent)).size);
  ok(uniq===20, '5: 20 códigos distintos');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
