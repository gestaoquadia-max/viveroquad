# 13 — Guia para o desenvolvedor que vai receber o projeto

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

Este guia é o ponto de partida para o desenvolvedor que nunca viu o "Viver o Quad". Ele diz o que ler, como rodar, o que é real, o que é encenação e por onde começar. Tudo o que está afirmado aqui foi verificado no código ou nos documentos pela auditoria de 30/07/2026; o que não pôde ser confirmado está marcado como HIPÓTESE.

---

## 1. O que ler primeiro (ordem exata)

| # | Documento | Por quê nesta posição | Estado |
|---|---|---|---|
| 1 | `docs/auditoria/00-resumo-executivo.md` | Visão geral honesta do que o protótipo é e não é | Atual (30/07) |
| 2 | **Este guia** (13) | Mapa de chegada | Atual (30/07) |
| 3 | `docs/Viver-o-Quad-Relatorio-rev2-3.pdf` | Documento-base de produto: visão, faseamento V0→V1→V2, economia Quadcoin (Anexo A), métrica-mãe. **Leia sabendo que está defasado em pontos importantes** (ver doc 10) | Canônico, aguarda rev. 2.4 |
| 4 | `docs/02-registro-de-decisoes.md` | Decisões 1–181 do gestor — é o documento de produto mais vivo. Atenção: números 126–129 duplicados e ordenação quebrada no fim do arquivo | Atual (28/07), com defeitos de numeração |
| 5 | `CHANGELOG.md` | 116 entradas (13/07→28/07), uma por rodada, com causas-raiz. É a fonte histórica mais confiável — a única que acompanhou o código até o fim | Atual (28/07) |
| 6 | `docs/auditoria/01` a `12` | Mapa do protótipo, telas, fluxos, funcionalidades, regras (RN-01–RN-61), dados, ecossistema, fontes, integrações, divergências, reaproveitamento e o plano de transformação (doc 12 — as 20 fases do protótipo ao produto real) | Atuais (30/07) |
| 7 | `README.md`, `docs/00-comece-aqui-danilo.md`, `docs/01-visao-e-escopo.md`, `docs/03-guia-de-build-e-publicacao.md` | Leia por último e **com desconfiança**: congelados em ~18/07, contêm URL antiga do artefato, roteiro de demonstração que não funciona mais, tamanhos irreais e árvore de arquivos incompleta (DIVERGÊNCIA DOCUMENTAL — detalhe no doc 10) | Desatualizados |
| 8 | `src.html` | A fonte única. Em conflito de comportamento, **o código é a verdade final** | Atual (28/07) |

---

## 2. Como o protótipo funciona (dois parágrafos honestos)

O protótipo inteiro é **um único arquivo, `src.html`** (~11.920 linhas: ~1.570 de CSS, ~2.100 de HTML e ~8.250 de JavaScript num único IIFE, sem módulos, sem framework, sem dependência de rede). O build (`build.py` ou `build.ps1`) apenas substitui 10 tokens (`__FONTS__`, `__DANILO_VIDEO__`, `__FOTOS_VARIANTES__` etc.) por data-URIs base64 das mídias e gera `index.html`/`artifact.html` (~9,4 MB cada), que rodam 100% offline em qualquer navegador. Dentro do arquivo convivem **três experiências** (aluno, professor, admin N.P.P.), trocadas por botões de persona, todas operando sobre o **mesmo estado em memória**: arrays e objetos JS (`TURMAS_LOJA`, `MATRICULAS`, `EVENTOS`, `SIMULADOS`, `DOCENTES`, `COMPRAS`, `QUIZZES`…). É isso que produz o efeito "tudo conectado em tempo real": o admin cria uma turma e ela aparece na Loja do aluno na hora — porque é a mesma variável, no mesmo navegador.

O corolário é que **quase nada persiste e nada é autenticado**. Recarregar a página (F5) zera moedas, compras, matrículas, mensagens e carreira; a única persistência é o `localStorage` com 8 flags `vq_*` de tutorial/dispositivo (várias delas mortas — doc 06). O login do aluno aceita qualquer e-mail+senha, os gates de professor e admin são overlays em JS, gabaritos e "segredos" demo estão no cliente, e 31 hooks `window.__*` (para as suítes Playwright de desenvolvimento, **que não estão versionadas neste repositório**) permitem manipular qualquer estado pelo console. Isso é intencional e adequado para uma demonstração navegável (V0 "Prova de Vida"); nada disso é arquitetura para o produto. As mecânicas, porém, **funcionam de verdade dentro da sessão** (estorno desfaz posse, choque de agenda cruza agendas reais, vagas esgotam por moeda) — o protótipo é uma **especificação executável de regras de negócio**, não um esqueleto de sistema.

---

## 3. Como executar

Pré-requisito: nenhum além de navegador + Python 3 (ou PowerShell). Não há `npm install`, servidor ou banco.

1. **Clonar** o repositório.
2. **Rodar o build** — escolha um:
   - `python3 build.py` — **ATENÇÃO:** a linha 2 tem caminho absoluto fixo `root = pathlib.Path('/home/user/viveroquad')` (CONFIRMADO NO CÓDIGO). Clonou em outro lugar? **Edite essa linha** (correção definitiva sugerida: `pathlib.Path(__file__).parent`). Valida a presença dos 10 tokens (`assert`) — aborta se um sumir.
   - `.\build.ps1` — usa `$PSScriptRoot` (caminho relativo ao script, portátil entre pastas — CONFIRMADO NO CÓDIGO, l.5), mas exige Windows/PowerShell **e não valida tokens**: token ausente passa em silêncio e o HTML sai com `__TOKEN__` cru.
3. **Abrir `index.html`** com clique duplo. Sem servidor; funciona offline. `artifact.html` é a variante para publicação como Artefato (sem esqueleto HTML).

### Personas e credenciais demo (CONFIRMADO NO CÓDIGO)

| Persona | Como entrar | Evidência |
|---|---|---|
| **Aluno** | Qualquer e-mail contendo `@` + qualquer senha não vazia. Não há validação de credencial | `acessarPortal()`, src.html l.5633–5654 |
| **Professor** | E-mail derivado do **sobrenome do primeiro docente ativo** + senha `quad1234`. Hoje: **`moura@quadconcursos.com.br` / `quad1234`** (primeiro docente ativo é "Danilo Moura"; a nota do próprio gate imprime o e-mail vigente) | `emailDoProf()` l.4917–4922; `PROF_SENHA_DEMO` l.4914; `profGateNota()` l.4927–4933 |
| **Admin N.P.P.** | Qualquer e-mail contendo `@` + chave **`NPP-2026`** (case-insensitive). O e-mail `npp@quadconcursos.com.br` funciona, mas **não é validado** — só a chave decide | l.9787–9795; placeholder l.3369 |

Observações importantes:
- O e-mail `filho@quadconcursos.com.br` citado em materiais de contexto **não existe no código** (grep sem ocorrências) — DIVERGÊNCIA DOCUMENTAL. O e-mail do professor é **dinâmico**: se o admin renomear/desligar docentes na sessão, o e-mail demo muda e a nota do gate acompanha.
- 1º acesso do aluno dispara o tutorial obrigatório (29 passos no código). Para pular: botão "‹ Pular", ou a flag `vq_tut_skip` no localStorage.
- O botão "Reiniciar demonstração" (painel lateral, fora do "celular") limpa as flags — mas **esquece `vq_intro_done`** (bug conhecido, doc 06).

---

## 4. Limitações do build (confirmadas)

| Limitação | Detalhe | Rótulo |
|---|---|---|
| `build.py` não é portátil | Caminho absoluto `/home/user/viveroquad` fixo na l.2 — quebra em qualquer outra máquina/pasta | CONFIRMADO NO CÓDIGO |
| `build.ps1` só roda em Windows/PowerShell | Portátil de pasta (`$PSScriptRoot`), mas preso à plataforma | CONFIRMADO NO CÓDIGO |
| `build.ps1` não valida tokens | `String.Replace` em cadeia, sem `assert` — pode publicar HTML com token cru | CONFIRMADO NO CÓDIGO |
| Mídia ausente = erro cru | `FileNotFoundError` (py) / exceção .NET (ps1), sem mensagem amigável; `fotos/` vazia passa **em silêncio** (objeto vazio) | CONFIRMADO NO CÓDIGO |
| `index.html` com esqueleto incompleto | Sem `</head>`, `<body>` e `<title>` próprios — funciona por tolerância do parser | CONFIRMADO NO CÓDIGO |
| Saídas de ~9,4 MB | Base64 infla mídias em ~33%; sem streaming/cache granular | CONFIRMADO NO CÓDIGO |
| Último build foi feito com `build.py` | Aspas simples em `__FOTOS_VARIANTES__` no artifact.html; rebuild reproduz byte a byte — mas README/docs só ensinam `build.ps1` | CONFIRMADO NO CÓDIGO + DIVERGÊNCIA DOCUMENTAL |

## 5. Arquivos ausentes, órfãos e caminhos a corrigir

- **Órfãos versionados:** `Viver o Quad.rar` (9 MB, rastreado no git, não referenciado por nada — HIPÓTESE: cópia antiga) e `quad-coin.png` (904 KB; os builds usam só o `.webp`). ~10 MB de peso morto no clone.
- **Não versionados por design:** `index.html` e `artifact.html` (no `.gitignore`) — regenere localmente.
- **Ausentes do repositório:** as **suítes Playwright de desenvolvimento** citadas em todo o CHANGELOG (`vtut`, `vfasea`–`vfaseh`, `vdmn`…). **O repositório não contém nenhum teste automatizado** — os 31 hooks `window.__*` no src.html são a única memória delas.
- **A corrigir:** l.2 do `build.py` (caminho); README/docs/00/docs/03 (URL antiga do artefato `4d06ad26-…` — a vigente informada à auditoria é `945e81a8-9ca3-4d55-9169-c4fc9f6f3703`, HIPÓTESE por não constar em nenhum arquivo do repo; árvore do README omite 11 itens; tamanhos "70 KB/4 MB" vs. reais 764 KB/9,4 MB).

---

## 6. Áreas críticas do src.html (faixas de linhas)

Leia com `Read` em blocos de ~2.000 linhas. Linhas aproximadas (±5):

| Faixa | Conteúdo |
|---|---|
| 1–2 | `<title>` + `__FONTS__` |
| 3–1570 | **CSS**: temas claro/escuro (`:root` l.18–28), moldura `.phone` 384 px (l.65), breakpoints (l.1560), reduced-motion (l.1564) |
| 1571–3115 | **HTML das 22 views** (`v-*`): aluno 1661–2131 · professor 2134–2300 · admin 2303–3115 |
| 3117–3565 | **21 overlays**: provas/quizzes 3117–3191 · vinheta/gates 3331–3398 · tutorial 3400–3416 · compra/loja 3436–3522 · ajuda 3524–3532 |
| 3562–3604 | Login do aluno + 3 navbars |
| 3609–3668 | `<aside>` explicativo (fora do "celular"; alguns textos estão desatualizados) |
| 3670–3946 | **Coração do estado**: `score` (=Quad Coins!) 3672 · `GAMI` 3678 · `carreira` 3708 · `lsGet/lsSet` 3737 · `DOCENTES` 3815 · `TURMAS_LOJA` 3842 · `MATRICULAS` 3850 · turma ativa 3859–3898 · personas 3910–3942 · `DB_ALUNO` 3946 |
| 4040–4074 | `showView()` — hub de navegação e re-render de TODAS as personas |
| 4092–4262 | Árvores de edital (`EDITAL_CFO`…), `CONCURSOS`, `MODALIDADES`, `EVENTOS` |
| 4595–4876 | Calendário, `CRONO` (grade semanal, 4745), Aula de hoje |
| 4886–5245 | Área do professor (login 4914–4953, painel, relatórios) |
| 5248–5548 | Quiz ao vivo (bancos demo, polling simulado, lado do aluno) |
| 5552–5687 | Vinheta/`entrarApp`/`acessarPortal` |
| 5697–7017 | **Tutorial** (roteiro `TUT` de 29 passos em 5764–5857, motor, pular/concluir) |
| 7021–7860 | Perfil, avatar/variantes de foto, rankings, prova de promoção (7547), Domínio (7845) |
| 7860–8648 | Estrutura, criação de turmas/isoladas, Banco de professores, reset demo (8639) |
| 8650–9782 | **Quad Store**: compra genérica 8667 · matrícula 8757 · salas/`SALA_CAP` 8920–9044 · choque de agenda 9056–9118 · skins 9702 · combate 9602 |
| 9786–10141 | Gate admin (9787), contas, crédito manual, mensagens por público, gift cards, estornos (visão admin) |
| 10143–10800 | Avisos, cronograma do admin, materiais, eventos do admin, pedidos |
| 10820–11225 | Portaria (`ACESSO_ST`), inscritos/PDF por impressão, simulados do admin |
| 11236–11842 | Relatórios, editores de preços, `COMPRAS`/estornos/relatório de compras |
| 11845–11920 | Bloco de init final (com dependência de ordem de declaração comentada em 11884–11885) |

Armadilhas conhecidas: `var score` é a **moeda**, não o score de carreira (l.3672); `hojeISO` definida 2× (l.3852 e 6326); comentário desatualizado em `definirTurmaAtiva` (l.3873–3874) sobre a chave do cronograma; view `v-pretaf` órfã (inalcançável pela UI); `#connToggle` referenciado no JS não existe no HTML (modo offline inatingível).

---

## 7. O que NÃO deve ser confundido com sistema real

Lista explícita — tudo abaixo é SIMULADO LOCALMENTE e/ou APENAS VISUAL no protótipo:

- **Login e autenticação** — aluno entra com qualquer e-mail+senha; gates de professor/admin são overlays JS removíveis por DevTools; senhas e chave demo impressas na própria tela. Real: DEPENDE DO BACK-END.
- **Pagamentos e moedas** — `score` (Quad Coins) e `diamantes` são variáveis; F5 devolve 1.240/150. Não há transação, ledger ou gateway. Real: DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (checkout/Pagar.me).
- **Estoque e vagas** — decremento de variável local; concorrência inexistente. Real: DEPENDE DE BANCO DE DADOS (reserva atômica).
- **Matrículas** — array `MATRICULAS` em memória; "verificação de matrícula" na vinheta é encenada. Real: DEPENDE DE SISTEMA EXTERNO (site/checkout) + DEPENDE DE BANCO DE DADOS.
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
- **Persistência** — só 8 flags `vq_*` no localStorage; todo o resto zera no F5.
- **Prova de promoção, crédito manual, estorno, portaria** — mecânicas completas, porém 100% no cliente; qualquer valor é forjável pelo console (hooks `window.__*`).

---

## 8. Fontes documentais e hierarquia

Regra de leitura (detalhe no doc 08 — matriz de fontes):

1. **Comportamento vigente** → `src.html` (o código é a verdade final do que o protótipo faz).
2. **Intenção de produto vigente** → `docs/02-registro-de-decisoes.md` (decisão mais recente vence; cuidado com 126–129 duplicadas) + `CHANGELOG.md` (contexto e datas).
3. **Visão, faseamento e economia-alvo** → `docs/Viver-o-Quad-Relatorio-rev2-3.pdf` (canônico, mas **pendente da rev. 2.4** — diverge do protótipo em economia, moedas e escopo V0/V1; ver doc 10).
4. **README, docs/00, docs/01, docs/03** → registros históricos de ~18/07; não confie sem conferir.
5. **docs/auditoria/00–11** → fotografia verificada de 30/07 (este conjunto).

## 9. Decisões vigentes mais importantes (top 20, com nº)

Fonte: `docs/02-registro-de-decisoes.md` + verificação no código pelos investigadores (docs 04/05).

| Nº | Decisão (vigente) |
|---|---|
| 17 | Mascote chama-se **QUAD** (substitui "Danilo", dec. 3/7); tutorial obrigatório no 1º acesso (roteiro decomposto em 29 beats no código) |
| 21 | **Cadastro é no site (checkout)**; o app só faz login — removidos código por e-mail, ativação e cadastro interno (substitui 5/6) |
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

**Leia o doc `10-divergencias-e-decisoes-pendentes.md` na íntegra antes de codificar qualquer coisa.** As dez mais impactantes, em resumo: economia ativa na V0 × "sem economia ativa" da rev. 2.3; Diamante sem cobertura no documento-base; `var score` = moeda (armadilha de nomenclatura); mascote QUAD × resíduos "Danilo" (assets, ids e um texto no app, l.3637); tutorial 9×19×29 passos; dec. 105 × comportamento real do `vq_tut_skip`; README/docs/00/03 com URL antiga e build.ps1 como único build; decisões 126–129 duplicadas; gate admin sem validar e-mail; telemetria pré-requisito da V0 que é só texto. Cada uma tem responsável e pergunta objetiva no doc 10.

## 11. O que pode ser aproveitado

**Detalhe no doc `11-avaliacao-de-reaproveitamento.md`.** Em síntese, aproveitam-se sobretudo como **especificação, não como código de produção**:

- **As regras de negócio** (RN-01–RN-61 no doc 05) — o protótipo é a especificação executável mais precisa que existe do produto: estorno/consumo, choque de agenda, vagas por moeda, turma ativa, lotação por sala, privacidade de ranking.
- **O roteiro do tutorial** (`TUT`, 29 beats) e todo o microcopy em pt-BR (tom já validado com o gestor).
- **A parametrização `GAMI`** (14 patentes, 4 fases, recompensas) como base do config de gamificação.
- **A árvore real do edital CFO PM-BA** (13 matérias, ~100 assuntos, ~427 sub-assuntos) — conteúdo real transcrito.
- **CSS/design system** (temas claro/escuro, tokens, componentes) como referência visual direta.
- **Os fluxos validados** (login→vinheta→tutorial; compra→estorno; quiz professor↔aluno) como roteiro de QA e de produto.

## 12. O que deve ser reconstruído (não migrado)

Tudo o que é **estado e lógica de negócio no cliente**: autenticação/RBAC, carteiras e ledger de moedas (o Anexo A da rev. 2.3 exige ledger auditável), matrículas, estoque/vagas com reserva atômica, quiz ao vivo (tempo real de verdade), extração de PDF, geração/leitura de QR, telemetria e taxonomia de origem de sessão (pré-requisito da V0), rankings, mensageria/notificações, relatórios, persistência de qualquer coisa. A arquitetura de um arquivo/IIFE único com 8.250 linhas de JS acoplado **não é base de produção** — o valor está nas regras e nas telas, não na estrutura. O ecossistema previsto (site/checkout, plataforma de cursos, cadastro geral, financeiro, banco de questões, painel administrativo, sistema pedagógico, autenticação, eventos, materiais, notificações, relatórios) indica que o app real será **cliente de vários sistemas**, não dono deles (doc 07 e 09).

---

## 13. Sequência recomendada para iniciar

1. **Rode e navegue** (seção 3): as 3 personas, o tutorial completo, uma compra + estorno, um quiz ao vivo, criação de turma no admin.
2. **Leia na ordem da seção 1** (docs 00 → 13 → PDF → decisões → CHANGELOG → auditoria 01–12, fechando com o plano de transformação do doc 12).
3. **Leve as perguntas da seção 14 ao Danilo** (produto) — várias travam arquitetura (economia no piloto, Diamante, corte V0/V1).
4. **Higiene do repositório** (baixo risco, alto retorno): caminho do `build.py`, validação de tokens no `build.ps1`, README/docs 00/03 atualizados, remoção do `.rar` e do `quad-coin.png` (com ok do gestor), botão `[DEMO PROVISÓRIO]`, textos residuais "Danilo"/l.3633/3637, `v-pretaf` (religar ou remover).
5. **Recrie a rede de testes**: o repositório não tem nenhum teste — os hooks `window.__*` documentam onde as suítes Playwright se apoiavam; versione as novas junto do código.
6. **Especifique os contratos externos** marcados `[INTEGRAÇÃO REAL]` no fonte (24 pontos): checkout/recarga de Diamante, cadastro/matrícula, planilha do cronograma, extração de PDF, QR, validação de login.
7. **Desenhe o back-end mínimo da V0 real começando pela telemetria** (taxonomia de origem + linha de base — o relatório diz que "a V0 não começa sem" isso) e pela autenticação.
8. **Só então** migre telas — usando o protótipo como especificação visual e de regras.

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
13. **"Viver o Quad.rar"** (9 MB, versionado, órfão) pode sair do repositório?
14. Regras de **alteração de graduação do aluno** e retenção/eliminação de dados (LGPD): quem define e quando?

## 15. Checklist técnico inicial

- [ ] Clonei o repo e ajustei a l.2 do `build.py` (ou usei `build.ps1` no Windows)
- [ ] Build rodou sem erro e `index.html` (~9,4 MB) abre no navegador
- [ ] Entrei nas 3 personas com as credenciais da seção 3 (aluno livre · `moura@quadconcursos.com.br`/`quad1234` · chave `NPP-2026`)
- [ ] Fiz o tutorial completo, uma compra + estorno, um quiz ao vivo e criei uma turma no admin
- [ ] Li docs/auditoria 00, 10 e 11 e o registro de decisões (ciente das duplicatas 126–129)
- [ ] Confirmei com o gestor a URL vigente do artefato e atualizei README/docs 00/03
- [ ] Corrigi caminho do `build.py` em definitivo e adicionei validação de tokens ao `build.ps1` (ou elegi um build canônico)
- [ ] Removi (com ok do gestor) `Viver o Quad.rar` e `quad-coin.png` do versionamento
- [ ] Marquei para remoção: botão `[DEMO PROVISÓRIO]` (l.1997/7740), código morto (`openQuiz`, `fmtSync`, `tutDadosOk`, `LINKS_ONLINE`, chaves `vq_*` mortas), resíduos "Danilo" (l.3633/3637)
- [ ] Decidi o destino da view órfã `v-pretaf` e do `#connToggle` inexistente
- [ ] Planejei o rename `var score` → `qdc` (ou documentei a armadilha para a equipe)
- [ ] Defini política dos hooks `window.__*` (manter em dev, excluir de build de produção)
- [ ] Criei e versionei suíte de testes nova (o repo não tem nenhuma; Playwright sugerido — os hooks já existem)
- [ ] Agendei a reunião de perguntas da seção 14 com o Danilo
- [ ] Mapeei os 24 pontos `[INTEGRAÇÃO REAL]` do src.html numa lista de contratos a especificar

---

*Documento 13 da série de auditoria (docs/auditoria/00 a 13). Divergências: doc 10. Reaproveitamento: doc 11. Regras de negócio completas: doc 05. Dados e LGPD: doc 06.*
