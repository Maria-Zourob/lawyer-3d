'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { S, phys, fx, poses, sectionOrder } from '@/lib/store';
import { setLenis, getLenis } from '@/lib/lenis';
import { Nav, Loader, Cursor, Footer } from './Chrome';
import { Hero, Marquee, About, Practice, Results, Process, Contact } from './sections/Sections';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Content() {
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);

  /* ---------- Smooth scrolling (Lenis) synced with ScrollTrigger ---------- */
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.stop(); // locked until the intro finishes
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* ---------- Intro ---------- */
      const pct = document.getElementById('pct');
      gsap
        .timeline()
        .from('.loader-mark, .loader-name', { opacity: 0, y: 14, duration: 0.7, stagger: 0.1, ease: 'power3.out' })
        .to('#barFill', {
          width: '100%', duration: 1.1, ease: 'power2.inOut',
          onUpdate() { if (pct) pct.textContent = Math.round(this.progress() * 100) + '%'; },
        }, '<0.2')
        .to('#loader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' })
        .to(S, { introY: 0, duration: 1.8, ease: 'expo.out' }, '-=0.5')
        .to(S, { introRy: 0, duration: 2.2, ease: 'expo.out' }, '<')
        .call(() => { phys.vel = 1.8; }, [], '<')
        .from('#hero h1 .line > span', { yPercent: 115, rotate: 3, duration: 1.3, stagger: 0.14, ease: 'power4.out' }, '<0.15')
        .from('.hero-in', { opacity: 0, y: 26, duration: 1, stagger: 0.1, ease: 'power3.out' }, '<0.35')
        .from('nav', { opacity: 0, y: -20, duration: 0.8 }, '<')
        .set('#loader', { display: 'none' })
        .call(() => { getLenis()?.start(); });

      /* ---------- Practice: pinned horizontal scroll (RTL → track moves right) ---------- */
      const track = document.getElementById('track')!;
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#practice', start: 'top top', end: () => '+=' + dist() * 1.1,
            pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          },
        })
        .to(track, { x: () => dist(), ease: 'none' }, 0)
        .fromTo('.media-parallax', { xPercent: -9 }, { xPercent: 9, ease: 'none' }, 0)
        .fromTo('.h-progress i', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);

      gsap.set('.card-wrap', { opacity: 0, y: 90 });
      ScrollTrigger.create({
        trigger: '#practice', start: 'top 70%', once: true,
        onEnter: () => {
          gsap.to('.card-wrap', { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, ease: 'power3.out' });
          document.querySelectorAll('.card-wrap').forEach((c, i) => setTimeout(() => c.classList.add('in'), 250 + i * 120));
        },
      });

      /* ---------- 3D choreography: one scrubbed tween per section ---------- */
      // Each section owns its own trigger, so the pinned section can't push the poses out of sync.
      sectionOrder.forEach((id, i) => {
        if (i === 0) return;
        const from = poses[sectionOrder[i - 1]];
        const to = poses[id];
        gsap.fromTo(S, { ...from }, {
          ...to,
          ease: 'power2.inOut',
          immediateRender: false,
          scrollTrigger: { trigger: '#' + id, start: 'top bottom', end: id === 'practice' ? 'top top' : 'top 25%', scrub: 1.2 },
        });
      });

      ScrollTrigger.create({
        trigger: main.current, start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => { fx.scroll = self.progress; },
      });

      /* ---------- Marquee: runs forever, speeds up with scroll velocity ---------- */
            /* ---------- Marquee: slow continuous loop ---------- */
      // the words are repeated twice over, so moving by 50% loops seamlessly
      gsap.to('.marquee-track', { xPercent: 50, duration: 45, ease: 'none', repeat: -1 });

      /* ---------- Reveals ---------- */
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
      });

      // headings: soft blur-in per word
      gsap.utils.toArray<HTMLElement>('h2.reveal').forEach((h) => {
        gsap.fromTo(h, { filter: 'blur(10px)' }, { filter: 'blur(0px)', duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 86%' } });
      });

      /* ---------- Counters (Western digits) ---------- */
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const o = { v: 0 };
        const end = Number(el.dataset.count);
        gsap.to(o, {
          v: end, duration: 2.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-US'); },
        });
      });

      gsap.fromTo('#railFill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: true } });

      /* ---------- Magnetic buttons (desktop only) ---------- */
      mm.add('(hover: hover)', () => {
        const cleanups: (() => void)[] = [];
        gsap.utils.toArray<HTMLElement>('.magnetic').forEach((btn) => {
          const move = (e: PointerEvent) => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4, ease: 'power3.out' });
          };
          const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
          btn.addEventListener('pointermove', move);
          btn.addEventListener('pointerleave', leave);
          cleanups.push(() => { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); });
        });
        return () => cleanups.forEach((c) => c());
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh);
      return () => window.removeEventListener('load', refresh);
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <Loader />
      <Cursor />
      <Nav />
      <main ref={main}>
        <Hero />
        <Marquee />
        <About />
        <Practice />
        <Results />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
