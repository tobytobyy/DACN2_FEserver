import { fonts } from '../theme/font';

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
  },
  gradients: {
    background: {
      colors: ['#BBFFE2', '#DDFFF1', '#D5D5D5'],
      locations: [0, 0.17, 1],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
  },
  spacing: {
    xs: 4,
    sm: 16,
    md: 16,
    lg: 24,
    xl: 32,
    gap: 10,
  },
};

export type Theme = typeof theme;
