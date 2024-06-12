import Image from 'next/image'
import React from 'react'
import BookingButton from './BookingButton'
import BlobLanding from './BlobLanding'
//import { AspectRatioDemo } from './AspectRatio'

const Hero = () => {
  return (
    <section className='bg-hero-sm lg:bg-hero max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row'>
      <div className='relative z-20 flex flex-1 flex-col xl:w-1/2'>
        <h1 className='bold-52 text-gray-50 lg:bold-88'>A melhor casa da cidade!</h1>
        <p className='regular-16 mt-6 text-gray-400 xl:max-w-[520px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, sit error vero ab, deleniti distinctio officiis ipsa voluptas quisquam cum veritatis. Dolorum eaque deserunt asperiores inventore quos illo maiores amet.</p>
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
      <div className="relative flex flex-1 items-start border-2 border-yellow-400">
        <div className="relative z-20 flex w-[268px] flex-col gap-8 rounded-3xl bg-gray-600 px-7 py-8">
          <div className="flex flex-col">
            <div className="flexBetween">
              <p className="regular-16 text-gray-20">Localização</p>
            </div>
            <p className="bold-20 text-white">Rua: Arco-Íris, 97 - Iririú, Joinville - SC, 89227-130</p>
          </div>

          <div className="flexBetween">
            <div className="flex flex-col">
              <p className="regular-16 block text-gray-20">Distance</p>
              <p className="bold-20 text-white">173.28 mi</p>
            </div>
            <div className="flex flex-col">
              <p className="regular-16 block text-gray-20">Elevation</p>
              <p className="bold-20 text-white">2.040 km</p>
            </div>
          </div>
        </div>
        <div className='absolute bottom-0 right-0 z-20 flex w-[268px] flex-col gap-8 rounded-3xl px-7 py-8 border-2 border-red-400'>
            <BlobLanding>
            </BlobLanding>
        </div>
      </div>
    </section>
  )
}

export default Hero