import React from "react";
import { CheckCircle, ArrowRight, Download, CreditCard, Zap, ShieldCheck, Landmark } from "lucide-react";
import Link from "next/link";

export default function ConciliacionBancolombiaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200 animate-pulse">
            🏦 Especial para Bancolombia (Persona Jurídica y Natural)
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
            Conciliación Bancaria de <span className="text-indigo-600">Bancolombia</span> con IA.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            ¿Tienes extractos de Bancolombia de 50+ páginas? Nuestra IA los limpia y concilia en 15 segundos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/dashboard" 
              className="btn btn-primary h-16 px-10 rounded-2xl text-lg font-black shadow-xl shadow-indigo-200"
            >
              Empezar Ahora (Gratis) <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Formatos Oficiales</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Soportamos los PDFs de Bancolombia Persona Jurídica (SVP) y Sucursal Virtual Personas.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Limpieza de Extracto</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Elimina automáticamente los encabezados, logos y celdas vacías del extracto bancario en segundos.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">100% Local</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Tus extractos bancarios de Bancolombia no salen de tu navegador. Seguridad total de datos financieros.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section (SEO Enriched) */}
      <section className="py-24 max-w-5xl mx-auto px-6 bg-white rounded-[48px] shadow-sm mb-24 border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-16 italic">ConciliAI vs Excel (Capa Bancolombia)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="p-6">Feature de Bancolombia</th>
                <th className="p-6">Excel Manual</th>
                <th className="p-6 text-indigo-600">ConciliAI IA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
              <tr>
                <td className="p-6 font-bold text-slate-900">Manejo de GMF (4x1000)</td>
                <td className="p-6 text-slate-500 text-sm italic">Manual por fila</td>
                <td className="p-6 text-emerald-600 font-bold text-sm">Categorización Auto (AI)</td>
              </tr>
              <tr>
                <td className="p-6 font-bold text-slate-900">Extractos Largos (50+ págs)</td>
                <td className="p-6 text-slate-500 text-sm italic">Lento y propenso a errores</td>
                <td className="p-6 text-emerald-600 font-bold text-sm">Procesado en Segundos</td>
              </tr>
              <tr>
                <td className="p-6 font-bold text-slate-900">Formatos SVP</td>
                <td className="p-6 text-slate-500 text-sm italic">Complejo de copiar/pegar</td>
                <td className="p-6 text-emerald-600 font-bold text-sm">Limpieza nativa con IA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Guide Content (SEO) */}
      <section className="bg-slate-100 py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-black text-slate-900 italic">¿Cómo descargar y conciliar tu extracto de Bancolombia?</h2>
          <div className="prose prose-slate max-w-none">
            <p className="font-medium text-slate-600 italic">
                Sigue estos pasos para automatizar tu contabilidad bancaria con ConciliAI:
            </p>
            <ol className="italic text-slate-700">
              <li>Ingresa a la **Sucursal Virtual Bancolombia**.</li>
              <li>Busca la sección de **Extractos** y descarga el PDF (formato original).</li>
              <li>Sube el PDF a **ConciliAI**.</li>
              <li>Sube tu archivo de ventas o asientos contables.</li>
              <li>Deja que la IA cruce los montos y exporta directamente a tu software.</li>
            </ol>
          </div>
          
          <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-black italic">Optimiza tu Bancolombia hoy</h3>
              <p className="text-slate-400 font-medium italic">Deja de perder tiempo en hojas de cálculo y enfócate en crecer tu tienda.</p>
              <Link href="/dashboard" className="btn bg-white text-slate-900 border-none hover:bg-slate-100 rounded-xl px-10 h-14 font-black italic">
                Probar Gratis <Landmark className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
