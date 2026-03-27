import { shopify } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
    }

    // Comienza el proceso de OAuth
    const redirectUrl = await shopify.auth.begin({
      shop,
      callbackPath: "/api/auth/shopify/callback",
      isOnline: false,
      rawRequest: request,
    });

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error("DEBUG: Shopify Auth Begin Error:", error);
    return NextResponse.json({ 
      error: "Error al iniciar OAuth con Shopify", 
      details: error.message,
      env_host: process.env.HOST ? "SET" : "MISSING",
      env_key: process.env.SHOPIFY_API_KEY ? "SET" : "MISSING"
    }, { status: 500 });
  }
}
