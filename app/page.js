"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, XIcon, ShoppingCart, Heart, Pill, Sparkles, Trash2, ListPlus, Plus, Edit2, Minus, Info } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { listsService } from "@/lib/services/listsService";
import { useAuth } from "@/contexts/AuthContext";
import ItemDetailsModal from "@/components/ItemDetailsModal";
import { useSearchParams, useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [listType, setListType] = useState("grocery");
  const [listName, setListName] = useState("");
  const [recentLists, setRecentLists] = useState([]);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedListName, setEditedListName] = useState("");
  const [editedListType, setEditedListType] = useState("grocery");
  const [editedItems, setEditedItems] = useState([]);
  const [editCurrentItem, setEditCurrentItem] = useState("");
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadLists = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const lists = await listsService.getAll(token);
      setRecentLists(lists);
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  }, [user]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  useEffect(() => {
    if (searchParams.get('openModal') === 'true') {
      setShowModal(true);
      router.replace('/');
    }
  }, [searchParams, router]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setListName("");
    setListType("grocery");
    setItems([]);
    setCurrentItem("");
  };

  const handleAddItem = () => {
    if (currentItem.trim()) {
      setItems([...items, { id: Date.now(), name: currentItem.trim(), quantity: 1, details: "", photoUrl: "" }]);
      setCurrentItem("");
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleSaveList = async () => {
    if (!listName.trim()) {
      alert("Por favor, insira um nome para a lista");
      return;
    }

    try {
      const token = await user.getIdToken();
      await listsService.create({
        name: listName,
        type: listType,
        items: items
      }, token);
      await loadLists();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving list:', error);
      alert('Erro ao salvar lista');
    }
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
      setEditedItems([...editedItems, { id: Date.now(), name: editCurrentItem.trim(), quantity: 1, details: "", photoUrl: "" }]);
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

  const handleDeleteListWrapper = async (id) => {
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

  const handleUpdateItemQuantity = (itemId, delta, isEditMode = false) => {
    if (isEditMode) {
      setEditedItems(editedItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }));
    } else {
      setItems(items.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }));
    }
  };

  const handleOpenItemDetails = (item, isEditMode = false) => {
    setSelectedItem({ ...item, isEditMode });
    setShowItemDetailsModal(true);
  };

  const handleSaveItemDetails = (updatedItem) => {
    if (updatedItem.isEditMode) {
      setEditedItems(editedItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    } else {
      setItems(items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    }
  };

  const handleDeleteItemFromList = async (listId, itemId) => {
    if (!confirm("Deseja realmente excluir este item?")) return;
    try {
      const token = await user.getIdToken();
      const list = recentLists.find(l => l.id === listId);
      if (!list) return;
      
      const updatedItems = list.items.filter(item => item.id !== itemId);
      await listsService.update(listId, {
        name: list.name,
        type: list.type,
        items: updatedItems
      }, token);
      await loadLists();
      
      if (selectedList && selectedList.id === listId) {
        setSelectedList({ ...selectedList, items: updatedItems });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Erro ao excluir item');
    }
  };

  const featuredList = recentLists[0] || null;
  const curatedLists = recentLists.slice(1, 3);
  const totalListsCount = recentLists.length;
  const totalItemsCount = recentLists.reduce((sum, list) => sum + (list.items?.length || 0), 0);

  const getDaysSince = (createdAt) => {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return null;
    const diffMs = Date.now() - date.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">

          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Home</h1>
          </div>

          {recentLists.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-4">
                <Image src="/cart.png" alt="Shopping Cart" width={72} height={72} />
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">Você ainda não tem listas</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Use o botão + para criar sua primeira lista</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {featuredList && (
                <div className="bg-gradient-to-br from-teal-700 to-teal-950 rounded-2xl shadow-lg p-5 sm:p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-wider text-teal-100/80">Última lista criada</p>
                    <div className="flex items-start justify-between gap-4 mt-2">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold">{featuredList.name}</h2>
                        <p className="text-sm text-teal-200 mt-1">
                          Você tem {(featuredList.items?.length || 0)} {(featuredList.items?.length || 0) === 1 ? "item" : "itens"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteListWrapper(featuredList.id)}
                        className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
                        title="Excluir lista"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleViewDetails(featuredList)}
                      className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer backdrop-blur-sm"
                    >
                      Abrir lista
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
                  <p className="text-xs text-gray-500">Listas ativas</p>
                  <p className="text-xl font-bold text-gray-900 mt-1 dark:text-slate-100">{totalListsCount}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100">
                  <p className="text-xs text-gray-500">Itens no total</p>
                  <p className="text-xl font-bold text-gray-900 mt-1 dark:text-slate-100">{totalItemsCount}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 col-span-2 sm:col-span-1 dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100">
                  <p className="text-xs text-gray-500">Última atualização</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1 dark:text-slate-100">
                    {featuredList?.createdAt && getDaysSince(featuredList.createdAt) !== null
                      ? `${getDaysSince(featuredList.createdAt)} dias`
                      : "Hoje"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Ações rápidas</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200 px-4 py-3 cursor-pointer"
                  >
                    Criar nova lista
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-colors duration-200 px-4 py-3 border border-gray-200 cursor-pointer dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100 dark:hover:bg-gray-800"
                  >
                    Adicionar item rápido
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-colors duration-200 px-4 py-3 border border-gray-200 cursor-pointer dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100 dark:hover:bg-gray-800"
                  >
                    Criar por modelo
                  </button>
                </div>
              </div>

              {curatedLists.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Sugestões</h3>
                    <Link href="/recentLists" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                      Ver mais
                    </Link>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {curatedLists.map((list) => (
                      <button
                        key={list.id}
                        type="button"
                        onClick={() => handleViewDetails(list)}
                        className="text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100"
                      >
                        <p className="text-sm font-semibold text-gray-900 truncate dark:text-slate-100">{list.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{(list.items?.length || 0)} {(list.items?.length || 0) === 1 ? "item" : "itens"}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={handleCloseModal}></div>

              <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-100 sm:mx-0 sm:size-10">
                        <ListPlus className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 id="dialog-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">Criar uma nova lista</h3>
                        <button className="absolute right-6 top-3 h-2 w-2 text-orange-500 hover:text-orange-600 cursor-pointer" onClick={handleCloseModal}>
                          <XIcon />
                        </button>
                        <div className="mt-4 space-y-4">
                          <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nome da lista:</label>
                            <input
                              type="text"
                              value={listName}
                              onChange={(e) => setListName(e.target.value)}
                              placeholder="Ex: Compras do mês"
                              className="w-full rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                            />
                          </div>
                          <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tipo de lista:</label>
                            <div className="relative">
                              <select
                                value={listType}
                                onChange={(e) => setListType(e.target.value)}
                                className="w-full rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                              >
                                <option value="grocery">Mercado</option>
                                <option value="healthcare">Saúde</option>
                                <option value="personalcare">Cuidados pessoais</option>
                                <option value="wishlist">Lista de desejos</option>
                              </select>
                              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                          </div>

                          <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Adicionar itens:</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={currentItem}
                                onChange={(e) => setCurrentItem(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite um item"
                                className="flex-1 rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                              />
                              <button
                                type="button"
                                onClick={handleAddItem}
                                className="w-8 h-8 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200 cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {items.length > 0 && (
                              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                {items.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-950 px-3 py-2 rounded-lg">
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-sm text-gray-700 dark:text-gray-200">{item.name}</span>
                                      {item.details && <Info className="w-3 h-3 text-blue-500" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-2 py-1">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateItemQuantity(item.id, -1, false)}
                                          className="text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-xs font-medium text-gray-700 min-w-[20px] text-center">{item.quantity || 1}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateItemQuantity(item.id, 1, false)}
                                          className="text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenItemDetails(item, false)}
                                        className="text-blue-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                                        title="Detalhes"
                                      >
                                        <Info className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-orange-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                      >
                                        <XIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" onClick={handleSaveList} className="inline-flex w-full justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto cursor-pointer">Salvar</button>
                    <button type="button" onClick={handleCloseModal} className="mt-3 inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:mt-0 sm:w-auto cursor-pointer items-center">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDetailsModal && selectedList && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={() => { if (!isEditMode) setShowDetailsModal(false); }}></div>

              <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-100 sm:mx-0 sm:size-10">
                        {(() => {
                          const type = isEditMode ? editedListType : selectedList.type;
                          switch (type) {
                            case "grocery":
                              return <ShoppingCart className="w-6 h-6 text-orange-500" />;
                            case "healthcare":
                              return <Pill className="w-6 h-6 text-orange-500" />;
                            case "personalcare":
                              return <Sparkles className="w-6 h-6 text-orange-500" />;
                            case "wishlist":
                              return <Heart className="w-6 h-6 text-orange-500" />;
                            default:
                              return <ShoppingCart className="w-6 h-6 text-orange-500" />;
                          }
                        })()}
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
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{selectedList.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              {(() => {
                                const labels = {
                                  grocery: "Mercado",
                                  healthcare: "Saúde",
                                  personalcare: "Cuidados pessoais",
                                  wishlist: "Lista de desejos"
                                };
                                return labels[selectedList.type] || selectedList.type;
                              })()}
                            </p>
                          </>
                        )}
                        <button
                          className="absolute right-6 top-3 text-orange-500 hover:text-red-500 cursor-pointer"
                          onClick={() => { setShowDetailsModal(false); setIsEditMode(false); }}
                        >
                          <XIcon className="w-5 h-5" />
                        </button>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                            Itens da lista ({isEditMode ? editedItems.length : selectedList.items.length})
                          </h4>
                          {(isEditMode ? editedItems : selectedList.items).length > 0 ? (
                            <div className="max-h-96 overflow-y-auto space-y-2">
                              {(isEditMode ? editedItems : selectedList.items).map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-950 px-3 py-2 rounded-lg">
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    <span className="text-sm text-gray-700 dark:text-gray-200">{item.name}</span>
                                    {item.details && <Info className="w-3 h-3 text-blue-500" />}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isEditMode ? (
                                      <>
                                        <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1">
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateItemQuantity(item.id, -1, true)}
                                            className="text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="text-xs font-medium text-gray-700 min-w-[20px] text-center">{item.quantity || 1}</span>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateItemQuantity(item.id, 1, true)}
                                            className="text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenItemDetails(item, true)}
                                          className="text-blue-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                                          title="Detalhes"
                                        >
                                          <Info className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveEditItem(item.id)}
                                          className="text-orange-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                        >
                                          <XIcon className="w-4 h-4" />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-900 rounded-lg px-2 py-1">x{item.quantity || 1}</span>
                                        {item.details && (
                                          <button
                                            type="button"
                                            onClick={() => handleOpenItemDetails(item, false)}
                                            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                            title="Ver detalhes"
                                          >
                                            <Info className="w-4 h-4" />
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteItemFromList(selectedList.id, item.id)}
                                          className="text-orange-500 hover:text-red-500 transition-colors duration-200"
                                          title="Excluir item"
                                        >
                                          <Trash2 className="w-4 h-4" />
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

          {showItemDetailsModal && selectedItem && (
            <ItemDetailsModal
              item={selectedItem}
              onClose={() => setShowItemDetailsModal(false)}
              onSave={handleSaveItemDetails}
            />
          )}
        </div>
      </main>
    </div>
  );
}
