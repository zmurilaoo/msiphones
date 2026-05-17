const { useState, useRef } = React;

function MsiLogo({ size = 22, mono = false, dark = false }) {
  const color = mono ? '#fff' : 'var(--msi-red)';
  const textColor = dark ? 'var(--msi-card-ink)' : '#fff';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="2" width="20" height="28" rx="5" stroke={color} strokeWidth="2.2" />
        <circle cx="16" cy="25.5" r="1.2" fill={color} />
        <rect x="13" y="5" width="6" height="1.6" rx="0.8" fill={color} />
      </svg>
      <span style={{ fontWeight: 700, letterSpacing: '-0.04em', fontSize: size * 0.82, color: textColor }}>
        msi<span style={{ color }}>phone</span>
      </span>
    </div>
  );
}

function Button({ variant = 'primary', size = 'md', icon, iconRight, children, full, ...rest }) {
  const palettes = {
    primary:    { bg: 'var(--msi-red)',  fg: '#fff',              border: 'transparent',              hoverBg: 'var(--msi-red-bright)' },
    ghost:      { bg: 'transparent',     fg: '#fff',              border: 'rgba(255,255,255,0.18)',    hoverBg: 'rgba(255,255,255,0.06)' },
    light:      { bg: '#fff',            fg: '#1d1d1f',           border: 'transparent',              hoverBg: '#f0f0f0' },
    dark:       { bg: '#1d1d1f',         fg: '#fff',              border: 'transparent',              hoverBg: '#000' },
    outlineRed: { bg: 'transparent',     fg: 'var(--msi-red)',    border: 'var(--msi-red)',           hoverBg: 'rgba(255,0,32,0.08)' },
  };
  const sizes = {
    sm: { padding: '8px 14px',  fontSize: 13,   radius: 100 },
    md: { padding: '12px 22px', fontSize: 14.5, radius: 100 },
    lg: { padding: '16px 28px', fontSize: 16,   radius: 100 },
  };
  const p = palettes[variant];
  const s = sizes[size];
  const [hover, setHover] = useState(false);

  return (
    <button
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: hover ? p.hoverBg : p.bg,
        color: p.fg,
        border: `1.5px solid ${p.border}`,
        borderRadius: s.radius,
        padding: s.padding,
        fontWeight: 600,
        fontSize: s.fontSize,
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        transition: 'all .2s ease',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        width: full ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        ...rest.style,
      }}
    >
      {icon}{children}{iconRight}
    </button>
  );
}

function Badge({ tone = 'red', children, icon }) {
  const tones = {
    red:      { bg: 'rgba(255,0,32,0.12)',       fg: '#FF4455',          border: 'rgba(255,0,32,0.35)' },
    white:    { bg: 'rgba(255,255,255,0.08)',     fg: '#fff',             border: 'rgba(255,255,255,0.18)' },
    green:    { bg: 'rgba(60,200,120,0.10)',      fg: '#5cd99a',          border: 'rgba(60,200,120,0.35)' },
    light:    { bg: '#f5f5f7',                   fg: '#1d1d1f',          border: 'transparent' },
    cardRed:  { bg: '#fbe5e8',                   fg: '#cc0018',          border: 'transparent' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: t.bg, color: t.fg, border: `1px solid ${t.border}`,
      padding: '5px 10px', borderRadius: 100,
      fontSize: 11.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      fontFamily: 'var(--font-display)',
    }}>
      {icon}{children}
    </span>
  );
}

function Input({ label, error, hint, type = 'text', value, onChange, dark = true, ...rest }) {
  const id = useRef('inp-' + Math.random().toString(36).slice(2, 8)).current;
  return (
    <label htmlFor={id} style={{ display: 'block' }}>
      {label && (
        <div style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: dark ? 'var(--msi-mist)' : 'var(--msi-card-mute)', marginBottom: 8,
        }}>{label}</div>
      )}
      <input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange?.(sanitizeInput(e.target.value))}
        {...rest}
        style={{
          width: '100%',
          background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
          color: dark ? '#fff' : 'var(--msi-card-ink)',
          border: `1.5px solid ${error ? 'var(--msi-red)' : (dark ? 'rgba(255,255,255,0.1)' : 'var(--msi-card-line)')}`,
          borderRadius: 14, padding: '14px 16px',
          fontSize: 15, fontFamily: 'inherit',
          outline: 'none', transition: 'border-color .2s',
          ...rest.style,
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--msi-red)'; rest.onFocus?.(e); }}
        onBlur={(e) => {
          e.target.style.borderColor = error
            ? 'var(--msi-red)'
            : (dark ? 'rgba(255,255,255,0.1)' : 'var(--msi-card-line)');
          rest.onBlur?.(e);
        }}
      />
      {(hint || error) && (
        <div style={{
          marginTop: 6, fontSize: 12.5,
          color: error ? 'var(--msi-red-bright)' : (dark ? 'var(--msi-mist)' : 'var(--msi-card-mute)'),
        }}>{error || hint}</div>
      )}
    </label>
  );
}

function Select({ label, value, onChange, options, dark = true, direction = 'down' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || options[0];

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div style={{ display: 'block' }} ref={ref}>
      {label && (
        <div style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: dark ? 'var(--msi-mist)' : 'var(--msi-card-mute)', marginBottom: 8,
        }}>{label}</div>
      )}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            width: '100%', textAlign: 'left',
            background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
            color: dark ? '#fff' : 'var(--msi-card-ink)',
            border: `1.5px solid ${open ? 'var(--msi-red)' : (dark ? 'rgba(255,255,255,0.1)' : 'var(--msi-card-line)')}`,
            borderRadius: 14, padding: '14px 40px 14px 16px', fontSize: 15,
            fontFamily: 'inherit', cursor: 'pointer', transition: 'border-color .2s',
          }}
        >
          {selected?.label}
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
            style={{ position: 'absolute', right: 16, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform .2s', pointerEvents: 'none' }}>
            <path d="M1 1l5 5 5-5" stroke={dark ? '#b8b8c2' : '#86868b'} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>

        {open && (
          <div style={{
            position: 'absolute',
            ...(direction === 'up'
              ? { bottom: 'calc(100% + 6px)' }
              : { top: 'calc(100% + 6px)' }),
            left: 0, right: 0, zIndex: 999,
            background: '#fff', border: '1.5px solid var(--msi-card-line)',
            borderRadius: 14,
            boxShadow: '0 16px 40px -8px rgba(0,0,0,0.18)',
            maxHeight: 260, overflowY: 'auto',
          }}>
            {options.map((o) => (
              <div key={o.value}
                onMouseDown={() => { onChange(o.value); setOpen(false); }}
                style={{
                  padding: '12px 16px', fontSize: 15, cursor: 'pointer',
                  fontFamily: 'inherit', color: 'var(--msi-card-ink)',
                  background: o.value === value ? 'rgba(255,0,32,0.06)' : '#fff',
                  fontWeight: o.value === value ? 600 : 400,
                  borderLeft: o.value === value ? '3px solid var(--msi-red)' : '3px solid transparent',
                  transition: 'background .15s',
                }}
                onMouseEnter={(e) => { if (o.value !== value) e.currentTarget.style.background = '#f5f5f7'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = o.value === value ? 'rgba(255,0,32,0.06)' : '#fff'; }}
              >
                {o.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhoneRender({ accent = '#bdb4a5', label, size = 1, tilt = false, idx = 0 }) {
  const w = 200 * size;
  const h = 410 * size;
  return (
    <svg
      viewBox="0 0 200 410"
      width={w} height={h}
      style={{
        filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.35))',
        transform: tilt ? 'rotate(-6deg)' : 'none',
        transition: 'transform .4s ease',
      }}
      aria-label={label || 'iPhone'}
    >
      <defs>
        <linearGradient id={`bodyGrad-${idx}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="1" />
          <stop offset="1" stopColor={accent} stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id={`screenGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#161618" />
          <stop offset="0.5" stopColor="#0a0a0c" />
          <stop offset="1" stopColor="#1a1a1f" />
        </linearGradient>
        <radialGradient id={`glow-${idx}`} cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="10" y="6" width="180" height="398" rx="34" fill={`url(#bodyGrad-${idx})`} />
      <rect x="14" y="10" width="172" height="390" rx="30" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      <rect x="20" y="16" width="160" height="378" rx="26" fill={`url(#screenGrad-${idx})`} />
      <rect x="20" y="16" width="160" height="378" rx="26" fill={`url(#glow-${idx})`} opacity="0.6" />

      <rect x="78" y="28" width="44" height="11" rx="5.5" fill="#000" />

      <g opacity="0.85">
        <circle cx="100" cy="160" r="46" fill={accent} opacity="0.25" />
        <circle cx="100" cy="160" r="28" fill={accent} opacity="0.45" />
      </g>

      <text x="100" y="280" textAnchor="middle" fill="rgba(255,255,255,0.55)"
            fontFamily="Sora, sans-serif" fontWeight="600" fontSize="11" letterSpacing="2">
        {(label || 'IPHONE').toUpperCase()}
      </text>
      <text x="100" y="298" textAnchor="middle" fill="rgba(255,255,255,0.3)"
            fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing="1">
        msiphone certified
      </text>

      <rect x="8" y="80"  width="2.5" height="18" rx="1.2" fill="rgba(0,0,0,0.25)" />
      <rect x="8" y="110" width="2.5" height="30" rx="1.2" fill="rgba(0,0,0,0.25)" />
      <rect x="8" y="148" width="2.5" height="30" rx="1.2" fill="rgba(0,0,0,0.25)" />
      <rect x="189.5" y="120" width="2.5" height="50" rx="1.2" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
}

function BatteryHealthBar({ value }) {
  const color =
    value >= 95 ? '#1f7a3f' :
    value >= 90 ? '#2d8d4a' :
    value >= 85 ? '#bd8a00' : '#cc0018';
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--msi-card-mute)' }}>
          Saúde da bateria
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--msi-card-ink)', fontFamily: 'var(--font-mono)' }}>
          {value}%
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 100, background: '#f0f0f3', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="msi-toast">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="var(--msi-red)" />
        <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {message}
    </div>
  );
}

const IconWhatsApp = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.9-1.4-1.4-3-1.4-4.7C3.5 7.3 7.3 3.5 12 3.5s8.5 3.8 8.5 8.5S16.7 20 12 20z"/>
  </svg>
);

const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconShield = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSwap = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 7h14l-3-3M17 17H3l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSpark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3v6m0 6v6m9-9h-6m-6 0H3m13.5-6.5L15 6m-6 12l-1.5 1.5M19.5 19.5L18 18m-12-12L4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconChip = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

Object.assign(window, {
  MsiLogo, Button, Badge, Input, Select,
  PhoneRender, BatteryHealthBar, Toast,
  IconWhatsApp, IconArrow, IconShield, IconSwap, IconSpark, IconChip,
});
