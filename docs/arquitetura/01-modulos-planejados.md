# 01 — Módulos Planejados da plataforma Viver o Quad

**Consolidação Arquitetural v1.0 — 01/08/2026.** Este documento registra as fichas dos onze módulos internos definidos pela consolidação determinada pelo gestor Danilo Moura: capacidades que deixam de ser sistemas externos e passam a ser módulos da plataforma Viver o Quad, agora a plataforma principal do Quad Concursos.

## Regra de abertura (obrigatória)

**Módulo planejado não tem implementação parcial.** A mudança consolidada aqui é exclusivamente arquitetural: nada foi implementado. O que o protótipo exibe é demonstração — "Demonstrado no protótipo (simulação local)" — e não constitui início de implementação do módulo. Um mesmo módulo pode ter partes demonstradas no protótipo e, ainda assim, ser integralmente "Módulo Planejado": os dois status coexistem sem se confundir. Módulo sem especificação suficiente permanece "Módulo Planejado" até que a especificação exista.

Ficam **fora da plataforma** (integrações a definir): site e checkout (vitrine/venda), pagamentos/financeiro, plataforma de cursos (legado em avaliação), notificações push/e-mail (canal) e telemetria como serviço de dados (a decidir).

As referências abaixo à auditoria apontam para `/docs/auditoria` (auditoria de 30/07/2026). As citações "src.html l.N" desses documentos valem para o monolito auditado; a correspondência com a divisão atual do fonte está explicada em `src/README.md`.

---

## 1. Cadastro

- **Objetivo:** ser a origem das contas de alunos e docentes dentro da própria plataforma, encerrando a dependência conceitual do cadastro nascer no site.
- **Responsabilidade:** criação e manutenção de contas e dados cadastrais; ser a fonte oficial de "quem existe" para os demais módulos.
- **Dependências futuras:** integração a definir com site e checkout (vitrine/venda) e com pagamentos/financeiro; consumido por Autenticação e Matrículas.
- **Observações arquiteturais:** a decisão 21 (cadastro obrigatoriamente no site) foi **revogada** em 01/08/2026 — o cadastro pertence agora à arquitetura do app. O fluxo novo **não foi implementado**: o protótipo mantém o portão "Cadastro no site do Quad" (tela `#gateCriar`) como demonstração, até especificação do módulo. Demonstrado no protótipo (simulação local): o portão de criação de conta — ver auditoria doc 03 (fluxo F02) e doc 07 (§S3). Sem especificação: todo o fluxo de cadastro dentro do app. Módulo Planejado.

## 2. Autenticação

- **Objetivo:** autenticar usuários e controlar o acesso à plataforma para as três personas (aluno, professor, administrador).
- **Responsabilidade:** login, sessão, bloqueio de conta e autorização de acesso por perfil.
- **Dependências futuras:** consome o módulo Cadastro (quem existe) e Matrículas (quem pode entrar); demais módulos dependem dele para saber quem está logado.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): login em uma tela com verificação encenada na vinheta — nenhum servidor é consultado — além de conta bloqueada e recusa quando offline; ver auditoria doc 03 (fluxo F01) e doc 07 (§S4). O fluxo revogado de autorização de dispositivo foi removido do fonte na limpeza de 01/08 (chaves `vq_device_authorized`/`vq_last_sync`/`vq_pending` não existem mais). Os riscos apontados pela auditoria de segurança permanecem válidos e registrados como pendências; nenhuma solução foi implementada. Sem especificação: mecanismo real de autenticação e gestão de sessão. Módulo Planejado.

## 3. Matrículas

- **Objetivo:** registrar e governar os vínculos aluno↔turma que condicionam o acesso ao conteúdo da plataforma.
- **Responsabilidade:** ser a fonte oficial das matrículas ativas; travar e destravar o app conforme exista matrícula; refletir estornos.
- **Dependências futuras:** integração a definir com pagamentos/financeiro e com site e checkout; consumido por Autenticação, Produção de materiais, Cronogramas, Simulados e Relatórios.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): trava/destrava por matrícula (fluxo F05), turma ativa que "comanda a tela", compra de turmas na loja e recusa de remoção de turma com matrícula ativa — ver auditoria doc 03 (F05), doc 01 (§ turmas e matrículas) e doc 07 (§S5). Todo o estado vive em memória e se perde no F5. Sem especificação: ciclo de vida real da matrícula e sua relação com o financeiro. Módulo Planejado.

## 4. Produção de materiais

- **Objetivo:** publicar materiais didáticos segmentados por turma, matéria, assunto e tipo, com retirada do ar quando necessário.
- **Responsabilidade:** acervo de materiais publicado, sua segmentação e o vínculo com matrículas (matrícula nova traz o material; estorno o leva).
- **Dependências futuras:** consome Administração (quem publica), Banco de questões (árvore que indexa) e Matrículas (quem vê); fronteira com a plataforma de cursos (legado em avaliação) a definir; storage externo a definir.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): upload pelo admin (arquivo vira dataURL em memória), listagem filtrada pelas matrículas ativas e download via objectURL — ver auditoria doc 07 (§S12) e doc 04 (matriz AD). A auditoria registra que o controle de acesso ao arquivo é só de exibição — pendência de segurança registrada, sem solução implementada. Sem especificação: armazenamento, publicação e controle de acesso reais. Módulo Planejado.

## 5. Banco de questões

- **Objetivo:** concentrar questões, editais e as árvores de conteúdo (concurso → matéria → assunto) que indexam toda a experiência pedagógica.
- **Responsabilidade:** ser a fonte oficial de questões e árvores de edital para quizzes, flashcards, simulados e materiais.
- **Dependências futuras:** consumido por Simulados, Inteligência pedagógica, Cronogramas e Produção de materiais; alimentação a partir de editais reais a definir.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): questões e árvores de conteúdo semeadas em memória alimentando quiz da aula, flashcards e simulados digitais; a "leitura de PDF" de edital/quiz/simulado é encenada e está marcada no código como `[INTEGRAÇÃO REAL]` — ver auditoria doc 07 (§S9) e doc 04 (§6.2, dependências de integração). Sem especificação: origem, curadoria e manutenção do acervo real. Módulo Planejado.

## 6. Simulados

- **Objetivo:** oferecer simulados presenciais e digitais como motor real da plataforma — o protótipo demonstra a experiência, não o motor.
- **Responsabilidade:** criação, inscrição, aplicação e histórico de simulados; controle de vagas; regras de premiação já registradas (presencial sem prêmio em moedas; digital premiando por acerto).
- **Dependências futuras:** consome Banco de questões, Matrículas e Administração; alimenta Relatórios e a economia da Loja; presença física (portaria/controle de acesso) depende de decisão pendente registrada na auditoria.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): toda a experiência — criação pelo admin com validação de salas e lotação, venda com vagas por moeda, inscrição, portaria com listas sintéticas e histórico — ver auditoria doc 07 (§S13), doc 03 (fluxos de simulados e portaria) e doc 05 (regras RN-36 a RN-39). A auditoria aponta riscos registrados (estoque de vagas no cliente; presença como booleano em memória) — pendências, sem solução implementada. Sem especificação: o motor real de aplicação e correção. Módulo Planejado.

## 7. Inteligência pedagógica

- **Objetivo:** orquestrar a vida acadêmica do aluno: missões, quiz da aula, autoavaliações e a leitura de Domínio prevista no rev. 2.3.
- **Responsabilidade:** gerar missões, ativar e agregar quizzes, registrar respostas e autoavaliações, calcular o Domínio a partir de desempenho real.
- **Dependências futuras:** consome Banco de questões, Cronogramas e Matrículas; alimenta Relatórios e a gamificação da Loja; a metodologia real do Domínio é decisão de produto pendente registrada na auditoria.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): missões diárias, quiz da aula com polling encenado, flashcards e autoavaliação (Errei/Difícil/Bom/Fácil) — ver auditoria doc 07 (§S10) e doc 03 (fluxos de missões e quiz). O Domínio exibido é determinístico por hash — apenas visual, sem desempenho real por trás ("nunca hardcoded" segue como diretriz não atendida, registrada no doc 07). A auditoria registra ainda a sensibilidade LGPD da autoavaliação — pendência sem solução implementada. Sem especificação: a metodologia do Domínio e o motor pedagógico real. Módulo Planejado.

## 8. Loja e economia

- **Objetivo:** abrigar a loja interna e a economia da plataforma — Quad Coins, Diamantes e gift cards permanecem previstos.
- **Responsabilidade:** vitrine, compras e estornos internos, saldos e itens (skins, mochila), gift cards.
- **Dependências futuras:** integração a definir com pagamentos/financeiro (recarga de Diamantes) e com site e checkout; consome Matrículas e Administração; alimenta Relatórios.
- **Observações arquiteturais:** **As regras econômicas seguem indefinidas — não foram estudadas.** Este documento apenas registra a existência prevista da economia; nenhum valor, taxa, preço ou regra deve ser inferido do protótipo, cujos números são cenografia. Demonstrado no protótipo (simulação local): vitrine da Quad Store, compras e estornos, saldos de Quad Coins e Diamantes, gift cards em lote e mochila/skins — ver auditoria doc 07 (§S7 e §S14), doc 03 (fluxos de compras e estornos) e doc 05 (regras econômicas confirmadas no código do protótipo, que não valem como definição de produto). Sem especificação: todas as regras econômicas. Módulo Planejado.

## 9. Administração

- **Objetivo:** dar ao N.P.P. a governança operacional da plataforma em um painel interno único.
- **Responsabilidade:** gestão de professores, turmas, eventos e simulados; créditos manuais; bloqueio de contas; mensagens por público; avisos; liberações (portaria/pedidos); preços da Loja.
- **Dependências futuras:** opera sobre praticamente todos os demais módulos (Cadastro, Matrículas, Cronogramas, Simulados, Loja, Produção de materiais, Relatórios); permissões e trilha de auditoria a definir.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): o painel admin completo, acessado por qualquer e-mail com a chave `NPP-2026` — criação de turmas com validação de salas e lotação, liberações, créditos, bloqueios, avisos e preços — ver auditoria doc 00 (§ personas), doc 02 (telas do admin) e doc 07 (§S11). A chave de acesso fixa no cliente é risco registrado pela auditoria — pendência, sem solução implementada. Sem especificação: modelo de permissões e operação real. Módulo Planejado.

## 10. Relatórios e inteligência de dados

- **Objetivo:** consolidar relatórios individuais, por turma, gerais e da loja para a gestão, sobre dados reais.
- **Responsabilidade:** agregação e apresentação de relatórios e rankings consolidados para a Administração e a direção.
- **Dependências futuras:** consome dados de todos os módulos transacionais; a telemetria como serviço de dados permanece **fora** da plataforma (a decidir) — a fronteira entre este módulo e esse serviço é integração a definir.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): painel de relatórios do admin que mistura dados vivos da sessão com dados sintéticos por hash; a linha de "telemetria" exibida é texto estático (apenas visual) — ver auditoria doc 07 (§S16). A auditoria registra riscos LGPD do perfil comportamental e a diretriz "comportamento é computado, nunca gravado como rótulo" como pendências, sem solução implementada. Sem especificação: fonte de dados real e escopo dos relatórios. Módulo Planejado.

## 11. Cronogramas

- **Objetivo:** manter a grade semanal de aulas por turma como dado vivo da plataforma, substituindo a dependência conceitual da planilha da coordenação.
- **Responsabilidade:** grade por turma (a grade é da turma — regra RN-12/decisão 163), trocas de aula com registro, e reflexo imediato na "Aula de hoje" do aluno e do professor.
- **Dependências futuras:** consome Matrículas (turma do aluno), Banco de questões (matérias da árvore) e Administração (quem edita); alimenta Inteligência pedagógica; enquanto a planilha da coordenação for a origem, a sincronização é integração a definir.
- **Observações arquiteturais:** Demonstrado no protótipo (simulação local): cronograma semanal com edição pelo admin (troca de matéria/professor com log "de → para") refletindo na hora na tela do aluno — ver auditoria doc 04 (AD-15), doc 05 (RN-12) e doc 07 (§S10). O dado do protótipo é um snapshot fixo da "semana 30" da planilha Google Sheets, e a auditoria registra nomes de professores na grade que não existem no cadastro de docentes — divergência registrada. Sem especificação: origem real da grade e processo de manutenção. Módulo Planejado.

---

*Documento da Consolidação Arquitetural v1.0 (01/08/2026). Por exigência do documento oficial, estas fichas não contêm modelo de dados, API, algoritmo ou indicador.*
