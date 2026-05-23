/* src/sections/Navbar.jsx */
const { useState, useEffect, useRef } = React;
const { useState: useStateNav } = React;

function Navbar() {
  const { items, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useStateNav(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!window.gsap || !navRef.current) return;
    gsap.fromTo(navRef.current.querySelectorAll('.nav-link'),
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.8 }
    );
    gsap.fromTo(navRef.current.querySelector('.nav-logo'),
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.5 }
    );
    gsap.fromTo(navRef.current.querySelector('.nav-actions'),
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  const linkColor = scrolled ? 'var(--msi-card-mute)' : 'rgba(255,255,255,0.75)';
  const linkHover = scrolled ? 'var(--msi-red)' : '#fff';

  const NAV_LINKS = [
    ['Comprar',          '#vitrine'],
    ['Trade-in',         '#tradein'],
    ['Por que msiphone', '#features'],
    ['Dúvidas',          '#faq'],
  ];

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '12px 0' : '20px 0',
      background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      transition: 'background .35s ease, padding .35s ease, border-color .35s ease, backdrop-filter .35s ease',
    }}>
      <div className="msi-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <div className="nav-logo" style={{ opacity: 0 }}>
          <MsiLogo size={22} dark={scrolled} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="nav-links">
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href}
              className="nav-link"
              style={{
                fontSize: 14, fontWeight: 500, color: linkColor,
                transition: 'color .2s', position: 'relative', opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = linkHover;
                const line = e.currentTarget.querySelector('.nav-underline');
                if (line && window.gsap) gsap.to(line, { scaleX: 1, duration: 0.25, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = linkColor;
                const line = e.currentTarget.querySelector('.nav-underline');
                if (line && window.gsap) gsap.to(line, { scaleX: 0, duration: 0.2, ease: 'power2.in' });
              }}
            >
              {label}
              <span className="nav-underline" style={{
                position: 'absolute', bottom: -3, left: 0, right: 0, height: 1.5,
                background: scrolled ? 'var(--msi-red)' : '#fff',
                borderRadius: 100, transform: 'scaleX(0)', transformOrigin: 'left',
                display: 'block',
              }} />
            </a>
          ))}
        </div>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0 }}>
          <button onClick={() => setIsOpen(true)} style={{
            position: 'relative',
            background: scrolled ? 'transparent' : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${scrolled ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 100, padding: '10px 16px',
            color: scrolled ? 'var(--msi-card-ink)' : 'rgba(255,255,255,0.85)',
            fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all .25s',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--msi-red)';
              e.currentTarget.style.color = 'var(--msi-red)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = scrolled ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = scrolled ? 'var(--msi-card-ink)' : 'rgba(255,255,255,0.85)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 7h12l-1.5 11a2 2 0 01-2 1.8H9.5a2 2 0 01-2-1.8L6 7zM9 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Carrinho
            {items.length > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: 'var(--msi-red)', color: '#fff', fontSize: 11, fontWeight: 700,
                minWidth: 20, height: 20, borderRadius: 100, padding: '0 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{items.length}</span>
            )}
          </button>
          <Button size="sm" variant="primary"
            onClick={() => document.querySelector('#tradein')?.scrollIntoView({ behavior: 'smooth' })}>
            Avaliar meu iPhone
          </Button>

          {/* Hamburger button — visible only on mobile */}
          <button
            className="nav-ham"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            style={{ color: scrolled ? 'var(--msi-card-ink)' : 'rgba(255,255,255,0.9)' }}
          >
            {menuOpen ? (
              /* X icon */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              /* Hamburger icon */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div className="nav-mobile-overlay">
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              document.querySelector('#tradein')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Avaliar meu iPhone
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .nav-links { display: none !important; } }
        .nav-ham { display: none; background: transparent; border: 0; cursor: pointer; padding: 8px; color: var(--msi-card-ink); }
        .nav-mobile-overlay { display: none; }
        @media (max-width: 900px) {
          .nav-ham { display: flex; align-items: center; justify-content: center; }
          .nav-mobile-overlay {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            position: fixed; inset: 0; background: rgba(255,255,255,0.97);
            backdrop-filter: blur(16px); z-index: 150; gap: 32px;
          }
          .nav-mobile-overlay a, .nav-mobile-overlay button { font-size: 22px; font-weight: 600; color: var(--msi-card-ink); }
        }
      `}</style>
    </nav>
  );
}

Object.assign(window, { Navbar });
