import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import {
  pageBackground,
  pageWrapper,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  bodyText,
  secondaryBtn,
  linkClass,
} from '../styles/common'
import { useAuth } from '../Store/authStore'

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    bio: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await register(formData)

    if (result.success) {
      setSuccess('Account created successfully. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } else {
      setError(result.message || 'Registration failed. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <div className={formCard}>
          <h1 className={formTitle}>Create your account</h1>
          <p className={`${bodyText} text-center mb-8`}>
            Sign up to start sharing and connecting with people.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={formGroup}>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                name="firstname"
                placeholder="Enter first name"
                className={inputClass}
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                name="lastname"
                placeholder="Enter last name"
                className={inputClass}
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                className={inputClass}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className={inputClass}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Choose a password"
                className={inputClass}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Bio</label>
              <textarea
                name="bio"
                placeholder="Tell people about yourself"
                className={`${inputClass} min-h-25 resize-none`}
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className={`${bodyText} text-center text-sm mt-8`}>
            Already have an account?{' '}
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register