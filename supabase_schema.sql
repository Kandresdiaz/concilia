-- ============================================
-- CONCILIIA - ESQUEMA DE BASE DE DATOS SEGURO
-- ============================================
-- Diseñado con seguridad y privacidad como prioridad.
-- Todos los datos están protegidos con RLS (Row Level Security).

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabla de Perfiles (Extensión de Auth.Users)
-- Cada usuario tiene un perfil vinculado a su cuenta de autenticación
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'ENTERPRISE', 'LIFETIME')),
    usage_count INTEGER DEFAULT 0,
    reconciliations_count INTEGER DEFAULT 0,
    stripe_customer_id TEXT,
    ls_customer_id TEXT,
    ls_order_id TEXT,
    last_reconciliation_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Conciliaciones (Organizada por Mes/Año)
-- Cada conciliación está asociada a un usuario y un período específico
CREATE TABLE public.conciliations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Organización temporal
    company_name TEXT NOT NULL,
    month INTEGER CHECK (month >= 1 AND month <= 12),
    year INTEGER CHECK (year >= 2020 AND year <= 2100),
    month_year TEXT GENERATED ALWAYS AS (year || '-' || LPAD(month::TEXT, 2, '0')) STORED,
    
    -- Resultados de la conciliación
    precision_score NUMERIC CHECK (precision_score >= 0 AND precision_score <= 100),
    final_balance NUMERIC DEFAULT 0,
    
    -- Datos financieros (JSONB encriptado en reposo por Supabase)
    bank_data JSONB,
    book_data JSONB,
    matches JSONB,
    discrepancies JSONB,
    
    -- Balances
    initial_bank_balance NUMERIC DEFAULT 0,
    initial_ledger_balance NUMERIC DEFAULT 0,
    final_bank_balance NUMERIC DEFAULT 0,
    final_ledger_balance NUMERIC DEFAULT 0,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint para evitar duplicados del mismo mes
    UNIQUE(user_id, company_name, year, month)
);

-- 4. Índices para rendimiento y búsqueda rápida
CREATE INDEX idx_conciliations_user_id ON public.conciliations(user_id);
CREATE INDEX idx_conciliations_month_year ON public.conciliations(user_id, year DESC, month DESC);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- 5. Habilitar RLS (Row Level Security) - CRÍTICO PARA PRIVACIDAD
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conciliations ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Seguridad Estrictas
-- PERFILES: Solo el propietario puede ver/editar su perfil
CREATE POLICY "usuarios_leen_su_perfil" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "usuarios_actualizan_su_perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- CONCILIACIONES: Solo el propietario puede ver, insertar o actualizar sus conciliaciones
CREATE POLICY "usuarios_leen_sus_conciliaciones" ON public.conciliations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "usuarios_insertan_sus_conciliaciones" ON public.conciliations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios_actualizan_sus_conciliaciones" ON public.conciliations
    FOR UPDATE USING (auth.uid() = user_id);

-- PROHIBIR eliminación (opcional - descomentar si quieres historial permanente)
-- CREATE POLICY "prohibir_eliminacion" ON public.conciliations
--     FOR DELETE USING (false);

-- 7. Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Triggers de auditoría
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_conciliations
    BEFORE UPDATE ON public.conciliations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- POLÍTICA DE PRIVACIDAD Y SEGURIDAD
-- ============================================
-- COMMENT ON TABLE public.conciliations IS 
-- 'Datos financieros de usuarios. NUNCA compartidos, vendidos o usados para entrenar IA.
-- Protegidos con RLS. Encriptados en reposo. Cumple con estándares de privacidad financiera.';
