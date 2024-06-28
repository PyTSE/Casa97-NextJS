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
        {label: 'Email', value: 'contato@casa97.com.br', link: 'https://wa.me/5547988367106'},
    ],
};

export const SOCIALS = {
    title: 'Redes Sociais',
    links: [
        {label: '/facebook.svg', link: 'https://www.facebook.com/Casa97Joinville/'},
        {label: '/instagram.svg', link: 'https://www.instagram.com/casa97joinville/'}
    ]
}

export const EVENTS_INFO = [
    {
        title: 'Alugue para um evento!',
        description: 'Faça seu evento em nossos espaços e garanta a qualidade e comodidade que apenas a nossa casa consegue entregar a voce e seus convidados.',
        photo: ['/casamento.png'],
    },
    {
        title: 'Coquetelaria especial',
        description: 'Com uma seleção abrangente de drinks clássicos, releituras criativas e criações autorais, a Casa 97 oferece o que há de melhor no mundo da coquetelaria. Cada taça é cuidadosamente preparada para proporcionar uma experiência única.',
        photo: ['/bebidas1.png'],
    },
    {
        title: 'Decoração especial',
        description: 'Transforme sua noite em um momento especial com nossas mesas decoradas. Oferecemos seis modelos exclusivos de mesas decoradas, que você pode incluir na sua reserva para criar a atmosfera perfeita para a sua ocasião.',
        photo: ['/decoracao1.png'],
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