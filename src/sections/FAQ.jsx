/* src/sections/FAQ.jsx */
const { useState: useStateFAQ, useEffect: useEffectFAQ, useRef: useRefFAQ } = React;

/* ── Word-reveal helper ── */
function WAFAQ({ children }) {
  const words = String(children).trim().split(/\s+/);
  return words.map((w, i) => (
    <span key={i} className="w-wrap" style={{ marginRight: i < words.length - 1 ? '0.28em' : 0 }}>
      <span>{w}</span>
    </span>
  ));
}

/* ── FAQ Item ── */
function FaqItem({ item, i, open, onToggle }) {
  const isOpen = open === i;
  const numRef = useRefFAQ(null);

  return (
    <div
      className="faq-item"
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.currentTarget.style.transform = 'translateX(4px)';
          e.currentTarget.style.borderColor = 'rgba(255,0,32,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        if (!isOpen) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
      }}
      style={{
        background: '#fff',
        border: `1px solid ${isOpen ? 'rgba(255,0,32,0.32)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 18, overflow: 'hidden',
        transition: 'border-color .25s, transform .25s, box-shadow .25s',
        boxShadow: isOpen
          ? '0 16px 40px -12px rgba(255,0,32,0.22)'
          : '0 2px 10px -4px rgba(0,0,0,0.05)',
        position: 'relative',
      }}
    >
      {/* Barra lateral vermelha animada */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: 'var(--msi-red)',
        transform: isOpen ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'top',
        transition: 'transform .38s cubic-bezier(.22,1,.36,1)',
        borderRadius: '0 0 0 18px',
      }} />

      {/* Número decorativo de fundo */}
      <div style={{
        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 800,
        color: isOpen ? 'rgba(255,0,32,0.06)' : 'rgba(0,0,0,0.04)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        transition: 'color .3s',
      }}>
        {String(i + 1).padStart(2, '0')}
      </div>

      <button
        onClick={() => onToggle(isOpen ? -1 : i)}
        style={{
          width: '100%', textAlign: 'left',
          background: isOpen ? 'rgba(255,0,32,0.025)' : 'transparent',
          border: 0, color: 'var(--msi-card-ink)',
          padding: '22px 28px 22px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          fontSize: 16.5, fontWeight: 600, letterSpacing: '-0.005em',
          fontFamily: 'var(--font-display)', cursor: 'pointer',
          transition: 'background .2s',
        }}
      >
        <span style={{ flex: 1, lineHeight: 1.3 }}>{item.q}</span>
        <span style={{
          flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
          background: isOpen ? 'var(--msi-red)' : '#f0f0f3',
          color: isOpen ? '#fff' : 'var(--msi-card-ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .32s cubic-bezier(.22,1,.36,1)',
          boxShadow: isOpen ? '0 4px 14px rgba(255,0,32,0.35)' : 'none',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .32s cubic-bezier(.22,1,.36,1)' }}>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <div style={{
        maxHeight: isOpen ? 400 : 0, overflow: 'hidden',
        transition: 'max-height .42s cubic-bezier(.22,1,.36,1)',
      }}>
        <div style={{ padding: '0 28px 24px 24px', color: 'var(--msi-card-mute)', fontSize: 15.5, lineHeight: 1.7 }}>
          {item.a}
        </div>
      </div>
    </div>
  );
}

/* ── Stat Card com counter animado ── */
function StatCard({ value, label, suffix, className }) {
  const ref = useRefFAQ(null);

  useEffectFAQ(() => {
    if (!window.gsap || !ref.current) return;
    const isDecimal = String(value).includes('.');
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value, duration: 2.2, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      onUpdate() {
        if (!ref.current) return;
        const n = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toLocaleString('pt-BR');
        ref.current.textContent = n + suffix;
      },
    });
  }, []);

  return (
    <div
      className={className}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 10px 30px -8px rgba(255,0,32,0.2)';
        e.currentTarget.style.borderColor = 'rgba(255,0,32,0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)';
      }}
      style={{
        padding: '18px 22px', borderRadius: 16,
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s, border-color .28s',
        cursor: 'default', overflow: 'hidden', position: 'relative',
      }}
    >
      {/* Glow de fundo */}
      <div style={{
        position: 'absolute', right: -20, top: -20, width: 80, height: 80,
        background: 'radial-gradient(circle, rgba(255,0,32,0.08), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <span ref={ref} style={{
        fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
        color: 'var(--msi-red)', letterSpacing: '-0.03em', lineHeight: 1,
      }}>
        0{suffix}
      </span>
      <span style={{ fontSize: 13.5, color: 'var(--msi-card-mute)', lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useStateFAQ(0);
  const sectionRef = useRefFAQ(null);

  useEffectFAQ(() => {
    if (!window.gsap || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true },
    });

    tl.from(sectionRef.current.querySelector('.faq-badge'), { opacity: 0, y: 18, duration: 0.55, ease: 'power3.out' })
      .from(sectionRef.current.querySelectorAll('.faq-h2 .w-wrap > span'), {
        y: '115%', opacity: 0, duration: 0.82, stagger: 0.055, ease: 'power4.out',
      }, '-=0.1')
      .from(sectionRef.current.querySelector('.faq-desc'), { opacity: 0, y: 18, duration: 0.6, ease: 'power3.out' }, '-=0.35')
      .from(sectionRef.current.querySelector('.faq-cta'), { opacity: 0, y: 14, scale: 0.94, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.35')
      .from(sectionRef.current.querySelectorAll('.faq-stat'), {
        opacity: 0, x: -24, duration: 0.55, stagger: 0.1, ease: 'power3.out',
      }, '-=0.3')
      .from(sectionRef.current.querySelectorAll('.faq-item'), {
        opacity: 0, y: 26, duration: 0.6, stagger: 0.09, ease: 'power3.out',
      }, '-=0.5');

    /* Shapes flutuantes */
    gsap.to('.faq-shape-wrapper', {
      y: -20, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
    gsap.to('.faq-shape-wrapper-2', {
      y: 15, duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2,
    });
  }, []);

  return (
    <section id="faq" ref={sectionRef} style={{ padding: '120px 0', background: '#f5f5f7', position: 'relative', overflow: 'hidden' }}>

      {/* ── Shapes concêntricos — esquerda ── */}
      <div className="faq-shape-wrapper" style={{ position: 'absolute', top: '8%', left: -150, width: 300, height: 300, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, border: '1.5px solid rgba(255,0,32,0.1)', borderRadius: 56, animation: 'msi-spin-slow 38s linear infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -90, marginLeft: -90, width: 180, height: 180 }}>
          <div style={{ width: '100%', height: '100%', border: '1.5px solid rgba(255,0,32,0.16)', borderRadius: 38, animation: 'msi-spin-slow 26s linear infinite reverse' }} />
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -46, marginLeft: -46, width: 92, height: 92 }}>
          <div style={{ width: '100%', height: '100%', border: '2.5px solid rgba(255,0,32,0.26)', borderRadius: 20, animation: 'msi-spin-slow 16s linear infinite' }} />
        </div>
        {/* Ponto central */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -6, marginLeft: -6, width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,0,32,0.35)' }} />
      </div>

      {/* ── Shapes concêntricos — direita inferior ── */}
      <div className="faq-shape-wrapper-2" style={{ position: 'absolute', bottom: '5%', right: -120, width: 240, height: 240, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,0,32,0.08)', borderRadius: '50%', animation: 'msi-spin-slow 30s linear infinite reverse' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -65, marginLeft: -65, width: 130, height: 130 }}>
          <div style={{ width: '100%', height: '100%', border: '1px solid rgba(255,0,32,0.14)', borderRadius: '50%', animation: 'msi-spin-slow 20s linear infinite' }} />
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -32, marginLeft: -32, width: 64, height: 64 }}>
          <div style={{ width: '100%', height: '100%', border: '1.5px solid rgba(255,0,32,0.22)', borderRadius: '50%', animation: 'msi-spin-slow 12s linear infinite reverse' }} />
        </div>
      </div>

      {/* ── Dot grid decorativo ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.35,
        backgroundImage: 'radial-gradient(circle, rgba(255,0,32,0.2) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)',
      }} />

      <div className="msi-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'flex-start' }} className="faq-grid">

          {/* ── Coluna esquerda ── */}
          <div>
            <span className="faq-badge"><Badge tone="cardRed">DÚVIDAS FREQUENTES</Badge></span>
            <h2 className="faq-h2" style={{ fontSize: 'clamp(32px, 3.8vw, 50px)', marginTop: 18, lineHeight: 1.08, color: 'var(--msi-card-ink)' }}>
              <WAFAQ>A gente responde</WAFAQ>
              <br />
              <span style={{ color: 'var(--msi-red)' }}><WAFAQ>antes de você perguntar.</WAFAQ></span>
            </h2>
            <p className="faq-desc" style={{ color: 'var(--msi-card-mute)', marginTop: 14, fontSize: 15.5, lineHeight: 1.65 }}>
              Não achou sua dúvida? Manda no WhatsApp — consultor real, resposta em minutos.
            </p>
            <div className="faq-cta" style={{ marginTop: 20 }}>
              <a href={buildWhatsAppLink('uma dúvida')} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="md" icon={<IconWhatsApp size={16} />}>Falar com consultor</Button>
              </a>
            </div>

            {/* Stats com counter animado */}
            <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <StatCard className="faq-stat" value={2400} label="aparelhos vendidos" suffix="+" />
              <StatCard className="faq-stat" value={98}   label="clientes satisfeitos" suffix="%" />
              <StatCard className="faq-stat" value={4.9}  label="avaliação média" suffix=" ★" />
            </div>
          </div>

          {/* ── Coluna direita: perguntas ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MSI_FAQ.map((item, i) => (
              <FaqItem key={i} item={item} i={i} open={open} onToggle={setOpen} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .faq-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}

Object.assign(window, { FAQ });
