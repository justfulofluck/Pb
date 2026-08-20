import React, { useRef, useState, useEffect } from 'react';

interface BorderGlowProps {
  children: React.ReactNode;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  colors?: string[];
  className?: string;
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  edgeSensitivity = 30,
  glowColor = '192, 132, 252',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 150,
  glowIntensity = 1.0,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      setMousePosition({ x: ev.clientX - left, y: ev.clientY - top });
    };

    if (isHovering) {
      window.addEventListener('mousemove', updateMousePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: -1000, y: -1000 });
      }}
      className={`relative group overflow-hidden ${className}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? glowIntensity : 0,
          background: `radial-gradient(${glowRadius}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${colors[0]}, transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-[2px] z-10 transition-colors duration-300"
        style={{
          background: backgroundColor,
          borderRadius: `${borderRadius - 2}px`
        }}
      />
      <div className="relative z-20 h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
