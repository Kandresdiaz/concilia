# 🚀 Guía Maestra para Publicar Apps Públicas en Shopify (2026)

Este documento contiene todos los errores, bloqueos y soluciones que enfrentamos al publicar **ConciliAI**, para que si haces otra app en el futuro, la subas en **1 día** sin sufrir los mismos problemas.

---

## 1. Webhooks Obligatorios de Cumplimiento (GDPR) - EL GRAN BLOQUEO 🔴
Shopify **eliminó de su página web** la opción para poner las URLs de privacidad (cuando un cliente pide borrar sus datos). Si no los configuras, la comprobación automática te pone una 'X' roja y no puedes enviar la app a revisión.

### ✅ La Solución: `shopify.app.toml`
1. En la raíz de tu proyecto, siempre debes crear este archivo (`shopify.app.toml`):
   ```toml
   client_id = "TU_CLIENT_ID_DE_SHOPIFY"
   application_url = "https://tu-app.vercel.app"
   embedded = true

   [build]
   automatically_update_urls_on_dev = true

   [access_scopes]
   scopes = "read_products,read_orders"

   [webhooks]
   api_version = "2024-07"

     [[webhooks.subscriptions]]
     compliance_topics = [ "customers/data_request", "customers/redact", "shop/redact" ]
     uri = "https://tu-app.vercel.app/api/webhooks/shopify"
   ```
2. Para que Shopify lo lea, debes abrir la terminal de VSCode y ejecutar:
   **`npx @shopify/cli@latest app deploy`**
   *(Dile que sí a todo, esto conectará tu código con el panel de Shopify y subirá los webhooks al instante).*

### ✅ Endpoint Seguro (HMAC)
El archivo que reciba ese webhook (`/api/webhooks/shopify/route.ts`) **DEBE validar la firma HMAC** y responder `200 OK` súper rápido, o la prueba de Shopify fallará:
```typescript
const rawBody = await req.text();
const hmac = req.headers.get("x-shopify-hmac-sha256");
const generatedHash = crypto.createHmac("sha256", process.env.SHOPIFY_API_SECRET)
                            .update(rawBody, "utf8").digest("base64");
if (generatedHash !== hmac) return new Response("Invalid", { status: 401 });
return new Response('OK', { status: 200 }); // Siempre responde 200 si la firma es correcta
```

---

## 2. Autenticación y Redirección del Iframe (Error de Pantalla en Blanco) ⚪
Cuando un cliente instala tu app, Shopify carga tu página dentro de un Iframe. Si la redirección falla, el cliente se sale de Shopify o ve una pantalla blanca.

### ✅ La Solución
- En tu archivo de autenticación (Ej. `/api/auth/callback/route.ts`), nunca redirigas a `https://tu-app.com`.
- **Siempre** debes redirigir de vuelta al panel de administración de Shopify usando el parámetro `host`:
  ```typescript
  const host = req.nextUrl.searchParams.get("host");
  const shopifyAdminUrl = `https://admin.shopify.com/store/${shopName}/apps/${process.env.SHOPIFY_API_KEY}`;
  return NextResponse.redirect(shopifyAdminUrl);
  ```

---

## 3. Pérdida de Sesión (Errores 401 y 500 Aleatorios) 🛡️
Si guardas la sesión solo en cookies, cuando Safari o Chrome bloqueen cookies de terceros en el iframe de Shopify, la app fallará diciendo "No valid session found".

### ✅ La Solución
1. Implementar un almacenamiento de sesión robusto en base de datos (Supabase, Postgres, etc.) extendiendo `SessionStorage` de la librería `@shopify/shopify-api`.
2. Si intentas hacer una petición a Shopify y te devuelve un **401 Unauthorized**, no lances un error 500. **Captura el error, borra la sesión defectuosa de tu base de datos y fuerza al usuario a re-autenticarse:**
   ```typescript
   if (error.response?.code === 401) {
     await SupabaseSessionStorage.deleteSession(sessionId);
     // Obligar a que pase por el OAuth de nuevo
   }
   ```

---

## 4. Permisos Estrictos de Datos (Errores 403 Forbidden) 🛑
Shopify es paranoico con la información de los clientes (Customer Data Protection).
Si pides el scope `read_all_orders` sin que un revisor de Shopify te lo apruebe antes, **cualquier petición REST a `/orders.json` te dará Error 403 (Prohibido).**

### ✅ La Solución: Usa GraphQL y pide solo lo necesario
No uses la API REST para las órdenes. Usa **GraphQL** y no consultes campos protegidos (como teléfonos o direcciones o incluso `financialStatus` si es complicado) a menos que tu app lo requiera estrictamente.
```graphql
const query = `
  query {
    orders(first: 50) {
      edges {
        node {
          id
          name
          createdAt
          totalPriceSet { presentmentMoney { amount currencyCode } }
        }
      }
    }
  }
`;
```

---

## 5. Cobros dentro de la App (Shopify Billing API) 💳
Si vas a cobrar mensualidades a los usuarios que instalen tu app, **NO PUEDES USAR LEMON SQUEEZY O STRIPE DIRECTAMENTE DENTRO DE SHOPIFY**. Te rechazarán la app en el acto porque Shopify exige cobrar su 0% - 15% de comisión mediante su plataforma nativa.

### ✅ La Solución
1. Configura tus planes en el archivo principal (Ej. `shopify.ts`):
   ```typescript
   billing: {
     'Mínimo': { amount: 24.99, interval: BillingInterval.Every30Days, currencyCode: 'USD' }
   }
   ```
2. Crea un endpoint en tu backend que solicite el pago:
   ```typescript
   const confirmationUrl = await shopify.billing.request({
       session,
       plan: 'Mínimo',
       isTest: true, // IMPORTANTÍSIMO DEJARLO EN TRUE PARA QUE LOS CENSOS LO PRUEBEN
   });
   return NextResponse.json({ url: confirmationUrl });
   ```
3. En el frontend, haz un `window.top.location.href = data.url` para que el iframe salte a la pantalla de confirmación oficial de cobro de Shopify.

---

## 💡 El Secreto de la "Comprobación de Aplicaciones Incrustadas"
En tu última captura verás la sección *"Comprobaciones de las aplicaciones incrustadas"*.
Esta prueba se hace automáticamente cada 2 horas por los bots de Shopify. ¿Cómo la pasas a Verde?
**Simplemente abre tu aplicación publicada (ConciliAI) desde el panel de administrador de tu tienda de desarrollo y navega un par de clics.** El script `App Bridge` de Shopify en tu frontend emitirá señales al bot de que "sí, esta app sabe cargar dentro de un Iframe usando Session Tokens". En un par de horas, ese paso se pondrá en Verde ✅ solo por usarla un rato.
