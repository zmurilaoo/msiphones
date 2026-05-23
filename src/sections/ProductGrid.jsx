/* src/sections/ProductGrid.jsx — ProductCard + ProductGrid (Vitrine) */
const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

const PRODUCT_IMAGES = {
  'ip-15-pro-max-256-tit-nat': 'assets/images/products/iphone-card-40-17pro-202509.jpg',
  'ip-16-pro-512-des-tit':     'assets/images/products/iphone-card-40-17pro-202509.jpg',
  'ip-14-128-roxo':            'assets/images/products/iphone-card-40-16plus-202509.jpg',
  'ip-13-mini-128-rosa':       'assets/images/products/iphone-card-40-16plus-202509.jpg',
  'ip-15-256-azul':            'assets/images/products/iphone-card-40-16plus-202509.jpg',
  'ip-16-128-tit-verde':       'assets/images/products/iphone-card-40-16plus-202509.jpg',
};

/* ── Word-reveal helper ── */
function WA({ children, style }) {
  const words = String(children).trim().split(/\s+/);
  return words.map((w, i) => (
    <span key={i} className="w-wrap" style={{ ...style, marginRight: i < words.length - 1 ? '0.28em' : 0 }}>
      <span>{w}</span>
    </span>
  ));
}

/* ── ProductCard ──────────────────────────────────────────── */
function ProductCard({ product, idx }) {
  const { add } = useCart();
  const [colorIdx, setColorIdx] = useStateP(0);
  const [hover, setHover] = useStateP(false);
  const [imgVisible, setImgVisible] = useStateP(true);
  const cardRef = useRefP(null);

  const productImage =
    product.colorOptions[colorIdx]?.image || PRODUCT_IMAGES[product.id];

  const handleColorChange = (i) => {
    if (i === colorIdx) return;
    const hasColorImgs = product.colorOptions.some((c) => c.image);
    if (hasColorImgs) {
      setImgVisible(false);
      setTimeout(() => { setColorIdx(i); setImgVisible(true); }, 130);
    } else {
      setColorIdx(i);
    }
  };

  const onMouseEnterCard = () => {
    setHover(true);
    if (!cardRef.current || !window.gsap) return;
    gsap.to(cardRef.current, { y: -14, duration: 0.45, ease: 'power3.out', overwrite: true });
  };

  const onMouseLeave = () => {
    setHover(false);
    if (!cardRef.current || !window.gsap) return;
    gsap.to(cardRef.current, { y: 0, duration: 0.65, ease: 'elastic.out(1, 0.55)', overwrite: true });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnterCard}
      onMouseLeave={onMouseLeave}
      style={{
        background: 'var(--msi-card)', color: 'var(--msi-card-ink)',
        borderRadius: 32, padding: '28px 28px 24px',
        boxShadow: hover
          ? `0 32px 80px -20px rgba(0,0,0,0.28), 0 0 0 1.5px ${product.colorOptions[colorIdx]?.hex || 'transparent'}44`
          : 'var(--shadow-card)',
        transition: 'box-shadow .35s cubic-bezier(.22,1,.36,1)',
        display: 'flex', flexDirection: 'column', minHeight: 580,
        position: 'relative', overflow: 'hidden',
        willChange: 'transform',
        cursor: 'default',
      }}
    >
      {/* Glow de fundo — cor do swatch ativo */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 380, height: 380, borderRadius: '50%',
        background: `radial-gradient(circle, ${product.colorOptions[colorIdx]?.hex || '#FF0020'}33 0%, transparent 70%)`,
        opacity: hover ? 1 : 0.5,
        transition: 'opacity .4s, background .3s',
        pointerEvents: 'none',
      }} />

      {/* Linha de detalhe no topo */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 2,
        background: hover
          ? 'linear-gradient(90deg, transparent, var(--msi-red), transparent)'
          : 'transparent',
        transition: 'background .4s', borderRadius: 100,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <Badge tone={product.isNew ? 'cardRed' : 'light'}>
          {product.isNew ? 'Lacrado · novo' : product.badge}
        </Badge>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--msi-card-mute)', letterSpacing: '0.1em' }}>
          MSI · 0{idx + 1}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '18px 0 24px', height: 280, position: 'relative', zIndex: 1 }}>
        <img
          src={productImage}
          alt={`${product.name} ${product.colorOptions[colorIdx]?.name || ''}`}
          style={{
            height: '100%', width: '100%',
            objectFit: 'contain', objectPosition: 'center',
            transition: 'transform .4s cubic-bezier(.22,1,.36,1), opacity .13s ease',
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            filter: hover ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))' : 'none',
            opacity: imgVisible ? 1 : 0,
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--msi-card-mute)', marginBottom: 4 }}>
          {product.condition} · {product.storage}
        </div>
        <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--msi-card-ink)', marginBottom: 14 }}>
          {product.name}
        </h3>

        {/* Swatches de cor */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          {product.colorOptions.map((c, i) => (
            <button key={c.name} onClick={() => handleColorChange(i)} aria-label={c.name} title={c.name}
              style={{
                width: 22, height: 22, borderRadius: '50%', background: c.hex,
                border: i === colorIdx ? '2px solid var(--msi-card-ink)' : '2px solid transparent',
                outline: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', padding: 0,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'transform .2s, box-shadow .2s',
                transform: i === colorIdx ? 'scale(1.18)' : 'scale(1)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 0 3px ${c.hex}55`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; }}
            />
          ))}
          {product.colorOptions[colorIdx] && (
            <span style={{ fontSize: 11, color: 'var(--msi-card-mute)', marginLeft: 4, transition: 'opacity .15s' }}>
              {product.colorOptions[colorIdx].name}
            </span>
          )}
        </div>

        <div style={{ marginBottom: 18 }}>
          {!product.isNew
            ? <BatteryHealthBar value={product.batteryHealth} />
            : <div style={{ height: 30 }} />
          }
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--msi-card-ink)' }}>
              {formatBRL(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 14, color: 'var(--msi-card-mute)', textDecoration: 'line-through' }}>
                {formatBRL(product.originalPrice)}
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--msi-card-mute)', marginBottom: 18 }}>
            ou {product.installments}x de {formatBRL(product.price / product.installments)} sem juros
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="dark" size="md" full
              onClick={() => add({ id: product.id, name: product.name, price: product.price })}>
              Adicionar
            </Button>
            <a href={buildWhatsAppLink(product.name)} target="_blank" rel="noopener noreferrer"
              style={{ flexShrink: 0, display: 'inline-flex' }}
              title={`Conversar sobre ${product.name}`}>
              <Button variant="outlineRed" size="md" icon={<IconWhatsApp size={16} />}
                style={{ padding: '12px 16px', borderColor: '#25D366', color: '#25D366' }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ProductGrid ──────────────────────────────────────────── */
function ProductGrid() {
  const { products, loading, filter, setFilter } = useProducts();
  const sectionRef = useRefP(null);

  useEffectP(() => {
    if (!window.gsap || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
    });

    tl.from(sectionRef.current.querySelector('.pg-badge'), { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' })
      .from(sectionRef.current.querySelectorAll('.w-wrap > span'), {
        y: '110%', opacity: 0, duration: 0.82, stagger: 0.055, ease: 'power4.out',
      }, '-=0.1')
      .from(sectionRef.current.querySelector('.pg-desc'), { opacity: 0, y: 22, duration: 0.65, ease: 'power3.out' }, '-=0.4');
  }, []);

  useEffectP(() => {
    if (loading || !window.gsap || !sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.msi-product-card');
    if (!cards.length) return;
    gsap.from(cards, {
      opacity: 0, y: 70, scale: 0.94,
      duration: 0.85, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
    });
  }, [loading]);

  return (
    <section id="vitrine" ref={sectionRef} style={{ padding: '120px 0', background: '#f5f5f7', position: 'relative', overflow: 'hidden' }}>
      {/* Decorativo blob */}
      <div style={{ position: 'absolute', top: 0, left: '8%', width: 440, height: 440, background: 'radial-gradient(circle, rgba(255,0,32,0.10), transparent 70%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,0,32,0.07), transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* Formas concêntricas rotativas — wrapper centraliza as 3 */}
      <div style={{ position: 'absolute', top: '8%', right: -130, width: 260, height: 260, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, border: '1.5px solid rgba(255,0,32,0.11)', borderRadius: 50, animation: 'msi-spin-slow 32s linear infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -80, marginLeft: -80, width: 160, height: 160 }}>
          <div style={{ width: '100%', height: '100%', border: '1.5px solid rgba(255,0,32,0.18)', borderRadius: 34, animation: 'msi-spin-slow 22s linear infinite reverse' }} />
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -38, marginLeft: -38, width: 76, height: 76 }}>
          <div style={{ width: '100%', height: '100%', border: '2px solid rgba(255,0,32,0.28)', borderRadius: 16, animation: 'msi-spin-slow 13s linear infinite' }} />
        </div>
      </div>

      <div className="msi-container" style={{ position: 'relative' }}>
        <div className="pg-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 600 }}>
            <span className="pg-badge"><Badge tone="cardRed">VITRINE · ATUALIZADA HOJE</Badge></span>
            <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', marginTop: 18, lineHeight: 1.08, color: 'var(--msi-card-ink)' }}>
              <WA>Aparelhos com</WA>{' '}
              <span style={{ color: 'var(--msi-red)' }}><WA>laudo técnico</WA></span>
              <br />
              <WA>e cara de novo.</WA>
            </h2>
            <p className="pg-desc" style={{ color: 'var(--msi-card-mute)', fontSize: 16.5, marginTop: 14, maxWidth: 540 }}>
              Cada iPhone é diagnosticado em 47 pontos. Bateria mínima de 85% para seminovos. IMEI verificado e laudo digital incluso.
            </p>
          </div>

          <div className="pg-filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[['all', 'Todos'], ['new', 'Lacrados'], ['used', 'Seminovos']].map(([k, label]) => (
              <button key={k} onClick={() => setFilter((f) => ({ ...f, condition: k }))}
                className="pg-filter-btn"
                style={{
                  background: filter.condition === k ? 'var(--msi-red)' : '#fff',
                  color: filter.condition === k ? '#fff' : 'var(--msi-card-ink)',
                  border: `1.5px solid ${filter.condition === k ? 'var(--msi-red)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 100, padding: '10px 18px', fontSize: 13.5, fontWeight: 600,
                  cursor: 'pointer', transition: 'all .22s', fontFamily: 'inherit',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => { if (filter.condition !== k) e.currentTarget.style.borderColor = 'var(--msi-red)'; }}
                onMouseLeave={(e) => { if (filter.condition !== k) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
              >{label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--msi-card-mute)', padding: 80 }}>Carregando vitrine…</div>
        ) : (
          <div className="pg-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 24 }}>
            {products.map((p, i) => (
              <div key={p.id} className="msi-product-card">
                <ProductCard product={p} idx={i} />
              </div>
            ))}
          </div>
        )}

        <div className="msi-reveal pg-reveal-box" style={{ marginTop: 48, padding: '28px 32px', borderRadius: 24, background: 'var(--msi-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap', boxShadow: '0 20px 50px -15px rgba(255,0,32,0.45)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#fff' }}>Não achou o modelo que queria?</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 4 }}>Nosso estoque gira diariamente. Manda mensagem que a gente te avisa quando chegar.</div>
          </div>
          <a href={buildWhatsAppLink('um aparelho específico')} target="_blank" rel="noopener noreferrer">
            <Button variant="light" size="lg" icon={<IconWhatsApp size={16} />}>Falar no WhatsApp</Button>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pg-grid { grid-template-columns: 1fr !important; }
          .pg-filters { gap: 8px !important; flex-wrap: wrap !important; }
          .pg-filter-btn { padding: 8px 14px !important; font-size: 12.5px !important; }
          .pg-header { margin-bottom: 32px !important; }
          .pg-reveal-box { flex-direction: column !important; gap: 14px !important; text-align: center !important; align-items: center !important; }
        }
        @media (max-width: 480px) {
          .pg-grid { gap: 16px !important; }
        }
      `}</style>
    </section>
  );
}

Object.assign(window, { ProductCard, ProductGrid });
