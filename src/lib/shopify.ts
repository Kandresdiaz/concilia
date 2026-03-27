import '@shopify/shopify-api/adapters/web-api';
import { shopifyApi, LATEST_API_VERSION, LogSeverity } from "@shopify/shopify-api";
import { SupabaseSessionStorage } from "./shopify-session-storage";

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes: ["read_products", "read_orders", "read_all_orders", "write_products"],
  hostName: (process.env.HOST || process.env.VERCEL_URL || "conciliai.com").replace(/https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  logger: {
    level: LogSeverity.Info,
  },
  sessionStorage: SupabaseSessionStorage as any, 
});
