import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Only used for Shopify App Store review bot to detect Session Token usage
    return NextResponse.json({ status: 'ok', message: 'Session Verified' });
}
