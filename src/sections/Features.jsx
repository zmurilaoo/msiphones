/* src/sections/Features.jsx */
const { useEffect: useEffectFeat, useRef: useRefFeat, useState: useStateFeat } = React;

function FeatureCard({ f, i, last }) {
  const [hover, setHover] = useStateFeat(false);
  const isRed = i % 2 === 1;
  const cardRef = useRefFeat(null);

  const onMove = (e) => {
    if (!cardRef.current || !window.gsap) return;
    const r = cardRef.current.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    gsap.to(cardRef.current, { rotateY: dx * 6, rotateX: -dy * 5, transformPerspective: 900, duration: 0.3, ease: 'power2.out', overwrite: true });
  };

  const onLeave = () => {
    setHover(false);
    if (!cardRef.current || !window.gsap) return;
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: true });
  };

  const addRipple = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'feat-ripple';
    el.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;background:${isRed ? 'rgba(255,255,255,0.25)' : 'rgba(255,0,32,0.12)'};`;
    cardRef.current.appendChild(el);
    setTimeout(() => el.remove(), 750);
  };

  return (
    <div
      ref={cardRef}
      className={`feat-card feat-card-${i}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={addRipple}
      style={{
        background: isRed ? 'var(--msi-red)' : '#ffffff',
        color: isRed ? '#fff' : 'var(--msi-card-ink)',
        padding: '44px 36px', minHeight: 300,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        position: 'relative', overflow: 'hidden',
        transition: 'box-shadow .35s',
        boxShadow: hover
          ? (isRed ? '0 32px 80px -16px rgba(255,0,32,0.6)' : '0 32px 80px -16px rgba(0,0,0,0.2)')
          : (!last ? 'inset -1px 0 0 rgba(0,0,0,0.08)' : 'none'),
        cursor: 'default',
      }}
    >
      {/* Linha topo animada */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: hover
          ? (isRed ? 'linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)' : 'linear-gradient(90deg,transparent,var(--msi-red),transparent)')
          : 'transparent',
        transition: 'background .4s',
      }} />

      {/* Glow de fundo no hover */}
      <div style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 300, borderRadius: '50%',
        background: isRed
          ? 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(255,0,32,0.12) 0%, transparent 70%)',
        opacity: hover ? 1 : 0, transition: 'opacity .4s', pointerEvents: 'none',
      }} />

      {/* Ícone — sem rotação, só scale suave */}
      <div className={`feat-icon feat-icon-${i}`} style={{
        width: 60, height: 60, borderRadius: 18,
        background: isRed ? 'rgba(255,255,255,0.18)' : 'rgba(255,0,32,0.08)',
        border: `1.5px solid ${isRed ? 'rgba(255,255,255,0.4)' : 'rgba(255,0,32,0.3)'}`,
        color: isRed ? '#fff' : 'var(--msi-red)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform .35s cubic-bezier(.22,1,.36,1), background .3s, box-shadow .3s',
        transform: hover ? 'scale(1.14) translateY(-3px)' : 'scale(1) translateY(0)',
        boxShadow: hover
          ? (isRed ? '0 8px 24px rgba(0,0,0,0.2)' : '0 8px 24px rgba(255,0,32,0.2)')
          : 'none',
        position: 'relative', zIndex: 1, marginBottom: 32,
      }}>{f.icon}</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em', color: 'inherit', lineHeight: 1.25 }}>{f.title}</h3>
        <p style={{ color: isRed ? 'rgba(255,255,255,0.85)' : 'var(--msi-card-mute)', fontSize: 14.5, lineHeight: 1.6 }}>{f.desc}</p>
      </div>

      <div style={{ position: 'absolute', top: 18, right: 22, fontFamily: 'var(--font-mono)', fontSize: 10, color: isRed ? 'rgba(255,255,255,0.5)' : 'var(--msi-card-mute)', letterSpacing: '0.1em', zIndex: 1 }}>
        <span className={`feat-num feat-num-${i}`}>0{i + 1} / 04</span>
      </div>
    </div>
  );
}

function Features() {
  const sectionRef = useRefFeat(null);

  const features = [
    { icon: <IconShield size={26} />, title: 'Laudo técnico em 47 pontos',    desc: 'Bateria, sensores, câmera, Face ID, IMEI verificado na operadora. Você recebe o relatório completo.' },
    { icon: <IconSwap size={26} />,   title: 'Avaliação justa para trade-in', desc: 'Tabela transparente baseada em modelo, saúde de bateria e estado. Sem desconto surpresa na hora da troca.' },
    { icon: <IconSpark size={26} />,  title: 'Atendimento VIP humano',        desc: 'WhatsApp direto com um consultor real. Resposta em minutos, das 8h às 22h, todos os dias.' },
    { icon: <IconChip size={26} />,   title: 'Garantia msiphone',             desc: '90 dias em seminovos certificados. 12 meses Apple + 3 meses msiphone em aparelhos lacrados.' },
  ];

  useEffectFeat(() => {
    if (!window.gsap || !sectionRef.current) return;

    /* ── estados iniciais ── */
    gsap.set(sectionRef.current.querySelector('.feat-badge'),                       { opacity: 0, y: -20 });
    gsap.set(sectionRef.current.querySelectorAll('.feat-title-word > span'),        { y: '115%', opacity: 0, rotateX: -35 });
    gsap.set(sectionRef.current.querySelectorAll('.feat-card'),                     { autoAlpha: 0, y: 80, scale: 0.86 });
    gsap.set(sectionRef.current.querySelectorAll('.feat-icon'),                     { scale: 0, opacity: 0, rotation: -90 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
    });

    tl
      /* badge */
      .to(sectionRef.current.querySelector('.feat-badge'),
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })

      /* título — flip 3D palavra a palavra */
      .to(sectionRef.current.querySelectorAll('.feat-title-word > span'), {
        y: '0%', opacity: 1, rotateX: 0,
        transformPerspective: 700,
        duration: 0.85, stagger: 0.06, ease: 'power4.out',
      }, '-=0.15')

      /* cards entram em cascata */
      .to(sectionRef.current.querySelectorAll('.feat-card'), {
        autoAlpha: 1, y: 0, scale: 1,
        transformPerspective: 1000,
        duration: 0.8, stagger: 0.12, ease: 'power3.out',
      }, '-=0.5')

      /* ícones surgem com mola */
      .to(sectionRef.current.querySelectorAll('.feat-icon'), {
        scale: 1, opacity: 1, rotation: 0,
        duration: 0.6, stagger: 0.1, ease: 'back.out(2.2)',
      }, '-=0.65');

    /* contador count-up */
    sectionRef.current.querySelectorAll('.feat-num').forEach((el, i) => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: i + 1, duration: 0.7, snap: { val: 1 }, ease: 'power2.out',
        delay: 1.0 + i * 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        onUpdate() { el.textContent = `0${Math.round(obj.val)} / 04`; },
      });
    });

    /* orbs flutuantes */
    gsap.to('.feat-orb-1', { x: 28, y: -22, scale: 1.12, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.feat-orb-2', { x: -20, y: 28, scale: 0.9,  duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3.5 });
    gsap.to('.feat-orb-3', { x: 14,  y: 18, scale: 1.08, duration: 8,  repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 });
  }, []);

  const onSectionMove = (e) => {
    if (!window.gsap || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width  - 0.5;
    const dy = (e.clientY - r.top)  / r.height - 0.5;
    gsap.to('.feat-orb-1', { x: dx * 55, y: dy * 38, duration: 1.6, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.feat-orb-2', { x: -dx * 38, y: -dy * 28, duration: 2,  ease: 'power2.out', overwrite: 'auto' });
  };

  return (
    <section id="features" ref={sectionRef} onMouseMove={onSectionMove}
      style={{ padding: '120px 0', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>

      {/* Orbs decorativos */}
      <div className="feat-orb-1" style={{ position: 'absolute', top: '-6%', right: '-9%', width: 520, height: 520, background: 'radial-gradient(circle, rgba(255,0,32,0.08) 0%, transparent 70%)', filter: 'blur(55px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div className="feat-orb-2" style={{ position: 'absolute', bottom: '-9%', left: '-6%', width: 420, height: 420, background: 'radial-gradient(circle, rgba(255,0,32,0.06) 0%, transparent 70%)', filter: 'blur(65px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div className="feat-orb-3" style={{ position: 'absolute', top: '45%', left: '40%', width: 260, height: 260, background: 'radial-gradient(circle, rgba(255,0,32,0.05) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div className="msi-container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <span className="feat-badge"><Badge tone="cardRed">POR QUE MSIPHONE</Badge></span>
          <h2 className="feat-title" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', marginTop: 18, lineHeight: 1.02, color: 'var(--msi-card-ink)' }}>
            {'Quatro razões para nunca mais'.split(' ').map((w, i) => (
              <span key={i} className="feat-title-word" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.28em' }}>
                <span style={{ display: 'inline-block' }}>{w}</span>
              </span>
            ))}
            <br />
            <span style={{ color: 'var(--msi-red)' }}>
              {'comprar iPhone no escuro.'.split(' ').map((w, i) => (
                <span key={i} className="feat-title-word" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.28em' }}>
                  <span style={{ display: 'inline-block' }}>{w}</span>
                </span>
              ))}
            </span>
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 0,
          borderRadius: 28, overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.07)',
        }}>
          {features.map((f, i) => <FeatureCard key={i} f={f} i={i} last={i === features.length - 1} />)}
        </div>
      </div>

      <style>{`
        .feat-ripple {
          position: absolute;
          width: 14px; height: 14px;
          border-radius: 50%;
          transform: scale(0) translate(-50%, -50%);
          animation: feat-ripple-anim .75s ease-out forwards;
          pointer-events: none; z-index: 10;
        }
        @keyframes feat-ripple-anim {
          to { transform: scale(26) translate(-50%, -50%); opacity: 0; }
        }
        @media (max-width: 900px) {
          #features .msi-container > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

Object.assign(window, { Features });
