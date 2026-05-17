const { useState: useStateW } = React;

function CartDrawer() {
  const { items, total, isOpen, setIsOpen, remove, clear, showToast } = useCart();
  const [submitting, setSubmitting] = useStateW(false);
  const [customer, setCustomer] = useStateW({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useStateW({});

  const checkout = async () => {
    const e = {};
    if (!customer.name) e.name = 'Informe seu nome';
    if (!isValidEmail(customer.email)) e.email = 'E-mail inválido';
    if (!isValidPhone(customer.phone)) e.phone = 'Telefone inválido';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    const order = await CheckoutService.createOrder({ customer, items, total });
    setSubmitting(false);
    showToast(`Pedido ${order.orderId} criado`);
    clear();
    setIsOpen(false);
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

      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(460px, 100vw)',
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <Input dark={false} label="Nome completo" value={customer.name}
                onChange={(v) => setCustomer((c) => ({ ...c, name: v }))}
                error={errors.name} placeholder="João Silva" />
              <Input dark={false} label="E-mail" type="email" value={customer.email}
                onChange={(v) => setCustomer((c) => ({ ...c, email: v }))}
                error={errors.email} placeholder="joao@email.com" />
              <Input dark={false} label="WhatsApp" value={customer.phone}
                onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))}
                error={errors.phone} placeholder="(11) 99999-9999" />
            </div>

            <Button variant="primary" size="lg" full onClick={checkout} disabled={submitting}
              iconRight={<IconArrow size={16} />}>
              {submitting ? 'Processando…' : 'Finalizar pedido'}
            </Button>
            <div style={{ fontSize: 12, color: 'var(--msi-card-mute)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
              Você será redirecionado para o checkout seguro.<br/>Pagamento processado via gateway Java/Spring.
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppLink('um aparelho da vitrine')}
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
