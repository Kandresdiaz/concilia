import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Calculadora de Ahorro para Contadores | ConciliAI",
    description: "¿Cuánto tiempo pierdes conciliando manualmente? Calcula tu ROI al automatizar con Inteligencia Artificial.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
