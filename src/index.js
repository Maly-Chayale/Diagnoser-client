import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import BackgroundWrapper from './BackgroundWrapper';

// הכנס כאן את Client ID שלך מ-Google
const clientId = "850793628922-mt77pmp9fmc7g37307q7316kqier689d.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <BackgroundWrapper>
            <App />
          </BackgroundWrapper>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();