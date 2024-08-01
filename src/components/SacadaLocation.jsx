import Image from 'next/image'
import React, { useState } from 'react'
import { CarouselDemo } from './CarouselLanding'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const locations = [
  {
    title: 'Sacada',
    photos: [
      "/sacada-2.jpg",
      "/sacada-3.jpg",
      "/sacada-1.jpg",
      "/sacada-4.jpg",
      "/sacada-5.jpg"
    ],
    description: "Você não pode deixar de conhecer o espaço mais desejado da Casa 97. Com a melhor vista de todo o restaurante, este é o lugar perfeito para um pedido de namoro ou casamento, ou simplesmente para desfrutar de um jantar romântico com a pessoa amada. Atendemos exclusivamente mesas de casais, proporcionando o ambiente perfeito para aqueles que buscam um clima romântico para jantar contemplando a vista. E para garantir que todos se sintam confortáveis, oferecemos mantinhas para aquecer em dias mais frios, além de possuirmos a possibilidade de fechar os toldos e as cortinas para proteger contra o clima externo."
  },
  {
    title: 'Lareira',
    photos: [
      "/lareira-2.jpg",
      "/lareira-3.jpg",
      "/lareira-1.jpg",
      "/lareira-4.jpg",
      "/lareira-5.jpg"
    ],
    description: "Se você está procurando um ambiente aconchegante, elegante e com uma atmosfera romântica, a sala da Lareira da Casa 97 é o lugar perfeito para você. Com uma grande lareira que dá nome ao ambiente, é o lugar ideal para aproveitar as noites frias da cidade. Com um total de 8 mesas, para casais é um ambiente extremamente romântico e para grupos, é perfeito para uma noite agradável entre amigos ou familiares. É uma excelente opção para qualquer ocasião."
  },
  {
    title: 'Bar',
    photos: [
      "/bar-2.jpg",
      "/bar-3.jpg",
      "/bar-1.jpg",
      "/bar-4.jpg",
      "/bar-5.jpg"
    ],
    description: "O Bar é o lugar ideal para se reunir com os amigos para aproveitar uma noite animada. Se torna o melhor espaço interno para grupos por causa das suas mesas grandes que atendem até 14 pessoas. É um ambiente informal com decoração de lanternas orientais no teto e fica ao lado do nosso bar de drinks. Não perca a chance de conferir essa experiência incrível!"
  },
  {
    title: 'Espelhos',
    photos: [
      "/espelhos-2.jpg",
      "/espelhos-3.jpg",
      "/espelhos-1.jpg",
      "/espelhos-4.jpg",
      "/espelhos-5.jpg"
    ],
    description: "A sala Espelhos é o lugar perfeito para um jantar mais intimista. Com uma decoração única, o ambiente é adornado com dezenas de espelhos redondos, criando uma instalação artística nas paredes que proporciona um clima mágico e envolvente. Com apenas 3 mesas, é o espaço mais privativo da Casa 97, garantindo a tranquilidade e intimidade necessárias para um jantar inesquecível. E não podemos esquecer da sacada com a vista mais alta da Casa 97, tornando o ambiente ainda mais especial e romântico. Venha experimentar esse lugar encantador!"
  },
  {
    title: 'Jardim',
    photos: [
      "/jardim-2.jpg",
      "/jardim-3.jpg",
      "/jardim-1.jpg",
      "/jardim-4.jpg",
      "/jardim-5.jpg"
    ],
    description: "Que tal jantar em um ambiente cercado de natureza? O ambiente Jardim da Casa 97 é perfeito para quem busca um lugar espaçoso e com ar aconchegante. Com capacidade para até 50 pessoas, é ideal para encontros de família, amigos e celebrações especiais. Do lado direito, a decoração com plantas no teto cria um ambiente único e acolhedor, trazendo a natureza para perto de você. Já do lado esquerdo, o deck com lareira oferece uma vista espetacular para a lagoa, com uma cascata ao lado da escada que proporciona um charme extra ao espaço. Tudo isso em um ambiente que consegue atender tanto casais quanto grupos que desejam vivenciar uma experiência gastronômica única."
  },
  {
    title: 'Bambus',
    photos: [
      "/bambus-3.jpg",
      "/bambus-1.jpg",
      "/bambus-2.jpg",
      "/bambus-4.jpg"
    ],
    description: "Seja bem-vindo à sala Bambu da Casa 97, um ambiente pequeno, mas encantador e acolhedor. Com decoração que mistura cores naturais, como o amarelo terroso, lambris, terracota e cinza escuro, criamos um espaço que aquece tanto o ambiente quanto os corações dos nossos clientes. Ideal para confraternizações pequenas de até 9 pessoas, transforme seu jantar em um evento privativo e exclusivo. Com duas mesas para casais e uma para 4 pessoas, é perfeito para encontros intimistas."
  }
];

  const SacadaLocation = () => {
    return (
      <div className='padding-container max-container w-full flexCenter'>
        <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {locations.map((location) => (
            <Card className="flex flex-col h-full">
              <CardHeader className="flex-grow">
                <CardTitle className="bold-40">{location.title}</CardTitle>
                <CardDescription className="text-md text-justify">{location.description}</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <CarouselDemo photos={location.photos} />
              </CardContent>
            </Card>
          ))}
          <div className='flexCenter flex-col justify-center w-full'>

          </div>
        </div>
      </div>
    );
  }
  
  export default SacadaLocation;
