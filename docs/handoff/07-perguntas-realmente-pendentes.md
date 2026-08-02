# 07 — Perguntas realmente pendentes

**Data:** 02/08/2026
**Fontes:** seções "Perguntas pendentes" dos 6 dossiês de investigação (A–F, `scratchpad/handoff-inv/`); `docs/auditoria/10-divergencias-e-decisoes-pendentes.md` (somente as perguntas marcadas **[ABERTA]**); conferência contra `docs/02-registro-de-decisoes.md` (dec. 1–191, incl. Consolidação v1.0) e contra o comportamento do protótipo.

**Critério de inclusão (filtro rigoroso):** entram apenas dúvidas que (1) **não** estão respondidas pelo protótipo, pela documentação nem pelo registro de decisões e (2) **afetam diretamente a futura construção** (bloqueiam especificação, modelo de dados, regra de negócio ou corte de escopo). Perguntas repetidas entre dossiês foram **deduplicadas** (fontes citadas em cada uma). Perguntas cuja resposta já existe foram **descartadas e listadas no rodapé** com a resposta em uma linha. Responsável sugerido: **Danilo Moura** = decisão de produto; **engenheiro** = decisão técnica.

> Nota: a dec. 185 declara as **regras econômicas indefinidas** de propósito. Isso não "responde" as perguntas de economia — apenas confirma que estão abertas. Elas aparecem consolidadas no tema 2, sem repetir valor por valor.

---

## Tema 1 — Conta e acesso

**P1. Quais são os campos e o fluxo do novo módulo interno de cadastro, qual a sua relação com o checkout externo — e quem cria a conta quando a matrícula é presencial/manual?**
Contexto: a dec. 183 revogou a dec. 21 (conta nascia no site), mas o fluxo novo não foi especificado (dec. 184 — "Módulo Planejado"); o protótipo mantém de propósito o portão "cadastro no site" como demonstração, e pagamentos seguem externos (dec. 182).
Impacto: bloqueia o desenho do módulo de cadastro/autenticação e a integração com o checkout — porta de entrada de todo aluno.
Responsável: Danilo Moura. *(Fonte: dossiê A/M1.)*

**P2. Haverá recuperação de acesso ("esqueci minha senha") e por qual mecanismo (e-mail de redefinição? código?)?**
Contexto: o login do protótipo só tem "Entrar" e "Criar conta"; não existe caminho de recuperação em nenhuma forma nem decisão registrada.
Impacto: bloqueia o escopo do módulo de autenticação (fluxos, e-mail transacional).
Responsável: Danilo Moura (fluxo) + engenheiro (mecanismo). *(Fonte: dossiê A/M1.)*

**P3. O aluno com conta bloqueada deve ver algo além do aviso (canal de contato, histórico), ou o beco absoluto é o desejado?**
Contexto: hoje o bloqueio derruba a sessão e o relogin só mostra "procure a administração", sem nenhuma ação possível a partir dali.
Impacto: define a tela/fluxo do estado bloqueado e o canal de contestação.
Responsável: Danilo Moura. *(Fonte: dossiê A/M1.)*

**P4. O nome de guerra deve ser único (na turma ou na plataforma) ou pode repetir?**
Contexto: o protótipo valida apenas a derivação do nome completo; não há checagem de duplicidade entre alunos — e a tradição militar sugere unicidade.
Impacto: bloqueia a validação server-side e o modelo de dados da identidade militar.
Responsável: Danilo Moura. *(Fonte: dossiê A/M2.)*

**P5. O limite de 12 caracteres do nome de guerra é intencional (padrão de tarjeta) ou deve ceder para combinações válidas mais longas?**
Contexto: a regra aceita combinações em ordem ("Almeida Moura", 13 caracteres), mas o `maxlength=12` as torna indigitáveis — conflito regra × campo comprovado por sonda.
Impacto: bloqueia a especificação final da validação e da exibição (tarjeta/farda).
Responsável: Danilo Moura. *(Fonte: dossiê A/M2.)*

**P6. Quem pula a instrução deve ser obrigado a definir nome de guerra e avatar em algum momento posterior?**
Contexto: pular deixa a conta "AL SD QUAD ______" com avatar padrão e nenhum passo posterior obriga a completar o perfil.
Impacto: define os gates de completude de identidade no onboarding real.
Responsável: Danilo Moura. *(Fonte: dossiê A/M2.)*

**P7. Refazer a instrução deve zerar score/Quad Coins da conta de verdade no produto final, ou o reset é só teatro do protótipo?**
Contexto: hoje "refazer" zera as variáveis reais da sessão; num produto com persistência isso destruiria o progresso acumulado do aluno.
Impacto: bloqueia a regra do "refazer tutorial" e a proteção do progresso persistido.
Responsável: Danilo Moura. *(Fonte: dossiê A/M2.)*

**P8. Qual é a lista oficial de termos vetados e a regra de moderação do nome de guerra?**
Contexto: o filtro atual são 7 palavrões improvisados no código, sem decisão registrada (Q12 da auditoria segue [ABERTA]).
Impacto: bloqueia a validação de produção (filtro real, revisão humana?).
Responsável: Danilo Moura. *(Fontes: dossiê A/M2 + Q12.)*

**P9. Os 29 passos atuais do tutorial são o roteiro oficial a reconstruir, ou os beats extras (confirmação de avatar/nome, pronome) precisam de validação formal?**
Contexto: o registro fala em 9 e depois 19 etapas; o código vigente tem 29 passos e a suíte `vtut.mjs` os trata como critério de aceite (Q3 [ABERTA]).
Impacto: sem roteiro canônico, o onboarding real não pode ser especificado nem testado.
Responsável: Danilo Moura. *(Fonte: Q3.)*

**P10. A instrução deve reabrir em todo login (texto da dec. 105) ou só no 1º acesso, com refazer pela central do QUAD (comportamento real do código)?**
Contexto: a dec. 105 diz "em todo acesso", mas o código grava `vq_tut_skip` e nunca mais reabre — contradição registrada sem palavra final do gestor (Q4 [ABERTA]).
Impacto: define o gatilho do tutorial no app real.
Responsável: Danilo Moura. *(Fonte: Q4.)*

**P11. Quais são as regras de alteração da graduação do aluno?**
Contexto: pendência aberta desde 18/07 ("gestor definirá" — Q16 [ABERTA]); nada no protótipo permite alterá-la nem define quem pode.
Impacto: bloqueia o cadastro/perfil real do aluno e as permissões de edição.
Responsável: Danilo Moura. *(Fonte: Q16.)*

---

## Tema 2 — Economia e balanceamento

**P12. O modelo econômico canônico será o do protótipo (QdC ganho direto por atividade + Diamante) ou o do Anexo A da rev. 2.3 (Marcos de Conquista/ledger) — quem redige a rev. 2.4 e quem é o dono do portão do Diamante?**
Contexto: o protótipo paga QdC direto por atividade e tem uma segunda moeda em dinheiro real que não existe no documento-base; a dec. 185 apenas registra que nada foi estudado (Q5+Q8 [ABERTAS]).
Impacto: bloqueia a modelagem da carteira/ledger, a integração de pagamentos e o realinhamento do documento-base.
Responsável: Danilo Moura + Vitor França (economia). *(Fontes: Q5, Q8, dossiês C/D.)*

**P13. No piloto de 30 dias, o que fica ligado, em vitrine ou desligado (Quad Store, Diamante, patente dinâmica, mensageria) — e o crivo Financeiro + Jurídico dos ralos de valor real foi acionado?**
Contexto: a rev. 2.3 manda a V0 rodar sem economia ativa; o protótipo demonstra V0 + V1 (+ fatias de V2) tudo junto (Q7+Q18 [ABERTAS]).
Impacto: define o corte de escopo da primeira construção e protege a métrica-mãe (retorno espontâneo) de contaminação.
Responsável: Danilo Moura + Vitor França/N.G.E./Jurídico. *(Fontes: Q7, Q18.)*

**P14. Quem conduz — e quando sai — o estudo de balanceamento que fixará os valores hoje demonstrativos (recompensas, preços, metas de patente incl. a curva achatada de 12.500 nas patentes 9ª–13ª — a Coronel, 14ª e máxima, tem `pontos: null`, sem meta —, janela de estorno de 7 dias)?**
Contexto: a dec. 185 declara tudo indefinido; todos os números do protótipo são placeholders calibrados para a demonstração.
Impacto: a construção precisa ao menos de parametrização configurável — e o lançamento, dos números finais.
Responsável: Danilo Moura + gestor da economia. *(Fontes: dossiês B/C/D + dec. 185.)*

**P15. Qual é o ciclo real da temporada (o HTML rotula "(semana)", sem reset implementado) e o que é o "Prestígio" pós-Coronel?**
Contexto: `scoreTemporada` existe sem mecânica de reset/recompensa; "Prestígio" aparece só como texto ("Patente máxima — rumo ao Prestígio").
Impacto: bloqueia o modelo de dados da carreira (ciclos, histórico de temporadas, pós-jogo).
Responsável: Danilo Moura. *(Fonte: dossiê C/M7.)*

**P16. O ranking geral virá de qual recorte — plataforma inteira, por concurso, por período?**
Contexto: o ranking geral da demo é inteiramente fictício (1.286 usuários, aluno fixo em 87º); nenhuma decisão define o recorte real.
Impacto: bloqueia o serviço de ranking (agregação, índices, privacidade server-side).
Responsável: Danilo Moura. *(Fonte: dossiê C/M7.)*

**P17. Gift card em Quad Coins é intencional no produto final, ou o cartão real será só de Diamantes?**
Contexto: a dec. 48 apresenta o gift como canal do Diamante, mas o painel emite lotes também em QdC — moeda "comprável" que colide com o princípio "Score não é moeda" da rev. 2.3.
Impacto: define o escopo do módulo de gift cards e a contabilidade das moedas.
Responsável: Danilo Moura. *(Fonte: dossiê C/M9.)*

**P18. Qual é a política comercial do gift card: valor de face em R$, validade/expiração, limite de resgate por conta/CPF, canal de resgate (app e/ou site) e quem pode emitir lotes (qualquer admin N.P.P. ou só a direção)?**
Contexto: o protótipo emite lotes livres de 1–500 cartões sem preço em R$, sem validade, resgatáveis por qualquer conta e por qualquer admin.
Impacto: bloqueia a emissão real, o antifraude e a trilha contábil de quem emitiu/resgatou.
Responsável: Danilo Moura. *(Fonte: dossiê C/M9.)*

**P19. O estorno de compra em Diamantes devolve Dmn na carteira ou dinheiro no meio de pagamento original — e exige aprovação humana acima de algum valor?**
Contexto: hoje o estorno é 100% self-service e devolve crédito local na hora; Dmn representa dinheiro real (gateway/checkout externo — dec. 182).
Impacto: bloqueia o fluxo financeiro do estorno (gateway, conciliação, alçadas).
Responsável: Danilo Moura + financeiro. *(Fonte: dossiê D/M10.)*

**P20. O estorno terá regras específicas por situação — pró-rata de matrícula com turma já iniciada e evento/simulado cuja data já passou dentro da janela de 7 dias?**
Contexto: hoje qualquer compra ≤7 dias estorna 100% (só o consumo bloqueia); um evento não frequentado permanece estornável até o 7º dia, e matrícula em andamento devolve tudo.
Impacto: bloqueia as regras de negócio do módulo de estornos.
Responsável: Danilo Moura. *(Fonte: dossiê D/M10.)*

**P21. No estorno de item de combate, o correto é devolver e remover 1 unidade — ou o comportamento atual (remove TODAS as unidades e devolve o valor de uma) é aceito?**
Contexto: defeito provável comprovado por sonda (2 facas compradas + 1 estorno = 0 facas e só 40 QdC de volta); nenhuma decisão cobre o caso.
Impacto: bloqueia a implementação correta de estorno × mochila.
Responsável: Danilo Moura (confirma) / engenheiro (corrige). *(Fonte: dossiê D/M10.)*

**P22. Quais produtos vendem em qual moeda na V1 — e o evento pago passa a vender nas duas moedas com vagas por moeda, como turma e simulado?**
Contexto: hoje turma/simulado vendem nas duas moedas com vagas separadas; evento, isolada e itens vendem em uma só; combate/skins sempre QdC — sem decisão sobre a matriz final.
Impacto: bloqueia o modelo de precificação/vagas do catálogo inteiro.
Responsável: Danilo Moura. *(Fontes: dossiês D/M8 + E/M11 — deduplicadas.)*

**P23. Esgotada a cota de vagas de uma moeda, haverá remanejamento automático entre cotas ou permanece só o ajuste manual do editor?**
Contexto: o editor "Preços e vagas" permite realocar manualmente (dec. 117c/124); regra automática nunca foi decidida.
Impacto: afeta o motor de vagas por moeda (reservas, concorrência pela última vaga).
Responsável: Danilo Moura. *(Fonte: dossiê A/M3.)*

---

## Tema 3 — Turmas e cronograma

**P24. Haverá limite de matrículas simultâneas além da regra do turno?**
Contexto: hoje o limite é apenas estrutural (uma turma por turno + sem sobreposição de horário); com um catálogo real de mais turnos/horários, o teto prático muda.
Impacto: regra de negócio do módulo de matrículas.
Responsável: Danilo Moura. *(Fonte: dossiê A/M3.)*

**P25. A turma que termina gera fluxo de renovação (oferta, desconto, aviso prévio do vencimento) ou o aluno sempre recompra na Loja?**
Contexto: o pop-up diz "matrícula não renovada", mas não existe fluxo de renovar nem comunicação prévia — o aluno só descobre quando o app trava.
Impacto: bloqueia o ciclo de vida da matrícula (notificações, ofertas, retenção).
Responsável: Danilo Moura. *(Fonte: dossiê A/M3.)*

**P26. Quando a turma ativa vence por data e existe outra vigente, a troca silenciosa para a primeira ativa (comportamento atual) é o desejado — sem avisar o aluno?**
Contexto: o código se autocorrige em silêncio; só o estorno da turma em uso tem regra explícita de troca (dec. 162).
Impacto: define o comportamento do seletor de turma ativa na expiração.
Responsável: Danilo Moura. *(Fonte: dossiê A/M3.)*

**P27. O histórico da turma encerrada (missões, ranking, materiais) fica acessível ao aluno depois do fim?**
Contexto: hoje tudo que é "da turma" some junto com a matrícula; nada foi decidido sobre retenção ou consulta posterior.
Impacto: bloqueia o modelo de arquivamento e eventuais telas de histórico.
Responsável: Danilo Moura. *(Fonte: dossiê A/M3.)*

**P28. Na produção, o cronograma nasce integrado à planilha da coordenação (transição via Google Sheets) ou já no módulo interno como fonte única desde o início?**
Contexto: a dec. 182 internaliza "cronogramas" como módulo da plataforma, mas o processo real da coordenação hoje vive numa planilha citada como fonte ("na V1 o app sincroniza direto da planilha").
Impacto: define se há integração Sheets a construir ou migração de processo — afeta o primeiro incremento do módulo.
Responsável: Danilo Moura + engenheiro. *(Fonte: dossiê B/M4.)*

**P29. Os avisos devem ser vistos só na turma ativa (comportamento atual) ou em todas as matrículas do aluno?**
Contexto: hoje um aviso da turma B fica invisível enquanto o aluno usa a turma A — ele pode perder comunicação de uma turma em que está matriculado.
Impacto: regra de entrega/visibilidade do módulo de comunicação.
Responsável: Danilo Moura. *(Fonte: dossiê B/M4.)*

**P30. A liberação diária dos blocos às 22h15 é horário fixo do Quad ou acompanha o turno/horário de cada turma?**
Contexto: a narrativa diz "22h15 do seu dia", mas os blocos são gerados com o horário da própria turma; sem agendador real, a regra nunca foi exercitada.
Impacto: bloqueia o agendador do pipeline de missões (ondas D0/D+1/D+7/D+30).
Responsável: Danilo Moura. *(Fonte: dossiê B/M5.)*

**P31. O "corte das missões da semana (sábado 23h59)" é regra de produto a implementar ou texto a remover?**
Contexto: a linha existe só como marco decorativo do calendário e num toast do motor órfão; a única expiração implementada é a de 7 dias por bloco.
Impacto: define se existe ciclo semanal no motor de missões.
Responsável: Danilo Moura. *(Fonte: dossiê B/M5.)*

**P32. Qual o destino da missão atrasada não recuperada (some? conta contra o aluno?) — e recuperá-la deve pagar igual a um bloco em dia?**
Contexto: hoje a atrasada fica em "Atrasadas" indefinidamente e a recuperação paga o prêmio integral, sem qualquer consequência ou redução.
Impacto: regra do motor de missões e do balanceamento de recompensas.
Responsável: Danilo Moura. *(Fonte: dossiê B/M5 — duas perguntas correlatas unificadas.)*

---

## Tema 4 — Eventos e simulados

**P33. Quem credita, e em que momento, o score/Quad Coins prometidos na página do evento (check-in na portaria? fim do evento? lançamento manual)?**
Contexto: as regras publicadas por evento são apenas texto — nenhum mecanismo credita presença (só o "garimpo" paga de verdade); o simulado presencial, ao contrário, pontua na liberação.
Impacto: bloqueia o módulo de eventos (crédito transacional de presença/participação).
Responsável: Danilo Moura. *(Fonte: dossiê E/M11.)*

**P34. Cancelar evento pago com inscritos gera estorno automático?**
Contexto: hoje o cancelamento apaga o estado do evento sem devolver moeda — o aluno perde o valor se o admin cancelar.
Impacto: regra obrigatória do fluxo de cancelamento (proteção ao aluno).
Responsável: Danilo Moura. *(Fonte: dossiê E/M11.)*

**P35. Evento presencial fora da sede (sem sala cadastrada) deve ser proibido no formulário ou ter lotação própria?**
Contexto: o formulário novo exige sala, mas eventos multi-dia/semente passam sem — e então nunca lotam (`evLot`=0), contra o espírito da dec. 179.
Impacto: modelo de espaços/lotação do módulo de eventos.
Responsável: Danilo Moura. *(Fontes: dossiês D/M8 + E — deduplicadas.)*

**P36. O simulado real terá vínculo com turma/concurso/árvore do edital (segmentação e relatório por matéria) ou permanece "do Quad", igual para todos?**
Contexto: `SIMULADOS` não tem campo de turma nem de concurso; o digital sorteia do banco único sem filtrar pelo edital da turma ativa.
Impacto: bloqueia o modelo de dados do módulo de simulados e o relatório pedagógico por matéria.
Responsável: Danilo Moura. *(Fonte: dossiê E/M12.)*

**P37. Haverá ranking de simulado e correção comentada dentro do app?**
Contexto: o texto do "Simuladão" promete "ranking geral e correção comentada", mas nenhuma mecânica existe (os rankings atuais são de score de gamificação).
Impacto: define requisitos do motor de simulados (classificação, gabarito comentado).
Responsável: Danilo Moura. *(Fonte: dossiê E/M12.)*

**P38. A nota do simulado presencial (prova em papel) entra no sistema — e lançada por quem?**
Contexto: o presencial no app é só logística (compra + presença + score de comparecimento); o resultado pedagógico não tem porta de entrada.
Impacto: bloqueia o histórico pedagógico completo e os relatórios de desempenho.
Responsável: Danilo Moura. *(Fonte: dossiê E/M12.)*

**P39. O simulado digital pago deve dar +10 score por acerto como o gratuito (o prêmio em QdC já é exclusivo do gratuito — dec. 123)?**
Contexto: o lançamento zera o campo `rec` quando pago, mas o motor de resultado paga +10 score/acerto para qualquer digital — incoerência sem decisão.
Impacto: regra de premiação do motor de simulados.
Responsável: Danilo Moura. *(Fonte: dossiê E/M12.)*

**P40. A retomada do simulado digital interrompido é requisito real?**
Contexto: o toast promete "pode retomar depois", mas reabrir re-sorteia as questões e zera o cronômetro — texto × mecânica.
Impacto: define a persistência de estado de prova (server-side) no motor de simulados.
Responsável: Danilo Moura. *(Fonte: dossiê E/M12.)*

---

## Tema 5 — Conteúdo e questões

**P41. Qual será a regra canônica de feedback nas missões (imediato, como nos flashcards, ou correção no fim + vídeo de resolução) — e o motor órfão de `QUESTIONS` é a base desse futuro ou deve ser removido?**
Contexto: o motor `#quizLayer` (correção no fim, vídeo placeholder, +20 QdC) está vivo mas inalcançável pela UI; cada contexto atual tem regra própria de feedback.
Impacto: bloqueia a especificação do motor unificado de questões do aluno.
Responsável: Danilo Moura. *(Fonte: dossiê B/M6.)*

**P42. Quem cadastra questões no produto final — só o N.P.P., ou também o professor, com curadoria?**
Contexto: a tela do admin é estática com stub "Cadastrar questão"; o professor só anexa PDF cuja extração é `[INTEGRAÇÃO REAL]`.
Impacto: bloqueia o desenho de permissões e do fluxo editorial do banco de questões.
Responsável: Danilo Moura. *(Fontes: dossiês B/M6 + F/M16 — deduplicadas.)*

**P43. Qual é o modelo real do banco de questões: ID única com deduplicação, classificação descendo ao subassunto, versionamento e trilha de auditoria da "correção ao vivo"?**
Contexto: hoje a ligação questão↔edital é por rótulo textual matéria+assunto (sem ID, sem subassunto — o Domínio exibe subassuntos que nenhuma questão aponta); a "correção ao vivo" é só texto de tela.
Impacto: bloqueia o schema do banco de questões — dependência de missões, simulados, quiz da aula e Domínio.
Responsável: engenheiro (modelo) + Danilo Moura (regras). *(Fontes: dossiês B/M6 + F/M16 — deduplicadas.)*

**P44. A "lista de questões" publicada como material será respondível no app com premiação em QdC, integrada ao banco de questões?**
Contexto: o material-semente promete "Responda no app · pontua em Quad Coins" sem nenhuma mecânica nem decisão correspondente.
Impacto: define a integração materiais ↔ banco de questões ↔ economia.
Responsável: Danilo Moura. *(Fonte: dossiê E/M13.)*

---

## Tema 6 — Pedagógico

**P45. O motor real de dificuldade/Domínio usará quais sinais (flashcards, quiz da aula, simulados, presença) e com quais pesos?**
Contexto: hoje as barras são hash determinístico + um deslocamento simples dos flashcards ((acertos−5)×1,2); a "metodologia calibrada" é anunciada para a V1 sem especificação.
Impacto: bloqueia o módulo de inteligência pedagógica (medição real de desempenho).
Responsável: Danilo Moura + engenheiro. *(Fonte: dossiê F/M14.)*

**P46. O que dispara uma intervenção por risco de abandono/dificuldade e quem age (alerta automático? N.P.P.? mentor?) — e em qual versão entram alertas, recomendações e videoaulas de reforço?**
Contexto: previsão da rev. 2.3 sem nenhuma função implementada; existe só o botão "Acionar" com mensagem pronta (Q17 [ABERTA]).
Impacto: define requisitos do módulo de inteligência pedagógica e da mensageria de apoio.
Responsável: Danilo Moura. *(Fontes: dossiê F/M14 + Q17 — deduplicadas.)*

**P47. A aprovação na prova de promoção usa a nota mínima por fase (70–85%, configuração que existe e nunca é lida) ou os 80% fixos que o código aplica?**
Contexto: `GAMI.fases[].notaMin` existe mas `PROVA_APROV=0.80` vale para todas as fases — pendência declarada no próprio fonte (Q10 [ABERTA]).
Impacto: regra do motor de promoção e da configuração administrável do `GAMI`.
Responsável: Danilo Moura (regra) / engenheiro (implementação). *(Fontes: dossiê C/M7 + Q10 — deduplicadas.)*

**P48. O professor terá envio direto de material pelo app (com aprovação prévia da coordenação?) ou o modelo "professor entrega fora do sistema, coordenação publica" é definitivo?**
Contexto: não existe upload na área do professor; o texto embarcado afirma o fluxo via coordenação e o trecho professor→coordenação acontece fora do sistema.
Impacto: bloqueia o desenho do módulo de produção de materiais (papéis e fluxo editorial).
Responsável: Danilo Moura. *(Fontes: dossiês E/M13 + F/M15 — deduplicadas.)*

**P49. O material publicado terá edição sem remover/republicar, prazo de validade/arquivamento automático e vínculo a um encontro específico do cronograma?**
Contexto: hoje só existem publicar e tirar do ar manualmente; o vínculo é apenas matéria+assunto, sem chave material↔aula da grade.
Impacto: define o ciclo de vida e o modelo de dados do módulo de materiais.
Responsável: Danilo Moura. *(Fonte: dossiê E/M13 — três perguntas correlatas unificadas.)*

**P50. O Pré-TAF entra na V0 (a tela `v-pretaf` existe pronta e órfã) ou fica para a V1 (e a tela morta sai)?**
Contexto: a view está completa mas inacessível; o "+" mostra "Pré-TAF em planejamento — EM BREVE" (Q11 [ABERTA]; mantida na limpeza de 01/08 justamente por depender desta decisão).
Impacto: define o corte de escopo do treino físico na primeira construção.
Responsável: Danilo Moura. *(Fonte: Q11.)*

---

## Tema 7 — Administração

**P51. Quantos papéis administrativos existirão (N.P.P., direção, recepção…) com quais permissões — e o acesso passa a ser conta individual com e-mail validado e chave emitida/revogada por pessoa?**
Contexto: a demo tem 1 perfil com chave única `NPP-2026` e e-mail livre (qualquer "@" entra); o próprio código anota "a chave é emitida e revogada pela direção, por pessoa", nunca especificado.
Impacto: bloqueia o RBAC do módulo de administração e a auditoria de ações (quem fez o quê).
Responsável: Danilo Moura (papéis) + engenheiro (RBAC). *(Fontes: dossiês A/M1 + F/M16 — deduplicadas.)*

**P52. A presença real (o "9/10" do aluno e as horas em sala do professor) virá de qual registro — chamada do professor, liberações da portaria, geofencing (V1)?**
Contexto: "presença 9/10" é texto fixo e as horas do professor são estimativa pela grade; a UI promete "[INTEGRAÇÃO REAL] presença confirmada por chamada" e o roadmap cita geofencing sem nenhum requisito.
Impacto: bloqueia o módulo de presença — fonte de relatórios, score de comparecimento e números de trabalho docente.
Responsável: Danilo Moura. *(Fontes: dossiês C/M7 + F/M15 + F/M17 — deduplicadas.)*

**P53. Haverá uma área de "Configurações" com parâmetros administráveis (cadastro de salas/lotações — hoje 155/85/125/185 fixos —, valores do `GAMI`, janelas de prazo)?**
Contexto: não existe tela de configurações no admin; salas e parâmetros de carreira são hard-coded com a anotação "o admin ajustará no sistema real".
Impacto: define onde vivem os parâmetros do sistema (cadastro administrável × código).
Responsável: Danilo Moura (escopo) + engenheiro. *(Fontes: dossiê F/M16 + auditoria §5.6 — deduplicadas.)*

---

## Tema 8 — Técnicas

**P54. As entidades (professor, aluno, turma, questão) terão ID estável como chave — e o e-mail funcional do professor deixa de ser derivado do sobrenome (colisão de homônimos)?**
Contexto: hoje o nome é a chave do docente (renomear propaga e troca o login) e dois "Silva" gerariam o mesmo e-mail; Q15 segue [ABERTA], a especificar nos módulos internos.
Impacto: requisito de arquitetura do modelo de dados — bloqueia autenticação e todos os cadastros reais.
Responsável: engenheiro (Danilo Moura confirma o requisito). *(Fontes: Q15 + dossiês A/M1 + F/M15 — deduplicadas.)*

**P55. A telemetria/log de eventos (origem de sessão, linha de base da métrica-mãe) será serviço próprio ou de terceiro, quem constrói — e fica pronta antes do piloto?**
Contexto: a rev. 2.3 §8 declara a taxonomia de origem pré-requisito da V0 ("a V0 não começa sem…"), mas tudo no protótipo é texto estático; a Consolidação deixou o serviço "a decidir" (Q14 [ABERTA]).
Impacto: sem ela o piloto não mede a métrica-mãe — bloqueia o go-live.
Responsável: Danilo Moura + engenheiro. *(Fontes: Q14 + dossiê F/M14 — deduplicadas.)*

**P56. Todas as janelas de tempo (selo AGORA, estorno de 7 dias, bloqueio de 24h da prova, vigência de matrícula) usarão relógio e fuso do servidor em vez do dispositivo?**
Contexto: o protótipo usa o relógio local para tudo (inclusive prazos com valor econômico); nenhuma decisão fixa a fonte de tempo oficial.
Impacto: requisito transversal de back-end — integridade de todas as regras temporais.
Responsável: engenheiro. *(Fonte: dossiê B/M4, generalizada.)*

**P57. Quem produz e prioriza o catálogo técnico das 23 marcas `[INTEGRAÇÃO REAL]` (24 na auditoria de 30/07; 23 após a dec. 188), separando fronteiras de módulos internos × contratos de integração externa (site/checkout, pagamentos, plataforma de cursos, notificações, telemetria)?**
Contexto: a Consolidação definiu a propriedade dos módulos, mas nenhum contrato de API/payload/dono existe (Q19 [ABERTA], reescopada em 01/08).
Impacto: é o primeiro artefato técnico da construção — bloqueia o planejamento das integrações.
Responsável: engenheiro (Danilo Moura prioriza). *(Fonte: Q19.)*

**P58. Antes de qualquer piloto: os botões de demonstração ([DEMO PROVISÓRIO] de patente, "dia de estudo +275", "liberar nova tentativa") saem — e qual é a política dos ~31 hooks `window.__*` no build de produção?**
Contexto: o próprio código pede a remoção desde 20/07; os hooks são contrato das 56 suítes (dec. 190), mas ficam expostos no build publicado (Q13 [ABERTA] — a parte "versionar suítes" já foi resolvida pela dec. 190).
Impacto: higiene obrigatória pré-piloto (integridade/antifraude do estado do aluno).
Responsável: engenheiro. *(Fontes: Q13 + dossiê C/M7 — deduplicadas.)*

---

## Tabela-resumo

| P# | Tema | Responsável | Bloqueia o quê |
|---|---|---|---|
| P1 | Conta e acesso | Danilo Moura | Módulo de cadastro + integração com checkout |
| P2 | Conta e acesso | Danilo Moura + engenheiro | Escopo do módulo de autenticação |
| P3 | Conta e acesso | Danilo Moura | Fluxo do estado "conta bloqueada" |
| P4 | Conta e acesso | Danilo Moura | Validação/modelo do nome de guerra |
| P5 | Conta e acesso | Danilo Moura | Especificação final da validação do nome de guerra |
| P6 | Conta e acesso | Danilo Moura | Gates de completude do onboarding |
| P7 | Conta e acesso | Danilo Moura | Regra do "refazer tutorial" com progresso persistido |
| P8 | Conta e acesso | Danilo Moura | Moderação de produção do nome de guerra |
| P9 | Conta e acesso | Danilo Moura | Roteiro canônico do onboarding |
| P10 | Conta e acesso | Danilo Moura | Gatilho de exibição do tutorial |
| P11 | Conta e acesso | Danilo Moura | Cadastro/perfil do aluno (graduação) |
| P12 | Economia | Danilo Moura + Vitor França | Modelo econômico/ledger + rev. 2.4 |
| P13 | Economia | Danilo Moura + N.G.E./Jurídico | Corte de escopo do piloto |
| P14 | Economia | Danilo Moura + gestor da economia | Valores finais / parametrização econômica |
| P15 | Economia | Danilo Moura | Modelo de temporadas e pós-jogo (Prestígio) |
| P16 | Economia | Danilo Moura | Serviço de ranking geral |
| P17 | Economia | Danilo Moura | Escopo do módulo de gift cards |
| P18 | Economia | Danilo Moura | Emissão real/antifraude/contabilidade do gift |
| P19 | Economia | Danilo Moura + financeiro | Fluxo financeiro do estorno em Dmn |
| P20 | Economia | Danilo Moura | Regras de negócio do módulo de estornos |
| P21 | Economia | Danilo Moura / engenheiro | Estorno × mochila (correção do defeito) |
| P22 | Economia | Danilo Moura | Matriz produto × moeda do catálogo |
| P23 | Economia | Danilo Moura | Motor de vagas por moeda |
| P24 | Turmas e cronograma | Danilo Moura | Regra de limite de matrículas |
| P25 | Turmas e cronograma | Danilo Moura | Ciclo de vida/renovação da matrícula |
| P26 | Turmas e cronograma | Danilo Moura | Comportamento da turma ativa na expiração |
| P27 | Turmas e cronograma | Danilo Moura | Arquivamento/histórico da turma encerrada |
| P28 | Turmas e cronograma | Danilo Moura + engenheiro | Fonte única do cronograma (Sheets × módulo) |
| P29 | Turmas e cronograma | Danilo Moura | Visibilidade de avisos (ativa × todas) |
| P30 | Turmas e cronograma | Danilo Moura | Agendador do pipeline de missões |
| P31 | Turmas e cronograma | Danilo Moura | Ciclo semanal do motor de missões |
| P32 | Turmas e cronograma | Danilo Moura | Política de atrasadas (destino e prêmio) |
| P33 | Eventos e simulados | Danilo Moura | Crédito de presença/participação em eventos |
| P34 | Eventos e simulados | Danilo Moura | Estorno no cancelamento de evento pago |
| P35 | Eventos e simulados | Danilo Moura | Modelo de espaços/lotação de eventos |
| P36 | Eventos e simulados | Danilo Moura | Modelo de dados dos simulados (vínculo turma/edital) |
| P37 | Eventos e simulados | Danilo Moura | Ranking e correção comentada de simulado |
| P38 | Eventos e simulados | Danilo Moura | Entrada da nota do presencial no histórico |
| P39 | Eventos e simulados | Danilo Moura | Regra de premiação do digital pago |
| P40 | Eventos e simulados | Danilo Moura | Persistência de estado de prova (retomada) |
| P41 | Conteúdo e questões | Danilo Moura | Motor unificado de questões (regra de feedback) |
| P42 | Conteúdo e questões | Danilo Moura | Permissões/fluxo editorial do banco de questões |
| P43 | Conteúdo e questões | Engenheiro + Danilo Moura | Schema do banco de questões (ID, subassunto, versão) |
| P44 | Conteúdo e questões | Danilo Moura | Integração materiais ↔ questões ↔ economia |
| P45 | Pedagógico | Danilo Moura + engenheiro | Motor real de dificuldade/Domínio |
| P46 | Pedagógico | Danilo Moura | Intervenção pedagógica (gatilhos e agentes) |
| P47 | Pedagógico | Danilo Moura / engenheiro | Regra de aprovação da prova de promoção |
| P48 | Pedagógico | Danilo Moura | Papéis do módulo de produção de materiais |
| P49 | Pedagógico | Danilo Moura | Ciclo de vida do material publicado |
| P50 | Pedagógico | Danilo Moura | Corte de escopo do Pré-TAF |
| P51 | Administração | Danilo Moura + engenheiro | RBAC e auditoria da área administrativa |
| P52 | Administração | Danilo Moura | Módulo de presença (fonte do registro) |
| P53 | Administração | Danilo Moura + engenheiro | Parametrização administrável (salas, GAMI) |
| P54 | Técnicas | Engenheiro | IDs estáveis / identidade do professor |
| P55 | Técnicas | Danilo Moura + engenheiro | Telemetria (pré-requisito do piloto) |
| P56 | Técnicas | Engenheiro | Fonte de tempo oficial (servidor/fuso) |
| P57 | Técnicas | Engenheiro | Catálogo de contratos de integração |
| P58 | Técnicas | Engenheiro | Higiene pré-piloto (demos e hooks) |

---

## Rodapé — descartadas por já terem resposta

1. **"O simulado digital deve mesmo premiar QdC por acerto (exceção ao princípio)?"** (dossiê B/M6) — Sim: dec. 117b/122/123 fixam a exceção de propósito ("só o digital pode ser gratuito, premiando QdC por acerto") e a dec. 125 fez o campo de prêmio valer; só os **valores** dependem do estudo econômico (P14).
2. **"A lista de conferência em PDF deve sair com os nomes reais dos inscritos?"** (dossiê E/M11) — Sim, por construção: a dec. 169 define a lista como conferência dos inscritos; os nomes sintéticos são limitação da simulação local, não regra de produto.
3. **"Unificar as ATIVIDADES fixas com os eventos vivos nas Liberações?"** (dossiê F/M16) — Já decidido: dec. 80/180 mandam Liberações/Relatórios lerem dados vivos sincronizados; as `ATIVIDADES` fixas são semente de demonstração que não existirá no sistema real.
4. **"Os 3 cards fixos de 'Curso online' passam a nascer do cadastro?"** (dossiê D/M8) — Sim: dec. 95/118 fazem de "Cadastrar produto ou serviço" a porta única de entrada do digital; os cards fixos são semente da demo.
5. **Q1 — "O mascote é QUAD em tudo?"** (auditoria) — Respondida pela dec. 17: o mascote é QUAD; os resíduos "Danilo" (card interno, assets) são correção pendente, não dúvida de produto. *Discordância registrada: a auditoria/10 mantém Q1 [ABERTA]; este pacote a considera respondida pela dec. 17, restando a tarefa de renomeação de assets (nota abaixo, Q2).*
6. **"Versionar as suítes Playwright"** (parte da Q13) — Executado: dec. 190 versionou as 56 suítes em `tests/` com `verify.py` como portão de aceite oficial.
7. **"Drop aleatório/itens raros entram na V2?"** (dossiê F/M17) — Coberto pela dec. 184: sem especificação = "Módulo Planejado" (junto de Quests/forja) — nada a construir até o gestor especificar.
8. **"Qual provedor de push e quais eventos disparam?"** (dossiê F/M17) — Coberto pelas dec. 182/184: notificações seguem sistema externo com integração "a definir" — entra no catálogo de integrações (P57), não como pergunta própria.
9. **"Biometria segue no escopo?"** (dossiê F/M17) — Coberto pelas dec. 188/184: o fluxo de autorização de dispositivo foi removido e biometria só existe em texto histórico — fora do escopo até nova decisão do gestor.

**Nota — fora do filtro (não bloqueiam a construção; higiene do protótipo, recomendadas como tarefas e não como perguntas):** renomear assets/ids `danilo*` → `quad*` (Q2); renomear `var score` (moeda) → `qdc` (Q6); sanear a numeração duplicada 126–129 e a ordenação do registro de decisões (Q20).

---

*Documento gerado em 02/08/2026 a partir do handoff de investigação. Nenhuma pergunta dos dossiês foi apagada: cada uma está aqui (P1–P58, com deduplicação indicada), no rodapé de descartadas com a resposta, ou na nota de itens fora do filtro.*
