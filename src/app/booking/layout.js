import { Playfair_Display, Lato } from "next/font/google";
import "../globals.css";
import "./booking.css";
import Background from '../../../public/back.jpeg';
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
});

const lato = Lato({
  subsets: ["latin"],
  weight: ['300', '400', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Casa97 — Reserve sua Mesa',
  description: 'Restaurante Casa97',
};

const BookingLayout = ({ children }) => {
  return (
    <>
      <Toaster />
        <div className={`${playfair.variable} ${lato.variable} booking-root relative min-h-screen`}>
          <Image
            src={Background}
            fill
            className="object-cover"
            style={{ opacity: 0.13, filter: 'saturate(0.6) brightness(0.7)' }}
            alt=""
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(160deg, rgba(8,6,4,0.90) 0%, rgba(18,13,8,0.82) 50%, rgba(8,6,4,0.94) 100%)',
            }}
          />
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </div>
    </>
  );
};

export default BookingLayout;
