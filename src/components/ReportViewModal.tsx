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

                    {/* Pending Items Summary */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Partidas Pendientes
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-2">Solo en Banco</p>
                                <p className="text-2xl font-black text-rose-900">{data.discrepancies?.pendingBank?.length || 0}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Solo en Libros</p>
                                <p className="text-2xl font-black text-amber-900">{data.discrepancies?.pendingBook?.length || 0}</p>
                            </div>
                        </div>
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
