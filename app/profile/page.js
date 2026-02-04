"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, LogOut, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getUserInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const displayName = useMemo(() => user?.displayName || "Usuário", [user]);
  const email = useMemo(() => user?.email || "", [user]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const shouldBeDark = stored === "dark";
    setIsDarkMode(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium mb-3 sm:mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2 mb-4">Perfil</h1>
          </div>

          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Foto do usuário"
                    width={56}
                    height={56}
                    className="rounded-full shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold shrink-0 text-lg">
                    {getUserInitial()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{displayName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200 transition-colors duration-200"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={handleToggleDarkMode}
                className="w-full flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-300">
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Modo escuro</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ativar/desativar tema</p>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-1 ${
                    isDarkMode ? "bg-orange-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      isDarkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
