"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, FileText, Download, Upload, Loader2, CheckCircle2, FileJson, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateCSV } from "@/lib/export";

export default function BankStatementConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) setFile(uploadedFile);
    };

    const handleConvert = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            // Reutilizamos la lógica del dashboard para leer el archivo
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target?.result as string;

                try {
                    const response = await fetch("/api/reconcile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text, country: "Colombia" }),
                    });

                    const data = await response.json();
                    if (data.error) throw new Error(data.error);

                    setResult(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsText(file);
        } catch (err: any) {
            setError("Error al leer el archivo");
            setLoading(false);
        }
    };

    const downloadExcel = () => {
        if (!result) return;
        // Simulamos exportación a CSV/Excel con la lógica existente
        generateCSV({ verified_totals: result.verified_totals }, {}, { matches: result.transactions.map((t: any) => ({ bank: t, book: t })), pendingBank: [], pendingBook: [] }, result.empresa || "Convertido", "FREE");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">ConciliAI <span className="text-[10px] text-indigo-600 uppercase">Tools</span></span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Login</Link>
                    <Link href="/login" className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl">Probar Auditoría IA</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-24 space-y-16">
                <header className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        <Sparkles className="w-3 h-3" /> Micro-SaaS
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.85] uppercase italic">
                        De PDF a <span className="text-indigo-600">Excel</span><br />en 3 segundos.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic">
                        La forma más rápida para contadores de extraer tablas de extractos bancarios sin transcribir una sola línea.
                    </p>
                </header>

                <div className="glass-card p-12 rounded-[50px] bg-white shadow-3xl shadow-indigo-100 border border-slate-100 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <FileJson className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        {!result ? (
                            <div className="space-y-8">
                                <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-20 flex flex-col items-center justify-center gap-6 hover:bg-slate-50 transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".pdf,.txt,.csv"
                                    />
                                    <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-2xl">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-2xl font-black text-slate-900 uppercase italic">{file ? file.name : "Sube tu extracto bancario"}</p>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">PDF, TXT o CSV (Max 10MB)</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConvert}
                                    disabled={!file || loading}
                                    className="w-full h-20 bg-slate-900 text-white rounded-[30px] font-black text-xl flex items-center justify-center gap-4 shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                                >
                                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : "CONVERTIR A EXCEL AHORA"} <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <div className="animate-in zoom-in-95 duration-500 space-y-8">
                                <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-[40px] flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 uppercase italic">¡Conversión Listal!</h3>
                                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Se detectaron {result.transactions.length} transacciones</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={downloadExcel}
                                        className="btn bg-slate-900 text-white h-16 px-10 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105"
                                    >
                                        <Download className="w-5 h-5" /> DESCARGAR .XLSX
                                    </button>
                                </div>

                                <div className="bg-slate-900 rounded-[40px] p-12 text-white space-y-8">
                                    <div className="space-y-4 text-center">
                                        <h4 className="text-3xl font-black uppercase italic tracking-tighter">¿Sabías que puedes auditar esto?</h4>
                                        <p className="text-slate-400 font-medium max-w-md mx-auto">ConciliAI no solo convierte, también encuentra descuadres contra tu libro contable en segundos.</p>
                                    </div>
                                    <Link href="/login" className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all">
                                        IR AL PANEL DE AUDITORÍA IA <Sparkles className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 flex items-center gap-4">
                                <AlertCircle className="w-6 h-6" />
                                <p className="font-bold text-sm">Error: {error}</p>
                            </div>
                        ) as any}
                    </div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Sin Registro", desc: "Convierte tu primer extracto sin crear cuenta." },
                        { title: "Precisión IA", desc: "Entendido para bancos latinoamericanos." },
                        { title: "Seguro", desc: "Tus datos no se guardan si no inicias sesión." }
                    ].map((f, i) => (
                        <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 space-y-4">
                            <h4 className="text-lg font-black uppercase italic tracking-tight">{f.title}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">{f.desc}</p>
                        </div>
                    ))}
                </section>
            </main>

            <footer className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border-t border-slate-200">
                © 2026 ConciliAI • Una Herramienta de Marc Lou Style para Contadores
            </footer>
        </div>
    );
}

const AlertCircle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);
