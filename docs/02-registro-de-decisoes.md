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

## Regras de trabalho vigentes

- Editar sempre `src.html`; `index.html` é saída de build
- **Republicar o Artefato a cada alteração** — regra inegociável
- Padrão visual azul/branco da marca; nunca criar temas próprios
- Textos inseridos pelo gestor geram perguntas de esclarecimento; toda entrega
  abre com resumo do entendimento
