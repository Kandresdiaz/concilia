import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Only check auth on protected routes to avoid getUser() network timeouts on Edge Runtime
const PROTECTED_PATHS = ['/dashboard', '/admin']

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Only run auth logic on protected routes — avoids unnecessary network calls
    const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
    if (!isProtected) {
        return NextResponse.next()
    }

    // Si viene con ?shop=, es un merchant autenticado por Shopify → dejar pasar sin login de Supabase
    const shop = request.nextUrl.searchParams.get('shop')
    if (shop) {
        return NextResponse.next()
    }

    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        const host = request.nextUrl.searchParams.get('host')
        if (host) url.searchParams.set('host', host)
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

export const config = {
    // Only match protected routes — skip everything else entirely
    matcher: ['/dashboard/:path*', '/admin/:path*'],
}
