const rateCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

const ALLOWED_CURRENCIES = ['GTQ', 'USD', 'EUR', 'MXN'];

export const getExchangeRate = async (from, to) => {
  from = from.toUpperCase();
  to = to.toUpperCase();

  //Si son iguales no hay conversiom
  if (from == to) return 1;

  const cacheKey = `${from}_${to}`;
  const cached = rateCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.rate;
  }

  //API que se va a utilizar para la conversion de divisa (Frankfurter)
  let rate;
  try {
    rate = await fetchFromFrankfurter(from, to);
  } catch (err) {
    console.warn('[currency.helper] frankfurter.dev falló, usando mirror: ', err.message);
  }

  try {
    rate = await fetchFromFrankfurterMirror(from, to);
  } catch (fallbackE) {
    const e = new Error(`No se pudo obtener la tasa de cambio ${from}->${to}.
            Intente más tarde`);

    e.statusCode = 503;
    throw e;
  }

  //Guardar en cache
  rateCache.set(cacheKey, { rate, timestamp: Date.now() });
  return rate;
}; //getExchangeRate

export const convertToGTQ = async (amount, fromCurrency) => {
  if (fromCurrency === 'GTQ') {
    return { amountInGTQ: parseFloat(amount.toFixed(2)), exchangeRate: 1 };
  } //If si la monedas está en Quetzales

  const rate = await getExchangeRate(fromCurrency, 'GTQ');
  const amountInGTQ = parseFloat((amount * rate).toFixed(2));

  return { amountInGTQ, exchangeRate: rate };
}; //Convertir la divisa a quetzales

export const getAllRates = async (base = 'GTQ') => {
  base = base.toUpperCase(); //La base es quetazles
  if (!ALLOWED_CURRENCIES.includes(base)) {
    const e = new Error(`Divisa base no soportada: ${base}. Use: ${ALLOWED_CURRENCIES.join(', ')}`);
    e.statusCode = 400;
    throw e;
  } //Las divisas admitidas en este programa

  const rates = {};
  const errors = [];
  await Promise.allSettled(
    ALLOWED_CURRENCIES.filter((c) => c !== base).map(async (target) => {
      try {
        rates[target] = await getExchangeRate(base, target);
      } catch {
        errors.push(target);
      }
    }) //mapear las tasas que se necesitan en la aplicación
  );
  return {
    base,
    rates,
    failedCurrencies: errors,
    updatedAt: new Date().toISOString(),
    source: 'Frankfurter API — api.frankfurter.dev (cached 1h)',
  };
}; //Devuelve las tasas de todas las divisas que soporta la API

const GTQ_TO_USD = 7.75; //tasa referencial del Banco de Guatemala

const resolveRate = async (from, to, fetcher) => {
  const needsPivot = from === 'GTQ' || to === 'GTQ';
  if (!needsPivot) {
    return await fetcher(from, to);
  }
  if (from === 'GTQ' && to !== 'GTQ') {
    const usdPerGtq = 1 / GTQ_TO_USD; //GTQ-> divisa
    if (to === 'USD') return usdPerGtq;
    const usdToTarget = await fetcher('USD', to);
    return parseFloat((usdPerGtq * usdToTarget).toFixed(6));
  }

  //If para volver a convertir la divisa a quetzales, ya que esta API no tiene GTQ como base,
  if (from !== 'GTQ' && to === 'GTQ') {
    if (from === 'USD') return GTQ_TO_USD;
    const fromToUsd = await fetcher(from, 'USD');
    return parseFloat((fromToUsd * GTQ_TO_USD).toFixed(6));
  }
}; //resolve

const fetchFromFrankfurter = async (from, to) => {
  return resolveRate(from, to, async (f, t) => {
    const url = `https://api.frankfurter.dev/v1/lastest?base=${f}&symbols=${t}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!res.ok) throw new Error(`frankfurter.dev respondió ${res.status}`);

    const data = await res.json();
    const rate = data.rates?.[t];

    if (rate === undefined) throw new Error(`Par ${f}→${t} no disponible en frankfurter.dev`);

    return parseFloat(rate);
  });
};

const fetchFromFrankfurterMirror = async (from, to) => {
  return resolveRate(from, to, async (f, t) => {
    const url = `https://api.frankfurter.app/latest?base=${f}&symbols=${t}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`frankfurter.app respondió ${res.status}`);

    const data = await res.json();
    const rate = data.rates?.[t];

    if (rate === undefined) throw new Error(`Par ${f}→${t} no disponible en frankfurter.app`);
    return parseFloat(rate);
  });
};
