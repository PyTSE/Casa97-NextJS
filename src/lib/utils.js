import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export function createMessage (payload) {
  if(payload. itensCarrinho.length > 0){
    const valorTotalCalculado = payload.itensCarrinho.reduce((total, item) => total + item.preco, 0);
    const message = `
    *RESERVA CONFIRMADA!*

    *Nome*: ${payload.nome}
    *Número da mesa*: ${payload.mesaNome}
    *Ambiente*: ${payload.localNome}
    *Mesa para quantas pessoas*: ${payload.numeroPessoas}
    *Data*: ${payload.formattedDate}

    Horário de funcionamento: terça-feira a sábado, das 19h à meia noite. 
    Período em que a mesa estará reservada esperando vocês chegarem: das 19h às 20h
    Itens inclusos:
    ${payload.itensCarrinho.map(item => `- ${item.nome} - R$${item.preco}`).join('\n')}
        
    Valor Total: R$${valorTotalCalculado.toFixed(2)}

    Para confirmar definitivamente sua mesa decorada ou/e serviços extras, solicitamos o pagamento através do PIX utilizando a chave abaixo:

    *Chave PIX: 27.191.452/0001-54*
    Titular: Casa 97 Bar Cool e Restaurante

  Lembramos que a sua mesa decorada só será confirmada após a verificação do pagamento. Por favor, efetue o pagamento até  XX/XX/2024 às 17h e envie-nos o comprovante para garantir a sua mesa decorada.
    
    *LEIA COM ATENÇÃO:* 
    - Não cobramos taxa para reservar mesa por isso seja educado, em caso de desistência nos avise!
    - Nossas reservas vão até as 20h (sem exceção), após este horário as mesas que estiverem disponíveis serão distribuídas por ordem de chegada.
    - Se você sabe que vai chegar após as 20h, não é necessário reservar. Quando chegarem acomodaremos vocês de acordo com a disponibilidade.
    Caso tenha alguma dúvida ou necessite de mais informações é só nos perguntar.

    Agradecemos pela sua preferência e estamos ansiosos para recebê-lo(a) na Casa 97!

    Atenciosamente,
    Equipe Casa 97
      `;
      return message;
  } else {
    const message = `
    *RESERVA CONFIRMADA!*
      
    *Nome*: ${payload.nome}
    *Número da mesa*: ${payload.mesaNome}
    *Ambiente*: ${payload.localNome}
    *Mesa para quantas pessoas*: ${payload.numeroPessoas}
    *Data*: ${payload.formattedDate}

    Horário de funcionamento: terça-feira a sábado, das 19h à meia noite. 
    Período em que a mesa estará reservada esperando vocês chegarem: das 19h às 20h

    *LEIA COM ATENÇÃO:* 
    - Não cobramos taxa para reservar mesa por isso seja educado, em caso de desistência nos avise!
    - Nossas reservas vão até as 20h (sem exceção), após este horário as mesas que estiverem disponíveis serão distribuídas por ordem de chegada.
    - Se você sabe que vai chegar após as 20h, não é necessário reservar. Quando chegarem acomodaremos vocês de acordo com a disponibilidade.
    Caso tenha alguma dúvida ou necessite de mais informações é só nos perguntar.

    Agradecemos pela sua preferência e estamos ansiosos para recebê-lo(a) na Casa 97!

    Atenciosamente,
    Equipe Casa 97 
  `;
  return message;
  }
}

export async function sendMessage (payload) {
  const message = createMessage(payload);

  fetch('https://api.hand.chat/core/v2/api/chats/send-text', {
    method: 'POST',
    headers: {
      "access-token": process.env.NEXT_PUBLIC_TOKEN_API,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "number": payload.whatsapp,
      "message": message,
      "isWhisper": false,
      "forceSend": true,
      "delayInSeconds": 0
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Resposta da API:', data);
  })
  .catch((error) => {
    console.error("Erro ao chamar a API:", error);
  });
}
