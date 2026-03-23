"use client";

import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // proceed anyway
    }
    logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold text-gray-900">Your profile</h1>

        <div className="mt-10 flex flex-col items-center gap-8 rounded-lg border border-border-soft bg-white p-8 shadow-sm sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-white shadow-sm">
            <User className="h-10 w-10 text-white" aria-hidden />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">{user.name || "Student"}</h2>
            <p className="mt-1 text-lg text-gray-600">{user.email}</p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-700 transition hover:bg-red-100"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
