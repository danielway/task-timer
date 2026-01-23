import { StrictMode } from 'react';
import './index.css';
import { App } from './components/App';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';

// Import all stores to ensure they register with the persistence system
import './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
