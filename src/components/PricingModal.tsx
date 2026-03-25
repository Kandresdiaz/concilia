"use client";

import { X, CheckCircle2, Zap, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onUpgradeAction: (tier: string) => void;
    loading: boolean;
}

export function PricingModal({ isOpen, onCloseAction, onUpgradeAction, loading }: PricingModalProps) {
    if (!isOpen) return null;

    const plans = [
        {
            id: "PRO",
            name: "Profesional",
            price: "24.99",
            description: "Contador Elite",
            features: ["50 Conciliaciones / mes", "IA Llama 3.3 70B Elite", "Vision IA 90B (PDF)", "Plantilla Auditoría DIAN (BONO)", "Soporte Telegram Prioritario"],
            color: "indigo"
        },
        {
            id: "ENTERPRISE",
            name: "LIFETIME (PROMO)",
            price: "197.00",
            description: "Acceso de por Vida",
            features: ["ILIMITADAS Conciliaciones", "IA Elite 405B Ultra", "Marca Blanca (Logo Propio)", "Consultoría 1-on-1 (BONO)", "Garantía de Recuperación x10"],
            color: "slate",
            highlight: true
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-2 md:p-4 overflow-y-auto overflow-x-hidden">
            <div className="bg-white w-full max-w-3xl rounded-[32px] md:rounded-[40px] shadow-3xl overflow-hidden relative animate-in fade-in zoom-in duration-300 my-auto">
                <button
                    onClick={onCloseAction}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
                >
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="p-6 md:p-10">
                    <div className="text-center space-y-2 mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                            <Star className="w-3 h-3" /> Precios Especiales
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase italic">
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
                                            <span className="text-xs opacity-50">{plan.id === "PRO" ? "/ mes" : "único"}</span>
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
                                        onClick={() => onUpgradeAction(plan.id)}
                                        disabled={loading}
                                        className={cn(
                                            "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 disabled:opacity-50",
                                            plan.highlight
                                                ? "bg-white text-slate-900 hover:bg-slate-100"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                                        )}
                                    >
                                        {loading ? "Procesando..." : `Elegir ${plan.name}`}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-indigo-600 rounded-[24px] md:rounded-[32px] text-white flex flex-col md:flex-row items-center gap-4 shadow-xl shadow-indigo-200">
                        <div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center backdrop-blur-md shrink-0">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-1 text-center md:text-left flex-1">
                            <p className="text-base font-black uppercase italic tracking-tighter leading-none">GARANTÍA DE "RIESGO CERO"</p>
                            <p className="text-[11px] font-medium opacity-80 leading-snug">
                                Si en los primeros 30 días la IA no encuentra errores que paguen el costo de tu plan, te devolvemos el 100% y te damos 3 meses Pro gratis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
