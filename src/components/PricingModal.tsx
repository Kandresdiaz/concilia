"use client";

import { X, CheckCircle2, Zap, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (tier: string) => void;
    loading: boolean;
}

export function PricingModal({ isOpen, onClose, onUpgrade, loading }: PricingModalProps) {
    if (!isOpen) return null;

    const plans = [
        {
            id: "PRO",
            name: "Profesional",
            price: "24.99",
            description: "Contador Elite",
            features: ["50 Conciliaciones / mes", "IA Llama 3.3 70B Elite", "Vision IA 90B (PDF)", "Sin Marca de Agua", "Certificado Digital"],
            color: "indigo"
        },
        {
            id: "ENTERPRISE",
            name: "Despacho",
            price: "79.00",
            description: "Lifetime Access",
            features: ["300 Conciliaciones / mes", "Todas las IAs Premium", "Logo Propio en PDF", "Soporte 24/7 VIP", "Actualizaciones de por vida"],
            color: "slate",
            highlight: true
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-3xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
                >
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="p-8 md:p-12">
                    <div className="text-center space-y-4 mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                            <Star className="w-3 h-3" /> Precios Especiales
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                            Elige tu <span className="text-indigo-600">Plan de Poder</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto">
                            Multiplica tu productividad y olvida el trabajo manual para siempre.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={cn(
                                    "relative p-8 rounded-[32px] border-2 transition-all duration-300 hover:scale-[1.02]",
                                    plan.highlight
                                        ? "bg-slate-900 border-slate-900 text-white shadow-2xl"
                                        : "bg-white border-slate-100 text-slate-900"
                                )}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        Más Popular
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            plan.highlight ? "text-indigo-400" : "text-indigo-600"
                                        )}>
                                            {plan.description}
                                        </p>
                                        <h3 className="text-2xl font-black uppercase italic">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black">$ {plan.price}</span>
                                            <span className="text-xs opacity-50">/ mes</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                                <CheckCircle2 className={cn(
                                                    "w-4 h-4",
                                                    plan.highlight ? "text-indigo-400" : "text-indigo-600"
                                                )} />
                                                <span className={plan.highlight ? "text-slate-300" : "text-slate-600"}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => onUpgrade(plan.id)}
                                        disabled={loading}
                                        className={cn(
                                            "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 disabled:opacity-50",
                                            plan.highlight
                                                ? "bg-white text-slate-900 hover:bg-slate-100"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                                        )}
                                    >
                                        {loading ? "Procesando..." : `Elegir ${plan.name}`}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 border border-slate-100 rounded-[24px] flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-black text-slate-900 uppercase">Seguridad Garantizada</p>
                            <p className="text-[11px] text-slate-500 font-medium">Pagos procesados de forma segura por Lemon Squeezy con encriptación de nivel bancario.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
