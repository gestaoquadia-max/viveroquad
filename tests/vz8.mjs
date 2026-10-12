/* vz8 — dec. 221: LEITURA DE LEI SECA, na forma da dec. 221-b.
   A lei chega DIVIDIDA (título · capítulo · seção): o aluno abre o índice,
   o app marca onde ele parou e ele pode avançar para qualquer parte. Dentro
   da parte, um dispositivo por vez, por lacunas (toque e arraste). Errar
   abre VER GABARITO — o dispositivo inteiro na forma correta, marcado como
   errado, com repetir ou avançar. As questões entram SÓ no fecho da parte,
   sorteadas entre os títulos que o aluno já revisou. No painel, dois CSVs:
   o conteúdo da lei e o banco de questões. */
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
const navAdm = v => p.evaluate(x => document.querySelector('#navAdmin .nav-btn[data-view="' + x + '"]').click(), v);
const persona = q => p.evaluate(x => document.querySelector('.persona-btn[data-persona="' + x + '"]').click(), q);
const set = (id, v) => p.evaluate(a => {
  const e = document.getElementById(a.id); e.value = a.v;
  e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true }));
}, { id, v });
/* a leitura mora no "+" do aluno, não na barra de baixo */
const abreLei = async () => {
  await p.click('#btnPlus'); await p.waitForTimeout(350);
  await p.evaluate(() => { [...document.querySelectorAll('#plusPop .plus-row')].find(x => /Leitura de Lei Seca/.test(x.textContent)).click(); });
  await p.waitForTimeout(400);
};
/* QdC é a carteira do HUD (#scoreVal); o score de carreira vem da patente */
const saldos = () => p.evaluate(() => ({
  qdc: parseInt(document.getElementById('scoreVal').textContent.replace(/\D/g, ''), 10),
  score: parseInt(document.getElementById('xpNum').textContent.split('/')[0].replace(/\D/g, ''), 10)
}));
const T = id => p.evaluate(x => document.getElementById(x).textContent.replace(/\s+/g, ' ').trim(), id);
const visivel = id => p.evaluate(x => { const e = document.getElementById(x); return !!e && e.style.display !== 'none'; }, id);
const artN = () => T('leiArtN');
const botao = () => T('btnLeiConferir');
const toque = async () => { await p.evaluate(() => document.getElementById('btnLeiConferir').click()); await p.waitForTimeout(220); };
/* completa o dispositivo com as peças certas, como o aluno faria tocando */
const completaCerto = () => p.evaluate(() => {
  [...document.querySelectorAll('#leiArtTxt .lei-gap')].forEach(g => {
    if (g.dataset.val) return;
    const pc = [...document.querySelectorAll('#leiPecas .lei-peca')]
      .find(x => !x.classList.contains('usada') && x.dataset.val === g.dataset.certo);
    if (pc) { pc.click(); g.click(); }
  });
});
const completaErrado = () => p.evaluate(() => {
  [...document.querySelectorAll('#leiArtTxt .lei-gap')].forEach(g => {
    if (g.dataset.val) return;
    const pc = [...document.querySelectorAll('#leiPecas .lei-peca')]
      .find(x => !x.classList.contains('usada') && x.dataset.val !== g.dataset.certo);
    if (pc) { pc.click(); g.click(); }
  });
});
/* vence o dispositivo inteiro: completa, confere e avança */
const venceArtigo = async () => { await completaCerto(); await toque(); await toque(); };
const abreParte = async n => {
  await p.evaluate(i => document.querySelectorAll('#leiPartes .lei-parte')[i].click(), n);
  await p.waitForTimeout(350);
};

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
t('e diz em quantas partes a lei está dividida', /3 partes · 0 de 14 dispositivos · 0%/.test(c8112));

/* ============ O ÍNDICE: A LEI DIVIDIDA COMO ELA É ============ */
await p.evaluate(() => document.querySelector('#leiLista [data-lei="8112"]').click());
await p.waitForTimeout(400);
t('abrir a lei abre o ÍNDICE, não um dispositivo solto',
  await visivel('leiIndice') && !(await visivel('leiArtigo')) && !(await visivel('leiRodape')));
t('o índice lista as três partes da lei',
  await p.evaluate(() => document.querySelectorAll('#leiPartes .lei-parte').length === 3));
const indice = await T('leiPartes');
t('cada parte mostra onde mora na lei (título e capítulo/seção)',
  /TÍTULO I/i.test(indice) && /Das Disposições Preliminares/.test(indice) &&
  /Capítulo I · Do Provimento — Seção I/.test(indice) && /Seção III · Da Posse e do Exercício/.test(indice));
t('e quantos dispositivos e questões cada parte tem',
  /5 de 5|0 de 5 dispositivos · 3 questões no fecho/.test(indice) && /0 de 4 dispositivos/.test(indice));
t('nada começado ainda: todas as partes marcadas "a começar"',
  await p.evaluate(() => [...document.querySelectorAll('#leiPartes .lp-selo')].every(x => /A COMEÇAR/.test(x.textContent))));
t('o topo conta o progresso da lei inteira', /0 de 14 dispositivos fixados/.test(await T('leiPasso')));
t('na primeira visita o convite é para COMEÇAR pela primeira parte',
  /Comece por aqui/i.test(await T('leiRetomar')) && /Das Disposições Preliminares/.test(await T('leiRetomar')));

/* ============ PODE AVANÇAR PARA QUALQUER PARTE ============ */
await abreParte(2);
t('o aluno pode entrar direto numa parte mais à frente',
  (await artN()) === 'Art. 13' && /Seção III · Da Posse e do Exercício/.test(await T('leiParteRot')));
t('o passo conta dentro da parte, não da lei inteira', /Dispositivo 1 de 4/.test(await T('leiPasso')));
await p.evaluate(() => document.getElementById('btnLeiVoltar').click()); await p.waitForTimeout(300);
t('o botão “Índice da lei” devolve ao índice', await visivel('leiIndice'));

/* ============ O DISPOSITIVO COM LACUNAS ============ */
await abreParte(0);
t('a parte abre no primeiro dispositivo dela', (await artN()) === 'Art. 1º');
t('o texto do artigo vem vazado nas lacunas',
  await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap').length === 3) &&
  await p.evaluate(() => !/\{\{/.test(document.getElementById('leiArtTxt').textContent)));
t('as peças soltas misturam as certas com as alternativas erradas',
  await p.evaluate(() => document.querySelectorAll('#leiPecas .lei-peca').length === 5));
t('as peças podem ser arrastadas', await p.evaluate(() => document.querySelector('#leiPecas .lei-peca').draggable));
t('a ficha mostra os dispositivos que fazem referência ao artigo',
  await p.evaluate(() => /CF\/88, art\. 39/.test(document.getElementById('leiRefs').textContent) &&
                         document.querySelectorAll('#leiRefs .lr-chip').length === 2));
t('e o prêmio anunciado antes de conferir', /\+5 score · \+3 QdC/.test(await T('leiPremio')));
await toque();
t('conferir com lacunas vazias avisa quantas faltam', /Faltam 3 lacunas para conferir/.test(await T('leiAviso')));
t('e não oferece gabarito antes de o aluno tentar', !(await visivel('leiAvisoAcao')));

/* peça no lugar errado: marca, não pontua e oferece o gabarito */
const antes = await saldos();
await completaErrado();
await toque();
t('peça no lugar errado é marcada e não pontua',
  /lugar errado/.test(await T('leiAviso')) &&
  await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap.erro').length > 0) &&
  (await saldos()).score === antes.score);
t('o recado convida a tentar de novo OU ver o gabarito', /Tente de novo ou veja o gabarito/.test(await T('leiAviso')));
t('e o botão “Ver gabarito” aparece', await visivel('leiAvisoAcao') && /Ver gabarito/.test(await T('btnLeiGabarito')));

/* ============ VER GABARITO: A LEI COMPLETA, DISPOSITIVO ERRADO ============ */
await p.evaluate(() => document.getElementById('btnLeiGabarito').click());
await p.waitForTimeout(300);
const gab = await T('leiGab');
t('o gabarito abre o dispositivo inteiro na forma correta',
  /GABARITO · Art\. 1º/i.test(gab) && /Esta Lei institui o Regime Jurídico/.test(gab) &&
  /autarquias/.test(gab) && /fundações públicas federais/.test(gab));
t('as palavras certas ficam destacadas no gabarito',
  await p.evaluate(() => document.querySelectorAll('#leiGab .lei-gab-txt b').length === 3));
t('o dispositivo é pontuado como ERRADO, sem score nem QdC',
  /marcado como errado/i.test(gab) && /sem pontuação/.test(await T('leiPremio')) &&
  (await saldos()).score === antes.score && (await saldos()).qdc === antes.qdc);
t('a bandeja de peças sai de cena com o gabarito aberto', !(await visivel('leiBandeja')));
t('aparecem os dois caminhos: repetir o dispositivo e avançar',
  await visivel('btnLeiRepetir') && /Repetir o dispositivo/.test(await T('btnLeiRepetir')) && /Avançar/.test(await botao()));

/* repetir devolve o mesmo dispositivo limpo — e ele não pontua mais */
await p.evaluate(() => document.getElementById('btnLeiRepetir').click());
await p.waitForTimeout(300);
t('repetir devolve o dispositivo do zero',
  (await artN()) === 'Art. 1º' &&
  await p.evaluate(() => [...document.querySelectorAll('#leiArtTxt .lei-gap')].every(g => !g.dataset.val)) &&
  await p.evaluate(() => !document.querySelector('#leiPecas .lei-peca.usada')));
t('e avisa que a repetição não pontua de novo', /revisão · sem nova pontuação/.test(await T('leiPremio')));
await completaCerto(); await toque();
t('acertar na repetição confirma o dispositivo, sem pagar de novo',
  /Dispositivo completo/.test(await T('leiAviso')) && (await saldos()).score === antes.score);
await toque();
t('e segue para o dispositivo seguinte', (await artN()) === 'Art. 2º');

/* ============ ACERTO DE PRIMEIRA: PONTUA ============ */
const a2 = await saldos();
await completaCerto(); await toque();
const d2 = await saldos();
t('completar o dispositivo certo rende score e Quad Coins',
  d2.score === a2.score + 5 && d2.qdc === a2.qdc + 3);
t('a mensagem confirma o dispositivo fixado', /Dispositivo completo! Art\. 2º fixado/.test(await T('leiAviso')));
t('as lacunas certas ficam marcadas em acerto',
  await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap.ok').length === 2));
t('a leitura entra no extrato do aluno',
  await p.evaluate(() => window.__ledger().some(m => /leitura de lei · Art\. 2º/.test(m.tipo || ''))));
await toque();

/* ============ AS QUESTÕES SÓ NO FECHO DA PARTE ============ */
t('no meio da parte NÃO aparece questão nenhuma',
  (await artN()) === 'Art. 3º' && await p.evaluate(() => window.__lei().quiz === false));
await venceArtigo();                       /* Art. 3º */
await venceArtigo();                       /* Art. 3º, parágrafo único */
t('ainda no último dispositivo da parte, sem questão', (await artN()) === 'Art. 4º');
const antesQ = await saldos();
await completaCerto(); await toque();      /* fecha o último dispositivo */
t('o bloco de questões ainda não entrou', await p.evaluate(() => window.__lei().quiz === false));
await toque();                             /* avançar → fecha a parte */
t('ao FECHAR a parte entra o bloco de questões',
  await visivel('leiQuiz') && !(await visivel('leiArtigo')) &&
  await p.evaluate(() => window.__lei().quiz === true));
t('o bloco se anuncia como o fecho da parte', /Fecho da parte · questão de fixação/.test(await T('leiQSel')));
t('a questão diz de que título ela cobra', /Cobra: Título I · Das Disposições Preliminares/.test(await T('leiQTit')));
t('e só podem vir questões do título já revisado',
  await p.evaluate(() => {
    const vistos = document.getElementById('leiQTit').textContent;
    return /Título I/.test(vistos) && !/Título II/.test(vistos);
  }));
t('o cabeçalho conta em que questão o aluno está', /Questão 1 de 3/.test(await T('leiPasso')));
t('o prêmio da questão é menor que o do dispositivo', /\+3 score · \+2 QdC/.test(await T('leiPremio')));
t('o botão vira o de responder', /Responder/.test(await botao()));
await toque();
t('responder sem marcar alternativa não avança',
  await p.evaluate(() => !document.getElementById('leiQComent').classList.contains('on')));

/* erra a 1ª: gabarito e comentário, sem pontuar */
await p.evaluate(() => {
  const q = window.__lei();
  const alts = [...document.querySelectorAll('#leiQAlts [data-alt]')];
  const certa = document.querySelector('#leiQAlts [data-alt]').parentNode;
  alts[0].click();
});
const certa0 = await p.evaluate(() => {
  const sel = document.querySelector('#leiQAlts .sel');
  return sel ? parseInt(sel.dataset.alt, 10) : -1;
});
await toque();
const posQ1 = await saldos();
const acertouPorAcaso = await p.evaluate(() => /^Certo!/.test(document.getElementById('leiQComent').textContent));
t('responder revela o gabarito com o comentário da lei',
  await p.evaluate(() => {
    const cm = document.getElementById('leiQComent');
    return cm.classList.contains('on') && (/Certo!/.test(cm.textContent) || /Resposta certa: letra/.test(cm.textContent));
  }));
t('a alternativa certa fica visível na lista',
  await p.evaluate(() => !!document.querySelector('#leiQAlts .hit')));
t(acertouPorAcaso ? 'acertar a questão rende score e QdC' : 'errar a questão não rende pontos',
  acertouPorAcaso ? (posQ1.score === antesQ.score + 5 + 3) : (posQ1.score === antesQ.score + 5));
t('o botão leva à próxima questão do bloco', /Próxima questão/.test(await botao()));
await toque();
t('a segunda questão do bloco entra', /Questão 2 de 3/.test(await T('leiPasso')));

/* acerta as duas restantes — responder revela, avançar troca de questão */
for (let i = 0; i < 2; i++) {
  const antesI = await saldos();
  await p.evaluate(() => {
    const q = window.__leiQAtual();
    document.querySelector('#leiQAlts [data-alt="' + q.correta + '"]').click();
  });
  await toque();
  const depoisI = await saldos();
  t('acertar a questão ' + (i + 2) + ' rende +3 score e +2 QdC',
    depoisI.score === antesI.score + 3 && depoisI.qdc === antesI.qdc + 2);
  if (i === 0) {
    await toque();
    t('o bloco segue para a última questão', /Questão 3 de 3/.test(await T('leiPasso')));
  }
}
t('no fim do bloco o botão volta para o índice', /Voltar ao índice/.test(await botao()));
await toque(); await p.waitForTimeout(300);
t('fechado o bloco, o aluno volta ao índice da lei',
  await visivel('leiIndice') && await p.evaluate(() => window.__lei().quiz === false));
t('a parte vencida aparece como CONCLUÍDA',
  await p.evaluate(() => /CONCLUÍDO/.test(document.querySelectorAll('#leiPartes .lei-parte')[0].textContent)));
t('e o índice já convida a continuar na parte seguinte',
  /Comece por aqui|Você parou aqui/.test(await T('leiRetomar')) &&
  /Capítulo I · Do Provimento — Seção I/.test(await T('leiRetomar')));
t('o topo soma os 5 dispositivos da parte fechada', /5 de 14 dispositivos fixados/.test(await T('leiPasso')));

/* ============ O SORTEIO SÓ PESCA DOS TÍTULOS JÁ REVISADOS ============ */
await abreParte(1);
t('a segunda parte abre no Art. 5º', (await artN()) === 'Art. 5º');
for (let i = 0; i < 5; i++) await venceArtigo();
t('fechada a segunda parte, entra o bloco de questões',
  await p.evaluate(() => window.__lei().quiz === true));
const titulosSorteados = await p.evaluate(() => window.__leiQFila().map(q => q.titulo));
t('o sorteio agora pode pescar dos DOIS títulos já revisados',
  titulosSorteados.length === 3 && titulosSorteados.every(x => /Título I|Título II/.test(x)));
t('e nunca de um título que o aluno ainda não viu',
  await p.evaluate(() => {
    const vistos = window.__lei().atual.partes.filter(p => {
      const f = (window.__lei().progresso['8112'].partes[p.id] || 0);
      return f >= p.artigos.length;
    }).map(p => p.titulo);
    return window.__leiQFila().every(q => vistos.indexOf(q.titulo) >= 0);
  }));
/* responde o bloco inteiro para voltar ao índice */
for (let i = 0; i < 3; i++) {
  await p.evaluate(() => { const q = window.__leiQAtual(); document.querySelector('#leiQAlts [data-alt="' + q.correta + '"]').click(); });
  await toque(); await toque(); await p.waitForTimeout(150);
}
t('duas partes concluídas, a terceira ainda aberta',
  /10 de 14 dispositivos fixados/.test(await T('leiPasso')) &&
  await p.evaluate(() => [...document.querySelectorAll('#leiPartes .lp-selo')].filter(x => /CONCLUÍDO/.test(x.textContent)).length === 2));

/* ============ RETOMAR DEPOIS DO F5 ============ */
await abreParte(2);
await venceArtigo();                       /* Art. 13 */
await p.evaluate(() => document.getElementById('btnLeiSair').click());
await p.waitForTimeout(800);               /* debounce do salvamento */
await p.reload({ waitUntil: 'load' });
await p.evaluate(() => { document.getElementById('loginLayer').classList.add('off'); });
await p.waitForTimeout(1200);
await abreLei();
t('depois do F5 o progresso da leitura sobrevive (DA-10)', /11 de 14 dispositivos/.test(await card()));
await p.evaluate(() => document.querySelector('#leiLista [data-lei="8112"]').click());
await p.waitForTimeout(400);
t('a lei reabre no índice, mostrando onde ele parou',
  /Você parou aqui/.test(await T('leiRetomar')) && /Seção III · Da Posse e do Exercício/.test(await T('leiRetomar')));
await p.evaluate(() => document.querySelector('#leiRetomar [data-ir]').click());
await p.waitForTimeout(350);
t('e continuar leva ao dispositivo seguinte ao último fixado',
  (await artN()) === 'Art. 13, § 1º' && /Dispositivo 2 de 4/.test(await T('leiPasso')));
await p.evaluate(() => document.getElementById('btnLeiSair').click());
await p.waitForTimeout(250);

/* ============ O PAINEL PUBLICA COM DOIS CSVs ============ */
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
  await p.evaluate(() => document.querySelectorAll('#admLeiEditais input').length >= 3 &&
                         /PRF 2025/.test(document.getElementById('admLeiEditais').textContent)));
t('há DOIS blocos de CSV, um para a lei e outro para as questões',
  await p.evaluate(() => document.querySelectorAll('[data-bl="leis"] .lei-csv-bloco').length === 2 &&
                         !!document.getElementById('admLeiCsv') && !!document.getElementById('admLeiQCsv') &&
                         !!document.getElementById('admLeiArq') && !!document.getElementById('admLeiQArq')));
const blocos = await p.evaluate(() => [...document.querySelectorAll('[data-bl="leis"] .lei-csv-bloco')].map(x => x.textContent.replace(/\s+/g, ' ')));
t('o 1º bloco explica as colunas do conteúdo da lei',
  /CSV 1 · o conteúdo da lei/.test(blocos[0]) && /titulo/.test(blocos[0]) && /capitulo/.test(blocos[0]) &&
  /dispositivo/.test(blocos[0]) && /alternativas/.test(blocos[0]) && /\{\{/.test(blocos[0]));
t('e diz que título + capítulo iguais viram uma parte de estudo',
  /viram uma parte de estudo/i.test(blocos[0]));
t('o 2º bloco explica o banco de questões por título',
  /CSV 2 · o banco de questões/.test(blocos[1]) && /exatamente igual/.test(blocos[1]) &&
  /correta/.test(blocos[1]) && /já revisou/.test(blocos[1]));

const erroAdm = () => p.evaluate(() => { const e = document.getElementById('admLeiErro'); return e.style.display === 'block' ? e.textContent.trim() : ''; });
const publicar = async () => { await p.evaluate(() => document.getElementById('btnAdmLei').click()); await p.waitForTimeout(300); };
const CSV_LEI = 'titulo;capitulo;dispositivo;texto;alternativas;referencias\n' +
  'Título I · Das Disposições Gerais;;Art. 1º;Esta Lei estabelece normas básicas sobre o {{processo administrativo}} federal;processo judicial|processo legislativo;CF/88, art. 5º, LV\n' +
  'Título I · Das Disposições Gerais;;Art. 2º;A Administração Pública obedecerá aos princípios da {{legalidade}}, finalidade, motivação, razoabilidade e {{proporcionalidade}};economicidade|hierarquia;Lei 9.784/99, art. 2º\n' +
  'Título II · Dos Direitos dos Administrados;Capítulo único · Dos Direitos;Art. 3º;O administrado tem o direito de ser tratado com {{respeito}} pelas autoridades e servidores;rigor|formalidade;Lei 9.784/99, art. 3º';
const CSV_Q = 'titulo;enunciado;alternativas;correta;comentario\n' +
  'Título I · Das Disposições Gerais;A Lei 9.784/99 trata do processo administrativo:;judicial|federal;2;Art. 1º: normas básicas sobre o processo administrativo FEDERAL.\n' +
  'Título II · Dos Direitos dos Administrados;O administrado tem direito a ser tratado com:;respeito|rigor;1;Art. 3º, I.';

await publicar();
t('publicar sem nome não passa', /nome válido/.test(await erroAdm()));
await set('admLeiNome', 'Lei 9.784/99');
await publicar();
t('publicar sem escolher o edital não passa', /ao menos um edital/.test(await erroAdm()));
await p.evaluate(() => { document.querySelector('#admLeiEditais input').checked = true; });
await publicar();
t('publicar sem o CSV da lei não passa', /CSV 1/.test(await erroAdm()));
await set('admLeiCsv', CSV_LEI);
await publicar();
t('publicar sem o CSV das questões não passa', /CSV 2/.test(await erroAdm()));
/* erros apontando a linha */
await set('admLeiCsv', 'Título I;;Art. 1º;Esta Lei estabelece normas basicas sobre o processo administrativo;x|y;CF/88');
await set('admLeiQCsv', CSV_Q);
await publicar();
t('dispositivo sem lacuna marcada é recusado com a linha apontada',
  /CSV da lei, linha 1/.test(await erroAdm()) && /lacuna/.test(await erroAdm()));
await set('admLeiCsv', 'Título I · Das Disposições Gerais;;;Esta Lei estabelece normas básicas sobre o {{processo administrativo}};x;');
await publicar();
t('linha sem o dispositivo é recusada', /falta o dispositivo/.test(await erroAdm()));
await set('admLeiCsv', CSV_LEI);
await set('admLeiQCsv', 'Título Inventado;Uma pergunta qualquer:;a|b;1;comentário');
await publicar();
t('questão com título que não existe no CSV da lei é recusada',
  /CSV das questões, linha 1/.test(await erroAdm()) && /não existe no CSV da lei/.test(await erroAdm()));
await set('admLeiQCsv', 'Título I · Das Disposições Gerais;A Lei trata do processo:;judicial|federal;9;x');
await publicar();
t('gabarito fora da faixa das alternativas é recusado', /número de 1 a 2/.test(await erroAdm()));
/* agora válido */
await set('admLeiQCsv', CSV_Q);
await set('admLeiDesc', 'Processo administrativo na Administração Pública Federal');
await publicar();
t('com os dois CSVs certos a lei publica sem erro', (await erroAdm()) === '');
t('a lista do painel conta as partes, os dispositivos e as questões',
  await p.evaluate(() => { const l = document.getElementById('admLeiLista').textContent.replace(/\s+/g, ' ');
    return /Lei 9\.784\/99/.test(l) && /2 PARTES/.test(l) && /3 dispositivos/.test(l) && /2 questões/.test(l); }));
t('o formulário limpa os dois CSVs depois de publicar',
  await p.evaluate(() => !document.getElementById('admLeiNome').value && !document.getElementById('admLeiCsv').value &&
                         !document.getElementById('admLeiQCsv').value && !document.querySelector('#admLeiEditais input:checked')));
/* os dois CSVs também chegam como arquivo */
await p.setInputFiles('#admLeiArq', { name: 'lei-11343.csv', mimeType: 'text/csv',
  buffer: Buffer.from('titulo;capitulo;dispositivo;texto;alternativas;referencias\nTítulo III · Dos Crimes;Capítulo III · Do Tráfico;Art. 28;Quem adquirir, guardar ou trouxer consigo, para {{consumo pessoal}}, drogas sem autorização será submetido a advertência;tráfico privilegiado|uso compartilhado;CF/88, art. 5º\n', 'utf8') });
await p.setInputFiles('#admLeiQArq', { name: 'questoes-11343.csv', mimeType: 'text/csv',
  buffer: Buffer.from('titulo;enunciado;alternativas;correta;comentario\nTítulo III · Dos Crimes;O porte para consumo pessoal sujeita o agente a:;prisão|advertência;2;Art. 28, I.\n', 'utf8') });
await p.waitForTimeout(600);
t('escolher os arquivos .csv carrega os dois campos',
  await p.evaluate(() => /Art\. 28/.test(document.getElementById('admLeiCsv').value) &&
                         /consumo pessoal/.test(document.getElementById('admLeiQCsv').value)));
await set('admLeiNome', 'Lei 11.343/06'); await set('admLeiDesc', 'Lei de Drogas');
await p.evaluate(() => { document.querySelectorAll('#admLeiEditais input')[4].checked = true; });
await publicar();
t('a lei que veio dos arquivos publica igual à colada',
  (await erroAdm()) === '' && await p.evaluate(() => /Lei 11\.343\/06/.test(document.getElementById('admLeiLista').textContent)));
await set('admLeiNome', 'lei 9.784/99'); await set('admLeiCsv', CSV_LEI); await set('admLeiQCsv', CSV_Q);
await p.evaluate(() => { document.querySelector('#admLeiEditais input').checked = true; });
await publicar();
t('nome repetido é recusado', /Já existe uma lei/.test(await erroAdm()));
await set('admLeiNome', '');

/* ============ A LEI PUBLICADA CHEGA NA HORA AO ALUNO ============ */
await persona('aluno'); await p.waitForTimeout(400);
await abreLei();
t('a lei publicada aparece na vitrine já dividida em partes',
  await p.evaluate(() => { const el = [...document.querySelectorAll('#leiLista [data-lei]')].find(x => /Lei 9\.784\/99/.test(x.textContent));
    return !!el && /2 partes · 0 de 3 dispositivos/.test(el.textContent.replace(/\s+/g, ' ')); }));
await p.evaluate(() => [...document.querySelectorAll('#leiLista [data-lei]')].find(x => /Lei 9\.784\/99/.test(x.textContent)).click());
await p.waitForTimeout(400);
t('o índice da lei do CSV traz as duas partes com seus nomes',
  await p.evaluate(() => document.querySelectorAll('#leiPartes .lei-parte').length === 2) &&
  /Das Disposições Gerais/.test(await T('leiPartes')) && /Capítulo único · Dos Direitos/.test(await T('leiPartes')));
await abreParte(0);
t('o dispositivo que veio do CSV abre com a lacuna do {{ }}',
  (await artN()) === 'Art. 1º' &&
  await p.evaluate(() => document.querySelectorAll('#leiArtTxt .lei-gap').length === 1));
t('as alternativas do CSV entram embaralhadas com a peça certa',
  await p.evaluate(() => document.querySelectorAll('#leiPecas .lei-peca').length === 3));
t('e as referências do CSV aparecem', /CF\/88, art\. 5º, LV/.test(await T('leiRefs')));
await venceArtigo();
await completaCerto(); await toque(); await toque();
t('fechada a parte do CSV, entra só a questão do título já revisado',
  await p.evaluate(() => window.__lei().quiz === true) &&
  /Cobra: Título I · Das Disposições Gerais/.test(await T('leiQTit')) &&
  await p.evaluate(() => window.__leiQFila().length === 1));
await p.evaluate(() => { const q = window.__leiQAtual(); document.querySelector('#leiQAlts [data-alt="' + q.correta + '"]').click(); });
await toque();
t('o gabarito do CSV (coluna correta) é a alternativa certa', /Certo!/.test(await T('leiQComent')));
await toque(); await p.waitForTimeout(300);
t('e a leitura volta para o índice com a parte concluída',
  await visivel('leiIndice') &&
  await p.evaluate(() => /CONCLUÍDO/.test(document.querySelectorAll('#leiPartes .lei-parte')[0].textContent)));
await p.evaluate(() => document.getElementById('btnLeiSair').click()); await p.waitForTimeout(250);

/* ============ TIRAR DO AR ============ */
await persona('admin'); await p.waitForTimeout(400);
await navAdm('v-adm-controle'); await p.waitForTimeout(300);
await p.evaluate(() => { document.querySelector('#jumpControle .jp[data-jump="leis"]').click(); });
await p.waitForTimeout(250);
await p.evaluate(() => { [...document.querySelectorAll('#admLeiLista .adm-bar')].find(x => /Lei 9\.784\/99/.test(x.textContent)).querySelector('.adm-x').click(); });
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
