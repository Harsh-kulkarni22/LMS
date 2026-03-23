import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";
import ChatBotButton from "@/components/ChatBotButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS - Learn anything, anytime",
  description: "A modern learning platform with expert-led video courses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthGuard>
          <Navbar />
          {children}
        </AuthGuard>
        <ChatBotButton />
        <ToastProvider />
      </body>
    </html>
  );
}
