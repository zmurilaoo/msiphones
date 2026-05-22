const { useEffect, useState: useStateH, useRef, useMemo: useMemoH } = React;

function useProducts() {
  const [all, setAll] = useStateH([]);
  const [loading, setLoading] = useStateH(true);
  const [filter, setFilter] = useStateH({ condition: 'all', minBattery: 0, query: '' });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ProductService.list().then((data) => {
      if (cancelled) return;
      setAll(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemoH(() => {
    return all.filter((p) => {
      if (filter.condition === 'new' && !p.isNew) return false;
      if (filter.condition === 'used' && p.isNew) return false;
      if (p.batteryHealth < filter.minBattery) return false;
      if (filter.query && !p.name.toLowerCase().includes(filter.query.toLowerCase())) return false;
      return true;
    });
  }, [all, filter]);

  return { products: filtered, all, loading, filter, setFilter };
}

function useGsapReveal() {
  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.msi-reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    });
    return () => ctx.revert();
  }, []);
}

function useParallaxMouse(scope) {
  useEffect(() => {
    const root = scope?.current ?? document;
    const els = root.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    let raf = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      target.x = (e.clientX - cx) / cx;
      target.y = (e.clientY - cy) / cy;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      els.forEach((el) => {
        const depth = Number(el.dataset.parallax) || 12;
        el.style.transform = `translate3d(${current.x * depth}px, ${current.y * depth}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [scope]);
}

const formatBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

Object.assign(window, { useProducts, useGsapReveal, useParallaxMouse, formatBRL });
