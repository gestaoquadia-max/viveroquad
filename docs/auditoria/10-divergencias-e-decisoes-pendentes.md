# 10 — Divergências e decisões pendentes

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

---

## Atualização — Consolidação Arquitetural v1.0 (01/08/2026)

Em 01/08/2026 o gestor Danilo Moura determinou a **Consolidação Arquitetural v1.0** (documento oficial: `docs/arquitetura/00-arquitetura-oficial.md` — referência arquitetural única do projeto). Ela **respondeu parte das perguntas** deste documento e **superou premissas** de algumas seções. Nenhuma pergunta foi apagada: cada uma está marcada como **[RESPONDIDA — Consolidação v1.0]** (com a resposta e a data) ou **[ABERTA]** — na tabela consolidada da seção 9 e, quando relevante, no corpo. Em resumo, a Consolidação:

- **Respondeu:** a precedência documental (Q0 — `docs/arquitetura/` prevalece); os limites app × site × plataforma-base e a propriedade dos módulos (seção 7 — 11 capacidades viram **módulos internos** da plataforma); o destino da dec. 21 (Q9 — **revogada**: o cadastro passa a pertencer à arquitetura do app, como Módulo Planejado; o fluxo novo **não foi implementado** e o protótipo mantém o portão "Cadastro no site" como demonstração); a saída do `Viver o Quad.rar` (Q22 — removido em 01/08).
- **NÃO respondeu** (seguem abertas): todas as perguntas da **economia** (Q5, Q7, Q8, Q18 — loja, Quad Coins, Diamantes e gift cards permanecem previstos, mas as **regras econômicas seguem indefinidas**, não estudadas); mascote/nomenclatura (Q1, Q2); tutorial 29 passos × dec. 105 (Q3, Q4); renomear `score` (Q6); nota de promoção (Q10); Pré-TAF (Q11); palavrões (Q12); higiene pré-piloto restante (Q13); telemetria/log de eventos (Q14); IDs estáveis (Q15); graduação (Q16); risco de abandono (Q17); catálogo de integrações (Q19); registro de decisões (Q20). A reescrita de README/docs (Q21) foi **executada em 01/08** (docs de entrada reescritos contra a Consolidação; resta só a validação da URL pelo gestor).
- **Nota técnica:** o fonte agora vive em `src/` (20 partes; `src.html` não existe mais) — as referências "src.html l.N" abaixo valem para o monolito auditado em 30/07 (`src/README.md` explica a correspondência). Parte do código morto citado adiante foi removida em 01/08 com regressão verde (duplicata de `hojeISO`, fluxo de autorização de dispositivo, chaves mortas de localStorage, `openQuiz`/`fmtSync`/`tutDadosOk`); os riscos de segurança permanecem válidos e **registrados como pendências** — nenhuma solução foi implementada.

---

## Como ler este documento

Este é o consolidado de **tudo o que está em conflito, defasado ou sem dono** entre as quatro fontes do projeto: o relatório-base (docs/Viver-o-Quad-Relatorio-rev2-3.pdf, "rev. 2.3"), o registro de decisões (docs/02-registro-de-decisoes.md, decisões 1–181), a documentação de apoio (README.md, docs/00, 01, 03) e o **código** (src.html, 11.920 linhas — a fonte mais atual, acompanhada pelo CHANGELOG até 28/07).

Cada divergência traz: **fontes conflitantes → data das decisões → comportamento atual no código → impacto → pergunta objetiva numerada (Q1, Q2, …) → responsável sugerido** (Danilo Moura = produto; desenvolvedor = técnico). A tabela final (seção 9) reúne todas as perguntas para resposta rápida.

Rótulos usados (vocabulário obrigatório da auditoria): CONFIRMADO NO CÓDIGO · APENAS VISUAL · SIMULADO LOCALMENTE · DEPENDE DO FRONT-END REAL · DEPENDE DO BACK-END · DEPENDE DE BANCO DE DADOS · DEPENDE DE SISTEMA EXTERNO · HIPÓTESE · DECISÃO DE PRODUTO PENDENTE · DECISÃO TÉCNICA PENDENTE · DIVERGÊNCIA DOCUMENTAL.

**Regra de precedência observada na prática:** quando documento e código divergem, o código + CHANGELOG refletem a intenção mais recente do gestor (as rodadas de 19–28/07 não foram retropropagadas para README/00/01/03, e a rev. 2.3 nunca recebeu a revisão "2.4" prometida desde a decisão 11, de 14/07). Isso não estava formalizado em lugar nenhum na data da auditoria. *Atualização 01/08:* **Q0 foi respondida pela Consolidação v1.0** — `docs/arquitetura/00-arquitetura-oficial.md` é o documento arquitetural oficial e único, e prevalece sobre qualquer documento anterior em caso de conflito.

---

## 1. As sete divergências de maior impacto

### 1.1 Mascote: "Danilo" × "QUAD" — o vigente é QUAD

| Campo | Conteúdo |
|---|---|
| Fontes conflitantes | dec. 3 (14/07): "**Danilo** é o mascote-guia… nome homenageia o Fundador" × dec. 17 (19/07): "**Mascote renomeado para QUAD**". README ("Tour obrigatório do Danilo"), docs/00 ("sou o robô azul — seu xará!") e docs/03 ("Vídeo 3D do mascote") ainda dizem Danilo. |
| Comportamento atual | CONFIRMADO NO CÓDIGO: o tutorial abre com `'Oi! Eu sou o <b>QUAD</b>.'` (src.html ~5766); popup do guia exibe "QUAD — Mascote e guia da jornada" (~3278–3279); botões "Falar com o QUAD" (~3269) e "Entendi, QUAD" (~3284). **Porém** os ativos e identificadores seguem "danilo": `danilo.mp4`, `danilo-sprite.png`, tokens `__DANILO_VIDEO__`/`__DANILO_SPRITE__` (build.py:8–9), ids `daniloFab`/`daniloPop` etc.; e **sobrou um card estático dentro do próprio app** dizendo "Danilo, o guia — mascote vetorizado…" (~3637). |
| Impacto | Documentação de entrada ensina o nome errado; um resíduo "Danilo" ainda é exibível ao usuário final. |
| Rótulos | CONFIRMADO NO CÓDIGO (QUAD vigente) · DIVERGÊNCIA DOCUMENTAL (README/00/03 + linha ~3637) · DECISÃO TÉCNICA PENDENTE (renomear ids/assets). |

- **Q1 (Danilo Moura — produto):** Confirma que o mascote se chama **QUAD** em toda comunicação e que o nome "Danilo" não deve mais aparecer nem em texto interno do app (corrigir o card da linha ~3637)?
- **Q2 (desenvolvedor — técnico):** Renomear os assets/ids `danilo*` → `quad*` (custo técnico, sem efeito visual) — fazer agora ou aceitar o legado até o app real?

### 1.2 Tutorial: 9 passos × 19 etapas × 29 passos reais no código

| Campo | Conteúdo |
|---|---|
| Fontes conflitantes | dec. 7 (14/07): tour de **9 passos** (README e docs/00 ainda repetem "9 passos") × dec. 17 (19/07): tutorial obrigatório de **19 etapas** × CHANGELOG 19/07: roteiro reescrito em "28 beats", com beats posteriores de confirmação de nome de guerra e avatar. |
| Comportamento atual | CONFIRMADO NO CÓDIGO: o array `TUT` (src.html ~5764–5857) tem **29 passos top-level**. Nenhum dos números documentados (9 ou 19) corresponde à estrutura real. |
| Impacto | Qualquer roteiro de teste ou apresentação baseado em "9" ou "19" passos não bate com o app; o guia do gestor (docs/00) descreve uma demonstração que não existe mais. |
| Rótulos | CONFIRMADO NO CÓDIGO (29) · DIVERGÊNCIA DOCUMENTAL. |

- **Q3 (Danilo Moura — produto):** O roteiro oficial continua sendo o das 19 etapas de 19/07 apenas "contado" em beats menores — ou os beats extras (confirmação de avatar, confirmação do nome, pronome feminino) são adições de conteúdo que você quer validar formalmente?

### 1.3 Tutorial "abre em todo acesso" (dec. 105) × comportamento real

| Campo | Conteúdo |
|---|---|
| Fontes conflitantes | dec. 105 (26/07): "Instrução do QUAD abre **em todo acesso**, com botão Pular" — o comentário no código repete isso (~5648–5649). |
| Comportamento atual | CONFIRMADO NO CÓDIGO: o login só dispara o tutorial se `lsGet('vq_tut_skip') !== '1'` (~5650); **tanto concluir (`tutFim`, ~7010) quanto pular (`tutPular`, ~6989) gravam `vq_tut_skip='1'`**. Ou seja: a instrução abre em todo acesso **apenas até a primeira conclusão/pulo**; depois só reabre via "Refazer instrução" (central do QUAD) ou "Resetar demonstração" (limpa a chave em ~8643). |
| Impacto | O comportamento contradiz a decisão escrita e o próprio comentário do código. Pode ser intencional ("todo acesso" valeria só para quem nunca concluiu) ou regressão de intenção — impossível saber sem a palavra do gestor. |
| Rótulos | CONFIRMADO NO CÓDIGO (comportamento) · DIVERGÊNCIA DOCUMENTAL · DECISÃO DE PRODUTO PENDENTE. |

- **Q4 (Danilo Moura — produto; ajuste = desenvolvedor):** Depois que o aluno conclui/pula a instrução uma vez, ela deve voltar a abrir no próximo login (como diz a dec. 105) ou ficar guardada só na central do QUAD (como o app faz hoje)?

### 1.4 Score × Quad Coin — a separação conceitual existe, mas nem o documento-base nem o nome da variável acompanham

| Campo | Conteúdo |
|---|---|
| Fontes conflitantes | Rev. 2.3, Anexo A: "**Score não é moeda e não é gasto**"; Quadcoin nasce por **Marcos de Conquista** (nunca conversão linear); economia só na V1. × dec. 11 (14/07): pontuação de participação rebatizada "**Quad Coin**" na UI — a própria decisão registra "⚠️ diverge da rev. 2.3; o documento-base precisa de revisão". × CHANGELOG 18/07: "Três scores separados dos Quad Coins… score não é moeda e não promove sozinho". |
| Comportamento atual | CONFIRMADO NO CÓDIGO: o app **separa** as duas coisas — `carreira.scoreCarreira/scorePatente/scoreTemporada` (~3712–3714) é o score de participação (promove patente, alimenta ranking) e a moeda é exibida como "Quad Coins". **Mas a variável da moeda chama-se literalmente `var score = 1240; // Quad Coins (moeda da Loja — NÃO é o score de carreira)`** (~3672), com `addScore()` creditando moeda. Além disso, a **mecânica** diverge do Anexo A: QdC nasce por conversão direta de atividade (+5/bloco de flashcards, +2/acerto no simulado digital — dec. 125, +1/noite — dec. 26, garimpo +15, ~4518–4520) — **sem** Score Qualificado, **sem** Ciclo de Conquista, **sem** Marcos, **sem** ledger. |
| Impacto | (a) A rev. 2.4 prometida desde 14/07 nunca saiu — o documento canônico descreve outra economia; (b) `score` = moeda é armadilha para qualquer desenvolvedor futuro; (c) a economia demonstrada não segue o desenho econômico canônico. |
| Rótulos | CONFIRMADO NO CÓDIGO · DIVERGÊNCIA DOCUMENTAL (rev. 2.3 × protótipo) · DECISÃO DE PRODUTO PENDENTE (rev. 2.4) · DECISÃO TÉCNICA PENDENTE (renomear variável). |

- **Q5 (Danilo Moura — produto, com Vitor França/Gestor da Economia):** A rev. 2.4 do documento-base vai absorver o modelo do protótipo (Quad Coin ganho direto por atividade, sem Marcos/Score Qualificado) — ou o modelo do Anexo A continua sendo o alvo e o protótipo é só demonstração? Quem redige a rev. 2.4 e quando?
- **Q6 (desenvolvedor — técnico):** Renomear `var score` (moeda) → `qdc` e revisar `addScore()` (refactor seguro, alto valor de clareza) — aprovar execução?

### 1.5 Economia ativa na V0 × "Sem economia ativa" — a maior divergência de escopo

| Campo | Conteúdo |
|---|---|
| Fontes conflitantes | Rev. 2.3 (§6/§7/A.11): V0 **sem economia ativa**; Intendência e ralos só na V1-A; bens reais na V1-B; alto valor/receita na V1-C com crivo Financeiro + Jurídico. docs/01 repete "Sem economia ativa". × CHANGELOG 18/07: "Divergência da rev. 2.3 ampliada: a Intendência estava prevista só para a V1; **por decisão do gestor, o protótipo já apresenta a Loja na V0**". |
| Comportamento atual | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE: Quad Store completa (view v-loja) vendendo turmas, isoladas, simulados, eventos, excursões, módulos, TAF, cursos, mentoria, skins e itens de combate; **duas moedas**; gift cards em lote com QR; estorno em 7 dias com regra de consumo (dec. 178); crédito manual; editor de preços; relatórios de vendas. Tudo em memória/DOM — nenhuma transação real. |
| Impacto | O protótipo demonstra na V0 exatamente o que o documento-base fasea em V1-A/B/C — inclusive o degrau mais sensível (dinheiro real → Diamante; vaga de turma como ralo), que o Anexo A condiciona a crivo Financeiro + N.G.E./Jurídico. **Se o piloto de 30 dias rodar com tudo ligado, a métrica-mãe (retorno espontâneo) nasce contaminada pela economia — exatamente o que a rev. 2.3 §6 proíbe.** |
| Rótulos | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DIVERGÊNCIA DOCUMENTAL · DECISÃO DE PRODUTO PENDENTE · DEPENDE DE SISTEMA EXTERNO (checkout/Pagar.me) · DEPENDE DO BACK-END (ledger auditável do Anexo A não existe). |

- **Q7 (Danilo Moura — produto, com Vitor França e N.G.E.):** No piloto de 30 dias com alunos reais, a Quad Store estará **ligada** (compras de verdade com QdC/Dmn), **em modo vitrine** (visível, sem comprar) ou **desligada**, como manda a rev. 2.3? O crivo Financeiro + Jurídico dos ralos de valor real (vaga de turma, Diamante) já foi acionado?

### 1.6 Diamante — moeda em dinheiro real que não existe em nenhum documento-base

| Campo | Conteúdo |
|---|---|
| Fontes conflitantes | dec. 48 (24/07) cria o **Diamante** (comprado em dinheiro; recarga no site ou gift card de liberação única; nunca conquistado em missão). × A rev. 2.3 **não prevê segunda moeda** — só admite "complemento em Real" na V1-C (A.11) e proíbe apresentar Quadcoin como conversível. |
| Comportamento atual | CONFIRMADO NO CÓDIGO: `var diamantes = 150` (~3771); produtos com preço nas duas moedas e pop-up "Creditar em"; mensagem "Diamantes insuficientes — recarregue no site do Quad ou resgate um gift card" (~8664); crédito do checkout marcado `[INTEGRAÇÃO REAL]`. |
| Impacto | Camada econômica nova (dinheiro → moeda interna) sem cobertura no documento canônico, com implicações jurídicas/financeiras que o próprio Anexo A manda submeter a crivo. |
| Rótulos | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DIVERGÊNCIA DOCUMENTAL · DECISÃO DE PRODUTO PENDENTE · DEPENDE DE SISTEMA EXTERNO. |

- **Q8 (Danilo Moura — produto, com Gestor da Economia):** O Diamante entra na rev. 2.4 como camada oficial da economia? Quem é o dono do portão dele (mesma governança do Quadcoin — CEO Vitor França, conforme rev. 2.3 §17/A.8)?

### 1.7 Cadastro no aplicativo × cadastro no site — **[RESPONDIDA — Consolidação v1.0, 01/08/2026]**

> **Atualização 01/08:** a **dec. 21 foi REVOGADA** pela Consolidação Arquitetural v1.0. O cadastro **passa a pertencer à arquitetura do app** (módulo interno de cadastro — "Módulo Planejado", ainda sem especificação). O fluxo novo **NÃO foi implementado**: o protótipo continua exibindo o portão "Cadastro no site do Quad" como demonstração, até a especificação do módulo. A divergência documental abaixo (README/docs/00/docs/01 descrevendo o modelo pré-dec. 21) permanece registrada como histórico — a reescrita dos docs (Q21) foi **executada em 01/08**, refletindo a Consolidação (docs/01 registra a revogação da dec. 21).

| Campo | Conteúdo |
|---|---|
| Fontes conflitantes | dec. 5 e 6 (14/07): portão "Já sou aluno / Minha primeira vez" + cadastro no app com preenchimento automático a partir do banco. × dec. 21 (20/07): "**Cadastro no site (checkout), não no app**: o app só faz login; removidos código por e-mail, ativação, cadastro interno e autorização de dispositivo". README, docs/00 (roteiro de demonstração "Escolha 'Minha primeira vez' → digite um e-mail…") e docs/01 ("cadastro do app usa preenchimento automático") **ainda descrevem o modelo antigo**. |
| Comportamento atual | CONFIRMADO NO CÓDIGO: login e-mail+senha em `acessarPortal()` (~5629–5654); "Criar conta" leva a tela informativa + toast "Redirecionando para o cadastro no site… (demo)" com `[INTEGRAÇÃO REAL]` (~5660–5667). O roteiro de demonstração do docs/00 **não funciona mais** — guia o gestor para telas que não existem. |
| Impacto | O documento "comece aqui" (porta de entrada do gestor) e a visão-e-escopo ensinam um fluxo removido há 10 dias de trabalho. |
| Rótulos | CONFIRMADO NO CÓDIGO · DIVERGÊNCIA DOCUMENTAL (README/00/01) · DEPENDE DE SISTEMA EXTERNO (checkout real). |

- **Q9 [RESPONDIDA — Consolidação v1.0, 01/08/2026]:** **Não** — a dec. 21 foi **revogada**. A conta passa a nascer no próprio app (módulo interno de cadastro, Módulo Planejado); README/docs/00/docs/01 **foram reescritos contra a Consolidação em 01/08** (Q21). O protótipo segue com o portão "Cadastro no site" apenas como demonstração até o módulo ser especificado.

---

## 2. Decisões antigas substituídas ou revogadas (linha do tempo)

Consolidação verificada no docs/02-registro-de-decisoes.md. **Ao citar decisões, use sempre a mais recente da cadeia.** Rótulo geral: DIVERGÊNCIA DOCUMENTAL apenas quando algum documento ainda cita a versão antiga (marcado ✱).

| Decisão antiga | Substituída/alterada por | O que mudou |
|---|---|---|
| 3 (mascote Danilo) + 7 (tour de 9 passos) ✱ | **17** (19/07) | Mascote → QUAD; tutorial obrigatório substitui o tour (README/00/03 ainda citam as antigas) |
| 5 (portão de entrada) + 6 (cadastro no app) ✱ | **21** (20/07) → **21 REVOGADA pela Consolidação v1.0 (01/08)** | Cadastro passou ao site em 20/07; em 01/08 a Consolidação devolveu o cadastro à arquitetura do app (Módulo Planejado — fluxo novo não implementado; README/00/01 foram reescritos em 01/08 refletindo a revogação) |
| 9 (parte: avatar escolhido no Perfil) | **24** | Personagem definitivo escolhido no onboarding; entra a mochila de combate |
| 32 (passo da boina aponta o card) | **41** | Tutorial aponta a boina diretamente |
| 42/43/45 (simulados em fluxos separados) | **47** → **117b/122/123** → **165** (28/07) | Presencial nunca gratuito e nunca premia QdC; digital sem vagas, pode ser gratuito e premia por acerto; bloco de Simulados sai de Missões para o Calendário |
| 29 (Loja em 4 categorias) | **49** (2 macro-blocos; sai "Intendência") → **59** (nome Quad Store) | Reorganizações sucessivas da loja |
| 63 (lista fixa de professores) | **68** (Banco de professores) → **85** | — |
| 83 (e-mail validado contra professor escolhido) | **85** (25/07) — substituição explícita | Login do professor = e-mail + senha, sem seletor |
| 53 (parte: formulário de turma na Estrutura) | **79** → **141** | "Turmas abertas" lista tudo, com Editar/✕ |
| 60/69 ("vagas totais + dessas em QdC") | **155** (28/07) | Vagas **por moeda** (Dmn + QdC; total = soma) |
| 99 (item de combate sai da vitrine) | **172** (28/07) — revoga | Combate é recompra livre, "N na mochila"; estoque (dec. 170) fica só nos físicos |
| 101 (bloqueio por choque de agenda) | **104/107** | "EM CHOQUE" avisa sem impedir; matrícula segue barrada |
| 54 (parte: produtos digitais pré-configurados) | **118** + **108** | Cadastro próprio de digitais |
| 131 (Estúdio reservado automaticamente) | **136** (27/07) — revogação explícita | Estúdio passa a ser selecionado manualmente |
| 150 (evento com turma-alvo) | **161** (28/07) — revogação explícita | Eventos voltam a ser do Quad, genéricos |
| 67 (estorno em 7 dias) | **178** (28/07) — complementa | Consumo (portaria/entrega/liberação) mata o estorno |
| 20/66 (leitor de QR e loja no botão "+") | **111/112** (26/07) | Quad Store e "Validar pelo QR" saem do "+" |
| 7/17 (tutorial só no 1º acesso) | **105** (26/07) | "Em todo acesso" com Pular — ver conflito com o código na seção 1.3 |
| 129-1ª (salas da sede) | **130/134/135** → **179** (28/07) | Reserva unificada de salas; lotação fixa por sala (155/85/125/185) |
| 46 (Estrutura com GCM/PF genéricos) | **140** | Concursos derivados da Estrutura |
| 62 (matrícula-mestre) | **148/146/152/153/154/156/157/160/177** | Evolução encadeada até o conceito de **turma ativa** trocável sem deslogar |

---

## 3. Decisões registradas que o código não acompanha

| # | Decisão | Estado real no código | Rótulos |
|---|---|---|---|
| 3.1 | dec. 105 — instrução em todo acesso | Contradita após a 1ª conclusão/pulo (seção 1.3, Q4) | DIVERGÊNCIA DOCUMENTAL · DECISÃO DE PRODUTO PENDENTE |
| 3.2 | CHANGELOG 18/07 — "aprovação pela nota mínima da fase" (70/75/80/85%) | `GAMI.fases[].notaMin` existe (~3687–3703), mas a prova de promoção usa `PROVA_APROV = 0.80` **fixo** (~7521, ~7585) — a nota por fase não é aplicada | CONFIRMADO NO CÓDIGO · DIVERGÊNCIA DOCUMENTAL · DECISÃO TÉCNICA PENDENTE |
| 3.3 | dec. 163 — cronograma chaveado pelo **id** da turma | Código correto (`cronoKey(t) => t.id`, ~4781), mas o comentário em `definirTurmaAtiva()` (~3873–3874) ainda diz "a chave continua sendo tipo + turno" — comentário × código, sem efeito funcional | DIVERGÊNCIA DOCUMENTAL (leve) |
| 3.4 | dec. 52/54/65/92 e 55 — Chat ao vivo, Quests, feedback dos alunos, resposta do professor, abas de Relatórios | Implementados como "EM BREVE"/placeholder (coerente com o registro: são V1) — ~3313–3316, ~2855, ~2297, ~2231, ~2954–3009 | APENAS VISUAL |
| 3.5 | Rev. 2.3 §13 — IRA (fast-follow) | Inexistente no protótipo (nenhuma ocorrência funcional) — correto para V0, registrado por completude | DEPENDE DO BACK-END |

- **Q10 (Danilo Moura decide a regra; desenvolvedor implementa):** A aprovação na prova de promoção deve usar a **nota mínima da fase** (70/75/80/85%, como o CHANGELOG 18/07 descreve) ou o valor fixo de 80% que o código aplica hoje?

## 4. Comportamentos no código SEM decisão registrada

| # | Item | Evidência | Rótulos |
|---|---|---|---|
| 4.1 | Botão **`[DEMO PROVISÓRIO — REMOVER]`** "Passar prova pelo gabarito (demo) · sobe 1 patente" ainda ativo — marcado para remoção desde 20/07 | ~1997–1998, ~7740 | CONFIRMADO NO CÓDIGO · DECISÃO TÉCNICA PENDENTE (remover antes de qualquer piloto) |
| 4.2 | **Filtro de palavrões** no nome de guerra (`TUT_PALAVROES`, 7 termos) — sem decisão, sem lista oficial | ~5699, ~5736 | CONFIRMADO NO CÓDIGO · DECISÃO DE PRODUTO PENDENTE |
| 4.3 | **Gate do admin aceita qualquer e-mail** com "@" — só a chave `NPP-2026` valida (~9787–9795); não há validação de e-mail específico (o `npp@quadconcursos.com.br` é só placeholder, ~3369) | ~9787–9795 | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END (RBAC real) |
| 4.4 | **Login do aluno aceita qualquer e-mail+senha** (valida só formato; `[INTEGRAÇÃO REAL] validar no servidor`) | ~5633–5638 | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END |
| 4.5 | **View `v-pretaf` órfã**: a tela existe (~2062) mas nenhum `showView`/`data-goto` chega nela — o "+" mostra "Pré-TAF (EM BREVE)" bloqueado (~3290–3327), enquanto o README a vende como ativa | ~2062 + grep sem chamadas | CONFIRMADO NO CÓDIGO · DIVERGÊNCIA DOCUMENTAL · DECISÃO DE PRODUTO PENDENTE |
| 4.6 | **31 hooks de teste `window.__*`** (`__admTudo`, `__eventos`, `__turmaAtiva`, `__evLotar`, `__dominio`, `__introFeita`, `__mat.encerrar`…) expostos no build publicado | ex.: ~5761–5763, ~8576, ~7856, ~3905–3908 | CONFIRMADO NO CÓDIGO · DECISÃO TÉCNICA PENDENTE (política de hooks em produção) |
| 4.7 | **Suítes Playwright citadas em todo o CHANGELOG não estão versionadas** (nenhum arquivo de teste no repo — `git ls-files`) | CHANGELOG (`vtut`, `vfasea`–`vfaseh`, `vdmn`…) | DECISÃO TÉCNICA PENDENTE (versionar) |
| 4.8 | **Chaves localStorage reais** (na auditoria): `vq_device_authorized`, `vq_last_sync`, `vq_pending`, `vq_tut_step`, `vq_tut_done`, `vq_tut_rew`, `vq_tut_skip`, `vq_intro_done`. *Atualização 01/08:* as 6 primeiras foram **removidas** com regressão verde (fluxo revogado de dispositivo + chaves de tutorial nunca lidas); vivas hoje: só `vq_tut_skip` e `vq_intro_done` | ~3736–3741, ~5697, ~6882 (monolito 30/07) | CONFIRMADO NO CÓDIGO · resolvido em 01/08 |
| 4.9 | **Telemetria decorativa**: a métrica-mãe (retorno espontâneo/`OPEN_ORGANIC`) é linha de texto estática (~1813–1814, ~5644) — a rev. 2.3 §8 diz que taxonomia de origem + linha de base são **pré-requisitos da V0** ("a V0 não começa sem…") | ~1813–1814, ~4710, ~5644 | APENAS VISUAL · DEPENDE DO BACK-END · DEPENDE DE BANCO DE DADOS |

- **Q11 (Danilo Moura — produto):** O Pré-TAF volta a ser acessível na V0 (a tela `v-pretaf` já existe pronta e órfã) ou fica para a V1 (e a tela morta é removida)?
- **Q12 (Danilo Moura — produto):** Qual é a lista oficial de termos vetados e a regra de moderação do nome de guerra (hoje: 7 termos improvisados no código)?
- **Q13 [ABERTA — parcialmente executada em 01/08] (desenvolvedor — técnico; Danilo ciente):** Antes de qualquer piloto: remover o botão [DEMO PROVISÓRIO], definir a política dos hooks `window.__*` (strip no build de produção?) e versionar as suítes Playwright — aprovar este pacote de higiene? *(A limpeza de código morto sem efeito de comportamento — `openQuiz`, `fmtSync`, `tutDadosOk`, duplicata de `hojeISO`, fluxo de dispositivo, chaves mortas — já foi feita em 01/08 com regressão verde; os três itens acima continuam pendentes.)*
- **Q14 (Danilo Moura + desenvolvedor):** Quem constrói o log real de eventos/origem de sessão (pré-requisito declarado da V0) e ele fica pronto **antes** do piloto de 30 dias?

## 5. Regras ambíguas e nomenclatura divergente

| # | Conceito | Divergência | Rótulos |
|---|---|---|---|
| 5.1 | `score` (variável) × Score (conceito) | A variável `score` guarda **Quad Coins**; o score de carreira mora em `carreira.score*` (seção 1.4, Q6) | DECISÃO TÉCNICA PENDENTE |
| 5.2 | "Intendência" | Termo da rev. 2.3 para a área de gasto (V1); removido da UI pela dec. 49 — hoje é "**Quad Store**" (dec. 59). A rev. 2.3 segue usando Intendência | DIVERGÊNCIA DOCUMENTAL (aguarda rev. 2.4) |
| 5.3 | "Missões 10+10" | Modelo antigo; o vigente é flashcards em blocos por turno. O texto "Missões 10+10" sobrevive no README **e num card estático interno do app** (~3633) | DIVERGÊNCIA DOCUMENTAL · CONFIRMADO NO CÓDIGO (resíduo) |
| 5.4 | "Danilo, o guia" | Resíduo interno do app (~3637) — seção 1.1 | DIVERGÊNCIA DOCUMENTAL |
| 5.5 | E-mail do professor derivado do sobrenome (`emailDoProf`, ~4917–4925) | Colide para sobrenomes iguais; e o **nome é a chave** do cadastro (renomear propaga e troca o login — dec. 174/175, ~8178–8206) | CONFIRMADO NO CÓDIGO · DECISÃO TÉCNICA PENDENTE (ID estável no sistema real) |
| 5.6 | Lotação de salas (`SALA_CAP`, 155/85/125/185 — dec. 179) | Hard-coded no protótipo; no sistema real deve ser cadastro configurável | CONFIRMADO NO CÓDIGO · DECISÃO TÉCNICA PENDENTE (onde vive o cadastro de salas) |
| 5.7 | Alteração de graduação do aluno | "Gestor definirá" (CHANGELOG 18/07, Perfil do aluno) — nunca definido | DECISÃO DE PRODUTO PENDENTE |
| 5.8 | Risco de abandono / intervenção | Previsão da rev. 2.3; nenhuma função de risco existe (grep só encontra textos) | APENAS VISUAL · HIPÓTESE (modelo) · DECISÃO DE PRODUTO PENDENTE (o que dispara intervenção e quem age) |

- **Q15 (desenvolvedor — técnico):** No sistema real, professor (e demais entidades) usam **ID estável** como chave (nunca nome), e o e-mail funcional deixa de ser derivado do sobrenome — confirmar como requisito de arquitetura?
- **Q16 (Danilo Moura — produto):** Quais são as regras de alteração da graduação do aluno (pendência aberta desde 18/07)?
- **Q17 (Danilo Moura — produto):** Para o risco de abandono previsto na rev. 2.3: o que dispara uma intervenção e quem age (mentor? N.P.P.? automático)?

## 6. Itens de V0, V1 e V2 misturados no protótipo

Contra rev. 2.3 §7/§9/§16. O protótipo é, hoje, uma demonstração de **V0 + V1 (+ fatias de V2)**:

| Camada prevista | O que o protótipo demonstra | Rótulos |
|---|---|---|
| **V0 legítimo** | Login, identidade fixa (nome de guerra/avatar), missões/flashcards, quiz da aula sem gabarito (~5470/5547), garimpo, admin de edital+questões, professor com polling | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE |
| **V0 exigido e AUSENTE de verdade** | Log de eventos, origem da sessão, linha de base comportamental (só texto — item 4.9) | APENAS VISUAL · DEPENDE DO BACK-END |
| **V1 antecipado** | Economia completa (Quad Store, QdC), **Diamante/dinheiro real (V1-C!)**, gift cards com leitor de câmera (~3499–3508, câmera simulada — DEPENDE DO FRONT-END REAL), estorno, crédito manual, relatórios com gráficos, **painel de domínio completo** (árvore CFO 13 matérias · 100 assuntos · 427 sub-assuntos, progresso por hash), **patente dinâmica + prova de promoção** (a rev. 2.3 §7/§18 diz patente **fixa** na V0) | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DIVERGÊNCIA DOCUMENTAL |
| **V2 antecipado (parcial)** | Mensageria admin→aluno/professor por públicos (dec. 52/181 — mão única real); perfil público/privado nos rankings (dec. 132/143). Chat ao vivo e Guarnições/GvG/PvP corretamente travados como EM BREVE/V2 (~3313–3322) | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE / APENAS VISUAL |

- **Q18 (Danilo Moura — produto):** Qual é o **corte oficial do piloto de 30 dias** — a lista explícita do que fica ligado, do que vira vitrine e do que é desligado dentre as funcionalidades V1/V2 já demonstradas (economia, Diamante, domínio completo, patente dinâmica, mensageria)? (Complementa Q7.)

## 7. Limites entre aplicativo, site e plataforma-base — **[RESPONDIDA — Consolidação v1.0, 01/08/2026]**

> **Atualização 01/08:** a Consolidação Arquitetural v1.0 **respondeu a pergunta de fundo desta seção** (quem é dono de quê). O Viver o Quad passa a ser **a plataforma principal do Quad Concursos**; deixam de ser sistemas externos e viram **módulos internos**: cadastro, autenticação, matrículas, produção de materiais, banco de questões, simulados, inteligência pedagógica, loja, administração, relatórios e cronogramas (módulo sem especificação = "Módulo Planejado"). Permanecem **fora** (integrações a definir): site e checkout (vitrine/venda), pagamentos/financeiro, plataforma de cursos (legado em avaliação), notificações push/e-mail (canal) e telemetria como serviço de dados (a decidir). A mudança é exclusivamente arquitetural — nada foi implementado; a tabela abaixo permanece como retrato do protótipo e da premissa antiga (rev. 2.3 §14 + dec. 21, ambas superadas). Referência: `docs/arquitetura/`.

Estado na auditoria de 30/07 (rev. 2.3 §14 + dec. 21 + código):

| Responsabilidade | Onde está hoje (protótipo) | Sistema real previsto | Rótulos |
|---|---|---|---|
| Criação de conta + matrícula | Toast "Redirecionando para o cadastro no site… (demo)" (~5660–5667) | Site principal + checkout + cadastro geral | DEPENDE DE SISTEMA EXTERNO |
| Validação de credenciais | Aceita qualquer e-mail+senha (~5633–5638) | Autenticação/autorização central | DEPENDE DO BACK-END |
| Dados do aluno (nome, turma) | `DB_ALUNO` local; tutorial "confirma" com opção "Corrigir no site" (~5793–5801) | Plataforma-base (fonte da verdade) | SIMULADO LOCALMENTE · DEPENDE DE BANCO DE DADOS |
| Recarga de Diamantes | Mensagem manda ao "site do Quad" (~8664); crédito `[INTEGRAÇÃO REAL]` | Checkout/Pagar.me + financeiro | DEPENDE DE SISTEMA EXTERNO |
| Estorno financeiro real | Devolução imediata da moeda local (~11684–11695) | Gateway de pagamento + financeiro | DEPENDE DE SISTEMA EXTERNO |
| Pontos `[INTEGRAÇÃO REAL]` no código | **24 ocorrências** (extração de PDF de edital/quiz, gift card real, presença por chamada, chave do admin por pessoa etc.) | Cada um exige contrato de integração | DEPENDE DO BACK-END / DE SISTEMA EXTERNO |

**Nenhum contrato de integração (API, payloads, donos) existe** — e isso segue verdadeiro após a Consolidação: ela definiu a **propriedade** (módulo interno × sistema externo), mas não especificou módulos nem contratos.

- **Q19 [ABERTA — reescopada em 01/08] (desenvolvedor — técnico; Danilo prioriza):** Transformar as 24 marcas `[INTEGRAÇÃO REAL]` num catálogo técnico — agora separando **fronteiras internas** (pontos que viram módulos da plataforma) de **contratos de integração externa** (site/checkout, pagamentos, plataforma de cursos legada, notificações, telemetria) — aprovar e priorizar?

## 8. Integridade do registro de decisões e da documentação de apoio

### 8.1 docs/02-registro-de-decisoes.md (verificado por script)

- 189 linhas de decisão, números 1–181, **nenhum número ausente**; 2 decisões sem número ("—", pacotes de faseamento de 24/07).
- **4 números duplicados: 126, 127, 128 e 129 aparecem duas vezes** (linhas ~122–125 e ~178–181 do arquivo). 126/127 são repetição do mesmo conteúdo; **128/129 são COLISÃO REAL** (o nº 128 designa "presença no simulado gera score" numa ocorrência e "lançamento de simulados usa a grade Preços e vagas" na outra; idem 129). Citar "decisão 128/129" hoje é ambíguo.
- **Ordem não cronológica no fim do arquivo** (após a 161 vêm 170–181, depois 162–169, depois as repetidas 126–129, depois um bloco decrescente 105→46), contrariando o cabeçalho "por ordem".
- Rótulos: DIVERGÊNCIA DOCUMENTAL · DECISÃO TÉCNICA PENDENTE.

### 8.2 README.md, docs/00 e docs/03 (defasados em ~18/07) — **[RESOLVIDA em 01/08/2026]**

> **Atualização 01/08:** os quatro docs de entrada (README, docs/00, docs/01 e docs/03) foram **reescritos em 01/08** contra a Consolidação v1.0 — com a URL vigente `945e81a8-…` (agora registrada em README, docs/00, docs/02 e docs/03), `build.py` documentado, tamanhos reais, árvore com `src/` e roteiro atual. A tabela abaixo permanece como **registro histórico** da defasagem encontrada em 30/07.

| Item defasado | Real verificado (30/07) |
|---|---|
| URL do artefato `…/4d06ad26-…` nos 3 documentos | URL vigente informada: `945e81a8-9ca3-4d55-9169-c4fc9f6f3703` — **HIPÓTESE** (nenhum arquivo do repo registra a URL nova; validar com o gestor) |
| Só `build.ps1` citado | Existe `build.py` (raiz, mesmos 10 tokens — build.py:6–27), não citado em nenhum doc |
| Guia 03: src.html "~70 KB", 3 tokens, index "~4 MB" | Real: **764 KB**, **10 tokens + `__FOTOS_VARIANTES__`** (7 variantes × 12 fotos), **~9,4 MB** |
| Árvore de arquivos do README (8 itens) | Omite `build.py`, `fonts.css`, `danilo-sprite.png`, `simbolo-quad-transparente.png`, `insignias.jpg`, `diamante.webp`, `quad-coin.png/webp`, `fotos/` (84 webp) e `Viver o Quad.rar` |
| `.gitignore` ignora `index.html` **e `artifact.html`** | README só documenta index.html |
| Roteiro de demonstração do docs/00 | Não funciona mais (seção 1.7) |
| Paleta do README (`#1B7FC4`/`#EAF3FB`) | CHANGELOG 18/07 registra a paleta da spec (`#0878F8`, `#EAF5FF`, `#062B64`…) — HIPÓTESE quanto aos valores vigentes exatos; DIVERGÊNCIA DOCUMENTAL provável |

### 8.3 "Viver o Quad.rar" (9,4 MB) na raiz — **[RESPONDIDA — Consolidação v1.0, 01/08/2026: REMOVIDO]**

Na auditoria: versionado no Git, **nenhum documento o referenciava** (grep = zero), conteúdo não inspecionado — HIPÓTESE: cópia antiga do projeto; dobrava o peso do clone. *Atualização 01/08:* o `.rar` (e também o `quad-coin.png` órfão) foi **removido do repositório** nos commits da Consolidação.

- **Q20 (desenvolvedor — técnico):** Resolver as duplicatas 126–129 (ex.: renumerar as segundas ocorrências como **189 em diante** — os números 182–188 já foram consumidos pelas decisões da Consolidação em 01/08 — ou migrar para IDs imutáveis com data) e restaurar a ordenação do registro? Qual convenção?
- **Q21 [EXECUTADA em 01/08] (Danilo valida a URL):** ~~Reescrever README, docs/00 e docs/03~~ — **feito em 01/08**: os docs de entrada (com docs/01) foram reescritos contra a Consolidação (URL do artefato, build.py, árvore com `src/`, tamanhos, roteiro, mascote QUAD); resta a validação formal da URL pelo gestor.
- **Q22 [RESPONDIDA — Consolidação v1.0, 01/08/2026]:** **Sim — executado.** O "Viver o Quad.rar" e o `quad-coin.png` órfão saíram do repositório nos commits de 01/08.

---

## 9. Tabela consolidada de perguntas

**Status atualizado em 01/08/2026** após a Consolidação Arquitetural v1.0: **[RESPONDIDA — Consolidação v1.0]** = a Consolidação deu a resposta (registrada na coluna Status); **[ABERTA]** = segue pendente. Nenhuma pergunta foi apagada.

| Nº | Pergunta (resumo) | Tipo | Responsável sugerido | Status (01/08/2026) |
|---|---|---|---|---|
| Q0 | Formalizar a regra de precedência: em conflito, vale código+CHANGELOG até a rev. 2.4 sair? | Governança | Danilo Moura | **[RESPONDIDA — Consolidação v1.0]** `docs/arquitetura/00-arquitetura-oficial.md` é o documento arquitetural oficial e único; em conflito com qualquer documento anterior (decisões, auditoria, rev. 2.3), a Consolidação prevalece |
| Q1 | Mascote = QUAD em tudo; remover resíduo "Danilo, o guia" (~3637)? | Produto | Danilo Moura | **[ABERTA]** — a Consolidação não tratou de mascote/nomenclatura |
| Q2 | Renomear assets/ids `danilo*` → `quad*` agora ou depois? | Técnica | Desenvolvedor | **[ABERTA]** |
| Q3 | Os 29 beats atuais são o roteiro oficial do tutorial? | Produto | Danilo Moura | **[ABERTA]** |
| Q4 | Tutorial reabre a cada login (dec. 105) ou só via central do QUAD (código atual)? | Produto | Danilo Moura | **[ABERTA]** |
| Q5 | Rev. 2.4: absorve o modelo QdC do protótipo ou o Anexo A continua sendo o alvo? Quem redige, quando? | Produto | Danilo Moura + Vitor França | **[ABERTA]** — a Consolidação manteve loja/QdC/Diamantes/gift cards previstos, mas registrou que as **regras econômicas seguem indefinidas** (não estudadas) |
| Q6 | Renomear `var score` (moeda) → `qdc`? | Técnica | Desenvolvedor | **[ABERTA]** — não incluído na limpeza de 01/08 |
| Q7 | Piloto de 30 dias: Quad Store ligada, vitrine ou desligada? Crivo Financeiro/Jurídico acionado? | Produto | Danilo Moura + Vitor França/N.G.E. | **[ABERTA]** |
| Q8 | Diamante entra na rev. 2.4? Quem é o dono do portão? | Produto | Danilo Moura + Gestor da Economia | **[ABERTA]** — economia indefinida |
| Q9 | Confirmar dec. 21 (cadastro no site) como definitiva para reescrever README/00/01? | Produto→Técnica | Danilo Moura confirma; desenvolvedor executa | **[RESPONDIDA — Consolidação v1.0]** **Não: dec. 21 REVOGADA** — cadastro passa à arquitetura do app (Módulo Planejado); fluxo novo não implementado; protótipo mantém o portão do site como demonstração |
| Q10 | Prova de promoção: nota mínima por fase (70–85%) ou 80% fixo? | Produto→Técnica | Danilo Moura decide; desenvolvedor implementa | **[ABERTA]** |
| Q11 | Pré-TAF: religa na V0 (tela pronta e órfã) ou fica V1? | Produto | Danilo Moura | **[ABERTA]** — `v-pretaf` foi mantida na limpeza de 01/08 justamente por depender desta decisão |
| Q12 | Lista oficial de palavrões/moderação do nome de guerra? | Produto | Danilo Moura | **[ABERTA]** |
| Q13 | Pacote de higiene pré-piloto: remover [DEMO PROVISÓRIO], política dos hooks `__*`, versionar Playwright? | Técnica | Desenvolvedor | **[ABERTA]** — parcial: código morto sem efeito de comportamento removido em 01/08; os três itens citados seguem pendentes |
| Q14 | Log real de eventos/origem de sessão (pré-requisito da V0) pronto antes do piloto — quem faz? | Produto+Técnica | Danilo Moura + desenvolvedor | **[ABERTA]** — a Consolidação deixou a telemetria como serviço de dados **a decidir** |
| Q15 | ID estável como chave (professor etc.) e e-mail não derivado do sobrenome no sistema real? | Técnica | Desenvolvedor | **[ABERTA]** — a especificar nos módulos internos (autenticação/administração) |
| Q16 | Regras de alteração da graduação do aluno? | Produto | Danilo Moura | **[ABERTA]** |
| Q17 | Risco de abandono: o que dispara intervenção e quem age? | Produto | Danilo Moura | **[ABERTA]** — vira pauta do módulo de inteligência pedagógica (Módulo Planejado) |
| Q18 | Corte oficial do piloto: lista do que fica ligado/vitrine/desligado (V1/V2 demonstrados)? | Produto | Danilo Moura | **[ABERTA]** |
| Q19 | Catálogo de contratos das 24 marcas `[INTEGRAÇÃO REAL]` como 1º artefato técnico? | Técnica | Desenvolvedor (Danilo prioriza) | **[ABERTA]** — reescopada: separar fronteiras de módulos internos × integrações externas (seção 7) |
| Q20 | Registro de decisões: renumerar duplicatas 126–129 e reordenar, ou IDs imutáveis? | Técnica | Desenvolvedor | **[ABERTA]** |
| Q21 | Reescrever README/docs/00/docs/03 (inclui URL do artefato)? | Técnica | Desenvolvedor (Danilo valida URL) | **[EXECUTADA em 01/08]** — README, docs/00, docs/01 e docs/03 reescritos contra a Consolidação (URL vigente registrada no repo, `src/`, builds, árvore, roteiro); resta só a validação da URL pelo gestor |
| Q22 | "Viver o Quad.rar" sai do repositório? | Produto→Técnica | Danilo Moura autoriza; desenvolvedor executa | **[RESPONDIDA — Consolidação v1.0]** Sim — **executado em 01/08** (junto com o `quad-coin.png` órfão) |

---

## 10. Observação final

Nenhuma das divergências acima é defeito do protótipo em si — a maioria nasceu da velocidade das rodadas de 19–28/07, que evoluíram o código (e o CHANGELOG e o registro de decisões) sem retropropagar para o relatório-base e para os documentos de entrada. A **Consolidação Arquitetural v1.0 (01/08/2026)** resolveu a governança documental (Q0), os limites de propriedade app × site × plataforma-base (seção 7), o destino da dec. 21 (Q9) e a higiene do repositório (Q22 e parte de Q13). A reescrita dos docs de entrada (Q21) foi executada em 01/08. Das que restam, as respostas a **Q5/Q7/Q8/Q18 (economia — regras seguem indefinidas por decisão explícita da Consolidação: registrar, não inventar)** resolvem a maior parte da lista.
