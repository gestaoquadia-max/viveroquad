# Visão e Escopo — Viver o Quad

> Síntese do documento-base *Relatório de Projeto rev. 2.3* (Danilo Moura,
> jul/2026). O PDF completo está nesta pasta e é a referência canônica.

## O que é

O Viver o Quad é um aplicativo (iOS e Android) que acompanha a jornada do aluno
— da compra do curso até o curso de formação. É um braço da plataforma web já em
construção (a grande base de dados) e conversa diretamente com ela. Transforma o
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

## Regras estruturais

- **Árvore de conteúdo** (Concurso → Edital → Matéria → Assunto) é separada de
  **Turma = Edital × Modalidade** (RONDESP / PATAMO / BOPE)
- O edital é a espinha: lançá-lo monta o painel de domínio e cria os baldes
- Banco de questões geral etiquetado por tag; campo de uso (aula / missão)
- Regra comercial: **Dado → Cuidado → Valor → Oferta** (nunca Dado → Oferta)
- Comportamento é computado, nunca gravado como rótulo (LGPD)
- IRA (Índice de Risco de Abandono): fast-follow; eventos logados desde o dia 1

## Público da V0

Público interno: todo aluno já existe na plataforma-base — por isso o cadastro
do app usa preenchimento automático a partir do banco.
