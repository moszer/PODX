import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { RecoilRoot } from 'recoil';
import App from './App.jsx';

const AppRouter = () => (
  <BrowserRouter>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(<AppRouter />);
