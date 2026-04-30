import React, { useEffect } from 'react';
// Legacy styles are now managed globally in index.tsx
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSnaxxoAnimations } from '../../hooks/useSnaxxoAnimations';
import { Product } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface SnaxxoLandingProps {
    products: Product[];
    onAddToCart: (p: Product) => void;
    onProductClick: (p: Product) => void;
    isLoading?: boolean;
    onShopClick: () => void;
    onHomeClick: () => void;
    onFAQClick?: () => void;
    onBlogsClick?: () => void;
    onEventBlogsClick?: () => void;
    onAdminClick?: () => void;
    onJourneyClick: () => void;
    onPrivacyClick?: () => void;
    onTermsClick?: () => void;
    onRefundClick?: () => void;
    onShippingClick?: () => void;
}

const SnaxxoLanding: React.FC<SnaxxoLandingProps> = ({
    products,
    onAddToCart,
    onProductClick,
    isLoading,
    ...footerProps
}) => {
    useSnaxxoAnimations();

    useEffect(() => {
        // Refresh ScrollTrigger when component mounts
        ScrollTrigger.refresh();
    }, []);

    return (
        <div className="snaxxo-wrapper relative w-full overflow-hidden bg-whiteboard texture-overlay texture-speckles">
        </div>
    );
};

export default SnaxxoLanding;
