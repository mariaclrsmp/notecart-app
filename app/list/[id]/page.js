"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, Pill, Sparkles, Heart, Loader2, CheckSquare, Square } from "lucide-react";

export default function PublicListPage() {
    const { id } = useParams();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchList() {
            try {
                const res = await fetch(`/api/lists/${id}/public`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setList(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchList();
    }, [id]);

    const getListIcon = (type) => {
        switch (type) {
            case "grocery": return <ShoppingCart className="w-6 h-6 text-blue-600" />;
            case "healthcare": return <Pill className="w-6 h-6 text-red-600" />;
            case "personalcare": return <Sparkles className="w-6 h-6 text-purple-600" />;
            case "wishlist": return <Heart className="w-6 h-6 text-pink-600" />;
            default: return <ShoppingCart className="w-6 h-6 text-blue-600" />;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case "grocery": return "bg-blue-100";
            case "healthcare": return "bg-red-100";
            case "personalcare": return "bg-purple-100";
            case "wishlist": return "bg-pink-100";
            default: return "bg-blue-100";
        }
    };

    const getTypeLabel = (type) => {
        const labels = { grocery: "Mercado", healthcare: "Saúde", personalcare: "Cuidados pessoais", wishlist: "Lista de desejos" };
        return labels[type] || type;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "bg-red-100 text-red-600 border-red-200";
            case "medium": return "bg-yellow-100 text-yellow-600 border-yellow-200";
            default: return "bg-green-100 text-green-600 border-green-200";
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case "high": return "Alta";
            case "medium": return "Média";
            default: return "Baixa";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Carregando lista...</p>
                </div>
            </div>
        );
    }

    if (error || !list) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Lista não encontrada</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Esta lista pode ter sido removida ou o link é inválido.</p>
                    <a href="/login" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full transition-colors duration-200">
                        Entrar no NoteCart
                    </a>
                </div>
            </div>
        );
    }

    const checkedCount = list.items.filter(i => i.checked).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-br from-teal-700 to-teal-950 text-white">
                <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 ${getIconBg(list.type)} rounded-2xl flex items-center justify-center shadow-md`}>
                            {getListIcon(list.type)}
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">{list.name}</h1>
                            <p className="text-sm text-teal-200">{getTypeLabel(list.type)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-teal-200">
                        <span>{list.items.length} {list.items.length === 1 ? "item" : "itens"}</span>
                        <span>{checkedCount}/{list.items.length} concluídos</span>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6">
                {list.items.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Esta lista está vazia.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {list.items.map((item) => (
                            <div key={item.id} className={`flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 transition-all ${item.checked ? "opacity-60" : ""}`}>
                                {item.checked ? (
                                    <CheckSquare className="w-5 h-5 text-orange-500 shrink-0" />
                                ) : (
                                    <Square className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" />
                                )}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-sm font-medium text-gray-700 dark:text-gray-200 ${item.checked ? "line-through" : ""}`}>{item.name}</span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${getPriorityColor(item.priority)}`}>
                                            {getPriorityLabel(item.priority)}
                                        </span>
                                    </div>
                                    {item.details && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.details}</span>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 shrink-0">
                                    x{item.quantity || 1}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Compartilhado via NoteCart</p>
                    <a href="/login" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full transition-colors duration-200 text-sm">
                        Abrir no NoteCart
                    </a>
                </div>
            </div>
        </div>
    );
}
