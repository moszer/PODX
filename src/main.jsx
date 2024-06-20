import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Login from './Login.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import Register from './Register.jsx';
import Connect from './Connect.jsx';

const router = createBrowserRouter([
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Connect",
    element: <Connect />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
