'use client';

import dynamic from 'next/dynamic';

// WebGL only runs in the browser → load the canvas without SSR
const Experience = dynamic(() => import('./Experience'), { ssr: false });

export default function ExperienceClient() {
  return <Experience />;
}
