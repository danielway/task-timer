import { createTheme } from '@mui/material';

// Color palette
export const colors = {
  primary: {
    main: '#173040',
    light: '#2d4a5e',
    dark: '#0d1c26',
  },
  secondary: {
    main: '#bf3111',
    light: '#e04a2a',
    dark: '#8c240d',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  border: {
    light: '#e0e0e0',
    selection: '#173040',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

// Typography settings
export const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: {
    xs: 12,
    sm: 13,
    md: 14,
    lg: 15,
  },
} as const;

// Spacing and sizing
export const spacing = {
  container: {
    xs: 8,
    sm: 16,
  },
  content: {
    xs: 1,
    sm: 2,
    md: 2.5,
  },
} as const;

// Breakpoints
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1280,
  xl: 1536,
} as const;

// Create MUI theme
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
  },
  breakpoints: {
    values: breakpoints,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: spacing.container.xs,
          paddingRight: spacing.container.xs,
          '@media (min-width: 600px)': {
            paddingLeft: spacing.container.sm,
            paddingRight: spacing.container.sm,
          },
          '@media (min-width: 1280px)': {
            maxWidth: breakpoints.lg,
          },
        },
      },
    },
  },
});
