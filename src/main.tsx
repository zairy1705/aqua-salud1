import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {soundService} from './utils/audioSystem';

// Initialize arcade game sound effects and hover chirps
soundService.setupGlobalListeners();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

