"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ImportModal } from "@/components/ImportModal";
import { UsageLimitCard } from "@/components/UsageLimitCard";
import {
  Plus,
  CheckCircle,
  Database,
  Printer,
  Save,
  History as HistoryIcon,
  ArrowRight,
  Lock,
  Eye,
  Loader2,
  Menu,
  FileCheck,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { saveConciliation, getConciliationHistory, getProfile, deleteAccount, deleteConciliation, getConciliationById } from "@/lib/actions";

import { generatePDF, generateCSV } from "@/lib/export";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { SecurityBanner } from "@/components/SecurityBanner";
import { PrivacyModal } from "@/components/PrivacyModal";
import { SocialProofToast } from "@/components/SocialProofToast";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { ReportViewModal } from "@/components/ReportViewModal";
import { PricingModal } from "@/components/PricingModal";


export default function ConciliAI() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // App State
  const [bankData, setBankData] = useState<any>(null);
  const [bookData, setBookData] = useState<any>(null);
  const [tier, setTier] = useState<string>("FREE");
  const [usageCount, setUsageCount] = useState(0);
  const [limit, setLimit] = useState(2); // Default to Free limit (2)
  const [history, setHistory] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [precisionScore, setPrecisionScore] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("user");
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);


  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Initial data fetch
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const profile = await getProfile();
      if (profile) {
        setTier(profile.tier);
        setUsageCount(profile.usage_count);

        // --- 3-Tier Limit Logic (Sync with API) ---
        let calculatedLimit = 2; // Default Gratis
        if (profile.tier === "PRO") calculatedLimit = 50;
        if (profile.tier === "ENTERPRISE") calculatedLimit = 300;
        if (profile.tier === "LIFETIME") calculatedLimit = 9999;
        if (profile.plans_usage_limit) calculatedLimit = profile.plans_usage_limit;

        setLimit(calculatedLimit);
        setRole(profile.role || "user");
      }
      const historyData = await getConciliationHistory();
      setHistory(historyData);
    };
    init();
  }, []);

  const handleLogout = async () => {
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        await supabase.auth.signOut();
        router.push("/");
        setNotification({ type: "success", message: "Tu cuenta y datos han sido eliminados correctamente." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: "Error al eliminar la cuenta: " + err.message });
    } finally {
      setLoading(false);
    }

  };

  const handleImport = async (type: "bank" | "book", source: string, content: string, isImage: boolean = false, country: string = "Colombia") => {
    // Marc Lou Optimization: Guard to block extraction if no credits
    if (role !== "admin" && usageCount >= limit) {
      setNotification({ type: "error", message: "Has alcanzado tu límite. Actualiza a PRO para seguir extrayendo datos." });
      setIsImportOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: isImage ? undefined : content,
          image: isImage ? content : undefined,
          country
        }),
      });

      const data = await response.json();

      if (data.error) {
        setNotification({ type: "error", message: "Error de la IA: " + data.error });
        return;
      }


      // Add a unique ID to each transaction for tracking
      const transactionsWithId = data.transactions?.map((t: any, i: number) => ({
        ...t,
        id: `${type}-${Date.now()}-${i}`,
        matched: false
      })) || [];

      const processedData = {
        ...data,
        transactions: transactionsWithId,
        banco: data.banco,
        tipo_documento: data.tipo_documento,
        empresa: data.empresa,
        // Override verified_totals with summary if AI found clearer totals in "ugly" statements
        verified_totals: data.summary?.saldo_actual !== undefined ? {
          total_in: data.summary.total_abonos || data.verified_totals.total_in,
          total_out: data.summary.total_cargos || data.verified_totals.total_out,
          net: data.summary.saldo_actual || data.verified_totals.net
        } : data.verified_totals
      };

      if (type === "bank") {
        setBankData(processedData);
        if (data.empresa) setCompanyName(data.empresa);
        if (data.precision_score) setPrecisionScore(data.precision_score);
      } else {
        setBookData(processedData);
        if (data.empresa && !companyName) setCompanyName(data.empresa);
      }

      setIsImportOpen(false);
    } catch (err: any) {
      console.error("Import failed:", err);
      setNotification({ type: "error", message: "Error en la importación: " + err.message });
    } finally {
      setLoading(false);
    }

  };

  // Logic to "Cross" (Match) transactions - Algoritmo Maestro
  const matchedData = (() => {
    if (!bankData?.transactions || !bookData?.transactions) return { matches: [], pendingBank: [], pendingBook: [] };

    const bankTransactions = [...bankData.transactions];
    const bookTransactions = [...bookData.transactions];

    const matches: any[] = [];
    const pendingBankIds = new Set(bankTransactions.map(t => t.id));
    const pendingBookIds = new Set(bookTransactions.map(t => t.id));

    // Helper para limpiar referencias
    const cleanRef = (ref: any) => String(ref || "").replace(/[^0-9a-zA-Z]/g, "").toLowerCase();

    // FASE 1: Match Exacto (Monto + Referencia Limpia)
    bankTransactions.forEach(b => {
      const bAmount = Math.abs(Number(b.amount));
      const bRef = cleanRef(b.reference);

      if (bRef && pendingBankIds.has(b.id) && bRef.length > 2) {
        const matchIndex = bookTransactions.findIndex(bk =>
          pendingBookIds.has(bk.id) &&
          Math.abs(Number(bk.amount)) === bAmount &&
          cleanRef(bk.reference) === bRef
        );

        if (matchIndex !== -1) {
          const bk = bookTransactions[matchIndex];
          matches.push({ bank: b, book: bk, type: 'perfecto' });
          pendingBankIds.delete(b.id);
          pendingBookIds.delete(bk.id);
        }
      }
    });

    // FASE 2: Match por Monto + Proximidad de Fecha (+/- 7 días)
    bankTransactions.forEach(b => {
      if (!pendingBankIds.has(b.id)) return;
      const bAmount = Math.abs(Number(b.amount));
      const bDate = new Date(b.date);

      const matchIndex = bookTransactions.findIndex(bk => {
        if (!pendingBookIds.has(bk.id)) return false;
        if (Math.abs(Number(bk.amount)) !== bAmount) return false;

        const bkDate = new Date(bk.date);
        const diffDays = Math.abs(bDate.getTime() - bkDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      });

      if (matchIndex !== -1) {
        const bk = bookTransactions[matchIndex];
        matches.push({ bank: b, book: bk, type: 'fecha' });
        pendingBankIds.delete(b.id);
        pendingBookIds.delete(bk.id);
      }
    });

    // FASE 3: Match solo por Monto (Fallback)
    bankTransactions.forEach(b => {
      if (!pendingBankIds.has(b.id)) return;
      const bAmount = Math.abs(Number(b.amount));

      const matchIndex = bookTransactions.findIndex(bk =>
        pendingBookIds.has(bk.id) &&
        Math.abs(Number(bk.amount)) === bAmount
      );

      if (matchIndex !== -1) {
        const bk = bookTransactions[matchIndex];
        matches.push({ bank: b, book: bk, type: 'monto' });
        pendingBankIds.delete(b.id);
        pendingBookIds.delete(bk.id);
      }
    });

    return {
      matches,
      pendingBank: bankTransactions.filter(t => pendingBankIds.has(t.id)),
      pendingBook: bookTransactions.filter(t => pendingBookIds.has(t.id))
    };
  })();

  const handleSave = async () => {
    if (!bankData && !bookData) return;
    setLoading(true);
    try {
      const finalBalance = (bankData?.verified_totals?.net || 0) - (bookData?.verified_totals?.net || 0);
      await saveConciliation({
        bank: bankData,
        book: bookData,
        company_name: companyName,
        precision_score: precisionScore,
        matches: matchedData.matches,
        pendingBank: matchedData.pendingBank,
        pendingBook: matchedData.pendingBook
      }, finalBalance);

      // Refresh local state
      const profile = await getProfile();
      if (profile) setUsageCount(profile.usage_count);
      const historyData = await getConciliationHistory();
      setHistory(historyData);

      setNotification({ type: "success", message: "Conciliación guardada con éxito." });
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Error al guardar la conciliación." });
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistoryItem = async (item: any) => {
    setLoading(true); // Usamos el loading general para el inicio de la carga
    try {
      const fullData = await getConciliationById(item.id);
      setSelectedReport(fullData);
      setIsReportModalOpen(true);
    } catch (err: any) {
      setNotification({ type: "error", message: "Error al cargar historial: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConciliation = async (id: string) => {
    // Guardar copia del estado anterior para revertir si falla
    const previousHistory = [...history];

    // UI Optimista: Borrar de inmediato en el front
    setHistory(history.filter(h => h.id !== id));
    setDeleteModalOpen(false);
    setItemToDelete(null);

    try {
      const result = await deleteConciliation(id);
      if (result.success) {
        setNotification({ type: "success", message: "Conciliación eliminada con éxito." });
        // Opcional: Re-validar desde el servidor para estar 100% seguros
        const historyData = await getConciliationHistory();
        setHistory(historyData);
      }
    } catch (err: any) {
      // Revertir si hay error
      setHistory(previousHistory);
      setNotification({ type: "error", message: "Error al eliminar: " + err.message });
    }
  };





  const handleUpgrade = async (tier?: string) => {
    if (!tier || tier === "modal" || tier === "") {
      setIsPricingModalOpen(true);
      return;
    }

    setModalLoading(true);
    try {
      const response = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setNotification({ type: "error", message: "Error al iniciar el pago: " + (data.error || "Desconocido") });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: "Error de conexión: " + err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const renderView = () => {
    const bankTotal = bankData?.verified_totals?.net || 0;
    const bookTotal = bookData?.verified_totals?.net || 0;
    const netDifference = bankTotal - bookTotal;

    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Security Banner */}
            <SecurityBanner />

            {/* Premium Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card rounded-[32px] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                    <CheckCircle className="w-3 h-3" /> Monitor de Auditoría
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 break-words leading-tight">
                    {bankData?.summary?.empresa || "EMPRESA S.A.S"}
                  </h1>
                  <p className="text-slate-500 font-medium text-sm md:text-base max-w-lg">
                    Análisis de discrepancias financieras con inteligencia artificial avanzada.
                  </p>
                </div>

                <div className="relative z-10 mt-12 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">AI</div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">DB</div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motor de Conciliación</p>
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Procesamiento activo
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[90px] -mr-32 -mt-32"></div>
              </div>

              <div className="bg-slate-950 p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group flex flex-col justify-between border border-slate-800">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Diferencia Neta</p>
                  <p className={cn(
                    "text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-6 break-all",
                    netDifference === 0 ? "text-emerald-400" : "text-rose-400"
                  )}>
                    $ {(netDifference || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>

                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Proceso de Cruce</span>
                      <span className="text-white">{Math.min(100, Math.round((matchedData?.matches.length / (Math.max(1, (bankData?.transactions?.length || 0) + (bookData?.transactions?.length || 0)))) * 200))}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                        style={{ width: `${Math.min(100, (matchedData?.matches.length / (Math.max(1, (bankData?.transactions?.length || 0) + (bookData?.transactions?.length || 0)))) * 200)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                    netDifference === 0 ? "text-emerald-400" : "text-rose-400/80"
                  )}>
                    <span className={cn("w-2 h-2 rounded-full", netDifference === 0 ? "bg-emerald-400" : "bg-rose-400")}></span>
                    {netDifference === 0 ? "Balance verificado ✓" : "Diferencia pendiente ⚠"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card rounded-[32px] p-8 space-y-4 group relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  {bankData?.verified_totals?.is_verified && (
                    <span className="text-[7px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter border border-emerald-100 flex items-center gap-1">
                      <CheckCircle className="w-2 h-2" /> Verificado con Código
                    </span>
                  )}
                  {!bankData?.verified_totals?.is_verified && (
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Extraído</span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Banco</p>
                  <p className="text-2xl md:text-3xl font-black text-slate-900 break-all">$ {(bankTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="glass-card rounded-[32px] p-8 space-y-4 group relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm transition-transform group-hover:scale-110">
                    <Database className="w-6 h-6" />
                  </div>
                  {bookData?.verified_totals?.is_verified && (
                    <span className="text-[7px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter border border-emerald-100 flex items-center gap-1">
                      <CheckCircle className="w-2 h-2" /> Verificado con Código
                    </span>
                  )}
                  {!bookData?.verified_totals?.is_verified && (
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Cargado</span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Libros</p>
                  <p className="text-2xl md:text-3xl font-black text-slate-900 break-all">$ {(bookTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className={cn(
                "glass-card rounded-[32px] p-8 space-y-4 border-2 transition-all duration-500",
                netDifference === 0 ? "border-emerald-500/20 bg-emerald-50/10" : "border-rose-500/20 bg-rose-50/10"
              )}>
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                    netDifference === 0 ? "bg-emerald-500 shadow-emerald-200" : "bg-rose-500 shadow-rose-200"
                  )}>
                    {netDifference === 0 ? <CheckCircle className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    netDifference === 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {netDifference === 0 ? "Consolidado" : "Diferencia"}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Neta de Ajuste</p>
                  <p className={cn(
                    "text-2xl md:text-3xl font-black break-all",
                    netDifference === 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    $ {(netDifference || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-md">
              <UsageLimitCard usageCount={usageCount} tier={tier} limit={limit} onUpgradeAction={() => handleUpgrade("")} />
            </div>

            {/* Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-[40px] p-10 bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-8">
                  <p className="text-4xl font-black tracking-tighter leading-tight">
                    Se detectaron {matchedData?.matches.length || 0} coincidencias exactas.
                  </p>
                  <button
                    onClick={() => setCurrentView("partidas")}
                    className="btn bg-white text-slate-900 border-none rounded-2xl px-10 h-14 font-black hover:bg-slate-100 transition-all"
                  >
                    Ver Detalle Completo
                  </button>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-1000"></div>
              </div>

              <div className="glass-card rounded-[40px] p-10 flex flex-col justify-between border-slate-100 border bg-white/50 backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <HistoryIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Última Auditoría</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {history[0] ? new Date(history[0].created_at).toLocaleDateString() : "No hay registros previos"}
                  </p>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => setCurrentView("historial")}
                    className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 group"
                  >
                    Ver Historial Completo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "partidas":
        return (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankData && (
                <div className="glass-card rounded-[24px] p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Banco</p>
                      <p className="font-bold text-slate-900 text-sm">{bankData.banco || "Extracto"}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tight">Cargado</span>
                </div>
              )}
              {bookData && (
                <div className="glass-card rounded-[24px] p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Libros</p>
                      <p className="font-bold text-slate-900 text-sm">{bookData.empresa || "Auxiliar"}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tight">Cargado</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card rounded-[40px] overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Extracto Bancario</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="pb-4">Concepto</th>
                        <th className="pb-4 text-right">Monto</th>
                        <th className="pb-4 text-center">✓</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {bankData?.transactions?.map((t: any) => (
                        <tr key={t.id} className="group/row hover:bg-slate-50/80 transition-colors">
                          <td className="py-4">
                            <p className="text-[11px] font-semibold text-slate-900 uppercase truncate max-w-[160px]">{t.description}</p>
                            <p className="text-[8px] font-mono text-slate-400 mt-0.5">{t.date}</p>
                          </td>
                          <td className="py-4 text-right">
                            <span className={cn("text-xs font-black", (t.amount || 0) > 0 ? "text-emerald-600" : "text-rose-600")}>
                              $ {(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            {matchedData?.matches.some(m => m.bank.id === t.id) ? (
                              <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto scale-90">
                                <CheckCircle className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="glass-card rounded-[40px] overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Auxiliar Contable</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="pb-4">Concepto</th>
                        <th className="pb-4 text-right">Monto</th>
                        <th className="pb-4 text-center">✓</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {bookData?.transactions?.map((t: any) => (
                        <tr key={t.id} className="group/row hover:bg-slate-50/80 transition-colors">
                          <td className="py-4">
                            <p className="text-[11px] font-semibold text-slate-900 uppercase truncate max-w-[160px]">{t.description}</p>
                            <p className="text-[8px] font-mono text-slate-400 mt-0.5">{t.date}</p>
                          </td>
                          <td className="py-4 text-right">
                            <span className={cn("text-xs font-black", (t.amount || 0) > 0 ? "text-indigo-600" : "text-rose-600")}>
                              $ {(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            {matchedData?.matches.some(m => m.book.id === t.id) ? (
                              <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto scale-90">
                                <CheckCircle className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case "acta":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Actions Bar */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <button
                onClick={handleSave}
                disabled={loading || (!bankData && !bookData)}
                className="btn btn-primary px-8 md:px-12 h-14 rounded-2xl font-black flex gap-3 shadow-xl shadow-primary/20"
              >
                <Save className="w-5 h-5" /> {loading ? "Guardando..." : "Guardar Auditoría"}
              </button>

              <button
                onClick={() => generatePDF(bankData, bookData, matchedData, netDifference, companyName, tier as "FREE" | "PRO")}
                className="btn btn-neutral px-8 md:px-12 h-14 rounded-2xl font-black flex gap-3 shadow-xl"
              >
                <Printer className="w-5 h-5" /> Exportar PDF
              </button>

              <button
                onClick={() => generateCSV(bankData, bookData, matchedData, companyName, tier as "FREE" | "PRO")}
                className="btn btn-ghost px-8 md:px-12 h-14 rounded-2xl font-black border-slate-200 flex gap-3 shadow-sm"
              >
                <Database className="w-5 h-5" /> Exportar CSV
              </button>
            </div>

            {/* Official Report Card */}
            <div className="bg-white border border-slate-200 rounded-[40px] shadow-2xl overflow-hidden relative group max-w-5xl mx-auto">
              {/* Header Banner */}
              <div className="h-3 bg-slate-900 group-hover:bg-indigo-600 transition-colors duration-500"></div>

              <div className="p-8 md:p-16 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-100 pb-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Acta Final de Conciliación</h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Auditoría Financiera Certificada</span>
                      </div>
                    </div>
                    <div className="space-y-1 pl-1">
                      <div className="relative group/input">
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          disabled={tier === "FREE"}
                          placeholder="Nombre de la Empresa"
                          className={cn(
                            "text-xl font-bold bg-transparent border-b border-dashed border-slate-300 focus:border-primary outline-none w-full max-w-md transition-colors",
                            tier === "FREE" ? "text-slate-400 cursor-not-allowed" : "text-slate-900"
                          )}
                        />
                        {tier === "FREE" && (
                          <div className="absolute -top-6 left-0 opacity-0 group-hover/input:opacity-100 transition-opacity bg-indigo-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest whitespace-nowrap shadow-xl">
                            Actualiza a PRO para editar nombre
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-slate-500 flex items-center gap-2">
                        <span className="font-bold">Periodo:</span> {bankData?.summary?.periodo || "Enero 2024"}
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="font-bold">Generado:</span> {new Date().toLocaleDateString("es-CO", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 min-w-[240px]">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Auditoría</p>
                      {precisionScore && (
                        <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {precisionScore}% Precisión AI
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500">Balance Neta</span>
                        <span className={cn(
                          "text-sm font-black",
                          netDifference === 0 ? "text-emerald-600" : "text-rose-600"
                        )}>
                          $ {netDifference.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500">Estado</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-sm",
                          netDifference === 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {netDifference === 0 ? "CONCILIADO" : "PENDIENTE"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Tables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
                  <div className="absolute left-1/2 top-12 bottom-12 w-px bg-slate-100 hidden md:block"></div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Debitos Extracto (Sin Libro)</h3>
                    </div>
                    {matchedData.pendingBank.length > 0 ? (
                      <div className="space-y-4">
                        <table className="w-full text-left">
                          <tbody className="divide-y divide-slate-50">
                            {matchedData.pendingBank.map((t: any) => (
                              <tr key={t.id} className="group/row">
                                <td className="py-4">
                                  <p className="text-[11px] font-semibold text-slate-900 uppercase">{t.description}</p>
                                  <span className="text-[8px] font-mono text-slate-400">{t.date}</span>
                                </td>
                                <td className="py-4 text-right">
                                  <span className="text-xs font-black text-slate-900">$ {(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-between items-center py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Extracto</span>
                          <span className="text-sm font-black text-slate-900">
                            $ {matchedData.pendingBank.reduce((acc: number, t: any) => acc + (t.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ) : <p className="text-xs italic text-slate-300 py-4">Sin discrepancias</p>}
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Ajustes Libro (Sin Extracto)</h3>
                    </div>
                    {matchedData.pendingBook.length > 0 ? (
                      <div className="space-y-4">
                        <table className="w-full text-left">
                          <tbody className="divide-y divide-slate-50">
                            {matchedData.pendingBook.map((t: any) => (
                              <tr key={t.id} className="group/row">
                                <td className="py-4">
                                  <p className="text-[11px] font-semibold text-slate-900 uppercase">{t.description}</p>
                                  <span className="text-[8px] font-mono text-slate-400">{t.date}</span>
                                </td>
                                <td className="py-4 text-right">
                                  <span className="text-xs font-black text-slate-900">$ {(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-between items-center py-4 px-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                          <span className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">Total Auxiliar</span>
                          <span className="text-sm font-black text-slate-900">
                            $ {matchedData.pendingBook.reduce((acc: number, t: any) => acc + (t.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ) : <p className="text-xs italic text-slate-300 py-4">Sin discrepancias</p>}
                  </div>
                </div>

                {/* Bottom Signature Area */}
                <div className="grid grid-cols-2 gap-24 pt-24 border-t border-slate-100">
                  <div className="space-y-8">
                    <div className="w-full border-t border-slate-300 pt-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Firma Responsable / Auditor</p>
                      <p className="text-[9px] text-slate-400 mt-1">Conciliación realizada por ConciliAI Professional</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="w-full border-t border-slate-300 pt-3 text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Revisado / Gerencia</p>
                      <p className="text-[8px] font-mono uppercase tracking-widest font-bold text-slate-300 mt-1">CERT: {Math.random().toString(36).substring(2).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "historial":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-base-100 border border-base-200 rounded-[48px] overflow-hidden shadow-sm">
              <div className="p-8 bg-gray-50 border-b border-base-200 flex justify-between items-center">
                <h3 className="font-black uppercase text-[10px] tracking-[0.3em]">Historial de Auditorías</h3>
                {tier === "FREE" && role !== "admin" && (
                  <span className="badge badge-warning font-bold gap-2">
                    <Lock className="w-3 h-3" /> Solo PRO
                  </span>
                )}
              </div>

              <div className={cn(
                "p-8",
                tier === "FREE" && role !== "admin" && "relative"
              )}>
                {/* Blur overlay for FREE (Skip if Admin) */}
                {tier === "FREE" && role !== "admin" && (
                  <div className="absolute inset-0 z-10 backdrop-blur-md flex items-center justify-center p-12 text-center bg-white/20">
                    <div className="max-w-md space-y-6">
                      <HistoryIcon className="w-16 h-16 mx-auto text-primary opacity-20" />
                      <h4 className="text-3xl font-black tracking-tight">Acceso Bloqueado</h4>
                      <p className="text-gray-500 font-medium">El historial completo y la descarga de actas anteriores es exclusivo para usuarios **PRO**.</p>
                      <button className="btn btn-primary rounded-2xl px-12 font-black shadow-xl shadow-primary/20">
                        Actualizar a PRO
                      </button>
                    </div>
                  </div>
                )}

                <table className="table table-md w-full">
                  <thead>
                    <tr className="uppercase text-[10px] tracking-widest text-gray-400 border-b border-base-200">
                      <th className="py-6">Empresa</th>
                      <th className="py-6">Período</th>
                      <th className="py-6">Precisión</th>
                      <th className="py-6">Diferencia Neta</th>
                      <th className="py-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className={cn(tier === "FREE" && role !== "admin" && "opacity-50")}>

                    {history.length > 0 ? (
                      history.map((h) => {
                        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                        const period = h.month && h.year
                          ? `${monthNames[h.month - 1]} ${h.year}`
                          : new Date(h.created_at).toLocaleDateString();
                        return (
                          <tr key={h.id} className="hover:bg-base-200/50 transition-colors">
                            <td className="py-6 font-bold text-sm">{h.company_name || "Sin nombre"}</td>
                            <td className="py-6 font-mono text-sm">{period}</td>
                            <td className="py-6">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-black",
                                (h.precision_score || 0) >= 95
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              )}>
                                {h.precision_score || 0}%
                              </span>
                            </td>
                            <td className={cn(
                              "py-6 font-black text-sm",
                              h.final_balance === 0 ? "text-success" : "text-error"
                            )}>
                              $ {Number(h.final_balance).toLocaleString()}
                            </td>
                            <td className="py-6 text-right flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewHistoryItem(h)}
                                className="btn btn-ghost btn-sm rounded-xl gap-2 hover:bg-slate-100"
                              >
                                <Eye className="w-4 h-4" /> Ver
                              </button>
                              <button
                                onClick={() => {
                                  setItemToDelete(h);
                                  setDeleteModalOpen(true);
                                }}
                                className="btn btn-ghost btn-sm rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>

                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-gray-300 italic">No hay registros aún</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-base-100 font-sans text-gray-900 overflow-x-hidden">
      {/* Privacy Modal */}
      <PrivacyModal />

      {/* Modern Notification System */}
      {notification && (
        <div className="fixed top-8 right-8 z-[200] animate-in fade-in slide-in-from-top-8 duration-500">
          <div className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md",
            notification.type === "success" ? "bg-emerald-50/90 border-emerald-100 text-emerald-900" :
              notification.type === "error" ? "bg-rose-50/90 border-rose-100 text-rose-900" :
                "bg-indigo-50/90 border-indigo-100 text-indigo-900"
          )}>
            {notification.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {notification.type === "error" && <Plus className="w-5 h-5 text-rose-500 rotate-45" />}
            {notification.type === "info" && <Eye className="w-5 h-5 text-indigo-500" />}

            <p className="text-sm font-black tracking-tight">{notification.message}</p>

            <button
              onClick={() => setNotification(null)}
              className="ml-4 p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>
          {/* Progress bar for auto-hide */}
          <div className="mt-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-3000 ease-linear",
                notification.type === "success" ? "bg-emerald-500" :
                  notification.type === "error" ? "bg-rose-500" :
                    "bg-indigo-500"
              )}
              style={{ animation: "shrink 3s linear forwards" }}
              onAnimationEnd={() => setNotification(null)}
            ></div>
          </div>
          <style jsx>{`
            @keyframes shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )}

      <Sidebar

        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        usageCount={usageCount}
        limit={limit}
        tier={tier}
        email={user?.email || ""}
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        onUpgrade={handleUpgrade}
        onDeleteAccount={handleDeleteAccount}
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-base-100 border-b border-base-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="font-black tracking-tight text-primary">ConciliAI</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-base-200 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-12 lg:p-24 space-y-12 max-w-7xl mx-auto w-full">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 capitalize">
                  {currentView === "acta" ? "Resumen Final" : currentView}
                </h1>
                <p className="text-gray-400 font-medium text-sm md:text-base">Control de gestión y auditoría financiera.</p>
              </div>
              {currentView !== "acta" && (
                <button
                  onClick={() => setIsImportOpen(true)}
                  className="btn btn-primary h-14 md:h-16 px-8 md:px-12 rounded-2xl md:rounded-[24px] font-black flex gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all text-sm md:text-base"
                >
                  <Plus className="w-5 h-6 md:h-6" /> Importar
                </button>
              )}
            </header>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto h-full">
              {renderView()}
            </div>
          </div>
        </div>

        <ImportModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImport={handleImport}
          loading={loading}
          bankLoaded={!!bankData}
          bookLoaded={!!bookData}
          usageCount={usageCount}
          limit={limit}
          role={role}
          onUpgrade={() => {
            setIsImportOpen(false);
            handleUpgrade();
          }}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={() => handleDeleteConciliation(itemToDelete?.id)}
          title={itemToDelete?.company_name || "esta auditoría"}
          loading={loading}
        />

        <ReportViewModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          data={selectedReport}
          tier={tier as any}
        />

        <PricingModal
          isOpen={isPricingModalOpen}
          onCloseAction={() => setIsPricingModalOpen(false)}
          onUpgradeAction={(selectedTier) => handleUpgrade(selectedTier)}
          loading={modalLoading}
        />



        {loading && (
          <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="font-black text-primary animate-pulse uppercase text-xs tracking-widest">Analizando con IA...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
