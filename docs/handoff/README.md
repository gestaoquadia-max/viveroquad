# Documentação de Handoff — Viver o Quad

**Data:** 02/08/2026 · **Destinatário:** o engenheiro de software que vai transformar o protótipo em aplicação real.

## Para que serve este pacote

O "Viver o Quad" existe hoje como um **protótipo navegável** (`index.html`, gerado das 20 partes de `src/`) que demonstra, ponta a ponta e com fidelidade testada, a experiência prevista para o app do aluno, a área do professor e a área administrativa (N.P.P.). **O protótipo é a fonte de verdade funcional do produto.** Este pacote traduz essa verdade em texto: o que cada módulo faz, quais regras de produto estão confirmadas, o que é simulação local, o que é dado demonstrativo, o que ficou decidido depois, o que é planejado e o que permanece em aberto — para que nenhum comportamento se perca na travessia do protótipo para a engenharia real.

Cada afirmação dos documentos está classificada com os rótulos padrão do projeto (FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO · SIMULAÇÃO LOCAL · REGRA DE PRODUTO CONFIRMADA · DADO DEMONSTRATIVO · DECISÃO POSTERIOR · FUNCIONALIDADE PLANEJADA · DIVERGÊNCIA · PERGUNTA PENDENTE) e rastreada até o código (`src/NN`), as decisões numeradas (`docs/02-registro-de-decisoes.md`, dec. 1–191) e sondas Playwright executadas sobre o build.

Em caso de conflito entre documentos, vale a hierarquia oficial: `docs/arquitetura/00-arquitetura-oficial.md` (Consolidação v1.0) → registro de decisões → auditoria de 30/07 (`docs/auditoria/`) → relatório rev. 2.3. Em dúvida sobre comportamento, **vale o código e as suítes de teste**.

## O mapa dos 7 documentos

| Nº | Documento | Em 1 linha |
|---|---|---|
| 01 | [Visão geral do produto](./01-visao-geral-do-produto.md) | O que é o Viver o Quad, o problema que resolve, público, papéis das três personas e a diferença honesta entre protótipo e aplicação real |
| 02 | [Fluxo completo do aluno](./02-fluxo-completo-do-aluno.md) | A jornada do aluno como o protótipo a demonstra, narrada em 19 etapas — da chegada ao Quad até o pós-venda —, com regras confirmadas e simulações de cada etapa |
| 03 | [Especificação funcional](./03-especificacao-funcional.md) | Os 17 módulos do protótipo descritos num gabarito uniforme de 17 campos, com o vocabulário oficial de classificação e rastreio a código, decisões e testes |
| 04 | [Decisões posteriores e divergências](./04-decisoes-posteriores-e-divergencias.md) | O que modifica o que existia antes: 27 fichas de decisões posteriores (seção A) e 28 fichas de divergências confirmadas (seção B), com fonte, impacto e "precisa ajustar?" |
| 05 | [Dados, simulações e implementação real](./05-dados-simulacoes-e-implementacao-real.md) | Camada por camada: o que é regra no código, dado demonstrativo, estado volátil e simulação — e o que a aplicação real deve reproduzir, persistir, validar e integrar |
| 06 | [Guia técnico do protótipo](./06-guia-tecnico-do-prototipo.md) | Como rodar, construir (`build.py`/`verify.py`), inspecionar e testar o protótipo: as 20 partes de `src/`, os seeds de `data/`, as 56 suítes e os hooks de teste |
| 07 | [Perguntas realmente pendentes](./07-perguntas-realmente-pendentes.md) | As 58 perguntas que nada no protótipo, na documentação ou nas decisões responde — deduplicadas, com responsável sugerido e o que cada uma bloqueia |

## Ordem de leitura sugerida

**01 → 02 → 03 → 04 → 07 → 05 → 06**

Primeiro o produto (01), depois a jornada do aluno (02) e a especificação módulo a módulo (03); em seguida o que mudou por decisão posterior e as divergências confirmadas (04) e o que ainda falta decidir (07); por fim, a natureza dos dados e simulações com o que a implementação real precisa cobrir (05) e o guia prático para rodar e inspecionar o protótipo (06).

## Aviso: a especificação executável acompanha os textos

Estes documentos **não substituem** o protótipo — descrevem-no. A especificação que o engenheiro deve honrar é dupla:

1. **O protótipo navegável** (`index.html` / Artefato publicado): cada fluxo, validação, texto e regra de bloqueio demonstrados são o comportamento esperado do produto.
2. **As 56 suítes Playwright versionadas em `tests/`**: a rede de regressão que prova esse comportamento, com `verify.py` (build + regressão completa) como **portão de aceite oficial** (dec. 190) e os hooks `window.__*` como contrato de teste.

Antes de alterar qualquer coisa, leia `docs/arquitetura/00-arquitetura-oficial.md` — em especial a seção 8, que lista o que está **proibido** até a especificação dos módulos (implementar sem especificação aprovada, inventar regras econômicas, descrever módulos planejados como implementados, alterar o comportamento do protótipo).
