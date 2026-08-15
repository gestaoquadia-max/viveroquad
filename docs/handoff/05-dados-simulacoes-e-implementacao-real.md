# 05 — Dados, simulações e implementação real

**Data:** 02/08/2026
**Série:** Handoff "Viver o Quad" — fonte de verdade: o protótipo executado (`index.html`, gerado das 20 partes de `src/` + seeds de `data/`)
**Fontes:** dossiês de investigação A–F (02/08/2026, sondas Playwright todas verdes); `docs/auditoria/06-dados-locais-e-persistencia.md`; `data/README.md`; `docs/auditoria/09-integracoes-futuras.md`; `docs/arquitetura/00-arquitetura-oficial.md` (Consolidação v1.0, documento que prevalece)

> Este documento separa, camada por camada, **o que o protótipo tem de dado e de mecânica**: o que é regra que vive no código, o que é dado de demonstração, o que é estado volátil, o que é simulação declarada, o que é só fachada visual — e, do outro lado, o que a aplicação real deve **reproduzir**, **persistir**, **validar no servidor** e **integrar com terceiros**. Nada aqui modela banco de dados nem inventa regra econômica (proibições expressas da arquitetura oficial, seções 5 e 8).

Rótulos usados (vocabulário do projeto): **FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO** · **SIMULAÇÃO LOCAL** · **REGRA DE PRODUTO CONFIRMADA** · **DADO DEMONSTRATIVO** · **DECISÃO POSTERIOR** · **FUNCIONALIDADE PLANEJADA** · **DIVERGÊNCIA** · **PERGUNTA PENDENTE**.

---

## 1. Dados estáticos de configuração/regra que vivem no código

Quando os seeds foram extraídos para `data/` (dec. 191, build byte-idêntico), um pequeno conjunto ficou **no código de propósito** — porque é **regra ou configuração do produto**, não dado de demonstração (`data/README.md`, rodapé):

| Estrutura | Onde vive | O que é | Por que ficou no código |
|---|---|---|---|
| `GAMI` | `src/07` l.11–37 | Configuração central da carreira: 14 patentes (AL SD 900 pts → CEL), 4 fases com `notaMin` 0,70–0,85, `provaQuestoes: 20`, `tentativaHoras: 24` | É a **parametrização da gamificação**, não catálogo; o comentário do fonte diz "o admin ajustará no sistema real". Pendência declarada: `PROVA_APROV = 0.80` fixa (src/12 l.332) e as `notaMin` por fase **nunca são lidas** (src/07 l.7–9) — DIVERGÊNCIA registrada |
| `SALA_CAP` (+ `SALAS`/`ESTUDIO`) | `src/14` l.248 | Lotações físicas da sede: Sala 1=155, 2=85, 3=125, 4=185 + Estúdio | É **infraestrutura física**, usada como regra em lotação de eventos (dec. 179), validação de vagas de turma/simulado e choque de agenda. No real vira cadastro administrável (Ficha 16 da auditoria: DECISÃO TÉCNICA PENDENTE) |
| Cadeia de skins (`SKIN_CADEIA`/`SKIN_FARDAS` + preços) | `src/15` | Progressão gandola → capa de colete → fuzil (60/120/200/500 QdC…) e fardas finais de escolha única (CIPE 500 / PATAMO 750 / BOPE 1300) | É a **regra de progressão do personagem** ("um elo por vez", "quem possui, veste" — dec. 25), não vitrine; os **preços** são DADO DEMONSTRATIVO (dec. 185) |
| Roteiro `TUT` (+ `GESTOS`, `TUT_PALAVROES`; `TUT_REW` declarado em `src/11` l.653) | `src/10` l.181–274 | Os 29 passos da Instrução do QUAD, gestos do mascote, filtro de palavrões do nome de guerra, recompensa 30 score/25 QdC | É o **roteiro da experiência aprovada** do onboarding (dec. 7/17/105) — conteúdo de produto, coberto pela suíte `tests/vtut.mjs` como critério de aceite. Os valores 30/25/20 são calibração de demo (dec. 185) |
| `GIFT_LOTES` | `src/07` l.109 (declaração; operado pelo Painel de controle em `src/16`) | Nasce **vazio** — lotes são criados em runtime pelo admin | É **estado**, não seed: não há o que extrair para `data/` |

Também vivem no código, pela mesma lógica: `MODALIDADES` (nivelamento/regular/questões — RONDESP/PATAMO/BOPE são apelidos, dec. 138), `INSIG_MAP` (14 patentes → 10 artes, dec. 15/16), `TR_REW`/`DIA_EXPIRA_DIAS` (regras dos blocos: +1 score/acerto, +5 QdC/bloco, expiração em 7 dias) e `PROVA_APROV`. **Regra geral do produto:** mecânicas são REGRA DE PRODUTO CONFIRMADA; todos os **números econômicos são placeholders** — a dec. 185 mantém as regras econômicas INDEFINIDAS e a arquitetura oficial (seção 5) **proíbe inventá-las**.

---

## 2. Dados demonstrativos em `data/` — os 19 conjuntos

Cada arquivo é um fragmento JavaScript **verbatim** reinjetado no build pelo token `__SEED_<NOME>__` (`data/README.md`). Tudo abaixo é DADO DEMONSTRATIVO: cenografia que exercita mecânicas reais.

| Conjunto (variável) | O que demonstra no protótipo | O que vira no produto real |
|---|---|---|
| `concursos.js` (`CONCURSOS`) | 6 concursos com situação e árvore de edital; `id` referenciado por turmas e isoladas | Cadastro real de concursos/editais (Módulos Banco de Questões + Administração), criado pelo lançamento de edital com curadoria |
| `edital-cfo.js` (`EDITAL_CFO`) | Árvore CFO PM-BA **completa** (13 matérias — conteúdo real transcrito) que comanda Domínio, treino e criação de turmas | Árvore versionada publicada pelo lançamento/retificação real de edital (parse de PDF + revisão humana — Ficha 22) |
| `edital-soldado.js` · `edital-ppba.js` · `edital-pcba.js` (`EDITAL_*`) | Árvores compactas de exemplo ("a árvore real entra pelo lançamento do edital — [INTEGRAÇÃO REAL]") | Idem: árvores reais completas por concurso |
| `docentes.js` (`DOCENTES`) | 6 professores com matérias/turnos/graduação/telefone e flags desligado/bloqueado; o **nome é a chave** de todo o app | Cadastro real de corpo docente com **ID estável** (nome deixa de ser chave primária — limitação autodeclarada no código), credenciais no serviço de identidade |
| `turmas-loja.js` (`TURMAS_LOJA`) | 5 turmas à venda com preço e **vagas por moeda** (dec. 155), sala, turno, concurso, período | Catálogo real de turmas (Módulos Matrículas + Loja + Administração); vagas decrementadas por transação no servidor |
| `eventos.js` (`EVENTOS`) | 7 eventos-semente (datas reancoradas +8 semanas, dec. 189) com regras de score/coins por evento | Cadastro real de eventos do Quad; datas reais (fim da reancoragem manual); crédito real das regras publicadas |
| `crono.js` (`CRONO`) | Snapshot da "Semana 30" (3 turmas × 2 tempos × 5 dias), chaveado por id de turma (dec. 163) | Cronograma real do Módulo Cronogramas (hoje a fonte declarada é a planilha da coordenação); professores referenciados **por ID** — a grade-semente cita ~10 professores que não existem em `DOCENTES` (DIVERGÊNCIA conhecida) |
| `questions.js` (`QUESTIONS`) | 3 questões do motor genérico de quiz — motor hoje **órfão** (sem porta de entrada na UI; dossiê B, M6) | Banco central de questões real — ou remoção do motor (PERGUNTA PENDENTE registrada) |
| `qa-mult.js` (`QA_MULT`) | 10 questões de múltipla escolha que "fingem" ser a extração do PDF do quiz ao vivo | Questões extraídas de verdade do PDF do professor / servidas pelo banco central |
| `qa-ce.js` (`QA_CE`) | 11 itens certo/errado do mesmo quiz ao vivo | Idem |
| `tr-bank.js` (`TR_BANK`) | ~60 flashcards `fc(matéria, assunto, gabarito, texto, comentário)` do Treinamento Rápido; também é o **pool da prova de promoção** e do simulado digital | Banco real de cartas alimentado pelo pipeline aula → PDFs do operador; gabarito **fora do cliente** em tudo que pontua |
| `aula-demo.js` (`AULA_DEMO`) | 40 certo/errado de UMA aula ("Poderes administrativos") — a fatia "PDF 01" da revisão espaçada | Produção real por aula (2 PDFs por aula, papel do operador) com agendamento D0/D+1/D+7/D+30 de verdade |
| `simulados.js` (`SIMULADOS`) | 3 simulados-semente (2 presenciais pagos com vagas por moeda + 1 digital gratuito) | Lançamentos reais do Módulo Simulados; aplicação/correção reais; sementes sem `dataISO`/sala (que escapam do controle de salas) deixam de existir |
| `loja-extras.js` (`LOJA_EXTRAS`) | Itens avulsos da Quad Store (ex.: Mentoria Quad com data que entra na agenda) | Catálogo real de produtos/serviços cadastrados pelo admin |
| `itens-presenciais.js` (`ITENS_PRESENCIAIS`) | 8 produtos físicos com estoque decrescente (dec. 170) e retirada na recepção | Estoque real conciliado (recepção/ERP) com baixa transacional |
| `isoladas.js` (`ISOLADAS`) | 3 matérias isoladas (dias, horário, sala, vagas) que viram evento recorrente ao comprar | Catálogo real de isoladas do Módulo Matrículas/Loja |
| `itens-combate.js` (`ITENS_COMBATE`) | 7 itens de mochila (sempre QdC, recompra livre — dec. 172); desde a dec. 194 cada item traz `disp` (`venda` — padrão quando o campo não existe — `drop` ou `ambos`) e `drop` (chance %): o Cantil é `ambos` (10%) e o "Patch da sorte" é `drop` puro (preço 0, 12%), fora da vitrine | Catálogo real do inventário do jogador (base do DROP e das Quests/forja planejadas) |

*(19 arquivos: 15 conjuntos + as 4 árvores de edital.)* Manutenção conhecida dos seeds: **datas fixas vencem no calendário real** — eventos foram reancorados uma vez (dec. 189) e o `crono.js` não foi; a recomendação registrada é datas relativas enquanto o protótipo viver.

---

## 3. Estados locais em memória — o que o F5 apaga (e o que passou a sobreviver)

**Praticamente todos os dados de negócio vivem em variáveis JS dentro da IIFE única** (auditoria 06, §1). Um recarregamento (F5) reexecuta a IIFE e devolve **quase** tudo ao estado-semente.

> **Mudança de 03/08 (dec. 196 — DA-10):** a evolução do aluno passou a ser gravada no `localStorage` (chave `vq_evolucao`). **Sobrevivem ao F5**: Quad Coins, Diamantes, os três acumuladores de carreira, mochila, skins/itens possuídos (`lojaOwned`), avatar, nome de guerra, turma ativa (`turmaAtivaId`), o ajuste do Domínio (`trAj`) e os **60 últimos lançamentos** do extrato (`LEDGER`). Ver §4.

**Continua evaporando no F5** (auditoria 06, §5 — reconferido no código em 03/08):

- **Compras e pós-venda:** log de compras (`COMPRAS`), pedidos de retirada (`PEDIDOS`), estornos (`ESTORNOS`), créditos manuais (`CREDITOS`), agenda de produtos com data (`PROD_AGENDA`).
- **Vida acadêmica:** matrículas **compradas na sessão** (`MATRICULAS` volta às sementes: PATAMO Noite ativa + RONDESP Manhã arquivada), progresso dos blocos (`BLOCOS_TURMA`), rodízio e autoavaliações do treino (`TR_ST`, `TR_BANK[i].nota/resp` — só o `trAj` resultante sobrevive), quizzes respondidos (`QUIZZES`), inscrições e histórico de simulados (`SIM_INSC`/`SIM_HIST`), resultado e bloqueio de 24h da prova de promoção (`provaBloqueadaAte`).
- **Eventos e portaria:** inscrições/compras/garimpos por evento (`evState`), listas de portaria (`ACESSO_ST`), bônus da noite (`NOITE_RESG` — libera de novo).
- **Gift cards:** lotes criados na sessão e resgates (`GIFT_LOTES`/`giftUsados` zeram — os cartões "desusam").
- **Comunicação e administração:** recados do aluno (`RECADOS`), dos professores (`RECADOS_PROF`), histórico do admin (`ADM_MSGS`), avisos (`AVISOS`), materiais publicados (`MATERIAIS` — o arquivo é objectURL em memória), tudo que o admin criou (turmas, eventos, simulados, itens, trocas de grade `CRONO_LOG`), perfil administrativo escolhido no portão.
- **Outras preferências:** `perfilPrivado` do ranking (volta a público — sensível quando houver dado real), senha e foto trocadas do professor.

**O que isso significa para a demo** (auditoria 06, §5, atualizado):
1. Cada sessão começa previsível no que é **cenário** (catálogo, cronograma, eventos, comunicação) — bom para roteiro guiado.
2. **A continuidade já pode ser demonstrada no que é do aluno**: saldo, mochila, identidade, turma ativa e extrato voltam depois do F5 (DA-10). O que ainda quebra a narrativa é a parte **operacional** (compras, pedidos, inscrições) — ver a lista acima.
3. **Multiusuário continua sendo ilusão:** aluno, professor e admin são personas da MESMA aba; dois aparelhos nunca veem a mesma coisa. O `localStorage` é **por dispositivo**, não por conta.
4. O botão "Reiniciar demonstração" **agora zera as três chaves** — o bug antigo foi corrigido (ver seção 4).

---

## 4. `localStorage` — as três chaves que importam

O grep exaustivo da auditoria (06, §3, estado de 30/07) **encontrava** 8 chaves `vq_*` — 4 delas código morto (`vq_pending` nunca escrita; `vq_last_sync`, `vq_tut_step`, `vq_tut_done` nunca lidas; `vq_tut_rew` jamais usada) e `vq_device_authorized` como resquício do fluxo de dispositivo removido. A dec. 188 (01/08) removeu esse código morto com regressão completa verde; a dec. 196 (03/08) acrescentou a chave de persistência da DA-10. **Hoje o fonte usa três chaves**, todas com efeito perceptível:

| Chave | O que controla | Detalhes |
|---|---|---|
| `vq_tut_skip` | Se a Instrução do QUAD abre no login. `'1'` (gravada ao concluir OU pular) = entra direto | Única flag de tutorial realmente lida (`acessarPortal`); é também o atalho das suítes/sondas para pular o tutorial |
| `vq_intro_done` | Se a missão "Introdução no Quad" está feita — a linha some do bloco "Hoje" (dec. 157/177) e a recompensa (+30/+25) não repete | Flag conceitualmente **da conta** guardada **por dispositivo** (trocar de aparelho a perderia — no real, DEPENDE DO BACK-END) |
| `vq_evolucao` **(nova — dec. 196, DA-10)** | A evolução do aluno neste dispositivo | Payload JSON `{ v: 1, id, score (Quad Coins), diamantes, carreira (os 3 acumuladores), mochila, avatarIdx, guerra (nome de guerra), turmaAtivaId, lojaOwned, trAj, ledger (os 60 últimos lançamentos) }`. Escrita por `evolSalvar()` com **debounce de 400 ms** (`evolMarcar()`), lida por `evolCarregar()` no boot — src/20; hooks `__evolSalvar`/`__evolCarregar`/`__evolMarcar` |

**Bug do reset — CORRIGIDO (dec. 196).** O handler de "Reiniciar demonstração" (src/13) executava apenas `lsDel('vq_tut_skip')` e deixava `vq_intro_done` para trás; hoje ele limpa **as três chaves** (`lsDel('vq_tut_skip'); lsDel('vq_intro_done'); lsDel('vq_evolucao');`) antes de sair da conta. Textos anteriores a 03/08 que descrevem isso como "bug conhecido, mantido de propósito" **estão desatualizados**.

**Agora há dado pessoal no `localStorage`.** Com a DA-10, passaram a ser gravados no dispositivo o **nome de guerra**, o **avatar**, os **saldos** e o **extrato de movimentações** do aluno da demonstração. Não é mais verdade que "nenhum dado pessoal vai ao `localStorage`". Ressalva de LGPD **do protótipo**: são dados da conta-demo (Danilo de Almeida Moura, DADO DEMONSTRATIVO) num armazenamento local, sem criptografia e sem vínculo com conta real; no produto, o dono do dado é o servidor (DA-07) e o cache local — se existir — precisa de política de expiração, limpeza no logout e base legal definida. Ver §8 e §9.

---

## 5. Simulações — a lista honesta

Tudo abaixo é SIMULAÇÃO LOCAL declarada (muitas com a etiqueta `[INTEGRAÇÃO REAL]` no próprio fonte — 23 ocorrências confirmadas por grep; eram 24 na auditoria de 30/07, 23 após a remoção de código morto da dec. 188):

| Simulação | Como funciona de verdade | Evidência |
|---|---|---|
| **Login que aceita tudo** | `acessarPortal` valida só `@` no e-mail e senha não vazia; qualquer par entra; a "verificação de matrícula" da vinheta é encenada | src/10 l.58–82 ("[INTEGRAÇÃO REAL] validar no servidor"); sonda `invA-login.mjs` |
| **Portão do admin** | Valida **apenas** a chave `NPP-2026` (case-insensitive); o e-mail aceita qualquer coisa com `@` e não é guardado | src/16 l.6–15; sondas invA/F3 — DIVERGÊNCIA com o texto do portão ("cadastro aprovado pela direção") |
| **Senha do professor** | `PROF_SENHA_DEMO = 'quad1234'` para todo o corpo docente, comparada em texto claro; a dica é impressa no próprio gate | src/09 l.34–76; auditoria 06 §2.7 |
| **Checkout/cadastro no site** | "Ir para o cadastro no site" = toast "(demo)"; recarga de Diamantes "do checkout" não existe (só gift demo e crédito manual) | src/10 l.85–96; src/07 l.94–96 |
| **Polling randômico do quiz ao vivo** | Placar da sala = `setInterval` 700 ms somando `ceil(random()*5)` até a lotação; distribuição por alternativa é hash determinístico que **absorve a resposta real** do aluno da demo | src/09 (pollRodar/qzDist); sondas F1/b5 |
| **Hash do Domínio** | Percentuais por sub-assunto = base determinística por hash do nome do nó + viés por matéria, **mais** o deslocamento real `trAj` dos flashcards — fora desse deslocamento, as barras são visuais, não medem desempenho | src/07 l.438–449; src/11 l.600 |
| **QR ilustrativo do gift card** | SVG 21×21 desenhado por hash do código — **não codifica nada**; "impressão e leitura reais são [INTEGRAÇÃO REAL]" | src/16 l.258–260; sonda C2 |
| **Câmera simulada** | "Validar pelo QR" abre um overlay cuja "leitura" é um botão que pega o primeiro código ativo de qualquer lote | src/16 l.334–341 |
| **Telemetria visual** | Card fixo "Telemetria desta sessão · invisível ao aluno na versão real"; só dois pontos reescrevem contadores triviais; a linha "origem: OPEN_ORGANIC" é fixa e **ecoa o e-mail digitado**. Nenhum evento é coletado/enviado | src/03 l.243–245; src/08 l.424; src/10 l.68; Ficha 10 ("mock/inexistente") |
| **Extração de PDF inexistente** | Quiz da aula, simulado digital, árvore de turma e edital usam **só o nome do arquivo**; as questões saem dos bancos-semente (`QA_MULT`/`QA_CE`; digital mistura `TR_BANK`+`AULA_DEMO`) | src/09 l.380–393; src/12 l.449–462 |
| **Rankings sintéticos** | 48 sobrenomes + offsets; posição na sala = fórmula (~29% do total); geral fixo 87º de 1.286; só o score exibido do aluno é o vivo | src/12 l.105–300; auditoria 06 §2.10 |
| **Cronograma = snapshot de planilha** | "Semana 30" embutida; quem atualiza é o bloco do admin; a sincronização com a planilha da coordenação é V1/`[INTEGRAÇÃO REAL]` | src/08 l.454–458 |
| **Relógio local como juiz** | Selos AGORA/ENCERRADO, vigência de matrícula, janela de estorno de 7 dias e bloqueio de 24h da prova usam `Date.now()` do dispositivo | src/08 l.543–556; src/12; dossiês B/C/D |
| **Nascimento de blocos por seed** | A "liberação 22h15" e as ondas D0/D+1/D+7/D+30 são narrativa: os blocos nascem prontos com `criadoEm = Date.now() − idadeDias`; não há agendador | src/11 l.29–33; dossiê B (M5) |
| **Correção e prêmios no cliente** | Gabaritos viajam nos objetos (`right`/`c`); `addPontos`/`addScore`/`addDiamante` mutam carteiras direto no DOM; prova de promoção corrige 100% no cliente | src/07 l.39–40 ("no sistema real o servidor valida tudo"); auditoria 06 §2.2/2.4 |
| **Inscritos e presenças sintéticos** | Listas de portaria semeadas por hash (`inscNome`); a lista "PDF" de conferência sai 100% sintética mesmo com inscrito real; "PDF" = `window.print()` | src/17 l.451–480; dossiê E |
| **Botões de teatro assumido** | "+275 dia de estudo (simulação)", "Liberar nova tentativa (simulação)", `demoSobePatente` "[DEMO PROVISÓRIO — REMOVER]" | src/12 l.322/551–569 |
| **Troca de senha do aluno** | Só toast "Senha alterada com sucesso" — nada é gravado nem conferido (a do professor, ao contrário, vale na sessão) | src/12 l.577–581 |
| **Hooks de teste embarcados** | **42 ganchos** `window.__*` (contrato das suítes). Os 4 das dec. 192/194 — `__dropRng`, `__dropSortear`, `__calRefresh`, `__estRefresh` — e os **7 da dec. 196**: `__ledger` (lê o LEDGER), `__ids` (id do aluno + sequência), `__carteira` (saldos), `__admPerfil` (lê/troca o perfil administrativo), `__evolSalvar`, `__evolCarregar` e `__evolMarcar` (persistência DA-10). Junto das credenciais demo, embarcam no artefato publicado — aceitável na V0, removível em build de produção (DECISÃO TÉCNICA PENDENTE) | contagem por grep em `src/*.html`; auditoria 09, "Como ler", item 3 |

---

## 6. Funcionalidades APENAS visuais

Diferente das simulações (que têm mecânica local real), estas são **fachada sem mecânica**:

- **Banco de questões do admin** (`v-questoes`): tabela estática de 3 linhas; "Cadastrar questão" = toast descritivo (src/13 l.799).
- **Tela de edital** (`v-edital`): árvore PC-BA estática; "Lançar edital"/"Reconciliar" só alternam cartões fixos (as árvores **vivas** são as de `CONCURSOS`, na Estrutura — Ficha 22: "integração parcial + apenas visual").
- **Vídeo de resolução por questão**: botão placeholder no motor órfão de `QUESTIONS` (toast "placeholder do protótipo", src/08 l.409–412).
- **"Presença 9/10"** do Quadrômetro: texto fixo do HTML no meio de números vivos (src/03 l.208).
- **Regras de score/coins na página do evento**: publicadas como se executassem, mas nenhum crédito de presença de evento existe (só o garimpo +15 QdC credita de verdade) — DIVERGÊNCIA texto × mecânica (dossiê E).
- **"Corrigir no site"** (tutorial) e **link do evento online**: toasts.
- **Perfil médio da base (412 alunos)**, `REL_LOJA_TOP` (mais vendidos), `ATIVIDADES` fixas das Liberações (Aulão 73 etc.), "logins/semana" por hash: mostradores decorativos dos relatórios.
- **Prévias bloqueadas** (`data-lock`/"EM BREVE"): chat ao vivo, PvP/GvG/guarnições (V2), Pré-TAF, Quests/forja, resposta do professor à recepção, feedback dos alunos, Reclamações/Presença/Feedbacks/NPS — FUNCIONALIDADE PLANEJADA, sem nada por trás (dossiê F, M17).
- **Vestígios**: `#gateVerify` (loader que nenhum fluxo exibe desde a dec. 57), aside "Testar o novo acesso (V0)" descrevendo fluxo removido, `LINKS_ONLINE` vazio (preservado como ponto de integração planejado, dec. 188), "Corte das missões da semana (SÁB 23h59)" — linha decorativa do calendário sem mecânica.
- **Telemetria** (seção 5): o card se autodeclara demonstrativo.

---

## 7. Comportamentos validados que a aplicação real deve REPRODUZIR

Esta é a **experiência aprovada** — mecânicas provadas por sonda/suíte (**58 suítes** verdes; dec. 190 as fixa como critério de aceite). A aplicação real muda o "como" (servidor, persistência), nunca o "o quê":

**Entrada e conta**
1. Sem matrícula ativa, o app trava — resta a Quad Store (dec. 62; RN-02/03).
2. Conta bloqueada não entra; bloqueio pelo admin **derruba a sessão na hora** (aluno ~400 ms; professor com recado cordial — dec. 52/89).
3. Tutorial obrigatório no 1º acesso, roteiro de 29 passos, sempre do zero; **pular = estado final de quem concluiu** (dec. 105); Introdução no Quad é **da conta**, única, some da lista quando feita (dec. 157/177).
4. Nome de guerra derivado do nome completo (subsequência ordenada, sem nome inteiro, sem apelido, filtro de palavrões), confirmação em dois tempos; identidade `AL SD QUAD <NOME>`; 12 avatares com escolha única e pronome por gênero (dec. 18/24/176).

**Turmas e contexto**
5. **DA CONTA × DA TURMA** (dec. 148/156): score, patente, moedas, mochila, avatar e nome de guerra são da pessoa; aula, avisos, missões, ranking da sala, Domínio, materiais e calendário seguem a **turma ativa**.
6. Uma turma por turno; matrícula barrada por sobreposição de horário (única compra bloqueada por choque); 1ª matrícula assume sem perguntar; da 2ª em diante, pop-up de escolha; troca de turma ativa sem deslogar re-renderiza tudo em cadeia (dec. 62/101/146/147/152–154).
7. Turma vendida em **duas moedas com vagas separadas por moeda** (dec. 155); grade do cronograma chaveada por id de turma — turma nova nasce em branco, extinta sai (dec. 163).
7-A. **Turma encerrada fica ARQUIVADA, não apagada** (DA-06, dec. 195; demonstrado na dec. 196): a matrícula vencida sai da lista de turmas ativas mas continua no perfil, sob "Minhas turmas · ativas e arquivadas", com a etiqueta **ARQUIVADA** — e o histórico de desempenho, compras e materiais continua consultável. Evidência: `matriculasArquivadas()` (src/07), semente `rondesp-m` com `fim: 2026-06-30`, render em src/12. A aplicação real precisa da mesma separação: **vigência encerrada ≠ dado removido**.

**Estudo e gamificação**
8. Bloco = 10 rápidas certo/errado com feedback imediato + autoavaliação Errei/Difícil/Bom/Fácil; expiração em 7 dias → Atrasadas recuperáveis; recompensa da noite com resgate único por turma; rodízio do treino segue a árvore do edital da turma ativa; ajuste de Domínio **por concurso** (dec. 26/106/159).
9. Regra econômica de mecânica (não de valores): **QdC paga participação, score/Domínio pagam acerto**; exceção assumida: simulado digital premia QdC por acerto (dec. 117b/123/125). Diamante nunca é conquistado em missão (dec. 48).
9-A. **DROP de itens de combate** (dec. 194): concluir um bloco de 10 (dia/noite/tarde), o treinamento rápido ou um simulado digital **sorteia** cada item configurado pela sua própria chance; o conquistado entra na mochila **sem custo, sem registro de compra e sem estorno**, com celebração dedicada. **Nunca dispara no tutorial.** O admin define, por item, a disponibilidade (só venda / só drop / venda + drop) e a chance de 1% a 100%; item só de drop **não aparece na vitrine** e é publicado sem preço.
10. Prova de promoção: score atingir a meta apenas **libera**; 20 questões que o próprio aluno marcou Errei/Difícil (sem revelar o critério); 80% promove na hora com excedente transferido; reprovação bloqueia 24h (dec. 23).
11. Quiz da aula: por turma, 1–30 questões/1–180 min, sem gabarito para o aluno e **sem premiação**; relatório do professor começa em branco ("nada de % inventado") (dec. 64/77/83/86).
12. Rankings com **privacidade de mão dupla** e top 10 sempre visível (dec. 132/143).

**Loja e pós-venda**
13. Toda compra pede confirmação; efeitos por tipo (matrícula, isolada→evento, evento, simulado, skin, combate→mochila, físico→pedido); estoque físico decresce e o item some ao zerar; item de combate recompra e empilha; cadeia de skins um elo por vez, farda de escolha única, "quem possui, veste" (dec. 25/170/172; RN-22).
14. "EM CHOQUE" **avisa sem impedir** (exceto matrícula); LOTADO herda a lotação da sala e bloqueia; atalho "NA LOJA" abre a página do evento e o botão de lá leva ao item exato piscando (dec. 104/107/173/179/199).
15. Estorno **direto** em até 7 dias, dois toques, devolução na **moeda original**, desfazendo a posse por tipo (inclusive vaga na moeda usada e troca automática da turma ativa); **consumo mata o estorno** (entrega, entrada liberada, presença) (dec. 67/100/162/178; RN-26/28).
15-A. **Três exceções à janela de 7 dias**: a compra feita **durante o tutorial** nasce marcada `semEstorno` e nunca entra na regra (dec. 193); o **evento já realizado** sai da janela pela data, tenha havido presença ou não — 4º caminho de saída, ao lado dos 3 gatilhos de consumo (dec. 192); e o item ganho no **DROP** não é compra, logo não existe estorno para ele (dec. 194).
16. Gift card em lote com **liberação única** e invalidação imediata; crédito manual do admin com motivo e histórico (dec. 52/66/84).
16-A. **Extrato da carteira com autor e saldo resultante** (DA-03, dec. 195; implementado na dec. 196): **nada entra nem sai da carteira sem lançamento**. Cada movimentação registra `id` (`MV-xxxxx`), moeda, **tipo** da operação, **origem**, **destino**, **autor**, data/hora, valor e o **saldo depois** — inclusive os dois lançamentos de **saldo de abertura** (`MV-00000`/`MV-00001`). Compras, recompensas, gift cards, créditos manuais da administração **e estornos** lançam. O aluno lê tudo no card único "**Carteira · extrato e compras**" (dec. 197), com um seletor de período que vale para o extrato e para as compras e KPIs **recebido · gasto · compras · a receber**. Na aplicação real, o extrato é a **projeção do ledger do servidor**, não um relatório montado no cliente.
16-B. **Identidade de tudo que se move**: aluno e lançamentos têm **ID interno** (`MEU_ID = 'AL-00001'`, `DB_ALUNO.id`, `novoId()` gerando `MV-xxxxx`) — DA-01. Nenhuma entidade econômica deve ser referenciada por nome no produto real.

**Operação**
17. Portaria sincronizada com as atividades reais; liberar entrada confirma presença, pontua e consome (dec. 128/129/180).
18. Eventos são **do Quad** (sem turma-alvo, dec. 161); avisos têm turma-alvo por id (dec. 149); mensagens por público com prefixo e status ENVIADA→LIDA (dec. 181); materiais por turma com download real e etiqueta de origem (dec. 144/164).
18-A. **Status do evento no calendário do aluno** (dec. 192): o evento **presencial** em que ele se inscreveu **não some ao passar** — vira **CONCLUÍDO** quando a entrada foi liberada na portaria ou **FALTOSO** quando o dia passou sem registro de entrada; o **online**, que não passa pela portaria, continua saindo do calendário ao vencer (sem registro não há julgamento justo).
19. Governança do admin em tempo real: criar/editar turma, preços e vagas sem recriar, rename de docente propagado com e-mail acompanhando, validações de lotação/choque de sala (dec. 81/121/139/155/174/175/179).
19-A. **A administração tem perfis, e o perfil filtra e assina** (DA-08, dec. 195; implementado na dec. 196): são **quatro** — Direção, Coordenação pedagógica, Recepção e Financeiro (`ADM_PERFIS`, src/16). O perfil é escolhido no portão (`#admPerfil`), aparece como chip no painel (`#admPerfilChip`) e **decide quais abas existem** para aquele operador (`admPodeVer`); o **crédito manual** de moedas entra no extrato do aluno **assinado pelo perfil** (`autor: admPerfilNome()`). A aplicação real precisa reproduzir o princípio — cada operador vê o que a sua responsabilidade exige e **toda ação registra quem a fez** — sobre um RBAC de verdade, com chave por pessoa.
20. **A evolução do aluno tem continuidade** (DA-10, dec. 195; demonstrada na dec. 196 via `localStorage`): saldo, carreira, mochila, skins, avatar, nome de guerra, turma ativa, ajuste do Domínio e extrato **voltam quando o aluno reabre o app**. O protótipo demonstra o comportamento no dispositivo; a aplicação real o entrega **pela conta, no servidor** — o `localStorage` é vitrine, não arquitetura (ver §8 e §9).

**Ressalva permanente:** todos os **valores** (preços, saldos, recompensas, metas de patente, janela de 7 dias) são DADO DEMONSTRATIVO — dec. 185.

---

## 8. O que precisará de banco de dados (por domínio — sem modelar)

Registro apenas de **o que precisa persistir e com que relação** (a modelagem é da fase de especificação, arquitetura 00 §8).

> **Decisões que já fecharam parte destas perguntas (dec. 195/196):** **DA-01** — toda entidade tem **ID interno** e nome deixa de ser chave; **DA-03** — a economia é um **ledger de lançamentos**, não um saldo mutável; **DA-06** — o encerramento **arquiva**, não apaga; **DA-09** — há **política de retenção** a definir por domínio; **DA-10** — a **evolução do aluno persiste** e é da conta. O que segue abaixo é o desdobramento delas em necessidade de persistência.

- **Identidade e conta:** persistir conta do aluno (dados cadastrais, credenciais, estado de bloqueio) com relação às suas sessões/dispositivos; conta do professor e do administrador com **papel/perfil** (os 4 de DA-08) e chave por pessoa; nome de guerra e avatar escolhidos **com relação à conta** — hoje o protótipo os guarda no dispositivo (`vq_evolucao`), o que **não** substitui a persistência por conta (DA-07 define o dono do dado).
- **Matrículas e turmas:** persistir turmas (catálogo, sala, turno, período, preços/vagas por moeda) e matrículas **com relação aluno×turma e vigência**, **preservando as encerradas como arquivadas e consultáveis (DA-06)**; a **preferência de turma ativa** com relação à conta; docentes com **ID estável** (DA-01) e escalação **com relação turma×matéria**.
- **Economia:** persistir saldos de QdC e Dmn como **ledger com relação a cada evento de crédito/débito** (compra, recompensa, crédito manual, gift, estorno) — modelo já **decidido pela DA-03** e demonstrado no protótipo, com tipo, origem, destino, **autor**, carimbo e **saldo resultante** por lançamento; o saldo é derivado, nunca a fonte. Compras com relação a aluno, item, moeda, carimbo (janela de estorno) e estado de consumo; gift cards com relação lote→código→resgate→conta; pedidos de retirada com relação compra×recepção.
- **Pedagógico:** persistir cada resposta do aluno **com relação a questão, contexto (bloco/quiz/simulado/prova), turma e tempo**; a autoavaliação de dificuldade (dado sensível — base da prova de promoção); o estado dos blocos por turma (feito/expirado); histórico de simulados e de promoções; o Domínio calculado **com relação a concurso→matéria→assunto**.
- **Conteúdo:** persistir banco de questões com ID por questão, gabarito, tags pela árvore do edital e campo de uso; árvores de edital **versionadas com relação ao concurso**; cronograma por turma com histórico de trocas; materiais com relação turma×matéria×assunto e arquivo em storage.
- **Eventos e presença:** persistir eventos, inscrições/compras com relação aluno×evento, ocupação com relação à sala, presenças/liberações **com relação a operador, aluno e carimbo** (auditoria).
- **Comunicação:** persistir avisos (com alvo), mensagens por público e recados **com relação a emissor, destinatário e recibo de leitura**.
- **Gamificação:** persistir os três scores, patente, estado da prova (incluindo o bloqueio de 24h — hoje em memória) e histórico **com relação à conta**; parametrização (`GAMI`, salas/lotações) como configuração administrável.
- **Preferências:** persistir perfil público/privado do ranking com relação à conta (preferência de privacidade — crítica sob LGPD).
- **Retenção (DA-09):** cada domínio acima precisa de **prazo e destino do dado** — o que se guarda para sempre (ledger, histórico acadêmico), o que se arquiva (matrículas encerradas), o que se anonimiza e o que se apaga. A decisão de **que existe política** já foi tomada; os prazos por domínio são da especificação.

A auditoria 09 (obs. transversal 3) indicava por onde começar: **turma ativa, avatar, nome de guerra, perfil privado, progresso da noite e histórico de mensagens**. Desde a dec. 196 o protótipo **já demonstra** a maior parte disso (turma ativa, avatar, nome de guerra, saldos, mochila e extrato voltam pela chave `vq_evolucao`) — mas **no dispositivo, não na conta**: continuam fora o perfil privado do ranking, o progresso da noite e o histórico de mensagens, e a persistência por conta segue sendo trabalho de back-end.

---

## 9. O que precisará de back-end (validações e autorizações que hoje são JS local)

Motivação registrada em decisão: os **riscos de falsificação da auditoria de 30/07** foram assumidos como pendências da plataforma (dec. 186; arquitetura 00 §6 — "bloqueantes para qualquer versão com dado real"): *toda autorização é do lado do cliente; credenciais demo hardcoded (algumas impressas na tela); hooks `window.__*` e gabaritos embarcados no HTML público permitem fraude trivial; senha de professor em texto claro; dados pessoais simulados plausíveis demais*. Hoje **score, moedas, matrícula, vaga, estoque, presença, consumo e gabarito são mutáveis pelo console** (auditoria 09, obs. 2) — e, desde a dec. 196, o que o console alterar também **persiste** no dispositivo (`vq_evolucao`), o que agrava o ponto em vez de aliviá-lo. Daí decorre a lista:

> **Decisões que já orientam esta lista (dec. 195):** **DA-01** (IDs internos), **DA-03** (economia como ledger auditável, com autor por lançamento), **DA-08** (perfis administrativos — o "quem fez" tem nome), **DA-09** (retenção) e **DA-10** (a evolução do aluno é da conta e tem continuidade). Elas **não** resolvem os itens abaixo: definem o alvo que o back-end tem de atingir.

1. **Autenticação e sessão** (aluno, professor, admin): validação real de credenciais, recuperação de acesso (hoje inexistente), revogação server-side — o bloqueio que derruba a sessão na hora é comportamento aprovado que precisa virar revogação de verdade; chaves de admin emitidas/revogadas **por pessoa**, sobre os 4 perfis já decididos na DA-08 (o protótipo demonstra o filtro de abas; **não** há RBAC nem identidade individual).
2. **Verificação de matrícula no login** contra a base real (hoje: array em memória encenado na vinheta).
3. **Crédito de pontos e moedas exclusivamente no servidor** — a regra de ouro do próprio fonte: "a interface nunca decide sozinha quantos pontos foram conquistados" (src/07 l.39–40); fila idempotente para nunca premiar duas vezes. O **formato** já está decidido (DA-03): cada crédito/débito é um lançamento com autor e saldo resultante, e o saldo do aluno é a **projeção** desse ledger.
4. **Correção no servidor de tudo que pontua** (blocos, simulado digital, prova de promoção): o gabarito **não pode viajar com a questão** (hoje está no objeto, no cliente).
5. **Transações atômicas** de compra/estorno/consumo: débito + baixa de vaga/estoque **por moeda** + criação de posse numa operação única; concorrência real ("a última vaga acabou de ser tomada") não pode viver no cliente.
6. **Relógio do servidor** como juiz das janelas: estorno de 7 dias, bloqueio de 24h da prova, vigência de matrícula, selos AGORA/ENCERRADO.
7. **Unicidade central do gift card** (anti-replay entre dispositivos — hoje um F5 "desusa" todos os cartões) e trilha contábil de emissão/resgate.
8. **Quiz ao vivo multiusuário**: canal de tempo real com respostas reais de N alunos (hoje: polling randômico na mesma aba).
9. **Máscara de privacidade do ranking aplicada pelo servidor** (no cliente é contornável) e ranking materializado sobre dados reais.
10. **Presença/portaria auditável**: liberação por operador autenticado, com quem/quando, consumo fechando a janela de estorno em tempo real.
11. **Controle de acesso a materiais** por matrícula (hoje quem tiver a URL do blob baixa — pendência de segurança registrada).
12. **Build de produção sem hooks `window.__*` nem credenciais demo** (DECISÃO TÉCNICA PENDENTE registrada) — hoje são **42** hooks.
13. **Estado do aluno servido pela conta, não pelo dispositivo** (DA-10 + DA-07): a persistência local da dec. 196 é demonstração. No produto, a evolução vem do servidor ao autenticar, o cache local (se houver) precisa de invalidação, limpeza no logout e política de retenção (DA-09) — e **nenhum dado pessoal deve ficar em `localStorage` sem base legal definida** (ver §4).

---

## 10. Integrações de terceiros/externas

Conforme a **arquitetura oficial** (00, seção 3): a Consolidação v1.0 internalizou 11 capacidades como módulos da plataforma — a maioria dos **22 contratos** da auditoria 09 deixou de ser integração externa e virou **contrato interno** entre front e módulos [PLANEJADOS] (a forma — API, serviço, biblioteca — fica para a especificação). Permanecem **fora da plataforma**, com integração **a definir** e **nada implementado**:

| Sistema externo | Papel | Estado no protótipo |
|---|---|---|
| **Site e checkout** (vitrine/venda) | Porta comercial do Quad; venda em dinheiro real; recarga de Diamantes | Toast "(demo)" no cadastro; `[INTEGRAÇÃO REAL] crédito do site` no fonte; dec. 183 revogou a dec. 21 (cadastro passa ao app), mas o fluxo novo **não foi implementado** — o portão do site segue como demonstração |
| **Pagamentos / financeiro** | Gateway, estorno em dinheiro real, conciliação | Inexistente — Dmn é saldo fictício; estorno devolve crédito local |
| **Plataforma de cursos** | Legado **em avaliação** — decisão pendente | Cursos online são cards de Loja; nenhum vínculo |
| **Notificações push/e-mail** | **Canal** de entrega (não domínio da plataforma); "o app nunca empurra na V0" | Badges internos apenas; push é faixa V1 do roadmap |
| **Telemetria como serviço de dados** | Coleta de eventos comportamentais (insumo do futuro IRA) — **"a decidir"**; o Módulo de Relatórios [PLANEJADO] consome leituras, não é dono da coleta | Mock/inexistente — o item **mais distante do código** (Ficha 10; nada é coletado) |

Costuras secundárias que a especificação decidirá se são serviço externo ou parte de módulo interno: **parser de PDF** (edital, quiz, simulado — hoje só o nome do arquivo), **planilha Google Sheets da coordenação** (fonte transitória do cronograma), **storage/CDN de materiais e mídia**, **geração/leitura real de QR**, **controle de acesso físico** (portaria/geofencing — geofencing é V1 sem nenhum código). Os 23 pontos `[INTEGRAÇÃO REAL]` no fonte (24 na auditoria de 30/07; 23 após a dec. 188) e o `LINKS_ONLINE` preservado são o mapa dessas costuras (arquitetura 00 §3).

---

## Rodapé de rastreabilidade

- **Dossiês A–F** (02/08/2026): sondas Playwright sobre o protótipo real — invA-* (entrada/tutorial/turma), b1–b5 (início/missões/quiz), sondaC1–C4 (progressão/gift), sondaD/D2 (loja/estornos), probeE S1–S5 (eventos/simulados/materiais), F1–F4 (professor/admin/relatórios) — todas verdes, nenhuma alterou o repositório.
- **Auditoria:** `docs/auditoria/06` (inventário de estruturas, localStorage, F5), `docs/auditoria/09` (22 fichas de contrato + estado atual), `docs/auditoria/00` §5.3 (riscos de segurança/LGPD).
- **Arquitetura:** `docs/arquitetura/00-arquitetura-oficial.md` (Consolidação v1.0 — prevalece sobre tudo; seções 3, 5, 6 e 8 citadas).
- **Dados:** `data/README.md` (19 fragmentos verbatim + o que ficou no código de propósito).
- **Decisões-chave citadas:** 21/183 (cadastro), 48 (Diamante), 52, 62, 105, 148, 155, 157/177, 159, 161, 163, 164, 170/172/173, 178/179/180/181, 182 (Consolidação), 184 (Módulo Planejado), 185 (economia indefinida), 186 (riscos como pendências), 188 (código morto), 189 (reancoragem), 190/191 (suítes e seeds), **195 (as dez Decisões Administrativas DA-01…DA-10)**, **196 (implementação de DA-01/03/04/06/08/10 — ledger, IDs, turma arquivada, perfis administrativos, persistência e correção do bug do reset)** **197 (carteira unificada + remoção do contador do tutorial)**, **198 (a demonstração abre sempre zerada; a persistência vale dentro da sessão)**, **199 (o card do carrossel sempre abre a página do evento; a Loja virou o botão de lá — revê a dec. 173)**, **200 (todo evento pontua 10; recompensa de participação editável no formulário; etiquetas reduzidas a NA LOJA e +BÔNUS)**, **201 (fim da rolagem infinita vertical do Início)** e **202 (revisão de 10 questões por subassunto, aberta pelo Domínio)**.
- **Data desta revisão:** 03/08/2026 — contagens conferidas no repositório: **58 suítes** em `tests/`, **42 hooks** `window.__*` em `src/`, **3 chaves** `vq_*` vivas.
