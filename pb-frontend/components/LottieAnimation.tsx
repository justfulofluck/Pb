import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  /** The animation data (JSON object) imported from a file */
  animationData?: any;
  /** Alternatively, a URL to a JSON animation file */
  path?: string;
  /** Whether the animation should loop */
  loop?: boolean;
  /** Whether the animation should autoplay */
  autoplay?: boolean;
  /** Custom CSS classes for the container */
  className?: string;
  /** Style object for the container */
  style?: React.CSSProperties;
}

/**
 * A reusable Lottie Animation component for the Pinobite frontend.
 * Usage:
 * import myAnimation from '../assets/animations/confetti.json';
 * <LottieAnimation animationData={myAnimation} className="w-64 h-64" />
 */
const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  path,
  loop = true,
  autoplay = true,
  className = "w-full h-full",
  style
}) => {
  // If we have a path but no animationData, we can't easily use Lottie from lottie-react directly without fetching
  // so we'll support both patterns.
  const [data, setData] = React.useState<any>(animationData);

  React.useEffect(() => {
    const abortController = new AbortController();

    if (path && !animationData) {
      fetch(path, { signal: abortController.signal })
        .then(res => res.json())
        .then(json => {
          if (!abortController.signal.aborted) {
            setData(json);
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error('Error loading Lottie animation from path:', err);
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [path, animationData]);

  if (!data) return <div className={className} style={style} />;

  return (
    <div className={className} style={style}>
      <Lottie 
        animationData={data} 
        loop={loop} 
        autoPlay={autoplay}
      />
    </div>
  );
};

export default LottieAnimation;
