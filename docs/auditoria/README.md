# Auditoria do protótipo "Viver o Quad" (V0 "Prova de Vida") — índice

14 documentos, numerados 00→13, produzidos pela auditoria de 30/07/2026. Todos descrevem um **protótipo navegável** — nada aqui é sistema de produção.

## Os 14 documentos

| Nº | Arquivo | O que contém |
|---|---|---|
| 00 | [`00-resumo-executivo.md`](00-resumo-executivo.md) | Visão geral honesta do protótipo, principais riscos e ordem recomendada das próximas etapas |
| 01 | [`01-mapa-do-prototipo.md`](01-mapa-do-prototipo.md) | Estrutura do repositório, build (build.py/build.ps1), organização interna do `src.html`, estados globais e pontos críticos |
| 02 | [`02-telas-paineis-e-modais.md`](02-telas-paineis-e-modais.md) | Catálogo completo de views, painéis e overlays por persona, com ficha padronizada de 15 campos por tela |
| 03 | [`03-fluxos-do-usuario.md`](03-fluxos-do-usuario.md) | 19 fluxos ponta a ponta (login, tutorial, missões, quiz, simulados, compras/estornos, portaria, admin) |
| 04 | [`04-funcionalidades-e-status.md`](04-funcionalidades-e-status.md) | Matriz AL/PR/AD/TR: cada funcionalidade com implementação, classificação, evidência de linha e prioridade |
| 05 | [`05-regras-de-negocio.md`](05-regras-de-negocio.md) | Catálogo das 61 regras confirmadas (RN-01 a RN-61), com fonte documental, evidência no código e exceções |
| 06 | [`06-dados-locais-e-persistencia.md`](06-dados-locais-e-persistencia.md) | Inventário das estruturas em memória, as 8 chaves `vq_*` de localStorage e o que se perde no F5 |
| 07 | [`07-mapa-do-ecossistema.md`](07-mapa-do-ecossistema.md) | Fichas dos sistemas do ecossistema previsto, matriz de propriedade dos dados e riscos transversais |
| 08 | [`08-matriz-de-fontes-oficiais.md`](08-matriz-de-fontes-oficiais.md) | Fonte da verdade de cada dado (estado atual × alvo) em cinco matrizes temáticas |
| 09 | [`09-integracoes-futuras.md`](09-integracoes-futuras.md) | Os 22 contratos lógicos do app com o ecossistema (entrada/saída, frequência, indisponibilidade, estado atual) |
| 10 | [`10-divergencias-e-decisoes-pendentes.md`](10-divergencias-e-decisoes-pendentes.md) | Divergências doc×doc e doc×código, linha do tempo das decisões e tabela consolidada de perguntas ao produto |
| 11 | [`11-avaliacao-de-reaproveitamento.md`](11-avaliacao-de-reaproveitamento.md) | O que do protótipo serve ao produto real — e em que qualidade (especificação, portar, reconstruir, descartar) |
| 12 | [`12-plano-de-transformacao.md`](12-plano-de-transformacao.md) | As 20 fases do protótipo ao produto real, com dependências, entregas, riscos e critérios de conclusão |
| 13 | [`13-guia-para-o-desenvolvedor.md`](13-guia-para-o-desenvolvedor.md) | Porta de entrada prática de quem recebe o projeto: o que ler, como rodar, o que é real e por onde começar |

## Ordem de leitura sugerida

1. **00 — Resumo executivo**: o quadro inteiro em uma leitura.
2. **13 — Guia para o desenvolvedor**: como rodar e o que é encenação.
3. **10 — Divergências e decisões pendentes**: o que ainda precisa de resposta do produto.
4. **04 — Funcionalidades e status**: a matriz do que existe e em que maturidade.
5. **Demais documentos** conforme a necessidade: 01 (estrutura/build), 02 (telas), 03 (fluxos), 05 (regras), 06 (dados), 07/08/09 (ecossistema, fontes e integrações), 11 (reaproveitamento) e 12 (plano de transformação).

*Não há volume dedicado de Segurança/LGPD: o tema está no §5.3 do doc 00, no §6 do doc 07, nas observações transversais do doc 09 e na Fase 18 do doc 12.*
