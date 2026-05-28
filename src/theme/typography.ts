export const typography = {
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
    fontFamily: 'Mulish_700Bold',
    letterSpacing: -1,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    fontFamily: 'Mulish_700Bold',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    fontFamily: 'Mulish_600SemiBold',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
    fontFamily: 'Mulish_600SemiBold',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    fontFamily: 'Mulish_400Regular',
  },
  bodySemibold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    fontFamily: 'Mulish_600SemiBold',
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    fontFamily: 'Mulish_400Regular',
  },
  smallSemibold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    fontFamily: 'Mulish_600SemiBold',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    fontFamily: 'Mulish_400Regular',
  },
  captionSemibold: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    fontFamily: 'Mulish_600SemiBold',
  },
} as const;

export type TypographyVariant = keyof typeof typography;
