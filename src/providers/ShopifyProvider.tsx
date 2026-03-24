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
      
      // Aquí también podríamos inyectar el script de App Bridge dinámicamente si fuera necesario
      // Pero @shopify/app-bridge-react lo maneja mejor con su Provider
    }
  }, [searchParams]);

  return (
    <ShopifyContext.Provider value={state}>
      {children}
    </ShopifyContext.Provider>
  );
}
