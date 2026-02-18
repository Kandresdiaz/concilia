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
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      <span className="animate-pulse">🔥 OFERTA DE LANZAMIENTO: 50% DCTO DE POR VIDA</span>
      <div className="bg-white/10 px-3 py-1 rounded-lg flex items-center gap-2">
        <Clock className="w-3 h-3" />
        {formatTime(timeLeft)}
      </div>
      <span className="hidden md:inline opacity-70">Quedan 12 lugares disponibles</span>
    </div>
  );
}

// --- Subcomponent: Interactive Demo ---
function DemoSection() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: "Sube tu extracto", icon: <FileText className="w-6 h-6" /> },
    { title: "IA Analiza Tablas", icon: <Bot className="w-6 h-6" /> },
    { title: "Resultado Auditado", icon: <CheckCircle2 className="w-6 h-6" /> }
  ];

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => {
      setStep((prev) => (prev + 1) % 3);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto glass-card rounded-[40px] border border-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Bot className="w-32 h-32" />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
            <Sparkles className="w-3 h-3" /> Demo Interactiva
          </div>
          <h3 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
            Mira la IA en <span className="text-indigo-600 italic">acción</span>
          </h3>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className={cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border border-transparent",
                step === i ? "bg-white shadow-xl border-slate-100 scale-105" : "opacity-40"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  step === i ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paso 0{i + 1}</p>
                  <p className="font-bold text-slate-900">{s.title}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Bot className="w-6 h-6 animate-spin" /> : "Simular Conciliación"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-900 rounded-[30px] aspect-square md:aspect-video p-6 shadow-inner relative overflow-hidden border-8 border-slate-800">
          <div className="absolute top-0 left-0 w-full p-4 border-b border-white/5 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
          </div>

          <div className="mt-8 font-mono text-[10px] text-indigo-400 space-y-2">
            {step === 0 && (
              <div className="animate-pulse space-y-4 text-center pt-12">
                <FileText className="w-16 h-16 mx-auto opacity-20" />
                <p className="animate-bounce">Esperando archivo...</p>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-2">
                <p className="text-emerald-400">{"[LOG]: Cargando modelo Llama 3.2 Vision..."}</p>
                <p>{"[OCR]: Escaneando PDF Bancario..."}</p>
                <p>{"[AI]: Identificando 45 transacciones."}</p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 animate-[progress_1.5s_infinite]"></div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                  <p className="text-emerald-400 font-bold uppercase">✓ Conciliación Exitosa</p>
                  <div className="flex justify-between mt-2">
                    <span>Libros: $45,230.00</span>
                    <span>Bancos: $45,230.00</span>
                  </div>
                  <p className="text-white font-black text-xl mt-2">$ 0.00 Diferencia</p>
                </div>
                <div className="grid grid-cols-2 gap-2 opacity-50">
                  <div className="h-10 bg-white/5 rounded-lg"></div>
                  <div className="h-10 bg-white/5 rounded-lg"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <LimitedOfferBanner />

      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter">ConciliAI</span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            <a href="#features" className="text-[11px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Tecnología</a>
            <a href="#demo" className="text-[11px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest text-indigo-600">Demo Vivo</a>
            <a href="#pricing" className="text-[11px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Precios</a>
            <Link
              href="/login"
              className="px-6 py-3 bg-slate-900 text-white text-[11px] font-black rounded-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-100 uppercase tracking-widest"
            >
              Iniciar mi auditoría
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-48 px-6 text-center overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent"></div>

          <div className="max-w-7xl mx-auto space-y-12">
            <div className="animate-slide-up flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Zap className="w-3 h-3 fill-indigo-600" /> IA especializada en Auditoría Contable
              </div>
              <h1 className="text-6xl md:text-[9rem] font-black tracking-tightest leading-[0.8] text-slate-900 max-w-6xl mx-auto uppercase">
                Concilia tus bancos <span className="text-indigo-600 italic">como un rayo.</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
                Deja de pelearte con Excel. La IA que lee tablas, extrae cifras y certifica diferencias con precisión del 99.9%.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6 animate-slide-up [animation-delay:200ms]">
              <Link
                href="/login"
                className="group px-12 py-6 bg-slate-900 text-white text-xl font-black rounded-[24px] hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-100 flex items-center gap-4 active:scale-95"
              >
                Empezar Auditoría Gratis <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+500 Contadores ahorrando horas</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-24 px-6 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-white"></div>
          <DemoSection />
        </section>

        {/* Benefits Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-8 animate-float">
              <div className="bg-indigo-600/5 aspect-square rounded-[60px] p-12 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-24 bg-indigo-600/10 blur-3xl rounded-full"></div>
                <Bot className="w-64 h-64 text-indigo-600 opacity-20 relative z-10" />
                <div className="absolute bottom-12 right-12 glass-card p-6 rounded-3xl space-y-2 translate-x-12 translate-y-12 shadow-2xl">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xl font-black text-slate-900 underline decoration-indigo-500 decoration-4 underline-offset-4">Error: 0.0%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Validado por IA</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tightest leading-none uppercase italic">Ahorra tiempo,<br /><span className="text-indigo-600">reduce el estrés.</span></h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
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
                    {["2 Conciliaciones / mes", "IA Llama 3.3 70B", "Motor OCR Básico", "PDF con Marca de Agua"].map((f, i) => (
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
                    <p className="text-5xl font-black">$ 24.99 <span className="text-lg opacity-40">/mes</span></p>
                  </div>
                  <ul className="space-y-4">
                    {["50 Conciliaciones / mes", "IA Llama 3.3 70B Elite", "Vision IA 90B (PDF)", "Sin Marca de Agua", "Certificado Digital"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/login" className="block w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-black rounded-3xl transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-xs">
                  Comprar Profesional
                </Link>
              </div>

              {/* Lifetime Deal */}
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 border border-white/20 p-12 rounded-[50px] space-y-10 relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-4 rotate-12 translate-x-4 opacity-10">
                  <Zap className="w-32 h-32" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-2 text-white">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest animate-pulse">LIFETIME ACCESS</span>
                    <h3 className="text-3xl font-black uppercase italic">Despacho</h3>
                    <p className="text-5xl font-black">$ 79.00 <span className="text-lg opacity-40 uppercase">/ mes</span></p>
                  </div>
                  <ul className="space-y-4 text-indigo-100">
                    {["300 Conciliaciones / mes", "Todas las IAs Premium", "Logo Propio en PDF", "Soporte 24/7 VIP", "Actualizaciones de por vida"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 font-medium text-sm">
                        <CheckCircle2 className="w-5 h-5 text-white" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/login" className="block w-full py-5 bg-white text-indigo-900 text-center font-black rounded-3xl transition-all shadow-2xl hover:bg-slate-50 uppercase tracking-widest text-xs">
                  Asegurar de por vida
                </Link>
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
              <a href="#" className="hover:text-indigo-600 transition-colors">Características</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Seguridad</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Legal</a>
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
