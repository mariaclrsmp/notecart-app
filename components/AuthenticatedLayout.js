"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import MainWrapper from "@/components/MainWrapper";
import { Plus } from "lucide-react";

const publicRoutes = ["/login", "/register"];

export default function AuthenticatedLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        if (!loading) {
            if (!user && !isPublicRoute) {
                router.push("/login");
            } else if (user && isPublicRoute) {
                router.push("/");
            }
        }
    }, [user, loading, isPublicRoute, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (isPublicRoute) {
        return <>{children}</>;
    }

    if (!user) {
        return null;
    }

    const handleCreateList = () => {
        router.push("/?openModal=true");
    };

    return (
        <>
            <Sidebar />
            <MainWrapper>{children}</MainWrapper>
            
            <button
                onClick={handleCreateList}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 lg:bottom-8 lg:right-8 lg:left-auto lg:translate-x-0 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center"
                aria-label="Criar nova lista"
                title="Criar nova lista"
            >
                <Plus className="w-6 h-6" />
            </button>
        </>
    );
}
