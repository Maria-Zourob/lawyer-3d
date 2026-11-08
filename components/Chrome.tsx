'use client';

import { useEffect, useRef, useState } from 'react';
import { goTo } from './sections/Sections';

/** Monogram: a column holding a balanced beam */
export function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden>
      <circle cx="24" cy="24" r="22.5" opacity=".45" />
      <path d="M24 11v25M15 36h18M12 17h24" />
      <path d="M12 17l-5 11h10zM36 17l-5 11h10z" />
      <circle cx="24" cy="10" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    ['#about', 'من نحن'],
    ['#practice', 'مجالات الممارسة'],
    ['#results', 'الإنجازات'],
    ['#process', 'آلية العمل'],
  ];
  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <a href="#hero" className="logo" onClick={goTo}>
        <Mark />
        <span>ليلى الحسيني<small>LAW &amp; COUNSEL</small></span>
      </a>
      <ul>
        {links.map(([href, label]) => (
          <li key={href}><a href={href} onClick={goTo}>{label}</a></li>
        ))}
      </ul>
      <a href="#contact" className="btn magnetic" onClick={goTo}>احجز/ي استشارة</a>
    </nav>
  );
}

export function Loader() {
  return (
    <div id="loader">
      <div className="loader-mark"><Mark size={64} /></div>
      <div className="loader-name">ليلى الحسيني</div>
      <div className="bar"><i id="barFill" /></div>
      <div className="pct" id="pct" dir="ltr">0%</div>
    </div>
  );
}

/** Ring cursor that eases behind the pointer; grows over the 3D model and links */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const pos = { x: -100, y: -100 }, cur = { x: -100, y: -100 };
    let raf = 0;
    const move = (e: PointerEvent) => { pos.x = e.clientX; pos.y = e.clientY; };
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.2;
      cur.y += (pos.y - cur.y) * 0.2;
      if (el.current) el.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      document.body.classList.toggle('hover-link', !!t.closest('a, button, .card'));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
    };
  }, []);
  return <div className="cursor" ref={el} />;
}

export function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-brand">
          <a href="#hero" className="logo" onClick={goTo}>
            <Mark size={42} />
            <span>ليلى الحسيني<small>LAW &amp; COUNSEL</small></span>
          </a>
          <p>مكتب محاماة واستشارات قانونية يخدم الأفراد والشركات بخبرة تمتد لأكثر من 12 عامًا.</p>
        </div>
        <div>
          <h4>روابط سريعة</h4>
          <ul>
            <li><a href="#about" onClick={goTo}>من نحن</a></li>
            <li><a href="#practice" onClick={goTo}>مجالات الممارسة</a></li>
            <li><a href="#process" onClick={goTo}>آلية العمل</a></li>
            <li><a href="#contact" onClick={goTo}>احجز/ي استشارة</a></li>
          </ul>
        </div>
        <div>
          <h4>ساعات العمل</h4>
          <ul>
            <li>الأحد إلى الخميس</li>
            <li dir="ltr" className="ltr-line">9:00 AM – 6:00 PM</li>
            <li>الاستشارات العاجلة بموعد مسبق</li>
          </ul>
        </div>
        <div>
          <h4>تواصل</h4>
          <ul>
            <li dir="ltr" className="ltr-line">info@laylahusseini.law</li>
            <li>برج الأعمال، الطابق 14</li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 مكتب ليلى الحسيني للمحاماة. جميع الحقوق محفوظة.</span>
        <a href="https://www.linkedin.com/in/maria-zourob" target="_blank" rel="noreferrer" className="credit">
          تصميم وتطوير <b>Maria Anwar</b>
        </a>
      </div>
    </footer>
  );
}
