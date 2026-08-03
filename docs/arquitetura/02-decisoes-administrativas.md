# Decisões Administrativas — Viver o Quad (DA-01 a DA-10)

*Emitidas por Danilo Moura (Fundador) em 03/08/2026 · registro oficial*

Estas decisões respondem as perguntas que a auditoria de prontidão (02/08)
apontou como **bloqueadoras da modelagem do banco de dados e do back-end**.
São decisões **de produto e de arquitetura**: valem para a construção da
aplicação real.

> **Atualização de 03/08/2026 (dec. 196 e 197)** — a redação original dizia
> que estas decisões "não alteram o protótipo". **Isso deixou de ser
> verdade no mesmo dia**: a dec. 196 **implementou seis delas** no protótipo
> — **DA-01** (IDs internos: `MEU_ID 'AL-00001'`, `DB_ALUNO.id`, `novoId()`,
> lançamentos `MV-xxxxx`), **DA-03** (ledger: `LEDGER`/`ledgerLancar`/
> `ledgerOp` em src/07 e o extrato em src/19), **DA-04** (nome de guerra sem
> unicidade, desempate pelo ID), **DA-06** (turma arquivada:
> `matriculasArquivadas()` e a etiqueta ARQUIVADA no perfil), **DA-08**
> (`ADM_PERFIS` com quatro perfis, filtro de abas e crédito assinado) e
> **DA-10** (persistência da evolução na chave `vq_evolucao`). A dec. 197
> unificou a carteira do aluno num card só. **DA-02, DA-05, DA-07 e DA-09
> seguem apenas como decisão**, sem reflexo no protótipo — são de
> especificação e de back-end.

> **Como usar este documento**: ele tem precedência sobre qualquer pergunta
> ainda marcada como aberta nos documentos anteriores. Onde o pacote de
> handoff (`docs/handoff/`) disser "pendente" sobre um destes temas, a
> resposta está aqui. As perguntas correspondentes estão marcadas como
> **[RESPONDIDA — DA-0x, 03/08]** em
> `docs/handoff/07-perguntas-realmente-pendentes.md` — nove ao todo (P1, P2,
> P4, P12, P27, P36, P43, P51 e P54), cada uma com o resíduo de
> especificação que continua aberto.

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
a plataforma ao princípio do documento-base rev. 2.3 (Anexo A).

**Estado no protótipo (dec. 196/197)**: **já implementado**. As operações que
antes somavam direto na variável — recompensa de bloco, gift card, crédito
manual do admin, compra, **estorno** (inclusive o de item de combate) e saldo
de abertura — **passam pelo ledger** (`ledgerOp`/`ledgerLancar`, src/07), e
cada lançamento carrega tipo, origem, destino, **autor**, data/hora, valor e
**saldo resultante**. O aluno lê tudo no card "Carteira · extrato e compras"
da Loja (`renderExtrato`, src/19), com filtro por moeda e por período.

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

**O que destrava**: P27 (histórico da turma encerrada). Na aplicação real,
encerramento é **transição de estado**, e o aluno mantém a memória da turma
que cursou.

**Estado no protótipo (dec. 196)**: **já demonstrado**. Além de
`matriculasAtivas()`, existe `matriculasArquivadas()` (src/07); a semente
`rondesp-m` (RONDESP MANHÃ, fim 2026-06-30) nasce arquivada e o bloco
"Minhas turmas · ativas e arquivadas" do perfil a mostra com a etiqueta
**ARQUIVADA** e a nota de que desempenho, compras e materiais continuam
consultáveis (src/12).

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

**O que destrava**: P51 (papéis administrativos). Na aplicação real, toda ação
administrativa terá **autor auditável** — pré-requisito do ledger da DA-03.

**Estado no protótipo (dec. 196)**: **já demonstrado**. O portão do N.P.P.
passou a **pedir o perfil** (`#admPerfil`: Direção, Coordenação pedagógica,
Recepção, Financeiro); `ADM_PERFIS` (src/16) declara as abas de cada um,
`admPodeVer` **filtra a navegação**, o chip `#admPerfilChip` mostra o perfil
ativo no painel e o **crédito manual** de moedas entra no extrato do aluno
assinado por `admPerfilNome()`. A chave continua única (`NPP-2026`) — a
identidade **por pessoa** e o RBAC fino seguem pendentes.

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

**O que destrava**: dá regra geral ao que evaporava a cada recarga. Este
princípio é o critério para decidir, caso a caso, o que vai para o banco.

**Estado no protótipo (dec. 196)**: **já demonstrado**. São **três** as chaves
de `localStorage` vivas — `vq_tut_skip`, `vq_intro_done` e a nova
**`vq_evolucao`**, que guarda score, diamantes, carreira, mochila,
`avatarIdx`, nome de guerra, `turmaAtivaId`, `lojaOwned`, `trAj` e os **60
últimos lançamentos** do ledger (`evolSalvar`/`evolCarregar`/`evolMarcar`,
src/20, debounce de 400 ms). O botão "Reiniciar demonstração" limpa as três.
É persistência **por dispositivo**: a persistência **por conta**, no
servidor, continua sendo trabalho de back-end (DA-07).

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

**Onde cada uma já aparece no protótipo (dec. 196/197):** implementadas —
**DA-01**, **DA-03**, **DA-04**, **DA-06**, **DA-08** e **DA-10**; apenas
decisão, sem reflexo no protótipo — **DA-02**, **DA-05**, **DA-07** e
**DA-09**.

**O que ainda falta para a construção começar** (não é decisão sua — é
trabalho de especificação, e boa parte cabe ao engenheiro):

1. Contratos de dados formais (os 23 pontos `[INTEGRAÇÃO REAL]` do fonte);
2. Modelo conceitual de entidades com chaves e cardinalidades — **agora
   possível**, com DA-01 a DA-06 e DA-10 no lugar;
3. Critérios de aceite do back-end (as 58 suítes aceitam o protótipo, não um
   servidor);
4. Especificação módulo a módulo, exigida pela arquitetura oficial;
5. Balanceamento econômico (valores) — dec. 185, ainda em aberto por decisão;
6. LGPD operacional — prazos, bases legais e eliminação (DA-09 dá o princípio).
