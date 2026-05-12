import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>

const Sidebar = ({ unreadCount = 0 }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()

  const btn = (path) =>
    `flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
      location.pathname === path ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-black'
    }`

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center gap-4 py-8 border-r border-gray-200 bg-white z-40">
      <div className="font-black text-xl mb-4">S</div>

      <button onClick={() => navigate('/feed')} className={btn('/feed')} title="Home">
        <HomeIcon />
      </button>

      <button onClick={() => navigate('/search')} className={btn('/search')} title="Search">
        <SearchIcon />
      </button>

      <button onClick={() => navigate('/create-post')} className={btn('/create-post')} title="Create">
        <PlusIcon />
      </button>

      <button onClick={() => navigate('/notifications')} className={`${btn('/notifications')} relative`} title="Notifications">
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      <button onClick={() => navigate('/user-profile')} className={btn('/user-profile')} title="Profile">
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
          {currentUser?.profileImageUrl
            ? <img src={currentUser.profileImageUrl} className="w-full h-full object-cover" />
            : <span className="text-xs font-bold text-gray-600">{currentUser?.firstname?.[0]}</span>
          }
        </div>
      </button>
    </aside>
  )
}

export default Sidebar