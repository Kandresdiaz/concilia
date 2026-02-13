"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, Eye, X, CheckCircle2 } from "lucide-react";

export function PrivacyModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Verificar si el usuario ya vio el modal
        const hasSeenPrivacyModal = localStorage.getItem("hasSeenPrivacyModal");
        if (!hasSeenPrivacyModal) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("hasSeenPrivacyModal", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 p-8 rounded-t-[32px]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                            <Shield className="w-8 h-8 text-emerald-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic mb-2">
                        Tu Privacidad es Nuestra Prioridad
                    </h2>
                    <p className="text-emerald-50 font-medium">
                        Antes de continuar, queremos que conozcas nuestro compromiso con la seguridad de tus datos financieros.
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Main Guarantees */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-emerald-900 uppercase text-sm tracking-widest mb-1">
                                    Sin Entrenamiento de IA
                                </h3>
                                <p className="text-sm text-emerald-700 leading-relaxed">
                                    <strong>Usamos Groq Cloud</strong>, que tiene una política estricta de <strong>no entrenamiento</strong> con datos de usuarios. Tus extractos bancarios y auxiliares contables <strong>NUNCA</strong> se usan para mejorar modelos de IA.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-blue-900 uppercase text-sm tracking-widest mb-1">
                                    Encriptación Total
                                </h3>
                                <p className="text-sm text-blue-700 leading-relaxed">
                                    Toda tu información se transmite con <strong>HTTPS/TLS</strong> y se almacena encriptada en reposo en Supabase. Ni siquiera nosotros podemos acceder a tus datos sin tu autorización.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-200">
                            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-purple-900 uppercase text-sm tracking-widest mb-1">
                                    Zero Compartición
                                </h3>
                                <p className="text-sm text-purple-700 leading-relaxed">
                                    Tus datos financieros <strong>nunca se venden, alquilan o comparten</strong> con terceros. Solo tú tienes acceso a tus conciliaciones guardadas.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">
                            Garantías Técnicas
                        </h4>
                        <ul className="space-y-2">
                            {[
                                "Row Level Security (RLS) activo en base de datos",
                                "Procesamiento de IA en memoria RAM temporal (datos borrados tras respuesta)",
                                "Cumplimiento de políticas de privacidad financiera",
                                "Auditoría de seguridad automática en cada operación"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer Note */}
                    <p className="text-xs text-slate-500 leading-relaxed text-center">
                        Al continuar, aceptas que has leído y comprendido nuestra política de privacidad. Puedes revisar los detalles técnicos de seguridad en cualquier momento desde tu perfil.
                    </p>

                    {/* Action Button */}
                    <button
                        onClick={handleAccept}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest text-sm"
                    >
                        Entendido, Continuar de Forma Segura
                    </button>
                </div>
            </div>
        </div>
    );
}
