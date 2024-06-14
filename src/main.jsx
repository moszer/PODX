import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from './Login.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Register from './Register.jsx';

const router = createBrowserRouter([
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);