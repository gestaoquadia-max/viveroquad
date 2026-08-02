# 01 · Visão geral do produto — Viver o Quad

**Pacote de handoff para o engenheiro de software** · Data: 02/08/2026
**Fonte de verdade funcional: o protótipo navegável** (`/home/user/viveroquad`, fonte em `src/`, build `index.html`) **+ as 56 suítes de regressão em `tests/`** (dec. 190). Apoio documental: `docs/arquitetura/00-arquitetura-oficial.md` (Consolidação v1.0, hierarquia máxima), `docs/02-registro-de-decisoes.md` (dec. 1–191), `docs/auditoria/` (14 docs, 30/07/2026) e o relatório rev. 2.3 (documento-base do produto, pendente de revisão desde a dec. 11).

Rótulos de classificação usados neste pacote: **FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO** · **SIMULAÇÃO LOCAL** · **REGRA DE PRODUTO CONFIRMADA** · **DADO DEMONSTRATIVO** · **DECISÃO POSTERIOR** · **FUNCIONALIDADE PLANEJADA** · **DIVERGÊNCIA** · **PERGUNTA PENDENTE**.

---

## 1. O que é o Viver o Quad

O **Viver o Quad** é o app-plataforma da jornada do aluno do **Quad Concursos** — cursinho preparatório para concursos militares e policiais da Bahia (PM-BA CFO e Soldado, PM de fronteiras, Polícia Penal, Polícia Civil, PRF — dec. 46). Ele acompanha o aluno do primeiro contato com o curso até o "dia da farda": a aprovação e a incorporação na carreira que ele persegue.

Desde a **Consolidação Arquitetural v1.0 (01/08/2026, dec. 182)**, o Viver o Quad deixou de ser "um app satélite de uma plataforma-base externa" (premissa do relatório rev. 2.3) e passou a ser **a plataforma principal do Quad Concursos**. Onze capacidades antes tratadas como sistemas externos viraram **módulos internos** da plataforma: cadastro, autenticação, matrículas, produção de materiais, banco de questões, simulados, inteligência pedagógica, loja, administração, relatórios e cronogramas. Permanecem **fora** (integrações a definir): site e checkout, pagamentos/financeiro, plataforma de cursos (legado em avaliação), notificações push/e-mail e telemetria como serviço de dados. DECISÃO POSTERIOR — a mudança é **exclusivamente arquitetural**: nada foi implementado; módulo sem especificação suficiente é "Módulo Planejado" (dec. 184).

O produto reúne, num único aplicativo, **três experiências conectadas**:

| Persona | O que faz no app |
|---|---|
| **Aluno** | Vive a jornada: aula de hoje, missões diárias, treinamento, carreira gamificada, Domínio do edital, eventos, simulados, Quad Store, materiais, chat de recados |
| **Professor** | Painel das próprias turmas, quiz ao vivo da sala com relatório pedagógico, agenda/calendário, recados da administração |
| **Administração (N.P.P.)** | Governança completa da operação: docentes, turmas, cronograma, comunicação, moedas, eventos, simulados, materiais, portaria/recepção, catálogo e preços, relatórios |

No protótipo, tudo isso "conversa em tempo real" porque as três personas compartilham o mesmo estado no mesmo arquivo — o quiz que o professor cria é o objeto que o aluno responde; a turma que o admin cria é o item vendido na Loja. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO (dentro da sessão) + SIMULAÇÃO LOCAL (não há rede nem servidor).

## 2. Qual problema o produto resolve

O concurso militar é uma maratona de meses ou anos, e o principal inimigo do aluno é a **inconstância**: parar de estudar, perder o ritmo das revisões, se afastar da sede. O Viver o Quad ataca esse problema em duas frentes:

1. **Engajamento e constância do estudo.** O app transforma o dia de estudo em ciclo diário fechado: aula de hoje → blocos de 10 questões rápidas ligados às aulas (revisão espaçada D0 · D+1 · D+7 · D+30 — mecânica declarada no código, executada por seeds no protótipo) → treinamento contínuo estilo Anki → recompensa visível ao fechar a noite ("Retire aqui seus benefícios"). REGRA DE PRODUTO CONFIRMADA na mecânica; os valores de recompensa são DADO DEMONSTRATIVO (dec. 185: regras econômicas indefinidas). A métrica-mãe declarada no documento-base (rev. 2.3) é o **retorno espontâneo** do aluno (sessões `OPEN_ORGANIC`) — no protótipo, a telemetria existe apenas como texto estático (SIMULAÇÃO LOCAL; medição real é pré-requisito pendente da V0).
2. **Ponte aluno ↔ sede.** O app liga a vida presencial do curso à vida digital do aluno: cronograma e sala da turma, avisos da coordenação, materiais das aulas, inscrição em eventos e simulados, portaria/recepção que libera entradas e entregas, gift cards vendidos fisicamente e resgatados no app, mensagens da administração. Tudo que a administração faz reflete na tela do aluno (na mesma sessão do protótipo). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO · SIMULAÇÃO LOCAL.

## 3. Público inicial

O público da V0 é o **aluno presencial** das turmas da sede do Quad — as modalidades demonstradas usam apelidos de unidades policiais (RONDESP, PATAMO, BOPE — apelidos de tipos de turma: nivelamento, regular e questões, dec. 138), voltadas aos concursos PM-BA/CFO, Soldado e correlatos. O relatório rev. 2.3 fasea a V0 como "prova de vida": piloto de ~30 dias com coorte pequeno e interno. As turmas, salas (Salas 1–4 + Estúdio), horários e preços do protótipo são DADO DEMONSTRATIVO.

**Expansão para alunos online = FUNCIONALIDADE PLANEJADA.** O protótipo já vende "cursos online", "mentoria" e "eventos online · YouTube e lives exclusivas" como itens de catálogo, e o texto do professor amarra "as atividades online" à V1; `LINKS_ONLINE` foi preservado no código como ponto de integração planejado (dec. 188). A "plataforma de cursos" permanece sistema externo, legado em avaliação (dec. 182). Nada disso tem fluxo online real implementado.

## 4. A função da gamificação: motor de constância, não enfeite

A gamificação é a espinha dorsal do engajamento — não uma camada cosmética. Ela dá ao aluno **identidade, progressão de longo prazo e recompensa de curto prazo**:

- **Identidade militar.** No primeiro acesso, o tutorial obrigatório do mascote **QUAD** (29 passos) faz o aluno escolher o **personagem** (12 avatares da coleção PM, escolha definitiva — dec. 24) e o **nome de guerra** (derivado do nome completo, regra de subsequência ordenada), formando a identificação `AL SD QUAD <NOME>` (dec. 18). REGRA DE PRODUTO CONFIRMADA. As skins e itens comprados "vestem" o personagem ("quem possui, veste", dec. 25).
- **Carreira e patentes.** O **Score de carreira** (que não é moeda e nunca se gasta) acumula por esforço e libera a **prova de promoção**: 20 questões que o próprio aluno marcou como difíceis, 80% promove, reprovação bloqueia por 24h — subindo por **14 patentes em 4 fases** (Aluno Soldado → Coronel), cada uma com **insígnia** (dec. 15/16/23). REGRA DE PRODUTO CONFIRMADA (mecânica); metas e valores são DADO DEMONSTRATIVO.
- **Economia de participação.** **Quad Coin (QdC)** nasce por *fazer* (participação: blocos, noite completa, eventos, garimpo) e se gasta na **Quad Store**; **Diamante (Dmn)** é comprado em dinheiro real (recarga no site ou gift card) e nunca conquistado em missão (dec. 48). Score sobe por esforço, Domínio por acerto, QdC por participação — separação REGRA DE PRODUTO CONFIRMADA. **Todos os valores econômicos (preços, recompensas, metas) são DADO DEMONSTRATIVO: a dec. 185 declara as regras econômicas INDEFINIDAS e proíbe inventá-las.**
- **Comparação social dosada.** Rankings da sala (segue a turma ativa) e geral, com privacidade de mão dupla e top 10 sempre visível (dec. 132/143). REGRA DE PRODUTO CONFIRMADA.
- **Recompensa diária.** O cartão herói do Início conta as missões da noite e, completas, paga o bônus do turno — o loop que faz o aluno voltar todo dia (dec. 26).

FUNCIONALIDADE PLANEJADA nesta frente: Quests/forja de itens, Guarnições/GvG/PvP (V2), "Prestígio" pós-Coronel, Intendência plena — anúncios bloqueados na interface, sem mecânica.

## 5. A função da inteligência pedagógica

**O que existe hoje (protótipo):**

- **Domínio** — a árvore do edital do concurso da turma ativa, com barra por matéria → assunto → sub-assunto. Os percentuais de base são **sintéticos** (hash determinístico do nome do nó — SIMULAÇÃO LOCAL), mas são **deslocados por cálculo real**: cada bloco de flashcards respondido ajusta a barra do assunto, **por concurso** (dec. 159 — acerto na PC-BA não vaza para matéria homônima do CFO). REGRA DE PRODUTO CONFIRMADA (mecânica do ajuste).
- **Autoavaliação** Errei/Difícil/Bom/Fácil em cada carta, que redistribui o baralho do treinamento e alimenta a prova de promoção (dec. 23). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- **Leituras para a gestão**: relatório pedagógico por turma na árvore do edital dela (dec. 167), "Dificuldades por aluno" e "Alunos que precisam de apoio" (que misturam o aluno real da sessão com casos-semente), com botão "Acionar" que abre mensagem pronta. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO + DADO DEMONSTRATIVO.
- **Leitura da sala pelo professor**: o quiz ao vivo não premia nem dá gabarito ao aluno — as respostas alimentam só o relatório por questão (dec. 64). REGRA DE PRODUTO CONFIRMADA.
- **Histórico pedagógico**: simulados realizados e respostas entram no histórico "para fins pedagógicos" (dec. 47).

**O que é planejado (não existe em nenhuma forma):** o módulo interno **"Inteligência pedagógica"** da Consolidação v1.0 é **Módulo Planejado** (dec. 182/184). Alertas automáticos, recomendações de estudo, videoaulas de reforço e o IRA (índice de risco de abandono, citado na rev. 2.3 como fast-follow) **não existem no protótipo em nenhuma forma** — varredura confirmada pelo dossiê de investigação F. A telemetria real (coleta de eventos com taxonomia de origem) permanece "a decidir" como serviço de dados. FUNCIONALIDADE PLANEJADA. As salvaguardas de privacidade declaradas para o perfilamento não têm desenho técnico (pendência registrada, dec. 186).

## 6. O papel do aluno

O aluno é o centro do produto. Com **uma conta** (identificada pelo e-mail) ele acumula **matrículas** em turmas compradas na Quad Store — limitadas por turno e por choque de horário (dec. 62/101) — e **uma turma ativa** comanda o que o app mostra: aula de hoje, avisos, missões do dia, ranking da sala, Domínio, calendário e quiz (trocável a qualquer momento, dec. 146). O que é **da pessoa** atravessa as turmas: score/carreira/patente, Quad Coins e Diamantes, mochila/itens/skins/avatar, nome de guerra, compras (dec. 148). REGRA DE PRODUTO CONFIRMADA.

No dia a dia, o aluno: abre o Início e vê o que acontece hoje; cumpre os blocos de missões e o treinamento rápido; retira o benefício da noite; acompanha sua carreira no **Quadrômetro** (dec. 8 — nunca "Perfil"); consulta o Domínio; se inscreve em eventos e simulados; compra e estorna (até 7 dias, "consumo mata o estorno" — dec. 178) na Quad Store; baixa materiais; recebe recados da administração. Sem matrícula ativa, o app trava e só a Quad Store fica acessível (dec. 62). REGRA DE PRODUTO CONFIRMADA.

## 7. O papel do professor

O professor tem área própria com login individual (e-mail funcional + senha — dec. 85; no protótipo o e-mail é derivado do sobrenome e a senha inicial é `quad1234`, SIMULAÇÃO LOCAL). Seus dados cadastrais são governados **pelo admin** (Banco de professores); ele só troca a própria foto e senha. O que ele faz:

- Vê **as turmas em que está inserido**, a aula de hoje (com selos AGORA/ENCERRADO), seus eventos e o calendário — tudo derivado da grade e dos cadastros do admin.
- Conduz o **quiz ao vivo** da sala: anexa PDF (na demo, só o nome do arquivo — a extração é `[INTEGRAÇÃO REAL]`), define tipo/questões/tempo, ativa na hora da aula, acompanha o placar e lê o relatório por questão. Um quiz por turma; sem gabarito e sem premiação ao aluno (dec. 64/77/86). REGRA DE PRODUTO CONFIRMADA.
- Consulta seus números de trabalho por período e lê recados da administração (responder é "EM BREVE — V1", FUNCIONALIDADE PLANEJADA).

O que ele **não** faz: não cadastra questões, **não publica materiais** (entrega à coordenação, que publica — dec. 144; PERGUNTA PENDENTE se terá canal próprio), não participa da Loja nem dos simulados. Bloqueio ou desligamento pela coordenação derruba a sessão dele na hora, com recado cordial (dec. 89). REGRA DE PRODUTO CONFIRMADA.

## 8. O papel da administração (N.P.P.)

A área administrativa — a persona do **N.P.P.** (núcleo do Quad responsável pela operação pedagógica) — é a **fonte de governança de toda a operação**, organizada em 5 áreas (Controle · Interno · Relatórios · Liberações · Loja, dec. 51) mais Estrutura/Edital/Questões:

- **Pessoas e contas**: Banco de professores (cadastrar, editar, desligar, bloquear, apagar — com propagação a turmas, eventos e sessões); bloqueio de contas de aluno com suspensão imediata (dec. 52); crédito manual de moedas com motivo e histórico; gift cards em lote com QR de liberação única (dec. 66).
- **Estrutura de ensino**: criação de turmas e isoladas (concurso, professores por matéria da árvore do edital, sala com validação de lotação e choque de agenda, preços e **vagas por moeda** — dec. 155/179); concursos e árvores de edital ("Definir Domínio"); cronograma por turma que reflete no aluno e no professor na hora (dec. 91/163).
- **Dia a dia**: avisos por turma-alvo (dec. 149), materiais das aulas (turma → matéria → assunto → tipo, com download real — dec. 144/164), eventos do Quad (dec. 161) com reserva de sala/Estúdio, simulados presenciais e digitais (dec. 117b/122/123), skins e itens de combate, mensagens por público (dec. 181).
- **Recepção/portaria**: liberar entradas de eventos e simulados (a liberação pontua score e **consome a compra**, matando o estorno — dec. 128/129/178/180) e confirmar entregas de produtos físicos.
- **Leitura**: relatórios individuais, pedagógicos por turma, gerais e da Loja (gráficos em CSS/HTML puro, dec. 55 — misturando dados vivos da sessão com números sintéticos, DADO DEMONSTRATIVO).

No protótipo, o portão do admin valida apenas a chave `NPP-2026` — o e-mail aceita qualquer coisa com `@`. DIVERGÊNCIA conhecida (a intenção declarada é chave emitida e revogada pela direção, por pessoa) + SIMULAÇÃO LOCAL. PERGUNTA PENDENTE: quantos papéis administrativos existirão e com quais permissões.

## 9. Protótipo × aplicação real — a seção honesta

**O protótipo é a fonte de verdade funcional deste projeto — e é só isso que ele é.** A diferença para a aplicação real não é de polimento; é de natureza:

- **Tudo roda local.** O protótipo é um único arquivo HTML (~9,4 MB, com todas as mídias embutidas em base64), gerado das 20 partes de `src/` por `build.py`/`build.ps1`, funcionando 100% offline — **zero chamadas de rede**. Todo o "banco de dados" são arrays e objetos JavaScript em memória, num único IIFE sem módulos, com as três personas compartilhando o mesmo estado. CONFIRMADO pela auditoria de 30/07.
- **Nada persiste.** Recarregar a página (F5) apaga moedas, compras, matrículas, mensagens e progresso. As únicas sobrevivências são **2 chaves de `localStorage`** (`vq_tut_skip` e `vq_intro_done`). Não há conta, sessão nem servidor.
- **Nada autentica.** O login do aluno aceita qualquer e-mail com `@` e qualquer senha; o portão do admin valida só a chave; os gates são overlays visuais. As 23 marcações `[INTEGRAÇÃO REAL]` no fonte são o mapa das costuras com o mundo real. Os riscos de segurança e LGPD da auditoria estão **registrados como pendências, sem nenhuma solução implementada** (dec. 186) — bloqueantes para qualquer versão com dado real.
- **Números não são política.** Preços, saldos, recompensas, metas de patente, vagas e catálogos são **cenografia de demonstração** (DADO DEMONSTRATIVO). As regras econômicas permanecem INDEFINIDAS por decisão (dec. 185) — é proibido inventá-las.
- **A especificação é a experiência.** O que o protótipo *faz* — cada fluxo, validação, toast, regra de bloqueio — é a especificação funcional que o engenheiro deve honrar. Ela é acompanhada de uma **especificação executável**: as **56 suítes Playwright versionadas em `tests/`**, com `verify.py` (build + regressão) como portão de aceite oficial (dec. 190) e ~31 hooks `window.__*` como contrato de teste. Em conflito entre documentos, vale a hierarquia: `docs/arquitetura/00-arquitetura-oficial.md` → registro de decisões → auditoria → rev. 2.3; em dúvida sobre comportamento, **vale o código e as suítes**.
- **O que falta é o produto inteiro.** Back-end, banco de dados, autenticação/RBAC, ledger auditável da economia, pagamentos, tempo real multiusuário, extração de PDFs, telemetria, notificações, persistência por conta — cada módulo interno da Consolidação v1.0 é "Módulo Planejado" até ganhar especificação aprovada. **É proibido implementar módulo sem especificação aprovada e descrever módulo planejado como implementado** (arquitetura oficial, §8).

Em resumo: o protótipo mostra **o que** o produto é e **como ele se comporta**, com fidelidade testada; a aplicação real ainda precisa de **todo o como técnico** — e este pacote de handoff existe para que nada do "o quê" se perca nessa travessia.

---

*Próximo documento: [02](./02-jornada-do-aluno.md) — a jornada do aluno em detalhe. O mapa completo do pacote está no [README](./README.md).*
