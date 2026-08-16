/* MERCADO INTERNO (dec. 216) — as lojas que outros alunos abriram para
   vender itens da própria mochila. Comércio entre alunos é SEMPRE em Quad
   Coins: Diamante é moeda de recarga do site e não circula aqui.
   Na plataforma real esta lista vem do servidor [INTEGRAÇÃO REAL];
   aqui são vitrines de demonstração.                                   */
var LOJAS_DEMO = [
  { id: 'lj1', nome: 'Arsenal do Barros', dono: 'SGT QUAD Barros', lema: 'equipamento de campo, sem enrolação',
    aberta: true, itens: [
      { item: 'faca', qtd: 6, preco: 52 },
      { item: 'lanterna', qtd: 2, preco: 41 },
      { item: 'corda', qtd: 4, preco: 28 }
    ] },
  { id: 'lj2', nome: 'Posto Avançado Peixoto', dono: 'AL SGT QUAD Peixoto', lema: 'insumo de quest é comigo',
    aberta: true, itens: [
      { item: 'liga', qtd: 20, preco: 14 },
      { item: 'pneu', qtd: 2, preco: 46 },
      { item: 'cantil', qtd: 3, preco: 22 }
    ] },
  { id: 'lj3', nome: 'Bazar da Fontes', dono: 'CB QUAD Fontes', lema: 'raridades que ninguém acha',
    aberta: true, itens: [
      { item: 'patch-sorte', qtd: 2, preco: 180 },
      { item: 'geo', qtd: 2, preco: 130 },
      { item: 'bussola', qtd: 4, preco: 37 }
    ] },
  { id: 'lj4', nome: 'Depósito do Torres', dono: 'AL CB QUAD Torres', lema: 'volto a abrir na semana que vem',
    aberta: false, itens: [
      { item: 'broche', qtd: 5, preco: 30 }
    ] }
];
