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
4. **Tokens de build** (`__FONTS__`, `__DANILO_VIDEO__`,
   `__DANILO_SPRITE__`, `__QUAD_LOGO__`, `__QUAD_SIMBOLO__`,
   `__AVATARS__`, `__INSIGNIAS__`, `__QUAD_COIN__`, `__DIAMANTE__`,
   `__FOTOS_VARIANTES__`) ocupam cada um uma única linha — não os quebre
   nem os renomeie; o build falha (de propósito) se algum sumir.
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
| 07-js-estado-dados | Abertura do `<script>`/IIFE, estado global, moedas, docentes, turmas, matrículas, concursos |
| 08-js-eventos-cal-quiz | Eventos + página do evento, calendário do aluno, motor de quiz, aula de hoje |
| 09-js-professor | Gate/login do professor, painel, relatórios, quiz ao vivo com polling |
| 10-js-acesso-tutorial | Conectividade, acesso ao portal, tutorial do QUAD |
| 11-js-missoes-treinamento | Treinamento rápido, blocos do dia por turma, simulados do aluno, avatares |
| 12-js-gamificacao-perfil | Insígnias, rankings/Quadrômetro, promoções, simulado digital, central de tutoriais |
| 13-js-admin-estrutura | Estrutura/Domínio, criação de turmas e isoladas, banco de professores, reset da demo |
| 14-js-loja-economia | Loja: moedas, compras, catálogos, salas/lotações, overlay de compra, skins |
| 15-js-mochila-skins | Mochila de combate e cadeia de skins do personagem |
| 16-js-admin-controle | Gate N.P.P., contas/créditos, mensagens por público, gift cards, cronograma, materiais |
| 17-js-admin-liberacoes | Eventos do admin, pedidos/retiradas, portaria (autorizações de acesso), PDF de inscritos |
| 18-js-admin-hoje-loja | Lançamento de simulados, dificuldades por aluno, governança da Loja |
| 19-js-compras-estornos | Relatório de compras e estornos de 7 dias (lado do aluno) |
| 20-js-relatorios-boot | Relatórios com gráficos, cascata de inicialização, fechamento do IIFE |

> Referências antigas a "src.html l.N" (documentos da auditoria de
> 30/07/2026) valem para o monolito original — a concatenação das partes
> na ordem reproduz aquele arquivo; para localizar um trecho hoje, use
> grep pelo nome da função/id.
