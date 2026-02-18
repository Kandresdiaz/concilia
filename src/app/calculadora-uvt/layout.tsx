import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Calculadora UVT 2025/2026 Gratis | ConciliAI",
    description: "Calcula el valor de la UVT en pesos colombianos para los años 2024, 2025 y 2026 al instante.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
