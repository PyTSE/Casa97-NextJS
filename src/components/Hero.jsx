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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setNextImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsFading(false);
      }, 500); // Tempo da transição para o fade
    }, 3500); // Intervalo total incluindo o tempo de transição

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
  }, []);

  return (
    <section className='flexCenter bg-hero-sm lg:bg-hero max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row'>
      <div className='relative z-20 flex flex-1 flex-col xl:w-1/2 py-28'>
        <h1 className='bold-52 text-gray-50 lg:bold-88'>A melhor casa da cidade!</h1>
        <p className='regular-16 mt-6 text-gray-400 xl:max-w-[520px]'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, sit error vero ab, deleniti distinctio officiis ipsa voluptas quisquam cum veritatis. Dolorum eaque deserunt asperiores inventore quos illo maiores amet.
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
      <div className="p-6">
        <div className='blob'>
          <img
            src={images[currentImageIndex]}
            alt="Imagem Bonita"
            className={`w-full h-full object-cover ${isFading ? 'fade-out' : 'fade-in'}`}
          />
          <img
            src={images[nextImageIndex]}
            alt="Imagem Bonita"
            className={`w-full h-full object-cover absolute inset-0 ${isFading ? 'fade-in' : 'fade-out'}`}
          />
        </div>
      </div>
      <div className='pb-80'>

      </div>
    </section>
  );
}

export default Hero;
