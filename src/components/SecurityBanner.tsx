"use client";

import { Shield, Lock, Eye } from "lucide-react";

export function SecurityBanner() {
    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest">
                        Compromiso de Privacidad y Seguridad
                    </h3>
                    <p className="text-sm text-emerald-700 font-medium leading-relaxed">
                        Tus datos financieros están protegidos con encriptación de extremo a extremo. <strong>NUNCA</strong> usamos tus documentos para entrenar nuestra IA, ni compartimos tu información con terceros. Cumplimos con los más altos estándares de privacidad financiera.
                    </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-emerald-200">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Encriptado</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-emerald-200">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Privado</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SecurityBadge() {
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">
                Sin entrenamiento de IA con tus datos
            </span>
        </div>
    );
}
