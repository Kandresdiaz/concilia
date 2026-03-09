import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '')
        const digest = Buffer.from(hmac.update(body).digest('hex'), 'utf8')
        const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8')

        if (!crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        const payload = JSON.parse(body)
        const eventName = payload.meta.event_name
        const customData = payload.meta.custom_data

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceKey) {
            console.error('Missing Supabase variables')
            return NextResponse.json({ error: 'Server Error' }, { status: 500 })
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceKey)

        if (eventName === 'order_created' || eventName === 'subscription_created') {
            const userId = customData.user_id
            const tier = customData.tier || 'PRO'

            // Extract IDs from LS payload
            const lsCustomerId = payload.data.attributes.customer_id?.toString()
            const lsOrderId = payload.data.id?.toString()

            const { error } = await supabaseAdmin
                .from('profiles')
                .update({
                    tier,
                    ls_customer_id: lsCustomerId,
                    ls_order_id: lsOrderId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)

            if (error) {
                console.error('Error updating profile:', error)
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
            }
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        console.error('Webhook Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
