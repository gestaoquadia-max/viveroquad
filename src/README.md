# src/ — o fonte do protótipo, em 20 partes

O protótipo é UM documento HTML. As partes deste diretório são **fatias
contíguas** dele, na ordem do prefixo numérico (`01-…` a `20-…`): o build
(`build.py` ou `build.ps1`) as concatena **sem acrescentar nem remover um
byte**, substitui os tokens `__*__` pelas mídias em base64 e gera
`artifact.html` e `index.html`.

## Regras de ouro

1. **Edite as partes; nunca edite `index.html`/`artifact.html`** (são saída
   de build, não versionadas).
2. **Nenhuma parte é HTML/CSS/JS válido sozinha.** O `<style>` abre na
   parte 01 e fecha na 02; o layout abre na 03 e fecha na 06; o
   `<script>` com o IIFE abre na 07 e só fecha na 20. **Não** rode
   formatador, linter ou "auto-fix" em uma parte isolada — isso quebra a
   concatenação.
3. **A ordem é imutável.** O JavaScript depende da ordem de execução
   entre as partes (a cascata de inicialização fica na parte 20).
   Renomear ou reordenar partes = quebra silenciosa.
4. **Tokens de build**: os de mídia (`__FONTS__`, `__DANILO_VIDEO__`,
   `__DANILO_SPRITE__`, `__QUAD_LOGO__`, `__QUAD_SIMBOLO__`,
   `__AVATARS__`, `__INSIGNIAS__`, `__QUAD_COIN__`, `__DIAMANTE__`,
   `__FOTOS_VARIANTES__`) e os de dados demonstrativos (`__SEED_*__`,
   preenchidos pelos fragmentos de `../data/*.js` — ver `data/README.md`)
   ocupam cada um uma única linha — não os quebre nem os renomeie; o
   build falha (de propósito) se algum sumir ou sobrar.
5. Arquivos em LF, UTF-8 sem BOM; a parte 20 termina com newline final.

## O que há em cada parte

| Parte | Conteúdo |
|---|---|
| 01-css-base | Título, `__FONTS__`, temas claro/escuro, moldura `.phone`, login, portões, tutorial |
| 02-css-gamificado | CSS do redesign gamificado: herói, admin, Loja, insígnias, rankings, media queries |
| 03-html-aluno | Masthead, barra de personas e as 9 views do aluno |
| 04-html-professor | As 5 views do professor |
| 05-html-admin | As 8 views do administrador N.P.P. |
| 06-html-overlays | Overlays (prova, quizzes, compra, chat, portões, tutorial), artes vetoriais, 3 navbars |
| 07-js-estado-dados | Abertura do `<script>`/IIFE, estado global, moedas, docentes, turmas, matrículas, concursos; árvore do Domínio com o **botão de play por subassunto** (`.ed-q10`, dec. 202/203) e sem a rolagem infinita vertical do Início (dec. 201 — ficou só a roda 3D, `RODA_VIEWS`); **ledger da carteira** (`LEDGER`, `ledgerLancar`, `ledgerOp` — DA-03), **IDs internos** (`MEU_ID`, `novoId()` — DA-01) e **`matriculasArquivadas()`** (DA-06), dec. 196 |
| 08-js-eventos-cal-quiz | Eventos + página do evento, calendário do aluno, motor de quiz, aula de hoje; **recompensa de participação** (`EV_SCORE_PADRAO` = 10, `evScoreRegra`/`evCoinsRegra`/`evRegrasScore`/`evRegrasCoins`) e as duas etiquetas de tipo do carrossel — `evTemBonus` olha só para os Coins (dec. 200) |
| 09-js-professor | Gate/login do professor, painel, relatórios, quiz ao vivo com polling |
| 10-js-acesso-tutorial | Conectividade, acesso ao portal, tutorial do QUAD |
| 11-js-missoes-treinamento | Treinamento rápido, **banco por subassunto** (`QB_MODELO`/`qbEst`/`qbReordena` — pacotes de 10 com volta reorganizada pela dificuldade, dec. 204; `trAbrirSub`/`trAjSub`, dec. 202), rodízio por subassunto alternando matérias, blocos do dia por turma, simulados do aluno, avatares |
| 12-js-gamificacao-perfil | Insígnias, rankings/Quadrômetro com **perfil público por aluno** (`perfPublico`/`perfDados` — botão ao lado do nome, dec. 212), promoções, simulado digital, central de tutoriais, bloco **"Minhas turmas · ativas e arquivadas"** com a etiqueta ARQUIVADA (DA-06, dec. 196) |
| 13-js-admin-estrutura | Estrutura/Domínio, criação de turmas e isoladas, banco de professores, reset da demo (**limpa as 3 chaves `vq_*`**: `vq_tut_skip`, `vq_intro_done` e `vq_evolucao` — dec. 196) |
| 14-js-loja-economia | Loja: moedas, compras, catálogos, salas/lotações, overlay de compra, skins |
| 15-js-mochila-skins | Mochila de combate (agrupada ×N, dec. 207) com **ficha do item** (`itemFicha`/`ITEM_HIST` — origem, efeito, obtenção e valor, dec. 211), **títulos e condecorações** (`renderTitulos`/`titConceder` — área própria na mochila, concedidos por vitória, dec. 218), **Itens de Quest** (`renderLojaQuest`/`questConstruir`/`questEquipar` — construção com insumos da mochila e equipar que troca a foto, dec. 207), **sistema de DROP** (sorteio ao concluir bloco/treinamento/simulado digital e celebração `#dropLayer`, dec. 194; um item por vez, dec. 206) e cadeia de skins do personagem |
| 16-js-admin-controle | Gate N.P.P. com **`ADM_PERFIS`** — 4 perfis administrativos (`admPodeVer` filtra as abas, `admPerfilNome` assina as ações — DA-08, dec. 196) —, contas/créditos, mensagens por público, gift cards, cronograma, materiais |
| 17-js-admin-liberacoes | Eventos do admin (com os campos **Score / Quad Coins de participação**, dec. 200), pedidos/retiradas, portaria (autorizações de acesso), PDF de inscritos |
| 18-js-admin-hoje-loja | Lançamento de simulados, dificuldades por aluno, governança da Loja |
| 19-js-compras-estornos | **Carteira do aluno** (card único "Carteira · extrato e compras", dec. 197: `renderRelCompras` com os KPIs recebido/gasto/compras/a receber + `renderExtrato` do ledger, saldo de abertura `MV-00000`/`MV-00001`) e os **estornos** de 7 dias, que também lançam no extrato |
| 20-js-mercado-interno | **Minha loja** do aluno (nome, lema, anúncios com reserva da mochila, abrir/fechar, vendas) e **Mercado interno** com vitrine por loja e carrinho em Quad Coins (dec. 216), mais o **Entreposto Quad** — a loja do sistema que compra qualquer item da mochila a 1 QdC por unidade (dec. 217) |
| 21-js-relatorios-boot | Relatórios com gráficos, **persistência da evolução do aluno** (`evolSalvar`/`evolCarregar`/`evolMarcar`, chave `vq_evolucao`, debounce de 400 ms — DA-10, dec. 196), cascata de inicialização, fechamento do IIFE |

> Referências antigas a "src.html l.N" (documentos da auditoria de
> 30/07/2026) valem para o monolito original — a concatenação das partes
> na ordem reproduz aquele arquivo; para localizar um trecho hoje, use
> grep pelo nome da função/id.
