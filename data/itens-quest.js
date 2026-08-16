/* Itens de QUEST (dec. 207) — construídos na Quad Store usando ITENS DA
   MOCHILA como moeda: a receita lista os insumos e as quantidades; a
   construção consome as unidades e entrega o item.
   efeito.tipo:
   · 'foto'     → item equipável: muda a foto do operador para a variante
                  indicada (arte em fotos/<variante>-N.webp; sem a arte no
                  build, vale o marcador PATAMO até a oficial entrar)
   · 'score' | 'qdc' | 'diamante' → regras a definir pelo gestor — já podem
     ser criados no painel, ainda sem regra ativa [INTEGRAÇÃO REAL] */
var ITENS_QUEST = [
  { id: 'blindado', nome: 'Blindado militar', desc: 'veículo blindado de patrulha da tropa',
    receita: [['liga', 20], ['pneu', 4], ['mag', 1], ['geo', 1]],
    efeito: { tipo: 'foto', variante: 'blindado' } }
];
