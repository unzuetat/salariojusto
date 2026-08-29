// Alta en alertas de convenio (doble opt-in vía Brevo).
// Recibe { email, convenio } y crea el contacto en Brevo con el flujo DOI:
// Brevo envía el email de confirmación y solo tras confirmar queda suscrito.
// Variables de entorno (Vercel):
//   BREVO_API_KEY          — clave API v3 de Brevo
//   BREVO_LIST_ID          — id numérico de la lista "Alertas convenios"
//   BREVO_DOI_TEMPLATE_ID  — id de la plantilla de email de confirmación (DOI)
//   BREVO_REDIRECT_URL     — página a la que aterriza el usuario tras confirmar

const ALLOWED_HOSTS = new Set(['salariojusto.es', 'www.salariojusto.es', 'localhost', '127.0.0.1']);
function isAllowedOrigin(req) {
  const raw = req.headers.origin || req.headers.referer;
  if (!raw) return false;
  try {
    const { hostname } = new URL(raw);
    if (ALLOWED_HOSTS.has(hostname)) return true;
    if (hostname.endsWith('.vercel.app')) return true;
    return false;
  } catch { return false; }
}

const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5;
const rateHits = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const hits = (rateHits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateHits.set(ip, hits);
  if (rateHits.size > 5000) for (const [k, v] of rateHits) if (!v.some(t => now - t < RATE_WINDOW_MS)) rateHits.delete(k);
  return hits.length <= RATE_MAX;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONVENIO_RE = /^[a-z0-9-]{3,80}$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: 'Forbidden' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (!rateLimit(ip)) return res.status(429).json({ error: 'Demasiadas peticiones. Espera un minuto.' });

  const { email, convenio, web } = req.body || {};

  // honeypot: el campo "web" está oculto; si llega relleno, es un bot
  if (web) return res.status(200).json({ ok: true });

  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ error: 'Email no válido.' });
  }
  if (!convenio || !CONVENIO_RE.test(String(convenio))) {
    return res.status(400).json({ error: 'Convenio no válido.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const redirectionUrl = process.env.BREVO_REDIRECT_URL || 'https://salariojusto.es/';
  if (!apiKey || !listId || !templateId) {
    return res.status(503).json({ error: 'Servicio de alertas aún no disponible.' });
  }

  try {
    const r = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        email: String(email).trim().toLowerCase(),
        includeListIds: [listId],
        templateId,
        redirectionUrl,
        attributes: { CONVENIO: String(convenio) },
      }),
    });

    if (r.status === 201 || r.status === 204) {
      return res.status(200).json({ ok: true });
    }
    const detail = await r.json().catch(() => ({}));
    // contacto ya existente en la lista → lo tratamos como éxito para el usuario
    if (r.status === 400 && /already/i.test(detail.message || '')) {
      return res.status(200).json({ ok: true });
    }
    console.error('Brevo error', r.status, detail.message || '');
    return res.status(502).json({ error: 'No se pudo completar el alta. Inténtalo más tarde.' });
  } catch (e) {
    console.error('subscribe error', e.message);
    return res.status(502).json({ error: 'No se pudo completar el alta. Inténtalo más tarde.' });
  }
};
