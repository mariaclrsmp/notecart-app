"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Pill, Sparkles, Trash2, ChevronLeft, XIcon, Edit2, Plus, ChevronDownIcon } from "lucide-react";

export default function RecentLists() {
    const [lists, setLists] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedListName, setEditedListName] = useState("");
    const [editedListType, setEditedListType] = useState("grocery");
    const [editedItems, setEditedItems] = useState([]);
    const [editCurrentItem, setEditCurrentItem] = useState("");

    useEffect(() => {
        const savedLists = JSON.parse(localStorage.getItem("recentLists") || "[]");
        setLists(savedLists);
    }, []);

    const getListIcon = (type) => {
        switch(type) {
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

    const deleteList = (id) => {
        const updatedLists = lists.filter(list => list.id !== id);
        setLists(updatedLists);
        localStorage.setItem("recentLists", JSON.stringify(updatedLists));
    };

    const handleViewDetails = (list) => {
        setSelectedList(list);
        setShowDetailsModal(true);
        setIsEditMode(false);
        setEditedListName(list.name);
        setEditedListType(list.type);
        setEditedItems(list.items || []);
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

    const handleSaveEdit = () => {
        const updatedLists = lists.map(list => 
            list.id === selectedList.id 
                ? { ...list, name: editedListName, type: editedListType, items: editedItems }
                : list
        );
        setLists(updatedLists);
        localStorage.setItem("recentLists", JSON.stringify(updatedLists));
        setSelectedList({ ...selectedList, name: editedListName, type: editedListType, items: editedItems });
        setIsEditMode(false);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-4 sm:mb-6">
                        <Link href="/" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium mb-3 sm:mb-4">
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Voltar
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">Listas Recentes</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Suas listas de compras criadas recentemente</p>
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
                            {lists.map((list) => (
                                <div key={list.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6">
                                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                                                {getListIcon(list.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{list.name}</h3>
                                                <p className="text-xs sm:text-sm text-gray-500">{getListTypeLabel(list.type)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteList(list.id)} className="text-gray-400 hover:text-red-500 transition-colors duration-200" title="Excluir lista">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {list.items?.length > 0 && (
                                        <div className="mb-3">
                                            <ul className="space-y-2">
                                                {list.items.slice(0, 5).map((item) => (
                                                    <li key={item.id} className="bg-amber-50 p-2 rounded-lg text-sm sm:text-base text-gray-600 flex items-center">
                                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                                                        {item.name}
                                                    </li>
                                                ))}
                                            </ul>
                                            {list.items.length > 5 && (
                                                <p className="text-xs text-gray-500 mt-2">+ {list.items.length - 5} itens</p>
                                            )}
                                        </div>
                                    )}
                                    <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                                        Criada em: {formatDate(list.createdAt)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs sm:text-sm text-gray-600">
                                            {list.items.length} {list.items.length === 1 ? "item" : "itens"}
                                        </span>
                                        <button onClick={() => handleViewDetails(list)} className="text-orange-500 hover:text-orange-600 font-medium text-xs sm:text-sm cursor-pointer">
                                            Ver detalhes
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

            {showDetailsModal && selectedList && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-gray-500/75 transition-opacity" onClick={() => { if (!isEditMode) setShowDetailsModal(false); }}></div>

                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-100 sm:mx-0 sm:size-10">
                                        {getListIcon(isEditMode ? editedListType : selectedList.type)}
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        {isEditMode ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da lista:</label>
                                                    <input
                                                        type="text"
                                                        value={editedListName}
                                                        onChange={(e) => setEditedListName(e.target.value)}
                                                        className="w-full rounded-lg bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de lista:</label>
                                                    <div className="relative">
                                                        <select
                                                            value={editedListType}
                                                            onChange={(e) => setEditedListType(e.target.value)}
                                                            className="w-full rounded-lg bg-transparent text-slate-700 text-sm border border-slate-200 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
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
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedList.name}</h3>
                                                <p className="text-sm text-gray-500 mb-4">{getListTypeLabel(selectedList.type)}</p>
                                            </>
                                        )}
                                        <button className="absolute right-6 top-3 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={() => { setShowDetailsModal(false); setIsEditMode(false); }} aria-label="Fechar">
                                            <XIcon className="w-5 h-5" />
                                        </button>

                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Itens da lista ({isEditMode ? editedItems.length : selectedList.items?.length || 0})</h4>
                                            {isEditMode && (
                                                <div className="mb-3">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={editCurrentItem}
                                                            onChange={(e) => setEditCurrentItem(e.target.value)}
                                                            onKeyPress={handleEditKeyPress}
                                                            placeholder="Digite um item"
                                                            className="flex-1 rounded-lg bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
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
                                                        <div key={item.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                                            <div className="flex items-center">
                                                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                                                <span className="text-sm text-gray-700">{item.name}</span>
                                                            </div>
                                                            {isEditMode && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveEditItem(item.id)}
                                                                    className="text-orange-500 hover:text-red-500 transition-colors duration-200"
                                                                >
                                                                    <XIcon className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 text-center py-4">Nenhum item adicionado ainda</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
                                            className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleEditMode}
                                            className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer items-center gap-2"
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