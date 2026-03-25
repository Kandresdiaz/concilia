"use client";

import React, { useState } from "react";
import { Calculator, Briefcase, Database, ArrowRight, Zap, Check, LayoutDashboard, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function PayrollBonus() {
  const [salary, setSalary] = useState<number>(1300000);
  const trans = 162000;
  const health = salary * 0.04;
  const pension = salary * 0.04;
  const net = salary + (salary < 2600000 ? trans : 0) - (health + pension);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Liquidador de Nómina IA</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bono Pro Incluido</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Salario Base (COP)</label>
              <input 
                type="number" 
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full h-16 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 px-6 text-2xl font-black outline-none transition-all"
              />
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Deducciones (8%)</span>
                <span>- ${(health + pension).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-200">
                <span className="font-black text-slate-900 uppercase text-xs">Pago Neto Estimado</span>
                <span className="text-xl font-black text-emerald-600">$ {net.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[32px] p-8 text-white flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24 text-emerald-400" />
            </div>
            <div className="relative z-10 space-y-4">
               <h3 className="text-lg font-black leading-tight">Optimiza tu Nómina con IA</h3>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">
                 ConciliAI puede cruzar automáticamente los pagos de seguridad social con tu extracto bancario para detectar errores de centavos.
               </p>
            </div>
            <button className="relative z-10 mt-8 w-full py-4 bg-emerald-500 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all">
              Habilitar Auditoría de Nómina
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResourceTool({ type }: { type: string }) {
  const titles: Record<string, string> = {
    "RESOURCE_COMISIONES": "Calculadora de Comisiones",
    "RESOURCE_BANCOLOMBIA": "Conciliador Bancolombia",
    "RESOURCE_SIIGO": "Conciliador Siigo",
    "RESOURCE_QUICKBOOKS": "Conciliador QuickBooks",
    "RESOURCE_EXCEL": "Plantilla Excel Maestro",
    "RESOURCE_PAYOUTS": "Payouts Stripe/Shopify",
    "RESOURCE_ASIENTOS": "Generador de Asientos Contables"
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-8 max-w-3xl mx-auto">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Calculator className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{titles[type] || "Herramienta Contable"}</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Esta herramienta está siendo integrada directamente en tu Dashboard para que no tengas que salir de Shopify.
          </p>
        </div>
        <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interfaz en Proceso de Migración</p>
          <div className="mt-4 flex flex-col gap-2">
            <button className="btn btn-primary rounded-xl font-black">Abrir Versión Anterior</button>
            <p className="text-[10px] text-slate-400 italic">Pronto: Acceso nativo 1-Click</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InventoryBonus() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-8 max-w-3xl mx-auto">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Database className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Auditor de Inventario IA</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Cruza tus ventas de Shopify con tus existencias en bodega automáticamente para detectar "fugas" de mercancía.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Paso 1</h4>
            <div className="flex items-center justify-center gap-2 text-slate-900 font-bold">
              <ShoppingBag className="w-4 h-4" /> Ventas Shopify
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Paso 2</h4>
            <div className="flex items-center justify-center gap-2 text-slate-900 font-bold">
              <Database className="w-4 h-4" /> Stock Real
            </div>
          </div>
        </div>
        <button className="btn btn-primary h-14 px-12 rounded-2xl font-black uppercase tracking-widest text-xs">
          Empezar Auditoría de Stock
        </button>
        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest animate-pulse">
          Próximamente: Integración con ERPs
        </p>
      </div>
    </div>
  );
}
