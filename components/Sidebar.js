"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Home, List, Share2, User, LogOut } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        const savedState = localStorage.getItem("sidebarCollapsed");
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState));
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const isActive = (path) => pathname === path;

    const menuItems = [
        { path: "/", label: "Início", mobileLabel: "Início", icon: Home },
        { path: "/recentLists", label: "Todas as Listas", mobileLabel: "Listas", icon: List },
        { path: "/sharedLists", label: "Listas Compartilhadas", mobileLabel: "Compartilhadas", icon: Share2 },
    ];

    const mobileMenuItems = [
        { path: "/", label: "Início", icon: Home },
        { path: "/recentLists", label: "Listas", icon: List },
        { path: "/sharedLists", label: "Compartilhadas", icon: Share2 },
        { path: "/profile", label: "Perfil", icon: User },
    ];

    const getUserInitial = () => {
        if (user?.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    const getUserDisplayName = () => {
        return user?.displayName || "Usuário";
    };

    const getUserEmail = () => {
        return user?.email || "";
    };

    if (loading) {
        return null;
    }

    return (
        <>
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-50 shadow-lg">
                <div className="grid grid-cols-4 h-16">
                    {mobileMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isProfile = item.path === "/profile";
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                                    isActive(item.path)
                                        ? 'text-orange-600'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {isProfile ? (
                                    <>
                                        {user?.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt="Foto do usuário"
                                                width={24}
                                                height={24}
                                                className="rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold ${user?.photoURL ? 'hidden' : ''}`}>
                                            {getUserInitial()}
                                        </div>
                                    </>
                                ) : (
                                    <Icon className="w-6 h-6" />
                                )}
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <aside className={`hidden lg:block fixed left-0 top-0 h-screen bg-white dark:bg-gray-950 shadow-lg transition-all duration-300 z-40 ${
                isCollapsed ? 'w-20' : 'w-64'
            }`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={toggleSidebar}
                                className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shrink-0 hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                                title={isCollapsed ? "Expandir" : "Recolher"}
                            >
                                <Menu className="w-6 h-6 text-white" />
                            </button>
                            {!isCollapsed && (
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">NoteCart</h2>
                                    <Image src="/cart.png" alt="NoteCart" width={42} height={42} />
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-gray-200/70 dark:bg-gray-900 text-orange-600 font-medium'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                                    }`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-3' : 'justify-between'}`}>
                            <button
                                type="button"
                                onClick={() => router.push("/profile")}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 flex-1 min-w-0'} cursor-pointer text-left`}
                                title="Perfil"
                            >
                                <div className="relative shrink-0">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Foto do usuário"
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold ${user?.photoURL ? 'hidden' : ''}`}>
                                        {getUserInitial()}
                                    </div>
                                </div>
                                {!isCollapsed && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{getUserDisplayName()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{getUserEmail()}</p>
                                    </div>
                                )}
                            </button>
                            <button
                                onClick={handleLogout}
                                className={`p-2 text-gray-500 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors duration-200 ${isCollapsed ? '' : 'shrink-0'}`}
                                title="Sair"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
