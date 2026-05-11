import React from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../store/authStore"
import Notifications from "./Notifications"
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
  primaryBtn,
  secondaryBtn,
} from "../styles/common"

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>

        {/* Logo */}
        <NavLink to="/" className={navBrandClass}>
          SocialMediaPlatform
        </NavLink>

        {/* Nav Links */}
        <div className={navLinksClass}>
          <NavLink to="/"
            className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
            Home
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/feed"
                className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                Feed
              </NavLink>
              <NavLink to="/create-post"
                className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                + Post
              </NavLink>
              <NavLink to="/user-profile"
                className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                Profile
              </NavLink>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* 🔔 Bell icon */}
              <Notifications />

              <span className="text-sm text-gray-700">
                Welcome, {currentUser?.firstname}
              </span>
              <button onClick={handleLogout} className={secondaryBtn}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className={secondaryBtn}>Login</NavLink>
              <NavLink to="/register" className={primaryBtn}>Sign Up</NavLink>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Header