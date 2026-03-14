"use client"

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        posthog.init('phc_MQaJ0hcOY56CzrxHUkIjKbZWYqb9zwyCIgca8BAUwCr', {
          api_host: 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: true // Habilitado para que registre visitas del lanzamiento automáticamente
        })
      }
    }, [])

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
