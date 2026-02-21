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
    Sparkles,
    Landmark
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
        <div className="min-h-screen bg-mesh text-slate-900 selection:bg-violet-100 italic">
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-violet-100 uppercase tracking-widest font-black">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-purple">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase">Concili<span className="text-violet-600">AI</span></span>
                    </Link>
                    <Link href="/login" className="text-[10px] text-slate-400 hover:text-violet-600 transition-colors">Conectar</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-40 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-violet-100">
                        <Calculator className="w-3 h-3" /> Calculadora de Desperdicio
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-none uppercase italic text-slate-900">
                        ¿Cuánto te cuesta hacerlo <span className="text-gradient">manual?</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium italic leading-relaxed">
                        Descubre cuánto tiempo y dinero estás regalando al mes por no usar Inteligencia Artificial en tus conciliaciones bancarias.
                    </p>

                    <div className="space-y-12 bg-white p-8 md:p-12 rounded-[50px] shadow-3xl shadow-violet-100/50 border border-slate-100 italic">
                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex justify-between">
                                Número de empresas / Clientes <span className="text-violet-600">0{firms}</span>
                            </label>
                            <input
                                type="range" min="1" max="100" value={firms}
                                onChange={(e) => setFirms(Number(e.target.value))}
                                className="w-full h-2 bg-violet-50 rounded-lg appearance-none cursor-pointer accent-violet-600"
                            />
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex justify-between">
                                Horas por conciliación (Manual) <span className="text-violet-600">{hoursPerFirm}H</span>
                            </label>
                            <input
                                type="range" min="1" max="20" value={hoursPerFirm}
                                onChange={(e) => setHoursPerFirm(Number(e.target.value))}
                                className="w-full h-2 bg-violet-50 rounded-lg appearance-none cursor-pointer accent-violet-600"
                            />
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex justify-between">
                                Costo por hora del contador (USD) <span className="text-violet-600">${hourlyRate}</span>
                            </label>
                            <input
                                type="range" min="5" max="200" value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className="w-full h-2 bg-violet-50 rounded-lg appearance-none cursor-pointer accent-violet-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:sticky lg:top-40 space-y-6">
                    <div className="bg-violet-900 rounded-[60px] p-10 md:p-16 text-white space-y-12 relative overflow-hidden shadow-3xl shadow-violet-200">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-600/20 blur-[80px]"></div>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingDown className="w-48 h-48" />
                        </div>

                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-violet-300">Pérdida Anual</p>
                                <p className="text-3xl md:text-5xl font-black text-rose-400">${yearlyCost.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-violet-300">Horas Perdidas</p>
                                <p className="text-3xl md:text-5xl font-black">{yearlyHours.toLocaleString()}H</p>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-white/10 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                                <Zap className="w-3 h-3 fill-current" /> Impacto ConciliAI
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-violet-200 italic">Ahorro mensual potencial:</p>
                                    <h3 className="text-5xl md:text-7xl font-black tracking-tightest leading-none text-emerald-400 animate-pulse">
                                        + ${aiSavingMoney.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4 text-violet-300">
                                    <Clock className="w-5 h-5" />
                                    <p className="text-sm font-black uppercase tracking-widest leading-none">Recuperas {aiSavingHours} horas al mes</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/login" className="relative z-10 group w-full py-7 bg-white text-violet-600 text-xl font-black rounded-3xl shadow-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-4 uppercase italic">
                            DETENER ESTA PÉRDIDA <Zap className="w-6 h-6 fill-violet-600" />
                        </Link>
                    </div>

                    <div className="p-8 bg-white border border-violet-100 rounded-[40px] shadow-xl shadow-violet-100/30 flex items-center gap-6 italic">
                        <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center shrink-0">
                            <Sparkles className="w-8 h-8 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dato sorprendente</p>
                            <p className="text-sm font-black text-slate-900 leading-tight">La IA de ConciliAI es 150x más rápida que el auditor más veloz de tu equipo.</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] border-t border-slate-100">
                © 2026 ConciliAI • Expertos en ROI de IA
            </footer>
        </div>
    );
}
