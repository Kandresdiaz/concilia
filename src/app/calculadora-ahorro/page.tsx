"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Calculator,
    TrendingDown,
    Clock,
    DollarSign,
    ArrowRight,
    ShieldCheck,
    Zap,
    Sparkles
} from "lucide-react";

export default function ROICalculator() {
    const [firms, setFirms] = useState(10);
    const [hoursPerFirm, setHoursPerFirm] = useState(4);
    const [hourlyRate, setHourlyRate] = useState(25);

    const monthlyHours = firms * hoursPerFirm;
    const yearlyHours = monthlyHours * 12;
    const monthlyCost = monthlyHours * hourlyRate;
    const yearlyCost = monthlyCost * 12;

    const aiSavingHours = Math.round(monthlyHours * 0.9);
    const aiSavingMoney = Math.round(monthlyCost * 0.9);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 p-6 md:p-12">
            <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-black tracking-tighter uppercase">ConciliAI</span>
                </Link>
                <Link href="/login" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">
                    Abrir App
                </Link>
            </nav>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        <Calculator className="w-3 h-3" /> Calculadora de Desperdicio
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-none uppercase italic">
                        ¿Cuánto te cuesta hacerlo <span className="text-indigo-600">manual?</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Descubre cuánto tiempo y dinero estás regalando al mes por no usar Inteligencia Artificial en tus conciliaciones bancarias.
                    </p>

                    <div className="space-y-10 bg-white p-8 rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between">
                                Número de empresas / Clientes <span>{firms}</span>
                            </label>
                            <input
                                type="range" min="1" max="100" value={firms}
                                onChange={(e) => setFirms(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between">
                                Horas por conciliación (Manual) <span>{hoursPerFirm}h</span>
                            </label>
                            <input
                                type="range" min="1" max="20" value={hoursPerFirm}
                                onChange={(e) => setHoursPerFirm(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between">
                                Costo por hora del contador (USD) <span>${hourlyRate}</span>
                            </label>
                            <input
                                type="range" min="5" max="200" value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:sticky lg:top-24 space-y-6 animate-slide-up [animation-delay:200ms]">
                    <div className="bg-slate-900 rounded-[50px] p-10 text-white space-y-10 relative overflow-hidden shadow-3xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingDown className="w-32 h-32" />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Pérdida Anual</p>
                                <p className="text-3xl font-black text-rose-500">${yearlyCost.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Horas Desperidiciadas</p>
                                <p className="text-3xl font-black text-rose-500">{yearlyHours}h</p>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 w-full" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/40">
                                    <Zap className="w-6 h-6 fill-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black uppercase tracking-tight italic">Con ConciliAI ahorrarías:</h4>
                                    <p className="text-emerald-400 font-bold uppercase text-xs tracking-widest">~90% de eficiencia ganada</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 bg-white/5 p-6 rounded-3xl border border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Ahorro Mensual</p>
                                    <p className="text-4xl font-black text-white italic">${aiSavingMoney.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Vida Recuperada</p>
                                    <p className="text-4xl font-black text-white italic">{aiSavingHours}h</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/login" className="flex items-center justify-center gap-3 w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl shadow-2xl transition-all active:scale-95 group">
                            DEJAR DE PERDER TIEMPO <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="glass-card p-6 rounded-[30px] flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 italic">
                            "ConciliAI no es un costo, es una inversión que se paga sola en el primer día."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
