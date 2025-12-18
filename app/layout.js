import { Montserrat } from "next/font/google";
import { Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ThemeProvider from "@/components/ThemeProvider";
import I18nProvider from "@/components/I18nProvider";
import GoogleTranslate from "@/components/GoogleTranslate";



const roboto = Montserrat({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800']
});

const Avg_sans = Barlow_Condensed({
  variable: "--font-average",
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


export const metadata = {
  title: "Karachi Water and Sewerage Corporation (KW&SC)",
  description: "Official website of Karachi Water and Sewerage Corporation - Providing clean water and efficient sewerage services to Karachi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${Avg_sans.variable} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors`}
      >
        <ThemeProvider>
          <I18nProvider>
            <Navbar />
            {children}
            <Footer />
            <CookieConsent />
            <GoogleTranslate />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
