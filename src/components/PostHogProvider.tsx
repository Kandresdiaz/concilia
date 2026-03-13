"use client"

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        posthog.init('phc_P2YvHwQ9wLxT3ZNo7r6vXN6K8oXN8Y7oXN8Y7oXN8Y7', { // ID temporal para demostración, deberías usar el tuyo
          api_host: 'https://app.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false // Se captura manualmente en el router si es necesario
        })
      }
    }, [])

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
