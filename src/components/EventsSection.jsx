import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'
import BookingButton from './BookingButton'
import { EVENTS_INFO } from '@/constants'

const EventsSection = () => {
  return (
    <section className='bg-events sm:bg-events-sm flexCenter flex-col my-4 bg-gray-500'>
      <h2 className='bold-40 lg:bold-64 xl:max-w-[600px] my-10 text-gray-50'>Serviços Extras</h2>
      <div className='flex flex-wrap justify-between gap-5 lg:gap-10 mt-8'>
      {EVENTS_INFO.map((event) => (
        <div className='flexCenter'>
            <div key={event.id} className="w-96">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <div className="flex items-center space-x-4 rounded-md border mt-3">
                      <Image src={event.photo} width={432} height={400} className='rounded-md'/>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='mb-4'>
                    <p>{event.description}</p>
                  </div>
                  <div className='flex flexCenter'>
                    <BookingButton
                      type="button"
                      title="Reservar Agora!"
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
