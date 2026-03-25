import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { SupabaseSessionStorage } from '@/lib/shopify-session-storage';
import { Session } from '@shopify/shopify-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get('shop');

    if (!shop) {
      return NextResponse.json({ error: 'Falta el parámetro shop' }, { status: 400 });
    }

    // 1. Intentar obtener la sesión (Primero offline, luego buscar por shop)
    const sessionId = shopify.session.getOfflineId(shop);
    let sessionData = await SupabaseSessionStorage.loadSession(sessionId);

    if (!sessionData) {
      console.log(`Buscando cualquier sesión alternativa para ${shop}...`);
      const sessions = await SupabaseSessionStorage.findSessionsByShop(shop);
      // Usar la sesión más reciente que tenga access_token
      sessionData = sessions.sort((a, b) => (b.expires?.getTime() || 0) - (a.expires?.getTime() || 0))[0];
    }

    if (!sessionData || !sessionData.accessToken) {
      return NextResponse.json({ 
        error: 'No se encontró una sesión válida. Por favor, intenta "Re-conectar" la tienda desde el menu de importación.',
        code: 'SESSION_NOT_FOUND' 
      }, { status: 401 });
    }

    // Convert data to Session object
    const session = sessionData as Session;

    // 2. Instanciar el cliente REST
    const client = new shopify.clients.Rest({ session });

    // 3. Obtener las órdenes recientes
    // Pedimos las últimas 250 órdenes, de cualquier estado
    const response = await client.get({
      path: 'orders',
      query: {
        status: 'any',
        limit: 250,
      },
    });

    const orders = (response.body as any).orders;

    // 4. Formatear las órdenes para el Algoritmo Maestro de ConciliAI
    // El algoritmo espera: { amount, date, type, description, reference, id }
    const formattedOrders = orders.map((order: any) => ({
      amount: order.current_total_price,
      date: order.created_at,
      type: 'INCOME', // Las ventas de Shopify son ingresos
      description: `Pedido ${order.name} - ${order.customer?.first_name || 'Cliente'} ${order.customer?.last_name || ''}`.trim(),
      reference: order.name, // Ej: #1001
      id: order.id.toString()
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });

  } catch (error: any) {
    console.error('Error fetching Shopify orders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
