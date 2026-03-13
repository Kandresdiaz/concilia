"use client";

interface LogOptions {
  authenticated?: boolean;
  [key: string]: any;
}

/**
 * Sistema de Tracking Maestro para ConciliAI.
 * Registra eventos en console para desarrollo y 
 * permite expansión a Mixpanel/PostHog fácilmente.
 */
export const logEvent = (eventName: string, options: LogOptions = {}) => {
  const timestamp = new Date().toISOString();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  
  // En desarrollo, imprimimos con estilo para visibilidad
  console.log(
    `%c[TRACKING] %c${eventName} %c@ ${timestamp}`,
    "color: #6366f1; font-weight: bold;",
    "color: #1e293b; font-weight: bold;",
    "color: #94a3b8; font-size: 10px;"
  );
  
  if (Object.keys(options).length > 0) {
    console.table({ event: eventName, path, ...options });
  }

  // Aquí se integrarían SDKs como GA4, Mixpanel o PostHog
  // window.gtag?.('event', eventName, options);
};

/**
 * Hooks para tracking de clics específicos.
 */
export const trackClick = (elementName: string, context: string) => {
  logEvent("interaction_click", { element: elementName, context });
};
