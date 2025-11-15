import { StrictMode } from 'react';
import './index.css';
import { App } from './components/App';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { store } from './app/store';
import { enableMapSet } from 'immer';
import { ErrorBoundary } from './components/ErrorBoundary';

enableMapSet();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
