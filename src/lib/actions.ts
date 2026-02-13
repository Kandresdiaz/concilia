"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return profile;
}

export async function saveConciliation(data: any, finalBalance: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Fetch profile to check usage
    const { data: profile } = await supabase
        .from("profiles")
        .select("tier, usage_count, reconciliations_count")
        .eq("id", user.id)
        .single();

    const currentUsage = profile?.usage_count ?? profile?.reconciliations_count ?? 0;

    if (profile?.tier === "FREE" && currentUsage >= 5) {
        throw new Error("Límite de plan gratuito alcanzado.");
    }

    // Save conciliation
    const { error: insertError } = await supabase
        .from("conciliations")
        .insert({
            user_id: user.id,
            data: data,
            final_balance: finalBalance,
            company_name: data.company_name, // Map explicitly
            precision_score: data.precision_score
        });

    if (insertError) throw insertError;

    // Increment usage count 
    const { error: updateError } = await supabase
        .from("profiles")
        .update({
            usage_count: currentUsage + 1,
            reconciliations_count: (profile?.reconciliations_count ?? 0) + 1
        })
        .eq("id", user.id);

    if (updateError) throw updateError;

    revalidatePath("/");
}

export async function getConciliationHistory() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("conciliations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error fetching history:", error);
        return [];
    }

    return data;
}
