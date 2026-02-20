import { Landmark, ArrowRight, Zap, CheckCircle2, Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const BANK_DATA: Record<string, { name: string; country: string; tips: string[] }> = {
    "bancolombia": { name: "Bancolombia", country: "Colombia", tips: ["Descarga el archivo en formato PDF original", "Asegúrate de que el periodo sea mes completo", "Exporta tu auxiliar contable en CSV"] },
    "bbva": { name: "BBVA", country: "Global", tips: ["Usa el formato de extracto mensual", "Verifica que las tablas no tengan sellos encima", "El motor Llama-3 Vision es ideal para este banco"] },
    "davivienda": { name: "Davivienda", country: "Colombia", tips: ["Formato PDF estándar de DaviPlata o Cuenta", "Ideal para conciliaciones masivas", "La IA detecta automáticamente los GMF"] },
    "santander": { name: "Banco Santander", country: "España/Latam", tips: ["Extrae movimientos globales", "Sube el archivo sin contraseña", "ConciliAI mapea los códigos de operación"] },
    "banco-de-bogota": { name: "Banco de Bogotá", country: "Colombia", tips: ["Descarga el PDF desde el Portal Empresarial", "Incluye las páginas de talles de movimientos", "Funciona perfecto con el formato multibanco"] },
    "itau": { name: "Itaú", country: "Latam", tips: ["Exporta tus auxiliares en formato Excel o CSV", "La IA reconoce las transferencias PIX y TEF", "Ideal para movimientos de alta frecuencia"] },
    "scotiabank": { name: "Scotiabank Colpatria", country: "Canadá/Latam", tips: ["Funciona con extractos de tarjetas y cuentas", "Sube el archivo convertido a PDF si es imagen", "Precisión total en cargos por manejo"] },
    "nu-mexico": { name: "Nu México", country: "México", tips: ["Descarga tu estado de cuenta desde la App", "Envía el PDF directo a ConciliAI", "Reconocimiento instantáneo de rendimientos"] },
    "banco-estado": { name: "Banco Estado", country: "Chile", tips: ["Extractos de cuenta RUT y corriente", "Compatible con archivos PDF de cartola", "Soporta formatos de exportación masiva"] },
    "bcp-peru": { name: "BCP Perú", country: "Perú", tips: ["Estados de cuenta en Soles y Dólares", "Detecta impuestos ITF automáticamente", "Ideal para empresas con alto flujo de caja"] },
};

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props;
    const { slug } = await params.params;
    const bank = BANK_DATA[slug];

    if (!bank) return { title: "Banco no encontrado" };

    return {
        title: `Conciliar Extracto de ${bank.name} con IA | ConciliAI`,
        description: `Aprende cómo automatizar la conciliación bancaria de ${bank.name} en segundos usando Inteligencia Artificial. Precisión garantizada del 99.9%.`,
    };
}

export default async function BankSEOPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props;
    const { slug } = await params.params;
    const bank = BANK_DATA[slug];

    if (!bank) notFound();

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

            <main className="max-w-4xl mx-auto px-6 py-40 space-y-16">
                <header className="space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-violet-100">
                        <Sparkles className="w-3 h-3" /> Guía de Automatización
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.9] uppercase italic">
                        Cómo conciliar <span className="text-gradient">{bank.name}</span> <br /> con Inteligencia Artificial.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl italic leading-relaxed">
                        Ahorra horas de trabajo manual. ConciliAI lee automáticamente los extractos de {bank.name} y los cruza con tu contabilidad en segundos.
                    </p>
                    <div className="pt-6">
                        <Link href="/login" className="group px-12 py-7 bg-violet-600 text-white text-2xl font-black rounded-[30px] hover:bg-violet-500 transition-all shadow-purple flex items-center gap-4 w-fit uppercase italic hover:scale-[1.02] active:scale-95">
                            PROBAR CON {bank.name.toUpperCase()} <Zap className="w-7 h-7 fill-white" />
                        </Link>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-10 rounded-[40px] border border-white space-y-6 shadow-3xl shadow-violet-100/30">
                        <h3 className="text-2xl font-black uppercase italic flex items-center gap-3">
                            <Zap className="w-6 h-6 text-violet-600" /> ¿Por qué usar IA?
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "Elimina el error humano del 100%",
                                "Procesa 1000 líneas en menos de 1 minuto",
                                "Detecta transacciones duplicadas ocultas",
                                "Mapeo inteligente de descripciones crípticas"
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-violet-600 mt-0.5" /> {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-violet-900 p-10 rounded-[40px] text-white space-y-6 shadow-3xl shadow-violet-200/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-600/20 blur-[60px]"></div>
                        <h3 className="text-2xl font-black uppercase italic flex items-center gap-3 relative">
                            <FileText className="w-6 h-6 text-violet-400" /> Tips para {bank.name}
                        </h3>
                        <div className="space-y-4 relative">
                            {bank.tips.map((tip, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-violet-600 transition-colors">0{i + 1}</div>
                                    <p className="text-sm font-medium text-violet-100 leading-relaxed italic">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white p-12 md:p-20 rounded-[60px] border border-violet-100 shadow-3xl shadow-violet-100/30 text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic">¿Listo para dejar de sufrir con Excel?</h2>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic">
                        Únete a cientos de contadores que ya automatizaron sus procesos con ConciliAI.
                    </p>
                    <Link href="/login" className="inline-flex items-center gap-4 text-violet-600 font-black uppercase tracking-widest hover:gap-6 transition-all group italic">
                        EMPEZAR MI AUDITORÍA AHORA <ArrowRight className="w-5 h-5" />
                    </Link>
                </section>
            </main>

            <footer className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] border-t border-slate-100">
                © 2026 ConciliAI • Expertos en {bank.country}
            </footer>
        </div>
    );
}
