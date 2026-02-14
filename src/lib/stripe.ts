import Stripe from 'stripe';

let stripePromise: Stripe | null = null;

export const getStripe = () => {
    if (!stripePromise) {
        const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder';
        stripePromise = new Stripe(apiKey, {
            // @ts-ignore
            apiVersion: '2025-01-27.acacia',
            typescript: true,
        });
    }
    return stripePromise;
};
