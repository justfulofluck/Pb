import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

function parseColorToRGB(colorStr: string): [number, number, number] {
  try {
    const c = new THREE.Color(colorStr);
    return [c.r, c.g, c.b];
  } catch {
    return [0.48, 0.45, 0.5];
  }
}

export const Silk: React.FC<SilkProps> = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uSpeed: { value: number };
    uScale: { value: number };
    uNoiseIntensity: { value: number };
    uColor: { value: THREE.Color };
    uRotation: { value: number };
    uTime: { value: number };
  } | null>(null);

  // Update uniforms when props change without re-creating WebGL context
  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uSpeed.value = speed;
      uniformsRef.current.uScale.value = scale;
      uniformsRef.current.uNoiseIntensity.value = noiseIntensity;
      uniformsRef.current.uRotation.value = rotation;
      uniformsRef.current.uColor.value.setRGB(...parseColorToRGB(color));
    }
  }, [speed, scale, color, noiseIntensity, rotation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      precision: 'mediump'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setSize(container.clientWidth || 300, container.clientHeight || 300);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1, 1);

    const initialRgb = parseColorToRGB(color);
    const uniforms = {
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new THREE.Color(...initialRgb) },
      uRotation: { value: rotation },
      uTime: { value: 0 }
    };
    uniformsRef.current = uniforms;

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const clock = new THREE.Clock();
    let raf = 0;
    let isVisible = true;
    let lastRenderTime = 0;
    const targetFpsInterval = 1000 / 30; // Cap at 30 FPS for ultra-low GPU load

    const animate = (currentTime: number) => {
      if (!isVisible) return;
      raf = requestAnimationFrame(animate);

      const elapsed = currentTime - lastRenderTime;
      if (elapsed > targetFpsInterval) {
        lastRenderTime = currentTime - (elapsed % targetFpsInterval);
        uniforms.uTime.value += 0.1 * clock.getDelta();
        renderer.render(scene, camera);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(animate);
      }
    }, { threshold: 0.05 });

    io.observe(container);
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      uniformsRef.current = null;
    };
  }, []); // Run once on mount

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ overflow: 'hidden', ...style }}
    />
  );
};

export default Silk;
