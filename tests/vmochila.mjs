const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const errors=[], log=[];
const browser = await chromium.launch({ executablePath:process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const p = await (await browser.newContext({viewport:{width:430,height:900},deviceScaleFactor:2})).newPage();
p.on('pageerror',e=>errors.push('pageerror: '+e.message));
await p.goto(new URL('../index.html', import.meta.url).href,{waitUntil:'load'});
await p.evaluate(()=>document.getElementById('loginLayer').classList.add('off')); await p.waitForTimeout(400);

// 1: Loja tem os itens de combate
await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(400);
const nComb = await p.evaluate(()=>document.querySelectorAll('#combatGrid [data-combate]').length);
if (nComb!==6) errors.push('1: itens de combate na Loja: '+nComb);
else log.push('✔ 1: Loja tem 6 itens de combate (armas, broches, utilitários)');

// 2: a área de ESCOLHA de personagem não aparece no perfil (travada)
await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-inicio"]').click()); await p.waitForTimeout(200);
await p.evaluate(()=>document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(400);
const gridVis = await p.evaluate(()=>getComputedStyle(document.getElementById('avGrid')).display);
if (gridVis!=='none') errors.push('2: grade de escolha de personagem visível no perfil: '+gridVis);
const temMochilaBtn = await p.evaluate(()=>!!document.getElementById('btnMochila'));
if (!temMochilaBtn) errors.push('2: botão da mochila ausente');
log.push('✔ 2: escolha de personagem travada (grade oculta) e mochila no lugar');

// 3: mochila abre vazia
await p.evaluate(()=>document.getElementById('btnMochila').scrollIntoView({block:'center'})); await p.waitForTimeout(200);
await p.evaluate(()=>document.getElementById('btnMochila').click()); await p.waitForTimeout(400);
if (!await p.evaluate(()=>document.getElementById('storageLayer').classList.contains('on'))) errors.push('3: mochila não abriu');
const vazios = await p.evaluate(()=>document.querySelectorAll('#storageGrid .st-slot.vazio').length);
const cheios0 = await p.evaluate(()=>document.querySelectorAll('#storageGrid .st-slot.cheio').length);
if (cheios0!==0 || vazios<9) errors.push('3: storage inicial: cheios '+cheios0+' vazios '+vazios);
const quest = await p.evaluate(()=>/Quests em breve/i.test(document.getElementById('storageLayer').textContent));
if (!quest) errors.push('3: aviso de quests ausente');
await p.locator('.phone').first().screenshot({path:'mochila-vazia.png'});
log.push('✔ 3: mochila abre vazia, com slots e aviso de quests futuras');
await p.evaluate(()=>document.getElementById('btnStorageFechar').click()); await p.waitForTimeout(200);

// 4: comprar itens de combate → vão para a mochila e o saldo debita
const saldo0 = await p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(300);
await p.evaluate(()=>document.querySelector('#combatGrid [data-combate="faca"]').click()); await p.waitForTimeout(300); await p.evaluate(()=>{ var b=document.getElementById("btnCompraOk"); if(document.getElementById("compraLayer").classList.contains("on")) b.click(); }); await p.waitForTimeout(300);
await p.evaluate(()=>document.querySelector('#combatGrid [data-combate="broche"]').click()); await p.waitForTimeout(300); await p.evaluate(()=>{ var b=document.getElementById("btnCompraOk"); if(document.getElementById("compraLayer").classList.contains("on")) b.click(); }); await p.waitForTimeout(300);
const saldo1 = await p.evaluate(()=>parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g,''),10));
if (saldo0 - saldo1 !== 65) errors.push('4: débito errado (faca 40 + broche 25 = 65): '+(saldo0-saldo1));
/* dec. 172: item de combate NÃO é de compra única — fica na vitrine e
   mostra quantas unidades o aluno já tem */
const naLoja = await p.evaluate(()=>document.querySelectorAll('#combatGrid [data-combate]').length);
if (naLoja !== nComb) errors.push('4: item de combate deve continuar na vitrine ('+nComb+' esperados, '+naLoja+' na tela)');
const etiqFaca = await p.evaluate(()=>{ const c=document.querySelector('#combatGrid [data-combate="faca"]'); const e=c&&c.querySelector('.li-estoque'); return e?e.textContent:''; });
if (!/1 na mochila/.test(etiqFaca)) errors.push('4: item comprado deveria marcar quantas unidades tem ("'+etiqFaca+'")');
log.push('✔ 4: comprar Faca (40) + Broche (25) debita 65 QdC e os dois seguem à venda, marcados');

// 5: mochila agora mostra os 2 itens
await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-inicio"]').click()); await p.waitForTimeout(200);
await p.evaluate(()=>document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(300);
const qtd = await p.evaluate(()=>document.getElementById('mochilaQtd').textContent);
if (!/2 itens/.test(qtd)) errors.push('5: contador da mochila: '+qtd);
await p.evaluate(()=>document.getElementById('btnMochila').click()); await p.waitForTimeout(300);
const cheios = await p.evaluate(()=>document.querySelectorAll('#storageGrid .st-slot.cheio').length);
if (cheios!==2) errors.push('5: itens guardados na storage: '+cheios);
const nomes = await p.evaluate(()=>[...document.querySelectorAll('#storageGrid .st-nome')].map(n=>n.textContent));
if (!nomes.includes('Faca tática')||!nomes.includes('Broche de mérito')) errors.push('5: itens errados: '+nomes.join(','));
await p.locator('.phone').first().screenshot({path:'mochila-cheia.png'});
log.push('✔ 5: mochila mostra Faca e Broche guardados (2 itens)');

// 6: dec. 172 — o item de combate se repete: comprar de novo empilha
await p.evaluate(()=>document.getElementById('btnStorageFechar').click()); await p.waitForTimeout(200);
await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-loja"]').click()); await p.waitForTimeout(300);
const naVitrine = await p.evaluate(()=>!!document.querySelector('#combatGrid [data-combate="faca"]'));
if (!naVitrine) errors.push('6: item de combate deveria continuar à venda');
await p.evaluate(()=>document.querySelector('#combatGrid [data-combate="faca"]').click()); await p.waitForTimeout(300);
await p.evaluate(()=>{ var b=document.getElementById("btnCompraOk"); if(document.getElementById("compraLayer").classList.contains("on")) b.click(); }); await p.waitForTimeout(350);
const etiq2 = await p.evaluate(()=>{ const c=document.querySelector('#combatGrid [data-combate="faca"]'); const e=c&&c.querySelector('.li-estoque'); return e?e.textContent:''; });
if (!/2 na mochila/.test(etiq2)) errors.push('6: 2ª compra deveria empilhar ("'+etiq2+'")');
await p.evaluate(()=>document.querySelector('#navAluno .nav-btn[data-view="v-inicio"]').click()); await p.waitForTimeout(200);
await p.evaluate(()=>document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('btnMochila').click()); await p.waitForTimeout(300);
const cheios2 = await p.evaluate(()=>document.querySelectorAll('#storageGrid .st-slot.cheio').length);
if (cheios2 !== 3) errors.push('6: a mochila deveria ter 3 unidades, tem '+cheios2);
const semUndef = await p.evaluate(()=>!/undefined/.test(document.getElementById('storageGrid').textContent));
if (!semUndef) errors.push('6: slot da mochila imprimiu "undefined" no lugar do sinal');
log.push('✔ 6: item de combate se repete — 2 facas + 1 broche na mochila, item segue à venda');

await browser.close();
console.log(log.join('\n'));
if (errors.length){ console.log('\nERROS:\n'+errors.join('\n')); process.exit(1); }
console.log('\nMOCHILA-OK');
