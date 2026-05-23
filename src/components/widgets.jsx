function CartDrawer() {
  const { items, total, isOpen, setIsOpen, remove } = useCart();

  const openWhatsApp = () => {
    const lines = items.map((it) => `• ${it.name} – ${formatBRL(it.price)}`).join('\n');
    const totalLine = items.length > 1 ? `\n\nTotal: ${formatBRL(total)}` : '';
    const msg = `Olá msiphone! Quero finalizar meu pedido:\n\n${lines}${totalLine}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', zIndex: 200,
          opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity .3s',
        }}
      />

      <aside className="cart-drawer" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(460px, 100dvw)',
        background: '#ffffff',
        borderLeft: '1px solid rgba(0,0,0,0.08)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .35s cubic-bezier(.22,1,.36,1)',
        zIndex: 300, overflowY: 'auto',
        padding: 32, color: 'var(--msi-card-ink)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--msi-card-ink)' }}>Seu carrinho</h3>
          <button onClick={() => setIsOpen(false)} style={{
            background: 'transparent', border: 0, color: 'var(--msi-card-ink)', cursor: 'pointer', padding: 8,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--msi-card-mute)' }}>
            <div style={{ fontSize: 15, marginBottom: 18 }}>Seu carrinho está vazio.</div>
            <Button variant="primary" size="md" onClick={() => {
              setIsOpen(false);
              document.querySelector('#vitrine')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Ver vitrine
            </Button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {items.map((it) => (
                <div key={it.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#f5f5f7', padding: '14px 16px', borderRadius: 14,
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--msi-card-ink)' }}>{it.name}</div>
                    <div style={{ color: 'var(--msi-card-mute)', fontSize: 13, marginTop: 2 }}>{formatBRL(it.price)}</div>
                  </div>
                  <button onClick={() => remove(it.id)} style={{
                    background: 'transparent', border: 0, color: 'var(--msi-card-mute)', cursor: 'pointer', padding: 4,
                  }} title="Remover">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '14px 0 22px',
              borderTop: '1px solid rgba(0,0,0,0.08)',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              marginBottom: 22,
            }}>
              <span style={{ color: 'var(--msi-card-mute)', fontSize: 14 }}>Total</span>
              <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--msi-red)' }}>
                {formatBRL(total)}
              </span>
            </div>

            <Button variant="primary" size="lg" full onClick={openWhatsApp}
              iconRight={<IconWhatsApp size={18} color="#fff" />}>
              Finalizar pelo WhatsApp
            </Button>
            <div style={{ fontSize: 12, color: 'var(--msi-card-mute)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
              Você será direcionado ao WhatsApp para confirmar seu pedido.
            </div>
          </>
        )}
      </aside>
      <style>{`
        @media (max-width: 520px) {
          .cart-drawer { padding: 20px !important; }
        }
      `}</style>
    </>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppLink('um aparelho da vitrine msiphone')}
      target="_blank" rel="noopener noreferrer"
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 80,
        width: 60, height: 60, borderRadius: '50%',
        background: '#25D366', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 12px 30px -8px rgba(37,211,102,0.55), 0 0 0 8px rgba(37,211,102,0.12)',
        animation: 'msi-pulse 2.4s ease-in-out infinite',
      }}
      title="Falar no WhatsApp"
    >
      <IconWhatsApp size={28} color="#fff" />
      <style>{`
        @keyframes msi-pulse {
          0%, 100% { box-shadow: 0 12px 30px -8px rgba(37,211,102,0.55), 0 0 0 0 rgba(37,211,102,0.4); }
          50%       { box-shadow: 0 12px 30px -8px rgba(37,211,102,0.55), 0 0 0 16px rgba(37,211,102,0); }
        }
      `}</style>
    </a>
  );
}

Object.assign(window, { CartDrawer, FloatingWhatsApp });
