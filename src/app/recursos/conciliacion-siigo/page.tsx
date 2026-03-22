import React from "react";
import { CheckCircle, ArrowRight, Download, Calculator, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ConciliacionSiigoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100 animate-bounce">
            🇨🇴 Especial para Contadores en Colombia
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
            Conciliación Bancaria para <span className="text-indigo-600">Siigo</span> en segundos.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Deja de cruzar extractos manualmente. Usa nuestra IA para convertir tus PDFs bancarios al formato exacto que pide Siigo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/dashboard" 
              className="btn btn-primary h-16 px-10 rounded-2xl text-lg font-black shadow-xl shadow-indigo-200"
            >
              Empezar Gratis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Velocidad Extrema</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Lo que te toma 4 horas en Excel, ConciliAI lo hace en 30 segundos. Sube tu PDF y descarga el CSV para Siigo.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">100% Precisión</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Nuestro motor de IA especializado en bancos de Colombia (Bancolombia, Davivienda, etc.) limpia las descripciones por ti.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-white">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Formato Siigo Listo</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Generamos el archivo con las columnas exactas: Cuenta, Nit, Detalle, Débito y Crédito. Solo dale a "Importar".
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section (SEO Enriched) */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-16">ConciliAI vs Excel Tradicional</h2>
        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="w-full text-left bg-white">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-400">
                <th className="p-6">Característica</th>
                <th className="p-6">Excel (Manual)</th>
                <th className="p-6 text-indigo-600">ConciliAI (AI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
              <tr>
                <td className="p-6 font-bold text-slate-900">Tiempo por extracto</td>
                <td className="p-6 text-slate-500">2 a 4 horas</td>
                <td className="p-6 text-emerald-600 font-bold">15 segundos</td>
              </tr>
              <tr>
                <td className="p-6 font-bold text-slate-900">Limpieza de datos</td>
                <td className="p-6 text-slate-500">Manual (Buscar/Reemplazar)</td>
                <td className="p-6 text-emerald-600 font-bold">Automática con LLaMA 3.3</td>
              </tr>
              <tr>
                <td className="p-6 font-bold text-slate-900">Riesgo de error</td>
                <td className="p-6 text-slate-500">Alto (Sujeto a fatiga)</td>
                <td className="p-6 text-emerald-600 font-bold">Cero (Validación Matemática)</td>
              </tr>
              <tr>
                <td className="p-6 font-bold text-slate-900">Formato Siigo</td>
                <td className="p-6 text-slate-500">Varios pasos de exportación</td>
                <td className="p-6 text-emerald-600 font-bold">Descarga Directa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Guide Content (SEO) */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-black text-slate-900">¿Cómo importar conciliaciones en Siigo Nube?</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              La conciliación bancaria es uno de los procesos más tediosos para los contadores en Colombia. 
              Si usas <strong>Siigo Nube</strong>, sabes que necesitas un archivo CSV con una estructura específica para evitar errores de carga.
            </p>
            <h3>Pasos para automatizar con ConciliAI:</h3>
            <ol>
              <li><strong>Sube tu Extracto:</strong> Arrastra el PDF de Bancolombia, Bogotá o cualquier banco.</li>
              <li><strong>Sube tu Auxiliar:</strong> Exporta el movimiento de la cuenta 1110 desde Siigo y súbelo.</li>
              <li><strong>Cruza con IA:</strong> Nuestra IA encontrará los "matches" automáticamente.</li>
              <li><strong>Exporta para Siigo:</strong> Elige la opción 🇨🇴 Siigo y descarga el archivo listo.</li>
            </ol>
          </div>
          
          <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold">¿Listo para ahorrar 20 horas al mes?</h3>
              <p className="text-slate-400">Únete a más de 500 contadores que ya automatizan sus procesos con ConciliAI.</p>
              <Link href="/dashboard" className="btn bg-white text-slate-900 border-none hover:bg-slate-100 rounded-xl px-8">
                Probar Ahora Gratis
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>
        </div>
      </section>

      {/* Footer SEO Tags */}
      <footer className="py-12 border-t border-slate-200 bg-slate-50 overflow-hidden">
         <div className="max-w-5xl mx-auto px-6 flex flex-wrap gap-4 justify-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Siigo Nube</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Conciliación Bancaria AI</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Contadores Colombia</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Bancolombia a Siigo</span>
         </div>
      </footer>
    </div>
  );
}
