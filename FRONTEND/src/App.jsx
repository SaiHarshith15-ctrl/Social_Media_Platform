import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home        from './components/Home'
import RootLayout  from './components/RootLayout'
import Register    from './components/Register'
import Login       from './components/Login'
import UserProfile from './components/UserProfile'
import Feed        from './components/Feed'
import CreatePost  from './components/CreatePost'
import ProtectedRoute from './components/ProtectedRoute'
import Search from './pages/Search'
import NotificationsPage from './pages/NotificationsPage'
import { useAuth } from './store/authStore'

const App = () => {
  const checkAuth = useAuth((state) => state.checkAuth)

  useEffect(() => { checkAuth() }, [checkAuth])

  const routerObj = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '',           element: <Home /> },
        { path: 'register',   element: <Register /> },
        { path: 'login',      element: <Login /> },
        {
          path: 'feed',
          element: <ProtectedRoute><Feed /></ProtectedRoute>,
        },
        {
          path: 'create-post',
          element: <ProtectedRoute><CreatePost /></ProtectedRoute>,
        },
        {
          // Own profile (no userId param)
          path: 'user-profile',
          element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
        },
        {
          // Any other user's profile
          path: 'profile/:userId',
          element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
        },
        {
          path: 'search',
          element: (
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          ),
        },

        {
          path: 'notifications',
          element: (
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ])

  return <RouterProvider router={routerObj} />
}

export default App