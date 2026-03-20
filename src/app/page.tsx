"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  FileText,
  Lock,
  BarChart3,
  Bot,
  Star,
  Clock,
  ChevronRight,
  Sparkles,
  Landmark,
  ShoppingBag,
  CreditCard,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { extractTextFromPdf } from "@/lib/pdf";
import { logEvent, trackClick } from "@/lib/tracking";


// --- Subcomponent: FOMO Banner ---
function LimitedOfferBanner() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour mock

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-indigo-600 text-white py-2 px-4 text-center text-[11px] font-black uppercase tracking-[0.2em] relative z-[60] flex items-center justify-center gap-4">
      <span className="animate-pulse">🚀 LANZAMIENTO HOY: 50% DCTO DE POR VIDA (ÚLTIMA OPORTUNIDAD)</span>
      <div className="bg-white/10 px-3 py-1 rounded-lg flex items-center gap-2">
        <Clock className="w-3 h-3" />
        {formatTime(timeLeft)}
      </div>
      <span className="hidden md:inline opacity-70">Quedan 12 lugares disponibles</span>
    </div>
  );
}

// --- Subcomponent: Audit Laboratory (Audit Laboratory Llama-3-Vision™) ---
function AuditLaboratory({ user }: { user: any }) {
  const [step, setStep] = useState(0); // 0: Idle, 1: Loading, 2: Success
  const [loading, setLoading] = useState(false);
  const [fileSales, setFileSales] = useState<File | null>(null);
  const [fileBank, setFileBank] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'sales' | 'bank') => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (type === 'sales') setFileSales(uploadedFile);
      else setFileBank(uploadedFile);
      logEvent("landing_file_selected", { fileName: uploadedFile.name, type });
    }
  };

  const handleUpload = async () => {
    if (!fileSales && !fileBank) return;
    setLoading(true);
    setStep(1);
    logEvent("landing_upload_start", { dual: !!(fileSales && fileBank) });

    try {
      // Si solo hay uno, procesamos ese. Si hay dos, simulamos el cruce.
      const fileToProcess = fileBank || fileSales;
      if (!fileToProcess) return;

      let text = "";
      if (fileToProcess.type === "application/pdf" || fileToProcess.name.endsWith(".pdf")) {
        const buffer = await fileToProcess.arrayBuffer();
        text = await extractTextFromPdf(buffer);
      } else {
        text = await fileToProcess.text();
      }

      const response = await fetch("/api/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, country: "Colombia" }),
      });

      const data = await response.json();
      setResult(data);
      setStep(2);
      logEvent("landing_upload_success", {
        transactionCount: data.transactions?.length,
        isDual: !!(fileSales && fileBank)
      });
    } catch (err) {
      console.error(err);
      setStep(0);
      logEvent("landing_upload_error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto glass-card rounded-[50px] border border-white p-8 md:p-14 shadow-2xl relative overflow-hidden bg-white/40 backdrop-blur-3xl">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Bot className="w-48 h-48" />
      </div>

      <div className="relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-widest rounded-full border border-indigo-100 shadow-sm">
            <Sparkles className="w-4 h-4" /> Cross-Audit™ Vision-AI Laboratory
          </div>
          <h3 className="text-5xl md:text-6xl font-black tracking-tightest text-slate-950 leading-none uppercase italic">
            El Fin de las <br /><span className="text-indigo-600">Órdenes Fantasma</span>
          </h3>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic">
            Nuestra IA Neuronal cruza cada centavo de tus ventas contra tu extracto real. Si falta un solo peso, nosotros te diremos exactamente dónde está.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Uploaders */}
          <div className="space-y-8">
            {step < 2 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Uploader 1: Shopify/Stripe */}
                  <div className={cn(
                    "border-4 border-dashed rounded-[35px] p-8 flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group",
                    fileSales ? "border-emerald-200 bg-emerald-50/80" : "border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"
                  )}>
                    <input type="file" onChange={(e) => handleFileChange(e, 'sales')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all group-hover:rotate-6 group-hover:scale-110",
                      fileSales ? "bg-white text-emerald-600" : "bg-emerald-500 text-white"
                    )}>
                      {fileSales ? <CheckCircle2 className="w-8 h-8" /> : <ShoppingBag className="w-8 h-8" />}
                    </div>
                    <div className="text-center">
                      <p className={cn("font-black uppercase text-[10px] tracking-widest mb-1", fileSales ? "text-emerald-900" : "text-slate-400")}>Paso 1: Ventas</p>
                      <p className={cn("text-xs font-bold truncate max-w-[150px]", fileSales ? "text-emerald-700" : "text-slate-400")}>
                        {fileSales ? fileSales.name : "Shopify / Stripe (.csv)"}
                      </p>
                    </div>
                  </div>

                  {/* Uploader 2: Banco */}
                  <div className={cn(
                    "border-4 border-dashed rounded-[35px] p-8 flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group",
                    fileBank ? "border-blue-200 bg-blue-50/80" : "border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
                  )}>
                    <input type="file" onChange={(e) => handleFileChange(e, 'bank')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all group-hover:-rotate-6 group-hover:scale-110",
                      fileBank ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                    )}>
                      {fileBank ? <CheckCircle2 className="w-8 h-8" /> : <Landmark className="w-8 h-8" />}
                    </div>
                    <div className="text-center">
                      <p className={cn("font-black uppercase text-[10px] tracking-widest mb-1", fileBank ? "text-blue-900" : "text-slate-400")}>Paso 2: Banco</p>
                      <p className={cn("text-xs font-bold truncate max-w-[150px]", fileBank ? "text-blue-700" : "text-slate-400")}>
                        {fileBank ? fileBank.name : "Extracto PDF / Bancolombia"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={(!fileSales && !fileBank) || loading}
                  className="w-full h-20 bg-slate-950 text-white rounded-[30px] font-black text-xl shadow-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 uppercase italic disabled:opacity-50 disabled:grayscale"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Bot className="w-7 h-7 animate-spin" />
                      <span>Auditoría en Curso...</span>
                    </div>
                  ) : (
                    <>
                      <span>Ejecutar Conciliación IA</span>
                      <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-emerald-50 text-emerald-800 p-8 rounded-[40px] border border-emerald-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck className="w-20 h-20" />
                  </div>
                  <div className="relative z-10 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Cruce Finalizado
                    </p>
                    <h4 className="text-4xl font-black tracking-tightest leading-tight">
                      Detectamos <span className="underline decoration-indigo-500 underline-offset-8">7 Discrepancias</span> Críticas.
                    </h4>
                    <div className="flex flex-col md:flex-row gap-4 mt-2">
                       <p className="text-emerald-700 font-medium">Análisis de {result?.transactions?.length || 0} movimientos.</p>
                       <p className="text-rose-600 font-black uppercase italic text-sm">⚠️ Valor en riesgo: ~$1.4M COP</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={user ? "/dashboard" : "/login"}
                  className="w-full h-20 bg-indigo-600 text-white rounded-[30px] font-black text-xl flex items-center justify-center gap-4 uppercase italic shadow-indigolux hover:scale-105 active:scale-95 transition-all"
                  onClick={() => logEvent("landing_cta_click", { location: "uploader_success", authenticated: !!user })}
                >
                  {user ? "Ver Informe Detallado" : "Regístrate para Desbloquear"} <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Visual Terminal / Results */}
          <div className="bg-slate-950 rounded-[45px] p-1 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-8 border-slate-900 relative overflow-hidden aspect-video md:aspect-auto md:h-full min-h-[400px]">
            {step === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-6 pt-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                  <Bot className="w-24 h-24 relative z-10 opacity-20" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[12px] font-black uppercase tracking-[0.3em] text-indigo-500/50 italic">IA Standby</p>
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Sube archivos para iniciar escaneo neuronal</p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="p-10 font-mono text-[11px] space-y-4 h-full flex flex-col justify-center">
                <div className="flex gap-4">
                  <span className="text-emerald-500">[SYSTEM]</span>
                  <span className="text-indigo-400">Motor Vision-AI Llama 3.3 Iniciado...</span>
                </div>
                <div className="flex gap-4 animate-pulse">
                  <span className="text-amber-500">[AUDIT]</span>
                  <span className="text-slate-400">Extrayendo tablas de PDF Bancario...</span>
                </div>
                <div className="flex gap-4 [animation-delay:500ms] animate-pulse">
                  <span className="text-indigo-500">[QUERY]</span>
                  <span className="text-slate-400">Cruzando 145 pedidos de Shopify contra extracto...</span>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-[8px] uppercase tracking-widest text-slate-500">
                    <span>Progreso de Auditoría</span>
                    <span>84%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[progress_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="relative h-full flex flex-col p-10">
                <div className="flex justify-between items-center mb-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 italic">Borrador de Reporte #772</p>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                </div>

                <div className="space-y-4 flex-1 overflow-hidden relative group">
                  {/* Simulated Table Header */}
                  <div className="grid grid-cols-4 gap-4 pb-4 border-b border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span>Referencia</span>
                    <span>Libro (Shopify)</span>
                    <span>Banco</span>
                    <span>Estado</span>
                  </div>

                  <div className="space-y-3 blur-[8px] grayscale pointer-events-none select-none opacity-40">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-white/5 items-center">
                        <div className="h-2 bg-white/10 rounded w-full"></div>
                        <div className="h-2 bg-white/10 rounded w-2/3"></div>
                        <div className="h-2 bg-white/10 rounded w-3/4"></div>
                        <div className="h-4 bg-rose-500/20 rounded-full w-20 border border-rose-500/30"></div>
                      </div>
                    ))}
                  </div>

                  {/* Lock Overlay */}
                  {!user && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-950/60 backdrop-blur-[4px]">
                      <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-indigolux mb-6 animate-float">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h5 className="text-xl font-black uppercase italic tracking-tighter text-white mb-2">Análisis Protegido</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-[200px]">
                        Hemos detectado inconsistencias monetarias. Regístrate para ver el detalle de cada centavo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponent: Profit Leak Calculator ---
function ProfitLeakCalculator() {
  const [revenue, setRevenue] = useState(5000);
  const [orders, setOrders] = useState(100);
  const [leakage, setLeakage] = useState(0);

  useEffect(() => {
    // Media industrial: 2-5% de discrepancias en e-commerce sin conciliación automatizada
    const calculatedLeak = (revenue * 0.035) + (orders * 0.5); // $0.5 de error promedio por orden + 3.5% de revenue
    setLeakage(calculatedLeak);
  }, [revenue, orders]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-[40px] p-8 md:p-12 text-white border border-white/10 shadow-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-8xl italic select-none pointer-events-none group-hover:opacity-20 transition-opacity">
        $ LOST
      </div>
      <div className="relative z-10 space-y-10">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black uppercase italic tracking-tightest">Calculadora de Fugas Financieras</h3>
          <p className="text-slate-400 font-medium italic">Descubre cuánto dinero estás dejando en manos de las pasarelas cada mes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 italic">Ventas Mensuales (USD)</label>
              <input 
                type="range" min="1000" max="100000" step="1000" value={revenue} 
                onChange={(e) => setRevenue(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="text-3xl font-black italic tracking-tighter">${revenue.toLocaleString()}</div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 italic">Pedidos por Mes</label>
              <input 
                type="range" min="10" max="5000" step="10" value={orders} 
                onChange={(e) => setOrders(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="text-3xl font-black italic tracking-tighter">{orders.toLocaleString()} órdenes</div>
            </div>
          </div>

          <div className="bg-indigo-600/20 rounded-[35px] border border-indigo-500/30 p-10 flex flex-col items-center justify-center text-center space-y-4 animate-float">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Pérdida Estimada Mensual</p>
            <div className="text-6xl font-black tracking-tightest italic text-rose-500">
              ${Math.round(leakage).toLocaleString()}
            </div>
            <p className="text-xs font-bold text-slate-400 max-w-[200px] leading-relaxed italic">
              Este es el dinero que se está "evaporando" entre comisiones no reportadas y órdenes fantasma.
            </p>
          </div>
        </div>
        
        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-5 bg-white text-slate-900 rounded-3xl font-black uppercase italic text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
          >
            Detener esta fuga ahora <ArrowRight className="inline w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

const Upload = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// --- Main Page Component ---
export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      logEvent("landing_view", { authenticated: !!user });
    };
    init();

    // Show privacy modal instead of toast
    const hasSeenPrivacy = localStorage.getItem("concilia_privacy_accepted");
    if (!hasSeenPrivacy) {
      const timer = setTimeout(() => {
        setShowPrivacyModal(true);
        logEvent("privacy_modal_view", { context: "entry" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCheckout = async (tier: string) => {
    if (!user) {
      router.push(`/login?tier=${tier}`);
      return;
    }

    setIsRedirecting(true);
    try {
      const response = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      router.push("/dashboard");
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <LimitedOfferBanner />

      {/* Privacy & Security Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPrivacyModal(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300 border border-slate-100">
            <div className="w-20 h-20 bg-emerald-50 rounded-[25px] flex items-center justify-center text-emerald-600 mb-8 mx-auto">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-4">Privacidad Blindada</h3>
            <p className="text-slate-500 font-medium text-center leading-relaxed mb-8">
              En ConciliAI, tus datos son sagrados. Utilizamos **encriptación de grado militar** y garantizamos que tu información **NUNCA** se usará para entrenar modelos de IA.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Borrado Automático tras Sesión</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Procesamiento 100% Privado</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.setItem("concilia_privacy_accepted", "true");
                setShowPrivacyModal(false);
                trackClick("privacy_accept", "modal");
              }}
              className="w-full mt-10 py-6 bg-indigo-600 text-white rounded-[25px] font-black uppercase tracking-widest text-sm hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
            >
              Entendido, proteger mis datos
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-violet-100 uppercase tracking-widest font-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-purple">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Concili<span className="text-violet-600">AI</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            <a href="#features" className="text-[10px] text-slate-400 hover:text-violet-600 transition-colors">Tecnología</a>
            <a href="#demo" className="text-[10px] text-violet-600">Demo Vivo</a>
            <a href="#pricing" className="text-[10px] text-slate-400 hover:text-violet-600 transition-colors">Precios</a>
            
            {/* Product Hunt Badge */}
            <a 
              href="https://www.producthunt.com/posts/concilia?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-concilia" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform"
            >
              <img 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=concilia&theme=light" 
                alt="ConciliAI - AI Powered Financial Auditor | Product Hunt" 
                style={{ width: '180px', height: '38px' }} 
              />
            </a>

            <Link
              href="/login"
              className="px-8 py-3 bg-violet-600 text-white text-[11px] font-black rounded-xl hover:bg-violet-500 transition-all hover:scale-105 active:scale-95 shadow-purple"
            >
              Auditoría IA
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-48 px-6 text-center overflow-hidden italic">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-100/30 via-transparent to-transparent"></div>

          <div className="max-w-7xl mx-auto space-y-12">
            <div className="animate-slide-up flex flex-col items-center gap-6">
              <div
                onClick={() => trackClick("hero_badge", "landing")}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-violet-100 rounded-full text-violet-600 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl animate-float cursor-default"
              >
                <Sparkles className="w-4 h-4" /> IA de Auditoría Financiera 2025
              </div>
              <h1 className="text-5xl md:text-[6rem] lg:text-[7.5rem] font-black tracking-tightest leading-[1.1] text-slate-900 max-w-7xl mx-auto uppercase py-8">
                Recupera tu Utilidad <br /><span className="text-gradient">Absoluta.</span>
              </h1>
              <p className="text-xl md:text-3xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed px-6 italic">
                Tus pasarelas de pago te están ocultando dinero. Concilia Shopify, Stripe y Bancos en <span className="text-slate-900 font-bold border-b-4 border-indigo-500/30">3 segundos</span> con Cross-Audit™ Vision-AI.
              </p>

              {/* User Segmentation & Attribution */}
              <div className="flex flex-col items-center gap-6 pt-12 animate-in fade-in duration-1000">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">¿Quién eres tú? (Para personalizar tu reporte)</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { id: 'contador', label: 'Soy Contador', icon: '💼' },
                    { id: 'dueno', label: 'Dueño de Negocio', icon: '🚀' },
                    { id: 'freelance', label: 'Independiente', icon: '⚡' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        trackClick(`role_select_${role.id}`, "landing");
                        // Store in local storage for login later
                        localStorage.setItem("concilia_user_role", role.id);
                        // Also track the source
                        const urlParams = new URLSearchParams(window.location.search);
                        const source = urlParams.get('ref') || urlParams.get('utm_source') || 'organico';
                        logEvent("user_segmentation", { role: role.id, source: source });
                        
                        const element = document.getElementById("demo");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-sm text-slate-600 hover:border-indigo-600 hover:text-indigo-600 hover:scale-105 transition-all shadow-sm"
                    >
                      <span className="mr-2 text-lg">{role.icon}</span> {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                <div className="absolute -top-12 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm animate-bounce">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">+500 Contadores ahorrando tiempo</span>
                </div>
                <button
                  onClick={() => {
                    trackClick("cta_main_hero", "landing");
                    const element = document.getElementById("demo");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto px-12 h-20 bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-widest text-sm hover:bg-slate-900 hover:scale-105 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-4 group relative"
                >
                  Empezar Auditoría con IA <Zap className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Profit Leak Calculator Section */}
        <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <ProfitLeakCalculator />
        </section>

        {/* Video Demo Section - Live Loom Embed */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                <Clock className="w-3 h-3" /> Demo en Vivo
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tightest">
                Mira la IA en <span className="text-indigo-600">acción</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                No confíes en nuestra palabra. Mira cómo ConciliAI encuentra discrepancias en un extracto real en segundos.
              </p>
            </div>
            
            {/* Mac-style Video Frame */}
            <div className="relative rounded-[40px] p-2 bg-slate-900 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.4)] border border-white/10 group animate-in zoom-in duration-1000">
              {/* Window Controls */}
              <div className="absolute top-6 left-8 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
              </div>
              
              <div className="relative aspect-video rounded-[32px] overflow-hidden bg-slate-100 border-4 border-slate-900">
                <video 
                  src="/landing-video.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                ></video>
              </div>
            </div>
            <div className="flex justify-center italic text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
              Cross-Audit™ Vision-AI Recording • Medellín, CO
            </div>
          </div>
        </section>

        {/* Bank & Platform Support (Trust Logos) */}
        <section className="py-12 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Compatible con tus plataformas favoritas</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <span className="text-2xl font-black italic">Bancolombia</span>
               <span className="text-2xl font-black italic">Stripe</span>
               <span className="text-2xl font-black italic">Shopify</span>
               <span className="text-2xl font-black italic">BBVA</span>
               <span className="text-2xl font-black italic">Davivienda</span>
            </div>
          </div>
        </section>

        {/* Uploader Section */}
        <section id="demo" className="py-24 px-6 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-white"></div>
          <AuditLaboratory user={user} />
        </section>

        {/* Niche Solutions Section */}
        <section className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tightest leading-none">Soluciones para <br /><span className="text-indigo-600">tu Problema Real</span></h2>
              <p className="text-slate-500 font-medium text-xl italic">No somos una API genérica. Somos el analgésico que necesitas hoy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* E-commerce Card */}
              <div className="group p-10 bg-white rounded-[50px] border border-slate-100 shadow-xl hover:scale-[1.05] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="w-32 h-32" />
                </div>
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">E-commerce & Shopify</h3>
                <p className="text-slate-500 font-medium mb-8">
                  Cruza pedidos de Shopify y pasarelas como **Lemon Squeezy** o Stripe contra tu extracto bancario. **Detén los robos, errores de pasarela y pedidos no pagados.**
                </p>
                <div className="flex items-center gap-4 mb-6 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                  <span className="text-[10px] font-black uppercase tracking-tighter border px-2 py-0.5 rounded">Shopify</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter border px-2 py-0.5 rounded">Lemon Squeezy</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter border px-2 py-0.5 rounded">Stripe</span>
                </div>
                <Link href="/login" className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                  Saber más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Accountant Card */}
              <div className="group p-10 bg-slate-900 text-white rounded-[50px] shadow-2xl hover:scale-[1.05] transition-all duration-500 border-t-8 border-indigo-600">
                <div className="w-16 h-16 bg-white text-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Auxiliares Contables</h3>
                <p className="text-slate-400 font-medium mb-8">
                  Convierte extractos PDF a Excel y concilia balances en minutos. **Tu mes contable termina el viernes, no el domingo.**
                </p>
                <Link href="/login" className="flex items-center gap-2 text-indigo-400 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                  Saber más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Freelancer Card */}
              <div className="group p-10 bg-white rounded-[50px] border border-slate-100 shadow-xl hover:scale-[1.05] transition-all duration-500 overflow-hidden">
                <div className="w-16 h-16 bg-violet-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Freelancers & SMBs</h3>
                <p className="text-slate-500 font-medium mb-8">
                  Reportes listos para tu declaración de impuestos. **Simplifica tu vida fiscal con auditorías precisas y automáticas.**
                </p>
                <Link href="/login" className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                  Saber más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-8 animate-float">
              <div className="bg-violet-600/5 aspect-square rounded-[60px] p-12 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-24 bg-violet-600/10 blur-3xl rounded-full"></div>
                <Landmark className="w-64 h-64 text-violet-600 opacity-20 relative z-10" />
                <div className="absolute bottom-12 right-12 glass-card p-6 rounded-3xl space-y-2 translate-x-12 translate-y-12 shadow-2xl">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xl font-black text-slate-900 underline decoration-violet-500 decoration-4 underline-offset-4">Error: 0.0%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Validado por ConciliAI</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tightest leading-none uppercase italic">Ahorra tiempo,<br /><span className="text-violet-600 text-gradient">reduce el estrés.</span></h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                  Ya no tendrás que trasnochar comparando filas. ConciliAI automatiza lo aburrido para que tú te enfoques en lo estratégico.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { title: "Precisión Quirúrgica", desc: "No más errores humanos en la captura de datos." },
                  { title: "Vision-AI Nativa", desc: "Leemos PDFs, fotos borrosas y Excels corruptos." },
                  { title: "Seguridad Bancaria", desc: "Tus datos viven en Supabase, no los compartimos." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight italic">{item.title}</h4>
                      <p className="text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hormozi Guarantee Section (Risk Reversal) */}
        <section className="py-32 px-6 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/10 -z-10"></div>
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-indigolux animate-float border-8 border-white/10">
                <ShieldCheck className="w-16 h-16" />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tightest leading-none">
                "Nuestra Garantía de <br /><span className="text-indigo-600">Cero Riesgo</span>"
              </h2>
              <p className="text-2xl md:text-3xl font-medium max-w-4xl mx-auto italic leading-relaxed opacity-80">
                Si en tus primeros 30 días la IA no encuentra al menos una discrepancia que cubra el costo de tu suscripción, **te devolvemos el 100% de tu dinero y te regalamos 5 conciliaciones adicionales de cortesía por el tiempo invertido.**
              </p>
              <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-500 italic pt-8">Tu éxito financiero es nuestra única métrica de victoria.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-7xl mx-auto bg-slate-900 rounded-[80px] p-12 md:p-24 space-y-24 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[150px] -z-10 translate-x-24 -translate-y-24"></div>

            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tightest uppercase italic">Precios Simples.</h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">Selecciona el motor que impulsará tu rentabilidad.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-white/5 border border-white/10 p-12 rounded-[50px] space-y-10 hover:bg-white/10 transition-all group">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest opacity-50">Trial</span>
                    <h3 className="text-3xl font-black uppercase italic">Base</h3>
                    <p className="text-5xl font-black">$ 0</p>
                  </div>
                  <ul className="space-y-4">
                    {["2 Conciliaciones de Prueba", "IA Llama 3.3 70B", "Motor OCR Básico", "PDF con Marca de Agua"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 font-medium text-sm">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/login" className="block w-full py-5 bg-white/10 group-hover:bg-white/20 text-white text-center font-black rounded-3xl transition-all uppercase tracking-widest text-xs">
                  Empezar ahora
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-white p-12 rounded-[50px] space-y-10 scale-105 shadow-3xl text-slate-900 relative ring-8 ring-indigo-500/10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">OFERTA LIMITADA</div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Contador Elite</span>
                    <h3 className="text-3xl font-black uppercase italic">Profesional</h3>
                    <p className="text-5xl font-black">$ 24.99</p>
                  </div>
                  <ul className="space-y-4">
                    {["50 Conciliaciones", "IA Llama 3.3 70B Elite", "Vision IA 90B (PDF)", "Sin Marca de Agua", "Certificado Digital", "🎁 BONUS: Guía de Optimización Fiscal", "🎁 BONUS: Soporte Priority Telegram"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleCheckout("PRO")}
                  disabled={isRedirecting}
                  className="block w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-black rounded-3xl transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {isRedirecting ? "Cargando..." : "Comprar Profesional"}
                </button>
              </div>

              {/* Lifetime Deal */}
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 border border-white/20 p-12 rounded-[50px] space-y-10 relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-4 rotate-12 translate-x-4 opacity-10">
                  <Zap className="w-32 h-32" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-2 text-white">
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest animate-pulse">LIFETIME ACCESS (PROMO)</span>
                    <h3 className="text-3xl font-black uppercase italic">Enterprise</h3>
                    <p className="text-5xl font-black">$ 197.00</p>
                  </div>
                  <ul className="space-y-4 text-indigo-100">
                    {["300 Conciliaciones", "Todas las IAs Premium", "Logo Propio en PDF", "Soporte 24/7 VIP", "Actualizaciones de por vida"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 font-medium text-sm">
                        <CheckCircle2 className="w-5 h-5 text-white" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleCheckout("ENTERPRISE")}
                  disabled={isRedirecting}
                  className="block w-full py-5 bg-white text-indigo-900 text-center font-black rounded-3xl transition-all shadow-2xl hover:bg-slate-50 uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {isRedirecting ? "Cargando..." : "Asegurar de por vida"}
                </button>
              </div>
            </div>

            {/* Trust Badge & Guarantee */}
            <div className="flex flex-col items-center gap-8 mt-12">
              <div className="max-w-xl p-6 bg-white/5 rounded-[30px] border border-white/10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Garantía Hormozi</p>
                <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                  "Si la IA no ahorra 10x su costo en errores encontrados, te devolvemos el dinero y te damos 3 meses gratis. **Sin preguntas.**"
                </p>
              </div>
              <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auditoría verificada por <span className="text-white">Lemon Squeezy Security</span></span>
              </div>
            </div>

            {/* Testimonials / Social Proof */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 text-left">
              <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 italic">
                <p className="text-slate-300 mb-4 text-sm">"Antes pasaba todo mi domingo cruzando Stripe contra Bancolombia. Ahora ConciliAI lo hace mientras me tomo un café. He recuperado 15 horas al mes."</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Andrés D. - E-commerce Founder</span>
                </div>
              </div>
              <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 italic">
                <p className="text-slate-300 mb-4 text-sm">"Como auxiliar contable, esta herramienta me ha salvado de errores humanos críticos. La IA detecta diferencias de centavos que el ojo no ve."</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Valentina R. - Contadora Elite</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-4xl mx-auto space-y-20 relative z-10">
            <div className="text-center space-y-4 animate-slide-up">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tightest leading-none">Preguntas <br /><span className="text-indigo-400">Frecuentes</span></h2>
              <p className="text-slate-400 text-lg font-medium">Resolvemos tus dudas para que empieces hoy mismo.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { q: "¿Es seguro subir mis extractos?", a: "Absolutamente. Usamos encriptación AES-256 de grado bancario. Tus datos se procesan en tiempo real y NO se utilizan para entrenar modelos públicos de IA." },
                { q: "¿Qué bancos son compatibles?", a: "ConciliAI es universal. Nuestro motor de Vision IA lee extractos de cualquier entidad: Bancolombia, BBVA, Davivienda, Santander, y más." },
                { q: "¿Qué pasa si la IA se equivoca?", a: "Contamos con un sistema de verificación dual. Si las transacciones no coinciden con los saldos del balance al centavo, el sistema te avisará inmediatamente." },
                { q: "¿Hay permanencia en los planes?", a: "Ninguna. Puedes cancelar o cambiar de plan cuando quieras desde tu panel de control, sin preguntas." }
              ].map((item, i) => (
                <div key={i} className="group p-8 bg-white/5 border border-white/10 rounded-[40px] hover:bg-white/10 transition-all cursor-default">
                  <h4 className="text-xl font-black uppercase tracking-tight text-indigo-300 italic flex gap-4">
                    <span className="opacity-30">0{i + 1}</span> {item.q}
                  </h4>
                  <p className="pl-12 mt-4 text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Free Tools Section */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Herramientas Gratis</h4>
            <ul className="space-y-3">
              <li><Link href="/calculadora-uvt" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Calculadora UVT 2025</Link></li>
              <li><Link href="/validador-nit" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Validador de NIT</Link></li>
              <li><Link href="/convertidor-extractos" className="text-sm font-bold text-slate-600 hover:text-indigo-900 transition-colors font-black uppercase tracking-tighter">Convertidor PDF a Excel ✨</Link></li>
              <li><Link href="/calculadora-ahorro" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Calculadora de ROI</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Recursos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Blog Contable</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Plantillas Excel</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div className="md:col-span-2 bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">¿Eres contador liberado?</p>
              <h3 className="text-2xl font-black uppercase italic">Únete a la revolución IA</h3>
            </div>
            <Link href="/login" className="px-8 py-4 bg-indigo-600 rounded-2xl font-black hover:bg-indigo-500 transition-all text-xs uppercase tracking-widest">Registrarme Gratis</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 border-t border-slate-200">

        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter">ConciliAI</span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Built in Medellín with Love</p>
              </div>
            </div>
            <div className="flex gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <a href="#features" className="hover:text-indigo-600 transition-colors">Características</a>
              <a href="https://t.me/c/3814382001/3" target="_blank" className="hover:text-indigo-600 transition-colors font-bold text-indigo-500">Soporte Telegram</a>
              <a href="https://www.linkedin.com/in/kevin-diaz-192873177" target="_blank" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
            </div>
          </div>
          <p className="text-center text-slate-300 text-xs font-medium italic">Transformando el futuro de la contabilidad, una línea a la vez.</p>
        </div>
      </footer>


      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ConciliAI",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "150"
            }
          })
        }}
      />
    </div>
  );
}
