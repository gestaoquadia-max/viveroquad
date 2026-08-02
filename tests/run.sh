#!/bin/sh
# Roda as suítes de regressão do protótipo Viver o Quad.
#   ./run.sh                 → todas as suítes (v*.mjs)
#   ./run.sh vtut vloja      → só as citadas
# Requisitos (ajustáveis por variável de ambiente):
#   VQ_NODE    node 20+            (padrão: /opt/node22/bin/node)
#   VQ_PW      playwright (módulo) (padrão: /opt/node22/lib/node_modules/playwright/index.js)
#   VQ_CHROME  binário do Chromium (padrão: /opt/pw-browsers/chromium-1194/chrome-linux/chrome)
# O index.html deve existir na raiz do repositório (rode o build antes).
cd "$(dirname "$0")" || exit 1
NODE="${VQ_NODE:-/opt/node22/bin/node}"
mkdir -p _out
if [ $# -gt 0 ]; then LISTA="$*"; else LISTA=$(ls v*.mjs | sed 's/\.mjs$//'); fi
falhas=0; total=0
for s in $LISTA; do
  total=$((total+1))
  printf '%s :: ' "$s"
  bruto=$(timeout 200 "$NODE" "$s.mjs" 2>&1); rc=$?
  printf '%s\n' "$(printf '%s' "$bruto" | grep -Ei "falhas|erros|ok /|-OK|^ok$" | tail -2 | tr '\n' ' ')"
  # falhou se: código de saída ≠ 0, saída vazia, "N falhas" com N>0,
  # "FALHAS:" sem "NENHUMA", ou linha de erros que não seja "nenhum"
  ruim=0
  [ $rc -ne 0 ] && ruim=1
  [ -z "$bruto" ] && ruim=1
  printf '%s' "$bruto" | grep -Eq "[1-9][0-9]* falhas" && ruim=1
  printf '%s' "$bruto" | grep -q "FALHAS:" && { printf '%s' "$bruto" | grep -q "FALHAS: NENHUMA" || ruim=1; }
  printf '%s' "$bruto" | grep -qi "erros js:" && { printf '%s' "$bruto" | grep -qi "erros js: nenhum" || ruim=1; }
  printf '%s' "$bruto" | grep -q "erros:" && { printf '%s' "$bruto" | grep -q "erros: nenhum" || ruim=1; }
  [ $ruim -ne 0 ] && falhas=$((falhas+1))
done
echo "== $total suítes · $falhas com falha =="
[ "$falhas" -eq 0 ]
