/**
 * Color Palette
 * SSG InnoVoice - CTU Daanbantayan Campus branding colors
 * Aligned with Web App variables.scss
 */

// Base Colors (aligned with Web App)
const palette = {
  // Red Tones
  primaryRed: '#dc2626',
  primaryRedLight: '#ef4444',
  primaryRedDark: '#991b1b',
  primaryRedDarker: '#7f1d1d',

  // Grayscale
  white: '#ffffff',
  black: '#000000',
  greyLight: '#f5f5f5',
  grey: '#9ca3af',
  greyDark: '#4b5563',
  greyDarker: '#1f2937',

  // Dark theme surfaces (inspired by web app + reference UI)
  backgroundNavy: '#1a1a2e',       // main app background
  backgroundNavyDeep: '#16213e',   // secondary background / headers
  backgroundNavyDarker: '#0b1020', // deepest background
  cardNavy: '#111827',             // cards / elevated surfaces

  // Accent Colors
  accentGreen: '#16a34a',
  accentOrange: '#f97316',
};

// Flat color structure for easier access
export const colors = {
  // Primary colors (Red - SSG branding)
  primary: palette.primaryRed,
  primaryDark: palette.primaryRedDark,
  primaryLight: palette.primaryRedLight,

  // Secondary colors (Dark hero background like web)
  secondary: palette.backgroundNavyDeep,
  secondaryDark: palette.backgroundNavyDarker,
  secondaryLight: palette.greyDarker,

  // Status colors
  submitted: palette.grey,
  underReview: palette.primaryRedLight,
  forwarded: '#8b5cf6',
  actionTaken: palette.accentOrange,
  resolved: palette.accentGreen,
  rejected: palette.primaryRedDark,

  // Priority colors
  priorityLow: palette.accentGreen,
  priorityMedium: palette.accentOrange,
  priorityHigh: palette.primaryRedLight,
  priorityUrgent: palette.primaryRed,

  // Semantic colors
  success: palette.accentGreen,
  successLight: '#d1fae5',
  error: palette.primaryRed,
  errorLight: '#fee2e2',
  warning: palette.accentOrange,
  warningLight: '#fef3c7',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  // Neutral colors
  white: palette.white,
  black: palette.black,
  // On dark backgrounds we want light, high‑contrast text
  textDark: '#f9fafb',      // primary text on dark surfaces
  textMedium: '#e5e7eb',    // secondary text on dark surfaces
  textLight: '#9ca3af',     // muted labels / placeholders
  disabled: '#4b5563',
  // Borders are subtle on dark background
  border: '#374151',

  // Background colors (dark theme by default)
  background: palette.backgroundNavy,
  backgroundSecondary: palette.backgroundNavyDeep,
  backgroundTertiary: palette.cardNavy,
  // Extra dark background for full‑bleed screens like loading
  backgroundDark: palette.backgroundNavyDarker,

  // Elevated surfaces / cards
  surface: palette.cardNavy,
  surfaceElevated: '#1f2937',
};

// Nested structure for backward compatibility
export const COLORS = {
  primary: {
    dark: colors.primaryDark,
    main: colors.primary,
    light: colors.primaryLight,
    lighter: '#fca5a5',
    lightest: '#fee2e2',
  },
  secondary: {
    dark: colors.secondaryDark,
    main: colors.secondary,
    light: colors.secondaryLight,
    lighter: palette.grey,
    lightest: palette.greyLight,
  },
  status: {
    submitted: colors.submitted,
    underReview: colors.underReview,
    forwarded: colors.forwarded,
    actionTaken: colors.actionTaken,
    resolved: colors.resolved,
    rejected: colors.rejected,
  },
  priority: {
    low: colors.priorityLow,
    medium: colors.priorityMedium,
    high: colors.priorityHigh,
    urgent: colors.priorityUrgent,
  },
  neutral: {
    black: colors.black,
    darkest: colors.textDark,
    darker: '#374151',
    dark: colors.textMedium,
    main: '#6b7280',
    light: colors.textLight,
    lighter: colors.border,
    lightest: '#e5e7eb',
    white: colors.white,
  },
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.info,
  background: {
    primary: colors.background,
    secondary: colors.backgroundSecondary,
    tertiary: colors.backgroundTertiary,
  },
  text: {
    primary: colors.textDark,
    secondary: colors.textMedium,
    tertiary: colors.textLight,
    disabled: colors.textLight,
    inverse: colors.white,
  },
  border: {
    light: '#e5e7eb',
    main: colors.border,
    dark: colors.textLight,
  },
};

export default COLORS;
