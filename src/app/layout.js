"use client";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Background from '../../public/back.jpeg';
import Image from "next/image";
import { ThemeProvider as NextThemeProvider } from "next-themes";

const inter = Montserrat({ subsets: ["latin"] });

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
        <body className="flex justify-center items-center">
        <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className={`${inter.className} flex justify-between`}>
        <Image src={Background} layout="fill" className="h-full w-full object-cover opacity-30" alt="" />
        <div className="z-10 justify-center flex items-center p-4">
          <main>{children}</main>
        </div>
        </div>
        </NextThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;