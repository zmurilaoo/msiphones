/* src/sections/Hero.jsx */
const { useEffect: useEffectHero, useRef: useRefHero, useState: useStateHero } = React;

const CYCLE = ['Compra.', 'Venda.', 'Troca.'];

function Hero() {
  const heroRef   = useRefHero(null);
  const spotRef   = useRefHero(null);
  const wordRef   = useRefHero(null);
  const layerARef = useRefHero(null);
  const layerBRef = useRefHero(null);
  const [wordIdx, setWordIdx] = useStateHero(0);

  const particles = useRefHero(
    Array.from({ length: 34 }, () => ({
      left:  `${4 + Math.random() * 92}%`,
      top:   `${12 + Math.random() * 82}%`,
      size:  1.2 + Math.random() * 3.6,
      delay: Math.random() * 7,
      dur:   3.5 + Math.random() * 5,
    }))
  ).current;

  useEffectHero(() => {
    if (!window.gsap || !heroRef.current) return;

    /* ── Orbs + scan + pulse ── */
    gsap.to('.h-orb-a', { y: -65, x:  32, duration: 12,  repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.h-orb-b', { y:  55, x: -45, duration: 15,  repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 });
    gsap.to('.h-orb-c', { y: -38, x:  58, duration: 9.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 6 });
    gsap.to('.h-pulse', { scale: 1.5, opacity: 0.85, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.fromTo('.h-scan', { top: '-2%', opacity: 0.8 }, { top: '103%', opacity: 0.15, duration: 7, repeat: -1, ease: 'none' });

    /* ── HUD corners ── */
    ['tl','tr','bl','br'].forEach((c, i) => {
      gsap.to(`.h-corner-${c}`, { opacity: 1, x: 0, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.2 + i * 0.15 });
    });

    /* ── Partículas ── */
    heroRef.current.querySelectorAll('.h-ptcl').forEach((p) => {
      gsap.set(p, { opacity: parseFloat(p.dataset.opacity) });
      gsap.to(p, {
        y: -(80 + Math.random() * 110),
        x: (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 50),
        opacity: 0, duration: parseFloat(p.dataset.dur),
        repeat: -1, delay: parseFloat(p.dataset.delay), ease: 'power1.out',
      });
    });

    /* ── Clip-path reveal — cada linha levanta como cortina ── */
    const lines = heroRef.current.querySelectorAll('.h-line-inner');
    gsap.fromTo(lines,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.0, stagger: 0.18, ease: 'power4.out', delay: 0.25 }
    );

    /* ── Badge, sub, CTAs, stats ── */
    const tl = gsap.timeline({ delay: 0.8 });
    tl.from('.h-badge',       { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out' })
      .from('.h-sub',         { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out' }, '-=0.2')
      .from('.h-cta-row',     { opacity: 0, y: 14, duration: 0.55, ease: 'power3.out' }, '-=0.25')
      .from('.h-stat',        { opacity: 0, y: 12, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, '-=0.25')
      .from('.h-scroll-hint', { opacity: 0, y: 8, duration: 0.4, ease: 'power3.out' }, '-=0.2');

    /* ── Counters ── */
    [
      { sel: '.h-sn0', to: 20, suffix: '+' },
      { sel: '.h-sn1', to: 98,   suffix: '%' },
      { sel: '.h-sn2', to: 4.9,  suffix: '★', dec: true },
    ].forEach(({ sel, to, suffix, dec }) => {
      const el = heroRef.current.querySelector(sel);
      if (!el) return;
      const o = { v: 0 };
      gsap.to(o, {
        v: to, duration: 2.4, ease: 'power2.out', delay: 1.6,
        onUpdate: () => { el.textContent = (dec ? o.v.toFixed(1) : Math.round(o.v).toLocaleString('pt-BR')) + suffix; },
      });
    });

    /* ── Spotlight segue mouse ── */
    const hero = heroRef.current;
    const spot = spotRef.current;
    const onMove = (e) => {
      if (!spot) return;
      const r = hero.getBoundingClientRect();
      gsap.to(spot, { x: e.clientX - r.left - 300, y: e.clientY - r.top - 300, duration: 0.6, ease: 'power2.out' });
    };

    /* ── Parallax de profundidade no mouse ── */
    const onParallax = (e) => {
      const r  = hero.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width  - 0.5;
      const cy = (e.clientY - r.top)  / r.height - 0.5;
      if (layerARef.current) gsap.to(layerARef.current, { x: cx * -30, y: cy * -20, duration: 0.9, ease: 'power2.out' });
      if (layerBRef.current) gsap.to(layerBRef.current, { x: cx * -12, y: cy * -8,  duration: 1.0, ease: 'power2.out' });
      gsap.to('.h-orb-a', { x: cx * 60, y: cy * 45, duration: 1.3, ease: 'power2.out', overwrite: false });
      gsap.to('.h-orb-b', { x: cx * -50, y: cy * -35, duration: 1.5, ease: 'power2.out', overwrite: false });
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mousemove', onParallax);
    return () => { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mousemove', onParallax); };
  }, []);

  /* ── Word cycling ── */
  useEffectHero(() => {
    if (!window.gsap) return;
    const id = setInterval(() => {
      const el = wordRef.current;
      if (!el) return;
      gsap.to(el, {
        yPercent: -110, opacity: 0, duration: 0.38, ease: 'power2.in',
        onComplete: () => {
          setWordIdx(i => (i + 1) % CYCLE.length);
          gsap.fromTo(el,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0,   opacity: 1, duration: 0.42, ease: 'power3.out' }
          );
        },
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const cornerBase = { position: 'absolute', width: 30, height: 30, zIndex: 4, opacity: 0, pointerEvents: 'none', borderColor: 'rgba(255,0,32,0.75)' };
  const FONT = '"Space Grotesk", var(--font-display)';

  return (
    <section ref={heroRef} className="h-hero" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center' }}>

      {/* Vídeo */}
      <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'contrast(1.1) saturate(0.7) brightness(0.44)' }}>
        <source src="assets/videos/video1/4043-176748917_medium.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradiente */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(155deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.88) 100%)' }} />

      {/* Pixel grid */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0.04, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,0,32,0.7) 1px, transparent 1px),linear-gradient(90deg, rgba(255,0,32,0.7) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Spotlight */}
      <div ref={spotRef} style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,0,32,0.2) 0%, rgba(255,0,32,0.05) 45%, transparent 70%)', filter: 'blur(18px)', zIndex: 3, pointerEvents: 'none', top: 0, left: 0 }} />

      {/* Scan */}
      <div className="h-scan" style={{ position: 'absolute', left: 0, right: 0, height: 1.5, zIndex: 5, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(255,0,32,1) 50%, transparent)', boxShadow: '0 0 20px rgba(255,0,32,0.65), 0 0 55px rgba(255,0,32,0.2)' }} />

      {/* Orbs */}
      <div className="h-orb-a" style={{ position: 'absolute', top: '4%', left: '-2%', width: 800, height: 800, background: 'radial-gradient(circle, rgba(255,0,32,0.38) 0%, transparent 65%)', filter: 'blur(90px)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="h-orb-b" style={{ position: 'absolute', bottom: '-10%', right: '-4%', width: 880, height: 880, background: 'radial-gradient(circle, rgba(140,0,18,0.35) 0%, transparent 65%)', filter: 'blur(110px)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="h-orb-c" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,30,50,0.16) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="h-pulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 540, height: 270, zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(ellipse, rgba(255,0,32,0.24) 0%, transparent 70%)', filter: 'blur(70px)', opacity: 0.35 }} />

      {/* HUD Corners */}
      <div className="h-corner-tl" style={{ ...cornerBase, top: 24, left: 24, borderTop: '2px solid', borderLeft: '2px solid', transform: 'translate(-8px,-8px)' }} />
      <div className="h-corner-tr" style={{ ...cornerBase, top: 24, right: 24, borderTop: '2px solid', borderRight: '2px solid', transform: 'translate(8px,-8px)' }} />
      <div className="h-corner-bl" style={{ ...cornerBase, bottom: 24, left: 24, borderBottom: '2px solid', borderLeft: '2px solid', transform: 'translate(-8px,8px)' }} />
      <div className="h-corner-br" style={{ ...cornerBase, bottom: 24, right: 24, borderBottom: '2px solid', borderRight: '2px solid', transform: 'translate(8px,8px)' }} />

      {/* Partículas */}
      {particles.map((p, i) => (
        <div key={i} className="h-ptcl"
          data-dur={p.dur} data-delay={p.delay}
          data-opacity={p.size > 3.2 ? 0.7 : 0.35}
          style={{ position: 'absolute', left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: '50%', background: i % 3 === 0 ? '#fff' : '#FF0020', opacity: 0, zIndex: 3, pointerEvents: 'none', boxShadow: `0 0 ${Math.round(p.size * 4)}px ${i % 3 === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(255,0,32,0.75)'}` }}
        />
      ))}

      {/* ── Conteúdo ── */}
      <div className="msi-container" style={{ position: 'relative', zIndex: 6, paddingTop: 110, paddingBottom: 100 }}>

        {/* Camada títulos — mais parallax */}
        <div ref={layerARef}>

          {/* Badge */}
          <div className="h-badge" style={{ marginBottom: 28 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,0,32,0.12)', border: '1px solid rgba(255,0,32,0.32)', borderRadius: 100, padding: '5px 14px', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF0020', boxShadow: '0 0 8px #FF0020', display: 'inline-block', animation: 'msi-glow-pulse 1.6s ease-in-out infinite' }} />
              Estoque Certificado · IMEI Verificado
            </span>
          </div>

          {/* Linha estática */}
          <div style={{ overflow: 'hidden' }}>
            <div className="h-line-inner" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(48px, 7.5vw, 104px)', color: '#fff', letterSpacing: '-0.025em', lineHeight: 0.92 }}>
              iPhone Premium.
            </div>
          </div>

          {/* Linha com word cycling */}
          <div style={{ overflow: 'hidden', marginTop: 6 }}>
            <div className="h-line-inner" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(48px, 7.5vw, 104px)', letterSpacing: '-0.025em', lineHeight: 0.92, display: 'flex', alignItems: 'baseline', gap: '0.18em' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Para</span>
              <span style={{ overflow: 'hidden', display: 'inline-block', verticalAlign: 'bottom' }}>
                <span ref={wordRef} style={{ display: 'inline-block', color: 'var(--msi-red)', textShadow: '0 0 60px rgba(255,0,32,0.6)' }}>
                  {CYCLE[wordIdx]}
                </span>
              </span>
            </div>
          </div>

          {/* Linha complementar */}
          <div style={{ overflow: 'hidden', marginTop: 6 }}>
            <div className="h-line-inner" style={{ fontFamily: FONT, fontWeight: 600, fontSize: 'clamp(20px, 2.6vw, 36px)', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.01em', lineHeight: 1 }}>
              Novos · Seminovos · Trade-in
            </div>
          </div>
        </div>

        {/* Camada sub/stats — menos parallax */}
        <div ref={layerBRef}>
          <p className="h-sub" style={{ marginTop: 32, maxWidth: 500, fontSize: 17, lineHeight: 1.72, color: 'rgba(255,255,255,0.6)', fontWeight: 400, fontFamily: 'var(--font-body)' }}>
            Todo aparelho diagnosticado em 47 pontos. Bateria garantida, IMEI verificado e laudo técnico incluso. Compra, venda ou troca — sempre no melhor preço.
          </p>

          <div className="h-cta-row h-cta-group" style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#vitrine">
              <Button variant="primary" size="lg" iconRight={<IconArrow size={16} />}>Ver vitrine</Button>
            </a>
            <a href="#tradein">
              <Button variant="ghost" size="lg" icon={<IconSwap size={16} />}>Avaliar meu iPhone</Button>
            </a>
          </div>

          {/* Stats */}
          <div className="h-stats" style={{ marginTop: 52, display: 'flex', gap: 44, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {[
              { cls: 'h-sn0', label: 'Aparelhos vendidos' },
              { cls: 'h-sn1', label: 'Clientes satisfeitos' },
              { cls: 'h-sn2', label: 'Avaliação média' },
            ].map(({ cls, label }, i) => (
              <div key={i} className="h-stat">
                <div className="h-stat-num" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>
                  <span className={cls}>0</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6, fontFamily: 'var(--font-mono)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="h-scroll-hint" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          <div style={{ width: 22, height: 36, border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: 11, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 2.5, height: 7, background: 'rgba(255,0,32,0.9)', borderRadius: 100, animation: 'h-scroll-dot 1.6s ease-in-out infinite' }} />
          </div>
          Scroll
        </div>
      </div>

      <style>{`
        @keyframes h-scroll-dot {
          0%,100% { transform: translateY(0); opacity: 1; }
          55%      { transform: translateY(11px); opacity: 0.15; }
        }
        @media (max-width: 768px) {
          .h-hero { padding: 80px 0 60px !important; }
          .h-orb-a, .h-orb-b, .h-orb-c { display: none !important; }
          .h-stats { flex-direction: column !important; gap: 16px !important; align-items: flex-start !important; }
          .h-stat-num { font-size: 28px !important; }
          .h-cta-group { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .h-badge { margin-bottom: 16px !important; }
          .h-scroll-hint { display: none !important; }
        }
        @media (max-width: 480px) {
          .h-cta-group { width: 100% !important; }
          .h-cta-group > * { width: 100% !important; justify-content: center !important; }
        }
      `}</style>
    </section>
  );
}

Object.assign(window, { Hero });
