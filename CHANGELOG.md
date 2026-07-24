# Histórico de versões — Viver o Quad (protótipo)

## 24/07/2026 — Ajustes do administrador · Controle interno (item 2)
- **Avisos · editar**: cada aviso enviado ganhou botão **Editar** (ao
  lado de Remover), que o traz de volta ao formulário; o botão vira
  "Salvar aviso" e a alteração vale **no lugar**, sem duplicar
- **Cronograma sincronizado com a criação de turmas**: os horários do
  Cronograma (e da "Aula de hoje" do aluno, e dos rótulos do editor)
  passam a **seguir o horário definido na turma**. Criar/editar uma
  turma com horário diferente **sincroniza** na hora — inclusive as
  faixas de "AGORA/ENCERRADO" saem do horário real da turma
- **Evento criado integra Loja + "Eventos da semana"**: evento pago da
  semana aparece **no carrossel do Início com a tag "Na Loja"**; clicar
  **leva o aluno à Loja** (a inscrição é lá); comprado, vira **"Inscrito"**
  no carrossel; e o evento **some** do carrossel e da Loja **quando a
  data passa** (pontual pela própria data, maratona pelo último dia)
- **Editar eventos já criados**: cada evento na lista tem botão
  **Editar** que o traz ao formulário (nome, resumo, modalidade, moeda,
  preço, data); salvar **atualiza para todos, inclusive quem já está
  inscrito** — o painel ainda mostra o **contador de inscritos** por
  evento
- Nova suíte `vfaseg` (15 checagens) verde; `vfasea` ajustada à nova
  regra do carrossel; todas as demais suítes (incl. tutorial) sem
  regressões

## 24/07/2026 — Ajustes do administrador · Controle/Relatórios/Loja (itens 1, 3 e 5)
- **Gift cards · "ver completo"**: os QR do lote não cabiam na tela
  (mostrava 6 de 20). Agora abrem **6 e um botão "Ver todos os N QR
  codes"** (colapso no padrão do ranking da sala), com "Mostrar menos"
- **Relatórios seguem a árvore do edital / Domínio**: os cálculos usam
  a **árvore atual** (não mais a fixa do CFO) — trocar o Domínio pela
  Estrutura ou por uma nova matrícula recalcula dificuldades, pedagógico
  e gerais na hora
- **"Alunos que precisam de apoio" · botão Acionar**: agora **abre o
  bloco "Mensagens individuais"** com o aluno pré-selecionado e um texto
  sugerido, pronto para enviar o recado individual (reaproveita a
  funcionalidade já existente)
- **Loja · editar produto**: cada item cadastrado ganhou botão
  **Editar**, que traz o produto de volta ao formulário "Cadastrar
  produto ou serviço"; ele **continua na Loja durante a edição** e só
  muda **ao salvar** (botão vira "Salvar alterações")
- **Loja · preços em Diamantes**: o editor "Preços da Loja" passou a
  mostrar e atualizar o preço na **moeda de cada item** (QdC **ou**
  Dmn), refletindo na vitrine do aluno e nos dados do produto
- Nova suíte `vfasef` (18 checagens) verde; todas as demais suítes
  (incl. tutorial completo) sem regressões

## 24/07/2026 — Ajustes do administrador · Controle Geral (item 1)
- **Banco de professores** (novo bloco no Painel de controle): nome,
  **matérias que ministra (até 3)**, **turnos de disponibilidade**,
  **graduação** (com opção "sem graduação"), **telefone**, e as ações
  de **desligar** e **bloquear acesso**. É a **fonte única do corpo
  docente** — alimenta "Professores por matéria" na criação de turmas
  (que passa a oferecer **só quem ministra aquela matéria e está
  ativo**) e a lista da área do professor. Casamento por prefixo
  (um professor de "Matemática" cobre "Matemática e Raciocínio Lógico")
- **Criação de turmas mais clara**: os campos soltos "Preço/Preço/Vagas"
  viraram uma grade **rotulada** (Preço em Diamantes · Preço em Quad
  Coins · Vagas totais · Dessas, em Quad Coins) com um **texto de ajuda**
  explicando a lógica (vendida nas duas moedas; vagas totais divididas,
  o resto fica em Diamantes). Confirmado que cria a turma e ela aparece
  em "Turmas · modalidades do Quad" na Quad Store
- **"Mensagem exclusiva para o aluno" → "Mensagens individuais"**: agora
  envia para **aluno ou professor**. Para o aluno, chega no "+" com
  contador; para o **professor**, aparece na **sala dele** com contador,
  e a leitura marca **LIDA** no histórico do admin
- **Bug dos gift cards corrigido**: "Ver QR codes" mostrava só 6 —
  agora exibe **todos** os cartões do lote (ex.: os 20 solicitados),
  com o total no cabeçalho
- Nova suíte `vfasee` (24 checagens) verde; todas as demais suítes
  (incl. tutorial completo) sem regressões

## 24/07/2026 — Pacote do aluno · Fase D (gift cards com QR + estorno)
- **Gift cards em lote com QR** (Painel de controle): a administração
  cria lotes (ex.: 100 cartões de 1.000 QdC **ou** Dmn); cada cartão
  nasce com **código e QR próprios, de liberação única** — usou,
  invalidou na hora. "Ver QR codes" mostra os cartões do lote (padrão
  ilustrativo na demo; impressão/leitura reais `[INTEGRAÇÃO REAL]`),
  com marcação USADO e contagem "X de Y resgatados"
- **Validar Gift Card no "+"** do aluno: abre o leitor com moldura de
  câmera e varredura; a leitura credita as moedas e **invalida o QR na
  mesma hora** (na demo, botão "simular leitura"). O **código do lote
  também vale digitado** no campo de gift card da Quad Store
- **Estornos · até 7 dias** (novo bloco na Quad Store): compras
  recentes com **contagem regressiva** (FALTAM X DIAS · ÚLTIMO DIA ·
  PRAZO ENCERRADO com botão desativado); estorno em **dois toques**
  ("Confirmar estorno?") devolve as moedas na hora. **Estorno de
  matrícula** devolve a vaga da moeda usada, desfaz a matrícula e
  **libera o turno** de novo
- **"Estornos e desistências"** no Painel de controle: registra quem
  estornou, o que estornou e o **ranking dos itens mais estornados**;
  o log de Compradores (Relatórios · Loja) marca ESTORNADO
- Nova suíte `vfased` (28 checagens) verde; todas as demais suítes
  (incl. tutorial completo) sem regressões — **fecha o pacote do aluno
  (Fases A–D)**

## 24/07/2026 — Pacote do aluno · Fase C (área do professor + Quiz da aula)
- **Área do professor reconstruída**: cadastro individual de ingresso
  (e-mail funcional + chave PROF-2026 na demo, escolha do professor no
  corpo docente); ao entrar, as **turmas em que o professor está
  inserido aparecem sozinhas** (vindas dos professores por matéria da
  criação de turmas), cada uma com as matérias dele
- **Quiz da aula por PDF**: dentro da sala, o professor cria o quiz
  anexando o **PDF** e escolhendo **múltipla escolha ou certo/errado**,
  nº de questões e **tempo** — extração real do PDF marcada
  `[INTEGRAÇÃO REAL]`. Criado ≠ ativado: quem decide a hora do start é
  o professor, na aula
- **Lado do aluno**: quiz criado → o selo "SEM QUIZ ABERTO" vira
  **"AULA COM QUIZ"**; ativado → **"AULA COM QUIZ ATIVO"** + botão
  **"Quiz"** na Aula de hoje. O quiz roda na estrutura do simulado
  (cronômetro, uma questão por vez), **sem gabarito e sem premiação**
  — as respostas vão direto ao professor. Quiz de outra turma não
  aparece para o aluno
- **Relatório da sala ao vivo**: respostas chegando (polling X/42,
  incluindo o aluno real da demo), **% de acerto por questão** e botão
  **"Relatório"** por questão com o **gráfico de alternativas**
  (Letra A 11% · Letra B 60% · … com a correta marcada); feedback dos
  alunos como placeholder EM BREVE; encerrar consolida o relatório
- Aposentado o fluxo antigo de quiz único do professor (abrir/fechar
  com card estático)
- Nova suíte `vfasec` (30 checagens) verde; todas as demais suítes
  (incl. tutorial completo) sem regressões

## 24/07/2026 — Pacote do aluno · Fase B (turmas de ponta a ponta)
- **Criação de turmas migrou para o Painel de controle**, completa:
  tipo (RONDESP/PATAMO/BOPE) + apelido; **concurso** (PMBA Soldado/CFO,
  fronteiras, GCM, PCBA, PPBA, PRF, **PF**); turno; datas; dois horários
  seguidos; **preço em Dmn E em QdC**; **vagas gerais e vagas em QdC**
  (gerais − QdC = Dmn); árvore do edital em PDF; **professores por
  matéria** da árvore do concurso (CFO lista as 13 matérias reais;
  concursos sem árvore usam matérias genéricas). A turma nasce na Quad
  Store e na Estrutura. Categoria "turmas" **removida** do cadastro de
  produtos da aba Loja
- **Quad Store — turma é UM item com as duas moedas**: extinto o item
  avulso "Vaga Quad Coin"; o card mostra vagas por moeda ("170 Dmn ·
  10 QdC") e os dois preços; o clique abre o **pop-up "Creditar em"**
  (Diamantes × Quad Coins, cada opção com preço e vagas restantes);
  a matrícula debita a moeda escolhida e a vaga daquela moeda
- **Bloqueio de turno**: matriculado num turno, as demais turmas do
  mesmo turno ficam INDISPONÍVEL (independe da moeda) até o término da
  turma — o aluno da demo (PATAMO Noite) vê as turmas noturnas
  bloqueadas e pode comprar as matutinas (novas seeds RONDESP/BOPE
  Manhã)
- **Matrícula manda no app**: a primeira matrícula ativa define a turma
  do Início (abaixo da patente), o ranking da sala e o **Domínio**
  (árvore do edital do concurso da turma). **Sem matrícula ativa** o
  app trava: aviso "Matrícula encerrada", só a Quad Store acessível,
  e a nova matrícula destrava tudo na hora
- Nova suíte `vfaseb` (27 checagens) verde; `vdmn`/`vinterno` ajustadas
  ao modelo novo; todas as demais suítes (incl. tutorial) sem regressões

## 24/07/2026 — Pacote do aluno · Fase A (login, eventos, Missões, Quad Store)
- **Login em UMA tela**: a página "verificando o cadastro" foi fundida à
  vinheta — a verificação da matrícula agora aparece dentro da própria
  vinheta (era a tela de carregamento duplicada); entrada ~1,4s mais
  rápida
- **"INSCRITO" no carrossel**: eventos garantidos (comprados ou com
  inscrição feita) mostram a tag dourada INSCRITO nos "Eventos da
  semana" do Início
- **Evento de vários dias permanece na Quad Store até acabar** (ex.:
  Semana Insana, SEG–SEX, 400 Dmn): comprado, fica na vitrine marcado
  INSCRITO até o último dia e some sozinho; produto pontual (aulão,
  mentoria, simulado) continua saindo na hora da compra
- **Missões**: card de treinamento com ícone novo (policial no stand de
  tiro); bloco de **Simulados** rediagramado em camadas — título + tag,
  detalhe em linha inteira e botão à direita, sem disputa de espaço
- **Quad Store** (antes "Loja Quad"): cabeçalho renomeado; bloco
  "Atividades e itens · presenciais"; seção "Isoladas" sem o subtítulo;
  14 divisórias de seção ganharam vida (barra azul + linha gradiente);
  **corrigida a sobreposição** do cabeçalho pelo bloco seguinte — a roda
  3D agora gira menos os cards altos (a borda de um card gigante invadia
  o vizinho)
- Nova suíte `vfasea` (20 checagens) verde; todas as demais suítes (incl.
  tutorial completo) sem regressões

## 24/07/2026 — Relatórios com gráficos (Fase 3)
- **Aba Relatórios reconstruída** com sub-navegação em 4 painéis
  (**Individuais · Turmas · Gerais · Loja**) e gráficos no tema da marca
  (colunas e rosca em CSS/HTML, sem bibliotecas externas):
  - **Individuais**: seletor de aluno; **uso do app** (logins por semana,
    colunas) com resumo; **compras QdC × Dmn** em rosca + legenda +
    histórico com datas; **pedagógico** (pontos fracos no Domínio);
    **reclamações** como placeholder. Trocar de aluno muda os gráficos
  - **Turmas**: seletor de turma; **dificuldades** reais (sub-assuntos,
    assuntos, matérias, da árvore de Domínio); **uso da sala** (colunas
    por dia); **alunos que precisam de apoio**; **presença** e
    **feedbacks** como placeholders
  - **Gerais**: **perfil médio** da base; **dificuldade pedagógica** por
    matéria (barras); **satisfação** como placeholder
  - **Loja**: **vendas por período** (colunas); **mais vendidos**
    (barras); **faturamento QdC × Dmn** (rosca); **entradas × saídas** de
    Quad Coins (colunas); **Compradores · últimas compras** (movido para
    cá, da aba Loja de governança)
- **Regra “ver completo”** aplicada aos Compradores (abre além das 5
  primeiras linhas), no padrão do ranking da sala
- Correção: cálculo por aluno usava deslocamento de bits com sinal
  (`>>`) sobre hash uint32, gerando colunas negativas — trocado por
  deslocamento sem sinal (`>>>`)
- Nova suíte `vrelatorios` (29 checagens) verde; `vcontrole`, `vinterno`,
  `vadmin`, `vestrutura`, `vdmn`, `vsim`, `vloja2/3` e o tutorial
  completo sem regressões

## 24/07/2026 — Painel interno completo (Fase 2)
- **Criação de turmas** no Painel interno: nome **pré-configurado pelo
  tipo** (RONDESP · Nivelamento, PATAMO · Regular, BOPE · Questões) +
  **apelido livre** (ex.: "Turma Águia"); **foco do concurso por estado**
  (Soldado PM-BA, Oficial CFO, PMs de fronteira, Guarda Municipal,
  Polícia Civil BA, Polícia Penal BA, PRF); início/término; **dois
  horários seguidos** (ex.: 19h–20h30 e 20h30–22h, o 2º começa quando o
  1º termina — validado); **árvore do edital por anexo**
  `[INTEGRAÇÃO REAL] leitura do arquivo`. A turma entra na hora na
  lista do painel **e na Estrutura**
- **Produtos digitais pré-configurados**: e-book, Vade Mecum digital,
  curso online e aulão exclusivo gravado — **sem estoque**, com toggle
  **DISPONÍVEL ↔ INDISPONÍVEL** que coloca/tira o produto da Loja
  (Itens digitais) na hora
- **Criador de skins**: nome, descrição, preço em **QdC ou Dmn** e
  banco de visuais (boina, camiseta, farda, colete, fuzil, medalha);
  publica direto em **Itens do personagem** com confirmação de compra;
  ✕ tira da Loja
- **Quests · missões especiais**: card com botão "Criar Quests" e selo
  EM BREVE (estrutura reservada, sem funcionalidade — como combinado)
- **Banco de ícones ampliado** no cadastro de produtos físicos (boina,
  farda, colete, fuzil, retirada presencial)
- Nova suíte `vinterno` (23 checagens) verde; `vcontrole`, `vadmin`,
  `vestrutura`, `vdmn`, `vsim`, `vloja2/3`, `vskin` e o tutorial
  completo sem regressões

## 24/07/2026 — Administrador em 5 áreas + Painel de controle (Fase 1)
- **Barra do administrador reconstruída em 5 áreas**: Painel de
  **controle** (nova, agora é a tela inicial) · Painel **interno** (a
  antiga "Hoje") · **Relatórios** (antiga "Alunos") · **Liberações** ·
  **Loja**. A Estrutura (turmas/concursos/editais) agora abre por um
  botão dentro do Painel interno
- **Painel de controle — governança das contas**:
  - **Crédito manual de Quad Coins e Diamantes** (valor livre para a
    administração, com motivo e histórico de lançamentos); o crédito
    **cai na carteira do aluno na hora** — é por aqui que a recarga do
    site e o gift card presencial se materializam
  - **Bloquear/desbloquear contas** com **suspensão imediata**: o aluno
    logado é derrubado na hora e vê o pop-up "Conta bloqueada — entre em
    contato com a administração"; enquanto bloqueada, o login é negado
    com o mesmo aviso
  - **Mensagem exclusiva para o aluno**: chega como recado no "+" do
    aluno com **contador vermelho estilo WhatsApp** no botão; abrir o
    chat zera o contador e marca a mensagem como **LIDA** para o
    administrador
  - **Chat ao vivo** presente no "+" como **EM BREVE** (mesmo padrão do
    GvG/PvP)
- Nova suíte `vcontrole` (19 checagens) verde; `vadmin`, `vestrutura`,
  `vdmn`, `vsim`, `vloja/2/3`, `vskin`, `vev`, `vacesso` e o tutorial
  completo sem regressões

## 24/07/2026 — Diamante (nova moeda) + Loja Quad reconstruída (Fase A)
- **Diamante**: nova moeda com a arte oficial do gestor, exibida **logo
  abaixo do Quad Coin** no topo. Não é conquistado em missões — é
  **comprado em dinheiro** (recarga no checkout do site
  `[INTEGRAÇÃO REAL]`; demo inicia com 150 Dmn) ou por **gift card de
  liberação única** (resgate na Loja; demo: QUAD-100 e QUAD-500, reuso
  bloqueado)
- **Loja Quad**: cabeçalho gráfico novo (herói azul com os dois saldos e o
  resgate de gift card); removidos os blocos "Intendência Quad" e "Como
  ganhar Quad Coins". Reorganizada em **dois macro-blocos**:
  - **Itens presenciais** — Turmas (RONDESP 1.800 · PATAMO 2.200 · BOPE
    2.600 Dmn com **170 vagas** + **10 vagas em QdC**), Isoladas (com
    professor à frente), Simulados presenciais, Eventos (aulões…),
    Excursões, Módulos (vade mecum/apostilas), Treinamento TAF e Outros
    (retirada na recepção)
  - **Itens digitais** — Cursos online, Simulados digitais, Mentoria,
    Eventos online, Itens do personagem e Itens de combate (mochila)
- **Confirmação em toda compra** (evita compra sem querer): itens de
  unidade única confirmam num modal; itens com estoque mantêm o seletor
  de quantidade — agora com a moeda certa no total
- **Preços por moeda**: cada produto vende em **QdC ou Dmn** ("30 Dmn"),
  com pílula azul e losango nos itens em Diamante; **estoque/vagas**
  decrementam na compra e o item **some do sistema ao esgotar**
- **Boina do tutorial** sai da vitrine assim que comprada
- **Admin**: cadastro de produto com **moeda (QdC/Dmn)** e categoria
  "Itens digitais" (sem estoque — disponível/indisponível); lançamento de
  **simulados** e **eventos pagos** com escolha da moeda; **separações
  visuais** (criar × já enviados) em Avisos gerais, Eventos da semana e
  Lançamento de simulados
- Nova suíte `vdmn` (35 checagens) verde; todas as demais atualizadas ao
  fluxo de confirmação e **sem regressões** (tutorial completo incluído)
- **Próximas fases combinadas**: 5 abas novas do admin (Painel de
  controle, Painel interno, Relatórios, Liberações, Loja), Painel de
  controle (crédito manual, bloqueio de conta, mensagens/chat no "+"),
  criação de turmas completa, produtos digitais pré-configurados,
  criador de skins, botão de Quests e Relatórios com gráficos

## 21/07/2026 — simulados unificados: lançamento único e fluxo por modalidade
- **Lançamento de simulados** agora é **um bloco só, na aba "Hoje"** (absorveu
  o antigo "Simulado presencial · lançar"): escolhe-se **modalidade**
  (presencial/digital) e **tipo** (gratuito/pago) num único formulário. A aba
  **Liberar** mantém apenas a **lista de inscritos** presenciais a liberar
- **Fluxos por combinação**:
  - **Presencial pago** → vai para a **Loja**. No bloco Simulados (Missões),
    "Inscrever" **conduz à Loja**; comprado, o status vira **INSCRITO** e a
    liberação entra na aba **Liberar**. Liberado na sede, o simulado vai para
    o **histórico de realizados**
  - **Presencial grátis** → inscreve direto; a liberação **pontua a presença**
    e envia ao histórico
  - **Digital pago** → aparece **na Loja**; comprado, abre em **Missões** para
    ser respondido (quiz cronometrado)
  - **Digital grátis** → aparece direto em **Missões**
- **Histórico de simulados realizados** (aluno) reúne presenciais liberados e
  digitais concluídos — base pedagógica de todos os simulados
- **Revisão dos vínculos** dos simulados com Loja, Missões, Liberar e
  cronômetro; removidos os formulários antigos (sem ids órfãos)
- Suíte `vsim` reescrita (25 checagens, 4 combinações) verde; `vadmin`
  atualizada; tutorial (`vtut`), `vloja`/`vloja2`/`vloja3`, `vestrutura`,
  `vmochila` sem regressões

## 21/07/2026 — Estrutura: concursos, modalidades, editais e Domínio
- **Concursos & editais**: a Estrutura lista os concursos do Quad — PM-BA
  (CFO e Soldado), PMs de fronteira (Soldado), Polícia Penal BA, Polícia
  Civil BA e PRF — cada um com a **sua árvore de edital** e a **situação**
  (Edital aberto · Proposta de edital para este ano · Reta final pós-edital),
  editável
- **Domínio conectado**: "Definir Domínio" troca a **árvore que o aluno vê**
  em Domínio (matérias/assuntos/sub-assuntos) e o cabeçalho, na hora. A
  árvore real de cada concurso entra pelo lançamento do edital
  <span>(`[INTEGRAÇÃO REAL]`; na V0, árvores-exemplo compactas para os não-CFO)</span>
- **Modalidades**: RONDESP (nivelamento), PATAMO (regular) e BOPE (questões)
  com a régua **teoria × questões** — 70/30, 50/50 e 20/80: quanto mais
  evoluída a turma, **menos teoria e mais questões**
- **Turmas**: abrir turma = **concurso × modalidade × período** (início e
  **término provável**); lista e remoção por ✕
- Nova suíte `vestrutura` (19 checagens) verde; tutorial (`vtut`), `vadmin`,
  `vprova`, `vgami`, `vturma`, `vsimdig` e demais sem regressões
- Com isso, **fecham as fases combinadas** (simulados presenciais, simulado
  digital e Estrutura)

## 21/07/2026 — simulado digital: PDF → quiz cronometrado
- **Lançamento no lugar certo**: o "Simulado digital" saiu de **Liberações**
  (que é para liberar) e foi para o hub **"Hoje"** do administrador
- **Fluxo do admin**: **anexa o PDF** → define o **tempo** (min) e o **nº de
  questões** → programa o **dia** de disponibilização. O sistema transforma
  o PDF em um **quiz padrão** <span>(`[INTEGRAÇÃO REAL]` a extração do PDF; na
  demo as questões saem do banco)</span>
- **Na Missões do aluno** (bloco "Simulados"): o digital aparece com o tempo
  e o nº de questões e o botão **"Responder o simulado"** quando chega o dia
  (antes disso, **"Em breve · disponível em DD/MM"**)
- **Quiz cronometrado**: abre com **cronômetro** regressivo (fica vermelho e
  pulsa nos 30s finais); ao **concluir** ou **zerar o tempo**, corrige e
  gera **+10 score e +2 Quad Coins por acerto**; depois fica **REALIZADO** e
  não repete
- Nova suíte `vsimdig` (17 checagens) verde; `vadmin` atualizada; tutorial
  (`vtut`), `vsim`, `vprova`, `vgami`, `vhero` e demais sem regressões
- **A construir (próxima fase)**: área de **Estrutura**
  (turmas/modalidades/editais → Domínio)

## 21/07/2026 — simulados presenciais + liberações; limpezas de UI
- **Bug corrigido**: o botão de inscrição do "Simuladão Quad" (e de todo
  simulado presencial **gratuito**) não funcionava — só dava um toast e
  nunca marcava inscrição. Agora inscreve de verdade e alimenta as
  Liberações
- **Simulados no modelo dos eventos**: a administração lança simulado
  presencial pela **agenda** (data + início + término) escolhendo
  **grátis (gera QdC)** ou **pago (custa QdC)**
- **Liberações reconstruídas**: todo inscrito (pago **ou grátis**) aparece
  agrupado por simulado; a administração **libera a entrada** e, nos
  simulados que geram QdC, a liberação **pontua quem compareceu** (credita
  QdC + score ao participante)
- **Limpeza 1**: removido o indicador **"Online"** do topo (o acesso
  offline já tinha sido aposentado)
- **Limpeza 2**: removido o bloco obsoleto **"Atividades online · links de
  acesso"** da Loja do administrador (eventos/simulados online já carregam
  o próprio link)
- Nova suíte `vsim` (14 checagens) verde; `vacesso` e `vadmin` atualizadas;
  demais suítes sem regressões
- **A construir (próxima fase)**: motor do **simulado digital** (PDF → quiz
  cronometrado que gera score/QdC) e a área de **Estrutura**
  (turmas/modalidades/editais → Domínio)

## 21/07/2026 — tutorial: aponta a boina direto (sem "área geral de itens")
- No tutorial, depois de ganhar os 25 Quad Coins, havia um passo que
  destacava o **card inteiro** de itens do personagem (boina + skins +
  combate) e mandava "tocar pra dar uma olhada" — e qualquer toque ali
  levava à boina. Essa **"área geral"** confundia
- Removido esse passo intermediário: o QUAD agora **aponta a boina
  diretamente** ("Aqui na Loja você equipa o seu personagem. Vamos começar
  pela boina… Toca nela!"), sem a área geral no meio
- `vtut` atualizada (checa que não há mais o passo da área geral e que a
  boina fica visível/clicável); tutorial completo verde

## 21/07/2026 — modelo de eventos: modalidade, gratuito/pago e horário fim
- **Evento agora tem data, horário de início E de término** (ex.: "QUA ·
  29/07 · 19H–21H30") — antes só a data e um horário
- **"Online/Presencial" virou modalidade (tópico), não nome de produto**:
  saíram da Loja os "produtos" *Evento online* e *Evento presencial*
- **Dois tipos de evento** (regra de negócio):
  - **Gratuito** — entra direto nos *Eventos da semana* do Início; ao
    participar, o aluno ganha **score e Quad Coins**
  - **Pago** — vai para a aba **Eventos da Loja**; ao ser comprado com Quad
    Coins, **migra para os Eventos do Início** e **sai da Loja** (já foi
    comprado). Evento online libera o **link** de acesso ao comprador
- O cadastro genérico de produto **não oferece mais "Eventos"** — evento se
  cria pelo fluxo de eventos (com modalidade, data/início/término, tipo e
  preço); cancelar um evento pelo ✕ também o remove da Loja
- Nova suíte `vevento` (21 checagens) verde; `vloja2`/`vloja3` ajustadas;
  `vev`, `vloja`, `vmochila`, `vbonus` e o tutorial (`vtut`) sem regressões

## 21/07/2026 — estoque/entrega na Loja, ícones, evento online e calendário
- **Tutorial destravado na compra da boina**: com o card "Itens do
  personagem" mais alto (boina + skins + combate), a boina saía da tela. O
  passo agora aponta **direto para a boina**, que fica sempre visível e
  clicável — o onboard segue sem travar
- **Calendário do aluno reflete as inscrições**: ao se inscrever em um
  evento, ele **entra de fato no calendário** (antes só dizia que entrava)
- **Fluxo de entrega dos itens presenciais**: comprou → **ADQUIRIDO**; a
  administração confirma a retirada → o aluno passa a ver **ENTREGUE ✓** e o
  item **volta a ficar disponível** para comprar de novo
- **Quantidade e estoque (3.1)**: itens presenciais abrem um seletor de
  **quantidade** (ex.: 2 garrafinhas) com total ao vivo; a administração
  define o **estoque**, que aparece no item e some quando **esgota**
- **Seletor de ícones (3.2)**: ao cadastrar um produto, a administração
  escolhe o **ícone** numa paleta pronta (turma, simulado, garrafinha,
  módulo, aulão, evento, chaveiro, camiseta…)
- **Evento online (3.3)**: criar um evento com **link** o marca como online;
  ele entra no carrossel com **resumo**, e o **inscrito** ganha o botão
  "Entrar no evento online" com o link
- **Cancelar/remover (3.4)**: a administração remove um produto ou cancela
  um evento pelo ✕ — sai da Loja / do carrossel / dos calendários na hora
- Novas suítes `vloja3` (19 checagens) e ajustes em `vloja2`/`vtut` verdes;
  `vloja`, `vev`, `vskin`, `vhero`, `vgand`, `vroupa`, `vmochila`, `vbonus`
  sem regressões

## 20/07/2026 — Loja reconstruída, agenda de eventos e cadastro de produtos
- **Bug do tutorial corrigido**: na etapa de escolher o personagem, dava
  para abrir a mochila (e travar o fluxo). Agora a área clicável do passo
  é **só a grade de personagens**, e a mochila (e os itens de combate) ficam
  **bloqueados durante o tutorial** — foco total na escolha
- **Loja reconstruída em 4 categorias**: (1) *Turmas e aulas*, (2) *Eventos*,
  (3) *Itens do personagem* — com a **sub-área "Itens de combate · vão para a
  mochila"** dentro dela — e (4) *Itens presenciais · retirada na recepção*:
  Garrafinha, Simulado físico, Chaveiro, Vade Mecum, Módulo impresso e
  Camiseta. Produtos físicos geram **pedido de retirada** para a recepção dar
  baixa
- **Agenda de eventos (admin)**: o campo de data do novo evento deixou de ser
  texto livre e virou **calendário + relógio** (clica na data e no horário);
  a prévia mostra "QUA · 29/07 · 19H30" antes de criar
- **Cadastro de produtos/serviços (admin)**: novo formulário na Loja do
  administrador — nome, descrição, **categoria** e preço em Quad Coins. O
  produto entra **na hora** na categoria certa da Loja do aluno (e no editor
  de preços); presenciais já saem com pedido de retirada
- Nova suíte `vloja2` (21 checagens) verde; `vloja`, `vskin`, `vgand`,
  `vroupa`, `vhero`, `vmochila`, `vev`, `vbonus` e o tutorial (`vtut`) sem
  regressões

## 20/07/2026 — recompensa da noite + limpeza do Perfil + Aula de hoje
- **"Itens do personagem" (chips de boina/skin) removido do Perfil**: era
  redundante — a boina e as skins/fardas conquistadas **já aparecem
  vestidas** na foto do personagem, e o que se guarda vai para a **mochila
  de combate**. Não há mais equipar/desequipar manual: **quem possui,
  veste** (comprar a boina/skin já troca a foto na hora)
- **Botão-recompensa da "Bloco da noite"**: ao concluir todas as missões
  da noite, o antigo "Missões da noite concluídas" (inerte) vira um
  **botão dourado "Retire aqui seus benefícios"** com ícone de moeda.
  Ao tocar: **+1 de Score por bloco da noite** (8 blocos → +8 de Score de
  carreira) **e +1 Quad Coin**, com um **efeito de moeda** que sobe, gira
  e voa até o contador (reforço positivo). Depois vira "Benefícios
  retirados" e não paga de novo
- **"Aula de hoje" atualiza ao abrir o Início**: o card se re-renderiza a
  cada visita ao Início, refletindo o cronograma da turma e o horário
  atual (além de já sincronizar quando a coordenação atualiza a planilha)
- Nova suíte `vbonus` verde; `vhero`, `vskin`, `vfoto2`, `vgand`,
  `vroupa`, `vmochila`, `vturma`, `vloja` e o tutorial (`vtut`) sem
  regressões

## 20/07/2026 — mochila de combate (Storage de itens)
- **Área de escolha de personagem removida do Perfil** — o personagem já
  foi escolhido no onboard e não muda com o tempo; o card passa a se
  chamar **"Seu personagem"** (só a foto e os equipamentos vestidos)
- **Nova mochila de combate**: um ícone de mochila no Perfil abre uma
  **Storage** onde ficam os itens comprados. A mochila mostra a quantidade
  guardada e um grid de compartimentos (cheios/vazios)
- **Loja ganhou "Itens de combate"**: itens comprados com Quad Coin que
  **não** são skin/farda vão direto para a mochila — Faca tática (40),
  Lanterna tática (35), Bússola de campanha (30), Broche de mérito (25),
  Cantil (20) e Corda de rapel (45). Comprar debita o saldo e marca
  **"NA MOCHILA"**; recomprar não debita
- Preparada para os **eventos de quest** futuros (reunir itens da mochila
  para formar um item novo) — a Storage já traz o aviso "Quests em breve"
- Nova suíte `vmochila` verde; sem regressões em skin, guarda-roupa,
  loja e tutorial

## 20/07/2026 — ajustes da prova + atalho de teste de carreira
- Removido o texto "Seu score e sua patente estão preservados…" da tela
  de reprovação da prova
- **[DEMO PROVISÓRIO]** botão no card de carreira "▶ Passar prova pelo
  gabarito (demo) · sobe 1 patente": promove uma patente por clique, para
  o gestor percorrer as 14 patentes e ver a evolução (insígnia, título,
  fase, trilha). Marcado no código para remoção posterior
- Corrigido erro na patente máxima (Coronel · sem pontos) na trilha

## 20/07/2026 — acesso pelo site, dados do banco e prova automática
- **Login do app = e-mail + senha + "Ainda não tem conta? Criar conta"**.
  A conta é criada no **checkout do site** (junto da matrícula); com a
  matrícula ativa, o banco de dados geral libera o acesso ao app.
  Removidos os passos de código por e-mail, ativação, cadastro interno e
  autorização de dispositivo
- **Todo 1º acesso roda o tutorial obrigatório** — o personagem termina
  o onboard **já com a boina**; depois ganha Quad Coins e compra o resto
- **Dados vêm do banco**: no tutorial, em vez de pedir "conte quem você
  é", o QUAD confirma — "Vi que você é **Fulano**, da **Turma X**, né?".
  Nome e telefone chegam pré-preenchidos; só o **nome de guerra** é
  digitado. Antes disso, a foto mostra **AL SD QUAD ______** (a lacuna),
  já que o nome ainda não foi escolhido
- **Prova de promoção sem fiscal humano**: ao clicar em "Realizar prova",
  entram **20 questões que o aluno já respondeu e classificou como
  difíceis** (Errei/Difícil) ao longo da jornada — sem revelar isso a
  ele, no mesmo formato das questões do tutorial. **80% (16/20) promove
  na hora**; abaixo disso, **nova tentativa em 24 horas**
- **Offline**: removido o carregamento automático de missões offline (e a
  fila "respostas aguardando envio"); offline agora é só indicador
- Novas suítes `vacesso` e `vprova` verdes; tutorial (`vtut`),
  promoção (`vgami`) e todo o restante sem regressões

## 20/07/2026 — guarda-roupa COMPLETO: todas as skins com foto oficial
- Processados os 9 lotes finais do gestor (54 fotos): **capa de colete,
  fuzil e fardas CIPE, PATAMO e BOPE — homens e mulheres, 12 personagens
  em cada traje**
- Com boina e gandola já publicadas, o guarda-roupa fecha em
  **7 variantes × 12 personagens = 84 fotos oficiais**: cada compra na
  cadeia da Loja veste a foto correspondente em todas as representações
  (card do Início, painel do Perfil e zoom)
- Farda escolhida veste a foto da unidade (CIPE/PATAMO/BOPE) e as
  outras duas fecham; recorte do miolo e mapeamento por rosto aplicados
  a todos os lotes
- Suíte `vroupa` (guarda-roupa completo + cadeia de ponta a ponta)
  verde; skins, gandola e tutorial sem regressões

## 20/07/2026 — capa de colete: fotos femininas (5 de 6)
- Lote mulheres com boina + gandola + colete **completo** (6–11) —
  comprar a **Capa de colete** veste a foto oficial; falta o lote
  masculino

## 20/07/2026 — gandola completa (12/12) · troca em todas as representações
- Entrou o homem negro de corte fade (4): **boina e gandola completos
  para os 12 personagens**
- Regra confirmada e testada: **comprar uma skin troca a foto do
  personagem em todas as representações do jogo** — card do Início,
  painel do Perfil e zoom trocam juntos; a prévia da escolha também
  volta para "o que estiver vestido" (corrigido)
- Toda skin futura (colete, fuzil, fardas e novos itens) segue a mesma
  regra automaticamente

## 20/07/2026 — gandola masculina (5 de 6)
- Lote homens com boina + gandola: corte militar (5), loiro (0), pardo
  raspado (1), ruivo (2) e careca (3) — **gandola em 11 dos 12
  personagens**; falta só o homem negro de corte fade (4)

## 20/07/2026 — gandola feminina completa · sem selos sobre a foto
- Entrou a "negra, cabelo curto" (10) — **gandola feminina completa**
- **Selo azul de equipado removido** da foto do painel (a boina aparece
  na própria arte, o selo virou ruído) — mesma reclamação da borda,
  resolvida na raiz
- O **anel colorido por skin virou reserva**: só aparece quando a
  variante ainda não tem foto oficial; com arte no lugar, nenhuma moldura

## 20/07/2026 — gandola: fotos femininas + esteira multivariante
- Lote **mulheres com boina e gandola**: preto liso (6), loira (7),
  ruiva (8), castanho curto (9) e tranças (11) — comprar a **Gandola**
  na cadeia veste a foto oficial; falta a "negra, cabelo curto" (10)
  e o lote masculino
- Build generalizado: token único `__FOTOS_VARIANTES__` injeta todas as
  variantes de `fotos/<variante>-<índice>.webp` (boina, gandola, colete,
  fuzil, cipe, patamo, bope) — lotes novos entram sem mexer em código
- Personagem sem arte da variante cai no degrau anterior (boina → base),
  nunca numa foto errada; recorte do miolo aplicado na esteira
- Suíte `vgand` verde; boina e cadeia de skins sem regressões

## 20/07/2026 — encaixe das fotos com boina corrigido
- As artes vinham com a moldura do gabarito (fundo bege + anel branco) e
  o personagem ficava encolhido no círculo; agora cada foto é **recortada
  no miolo** (só o círculo interno) e preenche o avatar igual à foto base
- Recorte proporcional aplicado aos 12 personagens; ativos regenerados

## 20/07/2026 — fotos oficiais com boina (homens) no guarda-roupa
- As artes do gestor entraram no app: **comprar a boina troca a foto do
  personagem de verdade** — card do Início, preview do Perfil e zoom
- Lote masculino **completo**: loiro (0), pardo raspado (1), ruivo (2),
  careca (3), negro corte fade (4) e corte militar (5)
- Lote feminino **completo**: preto liso (6), loira (7), ruiva (8),
  castanho curto (9), negra cabelo curto (10) e negra com tranças (11)
  — **os 12 personagens têm foto oficial com boina**
- Ativos em `fotos/boina-<índice>.webp` (320px); token `__FOTOS_BOINA__`
  no build (python e build.ps1); avatar sem variante segue na foto base
- Suíte `vfoto2` (4 checagens com as fotos reais) verde; tutorial, herói
  e skins sem regressões

## 20/07/2026 — guarda-roupa do personagem pronto para as fotos
- Estrutura unificada `AVATAR_VARIANTES` (variante → avatar → recorte):
  **comprar a boina no tutorial, equipar/guardar pelo chip do Perfil e
  vestir skins agora trocam a foto do personagem** pela mesma engrenagem
  (card do Início, preview do Perfil e zoom)
- Falta só a arte: os 4 PDFs/imagens do gestor (6 personagens base +
  versões com boina) preenchem o mapa e a troca passa a ser visual;
  a mesma lógica servirá para as skins futuras
- Prioridade da foto: skin vestida > boina equipada > personagem base
- Suíte `vfoto` (variantes injetadas) prova a troca de ponta a ponta;
  tutorial, skins, Loja e herói sem regressões

## 20/07/2026 — robô de ajuda só na área do aluno
- O QUAD (boneco de ajuda) **não aparece mais na área do administrador**;
  segue normal na área do aluno (balão de 10s incluído)
- Correção do caso que escapava: **logar com o perfil Administrador já
  selecionado** disparava o balão "Precisa de ajuda?" — agora o balão
  só nasce com o perfil do aluno ativo

## 20/07/2026 — área do administrador (N.P.P.), conectada ao app inteiro
- **Acesso com liberação**: entrar como Administrador exige e-mail
  funcional + chave emitida pela direção (demo: NPP-2026) — cadastro
  específico de quem dá suporte ao aluno que opera o sistema
- **Hoje (operação do dia)**: envia **Avisos gerais** com escopo por
  turno (M·T·N) e modalidade (RONDESP nivelamento · PATAMO regular ·
  BOPE questões) — o card do aluno foi renomeado de "Avisos do
  professor" para **"Avisos gerais"** e filtra pela turma dele;
  **atualiza o cronograma** por turma/dia/tempo (a "Aula de hoje" do
  aluno muda na hora); **cria eventos e regras de score/Coins** que
  alimentam o carrossel e as páginas de evento
- **Liberar**: produtos presenciais comprados com QdC viram **pedidos de
  retirada** (baixa na entrega); **simulado presencial da semana** é
  lançado à venda por QdC, a inscrição do aluno debita e o coloca na
  **lista de compradores**, onde a administração **libera a entrada**;
  **simulados digitais** lançados aparecem na área do aluno
- **Alunos**: maiores dificuldades **reais** — top sub-assuntos,
  assuntos e matérias calculados da mesma árvore de Domínio do aluno
  (o Treinamento Rápido move os números) + lista de apoio
- **Loja (governança)**: editor de **preços** (vale na hora, inclusive
  skins), **log de compradores** (alimentado por cada compra real) e
  **links de atividades online** entregues junto da compra
- Estrutura (Turmas · Edital · Questões) preservada na 5ª aba
- Suíte `vadmin` (9 cenários de ponta a ponta) verde; treinamento,
  Loja, skins, eventos, tutorial, herói e acesso sem regressões

## 20/07/2026 — fardas finais: preços oficiais e escolha única
- **CIPE 500 · PATAMO 750 · BOPE 1300 QdC**
- **Comprou uma, fechou**: a escolhida fica ADQUIRIDO e as outras duas
  viram INDISPONÍVEL (acinzentadas, sem compra, sem débito)
- Suíte `vskin` ajustada à regra; tutorial e Loja sem regressões

## 20/07/2026 — cadeia de skins do personagem
- Ao lado da boina (que o tutorial já faz comprar), o slot de skin virou
  uma **cadeia progressiva**: **Gandola (60 QdC) → comprada, some e entra
  a Capa de colete (120) → Fuzil (200) → fardas finais à escolha:
  CIPE · PATAMO · BOPE (300 cada)** — o aluno pode comprar qualquer uma
  (e juntar as três)
- **Cada compra troca a foto do personagem**: a estrutura está pronta —
  o gestor está preparando o PDF com as artes; até lá o anel da foto
  muda de cor por skin e o chip "Itens do personagem" mostra a skin
  vestida (`SKIN_FOTOS` marcado com `[ARTE PDF]` no código: preencher
  id → recorte e a troca real acontece)
- Chips-teaser do perfil (Colete/Quepe "em breve") substituídos pelo
  chip real da skin
- Suíte `vskin` (6 cenários) verde; tutorial (bronca do item caro agora
  na Gandola), Loja e herói sem regressões

## 20/07/2026 — moeda oficial do Quad Coin
- A arte oficial da moeda (dourada, "QUAD CONCURSOS" com o Q da marca)
  **substitui o desenho provisório em SVG** nos três pontos do app:
  card Quad Coins do Início, saldo da Loja e regras de coins das
  páginas de evento
- Ativos novos: `quad-coin.png` (arte master) e `quad-coin.webp`
  (256px, embutido no build via token `__QUAD_COIN__` — build.ps1
  atualizado); símbolo SVG antigo e gradientes exclusivos removidos
- Loja, eventos, tutorial (compra da boina) e herói sem regressões

## 20/07/2026 — "Precisa de ajuda?" temporizado
- O balão do robô **aparece quando o aluno loga e some sozinho em 10
  segundos** (antes ficava fixo na tela); vale para o login normal, a
  entrada offline e o fim da instrução inicial
- Suíte `vhint` (5 verificações, com cronômetro real) verde; central de
  tutoriais e tutorial completo sem regressões

## 20/07/2026 — instrução fora da conta · zoom com nome de guerra
- **"Introdução no Quad" saiu da conta do Bloco da noite** (é instrução,
  não missão): o cartão agora marca 0/8; concluída, ela só desaparece
  da lista — e os blocos do dia **renumeram a partir do 1**
  (Bloco 1 · Dir. Constitucional, Bloco 2 · Matemática)
- **"Continuar missão" abre direto a 1ª missão pendente da noite**,
  mesmo com a Introdução ainda na lista
- **Zoom da foto (clicar e segurar) mostra o nome de guerra** — ex.:
  AL SD QUAD MOURA — na foto do Início e na do Perfil; durante a
  **escolha** do personagem o rótulo do catálogo continua
  ("Homem · cabelo loiro")
- Segurar-para-ampliar refeito por **delegação**: passa a funcionar
  também sobre as cópias da rolagem infinita do Início (antes só o
  original respondia)
- Suíte `vhero` atualizada (6 cenários, agora com login real e o gesto
  de segurar de verdade); tutorial, treinamento, acesso e promoção verdes

## 20/07/2026 — Bloco da noite refeito: só as missões da noite
- **"Missão principal" → "Missão de hoje"**; o cartão herói agora é o
  espelho exclusivo das **missões daquela noite** (nunca atrasadas nem
  simulados)
- **"Continuar missão" vai só às missões da noite**: com o Bloco 1
  pendente mostra a lista; depois, **abre direto o próximo bloco** ainda
  não resolvido; tudo concluído → botão vira "Missões da noite concluídas"
- **Prazo removido do cartão** (a expiração é individual, por missão);
  no lugar, status vivo "FALTAM N" / "COMPLETO"
- **Contador refeito**: missões concluídas / total da noite (ex.: 2/9);
  cada missão registrada como concluída acende **mais um segmento** da
  nova trilha
- **Design mais tecnológico**: trilha segmentada chanfrada com brilho,
  grade técnica sutil na placa, contagem com glow — tudo na paleta azul
- Limpeza: removido o código morto do quiz antigo de missão (barra
  10/20 fixa, "EXPIRA EM 2H12", ramo `source: missao`)
- Nova suíte `vhero` (6 cenários) verde; tutorial, treinamento e acesso
  sem regressões

## 19/07/2026 — turma do cadastro sincroniza o app inteiro
- O cadastro automático agora preenche **TURMA PATAMO (N)** (antes vinha
  "PC-BA Noite · PATAMO", um formato que não existia no app)
- Ao concluir o cadastro, a turma confirmada **passa a valer no app
  todo**: card do Início, Quadrômetro, perfil, ranking da sala e o
  cronograma da "Aula de hoje" — espelho do cadastro geral da turma no
  site (`[INTEGRAÇÃO REAL]` marcado no código)
- Verificado com outra turma no campo (TURMA RONDESP (M)) para provar a
  sincronização de ponta a ponta; suíte `vconta` agora com 5 cenários

## 19/07/2026 — "Criar conta" de volta à validação por e-mail
- A tela do código ganhou a quarta saída que faltava: **"Ainda não tem
  conta? Criar conta"** — é a criação da conta que dispara a automação
  do **onboard obrigatório** (cadastro com busca automática na
  plataforma-base → dispositivo autorizado → tutorial do QUAD)
- O fluxo de cadastro já existia, mas ficou órfão numa revisão anterior:
  só era alcançável pelo cenário raro "conta não ativada"; agora tem
  entrada direta, com o e-mail já preenchido
- **Voltar consciente da origem**: quem entra no cadastro pelo código
  volta para o código; quem entra pela ativação volta para a ativação
- Nova suíte `vconta` (4 cenários) cobrindo o caminho completo até o
  tutorial disparar; acesso, tutorial e treinamento seguem verdes

## 19/07/2026 — Atrasadas e Simulados no mesmo padrão do "Hoje"
- **Atrasadas**: blocos que estouram os 7 dias sem resposta **caem
  automaticamente ali** (não somem mais) — card de tamanho médio com
  rolagem interna, botão **Recuperar** abre os mesmos flashcards e, ao
  concluir, a linha desaparece; lista vazia elogia a disciplina
- **Simulados**: mesma configuração — os simulados **enviados pelo admin
  aparecem na lista** (Simulado 63 · SD PMBA, Simuladão Quad, Simulado
  digital · CFO), com Inscrever (presenciais → calendário) e Abrir
  (digital → aplicação completa na V1)
- Suíte do treinamento: 27 verificações passando

## 19/07/2026 — bloco "Hoje" enxuto: regras internas fora da tela
- Removidos da interface: o texto explicativo do agendamento, o horário
  "22h15" e o link "liberar (demo)" — **regras internas ficam no sistema**;
  o bloco simplesmente aparece quando é liberado
- **Bloco concluído desaparece da lista** (inclusive o Bloco 1 · Introdução,
  que reaparece ao refazer a instrução); sem resposta, o bloco **expira em
  7 dias** após ser criado (regra no código, invisível ao aluno)
- **Rolagem interna**: o card "Hoje · questões novas" tem tamanho médio
  (~264px) e as missões rolam dentro dele
- Rótulos sem jargão (sem D0/D+1): "aula de hoje · 19h", "aula de ontem",
  "semana passada", "mês passado"

## 19/07/2026 — rápidas do dia dentro do "Hoje" (correção do modelo)
- **Removido o card "Aula → flashcards · repetição espaçada"** — era uma
  materialização errada: o agendamento do PDF 01 pertence DENTRO do bloco
  "Hoje · questões novas", não num card à parte
- **"Hoje · questões novas (3 + 8 × 10)"**: Bloco 1 · Introdução (3) +
  **Blocos 2 e 3 = as duas aulas de hoje** (Dir. Constitucional 19h e
  Matemática 20h30 · D0) + **revisões**: 2×10 de ontem (D+1), 2×10 da
  semana passada (D+7) e 2×10 do mês passado (D+30) — tudo liberando às
  **22h15** (com "liberar (demo)" para testes)
- Respondidas, as rápidas **entram no banco do Treinamento Rápido**
  (que segue sendo PDF 02 + PDF 01 já resolvido)
- Título do card: "Questões rápidas para revisão!"; caminho morto do quiz
  antigo de missão limpo (Bloco 3 estático e botão Iniciar removidos)
- Suíte do treinamento: 19 verificações passando

## 19/07/2026 — Treinamento Rápido: flashcards estilo Anki (substitui a "Nova missão")
- **Pipeline aula → flashcards**: aula presencial gravada → operador extrai
  2 PDFs. PDF 01 = 40 certo/errado da fala do professor, liberados em
  **4 ondas de 10** (D0 às 22h15 · D+1 às 22h15 · D+7 · D+30 — repetição
  espaçada); respondidas, as cartas **migram para o banco geral**. PDF 02
  alimenta o banco direto. Card das ondas na aba Missões com estados
  (bloqueada/responder/FEITO) e liberação demo
- **Treinamento Rápido** (novo card no lugar da "Nova missão"): duas abas —
  **Gerais** (Português, Inglês, Informática, Matemática, História,
  Geografia) e **Específicas** (os 7 Direitos). **Rodízio de 10 por
  assunto alternando as matérias**: Interpretação (PT) → Interpretação
  (EN) → Editores de texto → Conjuntos numéricos → …; na volta, entra o
  2º assunto de cada matéria
- **Flashcard clássico**: enunciado + CERTO/ERRADO → gabarito na hora com
  comentário da aula → autoavaliação **Errei / Difícil / Bom / Fácil**
- **Pagamento**: +1 score por acerto · +5 Quad Coins por bloco de 10 ·
  a barra do **Domínio** do assunto treinado se move (68%→73% com 9/10);
  métricas calibradas ficam para a V2
- **Zerou a aba → redistribuição**: o baralho volta ordenado pela
  dificuldade informada (Errei/Difícil primeiro)
- **Banco V0**: 100 cartas autorais etiquetadas pela árvore CFO — 6
  baralhos de assunto (60) + a aula demo de Poderes administrativos (40)
- Suíte própria: 17 verificações (rodízio, feedback, pagamento, Domínio,
  ondas, migração para o banco)

## 19/07/2026 — confirmação do avatar, título capitalizado e zoom no beat final
- **Escolha do avatar em duas etapas**: segurar inspeciona quantos quiser;
  um toque simples mostra o candidato na prévia e o QUAD pergunta
  "Esse <arte> é o personagem que você escolheu?" — **"Sim, é esse!"**
  aplica (grid recolhe); **"Ver outros"** devolve a prévia e o grid para
  continuar olhando, quantas vezes precisar
- **Nome de guerra sempre capitalizado** no título e nas exibições
  ("clara" → "Clara"); nota do título atualizada: o nome de guerra pode
  ser mudado refazendo a instrução inicial, na central do QUAD
- **Beat final da boina virou ação**: "Clica e segura na sua foto pra ver
  como ele tá agora" — segurar amplia o personagem atual e avança ao
  soltar; o toque simples fica bloqueado nessa etapa (fora do tutorial,
  toque entra no perfil e segurar amplia, como sempre)
- Suíte: 84 verificações passando

## 19/07/2026 — segurar para ampliar, regra do nome de guerra e Bloco 1
- **Segurar para ampliar o personagem**: pressionar e segurar a foto (no
  card, na prévia do perfil e em cada opção do grid) abre a foto grande em
  círculo com o nome da arte; soltar fecha — e no grid, segurar NÃO escolhe
  (toque rápido escolhe). O beat da foto virou ação ("Clica nela e segura")
  e o da escolha ganhou a dica de inspecionar antes de decidir
- **Botão "Trocar personagem" removido** — a escolha é definitiva (refazer a
  instrução reabre o grid)
- **Nome de guerra tem que vir do nome completo**: um dos nomes ou uma
  combinação em ordem (Danilo, Ribeiro, Moura, Danilo Moura…) — nunca o
  nome inteiro, nunca apelido; vale no tutorial (fala ensina com exemplos do
  próprio nome do aluno) e no salvar normal do perfil
- **Bloco 1 · Introdução no Quad**: a missão de instrução agora vive na
  lista "Hoje · questões novas (3 + 10 + 10)" como primeiro bloco; ao
  concluir vira **FEITO ✓**; os blocos existentes renumeraram para
  Bloco 2 (Português) e Bloco 3 (Dir. Administrativo)
- Corrigido avanço duplo ao soltar o zoom (trava de avanço pendente)
- Suíte: 76 verificações passando

## 19/07/2026 — telas de acesso reorganizadas (verificação e código)
- **Verificação (página 2)**: o próprio **símbolo do Quad virou o
  carregamento** — anel girando ao redor dele com respiração suave — e
  sobrou uma única linha: "Verificando o cadastro de <e-mail>". Saíram o
  spinner separado, o título e o chip (4 itens viraram 2)
- **Código (página 3)**: ações reorganizadas — **Reenviar código** e
  **Entrar com senha** lado a lado como botões, e **Trocar e-mail**
  discreto abaixo; mesmo padrão aplicado à tela de senha (Esqueci a senha
  | Código por e-mail)

## 19/07/2026 — confirmação do nome de guerra no tutorial
- Novo beat após digitar o nome de guerra: o QUAD pergunta **"Você quis
  dizer CLARA? Confirma?"** (nome interpolado) com dois botões no balão —
  **"Sim, confirmo!"** avança para o Salvar; **"Não, quero mudar"** limpa o
  campo e volta para a digitação, quantas vezes precisar
- Infra de beats com opções (`opts`) no balão — reutilizável para futuras
  escolhas dentro de tutoriais
- Suíte: 67 verificações passando (confirmar, mudar e reconfirmar testados)

## 19/07/2026 — turma do aluno em todas as identidades
- **TURMA PATAMO (N)** agora aparece abaixo do nome/patente em todos os
  pontos de identidade: card principal (já existia), resumo do Quadrômetro,
  card de Progressão de carreira — tudo derivado da mesma matrícula
  (`ALUNO_TURMA`)
- **Ranking da sala corrigido**: o cabeçalho dizia "PC-BA Noite" (fixo);
  agora mostra a turma real do aluno — "Ranking da sala · PATAMO (N) · 42
  alunos"

## 19/07/2026 — tutorial: fala no lugar certo e refazer 100% do zero
- **Balão não salta mais no meio da fala**: a ordem virou silenciar →
  rolar até o alvo → posicionar balão/robô → só então falar (antes a
  digitação começava na posição do beat anterior e o balão pulava)
- **Refazer limpa também nome, telefone e nome de guerra**: as etapas de
  preenchimento voltaram a aparecer no refazer (elas se auto-pulavam com os
  campos cheios, o que parecia "sumiço" e falta de resposta ao digitar)
- Suíte: 62 verificações passando

## 19/07/2026 — remoção do selo azul na foto do personagem
- O selo de boina sobre a foto do card (renderizava azul na paleta) foi
  removido — a foto fica limpa; o estado "equipada" segue visível nos itens
  do personagem, no Perfil do aluno
- Fala do beat da boina ajustada: "tá guardada nos itens do seu personagem
  — em breve ele aparece vestindo ela" (a arte do avatar com boina fica
  para quando existir a imagem)

## 19/07/2026 — tutorial: nome ao vivo, missão 3 de 3 e bronca da skin
- **Nome principal muda ao vivo**: enquanto o aluno digita o nome de guerra,
  o card lá em cima já vira "AL SD QUAD <NOME>" na hora (não só ao salvar) —
  vale no tutorial e no uso normal do Perfil do aluno
- **Missão de instrução exige as 3 corretas**: acertar 2 de 3 também reprova
  (sem as 3 não existem os 25 Quad Coins da jornada); o QUAD relança as
  perguntas em loop até o aluno gabaritar
- **Etapa da compra virou escolha real**: a vitrine inteira fica aberta; se
  o aluno clicar na skin de 300 QdC, o QUAD avisa — "Infelizmente você não
  pode comprar este item — ele é mais caro do que o que você possui!" — e
  devolve a escolha, até ele pegar a boina; aí avança
- **"Refazer instrução inicial" saiu do Perfil do aluno** — agora vive só na
  central de tutoriais do mascote
- Suíte: 60 verificações passando

## 19/07/2026 — central de tutoriais do QUAD (clique no mascote)
- Clicar no robô não mostra mais a dica antiga mal diagramada: agora a tela
  **escurece**, o QUAD **cresce** (1,9×, acenando) e abre a caixa
  "**O que você quer aprender agora?**"
- **6 tutoriais listados**: realizar uma missão, lógica dos Quad Coins,
  Pré-TAF, Árvore do edital, Aula de hoje e prova de promoção — cada um
  levará a um tutorial guiado como o inicial; na V0 respondem
  "Este tutorial está em construção", com voltar às opções
- Botão **"Refazer a instrução inicial"** funcional na própria central
  (o de dentro do Perfil do aluno continua)
- Fechar por "AGORA NÃO" ou tocando fora da caixa

## 19/07/2026 — fala do QUAD em ritmo humano + gestos por conteúdo
- **Digitação caractere a caractere** (~30ms por letra), respirando nas
  vírgulas (160ms) e pausando nos pontos (330ms) — ritmo de conversa real,
  não mais palavra a palavra acelerada
- **Gestos diferentes por conteúdo**: cada humor tem sequência e cadência
  próprias enquanto a fala sai — aceno largo na saudação, explicação calma
  nos conceitos, braço firme apontando nas ações, vibração rápida nas
  conquistas, acompanhamento leve nos formulários e continência na
  despedida; ao terminar a fala, descansa
- Sinal `data-typing` no balão (usado pela suíte para sincronizar)

## 19/07/2026 — tutorial do QUAD: fala viva, loop da missão e balões corrigidos
- **Balões reposicionados**: o robô maior estava parado NA FRENTE do balão
  (cobria "Esse é você agora" e outros beats); folgas recalculadas para a
  escala 1,32× — o robô fica sempre abaixo (ou acima) do balão, nunca sobre
- **Fala datilografada**: as palavras aparecem no balão como se o QUAD
  estivesse falando (palavra a palavra); um toque completa a fala, o
  seguinte avança
- **QUAD gesticula enquanto fala**: durante a fala os braços alternam como
  quem explica; quando termina, descansa — a impressão é de explicação viva
- **Missão de instrução com loop de reprovação**: agora é uma resposta por
  questão (mostra a correta quando erra); se errar as 3, o QUAD diz "Você
  ainda não conseguiu pontos suficientes para avançarmos — vou lançar as
  perguntas novamente!" e relança, em loop, até o aluno acertar; o resultado
  informa "você acertou X de 3"
- **Skin de personagem sobe para 300 QdC**: no tutorial só a boina é
  comprável (o aluno tem 25); tentar a skin mostra "Quad Coins
  insuficientes"
- Suíte: 52 verificações passando

## 19/07/2026 — tutorial do QUAD: diálogo em beats + acabamento
- **Roteiro reescrito como conversa**: cada operação virou 2 falas curtas
  (28 beats no total) — "Tá vendo a sua foto ali em cima? Vamos começar
  tocando nela!" → "É por ela que a gente entra no seu perfil." O QUAD
  dialoga, não palestra
- **Robô 32% maior** e reposicionado um pouco para dentro da tela
- Removida a frase "Complete a ação indicada para continuar" — o próprio
  bloqueio ensina; **"PRÓXIMO ›" pequeno no cantinho** (era "Avançar" e
  brigava com o robô)
- **Fala pós-compra corrigida**: destaca o card de Quad Coins (que agora
  fica visível) e diz o saldo real — "tinha 25, ficou com 5 Quad Coins"
  (número dinâmico; antes o texto falava do saldo sem mostrá-lo)
- Suíte reescrita para os 28 beats: 50 verificações passando

## 19/07/2026 — tutorial do QUAD: auditoria e 6 correções
- **Janela informativa vazava cliques** (crítico): nas falas sem ação dava
  para clicar no elemento iluminado e navegar por trás do tutorial (ex.:
  card de Coins abria a Loja). Agora o anel captura o toque — e avança
- **Avanço no meio da digitação**: bastavam 2 letras para o tutorial pular
  a etapa do nome de guerra enquanto o aluno ainda digitava; agora só
  avança após ~1s sem digitar (dados e nome de guerra)
- **Softlock do "falta avatar"**: no erro de validação do salvar, escolher
  o avatar não era registrado (só valia na etapa própria) e o salvar
  falharia para sempre; escolha agora registra em qualquer etapa
- **Refazer pulava a escolha do avatar** e elogiava sem escolha; refazer
  agora exige escolher o personagem de novo
- **Compra acidental na vitrine**: na etapa "veja os itens", clicar num
  item comprava; agora essa etapa é só visual (compra é na seguinte)
- **Farm da missão de instrução**: após o tutorial o botão "Iniciar missão"
  continuava ativo pagando +30/+25 por rodada; agora encerra ("concluída ✓")
- Suíte ampliada para 44 verificações (todas as falhas viraram testes)

## 19/07/2026 — tutorial do QUAD: revisão de UX pelo fundador
- **Balão claro**: fundo branco com texto escuro e palavras-chave em azul
  (o azul sólido estava carregado); rabinho sempre apontando para o QUAD
- **Avanço discreto**: sem botão dentro do balão — "Avançar ›" pequeno na
  parte inferior e **qualquer toque do meio para a direita da tela** passa a
  fala (nas etapas de ação continua valendo só a ação)
- **QUAD circula pela tela**: aparece em cantos diferentes conforme a etapa
  (inferior direito/esquerdo, superior direito) com **gestos por assunto** —
  acena na chegada, aponta nas ações, comemora nas conquistas, continência
  no encerramento (sprite + animações CSS); mesmo robô do mascote do canto
- **Destaque da escolha de avatar corrigido**: ilumina o quadrado inteiro
  e a setinha indica exatamente o grid de personagens
- **Fundo travado de verdade**: roda do mouse e arrasto não rolam mais a
  tela atrás do filtro escuro (preventDefault em wheel/touchmove)
- **Textos reescritos** em linguagem humana e direta ("Oi! Eu sou o QUAD…"),
  com o nome de guerra real do aluno interpolado na fala da identificação
- **Score sempre zerado no tutorial** (é o começo do jogo): também no
  Refazer — zera score/Coins, devolve a boina à Loja e o estado final é
  constante (+30 score, 5 Coins e boina), sem acúmulo por repetição
- Nome de guerra agora aceita **apenas letras**; retomada V0 recomeça a
  instrução do início (sem backend não há estado do meio para restaurar)


## 19/07/2026 — tutorial obrigatório do QUAD (roteiro completo de 19 etapas)
- **Mascote renomeado para QUAD** (robô do canto); tutorial substitui o tour
  antigo de 9 passos e segue o roteiro oficial do fundador
- **Mecânica da referência** (vídeo de jogo): fundo escurecido em 4 painéis,
  alvo iluminado com anel dourado pulsante + seta animada, balão de diálogo
  com palavras-chave em destaque e o QUAD no canto inferior direito; nas
  etapas de ação o botão Continuar some e só a ação destacada avança
- **Fluxo completo**: boas-vindas → clique na foto → escolha do avatar →
  dados pessoais → nome de guerra (validação: vazio, mínimo, palavrões) →
  salvar (erros apontam o campo faltante) → identificação militar (AL SD
  QUAD MOURA explicada) → insígnia → score zerado → Bloco da Noite →
  **missão demonstrativa** (3 questões com feedback imediato e nova
  tentativa: LIMPE · 1+1 · hierarquia e disciplina) → +30 score e +25 Quad
  Coins → Loja → **compra da Boina exclusiva (20 QdC)** com saldo caindo →
  boina aplicada automaticamente (selo no card) → encerramento
- **Conta nova começa zerada** (score 0 · 0 Quad Coins) — o aluno vê os
  primeiros pontos nascerem; recompensas do tutorial são **reais e únicas**
  (refazer não paga de novo)
- **Regras de bloqueio**: só o alvo destacado é clicável (4 painéis capturam
  o resto), navegação inferior bloqueada, tocar fora não fecha
- **Progresso salvo** (localStorage): fechar no meio retoma na etapa aberta;
  `tutorial_concluido` registrado; botão **"Refazer instrução inicial"** no
  Perfil do aluno; reset da demo limpa o estado
- Suíte automatizada: 35 verificações cobrindo as 19 etapas de ponta a ponta


## 19/07/2026 — correção: rolagem horizontal da esteira no desktop
- Causa: em telas de toque a esteira rola nativamente, mas no desktop a barra
  fica oculta (visual de app) e o mouse não arrasta conteúdo por padrão —
  parecia travada
- **Arrastar com o mouse** agora rola a esteira (drag-to-scroll com pointer
  events; arrasto não conta como clique no tile), **roda do mouse** sobre a
  esteira rola para o lado e o cursor vira "agarrar" para sinalizar
- Toque no celular segue nativo (`touch-action: pan-x pan-y`); loop infinito
  preservado nos dois sentidos

## 19/07/2026 — eventos da semana: esteira infinita + página própria por evento
- **Esteira horizontal com rolagem infinita**: os blocos são botões renderizados
  a partir do módulo `EVENTOS` (o que a administração publica aparece como
  atalho); conteúdo triplicado e teleporte de `scrollLeft` nos dois sentidos
- **5 eventos da semana 30**: NAC · Atualidades (qua), Aulão de véspera
  RONDESP (qui, garimpo), Gincana Quad Coins (sex, garimpo), Simuladão Quad
  (sáb) e Revisão turbinada (dom), cada um com cor própria
- **Página própria de evento** (overlay): tipo, data/hora, descrição e as
  **regras de ganho definidas por evento** — seção "Regras de score" e seção
  "Regras de Quad Coins" (com a moeda oficial), botão de inscrição (vai ao
  calendário) e, quando o evento tem, botão de **garimpo** (+15 Quad Coins,
  uma vez) — substitui o antigo garimpo fixo do tile
- Estado por evento persiste na sessão (inscrito/garimpado); clique nos tiles
  das cópias da rolagem infinita abre a mesma página


## 19/07/2026 — correção: rolagem do Início travando ao subir
- Causa: `scroll-snap` (proximity + align center nos cards) brigando com o
  teleporte da rolagem infinita e com o efeito engrenagem, que move os pontos
  de snap durante o scroll — o navegador "agarrava" um card ao rolar para cima
- Correções: snap removido (o efeito engrenagem continua dando o ritmo),
  `overflow-anchor: none` na view (âncora de rolagem do Chrome também segura
  a subida) e `spotlight()` reorganizado em fase de leitura + fase de escrita
  (sem layout thrashing; ~0,17 ms por evento de scroll)
- Teste automatizado: 300 passos contínuos subindo e 300 descendo sem tocar
  as bordas e sem nenhum frame preso

## 19/07/2026 — turma do aluno no card de perfil
- Nova linha **"TURMA PATAMO (N)"** abaixo de ALUNO SOLDADO no card de perfil
  — (N) = noite, (M) = manhã, (T) = tarde
- Derivada da mesma variável de matrícula (`ALUNO_TURMA`) que alimenta o card
  "Aula de hoje": mudou a matrícula, mudam juntos o rótulo da turma e o
  cronograma exibido (`turmaLabel()`)

## 19/07/2026 — "Aula de hoje" conectada ao cronograma presencial
- Card refeito: deixou de ser "próxima aula ao vivo" (conteúdo online) e passou
  a refletir a **aula presencial da turma do aluno** no Quad
- **Módulo `CRONO`**: espelho da planilha "Cronograma semanal" da coordenação
  (Google Sheets, semana 30 · 20–24/07) com as 4 turmas da noite (RONDESP,
  PATAMO, BOPE e CORE), sala, tipo e os **2 tempos por dia** (19h–20h30 e
  20h30–22h) com encontro, matéria e professor; na V1 o app sincroniza direto
  da planilha — o que for atualizado lá aparece aqui
- **Estrutura avalia dia → turno → turma do aluno**: aluno demo na PATAMO
  NOITE · SALA 4; o card mostra "Hoje · quarta-feira · 22/07" com os 2 tempos;
  status por horário real ("AGORA" no tempo em andamento, "ENCERRADO" no que
  passou); sábado/domingo mostra a próxima aula (segunda)
- Quiz ao vivo do professor continua no mesmo card, com textos ajustados
  ("quiz da aula" em vez de tema fixo)

## 19/07/2026 — botões de ação por assunto na árvore do edital
- **Dois botões em cada um dos 100 assuntos** (aparecem ao expandir o assunto,
  acima dos sub-assuntos): **▶ Assistir aula** e **✎ Fazer questões**
- Ambos abrem **link externo em nova aba**, montado com matéria + assunto:
  aula → busca no YouTube ("aula [matéria] [assunto] concurso"); questões →
  busca no banco do QConcursos. Na V1 os links passam a apontar para a aula
  e a lista de questões oficiais do Quad de cada assunto
- Estilo pílula: aula em azul sólido (ação primária), questões em contorno;
  clicar nos botões não fecha o acordeão

## 19/07/2026 — escala térmica de cores na árvore do edital
- **Barras e percentuais coloridos por valor** em todos os 3 níveis da árvore:
  quanto mais perto de 0% mais **vermelho**, quanto mais perto de 100% mais
  **azul** (`edHue`/`edFill`/`edPcColor`)
- Curva em dois trechos para leitura honesta: 0→50% varre vermelho→laranja→
  âmbar (o quente domina a metade baixa) e 50→100% varre âmbar→verde→azul —
  assim 39% aparece laranja (alerta) e não verde
- Cores calculadas em HSL na renderização; removidas as cores fixas por nível
  no CSS (dourado/azul/cinza)

## 19/07/2026 — árvore do edital CFO PM-BA no Domínio
- **Árvore completa do edital do CFO** (Curso de Formação de Oficiais da PM-BA)
  na aba Domínio: **13 matérias · 100 assuntos · 427 sub-assuntos**, transcrita
  integralmente da árvore enviada pelo fundador (dados centralizados em
  `EDITAL_CFO`)
- **Barra de progresso em todos os níveis**, relacionadas de baixo para cima:
  a barra do assunto é a **média das barras dos sub-assuntos** e a barra da
  matéria é a **média das barras dos assuntos** (função `edAvg`)
- Acordeão em 3 níveis: matéria ▸ assunto ▸ sub-assunto, com numeração do
  edital (1., 1.1, …), percentual ao lado de cada barra e 1ª matéria aberta
  por padrão; hierarquia visual por tamanho de barra e recuo
- Progresso simulado da V0 é **determinístico** (hash do nome + viés por
  matéria) — recarregar não muda os números; a metodologia calibrada entra
  na V1 com dados reais
- Removidos a árvore antiga de amostra (PC-BA) e o CSS/JS correspondentes

## 18/07/2026 (noite) — gamificação: patentes, score e prova de promoção
- **Configuração central `GAMI`** (seção 34 do documento): 14 patentes (Aluno
  Soldado → Coronel), 4 fases com notas mínimas (70/75/80/85%), curva de pontos
  e nº de questões — nada fixo espalhado no código
- **Três scores** separados dos Quad Coins: carreira (nunca zera), patente
  (620/900) e temporada; **score não é moeda e não promove sozinho**
- **Card de perfil**: título abreviado (AL SD QUAD MOURA), barra do score da
  patente, badge com nº da patente e aviso pulsante de promoção disponível
- **Aba Perfil**: card de progressão (fase, título por extenso, barras, próxima
  patente, status), botão de simulação "+275 pts/dia" e **histórico de carreira**
- **Prova de promoção**: código do fiscal (uso único), 20 questões objetivas de
  banco próprio com ordem e alternativas embaralhadas, correção automática,
  aprovação pela nota mínima da fase, tela de reprovação com bloqueio de 24h
  (simulado) e **PROMOÇÃO CONFIRMADA** com transferência do score excedente
- **Trilha da jornada** no Quadrômetro: 14 patentes por fase com estados
  (concluída ✓ · atual ● · prova disponível ★ · bloqueada 🔒 · máxima)
- Ações geram score: questão respondida +1, bônus de missão +10, treino +5
- Jornada da seção 35 demonstrada de ponta a ponta (Moura 620→900→prova→
  Soldado Quad Moura com 270 pts excedentes no histórico)

## 18/07/2026 (noite) — nome de guerra composto + Perfil do aluno completo
- **Nome de guerra em 3 partes**: classificação (AL SD / AL CB / AL SGT / AL OF)
  + **QUAD** (fixo, nunca muda) + nome escolhido — ex.: "AL SD QUAD MOURA";
  refletido no card de perfil, na farda do avatar e no Quadrômetro
- **Aba Perfil do aluno atualizada**: avatar (coleção rotulada 3D · aluno de
  curso militar) com **itens do personagem** (Boina — comprada na Loja e
  equipável com selo no avatar; Colete e Quepe "em breve"), **nome completo**,
  **telefone**, classificação + nome de guerra com prévia ao vivo, troca de
  senha e **tempo de uso do aplicativo** (hoje/semana/total)
- Regras de alteração da graduação ficam pendentes (gestor definirá)

## 18/07/2026 (noite) — Loja (Intendência) na navegação
- **"Quadrômetro" sai da navegação inferior e entra no menu "+"**; no lugar dele
  entra a **Loja**, com ícone de sacola
- **Nova tela Loja**: itens reais e digitais comprados **exclusivamente com
  Quad Coins** — Turma presencial (300), Evento presencial (150), Simulado
  presencial (120), Aulão especial (80), Simulado digital (60), Evento online
  (50), Aula isolada (40), Skin de personagem (35), Boina exclusiva (20)
- Compra **simulada** funcional: desconta do saldo, marca "ADQUIRIDO", bloqueia
  recompra e avisa quando faltam Coins; card de Quad Coins do perfil agora abre
  a Loja; saldo visível no topo da Loja
- Card "Intendência BLOQUEADO · V1" do Quadrômetro vira "LOJA ABERTA" com
  atalho; linha do "+" idem; tour e dicas do Danilo atualizados
- ⚠️ **Divergência da rev. 2.3 ampliada**: a Intendência (gastar Coins) estava
  prevista só para a V1; por decisão do gestor, o protótipo já apresenta a Loja
  na V0. Registrar no documento-base junto à decisão nº 11 ("Score não é moeda").

## 18/07/2026 (noite) — artes da Home refeitas em vetor (referências do gestor)
- **Insígnia de patente** (brasão-casa azul com hexágono, estrela e divisas) refeita
  em SVG ao lado de "SOLDADO", com glow
- **Quad Coin** refeita em SVG: moeda dourada com estrela no aro, centro azul,
  hexágono dourado, estrela facetada e divisas — usada no card de coins
- **Bloco da Noite** reconstruído como placa técnica chanfrada: fundo azul-marinho
  em gradiente com borda clara e emblema em marca d'água; por cima, os elementos
  **funcionais** refeitos conforme a arte — placa octogonal com alvo, selo dourado
  "EXPIRA EM 2H12" com relógio, título grande, barra de progresso com brilho e
  botão hexagonal "CONTINUAR MISSÃO" com seta (proporções, cores e fontes da arte)

## 18/07/2026 (noite) — fidelidade visual premium (referência = fonte da verdade)
- **Tipografia de identidade Exo 2** (500–800) em títulos, nome, missão, botões,
  Quad Coins, indicadores, nav e eventos; **Inter** só para textos de leitura
- **Paleta de maior contraste**: `#1976FF` (principal) · `#123C8F` (escuro) ·
  `#0B2E73` (hero) · `#EDF6FF` (fundo) · `#F4B63A` (dourado) · `#667085` (cinza)
- **Cards premium**: raio maior (24px), sombra suave, borda discreta, glass leve
  e profundidade — nada de cards planos
- **Missão como protagonista**: título 35px, barra de progresso espessa com brilho,
  CTA "de jogo" (gradiente + brilho superior + borda interna + sombra)
- **Ícones HUD** mais grossos (traço 2,3–3,2) e maiores
- **Quad Coins** como recompensa: moeda com brilho/sombra e número em destaque
- **Robô** integrado no rodapé (posição fixa, ao lado do balão de ajuda)
- Hierarquia e espaçamento revisados para o ritmo visual da referência

## 18/07/2026 (noite) — conformidade com a Especificação Visual da Home
- **Tipografia oficial embutida** (token `__FONTS__` / `fonts.css`): Inter (texto),
  **Rajdhani** (títulos/missão) e **Exo 2** (números) — remove a fonte "Arial Narrow"
  que a spec proíbe; título da missão agora é claramente diferente do texto corrido
- **Paleta exata** da spec: `#062B64` navy · `#0878F8` azul · `#18B7F4` ciano ·
  `#EAF5FF` fundo · `#12366D` texto · `#61799F` secundário · `#E6A91A` dourado ·
  `#28A96B` verde · `#6237D8` roxo (eventos)
- **Ícones SVG lineares (família Lucide)** substituem os emojis: nav (casa, alvo,
  escudo+estrela, grade 2×2, + central branco), avisos (calendário, arquivo), com
  traço consistente ~2,1
- **Perfil como card único** (avatar, nome, patente, nível, XP e Quad Coins juntos)
- **Missão** com gradiente `#062B64→#084C9A`, borda técnica ciano e CTA de 2 camadas
- **Moeda** dourada própria (rim + centro azul + estrela), não emoji
- **Robô assistente** menor e reposicionado; balão some sozinho para não cobrir cards

## 18/07/2026 (noite) — ajustes de diagramação do redesign
- **Barra de rolagem** oculta nas telas (recupera a largura do enquadramento
  que estava comendo ~15px à direita e desalinhando os itens)
- Cabeçalho do card **Aula de hoje** corrigido: "SEM QUIZ ABERTO" não sobrepõe
  mais o horário "19h–22h" (overflow do flex resolvido)
- **Moeda do Quad Coin** redesenhada: moeda dourada com rim, centro azul e
  brilho (antes era uma estrela chapada)
- **Efeito engrenagem** suavizado (giro/desbotamento bem menores) para a
  diagramação bater com o modelo plano

## 18/07/2026 (noite) — redesign gamificado (modelo do gestor)
- Novo sistema visual "RPG militar": cartões de **vidro** (glass), botões **3D
  brilhantes**, ícones **hexagonais**, pílulas e brilhos — aplicado a todo o app
  via componentes compartilhados (`.p-card`, `.btn`, `.tag`, nav)
- **Tela Início** refeita conforme o modelo enviado:
  - Cabeçalho de identidade: avatar com anel, nome, patente com insígnia
    hexagonal, **nível + barra de XP** e card **Quad Coins** com moeda dourada
  - **Missão principal** como cartão-herói azul-escuro com brilho, título estêncil
    "BLOCO DA NOITE", barra 10/20 e botão 3D "Continuar missão"
  - Aula de hoje, Avisos (megafone) e **Eventos da semana** em tiles coloridos
  - Nav inferior com **botão + central brilhante** e ícones com glow
  - Balão do Danilo "Precisa de ajuda? Clique aqui"
- 1º passo: Início como vitrine + tema aplicado ao app inteiro; refino fino das
  demais telas (Professor, Admin, Quadrômetro) e das telas de acesso vem a seguir

## 18/07/2026 (noite) — símbolo oficial na animação de carregamento
- A releitura do símbolo em SVG foi **descartada**: as telas de acesso e a vinheta
  passam a usar o **símbolo oficial da marca** (arquivo original, fundo transparente),
  conforme o Manual de Marca 2024 (cores #0098DA, #2D5782, #6BCDF3)
- Vinheta: animação de carregamento agora é uma **revelação circular do próprio
  símbolo oficial** (ele se "desenha" em círculo enquanto carrega), sem recriar a forma
- Novo asset `simbolo-quad-transparente.png` embutido no build via token
  `__QUAD_SIMBOLO__` (build.ps1 atualizado); removido `simbolo-quad-3d.png`

## 18/07/2026 (fim de tarde) — identidade visual do acesso
- **Símbolo do Quad em SVG** (fitas de ferro azul, transparente, com brilho e
  sombra 3D) substitui a logo em caixa branca nas telas de acesso
- **Vinheta**: a barra de carregamento saiu; agora o **próprio símbolo se desenha**
  (as fitas de ferro se constroem e se ajustam) como animação de carregamento
- Tela inicial: subtítulo passa a **"Da matrícula ao primeiro dia do curso de
  formação"** e o aviso sobre uso offline foi removido
- Tela "Dispositivo autorizado": recado longo removido; layout refeito com selo de
  sucesso verde e hierarquia mais limpa
- Telas de acesso reorganizadas (selos de status, espaçamento e centralização
  consistentes)
- Assets: `simbolo-quad-transparente.png` (símbolo oficial sem fundo) e
  `simbolo-quad-3d.png` (releitura 3D em fitas de ferro)

## 18/07/2026 (tarde) — novo fluxo inicial de acesso (offline-first)
- **Tela inicial** repaginada: pede apenas o e-mail + botão **Acessar o portal** e o
  aviso sobre uso sem internet após o primeiro acesso online
- **Verificação de e-mail** com estado de carregamento e três cenários simulados:
  aluno **ativo** (código por e-mail), **dificuldade** para receber o código e
  **conta não ativada** (leva ao cadastro/primeiro acesso já existente)
- **Entrada alternativa por senha** (só no fluxo online), com "Esqueci minha senha",
  "Usar código por e-mail" e "Trocar e-mail"
- **Dispositivo autorizado** no 1º acesso online (simulado; habilita o modo offline)
- **Abertura sem internet**: tela "Você está offline" com última sincronização,
  "Entrar no modo offline" e "Tentar novamente"
- **Modo offline no app**: banner fixo, missões já carregadas jogáveis com respostas
  "aguardando envio" (salvas no navegador), nova missão e quiz ao vivo bloqueados
- **Retorno da conexão**: estado de sincronização → respostas marcadas como enviadas
  → "Sincronização concluída"
- **Simulador de rede** (indicador ONLINE/OFFLINE na barra de status) e botão
  "Resetar demonstração" no painel lateral. Tudo com dados simulados; sem backend,
  e-mail, biometria ou sincronização reais. Fluxo de cadastro existente preservado.

## 18/07/2026
- Projeto estruturado como repositório Git para armazenamento no GitHub
- Documentação criada: visão e escopo, registro de decisões, guia de build

## 16/07/2026
- Danilo Moura (Fundador) assume o controle do projeto

## 14/07/2026 (tarde)
- Pontuação de participação rebatizada **Quad Coin** em toda a UI (com alerta de
  divergência da rev. 2.3 registrado)
- Efeito **engrenagem**: cartões giram em 3D na rolagem; **scroll infinito**
  (fim liga com o início) nas telas de cartões
- Portão de acesso: "Já sou aluno" (validação por código de e-mail) e "Minha
  primeira vez" (cadastro com preenchimento automático; tela seguinte abre
  carregando, dados chegam campo a campo)
- **Tour obrigatório do Danilo** no 1º acesso (9 passos, holofote, Anterior/Próximo)
- Barra de carregamento na vinheta
- **Perfil do aluno**: nome de guerra, senha e avatar da coleção oficial da PM
  (12 opções, nome estampado na farda); reflexo no Início
- Aba Perfil rebatizada **Quadrômetro**
- Tema **azul e branco** da marca + tipografia de app (Inter/Roboto/SF Pro)
- Logo oficial (arquivo da marca) no login, vinheta e cabeçalho
- Vinheta movida para **após o login**, frase "Comece seu sonho por aqui..."
- Botão **"+"** central: Pré-TAF, Calendário, Materiais + prévias V1/V2 bloqueadas
- Vídeo 3D do **Danilo** no botão flutuante e no popup do guia
- Correção de processo: republicação do Artefato a cada alteração (regra fixada)

## 14/07/2026 (manhã)
- Tela de login (e-mail do curso + senha) com logo animada
- Vinheta com a logo e "Comece sua aprovação aqui..."
- Correção de rumo: padrão visual azul/branco (abandono do tema escuro/dourado)
- Danilo (mascote) vetorizado com popup de orientações contextuais
- Projeto hospedado em `Projetos Quad\Viver o Quad`

## 13/07/2026
- Primeira versão do protótipo a partir do documento-base rev. 2.3:
  3 perfis (aluno/professor/admin), missões, quiz sem feedback imediato,
  minerar pontos, admin por edital, fronteira V0/V1 marcada
- Publicação do Artefato
