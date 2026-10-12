var LOJA_EXTRAS = (function () {
    /* a data da mentoria acompanha a semana da demonstração (como em
       `eventos.js`): data fixa vence e o item some dos Eventos da semana */
    var d = new Date(); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7) + 2);   /* quarta da próxima semana */
    function dd(v) { return ('0' + v).slice(-2); }
    return [
    { nome: 'Mentoria Quad', desc: 'acompanhamento individual com o time', cat: 'mentoria', preco: 900, moeda: 'dmn', icone: 'mentoria', dataISO: d.getFullYear() + '-' + dd(d.getMonth() + 1) + '-' + dd(d.getDate()) }
    ];
  })();