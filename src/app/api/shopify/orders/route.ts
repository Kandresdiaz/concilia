import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { SupabaseSessionStorage } from '@/lib/shopify-session-storage';
import { Session } from '@shopify/shopify-api';

export async function GET(request: Request) {
  let shop: string | null = null;
  let host: string | null = null;

  try {
    const { searchParams } = new URL(request.url);
    shop = searchParams.get('shop');
    host = searchParams.get('host');

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
      const hostParam = host ? `&host=${host}` : "";
      return NextResponse.json({ 
        error: 'Sesión expirada. Reconectando automáticamente...',
        code: 'SESSION_NOT_FOUND',
        reconnect_url: `/api/auth/shopify?shop=${shop}${hostParam}`
      }, { status: 401 });
    }

    // Convert data to Session object
    const session = sessionData as Session;

    // 2. Instanciar el cliente GraphQL
    const client = new shopify.clients.Graphql({ session });

    // 3. Obtener las órdenes recientes usando GraphQL
    // Esto evita pedir datos protegidos (customer, addresses) y previene el error 403.
    const query = `
      query {
        orders(first: 50, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              totalPriceSet {
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const response = await client.query({
      data: query,
    });

    const body = response.body as any;
    const orders = body.data?.orders?.edges || [];

    // 4. Formatear las órdenes para el Algoritmo Maestro de ConciliAI
    // El algoritmo espera: { amount, date, type, description, reference, id }
    // IMPORTANTE: GraphQL nos da control total para NO tocar datos de clientes.
    const formattedOrders = orders.map((edge: any) => {
      const node = edge.node;
      return {
        amount: node.totalPriceSet.presentmentMoney.amount,
        date: node.createdAt,
        type: 'INCOME',
        description: `Pedido ${node.name}`,
        reference: node.name,
        id: node.id.split('/').pop() || node.id // Extraer ID numérico
      };
    });

    return NextResponse.json({ success: true, orders: formattedOrders });

  } catch (error: any) {
    console.error('Error fetching Shopify orders:', error);
    
    // Si Shopify nos dice que no estamos autorizados (401), borramos la sesión vieja
    if (error.message?.includes('401') || error.response?.status === 401) {
      const sessionId = shopify.session.getOfflineId(shop || "");
      console.warn(`401 detectado. Borrando sesión inválida: ${sessionId}`);
      await SupabaseSessionStorage.deleteSession(sessionId);
      
      return NextResponse.json({ 
        error: 'Sesión expirada. Reconectando automáticamente...',
        code: 'SESSION_NOT_FOUND',
        reconnect_url: `/api/auth/shopify?shop=${shop}${host ? `&host=${host}` : ""}`
      }, { status: 401 });
    }

    return NextResponse.json({ 
      error: `Error de Shopify: ${error.message}`,
      details: error.response?.body || null
    }, { status: 500 });
  }
}
