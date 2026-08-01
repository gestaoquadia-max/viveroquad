# Comece aqui, Danilo

Bem-vindo ao repositório do **Viver o Quad**. Este guia é o seu ponto de partida
para usar e conduzir o projeto — sem precisar de nada técnico.

Desde 01/08/2026 vale a **Consolidação Arquitetural v1.0** que você determinou:
o Viver o Quad é a plataforma principal do Quad Concursos. O documento oficial
está em `docs/arquitetura/00-arquitetura-oficial.md` — nada mudou no protótipo
por causa disso; a mudança é de arquitetura, não de implementação.

## Ver o protótipo (2 caminhos)

1. **Online** (recomendado): abra
   https://claude.ai/code/artifact/945e81a8-9ca3-4d55-9169-c4fc9f6f3703
   — é sempre a versão mais atual.
2. **No computador**: clique duas vezes no arquivo `index.html` desta pasta.
   (Se ele não existir após clonar o repositório, gere-o com o build: no
   Windows, clique com o botão direito em `build.ps1` → "Executar com
   PowerShell"; em qualquer computador com Python, rode `python3 build.py`.
   Os dois fazem a mesma coisa.)

## Roteiro de demonstração (3 minutos)

1. Entre com qualquer e-mail e senha → vinheta "Comece seu sonho por aqui..."
   com a verificação da matrícula (encenada — nada é consultado de verdade)
2. Repare no link **"Criar conta"** da tela de login: ele mostra o portão
   **"Cadastro no site do Quad"**. Essa tela demonstra a decisão antiga do
   cadastro nascer no site — decisão **revogada** na Consolidação v1.0: o
   cadastro agora pertence à arquitetura do app (módulo Cadastro, planejado).
   O fluxo novo ainda não foi especificado, então o portão continua como
   demonstração até lá.
3. Faça o **tutorial do QUAD** (o robô azul, mascote e guia do app) — ele
   circula pela tela apresentando cada parte, e a plataforma só libera no
   final (ou se você pular)
4. Explore: missões, quiz, Loja, botão **+** (Quadrômetro, Calendário,
   Materiais das aulas) e o perfil com os avatares da PM
5. Role as telas para ver o efeito de engrenagem — e repare que o fim da
   lista emenda no início

> Sobre o mascote: o guia do app chama-se **QUAD**. Os arquivos dele no
> repositório (`danilo.mp4`, `danilo-sprite.png`) mantêm o nome "danilo" por
> razão histórica — é só o nome dos assets, não o do personagem.

## Como trabalhar com o Claude

O projeto é conduzido por você. O combinado com o assistente é:

- **Você guia, ele executa** — pode pedir em linguagem natural, sem termos técnicos
- Ele sempre **resume o que entendeu** antes de ir longe — confira o resumo
- Ele faz **perguntas em etapas** — responda só o que quiser decidir
- Ele **pergunta quem está trabalhando** — identifique-se como Danilo
- Textos que você colar (comunicados, ideias, áudios transcritos) geram
  perguntas de esclarecimento antes de virarem tela
- Toda alteração termina com o **protótipo online republicado** — se o link não
  refletir a mudança, cobre isso

## Onde está cada coisa

| Quero... | Vá em... |
|---|---|
| A arquitetura oficial (Consolidação v1.0) | `docs/arquitetura/00-arquitetura-oficial.md` |
| Entender a visão do app | `docs/01-visao-e-escopo.md` |
| Saber o que já foi decidido | `docs/02-registro-de-decisoes.md` |
| A auditoria completa do protótipo (30/07) | `docs/auditoria/README.md` |
| Ver a história do que mudou | `CHANGELOG.md` |
| O relatório original (rev. 2.3) | `docs/Viver-o-Quad-Relatorio-rev2-3.pdf` |

## Um ponto que pede sua atenção

A pontuação de participação foi rebatizada **"Quad Coin"** na interface — isso
diverge do princípio "Score não é moeda" do Anexo A da rev. 2.3. Está funcionando
assim no protótipo, mas o documento-base precisa da sua palavra final para
realinhar as cinco camadas da economia — que, junto com Diamantes e gift cards,
segue com as **regras econômicas indefinidas** (registradas, não estudadas).
Detalhes na decisão nº 11 do registro.
