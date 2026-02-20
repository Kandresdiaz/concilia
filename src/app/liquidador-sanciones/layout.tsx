import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Liquidador de Sanción por Extemporaneidad DIAN 2025 | ConciliAI",
    description: "Calcula gratis y al instante la sanción por presentar tarde tus declaraciones de impuestos en Colombia. Basado en el Art. 641 del Estatuto Tributario.",
    keywords: ["sancion extemporaneidad dian", "liquidador sanciones 2025", "calculo multa declaración renta", "estatuto tributario articulo 641"],
};

export default function SancionesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
