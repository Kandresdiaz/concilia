"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
    const supabase = await createClient();

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (currentUserProfile?.role !== "admin") {
        throw new Error("Access Denied: Admin only");
    }

    // Fetch all profiles
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    // Calculate Stats
    const totalUsers = profiles.length;
    const proUsers = profiles.filter(p => p.tier === "PRO").length;
    const totalConciliations = profiles.reduce((sum, p) => sum + (p.reconciliations_count || 0), 0);
    const estimatedLTV = proUsers * 19; // Simple estimation

    return {
        users: profiles,
        stats: {
            totalUsers,
            proUsers,
            totalConciliations,
            estimatedLTV
        }
    };
}

export async function updateUserPlan(userId: string, tier: "FREE" | "PRO", limit: number) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: adminProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (adminProfile?.role !== "admin") throw new Error("Access Denied");

    // Update Target User
    const { error } = await supabase
        .from("profiles")
        .update({
            tier: tier,
            plans_usage_limit: limit,
            updated_at: new Date().toISOString()
        })
        .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin");
}
