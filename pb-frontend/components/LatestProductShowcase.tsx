import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { throttle } from '../utils/performance';

const LatestProductShowcase: React.FC = () => {
  const jarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = jarContainerRef.current;
    if (!container) return;

    const xTo = gsap.quickTo(container, "x", { duration: 1, ease: 'power2.out' });
    const yTo = gsap.quickTo(container, "y", { duration: 1, ease: 'power2.out' });
    const rotateXTo = gsap.quickTo(container, "rotateX", { duration: 1, ease: 'power2.out' });
    const rotateYTo = gsap.quickTo(container, "rotateY", { duration: 1, ease: 'power2.out' });

    // Floating Animation in GSAP to avoid conflict with Mouse interaction
    const floatTl = gsap.to(container, {
      y: "-=35",
      rotateX: "+=2",
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    const handleMouseMove = throttle((e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();

      const x = (clientX - (left + width / 2)) / 25;
      const y = (clientY - (top + height / 2)) / 25;

      xTo(x * 0.5);
      yTo(y * 0.5);
      rotateXTo(-y);
      rotateYTo(x);
    }, 16);

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      rotateXTo(0);
      rotateYTo(0);

      gsap.to(container, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.3)',
        overwrite: true
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      floatTl.kill();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const benefitsLeft = [
    {
      title: "Naturally Sweetened",
      desc: "Contains only 1.6g natural sugar and just 2.24g added brown sugar per serving — a better sweet choice!"
    },
    {
      title: "Good Source of Fiber",
      desc: "Each serving offers 2.56g of dietary fiber for better digestion and fullness."
    },
    {
      title: "Energy Dense",
      desc: "Each serving packs 184.64 Kcal of clean energy — great for active lifestyles and fitness goals."
    }
  ];

  const benefitsRight = [
    {
      title: "High Protein Power",
      desc: "Delivers 8.64g protein per serving, supporting muscle growth and energy."
    },
    {
      title: "Healthy Fats Only",
      desc: "Rich in monounsaturated and polyunsaturated fats, promoting heart health — with zero trans fat & cholesterol."
    },
    {
      title: "Low Sodium",
      desc: "Contains just 49.6mg of sodium per serving, making it suitable for low-salt diets."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-whiteboard texture-overlay texture-speckles">
      {/* Background Glow Removed to maintain board texture */}

      <style>{`
        @keyframes floatShadowLarge {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(0.7); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <span className="font-handdrawn text-2xl md:text-3xl lg:text-2xl text-secondary/80 transform -rotate-3 inline-block absolute -top-6 md:-top-12 lg:-top-10 left-1/2 -translate-x-1/2 md:-translate-x-[130px] lg:-translate-x-[110px] z-10 whitespace-nowrap">
            Our New Flavor
          </span>
          <div className="relative inline-block">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal text-textured-green tracking-tight leading-[1] font-anton !normal-case">Latest product</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 lg:gap-20 items-center mt-[-1rem] md:mt-[-2rem]">
          {/* Left Column */}
          <div className="space-y-8 md:space-y-16 text-center lg:text-right order-2 lg:order-1">
            {benefitsLeft.map((item, idx) => (
              <div key={idx} className="group px-4 md:px-0">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-slate-900 mb-1 md:mb-2 font-anton !normal-case tracking-tight whitespace-nowrap">{item.title}</h3>
                <p className="text-[11px] md:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto lg:ml-auto font-satoshi">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Central 3D Model Column */}
          <div className="order-1 lg:order-2 flex flex-col items-center justify-center relative" style={{ perspective: '1000px' }}>
            <div
              ref={jarContainerRef}
              className="w-full max-w-[650px]"
              style={{
                transformStyle: 'preserve-3d',
                position: 'relative',
                zIndex: 2
              }}
            >
              <model-viewer
                src="/3D-assets/AmericanNuts-v1.glb"
                alt="3D Interactive Jar"
                shadow-intensity="0"
                camera-controls
                auto-rotate
                rotation-per-second="15deg"
                disable-zoom
                disable-tap
                interaction-prompt="auto"
                ar
                ar-modes="webxr scene-viewer quick-look"
                touch-action="pan-y"
                style={{ width: '100%', outline: 'none' }}
                className="h-[400px] md:h-[500px] lg:h-[600px]"
              >
                {/* Loading Poster */}
                <div slot="poster" className="flex flex-col items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </model-viewer>

              {/* Dynamic Light Sweep Overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full opacity-30 mix-blend-overlay">
                <div className="absolute w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/40 to-transparent -rotate-45 animate-[light-sweep_8s_linear_infinite]"></div>
              </div>
            </div>

            {/* Custom Detached Ground Shadow - Absolute positioned at the base */}
            <div
              className="absolute bottom-[40px] md:bottom-[60px] lg:bottom-[80px] left-1/2 -translate-x-1/2"
              style={{
                width: 'min(200px, 60vw)',
                height: '20px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 75%)',
                borderRadius: '100%',
                filter: 'blur(8px)',
                animation: 'floatShadowLarge 6s ease-in-out infinite',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8 md:space-y-16 text-center lg:text-left order-3">
            {benefitsRight.map((item, idx) => (
              <div key={idx} className="group px-4 md:px-0">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-slate-900 mb-1 md:mb-2 font-anton !normal-case tracking-tight whitespace-nowrap">{item.title}</h3>
                <p className="text-[11px] md:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto lg:mr-auto font-satoshi">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestProductShowcase;
