---
name: ConciliAI Architecture & Blueprint
description: The definitive technical manual for ConciliAI (Marc Lou Stack). Use this validation for all future changes.
---

# 📑 BLUEPRINT TÉCNICO: CONCILIAI (Stack Marc Lou)

**Rol:** Senior Full Stack Developer.
**Filosofía:** Minimalismo, Velocidad, Conversión.

## 🛠 1. Stack Tecnológico (Estricto)

*   **Framework:** Next.js (App Router) + TypeScript.
*   **Estilos:** Tailwind CSS + DaisyUI (Temas: Light/Dark).
*   **Base de Datos y Auth:** Supabase (PostgreSQL).
*   **Procesamiento IA:** Groq SDK (Modelo: `llama3-70b-8192`).
*   **Pagos:** Stripe (Checkout + Webhooks).
*   **Hosting:** Vercel.

---

## 🔄 2. Flujo Lógico de la Aplicación

### Paso A: Autenticación y Perfilado
1.  **Login:** Google OAuth vía Supabase.
2.  **Trigger SQL:** `public.profiles` (`tier = 'FREE'`, `usage_count = 0`) al crear usuario.

### Paso B: El Motor de Conciliación (Frontend -> Edge Function)
1.  **Input:** Texto o Archivo -> Texto.
2.  **Saldo Inicial:**
    *   **PRO:** Automático (último `final_balance` de DB).
    *   **FREE:** 0 o Manual.
3.  **IA (Groq):** `/api/reconcile`. Prompt System: JSON estricto (`transactions`, `total_in`, `total_out`, `final_calculated_balance`).
4.  **Validación Seguridad:** Recálculo de totales en JS (Client-side) para verificar IA.

### Paso C: Persistencia Selectiva (Business Logic)
1.  **Tier === 'FREE':**
    *   Estado React (`useState`).
    *   Incrementar `usage_count`.
    *   **Paywall:** Si `usage_count >= 5` -> Bloqueo + Stripe Modal.
2.  **Tier === 'PRO':**
    *   Guardar JSON en `conciliations` (DB).
    *   Acceso a "Historial".

### Paso D: UI/UX de Alta Conversión
1.  **Dashboard:** Barra de progreso (Usos restantes).
2.  **Historial "Blur":** Filas difuminadas para FREE + CTA "Upgrade".
3.  **Feedback:** Loading messages ("Entrenando duendes...").

---

## 🗄 3. Base de Datos (Schema)

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  tier TEXT DEFAULT 'FREE',
  usage_count INTEGER DEFAULT 0,
  stripe_customer_id TEXT
);

CREATE TABLE conciliations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  data JSONB,
  final_balance NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conciliations ENABLE ROW LEVEL SECURITY;
```

## 🛑 4. Reglas Críticas

1.  **Todo a Supabase:** Nada local.
2.  **Keys:** Siempre `process.env`.
3.  **Eficiencia:** Cálculos matemáticos simples en Cliente (ahorra tokens).
4.  **Estilo:** Código limpio, modular, "boilerplate".
