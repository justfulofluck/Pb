import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface SnaxxoReviewsProps {
    color?: string;
}

const SnaxxoReviews: React.FC<SnaxxoReviewsProps> = ({ color }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;

        if (!container || !track) return;

        // Initialize Draggable
        // This replicates the horizontal drag behavior
        // Using Draggable.create on the track

        const draggable = Draggable.create(track, {
            type: "x",
            bounds: container,
            inertia: true,
            edgeResistance: 0.65,
            dragResistance: 0.4,
            throwProps: true, // Only if Inertia is active, fallback otherwise
            cursor: "grab",
            activeCursor: "grabbing"
        })[0];

        // Note: The bounds might need adjustment because the track is wider than container.
        // Usually bounds relate to the min/max X values. 
        // For a slider, we usually set minX/maxX manually or let Draggable handle it if configured right.
        // If 'bounds: container' doesn't work for overflow content, we might need a proxy or explicit bounds.
        // A quick way for simple horizontal slider:

        // Recalculate bounds on resize
        const updateBounds = () => {
            const trackWidth = track.scrollWidth;
            const containerWidth = container.clientWidth;
            const minX = containerWidth - trackWidth;
            const maxX = 0;

            if (minX < 0) {
                draggable.applyBounds({ minX: minX, maxX: maxX });
            } else {
                // Not enough content to scroll
                draggable.applyBounds({ minX: 0, maxX: 0 });
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            updateBounds();
        });

        resizeObserver.observe(container);
        updateBounds();

        return () => {
            resizeObserver.disconnect();
            draggable.kill(); // Cleanup
        };
    }, []);

    const reviews = [
        { id: 1, text: "These replaced my afternoon chips completely. I’m officially hooked.", user: "@jillb321", img: "6959c0846c4ea79e0c07a4be_Frame-20895-1.avif" },
        { id: 2, text: "Every flavor hits. The crunch, the seasoning, everything is on point.", user: "@tara543", img: "6959c084301ad968f18e5a23_Frame-20929.avif" },
        { id: 3, text: "Finally a snack that actually tastes good and doesn’t make me feel gross after.", user: "@summer356", img: "6959c084f42e0035cabadda4_Frame-20895-2.avif", italic: true },
        { id: 4, text: "Didn’t expect to finish the whole bag in one sitting… but here we are. Seriously addictive.", user: "@tanlitmas", img: "6959c084f876bb7021b3a39c_Frame-20895-3.avif" },
        { id: 5, text: "Perfect balance of bold flavor without being too heavy. I keep reordering.", user: "@kfe555", img: "6959c0840402823484e933b2_Frame-20927.avif" }
    ];

    return (
        <section className="section">
            <div className="w-layout-blockcontainer container instagram w-container">
                <div className="w-layout-grid heading-grid home-reviews">
                    <div className="grid-block">
                        <div className="heading-text-box social">
                            <h2 className="h2-heading no-margin large" data-words-slide-up="" data-text-split="" style={{ whiteSpace: 'nowrap' }}>
                                Feed your feed
                            </h2>
                            <div className="insta-handle" data-scale-up="" data-delay="0.2" data-duration="0.5" style={color ? { backgroundColor: color } : {}}>
                                <div className="insta-handle-text">@pinobite</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-slider-02" ref={containerRef}>
                <div className="product-slider-wrapper-02">
                    <div className="product-slider-mask" data-slide-up="" data-duration="0.6" data-stagger="0.12">
                        <div className="gsap-track-02" ref={trackRef} style={{ display: 'flex', cursor: 'grab' }}>

                            {reviews.map((review) => (
                                <div key={review.id} className="product-slide-02 small-padding">
                                    <div className="review-box-container">
                                        <div className="image-wrapper review-image">
                                            <img loading="lazy" src={`/assets/snaxxo/${review.img}`} alt="Reviewer" className="content-image _100-full absolute-cover-main" />
                                        </div>
                                        <div className="review-box-inner">
                                            <div className="review-quote">
                                                {review.italic ?
                                                    <>Finally a snack that actually tastes good <em>and</em> doesn’t make me feel gross after.</> :
                                                    `“${review.text}”`
                                                }
                                            </div>
                                        </div>
                                        <div className="review-box-bottom">
                                            <div className="review-handle">{review.user}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="gsap-end-spacer" style={{ width: '48px', flex: '0 0 auto' }}></div>
                        </div>
                    </div>
                </div>

                {/* Progress indicator or simple navigation could go here if needed, but the original used specific logic */}
                <div className="slider-progress-container" data-slide-up="" data-duration="0.3">
                    <div className="slider-progress-switch"></div>
                </div>
            </div>
        </section>
    );
};

export default SnaxxoReviews;
