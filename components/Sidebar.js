"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, List, Share2, Settings, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

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

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    const isActive = (path) => pathname === path;

    const menuItems = [
        { path: "/", label: "Início", icon: Home },
        { path: "/recentLists", label: "Listas Recentes", icon: List },
        { path: "/sharedLists", label: "Listas Compartilhadas", icon: Share2 },
        { path: "/settings", label: "Configurações", icon: Settings }
    ];

    return (
        <>
            <button
                onClick={toggleMobileSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-200"
                aria-label="Menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeMobileSidebar}
                ></div>
            )}

            <aside className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 z-40 ${
                isCollapsed ? 'w-20' : 'w-64'
            } ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between border-b border-gray-100">
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
                                    <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">NoteCart</h2>
                                    <Image src="/cart.png" alt="NoteCart" width={42} height={42} />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={closeMobileSidebar}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            aria-label="Fechar menu"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={closeMobileSidebar}
                                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-4 py-3 rounded-lg transition-all duration-200 ${
                                        isActive(item.path)
                                            ? 'bg-orange-100 text-orange-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                                N
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">Usuário</p>
                                    <p className="text-xs text-gray-500 truncate">user@email.com</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
