"use client";

import { useState, useEffect } from "react";
import { getAdminStats, updateUserPlan } from "@/lib/admin-actions";
import {
    Users,
    CreditCard,
    Activity,
    Search,
    Shield,
    CheckCircle,
    XCircle,
    Edit,
    Save
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        loadData();
    }, []);

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

    const handlePromote = async (userId: string, tier: "FREE" | "PRO") => {
        try {
            const limit = tier === "PRO" ? 50 : 3;
            await updateUserPlan(userId, tier, limit);
            alert(`Usuario actualizado a ${tier}`);
            loadData(); // Refresh
            setEditingUser(null);
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.includes(searchTerm)
    );

    if (loading) return <div className="flex h-screen items-center justify-center">Cargando Admin Panel...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 space-y-8 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        Admin Command Center
                    </h1>
                    <p className="text-slate-500 font-medium">Control total sobre usuarios y planes.</p>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Modo Dios</span>
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
                                <th className="p-6">Plan Actual</th>
                                <th className="p-6">Uso / Límite</th>
                                <th className="p-6">Total Histórico</th>
                                <th className="p-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-900 text-sm">{user.email}</div>
                                        <div className="text-xs text-slate-400 font-mono mt-0.5">{user.id}</div>
                                    </td>
                                    <td className="p-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide",
                                            user.tier === "PRO" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {user.tier}
                                        </span>
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
                                    <td className="p-6 font-mono text-sm text-slate-500">
                                        {user.reconciliations_count || 0} audits
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
    );
}
