import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { API_URL } from '../../config.js'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('${API_URL}/notification', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setNotifications(d.notifications || []))
      .finally(() => setLoading(false))
  }, [])

  const clearAll = async () => {
    await fetch('${API_URL}/notification', { method: 'DELETE', credentials: 'include' })
    setNotifications([])
  }

  const getIcon = (type) => {
    if (type === 'like') return '❤️'
    if (type === 'comment') return '💬'
    if (type === 'follow') return '👤'
    if (type === 'followRequest') return '🔔'
    return '🔔'
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-20 flex-1 max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Notifications</h1>
          {notifications.length > 0 && (
            <button onClick={clearAll} className="text-sm text-red-500 hover:underline">Clear all</button>
          )}
        </div>
        {loading ? <p className="text-center text-gray-400 py-20">Loading...</p>
          : notifications.length === 0
            ? <p className="text-center text-gray-400 py-20">No notifications yet</p>
            : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n._id} className={`flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm ${!n.isRead ? 'border-l-4 border-blue-500' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                      {n.sender?.profileImageUrl
                        ? <img src={n.sender.profileImageUrl} className="w-full h-full object-cover" />
                        : <span className="text-sm font-bold text-gray-500">{n.sender?.username?.[0]?.toUpperCase()}</span>
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm"><span className="font-semibold">{n.sender?.username}</span> {getIcon(n.type)} {n.message}</p>
                      <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </main>
    </div>
  )
}

export default NotificationsPage