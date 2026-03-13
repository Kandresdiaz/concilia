"use client";

import { createClient } from "./supabase/client";

interface LogOptions {
  authenticated?: boolean;
  [key: string]: any;
}

/**
 * Sistema de Tracking Maestro para ConciliAI.
 * Registra eventos en console para desarrollo y 
 * guarda los datos en Supabase para analítica real.
 */
export const logEvent = async (eventName: string, options: LogOptions = {}) => {
  const timestamp = new Date().toISOString();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  
  // 1. Visibilidad en Consola (Desarrollo)
  console.log(
    `%c[TRACKING] %c${eventName} %c@ ${timestamp}`,
    "color: #6366f1; font-weight: bold;",
    "color: #1e293b; font-weight: bold;",
    "color: #94a3b8; font-size: 10px;"
  );
  
  if (Object.keys(options).length > 0) {
    console.table({ event: eventName, path, ...options });
  }

  // 2. Persistencia en Supabase (Analítica)
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("analytics_events").insert({
      event_name: eventName,
      path: path,
      user_id: user?.id || null,
      metadata: options
    });

    if (error) console.error("[TRACKING-ERROR] Error saving to Supabase:", error.message);
  } catch (err) {
    console.error("[TRACKING-ERROR] Critical fail:", err);
  }
};

/**
 * Hooks para tracking de clics específicos.
 */
export const trackClick = (elementName: string, context: string) => {
  logEvent("interaction_click", { element: elementName, context });
};
