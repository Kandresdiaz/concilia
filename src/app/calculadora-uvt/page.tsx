"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Calculator, CheckCircle2, AlertCircle, TrendingUp, RefreshCw, Landmark, Zap } from "lucide-react";

export default function UvtCalculatorPage() {
    const [inputValue, setInputValue] = useState("");
    const [year, setYear] = useState(2025);
    const [mode, setMode] = useState<"pesosToUvt" | "uvtToPesos">("pesosToUvt");

    // UVT Values Colombia
    const UVT_VALUES: Record<number, number> = {
        2024: 47065,
        2025: 49786,
        2026: 52674,
    };

    const uvtValue = UVT_VALUES[year];

    const handleInputChange = (val: string) => {
        // Permitir números y un solo punto decimal
        const cleaned = val.replace(/[^0-9.]/g, "");
        setInputValue(cleaned);
    };

    const numValue = parseFloat(inputValue) || 0;

    const result = mode === "pesosToUvt"
        ? (numValue / uvtValue).toFixed(2)
        : (numValue * uvtValue).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const toggleMode = () => {
        setMode(prev => prev === "pesosToUvt" ? "uvtToPesos" : "pesosToUvt");
        setInputValue("");
    };

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

            <main className="max-w-4xl mx-auto px-6 py-40 space-y-16">
                <header className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-violet-100">
                        <Calculator className="w-3 h-3" /> HERRAMIENTA TRIBUTARIA 2025
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-none uppercase italic text-slate-900">
                        Calculadora <span className="text-gradient">UVT</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic leading-relaxed">
                        Convierte {mode === "pesosToUvt" ? "Pesos a UVTs" : "UVTs a Pesos"} al instante con los valores oficiales de la DIAN.
                    </p>
                </header>

                <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-3xl shadow-violet-100/50 border border-slate-100 space-y-10 relative overflow-hidden">
                    <div className="flex justify-center md:justify-end">
                        <button
                            onClick={toggleMode}
                            className="flex items-center gap-3 px-8 py-4 bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-violet-500 transition-all shadow-purple"
                        >
                            <RefreshCw className="w-4 h-4" /> CAMBIAR SENTIDO
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Año de vigencia</label>
                            <div className="relative">
                                <select
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="w-full h-20 px-8 text-2xl font-black bg-slate-50 border-4 border-slate-50 rounded-3xl focus:border-violet-600 focus:outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value={2025}>2025 ($49.786)</option>
                                    <option value={2024}>2024 ($47.065)</option>
                                    <option value={2026}>2026 ($52.674)</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ArrowRight className="w-6 h-6 rotate-90 text-slate-300" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                                {mode === "pesosToUvt" ? "Monto en COP" : "Cantidad UVT"}
                            </label>
                            <input
                                type="text"
                                placeholder={mode === "pesosToUvt" ? "Ej: 5.000.000" : "Ej: 100"}
                                value={inputValue}
                                onChange={(e) => handleInputChange(e.target.value)}
                                className="w-full h-20 px-8 text-3xl font-black bg-slate-50 border-4 border-slate-50 rounded-3xl focus:border-violet-600 focus:outline-none transition-all placeholder:text-slate-200"
                            />
                        </div>
                    </div>

                    {numValue > 0 && (
                        <div className="p-12 bg-violet-900 rounded-[40px] text-white text-center animate-in zoom-in-95 duration-500 shadow-3xl shadow-violet-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-600/20 blur-[60px]"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-300 mb-4 relative z-10">Resultado Estimado</p>
                            <div className="text-6xl md:text-8xl font-black tracking-tighter relative z-10">
                                {mode === "pesosToUvt" ? "" : "$"} {result}
                                <span className="text-2xl text-violet-400 ml-4 font-black">{mode === "pesosToUvt" ? "UVT" : "COP"}</span>
                            </div>
                            <TrendingUp className="w-24 h-24 text-white/5 absolute -bottom-6 -right-6 group-hover:scale-125 transition-transform duration-700" />
                            <p className="text-[10px] font-black mt-6 text-violet-400 uppercase tracking-widest relative z-10">UVT {year}: $ {uvtValue.toLocaleString()}</p>
                        </div>
                    )}
                </div>

                <section className="bg-violet-600 rounded-[60px] p-12 md:p-20 text-white space-y-10 shadow-3xl shadow-violet-200 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent" />
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-4xl md:text-6xl font-black uppercase italic leading-tight">¿Haciendo cálculos <span className="text-violet-900/40">en una libreta?</span></h3>
                            <p className="text-violet-100 font-medium text-lg max-w-xl mx-auto italic">Libérate de la suma manual. ConciliAI automatiza todo tu flujo tributario y financiero con un clic.</p>
                        </div>
                        <Link href="/login" className="group w-full md:w-fit px-12 py-6 bg-white text-violet-600 text-xl font-black rounded-3xl shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-4 uppercase italic">
                            PROBAR GRATIS AHORA <Zap className="w-6 h-6 fill-violet-600" />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center space-y-6 border-t border-slate-100">
                <div className="flex justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <a href="https://t.me/c/3814382001/3" target="_blank" className="hover:text-violet-600 transition-colors">Soporte Telegram</a>
                    <a href="https://www.linkedin.com/in/kevin-diaz-192873177" target="_blank" className="hover:text-violet-600 transition-colors">LinkedIn</a>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
                    © 2026 ConciliAI • Potenciando Contadores con IA
                </p>
            </footer>
        </div>
    );
}

