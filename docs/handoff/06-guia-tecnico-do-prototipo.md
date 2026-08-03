# 06 — Guia técnico do protótipo

**Handoff "Viver o Quad" · documento 06 · 02/08/2026**
**Para:** o engenheiro que vai rodar, inspecionar e usar o protótipo como referência de especificação.
**Fontes:** repositório `/home/user/viveroquad` (estado de 02/08/2026, verificado por `ls`/leitura direta), `README.md`, `src/README.md`, `data/README.md`, `tests/README.md`, `build.py`, `verify.py`, `docs/auditoria/01` e `13`, `docs/02-registro-de-decisoes.md` (dec. 182–194).

> **Revisão de 03/08/2026** — o guia foi escrito contra o estado de 02/08 (dec. 1–191). As decisões **192–194** da mesma data foram incorporadas: 57 suítes (nova `vv1.mjs`), 35 hooks `window.__*` (novos `__dropRng`, `__dropSortear`, `__calRefresh`, `__estRefresh`) e o sistema de DROP na parte 15.

> O protótipo é uma **demonstração navegável** (V0 "Prova de Vida"), 100% local no navegador — não é sistema de produção. Este guia diz como executá-lo, como ele é construído, onde cada coisa vive e como usá-lo sem se enganar sobre o que ele é.

---

## 1. Estrutura do repositório (árvore real, conferida)

```
viveroquad/
├── src/                            ← FONTE do protótipo em 20 partes contíguas (01-…20-…)
│   └── README.md                   ← tabela das partes e regras de ouro de edição
├── data/                           ← 19 fragmentos JS verbatim (dados demo, tokens __SEED_*__)
│   └── README.md                   ← o que é cada conjunto e as relações entre eles
├── tests/                          ← 57 suítes de regressão Playwright (rede de segurança)
│   ├── run.sh                      ← runner (./run.sh [suíte…]); saídas em _out/ (fora do git)
│   └── README.md                   ← requisitos, famílias de suítes e regras de manutenção
├── verify.py                       ← portão de verificação: build + regressão completa
├── build.py                        ← build portátil (Python 3) — gera index.html e artifact.html
├── build.ps1                       ← build no Windows (PowerShell) — mesmas validações
├── fonts.css                       ← fontes embutidas (token __FONTS__)
├── logo.jpg                        ← logo Quad (__QUAD_LOGO__)
├── simbolo-quad-transparente.png   ← símbolo Quad (__QUAD_SIMBOLO__)
├── danilo.mp4                      ← vídeo 3D do mascote QUAD (__DANILO_VIDEO__)
├── danilo-sprite.png               ← sprite do mascote, 7 poses (__DANILO_SPRITE__)
├── avatars.jpg                     ← sprite 6×2 dos 12 avatares PM (__AVATARS__)
├── insignias.jpg                   ← sprite das insígnias de patente (__INSIGNIAS__)
├── quad-coin.webp / diamante.webp  ← moedas (__QUAD_COIN__ / __DIAMANTE__)
├── fotos/                          ← 84 fotos do personagem: 7 variantes × 12 (__FOTOS_VARIANTES__)
├── docs/
│   ├── 00–03 + PDF rev. 2.3        ← documentos de entrada, decisões (1–194), guia de build
│   ├── arquitetura/                ← Consolidação Arquitetural v1.0 (01/08) — documento oficial
│   ├── auditoria/                  ← auditoria de 30/07 (14 docs, anotados em 01/08)
│   └── handoff/                    ← este pacote de handoff
├── CHANGELOG.md                    ← histórico (116+ entradas, uma por rodada)
├── index.html                      ← SAÍDA do build (~9,4 MB — abre com duplo clique; não versionada)
└── artifact.html                   ← SAÍDA do build (~9,4 MB — conteúdo publicado no Artefato)
```

Os arquivos do mascote chamam-se `danilo.*` por razão histórica — o guia do app é o **QUAD**.

## 2. Como executar

Pré-requisitos: navegador + Python 3 (ou PowerShell no Windows). **Sem npm, sem servidor, sem banco, sem rede** — o protótipo roda 100% offline.

1. **Clonar** o repositório.
2. **Buildar** — escolha um (equivalentes em validação desde 01/08, dec. 187):
   - `python3 build.py` — portátil, roda de qualquer diretório;
   - `.\build.ps1` — Windows/PowerShell.
3. **Abrir `index.html`** com clique duplo. Pronto.

### Credenciais de demonstração

| Persona | Como entrar |
|---|---|
| **Aluno** | Qualquer e-mail contendo `@` + qualquer senha não vazia (não há validação real) |
| **Professor** | `moura@quadconcursos.com.br` / `quad1234` (e-mail derivado do sobrenome do 1º docente ativo; a nota do próprio gate imprime o e-mail vigente) |
| **Admin N.P.P.** | `npp@quadconcursos.com.br` / chave `NPP-2026` (case-insensitive) |

> **Nota (divergência registrada):** o gate do admin **valida somente a chave** — qualquer e-mail com `@` entra; o `npp@…` é apenas placeholder. Divergência conhecida da auditoria (docs 10/13), reconfirmada nos dossiês do handoff.

O 1º acesso do aluno dispara o tutorial obrigatório de 29 passos (botão "‹ Pular" disponível; a flag `vq_tut_skip` no localStorage também pula). O botão "Resetar demonstração (dispositivo)" (painel lateral) **não limpa `vq_intro_done`** — bug conhecido, mantido de propósito (dec. 188).

## 3. Como verificar

```sh
python3 verify.py            # build + as 57 suítes de regressão
python3 verify.py vtut vloja # build + só as suítes citadas
```

`verify.py` só sai com código 0 se o build passar **e** nenhuma suíte falhar — é o **portão de aceite oficial** do repositório (dec. 190): *nenhuma mudança no fonte é boa sem a regressão verde*.

Requisitos das suítes: **Node 20+, Playwright e um Chromium**. Os caminhos padrão de `tests/run.sh` são os do ambiente original; troque por variável de ambiente:

| Variável | Aponta para |
|---|---|
| `VQ_NODE` | binário do Node |
| `VQ_PW` | instalação do Playwright |
| `VQ_CHROME` | binário do Chromium |

## 4. Como o build funciona

O protótipo é **um único documento HTML**. O build (`build.py`/`build.ps1`):

1. **Concatena as 20 partes** de `src/` na ordem do prefixo numérico, **sem acrescentar nem remover um byte** (aborta se não achar exatamente 20 partes);
2. **Substitui os tokens** de mídia (`__FONTS__`, `__DANILO_VIDEO__`, `__DANILO_SPRITE__`, `__QUAD_LOGO__`, `__QUAD_SIMBOLO__`, `__AVATARS__`, `__INSIGNIAS__`, `__QUAD_COIN__`, `__DIAMANTE__`, `__FOTOS_VARIANTES__`) por data-URIs base64 e os tokens de dados (`__SEED_*__`) pelos 19 fragmentos de `data/*.js`, verbatim;
3. **Valida token ausente E token que sobrou** — aborta com mensagem clara em ambos os casos (de propósito: impossível publicar HTML com `__TOKEN__` cru);
4. **Gera as saídas**: `artifact.html` (sem esqueleto `<html>` — o Artefato embrulha ao publicar) e `index.html` (com esqueleto — abre com duplo clique).

**Regra inegociável: nunca edite `index.html`/`artifact.html`** — são saída de build, não versionadas (`.gitignore`); toda alteração é feita nas partes de `src/` e regenerada.

## 5. `src/` — o fonte em 20 partes

As partes são **fatias contíguas** de um documento único; nenhuma é HTML/CSS/JS válida sozinha. Regras de ouro (de `src/README.md` — leia antes da primeira edição):

1. Edite as partes; nunca as saídas de build.
2. O `<style>` abre na parte 01 e fecha na 02; o layout abre na 03 e fecha na 06; o `<script>` com o IIFE abre na 07 e **só fecha na 20**. **Não rode formatador, linter ou "auto-fix" numa parte isolada** — quebra a concatenação.
3. **A ordem é imutável** — o JS depende da ordem de execução (a cascata de inicialização fica na parte 20). Renomear/reordenar = quebra silenciosa.
4. Tokens `__*__` ocupam uma linha cada; não quebre nem renomeie (o build falha se algum sumir ou sobrar).
5. Arquivos em LF, UTF-8 sem BOM; a parte 20 termina com newline final.

### Áreas principais do código (parte → conteúdo)

| Parte | Conteúdo |
|---|---|
| 01-css-base | Título, `__FONTS__`, temas claro/escuro, moldura `.phone`, login, portões, tutorial |
| 02-css-gamificado | CSS do redesign gamificado: herói, admin, Loja, insígnias, rankings, media queries |
| 03-html-aluno | Masthead, barra de personas e as 9 views do aluno |
| 04-html-professor | As 5 views do professor |
| 05-html-admin | As 8 views do administrador N.P.P. |
| 06-html-overlays | Overlays (prova, quizzes, compra, chat, portões, tutorial), artes vetoriais, 3 navbars |
| 07-js-estado-dados | Abertura do `<script>`/IIFE, estado global, moedas, docentes, turmas, matrículas, concursos |
| 08-js-eventos-cal-quiz | Eventos + página do evento, calendário do aluno, motor de quiz, aula de hoje |
| 09-js-professor | Gate/login do professor, painel, relatórios, quiz ao vivo com polling |
| 10-js-acesso-tutorial | Conectividade, acesso ao portal, tutorial do QUAD |
| 11-js-missoes-treinamento | Treinamento rápido, blocos do dia por turma, simulados do aluno, avatares |
| 12-js-gamificacao-perfil | Insígnias, rankings/Quadrômetro, promoções, simulado digital, central de tutoriais |
| 13-js-admin-estrutura | Estrutura/Domínio, criação de turmas e isoladas, banco de professores, reset da demo |
| 14-js-loja-economia | Loja: moedas, compras, catálogos, salas/lotações, overlay de compra, skins |
| 15-js-mochila-skins | Mochila de combate, **sistema de DROP** (sorteio, celebração `#dropLayer`) e cadeia de skins do personagem |
| 16-js-admin-controle | Gate N.P.P., contas/créditos, mensagens por público, gift cards, cronograma, materiais |
| 17-js-admin-liberacoes | Eventos do admin, pedidos/retiradas, portaria (autorizações de acesso), PDF de inscritos |
| 18-js-admin-hoje-loja | Lançamento de simulados, dificuldades por aluno, governança da Loja |
| 19-js-compras-estornos | Relatório de compras e estornos de 7 dias (lado do aluno) |
| 20-js-relatorios-boot | Relatórios com gráficos, cascata de inicialização, fechamento do IIFE |

Referências antigas "src.html l.N" (docs da auditoria) valem para o monolito de 30/07 — a concatenação das partes o reproduz; para localizar um trecho hoje, use **grep pelo nome da função/id**.

## 6. `data/` — os 19 fragmentos de dados demonstrativos

Cada arquivo é um **fragmento JavaScript verbatim** (a declaração `var … = …;` original, **byte a byte**) que o build injeta pelo token `__SEED_<NOME>__` correspondente (ex.: `data/eventos.js` → `__SEED_EVENTOS__` na parte 08). A extração (dec. 191) foi comprovadamente **byte-idêntica** na saída do build.

Regras: são fragmentos, não módulos — **sem** newline final, **sem** cabeçalho de comentário (qualquer byte a mais entra no build); mantenha JS válido no lugar onde o token vive; datas em `AAAA-MM-DD`. Conjuntos: `concursos`, 4 `edital-*`, `docentes`, `turmas-loja`, `eventos`, `crono`, `questions`, `qa-mult`/`qa-ce`, `tr-bank`, `aula-demo`, `simulados`, `loja-extras`, `itens-presenciais`, `isoladas`, `itens-combate` — relações completas em `data/README.md`. Cuidados:

- **Datas fixas vencem** no calendário real e esvaziam a demo — reancorar preservando o dia da semana do rótulo (precedente: dec. 189, eventos +8 semanas).
- O que é **regra/configuração ficou no código de propósito**: `GAMI` (carreira), `SALA_CAP` (lotações), `SKIN_CADEIA`, `TUT` (roteiro do tutorial), `GIFT_LOTES` (estado, nasce vazio).

## 7. `tests/` — a rede de segurança

57 suítes Playwright headless, construídas junto com o produto, que verificam o comportamento de ponta a ponta (aluno, professor, admin). São o **critério de aceite oficial**. Regras de manutenção (de `tests/README.md`):

1. **Suíte quebrou?** Primeiro pergunte se ela mede o comportamento vigente. Regra mudou por decisão registrada → a suíte acompanha (decisão citada no commit). Regra não mudou → **o código regrediu; conserte o código, nunca afrouxe a suíte**.
2. **Datas**: suítes que criam turmas/eventos usam datas futuras; ao vencerem, reancore (dec. 189). As suítes de "aula de hoje" (`vaula*`) usam **relógio simulado** e não vencem.
3. As suítes conversam com o protótipo pelos **35 ganchos `window.__*`** do fonte (`__mat`, `__turmaAtiva`, `__eventos`, `__evLotar`, `__noite`, `__introFeita`, `__simDig`… mais os 4 acrescentados pelas dec. 192/194: `__dropRng` — RNG determinístico do drop —, `__dropSortear`, `__calRefresh` e `__estRefresh`) — **contrato estável**: não remova um gancho sem atualizar o README dos testes.
4. Screenshots/artefatos caem em `tests/_out/` (fora do git).

## 8. Arquivos gerados (nunca editar, nunca versionar)

- `index.html` (~9,4 MB) — protótipo local completo, esqueleto HTML incluído.
- `artifact.html` (~9,4 MB) — mesmo conteúdo sem esqueleto, para publicação como Artefato no claude.ai (republicar a **cada** alteração é regra do projeto — `docs/03-guia-de-build-e-publicacao.md`).
- `tests/_out/` — artefatos de execução das suítes.

Todos regeneráveis: `python3 build.py`.

## 9. Como localizar cada módulo da especificação

A especificação funcional deste handoff (documento 03) descreve o produto em **17 módulos (M1–M17)**. A tabela abaixo mapeia cada módulo para onde ele vive no código, quais dados demo o alimentam e quais suítes o cobrem (com base nos dossiês de investigação do handoff):

| Módulo | Partes de `src/` | Dados (`data/`) | Suítes relevantes |
|---|---|---|---|
| M1 Entrada, cadastro e autenticação | 06 (login/gates), 07, 09 (gate prof), 10 (acesso), 13 (queda de sessão do prof), 16 (gate N.P.P.) | `docentes` | `vacesso`, `vfb`/`vfe` (queda de sessão) |
| M2 Tutorial, identidade e personagem | 10 (roteiro `TUT`), 11 (Introdução/pular), 03 (Perfil), 06 (`tutLayer`) | — (roteiro/avatares no código e tokens de mídia) | `vtut`, `vacesso` |
| M3 Conta, matrículas e turma ativa | 07 (`MATRICULAS`/`definirTurmaAtiva`), 12 (UI de troca), 14 (compra de turma) | `turmas-loja`, `concursos` | `vturma`, `vfase*`, `vt1`/`vq1`/`vr1` |
| M4 Tela inicial e cronograma | 08 (aula de hoje, eventos, calendário), 16 (avisos/crono/materiais do admin), 03 | `crono`, `eventos`, `turmas-loja` | `vaula` (relógio simulado), `vhome`, `vevento` |
| M5 Missões e treinamento | 11 (blocos, TR, recompensa da noite), 15 (drop ao fim do bloco) | `tr-bank`, `aula-demo`, `itens-combate` | `vtr`, `vbonus`, `vfc`, `vfase*`, `vv1` (drop) |
| M6 Questões, quiz e banco de questões | 08 (motor órfão `QUESTIONS`), 09 (quiz da aula), 12 (simulado digital), 05/13 (banco admin, stub) | `questions`, `qa-mult`, `qa-ce`, `simulados` | `vsim`, `vaula`, `vprofev` |
| M7 Score, moedas e progressão | 07 (`GAMI`/carteiras), 12 (prova, insígnias, rankings, Quadrômetro, Domínio) | — (`GAMI` no código); editais p/ Domínio | `vgami`, `vprova`, `vrank`, `vperfil`, `vbonus` |
| M8 Loja e produtos (Quad Store) | 14 (vitrine/compra, criador com `disp`/`drop`), 15 (skins/mochila/drop), 03, 06 (`#dropLayer`) | `turmas-loja`, `isoladas`, `itens-presenciais`, `itens-combate`, `loja-extras`, `simulados`, `eventos` | `vloja`/`vloja2`/`vloja3`, `vmochila`, `vdmn`, `vv1` (drop/vitrine) |
| M9 Gift cards e carteira | 07 (resgate), 16 (lotes/QR/crédito manual) | — (`GIFT_CARDS`/`GIFT_LOTES` no código) | `vdmn`, `vg1`–`vg3`, `vcontrole` |
| M10 Compras, matrículas e estornos | 14 (log/estorno), 19 (janela de estorno e relatório de compras do aluno), 17 (consumo: portaria/entrega), 18 (`semEstorno` no log), 16 | `itens-presenciais`, `turmas-loja`, `simulados` | `vloja*`, `vevento`, `vu1` (portaria), `vv1` (tutorial/evento realizado) |
| M11 Eventos | 08 (carrossel/página/compra, calendário CONCLUÍDO/FALTOSO), 17 (criação, salas, portaria, PDF) | `eventos` | `vevento`, `vprofev`, `vu1`, `vv1` (status no calendário) |
| M12 Simulados | 18 (lançamento), 11 (vitrine/calendário do aluno), 12 (quiz digital + drop ao concluir), 17 (recepção) | `simulados` (+ `tr-bank`/`aula-demo` no digital; `itens-combate` no drop) | `vsim`, `vv1` (drop do digital) |
| M13 Materiais | 16 (publicação e lista do aluno) | — (sementes no código; árvores via `concursos`) | `vinterno`, suítes formais da rodada (`v[h-u]1`) |
| M14 Inteligência pedagógica | 07 (Domínio/hash), 11 (`trAj`), 18 (dificuldades/apoio), 20 (relatórios) | `edital-cfo`/`-soldado`/`-ppba`/`-pcba`, `concursos` | `vdmn` (Domínio), `vrelatorios` |
| M15 Área do professor | 04, 09 (painel/quiz ao vivo), 13 (`checarAcessoProf`) | `docentes`, `qa-mult`, `qa-ce`, `crono` | `vprofev`, `vaula`, `vfb`/`vfe` |
| M16 Área administrativa (N.P.P.) | 05, 13, 16, 17, 18, 20 | praticamente todos os conjuntos | `vadmin`, `vinterno`, `vcontrole`, `vestrutura`, `vrelatorios`, `vk1`, `vu1` |
| M17 Funcionalidades futuras (prévias) | 06 (botões bloqueados do "+", roadmap), 05, 04 | — (só texto) | `vplus` |

Para achar uma função específica: `grep -rn "nomeDaFuncao" src/` — os dossiês do handoff e a auditoria citam as funções-âncora de cada fluxo.

## 10. Limitações técnicas (aceitas na V0)

- **Monólito num IIFE único**: ~8.000 linhas de JS acopladas (partes 07–20 atuais de `src/`), sem `use strict`, sem módulos, sem framework; as 3 personas compartilham o mesmo estado (é isso que produz o "tempo real" da demo).
- **~200 variáveis globais** de nível superior dentro do IIFE (`TURMAS_LOJA`, `MATRICULAS`, `QUIZZES`, `COMPRAS`…); armadilha de nomenclatura: **`var score` guarda Quad Coins**, não o score de carreira.
- **Render por `innerHTML` com strings** (≈187 pontos contra 17 `createElement`) — sem componentes, sem virtual DOM.
- **Nada persiste**: recarregar (F5) zera moedas, compras, matrículas, carreira; só 2 chaves de localStorage sobrevivem (`vq_tut_skip`, `vq_intro_done`).
- **~9,4 MB por saída**: mídias em base64 (+33%), sem streaming/cache granular — o navegador engole tudo antes do primeiro paint.
- **35 hooks `window.__*` expostos** no artefato publicado (contrato das suítes) + gabaritos das questões nos objetos JS do cliente.
- Miudezas conhecidas: view `v-pretaf` órfã, `#connToggle` inexistente, motor `QUESTIONS` sem porta de entrada, botão `[DEMO PROVISÓRIO]` de patente.

## 11. Riscos atuais (segurança e LGPD)

A **dec. 186** registra os riscos de segurança da auditoria de 30/07 como **pendências para a fase de desenvolvimento — nenhuma solução foi implementada**. Em resumo (detalhe em `docs/auditoria/01` §8 e `13` §7):

- **Autenticação apenas visual**: gates de professor/admin são overlays JS com credenciais demo impressas na própria tela; removíveis por DevTools. Qualquer autorização real depende de back-end.
- **Falsificação trivial pelo console**: hooks `window.__*` (ex.: `__noite.concluirTudo()`, `__evLotar`) e gabaritos embarcados permitem forjar score, compras, presença e lotação em qualquer sessão. Aceitável **só** enquanto os dados são fictícios; bloqueante em qualquer versão com dado real (pendência: build separado dev/prod sem hooks).
- **LGPD**: todos os dados pessoais do protótipo (nomes, telefones, e-mails de `DB_ALUNO`, `DOCENTES`, `CONTAS`) são **fictícios** — nenhum dado real deve entrar no protótipo nem nos seeds de `data/`. Retenção/eliminação de dados, privacidade do ranking (top 10 sempre visível, sem opt-out) e o controle de acesso real a materiais são perguntas abertas registradas na auditoria (docs 06/13) que a implementação real terá de responder.

## 12. Como usar o protótipo como referência (e como NÃO usar)

O valor do protótipo está nas **regras e nas telas, não na estrutura do código** (avaliação completa em `docs/auditoria/11-avaliacao-de-reaproveitamento.md`). Método recomendado:

1. **Leia a especificação funcional** (documento 03 deste handoff, módulos M1–M17) — ela é o texto; o protótipo é a demonstração viva dele.
2. **Abra o protótipo lado a lado**: para cada módulo da especificação, execute o fluxo correspondente nas 3 personas (a tabela do §9 diz onde cada coisa vive). O protótipo é a **especificação executável** das regras de negócio — estorno desfaz posse de verdade, choque de agenda cruza agendas reais, vagas esgotam por moeda.
3. **Use as 57 suítes como critério de aceite comportamental**: cada suíte codifica o comportamento esperado de um fluxo (com as decisões que o fundamentam). Ao construir o sistema real, elas são o roteiro de QA mais preciso que existe do produto — e a regra vale nos dois sentidos: comportamento divergente da suíte é regressão, salvo decisão registrada.
4. **NÃO copie o código como arquitetura.** O documento único, o IIFE, o estado global compartilhado, o `innerHTML`, a "autenticação" e o "tempo real" por polling local são artifícios de demonstração — a auditoria (docs 11/13) é explícita: autenticação/RBAC, carteiras com ledger, matrículas, estoque/vagas atômicos, quiz ao vivo real, telemetria, rankings, mensageria e persistência devem ser **reconstruídos, não migrados**. O que se aproveita: as regras (RN-01–RN-61 do doc 05), o roteiro do tutorial e o microcopy, a parametrização `GAMI`, as árvores de edital, o CSS/design system como referência visual e os fluxos validados.

Antes de codificar qualquer coisa: `docs/arquitetura/00-arquitetura-oficial.md` (a premissa vigente — plataforma principal, 11 módulos internos, dec. 182–184) e `docs/auditoria/10` (divergências abertas). Regras econômicas seguem **indefinidas** (dec. 185) — nenhum valor de preço/recompensa da demo é especificação.
