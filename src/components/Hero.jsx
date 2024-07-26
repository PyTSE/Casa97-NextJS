import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BookingButton from './BookingButton';

const images = [
  "/prato1.jpg",
  "/foto-espelhos.jpg",
  "/foto-lareira.jpg"
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isFading, setIsFading] = useState(false);

  return (
    <section className='flexCenter bg-hero-sm lg:bg-hero max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row'>
      <div className='relative z-20 flex flex-1 flex-col xl:w-1/2 py-28'>
        <h1 className='bold-52 text-gray-50 lg:bold-88'>A Casa mais charmosa de Joinville!</h1>
        <p className='regular-16 mt-6 text-gray-400 xl:max-w-[720px]'>
        À primeira vista, nem parece um restaurante. A entrada, as mesas, o banheiro, tudo lembra uma casa normal. Um portão de ferro, um jardim na entrada e a porta principal que dá acesso para os fundos da casa.
        Tudo simples, mas elegante e muito bonito. Atendimento personalizado, alimentos frescos e bem preparados, temperos diferenciados. Oferecer bem-estar e trazer as boas lembranças do aconchego do lar são a nossa missão.
        </p>
        <div className='my-11 flex flex-wrap gap-5 justify-center lg:justify-start'>
          <div className='flex items-center gap-2'>
            {Array(5).fill(1).map((_, index) => (
              <Image
                src="/star.svg"
                key={index}
                alt="star"
                width={24}
                height={24}
              />
            ))}
          </div>
          <p className='bold-16 lg:bold-20 text-blue-70 text-gray-50'>
            19k
            <span className='regular-16 text-gray-50 lg:regular-20 ml-1'>Avaliações Excelentes</span>
          </p>
        </div>
        <div className='flex w-full gap-3 sm:flex-row justify-center lg:justify-start'>
          <BookingButton
            type="button"
            title="Reservar Agora!"
            variant="h-16 bg-gray-500"
            href="/booking"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
