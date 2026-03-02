/**
 * urlParams.ts — URL parameter utility functions.
 * Helpers for reading and persisting query strings with sessionStorage fallback.
 */

/** Read a query parameter from the current URL. */
export function getQueryParam(key: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/** Read all query parameters as a plain object. */
export function getAllQueryParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/** Build a query string from a plain object. */
export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== '' && v !== null
  );
  if (filtered.length === 0) return '';
  const qs = new URLSearchParams(
    filtered.map(([k, v]) => [k, String(v)])
  ).toString();
  return `?${qs}`;
}

/** Persist a value to sessionStorage. */
export function persistToSession(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // sessionStorage may be unavailable in some environments
  }
}

/** Read a value from sessionStorage. */
export function readFromSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Clear a value from sessionStorage. */
export function clearFromSession(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Read a secret/config parameter from multiple sources:
 * URL query params → sessionStorage → empty string.
 * Used by useActor.ts for admin token initialization.
 */
export function getSecretParameter(key: string): string {
  // 1. Check URL query params
  const fromUrl = getQueryParam(key);
  if (fromUrl) {
    // Persist to session so it survives navigation
    persistToSession(key, fromUrl);
    return fromUrl;
  }
  // 2. Fall back to sessionStorage
  const fromSession = readFromSession(key);
  if (fromSession) return fromSession;
  // 3. Not found
  return '';
}

/** Format a price number as a currency string. */
export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

/** Format a bigint timestamp (nanoseconds) to a readable date string. */
export function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Format a bigint timestamp to a short date. */
export function formatTimestampShort(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format a bigint timestamp to date + time. */
export function formatTimestampFull(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Get a human-readable label for an OrderStatus variant. */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    placed:         'Order Placed',
    confirmed:      'Confirmed',
    shipped:        'Shipped',
    outForDelivery: 'Out for Delivery',
    delivered:      'Delivered',
    cancelled:      'Cancelled',
  };
  return labels[status] ?? status;
}

/** Get a color class for an OrderStatus variant. */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    placed:         'bg-blue-100 text-blue-800',
    confirmed:      'bg-purple-100 text-purple-800',
    shipped:        'bg-yellow-100 text-yellow-800',
    outForDelivery: 'bg-orange-100 text-orange-800',
    delivered:      'bg-green-100 text-green-800',
    cancelled:      'bg-red-100 text-red-800',
  };
  return colors[status] ?? 'bg-muted text-muted-foreground';
}
