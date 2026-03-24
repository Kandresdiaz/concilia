import { shopify } from "@/lib/shopify";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const topic = req.headers.get("x-shopify-topic") || "";
    const shop = req.headers.get("x-shopify-shop-domain") || "";
    const hmac = req.headers.get("x-shopify-hmac-sha256") || "";

    const rawBody = await req.text();

    // Validar HMAC para seguridad (Solo peticiones reales de Shopify)
    const generatedHash = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET || "")
      .update(rawBody)
      .digest("base64");

    if (generatedHash !== hmac) {
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    console.log(`[Shopify Webhook] Topic: ${topic} for ${shop}`);

    switch (topic) {
      case "customers/data_request":
        // Lógica para enviar datos del cliente al email proporcionado
        console.log("Customer data request:", payload);
        break;
      case "customers/redact":
        // Lógica para borrar datos del cliente
        console.log("Customer redact request:", payload);
        break;
      case "shop/redact":
        // Lógica para borrar datos de la tienda (48h después de desinstalar)
        console.log("Shop redact request:", payload);
        break;
      case "app/uninstalled":
        // Limpieza inmediata si es necesario
        console.log("App uninstalled for:", shop);
        break;
      default:
        console.log("Unhandled webhook topic:", topic);
    }

    return new Response(null, { status: 200 });
  } catch (error: any) {
    console.error("Shopify Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
