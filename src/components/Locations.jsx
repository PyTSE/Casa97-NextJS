import React from 'react';
import SacadaLocation from './SacadaLocation';

const Locations = () => {
  return (
    <section className='flexCenter flex-col mt-10'>
        <div className=' padding-container max-container w-full pb-24'>
            <p className='uppercase regular-18 -mt-1 mb-3 text-gray-500'>
                Estamos aqui para você
            </p>
            <div className='flex flex-wrap justify-between gap-5 lg:gap-10 flex-row-reverse'>
                <h2 className='bold-40 lg:bold-64 xl:max-w-[390px]'>Espaços Tematicos</h2>
                <p className='regular-16 text-gray-500 xl:max-w-[520px]'>Conheça abaixo alguns dos nossos espaços temáticos que irão lhe oferecer uma experiencia incrível.</p>
            </div>
        </div>
        <SacadaLocation/>
    </section>
  )
}

export default Locations;
