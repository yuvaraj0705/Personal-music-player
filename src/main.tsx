import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { seedDatabase } from './firebase/seed';

// Expose seedDatabase globally for easy execution from the browser console
(window as any).seedDatabase = seedDatabase;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
