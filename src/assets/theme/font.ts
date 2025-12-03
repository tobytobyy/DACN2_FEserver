export const fonts = {
  nunito: {
    regular: 'Nunito-VariableFont_wght',
    italic: 'Nunito-Italic-VariableFont_wght',
  },
  weight: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
  },
};

export type FontName = keyof typeof fonts.nunito;
export type FontWeightName = keyof typeof fonts.weight;
export type FontSizeName = keyof typeof fonts.size;
