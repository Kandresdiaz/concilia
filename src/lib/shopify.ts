import '@shopify/shopify-api/adapters/web-api';
import { shopifyApi, LATEST_API_VERSION, LogSeverity, BillingInterval, BillingReplacementBehavior } from "@shopify/shopify-api";
import { SupabaseSessionStorage } from "./shopify-session-storage";

// Durante el build de Next.js, estas variables pueden no estar disponibles.
// Usamos valores dummy para evitar que el build falle por validaciones de la librería de Shopify.
const apiKey = process.env.SHOPIFY_API_KEY || "BUILD_TIME_KEY";
const apiSecretKey = process.env.SHOPIFY_API_SECRET || "BUILD_TIME_SECRET";

export const shopify = shopifyApi({
  apiKey,
  apiSecretKey,
  scopes: ["read_orders", "read_all_orders", "read_products", "write_products"],
  hostName: (process.env.HOST || process.env.VERCEL_URL || "conciliai.com").replace(/https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  logger: {
    level: LogSeverity.Info,
  },
  sessionStorage: SupabaseSessionStorage as any, 
  billing: {
    'PRO': {
      amount: 24.99,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
      replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
    },
    'ENTERPRISE': {
      amount: 197.00,
      currencyCode: 'USD',
      interval: BillingInterval.OneTime,
    }
  }
});
