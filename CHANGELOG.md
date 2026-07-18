# Histórico de versões — Viver o Quad (protótipo)

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
