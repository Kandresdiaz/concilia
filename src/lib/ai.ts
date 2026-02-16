import Groq from 'groq-sdk';

/**
 * Servicio unificado de IA con Failover Inteligente.
 * Intenta usar Groq por su velocidad y economía, pero si falla
 * (Rate Limit 429 o Downtime), salta a OpenRouter para asegurar el servicio.
 */
export async function generateAICompletion(messages: any[], imageBase64?: string) {
    const groqEnabled = !!process.env.GROQ_API_KEY;
    const openRouterEnabled = !!process.env.OPENROUTER_API_KEY;

    // 1. Elegir modelos según si hay imagen (Vision) o solo texto
    const groqModels = imageBase64
        ? ["llama-3.2-90b-vision-preview", "llama-3.2-11b-vision-preview"]
        : ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

    const openRouterModels = imageBase64
        ? ["google/gemini-pro-1.5-exp", "anthropic/claude-3-haiku"]
        : ["meta-llama/llama-3.3-70b-instruct", "google/gemini-flash-1.5"];

    // --- FASE 1: Intento con GROQ (Favorito por costo/velocidad) ---
    if (groqEnabled) {
        const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

        for (const model of groqModels) {
            try {
                console.log(`[AI-Handler] Intentando con Groq Model: ${model}`);
                const completion = await groqClient.chat.completions.create({
                    messages,
                    model,
                    response_format: { type: "json_object" },
                });
                if (completion.choices[0]?.message?.content) {
                    return { content: completion.choices[0].message.content, provider: 'groq', model };
                }
            } catch (err: any) {
                console.warn(`[AI-Handler] Groq falló (${model}): ${err.status || err.message}`);
                if (err.status === 429) continue; // Rate limit, intentar siguiente
                if (err.status >= 500) continue; // Error de servidor, intentar siguiente
                break; // Errores fatales (401, etc) rompen el ciclo
            }
        }
    }

    // --- FASE 2: Intento con OPENROUTER (Respaldo Robusto) ---
    if (openRouterEnabled) {
        console.log(`[AI-Handler] ⚠️ Activando Failover a OpenRouter...`);

        for (const model of openRouterModels) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://concilia.ai",
                        "X-Title": "ConciliAI",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                        response_format: { type: "json_object" }
                    })
                });

                const data = await response.json();
                if (data.choices?.[0]?.message?.content) {
                    return { content: data.choices[0].message.content, provider: 'openrouter', model };
                }
            } catch (err: any) {
                console.error(`[AI-Handler] OpenRouter falló (${model}):`, err.message);
                continue;
            }
        }
    }

    throw new Error("Agotados todos los proveedores de IA. Por favor, intenta en unos minutos.");
}
