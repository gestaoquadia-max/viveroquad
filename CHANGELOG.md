# Histórico de versões — Viver o Quad (protótipo)

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
