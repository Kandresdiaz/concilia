"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ShieldCheck,
    Search,
    Copy,
    CheckCircle2,
    ArrowRight,
    Calculator,
    Zap
} from "lucide-react";

const calculateDV = (nit: string) => {
    const vpri = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    let x = 0;
    let y = 0;
    let z = nit.length;

    for (let i = 0; i < z; i++) {
        y = parseInt(nit.substr(i, 1));
        x += (y * vpri[z - 1 - i]);
    }

    y = x % 11;
    return (y > 1) ? 11 - y : y;
};

export default function NITValidator() {
    const [nit, setNit] = useState("");
    const [dv, setDv] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCalculate = (val: string) => {
        const cleanNit = val.replace(/\D/g, "");
        setNit(cleanNit);
        if (cleanNit.length > 0) {
            setDv(calculateDV(cleanNit));
        } else {
            setDv(null);
        }
    };

    const copyToClipboard = () => {
        if (nit && dv !== null) {
            navigator.clipboard.writeText(`${nit}-${dv}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
            <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-black tracking-tighter uppercase">ConciliAI</span>
                </Link>
                <Link href="/calculadora-ahorro" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    Calculadora ROI
                </Link>
            </nav>

            <div className="max-w-2xl mx-auto space-y-12 animate-slide-up">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        <Calculator className="w-3 h-3" /> Herramienta Gratuita
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tightest leading-none uppercase italic">
                        Validador de <span className="text-indigo-600">NIT & DV</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        Calcula el Dígito de Verificación de cualquier NIT de forma instantánea.
                        Sin registros, sin costo, para siempre.
                    </p>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ingresa el NIT (sin puntos ni guiones)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={nit}
                                onChange={(e) => handleCalculate(e.target.value)}
                                placeholder="Ej: 900123456"
                                className="w-full h-20 px-8 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-3xl outline-none text-3xl font-black transition-all"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                <Search className="w-8 h-8 text-slate-200" />
                            </div>
                        </div>
                    </div>

                    {dv !== null && (
                        <div className="bg-indigo-600 rounded-3xl p-8 text-white space-y-6 animate-float">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Resultado del Cálculo</p>
                            <div className="flex items-end justify-between border-b border-white/20 pb-6">
                                <div>
                                    <p className="text-5xl font-black tracking-tighter italic">
                                        {nit}<span className="text-indigo-300">-{dv}</span>
                                    </p>
                                    <p className="text-xs font-bold text-indigo-200 mt-2">Dígito de Verificación: {dv}</p>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                                >
                                    {copied ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
                                </button>
                            </div>
                            <p className="text-xs font-medium text-indigo-100 italic">
                                Copia este resultado para tus facturas o formularios de la DIAN.
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Zap className="w-32 h-32" />
                    </div>
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-2xl font-black uppercase italic">¿Cansado de digitar?</h3>
                        <p className="text-slate-400 text-sm font-medium">Automatiza todas tus conciliaciones con Inteligencia Artificial.</p>
                    </div>
                    <Link href="/login" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 relative z-10">
                        PROBAR CONCILIAI <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
