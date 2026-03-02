import React, { useEffect } from 'react';
import '../../styles/snaxxo.css'; // Global styles
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
        <div className="snaxxo-wrapper relative w-full overflow-hidden bg-[#FAF9F5]">
        </div>
    );
};

export default SnaxxoLanding;
