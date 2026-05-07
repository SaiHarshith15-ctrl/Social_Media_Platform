import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import RootLayout from './components/RootLayout'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './Store/authStore'

const App = () => {
  const checkAuth = useAuth((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const routerObj = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'user-profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ])

  return <RouterProvider router={routerObj} />
}

export default App