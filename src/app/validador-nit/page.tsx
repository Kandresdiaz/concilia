"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Hash, CheckCircle2, AlertCircle } from "lucide-react";

export default function NitValidatorPage() {
    const [nit, setNit] = useState("");
    const [dv, setDv] = useState<number | null>(null);

    const calculateDV = (myNit: string) => {
        const vpri = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
        const nitStr = myNit.replace(/\D/g, "");
        if (nitStr.length === 0) return null;

        let suma = 0;
        for (let i = 0; i < nitStr.length; i++) {
            suma += parseInt(nitStr.charAt(nitStr.length - 1 - i)) * vpri[i];
        }

        const residuo = suma % 11;
        return residuo > 1 ? 11 - residuo : residuo;
    };

    const handleCalculate = (val: string) => {
        setNit(val);
        const result = calculateDV(val);
        setDv(result);
    };

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
                        <Hash className="w-3 h-3" /> Herramienta Contable Gratis
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-none uppercase italic">
                        Validador de <span className="text-indigo-600">NIT</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium">
                        Calcula instantáneamente el dígito de verificación (DV) para cualquier NIT en Colombia. Sin registros.
                    </p>
                </header>

                <div className="glass-card p-12 rounded-[40px] bg-white shadow-2xl shadow-indigo-100 border border-slate-100 space-y-8">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ingresa el NIT (sin puntos ni guiones)</label>
                        <input
                            type="text"
                            placeholder="Ej: 901234567"
                            value={nit}
                            onChange={(e) => handleCalculate(e.target.value)}
                            className="w-full h-20 px-8 text-3xl font-black bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-indigo-600 focus:outline-none transition-all"
                        />
                    </div>

                    {dv !== null && (
                        <div className="p-8 bg-indigo-600 rounded-3xl text-white text-center animate-in zoom-in-95 duration-300 shadow-xl shadow-indigo-200">
                            <p className="text-xs font-black uppercase tracking-widest opacity-70">El dígito de verificación es:</p>
                            <h2 className="text-7xl font-black mt-2">{dv}</h2>
                            <p className="text-sm font-bold mt-4 opacity-90">{nit}-{dv}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <AlertCircle className="w-6 h-6 text-indigo-600 shrink-0" />
                        <p className="text-xs font-medium text-slate-600">
                            Utilizamos el algoritmo estándar de la DIAN para el cálculo del residuo base 11.
                        </p>
                    </div>
                </div>

                <section className="bg-slate-900 rounded-[40px] p-12 text-white space-y-8 shadow-3xl">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase italic">¿Cansado de validar datos manuales?</h3>
                        <p className="text-slate-400 font-medium">ConciliAI automatiza todo tu proceso contable, no solo los NITs.</p>
                    </div>
                    <Link href="/login" className="group btn bg-white text-slate-900 h-16 px-10 rounded-2xl font-black flex items-center gap-4 w-fit shadow-2xl transition-all hover:scale-105">
                        EMPEZAR MI CONCILIACIÓN IA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </section>
            </main>

            <footer className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border-t border-slate-200">
                © 2026 ConciliAI • Herramientas para Contadores de Élite
            </footer>
        </div>
    );
}
