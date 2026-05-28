import { FIAT_CURRENCIES, FiatKey } from '@/constants/currencies';

export const MAX_AMOUNT = 30_000;

/** Decimal separator per currency key */
const decimalSep = (currency: FiatKey): string =>
  (FIAT_CURRENCIES[currency] as { locale: string }).locale === 'es-ES' ? ',' : '.';

/**
 * Sanitize raw text input on every keystroke.
 * – Normalises any . or , to the currency decimal separator
 * – Strips non-numeric chars (except the decimal sep)
 * – Allows only one decimal separator (keeps the first)
 * – Caps integer part at 6 digits, decimal part at 2 digits
 * – Removes leading zeros (e.g. "007" → "7", but "0,5" stays)
 */
export function sanitizeInput(text: string, currency: FiatKey): string {
  const sep = decimalSep(currency);
  const other = sep === ',' ? '.' : ',';

  // Normalize the other separator to this currency's separator
  let t = text.replace(new RegExp(`\\${other}`, 'g'), sep);

  // Strip all chars except digits and the decimal separator
  t = t.replace(new RegExp(`[^0-9\\${sep}]`, 'g'), '');

  // Only the first separator is kept
  const firstSep = t.indexOf(sep);
  if (firstSep !== -1) {
    const intPart = t.slice(0, firstSep);
    const decPart = t.slice(firstSep + 1).replace(new RegExp(`\\${sep}`, 'g'), '');
    t = intPart + sep + decPart.slice(0, 2);
  }

  // Split into integer + optional decimal parts
  const [intRaw, decRaw] = t.split(sep);
  let intPart = (intRaw ?? '').slice(0, 6);

  // Strip leading zeros (keep "0" alone or "0,X")
  if (intPart.length > 1 && intPart[0] === '0') {
    intPart = intPart.replace(/^0+/, '') || '0';
  }

  return decRaw !== undefined ? `${intPart}${sep}${decRaw}` : intPart;
}

/**
 * Parse a raw canonical string (e.g. "1250,50" or "1250.50") to a number.
 * Currency-agnostic: strips all separators except the last one.
 * Returns NaN for empty / invalid strings.
 */
export function parseAmount(raw: string): number {
  if (!raw || raw.trim() === '') return NaN;
  // Strip everything except digits and the last [,.]
  const lastSep = Math.max(raw.lastIndexOf(','), raw.lastIndexOf('.'));
  if (lastSep === -1) return parseFloat(raw);
  const intPart = raw.slice(0, lastSep).replace(/[^0-9]/g, '');
  const decPart = raw.slice(lastSep + 1).replace(/[^0-9]/g, '');
  return parseFloat(`${intPart}.${decPart}`);
}

/** Manual grouping fallback if Intl is unavailable */
function groupManual(intStr: string, sep: '.' | ','): string {
  return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/**
 * Format a raw canonical string for display (blurred state).
 * Uses Intl.NumberFormat with a try/catch fallback.
 * Returns "" for empty input.
 */
export function formatAmount(raw: string, currency: FiatKey): string {
  if (!raw || raw.trim() === '') return '';
  const num = parseAmount(raw);
  if (isNaN(num)) return raw;

  const { locale } = FIAT_CURRENCIES[currency] as { locale: string };

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(num);
  } catch {
    // Fallback: manual thousand-group + 2 decimal places
    const isEur = locale === 'es-ES';
    const decSep = isEur ? ',' : '.';
    const thouSep = isEur ? '.' : ',';
    const [intStr, decStr] = num.toFixed(2).split('.');
    return `${groupManual(intStr!, thouSep as '.' | ',')}${decSep}${decStr}`;
  }
}

/**
 * Locale-correct validation error message for amounts exceeding MAX_AMOUNT.
 * e.g. formatMaxError('eur') → "El monto máximo diario es de 30.000,00 €"
 */
export function formatMaxError(currency: FiatKey): string {
  const { symbol } = FIAT_CURRENCIES[currency];
  const { symbolPosition } = FIAT_CURRENCIES[currency] as { symbolPosition: 'left' | 'right' };
  const formatted = formatAmount(String(MAX_AMOUNT), currency);
  return symbolPosition === 'left'
    ? `El monto máximo diario es de ${symbol} ${formatted}`
    : `El monto máximo diario es de ${formatted} ${symbol}`;
}
