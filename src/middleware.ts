import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Bypass middleware for API routes and authentication callbacks to prevent timeouts
    if (pathname.startsWith('/api') || pathname.startsWith('/auth')) {
        return NextResponse.next()
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run middleware on static files or API routes that don't need auth
    const { data: { user } } = await supabase.auth.getUser()

    // Si viene con ?shop=, es un merchant autenticado por Shopify → dejar pasar sin login de Supabase
    const shop = request.nextUrl.searchParams.get('shop')
    if (shop && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin'))) {
        return supabaseResponse
    }

    if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        const host = request.nextUrl.searchParams.get('host')
        if (shop) url.searchParams.set('shop', shop)
        if (host) url.searchParams.set('host', host)
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
