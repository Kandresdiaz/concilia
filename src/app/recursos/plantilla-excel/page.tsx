"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FileSpreadsheet,
    Download,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Landmark,
    Zap,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExcelTemplatePage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">Concili<span className="text-indigo-600">AI</span></span>
                    </Link>
                    <Link href="/login" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        Probar Gratis
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-32 space-y-20">
                {/* Hero */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100">
                        <FileSpreadsheet className="w-3 h-3" /> Recursos para Contadores
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-tight uppercase italic text-slate-900">
                        Plantilla Excel de <span className="text-indigo-600">Conciliación Bancaria</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Descarga el formato ideal para organizar tus movimientos y deja que nuestra IA haga el trabajo pesado en segundos.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button className="w-full sm:w-auto px-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all flex items-center justify-center gap-3 group">
                            <Download className="w-4 h-4 group-hover:bounce" /> Descargar Plantilla .XLSX
                        </button>
                        <Link href="/dashboard" className="w-full sm:w-auto px-8 py-5 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-50 transition-all flex items-center justify-center gap-3">
                            Ver Demo en Vivo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Guide Section */}
                <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-indigo-100/50 border border-slate-100 space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black uppercase italic">¿Cómo usar este formato?</h2>
                        <div className="w-20 h-2 bg-indigo-600 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Fecha",
                                desc: "Usa formato DD/MM/AAAA. Asegúrate de que todas las celdas tengan el mismo estilo.",
                                icon: Sparkles
                            },
                            {
                                step: "02",
                                title: "Descripción",
                                desc: "No te preocupes por el orden. Nuestra IA entiende conceptos como 'Transferencia', 'Pago' o 'Comisión'.",
                                icon: Zap
                            },
                            {
                                step: "03",
                                title: "Importes",
                                desc: "Usa números positivos para ingresos y negativos para egresos, o columnas separadas.",
                                icon: CheckCircle2
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-[32px] space-y-4 hover:bg-indigo-50 transition-all group">
                                <span className="text-4xl font-black text-indigo-100 group-hover:text-indigo-200 transition-colors">{item.step}</span>
                                <div className="space-y-2">
                                    <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                        <item.icon className="w-4 h-4 text-indigo-600" /> {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pro Tip */}
                    <div className="p-8 bg-indigo-600 rounded-[32px] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-black uppercase tracking-tighter">¿Sabías que no necesitas esta plantilla?</h3>
                            <p className="text-indigo-100 font-medium leading-relaxed">
                                Nuestra IA puede leer tus extractos bancarios directamente en **PDF comprimido**, **CSV sucio** o incluso **Imágenes (fotos)** de tus recibos.
                            </p>
                        </div>
                        <Link href="/login" className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all whitespace-nowrap shadow-xl">
                            Subir Extracto Ahora
                        </Link>
                    </div>
                </div>

                {/* SEO Content Section */}
                <article className="prose prose-slate max-w-none space-y-8">
                    <h2 className="text-4xl font-black tracking-tight uppercase italic">La guía definitiva de conciliación para auxiliares</h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                        Como auxiliar contable, sabemos que tu tiempo es el activo más valioso de la empresa. La conciliación bancaria no debería ser una tortura manual de horas. Aquí te explicamos las mejores prácticas para automatizar este proceso y destacar en tu equipo.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 not-prose">
                        <div className="p-4 border border-slate-200 rounded-xl text-center">
                            <p className="text-2xl font-black text-indigo-600">80%</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ahorro de Tiempo</p>
                        </div>
                        <div className="p-4 border border-slate-200 rounded-xl text-center">
                            <p className="text-2xl font-black text-indigo-600">0%</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Errores Humanos</p>
                        </div>
                        <div className="p-4 border border-slate-200 rounded-xl text-center">
                            <p className="text-2xl font-black text-indigo-600">100%</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Auditable</p>
                        </div>
                        <div className="p-4 border border-slate-200 rounded-xl text-center">
                            <p className="text-2xl font-black text-indigo-600">IA</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tecnología Llama 3</p>
                        </div>
                    </div>
                </article>
            </main>

            <footer className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] border-t border-slate-100">
                © 2026 ConciliAI • Potenciando al Contador Moderno
            </footer>
        </div>
    );
}
