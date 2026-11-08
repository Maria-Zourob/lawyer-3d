import type Lenis from 'lenis';

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Smooth-scroll to an element (uses Lenis when available) */
export function scrollToTarget(target: Element) {
  const l = getLenis();
  if (l) l.scrollTo(target as HTMLElement, { duration: 1.6 });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
}
