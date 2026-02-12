"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, XIcon, ShoppingCart, Heart, Pill, Sparkles, Trash2, ListPlus, Plus, Edit2, Minus, Info, Image as ImageIcon, ListIcon, RotateCw, Share2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { listsService } from "@/lib/services/listsService";
import { useAuth } from "@/contexts/AuthContext";
import ItemDetailsModal from "@/components/ItemDetailsModal";
import ShareModal from "@/components/ShareModal";
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
  const [currentItemDetails, setCurrentItemDetails] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedListName, setEditedListName] = useState("");
  const [editedListType, setEditedListType] = useState("grocery");
  const [editedItems, setEditedItems] = useState([]);
  const [editCurrentItem, setEditCurrentItem] = useState("");
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [imageItemId, setImageItemId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [templateItems, setTemplateItems] = useState([]);
  const [selectedTemplateType, setSelectedTemplateType] = useState("grocery");
  const [currentItemPriority, setCurrentItemPriority] = useState("low");
  const [newDirectItem, setNewDirectItem] = useState("");
  const [newDirectItemPriority, setNewDirectItemPriority] = useState("low");
  const [shareTarget, setShareTarget] = useState(null);

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
    setCurrentItemDetails("");
  };

  const handleEditLastList = () => {
    if (featuredList) {
      handleViewDetails(featuredList);
      setIsEditMode(true);
    }
  };

  const getTemplates = () => ({
    grocery: {
      name: "Lista de Compras Básica",
      items: [
        { id: Date.now() + 1, name: "Arroz", quantity: 1, details: "5kg", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 2, name: "Feijão", quantity: 1, details: "1kg", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 3, name: "Óleo", quantity: 1, details: "900ml", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 4, name: "Açúcar", quantity: 1, details: "1kg", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 5, name: "Sal", quantity: 1, details: "1kg", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 6, name: "Café", quantity: 1, details: "500g", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 7, name: "Leite", quantity: 2, details: "1L", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 8, name: "Pão", quantity: 1, details: "Francês", photoUrl: "", checked: false, priority: "low" }
      ]
    },
    healthcare: {
      name: "Kit Farmácia Básico",
      items: [
        { id: Date.now() + 1, name: "Dipirona", quantity: 1, details: "500mg", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 2, name: "Paracetamol", quantity: 1, details: "750mg", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 3, name: "Ibuprofeno", quantity: 1, details: "600mg", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 4, name: "Soro Fisiológico", quantity: 2, details: "100ml", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 5, name: "Band-aid", quantity: 1, details: "Caixa", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 6, name: "Álcool 70%", quantity: 1, details: "1L", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 7, name: "Termômetro", quantity: 1, details: "Digital", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 8, name: "Vitamina C", quantity: 1, details: "1g", photoUrl: "", checked: false, priority: "low" }
      ]
    },
    personalcare: {
      name: "Cuidados Pessoais Essenciais",
      items: [
        { id: Date.now() + 1, name: "Shampoo", quantity: 1, details: "400ml", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 2, name: "Condicionador", quantity: 1, details: "400ml", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 3, name: "Sabonete", quantity: 3, details: "90g", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 4, name: "Pasta de dente", quantity: 1, details: "90g", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 5, name: "Desodorante", quantity: 1, details: "150ml", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 6, name: "Papel higiênico", quantity: 1, details: "Pacote 12 rolos", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 7, name: "Absorvente", quantity: 1, details: "Pacote", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 8, name: "Hidratante", quantity: 1, details: "200ml", photoUrl: "", checked: false, priority: "low" }
      ]
    },
    wishlist: {
      name: "Lista de Desejos",
      items: [
        { id: Date.now() + 1, name: "Livro", quantity: 1, details: "Título desejado", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 2, name: "Fone de ouvido", quantity: 1, details: "Bluetooth", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 3, name: "Tênis", quantity: 1, details: "Tamanho", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 4, name: "Relógio", quantity: 1, details: "Modelo", photoUrl: "", checked: false, priority: "low" },
        { id: Date.now() + 5, name: "Mochila", quantity: 1, details: "Cor preferida", photoUrl: "", checked: false, priority: "low" }
      ]
    }
  });

  const handleCreateFromTemplate = () => {
    setSelectedTemplateType("grocery");
    const templates = getTemplates();
    setTemplateItems(templates.grocery.items);
    setShowTemplatePreview(true);
  };

  const handleTemplateTypeChange = (type) => {
    setSelectedTemplateType(type);
    const templates = getTemplates();
    setTemplateItems(templates[type].items);
  };

  const handleApproveTemplate = async () => {
    const templates = getTemplates();
    const templateName = templates[selectedTemplateType].name;

    try {
      const token = await user.getIdToken();
      await listsService.create({
        name: templateName,
        type: selectedTemplateType,
        items: templateItems
      }, token);
      await loadLists();
      setShowTemplatePreview(false);
      setTemplateItems([]);
      setSelectedTemplateType("grocery");
    } catch (error) {
      console.error('Error creating template list:', error);
    }
  };

  const handleCancelTemplate = () => {
    setShowTemplatePreview(false);
    setTemplateItems([]);
    setSelectedTemplateType("grocery");
  };

  const handleAddItem = () => {
    if (currentItem.trim()) {
      setItems([...items, { id: Date.now(), name: currentItem.trim(), quantity: 1, details: currentItemDetails.trim(), photoUrl: "", priority: currentItemPriority }]);
      setCurrentItem("");
      setCurrentItemDetails("");
      setCurrentItemPriority("low");
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleOpenImagePopup = (itemId) => {
    const item = items.find(i => i.id === itemId);
    setImageItemId(itemId);
    setImageUrl(item?.photoUrl || "");
    setShowImagePopup(true);
  };

  const handleSaveImage = () => {
    if (imageUrl.trim()) {
      setItems(items.map(item => 
        item.id === imageItemId ? { ...item, photoUrl: imageUrl.trim() } : item
      ));
    }
    setShowImagePopup(false);
    setImageUrl("");
    setImageItemId(null);
  };

  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
    setImageUrl("");
    setImageItemId(null);
  };

  const handleToggleImageExpand = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
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
      setEditedItems([...editedItems, { id: Date.now(), name: editCurrentItem.trim(), quantity: 1, details: "", photoUrl: "", priority: "low" }]);
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
          const newQuantity = Math.max(0, (item.quantity || 1) + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }));
    } else {
      setItems(items.map(item => {
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

  const handleUpdateItemQuantityDirect = async (itemId, delta) => {
    const updatedItems = selectedList.items.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, (item.quantity || 1) + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    try {
      const token = await user.getIdToken();
      await listsService.update(selectedList.id, {
        ...selectedList,
        items: updatedItems
      }, token);
      setSelectedList({ ...selectedList, items: updatedItems });
      await loadLists();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleOpenItemDetails = (item, isEditMode = false) => {
    setSelectedItem({ ...item, isEditMode });
    setShowItemDetailsModal(true);
  };

  const handleSaveItemDetails = async (updatedItem) => {
    if (updatedItem.isEditMode) {
      setEditedItems(editedItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    } else {
      const updatedItems = selectedList.items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
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
        console.error('Error updating item details:', error);
      }
    }
  };

  const handleAddItemToExistingList = async () => {
    if (!newDirectItem.trim() || !selectedList) return;
    const newItem = { id: Date.now(), name: newDirectItem.trim(), quantity: 1, details: "", photoUrl: "", checked: false, priority: newDirectItemPriority };
    const updatedItems = [...selectedList.items, newItem];
    try {
      const token = await user.getIdToken();
      await listsService.update(selectedList.id, {
        ...selectedList,
        items: updatedItems
      }, token);
      setSelectedList({ ...selectedList, items: updatedItems });
      await loadLists();
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'low':
      default:
        return 'bg-green-100 text-green-600 border-green-200';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta prioridade';
      case 'medium':
        return 'Média prioridade';
      case 'low':
      default:
        return 'Baixa prioridade';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="p-4 sm:p-6 lg:p-8">
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
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl shadow-md flex items-center justify-center shrink-0 ${
                          featuredList.type === 'grocery' ? 'bg-blue-100' :
                          featuredList.type === 'healthcare' ? 'bg-red-100' :
                          featuredList.type === 'personalcare' ? 'bg-purple-100' :
                          'bg-pink-100'
                        }`}>
                          {featuredList.type === 'grocery' && <ShoppingCart className={`w-6 h-6 text-blue-600`} />}
                          {featuredList.type === 'healthcare' && <Pill className={`w-6 h-6 text-red-600`} />}
                          {featuredList.type === 'personalcare' && <Sparkles className={`w-6 h-6 text-purple-600`} />}
                          {featuredList.type === 'wishlist' && <Heart className={`w-6 h-6 text-pink-600`} />}
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold">{featuredList.name}</h2>
                          <p className="text-sm text-teal-200 mt-1">
                            Você tem {(featuredList.items?.length || 0)} {(featuredList.items?.length || 0) === 1 ? "item" : "itens"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShareTarget({ id: featuredList.id, name: featuredList.name, items: featuredList.items || [] })}
                          className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
                          title="Compartilhar lista"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteListWrapper(featuredList.id)}
                          className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
                          title="Excluir lista"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100">
                  <p className="text-xs text-gray-500 mb-2">Total de listas</p>
                  <div className="flex items-center gap-2">
                    <ListIcon className="w-6 h-6" />
                    <p className="text-xl font-bold text-gray-900 mt-1 dark:text-slate-100">{totalListsCount}</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100">
                  <p className="text-xs text-gray-500 mb-2">Última atualização</p>
                  <div className="flex items-center gap-2">
                    <RotateCw className="w-6 h-6" />
                    <p className="text-md font-semibold text-gray-900 mt-1 dark:text-slate-100">
                      {featuredList?.createdAt && getDaysSince(featuredList.createdAt) !== null
                        ? `${getDaysSince(featuredList.createdAt)} dias`
                        : "Hoje"}
                    </p>
                  </div>
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
                    onClick={handleEditLastList}
                    disabled={!featuredList}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-colors duration-200 px-4 py-3 border border-gray-200 cursor-pointer dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Editar última lista
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateFromTemplate}
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
                      <div
                        key={list.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 dark:bg-gray-900 dark:border-gray-800 dark:text-slate-100"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(list)}
                            className="text-left flex-1 min-w-0 cursor-pointer"
                          >
                            <p className="text-sm font-semibold text-gray-900 truncate dark:text-slate-100">{list.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{(list.items?.length || 0)} {(list.items?.length || 0) === 1 ? "item" : "itens"}</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShareTarget({ id: list.id, name: list.name, items: list.items || [] })}
                            className="text-gray-400 hover:text-orange-500 transition-colors duration-200 cursor-pointer shrink-0 mt-0.5"
                            title="Compartilhar lista"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={handleCloseModal}></div>

              <div className="flex min-h-full items-center justify-center p-4 pb-[calc(96px+env(safe-area-inset-bottom))] sm:pb-4 text-center">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-3xl max-h-[calc(100dvh-96px)] sm:max-h-[85vh] flex flex-col">
                  <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-100 sm:mx-0 sm:size-10">
                        <ListPlus className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 id="dialog-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">Criar uma nova lista</h3>
                        <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" onClick={handleCloseModal}>
                          <XIcon className="w-6 h-6" />
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
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-nowrap">
                                <input
                                  type="text"
                                  value={currentItem}
                                  onChange={(e) => setCurrentItem(e.target.value)}
                                  onKeyPress={handleKeyPress}
                                  placeholder="Nome do item"
                                  className="flex-1 min-w-0 rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-2.5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddItem}
                                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200 cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleOpenImagePopup}
                                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full transition-colors duration-200 cursor-pointer"
                                  title="Anexar imagem"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={currentItemDetails}
                                onChange={(e) => setCurrentItemDetails(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Descrição (opcional): marca, tamanho..."
                                className="w-full rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                              />
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Prioridade:</label>
                                <div className="flex gap-1.5 flex-wrap">
                                  <button type="button" onClick={() => setCurrentItemPriority('high')} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors duration-200 cursor-pointer ${currentItemPriority === 'high' ? 'bg-red-500 text-white border-red-500' : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'}`}>Alta</button>
                                  <button type="button" onClick={() => setCurrentItemPriority('medium')} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors duration-200 cursor-pointer ${currentItemPriority === 'medium' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200'}`}>Média</button>
                                  <button type="button" onClick={() => setCurrentItemPriority('low')} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors duration-200 cursor-pointer ${currentItemPriority === 'low' ? 'bg-green-500 text-white border-green-500' : 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200'}`}>Baixa</button>
                                </div>
                              </div>
                            </div>

                            {items.length > 0 && (
                              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                {items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-950 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg">
                                    {item.photoUrl && (
                                      <img 
                                        src={item.photoUrl} 
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                                      />
                                    )}
                                    <div className="flex flex-col flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{item.name}</span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${getPriorityColor(item.priority)}`}>
                                          {getPriorityLabel(item.priority)}
                                        </span>
                                      </div>
                                      {item.details && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.details}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                      <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-1.5 py-1">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateItemQuantity(item.id, -1, false)}
                                          className="text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200 min-w-[20px] text-center">{item.quantity || 1}</span>
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
                                        onClick={() => handleOpenImagePopup(item.id)}
                                        className="text-green-500 hover:text-green-600 transition-colors duration-200 cursor-pointer"
                                        title="Adicionar/editar imagem"
                                      >
                                        <ImageIcon className="w-4 h-4" />
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
                  <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:px-6 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:w-auto cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveList}
                      className="inline-flex w-full justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs sm:w-auto cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDetailsModal && selectedList && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={() => { if (!isEditMode) setShowDetailsModal(false); }}></div>

              <div className="flex min-h-full items-center justify-center p-4 pb-[calc(96px+env(safe-area-inset-bottom))] sm:pb-4 text-center">
                <div className="relative transform overflow-hidden rounded-2xl sm:rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-3xl max-h-[calc(100dvh-120px)] sm:max-h-[85vh] flex flex-col">
                  <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto">
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
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                          onClick={() => { setShowDetailsModal(false); setIsEditMode(false); }}
                        >
                          <XIcon className="w-6 h-6" />
                        </button>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                            {selectedList.items.length} Itens
                          </h4>
                          {!isEditMode && (
                            <div className="mb-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newDirectItem}
                                  onChange={(e) => setNewDirectItem(e.target.value)}
                                  onKeyPress={handleDirectItemKeyPress}
                                  placeholder="Adicionar novo item..."
                                  className="flex-1 min-w-0 rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddItemToExistingList}
                                  disabled={!newDirectItem.trim()}
                                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Prioridade:</span>
                                <button
                                  type="button"
                                  onClick={() => setNewDirectItemPriority('high')}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors duration-200 cursor-pointer ${
                                    newDirectItemPriority === 'high'
                                      ? 'bg-red-500 text-white border-red-500'
                                      : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'
                                  }`}
                                >
                                  Alta
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewDirectItemPriority('medium')}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors duration-200 cursor-pointer ${
                                    newDirectItemPriority === 'medium'
                                      ? 'bg-yellow-500 text-white border-yellow-500'
                                      : 'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200'
                                  }`}
                                >
                                  Média
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewDirectItemPriority('low')}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors duration-200 cursor-pointer ${
                                    newDirectItemPriority === 'low'
                                      ? 'bg-green-500 text-white border-green-500'
                                      : 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200'
                                  }`}
                                >
                                  Baixa
                                </button>
                              </div>
                            </div>
                          )}
                          {selectedList.items.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto space-y-2">
                              {selectedList.items.map((item) => (
                                <div key={item.id} className={`bg-gray-50 dark:bg-gray-950 rounded-lg transition-all ${item.checked ? 'opacity-60' : ''}`}>
                                  <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-3">
                                    <input
                                      type="checkbox"
                                      checked={item.checked || false}
                                      onChange={() => handleToggleItemChecked(item.id, false)}
                                      className="w-4 h-4 text-orange-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-orange-500 cursor-pointer shrink-0"
                                    />
                                    <div className="flex flex-col flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-sm font-medium text-gray-700 dark:text-gray-200 truncate ${item.checked ? 'line-through' : ''}`}>{item.name}</span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${getPriorityColor(item.priority)}`}>
                                          {getPriorityLabel(item.priority)}
                                        </span>
                                      </div>
                                      {item.details && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.details}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <div className="flex items-center gap-0.5 bg-white dark:bg-gray-900 rounded-lg px-1 sm:px-1.5 py-1">
                                        <button type="button" onClick={() => handleUpdateItemQuantityDirect(item.id, -1)} className="text-orange-500 hover:text-orange-600 cursor-pointer">
                                          <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-200 min-w-[16px] sm:min-w-[20px] text-center">{item.quantity || 1}</span>
                                        <button type="button" onClick={() => handleUpdateItemQuantityDirect(item.id, 1)} className="text-orange-500 hover:text-orange-600 cursor-pointer">
                                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => item.photoUrl ? handleToggleImageExpand(item.id) : null}
                                        className={`transition-colors duration-200 ${
                                          item.photoUrl 
                                            ? (expandedItemId === item.id ? 'text-orange-500 hover:text-orange-600 cursor-pointer' : 'text-green-500 hover:text-green-600 cursor-pointer')
                                            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                                        }`}
                                        title={item.photoUrl ? (expandedItemId === item.id ? "Ocultar imagem" : "Ver imagem") : "Sem imagem"}
                                        disabled={!item.photoUrl}
                                      >
                                        <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      </button>
                                      <button type="button" onClick={() => handleDeleteItemFromList(selectedList.id, item.id)} className="text-orange-500 hover:text-red-500 cursor-pointer" title="Excluir item">
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      </button>
                                    </div>
                                  </div>
                                  {expandedItemId === item.id && item.photoUrl && (
                                    <div className="px-3 pb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                      <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden" style={{ maxHeight: '300px' }}>
                                        <img
                                          src={item.photoUrl}
                                          alt={item.name}
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400 text-sm">Erro ao carregar imagem</div>';
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
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
                  <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:px-6 flex-shrink-0">
                    {isEditMode ? (
                      <>
                        <button type="button" onClick={() => { setIsEditMode(false); setEditedListName(selectedList.name); setEditedListType(selectedList.type); setEditedItems(selectedList.items || []); }} className="inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:w-auto cursor-pointer">Cancelar</button>
                        <button type="button" onClick={handleSaveEdit} className="inline-flex w-full justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs sm:w-auto cursor-pointer">Salvar</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => setShareTarget({ id: selectedList.id, name: selectedList.name, items: selectedList.items || [] })} className="inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:w-auto cursor-pointer items-center gap-2">
                          <Share2 className="w-4 h-4" />
                          Compartilhar
                        </button>
                        <button type="button" onClick={() => setIsEditMode(true)} className="inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:w-auto cursor-pointer items-center gap-2">
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

          {shareTarget && (
            <ShareModal
              listId={shareTarget.id}
              listName={shareTarget.name}
              items={shareTarget.items || []}
              onClose={() => setShareTarget(null)}
            />
          )}

          {showItemDetailsModal && selectedItem && (
            <ItemDetailsModal
              item={selectedItem}
              onClose={() => setShowItemDetailsModal(false)}
              onSave={handleSaveItemDetails}
            />
          )}

          {showImagePopup && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={handleCloseImagePopup}></div>
              
              <div className="flex min-h-full items-center justify-center p-4 pb-[calc(96px+env(safe-area-inset-bottom))] sm:pb-4 text-center">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-lg max-h-[calc(100dvh-96px)] sm:max-h-[85vh] flex flex-col">
                  <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Anexar Imagem</h3>
                          <button
                            onClick={handleCloseImagePopup}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                            aria-label="Fechar"
                          >
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                              URL da imagem:
                            </label>
                            <input
                              type="url"
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              placeholder="Cole a URL da imagem aqui"
                              className="w-full rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                            />
                          </div>

                          {imageUrl && (
                            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                              <img
                                src={imageUrl}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">Erro ao carregar imagem</div>';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:px-6 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleCloseImagePopup}
                      className="inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:w-auto cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveImage}
                      className="inline-flex w-full justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs sm:w-auto cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showTemplatePreview && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={handleCancelTemplate}></div>
              
              <div className="flex min-h-full items-center justify-center p-4 pb-[calc(96px+env(safe-area-inset-bottom))] sm:pb-4 text-center">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-2xl max-h-[calc(100dvh-96px)] sm:max-h-[85vh] flex flex-col">
                  <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Criar Lista por Modelo</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Escolha o tipo e visualize os itens</p>
                          </div>
                          <button
                            onClick={handleCancelTemplate}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                            aria-label="Fechar"
                          >
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tipo de lista:</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleTemplateTypeChange("grocery")}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                selectedTemplateType === "grocery"
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Mercado</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTemplateTypeChange("healthcare")}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                selectedTemplateType === "healthcare"
                                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                <Pill className="w-5 h-5 text-red-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Saúde</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTemplateTypeChange("personalcare")}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                selectedTemplateType === "personalcare"
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Cuidados pessoais</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTemplateTypeChange("wishlist")}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                selectedTemplateType === "wishlist"
                                  ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
                                <Heart className="w-5 h-5 text-pink-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Lista de desejos</span>
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
                          {templateItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-950 px-4 py-3 rounded-lg">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg px-2 py-1">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.quantity}x</span>
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                                  {item.details && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.details}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 Esta é uma lista modelo com itens básicos. Você pode editá-la após criar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:px-6 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleCancelTemplate}
                      className="inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:w-auto cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleApproveTemplate}
                      className="inline-flex w-full justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs sm:w-auto cursor-pointer"
                    >
                      Criar Lista
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
