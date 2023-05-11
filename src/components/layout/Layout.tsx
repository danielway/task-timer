import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
} from '@mui/material';

function Layout(props: any) {
  const theme = createMuiTheme({
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
        <Box padding="20px">{props.children}</Box>
        <Footer />
      </Container>
    </ThemeProvider>
  );
}

export default Layout;
