"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const isPublic =
        pathname === "/" ||
        pathname.startsWith("/auth");
      
      if (!user && !isPublic) {
        router.push("/auth/login");
      }
      if (user && pathname.startsWith("/auth")) {
        router.push("/home");
      }
    }
  }, [user, pathname, router, mounted]);

  if (!mounted) return null;

  return <>{children}</>;
}
