import { shopify } from "@/lib/shopify";
import { SupabaseSessionStorage } from "@/lib/shopify-session-storage";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { plan, shop } = await req.json();

        if (!shop || !plan) {
            return NextResponse.json({ error: "Missing shop or plan parameter" }, { status: 400 });
        }

        const sessionId = shopify.session.getOfflineId(shop);
        const session = await SupabaseSessionStorage.loadSession(sessionId);

        if (!session) {
            return NextResponse.json({ error: "No valid session found for this shop. Please reconnect." }, { status: 401 });
        }

        // 1. Verificamos si ya tienen este plan activo
        const hasPayment = await shopify.billing.check({
            session,
            plans: [plan],
            isTest: true, // TODO: Cambiar a false o usar variable de entorno en producción real si no es tienda de prueba
        });

        if (hasPayment) {
            // Si ya lo tienen, los redirigimos al inicio de la app en Shopify
            const shopName = shop.replace(".myshopify.com", "");
            return NextResponse.json({ 
                url: `https://admin.shopify.com/store/${shopName}/apps/${process.env.SHOPIFY_API_KEY}` 
            });
        }

        // 2. Si no lo tienen, solicitamos el cobro
        const confirmationUrl = await shopify.billing.request({
            session,
            plan: plan,
            isTest: true, // Shopify requiere isTest: true para tiendas de desarrollo/pruebas
        });

        return NextResponse.json({ url: confirmationUrl });

    } catch (error: any) {
        console.error("Shopify Billing Error:", error);
        return NextResponse.json({ error: error.message || "Error procesando el pago con Shopify" }, { status: 500 });
    }
}
