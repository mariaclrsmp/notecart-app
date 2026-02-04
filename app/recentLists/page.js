"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Pill, Sparkles, Trash2, ChevronLeft, XIcon, Edit2, Plus, ChevronDownIcon, Image as ImageIcon, Info, Minus } from "lucide-react";
import { listsService } from "@/lib/services/listsService";
import { useAuth } from "@/contexts/AuthContext";

export default function RecentLists() {
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("recent");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedListName, setEditedListName] = useState("");
    const [editedListType, setEditedListType] = useState("grocery");
    const [editedItems, setEditedItems] = useState([]);
    const [editCurrentItem, setEditCurrentItem] = useState("");

    const loadLists = useCallback(async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const fetchedLists = await listsService.getAll(token);
            setLists(fetchedLists);
        } catch (error) {
            console.error('Error loading lists:', error);
        }
    }, [user]);

    useEffect(() => {
        loadLists();
    }, [loadLists]);

    const displayedLists = useMemo(() => {
        const getCreatedAtMs = (createdAt) => {
            if (!createdAt) return 0;
            if (typeof createdAt === "string" || createdAt instanceof Date) {
                const ms = new Date(createdAt).getTime();
                return Number.isNaN(ms) ? 0 : ms;
            }
            if (typeof createdAt === "object" && typeof createdAt.seconds === "number") {
                return createdAt.seconds * 1000;
            }
            return 0;
        };

        const q = searchQuery.trim().toLowerCase();

        const filtered = lists.filter((list) => {
            const matchesQuery = q.length === 0 || (list.name || "").toLowerCase().includes(q);
            const matchesType = typeFilter === "all" || list.type === typeFilter;
            return matchesQuery && matchesType;
        });

        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === "alpha") {
                return (a.name || "").localeCompare(b.name || "", "pt-BR", { sensitivity: "base" });
            }
            if (sortBy === "items") {
                return (b.items?.length || 0) - (a.items?.length || 0);
            }
            return getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt);
        });

        return sorted;
    }, [lists, searchQuery, typeFilter, sortBy]);

    const getListIcon = (type) => {
        switch (type) {
            case "grocery":
                return <ShoppingCart className="w-6 h-6" />;
            case "healthcare":
                return <Pill className="w-6 h-6" />;
            case "personalcare":
                return <Sparkles className="w-6 h-6" />;
            case "wishlist":
                return <Heart className="w-6 h-6" />;
            default:
                return <ShoppingCart className="w-6 h-6" />;
        }
    };

    const getListTypeLabel = (type) => {
        const labels = {
            grocery: "Mercado",
            healthcare: "Saúde",
            personalcare: "Cuidados pessoais",
            wishlist: "Lista de desejos"
        };
        return labels[type] || type;
    };

    const handleDeleteList = async (id) => {
        if (!confirm("Deseja realmente excluir esta lista?")) return;
        try {
            const token = await user.getIdToken();
            await listsService.delete(id, token);
            await loadLists();
        } catch (error) {
            console.error('Error deleting list:', error);
            alert('Erro ao excluir lista');
        }
    };

    const handleViewDetails = (list) => {
        setSelectedList(list);
        setShowDetailsModal(true);
        setIsEditMode(false);
        setEditedListName(list.name);
        setEditedListType(list.type);
        setEditedItems(list.items || []);
        setEditCurrentItem("");
    };

    const handleEditMode = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditedListName(selectedList.name);
        setEditedListType(selectedList.type);
        setEditedItems(selectedList.items || []);
        setEditCurrentItem("");
    };

    const handleSaveEdit = async () => {
        try {
            const token = await user.getIdToken();
            await listsService.update(selectedList.id, {
                name: editedListName,
                type: editedListType,
                items: editedItems
            }, token);
            await loadLists();
            setSelectedList({ ...selectedList, name: editedListName, type: editedListType, items: editedItems });
            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating list:', error);
            alert('Erro ao atualizar lista');
        }
    };

    const handleAddEditItem = () => {
        if (editCurrentItem.trim()) {
            setEditedItems([...editedItems, { id: Date.now(), name: editCurrentItem.trim() }]);
            setEditCurrentItem("");
        }
    };

    const handleRemoveEditItem = (itemId) => {
        setEditedItems(editedItems.filter(item => item.id !== itemId));
    };

    const handleEditKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAddEditItem();
        }
    };

    const handleUpdateItemQuantity = (itemId, delta, isEditMode = false) => {
        if (isEditMode) {
            setEditedItems(editedItems.map(item => {
                if (item.id === itemId) {
                    const newQuantity = Math.max(0, (item.quantity || 1) + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }));
        }
    };

    const handleToggleItemChecked = async (itemId, isEditMode = false) => {
        if (isEditMode) {
            setEditedItems(editedItems.map(item => 
                item.id === itemId ? { ...item, checked: !item.checked } : item
            ));
        } else {
            const updatedItems = selectedList.items.map(item => 
                item.id === itemId ? { ...item, checked: !item.checked } : item
            );
            try {
                const token = await user.getIdToken();
                await listsService.update(selectedList.id, {
                    ...selectedList,
                    items: updatedItems
                }, token);
                setSelectedList({ ...selectedList, items: updatedItems });
                await loadLists();
            } catch (error) {
                console.error('Error toggling item:', error);
            }
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2 mb-4">Listas Recentes</h1>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
                        <div className="grid gap-3 sm:grid-cols-3">

                            <div className="sm:col-span-1">
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Buscar</label>
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Digite o nome da lista"
                                    className="w-full rounded-xl bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-200 focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Filtro</label>
                                <div className="relative">
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full rounded-xl bg-transparent text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-200 focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm appearance-none cursor-pointer"
                                    >

                                        <option value="all">Todos os tipos</option>
                                        <option value="grocery">Mercado</option>
                                        <option value="healthcare">Saúde</option>
                                        <option value="personalcare">Cuidados pessoais</option>
                                        <option value="wishlist">Lista de desejos</option>
                                    </select>
                                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Ordenação</label>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full rounded-xl bg-transparent text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-200 focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm appearance-none cursor-pointer"
                                    >

                                        <option value="recent">Mais recentes</option>
                                        <option value="alpha">Alfabética</option>
                                        <option value="items">Mais itens</option>
                                    </select>
                                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {lists.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg shadow-sm p-4">
                            <ShoppingCart className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Nenhuma lista criada ainda</h2>
                            <p className="text-sm sm:text-base text-gray-500 mb-5">Crie sua primeira lista para começar!</p>
                            <Link href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-full transition-colors duration-200">
                                Criar Lista
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                            {displayedLists.length === 0 ? (
                                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                                    <p className="text-sm text-gray-600">Nenhuma lista encontrada com esses critérios.</p>
                                </div>
                            ) : displayedLists.map((list) => {
                                const getIconColor = (type) => {
                                    switch (type) {
                                        case "grocery":
                                            return "bg-blue-100 text-blue-600";
                                        case "healthcare":
                                            return "bg-red-100 text-red-600";
                                        case "personalcare":
                                            return "bg-purple-100 text-purple-600";
                                        case "wishlist":
                                            return "bg-pink-100 text-pink-600";
                                        default:
                                            return "bg-blue-100 text-blue-600";
                                    }
                                };

                                return (
                                    <div key={list.id} className="bg-gradient-to-br from-teal-700 to-teal-950 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-5 sm:p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-12 h-12 ${getIconColor(list.type)} rounded-2xl flex items-center justify-center shadow-md`}>
                                                        {getListIcon(list.type)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">{list.name}</h3>
                                                        <p className="text-sm text-teal-200">{list.items.length} {list.items.length === 1 ? "produto" : "produtos"}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteList(list.id)} className="text-white/60 hover:text-white transition-colors duration-200" title="Excluir lista">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleViewDetails(list)}
                                                className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer backdrop-blur-sm"
                                            >
                                                Ver na loja
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {showDetailsModal && selectedList && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={() => { if (!isEditMode) setShowDetailsModal(false); }}></div>

                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                                    <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-100 sm:mx-0 sm:size-10">
                                                {getListIcon(isEditMode ? editedListType : selectedList.type)}
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">

                                                {isEditMode ? (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nome da lista:</label>
                                                            <input
                                                                type="text"
                                                                value={editedListName}
                                                                onChange={(e) => setEditedListName(e.target.value)}
                                                                className="w-full rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tipo de lista:</label>
                                                            <div className="relative">
                                                                <select
                                                                    value={editedListType}
                                                                    onChange={(e) => setEditedListType(e.target.value)}
                                                                    className="w-full rounded-lg bg-transparent text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                                                                >
                                                                    <option value="grocery">Mercado</option>
                                                                    <option value="healthcare">Saúde</option>
                                                                    <option value="personalcare">Cuidados pessoais</option>
                                                                    <option value="wishlist">Lista de desejos</option>
                                                                </select>
                                                                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{selectedList.name}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{getListTypeLabel(selectedList.type)}</p>
                                                    </>
                                                )}
                                                <button className="absolute right-6 top-3 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={() => { setShowDetailsModal(false); setIsEditMode(false); }} aria-label="Fechar">
                                                    <XIcon className="w-5 h-5" />
                                                </button>

                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Itens da lista ({isEditMode ? editedItems.length : selectedList.items?.length || 0})</h4>
                                                    {isEditMode && (
                                                        <div className="mb-3">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={editCurrentItem}
                                                                    onChange={(e) => setEditCurrentItem(e.target.value)}
                                                                    onKeyPress={handleEditKeyPress}
                                                                    placeholder="Digite um item"
                                                                    className="flex-1 rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={handleAddEditItem}
                                                                    className="w-8 h-8 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200 cursor-pointer"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(isEditMode ? editedItems : selectedList.items)?.length > 0 ? (
                                                        <div className="max-h-96 overflow-y-auto space-y-2">
                                                            {(isEditMode ? editedItems : selectedList.items).map((item) => (
                                                                <div key={item.id} className={`flex items-center gap-3 bg-gray-50 dark:bg-gray-950 px-3 py-3 rounded-lg transition-all ${item.checked ? 'opacity-60' : ''}`}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.checked || false}
                                                                        onChange={() => handleToggleItemChecked(item.id, isEditMode)}
                                                                        className="w-4 h-4 text-orange-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-orange-500 cursor-pointer"
                                                                    />
                                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                        <span className={`text-sm text-gray-700 dark:text-gray-200 truncate ${item.checked ? 'line-through' : ''}`}>{item.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        {isEditMode ? (
                                                                            <>
                                                                                <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-2 py-1">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleUpdateItemQuantity(item.id, -1, true)}
                                                                                        className="text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                                                                                    >
                                                                                        <Minus className="w-4 h-4" />
                                                                                    </button>
                                                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 min-w-[24px] text-center">{item.quantity || 1}</span>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleUpdateItemQuantity(item.id, 1, true)}
                                                                                        className="text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                                                                                    >
                                                                                        <Plus className="w-4 h-4" />
                                                                                    </button>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="text-green-500 hover:text-green-600 transition-colors duration-200 cursor-pointer"
                                                                                    title="Adicionar imagem"
                                                                                >
                                                                                    <ImageIcon className="w-5 h-5" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleRemoveEditItem(item.id)}
                                                                                    className="text-orange-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                                                                >
                                                                                    <XIcon className="w-5 h-5" />
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-900 rounded-lg px-2 py-1">x{item.quantity || 1}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    className="text-green-500 hover:text-green-600 transition-colors duration-200"
                                                                                    title="Ver imagem"
                                                                                >
                                                                                    <ImageIcon className="w-5 h-5" />
                                                                                </button>
                                                                            </>
                                                                        )}
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
                                    <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        {isEditMode ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleSaveEdit}
                                                    className="inline-flex w-full justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto cursor-pointer"
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="mt-3 inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:mt-0 sm:w-auto cursor-pointer"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleEditMode}
                                                    className="mt-3 inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:mt-0 sm:w-auto cursor-pointer items-center gap-2"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Editar
                                                </button>
                                            </>
                                        )}
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