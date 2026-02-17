"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    loading = false,
}) => {
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    const handleNext = () => setStep(2);
    const handleReset = () => {
        setStep(1);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={cn(
                    "w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4",
                    step === 2 ? "ring-4 ring-rose-100" : ""
                )}
            >
                {/* Header */}
                <div className={cn(
                    "p-6 flex items-center justify-between",
                    step === 2 ? "bg-rose-50" : "bg-slate-50"
                )}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                            step === 2 ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600"
                        )}>
                            {step === 1 ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 leading-tight">
                                {step === 1 ? "¿Eliminar Auditoría?" : "Confirmación Final"}
                            </h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {step === 1 ? "Paso 1 de 2" : "Paso 2 de 2 - Irreversible"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleReset}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <p className="text-slate-600 font-medium">
                                ¿Estás seguro de que deseas eliminar la auditoría de <span className="font-black text-slate-900">"{title}"</span>?
                            </p>
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-800 text-sm font-medium">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <p>Esta acción removerá el registro de tu historial de conciliaciones.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-center">
                            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <Trash2 className="w-10 h-10" />
                            </div>
                            <p className="text-rose-900 font-black text-xl">¿Confirmas el borrado?</p>
                            <p className="text-slate-500 text-sm font-medium">
                                Al hacer clic en el botón de abajo, los datos se eliminarán permanentemente de la nube.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 flex gap-3">
                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    {step === 1 ? (
                        <button
                            onClick={handleNext}
                            className="flex-[1.5] bg-slate-900 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                        >
                            Continuar <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-[1.5] bg-rose-600 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-95 shadow-xl shadow-rose-200 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Borrar definitivamente</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Loader2 = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
