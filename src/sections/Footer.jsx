/* src/sections/Footer.jsx */
const { useState: useStateFooter, useEffect: useEffectFooter, useRef: useRefFooter } = React;

function Footer() {
  const [email, setEmail] = useStateFooter('');
  const [err, setErr]     = useStateFooter('');
  const [ok, setOk]       = useStateFooter(false);
  const sectionRef = useRefFooter(null);

  useEffectFooter(() => {
    if (!window.gsap || !sectionRef.current) return;

    gsap.from(sectionRef.current.querySelector('.footer-nl'), {
      opacity: 0, y: 45, scale: 0.97, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });

    gsap.from(sectionRef.current.querySelectorAll('.footer-col'), {
      opacity: 0, y: 28, duration: 0.65, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current.querySelector('.footer-links'), start: 'top 85%', once: true },
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setErr('E-mail inválido'); return; }
    setErr(''); setOk(true);
    setTimeout(() => setOk(false), 3000);
    setEmail('');
  };

  return (
    <footer ref={sectionRef} style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #fbe5e8 100%)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      padding: '80px 0 40px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Forma decorativa */}
      <div style={{
        position: 'absolute', top: '-40px', right: '10%', width: 180, height: 180,
        border: '1px solid rgba(255,0,32,0.1)', borderRadius: '50%',
        animation: 'msi-spin-slow 25s linear infinite', pointerEvents: 'none',
      }} />

      <div className="msi-container">
        {/* Newsletter */}
        <div className="footer-nl" style={{
          padding: '64px 48px', borderRadius: 32,
          background: 'linear-gradient(135deg, var(--msi-red) 0%, #cc0018 100%)',
          marginBottom: 64, position: 'relative', overflow: 'hidden',
          boxShadow: '0 30px 80px -20px rgba(255,0,32,0.45)',
        }}>
          <div className="msi-grid-bg-light" />
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 640 }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.035em', marginBottom: 18, color: '#fff' }}>
              Receba alertas dos<br /><span style={{ opacity: 0.9 }}>melhores aparelhos.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 16, marginBottom: 28 }}>
              Sempre que entrar um modelo raro ou uma oferta de seminovo certificado, você é avisado primeiro.
            </p>
            <form onSubmit={onSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                type="email" value={email}
                onChange={(e) => { setEmail(sanitizeInput(e.target.value)); setErr(''); }}
                placeholder="seu@email.com"
                style={{
                  flex: '1 1 280px', background: 'rgba(255,255,255,0.15)',
                  border: `1.5px solid ${err ? '#fff' : 'rgba(255,255,255,0.3)'}`,
                  color: '#fff', borderRadius: 100, padding: '14px 22px',
                  fontSize: 15, fontFamily: 'inherit', outline: 'none',
                  transition: 'border-color .2s, background .2s',
                }}
                onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.22)'; e.target.style.borderColor = 'rgba(255,255,255,0.6)'; }}
                onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = err ? '#fff' : 'rgba(255,255,255,0.3)'; }}
              />
              <Button variant="light" size="lg" type="submit" iconRight={<IconArrow size={16} />}>
                {ok ? 'Inscrito ✓' : 'Receber alertas'}
              </Button>
            </form>
            {err && <div style={{ color: '#fff', fontSize: 13, marginTop: 8, fontWeight: 600 }}>{err}</div>}
          </div>
        </div>

        {/* Links */}
        <div className="footer-links footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 40, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="footer-col">
            <MsiLogo size={24} dark />
            <p style={{ color: 'var(--msi-card-mute)', fontSize: 14, marginTop: 16, maxWidth: 340, lineHeight: 1.6 }}>
              Hub premium de compra, revenda e trade-in de iPhones. Diagnóstico técnico, atendimento humano e preço transparente desde 2019.
            </p>
          </div>
          {[
            ['Loja',      ['Vitrine', 'Lacrados', 'Seminovos', 'Acessórios']],
            ['Serviços',  ['Trade-in', 'Compra do seu', 'Avaliação técnica', 'Garantia']],
            ['Contato',   ['WhatsApp', 'Atendimento 8h–22h', 'São Paulo, SP', 'contato@msiphone.com.br']],
          ].map(([title, links]) => (
            <div key={title} className="footer-col">
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--msi-red)', marginBottom: 16 }}>{title}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" style={{ color: 'var(--msi-card-mute)', fontSize: 14, transition: 'color .18s, transform .18s', display: 'inline-block' }}
                      onMouseEnter={(e) => { e.target.style.color = 'var(--msi-red)'; e.target.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={(e) => { e.target.style.color = 'var(--msi-card-mute)'; e.target.style.transform = ''; }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--msi-card-mute)', fontSize: 13, gap: 16, flexWrap: 'wrap' }}>
          <div>© 2026 msiphone — Hub Premium Apple. Todos os direitos reservados.</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--msi-red)', animation: 'msi-shimmer 3s ease-in-out infinite' }}>
            CERTIFIED · LAUDO · IMEI · GARANTIA
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
        @keyframes msi-shimmer {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 1; }
        }
      `}</style>
    </footer>
  );
}

Object.assign(window, { Footer });
