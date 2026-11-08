'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import Scales from './Scales';
import Particles from './Particles';
import { fx } from '@/lib/store';

/** Camera follows the pointer slightly (parallax) */
function CameraRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.35, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Gold flash when a pan is clicked */
function GlowLight() {
  const light = useRef<THREE.PointLight>(null!);
  useFrame(() => {
    fx.glow *= 0.95;
    light.current.intensity = fx.glow;
  });
  return <pointLight ref={light} position={[0, 1, 2]} color="#c9a45c" distance={6} decay={0} intensity={0} />;
}

/** Studio lighting built from Lightformers, so no external HDR file is needed */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#0b1120']} />
      <Lightformer form="rect" intensity={3} color="#fff1d6" position={[0, 9, 4]} scale={[10, 3, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2.2} color="#ffe2b0" position={[10, 1, 2]} scale={[4, 10, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.2} color="#8fb0ff" position={[-10, 0, -3]} scale={[4, 10, 1]} target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={1} color="#ffffff" position={[0, -3, -12]} scale={4} target={[0, 0, 0]} />
    </Environment>
  );
}

export default function Experience() {
  return (
    <div className="webgl-wrap" aria-hidden>
      <Canvas
        // Listen on <body> so the 3D model reacts even though the HTML content sits on top of the canvas
        eventSource={document.body}
        eventPrefix="client"
        dpr={[1, 2]}
        shadows
        camera={{ fov: 38, position: [0, 0.4, 9], near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      >
        <fogExp2 attach="fog" args={['#070b16', 0.045]} />
        <ambientLight intensity={0.35} color="#404a66" />
        <directionalLight position={[4, 6, 5]} intensity={1.6} color="#ffe7bf" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-4, 2, -4]} intensity={2.2} color="#6f8dff" distance={20} decay={0} />
        <GlowLight />
        <Suspense fallback={null}>
          <Studio />
        </Suspense>
        <Scales />
        <Particles />
        <CameraRig />
      </Canvas>
    </div>
  );
}
