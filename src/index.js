import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Create from './Create';
import Login from './Login';
import Demo from './Demo';
import Admin from './Admin';
import About from './About';
import ConfigsPanel from './Components/ConfigsPanel';
import Config from './Config';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import store from './store';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  /* for the demo at school, since the backend is not finished.
  {
    path: "/configs",
    element: <ConfigsPanel/>,
  },
  */
  {
    path: /* for the demo at school, since the backend is not finished.
    "/config/:id"
    */ "/config",
    element: <Config/>
  },
  {
    path : "/about",
    element : <About/>
  },
  {
    path : "/login",
    element : <Login/>
  },
  {
    path : "/create",
    element : <Create/>
  },
  {
    path : "/demo",
    element : <Demo/>
  },
  {
    path    : "/admin",
    element : <Admin/>
  }
]);


// React.StrictMode to remove when prodution
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
);
