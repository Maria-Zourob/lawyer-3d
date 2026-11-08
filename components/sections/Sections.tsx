'use client';

import { useEffect, useRef, useState } from 'react';
import { practiceAreas, stats, credentials, steps, type Practice as PracticeItem } from '@/lib/data';
import { scrollToTarget } from '@/lib/lenis';
import Illustration from './Illustration';

export function goTo(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href');
  if (!href?.startsWith('#')) return;
  const el = document.querySelector(href);
  if (!el) return;
  e.preventDefault();
  scrollToTarget(el);
}

export function Hero() {
  return (
    <section id="hero">
      <div className="wrap">
        <div className="half hero-half">
          <div className="eyebrow hero-in">مكتب ليلى الحسيني للمحاماة</div>
          <h1>
            <span className="line"><span>حين تكون حقوقك</span></span>
            <span className="line"><span>على المحك،</span></span>
            <span className="line"><span>نكون <span className="gold">في صفّك.</span></span></span>
          </h1>
          <p className="lead hero-in">
            تمثيل قانوني دقيق للأفراد والشركات، من صياغة أول عقد حتى صدور الحكم النهائي.
          </p>
          <div className="hero-cta hero-in">
            <a href="#contact" className="btn solid magnetic" onClick={goTo}>احجز/ي استشارتك</a>
            <a href="#practice" className="btn ghost magnetic" onClick={goTo}>استكشف/ي خدماتنا</a>
          </div>
          <div className="trust hero-in">
            <div><b dir="ltr">12+</b><span>عامًا من الخبرة</span></div>
            <div><b dir="ltr">480+</b><span>قضية مُنجزة</span></div>
            <div><b dir="ltr">150+</b><span>شركة تثق بنا</span></div>
          </div>
        </div>
      </div>
      <div className="hint-3d hero-in">
        <svg viewBox="0 0 24 36" width="14" height="21" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="22" height="34" rx="11" /><path className="wheel" d="M12 8v6" /></svg>
        اضغط/ي على إحدى كفّتَي الميزان
      </div>
      <div className="scroll-hint">للأسفل<i /></div>
    </section>
  );
}

export function Marquee() {
  const words = ['النزاهة', 'الدقة', 'السرية', 'الالتزام', 'الخبرة', 'الإنصاف'];
  const row = [...words, ...words, ...words, ...words];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.map((w, i) => (
          <span key={i}>{w}<i /></span>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="left">
      <div className="wrap">
        <div className="half">
          <div className="eyebrow reveal">من نحن</div>
          <h2 className="reveal">خلف كل ملف، <span className="gold">إنسانٌ</span> ينتظر الإنصاف</h2>
          <p className="lead reveal">
            نؤمن أن القضية لا تُكسب بالنصوص وحدها. نصغي إليك جيدًا، نفهم وضعك بكل تفاصيله، ثم نبني استراتيجية قانونية واضحة ونرافقك فيها خطوة بخطوة.
          </p>
          <div className="about-grid">
            {credentials.map((c) => (
              <div className="chip reveal" key={c.title}><b>{c.title}</b><span>{c.text}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PracticeCard({ p, i }: { p: PracticeItem; i: number }) {
  const card = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [hasPhoto, setHasPhoto] = useState(true);

  // the image may fail before hydration, so check it after mount too
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setHasPhoto(false);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 9}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 11}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div className="card-wrap">
      <article ref={card} className="card" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className={`card-media ${hasPhoto ? 'has-photo' : ''}`}>
          <div className="media-parallax">
            <Illustration kind={p.art} />
            {hasPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img ref={img} className="photo" src={p.image} alt={p.title} loading="lazy" onError={() => setHasPhoto(false)} />
            )}
          </div>
          <div className="media-tint" />
          <span className="num">{String(i + 1).padStart(2, '0')}</span>
        </div>
        <div className="card-body">
          <h3>{p.title}</h3>
          <p>{p.text}</p>
          <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="shine" />
      </article>
    </div>
  );
}

export function Practice() {
  return (
    <section id="practice">
      <div className="practice-head">
        <div className="eyebrow">مجالات الممارسة</div>
        <h2>خبرة تغطي <span className="gold">كل جوانب</span> قضيتك</h2>
        <div className="h-progress"><i /></div>
      </div>
      <div className="track" id="track">
        {practiceAreas.map((p, i) => (
          <PracticeCard key={p.title} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

export function Results() {
  return (
    <section id="results">
      <div className="wrap">
        <div className="half push-left">
          <div className="eyebrow reveal">الإنجازات</div>
          <h2 className="reveal">سجلٌّ <span className="gold">يتحدث</span> عنّا</h2>
          <div className="stats reveal">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="n" dir="ltr">
                  <span data-count={s.value}>0</span>
                  <span className="suffix">{s.suffix}</span>
                </div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="left">
      <div className="wrap">
        <div className="half">
          <div className="eyebrow reveal">آلية العمل</div>
          <h2 className="reveal">من أول جلسة <span className="gold">حتى الحكم</span></h2>
          <div className="steps">
            <div className="rail"><i id="railFill" /></div>
            {steps.map((s, i) => (
              <div className="step reveal" key={s.title}>
                <span className="step-no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact">
      <div className="wrap">
        <div className="half push-left">
          <div className="eyebrow reveal">تواصل معنا</div>
          <h2 className="reveal">قضيتك تبدأ <span className="gold">بمحادثة</span></h2>
          <p className="lead reveal">احجز/ي استشارتك الأولى، وسنعود إليك خلال 24 ساعة عمل.</p>
          <form
            className="reveal"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              e.currentTarget.reset();
            }}
          >
            <div className="row">
              <input required placeholder="الاسم الكامل" />
              <input required type="tel" dir="rtl" inputMode="tel" placeholder="رقم الجوال" />
            </div>
            <select defaultValue="">
              <option value="" disabled>نوع القضية</option>
              <option>تجاري</option><option>عقود</option><option>أحوال شخصية</option><option>تقاضي وتحكيم</option><option>عقارات</option><option>ملكية فكرية</option>
            </select>
            <textarea placeholder="نبذة مختصرة عن موضوعك" />
            <div className="form-foot">
              <button className="btn solid magnetic" type="submit">إرسال الطلب</button>
              {sent && <span className="sent">تم استلام طلبك، سنتواصل معك قريبًا.</span>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
