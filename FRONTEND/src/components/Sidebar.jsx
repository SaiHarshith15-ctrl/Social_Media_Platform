import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import ThemePicker from './ThemePicker'

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>

const Sidebar = ({ unreadCount = 0 }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()

  const btnStyle = (path) => ({
    display:'flex', flexDirection:'column', alignItems:'center',
    gap:4, padding:12, borderRadius:12, border:'none', cursor:'pointer',
    width:56, height:56, justifyContent:'center',
    background: location.pathname === path ? 'var(--cur-accent, #1d1d1f)' : 'transparent',
    color: location.pathname === path ? '#ffffff' : 'var(--cur-muted, #6e6e73)',
    transition:'all 0.2s'
  })

  return (
    <aside style={{
      position:'fixed', left:0, top:0, height:'100vh', width:80,
      display:'flex', flexDirection:'column', alignItems:'center',
      gap:8, paddingTop:32, paddingBottom:24,
      borderRight:'1px solid var(--cur-border, #e5e7eb)',
      background:'var(--cur-sidebar, #ffffff)', zIndex:40,
      transition:'background 0.3s, border-color 0.3s'
    }}>
      <div style={{fontWeight:900, fontSize:20, marginBottom:16, color:'var(--cur-accent, #0066cc)'}}>S</div>

      <button onClick={() => navigate('/feed')} style={btnStyle('/feed')} title="Home">
        <HomeIcon />
      </button>

      <button onClick={() => navigate('/search')} style={btnStyle('/search')} title="Search">
        <SearchIcon />
      </button>

      <button onClick={() => navigate('/create-post')} style={btnStyle('/create-post')} title="Create">
        <PlusIcon />
      </button>

      <div style={{position:'relative'}}>
        <button onClick={() => navigate('/notifications')} style={btnStyle('/notifications')} title="Notifications">
          <BellIcon />
        </button>
        {unreadCount > 0 && (
          <span style={{position:'absolute', top:8, right:8, width:10, height:10,
            background:'#ef4444', borderRadius:'50%', border:'2px solid var(--cur-sidebar)'}} />
        )}
      </div>

      <button onClick={() => navigate('/user-profile')} style={btnStyle('/user-profile')} title="Profile">
        <div style={{width:32, height:32, borderRadius:'50%', background:'var(--cur-muted,#ccc)',
          overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
          {currentUser?.profileImageUrl
            ? <img src={currentUser.profileImageUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} />
            : <span style={{fontSize:12, fontWeight:'bold', color:'var(--cur-text)'}}>{currentUser?.firstname?.[0]}</span>
          }
        </div>
      </button>
      {/* spacer to push theme to bottom */}
      <div style={{ flex: 1 }} />
      <ThemePicker />

    </aside>
  )
}

export default Sidebar