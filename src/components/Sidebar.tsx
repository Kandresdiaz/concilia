"use client";

import {
    LayoutDashboard,
    ArrowLeftRight,
    FileCheck,
    History,
    Users,
    Send,
    LogOut,
    Trash2,
    Lock,
    Zap,
    Shield,
    FileSpreadsheet,
    Calculator,
    CreditCard,
    Landmark,
    Briefcase,
    ShieldCheck,
    CheckCircle,
    Database,
    Plus
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useShopify } from "@/providers/ShopifyProvider";

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
    usageCount: number;
    limit: number; // Dynamic limit
    tier: string;
    email: string;
    role?: string;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    onUpgrade: (tier?: string) => void;
    onDeleteAccount: () => void;
}

export function Sidebar({ currentView, onViewChange, usageCount, limit, tier, email, role, isOpen, onClose, onLogout, onUpgrade, onDeleteAccount }: SidebarProps) {
    const isAdmin = role === "admin" || role === "superadmin";
    const isFree = tier === "FREE";
    const pathname = usePathname();
    const { isShopify } = useShopify();

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "partidas", label: "Transacciones", icon: ArrowLeftRight },
        { id: "acta", label: "Auditoría Final", icon: FileCheck },
        { id: "historial", label: "Historial", icon: History, locked: isFree && !isAdmin },
    ];

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:flex shadow-sm",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Brand Header */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">ConciliAI</span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
                            {tier === 'ENTERPRISE' ? 'DESPACHO' : tier === 'LIFETIME' ? 'VITALICIO' : tier === 'PRO' ? 'PROFESSIONAL' : 'GRATIS'}
                        </span>
                    </div>
                </div>

                {isFree && (
                    <button
                        onClick={() => isShopify ? onUpgrade("shopify") : onUpgrade("modal")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group/upgrade relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-pulse"></div>
                        <Zap className="w-4 h-4 fill-current animate-pulse group-hover/upgrade:scale-110 transition-transform" />
                        {isShopify ? "Mejorar Plan Shopify" : "Actualizar a PRO"}
                    </button>
                )}
            </div>

            {/* --- Alex Hormozi Style Offer --- */}
            <div className="mx-4 mt-6 mb-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Oferta Irresistible</p>
              <h3 className="text-xs font-bold text-slate-900 leading-tight mb-2">
                3 Cuadres <span className="text-indigo-600 underline">Gratis</span>.
                Ahorra 10h hoy.
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Sin tarjetas. Sin rollos. Precisión total garantizada.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "33%" }}></div>
                </div>
                <span className="text-[9px] font-bold text-slate-400">Trial Activo</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
              {/* --- Premium Bonuses Section --- */}
              <div className="mb-6">
                <p className="px-4 text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  Bonos Premium Incluidos
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => onViewChange("PAYROLL")}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group relative",
                      currentView === "PAYROLL" ? "bg-indigo-600 text-white shadow-md scale-[1.02]" : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                    )}
                  >
                    <div className={cn(
                        "p-1.5 rounded-md transition-colors",
                        currentView === "PAYROLL" ? "bg-white/20" : "bg-slate-100 group-hover:bg-indigo-100"
                    )}>
                        <Database className="w-4 h-4" />
                    </div>
                    <span>Nómina IA</span>
                    <span className="ml-auto text-[8px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">Bono 1</span>
                  </button>
                  <button
                    onClick={() => onViewChange("INVENTORY")}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group relative",
                      currentView === "INVENTORY" ? "bg-indigo-600 text-white shadow-md scale-[1.02]" : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                    )}
                  >
                    <div className={cn(
                        "p-1.5 rounded-md transition-colors",
                        currentView === "INVENTORY" ? "bg-white/20" : "bg-slate-100 group-hover:bg-indigo-100"
                    )}>
                        <Plus className="w-4 h-4" />
                    </div>
                    <span>Inventario IA</span>
                    <span className="ml-auto text-[8px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">Bono 2</span>
                  </button>
                </div>
              </div>

            {/* Main Navigation */}
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Gestión</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => !item.locked && onViewChange(item.id)}
                            disabled={item.locked}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative",
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
                        <>
                            {pathname === "/admin" ? (
                                <Link
                                    href="/dashboard"
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-[13px] bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 mt-4"
                                    )}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Volver a la App
                                </Link>
                            ) : (
                                <Link
                                    href="/admin"
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-[13px] bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 mt-4"
                                    )}
                                >
                                    <Shield className="w-4 h-4 text-indigo-400" />
                                    Panel Admin
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Recursos Gratis</p>
                    <button
                        onClick={() => onViewChange("RESOURCE_NOMINA")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-semibold",
                          currentView === "RESOURCE_NOMINA" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Briefcase className="w-4 h-4 text-slate-900" />
                        🇨🇴 Nómina (Colombia)
                    </button>
                    <button
                        onClick={() => onViewChange("RESOURCE_COMISIONES")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-semibold",
                          currentView === "RESOURCE_COMISIONES" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Calculator className="w-4 h-4 text-slate-900" />
                        🧮 Calculadora de Comisiones
                    </button>
                    <button
                        onClick={() => onViewChange("RESOURCE_BANCOLOMBIA")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-semibold",
                          currentView === "RESOURCE_BANCOLOMBIA" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Landmark className="w-4 h-4 text-slate-900" />
                        🏦 Conciliador Bancolombia
                    </button>
                    <button
                        onClick={() => onViewChange("RESOURCE_SIIGO")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-semibold",
                          currentView === "RESOURCE_SIIGO" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Shield className="w-4 h-4 text-indigo-500" />
                        🇨🇴 Conciliador Siigo
                    </button>
                    <button
                        onClick={() => onViewChange("RESOURCE_QUICKBOOKS")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-semibold",
                          currentView === "RESOURCE_QUICKBOOKS" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Shield className="w-4 h-4 text-emerald-500" />
                        🌎 Conciliador QuickBooks
                    </button>
                    <button
                        onClick={() => onViewChange("RESOURCE_EXCEL")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-semibold",
                          currentView === "RESOURCE_EXCEL" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                        Plantilla Excel
                    </button>
                    <button
                        onClick={() => onViewChange("RESOURCE_PAYOUTS")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-semibold",
                          currentView === "RESOURCE_PAYOUTS" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <CreditCard className="w-4 h-4 text-slate-900" />
                        💳 Payouts Stripe/Shopify
                    </button>
                    <button
                        onClick={() => onViewChange("RESOURCE_ASIENTOS")}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-semibold",
                          currentView === "RESOURCE_ASIENTOS" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Calculator className="w-4 h-4 text-indigo-500" />
                        Generador de Asientos
                    </button>
                </div>

                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Ayuda y Comunidad</p>
                    <a
                        href="https://www.linkedin.com/in/kevin-diaz-192873177"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-[13px] font-semibold"
                    >
                        <Users className="w-4 h-4 text-slate-400" />
                        Comunidad LinkedIn
                    </a>
                    <button
                        onClick={() => {
                            const text = `Me acabo de ahorrar horas de trabajo manual conciliando mi banco con ConciliAI. 🔥 ¡Es increíble! \n\nPruébalo aquí: https://concilia.ai`;
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all text-[13px] font-bold border border-indigo-100 cursor-pointer text-left"
                    >
                        <Zap className="w-4 h-4" />
                        Compartir Logro
                    </button>
                    <a
                        href="https://t.me/c/3814382001/3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-[13px] font-semibold"
                    >
                        <Send className="w-4 h-4 text-slate-400" />
                        Soporte Directo
                    </a>
                </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4">
                {/* VIP Support Section */}
            <div className="mx-4 mb-6 p-4 rounded-2xl bg-slate-900 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <ShieldCheck className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Acceso Prioritario</p>
              <h4 className="text-xs font-bold text-white mb-3">¿Necesitas ayuda con algo?</h4>
              <Link 
                href="https://t.me/c/3814382001/3" 
                target="_blank"
                className="w-full inline-flex items-center justify-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-sm"
              >
                Soporte VIP 24/7
              </Link>
            </div>

            {/* Usage Card */}
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
                    <p className="text-[11px] font-semibold text-slate-900 truncate mb-2">{email || "usuario@correo.com"}</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (usageCount / Math.max(1, limit)) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Referral Card */}
                <div className="p-4 bg-indigo-900 rounded-2xl border border-indigo-500/30 text-white space-y-3 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-500/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Regala 2 créditos</p>
                    <p className="text-[11px] font-medium leading-relaxed">Gana conciliaciones invitando a un colega.</p>
                    <button
                        onClick={() => {
                            const refLink = `https://concilia.ai/login?ref=${email.split('@')[0]}`;
                            navigator.clipboard.writeText(refLink);
                            alert("¡Link de referido copiado al portapapeles! 🚀");
                        }}
                        className="w-full py-2.5 bg-white text-indigo-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                        <Users className="w-3.5 h-3.5" />
                        Copiar Link
                    </button>
                </div>

                {/* Footer Controls */}
                {!isShopify && (
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Cerrar Sesión
                        </button>

                        <button
                            onClick={() => {
                                if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
                                    onDeleteAccount();
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-medium text-slate-300 hover:text-rose-500 transition-colors opacity-50 hover:opacity-100"
                        >
                            <Trash2 className="w-3 h-3" />
                            Eliminar Cuenta
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
