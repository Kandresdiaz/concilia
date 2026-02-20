"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Hash, CheckCircle2, AlertCircle, Landmark, Zap } from "lucide-react";

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
                        <Hash className="w-3 h-3" /> HERRAMIENTA PROFESIONAL GRATUITA
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-none uppercase italic text-slate-900">
                        Validador de <span className="text-gradient">NIT</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic leading-relaxed">
                        Calcula el dígito de verificación (DV) al instante. Precisión auditada bajo el estándar de la DIAN.
                    </p>
                </header>

                <div className="bg-white p-6 md:p-12 rounded-[50px] shadow-3xl shadow-violet-100/50 border border-slate-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <Hash className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Ingresar NIT (Solo números)</label>
                            <input
                                type="text"
                                placeholder="Ej: 900.123.456"
                                value={nit}
                                onChange={(e) => handleCalculate(e.target.value)}
                                className="w-full h-24 px-10 text-4xl md:text-6xl font-black bg-slate-50 border-4 border-slate-50 rounded-[35px] focus:border-violet-600 focus:outline-none transition-all placeholder:text-slate-200"
                            />
                        </div>

                        {dv !== null && (
                            <div className="p-12 bg-violet-900 rounded-[40px] text-white text-center animate-in zoom-in-95 duration-500 shadow-3xl shadow-violet-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-600/20 blur-[60px]"></div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-300 mb-4">Dígito de Verificación</p>
                                    <h2 className="text-9xl font-black tracking-tighter drop-shadow-2xl">{dv}</h2>
                                    <div className="mt-6 inline-block px-8 py-3 bg-white/10 rounded-2xl font-mono text-2xl font-black italic">
                                        {nit.replace(/\D/g, "")}-{dv}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <section className="bg-violet-600 rounded-[60px] p-12 md:p-20 text-white space-y-10 shadow-3xl shadow-violet-200 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent" />
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-4xl md:text-6xl font-black uppercase italic leading-tight">¿Validando NITs <span className="text-violet-900/40">uno por uno?</span></h3>
                            <p className="text-violet-100 font-medium text-lg max-w-xl mx-auto italic leading-relaxed">Sube tu auxiliar contable y deja que la IA valide miles de registros, detecte errores y concilie tus bancos en segundos.</p>
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
                    © 2026 ConciliAI • Expertos en Datos Tributarios
                </p>
            </footer>
        </div>
    );
}
