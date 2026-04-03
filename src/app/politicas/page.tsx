import React from 'react';
import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PoliticasPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-200">
                <div className="h-2 bg-indigo-600"></div>
                
                <div className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Políticas de Privacidad y Términos</h1>
                    </div>

                    <div className="space-y-12 text-slate-600 leading-relaxed">
                        {/* Summary for Merchants */}
                        <section className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                            <h2 className="text-indigo-900 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <Lock className="w-4 h-4" /> Compromiso ConciliAI
                            </h2>
                            <p className="text-sm">
                                Su privacidad es nuestra prioridad. ConciliAI no almacena datos bancarios de forma permanente, no entrena modelos de IA con sus datos financieros y solo procesa la información necesaria para realizar la conciliación solicitada.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" /> 1. Recopilación de Datos
                            </h2>
                            <p className="text-sm">
                                Recopilamos información de su tienda de Shopify (órdenes) y de los extractos bancarios que usted carga voluntariamente. Esta información se utiliza exclusivamente para el proceso de conciliación bancaria.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" /> 2. Uso de la Información
                            </h2>
                            <p className="text-sm">
                                Los datos se procesan a través de proveedores de infraestructura seguros (Supabase y Groq) mediante túneles encriptados. No vendemos ni compartimos su información con terceros para fines publicitarios.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-indigo-600" /> 3. Seguridad
                            </h2>
                            <p className="text-sm">
                                Implementamos medidas de seguridad de grado industrial, incluyendo cifrado SSL/TLS para todas las transferencias de datos y almacenamiento seguro en servidores con certificación SOC2.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-indigo-600" /> 4. Soporte y Contacto
                            </h2>
                            <p className="text-sm">
                                Para cualquier duda sobre el tratamiento de sus datos, puede contactarnos directamente a través de nuestro soporte prioritario en Telegram o LinkedIn.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Última actualización: Abril 2026</p>
                            <Link 
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                            >
                                <ArrowLeft className="w-4 h-4" /> Volver al App
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
