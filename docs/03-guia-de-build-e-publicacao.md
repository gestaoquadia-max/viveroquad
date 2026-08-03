# Guia de Build e Publicação — Viver o Quad

## Fluxo em uma linha

**Partes em `src/`** (fonte editável) → **`build.py` ou `build.ps1`** →
**`index.html` + `artifact.html`** (saídas) → **republicar o Artefato**.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/01-…` a `src/20-…` | **Fonte editável** (~760 KB no total, 20 partes contíguas). A concatenação na ordem do prefixo reproduz o documento HTML único. Regras e tabela das partes em [`src/README.md`](../src/README.md). |
| `build.py` | Script de build **portátil** (Python) — funciona em qualquer sistema, com caminhos relativos ao próprio script |
| `build.ps1` | Script de build no Windows (PowerShell) — espelha as mesmas validações |
| `fonts.css` | Fontes embutidas (token `__FONTS__`) |
| `danilo.mp4` / `danilo-sprite.png` | Vídeo 3D e sprite do mascote QUAD (assets com nome histórico "danilo") |
| `logo.jpg` / `simbolo-quad-transparente.png` | Logo e símbolo oficiais Quad |
| `avatars.jpg` / `insignias.jpg` | Sprites dos 12 avatares da PM e das insígnias |
| `quad-coin.webp` / `diamante.webp` | Ícones das moedas |
| `fotos/` | 84 fotos do personagem (`<variante>-<n>.webp`, 7 variantes) |
| `index.html` | Saída: protótipo completo autocontido (~9,4 MB). **Nunca editar; não versionar.** |
| `artifact.html` | Saída: mesmo conteúdo sem o esqueleto `<html>` — é o que se publica no Artefato. **Nunca editar; não versionar.** |

## Os 10 tokens de build

Cada token ocupa uma linha própria no fonte e é substituído pela mídia em
base64 (ou pelo texto, no caso das fontes):

| Token | Origem |
|---|---|
| `__FONTS__` | `fonts.css` (texto CSS) |
| `__DANILO_VIDEO__` | `danilo.mp4` |
| `__DANILO_SPRITE__` | `danilo-sprite.png` |
| `__QUAD_LOGO__` | `logo.jpg` |
| `__QUAD_SIMBOLO__` | `simbolo-quad-transparente.png` |
| `__AVATARS__` | `avatars.jpg` |
| `__INSIGNIAS__` | `insignias.jpg` |
| `__QUAD_COIN__` | `quad-coin.webp` |
| `__DIAMANTE__` | `diamante.webp` |
| `__FOTOS_VARIANTES__` | `fotos/` — objeto JS por variante (boina, gandola, colete, fuzil, cipe, patamo, bope) |
| `__SEED_*__` (19 tokens) | `data/*.js` — dados demonstrativos como fragmentos JS verbatim (ver [`data/README.md`](../data/README.md)) |

## Build

Em qualquer sistema com Python:

```bash
python3 build.py
```

Ou, no Windows:

```powershell
& ".\build.ps1"
```

Os dois scripts fazem o mesmo:

1. Concatenam as 20 partes de `src/` na ordem do prefixo, **sem acrescentar
   nem remover um byte**;
2. Substituem os 10 tokens de mídia e injetam os 19 fragmentos de dados
   demonstrativos de `data/` (tokens `__SEED_*__`);
3. Validam que nenhum token faltou **nem sobrou**;
4. Gravam `artifact.html` (conteúdo publicado) e `index.html` (com o
   esqueleto `<html>` — abre com clique duplo).

Depois do build, `python3 verify.py` roda a **regressão completa** (58 suítes
Playwright em [`tests/`](../tests/README.md)) — o portão de aceite de qualquer
mudança no fonte.

### Validações (o build falha de propósito se…)

- `src/` não tiver **exatamente 20 partes** `NN-*.html`;
- algum **token esperado estiver ausente** do fonte concatenado;
- **sobrar token** não substituído na saída.

Se o build falhar, a causa é uma parte renomeada/apagada ou um token quebrado
em edição — corrija o fonte; nunca "conserte" a saída à mão.

## Regra de ouro

**Nunca edite `index.html` ou `artifact.html`.** Eles são saída de build e
qualquer edição é perdida no build seguinte. Toda alteração é feita nas
partes de `src/` — e leia antes as regras de [`src/README.md`](../src/README.md)
(as partes não são HTML válido isoladamente; não rode formatador nelas).

## Publicação no Artefato (obrigatória a cada alteração)

O protótipo vive em:
`https://claude.ai/code/artifact/945e81a8-9ca3-4d55-9169-c4fc9f6f3703`

Fluxo (executado pelo Claude na sessão de trabalho):
1. Editar as partes em `src/`
2. Rodar `build.py` (ou `build.ps1`)
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

- **Sprite de avatares**: grade 6×2 (12 avatares) recortada por frações —
  centros de coluna `[1/12, 3/12, … 11/12]`, linhas `[0.25, 0.75]`, raio
  `1/12` da largura; as fotos por variante (`__FOTOS_VARIANTES__`) mapeiam
  índice do avatar → recorte oficial
- **Scroll infinito**: cada tela de cartões é triplicada em `.loop-seg`;
  o scroll salta um período ao se aproximar das bordas; interações em clones
  são mapeadas por índice para o original e sincronizadas via `queueSync()`
- **Engrenagem**: `spotlight()` aplica `rotateX` proporcional à distância do
  centro em cada `.p-card`
- **Tutorial**: pausa o loop (`tourOn`) para o holofote mirar os elementos
  originais
- **Reduzir movimento**: honrado — animações desligam, logo/vinheta aparecem
  estáticas, vídeos pausam no 1º frame
- **Integração planejada**: o objeto `LINKS_ONLINE` (parte 20) é o ponto de
  integração reservado para links de atividades online — preservado de
  propósito na limpeza de 01/08
