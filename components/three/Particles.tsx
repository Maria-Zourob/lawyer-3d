'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { fx } from '@/lib/store';

const vertexShader = /* glsl */ `
  attribute float seed;
  uniform float uTime;
  uniform float uPR;
  uniform float uScroll;
  varying float vA;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * .25 + seed * 20.) * .35 + uScroll * 2.5 * (seed - .5);
    p.x += cos(uTime * .2 + seed * 12.) * .25;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (18. * seed + 6.) * uPR / -mv.z;
    vA = .35 + .65 * abs(sin(uTime * .8 + seed * 30.));
  }
`;

const fragmentShader = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - .5);
    if (d > .5) discard;
    float a = smoothstep(.5, 0., d) * vA * .8;
    gl_FragColor = vec4(.95, .78, .45, a);
  }
`;

/** Floating gold dust with a custom shader; drifts with time and page scroll */
export default function Particles() {
  const points = useRef<THREE.Points>(null!);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const count = size.width < 860 ? 600 : 1500;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
      seed[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPR: { value: 1 }, uScroll: { value: 0 } },
      }),
    [],
  );

  useFrame(({ clock, pointer }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uScroll.value = fx.scroll;
    material.uniforms.uPR.value = dpr;
    points.current.rotation.y = clock.elapsedTime * 0.015 + pointer.x * 0.05;
  });

  return <points ref={points} geometry={geometry} material={material} />;
}
