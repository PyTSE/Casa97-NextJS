export const NAV_LINKS = [
    {href: '/', key: 'home', label: 'Home'},
    {href: '/', key: 'locations', label: 'Espaços'},
    {href: '/', key: 'services', label: 'Serviços Extras'},
];

export const FOOTER_LINKS = [
    {
        title: 'Endereço',
        links: [
            'Rua Arco-Íris, 97 - Iririú, Joinville - SC, 89227-130'
        ],
    }
]

export const FOOTER_CONTACT_INFO = {
    title: 'Entre em contato conosco',
    links: [
        {label: 'WhatsApp', value: '(47) 3227-9537', link: 'https://wa.me/554732279537'},
        {label: 'Email', value: 'contatocasa97@gmail.com', link: ''},
    ],
};

export const SOCIALS = {
    title: 'Redes Sociais',
    links: [
        {id: 1, label: '/facebook.svg', link: 'https://www.facebook.com/Casa97Joinville/'},
        {id: 2, label: '/instagram.svg', link: 'https://www.instagram.com/casa97joinville/'}
    ]
}

export const EVENTS_INFO = [
    {
        title: 'Gastronomia',
        description: 'Com uma proposta gastronômica de "comfort food", a nossa cozinha prepara cada prato, buscando oferecer a sensação de bem-estar e resgatando memórias afetivas. Conheça em detalhes nossas opções de entradas, pratos individuais, pratos para dividir, fondues e sobremesas.',
        photo: ['/gastronomia-card.jpg'],
    },
    {
        title: 'Coquetelaria',
        description: 'Com uma seleção abrangente de drinks clássicos, releituras e criações autorais, a Casa 97 oferece o que há de melhor no mundo da coquetelaria. Cada taça é cuidadosamente preparada para proporcionar uma experiência única.',
        photo: ['/coquetelaria-card.jpg'],
    },
    {
        title: 'Mesas Decoradas',
        description: 'Transforme sua noite em um momento especial. Oferecemos modelos exclusivos de mesas decoradas, que você pode incluir na sua reserva para criar a atmosfera perfeita para o seu jantar.',
        photo: ['/mesas-card.jpg'],
    }
]

export const firebaseConfig = {
    apiKey: "AIzaSyBptHQ733xIF3Bg3jLcF_FA_SHUa6M5-AI",
    authDomain: "casa97-a53eb.firebaseapp.com",
    databaseURL: "https://casa97-a53eb-default-rtdb.firebaseio.com",
    projectId: "casa97-a53eb",
    storageBucket: "casa97-a53eb.appspot.com",
    messagingSenderId: "572096461268",
    appId: "1:572096461268:web:49b44dd4a3501b486bbe41"
  };