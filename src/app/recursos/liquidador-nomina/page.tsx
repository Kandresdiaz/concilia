"use client";
import React, { useState } from "react";
import { Calculator, ArrowRight, Check, ShieldCheck, Briefcase, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LiquidadorNomina() {
  const [salary, setSalary] = useState<number>(1300000); // Salario Mínimo 2024 aprox
  const transportationAllowance = 162000; // Auxilio de transporte 2024 aprox

  // Cálculos Simples (Colombia)
  const healthEmployee = salary * 0.04;
  const pensionEmployee = salary * 0.04;
  const totalDeductions = healthEmployee + pensionEmployee;
  const netPaid = salary + (salary < 2600000 ? transportationAllowance : 0) - totalDeductions;

  // Cerca del costo para el empleador
  const healthEmployer = salary * 0.085;
  const pensionEmployer = salary * 0.12;
  const arl = salary * 0.00522; // Riesgo I
  const totalEmployerCost = salary + (salary < 2600000 ? transportationAllowance : 0) + healthEmployer + pensionEmployer + arl;

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 md:px-0">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
            🇨🇴 Especial para Empresas en Colombia
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Liquidador de <span className="text-emerald-600">Nómina</span> 2026
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Calcula cuánto le cuesta un empleado a tu empresa y cuánto recibe netamente. Simple, rápido y sin registros.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Input & Employee Result */}
            <div className="bg-white p-8 rounded-[48px] shadow-sm border border-slate-100 space-y-8">
                 <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Salario Base Mensual</label>
                    <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">$</span>
                        <input 
                            type="number" 
                            className="w-full bg-slate-50 h-16 rounded-2xl border-2 border-slate-100 pl-12 pr-6 text-2xl font-black text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                            value={salary}
                            onChange={(e) => setSalary(Number(e.target.value))}
                        />
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Lo que recibe el empleado:</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>Sueldo Bruto</span>
                            <span>${salary.toLocaleString()}</span>
                        </div>
                        {salary < 2600000 && (
                            <div className="flex justify-between text-sm font-medium text-emerald-600">
                                <span>Auxilio Transporte</span>
                                <span>+${transportationAllowance.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-medium text-rose-500">
                            <span>Salud & Pensión (8%)</span>
                            <span>-${totalDeductions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-slate-100">
                            <span className="font-black text-slate-900 uppercase text-xs">Pago Neto</span>
                            <span className="text-xl font-black text-emerald-600">${netPaid.toLocaleString()}</span>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Employer Cost Result */}
            <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl text-white space-y-8">
                <div className="space-y-2">
                    <Briefcase className="w-8 h-8 text-emerald-400" />
                    <h3 className="text-xl font-black italic">Costo Total para la Empresa</h3>
                    <p className="text-slate-400 text-sm font-medium">Incluye aportes a seguridad social y parafiscales aproximados.</p>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                            <span>Monto Total Mensual</span>
                            <span className="text-emerald-400">Total</span>
                        </div>
                        <p className="text-4xl font-black text-white">${totalEmployerCost.toLocaleString()}</p>
                    </div>

                    <div className="space-y-3 px-4">
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Pensión Patrono (12%)</span>
                            <span>${pensionEmployer.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Salud Patrono (8.5%)</span>
                            <span>${healthEmployer.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>ARL (Riesgo I)</span>
                            <span>${arl.toLocaleString()}</span>
                         </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Link href="/dashboard" className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl flex items-center justify-center font-black transition-all shadow-lg">
                        Escalar con IA <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-3xl mx-auto space-y-8 pt-12">
            <h2 className="text-3xl font-black text-slate-900 text-center">¿Por qué usar un liquidador de nómina automatizado?</h2>
            <div className="prose prose-slate max-w-none italic text-slate-600">
                <p>
                    En Colombia, el cálculo de nómina es complejo debido a los constantes cambios anuales en el Salario Mínimo y Auxilio de Transporte. 
                    Tener una herramienta clara no solo ayuda a tus empleados a saber cuánto van a recibir, sino que te permite como dueño de empresa planificar tu flujo de caja real.
                </p>
                <p>
                    <strong>Dato Clave:</strong> Un empleado le cuesta a la empresa aproximadamente un **40% a 54% más** de su salario neto mensual una vez sumas prestaciones sociales (Prima, Cesantías), seguridad social y vacaciones.
                </p>
            </div>
            
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                 <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                    <FileText className="w-8 h-8" />
                 </div>
                 <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Conciliación de Nómina con IA</h3>
                    <p className="text-slate-500 font-medium">¿Tienes cientos de pagos de nómina en tu extracto y en tu contabilidad? Deja que ConciliAI los cruce automáticamente por ti.</p>
                    <Link href="/dashboard" className="text-indigo-600 font-black text-sm flex items-center justify-center md:justify-start gap-1 hover:gap-2 transition-all">
                        Ver cómo funciona <ArrowRight className="w-4 h-4" />
                    </Link>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
