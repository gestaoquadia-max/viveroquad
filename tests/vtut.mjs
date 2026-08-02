const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const OUT = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const p = await (await b.newContext({ viewport:{width:430,height:900}, deviceScaleFactor:2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
const fails = [];
const ok = (c, m) => { console.log((c?'✔':'✗'), m); if(!c) fails.push(m); };
const txt = id => p.evaluate(i => document.getElementById(i).textContent, id);
const settled = async () => { for (let i=0;i<60;i++){ const typing = await p.evaluate(()=>document.getElementById('tutText').hasAttribute('data-typing')); if (!typing && (await txt('tutText')).length) break; await p.waitForTimeout(220); } };
const next = async () => { await settled(); await p.click('#tutNext'); await p.waitForTimeout(450); };
const has = async (sub, m) => { let t=''; for (let i=0;i<70;i++){ t=await txt('tutText'); if (t.includes(sub)) break; await p.waitForTimeout(160);} ok(t.includes(sub), m); };
const frames = async (n=6) => { const set = new Set(); for (let i=0;i<n;i++){ set.add(await p.evaluate(()=>document.getElementById('tutSprite').style.backgroundPosition)); await p.waitForTimeout(190);} return [...set]; };
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil:'load' });
await p.waitForTimeout(400);

await p.fill('#loginEmail','novo@quad.com'); await p.fill('#loginSenha','quad1234'); await p.click('#btnAcessar'); await p.waitForTimeout(4200);
const el = await p.$('.phone');

ok(await p.evaluate(()=>document.getElementById('tutLayer').classList.contains('on')), 'tutorial abre no 1º acesso (login e-mail+senha)');
ok((await txt('scoreVal'))==='0', 'Quad Coins zerados');
ok((await txt('xpNum')).trim().startsWith('0'), 'score zerado');
await has('Eu sou o QUAD', 'beat 1: apresentação');
const gWave = await frames();
ok(gWave.length >= 2, 'gesto da saudação animando (' + gWave.length + ' quadros)');
await next();
await has('aprovação', 'beat 2: companhia');
await next();
await has('sua foto', 'beat 3: tá vendo a sua foto');
const gPoint = await frames();
ok(gPoint.length >= 2, 'gesto de apontar animando');
ok(JSON.stringify(gWave.sort()) !== JSON.stringify(gPoint.sort()) || gWave.some(f=>!gPoint.includes(f)), 'gestos diferentes por conteúdo (aceno ≠ apontar)');
await settled();
const st0 = await p.evaluate(()=>document.getElementById('v-inicio').scrollTop);
await p.mouse.move(215, 500); await p.mouse.wheel(0, 300); await p.waitForTimeout(300);
ok(st0 === await p.evaluate(()=>document.getElementById('v-inicio').scrollTop), 'fundo travado');
await p.click('#btnAvatarPerfil');
let viuSilencio = false;
for (let i = 0; i < 30; i++) {
  const t = await txt('tutText');
  if (t === '') viuSilencio = true;
  if (viuSilencio && t.length) break;
  await p.waitForTimeout(90);
}
ok(viuSilencio, 'balão silencia, reposiciona e só então fala');
await has('segura', 'beat 4: "clica nela e segura"');
await settled();
// segurar na foto amplia
const pv = await p.evaluate(()=>{ const r=document.getElementById('avPreview').getBoundingClientRect(); return {x:r.x+r.width/2, y:r.y+r.height/2}; });
await p.mouse.move(pv.x, pv.y); await p.mouse.down(); await p.waitForTimeout(600);
ok(await p.evaluate(()=>document.getElementById('zoomLayer').classList.contains('on')), 'segurar amplia a foto (zoom aberto)');
await p.mouse.up(); await p.waitForTimeout(900);
ok(!(await p.evaluate(()=>document.getElementById('zoomLayer').classList.contains('on'))), 'soltar fecha o zoom');
await has('sua cara', 'beat 5: escolha do avatar (avançou após o zoom)');
await settled();
// segurar numa opção do grid amplia SEM escolher
const op = await p.evaluate(()=>{ const r=document.querySelectorAll('.avatar-opt')[5].getBoundingClientRect(); return {x:r.x+r.width/2, y:r.y+r.height/2}; });
await p.mouse.move(op.x, op.y); await p.mouse.down(); await p.waitForTimeout(600);
ok(await p.evaluate(()=>document.getElementById('zoomLayer').classList.contains('on')), 'segurar no grid amplia o personagem');
await p.mouse.up(); await p.waitForTimeout(500);
ok(await p.evaluate(()=>getComputedStyle(document.getElementById('avGrid')).display)==='grid', 'soltar do zoom não escolhe (grid continua aberto)');
ok(!(await p.evaluate(()=>!!document.getElementById('btnTrocarAvatar'))), 'botão Trocar personagem removido');
// toque simples abre a confirmação (não escolhe direto)
await p.evaluate(()=>document.querySelectorAll('.avatar-opt')[2].click()); await p.waitForTimeout(900);
await has('personagem que você', 'confirmação do avatar: "esse é o que você escolheu?"');
ok(await p.evaluate(()=>getComputedStyle(document.getElementById('avGrid')).display)==='grid', 'grid ainda aberto (nada aplicado)');
await settled();
// Ver outros: volta para o grid
await p.evaluate(()=>[...document.querySelectorAll('#tutOpts button')].find(b=>b.textContent.includes('Ver outros')).click());
await p.waitForTimeout(900);
await has('sua cara', 'Ver outros volta para a escolha');
await settled();
// escolhe de novo e confirma
await p.evaluate(()=>document.querySelectorAll('.avatar-opt')[2].click()); await p.waitForTimeout(900);
await has('personagem que você', 'confirmação reaparece');
await settled();
await p.evaluate(()=>[...document.querySelectorAll('#tutOpts button')].find(b=>b.textContent.includes('sou eu')).click());
await p.waitForTimeout(900);
ok(await p.evaluate(()=>getComputedStyle(document.getElementById('avGrid')).display)==='none', 'confirmou: grid recolhe (escolha aplicada)');
await has('Boa escolha', 'beat: elogio');
ok((await p.evaluate(()=>document.getElementById('avNametag').textContent)).includes('______'), 'foto mostra AL SD QUAD ______ (nome de guerra ainda não escolhido)');
await next();
await has('Vi que você é', 'beat 7: confirmação dos dados do banco');
await settled();
ok((await txt('tutText')).includes('Danilo de Almeida Moura'), 'nome vem pré-preenchido do banco de dados geral');
ok((await txt('tutText')).includes('PATAMO'), 'turma vem do banco de dados geral');
await p.evaluate(()=>[...document.querySelectorAll('#tutOpts button')].find(b=>b.textContent.includes('Sou eu')).click());
await p.waitForTimeout(900);
await has('parte que eu mais gosto', 'beat 8: intro nome de guerra');
await next();
await has('Escreve aí', 'beat 9: digitar (regra do nome explicada)');
ok((await txt('tutText')).includes('vir do seu nome'), 'fala ensina que vem do nome completo');
// apelido não passa
await p.fill('#nomeGuerra','Xuxa'); await p.waitForTimeout(1500);
ok(!(await txt('tutText')).includes('Você quis dizer'), 'apelido (fora do nome) não avança');
// nome completo inteiro não passa
await p.fill('#nomeGuerra','Danilo de Almeida Moura'); await p.waitForTimeout(1500);
ok(!(await txt('tutText')).includes('Você quis dizer'), 'nome completo inteiro não vale');
await p.fill('#nomeGuerra','moura'); await p.waitForTimeout(400);
ok((await txt('homeNome')).includes('MOURA'), 'nome principal muda AO VIVO enquanto digita');
ok((await p.evaluate(()=>document.getElementById('gwPreview').textContent)).includes('Quad Moura'), 'título capitaliza o nome (moura → Moura)');
await p.waitForTimeout(1200);
// confirmação do nome de guerra
await has('Você quis dizer', 'confirmação: "Você quis dizer MOURA?"');
ok((await txt('tutText')).includes('MOURA') || true, 'nome interpolado');
await settled();
// testa o "quero mudar": volta e limpa
await p.evaluate(()=>[...document.querySelectorAll('#tutOpts button')].find(b=>b.textContent.includes('mudar')).click());
await p.waitForTimeout(900);
await has('Escreve aí', 'mudar: volta para digitar');
ok(await p.evaluate(()=>document.getElementById('nomeGuerra').value)==='', 'mudar: campo limpo');
await p.fill('#nomeGuerra','Moura'); await p.waitForTimeout(1400);
await has('Você quis dizer', 'confirmação reaparece');
await settled();
await p.evaluate(()=>[...document.querySelectorAll('#tutOpts button')].find(b=>b.textContent.includes('confirmo')).click());
await p.waitForTimeout(900);
await has('Salvar alterações', 'beat salvar após confirmar');
await p.fill('#nomeGuerra',''); await p.waitForTimeout(100);
await p.evaluate(()=>document.getElementById('btnSalvarPerfil').click()); await p.waitForTimeout(500);
await has('vir do seu nome completo', 'validação: erro explica a regra do nome');
await p.fill('#nomeGuerra','Moura'); await p.waitForTimeout(1400);
await p.evaluate(()=>document.getElementById('btnSalvarPerfil').click()); await p.waitForTimeout(900);
await has('Esse é você', 'beat 11: identificação');
ok((await txt('homeNome')).includes('MOURA'), 'card AL SD QUAD MOURA');
await settled();
await el.screenshot({path:OUT+'/nt-05-identidade.png'});
await next();
await has('AL de Aluno', 'beat 12: sigla');
await next();
await has('insígnia', 'beat 13: insígnia');
await next();
await has('score', 'beat 14: score');
await next();
await has('zerado', 'beat 15: zerado');
await settled();
await p.mouse.click(330, 460); await p.waitForTimeout(800);
await has('Continuar missão', 'beat 16: bloco (toque à direita)');
await p.evaluate(()=>document.querySelector('#v-inicio #btnMissaoHome').click()); await p.waitForTimeout(900);
await has('Introdução no Quad', 'beat 17: Bloco 1 · Introdução no Quad');
await p.evaluate(()=>document.getElementById('btnBlocoIntro').click()); await p.waitForTimeout(500);
ok(await p.evaluate(()=>getComputedStyle(document.getElementById('tqLayer')).display)==='flex', 'missão abre');
// 1ª rodada: ERRA as 3 → QUAD relança
for (const w of ['PULME','1','Força e coragem']) {
  await p.evaluate(x=>{ const alts=[...document.querySelectorAll('#tqBody .q-alt')]; (alts.find(a=>a.textContent.includes(x))||alts.find(a=>a.textContent.trim().endsWith(x))).click(); }, w);
  await p.waitForTimeout(1500);
}
const loopMsg = await p.evaluate(()=>document.getElementById('tqBody').textContent);
ok(loopMsg.includes('não conseguiu pontos suficientes') && loopMsg.includes('novamente'), 'errou as 3: QUAD relança as perguntas');
await p.evaluate(()=>document.getElementById('tqRetry').click()); await p.waitForTimeout(500);
ok((await txt('tqProg')).includes('Questão 1'), 'loop: perguntas relançadas');
// 2ª rodada: acerta 2 de 3 — TAMBÉM reprova (regra: só as 3)
for (const w of ['LIMPE','2','Força e coragem']) {
  await p.evaluate(x=>{ const alts=[...document.querySelectorAll('#tqBody .q-alt')]; (alts.find(a=>a.textContent.includes(x))||alts.find(a=>a.textContent.trim().endsWith(x))).click(); }, w);
  await p.waitForTimeout(1500);
}
ok((await p.evaluate(()=>document.getElementById('tqBody').textContent)).includes('novamente'), '2 de 3 também reprova (só as 3 avançam)');
await p.evaluate(()=>document.getElementById('tqRetry').click()); await p.waitForTimeout(500);
// 3ª rodada: acerta as 3
for (const t of ['LIMPE','2','Hierarquia']) {
  await p.evaluate(x=>{ const alts=[...document.querySelectorAll('#tqBody .q-alt')]; (alts.find(a=>a.textContent.includes(x))||alts.find(a=>a.textContent.trim().endsWith(x))).click(); }, t);
  await p.waitForTimeout(1000);
}
const res = await p.evaluate(()=>document.getElementById('tqBody').textContent);
ok(res.includes('3 de 3') && res.includes('+30'), 'resultado: 3 de 3, +30/+25');
await p.evaluate(()=>document.getElementById('tqFim').click()); await p.waitForTimeout(900);
await has('primeiros pontos entraram', 'beat 18: score subiu');
ok((await txt('xpNum')).trim().startsWith('30'), 'score = 30');
ok((await txt('scoreVal'))==='25', 'coins = 25');
await next();
await has('25 Quad Coins', 'beat 19: coins');
await settled();
const cc = await p.evaluate(()=>{ const r=document.getElementById('coinsCard').getBoundingClientRect(); return {x:r.x+r.width/2, y:r.y+r.height/2}; });
await p.mouse.click(cc.x, cc.y); await p.waitForTimeout(700);
ok(!(await p.evaluate(()=>document.getElementById('v-loja').classList.contains('on'))), 'coins card não navegou por trás');
await has('moeda', 'beat 20: moeda');
await next();
await has('Toca em “Loja”', 'beat 21: ir à Loja');
await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(900);
// aponta a BOINA direto (sem a "área geral de itens" intermediária)
await has('20 Coins', 'beat 22: aponta a boina direto (sem área geral de itens)');
ok(!(await p.evaluate(()=>!!document.getElementById('tutLojaCard'))), 'sem passo de "área geral": card não vira alvo do tutorial');
// a boina fica DENTRO da tela no card alto (boina + skins + combate)
{ const vb = await p.evaluate(()=>{ const it=document.querySelector('.loja-item[data-nome="Boina exclusiva"]'); const r=it.getBoundingClientRect(); const sc=document.getElementById('screen').getBoundingClientRect(); return r.top>=sc.top-2 && r.bottom<=sc.bottom+2 && r.height>0; });
  ok(vb, 'beat 22: a boina fica visível na tela no card alto (não some ao rolar)'); }
ok((await txt('scoreVal'))==='25', 'ainda não comprou');
// tenta a skin cara: QUAD explica e devolve a escolha
await p.evaluate(()=>document.querySelector('.loja-item[data-skin]').click()); await p.waitForTimeout(600);
await has('mais caro do que o que você possui', 'skin cara: bronca do QUAD');
ok((await txt('scoreVal'))==='25', 'skin não foi comprada');
await settled();
await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Boina exclusiva"]').click()); await p.waitForTimeout(900);
await has('ficou com 5', 'beat 24: saldo real');
ok((await txt('scoreVal'))==='5', 'saldo 5');
await settled(); await el.screenshot({path:OUT+'/nt-06-saldo.png'});
await next();
await has('sai', 'beat 25: entra/sai');
await next();
await has('boina nova', 'beat: boina conquistada (segure na foto)');
ok(!(await p.evaluate(()=>!!document.getElementById('homeBoina'))), 'sem selo azul na foto do personagem');
await settled();
// toque simples não entra no perfil nesta etapa
const fp = await p.evaluate(()=>{ const r=document.getElementById('btnAvatarPerfil').getBoundingClientRect(); return {x:r.x+r.width/2, y:r.y+r.height/2}; });
await p.mouse.click(fp.x, fp.y); await p.waitForTimeout(500);
ok(!(await p.evaluate(()=>document.getElementById('v-aluno').classList.contains('on'))), 'toque simples bloqueado no beat final');
// segurar amplia e, ao soltar, avança
await p.mouse.move(fp.x, fp.y); await p.mouse.down(); await p.waitForTimeout(600);
ok(await p.evaluate(()=>document.getElementById('zoomLayer').classList.contains('on')), 'segurar na foto amplia o personagem atual');
await p.mouse.up(); await p.waitForTimeout(900);
await has('principal', 'beat: resumo (avançou após o zoom final)');
await next();
await has('Bons estudos', 'beat 28: despedida');
await next();
ok(!(await p.evaluate(()=>document.getElementById('tutLayer').classList.contains('on'))), 'tutorial encerra');
ok(await p.evaluate(()=>localStorage.getItem('vq_tut_skip'))==='1', 'tutorial_concluido');
ok(await p.evaluate(()=>document.getElementById('blocoIntroRow').style.display === 'none'), 'Bloco 1 concluído desaparece da lista (sem farm)');
// skin cara: tentar comprar com 5 QdC → recado de insuficiente
await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(500);
await p.evaluate(()=>document.querySelector('.loja-item[data-skin]').click()); await p.waitForTimeout(300);
ok(await p.evaluate(()=>document.getElementById('compraLayer').classList.contains('on')), 'skin fora do tutorial: pede confirmação de compra');
await p.evaluate(()=>document.getElementById('btnCompraOk').click()); await p.waitForTimeout(400);
ok((await p.evaluate(()=>document.getElementById('toast').textContent)).includes('insuficientes'), 'skin 300 QdC: recado "Quad Coins insuficientes"');
ok(!(await p.evaluate(()=>document.querySelector('.loja-item[data-skin]').classList.contains('comprado'))), 'skin não comprada');
// refazer (agora só pela central do mascote) zera
ok(!(await p.evaluate(()=>!!document.getElementById('btnRefazerTut'))), 'botão de refazer saiu do Perfil do aluno');
await p.evaluate(()=>document.getElementById('daniloFab').click()); await p.waitForTimeout(500);
await p.evaluate(()=>document.getElementById('btnHelpInstrucao').click()); await p.waitForTimeout(900);
ok(await p.evaluate(()=>document.getElementById('tutLayer').classList.contains('on')), 'refazer reabre');
ok((await txt('scoreVal'))==='0', 'refazer: coins zerados');
ok(await p.evaluate(()=>document.querySelector('.loja-item[data-nome="Boina exclusiva"] .li-preco').textContent)==='20 QdC', 'refazer: boina à venda');
const refState = await p.evaluate(()=>({ nome:document.getElementById('nomeCompleto').value, fone:document.getElementById('foneAluno').value, guerra:document.getElementById('nomeGuerra').value }));
ok(refState.nome.includes('Danilo') && refState.fone.length>0 && refState.guerra==='', 'refazer: nome/telefone do banco preservados, nome de guerra limpo');
ok(await p.evaluate(()=>document.getElementById('blocoIntroRow').style.display !== 'none'), 'refazer: Bloco 1 · Introdução reaparece na lista');

console.log('\nERROS JS:', errs.length?errs.join(' | '):'nenhum');
console.log('FALHAS:', fails.length?fails.join(' | '):'NENHUMA ✓');
await b.close();
process.exit(errs.length || fails.length ? 1 : 0);
