import { StrictMode } from 'react';
import './index.css';
import { App } from './components/App';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { store } from './app/store';
import { enableMapSet } from 'immer';

enableMapSet();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
