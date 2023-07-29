import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ROUTES from './config';

const Router: React.FC = () => <RouterProvider router={createBrowserRouter(ROUTES)} />;

export default Router;
