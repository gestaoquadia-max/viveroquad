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
| 02 | Jornada do aluno | Entrada/conta/matrículas, tutorial do QUAD e identidade, tela inicial e cronograma, missões e treinamento, questões e quizzes (M1–M6) |
| 03 | Gamificação e economia | Score/carreira/patentes/insígnias/rankings, Quad Coins e Diamantes, Quad Store, compras/matrículas/estornos e gift cards (M7–M10) |
| 04 | Operação da sede e áreas internas | Eventos, simulados, materiais, área do professor, área administrativa N.P.P. e inteligência pedagógica (M11–M16) |
| 05 | Divergências | Catálogo consolidado das divergências texto×código e doc×doc encontradas, com evidência e impacto |
| 06 | Perguntas pendentes | As perguntas abertas ao gestor/produto, consolidadas por módulo, que a especificação real precisa responder |
| 07 | Protótipo × aplicação real | A natureza técnica do protótipo (build, estado em memória, hooks, testes), o que precisará de implementação real e as pendências de segurança/LGPD |

## Ordem de leitura sugerida

**01 → 02 → 03 → 04 → 07 → 05 → 06**

Primeiro o produto (01) e as três frentes funcionais (02–04); depois a natureza técnica do protótipo e o que falta construir (07); por fim, os dois catálogos de referência — divergências (05) e perguntas pendentes (06) — que devem acompanhar toda decisão de especificação.

## Aviso: a especificação executável acompanha os textos

Estes documentos **não substituem** o protótipo — descrevem-no. A especificação que o engenheiro deve honrar é dupla:

1. **O protótipo navegável** (`index.html` / Artefato publicado): cada fluxo, validação, texto e regra de bloqueio demonstrados são o comportamento esperado do produto.
2. **As 56 suítes Playwright versionadas em `tests/`**: a rede de regressão que prova esse comportamento, com `verify.py` (build + regressão completa) como **portão de aceite oficial** (dec. 190) e os hooks `window.__*` como contrato de teste.

Antes de alterar qualquer coisa, leia `docs/arquitetura/00-arquitetura-oficial.md` — em especial a seção 8, que lista o que está **proibido** até a especificação dos módulos (implementar sem especificação aprovada, inventar regras econômicas, descrever módulos planejados como implementados, alterar o comportamento do protótipo).
