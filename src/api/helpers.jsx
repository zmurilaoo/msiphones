const fakeDelay = (ms = 280) => new Promise((r) => setTimeout(r, ms));

const WHATSAPP_NUMBER = '5511960175602';

const buildWhatsAppLink = (modelName) => {
  const msg = `Olá msiphone, tenho interesse no ${modelName} anunciado no site.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

const sanitizeInput = (raw) => {
  let s = String(raw ?? '');
  s = s.replace(/<[^>]*>/g, '');
  s = s.replace(/javascript\s*:/gi, '');
  s = s.replace(/data\s*:/gi, '');
  s = s.replace(/on\w+\s*=/gi, '');
  s = s.replace(/\x00/g, '');
  s = s.replace(/[<>"'`&;{}()[\]\\]/g, '');
  return s.trim().slice(0, 240);
};

const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isValidPhone = (s) => /^[\d\s()+\-]{8,20}$/.test(s);

Object.assign(window, {
  fakeDelay,
  WHATSAPP_NUMBER,
  buildWhatsAppLink,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
});
