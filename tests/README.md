# tests/ — a rede de segurança do protótipo

60 suítes de regressão (Playwright headless) que verificam o comportamento
do protótipo de ponta a ponta — aluno, professor e administrador. Foram
construídas junto com o produto, rodada a rodada, e são o **critério de
aceite oficial** de qualquer mudança: *nenhuma alteração no fonte é boa se
a regressão não fechar verde*.

## Como rodar

```sh
python3 ../build.py     # gera o index.html que as suítes abrem
./run.sh                # todas as suítes  (ou: ./run.sh vtut vloja ...)
```

Na raiz do repositório, `python3 verify.py` faz os dois passos de uma vez.

Requisitos: Node 20+, Playwright e um Chromium. Os caminhos padrão são os
do ambiente de desenvolvimento original e podem ser trocados por variável
de ambiente (`VQ_NODE`, `VQ_PW`, `VQ_CHROME` — ver `run.sh`).

## O que cada família cobre

| Prefixo | Cobre |
|---|---|
| vtut, vfase* | tutorial do QUAD, fases do pacote do aluno (a–h) |
| vf[a-e], vfix*, vg[1-3] | rodadas de ajuste do gestor (regras pontuais) |
| v[h-w]1 | uma suíte formal por rodada de evolução (vu1 = lotação/portaria/públicos; vv1 = drop de itens, status do evento no calendário e compra do tutorial fora do estorno; **vw1** = Decisões Administrativas no protótipo — ledger/extrato da carteira, IDs internos, turma arquivada, perfis administrativos e persistência da evolução; **vx1** = score padrão de 10 em todo evento, recompensa de participação editável pelo admin e o carrossel reduzido a NA LOJA + BÔNUS; **vy1** = fim da rolagem infinita do Início e revisão de 10 questões por subassunto no Domínio; **vz1 = banco por subassunto: pacotes de 10, rotação Pacote 1 → 2 → volta reorganizada pela dificuldade (erradas → difíceis → boas → fáceis), instância própria por subassunto, Reforço de aula/quiz, rodízio alternando matérias e questões temáticas da matéria com embaralho por subassunto — dec. 205; **vz2 = Itens de Quest: construção com insumos da mochila, receita/progresso na Loja, equipar troca a foto e modo "construído por quest" no admin — dec. 207; **vz3 = biblioteca completa de ícones: busca em português sem acento, categorias, escolha nos dois formulários do admin e o emoji rendendo na vitrine/mochila/compra — dec. 210**) |
| vadmin, vinterno, vcontrole, vestrutura | as abas do administrador N.P.P. |
| vloja*, vdmn, vbonus, vmochila, vevento | Quad Store, moedas, mochila, eventos |
| vsim, vprova, vaula | simulados, prova de promoção, aula de hoje (com relógio simulado) |
| vrank, vperfil, vgami, vturma, vtr | rankings, perfil, gamificação, turmas, treinamento |
| demais | login, navegação, calendário, materiais, acessos |

## Regras de manutenção

1. **Suíte quebrou após uma mudança?** Primeiro pergunte se ela mede o
   comportamento vigente. Se a regra mudou por decisão registrada, a
   suíte acompanha (e a decisão é citada no commit). Se não mudou, o
   código regrediu — conserte o código, nunca afrouxe a suíte.
2. **Datas**: suítes que criam turmas/eventos usam datas futuras; ao
   vencerem no calendário real, reancore-as (precedente: dec. 189) —
   **desloque em múltiplos de 7 dias** para preservar o dia da semana, e
   confira: (a) as asserções que citam a data formatada (`DD/MM`), (b) se
   a data nova cai **dentro** do período de alguma turma, o que faz a sala
   passar a ter choque de horário (foi o que aconteceu com a `vloja2` em
   06/08 — resolvido usando a Sala 4, livre à noite).
   As suítes de "aula de hoje" (vaula*) usam relógio simulado e não vencem.
3. As suítes conversam com o protótipo pelos 42 ganchos `window.__*`
   do fonte — eles são contrato estável; não remova sem atualizar aqui.
   Das dec. 192/194 vieram 4: `__dropRng` (RNG determinístico do drop),
   `__dropSortear`, `__calRefresh` e `__estRefresh`. Da dec. 196 vieram
   os 7 mais recentes: `__ledger` (lê os lançamentos da carteira),
   `__ids` (id do aluno e sequência), `__carteira` (saldos),
   `__admPerfil` (lê/troca o perfil administrativo) e o trio da
   persistência `__evolSalvar`, `__evolCarregar` e `__evolMarcar`.
   Para conferir a contagem:
   `grep -o "window\.__[a-zA-Z]*" ../src/*.html | sed 's/.*://' | sort -u | wc -l`.
4. Screenshots e artefatos de execução caem em `_out/` (fora do git).
