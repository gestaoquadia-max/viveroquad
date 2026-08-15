# 02 · Fluxo completo do aluno — a jornada como o protótipo demonstra

**Documentação de handoff · protótipo "Viver o Quad"** · 02/08/2026
Fonte de verdade: o protótipo executado (`index.html`, gerado das 20 partes de `src/` + `data/`), conforme apurado nos dossiês A–E (`scratchpad/handoff-inv/`), com apoio de `docs/auditoria/03-fluxos-do-usuario.md` e do `docs/02-registro-de-decisoes.md` (dec. 1–194).

> **Revisão de 03/08/2026** — a narrativa foi extraída contra as decisões 1–191; as decisões **192** (evento presencial vira CONCLUÍDO/FALTOSO no calendário), **193** (a boina do tutorial fica fora do estorno) e **194** (sistema de DROP) foram incorporadas nesta revisão, nas etapas 4, 11, 12, 16, 17 e 18.

> Este documento narra a jornada do aluno **do jeito que o protótipo a demonstra hoje**, etapa por etapa. Em cada etapa: um parágrafo de narrativa, as regras confirmadas (com o nº da decisão quando houver) e o que é simulação local. Rótulos usados exatamente como no restante do handoff: **FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO · SIMULAÇÃO LOCAL · REGRA DE PRODUTO CONFIRMADA · DADO DEMONSTRATIVO · DECISÃO POSTERIOR · FUNCIONALIDADE PLANEJADA · DIVERGÊNCIA · PERGUNTA PENDENTE**.

---

## Etapa 1 — Chegada ao Quad e download do app

Na visão de produto, o aluno conhece o Quad Concursos, compra sua matrícula e passa a usar o app "Viver o Quad" no celular. **O protótipo não demonstra nada antes da tela de login**: ele abre como uma página web que simula um celular (viewport de app), já na camada `#loginLayer`. Não existe loja de aplicativos, instalação, deep link do site para o app nem página pública do Quad no protótipo — a jornada demonstrada começa com o app "já instalado", na tela de entrada.

- REGRA DE PRODUTO CONFIRMADA (dec. 182): o "Viver o Quad" é a **plataforma principal**; site/checkout e pagamentos permanecem **sistemas externos**.
- FUNCIONALIDADE PLANEJADA: distribuição real do app (lojas, instalação, deep link site→app) — nenhuma decisão registrada; contrato app↔site marcado como pendência técnica na auditoria (F02).
- SIMULAÇÃO LOCAL: o "celular" é uma moldura de demonstração; a troca entre personas aluno/professor/admin por botões fora do celular é mecânica do protótipo, não recurso do produto.

## Etapa 2 — Cadastro: o portão "cadastro no site" (dec. 21, revogada pela dec. 183)

Quem ainda não tem conta toca em "Ainda não tem conta? **Criar conta**" no login. Abre o portão `#gateCriar` — "Cadastro no site do Quad" — que explica: a conta é criada no **checkout do site**, junto com a matrícula; confirmada a matrícula, o acesso ao app é liberado automaticamente. O botão "Ir para o cadastro no site" mostra apenas o toast "Redirecionando para o cadastro no site do Quad… (demo)"; "Voltar ao login" retorna. É um beco demonstrativo de propósito: o app não é dono do cadastro na demonstração.

- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO: o portão existe, explica a regra e volta ao login intacto (src/10 l.85–96; suíte `vacesso.mjs`).
- REGRA DE PRODUTO CONFIRMADA **no comportamento demonstrado** (dec. 21): conta nasce no site (checkout); o app só autentica; a matrícula ativa libera o acesso.
- DECISÃO POSTERIOR (dec. 183, 01/08 — Consolidação v1.0): **a dec. 21 foi REVOGADA** — o cadastro passa a pertencer à arquitetura do app como módulo interno. O fluxo novo **não foi implementado**: o protótipo mantém, de propósito, a demonstração "cadastro no site" até a especificação do módulo (dec. 184: módulo sem especificação = "Módulo Planejado"). Registre-se, portanto, **as duas coisas**: a demonstração vigente E o norte da implementação.
- SIMULAÇÃO LOCAL: o redirecionamento ao checkout é um toast (`[INTEGRAÇÃO REAL]` no fonte).
- PERGUNTA PENDENTE (dossiê A): quais campos terá o cadastro interno e qual sua relação com o checkout externo (pagamento continua fora — dec. 182)?

## Etapa 3 — Login e vinheta com verificação de matrícula

O aluno entra com a conta criada no site: e-mail e senha na tela "VIVER O QUAD" ("Entre com a conta que você criou no site do Quad"). Ao tocar "Entrar", roda a **vinheta** ("Comece seu sonho por aqui...") com a linha "Verificando a matrícula de \<e-mail\>…" — a verificação de matrícula acontece **dentro da vinheta**, numa tela só (dec. 57; a página "verificando" separada foi removida e `#gateVerify` sobrevive vestigial no HTML). Conta bloqueada pela administração não entra: abre o pop-up "Conta bloqueada" e o aluno fica no login. Ao fim da vinheta o QUAD acena, o balão "Precisa de ajuda?" aparece por 10 s e, no 1º acesso, dispara o tutorial obrigatório.

- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO: validações de campo ("Informe seu login (e-mail).", "Digite sua senha."), vinheta ~4 s, toast "Bem-vindo, \<nome militar\>!" nos acessos seguintes.
- REGRA DE PRODUTO CONFIRMADA: matrícula ativa libera o app (dec. 21/62); conta bloqueada não entra e vê o aviso (dec. 52); login exige conexão.
- SIMULAÇÃO LOCAL: **qualquer e-mail com `@` + qualquer senha entram** — nenhum servidor é consultado (comentário "[INTEGRAÇÃO REAL] validar no servidor", src/10). Sessão não persiste (recarregar = deslogado); só `vq_tut_skip`/`vq_intro_done` vivem no `localStorage`.
- FUNCIONALIDADE PLANEJADA: recuperação de senha ("esqueci minha senha") **não existe em nenhuma forma** — nem caminho na UI nem decisão registrada.
- DIVERGÊNCIA (dossiê A): o aside da demo ainda descreve o fluxo antigo por código de e-mail (texto morto, removido pelas dec. 21/188); o estado offline é inalcançável pela UI atual.

## Etapa 4 — Tutorial obrigatório: a Instrução do QUAD em 29 passos

No 1º acesso (e em todo acesso enquanto `vq_tut_skip !== '1'` — dec. 105), o mascote QUAD assume a tela: fundo escurece e trava, alvo iluminado com anel e seta, fala datilografada, gestos por assunto. O roteiro tem **29 passos** — **sem contador na tela desde a dec. 197**: o balão traz apenas o nome "QUAD" (o elemento `#tutStepN`, que mostrava "1 / 29", foi removido do HTML e do JS; os 29 passos continuam iguais). Sequência: apresentação → tocar na própria foto → zoom → **escolha do personagem** no grid de 12 avatares da coleção PM (6 homens, 6 mulheres; segurar amplia) → confirmação com **pronome pelo gênero** ("**Essa**/Esse … é o personagem que você escolheu?" — dec. 176) → confirmação dos dados que chegam do banco ("Vi que você é o Danilo de Almeida Moura…"; "Corrigir no site" é toast) → **nome de guerra** → salvar perfil → leitura da identidade militar ("AL SD QUAD \<NOME\>", partícula fixa "QUAD" — dec. 18) → score zerado → missão **Introdução no Quad** (3 questões; só 3/3 paga; errou, o QUAD relança em loop) → +30 score/+25 Quad Coins → Loja → **compra guiada da boina** (20 QdC; a boina sai da vitrine e **veste a foto na hora**) → saldo 5 QdC → zoom final → despedida "CONCLUIR ›". O tutorial roda **sempre do zero** (refazer não acumula). O botão "‹ Pular" existe a qualquer momento e reproduz o **estado final de quem concluiu**: +30 score, boina equipada, 5 QdC, Introdução feita — mas **sem nome de guerra** (fica "AL SD QUAD ______" até preencher no Perfil).

- REGRA DE PRODUTO CONFIRMADA: tutorial obrigatório; concluir ou pular libera para sempre (dec. 7/17/105); pular = estado final constante (dec. 105); 12 avatares oficiais, **escolha única** — fora do tutorial o grid fica oculto e trocar exige refazer a instrução (dec. 9/24); pronome pelo gênero (dec. 176).
- REGRA DE PRODUTO CONFIRMADA — **regra do nome de guerra**: precisa vir do nome completo — um dos nomes ou uma **combinação deles em ordem** (subsequência), nunca o nome inteiro, nunca apelido; só letras; mínimo 2 caracteres; filtro de palavrões; confirmação em dois tempos ("Você quis dizer MOURA?"). Vale também no Salvar do Perfil, fora do tutorial.
- REGRA DE PRODUTO CONFIRMADA: dados pessoais chegam prontos do banco geral; o tutorial **confirma**, não pede (dec. 22 — formalmente superada pela dec. 182 · DECISÃO POSTERIOR: o comportamento demonstrado permanece como demonstração vigente).
- REGRA DE PRODUTO CONFIRMADA: Introdução no Quad é **da conta**, feita uma vez; a linha some do bloco de missões quando feita e persiste entre sessões (dec. 157/177).
- REGRA DE PRODUTO CONFIRMADA — **a boina do tutorial fica fora do estorno** (dec. 193): a compra feita durante a instrução nasce marcada (`semEstorno`) e **não entra em "Estornos · até 7 dias"** — "ela faz parte do tutorial e não entra na regra". Ver etapa 17.
- REGRA DE PRODUTO CONFIRMADA — **o DROP de itens não dispara no tutorial** (dec. 194): o rito é guiado, e a única aquisição da instrução é a boina. Ver etapas 11 e 16.
- DADO DEMONSTRATIVO: os valores 30 score / 25 QdC / boina 20 QdC são calibração da narrativa ("custa 20 e você tem 25") — dec. 185 mantém as regras econômicas INDEFINIDAS; as 3 questões da Introdução são semente.
- SIMULAÇÃO LOCAL: recompensas e carteiras em memória; "Corrigir no site" é toast; os demais tutoriais da central do QUAD respondem "em construção".
- DIVERGÊNCIA (achado de sonda, dossiê A): o campo tem `maxlength=12` e a regra aceita combinações mais longas — "Almeida Moura" (13 caracteres) é válido pela regra, mas impossível de digitar; o registro da dec. 17 fala em "19 etapas", mas o roteiro vigente tem 29 passos (código e suíte `vtut.mjs` são a verdade); quem pula fica sem nome de guerra e nada o obriga a definir depois.

## Etapa 5 — Sem turma: app travado, Loja aberta

Se o aluno não tem **nenhuma matrícula ativa** (a da demo nasce com a Turma PATAMO Noite; o estado sem turma surge por encerramento ou estorno), `checarMatricula()` liga o `appLock` e abre o pop-up `#matLayer` — "**Matrícula encerrada** — Sua turma terminou e a matrícula não foi renovada… funções bloqueadas até você entrar em uma nova turma" — com os botões "Ver turmas na Quad Store" e "Entendi". A navegação inferior bloqueia **tudo, exceto a Loja** (toast "Funções bloqueadas — matricule-se em uma turma na Quad Store para liberar"). A Loja fica aberta justamente para o aluno se rematricular — e é nela que também mora o resgate de gift card.

- REGRA DE PRODUTO CONFIRMADA: sem matrícula ativa, o app trava e só a Quad Store permanece acessível (dec. 62; RN-03).
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO: a trava é real na navegação (sondas `invA-bloqueios.mjs`; hook de teste `window.__mat.encerrar()`).
- SIMULAÇÃO LOCAL: a vigência da matrícula vem de um array em memória filtrado por data local (`matriculasAtivas()` com `fim >= hoje`).
- DIVERGÊNCIA (dossiê A): o texto "não foi renovada" é único para **qualquer** ausência de matrícula, mesmo quando a causa foi estorno.

## Etapa 6 — Gift card: crédito na carteira

Um aluno pode receber crédito presencial por gift card. A administração emite **lotes** (1–500 cartões, valor e moeda — Quad Coins **ou** Diamantes; códigos `QG<lote>-<código>`, cada um com QR). Na **Quad Store**, o aluno digita o código no campo "Gift card" (aceita minúsculas) ou toca "Validar pelo QR" e o valor cai na carteira na hora: "Gift card validado — +250 Quad Coins!". O código é de **liberação única**: a segunda tentativa responde "Este gift card já foi resgatado (liberação única).", e o painel do admin mostra o consumo do lote em tempo real. Os saldos aparecem no topo do app (chips QdC e Dmn), no cabeçalho da Loja e no Quadrômetro.

- REGRA DE PRODUTO CONFIRMADA: gift card nasce em lote no Painel de controle; liberação única com invalidação imediata; resgate por código digitado na Loja ou por leitor QR (dec. 66/69/70/112); formato `QG<lote>-<código>` (dec. 84); crédito na **moeda do lote**; Diamante é comprado em dinheiro — recarga no site ou gift card — e **nunca** conquistado em missão (dec. 48).
- DADO DEMONSTRATIVO: os códigos fixos QUAD-100/QUAD-500 existem só para demonstrar a tela (não seguem o formato oficial); saldos-semente 1.240 QdC / 150 Dmn.
- SIMULAÇÃO LOCAL: o QR é desenho determinístico (não codifica nada); a "câmera" é um botão que valida o primeiro código ativo; a recarga de Dmn pelo checkout do site é `[INTEGRAÇÃO REAL]` (FUNCIONALIDADE PLANEJADA); lotes e resgates vivem em memória.
- DIVERGÊNCIA (dossiê C): a dec. 48 apresenta o gift card como canal do Diamante, mas o código permite lote **em QdC** — tensão com o princípio "Score não é moeda" da rev. 2.3 (mesma tensão da dec. 11). PERGUNTA PENDENTE: o cartão real será só de Dmn?

## Etapa 7 — Compra de turma na Quad Store: escolha de moeda e vagas por moeda

Na vitrine "Turmas · modalidades do Quad", cada turma é um item único vendido em **duas moedas com vagas separadas** (ex.: "600 Dmn (54 vagas) · 700 QdC (6 vagas)"). O clique abre o pop-up "**Creditar em qual moeda?**" com preço e vagas de cada moeda — o botão da moeda sem vaga fica desabilitado. Confirmada, a compra debita a moeda escolhida, **baixa a vaga daquela moeda** e cria a matrícula. Estados possíveis do card: MATRICULADO, INDISPONÍVEL (turno ocupado) e ESGOTADA (as duas moedas a zero). Não há limite numérico de matrículas: o limite é estrutural — **uma turma por turno** até o fim da turma, e matrícula não pode sobrepor horário na agenda (única compra **barrada** por choque; o resto do catálogo só avisa).

- REGRA DE PRODUTO CONFIRMADA: turma em duas moedas com vagas por moeda (dec. 61/155); um turno por aluno, independentemente da moeda (dec. 62; RN-07); matrícula barrada por sobreposição de horário (dec. 101; a exceção "EM CHOQUE avisa sem impedir" vale para eventos/simulados — dec. 107); toda compra pede confirmação (RN-22).
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO: débito exato, vaga decrementada só na moeda usada, log em `COMPRAS` (sondas `invA-turma.mjs`, `sondaD.mjs`).
- DADO DEMONSTRATIVO: catálogo de 5 turmas, preços (600–2.800), vagas, datas e salas — mecânica confirmada, **valores econômicos indefinidos por decisão** (dec. 185).
- SIMULAÇÃO LOCAL: saldo insuficiente responde por moeda ("Quad Coins insuficientes — complete missões…" / "Diamantes insuficientes — recarregue no site…"); pagamento real e conciliação de vagas são back-end futuro.

## Etapa 8 — Matrícula confirmada e o pop-up de escolha

A **1ª matrícula** assume o app **sem perguntar**: destrava o `appLock`, fecha o `matLayer` e vira a turma ativa silenciosamente ("matrícula-mestre", dec. 62). Da **2ª matrícula em diante**, abre o pop-up `#trocaLayer` — "**Matrícula confirmada** — Você entrou na \<nova\> e já tinha outra turma. Qual delas o app deve abrir agora?" — com um botão por turma ("Abrir o perfil da Turma X", com concurso, turno, horário, sala e o selo "em uso agora" na atual). Tocar fora mantém a turma em uso. O mesmo pop-up, reaberto depois pelo topo, muda o título para "**Suas turmas**" — um pop-up, dois momentos.

- REGRA DE PRODUTO CONFIRMADA: 1ª matrícula assume sozinha (dec. 62); pop-up pós-matrícula da 2ª em diante (dec. 147; RN-09); um pop-up, dois momentos (dec. 154).
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO: comprovado ponta a ponta por compra real da 2ª turma nas sondas (`invA-turma.mjs`, `b1-aula-hoje.mjs`).
- SIMULAÇÃO LOCAL: a matrícula "que veio do site" é semente do array `MATRICULAS`; a persistência da escolha por conta é implementação futura.

## Etapa 9 — Turma ativa: o que muda ao trocar

Com 2+ matrículas, o aluno troca de turma sem sair da conta por **três caminhos**: o nome da turma no topo (vira botão), a faixa no Domínio ("Esta é a estrutura da \<turma\> — você tem N turmas" + "Trocar de turma") e "Minhas turmas" no Quadrômetro (selo EM USO × "Usar esta"). A troca re-renderiza em cadeia tudo que é **da turma**: Aula de hoje, avisos, rankings da sala, Minhas turmas, materiais, quiz da aula, calendário, Domínio (com o concurso da turma), rodízio de flashcards, blocos do dia e atrasadas — com o toast "Você está na \<turma\> — Início, avisos, ranking e Domínio passam a ser desta turma". O que é **da conta** não muda: score/carreira/patente, Quad Coins e Diamantes, mochila/itens/skins/avatar, nome de guerra, Introdução no Quad, compras/estornos.

- REGRA DE PRODUTO CONFIRMADA: turma ativa comanda; troca sem deslogar (dec. 146; RN-08); seletor no topo (dec. 152); faixa no Domínio (dec. 153); DA CONTA × DA TURMA (dec. 148/156/157/160/163; RN-19).
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO: turma nova nasce "no dia zero", com grade em branco, sem atrasadas e com as rápidas no horário dela.
- SIMULAÇÃO LOCAL: a turma ativa não persiste entre recargas.
- DIVERGÊNCIA (contagem, dossiê A): a documentação interna fala em "11 subsistemas" redesenhados; o código atual chama 12 renders + 2 redefinições. Sem efeito funcional. Nuance intencional: "Materiais das aulas" lista **todas** as matrículas ativas (etiquetadas por turma), não só a ativa.

## Etapa 10 — O dia a dia: Aula de hoje e avisos

Ao abrir o app num dia de semana, o Início responde "o que acontece hoje": o card **Aula de hoje** monta o título com o nome e a sala da turma real matriculada, lista os 2 tempos da grade daquela turma (chaveada pelo **id** da turma) e marca **AGORA/ENCERRADO** pelo relógio, com as faixas de horário da própria turma. Slot sem grade mostra "A definir · A coordenação ainda não lançou a grade desta turma"; fim de semana, "Sem aula da sua turma hoje · próxima: segunda". Logo abaixo vêm os **Avisos gerais** — cada aviso tem alvo "todas" ou uma turma específica; o aluno vê os da turma **ativa** — e a esteira infinita de **Eventos da semana**, que são do Quad, não da turma: todo evento vigente aparece para qualquer aluno, com etiquetas INSCRITO / LOTADO / EM CHOQUE / NA LOJA / +BÔNUS. O que o admin muda (grade, aviso, material, evento) reflete no aluno na mesma hora.

- REGRA DE PRODUTO CONFIRMADA: grade por id de turma — turma nova nasce em branco, turma extinta sai (dec. 163/78); título com nome/sala da matrícula real (dec. 151); faixas pelo horário da turma (dec. 72); re-render ao abrir o Início (dec. 27); aviso com turma-alvo (dec. 149); eventos do Quad, sem turma-alvo (dec. 161, que revogou a 150 · DECISÃO POSTERIOR); clique em "NA LOJA" abre a página do evento e o botão de lá leva ao item exato, piscando (dec. 173, revista pela dec. 199 · DECISÃO POSTERIOR).
- SIMULAÇÃO LOCAL: o cronograma é o snapshot "Semana 30" embutido (a fonte real citada é a planilha da coordenação; a dec. 182 internaliza o módulo — DECISÃO POSTERIOR); relógio local como fonte das faixas; avisos/eventos em memória.
- DIVERGÊNCIA (dados de demonstração): `data/crono.js` diz PATAMO "SALA 4", `data/turmas-loja.js` diz "Sala 2" (o app usa a turma); professores da grade-semente não existem no banco `DOCENTES`.
- PERGUNTA PENDENTE (dossiê B): avisos devem ser da turma **ativa** (como hoje) ou de todas as matrículas do aluno?

## Etapa 11 — Missões: os blocos do dia, por turno

Na aba Missões, o bloco "Hoje · questões novas" traz os micro-blocos de **10 questões rápidas certo/errado** ligados às aulas — na demo, 8 blocos vivos: 2 das aulas de hoje e 6 revisões ("aula de ontem", "semana passada", "mês passado" — revisão espaçada D0/D+1/D+7/D+30). Os blocos são **por turma** ("cada turma com a sua vida"): cada matrícula tem sua fila, no horário dela, e o cartão herói do Início fala o turno da turma ("Bloco da manhã/tarde/noite"). Dentro do bloco, cada carta dá **feedback imediato** ("✓ Você acertou!" / "✗ Errou — gabarito: …" + comentário) e exige a autoavaliação **Errei / Difícil / Bom / Fácil**. Fim do bloco: +1 score por acerto, +5 Quad Coins pelo bloco, Domínio ajustado; o bloco some da lista; se a fonte era a aula, as 10 cartas entram no banco do Treinamento Rápido.

- REGRA DE PRODUTO CONFIRMADA: bloco = 10 rápidas com feedback imediato + autoavaliação; blocos e aba Missões inteira **por turma** (dec. 156/158/160); Introdução no Quad é da conta (dec. 157/177); bloco sem resposta **expira em 7 dias** e cai em Atrasadas, recuperável (dec. 106); revisão espaçada D0/D+1/D+7/D+30 com liberação diária às 22h15 — mecânica declarada.
- REGRA DE PRODUTO CONFIRMADA — **DROP ao fechar o bloco (dec. 194)**: concluído o bloco de 10, cada item de combate configurado com chance é sorteado; o que cai entra na mochila **sem custo, sem registro de compra e sem estorno**, anunciado pela celebração dourada (card com raios, item em destaque e o botão "Guardar na mochila"). O sorteio **não roda durante o tutorial**. Ver etapa 16.
- DADO DEMONSTRATIVO: valores +1/+5 e o tamanho de bloco 10 (dec. 185); as 60 cartas do `tr-bank.js` e as 40 do `aula-demo.js` ("Poderes administrativos"); as chances de drop do catálogo (Cantil 10%, Patch da sorte 12%).
- SIMULAÇÃO LOCAL: os blocos nascem prontos por seeds (`criadoEm = agora − idade`) — não há agendador das 22h15 nem cron das ondas D+7/D+30; o abastecimento real ("PDF 01/PDF 02 do operador") é narrativa de pipeline futuro.
- DIVERGÊNCIA (dossiê B): "Corte das missões da semana (SÁB 23h59)" e o toast "expira 23h59" são **texto sem mecânica** — a única expiração implementada é a de 7 dias; **não existem missões semanais**.

## Etapa 12 — Treinamento Rápido: o rodízio sem prazo

Pelo botão "Abrir treinamento", o aluno entra no overlay de flashcards contínuo, estilo Anki, sem prazo: abas **Gerais** (Português, Inglês, Informática, Matemática, História, Geografia) e **Específicas (Direito)**. O rodízio percorre a **árvore do edital da turma ativa** — "10 por assunto, alternando as matérias", só com assuntos que têm carta no banco — e avança PT→EN→INFO→MAT conforme o aluno fecha blocos. A segunda volta prioriza as cartas difíceis (peso Errei=3 > Difícil=2 > Bom=1 > Fácil=0); zerar a fila redistribui o baralho pela dificuldade. Cada bloco de 10 paga +1 score por acerto e +5 QdC, e o acerto desloca a barra do Domínio **do assunto, por concurso** — acertar na PC-BA não vaza para a barra homônima do CFO. Desde a dec. 202 há um **segundo caminho até o mesmo bloco**: no Painel de Domínio, cada subassunto (numerado 1.1.1) traz um **botão de play** (dec. 203) que abre a revisão daquele conteúdo específico — as cartas etiquetadas com o subassunto vêm primeiro, o pagamento é o mesmo, a barra que se move é a **do subassunto**, e o rodízio do treinamento não anda. Quem está com dificuldade num ponto vai direto nele, sem atravessar o rodízio.

- REGRA DE PRODUTO CONFIRMADA: rodízio segue o edital da turma ativa; ajuste de Domínio por concurso (dec. 159); rodízio por turma (troca de turma ativa troca a fila); revisão por subassunto direto do Domínio, sem mexer no rodízio (dec. 202).
- REGRA DE PRODUTO CONFIRMADA — **o treinamento rápido também sorteia DROP** ao fechar cada bloco de 10 (dec. 194), com a mesma mecânica da etapa 11: item na mochila sem custo e sem estorno, celebração dourada, nada disso no tutorial.
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO: rodízio, pesos, redistribuição e deslocamento do Domínio comprovados por sonda (`b3-treino-rapido.mjs`: barra 68%→74%).
- SIMULAÇÃO LOCAL: banco de questões único da demo (RN-59); autoavaliação alimenta apenas a ordenação da 2ª volta e a prova de promoção — o motor de repetição espaçada real é futuro.

## Etapa 13 — Questões e recompensas: score por acerto, Quad Coin por participação

A regra econômica que atravessa a jornada está escrita no card do Domínio: "Quad Coin sobe por **fazer** (participação). Domínio sobe por **acertar** (evidência). Acertar não rende Quad Coin." Cada contexto de questão tem seu próprio contrato de feedback e prêmio: flashcards dão feedback imediato e pagam +1 score/acerto + 5 QdC/bloco; a Introdução no Quad exige 3/3 e paga +30/+25 uma única vez; o **quiz da aula** do professor não dá gabarito na hora **nem prêmio** (as respostas alimentam o relatório pedagógico — o aluno vê o selo "AULA COM QUIZ" no card Aula de hoje e o botão só com o quiz **ativo**, terminando em "QUIZ RESPONDIDO"); o **simulado digital** corrige no fim e paga +10 score/acerto + N QdC/acerto — a exceção assumida ao princípio, por decisão do gestor.

- REGRA DE PRODUTO CONFIRMADA: participação → QdC; acerto → score/Domínio; quiz da aula por turma, sem gabarito e sem premiação (dec. 64/77/86; RN-49); simulado digital premia por acerto — única atividade gratuita com prêmio em QdC (dec. 45/117b/123/125); feedback **não é regra única** — cada motor tem a sua.
- DADO DEMONSTRATIVO: todos os bancos de questões (o PDF anexado pelo professor "vira" quiz usando bancos-semente; a extração real é `[INTEGRAÇÃO REAL]`); valores +10/+2/+20.
- SIMULAÇÃO LOCAL: professor e aluno no mesmo navegador; placar da sala por polling sintético; a resposta real do aluno entra no relatório.
- DIVERGÊNCIA (dossiê B): existe um **motor de quiz órfão** (`QUESTIONS`/`#quizLayer`, com correção no fim + botão "Vídeo de resolução" placeholder e prêmio +20 QdC) que nenhum fluxo do aluno abre — código vivo sem porta de entrada. PERGUNTA PENDENTE: removê-lo ou torná-lo a base do quiz de missão futuro?

## Etapa 14 — Bloco da noite: "Retire aqui seus benefícios"

O cartão herói do Início conta as missões vigentes do turno ("Bloco da noite · FALTAM 8", um segmento aceso por missão feita; atrasadas, simulados e a Introdução ficam fora da conta). "Continuar missão" abre a próxima pendente. Quando o aluno fecha todas (8/8 COMPLETO), o botão vira dourado — "**Retire aqui seus benefícios**" — e o resgate paga **+1 de Score por bloco da noite** (ex.: +8) **+1 Quad Coin**, com a moeda voando até o contador. Depois o botão vira "Benefícios retirados", desativado: o resgate é único, registrado **por turma**.

- REGRA DE PRODUTO CONFIRMADA: recompensa da noite concluída — botão dourado, +1 Score por bloco + 1 QdC, resgate único (dec. 26); o caráter **por turma** do resgate vem da implementação (`NOITE_RESG` chaveado pela turma ativa — cadeia das missões por turma, dec. 156 em diante), não da dec. 26.
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO: ponta a ponta na sonda `b4-noite-recompensa.mjs`.
- DADO DEMONSTRATIVO: os valores (+1/+1) são balanceamento de demo (dec. 185).
- SIMULAÇÃO LOCAL: o registro `NOITE_RESG` vive em memória (não persiste entre sessões).

## Etapa 15 — Desempenho: Quadrômetro, Domínio, ranking e carreira

O aluno acompanha seu desempenho em quatro janelas. O **Quadrômetro** (nunca "Perfil" — dec. 8) resume: score de carreira, temporada, Quad Coins, posição na turma e presença. O **Domínio** mostra a árvore do edital do concurso da turma ativa em barras térmicas por matéria→assunto→subassunto, com links externos "Assistir aula"/"Fazer questões". Os **rankings** têm a janela da sala (±2 em volta do aluno, seguindo a turma ativa) e o geral, com **privacidade de mão dupla**: quem fica privado tem o nome mascarado ("AL SD QUAD ****A") e deixa de ver os nomes alheios do 11º em diante — o **top 10 é sempre visível por inteiro** dos dois lados. A **carreira** tem 14 patentes em 4 fases: score atingir a meta apenas **libera** a prova de promoção — 20 questões certo/errado colhidas, sem o aluno saber, das que ele marcou Errei/Difícil nos flashcards; ≥80% (16/20) promove na hora, com o excedente de score transferido para a próxima patente; reprovou, nova tentativa em 24h.

- REGRA DE PRODUTO CONFIRMADA: Score ≠ QdC ≠ Dmn; score não se gasta; só a prova promove (dec. 23); prova automática sem fiscal, critério oculto, 80%, bloqueio 24h, excedente transferido; insígnias por dupla, Aluno Oficial usa a arte do Aspirante (dec. 15/16); trilha sem cadeados (dec. 133); privacidade de mão dupla com hall do top 10 (dec. 132/143); ranking da sala segue a turma ativa; economia é DA PESSOA (dec. 148).
- DADO DEMONSTRATIVO: metas das patentes (900, 3.300, …, 12.500 repetido nas 5 patentes 9ª–13ª; a Coronel, 14ª e máxima, tem `pontos: null`, sem meta — curva provável placeholder), ranking geral fictício (1.286 usuários, aluno fixo em 87º), colegas da sala, "presença 9/10" (texto fixo do HTML).
- SIMULAÇÃO LOCAL: barras do Domínio são hash determinístico **mais** o deslocamento real do treino (fora disso não medem desempenho); bloqueio de 24h sem relógio persistente; botões demo "dia de estudo (+275)" e "subir patente" marcados `[DEMO PROVISÓRIO — REMOVER]`.
- DIVERGÊNCIA (dossiê C): a variável `score` guarda **Quad Coins** (colisão de nomenclatura com o score de carreira — a maior divergência documental do projeto); `notaMin` por fase (70–85%) existe mas ninguém lê — a prova usa 80% fixo; Quadrômetro mistura números vivos com "presença 9/10" fixo.

## Etapa 16 — A Loja no cotidiano: itens, skins, físicos, eventos e simulados

Fora da compra de turma, a Quad Store é o balcão diário do aluno. **Itens do personagem**: a cadeia de skins avança um elo por vez (gandola 60 → capa de colete 120 → fuzil 200) até as fardas finais de **escolha única** (CIPE 500 / PATAMO 750 / BOPE 1300); cada compra **troca a foto do personagem na hora** — quem possui, veste, sem equipar manual. **Itens de combate** (sempre QdC) empilham na mochila e nunca saem da vitrine ("N na mochila") — **mas a vitrine só mostra o que está à venda**: item marcado como **só de drop** (o "Patch da sorte") **não aparece na Loja**, porque só se obtém por sorteio; o item vendido que também cai no drop (o Cantil) avisa na descrição "· também cai no DROP (10%)". Desde a dec. 194, a mochila tem **duas vias de entrada**: a compra e o **DROP** — conquistado ao concluir bloco de 10, treinamento rápido ou simulado digital, o item entra sem custo, sem linha na carteira (nem nas compras, nem no extrato) e sem direito a estorno, com a celebração dourada anunciando ("Guardar na mochila"). **Físicos** têm estoque decrescente com seletor de quantidade, geram pedido de retirada na recepção e, na última unidade, o item some da Loja. **Eventos pagos** vendem em uma moeda, entram como INSCRITO no carrossel, no calendário e na portaria; presencial herda a **lotação da sala** (155/85/125/185) e cheio vira LOTADO; nas páginas de evento há regras de score/coins publicadas e o garimpo (+15 QdC, uma vez). **Simulados**: o bloco do aluno mora no **Calendário** (não em Missões); o presencial é sempre vendido, com vagas por moeda, e a presença liberada na recepção paga score; o digital roda como quiz cronometrado no app. Compras com data entram no calendário; "EM CHOQUE" avisa sem impedir.

- REGRA DE PRODUTO CONFIRMADA: cadeia de skins e farda única (dec. 19); quem possui, veste (dec. 25); combate recomprável/empilhável (dec. 172, **com a ressalva da dec. 194: item só de drop nunca entra na vitrine**); DROP com disponibilidade e chance por item, configuradas pelo admin (dec. 194); estoque físico esgotou→some, pedido não trava compra (dec. 170); lotação herdada da sala (dec. 179); EM CHOQUE avisa, LOTADO bloqueia (dec. 104/107); simulados no Calendário (dec. 165); presencial sempre pago, sem QdC; digital com prêmio por acerto (dec. 117b/122/123/125/128/129); atalho "NA LOJA" abre a página do evento, cujo botão leva ao item exato (dec. 173, revista pela dec. 199); confirmação em toda compra (RN-22).
- DADO DEMONSTRATIVO: todos os preços, estoques, vagas e os 7 eventos/3 simulados-semente (datas reancoradas +8 semanas — dec. 189); regras econômicas INDEFINIDAS (dec. 185).
- SIMULAÇÃO LOCAL: as regras de score/coins publicadas na página do evento são **texto** — nenhum crédito automático por presença de evento (só o garimpo credita de verdade); o link do evento online é toast; as questões do simulado digital vêm do banco demo (o PDF só dá o nome); o presencial é encenação de agenda/logística — a prova em papel acontece fora do app; **não existe ranking de simulado** (a promessa do "Simuladão" é texto).
- DIVERGÊNCIA (dossiês D/E): evento presencial sem sala no seed nunca lota; toast "Simulado interrompido — você pode retomar depois" sem mecânica de retomada (reabrir re-sorteia e zera).

## Etapa 17 — A carteira do aluno: extrato, situação das compras e estornos de 7 dias

**O último bloco da Loja é a carteira** (`#rcCard`, "**Carteira · extrato e compras**"): desde a dec. 197, o antigo "Relatório de compras" e o "Extrato da carteira" são **um card só**. Um seletor de período (Semanal/Mensal/Trimestral/Semestral) comanda o card inteiro; no topo, quatro números — **recebido · gasto · compras · a receber** —; em seguida, "**Movimentações do período**" (filtro Tudo/Quad Coins/Diamantes), onde **cada linha é um lançamento do ledger** com o tipo da operação, de quem veio ou para quem foi, data e hora, **autor** e o **saldo depois** (DA-03, dec. 196) — inclusive o **saldo de abertura** com que o aluno entrou na demonstração; e, por baixo, a **situação das compras** do período: em andamento (turmas, isoladas e mentorias, com % de evolução), comprado aguardando retirada/realização e entregue/concluído. O "recebido" vem do extrato, não da lista de compras: por isso enxerga recompensa de missão, gift card, crédito da administração e estorno. Compra estornada **sai das listas de situação, mas o estorno permanece no extrato**.

Quase toda compra do aluno aparece no bloco "**Estornos · até 7 dias**" da Loja com contagem regressiva visível (FALTAM 7 DIAS → … → ÚLTIMO DIA → PRAZO ENCERRADO, botão morto). **Três exceções**: a compra feita **durante o tutorial** (a boina) nasce marcada e nunca entra na regra (dec. 193 — "ela faz parte do tutorial"); o **evento que já aconteceu** sai da janela pela data (dec. 192); e o item ganho no **DROP** nunca esteve nela, por não ser compra (dec. 194). O estorno é **direto, sem aprovação**: dois toques ("Estornar" → "Confirmar estorno?", que expira em 4 s), devolução na **moeda original** e desfazimento da posse por tipo — matrícula devolve a vaga à moeda usada e sai de `MATRICULAS` (se era a turma **em uso**, o app passa à matrícula restante); físico devolve estoque e cancela o pedido; evento/simulado desinscreve e sai da portaria; skin regride a cadeia ou reabre a escolha da farda; a administração é avisada em "Estornos e desistências". E o **consumo mata o estorno**: liberar a entrada na portaria, liberar o inscrito do simulado ou confirmar a entrega do físico marca a compra como consumida e a tira da janela na hora — "participar do aulão e estornar depois lesaria a empresa". A esses três gatilhos soma-se um **quarto caminho de saída** (dec. 192): **o evento realizado sai da janela pela data**, tenha o aluno comparecido ou não — não há o que estornar num evento que já aconteceu; diferente dos três gatilhos, este não marca a compra como consumida, é a data do evento que decide.

- REGRA DE PRODUTO CONFIRMADA: 7 dias corridos com contagem regressiva e dois toques (RN-26); devolução na moeda original; desfazer por tipo, incluindo vaga e turno liberados (dec. 67/100; RN-28); estorno da turma em uso → app passa à restante (dec. 162; RN-10); consumo mata o estorno pelos três gatilhos (dec. 178) **e o evento realizado sai pela data — 4º caminho (dec. 192)**; **compra do tutorial fora da regra dos 7 dias, marcada com `semEstorno` (dec. 193)**; item de DROP fora da janela por não ser compra (dec. 194); portaria sincronizada (dec. 180); estorno direto, admin apenas informado.
- DADO DEMONSTRATIVO: o prazo de 7 dias está fixo no código — política não revalidada pela dec. 185.
- SIMULAÇÃO LOCAL: devolução de Dmn é crédito local (o estorno financeiro real é gateway/banco); janela calculada sobre o relógio local.
- DIVERGÊNCIA (dossiê D): estorno de item de combate devolve o valor de **uma** compra mas esvazia **todas** as unidades daquele item da mochila (provável defeito, sem decisão que o cubra); compras vencidas ficam listadas para sempre no bloco.

## Etapa 18 — O retorno diário: o que expira e as Atrasadas

O desenho do produto quer o aluno de volta todo dia: os blocos novos "nascem quando o sistema libera (22h15 do seu dia)" e o que não foi feito não desaparece de graça — bloco sem resposta **expira em 7 dias** e cai em "**Atrasadas**", de onde "Recuperar" o reabre pagando como um bloco em dia. Abrir a aba Missões revalida a janela dos 7 dias; a lista vazia comemora ("Nenhuma missão atrasada — disciplina em dia!"). O resgate da noite zera a cada dia por turma; a Introdução feita nunca volta; eventos vencidos somem do carrossel e da Loja. **No calendário, porém, o evento presencial em que o aluno se inscreveu não some mais** (dec. 192): passado o dia, ele vira **CONCLUÍDO** — "presença registrada na portaria", quando a entrada foi liberada — ou **FALTOSO** — "evento realizado — a entrada não foi registrada", quando o dia passou sem registro. O aluno fica com o histórico do que cumpriu e do que perdeu. **O evento online continua saindo** do calendário ao vencer: ele não passa pela portaria, e sem registro de entrada não haveria como julgá-lo com justiça.

- REGRA DE PRODUTO CONFIRMADA: expiração de 7 dias por bloco com recuperação via Atrasadas; revalidação ao abrir a aba (dec. 106); evento vencido some do carrossel e da Loja (multi-dia permanece INSCRITO até o último dia — dec. 58); **no calendário, o evento presencial inscrito vira CONCLUÍDO ou FALTOSO em vez de sumir, e só o online sai (dec. 192)**.
- SIMULAÇÃO LOCAL: as 3 atrasadas-semente têm 8/9/10 dias de idade; a liberação às 22h15 é narrativa (sem agendador). **O que a recarga zera mudou na dec. 196**: o **andamento dos blocos** (`BLOCOS_TURMA`) e o resgate da noite (`NOITE_RESG`) continuam voláteis — mas **turma ativa, Quad Coins, Diamantes, score de carreira, mochila, skins, avatar, nome de guerra e o extrato voltam** pela chave `vq_evolucao` do `localStorage` (DA-10), por dispositivo.
- PERGUNTA PENDENTE (dossiê B): o que acontece com a atrasada nunca recuperada (hoje fica em Atrasadas indefinidamente)? Recuperar atrasada deveria pagar igual a bloco em dia?

## Etapa 19 — Encerramento da turma e nova matrícula

**Atualização de 03/08 (DA-06 · dec. 195/196): a turma encerrada não desaparece mais — fica ARQUIVADA.** O protótipo passou a listá-la no perfil, no bloco "**Minhas turmas · ativas e arquivadas**", com a etiqueta **ARQUIVADA** e a nota de que o histórico de desempenho, compras e materiais continua disponível para consulta (`matriculasArquivadas()` em src/07, render em src/12; a semente `rondesp-m`, encerrada em 30/06/2026, existe para demonstrar o caso). O que segue abaixo descreve o que **continua** valendo para o acesso: a matrícula vencida deixa de dar acesso às funções da turma, ainda que o registro permaneça.

Fiel ao que o dossiê A apurou: a matrícula com `fim` vencido simplesmente **some de `matriculasAtivas()`**; quando não resta **nenhuma** ativa, `checarMatricula()` liga o `appLock` e abre o `#matLayer` — "Sua turma terminou e a matrícula não foi renovada… funções bloqueadas até você entrar em uma nova turma" — e a navegação só deixa a Loja. A nova matrícula comprada na Quad Store **destrava o app e assume sozinha** (silenciosamente, como 1ª matrícula). Se a turma ativa vence **por data** restando outra vigente, `turmaAtiva()` **autocorrige silenciosamente para a primeira ativa** — sem avisar o aluno. Não existe fluxo de renovação: o pop-up fala "não foi renovada", mas o único caminho é comprar de novo na Loja. Tudo que era "da turma" (missões, ranking da sala, materiais, calendário) deixa de ser acessível com o fim da matrícula.

- REGRA DE PRODUTO CONFIRMADA: sem matrícula ativa → trava total exceto Quad Store (dec. 62; RN-03); nova matrícula destrava e assume (dec. 62); estorno de matrícula devolve moeda + vaga e libera o turno (dec. 67/100), e estornar a turma em uso passa o app à restante (dec. 162).
- SIMULAÇÃO LOCAL: vigência por comparação de datas no relógio local; o hook `window.__mat.encerrar()` existe para demonstrar a trava; a PATAMO da demo tem início 01/06/2026 e fim 15/12/2026 (datas-semente — dec. 189 recomenda datas relativas para a demo não esvaziar).
- FUNCIONALIDADE PLANEJADA: renovação de matrícula (não há fluxo de renovar), notificação prévia de fim de turma (hoje o aluno só descobre pelo pop-up).
- DIVERGÊNCIA: texto único "não foi renovada" para qualquer causa de ausência de matrícula.
- **RESPONDIDA — DA-06 (03/08)**: *o histórico da turma encerrada fica acessível ao aluno depois do fim?* **Sim** — turmas nunca são apagadas; ao encerrar passam a **arquivadas**, com histórico disponível para consulta do aluno e da administração (demonstrado no protótipo pela dec. 196).
- PERGUNTA PENDENTE (dossiê A): a autocorreção silenciosa da turma ativa no vencimento por data é o comportamento desejado? Haverá oferta de renovação automática/desconto?

---

## Onde cada etapa está demonstrada

| Etapa | Tela / parte do `src/` | Suíte(s) que a cobre(m) |
|---|---|---|
| 1 · Chegada e download | (não demonstrado — protótipo abre no login) | — |
| 2 · Cadastro no site | `#gateCriar` (src/06); `src/10` l.85–96 | `vacesso.mjs` |
| 3 · Login e vinheta | `#loginLayer`/`#splashLayer` (src/06 l.447–463); `acessarPortal`/`entrarApp` (src/10 l.44–110) | `vacesso.mjs` |
| 4 · Tutorial 29 passos | `#tutLayer` (src/06 l.284–300); roteiro `TUT` (src/10 l.181–274); Introdução/pular (src/11 l.647–812) | `vtut.mjs` (ponta a ponta) |
| 5 · Sem turma | `#matLayer` (src/06); `checarMatricula`/`appLock` (src/07 l.212–216) | `vfaseb.mjs` (trava/`__mat`), família `vfase*` |
| 6 · Gift card | bloco gift na Loja (src/03 l.255–261); resgate (src/07 l.117–133); lotes/leitor (src/16 l.258–341) | `vdmn.mjs` |
| 7 · Compra de turma | vitrine Turmas + `#turmaLayer` (src/14 l.58–148) | `vloja*.mjs`, `vturma.mjs` |
| 8 · Pop-up pós-matrícula | `#trocaLayer` (src/06 l.348–406); `matricular` (src/14) | `vq1.mjs`, `vturma.mjs` |
| 9 · Turma ativa | `definirTurmaAtiva` (src/07 l.180–206); topo/Domínio/Minhas turmas (src/12 l.40–221) | `vq1.mjs`, `vt1.mjs`, `vr1.mjs`, `vturma.mjs` |
| 10 · Aula de hoje e avisos | `#salaCard`/`renderAulaHoje` (src/08 l.524–561); avisos (src/16 l.369–449); eventos (src/08 l.46–116) | `vaula.mjs` (relógio simulado), `vhome.mjs` |
| 11 · Blocos do dia | aba Missões (src/03); `BLOCOS_TURMA`/`renderDia`/`trFimBloco` (src/11 l.29–628) | `vtr.mjs`, `vfc.mjs`, `vv1.mjs` (drop) |
| 12 · Treinamento Rápido | `#trLayer`; `trMontarFila`/`trPeso`/`trAj` (src/11 l.474–637) | `vtr.mjs`, `vv1.mjs` (drop) |
| 13 · Questões e recompensas | motores: src/11 (flashcards/Introdução), src/09 l.380–648 (quiz da aula), src/12 l.449–549 (simulado digital) | `vsim.mjs`, `vfasec.mjs` (quiz), `vtr.mjs` |
| 14 · Bloco da noite | herói do Início; `heroSync`/`resgatarBeneficios` (src/11 l.352–409) | `vbonus.mjs` |
| 15 · Desempenho | Quadrômetro `#v-perfil`; carreira/prova (src/12 l.309–432); rankings (src/12 l.105–300); Domínio (src/07 l.400–509) | `vgami.mjs`, `vprova.mjs`, `vrank.mjs`, `vperfil.mjs`, `vdmn.mjs` |
| 16 · Loja no cotidiano | vitrines (src/03 l.264–366); loja/economia (src/14); mochila/skins (src/15); eventos (src/08/17); simulados (src/11/18) | `vloja*.mjs`, `vmochila.mjs`, `vevento.mjs`, `vsim.mjs`, `vv1.mjs` (drop/vitrine) |
| 17 · Carteira e estornos | "Estornos · até 7 dias" + card único "Carteira · extrato e compras" `#rcCard` (src/03 l.363–388; `renderRelCompras`/`renderExtrato` em src/19); ledger em src/07 (`LEDGER`/`ledgerLancar`/`ledgerOp`); consumo nas Liberações (src/17 l.367–550) | `vfased.mjs`, `vk1.mjs`, `vo1.mjs`, `vu1.mjs`, `vv1.mjs` (tutorial/evento realizado), **`vw1.mjs`** (ledger, extrato e carteira unificada) |
| 18 · Retorno diário | Atrasadas/`DIA_EXPIRA_DIAS` (src/11 l.29–71); `showView` revalida (src/07 l.370–374) | `vtr.mjs`, `vi1.mjs`, `vr1.mjs`, `vv1.mjs` (CONCLUÍDO/FALTOSO) |
| 19 · Encerramento e nova matrícula | `matriculasAtivas`/`matriculasArquivadas`/`turmaAtiva` autocorreção (src/07); "Minhas turmas · ativas e arquivadas" (src/12); `#matLayer` (src/06) | `vfaseb.mjs`, `vturma.mjs`, família `vfase*`, **`vw1.mjs`** (turma arquivada) |

> As suítes em `tests/` são o **critério de aceite oficial** do protótipo (dec. 190); as sondas dos dossiês A–E (`scratchpad/handoff-inv/`) comprovaram cada etapa em execução real no Chromium em 02/08/2026.
