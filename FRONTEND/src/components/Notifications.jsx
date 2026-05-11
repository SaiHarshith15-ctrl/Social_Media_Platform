import React, { useState, useEffect, useRef } from 'react'

const BellIcon = ({ hasUnread }) => (
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {hasUnread && (
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
    )}
  </div>
)

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen]                   = useState(false)
  const [loading, setLoading]             = useState(false)
  const dropdownRef                       = useRef(null)

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Fetch on mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/notification', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notifId) => {
    try {
      await fetch(`http://localhost:3000/notification/${notifId}/read`, {
        method: 'PUT', credentials: 'include',
      })
      setNotifications(prev =>
        prev.map(n => n._id === notifId ? { ...n, isRead: true } : n)
      )
    } catch (err) { console.error(err) }
  }

  const clearAll = async () => {
    try {
      await fetch('http://localhost:3000/notification', {
        method: 'DELETE', credentials: 'include',
      })
      setNotifications([])
    } catch (err) { console.error(err) }
  }

  const handleOpen = () => {
    setOpen(prev => !prev)
    // Mark all as read when opening
    notifications.filter(n => !n.isRead).forEach(n => markAsRead(n._id))
  }

  const getIcon = (type) => {
    if (type === 'like')    return '❤️'
    if (type === 'comment') return '💬'
    if (type === 'follow')  return '👤'
    return '🔔'
  }

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="text-gray-500 hover:text-black transition p-1"
        title="Notifications"
      >
        <BellIcon hasUnread={unreadCount > 0} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-sm">Notifications</span>
            {notifications.length > 0 && (
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition">
                Clear all
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="text-center text-sm text-gray-400 py-6">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">No notifications yet</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${!n.isRead ? 'bg-blue-50' : ''}`}
                >
                  {/* Sender avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                    {n.sender?.profileImageUrl ? (
                      <img src={n.sender.profileImageUrl} alt="sender" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">
                        {n.sender?.username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{n.sender?.username}</span>
                      {' '}{getIcon(n.type)}{' '}
                      <span className="text-gray-600">{n.message}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {!n.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications