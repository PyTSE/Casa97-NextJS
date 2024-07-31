import { HandPlatter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import React from 'react'


const BookingButton = ({type, title, icon, variant}) => {
  return (
    <Button
    className={`flexCenter gap-3 rounded-full border ${variant}`}
    type={type}
    >
       <HandPlatter className="mr-2 h-4 w-4" />
       <label className='bold-16 whitespace-nowrap cursor-pointer'>{title}</label>
    </Button>
  )
}

export default BookingButton