-- 1. Habilitar la extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Perfiles (Extensión de Auth.Users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'ENTERPRISE', 'LIFETIME')),
    usage_count INTEGER DEFAULT 0,
    reconciliations_count INTEGER DEFAULT 0,
    stripe_customer_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Conciliaciones
CREATE TABLE public.conciliations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT,
    month_year TEXT,
    precision_score NUMERIC,
    final_balance NUMERIC DEFAULT 0,
    data JSONB, -- Contiene todo el detalle de transacciones y resumen
    created_at TIMESTAMPTZ DEFAULT NOW(),
    initial_bank_balance NUMERIC DEFAULT 0,
    initial_ledger_balance NUMERIC DEFAULT 0,
    final_bank_balance NUMERIC DEFAULT 0,
    final_ledger_balance NUMERIC DEFAULT 0
);

-- 4. Habilitar RLS (Seguridad por Fila)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conciliations ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Seguridad (Solo el dueño puede ver/editar)
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden ver sus propias conciliaciones" ON public.conciliations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propias conciliaciones" ON public.conciliations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Trigger para crear perfil automáticamente al registrarse
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
