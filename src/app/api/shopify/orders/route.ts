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

    // 1. Obtener sesión offline (la permanente para API access)
    const sessionId = shopify.session.getOfflineId(shop);
    let sessionData = await SupabaseSessionStorage.loadSession(sessionId);

    if (!sessionData) {
      console.log(`[Orders] Buscando sesión alternativa para ${shop}...`);
      const sessions = await SupabaseSessionStorage.findSessionsByShop(shop);
      // Usar la sesión con access_token válido (offline preferida)
      sessionData = sessions
        .filter(s => s.accessToken && !s.isOnline)
        .concat(sessions.filter(s => s.accessToken && s.isOnline))[0];
    }

    if (!sessionData || !sessionData.accessToken) {
      console.warn(`[Orders] No session found for shop: ${shop}`);
      const hostParam = host ? `&host=${host}` : '';
      return NextResponse.json({
        error: 'No hay sesión de Shopify activa. Reconectando...',
        code: 'SESSION_NOT_FOUND',
        reconnect_url: `/api/auth/shopify?shop=${shop}${hostParam}`
      }, { status: 401 });
    }

    const session = sessionData as Session;
    console.log(`[Orders] Session found for ${shop}, scope: ${session.scope}`);

    // 2. Instanciar cliente GraphQL (API v11 usa client.request())
    const client = new shopify.clients.Graphql({ session });

    // 3. Consultar órdenes — NOTA: desde API 2024-10, orders() REQUIERE el argumento 'query:'
    // Sin filtro la API devuelve error. Usamos una fecha amplia (últimos 2 años).
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const dateFilter = twoYearsAgo.toISOString().split('T')[0]; // YYYY-MM-DD

    const ORDERS_QUERY = `
      query GetOrders($query: String!) {
        orders(first: 250, query: $query, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              displayFinancialStatus
              totalPriceSet {
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
              subtotalPriceSet {
                presentmentMoney {
                  amount
                }
              }
              totalTaxSet {
                presentmentMoney {
                  amount
                }
              }
              totalShippingPriceSet {
                presentmentMoney {
                  amount
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    // client.request() es la API correcta en @shopify/shopify-api v11+
    const response = await client.request(ORDERS_QUERY, {
      variables: {
        query: `created_at:>=${dateFilter}`
      }
    });

    const body = response.data as any;

    if (response.errors) {
      console.error('[Orders] GraphQL errors:', JSON.stringify(response.errors));
      return NextResponse.json({
        error: `Error GraphQL de Shopify: ${response.errors.message || JSON.stringify(response.errors)}`,
        details: response.errors
      }, { status: 422 });
    }

    const edges = body?.orders?.edges || [];
    console.log(`[Orders] Fetched ${edges.length} orders for ${shop}`);

    // 4. Formatear para el Algoritmo Maestro de ConciliAI
    const formattedOrders = edges.map((edge: any) => {
      const node = edge.node;
      const money = node.totalPriceSet?.presentmentMoney;
      return {
        amount: parseFloat(money?.amount || '0'),
        date: node.createdAt,
        type: 'INCOME',
        description: `Pedido ${node.name}`,
        reference: node.name,
        currency: money?.currencyCode || 'USD',
        status: node.displayFinancialStatus || 'unknown',
        id: node.id.split('/').pop() || node.id,
      };
    });

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      total: formattedOrders.length,
      shop,
    });

  } catch (error: any) {
    console.error('[Orders] Error fetching Shopify orders:', {
      message: error.message,
      response: error.response?.body,
      statusCode: error.response?.code,
    });

    // Sesión inválida (401) — borrar y pedir re-autenticación
    const isUnauthorized = error.message?.includes('401')
      || error.response?.code === 401
      || error.message?.includes('InvalidAccessToken')
      || error.message?.toLowerCase().includes('unauthorized');

    if (isUnauthorized && shop) {
      const sessionId = shopify.session.getOfflineId(shop);
      console.warn(`[Orders] 401 detectado. Borrando sesión inválida: ${sessionId}`);
      await SupabaseSessionStorage.deleteSession(sessionId);

      return NextResponse.json({
        error: 'Sesión expirada. Reconectando automáticamente...',
        code: 'SESSION_NOT_FOUND',
        reconnect_url: `/api/auth/shopify?shop=${shop}${host ? `&host=${host}` : ''}`
      }, { status: 401 });
    }

    return NextResponse.json({
      error: `Error de Shopify: ${error.message}`,
      details: error.response?.body || null
    }, { status: 500 });
  }
}
