# Build do protótipo Viver o Quad
# - lê src.html (fonte, com o token __DANILO_VIDEO__ no lugar do vídeo)
# - embute danilo.mp4 como data URI
# - gera index.html (abre com clique duplo; mesmo conteúdo publicado no artefato)
$dir = $PSScriptRoot
$src = [System.IO.File]::ReadAllText((Join-Path $dir "src.html"), [System.Text.Encoding]::UTF8)
$vid = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "danilo.mp4")))
$logo = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "logo.jpg")))
$sim = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "simbolo-quad-transparente.png")))
$dimg = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "danilo-static.png")))
$avs = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $dir "avatars.jpg")))
$fonts = [System.IO.File]::ReadAllText((Join-Path $dir "fonts.css"), [System.Text.Encoding]::UTF8)
$out = $src.Replace("__FONTS__", $fonts).Replace("__DANILO_VIDEO__", "data:video/mp4;base64," + $vid).Replace("__DANILO_IMG__", "data:image/png;base64," + $dimg).Replace("__QUAD_LOGO__", "data:image/jpeg;base64," + $logo).Replace("__QUAD_SIMBOLO__", "data:image/png;base64," + $sim).Replace("__AVATARS__", "data:image/jpeg;base64," + $avs)
$enc = New-Object System.Text.UTF8Encoding $false
# artifact.html: conteúdo sem esqueleto (o Artifact adiciona doctype/head/body ao publicar)
[System.IO.File]::WriteAllText((Join-Path $dir "artifact.html"), $out, $enc)
$page = "<!DOCTYPE html>`n<html lang=""pt-BR"">`n<head>`n<meta charset=""utf-8"">`n<meta name=""viewport"" content=""width=device-width, initial-scale=1"">`n" + $out + "`n</html>"
[System.IO.File]::WriteAllText((Join-Path $dir "index.html"), $page, $enc)
"build ok: index.html " + [math]::Round((Get-Item (Join-Path $dir "index.html")).Length/1MB, 2) + " MB"
