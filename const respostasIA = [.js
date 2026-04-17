let ultimoTopico = null;
let repeticoesTopico = 0;
let tentativasNaoEntendidas = 0;

const respostasIA = [
  {
    topico: 'mais_pedido',
    chaves: ['mais pedido', 'lanche mais pedido', 'mais vendido'],
    resposta: '🔥 O campeão de pedidos é o SnapBurguer Clássico! Se quiser ir sem erro, vai nele que é sucesso. Quer que eu monte um combo com ele pra você?'
  },
  {
    topico: 'combo_barato',
    chaves: ['combo barato', 'barato', 'mais barato', 'econômico', 'economico'],
    resposta: '💰 Uma boa opção econômica é montar um combo com lanche clássico + bebida. Fica equilibrado, gostoso e com preço mais leve.'
  },
  {
    topico: 'bebidas',
    chaves: [
      'bebida',
      'bebidas',
      'quero mais opções de bebidas',
      'me mostra mais tipos de bebidas',
      'mais tipos de bebidas',
      'mais bebidas',
      'combina com hamburguer',
      'combina com hambúrguer'
    ],
    resposta: '🥤 Pra combinar com hambúrguer, as opções que costumam funcionar melhor são refrigerante, suco gelado ou chá.'
  },
  {
    topico: 'horarios',
    chaves: ['horário', 'horarios', 'horários', 'funcionamento', 'compras'],
    resposta: '⏰ As compras ficam liberadas somente de 07:00 às 08:30 e de 11:00 às 12:30. Fora disso, os botões de compra ficam bloqueados.'
  },
  {
    topico: 'sobremesas',
    chaves: ['sobremesa', 'doce'],
    resposta: '🍫 Se quiser fechar bem o pedido, uma sobremesa leve depois do combo pode ser uma ótima escolha.'
  },
  {
    topico: 'fome',
    chaves: ['fome', 'to com fome', 'tô com fome', 'muita fome'],
    resposta: '😈 Tá com fome mesmo? Vai de combo completo: burguer + batata + refri. É o combo que mais sustenta.'
  }
];

let ultimaRespostaIA = 'Oi! Eu sou a IA do SnapBite. Posso te ajudar a escolher um lanche, sugerir combos ou tirar dúvidas sobre horários e pedidos.';

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function criarMensagem(tipo, texto) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const msg = document.createElement('div');
  msg.className = `msg ${tipo === 'user' ? 'msg-user' : 'msg-ia'}`;

  msg.innerHTML = `
    <div class="msg-avatar">${tipo === 'user' ? '🧑' : '🤖'}</div>
    <div class="msg-bubble">${escaparHTML(texto)}</div>
  `;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function ehPedidoDeRepeticao(texto) {
  const frases = [
    'não entendi',
    'nao entendi',
    'pode repetir',
    'repete',
    'repita',
    'como assim',
    'explica melhor',
    'explique melhor',
    'não saquei',
    'nao saquei',
    'não ficou claro',
    'nao ficou claro'
  ];

  return frases.some(frase => texto.includes(frase));
}

function ehPedidoDeResumo(texto) {
  const frases = [
    'resume',
    'resumir',
    'resumo',
    'mais curto',
    'simplifica',
    'simplifique'
  ];

  return frases.some(frase => texto.includes(frase));
}

function responderRepeticao() {
  return `Claro! Vou repetir de outro jeito:\n\n${ultimaRespostaIA}`;
}

function responderResumo() {
  return 'Resumo rápido: posso te ajudar com sugestões de lanches, combos, bebidas, sobremesas e horários de compra.';
}

function responderNaoEntendido() {
  tentativasNaoEntendidas++;

  if (tentativasNaoEntendidas === 1) {
    return '🤔 Não entendi muito bem... mas posso te ajudar com:\n\n• Lanches\n• Combos\n• Bebidas\n• Preços\n• Horários\n\nTenta algo tipo: "combo barato" ou "mais pedido" 😄';
  }

  if (tentativasNaoEntendidas === 2) {
    return '😅 Ainda não consegui entender direitinho. Tenta perguntar de outro jeito.\n\nPosso falar sobre:\n• Lanches mais pedidos\n• Combos baratos\n• Bebidas que combinam\n• Horários de compra\n• Sobremesas\n\nExemplos:\n"qual o mais pedido?"\n"me indica um combo"\n"quais bebidas tem?"';
  }

  if (tentativasNaoEntendidas === 3) {
    return '👀 Acho que sua pergunta saiu um pouco do que eu sei responder agora.\n\nMas eu consigo te ajudar com várias coisas do SnapBite, como:\n• Sugestões pra quem tá com fome\n• Opções econômicas\n• Combos completos\n• Bebidas\n• Doces e sobremesas\n• Horários de funcionamento\n\nVocê pode tentar:\n"tô com muita fome"\n"quero algo barato"\n"qual sobremesa combina?"';
  }

  return '🤖 Ainda não entendi essa parte, mas continuo aqui pra te ajudar.\n\nPergunta sobre uma dessas opções:\n• Hambúrgueres\n• Combos\n• Batata frita\n• Bebidas geladas\n• Sobremesas\n• Horários\n• Mais pedidos da galera\n\nExemplo:\n"me sugere um lanche"\n"qual combo vale mais a pena?"\n"quais são os horários?"';
}

function responderBebidas(textoLimpo) {
  const pedidosDeMais = [
    'mais',
    'mais opções',
    'mais bebidas',
    'mais tipos',
    'me mostra mais',
    'quero mais opções',
    'outros tipos',
    'outras bebidas'
  ];

  const querExpandir = pedidosDeMais.some(frase => textoLimpo.includes(frase));

  if (ultimoTopico === 'bebidas') {
    repeticoesTopico++;
  } else {
    ultimoTopico = 'bebidas';
    repeticoesTopico = 0;
  }

  if (repeticoesTopico === 0) {
    return '🥤 Pra combinar com hambúrguer, as opções que costumam funcionar melhor são refrigerante, suco gelado ou chá.';
  }

  if (repeticoesTopico === 1 || querExpandir) {
    return '🔥 Quer mais opções? Olha essas:\n\n• Coca-Cola\n• Guaraná\n• Sprite\n• Suco natural\n• Chá gelado\n• Água com gás';
  }

  return '😈 Agora nível avançado:\n\n• Smoothie de morango\n• Vitamina de banana\n• Café gelado\n• Açaí batido\n• Suco de laranja\n• Chá de pêssego gelado\n\nQuer que eu monte um combo com bebida + lanche?';
}

function gerarRespostaIA(texto) {
  const textoLimpo = texto.toLowerCase().trim();

  if (ehPedidoDeRepeticao(textoLimpo)) {
    return responderRepeticao();
  }

  if (ehPedidoDeResumo(textoLimpo)) {
    return responderResumo();
  }

  const encontrada = respostasIA.find(item =>
    item.chaves.some(chave => textoLimpo.includes(chave))
  );

  if (encontrada) {
    tentativasNaoEntendidas = 0;

    if (encontrada.topico === 'bebidas') {
      return responderBebidas(textoLimpo);
    }

    if (ultimoTopico === encontrada.topico) {
      repeticoesTopico++;
    } else {
      ultimoTopico = encontrada.topico;
      repeticoesTopico = 0;
    }

    return encontrada.resposta;
  }

  return responderNaoEntendido();
}

function respostaComDelay(texto) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const msgTemp = document.createElement('div');
  msgTemp.className = 'msg msg-ia';

  msgTemp.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">Digitando...</div>
  `;

  chatBox.appendChild(msgTemp);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    msgTemp.remove();
    criarMensagem('ia', texto);
  }, 800);
}

function responderIA(texto) {
  criarMensagem('user', texto);

  setTimeout(() => {
    const resposta = gerarRespostaIA(texto);
    ultimaRespostaIA = resposta;
    respostaComDelay(resposta);
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ia-form');
  const input = document.getElementById('ia-input');
  const sugestoes = document.querySelectorAll('.sugestao-btn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const texto = input.value.trim();
    if (!texto) return;

    responderIA(texto);
    input.value = '';
    input.focus();
  });

  sugestoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const texto = btn.dataset.msg;
      responderIA(texto);
    });
  });
});