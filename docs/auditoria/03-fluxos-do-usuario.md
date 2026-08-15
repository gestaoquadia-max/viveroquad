# 03 · Fluxos do usuário — ponta a ponta

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

---

## Como ler este documento

- Cada fluxo é descrito ponta a ponta com: **ator**, **ponto de início**, **etapas numeradas** (as ações estão nas etapas), **telas envolvidas**, **dados necessários**, **comportamento atual (simulado)**, **resultado esperado**, **persistência necessária na aplicação real**, **validações**, **possíveis erros**, **sistemas futuros envolvidos** e **decisões pendentes**.
- Toda linha citada refere-se a `/home/user/viveroquad/src.html` (~11.920 linhas) e é aproximada (±3). Ids de tela seguem o padrão `#v-*`; overlays são camadas (`#...Layer`).
- **Formato das variantes (declaração de consolidação):** os fluxos com variantes — **F13-a..d** (quatro variantes de compra) e **F19-a..c** (três operações administrativas) — usam formato comprimido deliberado: o trilho/entrada comum é descrito uma única vez na abertura do fluxo e cada variante traz cabeçalho reduzido + etapas numeradas. Em F13, "Validações" e "Possíveis erros" aparecem fundidos como **"Validações/erros"** por variante; em F19, validações e erros estão embutidos nas etapas numeradas. Nos dois fluxos, "Comportamento atual (simulado)" e "Resultado esperado" estão absorvidos pelas etapas + linha de **Classificação** de cada variante, e "Persistência necessária" e "Sistemas futuros" são **consolidados ao fim do fluxo** (valem para todas as variantes). Nenhuma variante deixa de estar coberta — é consolidação para evitar repetição.
- Vocabulário de classificação (usado exatamente assim): CONFIRMADO NO CÓDIGO · APENAS VISUAL · SIMULADO LOCALMENTE · DEPENDE DO FRONT-END REAL · DEPENDE DO BACK-END · DEPENDE DE BANCO DE DADOS · DEPENDE DE SISTEMA EXTERNO · HIPÓTESE · DECISÃO DE PRODUTO PENDENTE · DECISÃO TÉCNICA PENDENTE · DIVERGÊNCIA DOCUMENTAL.
- Regra geral do protótipo: **todo o estado vive em memória JS** (arrays/objetos) mais um punhado de chaves de `localStorage` (`vq_tut_skip`, `vq_tut_done`, `vq_tut_step`, `vq_intro_done`, `vq_device_authorized`, `vq_last_sync`, `vq_pending`). Recarregar a página zera moedas, matrículas, compras e carreira. Portanto, **todo fluxo abaixo é, no mínimo, SIMULADO LOCALMENTE** — a classificação de cada fluxo indica qual sistema real deve assumi-lo.

### Sumário dos fluxos

| # | Fluxo | Ator principal |
|---|---|---|
| F01 | Login do aluno | Aluno |
| F02 | Criação de conta pelo site | Aluno (visitante) |
| F03 | Tutorial — Instrução do QUAD | Aluno (1º acesso) |
| F04 | Escolha de identidade (avatar + nome de guerra) | Aluno |
| F05 | Acesso condicionado à matrícula (trava e destrava) | Aluno / sistema |
| F06 | Troca de turma ativa | Aluno |
| F07 | Aula de hoje | Aluno (+ admin no cronograma) |
| F08 | Missão — bloco do dia e bloco da noite | Aluno |
| F09 | Resolução de questão (motores de questão) | Aluno |
| F10 | Quiz ao vivo (professor + aluno) | Professor e Aluno |
| F11 | Simulado (lançamento → compra → presença → liberação) | Admin, Aluno, Recepção |
| F12 | Promoção de patente | Aluno |
| F13 | Compra na Loja (turma · item · produto físico · evento) | Aluno |
| F14 | Estorno (e consumo que mata o estorno) | Aluno / Recepção |
| F15 | Participação em evento (compra → portaria → entrada) | Aluno / Recepção |
| F16 | Liberações pela recepção (entregas, portaria, listas) | Admin/Recepção |
| F17 | Materiais (admin anexa → aluno baixa) | Admin e Aluno |
| F18 | Login do professor | Professor |
| F19 | Operação administrativa típica (criar turma · criar evento · mensagem por público) | Administrador N.P.P. |

---

## F01 · Login do aluno

| Campo | Descrição |
|---|---|
| **Ator** | Aluno com conta (na visão do produto, criada no site — ver F02) |
| **Ponto de início** | Abertura do protótipo com a persona "aluno"; camada `#loginLayer` sobre o app (HTML l.3562–3579) |
| **Telas envolvidas** | `#loginLayer` (e-mail `#loginEmail`, senha `#loginSenha`, `#btnAcessar`, link `#btnCriarConta`) → vinheta `#splashLayer` com `#splashVerify` (HTML l.3331–3337) → Início `#v-inicio` |
| **Dados necessários** | E-mail e senha; estado de conexão (`online`, l.3730); situação da conta (`contaDe('eu').bloqueada`); matrículas (`MATRICULAS`, l.3850) |
| **Ações principais (código)** | `acessarPortal()` (l.5633–5654) → `entrarApp(runTour)` (l.5674–5687) → `playSplash` (l.5552–5567) → `checarMatricula()` (l.3900–3903) |

**Etapas**

1. O aluno digita e-mail e senha e toca **Acessar** (`#btnAcessar`).
2. `acessarPortal()` valida a presença de `@` no e-mail e senha não vazia; exige estado `online`; checa se a conta está bloqueada (bloqueada → abre `#bloqLayer` e o fluxo para).
3. O e-mail é gravado em `#contaEmail` (perfil) e na linha de telemetria; `entrarApp(primeiro)` é chamado com `primeiro = lsGet('vq_tut_skip') !== '1'` (l.5650).
4. A vinheta roda com o texto "Verificando a matrícula de \<e-mail\>…" (`#splashVerify`) — **nenhum servidor é consultado**; a verificação é encenada dentro da vinheta (dec. 57, "login em UMA tela").
5. Ao fim da vinheta: `checarMatricula()` (trava o app se não houver matrícula ativa — ver F05), aceno do mascote (`daniloWave`) e, se 1º acesso, `iniciarTutorial()` (ver F03).

**Comportamento atual (simulado):** **qualquer e-mail com `@` + qualquer senha entram** — não há verificação de credencial; comentário explícito no código: `[INTEGRAÇÃO REAL] validar no servidor` (l.5629–5632). SIMULADO LOCALMENTE.

**Resultado esperado (produto):** autenticar contra o cadastro geral, confirmar matrícula ativa e abrir o app já na turma ativa do aluno.

**Persistência necessária na aplicação real:** sessão/token de autenticação; vínculo conta↔matrículas; dispositivo autorizado (hoje `vq_device_authorized`/`vq_last_sync` são gravados localmente sem uso real, l.5674–5687).

**Validações (no protótipo):** e-mail com `@`; senha não vazia; `online`; conta não bloqueada.

**Possíveis erros:** offline → login negado (l.5638); conta bloqueada → pop-up `#bloqLayer` "Conta bloqueada — procure a administração" (HTML l.3464–3472); sem matrícula ativa → app trava (F05).

**Sistemas futuros envolvidos:** autenticação/autorização · cadastro geral de usuários/alunos · matrículas · financeiro (status de pagamento).

**Decisões pendentes / divergências:**
- DIVERGÊNCIA DOCUMENTAL — o aside da demo (l.3645–3654) ainda descreve um fluxo antigo por cenários de e-mail (`aluno@quad.com` etc.) e código `123456`; as variáveis `scenario`/`CODE_OK` (l.3732–3734) sobrevivem como código morto, mas o fluxo vigente é e-mail+senha diretos.
- DECISÃO TÉCNICA PENDENTE — contrato de validação servidor (marcado `[INTEGRAÇÃO REAL]` no fonte).
- Classificação do fluxo: SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.

---

## F02 · Criação de conta pelo site

| Campo | Descrição |
|---|---|
| **Ator** | Visitante/aluno novo |
| **Ponto de início** | Link "Criar conta" (`#btnCriarConta`) na tela de login |
| **Telas envolvidas** | `#loginLayer` → passo `#gateCriar` (HTML l.3351–3358) → (na visão de produto) checkout do site do Quad |
| **Dados necessários** | Nenhum no app — a conta nasce **no checkout do site**, junto com a matrícula (regra RN-01, dec. 21) |
| **Ações principais (código)** | `abrirGate('gateCriar')` (l.5660–5663); `#btnIrCheckout` (l.5664–5667); `#btnCriarVoltar` |

**Etapas**

1. O aluno toca "Criar conta" no login.
2. A tela `#gateCriar` explica que a conta é criada no checkout do site, junto com a matrícula.
3. O botão "Ir para o checkout" (`#btnIrCheckout`) exibe apenas o toast "Redirecionando para o cadastro no site… (demo)" — comentário `[INTEGRAÇÃO REAL] abrir o checkout do site`.
4. "Voltar" retorna ao login. (No produto: o aluno compraria a matrícula no site, receberia as credenciais e voltaria ao F01.)

**Comportamento atual (simulado):** APENAS VISUAL — nada é criado; não há formulário de cadastro no app (decisão de produto: o app não é dono do cadastro).

**Resultado esperado (produto):** redirecionamento real ao checkout; conta + matrícula criadas no cadastro geral; retorno ao app com credenciais válidas.

**Persistência necessária na aplicação real:** conta no cadastro geral; matrícula no sistema de matrículas; transação no financeiro.

**Validações / possíveis erros:** nenhum no protótipo (não há campos). No produto: falha de pagamento, e-mail já cadastrado, matrícula não confirmada — tudo fora do app.

**Sistemas futuros envolvidos:** site principal e checkout do Quad Concursos · cadastro geral de usuários/alunos · matrículas · financeiro/pagamentos.

**Decisões pendentes:** DECISÃO TÉCNICA PENDENTE — contrato app↔site (deep link de retorno, criação de sessão pós-checkout). Observação: o passo `#gateVerify` (loader, HTML l.3343–3349) existe mas é parcialmente vestigial — a verificação atual acontece dentro da vinheta (l.5646–5647).

---

## F03 · Tutorial — Instrução do QUAD (1º acesso)

| Campo | Descrição |
|---|---|
| **Ator** | Aluno em 1º acesso (ou que nunca pulou: roda em TODO acesso enquanto `vq_tut_skip !== '1'`, l.5648–5650) |
| **Ponto de início** | Fim da vinheta de login, via `iniciarTutorial()` (l.6954–6977); também reexecutável pela central de tutoriais do mascote ("↻ Refazer a instrução inicial", l.7803) |
| **Telas envolvidas** | Camada `#tutLayer` (sombras, anel `#tutRing`, seta, balão `#tutBubble`, robô `#tutQuad`; HTML l.3400–3416) sobre Início, Perfil (`#v-aluno`), Missões e Loja; overlay da missão demonstrativa `#tqLayer` (HTML l.3552–3560) |
| **Dados necessários** | `DB_ALUNO` (nome/telefone "vindos da matrícula", l.3944–3946); sprite de avatares `__AVATARS__`; catálogo da boina na Loja |
| **Ações principais (código)** | Roteiro `TUT` com **29 passos** (l.5764–5857); motor `tutGo/tutMask/tutPlace/tutSay` (l.5940–5971); `tutPular()` (l.6981–7006); `tutFim()` (l.7009–7017); recompensa `TUT_REW = { score: 30, coins: 25 }` (l.6872) |

**Etapas (roteiro resumido dos 29 passos)**

1. `iniciarTutorial()` **zera** Quad Coins e score da sessão, devolve a boina e reabre a Introdução — o aluno vive o "estado do dia 1".
2. Apresentação do QUAD (mascote) → tocar na própria foto → segurar para dar zoom.
3. **Escolha do avatar** no grid de 12 opções + confirmação ("Sim, sou eu!" / "Ver outros") — ver F04.
4. Confirmação dos dados que "vieram do sistema" (nome/turma; "Corrigir no site" só dá toast).
5. **Nome de guerra**: digitação validada por `tutGuerraOk` + confirmação (ver F04).
6. Salvar o perfil (passo `salvo`; `tutErro` aponta o que falta: avatar/nome/fone/guerra, l.6042–6054).
7. Leitura guiada do nome militar, insígnia e score.
8. **Missão demonstrativa "Introdução no Quad"** (`#tqLayer`): 3 questões com feedback imediato; errou → "vou lançar as perguntas novamente" até acertar as 3 (`tqResultado`, l.6920–6941). Conclusão paga `TUT_REW` (+30 score, +25 QdC).
9. Passeio por Quad Coins e Loja; **compra guiada da boina** (20 QdC; tentar o item mais caro é barrado com fala do QUAD, l.6087–6097).
10. Zoom final e despedida com "CONCLUIR ›" (`tutFim()` grava `vq_tut_done`).

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE. Fundo travado (wheel/touchmove bloqueados), fala datilografada, avanço por toque e por eventos (`tutEvent`). **Pular** (`tutSkip`) reproduz o estado final de quem concluiu: +30 score, boina equipada, 5 QdC (25 − 20 da boina), Introdução marcada como feita, grava `vq_tut_skip` (regra RN-04).

**Resultado esperado (produto):** onboarding único por conta, com recompensas **únicas** (anti-farm) e identidade fixada.

**Persistência necessária na aplicação real:** flag de tutorial concluído por conta; unicidade das recompensas; avatar e nome de guerra gravados no perfil (hoje apenas `vq_tut_skip`/`vq_tut_done`/`vq_intro_done` persistem; o resto zera no reload).

**Validações:** avatar escolhido, nome de guerra válido, telefone preenchido antes de salvar; filtro de palavrões `TUT_PALAVROES` (l.5699).

**Possíveis erros:** tentativa de salvar incompleto (o QUAD aponta a lacuna); compra de item acima do saldo no passo da Loja (barrada com fala).

**Sistemas futuros envolvidos:** back-end de gamificação (unicidade da recompensa) · cadastro geral (perfil) · sistema pedagógico.

**Decisões pendentes:** DECISÃO DE PRODUTO PENDENTE — os 6 tutoriais da central de ajuda do mascote respondem "em construção" (APENAS VISUAL, l.7787–7836). Observação: a instrução reabre em todo acesso enquanto não for pulada/concluída — comportamento intencional registrado no código.

---

## F04 · Escolha de identidade (avatar + nome de guerra)

| Campo | Descrição |
|---|---|
| **Ator** | Aluno (dentro do tutorial; ajustes limitados depois) |
| **Ponto de início** | Passos `avatar` e `guerra` do roteiro `TUT` (F03); fora do tutorial, card "Nome de guerra" no perfil `#v-aluno` |
| **Telas envolvidas** | Grid `#avGrid` no perfil `#v-aluno` (HTML l.2003–2033); camada de zoom `#zoomLayer` (l.3418–3422); topo de identidade (`#homeAvatar`, `#homeNome`) |
| **Dados necessários** | Sprite `__AVATARS__` (token do build) recortado em canvas; rótulos `AV_LABELS` (6 homens + 6 mulheres, l.7061–7064); nome completo de `DB_ALUNO`; fotos por variante `__FOTOS_VARIANTES__` |
| **Ações principais (código)** | `montarAvatares()` (l.7136–7188); `bindHold`/`zoomShow` (l.7066–7112); `tutGuerraOk()` (l.5731–5748); `syncNametag()` (l.7194–7203); `#btnSalvarPerfil` (l.7204–7214); `fotoPersonagem()`/`aplicarAvatar()` (l.7119–7135) |

**Etapas**

1. No tutorial, o grid de 12 avatares aparece; o aluno pode **segurar para ampliar** (zoom) cada opção.
2. Escolhido o avatar, o QUAD pergunta com pronome correto ("Essa/Esse é você?" — `avPerguntaDe`, l.5755–5759); confirmação fecha a escolha.
3. O aluno digita o **nome de guerra** (máx. 12 caracteres). Regra `tutGuerraOk`: só letras; sem palavrão; precisa ser **subsequência ordenada do nome completo**; nunca o nome inteiro.
4. `syncNametag()` atualiza ao vivo a nametag do personagem, a prévia e o `#homeNome` do topo.
5. Salvar o perfil consolida o título militar: `tituloCompleto()` = patente + "QUAD" + nome de guerra (l.3721–3725).
6. Depois do tutorial, o grid fica **oculto** — "a escolha acontece uma única vez, no tutorial; depois fica travada" (HTML l.2009). Itens comprados na Loja **vestem a foto automaticamente** (variantes boina/gandola/colete/fuzil/CIPE/PATAMO/BOPE — F13).

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE (sem persistência além da sessão).

**Resultado esperado (produto):** identidade única por conta; troca posterior do nome de guerra implica **refazer a instrução** (texto no HTML l.2032 + botão na central de tutoriais).

**Persistência necessária na aplicação real:** avatar (índice + variante vestida) e nome de guerra no perfil do aluno (banco).

**Validações:** as quatro regras do nome de guerra; avatar obrigatório antes de salvar.

**Possíveis erros:** nome de guerra inválido → `#btnSalvarPerfil` bloqueia com aviso (l.7204–7214); palavrão barrado.

**Sistemas futuros envolvidos:** cadastro geral de usuários (perfil) · CDN de assets (fotos por variante).

**Decisões pendentes:** DECISÃO DE PRODUTO PENDENTE — política formal de troca de avatar/nome de guerra fora do "refazer a instrução" (hoje só o texto da UI define).

---

## F05 · Acesso condicionado à matrícula (trava e destrava)

| Campo | Descrição |
|---|---|
| **Ator** | Sistema (gatilho) e aluno |
| **Ponto de início** | `checarMatricula()` executada ao entrar no app e a cada mudança em `MATRICULAS` (l.3900–3903) |
| **Telas envolvidas** | Pop-up `#matLayer` "Matrícula encerrada" (HTML l.3513–3522, botões `#btnMatLoja`/`#btnMatOk`); navegação inferior do aluno; Quad Store `#v-loja` |
| **Dados necessários** | `MATRICULAS` (l.3850) e `matriculasAtivas()` (l.3853) |
| **Ações principais (código)** | `appLock`; bloqueio de navegação (l.4079–4082); destrava em `matricular()` (l.8772–8778); hook de teste `window.__mat` (l.3905–3908) |

**Etapas**

1. Sempre que `matriculasAtivas()` = 0, `checarMatricula()` liga `appLock`.
2. O pop-up "Matrícula encerrada… funções bloqueadas" aparece; a navegação bloqueia **tudo, exceto a Quad Store** (regra RN-03, dec. 62 — a Loja fica aberta justamente para o aluno se rematricular).
3. O aluno compra uma turma na Loja (F13-a); `matricular()` cria a matrícula e **destrava o app na hora**.

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO (no protótipo) + SIMULADO LOCALMENTE — a vigência da matrícula é um array em memória; zerá-lo pelo hook `__mat.encerrar()` demonstra a trava.

**Resultado esperado (produto):** a vigência real da matrícula (datas, pagamento) comanda o acesso, verificada no servidor a cada sessão.

**Persistência necessária na aplicação real:** matrículas com período de vigência e status financeiro; política de carência/renovação.

**Validações:** existência de ≥1 matrícula ativa.

**Possíveis erros:** tentar navegar travado → toast de bloqueio (l.4080).

**Sistemas futuros envolvidos:** matrículas · financeiro/pagamentos · autenticação/autorização.

**Decisões pendentes:** DECISÃO DE PRODUTO PENDENTE — o que o aluno sem matrícula ainda enxerga além da Loja (histórico? Quadrômetro?); hoje o protótipo bloqueia tudo.

---

## F06 · Troca de turma ativa

| Campo | Descrição |
|---|---|
| **Ator** | Aluno com 2+ matrículas ativas |
| **Ponto de início** | Três portas: seletor `#cardTurma` no topo (vira botão com 2+ matrículas — `renderCarreira`, l.7236–7239); faixa do Domínio (`#btnDomTrocar`); "Minhas turmas" no Quadrômetro (`renderMinhasTurmas`, l.7336–7354). Automático: pop-up pós-compra da 2ª turma (F13-a) |
| **Telas envolvidas** | Pop-up `#trocaLayer` "Matrícula confirmada / Suas turmas" (HTML l.3488–3497); efeitos em Início, Missões, Domínio, Calendário, Materiais e Quadrômetro |
| **Dados necessários** | `MATRICULAS`, `turmaAtivaId`, catálogo `TURMAS_LOJA` (l.3842–3848) |
| **Ações principais (código)** | `turmaAtiva()` (l.3859–3866, autocorrige para a 1ª matrícula ativa); `definirTurmaAtiva(id, silencioso)` (l.3867–3893); `abrirTrocaTurma()` (l.7358–7404) |

**Etapas**

1. O aluno abre o pop-up de turmas por qualquer uma das três portas (ou ele abre sozinho após a 2ª matrícula — regra RN-09).
2. Escolhe a turma; `definirTurmaAtiva()` troca `ALUNO_TURMA` (chave do cronograma), redefine o **Domínio** pelo concurso da turma (`definirDominio`) e re-renderiza: carreira, Aula de hoje, avisos, rankings, Minhas turmas, materiais, quiz da aula, calendário, fila de flashcards (`trTrocaTurma`), blocos do dia e atrasadas.
3. Toast confirma: "Você está na \<turma\> — Início, avisos, ranking e Domínio passam a ser desta turma".
4. Clicar fora do pop-up mantém a turma em uso (l.7406–7414).

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO. Tudo que é "da turma" muda junto (regra RN-11): aula de hoje, herói do bloco, avisos, missões (fila 0/8, atrasadas, bônus da noite `NOITE_RESG`), calendário, Domínio, materiais. O que é **da conta** não muda: moedas, patente, mochila, avatar (regra RN-19).

**Resultado esperado (produto):** mesma mecânica, com a escolha persistida por conta.

**Persistência necessária na aplicação real:** preferência de turma ativa por usuário (hoje se perde ao recarregar — DEPENDE DE BANCO DE DADOS); estado pedagógico por aluno×turma.

**Validações:** só matrículas ativas aparecem; um turno por vez na compra (`turnoOcupadoPor`, l.3895–3898).

**Possíveis erros:** estornar a turma em uso → o app passa automaticamente à matrícula restante ou trava (F14/F05, regra RN-10).

**Sistemas futuros envolvidos:** matrículas · sistema pedagógico · banco de dados (estado por aluno×turma).

**Decisões pendentes:** nenhuma específica registrada além da persistência (acima).

---

## F07 · Aula de hoje

| Campo | Descrição |
|---|---|
| **Ator** | Aluno (leitura); administrador (alimenta o cronograma — F19 usa o mesmo dado) |
| **Ponto de início** | Card `#salaCard` no Início `#v-inicio` |
| **Telas envolvidas** | `#v-inicio` (card com 2 slots de aula, selo `#salaTag`, botão `#btnEntrarQuiz`); bloco Cronograma semanal do admin (`v-adm-hoje`, l.2639–2657) |
| **Dados necessários** | Snapshot `CRONO` (semana 30, grades por **id de turma**, l.4745–4774); `turmaAtiva()`; relógio local; `QUIZZES` (para o selo) |
| **Ações principais (código)** | `renderAulaHoje()` (l.4839–4876); `sincronizarCronoTurmas()` (l.4782–4795); `refreshQuizAula()` (l.5458–5487); atualização pelo admin (l.10311–10330) |

**Etapas**

1. O card monta o título com a turma ativa real, o dia e o turno, e lista os 2 tempos de aula da grade daquela turma.
2. Os estados **AGORA/ENCERRADO** são calculados pelo relógio local do aparelho.
3. O selo do quiz muda conforme o estado da sala: SEM QUIZ ABERTO → AULA COM QUIZ → AULA COM QUIZ ATIVO → QUIZ RESPONDIDO; com quiz ativo aparece `#btnEntrarQuiz` (ver F10).
4. Quando o admin altera o cronograma no painel, a "Aula de hoje" do aluno re-renderiza **na hora** (mesma sessão de navegador).

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE — a semana é um snapshot fixo (datas 20–24/07); turma nova nasce com grade em branco ("A definir"). Rodapé do card: "atualizado pela planilha da coordenação".

**Resultado esperado (produto):** grade viva por turma, alimentada pela coordenação.

**Persistência necessária na aplicação real:** grade semanal por turma (id estável), com histórico de alterações (o protótipo já loga em `CRONO_LOG`).

**Validações:** grade indexada por id de turma (regra RN-12, dec. 163 — evita colisão tipo+turno).

**Possíveis erros:** turma sem grade → slots "A definir"; professor da grade-semente inexistente no banco `DOCENTES` (nomes-fantasia — ver F19/observação).

**Sistemas futuros envolvidos:** DEPENDE DE SISTEMA EXTERNO — a fonte real declarada é a **planilha Google Sheets da coordenação** (comentário l.4740–4744); sistema pedagógico · painel administrativo.

**Decisões pendentes:** DECISÃO TÉCNICA PENDENTE — sincronização planilha↔app (marcada `[INTEGRAÇÃO REAL]`). DIVERGÊNCIA DOCUMENTAL leve — comentário em `definirTurmaAtiva()` (l.3873–3874) ainda cita chave tipo+turno, mas o código usa `cronoKey(t) = t.id`.

---

## F08 · Missão — bloco do dia e bloco da noite

| Campo | Descrição |
|---|---|
| **Ator** | Aluno |
| **Ponto de início** | Cartão herói "Missão de hoje / Bloco da noite" no Início (`#btnMissaoHome`) ou lista "Hoje · questões novas" em Missões `#v-missoes` |
| **Telas envolvidas** | `#v-inicio` (herói, contador `#missCount`, segmentos `#missSegs`); `#v-missoes` (HTML l.1716–1750: Treinamento Rápido, Hoje, Introdução, Atrasadas); overlay de flashcards `#trLayer` (HTML l.3534–3550) |
| **Dados necessários** | `BLOCOS_TURMA` (blocos POR TURMA, l.6264); `DIA_BLOCOS` demo (8 blocos: 2 do dia + revisões D-1/D-7/D-30 + 3 seeds atrasados, l.6234–6258); banco `TR_BANK` (~60 cartas, l.6122–6183); `NOITE_RESG` (resgate por turma) |
| **Ações principais (código)** | `renderDia()` (l.6665–6686); `trAbrirBloco`; autoavaliação `trResponde` (l.6787–6808); `trFimBloco` (l.6809–6847); `heroSync()` (l.6571–6604); `resgatarBeneficios()` (l.6612–6628); `renderAtrasadas()` (l.6312–6325) |

**Etapas**

1. O herói do Início mostra o turno da turma ativa ("Bloco da noite/manhã/tarde") e o contador feitas/total; `#btnMissaoHome` abre a próxima missão pendente.
2. Cada bloco abre o motor de **flashcards** (10 cartas em rodízio por assunto, seguindo o edital da turma ativa).
3. Em cada carta o aluno responde e se autoavalia: **Errei / Difícil / Bom / Fácil** — a autoavaliação alimenta a prova de promoção (F12) e redistribui o baralho ao zerar.
4. Fim do bloco: recompensa `TR_REW` = **+1 score por acerto** e **+5 QdC por bloco**; o resultado ajusta a barra do Domínio por concurso (`trAj`).
5. Ao concluir **todos** os blocos da noite, o herói vira o botão dourado "Retire aqui seus benefícios": +1 score por bloco + 1 Quad Coin com animação de moeda — resgate único, **por turma**.
6. Regras de vida do bloco: nasce às 22h15, some quando feito, **expira em 7 dias** (`DIA_EXPIRA_DIAS`) caindo em **Atrasadas**, de onde "Recuperar" o reabre.

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE — o banco de cartas é demo ("PDF 01" de Poderes administrativos, `AULA_DEMO`, 40 cartas); blocos de fonte "aula" concluídos entram no `TR_BANK`.

**Resultado esperado (produto):** blocos gerados a partir do material real das aulas (PDFs do operador), estado por aluno×turma, recompensas validadas no servidor.

**Persistência necessária na aplicação real:** progresso por bloco/carta por aluno×turma; carteira de QdC; datas de criação/expiração.

**Validações:** vigência de 7 dias; resgate da noite único por turma; Introdução no Quad fica fora da conta da noite.

**Possíveis erros:** bloco expirado → Atrasadas (não some do histórico); refazer não paga de novo.

**Sistemas futuros envolvidos:** sistema pedagógico · banco central de questões (extração dos PDFs — `[INTEGRAÇÃO REAL]`, comentário l.6110–6118) · back-end de gamificação.

**Decisões pendentes:** DECISÃO TÉCNICA PENDENTE — pipeline PDF→cartas. Observação: o "corte de sábado" citado no calendário é texto fixo (APENAS VISUAL).

---

## F09 · Resolução de questão (motores de questão)

| Campo | Descrição |
|---|---|
| **Ator** | Aluno |
| **Ponto de início** | Quatro contextos distintos: flashcards (F08), quiz da aula (F10), simulado digital (F11), Introdução no Quad (F03) |
| **Telas envolvidas** | `#trLayer` (flashcards); `#qaLayer` (quiz da aula, HTML l.3148–3163); `#simDigLayer` (simulado digital, HTML l.3131–3146); `#tqLayer` (Introdução); `#quizLayer` (motor genérico, HTML l.3165–3177) |
| **Dados necessários** | Bancos locais: `TR_BANK`/`AULA_DEMO` (flashcards), `QA_MULT`/`QA_CE` (quiz da aula), `QUESTIONS` (motor genérico, 3 questões, l.4616–4641), `TQ` (3 questões da Introdução) |

**Etapas (regra transversal de recompensa)**

1. O aluno abre a atividade no contexto correspondente.
2. Responde questão a questão; o feedback varia por motor (tabela abaixo).
3. Regra de produto embutida no código: **participação alimenta Quad Coin; acerto alimenta score/Domínio** (cards do Domínio l.1766–1769; resultado do quiz l.4685–4686).

| Motor | Feedback | Recompensa | Situação |
|---|---|---|---|
| Flashcards (`trResponde`) | Autoavaliação Errei/Difícil/Bom/Fácil | +1 score/acerto · +5 QdC/bloco · move Domínio | CONFIRMADO NO CÓDIGO |
| Quiz da aula (`#qaLayer`) | **Sem gabarito** para o aluno; cronômetro | **Sem premiação** — resposta vai ao relatório do professor | CONFIRMADO NO CÓDIGO |
| Simulado digital (`#simDigLayer`) | Correção ao final | +10 score/acerto · +N QdC/acerto (`simRec`, padrão 2) | CONFIRMADO NO CÓDIGO |
| Introdução no Quad (`#tqLayer`) | Feedback imediato; loop até acertar as 3 | `TUT_REW` (+30 score, +25 QdC), pago uma vez | CONFIRMADO NO CÓDIGO |
| Motor genérico (`openQuiz`) | Resultado no fim com gabarito + "▶ Vídeo de resolução" (toast) | +20 QdC na conclusão · +1 score/resposta | **Semi-vestigial** — nenhum fluxo atual do aluno o chama (HIPÓTESE: sobra de rodadas anteriores) |

**Comportamento atual (simulado):** SIMULADO LOCALMENTE em todos os motores — bancos de questões são demo.

**Resultado esperado (produto):** questões servidas pelo banco central, correção e crédito de recompensa validados no servidor; vídeo de resolução real por questão.

**Persistência necessária na aplicação real:** histórico de respostas por aluno (inclusive a autoavaliação de dificuldade, insumo da prova de promoção — F12); carteiras.

**Validações:** quiz da aula exige `online` (l.5488–5493); simulado digital pago só abre depois de comprado (`simAtivo`, l.6331–6335).

**Possíveis erros:** tempo esgotado no cronômetro (quiz da aula/simulado) encerra e corrige com o que foi respondido.

**Sistemas futuros envolvidos:** banco central de questões · sistema pedagógico · back-end de gamificação · DEPENDE DE SISTEMA EXTERNO (vídeos de resolução).

**Decisões pendentes:** DECISÃO TÉCNICA PENDENTE — destino do motor genérico `QUESTIONS`/`openQuiz` (reaproveitar ou remover).

---

## F10 · Quiz ao vivo (professor + aluno)

| Campo | Descrição |
|---|---|
| **Atores** | Professor (cria/ativa/encerra) e alunos da turma (respondem) |
| **Ponto de início** | Professor: navbar → "Quiz ao vivo" (`#v-sala`, HTML l.2236–2300) → escolher a turma (`abrirSala`). Aluno: selo no card "Aula de hoje" (F07) |
| **Telas envolvidas** | `#v-sala` (formulário `#qzTipo`/`#qzNq`/`#qzMin`/`#qzPdf`, botões Criar/Ativar/Encerrar, relatório `#qzRelCard`); lado do aluno `#qaLayer`; topo do professor com tag `#liveTag` "AO VIVO" |
| **Dados necessários** | `QUIZZES` (um quiz POR TURMA — mapa turmaId→quiz, l.5273–5275); bancos demo `QA_MULT` (10 múltipla escolha) e `QA_CE` (11 certo/errado); lotação real da turma (`turmaInscritos`) |
| **Ações principais (código)** | `btnQuizCriar` (l.5359–5371); `qzMontarQuestoes()` (l.5280–5293); máquina de estados `qzSyncBotoes()` (l.5339–5358); polling `pollRodar()` (l.5327–5338); relatório `qzRelatorio()` (l.5411–5441); aluno: `quizDaMinhaTurma()` (l.5444–5456), `qaFinaliza` (l.5541–5548) |

**Etapas**

1. **Professor** entra na sala da turma e cria o quiz: anexa um PDF (a demo usa **apenas o nome do arquivo**), escolhe tipo (múltipla escolha ou certo/errado), nº de questões (1–30) e tempo (1–180 min).
2. Estado `criado`: o aluno vê o selo "AULA COM QUIZ"; o professor pode **Refazer** ou **Descartar**.
3. Professor toca **Ativar**: estado `ativo`, quiz trava, tag "AO VIVO" acende; o aluno da turma vê "AULA COM QUIZ ATIVO" + botão para entrar.
4. **Aluno** responde no `#qaLayer` com cronômetro, **sem gabarito e sem premiação**; a resposta real dele entra no relatório do professor (quando a sala aberta é a mesma turma, l.5545).
5. O placar do professor cresce por **polling simulado** (a cada 700 ms soma 1–5 respostas aleatórias até a lotação da turma; a última vaga é reservada ao aluno da demo se ele for da turma).
6. Professor toca **Encerrar**: relatório consolidado por questão (distribuição por alternativa com a tag CORRETA); o relatório **começa em branco** até haver resposta ("nada de % inventado na aula", l.5415–5418).

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE — professor e aluno no **mesmo navegador**; questões sorteadas de banco demo; percentuais do relatório são determinísticos por hash, incorporando a resposta real do aluno da demo.

**Resultado esperado (produto):** extração real das questões do PDF; respostas reais da sala em tempo real; relatório ao vivo fiel.

**Persistência necessária na aplicação real:** quiz por turma com estado; respostas por aluno; histórico do relatório.

**Validações:** PDF anexado obrigatório; 1–30 questões; 1–180 min; um quiz por turma (duas salas não se atropelam); aluno exige `online`.

**Possíveis erros:** aluno offline não entra no quiz; aluno de outra turma não vê o quiz.

**Sistemas futuros envolvidos:** DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END (tempo real) · banco central de questões · DEPENDE DE SISTEMA EXTERNO (parser de PDF).

**Decisões pendentes:** APENAS VISUAL — "Feedback dos alunos: EM BREVE" (l.2296–2297; dec. 65) — DECISÃO DE PRODUTO PENDENTE.

---

## F11 · Simulado (lançamento → compra → presença → liberação)

| Campo | Descrição |
|---|---|
| **Atores** | Administrador (lança), aluno (compra/faz), recepção (libera presencial) |
| **Ponto de início** | Admin: bloco "Lançamento de simulados" em `v-adm-hoje` (l.2759–2819). Aluno: lista de simulados no **Calendário** `#v-calendario` (`#simuladosList` — dec. 165: simulados moram no Calendário, não em Missões) |
| **Telas envolvidas** | Formulário admin (`#admSimNome/Modal/Tipo/Data/Sala/Pdf/…`); vitrine da Loja (`#lojaSim-pres`/`#lojaSim-dig`); pop-up de moeda; quiz digital `#simDigLayer`; recepção `v-adm-liber` (`#admSpLista`) |
| **Dados necessários** | `SIMULADOS` (semente: 2 presenciais pagos + 1 digital gratuito, l.6299–6303); `SIM_INSC` (inscritos); `SIM_HIST` (realizados); `SALA_CAP` |
| **Ações principais (código)** | Lançamento l.11159–11225; `renderSimulados` (l.6379–6406); compra `comprarSimulado`/`escolherMoedaSim`/`finalizarCompraSim` (l.6450–6547); digital `abrirSimDig` (l.7642–7738); liberação `liberarInscrito()` (l.11015–11042) |

**Etapas**

1. **Admin lança** o simulado: presencial (data, horário, sala; **sempre pago**; vagas por moeda com soma ≤ capacidade da sala; sem choque de sala) ou digital (PDF obrigatório — vira quiz cronometrado; sem limite de vagas; pago nas duas moedas **ou gratuito** premiando N QdC por acerto, padrão 2).
2. **Aluno — presencial**: vê no Calendário "Comprar vaga na Loja" → item na vitrine com vagas restantes por moeda → pop-up "em qual moeda" → confirmação → débito e baixa da vaga daquela moeda → entra em `SIM_INSC` (inscrição = compra, regra RN-36).
3. **No dia, na sede**: a recepção localiza o inscrito e toca **"Liberar entrada"** → presença confirmada, **score creditado** (QdC só quando a atividade premia), o simulado vai ao histórico do aluno (`SIM_HIST`) e a compra é **consumida** (sai da janela de estorno — F14).
4. **Aluno — digital**: "Responder o simulado" abre o quiz cronometrado; ao concluir (ou zerar o tempo) corrige e credita **+10 score e +N QdC por acerto**; fica REALIZADO e não repete.

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE — questões do digital vêm de banco demo (`[INTEGRAÇÃO REAL: extração do PDF]`, l.7638–7641); vagas e liberação em memória.

**Resultado esperado (produto):** reserva atômica de vaga por moeda; check-in real na portaria; correção real do digital com questões extraídas do PDF.

**Persistência necessária na aplicação real:** inscrições, vagas restantes por moeda, presença, histórico de realizados, notas.

**Validações:** presencial sempre pago (seletor gratuito travado, l.11051); vagas ≤ `salaCap` (l.11181); choque de sala barrado (l.11182–11184); digital pago só abre comprado.

**Possíveis erros:** "Sala lotada — a última vaga em X acabou" na compra; vagas esgotadas tiram o item da vitrine.

**Sistemas futuros envolvidos:** sistema de simulados/pedagógico · loja/checkout · portaria (check-in físico) · banco central de questões · back-end de gamificação.

**Decisões pendentes:** DECISÃO TÉCNICA PENDENTE — extração de questões do PDF; reserva atômica de vaga.

---

## F12 · Promoção de patente

| Campo | Descrição |
|---|---|
| **Ator** | Aluno |
| **Ponto de início** | Card "Progressão de carreira" no perfil `#v-aluno` (`#progCard`); a prova libera quando o score da patente bate a meta |
| **Telas envolvidas** | `#v-aluno` (barra de score, estado); overlay `#provaLayer` (HTML l.3117–3129); trilha de patentes no Quadrômetro `#v-perfil` (`#trilhaList`) |
| **Dados necessários** | Estado `carreira` (scorePatente/scoreCarreira/scoreTemporada + estado acumulando/disponivel/prova/bloqueada, l.3708–3718); `GAMI.patentes` (14 patentes em 4 fases, l.3688–3703); autoavaliações Errei/Difícil dos flashcards (F08) |
| **Ações principais (código)** | `addPontos()` (l.7498–7509); `abrirProva`/`renderQuestaoProva`/`resultadoProva` (l.7547–7636); `provaColeta()` (l.7532–7546); `PROVA_APROV = 0.80` (l.7521); bloqueio `GAMI.tentativaHoras = 24` |

**Etapas**

1. O aluno acumula score (missões, simulados, presenças). **Score não é moeda e não promove sozinho**: ao bater a meta da patente, `addPontos` muda o estado para `disponivel` e **libera a prova** (regra RN-41).
2. O aluno abre a prova de promoção: **20 questões certo/errado** colhidas, sem que ele saiba, das que ele marcou **Errei/Difícil** nos flashcards (completadas da reserva na demo).
3. Aprovação com **80%** (`PROVA_APROV`): promoção na hora, transferência do score excedente para a próxima patente e registro no histórico de carreira.
4. Reprovação: bloqueio de nova tentativa por **24h** (na demo, botão "Liberar nova tentativa (simulação)").
5. Sair da prova devolve o estado `disponivel` (a prova não é queimada).

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE. Existem atalhos de demonstração marcados no código como `[DEMO PROVISÓRIO — REMOVER]`: `#btnDiaEstudo` (+275 pts) e `#btnDemoPatente` (l.7740–7758).

**Resultado esperado (produto):** prova automática sem fiscal, servida e corrigida no servidor; comentário do próprio código: "a interface nunca decide sozinha quantos pontos foram conquistados" (l.3706–3707).

**Persistência necessária na aplicação real:** score em três contas (carreira/patente/temporada), estado da prova, bloqueio de 24h, histórico de promoções.

**Validações:** estado `disponivel` exigido para abrir a prova; nota mínima; janela de bloqueio.

**Possíveis erros:** reprovação (bloqueio 24h); abandono da prova (estado preservado).

**Sistemas futuros envolvidos:** back-end de gamificação · banco central de questões (histórico de dificuldade por aluno) · painel administrativo (parametrização das patentes).

**Decisões pendentes / divergências:**
- DIVERGÊNCIA DOCUMENTAL — `GAMI.fases[].notaMin` prevê notas mínimas crescentes por fase (70/75/80/85%), mas a prova usa `PROVA_APROV = 0.80` **fixo** (l.7521, 7585). DECISÃO TÉCNICA PENDENTE aplicar a nota por fase.
- DECISÃO DE PRODUTO PENDENTE — regras de alteração de graduação do aluno pelo gestor (CHANGELOG 18/07).

---

## F13 · Compra na Loja (quatro variantes)

**Trilho comum a toda compra** (CONFIRMADO NO CÓDIGO): `bindLojaItem` (l.8667–8712) → modal de confirmação `confirmarCompra`/`#compraLayer` (l.9236–9252; toda compra pede confirmação — regra RN-22; exceção: dentro do tutorial o QUAD conduz sem modal) → checagem de saldo (`saldoDe`/`debitar`/`semSaldoMsg`, l.8660–8666) → marca ADQUIRIDO → decrementa estoque quando houver → registra em `lojaCompraLog` (alimenta `COMPRAS`, estornos e o Relatório de compras do aluno). Saldos: Quad Coins (variável `score`, l.3672) e Diamantes (`diamantes`, l.3771 — só entram por recarga do site ou gift card).

### F13-a · Turma (matrícula)

| Campo | Descrição |
|---|---|
| **Ator** | Aluno |
| **Ponto de início** | Vitrine "Turmas" da Quad Store (`#lojaTurmasCore`) |
| **Telas** | `#v-loja` → pop-up de moeda `#turmaLayer` (HTML l.3474–3486) → pop-up `#trocaLayer` (2ª matrícula em diante) |
| **Dados** | `TURMAS_LOJA` com `precoDmn/precoQdc/vagasDmn/vagasQdc` (vagas POR MOEDA, l.3842–3848) |

1. O card da turma exibe vagas por moeda ("145 Dmn · 10 QdC") e estados MATRICULADO / INDISPONÍVEL (turno ocupado) / ESGOTADA.
2. `turmaClick` (l.8739–8756) abre a escolha da moeda; `matricular(moeda)` (l.8757–8788) checa **choque de agenda (bloqueante para turma)**, debita, baixa a vaga daquela moeda e cria a MATRÍCULA.
3. 1ª matrícula assume o app silenciosamente; da 2ª em diante abre o pop-up de escolha da turma ativa (F06).

**Validações/erros:** um turno por vez (`turnoOcupadoPor`); saldo insuficiente; ESGOTADA quando as duas moedas zeram. **Sistemas:** checkout/financeiro · matrículas. Classificação: SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS. DIVERGÊNCIA DOCUMENTAL: rev. 2.3 dizia "Score não é moeda"; matrícula comprável em QdC é decisão do gestor ainda não realinhada no documento-base (dec. 11).

### F13-b · Item do personagem e item de combate

1. **Skins em cadeia**: boina (20 QdC) → gandola (60) → capa de colete (120) → fuzil (200), um elo por vez (`SKIN_CADEIA`, l.9702); fardas finais CIPE (500) / PATAMO (750) / BOPE (1300) com **escolha única** — comprou uma, as outras fecham (`fardaEscolhida`, l.9714–9717).
2. Cada compra **veste a foto do personagem automaticamente** (variantes `__FOTOS_VARIANTES__` — não há equipar/desequipar manual).
3. **Itens de combate** (`ITENS_COMBATE`, 6 itens, sempre em QdC): **compra repetida permitida, sem estoque** — o item nunca sai da vitrine e empilha na mochila com etiqueta "N na mochila" (dec. 172; `mochilaComprar`, l.9638–9653).

**Validações/erros:** cadeia respeita a ordem; farda fechada não compra; combate bloqueado durante o tutorial. **Divergência interna:** comentário do código diz que nas fardas "pode juntar as três" (l.9690), mas `skinComprar` fecha as demais — DIVERGÊNCIA DOCUMENTAL (comentário × comportamento) / DECISÃO DE PRODUTO PENDENTE. Classificação: SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS (inventário do jogador).

### F13-c · Produto físico (com estoque e retirada)

1. Vitrine de presenciais (`ITENS_PRESENCIAIS`, 8 itens, l.8868–8877) com badge de estoque (aviso "baixo" ≤5).
2. O modal de compra tem **seletor de quantidade** (±); a compra debita e baixa `p.estoque -= compraQtd` (l.9266); a última unidade tira o item da Loja.
3. A compra gera um **pedido de retirada** (`pedidoPresencial` → `PEDIDOS`, l.10757–10773), que aparece como etiqueta "seu pedido" na vitrine (não bloqueia novas compras) e vai para a fila da recepção (F16).

**Validações/erros:** estoque zerado recusa ("acabou — o item saiu da Loja", l.9211). **Sistemas:** estoque/logística (ERP) · recepção. Classificação: SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (controle físico de estoque).

### F13-d · Evento pago

1. Vitrine de eventos (`renderEventosLoja`, l.4338–4369) com lugares restantes e etiquetas LOTADO / EM CHOQUE; do carrossel do Início, o clique num evento pago não comprado **abre a página do evento**, cujo botão "Comprar na Quad Store" **leva ao item** na Loja (`lojaLevarAte`, dec. 173 revista pela **dec. 199 de 15/08**).
2. `comprarEvento` (l.4398–4421): confirmação (com aviso de choque quando houver), débito, marca INSCRITO, alimenta a **portaria** (`renderAcessos`) e o calendário.
3. Evento multi-dia permanece na vitrine como INSCRITO até o fim.

**Validações/erros:** LOTADO recusa a compra ("a sala comporta N", l.4403); choque de agenda **avisa sem impedir** ("a escolha é sua — sem reposição de aula"; só matrícula em turma é bloqueada — regra RN-30). **Sistemas:** eventos · loja/checkout · portaria. Classificação: SIMULADO LOCALMENTE + DEPENDE DO BACK-END.

**Persistência necessária na aplicação real (toda a F13):** carteiras por conta; catálogo/preços/estoques; posses (matrículas, skins, mochila, inscrições); log de compras — hoje tudo zera no reload.

---

## F14 · Estorno (e consumo que mata o estorno)

| Campo | Descrição |
|---|---|
| **Atores** | Aluno (estorna); administração (acompanha); recepção (consome — F16) |
| **Ponto de início** | Bloco "Estornos · até 7 dias" dentro da Quad Store (`renderEstornos`, l.11563–11589) |
| **Telas envolvidas** | `#v-loja` (lista de estornáveis com contagem regressiva); painel do admin "Estornos e desistências" (`#admEstList` + ranking `#admEstTop`) |
| **Dados necessários** | `COMPRAS` (com `ts`, `estornado`, `consumido`); `ESTORNOS` |
| **Ações principais (código)** | `estornoDias()`; `estornar()` (l.11684–11695); `desfazerCompra()` (l.11592–11683); `compraConsumida()` (l.11447–11457) |

**Etapas**

1. O aluno abre o bloco de estornos: aparecem as compras da conta **não estornadas e não consumidas** dentro de 7 dias corridos, com contagem regressiva (FALTAM X DIAS / ÚLTIMO DIA / PRAZO ENCERRADO).
2. Toca "Estornar" → **confirmação em dois toques**.
3. `estornar()` devolve a moeda usada, registra em `ESTORNOS` (visível ao admin em tempo real, com "Itens mais estornados") e chama `desfazerCompra()`, que **desfaz a posse por tipo**:
   - **matrícula** → devolve a vaga na moeda usada, remove a matrícula, refaz a turma ativa (ou trava o app se não sobrar nenhuma — F05/F06) e leva embora os materiais da turma;
   - **item de combate** → sai da mochila;
   - **evento/simulado** → desinscreve (sai da portaria/`SIM_INSC`, do calendário e volta à vitrine);
   - **skin** → regride a cadeia / reabre a escolha da farda;
   - **produto físico** → devolve o estoque e cancela o pedido;
   - **item avulso** → volta à vitrine.
4. **Consumo mata o estorno** (dec. 178): quando a recepção confirma a entrega do produto, libera a entrada no evento ou libera o inscrito do simulado (F16), `compraConsumida()` marca a compra e ela **sai imediatamente da janela de estorno** — "participar do aulão e estornar depois lesaria a empresa".

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE.

**Resultado esperado (produto):** estorno financeiro real (gateway) com a mesma máquina de desfazer posse, e transação atômica compra↔consumo.

**Persistência necessária na aplicação real:** log de compras com timestamps, estado consumido/estornado, trilha de auditoria.

**Validações:** janela de 7 dias; não consumida; dois toques.

**Possíveis erros:** prazo encerrado → botão desativado; compra consumida some da lista.

**Sistemas futuros envolvidos:** financeiro/pagamentos (DEPENDE DE SISTEMA EXTERNO — gateway) · back-end da loja/inventário · painel administrativo.

**Decisões pendentes:** DECISÃO TÉCNICA PENDENTE — contrato de estorno com o gateway; quem arbitra exceções fora da janela.

---

## F15 · Participação em evento (compra → portaria → liberação de entrada)

| Campo | Descrição |
|---|---|
| **Atores** | Aluno; recepção/portaria |
| **Ponto de início** | Carrossel "Eventos da semana" no Início (`#evStrip`) ou vitrine de eventos da Loja |
| **Telas envolvidas** | Página do evento — overlay `#evLayer` (HTML l.3179–3191, via `openEvento` l.4491–4562); Loja (pago); Calendário; recepção `v-adm-liber` bloco "Autorizações de acesso" (`#admAcessos`) |
| **Dados necessários** | `EVENTOS` (l.4226–4262, com `sala`, `score[]`, `coins[]`, `garimpo`, `online`, `ate`); `evState` (inscrito/comprado/garimpado); `ACESSO_ST` (portaria, l.10820); `SALA_CAP` |
| **Ações principais (código)** | `openEvento`; inscrição gratuita com confirmação em 2 toques quando há choque; `comprarEvento` (l.4398–4421); `acessoListaDe()` (l.10821–10833); liberação l.10859–10875 |

**Etapas**

1. Todo evento vigente aparece **para qualquer aluno, de qualquer turma** — "eventos são do QUAD, não de uma turma" (dec. 161). Etiquetas no carrossel: INSCRITO / LOTADO / EM CHOQUE / NA LOJA / +BÔNUS / COINS.
2. O aluno abre a página do evento: hero, regras de score e de Quad Coins publicadas (arrays `ev.score`/`ev.coins`), botão de ação.
3. **Gratuito**: inscrição direta (com confirmação em 2 toques se houver choque de agenda). **Pago**: o botão leva ao item na Loja (F13-d); a compra marca INSCRITO.
4. Inscrito: o evento entra no calendário do aluno; **evento online libera o link** após inscrição (na demo, toast — link real DEPENDE DE SISTEMA EXTERNO); evento com "garimpo" oferece "Garimpar Quad Coins escondidos" (+15 QdC, uma vez).
5. **Na portaria** (evento presencial): o aluno consta na lista de "Autorizações de acesso" — a lista é sincronizada com a inscrição/compra real (entra ao comprar, sai ao estornar). A recepção toca **"Liberar entrada"** → presença registrada e **compra consumida** (estorno morto — F14).
6. Evento vencido some do carrossel, da Loja e do calendário (`evAcabou`, l.4393–4397), ficando só no histórico de compras. ***Nota 03/08 — superada pela dec. 192 (02/08):*** o evento **presencial** em que o aluno se inscreveu **não some mais do calendário** — vira **CONCLUÍDO** (entrada liberada na portaria) ou **FALTOSO** (o dia passou sem registro de entrada); só o **online** continua saindo. A mesma decisão tira o **evento realizado da janela de estorno** (4º caminho de saída, além dos 3 gatilhos de consumo da dec. 178). Carrossel e Loja seguem como descrito acima.

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE — lotação presencial herda as cadeiras da sala (`evLot`/`evLotado`, com `SALA_CAP`); demais inscritos da portaria são semeados por hash (2–5 por evento).

**Resultado esperado (produto):** inscrições reais no banco; lotação real; check-in físico (QR/credencial) na portaria.

**Persistência necessária na aplicação real:** inscrições por conta; ocupação por evento; presença; consumo.

**Validações:** LOTADO barra compra e inscrição; choque avisa sem impedir; online não passa na portaria.

**Possíveis erros:** evento cancelado pelo admin some de tudo (inclusive da portaria — F19-b); garimpo só paga uma vez.

**Sistemas futuros envolvidos:** eventos · loja/checkout · recepção/portaria (DEPENDE DE SISTEMA EXTERNO — controle de acesso físico) · notificações (entrega de link).

**Decisões pendentes:** DECISÃO DE PRODUTO PENDENTE — mecânica definitiva do "garimpo" (V0 usa o botão simples "minerar").

---

## F16 · Liberações pela recepção (entregas, portaria e listas)

| Campo | Descrição |
|---|---|
| **Ator** | Administrador/recepção (persona admin, view `v-adm-liber`, HTML l.2862–2901) |
| **Ponto de início** | Navbar do admin → "Liberações"; três blocos: produtos físicos, autorizações de acesso, inscritos por atividade |
| **Telas envolvidas** | `#admPedidosList` (pedidos), `#admAcessos` (portaria de eventos), `#admSpLista` (recepção de simulados), `#admAtivSel`/`#admAtivInscritos` (listas por atividade) |
| **Dados necessários** | `PEDIDOS`; `ACESSO_ST`; `SIM_INSC`; `ativBank()` (atividades fixas + turmas e eventos vivos) |
| **Ações principais (código)** | `renderPedidos()` (l.10774–10800); liberação de entrada (l.10859–10875); `liberarInscrito()` (l.11015–11042); `ativListaPdf()` (l.10943–10968) |

**Etapas**

1. **Entrega de produto físico**: a compra do aluno (F13-c) gera o pedido; a recepção toca "Confirmar entrega" → pedido `entregue` + **compra consumida** (estorno morto).
2. **Portaria de eventos**: um grupo por **evento presencial vigente** (online não passa na portaria; vencido sai); "Liberar entrada" marca a presença e consome a compra do aluno (F15).
3. **Recepção de simulados**: inscritos agrupados por simulado; "Liberar entrada" pontua score (e QdC quando o simulado premia), move o simulado para o histórico do aluno e consome a compra (F11).
4. **Listas de conferência**: para qualquer atividade (turma, evento, isolada, simulado, excursão, TAF), "Gerar lista de conferência (PDF)" abre uma folha limpa (nome de guerra + coluna de presença em branco) e chama `window.print()` — o PDF sai pelo "Salvar como PDF" do navegador.

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE — nomes de inscritos são semeados (`inscNome`); o aluno da demo entra/sai das listas conforme suas compras reais.

**Resultado esperado (produto):** filas de entrega e check-in reais, com identidade conferida (QR/credencial) e consumo transacional.

**Persistência necessária na aplicação real:** pedidos, presenças, consumos, listas por atividade.

**Validações:** só eventos presenciais vigentes geram grupo de portaria; entrega/entrada únicas.

**Possíveis erros / divergências:**
- DIVERGÊNCIA DOCUMENTAL (texto da própria UI × código) — o parágrafo l.2883 afirma que na entrega "o item volta ao estoque da Loja", mas o código **não devolve estoque** na entrega (estoque baixa na compra e só volta em estorno, l.11656).
- DECISÃO DE PRODUTO PENDENTE — `ATIVIDADES` fixas duplicam conceitualmente eventos vivos nas listas (ex.: aulão aparece como atividade-semente e como evento real).
- DECISÃO TÉCNICA PENDENTE — "PDF" via impressão do navegador; definir se o produto exige PDF gerado no servidor.

**Sistemas futuros envolvidos:** recepção/portaria · estoque/logística · back-end (transação compra↔consumo) · relatórios.

---

## F17 · Materiais (admin anexa → aluno baixa)

| Campo | Descrição |
|---|---|
| **Atores** | Administrador (publica) e aluno (consome) |
| **Ponto de início** | Admin: bloco "Materiais da aula" em `v-adm-hoje` (l.2660–2694). Aluno: menu "+" → Materiais (`#v-materiais`, HTML l.2120–2131) |
| **Telas envolvidas** | Formulário admin (`#admMatTurma/Materia/Assunto/Tipo/Titulo/Arq/Link/Dur`); lista de publicados `#admMatList`; view do aluno com itens agrupados por matéria+assunto |
| **Dados necessários** | `MATERIAIS` (l.10344–10350); árvore do edital da turma (matérias válidas); arquivo local (FileReader) ou link de vídeo |
| **Ações principais (código)** | Publicação l.10454–10489; `renderMateriaisAluno()` (l.10353–10397); remoção com `URL.revokeObjectURL` (l.10431–10439) |

**Etapas**

1. O admin escolhe **turma → matéria (da árvore do edital daquela turma) → assunto → tipo** (slides/resumo/lista/mapa/vídeo/outro) e título.
2. Tipo arquivo: anexa o arquivo (obrigatório); tipo vídeo: informa link `http` (obrigatório) e duração.
3. Publica → o material entra em `MATERIAIS` etiquetado por turma; o ✕ tira do ar (revogando o objectURL); remover a turma remove os materiais dela.
4. O aluno vê **apenas materiais das turmas em que tem matrícula ativa** (todas, não só a ativa), com tag NOVO e, com 2+ matrículas, a etiqueta de qual turma veio.
5. **O download é real dentro da sessão**: o arquivo anexado vira `URL.createObjectURL` e baixa por âncora `a.download`; vídeo abre `window.open(link)`; itens-semente sem anexo dão toast ("material de exemplo").
6. Estorno da matrícula leva os materiais embora; matrícula nova os traz (regra RN-56).

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO (download real de blob local) + SIMULADO LOCALMENTE (o arquivo vive só na sessão do navegador — não há upload a servidor).

**Resultado esperado (produto):** publicação pela coordenação com armazenamento permanente e distribuição por turma.

**Persistência necessária na aplicação real:** arquivos em storage/CDN; metadados (turma, matéria, assunto, tipo); controle de acesso por matrícula.

**Validações:** assunto obrigatório; link `http` para vídeo; arquivo para os demais tipos.

**Possíveis erros:** publicação sem anexo/link é barrada com marcação de erro; material removido some do aluno na hora.

**Sistemas futuros envolvidos:** sistema de materiais (storage/CDN — DEPENDE DE SISTEMA EXTERNO) · plataforma de cursos · sistema pedagógico.

**Decisões pendentes:** DECISÃO TÉCNICA PENDENTE — infraestrutura de armazenamento e limites de arquivo.

---

## F18 · Login do professor

| Campo | Descrição |
|---|---|
| **Ator** | Professor cadastrado no Banco de professores |
| **Ponto de início** | Botão de persona "professor" → gate `#profGate` (HTML l.3381–3398) |
| **Telas envolvidas** | `#profGate` (`#profEmail`, `#profSenha`, `#btnProfEntrar`, mensagem de saída `#profSaidaMsg`); área do professor (`#v-prof-painel` e navbar `#navProfessor`) |
| **Dados necessários** | Banco `DOCENTES` (6 docentes-semente, l.3815–3822, com `materias`, `turnos`, `grad`, `desligado`, `bloqueado`, `senha`) |
| **Ações principais (código)** | `emailDoProf()` (l.4917–4922); `senhaDoProf()`/`PROF_SENHA_DEMO = 'quad1234'` (l.4914–4915); `btnProfEntrar` (l.4934–4953); derrubada de sessão `checarAcessoProf()` (l.8084–8103) |

**Etapas**

1. O professor digita o e-mail funcional. Regra do e-mail: **derivado do sobrenome** — remove títulos (Prof.ª/Cap./Ten./…), tira acentos e usa a última palavra do nome → `<sobrenome>@quadconcursos.com.br` (ex.: "Prof.ª Ritha Galvão" → `galvao@quadconcursos.com.br`).
2. Digita a senha (demo: `quad1234`, até o professor trocar a própria — a troca exige senha atual, mínimo 6 caracteres e confirmação, l.5000–5010).
3. `btnProfEntrar` valida `@`, localiza o docente por e-mail e recusa com mensagens específicas: cadastro **desligado**, **senha errada**, **acesso bloqueado pela coordenação**.
4. Sucesso: `profLiberado`, `PROF_ATUAL` definido, nome no topo e renderização de turmas, recados e painéis.
5. **Sessão derrubada em tempo real**: se o admin bloqueia/desliga/apaga o docente logado, `checarAcessoProf()` encerra a sessão, fecha a sala de quiz e devolve ao gate com recado cordial ("…temporariamente afastado das atividades…", com tratamento por gênero).

**Comportamento atual (simulado):** CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE — verificação toda em memória; comentário `[INTEGRAÇÃO REAL] senha individual do professor, definida no cadastro` (l.4911–4913).

**Resultado esperado (produto):** autenticação corporativa com credencial individual e revogação server-side.

**Persistência necessária na aplicação real:** cadastro docente com **ID estável** (hoje o nome é a chave — ver pendência), hash de senha, estado bloqueado/desligado.

**Validações:** e-mail com `@`; docente existente, ativo e não bloqueado; senha correta.

**Possíveis erros:** as três recusas acima; renomear o docente muda o e-mail de acesso e o antigo deixa de valer na hora (regra RN-47).

**Sistemas futuros envolvidos:** autenticação/autorização corporativa · cadastro de colaboradores · painel administrativo.

**Decisões pendentes:** DECISÃO TÉCNICA PENDENTE — e-mail derivado do sobrenome colide para sobrenomes iguais; nome como chave primária não sobrevive a homônimos (comentário do próprio código, l.8142–8146).

---

## F19 · Operação administrativa típica (N.P.P.)

**Entrada comum**: botão de persona "admin" → gate `#admGate` (HTML l.3362–3378). O gate exige e-mail com `@` e chave igual a `NPP-2026` (case-insensitive, l.9787–9795). **DIVERGÊNCIA DOCUMENTAL**: o briefing do projeto cita o e-mail `npp@quadconcursos.com.br` como credencial, mas **o código não valida o e-mail** — qualquer texto com `@` passa; só a chave decide (`voce@quadconcursos.com.br` é apenas placeholder). Comentário no código: `[INTEGRAÇÃO REAL] a chave é emitida e revogada pela direção, por pessoa`. Cada área do admin "nasce limpa" com atalhos de bloco (jump chips, l.8577–8607).

### F19-a · Criar turma

| Campo | Descrição |
|---|---|
| **Ator** | Administrador N.P.P. |
| **Ponto de início** | `#v-adm-controle`, bloco "Criação de turmas e isoladas" (l.2453–2518); também acessível pela Estrutura (`#btnEstrIrCriarTurma`) |
| **Dados necessários** | `MODALIDADES` (nivelamento/RONDESP 70/30 · regular/PATAMO 50/50 · questões/BOPE 20/80, l.4134–4138); `CONCURSOS` (árvores de edital); `SALAS`/`SALA_CAP`; `DOCENTES` |

1. O admin escolhe o **tipo** (nome real + apelido; o nome final da turma é o apelido, ex.: "Turma Águia"), o **concurso** (derivado da Estrutura), a **sala** (com "eco" que confere ocupação), o período e os horários (dois tempos seguidos).
2. O **turno é derivado do horário** (`turnoDoHorario`, l.4141–4145 — "não há como marcar noite e digitar 8h").
3. Define **preços e vagas POR MOEDA** (Dmn e QdC; 0 vale; total = soma) e os **professores por matéria** — seletores oferecem apenas docentes ativos que ministram cada matéria da árvore do concurso (sem candidato, a vaga fica aberta); anexar PDF do edital é `[INTEGRAÇÃO REAL]` (na demo valem as matérias do edital do concurso).
4. Validações na abertura (l.8450–8528): campos obrigatórios com marcação vermelha; tempos seguidos (h1i<h1f<h2f); **vagas ≤ lotação da sala** ("A Sala X comporta N pessoas — você pediu M vagas"); **choque de sala** (`salaConflito`).
5. Efeitos imediatos (l.8541–8563): a turma entra na Quad Store, nasce no Cronograma (grade em branco), nos Relatórios, nas Liberações, no editor de preços e no mapa de salas.
6. **Editar** grava no mesmo id preservando matrículas; **remover é recusado se houver matrícula ativa** ("estorne antes de remover", `removerTurma` l.7894–7915). Isoladas seguem formulário adaptado (dias da semana, uma faixa de horário, um professor, uma moeda) e, compradas, viram evento recorrente.

Classificação: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS. Pendências: DECISÃO TÉCNICA PENDENTE (parse do PDF do edital; cadastro de salas hard-coded — `SALA_CAP` 155/85/125/185 deveria ser configurável); DECISÃO DE PRODUTO PENDENTE (grade-semente `CRONO` cita professores fora do banco `DOCENTES` — unificar semente com o banco).

### F19-b · Criar evento

| Campo | Descrição |
|---|---|
| **Ator** | Administrador N.P.P. |
| **Ponto de início** | `v-adm-hoje`, bloco "Eventos da semana" (l.2696–2757) |
| **Dados necessários** | `EVENTOS`; `DOCENTES` (chips de professores); `SALAS`/`ESTUDIO`/`SALA_CAP` |

1. O admin preenche nome, resumo, **modalidade** (presencial/online), **tipo** (gratuito/pago), professores (chips do Banco), data/início/fim.
2. **Presencial reserva uma das 4 salas; online exige SELECIONAR o Estúdio** (seletor ativo e vazio — dec. 136 revogou a reserva automática da dec. 131); choque de sala/Estúdio é barrado.
3. **A lotação do evento herda a da sala** (`lot: online ? 0 : salaCap(evSala)`, l.10729; trocou de sala na edição, a lotação acompanha).
4. Pago: define moeda (QdC **ou** Dmn) e preço → vai à Loja com tag "NA LOJA". Gratuito: entra direto no carrossel do Início.
5. **Regras de score e Coins**: pares [regra, valor] adicionados a `ev.score`/`ev.coins`, publicados na página do evento do aluno (F15).
6. **Edição** preserva inscritos; **cancelamento** (✕) tira o evento do carrossel, da Loja, dos calendários, libera a sala/Estúdio e **remove o grupo da portaria** (`cancelarEvento`, l.10544–10559).

Classificação: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (link de transmissão online).

### F19-c · Mensagem por público

| Campo | Descrição |
|---|---|
| **Ator** | Administrador N.P.P. |
| **Ponto de início** | `#v-adm-controle`, bloco "Comunicação interna" (l.2549–2572) |
| **Dados necessários** | 7 públicos no seletor `#admMsgTipo`: aluno · professor · turma · isolada · simulado · evento · todos; alvos dinâmicos (só isoladas em andamento, simulados de pé, eventos vigentes; turmas com contagem de inscritos) |

1. O admin escolhe o público; o segundo seletor lista os alvos vivos e o **alcance** (inscritos reais quando existem; senão semente por hash; "Todos os alunos da plataforma · 1.286" é número fixo).
2. Escreve o texto e envia (`msgPublico()`, l.9950–9978 + handler l.9979–10034).
3. Entrega conforme o destino:
   - **Público** (turma/isolada/simulado/evento/todos) → chega no chat do aluno com o prefixo **`[<nome do público>]`** (ex.: "[Turma PATAMO] …" — não é o literal "[Público]"), acende o badge do "+", e o histórico registra "alvo · N alunos";
   - **Professor** → empilha em `RECADOS_PROF[nome]`, chega em "Informações" na área do professor (com badge), e a resposta do professor está **desabilitada** ("EM BREVE — V1");
   - **Aluno individual** → conta da demo recebe no chat do "+" (estilo WhatsApp); contas-semente só logam. Há também o atalho "Acionar apoio" vindo dos Relatórios, que pré-preenche o texto.
4. Status **ENVIADA → LIDA** sincroniza quando o destinatário abre o chat (aluno l.9931–9934; professor l.5210–5214). O chat do aluno é **unidirecional** ("responda procurando a administração").

Classificação: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END (mensageria/push real — na V0 "o app nunca empurra"). Pendências: DECISÃO DE PRODUTO PENDENTE — chat ao vivo de duas vias e resposta do professor (ambos "EM BREVE"/V1).

**Persistência necessária na aplicação real (F19 como um todo):** catálogo de turmas/eventos/simulados com IDs estáveis; agenda física central (salas/Estúdio); mensagens com estado de leitura; auditoria de operações administrativas.

**Sistemas futuros envolvidos (F19):** painel administrativo · matrículas · eventos · notificações/mensageria · sistema pedagógico · relatórios/inteligência de dados.

---

## Apêndice · O que NÃO tem fluxo navegável na V0

Para não confundir o leitor: os itens abaixo existem como tela/botão, mas **não têm fluxo funcional** no protótipo.

| Item | Evidência | Classificação |
|---|---|---|
| Pré-TAF (`#v-pretaf`) | View existe, mas a linha do menu "+" está bloqueada "EM BREVE" (l.3323–3327) — sem caminho de UI | APENAS VISUAL + DIVERGÊNCIA DOCUMENTAL (o aside promete o acesso) + DECISÃO DE PRODUTO PENDENTE |
| Modo offline | Alternador `#connToggle` referenciado no JS (l.5604) **não existe no HTML** — o modo é inatingível pela UI | DIVERGÊNCIA DOCUMENTAL + DEPENDE DO FRONT-END REAL |
| Chat ao vivo, Guarnições (GvG/PvP), Quests | Linhas bloqueadas com toast/EM BREVE (l.3289–3329; l.2851–2858) | APENAS VISUAL + DECISÃO DE PRODUTO PENDENTE |
| `v-edital` e `v-questoes` (admin) | Telas de demonstração: árvore estática e tabela fixa; botões só dão toast (l.8632–8637) | APENAS VISUAL + DEPENDE DE BANCO DE DADOS |
| Troca de senha do aluno | `#btnSenha` só exibe toast "Senha alterada com sucesso" (l.7766–7769) | APENAS VISUAL + DEPENDE DO BACK-END |
| Risco de abandono / rótulos de comportamento | Nenhuma função no código; só telemetria decorativa (l.1813, 5644) | APENAS VISUAL + HIPÓTESE + DECISÃO DE PRODUTO PENDENTE |
