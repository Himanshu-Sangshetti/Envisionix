import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast"; 
import "@pqina/pintura/pintura.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Envisionix",
  description: "Generate images via Nebius AI Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed inset-0 z-[-1]">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-green-500/10 blur-[100px]" />
        </div>

        <UserProvider> {/* Wrap UserProvider here */}
          <Navbar />
          <Toaster position="top-right" reverseOrder={false} />
          <div className="pt-24">{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
