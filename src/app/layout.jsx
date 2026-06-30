// app/landing/layout.js
import { Montserrat, Playfair_Display, Lora } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const LandingLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Restaurante Casa 97</title>
      </head>
      <body className={`${montserrat.className} ${playfairDisplay.variable} ${lora.variable}`}>
        <main className="relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
};

export default LandingLayout;
