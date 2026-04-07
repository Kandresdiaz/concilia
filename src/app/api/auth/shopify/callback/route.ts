import { shopify } from "@/lib/shopify";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const shop = searchParams.get("shop");
    const host = searchParams.get("host");

    if (!shop) {
      return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
    }

    // 1. Completar el OAuth de Shopify y guardar sesión
    const { session } = await shopify.auth.callback({
      rawRequest: request,
    });

    if (!session) {
      console.error("OAuth failed: No session returned from Shopify");
      return NextResponse.json({ error: "OAuth failed: No session" }, { status: 500 });
    }
    
    // 1.5. Guardar la sesión explícitamente en Supabase (Storage persistente)
    const { SupabaseSessionStorage } = await import("@/lib/shopify-session-storage");
    const stored = await SupabaseSessionStorage.storeSession(session);
    
    // DEBUG: Si falla el guardado, informarlo directamente en el navegador
    if (!stored) {
      console.error("CRITICAL: Failed to store session in Supabase for shop:", shop);
      return NextResponse.json({ 
        error: "Fallo crítico al guardar la sesión de Shopify en la base de datos. Verifica la conexión a Supabase y los permisos de Service Role.",
        session_id: session.id,
        shop: session.shop
      }, { status: 500 });
    }

    // 2. Auto-login en Supabase con el email del merchant (no necesita Google)
    // Shopify ya autenticó al usuario — pedir otro login viola sus políticas
    const associatedUser = session.onlineAccessInfo?.associated_user;
    const merchantEmail = associatedUser?.email;
    const merchantName = associatedUser
      ? `${associatedUser.first_name} ${associatedUser.last_name}`.trim()
      : shop.replace(".myshopify.com", "");
    // Intentar encontrar el usuario por email real, o por el email auto-generado de Shopify
    const searchEmail = merchantEmail || `owner@${shop}`;

    try {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
      );

      console.log("Shopify Callback: Updating profile for email:", searchEmail);

      const { data: profileData, error: profileError } = await (supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", searchEmail) as any)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile during Shopify callback:", profileError);
      }

      if (profileData) {
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ shopify_shop: shop } as any)
          .eq("id", profileData.id);
        
        if (updateError) {
          console.error("Error updating profile with shopify_shop:", updateError);
        } else {
          console.log("SUCCESS: Profile updated with shopify_shop:", shop);
        }
      } else {
        console.warn("No profile found for email:", searchEmail, "Creating via magic link will handle profile creation.");
        // --- NEW: Send Welcome Email to new merchant ---
        try {
          const { sendWelcomeEmail } = await import("@/lib/mail");
          await sendWelcomeEmail(searchEmail, merchantName);
        } catch (mailErr) {
          console.error("Failed to send welcome email:", mailErr);
        }
      }

      // Crear usuario si no existe, o simplemente generar un magic link de sesión
      const { data: magicData, error: magicError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: searchEmail,
        options: {
          redirectTo: `${origin}/auth/callback?shop=${shop}${host ? `&host=${host}` : ""}`,
          data: { full_name: merchantName, shopify_shop: shop }
        }
      });

      if (!magicError && magicData?.properties?.action_link) {
        console.log("Shopify Callback: Redirecting to magic link auth");
        return NextResponse.redirect(magicData.properties.action_link);
      } else if (magicError) {
        console.error("Error generating magic link for Shopify merchant:", magicError);
      }
    } catch (supabaseErr) {
      console.error("Auto-login fallo crítico:", supabaseErr);
    }

    // Fallback: si no pudo hacer auto-login, ir al login pero con el contexto de Shopify
    const shopifyQuery = `?shop=${shop}${host ? `&host=${host}` : ""}`;
    return NextResponse.redirect(new URL(`/login${shopifyQuery}`, request.url));
  } catch (error: any) {
    console.error("Shopify OAuth Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
