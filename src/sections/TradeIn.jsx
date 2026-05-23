/* src/sections/TradeIn.jsx */
const { useState: useStateTI, useEffect: useEffectTI, useRef: useRefTI, useMemo: useMemoTI } = React;

function WATi({ children }) {
  const words = String(children).trim().split(/\s+/);
  return words.map((w, i) => (
    <span key={i} className="w-wrap" style={{
      display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom',
      marginRight: i < words.length - 1 ? '0.28em' : 0,
    }}>
      <span style={{ display: 'inline-block' }}>{w}</span>
    </span>
  ));
}

function BatteryIcon({ value, color }) {
  const fillW = Math.max(0, Math.min(17, ((value - 60) / 40) * 17));
  return (
    <svg width="28" height="15" viewBox="0 0 28 15" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="3" width="22" height="9" rx="2.5" stroke={color} strokeWidth="1.5" style={{ transition: 'stroke .4s' }}/>
      <rect x="23.5" y="5.5" width="2.5" height="4" rx="1.25" fill={color} style={{ transition: 'fill .4s' }}/>
      <rect x="2.5" y="4.5" width={fillW} height="6" rx="1.5" fill={color} style={{ transition: 'width .3s ease, fill .4s' }}/>
    </svg>
  );
}

function BatterySlider({ value, onChange }) {
  const pct = ((value - 60) / 40) * 100;
  const color = value >= 95 ? '#16a34a' : value >= 88 ? '#22c55e' : value >= 80 ? '#f59e0b' : '#dc2626';
  const label = value >= 95 ? 'Excelente' : value >= 90 ? 'Ótima' : value >= 85 ? 'Boa' : value >= 78 ? 'Regular' : 'Fraca';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BatteryIcon value={value} color={color} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--msi-card-mute)' }}>
            Saúde da bateria
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color,
            background: `${color}18`, padding: '3px 9px', borderRadius: 100,
            border: `1px solid ${color}30`, transition: 'all .4s ease',
          }}>{label}</span>
          <span style={{ color: 'var(--msi-card-ink)', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700 }}>
            {value}%
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: 6, borderRadius: 100, background: '#e8e8ec' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: 100, transition: 'width .2s ease, background .4s ease',
            boxShadow: `0 0 8px ${color}44`,
          }} />
        </div>
        {/* Custom thumb */}
        <div style={{
          position: 'absolute', left: `calc(${pct}% * (100% - 22px) / 100%)`,
          width: 22, height: 22, borderRadius: '50%',
          background: '#fff', border: `2.5px solid ${color}`,
          boxShadow: `0 2px 12px ${color}55`,
          transition: 'left .15s ease, border-color .4s, box-shadow .4s',
          pointerEvents: 'none', zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, transition: 'background .4s' }} />
        </div>
        {/* Native range (invisible, for interaction only) */}
        <input
          type="range" min="60" max="100" value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 3, margin: 0 }}
        />
      </div>
    </div>
  );
}

function TradeIn() {
  const [form, setForm] = useStateTI({ model: 'iPhone 14', batteryHealth: 89, condition: 'bom' });
  const [estimate, setEstimate] = useStateTI(null);
  const [loading, setLoading] = useStateTI(false);
  const [cardHover, setCardHover] = useStateTI(false);
  const sectionRef = useRefTI(null);

  const particles = useMemoTI(() => Array.from({ length: 16 }, (_, i) => ({
    top:  `${5  + (i * 13.7) % 90}%`,
    left: `${3  + (i * 17.3) % 94}%`,
    size: 3 + (i % 4) * 2,
    opacity: 0.1 + (i % 5) * 0.05,
  })), []);

  useEffectTI(() => {
    if (!window.gsap || !sectionRef.current) return;

    /* estado inicial — tudo oculto antes do trigger */
    gsap.set(sectionRef.current.querySelector('.ti-badge'),                  { opacity: 0, y: -18 });
    gsap.set(sectionRef.current.querySelectorAll('.ti-h2 .w-wrap > span'),   { y: '110%', opacity: 0, rotateX: -40 });
    gsap.set(sectionRef.current.querySelector('.ti-desc'),                   { opacity: 0, y: 24 });
    gsap.set(sectionRef.current.querySelectorAll('.ti-step'),                { opacity: 0, x: -44, scale: 0.94 });
    gsap.set(sectionRef.current.querySelector('.ti-form'),                   { opacity: 0, y: 70, scale: 0.88 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true },
    });

    tl.to(sectionRef.current.querySelector('.ti-badge'),
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
      .to(sectionRef.current.querySelectorAll('.ti-h2 .w-wrap > span'),
        { y: '0%', opacity: 1, rotateX: 0, transformPerspective: 700, duration: 0.9, stagger: 0.07, ease: 'power4.out' }, '-=0.1')
      .to(sectionRef.current.querySelector('.ti-desc'),
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
      .to(sectionRef.current.querySelectorAll('.ti-step'),
        { opacity: 1, x: 0, scale: 1, duration: 0.6, stagger: 0.13, ease: 'power3.out' }, '-=0.4')
      .to(sectionRef.current.querySelector('.ti-form'),
        { opacity: 1, y: 0, scale: 1, duration: 1.05, ease: 'back.out(1.4)' }, '-=0.75');

    /* aurora blobs */
    gsap.to('.ti-aurora-1', { scale: 1.22, x: 45, y: -35, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.ti-aurora-2', { scale: 0.82, x: -35, y: 45, duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5 });
    gsap.to('.ti-aurora-3', { scale: 1.15, x: -22, y: -18, duration: 9,  repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });

    /* floating particles */
    sectionRef.current.querySelectorAll('.ti-particle').forEach((p) => {
      gsap.to(p, {
        x: gsap.utils.random(-45, 45), y: gsap.utils.random(-65, 65),
        opacity: gsap.utils.random(0.15, 0.55), scale: gsap.utils.random(0.7, 1.5),
        duration: gsap.utils.random(5, 13), repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: gsap.utils.random(0, 5),
      });
    });

    /* step number pulse */
    sectionRef.current.querySelectorAll('.ti-step-num').forEach((el, i) => {
      gsap.to(el, {
        boxShadow: '0 0 0 7px rgba(255,255,255,0.18)',
        duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4,
      });
    });
  }, []);

  const onEstimate = async () => {
    setLoading(true);
    const res = await TradeInService.estimate(form);
    setEstimate(res);
    setLoading(false);
  };

  return (
    <section id="tradein" ref={sectionRef} style={{
      padding: '120px 0', position: 'relative',
      background: 'linear-gradient(160deg, #FF0020 0%, #b8001a 100%)',
      color: '#fff', overflow: 'hidden',
    }}>
      <div className="msi-grid-bg-light" />

      {/* Aurora blobs */}
      <div className="ti-aurora-1" style={{ position: 'absolute', top: '-12%', right: '-14%', width: 680, height: 680, background: 'radial-gradient(circle, rgba(255,90,110,0.5) 0%, transparent 65%)', filter: 'blur(65px)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="ti-aurora-2" style={{ position: 'absolute', bottom: '-16%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(90,0,18,0.7) 0%, transparent 65%)', filter: 'blur(75px)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="ti-aurora-3" style={{ position: 'absolute', top: '28%', left: '22%', width: 420, height: 420, background: 'radial-gradient(circle, rgba(255,40,70,0.22) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Diagonal lines */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.055, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(115deg, transparent 0 6px, rgba(255,255,255,0.6) 6px 7px)', zIndex: 0 }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div key={i} className="ti-particle" style={{
          position: 'absolute', top: p.top, left: p.left,
          width: p.size, height: p.size, borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)', opacity: p.opacity,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      <div className="msi-container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="tradein-grid">

          {/* Left — text */}
          <div>
            <span className="ti-badge"><Badge tone="white" icon={<IconSwap size={12} />}>TRADE-IN · AVALIAÇÃO EM 10 MIN</Badge></span>
            <h2 className="ti-h2" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', marginTop: 18, lineHeight: 1.12, color: '#fff' }}>
              <WATi>Seu iPhone antigo</WATi>
              <br />
              <span style={{ color: '#1d1d1f' }}><WATi>vale dinheiro de verdade.</WATi></span>
            </h2>
            <p className="ti-desc" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 17, marginTop: 18, maxWidth: 520, lineHeight: 1.6 }}>
              Diga o modelo, a saúde da bateria e o estado. Em segundos você descobre a faixa de avaliação e quanto entra como crédito no seu próximo aparelho.
            </p>

            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['1', 'Você nos manda os dados',           'Modelo, bateria e estado de conservação.'],
                ['2', 'Recebe a faixa de avaliação',       'Min e máx em até 10 minutos.'],
                ['3', 'Coleta grátis na sua porta',        'Frete e seguro por nossa conta.'],
                ['4', 'Crédito imediato no aparelho novo', 'Ou pagamento via PIX no mesmo dia.'],
              ].map(([n, t, d]) => (
                <div key={n} className="ti-step" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div className="ti-step-num" style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
                    background: '#fff', color: 'var(--msi-red)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 14,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    transition: 'transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.18) rotate(-8deg)'; e.currentTarget.style.boxShadow = '0 8px 26px rgba(0,0,0,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'; }}
                  >{n}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 15.5 }}>{t}</div>
                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5, marginTop: 2 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div
            className="ti-form"
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
            style={{
              background: '#fff', color: 'var(--msi-card-ink)', borderRadius: 28, padding: 36,
              boxShadow: cardHover
                ? '0 50px 120px -20px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,0,32,0.12)'
                : '0 40px 100px -20px rgba(0,0,0,0.5)',
              transform: cardHover ? 'translateY(-6px) scale(1.012)' : 'translateY(0) scale(1)',
              transition: 'transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s',
              position: 'relative', overflow: 'visible',
            }}
          >
            {/* Decorativos clipados independentemente */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--msi-red), #ff6070, var(--msi-red))', animation: 'msi-shimmer 2.5s ease-in-out infinite', backgroundSize: '200% auto' }} />
              <div style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,0,32,0.06) 0%, transparent 70%)' }} />
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--msi-red)', letterSpacing: '0.18em', marginBottom: 8 }}>
              SIMULADOR · MSI-TRADE
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 24, color: 'var(--msi-card-ink)' }}>
              Calcule agora.
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Select
                label="Modelo" dark={false} value={form.model}
                onChange={(v) => { setForm((f) => ({ ...f, model: v })); setEstimate(null); }}
                options={[
                  'iPhone 8','iPhone 8 Plus','iPhone SE (2a gen)',
                  'iPhone X','iPhone XR','iPhone XS','iPhone XS Max',
                  'iPhone 11','iPhone 11 Pro','iPhone 11 Pro Max',
                  'iPhone 12','iPhone 12 mini','iPhone 12 Pro','iPhone 12 Pro Max',
                  'iPhone 13','iPhone 13 mini','iPhone 13 Pro','iPhone 13 Pro Max',
                  'iPhone 14','iPhone 14 Plus','iPhone 14 Pro','iPhone 14 Pro Max',
                  'iPhone 15','iPhone 15 Plus','iPhone 15 Pro','iPhone 15 Pro Max',
                  'iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max',
                  'iPhone 17','iPhone 17 Plus','iPhone 17 Pro','iPhone 17 Pro Max',
                ].map((m) => ({ value: m, label: m }))}
              />

              <BatterySlider
                value={form.batteryHealth}
                onChange={(v) => { setForm((f) => ({ ...f, batteryHealth: v })); setEstimate(null); }}
              />

              <Select
                label="Estado de conservação" dark={false} value={form.condition}
                onChange={(v) => { setForm((f) => ({ ...f, condition: v })); setEstimate(null); }}
                options={[
                  { value: 'impecavel',         label: 'Impecável — sem marcas' },
                  { value: 'excelente',          label: 'Excelente — levíssimos sinais' },
                  { value: 'bom',               label: 'Bom — micro-arranhões' },
                  { value: 'regular',            label: 'Regular — arranhões profundos' },
                  { value: 'usado',              label: 'Usado — marcas visíveis' },
                  { value: 'carcaca-danificada', label: 'Carcaça danificada / amassado' },
                  { value: 'tela-trincada',      label: 'Tela trincada ou manchada' },
                  { value: 'face-id-defeito',    label: 'Face ID com defeito' },
                  { value: 'camera-defeito',     label: 'Câmera com problema' },
                  { value: 'bateria-inchada',    label: 'Bateria inchada' },
                  { value: 'nao-liga',           label: 'Não liga / para peças' },
                ]}
              />

              <Button variant="primary" size="lg" full onClick={onEstimate} disabled={loading}
                iconRight={<IconArrow size={16} />}>
                {loading ? 'Calculando…' : 'Calcular minha avaliação'}
              </Button>

              {estimate && (
                <div style={{
                  marginTop: 4, padding: 24, borderRadius: 18,
                  background: 'linear-gradient(135deg, #1d1d1f 0%, #2a2a31 100%)',
                  color: '#fff', animation: 'ti-fade-up .5s cubic-bezier(.22,1,.36,1) forwards',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#FF4455', letterSpacing: '0.18em', marginBottom: 6 }}>
                    SUA FAIXA DE AVALIAÇÃO
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em' }}>
                    {formatBRL(estimate.min)}{' '}
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 20, fontWeight: 500 }}>até</span>{' '}
                    {formatBRL(estimate.max)}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 1.5 }}>
                    Valor estimado. A oferta final sai após o diagnóstico técnico (sem custo, sem compromisso).
                  </div>
                  <a href={buildWhatsAppLink(`${form.model} para trade-in`)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 14 }}>
                    <Button variant="primary" size="md" full icon={<IconWhatsApp size={16} />}>
                      Continuar pelo WhatsApp
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ti-fade-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @media (max-width: 900px) {
          .tradein-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .ti-form { padding: 24px !important; border-radius: 20px !important; }
          .ti-badge { margin-bottom: 12px !important; }
        }
        @media (max-width: 768px) {
          .ti-form { padding: 20px !important; }
          .ti-aurora-1, .ti-aurora-2, .ti-aurora-3 { display: none !important; }
        }
      `}</style>
    </section>
  );
}

Object.assign(window, { TradeIn });
