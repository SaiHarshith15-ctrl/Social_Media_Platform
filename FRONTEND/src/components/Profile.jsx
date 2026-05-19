import React, { useState, useEffect } from 'react'
import { useAuth } from '../store/authStore'   // lowercase 'store'
import { API_URL } from '../../config.js'
import {
  pageBackground,
  pageWrapper,
  cardClass,
  headingClass,
  bodyText,
  secondaryBtn,
} from '../styles/common'

function Profile() {
  const { currentUser: user, logout, loading: authLoading } = useAuth()
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserPosts()
    } else {
      setPosts([])
      setLoading(false)
    }
  }, [user])

  const fetchUserPosts = async () => {
    try {
      // Uses the correct endpoint: GET /posts/user/:userId (protected)
      const response = await fetch(`${API_URL}/posts/user/${user._id}`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        // postApi returns { payload: [...] }
        setPosts(data.payload || [])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  if (authLoading || loading) {
    return (
      <div className={pageBackground}>
        <div className={pageWrapper}>
          <div className="text-center py-20">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={pageBackground}>
        <div className={pageWrapper}>
          <div className="text-center py-20">Please login to view your profile.</div>
        </div>
      </div>
    )
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>

        {/* Profile Header */}
        <div className={`${cardClass} mb-8`}>
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile"
                  className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-gray-600">
                  {user.firstname?.[0]}{user.lastname?.[0]}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className={headingClass}>
                {user.firstname} {user.lastname}
              </h1>
              <p className={`${bodyText} text-gray-500`}>@{user.username}</p>
              {user.bio && <p className={`${bodyText} mt-2`}>{user.bio}</p>}
              <div className="flex gap-4 mt-4">
                <span className={bodyText}>
                  <strong>{user.followers?.length || 0}</strong> Followers
                </span>
                <span className={bodyText}>
                  <strong>{user.following?.length || 0}</strong> Following
                </span>
                <span className={bodyText}>
                  <strong>{posts.length}</strong> Posts
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className={secondaryBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className={`${headingClass} mb-6`}>Your Posts</h2>

          {posts.length === 0 ? (
            <div className={`${cardClass} text-center py-8`}>
              <p className={bodyText}>No posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className={cardClass}>
                  <div className="flex items-start gap-4">

                    {/* Mini avatar */}
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                      {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile"
                          className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-gray-600">
                          {user.firstname?.[0]}{user.lastname?.[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{user.username}</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={bodyText}>{post.content}</p>
                      {post.postImageUrl && (
                        <img src={post.postImageUrl} alt="Post"
                          className="mt-4 rounded-lg max-w-full h-auto" />
                      )}
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span>❤️ {post.likesCount} likes</span>
                        <span>💬 {post.commentsCount} comments</span>
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

export default Profile