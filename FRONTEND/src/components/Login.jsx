import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { API_URL } from '../../config.js'
import {
  pageBackground,
  pageWrapper,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  loadingClass,
  bodyText,
  errorClass,
  linkClass,
} from '../styles/common'
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from '../store/authStore'   // lowercase 'store' — keep consistent
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const { login, googleLogin, currentUser, loading, error, isAuthenticated } = useAuth()

  const onUserLogin = (userCredObj) => {
    login(userCredObj)
  }

  // navigate after successful login
  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/user-profile")
    }
  }, [isAuthenticated, navigate])

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential)
    if (result?.success) {
      navigate("/user-profile")
    }
  }

  if (loading) {
    return <p className={loadingClass}>Loading...</p>
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <div className={formCard}>

          <h1 className={formTitle}>Welcome Back</h1>

          <p className={`${bodyText} text-center mb-8`}>
            Login to continue to your social experience.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onUserLogin)}>

            {/* Email */}
            <div className={formGroup}>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={inputClass}
                {...register("email", {
                  required: "Email is required",
                  validate: (v) => v.trim().length > 0 || "Email cannot be empty",
                })}
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className={formGroup}>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className={inputClass}
                {...register("password", {
                  required: "Password is required",
                  validate: (v) => v.trim().length > 0 || "Password cannot be empty",
                })}
              />
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>

            <button type="submit" className={submitBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 border-t border-[#e8e8ed]" />
            <span className="text-xs text-[#a1a1a6]">OR</span>
            <div className="flex-1 border-t border-[#e8e8ed]" />
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          </div>

          {/* Footer */}
          <p className={`${bodyText} text-center text-sm mt-8`}>
            Don't have an account?{' '}
            <NavLink to="/register" className={linkClass}>Register</NavLink>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login