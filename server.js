const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jsx': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const BLOCKED_AGENTS = ['nmap', 'nikto', 'sqlmap', 'masscan', 'zgrab', 'nuclei', 'dirbuster', 'gobuster', 'wfuzz', 'metasploit'];
const BLOCKED_EXTENSIONS = ['.php', '.asp', '.aspx'];
const BLOCKED_PATHS = ['.env', '.git', '.ssh', '/etc/', '/proc/'];
const ALLOWED_METHODS = ['GET', 'HEAD'];

const rateLimitMap = new Map();
const RATE_LIMIT = 120;
const RATE_WINDOW = 60 * 1000;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return (forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress || '').trim();
}

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - record.start > RATE_WINDOW) {
    record.count = 1;
    record.start = now;
  } else {
    record.count += 1;
  }
  rateLimitMap.set(ip, record);
  return record.count > RATE_LIMIT;
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader(
    'Content-Security-Policy',
    [
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
    ].join('; ')
  );
}

function send(res, status, body, contentType) {
  res.writeHead(status, { 'Content-Type': contentType || 'text/plain' });
  res.end(body);
}

http.createServer((req, res) => {
  setSecurityHeaders(res);

  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    return send(res, 429, 'Too Many Requests');
  }

  if (!ALLOWED_METHODS.includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return send(res, 405, 'Method Not Allowed');
  }

  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if (BLOCKED_AGENTS.some((a) => ua.includes(a))) {
    return send(res, 403, 'Forbidden');
  }

  const rawUrl = req.url || '/';

  if (rawUrl.includes('../') || rawUrl.includes('..\\')) {
    return send(res, 400, 'Bad Request');
  }

  const urlPath = rawUrl === '/' ? '/index.html' : rawUrl.split('?')[0];

  if (BLOCKED_PATHS.some((b) => urlPath.toLowerCase().includes(b))) {
    return send(res, 403, 'Forbidden');
  }

  const ext = path.extname(urlPath).toLowerCase();

  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return send(res, 403, 'Forbidden');
  }

  const resolved = path.resolve(ROOT, urlPath.replace(/^\//, ''));

  if (!resolved.startsWith(ROOT + path.sep) && resolved !== ROOT) {
    return send(res, 403, 'Forbidden');
  }

  if (!fs.existsSync(resolved)) {
    return send(res, 404, 'Not Found');
  }

  const stat = fs.statSync(resolved);

  if (stat.isDirectory()) {
    return send(res, 403, 'Forbidden');
  }

  const contentType = MIME[ext] || 'application/octet-stream';
  const rangeHeader = req.headers.range;

  if (rangeHeader && ext === '.mp4') {
    const match = rangeHeader.match(/^bytes=(\d+)-(\d*)$/);
    if (!match) {
      return send(res, 416, 'Range Not Satisfiable');
    }

    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : stat.size - 1;

    if (start >= stat.size || end >= stat.size || start > end) {
      res.setHeader('Content-Range', `bytes */${stat.size}`);
      return send(res, 416, 'Range Not Satisfiable');
    }

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4',
    });

    if (req.method === 'HEAD') {
      return res.end();
    }

    fs.createReadStream(resolved, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Accept-Ranges': ext === '.mp4' ? 'bytes' : 'none',
  });

  if (req.method === 'HEAD') {
    return res.end();
  }

  fs.createReadStream(resolved).pipe(res);
}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
