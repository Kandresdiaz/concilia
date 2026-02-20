import { Landmark, ArrowRight, Zap, CheckCircle2, Building2 } from "lucide-react";
import Link from "next/link";

const BANKS = [
    { id: "bancolombia", name: "Bancolombia", color: "bg-[#FFD200]", text: "text-black" },
    { id: "davivienda", name: "Davivienda", color: "bg-[#ED1C24]", text: "text-white" },
    { id: "banco-de-bogota", name: "Banco de Bogotá", color: "bg-[#003da5]", text: "text-white" },
    { id: "bbva", name: "BBVA", color: "bg-[#004481]", text: "text-white" },
    { id: "santander", name: "Santander", color: "bg-[#ec0000]", text: "text-white" },
    { id: "itau", name: "Itaú", color: "bg-[#ec7000]", text: "text-white" },
    { id: "scotiabank", name: "Scotiabank", color: "bg-[#ed0722]", text: "text-white" },
    { id: "nu-mexico", name: "Nu México / Col", color: "bg-[#8a05be]", text: "text-white" },
    { id: "banco-estado", name: "Banco Estado", color: "bg-[#004a99]", text: "text-white" },
    { id: "bcp-peru", name: "BCP Perú", color: "bg-[#fbba00]", text: "text-black" },
];

export default function BanksDirectoryPage() {
    return (
        <div className="min-h-screen bg-mesh text-slate-900 selection:bg-violet-100 italic">
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-violet-100 uppercase tracking-widest font-black">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-purple">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase">Concili<span className="text-violet-600">AI</span></span>
                    </Link>
                    <Link href="/login" className="text-[10px] text-slate-400 hover:text-violet-600 transition-colors">Conectar</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-40 space-y-16">
                <header className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-violet-100">
                        UNIVERSAL ENGINE
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-none uppercase italic">
                        Directorio de <span className="text-gradient">Bancos</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic">
                        Selecciona tu banco para ver guías personalizadas sobre cómo automatizar tus conciliaciones bancarias con IA.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BANKS.map((bank) => (
                        <Link
                            key={bank.id}
                            href={`/bancos/${bank.id}`}
                            className="group relative bg-white p-8 rounded-[40px] border border-slate-100 hover:border-violet-600 transition-all shadow-xl shadow-violet-100/30 overflow-hidden"
                        >
                            <div className={`w-12 h-12 ${bank.color} ${bank.text} rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic group-hover:text-violet-600 transition-colors">{bank.name}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2 uppercase tracking-widest">
                                Ver guía IA <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </p>

                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                <Zap className="w-24 h-24 text-violet-600" />
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="bg-violet-900 rounded-[60px] p-12 md:p-20 text-center text-white space-y-8 shadow-3xl shadow-violet-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-600/20 blur-[100px]"></div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic relative">¿No encuentras tu banco?</h2>
                    <p className="text-violet-200 font-medium max-w-xl mx-auto italic relative">
                        Nuestro motor de Inteligencia Artificial es universal. Funciona con cualquier banco del mundo que exporte extractos en PDF, Excel o CSV.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 relative pt-4">
                        <Link href="/login" className="px-12 py-6 bg-violet-600 text-white font-black rounded-3xl hover:bg-violet-500 transition-all shadow-purple text-xl uppercase italic">
                            PROBAR UNIVERSALMENTE
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center space-y-6 border-t border-slate-100">
                <div className="flex justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <a href="https://t.me/c/3814382001/3" target="_blank" className="hover:text-violet-600 transition-colors">Soporte Telegram</a>
                    <a href="https://www.linkedin.com/in/kevin-diaz-192873177" target="_blank" className="hover:text-violet-600 transition-colors">LinkedIn</a>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
                    © 2026 ConciliAI • Expertos en Automatización Financiera
                </p>
            </footer>
        </div>
    );
}
