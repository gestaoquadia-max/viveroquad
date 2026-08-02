import base64, pathlib

# Build do protótipo Viver o Quad
# - monta o fonte concatenando as partes de src/ (NN-*.html, na ordem do prefixo)
# - substitui os tokens __*__ pelas mídias em base64
# - gera artifact.html (conteúdo publicado no Artifact) e index.html (abre com duplo clique)
root = pathlib.Path(__file__).resolve().parent

partes = sorted((root / 'src').glob('[0-9][0-9]-*.html'))
assert len(partes) == 20, 'esperava 20 partes em src/, achei %d' % len(partes)
src = ''.join(p.read_text(encoding='utf-8') for p in partes)

def b64(p, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode((root/p).read_bytes()).decode())
rep = {
    '__FONTS__': (root/'fonts.css').read_text(encoding='utf-8'),
    '__DANILO_VIDEO__': b64('danilo.mp4', 'video/mp4'),
    '__DANILO_SPRITE__': b64('danilo-sprite.png', 'image/png'),
    '__QUAD_LOGO__': b64('logo.jpg', 'image/jpeg'),
    '__QUAD_SIMBOLO__': b64('simbolo-quad-transparente.png', 'image/png'),
    '__AVATARS__': b64('avatars.jpg', 'image/jpeg'),
    '__INSIGNIAS__': b64('insignias.jpg', 'image/jpeg'),
    '__QUAD_COIN__': b64('quad-coin.webp', 'image/webp'),
    '__DIAMANTE__': b64('diamante.webp', 'image/webp'),
}
# fotos por variante do personagem (fotos/<variante>-<índice>.webp)
import re as _re
VARIANTES = ['boina', 'gandola', 'colete', 'fuzil', 'cipe', 'patamo', 'bope']
def fotos_variante(prefixo):
    itens = []
    for f in sorted((root/'fotos').glob(prefixo + '-*.webp')):
        m = _re.match(prefixo + r'-(\d+)\.webp$', f.name)
        if m:
            itens.append('%s: %r' % (m.group(1), 'data:image/webp;base64,' + base64.b64encode(f.read_bytes()).decode()))
    return '{ ' + ', '.join(itens) + ' }'
rep['__FOTOS_VARIANTES__'] = '{ ' + ', '.join('%s: %s' % (v, fotos_variante(v)) for v in VARIANTES) + ' }'
# dados demonstrativos (data/*.js): fragmentos JS verbatim injetados nos tokens __SEED_*__
for f in sorted((root / 'data').glob('*.js')):
    rep['__SEED_' + f.stem.upper().replace('-', '_') + '__'] = f.read_text(encoding='utf-8')
out = src
for k, v in rep.items():
    assert k in out, 'token ausente: ' + k
    out = out.replace(k, v)
for k in rep:
    assert k not in out, 'sobrou token não substituído: ' + k
(root/'artifact.html').write_text(out, encoding='utf-8')
page = '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' + out + '\n</html>'
(root/'index.html').write_text(page, encoding='utf-8')
print('build ok', len(page))
