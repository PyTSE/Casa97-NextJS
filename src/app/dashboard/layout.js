import { Montserrat } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import "@/app/globals.css"
import { ThemeProvider as NextThemeProvider } from "next-themes";


const inter = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}) {
  return (
    <html>
      <body>
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className={`${inter.className} flex justify-between`}>
        <div>
          <Sidebar />
        </div>
        <main className="flex-grow">
          <Header routeName={"Dashboard"} />
          {children}
        </main>
      </div>
    </NextThemeProvider>
      </body>
    </html>
  );
}