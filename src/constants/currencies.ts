import UsdIcon from '@/assets/svg/usd.svg';
import EurIcon from '@/assets/svg/eur.svg';
import GbpIcon from '@/assets/svg/gbp.svg';

export type FiatCurrency = 'EUR' | 'USD' | 'GBP';
export type FiatKey = 'eur' | 'usd' | 'gbp';

export interface CurrencyItem {
  icon: React.FC<{ width?: number; height?: number; color?: string }>;
  title: string;
  details: FiatCurrency;
  symbol: string;
  decimal: number;
  locale: string;
  symbolPosition: 'left' | 'right';
}

export const FIAT_CURRENCIES: Record<FiatKey, CurrencyItem> = {
  eur: {
    icon: EurIcon,
    title: 'Euro',
    details: 'EUR',
    symbol: '€',
    decimal: 2,
    locale: 'es-ES',
    symbolPosition: 'right',
  },
  usd: {
    icon: UsdIcon,
    title: 'Dólar Estadounidense',
    details: 'USD',
    symbol: '$',
    decimal: 2,
    locale: 'en-US',
    symbolPosition: 'left',
  },
  gbp: {
    icon: GbpIcon,
    title: 'Libra Esterlina',
    details: 'GBP',
    symbol: '£',
    decimal: 2,
    locale: 'en-GB',
    symbolPosition: 'left',
  },
} as const;

export const FIAT_CURRENCY_LIST = Object.entries(FIAT_CURRENCIES).map(([key, value]) => ({
  key: key as FiatKey,
  ...value,
}));

export const DEFAULT_FIAT: FiatKey = 'eur';

export function getCurrencyByCode(code: FiatCurrency): CurrencyItem | undefined {
  return Object.values(FIAT_CURRENCIES).find((c) => c.details === code);
}
