import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import BookingButton from './BookingButton'
import { EVENTS_INFO } from '@/constants'
import Link from 'next/link'

const EventsSection = () => {
  return (
    <section className='bg-events sm:bg-events-sm flexCenter flex-col'>
      <h2 className='bold-40 lg:bold-64 mt-10 text-gray-50'>Serviços Extras</h2>
      <div className='padding-container max-container w-full flexCenter'>
        <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
          {EVENTS_INFO.map((event) => (
            <Card className="flex flex-col w-full">
              <CardHeader className="flex-grow">
                <CardTitle className='mb-4'>{event.title}</CardTitle>
                <img src={event.photo} className="rounded-md max-h-96 object-cover w-full"/>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className='mb-4 text-justify'>
                  <p>{event.description}</p>
                </div>
              </CardContent>
              <CardFooter  className='flex justify-center'>
                <Link href={`https://wa.me/554732279537?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20a%20${encodeURIComponent(event.title)}%20da%20Casa97.`}>
                  <BookingButton
                    className="cursor-pointer"
                    type="button"
                    title="Saber mais!"
                    variant="h-14"
                    href="/booking"
                  />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventsSection
