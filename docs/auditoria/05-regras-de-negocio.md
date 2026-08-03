# 05 — Regras de Negócio

**Projeto:** Viver o Quad — protótipo navegável do app do aluno (V0 "Prova de Vida")
**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

---

## 1. Como ler este documento

Cada regra de negócio abaixo foi extraída do código-fonte (`/home/user/viveroquad/src.html`, 11.920 linhas), do registro de decisões (`docs/02-registro-de-decisoes.md`, decisões 1–181), do `CHANGELOG.md` e do documento-base (`docs/Viver-o-Quad-Relatorio-rev2-3.pdf`, "rev. 2.3"). **Toda linha citada refere-se ao src.html**, salvo indicação em contrário.

Campos de cada regra:

| Campo | Significado |
|---|---|
| **Área** | Domínio funcional da regra |
| **Regra** | Texto da regra em uma ou duas frases |
| **Fonte documental** | Decisão nº / CHANGELOG (data) / relatório rev. 2.3 |
| **Evidência no código** | Função, variável, id ou linha aproximada no src.html |
| **Comportamento atual** | O que o protótipo faz de fato, observável na tela |
| **Exceções** | Casos em que a regra não se aplica |
| **Dados envolvidos** | Estruturas JS/localStorage que a regra lê ou grava |
| **Sistema aplicador** | Qual sistema do ecossistema real deveria aplicar a regra |
| **Classificação** | Vocabulário obrigatório (abaixo) |
| **Divergências** | Conflitos documento×documento ou documento×código |
| **Decisão pendente** | O que ainda precisa ser decidido (produto ou técnica) |

**Vocabulário de classificação** (um item pode receber mais de um rótulo): CONFIRMADO NO CÓDIGO · APENAS VISUAL · SIMULADO LOCALMENTE · DEPENDE DO FRONT-END REAL · DEPENDE DO BACK-END · DEPENDE DE BANCO DE DADOS · DEPENDE DE SISTEMA EXTERNO · HIPÓTESE · DECISÃO DE PRODUTO PENDENTE · DECISÃO TÉCNICA PENDENTE · DIVERGÊNCIA DOCUMENTAL.

**Nota geral sobre o estado**: TODO o estado do protótipo vive em memória JS + localStorage, via wrappers `lsGet`/`lsSet` (l. 3737–3739). Chaves localStorage confirmadas por grep exaustivo: `vq_device_authorized`, `vq_last_sync`, `vq_pending` (l. 3736), `vq_tut_step`, `vq_tut_done`, `vq_tut_rew`, `vq_tut_skip` (l. 5649–5650, 5697), `vq_intro_done` (l. 6882–6887). Portanto, **toda regra que altera estado é, no mínimo, SIMULADO LOCALMENTE** — a classificação indica adicionalmente qual sistema real deve assumi-la. Pontos que o próprio código marca como fronteira de integração aparecem com o comentário `[INTEGRAÇÃO REAL]` (24 ocorrências confirmadas por grep, ex.: l. 3728, 5277, 5632, 5665, 9790).

Textos decorativos da interface (cards descritivos, placeholders "EM BREVE") **não** foram transformados em regras confirmadas: quando aparecem, estão rotulados APENAS VISUAL.

---

## 2. Índice das regras

| Nº | Regra (nome curto) | Área | Classificação principal |
|---|---|---|---|
| RN-01 | Cadastro no site, não no app | Conta/Acesso | SIMULADO LOCALMENTE |
| RN-02 | Matrícula ativa libera o acesso (vinheta) | Conta/Acesso | APENAS VISUAL |
| RN-03 | Sem matrícula ativa, o app trava | Conta/Matrículas | CONFIRMADO NO CÓDIGO |
| RN-04 | Tutorial obrigatório com "Pular" equivalente | Onboarding | CONFIRMADO NO CÓDIGO |
| RN-05 | Bloqueio de conta = suspensão imediata | Governança | CONFIRMADO NO CÓDIGO |
| RN-06 | Turma vendida em duas moedas, vagas por moeda | Loja/Matrículas | CONFIRMADO NO CÓDIGO |
| RN-07 | Uma turma por turno até o término | Matrículas | CONFIRMADO NO CÓDIGO |
| RN-08 | Turma ativa comanda o app, trocável | Matrículas/UX | CONFIRMADO NO CÓDIGO |
| RN-09 | Pop-up de escolha a partir da 2ª matrícula | Matrículas | CONFIRMADO NO CÓDIGO |
| RN-10 | Estorno da turma em uso passa à restante | Matrículas/Estornos | CONFIRMADO NO CÓDIGO |
| RN-11 | Blocos exclusivos por turma | Experiência do aluno | CONFIRMADO NO CÓDIGO |
| RN-12 | Cronograma é da TURMA (chave = id) | Pedagógico | CONFIRMADO NO CÓDIGO |
| RN-13 | Turma nasce só no Painel, com validações | Painel administrativo | CONFIRMADO NO CÓDIGO |
| RN-14 | Lotação fixa por sala (155/85/125/185) | Espaço físico | CONFIRMADO NO CÓDIGO |
| RN-15 | Evento presencial herda lotação; LOTADO | Eventos/Loja | CONFIRMADO NO CÓDIGO |
| RN-16 | Reserva de sala unificada (sem choque) | Espaço físico | CONFIRMADO NO CÓDIGO |
| RN-17 | Evento online seleciona o Estúdio | Eventos/Estúdio | CONFIRMADO NO CÓDIGO |
| RN-18 | Duas moedas: Quad Coin × Diamante | Economia | CONFIRMADO NO CÓDIGO |
| RN-19 | Economia é da PESSOA, não da turma | Economia | CONFIRMADO NO CÓDIGO |
| RN-20 | Gift card de liberação única | Economia | CONFIRMADO NO CÓDIGO |
| RN-21 | Crédito manual de moedas pela administração | Financeiro | CONFIRMADO NO CÓDIGO |
| RN-22 | Confirmação em toda compra | Loja | CONFIRMADO NO CÓDIGO |
| RN-23 | Estoque físico decresce; item some ao acabar | Loja/Logística | CONFIRMADO NO CÓDIGO |
| RN-24 | Item de combate: recompra livre | Loja/Personagem | CONFIRMADO NO CÓDIGO |
| RN-25 | Cadeia de skins; farda de escolha única | Personagem | CONFIRMADO NO CÓDIGO |
| RN-26 | Estorno em até 7 dias, dois toques | Economia/Pós-venda | CONFIRMADO NO CÓDIGO |
| RN-27 | Consumo mata o estorno | Economia/Pós-venda | CONFIRMADO NO CÓDIGO |
| RN-28 | Estorno desfaz a aquisição por tipo | Economia | CONFIRMADO NO CÓDIGO |
| RN-29 | Relatório de compras do aluno | Loja/Transparência | CONFIRMADO NO CÓDIGO |
| RN-30 | "EM CHOQUE" avisa sem impedir | Agenda do aluno | CONFIRMADO NO CÓDIGO |
| RN-31 | Expiração nas vitrines; 7 dias nas missões | Agenda/Missões | CONFIRMADO NO CÓDIGO |
| RN-32 | Eventos são DO QUAD (sem turma-alvo) | Eventos | CONFIRMADO NO CÓDIGO |
| RN-33 | Evento gratuito × pago; link; +BÔNUS | Eventos/Loja | CONFIRMADO NO CÓDIGO |
| RN-34 | Criação/edição/cancelamento de eventos | Eventos/Admin | CONFIRMADO NO CÓDIGO |
| RN-35 | Portaria sincronizada; entrada consome | Eventos/Recepção | CONFIRMADO NO CÓDIGO |
| RN-36 | Simulado presencial: sempre pago, não premia QdC | Simulados | CONFIRMADO NO CÓDIGO |
| RN-37 | Vagas do simulado presencial por moeda | Simulados/Loja | CONFIRMADO NO CÓDIGO |
| RN-38 | Simulado digital: sem vagas, premia por acerto | Simulados | CONFIRMADO NO CÓDIGO |
| RN-39 | Presença no simulado gera score e consome | Simulados/Recepção | CONFIRMADO NO CÓDIGO |
| RN-40 | Simulados moram no Calendário | Navegação | CONFIRMADO NO CÓDIGO |
| RN-41 | Três scores separados dos Quad Coins | Gamificação | CONFIRMADO NO CÓDIGO |
| RN-42 | 14 patentes em 4 fases | Gamificação | CONFIRMADO NO CÓDIGO |
| RN-43 | Prova de promoção automática (80%, 24h) | Gamificação | CONFIRMADO NO CÓDIGO |
| RN-44 | Recompensas de missões | Gamificação | CONFIRMADO NO CÓDIGO |
| RN-45 | Introdução no Quad é DA CONTA | Gamificação | CONFIRMADO NO CÓDIGO |
| RN-46 | Login do professor (e-mail derivado + senha) | Professor | CONFIRMADO NO CÓDIGO |
| RN-47 | Renomear professor propaga | Professor | CONFIRMADO NO CÓDIGO |
| RN-48 | Bloqueio/desligamento derruba acesso | Professor | CONFIRMADO NO CÓDIGO |
| RN-49 | Quiz da aula: por turma, sem gabarito/prêmio | Professor/Sala | CONFIRMADO NO CÓDIGO |
| RN-50 | Escalação docente só por matéria e ativo | Professor/Turmas | CONFIRMADO NO CÓDIGO |
| RN-51 | Horas do professor derivadas da grade | Professor | CONFIRMADO NO CÓDIGO |
| RN-52 | Gate do administrador (chave N.P.P.) | Permissões | CONFIRMADO NO CÓDIGO |
| RN-53 | Avisos com turma-alvo por ID | Comunicação | CONFIRMADO NO CÓDIGO |
| RN-54 | Mensagens por público | Comunicação | CONFIRMADO NO CÓDIGO |
| RN-55 | Ranking com privacidade de mão dupla | Ranking | CONFIRMADO NO CÓDIGO |
| RN-56 | Materiais por turma, com download real | Materiais | CONFIRMADO NO CÓDIGO |
| RN-57 | Domínio segue a turma ativa; ajuste por concurso | Pedagógico | CONFIRMADO NO CÓDIGO |
| RN-58 | Modalidades com régua teoria×questões | Estrutura | APENAS VISUAL (efeito) |
| RN-59 | Questões: banco único da demo | Pedagógico/Questões | CONFIRMADO NO CÓDIGO |
| RN-60 | Relatórios: dados vivos + sintéticos | Relatórios | SIMULADO LOCALMENTE |
| RN-61 | Comportamento e risco de abandono | Inteligência de dados | APENAS VISUAL |

---

## 3. Conta e acesso

### RN-01 — Cadastro no site, não no app
- **Área**: Conta/Acesso.
- **Regra**: A conta do aluno é criada no checkout do site do Quad, junto da matrícula; o app só autentica (e-mail + senha) e o botão "Criar conta" redireciona ao site.
- **Fonte documental**: decisão 21 (20/07); CHANGELOG 20/07 ("acesso pelo site, dados do banco e prova automática").
- **Evidência no código**: `acessarPortal()` l. 5629–5654; `btnCriarConta` l. 5660–5663; `btnIrCheckout` l. 5664–5667 com comentário `[INTEGRAÇÃO REAL] abrir o checkout do site`; textos l. 3355 e 3578.
- **Comportamento atual**: qualquer e-mail contendo "@" + qualquer senha entram; "Criar conta" mostra tela informativa e toast "Redirecionando para o cadastro no site… (demo)".
- **Exceções**: conta bloqueada (RN-05); "sem conexão" simulada não loga (l. 5638).
- **Dados envolvidos**: `currentEmail`, `DB_ALUNO` (l. 3946 — "dados que chegam do banco de dados geral").
- **Sistema aplicador**: site principal e checkout do Quad + cadastro geral de usuários/alunos + autenticação/autorização.
- **Classificação**: SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (checkout) + DEPENDE DO BACK-END (validação de credenciais — o login aceita qualquer e-mail+senha, marcado `[INTEGRAÇÃO REAL] validar no servidor`, l. 5632).
- **Divergências**: `docs/01-visao-e-escopo.md` e o README ainda descrevem cadastro NO app com preenchimento automático (modelo anterior à decisão 21). DIVERGÊNCIA DOCUMENTAL.
- **Decisão pendente**: —.

### RN-02 — Matrícula ativa libera o acesso; verificação dentro da vinheta
- **Área**: Conta/Acesso.
- **Regra**: O acesso ao app é liberado pela existência de matrícula ativa no banco geral, verificada durante a vinheta de carregamento (uma tela só).
- **Fonte documental**: decisões 21 e 57; CHANGELOG 24/07 Fase A ("Login em UMA tela").
- **Evidência no código**: `acessarPortal()` l. 5645–5653 (`splashVerify` = "Verificando a matrícula de …"); `entrarApp()` → `checarMatricula()` l. 5674–5687.
- **Comportamento atual**: a vinheta exibe "Verificando a matrícula de <e-mail>…"; nenhum servidor é consultado.
- **Exceções**: —.
- **Dados envolvidos**: `MATRICULAS` (l. 3850).
- **Sistema aplicador**: matrículas + autenticação/autorização + banco de dados central.
- **Classificação**: APENAS VISUAL (a "verificação" é encenada) + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

### RN-03 — Sem matrícula ativa, o app trava (só a Quad Store fica acessível)
- **Área**: Conta/Matrículas.
- **Regra**: Se todas as matrículas venceram, as funções do app ficam bloqueadas até nova matrícula, restando acessível apenas a Quad Store.
- **Fonte documental**: decisão 62 (24/07); CHANGELOG 24/07 Fase B ("Matrícula manda no app").
- **Evidência no código**: `matriculasAtivas()` l. 3853; `checarMatricula()`/`appLock` l. 3899–3903; aviso "Matrícula encerrada… funções bloqueadas" l. 3513–3518; toast de bloqueio l. 4080; hook de teste `window.__mat.encerrar` l. 3905–3908.
- **Comportamento atual**: zerando `MATRICULAS`, o overlay `matLayer` aparece; nova matrícula destrava na hora (`matricular()` l. 8772–8778).
- **Exceções**: a Quad Store continua acessível (para permitir nova matrícula).
- **Dados envolvidos**: `MATRICULAS`, `appLock`.
- **Sistema aplicador**: matrículas + financeiro/pagamentos (status) + autorização.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-04 — Tutorial obrigatório com "Pular" que reproduz o estado final
- **Área**: Onboarding/Gamificação.
- **Regra**: A "Instrução do QUAD" roda em todo acesso; pular entrega exatamente o estado de quem concluiu: boina equipada + 25 QdC ganhos − 20 da boina = 5 QdC + 30 de score da Introdução.
- **Fonte documental**: decisões 7, 17 e 105; CHANGELOG 26/07 ("Instrução do QUAD com botão Pular") e 19/07 (roteiro).
- **Evidência no código**: `TUT_REW = { score: 30, coins: 25 }` l. 6872; `tutPular()` l. 6981–7006 (calcula `TUT_REW.coins - precoBoina`, grava `vq_tut_skip`, chama `blocoIntroMarca(true)`); `tutFim()` l. 7009–7017; gate `lsGet('vq_tut_skip')` l. 5650.
- **Comportamento atual**: pular credita +30 score de carreira e +5 QdC, veste a boina e remove a "Introdução no Quad" do bloco Hoje.
- **Exceções**: as recompensas do tutorial são únicas — refazer não paga de novo (CHANGELOG 19/07, "recompensas reais e únicas"; "Score sempre zerado no tutorial").
- **Dados envolvidos**: `TUT_REW`, `lojaOwned['Boina exclusiva']`, `carreira`, chaves `vq_tut_*`.
- **Sistema aplicador**: app real (onboarding) + sistema pedagógico + back-end de gamificação (garantia de unicidade da recompensa, anti-farm).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências**: a decisão 105 diz que a instrução abre "em todo acesso", e um comentário no código repete isso (l. 5648–5649); porém tanto concluir (`tutFim`, l. 7010) quanto pular (`tutPular`, l. 6989) gravam `vq_tut_skip='1'`, e o login só dispara o tutorial se essa chave não existir (l. 5650). Na prática, ela abre em todo acesso **apenas até a primeira conclusão/pulo** no mesmo navegador; depois, só via "Refazer instrução" ou "Resetar demonstração" (limpa a chave, l. 8643). DIVERGÊNCIA DOCUMENTAL (decisão × comportamento).
- **Decisão pendente**: DECISÃO DE PRODUTO PENDENTE — após concluir/pular uma vez, a instrução deve voltar a abrir no próximo login (como diz a decisão 105) ou ficar guardada na central do QUAD (como o app faz hoje)?

### RN-05 — Bloqueio de conta do aluno = suspensão imediata
- **Área**: Governança de contas (admin).
- **Regra**: Bloquear a conta derruba a sessão do aluno na hora e o login passa a ser negado com o pop-up "Conta bloqueada — procure a administração".
- **Fonte documental**: decisão 52 (24/07); CHANGELOG 24/07 Fase 1.
- **Evidência no código**: `CONTAS` l. 9803–9808; toggle de bloqueio l. 9891–9902 (comentário "suspensão imediata: derruba a sessão"); negação no login l. 5639–5641 (`bloqLayer`); pop-up l. 3464–3469; texto do painel l. 2546.
- **Comportamento atual**: bloquear a conta "eu" desloga na hora e mostra o pop-up; tentativa de login reabre o aviso.
- **Exceções**: contas-semente não têm sessão a derrubar (apenas mudam de estado).
- **Dados envolvidos**: `CONTAS[i].bloqueada`.
- **Sistema aplicador**: painel administrativo + autenticação/autorização (revogação de sessão server-side).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

---

## 4. Turmas, matrículas e turma ativa

### RN-06 — Turma vendida em duas moedas, com vagas POR MOEDA
- **Área**: Loja/Matrículas.
- **Regra**: Cada turma é um item único vendido em Diamantes OU Quad Coins, com preço e estoque de vagas separados por moeda, escolhidos num pop-up "Creditar em".
- **Fonte documental**: decisões 60, 61 e 155; CHANGELOG 28/07 ("Vagas por moeda na criação") e 24/07 Fase B.
- **Evidência no código**: `TURMAS_LOJA` com `precoDmn/precoQdc/vagasDmn/vagasQdc` l. 3842–3848; `turmaClick()` l. 8739–8756 (pop-up com vagas por moeda); `matricular(moeda)` l. 8757–8788 (debita a moeda escolhida e decrementa `vagasDmn`/`vagasQdc`).
- **Comportamento atual**: o card mostra os dois preços (ex.: "145 Dmn · 10 QdC"); comprar debita e baixa a vaga daquela moeda; ESGOTADA quando os dois estoques zeram (l. 8722–8724).
- **Exceções**: durante o tutorial o clique é ignorado (l. 8740).
- **Dados envolvidos**: `TURMAS_LOJA`, `MATRICULAS`, `score` (QdC), `diamantes`.
- **Sistema aplicador**: checkout/financeiro (a venda real é em dinheiro/Diamantes) + matrículas + painel administrativo.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Divergências**: a rev. 2.3 afirma "Score não é moeda" (divergência já reconhecida na decisão 11) — matrícula comprável em QdC é decisão do gestor ainda não absorvida pelo documento-base. DIVERGÊNCIA DOCUMENTAL.
- **Decisão pendente**: DECISÃO DE PRODUTO PENDENTE — revisão do documento-base (rev. 2.4).

### RN-07 — Bloqueio de turno: uma turma por turno até o término
- **Área**: Matrículas.
- **Regra**: Matriculado num turno, as demais turmas do mesmo turno ficam INDISPONÍVEL (independentemente da moeda) até a turma do aluno terminar.
- **Fonte documental**: decisão 62; CHANGELOG 24/07 Fase B.
- **Evidência no código**: `turnoOcupadoPor()` l. 3895–3898; `renderTurmasLoja()` l. 8721–8724; recusa em `turmaClick()` l. 8743–8744; toast em `matricular()` l. 8777.
- **Comportamento atual**: o aluno demo (PATAMO Noite) vê as turmas noturnas INDISPONÍVEL e pode comprar as da manhã.
- **Exceções**: turmas de turnos diferentes são compráveis — múltiplas matrículas são previstas (RN-08).
- **Dados envolvidos**: `MATRICULAS[].turno`, `TURMAS_LOJA[].turno`.
- **Sistema aplicador**: matrículas + regras comerciais do site/checkout.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-08 — Turma ativa: uma matrícula comanda o app, trocável sem deslogar
- **Área**: Matrículas/Experiência do aluno.
- **Regra**: Com 2+ matrículas, uma delas ("turma ativa") comanda Início, Aula de hoje, avisos, ranking da sala, Domínio, quiz, Missões, calendário e materiais; o aluno troca a qualquer momento (Minhas turmas, nome da turma no topo, faixa do Domínio) sem sair da conta.
- **Fonte documental**: decisões 146, 152, 153, 154, 156 e 160; CHANGELOG 28/07 ("Turma ativa"; "O seletor de turma sai do fundo do Quadrômetro").
- **Evidência no código**: `turmaAtivaId`/`turmaAtiva()` l. 3859–3866; `definirTurmaAtiva()` l. 3867–3893 (redesenha carreira, aula, avisos, rankings, materiais, quiz, calendário, Domínio, Missões); hook `window.__turmaAtiva` l. 3894; `renderMinhasTurmas()` l. 7336; `abrirTrocaTurma()` l. 7358.
- **Comportamento atual**: trocar dispara o toast "Você está na <turma> — Início, avisos, ranking e Domínio passam a ser desta turma".
- **Exceções**: com 1 matrícula o topo é texto simples (dec. 152); sem matrícula, `turmaAtiva()` retorna null e o app trava (RN-03).
- **Dados envolvidos**: `turmaAtivaId`, `MATRICULAS`, `ALUNO_TURMA` (chave do cronograma, l. 4796).
- **Sistema aplicador**: app real (front-end) + matrículas; a preferência de turma ativa é estado do usuário (banco).
- **Classificação**: CONFIRMADO NO CÓDIGO + DEPENDE DO FRONT-END REAL + DEPENDE DE BANCO DE DADOS (hoje a escolha se perde ao recarregar a página).
- **Divergências / Decisão pendente**: —.

### RN-09 — Pop-up de escolha logo após a matrícula (da 2ª turma em diante)
- **Área**: Matrículas.
- **Regra**: Confirmada a compra da 2ª turma em diante, um pop-up "Matrícula confirmada" pergunta qual turma o app deve abrir; o mesmo pop-up serve como "Suas turmas" quando chamado pelo topo/Domínio.
- **Fonte documental**: decisões 147 e 154.
- **Evidência no código**: `matricular()` l. 8784–8787 chama `abrirTrocaTurma(t.id)` (definida l. 7358); a primeira matrícula não pergunta (l. 8772–8778).
- **Comportamento atual**: comprar a 2ª turma abre o pop-up com um botão por turma.
- **Exceções**: a 1ª matrícula ativa o app silenciosamente.
- **Dados envolvidos**: `MATRICULAS`, `turmaAtivaId`.
- **Sistema aplicador**: app real (front-end).
- **Classificação**: CONFIRMADO NO CÓDIGO + DEPENDE DO FRONT-END REAL.
- **Divergências / Decisão pendente**: —.

### RN-10 — Estorno da turma em uso passa o app à matrícula restante
- **Área**: Matrículas/Estornos.
- **Regra**: Estornar a matrícula devolve a vaga na moeda usada, remove a matrícula e, se era a turma ativa, o app passa a falar pela matrícula restante (ou trava, se não sobrar nenhuma).
- **Fonte documental**: decisões 67, 100 e 162; CHANGELOG 28/07 ("estornar a turma em uso passa o app para a matrícula restante").
- **Evidência no código**: `desfazerCompra()`, ramo matrícula, l. 11594–11607 (devolve `vagasDmn/Qdc`, filtra `MATRICULAS`, chama `checarMatricula()` e `definirTurmaAtiva(turmaAtivaId, true)`, que se autocorrige — l. 3863 assume `ats[0]`).
- **Comportamento atual**: o estorno remove a turma de "Minhas turmas" e leva embora os materiais dela (l. 11605).
- **Exceções**: prazo de 7 dias (RN-26) e consumo (RN-27).
- **Dados envolvidos**: `COMPRAS`, `MATRICULAS`, `TURMAS_LOJA`.
- **Sistema aplicador**: financeiro/pagamentos (estorno real) + matrículas.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (gateway de pagamento).
- **Divergências / Decisão pendente**: —.

### RN-11 — Blocos exclusivos por turma (Missões, calendário, avisos, materiais, Domínio, aula de hoje, herói)
- **Área**: Experiência do aluno.
- **Regra**: Aula de hoje, herói "Bloco da manhã/tarde/noite", avisos, Missões (fila do dia, 0/8, Atrasadas, bônus e rodízio), calendário, Domínio e materiais são estados/visões POR TURMA — progresso numa turma não conta na outra; turma nova nasce "no dia zero", sem atrasadas, com blocos no horário DELA.
- **Fonte documental**: decisões 146, 151, 156, 158, 159 e 160; CHANGELOG 28/07 ("Cada turma com a sua vida").
- **Evidência no código**: `BLOCOS_TURMA = { 'patamo-n': DIA_BLOCOS }` l. 6264 + `diaBlocos()` l. 6282–6286 (turma nova nasce com `novosBlocosDia()` no horário dela, l. 6265–6281); `NOITE_RESG` por turma l. 6610–6616; `heroTurno()`/`heroSync()` l. 6567–6579; `avisoVisivel()` l. 10158–10161; `renderMateriaisAluno()` l. 10353–10375 (filtra `matriculasAtivas`, etiqueta a turma com 2+ matrículas); `renderCalendario()` l. 4595; `renderAulaHoje()` l. 4839.
- **Comportamento atual**: fazer blocos numa turma não move o contador da outra.
- **Exceções**: as questões em si são banco único da demo (RN-59, comentário l. 6259–6263); marcos do Quad e compras da conta aparecem em qualquer turma (CHANGELOG 28/07).
- **Dados envolvidos**: `BLOCOS_TURMA`, `NOITE_RESG`, `AVISOS[].alvo`, `MATERIAIS[].turma`.
- **Sistema aplicador**: sistema pedagógico + banco central de questões + banco de dados (estado por aluno×turma).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

### RN-12 — Cronograma é da TURMA (chave = id)
- **Área**: Pedagógico/Coordenação.
- **Regra**: A grade semanal é indexada pelo id da turma (não por tipo+turno); turma nova nasce com grade em branco e turma removida some da grade.
- **Fonte documental**: decisão 163 (corrige a colisão tipo+turno) e 78; CHANGELOG 28/07 ("A grade do cronograma passou a ser da TURMA").
- **Evidência no código**: `CRONO.turmas` chaveada por `'rondesp-n'`, `'patamo-n'`, `'bope-n'` l. 4745–4774; `cronoKey(t)` retorna `t.id` l. 4781; `sincronizarCronoTurmas()` l. 4782–4795 (cria grade em branco, apaga turma morta); comentário l. 4778–4780.
- **Comportamento atual**: duas turmas de mesmo tipo/turno têm grades independentes; "Aula de hoje" de turma sem grade mostra "A definir" (dec. 151).
- **Exceções**: —.
- **Dados envolvidos**: `CRONO`, `CRONO_LOG` (l. 10232), `ALUNO_TURMA`.
- **Sistema aplicador**: sistema pedagógico/painel administrativo — a decisão 27 e o CHANGELOG 19/07 citam a planilha da coordenação como origem (`[INTEGRAÇÃO REAL]`).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (planilha/ERP acadêmico).
- **Divergências**: comentário residual em `definirTurmaAtiva()` l. 3873–3874 ainda diz que "a chave do cronograma continua sendo tipo + turno", mas o código chama `cronoKey(t)`, que retorna o id — divergência comentário × código, sem efeito funcional. DIVERGÊNCIA DOCUMENTAL (leve).
- **Decisão pendente**: —.

### RN-13 — Criação/edição de turma só no Painel de controle, com validações
- **Área**: Painel administrativo.
- **Regra**: Turma nasce apenas no Painel de controle (tipo com nome real + apelido, concurso derivado da Estrutura, dois tempos seguidos, turno derivado do horário, sala, preços e vagas por moeda); a edição grava no mesmo id preservando matrículas; a remoção é travada se houver matrícula ativa.
- **Fonte documental**: decisões 53, 60, 79, 138, 139, 140, 141 e 155.
- **Evidência no código**: `MODALIDADES` (nivelamento/regular/questões; RONDESP/PATAMO/BOPE como apelidos) l. 4134–4138; `turnoDoHorario()` l. 4141–4145; validação de lotação da sala l. 8524 (turma) e l. 8473 (isolada); concursos derivados da Estrutura (`CONCURSOS`) l. 4122–4129.
- **Comportamento atual**: pedir mais vagas do que a sala comporta barra com "A Sala X comporta N pessoas".
- **Exceções**: isoladas seguem formulário adaptado (dias da semana, horário único, um professor — dec. 94).
- **Dados envolvidos**: `TURMAS_LOJA`, `ISOLADAS` (l. 8881–8888), `CONCURSOS`, `SALA_CAP`.
- **Sistema aplicador**: painel administrativo + matrículas + plataforma de cursos.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END; a leitura do PDF do edital é `[INTEGRAÇÃO REAL]` (l. 2517) → DEPENDE DE SISTEMA EXTERNO.
- **Divergências / Decisão pendente**: —.

---

## 5. Espaço físico e lotação

### RN-14 — Lotação fixa por sala (155/85/125/185) limita vagas
- **Área**: Espaço físico/Operação.
- **Regra**: Sala 1 = 155, Sala 2 = 85, Sala 3 = 125, Sala 4 = 185 lugares; turma, isolada e simulado não abrem com mais vagas do que a sala comporta.
- **Fonte documental**: decisão 179 (28/07); CHANGELOG 28/07 item 4.
- **Evidência no código**: `SALA_CAP` l. 8922; validações l. 8473 (isolada), 8524 (turma), 11181 (simulado); seeds ajustadas à regra (RONDESP 145+10, PATAMO 75+10, BOPE 115+10) l. 3843–3845.
- **Comportamento atual**: o mapa de salas mostra "Sala 1 · 155 lugares" (l. 9027).
- **Exceções**: Estúdio/online sem limite físico (l. 4374–4377); `salaCap()` responde 0 (sem limite) se a tabela ainda não carregou (l. 8923–8927).
- **Dados envolvidos**: `SALA_CAP`, `SALAS`, `ESTUDIO`.
- **Sistema aplicador**: painel administrativo/eventos — o cadastro do espaço físico deve ser configurável, não fixado em código.
- **Classificação**: CONFIRMADO NO CÓDIGO + DEPENDE DO BACK-END (parâmetro de configuração).
- **Divergências**: —.
- **Decisão pendente**: DECISÃO TÉCNICA PENDENTE — onde vive o cadastro de salas no sistema real.

### RN-15 — Evento presencial herda a lotação da sala; lotado vira LOTADO
- **Área**: Eventos/Loja.
- **Regra**: A lotação do evento presencial são as cadeiras da sala escolhida; atingida, o item vira LOTADO na vitrine, no carrossel e na compra.
- **Fonte documental**: decisão 179; CHANGELOG 28/07 item 4.
- **Evidência no código**: `evLot()` l. 4375–4378 (`ev.lot || salaCap(ev.sala)`); `evLotado()` l. 4382–4385; recusa na compra l. 4403 e na inscrição gratuita l. 4534; tag LOTADO no tile l. 4305 e na vitrine l. 4364; hook de teste `window.__evLotar` l. 4386–4392.
- **Comportamento atual**: `__evLotar('aulao-especial', 85)` faz o card virar LOTADO.
- **Exceções**: eventos online (Estúdio) nunca lotam.
- **Dados envolvidos**: `EVENTOS[].sala/ocup`, `evState`, `SALA_CAP`.
- **Sistema aplicador**: eventos + painel administrativo (contagem real de inscritos no banco).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE (ocupação semente) + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

### RN-16 — Reserva de sala unificada: uma sala não aceita duas atividades no mesmo dia/horário
- **Área**: Espaço físico.
- **Regra**: Turmas, isoladas, simulados presenciais e eventos reservam as mesmas 4 salas; o sistema barra choque de sala (mesmo dia da semana + horários cruzados + períodos cruzados) e o aviso confere contra o dia/horário digitados.
- **Fonte documental**: decisões 129, 130, 134 e 135; CHANGELOG 26/07 e 27/07.
- **Evidência no código**: `salaOcupacoes()` l. 8942–8969 (turmas, isoladas, eventos, simulados); `salaConflito()` l. 8971–8980; `salaEcoHTML()` l. 9002–9015; mapa `renderSalas()` l. 9017 em diante.
- **Comportamento atual**: escolher sala ocupada mostra "já tem Turma PATAMO nesse dia e horário… escolha outro espaço".
- **Exceções**: —.
- **Dados envolvidos**: `SALAS`, `TURMAS_LOJA`, `ISOLADAS`, `EVENTOS`, `SIMULADOS`.
- **Sistema aplicador**: eventos/agenda + painel administrativo (agenda física central).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-17 — Evento online SELECIONA o Estúdio (reserva obrigatória, não automática)
- **Área**: Eventos/Estúdio.
- **Regra**: Ao criar evento online, o criador deve selecionar o Estúdio (seletor ativo e vazio); sem seleção o evento não é criado, e duas transmissões no mesmo dia/horário são barradas.
- **Fonte documental**: decisão 131 (reserva automática) REVOGADA pela 136 (seleção manual); CHANGELOG 27/07.
- **Evidência no código**: `admEvSalaOpcoes()` l. 10618–10631 (comentário "escolhe mesmo, o seletor fica ativo e vazio"); validação l. 10692–10700 ("Evento online ocupa o Estúdio… selecione-o para reservar o espaço" e conflito "O Estúdio já tem…"); edição devolve o Estúdio marcado l. 10535–10536; cancelamento libera a sala l. 10554.
- **Comportamento atual**: criar online sem Estúdio marca o campo em vermelho com aviso fixo.
- **Exceções**: —.
- **Dados envolvidos**: `ESTUDIO`, `EVENTOS[].online/sala`.
- **Sistema aplicador**: eventos + agenda do Estúdio.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

---

## 6. Economia: moedas, compras, estoque e estornos

### RN-18 — Duas moedas: Quad Coin (conquistada) × Diamante (comprada em dinheiro)
- **Área**: Economia.
- **Regra**: Quad Coin é conquistado em missões/atividades e gasto na Loja; Diamante nunca é conquistado — chega por recarga no checkout do site ou por gift card de liberação única — e os produtos vendem em QdC OU Dmn, com vagas e preços POR MOEDA.
- **Fonte documental**: decisões 11, 48, 49, 61 e 155; CHANGELOG 24/07 ("Diamante (nova moeda)").
- **Evidência no código**: `var score = 1240; // Quad Coins (moeda da Loja — NÃO é o score de carreira)` l. 3672; `diamantes = 150` + `addDiamante()` l. 3768–3778 (comentário: "gift card presencial de liberação única. [INTEGRAÇÃO REAL] crédito do site", l. 3770); preços/vagas por moeda em turmas (RN-06) e simulados (RN-37); mensagem "Diamantes insuficientes — recarregue no site do Quad ou resgate um gift card" l. 8664.
- **Comportamento atual**: dois saldos no topo; pop-up "Creditar em" nas compras de duas moedas.
- **Exceções**: itens de combate são sempre em QdC (dec. 97/109; l. 9631).
- **Dados envolvidos**: `score`, `diamantes`, `GIFT_CARDS`, `GIFT_LOTES`.
- **Sistema aplicador**: financeiro/pagamentos (crédito de Dmn) + back-end de gamificação (QdC) + checkout do site.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (checkout) + DEPENDE DO BACK-END.
- **Divergências**: (a) a variável interna da moeda chama-se `score`, colidindo conceitualmente com o score de carreira (`carreira.score*`) — legado do período da decisão 11; (b) a rev. 2.3 não prevê segunda moeda (Diamante) nem economia ativa na V0, e o Anexo A prevê Quadcoin nascendo por "Marcos de Conquista" com ledger — no protótipo o QdC nasce por conversão direta de atividade (+5 por bloco, +2 por acerto de simulado digital, +1 por noite, +15 no garimpo), sem Marcos, sem Score Qualificado e sem ledger. DIVERGÊNCIA DOCUMENTAL (a maior do projeto — ver seção 15).
- **Decisão pendente**: DECISÃO DE PRODUTO PENDENTE — rev. 2.4 do documento-base (absorver QdC direto por atividade + Diamante, ou manter o Anexo A como alvo); DECISÃO TÉCNICA PENDENTE — renomear `score` → `qdc` no código.

### RN-19 — Economia é DA PESSOA, não da turma
- **Área**: Economia/Gamificação.
- **Regra**: Score, patente, Quad Coins, Diamantes, mochila e avatar pertencem à conta; o "perfil da turma" é só uma visão — a carreira sobe de Soldado a Coronel independentemente de onde se estuda.
- **Fonte documental**: decisão 148 (28/07); CHANGELOG 28/07.
- **Evidência no código**: `carreira` (l. 3708–3718), `score` (l. 3672), `diamantes` (l. 3771), `MOCHILA` (l. 9610) e `fardaEscolhida` (l. 9714) são globais únicos, sem chave de turma — em contraste com `BLOCOS_TURMA` (l. 6264) e `NOITE_RESG` (l. 6610), que são por turma.
- **Comportamento atual**: trocar de turma ativa não muda saldos, patente nem mochila.
- **Exceções**: as recompensas de missões são geradas por turma (RN-11), mas creditam na conta única.
- **Dados envolvidos**: `carreira`, `score`, `diamantes`, `MOCHILA`.
- **Sistema aplicador**: cadastro geral de usuários + back-end de gamificação (carteira única por conta).
- **Classificação**: CONFIRMADO NO CÓDIGO + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

### RN-20 — Gift card de liberação única (lote com QR)
- **Área**: Economia.
- **Regra**: Gift cards nascem em lote no Painel de controle (quantidade × valor × moeda); cada código/QR vale uma única vez e o resgate credita na moeda do lote, invalidando o cartão na hora.
- **Fonte documental**: decisões 48 e 66; CHANGELOG 24/07 Fase D e 26/07 (validação conferida).
- **Evidência no código**: `resgatarGift()` l. 3791–3807 ("já foi resgatado (liberação única)", `hit.g.usado = true`); `GIFT_LOTES` l. 3783; leitor QR na Quad Store l. 9279 e 10118; geração de QR ilustrativo l. 10041 em diante, com comentário `[INTEGRAÇÃO REAL]` l. 10038–10040.
- **Comportamento atual**: reusar um código dá recusa; código de lote vale digitado ou "lido" pela câmera simulada (l. 3507).
- **Exceções**: códigos demo `QUAD-100`/`QUAD-500` existem fora de lote (l. 3781).
- **Dados envolvidos**: `GIFT_LOTES`, `giftUsados`.
- **Sistema aplicador**: financeiro + painel administrativo + geração/leitura reais de QR.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO; a câmera real é DEPENDE DO FRONT-END REAL.
- **Divergências / Decisão pendente**: —.

### RN-21 — Crédito manual de moedas pela administração (com motivo e histórico)
- **Área**: Governança/Financeiro.
- **Regra**: A administração credita QdC/Dmn manualmente (valor livre + motivo), caindo na carteira do aluno na hora — porta de entrada da recarga do site e do gift card presencial.
- **Fonte documental**: decisão 52; CHANGELOG 24/07 Fase 1.
- **Evidência no código**: formulário l. 2529–2535; `btnAdmCred` l. 9857–9874 (`CREDITOS.unshift`, credita via `addScore`/`addDiamante`).
- **Comportamento atual**: o crédito aparece no histórico e no saldo do aluno da demo.
- **Exceções**: contas-semente só registram o lançamento.
- **Dados envolvidos**: `CREDITOS`, `score`, `diamantes`.
- **Sistema aplicador**: financeiro + painel administrativo (com auditoria/logs).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-22 — Confirmação em toda compra
- **Área**: Loja.
- **Regra**: Toda compra pede confirmação — modal simples para item de unidade única, seletor de quantidade para item com estoque — antes de debitar.
- **Fonte documental**: decisão 50; CHANGELOG 24/07 ("Confirmação em toda compra").
- **Evidência no código**: `confirmarCompra()` l. 9236–9252; `abrirCompra()` (quantidade) l. 9224–9234; uso em turmas (via pop-up de moeda), eventos (l. 4406), simulados (l. 6528), combate (l. 9642), presenciais (l. 9258–9275); bypass no tutorial l. 8705–8706 ("no tutorial o QUAD conduz — sem modal").
- **Comportamento atual**: clique num item abre "Confirmar esta compra?" com preço/moeda e eventual aviso de choque de agenda.
- **Exceções**: tutorial.
- **Dados envolvidos**: `compraAtual`, `compraQtd`.
- **Sistema aplicador**: front-end real da loja + checkout.
- **Classificação**: CONFIRMADO NO CÓDIGO + DEPENDE DO FRONT-END REAL.
- **Divergências / Decisão pendente**: —.

### RN-23 — Estoque físico decresce e o item some ao acabar; pedido aberto não trava compra
- **Área**: Loja/Logística.
- **Regra**: Produto físico tem estoque decrescente; comprar N unidades baixa N, o pedido em aberto vira etiqueta (não bloqueia novas compras) e o item sai da Loja quando a última unidade acaba; digitais não têm limite.
- **Fonte documental**: decisões 34 e 170; CHANGELOG 28/07 item 9; digitais sem estoque: dec. 54.
- **Evidência no código**: `p.estoque -= compraQtd` l. 9266; recusa quando `estoque <= 0` l. 9211 ("acabou — o item saiu da Loja"); pedido como etiqueta l. 9200–9207 (`pedidosMeus`); toast "Era a última unidade — o item saiu da Loja" l. 9273–9274; `PROD_DESTINOS` l. 8836–8843.
- **Comportamento atual**: o estoque exibido no card cai a cada compra.
- **Exceções**: itens de combate NÃO seguem esta regra (RN-24); a entrega do pedido devolve o item à disponibilidade (dec. 34/74).
- **Dados envolvidos**: `ITENS_PRESENCIAIS[].estoque`, `PEDIDOS`.
- **Sistema aplicador**: estoque/logística (ERP) + painel administrativo + recepção.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (controle físico de estoque).
- **Divergências / Decisão pendente**: —.

### RN-24 — Item de combate: compra repetida, nunca sai da vitrine
- **Área**: Loja/Personagem.
- **Regra**: Item de combate não é de compra única nem tem estoque: fica sempre na Loja, pode ser comprado quantas vezes o aluno quiser e empilha na mochila com etiqueta "N na mochila"; sempre em QdC.
- **Fonte documental**: decisão 172 (28/07, revoga a 99 para itens de combate); CHANGELOG 28/07 ("Item de combate se repete").
- **Evidência no código**: `renderLojaCombate()` l. 9619–9636 (comentário cita a dec. 172; etiqueta "N na mochila" l. 9627); `mochilaComprar()` l. 9638–9653 (avisa "você já tem N", debita sempre em QdC, `MOCHILA.push`); a mochila conta "unidades · tipos" l. 9654–9663.
- **Comportamento atual**: comprar 3 facas mostra "3 na mochila" e o item continua à venda.
- **Exceções**: bloqueado durante o tutorial (l. 9639); item removido do catálogo sai das mochilas (dec. 166).
- **Dados envolvidos**: `ITENS_COMBATE`, `MOCHILA` (array de ids repetíveis).
- **Sistema aplicador**: back-end da loja/inventário do jogador.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

### RN-25 — Cadeia de skins e farda de escolha única; quem possui, veste
- **Área**: Personagem.
- **Regra**: As skins vêm em cadeia progressiva (boina → gandola → capa de colete → fuzil → farda final); a farda final é escolha ÚNICA (comprou uma, as outras fecham) e cada compra troca a foto do personagem automaticamente — não há equipar/desequipar manual.
- **Fonte documental**: decisões 19 e 25; CHANGELOG 20/07 ("fardas finais: preços oficiais e escolha única"; "comprar uma skin troca a foto em todas as representações").
- **Evidência no código**: `SKIN_CADEIA` l. 9702; `fardaEscolhida` l. 9714 (comentário "escolha ÚNICA: comprou uma farda, as outras fecham"); estado `fechada` l. 9716–9717; avanço da cadeia l. 9748–9751; estorno reabre a farda l. 11640–11651.
- **Comportamento atual**: comprada a farda CIPE, PATAMO/BOPE ficam indisponíveis; a foto do personagem troca (fotos injetadas pelo token `__FOTOS_VARIANTES__` no build).
- **Exceções**: estorno de skin desfaz a etapa e reabre a escolha (RN-28). O CHANGELOG 20/07 registra fase anterior em que era possível "juntar as três" fardas — a regra vigente é escolha única (dec. 19).
- **Dados envolvidos**: `SKIN_CADEIA`, `SKIN_FARDAS`, `skinEtapa`, `fardaEscolhida`, `lojaOwned`.
- **Sistema aplicador**: back-end da loja + inventário do jogador + CDN de assets.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

### RN-26 — Estorno em até 7 dias, com confirmação em dois toques
- **Área**: Economia/Pós-venda.
- **Regra**: Toda compra pode ser estornada em até 7 dias corridos, com contagem regressiva visível, confirmação em dois toques e devolução imediata da moeda usada.
- ***Nota 03/08 — "toda compra" foi superado pelas dec. 192/193 (02/08):*** a compra feita **durante o tutorial** (a boina) nasce marcada `semEstorno` e **nunca entra** na janela; e o **evento já realizado** sai da janela pela data (4º caminho de saída, ao lado dos 3 gatilhos de consumo da RN-27), tenha havido presença ou não. O item ganho no **DROP** (dec. 194) também fica fora, por não ser compra.
- **Fonte documental**: decisão 67; CHANGELOG 24/07 Fase D.
- **Evidência no código**: `estornoDias()` l. 11562; `renderEstornos()` l. 11563–11589 (estados FALTAM X DIAS / ÚLTIMO DIA / PRAZO ENCERRADO; dois toques l. 11580–11585); `estornar()` l. 11684–11695 (devolve via `addDiamante`/`addScore`, registra em `ESTORNOS`).
- **Comportamento atual**: compra de 8 dias atrás aparece com "PRAZO ENCERRADO" e botão desativado.
- **Exceções**: compra consumida sai da janela (RN-27).
- **Dados envolvidos**: `COMPRAS[].ts/estornado`, `ESTORNOS`.
- **Sistema aplicador**: financeiro/pagamentos (estorno real é bancário) + painel administrativo ("Estornos e desistências").
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (gateway) + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-27 — Consumo mata o estorno
- **Área**: Economia/Pós-venda.
- **Regra**: Liberar a entrada na portaria, liberar o inscrito do simulado ou entregar o produto físico marca a compra como consumida e a retira imediatamente da janela de estorno.
- **Fonte documental**: decisão 178 (28/07); CHANGELOG 28/07 item 3 ("participar do aulão e estornar depois lesaria a empresa").
- **Evidência no código**: `compraConsumida()` l. 11447–11457; chamadas na portaria l. 10869–10870 ("liberou a entrada = consumiu"), no simulado l. 11034 ("entrou na sala: sem estorno") e na entrega de produto l. 10789; filtro em `renderEstornos()` l. 11565–11566.
- **Comportamento atual**: após "Liberar entrada", o toast avisa "A compra saiu da janela de estorno" e o item some de "Estornos · até 7 dias".
- **Exceções**: —.
- **Dados envolvidos**: `COMPRAS[].consumido`.
- **Sistema aplicador**: back-end (transação atômica compra↔consumo) + recepção/portaria.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-28 — Estorno desfaz a aquisição por tipo
- **Área**: Economia.
- **Regra**: Além de devolver a moeda, o estorno desfaz a posse conforme o tipo: produto volta ao estoque e o pedido some; evento sai do calendário/carrossel; item de combate sai da mochila; skin sai do personagem (reabrindo a cadeia/farda); simulado sai da lista da recepção; matrícula devolve vaga e turno.
- **Fonte documental**: decisão 100 (25/07); CHANGELOG 25/07 ("Estorno desfaz a compra").
- **Evidência no código**: `desfazerCompra()` l. 11592–11683 (ramos matricula/combate/evento/simulado/skin/pres/item).
- **Comportamento atual**: estornar um evento remove o INSCRITO e devolve o card à vitrine.
- **Exceções**: —.
- **Dados envolvidos**: `COMPRAS`, `MOCHILA`, `evState`, `SIMULADOS`, `SIM_INSC`, `PEDIDOS`, `MATRICULAS`.
- **Sistema aplicador**: back-end da loja/inventário + financeiro.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-29 — Relatório de compras do aluno (situação por tipo)
- **Área**: Loja/Transparência.
- **Regra**: O aluno vê suas compras por período (semanal/mensal/trimestral/semestral) em três estados — em andamento (com % de evolução), aguardando retirada/realização e entregue/concluído — e estornos saem do relatório.
- **Fonte documental**: decisão 119; CHANGELOG 26/07 ("Relatório de compras").
- **Evidência no código**: `renderRelCompras()` l. 11522–11548; `rcSituacao()` l. 11476–11511; filtro `!cp.estornado` l. 11526.
- **Comportamento atual**: entrega confirmada na recepção muda a coluna na hora.
- **Exceções**: —.
- **Dados envolvidos**: `COMPRAS`, `PEDIDOS`, `SIM_INSC`, `EVENTOS`, `PROD_AGENDA`.
- **Sistema aplicador**: back-end da loja + relatórios.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

---

## 7. Agenda e choque de horário

### RN-30 — "EM CHOQUE" avisa sem impedir; matrícula em turma é a exceção barrada
- **Área**: Agenda do aluno.
- **Regra**: Turma, isolada, evento e simulado presencial ocupam dia + faixa de horário; comprar algo que choca mostra a etiqueta "EM CHOQUE" na vitrine e um aviso na confirmação (a decisão é do aluno, sem reposição/devolução por ausência) — mas matrícula em turma sobreposta continua bloqueada.
- **Fonte documental**: decisão 101 (bloqueio) evoluída pelas 104 e 107 (aviso sem impedir); CHANGELOG 26/07 ("Em choque com compra assumida").
- **Evidência no código**: `choqueDeAgenda()` l. 9100; `agendaDoEvento()` l. 9083; etiqueta EM CHOQUE no tile l. 4306 e na vitrine de simulados l. 6473; aviso `avisoChoque` anexado à confirmação l. 4404–4407 e 6489–6496; matrícula barrada em `matricular()` l. 8759–8761 ("matrícula em turma não pode se sobrepor").
- **Comportamento atual**: evento no horário da turma aparece esmaecido com preço laranja; a compra prossegue após o aviso.
- **Exceções**: simulado digital não trava por choque (dec. 123; l. 11047); matrícula em turma barrada.
- **Dados envolvidos**: agenda derivada de `MATRICULAS`, `ISOLADAS`, `evState`, `SIMULADOS`.
- **Sistema aplicador**: app real (front-end) + back-end de agenda.
- **Classificação**: CONFIRMADO NO CÓDIGO + DEPENDE DO FRONT-END REAL + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-31 — Expiração vale em todas as vitrines e no calendário; 7 dias nas missões
- **Área**: Agenda/Missões.
- **Regra**: O que vence some do carrossel, da vitrine e do calendário (ficando só no histórico); bloco de missão sem resposta expira em 7 dias e cai em "Atrasadas"; abrir a tela revalida.
- ***Nota 03/08 — a parte "some do calendário" foi superada pela dec. 192 (02/08):*** o **evento presencial em que o aluno se inscreveu não some mais do calendário** ao vencer — vira **CONCLUÍDO** (entrada liberada na portaria) ou **FALTOSO** (o dia passou sem registro). Só o **evento online** continua saindo, por não passar pela portaria. Carrossel e vitrine seguem como descrito, e a expiração de 7 dias das missões não mudou.
- **Fonte documental**: decisões 102 e 106; CHANGELOG 25/07 e 26/07.
- **Evidência no código**: `evAcabou()` l. 4393–4397; `eventosInicio()` filtra vencidos l. 4320–4322; `DIA_EXPIRA_DIAS = 7` l. 6248; `renderAtrasadas()` l. 6312–6325; `missoesDaNoite()` l. 6559–6564.
- **Comportamento atual**: seeds com `idadeDias: 8..10` aparecem em Atrasadas (l. 6250–6254).
- **Exceções**: o histórico de compras preserva o registro.
- **Dados envolvidos**: `DIA_BLOCOS/BLOCOS_TURMA[].criadoEm`, `EVENTOS[].dataISO/ate`.
- **Sistema aplicador**: back-end pedagógico (agenda de missões) + eventos.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

---

## 8. Eventos

### RN-32 — Eventos são DO QUAD, genéricos (sem segmentação por turma)
- **Área**: Eventos.
- **Regra**: Todo evento vigente aparece para qualquer aluno, em qualquer turma — a segmentação "Quem vê este evento" foi removida; avisos continuam por turma (RN-53).
- **Fonte documental**: decisão 150 (criou turma-alvo) REVOGADA pela 161 (28/07, decisão do gestor); CHANGELOG 28/07 ("Eventos voltaram a ser do Quad").
- **Evidência no código**: `eventosInicio()` l. 4320–4322 com comentário "eventos são do QUAD, não de uma turma (dec. do gestor, 28/07)"; nenhum campo turma-alvo em `EVENTOS` l. 4226–4262.
- **Comportamento atual**: trocar de turma ativa não muda o carrossel de eventos.
- **Exceções**: avisos permanecem segmentados por turma (RN-53).
- **Dados envolvidos**: `EVENTOS`.
- **Sistema aplicador**: sistema de eventos.
- **Classificação**: CONFIRMADO NO CÓDIGO (regra de produto explícita do gestor).
- **Divergências / Decisão pendente**: —.

### RN-33 — Evento gratuito × pago; online libera link; +BÔNUS
- **Área**: Eventos/Loja.
- **Regra**: Evento gratuito entra direto no carrossel e pode premiar (selo +BÔNUS quando tem score/coins); evento pago aparece no carrossel com "NA LOJA" (clique leva ao item exato), é vendido na Loja em QdC ou Dmn e, comprado, vira INSCRITO e entra no calendário; online libera o link ao inscrito.
- **Fonte documental**: decisões 36, 40, 58, 73, 110 e 173.
- **Evidência no código**: comentários l. 4219–4225; `comprarEvento()` l. 4398–4421 (debita, marca `comprado/inscrito`, entra na portaria e no calendário, "link na página do evento"); tags NA LOJA/INSCRITO/+BÔNUS l. 4304–4309; `evTemBonus()` l. 4268–4271; clique leva ao item com `lojaLevarAte()` l. 4457–4488 (dec. 173).
- **Comportamento atual**: comprar o "Aulão especial" muda a tag para INSCRITO no carrossel.
- **Exceções**: evento de vários dias (`ate`) permanece na vitrine marcado INSCRITO até o último dia (dec. 58; ex.: Semana Insana l. 4252–4256).
- **Dados envolvidos**: `EVENTOS`, `evState`, `LINKS_ONLINE` (l. 8701).
- **Sistema aplicador**: eventos + loja/checkout + notificações (entrega do link).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-34 — Criação, edição e cancelamento de eventos pela administração
- **Área**: Eventos/Admin.
- **Regra**: A administração cria eventos (data + início + término, modalidade, sala/Estúdio, professores por chips do Banco, preço/moeda, regras de score/coins), edita preservando inscritos e cancela pelo ✕ — o evento sai da Loja, do carrossel, dos calendários e da portaria na hora.
- **Fonte documental**: decisões 30, 37, 38, 73, 87 e 180.
- **Evidência no código**: campos `EV_CAMPOS` l. 10661; validação com aviso fixo l. 10686–10700; edição l. 10508–10537; `cancelarEvento()` l. 10544–10554 (libera sala/Estúdio); professores no evento `evProfs()` l. 4263–4266.
- **Comportamento atual**: evento criado aparece no carrossel, na Loja (se pago), no mapa de salas e nas Autorizações de acesso.
- **Exceções**: —.
- **Dados envolvidos**: `EVENTOS`, `ACESSO_ST`, `DOCENTES`.
- **Sistema aplicador**: painel administrativo + eventos.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-35 — Portaria sincronizada: inscrição real, entrada liberada consome
- **Área**: Eventos/Recepção.
- **Regra**: As "Autorizações de acesso" listam apenas eventos presenciais vigentes (nome, quando, sala, lugares); o aluno entra na lista ao comprar/inscrever-se e sai ao cancelar; "Liberar entrada" marca a presença e consome a compra (RN-27).
- **Fonte documental**: decisão 180 (28/07) + 178; CHANGELOG 28/07 item 5.
- **Evidência no código**: `ACESSO_ST` l. 10820; `acessoListaDe()` l. 10821–10833 (aluno entra/sai conforme `evState`); `acessosGrupos()` exclui online e vencidos l. 10834–10839; liberar entrada l. 10859–10875 (chama `compraConsumida`).
- **Comportamento atual**: comprar evento presencial coloca "você" na lista da portaria na hora.
- **Exceções**: eventos online não passam na portaria (l. 10836).
- **Dados envolvidos**: `ACESSO_ST`, `evState`, `COMPRAS`.
- **Sistema aplicador**: recepção/portaria (check-in físico, leitura de QR/credencial) + eventos.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (controle de acesso físico).
- **Divergências / Decisão pendente**: —.

---

## 9. Simulados

### RN-36 — Simulado presencial é sempre vendido, nunca gratuito e nunca premia QdC
- **Área**: Simulados.
- **Regra**: O simulado presencial ocupa lugar na sala, é sempre vendido (QdC ou Dmn) e não premia Quad Coins — a liberação na entrada confirma presença e pontua score; prêmio em QdC é exclusivo do digital.
- **Fonte documental**: decisões 117b, 122 e 128; CHANGELOG 26/07.
- **Evidência no código**: `simRec()` l. 6350–6351 ("presencial não premia"); `admSimToggle()` l. 11048–11069 (força tipo "pago" no presencial, l. 11051); `simInscrever()` l. 6434–6440; `renderSimulados()` l. 6390–6394 ("presencial é sempre vendido: a inscrição é a compra na Loja").
- **Comportamento atual**: lançar presencial no admin desabilita o seletor "gratuito".
- **Exceções**: aulões e eventos seguem podendo ser gratuitos e premiar — a regra vale só para simulados (dec. 117b).
- **Dados envolvidos**: `SIMULADOS`, `SIM_INSC`.
- **Sistema aplicador**: sistema de simulados/pedagógico + loja + portaria.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências**: a decisão "128" tem numeração ambígua no registro (colisão de números — ver seção 15).
- **Decisão pendente**: —.

### RN-37 — Vagas do simulado presencial por moeda; sala lota por moeda
- **Área**: Simulados/Loja.
- **Regra**: O presencial tem vagas divididas por moeda ("Vagas em Diamantes" + "Vagas em Quad Coins", soma = lotação ≤ capacidade da sala); a compra abre o pop-up "em qual moeda", dá baixa só no estoque daquela moeda, e vagas esgotadas tiram o item da vitrine.
- **Fonte documental**: decisões 117, 117c, 124, 155 e 179.
- **Evidência no código**: `simVagas()` l. 6336–6345; `simTomaVaga()` l. 6352–6361; `escolherMoedaSim()` l. 6511–6525; `finalizarCompraSim()` l. 6526–6547 (recusa "Sala lotada — a última vaga em X acabou"); validação de lotação l. 11181; vitrine esconde esgotado l. 6443–6448.
- **Comportamento atual**: o card mostra as vagas restantes por moeda (ex.: "50 Dmn · 10 QdC").
- **Exceções**: simulado antigo sem controle de sala passa direto (l. 6355).
- **Dados envolvidos**: `SIMULADOS[].vagas*Rest`.
- **Sistema aplicador**: sistema de simulados + loja + banco de dados (reserva atômica de vaga).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

### RN-38 — Simulado digital: sem limite de vagas, duas moedas, pode ser gratuito e premia por acerto
- **Área**: Simulados.
- **Regra**: O digital não tem limite de vagas nem trava por choque, vende nas duas moedas (ou é gratuito) e, respondido no quiz cronometrado, paga +10 de score e +N QdC por acerto (N configurado no lançamento, padrão 2).
- **Fonte documental**: decisões 45, 123 e 125; CHANGELOG 21/07 e 26/07 ("recompensa por acerto passa a valer").
- **Evidência no código**: comentário l. 11045–11047; `simRec()` l. 6351 (`sm.rec > 0 ? sm.rec : 2`); dica "+10 score e +N QdC por acerto" l. 6369; pagamento real `hits * 10` l. 7700; extração das questões do PDF marcada `[INTEGRAÇÃO REAL]` (na demo vale o banco único — RN-59).
- **Comportamento atual**: concluir (ou zerar o tempo) corrige e credita; o simulado fica REALIZADO e não repete.
- **Exceções**: digital pago só abre depois de comprado (`simAtivo()` l. 6331–6335).
- **Dados envolvidos**: `SIMULADOS`, `SIM_HIST`.
- **Sistema aplicador**: sistema de simulados + banco central de questões + back-end de gamificação.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (parser de PDF) + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-39 — Presença em simulado gera score; liberação leva ao histórico e consome
- **Área**: Simulados/Recepção.
- **Regra**: "Liberar entrada" do inscrito pontua score sempre (QdC só quando a atividade premia), envia o simulado ao histórico de realizados do aluno e consome a compra.
- **Fonte documental**: decisões 43, 128 e 178; CHANGELOG 26/07 e 28/07.
- **Evidência no código**: `liberarInscrito()` l. 11015–11042 (score em `carreira.score*`; `geraQdC` condicional l. 11024; `sm.realizado = true` + `compraConsumida('simulado', …)` l. 11032–11035; `SIM_HIST.unshift` l. 11035).
- **Comportamento atual**: toast "Entrada liberada — presença confirmada (+120 score)".
- **Exceções**: —.
- **Dados envolvidos**: `SIM_INSC`, `SIM_HIST`, `carreira`.
- **Sistema aplicador**: portaria + back-end de gamificação + sistema pedagógico (histórico como base pedagógica — dec. 47).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-40 — O bloco de Simulados mora no Calendário (não em Missões)
- **Área**: Navegação/Simulados.
- **Regra**: A lista de simulados e o histórico ficam no Calendário, abaixo da agenda; Missões fica com flashcards, "Hoje" e Atrasadas.
- **Fonte documental**: decisão 165; CHANGELOG 28/07 item 3.
- **Evidência no código**: `renderSimulados()` / `simHistCard` (l. 6379 em diante e 6548–6557) renderizam nos containers da view de calendário.
- **Comportamento atual**: aba Calendário exibe agenda + simulados + histórico.
- **Exceções / Dados**: — / `SIMULADOS`, `SIM_HIST`.
- **Sistema aplicador**: app real (front-end).
- **Classificação**: CONFIRMADO NO CÓDIGO + DEPENDE DO FRONT-END REAL.
- **Divergências / Decisão pendente**: —.

---

## 10. Gamificação: score, patentes, promoções e recompensas

### RN-41 — Três scores separados dos Quad Coins; score não é moeda e não promove sozinho
- **Área**: Gamificação.
- **Regra**: O aluno tem score de carreira (nunca zera), score de patente e score de temporada, separados dos Quad Coins; atingida a meta da patente, o score apenas LIBERA a prova de promoção — não promove sozinho.
- **Fonte documental**: CHANGELOG 18/07 ("gamificação: patentes, score e prova de promoção"); decisão 11 (divergência da rev. 2.3); rev. 2.3 Anexo A ("Score não é moeda e não é gasto").
- **Evidência no código**: `carreira.scorePatente/scoreCarreira/scoreTemporada` l. 3708–3718; `GAMI.patentes[].pontos` com comentário "score necessário para liberar a prova" l. 3687–3703; estado `disponivel` exigido em `abrirProva()` l. 7549; comentário l. 3706–3707 ("a interface nunca decide sozinha quantos pontos foram conquistados").
- **Comportamento atual**: barra do score da patente (ex.: 620/900) e estrela de prova disponível.
- **Exceções**: —.
- **Dados envolvidos**: `GAMI`, `carreira`.
- **Sistema aplicador**: back-end de gamificação.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências**: a variável `score` (l. 3672) guarda a MOEDA, não o score — ver RN-18.
- **Decisão pendente**: —.

### RN-42 — 14 patentes em 4 fases, com notas mínimas crescentes
- **Área**: Gamificação/Carreira.
- **Regra**: A carreira vai de Aluno Soldado Quad a Coronel Quad (14 patentes) em 4 fases com nota mínima de prova crescente (70/75/80/85%), configuradas centralmente (o admin ajustará no sistema real).
- **Fonte documental**: CHANGELOG 18/07 (seções 34–35 do documento-base); decisão 133 (trilha sem cadeados).
- **Evidência no código**: `GAMI` l. 3678–3704; `patenteAtual()/proximaPatente()` l. 3719–3720; trilha sem cadeado l. 1525–1526.
- **Comportamento atual**: trilha da jornada no Quadrômetro com ✓/●/★.
- **Exceções**: Coronel é a patente máxima (`pontos: null`).
- **Dados envolvidos**: `GAMI`, `carreira`.
- **Sistema aplicador**: back-end de gamificação + painel administrativo (parametrização).
- **Classificação**: CONFIRMADO NO CÓDIGO (estrutura) + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências**: `GAMI.fases[].notaMin` existe (70–85%), mas a prova usa `PROVA_APROV = 0.80` fixo (l. 7521 e 7585) — a nota mínima POR FASE não é aplicada. DIVERGÊNCIA DOCUMENTAL (código × CHANGELOG 18/07, "aprovação pela nota mínima da fase").
- **Decisão pendente**: DECISÃO TÉCNICA PENDENTE — aplicar `notaMin` por fase ou remover a configuração.

### RN-43 — Prova de promoção automática: 20 questões difíceis do próprio aluno, 80% promove, reprovação bloqueia 24h
- **Área**: Gamificação (promoções).
- **Regra**: A prova de promoção (sem fiscal humano) monta 20 questões que o aluno classificou como Errei/Difícil (sem revelar isso a ele), exige 80% para promover na hora — transferindo o score excedente para a próxima patente — e a reprovação bloqueia nova tentativa por 24h.
- **Fonte documental**: decisão 23 (20/07); CHANGELOG 20/07 ("prova automática").
- **Evidência no código**: `PROVA_APROV = 0.80` l. 7521; `provaColeta()` l. 7532–7545 (prioriza notas 0/1 dos flashcards; comentário l. 7517); `resultadoProva()` l. 7584–7620 (promoção com excedente l. 7592–7595; bloqueio `tentativaHoras: 24` l. 3680 e 7607–7608).
- **Comportamento atual**: reprovado vê "nova tentativa em 24 horas" + botão demo "Liberar nova tentativa (simulação)" l. 7614–7616.
- **Exceções**: existe um botão `[DEMO PROVISÓRIO — REMOVER]` "Passar prova pelo gabarito (demo) · sobe 1 patente" ativo no app (l. 1997–1998, 7740) — recurso de demonstração, NÃO é regra de produto; sua remoção está prometida no CHANGELOG 20/07.
- **Dados envolvidos**: `prova`, `carreira`, banco de flashcards com autoavaliação.
- **Sistema aplicador**: back-end de gamificação + banco central de questões (histórico de dificuldade por aluno).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Divergências**: a rev. 2.3 (§7) lista "patente dinâmica" como fora da V0 (identidade com patente fixa) — o protótipo antecipa item de V1. DIVERGÊNCIA DOCUMENTAL.
- **Decisão pendente**: DECISÃO TÉCNICA PENDENTE — remover o botão [DEMO PROVISÓRIO] antes de qualquer piloto.

### RN-44 — Recompensas de missões: flashcards, bloco da noite e garimpo
- **Área**: Gamificação/Missões.
- **Regra**: Flashcard paga por desempenho (+1 de score por acerto, +5 QdC por bloco de 10, e a barra do Domínio se move); noite completa paga +1 de score POR BLOCO + 1 Quad Coin no botão dourado "Retire aqui seus benefícios" (uma vez, por turma); eventos podem ter "garimpo" (+15 QdC, uma vez).
- **Fonte documental**: decisão 26; CHANGELOG 19/07 ("Treinamento Rápido") e 20/07 ("recompensa da noite"); eventos l. 4232–4241.
- **Evidência no código**: `resgatarBeneficios()` l. 6606–6628 (`scoreBonus = total` de blocos; `NOITE_RESG` por turma; `addScore(1, …)`); autoavaliação Errei/Difícil/Bom/Fácil l. 6798; redistribuição do baralho l. 6853; garimpo em `evState[].garimpado` (l. 4518–4520).
- **Comportamento atual**: o botão dourado vira "Benefícios retirados" e não paga de novo (l. 6590–6594).
- **Exceções**: o quiz da aula NÃO premia (RN-49); a Introdução fica fora da conta da noite (l. 6577).
- **Dados envolvidos**: `NOITE_RESG`, `carreira`, `score`, `trAj` (ajuste de Domínio).
- **Sistema aplicador**: back-end de gamificação + sistema pedagógico.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências**: mecânica de ganho direto por atividade diverge do Anexo A da rev. 2.3 (Marcos de Conquista) — ver RN-18 e seção 15.
- **Decisão pendente**: —.

### RN-45 — Introdução no Quad é DA CONTA (feita uma vez, some do bloco)
- **Área**: Gamificação/Onboarding.
- **Regra**: A "Introdução no Quad" é da conta, não da turma: feita uma vez (tutorial ou pular), fica registrada para sempre, persiste entre sessões e desaparece de "Hoje · questões novas".
- **Fonte documental**: decisões 157 e 177 (a 177 muda de "linha ✓" para "some do bloco").
- **Evidência no código**: `blocoIntroMarca()` l. 6874–6888 (`display: none` quando feita; `lsSet('vq_intro_done','1')`); leitura no boot l. 6884; hook `__introFeita` l. 6885–6888; `tutPular()` marca feita l. 7002.
- **Comportamento atual**: após tutorial/pular, a linha some mesmo em turma nova e após recarregar a página.
- **Exceções**: —.
- **Dados envolvidos**: chave `vq_intro_done`, `blocoIntroFeito`.
- **Sistema aplicador**: banco de dados (estado da conta).
- **Classificação**: CONFIRMADO NO CÓDIGO + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

---

## 11. Professor

### RN-46 — Login do professor por e-mail derivado do sobrenome + senha individual
- **Área**: Professor/Acesso.
- **Regra**: O professor entra com o e-mail funcional `<sobrenome>@quadconcursos.com.br` (derivado do nome, sem títulos/acentos) e senha própria (demo `quad1234`); o e-mail identifica o perfil — desligado, senha errada ou bloqueado são recusados com mensagens específicas.
- **Fonte documental**: decisão 83 substituída pela 85; decisão 68; CHANGELOG 25/07 ("Login do professor: e-mail e senha").
- **Evidência no código**: `emailDoProf()` l. 4917–4922; `docentePorEmail()` l. 4923–4926; `PROF_SENHA_DEMO = 'quad1234'` l. 4914; fluxo de recusas l. 4934–4941; troca de senha (mínimo 6 caracteres) l. 5000–5010.
- **Comportamento atual**: `moura@quadconcursos.com.br` + `quad1234` abre o painel do professor Danilo Moura.
- **Exceções**: cadastro novo nasce com a senha demo até trocar (l. 4913–4915; senha real definida no cadastro é `[INTEGRAÇÃO REAL]`).
- **Dados envolvidos**: `DOCENTES` (l. 3815–3822).
- **Sistema aplicador**: autenticação/autorização corporativa + cadastro de colaboradores.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências**: —.
- **Decisão pendente**: DECISÃO TÉCNICA PENDENTE — derivar login do sobrenome colide para sobrenomes iguais; o sistema real precisa de regra de desambiguação.

### RN-47 — Renomear professor PROPAGA (o nome é a chave) e muda o e-mail de acesso
- **Área**: Professor/Cadastro.
- **Regra**: Renomear um professor propaga para turmas (professores por matéria), isoladas, eventos, grade do cronograma, recados e sessão aberta; o e-mail de acesso acompanha o nome e o antigo deixa de valer na hora.
- **Fonte documental**: decisões 174 e 175; CHANGELOG 28/07 ("Edição do cadastro no Banco de professores").
- **Evidência no código**: `renomearDocente()` l. 8178–8206 (propaga em `TURMAS_LOJA.professores`, `ISOLADAS.prof`, `EVENTOS.profs`, `CRONO`, `RECADOS_PROF`, `PROF_ATUAL`); aviso do e-mail l. 8174–8175; validações (nome duplicado, ≥1 matéria, ≥1 turno) l. 8212–8221; aviso de matérias perdidas l. 8227–8234.
- **Comportamento atual**: editar o nome atualiza a grade, e o login antigo passa a ser recusado.
- **Exceções**: manter o próprio nome não é duplicidade.
- **Dados envolvidos**: `DOCENTES` e todos os pontos que citam o nome.
- **Sistema aplicador**: cadastro de colaboradores com ID estável + autenticação.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS.
- **Divergências**: —.
- **Decisão pendente**: DECISÃO TÉCNICA PENDENTE — usar o nome como chave é limitação do protótipo; o sistema real deve chavear por ID.

### RN-48 — Bloqueio/desligamento/exclusão do professor derrubam o acesso
- **Área**: Professor/Governança.
- **Regra**: Bloquear ou desligar o professor logado derruba a sessão com recado cordial no portão; apagar (✕ com confirmação em dois toques) é definitivo e o remove do banco, das turmas, dos eventos e da sessão.
- **Fonte documental**: decisões 89 e 90; CHANGELOG 25/07.
- **Evidência no código**: recusas no login l. 4938–4941; `profSaidaMsg` l. 4944 (recado no portão); ações Desligar/Bloquear/✕ em `renderDocList` (região l. 8100 em diante).
- **Comportamento atual**: bloquear quem está logado devolve ao portão com "temporariamente afastado…".
- **Exceções**: desligar/bloquear preservam o cadastro; apagar não.
- **Dados envolvidos**: `DOCENTES[].desligado/bloqueado`, `PROF_ATUAL`.
- **Sistema aplicador**: painel administrativo + autenticação (revogação de sessão).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-49 — Quiz da aula: por turma, 1–30 questões, 1–180 min, ativado pelo professor, sem gabarito e sem premiação
- **Área**: Professor/Sala.
- **Regra**: Cada turma tem seu quiz (`QUIZZES[turmaId]`); o professor cria por PDF (múltipla escolha ou certo/errado, 1–30 questões, 1–180 min), pode refazer/descartar enquanto não ativa, e o quiz ativado trava; o aluno responde sem ver gabarito e sem premiação — as respostas alimentam apenas o relatório ao vivo do professor.
- **Fonte documental**: decisões 64, 77 e 86; CHANGELOG 25/07 (duas entradas).
- **Evidência no código**: `QUIZZES` l. 5275 (por turmaId); "sem premiação" l. 3148, 4884 e 5495; envio sem gabarito l. 5470 e 5547; relatório começa em branco (dec. 83; CHANGELOG 25/07); limites e fluxo em `QZ_VAZIO` l. 5297.
- **Comportamento atual**: o aluno vê "AULA COM QUIZ" → "AULA COM QUIZ ATIVO" + botão Quiz; quiz de outra turma não aparece.
- **Exceções**: a extração do PDF é `[INTEGRAÇÃO REAL]` (l. 5277) — na demo vale o banco único (RN-59).
- **Dados envolvidos**: `QUIZZES`, `CRONO`.
- **Sistema aplicador**: sistema pedagógico + banco central de questões + relatórios ao vivo (back-end tempo real).
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (parser de PDF).
- **Divergências / Decisão pendente**: —.

### RN-50 — Escalação docente: só quem ministra a matéria e está ativo; vaga sem candidato fica aberta
- **Área**: Professor/Turmas.
- **Regra**: "Professores por matéria" oferece apenas docentes ativos que ministram a matéria (casamento por prefixo) e, sem candidato, a vaga fica em aberto — ninguém é escalado em matéria que não dá.
- **Fonte documental**: decisões 68 e 83; CHANGELOG 24/07 e 25/07; cronograma exige professor da matéria (dec. 91).
- **Evidência no código**: `docentesDaMateria()`/`materiaCasa()` l. 3825–3834; `ensureProfs()` l. 4889–4901 (comentário "sem professor DAQUELA matéria a vaga fica em aberto").
- **Comportamento atual**: matéria sem docente aparece sem nome na grade.
- **Exceções**: —.
- **Dados envolvidos**: `DOCENTES`, `TURMAS_LOJA[].professores`.
- **Sistema aplicador**: sistema pedagógico/painel administrativo.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-51 — Relatório de horas do professor derivado da grade e dos eventos
- **Área**: Professor/Informações.
- **Regra**: Aulas ministradas, horas em sala e eventos do professor são derivados da grade das turmas e dos eventos com o nome dele — nada é digitado à parte.
- **Fonte documental**: decisão 98; CHANGELOG 25/07 ("Informações do professor").
- **Evidência no código**: `eventosDoProf()` l. 4294–4296; `profAulasDeHoje()` l. 5013 em diante; `turmasDoProf()` l. 4908–4910; texto com `[INTEGRAÇÃO REAL] presença confirmada por chamada` l. 2220.
- **Comportamento atual**: painel "Informações" do professor exibe as contagens derivadas.
- **Exceções**: a presença confirmada por chamada é `[INTEGRAÇÃO REAL]`.
- **Dados envolvidos**: `CRONO`, `TURMAS_LOJA`, `EVENTOS`.
- **Sistema aplicador**: relatórios/inteligência de dados + RH.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

---

## 12. Permissões e comunicação

### RN-52 — Gate do administrador (N.P.P.): e-mail + chave da direção
- **Área**: Permissões.
- **Regra**: A área do administrador exige e-mail funcional + chave emitida pela direção (demo `NPP-2026`); sem liberação, o gate reaparece a cada troca para a persona admin.
- **Fonte documental**: decisão 20; CHANGELOG 20/07 ("área do administrador (N.P.P.)").
- **Evidência no código**: `btnAdmEntrar` l. 9786–9795 (`ch !== 'NPP-2026'` recusa; comentário `[INTEGRAÇÃO REAL] a chave é emitida e revogada pela direção, por pessoa` l. 9790); gate religado por persona l. 9932–9936; nota demo l. 3376.
- **Comportamento atual**: chave errada → "Chave inválida — solicite a liberação à direção". O e-mail NÃO é validado contra lista: qualquer texto com "@" passa (o placeholder `voce@quadconcursos.com.br` é só sugestão, l. 3369) — apenas a chave decide.
- **Exceções**: —.
- **Dados envolvidos**: `admLiberado`.
- **Sistema aplicador**: autenticação/autorização com RBAC por pessoa.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END. A aceitação de qualquer e-mail é fragilidade assumida da demo — HIPÓTESE de que será substituída por cadastro real de administradores.
- **Divergências / Decisão pendente**: —.

### RN-53 — Avisos com turma-alvo por ID
- **Área**: Comunicação.
- **Regra**: Cada aviso tem alvo "todas" ou o id de uma turma, e o aluno vê apenas os avisos da turma ATIVA (mais os gerais); o admin edita no lugar e remove.
- **Fonte documental**: decisão 149 (id no lugar de comparação por nome); CHANGELOG 28/07 ("Avisos ganharam turma-alvo de verdade").
- **Evidência no código**: `AVISOS[].alvo` l. 10149–10152; `avisoVisivel()` l. 10158–10161 (compara com `turmaAtivaId`); seletor l. 10162–10170; edição l. 10203–10229.
- **Comportamento atual**: aviso da PATAMO some ao trocar a turma ativa.
- **Exceções**: alvo de turma removida exibe "Turma encerrada" na lista do admin (l. 10156).
- **Dados envolvidos**: `AVISOS`, `turmaAtivaId`.
- **Sistema aplicador**: notificações + painel administrativo.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-54 — Mensagens por público
- **Área**: Comunicação.
- **Regra**: Além de aluno individual e professor, a administração envia mensagem para públicos — inscritos na turma, na isolada, no simulado, no evento, ou todos os alunos; o seletor mostra o alcance, o envio confirma "alcança N alunos" e a mensagem chega no chat com o público prefixado ("[Turma PATAMO] …").
- **Fonte documental**: decisão 181 (28/07); CHANGELOG 28/07 item 6.
- **Evidência no código**: `msgPublico()` l. 9950–9977 (resolve alvo/alcance/euDentro por tipo); envio l. 9980–10001 (prefixo `[alvo]` l. 9992; toast "alcança N" l. 9998); recado a professor chega na sala dele com contador l. 10002–10012; individual chega no "+" do aluno l. 10023–10033; leitura marca LIDA l. 9930–9934.
- **Comportamento atual**: mandar para "Turma PATAMO" entrega no chat do aluno da demo (que está nela).
- **Exceções**: alcance de públicos sem inscritos reais usa números-semente; "todos" = 1.286 fixo (l. 9974).
- **Dados envolvidos**: `ADM_MSGS`, `RECADOS`, `RECADOS_PROF`.
- **Sistema aplicador**: notificações/mensageria + banco de inscrições.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DO BACK-END. O chat ao vivo e a resposta do professor à recepção são APENAS VISUAL ("EM BREVE", decisões 52 e 92).
- **Divergências / Decisão pendente**: —.

### RN-55 — Ranking com privacidade de mão dupla; top 10 sempre visível
- **Área**: Ranking/Privacidade.
- **Regra**: Perfil privado mascara o nome de guerra (sobra a última letra: "AL SD QUAD ****A") E deixa de ver o nome dos outros a partir do 11º; perfil público vê quem também é público; o hall dos 10 primeiros aparece por inteiro para todos, e os pontos ficam sempre à vista.
- **Fonte documental**: decisão 132 evoluída pela 143; CHANGELOG 26/07 e 28/07.
- **Evidência no código**: `mascararNome()` l. 7303–7310; `rkNomeExibido()` l. 7316–7320 (`pos <= 10` sempre visível); `rkRow()` l. 7321–7322 (mão dupla: `me ? perfilPrivado : (perfilPrivado || !!privado)`); interruptor com explicação l. 7423–7438; vizinhos privados da demo l. 7453.
- **Comportamento atual**: ligar o modo privado mascara o próprio nome e o dos demais fora do hall.
- **Exceções**: quem entra no top 10 perde a máscara ("chegou lá, precisa ser visto").
- **Dados envolvidos**: `perfilPrivado`; rankings derivados da turma ativa (dec. 162 — classificação viva).
- **Sistema aplicador**: back-end de gamificação + preferências do usuário (banco) + política de privacidade real.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

---

## 13. Materiais, Domínio, questões e relatórios

### RN-56 — Materiais da aula: por turma, com download real e retirada do ar
- **Área**: Materiais.
- **Regra**: O material é publicado por turma → matéria (da árvore do edital dela) → assunto → tipo; chega etiquetado só para quem está na turma, baixa de verdade (arquivo vira objectURL; vídeo abre link) e o ✕ tira do ar liberando a memória; matrícula nova traz o material, estorno o leva embora.
- **Fonte documental**: decisões 144 e 164; CHANGELOG 28/07 (dois registros).
- **Evidência no código**: `MATERIAIS` l. 10344–10350; `renderMateriaisAluno()` l. 10353–10397 (filtro por `matriculasAtivas`, botão Baixar com `a.download` l. 10387–10393, etiqueta de turma com 2+ matrículas l. 10369–10370); publicação por árvore l. 10399–10416; remoção com `URL.revokeObjectURL` l. 10431–10438; estorno chama `renderMateriaisAluno` l. 11605.
- **Comportamento atual**: anexar um PDF no admin gera botão "Baixar" funcional no aluno.
- **Exceções**: materiais-semente sem arquivo mostram "material de exemplo" (l. 10394).
- **Dados envolvidos**: `MATERIAIS`, `admMatArqFile`.
- **Sistema aplicador**: sistema de materiais (storage/CDN) + plataforma de cursos.
- **Classificação**: CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (armazenamento de arquivos).
- **Divergências / Decisão pendente**: —.

### RN-57 — Domínio/árvore do edital segue a turma ativa; ajuste é POR CONCURSO
- **Área**: Pedagógico/Domínio.
- **Regra**: A árvore exibida no Domínio é a do concurso da turma ativa (trocada por `definirDominio`), o rodízio de flashcards segue o edital da turma ativa e o ajuste de progresso é chaveado pelo concurso — acerto na PC-BA não move barra homônima do CFO.
- **Fonte documental**: decisões 46, 153, 159 e 167; CHANGELOG 21/07 e 28/07.
- **Evidência no código**: `CONCURSOS` com árvores próprias l. 4122–4129; `definirDominio()` l. 7845–7848 (troca `CONCURSO_ATUAL_ID`/`EDITAL_ATUAL`); ajuste `trAj[CONCURSO_ATUAL_ID + '|' + mat + '|' + ass]` l. 4154–4157; chamada em `definirTurmaAtiva()` l. 3876; hook `window.__dominio` l. 7856; pedagógico por turma nos relatórios `relDadosTurma()` l. 11776–11782 (lê `t.concurso`).
- **Comportamento atual**: trocar a turma ativa troca a árvore na frente do aluno (faixa "Esta é a estrutura da Turma X" — dec. 153).
- **Exceções**: o progresso da V0 é determinístico por hash do nome (CHANGELOG 19/07 — números simulados); as árvores reais dos concursos não-CFO entram por upload do edital, `[INTEGRAÇÃO REAL]` (dec. 46; l. 2307).
- **Dados envolvidos**: `CONCURSOS`, `EDITAL_CFO/SOLDADO/PPBA/PCBA/PRF`, `trAj`.
- **Sistema aplicador**: sistema pedagógico + banco central de questões + inteligência de dados (a métrica de domínio calibrada é V1/V2 — rev. 2.3 §9.4: "nunca hardcoded").
- **Classificação**: CONFIRMADO NO CÓDIGO (mecânica) + APENAS VISUAL (os percentuais são sintéticos) + DEPENDE DO BACK-END.
- **Divergências**: o "painel de domínio visual completo" é item de V1 na rev. 2.3 (§7) — o protótipo antecipa. DIVERGÊNCIA DOCUMENTAL.
- **Decisão pendente**: —.

### RN-58 — Modalidades com régua teoria×questões (70/30, 50/50, 20/80)
- **Área**: Estrutura/Pedagógico.
- **Regra**: Turma de nivelamento (RONDESP) = 70% teoria / 30% questões; regular (PATAMO) = 50/50; de questões (BOPE) = 20/80 — quanto mais evoluída a turma, menos teoria.
- **Fonte documental**: decisões 46 e 138; CHANGELOG 21/07 ("Estrutura").
- **Evidência no código**: `MODALIDADES` l. 4134–4138 (campos `teoria/questoes`).
- **Comportamento atual**: rótulos e descrições nas telas de Estrutura/criação de turma.
- **Exceções**: a régua NÃO altera de fato a dosagem de conteúdo no protótipo — é atributo descritivo.
- **Dados envolvidos**: `MODALIDADES`.
- **Sistema aplicador**: sistema pedagógico (planejamento de grade real).
- **Classificação**: CONFIRMADO NO CÓDIGO (dado) + APENAS VISUAL (efeito pedagógico) + DEPENDE DO BACK-END.
- **Divergências / Decisão pendente**: —.

### RN-59 — Questões: banco único da demo; no sistema real, banco central alimentado por PDF
- **Área**: Pedagógico/Questões.
- **Regra**: No protótipo, flashcards, quizzes, provas de promoção e simulados digitais compartilham um banco único de questões da demo; no sistema real, as questões devem vir do banco central de questões, alimentado pela extração de PDFs (quiz da aula, simulado, edital) — fronteira marcada `[INTEGRAÇÃO REAL]` em todos os pontos.
- **Fonte documental**: CHANGELOG 21/07 (extração de PDF do simulado); decisões 64/77 (quiz por PDF) e 46 (edital por upload).
- **Evidência no código**: comentário l. 6259–6263 ("As questões em si são o banco único da demo"); `[INTEGRAÇÃO REAL] as questões saem da extração do PDF anexado` l. 5277 e `QZ_VAZIO` l. 5297; quiz padrão do simulado l. 7639; prova de promoção montada sobre o mesmo banco (`provaColeta()`, RN-43).
- **Comportamento atual**: o mesmo conjunto de questões serve todas as turmas e modalidades; o progresso por turma (RN-11) é separado, mas o conteúdo é compartilhado.
- **Exceções**: —.
- **Dados envolvidos**: banco de flashcards/questões da demo, `QUIZZES`, `SIMULADOS`.
- **Sistema aplicador**: banco central de questões + parser de PDF (sistema externo) + sistema pedagógico.
- **Classificação**: CONFIRMADO NO CÓDIGO (banco único na demo) + SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (extração de PDF) + DEPENDE DE BANCO DE DADOS.
- **Divergências**: —.
- **Decisão pendente**: DECISÃO TÉCNICA PENDENTE — contrato do parser de PDF e modelo do banco central de questões.

### RN-60 — Relatórios com dados vivos + sintéticos estáveis
- **Área**: Relatórios.
- **Regra**: Os relatórios do admin (Individuais/Turmas/Gerais/Loja) leem turmas, eventos e a árvore de Domínio atuais; os dados da conta desta sessão são reais, o resto é sintético determinístico (hash), com "sem inscritos" quando não há ninguém.
- **Fonte documental**: decisões 55, 70 e 80; CHANGELOG 24/07 Fase 3 e 25/07.
- **Evidência no código**: `relDadosAluno()` l. 11738–11758 (a conta real usa `COMPRAS`); `relComputeDif` sobre a árvore atual; seeds por `edHash`; "sem inscritos" l. 10925–10928.
- **Comportamento atual**: comprar algo na sessão muda o relatório da Loja na hora; os demais alunos são sintéticos.
- **Exceções**: reclamações/presença/satisfação são placeholders "EM BREVE" (dec. 55; l. 2954, 2983, 2987, 3009) — APENAS VISUAL.
- **Dados envolvidos**: `COMPRAS`, `TURMAS_LOJA`, `EVENTOS`, árvore de Domínio.
- **Sistema aplicador**: relatórios/inteligência de dados.
- **Classificação**: SIMULADO LOCALMENTE + APENAS VISUAL (parcial) + DEPENDE DE BANCO DE DADOS.
- **Divergências / Decisão pendente**: —.

### RN-61 — Comportamento e risco de abandono: previsto, não implementado
- **Área**: Inteligência de dados.
- **Regra (prevista, não implementada)**: O comportamento do aluno deve ser COMPUTADO, nunca gravado como rótulo ("Nenhum rótulo de perfil (Amigo/Craca) aparece"), com telemetria de origem da sessão e linha de base desde o dia 1; a detecção de risco de abandono é previsão documental da rev. 2.3, não funcionalidade do protótipo.
- **Fonte documental**: notas de V0 no próprio HTML l. 3636 e 3663; rev. 2.3 (§8 — taxonomia de origem e linha de base são PRÉ-REQUISITOS da V0; métrica-mãe = retorno espontâneo, só `OPEN_ORGANIC`); nenhuma decisão numerada implementa scoring de risco.
- **Evidência no código**: a "telemetria" é uma linha de texto estática no painel lateral — "Telemetria desta sessão · invisível ao aluno na versão real" l. 1813 e `origem: OPEN_ORGANIC · linha de base: ativa` l. 5644 (concatenação em 4710) — sem registro de eventos, sem taxonomia funcional, sem persistência; grep por "abandono/risco" só retorna textos descritivos.
- **Comportamento atual**: apenas a linha de telemetria decorativa no painel lateral.
- **Exceções**: —.
- **Dados envolvidos**: nenhum (não há coleta).
- **Sistema aplicador**: relatórios/inteligência de dados + eventos de uso (analytics).
- **Classificação**: APENAS VISUAL + HIPÓTESE (modelo de risco) + DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (analytics).
- **Divergências**: a rev. 2.3 declara que "a V0 não começa sem" a taxonomia de origem e a linha de base — o protótipo não as mede (esperado num protótipo navegável, mas precisa ficar explícito no planejamento da V0 real). DIVERGÊNCIA DOCUMENTAL.
- **Decisão pendente**: DECISÃO DE PRODUTO PENDENTE — o que dispara intervenção sobre risco de abandono e quem age (o Núcleo de Relacionamento? o professor?).

---

## 14. Regras presentes no código SEM decisão registrada

| Item | Evidência | Classificação |
|---|---|---|
| Filtro de palavrões no nome de guerra (`TUT_PALAVROES`, 7 termos) | l. 5699 e 5736 | CONFIRMADO NO CÓDIGO · DECISÃO DE PRODUTO PENDENTE (lista oficial e política de moderação) |
| Gate admin aceita qualquer e-mail (só a chave valida) | l. 9788–9791 | CONFIRMADO NO CÓDIGO (RN-52) |
| Login do aluno aceita qualquer e-mail+senha | l. 5633–5638 | CONFIRMADO NO CÓDIGO · DEPENDE DO BACK-END (RN-01) |
| Botão `[DEMO PROVISÓRIO]` de subir patente ainda ativo | l. 1997–1998 e 7740 | CONFIRMADO NO CÓDIGO · DECISÃO TÉCNICA PENDENTE (remoção prometida no CHANGELOG 20/07) |
| 31 hooks de teste `window.__*` expostos (`__admTudo`, `__eventos`, `__turmaAtiva`, `__evLotar`, `__dominio`, `__introFeita` etc.) | ex.: l. 3894, 4386, 6311, 6885, 7856 | CONFIRMADO NO CÓDIGO · DECISÃO TÉCNICA PENDENTE (política de hooks em produção) |

---

## 15. Divergências e pendências transversais

1. **Economia ativa na V0 × "Sem economia ativa" (a maior divergência de escopo).** A rev. 2.3 (§6/§7 e Anexo A) prevê V0 SEM economia ativa, com Intendência/ralos só na V1-A e valor real (dinheiro→moeda) apenas na V1-C, sob crivo Financeiro+Jurídico. O protótipo demonstra a Quad Store completa, duas moedas, gift cards, estornos e crédito manual — tudo SIMULADO LOCALMENTE. O CHANGELOG 18/07 registra a divergência como decisão do gestor. DIVERGÊNCIA DOCUMENTAL + DECISÃO DE PRODUTO PENDENTE: no piloto de 30 dias, a loja fica ligada, em modo vitrine ou desligada? Se ligada, o teste da métrica-mãe (retorno espontâneo) nasce contaminado pela economia — exatamente o que a rev. 2.3 quer isolar.
2. **Diamante não existe em nenhum documento-base.** A decisão 48 criou a moeda comprada em dinheiro; a rev. 2.3 só admite "complemento em Real" na V1-C. DIVERGÊNCIA DOCUMENTAL + DECISÃO DE PRODUTO PENDENTE (entrada na rev. 2.4 e governança da moeda).
3. **"Score não é moeda" × variável `score` = moeda.** A separação conceitual foi restabelecida no código (RN-41), mas a variável da moeda ainda se chama `score` (l. 3672) — armadilha para qualquer desenvolvedor futuro. DIVERGÊNCIA DOCUMENTAL (dec. 11, rev. 2.4 pendente) + DECISÃO TÉCNICA PENDENTE (renomear).
4. **Mecânica de ganho de QdC diverge do Anexo A.** Conversão direta por atividade (+5/bloco, +2/acerto, +1/noite, +15 garimpo) no lugar de Marcos de Conquista + Score Qualificado + ledger. DIVERGÊNCIA DOCUMENTAL + DECISÃO DE PRODUTO PENDENTE (qual modelo vale para a V1 real).
5. **Decisão 105 × comportamento do tutorial** (ver RN-04). DIVERGÊNCIA DOCUMENTAL + DECISÃO DE PRODUTO PENDENTE.
6. **`GAMI.fases[].notaMin` não aplicada** — prova usa 80% fixo (ver RN-42). DECISÃO TÉCNICA PENDENTE.
7. **Comentário desatualizado do cronograma** em `definirTurmaAtiva()` l. 3873–3874 (fala tipo+turno; o código usa id — ver RN-12). DIVERGÊNCIA DOCUMENTAL leve, sem efeito funcional.
8. **Numeração do registro de decisões**: os números 126–129 aparecem duplicados (128 e 129 com conteúdos DIFERENTES em cada ocorrência) e o fim do arquivo está fora de ordem cronológica — citar "decisão 128/129" hoje é ambíguo. DIVERGÊNCIA DOCUMENTAL + DECISÃO TÉCNICA PENDENTE (renumerar ou adotar IDs imutáveis).
9. **Regras de alteração da graduação do aluno**: "o gestor definirá" (CHANGELOG 18/07, Perfil do aluno) — nunca definida. DECISÃO DE PRODUTO PENDENTE.
10. **Funcionalidades decididas mas entregues como placeholder** (coerente com o registro, sem regra funcional): Chat ao vivo (dec. 52), Quests (dec. 54), feedback dos alunos ao professor (dec. 65), resposta do professor à recepção (dec. 92), reclamações/presença/satisfação nos Relatórios (dec. 55) — todas APENAS VISUAL ("EM BREVE").
11. **Fronteiras de integração sem contrato**: recarga de Diamante pelo checkout, estorno financeiro real, reconhecimento de matrícula, parser de PDF (edital/quiz/simulado), QR de gift card, presença por chamada — todos marcados `[INTEGRAÇÃO REAL]` no código (24 ocorrências), sem contrato definido com site/plataforma/financeiro. HIPÓTESE quanto à divisão exata de responsabilidades + DECISÃO TÉCNICA PENDENTE.
