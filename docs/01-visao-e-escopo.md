# Visão e Escopo — Viver o Quad

> Síntese do documento-base *Relatório de Projeto rev. 2.3* (Danilo Moura,
> jul/2026). O PDF completo está nesta pasta e é a referência canônica —
> **exceto onde a Consolidação Arquitetural v1.0 (01/08/2026) dispõe em
> contrário**; ver a seção final e
> [`docs/arquitetura/00-arquitetura-oficial.md`](arquitetura/00-arquitetura-oficial.md).

## O que é

O Viver o Quad é um aplicativo (iOS e Android) que acompanha a jornada do aluno
— da compra do curso até o curso de formação. Na rev. 2.3 ele era descrito como
um braço de uma plataforma web externa; desde a Consolidação v1.0 ele é **a
plataforma principal do Quad Concursos** (ver seção final). Transforma o
dia a dia do aluno em dado, e o dado em cuidado e direcionamento.

**Em uma frase:** engajar, reter e fazer o aluno evoluir — medindo participação,
mapeando dificuldade e antecipando o abandono — do ingresso até a aprovação.

## Faseamento

| Fase | Nome | Conteúdo |
|---|---|---|
| **V0** | Prova de vida | Login, identidade, quiz, missão, pontuação de participação; admin (edital + questões); log de eventos, origem da sessão e linha de base. Coorte pequeno, 30 dias. **Sem economia ativa.** |
| **V1** | Expansão (A→B→C) | Geofencing, painel de domínio completo, relatórios, push; economia Quadcoin faseada com ledger e governança |
| **V2** | Camada viva | Chat, grupos de questões, guarnições, GvG/PvP |

O maior risco do projeto é **comportamental**, não tecnológico: a V0 existe para
responder, com número, se o aluno abre o app sozinho, numa terça, sem ninguém
mandar.

## A métrica que governa tudo

**Retorno espontâneo** — apenas aberturas `OPEN_ORGANIC` contam. A taxonomia de
origem da sessão (ORGANIC / CLASS / PUSH / MENTOR / NOTICE / CAMPAIGN) é
pré-requisito da V0, junto com a linha de base comportamental (tempo por
questão, padrões de resposta, abandono, constância).

## As cinco leituras da jornada (rev. 2.3)

1. **Domínio** — o quanto o aluno demonstra saber (≠ acerto bruto)
2. **Score** — o quanto vive o Quad (participação) *(na UI do protótipo,
   rebatizado "Quad Coin" — ver registro de decisões)*
3. **Score Qualificado** — o quanto da atividade recente é elegível a recompensa
4. **Ciclo de Conquista** — a progressão econômica (V1)
5. **Quadcoin** — o poder de utilização interna (V1)

As regras econômicas (loja, Quad Coins, Diamantes, gift cards) permanecem
previstas, mas **indefinidas** — registradas, não estudadas.

## Regras estruturais

- **Árvore de conteúdo** (Concurso → Edital → Matéria → Assunto) é separada de
  **Turma = Edital × Modalidade** (RONDESP / PATAMO / BOPE)
- O edital é a espinha: lançá-lo monta o painel de domínio e cria os baldes
- Banco de questões geral etiquetado por tag; campo de uso (aula / missão)
- Regra comercial: **Dado → Cuidado → Valor → Oferta** (nunca Dado → Oferta)
- Comportamento é computado, nunca gravado como rótulo (LGPD)
- IRA (Índice de Risco de Abandono): fast-follow; eventos logados desde o dia 1

## Público da V0 e cadastro

Público interno: todo aluno da V0 já é aluno Quad. Sobre onde nasce o cadastro,
o estado real é:

- A decisão 21 (cadastro obrigatoriamente no site) foi **revogada** em
  01/08/2026 — o cadastro passou a pertencer à **arquitetura do app** (módulo
  Cadastro, planejado).
- O fluxo novo **não foi implementado**: o protótipo mantém o portão
  **"Cadastro no site do Quad"** como demonstração, até a especificação do
  módulo. (O preenchimento automático a partir de uma plataforma-base, citado
  em versões antigas deste documento, não existe no protótipo atual.)

## Consolidação Arquitetural v1.0 (01/08/2026)

Determinada pelo gestor Danilo Moura em documento oficial
([`docs/arquitetura/00-arquitetura-oficial.md`](arquitetura/00-arquitetura-oficial.md)).

**Nova premissa:** o Viver o Quad deixa de ser um app satélite de uma
plataforma-base externa e passa a ser **a plataforma principal do Quad
Concursos**. Onze capacidades antes tratadas como sistemas externos passam a
ser **módulos internos** da plataforma:

1. Cadastro
2. Autenticação
3. Matrículas
4. Produção de materiais
5. Banco de questões
6. Simulados
7. Inteligência pedagógica
8. Loja
9. Administração
10. Relatórios
11. Cronogramas

Permanecem **fora** da plataforma (integrações a definir): site e checkout
(vitrine/venda), pagamentos/financeiro, plataforma de cursos (legado em
avaliação), notificações push/e-mail (canal) e telemetria como serviço de
dados (a decidir).

**Limites da mudança:** ela é exclusivamente arquitetural — **nada foi
implementado**, e módulo sem especificação suficiente é **"Módulo Planejado"**.
O que o protótipo mostra segue sendo **"Demonstrado no protótipo (simulação
local)"** — os dois status podem coexistir num mesmo módulo. Os riscos da
auditoria de segurança de 30/07/2026 permanecem válidos, registrados como
pendências, sem solução implementada.
