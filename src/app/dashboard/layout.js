import { Montserrat } from "next/font/google";
import UserItem from "@/components/UserItem";
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
          <UserItem />
          <Sidebar />
        </div>
        <main className="flex-grow">
          <Header />
          {children}
        </main>
      </div>
    </NextThemeProvider>
      </body>
    </html>
  );
}