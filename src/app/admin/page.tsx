"use client";

import { useState, useEffect } from "react";
import { getAdminStats, updateUserPlan } from "@/lib/admin-actions";
import {
    Users,
    CreditCard,
    Activity,
    Search,
    Shield,
    XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Admin User Data (for Sidebar)
    const [adminProfile, setAdminProfile] = useState<any>(null);

    const router = useRouter();
    const supabase = createClient();

    // Initial Load
    useEffect(() => {
        loadData();
        fetchAdminProfile();
    }, []);

    const fetchAdminProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
            setAdminProfile(profile);
        }
    };

    const loadData = async () => {
        try {
            const data = await getAdminStats();
            setStats(data.stats);
            setUsers(data.users);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handlePromote = async (userId: string, tier: "FREE" | "PRO") => {
        try {
            const limit = tier === "PRO" ? 50 : 3;
            await updateUserPlan(userId, tier, limit);
            alert(`Usuario actualizado a ${tier}`);
            loadData(); // Refresh
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const filteredUsers = users.filter((u: any) =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.includes(searchTerm)
    );

    if (loading) return <div className="flex h-screen items-center justify-center">Cargando Admin Panel...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">Error: {error}</div>;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-gray-900">
            <Sidebar
                currentView="admin"
                onViewChange={() => { }} // No view change in admin
                usageCount={adminProfile?.usage_count || 0}
                limit={adminProfile?.plans_usage_limit || 0}
                tier={adminProfile?.tier || "FREE"}
                email={adminProfile?.email || ""}
                role={adminProfile?.role || "admin"}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
                onUpgrade={() => { }}
                onDeleteAccount={() => { }} // No self-delete in admin for safety
            />

            <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900"
                    >
                        <Users className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Shield className="w-8 h-8 text-indigo-600" />
                            Admin Command Center
                        </h1>
                        <p className="text-slate-500 font-medium">Control total sobre usuarios y planes.</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Modo Dios Activo</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-4 h-4" /> Usuarios Totales
                        </p>
                        <p className="text-3xl font-black text-slate-900">{stats?.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-2">
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Usuarios PRO
                        </p>
                        <p className="text-3xl font-black text-emerald-600">{stats?.proUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-2">
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Conciliaciones
                        </p>
                        <p className="text-3xl font-black text-indigo-600">{stats?.totalConciliations}</p>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-xl space-y-2 text-white">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="text-emerald-400">$</span> MRR Potencial
                        </p>
                        <p className="text-3xl font-black text-emerald-400">$ {stats?.estimatedLTV}</p>
                    </div>
                </div>

                {/* Tactic Awareness & Growth */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Funnel */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                EMBUDO DE CONVERSIÓN (TÁCTICAS)
                            </h3>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">LIVE</span>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Landing Views", value: stats?.growth?.views, color: "bg-slate-100", text: "text-slate-600" },
                                { label: "Interacciones", value: stats?.growth?.clicks, color: "bg-amber-50", text: "text-amber-600" },
                                { label: "Segm. Perfil", value: stats?.growth?.segmentation, color: "bg-indigo-50", text: "text-indigo-600" },
                                { label: "Free Tools UX", value: stats?.growth?.conversions, color: "bg-emerald-50", text: "text-emerald-600" }
                            ].map((item, i) => (
                                <div key={i} className={cn("p-6 rounded-[30px] space-y-1", item.color)}>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                    <p className={cn("text-2xl font-black", item.text)}>{item.value || 0}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                                <span>Eficiencia de la Táctica</span>
                                <span>{stats?.growth?.views > 0 ? ((stats.growth.clicks / stats.growth.views) * 100).toFixed(1) : 0}%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-600 transition-all duration-1000"
                                    style={{ width: `${stats?.growth?.views > 0 ? (stats.growth.clicks / stats.growth.views) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Roles Breakdown */}
                    <div className="bg-slate-950 p-8 rounded-[40px] shadow-2xl text-white space-y-6 overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-8 opacity-5">
                             <Activity className="w-24 h-24" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 relative">SEGMENTACIÓN</h3>
                         <div className="space-y-4 relative">
                             {Object.entries(stats?.growth?.roleBreakdown || {}).map(([role, count]: [string, any]) => (
                                 <div key={role} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                     <div>
                                         <span className="text-xs font-black uppercase tracking-widest">{role}</span>
                                         <p className="text-[10px] text-slate-500 font-bold uppercase">Source: Organico</p>
                                     </div>
                                     <span className="text-lg font-black">{count}</span>
                                 </div>
                             ))}
                             {Object.keys(stats?.growth?.roleBreakdown || {}).length === 0 && (
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-10">Esperando datos de segmentación...</p>
                             )}
                         </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Gestión de Usuarios</h2>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por email..."
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="p-6">Usuario</th>
                                    <th className="p-6">Plan / Estado</th>
                                    <th className="p-6">Uso / Límite</th>
                                    <th className="p-6">Vence / Fin</th>
                                    <th className="p-6">Motivo Cancelación</th>
                                    <th className="p-6 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="font-bold text-slate-900 text-sm">{user.email}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5">{user.id}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-block w-fit",
                                                    user.tier === "PRO" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {user.tier}
                                                </span>
                                                {user.current_period_end && (
                                                    <span className={cn(
                                                        "text-[9px] font-bold uppercase",
                                                        new Date(user.current_period_end) > new Date() ? "text-emerald-500" : "text-rose-500"
                                                    )}>
                                                        {new Date(user.current_period_end) > new Date() ? "• Activo" : "• Churn"}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full", user.usage_count >= (user.plans_usage_limit || 3) ? "bg-rose-500" : "bg-indigo-500")}
                                                        style={{ width: `${Math.min(100, (user.usage_count / (user.plans_usage_limit || 3)) * 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{user.usage_count} / {user.plans_usage_limit || 3}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-xs font-bold text-slate-600">
                                                {user.current_period_end ? new Date(user.current_period_end).toLocaleDateString() : "-"}
                                            </div>
                                            <div className="text-[9px] text-slate-400">Vence</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-xs text-slate-600 italic max-w-[150px] truncate">
                                                {user.cancellation_reason || "Sin comentarios"}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            {user.tier === "FREE" ? (
                                                <button
                                                    onClick={() => handlePromote(user.id, "PRO")}
                                                    className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg font-bold text-xs gap-2"
                                                >
                                                    <CreditCard className="w-3 h-3" /> Dar PRO
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handlePromote(user.id, "FREE")}
                                                    className="btn btn-sm btn-ghost text-rose-500 hover:bg-rose-50 rounded-lg font-bold text-xs gap-2"
                                                >
                                                    <XCircle className="w-3 h-3" /> Quitar PRO
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
