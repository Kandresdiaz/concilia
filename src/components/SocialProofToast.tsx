"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Zap, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const RECENT_ACTIVITY = [
    { city: "Bogotá", action: "automatizó 45 extractos" },
    { city: "Medellín", action: "ahorró 12 horas con IA" },
    { city: "Madrid", action: "registró un nuevo Despacho" },
    { city: "Cali", action: "completó una auditoría anual" },
    { city: "Barcelona", action: "migró 10 empresas a ConciliAI" },
    { city: "Lima", action: "verificó una diferencia de $2M" },
];

export function SocialProofToast() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => {
            setVisible(true);
            const hideTimer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(hideTimer);
        }, 15000); // Show every 15s

        const switchTimer = setInterval(() => {
            setIndex((prev) => (prev + 1) % RECENT_ACTIVITY.length);
        }, 20000);

        return () => {
            clearTimeout(showTimer);
            clearInterval(switchTimer);
        };
    }, [index]);

    return (
        <div className={cn(
            "fixed bottom-8 left-8 z-[100] transition-all duration-700 transform",
            visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-90"
        )}>
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 min-w-[280px]">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                    <Zap className="w-5 h-5 fill-white text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Actividad en vivo
                    </p>
                    <p className="text-xs font-bold leading-tight">
                        Alguien de <span className="text-indigo-300">{RECENT_ACTIVITY[index].city}</span> {RECENT_ACTIVITY[index].action}.
                    </p>
                </div>
            </div>
        </div>
    );
}
