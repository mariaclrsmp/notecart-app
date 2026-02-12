"use client";

import { useState, useEffect, useCallback } from "react";
import { XIcon, Share2, Trash2, Loader2, UserPlus, MessageCircle } from "lucide-react";
import { listsService } from "@/lib/services/listsService";
import { useAuth } from "@/contexts/AuthContext";

export default function ShareModal({ listId, listName, items = [], onClose }) {
    const { user } = useAuth();
    const [email, setEmail] = useState("");
    const [sharedUsers, setSharedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sharing, setSharing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadSharedUsers = useCallback(async () => {
        if (!user || !listId) return;
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const users = await listsService.getSharedUsers(listId, token);
            setSharedUsers(users);
        } catch (err) {
            console.error("Error loading shared users:", err);
        } finally {
            setLoading(false);
        }
    }, [user, listId]);

    useEffect(() => {
        loadSharedUsers();
    }, [loadSharedUsers]);

    const handleShare = async () => {
        if (!email.trim()) return;
        setError("");
        setSuccess("");
        setSharing(true);

        try {
            const token = await user.getIdToken();
            await listsService.share(listId, email.trim().toLowerCase(), token);
            setSuccess(`Lista compartilhada com ${email.trim()}`);
            setEmail("");
            await loadSharedUsers();
        } catch (err) {
            if (err.code === "USER_NOT_FOUND") {
                setError("Usuário não encontrado. Verifique o e-mail.");
            } else if (err.code === "CANNOT_SHARE_WITH_SELF") {
                setError("Você não pode compartilhar consigo mesmo.");
            } else {
                setError("Erro ao compartilhar lista.");
            }
        } finally {
            setSharing(false);
        }
    };

    const handleUnshare = async (targetUserId) => {
        try {
            const token = await user.getIdToken();
            await listsService.unshare(listId, targetUserId, token);
            await loadSharedUsers();
        } catch (err) {
            console.error("Error unsharing:", err);
            setError("Erro ao remover compartilhamento.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleShare();
        }
    };

    const handleShareWhatsApp = () => {
        const priorityEmoji = { high: "🔴", medium: "🟡", low: "🟢" };
        let text = `📋 *${listName}*\n\n`;
        if (items.length > 0) {
            items.forEach((item, i) => {
                const emoji = priorityEmoji[item.priority] || "⚪";
                const checked = item.checked ? "✅" : "⬜";
                text += `${checked} ${item.name} (x${item.quantity || 1}) ${emoji}\n`;
            });
            const total = items.length;
            const done = items.filter(i => i.checked).length;
            text += `\n📊 ${done}/${total} concluídos`;
        } else {
            text += "Lista vazia";
        }
        text += `\n\n_Enviado via NoteCart_`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/70 transition-opacity" onClick={onClose}></div>
            <div className="flex min-h-full items-center justify-center p-4 pb-20 sm:pb-4">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all w-full sm:max-w-md max-h-[calc(100dvh-96px)] sm:max-h-[85vh] flex flex-col">
                    <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Share2 className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Compartilhar</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{listName}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(""); }}
                                    onKeyPress={handleKeyPress}
                                    placeholder="E-mail do usuário..."
                                    className="flex-1 min-w-0 rounded-lg bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-100 text-sm border border-slate-200 dark:border-gray-700 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                />
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    disabled={!email.trim() || sharing}
                                    className="h-9 px-3 shrink-0 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sharing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            <span className="hidden sm:inline">Compartilhar</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
                            )}
                            {success && (
                                <p className="text-xs text-green-500 dark:text-green-400">{success}</p>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={handleShareWhatsApp}
                                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Enviar por WhatsApp
                            </button>
                        </div>

                        <div className="mt-5">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                                Compartilhado com ({sharedUsers.length})
                            </h4>
                            {loading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                                </div>
                            ) : sharedUsers.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                    Esta lista ainda não foi compartilhada.
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {sharedUsers.map((sharedUser) => (
                                        <div key={sharedUser.uid} className="flex items-center justify-between bg-gray-50 dark:bg-gray-950 px-3 py-2.5 rounded-lg">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                                                        {(sharedUser.displayName || sharedUser.email || "?").charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    {sharedUser.displayName && (
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{sharedUser.displayName}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{sharedUser.email || "E-mail indisponível"}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleUnshare(sharedUser.uid)}
                                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer shrink-0 ml-2"
                                                title="Remover compartilhamento"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-950 px-4 py-3 flex justify-end sm:px-6 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center rounded-full bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
