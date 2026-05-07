import React from 'react'
import { NavLink } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
  primaryBtn,
  secondaryBtn,
} from '../styles/common'

const Header = () => {
  const { user, logout } = useUser()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
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
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? navLinkActiveClass : navLinkClass
            }
          >
            Home
          </NavLink>

          {user && (
            <NavLink
              to="/user-profile"
              className={({ isActive }) =>
                isActive ? navLinkActiveClass : navLinkClass
              }
            >
              Profile
            </NavLink>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">
                Welcome, {user.firstname}
              </span>
              <button
                onClick={handleLogout}
                className={secondaryBtn}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className={secondaryBtn}>
                Login
              </NavLink>
              <NavLink to="/register" className={primaryBtn}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header