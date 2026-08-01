# 08 — Matriz de fontes oficiais de dados

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

---

## Atualização — Consolidação Arquitetural v1.0 (01/08/2026)

**Determinação do gestor Danilo Moura (documento oficial de 01/08/2026):** o Viver o Quad passa a ser **a plataforma principal do Quad Concursos**, e onze capacidades antes tratadas como sistemas externos tornam-se **módulos internos** da plataforma (cadastro; autenticação; matrículas; produção de materiais; banco de questões; simulados; inteligência pedagógica; loja; administração; relatórios; cronogramas). A mudança é **exclusivamente arquitetural** — nada foi implementado; módulo sem especificação suficiente é **"Módulo Planejado"** (podendo coexistir com **"Demonstrado no protótipo (simulação local)"**).

**Efeito sobre esta matriz:** as siglas **CAD, AUTH, MAT, MTL, BQ, EVT, PED, ADM, GAM** e a parte de **relatórios** do BI passam a designar **módulos internos do Viver o Quad**; **SITE, FIN, GW, PLAT, NOT** (canal push/e-mail) e a **telemetria como serviço de dados** (parte de coleta do BI) permanecem **sistemas externos**, com integrações a definir. A tabela de siglas abaixo ganhou a coluna "Titularidade (v1.0)". As colunas **Fonte oficial proposta / Cria / Altera / Consultam** continuam válidas como arquitetura-alvo — o que muda é a titularidade (módulo interno × sistema externo), não a atribuição de fonte oficial. **Fontes oficiais que dependem de decisão pendente permanecem pendentes** (ex.: cronograma — planilha da coordenação × PED; cadastro de docentes — CAD × RH; catálogo de concursos — PED × BQ).

**Decisão revogada:** a dec. 21 (cadastro obrigatoriamente no site) foi **revogada** — a criação de conta passa ao módulo Cadastro (CAD) da plataforma. **O fluxo novo NÃO foi implementado:** o protótipo mantém o portão "Cadastro no site do Quad" como demonstração, até a especificação do módulo. As linhas afetadas das Matrizes A e B receberam nota.

**O que NÃO muda:** os riscos e evidências de 30/07 permanecem válidos e registrados como pendências (nenhuma solução implementada); as regras econômicas (loja, Quad Coins, Diamantes, gift cards) seguem previstas, porém **indefinidas (não estudadas)**; o comportamento do protótipo é o mesmo. (Nota: as referências "src.html l.N" valem para o monolito da auditoria; o `src/README.md` explica a correspondência com a divisão em 20 partes de 01/08.)

---

## 1. Como ler esta matriz

Esta matriz responde, para cada dado ou processo do ecossistema Viver o Quad: **quem é o dono oficial do dado, quem pode criá-lo e alterá-lo, quem apenas consulta, e o que o aplicativo do aluno pode guardar dele**.

**Separação obrigatória entre o que existe e o que é proposto:**

- As colunas **Fonte oficial proposta, Cria, Altera, Consultam, App armazena?, Tipo, Sincronização e Offline** descrevem a **arquitetura-alvo proposta** pela auditoria para o ecossistema real. São recomendação, não realidade — a divisão exata de responsabilidades entre app × site × plataforma está marcada `[INTEGRAÇÃO REAL]` no código, sem contrato definido (DECISÃO TÉCNICA PENDENTE, ver seção 9).
- As colunas **Risco de duplicidade** e **Status no protótipo** descrevem o que **existe hoje no `src.html`**, com evidência (função/variável/linha aproximada) e o vocabulário obrigatório de classificação.
- A coluna **Decisão pendente** aponta o que ainda precisa ser decidido, com o rótulo DECISÃO DE PRODUTO PENDENTE ou DECISÃO TÉCNICA PENDENTE.

**Siglas dos sistemas do ecossistema previsto** (registro de 30/07: "o app NÃO será dono de tudo"; na Consolidação v1.0, a experiência do aluno e os módulos internos abaixo compõem juntos a plataforma Viver o Quad):

| Sigla | Sistema | Titularidade (Consolidação v1.0) |
|---|---|---|
| APP | Aplicativo do aluno "Viver o Quad" (este protótipo) | Experiência do aluno da **plataforma Viver o Quad** |
| SITE | Site principal e checkout do Quad Concursos | **Externo** — vitrine/venda; integração a definir |
| PLAT | Plataforma de cursos | **Externo** — legado em avaliação |
| CAD | Cadastro geral de usuários/alunos | **Módulo interno — Cadastro** (Módulo Planejado) |
| MAT | Sistema de matrículas | **Módulo interno — Matrículas** (Módulo Planejado) |
| FIN | Financeiro/pagamentos | **Externo** — integração a definir |
| BQ | Banco central de questões | **Módulo interno — Banco de questões** (Módulo Planejado) |
| ADM | Painel administrativo | **Módulo interno — Administração** (Módulo Planejado) |
| PED | Sistema pedagógico | **Módulo interno — Inteligência pedagógica + Cronogramas** (Módulo Planejado) |
| AUTH | Autenticação/autorização | **Módulo interno — Autenticação** (Módulo Planejado) |
| EVT | Sistema de eventos | **Módulo interno — Simulados/Eventos** (Módulo Planejado) |
| MTL | Sistema de materiais (storage/CDN) | **Módulo interno — Produção de materiais** (Módulo Planejado); storage/CDN em si é serviço externo |
| NOT | Notificações/mensageria | **Externo** — canal push/e-mail; integração a definir |
| BI | Relatórios/inteligência de dados | **Dividido:** Relatórios = módulo interno (Módulo Planejado); telemetria como serviço de dados = externo, a decidir |
| GAM | Back-end de gamificação (score, patentes, ledger de moedas) | **Módulo interno** — economia da plataforma (Módulo Planejado); **regras econômicas indefinidas** |
| ERP | Estoque/logística (sistema externo) | **Externo** |
| GW | Gateway de pagamento (sistema externo) | **Externo** |

**Tipos de armazenamento permitidos no APP:**
- **cache** — cópia de leitura descartável, com validade; o servidor manda.
- **réplica** — cópia de leitura sincronizada e versionada (ex.: catálogo, edital); o servidor manda.
- **próprio** — dado que nasce no app e é dele (ex.: fila temporária de respostas offline até sincronizar; preferências de interface).

---

## 2. Princípio geral (estado atual × alvo)

**CONFIRMADO NO CÓDIGO:** no protótipo, o APP é hoje a fonte ÚNICA de TODOS os dados — 100% dos dados de negócio vivem em variáveis JS dentro da IIFE (início na l. 3671 do `src.html`). A única persistência é `localStorage` via `lsGet/lsSet/lsDel` (l. 3737–3739), usada somente para flags de dispositivo/tutorial (`vq_*`). Recarregar a página (F5) zera matrículas, compras, moedas, score, mensagens e progresso. Nenhum dado pessoal ou de negócio vai ao localStorage.

**Arquitetura-alvo proposta:** no ecossistema real, o APP **não é fonte oficial de nenhum dado de negócio**. Ele exibe caches e réplicas, coleta ações do aluno (respostas, pedidos de compra, inscrições) e as envia ao back-end, que é quem decide. O próprio código já declara isso: *"no sistema real vem validado do servidor — a interface nunca decide sozinha quantos pontos foram conquistados"* (comentário, l. 3706–3707). As únicas classes de dado "próprias" do APP seriam preferências de interface e filas temporárias de sincronização.

**Nota pós-Consolidação v1.0:** este princípio permanece integralmente válido. "APP" nesta matriz designa a **interface/experiência do aluno**; com a v1.0, os donos oficiais dos dados (CAD, MAT, BQ, PED, GAM etc.) passam a ser **módulos internos da própria plataforma Viver o Quad** — mas continuam sendo o lado servidor que decide, nunca a interface. Todos são Módulos Planejados: nada disso existe implementado.

---

## 3. Matriz A — Identidade, acesso e permissões

| Dado/processo | Fonte oficial proposta | Cria | Altera | Consultam | App armazena? | Tipo | Sincronização | Offline | Risco de duplicidade | Status no protótipo | Decisão pendente |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Usuário (conta)** | CAD (módulo Cadastro) | Módulo Cadastro (a dec. 21 — conta nasce no checkout do site — foi **revogada** na Consolidação v1.0; fluxo novo NÃO implementado: o protótipo mantém o portão "Cadastro no site" como demonstração) | CAD/ADM | APP, PLAT, MAT, FIN, AUTH, BI | Sim | cache de sessão | No login e a cada abertura de sessão | Exibe cache; sem edição | Alto — o protótipo já tem 2 nomes para o mesmo aluno (`DB_ALUNO.nome` l. 3946 ≠ `carreira.nomeCompleto` l. 3709) | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO | Identificador único de pessoa (CPF/ID) — DECISÃO TÉCNICA PENDENTE |
| **Perfil (papel aluno/professor/admin)** | AUTH | AUTH (na criação da conta/colaborador) | ADM (concede/revoga) | Todos os sistemas | Sim | cache (claims/token de sessão) | A cada login/refresh de token | Funções sensíveis negadas | Médio — no protótipo o papel é troca de botão `.persona-btn` (l. 3917), sem sessão | APENAS VISUAL + DEPENDE DO BACK-END | RBAC real por pessoa — DECISÃO TÉCNICA PENDENTE |
| **Aluno (dados cadastrais)** | CAD (módulo Cadastro) | Módulo Cadastro (dec. 21 revogada na v1.0; fluxo a especificar — antes: SITE/checkout) | CAD/ADM; o aluno edita só preferências (avatar, perfil privado) | APP, PED, FIN, BI | Sim | cache de sessão + **próprio** para preferências de interface | Login + ao alterar | Cache somente leitura | Alto (mesmo caso da conta: dois nomes) | SIMULADO LOCALMENTE (`DB_ALUNO` l. 3946) + DEPENDE DE SISTEMA EXTERNO | Regras de alteração da graduação do aluno ("gestor definirá", CHANGELOG 18/07) — DECISÃO DE PRODUTO PENDENTE |
| **Professor (cadastro docente)** | CAD (RH/coordenação) | ADM ("Banco de professores") | ADM; o próprio professor (senha/foto, l. 4992–5010) | APP, PED, EVT, BI | Sim | cache/réplica de leitura | Diária + ao alterar | Leitura do cache | **Crítico** — a grade `CRONO` cita ~10 professores que NÃO existem em `DOCENTES` (l. 4753–4771 × l. 3815); o nome é a chave do cadastro (`renomearDocente` l. 8178) | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS | ID estável (não o nome) e e-mail não derivado do sobrenome (colisão de sobrenomes iguais — l. 4917) — DECISÃO TÉCNICA PENDENTE |
| **Permissão (chaves, bloqueios, revogações)** | AUTH | Direção via ADM ("a chave é emitida e revogada pela direção, por pessoa" — comentário l. 9790) | ADM/AUTH (bloqueio derruba sessão na hora — l. 9891, 4938–4941) | Todos os sistemas | Não (apenas token volátil de sessão) | cache volátil (token) | Tempo real (revogação imediata) | Sem validação offline de permissão sensível | Alto — os gates do protótipo são overlays CSS/JS removíveis por DevTools (l. 4934, 9786) | APENAS VISUAL + SIMULADO LOCALMENTE + DEPENDE DO BACK-END | Retirar hooks `window.__*` (31) e credenciais demo (`quad1234`, `NPP-2026`) do build de produção — DECISÃO TÉCNICA PENDENTE |

---

## 4. Matriz B — Matrícula, estrutura de ensino e conteúdo

| Dado/processo | Fonte oficial proposta | Cria | Altera | Consultam | App armazena? | Tipo | Sincronização | Offline | Risco de duplicidade | Status no protótipo | Decisão pendente |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Matrícula** | MAT (módulo Matrículas) | SITE (compra no checkout — a venda permanece externa; a dec. 21, que tratava do **cadastro**, foi revogada na v1.0 e não altera a venda); ADM em casos manuais (HIPÓTESE) | MAT + FIN (estorno) | APP (gate de acesso — `checarMatricula` l. 3899), AUTH, PED, FIN, BI | Sim | cache com validade curta | No login + push em compra/estorno | Cache vale por prazo curto; vencido sem confirmação, app trava | Alto — `MATRICULAS` (l. 3850) é array local mutável; `window.__mat.encerrar()` (l. 3905) apaga tudo | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO + DEPENDE DO BACK-END | Contrato app × site × matrículas para reconhecimento de matrícula (`[INTEGRAÇÃO REAL]`) — DECISÃO TÉCNICA PENDENTE |
| **Turma** | ADM (cadastro) + MAT | ADM (só no Painel de controle, com validações — dec. 53/138/155) | ADM (edição preserva matrículas; remoção travada com matrícula ativa) | APP, SITE (venda), MAT, PED, EVT, BI | Sim | réplica de leitura (catálogo) | Diária + ao alterar | Catálogo em cache; comprar exige conexão | Médio — vagas por moeda decrementadas no cliente (`matricular` l. 8757) | SIMULADO LOCALMENTE (`TURMAS_LOJA` l. 3842) + DEPENDE DE BANCO DE DADOS | Onde vive o cadastro de salas/capacidades (`SALA_CAP` l. 8920 é hard-coded) — DECISÃO TÉCNICA PENDENTE |
| **Concurso** | PED (Estrutura) + BQ | ADM (lançamento) | ADM (situação: edital publicado/reta final etc.) | APP (Domínio), BQ, PED, BI | Sim | réplica de leitura | Por publicação/retificação | Réplica local | Baixo | SIMULADO LOCALMENTE (`CONCURSOS` l. 4122) + DEPENDE DE BANCO DE DADOS | Dono do catálogo de concursos (PED × BQ) — DECISÃO TÉCNICA PENDENTE |
| **Edital (árvore de conteúdo)** | BQ (lançamento de edital) | ADM/PED via upload; extração do PDF é sistema externo | ADM/PED (retificações versionadas) | APP (Domínio, materiais por árvore), BQ, PED, MTL, BI | Sim | réplica versionada | Por publicação | Réplica local | Médio — só a árvore CFO é real; as demais são exemplos compactos hard-coded (l. 4099–4121) | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (parser de PDF) | Pipeline de extração do edital ("a árvore real entra pelo lançamento do edital — [INTEGRAÇÃO REAL]", l. 4096) — DECISÃO TÉCNICA PENDENTE |
| **Matéria (taxonomia)** | BQ (junto do edital) | BQ | BQ | APP, PED, ADM (escalação docente — `docentesDaMateria` l. 3825) | Sim | réplica | Junto do edital | Réplica | **Crítico** — casamento por texto/prefixo, sem ID (`materiaCasa` l. 3825–3834; `materiaBate` l. 4285) | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS | Taxonomia de matérias com ID único compartilhado por todos os sistemas — DECISÃO TÉCNICA PENDENTE |
| **Cronograma (grade semanal)** | Hoje: planilha da coordenação (Google Sheets); alvo proposto: PED | Coordenação (planilha); ADM faz trocas pontuais (`CRONO_LOG` l. 10232) | ADM (troca de aula) | APP (aula de hoje), professor, BI | Sim | réplica semanal | Semanal + ao trocar aula | Réplica da semana em cache | **Crítico** — `CRONO` (l. 4745) é snapshot manual da "semana 30" da planilha; grade cita professores fora de `DOCENTES` | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (planilha) | A planilha permanece como fonte oficial ou o cronograma migra para o PED com sincronização? — DECISÃO TÉCNICA PENDENTE |
| **Aula (aula de hoje / ministrada)** | PED (derivada do cronograma — nada digitado à parte, dec. 98) | Derivação do cronograma | ADM (troca de aula) | APP, professor (relatório de horas — `profAulasDeHoje` l. 5013), BI | Sim | cache derivado | Junto do cronograma | Cache | Baixo (dado derivado) | CONFIRMADO NO CÓDIGO (derivação `renderAulaHoje` l. 4839) + SIMULADO LOCALMENTE | Presença do professor confirmada por chamada é `[INTEGRAÇÃO REAL]` — DECISÃO DE PRODUTO PENDENTE |
| **Material (arquivo de aula)** | MTL (storage/CDN) + PLAT | ADM (upload — `admMatArqFile` l. 10422) | ADM (✕ tira do ar — l. 10431) | APP (por turma matriculada — `renderMateriaisAluno` l. 10353), PLAT | Sim | cache de download (arquivo baixado) | Na publicação (aviso/push) | Arquivo já baixado abre offline | Baixo | SIMULADO LOCALMENTE (dataURL em memória) + DEPENDE DE SISTEMA EXTERNO (storage/CDN) | Storage/CDN real e política de retenção de arquivos — DECISÃO TÉCNICA PENDENTE |

---

## 5. Matriz C — Questões, desempenho e gamificação

| Dado/processo | Fonte oficial proposta | Cria | Altera | Consultam | App armazena? | Tipo | Sincronização | Offline | Risco de duplicidade | Status no protótipo | Decisão pendente |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Questão** | BQ | BQ (cadastro + extração de PDF) | BQ | APP (quiz, flashcards, prova, simulado digital), PED, BI | Sim | cache de entrega **SEM gabarito** | Por pacote/atividade | Pacote baixado permite responder; correção só no servidor | **Crítico** — o protótipo tem 5 bancos locais paralelos (`QUESTIONS` l. 4616, `QA_MULT`/`QA_CE` l. 5248–5260, `TR_BANK` l. 6122, `AULA_DEMO` l. 6186, `TQ` l. 6867), todos com gabarito no cliente | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS | Unificar os bancos no BQ; gabarito nunca no cliente em avaliação que vale ponto — DECISÃO TÉCNICA PENDENTE |
| **Resposta (do aluno)** | PED (registro imutável no servidor) | APP coleta → back-end registra | Ninguém (imutável; trilha de auditoria) | PED, BI, GAM, professor (relatório ao vivo do quiz — `QUIZZES` l. 5275) | Sim | **próprio temporário**: fila offline até sincronizar | Imediata quando online; fila quando não | Fila local de pendências (o protótipo tem o resquício `vq_pending`, lido mas **nunca escrito** — código morto, l. 3741) | Alto — ressincronizar sem idempotência duplica contagem de acertos/pontos | SIMULADO LOCALMENTE + DEPENDE DO BACK-END | Idempotência/deduplicação da fila de sincronização — DECISÃO TÉCNICA PENDENTE |
| **Desempenho (Domínio, autoavaliação)** | PED + BI (computado a partir das respostas) | Back-end (recomputo) | Back-end (recomputo) | APP, professor, ADM, futuro IRA | Sim | cache de exibição | Por recomputo | Última leitura em cache | Médio — no protótipo o Domínio é hash determinístico do nome do assunto, não dado real (`ED_BASE`/`trAj`/`edSubPct` l. 4093, 4154–4159) | APENAS VISUAL + SIMULADO LOCALMENTE + DEPENDE DO BACK-END | Como cumprir "comportamento é computado, nunca gravado como rótulo" (LGPD, docs/01) — DECISÃO TÉCNICA PENDENTE |
| **Ranking** | GAM + BI (cálculo no servidor) | Back-end (recálculo) | Back-end (recálculo) | APP (sala e geral) | Sim | cache curto | Frequente (quase tempo real) | Última posição em cache, marcada como desatualizada | Alto — no protótipo a posição é fórmula local (`salaPos` ≈ 29% do total l. 7422; geral fixo 87/1286 l. 7466); score inflável infla o ranking | APENAS VISUAL + SIMULADO LOCALMENTE + DEPENDE DO BACK-END | Top 10 sempre exposto sem opt-out (dec. 132/143) e persistência da escolha de perfil privado (`perfilPrivado` l. 7302 volta a público no F5) — DECISÃO DE PRODUTO PENDENTE |
| **Simulado** | Sistema de simulados (PED/EVT) + BQ | ADM (lançamento — `SIM_CAMPOS` l. 11148) | ADM (edição); back-end (vagas por moeda) | APP, Loja, portaria, BI | Sim | réplica (catálogo); digital baixa a prova | Ao alterar; vaga em tempo real | Catálogo em cache; compra/inscrição exige conexão | Alto — vagas por moeda mutadas no cliente (`simTomaVaga` l. 6352–6361) | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS (reserva atômica de vaga) + DEPENDE DO BACK-END | Extração das questões do PDF (`[INTEGRAÇÃO REAL]`) — DECISÃO TÉCNICA PENDENTE |
| **Promoção (de patente)** | GAM ("a interface nunca decide sozinha" — comentário l. 3706–3707) | Back-end (aprovação na prova de promoção) | Back-end (transferência de excedente; bloqueio de 24h em reprova) | APP, ranking, BI | Sim | cache do estado da carreira | Imediata pós-prova | Prova exige conexão (correção server-side) | Alto — no protótipo a correção é 100% no cliente (`resultadoProva` l. 7584) e há botão demo de promoção (`demoSobePatente` l. 7745, "[DEMO PROVISÓRIO — REMOVER]") | SIMULADO LOCALMENTE + DEPENDE DO BACK-END | `GAMI.fases[].notaMin` (70–85%) existe mas não é aplicada — a prova usa `PROVA_APROV = 0.80` fixo (l. 7521) — DIVERGÊNCIA DOCUMENTAL + DECISÃO TÉCNICA PENDENTE |

---

## 6. Matriz D — Economia

| Dado/processo | Fonte oficial proposta | Cria | Altera | Consultam | App armazena? | Tipo | Sincronização | Offline | Risco de duplicidade | Status no protótipo | Decisão pendente |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Moedas (Quad Coin e Diamante)** | Ledger no FIN/GAM (relatório rev. 2.3 prevê "ledger e governança" na V1) | Back-end: QdC por conquista; Dmn só por recarga no SITE ou gift card (l. 3768–3778, "não é conquistado em missões") | Back-end (débito/crédito/estorno); crédito manual do ADM com valor + motivo + histórico (`CREDITOS` l. 9811) | APP, Loja, BI | Sim | cache do saldo | Tempo real (cada transação) | Saldo em cache somente leitura; sem gasto offline | **Crítico** — saldo vive no cliente (`score = 1240` l. 3672; `diamantes = 150` l. 3771) e é falsificável por console; gift cards "desusam" no F5 (`giftUsados` l. 3781) | SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (checkout) | Ledger Quadcoin (V1); variável de QdC chama-se `score`, colidindo com o score de carreira (dec. 11) — DIVERGÊNCIA DOCUMENTAL + DECISÃO TÉCNICA PENDENTE |
| **Pagamento (dinheiro real)** | FIN + GW (gateway, sistema externo) | SITE/checkout + GW | FIN (estorno bancário) | MAT, Loja, BI | **Não** | nenhum — o app só exibe status por consulta | Consulta sob demanda | Indisponível offline | Baixo (desde que o app nunca armazene) | SIMULADO LOCALMENTE (o protótipo nem simula cartão; Diamante é "[INTEGRAÇÃO REAL] crédito do site") + DEPENDE DE SISTEMA EXTERNO | Contrato de recarga de Diamantes e de estorno financeiro real entre app × checkout × gateway — DECISÃO TÉCNICA PENDENTE |
| **Compra (registro de transação)** | Back-end da Loja + FIN | Back-end (quando o APP solicita, com confirmação — dec. 50) | FIN (estorno em até 7 dias — `estornoDias` l. 11562); consumo retira do estorno (`compraConsumida` l. 11445, dec. 178) | APP (relatório de compras — `renderRelCompras` l. 11522), ADM, recepção, BI | Sim | cache | Tempo real | Histórico em cache somente leitura | Alto — `COMPRAS` (l. 11435) é local e `window.lojaCompraLog` (l. 11867) é global forjável por console | SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS | Transação atômica compra ↔ consumo ↔ estorno no servidor — DECISÃO TÉCNICA PENDENTE |
| **Estoque (físico e vagas)** | ERP/estoque + ADM (cadastro) | ADM/ERP | Back-end (baixa por compra); recepção (entrega devolve o item à vitrine — dec. 34/74) | APP (Loja), ADM | Sim | cache de exibição (o app nunca decide estoque) | Tempo real na compra | Exibe o último valor; compra bloqueada offline | **Crítico** — `p.estoque -= compraQtd` executa no cliente (l. 9266); vagas de turma/simulado idem | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (controle físico) + DEPENDE DE BANCO DE DADOS | Integração com controle físico de estoque (ERP) e reserva atômica de vaga — DECISÃO TÉCNICA PENDENTE |

---

## 7. Matriz E — Eventos, presença e comunicação

| Dado/processo | Fonte oficial proposta | Cria | Altera | Consultam | App armazena? | Tipo | Sincronização | Offline | Risco de duplicidade | Status no protótipo | Decisão pendente |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Evento** | EVT | ADM (criação com data, sala/Estúdio, professores, preço — `EV_CAMPOS` l. 10661) | ADM (edição preserva inscritos; ✕ cancela e libera a sala — `cancelarEvento` l. 10544) | APP (carrossel/Loja), portaria, NOT, BI | Sim | réplica de leitura | Na publicação/edição/cancelamento | Réplica em cache; inscrever exige conexão | Baixo — eventos são do QUAD, sem segmentação por turma (dec. 161) | SIMULADO LOCALMENTE (`EVENTOS` l. 4226) + DEPENDE DE BANCO DE DADOS | — |
| **Inscrição** | EVT (banco de inscrições) | Back-end, a pedido do APP (compra ou inscrição gratuita — `comprarEvento` l. 4398) | Back-end (cancelamento/estorno remove — `desfazerCompra` l. 11592) | Portaria, NOT (mensagens por público — dec. 181), BI | Sim | cache (estado INSCRITO/`evState` l. 4263) | Tempo real | Estado em cache; inscrever-se exige conexão | Alto — listas de inscritos semente geradas por hash (`inscritosSeed` l. 10809) misturadas ao aluno real da sessão | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS | — |
| **Presença** | Portaria/recepção + back-end (registro imutável) | Recepção ("Liberar entrada" — `liberarInscrito` l. 11015; pontua score e envia ao histórico) | Ninguém (registro imutável) | GAM (score), PED (histórico — dec. 47), FIN (consumo mata estorno — dec. 178), BI | Sim | cache do próprio histórico | Tempo real no check-in | Check-in é ato da recepção, não do app | Alto — no protótipo é um booleano em memória (`SIM_INSC[].liberado`, `ACESSO_ST`) | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (controle de acesso físico) + DEPENDE DO BACK-END | Mecanismo real de check-in (QR/credencial; geofencing citado para V1 é HIPÓTESE de escopo) — DECISÃO DE PRODUTO PENDENTE |
| **Autorização de entrada (portaria)** | EVT + portaria | Back-end (ao confirmar compra/inscrição o aluno entra na lista — `acessoListaDe` l. 10821) | Recepção (libera); estorno/cancelamento remove | Portaria, APP (tag INSCRITO) | Sim | cache | Tempo real | Lista da portaria pertence à recepção, não ao app | Alto — `ACESSO_ST` (l. 10820) mistura seeds por hash com o aluno real; "liberado" é flag local | SIMULADO LOCALMENTE + DEPENDE DO BACK-END | — |
| **Mensagem (recados, avisos)** | NOT (mensageria) | ADM (individual, por professor ou por público — `msgPublico` l. 9950, dec. 181; avisos com turma-alvo por id — `AVISOS` l. 10149, dec. 149) | Leitura marca "lida" dos dois lados (l. 9930–9934) | APP (chat "+"), professor (sala), ADM (histórico `ADM_MSGS`), BI (alcance) | Sim | cache local + estado de leitura sincronizado | Push em tempo real (push real é V1) | Mensagens recebidas ficam em cache; envio enfileira | Médio — hoje o histórico se perde no F5 (tudo em memória) | SIMULADO LOCALMENTE + DEPENDE DO BACK-END | Chat ao vivo e resposta do professor são "EM BREVE" (APENAS VISUAL na V0) — DECISÃO DE PRODUTO PENDENTE |

---

## 8. Riscos de duplicidade prioritários (já visíveis no protótipo)

Todos CONFIRMADOS NO CÓDIGO; são os pontos em que o protótipo já demonstra o custo de não haver fonte oficial única:

| # | Duplicidade | Evidência | Fonte oficial que resolve |
|---|---|---|---|
| 1 | Dois nomes completos para o mesmo aluno | `DB_ALUNO.nome` (l. 3946) ≠ `carreira.nomeCompleto` (l. 3709) | CAD (registro único de pessoa) |
| 2 | Duas fontes de professores que não se cruzam | grade `CRONO` (l. 4753–4771) cita ~10 nomes fora de `DOCENTES` (l. 3815); `materiaBate` (l. 4285) contorna por matéria, não por pessoa | CAD + PED (docente com ID, referenciado por ID na grade) |
| 3 | Cinco bancos de questões paralelos | `QUESTIONS`, `QA_MULT`/`QA_CE`, `TR_BANK`, `AULA_DEMO`, `TQ` | BQ (banco central de questões) |
| 4 | Moeda com nome de score | variável `score` = Quad Coins (l. 3672) × `carreira.score*` (l. 3708) — origem da confusão "Score não é moeda" (dec. 11) | GAM/FIN (ledger nomeado corretamente) |
| 5 | Cronograma duplicado entre planilha e app | `CRONO` é snapshot manual da "semana 30" da planilha da coordenação (comentário l. 4740–4744) | PED (ou sincronização formal com a planilha) |
| 6 | Estoque, vagas e saldos decididos no cliente | `p.estoque -= compraQtd` (l. 9266); `simTomaVaga` (l. 6352); `addScore`/`addDiamante` locais | FIN/ERP/GAM (transações server-side) |
| 7 | Redundância interna `turmaAtivaId` × `ALUNO_TURMA` | sincronizados à mão em `definirTurmaAtiva` (l. 3867, 4796) | APP (unificar em um único ponteiro) — DECISÃO TÉCNICA PENDENTE |

---

## 9. Decisões pendentes consolidadas desta matriz

**DECISÃO TÉCNICA PENDENTE:**
1. Contrato geral app × site × plataforma × back-ends para tudo que está marcado `[INTEGRAÇÃO REAL]` no código (matrícula, recarga de Diamantes, estorno real, extração de PDF, checkout) — nenhum contrato definido.
2. Identificadores estáveis: pessoa (aluno/usuário), professor (hoje a chave é o nome), matéria (hoje casamento por texto/prefixo).
3. Ledger de moedas (V1) e renomeação da variável `score` (QdC).
4. Onde vive o cadastro de salas/capacidades (hoje hard-coded, `SALA_CAP` l. 8920).
5. Cronograma: planilha da coordenação como fonte oficial sincronizada ou migração para o sistema pedagógico.
6. Fila offline de respostas com idempotência (e limpeza do legado `vq_pending`/`vq_last_sync`, código morto).
7. Build separado dev/prod: hooks `window.__*`, credenciais demo e botões `[DEMO PROVISÓRIO]` fora do build de produção.
8. Nota mínima de prova por fase (`GAMI.fases[].notaMin` não aplicada; `PROVA_APROV` fixo em 0,80).
9. Como computar comportamento sem gravar rótulo (diretriz LGPD dos docs, sem implementação).

**DECISÃO DE PRODUTO PENDENTE:**
1. Regras de alteração da graduação do aluno ("gestor definirá").
2. Ranking: top 10 sempre exposto sem opt-out e persistência da escolha de perfil privado.
3. Mecanismo real de check-in/presença (QR, credencial; geofencing V1 é HIPÓTESE de escopo).
4. Chat ao vivo, resposta do professor e demais telas "EM BREVE" (hoje APENAS VISUAL).
5. Presença do professor por chamada (relatório de horas hoje é 100% derivado da grade).

---

*Documento 08 da série de auditoria. Ver também: 05-regras-de-negocio.md (regras RN-01–RN-61 citadas), 06-dados-locais-e-persistencia.md (inventário completo das estruturas e chaves `vq_*`). Atualizado em 01/08/2026 para refletir a Consolidação Arquitetural v1.0 (titularidade das siglas → módulos internos; dec. 21 revogada), sem alteração das evidências de 30/07.*
