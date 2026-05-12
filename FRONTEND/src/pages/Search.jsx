import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    const val = e.target.value
    setQuery(val)
    if (!val.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/user/search/${val}`, { credentials: 'include' })
      const data = await res.json()
      setResults(data.payload || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-20 flex-1 max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-4">Search People</h1>
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search by username..."
          className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-black mb-6"
        />
        {loading && <p className="text-sm text-gray-400">Searching...</p>}
        <div className="space-y-3">
          {results.map(user => (
            <div key={user._id}
              onClick={() => navigate(`/profile/${user._id}`)}
              className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                {user.profileImageUrl
                  ? <img src={user.profileImageUrl} className="w-full h-full object-cover" />
                  : <span className="text-sm font-bold text-gray-600">{user.username?.[0]?.toUpperCase()}</span>
                }
              </div>
              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">{user.firstname} {user.lastname}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Search