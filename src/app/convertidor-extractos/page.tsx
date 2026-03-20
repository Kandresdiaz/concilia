"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, FileText, Download, Upload, Loader2, CheckCircle2, FileJson, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractTextFromPdf } from "@/lib/pdf";
import { generateCSV } from "@/lib/export";

export default function BankStatementConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [savingLead, setSavingLead] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) setFile(uploadedFile);
    };

    const handleConvert = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            let text = "";
            if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
                const buffer = await file.arrayBuffer();
                text = await extractTextFromPdf(buffer);
            } else {
                text = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = (e) => reject(new Error("Error al leer el archivo"));
                    reader.readAsText(file);
                });
            }

            const response = await fetch("/api/reconcile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, country: "Colombia" }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setResult(data);
        } catch (err: any) {
            setError(err.message || "Error al procesar el archivo");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadRequest = () => {
        const savedEmail = localStorage.getItem("concilia_lead_email");
        if (savedEmail) {
            downloadExcel();
        } else {
            setShowEmailModal(true);
        }
    };

    const downloadExcel = () => {
        if (!result) return;
        generateCSV({ verified_totals: result.verified_totals }, {}, { matches: result.transactions.map((t: any) => ({ bank: t, book: t })), pendingBank: [], pendingBook: [] }, result.empresa || "Convertido", "FREE");
    };

    const saveLeadAndDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSavingLead(true);
        try {
            // Guardamos en localStorage para no pedirlo siempre
            localStorage.setItem("concilia_lead_email", email);
            
            // Simulación de guardado en Supabase (Se podría añadir la tabla leads)
            // await supabase.from('leads').insert({ email, source: 'free-converter' });
            
            setShowEmailModal(false);
            downloadExcel();
        } catch (err) {
            console.error(err);
        } finally {
            setSavingLead(false);
        }
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
                                            <h3 className="text-2xl font-black text-slate-900 uppercase italic">¡Conversión Lista!</h3>
                                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Se detectaron {result.transactions.length} transacciones</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDownloadRequest}
                                        className="btn bg-slate-900 text-white h-16 px-10 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105"
                                    >
                                        <Download className="w-5 h-5" /> DESCARGAR .XLSX
                                    </button>
                                </div>

                                <div className="mt-12 p-8 bg-slate-900 rounded-[35px] text-white space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full"></div>
                                    <div className="space-y-2 relative z-10">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">🎯 OPORTUNIDAD DE RECUPERACIÓN</p>
                                        <h4 className="text-3xl font-black uppercase italic leading-tight">¿Sabes cuánto dinero <br /><span className="text-indigo-400">estás dejando</span> en la mesa?</h4>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                            La conversión a Excel es solo el inicio. ConciliAI Pro detecta discrepancias de centavos que se convierten en **millones de pesos** al año.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 relative z-10">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <p className="text-[9px] font-black uppercase text-indigo-400 mb-1">Costo Pro</p>
                                            <p className="text-xl font-black">$24.99</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <p className="text-[9px] font-black uppercase text-emerald-400 mb-1">Ahorro Promedio</p>
                                            <p className="text-xl font-black">+$1.4M</p>
                                        </div>
                                    </div>
                                    <Link 
                                        href="/login" 
                                        className="block w-full py-6 bg-indigo-600 text-white rounded-[25px] font-black uppercase tracking-widest text-xs text-center hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40"
                                    >
                                        Activar Auditoría IA con Garantía 
                                    </Link>
                                    <p className="text-[9px] text-slate-400 text-center uppercase font-black tracking-widest opacity-50 italic">
                                        * Garantía Hormozi: Si la IA no paga su suscripción encontrando errores, no pagas nada.
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 flex items-center gap-4">
                                <AlertCircle className="w-6 h-6" />
                                <p className="font-bold text-sm">Error: {error}</p>
                            </div>
                        )}
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

            {/* Lead Capture Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEmailModal(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-3xl border border-slate-100 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 mx-auto">
                            <Download className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-4">🚀 ¡Archivo Listo!</h3>
                        <p className="text-slate-500 font-medium text-center leading-relaxed mb-8 text-sm">
                            Ingresa tu correo para recibir el enlace de descarga y un **Cupón del 50% DCTO** para tu primera auditoría IA profesional.
                        </p>
                        <form onSubmit={saveLeadAndDownload} className="space-y-4">
                            <input 
                                type="email" 
                                required
                                placeholder="tu@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={savingLead}
                                className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                            >
                                {savingLead ? "Procesando..." : "Descargar Excel Gratis"}
                            </button>
                        </form>
                        <p className="mt-6 text-[10px] text-slate-400 text-center uppercase font-black tracking-widest">
                            ⚡ Sin spam. Solo herramientas útiles para contadores.
                        </p>
                    </div>
                </div>
            )}

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
