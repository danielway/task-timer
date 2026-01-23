import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BacklogDrawer } from '../backlog/BacklogDrawer';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import { theme, spacing } from '../../theme';
import { useAppStore } from '../../store';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 320;

export const Layout = (props: LayoutProps) => {
  const backlogOpen = useAppStore((state) => state.backlogOpen);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box sx={{ display: 'flex' }}>
        <BacklogDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            transition: 'margin 0.2s ease-in-out',
            marginLeft: backlogOpen ? `${DRAWER_WIDTH}px` : 0,
            width: backlogOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          }}
        >
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
        </Box>
      </Box>
    </ThemeProvider>
  );
};
