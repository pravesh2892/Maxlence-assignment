import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import MyContextProvider from './utils/MyContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MyContextProvider>
        <App />
      </MyContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
