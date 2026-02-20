"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Calendar, Landmark, AlertTriangle, Sparkles, CheckCircle2, Zap } from "lucide-react";
import { calculateExtemporaneousPenalty, PenaltyResult } from "@/lib/calculadora-sanciones";

export default function SancionesPage() {
    const [dueDate, setDueDate] = useState("");
    const [filingDate, setFilingDate] = useState("");
    const [taxAmount, setTaxAmount] = useState("");
    const [result, setResult] = useState<PenaltyResult | null>(null);

    const handleCalculate = () => {
        if (!dueDate || !filingDate || !taxAmount) return;

        const dDate = new Date(dueDate);
        const fDate = new Date(filingDate);
        const amount = parseFloat(taxAmount.replace(/[^0-9]/g, "")) || 0;

        const res = calculateExtemporaneousPenalty(dDate, fDate, amount);
        setResult(res);
    };

    return (
        <div className="min-h-screen bg-mesh text-slate-900 selection:bg-violet-100 italic">
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-violet-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-purple">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">
                            Concili<span className="text-violet-600">AI</span>
                        </span>
                    </Link>
                    <Link href="/login" className="px-6 py-2 bg-slate-50 text-slate-400 font-black rounded-xl hover:text-violet-600 transition-colors uppercase text-xs tracking-widest">
                        Acceso Pro
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-40 pb-20 space-y-20">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-violet-100 animate-float">
                        <Sparkles className="w-3 h-3" /> EVITA MULTAS DIAN
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.85] uppercase italic">
                        Liquidador de <br />
                        <span className="text-gradient">Sanciones 2025</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Calcula automáticamente la sanción por extemporaneidad.
                        Precisión bajo el estatuto tributario colombiano.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-3xl shadow-violet-100/50 border border-slate-100 space-y-8 relative overflow-hidden">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Monto del Impuesto (Pesos)</label>
                                <div className="relative">
                                    <Landmark className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={taxAmount}
                                        onChange={(e) => setTaxAmount(e.target.value)}
                                        className="w-full h-16 pl-16 pr-8 bg-slate-50 border-none rounded-2xl font-black text-xl focus:ring-2 focus:ring-violet-600 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Fecha Vencimiento</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full h-16 pl-16 pr-8 bg-slate-50 border-none rounded-2xl font-black focus:ring-2 focus:ring-violet-600 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Fecha Presentación</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                        <input
                                            type="date"
                                            value={filingDate}
                                            onChange={(e) => setFilingDate(e.target.value)}
                                            className="w-full h-16 pl-16 pr-8 bg-slate-50 border-none rounded-2xl font-black focus:ring-2 focus:ring-violet-600 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full h-20 bg-violet-600 text-white rounded-[25px] font-black text-xl flex items-center justify-center gap-4 shadow-purple hover:bg-violet-500 transition-all hover:scale-[1.02] uppercase italic"
                        >
                            <Calculator className="w-6 h-6" /> Liquidar Sanción
                        </button>
                    </div>

                    <div className="space-y-8">
                        {result ? (
                            <div className="bg-violet-600 p-12 rounded-[50px] text-white space-y-8 shadow-3xl shadow-violet-200 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 opacity-10">
                                    <Landmark className="w-64 h-64" />
                                </div>

                                <div className="space-y-2 relative">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sanción Calculada</p>
                                    <h3 className="text-6xl font-black italic">
                                        $ {result.totalPenalty.toLocaleString()}
                                    </h3>
                                    {result.isMinimum && (
                                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase">Sanción Mínima Aplicada (10 UVT)</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10 relative">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase opacity-60">Meses de Retraso</p>
                                        <p className="text-2xl font-black italic">{result.monthsDelay} meses</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase opacity-60">Base (5%)</p>
                                        <p className="text-2xl font-black italic">$ {result.baseCalculation.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="pt-8 relative">
                                    <Link href="/login" className="w-full py-6 bg-white text-violet-600 rounded-[25px] font-black text-lg flex items-center justify-center gap-4 shadow-2xl hover:bg-slate-50 transition-all">
                                        EVITAR ERRORES CON IA <ArrowRight className="w-6 h-6" />
                                    </Link>
                                    <p className="text-center text-[10px] font-black uppercase mt-4 opacity-70 tracking-widest">Ahorra tiempo conciliando con ConciliAI Pro</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-12 rounded-[50px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6 grayscale opacity-60 h-full">
                                <AlertTriangle className="w-16 h-16 text-slate-300" />
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black uppercase italic">Esperando Datos</h3>
                                    <p className="text-sm font-medium text-slate-400">Ingresa la información para calcular tu sanción tributaria.</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl space-y-4">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                <h4 className="font-black uppercase italic">Estatuto Art. 641</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">Nuestra lógica sigue estrictamente el artículo 641 del Estatuto Tributario Colombiano.</p>
                            </div>
                            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl space-y-4">
                                <Sparkles className="w-8 h-8 text-violet-600" />
                                <h4 className="font-black uppercase italic">Conciliación IA</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">¿Sabías que la mayoría de sanciones ocurren por errores de transcripción? Evítalos con nuestra IA.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="bg-violet-900 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl shadow-violet-200">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-600/20 blur-[100px]"></div>
                    <div className="max-w-3xl space-y-8 relative">
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
                            No más trasnochones <br />
                            <span className="text-violet-400 font-black">haciendo cierres.</span>
                        </h2>
                        <p className="text-xl text-violet-100/60 font-medium leading-relaxed italic">
                            ConciliAI no solo te ayuda a calcular multas, evita que ocurran.
                            Automatiza tu conciliación bancaria y contable hoy mismo.
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <Link href="/login" className="px-12 py-6 bg-white text-violet-600 font-black rounded-3xl hover:scale-105 transition-all shadow-2xl text-xl uppercase italic flex items-center gap-4">
                                Empezar Gratis <Zap className="w-6 h-6 fill-violet-600" />
                            </Link>
                            <Link href="/bancos" className="px-8 py-6 bg-white/5 text-white font-black rounded-3xl hover:bg-white/10 transition-all uppercase text-sm tracking-widest flex items-center gap-3">
                                Directorio Bancos <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center space-y-6 border-t border-slate-100">
                <div className="flex justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <a href="https://t.me/c/3814382001/3" target="_blank" className="hover:text-violet-600 transition-colors">Soporte Telegram</a>
                    <a href="https://www.linkedin.com/in/kevin-diaz-192873177" target="_blank" className="hover:text-violet-600 transition-colors">LinkedIn</a>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
                    UNA HERRAMIENTA DE CONCILIAI PRO • 2025
                </p>
            </footer>
        </div>
    );
}
