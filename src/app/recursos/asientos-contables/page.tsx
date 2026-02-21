"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FileText,
    ArrowRight,
    Zap,
    Copy,
    Check,
    Landmark,
    Plus,
    Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AsientosGeneratorPage() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);

    // Simple logic for the demo tool
    const generateEntry = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes("pago") || lower.includes("proveedor")) {
            return [
                { account: "2205 - Proveedores Nacionales", debit: "1.000.000", credit: "0" },
                { account: "1110 - Bancos", debit: "0", credit: "1.000.000" }
            ];
        }
        if (lower.includes("venta") || lower.includes("cliente")) {
            return [
                { account: "1110 - Bancos", debit: "1.500.000", credit: "0" },
                { account: "4135 - Comercio al por Mayor", debit: "0", credit: "1.500.000" }
            ];
        }
        return [
            { account: "1110 - Bancos", debit: "X.XXX", credit: "0" },
            { account: "XXXX - Cuenta por definir", debit: "0", credit: "X.XXX" }
        ];
    };

    const entry = generateEntry(input);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 uppercase tracking-widest font-black">
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

            <main className="max-w-4xl mx-auto px-6 py-32 space-y-12">
                {/* Hero */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100">
                        <Calculator className="w-3 h-3" /> Herramientas Pro Gratis
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-tight uppercase italic text-slate-900">
                        Generador de <span className="text-indigo-600">Asientos Contables</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                        Escribe el movimiento bancario y nuestra lógica te sugerirá el asiento contable (Débito y Crédito) en segundos.
                    </p>
                </div>

                {/* Tool UI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Input */}
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-indigo-100/30 border border-slate-100 space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Describe el movimiento</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ej: Pago de factura a proveedor de internet por $150.000..."
                                className="w-full h-40 p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-medium text-slate-600 resize-none"
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 italic">
                            * Intenta escribir palabras clave como "pago", "venta", "comisión", "transferencia".
                        </p>
                    </div>

                    {/* Output */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>

                        <div className="flex justify-between items-center relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Propuesta de Asiento</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(entry));
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors shrink-0"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <table className="w-full">
                                <thead className="border-b border-white/10">
                                    <tr className="text-[9px] font-black uppercase tracking-widest text-indigo-300">
                                        <th className="py-4 text-left">Cuenta</th>
                                        <th className="py-4 text-right">Débito</th>
                                        <th className="py-4 text-right">Crédito</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {entry.map((row, i) => (
                                        <tr key={i} className="text-[11px] font-bold">
                                            <td className="py-4 text-slate-300">{row.account}</td>
                                            <td className="py-4 text-right text-white italic">{row.debit}</td>
                                            <td className="py-4 text-right text-indigo-400 italic">{row.credit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-4 border-t border-white/10 relative z-10">
                            <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 flex items-center gap-4">
                                <Zap className="w-5 h-5 text-indigo-400 fill-current" />
                                <p className="text-[10px] font-medium leading-relaxed text-indigo-200">
                                    **ConciliAI** automatiza esto para miles de movimientos a la vez, aprendiendo de tu plan de cuentas real.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center pt-12">
                    <Link href="/login" className="inline-flex items-center gap-4 px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-indigo-200 group">
                        Automatizar toda mi contabilidad con IA <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </main>

            <footer className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] border-t border-slate-100 italic">
                © 2026 ConciliAI • Expertos en Automatización Contable
            </footer>
        </div>
    );
}
