import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { pageBackground, pageWrapper, cardClass, headingClass, bodyText, secondaryBtn } from '../styles/common'


const FollowButton = ({ targetId, setUser, currentUser }) => {
  const [following, setFollowing] = useState(false)


useEffect(() => {
  const check = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${targetId}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        // check if currentUser is in their followers list
        const isFollowing = data.payload?.followers?.some(
          id => id?.toString() === currentUser?._id?.toString()
        )
        setFollowing(isFollowing)
      }
    } catch (err) { console.error(err) }
  }
  if (targetId && currentUser) check()
}, [targetId, currentUser?._id])
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    if (loading) return
    setLoading(true)
    try {
      const endpoint = following ? 'unfollow' : 'follow'
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${targetId}/${endpoint}`, {
        method: 'PUT', credentials: 'include',
      })
      if (res.ok) {
        setFollowing(prev => !prev)
        setUser(prev => {
         if (!prev) return prev
         const followers = following
          ? prev.followers.filter(id => id?.toString() !== currentUser?._id?.toString())
           : [...(prev.followers || []), currentUser?._id]
         return { ...prev, followers }
        })
    }
      else { const d = await res.json(); console.error(d.message) }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      style={{
        background: following ? 'transparent' : 'var(--cur-accent)',
        color: following ? 'var(--cur-text)' : '#fff',
        border: `1px solid var(--cur-accent)`,
        padding: '8px 20px', borderRadius: 999,
        fontSize: 14, fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      {loading ? '...' : following ? 'Following' : 'Follow'}
    </button>
  )
}



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

  
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ bio: '', password: '' })
  const [editImage, setEditImage] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => {
    if (!targetId) return
    fetchPosts()
    if (!isOwnProfile) fetchUser()
    else { setUser(currentUser); setLoading(false) }
  }, [targetId])

  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.payload)
      }
    } catch (err) { console.error(err) }
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/user/${targetId}`, { credentials: 'include' })
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
  

  
  const handleEditSubmit = async () => {
  setEditLoading(true)
  setEditError('')
  try {
    const formData = new FormData()
    if (editForm.bio) formData.append('bio', editForm.bio)
    if (editForm.interests) formData.append('interests', JSON.stringify(editForm.interests))
    if (editForm.password) formData.append('password', editForm.password)
    if (editImage) formData.append('image', editImage)

    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/edit-profile`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    })
    const data = await res.json()
    if (res.ok) {
      setUser(prev => ({ ...prev, ...data.payload }))
      setShowEditModal(false)
      setEditImage(null)
      setEditPreview(null)
    } else {
      setEditError(data.message || 'Update failed')
    }
  } catch (err) {
    setEditError('Something went wrong')
  } finally {
    setEditLoading(false)
  }
}
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
              <h1 style={{fontSize:24, fontWeight:700, color:'var(--cur-text)'}}>{user.firstname} {user.lastname}</h1>
                <p style={{color:'var(--cur-muted)', marginTop:4}}>@{user.username}</p>
              {user.bio && <p className={`${bodyText} mt-2`}>{user.bio}</p>}
              <div className="flex gap-4 mt-4">
                <span className={bodyText}><strong>{user.followers?.length || 0}</strong> Followers</span>
                <span className={bodyText}><strong>{user.following?.length || 0}</strong> Following</span>
                <span className={bodyText}><strong>{posts.length}</strong> Posts</span>
              </div>
            </div>
            
            {isOwnProfile ? (
                <div className="flex flex-col gap-2">
               <button onClick={() => setShowEditModal(true)} className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition">Edit Profile</button>
               <button onClick={handleLogout} className={secondaryBtn}>Logout</button>
             </div>
            ) : (
              <FollowButton targetId={userId} setUser={setUser} currentUser={currentUser} /> 
            )}
          </div>
        </div>

        {/* Posts */}
        <div>
          <h2 style={{fontSize:20, fontWeight:700, color:'var(--cur-text)', marginBottom:24}}>{isOwnProfile ? 'Your Posts' : `${user.username}'s Posts`}</h2>

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

    
      {showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
      {editError && <p className="text-red-500 text-sm mb-3">{editError}</p>}

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 mb-2">
          {editPreview
            ? <img src={editPreview} className="w-full h-full object-cover" />
            : user.profileImageUrl
              ? <img src={user.profileImageUrl} className="w-full h-full object-cover" />
              : <span className="flex items-center justify-center h-full text-xl font-bold text-gray-600">{user.firstname?.[0]}</span>
          }
        </div>
        <label className="cursor-pointer text-sm text-blue-600 hover:underline">
          Change Photo
          <input type="file" accept="image/*" className="hidden" onChange={e => {
            const f = e.target.files[0]
            if (f) { setEditImage(f); setEditPreview(URL.createObjectURL(f)) }
          }} />
        </label>
      </div>

      {/* Bio */}
      <textarea
        placeholder={user.bio || 'Update your bio...'}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 resize-none outline-none focus:border-black"
        rows={3}
        onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="New password (leave blank to keep)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-black"
        onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))}
      />

      {/* Interests */}
      <div className="mb-4">
       <p style={{fontSize:13, color:'var(--cur-muted)', marginBottom:8}}>Interests</p>
       <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
       {['Music','Tech','Sports','Art','Gaming','Food','Travel','Fashion','Finance','Health'].map(interest => {
      const selected = (editForm.interests || user.interests || []).includes(interest)
      return (
        <button
          key={interest}
          type="button"
          onClick={() => {
            const current = editForm.interests || user.interests || []
            const updated = selected
              ? current.filter(i => i !== interest)
              : [...current, interest]
            setEditForm(p => ({ ...p, interests: updated }))
          }}
          style={{
            padding:'6px 14px', borderRadius:999, fontSize:13,
            border: `1px solid ${selected ? 'var(--cur-accent)' : 'var(--cur-border)'}`,
            background: selected ? 'var(--cur-accent)' : 'transparent',
            color: selected ? '#fff' : 'var(--cur-text)',
            cursor:'pointer', transition:'all 0.2s'
          }}
        >
          {interest}
        </button>
      )
    })}
  </div>
</div>

      <div className="flex gap-3">
        <button onClick={() => setShowEditModal(false)}
          className="flex-1 border border-gray-300 text-sm py-2 rounded-full hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={handleEditSubmit} disabled={editLoading}
          className="flex-1 bg-black text-white text-sm py-2 rounded-full hover:bg-gray-800">
          {editLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  </div>
  )}
    </div>
  )
}

export default UserProfile