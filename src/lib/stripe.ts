import Stripe from 'stripe';

// Use a dummy key during build/if specific env var is missing to prevent build crashes
// The actual key limits and validity are checked at runtime when API calls are made
const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder';

export const stripe = new Stripe(apiKey, {
    // @ts-ignore - Let Stripe handle API versioning or use latest if not specified
    apiVersion: '2025-01-27.acacia',
    typescript: true,
});
