import { gradients } from '@assets/theme/gradient';
import { fonts } from '@assets/theme/font';

export const theme = {
  fonts,
  colors: {
    primary: '#2D8C83',
    red: '#DF394C',
    purple: '#6366F1',
    blue: '#0EA5E9',
    white: '#FFFFFF',
    text: '#020202',
    subText: '#818181',

    //SettingScreen colors
    green: '#10B981',
    orange: '#F97316',
    violet: '#8B5CF6',
    danger: '#EF4444',
    info: '#3B82F6',
    muted: '#6B7280',
  },
  gradients,
  spacing: {
    xs: 4,
    sm: 16,
    md: 16,
    lg: 24,
    xl: 32,
    gap: 10,
  },
} as const;

export type Theme = typeof theme;
