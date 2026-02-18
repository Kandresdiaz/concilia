import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Validador de NIT y Dígito de Verificación (DIAN) | ConciliAI",
    description: "Calcula y valida el dígito de verificación (DV) de cualquier NIT en Colombia de forma gratuita.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
