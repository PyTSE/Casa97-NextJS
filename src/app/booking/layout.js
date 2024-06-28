"use client";
import { Montserrat } from "next/font/google";
import "../globals.css";
import Background from '../../../public/back.jpeg';
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider as NextThemeProvider } from "next-themes";

const montserrat = Montserrat({ subsets: ["latin"] });

export const Metadata = {
  title: 'Casa97',
  description: 'Restaurante Casa97',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex justify-center items-center h-screen">
        <Toaster />
        <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className={`${montserrat.className} relative flex justify-between h-full w-full`}>
            <Image
              src={Background}
              layout="fill"
              className="h-screen w-full object-cover opacity-30"
              alt=""
            />
            <div className="absolute inset-0 flex justify-center items-center p-4">
              <main>{children}</main>
            </div>
          </div>
        </NextThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
