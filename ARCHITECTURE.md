# ConciliAI — Documentación Técnica Completa

## 🎯 ¿Qué Hace la App?

ConciliAI es un **SaaS de conciliación financiera** que automatiza el proceso contable de comparar extractos bancarios con libros auxiliares contables. Tradicionalmente, un contador hace esto manualmente en Excel durante horas. ConciliAI lo hace en **segundos** usando IA.

---

## 🔄 Flujo Completo de Principio a Fin

### PASO 1: Landing Page (`/`)
El usuario llega a la Landing Page y ve la propuesta de valor. Hace clic en "Empezar Ahora".

### PASO 2: Autenticación Adaptativa (`/login`)

ConciliAI detecta el contexto del usuario para ofrecer la fricción mínima:

*   **Usuario Web Estándar**:
    - Se autentica con **Google OAuth** vía Supabase Auth.
    - Supabase crea automáticamente un perfil en `profiles` (tier: FREE, usage: 0) vía trigger SQL.
*   **Usuario Shopify (App Embebida)**:
    - **Silent Auth**: Se detecta `?shop=` en la URL.
    - El `middleware.ts` permite el bypass de Supabase Auth temporalmente.
    - La app llama a `/api/auth/shopify/signin` que genera un **Magic Link administrador** silencioso.
    - El usuario entra al dashboard **sin ver Google** ni formularios de login. ✅

### PASO 3: Modal de Privacidad (primera vez)
- Aparece un modal explicando que Groq no entrena con sus datos, encriptación, y zero compartición.
- Se guarda en `localStorage` que ya lo vio.

### PASO 4: Dashboard (`/dashboard`)
El usuario ve el panel principal con:
- Banner de seguridad
- Tarjetas de resumen (Saldo Banco, Saldo Libros, Diferencia Neta)
- Botón "Importar Documentos" para iniciar una conciliación

### PASO 5: Importar Documento (Modal)
El usuario selecciona:
1. **Tipo**: Extracto Bancario o Auxiliar Contable
2. **País**: Colombia, México, Chile, Perú, Argentina (afecta formato de números)
3. **Fuente del documento**:
   - **Shopify Direct Sync (CÓDIGO)**: Extracción directa vía API REST de Shopify (`/api/shopify/orders`). **Costo: 0 Tokens**.
   - **Archivo PDF**: Se extrae texto con `pdfjs-dist` y se procesa con IA.
   - **Imagen** (JPG/PNG): Visión artificial (IA).
   - **Texto copiado**: Procesamiento de lenguaje natural (IA).

### PASO 6: 🤖 AQUÍ ENTRA LA IA (API `/api/reconcile`)

Este es el corazón de la aplicación. Funciona así:

#### 6.1 — Verificación de Seguridad
```
Usuario autenticado? → NO → Error 401
Plan FREE y >= 5 usos? → SÍ → Error 402 (Paywall)
```

#### 6.2 — Envío a Groq Cloud
El documento se envía a la API de **Groq** (infraestructura de IA ultrarrápida basada en LPU).

**Modelos utilizados (con fallback automático):**

| Tipo de documento | Modelo principal | Fallbacks |
|---|---|---|
| **Imagen** (visión) | `llama-3.2-90b-vision-preview` | `llama-3.2-11b-vision-preview` |
| **Texto** (PDF/copiado) | `llama-3.3-70b-versatile` | `gpt-oss-120b` → `gpt-oss-20b` → `llama-3.1-8b-instant` |

Si un modelo devuelve error 429 (rate limit) o 503 (saturado), automáticamente intenta el siguiente.

#### 6.3 — Prompt de la IA (System Prompt)
La IA recibe instrucciones de **experto contable LATAM**:
- Normalizar formatos numéricos (punto vs coma decimal según país)
- Detectar banco y tipo de documento
- Aplicar reglas de signos:
  - Extracto Bancario: Abono (+), Cargo (-)
  - Auxiliar Contable: Débito (+), Crédito (-)
- Extraer: saldo_inicial, total_abonos, total_cargos, saldo_actual
- Extraer cada transacción: fecha, descripción limpia, monto con signo, referencia
- **PROHIBIDO** incluir "Saldo Inicial" o "Saldo Anterior" como transacción

**Respuesta esperada (JSON):**
```json
{
  "banco": "Bancolombia",
  "tipo_documento": "Extracto Bancario",
  "empresa": "Empresa XYZ",
  "summary": {
    "saldo_inicial": 1500000,
    "total_abonos": 5000000,
    "total_cargos": 3000000,
    "saldo_actual": 3500000
  },
  "precision_score": 99.5,
  "transactions": [
    {"date": "2026-01-15", "description": "Transferencia Nequi", "amount": 150000, "reference": "REF123"}
  ]
}
```

#### 6.4 — Filtro Anti-Alucinación (código, no IA)
Después de que la IA responde, el código aplica filtros:
1. **Excluir transacciones fantasma**: Si la descripción contiene "saldo", "anterior", "balance inicial", "apertura" → se elimina
2. **Excluir heurística**: Si el monto es idéntico al saldo inicial y la descripción es genérica → se elimina
3. **Normalizar montos**: Convertir strings a float limpios

#### 6.5 — Verificación Matemática (código, no IA)
El código calcula independientemente:
```
total_in  = suma de transacciones positivas
total_out = suma de transacciones negativas (valor absoluto)
calculated_net = total_in - total_out
```

Luego compara con lo que reportó la IA:
```
|total_in - summary.total_abonos| < 0.05  →  ✅
|total_out - summary.total_cargos| < 0.05 →  ✅
```

Si ambas condiciones se cumplen → `is_verified: true`, `precision_score: 100%`

### PASO 7: Algoritmo de Cruce Maestro (Frontend)
Una vez que el usuario importa **ambos documentos** (banco + libros), el algoritmo cruza transacciones en **3 fases**:

| Fase | Criterio | Tipo de Match |
|------|----------|---------------|
| **1. Exacto** | Mismo monto + misma referencia limpia | `perfecto` ✅ |
| **2. Fecha** | Mismo monto + fecha dentro de ±7 días | `fecha` 🟡 |
| **3. Monto** | Solo mismo monto (fallback) | `monto` 🟠 |

**Resultado:**
- `matches[]` → Transacciones que cuadran
- `pendingBank[]` → Transacciones del banco sin par en libros
- `pendingBook[]` → Transacciones de libros sin par en banco

### PASO 8: Visualización de Resultados
El Dashboard muestra:
- **Resumen**: Saldo Banco vs Saldo Libros y Diferencia Neta
- **Matches**: Tabla con transacciones cruzadas y tipo de match
- **Pendientes**: Transacciones sin cruzar (las discrepancias)
- **Precisión**: Badge de score (95%+ verde, <95% ámbar)

### PASO 9: Guardar Conciliación  
Al hacer clic en "Guardar":
- Se almacena en Supabase: `bank_data`, `book_data`, `matches`, `discrepancies`
- Organizado por `month` y `year`
- Se incrementa `usage_count` en el perfil
- Protegido por RLS (solo el dueño puede acceder)

### PASO 10: Exportación e Integración (NUEVO)
Al finalizar la conciliación, el usuario puede exportar los resultados:
1. **Acta de Auditoría PDF**: Un reporte formal con firmas para archivo físico o digital.
2. **Exportación a Software Contable (Intuitive Export)**:
   - **Buscador Visual**: Selección por banderas (🇨🇴, 🇲🇽, 🇨🇱, 🇺🇸).
   - **Formatos específicos**: CSV/Excel formateado para **Siigo, CONTPAQi, QuickBooks, Softland, Helisa**, etc.
   - **Ahorro de tiempo**: Los archivos están listos para "Importar comprobante" en el software de destino.

### PASO 11: Historial (`/dashboard` → vista Historial)
El usuario ve todas sus conciliaciones pasadas organizadas por empresa y período (mes/año).

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| **Frontend** | Next.js 16 + React 19 + TypeScript | App Router, SSR, API Routes |
| **Estilos** | Tailwind CSS 4 + DaisyUI 5 | UI premium, componentes |
| **IA** | Groq Cloud (LLaMA 3.2/3.3) | Extracción de datos financieros |
| **Auth** | Supabase Auth (Google OAuth) | Autenticación segura |
| **Base de datos** | Supabase (PostgreSQL 17) | Almacenamiento con RLS |
| **Pagos** | Stripe (Checkout + Webhooks) | Suscripciones PRO |
| **PDF** | pdfjs-dist | Extracción de texto de PDFs |
| **Exportación** | jsPDF + jsPDF-AutoTable + Custom Exporters | Generar actas PDF y CSV por software |
| **Validación** | Zod | Validación de schemas |
| **Deploy** | Vercel | Hosting serverless |

---

## ☁️ Compatibilidad con Vercel

La app está **100% diseñada para Vercel**:

### ✅ Lo que funciona en Vercel sin cambios:
- **API Routes** (`/api/reconcile`, `/api/stripe/*`) → Vercel Serverless Functions
- **Auth Callback** (`/auth/callback`) → Redirect handler
- **Middleware** (`middleware.ts`) → Edge Middleware de Vercel
- **Static Pages** (`/`, `/login`) → Pre-renderizadas en build
- **Dynamic Pages** (`/dashboard`) → Client-side rendering

### ⚙️ Variables de Entorno para Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GROQ_API_KEY=gsk_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

---

## 🚀 Cómo Escalar

### Escalar la IA:
- **Groq** escala automáticamente (API cloud, sin servidores propios)
- Los fallback models garantizan 99.9% uptime
- Para más capacidad: agregar más modelos al array de fallbacks
- Para documentos más complejos: subir a modelos más grandes (GPT-4o, Claude)

### Escalar la Base de Datos:
- **Supabase** escala verticalmente (upgrade de plan)
- Los índices ya están optimizados para búsqueda por `user_id + year + month`
- RLS garantiza aislamiento total entre usuarios

### Escalar el Frontend:
- **Vercel** escala automáticamente (Edge Network global)
- Las Serverless Functions se auto-escalan con la demanda
- Puedes añadir caché con `revalidate` para páginas estáticas

### Funcionalidades Futuras Compatibles:
1. **Gmail integration** → Leer extractos del correo (ya hay placeholder en UI)
2. **Multi-empresa** → El schema ya soporta `company_name` por conciliación
3. **Exportación avanzada** → Ya existe `jsPDF` para generar actas
4. **Dashboard analytics** → Supabase soporta queries complejos
5. **API pública** → Las API Routes de Next.js ya son REST endpoints
6. **Webhook Stripe** → Ya implementado para upgrades automáticos

---

## 📊 Diagrama de Flujo de Datos

```
[Usuario] 
    → [Landing Page /]
    → [Login /login] 
        ↳ Web: [Google OAuth]
        ↳ Shopify: [Silent Auth /api/auth/shopify/signin]
    → [Dashboard /dashboard]
        → [Import Modal]
            → [Shopify Sync] → API Shopify (CÓDIGO: $0 tokens)
            → [PDF/Imagen] → IA (COSTO: tokens)
        → [API /api/reconcile]
            → [Supabase Auth Check]
            → [Paywall Check] (Límite: 3 Trial)
            → [Groq Cloud] → LLaMA 3.2/3.3
            → [Anti-Hallucination Filter]
            → [Math Verification]
        → [Algoritmo de Cruce] (frontend)
            → Fase 1: Match Exacto
            → Fase 2: Match por Fecha
            → Fase 3: Match por Monto
        → [Resultados en UI]
        → [Guardar] → [Supabase DB] (con RLS)
        → [Exportar PDF] → jsPDF
```
