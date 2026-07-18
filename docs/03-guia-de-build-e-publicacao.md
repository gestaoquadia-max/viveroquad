# Guia de Build e Publicação — Viver o Quad

## Arquivos

| Arquivo | Papel |
|---|---|
| `src.html` | **Fonte editável** (~70 KB). Contém tokens `__DANILO_VIDEO__`, `__QUAD_LOGO__` e `__AVATARS__` no lugar das mídias. |
| `danilo.mp4` | Vídeo 3D do mascote (2,5 MB, 10 s, 1280×720) |
| `logo.jpg` | Logo oficial Quad (900×900) |
| `avatars.jpg` | Sprite 1400×1400 com os 12 avatares da PM |
| `build.ps1` | Script de build |
| `index.html` | Saída: protótipo completo autocontido (~4 MB). **Não editar; não versionar.** |
| `artifact.html` | Saída: mesmo conteúdo sem o esqueleto `<html>` — é o que se publica no Artefato |

## Build

```powershell
& ".\build.ps1"
```

O script lê `src.html`, converte as três mídias em data URI, substitui os tokens
e grava `index.html` (abre com clique duplo) e `artifact.html`.

## Publicação no Artefato (obrigatória a cada alteração)

O protótipo vive em:
`https://claude.ai/code/artifact/4d06ad26-be6f-41c3-a5df-e08ea41230fa`

Fluxo (executado pelo Claude na sessão de trabalho):
1. Editar `src.html`
2. Rodar `build.ps1`
3. Verificar no navegador local
4. **Publicar `artifact.html` com a tool Artifact**, passando a URL acima
   (sem isso o link público fica desatualizado — erro já cometido e corrigido
   em 14/07; nunca repetir)

## Hospedar no GitHub (quando decidir)

O repositório Git local já está pronto (branch `main`). Para enviar:

1. Crie um repositório **privado** e vazio em github.com (New repository, sem
   README nem .gitignore — já temos os nossos)
2. No PowerShell, dentro desta pasta:
   ```powershell
   git remote add origin https://github.com/CONTA/NOME-DO-REPO.git
   git push -u origin main
   ```
3. No primeiro push, o Windows abre a janela de login do GitHub — autorize e
   pronto. Dali em diante, cada atualização sobe com `git push`.

## Detalhes técnicos do protótipo

- **Sprite de avatares**: recortes por frações — colunas `[0.1535, 0.3745,
  0.6135, 0.8425]`, linhas `[0.1975, 0.50, 0.80]`, raio `0.104` da largura
- **Scroll infinito**: cada tela de cartões é triplicada em `.loop-seg`;
  o scroll salta um período ao se aproximar das bordas; interações em clones
  são mapeadas por índice para o original e sincronizadas via `queueSync()`
- **Engrenagem**: `spotlight()` aplica `rotateX` proporcional à distância do
  centro em cada `.p-card`
- **Tour**: pausa o loop (`tourOn`) para o holofote mirar os elementos originais
- **Reduzir movimento**: honrado — animações desligam, logo/vinheta aparecem
  estáticas, vídeos pausam no 1º frame
