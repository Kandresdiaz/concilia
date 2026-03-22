"use client";
import React, { useState } from "react";
import { Calculator, ArrowRight, Check, Info, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { name: "Stripe", fee: 0.029, fixed: 0.30, description: "Estándar Global" },
  { name: "PayPal", fee: 0.054, fixed: 0.30, description: "Internacional" },
  { name: "Lemon Squeezy", fee: 0.05, fixed: 0.50, description: "Handle Taxes (MoR)" },
  { name: "Bold (Colombia)", fee: 0.0299, fixed: 0, description: "Local Colombia" },
  { name: "Gumroad", fee: 0.10, fixed: 0, description: "Minimalista" }
];

export default function CalculadoraComisiones() {
  const [amount, setAmount] = useState<number>(100);

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 md:px-0">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
            🧮 Herramienta para Dueños de Negocio
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Calculadora de <span className="text-indigo-600">Comisiones</span> de Pago
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            ¿Cuánto dinero te queda realmente después de pasarelas? Compara Stripe, Lemon Squeezy y Bold al instante.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-2xl border border-slate-100 space-y-10">
          <div className="space-y-4">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Monto de la Venta (USD/COP)</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-400 group-focus-within:text-indigo-500 transition-colors">$</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 h-24 rounded-[32px] border-2 border-slate-100 px-12 text-4xl font-black text-slate-900 focus:outline-none focus:border-indigo-500 transition-all pl-14"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLATFORMS.map((plat) => {
              const feeAmount = (amount * plat.fee) + plat.fixed;
              const netAmount = amount - feeAmount;
              return (
                <div key={plat.name} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all space-y-2 group">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{plat.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plat.description}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Te queda (Neto)</p>
                      <p className="text-2xl font-black text-emerald-600">${netAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Comisión</p>
                      <p className="text-sm font-bold text-rose-500">-${feeAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Magnet for ConciliAI */}
        <div className="bg-indigo-600 p-12 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <div className="space-y-4 relative z-10 text-center md:text-left">
                <h3 className="text-3xl font-black">¿Muchos depósitos que conciliar?</h3>
                <p className="text-indigo-100 font-medium text-lg max-w-md">
                    No pierdas tiempo cruzando estas comisiones manualmente. ConciliAI lo hace por ti en segundos usando IA.
                </p>
             </div>
             <Link href="/dashboard" className="px-10 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg hover:bg-indigo-50 transition-all relative z-10 whitespace-nowrap shadow-xl">
                Probar Gratis <ArrowRight className="ml-2 w-5 h-5" />
             </Link>
        </div>

        {/* Comparison Details (SEO Enriched) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 items-start">
            <div className="space-y-6">
                 <h2 className="text-3xl font-black text-slate-900 leading-tight">¿Por qué es difícil conciliar pasarelas de pago?</h2>
                 <p className="text-slate-500 font-medium">
                    Como emprendedor digital, el monto que ves en tu banco (Payout) nunca es el mismo de la venta bruta. 
                    Stripe y Lemon Squeezy descuentan comisiones variables y fijas que hacen que la contabilidad manual sea un infierno.
                 </p>
                 <ul className="space-y-4">
                    {[
                      "Diferencia por tasas de cambio (FX Fees)",
                      "Comisiones fijas por transacción",
                      "Retenciones locales (ej: ReteFuente en Colombia)",
                      "Tiempos de depósito de 2 a 7 días"
                    ].map((li, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 font-bold text-sm bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <Info className="w-5 h-5 text-indigo-500" /> {li}
                      </li>
                    ))}
                 </ul>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
                <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Concilia en 3 Pasos</h3>
                <div className="space-y-8">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shrink-0">1</div>
                        <div>
                           <p className="font-black text-slate-900">Sube tus Ventas</p>
                           <p className="text-slate-500 text-sm italic">CSV de Stripe, PayPal o Shopify.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shrink-0">2</div>
                        <div>
                           <p className="font-black text-slate-900">Sube tu Extracto</p>
                           <p className="text-slate-500 text-sm italic">Tus PDFs bancarios locales.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shrink-0">3</div>
                        <div>
                           <p className="font-black text-slate-900">IA Actúa</p>
                           <p className="text-slate-500 text-sm italic">Auto-conciliación de montos netos y comisiones.</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Technical Validation (Skill Logic) */}
        <div className="flex items-center justify-center py-12 gap-8 grayscale opacity-50 overflow-hidden whitespace-nowrap">
            <ShieldCheck className="w-12 h-12" />
            <span className="text-2xl font-black text-slate-300">SEGURIDAD LOCAL</span>
            <ShieldCheck className="w-12 h-12" />
            <span className="text-2xl font-black text-slate-300">SIN ACCESO BANCARIO</span>
            <ShieldCheck className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
}
