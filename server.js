const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.jsx':  'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.woff2':'font/woff2',
  '.ico':  'image/x-icon',
};

/* ── Listas de bloqueio ── */
const BLOCKED_AGENTS = [
  'nmap','nikto','sqlmap','masscan','zgrab','nuclei','dirbuster','gobuster',
  'wfuzz','metasploit','hydra','burpsuite','w3af','acunetix','nessus','openvas',
  'zaproxy','zap','havij','pangolin','scanbot','webinspect','appscan','vega',
  'arachni','skipfish','wapiti','grabber','xsser','commix','shodan','censys',
  'python-requests','go-http-client','libwww-perl','scrapy','httpie','lwp-',
  'perl ','ruby ','java/','okhttp','aiohttp','httpx','pycurl','mechanize',
  'urllib','httpclient','guzzle','wget/',
];

const BLOCKED_EXTENSIONS = [
  '.php','.asp','.aspx','.cgi','.pl','.py','.sh','.bash',
  '.conf','.sql','.bak','.swp','.log','.ini','.cfg','.yml','.yaml',
  '.env','.key','.pem','.p12','.pfx','.cer','.crt','.der',
];

const BLOCKED_PATHS = [
  '.env','.git','.ssh','.svn','.hg','.bzr',
  '/etc/','/proc/','/var/log','/root/','/home/',
  '/admin','/wp-admin','/wp-login','/wp-content','/wp-includes',
  '/phpmyadmin','/phpinfo','/xmlrpc','/server-status','/server-info',
  '/.htaccess','/.htpasswd','/.well-known/security.txt',
  '/config','/backup','/bak','/db','/database','/shell','/cmd',
  '/cgi-bin','/fcgi-bin','/console','/manager','/actuator',
  '/api/v1','/api/v2','/rest/','/graphql','/swagger',
  '/__debug__','/_profiler','/trace',
];

const HONEYPOT_PATHS = [
  '/admin','/wp-admin','/wp-login.php','/phpmyadmin',
  '/login','/console','/manager','/shell',
];

/* Padrões de injeção na query/path */
const INJECTION_RE = /(<script|javascript:|vbscript:|data:text|onload=|onerror=|union\s+select|select\s+from|drop\s+table|insert\s+into|delete\s+from|exec\s*\(|eval\s*\(|\bor\b\s+1=1|\band\b\s+1=1|\.\.\/|%2e%2e|%252e|\x00|%00)/i;

const ALLOWED_METHODS = ['GET', 'HEAD'];

/* ── Rate limiting ── */
const rateLimitMap = new Map();
const RATE_LIMIT   = 80;
const RATE_WINDOW  = 60 * 1000;

/* ── Limpeza periódica do mapa de rate limit ── */
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of rateLimitMap) {
    if (now - rec.start > RATE_WINDOW * 2) rateLimitMap.delete(ip);
  }
}, RATE_WINDOW);

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? fwd.split(',')[0] : req.socket.remoteAddress || '').trim();
}

function isRateLimited(ip) {
  const now = Date.now();
  const rec = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - rec.start > RATE_WINDOW) { rec.count = 1; rec.start = now; }
  else rec.count += 1;
  rateLimitMap.set(ip, rec);
  return rec.count > RATE_LIMIT;
}

function setSecurityHeaders(res) {
  res.setHeader('Server', 'nginx');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), interest-cohort=()'
  );
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' https://unpkg.com 'unsafe-inline'",
    "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "worker-src 'none'",
    "manifest-src 'self'",
  ].join('; '));
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/plain' });
  res.end(body);
}

/* Honeypot: responde 200 com corpo falso para desperdiçar tempo do scanner */
function honeypot(res) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<!doctype html><html><head><title>Login</title></head><body><form method="post"><input name="user"/><input name="pass" type="password"/><button>Login</button></form></body></html>');
}

http.createServer((req, res) => {
  setSecurityHeaders(res);

  const ip  = getClientIp(req);
  const ua  = (req.headers['user-agent'] || '').toLowerCase();
  const raw = req.url || '/';

  /* ── Método bloqueado ── */
  if (!ALLOWED_METHODS.includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return send(res, 405, 'Method Not Allowed');
  }

  /* ── Rate limit ── */
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    return send(res, 429, 'Too Many Requests');
  }

  /* ── User-Agent malicioso ── */
  if (BLOCKED_AGENTS.some((a) => ua.includes(a))) {
    return send(res, 403, 'Forbidden');
  }

  /* ── Padrões de injeção na URL ── */
  const fullUrl = decodeURIComponent(raw).toLowerCase();
  if (INJECTION_RE.test(fullUrl)) {
    return send(res, 400, 'Bad Request');
  }

  /* ── Path traversal ── */
  if (raw.includes('../') || raw.includes('..\\') || raw.includes('%2e%2e') || raw.includes('\x00')) {
    return send(res, 400, 'Bad Request');
  }

  const urlPath = raw === '/' ? '/index.html' : raw.split('?')[0];
  const urlLower = urlPath.toLowerCase();

  /* ── Honeypot paths (admin, wp-admin etc.) ── */
  if (HONEYPOT_PATHS.some((h) => urlLower.startsWith(h))) {
    return honeypot(res);
  }

  /* ── Caminhos bloqueados ── */
  if (BLOCKED_PATHS.some((b) => urlLower.includes(b))) {
    return send(res, 403, 'Forbidden');
  }

  /* ── Extensões bloqueadas ── */
  const ext = path.extname(urlPath).toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return send(res, 403, 'Forbidden');
  }

  /* ── Validação de caminho absoluto ── */
  const resolved = path.resolve(ROOT, urlPath.replace(/^\//, ''));
  if (!resolved.startsWith(ROOT + path.sep) && resolved !== ROOT) {
    return send(res, 403, 'Forbidden');
  }

  if (!fs.existsSync(resolved)) {
    return send(res, 404, 'Not Found');
  }

  let stat;
  try {
    stat = fs.statSync(resolved);
  } catch {
    return send(res, 500, 'Internal Server Error');
  }

  if (stat.isDirectory()) {
    return send(res, 403, 'Forbidden');
  }

  const contentType = MIME[ext] || 'application/octet-stream';
  const rangeHeader = req.headers.range;

  /* ── Range request para vídeo ── */
  if (rangeHeader && ext === '.mp4') {
    const match = rangeHeader.match(/^bytes=(\d+)-(\d*)$/);
    if (!match) {
      return send(res, 416, 'Range Not Satisfiable');
    }
    const start = parseInt(match[1], 10);
    const end   = match[2] ? parseInt(match[2], 10) : stat.size - 1;
    if (start >= stat.size || end >= stat.size || start > end) {
      res.setHeader('Content-Range', `bytes */${stat.size}`);
      return send(res, 416, 'Range Not Satisfiable');
    }
    res.writeHead(206, {
      'Content-Range':  `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges':  'bytes',
      'Content-Length': end - start + 1,
      'Content-Type':   'video/mp4',
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(resolved, { start, end })
      .on('error', () => res.end())
      .pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Type':   contentType,
    'Content-Length': stat.size,
    'Accept-Ranges':  ext === '.mp4' ? 'bytes' : 'none',
    'Cache-Control':  ext === '.html' ? 'no-store' : 'public, max-age=86400',
  });

  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(resolved)
    .on('error', () => res.end())
    .pipe(res);

}).listen(PORT, '127.0.0.1', () => console.log(`Server running at http://localhost:${PORT}`));
