import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { pageBackground, pageWrapper, cardClass, headingClass, bodyText, secondaryBtn } from '../styles/common'

function UserProfile() {
  const { userId }             = useParams()
  const { currentUser, logout } = useAuth()
  const navigate                = useNavigate()

  // If no userId param → it's the logged-in user's own profile
  const isOwnProfile = !userId || userId === currentUser?._id?.toString()
  const targetId     = isOwnProfile ? currentUser?._id : userId

  const [user, setUser]     = useState(isOwnProfile ? currentUser : null)
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!targetId) return
    fetchPosts()
    if (!isOwnProfile) fetchUser()
    else { setUser(currentUser); setLoading(false) }
  }, [targetId])

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:3000/user/${userId}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.payload)
      }
    } catch (err) { console.error(err) }
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch(`http://localhost:3000/posts/user/${targetId}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setPosts(data.payload || [])
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleLogout = async () => { await logout(); window.location.href = '/' }

  if (loading) return <div className={pageBackground}><div className={pageWrapper}><p className="text-center py-20">Loading...</p></div></div>
  if (!user)   return <div className={pageBackground}><div className={pageWrapper}><p className="text-center py-20">User not found.</p></div></div>

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>

        {/* Profile Header */}
        <div className={`${cardClass} mb-8`}>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
              {user.profileImageUrl
                ? <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-gray-600">{user.firstname?.[0]}{user.lastname?.[0]}</span>
              }
            </div>

            <div className="flex-1">
              <h1 className={headingClass}>{user.firstname} {user.lastname}</h1>
              <p className={`${bodyText} text-gray-500`}>@{user.username}</p>
              {user.bio && <p className={`${bodyText} mt-2`}>{user.bio}</p>}
              <div className="flex gap-4 mt-4">
                <span className={bodyText}><strong>{user.followers?.length || 0}</strong> Followers</span>
                <span className={bodyText}><strong>{user.following?.length || 0}</strong> Following</span>
                <span className={bodyText}><strong>{posts.length}</strong> Posts</span>
              </div>
            </div>

            {isOwnProfile ? (
              <button onClick={handleLogout} className={secondaryBtn}>Logout</button>
            ) : (
              <button className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition">
                Follow
              </button>
            )}
          </div>
        </div>

        {/* Posts */}
        <div>
          <h2 className={`${headingClass} mb-6`}>{isOwnProfile ? 'Your Posts' : `${user.username}'s Posts`}</h2>

          {posts.length === 0 ? (
            <div className={`${cardClass} text-center py-8`}>
              <p className={bodyText}>No posts yet.</p>
              {isOwnProfile && (
                <button onClick={() => navigate('/create-post')}
                  className="mt-4 bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition">
                  Create your first post
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post._id} className={cardClass}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                      {user.profileImageUrl
                        ? <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                        : <span className="text-sm font-bold text-gray-600">{user.firstname?.[0]}{user.lastname?.[0]}</span>
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{user.username}</span>
                        <span className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className={bodyText}>{post.content}</p>
                      {post.postImageUrl && (
                        <img src={post.postImageUrl} alt="Post" className="mt-4 rounded-lg max-w-full h-auto" />
                      )}
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span>❤️ {post.likesCount}</span>
                        <span>💬 {post.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default UserProfile