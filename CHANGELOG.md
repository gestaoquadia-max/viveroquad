# Histórico de versões — Viver o Quad (protótipo)

## 18/07/2026 (tarde) — novo fluxo inicial de acesso (offline-first)
- **Tela inicial** repaginada: pede apenas o e-mail + botão **Acessar o portal** e o
  aviso sobre uso sem internet após o primeiro acesso online
- **Verificação de e-mail** com estado de carregamento e três cenários simulados:
  aluno **ativo** (código por e-mail), **dificuldade** para receber o código e
  **conta não ativada** (leva ao cadastro/primeiro acesso já existente)
- **Entrada alternativa por senha** (só no fluxo online), com "Esqueci minha senha",
  "Usar código por e-mail" e "Trocar e-mail"
- **Dispositivo autorizado** no 1º acesso online (simulado; habilita o modo offline)
- **Abertura sem internet**: tela "Você está offline" com última sincronização,
  "Entrar no modo offline" e "Tentar novamente"
- **Modo offline no app**: banner fixo, missões já carregadas jogáveis com respostas
  "aguardando envio" (salvas no navegador), nova missão e quiz ao vivo bloqueados
- **Retorno da conexão**: estado de sincronização → respostas marcadas como enviadas
  → "Sincronização concluída"
- **Simulador de rede** (indicador ONLINE/OFFLINE na barra de status) e botão
  "Resetar demonstração" no painel lateral. Tudo com dados simulados; sem backend,
  e-mail, biometria ou sincronização reais. Fluxo de cadastro existente preservado.

## 18/07/2026
- Projeto estruturado como repositório Git para armazenamento no GitHub
- Documentação criada: visão e escopo, registro de decisões, guia de build

## 16/07/2026
- Danilo Moura (Fundador) assume o controle do projeto

## 14/07/2026 (tarde)
- Pontuação de participação rebatizada **Quad Coin** em toda a UI (com alerta de
  divergência da rev. 2.3 registrado)
- Efeito **engrenagem**: cartões giram em 3D na rolagem; **scroll infinito**
  (fim liga com o início) nas telas de cartões
- Portão de acesso: "Já sou aluno" (validação por código de e-mail) e "Minha
  primeira vez" (cadastro com preenchimento automático; tela seguinte abre
  carregando, dados chegam campo a campo)
- **Tour obrigatório do Danilo** no 1º acesso (9 passos, holofote, Anterior/Próximo)
- Barra de carregamento na vinheta
- **Perfil do aluno**: nome de guerra, senha e avatar da coleção oficial da PM
  (12 opções, nome estampado na farda); reflexo no Início
- Aba Perfil rebatizada **Quadrômetro**
- Tema **azul e branco** da marca + tipografia de app (Inter/Roboto/SF Pro)
- Logo oficial (arquivo da marca) no login, vinheta e cabeçalho
- Vinheta movida para **após o login**, frase "Comece seu sonho por aqui..."
- Botão **"+"** central: Pré-TAF, Calendário, Materiais + prévias V1/V2 bloqueadas
- Vídeo 3D do **Danilo** no botão flutuante e no popup do guia
- Correção de processo: republicação do Artefato a cada alteração (regra fixada)

## 14/07/2026 (manhã)
- Tela de login (e-mail do curso + senha) com logo animada
- Vinheta com a logo e "Comece sua aprovação aqui..."
- Correção de rumo: padrão visual azul/branco (abandono do tema escuro/dourado)
- Danilo (mascote) vetorizado com popup de orientações contextuais
- Projeto hospedado em `Projetos Quad\Viver o Quad`

## 13/07/2026
- Primeira versão do protótipo a partir do documento-base rev. 2.3:
  3 perfis (aluno/professor/admin), missões, quiz sem feedback imediato,
  minerar pontos, admin por edital, fronteira V0/V1 marcada
- Publicação do Artefato
