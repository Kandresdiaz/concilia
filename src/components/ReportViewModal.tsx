"use client";

import React from "react";
import { X, FileText, Calendar, Building2, CheckCircle2, AlertCircle, Download, FileJson, ShieldCheck, FileCheck } from "lucide-react";
import { cn, parseCurrency } from "@/lib/utils";
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
    const diff = data.final_balance !== undefined ? data.final_balance : (bankTotal - bookTotal);

    // Totales de pendientes
    const totalPendingBank = (data.discrepancies?.pendingBank || []).reduce((acc: number, t: any) => acc + parseCurrency(t.amount || 0), 0);
    const totalPendingBook = (data.discrepancies?.pendingBook || []).reduce((acc: number, t: any) => acc + parseCurrency(t.amount || 0), 0);

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
            <div className="w-full max-w-3xl h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">
                {/* Header Superior */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Acta Guardada</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {data.id.split('-')[0]}...</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleDownloadPDF} className="btn btn-sm btn-ghost gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                            <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Contenido Estilo Acta Final */}
                <div className="p-12 space-y-12 flex-1 max-w-2xl mx-auto w-full">
                    {/* Encabezado de Documento */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-slate-900 rounded-full"></div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Acta Final de Conciliación</h2>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Auditoría Financiera Certificada</span>
                                </div>
                            </div>
                            <div className="space-y-1 pl-1">
                                <h4 className="text-xl font-bold text-slate-900">{data.company_name || "Sin nombre"}</h4>
                                <p className="text-[10px] font-medium text-slate-500 flex items-center gap-2">
                                    <span className="font-bold">Periodo:</span> {periodStr}
                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    <span className="font-bold">Guardado:</span> {new Date(data.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 min-w-[240px]">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Auditoría</p>
                                <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    {data.precision_score}% Precisión AI
                                </span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-slate-500">Balance Neta</span>
                                    <span className={cn(
                                        "text-sm font-black",
                                        diff === 0 ? "text-emerald-600" : "text-rose-600"
                                    )}>
                                        $ {diff.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-slate-500">Estado</span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-sm",
                                        diff === 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                    )}>
                                        {diff === 0 ? "CONCILIADO" : "PENDIENTE"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tablas de Discrepancias */}
                    <div className="grid grid-cols-1 gap-12 pt-8 border-t border-slate-50">
                        {/* Pending Bank */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Debitos Extracto (Sin Libro)</h3>
                            </div>
                            {(data.discrepancies?.pendingBank || []).length > 0 ? (
                                <div className="space-y-4">
                                    <div className="max-h-[300px] overflow-y-auto">
                                        <table className="w-full text-left">
                                            <tbody className="divide-y divide-slate-50">
                                                {data.discrepancies.pendingBank.map((t: any, i: number) => (
                                                    <tr key={i} className="group/row">
                                                        <td className="py-4">
                                                            <p className="text-[11px] font-semibold text-slate-900 uppercase">{t.description}</p>
                                                            <span className="text-[8px] font-mono text-slate-400">{t.date}</span>
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <span className="text-xs font-black text-slate-900">$ {parseCurrency(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-between items-center py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Extracto</span>
                                        <span className="text-sm font-black text-slate-900">$ {totalPendingBank.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            ) : <p className="text-xs italic text-slate-300 py-4">Sin discrepancias en banco</p>}
                        </div>

                        {/* Pending Book */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Ajustes Libro (Sin Extracto)</h3>
                            </div>
                            {(data.discrepancies?.pendingBook || []).length > 0 ? (
                                <div className="space-y-4">
                                    <div className="max-h-[300px] overflow-y-auto">
                                        <table className="w-full text-left">
                                            <tbody className="divide-y divide-slate-50">
                                                {data.discrepancies.pendingBook.map((t: any, i: number) => (
                                                    <tr key={i} className="group/row">
                                                        <td className="py-4">
                                                            <p className="text-[11px] font-semibold text-slate-900 uppercase">{t.description}</p>
                                                            <span className="text-[8px] font-mono text-slate-400">{t.date}</span>
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <span className="text-xs font-black text-slate-900">$ {parseCurrency(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-between items-center py-4 px-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                        <span className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">Total Auxiliar</span>
                                        <span className="text-sm font-black text-slate-900">$ {totalPendingBook.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            ) : <p className="text-xs italic text-slate-300 py-4">Sin discrepancias en libros</p>}
                        </div>
                    </div>

                    {/* Area de Firmas */}
                    <div className="grid grid-cols-2 gap-12 md:gap-24 pt-16 border-t border-slate-100 pb-12">
                        <div className="space-y-4">
                            <div className="w-full border-t border-slate-300 pt-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Responsable / Auditor</p>
                                <p className="text-[8px] text-slate-400 mt-1 italic">Conciliación AI Professional</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-full border-t border-slate-300 pt-3 text-right">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Revisado / Gerencia</p>
                                <p className="text-[8px] font-mono uppercase tracking-widest font-bold text-slate-300 mt-1 truncate">CERT: {data.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones del Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 p-8 grid grid-cols-2 gap-4">
                    <button
                        onClick={handleDownloadCSV}
                        className="btn h-14 bg-white text-slate-900 border-slate-200 rounded-2xl font-black gap-2 hover:bg-slate-50 transition-all flex items-center justify-center p-4"
                    >
                        <Download className="w-5 h-5" /> EXPORTAR CSV
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="btn h-14 bg-indigo-600 text-white rounded-2xl font-black gap-2 hover:bg-indigo-700 transition-all flex items-center justify-center p-4 shadow-xl shadow-indigo-100"
                    >
                        <Download className="w-5 h-5" /> DESCARGAR PDF
                    </button>
                </div>
            </div>
        </div>
    );
};
