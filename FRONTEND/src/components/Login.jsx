import React, { useState } from 'react'
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
import { NavLink } from 'react-router-dom'
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(formData)

    // API CALL HERE
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        
        <div className={formCard}>
          
          {/* Title */}
          <h1 className={formTitle}>
            Welcome Back
          </h1>

          <p className={`${bodyText} text-center mb-8`}>
            Login to continue to your social experience.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className={formGroup}>
              <label className={labelClass}>
                Email Address
              </label>

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

            {/* Password */}
            <div className={formGroup}>
              <label className={labelClass}>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className={inputClass}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={submitBtn}
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 border-t border-[#e8e8ed]" />
            <span className="text-xs text-[#a1a1a6]">
              OR
            </span>
            <div className="flex-1 border-t border-[#e8e8ed]" />
          </div>

          {/* Social Login */}
          <button className={`${secondaryBtn} w-full`}>
            Continue with Google
          </button>

          {/* Footer */}
          <p className={`${bodyText} text-center text-sm mt-8`}>
            Don’t have an account?{' '}
            <span className="text-[#0066cc] cursor-pointer hover:text-[#004499]">
              <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login