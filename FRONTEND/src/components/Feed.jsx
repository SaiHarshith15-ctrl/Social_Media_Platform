import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { cardClass, bodyText } from '../styles/common'
import Sidebar from '../components/Sidebar'

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)
const LikeIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
)
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

// ── Single Post Card ──────────────────────────────────────────────────────────
const PostCard = ({ post, currentUser, onDelete }) => {
  const navigate = useNavigate()

  const [comments, setComments]         = useState(post.comments || [])
  const [commentText, setCommentText]   = useState('')
  const [showComments, setShowComments] = useState(false)
  const [likesCount, setLikesCount]     = useState(post.likesCount || 0)
  const [liked, setLiked]               = useState(
    post.likes?.some(id => (id?._id || id)?.toString() === currentUser?._id?.toString())
  )
  const [following, setFollowing] = useState(
    currentUser?.following?.some(id => id?.toString() === post.user?._id?.toString())
  )
  const [loadingLike, setLoadingLike]       = useState(false)
  const [loadingFollow, setLoadingFollow]   = useState(false)
  const [loadingComment, setLoadingComment] = useState(false)

  const author  = post.user
  const isOwner = author?._id?.toString() === currentUser?._id?.toString()

  const handleLike = async () => {
    if (loadingLike) return
    setLoadingLike(true)
    try {
      const res = await fetch(`http://localhost:3000/likes/${post._id}`, {
        method: 'PUT', credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setLikesCount(data.likesCount)
        setLiked(prev => !prev)
      }
    } catch (err) { console.error(err) }
    finally { setLoadingLike(false) }
  }

  const handleFollow = async () => {
    if (loadingFollow) return
    setLoadingFollow(true)
    try {
      const endpoint = following ? 'unfollow' : 'follow'
      const res = await fetch(`http://localhost:3000/user/${author._id}/${endpoint}`, {
        method: 'PUT', credentials: 'include',
      })
      if (res.ok) {
        setFollowing(prev => !prev)
      } else {
        const data = await res.json()
        console.error('Follow error:', data.message)
      }
    } catch (err) { console.error(err) }
    finally { setLoadingFollow(false) }
  }

  const handleAddComment = async () => {
    if (!commentText.trim() || loadingComment) return
    setLoadingComment(true)
    try {
      const res = await fetch(`http://localhost:3000/posts/${post._id}`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText }),
      })
      if (res.ok) {
        setComments(prev => [...prev, {
          _id: Date.now(), comment: commentText,
          user: { username: currentUser?.username, profileImageUrl: currentUser?.profileImageUrl },
        }])
        setCommentText('')
      }
    } catch (err) { console.error(err) }
    finally { setLoadingComment(false) }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      const res = await fetch(`http://localhost:3000/posts/${post._id}`, {
        method: 'DELETE', credentials: 'include',
      })
      if (res.ok) onDelete(post._id)
      else { const d = await res.json(); alert(d.message || 'Failed to delete') }
    } catch (err) { alert('Error deleting post') }
  }

  const goToProfile = () => {
    if (isOwner) navigate('/user-profile')
    else navigate(`/profile/${author?._id}`)
  }

  return (
    <div className={`${cardClass} flex gap-6`}>
      <div className="flex-1 min-w-0">

        {/* Author row */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={goToProfile} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shrink-0">
              {author?.profileImageUrl
                ? <img src={author.profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-xs font-bold text-gray-600">{author?.username?.[0]?.toUpperCase()}</span>
              }
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">{author?.username}</p>
              <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {!isOwner && (
              <button
                onClick={handleFollow}
                disabled={loadingFollow}
                className={`text-sm font-medium px-3 py-1 rounded-full border transition ${
                  following
                    ? 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500'
                    : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {loadingFollow ? '...' : following ? 'Following' : 'Follow'}
              </button>
            )}
            {isOwner && (
              <button onClick={handleDelete} className="text-red-400 hover:text-red-600 transition" title="Delete post">
                <TrashIcon />
              </button>
            )}
          </div>
        </div>

        <p className={`${bodyText} mb-3`}>{post.content}</p>
        {post.postImageUrl && (
          <img src={post.postImageUrl} alt="post" className="w-full rounded-lg max-h-80 object-cover mb-3" />
        )}

        <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
          <button onClick={handleLike} disabled={loadingLike}
            className={`flex items-center gap-1.5 transition hover:text-blue-600 ${liked ? 'text-blue-600 font-semibold' : ''}`}>
            <LikeIcon filled={liked} /> {likesCount}
          </button>
          <button onClick={() => setShowComments(prev => !prev)}
            className="flex items-center gap-1.5 transition hover:text-blue-600">
            <ChatIcon /> {comments.length}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="w-64 shrink-0 border-l border-gray-200 pl-4 flex flex-col">
          <p className="font-semibold text-sm mb-3">Comments</p>
          <div className="flex-1 overflow-y-auto max-h-52 space-y-2 mb-3">
            {comments.length === 0
              ? <p className="text-xs text-gray-400">No comments yet.</p>
              : comments.map(c => (
                <div key={c._id} className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                    {c.user?.profileImageUrl
                      ? <img src={c.user.profileImageUrl} alt="u" className="w-full h-full object-cover" />
                      : <span className="text-xs font-bold text-gray-500">{c.user?.username?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div className="bg-gray-100 rounded-lg px-2 py-1 text-xs flex-1">
                    <span className="font-semibold">{c.user?.username} </span>{c.comment}
                  </div>
                </div>
              ))
            }
          </div>
          <div className="flex items-center gap-2">
            <input type="text" value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              placeholder="Comment here"
              className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-xs outline-none focus:border-blue-400" />
            <button onClick={handleAddComment} disabled={loadingComment} className="text-blue-600 hover:text-blue-800">
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Feed Page ─────────────────────────────────────────────────────────────────
const Feed = () => {
  const { currentUser } = useAuth()
  const navigate        = useNavigate()
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => { fetchPosts(1) }, [])

  const fetchPosts = async (pageNum) => {
    try {
      const res = await fetch(`http://localhost:3000/posts/?page=${pageNum}&limit=10`, { credentials: 'include' })
      if (res.ok) {
        const data    = await res.json()
        const fetched = data.posts || []
        pageNum === 1 ? setPosts(fetched) : setPosts(prev => [...prev, ...fetched])
        if (fetched.length < 10) setHasMore(false)
        setPage(pageNum)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p._id !== id))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* MAIN */}
      <main style={{marginLeft:200, marginRight:200 , flex:1, padding:'16px 32px'}}>
       <div style={{maxWidth:680, margin:'0 auto'}}></div>
        <div style={{maxWidth:680, margin:'0 auto'}}></div>
        <div className="flex items-center justify-between mb-6">
          <h1 style={{fontSize:20, fontWeight:700, color:'var(--cur-text)'}}>New Posts</h1>
          <button onClick={() => navigate('/create-post')}
            className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition">
            <PlusIcon /> New Post
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className={`${cardClass} text-center py-16`}>
            <p className={bodyText}>No posts yet. Be the first!</p>
            <button onClick={() => navigate('/create-post')}
              className="mt-4 bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition">
              Create Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} currentUser={currentUser} onDelete={handleDelete} />
            ))}
            {hasMore && (
              <div className="text-center pt-4">
                <button onClick={() => fetchPosts(page + 1)} className="text-sm text-blue-600 hover:underline">
                  Load more
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Feed