import React from 'react'
import { NavLink } from "react-router";
import {
  pageBackground,
  pageWrapper,
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
  pageTitleClass,
  bodyText,
  primaryBtn,
  secondaryBtn,
  cardClass,
  headingClass,
  section,
} from '../styles/common'

const Home = () => {
  return (
    <div className={pageBackground}>
      
      {/* Navbar */}
      <nav className={navbarClass}>
        <div className={navContainerClass}>
          
          {/* Logo */}
          <h1 className={navBrandClass}>
            SocialMediaPlatform
          </h1>

          {/* Nav Links */}
          <div className={navLinksClass}>
            <a href="#" className={navLinkActiveClass}>
              Home
            </a>

            <a href="#" className={navLinkClass}>
              Explore
            </a>

            <a href="#" className={navLinkClass}>
              Notifications
            </a>

            <a href="#" className={navLinkClass}>
              Profile
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button className={secondaryBtn}>
              <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                  >
                    Login
                </NavLink>
            </button>

            <button className={primaryBtn}>
              <NavLink 
              to="/register">

              Sign Up
              </NavLink>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={pageWrapper}>
        
        {/* Hero Section */}
        <section className={`${section} text-center`}>
          
          <h1 className={`${pageTitleClass} max-w-4xl mx-auto`}>
            Connect, share and discover conversations that matter.
          </h1>

          <p className={`${bodyText} mt-6 max-w-2xl mx-auto text-lg`}>
            A modern social media platform inspired by Twitter and Threads.
            Follow people, create posts, interact with communities and stay connected.
          </p>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button className={primaryBtn}>
              Get Started
            </button>

            <button className={secondaryBtn}>
              Learn More
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className={cardClass}>
            <h2 className={headingClass}>
              Create Posts
            </h2>

            <p className={`${bodyText} mt-3`}>
              Share thoughts, images and updates instantly with your followers.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={headingClass}>
              Follow Friends
            </h2>

            <p className={`${bodyText} mt-3`}>
              Build your own network and stay updated with the people you care about.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={headingClass}>
              Like & Comment
            </h2>

            <p className={`${bodyText} mt-3`}>
              Engage in conversations through likes, comments and interactions.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home