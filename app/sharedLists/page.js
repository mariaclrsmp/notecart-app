"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Pill, Sparkles, ChevronLeft, XIcon, Plus, Minus, Share2, Users, Loader2 } from "lucide-react";
import { listsService } from "@/lib/services/listsService";
import { useAuth } from "@/contexts/AuthContext";

export default function SharedLists() {
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [newDirectItem, setNewDirectItem] = useState("");
    const [newDirectItemPriority, setNewDirectItemPriority] = useState("low");

    const loadSharedLists = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const sharedLists = await listsService.getShared(token);
            setLists(sharedLists);
        } catch (error) {
            console.error('Error loading shared lists:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadSharedLists();
    }, [loadSharedLists]);

    const getListIcon = (type) => {
        switch (type) {
            case "grocery": return <ShoppingCart className="w-6 h-6" />;
            case "healthcare": return <Pill className="w-6 h-6" />;
            case "personalcare": return <Sparkles className="w-6 h-6" />;
            case "wishlist": return <Heart className="w-6 h-6" />;
            default: return <ShoppingCart className="w-6 h-6" />;
        }
    };

    const getListTypeLabel = (type) => {
        const labels = { grocery: "Mercado", healthcare: "Saúde", personalcare: "Cuidados pessoais", wishlist: "Lista de desejos" };
        return labels[type] || type;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-600 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'low': default: return 'bg-green-100 text-green-600 border-green-200';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return 'Alta';
            case 'medium': return 'Média';
            case 'low': default: return 'Baixa';
        }
    };

    const handleViewDetails = (list) => {
        setSelectedList(list);
        setShowDetailsModal(true);
        setNewDirectItem("");
        setNewDirectItemPriority("low");
    };

    const handleToggleItemChecked = async (itemId) => {
        if (!selectedList) return;
        const updatedItems = selectedList.items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        try {
            const token = await user.getIdToken();
            await listsService.update(selectedList.id, { ...selectedList, items: updatedItems }, token);
            setSelectedList({ ...selectedList, items: updatedItems });
            await loadSharedLists();
        } catch (error) {
            console.error('Error toggling item:', error);
        }
    };

    const handleAddItemToExistingList = async () => {
        if (!newDirectItem.trim() || !selectedList) return;
        const newItem = { id: Date.now(), name: newDirectItem.trim(), quantity: 1, details: "", photoUrl: "", checked: false, priority: newDirectItemPriority };
        const updatedItems = [...selectedList.items, newItem];
        try {
            const token = await user.getIdToken();
            await listsService.update(selectedList.id, { ...selectedList, items: updatedItems }, token);
            setSelectedList({ ...selectedList, items: updatedItems });
            await loadSharedLists();
            setNewDirectItem("");
            setNewDirectItemPriority("low");
        } catch (error) {
            console.error('Error adding item to list:', error);
        }
    };

    const handleDirectItemKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddItemToExistingList();
        }
    };

    const handleUpdateItemQuantityDirect = async (itemId, delta) => {
        if (!selectedList) return;
        const updatedItems = selectedList.items.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) };
            }
            return item;
        });
        try {
            const token = await user.getIdToken();
            await listsService.update(selectedList.id, { ...selectedList, items: updatedItems }, token);
            setSelectedList({ ...selectedList, items: updatedItems });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-4 sm:mb-6">
                        <Link href="/" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium mb-3 sm:mb-4">
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Voltar
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2 mb-4">Listas Compartilhadas</h1>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : lists.length === 0 ? (
                        <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                            <Users className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Nenhuma lista compartilhada</h2>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Quando alguém compartilhar uma lista com você, ela aparecerá aqui.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                            {lists.map((list) => {
                                const getIconColor = (type) => {
                                    switch (type) {
                                        case "grocery": return "bg-blue-100 text-blue-600";
                                        case "healthcare": return "bg-red-100 text-red-600";
                                        case "personalcare": return "bg-purple-100 text-purple-600";
                                        case "wishlist": return "bg-pink-100 text-pink-600";
                                        default: return "bg-blue-100 text-blue-600";
                                    }
                                };
                                return (
                                    <div key={list.id} className="bg-gradient-to-br from-indigo-700 to-indigo-950 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-5 sm:p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-12 h-12 ${getIconColor(list.type)} rounded-2xl flex items-center justify-center shadow-md`}>
                                                        {getListIcon(list.type)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">{list.name}</h3>
                                                        <p className="text-sm text-indigo-200">{list.items?.length || 0} {(list.items?.length || 0) === 1 ? "produto" : "produtos"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2 mb-3">
                                                <Share2 className="w-3.5 h-3.5 text-indigo-300" />
                                                <span className="text-xs text-indigo-200 truncate">Compartilhada por {list.ownerName || list.ownerEmail || "Desconhecido"}</span>
                                            </div>
                                            <button onClick={() => handleViewDetails(list)} className="w-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer backdrop-blur-sm">
                                                Ver detalhes
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {showDetailsModal && selectedList && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={() => setShowDetailsModal(false)}></div>
                            <div className="flex min-h-full items-center justify-center p-4 pb-20 sm:pb-4">
                                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-3xl max-h-[calc(100dvh-96px)] sm:max-h-[85vh] flex flex-col">
                                    <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:size-10">
                                                {getListIcon(selectedList.type)}
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{selectedList.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{getListTypeLabel(selectedList.type)}</p>
                                                <div className="flex items-center gap-1.5 mt-1 mb-4">
                                                    <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span className="text-xs text-indigo-600 dark:text-indigo-400">Compartilhada por {selectedList.ownerName || selectedList.ownerEmail || "Desconhecido"}</span>
                                                </div>
                                                <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" onClick={() => setShowDetailsModal(false)}>
                                                    <XIcon className="w-5 h-5" />
                                                </button>

                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Itens da lista ({selectedList.items?.length || 0})</h4>
                                                    <div className="mb-3 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <input type="text" value={newDirectItem} onChange={(e) => setNewDirectItem(e.target.value)} onKeyPress={handleDirectItemKeyPress} placeholder="Adicionar novo item..." className="flex-1 min-w-0 rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md" />
                                                            <button type="button" onClick={handleAddItemToExistingList} disabled={!newDirectItem.trim()} className="w-9 h-9 shrink-0 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Prioridade:</span>
                                                            <button type="button" onClick={() => setNewDirectItemPriority('high')} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors duration-200 cursor-pointer ${newDirectItemPriority === 'high' ? 'bg-red-500 text-white border-red-500' : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'}`}>Alta</button>
                                                            <button type="button" onClick={() => setNewDirectItemPriority('medium')} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors duration-200 cursor-pointer ${newDirectItemPriority === 'medium' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200'}`}>Média</button>
                                                            <button type="button" onClick={() => setNewDirectItemPriority('low')} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors duration-200 cursor-pointer ${newDirectItemPriority === 'low' ? 'bg-green-500 text-white border-green-500' : 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200'}`}>Baixa</button>
                                                        </div>
                                                    </div>
                                                    {selectedList.items?.length > 0 ? (
                                                        <div className="max-h-96 overflow-y-auto space-y-2">
                                                            {selectedList.items.map((item) => (
                                                                <div key={item.id} className={`flex items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-950 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg transition-all ${item.checked ? 'opacity-60' : ''}`}>
                                                                    <input type="checkbox" checked={item.checked || false} onChange={() => handleToggleItemChecked(item.id)} className="w-4 h-4 text-orange-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-orange-500 cursor-pointer shrink-0" />
                                                                    <div className="flex flex-col flex-1 min-w-0">
                                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                                            <span className={`text-sm text-gray-700 dark:text-gray-200 truncate ${item.checked ? 'line-through' : ''}`}>{item.name}</span>
                                                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${getPriorityColor(item.priority)}`}>{getPriorityLabel(item.priority)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                                                        <div className="flex items-center gap-0.5 bg-white dark:bg-gray-900 rounded-lg px-1.5 py-1">
                                                                            <button type="button" onClick={() => handleUpdateItemQuantityDirect(item.id, -1)} className="text-orange-500 hover:text-orange-600 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                                                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 min-w-[20px] text-center">{item.quantity || 1}</span>
                                                                            <button type="button" onClick={() => handleUpdateItemQuantityDirect(item.id, 1)} className="text-orange-500 hover:text-orange-600 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Nenhum item adicionado ainda</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 flex justify-end sm:px-6 flex-shrink-0">
                                        <button type="button" onClick={() => setShowDetailsModal(false)} className="inline-flex justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                            Fechar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
