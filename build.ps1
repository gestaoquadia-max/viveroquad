# Build do protótipo Viver o Quad
# - monta o fonte concatenando as partes de src/ (NN-*.html, na ordem do prefixo)
# - substitui os tokens __*__ pelas mídias em base64 (com validação: falha se um token faltar)
# - gera artifact.html (conteúdo publicado no Artifact) e index.html (abre com clique duplo)
$dir = $PSScriptRoot
$partes = Get-ChildItem (Join-Path $dir "src") -Filter "??-*.html" | Sort-Object Name
if ($partes.Count -ne 20) { throw "esperava 20 partes em src/, achei $($partes.Count)" }
$src = ($partes | ForEach-Object { [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8) }) -join ""
$vid = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "danilo.mp4")))
$logo = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "logo.jpg")))
$sim = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "simbolo-quad-transparente.png")))
$dspr = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "danilo-sprite.png")))
$avs = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "avatars.jpg")))
$ins = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "insignias.jpg")))
$coin = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "quad-coin.webp")))
$dmn = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "diamante.webp")))
$fonts = [System.IO.File]::ReadAllText((Join-Path $dir "fonts.css"), [System.Text.Encoding]::UTF8)
# fotos por variante do personagem (fotos/<variante>-<índice>.webp)
function Fotos-Variante($prefixo) {
  $itens = @()
  Get-ChildItem (Join-Path $dir "fotos") -Filter "$prefixo-*.webp" | Sort-Object Name | ForEach-Object {
    if ($_.BaseName -match "^$prefixo-(\d+)$") {
      $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($_.FullName))
      $itens += ('{0}: "data:image/webp;base64,{1}"' -f $Matches[1], $b64)
    }
  }
  return '{ ' + ($itens -join ', ') + ' }'
}
$variantes = @("boina", "gandola", "colete", "fuzil", "cipe", "patamo", "bope")
$fotosVar = '{ ' + (($variantes | ForEach-Object { '{0}: {1}' -f $_, (Fotos-Variante $_) }) -join ', ') + ' }'
$rep = [ordered]@{
  "__FONTS__" = $fonts
  "__DANILO_VIDEO__" = "data:video/mp4;base64," + $vid
  "__DANILO_SPRITE__" = "data:image/png;base64," + $dspr
  "__QUAD_LOGO__" = "data:image/jpeg;base64," + $logo
  "__QUAD_SIMBOLO__" = "data:image/png;base64," + $sim
  "__AVATARS__" = "data:image/jpeg;base64," + $avs
  "__INSIGNIAS__" = "data:image/jpeg;base64," + $ins
  "__QUAD_COIN__" = "data:image/webp;base64," + $coin
  "__DIAMANTE__" = "data:image/webp;base64," + $dmn
  "__FOTOS_VARIANTES__" = $fotosVar
}
# dados demonstrativos (data/*.js): fragmentos JS verbatim injetados nos tokens __SEED_*__
Get-ChildItem (Join-Path $dir "data") -Filter "*.js" | Sort-Object Name | ForEach-Object {
  $tok = "__SEED_" + ($_.BaseName.ToUpper() -replace '-','_') + "__"
  $rep[$tok] = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
}
$out = $src
foreach ($k in $rep.Keys) {
  if (-not $out.Contains($k)) { throw "token ausente no fonte: $k" }
  $out = $out.Replace($k, $rep[$k])
}
foreach ($k in $rep.Keys) {
  if ($out.Contains($k)) { throw "sobrou token nao substituido: $k" }
}
$enc = New-Object System.Text.UTF8Encoding $false
# artifact.html: conteúdo sem esqueleto (o Artifact adiciona doctype/head/body ao publicar)
[System.IO.File]::WriteAllText((Join-Path $dir "artifact.html"), $out, $enc)
$page = "<!DOCTYPE html>`n<html lang=""pt-BR"">`n<head>`n<meta charset=""utf-8"">`n<meta name=""viewport"" content=""width=device-width, initial-scale=1"">`n" + $out + "`n</html>"
[System.IO.File]::WriteAllText((Join-Path $dir "index.html"), $page, $enc)
"build ok: index.html " + [math]::Round((Get-Item (Join-Path $dir "index.html")).Length/1MB, 2) + " MB"
