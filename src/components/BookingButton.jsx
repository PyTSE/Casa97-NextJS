import { HandPlatter } from 'lucide-react'
import Image from 'next/image'
import React from 'react'


const BookingButton = ({type, title, icon, variant}) => {
  return (
    <button
    className={`flexCenter gap-3 rounded-full border ${variant}`}
    type={type}
    >
       <HandPlatter className="mr-2 h-4 w-4" />
       <label className='bold-16 whitespace-nowrap'>{title}</label>
    </button>
  )
}

export default BookingButton