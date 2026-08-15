# Especificação funcional — Viver o Quad
*Extraída do protótipo em 02/08/2026 · o protótipo é a fonte de verdade funcional*

Este documento descreve, módulo a módulo, **como o produto funciona hoje no
protótipo navegável** — cada capítulo segue o mesmo gabarito de 17 campos e usa
o vocabulário oficial de classificação (FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO ·
SIMULAÇÃO LOCAL · REGRA DE PRODUTO CONFIRMADA · DADO DEMONSTRATIVO · DECISÃO
POSTERIOR · FUNCIONALIDADE PLANEJADA · DIVERGÊNCIA · PERGUNTA PENDENTE).
As evidências citam as partes de `src/`, os conjuntos de `data/`, as decisões
do registro (**1–197**) e as sondas/suítes executadas na extração. Divergências e
perguntas estão consolidadas nos documentos 04 e 07 deste pacote.

> **Revisão de 03/08/2026** — a extração original foi feita contra as decisões
> 1–191; as decisões **192** (status CONCLUÍDO/FALTOSO do evento no calendário),
> **193** (a boina do tutorial fica fora da regra de estorno) e **194**
> (sistema de DROP de itens de combate) foram incorporadas nesta revisão.
> Os módulos afetados são o 2, 5, 8, 10, 11, 12, 16 e 17.
>
> **Segunda revisão de 03/08/2026** — incorporadas as decisões **195**
> (dez Decisões Administrativas DA-01…DA-10), **196** (implementação no
> protótipo de DA-01, DA-03, DA-04, DA-06, DA-08 e DA-10) e **197**
> (carteira unificada na Loja + remoção do contador do tutorial).
> Efeitos: existe **extrato da carteira** com ledger de lançamentos
> (Módulos 7, 9 e 10); a Loja tem um único card **"Carteira · extrato e
> compras"** (Módulos 8 e 10); a área administrativa tem **4 perfis**
> (Módulo 16); parte da evolução do aluno **persiste** em `localStorage`
> (Módulos 2, 3, 7 e 10); a turma encerrada fica **ARQUIVADA** (Módulo 3);
> o contador de passos do tutorial foi removido da tela (Módulo 2).
> Contagens atualizadas: **58 suítes** em `tests/` e **42 hooks**
> `window.__*` no `src/`.

## Índice
1. Entrada, cadastro e autenticação · 2. Tutorial, identidade e personagem ·
3. Conta, matrículas e turma ativa · 4. Tela inicial e cronograma ·
5. Missões e treinamento · 6. Questões, quiz e banco de questões ·
7. Score, Quad Coins, Diamantes e progressão · 8. Loja e produtos ·
9. Gift Cards e carteira · 10. Compras, matrículas e estornos · 11. Eventos ·
12. Simulados · 13. Materiais · 14. Inteligência pedagógica ·
15. Área do professor · 16. Área administrativa · 17. Funcionalidades futuras

---

## Módulo 1 — Entrada, cadastro e autenticação

**Nome do módulo:** Entrada, cadastro e autenticação (aluno, professor e administrador N.P.P.).

**Objetivo:** Controlar quem entra no app e com qual papel: o aluno autentica com a conta criada no site do Quad e só usa o app se tiver matrícula ativa; o professor entra com e-mail funcional + senha individual; o administrador entra com chave de liberação da direção. Contas bloqueadas não entram.

**Perfis envolvidos:**
- **Aluno** — login e-mail + senha na tela inicial do "celular".
- **Professor** — portão próprio (`#profGate`) ao trocar para a persona professor.
- **Administrador (N.P.P.)** — portão próprio (`#admGate`) ao trocar para a persona admin.
- A troca entre os três perfis é feita pelos botões `.persona-btn[data-persona]` fora do celular — mecânica do protótipo para demonstração, não um recurso do produto (src/07, l.223–255). SIMULAÇÃO LOCAL.

**Funcionamento atual:**
1. **Abertura do app**: a tela de login (`#loginLayer`, src/06 l.447–463) cobre tudo — logo, título "VIVER O QUAD", subtítulo "Entre com a conta que você criou no site do Quad", campos Login (e-mail) e Senha, botão "Entrar" e link "Ainda não tem conta? **Criar conta**". FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
2. **Login do aluno** (`acessarPortal`, src/10 l.58–82): valida presença de `@` no e-mail e senha não vazia; exige `online=true`; consulta o bloqueio da conta (`contaDe('eu').bloqueada` → abre `#bloqLayer` e não entra); grava o e-mail em `#contaEmail` e na telemetria; entra no app tocando a vinheta ("Comece seu sonho por aqui..." + "Verificando a matrícula de \<e-mail\>…" em `#splashVerify`). **Qualquer e-mail com `@` e qualquer senha entram** — sonda `invA-login.mjs` confirmou com `qualquer.pessoa@exemplo.com` / senha `xyz`. SIMULAÇÃO LOCAL (comentário no fonte: "[INTEGRAÇÃO REAL] validar no servidor", src/10 l.54–57). A verificação da matrícula acontece dentro da vinheta — a página "verificando" separada foi removida (dec. 57; o passo `#gateVerify` sobrevive vestigial no HTML, src/06 l.228–233).
3. **"Criar conta"**: abre o portão `#gateCriar` ("Cadastro no site do Quad" — "A conta é criada no checkout do site, junto com a sua matrícula; confirmada a matrícula, o acesso ao app é liberado automaticamente"). O botão "Ir para o cadastro no site" só mostra o toast "Redirecionando para o cadastro no site do Quad… (demo)"; "Voltar ao login" retorna (src/10 l.85–96; sonda `invA-login.mjs`). SIMULAÇÃO LOCAL — o redirecionamento real está marcado `[INTEGRAÇÃO REAL]`.
4. **Entrada no app** (`entrarApp`, src/10 l.99–110): fecha portões, toca a vinheta, `checarMatricula()` (sem matrícula ativa → trava, ver Módulo 3), `daniloWave()` + balão "Precisa de ajuda?" por 10s e, se `vq_tut_skip !== '1'`, dispara o tutorial obrigatório (ver Módulo 2); senão, toast "Bem-vindo, \<nome militar\>!".
5. **Sair da conta** (`sairConta`, src/11 l.802–812): limpa os campos, reexibe o login e devolve a persona aluno; acionado pelo botão do Perfil e pelo bloqueio de conta do admin.
6. **Professor** (src/09 l.34–76): e-mail funcional derivado do sobrenome — `emailDoProf` remove títulos (Prof.ª/Cap./Ten./…), pega a última palavra do nome sem acento + `@quadconcursos.com.br` (Danilo Moura → `moura@quadconcursos.com.br`). Senha inicial de todo cadastro: `quad1234` (`PROF_SENHA_DEMO`); o professor pode trocar a própria senha no painel dele (`d.senha`, src/09 l.123–133 — exige atual correta, mínimo 6, confirmação e diferente da atual). Negações no login: e-mail fora do corpo docente → "E-mail não encontrado no corpo docente"; `desligado` → "Este cadastro está desligado — procure a coordenação"; senha errada → "Senha incorreta"; `bloqueado` → "Acesso bloqueado pela coordenação". Sonda `invA-bloqueios.mjs` confirmou os caminhos de erro e o login feliz. REGRA DE PRODUTO CONFIRMADA (dec. 85: login do professor = e-mail + senha, sem chave; dec. 175: renomear o professor propaga e o e-mail acompanha o sobrenome) · SIMULAÇÃO LOCAL (senha real individual `[INTEGRAÇÃO REAL]`).
7. **Administrador** (src/16 l.6–15): portão pede e-mail funcional + "chave de liberação emitida pela direção". O código valida apenas `@` no e-mail e a chave `NPP-2026` (com `toUpperCase()` — `npp-2026` também entra, confirmado pela sonda). Nota no portão: "demo: chave NPP-2026 · no sistema real o cadastro de administrador é aprovado pela direção". SIMULAÇÃO LOCAL + DIVERGÊNCIA (ver abaixo).

**Fluxo principal:** Login (e-mail+senha) → vinheta com verificação de matrícula embutida → [1º acesso] tutorial obrigatório do QUAD (ver Módulo 2) → Início destravado. Alternativas: "Criar conta" → portão do cadastro no site (beco demonstrativo); conta bloqueada → pop-up "Conta bloqueada"; sem matrícula ativa → pop-up "Matrícula encerrada" + app travado exceto Quad Store (ver Módulo 3). (`docs/auditoria/03-fluxos` F01/F02/F05 descrevem o mesmo — conferido no código e nas sondas.)

**Ações disponíveis:**
- Aluno: Entrar · Criar conta (→ site, demo) · Enter no e-mail foca a senha, Enter na senha submete (src/10 l.81–82) · sair da conta (Perfil).
- Professor: Entrar na sala · trocar a própria senha (logado).
- Admin: Liberar acesso (chave).
- Não há: recuperação de senha, "esqueci minha senha", login social, biometria — nenhum caminho na UI (sonda `invA-login.mjs` listou os únicos botões do login: "Entrar" e "Criar conta").

**Regras confirmadas:**
- **Conta nasce no site (checkout), o app só autentica** — REGRA DE PRODUTO CONFIRMADA no comportamento demonstrado (dec. 21), porém revogada em 01/08 pela dec. 183 — ver "Decisões posteriores".
- **Matrícula ativa libera o app** (dec. 21/62; RN-02): sem matrícula, só a Quad Store. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO (trava real na nav) + SIMULAÇÃO LOCAL (a vigência vem de array em memória). Detalhes no Módulo 3.
- **Login exige conexão** ("O login precisa de conexão com a internet", src/10 l.63) — mas o alternador de conectividade não existe mais na UI (`connToggle` sem elemento; suíte `vacesso.mjs` bloco E confirma a remoção como comportamento esperado: "acesso offline aposentado").
- **Conta bloqueada não entra e vê o aviso** (dec. 52; RN-05). Confirmado por sonda.
- **Professor desligado/bloqueado não entra; se estiver logado, a sessão cai na hora** com recado cordial no portão (dec. 89; `checarAcessoProf`, src/13 l.246–265): "Olá! Informamos que o sr./a sra. está temporariamente afastado das atividades…". REGRA DE PRODUTO CONFIRMADA (comportamento verificado em código; a queda de sessão é coberta pelas suítes vfe/vfb da família do gestor).
- **Apagar professor** derruba a sessão e o remove de turmas/eventos (dec. 90; src/13 l.268–292).
- **Admin: chave emitida/revogada pela direção por pessoa** — intenção declarada no comentário (src/16 l.10); o protótipo demonstra com chave única.

**Dados utilizados:**
- `DB_ALUNO = { nome: 'Danilo de Almeida Moura', fone: '(71) 9 8877-2301' }` (src/07 l.259) — "dados que chegam do banco de dados geral". DADO DEMONSTRATIVO (a mecânica de pré-preenchimento é REGRA DE PRODUTO CONFIRMADA, dec. 22 — superada pela 182, ver Módulo 2).
- `CONTAS` (src/16 l.23–28): a conta da demo (`eu`) + 3 contas-semente (SANTIAGO, BRANDÃO, NASCIMENTO) com flag `bloqueada`. DADO DEMONSTRATIVO.
- `DOCENTES` (`data/docentes.js`): 6 professores com matérias, turnos, graduação, telefone, `desligado`, `bloqueado`. DADO DEMONSTRATIVO (extraído para `data/` pela dec. 191).
- Persistência: `localStorage` com **3 chaves** — `vq_tut_skip`, `vq_intro_done` e `vq_evolucao` (esta última criada pela dec. 196, DA-10). Sessão/credenciais **não** persistem (recarregar = deslogado), mas a evolução do aluno volta ao entrar de novo. O botão "Reiniciar demonstração" do painel interno limpa **as três** chaves (o bug que deixava `vq_intro_done` para trás foi corrigido na dec. 196). SIMULAÇÃO LOCAL.

**Dados demonstrativos:** E-mail/senha aceitos livremente; chave `NPP-2026`; senha `quad1234`; e-mail derivado (`moura@…`); telemetria "origem: OPEN_ORGANIC · linha de base: ativa" fixa (src/10 l.68); os e-mails `aluno@quad.com`/`codigo@quad.com`/`novo@quad.com` e o código `123456` listados no aside são texto morto de um fluxo antigo (src/06 l.522–537) — o fluxo por código de e-mail e a autorização de dispositivo foram removidos (dec. 21 e dec. 188). DADO DEMONSTRATIVO.

**Resultados esperados:**
- Login válido → vinheta (~4 s) → Início com toast de boas-vindas (ou tutorial no 1º acesso).
- Login sem e-mail/`@` → toast "Informe seu login (e-mail)."; sem senha → "Digite sua senha." (sonda).
- Conta bloqueada → `#bloqLayer` ("O acesso desta conta foi suspenso pela administração… Entre em contato com a administração"), permanece no login.
- Criar conta → tela do site com botão demo; Voltar retorna intacto.
- Professor/admin com credenciais certas → portão fecha, painel renderiza com o nome do docente / toast "bom serviço!".

**Situações de bloqueio ou erro:**
1. **Aluno bloqueado** (admin → Painel de controle → Bloquear): sessão derrubada em ~400 ms, volta ao login com `#bloqLayer`; tentativas seguintes reabrem o aviso; desbloquear libera na hora (sonda `invA-bloqueios.mjs`, seções C). Nota do admin: "o bloqueio suspende o uso do app imediatamente" (src/05 l.245).
2. **Sem matrícula ativa**: `#matLayer` "Matrícula encerrada" com "Ver turmas na Quad Store"/"Entendi"; nav bloqueada exceto Loja com toast "Funções bloqueadas — matricule-se em uma turma na Quad Store para liberar" (detalhado no Módulo 3).
3. **Professor desligado / bloqueado / apagado**: negação no login e queda de sessão (acima).
4. **Offline**: o login recusa — mas o estado offline é inalcançável pela UI atual (toggle removido). DIVERGÊNCIA histórica já assinalada na auditoria (doc 10) e no inventário prévio.

**Simulações atuais:**
- Autenticação inteira (credencial, matrícula, bloqueio) decidida no front-end, em memória. SIMULAÇÃO LOCAL.
- Checkout do site = toast. SIMULAÇÃO LOCAL.
- Troca de senha do **aluno** no Perfil (`#novaSenha`/`#btnSenha`, src/12 l.577–581) = apenas toast "Senha alterada com sucesso" — nada é gravado nem conferido no login. SIMULAÇÃO LOCAL (a do professor, ao contrário, altera `d.senha` e vale no próximo login da mesma sessão).
- Telemetria de sessão = string fixa. SIMULAÇÃO LOCAL.

**O que precisará de implementação real:**
- Serviço de autenticação (e-mail+senha, sessão, recuperação de acesso) — marcado `[MÓDULO PLANEJADO · Autenticação]` no próprio fonte (src/07 l.60–62).
- Verificação de matrícula ativa contra o banco geral no login.
- Cadastro/checkout: com a dec. 183, o cadastro passa a ser módulo interno do app (fluxo novo ainda não especificado; site/checkout e pagamentos seguem externos — dec. 182).
- Emissão/revogação de chaves de administrador por pessoa; cadastro de admin aprovado pela direção.
- Senha individual do professor persistida; e-mail funcional real (hoje derivado do sobrenome — colisões de sobrenome não são tratadas).
- Suspensão de sessão server-side no bloqueio de conta.

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA: modo offline/autorização de dispositivo (descrito no aside como conceito V0, código removido pela dec. 188); notificações/push ("o app nunca empurra na V0"); biometria citada no texto antigo do aside.
- FUNCIONALIDADE PLANEJADA (implícita do módulo de autenticação): recuperação de acesso ("esqueci a senha") — não existe em nenhuma forma; não há sequer decisão registrada.

**Decisões posteriores:**
- **Dec. 183 (01/08, Consolidação v1.0): a dec. 21 foi REVOGADA** — o cadastro passa a pertencer à arquitetura do app ("Viver o Quad = plataforma principal", dec. 182). O fluxo novo não foi implementado: o protótipo mantém, de propósito, a demonstração "cadastro no site (checkout)" até a especificação do módulo. Registrar o comportamento demonstrado como vigente na demo e a decisão como norte da implementação. DECISÃO POSTERIOR.
- Dec. 184: módulo sem especificação = "Módulo Planejado" (sem implementação parcial) — vale para o cadastro interno e a recuperação de acesso. DECISÃO POSTERIOR.
- Dec. 186: riscos de segurança da auditoria de 30/07 registrados como pendências (autenticação fake incluída). DECISÃO POSTERIOR.

**Divergências:**
- DIVERGÊNCIA (conhecida): **o portão do admin valida só a chave** — o e-mail aceita qualquer coisa com `@` (sonda: `qualquer@gmail.com` + `npp-2026` entrou), enquanto o texto do portão e a dec. 20 falam em "cadastro específico com liberação por pessoa". O e-mail digitado não é sequer guardado.
- DIVERGÊNCIA: aside "Testar o novo acesso (V0)" (src/06 l.529–537) descreve o fluxo antigo (código por e-mail, 3 cenários, autorização de dispositivo, indicador ONLINE/OFFLINE) que não existe mais; *(o botão "Reiniciar demonstração" limpava só `vq_tut_skip`, deixando `vq_intro_done` para trás — **bug CORRIGIDO na dec. 196**: o handler agora limpa as três chaves `vq_tut_skip`, `vq_intro_done` e `vq_evolucao`, src/13).*
- DIVERGÊNCIA: `#gateVerify` (loader "Verificando o cadastro de…") existe no HTML mas nenhum fluxo o exibe desde a dec. 57.
- DIVERGÊNCIA: aluno pode "trocar senha" no Perfil sem efeito — inconsistente com o professor, cuja troca funciona (na sessão).

**Perguntas pendentes:**
1. PERGUNTA PENDENTE: com a revogação da dec. 21, o cadastro interno terá quais campos e qual relação com o checkout externo (pagamento continua fora — dec. 182)? Quem cria a conta quando a matrícula é presencial/manual?
2. PERGUNTA PENDENTE: haverá recuperação de senha no app (e-mail de redefinição? código?) — hoje não há nada.
3. PERGUNTA PENDENTE: o e-mail funcional do professor será mesmo derivado do sobrenome (colisão entre dois "Silva"?) ou cadastrado livremente pela coordenação?
4. PERGUNTA PENDENTE: o acesso do admin será por conta individual com papel/permissão, ou chave compartilhada por equipe (como a demo sugere)?
5. PERGUNTA PENDENTE: bloqueio de conta — o aluno bloqueado deve conseguir ver algo além do aviso (histórico, contato)? Hoje é beco absoluto.

---

## Módulo 2 — Tutorial, identidade e personagem

**Nome do módulo:** Tutorial obrigatório ("Instrução do QUAD"), identidade militar (avatar + nome de guerra) e missão de estreia ("Introdução no Quad").

**Objetivo:** Receber o aluno no 1º acesso com o mascote QUAD conduzindo um roteiro guiado que: apresenta o app, faz o aluno escolher o personagem (avatar) e o nome de guerra, confirma os dados vindos do cadastro, executa a primeira missão (com recompensa), ensina a economia (score de carreira × Quad Coins) e a Loja (compra da boina), e libera a plataforma.

**Perfis envolvidos:** Aluno (exclusivo). O FAB do QUAD some nas personas professor e admin (src/07 l.250–253).

**Funcionamento atual:**
- **Disparo**: abre em todo login enquanto `vq_tut_skip !== '1'` (src/10 l.72–76); concluir OU pular grava a chave e os próximos acessos entram direto (sonda `invA-login.mjs`; suíte `vacesso.mjs` blocos B/C). Dec. 105: a instrução abre "em todo acesso" com botão Pular — a chave `vq_tut_skip` é o que materializa isso.
- **Roteiro `TUT` com 29 passos** (src/10, array `TUT`). **O contador de passos foi removido em 03/08 (dec. 197)**: o elemento `#tutStepN` (que mostrava "1 / 29") não existe mais nem no HTML nem no JS — o balão traz só o nome "**QUAD**". Os 29 passos continuam iguais; o que mudou é que o aluno não vê o tamanho do roteiro na tela ("a instrução não é um formulário com barra de progresso"). A classe CSS `.tut-etapa` permanece porque a **central de tutoriais** a usa para o seu próprio rótulo. Sequência: (1–2) apresentação → (3) tocar na foto do topo (`abrir-perfil`) → (4) segurar a foto p/ zoom (`zoom-foto`) → (5) escolher avatar no grid (`avatar`) → (6) confirmação do avatar (opções "Sim, sou eu!"/"Ver outros") → (7) elogio → (8) confirmação dos dados do banco ("Vi que você é o Danilo de Almeida Moura, lá da Turma PATAMO (N), né?"; opções "Sou eu, sim!"/"Corrigir no site" — esta só dá toast "no app real, a correção é feita no site") → (9–10) nome de guerra (regra + digitação, `guerra`) → (11) confirmação ("Você quis dizer MOURA?") → (12) salvar perfil (`salvo`, com correção de erros apontada pelo QUAD) → (13–15) leitura do nome militar, sigla e insígnia → (16–17) score zerado → (18) "Continuar missão" (`bloco`) → (19) Introdução no Quad (`missao`) → (20–22) score/Quad Coins ganhos → (23) ir à Loja (`loja`) → (24) comprar a boina (`boina`) → (25–26) saldo e regra entra/sai → (27) zoom final no personagem com a boina (`zoom-final`) → (28) resumo → (29) despedida com botão "CONCLUIR ›". FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO, ponta a ponta (suíte `vtut.mjs`, 237 linhas, percorre tudo e é o critério de aceite).
- **Encenação**: fundo escurece com 4 painéis de sombra e fica travado (wheel/touchmove bloqueados — verificado pela `vtut.mjs`); alvo iluminado com anel + seta no ponto exato; o QUAD circula pelos cantos (`bot: br/bl/tr`) com gestos por assunto (`GESTOS`: wave/talk/point/cheer/bob/salute — sprite de 7 quadros, src/10 l.336–353); fala datilografada ~30 ms/caractere com pausas em vírgulas e pontos (`tutSay`); 1º toque completa a fala, toque na metade direita avança passo livre; passo com ação (`expect`) esconde o "Avançar" e só avança pela ação (sonda `invA-tutorial.mjs`).
- **Estado zerado**: `iniciarTutorial` (src/11 l.735–758) zera Quad Coins e score de carreira, devolve a boina à vitrine, reabre a Introdução, repõe nome/telefone de `DB_ALUNO` e apaga o nome de guerra (card mostra "AL SD QUAD ______"). "É o começo do jogo: tutorial roda SEMPRE do zero… refazer não acumula nada" (comentário do fonte). REGRA DE PRODUTO CONFIRMADA.
- **Avatar**: grid de 12 personagens da coleção PM (6 homens + 6 mulheres — rótulos capturados pela sonda: "Homem · cabelo loiro"… "Mulher · negra, tranças"); segurar amplia (zoom) sem escolher; toque simples abre a confirmação com pronome pelo gênero: rótulo que começa com "Mulher" → "**Essa** … é o personagem que você **escolheu**?", senão "Esse"; botão "Sim, sou eu!" (dec. 176; hooks `window.__avLabel/__avPergunta/__avBotao`; sonda confirmou os dois pronomes). A escolha é única — fora do tutorial o grid fica oculto ("o personagem é definitivo", dec. 24); trocar exige refazer a instrução.
- **Nome de guerra** (`tutGuerraOk`, src/10 l.148–165): precisa vir do nome completo — um dos nomes ou uma combinação deles em ordem (subsequência), nunca o nome inteiro, nunca apelido; só letras (acentos aceitos); mínimo 2 caracteres; filtro de palavrões (`TUT_PALAVROES`, 7 termos). Verificado por sonda: "Xuxa" e "Danilo de Almeida Moura" reprovam; "Danilo" e "Almeida Moura" (via regra) aprovam; "Moura Almeida" (ordem invertida) reprova. O QUAD confirma ("Você quis dizer MOURA?") e a validação vale também fora do tutorial, no Salvar do Perfil. Campo com `maxlength=12` (src/03 l.460). O avanço só ocorre quando o aluno para de digitar (debounce 900 ms). REGRA DE PRODUTO CONFIRMADA (mecânica) — ver Divergências para o limite de 12.
- **Salvar perfil** (passo 12): se faltar avatar/nome/telefone/nome de guerra, o QUAD intercepta o clique e aponta o que falta (`tutErro`, src/10 l.458–470).
- **Introdução no Quad** (missão demonstrativa, src/11 l.647–733): 3 questões de múltipla escolha com feedback imediato (uma resposta por questão; erro mostra a correta). **Só 3/3 paga** — errou qualquer uma, o QUAD relança em loop ("Você ainda não conseguiu pontos suficientes… vou lançar as perguntas novamente!"; a `vtut.mjs` prova que 2/3 também reprova). Recompensa `TUT_REW = { score: 30, coins: 25 }`: +30 nos três acumuladores de score de carreira e +25 Quad Coins.
- **Boina exclusiva**: 20 QdC na Loja; no tutorial o QUAD conduz a compra sem modal de confirmação; item mais caro clicado → bronca "não pode comprar este item — é mais caro do que o que você possui!"; comprada, a boina sai da vitrine e veste a foto do personagem na hora ("quem possui, veste", dec. 25). **A compra feita durante o tutorial nasce marcada `semEstorno: true`** (`lojaCompraLog`, src/18 l.420 — grava `semEstorno: !!tutOn`) e por isso **não entra em "Estornos · até 7 dias"** (dec. 193: "ela faz parte do tutorial e não entra na regra"; ver Módulo 10). REGRA DE PRODUTO CONFIRMADA.
- **O DROP não dispara durante o tutorial** (dec. 194): `dropSortear` sai antes do sorteio quando `tutOn` é verdadeiro ("no tutorial o rito é guiado — sem sorteio", src/15 l.51) — a Introdução no Quad nunca premia item de combate por sorteio. Fora do tutorial, o mesmo bloco de 10 passa a sortear (ver Módulo 5). REGRA DE PRODUTO CONFIRMADA.
- **Pular** (`tutPular`, src/11 l.762–787): botão "‹ Pular" oposto ao "Avançar" (dec. 105). Reproduz o estado final constante de quem concluiu: +30 score de carreira, boina garantida/equipada/fora da vitrine, Quad Coins = 25 − preço da boina = **5**, Introdução marcada como feita, `vq_tut_skip=1`. Toast explicativo. Sonda confirmou todos os valores. Detalhe observado em sonda: pular não define nome de guerra — o aluno fica "AL SD QUAD ______" até preencher no Perfil.
- **Concluir** (`tutFim`): grava `vq_tut_skip=1`, toast "Instrução inicial concluída — plataforma liberada!", QUAD acena.
- **Refazer**: só pela central de tutoriais do QUAD (FAB → "↻ Refazer a instrução inicial") — zera tudo de novo; o botão de refazer saiu do Perfil (`vtut.mjs` l.223–232).
- **Introdução no Quad é DA CONTA** (dec. 157): feita uma vez (tutorial ou pular), grava `vq_intro_done=1` e a linha some do bloco "Hoje · questões novas" (dec. 177 — "nada de linha fixa FEITA"); persiste entre sessões (sonda: após relogin a linha continua oculta). Fora do tutorial, concluí-la dá o mesmo +30/+25 e o toast "Introdução no Quad concluída!". Hook de teste `window.__introFeita`. Ver também Módulo 5 (tipologia de missões).

**Fluxo principal:** Login 1º acesso → QUAD se apresenta → foto → zoom → avatar (escolha + confirmação com pronome) → dados do banco confirmados → nome de guerra (regra + confirmação) → salvar → leitura da identidade militar (AL SD QUAD \<nome\>) → insígnia → score zerado → Continuar missão → Introdução no Quad (3/3 obrigatório) → +30 score/+25 QdC → Loja → boina (20 QdC) → saldo 5 → zoom final → despedida → plataforma liberada.

**Ações disponíveis:** Avançar (toque à direita ou botão) · completar a fala com 1 toque · Pular (a qualquer momento) · escolher/ampliar/confirmar avatar ("Ver outros" volta) · confirmar dados ("Corrigir no site" = toast) · digitar/confirmar/mudar nome de guerra · salvar perfil · responder a missão · comprar a boina · refazer a instrução (central do QUAD).

**Regras confirmadas:**
- Tutorial obrigatório no 1º acesso; concluir/pular liberam para sempre (`vq_tut_skip`). REGRA DE PRODUTO CONFIRMADA (dec. 7/17/105).
- Roteiro de 29 passos com gestos e alvos exatos (evolução do roteiro de 19 etapas da dec. 17 — o número 29 é o vigente no código e na suíte). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- Tutorial roda sempre do zero; refazer não acumula. REGRA DE PRODUTO CONFIRMADA.
- Pular = estado final de quem concluiu (dec. 105). REGRA DE PRODUTO CONFIRMADA.
- 12 avatares oficiais PM, escolha única no onboard (dec. 9/24), pronome pelo gênero (dec. 176). REGRA DE PRODUTO CONFIRMADA.
- Nome de guerra derivado do nome completo (subsequência ordenada, sem nome inteiro, sem apelido, sem palavrão); confirmação em dois tempos; mudá-lo depois = refazer a instrução (texto do Perfil, src/03 l.462). REGRA DE PRODUTO CONFIRMADA.
- Identidade militar: `AL SD QUAD <NOME-DE-GUERRA>` — partícula fixa "QUAD" (dec. 18); sem nome de guerra, lacuna "______" (dec. 22). REGRA DE PRODUTO CONFIRMADA.
- Introdução no Quad: 3/3 obrigatório; recompensa 30 score + 25 QdC; é da conta e vale para todas as turmas (dec. 157/177). Mecânica: REGRA DE PRODUTO CONFIRMADA; os valores 30/25/20 (boina) são calibração de demo — ver "Dados demonstrativos".
- Dados pessoais chegam prontos do banco geral; o tutorial confirma, não pede (dec. 22 — formalmente superada pela 182, mas o comportamento demonstrado permanece). REGRA DE PRODUTO CONFIRMADA (na demo).

**Dados utilizados:** `TUT` (29 passos, src/10), `GESTOS`, `TUT_PALAVROES`, `AV_LABELS` (12), sprites `__AVATARS__`/`__DANILO_SPRITE__` (tokens do build), `DB_ALUNO`, `TQ` (3 questões), `TUT_REW` (declarado em src/11), chaves `vq_tut_skip` e `vq_intro_done` no `localStorage`.

**Dados demonstrativos:**
- As 3 questões da Introdução (LIMPE / 1+1 / hierarquia e disciplina) — DADO DEMONSTRATIVO; a mecânica (3 questões rápidas, feedback imediato, loop até 100%) é REGRA DE PRODUTO CONFIRMADA.
- Valores 30 score / 25 QdC / boina 20 QdC — DADO DEMONSTRATIVO calibrado para a narrativa do tutorial ("custa 20 e você tem 25"); a dec. 185 declara as regras econômicas INDEFINIDAS, então os números são placeholders da mecânica, não valores travados.
- Nome/turma do aluno da demo (Danilo de Almeida Moura, PATAMO Noite). DADO DEMONSTRATIVO.

**Resultados esperados:**
- Fim do tutorial: score de carreira 30, Quad Coins 5, boina vestida, nome de guerra definido, Introdução registrada, `vq_tut_skip=1` — estado idêntico ao de quem pulou (menos o nome de guerra, que o pulo deixa vazio).
- Refazer: Quad Coins 0, boina de volta à vitrine por 20 QdC, nome/telefone preservados do banco, nome de guerra limpo, Introdução reaberta (`vtut.mjs` l.226–232).

**Situações de bloqueio ou erro:**
- Salvar com pendência → QUAD aponta avatar/nome/telefone/nome de guerra faltantes.
- Nome de guerra inválido → não avança (sem mensagem até tentar salvar; ao salvar, erro didático).
- Item caro no passo da boina → bronca e devolve a escolha.
- Errar qualquer questão da Introdução → loop de relançamento.
- Toque simples na foto no passo do zoom final é bloqueado (só segurar vale).
- Interromper a instrução (fechar o app) → recomeça do início no próximo login ("V0: instrução interrompida recomeça do início", src/10 l.107).

**Simulações atuais:**
- Recompensas e carteiras vivem em memória, mas **desde a dec. 196 parte do estado persiste** no `localStorage` (DA-10, chave `vq_evolucao`): score de carreira, Quad Coins, Diamantes, mochila, avatar, nome de guerra, turma ativa, skins possuídas e os 60 últimos lançamentos do extrato voltam depois do F5 (ver Módulo 7). São **3 chaves** vivas: `vq_tut_skip`, `vq_intro_done` e `vq_evolucao`. SIMULAÇÃO LOCAL (o dono do dado continua sendo o servidor — ver DA-07/P1).
- "Corrigir no site" e correção de cadastro = toast. SIMULAÇÃO LOCAL.
- Central de tutoriais: os 6 tutoriais listados além da instrução respondem "em construção". SIMULAÇÃO LOCAL / FUNCIONALIDADE PLANEJADA.

**O que precisará de implementação real:**
- Persistência do estado do tutorial/identidade por conta no servidor (hoje `localStorage` + memória).
- Catálogo real de avatares e artes por variante (as fotos por item vestido entram por tokens do build).
- Validação server-side do nome de guerra (unicidade? hoje não há checagem de duplicidade entre alunos).
- Conteúdo real da Introdução e dos demais tutoriais da central.

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA: demais tutoriais da central do QUAD ("em construção"); quests da mochila; skins aplicadas ao boneco (V1); chat ao vivo.
- FUNCIONALIDADE PLANEJADA (implícita): mudança de nome de guerra sem refazer a instrução inteira — hoje o único caminho é refazer (decisão implícita no texto do Perfil).

**Decisões posteriores:**
- **Dec. 182 (01/08)** supera formalmente a dec. 22 (dados do banco geral) e a dec. 6: cadastro/dados passam a ser módulos internos; o comportamento demonstrado (pré-preenchimento + confirmação no tutorial) permanece como demonstração vigente. DECISÃO POSTERIOR.
- **Dec. 188 (01/08)**: limpeza de código morto removeu `tutDadosOk` e chaves `vq_*` não lidas; manteve aberto por exigir decisão o bug do reset que não limpava `vq_intro_done`. DECISÃO POSTERIOR. **Dec. 196 (03/08)**: a decisão veio junto com a implementação da DA-10 — o reset passou a limpar **as três** chaves (`vq_tut_skip`, `vq_intro_done`, `vq_evolucao`); **o bug está corrigido**.
- Dec. 177 (28/07) é a última palavra sobre a linha da Introdução (some quando feita) — substitui o comportamento anterior de linha fixa "FEITA · DA CONTA". DECISÃO POSTERIOR.
- **Dec. 193 (02/08)**: a boina comprada no tutorial fica **fora da janela de 7 dias** — `COMPRAS` ganhou o campo `semEstorno` e `renderEstornos` filtra essas linhas. Antes, a boina aparecia em "Estornos · até 7 dias" como qualquer compra. DECISÃO POSTERIOR.
- **Dec. 194 (02/08)**: o sistema de DROP existe, mas **não roda no tutorial** — o passo da boina segue sendo a única forma de o aluno ganhar item na instrução. DECISÃO POSTERIOR.

**Divergências:**
- DIVERGÊNCIA (achado de sonda): **`maxlength=12` do campo × regra de combinação** — a regra aceita combinações em ordem ("Almeida Moura"), mas o campo corta em 12 caracteres, tornando combinações longas impossíveis de digitar (o valor truncado "Almeida Mour" reprova). "Danilo Moura" (12) cabe por coincidência. Sondas `invA-guerra.mjs/2/3`: via `dispatchEvent` programático o mesmo valor avança — é o limite do input, não a regra, que barra.
- DIVERGÊNCIA (documental): dec. 17 registra "tutorial de 19 etapas"; o roteiro vigente tem 29 passos (o registro não foi atualizado a cada expansão; o código e a suíte `vtut.mjs` são a verdade).
- DIVERGÊNCIA: pular deixa a conta sem nome de guerra ("AL SD QUAD ______") — nenhum passo posterior obriga a defini-lo (dá para salvar o Perfil depois). Comportamento real, possivelmente não intencional. Registrado também como pergunta.

**Perguntas pendentes:**
1. PERGUNTA PENDENTE: o nome de guerra deve ser único na turma/plataforma (tradição militar) ou pode repetir? Hoje não há checagem.
2. PERGUNTA PENDENTE: o limite de 12 caracteres é intencional (padrão de tarjeta) ou deve ceder para combinações válidas mais longas?
3. PERGUNTA PENDENTE: quem pula a instrução deveria ser obrigado a definir nome de guerra e avatar em algum momento? Hoje fica "______" e avatar padrão.
4. PERGUNTA PENDENTE: refazer a instrução zera score/Quad Coins da conta de verdade no produto final, ou o reset é só teatro do protótipo? (Hoje zera as variáveis reais da sessão — no produto isso destruiria progresso.)
5. PERGUNTA PENDENTE: a lista de palavrões (7 termos) será substituída por um filtro de moderação real?

---

## Módulo 3 — Conta, matrículas e turma ativa

**Nome do módulo:** Conta do aluno, matrículas múltiplas e turma ativa (o que é DA CONTA × o que é DA TURMA).

**Objetivo:** Permitir que um aluno com uma conta única acumule matrículas em várias turmas (compradas na Quad Store), com **uma** turma ativa comandando o que o app mostra (aula, avisos, ranking, Domínio, missões, calendário, quiz), trocável a qualquer momento sem sair da conta — enquanto carreira, moedas e itens permanecem da pessoa.

**Perfis envolvidos:** Aluno (dono da conta); Administrador (cria turmas, bloqueia contas, credita moedas — detalhado no módulo do administrador, na segunda metade desta especificação); Professor (recebe as turmas onde está inserido).

**Funcionamento atual:**
- **Conta**: identificada pelo e-mail do login (`#contaEmail`); dados pessoais de `DB_ALUNO`; carreira em `carreira` (nome, nome de guerra, patente, 3 acumuladores de score, estado, histórico — src/07 l.41–51, comentário: "no sistema real vem validado do servidor"); carteiras `score` (Quad Coins) e `diamantes`; posses `lojaOwned`/`MOCHILA`/skins; flag `bloqueada` em `CONTAS['eu']`. SIMULAÇÃO LOCAL (tudo em memória).
- **Matrículas**: array `MATRICULAS` (src/07 l.164); a demo nasce com PATAMO Noite (CFO, fim 15/12/2026). `matriculasAtivas()` filtra por `fim >= hoje`. Compra de turma na Quad Store (src/14 l.58–148): item único com vagas por moeda (ex.: "600 Dmn (54 vagas) · 700 QdC (6 vagas)" — sonda), pop-up "Creditar em qual moeda?", débito + baixa da vaga daquela moeda + push em `MATRICULAS` + log de compra (ver Módulo 8). Estados na vitrine: MATRICULADO / INDISPONÍVEL (turno ocupado) / ESGOTADA.
- **Limite de matrículas**: não há limite numérico; o limite é estrutural — **uma turma por turno** (`turnoOcupadoPor`, src/07 l.208–211) e **sem sobreposição de horário na agenda** (choque barra matrícula, src/14 l.104–105). Com o catálogo demo (turmas só de manhã e noite), o máximo prático é 2 simultâneas — a sonda `invA-turma.mjs` comprovou: com PATAMO (noite) + RONDESP Manhã, tanto BOPE noite quanto BOPE manhã ficam INDISPONÍVEL com o toast "Você já estuda no turno da …". FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO + REGRA DE PRODUTO CONFIRMADA (dec. 62; RN-07).
- **1ª matrícula** (quando não havia nenhuma): assume o app sem perguntar (`definirTurmaAtiva(id, silencioso=true)`), destrava o `appLock` e fecha o `matLayer` (sonda `invA-bloqueios.mjs` seção A). REGRA DE PRODUTO CONFIRMADA (dec. 62: "matrícula-mestre").
- **2ª matrícula em diante**: abre o pop-up `#trocaLayer` "**Matrícula confirmada** — Você entrou na \<nova\> e já tinha outra turma. Qual delas o app deve abrir agora?", um botão por turma ("Abrir o perfil da Turma X", com concurso, turno, horário, sala e selo "em uso agora" na atual); rodapé explica o alcance e os três lugares de troca. Tocar fora mantém a turma em uso (dec. 147/154; sonda capturou títulos e opções).
- **Troca de turma ativa** (`definirTurmaAtiva`, src/07 l.180–206): muda `turmaAtivaId`, a chave do cronograma (`ALUNO_TURMA`) e o Domínio (concurso da turma) e redesenha em cadeia os subsistemas: carreira/topo, Aula de hoje, avisos, rankings, Minhas turmas, materiais, quiz da aula, calendário, faixa do Domínio, rodízio de flashcards (`trTrocaTurma`), blocos do dia e atrasadas — 12 renders + 2 redefinições (a documentação citava "11 subsistemas"; a contagem exata no código é essa lista). Toast: "Você está na \<turma\> — Início, avisos, ranking e Domínio passam a ser desta turma." Hook `window.__turmaAtiva()`. Sonda: troca patamo-n → rondesp-m mudou herói ("Bloco da manhã"), Domínio ("PM-BA · Soldado · CFSd 2025"), topo, Minhas turmas.
- **Três caminhos de troca** (dec. 152/153/146): (1) o nome da turma no topo vira botão quando há 2+ matrículas (`cardTurma.trocavel`; com 1 matrícula fica `disabled` — sonda); (2) faixa no Domínio "Esta é a estrutura da \<turma\> — você tem N turmas" + "Trocar de turma" (a faixa só aparece com 2+; sonda); (3) Minhas turmas no Perfil (selo EM USO × botão "Usar esta"). Reaberto pelo topo, o mesmo pop-up muda o título para "**Suas turmas**" (dec. 154 — "um pop-up, dois momentos"; sonda confirmou).
- **Encerramento/expiração**: matrícula com `fim` vencido some de `matriculasAtivas()`; sem nenhuma ativa → `checarMatricula()` liga o `appLock` e abre `#matLayer` ("Sua turma terminou e a matrícula não foi renovada… funções bloqueadas até você entrar em uma nova turma"); a nav só deixa a Loja (toast "Funções bloqueadas — matricule-se…"). Hook de teste `window.__mat.encerrar()/ativas()` (usado pela sonda). Estorno de matrícula (até 7 dias) devolve moeda + vaga e libera o turno (dec. 67/100; detalhado no Módulo 10 — Compras, matrículas e estornos); estornar a turma em uso passa o app à matrícula restante (dec. 162).
- **DA CONTA × DA TURMA** (dec. 148, RN-19; dec. 156/146):
  - **Da conta (pessoa)**: score de carreira/patente (sobe de Soldado a Coronel independentemente de onde estuda), Quad Coins e Diamantes, mochila/itens/skins/avatar, nome de guerra, Introdução no Quad (`vq_intro_done`), compras/estornos, recados do chat. Nenhuma estrutura vincula saldo a turma (ver Módulo 7).
  - **Da turma (via turma ativa)**: Aula de hoje, avisos (alvo por id de turma), blocos de missões do dia/atrasadas/bônus do turno (estado POR TURMA — turma nova nasce "no dia zero" com horários dela), rodízio de flashcards e ajuste de Domínio por concurso, calendário de aulas, Domínio/árvore do edital, materiais (nota: materiais listam TODAS as turmas com matrícula ativa, etiquetados por turma — não só a ativa), ranking da sala, quiz da aula, herói "Bloco da manhã/tarde/noite" (ver Módulos 4 e 5).

**Fluxo principal:** Aluno matriculado usa o app pela turma ativa → compra 2ª turma na Quad Store (pop-up de moeda → débito → vaga) → pop-up "Matrícula confirmada" pergunta qual turma abre → escolhida, tudo re-renderiza e o toast confirma o alcance → troca posterior pelo topo/Domínio/Minhas turmas → turma encerra → sem nenhuma ativa, app trava na Loja até nova matrícula (que assume sozinha).

**Ações disponíveis:** Comprar turma (escolhendo moeda) · escolher turma ativa no pop-up pós-matrícula · trocar turma ativa (topo / Domínio / Minhas turmas) · fechar o pop-up sem trocar · estornar matrícula em até 7 dias (ver Módulo 10) · (sem matrícula) ir à Loja pelo `#btnMatLoja`.

**Regras confirmadas:**
- Turma vendida em duas moedas com vagas separadas (dec. 61/155; RN-06). REGRA DE PRODUTO CONFIRMADA (mecânica).
- **Um turno por aluno** até o término da turma (dec. 62; RN-07) — independe da moeda. REGRA DE PRODUTO CONFIRMADA.
- **Matrícula não pode sobrepor horário** na agenda (dec. 101; exceção barrada do "EM CHOQUE", dec. 107). REGRA DE PRODUTO CONFIRMADA.
- **Turma ativa comanda; troca sem deslogar** (dec. 146; RN-08); pop-up pós-matrícula da 2ª em diante (dec. 147; RN-09); seletor no topo (dec. 152); faixa no Domínio (dec. 153); um pop-up, dois momentos (dec. 154). REGRA DE PRODUTO CONFIRMADA.
- **1ª matrícula assume sem perguntar** (dec. 62). REGRA DE PRODUTO CONFIRMADA.
- **Sem matrícula ativa, app trava (só Quad Store)** (dec. 62; RN-03). REGRA DE PRODUTO CONFIRMADA.
- **Score de carreira/patente/Quad Coins/mochila/avatar são DA PESSOA** (dec. 148); **missões/aula/avisos/calendário/Domínio/materiais são POR TURMA** (dec. 156/160/163); Introdução no Quad é da conta (dec. 157). REGRA DE PRODUTO CONFIRMADA.
- Classificação viva: posição/total da sala calculados da turma ativa (dec. 162). REGRA DE PRODUTO CONFIRMADA.
- Estorno de matrícula devolve vaga e libera turno; consumo mata estorno (dec. 67/178; ver Módulo 10). REGRA DE PRODUTO CONFIRMADA.
- **Turma encerrada não é apagada — fica ARQUIVADA, com histórico consultável** (DA-06, dec. 195; implementada na dec. 196). No protótipo: `matriculasArquivadas()` (src/07) devolve as matrículas cujo `fim` já passou; a semente `rondesp-m` ("RONDESP MANHÃ", fim **2026-06-30**, `arquivada: true`) existe justamente para demonstrar o caso; o bloco "**Minhas turmas · ativas e arquivadas**" do Perfil (src/12) lista a turma com a etiqueta `ARQUIVADA` e a nota de que desempenho, compras e materiais continuam disponíveis para consulta. A turma arquivada **não** pode ser escolhida como turma ativa. REGRA DE PRODUTO CONFIRMADA (DA-06) · FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.

**Dados utilizados:**
- `TURMAS_LOJA` (`data/turmas-loja.js`): 5 turmas (RONDESP/PATAMO/BOPE noite · RONDESP/BOPE manhã) com preço Dmn/QdC, vagas por moeda, sala, horário, concurso, início/fim. DADO DEMONSTRATIVO.
- `MATRICULAS` (sementes: PATAMO Noite **ativa** + RONDESP MANHÃ **arquivada**, fim 2026-06-30 — DA-06), `matriculasArquivadas()` (src/07), `turmaAtivaId`, `CONCURSOS` (`data/concursos.js` — 6 concursos com árvore de edital), `MODALIDADES` (nivelamento/regular/questões — RONDESP/PATAMO/BOPE são apelidos, dec. 138), `DB_ALUNO`, `CONTAS`.
- Saldos-semente: 1.240 QdC / 150 Dmn (sem tutorial) — DADO DEMONSTRATIVO.

**Dados demonstrativos:** Catálogo de turmas, preços (600–2.800), vagas, datas de início/fim, concursos e salas; a conta-demo já matriculada; contas-semente do painel. Todos DADO DEMONSTRATIVO — as mecânicas (duas moedas, vagas por moeda, turno, datas) são confirmadas; valores econômicos são indefinidos por decisão (dec. 185).

**Resultados esperados:**
- Compra da 2ª turma: débito exato (1.240 − 700 = 540 QdC na sonda), vaga da moeda decrementada, pop-up de escolha, matrículas ativas = 2.
- Troca: topo/Domínio/herói/missões/ranking/materiais/calendário refletem a nova turma imediatamente; toast padrão.
- Sem matrícula: `matLayer` + nav travada; nova matrícula destrava e assume.
- Turno ocupado: item INDISPONÍVEL + toast explicativo.

**Situações de bloqueio ou erro:**
- Turno ocupado → compra barrada (INDISPONÍVEL).
- Choque de horário com outra atividade → matrícula barrada ("matrícula em turma não pode se sobrepor").
- Saldo insuficiente → "Quad Coins insuficientes — complete missões…" / "Diamantes insuficientes — recarregue no site…".
- Turma esgotada (vagas das duas moedas = 0) → ESGOTADA.
- Sem matrícula ativa → app travado exceto Loja.
- Conta bloqueada → sem acesso (ver Módulo 1).

**Simulações atuais:**
- Matrículas (as compradas), vagas e datas em memória — recarregar a página restaura a semente. **Exceções desde a dec. 196**: a **turma ativa escolhida** e os **saldos** voltam do `localStorage` (`vq_evolucao`, DA-10) — ver Módulo 7. SIMULAÇÃO LOCAL.
- `hojeISO()` usa o relógio local para vigência da matrícula. SIMULAÇÃO LOCAL.
- Pagamento em Diamantes = saldo fictício vindo de "recarga do checkout" simulada. SIMULAÇÃO LOCAL / `[INTEGRAÇÃO REAL]`.
- Hooks de teste (`__mat`, `__turmaAtiva`, `__matRefresh`) fazem parte do contrato das suítes (tests/README: **42 ganchos** `window.__*` estáveis, contados no `src/`).

**O que precisará de implementação real:**
- Módulo de matrículas (dec. 182 o lista como módulo interno): vigência, renovação, encerramento e reflexo em vagas no servidor.
- Pagamento real (site/checkout externo) e conciliação com as vagas por moeda.
- Persistência da turma ativa por conta e sincronização entre dispositivos.
- Regras econômicas (preços, câmbio Dmn×QdC, política de vagas) — INDEFINIDAS por decisão (dec. 185).
- Expiração/renovação automática de matrícula e comunicação prévia ao aluno (hoje o aluno só descobre pelo pop-up).

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA: renovação de matrícula (o pop-up já fala "não foi renovada", mas não existe fluxo de renovar — só comprar de novo); perfis de turma mais ricos (o "perfil da turma" é uma visão, não uma conta — dec. 148); notificação de fim de turma.

**Decisões posteriores:**
- **Dec. 182 (01/08)**: "matrículas" viram módulo interno da plataforma (antes: sistema externo liberando o app). O comportamento demonstrado permanece. DECISÃO POSTERIOR.
- Dec. 185: regras econômicas seguem indefinidas — os preços/vagas da demo não são especificação. DECISÃO POSTERIOR.
- Dec. 191: os catálogos (turmas, concursos, docentes) foram extraídos para `data/` como fragmentos verbatim — mesma semântica, casa nova. DECISÃO POSTERIOR.

**Divergências:**
- DIVERGÊNCIA (texto × dado): o pop-up "Matrícula encerrada" diz "Sua turma terminou e a matrícula não foi renovada" mesmo quando a ausência de matrícula tem outra causa (ex.: estorno) — texto único para qualquer estado sem matrícula.
- DIVERGÊNCIA (contagem): a documentação interna fala em "11 subsistemas" redesenhados na troca; o código atual chama 12 funções de render + 2 redefinições (a lista cresceu com as dec. 156/160 e a contagem citada não foi atualizada). Sem efeito funcional.
- DIVERGÊNCIA (nuance, não é defeito): "Materiais das aulas" mostra as turmas de TODAS as matrículas ativas (etiquetadas), não apenas a turma ativa — comportamento intencional, mas destoa da frase-resumo "tudo segue a turma ativa".
- DIVERGÊNCIA (dados-semente): a turma PATAMO da demo tem `inicio: '2026-06-01'` anterior ao "hoje" e as demais começam 03/08 — datas-semente reancoradas (dec. 189); vencendo no calendário real, a demo esvazia (recomendação registrada: datas relativas).

**Perguntas pendentes:**
1. PERGUNTA PENDENTE: haverá limite de matrículas simultâneas além da regra do turno (ex.: máximo de 2 turmas)?
2. PERGUNTA PENDENTE: renovação — a turma que termina gera oferta de renovação automática/desconto, ou o aluno sempre recompra na Loja?
3. PERGUNTA PENDENTE: ao encerrar a turma ativa restando outra, o app troca sozinho (o código de estorno faz isso — dec. 162); e no vencimento por data da turma ativa com outra vigente? (O `turmaAtiva()` autocorrige para a 1ª ativa silenciosamente — é o comportamento desejado, sem avisar o aluno?)
4. PERGUNTA PENDENTE: o histórico da turma encerrada (missões, ranking, materiais) fica acessível ao aluno depois do fim? Hoje some tudo que era "da turma".
5. PERGUNTA PENDENTE: vagas por moeda — esgotada a cota QdC, o admin pode realocar cotas (o editor permite); existirá regra automática de remanejamento?

---

## Módulo 4 — Tela inicial e cronograma

**Nome do módulo:** Tela inicial do aluno e cronograma ("Início" · Aula de hoje · Avisos gerais · Eventos da semana · Atualizações do dia).

**Objetivo:** Responder, ao abrir o app, "o que acontece hoje na minha turma e no Quad": a aula do dia com horários e professores, a missão principal da noite (cartão herói — detalhado no Módulo 5), os avisos da administração e a esteira de eventos do Quad, tudo comandado pela turma ativa do aluno (ver Módulo 3).

**Perfis envolvidos:** Aluno (consome); Administração/N.P.P. (edita cronograma, publica avisos e materiais em "Atualizações do dia", cria eventos); Professor (indiretamente: o quiz da aula muda o selo do card — ver Módulo 6); Coordenação (fonte real do cronograma: planilha Google Sheets, apenas citada).

**Funcionamento atual:**
- **Aula de hoje** (`#salaCard`, `renderAulaHoje` em src/08 l.524–561): a grade vem de `CRONO` (`data/crono.js` — snapshot da "Semana 30", 3 turmas com 2 tempos × 5 dias). A chave da grade é o **ID da turma** (`cronoKey`, l.466; dec. 163) — `sincronizarCronoTurmas` (l.467–479) cria grade em branco para turma nova e apaga a de turma extinta ("nada de turma-fantasma"). O título usa o nome e a sala da turma real matriculada (`turmaAtiva()`, dec. 151); os horários dos tempos saem da turma dona da grade (`turmaCronoSlots`/`horSlots`, l.501–512), com fallback `CRONO.slots` (19h–20h30 / 20h30–22h). Selos por relógio local: `mins >= faixa[i][1]` → ENCERRADO; `>= faixa[i][0]` → AGORA (l.543–556). Fim de semana → "Sem aula da sua turma hoje · próxima: segunda" (l.531, spec da suíte `tests/vaula.mjs`, que congela o relógio). Slot vazio → "A definir · A coordenação ainda não lançou a grade desta turma" (l.549–555). O card re-renderiza a cada abertura do Início (`showView` em src/07 l.366; dec. 27). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO; a semana embutida é SIMULAÇÃO LOCAL da planilha da coordenação (comentário l.454–458: "na V1 o app sincroniza direto da planilha").
- **Avisos gerais** (`#avisosList`; `AVISOS`/`renderAvisos` em src/16 l.369–449): cada aviso tem `alvo` = `'todas'` ou o ID de uma turma (dec. 149); o aluno vê os avisos da turma **ativa** (`avisoVisivel`, l.378–381). Admin envia/edita/remove em "Avisos gerais" com seletor de turma-alvo. Sonda `b1-aula-hoje.mjs`: aviso alvo `patamo-n` some ao trocar para a RONDESP Manhã. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO · SIMULAÇÃO LOCAL (entrega real depende de back-end).
- **"Atualizações do dia" (admin → aluno)**: o atalho do admin (dec. 145) abre dois blocos: (a) **Cronograma semanal · atualizar** (`btnAdmCrono`, src/16 l.531–550) — seletores de turma (nome real, value = id), dia, tempo, matéria (da árvore do edital da turma) e professor (do Banco de professores filtrado pela matéria, dec. 91); salvar grava no `CRONO`, atualiza o corpo docente da turma, registra histórico (`CRONO_LOG`) e chama `renderAulaHoje()` — "o card do aluno muda na hora"; (b) **Materiais da aula · enviar** (`MATERIAIS`, l.552–711; dec. 144) — turma → matéria da árvore → assunto → tipo (slides/resumo/lista/mapa/vídeo) → arquivo real (objectURL baixável, dec. 164) ou link de vídeo; chega em "Materiais das aulas" (no "+" do aluno) só para quem está na turma, agrupado por matéria—assunto ("mesmo padrão do banco de questões", src/03 l.559). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO · SIMULAÇÃO LOCAL.
- **Eventos da semana** (`#evStrip`, src/08 l.46–116): esteira horizontal infinita (3 cópias; arrasto de mouse e roda). Eventos são **do QUAD, não da turma** (dec. 161 — revogou a turma-alvo da dec. 150): todo evento vigente aparece para qualquer aluno. Etiquetas, em ordem de prioridade — três de **estado** (INSCRITO / LOTADO / EM CHOQUE) e duas de **tipo** (NA LOJA para o pago, +BÔNUS para o gratuito que dá Quad Coins). A **dec. 200 encerrou a tag livre** (`ev.tag`, que produzia o "+COINS" das sementes): o +COINS dizia o mesmo que o +BÔNUS, e como **todo evento passou a pontuar 10** o score deixou de distinguir qualquer coisa — quem distingue é o Coin, e por isso `evTemBonus` só olha para `ev.coins`. Pago não comprado: **o clique abre a página do evento como qualquer outro** (dec. 199, que reviu a dec. 173 — antes ia direto à Loja); a ida à Loja passou a ser o **botão de ação** de lá dentro, que fecha a página e leva ao item com destaque piscando (`lojaLevarAte`, l.223–234; ver Módulo 8). Página do evento (`openEvento`, l.237–308): regras de score de carreira e de Quad Coins por evento (arrays `score`/`coins` de `data/eventos.js`; **todo evento traz a regra "Participação no evento · +10 score"** — `EV_SCORE_PADRAO`, dec. 200 — e o card de Coins não é desenhado quando o evento não dá nenhum), inscrição gratuita com confirmação em 2 toques quando há choque de agenda, link do evento online liberado ao inscrito (toast demo), botão "Garimpar Quad Coins escondidos" (+15 QdC, uma vez — missão de evento). Vencido (`evAcabou`) some do carrossel, da Loja e do calendário. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- **Atalhos e demais cards do Início**: cartão herói de missão (ver Módulo 5), card de Quad Coins (abre a Loja), Diamantes, barra de score de carreira, seletor de turma no topo (`#cardTurma` vira botão com 2+ matrículas, dec. 152), botão "+" (Perfil, Pré-TAF, Calendário, Materiais, chat; prévias bloqueadas).
- **Comportamento POR TURMA (troca de turma ativa)**: `definirTurmaAtiva` (src/07 l.180–206) re-renderiza Aula de hoje, avisos, rankings, Minhas turmas, materiais, quiz da aula, calendário, Domínio (+ concurso) e a aba Missões inteira (`trTrocaTurma`, `renderDia`, `renderAtrasadas`), com toast "Início, avisos, ranking e Domínio passam a ser desta turma". Provado ponta a ponta na sonda `b1-aula-hoje.mjs` via compra real da 2ª turma e pop-up de troca (dec. 146–147, 154; ver Módulo 3). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO · REGRA DE PRODUTO CONFIRMADA.

**Fluxo principal:** Login → Início → card Aula de hoje (turma ativa, dia de hoje, selos AGORA/ENCERRADO ao vivo) → rolagem: herói de missões → Avisos gerais (da turma) → esteira de Eventos → toque num evento abre a página com regras e inscrição; toque no nome da turma no topo abre "Suas turmas" para trocar a turma que comanda tudo.

**Ações disponíveis:** Aluno: abrir/rolar o Início, tocar evento (inscrever-se, garimpar, seguir para a Loja se pago), tocar "Entrar no quiz ao vivo" quando ativo, trocar turma ativa (topo, Domínio ou Minhas turmas), abrir Materiais pelo "+". Admin: atualizar a grade (turma/dia/tempo/matéria/professor), enviar/editar/remover aviso (com alvo), publicar/tirar do ar materiais, criar/editar/cancelar eventos.

**Regras confirmadas:**
- A grade do cronograma é **da turma, chaveada por ID** — turma nova nasce com grade em branco; turma extinta sai (dec. 163, 78). REGRA DE PRODUTO CONFIRMADA.
- O título da Aula de hoje mostra nome e sala da matrícula real; slot sem grade mostra "A definir" (dec. 151). REGRA DE PRODUTO CONFIRMADA.
- Faixas AGORA/ENCERRADO derivadas do horário da própria turma (dec. 72); re-render ao abrir o Início (dec. 27). REGRA DE PRODUTO CONFIRMADA.
- Aviso tem turma-alvo por ID ou "todas"; o aluno vê os da turma em uso (dec. 149; RN-53). REGRA DE PRODUTO CONFIRMADA.
- **Eventos são do Quad** (sem turma-alvo, dec. 161); gratuito premia ao participar, pago vende na Loja (dec. 40); evento de vários dias permanece INSCRITO até o último dia (dec. 58); presencial herda a lotação da sala e vira LOTADO (dec. 179; salas 155/85/125/185). REGRA DE PRODUTO CONFIRMADA.
- Clicar na etiqueta "NA LOJA" **abre a página do evento** (dec. 199); é o botão "Comprar na Quad Store · N QdC" de lá que leva ao item exato, centralizado e piscando (dec. 173, preservada no destino). REGRA DE PRODUTO CONFIRMADA.
- Materiais: professor entrega à coordenação; **a coordenação publica**; etiquetagem por matéria e assunto; visível só para a turma (dec. 144). REGRA DE PRODUTO CONFIRMADA.
- "EM CHOQUE" avisa sem impedir (eventos/simulados); matrícula em turma segue barrada por choque (dec. 107, 101). REGRA DE PRODUTO CONFIRMADA.

**Dados utilizados:** `CRONO` (semana, turno, slots, dias, datas, turmas por id com `[{e,m,p}]`), `TURMAS_LOJA` (nome, sala, turno, `hor`, concurso), `MATRICULAS`/`turmaAtivaId`, `AVISOS` (t, d, alvo), `EVENTOS` (id, nome, tipo, modalidade, pago, preço/moeda, quando/dataISO/ate, sala/hi/hf, profs, score[], coins[], garimpo, link), `evState` (garimpado/inscrito/comprado por evento), `MATERIAIS` (turma, matéria, assunto, tipo, arquivo/link), `CAL_BASE` (marcos fixos do calendário).

**Dados demonstrativos:** A "Semana 30" inteira do `data/crono.js` (matérias, encontros, professores); as 3 turmas com grade; os 2 avisos-semente; os 7 eventos de `data/eventos.js` (reancorados +8 semanas — dec. 189) com todos os valores de score/coins por evento (ex.: presença +30/+40, garimpo +15, top 10 +50) — são balanceamento de demonstração (dec. 185: regras econômicas permanecem indefinidas), a **mecânica** (regras por evento definidas pela administração) é o que está confirmado; os 5 materiais-semente; horário fixo "21:47" da statusbar; sala "SALA 4" no `crono.js` da PATAMO (ver Divergências). DADO DEMONSTRATIVO.

**Resultados esperados:** O aluno que abre o app numa terça vê a aula de hoje da sua turma com o que está acontecendo AGORA, os avisos que valem para ele, e os eventos vigentes; o que o admin muda (grade, aviso, material, evento) reflete no aluno na mesma hora (mesma sessão do protótipo).

**Situações de bloqueio ou erro:** Sem matrícula ativa o app trava (`checarMatricula`/`appLock` — ver Módulo 3); fim de semana → sem selo e aviso de próxima aula; turma sem grade → "A definir"; evento lotado → LOTADO (toast com sala e capacidade); choque de agenda → confirmação em 2 toques ("sem reposição de aula"); evento pago sem saldo → "sem saldo" na compra; cronograma sem professor da matéria no banco → bloqueia com aviso ("cadastre-o antes"); quiz da aula exige conexão (simulada).

**Simulações atuais:** SIMULAÇÃO LOCAL: cronograma embutido (planilha real citada como fonte); relógio local como fonte das faixas; avisos/materiais/eventos vivem em memória JS (não persistem entre sessões — o que sobrevive são as 3 chaves `vq_*`: tutorial, introdução e a evolução do aluno gravada pela DA-10); "aluno inscrito" e ocupação de eventos parcialmente semeados (`ev.ocup`); link do evento online é toast; conectividade é um interruptor demo.

**O que precisará de implementação real:** Sincronização do cronograma com a planilha/planejamento da coordenação (ou módulo interno pós-dec. 182); back-end de avisos, materiais (armazenamento de arquivos) e eventos com push em tempo real; inscrição/lotação/entrada de eventos server-side; relógio/fuso confiável; persistência da turma ativa por conta; links reais de eventos online.

**Funcionalidades futuras relacionadas:** FUNCIONALIDADE PLANEJADA: V1 — sincronização direta da planilha (comentário src/08 l.456–457); notificações; geofencing/check-in (prévias bloqueadas no "+").

**Decisões posteriores:** Dec. 182 (Consolidação v1.0) tornou cronogramas, administração e comunicação módulos internos da plataforma — o texto "planilha da coordenação" do rodapé passa a descrever uma integração transitória. DECISÃO POSTERIOR.

**Divergências:**
- DIVERGÊNCIA (dados de demonstração): `data/crono.js` diz PATAMO = "SALA 4"; `data/turmas-loja.js` diz "Sala 2". O título usa a turma (Sala 2) e o `crono` só entra como fallback — o dado duplicado ficou inconsistente (provado na sonda `b1-aula-hoje.mjs`).
- DIVERGÊNCIA (documental leve): o rodapé do card afirma "atualizado pela planilha da coordenação", mas quem atualiza no protótipo é o bloco do admin — e a dec. 182 internaliza o módulo.

**Perguntas pendentes:**
- PERGUNTA PENDENTE: na produção, o cronograma nasce na planilha da coordenação (integração Google Sheets) ou já no módulo interno (dec. 182)? Qual é a fonte única?
- PERGUNTA PENDENTE: o selo AGORA deve considerar fuso/atraso do dispositivo ou horário do servidor?
- PERGUNTA PENDENTE: avisos devem ser da turma **ativa** (como hoje) ou de **todas as matrículas** do aluno? O protótipo esconde aviso de uma turma em que ele está matriculado mas não está usando.

---

## Módulo 5 — Missões e treinamento

**Nome do módulo:** Missões e Treinamento Rápido (blocos do dia, atrasadas, recompensa da noite, flashcards, Introdução no Quad, missões de eventos).

**Objetivo:** Fazer o aluno voltar todo dia: micro-blocos de 10 questões rápidas ligados às aulas (revisão espaçada D0/D+1/D+7/D+30), treinamento contínuo estilo Anki e recompensa visível ao fechar o dia — pagando participação em Quad Coins e esforço em score de carreira, e alimentando o Domínio.

**Perfis envolvidos:** Aluno (executa tudo); "Operador" (papel futuro citado: extrai 2 PDFs por aula — PDF 01 = 40 certo/errado em 4 ondas; PDF 02 = banco geral; comentário src/11 l.1–9 e l.533); Administração (lança simulados — que desde a dec. 165 moram no Calendário, não em Missões); o QUAD/tutorial (Introdução no Quad — ver Módulo 2).

**Funcionamento atual:**
- **Tipologia real de missões no código** (nada além disto existe): (1) **Introdução no Quad** — 3 questões, única, da conta (`vq_intro_done`; some da lista quando feita — dec. 157/177; detalhada no Módulo 2); (2) **Blocos do dia** ("Hoje · questões novas") — 10 rápidas certo/errado por bloco; a demo traz 8 vivos: 2 das aulas de hoje (fonte 'deck' do TR_BANK) + 6 revisões ("aula de ontem", "semana passada", "mês passado"; as de Dir. Administrativo vêm do `AULA_DEMO`, fatias de 10 do PDF 01); (3) **Atrasadas** — blocos não feitos com idade ≥ 7 dias, recuperáveis; (4) **Treinamento Rápido** — rodízio contínuo, sem prazo; (5) **Missões de eventos** — check-in/garimpo/desafios na página de cada evento (regras por evento; garimpo +15 QdC — ver Módulo 4); (6) **Simulados** — no Calendário (ver Módulo 6). **Não existem "missões semanais" implementadas**: o "Corte das missões da semana (SÁB 23h59)" existe só como linha decorativa do calendário (`CAL_BASE`, src/08 l.316) e o toast "expira 23h59" pertence ao motor de quiz órfão (ver Módulo 6) — ambos texto, sem mecânica. DIVERGÊNCIA entre texto e mecânica (ver abaixo).
- **Regras internas dos blocos** (comentário src/11 l.29–33, invisíveis ao aluno): cada bloco "nasce quando o sistema libera (22h15 do seu dia)"; concluído, desaparece; sem resposta, expira em 7 dias (`DIA_EXPIRA_DIAS = 7`, l.33) e cai em Atrasadas. Abrir a aba Missões revalida os 7 dias (dec. 106; `showView` em src/07 l.370–374). A liberação às 22h15 é só narrativa — os seeds nascem todos prontos (`criadoEm = Date.now() − idadeDias`). SIMULAÇÃO LOCAL.
- **Blocos são POR TURMA** (dec. 156; `BLOCOS_TURMA`, l.49–71): cada matrícula tem sua fila; turma nova nasce "no dia zero", sem atrasadas, com as rápidas no horário dela (`novosBlocosDia` usa `horSlots(t.hor)` — provado na sonda `b1-aula-hoje.mjs`: "aula de hoje · 8h" na turma da manhã). O rodízio do Treinamento Rápido também é por turma (`TR_ST`/`trTrocaTurma`, l.474–481) e o herói fala o turno da turma ("Bloco da manhã/tarde/noite", dec. 158). A etiqueta `#diaTurma` diz de qual turma são as questões. As questões em si são banco único da demo (comentário l.44–48; RN-59; ver Módulo 6).
- **Execução de um bloco** (`trAbrirBloco`/`trCarta`/`trResponde`, l.540–589): carta certo/errado → feedback imediato ("✓ Você acertou!" / "✗ Errou — gabarito: …") + comentário da carta → autoavaliação obrigatória **Errei / Difícil / Bom / Fácil** (nota 0–3). Fim do bloco (`trFimBloco`, l.590–628): **+1 score de carreira por acerto** (`TR_REW.scorePorAcerto`) e **+5 Quad Coins por bloco** (`TR_REW.coinsPorBloco`), ajuste do Domínio, bloco marcado feito; se a fonte era 'aula', as 10 cartas entram no TR_BANK e as filas do rodízio se refazem (provado na sonda `b2-missoes-dia.mjs`: banco 60→70).
- **Treinamento Rápido** (overlay `#trLayer`): abas **Gerais** (`TR_GERAIS`: Português, Inglês, Informática, Matemática, História, Geografia) e **Específicas (Direito)**. `trMontarFila` percorre a árvore do edital da turma ativa (`EDITAL_ATUAL`) e monta o rodízio "10 por assunto, alternando as matérias", só com assuntos que têm carta no banco (dec. 159). Segunda volta prioriza cartas difíceis (`trPeso`: Errei=3 > Difícil=2 > Bom=1 > Fácil=0, l.498–503); zerar a fila → "baralho redistribuído pela dificuldade" (`trRedistribuir`, l.629–637). Ajuste do Domínio: `trAj[CONCURSO|matéria|assunto] += round((acertos − 10/2) × 1,2)` — **por concurso**, para acerto na PC-BA não vazar para barra homônima do CFO (dec. 159). **Revisão pelo Domínio (dec. 202)**: o botão de play de cada subassunto da árvore (dec. 203) chama `trAbrirSub(m, a, sub)` — mesmo overlay, baralho `trCartasSub` (cartas etiquetadas com o subassunto primeiro, completadas pelas do assunto), título "Revisão · <sub>"; paga igual (+1/acerto, +5 QdC, DROP com origem "na revisão do Domínio") mas o ajuste vai para `trAjSub[CONCURSO|matéria|assunto|sub]` (fator 2,4) — move a barra **daquele subassunto** — e o botão final é **Fechar**: o rodízio (`trPos`) não anda.
- **DROP ao concluir o bloco (dec. 194)**: no fim de todo bloco de 10 — do dia/noite/tarde ou do Treinamento Rápido — `trFimBloco` chama `dropSortear('ao concluir o bloco do dia' | 'no treinamento rápido')` (src/11 l.615). Cada item de combate com disponibilidade `drop`/`ambos` e chance > 0 é sorteado pela **própria chance**; o conquistado vai direto para a `MOCHILA` **sem custo, sem linha em `COMPRAS` e sem entrada na janela de estorno** (não é compra), e a celebração dourada `#dropLayer` anuncia o item. **Não dispara no tutorial** (`tutOn`). Hooks de teste: `window.__dropSortear` (dispara o sorteio) e `window.__dropRng` (a suíte pluga um RNG determinístico — `vv1.mjs`). Detalhamento do catálogo, das chances e do criador do admin no Módulo 8. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- **Recompensa da noite** (`heroSync`/`resgatarBeneficios`, l.352–409; dec. 26): o cartão herói do Início conta feitas/total das missões vigentes da noite (`missoesDaNoite` — nunca atrasadas nem simulados; a Introdução fica fora da conta), acende um segmento por missão; "Continuar missão" abre a próxima pendente; com tudo feito o botão vira dourado "**Retire aqui seus benefícios**" → paga +1 de score de carreira por bloco da noite (total, ex.: +8) + 1 Quad Coin, com a moeda voando até o contador; depois "Benefícios retirados" (desativado; resgate registrado por turma em `NOITE_RESG`, não acumula). Provado ponta a ponta na sonda `b4-noite-recompensa.mjs`.

**Fluxo principal:** Início → herói "Bloco da noite 0/8" → "Continuar missão" → overlay de flashcards do Bloco 1 → 10 cartas (responder → feedback → autoavaliar) → resumo "+N score · +5 Quad Coins · Domínio atualizado" → volta a Missões, bloco sumiu → repete até 8/8 → Início → botão dourado → benefícios (+8 score de carreira, +1 QdC). Paralelo: Missões → "Abrir treinamento" → rodízio por assunto sem prazo. Atrasadas → "Recuperar" reabre o bloco vencido.

**Ações disponíveis:** Responder bloco do dia; recuperar atrasada; abrir Treinamento Rápido (trocar aba Gerais/Específicas, responder 10, avançar o rodízio, recomeçar após zerar); abrir a revisão de um subassunto pelo Domínio (dec. 202); retirar benefícios da noite; iniciar a Introdução no Quad (se nunca feita); sair no meio (bloco não marca feito; sem penalidade implementada).

**Regras confirmadas:**
- Bloco = 10 rápidas certo/errado com feedback imediato + autoavaliação; expiração de blocos em 7 dias → Atrasadas recuperáveis (dec. 106). REGRA DE PRODUTO CONFIRMADA (o valor "7 dias" está fixado em código e decisões; balanceamento futuro pode revê-lo).
- Missões/aba Missões inteira **por turma** ("cada turma com a sua vida", dec. 156); Introdução no Quad **da conta** (dec. 157/177). REGRA DE PRODUTO CONFIRMADA.
- Revisão espaçada D0 · D+1 · D+7 · D+30, 2 aulas/dia, liberação diária (22h15) — mecânica declarada em comentário e rótulos; os marcos temporais funcionam por seeds, não por agendador. REGRA DE PRODUTO CONFIRMADA na intenção; SIMULAÇÃO LOCAL na execução.
- Rodízio segue o edital da turma ativa; ajuste de Domínio por concurso (dec. 159). REGRA DE PRODUTO CONFIRMADA.
- Cartas respondidas do PDF 01 migram para o banco do Treinamento Rápido. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- Noite completa paga +1 score de carreira por bloco + 1 Quad Coin, resgate único por noite (dec. 26); o caráter **por turma** do resgate não vem da dec. 26, e sim da implementação (`NOITE_RESG` chaveado pela turma ativa — cadeia das missões por turma, dec. 156 em diante). Mecânica: REGRA DE PRODUTO CONFIRMADA; valores: DADO DEMONSTRATIVO de balanceamento (dec. 185 mantém as regras econômicas indefinidas).
- Recompensas do treinamento: +1 score por acerto · +5 QdC por bloco de 10 (`TR_REW`, l.11). Mecânica (participação → QdC; acerto → score/Domínio): REGRA DE PRODUTO CONFIRMADA; valores: DADO DEMONSTRATIVO.
- **Concluir um bloco sorteia itens de combate (dec. 194)**: o sorteio é por item e independe de acerto (é prêmio de participação, não de desempenho); item conquistado entra na mochila sem custo e sem estorno; o tutorial fica de fora. Mecânica: REGRA DE PRODUTO CONFIRMADA; as chances (%) são DADO DEMONSTRATIVO (dec. 185 mantém a economia indefinida).

**Dados utilizados:** `DIA_BLOCOS`/`BLOCOS_TURMA` (rot, det, m/a ou fonte 'aula'+ini, criadoEm, feito, idadeDias), `DIA_EXPIRA_DIAS`, `TR_BANK` (cartas `fc(m, a, s, certo, texto, observação, nota, resp)` — `s` é a etiqueta de subassunto da dec. 202), `AULA_DEMO` (matéria, assunto, professor, 40 cartas C/E), `TR_GERAIS`, `TR_REW`, `EDITAL_ATUAL`/`CONCURSO_ATUAL_ID`, `trAj`/`trAjSub`, `TR_ST` (fila/posição por turma), `NOITE_RESG`, `carreira` (scores), `ITENS_COMBATE`/`MOCHILA` (drop — ver Módulo 8), hooks de teste `__blocos`, `__noite`, `__introFeita`, `__dropSortear`, `__dropRng`.

**Dados demonstrativos:** As 60 cartas do `data/tr-bank.js` e as 40 do `data/aula-demo.js` ("Poderes administrativos" com Danilo Moura); os 8 blocos e as 3 atrasadas-semente (8/9/10 dias); os valores +1/+5/+1/+1 e o tamanho de bloco 10 (`TR_REW.blocoTam`); o fator 1,2 do ajuste de Domínio; horário 22h15; "PDF 01/PDF 02 do operador" como narrativa do abastecimento. DADO DEMONSTRATIVO.

**Resultados esperados:** Disciplinado, o aluno fecha 8/8 e retira os benefícios; contadores de score de carreira/QdC e o Domínio mudam na hora; o que ficou para trás fica recuperável por 7 dias e depois só via Atrasadas; o banco de treino cresce com as aulas respondidas.

**Situações de bloqueio ou erro:** Bloco vencido sai de "Hoje" ao reabrir a aba (dec. 106); "Retire seus benefícios" não paga duas vezes (guard `noiteResgatada`); Introdução feita não reaparece; sair do overlay não conclui o bloco; sem cartas no assunto → "Sem cartas ainda — as aulas alimentam este bloco"; listas vazias têm mensagens próprias ("Nenhuma missão atrasada — disciplina em dia!", "Tudo em dia por aqui…").

**Simulações atuais:** SIMULAÇÃO LOCAL: nascimento/expiração de blocos por seeds com `Date.now()` (não há agendador de 22h15 nem cron de ondas D+7/D+30); banco de questões único local; o **andamento dos blocos** zera a cada recarga (memória JS), mas o que eles pagaram — score de carreira, Quad Coins e o ajuste `trAj` do Domínio — volta pela chave `vq_evolucao` (DA-10), junto com `vq_intro_done`/`vq_tut_skip`; hook `__noite.concluirTudo` existe só para testes.

**O que precisará de implementação real:** Pipeline operacional aula → extração dos 2 PDFs → geração dos blocos por turma com agendamento real (D0 22h15, D+1, D+7, D+30); persistência do progresso por conta/turma; anti-fraude básica (respostas do lado do servidor); motor de repetição espaçada real sobre a autoavaliação (hoje só ordena a 2ª volta e redistribui); economia auditável de score/QdC; sincronização offline (o banner "respostas aguardando envio" é demo).

**Funcionalidades futuras relacionadas:** FUNCIONALIDADE PLANEJADA: quests de itens da mochila ("reúna itens para forjar equipamentos", Loja — ver Módulo 8); corte semanal de missões (existe só como texto), se confirmado; metodologia calibrada do Domínio (V1). O **drop** deixou de ser futuro: é mecânica implementada (dec. 194 — ver acima e Módulo 17).

**Decisões posteriores:** Dec. 165 tirou os simulados de Missões (foram para o Calendário); dec. 177 removeu a linha da Introdução feita; dec. 185 congelou as regras econômicas (valores acima são placeholders); dec. 191 extraiu os seeds para `data/`; **dec. 194 (02/08) acrescentou o sorteio de itens de combate ao fim de todo bloco de 10 e do treinamento rápido** (não dispara no tutorial). DECISÃO POSTERIOR.

**Divergências:**
- DIVERGÊNCIA (texto × código): "Corte das missões da semana" (sáb 23h59) e o toast "Missão pausada — expira 23h59" não têm mecânica — a única expiração implementada é a de 7 dias por bloco.
- DIVERGÊNCIA (fidelidade, assumida pela V0): o cabeçalho do módulo (src/11 l.1–9) promete "4 ondas (D0 22h15 · D+1 22h15 · D+7 · D+30)" como sistema; o protótipo entrega isso como fotografia estática de um dia.

**Perguntas pendentes:**
- PERGUNTA PENDENTE: o que acontece com uma atrasada não recuperada depois de sair da janela (some para sempre? conta contra o aluno?). O código só a mantém em Atrasadas indefinidamente.
- PERGUNTA PENDENTE: existirá recompensa/consequência para recuperar atrasadas (hoje paga igual a um bloco em dia)?
- PERGUNTA PENDENTE: o "corte semanal de sábado" é regra de produto a implementar ou texto a remover?
- PERGUNTA PENDENTE: 22h15 é fixo do Quad ou depende do turno/horário da turma (o código gera blocos "aula de hoje · h1/h2" pelo horário da turma, mas a liberação narrada é 22h15 única)?

---

## Módulo 6 — Questões, quiz e banco de questões

**Nome do módulo:** Questões, quizzes e banco de questões (motores de resposta do aluno, quiz da aula, simulado digital, classificação pela árvore do edital, banco geral do N.P.P.).

**Objetivo:** Centralizar como uma questão nasce (banco/PDF), como é classificada (concurso → matéria → assunto), como o aluno a responde em cada contexto (missão, treino, quiz da aula, simulado, prova de promoção) e o que cada resposta paga (score de carreira, QdC, Domínio) ou informa (relatório do professor).

**Perfis envolvidos:** Aluno (responde); Professor (cria/ativa o quiz da aula por PDF e lê o relatório — detalhamento no módulo do professor, na segunda metade desta especificação); Administração N.P.P. (dona do banco geral e dos simulados; visão "Banco de questões" na Estrutura); Operador (extração de PDFs — papel citado, ver Módulo 5).

**Funcionamento atual:**

Motores de resposta e suas regras de feedback/prêmio (cada um distinto, todos verificados):

| Motor | Feedback imediato? | Prêmio | Evidência |
|---|---|---|---|
| Flashcards (blocos do dia + Treinamento Rápido) | **Sim** (gabarito + comentário + autoavaliação) | +1 score/acerto · +5 QdC/bloco · Domínio | src/11 l.568–628; sondas `b2`/`b3` |
| Introdução no Quad (3 questões múltipla escolha) | **Sim** (alternativa certa/errada pintada; exige 3/3, relança em loop) | +30 score · +25 QdC, uma vez, da conta | src/11 l.648–733 (ver Módulo 2) |
| Quiz da aula (professor, ao vivo) | **Não** — "sem gabarito agora, o resultado sai com ele" | **Nenhum** (respostas só alimentam o relatório) | src/09 l.595–648; dec. 64; sonda `b5-quiz-aula.mjs` |
| Simulado digital (cronometrado) | **Não** durante; resultado no fim | +10 score/acerto · +QdC/acerto (`rec` definido pelo admin; padrão 2) | src/12 l.449–549; dec. 45/123/125; sonda `b5` |
| Prova de promoção (20 difíceis do próprio aluno) | Não durante; 80% promove | promoção de patente (sem moedas) | src/12 (ver Módulo 7) |
| Motor genérico `QUESTIONS`/`#quizLayer` | Não; correção no fim com gabarito + botão "▶ Vídeo de resolução" (placeholder) | +1 score por resposta · +20 QdC ao concluir | src/08 l.361–440 — **ÓRFÃO**, ver Divergências |

- **Score por resposta / QdC por desempenho — a regra do produto:** "Quad Coin sobe por **fazer** (participação). Domínio sobe por **acertar** (evidência). Acertar não rende Quad Coin" (card do Domínio, src/03 l.196–199). O código respeita isso em quase tudo (QdC de bloco/participação; score e Domínio por acerto); a exceção assumida é o **simulado digital**, que paga QdC por acerto por decisão do gestor (dec. 117b/123: "só ele pode ser gratuito, premiando QdC por acerto"). REGRA DE PRODUTO CONFIRMADA (com a exceção registrada).
- **Vídeo de resolução:** existe apenas como botão placeholder na tela de correção do motor órfão (src/08 l.409–412, toast "placeholder do protótipo"). Nenhum outro motor oferece vídeo por questão. FUNCIONALIDADE PLANEJADA.
- **Quiz da aula (aluno)**: o array `data/questions.js` (3 questões de Dir. Administrativo · Poderes) alimenta somente o motor órfão `#quizLayer` — o quiz da aula real usa `QA_MULT`/`QA_CE` (`data/qa-mult.js`, `qa-ce.js`) montados por `qzMontarQuestoes` (src/09 l.380–393; banco cicla e numera se o professor pedir mais questões que o banco tem). O quiz é **por turma** (`QUIZZES[turmaId]`, dec. 77), 1–30 questões e 1–180 min (dec. 86), estados criado→ativo→encerrado; o aluno vê o selo no card Aula de hoje e o botão só com o quiz **ativo**; `quizDaMinhaTurma` olha todas as matrículas e desempata pela turma ativa. Lado professor: segunda metade desta especificação. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- **Questões do treinamento**: cartas `fc(m, a, c, t, o, s)` — matéria, assunto, gabarito C/E, enunciado, comentário e, desde a dec. 202, a **etiqueta de subassunto** (`c.s`, opcional); ver Módulo 5.
- **Classificação questão → árvore do edital**: a ligação é por rótulo textual "matéria + assunto": cada carta carrega `c.m`/`c.a`; `trMontarFila` casa `TR_BANK` contra `EDITAL_ATUAL` (árvore `[matéria, [[assunto, [subassuntos]], …]]` de `data/concursos.js`/editais); o ajuste de Domínio grava em `trAj['concurso|matéria|assunto']` — e, desde a dec. 202, a **revisão aberta pelo Domínio** grava em `trAjSub['concurso|matéria|assunto|sub']`, movendo só a barra do subassunto revisado; `edSubPct` soma os dois deslocamentos ao percentual (base determinística por hash). Materiais usam a mesma etiqueta matéria+assunto (ver Módulo 4). **Não há ID de questão**; o vínculo por subassunto passou a existir pela etiqueta `c.s` das cartas (dec. 202), e a fila do rodízio continua por assunto. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO · SIMULAÇÃO LOCAL (percentuais do Domínio são sintéticos + deslocamento real do treino).
- **Banco de questões (admin, `#v-questoes` em src/05 l.68–86)**: tabela estática de 3 linhas ("Q-1042 · Poder de polícia… · Dir. Adm / Poderes · AULA|MISSÃO") ilustrando o conceito "banco geral puxado por tag, sem duplicar", com card "Ajustável ao vivo" (questão com erro corrigida sem parar o quiz — só texto). O botão **"Cadastrar questão" é stub**: `btnNovaQuestao` → toast "Cadastro: enunciado, alternativas, tag e campo de uso" (src/13 l.799). Responsabilidades demonstradas: o banco é da **administração/N.P.P.** (fica na área Estrutura do admin); o **professor não cadastra questão** — ele anexa PDF e o sistema "extrai" (`[INTEGRAÇÃO REAL]`, na demo usa os bancos semente). Dec. 182 confirma o banco de questões como módulo interno da plataforma. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO parcial: a tela existe, a operação é stub.

**Fluxo principal:** (a) missão/treino: carta → responde → feedback → autoavalia → resumo com prêmios; (b) quiz da aula: card Aula de hoje "AULA COM QUIZ ATIVO" → botão Quiz → cronômetro → responde sem feedback → "Respostas enviadas ao professor" → selo QUIZ RESPONDIDO; (c) simulado digital: Calendário → "Responder o simulado" → quiz C/E cronometrado → resultado com % e prêmios → histórico REALIZADO.

**Ações disponíveis:** Aluno: responder nos 5 motores ativos, sair/retomar (quiz da aula pode voltar enquanto ativo; simulado interrompido "pode retomar depois"), autoavaliar cartas. Professor: criar (PDF, tipo m.e./C-E, nº, tempo), refazer, descartar, ativar, encerrar quiz; ver relatório por questão. Admin: lançar simulados (presencial/digital, gratuito/pago, vagas por moeda), ver banco de questões (leitura), stub de cadastrar questão.

**Regras confirmadas:**
- Quiz da aula: **por turma, sem gabarito para o aluno e sem premiação**; leitura pedagógica da sala (dec. 64, 77, 86; RN-49). REGRA DE PRODUTO CONFIRMADA — provada na sonda `b5-quiz-aula.mjs` (score e QdC inalterados).
- Simulado digital: sem limite de vagas, dupla moeda ou gratuito, prêmio **por acerto** (+10 score; QdC = campo `rec` do lançamento, padrão 2 — dec. 125 fez o campo valer); presencial: sempre vendido, vagas por moeda, **não premia QdC** — presença liberada na recepção gera score (dec. 117b/122/128/129). REGRA DE PRODUTO CONFIRMADA (valores: DADO DEMONSTRATIVO).
- Feedback imediato não é regra única: cada contexto tem a sua (tabela acima). REGRA DE PRODUTO CONFIRMADA por contexto.
- Classificação por matéria+assunto espelhada em questões, materiais e Domínio ("mesmo padrão do banco de questões"). REGRA DE PRODUTO CONFIRMADA.
- Banco geral por tag, sem duplicar, com campo de uso (aula/missão) e correção ao vivo — conceito declarado, sem operação. FUNCIONALIDADE PLANEJADA.

**Dados utilizados:** `QUESTIONS` (3 m.e., `data/questions.js`), `QA_MULT`/`QA_CE` (bancos do quiz da aula), `TR_BANK`/`AULA_DEMO` (cartas C/E), `SIMULADOS` (`data/simulados.js`: s63/sq presenciais pagos, sd1 digital gratuito), `SIM_INSC`/`SIM_HIST`, `QUIZZES[turmaId]` (tipo, minutos, pdf, qs, status, respostasAluno, pollN), `trAj`, árvores de edital (`EDITAL_CFO` etc.), hooks `__quizAula`/`__quizzes`/`__simDig`.

**Dados demonstrativos:** Todos os bancos de questões (3 QUESTIONS, QA_MULT/QA_CE, 60 TR_BANK, 40 AULA_DEMO) e a tabela Q-1042/Q-1043/Q-0987 do banco admin; o polling de respondentes da sala (nº aleatório crescente com a resposta real do aluno somada — `pollRodar`/`qzDist`); prêmios +10/+2/+20; os 3 simulados-semente; "extração do PDF" (o PDF anexado só dá o nome). DADO DEMONSTRATIVO.

**Resultados esperados:** Cada resposta cai no lugar certo: prêmios creditados na hora nos contadores; Domínio deslocado por assunto/concurso; respostas do quiz da aula no relatório do professor (inclusive a resposta real do aluno da demo); simulado realizado no histórico pedagógico.

**Situações de bloqueio ou erro:** Quiz da aula exige conexão e estado 'ativo'; quiz criado mas não ativado → aluno vê selo sem botão; tempo esgotado envia o que foi respondido (quiz da aula) ou fecha com o parcial (simulado); simulado digital com `dia` futuro → "Em breve/disponível em DD/MM"; digital pago só executa depois de comprado; sala presencial lotada → "Sala lotada"; professor: PDF obrigatório, limites 1–30 questões/1–180 min; relatório fica em branco até a 1ª resposta (dec. 83→85 família).

**Simulações atuais:** SIMULAÇÃO LOCAL: extração de PDF inexistente (bancos semente ciclados); sala respondendo = polling aleatório; professor e aluno no mesmo navegador (sem rede); Domínio com base sintética por hash; banco de questões admin é tabela estática; "Cadastrar questão" é toast; vídeo de resolução é toast.

**O que precisará de implementação real:** Banco de questões operacional (CRUD, ID por questão, tag pela árvore com subassunto, dificuldade, campo de uso, versionamento/correção ao vivo); extração real de PDF → questões; motor de quiz ao vivo multiusuário (websocket/push, telemetria por aluno); armazenamento de respostas e histórico pedagógico; vídeos de resolução por questão (hospedagem + vínculo); simulados digitais com banco próprio (hoje coletam de TR_BANK+AULA_DEMO embaralhados — `simDigColeta`).

**Funcionalidades futuras relacionadas:** FUNCIONALIDADE PLANEJADA: vídeo de resolução por questão; feedback dos alunos no relatório da sala ("EM BREVE"); inteligência pedagógica sobre o histórico (dec. 182, módulo interno); metodologia calibrada do Domínio (V1).

**Decisões posteriores:** Dec. 182 (banco de questões e simulados viram módulos internos da plataforma); dec. 190/191 (suítes e seeds versionados); dec. 188 (remoção de código morto poupou `LINKS_ONLINE` mas **manteve** o motor órfão de QUESTIONS). DECISÃO POSTERIOR.

**Divergências:**
- DIVERGÊNCIA (código vivo sem porta de entrada): **motor `QUESTIONS`/`#quizLayer` é órfão** — nenhum fluxo atual do aluno o abre (verificado por grep — só há `classList.remove('on')`; a nota da auditoria `aluno.md` §9 confirma "motor semi-vestigial"). É nele que vivem o "resultado no fim + vídeo de resolução" e o prêmio +20 QdC/+1 score por resposta — comportamentos hoje inalcançáveis pela UI.
- DIVERGÊNCIA (cosmética): o selo do card diz "Quando o professor abrir o quiz…aparece aqui", mas quem aparece com o quiz **criado** é só o selo; o botão exige **ativação** — coerente com dec. 64, apenas nuance de texto.
- DIVERGÊNCIA (demonstração × conceito, assumida pela V0): a auditoria (RN-59) fala "banco único da demo", enquanto a tela do admin sugere banco geral com tags e usos — o segundo é aspiração, o primeiro é o que roda.

**Perguntas pendentes:**
- PERGUNTA PENDENTE: o motor órfão de QUESTIONS deve ser removido, ou é a base do futuro "quiz de missão com correção no fim + vídeo"? Qual será a regra canônica de feedback nas missões (imediato, como nos flashcards, ou no fim)?
- PERGUNTA PENDENTE: quem cadastra questão no produto final — só o N.P.P., ou o professor também (com curadoria)? O protótipo demonstra apenas N.P.P. + stub.
- PERGUNTA PENDENTE: a classificação de questão descerá ao **subassunto** (o Domínio exibe subassuntos, mas nenhuma questão aponta para eles)?
- PERGUNTA PENDENTE: haverá ID única e deduplicação real de questões ("puxado por tag, sem duplicar") e trilha de auditoria da "correção ao vivo"?
- PERGUNTA PENDENTE: simulado digital deve mesmo premiar QdC por acerto (exceção ao princípio "acertar não rende Quad Coin"), ou o princípio será revisto na modelagem econômica (dec. 185)?

---

## Módulo 7 — Score, Quad Coins, Diamantes e progressão

**Nome do módulo:** Progressão e economia de participação — score de carreira, Quad Coins (QdC), Diamantes (Dmn), patentes, prova de promoção, insígnias, rankings, Quadrômetro e Domínio.

**Objetivo:** Manter o aluno engajado com três estruturas distintas: (1) **score de carreira** = esforço/carreira (não é moeda, não se gasta; libera promoções); (2) **Quad Coins (QdC)** = pontuação de participação usada como moeda da Quad Store; (3) **Diamantes (Dmn)** = moeda comprada em dinheiro real (recarga no site ou gift card — ver Módulo 9), nunca conquistada em missões. A carreira militar (14 patentes, 4 fases) dá identidade ("AL SD QUAD MOURA") e meta de longo prazo.

**Perfis envolvidos:** Aluno (acumula, promove, compara-se nos rankings); Administrador N.P.P. (crédito manual de QdC/Dmn, gift cards, define recompensa de simulados e eventos); Professor (indireto: o quiz da aula não pontua — ver Módulo 6 e Divergências).

**Funcionamento atual:**
- Três contadores independentes: `carreira.scorePatente/scoreCarreira/scoreTemporada` (src/07 l.41–51), `var score = 1240` que guarda os **Quad Coins** (src/07 l.4, comentário "NÃO é o score de carreira") e `var diamantes = 150` (src/07 l.97). `addPontos()` (src/12 l.309) soma score de carreira nos 3 acumuladores e, ao atingir a meta da patente, muda `estado` para `disponivel` (score **libera** a prova, não promove sozinho); `addScore()` (src/07 l.81) mexe só em QdC; `addDiamante()` (src/07 l.98) só em Dmn. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- **Carreira**: `GAMI` (src/07 l.11–37) — 14 patentes (AL SD 900 pts … CEL máxima), 4 fases (Formação inicial/liderança/oficial/Alto comando), `provaQuestoes: 20`, `tentativaHoras: 24`; `PROVA_APROV = 0.80` fixa (src/12 l.332). Comentário do código registra pendência: "PROVA_APROV segue fixa em 80% e as notaMin das fases ainda não são lidas por ninguém" (src/07 l.7–9).
- **Prova de promoção** (dec. 23): automática, sem fiscal; 20 questões que o aluno classificou como Errei/Difícil nos flashcards (`provaColeta()` filtra `TR_BANK` por `nota === 0 || 1`, completa com reserva sem repetir enunciado — src/12 l.343–357), sem revelar ao aluno que são as difíceis. ≥80% (16/20) promove na hora com excedente transferido para a patente seguinte; <80% → `estado='bloqueada'` por 24h (src/12 l.395–432). Sair no meio devolve a `disponivel`. Botão "Liberar nova tentativa (**simulação**)" existe só na demo. FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- **Insígnias** (dec. 15/16): 10 artes para 14 patentes — `INSIG_MAP = [0,0,1,1,2,2,3,4,4,5,6,7,8,9]`: cada dupla Aluno/efetivo compartilha a arte; Aluno Oficial usa a do Aspirante (src/12 l.27–31). Trilha de patentes sem cadeados (dec. 133): ✓ concluída, ●/★ atual, insígnia acinzentada nas futuras.
- **Rankings** (src/12 l.105–300): sala (janela ±2 em volta do aluno + "Ver ranking completo") e geral (1.286 usuários, aluno fixo em 87º). Privacidade de **mão dupla** (dec. 132/143): privado mascara o nome de guerra ("AL SD QUAD ****A") **e** deixa de ver os nomes alheios do 11º em diante; público vê quem também é público; **top 10 sempre por inteiro dos dois lados**. Ranking da sala segue a **turma ativa** (total = inscritos reais da turma, mín. 12; posição = ~29% do total, mín. 3 — `salaTotal/salaPos` src/12 l.228–233). Ver Módulo 3 (DA CONTA × DA TURMA).
- **Quadrômetro** (aba `v-perfil`; dec. 8 — nunca "Perfil"): "Score de carreira X · temporada Y · Quad Coins Z · posição #N da turma · presença 9/10"; carreira/temporada/QdC/posição são vivos (`renderCarreira`), presença 9/10 é texto fixo do HTML (src/03 l.208).
- **Domínio** (árvore do edital, src/07 l.400–509): barras por subassunto **simuladas por hash determinístico** do nome (`edHash` + viés `ED_BASE` por matéria) **mais** o ajuste real `trAj` vindo do Treinamento Rápido (acertos/erros deslocam a barra do assunto, por concurso — dec. 159; ver Módulo 5); agregação de baixo para cima por média; escala térmica vermelho→âmbar→azul; links "Assistir aula" (YouTube) e "Fazer questões" (QConcursos) abrem busca externa. Desde a dec. 202, **cada subassunto (numerado 1.1.1) traz um botão de play** (dec. 203) que abre o bloco de 10 questões de revisão daquele conteúdo (ver Módulo 5) — apagado com aviso quando o assunto ainda não tem cartas; **é a presença de cartas matéria+assunto no banco que acende o botão**, sem lista fixa no código —, e a árvore preserva o que estava aberto ao se redesenhar. Honestidade: fora do deslocamento dos flashcards e da revisão, os percentuais são visuais, não medem desempenho.
- **Persistência da evolução (DA-10, dec. 195 · implementada na dec. 196)**: o cálculo continua todo em memória JS, mas **o resultado agora sobrevive ao F5**. `evolSalvar()` grava a chave `vq_evolucao` do `localStorage` com `{ v:1, id, score (Quad Coins), diamantes, carreira (os 3 acumuladores), mochila, avatarIdx, guerra (nome de guerra), turmaAtivaId, lojaOwned (skins/itens possuídos), trAj (ajuste do Domínio) e os 60 últimos lançamentos do LEDGER }`; `evolCarregar()` restaura tudo no boot e re-renderiza carreira, mochila, avatar, extrato e turma ativa; `evolMarcar()` agenda a gravação com **debounce de 400 ms** a cada mudança de saldo, mochila ou identidade (src/20). Hooks de teste `__evolSalvar`, `__evolCarregar`, `__evolMarcar`. **Não** persistem: patente conquistada fora dos acumuladores, bloqueio de 24h da prova, compras/pedidos/estornos e demais arrays de demonstração (ver doc. 05 §3). Comentário-fonte mantido: "no sistema real o servidor valida tudo" (src/12 l.3; src/07 l.39–40). SIMULAÇÃO LOCAL — a decisão de **onde** o dado mora de verdade é do back-end (DA-07; P1 do doc. 07).
- **Extrato/ledger (DA-03)**: toda entrada e saída de QdC/Dmn passa por `ledgerLancar` (src/07) e vira uma linha no extrato da carteira, com tipo, origem, destino, autor, data e **saldo resultante** — ver Módulos 9 e 10.

**Fluxo principal** (comprovado nas sondas `sondaC1.mjs`/`sondaC3.mjs`): login → Início mostra card com insígnia, nome curto e barra de score da patente → aluno responde blocos/flashcards/simulados e acumula score de carreira + QdC → ao atingir a meta (ex.: 900), toast "Promoção disponível", chip no Início e `promoBox` no Perfil → botão "Prova de promoção" abre o modal com 20 questões CERTO/ERRADO → ≥16 acertos: "Promoção confirmada", insígnia nova, histórico ganha linha (ex.: "Soldado Quad 02/08/2026 · 20/20"), excedente vira saldo da próxima patente (observado: 1.170/900 → SD QUAD, 270/3.300); <16: "Ainda não foi desta vez", nova tentativa em 24h.

**Ações disponíveis** (listas completas extraídas do código):
- **Geram score de carreira** (`addPontos`/`carreira.score* +=`): +1 por acerto de flashcard no Treinamento Rápido (`TR_REW.scorePorAcerto`, src/11 l.592); +1 por bloco do turno concluído (bônus da noite/manhã/tarde: +total de blocos, ex. +8 — src/11 l.398); +30 na Introdução/tutorial (`TUT_REW.score`, também ao pular — src/11 l.718, 780); +5 por treino Pré-TAF registrado (src/11 l.835); +10 por acerto no simulado digital (src/12 l.517); +score do simulado presencial na liberação de presença pela recepção (`x.score`, ex. 100–120 — src/17 l.530, dec. 128/129); +275 pelo botão "dia de estudo" (rotulado simulação — src/12 l.322); +1 por questão respondida no motor órfão `QUESTIONS`/`#quizLayer` (src/08 l.428 — inalcançável pela UI atual, ver Módulo 6). Score de carreira nunca é debitado.
- **Geram QdC** (`addScore` positivo): +25 Introdução concluída (`TUT_REW.coins`; pular = +5, 25−20 da boina — src/11 l.722, 782); +1 pelo resgate do bloco do turno completo ("Retire aqui seus benefícios" — src/11 l.406, dec. 26); +5 por bloco de flashcards (`TR_REW.coinsPorBloco`, src/11 l.596); +10 treino Pré-TAF (src/11 l.834); +15 "garimpo" em evento gratuito com bônus (src/08 l.305, dec. 110); +N por acerto no simulado digital (N definido no lançamento, padrão 2 — `simRec()`, src/11 l.132, dec. 45/125); +valor na presença de simulado que premia QdC (src/17 l.532); +20 ao concluir o motor órfão `QUESTIONS` (toast "+20 Quad Coins · quiz da aula", src/08 l.423 — inalcançável pela UI; o quiz da aula real do professor não paga nada, dec. 64 — ver Módulo 6 e Divergências); crédito manual do admin; gift card de lote em QdC (ver Módulo 9); estorno de compra paga em QdC (ver Módulo 10). **Debitam QdC**: compras da Quad Store (`debitar`, src/14 l.6), itens de combate (src/15 l.51), skins (src/15 l.150).
- **Geram Dmn**: gift card (demo QUAD-100/500 e lotes em Dmn — ver Módulo 9); crédito manual do admin; estorno de compra paga em Dmn; recarga no checkout do site = FUNCIONALIDADE PLANEJADA (comentário `[INTEGRAÇÃO REAL] crédito do site`, src/07 l.94–96; dec. 48/182 — pagamentos são externos). Não existe nenhuma missão que gere Dmn.
- Outras ações: abrir prova de promoção; interromper prova (volta a `disponivel`); alternar público/privado (`#btnPriv`); expandir/recolher rankings; botão DEMO `#btnDemoPatente` sobe patente sem prova (bloco marcado "[DEMO PROVISÓRIO — REMOVER]", src/12 l.551–569).

**Regras confirmadas** (as MECÂNICAS, não os números):
- Score de carreira ≠ QdC ≠ Dmn; score não se gasta; Dmn nunca é conquistado em missão (dec. 48). REGRA DE PRODUTO CONFIRMADA.
- Score atingir a meta apenas **libera** a prova; só a prova promove (dec. 23). REGRA DE PRODUTO CONFIRMADA.
- Prova: 20 questões difíceis do próprio aluno, sem revelar o critério; 80% promove na hora; reprovou → 24h de bloqueio; excedente de score transfere. REGRA DE PRODUTO CONFIRMADA.
- Estados da carreira: acumulando · disponivel · prova · bloqueada (o código lista ainda 'aguardando-fiscal', resquício sem uso — src/07 l.48). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- Insígnias por dupla; Aluno Oficial = arte do Aspirante (dec. 15/16). REGRA DE PRODUTO CONFIRMADA.
- Privacidade de mão dupla com hall do top 10 sempre visível (dec. 143) — comprovado na sonda `sondaC4.mjs` (privado: 22/22 mascarados do 11º em diante no geral, top 10 intacto; público: só os demo-privados, 1 a cada 4, mascarados). REGRA DE PRODUTO CONFIRMADA.
- Economia É DA PESSOA (dec. 148): score de carreira, patente, QdC, Dmn, mochila e avatar são globais da conta; só missões/blocos/ranking-da-sala seguem a turma ativa (ver Módulo 3). REGRA DE PRODUTO CONFIRMADA.
- Presença em simulado gera score sempre; QdC só onde a atividade premia (dec. 128/129, 117b: prêmio QdC é exclusivo do simulado digital/eventos, nunca do presencial). REGRA DE PRODUTO CONFIRMADA.
- Recompensas do tutorial são únicas; pular reproduz o estado final (dec. 105; ver Módulo 2). REGRA DE PRODUTO CONFIRMADA.

**Dados utilizados:** `GAMI` (patentes/fases/prova), `carreira`, `score` (QdC), `diamantes`, `TR_BANK` + `nota` dos flashcards (pool da prova), `TR_REW`, `TUT_REW`, `SIMULADOS` (campos `rec`, `score`), `SIM_INSC`, `NOITE_RESG` (por turma), `trAj` (ajuste do Domínio por concurso), `INSIG_MAP` + sprite de insígnias, `RK_NOMES`/`RK_OFF` (rankings), `EDITAL_*`/`ED_BASE` (Domínio), `turmaInscritos` (tamanho da sala).

**Dados demonstrativos** (dec. 185: valores sujeitos a balanceamento):
- Saldos iniciais 620/310 score de carreira, 1.240 QdC, 150 Dmn; metas das patentes (900, 3.300, … 12.500 repetido nas 5 patentes 9ª–13ª; a Coronel, 14ª e máxima, tem `pontos: null` — sem meta); `notaMin` das fases (0,70–0,85) nunca lidas; +275 do "dia de estudo"; todos os valores de recompensa (1/5/10/15/20/25/30/275, `rec` padrão 2, score 100–120 dos simulados). DADO DEMONSTRATIVO.
- Ranking geral inteiro (1.286 usuários, 87º, top com 24.870 pts, nomes `RK_NOMES`), colegas da sala e quem é "privado" (1 a cada 4), posição na sala (fórmula 29%), "presença 9/10" (texto fixo), histórico inicial da carreira (10/07/2026). DADO DEMONSTRATIVO.
- Barras do Domínio (hash determinístico) e as duas provas: pool completado com questões não-difíceis quando faltam difíceis ("para sempre fechar as 20 **na demo**" — src/12 l.348). DADO DEMONSTRATIVO.

**Resultados esperados:** Responder atividades incrementa os três scores e QdC com toast e pop "+n"; meta atingida → estado disponível e chip; prova aprovada → patente sobe, insígnia troca, nome curto muda (AL SD → SD), histórico registra data e nota, excedente preservado; reprovada → bloqueio 24h; Quadrômetro e rankings repintam a cada mudança (`renderCarreira`).

**Situações de bloqueio ou erro:** Prova negada em estado acumulando ("A prova abre quando você atinge a meta de score") e bloqueada ("Nova tentativa disponível em 24h") — ambos comprovados; patente máxima → "Você já está na patente máxima do jogo!" (só via botão demo); nome de guerra deve derivar do nome completo (`tutGuerraOk`, src/12 l.15–19; ver Módulo 2); sem matrícula ativa o app trava para tudo menos a Quad Store (`appLock`, src/07 l.212–216; ver Módulo 3).

**Simulações atuais:** SIMULAÇÃO LOCAL: validação de pontos no front ("a interface nunca decide sozinha… no sistema real vem validado do servidor" — src/07 l.39–40); botão "dia de estudo (simulação)"; botão "Liberar nova tentativa (simulação)"; botão demo de subir patente; ranking geral e colegas fictícios; posição fixa no geral; barras do Domínio por hash; bloqueio de 24h sem relógio persistente (`provaBloqueadaAte` em memória — recarregar a página zera **este** contador; o saldo e o score, esses sim, voltam pela chave `vq_evolucao`, DA-10).

**O que precisará de implementação real:** Servidor autoritativo de pontos/promoções e anti-fraude; persistência de carreira, saldos e histórico; ranking real (sala e geral) com privacidade servidor-side; medição real de Domínio (desempenho por assunto); presença real (o "9/10"); temporadas com ciclo definido; relógio de 24h confiável; configuração administrável do `GAMI` ("o admin ajustará no sistema real" — src/07 l.6–9).

**Funcionalidades futuras relacionadas:** FUNCIONALIDADE PLANEJADA: "Prestígio" pós-patente máxima (só citado no texto "Patente máxima — rumo ao Prestígio", src/12 l.74); tutoriais da central de ajuda do QUAD ("em construção", incl. "Como funciona a prova de promoção"); Quests (botão EM BREVE); Intendência/gasto pleno conforme realinhamento da dec. 11; módulo de inteligência pedagógica da Consolidação (dec. 182).

**Decisões posteriores:** Dec. 185 — regras econômicas INDEFINIDAS: todos os valores acima são demonstrativos e o balanceamento não foi estudado; dec. 184 — módulo sem especificação = "Módulo Planejado"; definição de temporada (rotulada "(semana)" no HTML, sem reset implementado); uso das `notaMin` por fase vs. `PROVA_APROV` fixa. DECISÃO POSTERIOR.

**Divergências:**
1. DIVERGÊNCIA — **`var score` guarda Quad Coins**: a variável de moeda chama-se `score`, colidindo com o score de carreira (`carreira.score*`); divergência de nomenclatura conhecida e documentada no próprio código (src/07 l.4) e na auditoria (regras.md R18).
2. DIVERGÊNCIA — dec. 11 vs rev. 2.3: a rev. 2.3 (Anexo A, princípio 2) diz "Score não é moeda"; o gestor rebatizou a pontuação de participação como Quad Coin gastável — o documento-base precisa de revisão (anotado na própria dec. 11).
3. DIVERGÊNCIA — `GAMI.fases[].notaMin` (70–85%) existe mas ninguém lê; a prova usa 80% fixo para todas as fases — o código diz uma coisa (config por fase) e faz outra (pendência declarada em src/07 l.7–9).
4. DIVERGÊNCIA — estado 'aguardando-fiscal' listado no comentário mas inalcançável desde a dec. 23 (prova sem fiscal).
5. DIVERGÊNCIA — Quadrômetro mistura números vivos com "presença 9/10" fixo na mesma frase.
6. DIVERGÊNCIA — 5 patentes (Aspirante → Tenente-Coronel, 9ª–13ª) exigem os mesmos 12.500 pts e a Coronel (14ª, máxima) tem `pontos: null`, sem meta (curva achatada — provável placeholder).
7. DIVERGÊNCIA — os prêmios "+1 score por questão" e "+20 QdC · quiz da aula" existem no código (src/08 l.423/428), mas pertencem ao motor órfão `QUESTIONS` (ver Módulo 6); o quiz da aula real não premia (dec. 64, sonda `b5-quiz-aula.mjs`). Toast com rótulo enganoso em código inalcançável.

**Perguntas pendentes:** PERGUNTA PENDENTE: qual o ciclo real da temporada (semanal?) e há recompensa/reset? O que é o "Prestígio" após Coronel? As `notaMin` por fase substituirão os 80% fixos? Quais serão os valores finais de recompensa e das metas de patente (dec. 185)? A posição no ranking geral virá de qual recorte (plataforma inteira, por concurso)? A presença (9/10) virá de qual registro — liberações da recepção? O botão demo de patente e o "dia de estudo" serão removidos na V1 (o código já pede)?

---

## Módulo 8 — Loja e produtos

**Nome do módulo:** Quad Store — vitrine de produtos e serviços do aluno (aba "Loja" da navegação).

**Objetivo:** Concentrar num único lugar tudo o que o aluno pode adquirir com as duas moedas do app (Quad Coins e Diamantes): turmas, isoladas, simulados, eventos, cursos online, mentoria, itens do personagem, itens de combate e produtos físicos de retirada na recepção.

**Perfis envolvidos:**
- **Aluno**: navega, compra, acompanha estoque/vagas, mochila e histórico.
- **Administrador (N.P.P.)**: cadastra produtos/serviços ("Cadastrar produto ou serviço"), cria skins e itens de combate (criador do Painel interno), edita preços e vagas (governança da Loja), confirma entregas e libera entradas.
- **Professor**: não participa da Loja.

**Funcionamento atual:**
FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — a Loja é renderizada em dois macro-blocos + dois blocos de pós-venda (rótulos exatos do HTML, src/03 l.264–366):

1. **"Atividades e itens · presenciais"**, com as seções: *Turmas · modalidades do Quad* (`lojaTurmasCore` — `TURMAS_LOJA`); *Isoladas* (`lojaIsoladas` — `ISOLADAS`); *Simulados presenciais · na sede* (`lojaSim-pres` — `SIMULADOS` tag PRESENCIAL); *Eventos · aulões, corujões, semana insana…* (`lojaEventos-pres` — `EVENTOS` pagos presenciais); *Excursões para concursos*, *Módulos · vade mecum, apostilas e cadernos*, *Treinamento para o TAF*, *Outros · retirada na recepção* (`ITENS_PRESENCIAIS` por `cat`).
2. **"Itens digitais"**, com: *Cursos online* (3 cards fixos em Dmn + `LOJA_EXTRAS`), *Simulados digitais · no app*, *Mentoria*, *Eventos online · YouTube e lives exclusivas*, *Itens do personagem* (Boina exclusiva + cadeia de skins + skins criadas pelo admin) e *Itens de combate · vão para a mochila* (`combatGrid` — **a vitrine filtra `disp !== 'drop'`**: item que só cai no DROP não aparece à venda; item `ambos` mostra na descrição "· também cai no DROP (N%)" — dec. 194; src/15 l.30–36).
3. **"Estornos · até 7 dias"** (`lojaEstornos`) — ver Módulo 10 (Compras, matrículas e estornos).
4. **"Carteira · extrato e compras"** (`#rcCard`, **último bloco da Loja**) — desde a dec. 197 é **um card só**: o antigo "Relatório de compras" e o "Extrato da carteira" foram unificados. Contém, nesta ordem: seletor de período `#rcTabs` (Semanal/Mensal/Trimestral/Semestral — **vale para os dois lados do card**), KPIs `#rcResumo` (**recebido · gasto · compras · a receber**), "Movimentações do período" com filtro `#extTabs` (Tudo/Quad Coins/Diamantes) e a lista `#extList` do ledger, e então as três listas de situação: `#rcAndamento` ("Em andamento · turmas, isoladas e mentorias"), `#rcPendente` ("Comprado · aguardando retirada ou realização") e `#rcEntregue` ("Entregue e concluído"). Ver Módulo 10.

Há ainda, na própria Loja, o resgate de **gift card** (`#giftCode` + `#btnGift` + leitor QR — ver Módulo 9) e o saldo das duas moedas no topo (`lojaSaldo`/`lojaSaldoDmn`).

**Moedas por produto** (comprovado nas sondas `sondaD.mjs` 46/46 OK e `sondaD2.mjs` 21/21 OK):
- **Duas moedas com vagas POR MOEDA (dec. 155)**: turmas (`precoDmn`/`precoQdc` + `vagasDmn`/`vagasQdc`) e simulados presenciais (`vagasDmnRest`/`vagasQdcRest`); simulado digital pago pode ter preço nas duas moedas (sem vagas). Sonda: card da turma "54 Dmn · 6 QdC" + "600 Dmn ou 700 QdC"; simulado "20 Dmn · 60 QdC" + "15 Dmn ou 20 QdC".
- **Uma moeda só (`moeda: 'qdc'|'dmn'` por item)**: isoladas, eventos, itens presenciais, cursos online, mentoria, skins criadas pelo admin.
- **Sempre QdC**: cadeia de skins (60/120/200/500/750/1300) e itens de combate ("mochila é sempre em Quad Coins" — src/14 l.880).

**Efeitos da compra por tipo (todos comprovados por sonda)**:
- **Turma** → matrícula (`MATRICULAS.push`), vaga da moeda usada decrementa (6→5 QdC, Dmn intacta), card vira MATRICULADO; 1ª matrícula destrava o app e vira turma ativa; da 2ª em diante abre o pop-up "qual turma o app abre?" (`#trocaLayer`) — ver Módulo 3.
- **Isolada** → vira evento recorrente (`isoladaComprada` cria `ev-<id>` em `EVENTOS`, `inscrito: true`) — entra no carrossel do Início e no calendário; card vira ADQUIRIDO.
- **Evento pago** → `evState[id].comprado/inscrito = true`; entra no carrossel como INSCRITO, no calendário e na portaria do admin na hora (`renderAcessos`); evento pontual comprado sai da vitrine; evento de vários dias permanece marcado INSCRITO até o último dia; online mostra o link.
- **Simulado presencial** → `sm.insc/comprado`; inscrição cai na recepção (`SIM_INSC`) aguardando "Liberar entrada"; comprado sai da vitrine. **Simulado digital pago** → liberado para responder no app (ver Módulo 6).
- **Skin** → troca a foto do personagem na hora (`skinVestir`/`aplicarAvatar` — sonda: `src` da foto muda); elo comprado some e o próximo da cadeia aparece.
- **Item de combate** → vai para a `MOCHILA` (empilha). **Segunda via de entrada na mochila (dec. 194)**: além da compra, o item pode chegar pelo **DROP** — sorteado ao concluir um bloco de 10 (dia/noite/tarde), o treinamento rápido ou um simulado digital. Item conquistado por drop **não custa moeda, não gera linha em `COMPRAS` e não entra na janela de estorno** (ver Módulos 5, 10 e 12).
- **Item físico** → estoque baixa pela quantidade, gera pedido de retirada na recepção (`PEDIDOS`, status "aguardando"); pedido em aberto vira etiqueta "seu pedido"/"N seus" sem travar novas compras.
- **Produto com data (mentoria, excursão, TAF, curso com período)** → entra nos eventos/calendário de quem comprou (`agendaDoProduto`/`PROD_AGENDA`).

**Atalho "NA LOJA" (dec. 173, revista pela dec. 199)** — comprovado: evento pago no carrossel do Início tem tag "NA LOJA"; **o clique abre a página do evento** (regras de score e de Quad Coins antes da decisão de comprar) e o botão "Comprar na Quad Store · N QdC" é que leva à Loja direto no item, centralizado e piscando (classe `achei`, `lojaLevarAte`). **O atalho direto sobrevive nos simulados presenciais** ("a inscrição é a compra da vaga na Loja", `simInscrever`, src/11 l.201–204), que não têm página de informações própria. Ver Módulo 4.

**Choque de agenda** — turma, isolada, evento e simulado presencial ocupam dia+faixa de horário (`choqueDeAgenda`/`agendaOcupada`). Item em conflito ganha badge **EM CHOQUE** na vitrine e, na confirmação, o aviso "**Atenção ao horário.** Nesse dia e horário você já tem **X** … o Quad não faz reposição de aula nem devolve o valor por ausência" (`avisoChoque`) — avisa sem impedir; a exceção barrada é matrícula em turma sobreposta (ver Módulos 3 e 10). Sonda: isolada de terça 20h–22h em choque com a Turma PATAMO (noite) mostrou o badge, o aviso, e a compra prosseguiu.

**LOTADO (dec. 179)** — evento presencial herda a lotação da sala (`evLot` = `ev.lot || salaCap(ev.sala)`; Sala 1=155, 2=85, 3=125, 4=185). Cheio, vira LOTADO na vitrine E no carrossel e o clique não abre compra. Turma/isolada/simulado esgotados: turma "ESGOTADA" quando as duas moedas zeram; simulado sem vagas restantes sai da vitrine.

**Mochila de combate** — storage no Perfil (`#btnMochila` → `#storageLayer`): grade de slots, contagem "N itens guardados" e "N unidades · M tipos". Item de combate não some da vitrine e não é de compra única (dec. 172): recompra avisa "você já tem N" e a etiqueta do card mostra "N na mochila". Sonda: 2 facas → "2 na mochila", "2 unidades · 1 tipo". **Ressalva da dec. 194 à dec. 172**: "nunca sai da vitrine" vale para os itens vendáveis — item com `disp: 'drop'` **nunca entra na vitrine**, porque só se obtém por sorteio.

**DROP · itens conquistados resolvendo questões (dec. 194)** — FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO (`dropSortear`/`dropCelebrar`, src/15 l.44–88; suíte `vv1.mjs`):
- Cada item de combate tem **disponibilidade** (`disp`: `'venda'` — padrão implícito quando o campo não existe — `'drop'` ou `'ambos'`) e **chance** (`drop`, em %).
- Gatilhos: fim de bloco de 10 (dia/noite/tarde) e do treinamento rápido (src/11 l.615) e fim de **simulado digital** (src/12 l.520 — ver Módulo 12). **Nunca no tutorial** (`tutOn`).
- Sorteio **por item**: `rng() * 100 < chance`, com `window.__dropRng` substituível pela suíte; podem cair vários itens no mesmo bloco.
- Conquistado, o item entra na `MOCHILA` **sem custo, sem log em `COMPRAS` e sem estorno**, e a Loja/mochila re-renderizam.
- **Celebração**: overlay `#dropLayer` (src/06 l.320) — card dourado com raios, item em destaque (`#dropItens`), texto "A sorte encontra quem está em combate…" (`#dropMsg`) e botão **"Guardar na mochila"** (`#btnDropOk`) que fecha a celebração.

**Criador de itens de combate — disponibilidade e chance (dec. 194)** — no "Criar skin do personagem" do Painel interno, quando o destino é *item de combate*, aparece a linha `#admSkDropRow` com o seletor `#admSkDisp` (só venda / só drop / venda + drop) e o campo `#admSkDrop` (chance no drop, %). Validações reais (src/14 l.886–902): item **só de drop publica sem preço** (a exigência de preço ≥ 1 é dispensada); qualquer item com drop exige **chance entre 1% e 100%** ("Item no drop precisa de uma chance entre 1% e 100%."). O item nasce em `ITENS_COMBATE` com `disp` e `drop` e o toast confirma o modo publicado. Ver Módulo 16.

**Estoque físico (dec. 170)** — decresce por compra (25→23 comprando 2), o seletor de quantidade trava no máximo do estoque, e na última unidade o item some da Loja (sonda: vade mecum, 8 unidades compradas → card removido, toast "Era a última unidade — o item saiu da Loja"). Digitais não têm limite. Entrega confirmada devolve o item à condição normal da vitrine (a etiqueta de pedido sai).

**Governança do admin (contexto; detalhamento no módulo do administrador, na segunda metade)**: preços e vagas por moeda editáveis sem recriar turma/isolada/simulado (`renderPrecoTurmas`, `btnAdmPrecoTurma`, `btnAdmPrecos` — "já vale na Quad Store"); cadastro de produto com destino fixo por categoria (`PROD_DESTINOS`), estoque obrigatório para presencial, data para excursão/TAF/mentoria (mentoria com início+fim); criador de skins/itens de combate (com **disponibilidade e chance de drop** desde a dec. 194 — ver acima); crédito manual de moedas (comprovado na sonda: +2.000 QdC caem na carteira na hora).

**Fluxo principal:**
1. Aluno abre a Loja (ou chega pelo atalho "NA LOJA").
2. Clica no card → **toda compra pede confirmação** (RN-22): overlay `#compraLayer` com `#btnCompraOk` (confirmação simples para unidade única; seletor de quantidade ± para item com estoque); turma/simulado com duas moedas abrem antes o pop-up "Creditar/Comprar em qual moeda?" (`#turmaLayer`, botões `#btnTuDmn`/`#btnTuQdc` com preço e vagas de cada moeda; botão da moeda sem vaga fica desabilitado).
3. Confirmada, a compra debita a moeda escolhida (`debitar` → `addScore`/`addDiamante`), loga em `COMPRAS` (`lojaCompraLog`) e aplica o efeito do tipo.
4. Vitrine re-renderiza na hora (estoque/vagas/etiquetas).

**Ações disponíveis:**
- Aluno: comprar (com confirmação), escolher moeda (quando há duas), escolher quantidade (físico), resgatar gift card (uma única vez por código — sonda: reuso recusado; ver Módulo 9), abrir mochila, seguir atalho "NA LOJA", estornar (ver Módulo 10), acompanhar relatório.
- Admin: publicar/editar/remover produto, skin e item de combate; editar preços/vagas; confirmar entrega; liberar entrada; creditar moedas.

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — duas moedas: QdC (conquistada) × Dmn (só por recarga/gift card; "Diamantes insuficientes — recarregue no site do Quad ou resgate um gift card").
- REGRA DE PRODUTO CONFIRMADA — vagas e preços POR MOEDA em turma e simulado presencial (dec. 155); a compra decrementa só a moeda usada.
- REGRA DE PRODUTO CONFIRMADA — confirmação em toda compra (RN-22); exceção: durante o tutorial o QUAD conduz sem modal (ver Módulo 2).
- REGRA DE PRODUTO CONFIRMADA — estoque físico decrescente, esgotou→some; pedido aberto não trava compra (dec. 170).
- REGRA DE PRODUTO CONFIRMADA — item de combate recomprável, nunca sai da vitrine, empilha na mochila com "N na mochila", sempre QdC (dec. 172) — **com a ressalva da dec. 194**: a regra vale para os itens vendáveis (`disp` `venda`/`ambos`); item **só de drop nunca aparece na vitrine** (a vitrine filtra `disp !== 'drop'`), porque não se compra.
- REGRA DE PRODUTO CONFIRMADA — **DROP (dec. 194)**: item de combate pode ser conquistado por sorteio ao concluir bloco de 10, treinamento rápido ou simulado digital, pela chance configurada; vai à mochila sem custo, sem log de compra e sem estorno; nunca dispara no tutorial; a conquista é anunciada na celebração `#dropLayer`. Mecânica: confirmada; as chances (%) são DADO DEMONSTRATIVO (dec. 185).
- REGRA DE PRODUTO CONFIRMADA — o admin define **como o aluno obtém** cada item de combate (só venda / só drop / venda + drop) e a **chance de 1% a 100%**; item só-drop publica sem preço (dec. 194).
- REGRA DE PRODUTO CONFIRMADA — cadeia de skins um elo por vez (gandola→capa de colete→fuzil) e fardas finais de ESCOLHA ÚNICA (CIPE/PATAMO/BOPE); compra troca a foto do personagem; quem possui, veste (sem equipar manual).
- REGRA DE PRODUTO CONFIRMADA — EM CHOQUE avisa sem impedir; LOTADO bloqueia (evento com sala); atalho NA LOJA abre a página do evento e o botão de lá leva ao item (dec. 173 revista pela dec. 199); lotação por sala fixa 155/85/125/185 (dec. 179).
- REGRA DE PRODUTO CONFIRMADA — economia é DA PESSOA, não da turma (dec. 148): saldos, mochila e skins não mudam ao trocar de turma ativa (ver Módulo 3).
- REGRA DE PRODUTO CONFIRMADA — gift card de liberação única (ver Módulo 9).

**Dados utilizados:** `TURMAS_LOJA`, `ISOLADAS`, `SIMULADOS`, `EVENTOS`+`evState`, `ITENS_PRESENCIAIS`, `LOJA_EXTRAS`, `ITENS_COMBATE`, `MOCHILA`, `SKIN_CADEIA`/`SKIN_FARDAS`/`skinEtapa`/`fardaEscolhida`, `lojaOwned`, `score` (QdC), `diamantes`, `GIFT_CARDS`/`GIFT_LOTES`, `PEDIDOS`, `PROD_AGENDA`, `SALA_CAP`. Tudo em memória (IIFE), sem persistência além de `localStorage` do tutorial.

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — saldos iniciais 1.240 QdC / 150 Dmn; 5 turmas seed (ex.: RONDESP Manhã 600 Dmn/700 QdC, vagas 54/6); 3 isoladas (350 Dmn/30 vagas; "Aula isolada" 40 QdC); 8 itens físicos com estoques 8–40; **7 itens de combate** (`data/itens-combate.js`): 6 vendáveis de 20 a 45 QdC — Faca tática 40, Lanterna tática 35, Bússola de campanha 30, Broche de mérito 25, **Cantil 20 com `disp: 'ambos'` e `drop: 10`** (vende na Loja e também cai no drop a 10%) e Corda de rapel 45 — mais o **"Patch da sorte"** (`disp: 'drop'`, `preco: 0`, `drop: 12`), item só de drop que **não aparece na vitrine** (dec. 194); 3 cursos online fixos em Dmn; eventos seed (Aulão especial 80 QdC · Sala 2; Semana Insana 400 Dmn, multi-dia; Mentoria CFO 120 QdC); simulados seed (Simulado 63: 120 Dmn/150 QdC, 50/10 vagas; Simuladão: 15 Dmn/20 QdC, 20/60); gift codes demo QUAD-100/QUAD-500; "Boina exclusiva" 20 QdC (item do tutorial).
- DADO DEMONSTRATIVO — todos os valores/preços são de demonstração: dec. 185 — regras econômicas permanecem INDEFINIDAS; a mecânica é a regra, os números não.

**Resultados esperados:** Compra confirmada = débito na moeda escolhida + efeito imediato do tipo + registro em `COMPRAS` + vitrine atualizada; nunca há débito sem saldo, compra acima do estoque, nem vaga negativa.

**Situações de bloqueio ou erro:**
- Saldo insuficiente: recusa com toast por moeda (nada debitado; pop-up permanece — comprovado).
- Turma: MATRICULADO (recompra), INDISPONÍVEL (turno ocupado), ESGOTADA (duas moedas a zero).
- LOTADO (evento com sala cheia) — clique não abre compra.
- Estoque: "Estoque insuficiente", clique em item esgotado ("acabou — o item saiu da Loja").
- Recompra de item unitário: "Você já garantiu este item." (boina some da vitrine após compra).
- Farda: "Indisponível — você já escolheu a sua farda."
- Gift card: inválido/já resgatado (ver Módulo 9).
- Durante o tutorial, compras fora do roteiro ficam bloqueadas (`tutOn`).

**Simulações atuais:**
- SIMULAÇÃO LOCAL — todo o estado vive em memória no navegador (recarregar zera); "recarga do site" não existe: Dmn só entra por gift demo ou crédito manual do admin; câmera do leitor QR é simulada; inscritos-semente da demo (portaria, contadores de inscritos) são gerados por hash; `queueSync()` apenas simula sincronização.
- SIMULAÇÃO LOCAL — o comprador é sempre o aluno da sessão (`nomeCurto()`); contas-semente não compram.

**O que precisará de implementação real:** Back-end de catálogo/estoque (ERP), carteira por conta com transações atômicas (QdC e Dmn), checkout do site para recarga de Dmn, gateway de pagamento, geração/leitura reais de QR de gift card, inventário do jogador (mochila/skins) persistente, CDN das artes de skin, sincronização em tempo real da vitrine (vagas/estoque multiusuário com concorrência), portaria/recepção com dispositivo real.

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA — Quests da administração ("Quests — missões especiais… Próxima implementação", botão existente) e forja de itens da mochila ("reúna itens em quests para forjar equipamentos novos", texto na Loja). O **drop** saiu desta lista: virou mecânica implementada pela dec. 194 (ver acima e Módulo 17).
- FUNCIONALIDADE PLANEJADA — aplicação de skin no boneco 3D é "da V1" (comentário do criador de skins); artes definitivas das fardas via PDF do gestor.
- FUNCIONALIDADE PLANEJADA — Intendência (gastar score) segue bloqueada até a V1 (obs. da dec. 11).

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 185 (01/08): valores, preços e balanceamento econômico não estudados; nenhuma regra nova criada na Consolidação.
- DECISÃO POSTERIOR — **dec. 194 (02/08)**: itens de combate ganharam disponibilidade (`disp`) e chance (`drop`); a vitrine passou a filtrar os só-drop e o criador do admin passou a pedir os dois campos. Antes, todo item de combate era exclusivamente de venda e aparecia na vitrine.
- DECISÃO POSTERIOR — **dec. 193 (02/08)**: a compra da boina no tutorial nasce `semEstorno` e não entra na janela de 7 dias (ver Módulos 2 e 10).
- DECISÃO POSTERIOR — rev. 2.4 do documento-base (RN-18): absorver o modelo "QdC direto por atividade + Diamante" ou manter o Anexo A (Marcos de Conquista/ledger) como alvo.
- DECISÃO POSTERIOR — renomear a variável `score` (QdC) para eliminar a colisão com o score de carreira (ver Módulo 7).

**Divergências:**
- DIVERGÊNCIA — a moeda QdC vive na variável `score`, colidindo conceitualmente com o score de carreira; a rev. 2.3 dizia "Score não é moeda" (dec. 11 do gestor prevalece; documento-base desatualizado). É a maior divergência documental do projeto (doc 05, RN-18; ver Módulo 7).
- DIVERGÊNCIA — evento presencial sem sala definida no seed (Semana Insana) nunca fica LOTADO: `evLot()` retorna 0 (sem limite). Comprovado por sonda (`__evLotar('semana-insana', 9999)` não muda nada). Conflita com o espírito da dec. 179 para eventos presenciais.
- DIVERGÊNCIA (cosmética) — os cards da cadeia de skins imprimem o preço sem formatação de milhar ("1300 QdC", enquanto o resto da Loja usa `fmt` → "1.300").

**Perguntas pendentes:**
- PERGUNTA PENDENTE — evento presencial sem sala cadastrada deve ser proibido no formulário (hoje o form novo exige sala, mas seeds antigos/multi-dia passam sem) ou deve existir lotação própria para atividades fora da sede?
- PERGUNTA PENDENTE — quais produtos venderão de fato em cada moeda na V1 (hoje: turma/simulado nas duas; demais em uma; combate/skins em QdC)? Depende da definição econômica (dec. 185).
- PERGUNTA PENDENTE — "Curso online · teoria completa/questões/isolado" são cards fixos no HTML (não geríveis pelo admin) — passam a nascer do cadastro na versão real?

---

## Módulo 9 — Gift Cards e carteira

**Nome do módulo:** Gift cards em lote com QR de liberação única + carteira de moedas (QdC/Dmn) e crédito manual da administração.

**Objetivo:** Permitir venda/distribuição presencial de crédito: a administração emite lotes de gift cards (código + QR, uso único) em Diamantes **ou** Quad Coins; o aluno resgata digitando o código ou lendo o QR e o valor cai na carteira na hora. O crédito manual do Painel de controle é a "porta de entrada da recarga do site/gift card" (dec. 52) enquanto o checkout real não existe.

**Perfis envolvidos:** Administrador N.P.P. (cria lotes, vê consumo, credita manualmente); Aluno (resgata e vê saldos).

**Funcionamento atual:**
- **Criação de lotes** (src/16 l.316–332): Painel de controle → atalho "Criar Gift cards" → quantidade (1–500), valor (≥1) e moeda (`qdc`/`dmn`); códigos no formato `QG<lote>-<hash><seq>` (ex.: QG1-Y9D1), cada um com QR próprio; lista de lotes com contador "N de M resgatados · liberação única"; "Ver QR codes" mostra 6 e "Ver todos os N" expande (dec. 66/69/70); célula do QR ganha classe `usado` após resgate. Comprovado na sonda `sondaC2.mjs` (lote de 8×250 QdC + lote de 2×40 Dmn). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO.
- **QR code**: SVG 21×21 gerado por hash determinístico do código com padrão de finders — ilustrativo, não é QR real (comentário "Na demo o padrão do QR é ilustrativo… impressão e leitura reais são [INTEGRAÇÃO REAL]", src/16 l.258–260). SIMULAÇÃO LOCAL.
- **Resgate pelo código** (src/07 l.117–133; UI src/03 l.255–261): bloco do gift card fica na **Quad Store** (dec. 112 — saiu do "+"; ver Módulo 8): campo `#giftCode` + botões "Resgatar" e "Validar pelo QR"; código é normalizado (trim + uppercase — case-insensitive comprovado); procura primeiro nos lotes (`giftDoLote`), senão nos códigos-demo fixos `GIFT_CARDS = { 'QUAD-100': 100, 'QUAD-500': 500 }` (sempre Dmn; comentário: "[DEMO] códigos de recarga usados só para demonstrar a tela").
- **Uso único e invalidação**: `hit.g.usado = true` "invalida o QR na mesma hora"; segunda tentativa → "Este gift card já foi resgatado (liberação única)." Comprovado 2× nas sondas `sondaC1.mjs` (QUAD-500) e `sondaC2.mjs` (código de lote).
- **Crédito em Dmn E/OU QdC — o que o código suporta**: o lote credita na moeda do lote — `moeda === 'dmn'` → `addDiamante`; senão → `addScore` (QdC) (src/07 l.123–124). Ou seja, o protótipo suporta gift card nas DUAS moedas (comprovado: +250 QdC por código de lote; +500 Dmn pelo QUAD-500). O mesmo vale para o crédito manual e para estornos.
- **Leitor QR do aluno** (src/16 l.334–341; overlay src/06 l.384): "Validar pelo QR" abre `#scanLayer` — "Aponte a câmera para o QR code… Câmera real é [INTEGRAÇÃO REAL] leitura de QR" — com botão "Simular leitura do QR (demo)" que valida o primeiro código ainda ativo de qualquer lote; sem código ativo: "Nenhum gift card ativo — a administração cria os lotes no Painel de controle." Resgate fecha o leitor.
- **Carteira/saldo — onde o aluno vê**: topo do app (chip QdC `#scoreVal` + chip Dmn `#dmnVal`, dec. 48 "fica logo abaixo do Quad Coin"); cabeçalho da Quad Store (`#lojaSaldo` / `#lojaSaldoDmn`); Quadrômetro (`#scorePerfil` mostra QdC — ver Módulo 7). **Existe extrato desde a dec. 196 (DA-03)**: o card "**Carteira · extrato e compras**" da Quad Store (`#rcCard`, último bloco da Loja) traz a seção "**Movimentações do período**" (`#extList`), alimentada pelo **LEDGER** — cada entrada e saída de moeda é um lançamento com `id` (`MV-xxxxx`), moeda, **tipo** da operação, **origem**/**destino**, **autor**, data/hora e o **saldo resultante**; filtros `#extTabs` (Tudo · Quad Coins · Diamantes) e o mesmo período escolhido para as compras (`#rcTabs`). O ledger nasce com dois lançamentos de **saldo de abertura** (`MV-00000` em QdC e `MV-00001` em Dmn, autor "sistema") e recebe recompensas, gift cards, compras, créditos manuais da administração e estornos. Do lado do admin continuam existindo `CREDITOS` e `ESTORNOS` (visões da administração sobre os mesmos fatos). Ver Módulo 10 para o card completo.
- **Crédito manual do admin** (src/16 l.70–94): conta (a conta da demo ou 3 contas-semente), moeda, valor (≥1), motivo; conta da demo cai na carteira na hora (comprovado: +75 Dmn → topo mudou de 150 para 225); contas-semente só geram toast + registro; histórico "Inserir crédito" guarda nome, motivo, valor e moeda (últimos 8).

**Fluxo principal** (comprovado na sonda `sondaC2.mjs`): admin entra (chave NPP-2026) → atalho "Criar Gift cards" → 8 cartões de 250 QdC → "Lote criado — 8 gift cards de 250 QdC, cada um com o seu QR" → "Ver QR codes" (6 + "Ver todos os 8") → cartão físico chegaria ao aluno → aluno abre Quad Store → digita `qg1-y9d1` → "Gift card validado — +250 Quad Coins!" (1.240→1.490) → tentar de novo → "já foi resgatado" → "Validar pelo QR" → "Simular leitura" → +250 do 2º código → painel do admin passa a "2 de 8 resgatados" com 2 QRs marcados como usados.

**Ações disponíveis:** Admin: criar lote (qtd × valor × moeda); ver QR codes do lote (6/todos); acompanhar consumo; creditar QdC/Dmn manualmente com motivo. Aluno: resgatar por código; abrir leitor QR e validar (demo); ver saldos no topo/Loja/Quadrômetro.

**Regras confirmadas:** REGRA DE PRODUTO CONFIRMADA: gift card nasce em lote no Painel de controle; **liberação única com invalidação imediata**; validação pelo código digitado na Quad Store ou pelo leitor com câmera (dec. 66/112); crédito cai na moeda do lote; contadores de consumo por lote; crédito manual livre da administração com motivo e histórico (dec. 52); formato de código `QG<lote>-<código>` definido pelo código gerador dos lotes (src/16 l.326; a dec. 84 não define o formato — apenas alinhou os textos da loja ao "formato real dos lotes"); Dmn é comprado em dinheiro — recarga do site ou gift card — e nunca conquistado (dec. 48; ver Módulo 7).

**Dados utilizados:** `GIFT_LOTES` (lotes com `codes[{c, usado}]`, valor, moeda), `giftSeq`, `GIFT_CARDS`/`giftUsados` (demo), `score`/`diamantes` (carteira), `CREDITOS` (histórico do admin), `CONTAS`, `moedaTxt`, `qrSvg`/`edHash` (QR ilustrativo).

**Dados demonstrativos:** DADO DEMONSTRATIVO: códigos fixos QUAD-100/QUAD-500 (existem só para demonstrar a tela); saldos iniciais 1.240 QdC / 150 Dmn; contas-semente (SANTIAGO, BRANDÃO, NASCIMENTO); teto de 500 cartões por lote; valores dos lotes; o desenho do QR (hash, não codifica nada).

**Resultados esperados:** Lote criado aparece com QRs na hora; resgate válido credita e atualiza os três pontos de exibição do saldo simultaneamente; resgate repetido é recusado; consumo reflete no painel do admin em tempo real (contador + célula `usado`); crédito manual na conta da demo atualiza o topo imediatamente.

**Situações de bloqueio ou erro** (todas com toast/validação): "Quantidade do lote: de 1 a 500."; "Informe o valor de cada gift card."; "Gift card inválido — confira o código."; "Este gift card já foi resgatado (liberação única)."; "Nenhum gift card ativo" no leitor sem lotes; crédito manual sem valor → "Informe o valor do crédito."; admin sem chave NPP-2026 não acessa o painel (ver Módulo 1).

**Simulações atuais:** SIMULAÇÃO LOCAL: QR é desenho determinístico, não codifica o código; "leitura da câmera" é um botão que pega o primeiro código ativo (não lê nada); códigos-demo QUAD-100/500; lotes e resgates vivem em memória (recarregar apaga); crédito a contas-semente é só registro; a moeda Dmn em si é simulada — nenhum dinheiro real circula.

**O que precisará de implementação real:** Geração de QR real + impressão (dec. 66 `[INTEGRAÇÃO REAL]`); leitura por câmera com validação servidor-side; registro central de códigos com unicidade/anti-replay entre dispositivos; vínculo resgate↔conta e auditoria; crédito automático do checkout do site (src/07 l.96 "[INTEGRAÇÃO REAL] crédito do site"); persistência da carteira; trilha contábil (quem emitiu, quem resgatou, quando).

**Funcionalidades futuras relacionadas:** FUNCIONALIDADE PLANEJADA: **compra de Diamantes com dinheiro real via checkout do site** — site/checkout e pagamentos permanecem sistemas externos (dec. 48 e 182); estorno em dinheiro real; possível venda física dos cartões (operação presencial já desenhada).

**Decisões posteriores:** DECISÃO POSTERIOR: dec. 185 — valores/economia indefinidos (preço real de um gift card em R$, limites de emissão, política de expiração: nada definido); dec. 182 — integração com pagamentos "a definir".

**Divergências:** DIVERGÊNCIA: a dec. 48 apresenta o gift card como canal do **Diamante** ("comprada em dinheiro — recarga no site ou gift card"), mas o código e o painel permitem lote de gift card em **Quad Coins** (e o crédito manual idem) — QdC "comprável" via cartão colide com o princípio "Score não é moeda" da rev. 2.3 (mesma tensão da dec. 11; ver Módulo 7); os códigos-demo QUAD-100/500 não seguem o formato `QG<lote>-<código>` dos lotes gerados pelo código (src/16; a dec. 84 alinhou os textos ao formato e manteve os códigos-demo só como demonstração).

**Perguntas pendentes:** PERGUNTA PENDENTE: gift card em QdC é intencional no produto final ou o cartão real será só de Dmn? Gift cards terão validade/expiração e valor de face em R$? O resgate será limitado por conta (ex.: 1 por CPF)? O leitor de QR entrará no app (câmera) ou haverá resgate também no site? Estorno de compra paga com crédito de gift card devolve para onde (ver Módulo 10)? Quem pode emitir lotes (qualquer admin N.P.P. ou só a direção)?

---

## Módulo 10 — Compras, matrículas e estornos

**Nome do módulo:** Compras, matrículas e estornos — pós-venda da Quad Store (blocos "Estornos · até 7 dias" e "**Carteira · extrato e compras**" do aluno; painéis "Compras" e "Estornos e desistências" do admin; recepção/portaria nas Liberações). Complementa a vitrine descrita no Módulo 8 (ver Módulo 8).

> **Atenção ao rótulo (dec. 197)** — o card que antes se chamava "**Relatório de compras**" deixou de existir com esse nome: ele foi fundido com o "Extrato da carteira" em um único bloco, "**Carteira · extrato e compras**" (`#rcCard`). Documentos anteriores a 03/08/2026 usam o nome antigo.

**Objetivo:** fechar o ciclo da compra: registrar cada aquisição, criar a matrícula/inscrição/pedido correspondente, dar transparência ao aluno (situação e evolução por período) e permitir o arrependimento em até 7 dias — devolvendo a moeda original (QdC ou Dmn) e desfazendo a posse — exceto quando a compra já foi consumida.

**Perfis envolvidos:**
- Aluno: acompanha as compras, estorna dentro do prazo.
- Administrador (N.P.P.): consome as compras nas Liberações ("Confirmar entrega" de pedidos, "Liberar entrada" de eventos na portaria, "Liberar entrada" de inscritos em simulados — ver Módulo 16) e acompanha os painéis "Compras" (log geral, com tag ESTORNADO) e "Estornos e desistências".
- Professor: não participa do módulo.

**Funcionamento atual:**
FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO:
- **Log de compras** (`COMPRAS`): toda compra entra com `{aluno, item, valor, moeda, ts, tipo, ref, extra, semEstorno}` — o campo **`semEstorno`** (dec. 193) nasce `true` quando a compra é feita **durante o tutorial** (`semEstorno: !!tutOn` em `lojaCompraLog`, src/18 l.420) e mantém a linha permanentemente fora de "Estornos · até 7 dias"; tipos: `matricula`, `pres` (físico), `simulado`, `evento`, `skin`, `combate`, `item` (avulso/isolada da vitrine). O admin vê as 5 últimas + "Ver completo".
- **Matrícula**: comprada a turma (ver Módulo 8), `MATRICULAS` ganha a entrada e o acesso é liberado — a 1ª matrícula destrava o app; da 2ª em diante vale a regra de turma ativa com pop-up de escolha (RN-08/RN-09 — comprovado por sonda).
- **Estornos · até 7 dias** (`renderEstornos`, src/19 l.99–111; hook de teste `window.__estRefresh`): lista as compras do aluno **não estornadas**, **não consumidas**, **sem a marca `semEstorno`** (compra do tutorial — dec. 193) e, quando o tipo é `evento`, **cujo evento ainda não aconteceu** (`evAcabou` — dec. 192), cada uma com etiqueta de prazo — "FALTAM 7 DIAS" (dia da compra), "FALTAM N DIAS", "ÚLTIMO DIA" (dias ≤2 em estilo de alerta) ou "PRAZO ENCERRADO" (botão desativado; a linha permanece visível). Comprovado por sonda: compra de 2 dias = FALTAM 5 DIAS; seeds de 8 e 55 dias = PRAZO ENCERRADO desativado.
- **Estorno é DIRETO, sem aprovação administrativa** (fiel ao protótipo): o aluno confirma em **dois toques** ("Estornar" → "Confirmar estorno?", que expira em 4s) e o estorno executa na hora. O admin é apenas **avisado**: a linha entra em `ESTORNOS` → painel "Estornos e desistências" (com contagem por item) e a compra ganha a tag ESTORNADO no log. Comprovado por sonda.
- **Devolução na moeda ORIGINAL**: `estornar()` credita `cp.valor` via `addDiamante` se a compra foi em Dmn, `addScore` se em QdC ("Estorno confirmado — +N … de volta"). Comprovado por sonda (+700 QdC da matrícula).
- **Desfazer POR TIPO** (`desfazerCompra` — todos comprovados por sonda, exceto onde indicado):
  - `matricula`: devolve a vaga **à moeda usada** (`vagasDmn++`/`vagasQdc++` — 5→6 QdC, Dmn intacta), remove de `MATRICULAS`, card volta ao preço; **se a turma estornada estava em uso como turma ativa, o app passa à matrícula restante** (`definirTurmaAtiva` se autocorrige — sonda: ativa voltou de rondesp-m para patamo-n) e os materiais da turma saem junto (ver Módulo 13).
  - `pres`: estoque devolve a quantidade comprada (`+qtd`, 23→25), o pedido sai da recepção, etiqueta "seus" some.
  - `evento`: `comprado/inscrito = false` — sai do carrossel, do calendário, da portaria; card volta à vitrine (ver Módulo 11).
  - `simulado`: `comprado/insc = false`, a inscrição sai da lista da recepção (`SIM_INSC`), volta à vitrine (ver Módulo 12).
  - `skin`: `lojaOwned=false`, a cadeia regride um elo (`skinEtapa`) ou a farda reabre a escolha das três (comprovado: estorno da CIPE devolveu 500 QdC e PATAMO/BOPE voltaram a ficar compráveis).
  - `combate`: as unidades saem da mochila e a etiqueta some (ver Divergências).
  - `item` avulso: card volta a ficar à venda com preço e, se tinha "vagas" no dataset, devolve 1.
- **Consumo mata o estorno (dec. 178)** — `compraConsumida(tipo, ref)` marca `consumido=true` e a linha sai da janela na hora. Três gatilhos, todos comprovados por sonda:
  1. **Portaria** ("Autorizações de acesso", dec. 180): grupos = eventos presenciais vigentes reais; o aluno entra na lista ao comprar (aparece como "você") e "Liberar entrada" → ENTRADA LIBERADA + toast "A compra saiu da janela de estorno" → some dos estornos.
  2. **Simulado presencial**: "Liberar entrada" do inscrito pontua o score de carreira, marca REALIZADO, manda ao histórico de simulados e consome a compra (ver Módulo 12).
  3. **Entrega física**: "Confirmar entrega" na recepção marca ENTREGUE, consome, e o relatório do aluno passa a "entregue na recepção".
- **Quarto caminho de saída da janela (dec. 192)** — além dos três gatilhos de consumo acima, **o evento que já aconteceu sai da janela de estorno**: `renderEstornos` descarta a compra de tipo `evento` quando `evAcabou(ev)` é verdadeiro ("evento que JÁ ACONTECEU também sai — não há o que estornar", comentário do fonte, src/19 l.99–110). Diferente dos três gatilhos, este **não marca `consumido`**: é o próprio calendário que decide, pela data. Efeito prático: o aluno que comprou e não compareceu deixa de poder estornar quando o evento passa (ver Módulo 11 — o evento presencial vira CONCLUÍDO ou FALTOSO em vez de sumir).
- **Compra do tutorial fora da regra (dec. 193)** — a boina comprada durante a instrução nasce `semEstorno: true` e nunca aparece em "Estornos · até 7 dias" ("ela faz parte do tutorial e não entra na regra"; ver Módulo 2).
- **Carteira · extrato e compras** (`#rcCard`, dec. 197 — `renderRelCompras` + `renderExtrato`, src/19): um card só, o **último** bloco da Loja, com um único seletor de período `#rcTabs` — Semanal/Mensal/Trimestral/Semestral (7/30/90/180 dias) — que **vale para os dois lados** (trocar o período re-renderiza tanto os KPIs e as listas de situação quanto o extrato).
  - **KPIs** (`#rcResumo`, quatro números): **recebido · gasto · compras · a receber**. "**recebido**" é a soma dos lançamentos **positivos** do LEDGER no período, **excluindo o saldo de abertura** — por isso enxerga o que a lista de compras não vê (recompensas de missão, gift cards, créditos manuais da administração e estornos); "**gasto**" é a soma das compras do período nas duas moedas; "**compras**" é a quantidade delas; "**a receber**" é o número de itens aguardando retirada/realização. *(Os KPIs antigos "compras · Quad Coins · Diamantes · a receber" foram substituídos por estes na dec. 197.)*
  - **"Movimentações do período"** (`#extTabs` + `#extList`): o extrato do ledger — até 40 linhas, cada uma com o tipo da operação, "de \<origem\>" (entradas) ou "para \<destino\>" (saídas), data/hora, **autor** e **saldo depois**; filtro Tudo/Quad Coins/Diamantes. Os dois lançamentos de **saldo de abertura** (`MV-00000`/`MV-00001`) aparecem sempre, em qualquer período. Ver Módulo 9.
  - **Três listas de situação por tipo** (`rcSituacao` → `#rcAndamento`, `#rcPendente`, `#rcEntregue`): **em andamento** com % de evolução (turma pelo período `inicio→fim` — comprovado: matrícula PATAMO de 55 dias aparece no trimestral com %; mentoria/curso com período idem), **a receber** ("aguardando retirada na recepção", "inscrito · aguardando liberação na sede", "inscrito · <quando>", "simulado digital · pronto para responder") e **entregue/concluído** ("entregue na recepção", "entrada liberada na sede", "simulado realizado", "evento realizado", "no seu personagem", "na sua mochila de combate", "acesso liberado na hora", "turma concluída em <data>"). **Compra estornada sai das três listas de situação** (`!cp.estornado`) — **mas o estorno continua registrado no extrato**, como lançamento positivo com autor e saldo resultante (dec. 197); consumida permanece (vira concluída).

**Fluxo principal:** compra confirmada (ver Módulo 8) → `lojaCompraLog` + lançamento de saída no **ledger** (`ledgerOp({tipo:'compra · <item>', destino:'Quad Store', autor: <aluno>})`, src/14) → aparece em "Estornos · até 7 dias" (FALTAM 7 DIAS) e na "**Carteira · extrato e compras**" (nas movimentações e nas listas de situação) → OU o aluno consome (entrega/entrada liberada/simulado liberado ⇒ sai da janela, vira "concluído" no relatório) OU estorna em dois toques dentro do prazo (moeda original de volta + posse desfeita + aviso ao admin) OU o prazo vence (PRAZO ENCERRADO, botão morto).

**Ações disponíveis:**
- Aluno: "Estornar" → "Confirmar estorno?" (dois toques); trocar o período do card da Carteira (vale para extrato e compras ao mesmo tempo); filtrar as movimentações por moeda (Tudo/Quad Coins/Diamantes); nenhuma ação sobre linhas consumidas/encerradas.
- Admin: "Confirmar entrega" (pedidos), "Liberar entrada" (portaria de eventos e inscritos de simulados), consultar "Compras" e "Estornos e desistências".

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — estorno em até 7 dias corridos com contagem regressiva visível e confirmação em dois toques (RN-26).
- REGRA DE PRODUTO CONFIRMADA — devolução na moeda original da compra (RN-26; sonda: QdC→QdC).
- REGRA DE PRODUTO CONFIRMADA — estorno desfaz a aquisição por tipo, inclusive devolução da vaga à moeda usada e cancelamento da matrícula (RN-28).
- REGRA DE PRODUTO CONFIRMADA — estorno da turma em uso → o app passa à matrícula restante como turma ativa (RN-10; dec. 146/163 correlatas).
- REGRA DE PRODUTO CONFIRMADA — consumo mata o estorno pelos três gatilhos (dec. 178: "participar do aulão e estornar depois lesaria a empresa") **+ um quarto caminho de saída: o evento realizado (dec. 192), que sai da janela pela data, sem marcar `consumido`**.
- REGRA DE PRODUTO CONFIRMADA — **compra feita no tutorial não entra na regra dos 7 dias** (dec. 193; campo `semEstorno` em `COMPRAS`).
- REGRA DE PRODUTO CONFIRMADA — **item conquistado por DROP não entra na janela de estorno** (dec. 194): não é compra, não custa moeda e não gera linha em `COMPRAS` (ver Módulos 5 e 8).
- REGRA DE PRODUTO CONFIRMADA — portaria sincronizada com as atividades reais; liberar entrada consome (dec. 180).
- REGRA DE PRODUTO CONFIRMADA — matrícula em turma com horário sobreposto é BARRADA ("matrícula em turma não pode se sobrepor" — única compra bloqueada por choque; o resto só avisa, RN-30; ver Módulo 8).
- REGRA DE PRODUTO CONFIRMADA — carteira por período com o extrato das movimentações (DA-03) e a situação das compras em três estados, com % de evolução; a compra estornada sai das listas de situação, **mas o estorno permanece no extrato** (RN-29, atualizada pelas dec. 196/197).
- REGRA DE PRODUTO CONFIRMADA — estorno é direto (sem fila de aprovação); o admin recebe o registro. Não existe fluxo de aprovação no protótipo.

**Dados utilizados:** `COMPRAS` (ts/estornado/consumido/**semEstorno**/tipo/ref/extra.qtd), `ESTORNOS`, `PEDIDOS`, `SIM_INSC`, `SIM_HIST`, `MATRICULAS`, `evState`, `MOCHILA`, `ITENS_PRESENCIAIS.estoque`, `TURMAS_LOJA.vagas*`, `PROD_AGENDA`, `DIA_MS`.

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — seeds de `COMPRAS`: "Módulo impresso" há 2 dias (150 QdC), "Garrafinha Quad" há 8 dias (90 QdC), "Turma PATAMO · matrícula" há 55 dias (2.400 QdC — "a matrícula que veio do site também é compra"), + 2 compras de alunos-semente; `PEDIDOS` seed com entregas de terceiros; janelas calculadas sobre `Date.now()`.
- DADO DEMONSTRATIVO — o prazo de 7 dias está fixo no código (`estornoDias`: `7 - dias corridos`); é valor de política sujeito à revisão econômica (dec. 185 não o revalidou).

**Resultados esperados:** nenhum estorno fora do prazo ou de compra consumida; devolução exata do valor na moeda original; posse desfeita sem resíduos (vaga, estoque, pedido, inscrição, mochila, foto do personagem, calendário, portaria); admin sempre informado; relatório coerente com o estado real de cada item.

**Situações de bloqueio ou erro:**
- Botão "Estornar" desativado em PRAZO ENCERRADO; linha some quando consumida; segundo toque expira em 4s (volta a "Estornar").
- `estornar()` reforça as guardas (já estornado / prazo vencido ⇒ no-op).
- Matrícula sobreposta barrada com toast "Você já tem 'X' nesse horário".
- Compra sem saldo nunca chega ao log (a recusa acontece na Loja — ver Módulo 8).

**Simulações atuais:**
- SIMULAÇÃO LOCAL — devolução de Dmn é só crédito local (o estorno financeiro real é bancário/gateway); `quando: 'agora'`/"há N dias" são rótulos fixos; a portaria "reconhece" o aluno por `euSou` na sessão única; inscritos-semente são fictícios; `COMPRAS`, `PEDIDOS` e `ESTORNOS` **não** persistem entre sessões (voltam à semente no F5) — o que sobrevive é o **saldo** e os **60 últimos lançamentos do extrato**, pela chave `vq_evolucao` (DA-10, dec. 196).
- SIMULAÇÃO LOCAL — o painel "Estornos e desistências" do admin agrega apenas os estornos da sessão.

**O que precisará de implementação real:** transação atômica compra↔consumo↔estorno no back-end; estorno financeiro real (gateway/Pix/cartão) para compras em Dmn e política para Dmn já convertidos; relógio de servidor para a janela de 7 dias; auditoria/log imutável de compras e estornos; portaria/recepção com identificação real do aluno (QR/documento); notificação ao admin; conciliação de estoque no ERP; multiusuário (vagas concorrentes, corrida pela última vaga já prevista no código: "a última vaga em X acabou de ser tomada").

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA — recarga de Diamantes pelo checkout do site (`[INTEGRAÇÃO REAL]` no código) alimentando o mesmo log de compras.
- FUNCIONALIDADE PLANEJADA — quests/forja consumindo itens da mochila (impacta a política de estorno de combate; ver Módulo 17).

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 185: janela de 7 dias, valores e política de estorno não foram revisados na Consolidação (estrutura preservada, economia indefinida).
- DECISÃO POSTERIOR — **dec. 192 (02/08)**: evento realizado **sai da janela de estorno** (4º caminho de saída, ao lado dos 3 gatilhos de consumo da dec. 178). Antes, um evento comprado e não frequentado continuava estornável até o 7º dia.
- DECISÃO POSTERIOR — **dec. 193 (02/08)**: `COMPRAS` ganhou o campo `semEstorno`; a compra feita no tutorial (a boina) nasce marcada e fica fora dos 7 dias.
- DECISÃO POSTERIOR — **dec. 194 (02/08)**: o DROP cria posse de item de combate sem passar por `COMPRAS` — logo, sem estorno possível (a mochila ganha item que o pós-venda não registra).
- DECISÃO POSTERIOR — definição do fluxo financeiro real do estorno em Dmn (dinheiro de verdade) — hoje é só crédito local.

**Divergências:**
- DIVERGÊNCIA — **estorno de item de combate devolve o valor de UMA compra mas esvazia TODAS as unidades daquele item**: `desfazerCompra` faz `MOCHILA.filter(x => x !== ref)`. Comprovado por sonda: 2 facas compradas (2 × 40 QdC), 1 estorno → +40 QdC e 0 facas na mochila (o aluno perde 40 QdC líquidos). Provável defeito, não regra intencional — nenhuma decisão o cobre.
- DIVERGÊNCIA (menor) — compras com PRAZO ENCERRADO ficam listadas para sempre em "Estornos · até 7 dias" (não são arquivadas); o título sugere que só ≤7 dias apareceriam.
- DIVERGÊNCIA (menor) — no estorno de `pres`, o registro em `ESTORNOS` guarda o valor total, mas remove apenas 1 pedido do aluno para aquele item (se houvesse dois pedidos separados do mesmo item, um permaneceria); cenário não coberto por decisão.

**Perguntas pendentes:**
- PERGUNTA PENDENTE — estorno de item de combate: deve devolver e remover apenas 1 unidade (e o valor daquela compra), ou o comportamento atual (remove todas, devolve uma) é aceito? (ver Divergências)
- PERGUNTA PENDENTE — na versão real, estorno de compra em Dmn devolve Dmn na carteira ou dinheiro no meio de pagamento original? Precisa de aprovação humana em algum valor/limite (hoje é 100% self-service)?
- ~~PERGUNTA PENDENTE — os 7 dias são corridos a partir do `ts` da compra; vale também para compra de evento cuja data é ANTES do fim da janela (um evento não frequentado permanece estornável até o 7º dia — confirmar se é o desejado)?~~ **RESPONDIDA pela dec. 192 (02/08)**: não permanece — o evento realizado sai da janela de estorno pela data, tenha o aluno comparecido ou não. Segue pendente apenas o recorte de **simulado** com data anterior ao fim da janela, que continua saindo só pelo consumo (liberação da entrada).
- PERGUNTA PENDENTE — estorno de matrícula deve ter regra própria (pró-rata após início das aulas)? Hoje qualquer matrícula ≤7 dias estorna 100%, mesmo com a turma já em andamento.

---

## Módulo 11 — Eventos

**Nome do módulo:** Eventos (carrossel da semana, página do evento, venda na Loja, portaria).

**Objetivo:** a administração produz eventos do Quad (aulão, encontro, gincana, maratona, mentoria com data) com data/horário/espaço, modalidade online ou presencial, gratuitos ou pagos, com regras de score e de Quad Coins publicadas por evento; o aluno descobre no carrossel do Início, se inscreve/compra, vê no calendário e entra pela portaria.

**Perfis envolvidos:**
- Administrador (N.P.P.): cria, edita, cancela, publica regras, libera entrada.
- Aluno: vê, compra/inscreve, garimpa, acessa o link do online.
- Professor: aparece no evento via chips e o vê na própria agenda (`eventosDoProf`, src/08 l.40-42; `renderEvProfChips`, src/17 l.98-112 — ver Módulo 15).

**Funcionamento atual:**
FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO:
- Carrossel infinito no Início com todos os eventos vigentes (`eventosInicio`, src/08); etiquetas de **estado** (INSCRITO / LOTADO / EM CHOQUE) com prioridade sobre as de **tipo** (NA LOJA / +BÔNUS). A tag livre `ev.tag` foi removida na dec. 200 junto com o "+COINS" das sementes.
- Página do evento (`openEvento`, src/08 l.237-308): descrição, regras de score, regras de Quad Coins, botão de inscrição/compra, link do online (só para inscrito), botão de garimpo (+15 QdC, uma vez).
- Evento pago vai à Loja (vitrine separada presencial × online — `renderEventosLoja`, l.84-116) e o clique na tag "NA LOJA" do carrossel **abre a página do evento**, cujo botão "Comprar na Quad Store" leva **ao item exato**, que pisca (dec. 199 sobre a dec. 173; `lojaLevarAte`, l.223-234 — ver Módulo 8).
- Evento vencido some do carrossel e da Loja (`evAcabou`, l.139-143); evento multi-dia (`ate`) permanece marcado INSCRITO até o último dia.
- **No calendário, o evento presencial inscrito NÃO some ao vencer (dec. 192)**: vira **CONCLUÍDO** quando a entrada foi liberada na portaria (`ACESSO_ST[ev.id]` com `euSou && liberado` — detalhe "presença registrada na portaria", etiqueta em estilo `live`) ou **FALTOSO** quando o dia passou sem registro de entrada (detalhe "evento realizado — a entrada não foi registrada", etiqueta em estilo `warn`); antes do dia, segue **INSCRITO**. O **evento online continua saindo** do calendário ao vencer — "online não passa na portaria: sem registro de entrada não há CONCLUÍDO/FALTOSO justo" (comentário do fonte, src/08 l.348–355).
- Calendário do aluno em 3 camadas: aulas da turma ativa + marcos do Quad + eventos inscritos da conta (`renderCalendario`, src/08 l.341–366; hook de teste `window.__calRefresh`, que repinta a lista sob demanda — usado pela suíte `vv1.mjs`). Liberar a entrada na portaria repinta o calendário na hora (`src/17 l.381` — "INSCRITO vira CONCLUÍDO").

**Fluxo principal (verificado nas sondas S1/S2):**
1. Admin em Interno → "Eventos da semana": nome, resumo, modalidade (presencial|online), tipo (gratuito|pago, com moeda QdC **ou** Dmn e preço), link (só online), chips de professores do Banco, data + início + término, e **reserva de espaço**: presencial escolhe uma das 4 salas; online **seleciona o Estúdio** (seletor ativo e vazio — dec. 136, que revogou a 131; src/17 l.126-140, sonda S2).
2. Validações com marcação vermelha e aviso fixo; choque de sala/Estúdio barrado (`ocPontual`+`salaConflito`, l.205-209; S2: "O Estúdio já tem Live Probe A nesse dia e horário").
3. Criado: gratuito gira direto no carrossel; pago entra na Loja + carrossel com "NA LOJA" (S1/S2). A sala entra no mapa de ocupação e nas Autorizações de acesso.
4. Aluno compra (`comprarEvento`, src/08 l.144-167): confirmação, débito na moeda do evento, INSCRITO no carrossel, entra no calendário, entra **na hora** na portaria (`renderAcessos`), evento online libera o link na página.
5. Portaria "Autorizações de acesso" (dec. 180): um grupo por evento presencial vigente; "Liberar entrada" marca presença e **consome a compra** (dec. 178 — ver Módulo 10; src/17 l.367-384).

**Ações disponíveis:**
- Admin: criar; **editar** (mesmo formulário, preserva inscritos/`evState`, "trocou de sala? a lotação acompanha" — src/17 l.214-232 e l.220); **cancelar** pelo ✕ (`cancelarEvento`, l.52-67: sai do carrossel, da Loja, dos calendários, libera sala/Estúdio e **remove o grupo da portaria** `delete ACESSO_ST[id]`); adicionar regras de score/coins a evento existente (l.68-78); liberar entrada na portaria; consultar inscritos por atividade + **"Gerar lista de conferência (PDF)"** (`ativListaPdf`, l.451-480 — janela nova + `window.print()`); mandar mensagem ao público "inscritos no evento" (dec. 181 — ver Módulo 16).
- Aluno: inscrever-se (gratuito; com choque de agenda exige **dois toques** — "Inscrever mesmo assim", src/08 l.283-290), comprar (pago), garimpar, abrir link online, estornar em 7 dias **enquanto o evento não acontece** (o estorno desfaz a inscrição e o tira da portaria — dec. 100/178; **passado o evento, a compra sai da janela e o botão não existe mais — dec. 192**; ver Módulo 10).

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — **eventos são DO QUAD, não de uma turma** — todo evento vigente aparece para qualquer aluno (dec. 161, revoga a 150; comentário no código src/08 l.64-65). Ver "Decisões posteriores".
- REGRA DE PRODUTO CONFIRMADA — aulão é EVENTO, não item fixo de Loja (dec. 93); "Mentoria Quad" virou item de catálogo com data que entra no calendário (dec. 103).
- REGRA DE PRODUTO CONFIRMADA — evento tem data + início + término (dec. 38); online/presencial é modalidade, não produto (dec. 39); online = evento com link liberado ao inscrito (dec. 36).
- REGRA DE PRODUTO CONFIRMADA — **lotação do evento presencial herda a da sala** (dec. 179; Sala 1=155, 2=85, 3=125, 4=185): `lot: online ? 0 : salaCap(evSala)` (src/17 l.237). Sonda S1: evento na Sala 4 nasce com `lot:185`, card diz "185 lugares"; `__evLotar(id,185)` → LOTADO na vitrine, no carrossel e compra recusada ("Lotado — a Sala 4 comporta 185 pessoas"). Online (Estúdio) nunca lota (src/08 l.121-124).
- REGRA DE PRODUTO CONFIRMADA — online seleciona o Estúdio obrigatoriamente (dec. 136); duas transmissões no mesmo dia/horário são barradas (S2).
- REGRA DE PRODUTO CONFIRMADA — **todo evento pontua: participar vale +10 de score** (`EV_SCORE_PADRAO`, dec. 200), valor que o administrador edita por evento; os **Quad Coins de participação** são opcionais e é o que rende o selo **+BÔNUS** ao gratuito; pago vende em QdC ou Dmn (uma moeda por evento) e leva **NA LOJA**.
- REGRA DE PRODUTO CONFIRMADA — **portaria sincronizada** (dec. 180): grupos = eventos presenciais vigentes; online não passa na portaria; o aluno entra/sai da lista conforme compra/inscrição (`acessoListaDe`, src/17 l.329-341); **liberar a entrada consome a compra** e a tira da janela de estorno (dec. 178; verificado na família — S3 no simulado; ver Módulo 10).
- REGRA DE PRODUTO CONFIRMADA — "EM CHOQUE" avisa sem impedir (dec. 104/107); compra assumida é do aluno, sem reposição.
- REGRA DE PRODUTO CONFIRMADA — cancelar evento limpa tudo na hora (dec. 37 + 180).
- REGRA DE PRODUTO CONFIRMADA — **o evento presencial inscrito não desaparece do calendário ao vencer** (dec. 192): vira CONCLUÍDO (entrada liberada na portaria) ou FALTOSO (o dia passou sem registro); o **online**, que não passa na portaria, continua saindo do calendário ao vencer.
- REGRA DE PRODUTO CONFIRMADA — **evento realizado não é mais estornável** (dec. 192): a compra sai da janela de 7 dias pela data do evento, mesmo sem consumo registrado (é o 4º caminho de saída — ver Módulo 10).

**Dados utilizados:** `EVENTOS` (data/eventos.js — id, nome, tipo, modalidade, online, pago, preco, moeda, quando, dataISO, ate, sala, hi, hf, lot, ocup, profs, score[], coins[], garimpo, link); `evState` (por evento: comprado/inscrito/garimpado); `ACESSO_ST` (listas de portaria); `SALA_CAP`; `DOCENTES` (chips). Hooks de teste: `__eventos`, `__evEstado`, `__evLotar`, `__evProf`, `__evSalaRefresh`, `__calRefresh` (repinta o calendário — dec. 192).

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — 7 eventos-semente (NAC, Aulão RONDESP, Gincana, Aulão especial pago 80 QdC Sala 2, Simuladão, Semana Insana 400 Dmn, Mentoria CFO 120 QdC) com **datas reancoradas em +8 semanas (dec. 189: 16-21/09 e 26/09/2026)** — manutenção de demo, nenhuma regra alterada; recomendação registrada de datas relativas.
- DADO DEMONSTRATIVO — `ocup` (inscritos-semente), inscritos da portaria semeados por hash (2-5 nomes via `inscNome`), contagem de inscritos do admin = só o aluno desta sessão (`evInscritosCount` retorna 0/1 — src/17 l.22-25).
- DADO DEMONSTRATIVO — `ATIVIDADES` fixas das Liberações (Aulão 73, Isolada 21, Simuladão 54, Excursão 40, TAF 30 — src/17 l.387-393) convivem com turmas/eventos vivos adicionados automaticamente (`ativBank`).

**Resultados esperados:** evento criado aparece em ≤1 render no carrossel do aluno, na Loja (se pago), no mapa de salas e na portaria; compra vira INSCRITO em todos os lugares + calendário; lotado fica indisponível em tudo; cancelamento remove de tudo (comprovado nas sondas).

**Situações de bloqueio ou erro:** falta de nome/data/hora/link http/preço → aviso fixo + campo em vermelho (src/17 l.189-204); sem sala/Estúdio selecionado → barrado com mensagem específica (S2); término ≤ início → barrado; choque de sala/Estúdio → barrado; compra com evento lotado → toast de lotação (S1); compra sem saldo → recusa; inscrição gratuita com choque de agenda → confirmação em dois toques.

**Simulações atuais:**
- SIMULAÇÃO LOCAL — tudo em memória JS (perde-se no F5); as **regras de score/coins publicadas na página são texto** — nenhum crédito automático na presença do evento (só o garimpo credita de verdade +15 QdC via `addScore`, src/08 l.300-306); link online abre por toast ("Abrindo o evento online — <link>"); inscritos da portaria e da lista PDF usam nomes sintéticos por hash (o nome real do aluno aparece na portaria, mas **não** na lista PDF, que gera `inscNome(seed, i)` para todos — src/17 l.456-459); "PDF" = impressão do navegador.

**O que precisará de implementação real:** persistência de eventos/inscrições em banco; venda/checkout e ledger de moedas; contagem real de inscritos e lotação atômica; check-in físico na portaria (QR/credencial) com consumo transacional da compra; crédito real das regras de score/coins por presença; entrega do link de transmissão (notificações); geração de PDF em servidor (ou manter impressão do navegador — decisão técnica); cadastro configurável de salas/lotações (hoje hard-coded).

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA — módulo interno "Administração" e integração com notificações (dec. 182 — Consolidação v1.0; tudo "Módulo Planejado", dec. 184).
- FUNCIONALIDADE PLANEJADA — quests com itens de combate (EM BREVE) citam eventos como cenário (ver Módulo 17). Mensagens por público de evento já existem (dec. 181 — ver Módulo 16).

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 161 (28/07): eventos voltaram a ser genéricos do Quad — **revoga a dec. 150** que havia criado a segmentação "Quem vê este evento" por turma. A segmentação foi ideia anterior; a decisão posterior do gestor ("São eventos do Quad, não da turma") removeu o campo. Avisos continuam por turma.
- DECISÃO POSTERIOR — dec. 136 revoga a 131: reserva do Estúdio deixou de ser automática e passou a ser seleção manual obrigatória.
- DECISÃO POSTERIOR — dec. 179: lotação passou a ser herdada da sala (antes o evento não tinha lotação física).
- DECISÃO POSTERIOR — dec. 178/180: consumo mata o estorno; portaria sincronizada com os eventos reais (removido o fictício "Aniversário do Quad").
- DECISÃO POSTERIOR — dec. 189 (01/08): reancoragem das datas-semente (+8 semanas) — dado demonstrativo, sem regra nova.
- DECISÃO POSTERIOR — **dec. 192 (02/08)**: status do evento no calendário. Antes, todo evento inscrito sumia do calendário ao vencer (o aluno perdia o registro da atividade); agora o presencial permanece como CONCLUÍDO ou FALTOSO e só o online sai. A mesma decisão tirou o evento realizado da janela de estorno (ver Módulo 10).

**Divergências:**
- DIVERGÊNCIA — regras de score/coins do evento são publicadas como se fossem executáveis, mas nenhum mecanismo credita presença de evento (diferente do simulado presencial, que pontua na liberação — ver Módulo 12). Texto × mecânica.
- DIVERGÊNCIA — contadores convivem em três escalas para o mesmo conceito: `ocup` semente + `evInscritosCount` (0/1 real) + `ATIVIDADES` fixas com números grandes (73 etc.) — o "Aulão de véspera RONDESP" aparece como atividade fixa **e** como evento vivo nas Liberações (já apontado pela auditoria; pendente unificar).
- DIVERGÊNCIA — briefing do gate admin cita e-mail `npp@quadconcursos.com.br`, mas o código valida só a chave NPP-2026 (qualquer "@" passa) — herdada da auditoria, confirmada na sonda (ver Módulo 16).

**Perguntas pendentes:**
- PERGUNTA PENDENTE — quem credita, e quando, o score/coins prometidos na página do evento (check-in? fim do evento? manual)?
- PERGUNTA PENDENTE — a lista de conferência em PDF deve sair com os nomes REAIS dos inscritos (hoje sai 100% sintética, mesmo com inscrito real)?
- PERGUNTA PENDENTE — evento pago deveria poder vender nas DUAS moedas ao mesmo tempo, como turma e simulado presencial (hoje é uma moeda só por evento)?
- PERGUNTA PENDENTE — cancelar evento pago com inscritos: há estorno automático? (hoje o cancelamento apaga `evState` sem devolver moeda — o aluno perde o valor se o admin cancelar).

---

## Módulo 12 — Simulados

**Nome do módulo:** Simulados (lançamento unificado no admin, vitrine na Loja, bloco no Calendário do aluno, recepção de presença, quiz digital).

**Objetivo:** a administração lança simulados presenciais (agenda + sala + vagas por moeda, vendidos na Loja) e digitais (quiz cronometrado a partir de PDF, gratuito com prêmio por acerto ou pago); o aluno compra/executa e tudo é computado no histórico "para fins pedagógicos" (comentário src/11 l.77-83).

**Perfis envolvidos:**
- Administrador (N.P.P.): lança, remove, edita preços/vagas, libera inscritos na recepção.
- Aluno: compra, responde o digital, comparece ao presencial.
- Professor: não participa do módulo no protótipo.

**Funcionamento atual:**
FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO:
- **Lançamento unificado** (src/18 l.1-184): um formulário para presencial|digital × pago|gratuito. Presencial: data, início/fim, sala (mesmas 4 salas, com eco de ocupação), **vagas POR MOEDA** ("Vagas em Diamantes" + "Vagas em Quad Coins", soma = lotação — dec. 155) e preço por moeda com vagas. Digital: PDF obrigatório, dia de abertura opcional, minutos (cronômetro), nº de questões, prêmio "QdC por acerto" (padrão 2) no gratuito, preço em uma ou duas moedas no pago.
- **Bloco Simulados mora no CALENDÁRIO do aluno** (dec. 165): lista `#simuladosList` + card de histórico `#simHistCard` na view `v-calendario` (src/03 l.529-543) — confirmado na sonda S3 (INSCRITO aparece lá).
- Loja: vitrines separadas presencial × digital (`renderLojaSimulados`, src/11 l.231-266) com contadores de vagas por moeda ("3 Dmn · 2 QdC"), "sem limite" no digital, EM CHOQUE quando cruza a agenda; clique no bloco do Calendário leva ao item exato da Loja (dec. 173; src/11 l.201-204 — ver Módulo 8).
- Recepção própria de simulados nas Liberações (`renderSimPres`/`liberarInscrito`, src/17 l.501-550), agrupada por simulado.
- **Editor "Preços e vagas"** (dec. 128 versão-tabela + 171): turmas, isoladas e simulados presenciais editáveis sem relançar (preço Dmn/QdC + vagas restantes por moeda); "a sala cresce se a administração abrir mais vagas" (src/18 l.272-362); lançar/remover simulado repinta o editor de preços junto (dec. 171; src/18 l.99 e l.182).
- **Questões — o simulado tem questões ou é encenação de agenda? (resposta fiel):**
  - **Digital: tem quiz real** — overlay cronometrado, questões Certo/Errado **sorteadas do banco demo** (`simDigColeta` mistura `TR_BANK` + `AULA_DEMO` — src/12 l.454-462), correção real, premiação real. O **PDF anexado é só o nome do arquivo**: a extração está marcada "[INTEGRAÇÃO REAL: extração do PDF]" (src/12 l.449-452). SIMULAÇÃO LOCAL do conteúdo; mecânica funcional.
  - **Presencial: é encenação de agenda/logística** — não há questões, aplicação nem correção no app; o "resultado" é a presença confirmada (+score de carreira). A prova em papel acontece fora do sistema.
  - **Ranking de simulado: NÃO existe** no protótipo — a única menção é o texto do evento-semente "Simuladão Quad" ("com ranking geral e correção comentada", data/eventos.js l.24) e a regra de coins "Top 10 do ranking" — texto de página de evento, sem mecânica. Os rankings existentes (sala/geral) são de score de carreira da gamificação, não de simulado.
  - **Relação com turma e árvore do edital (verificada): NENHUMA no código** — `SIMULADOS` não tem campo de turma nem de concurso; todo simulado aparece para todos os alunos; o digital sorteia do banco único da demo, sem filtrar pela árvore do edital da turma ativa (contraste com o Módulo 14, que lê a árvore). O vínculo pedagógico declarado é apenas o histórico ("Tudo é computado no histórico para fins pedagógicos" — src/11 l.83; dec. 47 cita o histórico como base pedagógica).

**Fluxo principal (verificado nas sondas S3/S4):**
- *Presencial:* admin lança (S3: "5 vagas: 3 em Diamantes (50 Dmn) e 2 em Quad Coins (60 QdC), à venda na Loja") → aluno clica → pop-up "em qual moeda" com vagas por moeda → confirmação → débito (1240→1180 QdC) → INSCRITO no Calendário + entra em `SIM_INSC` na recepção → admin "Liberar entrada" → **+score real** ("Entrada liberada — presença confirmada (+100 score)") → simulado vai ao `SIM_HIST` do aluno como REALIZADO → **compra consumida sai da janela de estorno** (dec. 178 — ver Módulo 10).
- *Digital gratuito:* admin anexa PDF + minutos + questões + prêmio (S4: "+3 QdC por acerto") → aparece direto nos Simulados do aluno → "Responder o simulado" abre overlay com cronômetro → questões Certo/Errado → resultado: **+10 score por acerto + N QdC por acerto** (S4: 2 acertos = +20 score · +6 QdC) **+ sorteio de DROP** (dec. 194: `dropSortear('ao concluir o simulado digital')`, src/12 l.520 — cada item com chance configurada pode cair na mochila, com a celebração `#dropLayer`; sem custo e sem estorno; ver Módulos 5 e 8) → vai ao histórico como REALIZADO e sai da lista. Digital pago só abre depois de comprado (`simAtivo`, src/11 l.112-116).

**Ações disponíveis:**
- Admin: lançar, remover pelo ✕ (limpa Loja, editor de preços e mapa de salas), editar preços/vagas no editor, liberar inscrito, mensagem ao público "inscritos no simulado" (dec. 181 — ver Módulo 16), lista de inscritos + PDF (bloco "Inscritos por atividade").
- Aluno: comprar (escolhendo moeda), responder digital, sair do quiz no meio ("pode retomar depois" — reabre do zero; ver Divergências), estornar em 7 dias (sai de `SIM_INSC` — dec. 100; ver Módulo 10), consultar histórico.

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — **presencial é SEMPRE vendido** — o formulário força "pago" e desabilita o seletor (dec. 117b/122; src/18 l.6-11; sonda S3 `{v:'pago',dis:true}`); **presencial nunca premia QdC** (`simRec` retorna 0 — src/11 l.132); a presença gera **score de carreira** na liberação (dec. 128/129 — "como grande parte das interações no app").
- REGRA DE PRODUTO CONFIRMADA — **vagas por moeda** (dec. 155): soma = lotação; validação **vagas ≤ capacidade da sala** (dec. 179; S3: "A Sala 4 comporta 185 pessoas — você pediu 192 vagas") e **choque de sala** com turmas/isoladas/eventos/simulados (dec. 129); compra dá baixa só no estoque da moeda escolhida; esgotou as duas → sai da vitrine e "Sala lotada" no Calendário.
- REGRA DE PRODUTO CONFIRMADA — **digital sem limite de vagas e sem trava de choque** (dec. 123; comentário src/18 l.3-5); vende nas duas moedas ou é gratuito **premiando +10 score e +N QdC por acerto** (N definido no lançamento, padrão 2 — dec. 125; src/12 l.511-515).
- REGRA DE PRODUTO CONFIRMADA — liberação consome a compra (dec. 178; `compraConsumida('simulado', id)` — src/17 l.542) e move ao histórico.
- REGRA DE PRODUTO CONFIRMADA — bloco de Simulados no Calendário, não em Missões (dec. 165).
- REGRA DE PRODUTO CONFIRMADA — **concluir um simulado digital dispara o DROP** (dec. 194), como o fim de um bloco de 10 ou do treinamento rápido: item conquistado vai à mochila sem custo e sem estorno; o presencial não dispara drop (não há resolução de questões no app).
- REGRA DE PRODUTO CONFIRMADA — preço nasce e vive no editor de preços, sincronizado com a Loja (dec. 171).
- REGRA DE PRODUTO CONFIRMADA — clique em "NA LOJA"/bloco leva ao item exato (dec. 173; ver Módulo 8).

**Dados utilizados:** `SIMULADOS` (data/simulados.js — id, rot, det, tag PRESENCIAL|DIGITAL, pago, valor, precoDmn/precoQdc, rec, score, vagas/vagasDmn/vagasQdc/vagasGratis + `*Rest`, dataISO/hi/hf/sala, pdf/minutos/nq/dia, insc/comprado/realizado/feito); `SIM_INSC` (fila da recepção); `SIM_HIST` (histórico); `carreira.score*` (score de carreira); banco de questões demo `TR_BANK` + `AULA_DEMO` (digital); `ITENS_COMBATE`/`MOCHILA` no drop do digital (dec. 194). Hooks: `__simDig`, `__simSalaRefresh`, `__dropSortear`/`__dropRng` (drop determinístico nas suítes).

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — 3 sementes: "Simulado 63 · SD PMBA" (presencial, 120 Dmn/150 QdC, 50+10 vagas, score 120), "Simuladão Quad" (presencial 15/20, 20+60 vagas, score 100) e "Simulado digital · CFO 1ª fase" (grátis, 30 min, 10 questões); 3 inscritos-semente em `SIM_INSC`; os presenciais-semente **não têm dataISO/sala** ("simulado antigo, sem controle de sala passa direto" — src/11 l.136) e por isso não ocupam o mapa de salas nem travam choque; `det` semente "domingo · 8h"/"sábado · 8h" é texto.

**Resultados esperados:** lançamento repinta admin, Loja, Calendário do aluno, editor de preços e mapa de salas na mesma ação; compra decrementa a vaga da moeda; liberação pontua e consome; digital concluído credita e arquiva (tudo comprovado em S3/S4).

**Situações de bloqueio ou erro:** sem nome/data/horário → barrado com campo marcado; vagas por moeda ausentes/negativas/zero total → barrado; vaga com preço ausente na moeda → barrado ("Há 3 vagas em Diamantes — informe o preço"); vagas > lotação da sala → barrado (S3); choque de sala → barrado; digital sem PDF/minutos/questões → barrado (S4); pago sem preço em nenhuma moeda → barrado; compra sem saldo → recusa; última vaga da moeda tomada durante a confirmação → "Sala lotada — a última vaga em X acabou de ser tomada" (src/11 l.311-313); digital com `dia` futuro → "Em breve"/"abre em DD/MM".

**Simulações atuais:**
- SIMULAÇÃO LOCAL — estoque de vagas decrementado no cliente, em memória; questões do digital vêm do banco demo (PDF ignorado além do nome); presença é booleano em memória; inscritos-semente da recepção; score/QdC creditados no estado local; sair do quiz não guarda progresso (o toast diz "pode retomar depois", mas reabrir re-sorteia e zera — ver Divergências).

**O que precisará de implementação real:** motor real de aplicação e correção (módulo "Simulados" da Consolidação — planejado, dec. 182); extração de PDF/banco central de questões (módulo "Banco de questões" — planejado); reserva atômica de vaga por moeda no servidor; check-in de presença transacional; histórico por aluno em banco; relatório pedagógico a partir dos resultados (ver Módulo 14); ranking de simulado, se for requisito (hoje inexistente).

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA — módulos planejados "Simulados", "Banco de questões" e "Inteligência pedagógica" (docs/arquitetura/01, §5-7; dec. 182/184 — nada implementado, protótipo é demonstração; ver Módulos 14 e 16).
- FUNCIONALIDADE PLANEJADA — "Caderno de simulados impresso" é item de Loja (dec. 103); correção comentada/ranking citados só em texto de evento.

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 155 substitui o formato "vagas totais + dessas em QdC" (dec. 128 original) por **vagas POR MOEDA** — motivada por bug real de derivação silenciosa.
- DECISÃO POSTERIOR — dec. 165 tira o bloco de Simulados de Missões e o leva ao Calendário.
- DECISÃO POSTERIOR — dec. 171 move o preço do simulado para o editor de preços sincronizado (antes só ele não estava).
- DECISÃO POSTERIOR — dec. 178 (consumo mata estorno) aplicada à liberação do inscrito.
- DECISÃO POSTERIOR — dec. 128/129 (26/07): presença passou a gerar score de carreira mesmo sem QdC (antes só pontuava quando premiava).
- DECISÃO POSTERIOR — **dec. 194 (02/08)**: o fim do simulado digital passou a sortear itens de combate (drop); antes, o digital só premiava score e QdC por acerto.

**Divergências:**
- DIVERGÊNCIA — toast "Simulado interrompido — você pode retomar depois" (src/12 l.544-547) × comportamento real: não há retomada; reabrir recomeça com novas questões e cronômetro cheio. Texto × mecânica.
- DIVERGÊNCIA — sementes presenciais sem `dataISO`/`sala` escapam do controle de salas e do choque que as dec. 129/179 impõem aos novos — inconsistência de dado demonstrativo com a regra vigente.
- DIVERGÊNCIA — campo `vagasGratis` existe na estrutura (e `simTomaVaga` trata 'gratis'), mas o formulário atual não cria simulado presencial gratuito (presencial é sempre pago) — resíduo de fase anterior à dec. 117b.
- DIVERGÊNCIA — `SIM_INSC` da recepção não expõe o nome real na lista PDF de "Inscritos por atividade" (sempre sintética), embora a recepção de simulados mostre o inscrito real (mesma família da divergência do Módulo 11).

**Perguntas pendentes:**
- PERGUNTA PENDENTE — o simulado real terá vínculo com turma/concurso/árvore do edital (segmentação e relatório por matéria), ou permanece "do Quad" como os eventos (ver Módulo 11)?
- PERGUNTA PENDENTE — haverá ranking de simulado (o texto do Simuladão promete "ranking geral") e correção comentada dentro do app?
- PERGUNTA PENDENTE — o resultado do presencial (nota da prova em papel) entrará no sistema? Por quem?
- PERGUNTA PENDENTE — o digital pago deve premiar score/QdC por acerto como o gratuito? (hoje `rec` é zerado quando pago — `recDig = pago ? 0 : …`, src/18 l.160 — mas os +10 score/acerto do resultado valem para qualquer digital.)
- PERGUNTA PENDENTE — retomada do digital interrompido: é requisito? (toast promete, mecânica não existe.)

---

## Módulo 13 — Materiais

**Nome do módulo:** Materiais das aulas (publicação pela administração em "Atualizações do dia"; consumo pelo aluno em "Materiais das aulas", no "+").

**Objetivo:** publicar material didático da aula — etiquetado por turma → matéria (da árvore do edital da turma) → assunto → tipo — visível só para quem está na turma, com download real do arquivo e retirada do ar.

**Perfis envolvidos:**
- Administrador (N.P.P.): publica e tira do ar.
- Aluno: vê e baixa.
- Professor: **NÃO envia pelo app** — o texto embarcado no código diz "O professor entrega o material; a coordenação publica aqui" (src/16 l.552-555). A entrega professor→coordenação acontece fora do sistema. Não há upload na área do professor (verificado: `v-prof-*` não tem bloco de materiais — ver Módulo 15). Ver Perguntas pendentes.

**Funcionamento atual:**
FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO:
- Admin, em Interno → bloco "Materiais da aula" (divide o chip "Atualizações do dia" com o Cronograma — mesmo `data-bl="crono"`): seletor de turma (turmas vivas da Quad Store), **matéria vinda da árvore do edital daquela turma** (`admMatMateriasInit`, src/16 l.627-636; sonda S5: PT/Inglês/Informática/Matemática para a PATAMO/CFO), assunto (obrigatório), tipo (slides/resumo/lista/mapa/vídeo/outro), título opcional, anexo de arquivo OU link+duração para vídeo (`admMatTipoToggle`).
- Publicação (`btnAdmMat`, l.674-708): valida, guarda o **arquivo real como objectURL** (`URL.createObjectURL(admMatArqFile)`, l.699 — dec. 164) e insere em `MATERIAIS` com etiqueta turma+matéria+assunto; lista de publicados com ✕.
- Aluno (`renderMateriaisAluno`, l.573-617): vê **apenas materiais das turmas em que tem matrícula ativa**, agrupados por "Matéria — Assunto" com tag NOVO; botão **"Baixar"** quando há arquivo (cria `<a download>` com o objectURL — download REAL, sonda S5 baixou `probe-material.pdf`) ou "Abrir" (vídeo abre o link em nova aba com selo "[INTEGRAÇÃO REAL] <link>"; semente sem arquivo mostra "material de exemplo").
- **Etiqueta por turma**: com 2+ matrículas ativas, cada material mostra de qual turma veio (l.589-590; sonda S5: após a 2ª matrícula a linha ganhou "· Turma PATAMO"; com 1 matrícula não há etiqueta).
- ✕ do admin tira do ar e **revoga o objectURL** (l.651-659; S5: material some do aluno na hora).
- **Relação com a aula do dia:** editorial, não estrutural — o bloco vive em "Atualizações do dia" junto do Cronograma e as sementes citam "aula de ontem"; não há chave material↔encontro da grade. **Relação com questões: NÃO existe mecânica** — a "lista de questões" é um tipo/rótulo; nada conecta `MATERIAIS` ao banco de questões ou ao Treinamento Rápido (o texto do mt3 promete responder no app — ver Funcionalidades futuras relacionadas e Perguntas pendentes).

**Fluxo principal (verificado na sonda S5):** admin escolhe turma → matéria da árvore → digita assunto → anexa arquivo → "publicado em Língua Portuguesa — Sonda E · assunto para a Turma PATAMO" → aluno da PATAMO vê com botão Baixar → download real dispara → 2ª matrícula (RONDESP Manhã) abre o pop-up "Matrícula confirmada" (dec. 147) e os materiais passam a exibir a etiqueta da turma → admin ✕ → some do aluno.

**Ações disponíveis:**
- Admin: publicar (arquivo ou vídeo), tirar do ar.
- Aluno: baixar/abrir (baixar limpa a tag NOVO).
- Não há edição de material publicado (só remover e republicar) nem expiração automática.

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — material é POR TURMA; aluno só vê o das turmas com matrícula ativa (dec. 144); **matrícula nova traz o material; estorno o leva embora** (a lista some junto com a matrícula — `desfazerCompra` re-renderiza materiais; regras.md R56; ver Módulo 10).
- REGRA DE PRODUTO CONFIRMADA — download real via objectURL, vídeo abre o link (dec. 164 — antes o botão era aviso vazio); remoção revoga a memória.
- REGRA DE PRODUTO CONFIRMADA — matérias do formulário vêm da árvore do edital da turma (coerência com dec. 163/grade por id).
- REGRA DE PRODUTO CONFIRMADA — remover a turma remove os materiais dela (`removerTurma` — auditoria Ficha 2.15).
- REGRA DE PRODUTO CONFIRMADA — etiqueta de origem com 2+ matrículas (dec. 156/160 — blocos por turma).

**Dados utilizados:** `MATERIAIS` (id, turma(id), materia, assunto, tipo, titulo, det, quando, novo, link, arqNome, arqUrl); `MAT_TIPOS`; `TURMAS_LOJA` + `CONCURSOS.arvore` (seletores); `matriculasAtivas()` (filtro do aluno); `admMatArqFile`. Hook: `__matRefresh`.

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — 5 materiais-semente da PATAMO (mt1-mt5: slides/resumo/lista de Poderes de Dir. Administrativo; vídeo e mapa de Crase) **sem arquivo real** ("material de exemplo, sem arquivo anexado"); o mt3 "Lista extra · 30 questões" diz "Responda no app · pontua em Quad Coins" — só texto.

**Resultados esperados:** publicado → aparece na hora para os alunos da turma, com download funcional; removido → some na hora e libera memória; estornou a matrícula → materiais daquela turma somem (comprovado S5 + auditoria).

**Situações de bloqueio ou erro:** sem turma aberta → barrado; assunto vazio ou com aspas/sinais → barrado com campo marcado; vídeo sem link http(s) → barrado; demais tipos sem arquivo anexado → barrado ("Anexe o arquivo do material antes de enviar" — S5, família de validações).

**Simulações atuais:**
- SIMULAÇÃO LOCAL — o arquivo vive só na sessão (objectURL em memória — fechou o app, perdeu); "PDF · 24 págs" das sementes é texto; controle de acesso ao arquivo é só de exibição (quem tiver a URL do blob baixa — pendência de segurança registrada pela auditoria, docs/arquitetura/01 §4); vídeo = abertura de link com selo [INTEGRAÇÃO REAL].

**O que precisará de implementação real:** armazenamento/CDN com controle de acesso por matrícula; publicação persistente; versionamento/edição; upload do professor (se aprovado); vínculo real com aula/encontro do cronograma e com o banco de questões (se aprovado); política de expiração/arquivamento (hoje não existe — só remoção manual).

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA — **"Produção de materiais" é um dos 11 módulos internos da Consolidação Arquitetural v1.0 (dec. 182), registrado como Módulo Planejado (dec. 184)** — objetivo: publicar materiais segmentados por turma/matéria/assunto/tipo com retirada do ar; "sem especificação: armazenamento, publicação e controle de acesso reais" (docs/arquitetura/01 §4).
- FUNCIONALIDADE PLANEJADA — lista de questões respondível no app (texto do mt3) e integração com o Banco de questões (docs/arquitetura/01 §5), sem decisão numerada própria.

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 164 (28/07) transformou o botão-aviso em download real.
- DECISÃO POSTERIOR — dec. 144 fixou a segmentação por turma.
- DECISÃO POSTERIOR — Consolidação v1.0 (dec. 182/184, 01/08) internalizou "Produção de materiais" como módulo da plataforma (deixa de ser sistema externo).

**Divergências:**
- DIVERGÊNCIA — semente mt3 promete "Responda no app · pontua em Quad Coins" sem nenhuma mecânica correspondente (texto × código).
- DIVERGÊNCIA — o bloco de Materiais divide o chip de atalho "Atualizações do dia" com o Cronograma (`data-bl="crono"` duplicado) — navegação, já apontada pela auditoria (Ficha 2.0).
- DIVERGÊNCIA — grade-semente do CRONO (data/crono.js) diz PATAMO "SALA 4" enquanto `TURMAS_LOJA` diz "Sala 2" (o app prioriza a sala da matrícula: `ta.sala || t.sala`, src/08 l.535) e usa professores que não existem em `DOCENTES` (Moab Kigran, Rodrigo etc.) — dado demonstrativo desalinhado, relevante porque o material referencia a mesma turma/aula; as datas do CRONO (20-24/07, semana 30) **não** foram reancoradas pela dec. 189 (que só moveu eventos).

**Perguntas pendentes:**
- PERGUNTA PENDENTE — **o professor terá envio direto de material pelo app** (hoje é só a coordenação/N.P.P.; o fluxo professor→coordenação é externo), ou o modelo "coordenação publica" é definitivo? Se houver envio do professor, com aprovação prévia da coordenação? (ver Módulo 15)
- PERGUNTA PENDENTE — material terá prazo de validade/arquivamento automático (hoje só sai do ar manualmente)?
- PERGUNTA PENDENTE — a "lista de questões" será respondível no app com premiação em QdC (como o texto-semente promete), integrada ao Banco de questões?
- PERGUNTA PENDENTE — material deve poder ser vinculado a um encontro específico do cronograma (hoje o vínculo é só matéria+assunto)?
- PERGUNTA PENDENTE — deve existir edição de material publicado sem remover/republicar?

---

## Módulo 14 — Inteligência pedagógica

**Nome do módulo:** Inteligência pedagógica (Domínio, dificuldades e leitura de desempenho).

**Objetivo:** ler o desempenho do aluno na árvore do edital (Domínio), realimentar essa leitura com o estudo real (flashcards do Treinamento Rápido — ver Módulo 5) e entregar visões de dificuldade por aluno, por turma e da base para a coordenação.

**Perfis envolvidos:**
- Aluno: gera o sinal (flashcards, missões, quiz).
- Administrador (N.P.P.): consome nos Relatórios (ver Módulo 16).
- Professor: consome indiretamente no relatório do quiz ao vivo (ver Módulo 15).

**Funcionamento atual:**
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — Árvore de Domínio por concurso/turma: cada turma aponta um concurso (`t.concurso`) e cada concurso tem árvore de edital própria (`data/edital-*.js`, `CONCURSOS` em `src/13-js-admin-estrutura.html`); o painel de Domínio do aluno (ver Módulo 7) e todos os relatórios pedagógicos leem a MESMA árvore (dec. 167: "pedagógico por turma, cada bloco na árvore do edital DELA" — sonda F4 nº5/6: blocos por turma exibem "Árvore lida: PM-BA · CFO (Oficiais) · CFO 2024" etc.).
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO + SIMULAÇÃO LOCAL — Cálculo do percentual por sub-assunto: `src/07-js-estado-dados.html:446-449` — base + hash determinístico do nome do nó (`edHash % 41 − 20`) + **ajuste real** `trAj['concurso|matéria|assunto']` vindo dos flashcards. O ajuste é cálculo real local: `src/11-js-missoes-treinamento.html:600` — `trAj[chave] += Math.round((acertos − cartas/2) × 1.2)`, com autoavaliação Errei/Difícil/Bom/Fácil (`:579`) redistribuindo o baralho (Errei/Difícil voltam primeiro, `:634`). Ou seja: **encenação determinística (hash) deslocada por cálculo real (flashcards)** — separação verificada no código.
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — "Dificuldades por aluno"/apoio no admin: `src/18-js-admin-hoje-loja.html:194-251` — `relComputeDif()` compõe sub-assuntos/assuntos/matérias mais fracos; `renderDificuldades()` monta "Alunos que precisam de apoio" misturando **o aluno real da sessão (com a matéria realmente mais fraca dele)** com 3 casos-semente; `acionarApoio()` leva ao bloco de mensagens com texto sugerido pronto (sonda F4 nº9–11: "Percebemos que você precisa de um reforço…").
- SIMULAÇÃO LOCAL + DADO DEMONSTRATIVO — Telemetria: **apenas visual**. Card fixo no Quadrômetro "Telemetria desta sessão · invisível ao aluno na versão real" (`src/03-html-aluno.html:243-245`); o texto só é reescrito em dois pontos com contadores triviais (`src/08-js-eventos-cal-quiz.html:424` — `14 + questões×2`; `src/10-js-acesso-tutorial.html:68`). Nenhum evento é de fato coletado/enviado.

**Fluxo principal:** aluno faz bloco de flashcards (ver Módulo 5) → autoavalia (Errei/Difícil/Bom/Fácil) → `trAj` desloca a barra daquele assunto **no concurso da turma ativa** (dec. 159 — chave por concurso) → Domínio do aluno (ver Módulo 7), relatório individual, pedagógico por turma e dificuldade da base re-renderizam com o novo número.

**Ações disponíveis:**
- Aluno: responder flashcards/missões/quiz.
- Admin: ler relatórios, trocar a árvore vigente ("Definir Domínio" na Estrutura), acionar aluno de apoio.

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — o ajuste de Domínio é POR CONCURSO; acerto num concurso não vaza para matéria homônima de outro (dec. 159).
- REGRA DE PRODUTO CONFIRMADA — pedagógico por turma lê a árvore do edital da própria turma (dec. 167).
- REGRA DE PRODUTO CONFIRMADA — quiz ao vivo e simulados alimentam leitura pedagógica sem premiar o aluno no quiz da aula (dec. 64/65; ver Módulos 12 e 15).

**Dados utilizados:** árvores de edital (`data/edital-cfo.js`, `edital-pcba.js`, `edital-ppba.js`, `edital-soldado.js`), `trAj` (memória de sessão), matrículas/turma ativa, respostas do aluno da sessão.

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — percentuais-base por hash do nome do nó; deslocamento por turma via `hash % 21 − 10` (`src/20-js-relatorios-boot.html:66`); "logins/semana" sintéticos por hash do nome; telemetria com números fixos.

**Resultados esperados:** barras de dificuldade coerentes e estáveis entre telas (mesma árvore em Domínio, relatório individual, por turma e geral); estudo real move as barras na sessão.

**Situações de bloqueio ou erro:** não há estados de erro próprios; sem matrícula ativa o Domínio fica travado ao app-lock do aluno (regra do módulo do aluno — ver Módulo 7).

**Simulações atuais:**
- SIMULAÇÃO LOCAL — tudo em memória (arrays JS); nada persiste entre recargas; percentuais-semente determinísticos; telemetria de fachada.

**O que precisará de implementação real:** coleta real de eventos de estudo (telemetria como serviço de dados — `docs/arquitetura/00:103` diz "a decidir"); histórico por aluno em banco; motor de dificuldade sobre respostas reais; consolidação multi-aluno (hoje só o aluno da demo gera sinal).

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA — alertas automáticos, recomendações de estudo e videoaulas de reforço **não existem no protótipo em nenhuma forma** (varredura por "recomend|reforço|videoaula|alerta" só encontra `admAlerta` de validação de formulário e o texto sugerido do botão Acionar); o módulo "Inteligência pedagógica" consta como **Módulo Planejado** na Consolidação v1.0 (`docs/arquitetura/00-arquitetura-oficial.md:70` e :125 "[PLANEJADO]"; dec. 182/184).

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 159 (ajuste por concurso), 167 (pedagógico por turma), 23 (prova de promoção usa questões marcadas Errei/Difícil), 182/184 (vira módulo interno; sem especificação = planejado).

**Divergências:**
- DIVERGÊNCIA — nenhuma específica além da geral de telemetria: apresentada como "invisível na versão real" mas inexistente de fato (o próprio card declara).

**Perguntas pendentes:**
- PERGUNTA PENDENTE — o motor real de dificuldade usará quais sinais (flashcards, quiz ao vivo, simulados, presença)? Com que pesos?
- PERGUNTA PENDENTE — a telemetria será serviço próprio ou de terceiro (arquitetura deixa "a decidir")?
- PERGUNTA PENDENTE — alertas/recomendações/videoaulas de reforço entram em qual versão e com qual regra de disparo?

---

## Módulo 15 — Área do professor

**Nome do módulo:** Área do professor (Controle · Eventos · Quiz ao vivo · Calendário · Informações).

**Objetivo:** dar ao docente a visão das próprias turmas, aulas e eventos, o quiz ao vivo da sala com relatório pedagógico, os números de trabalho por período e o canal de recados da administração.

**Perfis envolvidos:**
- Professor: usa a área.
- Administrador (N.P.P.): governa o cadastro e envia recados (ver Módulo 16).
- Aluno: responde o quiz ao vivo.

**Funcionamento atual:**
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — **Login individual por e-mail + senha** (dec. 85): e-mail derivado do **sobrenome** do docente (`emailDoProf`, `src/09-js-professor.html:40-45` — remove títulos Prof.ª/Prof./Cap./Ten./Sgt./Maj./Cel., tira acentos, última palavra → `<sobrenome>@quadconcursos.com.br`); senha inicial `quad1234` (`PROF_SENHA_DEMO`, `:37`), trocável pelo próprio professor. Sonda F2 nº1–4: `moura@quadconcursos.com.br`/`quad1234` entra; senha errada e e-mail sem cadastro são recusados. *(Obs.: o e-mail `filho@quadconcursos.com.br` citado no briefing da investigação não corresponde a nenhum docente-semente de `data/docentes.js`; o 1º docente ativo é Danilo Moura → `moura@`.)*
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — Recusa de desligado/bloqueado e **derrubada de sessão** (dec. 89): `checarAcessoProf()` (`src/13-js-admin-estrutura.html:247`) roda a cada mudança no banco de docentes; bloqueio pelo admin derruba a sessão aberta na hora e o portão mostra recado cordial "…está temporariamente afastado das atividades…" com tratamento por gênero (sonda F2 nº18–20 confirmou ao vivo).
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — Vínculo com o corpo docente: o professor "está na turma" quando `t.professores[matéria] === nome` (definido na criação de turma pelo admin ou auto-distribuído por `ensureProfs` entre docentes ativos da matéria); casamento de matéria por prefixo. Sonda F1 nº3: Moura vê RONDESP/PATAMO com "você: Direito Constitucional, Direito Administrativo".
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — Painel de controle (perfil): nome/matérias/turnos/graduação/fone vêm do Banco de professores (só o admin edita); o professor só troca **foto** e **senha** (validação de senha atual + mínimo 6). Limite de permissão confirmado (sonda F2 nº5).
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — Aulas/eventos dele: "Aula de hoje" varre a grade `CRONO` das turmas dele, só seg–sex, com status AGORA/ENCERRADO pelo relógio real e atalho "Abrir o quiz desta sala"; eventos filtrados por `ev.profs` conter o nome (chips definidos pelo admin — dec. 87; ver Módulo 11). Sonda F2: domingo → "Você não tem aula hoje…" e `__prof(2)` (quarta) retorna 2 tempos.
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — Calendário: linhas AULA (grade, com HOJE destacado) + linhas EVENTO douradas (sonda F2 nº10).
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO + SIMULAÇÃO LOCAL — Informações/relatório por período (dec. 98): mês=4/tri=13/sem=26/ano=52 semanas; aulas ministradas = aulas/semana×semanas (F2 nº13: ano = 13× o mês, 28→364); horas em sala = estimativa pela duração dos slots da grade; eventos extrapolados pela recorrência mensal. A UI declara "[INTEGRAÇÃO REAL] presença confirmada por chamada".
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO — Recados (`RECADOS_PROF`): recado do admin chega com badge na navbar e no card; abrir a tela marca lida ~800 ms depois e sincroniza "LIDA" no histórico do admin (sonda F3 nº13–15). **Resposta à recepção: input+botão `disabled` com selo "EM BREVE — …na V1"** (`src/04-html-professor.html:99`) — FUNCIONALIDADE PLANEJADA.
- FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO + SIMULAÇÃO LOCAL — **Quiz ao vivo** (detalhado na sonda F1, 22/22):
  - Criação "por PDF": usa **apenas o nome do arquivo**; as questões saem dos bancos demo `QA_MULT` (10 questões de múltipla escolha de Dir. Administrativo, `data/qa-mult.js`) e `QA_CE` (11 itens certo/errado, `data/qa-ce.js`), repetindo numeradas se pedir mais que o banco (`qzMontarQuestoes`, `src/09:381-393`). Comentário no código: "[INTEGRAÇÃO REAL] as questões saem da extração do PDF anexado".
  - Limites 1–30 questões / 1–180 min (dec. 86) — F1 nº5: pedido de 99 questões é recusado.
  - Estados criado→ativo→encerrado, um quiz POR TURMA (`QUIZZES[turmaId]`, dec. 77); criado permite Refazer/Descartar; ativo trava e acende "AO VIVO" no topo; aluno vê "AULA COM QUIZ" (criado) → "AULA COM QUIZ ATIVO" + botão Quiz (F1 nº8–14).
  - Polling do placar: `setInterval` 700 ms somando `ceil(random()*5)` até o alvo; **total = lotação real da turma** (mín. 12; F1 nº13: 13/35); a última vaga é reservada ao aluno da demo só se ele for matriculado da turma; **a resposta real do aluno é absorvida** (`qaFinaliza` marca `alunoFez` e injeta no relatório, F1 nº17).
  - Relatório: em branco até a 1ª resposta (dec. 83, "nada de % inventado"); % de acerto por questão + distribuição por alternativa com a tag CORRETA (F1 nº20–21); distribuição determinística por hash (`qzDist`) incorporando a resposta real. Aluno **não pontua** (sem gabarito e sem premiação — dec. 64; alimenta a leitura pedagógica — ver Módulo 14). "Feedback dos alunos": EM BREVE (`src/04:165`).
- **Envio de materiais pelo professor: NÃO EXISTE.** Verificado: `src/04-html-professor.html` não tem nenhuma ocorrência de "material"; o canal de materiais é exclusivo do admin (bloco "Materiais da aula", dec. 144 — ver Módulo 13). FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO (limite de permissão) + PERGUNTA PENDENTE abaixo.

**Fluxo principal:** login por e-mail/senha → painel com turmas → abrir sala → anexar PDF, definir tipo/questões/minutos → criar → ativar na hora da aula → acompanhar placar → encerrar → ler relatório por questão.

**Ações disponíveis:** trocar foto/senha; abrir sala; criar/refazer/descartar/ativar/encerrar quiz; ver aulas de hoje, eventos, calendário; alternar período do relatório; ler recados.

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — dados cadastrais só via admin; 1–30 questões/1–180 min; quiz sem premiação; um quiz por turma; bloqueio/desligamento derruba sessão com recado cordial; e-mail derivado do sobrenome acompanha rename (dec. 175); professor não é escalável em matéria que não ministra (dec. 83/91).

**Dados utilizados:** `DOCENTES` (`data/docentes.js`), `TURMAS_LOJA`, `CRONO` (`data/crono.js`), `EVENTOS`, `QA_MULT`/`QA_CE`, `RECADOS_PROF`.

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — 6 docentes-semente; bancos de 10+11 questões; grade `CRONO` semente com professores-fantasia fora do banco (Moab Kigran, John Bernam etc. — cobertos pelo casamento por matéria); semana-modelo fixa de datas no `CRONO`.

**Resultados esperados:** professor só vê o que é dele; quiz roda ponta a ponta na sessão; relatório reflete a sala; números de período coerentes com a grade.

**Situações de bloqueio ou erro:** senha errada/e-mail sem cadastro/desligado ("cadastro está desligado")/bloqueado ("Acesso bloqueado pela coordenação") no gate; quiz recusa sem PDF ou fora dos limites; aluno sem conexão não abre o quiz ("precisa de conexão").

**Simulações atuais:**
- SIMULAÇÃO LOCAL — autenticação em memória; polling randômico encena a sala; questões de banco demo em vez do PDF; horas em sala estimadas pela grade (não por chamada); foto/senha não persistem entre recargas.

**O que precisará de implementação real:** autenticação/sessão de verdade (revogação server-side); extração real do PDF; respostas reais de N alunos em tempo real (canal de eventos); presença por chamada; upload de foto; persistência de senha.

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA — resposta do professor à recepção (V1, junto com "atividades online"); avaliação da aula pelos alunos (EM BREVE); feedback dos alunos no quiz (ver Módulo 17).

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 63/64/65 (área e quiz), 77 (quiz por turma), 83→85 (login), 86 (limites), 87 (chips de professores em eventos), 88 (menu em 5 áreas), 89 (derrubada de sessão), 90 (apagar docente), 91 (cronograma por seletores), 92 (recados), 98 (relatório por período), 162 (placar com lotação real), 174/175 (edição + rename propagado).

**Divergências:**
- DIVERGÊNCIA — nenhuma nova além das herdadas do módulo administrativo (ver Módulo 16); registro interno: o briefing desta investigação citava `filho@quadconcursos.com.br`, e-mail que não existe no banco-semente.

**Perguntas pendentes:**
- PERGUNTA PENDENTE — o professor terá canal próprio de envio de materiais na versão real ou o fluxo continua exclusivo da coordenação (ver Módulo 13)?
- PERGUNTA PENDENTE — o relatório de horas passará a usar presença/chamada real (a UI já promete "[INTEGRAÇÃO REAL] presença confirmada por chamada")?
- PERGUNTA PENDENTE — homônimos de sobrenome: `emailDoProf` gera colisão (dois "Silva" teriam o mesmo e-mail) — qual regra real de identidade?

---

## Módulo 16 — Área administrativa

**Nome do módulo:** Área administrativa N.P.P. (Controle · Interno · Relatórios · Liberações · Loja + Estrutura/Edital/Questões).

**Objetivo:** governança completa da operação: corpo docente, turmas/isoladas, concursos e árvores, comunicação, contas e moedas, cronograma e materiais, eventos e simulados, liberações de recepção/portaria, catálogo e preços da Loja e leitura de relatórios. É o módulo que opera quase todos os demais (ver Módulos 8, 10, 11, 12, 13, 14 e 15).

**Perfis envolvidos:**
- Administrador (N.P.P.): há **4 perfis** administrativos desde a dec. 196 (DA-08) — `direcao`, `coordenacao`, `recepcao` e `financeiro`, declarados em `ADM_PERFIS` (src/16). O perfil é escolhido no **portão** (`#admPerfil`, src/06), aparece como **chip no painel** (`#admPerfilChip`, src/05 — "N.P.P. · governança das contas · Direção") e **filtra as abas visíveis** (`admPodeVer`): Direção vê as 5 (`v-adm-controle`, `v-adm-hoje`, `v-adm-alunos`, `v-adm-liber`, `v-adm-loja`); Coordenação pedagógica vê Controle, Hoje e Relatórios; Recepção vê Liberações e Hoje; Financeiro vê Relatórios, Loja e Liberações. Se a aba aberta não pertence ao perfil, a navegação salta para a primeira permitida. O **crédito manual** de moedas passa a ser **assinado** no ledger pelo nome do perfil (`autor: admPerfilNome()`, src/16) e o toast de entrada informa "Acesso liberado · perfil \<nome\>". Hook de teste `window.__admPerfil`. REGRA DE PRODUTO CONFIRMADA (DA-08) — a modelagem fina das permissões (RBAC por pessoa) segue para a especificação.
- Aluno e professor: alcançados pelos efeitos em tempo real.

**Funcionamento atual (por área — todas verificadas nas sondas F3/F4 e nas suítes vk1/vadmin/vinterno/vcontrole/vestrutura/vrelatorios do repositório):**
- **Gate:** exige e-mail com "@", **perfil de acesso** (`#admPerfil` — Direção / Coordenação pedagógica / Recepção / Financeiro, dec. 196) e chave `NPP-2026` (case-insensitive). Nota do portão: "cada perfil enxerga o que a sua responsabilidade exige (DA-08); no sistema real a chave é emitida por pessoa e toda ação registra o autor". DIVERGÊNCIA (conhecida e reconfirmada ao vivo — sonda F3 nº1): **o e-mail não é validado** — `qualquer@coisa.com` + chave entra; `npp@quadconcursos.com.br` é só placeholder. Comentário no código: "[INTEGRAÇÃO REAL] a chave é emitida e revogada pela direção, por pessoa".
- **Abas/views (8 no total):** navbar com 5 (`v-adm-controle`, `v-adm-hoje`, `v-adm-alunos`, `v-adm-liber`, `v-adm-loja`) — **filtradas pelo perfil escolhido no portão** (DA-08; ver "Perfis envolvidos") — + 3 auxiliares por botão (`v-turmas` Estrutura, `v-edital`, `v-questoes`). **Não existe aba/tela de "Configurações"** — inexistente no protótipo. Cada área "abre limpa" só com os atalhos por bloco (dec. 127/113).
- **Painel de controle (`v-adm-controle`):** FUNCIONAMENTO FUNCIONAL DO PROTÓTIPO —
  - Banco de professores: cadastro (nome, até 3 matérias, turnos, graduação, fone), edição no mesmo formulário (dec. 174) e **rename propagado** para turmas, isoladas, eventos, grade, recados e sessão aberta, com e-mail acompanhando (dec. 175; `renomearDocente`, `src/13:341`); desligar/readmitir, bloquear/liberar (derruba sessão — F2 nº18; ver Módulo 15), apagar com confirmação em 2 toques.
  - Criação de turmas e isoladas: tipo com nome real + apelido (dec. 138 — sonda F3: tipos "Turma de nivelamento/regular/de questões/Matérias isoladas"), concurso derivado da Estrutura (cfo/sdba/sdfront/ppba/pcba/prf), sala com eco de agenda, período, 2 tempos seguidos, **turno derivado do horário** (dec. 139 — F3 nº3), preços Dmn+QdC e **vagas por moeda** (dec. 155), professores por matéria da árvore do edital, PDF da árvore ("[INTEGRAÇÃO REAL] leitura do PDF"). Validações reais confirmadas: **vagas ≤ lotação da sala** (F3 nº2: "A Sala 2 comporta 85 pessoas — você pediu 400 vagas") e **choque de sala** (F3 nº3b: "A Sala 2 já tem Turma PATAMO nesse horário"). Turma criada entra na hora na Quad Store (ver Módulo 8), no Cronograma (chave por id — dec. 163), na Estrutura, nas Liberações e no editor de preços (F3 nº4–7).
  - Crédito manual QdC/Dmn com motivo e histórico; conta da demo credita na carteira na hora e o lançamento entra no **extrato do aluno** com origem "administração" e **autor = o perfil administrativo logado** (`admPerfilNome()` — DA-03 + DA-08, dec. 196; ver Módulos 9 e 10).
  - Contas: bloquear derruba a sessão do aluno em ~400 ms com pop-up de conta bloqueada (dec. 52); desbloquear reativa.
  - **Comunicação por público (dec. 181):** 7 públicos (aluno, professor, turma, isolada, simulado, evento, todos — F3 nº8); alcance calculado (inscritos reais quando existem; "Todos" = 1.286 fixo — DADO DEMONSTRATIVO); mensagem de público chega no chat do aluno **prefixada "[Turma PATAMO] …"** (F3 nº11); para professor vira recado na sala dele; status ENVIADA→LIDA sincronizado na leitura (F3 nº12/15).
  - Gift cards em lote (1–500 × valor × moeda) com QR ilustrativo e resgate único; estornos/desistências com ranking (ver Módulo 10).
- **Interno/Hoje (`v-adm-hoje`) — "Atualizações do dia":** avisos por turma-alvo por id (dec. 149), **cronograma por turma** (seletores: turma por id, dia, tempo com horário real, matéria da árvore, professor filtrado pela matéria; grava grade + corpo docente como fonte única e re-renderiza aluno e professor na hora — dec. 91/163), **materiais da aula** (ver Módulo 13; turma→matéria→assunto→tipo→arquivo/link; arquivo baixa de verdade via objectURL — dec. 144/164; só quem está na turma vê), eventos da semana (ver Módulo 11; chips de professores, reserva de sala/Estúdio, gratuito×pago, lotação herdada da sala — dec. 179), lançamento de simulados (ver Módulo 12; presencial sempre vendido com vagas por moeda ≤ sala; digital sem limite, por PDF "[INTEGRAÇÃO REAL]" — dec. 117b/122/123), skins e itens de combate (combate sempre QdC — ver Módulo 8; desde a dec. 194 o criador ganhou dois campos próprios do item de combate: **`#admSkDisp`** — "Como o aluno obtém o item": só venda / só drop / venda + drop — e **`#admSkDrop`** — chance no drop em %, validada entre **1 e 100**; item **só de drop publica sem preço**, e a linha `#admSkDropRow` só aparece quando o destino é item de combate — `src/05:541-547`, `src/14:875-902`), Quests = botão **EM BREVE** (`src/05-html-admin.html:550-554`).
- **Relatórios (`v-adm-alunos`)** — sonda F4 (18/18): 4 painéis com gráficos de colunas/rosca em **CSS/HTML puro, sem biblioteca** (dec. 55; F4 nº18). Individuais (conta da demo + 3 seeds; compras reais da sessão; pedagógico vivo; Reclamações EM BREVE); **pedagógico por turma** (um bloco por turma aberta na árvore dela — dec. 167; ver Módulo 14); Turmas (dificuldades por sub-assunto/assunto/matéria; "Alunos que precisam de apoio" com Acionar→mensagem pronta; Presença e Feedbacks EM BREVE); Gerais ("Perfil médio da base" com 412 alunos = **tabela fixa no HTML** — DADO DEMONSTRATIVO — F4 nº12; dificuldade da base viva; NPS EM BREVE); Loja (mais vendidos fixos `REL_LOJA_TOP`; donut = base fixa 18.600→21.360 QdC/9.400 Dmn **+ compras vivas**; "Compradores · últimas compras" = `COMPRAS` real; inscritos por atividade com **lista de conferência em PDF via `window.print()`** — dec. 169, sem lib).
- **Liberações (`v-adm-liber`):** produtos físicos (entrega consome a compra e mata o estorno — dec. 178; ver Módulo 10), autorizações de acesso sincronizadas com os eventos presenciais vigentes (dec. 180; ver Módulo 11), simulados presenciais com liberação que pontua score de carreira (dec. 128/129; ver Módulo 12), inscritos por atividade + PDF, categorias com hierarquia visual (dec. 168), gift em lote no Controle.
- **Loja (`v-adm-loja`):** cadastro de produto/serviço nas seções reais (dec. 95), editor de preços de qualquer item da vitrine, "Preços e vagas · turmas, isoladas e simulados" (edita sem recriar, matrículas preservadas — dec. 81/117c/121/124; ver Módulo 8).
- **Banco de questões (`v-questoes`):** **tela de demonstração** — tabela fixa de 3 questões; "Cadastrar questão" dispara apenas toast descritivo ("Cadastro: enunciado, alternativas, tag e campo de uso"). SIMULAÇÃO LOCAL/apenas visual + FUNCIONALIDADE PLANEJADA (Módulo Planejado "Banco de questões", dec. 182). Idem `v-edital` (árvore PC-BA estática; "Lançar edital"/"Reconciliar" só alternam cartões fixos) — não confundir com as árvores **vivas** de `CONCURSOS` na Estrutura (ver Módulo 14).

**Fluxo principal:** gate por chave → Painel de controle → operar blocos (docentes/turmas/crédito/contas/mensagens/gift/estornos) → Interno para o dia a dia (avisos/cronograma/materiais/eventos/simulados/skins) → Liberações na recepção → Relatórios para leitura → Loja para catálogo/preços; tudo reflete no app do aluno e do professor em tempo real.

**Ações disponíveis:** criar/editar/remover em todos os cadastros; bloquear contas e docentes; creditar moedas; enviar mensagens/avisos/materiais; liberar entradas/entregas; gerar PDF de conferência; editar preços e vagas (detalhamento por bloco em "Funcionamento atual").

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — lotação fixa por sala (155/85/125/185 — dec. 179); sala não aceita duas atividades no mesmo dia/horário (dec. 129/130); turno sai do horário (dec. 139); vagas por moeda (dec. 155); remoção de turma recusada com matrícula ativa ("estorne antes"); consumo mata o estorno (dec. 178) e o evento realizado também sai da janela (dec. 192); comunicação por público com prefixo (dec. 181); admin abre limpa (dec. 127).
- REGRA DE PRODUTO CONFIRMADA — **o admin decide como cada item de combate é obtido e com que chance** (dec. 194): seletor de disponibilidade (`#admSkDisp`) + chance de 1% a 100% (`#admSkDrop`); item só-drop dispensa preço e não vai à vitrine; a lista de itens do painel mostra o modo ("só no drop · N% de chance" / "N QdC · na Loja e no drop (N%)" — src/14 l.824-825).

**Dados utilizados:** `ADM_PERFIS` (4 perfis com as abas de cada um — src/16), `DOCENTES`, `TURMAS_LOJA`, `ISOLADAS`, `CONCURSOS`+árvores, `CRONO`, `EVENTOS`, `SIMULADOS`, `CONTAS`, `COMPRAS`, `PEDIDOS`, `ACESSO_ST`, `LOJA_EXTRAS`, `ITENS_COMBATE`, `ITENS_PRESENCIAIS`, `RECADOS`/`RECADOS_PROF`, `AVISOS`, `MATERIAIS`, `CREDITOS`, `ESTORNOS`, `LEDGER` (todos em memória, sementes em `data/`).

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — chave `NPP-2026`; 3 contas-semente; alcance "1.286"; inscritos-semente por hash (20–44 por turma antiga); perfil médio "412 alunos"; vendas/fluxo semanais fixos; QR ilustrativo; `ATIVIDADES` fixas das Liberações.

**Resultados esperados:** qualquer criação/edição do admin aparece na hora nas telas de aluno/professor (verificado nas sondas: turma→Store/Cronograma; mensagem→chat; recado→professor; bloqueio→derrubada).

**Situações de bloqueio ou erro:** validações com aviso fixo no bloco e campo marcado (dec. 114): lotação excedida, choque de sala, campos obrigatórios, nome duplicado (produtos/skins/docentes homônimos), link http para vídeo, remoção com matrícula ativa recusada.

**Simulações atuais:**
- SIMULAÇÃO LOCAL — tudo em memória e por sessão; gate sem servidor; QR e PDF pela janela do navegador; leitura de PDFs (edital/simulado/quiz) apenas pelo nome do arquivo; preços da Loja raspados do DOM (fragilidade declarada na auditoria).

**O que precisará de implementação real:** **RBAC fino** por trás dos 4 perfis já demonstrados, com emissão/revogação de **chave por pessoa** (e validação do e-mail) — a existência dos perfis foi decidida (DA-08) e demonstrada; o que falta é a matriz de permissões e a identidade individual; persistência/banco para todos os cadastros; upload/parse de edital e PDFs; mensageria/push; **ledger de moedas no servidor** (o protótipo já demonstra o modelo — DA-03); check-in de portaria; geração real de QR e PDF; chave primária de docente que não seja o nome (homônimos).

**Funcionalidades futuras relacionadas:**
- FUNCIONALIDADE PLANEJADA — Quests (EM BREVE); chat ao vivo de duas vias ("próxima implementação"); Reclamações/Presença/Feedbacks/NPS nos Relatórios (EM BREVE); banco de questões operável e reconciliação de edital (telas hoje demonstrativas); aba de configurações (não existe — a criar se o produto exigir). Ver Módulo 17.

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 20 (área criada), 51 (5 áreas), 52 (governança de contas), 76, 78/79/80/81, 91, 113/114/115/116, 117/117b/117c, 122–129, 127, 129–131/134/135/136 (salas/Estúdio), 138–141, 144/145, 149, 155, 163, 167, 168, 169, 170/171/172/173, 174/175, 178, 179, 180, 181, 186 (riscos de segurança registrados como pendências — nenhuma solução implementada), **194 (criador de itens de combate com disponibilidade e chance de drop)**, **195 (DA-08: perfis administrativos; DA-03: ledger)** e **196 (implementação de ambos — `ADM_PERFIS`, filtro de abas, chip do perfil e crédito manual assinado)**.

**Divergências:**
- DIVERGÊNCIA — gate valida SÓ a chave, e-mail livre (reconfirmada ao vivo, F3 nº1).
- DIVERGÊNCIA — texto da UI das Liberações diz que a entrega "volta o item ao estoque da Loja", mas o código só devolve estoque no estorno (ver Módulo 10).
- DIVERGÊNCIA — grade-semente `CRONO` contém professores inexistentes no banco `DOCENTES` (ver Módulo 13).
- DIVERGÊNCIA — `ATIVIDADES` fixas duplicam eventos vivos nas Liberações (ver Módulo 11).

**Perguntas pendentes:**
- ~~PERGUNTA PENDENTE — quantos perfis/papéis administrativos existirão (N.P.P., direção, recepção?) e com quais permissões?~~ → **RESPONDIDA pela DA-08 (dec. 195, 03/08)**: são **quatro** — Direção, Coordenação pedagógica, Recepção e Financeiro —, implementados na dec. 196 com filtro de abas e assinatura das ações. Continua aberto apenas o **detalhamento fino das permissões (RBAC)** e a chave por pessoa (ver doc. 07, P51).
- PERGUNTA PENDENTE — o e-mail do admin passa a ser credencial validada? (a DA-08 define o **perfil**, não a **identidade individual** — a chave por pessoa continua pendente.)
- PERGUNTA PENDENTE — banco de questões: qual o modelo real (cadastro, tags, correção em sala prometida no texto da tela)?
- PERGUNTA PENDENTE — unificar `ATIVIDADES` fixas com eventos vivos?
- PERGUNTA PENDENTE — "Configurações" (parâmetros gerais) será uma área própria?

---

## Módulo 17 — Funcionalidades futuras

**Nome do módulo:** Funcionalidades futuras · prévias e menções no protótipo (varredura consolidada).

**Objetivo:** registrar onde o protótipo anuncia capacidades que ainda não existem, com evidência e classificação.

**Perfis envolvidos:** todos — as prévias aparecem sobretudo no "+" do aluno e em textos de overlay/roadmap.

**Funcionamento atual (varredura — cada item é FUNCIONALIDADE PLANEJADA, com a evidência):**
- **Chat ao vivo (aluno↔administração):** botão bloqueado no "+" com `data-lock="Chat ao vivo com a administração — próxima implementação"` + tag "EM BREVE" (`src/06-html-overlays.html:197-201`); texto no chat "✆ Chat ao vivo em breve" (`src/06:345`); admin: "o chat ao vivo fica como próxima implementação" (`src/05:270`); roadmap V2 "Chat, guarnições, GvG/PvP" (`src/06:506-507`).
- **PvP / GvG / Guarnições:** botão bloqueado no "+" `data-lock="Guarnições, GvG e PvP chegam na V2"` com tag "V2" (`src/06:202-205`); faixa de faseamento V2 "Camada viva" (`src/06:506`).
- **Georreferenciamento / presença por geofencing (GPS):** não há tela; aparece só como texto do roadmap — faixa V1 "Geofencing, domínio, push · Quadcoin faseado" (`src/06:503`) e nota "prévias de V1 (Quadcoin, geofencing)… aparecem bloqueadas" (`src/06:524`); `docs/01-visao-e-escopo.md:25` (V1). Nenhum código de localização existe.
- **Notificações reais (push):** só na mesma faixa V1 do roadmap (`src/06:503`; `docs/01:25`); no protótipo os "recados" são badges internos. A arquitetura mantém "notificações" como sistema externo a integrar (dec. 182).
- **Pré-TAF:** botão bloqueado no "+" `data-lock="Pré-TAF em planejamento — ainda não disponível nesta versão"` + "EM BREVE" (`src/06:207-211`).
- **Quests / forja de itens:** botão "Criar Quests" EM BREVE no admin (`src/05:550-554`, toast "Próxima implementação"); na mochila do aluno: "🎯 Quests em breve: reúna itens da sua mochila para forjar novos equipamentos" (`src/06:316`). **Só as Quests e a forja seguem planejadas.**
  - **O DROP saiu desta lista (dec. 194, 02/08): deixou de ser "não existe em lugar nenhum" e passou a ser mecânica implementada.** A varredura anterior por "drop|aleat|raro" foi feita antes da decisão e não vale mais. Hoje o sorteio roda ao concluir bloco de 10 (dia/noite/tarde), treinamento rápido ou simulado digital (`dropSortear`, `src/15:49-83`; gatilhos em `src/11:615` e `src/12:520`), com item raro só-drop no catálogo (o "Patch da sorte", `data/itens-combate.js`), celebração `#dropLayer` (`src/06:320`) e configuração pelo admin (`#admSkDisp`/`#admSkDrop`). Não dispara no tutorial. Suíte `vv1.mjs`. Ver Módulos 5, 8, 10, 12 e 16.
- **Expansão para alunos online / atividades online:** o texto do professor amarra a resposta à recepção a "as atividades online, na V1" (`src/04:99` — ver Módulo 15); `LINKS_ONLINE` foi preservado como ponto de integração planejado (dec. 188); cursos online/mentoria já são itens de catálogo (ver Módulo 8), mas "plataforma de cursos" segue sistema externo (dec. 182).
- **Biometria / reconhecimento facial:** só em texto de release note sobre o antigo fluxo de autorização de dispositivo ("reconhecimento facial/desbloqueio nos próximos acessos", `src/06:523`); o fluxo de autorização de dispositivo foi **removido** na Consolidação (dec. 188). Nenhuma mecânica.
- **Quadcoin/Intendência faseados (economia real):** faixa V1 (`src/06:503`); regras econômicas permanecem INDEFINIDAS por decisão (dec. 185 — ver Módulos 8 e 10).
- **Skin aplicada no boneco (skins criadas pelo admin vestirem o avatar):** comentário no código "Aplicação no boneco é da V1" (dec. 54) — a cadeia de fardas da demo veste, skins novas não (ver Módulo 8).
- **Também EM BREVE (já listados nos módulos):** resposta do professor à recepção e feedback/avaliação de aula (ver Módulo 15); Reclamações, Presença, Feedbacks de turma e NPS nos Relatórios (ver Módulo 16); banco de questões e reconciliação de edital operáveis (ver Módulo 16); lista de questões respondível em Materiais (ver Módulo 13); alertas/recomendações pedagógicas (ver Módulo 14).

**Fluxo principal:** as prévias bloqueadas mostram um toast/data-lock ao toque; nada navega.

**Ações disponíveis:** nenhuma (botões bloqueados ou texto).

**Regras confirmadas:**
- REGRA DE PRODUTO CONFIRMADA — faseamento V0 (prova de vida) → V1 (Expansão A·B·C: geofencing, domínio, push, Quadcoin faseado) → V2 (camada viva: chat, guarnições, GvG/PvP) — faixa de faseamento em `src/06:495-508` e `docs/01-visao-e-escopo.md`.

**Dados utilizados:** apenas textos estáticos (`data-lock`, faixas de roadmap, release notes) — nenhuma estrutura de dados própria.

**Dados demonstrativos:**
- DADO DEMONSTRATIVO — nenhum dado por trás das prévias.

**Resultados esperados:** o usuário entende o que vem depois sem conseguir acessar.

**Situações de bloqueio ou erro:** `plus-row.locked` mostra o aviso do `data-lock`; sem erros.

**Simulações atuais:**
- SIMULAÇÃO LOCAL — não há simulação: são anúncios.

**O que precisará de implementação real:** todos os itens acima, cada um como módulo/integração própria (dec. 184: sem especificação suficiente = "Módulo Planejado", sem implementação parcial).

**Funcionalidades futuras relacionadas:** este módulo é a própria lista consolidada — os itens já apontados nos capítulos anteriores estão referenciados em "Funcionamento atual".

**Decisões posteriores:**
- DECISÃO POSTERIOR — dec. 52 (chat ao vivo EM BREVE), 54 (skin no boneco V1), 182/183/184/185/186/188 (Consolidação v1.0: módulos internos, cadastro revogado da dec. 21 mas fluxo novo não implementado, módulos planejados, economia indefinida, riscos de segurança pendentes, `LINKS_ONLINE` preservado).
- DECISÃO POSTERIOR — **dec. 194 (02/08): o drop de itens saiu de "funcionalidade futura" e virou mecânica implementada** — este módulo perdeu um item da varredura. Quests e forja continuam EM BREVE.

**Divergências:**
- DIVERGÊNCIA — o texto de release note ainda descreve o fluxo de autorização de dispositivo/reconhecimento facial que a dec. 188 removeu do código (texto histórico no overlay de notas).

**Perguntas pendentes:**
- PERGUNTA PENDENTE — presença por GPS/geofencing: será presença de aula, de evento, ou gatilho de missão? Nenhum requisito existe.
- ~~PERGUNTA PENDENTE — drop aleatório/itens raros: entram na V2 junto com Quests ou não fazem parte do produto?~~ **RESPONDIDA pela dec. 194 (02/08)**: fazem parte do produto e já estão na V0 — o drop foi implementado ao concluir blocos/treinamento/simulado digital, com item raro só-drop no catálogo. O que resta pendente é o **balanceamento das chances** (dec. 185 mantém a economia indefinida) e a relação do drop com as Quests/forja, ainda EM BREVE.
- PERGUNTA PENDENTE — push: qual provedor e quais eventos disparam?
- PERGUNTA PENDENTE — biometria segue no escopo após a remoção do fluxo de dispositivo?
