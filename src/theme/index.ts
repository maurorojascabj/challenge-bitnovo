import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';

export const fontFamilies = {
  regular: 'Mulish_400Regular',
  medium: 'Mulish_500Medium',
  semibold: 'Mulish_600SemiBold',
  bold: 'Mulish_700Bold',
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  fontFamilies,
} as const;

export type Theme = typeof theme;

export { colors, spacing, radius, typography, shadows };
export type { Colors } from './colors';
export type { Spacing } from './spacing';
export type { Radius } from './radius';
export type { TypographyVariant } from './typography';

export function useTheme() {
  return theme;
}
