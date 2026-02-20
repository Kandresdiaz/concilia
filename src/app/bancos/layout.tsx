import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Directorio de Bancos Soportados | ConciliAI",
    description: "Encuentra tutorials y herramientas personalizadas para conciliar extractos de los principales bancos de Colombia y el mundo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
