// E0, parte 2: (a) ¿se puede ingresar por HTTP, sin navegador? (b) ¿la cantidad de /user/products
// coincide con el semáforo de la lista de precios? Solo lectura, 1 solicitud por segundo.
// Resultado agregado (sin datos personales) en data/spike/correlacion.json.
import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, '../../data/spike');
const portal = new URL(process.env.SUPPLIER_PORTAL_URL ?? '').origin;
const api = process.env.SUPPLIER_API_URL ?? portal.replace('://sistema.', '://api.');
const user = process.env.SUPPLIER_USER ?? '';
const password = process.env.SUPPLIER_PASSWORD ?? '';

const cookies = new Map<string, string>();
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function call(url: string, init: RequestInit = {}): Promise<Response> {
  await sleep(1_000);
  const headers = new Headers(init.headers);
  if (cookies.size) headers.set('cookie', [...cookies].map(([k, v]) => `${k}=${v}`).join('; '));
  const response = await fetch(url, { ...init, headers, redirect: 'manual' });
  for (const raw of response.headers.getSetCookie()) {
    const [pair] = raw.split(';');
    const index = pair.indexOf('=');
    cookies.set(pair.slice(0, index), pair.slice(index + 1));
  }
  return response;
}

async function loginHttp(): Promise<string | null> {
  for (const field of ['username', 'email']) {
    cookies.clear();
    const { csrfToken } = (await (await call(`${portal}/api/auth/csrf`)).json()) as { csrfToken: string };
    const body = new URLSearchParams({ [field]: user, password, csrfToken, json: 'true', callbackUrl: portal });
    const response = await call(`${portal}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    const session = (await (await call(`${portal}/api/auth/session`)).json().catch(() => null)) as {
      user?: { accessToken?: string };
    } | null;
    const token = session?.user?.accessToken;
    console.log(`Ingreso HTTP con campo "${field}": status ${response.status}, token ${token ? 'OK' : 'no'}`);
    if (token) return token;
  }
  return null;
}

interface PriceListRow { name: string; stockEmoji: string; priceUsd: string }
interface ProductRow { name: string; colorStock: Record<string, number> | null; productReference?: { id: number; priceUsd: string } }

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });
  const token = await loginHttp();
  if (!token) {
    console.log('No se pudo ingresar por HTTP: en producción habría que usar el navegador automatizado.');
    return;
  }
  const auth = { authorization: `Bearer ${token}` };

  const priceList = (await (await call(`${api}/user/price-list/products?filter=0`, { headers: auth })).json()) as {
    data: PriceListRow[];
  };

  const products: ProductRow[] = [];
  for (let page = 1, totalPages = 1; page <= totalPages; page += 1) {
    const result = (await (await call(`${api}/user/products?page=${page}&limit=50`, { headers: auth })).json()) as {
      data: ProductRow[];
      meta: { totalPages: number };
    };
    products.push(...result.data);
    totalPages = result.meta.totalPages;
  }

  const stockByName = new Map<string, { total: number; referenceId?: number; priceUsd?: string }>();
  for (const p of products) {
    const total = Object.values(p.colorStock ?? {}).reduce((sum, n) => sum + n, 0);
    stockByName.set(p.name.trim().toUpperCase(), { total, referenceId: p.productReference?.id, priceUsd: p.productReference?.priceUsd });
  }

  const byEmoji: Record<string, number[]> = {};
  const unmatched: string[] = [];
  const priceMismatch: string[] = [];
  for (const row of priceList.data) {
    const match = stockByName.get(row.name.trim().toUpperCase());
    if (!match) {
      unmatched.push(`${row.stockEmoji} ${row.name}`);
      continue;
    }
    (byEmoji[row.stockEmoji] ??= []).push(match.total);
    if (match.priceUsd && Number(match.priceUsd) !== Number(row.priceUsd)) priceMismatch.push(row.name);
  }

  const summary = Object.fromEntries(
    Object.entries(byEmoji).map(([emoji, totals]) => {
      const sorted = [...totals].sort((a, b) => a - b);
      return [emoji, { productos: sorted.length, min: sorted[0], mediana: sorted[Math.floor(sorted.length / 2)], max: sorted.at(-1), valores: sorted }];
    }),
  );
  const namesByReference = new Map<number | undefined, string[]>();
  for (const p of products) {
    const id = p.productReference?.id;
    namesByReference.set(id, [...(namesByReference.get(id) ?? []), p.name]);
  }
  const sharedReferences = [...namesByReference].filter(([id, names]) => id === undefined || names.length > 1);
  const allNames = products.map((p) => p.name.trim().toUpperCase());
  const report = {
    productosApi: products.length,
    filasLista: priceList.data.length,
    referenciaIdUnica: sharedReferences.length === 0,
    referenciasCompartidas: sharedReferences.map(([id, names]) => ({ id: id ?? null, nombres: names })),
    nombresDuplicadosEnApi: allNames.filter((n, i) => allNames.indexOf(n) !== i),
    porSemaforo: summary,
    sinCoincidencia: unmatched,
    preciosDistintos: priceMismatch,
  };
  await writeFile(path.join(outDir, 'correlacion.json'), JSON.stringify(report, null, 2), 'utf8');

  console.log(`Productos en la API: ${products.length} · filas en la lista: ${priceList.data.length}`);
  console.log(`productReference.id único por producto: ${report.referenciaIdUnica}`);
  for (const r of report.referenciasCompartidas) console.log(`  ref ${String(r.id)}: ${r.nombres.join(' || ')}`);
  console.log(`Nombres duplicados en la API: ${report.nombresDuplicadosEnApi.join(', ') || 'ninguno'}`);
  for (const [emoji, s] of Object.entries(summary)) console.log(`${emoji}  ${s.productos} productos · unidades min ${s.min} / mediana ${s.mediana} / max ${s.max}`);
  console.log(`Sin coincidencia por nombre: ${unmatched.length} · Precio distinto entre lista y API: ${priceMismatch.length}`);
}

void main();
