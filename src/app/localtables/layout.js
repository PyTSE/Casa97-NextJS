import { Montserrat } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import "@/app/globals.css"
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

const inter = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}) {
  return (
    <html>
      <body>
      <Toaster />
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className={`${inter.className} flex justify-between`}>
        <div>
          <Sidebar />
        </div>
        <main className="flex-grow">
          <Header routeName={"Mesas"}/>
          {children}
        </main>
      </div>
    </NextThemeProvider>
      </body>
    </html>
  );
}