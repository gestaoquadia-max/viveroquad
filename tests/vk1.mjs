/* vk1 — ajustes da área do administrador:
   atalhos por bloco, avisos fixos de erro, cadeiras do simulado presencial,
   mentoria com período, isoladas no editor de preços e relatório de compras */
const pw = (await import(process.env.VQ_PW ?? '/opt/node22/lib/node_modules/playwright/index.js')).default;
const { chromium } = pw;
const S = new URL('./_out', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: process.env.VQ_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
const p = await c.newPage();
const erros = [];
p.on('pageerror', e => erros.push('JS: ' + e.message));
let ok = 0; const falhas = [];
const t = (nome, cond) => { if (cond) ok++; else falhas.push(nome); };
const txt = id => p.evaluate(i => { const e = document.getElementById(i); return e ? e.textContent : ''; }, id);
const toast = () => p.evaluate(() => document.getElementById('toast').textContent);
const persona = q => p.evaluate(x => document.querySelector('.persona-btn[data-persona="' + x + '"]').click(), q);
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const nav = v => p.evaluate(x => document.querySelector('#navAluno .nav-btn[data-view="' + x + '"]').click(), v);
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });

await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(700);
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
const el = await p.$('.phone');

/* ================= 1) ATALHOS: ÁREA LIMPA E BOTÃO QUE ALTERNA ================= */
const areas = [
  ['jumpControle', 'v-adm-controle', ['doc', 'turmas', 'credito', 'contas', 'msg', 'gift', 'estornos']],
  ['jumpInterno', 'v-adm-hoje', ['avisos', 'crono', 'eventos', 'simulados', 'skins']],
  ['jumpLiber', 'v-adm-liber', ['fisicos', 'acessos', 'inscritos']],
  ['jumpLojaAdm', 'v-adm-loja', ['cadastro', 'precos', 'precoturmas']]
];
const visiveis = v => p.evaluate(x => [...document.querySelectorAll('#' + x + ' [data-bl]')]
  .filter(y => y.style.display !== 'none').map(y => y.dataset.bl), v);
for (const [host, view, chaves] of areas) {
  await navAdm(view); await p.waitForTimeout(350);
  const btns = await p.evaluate(h => [...document.querySelectorAll('#' + h + ' .jp')].map(x => x.dataset.jump), host);
  t(host + ': um botão por bloco pedido', chaves.every(k => btns.indexOf(k) >= 0));
  t(host + ': tem o "Ver todos os blocos"', btns.indexOf('*') >= 0);
  t(host + ': a área abre LIMPA, só com os atalhos', (await visiveis(view)).length === 0);
  for (const k of chaves) {
    await p.evaluate(a => document.querySelector('#' + a.h + ' .jp[data-jump="' + a.k + '"]').click(), { h: host, k });
    await p.waitForTimeout(120);
    const vis = await visiveis(view);
    /* dec. 144: "Atualizações do dia" reúne dois blocos — grade e materiais */
    t(host + '/' + k + ': abre só os blocos dele', vis.length >= 1 && vis.every(x => x === k));
  }
  /* tocar de novo no mesmo botão recolhe o bloco e volta a tela limpa */
  await p.evaluate(a => document.querySelector('#' + a.h + ' .jp[data-jump="' + a.k + '"]').click(), { h: host, k: chaves[0] });
  await p.waitForTimeout(120);
  t(host + ': o bloco aberto trocou para o primeiro', (await visiveis(view))[0] === chaves[0]);
  await p.evaluate(a => document.querySelector('#' + a.h + ' .jp[data-jump="' + a.k + '"]').click(), { h: host, k: chaves[0] });
  await p.waitForTimeout(120);
  t(host + ': tocar de novo recolhe e limpa a área', (await visiveis(view)).length === 0);
  /* "Ver todos" mostra a área inteira */
  await p.evaluate(h => document.querySelector('#' + h + ' .jp.todos').click(), host);
  await p.waitForTimeout(120);
  t(host + ': "Ver todos" mostra a área inteira', (await visiveis(view)).length >= chaves.length);
  /* sair e voltar mantém o que estava aberto */
  await navAdm('v-adm-alunos'); await p.waitForTimeout(200);
  await navAdm(view); await p.waitForTimeout(250);
  t(host + ': voltar à área mantém o que estava aberto', (await visiveis(view)).length >= chaves.length);
  await p.evaluate(h => document.querySelector('#' + h + ' .jp.todos').click(), host);
  await p.waitForTimeout(120);
}
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#jumpControle .jp.todos').click());
await p.waitForTimeout(200);
await el.screenshot({ path: S + '/k1-atalhos.png' });

/* ================= 2) CRIAÇÃO DE TURMA: HORÁRIO E ERROS ================= */
await p.evaluate(() => document.querySelector('#jumpControle .jp[data-jump="turmas"]').click());
await p.waitForTimeout(400);
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(300);
t('turma: aviso fica na tela dizendo o que falta', /falta a data de início/i.test(await txt('admCtErro')));
t('turma: o campo que falta fica marcado', await p.evaluate(() => document.getElementById('admCtIni').classList.contains('err')));
await set('admCtApelido', 'Águia');
await set('admCtIni', '2026-08-03'); await set('admCtFim', '2026-12-15');
t('turma: eco confirma o período', /03\/08\/2026 → 15\/12\/2026/.test(await txt('admCtEco')));
t('turma: eco cobra o horário enquanto falta', /incompletos/.test(await txt('admCtEco')));
await set('admCtH1i', '14:00'); await set('admCtH1f', '15:30'); await set('admCtH2f', '17:00');
t('turma: eco escreve o horário completo', /14h–15h30 e 15h30–17h/.test(await txt('admCtEco')));
t('turma: eco marca o horário como pronto', await p.evaluate(() => [...document.querySelectorAll('#admCtEco .ec')].some(x => x.classList.contains('ok') && /Horário/.test(x.textContent))));
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(250);
t('turma: cobra o preço em Diamantes', /preço em Diamantes/i.test(await txt('admCtErro')));
await set('admCtPrecoDmn', '1800'); await set('admCtPrecoQdc', '2000'); await set('admCtVagas', '100');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(250);
t('turma: cobra as vagas em Quad Coins (aceita 0)', /vagas em Quad Coins/i.test(await txt('admCtErro')));
await set('admCtVagasQdc', '10');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(250);
t('turma: cobra a sala da sede', /qual sala/i.test(await txt('admCtErro')));
await set('admCtSala', 'Sala 3');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
const okTurma = await txt('admCtErro');
t('turma: confirmação verde ao abrir', /aberta/.test(okTurma) && await p.evaluate(() => document.getElementById('admCtErro').classList.contains('ok')));
t('turma: a confirmação diz onde ela foi parar', /Quad Store/.test(okTurma));
t('turma: a confirmação diz a sala', /Sala 3/.test(okTurma));
t('turma: entra na lista de turmas abertas', /Águia/.test(await txt('admCtLista')));
await el.screenshot({ path: S + '/k1-turma-ok.png' });
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(500);
t('turma: chega em "Turmas · modalidades do Quad" na Loja', /Águia/.test(await txt('lojaTurmasCore')));

/* árvore do edital anexada troca a origem das matérias */
await persona('admin'); await p.waitForTimeout(400); await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#jumpControle .jp[data-jump="turmas"]').click()); await p.waitForTimeout(300);
t('matérias: dizem de qual edital vêm', /árvore do edital de/i.test(await txt('admCtArvoreOrigem')));
await p.setInputFiles('#admCtArvore', { name: 'edital-ppba-2026.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 teste') });
await p.waitForTimeout(400);
t('matérias: PDF anexado vira a origem da árvore', /edital-ppba-2026\.pdf/.test(await txt('admCtArvoreOrigem')));
t('matérias: a lista de professores continua de pé', (await txt('admCtProfs')).length > 10);

/* ================= 3) EVENTO: AVISO DO QUE FALTA ================= */
await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#jumpInterno .jp[data-jump="eventos"]').click()); await p.waitForTimeout(300);
await p.evaluate(() => { document.getElementById('admEvNovoNome').value = 'Aula aberta online'; });
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
t('evento: avisa que falta a data', /falta a data/i.test(await txt('admEvErro')));
t('evento: marca o campo da data', await p.evaluate(() => document.getElementById('admEvNovoData').classList.contains('err')));
await set('admEvNovoModal', 'online');
await set('admEvNovoTipo', 'pago');
await set('admEvNovoData', '2026-09-24');
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
t('evento pago: cobra o preço', /preço/i.test(await txt('admEvErro')));
await set('admEvNovoPreco', '300');
/* o Estúdio é ESCOLHIDO, como qualquer outra reserva: sem selecionar, não cria */
t('online: o seletor começa vazio e oferece o Estúdio', await p.evaluate(() => {
  const s2 = document.getElementById('admEvSala');
  return !s2.disabled && s2.value === '' &&
    [...s2.options].map(o => o.value).join('|') === '|Estúdio';
}));
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
t('online: cobra a reserva do Estúdio', /Estúdio/.test(await txt('admEvErro')) && /selecione/i.test(await txt('admEvErro')));
await set('admEvSala', 'Estúdio');
t('eco do Estúdio só fala depois de escolhido, com dia e horário', /livre nesse dia e horário/.test(await txt('admEvSalaEco')));
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
t('evento: confirmação verde com data e destino', /criado para/i.test(await txt('admEvErro')) && /24\/09/.test(await txt('admEvErro')));
t('evento pago: a confirmação diz que foi para a Loja', /Loja/.test(await txt('admEvErro')));
t('evento online: a confirmação diz que o Estúdio foi reservado', /Estúdio reservado/.test(await txt('admEvErro')));
await el.screenshot({ path: S + '/k1-evento.png' });
/* o pago reservou o Estúdio 19h–21h; a gratuita no MESMO horário é barrada */
await set('admEvNovoNome', 'Live gratuita');
await set('admEvNovoTipo', 'gratuito');
await set('admEvNovoData', '2026-09-24');
await set('admEvSala', 'Estúdio');
t('eco avisa o choque antes de tentar criar', /já tem/.test(await txt('admEvSalaEco')) && /Aula aberta online/.test(await txt('admEvSalaEco')));
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(300);
t('Estúdio ocupado no mesmo horário é barrado', /Estúdio já tem/.test(await txt('admEvErro')) && /Aula aberta online/.test(await txt('admEvErro')));
await set('admEvNovoInicio', '09:00'); await set('admEvNovoFim', '11:00');
await p.click('#btnAdmEvNovo'); await p.waitForTimeout(400);
t('evento gratuito: confirmação fala do carrossel', /carrossel/i.test(await txt('admEvErro')));
t('os dois eventos do dia 30 entraram', /Aula aberta online/.test(await txt('admEvList')) && /Live gratuita/.test(await txt('admEvList')));
await persona('aluno'); await p.waitForTimeout(500);
t('gratuito aparece para o aluno no carrossel', /Live gratuita/.test(await txt('evStrip')));
await nav('v-loja'); await p.waitForTimeout(400);
t('pago aparece na Loja (eventos online)', /Aula aberta online/.test(await txt('lojaEventos-dig')));

/* ============ 4) SIMULADOS: PRESENCIAL COM SALA, DIGITAL SEM LIMITE ============ */
await persona('admin'); await p.waitForTimeout(400); await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#jumpInterno .jp[data-jump="simulados"]').click()); await p.waitForTimeout(300);
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(250);
t('simulado: cobra o nome', /falta o nome/i.test(await txt('admSimErro')));
await set('admSimNome', 'Simulado 70 · sala grande');
await set('admSimData', '2026-11-22');
t('presencial é sempre vendido (gratuito travado)', await p.evaluate(() => {
  const s = document.getElementById('admSimTipo'); return s.value === 'pago' && s.disabled === true;
}));
t('presencial mostra o rateio por moeda', await p.evaluate(() => document.getElementById('admSimVagasQdcBox').style.display !== 'none'));
t('presencial mostra os dois preços', await p.evaluate(() => document.getElementById('admSimPrecosBox').style.display !== 'none'));
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(250);
t('presencial: cobra as vagas em Diamantes', /vagas em Diamantes/i.test(await txt('admSimErro')));
await set('admSimVagas', '30');   /* vagas POR MOEDA (dec. 155): 30 Dmn */
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(250);
t('presencial: cobra as vagas em Quad Coins', /vagas em Quad Coins/i.test(await txt('admSimErro')));
await set('admSimVagasQdc', '70');
t('eco: 30 em Diamantes e 70 em Quad Coins', /30 em Diamantes/.test(await txt('admSimEco')) && /70 em Quad Coins/.test(await txt('admSimEco')));
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(250);
t('presencial: cobra o preço em Diamantes', /preço em Diamantes/i.test(await txt('admSimErro')));
await set('admSimPrecoDmn', '150');
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(250);
t('presencial: cobra o preço em Quad Coins', /preço em Quad Coins/i.test(await txt('admSimErro')));
await set('admSimPrecoQdc', '180');
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(250);
t('simulado presencial: cobra a sala da sede', /qual sala/i.test(await txt('admSimErro')));
await set('admSimSala', 'Sala 1');
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(400);
t('simulado: a confirmação diz a sala', /na Sala 1/.test(await txt('admSimErro')));
t('presencial: confirmação com o rateio por moeda', /100 vagas/.test(await txt('admSimErro')) && /30 em Diamantes/.test(await txt('admSimErro')) && /70 em Quad Coins/.test(await txt('admSimErro')));
t('presencial não tem campo de prêmio (é do digital gratuito)', await p.evaluate(() => !document.getElementById('admSimRec')));
t('lista do admin mostra a sala por moeda', /sala de 100: 30\/30 em Dmn e 70\/70 em QdC/.test(await txt('admSimList')));
t('lista do admin mostra os dois preços', /150 Dmn \/ 180 QdC/.test(await txt('admSimList')));
await el.screenshot({ path: S + '/k1-simulado.png' });

/* digital: gratuito liberado, sem vagas, duas moedas */
await set('admSimModal', 'digital');
t('digital libera o seletor gratuito/pago', await p.evaluate(() => document.getElementById('admSimTipo').disabled === false));
t('digital esconde as vagas da sala', await p.evaluate(() => document.getElementById('admSimPres').style.display === 'none'));
await set('admSimNome', 'Simulado digital pago');
await p.setInputFiles('#admSimPdf', { name: 'sim.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
await set('admSimMin', '40'); await set('admSimNq', '20');
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(250);
t('digital pago: cobra preço em ao menos uma moeda', /pelo menos uma moeda/i.test(await txt('admSimErro')));
await set('admSimPrecoDmn', '90'); await set('admSimPrecoQdc', '120');
await p.click('#btnAdmSimLancar'); await p.waitForTimeout(400);
t('digital: confirmação diz "sem limite de vagas"', /sem limite de vagas/.test(await txt('admSimErro')));
t('digital: confirmação traz as duas moedas', /90 Dmn ou 120 QdC/.test(await txt('admSimErro')));
await el.screenshot({ path: S + '/k1-sim-digital.png' });

await persona('aluno'); await p.waitForTimeout(500);
await nav('v-loja'); await p.waitForTimeout(500);
const lojaPres = await txt('lojaSim-pres'), lojaDig = await txt('lojaSim-dig');
t('vitrine: presencial mostra as vagas de cada moeda', /30 Dmn · 70 QdC/.test(lojaPres));
t('vitrine: presencial mostra os dois preços', /150 Dmn ou 180 QdC/.test(lojaPres));
t('vitrine: digital marcado como sem limite', /sem limite/.test(lojaDig));
t('vitrine: digital com os dois preços', /90 Dmn ou 120 QdC/.test(lojaDig));
/* compra do presencial: escolhe a moeda e baixa o estoque */
await p.evaluate(() => {
  const b = [...document.querySelectorAll('#lojaSim-pres .loja-item')].find(x => /Simulado 70/.test(x.textContent));
  b.click();
});
await p.waitForTimeout(400);
t('presencial: abre o pop-up de moeda', await p.evaluate(() => document.getElementById('turmaLayer').classList.contains('on')));
t('pop-up traz preço e vagas de cada moeda', /150 Dmn/.test(await txt('tuDmnTxt')) && /30 vagas/.test(await txt('tuDmnVagas')) && /180 QdC/.test(await txt('tuQdcTxt')) && /70 vagas/.test(await txt('tuQdcVagas')));
await el.screenshot({ path: S + '/k1-sim-moeda.png' });
const qdc0 = await p.evaluate(() => parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g, ''), 10));
await p.click('#btnTuQdc'); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.getElementById('btnCompraOk'); if (b) b.click(); });
await p.waitForTimeout(500);
const qdc1 = await p.evaluate(() => parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g, ''), 10));
t('a compra debita o preço da moeda escolhida', qdc1 === qdc0 - 180);
t('inscrição confirmada pela compra', /inscrição confirmada/i.test(await toast()));
await p.evaluate(() => document.querySelector('#navAluno .nav-btn[data-view="v-missoes"]').click());
await p.waitForTimeout(400);
const simTxt = await txt('simuladosList');
t('a vaga em QdC saiu do estoque', /69 de 70 vagas em QdC/.test(simTxt));
t('e a de Diamantes segue intacta', /30 de 30 vagas em Dmn/.test(simTxt));
/* digital: compra escolhe a moeda, sem vagas */
await nav('v-loja'); await p.waitForTimeout(500);
await p.evaluate(() => {
  const b = [...document.querySelectorAll('#lojaSim-dig .loja-item')].find(x => /Simulado digital pago/.test(x.textContent));
  b.click();
});
await p.waitForTimeout(400);
t('digital: pop-up diz que não tem limite de vagas', /sem limite de vagas/.test(await txt('tuDmnVagas')));
const dmn0 = await p.evaluate(() => parseInt(document.getElementById('dmnVal').textContent.replace(/\D/g, ''), 10));
await p.click('#btnTuDmn'); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.getElementById('btnCompraOk'); if (b) b.click(); });
await p.waitForTimeout(500);
t('digital: debita em Diamantes', await p.evaluate(() => parseInt(document.getElementById('dmnVal').textContent.replace(/\D/g, ''), 10)) === dmn0 - 90);

/* ================= 5) MENTORIA COM INÍCIO E FIM ================= */
await persona('admin'); await p.waitForTimeout(400); await navAdm('v-adm-loja'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#jumpLojaAdm .jp[data-jump="cadastro"]').click()); await p.waitForTimeout(300);
await set('admProdCat', 'dig:mentoria');
t('mentoria: aparece o campo de término', await p.evaluate(() => document.getElementById('admProdDataFim').style.display !== 'none'));
await set('admProdNome', 'Mentoria CFO · turma online');
await set('admProdPreco', '900');
await p.click('#btnAdmProd'); await p.waitForTimeout(300);
t('mentoria: cobra a data de início', /data de início/i.test(await txt('admProdErro')));
await set('admProdData', '2026-11-16');
await p.click('#btnAdmProd'); await p.waitForTimeout(300);
t('mentoria: cobra a data de término', /data de término/i.test(await txt('admProdErro')));
await set('admProdDataFim', '2026-06-10');
await p.click('#btnAdmProd'); await p.waitForTimeout(300);
t('mentoria: recusa término antes do início', /depois do início/i.test(await txt('admProdErro')));
await set('admProdDataFim', '2026-12-16');
await p.click('#btnAdmProd'); await p.waitForTimeout(400);
t('mentoria: publicada com o período', /16\/11\/2026 a 16\/12\/2026/.test(await txt('admProdErro')));
await set('admProdCat', 'pres:modulos');
t('produto sem período esconde o término', await p.evaluate(() => document.getElementById('admProdDataFim').style.display === 'none'));
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(500);
t('mentoria na Loja mostra o período', /16\/11\/2026 → 16\/12\/2026/.test(await txt('lojaExtras-mentoria')));

/* ================= 6) PREÇOS E VAGAS: TURMAS E ISOLADAS ================= */
await persona('admin'); await p.waitForTimeout(400); await navAdm('v-adm-loja'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#jumpLojaAdm .jp[data-jump="precoturmas"]').click()); await p.waitForTimeout(300);
const pt = await txt('admPrecoTurmas');
t('editor de preços tem as turmas', /Turma PATAMO/.test(pt));
t('editor de preços agora tem as isoladas', /Isoladas/.test(pt) && await p.evaluate(() => !!document.querySelector('#admPrecoTurmas [data-ip]')));
const isoAntes = await p.evaluate(() => {
  const i = document.querySelector('#admPrecoTurmas [data-ip]');
  return { id: i.dataset.ip, preco: i.value };
});
await p.evaluate(a => {
  document.querySelector('#admPrecoTurmas [data-ip="' + a + '"]').value = '77';
  document.querySelector('#admPrecoTurmas [data-iv="' + a + '"]').value = '9';
}, isoAntes.id);
await p.click('#btnAdmPrecoTurma'); await p.waitForTimeout(400);
t('aplicar mexe também nas isoladas', /atualizado|atualizados/.test(await toast()));
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(500);
const isoTile = await p.evaluate(() => {
  const b = document.querySelector('#lojaIsoladas .loja-item[data-isolada]');
  return b ? { preco: b.dataset.preco, txt: b.textContent } : null;
});
t('o preço novo da isolada vale na Loja', !!isoTile && isoTile.preco === '77');
t('e aparece escrito no item', !!isoTile && /77/.test(isoTile.txt));
await persona('admin'); await p.waitForTimeout(400); await navAdm('v-adm-loja'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#jumpLojaAdm .jp[data-jump="precoturmas"]').click()); await p.waitForTimeout(300);
t('as vagas novas da isolada ficam guardadas', await p.evaluate(a => {
  const v = document.querySelector('#admPrecoTurmas [data-iv="' + a + '"]');
  return !!v && v.value === '9';
}, isoAntes.id));
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(500);

/* ================= 7) RELATÓRIO DE COMPRAS ================= */
await p.evaluate(() => document.getElementById('rcCard').scrollIntoView({ block: 'start' }));
await p.waitForTimeout(300);
await el.screenshot({ path: S + '/k1-relatorio.png' });
t('relatório de compras é o último bloco da Loja', await p.evaluate(() => {
  const cards = [...document.querySelectorAll('#v-loja > .p-card')];
  return cards.indexOf(document.getElementById('rcCard')) === cards.length - 1;
}));
const abas = await p.evaluate(() => [...document.querySelectorAll('#rcTabs .rc-tab')].map(x => x.textContent));
t('tem as quatro abas de período', ['Semanal', 'Mensal', 'Trimestral', 'Semestral'].every(x => abas.indexOf(x) >= 0));
t('semanal: mostra o que espera retirada', /aguardando retirada na recepção/.test(await txt('rcPendente')));
const semanal = await txt('rcResumo');
await p.click('.rc-tab[data-rc="90"]'); await p.waitForTimeout(300);
const trimestral = await txt('rcResumo');
t('trimestral traz mais compras que semanal', trimestral !== semanal);
t('trimestral: turma em andamento com evolução', /Turma PATAMO/.test(await txt('rcAndamento')));
t('a evolução da turma vem em porcentagem', await p.evaluate(() => {
  const b = document.querySelector('#rcAndamento .rc-track i');
  return !!b && parseInt(b.style.width, 10) > 0 && parseInt(b.style.width, 10) <= 100;
}));
t('trimestral: item já entregue aparece', /entregue na recepção/.test(await txt('rcEntregue')));
await p.click('.rc-tab[data-rc="180"]'); await p.waitForTimeout(300);
t('semestral responde', /compras/.test(await txt('rcResumo')));
await p.click('.rc-tab[data-rc="7"]'); await p.waitForTimeout(300);
t('volta para a semanal', await p.evaluate(() => document.querySelector('.rc-tab[data-rc="7"]').classList.contains('on')));
/* a entrega confirmada pela recepção reflete no relatório do aluno */
await persona('admin'); await p.waitForTimeout(400); await navAdm('v-adm-liber'); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#jumpLiber .jp[data-jump="fisicos"]').click()); await p.waitForTimeout(300);
await p.evaluate(() => {
  const r = [...document.querySelectorAll('#admPedidosList .mission-row')].find(x => /Módulo impresso/.test(x.textContent));
  r.querySelector('[data-ped]').click();
});
await p.waitForTimeout(400);
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(500);
t('confirmada a entrega, o item muda de coluna', /Módulo impresso/.test(await txt('rcEntregue')) && !/Módulo impresso/.test(await txt('rcPendente')));

/* ================= 8) O BLOCO DUPLICADO SAIU ================= */
await persona('admin'); await p.waitForTimeout(400); await navAdm('v-adm-hoje'); await p.waitForTimeout(400);
t('"Produtos digitais · pré-configurados" saiu do Interno', !/Produtos digitais/.test(await txt('v-adm-hoje')));
t('e o cadastro da Loja segue de pé', await p.evaluate(() => !!document.getElementById('btnAdmProd')));

/* ================= 9) AVISOS ENVIADOS BEM DISTRIBUÍDOS ================= */
await p.evaluate(() => document.querySelector('#jumpInterno .jp[data-jump="avisos"]').click());
await p.waitForTimeout(400);
await set('admAvTitulo', 'Aviso com título comprido para testar a quebra do texto');
await set('admAvDet', 'Detalhe igualmente longo, com data, hora e orientação completa para o aluno');
await p.click('#btnAdmAviso'); await p.waitForTimeout(400);
const av = await p.evaluate(() => {
  const r = document.querySelector('#admAvisosList .adm-aviso');
  if (!r) return null;
  const tt = r.querySelector('.av-t').getBoundingClientRect();
  const dd = r.querySelector('.av-d').getBoundingClientRect();
  const ac = r.querySelector('.av-acoes').getBoundingClientRect();
  const card = r.closest('.p-card').getBoundingClientRect();
  return { tituloAcima: dd.top >= tt.bottom - 1, acoesAbaixo: ac.top >= dd.bottom - 1, cabe: tt.right <= card.right + 1 && ac.right <= card.right + 1 };
});
t('aviso: detalhe embaixo do título', !!av && av.tituloAcima);
t('aviso: ações embaixo do texto', !!av && av.acoesAbaixo);
t('aviso: nada estoura a largura do bloco', !!av && av.cabe);
await el.screenshot({ path: S + '/k1-avisos.png' });

/* ================= 10) SALAS DA SEDE ================= */
await persona('admin'); await p.waitForTimeout(400); await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#jumpControle .jp[data-jump="salas"]').click());
await p.waitForTimeout(400);
const mapa = await txt('admSalasMapa');
t('mapa: as 4 salas e o Estúdio aparecem', ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4', 'Estúdio'].every(x => mapa.indexOf(x) >= 0));
t('mapa: conta a história da sala (turma, turno, horário e período)', /Turma PATAMO/.test(mapa) && /noite/.test(mapa) && /→/.test(mapa));
t('mapa: isolada aparece com o dia da semana', /Isolada de Português/.test(mapa) && /SÁB/.test(mapa));
t('mapa: o Estúdio é das gravações e eventos online', /GRAVAÇÕES/.test(mapa));
await el.screenshot({ path: S + '/k1-salas.png' });
/* criação: sem sala não abre; sala ocupada no mesmo horário é barrada */
await p.evaluate(() => document.querySelector('#jumpControle .jp[data-jump="turmas"]').click());
await p.waitForTimeout(300);
const ops = await p.evaluate(() => [...document.querySelectorAll('#admCtSala option')].map(o => o.textContent));
t('seletor: as opções são só os nomes das salas', ops.slice(1).join('|') === 'Sala 1|Sala 2|Sala 3|Sala 4');
t('seletor: a 1ª opção é a pergunta, não uma sala', /Em qual sala a turma funciona\?/.test(ops[0]));
t('seletor: o Estúdio não é opção de turma', !ops.some(o => /Estúdio/.test(o)));
await set('admCtApelido', 'CORE');
await set('admCtConc', 'pcba');
await set('admCtIni', '2026-11-16'); await set('admCtFim', '2027-02-10');
await set('admCtH1i', '19:00'); await set('admCtH1f', '20:30'); await set('admCtH2f', '22:00');
await set('admCtPrecoDmn', '900'); await set('admCtPrecoQdc', '1000');
await set('admCtVagas', '40'); await set('admCtVagasQdc', '5');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(300);
t('turma sem sala é barrada', /qual sala/i.test(await txt('admCtErro')));
await set('admCtSala', 'Sala 2');
t('eco já confere a sala contra o horário digitado', /Sala 2/.test(await txt('admCtSalaEco')) && /já tem/.test(await txt('admCtSalaEco')) && /PATAMO/.test(await txt('admCtSalaEco')));
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(300);
t('sala ocupada no mesmo horário é barrada', /Sala 2 já tem/.test(await txt('admCtErro')) && /PATAMO/.test(await txt('admCtErro')));
await el.screenshot({ path: S + '/k1-sala-conflito.png' });
/* de manhã a Sala 3 está livre — a mesma turma muda de turno e abre */
await set('admCtH1i', '08:00'); await set('admCtH1f', '09:30'); await set('admCtH2f', '11:00');
await set('admCtSala', 'Sala 3');
await p.click('#btnAdmCtAbrir'); await p.waitForTimeout(400);
t('sala livre no horário abre a turma', /aberta na <\/?b?>?/.test('') || /aberta/.test(await txt('admCtErro')) && /Sala 3/.test(await txt('admCtErro')));
t('a lista de turmas mostra a sala', /Sala 3/.test(await txt('admCtLista')));
/* o mapa e o aluno acompanham */
await p.evaluate(() => document.querySelector('#jumpControle .jp[data-jump="salas"]').click());
await p.waitForTimeout(300);
t('a turma nova entrou no mapa da Sala 3', /CORE/.test(await txt('admSalasMapa')));
await persona('aluno'); await p.waitForTimeout(400); await nav('v-loja'); await p.waitForTimeout(500);
t('o aluno vê a sala na vitrine da turma', await p.evaluate(() => {
  const t2 = [...document.querySelectorAll('#lojaTurmasCore .loja-item')].find(x => /CORE/.test(x.textContent));
  return !!t2 && /Sala 3/.test(t2.textContent);
}));

console.log('vk1 :: ' + ok + ' ok / ' + falhas.length + ' falhas' + (falhas.length ? '\n  - ' + falhas.join('\n  - ') : ''));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
