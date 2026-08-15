# data/ — os dados demonstrativos do protótipo

Cada arquivo é um **fragmento JavaScript verbatim** (a declaração `var … = …;`
original, byte a byte) que o build injeta de volta no fonte pelo token
`__SEED_<NOME>__` correspondente (ex.: `data/eventos.js` → `__SEED_EVENTOS__`
na parte `src/08-…`). Extraí-los não mudou NADA no comportamento: a saída do
build é byte-idêntica à anterior.

Regras: são fragmentos, não módulos — **sem** newline final, **sem** cabeçalho
de comentário (qualquer byte a mais entra no build); mantenha JS válido no
lugar onde o token vive; datas em `AAAA-MM-DD`.

## Conjuntos e relações

| Arquivo | Variável | Vive na parte | O que é / relações |
|---|---|---|---|
| `concursos.js` | `CONCURSOS` | 07 | Concursos com árvore de edital; `arvore` referencia os `EDITAL_*` abaixo; `id` é referenciado por `turmas-loja.js` (`concurso`) e `isoladas.js` |
| `edital-cfo.js` · `edital-soldado.js` · `edital-ppba.js` · `edital-pcba.js` | `EDITAL_*` | 07 | Árvores matéria → assunto → subassunto usadas por Domínio, Pedagógico e criação de turmas |
| `docentes.js` | `DOCENTES` | 07 | Corpo docente (nome é a CHAVE do professor em todo o app; e-mail de acesso deriva do sobrenome) |
| `turmas-loja.js` | `TURMAS_LOJA` | 07 | Turmas à venda; `sala` deve respeitar a lotação (`SALA_CAP`, no código); `concurso` → `concursos.js`; vagas POR MOEDA (Dmn/QdC) |
| `eventos.js` | `EVENTOS` | 08 | Eventos da semana (carrossel/Loja/portaria); datas fixas VENCEM no calendário real — reancorar preservando o dia da semana do rótulo `quando` (precedente: dec. 189). Todo evento traz a regra **"Participação no evento · +10 score"** (dec. 200); a chave `tag` não existe mais — o vocabulário de tipo é NA LOJA (`pago`) e +BÔNUS (tem `coins`) |
| `crono.js` | `CRONO` | 08 | Grade semanal de aulas por turma (chave = id da turma, dec. 163); professores citados deveriam existir em `docentes.js` (pendência conhecida) |
| `questions.js` | `QUESTIONS` | 08 | Banco de questões do quiz de aula do aluno |
| `qa-mult.js` · `qa-ce.js` | `QA_MULT` / `QA_CE` | 09 | Bancos do quiz ao vivo do professor (múltipla escolha / certo-errado) |
| `tr-bank.js` | `TR_BANK` | 11 | Banco do treinamento rápido (flashcards) |
| `aula-demo.js` | `AULA_DEMO` | 11 | Aula demonstrativa do tutorial |
| `simulados.js` | `SIMULADOS` | 11 | Simulados do aluno; vagas POR MOEDA; presencial vende entrada, digital premia score/QdC |
| `loja-extras.js` | `LOJA_EXTRAS` | 14 | Itens avulsos da Quad Store (ex.: Mentoria Quad, com data) |
| `itens-presenciais.js` | `ITENS_PRESENCIAIS` | 14 | Produtos físicos da recepção (estoque decrescente, dec. 170) |
| `isoladas.js` | `ISOLADAS` | 14 | Matérias isoladas (dias da semana, horário, sala, vagas) |
| `itens-combate.js` | `ITENS_COMBATE` | 15 | **7 itens** de mochila (compra repetida, dec. 172). Dois campos de DROP (dec. 194): `disp` = como o aluno obtém (`'venda'` é o padrão e pode ser omitido · `'drop'` = só por sorteio, fora da vitrine · `'ambos'` = vende e também cai) e `drop` = chance do sorteio em % (1–100). Hoje: Cantil com `disp:'ambos'`/`drop:10` e **"Patch da sorte"** (`disp:'drop'`, `preco:0`, `drop:12`), o item raro que só existe no drop — os outros 5 não têm os campos e valem como `venda` |

O que ficou **no código de propósito** (é regra/configuração, não dado de
demonstração): `GAMI` (carreira), `SALA_CAP` (lotações), `SKIN_CADEIA`/preços
de skins, `TUT` (roteiro do tutorial), `GIFT_LOTES` (nasce vazio — é estado).
