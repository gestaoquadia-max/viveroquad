# 00 · Resumo executivo — Auditoria do protótipo "Viver o Quad" (V0 "Prova de Vida")

**Data:** 30/07/2026
**Fonte:** auditoria do protótipo (src.html, build, docs/ e relatório rev. 2.3)

> **Este documento descreve um PROTÓTIPO NAVEGÁVEL. Nada aqui é sistema de produção; comportamentos são simulados localmente no navegador, salvo indicação em contrário.**

Este resumo condensa os achados de seis frentes de investigação (estrutura/build, experiência do aluno, professor/admin, dados/persistência/LGPD, regras de negócio e documentação). Ele foi escrito para duas pessoas: **o desenvolvedor que nunca viu o projeto** e **o gestor Danilo Moura**. Toda afirmação técnica abaixo foi verificada no código (função/linha citadas nos documentos detalhados); o que não pôde ser confirmado está marcado como HIPÓTESE, no vocabulário padrão da auditoria.

---

## Atualização — Consolidação Arquitetural v1.0 (01/08/2026)

Em 01/08/2026, dois dias após esta auditoria, o gestor Danilo Moura determinou a **Consolidação Arquitetural v1.0**. Ela muda premissas e o estado do repositório; as seções abaixo foram anotadas onde ficaram desatualizadas. Resumo do que mudou:

1. **Nova premissa arquitetural: o Viver o Quad é a plataforma principal do Quad Concursos.** Onze capacidades que esta auditoria tratava como sistemas externos passam a ser **módulos internos** da plataforma: cadastro; autenticação; matrículas; produção de materiais; banco de questões; simulados; inteligência pedagógica; loja; administração; relatórios; cronogramas. Permanecem **fora** (integrações a definir): site e checkout (vitrine/venda), pagamentos/financeiro, plataforma de cursos (legado em avaliação), notificações push/e-mail (canal) e telemetria como serviço de dados (a decidir). A mudança é **exclusivamente arquitetural** — nada foi implementado; módulo sem especificação suficiente é "Módulo Planejado".
2. **Decisão 21 revogada.** O cadastro deixa de pertencer obrigatoriamente ao site e passa a pertencer à arquitetura do app (Módulo Planejado). O fluxo novo **não foi implementado**: o protótipo mantém o portão "Cadastro no site do Quad" como demonstração, até a especificação do módulo.
3. **O fonte agora vive em `src/` — `src.html` não existe mais.** O monolito foi dividido em **20 partes contíguas** (`NN-descricao.html`); a concatenação na ordem reproduz o documento único com saída de build byte-idêntica. As referências "src.html l.N" desta auditoria valem para o monolito auditado em 30/07; `src/README.md` traz a tabela das partes e a correspondência.
4. **Build portátil com validação.** `build.py` passou a usar caminho relativo ao próprio script, valida a presença das 20 partes e valida tokens **ausentes e sobras**; `build.ps1` espelha as mesmas validações.
5. **Código morto removido, com regressão completa (56 suítes verdes):** a duplicata sombreada de `hojeISO`; o fluxo revogado de autorização de dispositivo (variáveis, objeto `LS` e chaves `vq_device_authorized`/`vq_last_sync`/`vq_pending`); as chaves de tutorial nunca lidas (`vq_tut_step`/`vq_tut_done`/`vq_tut_rew`); as funções nunca chamadas `openQuiz`, `fmtSync` e `tutDadosOk`; 8 comentários enganosos atualizados. As chaves de `localStorage` vivas agora são só **`vq_tut_skip` e `vq_intro_done`**. `LINKS_ONLINE` foi **preservado** como ponto de integração planejado. O bug do reset (não limpa `vq_intro_done`) **não** foi corrigido — mudaria comportamento — e segue documentado.
6. **Peso morto fora do repositório:** `Viver o Quad.rar` (9,4 MB, órfão) e `quad-coin.png` (904 KB, órfão) foram removidos do versionamento.
7. **`docs/arquitetura/` passa a ser a referência arquitetural única do projeto.** Em conflito entre esta auditoria e a Consolidação, prevalece `docs/arquitetura/00-arquitetura-oficial.md`.

O comportamento funcional e a experiência do usuário do protótipo **não mudaram** (divisão com saída byte-idêntica; limpeza com regressão verde). As pendências de segurança do §5.3 permanecem válidas e registradas — nenhuma solução foi implementada. As perguntas que a Consolidação respondeu (e as que continuam abertas) estão marcadas no doc 10.

---

## 1. O que o protótipo é hoje

O "Viver o Quad" V0 é **um único arquivo HTML navegável** que demonstra, de ponta a ponta, a experiência prevista para o app do aluno do Quad Concursos — e também as áreas do professor e da administração (N.P.P.), todas no mesmo arquivo, alternadas por botões de persona.

- **Fonte editável:** na auditoria, `src.html` (11.920 linhas, 764 KB), com CSS (linhas ~3–1570), HTML (~1571–3668) e um único bloco JavaScript (IIFE, ~3670–11920). *Atualização 01/08:* o fonte foi dividido nas **20 partes contíguas de `src/`** — `src.html` não existe mais; a concatenação reproduz o mesmo documento único (ver `src/README.md`).
- **Saídas de build:** `index.html` e `artifact.html` (~9,4 MB cada), gerados por `build.py` ou `build.ps1`, que embutem todas as mídias (fontes, vídeo do mascote, sprites, logos, 84 fotos de variantes de avatar) como data-URIs base64. As saídas **não são versionadas** (.gitignore) e rodam 100% offline — não há nenhuma chamada de rede no arquivo gerado (zero `fetch`/`XMLHttpRequest`/`WebSocket`, zero scripts externos). CONFIRMADO NO CÓDIGO.
- **Dados 100% locais:** todo o "banco de dados" são arrays e objetos JavaScript em memória (`TURMAS_LOJA`, `MATRICULAS`, `EVENTOS`, `SIMULADOS`, `DOCENTES`, `COMPRAS`, `CONCURSOS` com árvores de edital etc.). A única persistência é o `localStorage`: na auditoria eram **8 flags** de tutorial/dispositivo (prefixo `vq_`); *desde a limpeza de 01/08 restam só as 2 vivas* (`vq_tut_skip` e `vq_intro_done`). Recarregar a página (F5) zera moedas, compras, matrículas, mensagens e progresso — sobrevivem só as flags. CONFIRMADO NO CÓDIGO. ***Atualização 03/08 (dec. 196, DA-10): são **3 chaves** — a nova `vq_evolucao` faz saldos, score de carreira, mochila, skins, avatar, nome de guerra, turma ativa, `trAj` e os 60 últimos lançamentos do extrato sobreviverem ao F5, por dispositivo.***
- **Mecânicas que funcionam de verdade dentro da sessão** (SIMULADO LOCALMENTE): login e tutorial de 29 passos, economia com duas moedas (Quad Coins e Diamantes), Quad Store completa com estorno em 7 dias e "consumo mata estorno", turma ativa trocável, missões/flashcards por turma, quiz ao vivo professor↔aluno, prova de promoção de patente, gift cards com liberação única, portaria/recepção, criação de turmas/eventos/simulados pelo admin com validação de salas e choque de agenda, mensageria admin→aluno/professor, relatórios que misturam dados vivos da sessão com números sintéticos estáveis.
- **Histórico rastreável:** 116 entradas de CHANGELOG (13→28/07) e 181 decisões numeradas em `docs/02-registro-de-decisoes.md`. É o registro mais fiel do comportamento vigente — mais atual que o README e que o relatório rev. 2.3.

## 2. O que o protótipo NÃO é

- **Não é um sistema de produção nem um "app quase pronto".** Nenhum dado sai do navegador; nenhuma credencial é validada de verdade; nenhum pagamento existe. O acabamento visual (que é alto) não corresponde a maturidade de engenharia.
- **Não autentica ninguém.** O login do aluno aceita **qualquer e-mail com "@" e qualquer senha** (`acessarPortal()`, l.5633). O gate do admin valida **apenas a chave** `NPP-2026` — o e-mail é livre (l.9789), divergindo do que o briefing do projeto descrevia (DIVERGÊNCIA DOCUMENTAL). Os três gates são overlays CSS removíveis pelo DevTools. APENAS VISUAL + DEPENDE DO BACK-END.
- **Não mede a métrica-mãe.** A telemetria (origem da sessão, linha de base comportamental), declarada pré-requisito da V0 no relatório rev. 2.3, existe **apenas como uma linha de texto estática** no painel lateral. APENAS VISUAL.
- **Não persiste progresso.** Nada de negócio sobrevive ao F5 (ver §1). O que o relatório chama de ledger, matrícula, estoque e presença é mutação de variável local.
- **Não respeita o faseamento do documento-base.** O protótipo demonstra na V0 itens que a rev. 2.3 fasea em V1/V2: economia completa, Diamante (dinheiro real — sequer previsto no documento), painel de Domínio completo, patente dinâmica com prova de promoção. É demonstração, não antecipação de entrega — mas o documento-base nunca foi revisado (a "rev. 2.4" é pendência formal desde a decisão 11). DIVERGÊNCIA DOCUMENTAL + DECISÃO DE PRODUTO PENDENTE.
- **Não carrega os testes.** As suítes Playwright citadas em todo o CHANGELOG **não estão no repositório** — sobraram apenas os 31 hooks `window.__*` no código. O repositório sozinho não permite reproduzir a verificação de regressão. *Atualização 01/08 (dec. 190) — SUPERADO:* as suítes foram versionadas em `tests/` (56 à época; 57 e 35 hooks na rodada de 02/08; **58 suítes e 42 hooks desde 03/08, dec. 196**), com runner portátil e `verify.py` (build + regressão) como portão de aceite oficial. **O repositório hoje reproduz a regressão sozinho.**

## 3. Grau de complexidade encontrado

Valores medidos no monolito auditado em 30/07. *Atualização 01/08:* o fonte agora são as 20 partes de `src/` (11.889 linhas somadas, após a remoção de código morto); as demais ordens de grandeza permanecem.

| Métrica | Valor verificado (30/07) |
|---|---|
| Linhas do `src.html` | **11.920** (CSS ~1.568 · HTML ~2.098 · JS ~8.250) — *01/08: 11.889 nas 20 partes de `src/`* |
| Declarações de função nomeada | **468** (466 nomes únicos; 2 duplicatas: `hojeISO`, `falta`) — *01/08: a duplicata sombreada de `hojeISO` foi removida* |
| Views (`id="v-*"`) | **22** (9 aluno · 5 professor · 8 admin) |
| `addEventListener` | **235** |
| Overlays/camadas | 21 (ids `*Layer`, incl. `#simDigLayer`) · Navbars: 3 · Blocos `data-bl` do admin: 21 |
| Variáveis de topo do IIFE ("bancos" de dados) | ~207 |
| Temporizadores | 33 `setTimeout` · 5 `setInterval` |
| Manipulação de DOM | 187 linhas com `innerHTML` × 17 `createElement` |
| Hooks de teste `window.__*` | **31** |
| Chaves de `localStorage` | **8** (todas `vq_*`; 4 total ou parcialmente mortas) — *01/08: mortas removidas; vivas: 2 (`vq_tut_skip`, `vq_intro_done`); **03/08 (dec. 196): 3, com a nova `vq_evolucao`***|
| Marcações `[INTEGRAÇÃO REAL]` no código | 24 |
| Saída de build | ~9,4 MB por arquivo (mídias em base64) |
| Documentação | 116 entradas de CHANGELOG · 181 decisões numeradas |

Tudo isso vive **num único IIFE, sem módulos e sem `use strict`**, com as três personas compartilhando o mesmo estado (o quiz criado pelo professor é o objeto que o aluno responde; a turma criada no admin é o item vendido na Loja). Isso realiza a promessa "tudo conectado em tempo real" da demonstração — ao custo de **acoplamento total, sem nenhuma fronteira de módulo**.

## 4. As três experiências

| Persona | Entrada | O que demonstra |
|---|---|---|
| **Aluno** | Qualquer e-mail + senha (sem validação real) | Início com aula de hoje/eventos, tutorial do mascote QUAD (29 passos), missões/flashcards por turna ativa, Domínio (prévia V1), Quadrômetro/carreira com 14 patentes, Quad Store completa (turmas, isoladas, simulados, eventos, skins, itens de combate, estornos), calendário, materiais, chat de recados |
| **Professor** | E-mail derivado do sobrenome (`<sobrenome>@quadconcursos.com.br`) + senha demo `quad1234` | Painel pessoal (foto/senha), aulas do dia e calendário derivados da grade, quiz ao vivo por turma criado "por PDF" (banco demo), relatório de respostas com polling simulado, recados da administração |
| **Admin N.P.P.** | Qualquer e-mail + chave `NPP-2026` | Governança completa: banco de professores, criação de turmas/isoladas/eventos/simulados com validação de salas e lotação, créditos manuais, bloqueio de contas, mensagens por público, gift cards em lote, avisos, cronograma, materiais, liberações (portaria/pedidos), relatórios, preços da Loja |

Tudo nas três áreas é, no mínimo, SIMULADO LOCALMENTE; os documentos detalhados classificam item a item o sistema real de que cada mecânica dependerá (back-end, banco de dados, checkout, planilha da coordenação etc.).

## 5. Principais riscos

### 5.1 Riscos técnicos
1. **Monólito acoplado sem rede de proteção.** 8.250 linhas de JS num IIFE com dependência de ordem de declaração (admitida em comentário no próprio código), sem testes versionados. Qualquer manutenção fora do ambiente original opera às cegas.
2. **Armadilhas de nomenclatura.** A variável `score` guarda **Quad Coins (moeda)**, não o score de carreira (`carreira.score*`) — legado documentado que confundirá qualquer desenvolvedor novo. Não existe `TURMAS`; o símbolo real é `TURMAS_LOJA`. DECISÃO TÉCNICA PENDENTE (renomear).
3. **Padrões que não migram.** Preços da Loja raspados do DOM; nome do professor como chave primária; "PDF" de lista de presença via `window.print()`; código morto autodeclarado na auditoria (botão `[DEMO PROVISÓRIO]` de subir patente, `openQuiz`, `#daniloPop`, `LINKS_ONLINE`, 4 chaves de localStorage mortas, view `v-pretaf` órfã/inalcançável, `#connToggle` referenciado no JS mas inexistente no HTML). *Atualização 01/08:* `openQuiz` e as chaves mortas de localStorage foram **removidos** com regressão verde (junto com `fmtSync`, `tutDadosOk`, a duplicata de `hojeISO` e o fluxo revogado de autorização de dispositivo); `LINKS_ONLINE` foi **preservado deliberadamente** como ponto de integração planejado; botão `[DEMO PROVISÓRIO]`, `v-pretaf`, `#daniloPop` e `#connToggle` permanecem (decisões pendentes).
4. **Build frágil fora do ambiente atual** — **corrigido em 01/08** (ver §8).

### 5.2 Riscos de expectativa
1. **O protótipo parece pronto e não é.** Tudo o que "funciona" é mutação local; a distância até o produto real é a construção de todo o back-end e das integrações (§6).
2. **V0, V1 e V2 misturadas.** Se o piloto de 30 dias rodar com a economia ligada, o teste de retorno espontâneo (métrica-mãe) nasce contaminado — exatamente o que o relatório rev. 2.3 proíbe. DECISÃO DE PRODUTO PENDENTE: definir o corte do piloto (loja ligada, vitrine ou desligada).
3. **Documentação de entrada engana.** README e `docs/00-comece-aqui-danilo.md` descrevem fluxos que não existem mais (portão "Minha primeira vez", tour de 9 passos, mascote chamado "Danilo" — o vigente é **QUAD**). O guia do gestor guia para telas removidas. DIVERGÊNCIA DOCUMENTAL.

### 5.3 Riscos de segurança e LGPD
1. **Toda autorização é do lado do cliente** e as credenciais demo (`quad1234`, `NPP-2026`, gift cards `QUAD-100/500`) estão hardcoded — e algumas **impressas na própria tela**. Aceitável na demo pública com dados fictícios; **bloqueante** em qualquer versão com dado real.
2. **Hooks e gabaritos no artefato publicado.** Os 31 hooks `window.__*` (que forçam lotação, concluem missões, encerram matrículas) e os gabaritos das questões embarcam no HTML público. Em produção, fraude trivial. DECISÃO TÉCNICA PENDENTE: build separado dev/prod.
3. **Dados pessoais simulados plausíveis.** Nomes, telefones no padrão real de Salvador e e-mails derivados circulam no arquivo; upload de foto de professor vira dataURL na sessão. Recomenda-se usar dados obviamente fictícios.
4. **Perfilamento previsto sem governança especificada.** Domínio por sub-assunto + autoavaliação + IRA (risco de abandono) formam perfil comportamental de pessoa identificada; as salvaguardas declaradas ("comportamento é computado, nunca gravado como rótulo"; "nunca Dado → Oferta") não têm desenho técnico. No ranking, o top 10 é sempre exposto (sem opt-out) e a escolha de perfil privado não persiste. DECISÃO DE PRODUTO PENDENTE + DECISÃO TÉCNICA PENDENTE.

## 6. Protótipo navegável × aplicação real

A diferença não é de "polimento", é de natureza:

| Dimensão | No protótipo | Na aplicação real |
|---|---|---|
| Dados | Arrays JS em memória; F5 apaga tudo | Banco de dados; estado por conta |
| Autenticação | Gates visuais; qualquer credencial passa | Autenticação/autorização de verdade, RBAC |
| Economia (QdC/Dmn) | Variáveis locais mutadas por clique | Ledger auditável no servidor (Anexo A da rev. 2.3) |
| Compras/estornos | Mutação de objetos + logs locais | Transações financeiras (checkout/Pagar.me) |
| Quiz ao vivo | Polling `setInterval` com números aleatórios | Tempo real servidor (websocket) com respostas reais |
| Questões/editais | Bancos demo embutidos; "PDF" só de nome | Banco central de questões + extração real de PDF |
| Cronograma | Snapshot fixo da "semana 30" | Sincronização com a planilha/sistema da coordenação |
| Telemetria | Linha de texto estática | Log de eventos com taxonomia de origem, desde o dia 1 |

Na premissa vigente à época da auditoria, o ecossistema previsto deixava claro que **o app não seria dono de quase nada**: cadastro, matrícula, financeiro, questões, materiais, eventos e relatórios pertenceriam a sistemas próprios com os quais o app conversaria. *Atualização 01/08 — essa premissa foi SUPERADA pela Consolidação v1.0:* o Viver o Quad passa a ser **a plataforma principal**, e cadastro, autenticação, matrículas, produção de materiais, banco de questões, simulados, inteligência pedagógica, loja, administração, relatórios e cronogramas viram **módulos internos** (Módulos Planejados enquanto não especificados); seguem externos apenas site/checkout, pagamentos/financeiro, plataforma de cursos (legado em avaliação), notificações push/e-mail e telemetria como serviço de dados (a decidir) — ver `docs/arquitetura/`. Os pontos `[INTEGRAÇÃO REAL]` no código continuam sendo o mapa das costuras, agora relidos como fronteiras módulo interno × integração externa — eram 24 no monolito auditado; no fonte atual em `src/` são **23** (uma marcação saiu junto com o fluxo revogado de autorização de dispositivo, na limpeza de 01/08).

## 7. O que um desenvolvedor precisa compreender antes de alterar o código

1. **Edite somente as partes de `src/`** (desde 01/08; `src.html` não existe mais — ver `src/README.md`). `index.html` e `artifact.html` são saídas de build e serão sobrescritas. O fluxo é: editar → rodar build → publicar.
2. **Os 10 tokens de build são sagrados.** `__FONTS__`, `__DANILO_VIDEO__`, `__DANILO_SPRITE__`, `__QUAD_LOGO__`, `__QUAD_SIMBOLO__`, `__AVATARS__`, `__INSIGNIAS__`, `__QUAD_COIN__`, `__DIAMANTE__`, `__FOTOS_VARIANTES__`. *Desde 01/08*, **os dois scripts** abortam se um token sumir ou sobrar não substituído (na auditoria, o `build.ps1` publicava silenciosamente o token cru).
3. **Um IIFE só, com dependência de ordem.** Não há módulos; blocos no fim do arquivo dependem de declarações anteriores. `showView()` é o hub que dispara os re-renders de todas as personas — mudanças de tela quase sempre passam por ali. (As referências de linha "l.N" desta auditoria valem para o monolito de 30/07; `src/README.md` explica a correspondência com as partes.)
4. **As três personas compartilham estado.** Alterar uma estrutura do admin (ex.: `TURMAS_LOJA`, `QUIZZES`, `SALA_CAP`) reflete na hora no aluno e no professor. Não existe "área isolada".
5. **Armadilhas de nome:** `score` = Quad Coins (moeda); o score de carreira mora em `carreira.*`. O catálogo de turmas é `TURMAS_LOJA`.
6. **Comportamento é especificado pelo CHANGELOG e pelo registro de decisões**, não pelo README (defasado em ~10 dias e vários fluxos). Em conflito, vale o código; em dúvida de intenção, a decisão numerada mais recente.
7. **Os hooks `window.__*` são contrato com as suítes Playwright externas** (não versionadas). Não remova nem renomeie sem decisão explícita.
8. **localStorage:** desde 01/08, só existiam **2 chaves** (`vq_tut_skip` e `vq_intro_done`) — as 6 mortas/revogadas da auditoria foram removidas com regressão. ***Atualização 03/08 (dec. 196): são **3 chaves**, com a nova `vq_evolucao` (DA-10), e o **bug do reset foi corrigido** — o botão "Reiniciar demonstração" limpa as três.***
9. **Duplicatas e código morto conhecidos** (ver §5.1.3 — parte removida em 01/08) — não os tome como padrão a seguir.

## 8. Situação do build e portabilidade do protótipo

**Veredito da auditoria (30/07): o build está íntegro e sincronizado, mas é frágil fora do ambiente atual.** *Atualização 01/08: a fragilidade de portabilidade foi corrigida — ver marcações abaixo.*

- **Íntegro:** o rebuild com `build.py` reproduz o `artifact.html` em disco **byte a byte** (verificado por `cmp` nesta auditoria; a divisão do fonte em `src/`, em 01/08, também foi verificada com saída byte-idêntica). Todas as 9 mídias + 84 fotos existem; os 10 tokens estão no fonte.
- **Autoria do último build:** `build.py` (as aspas simples no objeto `__FOTOS_VARIANTES__` do artefato o denunciam) — **em contradição com README/docs, que só ensinam `build.ps1`** e nem citam a existência do `build.py`. DIVERGÊNCIA DOCUMENTAL.
- **Portabilidade — CORRIGIDA em 01/08:** na auditoria, o `build.py` tinha **caminho absoluto fixo `/home/user/viveroquad`** (morria em qualquer outra máquina/pasta) e o `build.ps1` **não validava token ausente** (risco de publicar HTML com `__TOKEN__` exposto). Desde a Consolidação, o `build.py` usa caminho **relativo ao próprio script**, valida a presença das **20 partes** de `src/` e valida tokens **ausentes e sobras**; o `build.ps1` espelha as mesmas validações.
- **Mídias:** 9 arquivos + `fotos/` (7 variantes × 12 fotos .webp) viram data-URIs; o base64 infla ~33% e resulta nos ~9,4 MB por saída. Os dois arquivos de **peso morto** apontados pela auditoria — `Viver o Quad.rar` (9 MB, órfão) e `quad-coin.png` (904 KB; os builds usam o .webp) — foram **removidos do repositório em 01/08**.
- **README/docs de build desatualizados em cadeia** (registro de 30/07): URL antiga do artefato (`4d06ad26-…`) em README, docs/00 e docs/03; tamanhos irreais ("src ~70 KB" vs 764 KB; "index ~4 MB" vs 9,4 MB); "três mídias" vs 10 tokens; árvore de arquivos do README omitindo 10+ itens (build.py, fonts.css, insignias.jpg, diamante.webp, quad-coin.*, fotos/, o .rar, entre outros). *Atualização 01/08:* **resolvido** — README, docs/00, docs/01 e docs/03 foram **reescritos em 01/08** contra a Consolidação (fonte em `src/`, os dois builds, tamanhos e árvore reais), e a URL vigente `945e81a8-…` passou a estar **registrada no repositório** (README, docs/00, docs/02 e docs/03); resta apenas a validação formal da URL pelo gestor.

**Correções mínimas recomendadas — situação em 01/08:** caminho relativo no `build.py` — **feito**; validação de tokens nos dois scripts — **feito** (contagem de fotos segue sem validação); remover `.rar` e `quad-coin.png` — **feito**; reescrever README/docs/00/docs/03 — **feito em 01/08** (com docs/01; URL vigente registrada, restando a validação do gestor); versionar as suítes Playwright — **pendente**.

## 9. Ordem recomendada para as próximas etapas

1. **Higiene imediata do repositório e do build** — *executada em 01/08*: caminho do `build.py` corrigido, validações nos dois scripts, órfãos (`.rar`, `quad-coin.png`) removidos, e README/docs/00/01/03 **reescritos** (URL vigente, build, tamanhos, árvore com `src/`, roteiro de demo, mascote QUAD) — resta só a validação formal da URL pelo gestor.
2. **Recuperar a rede de proteção:** versionar as suítes Playwright junto do protótipo e documentar a política dos hooks `window.__*` (mantê-los fora de qualquer build "de produção").
3. **Limpezas cirúrgicas no código** (sem mudar comportamento) — *parcialmente executada em 01/08* (código morto removido com regressão verde: `hojeISO` duplicada, fluxo de autorização de dispositivo, chaves mortas de localStorage, `openQuiz`/`fmtSync`/`tutDadosOk`); **pendente**: remover o botão `[DEMO PROVISÓRIO]`; renomear `score`→`qdc`; decidir o destino da view órfã `v-pretaf`; consertar o reset da demo (`vq_intro_done`).
4. **Rodada de decisões de produto com Danilo** (perguntas consolidadas no documento de pendências): corte do piloto de 30 dias (economia ligada/vitrine/desligada), entrada do Diamante na rev. 2.4, tutorial reabrindo ou não a cada acesso, Pré-TAF, saneamento do registro de decisões (duplicatas 126–129 e ordenação).
5. **Rev. 2.4 do documento-base:** absorver (ou rejeitar formalmente) o que o protótipo demonstrou além da rev. 2.3 — pendência formal desde a decisão 11.
6. **Só então, arquitetura da aplicação real** — *reenquadrada em 01/08 pela Consolidação v1.0 (ver `docs/arquitetura/`)*: especificação dos módulos internos da plataforma (cadastro, autenticação, matrículas, materiais, questões, simulados, inteligência pedagógica, loja, administração, relatórios, cronogramas) e contratos com o que permanece externo (site/checkout, pagamentos/financeiro, plataforma de cursos legada, notificações, telemetria), ledger da economia, telemetria com taxonomia de origem — e o desenho LGPD (base legal, minimização, retenção, direitos do titular) **antes** de qualquer dado real entrar.

## 10. Mapa dos documentos da auditoria

Esta auditoria está organizada em 14 documentos nesta pasta (`docs/auditoria/`), numerados 00→13. Este é o 00; os 13 demais aprofundam cada tema:

| Nº | Documento (arquivo em `docs/auditoria/`) | Para que serve |
|---|---|---|
| 00 | **Resumo executivo** (este documento) | Visão geral, riscos e ordem das próximas etapas |
| 01 | Mapa do protótipo (`01-mapa-do-prototipo.md`) | Estrutura de arquivos do repositório, análise dos dois scripts de build e portabilidade, organização interna do `src.html` (views, overlays, contagens), estados globais e pontos críticos |
| 02 | Telas, painéis e modais (`02-telas-paineis-e-modais.md`) | Catálogo completo de views, painéis e overlays por persona (aluno → professor → admin), com uma ficha padronizada por tela |
| 03 | Fluxos do usuário (`03-fluxos-do-usuario.md`) | 19 fluxos ponta a ponta (login, tutorial, missões, quiz ao vivo, simulados, compras/estornos, portaria, operação do admin), com etapas, validações e erros |
| 04 | Funcionalidades e status (`04-funcionalidades-e-status.md`) | Matriz completa AL/PR/AD/TR: cada funcionalidade com implementação atual, classificação, evidência de linha, sistema futuro responsável e prioridade |
| 05 | Regras de negócio (`05-regras-de-negocio.md`) | Catálogo das regras confirmadas (RN-01 a RN-61): fonte documental, evidência no código, exceções e sistema responsável no ecossistema |
| 06 | Dados locais e persistência (`06-dados-locais-e-persistencia.md`) | Inventário das estruturas em memória, as 8 chaves de localStorage, o que persiste e o que se perde no F5 |
| 07 | Mapa do ecossistema (`07-mapa-do-ecossistema.md`) | Fichas dos sistemas do ecossistema previsto, matriz "quem é a fonte oficial de quê" e riscos transversais (inclusive LGPD por acúmulo) |
| 08 | Matriz de fontes oficiais (`08-matriz-de-fontes-oficiais.md`) | Fonte da verdade de cada dado (estado atual × alvo) nas cinco matrizes: identidade, matrícula/ensino, desempenho, economia e eventos/comunicação |
| 09 | Integrações futuras (`09-integracoes-futuras.md`) | Os 22 contratos lógicos do app com o ecossistema (entrada/saída, frequência, autenticação, indisponibilidade, estado atual) |
| 10 | Divergências e decisões pendentes (`10-divergencias-e-decisoes-pendentes.md`) | Divergências doc×doc e doc×código, linha do tempo das decisões (substituições/duplicatas) e tabela consolidada de perguntas ao produto |
| 11 | Avaliação de reaproveitamento (`11-avaliacao-de-reaproveitamento.md`) | O que do protótipo serve ao produto real — e em que qualidade (aproveitar como especificação, portar, reconstruir, descartar) |
| 12 | Plano de transformação (`12-plano-de-transformacao.md`) | As 20 fases do protótipo ao produto real, com dependências, entregas, riscos e critérios de conclusão (segurança e LGPD na Fase 18) |
| 13 | Guia para o desenvolvedor (`13-guia-para-o-desenvolvedor.md`) | Porta de entrada prática de quem recebe o projeto: o que ler, como rodar, o que é real e o que é encenação, sequência para iniciar |

*Nota: não há um volume dedicado a "Segurança e LGPD" — o tema está distribuído no §5.3 deste resumo, nos riscos transversais do doc 07 (§6), nas observações do doc 09 e na Fase 18 do doc 12.*

---

*Fim do resumo executivo. Nenhum arquivo do repositório foi alterado por esta auditoria além dos documentos da pasta `docs/auditoria/`.*
