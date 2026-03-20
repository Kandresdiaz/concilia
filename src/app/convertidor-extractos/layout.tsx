import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convertidor de Extractos Bancarios PDF a Excel Gratis | ConciliAI",
    description: "La forma más rápida para contadores de extraer tablas de extractos bancarios PDF (Bancolombia, BBVA, etc) directamente a Excel en 3 segundos. Sin registro inicial.",
    keywords: ["convertir pdf a excel", "extractos bancarios excel", "bancolombia pdf a excel", "bbva pdf a excel", "software para contadores colombia", "extraer tablas pdf"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
