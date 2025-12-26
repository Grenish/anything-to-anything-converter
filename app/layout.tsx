import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import { TierProvider } from "@/components/providers/tier-provider";

const nunitoSans = Nunito_Sans({ variable: "--font-sans" });

export const metadata: Metadata = {
  title: "A2A Converter",
  description: "Web's most reliable utility: Markdown -> HTML -> PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TierProvider>
            <Navbar />
            {children}
            <Footer />
          </TierProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
