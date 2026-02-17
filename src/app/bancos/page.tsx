import { ShieldCheck, ArrowRight, Zap, CheckCircle2, Building2 } from "lucide-react";
import Link from "next/link";

const BANKS = [
    { id: "bancolombia", name: "Bancolombia", color: "bg-yellow-400" },
    { id: "bbva", name: "BBVA", color: "bg-blue-900 text-white" },
    { id: "davivienda", name: "Davivienda", color: "bg-red-600 text-white" },
    { id: "santander", name: "Santander", color: "bg-red-500 text-white" },
];

export const metadata = {
    title: "Directorio de Bancos Soportados | ConciliAI",
    description: "Encuentra tutorials y herramientas personalizadas para conciliar extractos de los principales bancos de Colombia y el mundo.",
};

export default function BanksDirectoryPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">ConciliAI</span>
                </Link>
                <Link href="/login" className="btn btn-ghost font-black text-xs uppercase tracking-widest">Login</Link>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-20 space-y-16">
                <header className="space-y-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-none uppercase italic">
                        Directorio de <span className="text-indigo-600">Bancos</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                        Selecciona tu banco para ver guías personalizadas sobre cómo automatizar tus conciliaciones bancarias con IA.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BANKS.map((bank) => (
                        <Link
                            key={bank.id}
                            href={`/bancos/${bank.id}`}
                            className="group relative bg-white p-8 rounded-[40px] border border-slate-200 hover:border-indigo-600 transition-all shadow-xl shadow-slate-100 hover:shadow-indigo-100 overflow-hidden"
                        >
                            <div className={`w-12 h-12 ${bank.color} rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic group-hover:text-indigo-600 transition-colors">{bank.name}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2">
                                Ver guía IA <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </p>

                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                <Zap className="w-24 h-24 text-indigo-600" />
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="bg-slate-900 rounded-[50px] p-12 text-center text-white space-y-8 shadow-3xl">
                    <h2 className="text-4xl font-black uppercase italic italic">¿No encuentras tu banco?</h2>
                    <p className="text-slate-400 font-medium max-w-xl mx-auto">
                        Nuestro motor de Inteligencia Artificial es universal. Funciona con cualquier banco del mundo que exporte extractos en PDF, Excel o CSV.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/login" className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl">
                            PROBAR UNIVERSALMENTE
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border-t border-slate-200">
                © 2026 ConciliAI • Expertos en Automatización Financiera
            </footer>
        </div>
    );
}
