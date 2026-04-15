/**
 * Typography Styles
 * Text styles and font configurations
 */

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Text styles
  heading1: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },

  heading2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },

  heading3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },

  heading4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },

  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },

  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },

  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },

  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },

  // Shorthand aliases (used throughout the app as TYPOGRAPHY.h1, .h2, etc.)
  h1: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },

  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },

  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },

  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
};

export default TYPOGRAPHY;
