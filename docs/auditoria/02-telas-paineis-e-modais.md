# 02 · Telas, Painéis e Modais — Catálogo Completo do Protótipo "Viver o Quad"

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

---

## 1. Como ler este catálogo

Este é o inventário de **todas as telas (views), painéis e modais/overlays relevantes** do protótipo, organizado por persona (aluno → professor → admin), com as camadas transversais em seção própria. Cada ficha traz **15 campos**:

| Campo da ficha | O que significa |
|---|---|
| **Perfil** | Persona que usa a tela (aluno, professor, admin ou transversal) |
| **Identificador** | Seletor CSS/id encontrado no código + faixa de linhas em `src.html` |
| **Finalidade** | Para que a tela existe |
| **Acesso** | Como o usuário chega até ela |
| **Ações** | O que dá para fazer nela |
| **Dados e origem** | O que é exibido e de onde vem hoje (arrays JS em memória, HTML fixo etc.) |
| **Estado local** | Variáveis/estruturas JS e chaves de `localStorage` envolvidas |
| **Funções** | Funções nomeadas do IIFE que a movimentam |
| **Simulado hoje** | O que a mecânica faz de verdade dentro da sessão do navegador |
| **Necessário no real** | O que a aplicação de produção precisará fazer no lugar da simulação |
| **Dependência técnica** | Front real / back-end / banco / sistema externo |
| **Validações** | O que a tela valida antes de agir (campos, saldos, estados) — "—" quando a camada não tem validação própria |
| **Possíveis erros** | Recusas e estados de erro que o usuário pode encontrar na tela — "—" quando não há |
| **Status** | Classificação no vocabulário obrigatório da auditoria |
| **Divergências** | Só aparece quando há divergência confirmada |

**Formato agrupado (registro formal):** as seções **3.8** (toasts/pops/conectividade), **3.9** (pop-ups de estado de conta e matrícula), **6.2** (jump chips) e os painéis internos de **6.3/6.4** (blocos do Painel de Controle e do Interno do admin) usam tabelas ou mini-fichas comprimidas **em vez da ficha completa de 15 campos**. Justificativa: são micro-componentes ou blocos de um mesmo view-contêiner — persona, acesso e dependências são idênticos aos do contêiner, e repetir a ficha completa por item apenas duplicaria conteúdo. Nos itens agrupados, os campos omitidos valem os do contêiner (6.3 = `v-adm-controle`; 6.4 = `v-adm-hoje`) e cada linha/mini-ficha preserva identificador, comportamento e status próprios.

Convenções: **arquivo único** — todas as fichas referem-se a `/home/user/viveroquad/src.html` (11.920 linhas; CSS l.3–1570, HTML l.1571–3669, IIFE JS l.3670–11920). **Linhas são aproximadas (±3)**. "SIMULADO LOCALMENTE" = a mecânica funciona de verdade dentro da sessão, mas sem persistência/servidor; "APENAS VISUAL" = não há mecânica, só render fixo. Marcações `[INTEGRAÇÃO REAL]` no próprio código sinalizam pontos que o autor já declarou dependentes de integração. Nada do que está aqui persiste entre reloads, exceto as poucas chaves de `localStorage` citadas (§4.16).

---

## 2. Mapa geral de telas e navegação

O protótipo tem **22 views** com id `v-*`, alternadas por `showView(id, navId)` (JS l.4040–4074), que esconde/mostra `div.view` e reexecuta renders da tela de destino. A troca de persona é feita pelos botões `.persona-btn[data-persona]` (ver ficha 3.1).

| # | View (id) | Persona | Nome na UI | Na navbar? |
|---|---|---|---|---|
| 1 | `v-inicio` (l.1661) | aluno | Início | Sim (aba 1) |
| 2 | `v-missoes` (l.1716) | aluno | Missões | Sim (aba 2) |
| 3 | `v-dominio` (l.1753) | aluno | Domínio | Sim (aba 4) |
| 4 | `v-loja` (l.1819) | aluno | Quad Store | Sim (aba 5) |
| 5 | `v-perfil` (l.1773) | aluno | Quadrômetro | Menu "+" |
| 6 | `v-aluno` (l.1954) | aluno | Perfil do aluno | Toque no avatar |
| 7 | `v-pretaf` (l.2062) | aluno | Pré-TAF | **Sem caminho de UI** (ver 4.14) |
| 8 | `v-calendario` (l.2099) | aluno | Calendário | Menu "+" |
| 9 | `v-materiais` (l.2121) | aluno | Materiais das aulas | Menu "+" |
| 10 | `v-prof-painel` (l.2134) | professor | Controle (perfil) | Sim |
| 11 | `v-prof-eventos` (l.2184) | professor | Eventos | Sim |
| 12 | `v-prof-cal` (l.2197) | professor | Calendário | Sim |
| 13 | `v-prof-chat` (l.2206) | professor | Informações | Sim |
| 14 | `v-sala` (l.2236) | professor | Quiz ao vivo | Sim |
| 15 | `v-turmas` (l.2303) | admin | Estrutura | Botão `#btnIrEstrutura` |
| 16 | `v-edital` (l.2332) | admin | Edital (demonstração) | Botão `#btnIrEdital` |
| 17 | `v-questoes` (l.2370) | admin | Questões (demonstração) | Botão `#btnIrQuestoes` |
| 18 | `v-adm-controle` (l.2390) | admin | Controle | Sim |
| 19 | `v-adm-hoje` (l.2603) | admin | Interno | Sim |
| 20 | `v-adm-liber` (l.2862) | admin | Liberações | Sim |
| 21 | `v-adm-alunos` (l.2904) | admin | Relatórios | Sim |
| 22 | `v-adm-loja` (l.3043) | admin | Loja | Sim |

Navbars: aluno `#navAluno` (l.3584–3590: Início · Missões · **+** · Domínio · Loja); professor `#navProfessor` (l.3591–3597); admin `#navAdmin` (l.3598–3604). O Início do aluno tinha rolagem infinita vertical (`initLoop`/`syncLoops`/`queueSync`) — ***removida pela dec. 201 (15/08)***: a aba rola e para no fim como as demais; ficaram a roda 3D dos cards (`RODA_VIEWS`) e a esteira horizontal de eventos.

**Bloqueio sem matrícula:** `checarMatricula()` (l.3900–3903) seta `appLock` quando não há matrícula ativa; a nav então bloqueia tudo exceto a Loja (l.4079–4082) e abre o pop-up `#matLayer` (ficha 3.9). SIMULADO LOCALMENTE; a vigência real da matrícula DEPENDE DE BANCO DE DADOS.

---

## 3. Camadas transversais (entrada, tutorial, compra, chat, zoom, toasts)

### 3.1 Seletor de personas

- **Perfil:** transversal (moldura do protótipo, não é feature de produto).
- **Identificador:** `.persona-btn[data-persona]` — `src.html` HTML l.1582–1586; JS l.3910–3942; mapa `personaViews` l.3912–3916.
- **Finalidade:** alternar entre as três experiências (aluno / professor / admin N.P.P.) dentro do mesmo arquivo.
- **Acesso:** botões fixos na moldura, fora do "celular".
- **Ações:** clique troca topo (`.app-top[data-scope]`), navbar e view inicial; reabre `#profGate`/`#admGate` se a persona ainda não foi liberada na sessão (`profLiberado` l.4886, `admLiberado` l.9786); esconde o FAB do QUAD fora do aluno (l.3939).
- **Dados e origem:** flags de sessão em memória (`personaAtiva`, `admLiberado`, `profLiberado`).
- **Estado local:** apenas memória — nenhuma dessas flags vai para `localStorage`.
- **Funções:** handlers dos `.persona-btn` (l.3917–3942).
- **Simulado hoje:** troca instantânea de contexto no mesmo navegador.
- **Necessário no real:** três aplicações/perfis com autenticação e autorização próprias; o seletor não existirá.
- **Dependência técnica:** DEPENDE DO BACK-END (autenticação/autorização reais).
- **Validações:** — (nenhuma própria; a liberação de professor/admin é validada nos gates — fichas 5.1 e 6.1).
- **Possíveis erros:** persona ainda não liberada reabre o gate correspondente (`#profGate`/`#admGate`); fora isso, sem estados de erro.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 3.2 Login do aluno + criação de conta + vinheta

- **Perfil:** aluno.
- **Identificador:** `#loginLayer` (HTML l.3563–3579: `#loginEmail`, `#loginSenha`, `#btnAcessar`, `#btnCriarConta`); passos de gate `#gateVerify` (l.3344) e `#gateCriar` (l.3352); vinheta `#splashLayer` (l.3332–3337, com "Verificando a matrícula de …" em `#splashVerify`).
- **Finalidade:** porta de entrada do aluno; direcionamento de quem ainda não tem conta para o checkout do site.
- **Acesso:** camada inicial da persona aluno; reaparece via `sairConta()` (l.7021–7031) e quando o admin bloqueia a conta (l.9893–9900).
- **Ações:** `#btnAcessar` → `acessarPortal()` (l.5633–5654): valida presença de `@` e senha não vazia, exige estado `online`, checa conta bloqueada (`contaDe('eu').bloqueada` → abre `#bloqLayer`), grava e-mail em `#contaEmail` e chama `entrarApp(primeiro)` — `primeiro = lsGet('vq_tut_skip') !== '1'` (l.5650). `#btnCriarConta` → `abrirGate('gateCriar')` (l.5660–5663); `#btnIrCheckout` só exibe toast "Redirecionando… (demo)" (l.5664–5667).
- **Dados e origem:** nenhum banco — **qualquer e-mail + qualquer senha entram** (não há verificação de credencial).
- **Estado local:** `online` (l.3730); `localStorage`: `vq_tut_skip`, `vq_device_authorized`, `vq_last_sync` (gravadas em `entrarApp`, l.5674–5687).
- **Funções:** `acessarPortal`, `entrarApp`, `playSplash` (l.5552–5567), `gateStep` (l.5620–5625), `sairConta`.
- **Simulado hoje:** login sempre aceito; vinheta com "verificação de matrícula" cenográfica; criação de conta é só um texto explicando que a conta nasce no checkout do site.
- **Necessário no real:** autenticação com credencial verificada no servidor (comentário `[INTEGRAÇÃO REAL] validar no servidor`, l.5629–5632); conta criada pelo checkout do site; verificação de matrícula ativa para liberar o app.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS (credenciais e matrícula); criação de conta DEPENDE DE SISTEMA EXTERNO (site/checkout Quad).
- **Validações:** presença de `@` no e-mail e senha não vazia; estado `online`; conta não bloqueada (`acessarPortal()`, l.5633–5654).
- **Possíveis erros:** offline → login negado; conta bloqueada → `#bloqLayer`; sem matrícula ativa → app trava após a vinheta (`#matLayer`, ficha 3.9).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (login) · APENAS VISUAL (redirecionamento ao checkout).
- **Divergências:** DIVERGÊNCIA DOCUMENTAL — o aside da moldura (l.3645–3654) ainda descreve o fluxo antigo por cenários de e-mail (`aluno@quad.com`/`codigo@quad.com`/`novo@quad.com` + código `123456`); as variáveis `scenario` e `CODE_OK` sobrevivem no JS (l.3732–3734) como código morto, mas o fluxo vigente é e-mail+senha diretos. `#gateVerify` é parcialmente vestigial (a verificação migrou para a vinheta, comentário l.5646–5647).

### 3.3 Tutorial obrigatório ("Instrução do QUAD") + missão "Introdução no Quad"

- **Perfil:** aluno (1º acesso).
- **Identificador:** `#tutLayer` (HTML l.3401–3416: sombras `tutShT/B/L/R`, anel `#tutRing`, seta `#tutArrow`, balão `#tutBubble`, robô `#tutQuad`, `#tutSkip`, `#tutNext`); missão demonstrativa `#tqLayer` (l.3553–3560).
- **Finalidade:** onboarding guiado pelo mascote QUAD: escolher avatar, confirmar dados, definir nome de guerra, conhecer score/Quad Coins/Loja e concluir a primeira missão.
- **Acesso:** dispara em TODO acesso enquanto `vq_tut_skip !== '1'` (comentário l.5648–5649); pode ser rerodado pela central de tutoriais ("↻ Refazer a instrução inicial", l.7803).
- **Ações:** roteiro `TUT` de **29 passos** (l.5764–5857): apresentação → tocar na foto → segurar para zoom → escolha de avatar (com confirmação) → confirmação de dados "do sistema" → nome de guerra (validação `tutGuerraOk`) → salvar perfil → leitura de patente/score → missão "Introdução no Quad" (3 questões com feedback imediato, banco `TQ` l.6867–6871, loop até acertar as 3) → Quad Coins → Loja → compra da boina → zoom final → conclusão. "Pular" (`tutPular`, l.6981–7006) reproduz o estado final (+30 score, boina equipada, 5 QdC restantes, Introdução feita).
- **Dados e origem:** `DB_ALUNO` (nome/fone pré-preenchidos, l.3944–3946), `TUT_REW = { score: 30, coins: 25 }` (l.6872), filtro de palavrões `TUT_PALAVROES` (l.5699).
- **Estado local:** `localStorage`: `vq_tut_step`, `vq_tut_done`, `vq_tut_skip`, `vq_intro_done` (gravada por `blocoIntroMarca`, l.6877–6884 — esconde a linha `#blocoIntroRow` das Missões quando feita).
- **Funções:** motor `tutGo/tutMask/tutPlace/tutMood/tutGesto/tutSay` (l.5940–5971), `tutEvent` (l.6020–6025), `tutTypeCheck` (l.6100–6108), `iniciarTutorial` (l.6954–6977 — zera Coins/score, devolve boina, reabre Introdução), `tutFim` (l.7009–7017), `tqResultado` (l.6920–6941), `avPerguntaDe` (l.5755–5759 — pronome por gênero do avatar).
- **Simulado hoje:** tudo funcional na sessão, inclusive o pagamento das recompensas e o bloqueio do fundo (wheel/touchmove travados, l.6035–6040).
- **Necessário no real:** os dados "vindos do sistema" (nome, turma) precisarão vir de fato da matrícula; a conclusão do tutorial e a Introdução precisam persistir na conta.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS (persistência do estado de onboarding e das recompensas).
- **Validações:** avanço condicionado à ação esperada de cada passo (campo `expect` do roteiro `TUT`); nome de guerra por `tutGuerraOk` (l.5731–5748); a missão "Introdução no Quad" exige acertar as 3 questões (loop até acertar).
- **Possíveis erros:** nome de guerra inválido bloqueia o passo; resposta errada na Introdução repete a questão com feedback; "Pular" não é erro — reproduz o estado final (`tutPular`).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 3.4 Zoom de imagem ("segurar para ampliar")

- **Perfil:** aluno (tutorial, perfil, grid de avatares).
- **Identificador:** `#zoomLayer` (HTML l.3419–3422).
- **Finalidade:** ampliar a foto do personagem/avatar ao segurar o toque.
- **Acesso:** segurar em opções do grid de avatares, `#avPreview` e `#btnAvatarPerfil` (l.7174–7185).
- **Ações/funções:** `bindHold`/`zoomShow`/`zoomHide`/`holdSolta` (l.7066–7112), com supressão do clique pós-zoom (`dataset.zoomed`); o zoom identifica o título completo (ex.: "AL SD QUAD MOURA") quando há nome de guerra.
- **Dados e origem:** sprite `__AVATARS__` recortado em canvas (`montarAvatares`, l.7136–7188) e fotos de variantes `__FOTOS_VARIANTES__`.
- **Estado local:** nenhum dedicado — apenas a flag transitória `dataset.zoomed` no elemento (supressão do clique pós-zoom); nada em `localStorage`.
- **Simulado hoje:** recorte do sprite em canvas e ampliação ao segurar o toque, tudo no cliente.
- **Necessário no real:** nada além do front real (portar o padrão de interação com assets servidos separadamente).
- **Dependência técnica:** DEPENDE DO FRONT-END REAL (apenas como padrão de interação a portar); sem dependência de servidor.
- **Validações:** —.
- **Possíveis erros:** — (soltar o toque antes do tempo apenas cancela o zoom).
- **Status:** CONFIRMADO NO CÓDIGO (mecânica de UI pura, sem dependência de servidor).

### 3.5 Modal de compra + escolha de moeda de turma

- **Perfil:** aluno (Loja e vitrines).
- **Identificador:** `#compraLayer` (HTML l.3436; JS l.9236–9268, com seletor de quantidade ±); `#turmaLayer` (escolha da moeda da matrícula, HTML l.3475–3486).
- **Finalidade:** confirmação de toda compra da Quad Store (2 toques), com escolha de moeda quando o item tem vagas/preço em Dmn **e** QdC.
- **Acesso:** qualquer item comprável da Loja (`bindLojaItem`, l.8667–8712) e fluxos de matrícula (`turmaClick` → `matricular`, l.8739–8788) e simulado (`escolherMoedaSim`/`finalizarCompraSim`, l.6450–6547).
- **Ações:** confirmar/cancelar; quantidade (produtos físicos); escolher moeda (turmas/simulados presenciais).
- **Dados e origem:** saldos em memória (`score` = Quad Coins l.3672, `diamantes` l.3771); catálogos `TURMAS_LOJA`, `ITENS_PRESENCIAIS`, `LOJA_EXTRAS`, `SKIN_CADEIA`/`SKIN_FARDAS`, `ITENS_COMBATE`, `SIMULADOS`, `EVENTOS`.
- **Estado local:** `COMPRAS`/`lojaCompraLog` (l.11458–11464), estoques decrementados nos próprios catálogos.
- **Funções:** `confirmarCompra`, `saldoDe/debitar/semSaldoMsg` (l.8660–8666), `abrirCompra` (l.9215+).
- **Simulado hoje:** débito de carteira, decremento de estoque/vaga por moeda, marcação ADQUIRIDO, log de compra — tudo em memória.
- **Necessário no real:** transação atômica de pagamento/estoque no servidor; carteira validada.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Validações:** saldo suficiente na moeda escolhida (`saldoDe`/`debitar`); vaga/estoque disponível na moeda; quantidade mínima 1 nos produtos físicos.
- **Possíveis erros:** saldo insuficiente → `semSaldoMsg` orienta recarga no site ou gift card; item esgotado sai da vitrine; cancelar fecha sem debitar.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 3.6 Chat · recados da administração

- **Perfil:** aluno (leitura); alimentado pelo admin.
- **Identificador:** `#chatLayer` (HTML l.3454–3462); linha `#rowChat` no menu "+" (l.3308–3312); badges `#plusBadge` e `#chatBadge`.
- **Finalidade:** caixa de entrada unidirecional de recados da administração ("responda procurando a administração", l.3461).
- **Acesso:** menu "+" → "Chat · recados da administração" → `abrirChat()` (l.9927–9935).
- **Ações:** ler (abrir = marcar como lida — zera badge e sincroniza o selo "LIDA" no painel do admin via `admRef`).
- **Dados e origem:** array `RECADOS` em memória, alimentado pelo bloco de mensagens do admin (ficha 6.3-msg): individuais (l.10023–10033) e públicos com prefixo `[<nome do público>]` (l.9992).
- **Funções:** `renderChatBadge`/`chatNaoLidas` (l.9911–9918), `msgPublico` (l.9950–9978).
- **Simulado hoje:** entrega instantânea no mesmo navegador; contador de não lidas.
- **Necessário no real:** mensageria com push/notificação (a V0 declaradamente "nunca empurra" — aside).
- **Dependência técnica:** DEPENDE DO BACK-END (mensageria) · DEPENDE DO FRONT-END REAL (push, se vier).
- **Estado local:** `RECADOS` em memória; badges recalculados por `chatNaoLidas`.
- **Simulado hoje:** entrega e marcação de leitura instantâneas dentro da sessão.
- **Necessário no real:** histórico de mensagens persistido por conta (hoje se perde no F5).
- **Validações:** — (leitura; o aluno não envia).
- **Possíveis erros:** — (sem recados, a lista fica vazia; responder é bloqueado por desenho — "procure a administração").
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE. "Chat ao vivo" (duas vias) está bloqueado "EM BREVE" — DECISÃO DE PRODUTO PENDENTE.

### 3.7 QUAD (mascote): FAB, central de tutoriais e pop-up vestigial

- **Perfil:** aluno.
- **Identificador:** FAB `#daniloFab` (l.3269, sprite de 7 poses `__DANILO_SPRITE__`); balão `#daniloHint`; central `#helpLayer` (HTML l.3525–3532; JS l.7787–7836); pop-up antigo `#daniloPop` com vídeo `__DANILO_VIDEO__` (l.3273–3287).
- **Finalidade:** ajuda contextual e reacesso ao tutorial.
- **Acesso:** FAB visível só na persona aluno; clique abre a central.
- **Ações:** 6 tutoriais listados (`HELP_TUTS`) — todos respondem "em construção" — e botão funcional "↻ Refazer a instrução inicial" (reroda `iniciarTutorial`).
- **Funções:** `daniloWave` (l.11902–11913), `daniloHintMostra` (balão por 10 s, l.11890–11898).
- **Dados e origem:** lista fixa `HELP_TUTS` (l.7787); sprite `__DANILO_SPRITE__` e vídeo `__DANILO_VIDEO__` embutidos no build.
- **Estado local:** nenhum dedicado (flags de UI em memória; nada em `localStorage`).
- **Simulado hoje:** FAB com aceno, balão de dica por 10 s e central com o botão funcional de refazer a instrução.
- **Necessário no real:** conteúdo real dos 6 tutoriais da central (hoje "em construção") e política de exibição do mascote no app real.
- **Dependência técnica:** DEPENDE DO FRONT-END REAL (conteúdo dos tutoriais); sem dependência de servidor.
- **Validações:** —.
- **Possíveis erros:** — (tutoriais listados respondem "em construção" via toast; não é estado de erro do usuário).
- **Status:** CONFIRMADO NO CÓDIGO · APENAS VISUAL (lista de tutoriais). `#daniloPop` é **vestigial**: o vídeo é carregado (l.7774–7782) mas nenhum handler o abre — HIPÓTESE: sobra de rodada anterior mantida para reaproveitamento.

### 3.8 Toasts, pops e conectividade

Componentes pequenos agrupados (sem ficha individual):

| Componente | Identificador | Comportamento | Status |
|---|---|---|---|
| Toast global | `#toast` (l.3581) | Mensagens curtas de feedback em toda a UI (compras, bloqueios "EM BREVE", erros) | CONFIRMADO NO CÓDIGO |
| Pop de score | `#scorePop` (via `addScore`, l.3755–3766) | Animação de ganho de Quad Coins; `animarMoedaConquista` (l.6629–6664) anima a moeda do bloco da noite | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE |
| Banner offline + chip | `#offlineBanner` (l.1654), `#syncChip` (l.1653–1658) | Estado `online` (l.3730) com `applyConnUI`/`setOnline` (l.5603–5615); offline bloqueia login e quiz da aula | CONFIRMADO NO CÓDIGO — **porém o alternador `#connToggle` referenciado no JS (l.5604, 5616) NÃO existe no HTML**: o modo offline é inatingível pela UI atual. DIVERGÊNCIA DOCUMENTAL (o aside l.3647 manda alternar por um indicador que não está lá). Offline real (fila de sync, autorização de dispositivo): DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END |
| Reset da demo | `#btnResetDemo` (aside; JS l.8639–8648) | Limpa `vq_device_authorized`, `vq_last_sync`, `vq_pending`, `vq_tut_*` e sai da conta | CONFIRMADO NO CÓDIGO (ferramenta de demonstração) |

### 3.9 Pop-ups de estado de conta e matrícula (agrupados)

| Pop-up | Identificador | Quando abre | Ações | Status |
|---|---|---|---|---|
| Matrícula encerrada | `#matLayer` (HTML l.3514–3522) | `checarMatricula()` detecta 0 matrículas ativas — app trava exceto a Loja | `#btnMatLoja` (ir à Loja) / `#btnMatOk` (l.8802–8803); hook `window.__mat` (l.3905–3908) | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (vigência real DEPENDE DE BANCO DE DADOS) |
| Conta bloqueada | `#bloqLayer` (HTML l.3465–3472) | Login de conta bloqueada, ou admin bloqueia a conta com sessão aberta (derruba em ~400 ms, l.9893–9900) | Ciência/fechar | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (suspensão real DEPENDE DO BACK-END) |
| Matrícula confirmada / troca de turma | `#trocaLayer` (HTML l.3489–3497) | Após 2ª+ matrícula (`abrirTrocaTurma`, l.7358–7388) ou pelo seletor `#cardTurma`/`#btnDomTrocar` | Escolher qual turma passa a ser a ativa; clicar fora mantém a atual (l.7406–7414) | CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE |
| Leitor de QR (gift card) | `#scanLayer` (HTML l.3500–3511) | `#btnGiftScan` na Loja | Câmera **simulada**; `#btnScanDemo` valida o primeiro código ativo do lote (l.10114–10119) | SIMULADO LOCALMENTE · DEPENDE DO FRONT-END REAL (câmera/leitura de QR, marcado `[INTEGRAÇÃO REAL]`) + DEPENDE DO BACK-END (validação de resgate único) |

---

## 4. Persona ALUNO

### 4.0 Moldura da persona: topo de identidade

- **Perfil:** aluno.
- **Identificador:** `.idbar` (HTML l.1599–1632): avatar `#btnAvatarPerfil`/`#homeAvatar`, nome militar `#homeNome`, insígnia `#cardInsig` + `#rankNome`, seletor de turma `#cardTurma`, carteiras `#coinsCard` (`#scoreVal`) e `#dmnCard` (`#dmnVal`), barra de score `#xpFill`/`#xpNum`, chip `#promoChip`.
- **Finalidade:** identidade permanente do aluno em todas as telas: quem é, patente, turma ativa, saldos.
- **Ações:** toque no avatar abre `v-aluno` (l.9774–9779); `#cardTurma` vira botão de troca quando há 2+ matrículas (l.7236–7239).
- **Dados e origem:** estado `carreira` (l.3708–3718), `score`/`diamantes`, `TURMAS_LOJA`/`MATRICULAS` — tudo em memória.
- **Funções:** `renderCarreira()` (l.7227–7276), `definirTurmaAtiva` (l.3867–3893), `aplicarAvatar` (l.7129–7135).
- **Necessário no real:** o comentário do próprio código diz "no sistema real vem validado do servidor" (l.3706–3707).
- **Validações:** — (exibição; a troca de turma ativa valida matrículas no pop-up `#trocaLayer` — ficha 3.9).
- **Possíveis erros:** —.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END.

### 4.1 `v-inicio` · Início

- **Perfil:** aluno.
- **Identificador:** `#v-inicio` — `src.html` HTML l.1661–1713.
- **Finalidade:** hub diário: aula de hoje, bloco de missões do turno, avisos e eventos da semana.
- **Acesso:** aba 1 da navbar; view inicial da persona.
- **Ações:** entrar no quiz da aula (`#btnEntrarQuiz`); abrir a próxima missão pendente (`#btnMissaoHome`, l.4731–4738); resgatar benefícios da noite completa (`resgatarBeneficios`, l.6612–6628: +1 score por bloco + 1 Quad Coin com animação); abrir página de evento; clique em evento pago não comprado **abre a página do evento** e o botão de lá leva ao item na Loja (`lojaLevarAte`, l.4477–4488 — decisão 173, revista pela **decisão 199 de 15/08**).
- **Dados apresentados e origem:**
  - **Aula de hoje** (`#salaCard`): `renderAulaHoje()` (l.4839–4876) sobre o snapshot `CRONO` (semana 30, l.4745–4774); estados AGORA/ENCERRADO pelo relógio local; rodapé "atualizado pela planilha da coordenação". Selo do quiz (`refreshQuizAula`, l.5458–5487: SEM QUIZ ABERTO → AULA COM QUIZ → ATIVO → RESPONDIDO).
  - **Missão de hoje / Bloco do turno** (cartão herói, l.1677–1696): `heroSync()` (l.6571–6604), contador `#missCount`, segmentos `#missSegs`, resgate por turma (`NOITE_RESG`).
  - **Avisos gerais** (`#avisosList`): `renderAvisos()` (l.10171–10176) filtra `AVISOS` pela turma ativa (`avisoVisivel`, l.10149–10161).
  - **Eventos da semana** (`#evStrip`): carrossel infinito (3 cópias, `renderEvStrip` l.4329–4335; arrasto/roda l.4431–4456) com etiquetas INSCRITO / LOTADO / EM CHOQUE / NA LOJA / +BÔNUS / COINS (**a "COINS" e a tag livre que a produzia foram removidas pela dec. 200 de 15/08** — o vocabulário de tipo ficou em NA LOJA e +BÔNUS); todo evento vigente aparece para qualquer aluno ("eventos são do QUAD, não de uma turma" — decisão do gestor 28/07, l.4318–4319).
- **Estado local:** `CRONO`, `AVISOS`, `EVENTOS`, `NOITE_RESG`, `QUIZZES` — memória; hook `window.__noite` (l.7525–7529).
- **Simulado hoje:** grade, avisos e eventos reagem em tempo real ao que o admin/professor faz no mesmo arquivo.
- **Necessário no real:** grade vinda da planilha da coordenação (comentário l.4740–4744), avisos publicados por back-end, eventos com inscrição/lotação centrais.
- **Dependência técnica:** DEPENDE DE SISTEMA EXTERNO (planilha Google Sheets do cronograma) · DEPENDE DO BACK-END (avisos, eventos, quiz) · DEPENDE DE BANCO DE DADOS.
- **Validações:** quiz da aula exige estado `online` e quiz ativo da turma; resgate da noite exige o bloco do turno completo.
- **Possíveis erros:** sem aula hoje/fora do horário → estados ENCERRADO; sem quiz → selo "SEM QUIZ ABERTO"; evento lotado → etiqueta LOTADO.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 4.2 Página do evento (overlay)

- **Perfil:** aluno.
- **Identificador:** `#evLayer` (HTML l.3180–3191); abertura por `openEvento` (l.4491–4562).
- **Finalidade:** detalhe do evento: hero, regras de score e Quad Coins, inscrição/compra, link online, "garimpo".
- **Acesso:** tiles do carrossel do Início e itens de evento na Loja/Calendário.
- **Ações:** inscrever-se (gratuito) com confirmação em 2 toques quando há choque de agenda; "Garimpar Quad Coins escondidos" (`ev.garimpo` → +15 QdC, l.4554–4560); evento online libera link após inscrição (`evAplicaLink` — só toast na demo).
- **Dados e origem:** `EVENTOS` (l.4226–4262) com arrays `ev.score`/`ev.coins`; lotação presencial = cadeiras da sala (`evLot`/`evOcupados`/`evLotado`, l.4375–4385, com `SALA_CAP` l.8922); `evAcabou` (l.4393–4397) remove vencidos de carrossel/Loja/calendário.
- **Estado local:** `evState` (inscrições) em memória; hooks `window.__eventos/__evEstado/__evProf/__evLotar`.
- **Simulado hoje:** inscrição, lotação e premiação por participação dentro da sessão.
- **Necessário no real:** inscrições e lotação centrais; link de transmissão real.
- **Dependência técnica:** DEPENDE DO BACK-END (inscrições/lotação) · DEPENDE DE SISTEMA EXTERNO (link de transmissão).
- **Validações:** lotação da sala antes de inscrever/comprar (`evLotado`); choque de agenda pede confirmação extra em 2 toques.
- **Possíveis erros:** LOTADO recusa; garimpo só uma vez por evento; evento vencido some das vitrines (`evAcabou`).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 4.3 `v-missoes` · Missões

- **Perfil:** aluno.
- **Identificador:** `#v-missoes` — HTML l.1716–1750.
- **Finalidade:** central de estudo diário: treinamento rápido (flashcards), blocos de questões do dia, revisões e atrasadas.
- **Acesso:** aba 2 da navbar.
- **Ações:** abrir Treinamento Rápido (`#btnTreinoRapido` → `trAbrir`); abrir blocos "Hoje · questões novas" (`renderDia`, l.6665–6686); refazer a "Introdução no Quad" (`#blocoIntroRow`, some quando feita — `vq_intro_done`); "Recuperar" blocos atrasados (`renderAtrasadas`, l.6312–6325 — idade ≥ 7 dias).
- **Dados e origem:** blocos POR TURMA (`BLOCOS_TURMA`, l.6264; turma nova recebe `novosBlocosDia`, l.6265–6281); demo `DIA_BLOCOS` (l.6234–6258): 8 blocos (2 do dia + revisões D-1/D-7/D-30 do "PDF 01" `AULA_DEMO`, 40 cartas l.6186–6231) + 3 seeds atrasados. Regras: bloco nasce às 22h15, some quando feito, expira em 7 dias (`DIA_EXPIRA_DIAS`).
- **Estado local:** `TR_ST` (fila do treinamento por turma), `BLOCOS_TURMA`; hook `window.__blocos`.
- **Simulado hoje:** ciclo completo de blocos/revisões dentro da sessão; ao concluir bloco de fonte 'aula' as 10 cartas entram no `TR_BANK` (l.6825–6830).
- **Necessário no real:** conteúdo gerado dos PDFs de aula do operador; agenda de revisão persistida por aluno.
- **Dependência técnica:** DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END (extração de PDF, comentário l.6110–6118) · DEPENDE DE BANCO DE DADOS.
- **Validações:** blocos expiram em 7 dias e migram para "Atrasadas"; a linha da Introdução some quando `vq_intro_done` está gravada.
- **Possíveis erros:** — (sem blocos pendentes, as listas ficam vazias).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE. O "corte de sábado" citado no aside/calendário é só texto — APENAS VISUAL.

### 4.4 Treinamento Rápido / flashcards (overlay)

- **Perfil:** aluno.
- **Identificador:** `#trLayer` (HTML l.3535–3550), abas Gerais/Específicas.
- **Finalidade:** flashcards estilo Anki com autoavaliação (Errei/Difícil/Bom/Fácil) e recompensa por bloco.
- **Acesso:** card `#trCard` das Missões; blocos do dia abrem por `trAbrirBloco`.
- **Ações/funções:** fila em rodízio de 10 por assunto do edital da turma ativa (`trMontarFila`, l.6702–6716); `trResponde` (l.6787–6808); redistribuição ao zerar o baralho (`trRedistribuir`, l.6848–6856); recompensa `TR_REW` = +1 score/acerto e +5 QdC/bloco (`trFimBloco`, l.6809–6847), com ajuste do Domínio (`trAj`, l.6818–6820).
- **Dados e origem:** banco local `TR_BANK` (~60 cartas certo/errado, l.6122–6183) + cartas promovidas dos blocos de aula.
- **Estado local:** `TR_ST`/`trTrocaTurma` (rodízio por turma, l.6693–6700); `window.TR_BANK` exposto.
- **Simulado hoje:** todo o motor de repetição funciona na sessão.
- **Necessário no real:** banco de cartas vindo do conteúdo real (PDFs); progresso persistido.
- **Dependência técnica:** DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END · DEPENDE DE BANCO DE DADOS.
- **Validações:** autoavaliação obrigatória por carta (Errei/Difícil/Bom/Fácil) para avançar a fila.
- **Possíveis erros:** — (baralho zerado é redistribuído por `trRedistribuir`, sem estado de erro).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 4.5 Quiz da aula (lado do aluno) + quiz genérico

- **Perfil:** aluno.
- **Identificador:** quiz da aula `#qaLayer` (HTML l.3149–3163); quiz genérico `#quizLayer` (HTML l.3166–3177).
- **Finalidade:** `#qaLayer` — responder o quiz ao vivo lançado pelo professor da sala; `#quizLayer` — motor genérico de questões com gabarito ao final.
- **Acesso:** `#qaLayer` pelo botão `#btnEntrarQuiz` do Início (exige `online`, l.5488–5493); `#quizLayer` **não é chamado por nenhum fluxo atual do aluno** (motor semi-vestigial).
- **Ações/funções:** `#qaLayer`: cronômetro (`qaTick`, l.5497–5502), sem gabarito para o aluno, sem premiação; respostas entram no relatório do professor (`qaFinaliza`/`qzRelatorio`, l.5541–5548). Seleção do quiz por `quizDaMinhaTurma()` (l.5444–5457 — prioridade ativo > criado > encerrado, desempate pela turma ativa). `#quizLayer`: `openQuiz/renderQuestion/renderResult` (l.4644–4704) sobre `QUESTIONS` (3 questões, l.4616–4641); +20 QdC na conclusão (l.4709), +1 score por resposta (l.4714); botão "▶ Vídeo de resolução" é placeholder (toast, l.4698).
- **Regra de produto no código:** Quad Coin sobe por participação; acerto alimenta score/Domínio (l.1766–1769 e 4685–4686). CONFIRMADO NO CÓDIGO.
- **Simulado hoje:** professor e aluno no mesmo navegador; placar do professor mistura respostas sintéticas com a resposta real do aluno.
- **Necessário no real:** sala ao vivo com respostas reais em tempo real; vídeos de resolução hospedados.
- **Dependência técnica:** DEPENDE DO BACK-END (tempo real) · DEPENDE DE SISTEMA EXTERNO (vídeo de resolução).
- **Estado local:** `QUIZZES` (compartilhado com o professor), `QUESTIONS` — memória.
- **Dados e origem:** quiz criado pelo professor sobre os bancos demo `QA_MULT`/`QA_CE`; `QUESTIONS` fixo (3 questões, l.4616–4641).
- **Validações:** `#qaLayer` exige `online` e quiz ativo de turma do aluno; cronômetro encerra a participação no tempo.
- **Possíveis erros:** offline → toast de bloqueio; quiz encerrado → selo RESPONDIDO/ENCERRADO sem reentrada.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE. `#quizLayer`/`QUESTIONS`: HIPÓTESE — sobra de rodadas anteriores mantida para reaproveitamento (nada o aciona hoje).

### 4.6 `v-dominio` · Domínio (árvore do edital)

- **Perfil:** aluno.
- **Identificador:** `#v-dominio` — HTML l.1753–1770; card "PRÉVIA · V1" (l.1755).
- **Finalidade:** visão térmica do domínio do aluno sobre a árvore do edital do concurso da turma ativa.
- **Acesso:** aba 4 da navbar; faixa `#domTurmaBox` + `#btnDomTrocar` para trocar de turma (`renderDomTurma`, l.7390–7397).
- **Ações:** expandir/colapsar matérias/assuntos (l.4210–4217); links por assunto "▶ Assistir aula" (busca no YouTube) e "✎ Fazer questões" (qconcursos.com) — l.4184–4187; ***desde a dec. 202 (15/08)***, pílula **"▸ 10"** em cada subassunto (`.ed-q10`) abrindo o bloco de 10 questões de revisão daquele conteúdo (`trAbrirSub`, src/11) — apagada com aviso quando o assunto não tem cartas; subassuntos numerados 1.1.1; a árvore preserva o que estava aberto ao se redesenhar.
- **Dados e origem:** `renderEdital()` (l.4172–4208) sobre `EDITAL_ATUAL` — CFO PM-BA completo (`EDITAL_CFO`, l.4092, 13 matérias) ou árvores compactas (SOLDADO/PPBA/PCBA/PRF, l.4099–4121) conforme `CONCURSOS` (l.4122–4129). **Percentuais determinísticos por hash** (`edSubPct` com `ED_BASE` + `edHash`, l.4149–4159) + deslocamento vindo dos flashcards (`trAj`); agregação de baixo para cima (`edAvg`); escala térmica (`edHue`, l.4163–4166).
- **Estado local:** `CONCURSO_ATUAL_ID`/`EDITAL_ATUAL` (trocados por `definirDominio`, l.7845–7855); hooks `window.__dominio`/`__arvoreDe`.
- **Simulado hoje:** a árvore é viva (reage a turma, a flashcards e, dec. 202, à revisão por subassunto — `trAjSub`), mas os percentuais **não vêm de desempenho real**.
- **Necessário no real:** métrica de domínio calculada de respostas reais, com metodologia calibrada.
- **Dependência técnica:** DEPENDE DO BACK-END · DEPENDE DE SISTEMA EXTERNO (links YouTube/QConcursos).
- **Validações:** — (leitura; links externos abrem fora do app).
- **Possíveis erros:** —.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE + APENAS VISUAL (números sintéticos) · DECISÃO DE PRODUTO PENDENTE (metodologia — V1).

### 4.7 `v-perfil` · Quadrômetro

- **Perfil:** aluno.
- **Identificador:** `#v-perfil` — HTML l.1773–1816.
- **Finalidade:** carreira gamificada: score, patente, temporada, rankings, jornada de patentes, minhas turmas.
- **Acesso:** menu "+" → Quadrômetro.
- **Ações:** trocar turma ativa ("Usar esta" em Minhas turmas — `renderMinhasTurmas`, l.7336–7354); alternar privacidade (`#btnPriv`, l.7424–7443); expandir "Ver ranking completo".
- **Dados e origem:** números via `renderCarreira()`; estado `carreira` (l.3708–3718); rankings `renderRankings()` (l.7445–7489): sala com total real da turma ativa (`turmaInscritos`, l.10889–10894) mas posição sintética (~29%); geral fixo (1.286 usuários, aluno em 87º); nomes de `RK_NOMES`/`RK_OFF`. Jornada: 14 patentes de `GAMI.patentes` (l.3688–3703) em 4 fases (`renderTrilha`, l.7277–7293).
- **Privacidade de mão dupla:** `mascararNome` + `rkNomeExibido` (l.7316–7320): top 10 sempre visível; eu privado → não vejo ninguém do 11º em diante; eu público → vejo públicos. CONFIRMADO NO CÓDIGO.
- **Estado local:** `perfilPrivado`, `carreira` — memória.
- **Simulado hoje:** score/patente reais na sessão; posições de ranking fixas/sintéticas.
- **Necessário no real:** ranking e telemetria calculados no servidor sobre a base real.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Validações:** privacidade de mão dupla aplicada no render do ranking (`rkNomeExibido`, l.7316–7320).
- **Possíveis erros:** — (na demo os dados estão sempre presentes).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · APENAS VISUAL ("presença 9/10", chips de constância 7 dias l.1804–1811, telemetria `#telemetry`).

### 4.8 Prova de promoção (overlay)

- **Perfil:** aluno.
- **Identificador:** `#provaLayer` (HTML l.3118–3129).
- **Finalidade:** exame de 20 questões certo/errado que promove de patente ao atingir 80% (`PROVA_APROV`).
- **Acesso:** quando o score da patente bate a meta, `addPontos` (l.7498–7509) muda o estado para `disponivel` e libera a prova no card de progressão.
- **Ações/funções:** `abrirProva/renderQuestaoProva/resultadoProva` (l.7547–7636); questões colhidas das que o aluno marcou Errei/Difícil (`provaColeta`, l.7532–7546; completa da reserva na demo); aprovação promove na hora, transfere excedente de pontos e registra no histórico; reprovação bloqueia por 24h (`GAMI.tentativaHoras`) com botão "Liberar nova tentativa (simulação)".
- **Estado local:** `carreira.historico`; hook `window.__prova`.
- **Necessário no real:** validação servidor de score e promoção (marcado `[INTEGRAÇÃO REAL]` na moldura do estado de carreira).
- **Dependência técnica:** DEPENDE DO BACK-END.
- **Validações:** prova só fica disponível com a meta de score da patente batida; aprovação exige 80% (`PROVA_APROV`).
- **Possíveis erros:** reprovação bloqueia nova tentativa por 24h (`GAMI.tentativaHoras`), com botão de liberação da demo.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 4.9 `v-aluno` · Perfil do aluno (dados, personagem, conta)

- **Perfil:** aluno.
- **Identificador:** `#v-aluno` — HTML l.1954–2059.
- **Finalidade:** ficha do aluno: classificação, progressão, dados cadastrais, nome de guerra, personagem/avatar, mochila, histórico, conta.
- **Acesso:** toque no avatar do topo (`#btnAvatarPerfil` → `showView('v-aluno')`, l.9774–9779) e a partir do tutorial.
- **Ações:** editar nome de guerra (`#nomeGuerra`, maxlength 12; regra `tutGuerraOk` l.5731–5748 — só letras, sem palavrão, subsequência ordenada do nome completo, nunca o nome inteiro; `#btnSalvarPerfil` bloqueia inválido, l.7204–7214); abrir mochila (`#btnMochila`); trocar senha (`#novaSenha`+`#btnSenha` — **apenas toast**, l.7766–7769); sair (`#btnSairPerfil`); botões de demo `#btnDiaEstudo` (+275 pts) e `#btnDemoPatente` — bloco marcado `[DEMO PROVISÓRIO — REMOVER]` (`demoSobePatente`, l.7740–7758).
- **Dados e origem:** "Dados do aluno" pré-preenchidos de `DB_ALUNO` (l.3944–3946 — comentário "[INTEGRAÇÃO REAL] preenchidos a partir da matrícula"); classificação sala viva / geral fixa #87 de 1.286 (l.7245–7250); insígnias: sprite `__INSIGNIAS__` com `INSIG_MAP` 14 patentes → 10 artes (l.7216–7220); personagem: prévia `#avPreview` + nametag (`syncNametag`, l.7194–7203); grid de avatares oculto fora do tutorial (l.2009 — escolha única, depois travada); histórico `renderHistorico()` (l.7491–7496).
- **Estado local:** `DB_ALUNO`, `carreira`, `MOCHILA` — memória.
- **Simulado hoje:** edição e validação do nome de guerra ao vivo; avatar/foto trocada por item vestido (`fotoPersonagem`, l.7119–7128).
- **Necessário no real:** dados cadastrais da matrícula; troca de senha real; persistência do perfil.
- **Dependência técnica:** DEPENDE DE BANCO DE DADOS (cadastro) · DEPENDE DO BACK-END (senha, persistência).
- **Validações:** nome de guerra por `tutGuerraOk` (só letras, sem palavrão, subsequência ordenada do nome, nunca o nome inteiro); `#btnSalvarPerfil` bloqueia inválido.
- **Possíveis erros:** nome inválido → salvar bloqueado com aviso; troca de senha não tem efeito real (apenas toast).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · APENAS VISUAL ("Tempo de uso" fixo l.2049–2055; troca de senha).

### 4.10 Mochila de combate (overlay)

- **Perfil:** aluno.
- **Identificador:** `#storageLayer` (HTML l.3425–3433).
- **Finalidade:** inventário dos itens de combate comprados na Loja.
- **Acesso:** `#btnMochila` no perfil (bloqueada durante o tutorial, l.9679).
- **Ações/dados:** grade de slots (mín. 9, cresce de 3 em 3); contagem "N unidades · M tipos" (`renderMochila`, l.9654–9677); `MOCHILA` = array de ids com repetição.
- **Estado local:** `MOCHILA` (l.9610 — array de ids com repetição) — memória.
- **Simulado hoje:** inventário cresce a cada compra de item de combate; a grade expande de 3 em 3 slots.
- **Necessário no real:** inventário do jogador persistido por conta.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Validações:** — (abertura bloqueada durante o tutorial, l.9679).
- **Possíveis erros:** — (mochila vazia exibe os slots vazios).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE. Rodapé "Quests em breve: reúna itens para forjar equipamentos" — APENAS VISUAL (estrutura `Quests · reservada` l.9579 vazia) · DECISÃO DE PRODUTO PENDENTE.

### 4.11 `v-loja` · Quad Store (inclui Estornos e Relatório de compras)

> ***Atualização 03/08/2026 (dec. 196/197)*** — o "Relatório de compras" e o "Extrato da carteira" viraram **um card só**: "**Carteira · extrato e compras**" (`#rcCard`, último bloco da Loja), com um seletor de período valendo para os dois lados, KPIs **recebido · gasto · compras · a receber**, a seção "Movimentações do período" (`#extTabs` Tudo/QdC/Dmn + `#extList`, alimentada pelo **LEDGER** — DA-03) e as três listas de situação (`#rcAndamento`, `#rcPendente`, `#rcEntregue`). A ficha abaixo descreve o estado de 30/07.

- **Perfil:** aluno.
- **Identificador:** `#v-loja` — HTML l.1819–1951.
- **Finalidade:** vitrine única de tudo que se adquire com Quad Coins (QdC) e Diamantes (Dmn): turmas, isoladas, simulados, eventos, produtos físicos, cursos digitais, skins, itens de combate — mais gift card, estornos e relatório de compras.
- **Acesso:** aba 5 da navbar; única área liberada quando o app trava sem matrícula.
- **Estrutura:** hero com saldos `#lojaSaldo`/`#lojaSaldoDmn` + gift card (`#giftCode`+`#btnGift`+`#btnGiftScan`); macro-bloco PRESENCIAIS (Turmas `#lojaTurmasCore` · Isoladas `#lojaIsoladas` · Simulados `#lojaSim-pres` · Eventos `#lojaEventos-pres` · Excursões · Módulos · TAF · Outros) e macro-bloco DIGITAIS (Cursos online fixos + `#lojaExtras-digitais` · Simulados `#lojaSim-dig` · Mentoria · Eventos `#lojaEventos-dig` · Itens do personagem `#skinChain` · Itens de combate `#combatGrid`); depois ESTORNOS e RELATÓRIO DE COMPRAS.
- **Ações e regras confirmadas:**
  - Toda compra passa pelo modal de confirmação (ficha 3.5); esgotou → item some; tudo logado (`lojaCompraLog`).
  - **Turmas com vagas POR MOEDA** (`renderTurmasLoja` l.8718–8737; badge "145 Dmn · 10 QdC"); `matricular(moeda)` (l.8757–8788) checa **choque de agenda** (matrícula não pode sobrepor turno, l.8760–8761), debita, decrementa a vaga da moeda; 1ª matrícula assume o app, 2ª+ abre `#trocaLayer`.
  - **Choque de agenda:** motor `agendaOcupada`/`choqueDeAgenda`/`avisoChoque` (l.9056–9118) cruza turmas + isoladas + eventos por dia × horário × período; compra com choque exige confirmação ("sem reposição de aula").
  - **Isoladas** (`ISOLADAS` l.8881–8888): compradas viram evento recorrente (`isoladaComprada`, l.9154–9171).
  - **Skins:** boina (20 QdC) + cadeia `SKIN_CADEIA` gandola(60)→colete(120)→fuzil(200) um elo por vez + fardas finais `SKIN_FARDAS` CIPE(500)/PATAMO(750)/BOPE(1300) com escolha única (`fardaEscolhida` fecha as outras) (l.9702–9756); compra veste a foto do personagem.
  - **Itens de combate** (`ITENS_COMBATE`, 6 itens l.9602–9609): compra repetida permitida, sem estoque (decisão 172, l.9621–9623).
  - **Produtos físicos com estoque** (`ITENS_PRESENCIAIS`, 8 itens l.8868–8877): compra por quantidade gera **pedido de retirada** (`pedidoPresencial` → `PEDIDOS`, l.10757–10773) baixado pelo admin em Liberações.
  - **Gift cards:** `resgatarGift` (l.3791–3807) — lotes do admin (`GIFT_LOTES`, códigos `QG<lote>-<código>`, resgate único) ou demo `QUAD-100`/`QUAD-500`.
  - **Estornos · até 7 dias** (`renderEstornos` l.11563–11589; `estornar` l.11684–11695): devolve a moeda, avisa o admin (`ESTORNOS`) e **desfaz a posse por tipo** (`desfazerCompra`, l.11592–11683); compra **consumida** (entrega confirmada / entrada liberada) sai da janela (`compraConsumida`, l.11447–11457).
  - **Relatório de compras** (`#rcCard`): abas Semanal/Mensal/Trimestral/Semestral, KPIs e três listas (Em andamento com % do período, Aguardando retirada, Entregue) — `renderRelCompras`/`rcSituacao` (l.11469–11548). *Hoje o mesmo `#rcCard` é a **Carteira · extrato e compras** e traz também o extrato do ledger (`renderExtrato`) — ver a nota no topo desta seção.*
- **Dados e origem:** todos os catálogos são arrays JS em memória; a economia é **da conta (pessoa)**, não da turma — nenhuma estrutura vincula saldo a turma (CONFIRMADO NO CÓDIGO). Diamantes chegam por recarga do site (`addDiamante`, l.3772–3778 — `[INTEGRAÇÃO REAL] crédito do site`) ou gift card.
- **Simulado hoje:** economia completa funcional na sessão (compra, estoque, vaga, estorno, consumo).
- **Necessário no real:** pagamento, estoque, vagas, estorno financeiro e ledger de moedas no servidor; recarga de Diamantes integrada ao checkout do site.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS · DEPENDE DE SISTEMA EXTERNO (checkout do site; plataforma de cursos para a entrega dos cursos online).
- **Validações:** confirmação em toda compra; saldo por moeda; vagas por moeda; choque de agenda (bloqueante para matrícula, aviso confirmável nos demais); janela de estorno de 7 dias × consumo.
- **Possíveis erros:** saldo insuficiente (orienta recarga/gift card); ESGOTADA/LOTADO; turno ocupado → INDISPONÍVEL; estorno fora da janela ou de compra consumida é recusado.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.
- **Divergências:** comentário do código diz que nas fardas finais "pode juntar as três" (l.9690), mas `skinComprar` fecha as demais — DIVERGÊNCIA DOCUMENTAL interna (comentário × comportamento) / DECISÃO DE PRODUTO PENDENTE. O aside (l.3661) registra que a pontuação de participação foi rebatizada "Quad Coin" por decisão do gestor (14/07), divergindo da rev. 2.3 — DIVERGÊNCIA DOCUMENTAL declarada + DECISÃO DE PRODUTO PENDENTE (realinhar Anexo A).

### 4.12 `v-calendario` · Calendário + Simulado digital

- **Perfil:** aluno.
- **Identificador:** `#v-calendario` — HTML l.2099–2118; overlay do simulado digital `#simDigLayer` (HTML l.3132–3146).
- **Finalidade:** semana do aluno em três camadas + lista e histórico de simulados.
- **Acesso:** menu "+" → Calendário.
- **Dados e origem:** `renderCalendario()` (l.4595–4610): (1) aulas da semana da turma ativa (`calAulasDaTurma` sobre `CRONO`, marca HOJE); (2) marcos fixos do Quad (`CAL_BASE`, l.4569–4572 — corte de missões sábado 23h59, Pré-TAF — APENAS VISUAL); (3) eventos em que a conta se inscreveu (INSCRITO; some com `evAcabou`). Simulados: `renderSimulados` (l.6379–6406) sobre `SIMULADOS` (l.6299–6303: 2 presenciais pagos + 1 digital gratuito); histórico `renderSimHist` (l.6548–6557).
- **Ações:** digital — "Responder o simulado" → `abrirSimDig` (quiz cronometrado, runtime l.7642–7738; +10 score/acerto e QdC por acerto conforme `simRec`; realizado vai a `SIM_HIST`); presencial — "Comprar vaga na Loja" (sala lotada desativa).
- **Estado local:** `SIM_HIST`, `SIM_INSC`; hook `window.__simDig`.
- **Simulado hoje:** simulado digital com questões demo; card "Sincronizado com a plataforma" (l.2114–2117) é só texto.
- **Necessário no real:** questões extraídas do PDF real (`[INTEGRAÇÃO REAL: extração do PDF]`, l.7638–7641); sincronização com a plataforma-base.
- **Dependência técnica:** DEPENDE DO BACK-END (extração/correção) · DEPENDE DE SISTEMA EXTERNO (plataforma-base).
- **Validações:** compra de presencial exige vaga na moeda; o simulado digital corrige ao concluir ou quando o cronômetro zera.
- **Possíveis erros:** sala lotada desativa a compra; simulado realizado vai ao histórico (sem refazer).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · APENAS VISUAL (marcos fixos e selo de sincronização).

### 4.13 `v-materiais` · Materiais das aulas

- **Perfil:** aluno.
- **Identificador:** `#v-materiais` — HTML l.2121–2131.
- **Finalidade:** materiais publicados pela coordenação (slides, resumos, listas, mapas, vídeos), agrupados por matéria+assunto.
- **Acesso:** menu "+" → Materiais.
- **Ações/dados:** `renderMateriaisAluno()` (l.10353–10397) filtra `MATERIAIS` (l.10344–10350) pelas turmas com matrícula ativa (todas, não só a ativa; com 2+ matrículas cada item diz de que turma veio); tag NOVO; vídeo abre `window.open(m.link)`; **arquivo anexado baixa de verdade** via âncora `a.href = m.arqUrl; a.download` (l.10387–10391 — objectURL criado quando o admin anexa o arquivo); exemplos sem anexo dão toast.
- **Simulado hoje:** download real de blob local publicado pelo admin na mesma sessão.
- **Necessário no real:** armazenamento/CDN e publicação pela coordenação.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Estado local:** `MATERIAIS` em memória; ObjectURLs criados/revogados pelo admin.
- **Validações:** filtro pelas turmas com matrícula ativa do aluno.
- **Possíveis erros:** exemplo sem anexo → toast; estorno/remoção da turma leva os materiais dela.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 4.14 `v-pretaf` · Pré-TAF

- **Perfil:** aluno.
- **Identificador:** `#v-pretaf` — HTML l.2062–2096.
- **Finalidade:** marcas do aluno vs. metas físicas do edital + treino da semana.
- **Acesso:** **NENHUM caminho de UI** — a linha do menu "+" para Pré-TAF está bloqueada "EM BREVE" (`data-lock="Pré-TAF em planejamento…"`, l.3323–3327); a view só é alcançável por código/hook.
- **Ações/dados:** barras de metas fixas; único botão funcional `#btnTreino` ("Registrar" → ✓, +10 QdC e +5 score, l.7049–7055).
- **Estado local:** nenhum dedicado — o registro de treino credita `score`/QdC nas variáveis em memória.
- **Simulado hoje:** apenas o botão "Registrar" funciona (+10 QdC e +5 score); o restante é estático.
- **Necessário no real:** metas reais do edital e marcas do aluno persistidas — condicionado à decisão de produto sobre o Pré-TAF.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS (se o Pré-TAF virar produto).
- **Validações:** —.
- **Possíveis erros:** — (a view é inalcançável pela UI — ver Divergências).
- **Status:** APENAS VISUAL (quase tudo) · SIMULADO LOCALMENTE (registro do treino) · DECISÃO DE PRODUTO PENDENTE.
- **Divergências:** DIVERGÊNCIA DOCUMENTAL — o aside (l.3640) promete "Pré-TAF (metas do edital e treino da semana)" no menu "+", mas a linha está bloqueada.

### 4.15 Menu "+" (pop-up de navegação)

- **Perfil:** aluno.
- **Identificador:** `#btnPlus` / `#plusPop` — HTML l.3290–3329; JS l.7033–7046; badge `#plusBadge`.
- **Finalidade:** acesso às telas fora da navbar.
- **Linhas ativas:** Quadrômetro (`v-perfil`) · Calendário · Materiais · Chat de recados. **Linhas bloqueadas** (toast com `data-lock`): Chat ao vivo (EM BREVE), Guarnições·GvG/PvP (V2), Pré-TAF (EM BREVE). Quad Store e leitor de QR saíram do "+" (comentário l.3305–3307).
- **Estado local:** nenhum dedicado — o badge `#plusBadge` deriva dos recados em memória.
- **Simulado hoje:** pop-up de navegação com badges; linhas bloqueadas explicam o motivo via toast (`data-lock`).
- **Necessário no real:** navegação equivalente no app real, com o destino das áreas bloqueadas decidido (Chat ao vivo, Guarnições·GvG/PvP, Pré-TAF).
- **Dependência técnica:** DEPENDE DO FRONT-END REAL.
- **Validações:** —.
- **Possíveis erros:** linha bloqueada → toast "EM BREVE"/V2 (bloqueio intencional, não defeito).
- **Status:** CONFIRMADO NO CÓDIGO.

### 4.16 Persistência local e hooks (resumo do lado do aluno)

- **`localStorage`** (wrappers `lsGet/lsSet/lsDel`, l.3737–3739) — chaves confirmadas: `vq_device_authorized`, `vq_last_sync`, `vq_pending` (objeto `LS`, l.3736); `vq_tut_step`, `vq_tut_done`, `vq_tut_rew` (objeto `TUT_LS`, l.5697 — `vq_tut_rew` é apenas limpo no reset, nunca gravado); `vq_tut_skip`; `vq_intro_done`. **Todo o resto (moedas, matrículas, compras, mochila, avatar, blocos) vive só em memória e zera no reload.** CONFIRMADO NO CÓDIGO.
- **Hooks `window.__*`** (**31 nomes únicos**; 55 ocorrências textuais no fonte, 40 delas atribuições): `__turmaAtiva`, `__mat`, `__eventos`, `__evEstado`, `__evProf`, `__evLotar`, `__blocos`, `__noite`, `__prova`, `__simDig`, `__dominio`, `__arvoreDe`, `__avLabel`, `__avPergunta`, `__avBotao`, `__introFeita`, `__privPinta`, `__recadosProf` + `window.TR_BANK`/`AULA_DEMO`/`AVATAR_VARIANTES`. Servem às suítes Playwright de desenvolvimento, **não versionadas** no repositório. CONFIRMADO NO CÓDIGO (HIPÓTESE quanto ao conteúdo das suítes).

---

## 5. Persona PROFESSOR

Navbar `#navProfessor` (l.3591–3597): Controle · Eventos · Quiz ao vivo · Calendário · Informações. Topo próprio com `#profTopNome`, `#profTopSub` e tag `#liveTag` "AO VIVO" (l.1635–1642).

### 5.1 Gate do professor (login)

- **Perfil:** professor.
- **Identificador:** `#profGate` (HTML l.3381–3398): `#profEmail`, `#profSenha`, `#btnProfEntrar`, `#profSaidaMsg`, `#profGateNota`.
- **Finalidade:** login individual do corpo docente por e-mail funcional + senha.
- **Acesso:** abre ao trocar para a persona professor sem sessão liberada.
- **Regra de credencial:** e-mail derivado do **sobrenome**: `emailDoProf()` (l.4917–4922) remove títulos (Prof.ª/Prof./Cap./…), tira acentos e usa a última palavra do nome → `<sobrenome>@quadconcursos.com.br` (ex.: "Prof.ª Ritha Galvão" → `galvao@quadconcursos.com.br`). Senha: `d.senha` se trocada, senão `PROF_SENHA_DEMO = 'quad1234'` (l.4914). A nota do gate imprime o e-mail demo do primeiro docente ativo (`profGateNota`, l.4927–4933).
- **Ações:** `btnProfEntrar` (l.4934–4953) valida `@`, procura em `DOCENTES` (`docentePorEmail`, l.4923–4926), recusa desligado ("cadastro está desligado"), senha errada e bloqueado ("Acesso bloqueado pela coordenação"); no sucesso seta `profLiberado`/`PROF_ATUAL` e renderiza a área.
- **Dados e origem:** `DOCENTES` (l.3815–3822) — 6 docentes-semente com `materias`, `turnos`, `grad`, `fone`, `desligado`, `bloqueado`.
- **Necessário no real:** autenticação com senha individual definida no cadastro (comentário `[INTEGRAÇÃO REAL]`, l.4911–4913).
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Estado local:** `profLiberado`/`PROF_ATUAL` — memória (nada em `localStorage`).
- **Simulado hoje:** login validado contra o banco `DOCENTES` da sessão, com recusas tipadas.
- **Validações:** `@` no e-mail; docente existente (`docentePorEmail`); não desligado; não bloqueado; senha confere (l.4934–4953).
- **Possíveis erros:** "cadastro está desligado"; "Acesso bloqueado pela coordenação"; senha errada; e-mail não encontrado.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 5.2 `v-prof-painel` · Painel de controle do professor (perfil)

- **Perfil:** professor.
- **Identificador:** `#v-prof-painel` — HTML l.2134–2181: `#profFoto`, `#profPnNome/Grad/Turnos/Materias/Turmas`, foto (`#btnProfFoto`/`#profFotoFile`/`#btnProfFotoTirar`), senha (`#profSenhaAtual/Nova/Conf`, `#btnProfSenha`).
- **Finalidade:** ficha do professor logado; a UI declara: "Nome, matérias, turnos e contato vêm do Banco de professores da coordenação. A foto é você quem escolhe" (l.2150).
- **Ações:** trocar foto (`FileReader.readAsDataURL` → `d.foto`, l.4987–4995) e remover; trocar senha (valida atual, mín. 6, confirmação — l.5000–5010). **Só foto e senha são editáveis pelo próprio professor**; o resto muda apenas no Banco de professores do admin.
- **Funções:** `renderProfPainel()` (l.4959–4986), `profIniciais()` (l.4955–4958).
- **Vínculo com turmas:** o professor "está inserido" na turma quando `t.professores[matéria] === nome` (`materiasDoProf`/`turmasDoProf`, l.4903–4910); turma sem corpo docente ganha distribuição automática por matéria (`ensureProfs`, l.4889–4902).
- **Dependência técnica:** DEPENDE DO BACK-END (upload de foto e senha reais) · DEPENDE DE BANCO DE DADOS (cadastro docente).
- **Estado local:** `DOCENTES[i].foto/senha` — memória.
- **Simulado hoje:** foto vira dataURL na sessão; senha trocada passa a valer no gate imediatamente.
- **Necessário no real:** upload de foto e credencial persistidos no cadastro docente.
- **Validações:** troca de senha exige a senha atual, mínimo de 6 caracteres e confirmação igual (l.5000–5010).
- **Possíveis erros:** recusas da troca de senha (atual errada, curta demais, confirmação divergente), com aviso.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (foto e senha não persistem além da sessão).

### 5.3 `v-prof-eventos` · Aula de hoje + Eventos da semana

- **Perfil:** professor.
- **Identificador:** `#v-prof-eventos` — HTML l.2184–2194: `#profAulasHoje`, `#profEvList`.
- **Finalidade:** o dia do professor: suas aulas de hoje e os eventos em que a coordenação o escalou.
- **Ações/dados:** `profAulasDeHoje` (l.5013–5031, apenas seg–sex) varre `CRONO` das turmas dele, marcando cada tempo como "meu" por nome exato **ou** matéria (`materiaBate`, l.4285–4293); `renderProfEventos()` (l.5032–5081) pinta ENCERRADO/AGORA pelo relógio real e oferece "Abrir o quiz desta sala" (`data-ir-sala` → `abrirSala`); eventos por `eventosDoProf()` (l.4294–4296, filtro `ev.profs`), com tag "VOCÊ" e colegas listados.
- **Dependência técnica:** DEPENDE DE BANCO DE DADOS (grade real da plataforma-base).
- **Estado local:** deriva de `CRONO`, `TURMAS_LOJA` e `EVENTOS` — nada próprio.
- **Simulado hoje:** agenda e eventos reagem na hora ao que o admin edita no mesmo arquivo.
- **Necessário no real:** grade e escalação vindas da fonte real da coordenação.
- **Validações:** — (leitura derivada da grade).
- **Possíveis erros:** — (sem aulas no dia — inclusive fins de semana, l.5013–5031 — a lista fica vazia).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.
- **Divergências:** a grade-semente `CRONO` contém professores que **não existem** em `DOCENTES` (Moab Kigran, Rodrigo, John Bernam etc., l.4752–4772) — HIPÓTESE: nomes-fantasia do quadro real; DECISÃO DE PRODUTO PENDENTE unificar semente com o banco.

### 5.4 `v-prof-cal` · Calendário do professor

- **Perfil:** professor.
- **Identificador:** `#v-prof-cal` — HTML l.2197–2203: `#profCalList`.
- **Finalidade:** agenda semanal consolidada do professor: aulas por dia + eventos em que a coordenação o escalou.
- **Acesso:** aba "Calendário" da navbar do professor.
- **Ações/dados:** `renderProfCal()` (l.5084–5116) — linhas de AULA por dia da semana (HOJE destacado), ordenadas por dia×tempo, + EVENTOS não acabados como linhas douradas com data extraída de `ev.quando`.
- **Estado local:** deriva de `CRONO` e `EVENTOS` em memória — nada próprio.
- **Simulado hoje:** agenda montada sobre a semana modelo, com HOJE destacado e eventos como linhas douradas.
- **Necessário no real:** calendário real por semanas correntes, alimentado pela grade da coordenação.
- **Dependência técnica:** DEPENDE DE BANCO DE DADOS + DEPENDE DE SISTEMA EXTERNO (fonte da grade).
- **Validações:** —.
- **Possíveis erros:** —.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (semana fixa `CRONO.datas` 20–24/07 — é a semana modelo, não um calendário-calendário).

### 5.5 `v-prof-chat` · "Informações": números do professor + recados da recepção

- **Perfil:** professor.
- **Identificador:** `#v-prof-chat` — HTML l.2206–2233: abas `#profRelTabs` (mês/tri/sem/ano), `#profRelResumo/Turmas/Eventos`; card `#profRecadosCard` (`#profRecBadge`, `#profRecadosList`, `#profChatTexto`+`#btnProfChat` **desabilitados**).
- **Finalidade:** relatório de aulas/horas/eventos por período + caixa de recados da recepção (N.P.P.).
- **Dados e origem:** `PROF_PERIODOS` (l.5119–5121); `profAulasSemana()` (l.5123–5137); `renderProfRel()` (l.5138–5177): total = aulas/semana × semanas; horas estimadas pela duração real dos slots (fallback 90 min); eventos extrapolados da recorrência mensal (`evs.length * (semanas/4)`, l.5146). A UI declara "[INTEGRAÇÃO REAL] presença confirmada por chamada" (l.2220).
- **Recados:** `renderProfRecados()` (l.5197–5215) lê `RECADOS_PROF[PROF_ATUAL]`; badge de não lidas; marca lida ~800 ms após abrir a view e sincroniza "LIDA" no painel do admin.
- **Necessário no real:** números derivados de chamada/presença real; canal de resposta à recepção.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (chamada/presença).
- **Estado local:** `RECADOS_PROF` — memória.
- **Simulado hoje:** números derivados da grade da sessão; recados chegam e marcam LIDA em tempo real no painel do admin.
- **Validações:** — (números derivados; campo de resposta desabilitado).
- **Possíveis erros:** — (responder à recepção está bloqueado por desenho: "EM BREVE… V1").
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · APENAS VISUAL (responder à recepção — "EM BREVE… entra junto com as atividades online, na V1", l.2227–2231) · DECISÃO DE PRODUTO PENDENTE (V1).

### 5.6 `v-sala` · Quiz ao vivo (sala do professor)

- **Perfil:** professor.
- **Identificador:** `#v-sala` — HTML l.2236–2300: `#profTurmasCard/List`; detalhe `#salaDetail` (`#salaHead`, `#salaInfo`, `#btnSalaVoltar`); formulário `#qzTipo` (múltipla/CE), `#qzNq` (1–30), `#qzMin` (1–180), `#qzPdf` (.pdf), `#btnQuizCriar/Ativar/Encerrar`, `#qzStatus`; relatório `#qzRelCard` (`#pollBar`, `#pollCount`, `#pollSub`, `#qzRelList`).
- **Finalidade:** criar, ativar e encerrar um quiz para a sala, acompanhando placar e relatório por questão.
- **Acesso:** aba "Quiz ao vivo" → escolher turma (`renderProfTurmas`, l.5216–5230; `abrirSala`, l.5231–5239) — ou atalho da tela de Eventos.
- **Ações:** criar quiz por PDF (`btnQuizCriar`, l.5359–5371 — usa **apenas o nome do arquivo**; questões sorteadas dos bancos demo `QA_MULT` l.5248–5259 e `QA_CE` l.5260–5272 via `qzMontarQuestoes`, l.5280–5293); Refazer/Descartar; Ativar (cronômetro na sala, `#liveTag` acende, l.5349); Encerrar (relatório consolidado). Máquina de estados `criado → ativo → encerrado` em `qzSyncBotoes()` (l.5339–5358). **Um quiz por turma** (`QUIZZES = {}` mapa turmaId→quiz) — dois professores em salas diferentes não se atropelam.
- **Placar e relatório:** `pollRodar()` (l.5327–5338) simula chegada de respostas via `setInterval` 700 ms até a lotação real da turma (`pollTotal`, l.5312–5315; a última vaga é do aluno da demo se ele for da turma); `qzRelatorio()` (l.5411–5441) fica em branco até haver resposta ("nada de % inventado na aula") e distribui percentuais por hash (`qzDist`, l.5395–5410) **incorporando a resposta real do aluno da demo**.
- **Estado local:** `QUIZZES`, `SALA_ATUAL`; hooks `window.__quizAula`/`__quizzes`/`__prof`.
- **Necessário no real:** extração real das questões do PDF (marcado `[INTEGRAÇÃO REAL]`, l.5277–5279 e UI l.2282) e respostas reais da sala em tempo real.
- **Dependência técnica:** DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END.
- **Simulado hoje:** ciclo completo criar→ativar→encerrar com placar e relatório simulados na sessão.
- **Validações:** nº de questões (1–30) e duração (1–180 min) limitados pelo formulário; um quiz por turma; botões sincronizados à máquina de estados `criado → ativo → encerrado` (`qzSyncBotoes`).
- **Possíveis erros:** ações fora de ordem ficam indisponíveis (botões desabilitados); descartar/refazer zera o quiz da turma.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (banco demo, polling randômico) · APENAS VISUAL ("Feedback dos alunos — EM BREVE", l.2296–2297).

### 5.7 Queda de sessão por bloqueio/desligamento

- **Perfil:** professor (efeito de ação do admin).
- **Identificador:** mecanismo transversal (sem view própria): `checarAcessoProf()` (l.8084–8103) + mensagem `#profSaidaMsg` no `#profGate`.
- **Finalidade:** revogar imediatamente a sessão do professor quando o admin bloqueia, desliga ou apaga o cadastro.
- **Acesso:** efeito automático das ações do Banco de professores (ficha 6.3); não é acionado pelo professor.
- **Dados e origem:** flags `bloqueado`/`desligado` de `DOCENTES` — memória.
- **Funções:** `checarAcessoProf()` (l.8084–8103), chamada por `docentesMudaram()` (l.8131–8141).
- **Comportamento:** professor bloqueado/desligado/apagado com sessão aberta é derrubado na hora: encerra sessão, para o polling, fecha a sala e mostra em `#profSaidaMsg` recado cordial com tratamento por gênero ("o sr./a sra. está temporariamente afastado…", l.8097–8101); o `#profGate` reabre se a persona ativa é professor.
- **Estado local:** `profLiberado`/`PROF_ATUAL` zerados; polling do relatório interrompido.
- **Simulado hoje:** derrubada imediata dentro da sessão, com recado por gênero e reabertura do gate.
- **Necessário no real:** revogação de sessão do lado do servidor (invalidação imediata de token).
- **Dependência técnica:** DEPENDE DO BACK-END.
- **Validações:** —.
- **Possíveis erros:** a própria queda é o estado exibido — recado cordial em `#profSaidaMsg` e gate reaberto.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END (revogação de sessão real).

---

## 6. Persona ADMIN N.P.P.

Navbar `#navAdmin` (l.3598–3604): Controle · Interno · Relatórios · Liberações · Loja. Views auxiliares fora da navbar: Estrutura `v-turmas` (`#btnIrEstrutura`, l.2613/10037), Edital `v-edital` e Questões `v-questoes` (`#btnIrEdital`/`#btnIrQuestoes`, l.11870–11871).

### 6.1 Gate do administrador N.P.P.

- **Perfil:** admin.
- **Identificador:** `#admGate` (HTML l.3362–3378): `#admEmail`, `#admChave`, `#btnAdmEntrar`; nota "demo: chave NPP-2026 · no sistema real o cadastro de administrador é aprovado pela direção" (l.3376).
- **Ações:** exige e-mail contendo `@` e chave igual a `NPP-2026` (case-insensitive, l.9787–9795); sucesso seta `admLiberado = true`.
- **Necessário no real:** "a chave é emitida e revogada pela direção, por pessoa" (comentário l.9790).
- **Dependência técnica:** DEPENDE DO BACK-END.
- **Finalidade:** portão de entrada da persona admin (N.P.P.).
- **Acesso:** abre ao trocar para a persona admin sem sessão liberada.
- **Dados e origem:** chave literal no código (l.9791); nenhum banco.
- **Estado local:** `admLiberado` — memória.
- **Simulado hoje:** validação 100% no cliente.
- **Validações:** e-mail contendo `@` e chave igual a `NPP-2026` (case-insensitive, l.9787–9795).
- **Possíveis erros:** chave errada ou e-mail sem `@` recusam com aviso (qualquer e-mail com `@` passa — ver Divergências).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.
- **Divergências:** DIVERGÊNCIA DOCUMENTAL — o briefing do projeto cita "e-mail npp@quadconcursos.com.br e chave NPP-2026", mas **o código não valida o e-mail específico**: qualquer texto com `@` passa (l.9789); o e-mail é apenas placeholder do input (l.3369).

### 6.2 Atalhos de blocos ("jump chips") — componente comum das áreas do admin

- **Identificador:** `.adm-jump .jp[data-jump]` em `#jumpControle` (l.2400), `#jumpInterno` (l.2614), `#jumpLiber` (l.2872), `#jumpLojaAdm` (l.3053); blocos marcados com `data-bl`.
- **Comportamento:** cada área "nasce limpa" (só atalhos); um chip mostra só aquele bloco; "Ver todos" mostra tudo (`admJumpAplica/admJumpRestaura`, l.8577–8607). Hooks `window.__admBlocos` e `window.__admTudo` (padrão "tudo aberto", l.8576).
- **Status:** CONFIRMADO NO CÓDIGO. Observação: os blocos Cronograma e Materiais da aula dividem o mesmo `data-bl="crono"` (l.2639 e 2660); o bloco `quests` (l.2851) não tem chip próprio em `#jumpInterno`.

### 6.3 `v-adm-controle` · Controle (governança das contas)

**Identificador:** `#v-adm-controle` — HTML l.2390–2600. Cabeçalho "N.P.P. · governança das contas". Painéis internos (mini-fichas):

**(doc) Banco de professores** (l.2413–2445 — `#admDocNome`, `#admDocMat1..3`, `#admDocTurnos`, `#admDocGrad`, `#admDocFone`, `#btnAdmDoc`, `#admDocList`)
- Cadastro (l.8208–8244): valida nome, homônimo, ≥1 matéria, ≥1 turno; alerta informa o e-mail de acesso e a senha inicial `quad1234`. Edição com **propagação de rename** (`renomearDocente`, l.8159–8206: propaga para `TURMAS_LOJA[].professores`, `ISOLADAS[].prof`, `EVENTOS[].profs`, `CRONO`, `RECADOS_PROF`). Desligar/Readmitir, Bloquear/Liberar (derruba sessão — ficha 5.7), Apagar com confirmação em 2 toques (l.8070–8130). Sincronização geral por `docentesMudaram()`.
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DE BANCO DE DADOS. **DECISÃO TÉCNICA PENDENTE:** o **nome é a chave primária** do docente (comentário do próprio código, l.8142–8146) — não sobrevive a homônimos num sistema real.

**(salas) Salas e estúdio · mapa de ocupação** (l.2447–2451 — `#admSalasMapa`)
- `SALAS` (4 salas) + `SALA_CAP` = {155, 85, 125, 185} (l.8920–8922) + `ESTUDIO` (l.8928, reservado a gravações/eventos online). `salaOcupacoes()` (l.8942–8969) unifica turmas, isoladas, eventos e simulados presenciais; `salaConflito()` (l.8971–8980) detecta choque (mesma sala + dia + horários e períodos cruzados); `salaEcoHTML()` (l.9002–9015) é o "eco" reutilizado pelos seletores de sala de turma/evento/simulado.
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DE BANCO DE DADOS (lotação real).

**(turmas) Criação de turmas e isoladas** (l.2453–2518 — `#admCtTipo/Apelido/Conc/Sala/Dias/IsoProf/Ini/Fim/H1i/H1f/H2f/PrecoDmn/PrecoQdc/Vagas/VagasQdc/Arvore/Profs`, `#btnAdmCtAbrir`, `#admCtLista`)
- Tipos de `MODALIDADES` (l.4134–4138: nivelamento/RONDESP 70/30, regular/PATAMO 50/50, questões/BOPE 20/80) + isoladas. Turno **derivado do horário** (`turnoDoHorario`, l.4141–4145). **Vagas por moeda** (Dmn e QdC, total = soma). Validações (l.8450–8528): campos obrigatórios com marcação vermelha, tempos coerentes, **vagas ≤ lotação da sala** e **choque de sala**. Professores por matéria vêm da árvore do concurso (anexar PDF só troca a legenda — `[INTEGRAÇÃO REAL] leitura do PDF`, l.7961–7965). Lista viva com Editar (`__ctEditar`/`__isoEditar`, l.8411–8445) e remover (`removerTurma`, l.7894–7915 — **recusa** se houver matrícula ativa: "estorne antes de remover"). Abertura propaga para Loja, Cronograma, Relatórios, Liberações, preços e mapa de salas (l.8541–8563).
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END (parse de PDF; persistência) · DEPENDE DE BANCO DE DADOS.

**(credito) Crédito manual de moedas** (l.2520–2541 — `#admCredAluno/Moeda/Valor/Motivo`, `#btnAdmCred`, `#admCredList`)
- Crédito na conta da demo cai na hora na carteira (`addDiamante`/`addScore`); contas-semente só geram toast; log em `CREDITOS` (l.9857–9874).
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END (ledger real).

**(contas) Bloquear/desbloquear contas** (l.2543–2547 — `#admContasList`)
- `alternarBloqueio()` (l.9877–9906): bloquear a conta da demo derruba a sessão do aluno em ~400 ms e abre `#bloqLayer`.
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END.

**(msg) Comunicação interna · mensagens** (l.2549–2572 — `#admMsgTipo` com 7 públicos: aluno, prof, turma, isolada, simulado, evento, todos; `#admMsgAluno`, `#admMsgTexto`, `#btnAdmMsg`, `#admMsgList`)
- Alvos dinâmicos (`admMsgSelects`, l.9821–9849); `msgPublico()` (l.9950–9978) resolve alcance (inscritos reais quando existem, senão semente por hash; "todos" = 1.286 fixo). Público → chat do aluno com prefixo `[<Público>]`; professor → `RECADOS_PROF`; um aluno → `RECADOS`. Status ENVIADA→LIDA sincronizado quando o destinatário abre o chat.
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END (mensageria/push).

**(gift) Gift cards · lotes com QR** (l.2574–2591 — `#admGiftQtd/Valor/Moeda`, `#btnAdmGift`, `#admGiftLotes`, `#admGiftQRs`)
- Lotes `G<n>` com códigos `QG<lote>-<base36><i>` e resgate único (l.10096–10112); QRs **ilustrativos** desenhados por `qrSvg` (l.10041–10063). UI: "A arte final dos QR para impressão é [INTEGRAÇÃO REAL]" (l.2590).
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO FRONT-END REAL + DEPENDE DE SISTEMA EXTERNO (QR/câmera) · DEPENDE DO BACK-END (validação central).

**(estornos) Estornos e desistências** (l.2593–2599 — `#admEstList`, `#admEstTop`)
- Visão em tempo real dos estornos feitos pelo aluno na Loja + ranking "Itens mais estornados" (`renderAdmEstornos`, l.10125–10141).
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END (estorno financeiro).

### 6.4 `v-adm-hoje` · Interno (operação do dia)

**Identificador:** `#v-adm-hoje` — HTML l.2603–2858. Painéis internos:

**(avisos) Avisos gerais** (l.2624–2637 — `#admAvTitulo/Det/Esc`, `#btnAdmAviso`, `#admAvisosList`)
- Publica em `AVISOS` com alvo por **id de turma** (comentário l.10147–10148: antes era texto e "turma de nome novo nunca casava"); aluno vê só os da turma ativa; admin vê todos, com Editar e Remover (l.10203–10229).
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END.

**(crono) Cronograma semanal** (l.2639–2657 — `#admCrTurma/Dia/Tempo/Mat/Prof`, `#btnAdmCrono`, `#admCrLog`)
- Atualiza `CRONO.turmas[id].aulas[dia][tempo]` e grava o corpo docente da turma (`tur.professores[m] = pr` — **fonte única**, l.10311–10330); registra em `CRONO_LOG` e re-renderiza na hora a "Aula de hoje" do aluno e a agenda do professor. Seletores encadeados: matérias da árvore do edital da turma (`materiasDaTurma`, l.10238–10244), só docentes da matéria (`admCronoProfs`, l.10245–10256), rótulos de tempo pelo horário real da turma (`admCronoPrefill`, l.10264–10287).
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DE BANCO DE DADOS (grade real; a fonte declarada é a planilha da coordenação → DEPENDE DE SISTEMA EXTERNO).

**(crono) Materiais da aula** (l.2660–2694 — `#admMatTurma/Materia/Assunto/Tipo/Titulo/Arq/Link/Dur`, `#btnAdmMat`, `#admMatList`)
- Publica em `MATERIAIS` etiquetado turma+matéria+assunto; **arquivo anexado baixa de verdade no aluno** via `URL.createObjectURL` (l.10479); ✕ revoga o ObjectURL (l.10431–10439); remover a turma remove os materiais dela.
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (arquivo vive só na sessão) · DEPENDE DO BACK-END (armazenamento/CDN).

**(eventos) Eventos da semana** (l.2696–2757 — criação `#admEvNovo*`, chips `#admEvProfs`, sala `#admEvSala`, `#btnAdmEvNovo`; regras `#admEvSel/Tipo/Regra/Valor`; lista `#admEvList`)
- Criação (l.10672–10753): **presencial reserva uma das 4 salas; online reserva o Estúdio**; **a lotação herda a da sala** (`lot: online ? 0 : salaCap(evSala)`, l.10729); gratuito entra no carrossel; pago vai à Loja (QdC ou Dmn). Edição preserva inscritos; cancelamento (✕ → `cancelarEvento`, l.10544–10559) limpa carrossel/Loja/calendários, libera sala e **remove o grupo da portaria** (`delete ACESSO_ST[id]`). Regras de score/Coins por evento (l.10560–10570) publicadas na página do evento do aluno.
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO BACK-END (eventos/vendas) · DEPENDE DE SISTEMA EXTERNO (link de transmissão).

**(simulados) Lançamento de simulados** (l.2759–2819 — `#admSimNome/Modal/Tipo`, bloco presencial `#admSimData/Ini/Fim/Sala`, bloco digital `#admSimPdf/Dia/Min/Nq`, preços/vagas, `#admSimValor`, `#btnAdmSimLancar`, `#admSimList`)
- Presencial: **sempre vendido**, vagas por moeda com validação **vagas ≤ salaCap** e choque de sala (l.11159–11225). Digital: sem limite de vagas nem trava de choque; PDF obrigatório (vira quiz cronometrado — `[INTEGRAÇÃO REAL] extração do PDF`, l.2819); gratuito premia QdC por acerto (`#admSimValor`, padrão 2).
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END (extração do PDF; correção real).

**(skins) Skins e itens de combate + (quests) Quests** (l.2822–2858 — `#admSkTipo/Nome/Desc/Moeda/Preco`, paleta `#admSkIcones`, `#btnAdmSkin`, `#admSkinList`; `#btnAdmQuests`)
- Skin publica em `LOJA_EXTRAS` (QdC ou Dmn); item de combate em `ITENS_COMBATE` (**sempre QdC**, l.9554); nomes duplicados recusados em toda a Loja; remover item de combate tira das mochilas (l.9513–9515). **Skins criadas pelo admin não vestem o boneco** (comentário l.9486–9487: "Aplicação no boneco é da V1"). Quests: toast "Próxima implementação" (l.9580–9582).
- Status: CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE · Quests: APENAS VISUAL · DECISÃO DE PRODUTO PENDENTE.

### 6.5 `v-adm-alunos` · Relatórios

- **Perfil:** admin.
- **Identificador:** `#v-adm-alunos` — HTML l.2904–3040; abas `#relTabs` (ind | turma | geral | loja) com painéis `.rel-panel`; render ao entrar na aba (l.11299–11300) e `renderRelatorios()` (l.11840–11842).
- **Aba Individuais:** `relDadosAluno()` (l.11738–11759) — logins/semana **sintéticos por hash do nome**; compras da conta da demo são as reais (`COMPRAS`); donut QdC×Dmn (`relDonut`); pedagógico = árvore de Domínio viva com deslocamento por aluno (`relComputeDif`, l.11236–11258). "Reclamações e atendimentos": EM BREVE.
- **Aba Turmas:** seletor vivo (`relTurmasInit`, l.11795–11801); dificuldades por sub-assunto/assunto/matéria da árvore do edital da turma (o Treinamento Rápido do aluno move os números via `trAj`); "Alunos que precisam de apoio" (`renderDificuldades`, l.11259–11278) mistura o aluno real com 3 seeds; **Acionar** → `acionarApoio()` (l.11281–11298) navega ao bloco de mensagens com texto sugerido pronto. "Presença nas aulas" e "Feedbacks da turma": EM BREVE. Pedagógico por turma: `renderRelPedagTurmas()` (l.11783–11793), um bloco por turma aberta.
- **Aba Gerais:** tabela "Perfil médio da base" **fixa no HTML** (412 alunos etc., l.2995–3000); "Dificuldade pedagógica" = árvore viva (`renderRelGeral`, l.11809–11812); "Satisfação geral": EM BREVE.
- **Aba Loja:** vendas por semana e fluxo entra×sai fixos (l.11820–11837); "Mais vendidos" fixo (`REL_LOJA_TOP`); donut de faturamento = base fixa (18.600/9.400) + compras vivas; "Compradores" = `COMPRAS` real (`renderCompras`, l.11702–11713).
- **Necessário no real:** telemetria de uso, presença e vendas de dados reais (relatórios/inteligência de dados do ecossistema).
- **Dependência técnica:** DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END.
- **Estado local:** mistura declarada de dados vivos (`COMPRAS`, Domínio, turmas) com sementes estáveis por hash — memória.
- **Simulado hoje:** abas re-renderizadas ao entrar; "Acionar" navega ao bloco de mensagens com texto sugerido.
- **Validações:** — (leitura/abas).
- **Possíveis erros:** — (blocos EM BREVE respondem com toast).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (mistura declarada de dado vivo + semente estável) · APENAS VISUAL (blocos EM BREVE e tabelas fixas).

### 6.6 `v-adm-liber` · Liberações (recepção e portaria)

- **Perfil:** admin.
- **Identificador:** `#v-adm-liber` — HTML l.2862–2901; blocos `fisicos`, `acessos`, `inscritos`.
- **(fisicos) Produtos físicos** (`#admPedidosList`): `PEDIDOS` (l.10757–10763); `renderPedidos()` (l.10774–10800) — "Confirmar entrega" marca `entregue` e **consome a compra** (`compraConsumida('pres', presId)`, l.10789 — sai da janela de estorno). **DIVERGÊNCIA DOCUMENTAL (texto da própria UI × código):** o parágrafo l.2883 diz "o item volta ao estoque da Loja" na entrega, mas o código **não devolve estoque** na entrega (estoque decresce na compra l.9266 e só volta em estorno l.11656).
- **(acessos) Autorizações de acesso** (`#admAcessos` + simulados `#admSpLista`): `ACESSO_ST` (l.10820) sincronizada com os eventos reais — um grupo de portaria para **todo evento presencial vigente** (`acessosGrupos`, l.10834–10840; online não passa na portaria); `acessoListaDe(ev)` (l.10821–10833) semeia 2–5 inscritos por hash e insere/remove o aluno da demo conforme a compra/inscrição dele; "Liberar entrada" (l.10859–10875) consome a compra do aluno da demo. Simulados presenciais têm recepção própria (`SIM_INSC`/`renderSimPres`, l.10993–11014); `liberarInscrito()` (l.11015–11042) libera, **pontua score** (e QdC quando o simulado premia), move ao histórico do aluno e consome.
- **(inscritos) Inscritos por atividade** (`#admAtivSel`, `#admAtivInscritos`, `#btnAtivPdf`): banco `ativBank()` (l.10899–10910) = `ATIVIDADES` fixas (l.10879–10885) **+ todas as turmas e eventos vivos**; "Gerar lista de conferência (PDF)" = `ativListaPdf()` (l.10943–10968) abre janela com folha limpa (nome de guerra + coluna de presença) e chama `window.print()` — o "PDF" sai pelo Salvar como PDF do navegador.
- **Necessário no real:** check-in de portaria, baixa de entrega e listas de presença integrados ao cadastro/matrículas.
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Estado local:** `PEDIDOS`, `ACESSO_ST`, `SIM_INSC` — memória.
- **Simulado hoje:** listas sincronizadas com compras/inscrições da sessão; liberação/entrega consome a compra na hora.
- **Validações:** liberar entrada/entrega exige inscrito/pedido pendente; evento online não passa na portaria.
- **Possíveis erros:** já liberado/entregue não repete (o estado muda e a ação some); sem eventos vigentes, listas vazias.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE (nomes por semente `inscNome`, l.10805–10808). DECISÃO TÉCNICA PENDENTE: PDF via `window.print()` se o produto exigir PDF servidor. DECISÃO DE PRODUTO PENDENTE: `ATIVIDADES` fixas duplicam conceitualmente eventos vivos (ex.: "Aulão de véspera RONDESP" aparece como atividade fixa com 73 inscritos-semente e como evento com contagem real).

### 6.7 `v-adm-loja` · Loja (governança de catálogo e preços)

- **Perfil:** admin.
- **Identificador:** `#v-adm-loja` — HTML l.3043–3115; blocos `cadastro`, `precos`, `precoturmas`.
- **(cadastro) Produto/serviço:** destinos `PROD_DESTINOS` (l.8836–8843): módulos/excursão/TAF/outros (presenciais com estoque; excursão e TAF com data) e cursos online/mentoria (mentoria com período — "é como uma turma online", l.9354). Publicação (l.9403–9465) valida tudo, recusa nome duplicado em toda a Loja, entra na hora na vitrine do aluno; item com data, comprado, vira evento no carrossel/calendário (`agendaDoProduto`, l.9373–9392). Editar no lugar (l.9325–9343); ✕ remove. **Turmas/isoladas/simulados/eventos/skins não nascem aqui** (cada um no seu bloco — texto l.3098).
- **(precos) Preços da Loja** (`#admPrecosList`, `#btnAdmPrecos`): edita qualquer item da vitrine (inclusive skins) e aplica na hora no DOM da Loja do aluno + nos dados (l.11405–11433). **DECISÃO TÉCNICA PENDENTE:** a lista é **raspada do DOM** (`document.querySelectorAll('.loja-item...')`, l.11303–11312) — funciona no protótipo, não é modelo para o sistema real.
- **(precoturmas) Preços e vagas · turmas, isoladas e simulados** (`#admPrecoTurmas`, `#btnAdmPrecoTurma`): 4 campos por turma (preço Dmn/QdC + vagas restantes por moeda); aplicar grava **sem apagar/relançar** (matriculados continuam; "a sala cresce se a administração abrir mais vagas", l.11389–11392) e sincroniza Quad Store e listas (l.11314–11404).
- **Dependência técnica:** DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS (catálogo/preço reais).
- **Estado local:** `LOJA_EXTRAS`, `ITENS_PRESENCIAIS`, `TURMAS_LOJA`, preços no DOM — memória.
- **Simulado hoje:** publicação/edição refletem na hora na vitrine do aluno.
- **Necessário no real:** catálogo e preços governados por back-end (nunca raspados do DOM).
- **Validações:** campos obrigatórios; nome duplicado recusado em toda a Loja; data exigida em excursão/TAF; período exigido na mentoria.
- **Possíveis erros:** recusas de validação com aviso; ✕ remove o item da vitrine.
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 6.8 `v-turmas` · Estrutura: concursos, editais, modalidades, turmas

- **Perfil:** admin.
- **Identificador:** `#v-turmas` — HTML l.2303–2329: `#admConcList`, `#admModList`, `#admTurmaList`, `#btnEstrIrCriarTurma`, `#btnIrEdital`, `#btnIrQuestoes`.
- **Finalidade:** raiz pedagógica: concursos com árvores de edital, situação (aberto/proposta/reta-final), modalidades e lista viva de turmas.
- **Ações/dados:** `CONCURSOS` (l.4122–4129: cfo, sdba, sdfront, ppba, pcba, prf), cada um com árvore (`EDITAL_CFO/SOLDADO/PPBA/PCBA/PRF`) e `situacao` editável; `renderConcursos()` (l.7860–7875) mostra contagem "X matérias · Y assuntos · Z sub-assuntos" e botão **"Definir Domínio"** → `definirDominio()` redesenha o Domínio do aluno e os Relatórios. `renderModalidades()` (l.7876–7886); `renderTurmasAdm()` (l.7916–7928) com ✕ remover (mesma trava de matrícula ativa).
- **Necessário no real:** upload e parse do edital real ("Lançar um edital novo é [INTEGRAÇÃO REAL] upload do edital", l.2307).
- **Dependência técnica:** DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END · DEPENDE DE BANCO DE DADOS.
- **Estado local:** `CONCURSOS`, `MODALIDADES`, `TURMAS_LOJA` — memória.
- **Simulado hoje:** árvores vivas; "Definir Domínio" redesenha o Domínio do aluno e os Relatórios na hora.
- **Validações:** remoção de turma recusada quando há matrícula ativa ("estorne antes de remover", `removerTurma` l.7894–7915).
- **Possíveis erros:** recusa de remoção com aviso; "Lançar um edital novo" é `[INTEGRAÇÃO REAL]` (sem mecânica).
- **Status:** CONFIRMADO NO CÓDIGO · SIMULADO LOCALMENTE.

### 6.9 `v-edital` · Árvore de conteúdo (tela de demonstração)

- **Perfil:** admin.
- **Identificador:** `#v-edital` — HTML l.2332–2367.
- **Comportamento:** árvore PC-BA **estática no HTML**; `#btnLancarEdital` só dispara toast (l.8632); `#btnReconciliar` alterna a visibilidade do card fixo `#reconCard` (SAIU/ENTROU/recalcula %) (l.8633–8636). Nenhum dado muda.
- **Finalidade:** demonstrar o futuro lançamento/reconciliação de edital.
- **Acesso:** botão `#btnIrEdital` a partir da Estrutura.
- **Dados e origem:** árvore PC-BA fixa no HTML.
- **Estado local:** nenhum (nada muda).
- **Simulado hoje:** apenas alternância de visibilidade do card fixo de reconciliação.
- **Necessário no real:** upload/parse do edital e reconciliação real (SAIU/ENTROU, recálculo).
- **Validações:** —.
- **Possíveis erros:** — (botões só disparam toast).
- **Status:** APENAS VISUAL · DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS (reconciliação real de edital). **Não confundir** com as árvores vivas de `CONCURSOS` (ficha 6.8), que são funcionais.

### 6.10 `v-questoes` · Banco de questões (tela de demonstração)

- **Perfil:** admin.
- **Identificador:** `#v-questoes` — HTML l.2370–2387.
- **Comportamento:** tabela fixa de 3 questões com tags; `#btnNovaQuestao` só dispara toast (l.8637).
- **Finalidade:** demonstrar o futuro banco central de questões.
- **Acesso:** botão `#btnIrQuestoes` a partir da Estrutura.
- **Dados e origem:** tabela fixa de 3 questões no HTML.
- **Estado local:** nenhum (nada muda).
- **Simulado hoje:** nada — tela de demonstração.
- **Necessário no real:** CRUD real de questões com tags e vínculo à árvore do edital.
- **Validações:** —.
- **Possíveis erros:** — (`#btnNovaQuestao` só dispara toast).
- **Status:** APENAS VISUAL · DEPENDE DE BANCO DE DADOS (banco central de questões do ecossistema) · DECISÃO DE PRODUTO PENDENTE (cadastro/edição ao vivo descritos no card, sem mecânica).

---

## 7. Divergências e pendências consolidadas deste catálogo

| # | Tipo | Onde | Descrição |
|---|---|---|---|
| 1 | DIVERGÊNCIA DOCUMENTAL | Gate N.P.P. (6.1) | Briefing cita e-mail `npp@quadconcursos.com.br` como credencial; o código valida só a chave `NPP-2026` (l.9789–9791) — e-mail livre |
| 2 | DIVERGÊNCIA DOCUMENTAL (texto da própria UI) | Liberações (6.6) | "O item volta ao estoque da Loja" na entrega (l.2883) não acontece no código; estoque só volta no estorno (l.11656) |
| 3 | DIVERGÊNCIA DOCUMENTAL | Login do aluno (3.2) | Aside descreve fluxo antigo por cenários/código de e-mail; código morto `scenario`/`CODE_OK` sobrevive (l.3732–3734) |
| 4 | DIVERGÊNCIA DOCUMENTAL | Conectividade (3.8) | Alternador `#connToggle` referenciado no JS (l.5604, 5616) não existe no HTML — modo offline inatingível pela UI |
| 5 | DIVERGÊNCIA DOCUMENTAL | Pré-TAF (4.14) | Aside promete Pré-TAF no menu "+" (l.3640); a linha está bloqueada "EM BREVE" — sem caminho de UI até `v-pretaf` |
| 6 | DIVERGÊNCIA DOCUMENTAL interna | Loja/skins (4.11) | Comentário "pode juntar as três" fardas (l.9690) × código que fecha as demais (`fardaEscolhida`) |
| 7 | DIVERGÊNCIA DOCUMENTAL declarada | Economia (4.11) | Rebatismo "Quad Coin" (decisão do gestor 14/07) diverge da rev. 2.3 ("Score não é moeda") — realinhar Anexo A |
| 8 | DECISÃO TÉCNICA PENDENTE | Banco de professores (6.3) | Nome do docente como chave primária (l.8142–8146) |
| 9 | DECISÃO TÉCNICA PENDENTE | Loja do admin (6.7) | Lista de preços raspada do DOM (l.11303–11312) |
| 10 | DECISÃO TÉCNICA PENDENTE | Liberações (6.6) | "PDF" da lista de conferência via `window.print()` (l.10963–10966) |
| 11 | DECISÃO DE PRODUTO PENDENTE | Professor/grade (5.3) | Grade-semente `CRONO` usa professores fora do banco `DOCENTES`; `ATIVIDADES` fixas duplicam eventos vivos (6.6) |
| 12 | APENAS VISUAL declarados ("EM BREVE") | Diversos | Resposta do professor à recepção (5.5); feedback dos alunos no quiz (5.6); Quests (4.10/6.4); reclamações, presença, feedbacks e NPS nos Relatórios (6.5); `v-edital` e `v-questoes` inteiras (6.9/6.10); tutoriais da central de ajuda (3.7) |

**Vestigiais confirmados (nenhum fluxo os aciona):** `#quizLayer`/`QUESTIONS` (4.5), `#daniloPop` com vídeo (3.7), `#gateVerify` (3.2), variáveis `scenario`/`CODE_OK` (3.2). HIPÓTESE: sobras de rodadas anteriores mantidas para reaproveitamento.
