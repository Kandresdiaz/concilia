import '@shopify/shopify-api/adapters/web-api';
import { shopifyApi, LATEST_API_VERSION, LogSeverity } from "@shopify/shopify-api";
import { SupabaseSessionStorage } from "./shopify-session-storage";

// Durante el build de Next.js, estas variables pueden no estar disponibles.
// Usamos valores dummy para evitar que el build falle por validaciones de la librería de Shopify.
const apiKey = process.env.SHOPIFY_API_KEY || "BUILD_TIME_KEY";
const apiSecretKey = process.env.SHOPIFY_API_SECRET || "BUILD_TIME_SECRET";

export const shopify = shopifyApi({
  apiKey,
  apiSecretKey,
  scopes: ["read_products", "read_orders"],
  hostName: (process.env.HOST || process.env.VERCEL_URL || "conciliai.com").replace(/https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  logger: {
    level: LogSeverity.Info,
  },
  sessionStorage: SupabaseSessionStorage as any, 
});
