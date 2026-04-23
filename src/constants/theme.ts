export const theme = {
  colors: {
    // Primary palette (Purple)
    primary: {
      100: '#EAE6F7',
      200: '#C5BAEB',
      300: '#A18FDF',
      400: '#7C63D3',
      500: '#5838C7', // Base primary
      600: '#462DA0', // Hover / Active
      700: '#352278',
      800: '#231650',
      900: '#120B28',
    },
    // Neutrals
    neutral: {
      50: '#F9FAFB',  // Background
      100: '#F3F4F6', // Surface / Card
      200: '#E5E7EB', // Border
      300: '#D1D5DB', // Border hover
      400: '#9CA3AF', // Text muted / Placeholder
      500: '#6B7280', // Text secondary
      600: '#4B5563', 
      700: '#374151',
      800: '#1F2937', // Text primary
      900: '#111827',
    },
    // Semantic States
    success: {
      light: '#D1FAE5',
      base: '#10B981',
      dark: '#047857',
    },
    danger: {
      light: '#FEE2E2',
      base: '#EF4444',
      dark: '#B91C1C',
    },
    warning: {
      light: '#FEF3C7',
      base: '#F59E0B',
      dark: '#B45309',
    },
    info: {
      light: '#DBEAFE',
      base: '#3B82F6',
      dark: '#1D4ED8',
    },
    // Aliases for easier usage
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};
