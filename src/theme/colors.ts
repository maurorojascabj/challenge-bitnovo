export const colors = {
  primary: {
    50: '#E6F0FB',
    100: '#C2D7F5',
    200: '#9BBDEF',
    300: '#74A3E8',
    400: '#558EE3',
    500: '#035AC5', // Bitnovo brand
    600: '#0351B1',
    700: '#02469A',
    800: '#023C84',
    900: '#012A5A',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    700: '#047857',
  },
  warning: {
    500: '#F59E0B',
  },
  danger: {
    50: '#FEF2F2',
    500: '#EF4444',
    700: '#B91C1C',
  },
  surface: '#FFFFFF',
  background: '#F9FAFB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  border: '#E5E7EB',
  transparent: 'transparent',
  buttonDisabledBg: '#EAF3FF',
  buttonDisabledText: '#71B0FD',
  placeholderAmount: '#C0CCDA',
} as const;

export type Colors = typeof colors;
