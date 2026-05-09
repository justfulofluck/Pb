import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useSnaxxoAnimations = () => {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Replicate Snaxxo's "words-slide-up" logic simplistically
            // We assume the elements have standard classes/attributes
            const animatedElements = document.querySelectorAll('[data-snaxxo-animate]');

            animatedElements.forEach((el) => {
                gsap.fromTo(el,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%"
                        }
                    }
                );
            });
        });

        return () => {
            ctx.revert();
        };
    }, []);
};
