import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  createTheme,
} from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = (props: LayoutProps) => {
  const theme = createTheme({
    palette: {
      primary: { main: '#173040' },
      secondary: { main: '#bf3111' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container>
        <Box p="20px">{props.children}</Box>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};
