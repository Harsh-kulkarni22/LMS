"use client";

import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatBotButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (pathname === "/chat" || pathname.startsWith("/auth")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/chat"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-accent-hover focus:outline-none focus:ring-4 focus:ring-accent/30"
        aria-label="Open AI Chatbot"
      >
        <MessageSquareText className="h-6 w-6 transition-transform group-hover:scale-110" />
      </Link>
    </div>
  );
}
