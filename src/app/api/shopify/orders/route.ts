import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { SupabaseSessionStorage } from '@/lib/shopify-session-storage';
import { Session } from '@shopify/shopify-api';

const ORDERS_QUERY = `
  query GetOrders($query: String!, $cursor: String) {
    orders(first: 250, query: $query, after: $cursor, sortKey: CREATED_AT, reverse: false) {
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
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export async function GET(request: Request) {
  let shop: string | null = null;
  let host: string | null = null;

  try {
    const { searchParams } = new URL(request.url);
    shop = searchParams.get('shop');
    host = searchParams.get('host');
    const monthParam = searchParams.get('month'); // formato: "2025-05"
    
    if (!shop) {
      return NextResponse.json({ error: 'Falta el parámetro shop' }, { status: 400 });
    }

    // --- Calcular rango de fechas del mes ---
    let dateStart: string;
    let dateEnd: string;

    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [year, month] = monthParam.split('-').map(Number);
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0, 23, 59, 59); // último día del mes
      dateStart = firstDay.toISOString();
      dateEnd = lastDay.toISOString();
    } else {
      // Por defecto: mes actual
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      dateStart = firstDay.toISOString();
      dateEnd = lastDay.toISOString();
    }

    const graphqlFilter = `created_at:>='${dateStart}' AND created_at:<='${dateEnd}'`;
    console.log(`[Orders] Fetching for ${shop} | filter: ${graphqlFilter}`);

    // --- Obtener sesión ---
    const sessionId = shopify.session.getOfflineId(shop);
    let sessionData = await SupabaseSessionStorage.loadSession(sessionId);

    if (!sessionData) {
      const sessions = await SupabaseSessionStorage.findSessionsByShop(shop);
      sessionData = sessions
        .filter(s => s.accessToken && !s.isOnline)
        .concat(sessions.filter(s => s.accessToken && s.isOnline))[0];
    }

    if (!sessionData || !sessionData.accessToken) {
      const hostParam = host ? `&host=${host}` : '';
      return NextResponse.json({
        error: 'No hay sesión de Shopify activa. Reconectando...',
        code: 'SESSION_NOT_FOUND',
        reconnect_url: `/api/auth/shopify?shop=${shop}${hostParam}`
      }, { status: 401 });
    }

    const session = sessionData as Session;
    const client = new shopify.clients.Graphql({ session });

    // --- Paginación completa: recorre todos los cursores ---
    const allOrders: any[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;
    let pageCount = 0;

    while (hasNextPage) {
      pageCount++;
      console.log(`[Orders] Fetching page ${pageCount}${cursor ? ` (cursor: ${cursor.slice(0, 20)}...)` : ''}`);

      const response = await client.request(ORDERS_QUERY, {
        variables: {
          query: graphqlFilter,
          cursor: cursor || undefined,
        }
      });

      if (response.errors) {
        console.error('[Orders] GraphQL errors:', JSON.stringify(response.errors));
        return NextResponse.json({
          error: `Error de Shopify GraphQL: ${(response.errors as any).message || JSON.stringify(response.errors)}`,
          details: response.errors
        }, { status: 422 });
      }

      const data = response.data as any;
      const ordersPage = data?.orders?.edges || [];
      const pageInfo = data?.orders?.pageInfo;

      // Formatear y acumular
      for (const edge of ordersPage) {
        const node = edge.node;
        const money = node.totalPriceSet?.presentmentMoney;
        allOrders.push({
          amount: parseFloat(money?.amount || '0'),
          date: node.createdAt,
          type: 'INCOME',
          description: `Pedido ${node.name}`,
          reference: node.name,
          currency: money?.currencyCode || 'USD',
          status: node.displayFinancialStatus || 'unknown',
          id: node.id.split('/').pop() || node.id,
        });
      }

      hasNextPage = pageInfo?.hasNextPage ?? false;
      cursor = pageInfo?.endCursor ?? null;

      // Safety cap: máximo 40 páginas (10,000 órdenes) para evitar loops infinitos
      if (pageCount >= 40) {
        console.warn('[Orders] Hit pagination safety cap at 40 pages');
        break;
      }
    }

    console.log(`[Orders] Total fetched: ${allOrders.length} orders in ${pageCount} page(s) for ${shop}`);

    return NextResponse.json({
      success: true,
      orders: allOrders,
      total: allOrders.length,
      pages: pageCount,
      shop,
      period: monthParam || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    });

  } catch (error: any) {
    console.error('[Orders] Error:', {
      message: error.message,
      response: error.response?.body,
    });

    const isUnauthorized = error.message?.includes('401')
      || error.response?.code === 401
      || error.message?.includes('InvalidAccessToken')
      || error.message?.toLowerCase().includes('unauthorized');

    if (isUnauthorized && shop) {
      const sessionId = shopify.session.getOfflineId(shop);
      await SupabaseSessionStorage.deleteSession(sessionId);
      return NextResponse.json({
        error: 'Sesión expirada. Reconectando...',
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
