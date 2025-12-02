import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import { UploadFileScreen } from './screens/UploadFileScreen.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UploadFileScreen />
  </StrictMode>,
);
