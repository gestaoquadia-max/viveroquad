# Histórico de versões — Viver o Quad (protótipo)

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
