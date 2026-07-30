# 06 — Dados locais e persistência

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

---

## 1. Visão geral: onde os dados vivem

**CONFIRMADO NO CÓDIGO:** 100% dos dados de negócio do protótipo vivem em **variáveis JavaScript dentro da IIFE única** de `src.html` (a IIFE começa na l. 3671). A única persistência existente é o `localStorage` do navegador, acessado exclusivamente pelos wrappers `lsGet` / `lsSet` / `lsDel` (l. 3737–3739, todos com `try/catch` silencioso), e usado **somente para flags de dispositivo e tutorial** (Seção 3). Nenhum array de negócio — matrículas, compras, score, moedas, recados, progresso de missões — sobrevive a um recarregamento da página (F5).

**Convenções deste documento** (valem para todas as estruturas da Seção 2, salvo indicação em contrário na própria linha da tabela):

| Campo | Valor padrão |
|---|---|
| Arquivo | `/home/user/viveroquad/src.html` (fonte única; `index.html`/`artifact.html` são gerados pelo build) |
| Em memória? | **Sim** (variável JS na IIFE) |
| Usa localStorage? | **Não** |
| Persiste entre sessões? | **Não** (F5 restaura o valor inicial hardcoded) |
| É mock? | **Sim** (dados fictícios de demonstração) |

As colunas **"No sistema real (recomendação)"** e **"Sistema dono provável"** são **prospectivas** — descrevem o que a auditoria recomenda para o produto real, não o que existe hoje. O "sistema dono" refere-se ao ecossistema previsto (site/checkout, plataforma de cursos, cadastro geral, matrículas, financeiro, banco de questões, painel administrativo, sistema pedagógico, autenticação, eventos, materiais, notificações, relatórios/BI), no qual o app do aluno **não** será dono de tudo.

Legenda da coluna "No sistema real": **Front** = deveria existir no front-end (como cache de sessão/estado de UI) · **API** = deveria vir de API · **Persistir** = deveria ser persistido (no servidor, salvo nota).

---

## 2. Inventário das estruturas de dados

### 2.1 Identidade, conta e acesso

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `DB_ALUNO` (l. 3946) | Dados "vindos do banco geral do site". `{ nome: 'Danilo de Almeida Moura', fone: '(71) 9 8877-2301' }`. Comentário no código: "[INTEGRAÇÃO REAL] preenchidos a partir da matrícula ativa" | Aluno | **Sim** (nome + telefone) | Front (só cache de sessão) · API · Persistir no servidor | Cadastro geral de usuários/alunos | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO + DEPENDE DE BANCO DE DADOS. **Inconsistência:** nome difere de `carreira.nomeCompleto` (ver abaixo) |
| `carreira` (l. 3708) | Estado de carreira do aluno: `{ nomeCompleto: 'Danilo Ribeiro Moura', nomeGuerra: 'Moura', patenteIdx: 0, scorePatente: 620, scoreCarreira: 620, scoreTemporada: 310, estado: 'acumulando', provaBloqueadaAte: null, historico: [...] }`. O próprio código avisa (l. 3706–3707): "no sistema real vem validado do servidor — a interface nunca decide sozinha quantos pontos foram conquistados" | Aluno | **Sim** (nome completo, nome de guerra) | Front (exibição) · API · Persistir no servidor | Sistema pedagógico + relatórios/BI (score); cadastro geral (nome) | SIMULADO LOCALMENTE + DEPENDE DO BACK-END. `addPontos()` (l. 7498) muta livremente no cliente. **CONFIRMADO NO CÓDIGO:** dois nomes completos para o mesmo aluno ("Danilo Ribeiro Moura" ≠ "Danilo de Almeida Moura" de `DB_ALUNO`) |
| `currentEmail` / `scenario` / `online` / `CODE_OK` (l. 3730–3734) | Fluxo de acesso simulado; `CODE_OK = '123456'` hardcoded. `acessarPortal()` (l. 5633) aceita **qualquer e-mail com "@" e qualquer senha não vazia** | Aluno | E-mail digitado é ecoado na tela de telemetria (l. 5644) | Não existir no front · autenticação via API | Autenticação/autorização | APENAS VISUAL (não autentica nada) + SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `deviceAuthorized` / `pendingAnswers` (l. 3740–3741) | Lidos do localStorage (`vq_device_authorized`, `vq_pending`); `pendingAnswers` **nunca é escrito** — resto do fluxo offline removido (dec. 21) | Aluno | Não | Remover | — | CONFIRMADO NO CÓDIGO (código morto/legado) + DECISÃO TÉCNICA PENDENTE |
| `personaAtiva` / `personaViews` (l. 3911–3916) | Troca aluno/professor/admin pelos botões `.persona-btn` — o "sistema de perfis" inteiro do protótipo é troca de telas, sem sessão | Todos | Não | Não existir · perfis via autenticação real | Autenticação/autorização | APENAS VISUAL + DEPENDE DO BACK-END |
| `CONTAS` (l. 9803) | Contas que o admin governa: `{ id: 'eu', seed: false, bloqueada: false }` + 3 seeds (AL SGT QUAD SANTIAGO, SD QUAD BRANDÃO, AL CB QUAD NASCIMENTO). Bloqueio (`alternarBloqueio`, l. 9889) derruba a sessão do aluno da demo | Admin | Sim (nomes de guerra fictícios) | Front (lista) · API · Persistir | Cadastro geral + painel administrativo | SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS |

### 2.2 Gamificação e economia (moedas, score, patentes)

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `score` (l. 3672) | Saldo de **Quad Coins** (int, inicia 1240). Apesar do nome, NÃO é o score de carreira (comentário na própria linha). Mutado por `addScore()` (l. 3755), que atualiza o DOM direto | Aluno | Não | Front (exibição) · API · Persistir no servidor (ledger) | Financeiro/economia interna + sistema pedagógico | SIMULADO LOCALMENTE + DEPENDE DO BACK-END. Qualquer clique premiado soma sem servidor; F5 devolve 1240. Relatório rev. 2.3 prevê "ledger e governança" na V1 |
| `diamantes` (l. 3771) | Moeda comprada em **dinheiro real** (int, inicia 150). Comentário: "recarga vinda do checkout do site (demo)" | Aluno | Não | Front (exibição) · API · Persistir no servidor | Site/checkout + financeiro/pagamentos | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO + DEPENDE DO BACK-END. **Risco crítico no real:** saldo pago não pode viver no cliente |
| `GAMI` (l. 3678) | Configuração central da gamificação: `provaQuestoes: 20, tentativaHoras: 24, fases[4] (notaMin 0.70–0.85), patentes[14]` (AL SD → Coronel). Comentário: "o admin ajustará no sistema real" | Todos | Não | Front (cache de config) · API | Painel administrativo (parametrização) | CONFIRMADO NO CÓDIGO (parametrização exemplar) + DEPENDE DO BACK-END |
| `PROVA_APROV` / `prova` (l. 7521–7522) | Prova de promoção automática: coleta questões marcadas Errei/Difícil (`provaColeta`, l. 7532); 80% promove na hora. **Gabarito e correção 100% no cliente.** Exposta em `window.__prova` (l. 7523) | Aluno | Respostas do aluno (em memória) | Correção via API · Persistir resultado no servidor | Sistema pedagógico + banco de questões | SIMULADO LOCALMENTE + DEPENDE DO BACK-END (promoção real precisa ser validada no servidor) |
| `INSIG_MAP` (l. 7218) | Mapa 14 patentes → 10 artes de insígnia (sprite `__INSIGNIAS__` do build) | Aluno | Não | Front (asset) | — | CONFIRMADO NO CÓDIGO + APENAS VISUAL |
| Bloco demo de patente (l. 7740–7758) | `demoSobePatente()` sobe patente por clique; marcado no código "[DEMO PROVISÓRIO — REMOVER]" | Aluno | Não | Remover antes de publicação além da demo | — | CONFIRMADO NO CÓDIGO + DECISÃO TÉCNICA PENDENTE |
| `GIFT_CARDS` / `giftUsados` / `GIFT_LOTES` / `giftSeq` (l. 3781–3783, 10095) | Códigos demo (`QUAD-100`, `QUAD-500`) + lotes criados no Painel de controle (`QG<lote>-<código>`, QR ilustrativo por `qrSvg`, l. 10041). Resgate (`resgatarGift`, l. 3791) marca `usado` só em memória | Aluno + admin | Não | API · Persistir (liberação única exige servidor) | Financeiro + painel administrativo | SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS. **Um F5 "desusa" todos os cartões** |
| `NOITE_RESG` (l. 6610) | `{turmaId: true}` — bônus do dia completo já retirado, por turma | Aluno | Não | API · Persistir (senão o aluno resgata de novo a cada sessão) | Sistema pedagógico + financeiro | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `CREDITOS` (l. 9811) | Log de créditos manuais do admin: `{nome, moeda, valor, motivo, quando}`; crédito na conta 'eu' cai na carteira na hora (l. 9865–9867) | Admin | Sim (nome do beneficiário) | API · Persistir com trilha de auditoria (quem, quando, por quê) | Financeiro + painel administrativo | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |

### 2.3 Turmas, matrículas e cronograma

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `TURMAS_LOJA` (l. 3842) | Catálogo de turmas à venda (5 seeds; admin cria/edita/remove). Ex.: `{ id:'patamo-n', nome:'Turma PATAMO', tipo:'PATAMO', sala:'Sala 2', turno:'noite', concurso:'cfo', precoDmn:2200, precoQdc:2400, vagasDmn:75, vagasQdc:10, inicio:'2026-06-01', fim:'2026-12-15' }` | Aluno (loja), prof, admin | Não | Front (catálogo em cache) · API · Persistir | Matrículas + site/checkout + painel administrativo | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS. Obs.: **não há variável `TURMAS`** — o símbolo real é `TURMAS_LOJA` (DIVERGÊNCIA DOCUMENTAL leve com o vocabulário do repositório) |
| `MATRICULAS` (l. 3850) | Matrículas do aluno: `[{ turmaId:'patamo-n', rot:'PATAMO NOITE', tipo:'PATAMO', turno:'noite', concurso:'cfo', fim:'2026-12-15' }]`. Comentário: o aluno da demo "veio do site já matriculado". Sem matrícula ativa o app trava (`checarMatricula`, l. 3900) | Aluno | Sim (vínculo aluno↔turma) | Front (cache) · API · Persistir | Matrículas + site/checkout | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO + DEPENDE DO BACK-END. Estorno remove matrícula localmente (`desfazerCompra`, l. 11594–11607) — no real é transação financeira |
| `turmaAtivaId` (l. 3859) | Ponteiro da turma que "comanda a tela"; `turmaAtiva()` se autocorrige; `definirTurmaAtiva()` (l. 3867) redesenha ~12 áreas. Exposto em `window.__turmaAtiva` (l. 3894) e `window.__mat` (l. 3905) | Aluno | Não | Front · **Persistir a preferência** (localStorage ou perfil no servidor) — hoje volta ao padrão a cada F5 | Cadastro geral (preferência) | CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DECISÃO TÉCNICA PENDENTE |
| `CRONO` (l. 4745) | Cronograma semanal — snapshot da "semana 30" da planilha Google Sheets da coordenação (comentário l. 4740–4744), chaveado por id de turma (dec. 163). Ex.: `turmas['patamo-n'] = { sala:'SALA 4', tipo:'teoria + questões', aulas:[[{e:7, m:'DIR. CONST.', p:'John Bernam'},…]…] }` | Aluno, prof, admin | Sim (nomes de professores) | Front (cache) · API · Persistir | Sistema pedagógico/coordenação (hoje: planilha externa → DEPENDE DE SISTEMA EXTERNO) | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO. **Inconsistência CONFIRMADA:** a grade cita ~10 professores (John Bernam, Marcello Esquivel, Moab Kigran etc.) que **não existem em `DOCENTES`** — duas fontes de docentes sem reconciliação |
| `ALUNO_TURMA` (l. 4796) | Chave do cronograma da turma ativa ('patamo-n'); redundante com `turmaAtivaId` (sincronizado em `definirTurmaAtiva`) | Aluno | Não | Unificar com `turmaAtivaId` | — | CONFIRMADO NO CÓDIGO + DECISÃO TÉCNICA PENDENTE |
| `CRONO_LOG` (l. 10232) | Histórico de trocas de aula feitas pelo admin | Admin | Sim (professores) | API · Persistir (auditoria) | Painel administrativo | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS |
| `ISOLADAS` (l. 8881) | Aulas isoladas. Ex.: `{ id:'iso-adm', materia:'Direito Administrativo', prof:'Danilo Moura', sala:'Sala 4', dias:['terça-feira'], hi:'20:00', hf:'22:00', preco:350, moeda:'dmn', vagas:30 }` | Aluno, admin | Sim (professor) | API · Persistir | Matrículas/eventos + loja | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS |
| `SALAS` / `SALA_CAP` / `ESTUDIO` (l. 8920–8928) | Espaço físico da sede: 4 salas + estúdio; lotação `{'Sala 1':155, 'Sala 2':85, 'Sala 3':125, 'Sala 4':185}`. Usado em conflito de agenda e lotação de eventos (`evLot`, l. 4375) | Admin | Não | Front (cache) · API | Painel administrativo (cadastro de infraestrutura) | CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS |

### 2.4 Conteúdo pedagógico (editais, questões, missões)

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `EDITAL_CFO` (l. 4092) + `EDITAL_SOLDADO`/`EDITAL_PPBA`/`EDITAL_PCBA`/`EDITAL_PRF` (l. 4099–4121) | Árvores de edital: CFO PM-BA completa (13 matérias, ex.: `[["Língua Portuguesa",[["Interpretação de textos",[…]]]],…]`); as demais são exemplos compactos ("a árvore real entra pelo lançamento do edital — [INTEGRAÇÃO REAL]", l. 4096–4097) | Aluno, admin | Não | Front (cache) · API · Persistir | Banco central de questões/edital + sistema pedagógico | CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE (a árvore CFO é conteúdo real transcrito) + DEPENDE DE BANCO DE DADOS |
| `CONCURSOS` (l. 4122) + `SITUACOES`/`MODALIDADES`/`EDITAL_ATUAL` (l. 4130–4147) | 6 concursos, ex.: `{ id:'cfo', nome:'PM-BA · CFO (Oficiais)', edital:'CFO 2024', situacao:'reta-final', arvore: EDITAL_CFO }`; modalidades RONDESP/PATAMO/BOPE com % teoria×questões | Todos | Não | Front (cache) · API · Persistir | Banco de questões + painel administrativo | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END |
| `ED_BASE` / `trAj` / `edSubPct` (l. 4093, 4154–4159) | O "Domínio" (% por sub-assunto) é **determinístico por hash do nome + deslocamento do Treinamento Rápido** — não há dado real de desempenho | Aluno | Não (no protótipo) | Calcular no servidor a partir de respostas reais | Sistema pedagógico + relatórios/BI | APENAS VISUAL + SIMULADO LOCALMENTE + DEPENDE DO BACK-END (o Domínio real é a leitura nº 1 do relatório) |
| `QUESTIONS` (l. 4616), `QA_MULT`/`QA_CE` (l. 5248/5260), `TR_BANK` (l. 6122), `AULA_DEMO` (l. 6186), `TQ` (l. 6867) | Bancos de questões: 3 do quiz do aluno, 10 múltipla escolha + 11 certo/errado do professor, ~60 flashcards `fc(m,a,c,t,o)` com estado `nota`/`resp` por carta, 40 certo/errado da aula demo, 3 da missão. **Gabarito (`right`/`c`) dentro do objeto, no cliente** | Aluno, prof | Autoavaliação e respostas do aluno (em memória) | API (questão sem gabarito) · correção e persistência no servidor | Banco central de questões | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END. Gabarito no cliente permite fraude trivial em avaliação que valha pontos |
| `DIA_BLOCOS` / `BLOCOS_TURMA` / `DIA_EXPIRA_DIAS` (l. 6234–6264) | Missões da noite (blocos de 10 rápidas) com marcos D0/D+1/D+7/D+30, expiração em 7 dias, seeds "atrasadas". `BLOCOS_TURMA = { 'patamo-n': DIA_BLOCOS }`; turma nova nasce zerada (`novosBlocosDia`, l. 6265). Estado `feito`/`criadoEm` em memória; exposto em `window.__blocos` (l. 6311) e `window.__noite` (l. 7525) | Aluno | Progresso do aluno (em memória) | API · **Persistir** — hoje o progresso da noite se perde no F5 | Sistema pedagógico + notificações (liberação 22h15) | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `TR_GERAIS` / `TR_REW` / `TR_ST` (l. 6119–6120, 6693) | Config do Treinamento Rápido (+1 score por acerto, +5 QdC por bloco de 10) e rodízio POR TURMA (`TR_ST[turmaId] = {fila, pos}`) | Aluno | Autoavaliação Errei/Difícil/Bom/Fácil em `TR_BANK[i].nota` — dado pedagógico sensível no real | API · Persistir | Sistema pedagógico | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `MATERIAIS` / `MAT_TIPOS` (l. 10344 e adjacências) | Materiais por turma: `{id:'mt1', turma:'patamo-n', materia, assunto, tipo:'slides', titulo, det:'PDF · 24 págs', quando, novo:true}`. Upload do admin vira dataURL em memória (`admMatArqFile`, l. 10422) e o aluno baixa de verdade (l. 10387–10392) | Aluno, admin | Não | API + storage/CDN · Persistir | Sistema de materiais + plataforma de cursos | SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (storage/CDN) + DEPENDE DO BACK-END |
| `QUIZZES` / `QZ_MAX_Q` (l. 5275–5276) | Quiz da aula POR TURMA: `{ turmaId, tipo, minutos, pdf, qs, status, alunoFez, respostasAluno, pollN }`. Comentário: "[INTEGRAÇÃO REAL] extração do PDF". Relatório ao vivo do professor por polling simulado (`pollTimer`). Expostos em `window.__quizAula`/`__quizzes` (l. 5295–5296) | Aluno + prof | Respostas do aluno (em memória) | API · Persistir · tempo real via servidor/websocket | Sistema pedagógico + banco de questões | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |

### 2.5 Eventos, simulados e agenda

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `EVENTOS` (l. 4226) + `evState` (l. 4263) | 7 eventos seed, ex.: `{ id:'nac', nome:'NAC · Atualidades', tipo:'ENCONTRO · AO VIVO', modalidade:'online', pago:false, quando:'QUA · 22/07 · 19H–21H', profs:['Danilo Moura'], score:[…], coins:[…] }`; pagos têm `moeda`, `sala`, `dataISO`, `link`. Estado do aluno em `evState` (`{garimpado, inscrito, comprado}`). Hooks: `window.__eventos`, `__evEstado`, `__evProf`, `__evLotar` (l. 4297–4299, 4386 — este último força lotação) | Aluno, prof, admin | Sim (professores) | Front (cache) · API · Persistir | Sistema de eventos + loja/checkout + notificações | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END (inscrição/pagamento/check-in) |
| `CAL_BASE` (l. 4569) | Marcos fixos do calendário (corte de missões, Pré-TAF) | Aluno | Não | API | Sistema de eventos | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `SIMULADOS` (l. 6299) | Ex.: `{ id:'s63', rot:'Simulado 63 · SD PMBA', tag:'PRESENCIAL', pago:true, precoDmn:120, precoQdc:150, score:120, vagas:60, vagasDmn:50, vagasQdc:10, insc:false, comprado:false, realizado:false }` + digital (`{tag:'DIGITAL', pdf:'cfo-1fase.pdf', minutos:30, nq:10, feito:false}`). Controle de vagas por moeda (`simVagas`/`simTomaVaga`, l. 6337–6361) mutando o próprio objeto | Aluno, admin | Não | API · Persistir — **estoque de vagas concorrente não pode viver no cliente** | Eventos/simulados + banco de questões + financeiro | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END |
| `SIM_INSC` (l. 6305) | Feed da portaria de simulados: `{ simRot, nome:'AL SGT QUAD SANTIAGO', pago:true, valor:120, liberado:true, pontuado:true, euSou:false }` | Admin | Sim (nomes fictícios) | API · Persistir | Eventos + portaria | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `SIM_HIST` (l. 6310) | Histórico de simulados do aluno; alimentado ao concluir simulado digital (l. 7722) | Aluno | Resultado do aluno | API · **Persistir** — hoje se perde no F5 | Sistema pedagógico + relatórios/BI | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `ACESSO_ST` (l. 10820) | Portaria por evento: `ev.id → [{nome, liberado, euSou}]`; seeds por hash (`inscritosSeed`, l. 10809); o aluno da sessão entra/sai conforme compra (`acessoListaDe`, l. 10821). Liberação de entrada consome a compra (l. 10868–10871) | Admin | Sim (nomes) | API · Persistir | Eventos + portaria/recepção (geofencing é V1 no relatório) | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `ATIVIDADES` (l. 10879) | Banco de atividades para consulta de inscritos (`{id:'a-aulao', nome, tipo:'Aulão', n:73, seed:13}`); listas de nomes geradas por hash (`inscNome`, l. 10805) | Admin | Nomes sintéticos | API | Relatórios/BI | APENAS VISUAL + SIMULADO LOCALMENTE |
| `PROD_AGENDA` (l. 9366) | `nome do item → {dataISO, rot}` — item com data comprado entra na agenda/eventos | Aluno | Não | API · Persistir | Eventos + loja | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |

### 2.6 Loja, compras e economia de itens

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `lojaOwned` (l. 8658) | `{nome do item: true}` — posse de itens de compra única | Aluno | Não | API · **Persistir** — a compra some no F5 | Financeiro + loja | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS |
| `LOJA_CAT_NOME` / `PROD_DESTINOS` / `LOJA_EXTRAS` (l. 8832–8847), `ITENS_PRESENCIAIS` (l. 8868), `ITENS_COMBATE` (l. 9602), `MOCHILA` (l. 9610), `SKIN_CADEIA`/`SKIN_FARDAS`/`skinEtapa`/`skinAtual`/`fardaEscolhida` (l. 9702–9714), `boinaEquipada` (l. 7762) | Catálogo e posse: categorias, itens com estoque (`{id:'vademecum', nome:'Vade Mecum', preco:200, moeda:'qdc', estoque:8, estado:'disp'}`), itens de combate QdC, mochila (recompra permitida — dec. 172), cadeia de skins (gandola→colete→fuzil) e fardas (CIPE 500 / PATAMO 750 / BOPE 1300 QdC) | Aluno, admin | Não | Catálogo via API · posse e estoque persistidos no servidor | Loja/checkout + financeiro + painel administrativo | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END |
| `COMPRAS` (l. 11435) | Log de compras (seeds + do aluno), ex.: `{ aluno: nomeCurto(), item:'Turma PATAMO · matrícula', valor:2400, moeda:'qdc', quando:'há 55 dias', ts, tipo:'matricula', ref:'patamo-n' }`. Alimenta relatório (`renderRelCompras`, l. 11522), janela de estorno de 7 dias (`estornoDias`, l. 11562) e consumo (`compraConsumida`, l. 11447). `lojaCompraLog` exposto em `window.lojaCompraLog` (l. 11867) | Aluno, admin | Sim (nome do comprador) | API · Persistir (registro financeiro) | Financeiro/pagamentos + relatórios/BI | SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS. Estorno (`desfazerCompra`, l. 11592) devolve moeda e desfaz posse **só localmente** |
| `ESTORNOS` (l. 10124) | Lado admin dos estornos (`{item, aluno, quando, valor, moeda}` + ranking de itens mais estornados) | Admin | Sim (nome) | API · Persistir | Financeiro | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `PEDIDOS` (l. 10757) | Retiradas na recepção: `{ aluno: nomeCurto(), item:'Módulo impresso', presId:'modulo', quando:'há 2 dias', status:'aguardando' }`. Confirmação de entrega consome a compra | Admin | Sim (nome) | API · Persistir | Painel administrativo (recepção) + financeiro | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `LINKS_ONLINE` (l. 11866) | Objeto vazio; o comentário diz que o cadastro avulso de links "saiu da governança da Loja por estar obsoleto" | — | Não | Remover | — | CONFIRMADO NO CÓDIGO (código morto) + DECISÃO TÉCNICA PENDENTE |

### 2.7 Corpo docente e área do professor

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `DOCENTES` (l. 3815) + `PROFESSORES` (l. 3836) | Fonte de verdade do corpo docente — 6 professores, ex.: `{ nome:'Danilo Moura', materias:['Direito Administrativo','Direito Constitucional'], turnos:['manhã','noite'], grad:'Especialista em Direito Público', fone:'(71) 9 8877-2301', desligado:false, bloqueado:false }`; ganham `senha` (troca no painel, l. 5007) e `foto` (dataURL de upload, l. 4992) em memória. `PROFESSORES` é espelho de nomes ativos | Prof, admin | **Sim** — nome, telefone (todos os 6), graduação, foto e **senha em texto claro no objeto JS** | Front (mínimo) · API · Persistir; senha jamais no cliente | Cadastro geral (RH/coordenação) + autenticação | SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END |
| Login do professor (l. 4914–4953) | `PROF_SENHA_DEMO = 'quad1234'` hardcoded; e-mail derivado do sobrenome (`emailDoProf`, l. 4917 → `<sobrenome>@quadconcursos.com.br`); a dica de login é **impressa na tela** (`profGateNota`, l. 4927–4931); comparação de senha em texto claro (l. 4940) | Prof | E-mail derivado de nome | Autenticação real via API | Autenticação/autorização | CONFIRMADO NO CÓDIGO + APENAS VISUAL (gate 100% cliente) + DEPENDE DO BACK-END |
| `RECADOS_PROF` (l. 9945) | `nome do professor → [{texto, quando, lida, admRef}]` — recados da administração; leitura marca `lida` dos dois lados. Exposto em `window.__recadosProf` (l. 10035) | Prof, admin | Sim (conteúdo dirigido a pessoa) | API · Persistir | Notificações/mensageria | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `t.professores` por turma (`ensureProfs`, l. 4889) | Distribui professores por matéria **via hash** quando a turma não tem corpo docente definido | Prof | Sim (nomes) | Atribuição real via painel | Sistema pedagógico | SIMULADO LOCALMENTE + APENAS VISUAL (artifício de demo) |

### 2.8 Comunicação com o aluno

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `RECADOS` (l. 9812) | Chat do aluno ("+"): `{texto, quando, lida, admRef}` | Aluno | Conteúdo de mensagem | API · **Persistir** — o F5 apaga o histórico | Notificações/mensageria | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `ADM_MSGS` (l. 9813) | Histórico do admin (individuais, por professor, por público); `msgPublico()` (l. 9950) calcula alcance (turma real ou sintético por hash; "todos" = 1.286) | Admin | Sim (destinatários) | API · Persistir | Notificações + painel administrativo | SIMULADO LOCALMENTE + DEPENDE DO BACK-END (push real é V1 no relatório) |
| `AVISOS` (l. 10149) | Avisos por turma (`{t, d, alvo:'todas'\|turmaId}`) filtrados por `avisoVisivel` na turma ativa | Aluno, admin | Não | API · Persistir | Notificações | SIMULADO LOCALMENTE + DEPENDE DO BACK-END |

### 2.9 Avatar, identidade visual e mídia

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `AVATAR_SPRITE` / `AV_CX` / `AV_CY` / `AV_LABELS` / `avatarThumbs` / `avatarZoom` / `avatarIdx` (l. 7059–7065) | Sprite 6×2 (12 avatares) embutido pelo build; thumbs recortados em canvas para dataURLs; `AV_LABELS` descreve por gênero/etnia/cabelo (ex.: 'Homem · negro, corte fade'). **A escolha do avatar não persiste** | Aluno | Preferência de aparência | Front (assets) · **Persistir a escolha** (perfil no servidor) | Cadastro geral + storage de mídia | CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DECISÃO TÉCNICA PENDENTE |
| `AVATAR_VARIANTES` (l. 7117) | Fotos oficiais por variante (boina/gandola/colete/fuzil/cipe/patamo/bope) → índice do avatar, via token `__FOTOS_VARIANTES__` do build; exposto em `window.AVATAR_VARIANTES` (l. 7118) para a suíte de testes | Aluno | Não | Front (assets) | Storage de mídia | CONFIRMADO NO CÓDIGO + APENAS VISUAL |
| `DANILO_VIDEO` (l. 7774), `HELP_TUTS` (l. 7787), `ICON_CAT` (l. 8807), `ITEM_ICO` (l. 9594), `SKIN_ICO` (l. 9696), `SIM_ICO` (l. 6442), `TURMA_ICO` (l. 8717) | Mídia e ícones estáticos embutidos pelo build | Todos | Não | Front (assets via CDN) | Storage de mídia | APENAS VISUAL |
| Tutorial: `TUT_LS` (l. 5697), `TUT` (l. 5764), `TUT_PALAVROES` (l. 5699), `TUT_REW` (l. 6872: +30 score/+25 coins), `GESTOS` (l. 5919) | Roteiro do tutorial, filtro de palavrões do nome de guerra, recompensas e gestos. Persistência **parcial** em localStorage (Seção 3) | Aluno | Nome de guerra digitado | Front · estado de conclusão persistido no perfil | Sistema pedagógico | CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE |

### 2.10 Rankings e relatórios

| Estrutura (linha) | Finalidade · formato · exemplo | Perfil | Pessoal? | No sistema real (recomendação) | Sistema dono provável | Risco / classificação |
|---|---|---|---|---|---|---|
| `RK_NOMES` / `RK_OFF` (l. 7296–7297) | 48 sobrenomes + offsets para rankings sintéticos; posição do aluno é FÓRMULA (`salaPos` ≈ 29% do total, l. 7422; geral fixo `gPos = 87` de `gTot = 1286`, l. 7466). Só o score exibido do aluno é o real do protótipo | Aluno | Nomes sintéticos | Ranking calculado no servidor | Relatórios/BI | APENAS VISUAL + SIMULADO LOCALMENTE + DEPENDE DO BACK-END |
| `perfilPrivado` (l. 7302) | Máscara de mão dupla (dec. 132/143) — top 10 sempre visível; `mascararNome` (l. 7303). **A escolha não persiste — volta a público no F5** | Aluno | Preferência de privacidade | **Persistir a escolha** (é preferência de privacidade — crítica sob LGPD quando houver dado real) | Cadastro geral | CONFIRMADO NO CÓDIGO + SIMULADO LOCALMENTE + DECISÃO TÉCNICA PENDENTE |
| `REL_SEM` / `relDadosAluno` / `REL_LOJA_TOP` (l. 11737–11833) | Relatórios do admin: uso semanal e pontos fracos por aluno **derivados de hash do nome** ("dados sintéticos por aluno, estáveis"); top de vendas fixo; faturamento = base fixa (18.600 QdC / 9.400 Dmn) + compras vivas | Admin | Sim (nome ↔ desempenho, ainda que sintético) | Calculado no servidor sobre dados reais | Relatórios/inteligência de dados | APENAS VISUAL + SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END |

---

## 3. Chaves de localStorage efetivamente usadas

**CONFIRMADO NO CÓDIGO** por grep exaustivo: não há nenhum outro uso de `localStorage` em `src.html` além dos wrappers `lsGet/lsSet/lsDel` (l. 3737–3739) e das **8 chaves** abaixo, todas prefixadas `vq_`. Aliases: `LS = { auth, sync, pend }` (l. 3736) e `TUT_LS = { step, done, rew }` (l. 5697).

| Chave | Conteúdo | Quando é ESCRITA | Quando é LIDA | Removida no reset da demo? | Risco / observação |
|---|---|---|---|---|---|
| `vq_device_authorized` (`LS.auth`) | `'1'` = dispositivo autorizado | `entrarApp()`, l. 5677 | Boot, l. 3740 (`deviceAuthorized`) | Sim (l. 8642) | Flag herdada do fluxo antigo de ativação de dispositivo (removido pela dec. 21); hoje não bloqueia nada perceptível — código quase morto |
| `vq_last_sync` (`LS.sync`) | Timestamp do último "sync" | `setOnline()` l. 5613; `entrarApp()` l. 5677 | **Nunca é lida** | Sim (l. 8642) | Escrita sem leitura — telemetria fantasma. DECISÃO TÉCNICA PENDENTE (remover ou usar) |
| `vq_pending` (`LS.pend`) | Nº de respostas offline pendentes | **Nunca é escrita** | Boot, l. 3741 | Sim (l. 8642) | Legado do modo offline; `pendingAnswers` nunca é atualizado. Código morto |
| `vq_tut_step` (`TUT_LS.step`) | Passo atual do tutorial | A cada passo, l. 5975; `'0'` ao concluir (l. 6989/7010) | **Nunca é lida** (tutorial interrompido "recomeça do início", comentário l. 5684) | Sim (l. 8643) | Persistência gravada e não usada — retomada de tutorial é DECISÃO DE PRODUTO PENDENTE |
| `vq_tut_done` (`TUT_LS.done`) | `'1'` = tutorial concluído | Fim do tutorial (l. 6989/7010) | **Nunca é lida** | Sim (l. 8643) | Redundante com `vq_tut_skip` |
| `vq_tut_rew` (`TUT_LS.rew`) | (reserva para recompensa do tutorial) | **Nunca** | **Nunca** | Sim (l. 8643) | Chave declarada (l. 5697) e jamais usada. Código morto |
| `vq_tut_skip` | `'1'` = pular instrução no login | Fim do tutorial (l. 6989/7010) | `acessarPortal()`, l. 5650 | Sim (l. 8643) | **Única flag de tutorial realmente lida.** Também usada pela suíte Playwright para entrar direto (comentário l. 5649) |
| `vq_intro_done` | `'1'` = missão "Introdução no Quad" feita (flag conceitualmente **da conta**) | `blocoIntroMarca()`, l. 6882; `''` via `window.__introFeita(false)`, l. 6887 | Boot, l. 6884 | **NÃO — fica fora do reset (l. 8642–8643)** | **Inconsistência CONFIRMADA NO CÓDIGO:** "Resetar demonstração" limpa 7 chaves mas esquece `vq_intro_done` — após o reset, a Introdução continua marcada como feita. Além disso, flag "da conta" guardada por dispositivo: trocar de aparelho a perderia (no real, DEPENDE DO BACK-END) |

**Síntese:** das 8 chaves, **4 são total ou parcialmente mortas** (`vq_pending` nunca escrita; `vq_last_sync` e `vq_tut_step`/`vq_tut_done` nunca lidas; `vq_tut_rew` jamais usada). **Nenhum dado pessoal ou de negócio vai ao localStorage** — bom para a LGPD do protótipo, fatal para continuidade de experiência: nada de progresso sobrevive.

---

## 4. Mapa-resumo: estrutura × sistema proprietário provável (prospectivo)

| Estrutura | Sistema dono provável no ecossistema previsto |
|---|---|
| `DB_ALUNO`, `carreira` (nome), `CONTAS` | Cadastro geral de usuários/alunos |
| `MATRICULAS`, `TURMAS_LOJA`, `ISOLADAS` | Matrículas + site/checkout |
| `score`, `diamantes`, `COMPRAS`, `ESTORNOS`, `CREDITOS`, `GIFT_LOTES`, `PEDIDOS` | Financeiro/pagamentos + checkout do site |
| `EDITAL_*`, `CONCURSOS`, `QUESTIONS`/`QA_*`/`TR_BANK`/`AULA_DEMO`/`TQ` | Banco central de questões + lançamento de edital |
| `CRONO`, `BLOCOS_TURMA`, `TR_ST`, `QUIZZES`, `SIM_HIST`, Domínio | Sistema pedagógico (+ planilha da coordenação, hoje) |
| `EVENTOS`, `SIMULADOS`, `SIM_INSC`, `ACESSO_ST`, `PROD_AGENDA` | Sistema de eventos + portaria/recepção |
| `MATERIAIS` | Sistema de materiais (storage/CDN) + plataforma de cursos |
| `AVISOS`, `RECADOS`, `ADM_MSGS`, `RECADOS_PROF` | Notificações/mensageria |
| `RK_*`, `REL_*`, `ATIVIDADES`, telemetria | Relatórios/inteligência de dados |
| `DOCENTES`, senhas, chaves, gates | Autenticação/autorização + painel administrativo |
| `GAMI`, `MODALIDADES`, `SALAS`/`SALA_CAP` | Painel administrativo (parametrização) |

---

## 5. O que se perde a cada recarga da página (F5)

**CONFIRMADO NO CÓDIGO:** um F5 reinicializa a IIFE inteira e devolve **todo o estado de negócio** aos valores hardcoded. Perde-se, entre outros:

- **Carteiras e progresso:** Quad Coins voltam a 1240 (`score`, l. 3672), Diamantes a 150 (l. 3771); score de carreira volta a 620 e a patente ao índice 0 (`carreira`, l. 3708); gift cards resgatados voltam a ficar disponíveis (`giftUsados` zera).
- **Compras e posse:** todo o log de compras do aluno na sessão, posse de itens (`lojaOwned`), mochila, skins/fardas equipadas, pedidos de retirada e estornos.
- **Vida acadêmica:** matrículas compradas na sessão (volta só a seed PATAMO NOITE), turma ativa (volta a 'patamo-n'), progresso das missões da noite (`BLOCOS_TURMA`), estado do Treinamento Rápido e autoavaliações (`TR_BANK[i].nota/resp`), quizzes respondidos, histórico de simulados (`SIM_HIST`), resultado da prova de promoção.
- **Comunicação e administração:** recados do aluno e dos professores, mensagens do admin, avisos criados, turmas/eventos/simulados/itens criados no painel, créditos manuais, trocas de cronograma (`CRONO_LOG`), liberações de portaria.
- **Preferências:** avatar escolhido, perfil privado no ranking (`perfilPrivado` volta a público), senha e foto alteradas de professor.

**O que sobrevive** são apenas as flags do localStorage (Seção 3) — na prática, duas com efeito perceptível: `vq_tut_skip` (não repete a instrução de login) e `vq_intro_done` (a missão "Introdução no Quad" continua marcada como feita — inclusive **depois** do botão "Resetar demonstração", por causa do bug de reset incompleto, l. 8642–8643).

### Implicações para a demonstração

1. **Cada sessão de demo começa "limpa" e previsível** — isso é positivo para apresentações guiadas: o roteiro sempre parte do mesmo estado (aluno matriculado na PATAMO NOITE, 1240 QdC, 150 Dmn, patente AL SD).
2. **Não demonstre nada que dependa de "voltar amanhã":** qualquer narrativa de continuidade (progresso salvo, compra que permanece, mensagem que fica) quebra com um F5 acidental. Em demo ao vivo, **evite recarregar a página no meio do roteiro**.
3. **O botão "Resetar demonstração" não zera tudo:** ele limpa 7 flags mas esquece `vq_intro_done` (Seção 3) — para um reset completo de verdade é preciso limpar o localStorage manualmente ou corrigir o reset.
4. **Multiusuário é ilusão:** cada navegador/aba é um universo isolado; nada é compartilhado entre o "aluno", o "professor" e o "admin" além do que está no mesmo documento HTML da mesma aba. Demonstrações que envolvem duas pessoas em dois aparelhos "vendo a mesma coisa" não funcionam.
5. **Consequência de arquitetura (prospectiva):** a ausência quase total de persistência confirma que o protótipo é uma **camada de apresentação**. Para qualquer versão com aluno real, praticamente todas as estruturas da Seção 2 migram para o padrão "cache de sessão no front + API + persistência no servidor" (rotuladas DEPENDE DO BACK-END / DEPENDE DE BANCO DE DADOS / DEPENDE DE SISTEMA EXTERNO em cada linha) — no cliente deveriam restar apenas estado de UI, preferências locais e caches.
