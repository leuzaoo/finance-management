import axios from "axios";
import { parseStringPromise } from "xml2js";

type RatesEUR = Record<string, number>;

export type RatesPayload = {
  base: string; // moeda base do usuário
  rates: Record<string, number>;
  updatedAt: string; // data de referência do ECB
  source: "ECB";
  ttlMs: number;
  stale: boolean;
  direction: "X->BASE";
};

const TTL_MS = 24 * 60 * 60 * 1000; // 24h (ECB atualiza 1x/dia)
const MAX_STALE_MS = 7 * 24 * 60 * 60 * 1000;

const cache: Record<string, { data: RatesPayload; ts: number }> = {};

async function fetchEcbDaily(): Promise<{
  ratesEUR: RatesEUR;
  dateISO: string;
}> {
  const { data: xml } = await axios.get(
    "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
    { timeout: 12000 }
  );

  const parsed = await parseStringPromise(xml);
  const dayCube = parsed["gesmes:Envelope"].Cube[0].Cube[0];
  const cubes = dayCube.Cube as Array<any>;

  const rates: RatesEUR = { EUR: 1 };
  for (const c of cubes) {
    rates[c.$.currency] = Number(c.$.rate);
  }

  const date = dayCube.$?.time
    ? new Date(dayCube.$.time).toISOString()
    : new Date().toISOString();

  return { ratesEUR: rates, dateISO: date };
}

/** Converte tabela EUR->X em mapa X->BASE (1 X = ? BASE) */
function toBase(ratesEUR: RatesEUR, base: string): Record<string, number> {
  if (!ratesEUR[base]) {
    throw new Error(`Base ${base} não suportada pelo ECB.`);
  }
  const rBase = ratesEUR[base]; // EUR -> BASE
  const out: Record<string, number> = {};
  for (const [code, rX] of Object.entries(ratesEUR)) {
    if (code === base) out[code] = 1;
    else out[code] = Number((rBase / rX).toFixed(10));
  }
  return out;
}

export async function getRatesToBase(base: string): Promise<RatesPayload> {
  base = base.toUpperCase();
  const now = Date.now();
  const cached = cache[base];

  if (cached && now - cached.ts < TTL_MS) {
    return cached.data;
  }

  try {
    const { ratesEUR, dateISO } = await fetchEcbDaily();
    const rates = toBase(ratesEUR, base);

    const payload: RatesPayload = {
      base,
      rates, // X -> BASE
      updatedAt: dateISO,
      source: "ECB",
      ttlMs: TTL_MS,
      stale: false,
      direction: "X->BASE",
    };

    cache[base] = { data: payload, ts: now };
    return payload;
  } catch (err) {
    if (cached && now - cached.ts < MAX_STALE_MS) {
      return { ...cached.data, stale: true };
    }
    throw err;
  }
}
