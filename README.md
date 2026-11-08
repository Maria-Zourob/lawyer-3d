# Lawyer Portfolio — Interactive 3D

An interactive 3D portfolio built with **Next.js 15 (App Router) + React Three Fiber + Drei + GSAP ScrollTrigger**.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Deploy (Vercel)

1. Push the folder to a GitHub repo.
2. vercel.com → **Add New Project** → choose the repo → **Deploy** (it detects Next.js on its own).
3. Rename the domain under Settings → Domains, e.g. `layla-law-3d.vercel.app`.

## Structure

```
app/
  layout.tsx           Arabic fonts (next/font), RTL
  page.tsx             3D Canvas + content
  globals.css          all styles
components/
  three/
    Experience.tsx     <Canvas>, lights, Lightformer environment, camera rig
    Scales.tsx         scales of justice (procedural) + spring physics + hover/click
    Particles.tsx      gold dust (custom GLSL shader)
    ExperienceClient   dynamic import with ssr:false
  Content.tsx          every GSAP timeline (intro, scroll choreography, pin, reveals, counters)
  Chrome.tsx           Nav, Loader, Cursor
  sections/Sections.tsx  Hero / About / Practice / Results / Process / Contact
lib/
  store.ts             shared state between GSAP and useFrame
  data.ts              page content (edit the text here)
```

## How the pieces connect

- **GSAP → 3D:** ScrollTrigger tweens a plain object `S` in `lib/store.ts`, and `useFrame` inside `Scales.tsx` reads it every frame. No React re-renders happen.
- **Interaction:** `eventSource={document.body}` lets the 3D model receive mouse events even though the HTML content sits on top of the canvas.
- **Physics:** the beam is a damped spring, `acc = -k(angle - target) - d·vel`. Clicking a pan adds an impulse to the velocity.
- **Lighting:** the environment is built from Lightformers inside `<Environment>`, so there is no external HDR file to download.

## Swap in a real model later (GLB)

```tsx
import { useGLTF } from '@react-three/drei';
const { scene } = useGLTF('/models/scales.glb');
return <primitive object={scene} />;
```

## Practice card photos

Put 6 photos in `public/images/practice/` named `01.jpg` through `06.jpg`, in the same order as the cards.
A gold duotone filter is applied automatically so all the photos look consistent. Until a photo exists, the card shows its animated gold line illustration.
Free sources: unsplash.com or pexels.com, at roughly 1200px wide.
