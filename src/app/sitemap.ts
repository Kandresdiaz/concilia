import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://concilia.ai"; // Reemplazar con tu dominio real

    // Bancos populares para generar rutas de SEO Programático
    const banks = [
        "bancolombia",
        "davivienda",
        "banco-de-bogota",
        "bbva",
        "santander",
        "itau",
        "scotiabank",
        "nu-mexico",
        "banco-estado",
        "bcp-peru"
    ];

    const bankUrls = banks.map((bank) => ({
        url: `${baseUrl}/bancos/${bank}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/convertidor-gratis`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...bankUrls,
    ];
}
