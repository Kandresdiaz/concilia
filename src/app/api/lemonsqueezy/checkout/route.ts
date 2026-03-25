import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { setupLemonSqueezy } from '@/lib/lemonsqueezy'
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const { tier, shop } = await req.json()
        let activeUser = user

        if (!activeUser && shop) {
            // Auth Bypass for Shopify Iframe:
            // Intentar recuperar el usuario basado en el dominio de la tienda
            const supabaseAdmin = await createClient(true) // Usar modo admin/service_role si es necesario o manejarlo aquí
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id, email')
                .eq('shopify_shop', shop)
                .single()
            
            if (profile) {
                activeUser = { id: profile.id, email: profile.email } as any
            }
        }

        if (!activeUser) {
            return NextResponse.json({ error: 'Unauthorized: No se detectó una sesión válida' }, { status: 401 })
        }

        // Lemon Squeezy Store and Variant IDs from env
        const storeId = process.env.LEMON_SQUEEZY_STORE_ID
        let variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_PRO

        if (tier === 'ENTERPRISE') {
            variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_DESPACHO
        }

        if (!storeId || !variantId) {
            return NextResponse.json({ error: 'Configuración de Lemon Squeezy incompleta' }, { status: 500 })
        }

        setupLemonSqueezy()

        const checkout = await createCheckout(storeId, variantId, {
            checkoutData: {
                email: activeUser.email,
                custom: {
                    user_id: activeUser.id,
                    tier: tier
                }
            },
            productOptions: {
                redirectUrl: `${req.headers.get('origin')}/dashboard?payment=success`,
            }
        })

        return NextResponse.json({ url: checkout.data?.data.attributes.url })
    } catch (error: any) {
        console.error('Lemon Squeezy Checkout Error:', error)
        return NextResponse.json({ error: 'Error al procesar el pago: ' + error.message }, { status: 500 })
    }
}
