import EspanaIcon from '@/assets/svg/espana.svg';
import GuineaIcon from '@/assets/svg/guinea.svg';
import GreciaIcon from '@/assets/svg/grecia.svg';
import GbpIcon from '@/assets/svg/gbp.svg'; // Georgia uses gbp icon per spec
import GuatemalaIcon from '@/assets/svg/guatemala.svg';
import GuyanaIcon from '@/assets/svg/guyana.svg';
import HongKongIcon from '@/assets/svg/hongkong.svg';
import HondurasIcon from '@/assets/svg/honduras.svg';

export type CountryKey =
  | 'espana'
  | 'guinea'
  | 'grecia'
  | 'georgia'
  | 'guatemala'
  | 'guyana'
  | 'hongkong'
  | 'honduras';

export interface CountryItem {
  icon: React.FC<{ width?: number; height?: number; color?: string }>;
  name: string;
  value: string;
}

export const COUNTRIES: Record<CountryKey, CountryItem> = {
  espana: {
    icon: EspanaIcon,
    name: 'España',
    value: '+34',
  },
  guinea: {
    icon: GuineaIcon,
    name: 'Equatorial Guinea',
    value: '+240',
  },
  grecia: {
    icon: GreciaIcon,
    name: 'Grecia',
    value: '+30',
  },
  georgia: {
    icon: GbpIcon, // per spec
    name: 'South Georgia and the South Sandwich Islands',
    value: '+500',
  },
  guatemala: {
    icon: GuatemalaIcon,
    name: 'Guatemala',
    value: '+502',
  },
  guyana: {
    icon: GuyanaIcon,
    name: 'Guyana',
    value: '+592',
  },
  hongkong: {
    icon: HongKongIcon,
    name: 'Hong Kong',
    value: '+852',
  },
  honduras: {
    icon: HondurasIcon,
    name: 'Honduras',
    value: '+504',
  },
} as const;

export const COUNTRY_LIST = Object.entries(COUNTRIES).map(([key, value]) => ({
  key: key as CountryKey,
  ...value,
}));
