import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import { theme, spacing } from '../../theme';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = (props: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container>
        <Box
          sx={{
            p: {
              xs: spacing.content.xs,
              sm: spacing.content.sm,
              md: spacing.content.md,
            },
          }}
        >
          {props.children}
        </Box>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};
