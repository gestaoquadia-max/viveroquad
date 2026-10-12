/* LEITURA DE LEI SECA (dec. 221) — a lei estudada por lacunas.

   A lei chega DIVIDIDA como ela é de verdade: título, capítulo, seção,
   disposições gerais. Cada `parte` é um pedaço fechado de estudo, e o
   aluno escolhe por onde entrar — o app abre onde ele parou, mas nada
   impede avançar para um trecho mais à frente.

   Parte:
   · id        chave do progresso
   · titulo    a que título da lei o pedaço pertence (casa com as questões)
   · capitulo  capítulo/seção, quando houver (vazio = o título inteiro)
   · artigos   os dispositivos, na ordem da lei
   Artigo:
   · n           rótulo do dispositivo ("Art. 1º")
   · texto       o texto da lei com os {{trechos}} que viram lacuna
   · alternativas  peças falsas que entram embaralhadas com as certas
   · refs        dispositivos que fazem referência a ele
   Questão:
   · titulo    o TÍTULO que ela cobra — ao fechar uma parte, o app sorteia
               entre as questões dos títulos que o aluno já revisou

   Na plataforma real tudo isso chega pelos dois CSVs do painel
   (conteúdo da lei e banco de questões) [INTEGRAÇÃO REAL]. */
var LEIS_SECAS = [
  {
    id: '8112',
    nome: 'Lei 8.112/90',
    desc: 'Regime Jurídico dos Servidores Públicos Civis da União',
    editais: ['prf', 'pcba'],
    partes: [
      {
        id: 'p1',
        titulo: 'Título I · Das Disposições Preliminares',
        capitulo: '',
        artigos: [
          { n: 'Art. 1º',
            texto: 'Esta Lei institui o {{Regime Jurídico}} dos Servidores Públicos Civis da União, das {{autarquias}}, inclusive as em regime especial, e das {{fundações públicas}} federais.',
            alternativas: ['empresas públicas', 'sociedades de economia mista'],
            refs: ['CF/88, art. 39', 'Lei 8.112/90, art. 243'] },
          { n: 'Art. 2º',
            texto: 'Para os efeitos desta Lei, servidor é a pessoa legalmente {{investida}} em {{cargo público}}.',
            alternativas: ['contratada', 'emprego público', 'função de confiança'],
            refs: ['Lei 8.112/90, art. 3º'] },
          { n: 'Art. 3º',
            texto: 'Cargo público é o conjunto de {{atribuições}} e {{responsabilidades}} previstas na estrutura organizacional que devem ser cometidas a um servidor.',
            alternativas: ['vantagens', 'gratificações'],
            refs: ['CF/88, art. 37, I e II'] },
          { n: 'Art. 3º, parágrafo único',
            texto: 'Os cargos públicos, acessíveis a todos os {{brasileiros}}, são criados por {{lei}}, com denominação própria e vencimento pago pelos cofres públicos, para provimento em caráter {{efetivo}} ou em comissão.',
            alternativas: ['decreto', 'portaria', 'temporário'],
            refs: ['CF/88, art. 37, I', 'CF/88, art. 48, X'] },
          { n: 'Art. 4º',
            texto: 'É proibida a prestação de serviços {{gratuitos}}, salvo os casos previstos em lei.',
            alternativas: ['remunerados', 'voluntários'],
            refs: ['Lei 8.112/90, art. 4º'] }
        ]
      },
      {
        id: 'p2',
        titulo: 'Título II · Do Provimento, Vacância, Remoção, Redistribuição e Substituição',
        capitulo: 'Capítulo I · Do Provimento — Seção I · Disposições Gerais',
        artigos: [
          { n: 'Art. 5º',
            texto: 'São requisitos básicos para investidura em cargo público: I — a {{nacionalidade brasileira}}; II — o gozo dos {{direitos políticos}}; III — a quitação com as obrigações {{militares}} e eleitorais; IV — o {{nível de escolaridade}} exigido para o exercício do cargo; V — a idade mínima de {{dezoito}} anos; VI — {{aptidão física e mental}}.',
            alternativas: ['vinte e um', 'residência no município', 'experiência prévia'],
            refs: ['CF/88, art. 37, I', 'Lei 8.112/90, art. 5º, § 2º'] },
          { n: 'Art. 5º, § 2º',
            texto: 'Às pessoas portadoras de deficiência é assegurado o direito de se inscrever em concurso público para provimento de cargo cujas atribuições sejam {{compatíveis}} com a deficiência de que são portadoras; para tais pessoas serão reservadas até {{20%}} das vagas oferecidas no concurso.',
            alternativas: ['incompatíveis', '5%', '10%'],
            refs: ['CF/88, art. 37, VIII', 'Lei 8.112/90, art. 5º, caput'] },
          { n: 'Art. 6º',
            texto: 'O provimento dos cargos públicos far-se-á mediante ato da {{autoridade competente}}.',
            alternativas: ['chefia imediata', 'comissão de concurso'],
            refs: ['Lei 8.112/90, art. 7º'] },
          { n: 'Art. 7º',
            texto: 'A investidura em cargo público ocorrerá com a {{posse}}.',
            alternativas: ['nomeação', 'aprovação', 'entrada em exercício'],
            refs: ['Lei 8.112/90, art. 13', 'Lei 8.112/90, art. 15'] },
          { n: 'Art. 8º',
            texto: 'São formas de provimento de cargo público: I — {{nomeação}}; II — promoção; V — readaptação; VI — {{reversão}}; VII — aproveitamento; VIII — {{reintegração}}; IX — recondução.',
            alternativas: ['exoneração', 'demissão', 'transferência'],
            refs: ['Lei 8.112/90, arts. 9º a 32'] }
        ]
      },
      {
        id: 'p3',
        titulo: 'Título II · Do Provimento, Vacância, Remoção, Redistribuição e Substituição',
        capitulo: 'Capítulo I · Do Provimento — Seção III · Da Posse e do Exercício',
        artigos: [
          { n: 'Art. 13',
            texto: 'A posse dar-se-á pela assinatura do respectivo {{termo}}, no qual deverão constar as atribuições, os deveres, as {{responsabilidades}} e os direitos inerentes ao cargo ocupado, que não poderão ser alterados unilateralmente, por qualquer das partes, ressalvados os atos de ofício previstos em lei.',
            alternativas: ['edital', 'contrato', 'vantagens'],
            refs: ['Lei 8.112/90, art. 7º'] },
          { n: 'Art. 13, § 1º',
            texto: 'A posse ocorrerá no prazo de {{trinta}} dias contados da publicação do ato de {{provimento}}.',
            alternativas: ['quinze', 'sessenta', 'exercício'],
            refs: ['Lei 8.112/90, art. 13, § 6º'] },
          { n: 'Art. 15',
            texto: 'Exercício é o efetivo desempenho das {{atribuições}} do cargo público ou da {{função de confiança}}.',
            alternativas: ['vantagens', 'cargo em comissão'],
            refs: ['Lei 8.112/90, art. 15, § 1º'] },
          { n: 'Art. 15, § 1º',
            texto: 'É de {{quinze}} dias o prazo para o servidor empossado em cargo público entrar em exercício, contados da data da {{posse}}.',
            alternativas: ['trinta', 'dez', 'nomeação'],
            refs: ['Lei 8.112/90, art. 13, § 1º'] }
        ]
      }
    ],
    questoes: [
      { titulo: 'Título I · Das Disposições Preliminares',
        enunciado: 'Segundo a Lei 8.112/90, os cargos públicos são criados por:',
        alternativas: ['decreto do Presidente da República', 'lei', 'portaria do órgão', 'resolução administrativa'],
        correta: 1,
        comentario: 'Art. 3º, parágrafo único: os cargos públicos são criados por LEI, com denominação própria e vencimento pago pelos cofres públicos.' },
      { titulo: 'Título I · Das Disposições Preliminares',
        enunciado: 'A Lei 8.112/90 institui o regime jurídico dos servidores civis da União, das autarquias e:',
        alternativas: ['das empresas públicas federais', 'das fundações públicas federais', 'das sociedades de economia mista', 'dos consórcios públicos'],
        correta: 1,
        comentario: 'Art. 1º: a Lei alcança a União, as autarquias (inclusive em regime especial) e as FUNDAÇÕES PÚBLICAS federais — empresa pública e sociedade de economia mista seguem a CLT.' },
      { titulo: 'Título I · Das Disposições Preliminares',
        enunciado: 'Sobre a prestação de serviços gratuitos na Administração, é correto afirmar:',
        alternativas: ['é livre, por ser favorável ao erário', 'é proibida, salvo os casos previstos em lei', 'depende apenas de autorização da chefia', 'é permitida para cargos em comissão'],
        correta: 1,
        comentario: 'Art. 4º: é PROIBIDA a prestação de serviços gratuitos, salvo os casos previstos em lei.' },
      { titulo: 'Título II · Do Provimento, Vacância, Remoção, Redistribuição e Substituição',
        enunciado: 'NÃO é requisito básico para investidura em cargo público:',
        alternativas: ['a nacionalidade brasileira', 'o gozo dos direitos políticos', 'a idade mínima de vinte e um anos', 'aptidão física e mental'],
        correta: 2,
        comentario: 'Art. 5º, V: a idade mínima é de DEZOITO anos — não vinte e um. Os demais itens estão no rol do art. 5º.' },
      { titulo: 'Título II · Do Provimento, Vacância, Remoção, Redistribuição e Substituição',
        enunciado: 'A investidura em cargo público ocorre com:',
        alternativas: ['a nomeação', 'a posse', 'o início do exercício', 'a aprovação no concurso'],
        correta: 1,
        comentario: 'Art. 7º: a investidura ocorre com a POSSE. A nomeação é forma de provimento (art. 8º, I) e o exercício é o efetivo desempenho (art. 15).' },
      { titulo: 'Título II · Do Provimento, Vacância, Remoção, Redistribuição e Substituição',
        enunciado: 'Os prazos para a posse e para entrar em exercício são, respectivamente:',
        alternativas: ['15 e 30 dias', '30 e 15 dias', '30 e 30 dias', '10 e 15 dias'],
        correta: 1,
        comentario: 'Art. 13, § 1º: a posse ocorre em 30 dias da publicação do ato de provimento. Art. 15, § 1º: o exercício começa em 15 dias contados da posse.' },
      { titulo: 'Título II · Do Provimento, Vacância, Remoção, Redistribuição e Substituição',
        enunciado: 'Às pessoas com deficiência serão reservadas, no concurso público, até:',
        alternativas: ['5% das vagas', '10% das vagas', '20% das vagas', '25% das vagas'],
        correta: 2,
        comentario: 'Art. 5º, § 2º: até 20% das vagas oferecidas no concurso, desde que as atribuições sejam compatíveis com a deficiência.' }
    ]
  }
];