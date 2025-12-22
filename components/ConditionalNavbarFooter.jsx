"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalNavbarFooter({ children }) {
  const pathname = usePathname();
  const isBillPage = pathname?.startsWith("/bill");

  return (
    <>
      {!isBillPage && <Navbar />}
      {children}
      {!isBillPage && <Footer />}
    </>
  );
}

