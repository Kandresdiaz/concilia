import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const topic = req.headers.get("x-shopify-topic") || "unknown";
    const shop = req.headers.get("x-shopify-shop-domain") || "unknown";
    const hmac = req.headers.get("x-shopify-hmac-sha256");

    // Shopify Automated Check: Must reject requests without HMAC or invalid HMAC with 401
    if (!hmac) {
      return NextResponse.json({ error: "Missing HMAC" }, { status: 401 });
    }

    // Leemos el raw body exactamente como llega para no romper la firma
    const rawBody = await req.text();
    const secret = process.env.SHOPIFY_API_SECRET || "";

    // Validación estricta de HMAC en Node.js
    const generatedHash = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");

    if (generatedHash !== hmac) {
      console.warn(`[Shopify Webhook] Invalid HMAC. Expected: ${generatedHash}, Got: ${hmac}`);
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
    }

    // Si pasamos la firma, sabemos que es de Shopify.
    console.log(`[Shopify Webhook GDPR] Correctly validated ${topic} for ${shop}`);

    // Shopify exige responder con 200 OK rápido.
    // Como procesamos GDPR, en el tier actual solo necesitamos responder 200.
    return new NextResponse(null, { status: 200 });

  } catch (error: any) {
    console.error("Shopify Webhook Error:", error);
    // Fallback a 400 o 500 según corresponda
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
