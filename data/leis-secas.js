/* LEITURA DE LEI SECA (dec. 221) — a lei estudada por lacunas.
   Cada artigo traz o texto com {{trechos}} que viram lacunas; o aluno
   arrasta (ou toca) as peças até completá-lo. A cada bloco de artigos
   entram questões rápidas que cristalizam o estudo.

   Campos do artigo:
   · n           rótulo do dispositivo ("Art. 1º")
   · texto       o texto da lei com {{lacunas}} marcadas
   · distratores peças falsas que entram embaralhadas com as corretas
   · refs        dispositivos que fazem referência a ele
   Questões:
   · apos        o artigo depois do qual o bloco aparece
   Na plataforma real tudo isso chega pelo CSV do painel [INTEGRAÇÃO REAL]. */
var LEIS_SECAS = [
  {
    id: '8112',
    nome: 'Lei 8.112/90',
    desc: 'Regime Jurídico dos Servidores Públicos Civis da União',
    editais: ['prf', 'pcba'],
    artigos: [
      { n: 'Art. 1º',
        texto: 'Esta Lei institui o {{Regime Jurídico}} dos Servidores Públicos Civis da União, das {{autarquias}}, inclusive as em regime especial, e das {{fundações públicas}} federais.',
        distratores: ['empresas públicas', 'sociedades de economia mista'],
        refs: ['CF/88, art. 39', 'Lei 8.112/90, art. 243'] },
      { n: 'Art. 2º',
        texto: 'Para os efeitos desta Lei, servidor é a pessoa legalmente {{investida}} em {{cargo público}}.',
        distratores: ['contratada', 'emprego público', 'função de confiança'],
        refs: ['Lei 8.112/90, art. 3º'] },
      { n: 'Art. 3º',
        texto: 'Cargo público é o conjunto de {{atribuições}} e {{responsabilidades}} previstas na estrutura organizacional que devem ser cometidas a um servidor.',
        distratores: ['vantagens', 'gratificações'],
        refs: ['CF/88, art. 37, I e II'] },
      { n: 'Art. 3º, parágrafo único',
        texto: 'Os cargos públicos, acessíveis a todos os {{brasileiros}}, são criados por {{lei}}, com denominação própria e vencimento pago pelos cofres públicos, para provimento em caráter {{efetivo}} ou em comissão.',
        distratores: ['decreto', 'portaria', 'temporário'],
        refs: ['CF/88, art. 37, I', 'CF/88, art. 48, X'] },
      { n: 'Art. 4º',
        texto: 'É proibida a prestação de serviços {{gratuitos}}, salvo os casos previstos em lei.',
        distratores: ['remunerados', 'voluntários'],
        refs: ['Lei 8.112/90, art. 4º'] },
      { n: 'Art. 5º',
        texto: 'São requisitos básicos para investidura em cargo público: I — a {{nacionalidade brasileira}}; II — o gozo dos {{direitos políticos}}; III — a quitação com as obrigações {{militares}} e eleitorais; IV — o {{nível de escolaridade}} exigido para o exercício do cargo; V — a idade mínima de {{dezoito}} anos; VI — {{aptidão física e mental}}.',
        distratores: ['vinte e um', 'residência no município', 'experiência prévia'],
        refs: ['CF/88, art. 37, I', 'Lei 8.112/90, art. 5º, § 2º'] },
      { n: 'Art. 6º',
        texto: 'O provimento dos cargos públicos far-se-á mediante ato da {{autoridade competente}}.',
        distratores: ['chefia imediata', 'comissão de concurso'],
        refs: ['Lei 8.112/90, art. 7º'] },
      { n: 'Art. 7º',
        texto: 'A investidura em cargo público ocorrerá com a {{posse}}.',
        distratores: ['nomeação', 'aprovação', 'entrada em exercício'],
        refs: ['Lei 8.112/90, art. 13', 'Lei 8.112/90, art. 15'] },
      { n: 'Art. 8º',
        texto: 'São formas de provimento de cargo público: I — {{nomeação}}; II — promoção; V — readaptação; VI — {{reversão}}; VII — aproveitamento; VIII — {{reintegração}}; IX — recondução.',
        distratores: ['exoneração', 'demissão', 'transferência'],
        refs: ['Lei 8.112/90, arts. 9º a 32'] }
    ],
    questoes: [
      { apos: 'Art. 3º, parágrafo único',
        enunciado: 'Segundo a Lei 8.112/90, os cargos públicos são criados por:',
        alternativas: ['decreto do Presidente da República', 'lei', 'portaria do órgão', 'resolução administrativa'],
        correta: 1,
        comentario: 'Art. 3º, parágrafo único: os cargos públicos são criados por LEI, com denominação própria e vencimento pago pelos cofres públicos.' },
      { apos: 'Art. 5º',
        enunciado: 'NÃO é requisito básico para investidura em cargo público:',
        alternativas: ['a nacionalidade brasileira', 'o gozo dos direitos políticos', 'a idade mínima de vinte e um anos', 'aptidão física e mental'],
        correta: 2,
        comentario: 'Art. 5º, V: a idade mínima é de DEZOITO anos — não vinte e um. Os demais itens estão no rol do art. 5º.' },
      { apos: 'Art. 8º',
        enunciado: 'A investidura em cargo público ocorre com:',
        alternativas: ['a nomeação', 'a posse', 'o início do exercício', 'a aprovação no concurso'],
        correta: 1,
        comentario: 'Art. 7º: a investidura ocorre com a POSSE. A nomeação é forma de provimento (art. 8º, I) e o exercício é o efetivo desempenho (art. 15).' }
    ]
  }
];
