# 09 — Integrações futuras: contratos lógicos do app com o ecossistema

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

---

## Atualização — Consolidação Arquitetural v1.0 (01/08/2026)

A Consolidação Arquitetural v1.0, determinada pelo gestor Danilo Moura em 01/08/2026, torna o Viver o Quad a **plataforma principal** do Quad Concursos: onze capacidades que este documento tratava como sistemas do ecossistema deixam de ser sistemas externos e passam a ser **módulos internos da própria plataforma** — cadastro, autenticação, matrículas, produção de materiais, banco de questões, simulados, inteligência pedagógica, loja, administração, relatórios e cronogramas. Consequências para este documento:

1. **A maioria dos 22 contratos deixa de ser integração com SISTEMA EXTERNO** e passa a ser **CONTRATO INTERNO** entre o front do app e módulos da própria plataforma. A **forma** de cada contrato interno — API interna, serviço, biblioteca — **fica para a fase de especificação**; as fichas continuam registrando apenas o contrato lógico, e as **entradas/saídas lógicas não mudaram**.
2. O campo **"Sistema fornecedor"** de cada ficha (e a coluna correspondente da tabela-resumo) foi atualizado para o módulo interno correspondente, sempre marcado **[PLANEJADO]**. A mudança é **exclusivamente arquitetural**: nada foi implementado, e todo módulo interno citado é "Módulo Planejado".
3. Permanecem **fora da plataforma** (integrações a definir), conforme a lista oficial de cinco itens da arquitetura (`docs/arquitetura/00-arquitetura-oficial.md`, seção 3): **site e checkout** (vitrine/venda), **pagamentos/financeiro** (dinheiro real, gateway), **plataforma de cursos** (legado em avaliação), **canal de notificações push/e-mail** e **telemetria como serviço de dados** (a decidir).
4. A **dec. 21 foi revogada**: o cadastro passa a pertencer à arquitetura do app (Módulo de Cadastro). O fluxo novo **não foi implementado** — o protótipo mantém o portão "Cadastro no site do Quad" como demonstração até a especificação do módulo (afeta principalmente as Fichas 1, 2 e 3).
5. As **regras econômicas** (loja, Quad Coins, Diamantes, gift cards) **seguem indefinidas** — as Fichas 14–17 registram a indefinição; nenhuma regra nova foi criada.
6. Os campos **"Estado atual"**, os rótulos (inclusive "DEPENDE DE SISTEMA EXTERNO"), as evidências de código e o texto da seção "Como ler" foram **mantidos como registro da auditoria de 30/07/2026** sobre o monolito `src.html`. As referências "src.html l.N" valem para o monolito auditado; a correspondência com a divisão do fonte em 20 partes (commits de 01/08/2026) está em `src/README.md`.

---

## Como ler este documento

O app "Viver o Quad" **não será dono de tudo**: no ecossistema previsto ele conversa com o site principal e checkout do Quad, plataforma de cursos, cadastro geral de usuários/alunos, matrículas, financeiro/pagamentos, banco central de questões, painel administrativo, sistema pedagógico, autenticação/autorização, eventos, materiais, notificações e relatórios/inteligência de dados.

Este documento descreve **contratos LÓGICOS** — o que precisa entrar e sair de cada integração — **sem fechar tecnologia** (não define REST vs. GraphQL, filas, fornecedores ou bancos). Cada ficha segue o formato fixo:

- **Necessidade** — o que a aplicação precisa fazer.
- **Sistema fornecedor** — quem, no ecossistema, é o dono da resposta.
- **Entrada lógica** — o que o app envia.
- **Saída lógica** — o que o app recebe.
- **Frequência e momento** — quando a chamada acontece.
- **Autenticação e permissão** — quem pode chamar e em nome de quem.
- **Indisponibilidade** — o que o app faz se o fornecedor não responder.
- **Estado atual** — mock, simulação local, inexistente, em teste ou integração parcial, com evidência no código (função/linha aproximada do `src.html`) e rótulo do vocabulário obrigatório.
- **Sugestão técnica não definitiva** — presente em **todas** as fichas, **sempre marcada como sugestão** (nunca é decisão); quando a rodada não firmou sugestão, a ficha registra explicitamente "sem sugestão".

Fatos que valem para TODAS as fichas (CONFIRMADO NO CÓDIGO):

1. Não existe **nenhuma** chamada de rede no protótipo — todo o estado vive em variáveis JS de uma IIFE única e a única persistência é `localStorage` com flags de tutorial/dispositivo (`lsGet/lsSet`, l. ~3737). Recarregar a página zera tudo, exceto as flags `vq_*`.
2. O próprio código já marca os pontos de integração com a etiqueta **`[INTEGRAÇÃO REAL]`** — **24 ocorrências** confirmadas por grep (checkout, validação de login, extração de PDF, QR de gift card, planilha do cronograma, presença por chamada etc.). As fichas abaixo citam essas marcas quando existem.
3. Hooks de teste `window.__*` (31) e credenciais demo (`quad1234`, `NPP-2026`, `QUAD-100`) embarcam no artefato publicado. Aceitável na V0; **qualquer integração real exige removê-los do build de produção** (DECISÃO TÉCNICA PENDENTE — build dev/prod separado).
4. "Estado atual: simulação local" significa que a mecânica funciona de verdade dentro da sessão, sem servidor; "mock" significa dado fixo/decorativo sem mecânica; "inexistente" significa que nem simulação há.

### Tabela-resumo

| # | Necessidade | Sistema fornecedor principal (Consolidação v1.0) | Estado atual |
|---|---|---|---|
| 1 | Autenticar aluno | Módulos de Autenticação e Cadastro [PLANEJADOS] | Simulação local (login aceita tudo) |
| 2 | Validar matrícula | Módulo de Matrículas [PLANEJADO] (+ pagamentos/checkout, externos) | Simulação local (encenação na vinheta) |
| 3 | Obter dados do aluno | Módulo de Cadastro [PLANEJADO] | Mock (`DB_ALUNO`) |
| 4 | Obter turmas | Módulos de Matrículas e Administração [PLANEJADOS] | Simulação local (`TURMAS_LOJA`/`MATRICULAS`) |
| 5 | Trocar contexto de turma | App real (front-end) + Módulo de Cadastro [PLANEJADO] (preferência) | Simulação local (não persiste) |
| 6 | Consultar cronograma | Módulo de Cronogramas [PLANEJADO] (hoje: planilha da coordenação) | Simulação local (snapshot `CRONO`) |
| 7 | Obter questões | Módulo de Banco de Questões [PLANEJADO] | Simulação local (bancos demo com gabarito no cliente) |
| 8 | Enviar respostas | Módulos de Inteligência Pedagógica e Banco de Questões [PLANEJADOS] | Simulação local (correção no cliente) |
| 9 | Calcular desempenho (Domínio/score) | Módulo de Inteligência Pedagógica [PLANEJADO] + gamificação interna (módulo a definir) | Mock (percentuais por hash) + simulação local (score) |
| 10 | Registrar eventos comportamentais | A definir — telemetria/coleta permanece fora da plataforma, "a decidir" (Relatórios [PLANEJADO] consome as leituras) | Mock (linha de telemetria decorativa) |
| 11 | Operar quiz ao vivo | Módulos de Simulados e Banco de Questões [PLANEJADOS] | Simulação local (polling randômico no mesmo navegador) |
| 12 | Consultar ranking | Módulo de Relatórios [PLANEJADO] + gamificação interna (módulo a definir) | Mock (posições por fórmula/hash) |
| 13 | Listar materiais | Módulo de Produção de Materiais [PLANEJADO] (+ plataforma de cursos, externa) | Simulação local (dataURL em memória) |
| 14 | Realizar compras | Módulo da Loja [PLANEJADO] (+ pagamentos/checkout, externos) | Simulação local (duas moedas em memória) |
| 15 | Consultar pagamento (saldo/recarga) | Módulos da Loja e Administração [PLANEJADOS] (+ pagamentos/checkout, externos) | Simulação local (`diamantes`, gift cards) |
| 16 | Controlar estoque | Módulos da Loja, Matrículas e Administração [PLANEJADOS] | Simulação local (decremento em memória) |
| 17 | Solicitar estorno | Módulos da Loja e Administração [PLANEJADOS] (+ gateway de pagamento, externo) | Simulação local (janela de 7 dias em memória) |
| 18 | Registrar presença | Módulos de Administração e Simulados [PLANEJADOS] | Simulação local (booleano em `ACESSO_ST`/`SIM_INSC`) |
| 19 | Liberar entrada | Módulos de Administração e Loja [PLANEJADOS] | Simulação local |
| 20 | Enviar avisos | Módulos de Administração e Matrículas [PLANEJADOS] (+ canal de notificações, externo) | Simulação local (sem push; badge no "+") |
| 21 | Administrar professores | Módulos de Cadastro, Autenticação e Administração [PLANEJADOS] | Simulação local (nome como chave; senha em texto claro) |
| 22 | Administrar editais e questões | Módulos de Banco de Questões e Administração [PLANEJADOS] | Integração parcial na demo (árvores vivas) + telas apenas visuais |

---

## Ficha 1 — Autenticar aluno

- **Necessidade**: validar e-mail+senha do aluno, abrir sessão e recusar conta bloqueada; "Criar conta" redireciona ao site (a conta nasce no checkout, junto da matrícula — dec. 21; **dec. 21 revogada em 01/08 pela Consolidação v1.0** — o portão do site é mantido apenas como demonstração até a especificação do Módulo de Cadastro).
- **Sistema fornecedor**: Módulo de Autenticação do Viver o Quad [PLANEJADO] + Módulo de Cadastro do Viver o Quad [PLANEJADO]. A criação de conta passa a pertencer ao Módulo de Cadastro (dec. 21 revogada na Consolidação v1.0); o protótipo, porém, mantém o portão "Cadastro no site do Quad" como demonstração até a especificação do módulo.
- **Entrada lógica**: e-mail, senha, identificação do dispositivo/app; no redirecionamento de cadastro, retorno ao app após concluir no site.
- **Saída lógica**: sessão válida (com identidade do aluno e perfis/permissões) ou recusa tipada: credencial inválida, **conta bloqueada** ("procure a administração"), conta inexistente (encaminhar ao site).
- **Frequência e momento**: a cada login; renovação silenciosa de sessão durante o uso; revogação empurrada quando o painel administrativo bloquear a conta (hoje o bloqueio derruba a sessão na hora — comportamento que o produto quer manter no real).
- **Autenticação e permissão**: é a própria porta de autenticação; o app nunca decide sozinho quem entra.
- **Indisponibilidade**: tela de login com aviso de indisponibilidade e nova tentativa; sem sessão previamente válida, o app não abre (não há modo offline de negócio previsto na V0 — o resquício de fluxo offline `vq_pending` é código morto, CONFIRMADO NO CÓDIGO).
- **Estado atual**: **simulação local**. `acessarPortal()` (l. 5633) aceita **qualquer e-mail com "@" e qualquer senha**; comentário `[INTEGRAÇÃO REAL] validar no servidor` (l. ~5629); bloqueio de conta consulta apenas o array local `CONTAS` (l. ~9803). Rótulos: SIMULADO LOCALMENTE + APENAS VISUAL (nada é autenticado) + DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (checkout para criação de conta).
- **Sugestão técnica não definitiva** *(sugestão)*: sessão por token de curta duração com renovação, emitida por um serviço central de identidade compartilhado com o site — o mesmo login para site, plataforma de cursos e app.

## Ficha 2 — Validar matrícula

- **Necessidade**: confirmar, no momento do acesso, que o aluno tem matrícula ativa; sem matrícula ativa o app trava (resta a Quad Store — dec. 62).
- **Sistema fornecedor**: Módulo de Matrículas do Viver o Quad [PLANEJADO]; pagamentos/financeiro e o checkout do site permanecem fornecedores EXTERNOS (venda em dinheiro e status de pagamento).
- **Entrada lógica**: identidade do aluno autenticado.
- **Saída lógica**: lista de matrículas com situação (ativa/encerrada), turma, turno, concurso e data de término; vazio = app bloqueado.
- **Frequência e momento**: no login (hoje encenado na vinheta "Verificando a matrícula de…"); reconferência ao retomar o app e quando um estorno/encerramento chegar do financeiro.
- **Autenticação e permissão**: sessão do aluno; o aluno só enxerga as próprias matrículas.
- **Indisponibilidade**: se houver resposta anterior recente, usar como leitura provisória com aviso; sem nenhuma, tratar como indisponibilidade de login (não assumir "sem matrícula", que travaria o app injustamente).
- **Estado atual**: **simulação local**. `checarMatricula()`/`appLock` (l. 3900) leem o array `MATRICULAS` (l. ~3850, "o aluno da demo veio do site já matriculado"); a "verificação" da vinheta é encenada (`splashVerify`, l. ~5645). Rótulos: SIMULADO LOCALMENTE + APENAS VISUAL (verificação) + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS + DEPENDE DE SISTEMA EXTERNO (matrícula nasce no checkout).
- **Sugestão técnica não definitiva** *(sugestão)*: situação de matrícula servida pelo mesmo serviço que atende o site/checkout, com evento de encerramento/estorno empurrado ao app — o app nunca infere vigência sozinho.

## Ficha 3 — Obter dados do aluno

- **Necessidade**: exibir e manter nome completo, telefone, nome de guerra, avatar escolhido e estado de carreira (patente, scores) — dados que o código diz virem "do banco de dados geral do site".
- **Sistema fornecedor**: Módulo de Cadastro do Viver o Quad [PLANEJADO] (identidade e contato) + gamificação interna da plataforma (carreira — ver Ficha 9; módulo responsável a definir na especificação). O texto do tutorial ("Corrigir no site") reflete o protótipo anterior à revogação da dec. 21 — o fluxo real de correção cadastral fica para a especificação do Módulo de Cadastro.
- **Entrada lógica**: identidade do aluno; para escrita: nome de guerra validado (regras locais de subsequência do nome e filtro de palavrões podem continuar no front) e escolha de avatar.
- **Saída lógica**: ficha do aluno (nome, telefone, nome de guerra, avatar, patente, scores, histórico de promoções).
- **Frequência e momento**: leitura no login e ao abrir o perfil; escrita ao salvar o perfil (nome de guerra/avatar — escolha do avatar é única, no tutorial).
- **Autenticação e permissão**: sessão do aluno; escrita restrita aos campos que são do aluno (nome de guerra, avatar); dados cadastrais são somente leitura no app.
- **Indisponibilidade**: exibir o último snapshot em cache com aviso; bloquear edições até voltar.
- **Estado atual**: **mock**. `DB_ALUNO` (l. ~3946, comentário `[INTEGRAÇÃO REAL] preenchidos a partir da matrícula ativa`) e `carreira` (l. ~3708). Rótulos: SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (cadastro do site) + DEPENDE DE BANCO DE DADOS. Atenção: DIVERGÊNCIA interna já registrada — `DB_ALUNO.nome` ("Danilo de Almeida Moura") ≠ `carreira.nomeCompleto` ("Danilo Ribeiro Moura"); nem escolha de avatar nem nome de guerra persistem hoje (DECISÃO TÉCNICA PENDENTE).
- **Sugestão técnica não definitiva** *(sugestão)*: perfil dividido em dois domínios: cadastro (somente leitura no app, dono = site/cadastro geral) e preferências do aluno (nome de guerra, avatar) num serviço de perfil próprio, persistidas por conta.

## Ficha 4 — Obter turmas

- **Necessidade**: listar o catálogo de turmas à venda (preços e vagas POR MOEDA, sala, turno, horário, concurso, período) e as turmas do aluno; aplicar a regra "uma turma por turno até o término".
- **Sistema fornecedor**: Módulo de Matrículas do Viver o Quad [PLANEJADO] + Módulo de Administração do Viver o Quad [PLANEJADO] (criação/edição de turma); o site/checkout permanece fornecedor EXTERNO quando a venda for em dinheiro.
- **Entrada lógica**: identidade do aluno (para marcar INDISPONÍVEL por turno ocupado e ESGOTADA por vaga zerada).
- **Saída lógica**: catálogo com `precoDmn/precoQdc/vagasDmn/vagasQdc`, sala, turno, concurso, início/fim; matrículas do aluno com situação.
- **Frequência e momento**: ao abrir a Quad Store e "Minhas turmas"; atualização quando o admin cria/edita/remove turma ou altera preços/vagas (hoje reflete na hora porque tudo é o mesmo arquivo).
- **Autenticação e permissão**: leitura do catálogo é da sessão do aluno; escrita (criar/editar/remover, preços e vagas) é exclusiva do painel administrativo (ver Ficha 21/22 para o padrão de permissão administrativa).
- **Indisponibilidade**: vitrine com último catálogo em cache e **compra desabilitada** (nunca vender com estoque de vaga desconhecido).
- **Estado atual**: **simulação local**. `TURMAS_LOJA` (l. ~3842), `MATRICULAS` (l. ~3850), `turnoOcupadoPor()` (l. ~3895), criação/validações no admin (lotação ≤ `SALA_CAP`, choque de sala — l. ~8450–8563). Rótulos: SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END.
- **Sugestão técnica não definitiva** *(sugestão)*: catálogo publicado como leitura versionada com cache curto no app; escrita exclusiva do painel administrativo; vagas por moeda decrementadas apenas por transação de compra no servidor (Ficha 14).

## Ficha 5 — Trocar contexto de turma (turma ativa)

- **Necessidade**: com 2+ matrículas, eleger a "turma ativa" que comanda Início, Aula de hoje, avisos, ranking da sala, Domínio, quiz, Missões, calendário e materiais — trocável sem deslogar, com a escolha lembrada entre sessões.
- **Sistema fornecedor**: majoritariamente o **próprio front-end real** (recomposição das telas); a **preferência** de turma ativa é estado do usuário e pertence ao perfil/preferências do Módulo de Cadastro do Viver o Quad [PLANEJADO].
- **Entrada lógica**: id da turma escolhida.
- **Saída lógica**: confirmação de gravação da preferência; o restante é recomposição local com dados das Fichas 4, 6, 7, 13 filtrados pela turma.
- **Frequência e momento**: a cada troca manual (topo, Minhas turmas, faixa do Domínio, pop-up pós-matrícula); leitura da preferência no login.
- **Autenticação e permissão**: sessão do aluno; só é possível ativar turma em que ele está matriculado (validação que hoje o `turmaAtiva()` faz se autocorrigindo).
- **Indisponibilidade**: a troca funciona localmente e a preferência é gravada quando o serviço voltar (perder só a preferência, nunca a navegação).
- **Estado atual**: **simulação local**. `definirTurmaAtiva()` (l. 3867) redesenha ~12 áreas; `turmaAtivaId` não persiste — **volta ao padrão a cada F5** (DECISÃO TÉCNICA PENDENTE já registrada). Rótulos: CONFIRMADO NO CÓDIGO + DEPENDE DO FRONT-END REAL + DEPENDE DE BANCO DE DADOS (persistir a escolha).
- **Sugestão técnica não definitiva** *(sugestão)*: persistir a turma ativa como preferência do usuário no serviço de perfil (Ficha 3); a recomposição das telas permanece 100% no front real.

## Ficha 6 — Consultar cronograma

- **Necessidade**: exibir a grade semanal da turma (dia × tempo × matéria × professor × sala), a "Aula de hoje" com estados AGORA/ENCERRADO e o calendário do professor — grade chaveada pelo **id da turma** (dec. 163).
- **Sistema fornecedor**: Módulo de Cronogramas do Viver o Quad [PLANEJADO]. O código declara a origem real de hoje: **planilha Google Sheets da coordenação** (comentário l. ~4740–4744, sincronização prevista para a V1) — enquanto a planilha for a fonte, ela permanece uma origem de dados externa transitória (tratamento a definir na especificação do módulo).
- **Entrada lógica**: id da turma + semana de referência.
- **Saída lógica**: grade da semana (slots, dias, datas, aulas com matéria/professor), sala; alterações pontuais (troca de aula) com histórico.
- **Frequência e momento**: ao abrir Início/calendários; atualização quando a coordenação troca uma aula (hoje o admin edita e reflete na hora; no real, sincronização periódica ou push da fonte).
- **Autenticação e permissão**: leitura pelo aluno (só turmas em que está) e pelo professor (só turmas dele); escrita exclusiva da coordenação/painel administrativo.
- **Indisponibilidade**: mostrar a última grade sincronizada com carimbo "atualizado em…"; "Aula de hoje" degrada para "A definir".
- **Estado atual**: **simulação local** (snapshot fixo da "semana 30" em `CRONO`, l. ~4745; edição do admin em `CRONO.turmas[id]` com log `CRONO_LOG`, l. ~10311). Rótulos: SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (planilha/fonte da coordenação) + DEPENDE DE BANCO DE DADOS. Observação: a grade-semente cita ~10 professores que não existem no banco `DOCENTES` (DIVERGÊNCIA interna confirmada) — o contrato real precisa referenciar professores por ID, não por nome.
- **Sugestão técnica não definitiva** *(sugestão)*: enquanto a planilha da coordenação for a fonte, um sincronizador periódico planilha→banco com validação de professores por ID; o app só lê do banco, nunca da planilha.

## Ficha 7 — Obter questões

- **Necessidade**: alimentar os motores de questões do app — flashcards do Treinamento Rápido, blocos de missões da noite, quiz da aula, simulado digital, prova de promoção e a missão de introdução — com questões classificadas por concurso/matéria/assunto do edital; inclui a extração de questões a partir de PDF enviado por professor/admin.
- **Sistema fornecedor**: Módulo de Banco de Questões do Viver o Quad [PLANEJADO] (+ extração de PDF, marcada `[INTEGRAÇÃO REAL]` em vários pontos — forma de implementação a definir na especificação).
- **Entrada lógica**: contexto pedido (concurso/turma, matéria/assunto, tipo — múltipla escolha ou certo/errado —, quantidade, finalidade: flashcard/quiz/simulado/prova); para extração: o arquivo PDF.
- **Saída lógica**: lote de questões com enunciado, alternativas e metadados; **o gabarito NÃO deve viajar com a questão** para nenhuma avaliação que valha pontos — hoje o gabarito está no objeto no cliente (`QUESTIONS[].right`, `QA_MULT`, `QA_CE`, `TR_BANK`, `AULA_DEMO`, `TQ`), o que permitiria fraude trivial (risco já registrado na auditoria de dados).
- **Frequência e momento**: ao montar cada bloco/quiz/simulado/prova; a fila de missões nasce por turma no horário dela (hoje 22h15, `novosBlocosDia`).
- **Autenticação e permissão**: sessão do aluno para consumo; professor/admin para envio de PDF e curadoria (Ficha 22).
- **Indisponibilidade**: missões e treinos exibem "conteúdo indisponível, tente mais tarde"; nunca inventar questões; blocos já baixados podem ser respondidos e sincronizados depois — se o produto decidir ter esse modo (DECISÃO DE PRODUTO PENDENTE; o resquício offline atual é código morto).
- **Estado atual**: **simulação local** com bancos demo (`TR_BANK` ~60 cartas l. ~6122; `QA_MULT`/`QA_CE` l. ~5248–5272; `AULA_DEMO` 40 itens l. ~6186; `TQ` l. ~6867); extração de PDF usa **apenas o nome do arquivo** e sorteia do banco demo (`qzMontarQuestoes`, l. 5280, comentário `[INTEGRAÇÃO REAL] extração do PDF`). Rótulos: SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DE SISTEMA EXTERNO (parser de PDF) + DEPENDE DO BACK-END.
- **Sugestão técnica não definitiva** *(sugestão)*: para avaliações pontuadas, correção no servidor (o app envia respostas e recebe resultado); gabarito no cliente apenas em treinos sem valor de pontuação.

## Ficha 8 — Enviar respostas

- **Necessidade**: registrar cada resposta do aluno (flashcards com autoavaliação Errei/Difícil/Bom/Fácil, blocos da noite, quiz da aula, simulado digital, prova de promoção) para corrigir, premiar, alimentar o Domínio, o relatório ao vivo do professor e o histórico.
- **Sistema fornecedor**: Módulo de Inteligência Pedagógica do Viver o Quad [PLANEJADO] + Módulo de Banco de Questões do Viver o Quad [PLANEJADO] (histórico por aluno×questão) + gamificação interna da plataforma (recompensas — Ficha 9; módulo responsável a definir na especificação).
- **Entrada lógica**: identidade do aluno, contexto (turma, bloco/quiz/simulado/prova), questão, resposta, autoavaliação quando houver, tempo de resposta.
- **Saída lógica**: confirmação de registro; quando a correção é do servidor: resultado (acertos, aprovação da prova, recompensas creditadas); estado do bloco (feito/expirado — expiração em 7 dias vira "Atrasadas").
- **Frequência e momento**: a cada resposta ou ao fechar o bloco (lote); prova de promoção ao concluir; simulado digital ao concluir ou zerar o cronômetro.
- **Autenticação e permissão**: sessão do aluno; o aluno só grava respostas próprias; a autoavaliação de dificuldade é **dado pedagógico sensível** (base da prova de promoção — o aluno não sabe que a prova usa as questões que ele marcou Errei/Difícil) e deve ser protegida como tal (LGPD — ver auditoria de dados, seção 3).
- **Indisponibilidade**: guardar respostas pendentes localmente e reenviar (com idempotência para não premiar duas vezes); recompensas só aparecem após confirmação do servidor.
- **Estado atual**: **simulação local** — correção e progresso 100% no cliente: `TR_BANK[i].nota/resp`, `BLOCOS_TURMA[..].feito` (l. ~6264), `QUIZZES[..].respostasAluno` (l. ~5275), `prova`/`provaColeta` (l. ~7522–7545), `SIM_HIST` (l. ~6310). Nada sobrevive ao F5. Rótulos: SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Sugestão técnica não definitiva** *(sugestão)*: fila idempotente de eventos de resposta com correção no servidor para tudo que pontua; o cliente guarda no máximo rascunho local sem valor de pontuação.

## Ficha 9 — Calcular desempenho (Domínio, score, patente, recompensas)

- **Necessidade**: manter os três scores (carreira/patente/temporada), o Domínio por sub-assunto do edital, a liberação e correção da prova de promoção (80% promove; reprovação bloqueia 24h) e o crédito de recompensas (score, Quad Coins) — com a regra de ouro do próprio código: *"a interface nunca decide sozinha quantos pontos foram conquistados"* (comentário l. ~3706).
- **Sistema fornecedor**: gamificação interna da plataforma (módulo responsável a definir na especificação) + Módulo de Inteligência Pedagógica do Viver o Quad [PLANEJADO] + Módulo de Relatórios do Viver o Quad [PLANEJADO]; parametrização (14 patentes, 4 fases, metas) vem do Módulo de Administração do Viver o Quad [PLANEJADO].
- **Entrada lógica**: eventos confirmados de atividade (Ficha 8: respostas, blocos completos, presenças da Ficha 19, participação em eventos).
- **Saída lógica**: saldos e scores atualizados, percentuais de Domínio, estado da prova (disponível/bloqueada até data-hora), resultado de promoção com transferência de excedente, histórico de patentes.
- **Frequência e momento**: recalculo a cada evento confirmado; leitura ao abrir Quadrômetro/Domínio; prova sob demanda.
- **Autenticação e permissão**: somente o servidor credita pontos/moedas; o app exibe. Ajuste de parâmetros (metas, notas mínimas) restrito ao painel administrativo.
- **Indisponibilidade**: exibir últimos valores com carimbo; atividades continuam e creditam depois (fila idempotente); prova de promoção indisponível (não corrigir no cliente).
- **Estado atual**: **mock + simulação local**. Domínio é **determinístico por hash do nome do assunto** (`edSubPct`/`ED_BASE`, l. ~4149–4159 — APENAS VISUAL) com deslocamento do Treinamento Rápido (`trAj`); score/moedas mutados livremente no cliente (`addScore` l. ~3755, `addPontos` l. ~7498); prova corrige no cliente com `PROVA_APROV = 0.80` fixo (l. ~7521) — a nota mínima por fase de `GAMI.fases[].notaMin` **não é aplicada** (DIVERGÊNCIA DOCUMENTAL + DECISÃO TÉCNICA PENDENTE, já registrada); botões demo (`demoSobePatente`, l. ~7745) marcados "[DEMO PROVISÓRIO — REMOVER]". Rótulos: APENAS VISUAL (Domínio) + SIMULADO LOCALMENTE + DEPENDE DO BACK-END.
- **Sugestão técnica não definitiva** *(sugestão)*: motor de gamificação como serviço próprio, com as constantes de `GAMI` viradas em configuração administrável e crédito de recompensas somente por evento confirmado (Ficha 8).

## Ficha 10 — Registrar eventos comportamentais (telemetria)

- **Necessidade**: registrar origem da sessão (taxonomia ORGANIC/CLASS/PUSH/MENTOR/NOTICE/CAMPAIGN), tempo por questão, padrões de resposta, abandono e constância — a "linha de base comportamental" que o docs/01 define como pré-requisito da V0 e insumo do futuro IRA (Índice de Risco de Abandono); métrica-mãe do produto é o retorno espontâneo `OPEN_ORGANIC`.
- **Sistema fornecedor**: **a definir** — a arquitetura oficial (v1.0, seção 3) separa o módulo interno de **Relatórios** do serviço de **telemetria/coleta de eventos**, que permanece **fora da plataforma e "a decidir"**; atribuir a coleta a um módulo interno anteciparia decisão não tomada. O Módulo de Relatórios [PLANEJADO] é candidato a consumidor das leituras agregadas, não dono declarado da coleta.
- **Entrada lógica**: eventos com carimbo de tempo, tipo, contexto (tela, turma, atividade) e **identificador pseudonimizado** do aluno.
- **Saída lógica**: em princípio nenhuma para o app (fire-and-forget); leituras agregadas voltam pelos relatórios (Ficha do ecossistema de BI, fora deste app).
- **Frequência e momento**: contínua, desde o dia 1 ("eventos logados desde o dia 1" — docs/01).
- **Autenticação e permissão**: sessão do aluno para emitir; consumo restrito a BI. **Salvaguardas declaradas pelo produto**: "Comportamento é computado, nunca gravado como rótulo (LGPD)" e "nunca Dado → Oferta" — diretrizes sem implementação (DECISÃO TÉCNICA PENDENTE: agregação, retenção curta, pseudonimização; DECISÃO DE PRODUTO PENDENTE: governança do IRA).
- **Indisponibilidade**: fila local com descarte por idade; perda de telemetria nunca degrada a experiência.
- **Estado atual**: **mock/inexistente**. Só existe o mostrador estático `#telemetry` ("origem: OPEN_ORGANIC · eventos: 14 · linha de base: ativa", HTML l. ~1814) — que hoje **ecoa o e-mail digitado** (l. ~5644; no real, pseudonimizar). Nenhum evento é coletado ou enviado; nenhuma função de risco/abandono existe no código (grep confirmado). Rótulos: APENAS VISUAL + DEPENDE DE SISTEMA EXTERNO (analytics) + HIPÓTESE (desenho do IRA).
- **Sugestão técnica não definitiva** *(sugestão)*: coletor de eventos padronizado com a taxonomia de origem em todos os eventos e identificador pseudonimizado desde o primeiro evento; agregação para BI fora do caminho crítico do app.

## Ficha 11 — Operar quiz ao vivo

- **Necessidade**: o professor cria o quiz da turma a partir de um PDF (1–30 questões, 1–180 min, múltipla escolha ou certo/errado), ativa (trava), acompanha o placar e o relatório por questão em tempo real e encerra; o aluno responde com cronômetro, sem gabarito e sem premiação; um quiz por turma.
- **Sistema fornecedor**: Módulo de Simulados do Viver o Quad [PLANEJADO] (operação ao vivo — a infraestrutura de tempo real fica para a fase de especificação) + Módulo de Banco de Questões do Viver o Quad [PLANEJADO]/extração de PDF (Ficha 7).
- **Entrada lógica**: do professor: turma, tipo, nº de questões, duração, PDF, comandos criar/refazer/descartar/ativar/encerrar; do aluno: respostas com tempo (Ficha 8).
- **Saída lógica**: para o aluno: estado do quiz da sua turma (criado/ativo/encerrado) e as questões; para o professor: contagem de respondentes sobre a lotação real da turma e distribuição por alternativa por questão, **começando em branco** ("nada de % inventado na aula").
- **Frequência e momento**: durante a aula; estado do quiz precisa chegar ao aluno em segundos (hoje é instantâneo porque tudo é o mesmo navegador).
- **Autenticação e permissão**: professor só opera quiz das turmas em que está escalado; aluno só vê o quiz das turmas em que está matriculado (prioridade à turma ativa).
- **Indisponibilidade**: sem tempo real, o quiz não ativa (avisar o professor); respostas do aluno com reenvio; relatório degrada para atualização por recarga.
- **Estado atual**: **simulação local**. `QUIZZES` por turma (l. ~5275); placar simulado por `setInterval` 700 ms com incrementos aleatórios (`pollRodar`, l. ~5327); distribuição determinística por hash incorporando a resposta real do aluno da demo (`qzDist`/`qzRelatorio`, l. ~5395–5441); "Feedback dos alunos" é EM BREVE (APENAS VISUAL). Rótulos: SIMULADO LOCALMENTE + DEPENDE DO BACK-END (tempo real) + DEPENDE DE SISTEMA EXTERNO (parser de PDF).
- **Sugestão técnica não definitiva** *(sugestão)*: canal de tempo real (ex.: websocket/eventos de servidor) só para estado do quiz e contadores; questões e correção seguem o fluxo das Fichas 7/8.

## Ficha 12 — Consultar ranking

- **Necessidade**: exibir ranking da sala (turma ativa) e geral, com privacidade de mão dupla (perfil privado mascara o nome e deixa de ver os demais; top 10 sempre visível) e pontos sempre à vista.
- **Sistema fornecedor**: gamificação interna da plataforma (módulo responsável a definir na especificação) + Módulo de Relatórios do Viver o Quad [PLANEJADO]; a preferência público/privado pertence ao perfil/preferências do Módulo de Cadastro do Viver o Quad [PLANEJADO].
- **Entrada lógica**: identidade do aluno, escopo (sala/geral), preferência de privacidade (escrita quando o aluno alterna o interruptor).
- **Saída lógica**: lista posicionada (nome de guerra ou máscara conforme regra), posição e total; confirmação da gravação da preferência.
- **Frequência e momento**: ao abrir o ranking; recomputo periódico no servidor (não a cada clique).
- **Autenticação e permissão**: sessão do aluno; a máscara é aplicada **pelo servidor** conforme a preferência de cada participante (no cliente ela seria contornável). Top 10 sempre exposto é regra vigente — o opt-out do hall é DECISÃO DE PRODUTO PENDENTE sob LGPD (já registrada).
- **Indisponibilidade**: último ranking em cache com carimbo; interruptor de privacidade desabilitado até voltar.
- **Estado atual**: **mock**. 48 sobrenomes sintéticos (`RK_NOMES`, l. ~7296); posição do aluno é **fórmula** (~29% do total na sala; geral fixo 87º de 1.286, l. ~7422–7466); `perfilPrivado` não persiste — **volta a público no F5** (risco de privacidade real, DECISÃO TÉCNICA PENDENTE). Rótulos: APENAS VISUAL + SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Sugestão técnica não definitiva** *(sugestão)*: ranking materializado periodicamente no servidor, com a máscara de privacidade aplicada na resposta; preferência público/privado gravada no serviço de perfil (Ficha 3).

## Ficha 13 — Listar materiais

- **Necessidade**: entregar ao aluno os materiais publicados por turma → matéria (da árvore do edital) → assunto → tipo (slides/resumo/lista/mapa/vídeo), com download real e etiqueta de turma; matrícula nova traz o material, estorno o leva; o admin publica, edita e tira do ar.
- **Sistema fornecedor**: Módulo de Produção de Materiais do Viver o Quad [PLANEJADO] (armazenamento/entrega de arquivos — forma a definir na especificação); a plataforma de cursos permanece fornecedora EXTERNA (legado em avaliação); publicação via Módulo de Administração do Viver o Quad [PLANEJADO].
- **Entrada lógica**: leitura: identidade do aluno (matrículas ativas filtram); publicação: turma, matéria, assunto, tipo, título, arquivo ou link de vídeo.
- **Saída lógica**: lista de materiais com metadados e URL segura de download/streaming; confirmações de publicação/remoção.
- **Frequência e momento**: ao abrir a área de materiais; notificação de material novo é desejável (Ficha 20).
- **Autenticação e permissão**: aluno baixa apenas materiais das turmas em que está; publicação restrita ao painel administrativo (e, se o produto decidir, a professores — DECISÃO DE PRODUTO PENDENTE, hoje só o admin publica).
- **Indisponibilidade**: lista em cache; download indisponível com aviso; nunca perder o arquivo publicado (hoje o upload vive só na memória da sessão).
- **Estado atual**: **simulação local**. `MATERIAIS` (l. ~10344); upload vira dataURL em memória e o aluno "baixa de verdade" via `URL.createObjectURL` (`renderMateriaisAluno`, l. 10353; publicação l. ~10454–10489); ✕ revoga o ObjectURL. Rótulos: SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (storage/CDN) + DEPENDE DO BACK-END.
- **Sugestão técnica não definitiva** *(sugestão)*: storage de objetos com URLs assinadas de curta duração e metadados no banco; publicação e remoção via painel administrativo.

## Ficha 14 — Realizar compras

- **Necessidade**: vender no app com as duas moedas (Quad Coin conquistada; Diamante comprada em dinheiro) — turmas (com vagas por moeda), isoladas, eventos pagos, simulados, produtos físicos com estoque, cursos/mentorias, skins (cadeia + farda de escolha única) e itens de combate (recompra livre) — sempre com confirmação, registrando a compra para relatório e estorno.
- **Sistema fornecedor**: Módulo da Loja do Viver o Quad [PLANEJADO] (loja/inventário e saldos das moedas internas — as regras econômicas seguem indefinidas); pagamentos/financeiro e o site/checkout permanecem fornecedores EXTERNOS quando a venda é em dinheiro real (hoje só a recarga de Diamantes); catálogo governado pelo Módulo de Administração do Viver o Quad [PLANEJADO].
- **Entrada lógica**: identidade do aluno, item, quantidade, **moeda escolhida** (pop-up "Creditar em" quando há duas), confirmação.
- **Saída lógica**: resultado atômico: débito do saldo, baixa de vaga/estoque **na moeda usada**, posse/matrícula/inscrição criada, registro de compra (com carimbo para a janela de estorno); recusas tipadas: saldo insuficiente ("recarregue no site ou resgate um gift card"), ESGOTADA/LOTADO, turno ocupado, choque de agenda (aviso sem impedir, exceto matrícula, que é barrada).
- **Frequência e momento**: sob demanda; vagas por moeda e estoque exigem **reserva atômica no servidor** (concorrência real não pode viver no cliente).
- **Autenticação e permissão**: sessão do aluno; débito e baixa só no servidor.
- **Indisponibilidade**: compra desabilitada com aviso; nunca "vender" localmente para acertar depois.
- **Estado atual**: **simulação local** completa: `matricular()` (l. 8757), `comprarEvento()` (l. 4398), `finalizarCompraSim()` (l. ~6526), `mochilaComprar()` (l. ~9638), skins (l. ~9702–9771), `COMPRAS` (l. ~11435), confirmação `confirmarCompra()` (l. ~9236). Rótulos: SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS + DEPENDE DE SISTEMA EXTERNO (checkout quando envolver dinheiro). Observação documental: a rev. 2.3 previa economia só na V1 e "Score não é moeda" — a Loja na V0 e a venda em QdC são decisões do gestor ainda não realinhadas no documento-base (DIVERGÊNCIA DOCUMENTAL registrada na dec. 11).
- **Sugestão técnica não definitiva** *(sugestão)*: transação única no servidor (débito + baixa de vaga/estoque + criação de posse), idempotente por tentativa, com recusas tipadas espelhando as do protótipo.

## Ficha 15 — Consultar pagamento (saldos, recarga e gift card)

- **Necessidade**: exibir os saldos de Quad Coins e Diamantes; receber crédito de Diamantes vindo de **recarga no checkout do site** ou de **gift card de liberação única** (lotes com QR criados no painel); receber créditos manuais da administração (com motivo e trilha).
- **Sistema fornecedor**: Módulo da Loja do Viver o Quad [PLANEJADO] (saldos das duas moedas — as regras econômicas seguem indefinidas) + Módulo de Administração do Viver o Quad [PLANEJADO] (lotes de gift card e créditos manuais); pagamentos/financeiro e o checkout do site permanecem fornecedores EXTERNOS (recarga em dinheiro real); geração/leitura de QR: forma a definir na especificação.
- **Entrada lógica**: consulta de saldo (identidade do aluno); resgate de gift card (código digitado ou lido por câmera); confirmação de recarga vinda do checkout (fluxo site → financeiro → app).
- **Saída lógica**: saldos atualizados; resultado do resgate (creditado na moeda do lote / recusado por já usado — liberação única validada centralmente); extrato de créditos com motivo.
- **Frequência e momento**: saldo ao abrir o app e após cada transação; resgate sob demanda; recarga chega por confirmação assíncrona do checkout.
- **Autenticação e permissão**: sessão do aluno para saldo/resgate; crédito manual restrito ao painel administrativo **com registro auditável** (quem, quando, quanto, por quê); nenhum saldo é fonte de verdade no cliente — Diamante representa dinheiro real.
- **Indisponibilidade**: exibir último saldo com carimbo; resgate de gift card indisponível (nunca validar localmente — hoje um F5 "desusa" todos os cartões, prova de que a unicidade exige servidor).
- **Estado atual**: **simulação local**. `score`/`diamantes` (l. ~3672/3771, comentário `[INTEGRAÇÃO REAL] crédito do site`); `resgatarGift()` (l. 3791) marca `usado` só em memória; QR "ilustrativo, determinístico por código" (`qrSvg`, l. ~10041, UI: "arte final dos QR é [INTEGRAÇÃO REAL]"); câmera do leitor é simulada; `CREDITOS` (l. ~9811). Rótulos: SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (checkout, QR) + DEPENDE DO BACK-END + DEPENDE DE BANCO DE DADOS.
- **Sugestão técnica não definitiva** *(sugestão)*: ledger central de dupla entrada para as duas moedas; resgate de gift card validado e marcado como usado numa única operação atômica no servidor.

## Ficha 16 — Controlar estoque

- **Necessidade**: produtos físicos com estoque decrescente (compra de N unidades baixa N; item sai da vitrine ao zerar; estorno devolve), vagas por moeda em turmas e simulados presenciais limitadas pela lotação física das salas (155/85/125/185), e pedidos de retirada na recepção.
- **Sistema fornecedor**: Módulo da Loja do Viver o Quad [PLANEJADO] (estoque de produtos físicos) + Módulo de Matrículas do Viver o Quad [PLANEJADO] e Módulo de Simulados do Viver o Quad [PLANEJADO] (vagas de turmas, eventos e simulados presenciais — alocação fina por módulo a definir na especificação) + Módulo de Administração do Viver o Quad [PLANEJADO] (cadastro de salas e ajuste de vagas — "a sala cresce se a administração abrir mais vagas").
- **Entrada lógica**: reserva/baixa vinda da compra (Ficha 14), devolução vinda do estorno (Ficha 17), ajustes administrativos de estoque/vagas/preços.
- **Saída lógica**: disponibilidade atual por item e por moeda; recusa quando zerado; confirmação de ajuste.
- **Frequência e momento**: leitura ao renderizar vitrines; baixa/devolução transacional junto da compra/estorno.
- **Autenticação e permissão**: baixa e devolução apenas por transações do servidor; ajuste manual restrito ao painel administrativo.
- **Indisponibilidade**: vitrine em cache com **compra desabilitada** (mesma regra da Ficha 14 — nunca vender sem estoque confirmado).
- **Estado atual**: **simulação local**. `ITENS_PRESENCIAIS[].estoque` decrementado no cliente (l. ~9266), `simVagas`/`simTomaVaga` (l. ~6337–6361), `SALA_CAP` hardcoded (l. ~8922 — no real, cadastro configurável: DECISÃO TÉCNICA PENDENTE), `PEDIDOS` (l. ~10757). Rótulos: SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (logística física) + DEPENDE DE BANCO DE DADOS. Registro: DIVERGÊNCIA DOCUMENTAL na própria UI — o texto das Liberações diz que a entrega "volta o item ao estoque", mas o código só devolve estoque no estorno.
- **Sugestão técnica não definitiva** *(sugestão)*: reserva atômica de vaga/estoque com expiração; salas e lotações como cadastro administrável (hoje hardcoded em `SALA_CAP`).

## Ficha 17 — Solicitar estorno

- **Necessidade**: permitir estorno de qualquer compra em até 7 dias corridos (contagem regressiva visível, confirmação em dois toques), devolvendo a moeda e **desfazendo a posse por tipo** (matrícula devolve vaga e turno; produto volta ao estoque; evento sai do calendário; item de combate sai da mochila; skin regride a cadeia; simulado sai da recepção); compra **consumida** (entrada liberada/entrega confirmada) sai da janela; o admin acompanha estornos e ranking de itens estornados.
- **Sistema fornecedor**: Módulo da Loja do Viver o Quad [PLANEJADO] (loja/inventário) + Módulo de Administração do Viver o Quad [PLANEJADO]; pagamentos/financeiro permanece fornecedor EXTERNO quando envolver dinheiro real (gateway).
- **Entrada lógica**: identidade do aluno, compra referenciada, confirmação dupla.
- **Saída lógica**: resultado transacional (moeda devolvida + posse desfeita + registro em estornos) ou recusa tipada (prazo encerrado, compra consumida).
- **Frequência e momento**: sob demanda dentro da janela; o carimbo de consumo (Ficha 19) precisa chegar ao financeiro em tempo real para fechar a janela ("participar do aulão e estornar depois lesaria a empresa" — dec. 178).
- **Autenticação e permissão**: aluno estorna apenas compras próprias; a decisão prazo/consumo é do servidor.
- **Indisponibilidade**: pedido enfileirado com aviso "em processamento"; a janela de 7 dias conta pela data do pedido, não do processamento.
- **Estado atual**: **simulação local**. `estornoDias()` (l. ~11562), `estornar()` (l. ~11684), `desfazerCompra()` (l. 11592, ramos por tipo), `compraConsumida()` (l. 11447), `ESTORNOS` (l. ~10124). Rótulos: SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (gateway de pagamento quando houver dinheiro real).
- **Sugestão técnica não definitiva** *(sugestão)*: estorno como transação inversa referenciando a compra original; janela de 7 dias e consumo avaliados exclusivamente no servidor; gateway de pagamento acionado quando houver dinheiro real.

## Ficha 18 — Registrar presença

- **Necessidade**: registrar que o aluno compareceu — inscrição em evento presencial o coloca na lista da portaria; presença em simulado presencial pontua score; presença em aula (chamada do professor) é insumo dos relatórios; listas de conferência impressas para atividades.
- **Sistema fornecedor**: Módulo de Administração do Viver o Quad [PLANEJADO] (operação de portaria/recepção — o controle de acesso físico em si segue operação presencial) + Módulo de Simulados do Viver o Quad [PLANEJADO] (eventos/simulados) + Módulo de Inteligência Pedagógica do Viver o Quad [PLANEJADO] (chamada); no faseamento do relatório rev. 2.3, geofencing aparece como recurso de V1 (HIPÓTESE de escopo — nada no código).
- **Entrada lógica**: identidade do aluno + atividade (evento/simulado/aula) + meio de verificação (hoje: clique do atendente; no real: QR/credencial/chamada).
- **Saída lógica**: presença registrada com carimbo; efeitos: score creditado (Ficha 9), compra consumida (Ficha 17), histórico do aluno atualizado.
- **Frequência e momento**: na chegada do aluno à atividade; chamada durante a aula ("[INTEGRAÇÃO REAL] presença confirmada por chamada" — texto da própria UI do professor).
- **Autenticação e permissão**: registro feito por operador autorizado (recepção/professor) ou por mecanismo automático auditável; o aluno não registra a própria presença.
- **Indisponibilidade**: modo de contingência da recepção (lista local com sincronização posterior) — hoje inexistente; a lista impressa via navegador é o paliativo atual.
- **Estado atual**: **simulação local**. `ACESSO_ST` (l. ~10820, seeds por hash + aluno real conforme compra), `SIM_INSC` (l. ~6305), lista de conferência "PDF" via `window.print()` (l. ~10943–10968 — DECISÃO TÉCNICA PENDENTE se o produto exigir PDF de servidor). Rótulos: SIMULADO LOCALMENTE + DEPENDE DE SISTEMA EXTERNO (controle de acesso físico) + DEPENDE DO BACK-END.
- **Sugestão técnica não definitiva** *(sugestão)*: registro de presença por operador autenticado com trilha de auditoria; QR/credencial como meio de verificação quando o produto decidir (geofencing só após parecer LGPD).

## Ficha 19 — Liberar entrada

- **Necessidade**: na portaria, o atendente vê os grupos por evento presencial vigente e por simulado, localiza o inscrito e "Libera entrada" — o ato confirma presença, pontua score (e QdC quando a atividade premia), move o simulado ao histórico do aluno e **consome a compra** (fecha a janela de estorno na hora); a entrega de produto físico na recepção segue o mesmo padrão de consumo.
- **Sistema fornecedor**: Módulo de Administração do Viver o Quad [PLANEJADO] (operação de portaria/recepção) sobre eventos/simulados (Módulo de Simulados [PLANEJADO]) + Módulo da Loja do Viver o Quad [PLANEJADO] (consumo da compra) + gamificação interna da plataforma (pontuação — módulo responsável a definir na especificação); quando a compra envolver dinheiro real, o carimbo de consumo interessa também ao financeiro EXTERNO (janela de estorno).
- **Entrada lógica**: operador autenticado + inscrito/pedido referenciado + ação (liberar entrada / confirmar entrega).
- **Saída lógica**: transação única: liberado/entregue + presença + pontuação + consumo; recusa se já liberado.
- **Frequência e momento**: em tempo real na chegada do aluno; a lista da portaria precisa refletir compras e cancelamentos imediatamente (hoje reflete porque é o mesmo arquivo).
- **Autenticação e permissão**: exclusivo de operadores da recepção/portaria via painel administrativo; toda liberação auditável (quem liberou, quando).
- **Indisponibilidade**: contingência manual com reconciliação posterior; sem confirmação do servidor, o consumo não fecha a janela de estorno (risco assumido e reconciliado depois).
- **Estado atual**: **simulação local**. Liberação de evento (l. ~10859–10875, chama `compraConsumida`), `liberarInscrito()` de simulado (l. 11015 — score + `SIM_HIST` + consumo), confirmação de entrega (l. ~10789). Tudo booleano em memória. Rótulos: SIMULADO LOCALMENTE + DEPENDE DO BACK-END + DEPENDE DE SISTEMA EXTERNO (check-in físico).
- **Sugestão técnica não definitiva** *(sugestão)*: a liberação como a mesma transação de presença da Ficha 18, estendida com pontuação e consumo numa única operação idempotente e auditável.

## Ficha 20 — Enviar avisos

- **Necessidade**: (a) avisos de mural com turma-alvo por id ("todas" ou uma turma — o aluno vê os da turma ativa + gerais); (b) mensagens da administração por público (aluno individual, professor, inscritos de turma/isolada/simulado/evento, todos) com cálculo de alcance, entrega no chat "+" do aluno com prefixo `[Público]`, recados ao professor na área dele, e status ENVIADA→LIDA sincronizado; (c) push real de notificação — hoje inexistente ("o app nunca empurra na V0").
- **Sistema fornecedor**: mensageria interna do app (mural e mensagens no chat — contrato interno; módulo responsável a definir na especificação) + Módulo de Matrículas do Viver o Quad [PLANEJADO] (inscrições, para resolver públicos e alcance); emissão pelo Módulo de Administração do Viver o Quad [PLANEJADO]; o canal de notificações push/e-mail permanece fornecedor EXTERNO.
- **Entrada lógica**: emissor autorizado, tipo de alvo, alvo (id), texto; edição/remoção de aviso.
- **Saída lógica**: publicação confirmada com alcance real ("alcança N alunos"); para o destinatário: aviso/mensagem com carimbo; recibo de leitura de volta ao emissor.
- **Frequência e momento**: sob demanda do emissor; leitura marcada quando o destinatário abre o chat; push (quando existir, V1) na hora do envio.
- **Autenticação e permissão**: envio restrito à administração (e à coordenação, conforme o produto definir); resposta do aluno/professor no chat é "EM BREVE, V1" (APENAS VISUAL hoje — DECISÃO DE PRODUTO PENDENTE).
- **Indisponibilidade**: aviso fica em rascunho/pendente; o app degrada exibindo o mural em cache.
- **Estado atual**: **simulação local**. `AVISOS[].alvo` por id + `avisoVisivel()` (l. ~10149–10161); `msgPublico()` (l. 9950) com alcance real quando há inscritos e semente por hash quando não ("todos" = 1.286 fixo); `RECADOS`/`RECADOS_PROF`/`ADM_MSGS`; badges `renderChatBadge` (l. ~9911). Sem qualquer push de sistema. Rótulos: SIMULADO LOCALMENTE + DEPENDE DO BACK-END (mensageria/push) + DEPENDE DE BANCO DE DADOS (histórico hoje se perde no F5).
- **Sugestão técnica não definitiva** *(sugestão)*: serviço de mensageria com resolução de público e cálculo de alcance no servidor, recibos de leitura, e push (V1) como canal adicional do mesmo serviço.

## Ficha 21 — Administrar professores

- **Necessidade**: manter o banco do corpo docente (nome, até 3 matérias, turnos, graduação, telefone, foto, senha), com login do professor (hoje e-mail derivado do sobrenome + senha), escalação por matéria nas turmas ("só quem ministra a matéria; vaga sem candidato fica aberta"), rename propagado, desligar/bloquear/apagar **derrubando a sessão na hora**, e relatório de horas derivado da grade.
- **Sistema fornecedor**: Módulo de Cadastro do Viver o Quad [PLANEJADO] (colaboradores/corpo docente) + Módulo de Autenticação do Viver o Quad [PLANEJADO] + Módulo de Administração do Viver o Quad [PLANEJADO]; Módulo de Relatórios do Viver o Quad [PLANEJADO] para as horas.
- **Entrada lógica**: operações CRUD do painel (com validações: homônimo, ≥1 matéria, ≥1 turno); credenciais do professor no login; troca de senha e foto pelo próprio professor.
- **Saída lógica**: cadastro consistente propagado a turmas, isoladas, eventos, cronograma e recados; sessões revogadas quando bloqueado/desligado/apagado; recusas de login tipadas (desligado, bloqueado, senha errada).
- **Frequência e momento**: CRUD sob demanda; revogação de sessão em tempo real; relatório de horas por período (mês/tri/semestre/ano).
- **Autenticação e permissão**: CRUD exclusivo do painel administrativo (N.P.P.); o professor edita apenas foto e senha; senha **nunca** em texto claro (hoje `d.senha` fica legível no objeto JS — inaceitável no real).
- **Indisponibilidade**: login do professor indisponível (sem fallback local); cadastro em cache somente leitura para as telas que exibem nomes.
- **Estado atual**: **simulação local**. `DOCENTES` (l. ~3815, 6 docentes com telefone), `PROF_SENHA_DEMO = 'quad1234'` impressa no gate (l. ~4914–4931), `emailDoProf()` derivado do sobrenome (l. ~4917 — colide para homônimos), `renomearDocente()` (l. 8179 — **o nome é a chave primária**, limitação autodeclarada no código l. ~8142–8146), `checarAcessoProf()` derruba sessão (l. ~8084). Rótulos: SIMULADO LOCALMENTE + DEPENDE DE BANCO DE DADOS + DEPENDE DO BACK-END + DECISÃO TÉCNICA PENDENTE (ID estável em vez de nome; e-mail não derivado ou com regra de desambiguação).
- **Sugestão técnica não definitiva** *(sugestão)*: professores como contas no mesmo serviço de identidade da Ficha 1, com papel "docente" e vínculos por ID — o rename vira um dado de exibição e para de propagar por sete estruturas.

## Ficha 22 — Administrar editais e questões

- **Necessidade**: lançar concurso/edital com sua árvore (matéria → assunto → sub-assunto) a partir do documento oficial (upload/leitura de PDF), editar situação (aberto/proposta/reta-final), reconciliar edital novo com antigo (o que SAIU/ENTROU, recálculo de percentuais), definir qual árvore comanda o Domínio, e manter o banco central de questões (cadastro, tags, uso) que alimenta todas as Fichas 7/8/11.
- **Sistema fornecedor**: Módulo de Banco de Questões do Viver o Quad [PLANEJADO] + leitura/parse de edital em PDF (forma a definir na especificação) + Módulo de Administração do Viver o Quad [PLANEJADO]; a árvore alimenta o Módulo de Inteligência Pedagógica do Viver o Quad [PLANEJADO] (Domínio, materiais, cronograma, criação de turmas).
- **Entrada lógica**: PDF do edital ou edição manual da árvore; metadados do concurso; operações de questão (enunciado, alternativas, gabarito, tags, vínculo com a árvore).
- **Saída lógica**: árvore versionada publicada para o app (Domínio, seletor de matérias das turmas e materiais); relatório de reconciliação; questões disponíveis por contexto.
- **Frequência e momento**: no lançamento/retificação de edital (evento raro e crítico); curadoria de questões contínua.
- **Autenticação e permissão**: exclusivo do painel administrativo/equipe pedagógica; gabaritos nunca expostos ao cliente do aluno (ver Ficha 7).
- **Indisponibilidade**: o app segue com a última árvore publicada (as árvores são conteúdo estável); lançamento aguarda.
- **Estado atual**: **integração parcial na demo + apenas visual**. As árvores de `CONCURSOS` são **vivas e funcionais** (CFO completo transcrito, l. ~4092; demais compactas — "a árvore real entra pelo lançamento do edital — [INTEGRAÇÃO REAL]", l. ~4096; `definirDominio()` l. ~7845); porém as telas dedicadas `v-edital` (lançar/reconciliar) e `v-questoes` (banco de questões) são **APENAS VISUAIS** — botões só disparam toast (l. ~8632–8637), e o anexo de PDF na criação de turma usa apenas o nome do arquivo. Rótulos: CONFIRMADO NO CÓDIGO (árvores vivas) + APENAS VISUAL (lançamento/reconciliação/cadastro de questão) + DEPENDE DE SISTEMA EXTERNO (parser de edital) + DEPENDE DE BANCO DE DADOS + DECISÃO DE PRODUTO PENDENTE (fluxo real de curadoria).

---

## Observações transversais (valem para todos os contratos)

1. **Ordem de dependência sugerida** *(sugestão, não definitiva)*: Fichas 1–3 (identidade/matrícula/dados) são pré-requisito de todas as outras; Fichas 14–17 (economia) formam um bloco transacional único com o financeiro; Fichas 7–9 (questões/respostas/desempenho) formam o bloco pedagógico; a Ficha 10 (telemetria) o produto declara como pré-requisito da V0 e hoje é o item **mais distante do código** (nada coletado).
2. **Nada de valor pode ser decidido no cliente**: score, moedas, matrícula, vaga, estoque, presença, consumo e gabarito são hoje mutáveis por console (hooks `window.__*`, `lojaCompraLog` global) — aceitável na demo, bloqueante com dado real (DECISÃO TÉCNICA PENDENTE: build de produção sem hooks).
3. **Persistência mínima antes de qualquer integração**: turma ativa, avatar, nome de guerra, perfil privado do ranking, progresso da noite e histórico de mensagens se perdem no F5 — a primeira entrega de back-end deve começar por esse estado de usuário (lista já mapeada no doc 06 desta auditoria).
4. **LGPD**: autoavaliação de dificuldade, Domínio, constância, compras e futuro IRA formam perfil comportamental de pessoa identificada; as salvaguardas declaradas ("comportamento computado, nunca rotulado"; "nunca Dado → Oferta") ainda não têm desenho técnico (DECISÃO TÉCNICA PENDENTE) nem política de retenção/eliminação (DECISÃO DE PRODUTO PENDENTE).
5. **Divergências documentais que afetam contratos**: economia na V0 vs. rev. 2.3 (dec. 11 — o documento-base precisa da "rev. 2.4"); gate N.P.P. não valida o e-mail citado no briefing; texto da UI de Liberações promete devolução de estoque na entrega que o código não faz.
- **Sugestão técnica não definitiva** *(sugestão)*: pipeline de ingestão de edital (parse assistido + revisão humana obrigatória) publicando árvores versionadas; questões com gabarito restrito ao servidor (Ficha 7).
