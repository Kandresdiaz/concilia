import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convertidor de PDF Bancario a Excel GRATIS | ConciliAI",
    description: "Pasa tus extractos bancarios de PDF a Excel o CSV en segundos. Sin registros, 100% seguro y optimizado con IA para bancos de Latinoamérica.",
    keywords: ["convertir pdf a excel", "extracto bancario a excel", "pdf bancario a csv gratis", "bancolombia pdf a excel", "contabilidad automatica"],
};

export default function FreeConverterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
