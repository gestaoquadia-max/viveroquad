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

## Regras de trabalho vigentes

- Editar sempre `src.html`; `index.html` é saída de build
- **Republicar o Artefato a cada alteração** — regra inegociável
- Padrão visual azul/branco da marca; nunca criar temas próprios
- Textos inseridos pelo gestor geram perguntas de esclarecimento; toda entrega
  abre com resumo do entendimento
