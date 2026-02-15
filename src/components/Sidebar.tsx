"use client";

import {
    LayoutDashboard,
    ArrowLeftRight,
    FileCheck,
    History,
    Users,
    Send,
    LogOut,
    Lock,
    Zap,
    Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
    usageCount: number;
    limit: number; // Dynamic limit
    tier: "FREE" | "PRO";
    email: string;
    role?: string;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onUpgrade: () => void;
}

export function Sidebar({ currentView, onViewChange, usageCount, limit, tier, email, role, isOpen, onClose, onLogout, onUpgrade }: SidebarProps) {
    const isFree = tier === "FREE";

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "partidas", label: "Transacciones", icon: ArrowLeftRight },
        { id: "acta", label: "Auditoría Final", icon: FileCheck },
        { id: "historial", label: "Historial", icon: History, locked: isFree },
    ];

    const isAdmin = role === "admin";

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:flex shadow-sm",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Brand Header */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">ConciliAI</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Professional</span>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Gestión</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => !item.locked && onViewChange(item.id)}
                            disabled={item.locked}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group relative",
                                currentView === item.id
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                item.locked && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            <div className="flex items-center gap-3 font-semibold text-[13px]">
                                <item.icon className={cn(
                                    "w-4 h-4 transition-colors",
                                    currentView === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                {item.label}
                            </div>
                            {item.locked ? (
                                <Lock className="w-3 h-3 text-slate-300" />
                            ) : (
                                currentView === item.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                            )}
                        </button>
                    ))}

                    {isAdmin && (
                        <Link
                            href="/admin"
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-[13px] bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 mt-4"
                            )}
                        >
                            <Shield className="w-4 h-4 text-indigo-400" />
                            Panel Admin
                        </Link>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Ayuda</p>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-[13px] font-semibold">
                        <Users className="w-4 h-4" />
                        Comunidad
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-[13px] font-semibold">
                        <Send className="w-4 h-4" />
                        Soporte Directo
                    </button>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
                            isFree ? "bg-slate-100 text-slate-500" : "bg-indigo-100 text-indigo-700"
                        )}>
                            {tier} Plan
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{usageCount}/{limit}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-900 truncate mb-1">{email || "usuario@correo.com"}</p>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (usageCount / Math.max(1, limit)) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {isFree && (
                    <button
                        onClick={onUpgrade}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                    >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Actualizar a PRO
                    </button>
                )}

                <button
                    onClick={onLogout}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
