/**
 * Simple analytics utility to track user interactions.
 * This can be extended to send data to GA4, Mixpanel, etc.
 */

type EventName =
    | 'product_view'
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'wishlist_add'
    | 'wishlist_remove'
    | 'checkout_begin'
    | 'purchase';

interface EventProperties {
    [key: string]: any;
}

export const trackEvent = (name: EventName, properties?: EventProperties) => {
    // In a real scenario, you'd call window.gtag or similar here.
    // For now, we log to console for debugging and future-proofing.
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${name}:`, properties);
    }

    // Future implementation:
    // if (window.gtag) {
    //   window.gtag('event', name, properties);
    // }
};

export const analytics = {
    trackEvent,
    trackProductView: (product: any) => {
        trackEvent('product_view', {
            product_id: product.id,
            product_name: product.name,
            category: product.category,
            price: product.price
        });
    },

    trackAddToCart: (product: any, quantity: number = 1) => {
        trackEvent('add_to_cart', {
            product_id: product.id,
            product_name: product.name,
            category: product.category,
            price: product.price,
            quantity
        });
    },

    trackRemoveFromCart: (product: any) => {
        trackEvent('remove_from_cart', {
            product_id: product.id,
            product_name: product.name,
            price: product.price
        });
    },

    trackWishlistAction: (product: any, action: 'add' | 'remove') => {
        trackEvent(action === 'add' ? 'wishlist_add' : 'wishlist_remove', {
            product_id: product.id,
            product_name: product.name,
            price: product.price
        });
    }
};
