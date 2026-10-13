// E0 — Relevamiento del portal del proveedor (ADR-0005).
// Ingresa una vez con la cuenta del dueño, recorre unas pocas páginas y registra la FORMA de las
// respuestas JSON (endpoints, campos de stock, mecanismo de sesión). Oculta tokens y datos personales.
// Solo lectura: no agrega al carrito ni compra. El resultado queda en data/spike/ (fuera de git).
import 'dotenv/config';
import { chromium, type Browser, type Page, type Response } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, '../../data/spike');

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Falta ${name} en tools/supplier-spike/.env`);
    process.exit(1);
  }
  return value;
}

const loginUrl = required('SUPPLIER_PORTAL_URL');
const user = required('SUPPLIER_USER');
const password = required('SUPPLIER_PASSWORD');
const paths = (process.env.SUPPLIER_PATHS ?? '/comprar,/usuario/lista-precios')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);
const headless = process.env.HEADLESS === 'true';

const SECRET_KEY = /token|password|secret|cookie|session|auth|csrf|signature|apikey|api_key/i;
const PII_KEY = /email|mail|phone|tel[eé]fono|whatsapp|cuit|dni|address|direcci|deuda|debt|saldo|balance|credit|razon|firstname|lastname|nombre_cliente/i;
const STOCK_KEY = /stock|qty|quantity|cantidad|available|disponib|semaforo|status|estado|color|level|nivel/i;
const PRODUCT_URL = /product|price|precio|stock|catalog|lista|presale|failed/i;
const THIRD_PARTY = /google|gstatic|facebook|sentry|vercel-insights|clarity|hotjar|doubleclick|cloudflareinsights/i;
const JWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

interface EndpointReport {
  method: string;
  url: string;
  status: number;
  auth: string;
  sample: unknown;
}

const endpoints = new Map<string, EndpointReport>();
const stockFields = new Map<string, Set<string>>();

function describeToken(value: string): string {
  if (!JWT.test(value)) return `[oculto: ${value.length} caracteres]`;
  try {
    const payload = JSON.parse(Buffer.from(value.split('.')[1], 'base64url').toString('utf8')) as Record<string, unknown>;
    const exp = typeof payload.exp === 'number' ? new Date(payload.exp * 1000).toISOString() : 'sin exp';
    return `[JWT oculto; vence: ${exp}; claves: ${Object.keys(payload).join(',')}]`;
  } catch {
    return `[JWT oculto: ${value.length} caracteres]`;
  }
}

function redact(value: unknown, key: string, productUrl: boolean, depth: number, trail: string): unknown {
  if (STOCK_KEY.test(key) && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
    const values = stockFields.get(trail) ?? new Set<string>();
    if (values.size < 15) values.add(String(value));
    stockFields.set(trail, values);
  }
  if (SECRET_KEY.test(key)) return typeof value === 'string' ? describeToken(value) : '[oculto]';
  if (!productUrl && PII_KEY.test(key)) return '[dato personal oculto]';
  if (depth > 6) return '[…]';
  if (Array.isArray(value)) {
    return {
      _largo: value.length,
      _primeros: value.slice(0, 2).map((item, i) => redact(item, key, productUrl, depth + 1, `${trail}[]`)),
    };
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, redact(v, k, productUrl, depth + 1, `${trail}.${k}`)]),
    );
  }
  if (typeof value === 'string') {
    if (JWT.test(value)) return describeToken(value);
    return value.length > 80 ? `${value.slice(0, 80)}…` : value;
  }
  return value;
}

function cleanUrl(raw: string): string {
  const url = new URL(raw);
  for (const key of [...url.searchParams.keys()]) {
    if (SECRET_KEY.test(key)) url.searchParams.set(key, '[oculto]');
  }
  return url.toString();
}

async function onResponse(response: Response): Promise<void> {
  try {
    const url = response.url();
    if (THIRD_PARTY.test(new URL(url).hostname)) return;
    const type = response.headers()['content-type'] ?? '';
    if (!type.includes('json')) return;
    const request = response.request();
    const headers = await request.allHeaders();
    const authHeader = headers['authorization'];
    const auth = authHeader
      ? `${authHeader.split(' ')[0]} ${describeToken(authHeader.split(' ').slice(1).join(' '))}`
      : headers['cookie']
        ? 'cookies'
        : 'ninguna';
    const pathKey = `${request.method()} ${new URL(url).origin}${new URL(url).pathname}`;
    if (endpoints.has(pathKey)) return;
    const body: unknown = await response.json().catch(() => null);
    const productUrl = PRODUCT_URL.test(new URL(url).pathname);
    endpoints.set(pathKey, {
      method: request.method(),
      url: cleanUrl(url),
      status: response.status(),
      auth,
      sample: redact(body, '', productUrl, 0, new URL(url).pathname),
    });
  } catch {
    // Una respuesta que no se puede leer no corta el relevamiento.
  }
}

async function launch(): Promise<Browser> {
  try {
    return await chromium.launch({ channel: 'chrome', headless });
  } catch {
    console.log('No se encontró Google Chrome; se usa el Chromium de Playwright.');
    return chromium.launch({ headless });
  }
}

async function hasCaptcha(page: Page): Promise<boolean> {
  const selector = 'iframe[src*="recaptcha"], iframe[src*="hcaptcha"], iframe[src*="turnstile"], .g-recaptcha, .h-captcha, .cf-turnstile';
  return (await page.locator(selector).count()) > 0;
}

async function login(page: Page, report: Record<string, unknown>): Promise<boolean> {
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
  report.captchaEnLogin = await hasCaptcha(page);
  if (report.captchaEnLogin) return false;

  const userSelector = [
    'input[type="email"]:visible',
    'input[name*="user" i]:visible',
    'input[name*="email" i]:visible',
    'input[id*="user" i]:visible',
    'input[id*="email" i]:visible',
    'input[type="text"]:visible',
  ].join(', ');
  const passwordField = page.locator('input[type="password"]:visible').first();

  // Algunos portales piden primero el usuario y después la clave.
  if (!(await passwordField.isVisible().catch(() => false))) {
    await page.locator(userSelector).first().fill(user);
    await page.keyboard.press('Enter');
    await passwordField.waitFor({ timeout: 15_000 });
  } else {
    await page.locator(userSelector).first().fill(user);
  }
  await passwordField.fill(password);
  await passwordField.press('Enter');

  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);
  await page.waitForTimeout(3_000);
  return !(await page.locator('input[type="password"]:visible').first().isVisible().catch(() => false));
}

async function readSession(page: Page): Promise<unknown> {
  // Auth.js expone la sesión en /api/auth/session (observado en la especificación).
  return page
    .evaluate(async () => {
      const response = await fetch('/api/auth/session', { credentials: 'include' });
      return response.ok ? ((await response.json()) as unknown) : { status: response.status };
    })
    .then((session) => redact(session, '', false, 0, '/api/auth/session'))
    .catch(() => 'no disponible');
}

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });
  const browser = await launch();
  const page = await browser.newPage();
  page.on('response', (response) => void onResponse(response));

  const report: Record<string, unknown> = { fecha: new Date().toISOString(), portal: new URL(loginUrl).origin };
  try {
    report.ingresoOk = await login(page, report);
    report.urlTrasIngreso = page.url();
    await page.screenshot({ path: path.join(outDir, 'tras-ingreso.png') });

    if (report.ingresoOk) {
      report.sesion = await readSession(page);
      for (const p of paths) {
        const target = new URL(p, loginUrl).toString();
        console.log(`Recorriendo ${target}`);
        await page.goto(target, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);
        for (let i = 0; i < 3; i += 1) {
          await page.mouse.wheel(0, 2_000);
          await page.waitForTimeout(1_500);
        }
        await page.screenshot({ path: path.join(outDir, `pagina-${p.replace(/\W+/g, '_')}.png`) });
      }
    }
  } catch (error) {
    report.error = error instanceof Error ? error.message : String(error);
  } finally {
    await browser.close();
  }

  report.endpoints = [...endpoints.values()];
  report.camposDeStock = Object.fromEntries([...stockFields].map(([k, v]) => [k, [...v]]));
  await writeFile(path.join(outDir, 'reporte.json'), JSON.stringify(report, null, 2), 'utf8');

  console.log('\n=== Resumen ===');
  console.log(`Ingreso OK: ${String(report.ingresoOk)} · Captcha: ${String(report.captchaEnLogin)}`);
  console.log(`Endpoints JSON encontrados: ${endpoints.size}`);
  for (const e of endpoints.values()) console.log(`  ${e.status} ${e.method} ${e.url}  (auth: ${e.auth})`);
  console.log(`Campos que parecen de stock: ${stockFields.size}`);
  for (const [field, values] of stockFields) console.log(`  ${field}: ${[...values].join(' | ')}`);
  if (report.error) console.log(`Error: ${String(report.error)}`);
  console.log(`\nReporte completo: ${path.join(outDir, 'reporte.json')}`);
}

void main();
