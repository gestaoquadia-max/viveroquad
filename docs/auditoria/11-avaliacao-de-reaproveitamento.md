# 11 · Avaliação de reaproveitamento — Auditoria do protótipo "Viver o Quad" (V0 "Prova de Vida")

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

Este documento responde a uma pergunta única: **do que existe hoje no repositório, o que serve para o produto real — e em que qualidade?** Ele foi escrito para o desenvolvedor que vai construir o sistema de verdade e para o gestor Danilo Moura, que precisa saber o que o protótipo "vale" como patrimônio.

A resposta honesta, antecipada: **o maior valor do protótipo não é o código — é a especificação viva que ele carrega.** O `src.html` é um monólito de 11.920 linhas (um único IIFE de ~8.250 linhas de JS, ~207 variáveis globais internas, 235 listeners, tudo em memória) que NÃO é arquitetura recomendada para produção e não deve ser "aproveitado" tecnicamente para economizar trabalho. O que ele contém de valioso — e é muito — são: as 61 regras de negócio já decididas e demonstradas (RN-01–RN-61, doc 05), o roteiro completo de onboarding, a identidade visual pronta, as mídias produzidas, os textos de interface e um histórico de 181 decisões com CHANGELOG de 116 entradas. Isso encurta meses de descoberta de produto. O código em si, quase nada.

> **Atualização — Consolidação Arquitetural v1.0 (01/08/2026):** o fonte foi **dividido em 20 partes contíguas em `src/`** (a concatenação na ordem reproduz o monolito; saída de build byte-idêntica), o build ganhou portabilidade e validações (§3.6), os órfãos `Viver o Quad.rar` e `quad-coin.png` foram removidos do repositório e boa parte do código morto da seção 4 foi removida do fonte com regressão completa (56 suítes). **Nada disso muda os vereditos deste documento**: o resultado concatenado continua um protótipo de documento único — mais manutenível, porém não é a arquitetura final, e a implementação real segue sendo RECONSTRUIR.

---

## 1. As cinco categorias usadas neste documento

| Categoria | Significado prático |
|---|---|
| **REAPROVEITAR COMO REFERÊNCIA VISUAL** | O artefato serve como "foto" do que construir (telas, estilo, movimento, textos). Nenhuma linha de código migra; o time de front-end real constrói olhando para ele. |
| **REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO** | O comportamento demonstrado vira requisito escrito. A implementação é refeita do zero (em geral no servidor); o protótipo é a prova de conceito e o critério de aceitação. |
| **REAPROVEITAR COM REFATORAÇÃO** | O artefato em si continua em uso (em geral **dentro do ciclo de vida do protótipo**, como ferramenta de demonstração), após correções pontuais. |
| **RECONSTRUIR** | A funcionalidade é necessária no produto real, mas nada da implementação atual sobrevive — nasce de novo, com arquitetura própria. |
| **DESCARTAR APÓS VALIDAÇÃO** | Peso morto (código morto, arquivo órfão, resíduo de rodadas anteriores). Remover depois que um humano confirmar que não há uso oculto. |

Um mesmo ativo pode ter mais de uma categoria (ex.: a Loja é REFERÊNCIA VISUAL para o front real **e** REGRA OU ESPECIFICAÇÃO para o back-end — e o seu código JS é RECONSTRUIR). O vocabulário de status da auditoria (CONFIRMADO NO CÓDIGO, SIMULADO LOCALMENTE, APENAS VISUAL etc.) é usado quando o julgamento depende do que foi verificado.

**Regra de ouro aplicada em todo o documento:** não se recomenda reaproveitamento técnico apenas para economizar trabalho. Quando houver dúvida entre "adaptar o que existe" e "reescrever com fronteiras corretas", este documento recomenda reescrever.

---

## 2. Quadro-resumo

| Área | Categoria dominante | Categorias secundárias | Risco principal se mal reaproveitado |
|---|---|---|---|
| Design/CSS (identidade, temas, tokens) | REAPROVEITAR COMO REFERÊNCIA VISUAL | REAPROVEITAR COM REFATORAÇÃO (extrair design tokens) | Copiar o CSS junto com a moldura de protótipo (celular fixo de 384 px) |
| HTML das 22 telas e 21 overlays | REAPROVEITAR COMO REFERÊNCIA VISUAL | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO (estrutura de informação) | Herdar HTML sem acessibilidade de teclado (0 tabindex, sem Esc, sem focus-trap) |
| Textos de interface (microcopy) | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO | — | Perder a voz do produto na reescrita |
| Lógica de regras de negócio (JS) | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO | RECONSTRUIR (implementação) | Portar código cliente que decide valor (moeda, promoção, vaga) para produção |
| Dados mock (seeds) | DESCARTAR APÓS VALIDAÇÃO | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO (exceções: árvore CFO, GAMI, roteiro TUT, bancos de questões demo) | Confundir seed com dado real; telefones/nomes plausíveis vazando |
| Build (build.py / build.ps1) | REAPROVEITAR COM REFATORAÇÃO (só para o protótipo) — **refatoração aplicada em 01/08, ver §3.6** | RECONSTRUIR (no produto real não existe equivalente) | Achar que o "build" do protótipo é um pipeline de produção |
| Hooks de teste `window.__*` | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO (inventário de casos de teste) | DESCARTAR APÓS VALIDAÇÃO (no build de produção) | Publicar hooks de manipulação de estado em app com dado real |
| Documentação | dividida: CHANGELOG + docs/02 = REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO; README/00/03 = RECONSTRUIR (**reconstrução executada em 01/08** — ver §3.8); PDF rev. 2.3 = base a revisar | REAPROVEITAR COM REFATORAÇÃO (renumerar decisões) | Desenvolvedor novo seguir o README (risco sanado em 01/08 com a reescrita) |
| Mídias (fotos, sprites, vídeo, fontes, logos) | REAPROVEITAR COM REFATORAÇÃO | DESCARTAR APÓS VALIDAÇÃO (órfãos: quad-coin.png, .rar — **removidos em 01/08**) | Renomear/perder o vínculo variante↔avatar das 84 fotos |
| Gamificação (patentes, score, prova, tutorial) | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO | RECONSTRUIR (motor) | Reaproveitar correção/gabarito no cliente (fraude trivial) |
| Economia (moedas, Loja, estornos, gift cards) | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO | RECONSTRUIR (ledger); DECISÃO DE PRODUTO PENDENTE (rev. 2.4) | Tratar como decidido o que a rev. 2.3 ainda não absorveu (Diamante, economia na V0) |
| Área do administrador (N.P.P.) | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO | RECONSTRUIR | Herdar vícios do protótipo (nome como chave primária, preço raspado do DOM) |
| Área do professor | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO | RECONSTRUIR | Herdar e-mail derivado do sobrenome como regra de identidade |
| Persistência local (localStorage `vq_*`) | RECONSTRUIR | DESCARTAR APÓS VALIDAÇÃO (4 chaves mortas — **chaves mortas removidas em 01/08**; ver §3.14) | Basear continuidade de conta em flag de dispositivo |
| Suítes Playwright (externas, não versionadas) | RECONSTRUIR (recuperar e versionar) | — | Perder a única rede de regressão que o protótipo já teve |

---

## 3. Avaliação por área

### 3.1 Design e CSS — REAPROVEITAR COMO REFERÊNCIA VISUAL (+ extrair tokens)

**O que existe (CONFIRMADO NO CÓDIGO):** ~1.568 linhas de CSS (src.html l. 3–1570) com variáveis em `:root`, tema claro/escuro duplo (`prefers-color-scheme` + `data-theme`), `prefers-reduced-motion` respeitado no CSS (l. 1564) e no JS (pausa do vídeo do mascote), contraste medido na auditoria (texto principal 13,1:1 claro / 12,2:1 escuro; `--ink-dim` e o acento `#1B7FC4` passam AA por margem mínima), 81 atributos ARIA e todas as 16 tags `<img>` do fonte com `alt` (imagens adicionais de avatar são geradas em runtime via canvas, fora dessa contagem).

**Justificativa:** a identidade visual está madura e testada com o gestor — é exatamente o tipo de decisão cara de refazer. As variáveis de cor/tipografia/espaçamento merecem ser **extraídas para um design system formal** (tokens versionados), que é a única parte do CSS que "migra" como artefato.

**O que NÃO migra:** a moldura `.phone` de **384 px fixos** (l. 65) com `aside` explicativo ao lado — isso é cenografia de protótipo ("celular emoldurado numa página de demonstração"), não layout responsivo de app. O produto real precisa de layout fluido nativo/mobile-first, reescrito.

**Risco:** copiar CSS por atacado e herdar a cenografia; ou herdar as fraquezas objetivas de acessibilidade que o CSS não resolve sozinho (0 `tabindex` no arquivo, só 2 handlers de teclado, sem Esc para fechar as 21 camadas, sem focus-trap em modal — CONFIRMADO NO CÓDIGO). O visual é referência; a acessibilidade real é RECONSTRUIR.

### 3.2 HTML das telas — REAPROVEITAR COMO REFERÊNCIA VISUAL + REGRA OU ESPECIFICAÇÃO (arquitetura de informação)

**O que existe:** 22 views (9 aluno, 5 professor, 8 admin), 3 navbars, 21 overlays, ~21 blocos `data-bl` no admin — inventariados nos docs 01 e 02 desta auditoria.

**Justificativa:** a **estrutura de informação** (o que cada tela mostra, em que ordem, com que agrupamento — ex.: Loja em macro-blocos PRESENCIAIS/DIGITAIS + Estornos + Relatório; Quadrômetro com trilha de 14 patentes; Liberações com físicos/portaria/inscritos) é decisão de produto validada e deve ser transportada como especificação de tela. O HTML em si (IDs, `innerHTML` concatenado, dependência do IIFE) não é componente reutilizável em nenhum framework moderno.

**Risco:** baixo se usado como referência; alto se alguém tentar "recortar" trechos de HTML para o app real — cada tela depende de dezenas de renderizadores do IIFE (ex.: `showView()` l. 4040 dispara re-render de TODAS as personas) e não funciona isolada.

### 3.3 Textos de interface (microcopy) — REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO

**O que existe:** voz do produto consolidada em centenas de strings: mensagens cordiais ("Olá! Informamos que o sr./a sra. está temporariamente afastado das atividades…", l. ~8097), avisos de compra ("a escolha é sua — sem reposição de aula"), falas do mascote QUAD no tutorial (29 passos), rótulos militares (patentes, "nome de guerra", "mochila de combate", "portaria").

**Justificativa:** microcopy é ativo de produto barato de extrair e caro de recriar. Recomenda-se exportar as strings para um catálogo (planilha ou arquivo de i18n) e tratá-lo como especificação editorial.

**Risco:** resíduos desatualizados embarcados junto — o próprio app ainda exibe "Danilo, o guia" (l. 3637, DIVERGÊNCIA DOCUMENTAL: o mascote vigente é QUAD) e o aside descreve fluxo de login antigo (e-mails demo/código 123456). A extração precisa passar pelo filtro das divergências do doc 10/documentação.

### 3.4 Lógica de regras de negócio (JS) — REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO; implementação: RECONSTRUIR

**O que existe:** 61 regras catalogadas no doc 05 (RN-01–RN-61), todas CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE: turma ativa; vagas por moeda; bloqueio de turno; choque de agenda que avisa sem impedir (exceto matrícula); estorno em 7 dias com "consumo mata estorno"; estorno que desfaz a posse por tipo; lotação herdada da sala; reserva unificada de salas + Estúdio; gift card de liberação única; prova de promoção com 20 questões difíceis do próprio aluno; privacidade de mão dupla no ranking; mensagens por público; e assim por diante.

**Justificativa:** este é **o ativo mais valioso do repositório**. Cada regra tem decisão numerada, evidência de código e comportamento observável — é um caderno de requisitos funcional pronto para virar backlog. O protótipo ainda serve como **oráculo de aceitação**: "o sistema real deve se comportar como o protótipo se comporta aqui" é um critério de teste objetivo.

**Por que a implementação é RECONSTRUIR, sem exceção relevante:**
1. O próprio código admite: "no sistema real vem validado do servidor — a interface nunca decide sozinha quantos pontos foram conquistados" (l. 3706–3707). Hoje TODA decisão de valor (crédito de moeda, promoção de patente, baixa de vaga, consumo de compra) é executada no cliente — modelo inaceitável com dado real.
2. Gabaritos embutidos no cliente (`QUESTIONS`, `QA_MULT`, `QA_CE`, prova de patente) tornam fraude trivial.
3. O acoplamento é total por desenho (as 3 personas compartilham o mesmo estado no mesmo arquivo para realizar o "tudo conectado" da demo) — não há fronteira de módulo para extrair.
4. Os 24 pontos `[INTEGRAÇÃO REAL]` marcados no fonte já dizem onde o autor sabia que o protótipo termina.
5. Duplicatas e fragilidades internas (função `hojeISO` definida 2× — a duplicata foi removida em 01/08 —, dependência de ordem de declaração comentada no bloco final l. 11884–11885, sem `use strict`) confirmam que o arquivo não foi escrito para viver além da demo.

**Exceção parcial (algoritmos como pseudo-especificação):** meia dúzia de algoritmos merecem ser transcritos para a especificação porque codificam decisões finas de produto: `salaConflito()`/`salaOcupacoes()` (definição exata de "choque": mesma sala + mesmo dia da semana + horários cruzados + períodos cruzados, l. 8942–8980), `choqueDeAgenda()` (agenda do aluno), `tutGuerraOk()` (nome de guerra: só letras, sem palavrão, subsequência ordenada do nome completo, nunca o nome inteiro, l. 5731–5748), `estornoDias()`/`compraConsumida()` (janela de 7 dias × consumo), `rkNomeExibido()` (privacidade de mão dupla com top 10 sempre visível). Transcrever a LÓGICA, não portar o código.

**Risco:** o pior cenário desta auditoria seria um desenvolvedor "aproveitar" o IIFE como base do app real. Registre-se com todas as letras: **o monólito não é arquitetura recomendada e não deve ser ponto de partida técnico.** *(Atualização 01/08: o fonte foi dividido em 20 partes contíguas em `src/` — isso facilita a manutenção do protótipo, mas não muda este veredito: o concatenado continua o mesmo documento único de protótipo, não a arquitetura final, e a implementação real segue sendo RECONSTRUIR.)*

### 3.5 Dados mock (seeds) — DESCARTAR APÓS VALIDAÇÃO, com exceções nominais

**Regra geral:** os arrays-semente (`TURMAS_LOJA`, `MATRICULAS`, `EVENTOS`, `SIMULADOS`, `COMPRAS`, `PEDIDOS`, `CONTAS`, `RK_NOMES`, `ATIVIDADES`, números fixos como "1.286 alunos" e "#87 no geral") existem para a demo parecer viva. São APENAS VISUAL / SIMULADO LOCALMENTE e **não devem contaminar o sistema real** — nem como fixture, porque carregam inconsistências conhecidas (dois nomes completos para o mesmo aluno: `DB_ALUNO.nome` ≠ `carreira.nomeCompleto`; grade `CRONO` com ~10 professores que não existem em `DOCENTES`; telefones em formato plausível de Salvador, má prática mesmo em mock).

**Exceções — REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO (ou como carga inicial, após validação humana):**

| Ativo | Por quê | Ressalva |
|---|---|---|
| `EDITAL_CFO` (l. 4092): árvore completa CFO PM-BA, 13 matérias / ~100 assuntos / ~427 sub-assuntos | Conteúdo real transcrito — serve de carga inicial do banco de editais | Conferir contra o edital oficial vigente antes de importar |
| `GAMI` (l. 3678): 14 patentes, 4 fases, notas mínimas, pontos por patente | Parametrização de gamificação já decidida | Resolver a DIVERGÊNCIA `notaMin` por fase × `PROVA_APROV=0.80` fixo antes de especificar |
| `MODALIDADES` (l. 4134): RONDESP 70/30, PATAMO 50/50, BOPE 20/80 | Régua pedagógica oficial das modalidades | Efeito pedagógico é APENAS VISUAL no protótipo — a régua real é do sistema pedagógico |
| Roteiro `TUT` (l. 5764–5857): 29 passos do onboarding | Roteiro de produto validado com o gestor | Contagem oficial divergente (9/19/29 — DECISÃO DE PRODUTO PENDENTE, doc de documentação §3.2) |
| `SALA_CAP` (l. 8922): lotação das 4 salas + Estúdio | Retrata a sede real (155/85/125/185) | Validar com a operação; no real é cadastro configurável, nunca hardcoded |
| `TR_BANK`/`AULA_DEMO`/`TQ` (~100 questões e flashcards) | Conteúdo pedagógico aproveitável como amostra do banco de questões | Revisão pedagógica antes de qualquer uso com aluno |
| `TUT_PALAVROES` (l. 5699) | Semente do filtro de moderação | Lista oficial é DECISÃO DE PRODUTO PENDENTE |

**Risco:** seeds "realistas demais" viram dado de produção por preguiça. A validação humana da coluna "Ressalva" é obrigatória antes de qualquer importação.

### 3.6 Build (build.py / build.ps1) — REAPROVEITAR COM REFATORAÇÃO, escopo restrito ao protótipo

**O que existe (CONFIRMADO NO CÓDIGO):** dois scripts equivalentes que embutem 10 tokens de mídia em base64 e geram `index.html`/`artifact.html` (~9,4 MB). O rebuild reproduz o artefato byte a byte (verificado por `cmp` na auditoria) — o build está íntegro e sincronizado.

**Justificativa:** enquanto o protótipo existir como ferramenta de demonstração, o build precisa continuar funcionando — e para isso vale refatorar: (1) trocar o caminho absoluto fixo `/home/user/viveroquad` do build.py (l. 2) por caminho relativo; (2) adicionar validação de token ausente ao build.ps1 (hoje passa em silêncio e pode publicar `__TOKEN__` cru); (3) validar contagem de fotos em `fotos/` (hoje pasta vazia passa em silêncio); (4) eleger UM script canônico e documentá-lo (hoje README/docs só citam build.ps1, mas o último build foi feito com build.py).

**Atualização — recomendações JÁ aplicadas (01/08/2026, Consolidação v1.0):** as recomendações (1) e (2) foram executadas — build.py passou a usar caminho relativo ao script (portátil) e os dois scripts validam token ausente **e** sobra de token não substituído. Além disso, o fonte foi dividido em 20 partes contíguas em `src/` e o build valida a contagem de partes (aborta se não achar exatamente 20), com saída byte-idêntica verificada. As recomendações (3) (contagem de fotos) e (4) (script canônico único) seguem em aberto.

**Para o produto real:** RECONSTRUIR — não existe equivalente. Um app de verdade tem pipeline de assets, CDN, cache e streaming de mídia; "9,4 MB de HTML com vídeo em base64" é uma técnica de protótipo autocontido, correta para o fim a que serve e inaplicável fora dele.

**Risco:** baixo. O único risco real é documental — desenvolvedor seguindo o guia 03 (que descreve 3 tokens e "~4 MB") em vez do estado real (10 tokens, 9,4 MB).

### 3.7 Hooks de teste `window.__*` — REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO (inventário de testes); no build final, DESCARTAR APÓS VALIDAÇÃO

**O que existe:** 31 hooks confirmados (`__admTudo`, `__eventos`, `__turmaAtiva`, `__evLotar`, `__noite.concluirTudo()`, `__mat.encerrar()`, `__prova`…), expostos para suítes Playwright de desenvolvimento que **não estão versionadas no repositório** — os hooks são a única memória delas.

**Justificativa dupla:**
- **Como especificação:** cada hook denuncia um caso de teste que já existiu (lotar evento, encerrar todas as matrículas, concluir a noite, forçar Domínio). Esse inventário deve virar a base da suíte de testes do sistema real — é conhecimento de QA que custou rodadas para acumular.
- **Como código:** hooks que manipulam estado (concluir missões sem responder, encerrar matrículas, forçar lotação) **não podem existir em build com dado real**. A política correta é build duplo (dev com hooks / produção sem) — DECISÃO TÉCNICA PENDENTE já registrada pela auditoria (doc 01, §6.4; doc 04, TR-05).

**Ação urgente correlata:** localizar e **versionar as suítes Playwright** (viviam no ambiente de desenvolvimento). Sem elas, o repositório não reproduz a verificação de regressão de nada — qualquer manutenção do protótipo hoje opera sem rede de proteção. Se estiverem perdidas: RECONSTRUIR a partir do inventário de hooks + CHANGELOG (que cita as suítes `vtut`, `vfasea`–`vfaseh`, `vdmn`, `vrelatorios`…).

### 3.8 Documentação — avaliação arquivo a arquivo

| Documento | Categoria | Justificativa e risco |
|---|---|---|
| `CHANGELOG.md` (116 entradas) | **REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO** | Fonte histórica mais fiel e atual; único documento que acompanhou o código até 28/07. Preservar intacto. |
| `docs/02-registro-de-decisoes.md` (dec. 1–181) | **REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO** + REAPROVEITAR COM REFATORAÇÃO | É o contrato de produto do protótipo. Refatoração necessária: resolver as duplicatas reais 128/129 (colisão de conteúdo), as repetidas 126/127 e a ordenação quebrada no fim do arquivo — citar "decisão 128" hoje é ambíguo (DIVERGÊNCIA DOCUMENTAL). |
| `docs/Viver-o-Quad-Relatorio-rev2-3.pdf` | **REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO**, condicionado à rev. 2.4 | Documento-base canônico (faseamento, economia, princípios do Anexo A) — mas superado em pontos centrais pelo protótipo (economia na V0, Diamante, Quad Coin por atividade direta). A rev. 2.4 é pendência formal desde a dec. 11; até ela sair, o PDF especifica o ALVO e o registro de decisões especifica o VIGENTE. |
| `README.md`, `docs/00-comece-aqui-danilo.md`, `docs/03-guia-de-build-e-publicacao.md` | **RECONSTRUIR** — ✅ **executado em 01/08** (reescritos contra a Consolidação v1.0) | Registro de 30/07: congelados em ~18/07, com URL antiga do artefato, tour de "9 passos" que não existia, roteiro guiando para telas removidas, build.py invisível, tamanhos irreais e árvore com ≥10 omissões — desorientavam quem chegava. *Atualização 01/08:* os três foram **reescritos** (URL vigente, fonte em `src/`, os dois builds, árvore e roteiro atuais) e voltaram a ser documentos de entrada confiáveis. |
| `docs/01-visao-e-escopo.md` | REAPROVEITAR COM REFATORAÇÃO — ✅ **refatoração executada em 01/08** | Síntese fiel do PDF; a nota de defasagem recomendada foi **superada pela reescrita de 01/08**: o doc agora subordina a rev. 2.3 à Consolidação e registra a **revogação da dec. 21** (cadastro pertence ao app — o inverso da nota que a auditoria sugerira em 30/07). |
| Documentos desta auditoria (`docs/auditoria/`) | REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO | Retrato verificado de 30/07 — base recomendada para o kickoff do sistema real. |

### 3.9 Mídias — REAPROVEITAR COM REFATORAÇÃO (higiene), com dois descartes

**Reaproveitar (são ativos de marca/arte prontos):** `fonts.css` (Exo 2/Inter embutidas), `danilo.mp4` e `danilo-sprite.png` (mascote QUAD — 7 poses), `logo.jpg`, `simbolo-quad-transparente.png`, `avatars.jpg` (12 avatares), `insignias.jpg` (10 artes), `quad-coin.webp`, `diamante.webp` e as **84 fotos** `fotos/<variante>-<n>.webp` (7 variantes × 12 avatares — o vínculo variante↔índice do avatar é parte da especificação de skins e não pode se perder). Refatoração recomendada: renomear os ativos "danilo*" para o nome vigente do mascote (QUAD) quando for barato fazê-lo, e mover tudo para um repositório/CDN de assets com metadados.

**DESCARTAR APÓS VALIDAÇÃO:**
- `quad-coin.png` (904 KB): órfão — nenhum build o usa (ambos usam o .webp). CONFIRMADO NO CÓDIGO.
- `Viver o Quad.rar` (9 MB, versionado, não referenciado por nada): HIPÓTESE de cópia antiga; dobra o peso do clone. Validar o conteúdo com o gestor e remover do versionamento.

**Risco:** perda de rastreabilidade das artes (nenhum doc lista as mídias completas — a árvore do README omite a maioria) e resíduo de nomenclatura "danilo" confundindo a marca do mascote.

### 3.10 Gamificação — REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO; motor: RECONSTRUIR

**Valor de especificação (alto):** 14 patentes em 4 fases; score de carreira/patente/temporada separados da moeda; "score não promove sozinho — libera a prova"; prova de promoção com 20 questões colhidas do que o aluno marcou Errei/Difícil, 80% promove com transferência de excedente, reprovação bloqueia 24h; recompensas de missões (+1 score/acerto, +5 QdC/bloco, bônus da noite por turma, garimpo em evento); tutorial com recompensas únicas e "Pular" que reproduz o estado final; Introdução no Quad como estado DA CONTA. Tudo demonstrado e jogável — especificação de rara qualidade.

**Por que o motor é RECONSTRUIR:** correção e premiação no cliente = fraude trivial (o protótipo até expõe `__noite.concluirTudo()` e o botão `[DEMO PROVISÓRIO — REMOVER]` que sobe patente por clique, ainda ativo — l. 7740). O back-end de gamificação real valida cada ponto; o app apenas exibe.

**Pendências que a especificação herda:** nota mínima POR FASE não aplicada (`PROVA_APROV` fixo — DECISÃO TÉCNICA PENDENTE); mecânica de Quad Coin diverge do Anexo A (sem Marcos de Conquista, sem Score Qualificado, sem ledger — DIVERGÊNCIA DOCUMENTAL aguardando rev. 2.4); regras de graduação do aluno "o gestor definirá" (DECISÃO DE PRODUTO PENDENTE).

### 3.11 Economia e Loja — REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO; tudo o mais: RECONSTRUIR

**Valor de especificação (alto):** duas moedas com papéis distintos (QdC conquistada / Diamante comprada em dinheiro, nunca conquistada); preços e VAGAS POR MOEDA; confirmação em toda compra; estoque físico decrescente com pedido de retirada; item de combate de recompra livre; cadeia de skins com farda de escolha única que veste a foto; estorno em 7 dias, dois toques, desfazendo a posse por tipo; consumo (entrada liberada/entrega) mata o estorno; gift card de lote com liberação única; crédito manual com motivo e histórico; relatório de compras do aluno por situação. É o desenho completo de uma loja interna — pronto para virar requisito.

**Por que RECONSTRUIR:** carteira, estoque de vagas e ledger no cliente são impossíveis com dinheiro real; a reserva de vaga é concorrente (transação atômica); estorno real é gateway de pagamento (DEPENDE DE SISTEMA EXTERNO). Nada do JS da Loja migra — inclusive porque parte da governança do protótipo raspa preços do próprio DOM (l. 11303–11312), artifício explicitamente não-modelo.

**Atenção de produto (a maior do documento):** a economia inteira é uma **antecipação de V1/V1-C demonstrada na V0**, em divergência declarada com o documento-base ("Sem economia ativa" na V0; Diamante não existe na rev. 2.3). Antes de qualquer construção real: rev. 2.4, crivo Financeiro/Jurídico dos ralos de valor real e decisão sobre o corte do piloto (DECISÃO DE PRODUTO PENDENTE — ver doc de documentação §3.5–3.6). **Reaproveitar a especificação ≠ considerá-la aprovada.**

### 3.12 Área do administrador (N.P.P.) — REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO; implementação: RECONSTRUIR

**Valor de especificação:** o painel demonstra um ciclo administrativo completo e coerente — Banco de professores com desligar/bloquear/apagar e propagação de rename; criação de turmas com validações que falam a língua da operação ("A Sala X comporta N pessoas — você pediu M vagas"; turno derivado do horário; choque de sala); mapa de ocupação unificado (turmas+isoladas+eventos+simulados+Estúdio); avisos por turma-alvo; cronograma como fonte única do corpo docente; materiais com download real; eventos com herança de lotação da sala; simulados com regras por modalidade; skins/itens; liberações (pedidos, portaria que consome compra, listas de conferência); relatórios com dado vivo + sintético; governança de preços. Cada bloco tem ficha no doc 04/regras — transportável direto para o backlog do painel administrativo real.

**Vícios de protótipo que NÃO migram (todos CONFIRMADOS):** nome do professor como chave primária (o próprio código admite, l. 8142–8146 — o real usa ID estável); preços raspados do DOM; "PDF" de lista por `window.print()`; gate que valida só a chave `NPP-2026` com e-mail livre (a autorização real é RBAC por pessoa, emissão/revogação pela direção — `[INTEGRAÇÃO REAL]` l. 9790); `ATIVIDADES` fixas duplicando eventos vivos; texto da UI prometendo devolução de estoque na entrega que o código não faz (DIVERGÊNCIA DOCUMENTAL interna).

### 3.13 Área do professor — REAPROVEITAR COMO REGRA OU ESPECIFICAÇÃO; implementação: RECONSTRUIR

**Valor de especificação:** perfil que só edita foto e senha (o resto vem do Banco da coordenação — separação de responsabilidade correta); "minhas aulas de hoje"/calendário derivados da grade; relatório de horas derivado (nada digitado à parte); quiz ao vivo por turma com máquina de estados criado→ativo→encerrado, sem gabarito para o aluno, sem premiação, relatório que começa em branco ("nada de % inventado"); bloqueio/desligamento derrubando a sessão com recado cordial.

**O que não migra:** e-mail derivado do sobrenome (colide em homônimos — DECISÃO TÉCNICA PENDENTE); senha demo `quad1234` impressa no gate; polling randômico do placar (o real é telemetria de sala via back-end em tempo real); extração de PDF simulada (banco demo — o parser real DEPENDE DE SISTEMA EXTERNO).

### 3.14 Persistência local e "modo offline" — RECONSTRUIR

O localStorage do protótipo guarda só 8 flags `vq_*`, das quais **4 são total ou parcialmente mortas** (`vq_pending` nunca escrita; `vq_last_sync` e `vq_tut_step`/`vq_tut_done` nunca lidas; `vq_tut_rew` jamais usada) e o reset da demo esquece `vq_intro_done` (inconsistência CONFIRMADA). O "modo offline" interno é um booleano sem alternador acessível na UI (`#connToggle` referenciado no JS não existe no HTML — o modo é inatingível). Nada disso é base para o offline real (fila de sincronização, autorização de dispositivo, cache) — que é projeto novo (DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END). As chaves mortas: DESCARTAR APÓS VALIDAÇÃO.

**Atualização (01/08/2026):** o descarte foi executado na Consolidação v1.0 — as chaves `vq_device_authorized`, `vq_last_sync`, `vq_pending`, `vq_tut_step`, `vq_tut_done` e `vq_tut_rew` foram removidas do fonte junto com o fluxo revogado de autorização de dispositivo, com regressão completa (56 suítes). **Restam vivas apenas `vq_tut_skip` e `vq_intro_done`.** O bug do reset (não limpa `vq_intro_done`) não foi corrigido — mudaria comportamento — e segue documentado. O veredito RECONSTRUIR para o offline real permanece.

**Atualização (03/08/2026, dec. 196):** entrou a chave **`vq_evolucao`** (persistência da evolução do aluno — DA-10), elevando as chaves vivas a **3**, e o **bug do reset foi corrigido** (o handler limpa as três). Isso **não altera o veredito**: continuar baseando continuidade de conta em flag de dispositivo segue sendo o antipadrão a **RECONSTRUIR** — a persistência real é por conta, no servidor (DA-07).

---

## 4. Lista consolidada — DESCARTAR APÓS VALIDAÇÃO

Itens de peso morto identificados pelas seis frentes (remover do protótipo/repositório depois de confirmação humana, idealmente numa única rodada de higiene com rebuild e re-teste):

*Atualização (01/08/2026): a rodada de higiene aconteceu na Consolidação v1.0, com regressão completa (56 suítes) — a coluna "Observação" registra, item a item, o que foi removido e o que permanece.*

| Item | Evidência | Observação |
|---|---|---|
| `Viver o Quad.rar` (9 MB, versionado) | git ls-files; nenhum doc referencia | HIPÓTESE: cópia antiga. Confirmar com o gestor antes de apagar. **REMOVIDO do repositório em 01/08** |
| `quad-coin.png` (904 KB, versionado) | build.py l.14 / build.ps1 l.13 usam só o .webp | Órfão de build. **REMOVIDO do repositório em 01/08** |
| Botão `[DEMO PROVISÓRIO — REMOVER]` de subir patente + `#btnDiaEstudo` (+275 pts) | l. 7740–7758, 7510 | Remoção prometida no CHANGELOG 20/07 e ainda pendente. **Permanece em 01/08** |
| Fluxo antigo de login por código (`CODE_OK='123456'`, `scenario`) e textos do aside que o descrevem | l. 3732–3734, 3645–3654 | Código morto + DIVERGÊNCIA DOCUMENTAL no próprio app. **Código REMOVIDO em 01/08** (com `currentEmail`, `pendingRunTour`, `deviceAuthorized`, `pendingAnswers` e o objeto `LS`); o texto do aside permanece |
| `#daniloPop` com vídeo sem handler que o abra; funções nunca referenciadas `fmtSync`, `openQuiz`, `tutDadosOk` | l. 3273–3287; 5580, 4644, 5724 | Vestigiais confirmados por busca de palavra inteira. **Funções REMOVIDAS em 01/08**; `#daniloPop` permanece |
| `LINKS_ONLINE` (objeto vazio, autodeclarado obsoleto) | l. 11866 | Código morto. **PRESERVADO deliberadamente em 01/08** como ponto de integração planejado — deixa de ser candidato a descarte |
| Chaves localStorage mortas (`vq_pending`, `vq_last_sync`, `vq_tut_rew`; leitura de `vq_tut_step`/`vq_tut_done`) | doc 06 §2 | Junto com correção do reset (`vq_intro_done`). **Chaves REMOVIDAS em 01/08** (também `vq_device_authorized`); a correção do reset segue pendente (mudaria comportamento) |
| View órfã `v-pretaf` (inalcançável pela UI) | l. 2062; grep sem `showView('v-pretaf')` | **Não é descarte automático:** religar ou remover é DECISÃO DE PRODUTO PENDENTE (a tela está pronta) |
| Texto interno "Danilo, o guia" e "Missões 10+10" em cards estáticos | l. 3637, 3633 | Corrigir, não descartar a tela |

---

## 5. Síntese honesta para o gestor

1. **O protótipo cumpriu o papel de protótipo — e isso é um elogio, não uma ressalva.** Ele provou a experiência, travou ~181 decisões, produziu identidade visual, mídias, textos e um caderno de regras demonstrável. Esse é o patrimônio.
2. **Nenhuma linha do JS do monólito deve virar fundação do sistema real.** Toda decisão de valor hoje é tomada no navegador, com gabaritos, senhas demo e hooks de manipulação embarcados no artefato público — correto para demo, impossível para produção. O caminho é: especificação (docs desta auditoria + registro de decisões + CHANGELOG) → arquitetura nova com back-end dono das regras → protótipo como oráculo de aceitação visual e comportamental.
3. **O que reaproveitar com a mão:** tokens de design, mídias, microcopy, roteiro do tutorial, árvore do CFO, parametrização GAMI, inventário de casos de teste dos hooks — cada um com a validação indicada na sua seção.
4. **O que decidir antes de construir:** rev. 2.4 do documento-base (economia, Diamante, corte do piloto), Pré-TAF, política de hooks/build duplo, recuperação das suítes Playwright. Reaproveitar especificação com pendência aberta é herdar a pendência — as tabelas acima marcam cada uma.
5. **Manter o protótipo vivo tem custo baixo e valor alto** — e o grosso desse custo **já foi pago em 01/08** (build refatorado e validado, higiene da seção 4 executada, docs de entrada reescritos); ele continua sendo a melhor ferramenta de alinhamento entre o gestor e qualquer time que venha a construir o produto real.
