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
    black: '#000000',
    text: '#020202',
    subText_1: '#464545ff',
    subText_2: '#6B7280',
    grayLight: '#F3F4F6',
    grayMedium: '#9CA3AF',
    grayDark: '#4B5563',

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
    xxl: 40,
    gap: 10,
  },
} as const;

export type Theme = typeof theme;
