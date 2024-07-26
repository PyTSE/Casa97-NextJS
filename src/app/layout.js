// app/landing/layout.js
import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ subsets: ["latin"] });

const LandingLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Restaurante Casa 97</title>
      </head>
      <body className={montserrat.className}>
        <main className="relative overflow-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default LandingLayout;
