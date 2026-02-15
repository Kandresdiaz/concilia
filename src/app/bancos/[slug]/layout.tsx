import { Metadata } from "next";

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const bankName = params.slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return {
        title: `Cómo Conciliar Extractos de ${bankName} con IA | ConciliAI`,
        description: `Descubre cómo automatizar la conciliación bancaria de ${bankName}. Usa IA para convertir PDF a Excel y auditar tus movimientos en segundos. Precisión del 99.9%.`,
        keywords: [`conciliar ${bankName}`, `extractos ${bankName} excel`, `auditoria ${bankName} ia`, `contabilidad ${bankName}`],
    };
}

export default function BankLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
