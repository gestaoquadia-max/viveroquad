# Viver o Quad — Protótipo V0 (Prova de Vida)

Aplicativo da jornada do aluno Quad Concursos — do primeiro contato ao dia da farda.
Este repositório contém o **protótipo navegável da V0**, a documentação do projeto
e o material de marca usado na construção.

> Documento-base: *Viver o Quad — Relatório de Projeto rev. 2.3* (Danilo Moura,
> julho/2026) — em [`docs/Viver-o-Quad-Relatorio-rev2-3.pdf`](docs/Viver-o-Quad-Relatorio-rev2-3.pdf)

## Acesso rápido

| O quê | Onde |
|---|---|
| Protótipo online (sempre atualizado) | https://claude.ai/code/artifact/4d06ad26-be6f-41c3-a5df-e08ea41230fa |
| Protótipo local | `index.html` (gerado pelo build — rode `build.ps1` após clonar) |
| Fonte editável | `src.html` |
| Visão e escopo | [`docs/01-visao-e-escopo.md`](docs/01-visao-e-escopo.md) |
| Registro de decisões | [`docs/02-registro-de-decisoes.md`](docs/02-registro-de-decisoes.md) |
| Guia de build e publicação | [`docs/03-guia-de-build-e-publicacao.md`](docs/03-guia-de-build-e-publicacao.md) |
| Histórico de versões | [`CHANGELOG.md`](CHANGELOG.md) |

## Estrutura do repositório

```
Viver o Quad/
├── src.html          ← FONTE do protótipo (edite sempre aqui)
├── build.ps1         ← gera o index.html (embute vídeo, logo e avatares)
├── logo.jpg          ← logo oficial Quad (Q em três azuis)
├── danilo.mp4        ← vídeo 3D do mascote Danilo (loop de 10s)
├── avatars.jpg       ← sprite da coleção de avatares da PM (12 opções)
├── docs/             ← documentação do projeto
├── CHANGELOG.md      ← histórico de versões
└── index.html        ← SAÍDA do build (não versionada — regenere localmente)
```

## Como trabalhar

1. **Editar**: toda alteração é feita em `src.html` (nunca no `index.html`).
2. **Buildar**: rode `build.ps1` (clique direito → Executar com PowerShell). Ele
   embute os arquivos de mídia como data URI e gera `index.html` (~4 MB) e
   `artifact.html` (versão para publicação).
3. **Publicar**: o Artefato no claude.ai deve ser republicado a **cada** alteração
   — regra inegociável do projeto. Detalhes no
   [guia de build](docs/03-guia-de-build-e-publicacao.md).

## O que o protótipo cobre (escopo V0)

- **Fluxo de entrada**: login (e-mail + senha) → vinheta "Comece seu sonho por
  aqui..." com barra de carregamento → portão "Já sou aluno" (validação por
  código de e-mail) / "Minha primeira vez" (cadastro com preenchimento
  automático da plataforma-base)
- **Tour obrigatório do Danilo** no 1º acesso: 9 passos com holofote em cada
  ícone e botões Anterior/Próximo; a plataforma só libera após concluir
- **3 perfis**: Aluno, Professor (quiz ao vivo com polling) e Administrador
  N.P.P. (Turma = Edital × Modalidade, árvore do edital, banco de questões)
- **Aluno**: identidade de combate (nome de guerra + avatar da coleção PM, com o
  nome estampado na farda), Quad Coins de participação, missões 10+10 com
  expiração, quiz sem feedback imediato, garimpo de Coins em eventos
- **Botão "+"**: Perfil do aluno, Pré-TAF (marcas vs. metas do edital),
  Calendário e Materiais das aulas; prévias bloqueadas de V1 (Quadcoin,
  geofencing) e V2 (chat, guarnições)
- **Quadrômetro**: a jornada do aluno em números
- **Danilo, o guia**: mascote em vídeo, botão flutuante com orientações por tela
- **Engrenagem**: cartões giram em 3D na rolagem, com scroll infinito
  (fim liga com o início) e destaque no bloco central

## Padrão visual

Tema azul e branco da marca: acento `#1B7FC4` sobre fundo `#EAF3FB`, cartões
brancos, tipografia de aplicativo (Inter/Roboto/SF Pro, fallback Segoe UI).

## Governança

O projeto é conduzido por **Danilo Moura (Fundador)**. Divergências em relação ao
documento-base rev. 2.3 estão registradas no
[registro de decisões](docs/02-registro-de-decisoes.md).
