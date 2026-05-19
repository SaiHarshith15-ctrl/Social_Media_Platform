import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import Sidebar from '../components/Sidebar'
import { cardClass, bodyText } from '../styles/common'
import { API_URL } from '../../config.js'
// use API_URL instead of import.meta.env.VITE_API_URL

const INTERESTS = ['Music','Tech','Sports','Art','Gaming','Food','Travel','Fashion','Finance','Health']

const Search = () => {
  const [query, setQuery] = useState('')
  const [userResults, setUserResults] = useState([])
  const [posts, setPosts] = useState([])
  const [activeInterest, setActiveInterest] = useState('All')
  const [searching, setSearching] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  // Load interest-based posts on mount using user's own interests
  useEffect(() => {
    fetchInterestPosts(currentUser?.interests || [])
  }, [])

  const fetchInterestPosts = async (interests) => {
    setLoadingPosts(true)
    try {
      const q = interests.length > 0 ? `?interests=${interests.join(',')}` : ''
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/by-interests${q}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      }
    } catch (err) { console.error(err) }
    finally { setLoadingPosts(false) }
  }

  const handleSearch = async (e) => {
    const val = e.target.value
    setQuery(val)
    if (!val.trim()) { setUserResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`${API_URL}/user/search/${val}`, { credentials: 'include' })
      const data = await res.json()
      setUserResults(data.payload || [])
    } catch (err) { console.error(err) }
    finally { setSearching(false) }
  }

  const handleInterestFilter = (interest) => {
    setActiveInterest(interest)
    if (interest === 'All') {
      fetchInterestPosts(currentUser?.interests || [])
    } else {
      fetchInterestPosts([interest])
    }
  }

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'var(--cur-bg)'}}>
      <Sidebar />
      <main style={{marginLeft:80, flex:1, maxWidth:680, margin:'0 auto', padding:'32px 16px 32px 96px'}}>
        
        {/* Search bar */}
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search people by username..."
          style={{
            width:'100%', padding:'12px 18px', borderRadius:999,
            border:'1px solid var(--cur-border)',
            background:'var(--cur-card)', color:'var(--cur-text)',
            fontSize:14, outline:'none', marginBottom:20
          }}
        />

        {/* User results */}
        {query && (
          <div style={{marginBottom:24}}>
            {searching && <p style={{color:'var(--cur-muted)', fontSize:13}}>Searching...</p>}
            {userResults.map(user => (
              <div key={user._id}
                onClick={() => navigate(`/profile/${user._id}`)}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  background:'var(--cur-card)', padding:'12px 16px',
                  borderRadius:14, marginBottom:8, cursor:'pointer',
                  border:'1px solid var(--cur-border)'
                }}>
                <div style={{width:40, height:40, borderRadius:'50%', background:'var(--cur-muted)',
                  overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                  {user.profileImageUrl
                    ? <img src={user.profileImageUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                    : <span style={{fontWeight:'bold', color:'var(--cur-text)'}}>{user.username?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div>
                  <p style={{fontWeight:600, fontSize:14, color:'var(--cur-text)'}}>{user.username}</p>
                  <p style={{fontSize:12, color:'var(--cur-muted)'}}>{user.firstname} {user.lastname}</p>
                </div>
              </div>
            ))}
            {!searching && userResults.length === 0 && (
              <p style={{color:'var(--cur-muted)', fontSize:13}}>No users found.</p>
            )}
          </div>
        )}

        {/* Interest filter pills */}
        {!query && (
          <>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:20}}>
              {['All', ...INTERESTS].map(interest => (
                <button key={interest} onClick={() => handleInterestFilter(interest)}
                  style={{
                    padding:'6px 16px', borderRadius:999, fontSize:13, cursor:'pointer',
                    border:`1px solid ${activeInterest === interest ? 'var(--cur-accent)' : 'var(--cur-border)'}`,
                    background: activeInterest === interest ? 'var(--cur-accent)' : 'transparent',
                    color: activeInterest === interest ? '#fff' : 'var(--cur-text)',
                    transition:'all 0.2s'
                  }}>
                  {interest}
                </button>
              ))}
            </div>

            {/* Posts feed */}
            {loadingPosts ? (
              <p style={{color:'var(--cur-muted)', textAlign:'center', padding:40}}>Loading...</p>
            ) : posts.length === 0 ? (
              <div style={{textAlign:'center', padding:40}}>
                <p style={{color:'var(--cur-muted)'}}>No posts for these interests yet.</p>
                <p style={{color:'var(--cur-muted)', fontSize:13, marginTop:8}}>
                  Update your interests in your profile to see relevant posts here.
                </p>
              </div>
            ) : posts.map(post => (
              <div key={post._id} style={{
                background:'var(--cur-card)', border:'1px solid var(--cur-border)',
                borderRadius:16, padding:20, marginBottom:12
              }}>
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
                  <div style={{width:36, height:36, borderRadius:'50%', background:'var(--cur-muted)',
                    overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {post.user?.profileImageUrl
                      ? <img src={post.user.profileImageUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      : <span style={{fontWeight:'bold', fontSize:13, color:'var(--cur-text)'}}>{post.user?.username?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <p style={{fontWeight:600, fontSize:13, color:'var(--cur-text)'}}>{post.user?.username}</p>
                    <p style={{fontSize:11, color:'var(--cur-muted)'}}>{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  {post.category && (
                    <span style={{
                      marginLeft:'auto', fontSize:11, padding:'3px 10px',
                      borderRadius:999, background:'var(--cur-accent)', color:'#fff'
                    }}>{post.category}</span>
                  )}
                </div>
                <p style={{fontSize:14, color:'var(--cur-text)', lineHeight:1.6}}>{post.content}</p>
                {post.postImageUrl && (
                  <img src={post.postImageUrl} style={{width:'100%', borderRadius:10, marginTop:10, maxHeight:280, objectFit:'cover'}} />
                )}
                <div style={{display:'flex', gap:16, marginTop:10, fontSize:13, color:'var(--cur-muted)'}}>
                  <span>❤️ {post.likesCount}</span>
                  <span>💬 {post.commentsCount}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  )
}

export default Search