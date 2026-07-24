# Registro de Decisões — Viver o Quad (protótipo)

Decisões tomadas durante a construção do protótipo (jul/2026), por ordem.
Complementa o "Registro de Decisões Travadas" da rev. 2.3.

| # | Data | Decisão | Observações |
|---|---|---|---|
| 1 | 13/07 | Protótipo como HTML único (Artefato claude.ai + arquivo local) | 3 perfis: aluno, professor, admin |
| 2 | 14/07 | **Padrão visual**: azul e branco da marca em todos os projetos Quad | Correção após tentativa de tema escuro/dourado |
| 3 | 14/07 | **Danilo** é o mascote-guia (robô azul, folha de personagem própria) | Nome homenageia o Fundador; vídeo 3D em loop |
| 4 | 14/07 | Logo oficial (Q em três azuis) em login, vinheta e cabeçalho | Arquivo da marca, sem redesenho |
| 5 | 14/07 | Fluxo de entrada: login → vinheta → portão (Já sou aluno / Primeira vez) | Vinheta: "Comece seu sonho por aqui..." + barra de carregamento |
| 6 | 14/07 | Cadastro do 1º acesso com **preenchimento automático** da plataforma-base | Tela seguinte abre carregando; dados chegam campo a campo |
| 7 | 14/07 | **Tour obrigatório do Danilo** no 1º acesso (9 passos, Anterior/Próximo) | Plataforma só libera após concluir |
| 8 | 14/07 | Aba de métricas = **Quadrômetro** (nunca "Perfil") | "Perfil do aluno" é a tela de conta (nome de guerra, avatar, senha) |
| 9 | 14/07 | Avatares = coleção oficial da PM (12 opções); nome de guerra estampado na farda | Sprite recortado do arquivo do gestor |
| 10 | 14/07 | Tipografia de app: Inter / Roboto / SF Pro (fallback Segoe UI) | |
| 11 | 14/07 | Pontuação de participação rebatizada **"Quad Coin"** na UI | ⚠️ **Diverge da rev. 2.3** (Anexo A, princípio 2: "Score não é moeda"). Decisão do gestor; o documento-base precisa de revisão para realinhar as cinco camadas. Intendência (gastar) segue bloqueada até a V1. |
| 12 | 14/07 | Efeito **engrenagem**: cartões giram em 3D na rolagem + scroll infinito | Conteúdo triplicado em segmentos; fim liga com o início; pausado durante o tour |
| 13 | 16/07 | **Danilo Moura (Fundador) assume o controle do projeto** | Ele guia; execução com resumos de entendimento e perguntas em etapas |
| 14 | 18/07 | Projeto versionado em Git para armazenamento no GitHub | Este repositório |
| 15 | 19/07 | **Insígnias por dupla**: cada par Aluno/efetivo compartilha a arte (escala de evolução) | Decisão do gestor |
| 16 | 19/07 | **Aluno Oficial Quad usa a insígnia do Aspirante** (sem arte própria) | Confirmado pelo gestor em 19/07 |
| 17 | 19/07 | **Mascote renomeado para "QUAD"** (antes "Danilo"); tutorial obrigatório de 19 etapas substitui o tour de 9 passos | Roteiro completo definido pelo fundador em 19/07 |
| 18 | 19/07 | Na identificação militar, a partícula fixa segue **"QUAD"** (o roteiro citava "QD" como alternativa a padronizar) | Mantida a decisão anterior do nome de guerra composto; mudar para "QD" exige só ajustar `GAMI`/`nomeCurto` |
| 19 | 20/07 | **Cadeia de skins**: Gandola → Capa de colete → Fuzil → fardas finais (CIPE 500 · PATAMO 750 · BOPE 1300); **farda é escolha única** — comprou uma, as demais ficam indisponíveis; cada compra troca a foto do personagem | Artes chegarão em PDF do gestor; até lá, placeholder visual (anel da foto + chip). Elos: 60/120/200 |
| 20 | 20/07 | **Área do administrador (N.P.P.)** com acesso por chave da direção; módulos: Avisos gerais (card do aluno renomeado), cronograma por turma, eventos/regras, liberações (retirada de produtos, simulados presenciais via QdC com liberação de entrada, simulados digitais), visão de alunos/dificuldades e governança da Loja | Tudo conectado ao app do aluno em tempo real; chave demo NPP-2026 · `[INTEGRAÇÃO REAL]` marcado nos pontos de sistema |
| 21 | 20/07 | **Cadastro no site (checkout), não no app**: o app só faz login (e-mail+senha) + "Criar conta" → site; a matrícula ativa libera o acesso | Removidos código por e-mail, ativação, cadastro interno e autorização de dispositivo |
| 22 | 20/07 | **Dados do aluno vêm do banco geral**: o tutorial confirma nome/turma ("Vi que você é…") em vez de pedir; só o nome de guerra é digitado; foto mostra "AL SD QUAD ______" até a escolha | Nome+telefone pré-preenchidos |
| 23 | 20/07 | **Prova de promoção automática (sem fiscal)**: 20 questões que o aluno já classificou como difíceis (Errei/Difícil), sem revelar; 80% promove, senão nova tentativa em 24h | Substitui a prova supervisionada por humano |
| 24 | 20/07 | **Escolha de personagem sai do Perfil** (o personagem é definitivo, escolhido no onboard) e entra a **mochila de combate**: ícone abre uma Storage de itens comprados na Loja que não são skin/farda (armas, broches etc.) | Base para os futuros eventos de quest (reunir itens → item novo); itens iniciais: faca 40, lanterna 35, bússola 30, broche 25, cantil 20, corda 45 |
| 25 | 20/07 | **Chips "Itens do personagem" removidos** (redundantes com a foto + mochila): boina e skins **quem possui, veste** — sem equipar/desequipar manual | A foto já mostra o que está vestido; o resto vai para a mochila |
| 26 | 20/07 | **Recompensa da noite concluída**: o botão do "Bloco da noite", ao fechar todas as missões, vira **"Retire aqui seus benefícios"** (dourado) e paga **+1 de Score por bloco (8/noite) + 1 Quad Coin**, com efeito visual de moeda | Botão dourado é acento pontual de recompensa — não muda o padrão azul/branco da marca. Regra: 1 bloco = +1 Score |
| 27 | 20/07 | **"Aula de hoje" re-renderiza ao abrir o Início** (além da sincronização com a planilha da coordenação) | Reflete cronograma da turma + horário atual a cada visita |
| 28 | 20/07 | **No tutorial, a área clicável do passo do personagem é só a grade** (`#avGrid`); mochila e itens de combate ficam bloqueados durante o tutorial | Corrige o bug de abrir a mochila no meio da escolha |
| 29 | 20/07 | **Loja em 4 categorias**: Turmas e aulas · Eventos · Itens do personagem (com sub-área "Itens de combate → mochila") · Itens presenciais (retirada na recepção) | Presenciais: garrafinha, simulado físico, chaveiro, vade mecum, módulo, camiseta — geram pedido de retirada |
| 30 | 20/07 | **Agenda de eventos**: data/horário do novo evento por seletores nativos (calendário + relógio), com prévia "QUA · 29/07 · 19H30" | Substitui a digitação manual da data |
| 31 | 20/07 | **Admin cadastra produtos/serviços na Loja**: nome, descrição, categoria e preço; entram na hora na Loja do aluno e no editor de preços | Presenciais saem com pedido de retirada; base para catálogo governável |
| 32 | 21/07 | **Tutorial**: o passo da boina aponta direto para o item (não para o card), que ficou alto com combate/skins e escondia a boina | Corrige o travamento do onboard na compra da boina |
| 33 | 21/07 | **Calendário do aluno é data-driven**: base fixa + eventos inscritos entram de fato no calendário | Antes o botão dizia "no seu calendário" sem refletir lá |
| 34 | 21/07 | **Itens presenciais com estoque, quantidade e entrega**: aluno escolhe a quantidade; admin define estoque (esgota→fora de estoque); compra=ADQUIRIDO → baixa do admin=ENTREGUE → volta a ficar disponível | Pedido guarda id+quantidade; entrega libera o item de novo |
| 35 | 21/07 | **Ícone do produto escolhido numa paleta** no cadastro (turma, simulado, garrafinha, módulo, aulão, evento, chaveiro, camiseta, caneca, medalha…) | Catálogo `ICON_CAT` compartilhado |
| 36 | 21/07 | **Evento online = evento com link**: entra no carrossel com resumo; o inscrito recebe o botão de acesso ao link | Une criação do evento, link e disposição para o comprador/inscrito |
| 37 | 21/07 | **Cancelar evento / remover produto** pelo ✕ na administração | Sai da Loja, do carrossel e dos calendários na hora |
| 38 | 21/07 | **Evento tem data + horário de início + término** | Ex.: "QUA · 29/07 · 19H–21H30" |
| 39 | 21/07 | **Online/Presencial é modalidade (tópico) do evento, não nome de produto** | Removidos os "produtos" Evento online/presencial da Loja |
| 40 | 21/07 | **Evento gratuito × pago**: gratuito entra no Início e dá recompensa ao participar; pago é vendido na Loja (aba Eventos) e, ao ser comprado, migra para o Início e sai da Loja; online libera o link ao comprador | Corrige a lógica do evento online (antes desconectada); catálogo de eventos separado do cadastro genérico de produto |
| 41 | 21/07 | **Tutorial aponta a boina diretamente**: removido o passo que destacava o card inteiro de itens ("área geral") após ganhar os 25 Coins | O card ficou grande (boina + skins + combate) e o passo "toca pra olhar" confundia — qualquer toque levava à boina |
| 42 | 21/07 | **Simulados presenciais no modelo dos eventos**: admin lança pela agenda (data+início+término), grátis (gera QdC) ou pago (custa QdC); inscrição corrigida (grátis também registra) | Simulado presencial = evento com liberação na entrada; o botão do Simuladão estava inerte |
| 43 | 21/07 | **Liberações**: todo inscrito (pago ou grátis) aparece agrupado por simulado; liberar a entrada pontua (QdC+score) quem participa de simulado que gera QdC | Fecha o ciclo inscrição→recepção→pontuação |
| 44 | 21/07 | **Removidos** o indicador "Online" do topo e o bloco "Atividades online · links" da Loja do admin | Offline aposentado; links agora vêm do próprio evento/simulado online |
| 45 | 21/07 | **Simulado digital = PDF → quiz cronometrado**: admin anexa PDF, define tempo (min), nº de questões e o dia; vira quiz com cronômetro na Missões; ao concluir/zerar o tempo, dá +10 score e +2 QdC por acerto e fica REALIZADO | Lançamento movido de Liberações para o hub "Hoje"; extração do PDF marcada `[INTEGRAÇÃO REAL]` (na demo, questões do banco) |
| 47 | 21/07 | **Simulados unificados**: lançamento único na aba "Hoje" (modalidade presencial/digital × gratuito/pago); Liberar só mantém os inscritos a liberar. Presencial pago e digital pago vão à Loja; comprados, viram INSCRITO/ativos em Missões. Presencial liberado e digital concluído entram no histórico de realizados (base pedagógica) | Consolida os fluxos dos simulados e liga Loja↔Missões↔Liberar↔cronômetro; corrige órfãos das fases anteriores |
| 48 | 24/07 | **Diamante**: segunda moeda, comprada em dinheiro (recarga no site ou gift card de liberação única) — nunca conquistada em missões; fica logo abaixo do Quad Coin | Arte oficial do gestor; crédito automático do checkout é `[INTEGRAÇÃO REAL]`; produtos vendem em QdC **ou** Dmn |
| 49 | 24/07 | **Loja Quad em dois macro-blocos** (Itens presenciais × Itens digitais) com as sub-áreas do negócio (turmas por modalidade, isoladas, simulados, eventos, excursões, módulos, TAF, outros / cursos online, mentoria, eventos online, personagem); herói gráfico "Loja Quad"; removidos "Intendência" e "Como ganhar Quad Coins" | Modelo de vagas: ex. 170 em Dmn + 10 em QdC; esgotou → item some do sistema |
| 50 | 24/07 | **Confirmação em toda compra da Loja** (modal para item de unidade única; estoque mantém o seletor de quantidade); boina some da vitrine após comprada | Evita compra acidental; no tutorial o QUAD conduz sem modal |
| 51 | 24/07 | **Administrador em 5 áreas** (Controle · Interno · Relatórios · Liberações · Loja); o Painel de controle é a tela inicial; a Estrutura abre por botão dentro do Painel interno | Fase 1 do pacote 24/07; Interno=antiga "Hoje", Relatórios=antiga "Alunos" |
| 52 | 24/07 | **Painel de controle**: crédito manual de QdC/Dmn (livre, com motivo e histórico — porta de entrada da recarga do site/gift card); bloqueio de conta com **suspensão imediata** (derruba a sessão + pop-up "procure a administração" no login); **mensagem exclusiva** vira recado no "+" com contador estilo WhatsApp, e a leitura marca LIDA no admin; Chat ao vivo assinalado EM BREVE | Governança das contas separada da operação pedagógica |
| 53 | 24/07 | **Criação de turmas no Painel interno**: nome pré-configurado pelo tipo + apelido livre; foco do concurso por estado (incl. Guarda Municipal); dois horários seguidos validados (o 2º começa quando o 1º termina); árvore do edital por anexo; turma reflete na Estrutura | Fase 2; leitura do anexo é `[INTEGRAÇÃO REAL]` |
| 54 | 24/07 | **Produtos digitais pré-configurados** (e-book, vade mecum digital, curso online, aulão gravado) sem estoque, com toggle disponível↔indisponível que governa a presença na Loja; **criador de skins** publica em Itens do personagem (QdC ou Dmn, banco de visuais próprio); **Quests** fica como botão EM BREVE | Digital não gera pedido de retirada; skin aplicada no boneco é V1 |
| 55 | 24/07 | **Relatórios em 4 painéis** (Individuais · Turmas · Gerais · Loja) com gráficos de colunas e rosca em CSS/HTML no tema da marca; individuais por aluno (uso, compras QdC×Dmn, pedagógico do Domínio, reclamações-placeholder); turmas (dificuldades, uso, apoio, presença/feedbacks-placeholder); gerais (perfil, dificuldade pedagógica, satisfação-placeholder); Loja (vendas, mais vendidos, faturamento QdC×Dmn, entradas×saídas) | Fase 3; gráficos sem bibliotecas externas |
| 56 | 24/07 | **“Compradores · últimas compras” migra** da aba Loja (governança) para Relatórios · Loja, com a regra do **“ver completo”** (colapso estilo ranking) para o bloco grande | Governança da Loja fica só com cadastro e preços |
| — | 24/07 | **Fases seguintes acordadas**: 5 abas novas do admin (Painel de controle, Painel interno, Relatórios, Liberações, Loja) com crédito manual de moedas, bloqueio de conta, chat no "+", criação completa de turmas, produtos digitais pré-configurados, criador de skins, botão de Quests e Relatórios com gráficos; regra do "ver completo" para blocos grandes | Faseamento da entrega do pacote 24/07 |
| 46 | 21/07 | **Estrutura (N.P.P.)**: concursos com árvore de edital própria + situação (aberto/proposta/reta-final); "Definir Domínio" troca a árvore do aluno em Domínio; modalidades RONDESP/PATAMO/BOPE com régua teoria×questões (70/30, 50/50, 20/80); turmas = concurso×modalidade×período (início/término) | Concursos: PM-BA CFO/Soldado, PM fronteiras Soldado, Polícia Penal/Civil BA, PRF. Árvores reais dos não-CFO entram por upload do edital `[INTEGRAÇÃO REAL]` (V0: exemplos compactos) |

## Regras de trabalho vigentes

- Editar sempre `src.html`; `index.html` é saída de build
- **Republicar o Artefato a cada alteração** — regra inegociável
- Padrão visual azul/branco da marca; nunca criar temas próprios
- Textos inseridos pelo gestor geram perguntas de esclarecimento; toda entrega
  abre com resumo do entendimento
