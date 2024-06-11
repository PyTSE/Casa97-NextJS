import Image from 'next/image'
import React, { useState } from 'react'
import { CarouselDemo } from './CarouselLanding'
const photosSacada = [
    "/foto-sacada3.jpg",
    "/foto-sacada-4.jpg",
    "/foto-varanda2.jpg"
  ];
const photosLareira = [
    "/foto-lareira2.jpg",
    "/foto-lareira3.jpg",
    "/foto-lareira.jpg"
  ];
const locations = [
    "Sacada",
    "Lareira",
    "Bar",
    "Espelhos"
  ];
  const descriptions = {
    "Sacada": "DESCRIPTION SACADA",
    "Lareira": "DESCRIPTION LAREIRAsdadasdasdasdasdasdasd",
    "Bar": "DESCRIPTION BAR",
    "Espelhos": "DESCRIPTION ESPELHOS"
  };

  const SacadaLocation = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [photos, setPhotos] = useState(photosSacada);
    const handleLocationClick = (location) => {
      setSelectedLocation(location);
      switch (location) {
        case 'Lareira':
          setPhotos(photosLareira);
          break;
        case 'Bar':
          setPhotos(photosBar);
          break;
        case 'Espelhos':
          setPhotos(photosEspelhos);
          break;
        case 'Sacada':
        default:
          setPhotos(photosSacada);
          break;
      }
    };
  
    return (
      <div className='padding-container max-container w-full pb-24'>
        <div className='flex flex-wrap justify-between gap-5 lg:gap-10 mt-8'>
          <div className='flex flex-col'>
            {locations.map((location) => (
              <a
                key={location} id='location-a'
                className='bold-40 lg:bold-64 xl:max-w-[390px] cursor-pointer m-1 pb-1.5 relative'
                onClick={() => handleLocationClick(location)}
              >
                {location}
              </a>
            ))}
          </div>
          <div className='bg-gray-400 rounded-sm w-96'>
            {selectedLocation && (
              <p className='regular-16 text-gray-500 xl:max-w-[520px]'>
                {descriptions[selectedLocation]}
              </p>
            )}
          </div>
          <div className='flex flexCenter flex-col gap-5'>
            <div className='w-96'>
              <CarouselDemo photos={photos} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default SacadaLocation;
  
  