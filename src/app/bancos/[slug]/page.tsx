import { ShieldCheck, ArrowRight, Zap, CheckCircle2, History, Bot, Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const BANK_DATA: Record<string, { name: string; country: string; tips: string[] }> = {
    "bancolombia": { name: "Bancolombia", country: "Colombia", tips: ["Descarga el archivo en formato PDF original", "Asegúrate de que el periodo sea mes completo", "Exporta tu auxiliar contable en CSV"] },
    "bbva": { name: "BBVA", country: "Global", tips: ["Usa el formato de extracto mensual", "Verifica que las tablas no tengan sellos encima", "El motor Llama-3 Vision es ideal para este banco"] },
    "davivienda": { name: "Davivienda", country: "Colombia", tips: ["Formato PDF estándar de DaviPlata o Cuenta", "Ideal para conciliaciones masivas", "La IA detecta automáticamente los GMF"] },
    "santander": { name: "Banco Santander", country: "España/Latam", tips: ["Extrae movimientos globales", "Sube el archivo sin contraseña", "ConciliAI mapea los códigos de operación"] },
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }) {
    const params = await props.params;
    const slug = params.slug;
    const bank = BANK_DATA[slug];
    if (!bank) return { title: "Banco no encontrado" };
    return {
        title: `Conciliar Extracto de ${bank.name} con IA | ConciliAI`,
        description: `Aprende cómo automatizar la conciliación bancaria de ${bank.name} en segundos usando Inteligencia Artificial. Precisión garantizada del 99.9%.`,
    };
}

export default async function BankSEOPage(props: { params: Params }) {
    const params = await props.params;
    const slug = params.slug;
    const bank = BANK_DATA[slug];
    if (!bank) notFound();



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

            <main className="max-w-4xl mx-auto px-6 py-24 space-y-16">
                <header className="space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        <Sparkles className="w-3 h-3" /> Guía de Automatización
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-[0.9] uppercase italic">
                        Cómo conciliar <span className="text-indigo-600">{bank.name}</span> <br /> con Inteligencia Artificial.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl">
                        Ahorra horas de trabajo manual. ConciliAI lee automáticamente los extractos de {bank.name} y los cruza con tu contabilidad en segundos.
                    </p>
                    <div className="pt-6">
                        <Link href="/login" className="group btn bg-slate-900 text-white h-16 px-10 rounded-2xl font-black flex items-center gap-4 w-fit shadow-2xl shadow-indigo-100 mx-auto md:mx-0">
                            PROBAR GRATIS CON {bank.name.toUpperCase()} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-10 rounded-[40px] border border-white space-y-6 shadow-2xl shadow-indigo-50">
                        <h3 className="text-2xl font-black uppercase italic flex items-center gap-3">
                            <Zap className="w-6 h-6 text-indigo-600" /> ¿Por qué usar IA?
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "Elimina el error humano del 100%",
                                "Procesa 1000 líneas en menos de 1 minuto",
                                "Detecta transacciones duplicadas ocultas",
                                "Mapeo inteligente de descripciones crípticas"
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" /> {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[40px] text-white space-y-6 shadow-2xl">
                        <h3 className="text-2xl font-black uppercase italic flex items-center gap-3">
                            <FileText className="w-6 h-6 text-indigo-400" /> Tips para {bank.name}
                        </h3>
                        <div className="space-y-4">
                            {bank.tips.map((tip, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-indigo-600 transition-colors">0{i + 1}</div>
                                    <p className="text-sm font-medium text-slate-300 leading-relaxed">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 border-y border-slate-200 text-center space-y-6">
                    <h2 className="text-3xl font-black uppercase italic">¿Listo para dejar de sufrir con Excel?</h2>
                    <p className="text-slate-500 font-medium">Únete a cientos de contadores que ya automatizaron sus procesos.</p>
                    <Link href="/login" className="flex items-center justify-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-sm hover:underline">
                        Empezar ahora <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>
            </main>

            <footer className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                © 2026 ConciliAI • Expertos en {bank.country}
            </footer>
        </div>
    );
}
