"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { LogIn, Github, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            alert("Error al iniciar sesión con Google: " + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50">
            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl border border-white/20">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl ring-8 ring-slate-50">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenido a ConciliAI</h1>
                    <p className="text-slate-500 font-medium">Automatiza tus conciliaciones en segundos.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 h-14 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                        {loading ? "Cargando..." : "Continuar con Google"}
                    </button>

                    <div className="relative flex items-center justify-center py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">o usa tu cuenta</span>
                    </div>

                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="correo@empresa.com"
                            className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        />
                        <button
                            disabled={true}
                            className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                        >
                            <Mail className="w-5 h-5" /> Enviar Enlace de Acceso
                        </button>
                        <p className="text-[10px] text-center text-slate-400 font-medium mt-4 uppercase tracking-widest italic">Magic Link próximamente</p>
                    </div>
                </div>

                <div className="pt-6 text-center">
                    <p className="text-[11px] text-slate-400 font-medium">
                        Al continuar, aceptas nuestros <span className="underline cursor-pointer">Términos de Servicio</span> y <span className="underline cursor-pointer">Política de Privacidad</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
