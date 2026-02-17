"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Calculator, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

export default function UvtCalculatorPage() {
    const [pesos, setPesos] = useState("");
    const [year, setYear] = useState(2025);

    // UVT Values Colombia
    const UVT_VALUES: Record<number, number> = {
        2024: 47065,
        2025: 49786,
        2026: 52674, // Estimated/Projected for context
    };

    const handleCalculate = (val: string) => {
        setPesos(val.replace(/\D/g, ""));
    };

    const pesosNum = parseInt(pesos) || 0;
    const uvtValue = UVT_VALUES[year];
    const uvtResult = (pesosNum / uvtValue).toFixed(2);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">ConciliAI <span className="text-[10px] text-indigo-600">FREE</span></span>
                </Link>
                <Link href="/login" className="btn btn-ghost font-black text-xs uppercase tracking-widest">Login</Link>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-24 space-y-12">
                <header className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        <Calculator className="w-3 h-3" /> Herramienta Contable Gratis
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-none uppercase italic">
                        Calculadora <span className="text-indigo-600">UVT</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium">
                        Convierte pesos colombianos a Unidades de Valor Tributario (UVT) al instante.
                    </p>
                </header>

                <div className="glass-card p-12 rounded-[40px] bg-white shadow-2xl shadow-indigo-100 border border-slate-100 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Año Tributario</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                className="w-full h-16 px-6 text-xl font-black bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value={2025}>2025 ($49.786)</option>
                                <option value={2024}>2024 ($47.065)</option>
                                <option value={2026}>2026 (Proyectado)</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Valor en Pesos (COP)</label>
                            <input
                                type="text"
                                placeholder="Ej: 1000000"
                                value={pesos}
                                onChange={(e) => handleCalculate(e.target.value)}
                                className="w-full h-16 px-8 text-xl font-black bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {pesosNum > 0 && (
                        <div className="p-8 bg-slate-900 rounded-3xl text-white text-center animate-in zoom-in-95 duration-300 shadow-xl shadow-slate-200">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Resultado equivalente</p>
                            <h2 className="text-6xl font-black text-indigo-400">{uvtResult} <span className="text-2xl text-white/40 italic font-medium">UVT</span></h2>
                            <p className="text-xs font-bold mt-4 opacity-70">Cálculo basado en $ {uvtValue.toLocaleString()} por UVT ({year})</p>
                        </div>
                    )}

                    <div className="flex items-center gap-4 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                        <TrendingUp className="w-6 h-6 text-indigo-600 shrink-0" />
                        <p className="text-xs font-medium text-slate-600">
                            La UVT es la medida que define topes para declaración de renta, multas y sanciones en Colombia.
                        </p>
                    </div>
                </div>

                <section className="bg-indigo-600 rounded-[40px] p-12 text-white space-y-8 shadow-3xl flex flex-col items-center text-center">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase italic">¿Tantos cálculos te quitan tiempo?</h3>
                        <p className="text-indigo-100 font-medium max-w-md">Usa Inteligencia Artificial para tus conciliaciones bancarias y ahorra horas cada mes.</p>
                    </div>
                    <Link href="/login" className="group btn bg-white text-indigo-600 h-16 px-10 rounded-2xl font-black flex items-center gap-4 w-fit shadow-2xl transition-all hover:scale-105 border-none">
                        PROBAR CONCILIAIA GRATIS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </section>
            </main>

            <footer className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border-t border-slate-200">
                © 2026 ConciliAI • Optimizando la Contabilidad Moderna
            </footer>
        </div>
    );
}
