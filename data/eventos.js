var EVENTOS = (function () {
    /* A SEMANA DA DEMONSTRAÇÃO NASCE DA DATA DE HOJE.
       As datas eram fixas e venciam: o app — corretamente — deixa de
       listar evento vencido, e a vitrine de eventos pagos amanhecia
       vazia (e as suítes acusavam defeito que não existia). A âncora
       agora é a PRÓXIMA SEGUNDA-FEIRA e cada evento cai num dia a partir
       dela, então a demonstração abre sempre com a semana à frente, não
       importa o dia em que seja aberta. `[INTEGRAÇÃO REAL]`: na
       plataforma as datas vêm do cadastro do evento. */
    var base = new Date(); base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + ((8 - base.getDay()) % 7 || 7));
    var DIAS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    function dia(n) { var d = new Date(base.getTime()); d.setDate(d.getDate() + n); return d; }
    function dd(v) { return ('0' + v).slice(-2); }
    function iso(n) { var d = dia(n); return d.getFullYear() + '-' + dd(d.getMonth() + 1) + '-' + dd(d.getDate()); }
    /* rótulo no formato que o calendário e a página do evento leem:
       'QUA · 16/09 · 19H–21H' */
    function rot(n, hora) { var d = dia(n); return DIAS[d.getDay()] + ' · ' + dd(d.getDate()) + '/' + dd(d.getMonth() + 1) + ' · ' + hora; }
    return [
    { id: 'nac', nome: 'NAC · Atualidades', tipo: 'ENCONTRO · AO VIVO', modalidade: 'online', pago: false, preco: 0, quando: rot(2, '19H–21H'), profs: ['Danilo Moura'],
      cor: 'teal', meta: 'Atualidades da semana com Danilo Moura',
      desc: 'Encontro semanal do Núcleo de Atualidades e Conhecimentos: os fatos da semana que podem cair na sua prova, analisados ao vivo.',
      score: [['Participação no evento', '+10 score'], ['Acerto no quiz de atualidades', '+2 score por questão']],
      coins: [['Check-in ao vivo', '+10']] },
    { id: 'aulao-rondesp', nome: 'Aulão de véspera RONDESP', tipo: 'AULÃO · PRESENCIAL', modalidade: 'presencial', pago: false, preco: 0, quando: rot(3, '19H–22H'), profs: ['Cap. Silva', 'Prof.ª Ritha Galvão'],
      cor: '', meta: 'Revisão final antes da prova', garimpo: true,
      desc: 'Aulão de véspera com os professores do Quad: pontos quentes do edital RONDESP, macetes de prova e rodada de questões comentadas.',
      score: [['Participação no evento', '+10 score'], ['Acerto na rodada de questões', '+1 score por questão']],
      coins: [['Check-in no evento', '+10'], ['Garimpo escondido no aulão', '+15']] },
    { id: 'gincana', nome: 'Gincana Quad Coins', tipo: 'EVENTO · ONLINE', modalidade: 'online', pago: false, preco: 0, quando: rot(4, '20H–21H'),
      cor: 'gold', meta: 'Caça aos Coins escondidos', garimpo: true,
      desc: 'Uma hora de desafios-relâmpago no app: quem explora e resolve primeiro, garimpa mais. Os Coins da gincana expiram com ela.',
      score: [['Participação no evento', '+10 score'], ['Desafio concluído', '+5 score por desafio']],
      coins: [['Desafio vencido', '+5 por desafio'], ['Garimpo escondido na gincana', '+15'], ['Top 3 da noite', '+30']] },
    { id: 'aulao-especial', nome: 'Aulão especial', tipo: 'EVENTO PAGO · PRESENCIAL', modalidade: 'presencial', online: false,
      pago: true, preco: 80, moeda: 'qdc', quando: rot(12, '9H–12H'), dataISO: iso(12), sala: 'Sala 2', hi: '09:00', hf: '12:00', profs: ['Prof.ª Ritha Galvão'],
      cor: 'navy2', meta: '80 QdC · evento presencial',
      desc: 'Aulão de véspera de prova: revisão dirigida dos pontos mais cobrados, com rodada de questões comentadas ao vivo.',
      score: [['Participação no evento', '+10 score']], coins: [['Check-in no evento', '+10']] },
    { id: 'simuladao', nome: 'Simuladão Quad', tipo: 'SIMULADO · PRESENCIAL', modalidade: 'presencial', pago: false, preco: 0, quando: rot(5, '8H–13H'), profs: ['Prof. Nascimento'],
      cor: 'purple', meta: '140 questões · formato da banca',
      desc: 'Simulado completo no formato e no tempo da banca, com ranking geral e correção comentada no fim do dia.',
      score: [['Participação no evento', '+10 score'], ['Aproveitamento acima de 70%', '+80 score bônus']],
      coins: [['Participação', '+25'], ['Top 10 do ranking', '+50']] },
    { id: 'semana-insana', nome: 'Semana Insana', tipo: 'MARATONA · PRESENCIAL', modalidade: 'presencial', pago: true, preco: 400, moeda: 'dmn', quando: rot(7, '18H'), ate: iso(11),
      cor: 'gold', meta: 'SEG a SEX · 400 Dmn',
      desc: 'Cinco noites seguidas de revisão intensiva na sede — a maratona mais dura do Quad. O ingresso vale a semana inteira; o item segue na Quad Store até o último dia.',
      score: [['Participação no evento', '+10 score'], ['Semana completa', '+100 score bônus']],
      coins: [['Semana completa', '+40']] },
    { id: 'mentoria-cfo', nome: 'Mentoria CFO · redação', tipo: 'MENTORIA · ONLINE', modalidade: 'online', pago: true, preco: 120, quando: rot(6, '9H–11H'), link: 'https://meet.quadconcursos.com.br/cfo-redacao',
      cor: 'navy2', meta: 'Acesso pago · 120 QdC',
      desc: 'Mentoria online de redação para o CFO: correção ao vivo, banca comentada e plano de treino individual. Acesso liberado pela Loja.',
      score: [['Participação no evento', '+10 score']],
      coins: [['Entrega da redação treino', '+15']] }
    ];
  })();