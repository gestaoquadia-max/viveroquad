const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
import fs from 'node:fs';
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
fs.writeFileSync(OUT + '/arvore-gcm.pdf', '%PDF-1.4 arvore GCM');
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
const turmaTxt = (p,id) => p.evaluate(x=>{ const el=document.querySelector('[data-turma="'+x+'"]'); return el?el.textContent:''; }, id);

// ===== 1: vitrine — item único com vagas por moeda; PATAMO=matriculado; noite bloqueada; Vaga QdC extinto =====
{ const p = await loginAluno(); await nav(p,'v-loja'); await p.waitForTimeout(400);
  ok(!await p.evaluate(()=>!!document.querySelector('.loja-item[data-nome="Turma presencial"]')), '1: item avulso "Vaga Quad Coin" extinto');
  ok(/MATRICULADO/.test(await turmaTxt(p,'patamo-n')), '1: PATAMO Noite marcada MATRICULADO (turma do aluno)');
  const ron = await turmaTxt(p,'rondesp-n');
  ok(/INDISPONÍVEL/.test(ron) && /145 Dmn · 10 QdC/.test(ron), '1: RONDESP Noite INDISPONÍVEL com vagas por moeda no item');
  await p.evaluate(()=>document.querySelector('[data-turma="rondesp-n"]').click()); await p.waitForTimeout(250);
  ok(/já estuda no turno da noite/.test(await toast(p)) && /Turma PATAMO/.test(await toast(p)), '1: clique explica o bloqueio de turno ('+(await toast(p)).slice(0,60)+'…)');
  const man = await turmaTxt(p,'rondesp-m');
  ok(/600 Dmn ou 700 QdC/.test(man.replace(/ /g,' ')) && /54 Dmn · 6 QdC/.test(man), '1: turma da manhã disponível com os DOIS preços e vagas');
  await p.context().close();
}

// ===== 2: matrícula — pop-up de moeda, débito, vagas, bloqueio do turno da manhã =====
{ const p = await loginAluno(); await nav(p,'v-loja'); await p.waitForTimeout(400);
  await p.evaluate(()=>document.querySelector('[data-turma="rondesp-m"]').click()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('turmaLayer').classList.contains('on')), '2: pop-up de escolha da moeda abre');
  const opts = await p.evaluate(()=>({ dmn: document.getElementById('btnTuDmn').textContent, qdc: document.getElementById('btnTuQdc').textContent }));
  ok(/600 Dmn/.test(opts.dmn) && /54 vagas/.test(opts.dmn) && /700 QdC/.test(opts.qdc) && /6 vagas/.test(opts.qdc), '2: opções mostram preço e vagas por moeda');
  const q0 = await p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
  await p.evaluate(()=>document.getElementById('btnTuQdc').click()); await p.waitForTimeout(400);
  const q1 = await p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
  ok(q0-q1===700, '2: matrícula em QdC debitou 700 ('+q0+'→'+q1+')');
  const dep = await turmaTxt(p,'rondesp-m');
  ok(/MATRICULADO/.test(dep) && /54 Dmn · 5 QdC/.test(dep), '2: vaga QdC decrementou (6→5) e virou MATRICULADO');
  ok(/INDISPONÍVEL/.test(await turmaTxt(p,'bope-m')), '2: outra turma da manhã ficou INDISPONÍVEL (turno ocupado)');
  ok(/PATAMO/.test(await p.evaluate(()=>document.getElementById('cardTurma').textContent)), '2: turma principal do Início segue a primeira matrícula (PATAMO)');
  await p.context().close();
}

// ===== 3: sem matrícula ativa — funções bloqueadas até nova turma =====
{ const p = await loginAluno();
  await p.evaluate(()=>window.__mat.encerrar()); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('matLayer').classList.contains('on')), '3: aviso "Matrícula encerrada" aparece');
  await p.evaluate(()=>document.getElementById('btnMatOk').click()); await p.waitForTimeout(200);
  await nav(p,'v-missoes'); await p.waitForTimeout(250);
  ok(/Funções bloqueadas/.test(await toast(p)), '3: Missões bloqueadas sem matrícula');
  ok(!await p.evaluate(()=>document.getElementById('v-missoes').classList.contains('on')), '3: não navegou para Missões');
  await nav(p,'v-loja'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('v-loja').classList.contains('on')), '3: Quad Store permanece acessível');
  // sem matrícula, TODAS as turmas ficam compráveis (nenhum turno ocupado)
  ok(/1.800 Dmn|1\.800/.test(await turmaTxt(p,'rondesp-n')), '3: turmas da noite voltam a ficar disponíveis');
  // resgata gift p/ saldo e matricula em Dmn → app destrava
  await p.fill('#giftCode','QUAD-500'); await p.click('#btnGift'); await p.waitForTimeout(250);
  await p.evaluate(()=>document.querySelector('[data-turma="rondesp-m"]').click()); await p.waitForTimeout(300);
  await p.evaluate(()=>document.getElementById('btnTuDmn').click()); await p.waitForTimeout(400);
  await nav(p,'v-missoes'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.getElementById('v-missoes').classList.contains('on')), '3: nova matrícula destrava o app');
  // primeira matrícula nova virou a turma do app (RONDESP manhã · Soldado)
  ok(/RONDESP/.test(await p.evaluate(()=>document.getElementById('cardTurma').textContent)), '3: turma do Início virou a RONDESP (M)');
  await nav(p,'v-dominio'); await p.waitForTimeout(300);
  ok(/Soldado/.test(await p.evaluate(()=>document.getElementById('domConcurso').textContent)), '3: Domínio seguiu o concurso da nova turma (PM-BA Soldado)');
  await p.context().close();
}

// ===== 4: Controle — criação de turmas completa =====
{ const p = await loginAluno(); await entrarAdmin(p); await p.waitForTimeout(300);
  const card = await p.evaluate(()=>document.getElementById('v-adm-controle').textContent);
  ok(/Criação de turmas e isoladas · matrícula e vagas/.test(card), '4: card de criação no Painel de controle');
  const focos = await p.evaluate(()=>[...document.querySelectorAll('#admCtConc option')].map(o=>o.textContent).join('|'));
  ok(/PM-BA/.test(focos) && /Polícia Civil/.test(focos) && /Polícia Rodoviária Federal/.test(focos) && /Polícia Penal/.test(focos) && /Fronteiras/.test(focos), '4: os concursos do seletor são os da Estrutura (dec. 139)');
  // professores por matéria seguem a árvore do concurso
  await p.selectOption('#admCtConc','cfo'); await p.waitForTimeout(200);
  const nCfo = await p.evaluate(()=>document.querySelectorAll('#admCtProfs [data-ct-prof]').length);
  ok(nCfo===13, '4: CFO lista 13 matérias da árvore, cada uma com professor ('+nCfo+')');
  /* dec. 139: os concursos oferecidos SÃO os da Estrutura — não existe
     mais opção sem árvore de edital caindo calada nas matérias básicas */
  const semArvore = await p.evaluate(()=>[...document.querySelectorAll('#admCtConc option')]
    .map(o=>o.value).filter(v=>!window.__arvoreDe(v)));
  ok(semArvore.length===0, '4: todo concurso oferecido tem árvore de edital (sem fallback mudo)');
  // vagas QdC > gerais barrado
  await p.selectOption('#admCtTipo','BOPE'); await p.fill('#admCtApelido','Turma Águia');
  await p.fill('#admCtIni','2026-08-10'); await p.fill('#admCtFim','2027-02-10');
  await p.fill('#admCtH1i','14:00'); await p.fill('#admCtH1f','15:30'); await p.fill('#admCtH2f','17:00');
  await p.fill('#admCtPrecoDmn','900'); await p.fill('#admCtPrecoQdc','1000');
  await p.selectOption('#admCtSala','Sala 3');
  await p.selectOption('#admCtSala','Sala 3');
  /* dec. 155: os campos são as vagas DE CADA MOEDA — vagas negativas são o erro */
  await p.fill('#admCtVagas','-1'); await p.fill('#admCtVagasQdc','5');
  await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(250);
  ok(/negativas/.test(await p.evaluate(()=>document.getElementById('admCtErro').textContent)), '4: vaga negativa é barrada (aviso fixo no bloco)');
  await p.fill('#admCtVagas','45');
  await p.setInputFiles('#admCtArvore', OUT+'/arvore-gcm.pdf');
  await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(300);
  ok(/aberta/.test(await toast(p)) && /45 vagas em Dmn e 5 em QdC/.test(await toast(p)), '4: turma aberta com split de vagas (45 Dmn + 5 QdC)');
  const li = await p.evaluate(()=>document.getElementById('admCtLista').textContent);
  ok(/Turma Águia/.test(li) && /Turma de questões/.test(li) && /tarde/.test(li) && /900 Dmn\/1.000 QdC/.test(li.replace(/ /g,' ')) && /edital anexado/.test(li), '4: lista mostra tipo, turno lido do horário, preços e anexo');
  // reflete na Estrutura
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(200);
  await p.evaluate(()=>document.getElementById('btnIrEstrutura').click()); await p.waitForTimeout(300);
  ok(/Turma Águia/.test(await p.evaluate(()=>document.getElementById('admTurmaList').textContent)), '4: turma nova aparece na Estrutura');
  // e na Quad Store do aluno (tarde → disponível, pois aluno é da noite)
  await persona(p,'aluno'); await p.waitForTimeout(300);
  await nav(p,'v-loja'); await p.waitForTimeout(300);
  const nova = await p.evaluate(()=>{ const els=[...document.querySelectorAll('[data-turma]')]; const el=els.find(x=>/Turma Águia/.test(x.textContent)); return el?el.textContent:''; });
  ok(/900 Dmn ou 1.000 QdC/.test(nova.replace(/ /g,' ')) && /45 Dmn · 5 QdC/.test(nova), '4: turma nova na Quad Store com dois preços e vagas por moeda');
  // Painel interno NÃO tem mais o card de criação
  await entrarAdmin(p); await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-hoje"]').click()); await p.waitForTimeout(200);
  ok(!/Criação de turmas/.test(await p.evaluate(()=>document.getElementById('v-adm-hoje').textContent)), '4: criação saiu do Painel interno');
  await p.context().close();
}

// ===== 5: cadastrar produto sem a categoria turmas =====
{ const p = await loginAluno(); await entrarAdmin(p);
  await p.evaluate(()=>document.querySelector('#navAdmin .nav-btn[data-view="v-adm-loja"]').click()); await p.waitForTimeout(300);
  const cats = await p.evaluate(()=>[...document.querySelectorAll('#admProdCat option')].map(o=>o.value));
  ok(!cats.some(c=>/turma|isolada|simulado|evento|personagem|combate/i.test(c)) && cats.includes('dig:cursos') && cats.includes('pres:outros'), '5: cadastro de produtos só oferece o que ele mesmo cria ('+cats.join(',')+')');
  ok(/Criação de turmas e isoladas/.test(await p.evaluate(()=>document.getElementById('v-adm-loja').textContent)), '5: aba Loja aponta a criação de turmas para o bloco certo');
  await p.context().close();
}

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
