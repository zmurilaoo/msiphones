const ProductService = {
  async list() {
    await fakeDelay();
    return structuredClone(MSI_CATALOG);
  },
  async getById(id) {
    await fakeDelay(120);
    return structuredClone(MSI_CATALOG.find((p) => p.id === id));
  },
};

const TradeInService = {
  async estimate({ model, batteryHealth, condition }) {
    await fakeDelay(420);
    const base = {
      'iPhone 11': 1200, 'iPhone 12': 1700, 'iPhone 12 mini': 1500,
      'iPhone 13': 2200, 'iPhone 13 mini': 2000, 'iPhone 13 Pro': 3100,
      'iPhone 14': 2900, 'iPhone 14 Plus': 3200, 'iPhone 14 Pro': 4100,
      'iPhone 15': 3800, 'iPhone 15 Plus': 4200, 'iPhone 15 Pro': 5400, 'iPhone 15 Pro Max': 6200,
      'iPhone 16': 4900, 'iPhone 16 Pro': 6900,
    }[model] ?? 1500;

    const battFactor = Math.max(0.65, Math.min(1, batteryHealth / 100));
    const condFactor = {
      impecavel:            1.00,
      excelente:            0.95,
      bom:                  0.88,
      regular:              0.75,
      usado:                0.65,
      'carcaca-danificada': 0.50,
      'tela-trincada':      0.42,
      'face-id-defeito':    0.60,
      'camera-defeito':     0.65,
      'bateria-inchada':    0.30,
      'nao-liga':           0.22,
    }[condition] ?? 0.70;

    const value = Math.round((base * battFactor * condFactor) / 50) * 50;
    return { min: Math.round((value * 0.92) / 50) * 50, max: value };
  },
};

const CheckoutService = {
  async createOrder(payload) {
    const sanitize = (str) => sanitizeInput(str);
    const safe = {
      customer: {
        name:  sanitize(payload?.customer?.name),
        email: sanitize(payload?.customer?.email),
        phone: sanitize(payload?.customer?.phone),
      },
      items: (payload?.items || []).map((it) => ({
        id:    sanitize(it.id),
        name:  sanitize(it.name),
        price: Number(it.price) || 0,
      })),
      total:   Number(payload?.total) || 0,
      tradeIn: payload?.tradeIn ?? null,
    };
    await fakeDelay(600);
    return {
      orderId: 'MSI-' + Math.random().toString(36).slice(2, 9).toUpperCase(),
      status: 'pending',
      received: safe,
    };
  },
};

Object.assign(window, { ProductService, TradeInService, CheckoutService });
