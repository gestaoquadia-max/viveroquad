# 13 — Guia para o desenvolvedor que vai receber o projeto

**Data:** 30/07/2026 · **Atualizado em:** 01/08/2026 (Consolidação Arquitetural v1.0 e reorganização do fonte em `src/`)
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3); Consolidação Arquitetural v1.0 (`docs/arquitetura/`)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

Este guia é o ponto de partida para o desenvolvedor que nunca viu o "Viver o Quad". Ele diz o que ler, como rodar, o que é real, o que é encenação e por onde começar. Tudo o que está afirmado aqui foi verificado no código ou nos documentos pela auditoria de 30/07/2026 e atualizado em 01/08/2026 após a Consolidação Arquitetural v1.0; o que não pôde ser confirmado está marcado como HIPÓTESE.

> **Atualização 01/08/2026 — Consolidação Arquitetural v1.0.** O Viver o Quad passou a ser **a plataforma principal do Quad Concursos**; onze capacidades antes tratadas como sistemas externos são agora **módulos internos** (Módulos Planejados — nada foi implementado). A dec. 21 foi **revogada** (o cadastro pertence ao app; o portão "Cadastro no site do Quad" segue no protótipo como demonstração). No mesmo dia, `src.html` foi **dividido em 20 partes** em `src/`, o build ficou portátil e validado, e o código morto foi removido com regressão verde — **sem nenhuma mudança de comportamento** (saída byte-idêntica na divisão; 56 suítes verdes na limpeza). Detalhes: `docs/arquitetura/` e `src/README.md`.

---

## 1. O que ler primeiro (ordem exata)

| # | Documento | Por quê nesta posição | Estado |
|---|---|---|---|
| 1 | `docs/arquitetura/00-arquitetura-oficial.md` | **O documento arquitetural oficial e único** (Consolidação v1.0): premissa da plataforma principal, 11 módulos internos, o que fica fora, hierarquia documental. Em conflito com qualquer documento anterior, **ele prevalece** | Atual (01/08) |
| 2 | `docs/arquitetura/01-modulos-planejados.md` | Fichas dos 11 Módulos Planejados (objetivo, responsabilidade, dependências, o que está demonstrado × o que falta especificar) | Atual (01/08) |
| 3 | `docs/auditoria/00-resumo-executivo.md` | Visão geral honesta do que o protótipo é e não é | Atual (30/07) |
| 4 | **Este guia** (13) | Mapa de chegada | Atualizado (01/08) |
| 5 | `docs/Viver-o-Quad-Relatorio-rev2-3.pdf` | Documento-base de produto: visão, faseamento V0→V1→V2, economia Quadcoin (Anexo A), métrica-mãe. **Leia sabendo que está defasado em pontos importantes** (ver doc 10) e que a premissa "app satélite de uma plataforma-base" foi **superada pela Consolidação** | Canônico em produto, aguarda rev. 2.4; superado em arquitetura |
| 6 | `docs/02-registro-de-decisoes.md` | Decisões 1–188 do gestor — é o documento de produto mais vivo. As decisões **182–188 (01/08)** registram a Consolidação v1.0 (inclusive a revogação da dec. 21 e a divisão do fonte). Atenção: números 126–129 duplicados e ordenação quebrada no trecho final 46–181 | Atual (01/08), com defeitos de numeração |
| 7 | `CHANGELOG.md` | 116 entradas (13/07→28/07), uma por rodada, com causas-raiz. É a fonte histórica mais confiável — a única que acompanhou o código até o fim | Atual (28/07) |
| 8 | `docs/auditoria/01` a `12` | Mapa do protótipo, telas, fluxos, funcionalidades, regras (RN-01–RN-61), dados, ecossistema, fontes, integrações, divergências, reaproveitamento e o plano de transformação (doc 12 — as 20 fases). Os docs **00, 01, 07, 08, 09, 10, 11 e 12** receberam seções de Atualização em 01/08 com a Consolidação. Atenção: docs 07/08 têm a matriz de propriedade **superada** onde atribuía os 11 módulos a sistemas externos (as Atualizações explicam) | Atuais (retrato de 30/07; 00/01/07–12 anotados em 01/08) |
| 9 | `README.md`, `docs/00-comece-aqui-danilo.md`, `docs/01-visao-e-escopo.md`, `docs/03-guia-de-build-e-publicacao.md` | **Reescritos em 01/08 contra a Consolidação v1.0**: URL vigente do artefato, fonte em `src/`, os dois builds, tamanhos e árvore reais; docs/01 registra a revogação da dec. 21. (A versão de ~18/07 que a auditoria criticou — DIVERGÊNCIA DOCUMENTAL do doc 10 — foi substituída) | Atuais (01/08) |
| 10 | `src/README.md` + as 20 partes em `src/` | A fonte única, agora em 20 fatias contíguas (`NN-descricao.html`; a concatenação na ordem reproduz o monolito). Em conflito de comportamento, **o código é a verdade final** | Atual (01/08) |

---

## 2. Como o protótipo funciona (dois parágrafos honestos)

O protótipo inteiro é **um único documento HTML** — desde 01/08/2026 versionado como **20 partes contíguas em `src/`** (`01-…` a `20-…`; a concatenação na ordem reproduz o monolito `src.html` da auditoria, ~11.900 linhas: ~1.570 de CSS, ~2.100 de HTML e o restante de JavaScript num único IIFE, sem módulos, sem framework, sem dependência de rede). O build (`build.py` ou `build.ps1`) concatena as partes sem acrescentar nem remover um byte, substitui 10 tokens (`__FONTS__`, `__DANILO_VIDEO__`, `__FOTOS_VARIANTES__` etc.) por data-URIs base64 das mídias e gera `index.html`/`artifact.html` (~9,4 MB cada), que rodam 100% offline em qualquer navegador. Dentro do documento convivem **três experiências** (aluno, professor, admin N.P.P.), trocadas por botões de persona, todas operando sobre o **mesmo estado em memória**: arrays e objetos JS (`TURMAS_LOJA`, `MATRICULAS`, `EVENTOS`, `SIMULADOS`, `DOCENTES`, `COMPRAS`, `QUIZZES`…). É isso que produz o efeito "tudo conectado em tempo real": o admin cria uma turma e ela aparece na Loja do aluno na hora — porque é a mesma variável, no mesmo navegador.

O corolário é que **quase nada persiste e nada é autenticado**. Recarregar a página (F5) zera moedas, compras, matrículas, mensagens e carreira; a única persistência é o `localStorage` com **2 chaves vivas**: `vq_tut_skip` e `vq_intro_done` (as 6 chaves mortas que a auditoria listou no doc 06 foram **removidas do fonte** na limpeza de 01/08). O login do aluno aceita qualquer e-mail+senha, os gates de professor e admin são overlays em JS, gabaritos e "segredos" demo estão no cliente, e 31 hooks `window.__*` (para as suítes Playwright de desenvolvimento, **que não estão versionadas neste repositório** — a regressão de 56 suítes de 01/08 rodou fora do repo) permitem manipular qualquer estado pelo console. Isso é intencional e adequado para uma demonstração navegável (V0 "Prova de Vida"); nada disso é arquitetura para o produto. As mecânicas, porém, **funcionam de verdade dentro da sessão** (estorno desfaz posse, choque de agenda cruza agendas reais, vagas esgotam por moeda) — o protótipo é uma **especificação executável de regras de negócio**, não um esqueleto de sistema.

---

## 3. Como executar

Pré-requisito: nenhum além de navegador + Python 3 (ou PowerShell). Não há `npm install`, servidor ou banco.

1. **Clonar** o repositório.
2. **Rodar o build** — escolha um (desde 01/08 os dois são equivalentes em validação):
   - `python3 build.py` — **portátil**: usa caminho relativo ao próprio script (`pathlib.Path(__file__).resolve().parent`), roda **de qualquer diretório**. Valida que existem exatamente **20 partes** em `src/`, que **nenhum token está ausente** e que **nenhum token sobrou** sem substituição — aborta com mensagem clara em qualquer desses casos (CONFIRMADO NO CÓDIGO).
   - `.\build.ps1` — usa `$PSScriptRoot` e **espelha as mesmas validações** (20 partes, token ausente, token que sobrou). Exige Windows/PowerShell.
3. **Abrir `index.html`** com clique duplo. Sem servidor; funciona offline. `artifact.html` é a variante para publicação como Artefato (sem esqueleto HTML).

**Regra de ouro para editar:** edite **as partes em `src/`** — **nunca** `index.html`/`artifact.html`, que são saída de build (e não são versionados). Nenhuma parte é HTML/CSS/JS válido sozinha (o `<style>` abre na 01 e fecha na 02; o `<script>`/IIFE abre na 07 e só fecha na 20) — **não rode formatador/linter numa parte isolada** e não reordene/renomeie partes. Leia `src/README.md` antes da primeira edição.

### Personas e credenciais demo (CONFIRMADO NO CÓDIGO)

| Persona | Como entrar | Evidência |
|---|---|---|
| **Aluno** | Qualquer e-mail contendo `@` + qualquer senha não vazia. Não há validação de credencial | `acessarPortal()`, src.html l.5633–5654 |
| **Professor** | E-mail derivado do **sobrenome do primeiro docente ativo** + senha `quad1234`. Hoje: **`moura@quadconcursos.com.br` / `quad1234`** (primeiro docente ativo é "Danilo Moura"; a nota do próprio gate imprime o e-mail vigente) | `emailDoProf()` l.4917–4922; `PROF_SENHA_DEMO` l.4914; `profGateNota()` l.4927–4933 |
| **Admin N.P.P.** | Qualquer e-mail contendo `@` + chave **`NPP-2026`** (case-insensitive). O e-mail `npp@quadconcursos.com.br` funciona, mas **não é validado** — só a chave decide | l.9787–9795; placeholder l.3369 |

Observações importantes:
- As referências "src.html l.N" desta tabela (e de toda a auditoria) valem para o **monolito auditado em 30/07**; desde 01/08 o fonte vive em 20 partes em `src/` — para localizar um trecho, use grep pelo nome da função/id (correspondência explicada em `src/README.md`).
- O e-mail `filho@quadconcursos.com.br` citado em materiais de contexto **não existe no código** (grep sem ocorrências) — DIVERGÊNCIA DOCUMENTAL. O e-mail do professor é **dinâmico**: se o admin renomear/desligar docentes na sessão, o e-mail demo muda e a nota do gate acompanha.
- 1º acesso do aluno dispara o tutorial obrigatório (29 passos no código). Para pular: botão "‹ Pular", ou a flag `vq_tut_skip` no localStorage.
- O botão "Reiniciar demonstração" (painel lateral, fora do "celular") limpa as flags — mas **esquece `vq_intro_done`** (bug conhecido, doc 06).

---

## 4. Limitações do build (atualizado em 01/08)

As duas piores limitações apontadas pela auditoria foram **corrigidas no commit de 01/08** ("fonte dividido em src/ (20 partes) e build portátil"):

| Limitação apontada em 30/07 | Situação em 01/08 |
|---|---|
| `build.py` não portátil (caminho absoluto fixo) | ✅ **Corrigida** — caminho relativo ao script; roda de qualquer diretório |
| `build.ps1` não validava tokens (podia publicar token cru) | ✅ **Corrigida** — espelha as validações do `build.py` (20 partes, token ausente, token que sobrou) |

Limitações que **permanecem** (aceitas para um protótipo):

| Limitação | Detalhe | Rótulo |
|---|---|---|
| `build.ps1` só roda em Windows/PowerShell | Preso à plataforma | CONFIRMADO NO CÓDIGO |
| Mídia ausente = erro cru | `FileNotFoundError` (py) / exceção .NET (ps1), sem mensagem amigável; `fotos/` vazia passa **em silêncio** (objeto vazio) | CONFIRMADO NO CÓDIGO |
| `index.html` com esqueleto incompleto | Sem `</head>` e `<body>` explícitos — funciona por tolerância do parser | CONFIRMADO NO CÓDIGO |
| Saídas de ~9,4 MB | Base64 infla mídias em ~33%; sem streaming/cache granular | CONFIRMADO NO CÓDIGO |

## 5. Arquivos ausentes, órfãos e caminhos a corrigir (atualizado em 01/08)

- **Órfãos versionados:** ✅ **resolvido em 01/08** — `Viver o Quad.rar` (9 MB) e `quad-coin.png` (904 KB) foram **removidos do repositório** no commit da divisão do fonte.
- **Não versionados por design:** `index.html` e `artifact.html` (no `.gitignore`) — regenere localmente.
- **Ausentes do repositório:** as **suítes Playwright de desenvolvimento** citadas em todo o CHANGELOG (`vtut`, `vfasea`–`vfaseh`, `vdmn`…). **O repositório continua sem nenhum teste automatizado versionado** — a regressão de 56 suítes que validou a limpeza de 01/08 rodou fora do repo; os 31 hooks `window.__*` no fonte são a única memória delas.
- **Docs de entrada:** ✅ **resolvido em 01/08** — README, docs/00, docs/01 e docs/03 foram **reescritos contra a Consolidação**: a URL vigente `945e81a8-9ca3-4d55-9169-c4fc9f6f3703` está registrada em quatro arquivos do repo (README, docs/00, docs/02 e docs/03 — deixou de ser HIPÓTESE, restando só a validação formal do gestor), a árvore reflete `src/` e `docs/arquitetura/`, e os tamanhos citados são os reais (~9,4 MB).

---

## 6. Mapa do fonte — as 20 partes de `src/` (desde 01/08)

O monolito `src.html` foi dividido em **20 fatias contíguas** (`src/NN-descricao.html`); a concatenação na ordem reproduz o monolito byte a byte. Tabela completa e regras de edição em `src/README.md`. As faixas de linha "src.html l.N" dos docs 00–12 valem para o monolito auditado — para localizar hoje, use grep pelo nome da função/id.

| Parte | Conteúdo |
|---|---|
| 01-css-base | Título, `__FONTS__`, temas claro/escuro, moldura `.phone`, login, portões, tutorial |
| 02-css-gamificado | CSS do redesign gamificado: herói, admin, Loja, insígnias, rankings, media queries |
| 03-html-aluno | Masthead, barra de personas e as 9 views do aluno |
| 04-html-professor | As 5 views do professor |
| 05-html-admin | As 8 views do administrador N.P.P. |
| 06-html-overlays | Overlays (prova, quizzes, compra, chat, portões, tutorial), artes vetoriais, 3 navbars |
| 07-js-estado-dados | Abertura do `<script>`/IIFE, estado global, moedas, docentes, turmas, matrículas, concursos |
| 08-js-eventos-cal-quiz | Eventos + página do evento, calendário do aluno, motor de quiz, aula de hoje |
| 09-js-professor | Gate/login do professor, painel, relatórios, quiz ao vivo com polling |
| 10-js-acesso-tutorial | Conectividade, acesso ao portal, tutorial do QUAD |
| 11-js-missoes-treinamento | Treinamento rápido, blocos do dia por turma, simulados do aluno, avatares |
| 12-js-gamificacao-perfil | Insígnias, rankings/Quadrômetro, promoções, simulado digital, central de tutoriais |
| 13-js-admin-estrutura | Estrutura/Domínio, criação de turmas e isoladas, banco de professores, reset da demo |
| 14-js-loja-economia | Loja: moedas, compras, catálogos, salas/lotações, overlay de compra, skins |
| 15-js-mochila-skins | Mochila de combate e cadeia de skins do personagem |
| 16-js-admin-controle | Gate N.P.P., contas/créditos, mensagens por público, gift cards, cronograma, materiais |
| 17-js-admin-liberacoes | Eventos do admin, pedidos/retiradas, portaria (autorizações de acesso), PDF de inscritos |
| 18-js-admin-hoje-loja | Lançamento de simulados, dificuldades por aluno, governança da Loja |
| 19-js-compras-estornos | Relatório de compras e estornos de 7 dias (lado do aluno) |
| 20-js-relatorios-boot | Relatórios com gráficos, cascata de inicialização, fechamento do IIFE |

**Cuidados estruturais** (de `src/README.md`): nenhuma parte é válida sozinha (o `<style>` abre na 01 e fecha na 02; o `<script>`/IIFE abre na 07 e fecha na 20); a ordem é imutável; tokens `__*__` ocupam uma linha cada e o build falha se algum sumir ou sobrar.

**Armadilhas conhecidas (estado em 01/08):**
- `var score` é a **moeda** (Quad Coins), não o score de carreira — armadilha de nomenclatura que **permanece** (parte 07).
- ✅ `hojeISO` duplicada/sombreada: **removida** na limpeza de 01/08 (ficou só a definição vigente).
- ✅ Chaves `vq_*` mortas, fluxo `CODE_OK`/autorização de dispositivo, `openQuiz`, `fmtSync`, `tutDadosOk`: **removidos** na limpeza de 01/08; 8 comentários enganosos atualizados.
- View `v-pretaf` órfã (inalcançável pela UI) — **permanece**, aguardando decisão de produto.
- `#connToggle` referenciado no JS não existe no HTML (modo offline inatingível) — **permanece**.
- O reset da demo **não limpa `vq_intro_done`** — bug conhecido, **não corrigido de propósito** (mudaria comportamento sem decisão); pendente de decisão do produto.
- `LINKS_ONLINE` foi **preservado** como ponto de integração planejado (não é código morto).

---

## 7. O que NÃO deve ser confundido com sistema real

Lista explícita — tudo abaixo é SIMULADO LOCALMENTE e/ou APENAS VISUAL no protótipo:

- **Login e autenticação** — aluno entra com qualquer e-mail+senha; gates de professor/admin são overlays JS removíveis por DevTools; senhas e chave demo impressas na própria tela. Real: DEPENDE DO BACK-END.
- **Pagamentos e moedas** — `score` (Quad Coins) e `diamantes` são variáveis; F5 devolve 1.240/150. Não há transação, ledger ou gateway. Real: DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (checkout/Pagar.me).
- **Estoque e vagas** — decremento de variável local; concorrência inexistente. Real: DEPENDE DE BANCO DE DADOS (reserva atômica).
- **Matrículas** — array `MATRICULAS` em memória; "verificação de matrícula" na vinheta é encenada. Real: **módulo interno** Matrículas desde a Consolidação (Módulo Planejado) + DEPENDE DE BANCO DE DADOS; integração a definir com site/checkout e pagamentos.
- **Ranking** — nomes e posições sintéticos por hash (aluno fixo em 87º de 1.286). Real: DEPENDE DO BACK-END.
- **Telemetria e métrica-mãe** — uma linha de texto estática ("origem: OPEN_ORGANIC…"); nenhum evento é coletado, apesar de o relatório rev. 2.3 declarar a telemetria **pré-requisito da V0**. APENAS VISUAL.
- **Permissões e perfis** — troca de persona por botão visível; nenhuma autorização real. APENAS VISUAL.
- **Quiz ao vivo ("polling")** — `setInterval` com números aleatórios no mesmo navegador; professor e aluno são a mesma página. Real: DEPENDE DO BACK-END (tempo real).
- **Extração de PDF** (quiz, simulado digital, árvore de edital) — usa apenas o **nome do arquivo**; questões vêm de bancos demo. Marcado `[INTEGRAÇÃO REAL]` no fonte (24 ocorrências).
- **QR e câmera** (gift cards) — QR desenhado como padrão ilustrativo; "leitura" é um botão demo. DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END.
- **Domínio (percentuais)** — determinísticos por hash do nome + ajuste dos flashcards; não refletem desempenho real. APENAS VISUAL na essência.
- **Relatórios do admin** — mistura declarada de dados vivos da sessão com semente por hash e tabelas fixas.
- **Notificações/push** — inexistentes (badges internos apenas).
- **Modo offline** — `var online` interna; nem alcançável pela UI atual.
- **Persistência** — só 2 chaves no localStorage (`vq_tut_skip` e `vq_intro_done` — as demais foram removidas na limpeza de 01/08); todo o resto zera no F5.
- **Prova de promoção, crédito manual, estorno, portaria** — mecânicas completas, porém 100% no cliente; qualquer valor é forjável pelo console (hooks `window.__*`).

---

## 8. Fontes documentais e hierarquia

Regra de leitura (detalhe no doc 08 — matriz de fontes; hierarquia atualizada em 01/08):

1. **Arquitetura vigente** → `docs/arquitetura/00-arquitetura-oficial.md` + `01-modulos-planejados.md` (Consolidação v1.0 — em conflito com qualquer documento anterior, **prevalecem**).
2. **Comportamento vigente** → o fonte em `src/` (o código é a verdade final do que o protótipo faz; `src/README.md` explica a correspondência com o monolito auditado).
3. **Intenção de produto vigente** → `docs/02-registro-de-decisoes.md` (decisão mais recente vence; cuidado com 126–129 duplicadas; **dec. 21 revogada em 01/08**) + `CHANGELOG.md` (contexto e datas).
4. **Visão, faseamento e economia-alvo** → `docs/Viver-o-Quad-Relatorio-rev2-3.pdf` (canônico em produto, mas **pendente da rev. 2.4** e **superado em arquitetura** pela Consolidação; diverge do protótipo em economia, moedas e escopo V0/V1; ver doc 10).
5. **docs/auditoria/00–13** → fotografia verificada de 30/07 (docs 00, 01, 07, 08, 09, 10, 11, 12 e 13 anotados/atualizados em 01/08). A matriz de propriedade dos docs 07/08 fica superada onde atribuía os 11 módulos internos a sistemas externos.
6. **README, docs/00, docs/01, docs/03** → **reescritos em 01/08 contra a Consolidação** — voltaram a ser documentos de entrada confiáveis (URL vigente, `src/`, builds, árvore e roteiro atuais).

## 9. Decisões vigentes mais importantes (top 20, com nº)

Fonte: `docs/02-registro-de-decisoes.md` + verificação no código pelos investigadores (docs 04/05).

| Nº | Decisão (vigente) |
|---|---|
| 17 | Mascote chama-se **QUAD** (substitui "Danilo", dec. 3/7); tutorial obrigatório no 1º acesso (roteiro decomposto em 29 beats no código) |
| 21 | ~~Cadastro é no site (checkout); o app só faz login~~ — **REVOGADA em 01/08/2026 pela Consolidação v1.0**: o cadastro pertence à arquitetura do app (módulo interno Cadastro). O fluxo novo **não foi implementado**; o protótipo mantém o portão "Cadastro no site do Quad" como demonstração, até especificação do módulo |
| 11 | Pontuação de participação rebatizada **"Quad Coin"** na UI — divergência com a rev. 2.3 reconhecida e ainda não realinhada |
| 48 | **Diamante**: moeda comprada em dinheiro (recarga no site ou gift card); nunca conquistada em missão |
| 49 + 59 | Loja em 2 macro-blocos (presenciais/digitais) com o nome **Quad Store** |
| 50 | **Confirmação em toda compra** (modal; quantidade quando há estoque) |
| 62 | **Matrícula manda no app**: sem matrícula ativa, tudo bloqueia menos a Quad Store |
| 23 | **Prova de promoção automática**: 20 questões difíceis do próprio aluno, 80% aprova, reprovação bloqueia 24h |
| 67 + 178 | **Estorno em até 7 dias**; **consumo (entrada liberada/entrega) mata o estorno** |
| 100 | Estorno **desfaz a aquisição por tipo** (vaga, estoque, mochila, skin, inscrição) |
| 85 | Login do professor por **e-mail funcional + senha individual** (substitui 83) |
| 105 | Instrução do QUAD abre "em todo acesso", com Pular — **o código diverge após a 1ª conclusão** (ver doc 10) |
| 107 | Choque de agenda **avisa sem impedir** ("EM CHOQUE"); matrícula em turma sobreposta segue barrada |
| 117b + 122/123/125 | Simulado **presencial**: sempre vendido, nunca premia QdC. **Digital**: sem limite de vagas, pode ser gratuito, premia QdC por acerto |
| 132 + 143 | Ranking com **privacidade de mão dupla**; top 10 sempre visível |
| 146–157 | Pacote **turma ativa**: múltiplas matrículas, uma turma comanda o app, trocável sem deslogar; conteúdo por turma, economia da pessoa (148) |
| 155 | **Vagas por moeda** (Dmn + QdC; total = soma) em turmas e simulados (substitui 60/69) |
| 161 | **Eventos são do Quad**, genéricos — sem segmentação por turma (revoga 150) |
| 172 | **Item de combate**: recompra livre, sem estoque, "N na mochila" (revoga 99 para combate) |
| 179 + 180 + 181 | **Lotação fixa por sala** (155/85/125/185) limita vagas; **portaria sincronizada** com eventos; **mensagens por público** |

Também relevantes: 136 (Estúdio selecionado manualmente, revoga 131), 141 (lista "Turmas abertas" com Editar/✕), 163 (cronograma chaveado por id de turma), 165 (simulados moram no Calendário).

## 10. Divergências abertas

**Leia o doc `10-divergencias-e-decisoes-pendentes.md` na íntegra antes de codificar qualquer coisa.** As dez mais impactantes, em resumo: economia ativa na V0 × "sem economia ativa" da rev. 2.3 (**as regras econômicas seguem indefinidas** — a Consolidação registrou, não resolveu); Diamante sem cobertura no documento-base; `var score` = moeda (armadilha de nomenclatura); mascote QUAD × resíduos "Danilo" (assets, ids e um texto no app, l.3637); tutorial 9×19×29 passos; dec. 105 × comportamento real do `vq_tut_skip`; README/docs/00/03 defasados (**resolvida em 01/08** — docs de entrada reescritos com a URL vigente; os dois builds validam igual); decisões 126–129 duplicadas; gate admin sem validar e-mail; telemetria pré-requisito da V0 que é só texto. Cada uma tem responsável e pergunta objetiva no doc 10. A divergência sobre dono do cadastro foi resolvida pela **revogação da dec. 21** (01/08); os riscos de segurança da auditoria **permanecem válidos e pendentes**.

## 11. O que pode ser aproveitado

**Detalhe no doc `11-avaliacao-de-reaproveitamento.md`.** Em síntese, aproveitam-se sobretudo como **especificação, não como código de produção**:

- **As regras de negócio** (RN-01–RN-61 no doc 05) — o protótipo é a especificação executável mais precisa que existe do produto: estorno/consumo, choque de agenda, vagas por moeda, turma ativa, lotação por sala, privacidade de ranking.
- **O roteiro do tutorial** (`TUT`, 29 beats) e todo o microcopy em pt-BR (tom já validado com o gestor).
- **A parametrização `GAMI`** (14 patentes, 4 fases, recompensas) como base do config de gamificação.
- **A árvore real do edital CFO PM-BA** (13 matérias, ~100 assuntos, ~427 sub-assuntos) — conteúdo real transcrito.
- **CSS/design system** (temas claro/escuro, tokens, componentes) como referência visual direta.
- **Os fluxos validados** (login→vinheta→tutorial; compra→estorno; quiz professor↔aluno) como roteiro de QA e de produto.

## 12. O que deve ser reconstruído (não migrado)

Tudo o que é **estado e lógica de negócio no cliente**: autenticação/RBAC, carteiras e ledger de moedas (o Anexo A da rev. 2.3 exige ledger auditável), matrículas, estoque/vagas com reserva atômica, quiz ao vivo (tempo real de verdade), extração de PDF, geração/leitura de QR, telemetria e taxonomia de origem de sessão (pré-requisito da V0), rankings, mensageria/notificações, relatórios, persistência de qualquer coisa. A arquitetura de um documento/IIFE único com ~8.200 linhas de JS acoplado **não é base de produção** (a divisão em 20 partes de 01/08 organiza o versionamento, não muda a arquitetura) — o valor está nas regras e nas telas, não na estrutura.

**Atualização 01/08 (Consolidação v1.0):** a leitura anterior desta seção — "o app real será cliente de vários sistemas, não dono deles" (docs 07 e 09) — foi **superada**. O Viver o Quad é agora **a plataforma principal**: cadastro, autenticação, matrículas, produção de materiais, banco de questões, simulados, inteligência pedagógica, loja, administração, relatórios e cronogramas são **módulos internos** (Módulos Planejados — a construir após especificação). A plataforma integra-se (integrações a definir) com o que ficou fora: site e checkout, pagamentos/financeiro, plataforma de cursos (legado em avaliação), push/e-mail e telemetria como serviço de dados (a decidir).

---

## 13. Sequência recomendada para iniciar

1. **Leia a arquitetura oficial primeiro**: `docs/arquitetura/00-arquitetura-oficial.md` e `01-modulos-planejados.md` — é a premissa vigente (plataforma principal, 11 módulos internos, o que fica fora).
2. **Rode e navegue** (seção 3): as 3 personas, o tutorial completo, uma compra + estorno, um quiz ao vivo, criação de turma no admin.
3. **Leia o resto na ordem da seção 1** (auditoria 00 → este guia → PDF → decisões → CHANGELOG → auditoria 01–12, fechando com o plano de transformação do doc 12, atualizado em 01/08).
4. **Leve as perguntas da seção 14 ao Danilo** (produto) — várias travam arquitetura (economia — indefinida; Diamante; corte V0/V1; bug do reset).
5. **Higiene do repositório** — o grosso foi feito em 01/08 (build portátil e validado, `.rar` e `quad-coin.png` removidos, código morto removido, README/docs 00/01/03 reescritos). Resta: botão `[DEMO PROVISÓRIO]`, textos residuais "Danilo", `v-pretaf` (religar ou remover) — cada um com ok do gestor.
6. **Recrie a rede de testes**: o repositório não tem nenhum teste versionado — os hooks `window.__*` documentam onde as suítes Playwright se apoiavam (56 suítes rodaram fora do repo em 01/08); versione as novas junto do código.
7. **Participe da ESPECIFICAÇÃO MÓDULO A MÓDULO** — a próxima fase oficial definida pela Consolidação, **antes de qualquer implementação**: cada um dos 11 Módulos Planejados precisa de especificação (fichas em `docs/arquitetura/01-modulos-planejados.md`). Os pontos `[INTEGRAÇÃO REAL]` do fonte agora se dividem entre módulos internos (a especificar) e integrações externas a definir (site/checkout, pagamentos, PDF, QR, storage).
8. **Só então** desenhe back-end e migre telas — usando o protótipo como especificação visual e de regras (telemetria e autenticação seguem candidatas a primeiros alicerces, conforme o relatório e a auditoria).

## 14. Perguntas que o desenvolvedor deve fazer ao responsável pelo produto (Danilo Moura)

1. No piloto de 30 dias, a **Quad Store estará ligada** (compras reais em QdC/Dmn), em modo vitrine, ou desligada, como manda a rev. 2.3? O crivo Financeiro+Jurídico dos ralos de valor real já foi acionado?
2. O **Diamante** entra na rev. 2.4 como camada oficial da economia? Quem governa (mesmo portão do Quadcoin, com Vitor França)?
3. A **rev. 2.4 do documento-base**: quem redige e quando? (Pendência formal desde a dec. 11.)
4. O mascote é **QUAD em toda comunicação**? Posso remover o resíduo "Danilo, o guia" do app e (opcionalmente) renomear assets/ids `danilo*`?
5. Os **29 beats atuais do tutorial** são o roteiro oficial? A instrução deve reabrir a cada login após concluída (dec. 105) ou ficar só na central do QUAD (comportamento atual)?
6. **Pré-TAF**: religa na V0 (a tela `v-pretaf` existe pronta e está órfã) ou fica para a V1?
7. Qual é o **corte oficial V0×V1 do piloto**? (O protótipo demonstra V0+V1 e fatias de V2 — se tudo ficar ligado, a métrica de retorno espontâneo nasce contaminada.)
8. A prova de promoção deve usar a **nota mínima por fase** (`GAMI.fases`, 70–85%) ou os 80% fixos que o código aplica hoje?
9. **Top 10 do ranking sempre visível** mesmo para perfis privados: mantém? (Implicação LGPD — sem opt-out.)
10. Lista oficial de **palavrões/moderação** do nome de guerra (hoje 7 termos hardcoded)?
11. **Lotações das salas** (155/85/125/185) e capacidade do Estúdio: valores reais da sede? Viram cadastro configurável?
12. Os professores da grade `CRONO` que não existem no Banco de professores (John Bernam, Marcello Esquivel etc.) representam o **quadro real**? Unificamos as duas fontes?
13. ~~"Viver o Quad.rar" pode sair do repositório?~~ — **resolvida em 01/08**: removido no commit da divisão do fonte (junto com `quad-coin.png`).
14. Regras de **alteração de graduação do aluno** e retenção/eliminação de dados (LGPD): quem define e quando?

**Perguntas abertas pela Consolidação v1.0 (01/08/2026):**

15. **Regras econômicas** — a Consolidação manteve loja, Quad Coins, Diamantes e gift cards como previstos, mas registrou que as regras econômicas **seguem indefinidas (não estudadas)**: preços, recompensas, conversões, limites, governança. Quando e por quem esse estudo será feito? (Nada deve ser inventado na especificação do módulo Loja antes disso.)
16. **Bug do reset** — o botão "Reiniciar demonstração" não limpa `vq_intro_done` (bug conhecido desde a auditoria, doc 06). A limpeza de 01/08 **não o corrigiu de propósito**, porque corrigir mudaria comportamento sem decisão. Corrige-se? (Pendente de decisão.)
17. **Cadastro no app** (dec. 21 revogada) — qual é a especificação do fluxo de cadastro dentro da plataforma? Até ela existir, o protótipo mantém o portão "Cadastro no site do Quad" como demonstração.
18. **Fronteiras a decidir** — plataforma de cursos (legado em avaliação): mantém, integra ou aposenta? Telemetria como serviço de dados: dentro ou fora da plataforma?

## 15. Checklist técnico inicial

- [ ] Li `docs/arquitetura/00-arquitetura-oficial.md` e `01-modulos-planejados.md` (a premissa vigente) e `src/README.md` (as regras das 20 partes)
- [ ] Clonei o repo e rodei `python3 build.py` **de qualquer diretório** (ou `.\build.ps1` no Windows) — desde 01/08 os dois validam 20 partes e tokens (ausentes e sobras)
- [ ] Build rodou sem erro e `index.html` (~9,4 MB) abre no navegador
- [ ] Sei que se edita **as partes em `src/`, nunca `index.html`/`artifact.html`** — e que nenhuma parte aceita formatador/linter isolado
- [ ] Entrei nas 3 personas com as credenciais da seção 3 (aluno livre · `moura@quadconcursos.com.br`/`quad1234` · chave `NPP-2026`)
- [ ] Fiz o tutorial completo, uma compra + estorno, um quiz ao vivo e criei uma turma no admin
- [ ] Li docs/auditoria 00, 10 e 11 e o registro de decisões (ciente das duplicatas 126–129 e da **dec. 21 revogada em 01/08**)
- [x] ~~Atualizar README/docs 00/03~~ — **feito em 01/08** (reescritos contra a Consolidação, com docs/01; URL vigente registrada em README/docs 00/02/03 — resta só a confirmação formal da URL pelo gestor)
- [x] ~~Corrigir caminho do `build.py` / validação do `build.ps1`~~ — **feito em 01/08** (build portátil, validações espelhadas)
- [x] ~~Remover `Viver o Quad.rar` e `quad-coin.png`~~ — **feito em 01/08**
- [x] ~~Remover código morto (`openQuiz`, `fmtSync`, `tutDadosOk`, chaves `vq_*` mortas, fluxo `CODE_OK`)~~ — **feito em 01/08** com regressão de 56 suítes; `LINKS_ONLINE` foi **preservado** (ponto de integração planejado). Restam: botão `[DEMO PROVISÓRIO]`, resíduos "Danilo" (dependem de ok do gestor)
- [ ] Decidi o destino da view órfã `v-pretaf` e do `#connToggle` inexistente
- [ ] Sei que o reset da demo **não limpa `vq_intro_done`** (bug conhecido, mantido de propósito — correção pendente de decisão)
- [ ] Planejei o rename `var score` → `qdc` (ou documentei a armadilha para a equipe)
- [ ] Defini política dos hooks `window.__*` (manter em dev, excluir de build de produção)
- [ ] Criei e versionei suíte de testes nova (o repo não tem nenhuma versionada; Playwright sugerido — os hooks já existem)
- [ ] Agendei a reunião de perguntas da seção 14 com o Danilo (incluindo as perguntas 15–18 abertas pela Consolidação)
- [ ] Mapeei os pontos `[INTEGRAÇÃO REAL]` do fonte, separando o que virou **módulo interno** (a especificar módulo a módulo) do que segue **integração externa a definir**

---

*Documento 13 da série de auditoria (docs/auditoria/00 a 13). Divergências: doc 10. Reaproveitamento: doc 11. Regras de negócio completas: doc 05. Dados e LGPD: doc 06.*
