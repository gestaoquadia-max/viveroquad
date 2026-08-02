# Viver o Quad — Protótipo V0 (Prova de Vida)

Aplicativo da jornada do aluno Quad Concursos — do primeiro contato ao dia da farda.
Este repositório contém o **protótipo navegável da V0**, a documentação do projeto
e o material de marca usado na construção.

> Documento-base: *Viver o Quad — Relatório de Projeto rev. 2.3* (Danilo Moura,
> julho/2026) — em [`docs/Viver-o-Quad-Relatorio-rev2-3.pdf`](docs/Viver-o-Quad-Relatorio-rev2-3.pdf)

> **Consolidação Arquitetural v1.0 (01/08/2026):** o Viver o Quad passou a ser
> **a plataforma principal do Quad Concursos** — onze capacidades antes previstas
> como sistemas externos viraram módulos internos (mudança exclusivamente
> arquitetural; nada foi implementado). Documento oficial:
> [`docs/arquitetura/00-arquitetura-oficial.md`](docs/arquitetura/00-arquitetura-oficial.md).

## Acesso rápido

| O quê | Onde |
|---|---|
| **Comece aqui (guia do Danilo)** | [`docs/00-comece-aqui-danilo.md`](docs/00-comece-aqui-danilo.md) |
| Protótipo online (sempre atualizado) | https://claude.ai/code/artifact/945e81a8-9ca3-4d55-9169-c4fc9f6f3703 |
| Protótipo local | `index.html` (gerado pelo build — rode `build.py` ou `build.ps1` após clonar) |
| Fonte editável | `src/` (20 partes — ver [`src/README.md`](src/README.md)) |
| **Arquitetura oficial (Consolidação v1.0)** | [`docs/arquitetura/00-arquitetura-oficial.md`](docs/arquitetura/00-arquitetura-oficial.md) |
| Auditoria do protótipo (30/07/2026) | [`docs/auditoria/README.md`](docs/auditoria/README.md) |
| Visão e escopo | [`docs/01-visao-e-escopo.md`](docs/01-visao-e-escopo.md) |
| Registro de decisões | [`docs/02-registro-de-decisoes.md`](docs/02-registro-de-decisoes.md) |
| Guia de build e publicação | [`docs/03-guia-de-build-e-publicacao.md`](docs/03-guia-de-build-e-publicacao.md) |
| Histórico de versões | [`CHANGELOG.md`](CHANGELOG.md) |

## Estrutura do repositório

```
viveroquad/
├── src/                            ← FONTE do protótipo em 20 partes (01-…20-…)
│   └── README.md                   ← tabela das partes e regras de edição
├── data/                           ← dados demonstrativos (19 fragmentos __SEED_*__)
│   └── README.md                   ← o que é cada conjunto e as relações entre eles
├── tests/                          ← 56 suítes de regressão Playwright (rede de segurança)
│   ├── run.sh                      ← roda as suítes (./run.sh [suíte…])
│   └── README.md                   ← requisitos e regras de manutenção
├── verify.py                       ← portão de verificação: build + regressão completa
├── build.py                        ← build portátil (Python) — gera index.html e artifact.html
├── build.ps1                       ← build no Windows (PowerShell) — mesmas validações
├── fonts.css                       ← fontes embutidas (token __FONTS__)
├── logo.jpg                        ← logo oficial Quad (Q em três azuis)
├── simbolo-quad-transparente.png   ← símbolo Quad (vinheta, portões, login)
├── danilo.mp4                      ← vídeo 3D do mascote QUAD (loop de 10 s)
├── danilo-sprite.png               ← sprite do mascote QUAD (botão flutuante)
├── avatars.jpg                     ← sprite da coleção de avatares da PM (12 opções)
├── insignias.jpg                   ← sprite das insígnias
├── quad-coin.webp                  ← moeda Quad Coin
├── diamante.webp                   ← moeda Diamante
├── fotos/                          ← 84 fotos do personagem por variante (.webp)
├── docs/                           ← documentação do projeto
│   ├── arquitetura/                ← Consolidação Arquitetural v1.0 (01/08/2026)
│   └── auditoria/                  ← auditoria do protótipo (30/07/2026, 14 docs)
├── CHANGELOG.md                    ← histórico de versões
├── index.html                      ← SAÍDA do build (não versionada — regenere localmente)
└── artifact.html                   ← SAÍDA do build (versão publicada no Artefato)
```

Os arquivos do mascote chamam-se `danilo.*` por razão histórica — o guia do app
é o **QUAD** (ver o guia do Danilo).

## Como trabalhar

1. **Editar**: toda alteração é feita nas partes de `src/` (nunca no
   `index.html`/`artifact.html`, que são saída de build). Leia as regras em
   [`src/README.md`](src/README.md) antes de mexer.
2. **Buildar**: rode `python3 build.py` (qualquer sistema com Python) **ou**
   `build.ps1` (clique direito → Executar com PowerShell). O build concatena as
   20 partes, injeta os dados demonstrativos de `data/`, valida os tokens,
   embute as mídias como data URI e gera `index.html` (~9,4 MB) e
   `artifact.html` (versão para publicação).
3. **Verificar**: `python3 verify.py` roda o build e as **56 suítes de
   regressão** de `tests/` — nenhuma mudança é boa sem a regressão verde.
4. **Publicar**: o Artefato no claude.ai deve ser republicado a **cada** alteração
   — regra inegociável do projeto. Detalhes no
   [guia de build](docs/03-guia-de-build-e-publicacao.md).

## O que o protótipo cobre (escopo V0)

Tudo abaixo é **demonstração — simulação 100% local no navegador**, sem servidor.

- **Fluxo de entrada**: login (e-mail + senha) → vinheta "Comece seu sonho por
  aqui..." com a verificação de matrícula encenada → app. O link "Criar conta"
  mostra o portão **"Cadastro no site do Quad"** — demonstração mantida de uma
  decisão **revogada** na Consolidação v1.0 (o cadastro passou à arquitetura do
  app; o fluxo novo ainda não foi especificado nem implementado)
- **Tutorial obrigatório do QUAD** no 1º acesso: o mascote circula pela tela
  com holofote nos elementos, e a plataforma só libera ao concluir (ou pular)
- **3 perfis**: Aluno, Professor (quiz ao vivo com polling) e Administrador
  N.P.P. (Turma = Edital × Modalidade, árvore do edital, banco de questões)
- **Aluno**: identidade de combate (nome de guerra + avatar da coleção PM, com o
  nome estampado na farda), Quad Coins de participação, missões/flashcards em
  blocos por turno (com expiração em 7 dias), quiz sem feedback imediato,
  garimpo de Coins em eventos
- **Loja**: compras com Quad Coins e Diamantes, gift cards, mochila e skins —
  as **regras econômicas seguem indefinidas** (registradas, não estudadas)
- **Botão "+"**: Quadrômetro (a jornada do aluno em números), Calendário e
  Materiais das aulas; prévias bloqueadas (Chat ao vivo, Guarnições GvG/PvP,
  Pré-TAF)
- **QUAD, o guia**: mascote em vídeo, botão flutuante com orientações por tela
- **Engrenagem**: cartões giram em 3D na rolagem, com scroll infinito
  (fim liga com o início) e destaque no bloco central

## Padrão visual

Tema azul e branco da marca — valores conferidos no CSS do fonte (`src/01-css-base.html`):
acento `#1B7FC4` (variável `--gold`) sobre fundo claro `#F3F9FE` (`--bg`; tema
escuro `#0B1E30`), cartões brancos, tipografia de aplicativo (Inter/Exo 2/SF Pro,
fallback Segoe UI). Elementos do redesign gamificado (`src/02`) usam ainda azuis
de destaque como `#0878F8` e `#062B64`.

## Governança

O projeto é conduzido por **Danilo Moura (Fundador)**. O documento arquitetural
oficial é a [Consolidação v1.0](docs/arquitetura/00-arquitetura-oficial.md)
(01/08/2026); divergências em relação ao documento-base rev. 2.3 estão
registradas no [registro de decisões](docs/02-registro-de-decisoes.md).
