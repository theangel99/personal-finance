export const theme = {
  colors: {
    background: '#0B0E11',
    surface: '#151A1F',
    surfaceElevated: '#1C2329',
    surfaceHighlight: '#232A31',
    border: '#2A3139',

    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    primaryGradient: ['#3B82F6', '#8B5CF6'],

    accent: '#8B5CF6',
    accentLight: '#A78BFA',

    success: '#10B981',
    successLight: '#34D399',
    error: '#EF4444',
    errorLight: '#F87171',
    warning: '#F59E0B',
    warningLight: '#FBBF24',

    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textMuted: '#4B5563',

    income: '#10B981',
    incomeBackground: 'rgba(16, 185, 129, 0.1)',
    expense: '#EF4444',
    expenseBackground: 'rgba(239, 68, 68, 0.1)',

    overlay: 'rgba(0, 0, 0, 0.7)',
    shimmer: 'rgba(255, 255, 255, 0.05)',

    chartColors: [
      '#3B82F6',
      '#8B5CF6',
      '#EC4899',
      '#10B981',
      '#F59E0B',
      '#06B6D4',
      '#6366F1',
      '#F97316',
    ],
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },

  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
