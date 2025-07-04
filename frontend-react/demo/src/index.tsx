import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div className="contact-form">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </div>
);

