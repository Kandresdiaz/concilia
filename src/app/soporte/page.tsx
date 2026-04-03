import React from 'react';
import { Send, Users, Linkedin, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SoportePage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200">
                <div className="h-3 bg-indigo-600"></div>
                
                <div className="p-8 md:p-10 space-y-8 text-center">
                    <div className="space-y-2">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Centro de Soporte</h1>
                        <p className="text-sm text-slate-500 font-medium italic">Resolución de dudas en minutos</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Elige tu canal preferido</p>
                        
                        <a 
                            href="https://t.me/c/3814382001/3" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-4 p-4 bg-indigo-600 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group"
                        >
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Soporte Telegram
                        </a>

                        <a 
                            href="https://www.linkedin.com/in/kevin-diaz-192873177" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-4 p-4 bg-slate-900 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl group"
                        >
                            <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform text-indigo-400" />
                            Contacto LinkedIn
                        </a>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-medium mb-6">
                            Estamos disponibles 24/7 para ayudarte con tus conciliaciones y auditorías financieras.
                        </p>
                        <Link 
                            href="/dashboard"
                            className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Volver a ConciliAI
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
