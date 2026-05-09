import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { AccessibilityProvider } from './context/AccessibilityContext';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </Provider>
);