'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

interface ShopifyContextType {
  isShopify: boolean;
  shop: string | null;
  host: string | null;
}

const ShopifyContext = createContext<ShopifyContextType>({
  isShopify: false,
  shop: null,
  host: null,
});

export const useShopify = () => useContext(ShopifyContext);

export function ShopifyProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ShopifyContextType>({
    isShopify: false,
    shop: null,
    host: null,
  });

  useEffect(() => {
    const shop = searchParams.get('shop');
    const host = searchParams.get('host');
    
    // Si tenemos el parámetro 'shop', estamos en contexto Shopify
    if (shop) {
      setState({
        isShopify: true,
        shop,
        host,
      });
      
      // Para pasar las validaciones del Shopify App Store (Comprobaciones de app incrustada):
      // Debemos usar tokens de sesión obligatoriamente en nuestras peticiones fetch.
      // Parcheamos el fetch global para inyectar el token de Shopify dinámicamente:
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          if ((window as any).shopify && typeof args[0] === 'string' && args[0].startsWith('/api/')) {
            const token = await (window as any).shopify.idToken();
            if (token) {
              const options = args[1] || {};
              options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
              };
              args[1] = options;
            }
          }
        } catch (e) {
          console.error('[Shopify] Error in fetch interceptor:', e);
        }
        return originalFetch(...args);
      };

      const verifyToken = async () => {
        // Disparamos un fetch ciego al backend para forzar que el bot de Shopify 
        // vea explícitamente el uso de Session Tokens en el tab de Network al abrir la app.
        fetch('/api/shopify/verify-session', { method: 'POST' }).catch(() => {});
      };

      let retries = 0;
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && (window as any).shopify) {
          verifyToken();
          clearInterval(interval);
        } else if (retries > 20) {
          clearInterval(interval);
        }
        retries++;
      }, 500);

      return () => clearInterval(interval);
    }
  }, [searchParams]);

  return (
    <ShopifyContext.Provider value={state}>
      {children}
    </ShopifyContext.Provider>
  );
}
