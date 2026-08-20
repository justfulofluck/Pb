import React from 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.Ref<HTMLElement>;
                src?: string;
                alt?: string;
                'camera-controls'?: boolean;
                'disable-zoom'?: boolean;
                'disable-pan'?: boolean;
                'disable-tap'?: boolean;
                'bounds'?: string;
                'min-camera-orbit'?: string;
                'max-camera-orbit'?: string;
                'min-field-of-view'?: string;
                'max-field-of-view'?: string;
                'touch-action'?: string;
                'interaction-prompt'?: string;
                'rotation-speed'?: string;
                'auto-rotate'?: boolean;
                'orientation'?: string;
                'shadow-intensity'?: string;
                'rotation-per-second'?: string;
                'ar'?: boolean;
                'ar-modes'?: string;
                'poster'?: string;
                'reveal'?: string;
            };
        }
    }
}
