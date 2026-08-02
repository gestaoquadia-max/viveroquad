const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const CORRETAS = [
 'Condicionar direitos individuais em favor do interesse público.',
 'Margem de escolha quanto ao motivo e ao objeto, dentro da lei.',
 'Dar ordens, fiscalizar e rever atos de subordinados.',
 'Vise ao interesse público, sem favorecimentos.',
 'Refiro-me à aluna aprovada.',
 'Faz dois anos que estudo.',
 'Anular seus próprios atos ilegais.',
 '32','R$ 20',
 'A dignidade da pessoa humana.',
 'Saúde, educação e trabalho.',
 'Selecionar a proposta mais vantajosa para a Administração.',
 'Não possui margem de escolha: cumpre o que a lei determina.',
 'Exceção','3ª pessoa do singular.','30',
 'Soldado, apresente-se ao comando.',
 'Moura gerou ponto.',
 'Hierarquia e disciplina.',
 '7 horas'
];
const b=await chromium.launch({executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const c=await b.newContext({viewport:{width:430,height:900},deviceScaleFactor:2});
const p=await c.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'});
await p.evaluate(()=>{ document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(500);
// estado inicial
console.log('início:', await p.evaluate(()=>document.getElementById('homeNome').textContent), '·', await p.evaluate(()=>document.getElementById('xpNum').textContent));
// abre perfil e registra dia de estudo 2x (620→895→1170 ≥ 900)
await p.click('#btnAvatarPerfil'); await p.waitForTimeout(500);
await p.evaluate(()=>document.getElementById('btnDiaEstudo').click()); await p.waitForTimeout(300);
const est1 = await p.evaluate(()=>document.getElementById('progEstado').textContent);
await p.evaluate(()=>document.getElementById('btnDiaEstudo').click()); await p.waitForTimeout(400);
const est2 = await p.evaluate(()=>document.getElementById('progEstado').textContent);
const promoVis = await p.evaluate(()=>document.getElementById('promoBox').style.display);
const chipVis = await p.evaluate(()=>document.getElementById('promoChip').style.display);
console.log('após 1 dia:', est1, '| após 2 dias:', est2, '| promoBox:', promoVis, '| chip home:', chipVis);
// prova de promoção — automática (sem fiscal), questões CERTO/ERRADO
await p.evaluate(()=>document.getElementById('btnProva').click()); await p.waitForTimeout(500);
const semFiscal = !(await p.evaluate(()=>!!document.getElementById('fiscalCode')));
console.log('sem fiscal (abre direto nas questões):', semFiscal ? 'SIM ✓' : 'NÃO ✗');
const nQ = await p.evaluate(()=>window.__prova.qs.length);
console.log('questões sorteadas:', nQ);
// responde as 20 corretamente (o teste sabe o gabarito via window.__prova)
for (let i=0;i<nQ;i++){
  await p.evaluate(()=>{
    const q = window.__prova.qs[window.__prova.idx];
    const alvo = q.c ? 'CERTO' : 'ERRADO';
    const alts=[...document.querySelectorAll('#provaBody .q-alt')];
    (alts.find(a=>a.querySelector('span:last-child').textContent===alvo)||alts[0]).click();
  });
  await p.evaluate(()=>document.getElementById('btnProvaNext').click());
  await p.waitForTimeout(120);
}
await p.waitForTimeout(400);
const resultado = await p.evaluate(()=>document.getElementById('provaBody').textContent.slice(0,140));
console.log('resultado:', resultado.trim().replace(/\s+/g,' '));
await p.evaluate(()=>document.getElementById('btnProvaNext').click()); await p.waitForTimeout(400);
// verificações pós-promoção
const nome = await p.evaluate(()=>document.getElementById('homeNome').textContent);
const rank = await p.evaluate(()=>document.getElementById('rankNome').textContent);
const xp = await p.evaluate(()=>document.getElementById('xpNum').textContent);
const badge = 'removido';
const hist = await p.evaluate(()=>document.getElementById('histCarreira').textContent);
console.log('card:', nome, '|', rank, '| score:', xp, '| patente #', badge);
console.log('histórico contém Soldado Quad:', hist.includes('Soldado Quad')?'SIM ✓':'NÃO ✗');
// trilha
await p.click('#btnPlus'); await p.waitForTimeout(300);
await p.click('#plusPop .plus-row[data-goto="v-perfil"]'); await p.waitForTimeout(400);
const trilha = await p.evaluate(()=>document.getElementById('trilhaList').querySelectorAll('.tr-item.done').length);
console.log('trilha: patentes concluídas =', trilha);
const el=await p.$('.phone'); await el.screenshot({path:new URL('./_out', import.meta.url).pathname + '/gami-trilha.png'});
await p.click('#btnAvatarPerfil'); await p.waitForTimeout(400);
await el.screenshot({path:new URL('./_out', import.meta.url).pathname + '/gami-perfil.png'});
console.log('erros:', errs.length?errs.join(' | '):'nenhum');
await b.close();
