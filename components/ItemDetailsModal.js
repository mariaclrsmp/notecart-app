"use client";

import { useState } from "react";
import Image from "next/image";
import { XIcon, Upload, Trash2 } from "lucide-react";

export default function ItemDetailsModal({ item, onClose, onSave }) {
  const [details, setDetails] = useState(item?.details || "");
  const [photoUrl, setPhotoUrl] = useState(item?.photoUrl || "");
  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A foto deve ter no máximo 5MB");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl("");
    setPhotoFile(null);
  };

  const handleSave = () => {
    onSave({
      ...item,
      details,
      photoUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Detalhes do Item</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do item:
                    </label>
                    <p className="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {item?.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detalhes adicionais:
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Ex: marca, tamanho, observações..."
                      rows={4}
                      className="w-full rounded-lg bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto do item:
                    </label>
                    {photoUrl ? (
                      <div className="relative w-full h-48">
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
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors duration-200">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Clique para adicionar foto</span>
                        <span className="text-xs text-gray-400 mt-1">Máximo 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
              className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
