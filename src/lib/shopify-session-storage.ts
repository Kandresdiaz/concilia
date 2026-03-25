import { Session } from "@shopify/shopify-api";
import { createClient } from "./supabase/server";

export const SupabaseSessionStorage = {
  storeSession: async (session: Session): Promise<boolean> => {
    const supabase = await createClient(true);
    const { error } = await supabase
      .from("shopify_sessions")
      .upsert({
        id: session.id,
        shop: session.shop,
        state: session.state,
        is_online: session.isOnline,
        scope: session.scope,
        expires: session.expires ? session.expires.toISOString() : null,
        access_token: session.accessToken,
        user_id: session.onlineAccessInfo?.associated_user?.id || null,
        user_first_name: session.onlineAccessInfo?.associated_user?.first_name || null,
        user_last_name: session.onlineAccessInfo?.associated_user?.last_name || null,
        user_email: session.onlineAccessInfo?.associated_user?.email || null,
        account_owner: session.onlineAccessInfo?.associated_user?.account_owner || null,
        locale: session.onlineAccessInfo?.associated_user?.locale || null,
        collaborator: session.onlineAccessInfo?.associated_user?.collaborator || null,
      });

    if (error) {
      console.error("CRITICAL: Error storing Shopify session in Supabase:", {
        error,
        sessionId: session.id,
        shop: session.shop,
        hasAccessToken: !!session.accessToken
      });
      return false;
    }
    console.log("SUCCESS: Stored Shopify session:", session.id);
    return true;
  },

  loadSession: async (id: string): Promise<Session | undefined> => {
    const supabase = await createClient(true);
    const { data, error } = await supabase
      .from("shopify_sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error loading Shopify session:", error);
      return undefined;
    }
    
    if (!data) {
      console.warn("No session found in DB for ID:", id);
      return undefined;
    }

    const session = new Session({
      id: data.id,
      shop: data.shop,
      state: data.state,
      isOnline: data.is_online,
      scope: data.scope,
      expires: data.expires ? new Date(data.expires) : undefined,
      accessToken: data.access_token,
    });

    return session;
  },

  deleteSession: async (id: string): Promise<boolean> => {
    const supabase = await createClient(true);
    const { error } = await supabase
      .from("shopify_sessions")
      .delete()
      .eq("id", id);

    return !error;
  },

  deleteSessions: async (ids: string[]): Promise<boolean> => {
    const supabase = await createClient(true);
    const { error } = await supabase
      .from("shopify_sessions")
      .delete()
      .in("id", ids);

    return !error;
  },

  findSessionsByShop: async (shop: string): Promise<Session[]> => {
    const supabase = await createClient(true);
    const { data, error } = await supabase
      .from("shopify_sessions")
      .select("*")
      .eq("shop", shop);

    if (error || !data) return [];

    return data.map(
      (s) =>
        new Session({
          id: s.id,
          shop: s.shop,
          state: s.state,
          isOnline: s.is_online,
          scope: s.scope,
          expires: s.expires ? new Date(s.expires) : undefined,
          accessToken: s.access_token,
        })
    );
  },
};
