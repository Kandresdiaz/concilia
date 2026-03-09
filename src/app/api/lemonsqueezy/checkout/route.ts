import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { setupLemonSqueezy } from '@/lib/lemonsqueezy'
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { tier } = await req.json()

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
                email: user.email,
                custom: {
                    user_id: user.id,
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
