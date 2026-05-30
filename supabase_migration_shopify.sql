-- MIGRACIÓN: Agregar soporte completo para Shopify
-- Ejecutar en el SQL Editor de Supabase Dashboard

-- 1. Tabla de Sesiones de Shopify
CREATE TABLE IF NOT EXISTS public.shopify_sessions (
    id TEXT PRIMARY KEY,
    shop TEXT NOT NULL,
    state TEXT,
    is_online BOOLEAN DEFAULT false,
    scope TEXT,
    expires TIMESTAMPTZ,
    access_token TEXT NOT NULL,
    user_id TEXT,
    user_first_name TEXT,
    user_last_name TEXT,
    user_email TEXT,
    account_owner BOOLEAN DEFAULT false,
    locale TEXT,
    collaborator BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shopify_sessions_shop ON public.shopify_sessions(shop);

ALTER TABLE public.shopify_sessions ENABLE ROW LEVEL SECURITY;

-- Service role tiene acceso total (las sesiones se manejan server-side)
DROP POLICY IF EXISTS "service_role_all_shopify_sessions" ON public.shopify_sessions;
CREATE POLICY "service_role_all_shopify_sessions" ON public.shopify_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 2. Agregar columna shopify_shop a profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'shopify_shop'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN shopify_shop TEXT;
        CREATE INDEX idx_profiles_shopify_shop ON public.profiles(shopify_shop);
    END IF;
END $$;

-- 3. Trigger para updated_at en shopify_sessions
DROP TRIGGER IF EXISTS set_updated_at_shopify_sessions ON public.shopify_sessions;
CREATE TRIGGER set_updated_at_shopify_sessions
    BEFORE UPDATE ON public.shopify_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
