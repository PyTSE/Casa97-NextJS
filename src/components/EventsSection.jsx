import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'
import BookingButton from './BookingButton'
import { EVENTS_INFO } from '@/constants'
import { CarouselDemo } from './CarouselLanding'

const EventsSection = () => {
  return (
    <section className='bg-events sm:bg-events-sm flexCenter flex-col my-8 bg-gray-500'>
      <h2 className='bold-40 lg:bold-64 xl:max-w-[600px] lg:my-2 lg:mt-12 mt-4 text-gray-50'>Serviços Extras</h2>
      <div className='flex flex-wrap flexCenter justify-between gap-5 lg:gap-10 lg:mt-24 mt-10'>
      {EVENTS_INFO.map((event) => (
        <div className='flexCenter'>
            <div key={event.id} className="w-96">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className='mb-4'>{event.title}</CardTitle>
                  <div className="flex items-center space-x-4 rounded-md border">
                    <CarouselDemo photos={event.photo} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='mb-4'>
                    <p>{event.description}</p>
                  </div>
                  <div className='flex flexCenter'>
                    <BookingButton
                      type="button"
                      title="Saber mais!"
                      variant="h-14"
                      href="/booking"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
        ))}
      </div>
    </section>
  )
}

export default EventsSection
