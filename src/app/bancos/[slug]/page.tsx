import Link from "next/link";
import { ShieldCheck, Bot, ArrowRight, Zap, CheckCircle } from "lucide-react";

export default function BankSEOPage({ params }: { params: { slug: string } }) {
    const bankName = params.slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-black tracking-tighter">ConciliAI</span>
                    </Link>
                </div>
            </nav>

            <main className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="space-y-6 text-center">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-slate-900 italic uppercase">
                            Conciliación Bancaria para <span className="text-indigo-600">{bankName}</span> con IA.
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                            Deja de copiar y pegar movimientos de {bankName}. ConciliAI usa visión artificial para auditar tus extractos en segundos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card p-10 rounded-[40px] bg-slate-900 text-white space-y-6 shadow-2xl">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic">¿Cómo funciona para {bankName}?</h2>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                                    <span>Sube tu archivo PDF de {bankName} (sin importar el formato).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                                    <span>Nuestra IA Llama 3.2 90B extrae cada transacción con precisión.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                                    <span>Cruce automático con tu auxiliar contable en 2 minutos.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-8 py-4">
                            <div className="space-y-4">
                                <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-indigo-600">El problema</h3>
                                <p className="text-slate-500 font-medium italic">
                                    "Tradicionalmente, conciliar {bankName} requiere descargar el Excel (si el banco deja), limpiar datos y buscar diferencias a mano... un proceso que puede tomar horas por cada cuenta."
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-indigo-600">La solución IA</h3>
                                <p className="text-slate-500 font-medium">
                                    Con ConciliAI, procesamos la imagen o el PDF directamente. No necesitas formatos especiales de {bankName}. Exportamos el acta lista para auditoría.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="group w-full py-5 bg-slate-900 text-white text-lg font-black rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-xl"
                            >
                                Probar ahora gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
