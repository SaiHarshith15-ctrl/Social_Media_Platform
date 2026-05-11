import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import {
  pageBackground,
  pageWrapper,
  cardClass,
  headingClass,
  bodyText,
  inputClass,
  submitBtn,
  secondaryBtn,
} from '../styles/common'

const CreatePost = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [content, setContent]   = useState('')
  const [image, setImage]       = useState(null)
  const [preview, setPreview]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('Post content cannot be empty.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('content', content)
      if (image) formData.append('image', image)

      const res = await fetch('http://localhost:3000/posts/post', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        navigate('/feed')
      } else {
        setError(data.message || 'Failed to create post.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <div className="max-w-2xl mx-auto">

          <h1 className={`${headingClass} mb-6`}>Create a Post</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className={cardClass}>
            {/* User info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                {currentUser?.profileImageUrl ? (
                  <img src={currentUser.profileImageUrl} alt="avatar"
                    className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-gray-600">
                    {currentUser?.firstname?.[0]}{currentUser?.lastname?.[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {currentUser?.firstname} {currentUser?.lastname}
                </p>
                <p className="text-xs text-gray-500">@{currentUser?.username}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Content */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={5}
                className={`${inputClass} resize-none w-full mb-4`}
              />

              {/* Image preview */}
              {preview && (
                <div className="relative mb-4">
                  <img src={preview} alt="preview"
                    className="w-full rounded-lg max-h-72 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setPreview(null) }}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Actions row */}
              <div className="flex items-center justify-between mt-2">
                {/* Image upload */}
                <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Image
                  <input type="file" accept="image/*" className="hidden"
                    onChange={handleImageChange} />
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/feed')}
                    className={secondaryBtn}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={submitBtn} disabled={loading}>
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreatePost