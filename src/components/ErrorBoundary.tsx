import { Component, type ReactNode } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    // Clear localStorage and reload
    try {
      localStorage.removeItem('state');
    } catch {
      // Ignore errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
          >
            <Typography variant="h4" gutterBottom color="error">
              Something went wrong
            </Typography>
            <Typography variant="body1" gutterBottom>
              The application encountered an unexpected error.
            </Typography>
            {this.state.error && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, mb: 2, fontFamily: 'monospace' }}
              >
                {this.state.error.message}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              sx={{ mt: 2 }}
            >
              Reset Application
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
