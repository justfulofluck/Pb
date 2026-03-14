import React from 'react';

interface MultiLayerWaveProps {
    fill?: string;
    className?: string;
    flipped?: boolean;
}

const MultiLayerWave: React.FC<MultiLayerWaveProps> = ({ fill = "#228b44", className, flipped = false }) => {
    // A smooth wave path
    const pathData = "M0 60 C 150 -10, 250 130, 400 60 C 550 -10, 650 130, 800 60 L 800 160 L 0 160 Z";

    return (
        <div className={`relative overflow-hidden w-full h-48 ${className}`} style={flipped ? { transform: 'scaleY(-1)' } : {}}>
            <svg
                viewBox="0 0 800 160"
                preserveAspectRatio="none"
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Single Static Layer */}
                <g>
                    <path d={pathData} fill={fill} />
                </g>
            </svg>
        </div>
    );
};

export default MultiLayerWave;
