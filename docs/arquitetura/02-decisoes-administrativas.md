# Decisões Administrativas — Viver o Quad (DA-01 a DA-10)

*Emitidas por Danilo Moura (Fundador) em 03/08/2026 · registro oficial*

Estas decisões respondem as perguntas que a auditoria de prontidão (02/08)
apontou como **bloqueadoras da modelagem do banco de dados e do back-end**.
São decisões **de produto e de arquitetura**: valem para a construção da
aplicação real e **não** alteram o protótipo, que permanece como está.

> **Como usar este documento**: ele tem precedência sobre qualquer pergunta
> ainda marcada como aberta nos documentos anteriores. Onde o pacote de
> handoff (`docs/handoff/`) disser "pendente" sobre um destes temas, a
> resposta está aqui. As perguntas correspondentes foram marcadas como
> respondidas em `docs/handoff/07-perguntas-realmente-pendentes.md`.

---

## DA-01 — Identidade dos usuários

**Pergunta**: qual será o identificador definitivo de alunos, professores,
administradores e turmas?

**Decisão**: todo registro principal do sistema possuirá um identificador
único, permanente e **imutável** (ID interno), gerado automaticamente na
criação. Esse identificador será usado em **todos** os relacionamentos
internos. O **nome do usuário nunca será chave de relacionamento**.

**Justificativa**: nomes podem ser alterados, repetidos ou corrigidos ao
longo do tempo. O identificador interno garante integridade dos dados e
estabilidade da aplicação.

**O que destrava**: P54 (IDs estáveis). Encerra o risco crítico apontado
pela auditoria — hoje, no protótipo, o **nome do professor é a chave** e
renomear propaga por turmas, grade, eventos e e-mail de acesso (dec. 174/175).
Na aplicação real, renomear passa a ser uma simples atualização de atributo.

---

## DA-02 — Identidade das questões

**Pergunta**: como as questões serão identificadas?

**Decisão**: cada questão possuirá um identificador único e permanente e
será vinculada à estrutura pedagógica do sistema — **disciplina, matéria,
assunto e subassunto**. O sistema deverá permitir **revisões da questão sem
perda do histórico de utilização**.

**Justificativa**: o banco de questões é um dos ativos mais importantes do
Viver o Quad e precisa manter histórico consistente mesmo após atualizações.

**O que destrava**: P43 (schema do banco de questões). Substitui a ligação
por rótulo textual dos cinco bancos paralelos do protótipo (`QUESTIONS`,
`QA_MULT`, `QA_CE`, `TR_BANK`, banco do simulado digital) por um banco único
identificado e classificado. A exigência de "revisão sem perder histórico"
implica **versionamento** da questão: a resposta já dada pelo aluno continua
apontando para a versão que ele respondeu.

---

## DA-03 — Modelo econômico

**Pergunta**: como serão registradas as movimentações financeiras da
plataforma?

**Decisão**: o sistema adotará um modelo baseado em **histórico de
movimentações (ledger)**. Nenhuma alteração de saldo ocorrerá sem o registro
da operação que a originou. Cada movimentação registra: **origem, destino,
tipo da operação, data e hora, usuário responsável (quando aplicável), valor
movimentado e saldo resultante**. Aplica-se a **Diamantes**, **Quad Coins** e
ao **Score** (quando necessário para auditoria).

**Justificativa**: o histórico completo permite auditoria, rastreabilidade,
recuperação de operações e segurança financeira.

**O que destrava**: P12 (modelo econômico canônico) — a mais estruturante das
perguntas. Define que saldo é **consequência**, não campo editável, e alinha
a plataforma ao princípio do documento-base rev. 2.3 (Anexo A). Toda regra
do protótipo que hoje soma direto na variável (recompensa de bloco, gift
card, crédito manual do admin, estorno, drop) passa a nascer como um
lançamento no ledger.

> **Segue em aberto**: os **valores** de cada recompensa e o preço de cada
> item permanecem indefinidos por decisão (dec. 185) — esta DA define a
> *mecânica de registro*, não o balanceamento.

---

## DA-04 — Nome de Guerra

**Pergunta**: o Nome de Guerra será único?

**Decisão**: **não**. Nomes de Guerra poderão se repetir na plataforma.
Havendo coincidência, o sistema diferenciará pelo **ID do aluno** — que
poderá ser exibido quando necessário —, e os demais alunos se orientarão
também pela personalização do personagem e pela configuração da própria
conta.

**Justificativa**: os usuários conseguem distinguir uns dos outros porque a
personalização do personagem é um diferencial; em alguns casos o ID aparece.

**O que destrava**: P4 (unicidade do nome de guerra). Não haverá constraint
de unicidade na tabela de identidade — decisão que precisava ser tomada
**antes** de criar a tabela, não depois.

---

## DA-05 — Simulados

**Pergunta**: os simulados pertencem às turmas ou ao sistema?

**Decisão**: os simulados pertencem **ao sistema**. Poderão ser associados a
uma turma, a várias turmas, a um concurso, a um edital ou a campanhas
específicas. A relação será sempre **por associação, nunca por dependência
direta**.

**Justificativa**: permite reutilizar simulados sem duplicar conteúdo.

**O que destrava**: P36 (vínculo do simulado). Confirma o que o protótipo já
demonstra (simulado solto, sem dono) e acrescenta a camada de associação
múltipla que faltava para o relatório pedagógico por turma.

---

## DA-06 — Ciclo de vida das turmas

**Pergunta**: o que acontece quando uma turma termina?

**Decisão**: turmas **nunca serão apagadas**. Ao encerrar, passam ao estado
de **arquivamento**. O histórico permanece disponível para consultas
administrativas, estatísticas, auditorias e acompanhamento histórico dos
alunos.

**Justificativa**: o histórico acadêmico faz parte da inteligência pedagógica
do sistema.

**O que destrava**: P27 (histórico da turma encerrada). No protótipo, a turma
vencida simplesmente sai de `matriculasAtivas()` e o aluno perde o acesso —
sem registro. Na aplicação real, encerramento é **transição de estado**, e o
aluno mantém a memória da turma que cursou.

---

## DA-07 — Cadastro

**Pergunta**: onde ocorrerá o cadastro do usuário?

**Decisão**: o Viver o Quad passa a ser **responsável pelo cadastro,
autenticação e gerenciamento das contas**. O cadastro **deixa de depender de
sistemas externos como requisito arquitetural**. Integrações futuras poderão
existir, mas como **complementares — nunca como dependência obrigatória**.

**Justificativa**: centralizar o cadastro reduz dependências externas e torna
o Viver o Quad a plataforma principal do ecossistema.

**O que destrava**: P1 e P2 (fluxo de cadastro e recuperação de acesso).
Confirma e completa a dec. 183 (que revogou a dec. 21 sem substituto): o
módulo de Cadastro/Autenticação sai de "Planejado sem direção" para
"Planejado com dono definido". O protótipo mantém a demonstração antiga
("Cadastro no site do Quad") até que o fluxo novo seja especificado.

> **Segue em aberto** (nível de especificação, não de arquitetura): os campos
> do cadastro, o meio de recuperação de acesso (e-mail? telefone?) e como a
> conta nasce quando a matrícula é presencial/manual.

---

## DA-08 — Perfis administrativos

**Pergunta**: existirá apenas um administrador?

**Decisão**: **não**. O sistema possuirá **diferentes perfis
administrativos**, cada um com permissões específicas conforme sua
responsabilidade institucional. A modelagem detalhada das permissões será
feita na fase de especificação dos módulos administrativos.

**Justificativa**: o Viver o Quad será usado por diferentes setores do Quad
Concursos, exigindo controle granular de acesso.

**O que destrava**: P51 (papéis administrativos). Encerra a divergência do
protótipo, onde há **um** administrador N.P.P. e o portão valida apenas a
chave (`NPP-2026`), sem identificar a pessoa. Na aplicação real, toda ação
administrativa terá **autor auditável** — pré-requisito do ledger da DA-03.

---

## DA-09 — Retenção de dados

**Pergunta**: qual será a política geral de retenção das informações?

**Decisão**: como regra geral, **não se apagam** dados acadêmicos, histórico
de desempenho, histórico financeiro, histórico de compras e histórico de
matrículas. Quando um aluno deixar de usar a plataforma, sua conta poderá ser
**desativada, mas não removida automaticamente**. Políticas específicas de
LGPD serão definidas posteriormente.

**Justificativa**: o histórico é parte essencial da inteligência pedagógica e
da rastreabilidade da plataforma.

**O que destrava**: a lacuna de retenção apontada pela auditoria (que sequer
tinha número de pergunta). Define o princípio geral — preservar, desativar em
vez de excluir.

> **Segue em aberto**: bases legais, prazos de retenção por categoria de
> dado, procedimento de eliminação a pedido do titular e governança do
> perfilamento pedagógico (dec. 186). São exigências de LGPD que precisam de
> tratamento próprio antes do go-live.

---

## DA-10 — Princípio da persistência

**Decisão**: todo dado que represente **evolução do aluno** terá persistência
permanente — progresso, Score, Quad Coins, Diamantes, mochila, itens,
conquistas, missões, histórico de compras, histórico de simulados, desempenho
e estatísticas. Dados temporários só existirão quando a sua natureza
justificar.

**Justificativa**: é o princípio que separa o protótipo da aplicação real.

**O que destrava**: dá regra geral ao que hoje **evapora a cada recarga** —
no protótipo, apenas duas chaves sobrevivem (`vq_tut_skip` e
`vq_intro_done`); todo o resto é memória volátil. Este princípio é o critério
para decidir, caso a caso, o que vai para o banco.

---

## Efeito conjunto sobre a construção

| Área | Antes destas decisões | Depois |
|---|---|---|
| Identidade e relacionamentos | nome como chave (risco crítico) | **DA-01** — ID interno imutável em tudo |
| Banco de questões | 5 bancos, ligação por texto | **DA-02** — banco único, classificado, versionado |
| Carteira e economia | saldo como campo, mecânica indefinida | **DA-03** — ledger; saldo é consequência |
| Identidade do aluno | unicidade indefinida | **DA-04** — sem constraint; ID desempata |
| Simulados | vínculo indefinido | **DA-05** — do sistema, associável a vários |
| Turmas | fim indefinido | **DA-06** — arquivamento, nunca exclusão |
| Cadastro/autenticação | revogado sem substituto | **DA-07** — dono é o Viver o Quad |
| Administração | um admin, sem autor | **DA-08** — perfis com permissões e autoria |
| Retenção | não existia política | **DA-09** — preservar; desativar em vez de excluir |
| Persistência | tudo volátil | **DA-10** — evolução do aluno é permanente |

**O que ainda falta para a construção começar** (não é decisão sua — é
trabalho de especificação, e boa parte cabe ao engenheiro):

1. Contratos de dados formais (os 23 pontos `[INTEGRAÇÃO REAL]` do fonte);
2. Modelo conceitual de entidades com chaves e cardinalidades — **agora
   possível**, com DA-01 a DA-06 e DA-10 no lugar;
3. Critérios de aceite do back-end (as 57 suítes aceitam o protótipo, não um
   servidor);
4. Especificação módulo a módulo, exigida pela arquitetura oficial;
5. Balanceamento econômico (valores) — dec. 185, ainda em aberto por decisão;
6. LGPD operacional — prazos, bases legais e eliminação (DA-09 dá o princípio).
