import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import RootLayout from './components/RootLayout'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'


const App = () => {
  const routerObj = createBrowserRouter([
    {
      path:"/",
      element:<RootLayout/>,
      children:[
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: <Profile />,
        }

      ]
    }
  ])
  return <RouterProvider router={routerObj} />;
}

export default App