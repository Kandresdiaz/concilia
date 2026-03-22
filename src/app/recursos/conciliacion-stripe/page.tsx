import React from "react";
import { CheckCircle, ArrowRight, Download, CreditCard, Zap, ShieldCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function ConciliacionStripePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200 animate-pulse">
            🛍️ Especial para Dueños de Shopify y Stripe
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
            Concilia tus Payouts de <span className="text-indigo-600">Stripe</span> sin dolor.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            ¿Vendes en Shopify? ConciliAI cruza tus transferencias de Stripe con tu cuenta bancaria automáticamente usando IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/dashboard" 
              className="btn btn-primary h-16 px-10 rounded-2xl text-lg font-black shadow-xl shadow-indigo-200"
            >
              Empezar Ahora <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">E-commerce Ready</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Ideal para usuarios de Shopify, Lemon Squeezy y Gumroad. Identifica cada depósito en tu banco al instante.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Cruce de Payouts</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Nuestra IA entiende que un "Payout de Stripe" en el banco corresponde a múltiples ventas en tu tienda.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Seguridad Total</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              No necesitamos acceso a tu cuenta bancaria. Solo subes los PDFs y ConciliAI hace el resto localmente.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Content (SEO) */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-black text-slate-900">¿Cómo reconciliar ventas de Stripe con tu banco?</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Como dueño de un negocio e-commerce, sabes que los depósitos que llegan a tu banco (Payouts) no coinciden 1 a 1 con tus ventas diarias debido a las comisiones y los tiempos de transferencia de Stripe.
            </p>
            <h3>El problema del "Net Amount":</h3>
            <p>
              Stripe te envía el dinero neto de comisiones. ConciliAI usa IA para desglosar esos montos y verificar que cada centavo que salió de Stripe llegó correctamente a tu cuenta bancaria local.
            </p>
            <ol>
              <li>Sube tu <strong>Export de Stripe</strong> (CSV).</li>
              <li>Sube tu <strong>Extracto Bancario</strong> (PDF).</li>
              <li>ConciliAI cruza las fechas y montos "Netos" automáticamente.</li>
            </ol>
          </div>
          
          <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold">Optimiza tu contabilidad hoy</h3>
              <p className="text-slate-400">Deja de perder tiempo en hojas de cálculo y enfócate en crecer tu tienda.</p>
              <Link href="/dashboard" className="btn bg-white text-slate-900 border-none hover:bg-slate-100 rounded-xl px-8">
                Probar Gratis
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
