import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convertidor de Extractos Bancarios a Excel IA | ConciliAI",
    description: "Extrae tablas de tus extractos bancarios PDF directamente a Excel con precisión del 99.9%. Olvida la digitación manual.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
