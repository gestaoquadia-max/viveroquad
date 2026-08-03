# 04 — Decisões posteriores e divergências

**Handoff "Viver o Quad" · 02/08/2026.** Protótipo = fonte de verdade (`/home/user/viveroquad`, `index.html` gerado das 20 partes de `src/` + seeds de `data/`).
**Fontes:** dossiês A–F da investigação de handoff (02/08/2026, com sondas Playwright verdes), `docs/auditoria/10-divergencias-e-decisoes-pendentes.md` (status atualizado em 01/08) e `docs/02-registro-de-decisoes.md` (dec. 1–197; 182–191 = Consolidação Arquitetural v1.0 e refatoração autorizada; 192–194 = rodada de 02/08 incorporada na revisão de 03/08 — fichas A28, A29 e A30; **195–197 = rodadas de 03/08 — fichas A31, A32 e A33**) e `docs/arquitetura/02-decisoes-administrativas.md` (DA-01…DA-10).

**Escopo:** este documento registra **apenas o que modifica o que existia antes** — no código ou na documentação. Funcionamento normal do protótipo está nos docs 01–03 do handoff e nos dossiês. Duas seções:

- **A — Decisões posteriores**: o protótipo demonstra (ou demonstrava) um comportamento; uma decisão posterior o altera ou re-enquadra.
- **B — Divergências confirmadas**: conflito real código × documentação × decisão, verificado pelos investigadores com evidência. Sem opinião; só o confirmado.

Regra de precedência vigente (Q0, respondida em 01/08): `docs/arquitetura/00-arquitetura-oficial.md` prevalece sobre qualquer documento anterior; ao citar decisões, vale sempre a mais recente da cadeia.

---

## A · DECISÕES POSTERIORES

Formato de cada ficha: **Comportamento anterior · Decisão atual · Fonte (nº e data) · Impacto funcional · Impacto na futura implementação · Precisa ajustar o protótipo?** (sim / não / aguarda especificação).

### A1 · Dec. 183 — O cadastro deixa de ser exclusivo do site

- **Comportamento anterior:** dec. 5/6 (14/07) previam cadastro no app com preenchimento automático; a dec. 21 (20/07) inverteu: "cadastro no site (checkout), não no app" — o app só faz login, e "Criar conta" leva ao portão "Cadastro no site do Quad" (toast demo). É esse portão que o protótipo demonstra até hoje.
- **Decisão atual:** a **dec. 21 foi REVOGADA** — o cadastro passa a pertencer à arquitetura do app, como módulo interno ("Módulo Planejado", sem especificação). O fluxo novo **não foi implementado**: a própria decisão determina manter o portão do site **como demonstração** até a especificação do módulo.
- **Fonte da decisão:** dec. 183, 01/08/2026 (Consolidação v1.0); Q9 da auditoria marcada [RESPONDIDA].
- **Impacto funcional:** nenhum no protótipo — o comportamento demonstrado permanece vigente na demo.
- **Impacto na futura implementação:** especificar o módulo de cadastro (campos, relação com o checkout externo — pagamentos seguem fora, dec. 182 —, matrícula presencial/manual, recuperação de acesso).
- **Precisa ajustar o protótipo?** **Aguarda especificação** (manutenção do portão é determinação expressa da própria decisão).

### A2 · Dec. 182 + 184 — Viver o Quad vira a plataforma principal; onze módulos internos

- **Comportamento anterior:** premissa da rev. 2.3 §14 + dec. 21/22: o app é satélite — conta, matrícula, dados do aluno, materiais, banco de questões etc. viviam em sistemas externos (site, planilha da coordenação, plataforma-base); o app apenas consome (ex.: `DB_ALUNO` "chega do banco geral", rodapé "atualizado pela planilha da coordenação").
- **Decisão atual:** o Viver o Quad é **a plataforma principal do Quad Concursos**; **11 capacidades viram módulos internos**: cadastro, autenticação, matrículas, produção de materiais, banco de questões, simulados, inteligência pedagógica, loja, administração, relatórios e cronogramas. Seguem externos: site/checkout, pagamentos, plataforma de cursos (legado em avaliação), notificações e telemetria (a decidir). A dec. 184 fixa: módulo sem especificação suficiente = **"Módulo Planejado"** (objetivo, responsabilidade, dependências; **sem implementação parcial**). As dec. 6 e 22 ficam formalmente superadas.
- **Fonte da decisão:** dec. 182 e 184, 01/08/2026 (Consolidação v1.0; documento oficial `docs/arquitetura/00-arquitetura-oficial.md`).
- **Impacto funcional:** nenhum — mudança exclusivamente arquitetural; nada foi implementado.
- **Impacto na futura implementação:** enorme — muda a propriedade de tudo o que o protótipo simula. Nenhum contrato de integração existe ainda (Q19 reescopada: separar fronteiras internas × integrações externas nas 23 marcas `[INTEGRAÇÃO REAL]` — eram 24 na auditoria de 30/07; 23 após a dec. 188).
- **Precisa ajustar o protótipo?** **Não** (a demonstração permanece); os módulos aguardam especificação.

### A3 · Dec. 185 — Economia indefinida: todos os valores viram dado demonstrativo

- **Comportamento anterior:** os números do protótipo (recompensas +1/+5/+10/+15/+20/+25/+30/+275, metas de patente 900→12.500, preços 20–2.800, saldos-semente 1.240 QdC/150 Dmn, janela de estorno, `rec` padrão 2 etc.) podiam ser lidos como especificação.
- **Decisão atual:** as **regras econômicas permanecem INDEFINIDAS** (não estudadas); a estrutura da loja foi preservada e **nenhuma regra nova foi criada**. Consequência prática registrada por todos os dossiês: **as mecânicas são regra de produto confirmada; os valores são placeholders de balanceamento**.
- **Fonte da decisão:** dec. 185, 01/08/2026 (Consolidação v1.0); Q5/Q7/Q8/Q18 da auditoria seguem [ABERTA].
- **Impacto funcional:** nenhum no protótipo; muda a leitura do que ele mostra.
- **Impacto na futura implementação:** nenhum valor pode ser implementado como definitivo sem o estudo econômico (dono: produto + Gestor da Economia); inclui preços, câmbio QdC×Dmn, metas de patente, prêmios e a janela de 7 dias do estorno.
- **Precisa ajustar o protótipo?** **Não.**

### A4 · Dec. 186 — Riscos de segurança re-enquadrados como pendências

- **Comportamento anterior:** a auditoria de 30/07 apontou riscos (autenticação fake, hooks `window.__*` expostos, controle de acesso a arquivos só de exibição etc.) sem destino formal.
- **Decisão atual:** os riscos ficam **registrados como pendências para a fase de desenvolvimento**; nenhuma solução implementada no protótipo.
- **Fonte da decisão:** dec. 186, 01/08/2026.
- **Impacto funcional:** nenhum. **Impacto na implementação:** os riscos são backlog obrigatório do desenvolvimento real.
- **Precisa ajustar o protótipo?** **Não** (por decisão).

### A5 · Dec. 187 + 188 + 190 + 191 — Refatoração autorizada (impacto só técnico)

- **Comportamento anterior:** monolito `src.html` (11.920 linhas — estado histórico pré-dec. 187/188; o fonte atual são as 20 partes de `src/`, ~11.750 linhas); seeds embutidos no fonte; as suítes Playwright fora do repositório (56 à época da dec. 190; 57 hoje); código morto acumulado (duplicata de `hojeISO`, fluxo revogado de autorização de dispositivo, chaves `vq_*` nunca lidas, `openQuiz`/`fmtSync`/`tutDadosOk`).
- **Decisão atual:** **187** — fonte dividido em `src/` (20 partes; saída byte-idêntica; regra de trabalho: editar as partes); **188** — código morto removido com regressão completa verde (`LINKS_ONLINE` preservado como ponto de integração planejado; o bug do reset que não limpava `vq_intro_done` foi **mantido aberto por exigir decisão**; **corrigido na dec. 196** — ver B22); **190** — as suítes entram versionadas em `tests/` (56 à época; 57 com a `vv1.mjs` da dec. 194; **58 hoje**, com a `vw1.mjs` da dec. 196) e `verify.py` (build + regressão) vira o portão de aceite oficial; **191** — 19 conjuntos de dados demonstrativos extraídos para `data/` como fragmentos verbatim (tokens `__SEED_*__`).
- **Fonte da decisão:** dec. 187, 188, 190, 191 — todas de 01/08/2026.
- **Impacto funcional:** **nenhum** (byte-idêntico comprovado; regressão verde). **Impacto na implementação:** organização do repositório e critério de aceite; F2–F6 da refatoração seguem suspensas.
- **Precisa ajustar o protótipo?** **Não** (exceto o bug do reset, que aguarda decisão — B22).

### A6 · Dec. 189 — Reancoragem das datas-semente (+8 semanas)

- **Comportamento anterior:** eventos-semente com datas fixas de 22–27/07 e 01/08, vencidas no calendário real — a demo esvaziava.
- **Decisão atual:** datas dos **eventos** deslocadas +8 semanas (16–21/09 e 26/09/2026), preservando os dias da semana; nenhuma regra alterada. **O `data/crono.js` não foi reancorado** (segue "Semana 30", 20–24/07 — ver B7) nem a matrícula-semente da PATAMO (início 01/06). Recomendação registrada: datas relativas.
- **Fonte da decisão:** dec. 189, 01/08/2026.
- **Impacto funcional:** demo volta a exibir eventos vigentes. **Impacto na implementação:** nenhum (dado de demonstração).
- **Precisa ajustar o protótipo?** **Sim** (manutenção recorrente enquanto as datas forem absolutas; idealmente migrar para datas relativas — decisão técnica).

### A7 · Dec. 17 — Mascote QUAD e tutorial obrigatório; do "19 etapas" aos 29 passos reais

- **Comportamento anterior:** dec. 3 (mascote "Danilo") e dec. 7 (tour de 9 passos, Anterior/Próximo).
- **Decisão atual:** mascote renomeado **QUAD**; tour substituído por **tutorial obrigatório** — a dec. 17 registra "19 etapas", mas o roteiro **vigente no código tem 29 passos** (array `TUT` em src/10; suíte `tests/vtut.mjs` é o critério de aceite). **Evidência atualizada em 03/08 (dec. 197):** o contador `#tutStepN`, que exibia "1 / 29" no balão e servia de evidência do número, **não existe mais** — nem no HTML nem no JS; a contagem hoje se verifica no próprio array (29 entradas) e a classe CSS `.tut-etapa` permanece apenas porque a central de tutoriais a usa, fruto de expansões posteriores nunca retropropagadas ao registro (confirmações de avatar/nome, pronome por gênero — dec. 176).
- **Fonte da decisão:** dec. 17, 19/07/2026 (+ dec. 176, 28/07); auditoria doc 10 §1.2 (Q3 [ABERTA]).
- **Impacto funcional:** o número documentado (9 ou 19) não bate com o app; roteiros de demonstração baseados nele falham.
- **Impacto na futura implementação:** o roteiro de referência é o dos 29 passos do código/suíte, até o gestor validar formalmente os beats extras (Q3).
- **Precisa ajustar o protótipo?** **Não** — ajustar o **registro** (documental) e obter a validação do gestor.

### A8 · Dec. 105 — Instrução com botão "Pular"; pular reproduz o estado final

- **Comportamento anterior:** dec. 7/17 — tutorial só no 1º acesso, sem pular.
- **Decisão atual:** a Instrução do QUAD "abre em todo acesso" com botão **Pular**; pular reproduz o estado final de quem concluiu (boina equipada + 5 QdC + score da Introdução). O código materializa "todo acesso" via `vq_tut_skip` — abre em todo login **até** a primeira conclusão/pulo (conflito de leitura registrado em B2).
- **Fonte da decisão:** dec. 105, 26/07/2026.
- **Impacto funcional:** onboarding pulável com estado consistente (comprovado por sonda: 30 score / 5 QdC / boina / `vq_tut_skip=1`).
- **Impacto na futura implementação:** definir a semântica de "todo acesso" (Q4) antes de implementar a persistência real do tutorial.
- **Precisa ajustar o protótipo?** **Aguarda decisão** (Q4 — produto).

### A9 · Dec. 11 × rev. 2.3 — Score × Quad Coin

- **Comportamento anterior:** rev. 2.3, Anexo A, princípio 2: "**Score não é moeda e não é gasto**"; Quadcoin nasceria por Marcos de Conquista (nunca conversão direta); economia só na V1.
- **Decisão atual:** o gestor rebatizou a pontuação de participação como **"Quad Coin" gastável na Loja** (a própria dec. 11 registra "⚠️ diverge da rev. 2.3; o documento-base precisa de revisão"). O protótipo separa corretamente os conceitos (3 acumuladores de score de carreira ≠ moeda QdC ≠ Dmn), mas a **mecânica** demonstrada é conversão direta por atividade (+5/bloco, +2/acerto no digital, garimpo +15…), sem Marcos/Score Qualificado/ledger do Anexo A.
- **Fonte da decisão:** dec. 11, 14/07/2026; auditoria doc 10 §1.4 (Q5 [ABERTA]); a rev. 2.4 prometida nunca saiu.
- **Impacto funcional:** nenhum no protótipo (a decisão do gestor prevalece); o documento-base descreve outra economia.
- **Impacto na futura implementação:** a rev. 2.4 precisa absorver o modelo demonstrado **ou** declarar o Anexo A como alvo — pré-condição da modelagem econômica (dec. 185).
- **Precisa ajustar o protótipo?** **Não** — ajustar o **documento-base** (produto; Danilo Moura + Vitor França). Correlato técnico: renomear `var score` (B14).

### A10 · Dec. 161 — Eventos são do Quad; revogada a segmentação por turma

- **Comportamento anterior:** dec. 150 (28/07, mesma rodada) havia criado o campo "Quem vê este evento" (todas ou uma turma).
- **Decisão atual:** **revogação explícita** — "são eventos do Quad, não da turma": todo evento vigente aparece para qualquer aluno; o campo foi removido. **Avisos continuam por turma** (dec. 149).
- **Fonte da decisão:** dec. 161, 28/07/2026 (comentário no código, src/08 l.64–65).
- **Impacto funcional:** carrossel e página de evento sem filtro de turma (comprovado nas sondas B/E).
- **Impacto na futura implementação:** o modelo de eventos não tem segmentação; se algum dia voltar, é decisão nova de produto (vale também para a pergunta análoga dos simulados — hoje igualmente "do Quad").
- **Precisa ajustar o protótipo?** **Não** (já implementado).

### A11 · Dec. 165 — Simulados moram no Calendário

- **Comportamento anterior:** o bloco de Simulados (lista + histórico) vivia na aba **Missões** (cadeia dec. 42/43/45→47).
- **Decisão atual:** o bloco **sai de Missões e vai para o Calendário**, logo abaixo da agenda (`#simuladosList` + `#simHistCard` na view `v-calendario`).
- **Fonte da decisão:** dec. 165, 28/07/2026.
- **Impacto funcional:** implementado e comprovado (sonda E-S3: INSCRITO aparece no Calendário); Missões fica só com blocos/atrasadas/treinamento.
- **Impacto na futura implementação:** a arquitetura de navegação do módulo Simulados parte do Calendário; qualquer documentação que os situe em Missões está defasada.
- **Precisa ajustar o protótipo?** **Não.**

### A12 · Dec. 178 — Consumo mata o estorno

- **Comportamento anterior:** dec. 67 (24/07) — estorno em até 7 dias, sem exceção: era possível participar do aulão/retirar o produto e estornar depois.
- **Decisão atual:** **complementa a 67**: liberar a entrada na portaria, liberar o inscrito do simulado ou confirmar a entrega física marca a compra como **consumida** e a tira da janela de estorno na hora ("participar do aulão e estornar depois lesaria a empresa"). Os três gatilhos foram comprovados por sonda (dossiê D).
- **Fonte da decisão:** dec. 178, 28/07/2026 (com a dec. 180 — portaria sincronizada).
- **Impacto funcional:** implementado; a linha sai de "Estornos · até 7 dias" no ato do consumo. **Desde a dec. 196, todo estorno também lança no ledger** — inclusive o de **item de combate** —, com `ledgerOp({ tipo: 'estorno · <item>', origem: 'Quad Store', autor: <aluno> })` (src/19): a devolução aparece como entrada no extrato da carteira, com autor e saldo resultante, ainda que a compra estornada saia das listas de situação. **Desde a dec. 192 (02/08) existe um QUARTO caminho de saída da janela**, que não é consumo: o **evento já realizado** sai pela data (`renderEstornos` descarta a compra de tipo `evento` quando `evAcabou` é verdadeiro), tenha havido presença ou não — ver ficha A28. E a dec. 193 acrescentou uma linha que **nunca entra** na janela: a compra feita no tutorial (`semEstorno`) — ver A29.
- **Impacto na futura implementação:** a transação compra↔consumo↔estorno precisa ser atômica no back-end; check-in físico real na portaria. O back-end precisa distinguir **três motivos de saída da janela**: consumo registrado (3 gatilhos), data do evento vencida (sem consumo) e compra nascida fora da regra (`semEstorno`).
- **Precisa ajustar o protótipo?** **Não.**

### A13 · Dec. 179 — Lotação fixa por sala; vagas limitadas pela capacidade

- **Comportamento anterior:** salas sem capacidade cadastrada; evento presencial **sem lotação física**; formulários aceitavam qualquer número de vagas (sementes anteriores foram criadas sem esse limite e sem sala — não "cabiam" na regra nova).
- **Decisão atual:** lotação fixa por sala — **Sala 1 = 155, Sala 2 = 85, Sala 3 = 125, Sala 4 = 185**; turma, isolada e simulado não abrem com mais vagas que a sala comporta (validação real comprovada: "A Sala 4 comporta 185 — você pediu 192"); **evento presencial herda a lotação da sala** e, cheio, vira LOTADO em vitrine, carrossel e compra.
- **Fonte da decisão:** dec. 179, 28/07/2026 (números fixados pelo gestor; fecha a cadeia 129→130/134/135).
- **Impacto funcional:** implementado para tudo o que é criado pelos formulários; **sementes antigas sem sala escapam** (B10 e B16).
- **Impacto na futura implementação:** cadastro de salas/lotações deve ser configurável (hoje hard-coded — decisão técnica pendente, doc 10 §5.6).
- **Precisa ajustar o protótipo?** **Sim** (alinhar as sementes sem sala/`dataISO` à regra — ou decidir que atividade fora da sede tem lotação própria; pergunta pendente do dossiê D/E).

### A14 · Dec. 136 — Estúdio passa a ser selecionado manualmente

- **Comportamento anterior:** dec. 131 (26/07) — evento online reservava o Estúdio **automaticamente** (seletor travado).
- **Decisão atual:** **revogação explícita da parte automática**: o criador do evento online **seleciona** o Estúdio (seletor ativo, começa vazio, obrigatório); duas transmissões no mesmo dia/horário são barradas (comprovado na sonda E-S2).
- **Fonte da decisão:** dec. 136, 27/07/2026.
- **Impacto funcional / implementação:** implementado; regra de reserva de espaço unificada com as salas.
- **Precisa ajustar o protótipo?** **Não.**

### A15 · Dec. 155 — Vagas POR MOEDA (substitui "total + dessas em QdC")

- **Comportamento anterior:** dec. 60/69 (e o lançamento de simulados da 2ª dec. "128") — formulários pediam "Vagas totais + Dessas em Quad Coins" e **derivavam** as vagas em Dmn por subtração, zerando em silêncio ("coloquei 20 e 20 e não tinha como comprar por diamante" — bug real).
- **Decisão atual:** campos explícitos **"Vagas em Diamantes" + "Vagas em Quad Coins"** (total = soma) na criação de turma e no lançamento de simulado presencial; a compra dá baixa só no estoque da moeda escolhida.
- **Fonte da decisão:** dec. 155, 28/07/2026.
- **Impacto funcional / implementação:** implementado e comprovado (sondas A/D/E); modelo de inventário por moeda é requisito do back-end (reserva atômica).
- **Precisa ajustar o protótipo?** **Não.**

### A16 · Dec. 117b/122/123/125 — Regime definitivo dos simulados (substitui 42/43/45/47)

- **Comportamento anterior:** dec. 42/43 (21/07) — simulado presencial podia ser **gratuito e premiar QdC** na liberação; dec. 45 — digital pagava "+2 QdC por acerto" **fixo** (o campo de recompensa existia sem efeito).
- **Decisão atual:** **presencial é sempre vendido e nunca premia QdC** (a presença gera **score** na liberação — ver A17); **digital não tem limite de vagas nem trava por choque**, vende nas duas moedas ou é gratuito **premiando QdC por acerto**, e a **recompensa definida no lançamento passou a valer** (dec. 125; padrão 2). Vale só para simulados — eventos seguem podendo ser gratuitos e premiar.
- **Fonte da decisão:** dec. 117b/122/123 (26/07) e 125 (26/07).
- **Impacto funcional:** implementado (sondas E-S3/S4; formulário força "pago" no presencial, `{v:'pago',dis:true}`).
- **Impacto na futura implementação:** exceção assumida ao princípio "acertar não rende Quad Coin" (só o digital premia por acerto) — revalidar na modelagem econômica (dec. 185).
- **Precisa ajustar o protótipo?** **Não** (resíduo `vagasGratis` registrado em B16).

### A17 · Dec. 128/129 (26/07) — Presença em simulado gera score sempre

- **Comportamento anterior:** a liberação de entrada só pontuava quando o simulado premiava QdC (dec. 43).
- **Decisão atual:** **a presença gera score na liberação da recepção sempre** ("como grande parte das interações no app"); QdC só onde a atividade premia.
- **Fonte da decisão:** dec. 128/129, 26/07/2026 (atenção: os números 128/129 estão **duplicados** no registro — colisão real apontada pela auditoria, Q20 [ABERTA]; a outra ocorrência trata da grade "Preços e vagas" e do espaço físico da sede).
- **Impacto funcional:** implementado (sonda E-S3: "+100 score" na liberação).
- **Impacto na futura implementação:** sanear a numeração do registro antes que "dec. 128/129" seja citada em especificação (técnico).
- **Precisa ajustar o protótipo?** **Não** — ajustar o **registro** (Q20).

### A18 · Dec. 85 — Login do professor = e-mail + senha (substitui a 83)

- **Comportamento anterior:** dec. 63 (chave da coordenação + escolha do professor) → dec. 83 (e-mail validado contra o professor escolhido no seletor).
- **Decisão atual:** **substituição explícita**: login só com e-mail funcional + senha individual, sem chave e sem seletor; o e-mail casa com o Banco de professores (derivado do sobrenome — dec. 175 propaga rename e troca o login).
- **Fonte da decisão:** dec. 85, 25/07/2026 (+ dec. 89 — bloqueio/desligamento derruba a sessão; dec. 175, 28/07).
- **Impacto funcional:** implementado e comprovado (`moura@quadconcursos.com.br`/`quad1234`; negações por desligado/bloqueado/senha).
- **Impacto na futura implementação:** identidade real do docente exige **ID estável** e e-mail não derivado (colisão de sobrenomes — Q15).
- **Precisa ajustar o protótipo?** **Não.**

### A19 · Dec. 172 — Item de combate é recomprável (revoga a 99)

- **Comportamento anterior:** dec. 99 (25/07) — item de combate comprado **saía da vitrine** e existia só na mochila.
- **Decisão atual:** **revogação**: combate não é compra única e não some da vitrine; compra repetida **empilha** na mochila com etiqueta "N na mochila"; a regra de estoque (dec. 170) fica só nos produtos físicos.
- **Ressalva posterior (dec. 194, 02/08):** "não some da vitrine" vale para os itens **vendáveis**. O item marcado como **só de drop** (`disp: 'drop'`) **nunca aparece na vitrine** — a Loja filtra `disp !== 'drop'` —, porque ele não se compra: só se conquista por sorteio. O item `ambos` continua à venda e avisa na descrição "· também cai no DROP (N%)". Ver ficha A30.
- **Fonte da decisão:** dec. 172, 28/07/2026.
- **Impacto funcional:** implementado (sonda D: 2 facas → "2 na mochila"). Expõe o defeito do estorno em B8.
- **Impacto na futura implementação:** o inventário do jogador precisa suportar quantidade por item (empilhamento e recompra livre); o estorno deve desfazer apenas a unidade da compra estornada (correção do defeito B8).
- **Precisa ajustar o protótipo?** **Não** (a decisão); **sim** para o estorno correlato (B8).

### A20 · Dec. 104/107 — "EM CHOQUE" avisa sem impedir (substitui a 101)

- **Comportamento anterior:** dec. 101 (25/07) — choque de horário **bloqueava** a compra de qualquer atividade.
- **Decisão atual:** o app **informa** o conflito (etiqueta "EM CHOQUE" na vitrine + aviso "Atenção ao horário… o Quad não faz reposição de aula nem devolve o valor por ausência") e a decisão fica com o aluno; **única exceção que segue barrada: matrícula em turma com horário sobreposto**.
- **Fonte da decisão:** dec. 104 e 107, 26/07/2026.
- **Impacto funcional:** implementado (sondas D/E, inclusive confirmação em dois toques na inscrição gratuita com choque).
- **Impacto na futura implementação:** a detecção de conflito de horário deve **avisar sem bloquear** em toda compra de atividade, mantendo a matrícula em turma sobreposta como única exceção barrada — regra a preservar na validação do servidor.
- **Precisa ajustar o protótipo?** **Não.**

### A21 · Cadeia da turma ativa — dec. 62 → 146–148, 152–154, 156–160, 162–163, 177

- **Comportamento anterior:** dec. 62 (24/07), "matrícula-mestre": a 1ª matrícula definia tudo; a 2ª matrícula "entrava muda" (debitava e não aparecia); grade do cronograma chaveada por **tipo+turno** (duas turmas iguais dividiam grade); posição no ranking fixa ("#12 · de 42"); linha fixa da Introdução ("FEITA · DA CONTA"); herói sempre "Bloco da noite".
- **Decisão atual:** conceito de **turma ativa trocável sem deslogar** (146), pop-up pós-matrícula da 2ª em diante (147), seletor no topo (152), faixa no Domínio (153), "um pop-up, dois momentos" (154); **missões/blocos/rodízio por turma** (156), herói pelo turno da turma (158), rodízio pelo edital da turma com ajuste de Domínio **por concurso** (159), calendário por turma (160); **grade chaveada pelo ID da turma** (163); **economia/carreira/mochila/avatar são DA PESSOA** (148); **Introdução no Quad é DA CONTA** (157) e **some da lista quando feita** (177 — substitui a linha fixa); classificação viva e estorno da turma em uso passando o app à matrícula restante (162).
- **Fonte da decisão:** dec. 146–163 e 177, todas de 28/07/2026 (cadeia registrada na tabela do doc 10 §2).
- **Impacto funcional:** implementado ponta a ponta (sondas A/B: compra da 2ª turma → pop-up → re-render em cadeia).
- **Impacto na futura implementação:** é o modelo de dados central (conta × matrícula × turma ativa); persistência da turma ativa por conta e sincronização entre dispositivos.
- **Precisa ajustar o protótipo?** **Não.**

### A22 · Dec. 149 — Aviso com turma-alvo por ID

- **Comportamento anterior:** o alvo do aviso era **texto comparado com o nome** da turma — turma de nome novo nunca recebia nada (relato da "C.O.R.E.").
- **Decisão atual:** aviso tem alvo `'todas'` ou o **ID** de uma turma; o aluno vê os avisos da turma **ativa**.
- **Fonte da decisão:** dec. 149, 28/07/2026.
- **Impacto funcional:** implementado (sonda B1: aviso some ao trocar de turma). Pergunta pendente registrada: aviso deveria alcançar **todas** as matrículas do aluno, não só a ativa? (produto).
- **Impacto na futura implementação:** o modelo de avisos deve referenciar a turma por **ID estável** (nunca por nome); a entrega ao aluno depende da resposta pendente (turma ativa × todas as matrículas).
- **Precisa ajustar o protótipo?** **Não** (aguarda a resposta da pergunta para eventual mudança).

### A23 · Dec. 164 — Material anexado baixa de verdade

- **Comportamento anterior:** o arquivo anexado pelo admin era **descartado** e o botão do aluno era um aviso vazio.
- **Decisão atual:** o arquivo vira **objectURL** guardado no material — download real para o aluno; vídeo abre o link; tirar do ar revoga a URL.
- **Fonte da decisão:** dec. 164, 28/07/2026 (com dec. 144 — canal de materiais por turma).
- **Impacto funcional:** implementado (sonda E-S5 baixou arquivo real).
- **Impacto na futura implementação:** armazenamento/CDN com controle de acesso por matrícula (hoje o controle é só de exibição — pendência de segurança, dec. 186).
- **Precisa ajustar o protótipo?** **Não.**

### A24 · Dec. 57 — Verificação de matrícula dentro da vinheta

- **Comportamento anterior:** página "verificando" separada após o login (duplicava o carregamento).
- **Decisão atual:** verificação embutida na vinheta ("Verificando a matrícula de \<e-mail\>…"); entrada ~1,4 s mais rápida. O passo `#gateVerify` sobreviveu **vestigial** no HTML (B23).
- **Fonte da decisão:** dec. 57, 24/07/2026.
- **Impacto funcional:** login em uma tela só — a vinheta acumula a verificação; nenhum fluxo exibe a página "verificando" separada.
- **Impacto na futura implementação:** a verificação real de matrícula no login deve acontecer dentro da vinheta (uma tela, sem etapa intermediária); remover o vestígio `#gateVerify` na implementação.
- **Precisa ajustar o protótipo?** **Não** funcionalmente; limpeza do vestígio é higiene técnica.

### A25 · Dec. 111/112 — Quad Store e leitor de QR saem do menu "+"

- **Comportamento anterior:** dec. 20/66 — loja e "Validar pelo QR" acessíveis pelo botão "+".
- **Decisão atual:** a Quad Store fica só na barra de navegação (+ card de Coins e bloco do Início); o leitor de QR migra para o bloco do gift card **dentro da Quad Store**, ao lado de "Resgatar".
- **Fonte da decisão:** dec. 111 e 112, 26/07/2026.
- **Impacto funcional:** o menu "+" deixa de dar acesso à loja e ao leitor; o resgate por QR passa a viver junto do resgate por código, no mesmo bloco.
- **Impacto na futura implementação:** a arquitetura de navegação deve tratar o leitor de QR como parte do fluxo de gift card da Quad Store, não como atalho global do app.
- **Precisa ajustar o protótipo?** **Não.**

### A26 · Dec. 93/103 — Aulão e Mentoria deixam de ser itens fixos

- **Comportamento anterior:** "Aulão especial" e "Mentoria Quad" eram itens/botões fixos da Loja, fora das regras de evento.
- **Decisão atual:** **aulão é EVENTO** (data, professor, carrossel, expiração — dec. 93); **mentoria é item de catálogo com data** (entra em eventos/calendário de quem compra; com início e fim — dec. 103/120); "Simulado físico" → "Caderno de simulados impresso".
- **Fonte da decisão:** dec. 93 e 103, 25/07/2026 (+ dec. 120, 26/07).
- **Impacto funcional:** aulões seguem todas as regras de evento (vigência, carrossel, inscrição); a mentoria comprada entra na agenda do aluno com início e fim.
- **Impacto na futura implementação:** o catálogo não deve ter itens fixos hard-coded — aulões são modelados como eventos e a mentoria como item de catálogo com data que gera compromisso de agenda.
- **Precisa ajustar o protótipo?** **Não.**

### A27 · Dec. 138/139 — Tipo de turma com nome real; turno derivado do horário

- **Comportamento anterior:** tipos "RONDESP/PATAMO/BOPE" tratados como nomes de tipo; turno marcado à mão (o gestor marcou "noite" e digitou 8h–11h — salvou errado).
- **Decisão atual:** tipos com nome de verdade (nivelamento / regular / de questões / isoladas); **RONDESP, PATAMO e BOPE são apelidos** digitados no campo próprio; **o turno sai do horário** (antes das 12h = manhã; até 18h = tarde; depois = noite), exibido no eco do formulário.
- **Fonte da decisão:** dec. 138 e 139, 28/07/2026.
- **Impacto funcional:** o formulário de turma cria com tipo real + apelido separados e ecoa o turno derivado — o erro original ("noite" digitada com horário 8h–11h) fica impossível.
- **Impacto na futura implementação:** no modelo de turma, tipo e apelido são campos distintos e o turno é **derivado do horário** (nunca digitado) — regra de consistência a manter no servidor.
- **Precisa ajustar o protótipo?** **Não.**

### A28 · Dec. 192 — Evento inscrito vira CONCLUÍDO ou FALTOSO no calendário (e sai do estorno)

- **Comportamento anterior:** o evento vencido sumia de tudo — carrossel, Loja **e calendário** (`evAcabou`). O aluno perdia o registro da atividade: não havia como saber, olhando o app, se ele tinha participado ou faltado. E a compra do evento continuava estornável até o 7º dia mesmo depois de o evento acontecer, desde que ninguém tivesse liberado a entrada na portaria.
- **Decisão atual:** no calendário, o **evento presencial inscrito não some ao vencer**: vira **CONCLUÍDO** quando a entrada foi liberada na portaria ("presença registrada na portaria") ou **FALTOSO** quando o dia passou sem registro de entrada ("evento realizado — a entrada não foi registrada"); antes do dia, segue INSCRITO. O **evento online continua saindo** ao vencer — ele não passa pela portaria e, sem registro de entrada, não haveria como julgá-lo com justiça. A mesma decisão põe o **evento realizado fora da janela de estorno**: é o **4º caminho de saída**, ao lado dos 3 gatilhos de consumo da dec. 178 (ver A12).
- **Fonte da decisão:** dec. 192, 02/08/2026 (pedido do gestor).
- **Impacto funcional:** implementado. `renderCalendario` (src/08 l.341–366) decide o status pelo par "entrada liberada × dia passou" e `renderEstornos` (src/19 l.99–111) descarta a compra de evento já realizado. Liberar a entrada na portaria repinta o calendário na hora (src/17 l.381). Hook de teste novo: `window.__calRefresh`. Suíte: `vv1.mjs`.
- **Impacto na futura implementação:** o histórico do aluno precisa guardar **presença por evento** (registro da portaria) como dado persistente, não como estado de sessão — é ele que separa CONCLUÍDO de FALTOSO. A janela de estorno passa a depender também da **data do evento**, não só do consumo: o servidor precisa avaliar as duas condições. Decidir se FALTOSO tem alguma consequência (score, alerta pedagógico) — hoje é só rótulo.
- **Precisa ajustar o protótipo?** **Não.**

### A29 · Dec. 193 — A compra do tutorial (a boina) fica fora da regra dos 7 dias

- **Comportamento anterior:** a boina comprada durante a Instrução do QUAD entrava em "Estornos · até 7 dias" como qualquer outra compra — o aluno podia estornar o item que o próprio tutorial mandou comprar, desmontando o estado final da instrução (boina vestida, saldo 5 QdC).
- **Decisão atual:** compra feita **durante o tutorial** nasce marcada e **não entra na janela de estorno** ("ela faz parte do tutorial e não entra na regra"). `COMPRAS` ganhou o campo **`semEstorno`**, gravado como `semEstorno: !!tutOn` em `lojaCompraLog`; `renderEstornos` descarta as linhas marcadas.
- **Fonte da decisão:** dec. 193, 02/08/2026 (pedido do gestor).
- **Impacto funcional:** implementado (src/18 l.420 grava o campo; src/19 l.105 filtra). A boina segue no relatório de compras — some apenas do bloco de estornos. Hook de teste novo: `window.__estRefresh`. Suíte: `vv1.mjs`.
- **Impacto na futura implementação:** o modelo de compra precisa de um marcador de **origem/elegibilidade a estorno** (não basta o tipo do item): compras de onboarding, brindes e itens concedidos pelo sistema nascem fora da política de reembolso. Definir se outras compras guiadas futuras herdam a mesma marca.
- **Precisa ajustar o protótipo?** **Não.**

### A30 · Dec. 194 — Sistema de DROP: item de combate conquistado resolvendo questões

- **Comportamento anterior:** todo item de combate era **exclusivamente de venda** — só entrava na mochila por compra em Quad Coins, e todos apareciam na vitrine. Drop aleatório e itens raros **não existiam em lugar nenhum** do protótipo: a menção mais próxima era a forja de Quests, ainda EM BREVE (o documento 03, Módulo 17, registrava isso como funcionalidade inexistente e havia pergunta pendente sobre "drop entra na V2?").
- **Decisão atual:** cada item de combate passa a ter **disponibilidade** (`disp`: só venda / só drop / venda + drop) e **chance** (`drop`, em %). Ao concluir um **bloco de 10** (dia/noite/tarde), o **treinamento rápido** ou um **simulado digital**, cada item configurado é sorteado pela própria chance; o conquistado vai à mochila **sem custo, sem log em `COMPRAS` e sem estorno**. A conquista abre uma **celebração em overlay** (`#dropLayer`: card dourado com raios, item em destaque e o botão "Guardar na mochila"). A vitrine de combate **filtra `disp !== 'drop'`** e o item `ambos` avisa "· também cai no DROP (N%)". **O drop não dispara durante o tutorial.** O criador de itens do admin ganhou `#admSkDisp` e `#admSkDrop`, com validação de **1% a 100%**; item só-drop publica **sem preço**.
- **Fonte da decisão:** dec. 194, 02/08/2026 (pedido do gestor — "itens conquistados durante a resolução de questões").
- **Impacto funcional:** implementado. `dropSortear`/`dropCelebrar` em src/15 (l.44–88); gatilhos em src/11 (l.615, fim de bloco/treino) e src/12 (l.520, fim do simulado digital); overlay em src/06 (l.320); criador em src/05 (l.541–547) e src/14 (l.875–902). O catálogo passou de 6 para **7 itens** (`data/itens-combate.js`): o **Cantil** virou `ambos` (10%) e nasceu o **"Patch da sorte"** (`disp: 'drop'`, preço 0, 12%), que não aparece na Loja. Hooks de teste novos: `window.__dropSortear` e `window.__dropRng` (RNG determinístico). Suíte: `vv1.mjs`.
- **Impacto na futura implementação:** o sorteio precisa acontecer **no servidor** (é concessão de item por chance — no cliente, é fraudável pelo console, como todo o resto hoje); o inventário do jogador passa a ter itens **sem transação de compra associada**, o que exige uma origem registrada por unidade (compra × drop) para auditoria e para a política de estorno; as chances entram no estudo econômico (dec. 185 mantém a economia indefinida) e precisam ser configuráveis por item sem redeploy; falta definir a relação do drop com as **Quests/forja**, que seguem planejadas.
- **Precisa ajustar o protótipo?** **Não.**


### A31 · Dec. 195 — As dez Decisões Administrativas (DA-01 a DA-10)

- **Comportamento anterior:** dez temas estruturais estavam **sem decisão** e bloqueavam a modelagem do banco e do back-end: identificador das entidades, identidade das questões, modelo econômico, unicidade do nome de guerra, dono do simulado, fim da turma, dono do cadastro, número de perfis administrativos, política de retenção e princípio de persistência. O pacote de handoff os registrava como perguntas abertas (P1, P2, P4, P12, P27, P36, P43, P51, P54 do doc. 07) e a auditoria de prontidão os apontava como bloqueadores.
- **Decisão atual:** Danilo Moura emitiu **dez decisões administrativas** (documento oficial `docs/arquitetura/02-decisoes-administrativas.md`): **DA-01** ID interno único, permanente e imutável em todo registro — o nome nunca é chave; **DA-02** questão com ID próprio, classificada até o subassunto e revisável sem perder histórico; **DA-03** economia como **ledger** — nenhum saldo muda sem lançamento com origem, destino, tipo, data/hora, autor, valor e saldo resultante; **DA-04** nome de guerra **pode repetir** (o ID desempata); **DA-05** simulado é **do sistema**, associável a turmas/concursos/editais; **DA-06** turma **nunca é apagada** — encerra arquivando; **DA-07** o Viver o Quad é **dono do cadastro e da autenticação**; **DA-08** existem **vários perfis administrativos**, com autoria auditável; **DA-09** política de retenção — não se apagam dados acadêmicos, financeiros, de compras e de matrículas; conta que sai é desativada, não removida; **DA-10** toda **evolução do aluno é permanente**.
- **Fonte da decisão:** dec. 195, 03/08/2026 (Danilo Moura, Fundador).
- **Impacto funcional:** nenhum **no ato** — as DA são decisões de produto e arquitetura. (A implementação veio na mesma data, pela dec. 196 — ver A32.)
- **Impacto na futura implementação:** destrava a modelagem conceitual de entidades (chaves e cardinalidades), o desenho da carteira como ledger, o schema do banco de questões, o ciclo de vida de turmas e contas e o RBAC administrativo. **Nove perguntas do doc. 07** passaram a **[RESPONDIDA — DA-0x]**, cada uma com o resíduo de especificação anotado. Seguem em aberto: campos e mecanismo do cadastro (DA-07), prazos e bases legais da retenção (DA-09), RBAC fino e chave por pessoa (DA-08) e os **valores** econômicos (dec. 185).
- **Precisa ajustar o protótipo?** **Não** — mas seis delas foram implementadas por escolha do gestor no mesmo dia (A32).

### A32 · Dec. 196 — Seis Decisões Administrativas demonstradas no protótipo

- **Comportamento anterior:** o protótipo somava direto nas variáveis de saldo (sem histórico de operações), referenciava entidades por nome, fazia a turma vencida **sumir** do app, tinha **um** administrador N.P.P. sem identificação da pessoa e perdia toda a evolução do aluno no F5 — restando apenas `vq_tut_skip` e `vq_intro_done` no `localStorage`, com o botão "Reiniciar demonstração" limpando só a primeira (bug conhecido).
- **Decisão atual:** implementar no protótipo, como demonstração, **seis** das dez DA: **DA-01** — IDs internos (`MEU_ID = 'AL-00001'`, `DB_ALUNO.id`, `novoId()`, lançamentos `MV-xxxxx`); **DA-03** — **ledger da carteira** (`LEDGER`, `ledgerLancar`, `ledgerOp` em src/07; `renderExtrato` em src/19), com tipo, origem, destino, autor, data/hora, valor e **saldo resultante** por lançamento, começando pelo **saldo de abertura** (`MV-00000` em QdC e `MV-00001` em Dmn); **DA-04** — nome de guerra sem constraint de unicidade, desempate pelo ID; **DA-06** — **turma arquivada** (`matriculasArquivadas()`, semente `rondesp-m` com fim 30/06/2026, etiqueta **ARQUIVADA** no bloco "Minhas turmas · ativas e arquivadas" do perfil, src/12); **DA-08** — **4 perfis administrativos** (`ADM_PERFIS` em src/16: Direção, Coordenação pedagógica, Recepção e Financeiro), escolhidos no portão (`#admPerfil`, src/06), exibidos no chip do painel (`#admPerfilChip`, src/05), filtrando as abas visíveis (`admPodeVer`) e **assinando o crédito manual** no extrato (`autor: admPerfilNome()`); **DA-10** — **persistência da evolução** na chave `vq_evolucao` (`evolSalvar`/`evolCarregar`/`evolMarcar` em src/20, debounce de 400 ms), guardando score, diamantes, carreira, mochila, `avatarIdx`, nome de guerra, `turmaAtivaId`, `lojaOwned`, `trAj` e os **60 últimos lançamentos**. Na mesma rodada, o **bug do reset foi corrigido**: o handler de "Reiniciar demonstração" passou a limpar **as três** chaves.
- **Fonte da decisão:** dec. 196, 03/08/2026 (pedido do gestor, na sequência da dec. 195).
- **Impacto funcional:** implementado e coberto pela nova suíte **`vw1.mjs`** — o repositório passou a **58 suítes** e **42 hooks** `window.__*`, com sete novos: `__ledger`, `__ids`, `__carteira`, `__admPerfil`, `__evolSalvar`, `__evolCarregar` e `__evolMarcar`. O `localStorage` passou a ter **3 chaves**. Vários textos do pacote de handoff ficaram desatualizados por esta rodada (persistência, bug do reset, "1 perfil administrativo", "não há tela de extrato") e foram corrigidos na revisão de 03/08.
- **Impacto na futura implementação:** o protótipo deixou de ser apenas **descrição** dessas decisões e passou a ser **demonstração** delas — o extrato com autor e saldo resultante, o filtro de abas por perfil, a turma arquivada e a continuidade da evolução são agora comportamento aprovado a reproduzir. Ressalvas que a aplicação real precisa corrigir: a persistência é **por dispositivo**, não por conta (DA-07); o ledger vive no cliente e é forjável pelo console — e o que se forja **agora também persiste**; a chave administrativa continua única (`NPP-2026`), sem identidade por pessoa; e passou a haver **dado pessoal (fictício) gravado no navegador** — nome de guerra, avatar, saldos e extrato —, o que exige base legal, expiração e limpeza no logout no produto real (DA-09).
- **Precisa ajustar o protótipo?** **Não.**

### A33 · Dec. 197 — Carteira unificada na Loja e remoção do contador do tutorial

- **Comportamento anterior:** a Loja terminava com **dois cards separados** de pós-venda — "**Relatório de compras**" (períodos, KPIs "compras · Quad Coins · Diamantes · a receber" e as três listas de situação) e, ao lado, o "**Extrato da carteira**" criado pela dec. 196 —, cada um com o seu próprio seletor de período: o aluno via o mesmo dinheiro contado de dois jeitos, em dois lugares. No tutorial, o balão do QUAD exibia o contador de passos `#tutStepN` ("1 / 29", "2 / 29"…).
- **Decisão atual:** **um card só**, "**Carteira · extrato e compras**" (`#rcCard`, **último bloco da Loja**), com um **único** seletor de período (`#rcTabs`: Semanal/Mensal/Trimestral/Semestral) valendo para os dois lados; KPIs reescritos para **recebido · gasto · compras · a receber** — o "**recebido**" vem do **LEDGER** (soma das entradas do período, **excluindo o saldo de abertura**), por isso enxerga recompensas, gift cards, créditos da administração e estornos que a lista de compras não vê; abaixo dos KPIs, a seção "**Movimentações do período**" (`#extTabs` Tudo/Quad Coins/Diamantes + `#extList`) e, por último, as três listas de situação (`#rcAndamento`, `#rcPendente`, `#rcEntregue`). No tutorial, **o contador foi removido**: `#tutStepN` não existe mais no HTML nem no JS e o balão mostra só "**QUAD**" — os **29 passos continuam**, apenas não são anunciados ao aluno; a classe CSS `.tut-etapa` permanece porque a **central de tutoriais** a utiliza.
- **Fonte da decisão:** dec. 197, 03/08/2026 (pedido do gestor).
- **Impacto funcional:** implementado (src/03 para o card, src/19 para `renderRelCompras`/`renderExtrato`, src/06 e src/10 para o balão). Compra estornada continua saindo das listas de situação, **mas o estorno permanece no extrato**. Atenção ao **rótulo**: qualquer documento anterior a 03/08 que fale em "Relatório de compras" está se referindo a este card.
- **Impacto na futura implementação:** o extrato e a situação das compras são **duas leituras do mesmo período** e devem ser servidos juntos — o "recebido" é agregação do ledger, não do log de compras. O contador de passos some da UI, mas o **roteiro numerado continua sendo o contrato de teste** (`vtut.mjs`): a especificação do onboarding se apoia no array, não na tela.
- **Precisa ajustar o protótipo?** **Não.**

---

## B · DIVERGÊNCIAS CONFIRMADAS

Formato de cada ficha: **O que diz X · O que o código faz · Evidência · Impacto · Precisa de decisão de quem** (produto = Danilo Moura; engenheiro = decisão/execução técnica). Todas verificadas pelos investigadores (sonda e/ou leitura de código citada); nenhuma é opinião.

### B1 · Gate do administrador valida só a chave

- **O que dizem a decisão e a UI:** dec. 20 — área do admin (N.P.P.) com **acesso por chave da direção**; o comentário do fonte (src/16 l.10, marca `[INTEGRAÇÃO REAL]`) detalha o alvo: chave "emitida e revogada pela direção, **por pessoa**". O portão pede e-mail funcional; o briefing interno cita `npp@quadconcursos.com.br`.
- **O que o código faz:** valida **apenas** `@` no e-mail + chave `NPP-2026` (case-insensitive); o e-mail digitado não é validado nem guardado.
- **Evidência:** src/16 l.6–15; sondas A (`qualquer@gmail.com` + `npp-2026` entrou) e F3 nº1; doc 10 item 4.3.
- **Impacto:** qualquer pessoa com a chave entra como admin; nenhum vínculo pessoa×acesso.
- **Precisa de decisão de quem:** **engenheiro** (RBAC real no back-end) após **produto** definir papéis/permissões administrativas (pergunta pendente do M16).

### B2 · Dec. 105 "abre em todo acesso" × `vq_tut_skip`

- **O que diz a decisão:** "Instrução do QUAD abre **em todo acesso**, com botão Pular" (dec. 105, 26/07) — o comentário no código repete.
- **O que o código faz:** o login só dispara o tutorial se `vq_tut_skip !== '1'`; **concluir e pular gravam a chave** — depois disso a instrução só reabre pela central do QUAD ("Refazer") ou pelo reset da demonstração.
- **Evidência:** src/10 l.72–76; `tutFim`/`tutPular`; sondas A e suíte `vacesso.mjs`; doc 10 §1.3 (Q4 [ABERTA]).
- **Impacto:** comportamento contradiz a letra da decisão; impossível saber sem o gestor se "todo acesso" valia só até a 1ª conclusão.
- **Precisa de decisão de quem:** **produto** (Q4); ajuste posterior é do engenheiro.

### B3 · Nome de guerra: `maxlength=12` × regra de combinação

- **O que diz a regra:** o nome de guerra pode ser um dos nomes **ou uma combinação deles em ordem** (subsequência do nome completo).
- **O que o código faz:** o campo trava em **12 caracteres** — combinações válidas mais longas são fisicamente impossíveis de digitar ("Almeida Moura", 13 chars, vira "Almeida Mour" e **reprova**; via `dispatchEvent` programático o mesmo valor passa — é o input, não a regra, que barra).
- **Evidência:** src/03 l.460 (`maxlength=12`) × `tutGuerraOk` (src/10 l.148–165); sondas `invA-guerra*.mjs`.
- **Impacto:** regra anunciada ao aluno parcialmente inatingível; "Danilo Moura" (12) cabe por coincidência.
- **Precisa de decisão de quem:** **produto** (o limite de 12 é padrão de tarjeta intencional ou deve ceder?).

### B4 · Missões "semanais" existem só em texto

- **O que dizem os textos:** "Corte das missões da semana (SÁB 23h59)" no calendário e toast "Missão pausada — expira 23h59".
- **O que o código faz:** **não há mecânica semanal nenhuma** — a única expiração implementada é a de 7 dias por bloco (`DIA_EXPIRA_DIAS = 7`, revalidada ao abrir Missões, dec. 106); a linha do calendário é decorativa (`CAL_BASE`) e o toast pertence ao motor órfão (B5).
- **Evidência:** src/08 l.316; src/11 l.33; dossiê B (M5).
- **Impacto:** aluno e documentação podem inferir um ciclo semanal que não existe.
- **Precisa de decisão de quem:** **produto** (o corte semanal é regra a implementar ou texto a remover?).

### B5 · Motor QUESTIONS/`#quizLayer` órfão — vídeo de resolução e +20 QdC inalcançáveis

- **O que o código contém:** um motor genérico de quiz com correção **no fim**, botão "▶ Vídeo de resolução" (placeholder) e prêmio de +1 score por resposta + **20 QdC** ao concluir, alimentado por `data/questions.js`.
- **O que o app faz:** **nenhum fluxo do aluno o abre** — só há `classList.remove('on')`; o quiz da aula real usa `QA_MULT`/`QA_CE` e o simulado digital tem motor próprio. Vídeo de resolução e o prêmio de +20 QdC são hoje **inalcançáveis pela UI**. A dec. 188 removeu código morto mas **manteve** este motor.
- **Evidência:** src/08 l.361–440; grep confirmado no dossiê B (M6) e na auditoria prévia (`aluno.md` §9).
- **Impacto:** código vivo sem porta de entrada; risco de confusão sobre a regra canônica de feedback das missões.
- **Precisa de decisão de quem:** **produto** (é a base do futuro quiz com correção no fim + vídeo, ou remove-se?); execução do engenheiro.

### B6 · Sala da PATAMO: `crono.js` diz "SALA 4", `turmas-loja.js` diz "Sala 2"

- **O que dizem os dados:** o seed do cronograma registra PATAMO = "SALA 4"; o catálogo de turmas registra "Sala 2".
- **O que o código faz:** o título da Aula de hoje usa a **turma matriculada** (`ta.sala || t.sala` → Sala 2); o dado do crono só entra como fallback — o dado duplicado ficou inconsistente.
- **Evidência:** `data/crono.js` × `data/turmas-loja.js`; src/08 l.535; sonda B1.
- **Impacto:** só demonstrativo (o aluno vê Sala 2), mas é armadilha para quem for modelar os dados reais.
- **Precisa de decisão de quem:** **engenheiro** (fonte única do dado "sala"; corrigir o seed).

### B7 · CRONO com professores fora do banco e datas não reancoradas

- **O que diz a regra:** o cronograma grava professor **do Banco de professores** filtrado pela matéria (dec. 91); a dec. 189 reancorou as datas-semente.
- **O que os dados fazem:** a grade-semente (`data/crono.js`, "Semana 30", 20–24/07) usa **professores que não existem em `DOCENTES`** (Moab Kigran, John Bernam, Rodrigo etc. — cobertos por casamento por prefixo de matéria) e **não foi reancorada** pela dec. 189 (que só moveu eventos) — as datas da grade estão no passado.
- **Evidência:** `data/crono.js` × `data/docentes.js`; dossiês E (M13) e F (M15/M16, divergência 3).
- **Impacto:** demo do cronograma descolada do banco de docentes; qualquer lógica futura que exija integridade referencial quebra com esse seed.
- **Precisa de decisão de quem:** **engenheiro** (sanear o seed; datas relativas — recomendação já registrada na dec. 189).

### B8 · Estorno de item de combate zera TODAS as unidades

- **O que diz a regra:** estorno desfaz **a aquisição** estornada e devolve o valor daquela compra (dec. 100/178); combate é recomprável e empilha (dec. 172).
- **O que o código faz:** `desfazerCompra` executa `MOCHILA.filter(x => x !== ref)` — devolve o valor de **uma** compra mas esvazia **todas** as unidades daquele item. Comprovado: 2 facas (2×40 QdC), 1 estorno → +40 QdC e **0 facas** (o aluno perde 40 QdC líquidos).
- **Evidência:** sonda D (M10); nenhuma decisão cobre o comportamento.
- **Impacto:** prejuízo real ao aluno; provável defeito, não regra.
- **Precisa de decisão de quem:** **produto** confirma a regra (remover só 1 unidade?); **engenheiro** corrige.

### B9 · "PRAZO ENCERRADO" listado para sempre

- **O que diz o título do bloco:** "Estornos · **até 7 dias**".
- **O que o código faz:** compras com prazo vencido **permanecem listadas indefinidamente** com etiqueta "PRAZO ENCERRADO" e botão morto — nunca são arquivadas (seeds de 8 e 55 dias seguem lá).
- **Evidência:** `renderEstornos`; sonda D.
- **Impacto:** menor (poluição visual/histórico); o título sugere outra coisa.
- **Precisa de decisão de quem:** **produto** (arquivar após N dias?) — menor.

### B10 · Evento presencial sem sala nunca lota

- **O que diz a decisão:** dec. 179 — evento presencial herda a lotação da sala e, cheio, vira LOTADO.
- **O que o código faz:** evento **sem sala no seed** (ex.: "Semana Insana", multi-dia) tem `evLot()` = 0 = **sem limite** — nunca fica LOTADO (`__evLotar('semana-insana', 9999)` não muda nada). O formulário novo exige sala; seeds antigos passam por fora.
- **Evidência:** sonda D (M8); dossiê E.
- **Impacto:** conflita com o espírito da dec. 179 para presenciais.
- **Precisa de decisão de quem:** **produto** (proibir presencial sem sala × lotação própria para atividades fora da sede).

### B11 · Estado `'aguardando-fiscal'` morto

- **O que diz o código (comentário):** os estados da carreira incluem `'aguardando-fiscal'`.
- **O que o código faz:** o estado é **inalcançável** desde a dec. 23 (20/07 — prova de promoção automática, sem fiscal); os estados vivos são acumulando · disponivel · prova · bloqueada.
- **Evidência:** src/07 l.48; dossiê C (M7).
- **Impacto:** nenhum funcional; resíduo que confunde leitura.
- **Precisa de decisão de quem:** **engenheiro** (remover na próxima limpeza).

### B12 · Curva de patentes achatada

- **O que sugere o desenho de progressão:** metas crescentes por patente ao longo das 14 patentes/4 fases.
- **O que o dado faz:** **5 patentes (Aspirante → Tenente-Coronel, 9ª–13ª) exigem os mesmos 12.500 pts** e a **Coronel (14ª, máxima) tem `pontos: null`** — sem meta, por ser a patente final; curva achatada, provável placeholder.
- **Evidência:** `GAMI` (src/07 l.11–37); dossiê C.
- **Impacto:** nenhum na demo; os valores são dado demonstrativo (dec. 185).
- **Precisa de decisão de quem:** **produto** (balanceamento — já coberto pela dec. 185; registrar para o estudo econômico).

### B13 · `notaMin` por fase existe mas ninguém lê — prova usa 80% fixo

- **O que dizem código-config e CHANGELOG (18/07):** aprovação pela **nota mínima da fase** (70/75/80/85%).
- **O que o código faz:** a prova de promoção usa `PROVA_APROV = 0.80` **fixo** para todas as fases; `GAMI.fases[].notaMin` nunca é lida (pendência declarada no próprio fonte: src/07 l.7–9).
- **Evidência:** src/12 l.332; doc 10 §3.2 (Q10 [ABERTA]); dossiê C.
- **Impacto:** config por fase é letra morta; risco de implementar a regra errada.
- **Precisa de decisão de quem:** **produto** decide a regra (Q10); **engenheiro** implementa.

### B14 · `var score` guarda Quad Coins

- **O que dizem os conceitos:** Score (carreira, não se gasta) ≠ Quad Coin (moeda).
- **O que o código faz:** a variável da **moeda** chama-se `score` (comentário do próprio fonte: "NÃO é o score de carreira") e `addScore()` credita moeda; o score de carreira mora em `carreira.score*`. É a maior armadilha de nomenclatura do projeto (doc 05/RN-18; regras.md R18).
- **Evidência:** src/07 l.4; doc 10 §1.4/§5.1 (Q6 [ABERTA] — não incluída na limpeza de 01/08).
- **Impacto:** nenhum funcional; alto risco para qualquer desenvolvedor futuro.
- **Precisa de decisão de quem:** **engenheiro** (renomear `score` → `qdc`; refactor seguro já proposto).

### B15 · Simulado digital: "pode retomar depois" × recomeço do zero

- **O que diz o toast:** "Simulado interrompido — você pode retomar depois".
- **O que o código faz:** **não há retomada** — reabrir re-sorteia as questões e zera o cronômetro.
- **Evidência:** src/12 l.544–547; dossiê E (M12).
- **Impacto:** promessa de UI sem mecânica.
- **Precisa de decisão de quem:** **produto** (retomada é requisito?) → engenheiro.

### B16 · Sementes de simulado presencial escapam das regras vigentes; `vagasGratis` residual

- **O que dizem as decisões:** dec. 129/179 — presencial ocupa sala, valida capacidade e choque; dec. 117b — presencial nunca é gratuito.
- **O que os dados/código fazem:** os presenciais-semente ("Simulado 63", "Simuladão") **não têm `dataISO`/sala** ("simulado antigo, sem controle de sala passa direto" — comentário do fonte) e não ocupam o mapa de salas nem travam choque; o campo `vagasGratis` e o tratamento `'gratis'` sobrevivem na estrutura, embora o formulário não crie mais presencial gratuito.
- **Evidência:** src/11 l.136; src/18; `data/simulados.js`; dossiê E.
- **Impacto:** dado demonstrativo em conflito com a regra vigente; resíduo de fase anterior.
- **Precisa de decisão de quem:** **engenheiro** (sanear seeds e estrutura).

### B17 · Regras de score/coins do evento são texto — nada credita presença

- **O que diz a página do evento:** regras publicadas por evento ("presença +30", "top 10 +50" etc.), como se executáveis.
- **O que o código faz:** **nenhum mecanismo credita** score/coins por presença em evento — o único crédito real é o garimpo (+15 QdC, uma vez). Diferente do simulado presencial, que pontua na liberação. O "ranking de simulado" prometido no texto do Simuladão também não existe.
- **Evidência:** src/08 l.300–306 (garimpo) × arrays `score[]`/`coins[]` de `data/eventos.js`; dossiê E (M11/M12).
- **Impacto:** expectativa de recompensa sem entrega; pergunta aberta: quem credita e quando (check-in? fim do evento? manual)?
- **Precisa de decisão de quem:** **produto** define o gatilho; **engenheiro** implementa.

### B18 · Lista de conferência em PDF sai 100% sintética

- **O que se espera:** a lista de inscritos por atividade (PDF de impressão, dec. 169) com os inscritos reais.
- **O que o código faz:** a lista gera **nomes sintéticos por hash** para todos (`inscNome(seed, i)`), mesmo quando há inscrito real — o aluno real aparece na portaria, mas **não** na lista PDF.
- **Evidência:** src/17 l.456–459; dossiê E.
- **Impacto:** documento de conferência inutilizável com dados reais (na demo).
- **Precisa de decisão de quem:** **engenheiro** (ligar a lista aos inscritos reais); menor.

### B19 · `ATIVIDADES` fixas duplicam eventos vivos nas Liberações

- **O que se espera:** uma lista única de atividades com inscritos.
- **O que o código faz:** três escalas convivem para o mesmo conceito — `ocup` semente, `evInscritosCount` real (0/1) e `ATIVIDADES` fixas com números grandes (Aulão 73 etc.); o "Aulão de véspera RONDESP" aparece **como atividade fixa E como evento vivo**.
- **Evidência:** src/17 l.387–393; dossiês E e F (M16, divergência 4).
- **Impacto:** contadores contraditórios na mesma tela (demo).
- **Precisa de decisão de quem:** **engenheiro** (unificar; já apontado pela auditoria).

### B20 · Texto das Liberações: entrega "volta o item ao estoque" × código

- **O que diz a UI:** a confirmação de entrega devolveria o item ao estoque da Loja.
- **O que o código faz:** **só o estorno** devolve estoque; a entrega consome a compra e libera a condição da vitrine (etiqueta), sem repor estoque.
- **Evidência:** dossiê F (M16, divergência 2) × dossiê D (dec. 170 comprovada).
- **Impacto:** texto enganoso para o operador da recepção.
- **Precisa de decisão de quem:** **engenheiro** (corrigir o texto); menor.

### B21 · Gift card em Quad Coins × dec. 48; códigos-demo fora do formato

- **O que diz a decisão:** dec. 48 apresenta o gift card como canal do **Diamante** ("comprado em dinheiro — recarga no site ou gift card"); o formato `QG<lote>-<código>` é definido **pelo código** (src/16 l.326, geração dos lotes) — a dec. 84 não o define, apenas alinha os textos da loja ao "formato real dos lotes".
- **O que o código faz:** lotes de gift card (e crédito manual, e estorno) funcionam **também em QdC** — QdC "comprável" via cartão, tensionando o princípio "Score não é moeda" (mesma família da dec. 11/A9); os códigos-demo `QUAD-100`/`QUAD-500` não seguem o formato oficial (mantidos só como demonstração).
- **Evidência:** src/07 l.117–133 (`moeda === 'dmn' ? addDiamante : addScore`); sondas C1/C2; dossiê C (M9).
- **Impacto:** canal de venda de moeda conquistável sem cobertura de decisão econômica.
- **Precisa de decisão de quem:** **produto** (gift card em QdC é intencional no produto final?) — insumo da modelagem econômica (dec. 185).

### B22 · Aside "Testar o novo acesso (V0)" morto ~~+ reset que não limpa `vq_intro_done`~~

> **Metade RESOLVIDA em 03/08 (dec. 196):** o botão "Reiniciar demonstração" passou a limpar **as três** chaves — `vq_tut_skip`, `vq_intro_done` e `vq_evolucao`. **O bug do reset não existe mais.** Permanece aberta apenas a primeira metade desta ficha: o **texto morto** do aside.

- **O que diz o texto:** o aside do login descreve fluxo por código de e-mail, 3 cenários, autorização de dispositivo e indicador ONLINE/OFFLINE (com e-mails `aluno@quad.com` etc. e código `123456`); o release note interno ainda menciona reconhecimento facial.
- **O que o código faz:** o fluxo foi **removido** (dec. 21 e 188) — o texto é morto. *(Registro histórico: o botão "Resetar demonstração" limpava `vq_tut_skip` mas **não** `vq_intro_done` — bug reconhecido e deixado aberto pela dec. 188 por "exigir decisão"; a decisão veio com a dec. 196 e o handler foi corrigido.)*
- **Evidência:** src/06 l.522–537; src/13 (handler do reset, hoje com as três chaves); dossiês A e F (M17).
- **Impacto:** texto de demonstração defasado. *(O reset incompleto deixou de ser impacto em 03/08.)*
- **Precisa de decisão de quem:** **engenheiro** limpa o texto morto. *(A parte de produto — comportamento do reset — foi decidida na dec. 196.)*

### B23 · `#gateVerify` vestigial

- **O que diz o HTML:** existe um loader "Verificando o cadastro de…".
- **O que o código faz:** **nenhum fluxo o exibe** desde a dec. 57 (verificação embutida na vinheta).
- **Evidência:** src/06 l.228–233; dossiê A.
- **Impacto:** nenhum; higiene. **Decisão:** engenheiro (remover).

### B24 · Troca de senha do aluno é teatro; a do professor funciona

- **O que sugere a UI:** o Perfil do aluno tem campo "nova senha" + botão que confirma "Senha alterada com sucesso".
- **O que o código faz:** **nada é gravado nem conferido** no login do aluno; já a troca do professor altera `d.senha` e vale no próximo login da sessão — comportamento inconsistente entre perfis.
- **Evidência:** src/12 l.577–581 × src/09 l.123–133; dossiê A.
- **Impacto:** menor (demo); alinhar na autenticação real.
- **Precisa de decisão de quem:** **engenheiro** (módulo de autenticação).

### B25 · Pop-up "Matrícula encerrada" com texto único

- **O que diz o texto:** "Sua turma terminou e a matrícula não foi renovada…".
- **O que o código faz:** o mesmo texto aparece para **qualquer** estado sem matrícula (inclusive após estorno) — a causa não é distinguida.
- **Evidência:** `#matLayer`; dossiê A (M3).
- **Impacto:** mensagem imprecisa ao aluno. **Decisão:** engenheiro (variar o texto por causa); menor.

### B26 · Material-semente promete "Responda no app · pontua em Quad Coins"

- **O que diz o seed:** o mt3 ("Lista extra · 30 questões") anuncia resposta no app com premiação.
- **O que o código faz:** **nenhuma mecânica** conecta `MATERIAIS` ao banco de questões ou ao Treinamento Rápido — "lista de questões" é só um rótulo/tipo.
- **Evidência:** `data/` seeds de materiais; dossiê E (M13).
- **Impacto:** promessa sem entrega; funcionalidade planejada sem decisão numerada.
- **Precisa de decisão de quem:** **produto** (integração material↔questões entra no módulo planejado?).

### B27 · Quadrômetro mistura números vivos com "presença 9/10" fixo; telemetria decorativa

- **O que sugere a tela:** todos os números do Quadrômetro seriam vivos; card de "Telemetria desta sessão".
- **O que o código faz:** carreira/temporada/QdC/posição são vivos, mas **"presença 9/10" é texto fixo do HTML**; a telemetria é **apenas visual** (strings fixas/contadores triviais; nenhum evento coletado) — sendo que a rev. 2.3 §8 declara taxonomia de origem + linha de base como **pré-requisito da V0** (Q14 [ABERTA]).
- **Evidência:** src/03 l.208 e l.243–245; dossiês C e F; doc 10 item 4.9.
- **Impacto:** métrica-mãe do piloto inexistente de fato.
- **Precisa de decisão de quem:** **produto + engenheiro** (Q14: quem constrói o log real e quando).

### B28 · Divergências menores adicionais (confirmadas)

| Item | X (texto/decisão) × Y (código) | Evidência | Decisão de quem |
|---|---|---|---|
| Pular a instrução deixa a conta **sem nome de guerra** ("AL SD QUAD ______"), sem obrigação posterior | dec. 105 (pular = estado final) não trata a identidade | sonda A (`invA-login.mjs`) | produto (obrigar definição depois?) |
| Estorno de item físico com **dois pedidos** do mesmo item remove só 1 pedido, mas registra o valor cheio | dec. 100 × `desfazerCompra('pres')` | dossiê D | engenheiro; cenário sem decisão |
| Documentação interna fala em "**11 subsistemas**" redesenhados na troca de turma; o código chama 12 renders + 2 redefinições | contagem defasada, sem efeito funcional | src/07 l.180–206; dossiê A | ninguém (registrar) |
| Cards da cadeia de skins imprimem preço **sem formatação de milhar** ("1300" × "1.300" no resto da Loja) | padrão `fmt` não aplicado | dossiê D | engenheiro (cosmético) |
| Selo do card diz "quando o professor **abrir** o quiz… aparece aqui", mas o botão exige **ativação** (criado = só selo) | nuance de texto, coerente com a dec. 64 | dossiê B (M6) | engenheiro (texto) |
| Rodapé da Aula de hoje diz "atualizado pela **planilha da coordenação**", mas quem atualiza é o bloco do admin — e a dec. 182 internalizou o módulo | texto × operação | dossiê B (M4) | engenheiro (texto) |
| Tela "Banco de questões" do admin sugere banco geral operável com tags/correção ao vivo; é **tabela estática de 3 linhas** + botão-toast | conceito × demonstração (assumida pela V0; Módulo Planejado, dec. 182) | src/05 l.68–86; src/13 l.799; dossiês B/F | produto (modelo real do banco) |

---

## Tabela-síntese

Tipos: **CxD** = código × decisão/documento · **TxM** = texto × mecânica · **DD** = dado demonstrativo desalinhado · **TEC** = técnico/cosmético.

| # | Item | Tipo | Precisa de decisão? | De quem |
|---|---|---|---|---|
| B1 | Gate do admin valida só a chave | CxD | Sim (papéis/permissões) | produto → engenheiro |
| B2 | Dec. 105 "todo acesso" × `vq_tut_skip` | CxD | Sim (Q4) | produto |
| B3 | Nome de guerra `maxlength=12` × combinação | CxD | Sim | produto |
| B4 | Missões "semanais" só em texto | TxM | Sim (implementar ou remover) | produto |
| B5 | Motor QUESTIONS órfão (vídeo + 20 QdC) | TxM | Sim (base futura ou remoção) | produto → engenheiro |
| B6 | Sala da PATAMO crono × turmas-loja | DD | Não (corrigir seed) | engenheiro |
| B7 | CRONO: professores fora do banco; datas não reancoradas | DD | Não (sanear; datas relativas) | engenheiro |
| B8 | Estorno de combate zera todas as unidades | CxD (defeito) | Sim (confirmar regra) | produto → engenheiro |
| B9 | "PRAZO ENCERRADO" listado para sempre | TxM | Sim (arquivamento) — menor | produto |
| B10 | Evento sem sala nunca lota | CxD | Sim (fora da sede tem lotação?) | produto |
| B11 | Estado 'aguardando-fiscal' morto | TEC | Não (remover) | engenheiro |
| B12 | Curva de patentes achatada (5×12.500; Coronel sem meta) | DD | Sim (balanceamento, dec. 185) | produto |
| B13 | `notaMin` por fase × 80% fixo | CxD | Sim (Q10) | produto → engenheiro |
| B14 | `var score` = Quad Coins | TEC | Sim (aprovar refactor, Q6) | engenheiro |
| B15 | "Pode retomar depois" × re-sorteio do digital | TxM | Sim (retomada é requisito?) | produto |
| B16 | Seeds de simulado sem sala/data; `vagasGratis` residual | DD | Não (sanear) | engenheiro |
| B17 | Regras de score/coins de evento sem crédito real | TxM | Sim (gatilho do crédito) | produto → engenheiro |
| B18 | Lista PDF de inscritos 100% sintética | TxM | Não (ligar aos reais) | engenheiro |
| B19 | `ATIVIDADES` fixas duplicam eventos vivos | DD | Não (unificar) | engenheiro |
| B20 | Texto "entrega volta ao estoque" | TxM | Não (corrigir texto) | engenheiro |
| B21 | Gift card em QdC × dec. 48; formato dos códigos-demo | CxD | Sim (economia, dec. 185) | produto |
| B22 | Aside morto (~~+ reset não limpa `vq_intro_done`~~ — **corrigido na dec. 196**) | TxM | Não para o reset (decidido na dec. 196); sim para limpar o texto morto | engenheiro |
| B23 | `#gateVerify` vestigial | TEC | Não | engenheiro |
| B24 | Troca de senha do aluno sem efeito | TEC | Não (autenticação real) | engenheiro |
| B25 | "Matrícula encerrada" texto único | TxM | Não (variar por causa) | engenheiro |
| B26 | mt3 "pontua em QdC" sem mecânica | TxM | Sim (integração material↔questões) | produto |
| B27 | "Presença 9/10" fixa; telemetria decorativa | TxM | Sim (Q14 — log real antes do piloto) | produto + engenheiro |
| B28 | Menores: pulo sem nome de guerra · estorno de 2 pedidos · "11 subsistemas" · milhar das skins · selo do quiz · "planilha da coordenação" · banco de questões demonstrativo | TxM/DD/TEC | Conforme a linha (tabela B28) | misto |

---

*Documento redigido em 02/08/2026 a partir dos dossiês A–F (sondas verdes), do doc 10 da auditoria (status 01/08) e do registro de decisões 1–191; revisado em 03/08/2026 para incorporar as dec. 192–194 (fichas A28, A29 e A30) e, na mesma data, as dec. 195–197 (fichas **A31**, **A32** e **A33**). Nenhuma divergência aqui é opinião: todas têm evidência de código, sonda ou registro citada na ficha.*
