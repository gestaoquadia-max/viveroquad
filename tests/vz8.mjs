/* vz8 — dec. 221: LEITURA DE LEI SECA. O aluno abre pelo "+", escolhe a lei
   e completa o artigo arrastando (ou tocando) as peças nas lacunas; acertando
   pontua um pouco de score e de Quad Coins e avança. Depois de dispositivos
   determinados entra o bloco de questões de fixação. Do outro lado, o painel
   de controle publica a lei pelo CSV (artigos, dispositivos de referência e
   questões), categorizada pelos editais da base. */
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
/* a leitura mora no "+" do aluno, não na barra de baixo */
const abreLei = async () => {
  await p.click('#btnPlus'); await p.waitForTimeout(350);
  await p.evaluate(() => { [...document.querySelectorAll('#plusPop .plus-row')].find(x => /Leitura de Lei Seca/.test(x.textContent)).click(); });
  await p.waitForTimeout(400);
};
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const persona = q => p.evaluate(x => document.querySelector('.persona-btn[data-persona="' + x + '"]').click(), q);
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });
/* QdC é a carteira do HUD (#scoreVal); o score de carreira é o da patente
   (#xpNum, "1.234 / 2.500") */
const saldos = () => p.evaluate(() => ({
  qdc: parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g, ''), 10),
  score: parseInt(document.getElementById('xpNum').textContent.split('/')[0].replace(/\D/g, ''), 10)
}));
const aviso = () => p.evaluate(() => document.getElementById('leiAviso').textContent.trim());
const botao = () => p.evaluate(() => document.getElementById('btnLeiConferir').textContent.trim());
const artN = () => p.evaluate(() => document.getElementById('leiArtN').textContent.trim());
const conferir = async () => { await p.evaluate(() => document.getElementById('btnLeiConferir').click()); await p.waitForTimeout(220); };
/* completa o artigo pela resposta certa de cada lacuna (como o aluno faria
   tocando a peça e depois a lacuna) */
const completaCerto = () => p.evaluate(() => {
  [...document.querySelectorAll('#leiArtTxt .lei-gap')].forEach(g => {
    if (g.dataset.val) return;
    const pc = [...document.querySelectorAll('#leiPecas .lei-peca')]
      .find(x => !x.classList.contains('usada') && x.dataset.val === g.dataset.certo);
    if (pc) { pc.click(); g.click(); }
  });
});
/* vence o artigo inteiro: completa, confere e avança */
const venceArtigo = async () => { await completaCerto(); await conferir(); await conferir(); };

await p.addInitScript(() => {
  try { localStorage.setItem('vq_tut_skip', '1'); } catch (e) {}
  window.__dropRng = () => 0.999;
});
await p.goto(new URL('../index.html', import.meta.url).href, { waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1000);

/* ============ O CAMINHO ATÉ A LEI: O "+" DO ALUNO ============ */
await p.click('#btnPlus'); await p.waitForTimeout(400);
const linhas = await p.evaluate(() => [...document.querySelectorAll('#plusPop .plus-row')].map(r => r.querySelector('.t').textContent.trim()));
t('o "+" tem a Leitura de Lei Seca', linhas.some(x => /Leitura de Lei Seca/.test(x)));
t('ela vem logo depois do chat da administração',
  linhas.findIndex(x => /Leitura de Lei Seca/.test(x)) === linhas.findIndex(x => /recados da administração/.test(x)) + 1);
await p.evaluate(() => { [...document.querySelectorAll('#plusPop .plus-row')].find(x => /Leitura de Lei Seca/.test(x.textContent)).click(); });
await p.waitForTimeout(400);
t('abre a área da leitura', await p.evaluate(() => document.getElementById('v-lei-seca').classList.contains('on')));

/* ============ A VITRINE DE LEIS ============ */
const card = () => p.evaluate(() => {
  const el = document.querySelector('#leiLista [data-lei="8112"]');
  return el ? el.textContent.replace(/\s+/g, ' ') : '';
});
const c8112 = await card();
t('a Lei 8.112/90 aparece com o que ela trata',
  /Lei 8\.112\/90/.test(c8112) && /Regime Jurídico/.test(c8112));
t('o card traz um selo por edital em que a lei cai',
  /PRF 2025/.test(c8112) && /PC-BA 2025/.test(c8112));
t('e quantos dispositivos já foram fixados', /0 de 9 dispositivos · 0%/.test(c8112));

/* ============ O ARTIGO COM LACUNAS ============ */
await p.evaluate(() => document.querySelector('#leiLista [data-lei="8112"]').click());
await p.waitForTimeout(400);
t('a sessão de leitura abre', await p.evaluate(() => document.getElementById('leiLayer').classList.contains('on')));
t('no primeiro dispositivo da lei', (await artN()) === 'Art. 1º' &&
  await p.evaluate(() => /Dispositivo 1 de 9/.test(document.getElementById('leiPasso').textContent)));
t('o texto do artigo vem vazado nas lacunas',
  await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap').length === 3) &&
  await p.evaluate(() => !/\{\{/.test(document.getElementById('leiArtTxt').textContent)));
t('as peças soltas embaixo misturam as certas com distratores',
  await p.evaluate(() => document.querySelectorAll('#leiPecas .lei-peca').length === 5));
t('as peças podem ser arrastadas', await p.evaluate(() => document.querySelector('#leiPecas .lei-peca').draggable));
t('a ficha mostra os dispositivos que fazem referência ao artigo',
  await p.evaluate(() => /CF\/88, art\. 39/.test(document.getElementById('leiRefs').textContent) &&
                         document.querySelectorAll('#leiRefs .lr-chip').length === 2));
t('e o prêmio anunciado antes de conferir',
  await p.evaluate(() => /\+5 score · \+3 QdC/.test(document.getElementById('leiPremio').textContent)));

/* conferir com lacuna vazia não pontua: explica o que falta */
await conferir();
t('conferir com lacunas vazias avisa quantas faltam', /Faltam 3 lacunas para conferir/.test(await aviso()));

/* peça no lugar errado: marca o erro e deixa devolver */
await p.evaluate(() => {
  const g = document.querySelectorAll('#leiArtTxt .lei-gap');
  const pc = [...document.querySelectorAll('#leiPecas .lei-peca')];
  const errada = pc.find(x => x.dataset.val === 'empresas públicas');
  errada.click(); g[0].click();                           /* distrator na 1ª lacuna */
  const certa1 = pc.find(x => x.dataset.val === 'autarquias');
  certa1.click(); g[1].click();
  const certa2 = pc.find(x => x.dataset.val === 'fundações públicas');
  certa2.click(); g[2].click();
});
const antes = await saldos();
await conferir();
t('peça no lugar errado é marcada e não pontua',
  /lugar errado/.test(await aviso()) &&
  await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap.erro').length === 1) &&
  (await saldos()).score === antes.score);
await p.evaluate(() => document.querySelector('#leiArtTxt .lei-gap.erro').click());
await p.waitForTimeout(200);
t('tocar na lacuna errada devolve a peça para a bandeja',
  await p.evaluate(() => !document.querySelector('#leiArtTxt .lei-gap[data-gap="0"]').dataset.val &&
    ![...document.querySelectorAll('#leiPecas .lei-peca')].find(x => x.dataset.val === 'empresas públicas').classList.contains('usada')));

/* agora certo: pontua score + Quad Coins e libera o avanço */
await completaCerto();
await conferir();
const dep = await saldos();
t('completar o dispositivo certo rende score e Quad Coins',
  dep.score === antes.score + 5 && dep.qdc === antes.qdc + 3);
t('a mensagem confirma o dispositivo fixado', /Dispositivo completo! Art\. 1º fixado/.test(await aviso()));
t('as lacunas certas ficam marcadas em acerto',
  await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap.ok').length === 3));
t('o botão passa a ser o de avançar', /Avançar/.test(await botao()));
t('a leitura entra no extrato do aluno',
  await p.evaluate(() => window.__ledger().some(m => /leitura de lei · Art\. 1º/.test(m.tipo || ''))));
await conferir();
t('avançar leva ao dispositivo seguinte', (await artN()) === 'Art. 2º');

/* ============ O BLOCO DE QUESTÕES DEPOIS DOS DISPOSITIVOS ============ */
await venceArtigo();                      /* Art. 2º */
t('segue para o Art. 3º', (await artN()) === 'Art. 3º');
await venceArtigo();                      /* Art. 3º */
t('segue para o parágrafo único', /parágrafo único/.test(await artN()));
await completaCerto(); await conferir();
const antesQ = await saldos();
await conferir();                         /* avança → entra o bloco */
t('depois do dispositivo marcado entra o bloco de questões',
  await p.evaluate(() => document.getElementById('leiQuiz').style.display !== 'none' &&
                         document.getElementById('leiArtigo').style.display === 'none' &&
                         window.__lei().quiz === true));
t('o cabeçalho conta em que questão o aluno está',
  await p.evaluate(() => /Questão 1 de 1/.test(document.getElementById('leiPasso').textContent)));
t('a questão cobra justamente o que acabou de ser lido',
  await p.evaluate(() => /cargos públicos são criados por/.test(document.getElementById('leiQEnun').textContent) &&
                         document.querySelectorAll('#leiQAlts [data-alt]').length === 4));
t('o prêmio da questão é menor que o do dispositivo',
  await p.evaluate(() => /\+3 score · \+2 QdC/.test(document.getElementById('leiPremio').textContent)));
t('o botão vira o de responder', /Responder/.test(await botao()));
/* responder sem escolher não passa */
await conferir();
t('responder sem marcar alternativa não avança',
  await p.evaluate(() => !document.getElementById('leiQComent').classList.contains('on')));
/* erra: mostra o gabarito e o comentário, sem pontuar */
await p.evaluate(() => document.querySelector('#leiQAlts [data-alt="0"]').click());
await conferir();
const posErro = await saldos();
t('errar não pontua', posErro.score === antesQ.score && posErro.qdc === antesQ.qdc);
t('errar mostra a resposta certa com o comentário da lei',
  await p.evaluate(() => {
    const cm = document.getElementById('leiQComent');
    return cm.classList.contains('on') && /Resposta certa: letra B/.test(cm.textContent) && /criados por LEI/.test(cm.textContent);
  }));
t('a alternativa certa e a marcada errada ficam visíveis',
  await p.evaluate(() => !!document.querySelector('#leiQAlts [data-alt="1"].hit') &&
                         !!document.querySelector('#leiQAlts [data-alt="0"].miss')));
t('era a última questão do bloco, então o botão volta para a leitura',
  /Continuar a leitura/.test(await botao()));
await conferir();
t('o bloco de questões sai e a leitura continua no dispositivo seguinte',
  (await artN()) === 'Art. 4º' &&
  await p.evaluate(() => document.getElementById('leiQuiz').style.display === 'none' && window.__lei().quiz === false));

/* questão certa pontua */
await venceArtigo();                      /* Art. 4º */
await completaCerto(); await conferir();
const antesQ2 = await saldos();
await conferir();                         /* bloco depois do Art. 5º */
t('o segundo bloco entra depois do Art. 5º', await p.evaluate(() => window.__lei().quiz === true));
await p.evaluate(() => {
  const certa = [...document.querySelectorAll('#leiQAlts [data-alt]')].find(x => /vinte e um anos/.test(x.textContent));
  certa.click();
});
await conferir();
const posCerto = await saldos();
t('acertar a questão rende score e Quad Coins',
  posCerto.score === antesQ2.score + 3 && posCerto.qdc === antesQ2.qdc + 2);
t('e o comentário ensina por que', await p.evaluate(() => /Certo!/.test(document.getElementById('leiQComent').textContent) &&
                                                          /DEZOITO/.test(document.getElementById('leiQComent').textContent)));
await conferir();
t('a leitura retoma no Art. 6º', (await artN()) === 'Art. 6º');

/* ============ O PROGRESSO FICA GUARDADO ============ */
await p.evaluate(() => document.getElementById('btnLeiSair').click());
await p.waitForTimeout(300);
t('sair volta para a vitrine das leis',
  await p.evaluate(() => !document.getElementById('leiLayer').classList.contains('on')));
t('o card mostra o progresso conquistado', /6 de 9 dispositivos · 67%/.test(await card()));
await p.waitForTimeout(700);              /* debounce do salvamento */
await p.reload({ waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1200);
await abreLei();
t('depois do F5 o progresso da leitura sobrevive (DA-10)', /6 de 9 dispositivos/.test(await card()));
await p.evaluate(() => document.querySelector('#leiLista [data-lei="8112"]').click());
await p.waitForTimeout(400);
t('e a leitura retoma onde parou, no 7º dos nove dispositivos',
  (await artN()) === 'Art. 6º' &&
  await p.evaluate(() => /Dispositivo 7 de 9/.test(document.getElementById('leiPasso').textContent)));
await p.evaluate(() => document.getElementById('btnLeiSair').click());
await p.waitForTimeout(250);

/* ============ O PAINEL DE CONTROLE PUBLICA A LEI ============ */
await persona('admin'); await p.waitForTimeout(400);
if (await p.evaluate(() => document.getElementById('admGate').classList.contains('on'))) {
  await p.fill('#admEmail', 'npp@quadconcursos.com.br'); await p.fill('#admChave', 'NPP-2026');
  await p.click('#btnAdmEntrar'); await p.waitForTimeout(500);
}
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.evaluate(() => { document.querySelector('#jumpControle .jp[data-jump="leis"]').click(); });
await p.waitForTimeout(300);
t('o painel tem o bloco de publicação da lei',
  await p.evaluate(() => { const bl = document.querySelector('[data-bl="leis"]'); return !!bl && bl.style.display !== 'none'; }));
t('o seletor de editais vem da base de concursos do sistema',
  await p.evaluate(() => {
    const opts = [...document.querySelectorAll('#admLeiEditais input')];
    return opts.length === (window.CONCURSOS ? window.CONCURSOS.length : 0) && opts.length >= 3;
  }) || await p.evaluate(() => document.querySelectorAll('#admLeiEditais input').length >= 3));
t('cada edital aparece com o nome e o edital publicado',
  await p.evaluate(() => /PRF/i.test(document.getElementById('admLeiEditais').textContent)));
t('o exemplo do CSV está à vista do operador',
  await p.evaluate(() => { const ex = document.querySelector('.lei-csv-ex').textContent; return /ART;/.test(ex) && /QUESTAO;/.test(ex) && /\{\{/.test(ex); }));

const erroAdm = () => p.evaluate(() => { const e = document.getElementById('admLeiErro'); return e.style.display === 'block' ? e.textContent.trim() : ''; });
const publicar = async () => { await p.evaluate(() => document.getElementById('btnAdmLei').click()); await p.waitForTimeout(300); };
/* sem nome */
await publicar();
t('publicar sem nome não passa', /nome válido/.test(await erroAdm()));
await set('admLeiNome', 'Lei 9.784/99');
await publicar();
t('publicar sem escolher o edital não passa', /ao menos um edital/.test(await erroAdm()));
await p.evaluate(() => { const i = document.querySelector('#admLeiEditais input'); i.checked = true; });
await publicar();
t('publicar sem o CSV não passa', /Cole aqui|Cole o CSV/.test(await erroAdm()));
/* CSV com artigo sem lacuna */
await set('admLeiCsv', 'ART;Art. 1º;Esta Lei estabelece normas basicas sobre o processo administrativo;x|y;CF/88');
await publicar();
t('artigo sem lacuna marcada é recusado com a linha apontada', /Linha 1/.test(await erroAdm()) && /lacuna/.test(await erroAdm()));
/* questão com gabarito fora da faixa */
await set('admLeiCsv', 'ART;Art. 1º;Esta Lei estabelece normas básicas sobre o {{processo administrativo}} federal;processo judicial;CF/88, art. 5º\nQUESTAO;Art. 1º;A Lei 9.784/99 trata do processo:;judicial|administrativo;9;Art. 1º');
await publicar();
t('gabarito fora da faixa das alternativas é recusado', /alternativa correta deve ser um número de 1 a 2/.test(await erroAdm()));
/* agora válido */
await set('admLeiCsv', 'tipo;ref;texto;opcoes;extra\nART;Art. 1º;Esta Lei estabelece normas básicas sobre o {{processo administrativo}} federal;processo judicial|processo legislativo;CF/88, art. 5º, LV\nART;Art. 2º;A Administração Pública obedecerá aos princípios da {{legalidade}}, finalidade, motivação, razoabilidade e {{proporcionalidade}};economicidade|hierarquia;Lei 9.784/99, art. 2º\nQUESTAO;Art. 2º;A Lei 9.784/99 trata do processo administrativo:;judicial|federal;2;Art. 1º: a lei estabelece normas básicas sobre o processo administrativo FEDERAL.');
await set('admLeiDesc', 'Processo administrativo na Administração Pública Federal');
await publicar();
t('o CSV válido publica sem erro', (await erroAdm()) === '');
t('a lista do painel mostra a lei publicada com a contagem de dispositivos',
  await p.evaluate(() => { const l = document.getElementById('admLeiLista').textContent.replace(/\s+/g, ' ');
    return /Lei 9\.784\/99/.test(l) && /2 DISPOSITIVOS/.test(l) && /1 questão/.test(l); }));
t('o formulário limpa depois de publicar',
  await p.evaluate(() => !document.getElementById('admLeiNome').value && !document.getElementById('admLeiCsv').value &&
                         !document.querySelector('#admLeiEditais input:checked')));
/* o mesmo CSV pode chegar como arquivo .csv escolhido pelo operador */
await p.setInputFiles('#admLeiArq', {
  name: 'lei-11343.csv', mimeType: 'text/csv',
  buffer: Buffer.from('tipo;ref;texto;opcoes;extra\nART;Art. 28;Quem adquirir, guardar, tiver em depósito, transportar ou trouxer consigo, para {{consumo pessoal}}, drogas sem autorização será submetido a advertência sobre os efeitos das drogas;tráfico privilegiado|uso compartilhado;CF/88, art. 5º\n', 'utf8')
});
await p.waitForTimeout(500);
t('escolher o arquivo .csv carrega o conteúdo no campo',
  await p.evaluate(() => /ART;Art\. 28;/.test(document.getElementById('admLeiCsv').value)));
await set('admLeiNome', 'Lei 11.343/06');
await set('admLeiDesc', 'Lei de Drogas');
await p.evaluate(() => { document.querySelectorAll('#admLeiEditais input')[4].checked = true; });
await publicar();
t('a lei que veio do arquivo publica igual à colada',
  (await erroAdm()) === '' &&
  await p.evaluate(() => /Lei 11\.343\/06/.test(document.getElementById('admLeiLista').textContent)));
t('nome repetido é recusado na próxima publicação',
  await (async () => { await set('admLeiNome', 'lei 9.784/99'); await publicar(); return /Já existe uma lei/.test(await erroAdm()); })());
await set('admLeiNome', '');

/* ============ A LEI PUBLICADA CHEGA NA HORA AO ALUNO ============ */
await persona('aluno'); await p.waitForTimeout(400);
await abreLei();
t('a lei publicada aparece na vitrine do aluno',
  await p.evaluate(() => { const el = [...document.querySelectorAll('#leiLista [data-lei]')].find(x => /Lei 9\.784\/99/.test(x.textContent));
    return !!el && /0 de 2 dispositivos/.test(el.textContent); }));
await p.evaluate(() => [...document.querySelectorAll('#leiLista [data-lei]')].find(x => /Lei 9\.784\/99/.test(x.textContent)).click());
await p.waitForTimeout(400);
t('o artigo que veio do CSV abre com a lacuna do {{ }}',
  await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap').length === 1 &&
                         /normas básicas sobre o/.test(document.getElementById('leiArtTxt').textContent)));
t('os distratores do CSV entram embaralhados com a peça certa',
  await p.evaluate(() => document.querySelectorAll('#leiPecas .lei-peca').length === 3));
t('e as referências do CSV aparecem',
  await p.evaluate(() => /CF\/88, art\. 5º, LV/.test(document.getElementById('leiRefs').textContent)));
await venceArtigo();
t('o segundo artigo do CSV tem as duas lacunas',
  (await artN()) === 'Art. 2º' && await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap').length === 2));
await completaCerto(); await conferir(); await conferir();
t('a questão do CSV entra depois do artigo indicado em ref',
  await p.evaluate(() => window.__lei().quiz === true &&
                         /processo administrativo/.test(document.getElementById('leiQEnun').textContent)));
await p.evaluate(() => document.querySelector('#leiQAlts [data-alt="1"]').click());
await conferir();
t('o gabarito do CSV (extra) é a alternativa certa',
  await p.evaluate(() => /Certo!/.test(document.getElementById('leiQComent').textContent)));
await conferir(); await p.waitForTimeout(300);
t('acabando os dispositivos a leitura se conclui e volta para a vitrine',
  await p.evaluate(() => !document.getElementById('leiLayer').classList.contains('on')));
t('e a lei fica marcada como concluída',
  await p.evaluate(() => { const el = [...document.querySelectorAll('#leiLista [data-lei]')].find(x => /Lei 9\.784\/99/.test(x.textContent));
    return /2 de 2 dispositivos · 100%/.test(el.textContent); }));

/* ============ TIRAR DO AR ============ */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.evaluate(() => { document.querySelector('#jumpControle .jp[data-jump="leis"]').click(); });
await p.waitForTimeout(250);
await p.evaluate(() => { [...document.querySelectorAll('#admLeiLista .adm-x')].find(x => /lei/.test(x.dataset.rmLei)).click(); });
await p.waitForTimeout(300);
t('o ✕ tira a lei do ar no painel',
  await p.evaluate(() => !/Lei 9\.784\/99/.test(document.getElementById('admLeiLista').textContent)));
await persona('aluno'); await p.waitForTimeout(400);
await abreLei();
t('e ela desaparece da vitrine do aluno',
  await p.evaluate(() => !/Lei 9\.784\/99/.test(document.getElementById('leiLista').textContent)) &&
  await p.evaluate(() => /Lei 8\.112\/90/.test(document.getElementById('leiLista').textContent)));

console.log('\nvz8 :: ' + ok + ' ok / ' + falhas.length + ' falhas');
falhas.forEach(f => console.log('   XX ' + f));
console.log('erros JS: ' + (erros.length ? erros.join(' | ') : 'nenhum'));
await b.close();
process.exit(falhas.length || erros.length ? 1 : 0);
