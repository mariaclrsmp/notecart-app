"use client";

import { useState } from "react";
import Image from "next/image";
import { XIcon, Trash2 } from "lucide-react";

export default function ItemDetailsModal({ item, onClose, onSave }) {
  const [details, setDetails] = useState(item?.details || "");
  const [photoUrl, setPhotoUrl] = useState(item?.photoUrl || "");
  const [priority, setPriority] = useState(item?.priority || "low");

  const handleRemovePhoto = () => {
    setPhotoUrl("");
  };

  const handleSave = () => {
    onSave({
      ...item,
      details,
      photoUrl,
      priority
    });
    onClose();
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Detalhes do Item</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Fechar"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Nome do item:
                    </label>
                    <p className="text-base text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-950 px-3 py-2 rounded-lg">
                      {item?.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Detalhes adicionais:
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Ex: marca, tamanho, observações..."
                      rows={4}
                      className="w-full rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Prioridade:
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPriority('high')}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 cursor-pointer ${
                          priority === 'high' 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'
                        }`}
                      >
                        Alta prioridade
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('medium')}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 cursor-pointer ${
                          priority === 'medium' 
                            ? 'bg-yellow-500 text-white border-yellow-500' 
                            : 'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200'
                        }`}
                      >
                        Média prioridade
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('low')}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 cursor-pointer ${
                          priority === 'low' 
                            ? 'bg-green-500 text-white border-green-500' 
                            : 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200'
                        }`}
                      >
                        Baixa prioridade
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      URL da imagem:
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="Cole a URL da imagem aqui"
                      className="w-full rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                    />
                    {photoUrl && (
                      <div className="relative w-full h-48 mt-3">
                        <Image
                          src={photoUrl}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          onClick={handleRemovePhoto}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200 z-10"
                          title="Remover foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex w-full justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto cursor-pointer"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 sm:mt-0 sm:w-auto cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
