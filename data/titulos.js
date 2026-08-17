/* TÍTULOS E CONDECORAÇÕES (dec. 218) — o que o aluno CONQUISTOU, não o que
   ele comprou: cada título nasce de uma vitória (promoção de patente,
   desempenho em simulado, constância, construção de quest, drop raro).
   Não são itens: não vão para a vitrine da loja nem para o entreposto —
   condecoração não se vende.
   · CATALOGO = tudo que existe para ser conquistado (o que ainda não veio
     aparece bloqueado, mostrando o caminho)
   · SEED = o que o aluno da demonstração já tem no peito
   Na plataforma real a concessão vem do servidor [INTEGRAÇÃO REAL].    */
var TITULOS_CATALOGO = [
  { id: 'merito',     nome: 'Medalha de mérito por participação', ico: '🎖️',
    desc: 'presença e engajamento reconhecidos pela coordenação', comoGanhar: 'concedida pela administração' },
  { id: 'questoes',   nome: 'Medalha de questões resolvidas', ico: '📚',
    desc: 'volume de questões batido com constância', comoGanhar: 'resolvendo pacotes de 10 questões' },
  { id: 'comando',    nome: 'Medalha de comando geral por uma semana', ico: '⭐',
    desc: 'liderou o ranking geral por sete dias seguidos', comoGanhar: 'ficando em 1º no ranking geral por uma semana' },
  { id: 'presenca',   nome: 'Medalha de presença integral no mês', ico: '🏅',
    desc: 'mês fechado sem nenhuma falta', comoGanhar: 'sem faltar a nenhuma aula do mês' },
  { id: 'pontaria',   nome: 'Medalha de pontaria nos simulados', ico: '🎯',
    desc: 'acerto acima de 85% num simulado digital', comoGanhar: 'acertando mais de 85% num simulado' },
  { id: 'constancia', nome: 'Medalha de constância — 30 dias seguidos', ico: '🔥',
    desc: 'trinta dias sem quebrar a sequência', comoGanhar: 'estudando 30 dias seguidos' },
  { id: 'primeiro',   nome: 'Medalha de primeiro lugar da sala', ico: '🏆',
    desc: 'topo do ranking da própria turma', comoGanhar: 'chegando ao 1º lugar da sua sala' },
  { id: 'promocao',   nome: 'Condecoração de promoção', ico: '👑',
    desc: 'aprovado na prova de promoção e elevado de patente', comoGanhar: 'passando na prova de promoção' },
  { id: 'forjador',   nome: 'Título de Forjador', ico: '🛠️',
    desc: 'construiu um equipamento reunindo insumos de quest', comoGanhar: 'construindo um item na área de Itens de Quest' },
  { id: 'sortudo',    nome: 'Título de Tocado pela Sorte', ico: '🍀',
    desc: 'conquistou no drop um item que quase ninguém acha', comoGanhar: 'recebendo um item raro no drop' }
];
/* o que o aluno da demonstração já conquistou (com a data da vitória) */
var TITULOS_SEED = [
  { id: 'merito',   quando: '12/06/2026', origem: 'concedida pela coordenação do CFO' },
  { id: 'questoes', quando: '28/07/2026', origem: '1.200 questões resolvidas' }
];
