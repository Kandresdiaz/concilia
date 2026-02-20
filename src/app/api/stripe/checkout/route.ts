import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { tier } = await req.json()

        let priceId = process.env.STRIPE_PRICE_ID_PRO || 'price_placeholder'
        if (tier === 'ENTERPRISE') {
            priceId = process.env.STRIPE_PRICE_ID_DESPACHO || 'price_placeholder'
        }

        const stripe = getStripe()
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/dashboard?payment=success`,
            cancel_url: `${req.headers.get('origin')}/dashboard?payment=cancel`,
            customer_email: user.email,
            metadata: {
                userId: user.id,
                tier: tier
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error('Stripe Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
