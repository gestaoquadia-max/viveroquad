# Documentação de Handoff — Viver o Quad

**Data:** 02/08/2026 · **Revisão:** 03/08/2026 · **Destinatário:** o engenheiro de software que vai transformar o protótipo em aplicação real.

> ⚠️ **AVISO DE VIGÊNCIA** — este pacote foi **extraído em 02/08 contra as decisões 1–191**; as **decisões 192–197** foram **incorporadas nas revisões de 03/08** — consulte o CHANGELOG para mudanças posteriores.
>
> **Primeira revisão (dec. 192–194):** o evento presencial inscrito não some do calendário ao vencer — vira CONCLUÍDO ou FALTOSO — e o evento realizado sai da janela de estorno (192); a compra feita no tutorial nasce fora da regra dos 7 dias (193); sistema de DROP de itens de combate (194).
>
> **Segunda revisão (dec. 195–197):** **195** registrou as dez **Decisões Administrativas** (DA-01…DA-10, `docs/arquitetura/02-decisoes-administrativas.md`); **196** implementou seis delas no protótipo — ledger da carteira com extrato (DA-03), IDs internos (DA-01), turma **ARQUIVADA** (DA-06), **4 perfis administrativos** (DA-08), persistência da evolução do aluno em `localStorage` (DA-10) e a correção do bug do "Reiniciar demonstração"; **197** unificou o "Relatório de compras" e o "Extrato da carteira" no card **"Carteira · extrato e compras"** e removeu o contador de passos do tutorial.
>
> Contagens vigentes: **58 suítes** em `tests/` (nova `vw1.mjs`), **42 hooks** `window.__*`, **3 chaves** de `localStorage` (`vq_tut_skip`, `vq_intro_done`, `vq_evolucao`), **7 itens** de combate em `data/itens-combate.js`.

## Para que serve este pacote

O "Viver o Quad" existe hoje como um **protótipo navegável** (`index.html`, gerado das 20 partes de `src/`) que demonstra, ponta a ponta e com fidelidade testada, a experiência prevista para o app do aluno, a área do professor e a área administrativa (N.P.P.). **O protótipo é a fonte de verdade funcional do produto.** Este pacote traduz essa verdade em texto: o que cada módulo faz, quais regras de produto estão confirmadas, o que é simulação local, o que é dado demonstrativo, o que ficou decidido depois, o que é planejado e o que permanece em aberto — para que nenhum comportamento se perca na travessia do protótipo para a engenharia real.

Cada afirmação dos documentos está classificada com os rótulos padrão do projeto (FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO · SIMULAÇÃO LOCAL · REGRA DE PRODUTO CONFIRMADA · DADO DEMONSTRATIVO · DECISÃO POSTERIOR · FUNCIONALIDADE PLANEJADA · DIVERGÊNCIA · PERGUNTA PENDENTE) e rastreada até o código (`src/NN`), as decisões numeradas (`docs/02-registro-de-decisoes.md`, dec. 1–197) e sondas Playwright executadas sobre o build.

Em caso de conflito entre documentos, vale a hierarquia oficial: `docs/arquitetura/00-arquitetura-oficial.md` (Consolidação v1.0) → registro de decisões → auditoria de 30/07 (`docs/auditoria/`) → relatório rev. 2.3. Em dúvida sobre comportamento, **vale o código e as suítes de teste**.

## O mapa dos 7 documentos

| Nº | Documento | Em 1 linha |
|---|---|---|
| 01 | [Visão geral do produto](./01-visao-geral-do-produto.md) | O que é o Viver o Quad, o problema que resolve, público, papéis das três personas e a diferença honesta entre protótipo e aplicação real |
| 02 | [Fluxo completo do aluno](./02-fluxo-completo-do-aluno.md) | A jornada do aluno como o protótipo a demonstra, narrada em 19 etapas — da chegada ao Quad até o pós-venda —, com regras confirmadas e simulações de cada etapa |
| 03 | [Especificação funcional](./03-especificacao-funcional.md) | Os 17 módulos do protótipo descritos num gabarito uniforme de 17 campos, com o vocabulário oficial de classificação e rastreio a código, decisões e testes |
| 04 | [Decisões posteriores e divergências](./04-decisoes-posteriores-e-divergencias.md) | O que modifica o que existia antes: 33 fichas de decisões posteriores (seção A — A28/A29/A30 cobrem as dec. 192/193/194; **A31/A32/A33 cobrem as dec. 195/196/197**) e 28 fichas de divergências confirmadas (seção B), com fonte, impacto e "precisa ajustar?" |
| 05 | [Dados, simulações e implementação real](./05-dados-simulacoes-e-implementacao-real.md) | Camada por camada: o que é regra no código, dado demonstrativo, estado volátil e simulação — e o que a aplicação real deve reproduzir, persistir, validar e integrar |
| 06 | [Guia técnico do protótipo](./06-guia-tecnico-do-prototipo.md) | Como rodar, construir (`build.py`/`verify.py`), inspecionar e testar o protótipo: as 20 partes de `src/`, os seeds de `data/`, as 58 suítes e os hooks de teste |
| 07 | [Perguntas realmente pendentes](./07-perguntas-realmente-pendentes.md) | As 58 perguntas que o protótipo, a documentação e as decisões não respondiam — deduplicadas, com responsável sugerido e o que cada uma bloqueia. **Nove delas (P1, P2, P4, P12, P27, P36, P43, P51, P54) foram respondidas em 03/08 pelas Decisões Administrativas** e estão marcadas **[RESPONDIDA — DA-0x]**, com o resíduo de especificação que continua aberto |

## Ordem de leitura sugerida

**01 → 02 → 03 → 04 → 07 → 05 → 06**

Primeiro o produto (01), depois a jornada do aluno (02) e a especificação módulo a módulo (03); em seguida o que mudou por decisão posterior e as divergências confirmadas (04) e o que ainda falta decidir (07); por fim, a natureza dos dados e simulações com o que a implementação real precisa cobrir (05) e o guia prático para rodar e inspecionar o protótipo (06).

## Aviso: a especificação executável acompanha os textos

Estes documentos **não substituem** o protótipo — descrevem-no. A especificação que o engenheiro deve honrar é dupla:

1. **O protótipo navegável** (`index.html` / Artefato publicado): cada fluxo, validação, texto e regra de bloqueio demonstrados são o comportamento esperado do produto.
2. **As 58 suítes Playwright versionadas em `tests/`**: a rede de regressão que prova esse comportamento, com `verify.py` (build + regressão completa) como **portão de aceite oficial** (dec. 190) e os hooks `window.__*` como contrato de teste.

Antes de alterar qualquer coisa, leia `docs/arquitetura/00-arquitetura-oficial.md` — em especial a seção 8, que lista o que está **proibido** até a especificação dos módulos (implementar sem especificação aprovada, inventar regras econômicas, descrever módulos planejados como implementados, alterar o comportamento do protótipo).
