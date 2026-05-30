import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { SupabaseSessionStorage } from '@/lib/shopify-session-storage';
import { Session } from '@shopify/shopify-api';

// Query con paginación por cursor
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

// Formatea fecha a YYYY-MM-DD (formato que acepta Shopify GraphQL)
function toShopifyDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function GET(request: Request) {
  let shop: string | null = null;
  let host: string | null = null;

  try {
    const { searchParams } = new URL(request.url);
    shop = searchParams.get('shop');
    host = searchParams.get('host');
    const monthParam = searchParams.get('month'); // formato esperado: "2025-05"

    if (!shop) {
      return NextResponse.json({ error: 'Falta el parámetro shop' }, { status: 400 });
    }

    // --- Rango de fechas exacto del mes ---
    let dateStart: string;
    let dateEnd: string;
    let periodLabel: string;

    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [yearStr, monthStr] = monthParam.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr); // 1-12

      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0); // día 0 del mes siguiente = último del mes actual

      dateStart = toShopifyDate(firstDay);  // ej: "2025-05-01"
      dateEnd = toShopifyDate(lastDay);     // ej: "2025-05-31"
      periodLabel = monthParam;
    } else {
      // Mes actual por defecto
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      dateStart = toShopifyDate(firstDay);
      dateEnd = toShopifyDate(lastDay);
      periodLabel = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    // Formato correcto Shopify: created_at:>=2025-05-01 created_at:<=2025-05-31
    // SIN comillas simples, SIN ISO timestamp — solo YYYY-MM-DD
    // IMPORTANTE: status:any es obligatorio para traer órdenes cerradas/archivadas
    const graphqlFilter = `status:any AND created_at:>=${dateStart} AND created_at:<=${dateEnd}`;
    console.log(`[Orders] Shop: ${shop} | Period: ${periodLabel} | Filter: ${graphqlFilter}`);

    // --- Obtener sesión ---
    const sessionId = shopify.session.getOfflineId(shop);
    let sessionData = await SupabaseSessionStorage.loadSession(sessionId);

    if (!sessionData) {
      console.log(`[Orders] No offline session found, searching all sessions for ${shop}...`);
      const sessions = await SupabaseSessionStorage.findSessionsByShop(shop);
      console.log(`[Orders] Found ${sessions.length} session(s) for ${shop}`);
      // Preferir offline, luego online
      sessionData = sessions.find(s => s.accessToken && !s.isOnline)
        ?? sessions.find(s => s.accessToken && s.isOnline)
        ?? undefined;
    }

    // Verificar si la sesión guardada contiene el alcance obligatorio para órdenes históricas
    const hasRequiredScopes = sessionData?.scope?.includes('read_all_orders');

    if (!sessionData || !sessionData.accessToken || !hasRequiredScopes) {
      const hostParam = host ? `&host=${host}` : '';
      console.warn(`[Orders] No valid session or missing scopes for ${shop}. hasRequiredScopes: ${hasRequiredScopes}`);
      // Si la sesión existe pero no tiene los alcances necesarios (es obsoleta), la borramos para forzar re-auth
      if (sessionData) {
        await SupabaseSessionStorage.deleteSession(sessionData.id);
      }
      return NextResponse.json({
        error: 'Se requieren permisos adicionales de Shopify para acceder a órdenes históricas. Redireccionando...',
        code: 'SESSION_NOT_FOUND',
        reconnect_url: `/api/auth/shopify?shop=${shop}${hostParam}`
      }, { status: 401 });
    }

    const session = sessionData as Session;
    console.log(`[Orders] Using session: ${session.id} | scope: ${session.scope}`);

    const client = new shopify.clients.Graphql({ session });

    // --- Paginación completa por cursor ---
    const allOrders: any[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;
    let pageCount = 0;

    while (hasNextPage) {
      pageCount++;
      console.log(`[Orders] Fetching page ${pageCount}...`);

      const response = await client.request(ORDERS_QUERY, {
        variables: {
          query: graphqlFilter,
          ...(cursor ? { cursor } : {}),
        }
      });

      // Detectar errores GraphQL
      if (response.errors) {
        const errMsg = JSON.stringify(response.errors);
        console.error(`[Orders] GraphQL error on page ${pageCount}:`, errMsg);
        return NextResponse.json({
          error: `Error de Shopify GraphQL: ${errMsg}`,
          debug: { filter: graphqlFilter, page: pageCount, session_id: session.id }
        }, { status: 422 });
      }

      const gqlData = response.data as any;
      const edges: any[] = gqlData?.orders?.edges ?? [];
      const pageInfo = gqlData?.orders?.pageInfo;

      console.log(`[Orders] Page ${pageCount}: ${edges.length} orders | hasNextPage: ${pageInfo?.hasNextPage}`);

      // Formatear para Algoritmo Maestro
      for (const edge of edges) {
        const node = edge.node;
        const money = node.totalPriceSet?.presentmentMoney;
        allOrders.push({
          amount: parseFloat(money?.amount ?? '0'),
          date: node.createdAt,
          type: 'INCOME',
          description: `Pedido ${node.name}`,
          reference: node.name,
          currency: money?.currencyCode ?? 'USD',
          status: node.displayFinancialStatus ?? 'unknown',
          id: node.id.split('/').pop() ?? node.id,
        });
      }

      hasNextPage = pageInfo?.hasNextPage ?? false;
      cursor = pageInfo?.endCursor ?? null;

      // Safety cap
      if (pageCount >= 40) {
        console.warn('[Orders] Safety cap reached (40 pages / ~10,000 orders)');
        break;
      }
    }

    console.log(`[Orders] ✅ Total: ${allOrders.length} orders in ${pageCount} page(s) for ${shop} | ${periodLabel}`);

    return NextResponse.json({
      success: true,
      orders: allOrders,
      total: allOrders.length,
      pages: pageCount,
      shop,
      period: periodLabel,
      filter: graphqlFilter,
    });

  } catch (error: any) {
    console.error('[Orders] Unhandled error:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
      response: error.response?.body,
    });

    const isUnauthorized =
      error.message?.includes('401') ||
      error.response?.code === 401 ||
      error.message?.includes('InvalidAccessToken') ||
      error.message?.toLowerCase().includes('unauthorized');

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
      error: `Error: ${error.message}`,
      details: error.response?.body ?? null,
      debug: { shop, host }
    }, { status: 500 });
  }
}
