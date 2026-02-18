"use client";

import React from "react";
import { X, FileText, Calendar, Building2, CheckCircle2, AlertCircle, Download, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";
import { generatePDF, generateCSV } from "@/lib/export";

interface ReportViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    tier: "FREE" | "PRO" | "ENTERPRISE" | "LIFETIME";
}

export const ReportViewModal: React.FC<ReportViewModalProps> = ({
    isOpen,
    onClose,
    data,
    tier,
}) => {
    if (!isOpen || !data) return null;

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const periodStr = data.month && data.year ? `${monthNames[data.month - 1]} ${data.year}` : "N/A";

    const bankTotal = data.bank_data?.verified_totals?.net || 0;
    const bookTotal = data.book_data?.verified_totals?.net || 0;
    const diff = bankTotal - bookTotal;

    const handleDownloadPDF = () => {
        const matchedData = {
            matches: data.matches || [],
            pendingBank: data.discrepancies?.pendingBank || [],
            pendingBook: data.discrepancies?.pendingBook || []
        };
        generatePDF(data.bank_data, data.book_data, matchedData, diff, data.company_name, tier);
    };

    const handleDownloadCSV = () => {
        const matchedData = {
            matches: data.matches || [],
            pendingBank: data.discrepancies?.pendingBank || [],
            pendingBook: data.discrepancies?.pendingBook || []
        };
        generateCSV(data.bank_data, data.book_data, matchedData, data.company_name, tier);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Resumen de Auditoría</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visualizando reporte guardado</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-10 flex-1">
                    {/* Hero Stats */}
                    <div className="relative p-10 rounded-[40px] bg-slate-900 text-white overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <CheckCircle2 className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Conciliado al {data.precision_score}%</span>
                            </div>
                            <div>
                                <h2 className="text-4xl font-black tracking-tight uppercase italic">{data.company_name || "Empresa S/N"}</h2>
                                <p className="text-slate-400 font-medium flex items-center gap-2 mt-1">
                                    <Calendar className="w-4 h-4" /> Período: {periodStr}
                                </p>
                            </div>
                            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-white/10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Diferencia Neta</p>
                                    <p className={cn(
                                        "text-3xl font-black",
                                        diff === 0 ? "text-emerald-400" : "text-rose-400"
                                    )}>
                                        $ {diff.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">ID Auditoría</p>
                                    <p className="text-lg font-mono text-white/60 truncate">{data.id.split('-')[0]}...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                            <Building2 className="w-5 h-5 text-indigo-600 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Banco</p>
                            <p className="text-xl font-black text-slate-900">$ {bankTotal.toLocaleString()}</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                            <FileJson className="w-5 h-5 text-indigo-600 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Libros</p>
                            <p className="text-xl font-black text-slate-900">$ {bookTotal.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Detailed Tables */}
                    <div className="space-y-8 pb-12">
                        {/* Matches */}
                        {data.matches && data.matches.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Movimientos Conciliados ({data.matches.length})</h4>
                                <div className="border border-slate-100 rounded-[32px] overflow-hidden bg-white">
                                    <table className="w-full text-left text-[11px]">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="p-4 font-black uppercase tracking-widest text-slate-400">Concepto</th>
                                                <th className="p-4 text-right font-black uppercase tracking-widest text-slate-400">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {data.matches.slice(0, 10).map((m: any, i: number) => (
                                                <tr key={i}>
                                                    <td className="p-4 font-bold text-slate-700 truncate max-w-[200px]">{m.bank.description}</td>
                                                    <td className="p-4 text-right font-black text-emerald-600">$ {m.bank.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            {data.matches.length > 10 && (
                                                <tr>
                                                    <td colSpan={2} className="p-4 text-center text-slate-400 italic">Y {data.matches.length - 10} más...</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Pending Bank */}
                        {data.discrepancies?.pendingBank && data.discrepancies.pendingBank.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Pendientes en Banco ({data.discrepancies.pendingBank.length})</h4>
                                <div className="border border-rose-100 rounded-[32px] overflow-hidden bg-rose-50/20">
                                    <table className="w-full text-left text-[11px]">
                                        <tbody className="divide-y divide-rose-100">
                                            {data.discrepancies.pendingBank.map((t: any, i: number) => (
                                                <tr key={i}>
                                                    <td className="p-4 font-bold text-slate-700">{t.description}</td>
                                                    <td className="p-4 text-right font-black text-rose-600">$ {t.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Pending Book */}
                        {data.discrepancies?.pendingBook && data.discrepancies.pendingBook.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Pendientes en Libros ({data.discrepancies.pendingBook.length})</h4>
                                <div className="border border-amber-100 rounded-[32px] overflow-hidden bg-amber-50/20">
                                    <table className="w-full text-left text-[11px]">
                                        <tbody className="divide-y divide-amber-100">
                                            {data.discrepancies.pendingBook.map((t: any, i: number) => (
                                                <tr key={i}>
                                                    <td className="p-4 font-bold text-slate-700">{t.description}</td>
                                                    <td className="p-4 text-right font-black text-amber-600">$ {t.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-8 grid grid-cols-2 gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="btn h-14 bg-white text-slate-900 border-slate-200 rounded-2xl font-black gap-2 hover:bg-slate-100 transition-all flex items-center justify-center p-4"
                    >
                        <Download className="w-5 h-5" /> PDF
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="btn h-14 bg-indigo-600 text-white rounded-2xl font-black gap-2 hover:bg-indigo-700 transition-all flex items-center justify-center p-4 shadow-xl shadow-indigo-100"
                    >
                        <Download className="w-5 h-5" /> CSV
                    </button>
                </div>
            </div>
        </div>
    );
};
