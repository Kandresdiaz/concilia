"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  FileText,
  Lock,
  BarChart3,
  Bot
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter">ConciliAI</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Características</a>
            <a href="#pricing" className="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Precios</a>
            <Link
              href="/login"
              className="px-6 py-3 bg-slate-900 text-white text-[13px] font-black rounded-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 uppercase tracking-widest"
            >
              Empezar Ahora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-[11px] font-black uppercase tracking-widest animate-fade-in">
            <Zap className="w-3 h-3" /> Conciliaciones en segundos, no horas
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.9] text-slate-900 max-w-5xl mx-auto italic uppercase">
            La IA que <span className="text-indigo-600">audita</span> como un experto.
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            ConciliAI lee tus extractos bancarios y auxiliares contables con visión artificial, detectando discrepancias con precisión quirúrgica del 99.9%.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
            <Link
              href="/login"
              className="group px-10 py-5 bg-slate-900 text-white text-lg font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-3 active:scale-95"
            >
              Automatizar mi contabilidad <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Prueba gratuita de 5 conciliaciones</p>
          </div>

          {/* Hero Visual Mockup */}
          <div className="relative pt-24 max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full transform -translate-y-24"></div>
            <div className="glass-card rounded-[40px] border border-white shadow-2xl overflow-hidden aspect-video bg-white/40 relative z-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl animate-pulse">
                    <Bot className="w-10 h-10" />
                  </div>
                  <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">Motor Pro activado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">Tecnología de Grado Auditoría</h2>
            <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Visión Artificial 90B",
                desc: "Equipado con modelos Llama 3.2 90B optimizados para leer tablas financieras complejas y densas."
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Verificación por Código",
                desc: "Cada cifra extraída es validada matemáticamente por algoritmos determinísticos para asegurar error cero."
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Acta Final Certificada",
                desc: "Exporta resultados en PDF profesional con estilo de auditoría, listo para firmas y presentación legal."
              }
            ].map((f, i) => (
              <div key={i} className="glass-card p-10 rounded-[32px] space-y-6 hover:translate-y-[-8px] transition-all duration-500 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-slate-900 text-white rounded-[60px] mx-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">Precios Simples</h2>
            <p className="text-slate-400 font-medium">Empieza gratis, escala cuando lo necesites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/5 border border-white/10 p-12 rounded-[40px] space-y-8">
              <div className="space-y-2">
                <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">Ideal para Freelancers</span>
                <h3 className="text-3xl font-black uppercase italic">Plan Gratuito</h3>
                <p className="text-5xl font-black">$ 0</p>
              </div>
              <ul className="space-y-4">
                {["5 Conciliaciones por mes", "IA Llama 3.2 11B", "Exportación PDF básica", "Soporte comunitario"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs">
                Empezar Gratis
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-12 rounded-[40px] space-y-8 relative overflow-hidden text-slate-900 shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/20">
              <div className="absolute top-8 right-8 bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Más popular</div>
              <div className="space-y-2">
                <span className="text-indigo-600 text-xs font-black uppercase tracking-widest">Para contadores PRO</span>
                <h3 className="text-3xl font-black uppercase italic">Plan Vitalicio</h3>
                <p className="text-5xl font-black">$ 99 <span className="text-base text-slate-400 font-bold uppercase tracking-widest">pago único</span></p>
              </div>
              <ul className="space-y-4">
                {["Conciliaciones ilimitadas", "IA Llama 3.2 90B (Vision)", "Acta Final Certificada", "Carga por imágenes/PDF", "Soporte Prioritario"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs">
                Comprar Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-slate-200 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-slate-900" />
            <span className="text-lg font-black tracking-tighter">ConciliAI</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 ConciliAI. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Twitter</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Linkedin</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
