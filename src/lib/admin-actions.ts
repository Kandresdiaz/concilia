"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
    const supabase = await createClient();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    const supabaseAdmin = createClientAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if current user is admin/superadmin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: currentUserProfile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (currentUserProfile?.role !== "admin" && currentUserProfile?.role !== "superadmin") {
        throw new Error("Access Denied: Admin only");
    }

    // Fetch all profiles using ADMIN client to bypass RLS
    const { data: profiles, error } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    // Calculate Stats
    const totalUsers = profiles.length;
    const proUsers = profiles.filter(p => p.tier === "PRO").length;
    const totalConciliations = profiles.reduce((sum, p) => sum + (p.reconciliations_count || 0), 0);
    const estimatedLTV = proUsers * 19; // Simple estimation

    // Fetch Analytics Stats (Growth Awareness)
    const { data: allEvents } = await supabaseAdmin
        .from("analytics_events")
        .select("event_name, metadata");
    
    const { data: segmentData } = await supabaseAdmin
        .from("analytics_events")
        .select("metadata")
        .eq("event_name", "user_segmentation");

    const conversionStats = {
        views: allEvents?.filter(e => e.event_name === "landing_view").length || 0,
        conversions: allEvents?.filter(e => e.event_name === "landing_upload_success").length || 0,
        clicks: allEvents?.filter(e => e.event_name === "interaction_click").length || 0,
        segmentation: segmentData?.length || 0,
        pathBreakdown: allEvents?.filter(e => e.event_name === "landing_view").reduce((acc: any, curr: any) => {
            const path = curr.metadata?.path || "/";
            acc[path] = (acc[path] || 0) + 1;
            return acc;
        }, {}) || {},
        roleBreakdown: segmentData?.reduce((acc: any, curr: any) => {
            const role = curr.metadata?.role || "unknown";
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {}) || {}
    };

    return {
        users: profiles,
        stats: {
            totalUsers,
            proUsers,
            totalConciliations,
            estimatedLTV,
            growth: conversionStats
        }
    };
}

export async function updateUserPlan(userId: string, tier: "FREE" | "PRO", limit: number) {
    const supabase = await createClient();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    const supabaseAdmin = createClientAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: adminProfile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (adminProfile?.role !== "admin" && adminProfile?.role !== "superadmin") throw new Error("Access Denied");

    // Update Target User using Admin client
    const { error } = await supabaseAdmin
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
