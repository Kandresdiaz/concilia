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
      rawResponse: new Response(),
    });

    if (!session) {
      return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
    }

    // 2. Auto-login en Supabase con el email del merchant (no necesita Google)
    // Shopify ya autenticó al usuario — pedir otro login viola sus políticas
    const merchantEmail = session.onlineAccessInfo?.associated_user?.email || session.email;
    const merchantName = session.onlineAccessInfo?.associated_user
      ? `${session.onlineAccessInfo.associated_user.first_name} ${session.onlineAccessInfo.associated_user.last_name}`.trim()
      : shop.replace(".myshopify.com", "");

    if (merchantEmail) {
      try {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
        );

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
