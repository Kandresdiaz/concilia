import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { SupabaseSessionStorage } from '@/lib/shopify-session-storage';
import { Session } from '@shopify/shopify-api';

// Endpoint de diagnóstico — muestra qué está pasando con la sesión y la API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Falta shop' }, { status: 400 });
  }

  const report: any = { shop, timestamp: new Date().toISOString(), steps: [] };

  try {
    // 1. Verificar sesión offline
    const offlineId = shopify.session.getOfflineId(shop);
    report.steps.push({ step: 'offline_session_id', value: offlineId });

    const offlineSession = await SupabaseSessionStorage.loadSession(offlineId);
    report.steps.push({
      step: 'offline_session_found',
      found: !!offlineSession,
      has_token: !!offlineSession?.accessToken,
      scope: offlineSession?.scope,
      expires: offlineSession?.expires,
    });

    // 2. Buscar todas las sesiones del shop
    const allSessions = await SupabaseSessionStorage.findSessionsByShop(shop);
    report.steps.push({
      step: 'all_sessions',
      count: allSessions.length,
      sessions: allSessions.map(s => ({
        id: s.id,
        is_online: s.isOnline,
        has_token: !!s.accessToken,
        scope: s.scope,
        expires: s.expires,
      }))
    });

    const session = offlineSession ?? allSessions.find(s => s.accessToken) as Session | undefined;

    if (!session?.accessToken) {
      report.conclusion = 'NO_SESSION — Necesitas hacer OAuth primero';
      report.oauth_url = `/api/auth/shopify?shop=${shop}`;
      return NextResponse.json(report, { status: 200 });
    }

    // 3. Probar una query mínima de GraphQL
    const client = new shopify.clients.Graphql({ session: session as Session });

    const TEST_QUERY = `
      query {
        orders(first: 5, query: "status:any AND created_at:>=2020-01-01") {
          edges {
            node { id name createdAt }
          }
          pageInfo { hasNextPage endCursor }
        }
        shop { name plan { displayName } }
      }
    `;

    const response = await client.request(TEST_QUERY);

    report.steps.push({
      step: 'graphql_test',
      errors: response.errors ?? null,
      shop_name: (response.data as any)?.shop?.name,
      plan: (response.data as any)?.shop?.plan?.displayName,
      orders_count: (response.data as any)?.orders?.edges?.length ?? 0,
      first_order: (response.data as any)?.orders?.edges?.[0]?.node ?? null,
      has_next_page: (response.data as any)?.orders?.pageInfo?.hasNextPage,
    });

    report.conclusion = response.errors ? 'GRAPHQL_ERROR' : 'OK — Sesión válida y API funcionando';

  } catch (err: any) {
    report.steps.push({ step: 'error', message: err.message, response: err.response?.body });
    report.conclusion = 'ERROR — ' + err.message;
  }

  return NextResponse.json(report, { status: 200 });
}
