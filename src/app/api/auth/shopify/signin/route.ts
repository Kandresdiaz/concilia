import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Este endpoint crea o recupera un usuario de Supabase basado en el shop domain.
// No requiere email ni contraseña adicional — Shopify ya autenticó al merchant.
export async function POST(request: Request) {
  try {
    const { shop, host } = await request.json();

    if (!shop) {
      return NextResponse.json({ error: "Missing shop" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
    );

    // Usamos el shop domain como identificador único del merchant
    // Formato: owner@[shop-name].shopify (nunca existe como email real → solo para auth interna)
    const shopEmail = `owner@${shop}`;

    // Generar magic link silencioso (crea el usuario si no existe)
    const origin = request.headers.get("origin") || process.env.HOST || "https://conciliai.com";
    const shopifyQuery = `?shop=${shop}${host ? `&host=${host}` : ""}`;

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: shopEmail,
      options: {
        redirectTo: `${origin}/auth/callback${shopifyQuery}`,
        data: { shopify_shop: shop, auto_created: true }
      }
    });

    if (error) {
      console.error("Error generando magic link:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ url: data?.properties?.action_link });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
