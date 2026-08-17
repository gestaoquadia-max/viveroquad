/* vz6 — dec. 216: MINHA LOJA e MERCADO INTERNO. O aluno abre a própria
   loja pelo menu "+", anuncia itens da mochila com preço em Quad Coins e
   abre/fecha a vitrine. Na Quad Store, o bloco "Mercado interno" lista as
   lojas dos alunos: entra na loja, junta no carrinho, finaliza — o valor
   sai em QdC e os itens caem na mochila. Diamante não circula aqui.   */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const b = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
const p = await c.newPage();
const erros = [];
p.on('pageerror', e => erros.push('JS: ' + e.message));
let ok = 0; const falhas = [];
const t = (nome, cond) => { if (cond) ok++; else falhas.push(nome); };
const nav = v => p.evaluate(x => document.querySelector('#navAluno .nav-btn[data-view="' + x + '"]').click(), v);
const qdc = () => p.evaluate(() => parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g, ''), 10));
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });
const abreMinhaLoja = async () => {
  await p.evaluate(() => { document.getElementById('plusPop').classList.remove('on'); document.querySelector('#plusPop [data-goto="v-minha-loja"]').click(); });
  await p.waitForTimeout(500);
};
const abreMochila = async () => {
  await nav('v-inicio'); await p.waitForTimeout(200);
  await p.evaluate(() => document.getElementById('btnAvatarPerfil').click()); await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('btnMochila').click()); await p.waitForTimeout(300);
};
const ligasNaMochila = () => p.evaluate(() => {
  const o = [...document.querySelectorAll('#mlItem option')].find(x => /Liga metálica/.test(x.textContent));
  return o ? parseInt(o.textContent.replace(/\D/g, ''), 10) : 0;
});

await p.addInitScript(() => {
  try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {}
  window.__dropRng = () => 0.999;
});
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);

/* ============ MINHA LOJA ABRE PELO "+" ============ */
t('o menu "+" tem a entrada Minha loja',
  await p.evaluate(() => !!document.querySelector('#plusPop [data-goto="v-minha-loja"]')));
await abreMinhaLoja();
t('a tela Minha loja abre', await p.evaluate(() => document.getElementById('v-minha-loja').classList.contains('on')));
t('a loja nasce com nome sugerido a partir do nome de guerra',
  await p.evaluate(() => /Arsenal do Moura/.test(document.getElementById('mlTitulo').textContent)));
t('o seletor lista o que está na mochila, com a quantidade',
  await p.evaluate(() => /Liga metálica · 19 na mochila/.test(document.getElementById('mlItem').textContent)));
t('a vitrine começa vazia, explicando o que fazer',
  await p.evaluate(() => /Nenhum item anunciado/.test(document.getElementById('mlVitrine').textContent)));
t('e não há vendas ainda', await p.evaluate(() => /Nenhuma venda ainda/.test(document.getElementById('mlVendas').textContent)));

/* ============ A LOJA NÃO ABRE VAZIA ============ */
await p.evaluate(() => document.getElementById('btnMlAbrir').click());
await p.waitForTimeout(300);
t('não dá para abrir a loja sem nenhum anúncio',
  await p.evaluate(() => !window.__mercado().minha.aberta &&
                         /Anuncie ao menos um item/.test(document.getElementById('toast').textContent)));

/* ============ ANUNCIAR: VALIDA E RESERVA DA MOCHILA ============ */
await set('mlItem', 'liga');
await set('mlQtd', '99'); await set('mlPreco', '20');
await p.evaluate(() => document.getElementById('btnMlAnunciar').click());
await p.waitForTimeout(250);
t('não dá para anunciar mais unidades do que se tem',
  await p.evaluate(() => /Você tem 19 unidades/.test(document.getElementById('mlErro').textContent)));
await set('mlQtd', '5'); await set('mlPreco', '');
await p.evaluate(() => document.getElementById('btnMlAnunciar').click());
await p.waitForTimeout(250);
t('nem sem preço', await p.evaluate(() => /Informe o preço/.test(document.getElementById('mlErro').textContent)));
await set('mlPreco', '20');
await p.evaluate(() => document.getElementById('btnMlAnunciar').click());
await p.waitForTimeout(350);
t('anunciado: a vitrine mostra quantidade, preço unitário e total',
  await p.evaluate(() => {
    const v = document.getElementById('mlVitrine').textContent.replace(/\s+/g, ' ');
    return /Liga metálica/.test(v) && /5×/.test(v) && /20 QdC cada/.test(v) && /100 QdC no total/.test(v);
  }));
t('as 5 unidades saíram da mochila (reserva: 19 → 14)', (await ligasNaMochila()) === 14);
t('e o cabeçalho da vitrine conta as unidades à venda',
  await p.evaluate(() => /5 unidades/.test(document.getElementById('mlVitrineHead').textContent)));

/* ============ RETIRAR O ANÚNCIO DEVOLVE ============ */
await p.evaluate(() => document.querySelector('#mlVitrine [data-ml-rm]').click());
await p.waitForTimeout(350);
t('retirar o anúncio devolve as unidades à mochila (14 → 19)', (await ligasNaMochila()) === 19);
await set('mlQtd', '5'); await set('mlPreco', '20');
await p.evaluate(() => document.getElementById('btnMlAnunciar').click());
await p.waitForTimeout(350);

/* ============ ABRIR A LOJA COLOCA NO MERCADO ============ */
await set('mlNome', 'Depósito do Moura');
await set('mlLema', 'insumo de quest com preço justo');
await p.evaluate(() => document.getElementById('btnMlAbrir').click());
await p.waitForTimeout(400);
t('com anúncio, a loja abre', await p.evaluate(() => window.__mercado().minha.aberta));
t('o texto do estado explica que a vitrine foi para o mercado',
  await p.evaluate(() => /aparece no <strong>Mercado interno/.test(document.getElementById('mlEstadoTxt').innerHTML)));

await nav('v-loja'); await p.waitForTimeout(500);
t('a Quad Store tem o bloco Mercado interno',
  await p.evaluate(() => /Mercado interno/.test(document.getElementById('v-loja').textContent)));
t('a minha loja aparece no mercado, marcada como SUA, com o nome que dei',
  await p.evaluate(() => {
    const l = document.querySelector('#mercadoLista .mkt-loja.minha');
    return !!l && /Depósito do Moura/.test(l.textContent) && /SUA/.test(l.textContent);
  }));
t('as lojas dos outros alunos também estão lá',
  await p.evaluate(() => document.querySelectorAll('#mercadoLista .mkt-loja').length >= 5));
t('loja fechada aparece marcada como fechada',
  await p.evaluate(() => {
    const f = document.querySelector('#mercadoLista .mkt-loja.fechada');
    return !!f && /fechada no momento/.test(f.textContent);
  }));
await p.evaluate(() => document.querySelector('#mercadoLista .mkt-loja.fechada').click());
await p.waitForTimeout(300);
t('e não abre ao toque, explicando',
  await p.evaluate(() => !document.getElementById('lojaLayer').classList.contains('on') &&
                         /está fechada no momento/.test(document.getElementById('toast').textContent)));

/* ============ COMPRAR NUMA LOJA: CARRINHO E FECHAMENTO ============ */
await p.evaluate(() => [...document.querySelectorAll('#mercadoLista .mkt-loja')].find(x => /Barros/.test(x.textContent)).click());
await p.waitForTimeout(400);
t('a vitrine da loja abre com dono, lema e itens',
  await p.evaluate(() => document.getElementById('lojaLayer').classList.contains('on') &&
    /SGT QUAD Barros/.test(document.getElementById('lojaDono').textContent) &&
    document.querySelectorAll('#lojaVitrine .mkt-item').length === 3));
const disponiveis = () => p.evaluate(() => {
  const m = /52 QdC · (\d+) disponíve/.exec(document.getElementById('lojaVitrine').textContent.replace(/\s+/g, ' '));
  return m ? parseInt(m[1], 10) : -1;
});
const antesFaca = await disponiveis();
t('cada item mostra preço em QdC e quantas unidades restam', antesFaca > 0);
const saldo0 = await qdc();
await p.evaluate(() => { const bs = [...document.querySelectorAll('#lojaVitrine .mkt-add')]; bs[0].click(); bs[0].click(); bs[2].click(); });
await p.waitForTimeout(350);
t('juntar no carrinho não debita nada ainda', (await qdc()) === saldo0);
t('a disponibilidade cai conforme o carrinho enche', (await disponiveis()) === antesFaca - 2);
await p.evaluate(() => document.getElementById('btnLojaCarrinho').click());
await p.waitForTimeout(350);
t('o carrinho lista os itens agrupados, com a loja de origem',
  await p.evaluate(() => {
    const v = document.getElementById('cartLista').textContent.replace(/\s+/g, ' ');
    return /2× Faca tática/.test(v) && /1× Corda de rapel/.test(v) && /Arsenal do Barros/.test(v);
  }));
t('e soma o total em Quad Coins (2×52 + 28 = 132)',
  await p.evaluate(() => document.getElementById('cartTotal').textContent === '132 QdC'));
t('o carrinho não oferece pagamento em Diamante',
  await p.evaluate(() => !/Diamante|Dmn/i.test(document.getElementById('cartLayer').textContent)));
await p.evaluate(() => document.getElementById('btnCartFinalizar').click());
await p.waitForTimeout(600);
t('finalizar debita exatamente o total em QdC', (await qdc()) === saldo0 - 132);
t('o carrinho esvazia e as telas fecham',
  await p.evaluate(() => !document.getElementById('cartLayer').classList.contains('on') &&
                         window.__mercado().carrinho.length === 0));
await abreMochila();
const mochila = await p.evaluate(() => document.getElementById('storageGrid').textContent.replace(/\s+/g, ' '));
t('os itens comprados foram para a mochila', /Faca tática/.test(mochila) && /Corda de rapel/.test(mochila));
t('e a faca chegou em 2 unidades', /×2/.test(await p.evaluate(() => {
  const s = [...document.querySelectorAll('#storageGrid .st-slot.cheio')].find(x => /Faca tática/.test(x.textContent));
  return s ? s.textContent : '';
})));
await p.evaluate(() => [...document.querySelectorAll('#storageGrid .st-slot.cheio')].find(x => /Faca/.test(x.textContent)).click());
await p.waitForTimeout(350);
t('a ficha do item registra a compra no mercado e a loja de origem',
  await p.evaluate(() => {
    const v = document.getElementById('itemLayer').textContent.replace(/\s+/g, ' ');
    return /Comprado no Mercado interno por/.test(v) && /na loja Arsenal do Barros/.test(v);
  }));
await p.evaluate(() => document.getElementById('btnItemFechar').click());
await p.evaluate(() => document.getElementById('btnStorageFechar').click());
await p.waitForTimeout(250);

/* ============ SALDO INSUFICIENTE NÃO FECHA A COMPRA ============ */
await nav('v-loja'); await p.waitForTimeout(400);
const saldo1 = await qdc();
/* enche o carrinho com TODO o estoque das lojas abertas — passa do saldo */
const nLojas = await p.evaluate(() => document.querySelectorAll('#mercadoLista .mkt-loja').length);
for (let i = 0; i < nLojas; i++) {
  const entrou = await p.evaluate(idx => {
    const l = [...document.querySelectorAll('#mercadoLista .mkt-loja')][idx];
    if (l.classList.contains('fechada') || l.classList.contains('minha')) return false;
    l.click(); return true;
  }, i);
  if (!entrou) continue;
  await p.waitForTimeout(250);
  await p.evaluate(() => {
    const bs = [...document.querySelectorAll('#lojaVitrine .mkt-add')];
    for (let k = 0; k < 30; k++) bs.forEach(x => { if (!x.disabled) x.click(); });
  });
  await p.waitForTimeout(250);
  await p.evaluate(() => document.getElementById('btnLojaFechar').click());
  await p.waitForTimeout(150);
}
await p.evaluate(() => { document.getElementById('cartLayer').classList.add('on'); });
await p.evaluate(() => document.querySelector('#mercadoLista .mkt-loja:not(.fechada):not(.minha)').click());
await p.waitForTimeout(250);
await p.evaluate(() => document.getElementById('btnLojaCarrinho').click());
await p.waitForTimeout(300);
const total = await p.evaluate(() => parseInt(document.getElementById('cartTotal').textContent.replace(/\D/g, ''), 10));
if (total > saldo1) {
  await p.evaluate(() => document.getElementById('btnCartFinalizar').click());
  await p.waitForTimeout(400);
  t('carrinho acima do saldo não fecha e diz quanto falta',
    (await qdc()) === saldo1 && await p.evaluate(() => /faltam/.test(document.getElementById('toast').textContent)));
} else {
  t('carrinho acima do saldo não fecha e diz quanto falta', false);
}
await p.evaluate(() => document.getElementById('btnCartLimpar').click());
await p.waitForTimeout(250);
t('esvaziar limpa o carrinho', await p.evaluate(() => window.__mercado().carrinho.length === 0));

/* ============ A LOJA SOBREVIVE AO F5 ============ */
await p.evaluate(() => document.getElementById('btnCartFechar').click());
await p.waitForTimeout(700);
await p.reload({ waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1200);
await abreMinhaLoja();
t('depois do F5 a loja mantém nome, lema, anúncio e estado aberto',
  await p.evaluate(() => {
    const m = window.__mercado().minha;
    return m.nome === 'Depósito do Moura' && m.aberta === true && m.anuncios.length === 1 && m.anuncios[0].preco === 20;
  }));

/* ===== DEC. 217 · ENTREPOSTO QUAD: VENDER PARA O SISTEMA ===== */
await nav('v-loja'); await p.waitForTimeout(450);
const sysCard = () => p.evaluate(() => {
  const l = document.querySelector('#mercadoLista .mkt-loja.sistema');
  return l ? l.textContent.replace(/\s+/g, ' ').trim() : '';
});
t('o Entreposto Quad está no mercado, marcado como loja do sistema',
  /Entreposto Quad/.test(await sysCard()));
t('o cartão diz que ele COMPRA a 1 QdC por unidade e conta a mochila',
  /COMPRA a 1 QdC por unidade/.test(await sysCard()) && /itens na sua mochila/.test(await sysCard()));
t('e ele vem antes das lojas dos alunos',
  await p.evaluate(() => {
    const todas = [...document.querySelectorAll('#mercadoLista .mkt-loja')];
    const sys = todas.findIndex(x => x.classList.contains('sistema'));
    const outra = todas.findIndex(x => !x.classList.contains('sistema') && !x.classList.contains('minha'));
    return sys >= 0 && sys < outra;
  }));
await p.evaluate(() => document.querySelector('#mercadoLista .mkt-loja.sistema').click());
await p.waitForTimeout(400);
t('a tela do entreposto abre listando o que está na mochila',
  await p.evaluate(() => document.getElementById('sysLayer').classList.contains('on') &&
                         document.querySelectorAll('#sysLista .mkt-item').length >= 3));
t('cada item mostra 1 QdC cada, qualquer que seja ele',
  await p.evaluate(() => {
    const linhas = [...document.querySelectorAll('#sysLista .mkt-i-preco')].map(x => x.textContent);
    return linhas.length > 0 && linhas.every(x => /^1 QdC cada/.test(x));
  }));
t('a sacola começa zerada', await p.evaluate(() => document.getElementById('sysTotal').textContent === '0 QdC'));
await p.evaluate(() => document.getElementById('btnSysVender').click());
await p.waitForTimeout(250);
t('vender sem escolher nada apenas explica',
  await p.evaluate(() => document.getElementById('sysLayer').classList.contains('on') &&
                         /Escolha ao menos uma unidade/.test(document.getElementById('toast').textContent)));
/* o item mais raro vale o mesmo que o mais comum: 1 QdC */
const antesQdc = await qdc();
const ligasAntes = await p.evaluate(() => {
  const l = [...document.querySelectorAll('#sysLista .mkt-item')].find(x => /Liga metálica/.test(x.textContent));
  return parseInt(l.querySelector('small').textContent.replace(/\D/g, ''), 10);
});
for (let i = 0; i < 3; i++) {
  await p.evaluate(() => document.querySelector('[data-sys-mais="liga"]').click());
  await p.waitForTimeout(90);
}
await p.evaluate(() => document.querySelector('[data-sys-mais="mag"]').click());
await p.waitForTimeout(150);
t('a sacola soma 1 QdC por unidade — 3 ligas + 1 MAG = 4 QdC',
  await p.evaluate(() => document.getElementById('sysTotal').textContent === '4 QdC'));
t('o botão anuncia quantos itens vão embora',
  await p.evaluate(() => /Vender 4 itens/.test(document.getElementById('btnSysVender').textContent)));
t('não dá para vender mais unidades do que se tem (o + trava)',
  await p.evaluate(() => document.querySelector('[data-sys-mais="mag"]').disabled === true));
await p.evaluate(() => document.querySelector('[data-sys-menos="mag"]').click());
await p.waitForTimeout(150);
t('o − devolve à mochila antes de fechar', await p.evaluate(() => document.getElementById('sysTotal').textContent === '3 QdC'));
await p.evaluate(() => document.querySelector('[data-sys-mais="mag"]').click());
await p.waitForTimeout(150);
await p.evaluate(() => document.getElementById('btnSysVender').click());
await p.waitForTimeout(500);
t('vender CREDITA em Quad Coins (o entreposto paga, não cobra)', (await qdc()) === antesQdc + 4);
t('e a tela fecha', await p.evaluate(() => !document.getElementById('sysLayer').classList.contains('on')));
await p.evaluate(() => document.querySelector('#mercadoLista .mkt-loja.sistema').click());
await p.waitForTimeout(350);
t('as unidades vendidas saíram da mochila',
  await p.evaluate(a => {
    const l = [...document.querySelectorAll('#sysLista .mkt-item')].find(x => /Liga metálica/.test(x.textContent));
    return parseInt(l.querySelector('small').textContent.replace(/\D/g, ''), 10) === a - 3;
  }, ligasAntes));
t('e a MAG, que era única, sumiu da lista',
  await p.evaluate(() => ![...document.querySelectorAll('#sysLista .mkt-item')].some(x => /MAG/.test(x.textContent))));
await p.evaluate(() => document.getElementById('btnSysFechar').click());
await p.waitForTimeout(250);
t('o entreposto não some do mercado depois da venda',
  /Entreposto Quad/.test(await sysCard()));

console.log('\nvz6 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
