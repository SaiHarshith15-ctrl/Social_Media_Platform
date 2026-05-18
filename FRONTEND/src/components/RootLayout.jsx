import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../store/authStore'

function RootLayout() {

  const { isAuthenticated } = useAuth()

  return (
    <div>
      {isAuthenticated ? <Sidebar /> : <Header />}

      <div className='min-h-screen' style={{marginLeft: isAuthenticated ? 80 : 0}}>
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}

export default RootLayout