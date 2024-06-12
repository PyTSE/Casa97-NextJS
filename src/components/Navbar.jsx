import { NAV_LINKS } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import BookingButton from "./BookingButton"
import { Menu } from "lucide-react"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-around max-container padding-container relative z-30 py-3">
        <Link href='/'>
            <Image src="/casa97.png" alt="logo" width={40} height={29}/>
        </Link>
        <ul className="hidden h-full gap-12 lg:flex">
            {NAV_LINKS.map((link) => (
                <Link href={link.href} key={link.key} className="regular-16 text-gray-900 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
                {link.label}
                </Link>
            ))}
        </ul>
        <div className="lg:flexCenter hidden">
            <BookingButton
                type="button"
                title="Reservar Mesa!"
            />
        </div>
        <Menu
            alt="menu"
            width={32}
            height={32}
            className="inline-block cursor-pointer lg:hidden"
        />
    </nav>
  )
}

export default Navbar