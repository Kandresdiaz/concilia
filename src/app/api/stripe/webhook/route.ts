import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Needs service role to update profiles
)

export async function POST(req: Request) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    const stripe = getStripe()
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const priceId = session.line_items?.data[0]?.price?.id || session.metadata?.priceId

        if (userId) {
            // Determine tier based on Price ID (User should set these in env)
            let tier = 'PRO'
            if (priceId === process.env.STRIPE_PRICE_ID_DESPACHO) {
                tier = 'ENTERPRISE'
            }

            const { error } = await supabaseAdmin
                .from('profiles')
                .update({
                    tier,
                    stripe_customer_id: session.customer as string,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)

            if (error) console.error('Error updating profile tier:', error)
        }
    }

    return NextResponse.json({ received: true })
}
