'use client';

import { useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { S, phys, fx } from '@/lib/store';

const { lerp, clamp } = THREE.MathUtils;

/** Approx. width of the scales (pan edge to pan edge) in world units, used to fit the column */
const MODEL_WIDTH = 4.5;
/** The geometry spans y ≈ -2.37..1.87, so lift it to look vertically centered */
const BASE_Y = 0.25;

/** Three thin chains from the hook down to the pan rim */
function Chains({ depth, radius, material }: { depth: number; radius: number; material: THREE.Material }) {
  const chains = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
        const end = new THREE.Vector3(Math.cos(a) * radius, -depth, Math.sin(a) * radius);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().normalize());
        return { position: end.clone().multiplyScalar(0.5), quaternion, length: end.length() };
      }),
    [depth, radius],
  );
  return (
    <>
      {chains.map((c, i) => (
        <mesh key={i} position={c.position} quaternion={c.quaternion} material={material} castShadow>
          <cylinderGeometry args={[0.008, 0.008, c.length, 6]} />
        </mesh>
      ))}
    </>
  );
}

/**
 * Procedural Scales of Justice.
 * - model group: moved/rotated by scroll (GSAP → store S)
 * - tilt group: follows the pointer
 * - beam: damped-spring physics, pans counter-rotate to hang vertically
 * - click a pan → it dips; hover → gold glows + cursor grows
 */
export default function Scales() {
  const model = useRef<THREE.Group>(null!);
  const tilt = useRef<THREE.Group>(null!);
  const beam = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const pans = useRef<(THREE.Group | null)[]>([]);
  const hovered = useRef(false);

  const mats = useMemo(
    () => ({
      gold: new THREE.MeshStandardMaterial({
        color: '#d4ad62', metalness: 1, roughness: 0.22, envMapIntensity: 1.3,
        emissive: new THREE.Color('#c9a45c'), emissiveIntensity: 0,
      }),
      goldDark: new THREE.MeshStandardMaterial({ color: '#9c7a3c', metalness: 1, roughness: 0.35 }),
      bowl: new THREE.MeshStandardMaterial({ color: '#d4ad62', metalness: 1, roughness: 0.2, side: THREE.DoubleSide }),
      marble: new THREE.MeshStandardMaterial({ color: '#10182c', metalness: 0.3, roughness: 0.25, envMapIntensity: 0.8 }),
      ring: new THREE.MeshBasicMaterial({ color: '#c9a45c', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }),
      ring2: new THREE.MeshBasicMaterial({ color: '#c9a45c', transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false }),
    }),
    [],
  );

  // Pillar silhouette for LatheGeometry (slight taper + fluting ripples)
  const pillarProfile = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const ripple = t > 0.1 && t < 0.9 ? 0.012 * Math.sin(t * Math.PI * 6) : 0;
      pts.push(new THREE.Vector2(0.085 + 0.03 * Math.pow(1 - t, 3) + ripple, -1.63 + t * 3.0));
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const vw = state.size.width;
    const mobile = vw < 860;
    const { x: px, y: py } = state.pointer;

    // Center the model inside the free column next to the text.
    // Layout mirrors the CSS: .wrap = min(1240px, 88vw), text column = min(600px, wrap)
    const wrapW = Math.min(1240, vw * 0.88);
    const textW = Math.min(600, wrapW);
    const freeW = wrapW - textW; // px
    const pxToWorld = state.viewport.width / vw;
    const columnCenter = (wrapW / 2 - freeW / 2) * pxToWorld;
    const fit = clamp((freeW * pxToWorld * 0.92) / MODEL_WIDTH, 0.55, 1.05);

    const m = model.current;
    const x = mobile ? 0 : S.side * columnCenter;
    m.position.set(x, S.y + BASE_Y + S.introY + Math.sin(t * 0.8) * 0.06 + (mobile ? 0.15 : 0), S.z);
    m.rotation.set(S.rx, S.ry + S.introRy + t * 0.05, 0);
    m.scale.setScalar(S.scale * (mobile ? 0.72 : fit));

    // pointer tilt
    tilt.current.rotation.y = lerp(tilt.current.rotation.y, px * 0.5, 0.08);
    tilt.current.rotation.x = lerp(tilt.current.rotation.x, -py * 0.18, 0.08);

    // beam spring physics — pointer x nudges the balance
    const target = -px * 0.12;
    phys.vel += (-14 * (phys.angle - target) - 2.2 * phys.vel) * dt;
    phys.angle = clamp(phys.angle + phys.vel * dt, -0.5, 0.5);
    beam.current.rotation.z = phys.angle;
    pans.current.forEach((p) => {
      if (!p) return;
      p.rotation.z = -phys.angle; // keep pans hanging vertically
      p.rotation.x = Math.sin(t * 1.3 + p.position.x) * 0.02;
    });

    mats.gold.emissiveIntensity = lerp(mats.gold.emissiveIntensity, hovered.current ? 0.12 : 0, 0.1);
    ring.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = true;
    document.body.classList.add('hover-3d');
  };
  const onOut = () => {
    hovered.current = false;
    document.body.classList.remove('hover-3d');
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    let o: THREE.Object3D | null = e.object;
    while (o && o.userData.side === undefined) o = o.parent;
    const side: number = o ? o.userData.side : e.pointer.x > 0 ? 1 : -1;
    phys.vel += -side * 2.6; // the clicked pan dips
    fx.glow = 6;
  };

  const { gold, goldDark, bowl, marble } = mats;
  const depth = 1.45;

  return (
    <group ref={model}>
      <group ref={tilt} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        {/* Base */}
        <mesh position-y={-2.25} material={marble} castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 1.35, 0.22, 64]} />
        </mesh>
        <mesh position-y={-2.14} rotation-x={Math.PI / 2} material={gold}>
          <torusGeometry args={[1.3, 0.025, 12, 96]} />
        </mesh>
        <mesh position-y={-2.03} material={marble} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 1.0, 0.22, 64]} />
        </mesh>
        <mesh position-y={-1.92} rotation-x={Math.PI / 2} material={gold}>
          <torusGeometry args={[0.88, 0.02, 12, 96]} />
        </mesh>
        <mesh position-y={-1.78} material={gold} castShadow>
          <cylinderGeometry args={[0.28, 0.42, 0.3, 48]} />
        </mesh>

        {/* Pillar */}
        <mesh material={gold} castShadow>
          <latheGeometry args={[pillarProfile, 48]} />
        </mesh>
        {[-0.6, 0.35].map((y) => (
          <mesh key={y} position-y={y} rotation-x={Math.PI / 2} material={gold}>
            <torusGeometry args={[0.13, 0.035, 16, 48]} />
          </mesh>
        ))}
        <mesh position-y={1.37} material={gold} castShadow>
          <sphereGeometry args={[0.14, 32, 16]} />
        </mesh>
        <mesh position-y={1.68} material={gold} castShadow>
          <coneGeometry args={[0.07, 0.38, 32]} />
        </mesh>

        {/* Beam (pivots on top of the pillar) */}
        <group ref={beam} position-y={1.37}>
          <mesh rotation-z={Math.PI / 2} material={gold} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 3.3, 24]} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={`curl${s}`} position={[s * 0.55, 0.12, 0]} rotation-z={s > 0 ? Math.PI * 0.9 : -Math.PI * 0.3} material={gold}>
              <torusGeometry args={[0.16, 0.025, 12, 48, Math.PI * 1.4]} />
            </mesh>
          ))}

          {/* Pans */}
          {[-1, 1].map((s, i) => (
            <group
              key={`pan${s}`}
              position-x={s * 1.62}
              userData={{ side: s }}
              ref={(el) => {
                pans.current[i] = el;
              }}
            >
              <mesh material={gold}>
                <sphereGeometry args={[0.075, 24, 12]} />
              </mesh>
              <Chains depth={depth} radius={0.52} material={goldDark} />
              <mesh position-y={-depth} scale-y={0.32} material={bowl} castShadow>
                <sphereGeometry args={[0.58, 64, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              </mesh>
              <mesh position-y={-depth} rotation-x={Math.PI / 2} material={gold}>
                <torusGeometry args={[0.58, 0.02, 12, 64]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Floor halo */}
        <mesh ref={ring} position-y={-2.35} rotation-x={-Math.PI / 2} material={mats.ring}>
          <ringGeometry args={[1.6, 1.63, 128]} />
        </mesh>
        <mesh position-y={-2.35} rotation-x={-Math.PI / 2} material={mats.ring2}>
          <ringGeometry args={[2.1, 2.115, 128]} />
        </mesh>
        <ContactShadows position={[0, -2.37, 0]} opacity={0.5} scale={7} blur={2.4} far={3} color="#000000" />
      </group>
    </group>
  );
}
