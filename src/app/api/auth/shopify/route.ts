import { shopify } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
  }

  // Comienza el proceso de OAuth
  // Nota: En un entorno real, esto redirigirá al usuario a Shopify para aprobar la instalación
  const redirectUrl = await shopify.auth.begin({
    shop,
    callbackPath: "/api/auth/shopify/callback",
    isOnline: false,
    rawRequest: request,
  });

  return NextResponse.redirect(redirectUrl);
}
