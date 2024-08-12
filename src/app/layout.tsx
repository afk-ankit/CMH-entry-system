import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMH entry/exit",
  description: "Late entry and exit app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-4/5 h-full xl:w-1/2 xl:h-1/2 xl:min-h-[300px] fixed opacity-10 border top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          <Image
            alt="charaideo-logo"
            src={"/cmh-logo.png"}
            fill
            className="object-contain"
          />
        </div>
        <main className="container py-8 min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
