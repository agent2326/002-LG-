
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import EcosystemSentry from './components/EcosystemSentry';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <EcosystemSentry>
      <App />
    </EcosystemSentry>
  </React.StrictMode>
);
