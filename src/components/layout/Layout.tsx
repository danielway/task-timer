import { Header } from "./Header";
import { Footer } from "./Footer";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  createTheme,
} from "@mui/material";

function Layout(props: any) {
  const theme = createTheme({
    palette: {
      primary: { main: "#173040" },
      secondary: { main: "#bf3111" },
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
