"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Zap, ShieldCheck, Download, Loader2, AlertCircle, Landmark } from "lucide-react";
import { extractTextFromPdf } from "@/lib/pdf";
import { parseTransactionsFromText, Transaction } from "@/lib/free-parser";
import { generateCSV } from "@/lib/export";

export default function FreeConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [savingLead, setSavingLead] = useState(false);

    const handleUpload = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        setResult(false);

        try {
            const buffer = await file.arrayBuffer();
            const text = await extractTextFromPdf(buffer);
            const data = parseTransactionsFromText(text);

            if (data.length === 0) {
                throw new Error("No pudimos detectar una lista clara de transacciones. Asegúrate de que el PDF sea digital y no una foto escaneada.");
            }

            setTransactions(data);
            setIsProcessing(false);
            setResult(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al procesar el PDF");
            setIsProcessing(false);
        }
    };

    const handleDownloadRequest = () => {
        const savedEmail = localStorage.getItem("concilia_lead_email");
        if (savedEmail) {
            handleDownload();
        } else {
            setShowEmailModal(true);
        }
    };

    const handleDownload = () => {
        if (transactions.length === 0) return;

        // Adaptamos los datos para generateCSV
        const bankData = {
            verified_totals: {
                net: transactions.reduce((acc, t) => acc + t.amount, 0)
            }
        };
        const matchedData = {
            matches: [],
            pendingBank: transactions,
            pendingBook: []
        };

        generateCSV(bankData, {}, matchedData, "CONVERSIÓN GRATUITA", "FREE");
    };

    const saveLeadAndDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSavingLead(true);
        try {
            localStorage.setItem("concilia_lead_email", email);
            setShowEmailModal(false);
            handleDownload();
        } catch (err) {
            console.error(err);
        } finally {
            setSavingLead(false);
        }
    };

    return (
        <div className="min-h-screen bg-mesh text-slate-900 selection:bg-violet-100 selection:text-violet-900 italic">
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-violet-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between font-black uppercase tracking-widest">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-purple">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">Concili<span className="text-violet-600">AI</span> <span className="text-[10px] text-violet-400 ml-1">GRATIS</span></span>
                    </Link>
                    <Link href="/login" className="text-[10px] text-slate-400 hover:text-violet-600 transition-colors">Conectar Pro</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-24 space-y-16">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="space-y-4 pt-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-violet-100">
                            HERRAMIENTA SEGURA (COSTO $0)
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.85] text-slate-900 uppercase italic">
                            PDF a <span className="text-violet-600 font-black">EXCEL</span><br /> instantáneo.
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
                            Extrae transacciones sin gastar créditos. Privacidad total: tus datos no salen de tu navegador.
                        </p>
                    </div>

                    {!result ? (
                        <div className="bg-white p-1 md:p-12 rounded-[50px] shadow-3xl shadow-violet-100/30 border border-slate-100 space-y-8 relative overflow-hidden group">
                            <div className="flex flex-col items-center justify-center gap-8 py-10 border-4 border-dashed border-slate-50 rounded-[40px] hover:bg-slate-50 transition-all">
                                <div className="w-24 h-24 bg-violet-600 text-white rounded-[32px] flex items-center justify-center shadow-purple group-hover:scale-110 transition-transform">
                                    <FileText className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            setFile(e.target.files?.[0] || null);
                                            setError(null);
                                        }}
                                        className="hidden"
                                        id="file-upload"
                                        accept="application/pdf"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer px-10 py-5 bg-violet-600 text-white text-lg font-black rounded-2xl hover:bg-violet-500 transition-all shadow-purple block"
                                    >
                                        {file ? file.name : "SELECCIONAR EXTRACTO PDF"}
                                    </label>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sólo PDF Digitales</p>
                                </div>
                            </div>

                            {file && !isProcessing && (
                                <button
                                    onClick={handleUpload}
                                    className="w-full h-20 bg-slate-50 text-slate-400 rounded-[25px] font-black text-xl flex items-center justify-center gap-4 hover:bg-violet-50 hover:text-violet-600 transition-all uppercase italic"
                                >
                                    <Zap className="w-6 h-6 fill-current" /> Iniciar Procesamiento
                                </button>
                            )}

                            {isProcessing && (
                                <div className="space-y-6 pt-4 text-left">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Local Engine</p>
                                            <p className="text-2xl font-black text-slate-900 uppercase italic">Extrayendo tablas...</p>
                                        </div>
                                        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-600 animate-pulse w-[80%]"></div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 flex items-center gap-4 text-left">
                                    <AlertCircle className="w-6 h-6 shrink-0" />
                                    <p className="font-bold text-sm">Error: {error}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-[50px] shadow-3xl shadow-emerald-100/50 border border-emerald-100 space-y-10 animate-in zoom-in-95 duration-500">
                            <div className="space-y-4">
                                <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-200">
                                    <Download className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 uppercase italic">¡Capturado!</h2>
                                <p className="text-lg text-slate-500 font-medium italic">Se detectaron {transactions.length} registros listos para tu Excel.</p>
                            </div>

                            <button
                                onClick={handleDownloadRequest}
                                className="w-full py-6 bg-emerald-600 text-white text-xl font-black rounded-[30px] shadow-2xl shadow-emerald-200 flex items-center justify-center gap-4 hover:bg-emerald-500 transition-all uppercase italic"
                            >
                                Descargar Resultado <ArrowRight className="w-6 h-6" />
                            </button>

                            <div className="pt-10 mt-10 border-t border-slate-100 space-y-8 bg-violet-50/50 p-8 rounded-[30px] border-2 border-violet-100 relative overflow-hidden">
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <Zap className="w-8 h-8 text-violet-600 fill-violet-600" />
                                </div>
                                <div className="space-y-3 relative z-10 text-left">
                                    <p className="text-[10px] font-black text-violet-600 uppercase tracking-[0.4em]">⚠️ ALERTA DE AUDITORÍA</p>
                                    <h4 className="text-2xl font-black text-slate-900 uppercase italic leading-tight">Has convertido los datos, pero <span className="text-violet-600 underline">no los has auditado.</span></h4>
                                    <p className="text-slate-600 text-sm font-bold leading-relaxed">
                                        Nuestros usuarios en el sector financiero han detectado un promedio de **$1,450,000 COP** en discrepancias ocultas este mes. 
                                        Convertir es gratis. **Perder dinero por no auditar es carísimo.**
                                    </p>
                                </div>
                                <Link
                                    href="/login"
                                    className="group w-full py-6 bg-slate-900 text-white text-xl font-black rounded-[25px] transition-all shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] uppercase italic"
                                >
                                    AUDITAR ESTE ARCHIVO CON IA <ArrowRight className="w-6 h-6" />
                                </Link>
                                <p className="text-[9px] text-slate-400 text-center uppercase font-black tracking-widest">
                                    Garantía Hormozi: Si la IA no encuentra errores, no pagas.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Lead Capture Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEmailModal(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-3xl border border-slate-100 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-violet-600 text-white rounded-3xl flex items-center justify-center shadow-purple mb-8 mx-auto">
                            <Download className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-4">🚀 ¡Todo Listo!</h3>
                        <p className="text-slate-500 font-medium text-center leading-relaxed mb-8 text-sm italic">
                            Tu archivo Excel gratuito está listo. Ingresa tu correo para descargarlo y recibir el reporte de salud financiera.
                        </p>
                        <form onSubmit={saveLeadAndDownload} className="space-y-4">
                            <input 
                                type="email" 
                                required
                                placeholder="tu@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-violet-600 outline-none transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={savingLead}
                                className="w-full h-16 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-violet-100 disabled:opacity-50"
                            >
                                {savingLead ? "Procesando..." : "Descargar Excel Gratis"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <footer className="py-20 text-center space-y-6 border-t border-slate-100 uppercase tracking-[0.5em] font-black">
                <div className="flex justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <a href="https://t.me/c/3814382001/3" target="_blank" className="hover:text-violet-600 transition-colors">Soporte Telegram</a>
                    <a href="https://www.linkedin.com/in/kevin-diaz-192873177" target="_blank" className="hover:text-violet-600 transition-colors">LinkedIn</a>
                </div>
                <p className="text-[10px] text-slate-300">HERRAMIENTA DE CONCILIAI ENTERPRISE</p>
            </footer>
        </div>
    );
}
