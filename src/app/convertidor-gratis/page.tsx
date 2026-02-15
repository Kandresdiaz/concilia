"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Zap, ShieldCheck, Download } from "lucide-react";

export default function FreeConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(false);

    const handleUpload = () => {
        if (!file) return;
        setIsProcessing(true);
        // Simulación de procesamiento (En producción conectaría a una versión simplificada de /api/reconcile)
        setTimeout(() => {
            setIsProcessing(false);
            setResult(true);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-black tracking-tighter">ConciliAI <span className="text-[10px] text-indigo-600 ml-1">GRATIS</span></span>
                    </Link>
                </div>
            </nav>

            <main className="pt-40 pb-20 px-6">
                <div className="max-w-3xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-slate-900">
                            Convierte tu PDF bancario a <span className="text-indigo-600">Excel</span> gratis.
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            Herramienta 100% gratuita. Sin registros, sin límites de conversión para una sola página.
                        </p>
                    </div>

                    {!result ? (
                        <div className="glass-card p-12 rounded-[40px] border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-xl space-y-8">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
                                >
                                    {file ? file.name : "Seleccionar PDF Bancario"}
                                </label>
                            </div>

                            {file && !isProcessing && (
                                <button
                                    onClick={handleUpload}
                                    className="btn btn-primary w-full h-14 rounded-2xl font-black gap-2 transition-all hover:scale-[1.02]"
                                >
                                    <Zap className="w-5 h-5" /> Iniciar Conversión
                                </button>
                            )}

                            {isProcessing && (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Procesando con IA</span>
                                        <span className="animate-pulse">Casi listo...</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 animate-progress"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card p-12 rounded-[40px] border-2 border-emerald-500/20 bg-emerald-50/10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-200">
                                    <Download className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase">¡Conversión lista!</h2>
                                <p className="text-sm text-slate-500 font-medium">Se han extraído 14 transacciones de tu extracto.</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button className="px-8 py-5 bg-emerald-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                                    Descargar Excel (.xlsx)
                                </button>

                                <div className="pt-8 mt-8 border-t border-slate-200 space-y-6">
                                    <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">¿Quieres ahorrar más tiempo?</p>
                                    <p className="text-slate-600 text-sm">Convertir es solo el primer paso. Concilia estos movimientos con tu contabilidad automáticamente.</p>
                                    <Link
                                        href="/login"
                                        className="group px-8 py-5 bg-slate-900 text-white text-lg font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3"
                                    >
                                        Prueba ConciliAI Pro <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: "Privado", desc: "Tus datos se procesan y se eliminan en 24h." },
                            { title: "Preciso", desc: "IA entrenada en extractos bancarios latinos." },
                            { title: "Sin Registro", desc: "Úsalo ya mismo sin dejar tu correo." }
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <h3 className="font-black uppercase text-[10px] tracking-widest text-indigo-600">{item.title}</h3>
                                <p className="text-xs font-medium text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="py-20 text-center border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Distribuido por ConciliAI Enterprise</p>
            </footer>
        </div>
    );
}
