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
    
    if (!stored) {
      console.error("Failed to store session in Supabase for shop:", shop);
      // No bloqueamos el flujo, pero lo logueamos
    }

    // 2. Auto-login en Supabase con el email del merchant (no necesita Google)
    // Shopify ya autenticó al usuario — pedir otro login viola sus políticas
    const associatedUser = session.onlineAccessInfo?.associated_user;
    const merchantEmail = associatedUser?.email;
    const merchantName = associatedUser
      ? `${associatedUser.first_name} ${associatedUser.last_name}`.trim()
      : shop.replace(".myshopify.com", "");

        // 2. Auto-login en Supabase con el email del merchant
        // Shopify ya autenticó al usuario — pedir otro login viola sus políticas
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
        );

        // Actualizar el perfil con el shopify_shop domain
        const { data: userData } = await supabaseAdmin.auth.admin.getUserByEmail(merchantEmail);
        if (userData?.user) {
          await supabaseAdmin
            .from("profiles")
            .update({ shopify_shop: shop })
            .eq("id", userData.user.id);
        }

        // Crear usuario si no existe, o simplemente generar un magic link de sesión
        const { data: magicData, error: magicError } = await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: merchantEmail,
          options: {
            redirectTo: `${origin}/auth/callback?shop=${shop}${host ? `&host=${host}` : ""}`,
            data: { full_name: merchantName, shopify_shop: shop }
          }
        });

        if (!magicError && magicData?.properties?.action_link) {
          // Redirigir al magic link para crear la sesión automáticamente
          return NextResponse.redirect(magicData.properties.action_link);
        }
      } catch (supabaseErr) {
        console.warn("Auto-login fallo, redirigiendo al login manual:", supabaseErr);
      }
    }

    // Fallback: si no pudo hacer auto-login, ir al login pero con el contexto de Shopify
    const shopifyQuery = `?shop=${shop}${host ? `&host=${host}` : ""}`;
    return NextResponse.redirect(new URL(`/login${shopifyQuery}`, request.url));
  } catch (error: any) {
    console.error("Shopify OAuth Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
