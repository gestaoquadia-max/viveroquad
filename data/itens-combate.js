var ITENS_COMBATE = [
    { id: 'faca',     nome: 'Faca tática',        desc: 'utilitário de campo', preco: 40 },
    { id: 'lanterna', nome: 'Lanterna tática',    desc: 'operações noturnas',  preco: 35 },
    { id: 'bussola',  nome: 'Bússola de campanha',desc: 'orientação em campo', preco: 30 },
    { id: 'broche',   nome: 'Broche de mérito',   desc: 'condecoração',        preco: 25 },
    { id: 'cantil',   nome: 'Cantil',             desc: 'hidratação em marcha',preco: 20, disp: 'ambos', drop: 10 },
    { id: 'corda',    nome: 'Corda de rapel',     desc: 'transposição',        preco: 45 },
    { id: 'patch-sorte', nome: 'Patch da sorte',  desc: 'insígnia rara',       preco: 0, ico: 'medalha', disp: 'drop', drop: 12 },
    /* insumos da quest do Blindado (dec. 207/209) — NÃO são vendidos: todos
       são CONQUISTADOS no drop, resolvendo os pacotes de 10 questões (um
       item por bloco, dec. 206). Chances por raridade — valores de
       demonstração, ajustáveis quando o gestor definir as regras finais */
    { id: 'liga', nome: 'Liga metálica',  desc: 'matéria-prima de blindagem', preco: 0, disp: 'drop', drop: 30 },
    { id: 'pneu', nome: 'Pneu blindado',  desc: 'rodagem à prova de fogo',    preco: 0, disp: 'drop', drop: 12 },
    { id: 'mag',  nome: 'MAG (7,62 mm)',  desc: 'metralhadora de dotação',    preco: 0, disp: 'drop', drop: 6 },
    { id: 'geo',  nome: 'Sistema de geolocalização', desc: 'rastreio inteligente de frota', preco: 0, disp: 'drop', drop: 4 }
  ];