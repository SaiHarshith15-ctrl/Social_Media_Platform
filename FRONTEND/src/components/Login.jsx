import React, { useState } from 'react'
import { useForm } from "react-hook-form";
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
  secondaryBtn,
  errorClass,
  linkClass,
} from '../styles/common'
import { NavLink, useNavigate } from "react-router";
import { useAuth } from '../store/authStore';
import { useEffect } from "react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  
  const {login,currentUser,loading,error,isAuthenticated}=useAuth((state)=>state)
  const onUserLogin = (userCredObj) => {
    console.log(userCredObj);
    login(userCredObj)
  };
  console.log("Current User: ",currentUser)
  useEffect(()=>{
    // navigation logic
    if(isAuthenticated===true){
        navigate("/user-profile")
    }
  },[isAuthenticated,navigate])
  
  if(loading){
    return <p className={loadingClass}>Loading...</p>
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onUserLogin)}>
            
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
                {...register("email", {
                required: "Email is required",
                validate: (value) => value.trim().length > 0 || "Email cannot be empty",
              })}
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
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
                {...register("password", {
                required: "Password is required",
                validate: (value) => value.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={submitBtn}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
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