"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, XIcon, ShoppingCart, Heart, Pill, Sparkles, Trash2, ListPlus, Plus, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { listsService } from "@/lib/services/listsService";

export default function Home() {

  const [showModal, setShowModal] = useState(false);
  const [listType, setListType] = useState("grocery");
  const [listName, setListName] = useState("");
  const [recentLists, setRecentLists] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedListName, setEditedListName] = useState("");
  const [editedListType, setEditedListType] = useState("grocery");
  const [editedItems, setEditedItems] = useState([]);
  const [editCurrentItem, setEditCurrentItem] = useState("");

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const lists = await listsService.getAll();
      setRecentLists(lists.slice(0, 3));
      setAllLists(lists.slice(3));
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

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
      setItems([...items, { id: Date.now(), name: currentItem.trim(), checked: false }]);
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
      await listsService.create({
        name: listName,
        type: listType,
        items: items
      });
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
      await listsService.update(selectedList.id, {
        name: editedListName,
        type: editedListType,
        items: editedItems
      });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">

            {recentLists.length === 0 ? (
              <div className="text-center py-10 lg:py-10">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <Image src="/cart.png" alt="Shopping Cart" width={150} height={150} />
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                  Descubra Produtos
                </h1>
                
                <p className="text-gray-600 text-lg lg:text-xl mb-8 max-w-md mx-auto">
                  Compartilhe sua lista de compras com seus amigos e familiares.
                </p>
                <button onClick={handleOpenModal} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                  Criar Lista
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Minhas Listas</h1>
                    <p className="text-gray-600 mt-1">Gerencie suas listas de compras</p>
                  </div>
                  <button
                    onClick={handleOpenModal}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer w-12 h-12 flex items-center justify-center sm:w-auto sm:h-auto sm:px-6 sm:py-3"
                    aria-label="Nova Lista"
                    title="Nova Lista"
                  >
                    <span className="sm:hidden">
                      <ListPlus className="w-6 h-6" />
                    </span>
                    <span className="hidden sm:inline">+ Nova Lista</span>
                  </button>
                </div>

                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                  {recentLists.map((list) => {
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

                    const deleteList = async (id) => {
                      try {
                        await listsService.delete(id);
                        await loadLists();
                      } catch (error) {
                        console.error('Error deleting list:', error);
                        alert('Erro ao excluir lista');
                      }
                    };

                    return (
                      <div key={list.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                              {getListIcon(list.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg/5 py-2">{list.name}</h3>
                              <p className="text-sm text-gray-500">{getListTypeLabel(list.type)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteList(list.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                            title="Excluir lista"
                          >
                            <Trash2 className="w-5 h-5 cursor-pointer" />
                          </button>
                        </div>
                        {list.items.length > 0 && (
                          <div className="mb-3">
                            <ul className="space-y-2">
                              {list.items.slice(0, 5).map((item) => (
                                <li key={item.id} className="bg-amber-50 p-2 rounded-lg text-md text-gray-600 flex items-center">
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
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {list.items.length} {list.items.length === 1 ? "item" : "itens"}
                          </span>
                          <button 
                            onClick={() => handleViewDetails(list)}
                            className="text-orange-500 hover:text-orange-600 font-medium text-sm cursor-pointer"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center">
                  <Link href="/recentLists" className="text-orange-500 hover:text-orange-600 font-medium">
                    Ver todas as listas →
                  </Link>
                </div>
              </div>
            )}

            {allLists.length > 0 && (
              <div className="mt-12">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Listas Gerais Recentes</h2>
                  <p className="text-gray-600 mt-1">Outras listas criadas recentemente</p>
                </div>

                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {allLists.map((list) => {
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

                    const deleteList = async (id) => {
                      try {
                        await listsService.delete(id);
                        await loadLists();
                      } catch (error) {
                        console.error('Error deleting list:', error);
                        alert('Erro ao excluir lista');
                      }
                    };

                    return (
                      <div key={list.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                              {getListIcon(list.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg/5 py-2">{list.name}</h3>
                              <p className="text-sm text-gray-500">{getListTypeLabel(list.type)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteList(list.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                            title="Excluir lista"
                          >
                            <Trash2 className="w-5 h-5 cursor-pointer" />
                          </button>
                        </div>
                        {list.items?.length > 0 && (
                          <div className="mb-3">
                            <ul className="space-y-2">
                              {list.items.slice(0, 5).map((item) => (
                                <li key={item.id} className="bg-amber-50 p-2 rounded-lg text-md text-gray-600 flex items-center">
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
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {list.items?.length || 0} {list.items?.length === 1 ? "item" : "itens"}
                          </span>
                          <button 
                            onClick={() => handleViewDetails(list)}
                            className="text-orange-500 hover:text-orange-600 font-medium text-sm cursor-pointer"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="fixed inset-0 bg-gray-500/75 transition-opacity" onClick={handleCloseModal}></div>
                  
                  <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-300 sm:mx-0 sm:size-10">
                            <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                              <path d="M0 72C0 58.7 10.7 48 24 48L69.3 48C96.4 48 119.6 67.4 124.4 94L124.8 96L537.5 96C557.5 96 572.6 114.2 568.9 133.9L537.8 299.8C532.1 330.1 505.7 352 474.9 352L171.3 352L176.4 380.3C178.5 391.7 188.4 400 200 400L456 400C469.3 400 480 410.7 480 424C480 437.3 469.3 448 456 448L200.1 448C165.3 448 135.5 423.1 129.3 388.9L77.2 102.6C76.5 98.8 73.2 96 69.3 96L24 96C10.7 96 0 85.3 0 72zM160 528C160 501.5 181.5 480 208 480C234.5 480 256 501.5 256 528C256 554.5 234.5 576 208 576C181.5 576 160 554.5 160 528zM384 528C384 501.5 405.5 480 432 480C458.5 480 480 501.5 480 528C480 554.5 458.5 576 432 576C405.5 576 384 554.5 384 528zM336 142.4C322.7 142.4 312 153.1 312 166.4L312 200L278.4 200C265.1 200 254.4 210.7 254.4 224C254.4 237.3 265.1 248 278.4 248L312 248L312 281.6C312 294.9 322.7 305.6 336 305.6C349.3 305.6 360 294.9 360 281.6L360 248L393.6 248C406.9 248 417.6 237.3 417.6 224C417.6 210.7 406.9 200 393.6 200L360 200L360 166.4C360 153.1 349.3 142.4 336 142.4z"/>
                            </svg>
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 id="dialog-title" className="text-base font-semibold text-gray-900">Criar uma nova lista</h3>
                            <button className="absolute right-6 top-3 h-2 w-2 text-orange-500 hover:text-orange-600 cursor-pointer" onClick={handleCloseModal}>
                              <XIcon />
                            </button>
                            <div className="mt-4 space-y-4">
                              <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da lista:</label>
                                <input
                                  type="text"
                                  value={listName}
                                  onChange={(e) => setListName(e.target.value)}
                                  placeholder="Ex: Compras do mês"
                                  className="w-full rounded-lg bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                />
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de lista:</label>     
                                <div className="relative">
                                  <select
                                    value={listType}
                                    onChange={(e) => setListType(e.target.value)}
                                    className="w-full rounded-lg bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar itens:</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={currentItem}
                                    onChange={(e) => setCurrentItem(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Digite um item"
                                    className="flex-1 rounded-lg bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
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
                                      <div key={item.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                        <span className="text-sm text-gray-700">{item.name}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveItem(item.id)}
                                          className="text-orange-500 hover:text-red-500 transition-colors duration-200"
                                        >
                                          <XIcon className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" onClick={handleSaveList} className="inline-flex w-full justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto cursor-pointer">Salvar</button>
                        <button type="button" onClick={handleCloseModal} className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer items-center">Cancelar</button>
                      </div>
                    </div>
                  </div>
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
                          {(() => {
                            const type = isEditMode ? editedListType : selectedList.type;
                            switch(type) {
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
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedList.name}</h3>
                              <p className="text-sm text-gray-500 mb-4">
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
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              Itens da lista ({isEditMode ? editedItems.length : selectedList.items.length})
                            </h4>
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
                            {(isEditMode ? editedItems : selectedList.items).length > 0 ? (
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
