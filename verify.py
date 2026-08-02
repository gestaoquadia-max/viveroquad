#!/usr/bin/env python3
"""Portão de verificação do Viver o Quad: build + regressão completa.

Uso:  python3 verify.py            (build + todas as suítes)
      python3 verify.py vtut vloja (build + só as suítes citadas)

Sai com código 0 somente se o build passar e nenhuma suíte falhar.
"""
import pathlib, subprocess, sys

root = pathlib.Path(__file__).resolve().parent

print('== build ==')
r = subprocess.run([sys.executable, str(root / 'build.py')])
if r.returncode != 0:
    sys.exit('build falhou')

print('== regressão ==')
r = subprocess.run(['sh', str(root / 'tests' / 'run.sh'), *sys.argv[1:]])
sys.exit(r.returncode)
