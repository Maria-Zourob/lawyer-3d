/**
 * Shared mutable state between the DOM (GSAP ScrollTrigger) and the 3D scene (useFrame).
 * GSAP tweens these plain objects; the R3F render loop reads them every frame.
 */

export type ModelPose = { side: number; y: number; z: number; rx: number; ry: number; scale: number };

/**
 * Pose of the model for each section.
 * side: -1 = left empty column, 1 = right empty column, 0 = center.
 * The exact x position is computed from the layout so the model sits in the middle of the free column.
 */
export const poses: Record<string, ModelPose> = {
  hero: { side: -1, y: 0, z: 0, rx: 0, ry: -0.35, scale: 1 },
  about: { side: 1, y: 0, z: 0, rx: 0, ry: Math.PI * 0.85, scale: 1.04 },
  practice: { side: 0, y: -0.25, z: -4, rx: 0.25, ry: Math.PI * 2, scale: 0.9 },
  results: { side: -1, y: 0, z: 0, rx: 0, ry: Math.PI * 2.4, scale: 1 },
  process: { side: 1, y: 0, z: 0, rx: 0, ry: Math.PI * 3.15, scale: 1 },
  contact: { side: -1, y: -0.05, z: 0, rx: 0, ry: Math.PI * 3.8, scale: 0.95 },
};

export const sectionOrder = ['hero', 'about', 'practice', 'results', 'process', 'contact'] as const;

export const S = {
  ...poses.hero,
  introY: -6,
  introRy: -Math.PI * 1.5,
};

export const phys = { angle: 0, vel: 1.8 };

export const fx = { glow: 0, scroll: 0 };
