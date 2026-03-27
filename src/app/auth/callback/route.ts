import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient as createClientAdmin } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const supabaseAdmin = createClientAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'
    // Preservar contexto de Shopify si viene en la URL de callback
    const shop = searchParams.get('shop')
    const host = searchParams.get('host')
    const shopifyQuery = shop ? `?shop=${shop}${host ? `&host=${host}` : ''}` : ''

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // --- Referral System Logic ---
                const cookieStore = await cookies();
                const referrerPrefix = cookieStore.get('concilia_ref')?.value;

                // 1. Check if profile exists
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                // 2. If new user (or first login without usage) and has referrer
                if (profile && profile.usage_count === 0 && referrerPrefix && !profile.referred_by) {
                    console.log(`Procesando referido de: ${referrerPrefix}`);

                    // Reward the referrer
                    // Find referrer by email prefix (as set in Sidebar)
                    const { data: referrerProfile } = await supabase
                        .from("profiles")
                        .select("id, plans_usage_limit")
                        .ilike("email", `${referrerPrefix}%`)
                        .single();

                    if (referrerProfile) {
                        // +2 credits for referrer
                        await supabaseAdmin.from("profiles").update({
                            plans_usage_limit: (referrerProfile.plans_usage_limit || 2) + 2
                        }).eq("id", referrerProfile.id);

                        // +2 credits for new user
                        await supabaseAdmin.from("profiles").update({
                            plans_usage_limit: (profile.plans_usage_limit || 2) + 2,
                            referred_by: referrerProfile.id
                        }).eq("id", user.id);

                        console.log("¡Referido exitoso! Créditos otorgados.");
                    }
                }

                if (profile?.role === "admin" || profile?.role === "superadmin") {
                    return NextResponse.redirect(`${origin}/admin`);
                }
            }

            // Si estamos en contexto de Shopify, redirigir de vuelta al Admin de Shopify
            // para que la app se cargue incrustada (embedded) y no "salte" a la web.
            if (shop && host) {
                const apiKey = process.env.SHOPIFY_API_KEY;
                console.log(`REDIRECTING TO SHOPIFY ADMIN: https://${host}/apps/${apiKey}`);
                return NextResponse.redirect(`https://${host}/apps/${apiKey}`);
            }

            return NextResponse.redirect(`${origin}${next}${shopifyQuery}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
