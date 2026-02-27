import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ModelViewerTag = 'model-viewer' as any;

const LatestProductShowcase: React.FC = () => {
  const jarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = jarContainerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();

      const x = (clientX - (left + width / 2)) / 25;
      const y = (clientY - (top + height / 2)) / 25;

      gsap.to(container, {
        rotateY: x,
        rotateX: -y,
        x: x * 0.5,
        y: y * 0.5,
        duration: 1,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(container, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
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
    <section className="py-24 bg-[#f2f2ec] overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-2">
          <p className="font-handdrawn text-2xl text-secondary/80">Our New Flavor</p>
          <div className="relative inline-block">
            <h2 className="text-6xl md:text-7xl font-black text-primary font-garet tracking-tight">latest Product</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-32 items-center">
          {/* Left Column */}
          <div className="space-y-10 md:space-y-16 text-center lg:text-right order-2 lg:order-1">
            {benefitsLeft.map((item, idx) => (
              <div key={idx} className="group">
                <h3 className="text-2xl font-black text-slate-900 mb-2 font-garet">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto lg:ml-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Central 3D Model Viewer with Parallax & Floating */}
          <div className="order-1 lg:order-2 flex justify-center relative min-h-[700px] translate-y-[-40px]" style={{ perspective: '1000px' }}>
            <div
              ref={jarContainerRef}
              className="w-full max-w-[650px] animate-[float_6s_ease-in-out_infinite]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <ModelViewerTag
                src="/3D-assets/AmericanNuts-v1.glb"
                alt="3D Interactive Jar"
                shadow-intensity="1.5"
                camera-controls
                auto-rotate
                rotation-per-second="15deg"
                disable-zoom
                disable-tap
                interaction-prompt="auto"
                ar
                ar-modes="webxr scene-viewer quick-look"
                touch-action="pan-y"
                style={{ width: '100%', height: '700px', outline: 'none' }}
              >
                {/* Loading Poster */}
                <div slot="poster" className="flex flex-col items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </ModelViewerTag>

              {/* Dynamic Light Sweep Overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full opacity-30 mix-blend-overlay">
                <div className="absolute w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/40 to-transparent -rotate-45 animate-[light-sweep_8s_linear_infinite]"></div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-10 md:space-y-16 text-center lg:text-left order-3">
            {benefitsRight.map((item, idx) => (
              <div key={idx} className="group">
                <h3 className="text-2xl font-black text-slate-900 mb-2 font-garet">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto lg:mr-auto">
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

