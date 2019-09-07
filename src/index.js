import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translation/en.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en,
    },
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });


// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('root'));
