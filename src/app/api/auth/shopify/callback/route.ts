import { shopify } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
    }

    // Completa el proceso de OAuth y guarda la sesión en Supabase
    const { session } = await shopify.auth.callback({
      rawRequest: request,
      rawResponse: new Response(), // Adaptador necesario
    });

    if (!session) {
      return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
    }

    // Redirige a la App dentro del admin de Shopify
    // Nota: El host es necesario para que Shopify App Bridge funcione
    const host = searchParams.get("host");
    return NextResponse.redirect(`/?shop=${shop}&host=${host}`);
  } catch (error: any) {
    console.error("Shopify OAuth Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
